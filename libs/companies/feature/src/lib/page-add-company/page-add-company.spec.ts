import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CompaniesState } from '@mini-crm/companies/data-access';
import { CompanyPayload } from '@mini-crm/companies/util';
import PageAddCompany from './page-add-company';

describe('PageAddCompany', () => {
  // Faux store : seules les pièces utilisées par la page (error + add).
  const store = { error: signal<string | null>(null), add: vi.fn() };
  const router = { navigate: vi.fn() };
  let component: PageAddCompany;

  beforeEach(async () => {
    vi.clearAllMocks();
    store.error.set(null);

    await TestBed.configureTestingModule({
      imports: [PageAddCompany],
      providers: [
        { provide: CompaniesState, useValue: store },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    component = TestBed.createComponent(PageAddCompany).componentInstance;
  });

  it('onSave crée l’entreprise via le store puis revient à la liste', () => {
    const payload: CompanyPayload = { nom: 'Acme', secteur: 'IT', adresse: 'Paris', telephone: '01' };
    component['onSave'](payload);
    expect(store.add).toHaveBeenCalledWith(payload);
    expect(router.navigate).toHaveBeenCalledWith(['companies', 'list']);
  });
});
