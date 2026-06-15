import { Component, computed, inject, input, numberAttribute, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company';
import { Company, CompanyPayload } from '../../models/company';
import { FormCompany } from '../../components/form-company/form-company';

@Component({
  selector: 'app-page-edit-company',
  imports: [FormCompany],
  templateUrl: './page-edit-company.html',
  styleUrl: './page-edit-company.css',
})
export default class PageEditCompany implements OnInit {
  private readonly companyService = inject(CompanyService);
  private readonly router = inject(Router);

  /** Id lié depuis la route `edit-company/:id` (withComponentInputBinding), converti en nombre. */
  readonly id = input.required<number, string>({ transform: numberAttribute });

  /** Entreprise chargée depuis l'API (null tant que le chargement n'est pas terminé). */
  private readonly company = signal<Company | null>(null);

  /** Message d'erreur éventuel (chargement ou enregistrement). */
  protected readonly error = signal<string | null>(null);

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

  ngOnInit(): void {
    // Chargement depuis l'API (source de vérité), pas depuis la collection locale : données
    // fraîches même si un autre utilisateur a modifié l'entreprise, et fonctionne en accès
    // direct / refresh de l'URL (où la collection locale serait vide).
    this.companyService.getOne(this.id()).subscribe({
      next: (company) => this.company.set(company),
      error: () => this.error.set("Impossible de charger l'entreprise."),
    });
  }

  /** Reçoit les données valides du formulaire, enregistre puis revient à la liste. */
  protected onSave(payload: CompanyPayload): void {
    this.error.set(null);
    this.companyService.update(this.id(), payload).subscribe({
      next: () => this.router.navigate(['/list-companies']),
      error: () => this.error.set("Impossible d'enregistrer les modifications."),
    });
  }
}
