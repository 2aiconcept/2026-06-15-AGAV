import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding : lie les paramètres de route (ex. :id) aux input() du composant.
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideHttpClient()
  ]
};

// montrer dans la doc pourquoi les .then sont inutiles dans le lazyloading de components
// monter comment modeifier angular.json pour avoir d'offiche le OnPush à la creation de components avec angular cli
// exercice découpage des rolutes pour toutes les features
// envrironements avec switch dev vs prod dans angular.json 
// libs et nx