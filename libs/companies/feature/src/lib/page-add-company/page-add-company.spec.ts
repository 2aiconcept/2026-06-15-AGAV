import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '@mini-crm/shared/util';

import PageAddCompany from './page-add-company';

describe('PageAddCompany', () => {
  let component: PageAddCompany;
  let fixture: ComponentFixture<PageAddCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAddCompany],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://test/api' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageAddCompany);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
