import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { EMBARKJS } from '../app.tokens';
import { WhisperComponent } from './whisper.component';

describe('WhisperComponent', () => {
  let component: WhisperComponent;
  let fixture: ComponentFixture<WhisperComponent>;
  const embarkjs = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhisperComponent ],
      providers: [
        {
          provide: EMBARKJS,
          useValue: embarkjs,
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhisperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
