import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConnect } from './form-connect';

describe('FormConnect', () => {
  let component: FormConnect;
  let fixture: ComponentFixture<FormConnect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConnect],
    }).compileComponents();

    fixture = TestBed.createComponent(FormConnect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
