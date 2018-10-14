import { Component, Inject, OnInit } from '@angular/core';

import { EMBARKJS } from './app.tokens';

@Component({
  selector: 'app-root',
  template: `
    <main class="container p-3">
      <h3 class="mb-3">Embark - Usage Example</h3>
      <div>
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a routerLink="/blockchain" routerLinkActive="active" class="nav-link">
              Blockchain
              <span
                [class]="getServiceStatusClass(blockchainEnabled)"
                style="width: 12px; height: 12px;"
              ></span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/storage" routerLinkActive="active">
              Decentralized Storage
              <span
                [class]="getServiceStatusClass(storageEnabled)"
                style="width: 12px; height: 12px;"
              ></span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/whisper" routerLinkActive="active">
              P2P communication (Whisper)
              <span
                [class]="getServiceStatusClass(whisperEnabled)"
                style="width: 12px; height: 12px;"
              ></span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/ens" routerLinkActive="active">
              Naming (ENS)
              <span
                [class]="getServiceStatusClass(ensEnabled)"
                style="width: 12px; height: 12px;"
              ></span>
            </a>
          </li>
        </ul>
        <div class="tab-content p-3 border border-top-0">
          <router-outlet></router-outlet>
        </div>
      </div>
    </main>
  `,
})
export class AppComponent implements OnInit {
  blockchainEnabled = false;
  ensEnabled = false;
  storageEnabled = false;
  whisperEnabled = false;

  constructor(
    @Inject(EMBARKJS) readonly embarkjs: EmbarkJS,
  ) { }

  ngOnInit() {
    this.blockchainEnabled = true;

    this.ensEnabled = this.embarkjs.Names.currentNameSystems && this.embarkjs.Names.isAvailable();

    if (this.embarkjs.Messages.Providers.whisper) {
      this.embarkjs.Messages.Providers.whisper.getWhisperVersion((err, version) => {
        if (err) {
          return console.log(err);
        }

        this.whisperEnabled = true;
      });
    }

    this.embarkjs.Storage.isAvailable().then((result) => {
      this.storageEnabled = result;
    }).catch(() => {
      this.storageEnabled = false;
    });
  }

  getServiceStatusClass(enabled: boolean) {
    return `d-inline-block pull-right rounded-circle bg-${enabled ? 'success' : 'danger'}`;
  }
}
