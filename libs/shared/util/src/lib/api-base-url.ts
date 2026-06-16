import { InjectionToken } from '@angular/core';

/**
 * URL de base de l'API mini-CRM.
 *
 * Fournie par l'application (depuis son `environment`), jamais par une lib : une lib ne doit pas
 * importer `environment.ts` (couplage interdit entre une lib et une app spécifique en Nx).
 * Les services `data-access` lisent la valeur via `inject(API_BASE_URL)`.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
