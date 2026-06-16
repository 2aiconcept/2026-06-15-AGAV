/** Statuts possibles d'une opportunité (l'API renvoie aussi « Nouveau » par défaut, hors enum doc). */
export type StatutOrder = 'Nouveau' | 'Prospect' | 'En cours' | 'Gagne' | 'Perdu';

/** Une « commande »/opportunité telle que renvoyée par l'API (`GET /api/opportunites`). */
export interface Order {
  id: number;
  titre: string;
  description: string;
  montant: number;
  statut: StatutOrder;
  contact_id: number | null;
  entreprise_id: number | null;
}

// payload sans id, pour l'ajout et l'édition
export type OrderPayload = Omit<Order, 'id'>;
