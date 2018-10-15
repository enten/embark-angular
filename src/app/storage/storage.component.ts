import { Component, Inject } from '@angular/core';

import { EMBARKJS } from '../app.tokens';

@Component({
  selector: 'app-storage',
  template: `
    <div class="mb-4">
      <h4 class="mb-3">
        Save text to storage
      </h4>
      <form (submit)="setText($event)" class="form-inline">
        <label class="sr-only" for="storage-set-text-input">
          Text
        </label>
        <input type="text" class="form-control mb-2 mr-sm-2"
          id="storage-set-text-input"
          (keyup)="handleChange($event, 'textToSave')"
          [defaultValue]="textToSave"
        />
        <button type="submit" class="btn btn-primary mb-2">
          Save Text
        </button>
      </form>
      <small class="form-text text-muted">
        generated Hash: {{ generatedHash }}
      </small>
    </div>

    <div class="mb-4">
      <h4 class="mb-3">
        Load text from storage given an hash
      </h4>
      <form (submit)="loadHash($event)" class="form-inline">
        <label class="sr-only" for="storage-get-text-input">
          Hash
        </label>
        <input type="text" class="form-control mb-2 mr-sm-2"
          id="storage-get-text-input"
          (keyup)="handleChange($event, 'loadText')"
        />
        <button type="submit" class="btn btn-primary mb-2">
          Load
        </button>
      </form>
      <small class="form-text text-muted">
        result: {{ storedText }}
      </small>
    </div>

    <div class="mb-4">
      <h4 class="mb-3">
        Upload file to storage
      </h4>
      <form (submit)="uploadFile($event)" class="form-inline">
        <label class="sr-only" for="storage-set-file-input">
          File
        </label>
        <input type="file" class="mb-2 mr-sm-2"
          id="storage-set-file-input"
          (change)="handleFileUpload($event)"
        />
        <button type="submit" class="btn btn-primary mb-2">
          Upload
        </button>
      </form>
      <small class="form-text text-muted">
        generated Hash: {{ fileHash }}
      </small>
    </div>

    <div class="mb-4">
      <h4 class="mb-3">
        Get file or image from storage
      </h4>
      <form (submit)="loadFile($event)" class="form-inline">
        <label class="sr-only" for="storage-get-file-input">
          Hash
        </label>
        <input type="text" class="form-control mb-2 mr-sm-2"
          id="storage-get-file-input"
          (keyup)="handleChange($event, 'loadText')"
        />
        <button type="submit" class="btn btn-primary mb-2">
          Download
        </button>
      </form>
      <small class="form-text text-muted">
        file available at:
        <a *ngIf="url" [href]="url" target="_blank">{{ url }}</a>
      </small>
      <small *ngIf="url" class="form-text text-muted">
        <img [src]="url" />
      </small>
    </div>

    <div *ngIf="!isIpfs()" class="alert alert-warning">
      The 2 functions below are only available with IPFS
    </div>

    <div class="mb-4">
      <h4 class="mb-3">
        Register to IPNS
      </h4>
      <form (submit)="ipnsRegister($event)" class="form-inline">
        <label class="sr-only" for="storage-set-ipns-input">
          Name
        </label>
        <input type="text" class="form-control mb-2 mr-sm-2"
          id="storage-set-ipns-input"
          (keyup)="handleChange($event, 'valueRegister')"
        />
        <button type="submit" class="btn btn-primary mb-2">
          {{ registering ? 'Registering...' : 'Register' }}
        </button>
      </form>
      <small class="form-text text-muted">
        It will take around 1 minute
      </small>
      <div *ngIf="responseRegister" class="alert alert-{{ isRegisterError ? 'danger' : 'success' }}" role="alert">
        <p>{{ responseRegister }}</p>
      </div>
    </div>

    <div class="mb-4">
      <h4 class="mb-3">
        Resolve name
      </h4>
      <form (submit)="ipnsResolve($event)" class="form-inline">
        <label class="sr-only" for="storage-get-ipns-input">
          Hash
        </label>
        <input type="text" class="form-control mb-2 mr-sm-2"
          id="storage-get-ipns-input"
          (keyup)="handleChange($event, 'valueResolver')"
        />
        <button type="submit" class="btn btn-primary mb-2">
          {{ resolving ? 'Resolving...' : 'Resolve' }}
        </button>
      </form>
      <small class="form-text text-muted">
        It will take around 1 minute
      </small>
      <div *ngIf="responseResolver" class="alert alert-{{ isResolverError ? 'danger' : 'success' }}" role="alert">
        <p>{{ responseResolver }}</p>
      </div>
    </div>

    <div class="mb-4">
      <p>Javascript calls being made:</p>
      <div class="p-2 rounded bg-dark text-monospace text-white">
        <p>EmbarkJS.Storage.setProvider('ipfs', {{ '{' }} server: 'localhost', port: '5001' {{ '}' }})</p>
        <p *ngFor="let item of logs" class="text-monospace">
          {{ item }}
        </p>
      </div>
    </div>
  `,
})
export class StorageComponent {
  textToSave = 'hello world!';
  generatedHash = '';
  loadText = '';
  storedText = '';
  fileToUpload: HTMLInputElement[] | null = null;
  fileHash = '';
  imageToDownload = '';
  url = '';
  storageError = '';
  valueRegister = '';
  valueResolver = '';
  registering = false;
  resolving = false;
  responseRegister = '';
  responseResolver = '';
  isRegisterError = false;
  isResolverError = false;
  logs: string[] = [];

