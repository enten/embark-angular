import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhisperComponent } from './whisper.component';

export * from './whisper.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    WhisperComponent,
  ],
})
export class WhisperModule { }
