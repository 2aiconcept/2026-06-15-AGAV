import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

/**
 * Bascule de langue FR ⇄ EN. Composant autonome : il injecte `TranslocoService`
 * (lib npm, pas une lib `@mini-crm` → aucune entorse aux boundaries) et expose la
 * langue active en **signal**.
 */
@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private readonly transloco = inject(TranslocoService);

  /** Langue active, exposée en signal (réactif au changement de langue). */
  protected readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  /** Bascule entre français et anglais. */
  protected toggle(): void {
    this.transloco.setActiveLang(this.transloco.getActiveLang() === 'fr' ? 'en' : 'fr');
  }
}
