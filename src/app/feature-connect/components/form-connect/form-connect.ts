import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, output, signal } from '@angular/core';
import { Auth } from '../../../shared/services/auth';
import { Router } from '@angular/router';

import { email, form, minLength, required, FormField } from '@angular/forms/signals';
import { Credentials } from '../../../shared/models/credentials';

type ConnectMode = 'signin' | 'signup';
const PASSWORD_MIN_LENGTH = 6;

@Component({
  selector: 'app-form-connect',
  imports: [FormField],
  templateUrl: './form-connect.html',
  styleUrl: './form-connect.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormConnect {
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
  

  /** Signal form : valeur + validation déclarative. */
  protected readonly connectForm = form<Credentials>(this.modelForm, (path) => {
    required(path.email, {message : "Le format de l'email est obligatoire"});
    email(path.email, {message: "Le format de l'adresse email est invalide"});
    required(path.password, {message : "Le format de l'email est obligatoire"});
    minLength(path.password, PASSWORD_MIN_LENGTH, {message : `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`})
  })

  /** Soumission : route vers signin ou signup selon le mode. */
  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.connectForm().invalid()) {
      return;
    }
    const credentials = this.modelForm();
    if (this.mode() === 'signin') {
      this.signIn.emit(this.modelForm())
    } else {
      this.signUp.emit(this.modelForm())
    }
  }


}
