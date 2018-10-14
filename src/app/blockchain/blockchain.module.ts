import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockchainComponent } from './blockchain.component';

export * from './blockchain.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BlockchainComponent,
  ],
})
export class BlockchainModule { }
