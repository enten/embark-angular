import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { EMBARKJS, WEB3 } from '../app.tokens';
import { EnsComponent } from './ens.component';

describe('EnsComponent', () => {
  let component: EnsComponent;
  let fixture: ComponentFixture<EnsComponent>;
  const embarkjs = {};
  const web3 = {
    eth: {

    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnsComponent ],
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
