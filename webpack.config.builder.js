const fs = require('fs');
const path = require('path');

const glob = require('glob');
const rimraf = require('rimraf');
const { filter } = require('rxjs/operators');

const { Architect } = require('@angular-devkit/architect');
const {
  basename,
  dirname,
  experimental,
  extname,
  getSystemPath,
  isAbsolute,
  join,
  logging,
  normalize,
  relative,
  resolve,
  terminal,
  virtualFs
} = require('@angular-devkit/core');
const { NodeJsSyncHost, resolve: nodeResolve } = require('@angular-devkit/core/node');


class NgConfigBuilder {
  constructor(dappPath, embarkPath) {
    this.dappPath = dappPath || process.env.DAPP_PATH;
    this.embarkPath = embarkPath || process.env.EMBARK_PATH;

    this.embarkAliases = require(path.join(this.dappPath, '.embark/embark-aliases.json'));
    this.embarkAssets = require(path.join(this.dappPath, '.embark/embark-assets.json'));
    this.embarkNodeModules = path.join(this.embarkPath, 'node_modules');
    this.embarkJson = require(path.join(this.dappPath, 'embark.json'));

    this.buildDir = path.join(this.dappPath, this.embarkJson.buildDir);

    // it's important to `embark reset` if a pkg version is specified in
    // embark.json and changed/removed later, otherwise pkg resolution may behave
    // unexpectedly
    try {
      this.versions = glob.sync(path.join(this.dappPath, '.embark/versions/*/*'));
    } catch (e) {
      this.versions = [];
    }

    this.logger = new logging.IndentLogger('cling');
    this.loggingSubscription = initializeLogging(this.logger);

    this.workspace = getWorkspace('angular.json');

    if (!this.workspace) {
      throw new Error('Angular workspace cannot be resolved');
    }

    this.architect = new Architect(this.workspace);
  }

  build(targetSpec) {
    targetSpec = makeTargetSpecifier(targetSpec);

    const building = prepareBuilder(this.architect, targetSpec, this.logger);

    const validation = validateConfigCoercion(this, building);

    if (!validation.result) {
      throw new Error('Cohercion between embark and angular configs failed.\n* ' + validation.errors.join('\n* '));
    }

    const webpackConfig = buildWebpackConfig(building);

    if (targetSpec.configuration === 'production') {
      webpackConfig.mode = 'production';
      webpackConfig.name = 'production';
    } else {
      webpackConfig.devtool = 'source-map';
      webpackConfig.mode = 'development';
      // alternatively:
      // development.mode = 'none';
      webpackConfig.name = 'development';
    }

    // remove "node: false" defined by webpack config browser model
    delete webpackConfig.node;

    // add custom extensions
    webpackConfig.resolve.extensions.push('.wasm');

    // profiling and generating verbose stats increases build time; if stats
    // are generated embark will write the output to:
    //   path.join(dappPath, '.embark/stats.[json,report]')
    // to visualize the stats info in a browser run:
    //   npx webpack-bundle-analyzer .embark/stats.json <buildDir>
    if (building.builderConfig.options.statsJson) {
      webpackConfig.profile = true;
      webpackConfig.stats = 'verbose';
    }

    // add embark aliases
    Object.assign(webpackConfig.resolve.alias, this.embarkAliases);

    // add embark modules for module resolution
    webpackConfig.resolve.modules.unshift(...this.versions);
    webpackConfig.resolve.modules.push(this.embarkNodeModules);

    // add embark modules for loader resolution
    webpackConfig.resolveLoader.modules.push(this.embarkNodeModules);

    return webpackConfig;
  }
}


