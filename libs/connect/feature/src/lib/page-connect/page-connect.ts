import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormConnect } from '@mini-crm/connect/ui';
import { Auth } from '@mini-crm/shared/data-access';
import { Credentials, RegisterInput } from '@mini-crm/shared/util';

@Component({
  selector: 'app-page-connect',
  imports: [FormConnect],
  templateUrl: './page-connect.html',
  styleUrl: './page-connect.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageConnect {
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  /** Données saisies par l'utilisateur, pilotées par le signal form. */
  protected readonly model = signal<Credentials>({ email: '', password: '' });

  /** Message d'erreur d'authentification, à afficher dans la page. */
  protected readonly error = signal<string | null>(null);

  /** Connexion : délègue au service puis redirige vers l'app en cas de succès. */
  protected connect(credentials: Credentials): void {
    this.error.set(null);
    this.auth.signin(credentials).subscribe({
      next: () => this.router.navigate(['/companies', 'list']),
      error: () => this.error.set('Email ou mot de passe incorrect.'),
    });
  }

  /** Inscription : crée le compte puis connecte (l'API renvoie un token). */
  protected createAccount(credentials: Credentials): void {
    this.error.set(null);
    // Le formulaire ne collecte pour l'instant que email + mot de passe ;
    // `nom`/`prenom` (requis par l'API) seront ajoutés au form signup → RegisterInput.
    const userData: RegisterInput = { ...credentials, nom: '', prenom: '' };
    this.auth.signup(userData).subscribe({
      next: () => this.router.navigate(['/companies', 'list']),
      error: () => this.error.set("L'inscription a échoué (email déjà utilisé ?)."),
    });
  }
}
