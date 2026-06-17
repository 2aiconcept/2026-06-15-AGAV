import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesState, CompanyService } from '@mini-crm/companies/data-access';
import { Company, CompanyPayload } from '@mini-crm/companies/util';
import { FormCompany } from '@mini-crm/companies/ui';

@Component({
  selector: 'app-page-edit-company',
  imports: [FormCompany],
  templateUrl: './page-edit-company.html',
  styleUrl: './page-edit-company.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageEditCompany implements OnInit {
  private readonly store = inject(CompaniesState);
  private readonly router = inject(Router);

  /** Id lié depuis la route `edit-company/:id` (withComponentInputBinding), converti en nombre. */
  readonly id = input.required<number, string>({ transform: numberAttribute });

  /** Entreprise chargée depuis l'API (null tant que le chargement n'est pas terminé). */
  private readonly company = signal<Company | null>(null);

  /** Message d'erreur éventuel (chargement ou enregistrement). */
  protected readonly error = this.store.error;

  /** Valeurs initiales du formulaire, sans l'id (le formulaire ne manipule que le payload). */
  protected readonly initialValue = computed<CompanyPayload | null>(() => {
    const company = this.company();
    if (!company) {
      return null;
    }
    return {
      nom: company.nom,
      secteur: company.secteur,
      adresse: company.adresse,
      telephone: company.telephone,
    };
  });

  async ngOnInit(): Promise<void> {
    // Chargement depuis l'API (source de vérité), pas depuis la collection locale : données
    // fraîches même si un autre utilisateur a modifié l'entreprise, et fonctionne en accès
    // direct / refresh de l'URL (où la collection locale serait vide).
    // this.companiesStore.loadOne(this.id());
    this.company.set(await this.store.loadOne(this.id()));
  }

  /** Reçoit les données valides du formulaire, enregistre puis revient à la liste. */
  protected onSave(payload: CompanyPayload): void {
    this.store.update(this.id(), payload);
    if (!this.store.error()) {
      this.router.navigate(['companies', 'list']);
    }
  }
}
