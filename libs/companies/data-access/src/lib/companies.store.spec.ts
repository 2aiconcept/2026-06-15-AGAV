import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { API_BASE_URL } from '@mini-crm/shared/util';
import { Company } from '@mini-crm/companies/util';
import { CompaniesState } from './companies.store';

// URL de base factice : aucune requête réseau réelle (tout est intercepté par HttpTestingController).
const API = 'http://api';
const COMPANY: Company = { id: 1, nom: 'Acme', secteur: 'IT', adresse: 'Paris', telephone: '01' };

describe('CompaniesState (store withCrud)', () => {
  let store: InstanceType<typeof CompaniesState>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // HttpClient...
        provideHttpClientTesting(), // ...mais backend de test (pas de réseau)
        { provide: API_BASE_URL, useValue: API }, // le store lit ce token pour construire l'URL
      ],
    });
    // providedIn:'root' → on récupère simplement l'instance via le TestBed.
    store = TestBed.inject(CompaniesState);
    http = TestBed.inject(HttpTestingController);
  });

  // Garantit qu'aucune requête n'a été oubliée/non satisfaite.
  afterEach(() => http.verify());

  it('load() : GET /entreprises puis remplit la collection', async () => {
    const done = store.load(); // 1. déclenche la méthode (Promise)
    const req = http.expectOne(`${API}/entreprises`); // 2. une requête GET est attendue
    expect(req.request.method).toBe('GET');
    req.flush([COMPANY]); // 3. on simule la réponse
    await done; // 4. on attend la fin du firstValueFrom
    expect(store.entities()).toEqual([COMPANY]); // 5. assertion sur le SIGNAL (synchrone)
    expect(store.isLoading()).toBe(false);
  });

  it('load() : en cas d’erreur HTTP, renseigne error', async () => {
    const done = store.load();
    http.expectOne(`${API}/entreprises`).flush('boom', { status: 500, statusText: 'Server Error' });
    await done;
    expect(store.error()).toBeTruthy();
    expect(store.isLoading()).toBe(false);
  });

  it('loadOne(id) : GET /entreprises/:id et renvoie l’entreprise', async () => {
    const promise = store.loadOne(1);
    http.expectOne(`${API}/entreprises/1`).flush(COMPANY);
    expect(await promise).toEqual(COMPANY);
  });

  it('add(payload) : POST puis ajoute à la collection', async () => {
    const done = store.add({ nom: 'Acme', secteur: 'IT', adresse: 'Paris', telephone: '01' });
    const req = http.expectOne(`${API}/entreprises`);
    expect(req.request.method).toBe('POST');
    req.flush(COMPANY);
    await done;
    expect(store.entities()).toContainEqual(COMPANY);
  });

  it('update(id, payload) : PUT puis remplace l’entrée', async () => {
    // On amorce la collection via un load.
    const seed = store.load();
    http.expectOne(`${API}/entreprises`).flush([COMPANY]);
    await seed;

    const updated: Company = { ...COMPANY, nom: 'Acme 2' };
    const done = store.update(1, { nom: 'Acme 2', secteur: 'IT', adresse: 'Paris', telephone: '01' });
    const req = http.expectOne(`${API}/entreprises/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
    await done;
    expect(store.entities()).toEqual([updated]);
  });

  it('remove(id) : DELETE puis retire l’entrée', async () => {
    const seed = store.load();
    http.expectOne(`${API}/entreprises`).flush([COMPANY]);
    await seed;

    const done = store.remove(1);
    const req = http.expectOne(`${API}/entreprises/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    await done;
    expect(store.entities()).toEqual([]);
  });
});
