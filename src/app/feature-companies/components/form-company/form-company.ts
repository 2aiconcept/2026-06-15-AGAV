import { Component, input, output, signal } from '@angular/core';
import { CompanyPayload } from '../../models/company';
import { form, FormField, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-form-company',
  imports: [FormField],
  templateUrl: './form-company.html',
  styleUrl: './form-company.css',
})
export class FormCompany {

  /** Valeurs initiales : vides pour l'ajout, pré-remplies pour l'édition (réutilisable). */
  readonly initialValue = input<CompanyPayload>({ nom: '', secteur: '', adresse: '', telephone: '' });

  /** Libellé du bouton de soumission (ex. « Ajouter » ou « Enregistrer »). */
  readonly submitLabel = input('Enregistrer');

  /** Émis avec les données valides à la soumission ; le parent décide quoi en faire. */
  readonly save = output<CompanyPayload>();

    /** Données saisies, pilotées par le signal form. */
  private readonly model = signal<CompanyPayload>({ nom: '', secteur: '', adresse: '', telephone: '' });

  /** Signal form : valeur + validation déclarative. */
  protected readonly companyForm = form(this.model, (path) => {
    required(path.nom, { message: 'Le nom est obligatoire.' });
    required(path.secteur, { message: 'Le secteur est obligatoire.' });
    required(path.adresse, { message: "L'adresse est obligatoire." });
    required(path.telephone, { message: 'Le téléphone est obligatoire.' });
  });

  ngOnInit(): void {
    // Recopie les valeurs initiales dans le formulaire.
    // Sans effet en ajout (valeurs vides), utile en édition (valeurs pré-remplies).
    this.model.set({ ...this.initialValue() });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.companyForm().invalid()) {
      return;
    }
    this.save.emit(this.model());
  }
}
