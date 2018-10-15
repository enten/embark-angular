import { Component, Inject } from '@angular/core';

import { EMBARKJS } from '../app.tokens';

@Component({
  selector: 'app-whisper',
  template: `
    <div class="mb-4">
      <h4 class="mb-3">
        Listen To channel
      </h4>
      <form (submit)="listenToChannel($event)" class="form-inline">
        <label class="sr-only" for="whisper-listen-channel-input">
          Channel
        </label>
        <input type="text" class="form-control mb-2 mr-sm-2"
          id="whisper-listen-channel-input"
          (keyup)="handleChange($event, 'listenTo')"
          [defaultValue]="listenTo"
        />
        <button type="submit" class="btn btn-primary mb-2">
          Start Listening
        </button>
      </form>
      <div *ngIf="subscribedChannels.length">
        <div *ngFor="let channel of subscribedChannels">
          Subscribed to <b>{{ channel }}</b>. Now try sending a message
        </div>
      </div>
      <small class="form-text text-muted">
        messages received:
      </small>
      <div>
        <p *ngFor="let item of messageList">
         {{ item }}
        </p>
      </div>
    </div>

    <div class="mb-4">
      <h4 class="mb-3">
        Send Message
      </h4>
      <form (submit)="sendMessage($event)" class="form-inline">
        <label class="sr-only" for="whisper-send-channel-input">
          Channel
        </label>
        <input type="text" class="form-control mb-2 mr-sm-2"
          id="whisper-send-channel-input"
          (keyup)="handleChange($event, 'channel')"
          [defaultValue]="channel"
          placeholder="channel"
        />
        <label class="sr-only" for="whisper-send-message-input">
          Channel
        </label>
        <input type="text" class="form-control mb-2 mr-sm-2"
          id="whisper-send-message-input"
          (keyup)="handleChange($event, 'message')"
          [defaultValue]="message"
          placeholder="message"
        />
        <button type="submit" class="btn btn-primary mb-2">
          Send Message
        </button>
      </form>
    </div>

    <div class="mb-4">
      <p>Javascript calls being made:</p>
      <div class="p-2 rounded bg-dark text-monospace text-white">
        <p>EmbarkJS.Messages.setProvider('whisper')</p>
        <p *ngFor="let item of logs" class="text-monospace">
          {{ item }}
        </p>
      </div>
    </div>
  `,
})
export class WhisperComponent {
  listenTo = '';
  channel = '';
  message = '';
  subscribedChannels: string[] = [];
  messageList: string[] = [];
  logs: string[] = [];

  constructor(
    @Inject(EMBARKJS) readonly embarkjs: EmbarkJS,
  ) { }

  addToLog(txt: string) {
    this.logs.push(txt);
  }

  handleChange(e: Event, name: string) {
    const input = e.target as HTMLInputElement;

    this[name] = input.value;
  }

  listenToChannel(e: Event) {
    e.preventDefault();

    this.subscribedChannels.push(this.listenTo);

    this.embarkjs.Messages.listenTo({ topic: [ this.listenTo ] }, (error, message) => {
      if (error) {
        this.messageList.push(error.message);
      } else {
        this.messageList.push(`${message.topic} |  Message: ${message.data}`);
      }
    });

    this.addToLog(`EmbarkJS.Messages.listenTo({ topic: '${this.listenTo}' }).then(function(message))`);
  }

  sendMessage(e: Event) {
    e.preventDefault();

    this.embarkjs.Messages.sendMessage({ topic: this.channel, data: this.message});

    this.addToLog(`EmbarkJS.Messages.sendMessage({ topic: '${this.channel}', data: '${this.message}' })`);
  }
}
