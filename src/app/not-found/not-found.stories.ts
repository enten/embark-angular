import { storiesOf } from '@storybook/angular';

import { NotFoundComponent } from './not-found.module';

storiesOf('NotFoundComponent', module)
  .add('default', () => ({
    component: NotFoundComponent,
  }));
