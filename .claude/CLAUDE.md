
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project context

In one line: this repo is the **starter for a 3-day advanced-Angular training** (a mini-CRM in
Angular 21) that will be migrated to an **Nx monorepo** and covered with **Vitest + Playwright**
tests — it is a teaching support, not a production app. Communicate in **French**.

Full context (the app, the features, the training flow, the planned evolutions):

@../CONTEXT.md

The detailed step-by-step is in `GUIDE-FORMATION.md` at the repo root — read the relevant step on demand (do not assume it is fully loaded).

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## SSR Compatibility (mandatory)

SSR may be enabled at the end of the course (depending on the group), so **all code MUST be
SSR-safe from day one**, whether SSR is on or not.

- Never touch browser-only globals (`localStorage`, `sessionStorage`, `window`, `document`,
  `navigator`) during construction or at field/signal **initialization**. On the server they do not
  exist and the app will crash.
- Gate any browser-only access behind `isPlatformBrowser(inject(PLATFORM_ID))`, or run it inside
  `afterNextRender` / `afterRender`. Read persisted state lazily inside that guard, not eagerly.
- Prefer wrapping browser storage in an injectable service that is a safe no-op on the server, so
  components/services never call `localStorage` directly.

## Accessibility Requirements

- It MUST pass all automated AXE checks — but treat AXE as a floor, not proof of
  conformance (it covers ~40% of WCAG criteria).
- It MUST meet all WCAG 2.2 AA criteria.

### Semantic HTML first
- Prefer native elements (`<button>`, `<a>`, `<nav>`, `<main>`, `<table>`, `<label>`)
  before reaching for ARIA. No ARIA is better than bad ARIA.
- Use ARIA only to fill gaps native HTML cannot cover.

### Keyboard & focus
- All interactive elements MUST be reachable and operable by keyboard, in a logical tab order.
- No keyboard traps. Visible focus indicators on every focusable element.
- On route changes, move focus to the new view (SPA focus management).
- Trap focus in dialogs/modals (use Angular CDK `cdkTrapFocus`).

### Forms (Reactive)
- Every control has an associated `<label for>`.
- Error messages are linked via `aria-describedby` and announced.
- Validation state exposed via `aria-invalid`.

### Dynamic content (signals / @if / @for)
- Announce async/state changes with `aria-live` regions or the CDK `LiveAnnouncer`.

### Contrast & visuals
- Text contrast ≥ 4.5:1 (≥ 3:1 for large text and UI components).
- Never convey meaning by color alone.
- Respect `prefers-reduced-motion`.

### Verification
- Automated AXE pass + manual keyboard-only walkthrough + screen reader spot-check.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Clean Code

- Names reveal intent: descriptive, no abbreviations (`userList` not `ul`).
- Functions do one thing and stay short; prefer early returns / guard clauses over nesting.
- No magic numbers or strings — extract to named constants.
- DRY: extract shared logic; don't copy-paste blocks.
- No dead code, no commented-out code, no leftover `console.log`.
- Comments explain *why*, not *what*; the code itself explains the *what*.
- Prefer immutability (`readonly`, `const`); never mutate inputs.
- Handle errors explicitly — no empty `catch`, no silent failures.
- Enforce formatting/linting via Prettier + ESLint (angular-eslint).

## Eco-design & Performance

- Use `@defer` to lazy-load heavy/below-the-fold components and dependencies.
- Always provide `track` in `@for` to avoid full DOM re-rendering of lists.
- Virtualize long lists (CDK `cdk-virtual-scroll-viewport`) and paginate server data.
- Prevent memory leaks: use `takeUntilDestroyed()` or the async pipe — never leak subscriptions.
- Minimize network: cache responses, `debounceTime` on inputs, request only needed fields (avoid over-fetching).
- Keep bundles small: enforce budgets in `angular.json`, rely on tree-shaking, avoid heavy deps.
- Prefer signals + `OnPush` to cut unnecessary change-detection cycles.
- Optimize assets: modern formats (WebP/AVIF), correct sizing via `NgOptimizedImage`, compression/gzip-brotli on the server.
- Respect `prefers-reduced-motion`; avoid continuous animations/timers that keep the CPU awake.

## Nx Monorepo Best Practices

- Apps are thin shells (bootstrap, root routes, providers). All real logic lives in `libs/`.
- Type every lib by single responsibility: `feature` (smart, routed), `ui` (dumb, presentational),
  `data-access` (services, state, models, HTTP), `util` (pure helpers, types).
- A lib's ONLY public surface is its `index.ts` barrel. Never deep-import into another lib's `src/`.
  Export from `index.ts` deliberately — everything else is private.
- Tag every lib with `type:*` and `scope:*`, and enforce dependencies with
  `@nx/enforce-module-boundaries`. Allowed direction: `feature → ui | data-access | util`,
  `ui → ui | util`, `data-access → data-access | util`, `util → util`. Nothing depends on a
  `feature` except an app.
- Generate libs/components with the CLI (`nx g @nx/angular:library … --tags=type:…,scope:…`);
  do not hand-roll the structure. Always pass `--tags` at generation time.
- Use `nx affected -t lint test build` and rely on the task cache; check `nx graph` after any
  structural change and keep the graph acyclic.
- **Libs MUST NOT import the app's `environment.ts` / `environment.prod.ts`** — that couples a lib to
  a specific app and breaks module boundaries. Expose configuration through an `InjectionToken`
  (e.g. `API_BASE_URL`) declared in a `util` lib; the **app** provides the token value from its
  environment, and services in libs read it via `inject(API_BASE_URL)`.

## Vitest (Unit Tests) Best Practices

- Run via the Angular builder (`@angular/build:unit-test`) with `ng test` / `nx test`. Co-locate
  `*.spec.ts` next to the source.
- Test behavior through the public API, never private fields. For signals, assert via the exposed
  read API (`computed`, `asReadonly`), not internal writable signals.
- Use `TestBed` for components/services; for HTTP use `provideHttpClientTesting` +
  `HttpTestingController`, and `verify()` in `afterEach`. No real network calls.
- Prefer `fakeAsync`/`flush` or `await fixture.whenStable()` over arbitrary timeouts.
- Reset shared state between tests (e.g. `localStorage`) in `afterEach`; keep units isolated and
  independent. One behavior per test, AAA structure (Arrange / Act / Assert).

## Playwright (E2E) Best Practices

- Keep e2e in a dedicated project (e.g. `apps/mini-crm-e2e`). Never hit the production API — stub
  network with `page.route()` or point at a disposable test backend.
- Locate by role/label (`getByRole`, `getByLabel`) to reuse the accessibility contract; avoid
  brittle CSS/XPath. Use `data-testid` only when no accessible role/label fits.
- Use web-first assertions (`await expect(locator).toBeVisible()`); rely on auto-waiting — never
  hard-code sleeps.
- Make tests independent and parallel-safe: seed and clean state per test, no inter-test ordering.
- Extract reused flows into Page Objects. Run headless in CI with `trace: 'on-first-retry'`.
