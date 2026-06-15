import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageListOrders } from './page-list-orders';

describe('PageListOrders', () => {
  let component: PageListOrders;
  let fixture: ComponentFixture<PageListOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageListOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(PageListOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
