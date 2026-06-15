import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import PageEditCompany from './page-edit-company';

describe('PageEditCompany', () => {
  let component: PageEditCompany;
  let fixture: ComponentFixture<PageEditCompany>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageEditCompany],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PageEditCompany);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);

    // `id` est un input requis lié à la route ; numberAttribute convertit la chaîne en nombre.
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();

    // ngOnInit déclenche un GET : on le satisfait avec une entreprise factice (pas d'appel réseau réel).
    httpTesting.expectOne((request) => request.method === 'GET').flush({
      id: 1,
      nom: 'ACME',
      secteur: 'Tech',
      adresse: '1 rue des Tests',
      telephone: '0102030405',
    });
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
