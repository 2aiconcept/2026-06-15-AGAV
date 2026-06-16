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
import { OrdersStore } from '@mini-crm/orders/data-access';
import { Order, OrderPayload } from '@mini-crm/orders/util';
import { FormOrder } from '@mini-crm/orders/ui';

@Component({
  selector: 'app-page-edit-order',
  imports: [FormOrder],
  templateUrl: './page-edit-order.html',
  styleUrl: './page-edit-order.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageEditOrder implements OnInit {
  private readonly store = inject(OrdersStore);
  private readonly router = inject(Router);

  /** Id lié depuis la route `edit/:id` (withComponentInputBinding), converti en nombre. */
  readonly id = input.required<number, string>({ transform: numberAttribute });

  /** Commande chargée depuis l'API (null tant que le chargement n'est pas terminé). */
  private readonly order = signal<Order | null>(null);

  /** Erreur (chargement comme enregistrement) : une seule source, celle du store. */
  protected readonly error = this.store.error;

  /** Valeurs initiales du formulaire, sans l'id (le formulaire ne manipule que le payload). */
  protected readonly initialValue = computed<OrderPayload | null>(() => {
    const order = this.order();
    if (!order) {
      return null;
    }
    return {
      titre: order.titre,
      description: order.description,
      montant: order.montant,
      statut: order.statut,
      contact_id: order.contact_id,
      entreprise_id: order.entreprise_id,
    };
  });

  async ngOnInit(): Promise<void> {
    // Chargement depuis l'API (source de vérité), pour fonctionner aussi en accès direct / refresh.
    // `loadOne` pose `store.error` en cas d'échec et renvoie null.
    this.order.set(await this.store.loadOne(this.id()));
  }

  /** Enregistre via le store puis revient à la liste si tout s'est bien passé. */
  protected async onSave(payload: OrderPayload): Promise<void> {
    await this.store.update(this.id(), payload);
    if (!this.store.error()) {
      this.router.navigate(['/orders', 'list']);
    }
  }
}
