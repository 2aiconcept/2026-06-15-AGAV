import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  // propriete auth = inject du servce pour pouvoir utiliser auth.isAuthenticated du service dan le html
  protected readonly auth = inject(Auth);
  // protected logout() pour déconnexion via une methode du service
  protected logout(): void {
    this.auth.logout();
  }
}
