import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CompanyService } from '../../services/company';
import { Router } from '@angular/router';
import { TableCompany } from '../../components/table-company/table-company';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-page-list-companies',
  imports: [TableCompany, ConfirmDialog],
  templateUrl: './page-list-companies.html',
  styleUrl: './page-list-companies.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageListCompanies implements OnInit {
  // INJECT COMPANY SERVICE
  private readonly companyService = inject(CompanyService);

  // INJECT ROUTER
  private readonly router = inject(Router);

  // SIGNAL FOR COMPANIES COLLECTION
  protected readonly companies = this.companyService.companies;
  // SIGNAL FOR API ERRORS
  protected readonly error = this.companyService.error;

  // Id de l'entreprise dont la suppression est en attente de confirmation
  // (null = aucune confirmation en cours, la modale est fermée).
  protected readonly pendingDeleteId = signal<number | null>(null);

   // Entreprise correspondante, pour afficher son nom dans la confirmation.
  private readonly pendingCompany = computed(() =>
    this.companies().find((company) => company.id === this.pendingDeleteId()) ?? null,
  );

  protected readonly confirmMessage = computed(() => {
    const company = this.pendingCompany();
    return company
      ? `Voulez-vous vraiment supprimer « ${company.nom} » ? Cette action est irréversible.`
      : '';
  });

  ngOnInit(): void {
    this.companyService.load();
    console.log(this.companies())
  }


  // SIGNAL  COMPUTED TO PASS COMPANY NAME TO DIALOG BOX WITH PERSONNAL MESSAGE

  // METHOD TO REDIRECT TO ADD
  /** Redirige vers le formulaire d'ajout d'une entreprise. */
  protected onAddCompany(): void {
    this.router.navigate(['companies','add']);
  }

  editItem(id: number) {
    this.router.navigate(['companies','edit', id])
  }

  /** Clic sur « Supprimer » : ouvre la confirmation (ne supprime pas encore). */
  protected onDeleteRequest(id: number): void {
    this.pendingDeleteId.set(id);
  }

  /** Confirmation : supprime réellement puis referme la modale. */
  protected confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id !== null) {
      this.companyService.remove(id);
    }
    this.pendingDeleteId.set(null);
  }

  /** Annulation : referme la modale sans rien supprimer. */
  protected cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }


  // METHOD TO OPEN DIALOG BOX

  // MMETHOD TO DELELE AFTER CONFIRM DELETE IN DIALOG BOX

  // METHOD TO CANCEL A DELETE AFTER DIALOG BOX




   
}
