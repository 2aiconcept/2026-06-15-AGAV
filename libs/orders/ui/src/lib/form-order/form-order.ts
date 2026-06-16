import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { OrderPayload, StatutOrder } from '@mini-crm/orders/util';
import { form, FormField, required } from '@angular/forms/signals';

const EMPTY_ORDER: OrderPayload = {
  titre: '',
  description: '',
  montant: 0,
  statut: 'Prospect',
  contact_id: null,
  entreprise_id: null,
};

@Component({
  selector: 'app-form-order',
  imports: [FormField],
  templateUrl: './form-order.html',
  styleUrl: './form-order.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormOrder implements OnInit {
  /** Statuts proposés dans le <select>. */
  protected readonly statuts: StatutOrder[] = ['Prospect', 'En cours', 'Gagne', 'Perdu'];

  /** Valeurs initiales : vides pour l'ajout, pré-remplies pour l'édition (réutilisable). */
  readonly initialValue = input<OrderPayload>(EMPTY_ORDER);

  /** Libellé du bouton de soumission (ex. « Ajouter » ou « Enregistrer »). */
  readonly submitLabel = input('Enregistrer');

  /** Émis avec les données valides à la soumission ; le parent décide quoi en faire. */
  readonly save = output<OrderPayload>();

  /** Données saisies, pilotées par le signal form (les FK non éditées sont conservées telles quelles). */
  private readonly model = signal<OrderPayload>(EMPTY_ORDER);

  /** Signal form : valeur + validation déclarative. */
  protected readonly orderForm = form(this.model, (path) => {
    required(path.titre, { message: 'Le titre est obligatoire.' });
  });

  ngOnInit(): void {
    // Recopie les valeurs initiales (sans effet en ajout, utile en édition).
    this.model.set({ ...this.initialValue() });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.orderForm().invalid()) {
      return;
    }
    this.save.emit(this.model());
  }
}
