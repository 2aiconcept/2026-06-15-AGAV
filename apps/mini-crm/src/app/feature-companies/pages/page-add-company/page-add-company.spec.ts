import { ComponentFixture, TestBed } from '@angular/core/testing';

import PageAddCompany from './page-add-company';

describe('PageAddCompany', () => {
  let component: PageAddCompany;
  let fixture: ComponentFixture<PageAddCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAddCompany],
    }).compileComponents();

    fixture = TestBed.createComponent(PageAddCompany);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
