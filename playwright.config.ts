import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright (tests e2e).
 * Doc : https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Dossier où se trouvent les specs e2e (à créer : `e2e/*.spec.ts`).
  testDir: './e2e',

  // Exécute les tests d'un même fichier en parallèle.
  fullyParallel: true,

  // En CI, échoue si un `test.only` a été oublié dans le code.
  forbidOnly: !!process.env['CI'],

  // Rejoue les tests instables uniquement en CI (0 en local pour un retour immédiat).
  retries: process.env['CI'] ? 2 : 0,

  // En CI on fige à 1 worker pour des résultats déterministes ; en local Playwright décide.
  workers: process.env['CI'] ? 1 : undefined,

  // Rapport HTML consultable avec `npx playwright show-report`.
  reporter: 'html',

  use: {
    // URL de base : permet d'écrire `page.goto('/')` au lieu de l'URL complète.
    baseURL: 'http://localhost:4200',

    // Capture une trace rejouable (Trace Viewer) au 1er échec, pour déboguer.
    trace: 'on-first-retry',
  },

  // Navigateurs ciblés. On démarre sur Chromium ; décommenter pour le cross-browser.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
  ],

  // Démarre automatiquement l'app (ng serve) avant les tests, puis l'arrête.
  // En local, réutilise un serveur déjà lancé (`npm start`) au lieu d'en relancer un.
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
