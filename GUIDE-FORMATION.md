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
| 4     | Migration Nx monorepo (libs feature par feature) | ✅ réalisée                 |
| 5     | Intégration de l'API JWT (data-access + auth)    | 🚧 en cours                 |
| 6     | Tests (Vitest + Playwright)                      | 🚧 à venir                  |

> **Annexe A** — référence complète de l'**API Mini-CRM JWT** (endpoints, entrées/sorties,
> interfaces TypeScript à créer). À utiliser en Phase 5.

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

## Phase 4 — Migrer sur Nx ✅

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

**Extraction des libs — terminée (16/06).** Toutes les features et le code partagé sont sortis de
l'app ; `apps/mini-crm/` ne contient plus que le **shell** (`app.ts/html/css`, `app.routes.ts`,
`app.config.ts`). Arborescence finale `libs/` :

| Domaine (`scope`) | Libs (`type`) | Contenu déplacé |
| --- | --- | --- |
| `companies` | `data-access`, `ui`, `util`, `feature` | `CompanyService` + modèle ; `form-company`/`table-company` ; pages + `COMPANIES_ROUTES` |
| `contacts` | `data-access`, `ui`, `util`, `feature` | `form-contact` (ui) ; pages + `CONTACTS_ROUTES` ; `data-access`/`util` = **coquilles vides** (squelette) |
| `orders` | `data-access`, `ui`, `util`, `feature` | `form-order` (ui) ; pages + `ORDERS_ROUTES` ; `data-access`/`util` = **coquilles vides** |
| `connect` | `ui`, `feature` | `form-connect` (ui) ; `page-connect` (feature) |
| `not-found` | `feature` | `page-not-found` + `NOT_FOUND_ROUTE` |
| `shared` | `data-access`, `ui`, `util` | `Auth` (data-access) ; `Nav` + `Header` (ui) ; `Credentials` + `API_BASE_URL` + `ConfirmDialog` (util/ui) |

> **Note d'architecture.** Le principe « pas de lib vide par anticipation » a été assoupli pour
> `contacts`/`orders` : on a généré les **4 couches** comme pour `companies` afin d'avoir une structure
> homogène, avec `data-access`/`util` en **coquilles** (`export {}` documenté) prêtes à accueillir les
> services/modèles de l'API (cf. Phase 5 et Annexe A).

**Décisions de découplage notables :**

- **`Header` rendu présentationnel** : il injectait `Auth` (interdit en `ui` par la règle
  `ui → ui | util`). Converti en composant pur — `input()` `isAuthenticated`/`userEmail` + `output()`
  `logout` — câblé par le shell `App` (seul à connaître `Auth`). `shared-ui` n'a ainsi **aucune**
  dépendance `data-access`.
- **Imports morts retirés** : `form-connect` importait `Auth`/`Router` (inutilisés) → supprimés,
  sinon `connect-ui` aurait dépendu de `data-access`.
- **`API_BASE_URL`** (`InjectionToken`, `shared/util`) : l'app fournit la valeur depuis
  `environment.ts` (`app.config.ts`) ; les services `data-access` la lisent via `inject(API_BASE_URL)`
  — **aucune lib n'importe `environment.ts`**.

**Durcissement des frontières de module — fait (16/06).** Dans `eslint.config.mjs`, le
`depConstraints` permissif (`'*' → ['*']`) a été remplacé par la matrice complète, et l'app taguée
`type:app, scope:app` :

