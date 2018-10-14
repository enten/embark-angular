import { Component } from '@angular/core';

import SimpleStorage from 'Embark/contracts/SimpleStorage';

@Component({
  selector: 'app-blockchain',
  template: `
    <form (submit)="setValue($event)" class="mb-4">
      <h4 class="mb-3">
        1. Set the value in the blockchain
      </h4>
      <div class="mb-3">
        <label for="blockchain-set-input">
          Value
        </label>
        <input type="text" class="form-control"
          id="blockchain-set-input"
          aria-describedby="blockchain-set-help"
          (keyup)="handleChange($event)"
          [defaultValue]="valueSet"
          required
        />
        <small id="blockchain-set-help" class="form-text text-muted">
          Once you set the value, the transaction will need to be mined and then the value will be updated on the blockchain.
        </small>
      </div>
      <button class="btn btn-primary" type="submit">
        Set Value
      </button>
    </form>

    <form (submit)="getValue($event)" class="mb-4">
      <h4 class="mb-3">
        2. Get the current value
      </h4>
      <div class="mb-3">
        <label for="blockchain-get-input">Current value is</label>
        <input type="text" class="form-control"
          id="blockchain-get-input"
          aria-describedby="blockchain-get-help"
          [value]="valueGet"
          disabled />
        <small id="blockchain-get-help" class="form-text text-muted">
          Click the button to get the current value. The initial value is 100.
        </small>
      </div>
      <button class="btn btn-primary" type="submit">
        Get Value
      </button>
    </form>

    <div class="mb-4">
      <h4 class="mb-3">
        3. Contract Calls
      </h4>
      <p>Javascript calls being made:</p>
      <div class="p-2 rounded bg-dark text-monospace text-white">
        <p *ngFor="let item of logs">
          {{ item }}
        </p>
      </div>
    </div>
  `,
})
export class BlockchainComponent {
  valueSet = '10';
  valueGet = '';
  logs: string[] = [];

  handleChange(e: Event) {
    const input = e.target as HTMLButtonElement;

    this.valueSet = input.value;
  }

  getValue(e: Event) {
    e.preventDefault();

    this.valueGet = 'Pending...';

    SimpleStorage.methods.get().call().then(value => {
      this.valueGet = value;

      this._addToLog(`console.log(${value})`);
    });

    this._addToLog('SimpleStorage.methods.get(console.log)');
  }

  setValue(e: Event) {
    e.preventDefault();

    const value = parseInt(this.valueSet, 10);

    SimpleStorage.methods.set(value).send().then(receipt => {
      this._addToLog(`transaction hash: ${receipt.transactionHash}`);
    });

    this._addToLog(`SimpleStorage.methods.set(value).send(${value})`);
  }

  _addToLog(txt: string) {
    this.logs.push(txt);
  }
}
