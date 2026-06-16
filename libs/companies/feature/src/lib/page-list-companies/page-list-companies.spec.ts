import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '@mini-crm/shared/util';

import PageListCompanies from './page-list-companies';

describe('PageListCompanies', () => {
  let component: PageListCompanies;
  let fixture: ComponentFixture<PageListCompanies>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageListCompanies],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://test/api' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageListCompanies);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    await fixture.whenStable();

    // ngOnInit déclenche un GET de la liste : on le satisfait sans appel réseau réel.
    httpTesting.expectOne((request) => request.method === 'GET').flush([]);
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
