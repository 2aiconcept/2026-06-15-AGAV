import { ComponentFixture, TestBed } from '@angular/core/testing';

import PageEditContact from './page-edit-contact';

describe('PageEditContact', () => {
  let component: PageEditContact;
  let fixture: ComponentFixture<PageEditContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageEditContact],
    }).compileComponents();

    fixture = TestBed.createComponent(PageEditContact);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
