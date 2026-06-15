import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageListContacts } from './page-list-contacts';

describe('PageListContacts', () => {
  let component: PageListContacts;
  let fixture: ComponentFixture<PageListContacts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageListContacts],
    }).compileComponents();

    fixture = TestBed.createComponent(PageListContacts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
