import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContactsStore } from '@mini-crm/contacts/data-access';
import { ContactPayload } from '@mini-crm/contacts/util';
import { FormContact } from '@mini-crm/contacts/ui';

@Component({
  selector: 'app-page-add-contact',
  imports: [FormContact],
  templateUrl: './page-add-contact.html',
  styleUrl: './page-add-contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageAddContact {
  private readonly store = inject(ContactsStore);
  private readonly router = inject(Router);

  /** Erreur éventuelle remontée par le store après tentative de création. */
  protected readonly error = this.store.error;

  /** Crée le contact via le store, puis revient à la liste si tout s'est bien passé. */
  protected async onSave(payload: ContactPayload): Promise<void> {
    await this.store.add(payload);
    if (!this.store.error()) {
      this.router.navigate(['/contacts', 'list']);
    }
  }
}
