import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';

import { EMBARKJS, WEB3 } from '../app.tokens';

@Component({
  selector: 'app-ens',
  template: `
    <div *ngIf="globalError" class="alert alert-danger">
      {{ globalError }}
    </div>

    <div class="mb-4">
      <h4 class="mb-3">
        Resolve a name
      </h4>
      <div *ngIf="responseResolve" class="alert alert-{{ isResolveError ? 'danger' : 'success' }}">
        Resolved address: {{ responseResolve }}
      </div>
      <form (submit)="resolveName($event)" class="form-inline">
        <label class="sr-only" for="ens-resolve-input">
          Value
        </label>
        <input type="text" class="form-control mb-2 mr-sm-2"
          id="ens-resolve-input"
          (keyup)="handleChange($event, 'valueResolve')"
          [defaultValue]="valueResolve"
        />
        <button type="submit" class="btn btn-primary mb-2">
          Resolve name
        </button>
      </form>
    </div>

    <div class="mb-4">
      <h4 class="mb-3">
        Lookup an address
      </h4>
      <div *ngIf="responseLookup" class="alert alert-{{ isLookupError ? 'danger' : 'success' }}">
        Looked up domain: {{ responseLookup }}
      </div>
      <form (submit)="lookupAddress($event)" class="form-inline">
        <label class="sr-only" for="ens-lookup-input">
          Value
        </label>
        <input type="text" class="form-control mb-2 mr-sm-2"
          id="ens-lookup-input"
          (keyup)="handleChange($event, 'valueLookup')"
          [defaultValue]="valueLookup"
        />
        <button type="submit" class="btn btn-primary mb-2">
          Lookup address
        </button>
      </form>
    </div>

    <div class="mb-4">
      <h4 class="mb-3">
        Register subdomain
      </h4>
      <div *ngIf="responseRegister" class="alert alert-{{ isRegisterError ? 'danger' : 'success' }}">
        {{ responseRegister }}
      </div>
      <form (submit)="registerSubDomain($event)" class="form-inline">
        <label class="sr-only" for="ens-register-value-input">
          Value
        </label>
        <input type="text" class="form-control mb-2 mr-sm-2"
          id="ens-register-value-input"
          (keyup)="handleChange($event, 'valueRegister')"
          [defaultValue]="valueRegister"
        />
        <label class="sr-only" for="ens-register-address-input">
          Address
        </label>
        <input type="text" class="form-control mb-2 mr-sm-2"
          id="ens-register-address-input"
          (keyup)="handleChange($event, 'addressRegister')"
          [defaultValue]="addressRegister"
        />
        <button type="submit" class="btn btn-primary mb-2">
          Register subdomain
        </button>
      </form>
    </div>

    <div class="mb-4">
      <p>Javascript calls being made:</p>
      <div class="p-2 rounded bg-dark text-monospace text-white">
        <p *ngFor="let item of logs" class="text-monospace">
          {{ item }}
        </p>
      </div>
    </div>
  `,
})
export class EnsComponent implements OnInit {
  globalError: string | null = null;
  valueResolve = 'eth';
  responseResolve: string | null = null;
  isResolveError = false;
  valueLookup = '';
  responseLookup: string | null = null;
  isLookupError = false;
  valueRegister = '';
  addressRegister = '';
  responseRegister: string | null = null;
  isRegisterError = false;
  logs: string[] = [];

  constructor(
    @Inject(EMBARKJS) readonly embarkjs: EmbarkJS,
    @Inject(WEB3) readonly web3: Web3,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    if (!this.web3.eth.defaultAccount) {
      this.globalError = 'There is currently no default account. If Metamask is active, please sign in or deactivate it.';
    }

    this.addressRegister = this.web3.eth.defaultAccount;
    this.valueLookup = this.web3.eth.defaultAccount;
  }

  handleChange(e: Event, name: string) {
    const input = e.target as HTMLInputElement;

    this[name] = input.value;
  }

  registerSubDomain(e: Event) {
    e.preventDefault();
    this.logs.push(`EmbarkJS.Names.registerSubDomain('${this.valueRegister}', '${this.addressRegister}', console.log)`);

    this.embarkjs.Names.registerSubDomain(this.valueRegister, this.addressRegister, (err, transaction) => {
      const message = err ? err.message : `Successfully registered "${this.valueRegister}" with ${transaction.gasUsed} gas`;

      this.responseRegister = message;
      this.isRegisterError = !!err;

      this.ref.detectChanges();
    });
  }

  resolveName(e: Event) {
    e.preventDefault();

    this.logs.push(`EmbarkJS.Names.resolve('${this.valueResolve}', console.log)`);

    this.embarkjs.Names.resolve(this.valueResolve, (err, result) => {
      if (err) {
        this.responseResolve = err.message || err as {} as string;
        this.isResolveError = true;
      } else {
        this.responseResolve = result;
        this.isResolveError = false;
      }

      this.ref.detectChanges();
    });
  }

  lookupAddress(e: Event) {
    e.preventDefault();

    this.logs.push(`EmbarkJS.Names.resolve('${this.valueLookup}', console.log)`);

    this.embarkjs.Names.lookup(this.valueLookup, (err, result) => {
      if (err) {
        this.responseLookup = err.message || err as {} as string;
        this.isLookupError = true;
      } else {
        this.responseLookup = result;
        this.isLookupError = false;
      }

      this.ref.detectChanges();
    });
  }
}
