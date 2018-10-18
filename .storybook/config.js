import { configure } from '@storybook/angular';

function loadStories() {
  // automatically import all story ts files that end with *.stories.ts
  const req = require.context('../src', true, /\.stories\.ts$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
