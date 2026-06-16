import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  /** Ouvre (true) ou ferme (false) la boîte de dialogue. */
  readonly open = input.required<boolean>();

  /** Textes affichés, personnalisables par la feature appelante. */
  readonly title = input('Confirmation');
  readonly message = input('Êtes-vous sûr ?');
  readonly confirmLabel = input('Confirmer');
  readonly cancelLabel = input('Annuler');

  /** Événements émis vers le parent : action confirmée ou annulée. */
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  // Référence à l'élément <dialog> natif pour piloter son ouverture modale.
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    // Synchronise l'état natif du <dialog> avec l'input `open`.
    effect(() => {
      const element = this.dialog()?.nativeElement;
      if (!element) {
        return;
      }
      if (this.open()) {
        if (!element.open) {
          element.showModal(); // ouverture MODALE : focus piégé, backdrop, Échap
        }
      } else if (element.open) {
        element.close();
      }
    });
  }
}
