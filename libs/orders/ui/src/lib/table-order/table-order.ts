import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Order } from '@mini-crm/orders/util';

@Component({
  selector: 'app-table-order',
  imports: [],
  templateUrl: './table-order.html',
  styleUrl: './table-order.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableOrder {
  /** Liste à afficher, fournie par le composant parent (la page). */
  readonly orders = input.required<Order[]>();

  /** Émis quand l'utilisateur veut éditer une commande (transporte l'id). */
  readonly editOrder = output<number>();

  /** Émis quand l'utilisateur veut supprimer une commande (transporte l'id). */
  readonly deleteOrder = output<number>();

  protected editOrderFn(id: number) {
    this.editOrder.emit(id);
  }

  protected deleteOrderFn(id: number) {
    this.deleteOrder.emit(id);
  }
}
