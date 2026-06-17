import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContactsStore } from '@mini-crm/contacts/data-access';
import { TableContact } from '@mini-crm/contacts/ui';
import { ConfirmDialog } from '@mini-crm/shared/ui';

@Component({
  selector: 'app-page-list-contacts',
  imports: [TableContact, ConfirmDialog, RouterLink],
  templateUrl: './page-list-contacts.html',
  styleUrl: './page-list-contacts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageListContacts {
  protected readonly store = inject(ContactsStore);
  private readonly router = inject(Router);

  /** Id en attente de confirmation de suppression (null = modale fermée). */
  protected readonly pendingDeleteId = signal<number | null>(null);

  constructor() {
    this.store.load();
  }

  protected editItem(id: number): void {
    this.router.navigate(['/contacts', 'edit', id]);
  }

  protected confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id !== null) {
      this.store.remove(id);
    }
    this.pendingDeleteId.set(null);
  }
}
