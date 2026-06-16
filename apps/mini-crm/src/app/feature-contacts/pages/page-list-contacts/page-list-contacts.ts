import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-list-contacts',
  imports: [],
  templateUrl: './page-list-contacts.html',
  styleUrl: './page-list-contacts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageListContacts {}
