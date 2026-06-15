import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEditOrder } from './page-edit-order';

describe('PageEditOrder', () => {
  let component: PageEditOrder;
  let fixture: ComponentFixture<PageEditOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageEditOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(PageEditOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
