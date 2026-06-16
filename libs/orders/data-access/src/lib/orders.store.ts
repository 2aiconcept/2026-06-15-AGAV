import { signalStore } from '@ngrx/signals';
import { withCrud } from '@mini-crm/shared/data-access';
import { Order } from '@mini-crm/orders/util';

/**
 * Store des commandes (opportunités).
 *
 * VERSION ACTIVE — V3 : tout le CRUD est factorisé dans la feature générique `withCrud<T>`
 * (`libs/shared/data-access/src/lib/with-crud.ts`). Le store tient en une ligne.
 * API exposée : `entities`, `isLoading`, `error` + `load` / `loadOne` / `add` / `update` / `remove`.
 */
export const OrdersStore = signalStore({ providedIn: 'root' }, withCrud<Order>('opportunites'));

/* =============================================================================================
 * HISTORIQUE PÉDAGOGIQUE — versions précédentes conservées pour comparaison (tout en commentaire,
 * aucun impact sur le build). Progression : V1 (sans withEntities) → V2 (avec withEntities) → V3
 * (withCrud générique, ci-dessus).
 * =============================================================================================
 */

/* ----------------------------------------------------------------------------------------------
 * V1 — store explicite, SANS withEntities : état = tableau `orders`, mises à jour `patchState`
 *      « à la main » (spreads filter/map). Le plus pédagogique pour voir la mécanique.
 * ----------------------------------------------------------------------------------------------
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { Order, OrderPayload } from '@mini-crm/orders/util';
import { API_BASE_URL } from '@mini-crm/shared/util';

type OrdersState = { orders: Order[]; isLoading: boolean; error: string | null };
const initialState: OrdersState = { orders: [], isLoading: false, error: null };

export const OrdersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, http = inject(HttpClient), apiUrl = `${inject(API_BASE_URL)}/opportunites`) => ({
    async load(): Promise<void> {
      patchState(store, { isLoading: true, error: null });
      try {
        const orders = await firstValueFrom(http.get<Order[]>(apiUrl));
        patchState(store, { orders, isLoading: false });
      } catch {
        patchState(store, { error: 'Impossible de charger les commandes.', isLoading: false });
      }
    },
    async loadOne(id: number): Promise<Order | null> {
      patchState(store, { error: null });
      try {
        return await firstValueFrom(http.get<Order>(`${apiUrl}/${id}`));
      } catch {
        patchState(store, { error: 'Impossible de charger la commande.' });
        return null;
      }
    },
    async add(payload: OrderPayload): Promise<void> {
      patchState(store, { error: null });
      try {
        const created = await firstValueFrom(http.post<Order>(apiUrl, payload));
        patchState(store, (state) => ({ orders: [...state.orders, created] }));
      } catch {
        patchState(store, { error: 'Impossible de créer la commande.' });
      }
    },
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
  })),
);
 * ----------------------------------------------------------------------------------------------
 * fin V1
 * ----------------------------------------------------------------------------------------------
 */

/* ----------------------------------------------------------------------------------------------
 * V2 — AVEC withEntities : collection normalisée (entityMap/ids + signal `entities`). Les mises à
 *      jour passent par les updaters prêts (setAllEntities/addEntity/updateEntity/removeEntity).
 *      Côté page liste : on lit `store.entities()` au lieu de `store.orders()`.
 * ----------------------------------------------------------------------------------------------
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  addEntity, removeEntity, setAllEntities, updateEntity, withEntities,
} from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { Order, OrderPayload } from '@mini-crm/orders/util';
import { API_BASE_URL } from '@mini-crm/shared/util';

export const OrdersStore = signalStore(
  { providedIn: 'root' },
  withState<{ isLoading: boolean; error: string | null }>({ isLoading: false, error: null }),
  withEntities<Order>(),
  withMethods((store, http = inject(HttpClient), apiUrl = `${inject(API_BASE_URL)}/opportunites`) => ({
    async load(): Promise<void> {
      patchState(store, { isLoading: true, error: null });
      try {
        const orders = await firstValueFrom(http.get<Order[]>(apiUrl));
        patchState(store, setAllEntities(orders), { isLoading: false });
      } catch {
        patchState(store, { error: 'Impossible de charger les commandes.', isLoading: false });
      }
    },
    async loadOne(id: number): Promise<Order | null> {
      patchState(store, { error: null });
      try {
        return await firstValueFrom(http.get<Order>(`${apiUrl}/${id}`));
      } catch {
        patchState(store, { error: 'Impossible de charger la commande.' });
        return null;
      }
    },
    async add(payload: OrderPayload): Promise<void> {
      patchState(store, { error: null });
      try {
        const created = await firstValueFrom(http.post<Order>(apiUrl, payload));
        patchState(store, addEntity(created));
      } catch {
        patchState(store, { error: 'Impossible de créer la commande.' });
      }
    },
    async update(id: number, payload: OrderPayload): Promise<void> {
      patchState(store, { error: null });
      try {
        const updated = await firstValueFrom(http.put<Order>(`${apiUrl}/${id}`, payload));
        patchState(store, updateEntity({ id, changes: updated }));
      } catch {
        patchState(store, { error: 'Impossible de modifier la commande.' });
      }
    },
    async remove(id: number): Promise<void> {
      patchState(store, { error: null });
      try {
        await firstValueFrom(http.delete<void>(`${apiUrl}/${id}`));
        patchState(store, removeEntity(id));
      } catch {
        patchState(store, { error: 'Impossible de supprimer la commande.' });
      }
    },
  })),
);
 * ----------------------------------------------------------------------------------------------
 * fin V2
 * ----------------------------------------------------------------------------------------------
 */
