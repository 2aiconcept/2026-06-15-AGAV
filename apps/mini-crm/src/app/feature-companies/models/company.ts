/** Une entreprise telle que renvoyée par l'API (`GET /api/entreprises`). */
export interface Company {
  id: number;
  nom: string;
  secteur: string;
  adresse: string;
  telephone: string;
}

// type CompanyPayload specific to add without id
export type CompanyPayload = Omit<Company, 'id'>;
