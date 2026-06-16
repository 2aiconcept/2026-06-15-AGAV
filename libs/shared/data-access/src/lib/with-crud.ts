import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '@mini-crm/shared/util';

/** Toute entité gérée par withCrud doit avoir un `id` numérique (clé de la collection). */
export type WithId = { id: number };

/**
 * Feature générique CRUD pour SignalStore : état (`isLoading`, `error`) + collection normalisée
 * (`withEntities`) + méthodes `load` / `loadOne` / `add` / `update` / `remove` (HTTP + updaters).
 *
 * Un store devient alors trois lignes :
 *   export const OrdersStore = signalStore(
 *     { providedIn: 'root' },
 *     withCrud<Order>('opportunites'),
 *   );
 *
 * - `T` : le type d'entité (doit avoir un `id`).
 * - `resource` : segment d'URL ajouté à `API_BASE_URL` (ex. 'entreprises', 'opportunites').
 * - Collection exposée via le signal `entities` (+ `entityMap`, `ids`).
 */
export function withCrud<T extends WithId>(resource: string) {
  return signalStoreFeature(
    withEntities<T>(),
    withState<{ isLoading: boolean; error: string | null }>({ isLoading: false, error: null }),
    withMethods(
      (store, http = inject(HttpClient), url = `${inject(API_BASE_URL)}/${resource}`) => ({
        /** Charge toute la collection. */
        async load(): Promise<void> {
          patchState(store, { isLoading: true, error: null });
          try {
            const items = await firstValueFrom(http.get<T[]>(url));
            patchState(store, setAllEntities(items), { isLoading: false });
          } catch {
            patchState(store, { error: 'Impossible de charger les données.', isLoading: false });
          }
        },

        /** Charge un élément par id (pré-remplissage d'édition). Renvoie null + pose `error` si échec. */
        async loadOne(id: number): Promise<T | null> {
          patchState(store, { error: null });
          try {
            return await firstValueFrom(http.get<T>(`${url}/${id}`));
          } catch {
            patchState(store, { error: 'Impossible de charger l’élément.' });
            return null;
          }
        },

        /** Crée un élément et l'ajoute à la collection. */
        async add(payload: Omit<T, 'id'>): Promise<void> {
          patchState(store, { error: null });
          try {
            const created = await firstValueFrom(http.post<T>(url, payload));
            patchState(store, addEntity(created));
          } catch {
            patchState(store, { error: 'Impossible de créer l’élément.' });
          }
        },

        /** Met à jour un élément. */
        async update(id: number, payload: Omit<T, 'id'>): Promise<void> {
          patchState(store, { error: null });
          try {
            const updated = await firstValueFrom(http.put<T>(`${url}/${id}`, payload));
            patchState(store, updateEntity({ id, changes: updated }));
          } catch {
            patchState(store, { error: 'Impossible de modifier l’élément.' });
          }
        },

        /** Supprime un élément. */
        async remove(id: number): Promise<void> {
          patchState(store, { error: null });
          try {
            await firstValueFrom(http.delete<void>(`${url}/${id}`));
            patchState(store, removeEntity(id));
          } catch {
            patchState(store, { error: 'Impossible de supprimer l’élément.' });
          }
        },
      }),
    ),
  );
}