- **Par `type`** : `app → feature|ui|data-access|util` · `feature → ui|data-access|util`
  · `ui → ui|util` · `data-access → data-access|util` · `util → util`. _(Une feature ne dépend
  jamais d'une autre feature ; `util` est une feuille.)_
- **Par `scope`** : `app → tous` · chaque domaine `→ son scope + shared` · `shared → shared`.
- Les deux dimensions s'appliquent en **ET**.

**Vérifications :** `nx run-many -t lint` (18 projets, 0 erreur), `nx build mini-crm` OK
(chunks lazy par page présents), `nx graph` acyclique. **Démo « la règle mord »** : un import
volontairement interdit (`shared/ui → companies/feature`) fait échouer le lint via
`@nx/enforce-module-boundaries`.

**Commande de (re)génération d'une lib** (référence) :

```bash
npx nx g @nx/angular:library libs/<domaine>/<couche> \
  --name=<domaine>-<couche> \
  --importPath=@mini-crm/<domaine>/<couche> \
  --tags=type:<couche>,scope:<domaine> --no-interactive
```

> ⚠️ Après génération, penser à : aligner le `prefix` sur `app` (project.json + eslint.config.mjs,
> Nx met `lib` par défaut), supprimer le composant scaffold par défaut, et brancher le `index.ts`
> (barrel) sur le vrai contenu.

---

## Phase 5 — Intégration de l'API JWT 🚧

> L'API simulée laisse place à la **vraie API REST protégée par JWT** (voir **Annexe A** pour le
> détail des endpoints et des interfaces). Objectif : remplir les libs `data-access`/`util` des
> domaines et transformer `Auth` (aujourd'hui simulé) en authentification JWT réelle.

**Réalisé (16/06) — chaîne d'authentification JWT.**

- **`apiBaseUrl` corrigé** ([environment.ts](apps/mini-crm/src/environments/environment.ts) +
  [environment.prod.ts](apps/mini-crm/src/environments/environment.prod.ts)) →
  `https://mini-crm-api-jwt-production.up.railway.app/api`. ⚠️ **Piège vécu** : la valeur sans
  `https://` était traitée comme une **URL relative** par le navigateur
  (`http://localhost:4200/mini-crm-api-…/auth/register` → 404). Et l'API attend le préfixe `/api`
  (le `CompanyService` fait déjà `${API_BASE_URL}/entreprises`).
- **Interfaces auth** dans `@mini-crm/shared/util`
  ([auth-models.ts](libs/shared/util/src/lib/auth-models.ts)) : `RegisterInput` (extends
  `Credentials` + `nom`/`prenom`), `UserProfile`, `AuthResponse`. `Credentials` reste le DTO de login.
- **Service `Auth`** ([auth.ts](libs/shared/data-access/src/lib/auth.ts)) passé en **vrai JWT** :
  - `signin(credentials): Observable<AuthResponse>` → `POST {api}/auth/login` ;
  - `signup(userData: RegisterInput): Observable<AuthResponse>` → `POST {api}/auth/register` ;
  - `tap()` → `storeSession()` persiste **token + profil** ; état exposé : `token`,
    `currentUser` (= email, pour l'en-tête), `isAuthenticated` (= token présent) ;
  - **SSR-safe** : aucun `localStorage` à l'initialisation — tout est derrière
    `isPlatformBrowser(PLATFORM_ID)`, restauré au démarrage via `restoreSession()` (corrige la dette
    SSR de Phase 2) ;
  - nettoyage du `console.log` et du signal mort `test`.
- **`page-connect`** ([page-connect.ts](libs/connect/feature/src/lib/page-connect/page-connect.ts)) :
  `connect()`→`signin`, `createAccount()`→`signup`, navigation vers `/companies/list`, et
  **affichage du message d'erreur réel de l'API** (via `HttpErrorResponse` → `err.error?.error`,
  encart `aria-live`). ⚠️ **Piège vécu** : un 400 « Cet email est déjà utilisé » (base **en
  mémoire**) ressemblait à un problème CORS — c'en était pas un (l'API renvoie
  `Access-Control-Allow-Origin`). Pour retester : email neuf ou `POST /api/admin/reset-formation`.
- **Interceptor JWT fonctionnel**
  ([auth.interceptor.ts](libs/shared/data-access/src/lib/auth.interceptor.ts)) : ajoute
  `Authorization: Bearer <token>` quand un token existe (les requêtes anonymes login/register passent
  inchangées), `req.clone({ setHeaders })` (immuabilité). Enregistré dans le shell via
  `provideHttpClient(withInterceptors([authInterceptor]))` ([app.config.ts](apps/mini-crm/src/app/app.config.ts)).
- **Garde de route fonctionnelle** ([auth-guard.ts](libs/shared/data-access/src/lib/auth-guard.ts)) :
  `authGuard: CanActivateFn` lit `Auth.isAuthenticated()` ; si non connecté, renvoie un `UrlTree` vers
  `/connect` avec `returnUrl` (URL demandée mémorisée pour y revenir). Appliquée via
  `canActivate: [authGuard]` sur `companies` / `contacts` / `orders` dans
  [app.routes.ts](apps/mini-crm/src/app/app.routes.ts) (`connect` et `**` restent publiques). Générée
  avec `npx nx g @schematics/angular:guard auth --project=shared-data-access --implements=CanActivate --functional`.

**Reste à faire :**

1. **Formulaire signup** : ajouter les champs `nom`/`prenom` (visibles en mode inscription, validation
   conditionnelle au mode) et faire émettre un `RegisterInput` à `form-connect` — aujourd'hui
   `createAccount` envoie des `nom`/`prenom` **placeholder**.
2. **Gestion des `401/403`** : `catchError` (dans l'interceptor ou un second interceptor) → `Auth.logout()`
   + redirection `/connect` quand le token est expiré/invalide.
3. **Interfaces métier** (`util`) par domaine — `Entreprise`/`EntrepriseInput` (aligner la `Company`
   existante), `Contact`/`ContactInput`, `Opportunite`/`OpportuniteInput` (cf. Annexe A).
   ⚠️ **Mapping** : `Opportunité` (API) ↔ feature **`orders`**, `Entreprise` ↔ **`companies`**.
4. **Services `data-access`** (signals + `HttpClient` + `inject(API_BASE_URL)`) sur le modèle de
   `CompanyService`, dans `contacts-data-access` et `orders-data-access`.
5. **Exploiter le `returnUrl`** : `page-connect` devrait lire `?returnUrl` après connexion pour y
   rediriger (aujourd'hui le `signin` renvoie toujours vers `/companies/list` en dur). Le guard pose
   déjà le `returnUrl`.

### Gestion d'état : NgRx SignalStore (companies) 🚧

> **Décision** : gérer l'état des features avec **NgRx SignalStore**, en commençant par `companies`
> (le store remplacera à terme le `CompanyService` hybride actuel). Approche **« simple d'abord »**,
> adaptée à un public pas à l'aise sur Angular : on n'ajoute une feature du store que **quand le
> besoin existe**, pas par réflexe.

**Installation** (NgRx suit la version majeure d'Angular → Angular 21 = NgRx 21). En monorepo Nx, on
utilise la commande **Nx-native** (pas `ng add`, qui est l'outil Angular CLI ; pas `npm install` non
plus) — elle aligne automatiquement la version sur le workspace :

```bash
npx nx add @ngrx/signals
```

> ✅ Installé : `@ngrx/signals@^21.1.1` (dans `dependencies`).
> Un seul package : `@ngrx/signals` contient `signalStore`, `withState`, `withMethods`, `patchState`,
> `withComputed`… et `withEntities` (via le sous-chemin `@ngrx/signals/entities`). **Pas** besoin de
> `@ngrx/store` / `@ngrx/effects` (ça, c'est le Global Store classique), ni de `@ngrx/operators`
> (`tapResponse`) tant qu'on ne passe pas à `rxMethod`.

**Emplacement** : un seul `companies.store.ts` dans **`companies/data-access`** (état + accès données
→ c'est sa couche), exporté par le barrel.

**Fourniture (provide)** : un SignalStore se fournit lui-même — **rien à mettre dans `app.config.ts`**.

- `signalStore({ providedIn: 'root' }, …)` → **singleton global**, on `inject()` et c'est tout (choix
  retenu pour démarrer).
- Variante scopée à la feature : sans `providedIn`, on met `providers: [CompaniesStore]` sur la
  **route** de la feature (instance créée/détruite avec la feature). Pour plus tard.

**V1 — le plus simple (à faire en premier) :**

- `withState({ companies, isLoading, error })` — l'état **brut** (tableau `Company[]`).
- `withMethods(…)` — `load` / `add` / `update` / `remove`, chacune fait son appel HTTP et un
  **`patchState`**. Async via méthodes **`async` + `firstValueFrom`** (HttpClient renvoie des
  Observables) — **pas `rxMethod`** (réservé au réactif avancé : debounce, switchMap…).
- Mental model en 3 concepts seulement : **état → méthode → `patchState`**. Les stagiaires voient
  l'état muter « à la main » (spreads `filter`/`map`).

**Étape 1 — écrire le store** `libs/companies/data-access/src/lib/companies.store.ts`, puis
l'exporter dans le barrel (`export * from './lib/companies.store';`) :

```ts
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { Company, CompanyPayload } from '@mini-crm/companies/util';
import { API_BASE_URL } from '@mini-crm/shared/util';

type CompaniesState = { companies: Company[]; isLoading: boolean; error: string | null };
const initialState: CompaniesState = { companies: [], isLoading: false, error: null };

export const CompaniesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, http = inject(HttpClient), apiUrl = `${inject(API_BASE_URL)}/entreprises`) => ({
      async load(): Promise<void> {
        patchState(store, { isLoading: true, error: null });
        try {
          const companies = await firstValueFrom(http.get<Company[]>(apiUrl));
          patchState(store, { companies, isLoading: false });
        } catch {
          patchState(store, { error: 'Impossible de charger les entreprises.', isLoading: false });
        }
      },
      // Charge une entreprise par id (pré-remplissage de l'édition). Pose `error` et renvoie
      // null en cas d'échec → une seule source d'erreur : le store.
      async loadOne(id: number): Promise<Company | null> {
        patchState(store, { error: null });
        try {
          return await firstValueFrom(http.get<Company>(`${apiUrl}/${id}`));
        } catch {
          patchState(store, { error: "Impossible de charger l'entreprise." });
          return null;
        }
      },
      async add(payload: CompanyPayload): Promise<void> {
        patchState(store, { error: null });
        try {
          const created = await firstValueFrom(http.post<Company>(apiUrl, payload));
          patchState(store, (state) => ({ companies: [...state.companies, created] }));
        } catch {
          patchState(store, { error: "Impossible de créer l'entreprise." });
        }
      },
      async update(id: number, payload: CompanyPayload): Promise<void> {
        patchState(store, { error: null });
        try {
          const updated = await firstValueFrom(http.put<Company>(`${apiUrl}/${id}`, payload));
          patchState(store, (state) => ({
            companies: state.companies.map((c) => (c.id === id ? updated : c)),
          }));
        } catch {
          patchState(store, { error: "Impossible de modifier l'entreprise." });
        }
      },
      async remove(id: number): Promise<void> {
        patchState(store, { error: null });
        try {
          await firstValueFrom(http.delete<void>(`${apiUrl}/${id}`));
          patchState(store, (state) => ({
            companies: state.companies.filter((c) => c.id !== id),
          }));
        } catch {
          patchState(store, { error: "Impossible de supprimer l'entreprise." });
        }
      },
    }),
  ),
);
```

**Étape 2 — supprimer `CompanyService`.** Le store le remplace **intégralement** (HTTP + état).
On supprime `libs/companies/data-access/src/lib/company.ts` et on retire son export du barrel — il ne
restera plus que `export * from './lib/companies.store';`. Les imports `CompanyService` qui cassent
dans les pages sont justement ce qu'on remplace à l'étape 3.

**Étape 3 — brancher les composants sur le store.** Partout, on **injecte `CompaniesStore` au lieu de
`CompanyService`**, on lit les **signaux** du store, et on **appelle ses méthodes** (les `subscribe()`
disparaissent → `await`). Les templates, eux, ne changent pas (`companies()`, `error()` restent
identiques).

`page-list-companies.ts` :

```ts
// AVANT (service)                           // APRÈS (store)
private readonly companyService =            private readonly store =
  inject(CompanyService);                      inject(CompaniesStore);

protected readonly companies =               protected readonly companies =
  this.companyService.companies;               this.store.companies;
protected readonly error =                   protected readonly error =
  this.companyService.error;                   this.store.error;

ngOnInit() { this.companyService.load(); }   ngOnInit() { this.store.load(); }

// dans confirmDelete()                       // dans confirmDelete()
this.companyService.remove(id);              this.store.remove(id);
```

`page-add-company.ts` — le `subscribe` devient un `await` :

```ts
// AVANT
onSave(payload: CompanyPayload): void {
  this.companyService.create(payload).subscribe({
    next: () => this.router.navigate(['/companies', 'list']),
    error: () => this.error.set("Impossible d'ajouter l'entreprise."),
  });
}

// APRÈS
private readonly store = inject(CompaniesStore);
protected readonly error = this.store.error; // l'erreur vient désormais du store

async onSave(payload: CompanyPayload): Promise<void> {
  await this.store.add(payload);
  if (!this.store.error()) {
    this.router.navigate(['/companies', 'list']);
  }
}
```

`page-edit-company.ts` — idem pour le chargement et l'enregistrement :

```ts
// AVANT : getOne(...).subscribe({ next, error })
ngOnInit(): void {
  this.companyService.getOne(this.id()).subscribe({
    next: (company) => this.company.set(company),
    error: () => this.error.set("Impossible de charger l'entreprise."),
  });
}

// APRÈS : une seule source d'erreur (le store) ; `loadOne` renvoie null si échec
protected readonly error = this.store.error;   // plus de signal `error` local

async ngOnInit(): Promise<void> {
  this.company.set(await this.store.loadOne(this.id()));
}

// APRÈS : enregistrement
async onSave(payload: CompanyPayload): Promise<void> {
  await this.store.update(this.id(), payload);
  if (!this.store.error()) {
    this.router.navigate(['/companies', 'list']);
  }
}
```

> **À retenir** : `inject(CompaniesStore)` remplace `inject(CompanyService)` ; on **lit des signaux**
> (`store.companies()`, `store.error()`) et on **appelle des méthodes** (`store.load()`,
> `store.add()`…) ; les `.subscribe()` deviennent des `await`. Les templates restent inchangés.

> **Une seule source d'erreur.** Toutes les méthodes du store posent l'erreur dans l'état
> (`patchState(store, { error })`), y compris `loadOne` (qui renvoie `null` en cas d'échec). Les pages
> n'ont donc **pas** de signal `error` local : elles lisent `store.error()`. La règle : on choisit
> **une** stratégie (tout via `store.error`) et on s'y tient sur **toutes** les méthodes — éviter le
> mélange « certaines lèvent, d'autres avalent ».

**Ce qu'on n'ajoute PAS maintenant (et pourquoi) :**

- **`withComputed`** = état **dérivé** (valeur calculée à partir de l'état, mémoïsée). Avantages :
  mémoïsation (recalcul seulement si une dépendance change), source de vérité unique/DRY, composants
  « bêtes », cohérence auto. **Mais inutile ici** : on lit juste `companies` / `isLoading` / `error`,
  aucune dérivation (pas de tri, pas de recherche, pas de sélection). Règle : on l'ajoute **le jour où**
  une vraie dérivation réutilisée apparaît.
- **`withEntities`** = collection **normalisée** (`entityMap` + `ids`) avec updaters prêts
  (`setAllEntities`, `addEntity`, `updateEntity`, `removeEntity`). **Pas un gain de perf pertinent ici** :
  l'écart `O(n)` (`.find`/`.filter`) vs `O(1)` (`entityMap[id]`) n'est mesurable qu'à **plusieurs
  milliers d'items mutés fréquemment** ; et le rendu, lui, dépend du **`track`** dans `@for` (+ virtual
  scroll), pas du store. Le vrai bénéfice = **moins de boilerplate**, payé par +5 concepts → on s'en
  passe pour un public débutant.
  - **Tipping point** (quand `withEntities` devient utile) : ≥ 3-4 entités au même CRUD, **beaucoup**
    de màj par id, **normalisation** de données reliées par id (relations — ex. `order.contact_id` /
    `entreprise_id`), ou collection > quelques milliers d'items mutés. Aucun critère rempli chez nous
    pour l'instant.

**Progression pédagogique V1 → V2 → V3 :** d'abord la V1 (spreads explicites à la main), **puis**
`withEntities` (V2), **puis** la factorisation générique (V3). À chaque étape, un **avant/après**
parlant — ils **mesurent** ce que l'abstraction fait gagner, au lieu de subir une magie.

### V2 — `withEntities` (collection normalisée)

> Même feature (companies), on **rebascule** le tableau brut en collection normalisée. **Rien à
> installer** : `withEntities` vit dans `@ngrx/signals/entities` (sous-chemin du package déjà présent).

Dans le store : on ajoute `withEntities<Company>()`, on **retire** `companies: Company[]` de
`withState`, et chaque méthode passe d'un `patchState` « à la main » à un **updater d'entités** :

```ts
import {
  addEntity, removeEntity, setAllEntities, updateEntity, withEntities,
} from '@ngrx/signals/entities';

export const CompaniesStore = signalStore(
  { providedIn: 'root' },
  withState<{ isLoading: boolean; error: string | null }>({ isLoading: false, error: null }),
  withEntities<Company>(), // la collection vit ici → signal `entities` (+ entityMap, ids)
  withMethods((store, http = inject(HttpClient), apiUrl = `${inject(API_BASE_URL)}/entreprises`) => ({
    async load() {
      patchState(store, { isLoading: true, error: null });
      try {
        const companies = await firstValueFrom(http.get<Company[]>(apiUrl));
        patchState(store, setAllEntities(companies), { isLoading: false }); // ← au lieu de { companies }
      } catch {
        patchState(store, { error: 'Impossible de charger les entreprises.', isLoading: false });
      }
    },
    async loadOne(id: number): Promise<Company | null> {
      patchState(store, { error: null });
      try {
        return await firstValueFrom(http.get<Company>(`${apiUrl}/${id}`));
      } catch {
        patchState(store, { error: "Impossible de charger l'entreprise." });
        return null;
      }
    },
    async add(payload: CompanyPayload) {
      patchState(store, { error: null });
      try {
        const created = await firstValueFrom(http.post<Company>(apiUrl, payload));
        patchState(store, addEntity(created)); // ← au lieu de { companies: [...companies, created] }
      } catch {
        patchState(store, { error: "Impossible de créer l'entreprise." });
      }
    },
    async update(id: number, payload: CompanyPayload) {
      patchState(store, { error: null });
      try {
        const updated = await firstValueFrom(http.put<Company>(`${apiUrl}/${id}`, payload));
        patchState(store, updateEntity({ id, changes: updated })); // ← au lieu de companies.map(...)
      } catch {
        patchState(store, { error: "Impossible de modifier l'entreprise." });
      }
    },
    async remove(id: number) {
      patchState(store, { error: null });
      try {
        await firstValueFrom(http.delete<void>(`${apiUrl}/${id}`));
        patchState(store, removeEntity(id)); // ← au lieu de companies.filter(...)
      } catch {
        patchState(store, { error: "Impossible de supprimer l'entreprise." });
      }
    },
  })),
);
```

Côté page liste, **un seul changement** — on lit la collection via `entities` :

```ts
// protected readonly companies = this.store.companies;   // V1 (tableau de withState)
protected readonly companies = this.store.entities;        // V2 (signal Company[] de withEntities)
```

Le nom `companies` est conservé → **template et reste du composant inchangés**. `add`/`update`/`remove`
et leurs pages **ne changent pas** (signatures identiques) : `withEntities` ne touche que ce qui
**lit ou écrit la collection**.

**Avant/après marquant** : `state.companies.filter(c => c.id !== id)` (V1) → **`removeEntity(id)`** (V2).

### V3 — Factoriser : `with-crud.ts` générique (3 lignes par store)

> Constat : `companies`, `contacts`, `orders` auront le **même** store, à l'entité et à l'URL près. On
> factorise dans **une feature générique**, et chaque store tient en 3 lignes.

`libs/shared/data-access/src/lib/with-crud.ts` (exporté par le barrel) :

```ts
export type WithId = { id: number };

export function withCrud<T extends WithId>(resource: string) {
  return signalStoreFeature(
    withEntities<T>(),
    withState<{ isLoading: boolean; error: string | null }>({ isLoading: false, error: null }),
    withMethods((store, http = inject(HttpClient), url = `${inject(API_BASE_URL)}/${resource}`) => ({
      async load() {
        patchState(store, { isLoading: true, error: null });
        try {
          patchState(store, setAllEntities(await firstValueFrom(http.get<T[]>(url))), { isLoading: false });
        } catch {
          patchState(store, { error: 'Impossible de charger les données.', isLoading: false });
        }
      },
      async loadOne(id: number): Promise<T | null> {
        patchState(store, { error: null });
        try {
          return await firstValueFrom(http.get<T>(`${url}/${id}`));
        } catch {
          patchState(store, { error: 'Impossible de charger l’élément.' });
          return null;
        }
      },
      async add(payload: Omit<T, 'id'>) {
        patchState(store, { error: null });
        try {
          patchState(store, addEntity(await firstValueFrom(http.post<T>(url, payload))));
        } catch {
          patchState(store, { error: 'Impossible de créer l’élément.' });
        }
      },
      async update(id: number, payload: Omit<T, 'id'>) {
        patchState(store, { error: null });
        try {
          const updated = await firstValueFrom(http.put<T>(`${url}/${id}`, payload));
          patchState(store, updateEntity({ id, changes: updated }));
        } catch {
          patchState(store, { error: 'Impossible de modifier l’élément.' });
        }
      },
      async remove(id: number) {
        patchState(store, { error: null });
        try {
          await firstValueFrom(http.delete<void>(`${url}/${id}`));
          patchState(store, removeEntity(id));
        } catch {
          patchState(store, { error: 'Impossible de supprimer l’élément.' });
        }
      },
    })),
  );
}
```

Chaque store du domaine se réduit alors à **trois lignes**, et l'API exposée reste **identique**
(`entities`, `isLoading`, `error` + `load/loadOne/add/update/remove`) → **les pages ne changent pas** :

```ts
export const CompaniesStore = signalStore({ providedIn: 'root' }, withCrud<Company>('entreprises'));
export const ContactsStore  = signalStore({ providedIn: 'root' }, withCrud<Contact>('contacts'));
export const OrdersStore    = signalStore({ providedIn: 'root' }, withCrud<Opportunite>('opportunites'));
```

- **`signalStoreFeature(...)`** = la façon NgRx de **packager** un groupe de features réutilisable
  (`withEntities` + `withState` + `withMethods`) sous une seule fonction.
- **`<T extends WithId>`** rend la logique générique ; **`resource`** = le segment d'URL collé à
  `API_BASE_URL`.
- **Quand l'introduire** : quand on se surprend à réécrire le **2ᵉ/3ᵉ** store identique. Pas avant
  (abstraction prématurée).

> **Récap** : **V1** store explicite (mécanique visible) → **V2** `withEntities` (updaters, moins de
> boilerplate) → **V3** `withCrud<T>` (3 lignes par store). On monte en abstraction **seulement quand
> la duplication le justifie** — et chaque palier reste un avant/après démontrable.

**Le fichier `companies.store.ts` final** se résume alors à ceci (tout le CRUD vit dans la feature
générique) :

```ts
import { signalStore } from '@ngrx/signals';
import { withCrud } from '@mini-crm/shared/data-access';
import { Company } from '@mini-crm/companies/util';

export const CompaniesStore = signalStore({ providedIn: 'root' }, withCrud<Company>('entreprises'));
```

> **Astuce pédagogique (pour la session).** Garde les versions **V1** (sans `withEntities`) et **V2**
> (avec `withEntities`) en **blocs commentés** dans le fichier, clairement étiquetés — ainsi tu peux
> dérouler l'avant/après au tableau et y revenir. **En code de production, on les supprime** :
> `with-crud.ts` devient la seule source de vérité du CRUD. C'est un choix **pédagogique**, pas un
> patron à laisser en l'état.

---

## Annexe A — API Mini-CRM JWT (référence)

> **Mini CRM API JWT v2.0.0** — analysée depuis le Swagger
> `https://mini-crm-api-jwt-production.up.railway.app/api-docs/`.

### Infos générales

- **Base URL** : `https://mini-crm-api-jwt-production.up.railway.app` (ou `http://localhost:8080`).
- **Auth** : JWT Bearer. `POST /api/auth/login` → `token`, puis header
  `Authorization: Bearer <token>` sur tous les endpoints marqués 🔒.
- **Comptes démo** : `user@test.com` / `password123` — `admin@test.com` / `admin123`.
- **Données en mémoire** : reset auto chaque dimanche 08h00 (Europe/Paris), ou
  `POST /api/admin/reset-formation`.
- ⚠️ **Mapping domaine** : `Opportunité` (API) ↔ feature **`orders`** ; `Entreprise` (API) ↔ feature
  **`companies`** (le modèle `Company` existant correspond déjà à `Entreprise`).

### Endpoints (16)

**🔓 Authentification — `/api/auth`**

| Méthode | Path | Auth | Entrée | Sortie |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | non | `RegisterInput` | `201 AuthResponse` · 400 |
| POST | `/api/auth/login` | non | `LoginInput` | `200 AuthResponse` · 400/401 |
| GET | `/api/auth/profile` | 🔒 | — | `200 UserProfile` · 401/403 |

**🔒 Contacts — `/api/contacts`** (feature `contacts`)

| Méthode | Path | Entrée | Sortie |
| --- | --- | --- | --- |
| GET | `/api/contacts` | — | `200 Contact[]` |
| POST | `/api/contacts` | `ContactInput` | `201 Contact` · 400 |
| GET | `/api/contacts/{id}` | — | `200 Contact` · 404 `Erreur` |
| PUT | `/api/contacts/{id}` | `ContactInput` (partiel) | `200 Contact` · 404 |
| DELETE | `/api/contacts/{id}` | — | `200` · 404 |
| GET | `/api/contacts/{id}/opportunites` | — | `200 Opportunite[]` (relation 1-N) |

**🔒 Entreprises — `/api/entreprises`** (feature `companies`)

| Méthode | Path | Entrée | Sortie |
| --- | --- | --- | --- |
| GET | `/api/entreprises` | — | `200 Entreprise[]` |
| POST | `/api/entreprises` | `EntrepriseInput` | `201 Entreprise` · 400 |
| GET | `/api/entreprises/{id}` | — | `200 Entreprise` · 404 |
| PUT | `/api/entreprises/{id}` | `EntrepriseInput` | `200 Entreprise` · 404 |
| DELETE | `/api/entreprises/{id}` | — | `200` · 404 |
| GET | `/api/entreprises/{id}/contacts` | — | `200 Contact[]` (relation 1-N) |

**🔒 Opportunités — `/api/opportunites`** (feature `orders`)

| Méthode | Path | Entrée | Sortie |
| --- | --- | --- | --- |
| GET | `/api/opportunites` | — | `200 Opportunite[]` |
| POST | `/api/opportunites` | `OpportuniteInput` | `201 Opportunite` · 400 |
| GET | `/api/opportunites/{id}` | — | `200 Opportunite` · 404 |
| PUT | `/api/opportunites/{id}` | `OpportuniteInput` (partiel) | `200 Opportunite` · 404 |
| DELETE | `/api/opportunites/{id}` | — | `200` · 404 |

**Dashboard & Admin**

| Méthode | Path | Auth | Sortie |
| --- | --- | --- | --- |
| GET | `/` | 🔓 | Infos API + liste des endpoints |
| GET | `/api/health` | 🔓 | `status`, `uptime`, compteurs, dernière activité |
| GET | `/api/dashboard/stats` | 🔒 | `{ contacts, entreprises, opportunites, montant_total }` |
| GET | `/api/admin/stats` | 🔓 | stats détaillées (par secteur, par statut, prochain reset) |
| POST | `/api/admin/reset-formation` | 🔓 | `{ message }` |

### Interfaces TypeScript à créer

Pattern commun : **`Entity` (avec `id`) + `EntityInput` (`= Omit<Entity, 'id'>`)** — la convention
`Company`/`CompanyPayload` existante. Champs requis selon le Swagger : `nom` (Entreprise),
`titre` (Opportunité), `nom`/`prenom`/`email` (Contact) ; les `*_id` sont `number | null`.

**`@mini-crm/companies/util`** _(la `Company` existante = `Entreprise` — à aligner/renommer)_

```ts
export interface Entreprise {
  id: number;
  nom: string; // requis
  secteur?: string;
  adresse?: string;
  telephone?: string;
}
export type EntrepriseInput = Omit<Entreprise, 'id'>;
```

**`@mini-crm/contacts/util`**

```ts
export interface Contact {
  id: number;
  nom: string; // requis
  prenom: string; // requis
  email: string; // requis
  telephone?: string;
  entreprise_id?: number | null;
}
export type ContactInput = Omit<Contact, 'id'>;
```

**`@mini-crm/orders/util`** _(opportunités)_

```ts
export type StatutOpportunite = 'Prospect' | 'En cours' | 'Gagne' | 'Perdu';

export interface Opportunite {
  id: number;
  titre: string; // requis
  description?: string;
  montant?: number;
  statut?: StatutOpportunite;
  contact_id?: number | null;
  entreprise_id?: number | null;
}
export type OpportuniteInput = Omit<Opportunite, 'id'>;
```

**`@mini-crm/shared/util`** _(auth — à côté de `Credentials` ; `LoginInput` ≈ `Credentials`)_

```ts
export interface LoginInput {
  email: string;
  password: string;
} // = Credentials
export interface RegisterInput {
  email: string;
  password: string;
  nom: string;
  prenom: string;
}

export interface UserProfile {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}
export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface ApiError {
  error: string;
} // schéma "Erreur"
```

**Optionnel — dashboard (pas de feature dédiée aujourd'hui)**

```ts
export interface DashboardStats {
  contacts: number;
  entreprises: number;
  opportunites: number;
  montant_total: number;
}
```

### Points d'attention

- **Requis vs optionnel** : les `required()` actuels de `form-company` (secteur/adresse/téléphone)
  sont **plus stricts que l'API** (seul `nom` est requis) — à ajuster.
- **PUT partiel** (contacts & opportunités) : typer le body de `update()` en `Partial<EntityInput>`.
- **snake_case API** : `entreprise_id` / `contact_id` / `montant_total` — garder tel quel (simple)
  ou mapper en camelCase via un adaptateur dans le service.
- **JWT + SSR** : stockage du token derrière `isPlatformBrowser` / `afterNextRender` (contrainte
  transverse SSR-safe).
