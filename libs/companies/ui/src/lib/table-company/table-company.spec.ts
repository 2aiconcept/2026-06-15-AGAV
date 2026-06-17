import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Company } from '@mini-crm/companies/util';
import { TableCompany } from './table-company';

const COMPANY: Company = { id: 1, nom: 'Acme', secteur: 'IT', adresse: 'Paris', telephone: '01' };

describe('TableCompany (composant présentationnel)', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<TableCompany>>;
  let component: TableCompany;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TableCompany] }).compileComponents();
    fixture = TestBed.createComponent(TableCompany);
    component = fixture.componentInstance;
    // `companies` est un input requis (lu par le template).
    fixture.componentRef.setInput('companies', [COMPANY]);
  });

  it('émet `editCompany` avec l’id', () => {
    const edit = vi.fn();
    component.editCompany.subscribe(edit);
    component['editCompanyFn'](1);
    expect(edit).toHaveBeenCalledWith(1);
  });

  it('émet `deleteCompany` avec l’id', () => {
    const remove = vi.fn();
    component.deleteCompany.subscribe(remove);
    component['deleteCompanyFn'](1);
    expect(remove).toHaveBeenCalledWith(1);
  });
});
