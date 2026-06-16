import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersStore } from '@mini-crm/orders/data-access';
import { OrderPayload } from '@mini-crm/orders/util';
import { FormOrder } from '@mini-crm/orders/ui';

@Component({
  selector: 'app-page-add-order',
  imports: [FormOrder],
  templateUrl: './page-add-order.html',
  styleUrl: './page-add-order.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageAddOrder {
  private readonly store = inject(OrdersStore);
  private readonly router = inject(Router);

  /** Affiche l'erreur éventuelle remontée par le store après tentative de création. */
  protected readonly error = this.store.error;

  /** Crée la commande via le store, puis revient à la liste si tout s'est bien passé. */
  protected async onSave(payload: OrderPayload): Promise<void> {
    await this.store.add(payload);
    if (!this.store.error()) {
      this.router.navigate(['/orders', 'list']);
    }
  }
}
