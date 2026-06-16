import { test, expect } from '@playwright/test';

/**
 * Smoke test de démarrage : valide toute la chaîne e2e (config → serveur → navigateur)
 * sur le formulaire de connexion. Locators par rôle / label (cf. règles a11y du projet).
 */
test.describe('Connexion', () => {
  test("affiche le formulaire de connexion sur la page d'accueil", async ({ page }) => {
    await page.goto('/');

    // La route '' redirige vers '/connect'.
    await expect(page).toHaveURL(/\/connect$/);
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();

    // Le bouton reste désactivé tant que le formulaire est invalide (champs vides).
    await expect(page.getByRole('button', { name: 'se connecter' })).toBeDisabled();
  });

  test('un utilisateur peut se connecter et arrive sur la liste des entreprises', async ({ page }) => {
    await page.goto('/connect');

    await page.getByLabel('Adresse e-mail').fill('formateur@example.com');
    await page.getByLabel('Mot de passe').fill('motdepasse');

    const submit = page.getByRole('button', { name: 'se connecter' });
    await expect(submit).toBeEnabled();
    await submit.click();

    // signin() mémorise l'utilisateur puis redirige vers la liste des entreprises.
    await expect(page).toHaveURL(/\/companies\/list$/);
  });
});
