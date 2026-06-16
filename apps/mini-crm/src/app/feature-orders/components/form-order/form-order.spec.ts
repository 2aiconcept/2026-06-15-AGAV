import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOrder } from './form-order';

describe('FormOrder', () => {
  let component: FormOrder;
  let fixture: ComponentFixture<FormOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(FormOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
