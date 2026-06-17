import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ContactsStore } from '@mini-crm/contacts/data-access';
import { Contact, ContactPayload } from '@mini-crm/contacts/util';
import { FormContact } from '@mini-crm/contacts/ui';

@Component({
  selector: 'app-page-edit-contact',
  imports: [FormContact],
  templateUrl: './page-edit-contact.html',
  styleUrl: './page-edit-contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageEditContact implements OnInit {
  private readonly store = inject(ContactsStore);
  private readonly router = inject(Router);

  /** Id lié depuis la route `edit/:id` (withComponentInputBinding), converti en nombre. */
  readonly id = input.required<number, string>({ transform: numberAttribute });

  /** Contact chargé depuis l'API (null tant que le chargement n'est pas terminé). */
  private readonly contact = signal<Contact | null>(null);

  /** Erreur (chargement comme enregistrement) : une seule source, celle du store. */
  protected readonly error = this.store.error;

  /** Valeurs initiales du formulaire, sans l'id. */
  protected readonly initialValue = computed<ContactPayload | null>(() => {
    const contact = this.contact();
    if (!contact) {
      return null;
    }
    return {
      nom: contact.nom,
      prenom: contact.prenom,
      email: contact.email,
      telephone: contact.telephone,
      entreprise_id: contact.entreprise_id,
    };
  });

  async ngOnInit(): Promise<void> {
    // `loadOne` pose `store.error` en cas d'échec et renvoie null.
    this.contact.set(await this.store.loadOne(this.id()));
  }

  protected async onSave(payload: ContactPayload): Promise<void> {
    await this.store.update(this.id(), payload);
    if (!this.store.error()) {
      this.router.navigate(['/contacts', 'list']);
    }
  }
}
