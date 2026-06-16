import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-list-orders',
  imports: [],
  templateUrl: './page-list-orders.html',
  styleUrl: './page-list-orders.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageListOrders {}
