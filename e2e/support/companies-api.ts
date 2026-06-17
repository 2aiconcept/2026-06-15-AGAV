import type { Page } from '@playwright/test';

/** Forme d'une entreprise (locale au e2e, pour ne pas coupler au code applicatif). */
export interface Company {
  id: number;
  nom: string;
  secteur: string;
  adresse: string;
  telephone: string;
}

/**
 * Authentifie l'utilisateur **sans passer par l'UI de login** : on amorce le `localStorage`
 * (le service `Auth` y lit le token au démarrage, et le guard laisse alors passer `/companies`).
 * → chaque test companies reste indépendant du flux de connexion.
 */
export async function seedAuth(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem('mini-crm.token', 'e2e-fake-token');
    localStorage.setItem(
      'mini-crm.user',
      JSON.stringify({ id: 1, email: 'e2e@test.com', nom: 'E2E', prenom: 'Test', role: 'user' }),
    );
  });
}

/**
 * Stub de l'API entreprises avec un **état en mémoire** (CRUD réaliste, zéro réseau réel).
 * On intercepte `…/api/entreprises` (liste + création) et `…/api/entreprises/:id` (détail/maj/suppr).
 */
export async function mockCompaniesApi(page: Page, seed: Company[] = []): Promise<void> {
  const companies: Company[] = seed.map((c) => ({ ...c }));
  let nextId = Math.max(0, ...companies.map((c) => c.id)) + 1;

  // Collection : GET (liste) + POST (création).
  await page.route('**/api/entreprises', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({ json: companies });
      return;
    }
    if (method === 'POST') {
      const body = route.request().postDataJSON() as Omit<Company, 'id'>;
      const created: Company = { id: nextId++, ...body };
      companies.push(created);
      await route.fulfill({ status: 201, json: created });
      return;
    }
    await route.fallback();
  });

  // Élément : GET (détail) + PUT (maj) + DELETE (suppression).
  await page.route('**/api/entreprises/*', async (route) => {
    const id = Number(route.request().url().split('/').pop());
    const method = route.request().method();
    const index = companies.findIndex((c) => c.id === id);

    if (method === 'GET') {
      await route.fulfill({ json: companies[index] ?? {} });
      return;
    }
    if (method === 'PUT') {
      const body = route.request().postDataJSON() as Omit<Company, 'id'>;
      const updated: Company = { id, ...body };
      if (index >= 0) companies[index] = updated;
      await route.fulfill({ json: updated });
      return;
    }
    if (method === 'DELETE') {
      if (index >= 0) companies.splice(index, 1);
      await route.fulfill({ status: 200, json: {} });
      return;
    }
    await route.fallback();
  });
}
