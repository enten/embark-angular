import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { SIMPLE_STORAGE } from '../contracts.tokens';
import { BlockchainComponent } from './blockchain.component';

describe('BlockchainComponent', () => {
  let component: BlockchainComponent;
  let fixture: ComponentFixture<BlockchainComponent>;
  const simpleStorage = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockchainComponent ],
      providers: [
        {
          provide: SIMPLE_STORAGE,
          useValue: simpleStorage,
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockchainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
