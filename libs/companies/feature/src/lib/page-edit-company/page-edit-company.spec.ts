import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CompaniesState } from '@mini-crm/companies/data-access';
import { Company, CompanyPayload } from '@mini-crm/companies/util';
import PageEditCompany from './page-edit-company';

const COMPANY: Company = { id: 1, nom: 'Acme', secteur: 'IT', adresse: 'Paris', telephone: '01' };

describe('PageEditCompany', () => {
  const store = {
    error: signal<string | null>(null),
    loadOne: vi.fn(),
    update: vi.fn(),
  };
  const router = { navigate: vi.fn() };
  let fixture: ReturnType<typeof TestBed.createComponent<PageEditCompany>>;
  let component: PageEditCompany;

  beforeEach(async () => {
    vi.clearAllMocks();
    store.error.set(null);
    store.loadOne.mockResolvedValue(COMPANY);

    await TestBed.configureTestingModule({
      imports: [PageEditCompany],
      providers: [
        { provide: CompaniesState, useValue: store },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageEditCompany);
    component = fixture.componentInstance;
    // `id` est un input requis (lié à la route) ; numberAttribute convertit '1' → 1.
    fixture.componentRef.setInput('id', '1');
  });

  it('ngOnInit charge l’entreprise et pré-remplit le formulaire (sans l’id)', async () => {
    await component.ngOnInit();
    expect(store.loadOne).toHaveBeenCalledWith(1);
    expect(component['initialValue']()).toEqual({
      nom: 'Acme',
      secteur: 'IT',
      adresse: 'Paris',
      telephone: '01',
    });
  });

  it('onSave met à jour via le store puis revient à la liste', () => {
    const payload: CompanyPayload = { nom: 'Acme 2', secteur: 'IT', adresse: 'Paris', telephone: '01' };
    component['onSave'](payload);
    expect(store.update).toHaveBeenCalledWith(1, payload);
    expect(router.navigate).toHaveBeenCalledWith(['companies', 'list']);
  });
});
