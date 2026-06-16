import { ComponentFixture, TestBed } from '@angular/core/testing';

import PageAddOrder from './page-add-order';

describe('PageAddOrder', () => {
  let component: PageAddOrder;
  let fixture: ComponentFixture<PageAddOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAddOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(PageAddOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
