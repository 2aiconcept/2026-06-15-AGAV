import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  API_BASE_URL,
  AuthResponse,
  Credentials,
  RegisterInput,
  UserProfile,
} from '@mini-crm/shared/util';

// Clés de persistance de la session dans le localStorage.
const TOKEN_KEY = 'mini-crm.token';
const USER_KEY = 'mini-crm.user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  // Base auth construite depuis le token API_BASE_URL (une lib n'importe pas environment.ts).
  private readonly authUrl = `${inject(API_BASE_URL)}/auth`;
  // SSR-safe : sur le serveur, pas d'accès au localStorage.
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // État de session. Initialisé à null (SSR-safe), restauré côté navigateur au démarrage.
  private readonly tokenSignal = signal<string | null>(null);
  private readonly userSignal = signal<UserProfile | null>(null);

  // Token JWT à joindre aux requêtes (futur interceptor).
  readonly token = this.tokenSignal.asReadonly();
  // Email de l'utilisateur connecté (ou null) — consommé par l'en-tête.
  readonly currentUser = computed(() => this.userSignal()?.email ?? null);
  // Connecté dès qu'un token est présent.
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);

  constructor() {
    this.restoreSession();
  }

  /** Connexion : `POST /api/auth/login`. Le composant gère la navigation et les erreurs. */
  signin(credentials: Credentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authUrl}/login`, credentials)
      .pipe(tap((response) => this.storeSession(response)));
  }

  /** Inscription : `POST /api/auth/register`. Renvoie un token comme le login. */
  signup(userData: RegisterInput): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authUrl}/register`, userData)
      .pipe(tap((response) => this.storeSession(response)));
  }

  /** Déconnecte l'utilisateur et redirige vers la page de connexion. */
  logout(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.router.navigate(['/connect']);
  }

  // Persiste token + profil (navigateur uniquement) et met à jour l'état exposé.
  private storeSession(response: AuthResponse): void {
    this.tokenSignal.set(response.token);
    this.userSignal.set(response.user);
    if (this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
  }

  // Restaure la session depuis le localStorage (navigateur uniquement) au démarrage.
  private restoreSession(): void {
    if (!this.isBrowser) {
      return;
    }
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    if (token && userJson) {
      this.tokenSignal.set(token);
      this.userSignal.set(JSON.parse(userJson) as UserProfile);
    }
  }
}
