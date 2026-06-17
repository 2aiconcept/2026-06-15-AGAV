import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OrdersStore } from '@mini-crm/orders/data-access';
import { TableOrder } from '@mini-crm/orders/ui';
import { ConfirmDialog } from '@mini-crm/shared/ui';

@Component({
  selector: 'app-page-list-orders',
  imports: [TableOrder, ConfirmDialog, RouterLink],
  templateUrl: './page-list-orders.html',
  styleUrl: './page-list-orders.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageListOrders {
  // Store exposé : on lit `store.entities()` / `store.error()` directement dans le template.
  protected readonly store = inject(OrdersStore);
  private readonly router = inject(Router);

  /** Id en attente de confirmation de suppression (null = modale fermée). */
  protected readonly pendingDeleteId = signal<number | null>(null);

  constructor() {
    this.store.load();
  }

  /** Navigation vers l'édition (gardée comme méthode pour laisser `table-order` « dumb »). */
  protected editItem(id: number): void {
    this.router.navigate(['/orders', 'edit', id]);
  }

  /** Confirmation : supprime via le store puis referme la modale. */
  protected confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id !== null) {
      this.store.remove(id);
    }
    this.pendingDeleteId.set(null);
  }
}

/* =============================================================================================
 * ANCIENNE VERSION (avant allègement) — conservée pour comparaison en formation.
 * Tout le boilerplate ci-dessous a été soit déplacé dans le template (bindings inline, routerLink,
 * message statique), soit supprimé → MOINS de code ET surtout MOINS d'unités à tester unitairement
 * (navigation/setters/computed partis du .ts).
 * ---------------------------------------------------------------------------------------------
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

  protected readonly orders = this.store.entities;
  protected readonly error = this.store.error;

  protected readonly pendingDeleteId = signal<number | null>(null);

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

  protected onDeleteRequest(id: number): void {
    this.pendingDeleteId.set(id);
  }

  protected confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id !== null) {
      this.store.remove(id);
    }
    this.pendingDeleteId.set(null);
  }

  protected cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }
}
 * ============================================================================================= */
