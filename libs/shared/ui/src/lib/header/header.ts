import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * En-tête applicatif — composant présentationnel pur (lib `ui`, sans dépendance `data-access`).
 * L'état d'authentification et la déconnexion sont fournis/remontés par le shell (`App`),
 * qui est le seul à connaître le service `Auth`.
 */
@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  /** Indique si un utilisateur est connecté (pilote l'affichage du bloc de droite). */
  readonly isAuthenticated = input(false);
  /** Email de l'utilisateur connecté, ou `null` si déconnecté. */
  readonly userEmail = input<string | null>(null);
  /** Émis au clic sur « Déconnexion » ; le shell appelle `Auth.logout()`. */
  readonly logout = output<void>();
}
