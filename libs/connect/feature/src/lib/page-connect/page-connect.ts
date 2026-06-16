import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormConnect } from '@mini-crm/connect/ui';
import { Credentials } from '@mini-crm/shared/util';
import { Router } from '@angular/router';
import { Auth } from '@mini-crm/shared/data-access';

@Component({
  selector: 'app-page-connect',
  imports: [FormConnect],
  templateUrl: './page-connect.html',
  styleUrl: './page-connect.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageConnect {
  // inject router
  private readonly router = inject(Router);
  // inject Auth
  private readonly auth = inject(Auth);

  /** Données saisies par l'utilisateur, pilotées par le signal form. */
  protected readonly model = signal<Credentials>({ email: '', password: '' });

  protected connect(credentials: Credentials): void {
    // Connexion simulée : le service met à jour l'état et redirige.
    this.auth.signin(credentials);
  }

  protected createAccount(credentials: Credentials): void {
    // TODO: brancher le service d'authentification (inscription)
  }
}
