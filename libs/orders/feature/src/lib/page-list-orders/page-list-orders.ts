import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersStore } from '@mini-crm/orders/data-access';
import { TableOrder } from '@mini-crm/orders/ui';
import { ConfirmDialog } from '@mini-crm/shared/ui';

@Component({
  selector: 'app-page-list-orders',
  imports: [TableOrder, ConfirmDialog],
  templateUrl: './page-list-orders.html',
  styleUrl: './page-list-orders.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageListOrders implements OnInit {
  private readonly store = inject(OrdersStore);
  private readonly router = inject(Router);

  // État lu directement depuis le store (signals).
  protected readonly orders = this.store.orders;
  protected readonly error = this.store.error;

  // Id de la commande dont la suppression est en attente de confirmation.
  protected readonly pendingDeleteId = signal<number | null>(null);

  // Commande correspondante, pour personnaliser le message de confirmation.
  private readonly pendingOrder = computed(
    () => this.orders().find((order) => order.id === this.pendingDeleteId()) ?? null,
  );

  protected readonly confirmMessage = computed(() => {
    const order = this.pendingOrder();
    return order
      ? `Voulez-vous vraiment supprimer « ${order.titre} » ? Cette action est irréversible.`
      : '';
  });

  ngOnInit(): void {
    this.store.load();
  }

  protected onAddOrder(): void {
    this.router.navigate(['/orders', 'add']);
  }

  protected editItem(id: number): void {
    this.router.navigate(['/orders', 'edit', id]);
  }

  /** Clic sur « Supprimer » : ouvre la confirmation (ne supprime pas encore). */
  protected onDeleteRequest(id: number): void {
    this.pendingDeleteId.set(id);
  }

  /** Confirmation : supprime réellement via le store puis referme la modale. */
  protected confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id !== null) {
      this.store.remove(id);
    }
    this.pendingDeleteId.set(null);
  }

  /** Annulation : referme la modale sans rien supprimer. */
  protected cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }
}
