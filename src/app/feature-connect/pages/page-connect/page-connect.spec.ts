import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageConnect } from './page-connect';

describe('PageConnect', () => {
  let component: PageConnect;
  let fixture: ComponentFixture<PageConnect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageConnect],
    }).compileComponents();

    fixture = TestBed.createComponent(PageConnect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
