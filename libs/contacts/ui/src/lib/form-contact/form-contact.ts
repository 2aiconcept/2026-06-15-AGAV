import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { ContactPayload } from '@mini-crm/contacts/util';
import { email, form, FormField, required } from '@angular/forms/signals';

const EMPTY_CONTACT: ContactPayload = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  entreprise_id: null,
};

@Component({
  selector: 'app-form-contact',
  imports: [FormField],
  templateUrl: './form-contact.html',
  styleUrl: './form-contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormContact implements OnInit {
  /** Valeurs initiales : vides pour l'ajout, pré-remplies pour l'édition. */
  readonly initialValue = input<ContactPayload>(EMPTY_CONTACT);

  /** Libellé du bouton de soumission. */
  readonly submitLabel = input('Enregistrer');

  /** Émis avec les données valides à la soumission. */
  readonly save = output<ContactPayload>();

  /** Données saisies (la FK `entreprise_id` non éditée est conservée telle quelle). */
  private readonly model = signal<ContactPayload>(EMPTY_CONTACT);

  /** Signal form : valeur + validation déclarative. */
  protected readonly contactForm = form(this.model, (path) => {
    required(path.nom, { message: 'Le nom est obligatoire.' });
    required(path.prenom, { message: 'Le prénom est obligatoire.' });
    required(path.email, { message: "L'email est obligatoire." });
    email(path.email, { message: "Le format de l'email est invalide." });
  });

  ngOnInit(): void {
    this.model.set({ ...this.initialValue() });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.contactForm().invalid()) {
      return;
    }
    this.save.emit(this.model());
  }
}
