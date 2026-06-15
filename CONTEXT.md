# Contexte du projet

## Ce que c'est

`starter-angr-to-agav-nx` — le **projet de départ d'une formation Angular avancé de 3 jours**.

Le point de départ est un **mini-CRM Angular 21** issu d'une formation « Angular init ». On part de
ce code pour monter en compétence : Angular avancé → migration **Nx monorepo** → **tests**
(unitaires Vitest + e2e Playwright). **Ce n'est pas une application de production**, c'est un
support pédagogique.

## L'application (mini-CRM)

Petit CRM avec, côté API, des entreprises / contacts / commandes (API réelle hébergée sur Railway,
voir `src/environments/environment.ts`).

Features (`src/app/`) :

- `feature-companies` — **complète** : liste / ajout / édition, `CompanyService` (signals), modèle.
- `feature-connect` — **connexion simulée** : `FormConnect` (signal forms) + service `Auth` (localStorage).
- `feature-contacts` — **squelette** (pages vides, à compléter).
- `feature-orders` — **squelette** (pages vides, à compléter).
- `feature-not-found` — page 404 (route `**`).
- `shared` — `Auth`, `Nav`, `Header`, `ConfirmDialog` (`<dialog>` natif).

Stack : Angular 21 standalone, **signals** + **signal forms** (`@angular/forms/signals`,
expérimental), Bootstrap 5, lazy loading, control flow natif (`@if`/`@for`).

## Déroulé de la formation

1. **Récupération** du starter (zip GitHub → dézip → `npm install`). Playwright est déjà prévu,
   Compodoc a été retiré.
2. **Dette technique** : les stagiaires s'approprient le code en corrigeant la dette (liste dans
   `GUIDE-FORMATION.md`), puis **découpage des routes enfant par feature** (avant Nx).
3. **Angular avancé** (animé par le formateur).
4. **Migration Nx monorepo** : `nx init` en place, puis extraction des libs **feature par feature**
   en CLI, vérifiée avec `nx graph` à chaque étape.
5. **Tests** : unitaires (Vitest, déjà installé) + e2e (Playwright). Faute de temps sur 3 jours, les
   tests sont **écrits avec Claude Code**. Vitest est lancé via `ng test` (sortie lue par Claude) ;
   Playwright est piloté par son **MCP officiel** (`.vscode/mcp.json`). Il n'existe pas de MCP
   Vitest officiel — on n'en utilise donc pas.

## Évolutions prévues pendant la formation

- **API → variante protégée JWT (jour 1-2)** : on changera `apiBaseUrl` dans `environment.ts` et
  `environment.prod.ts` pour pointer vers une API **identique mais protégée par JWT**, avec des
  endpoints supplémentaires de **création de compte** et de **connexion**. Le service `Auth`
  (aujourd'hui simulé) deviendra une vraie authentification JWT.
- **SSR possible en fin de formation** (selon le souhait des stagiaires) : on stocke l'utilisateur
  connecté dans le `localStorage` et on continue ainsi, MAIS **tout le code doit être SSR-safe dès
  le départ** (cf. la règle « SSR Compatibility » dans `.claude/CLAUDE.md`). En SSR, plus d'accès
  direct au `localStorage` : il faut garder ces accès derrière `isPlatformBrowser` /
  `afterNextRender`.
- **Migration Nx** : les libs ne pourront pas importer `environment.ts` — la config passera par un
  `InjectionToken` (`API_BASE_URL`) fourni par l'app (cf. section Nx de `.claude/CLAUDE.md`).

## Repères pour Claude

- Best practices à respecter : voir `.claude/CLAUDE.md` (Angular, SSR, Nx, Vitest, Playwright).
- Pas-à-pas : voir `GUIDE-FORMATION.md`. ⚠️ Sur le starter ce guide est **volontairement partiel**
  (roadmap : seul le démarrage est détaillé). Les étapes suivantes se font **en live** pendant la
  formation ; la version complète avec solutions vit uniquement sur le repo privé du formateur.
- Public expert (formateur) : aller à l'essentiel, privilégier l'angle pédagogique et
  l'architecture. Communication en **français**.
