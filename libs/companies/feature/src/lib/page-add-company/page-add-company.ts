import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CompanyService } from '@mini-crm/companies/data-access';
import { Router } from '@angular/router';
import { CompanyPayload } from '@mini-crm/companies/util';
import { FormCompany } from '@mini-crm/companies/ui';

@Component({
  selector: 'app-page-add-company',
  imports: [FormCompany],
  templateUrl: './page-add-company.html',
  styleUrl: './page-add-company.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageAddCompany {
  private readonly companyService = inject(CompanyService);
  private readonly router = inject(Router);

  protected readonly error = signal<string | null>(null);

  /** Reçoit les données valides du formulaire,
   * crée l'entreprise puis revient à la liste. */
  protected onSave(payload: CompanyPayload): void {
    this.error.set(null);
    this.companyService.create(payload).subscribe({
      next: () => this.router.navigate(['/list-companies']),
      error: () => this.error.set("Impossible d'ajouter l'entreprise."),
    });
  }
}
