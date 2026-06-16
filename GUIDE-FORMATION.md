# Guide de formation — Angular avancé → Nx → Tests

> **Ce guide est une feuille de route, pas un corrigé.** Sur le starter public, **seul le démarrage
> est détaillé** (mise en route, découverte, dette technique) ; les phases suivantes (découpage des
> routes, tests) ne sont qu'esquissées. Elles se réalisent **en live** pendant la formation : le repo
> public de la session se remplit au fil des commits (un par étape), et la version **complète avec
> solutions** vit uniquement sur le repo privé du formateur.
>
> Voir `CONTEXT.md` pour le contexte global et les évolutions prévues (API JWT, SSR, Nx).

## Sommaire des phases

| Phase | Contenu                                          | Statut dans ce guide        |
| ----- | ------------------------------------------------ | --------------------------- |
| 0     | Mise en route (récupération + install)           | ✅ détaillée                |
| 1     | Découverte de l'application                      | ✅ détaillée                |
| 2     | Dette technique (appropriation du code)          | ✅ détaillée — ⚠️ non soldée |
| 3     | Découpage des routes enfant par feature          | ✅ réalisée                 |
| 4     | Migration Nx monorepo (libs feature par feature) | 🚧 en cours                 |

> **Contrainte transverse — SSR-safe dès le départ.** Même si le SSR n'est pas activé, tout le code
> écrit pendant la formation doit être compatible SSR : aucun accès direct à `localStorage` /
> `window` / `document` (les garder derrière `isPlatformBrowser` / `afterNextRender`). Voir la règle
> « SSR Compatibility » dans `.claude/CLAUDE.md`.

---

## Phase 0 — Mise en route

1. Récupérer le starter depuis GitHub : **Code → Download ZIP**, puis dézipper.
2. Ouvrir le dossier dans VS Code.
3. Installer les dépendances :

   ```bash
   npm install
   ```

4. Installer les navigateurs Playwright (le package est déjà dans le projet) :

   ```bash
   npx playwright install
   ```

5. Lancer l'application :

   ```bash
   npm start
   ```

   → `http://localhost:4200` (redirige vers `/connect`).

**Ce que contient déjà le starter :**

- ✅ Playwright prévu (tests e2e) et Vitest installé (tests unitaires, `ng test` fonctionne).
- ✅ Les fichiers de cadrage : `CONTEXT.md`, `.claude/CLAUDE.md` (best practices), ce guide.
- ✅ Les serveurs MCP (`.vscode/mcp.json`) : **Angular CLI** et **Playwright** (officiel Microsoft).

