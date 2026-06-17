import { test, expect } from '@playwright/test';
import { mockCompaniesApi, seedAuth, type Company } from './support/companies-api';

const SEED: Company[] = [
  { id: 1, nom: 'TechVision', secteur: 'IT', adresse: 'Paris', telephone: '01' },
  { id: 2, nom: 'DataCorp', secteur: 'Data', adresse: 'Lyon', telephone: '02' },
];

test.describe('Entreprises (companies)', () => {
  // Avant chaque test : utilisateur authentifié + API stubbée (état en mémoire).
  test.beforeEach(async ({ page }) => {
    await seedAuth(page);
    await mockCompaniesApi(page, SEED);
  });

  test('affiche la liste des entreprises', async ({ page }) => {
    await page.goto('/companies/list');

    await expect(page.getByRole('heading', { name: 'Entreprises' })).toBeVisible();
    await expect(page.getByText('TechVision')).toBeVisible();
    await expect(page.getByText('DataCorp')).toBeVisible();
  });

  test('ajoute une entreprise et la voit dans la liste', async ({ page }) => {
    await page.goto('/companies/list');

    await page.getByRole('button', { name: 'Ajouter une entreprise' }).click();
    await expect(page).toHaveURL(/\/companies\/add$/);

    // Locators par label (réutilise le contrat d'accessibilité).
    await page.getByLabel('Nom').fill('NewCo');
    await page.getByLabel('Secteur').fill('Conseil');
    await page.getByLabel('Adresse').fill('Lille');
    await page.getByLabel('Téléphone').fill('03');
    await page.getByRole('button', { name: 'Ajouter' }).click();

    // Retour liste : la nouvelle entreprise (renvoyée par le POST stubbé) apparaît.
    await expect(page).toHaveURL(/\/companies\/list$/);
    await expect(page.getByText('NewCo')).toBeVisible();
  });

  test('édite une entreprise', async ({ page }) => {
    await page.goto('/companies/list');

    // Bouton « Éditer » de la ligne TechVision.
    await page
      .getByRole('row', { name: /TechVision/ })
      .getByRole('button', { name: 'Éditer' })
      .click();
    await expect(page).toHaveURL(/\/companies\/edit\/1$/);

    // Le formulaire est pré-rempli (chargé via GET /entreprises/1).
    const nom = page.getByLabel('Nom');
    await expect(nom).toHaveValue('TechVision');

    await nom.fill('TechVision 2');
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    await expect(page).toHaveURL(/\/companies\/list$/);
    await expect(page.getByText('TechVision 2')).toBeVisible();
  });

  test('supprime une entreprise après confirmation', async ({ page }) => {
    await page.goto('/companies/list');

    await page
      .getByRole('row', { name: /DataCorp/ })
      .getByRole('button', { name: 'Supprimer' })
      .click();

    // La boîte de dialogue de confirmation (élément <dialog> natif) s'ouvre.
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Supprimer' }).click();

    // La ligne disparaît de la liste.
    await expect(page.getByText('DataCorp')).toHaveCount(0);
  });
});
