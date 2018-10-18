import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EMBARKJS, WEB3 } from './app.tokens';
import { CONTRACTS_PROVIDERS } from './contracts.provider';

@NgModule({
  declarations: [
    AppComponent,
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
    ...CONTRACTS_PROVIDERS,
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule { }
