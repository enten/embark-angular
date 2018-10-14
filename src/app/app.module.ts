import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { EMBARKJS, WEB3 } from './app.tokens';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: EMBARKJS,
      useFactory: () => EmbarkJS,
    },
    {
      provide: WEB3,
      useFactory: () => web3,
    },
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule { }
