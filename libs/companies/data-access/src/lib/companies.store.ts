import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Company } from '@mini-crm/companies/util';
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
    }),
  ),
);
