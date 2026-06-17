import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CompaniesState } from '@mini-crm/companies/data-access';
import { Company } from '@mini-crm/companies/util';
import PageListCompanies from './page-list-companies';

/**
 * On teste l'INTERACTION de la page avec le store, pas le HTTP : on fournit un **faux store**
 * (signaux d'état + méthodes espionnées) et un **faux Router**. Pas de réseau, pas de DOM.
 */
describe('PageListCompanies', () => {
  // Faux store : mêmes signaux/méthodes que ceux consommés par la page.
  const store = {
    entities: signal<Company[]>([]),
    isLoading: signal(false),
    error: signal<string | null>(null),
    load: vi.fn(),
    remove: vi.fn(),
  };
  const router = { navigate: vi.fn() };
  let component: PageListCompanies;

  beforeEach(async () => {
    vi.clearAllMocks();
    store.entities.set([]);
    store.error.set(null);

    await TestBed.configureTestingModule({
      imports: [PageListCompanies],
      providers: [
        { provide: CompaniesState, useValue: store }, // on substitue le vrai store
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    // createComponent exécute le constructor → la page appelle store.load().
    component = TestBed.createComponent(PageListCompanies).componentInstance;
  });

  it('charge la liste à la création (constructor)', () => {
    expect(store.load).toHaveBeenCalledTimes(1);
  });

  it('onAddCompany navigue vers le formulaire d’ajout', () => {
    component['onAddCompany'](); // méthode protégée → accès entre crochets en test
    expect(router.navigate).toHaveBeenCalledWith(['companies', 'add']);
  });

  it('editItem navigue vers l’édition avec l’id', () => {
    component['editItem'](42);
    expect(router.navigate).toHaveBeenCalledWith(['companies', 'edit', 42]);
  });

  it('confirmDelete supprime via le store puis referme la modale', () => {
    component['pendingDeleteId'].set(7); // une suppression est en attente
    component['confirmDelete']();
    expect(store.remove).toHaveBeenCalledWith(7);
    expect(component['pendingDeleteId']()).toBeNull(); // modale refermée
  });

  it('confirmDelete ne supprime rien si aucun id en attente', () => {
    component['pendingDeleteId'].set(null);
    component['confirmDelete']();
    expect(store.remove).not.toHaveBeenCalled();
  });
});
