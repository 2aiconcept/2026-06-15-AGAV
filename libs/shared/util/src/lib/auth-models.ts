import { Credentials } from './credentials';

/**
 * Données d'inscription (`POST /api/auth/register`).
 * Étend les identifiants de connexion avec l'identité de l'utilisateur.
 */
export interface RegisterInput extends Credentials {
  nom: string;
  prenom: string;
}

/** Profil utilisateur renvoyé par l'API (champ `user` de l'auth, `GET /api/auth/profile`). */
export interface UserProfile {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

/** Réponse d'authentification (`login` / `register`) : token JWT + profil. */
export interface AuthResponse {
  token: string;
  user: UserProfile;
}
