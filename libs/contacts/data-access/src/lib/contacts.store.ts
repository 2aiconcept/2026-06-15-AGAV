import { signalStore } from '@ngrx/signals';
import { withCrud } from '@mini-crm/shared/data-access';
import { Contact } from '@mini-crm/contacts/util';

/**
 * Store des contacts — câblé sur la feature générique `withCrud<T>` (`shared/data-access`).
 * API exposée : `entities`, `isLoading`, `error` + `load` / `loadOne` / `add` / `update` / `remove`.
 */
export const ContactsStore = signalStore({ providedIn: 'root' }, withCrud<Contact>('contacts'));
