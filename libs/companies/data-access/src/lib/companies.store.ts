import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Company, CompanyPayload } from '@mini-crm/companies/util';
import { API_BASE_URL } from '@mini-crm/shared/util';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

type CompaniesState = {
  companies: Company[];
  isLoading: boolean;
  error: string | null;
};

const initialState: CompaniesState = {
  companies: [],
  isLoading: false,
  error: null,
};

export const CompaniesState = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, http = inject(HttpClient), apiUrl = `${inject(API_BASE_URL)}/entreprises`) => ({
      async load(): Promise<void> {
        patchState(store, { isLoading: true, error: null });
        try {
          const companies = await firstValueFrom(http.get<Company[]>(apiUrl));
          patchState(store, { companies: companies, isLoading: false });
        } catch {
          patchState(store, { error: 'Impossible de charger les commandes.', isLoading: false });
        }
      },
      async loadOne(id: number): Promise<Company | null> {
        patchState(store, { isLoading: true, error: null });
        try {
          patchState(store, { isLoading: false });
          return await firstValueFrom(http.get<Company>(`${apiUrl}/${id}`));
        } catch {
          patchState(store, { error: 'Impossible de charger la commande.', isLoading: false });
          return null;
        }
      },
      async update(id: number, payload: CompanyPayload): Promise<void> {
        patchState(store, { isLoading: true, error: null });
        try {
          const updated = await firstValueFrom(http.put<Company>(`${apiUrl}/${id}`, payload));
          patchState(store, (state) => ({
            // utile uniquement si le form et le tableau sont sur le meme template html et que load() jamais rappelé apres l'update
            companies: state.companies.map((company) => (company.id === id ? updated : company)),
            isLoading: false,
          }));
        } catch {
          patchState(store, { isLoading: false, error: 'Impossible de modifier la commande.' });
        }
      },
      async add(payload: CompanyPayload): Promise<void> {
        patchState(store, { isLoading: true, error: null });
        try {
          const created = await firstValueFrom(http.post<Company>(apiUrl, payload));
          patchState(store, (state) => ({
            isLoading: false,
            companies: [...state.companies, created],
          }));
        } catch {
          patchState(store, { isLoading: false, error: 'Impossible de créer la commande.' });
        }
      },
      async remove(id: number): Promise<void> {
        patchState(store, { error: null });
        try {
          await firstValueFrom(http.delete<void>(`${apiUrl}/${id}`));
          patchState(store, (state) => ({
            companies: state.companies.filter((item) => item.id !== id),
          }));
        } catch {
          patchState(store, { error: 'Impossible de supprimer la commande.' });
        }
      },
    }),
  ),
);
