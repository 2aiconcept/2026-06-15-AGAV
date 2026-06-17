import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CompanyPayload } from '@mini-crm/companies/util';
import { FormCompany } from './form-company';

const VALID: CompanyPayload = { nom: 'Acme', secteur: 'IT', adresse: 'Paris', telephone: '01' };

describe('FormCompany', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<FormCompany>>;
  let component: FormCompany;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FormCompany] }).compileComponents();
    fixture = TestBed.createComponent(FormCompany);
    component = fixture.componentInstance;
  });

  it('émet `save` avec les données quand le formulaire est valide', () => {
    const saved = vi.fn();
    component.save.subscribe(saved); // l'output expose .subscribe

    // On pré-remplit via initialValue (recopié dans le model par ngOnInit) → formulaire valide.
    fixture.componentRef.setInput('initialValue', VALID);
    component.ngOnInit();

    component['onSubmit'](new Event('submit'));
    expect(saved).toHaveBeenCalledWith(VALID);
  });

  it('n’émet pas `save` quand le formulaire est invalide (champs requis vides)', () => {
    const saved = vi.fn();
    component.save.subscribe(saved);

    // model par défaut = champs vides → required en échec → onSubmit ne doit rien émettre.
    component['onSubmit'](new Event('submit'));
    expect(saved).not.toHaveBeenCalled();
  });
});
