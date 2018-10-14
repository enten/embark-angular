import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnsComponent } from './ens.component';

describe('EnsComponent', () => {
  let component: EnsComponent;
  let fixture: ComponentFixture<EnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnsComponent ]
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
