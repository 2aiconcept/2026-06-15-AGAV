import { test, expect } from '@playwright/test';

/**
 * Tests e2e de la connexion (auth JWT). Locators par rôle / label (cf. règles a11y).
 * L'API d'auth est **stubbée** (`page.route`) — aucun appel réseau réel (règle e2e).
 */
test.describe('Connexion', () => {
  test("affiche le formulaire de connexion sur la page d'accueil", async ({ page }) => {
    await page.goto('/');

    // La route '' redirige vers '/connect'.
    await expect(page).toHaveURL(/\/connect$/);
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();

    // Le bouton reste désactivé tant que le formulaire est invalide (champs vides).
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeDisabled();
  });

  test('un utilisateur peut se connecter et arrive sur la liste des entreprises', async ({
    page,
  }) => {
    // Stub de l'auth : POST /api/auth/login → token + profil (pas de réseau réel).
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        json: {
          token: 'e2e-fake-token',
          user: { id: 1, email: 'user@test.com', nom: 'E2E', prenom: 'Test', role: 'user' },
        },
      });
    });
    // La page d'arrivée (liste) charge les entreprises : on renvoie une liste vide.
    await page.route('**/api/entreprises', (route) => route.fulfill({ json: [] }));

    await page.goto('/connect');

    await page.getByLabel('Adresse e-mail').fill('user@test.com');
    await page.getByLabel('Mot de passe').fill('password123');

    const submit = page.getByRole('button', { name: 'Se connecter' });
    await expect(submit).toBeEnabled();
    await submit.click();

    // signin() stocke le token puis redirige vers la liste des entreprises.
    await expect(page).toHaveURL(/\/companies\/list$/);
  });
});
