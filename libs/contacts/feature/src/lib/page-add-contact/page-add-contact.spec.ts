import { ComponentFixture, TestBed } from '@angular/core/testing';

import PageAddContact from './page-add-contact';

describe('PageAddContact', () => {
  let component: PageAddContact;
  let fixture: ComponentFixture<PageAddContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAddContact],
    }).compileComponents();

    fixture = TestBed.createComponent(PageAddContact);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
