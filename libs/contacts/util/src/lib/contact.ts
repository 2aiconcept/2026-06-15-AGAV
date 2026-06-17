/** Un contact tel que renvoyé par l'API (`GET /api/contacts`). */
export interface Contact {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise_id: number | null;
}

// payload sans id, pour l'ajout et l'édition
export type ContactPayload = Omit<Contact, 'id'>;
