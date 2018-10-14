import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageComponent } from './storage.component';

export * from './storage.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    StorageComponent,
  ],
})
export class StorageModule { }
