import { signalStore } from '@ngrx/signals';
import { withCrud } from '@mini-crm/shared/data-access';
import { Company } from '@mini-crm/companies/util';

export const CompaniesState = signalStore({ providedIn: 'root' }, withCrud<Company>('entreprises'));

// type CompaniesState = {
//   companies: Company[];
//   isLoading: boolean;
//   error: string | null;
// };

// const initialState: CompaniesState = {
//   companies: [],
//   isLoading: false,
//   error: null,
// };

// export const CompaniesState = signalStore(
//   { providedIn: 'root' },
//   withState(initialState),
//   withEntities<Company>(),
//   withMethods(
//     (store, http = inject(HttpClient), apiUrl = `${inject(API_BASE_URL)}/entreprises`) => ({
//       async load(): Promise<void> {
//         patchState(store, { isLoading: true, error: null });
//         try {
//           const companies = await firstValueFrom(http.get<Company[]>(apiUrl));
//           patchState(store, setAllEntities(companies), { isLoading: false });
//         } catch {
//           patchState(store, { error: 'Impossible de charger les commandes.', isLoading: false });
//         }
//       },
//       async loadOne(id: number): Promise<Company | null> {
//         patchState(store, { isLoading: true, error: null });
//         try {
//           patchState(store, { isLoading: false });
//           return await firstValueFrom(http.get<Company>(`${apiUrl}/${id}`));
//         } catch {
//           patchState(store, { error: 'Impossible de charger la commande.', isLoading: false });
//           return null;
//         }
//       },
//       async update(id: number, payload: CompanyPayload): Promise<void> {
//         patchState(store, { isLoading: true, error: null });
//         try {
//           const updated = await firstValueFrom(http.put<Company>(`${apiUrl}/${id}`, payload));
//           patchState(store, updateEntity({ id, changes: updated }));
//         } catch {
//           patchState(store, { isLoading: false, error: 'Impossible de modifier la commande.' });
//         }
//       },
//       async add(payload: CompanyPayload): Promise<void> {
//         patchState(store, { isLoading: true, error: null });
//         try {
//           const created = await firstValueFrom(http.post<Company>(apiUrl, payload));
//           patchState(store, addEntity(created));
//         } catch {
//           patchState(store, { isLoading: false, error: 'Impossible de créer la commande.' });
//         }
//       },
//       async remove(id: number): Promise<void> {
//         patchState(store, { error: null });
//         try {
//           await firstValueFrom(http.delete<void>(`${apiUrl}/${id}`));
//           patchState(store, removeEntity(id));
//         } catch {
//           patchState(store, { error: 'Impossible de supprimer la commande.' });
//         }
//       },
//     }),
//   ),
// );

// }
