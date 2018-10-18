import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { EMBARKJS, WEB3 } from './app.tokens';

describe('AppComponent', () => {
  const embarkjs = {
    Names: {
      currentNameSystems: '',
      isAvailable: jest.fn(),
    },
    Messages: {
      Providers: {
        whisper: {
          getWhisperVersion: jest.fn(),
        },
      },
    },
    Storage: {
      isAvailable: jest.fn(() => Promise.resolve(true)),
    },
  };
  const web3 = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        AppComponent,
      ],
      providers: [
        {
          provide: EMBARKJS,
          useValue: embarkjs,
        },
        {
          provide: WEB3,
          useValue: web3,
        },
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  // it(`should have as title 'angular'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('angular');
  // }));
  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to angular!');
  // }));
});
