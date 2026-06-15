import { Component, input, output } from '@angular/core';
import { Company } from '../../models/company';

@Component({
  selector: 'app-table-company',
  imports: [],
  templateUrl: './table-company.html',
  styleUrl: './table-company.css',
})
export class TableCompany {
  /** Liste à afficher, fournie par le composant parent (la page). */
  readonly companies = input.required<Company[]>();

  /** Émis quand l'utilisateur veut éditer une entreprise (transporte l'id). */
  readonly editCompany = output<number>()

  /** Émis quand l'utilisateur veut supprimer une entreprise (transporte l'id). */
  readonly deleteCompany = output<number>()

  protected editCompanyFn(id: number) {
    this.editCompany.emit(id)
  }

  protected deleteCompanyFn(id: number) {
    this.deleteCompany.emit(id)
  }
  
}