function buildWebpackConfig({ builder, builderConfig, context }) {
  const options = builderConfig.options;
  const root = context.workspace.root;
  const projectRoot = resolve(root, builderConfig.root);
  const host = new virtualFs.AliasHost(context.host);

  if (options.deleteOutputPath) {
    deleteOutputDir(root, normalize(options.outputPath), context.host);
  }

  if (options.fileReplacements) {
    options.fileReplacements = normalizeFileReplacements(options.fileReplacements, host, root);
  }

  if (options.assets) {
    options.assets = normalizeAssetPatterns(options.assets, host, root, projectRoot, builderConfig.sourceRoot);
  }

  const webpackConfig = builder.buildWebpackConfig(root, projectRoot, host, options);

  if (webpackConfig.optimization
    && webpackConfig.optimization.splitChunks
    && webpackConfig.optimization.splitChunks.cacheGroups
  ) {
    Object.keys(webpackConfig.optimization.splitChunks.cacheGroups).forEach(key => {
      if (webpackConfig.optimization.splitChunks.cacheGroups[key] === undefined) {
        // remove cacheGroups key with undefined value
        delete webpackConfig.optimization.splitChunks.cacheGroups[key];
      }
    });
  }

  return webpackConfig;
}

function deleteOutputDir(root, outputPath, host) {
  const resolvedOutputPath = resolve(root, outputPath);
  if (resolvedOutputPath === root) {
    throw new Error('Output path MUST not be project root directory!');
  }

  console.log(`rimraf("${resolvedOutputPath}")`);
  // rimraf(resolvedOutputPath);
}

