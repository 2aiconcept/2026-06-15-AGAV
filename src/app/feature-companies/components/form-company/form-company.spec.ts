import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCompany } from './form-company';

describe('FormCompany', () => {
  let component: FormCompany;
  let fixture: ComponentFixture<FormCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCompany],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCompany);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
