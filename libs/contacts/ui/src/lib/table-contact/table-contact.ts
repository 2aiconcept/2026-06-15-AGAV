import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Contact } from '@mini-crm/contacts/util';

@Component({
  selector: 'app-table-contact',
  imports: [],
  templateUrl: './table-contact.html',
  styleUrl: './table-contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableContact {
  /** Liste à afficher, fournie par le composant parent (la page). */
  readonly contacts = input.required<Contact[]>();

  /** Émis quand l'utilisateur veut éditer un contact (transporte l'id). */
  readonly editContact = output<number>();

  /** Émis quand l'utilisateur veut supprimer un contact (transporte l'id). */
  readonly deleteContact = output<number>();

  protected editContactFn(id: number) {
    this.editContact.emit(id);
  }

  protected deleteContactFn(id: number) {
    this.deleteContact.emit(id);
  }
}