function findUp(names, from) {
  if (!Array.isArray(names)) {
      names = [names];
  }

  const root = path.parse(from).root;
  let currentDir = from;

  while (currentDir && currentDir !== root) {
    for (const name of names) {
      const p = path.join(currentDir, name);

      if (fs.existsSync(p)) {
        return p;
      }
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
}

function getWorkspace(configNames, projectPath) {
  const configPath = projectFilePath(configNames, projectPath);

  if (!configPath) {
    return null;
  }

  const root = normalize(path.dirname(configPath));
  const file = normalize(path.basename(configPath));
  const workspace = new experimental.workspace.Workspace(root, new NodeJsSyncHost());

  workspace.loadWorkspaceFromHost(file).subscribe();

  return workspace;
}

function makeTargetSpecifier(targetSpec) {
  const [ project, target, configuration ] = targetSpec.split(':');

  return {
    project,
    target,
    configuration
  };
}

function projectFilePath(configNames, projectPath) {
  // Find the configuration, either where specified, in the Angular CLI project
  // (if it's in node_modules) or from the current process.
  return (projectPath && findUp(configNames, projectPath))
    || findUp(configNames, process.cwd())
    || findUp(configNames, __dirname);
}

function initializeLogging(logger) {
  return logger
    .pipe(filter(entry => (entry.level != 'debug')))
    .subscribe(entry => {
      let color = (x) => terminal.dim(terminal.white(x));
      let output = process.stdout;
      switch (entry.level) {
        case 'info':
          color = terminal.white;
          break;
        case 'warn':
          color = terminal.yellow;
          break;
        case 'error':
          color = terminal.red;
          output = process.stderr;
          break;
        case 'fatal':
          color = (x) => terminal.bold(terminal.red(x));
          output = process.stderr;
          break;
      }

      // If we do console.log(message) or process.stdout.write(message + '\n'), the process might
      // stop before the whole message is written and the stream is flushed. This happens when
      // streams are asynchronous.
      //
      // NodeJS IO streams are different depending on platform and usage. In POSIX environment,
      // for example, they're asynchronous when writing to a pipe, but synchronous when writing
      // to a TTY. In windows, it's the other way around. You can verify which is which with
      // stream.isTTY and platform, but this is not good enough.
      // In the async case, one should wait for the callback before sending more data or
      // continuing the process. In our case it would be rather hard to do (but not impossible).
      //
      // Instead we take the easy way out and simply chunk the message and call the write
      // function while the buffer drain itself asynchronously. With a smaller chunk size than
      // the buffer, we are mostly certain that it works. In this case, the chunk has been picked
      // as half a page size (4096/2 = 2048), minus some bytes for the color formatting.
      // On POSIX it seems the buffer is 2 pages (8192), but just to be sure (could be different
      // by platform).
      //
      // For more details, see https://nodejs.org/api/process.html#process_a_note_on_process_i_o
      const chunkSize = 2000;  // Small chunk.
      let message = entry.message;

      while (message) {
        const chunk = message.slice(0, chunkSize);
        message = message.slice(chunkSize);
        output.write(color(chunk));
      }

      output.write('\n');
    });
}

function normalizeAssetPatterns(assetPatterns, host, root, projectRoot, maybeSourceRoot) {
  // When sourceRoot is not available, we default to ${projectRoot}/src.
  const sourceRoot = maybeSourceRoot || join(projectRoot, 'src');
  const resolvedSourceRoot = resolve(root, sourceRoot);

  if (assetPatterns.length === 0) {
    return [];
  }

  return assetPatterns.map(assetPattern => {
    // Normalize string asset patterns to objects.
    if (typeof assetPattern === 'string') {
      const assetPath = normalize(assetPattern);
      const resolvedAssetPath = resolve(root, assetPath);

      // Check if the string asset is within sourceRoot.
      if (!resolvedAssetPath.startsWith(resolvedSourceRoot)) {
        throw new Error(`MissingAssetSourceRootException(${assetPattern})`);
      }

      // If the path doesn't exist at all, pretend it is a directory.
      const isDirectory = fs.existsSync(resolvedAssetPath) ? fs.lstatSync(resolvedAssetPath).isDirectory() : true;
      let glob, input, output;
      if (isDirectory) {
        // Folders get a recursive star glob.
        glob = '**/*';
        // Input directory is their original path.
        input = assetPath;
      } else {
        // Files are their own glob.
        glob = basename(assetPath);
        // Input directory is their original dirname.
        input = dirname(assetPath);
      }

      // Output directory for both is the relative path from source root to input.
      output = relative(resolvedSourceRoot, resolve(root, input));

      // Return the asset pattern in object format.
      return { glob, input, output };
    } else {
      // It's already an AssetPatternObject, no need to convert.
      return assetPattern;
    }
  });
}

function normalizeFileReplacement(fileReplacement, root) {
  const currentFormat = fileReplacement;
  const maybeOldFormat = fileReplacement;

  let replacePath;
  let withPath;
  if (maybeOldFormat.src && maybeOldFormat.replaceWith) {
    replacePath = normalize(maybeOldFormat.src);
    withPath = normalize(maybeOldFormat.replaceWith);
  } else {
    replacePath = normalize(currentFormat.replace);
    withPath = normalize(currentFormat.with);
  }

  // TODO: For 7.x should this only happen if not absolute?
  if (root) {
    replacePath = join(root, replacePath);
  }
  if (root) {
    withPath = join(root, withPath);
  }

  return { replace: replacePath, with: withPath };
}

function normalizeFileReplacements(fileReplacements, host, root) {
  if (fileReplacements.length === 0) {
    return [];
  }

  return fileReplacements
    .map(replacement => normalizeFileReplacement(replacement, root))
    .filter(normalized => fs.existsSync(normalized.replace) && fs.existsSync(normalized.with));
}

function prepareBuilder(architect, targetSpec, logger) {
  const context = {
    logger,
    architect,
    host: architect._workspace.host,
    workspace: architect._workspace
  };


  const targetMap = architect._workspace.getProjectTargets(targetSpec.project);

  architect._targetMapMap.set(targetSpec.project, targetMap);


  const builderConfig = architect.getBuilderConfiguration(targetSpec);

  const basedir = getSystemPath(context.workspace.root);
  const [ pkg, builderName ] = builderConfig.builder.split(':');
  const pkgJsonPath = nodeResolve(pkg, { basedir, resolvePackageJson: true, checkLocal: true });
  const pkgJson = require(normalize(pkgJsonPath));

  const pkgJsonBuildersentry = pkgJson['builders'];

  if (!pkgJsonBuildersentry) {
    throw new Error('BuilderCannotBeResolvedException: ' + builderConfig.builder);
  }


  let builderPaths = architect._builderPathsMap.get(builderConfig.builder);

  if (!builderPaths) {
    let buildersJsonPath = pkgJsonBuildersentry;
    if (!isAbsolute(buildersJsonPath)) {
      buildersJsonPath = join(dirname(normalize(pkgJsonPath)), pkgJsonBuildersentry);
    }

    const builderPathsMap = require(buildersJsonPath);
    builderPaths = builderPathsMap.builders[builderName];

    if (!builderPaths) {
      throw new Error('BuilderCannotBeResolvedException: ' + builderConfig.builder);
    }

    if (!isAbsolute(builderPaths.schema)) {
      builderPaths.schema = join(dirname(buildersJsonPath), builderPaths.schema);
    }
    if (!isAbsolute(builderPaths.class)) {
      builderPaths.class = join(dirname(buildersJsonPath), builderPaths.class);
    }

    architect._builderPathsMap.set(builderConfig.builder, builderPaths);
  }


  let builderDescription = architect._builderDescriptionMap.get(builderConfig.builder);

  if (!builderDescription) {
    const builderSchema = require(builderPaths.schema);

    builderDescription = {
      name: builderConfig.builder,
      schema: builderSchema,
      description: builderPaths.description
    };

    architect._builderDescriptionMap.set(builderDescription.name, builderDescription);
  }


  let builderConstructor = architect._builderConstructorMap.get(builderDescription.name);

  if (!builderConstructor) {
    builderConstructor = require(getSystemPath(builderPaths.class))['default'];

    architect._builderConstructorMap.set(builderDescription.name, builderConstructor);
  }

  const builder = new builderConstructor(context);

  return { builder, builderConfig, context };
}

function validateConfigCoercion(ngConfigBuilder, building) {
  const errors = [];

  const { buildDir, embarkAssets } = ngConfigBuilder;
  const { builderConfig, context } = building;

  const options = builderConfig.options;
  const root = context.workspace.root;
  const projectRoot = resolve(root, builderConfig.root);


  let outputPath = options.outputPath;
  if (!isAbsolute(outputPath)) {
    outputPath = resolve(projectRoot, outputPath);
  }

  if (normalize(buildDir) !== normalize(outputPath)) {
    errors.push(
      'Build option outputPath not equals embark option buildDir:\n'
      + '  embark = ' + buildDir + '\n'
      + '  angular = ' + outputPath
    );
  }


  const assetsMap = {};
  const assetsList = [];

  Object.keys(embarkAssets).forEach(key => {
    if (!assetsMap[key]) {
      assetsMap[key] = [];
    }

    embarkAssets[key].forEach(file => {
      const filePath = normalize(file.path);

      assetsMap[key].push(filePath);
      assetsList.push(filePath);
    });
  });

  const checkEmbarkEntryAndNgOption = (entryKey, optionKey) => {
    if (!assetsMap[entryKey]) {
      errors.push(`Entry ${entryKey} not exists in embark option app`);
    } else {
      const expectPath = normalize(options[optionKey]);

      if (!assetsMap[entryKey].find(x => x === expectPath)) {
        errors.push(`Build option ${optionKey} not found in embark option app: ${expectPath}`);
      }
    }
  };

  const checkEmbarkEntryAndNgOptionArray = optionKey => {
    options[optionKey].forEach(expectPath => {
      expectPath = normalize(expectPath);

      if (extname(expectPath) && !assetsList.find(x => x === expectPath)) {
        errors.push(`Build option ${optionKey} not found in embark option app: ${expectPath}`);
      }
    });
  };

  // checkEmbarkEntryAndNgOption('index.html', 'index');
  checkEmbarkEntryAndNgOption('main.js', 'main');

  if (options.polyfills) {
    checkEmbarkEntryAndNgOption('polyfills.js', 'polyfills');
  }

  checkEmbarkEntryAndNgOptionArray('assets');
  checkEmbarkEntryAndNgOptionArray('styles');
  checkEmbarkEntryAndNgOptionArray('scripts');

  return { result: !errors.length, errors };
}

exports.NgConfigBuilder = NgConfigBuilder;
