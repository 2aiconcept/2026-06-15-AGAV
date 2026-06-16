import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCompany } from './table-company';

describe('TableCompany', () => {
  let component: TableCompany;
  let fixture: ComponentFixture<TableCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCompany],
    }).compileComponents();

    fixture = TestBed.createComponent(TableCompany);
    component = fixture.componentInstance;
    // `companies` est un input requis, lu par le template : il faut le fournir.
    fixture.componentRef.setInput('companies', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
