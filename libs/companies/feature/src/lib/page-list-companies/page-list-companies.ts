import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesState } from '@mini-crm/companies/data-access';
import { TableCompany } from '@mini-crm/companies/ui';
import { ConfirmDialog } from '@mini-crm/shared/ui';

@Component({
  selector: 'app-page-list-companies',
  imports: [TableCompany, ConfirmDialog],
  templateUrl: './page-list-companies.html',
  styleUrl: './page-list-companies.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageListCompanies {
  private readonly store = inject(CompaniesState);
  private readonly router = inject(Router);

  // Signaux du store, exposés au template (alias).
  protected readonly companies = this.store.entities;
  protected readonly error = this.store.error;

  /** Id de l'entreprise en attente de confirmation de suppression (null = modale fermée). */
  protected readonly pendingDeleteId = signal<number | null>(null);

  constructor() {
    this.store.load();
  }

  /** Redirige vers le formulaire d'ajout d'une entreprise. */
  protected onAddCompany(): void {
    this.router.navigate(['companies', 'add']);
  }

  /** Redirige vers le formulaire d'édition. */
  protected editItem(id: number): void {
    this.router.navigate(['companies', 'edit', id]);
  }

  /** Confirmation : supprime réellement via le store puis referme la modale. */
  protected confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id !== null) {
      this.store.remove(id);
    }
    this.pendingDeleteId.set(null);
  }
}