  constructor(
    @Inject(EMBARKJS) readonly embarkjs: EmbarkJS,
  ) { }

  addToLog(txt: string) {
    this.logs.push(txt);
  }

  handleChange(e: Event, name: string) {
    const input = e.target as HTMLInputElement;

    this[name] = input.value;
  }

  handleFileUpload(e: Event) {
    this.fileToUpload = [ e.target as HTMLInputElement ];
  }

  setText(e: Event) {
    e.preventDefault();

    this.embarkjs.Storage.saveText(this.textToSave).then(hash => {
      this.generatedHash = hash;
      this.loadText = hash;
      this.storageError = '';
      this.addToLog(`EmbarkJS.Storage.saveText('${this.textToSave}').then(function(hash) { })`);
    }).catch(err => {
      if (err) {
        this.storageError = err.message;
        console.error(`Storage saveText Error => ${err.message}`);
      }
    });
  }

  loadHash(e: Event) {
    e.preventDefault();

    this.embarkjs.Storage.get(this.loadText).then(content => {
      this.storedText = content;
      this.storageError = '';
      this.addToLog(`EmbarkJS.Storage.get('${this.loadText}').then(function(hash) { })`);
    }).catch(err => {
      if (err) {
        this.storageError = err.message;
        console.error(`Storage get Error => ${err.message}`);
      }
    });
  }

  uploadFile(e: Event) {
    e.preventDefault();

    this.embarkjs.Storage.uploadFile(this.fileToUpload).then(hash => {
      this.fileHash = hash;
      this.imageToDownload = hash;
      this.storageError = '';
      this.addToLog(`EmbarkJS.Storage.uploadFile(this.fileToUpload)`);
    }).catch(err => {
      if (err) {
        this.storageError = err.message;
        console.error(`Storage uploadFile Error => ${err.message}`);
      }
    });
  }

  loadFile(e: Event) {
    e.preventDefault();

    const url = this.embarkjs.Storage.getUrl(this.imageToDownload);
    this.url = url;
    this.addToLog(`EmbarkJS.Storage.getUrl('${this.imageToDownload}')`);
  }

  ipnsRegister(e: Event) {
    e.preventDefault();

    this.registering = true;
    this.responseRegister = '';
    this.addToLog(`EmbarkJS.Storage.register('${this.valueRegister}', function(hash)))`);

    this.embarkjs.Storage.register(this.valueRegister, (err, name) => {
      this.registering = false;

      if (err) {
        this.isRegisterError = true;
        this.responseRegister = `Name Register Error: ${err.message || err}`;
      } else {
        this.isRegisterError = false;
        this.responseRegister = name;
      }
    });
  }

  ipnsResolve(e: Event) {
    e.preventDefault();

    this.resolving = true;
    this.responseResolver = '';
    this.addToLog(`EmbarkJS.Storage.resolve('${this.valueResolver}', function(err, path)))`);

    this.embarkjs.Storage.resolve(this.valueResolver, (err, path) => {
      this.resolving = false;

      if (err) {
        this.isResolverError = true;
        this.responseResolver = `Name Resolve Error: ${err.message || err}`;
      } else {
        this.isResolverError = false;
        this.responseResolver = path;
      }
    });
  }

  isIpfs() {
    return this.embarkjs.Storage.currentProviderName === 'ipfs';
  }
}
