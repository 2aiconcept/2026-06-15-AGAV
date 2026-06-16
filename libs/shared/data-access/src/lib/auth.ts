import { computed, inject, Injectable, signal } from '@angular/core';
import { Credentials } from '@mini-crm/shared/util';
import { Router } from '@angular/router';

// Clé sous laquelle l'email connecté est stocké dans le localStorage.
const STORAGE_KEY = 'mini-crm.user-email';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // État privé : email de l'utilisateur connecté, ou null si déconnecté.
  // Initialisé depuis le localStorage pour survivre à un rechargement de page.
  // Seul le service peut le modifier.
  private readonly userEmail = signal<string | null>(localStorage.getItem(STORAGE_KEY));
  // Exposition en lecture seule pour les composants (encapsulation).
  readonly currentUser = this.userEmail.asReadonly();

  private readonly router = inject(Router);

  public test = signal('christophe');

  // État dérivé : connecté dès qu'un email est présent.
  readonly isAuthenticated = computed(() => this.userEmail() !== null);

  signin(credentials: Credentials): void {
    console.log(credentials);
    // appel http (sur l'avance)
    // maj signal with user email from connect form
    this.userEmail.set(credentials.email);
    // email in localstore to keep connection if user refresh web page
    localStorage.setItem(STORAGE_KEY, credentials.email);
    // redirection vers une route
    this.router.navigate(['/companies', 'list']);
  }

  signup() {
    // aller sur signup
  }

  /** Déconnecte l'utilisateur et redirige vers la page de connexion. */
  logout(): void {
    this.userEmail.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/connect']);
  }
}
