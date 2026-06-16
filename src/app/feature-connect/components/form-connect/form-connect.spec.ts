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
    // Input requis : il DOIT être fourni avant la détection de changements,
    // sinon `model()` est lu sans valeur → NG0950.
    fixture.componentRef.setInput('model', { email: '', password: '' });
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
