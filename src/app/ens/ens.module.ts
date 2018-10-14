import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnsComponent } from './ens.component';

export * from './ens.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    EnsComponent,
  ],
})
export class EnsModule { }
