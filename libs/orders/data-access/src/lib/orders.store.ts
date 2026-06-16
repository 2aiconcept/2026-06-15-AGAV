import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { Order, OrderPayload } from '@mini-crm/orders/util';
import { API_BASE_URL } from '@mini-crm/shared/util';

/**
 * État du store orders (V1 : `withState` + `withMethods` + `patchState`, sans `withComputed`
 * ni `withEntities`).
 */
type OrdersState = {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

/**
 * Store des commandes, fourni en singleton global (`providedIn: 'root'`) :
 * aucune déclaration dans `app.config.ts`, on `inject(OrdersStore)` directement.
 *
 * Side effects en méthodes `async` + `firstValueFrom` (HttpClient renvoie des Observables) ;
 * l'état n'est mis à jour que par `patchState`.
 */
export const OrdersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, http = inject(HttpClient), apiUrl = `${inject(API_BASE_URL)}/opportunites`) => ({
      /** Charge la liste des commandes depuis l'API. */
      async load(): Promise<void> {
        patchState(store, { isLoading: true, error: null });
        try {
          const orders = await firstValueFrom(http.get<Order[]>(apiUrl));
          patchState(store, { orders, isLoading: false });
        } catch {
          patchState(store, {
            error: 'Impossible de charger les commandes.',
            isLoading: false,
          });
        }
      },

      /** Charge une commande par id (source de vérité API, pour pré-remplir l'édition).
       *  Pose `error` et renvoie `null` en cas d'échec → une seule source d'erreur (le store). */
      async loadOne(id: number): Promise<Order | null> {
        patchState(store, { error: null });
        try {
          return await firstValueFrom(http.get<Order>(`${apiUrl}/${id}`));
        } catch {
          patchState(store, { error: 'Impossible de charger la commande.' });
          return null;
        }
      },

      /** Crée une commande puis l'ajoute à la liste locale. */
      async add(payload: OrderPayload): Promise<void> {
        patchState(store, { error: null });
        try {
          const created = await firstValueFrom(http.post<Order>(apiUrl, payload));
          patchState(store, (state) => ({ orders: [...state.orders, created] }));
        } catch {
          patchState(store, { error: 'Impossible de créer la commande.' });
        }
      },

      /** Met à jour une commande puis remplace la ligne correspondante. */
      async update(id: number, payload: OrderPayload): Promise<void> {
        patchState(store, { error: null });
        try {
          const updated = await firstValueFrom(http.put<Order>(`${apiUrl}/${id}`, payload));
          patchState(store, (state) => ({
            orders: state.orders.map((order) => (order.id === id ? updated : order)),
          }));
        } catch {
          patchState(store, { error: 'Impossible de modifier la commande.' });
        }
      },

      /** Supprime une commande puis retire la ligne de la liste locale. */
      async remove(id: number): Promise<void> {
        patchState(store, { error: null });
        try {
          await firstValueFrom(http.delete<void>(`${apiUrl}/${id}`));
          patchState(store, (state) => ({
            orders: state.orders.filter((order) => order.id !== id),
          }));
        } catch {
          patchState(store, { error: 'Impossible de supprimer la commande.' });
        }
      },
    }),
  ),
);