> **Note formateur — les MCP :** montrer `.vscode/mcp.json` et expliquer à quoi servent les
> serveurs MCP : ils donnent à Claude Code un accès outillé à **Angular CLI** et à **Playwright**
> (pilotage du navigateur pour écrire les e2e avec nous). Les **tests unitaires Vitest** sont, eux,
> lancés via `ng test` et leur sortie est lue par Claude (il n'existe pas de MCP Vitest officiel).
> C'est ce qui permet de couvrir tests unitaires + e2e malgré le format 3 jours.

---

## Phase 1 — Découverte de l'application

Mini-CRM Angular 21. Parcourir `src/app/` :

- `feature-companies/` — la seule feature **complète** (liste / ajout / édition, `CompanyService`).
- `feature-connect/` — connexion **simulée** (`FormConnect` en signal forms + service `Auth`).
- `feature-contacts/`, `feature-orders/` — **squelettes** (pages vides à compléter).
- `feature-not-found/` — page 404.
- `shared/` — `Auth`, `Nav`, `Header`, `ConfirmDialog`.

Points à remarquer :

- Tout est **standalone** (pas de NgModule), **signals**, `inject()`, `input()`/`output()`.
- Lazy loading des pages via `loadComponent` dans `app.routes.ts`.
- Control flow natif (`@if`) dans les templates.
- `ConfirmDialog` utilise l'élément natif `<dialog>` (`showModal()` → focus piégé + Échap natifs).
- ⚠️ `@angular/forms/signals` (signal forms) est **expérimental** — à signaler.

---

## Phase 2 — Dette technique (appropriation du code)

Objectif : s'approprier le code en corrigeant la dette. **La liste ci-dessous est la proposition de
départ, à valider/ajuster avec le formateur en début de séance.**

- [ ] **`console.log` résiduels** — `shared/services/auth.ts` (`signin`, ligne 27) et
      `feature-companies/pages/page-list-companies/page-list-companies.ts` (`ngOnInit`, ligne 51).
- [x] **Bug de message de validation** — dans `feature-connect/.../form-connect.ts`, le `required`
      du mot de passe affiche « Le format de l'email est obligatoire » (copier-coller).
      ✅ Corrigé (15/06) : message « Le mot de passe est obligatoire ».
- [ ] **Commentaires morts / stubs vides** — en fin de `page-list-companies.ts`.
- [ ] **Naming incohérent** — `CompanyService` (suffixe) vs `Auth` (sans). Choisir une convention.
- [ ] **⚠️ Violation SSR (contrainte transverse)** — `shared/services/auth.ts` lit
      `localStorage.getItem(...)` **à l'initialisation du champ** (ligne 15) : crash garanti en SSR.
      À déplacer derrière `isPlatformBrowser` / `afterNextRender` (cf. règle « SSR Compatibility »).
- [ ] **Code mort** — `shared/services/auth.ts` : signal de test `public test = signal('christophe')`
      (ligne 21).

> **⚠️ Phase 2 non soldée.** La migration Nx (Phase 4) a démarré alors que la dette ci-dessus n'est
> pas entièrement corrigée. Recommandation : **fermer cette dette avant de poursuivre l'extraction
> des libs** — on évite de migrer du code à corriger, et la violation SSR doit être traitée tôt.

### Vérification de fin de phase

```bash
npm start      # l'app tourne sans erreur console
ng test        # les tests unitaires passent (Vitest)
```

---

## Phase 3 — Découpage des routes enfant ✅

> Réalisé **avant** la migration Nx. Chaque feature expose un `feature-x.routes.ts`
> (ex. `COMPANIES_ROUTES`) ; `app.routes.ts` utilise `loadChildren`. Inclut la création des routes
> contacts/orders aujourd'hui absentes.

**Réalisé (15-16/06) :**

- `app.routes.ts` monte chaque feature en `loadChildren` :
  `companies` → `COMPANIES_ROUTES`, `contacts` → `CONTACTS_ROUTES`, `orders` → `ORDERS_ROUTES`,
  plus `connect` et la route `**` (`NOT_FOUND_ROUTE`).
- Routes enfant de chaque feature dans son propre `*.routes.ts`, avec `loadComponent` par page
  (`list` / `add` / `edit/:id`) et redirection `'' → list`.
- Routes **contacts** et **orders** créées (elles étaient absentes du starter).

Chaque feature est désormais autonome (namespace d'URL propre), donc prête à devenir une lib Nx.

## Phase 4 — Migrer sur Nx 🚧

> Ajout de Nx au projet existant : `nx init` puis `nx add @nx/angular`. On extrait ensuite les libs
> **feature par feature** en ligne de commande (`nx g @nx/angular:library … --tags=type:…,scope:…`),
> en vérifiant `nx graph` après chaque lib. Découpage par feature × type (`feature` / `ui` /
> `data-access` / `util`), puis durcissement des frontières de module
> (`@nx/enforce-module-boundaries`, `depConstraints`) avec démo d'un import interdit. Point clé : une
> lib ne peut pas importer `environment.ts` → on passe par un `InjectionToken` `API_BASE_URL` fourni
> par l'app. Le découpage des routes enfant (Phase 3) rend chaque feature autonome, donc migrer une
> feature ≈ déplacer un dossier + corriger l'import.

**Réalisé (16/06) :**

- `nx init` + `nx add @nx/angular` ; workspace Nx en place (`nx.json`).
- L'app a été déplacée dans `apps/mini-crm/` (cible `serve` via `@angular/build:dev-server`).

**Architecture des libs retenue (validée en séance) :**

- Un **dossier par domaine** (`libs/companies/`, `libs/contacts/`, `libs/orders/`, `libs/shared/`),
  contenant **une lib par couche présente** (pas de lib vide par anticipation) :
  - `feature` — smart components (pages) + routes ;
  - `ui` — dumb components (`input`/`output`, sans `inject`) + pipes/directives de présentation ;
  - `data-access` — services, **models**, et plus tard le store ;
  - `util` — pur & transverse (enums, helpers, `API_BASE_URL`), plutôt en `shared/util`.
- Génération **toujours avec `--tags=type:…,scope:…`**, et **`--name` + `--importPath` explicites**
  (`@mini-crm/<domaine>/<couche>`) — sinon Nx dérive des noms génériques (`data-access`, `ui`…) qui
  entrent en collision entre domaines.

**En cours :** extraction des libs de `companies` (`companies-data-access`, `companies-ui`,
`companies-feature`).

**Reste à faire :** déplacer le code dans les libs, vérifier `nx graph`, répliquer sur
contacts/orders/shared, puis durcir `enforce-module-boundaries` + introduire `API_BASE_URL`.
