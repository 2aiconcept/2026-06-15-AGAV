import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
  output,
  signal,
  Signal,
} from '@angular/core';
import { email, form, minLength, required, FormField } from '@angular/forms/signals';
import { translateObjectSignal } from '@jsverse/transloco';
import { Credentials } from '@mini-crm/shared/util';

type ConnectMode = 'signin' | 'signup';
const PASSWORD_MIN_LENGTH = 6;

/** Forme des traductions du namespace `connect` (cf. `assets/i18n/*.json`). */
interface ConnectTranslations {
  signinTitle: string;
  signupTitle: string;
  email: string;
  password: string;
  signinButton: string;
  signupButton: string;
  noAccount: string;
  createAccountLink: string;
  haveAccount: string;
  signinLink: string;
  errors?: {
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordMinLength: string;
  };
}

@Component({
  selector: 'app-form-connect',
  imports: [FormField],
  templateUrl: './form-connect.html',
  styleUrl: './form-connect.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormConnect {
  /** Traductions du namespace `connect` — signal réactif au changement de langue. */
  // `| undefined` : le signal peut être vide tant que le fichier de langue n'est pas chargé
  // (d'où les `?.` côté template), et il se met à jour au changement de langue.
  protected readonly t = translateObjectSignal('connect') as Signal<ConnectTranslations | undefined>;

  // signal input()
  model = input.required<Credentials>();
  // signalOutput()
  signIn = output<Credentials>();
  signUp = output<Credentials>();
  readonly modelForm = linkedSignal<Credentials>(() => this.model());

  /** Mode courant : connexion (par défaut) ou inscription. */
  protected readonly mode = signal<ConnectMode>('signin');

  /** Bascule entre le formulaire de connexion et celui d'inscription. */
  protected toggleMode(): void {
    this.mode.update((current) => (current === 'signin' ? 'signup' : 'signin'));
  }

  /**
   * Signal form : validation déclarative. Les messages ne sont PAS définis ici — ils sont
   * affichés (traduits) côté template selon l'état du champ, pour rester réactifs à la langue.
   */
  protected readonly connectForm = form<Credentials>(this.modelForm, (path) => {
    required(path.email);
    email(path.email);
    required(path.password);
    minLength(path.password, PASSWORD_MIN_LENGTH);
  });

  /** Soumission : route vers signin ou signup selon le mode. */
  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.connectForm().invalid()) {
      return;
    }
    const credentials = this.modelForm();
    if (this.mode() === 'signin') {
      this.signIn.emit(credentials);
    } else {
      this.signUp.emit(credentials);
    }
  }
}
