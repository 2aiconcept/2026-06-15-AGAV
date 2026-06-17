import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { API_BASE_URL } from '@mini-crm/shared/util';
import { authInterceptor } from '@mini-crm/shared/data-access';
import { TranslocoHttpLoader } from './transloco-loader';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(), //  plus de Zone.js : CD pilotée par les signals
    // withComponentInputBinding : lie les paramètres de route (ex. :id) aux input() du composant.
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    // L'app (et elle seule) connaît l'environnement : elle fournit l'URL d'API aux libs data-access.
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    // i18n : FR par défaut, EN dispo, changement de langue à chaud (reRenderOnLangChange).
    provideTransloco({
      config: {
        availableLangs: ['fr', 'en'],
        defaultLang: 'fr',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
