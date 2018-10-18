import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { EMBARKJS } from '../app.tokens';
import { StorageComponent } from './storage.component';

describe('StorageComponent', () => {
  let component: StorageComponent;
  let fixture: ComponentFixture<StorageComponent>;
  const embarkjs = {
    Storage: {},
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageComponent ],
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
    fixture = TestBed.createComponent(StorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
