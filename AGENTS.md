# Project Instructions

## Purpose

These instructions define strong defaults for AI-assisted software projects. Follow a more specific project rule when it conflicts with this document.
Code must be simple, deterministic, explicit, local, predictable, and easy to inspect.
When concerns conflict, the higher tier wins. Within a tier, the earlier item wins.

## Priority Model

### Invariant

Must be preserved unless the requirement itself makes it impossible.

1. **Correctness & type safety** — predictable behavior, validation, invariants, strong contracts, illegal states made difficult or impossible.
2. **Security** — treat all external input as untrusted; keep secrets and sensitive data out of source code and client bundles; enforce authorization on the server; apply least privilege.
3. **Data integrity & persistence** — schemas, constraints, transactions, migrations, consistency, backups, recovery.
4. **Error handling** — explicit failures, reusable errors, standardized error structure, no silent failures.

### Critical

Strong engineering defaults. Deviations require explicit justification.

5. **Architecture & modularity** — clear boundaries, separation of concerns, cohesive modules, manageable dependencies.
6. **Determinism** — isolate time, randomness, concurrency, I/O, and other nondeterministic effects behind explicit boundaries.
7. **Locality of Behavior** — keep related logic, state, effects, and decisions close together; minimize the code a developer must inspect to understand a behavior.
8. **Maintainability** — consistency, explicitness, low accidental complexity.
9. **Testing** — add or update tests for every behavior change, using unit, integration, end-to-end, regression, or contract tests as the change requires.
10. **Reliability** — set timeouts on every external call; retry only idempotent operations.
11. **Observability** — use structured logs; log errors with context and a request ID; never log secrets or personal data.

### Important

Follow by default. Yield only to higher tiers.

12. **API & interface contracts** — stable interfaces, versioning, compatibility, explicit contracts.
13. **Performance** — paginate or bound every list query; measure before optimizing.
14. **Configuration & environments** — reproducible environments, externalized configuration, minimal environment-specific behavior.
15. **Dependency management** — minimal and deliberate dependencies, pinned versions, vulnerability management, intentional upgrades.

## Working Rules

- Follow existing codebase conventions before introducing new patterns.
- Make the smallest change that fully solves the task. Do not refactor, rename, or add features outside the request.
- Ask instead of guessing when requirements, contracts, or data shapes are ambiguous.
- Do not invent APIs, config keys, or dependencies. Verify they exist.
- Never weaken an Invariant to make something pass: no disabling types, swallowing errors, skipping validation, or relaxing tests.
- When deviating from a Critical default, state the reason in a code comment or the PR description.

---

# Meu De Direito

The rules below extend the defaults above for this project and override them where they conflict. When in doubt, ask instead of guessing.

Meu De Direito is a single, self-contained HTML file. It asks the user a series of questions, one per screen (onboarding style), then lists the government assistance programs they may be entitled to and how to apply for each. There is no backend: everything runs in the browser and the answers never leave the device. The UI is in Brazilian Portuguese (pt-BR).

## Scope

- The app gives guidance, not a legal decision. Results tell the user they *may* be entitled ("você pode ter direito") and point to the official channel where they apply (CRAS, Meu INSS, gov.br). Never present a result as an approval or a denial. The results screen states that the final decision belongs to the agency responsible for the program.
- Eligibility is decided only by the rules engine described below. Never decide eligibility with a model or a remote service (an LLM, Jev or similar).
- Never ask for identifying data: CPF, NIS, name, address, phone, email or document numbers. The app needs facts (income, household size, age…), not identity.

## How the defaults apply here

- There is no server, network access, database or logging. The defaults about timeouts, retries, logs, request IDs, pagination and server-side authorization have nothing to apply to. Do not add infrastructure just to satisfy them.
- *Data integrity* applies to the rules data: it is validated against a schema, versioned and tested the way a database schema would be.
- *External input* means the user's answers and the data embedded in the page. Validate both at the boundary.

## Architecture

- The shipped artifact is `dist/index.html`, with all HTML, CSS, JavaScript and rules inlined into that one file. It makes no network requests at runtime (no CDN, web fonts, analytics or remote images), and it works offline and when opened from `file://`.
- The build adds a `Content-Security-Policy` meta tag with `default-src 'none'` and hashes for the inline script and style, so the browser blocks any network request. Therefore: no inline `style="…"` or `on…="…"` attributes.
- No htmx and no front-end framework. The UI is plain HTML, CSS and vanilla JavaScript, written as ES modules in the source.
- The source is split into modules so the logic can be unit tested, then bundled into the single file (see Open decisions).

```
src/
  index.html             # page shell; one <template> per question type and per screen
  styles.css             # design tokens (CSS custom properties) and styles
  app.js                 # DOM glue only: rendering, input, navigation, focus
  flow.js                # questions as data and the branching between them (pure)
  facts.js               # derives facts from answers, e.g. per-capita income (pure)
  engine.js              # evaluates program rules against facts (pure)
  format.js              # parses and formats money, numbers and dates (pure)
  text/pt-BR.json        # every user-facing string
rules/
  program.schema.json    # schema every program file must satisfy
  answers.schema.json    # shape of a complete set of answers
  programs/<id>.json     # one file per assistance program
tests/
  vectors/<id>.json      # answers → expected result, per program
scripts/
  build.mjs              # validates the rules and produces dist/index.html
```

- Only `app.js` touches the DOM, handles events or reads the clock. `flow.js`, `facts.js`, `engine.js` and `format.js` are pure functions with no DOM or global access.
- Questions are data in `flow.js`: id, input type, text keys, the facts they feed and the condition for showing them. Adding a question never requires new DOM code unless it needs a new input type.

## Eligibility rules

Results come from a pipeline of pure functions: answers → facts → program rules → results.

- **Answers** are what the user said, validated against `rules/answers.schema.json`. "Não sei" (I don't know) is a real answer, distinct from a missing one.
- **Facts** are the derived values the rules need, e.g. `incomePerCapitaCentavos`, `householdSize`, `hasMemberAged65OrOver`. JSON Schema cannot do arithmetic, so every computation happens in `facts.js`, never inside a rule. When programs define a term differently (what counts as income, who counts as family), derive one fact per definition instead of sharing a single fact.
- **Program rules**: each file in `rules/programs/<id>.json` contains:
  - `id`, plus text keys for `name` and `howToApply`
  - `sources`: the legal basis (law, decree or ordinance, with the article) and official URLs (planalto.gov.br, in.gov.br, gov.br)
  - `effectiveFrom`, and `verifiedOn` (the date someone last checked the rule against its sources)
  - `criteria`: a JSON Schema (draft 2020-12) over the facts. The user may be entitled exactly when their facts are valid against it.
- Criteria use only these keywords: `type`, `properties`, `required`, `const`, `enum`, `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `allOf`, `anyOf`, `not`, `if`/`then`/`else`, plus `title`, `description` and `$comment`. The build rejects any other keyword. Every criterion has a `title` holding a text key, so a failure can be explained to the user in plain words.
- Never write a threshold, age limit or criterion from memory. Copy it from the cited source, put the article in `$comment`, and ask when the legal text is ambiguous. Write thresholds tied to the minimum wage out in centavos, with the minimum-wage value and its source in `$comment`, and update them whenever the minimum wage changes.
- Facts the user answered "não sei" are left out of the facts object. If every failed criterion fails only because one of those facts is `required`, the result is `needs-check`.
- Results are a discriminated union on `status`, documented with JSDoc typedefs:
  - `eligible`: criteria met; includes the facts that matched
  - `needs-check`: the outcome depends on an answer marked "não sei"; says what to confirm and where
  - `not-eligible`: includes the unmet criteria
  - `error`: the rule could not be evaluated. Never turn an error into `not-eligible`; show "não foi possível verificar".
- Every program has test vectors in `tests/vectors/<id>.json`. They cover each criterion, the exact threshold, one centavo above it, and household totals that don't divide evenly. A change to a rule updates its vectors and its `verifiedOn` in the same change.
- Every fact a rule uses must be produced by `facts.js`, and every question must feed at least one fact some rule uses. Ask only what a rule needs. Tests enforce both.

## Money, numbers and dates

- Money is integer centavos everywhere. Never use floating-point arithmetic on it.
- `format.js` parses user input ("1.234,56", "R$ 1.234", "1234") into centavos and rejects ambiguous input with an error instead of guessing. The accepted formats are defined by its tests.
- Every division states its rounding direction, chosen to match the legal comparison, and uses integer arithmetic (`%`), not floating-point division. For "até X" or "igual ou inferior a X" (≤), round per-capita income **up** to the centavo: `ceil(total / n) ≤ X` holds exactly when `total / n ≤ X`.
- Format money, numbers and dates for display with `Intl` in `pt-BR`, through `format.js` (R$ 1.234,56; 16/10/2025).

## UI and accessibility

Many users are on low-end Android phones or slow connections, are not comfortable reading long text, or use a screen reader. Design for them first.

- Show one question per screen. Each screen has a progress indicator (counting only the steps on the current path), a Back button that keeps the answers, and a "Não sei" option wherever someone might not know. Before the results, a review screen lists every answer and lets the user edit it.
- Give each step its own URL hash so the browser's and Android's back buttons work. Never put answers in the URL.
- Write in plain language (linguagem simples): short sentences and everyday words. Explain any unavoidable term (e.g. "renda por pessoa") right next to the question.
- Meet WCAG 2.2 AA. Use native form controls, `<fieldset>`/`<legend>` for choice groups and a label on every input. Touch targets are at least 48×48 CSS px. On every step change, move focus to the question heading. Announce errors through `aria-live`. Never rely on color alone.
- Design mobile-first: the layout works from 320 px wide and with text zoomed to 200%. Support light and dark themes via `prefers-color-scheme`. Colors, sizes and spacing come only from the tokens in `styles.css`.
- For each program, the results screen shows its status, the reasons in plain words, how and where to apply, links to the official sources and the date in "regras verificadas em".
- Render by cloning `<template>`s and setting `textContent`. Never use `innerHTML`, `insertAdjacentHTML`, `eval` or `new Function`.

## Text

- All user-facing text lives in `src/text/pt-BR.json` and is referenced by key. No user-facing string literals in JavaScript or HTML templates.
- Code, comments and docs are in English.

## Privacy

Answers about income, family, health and disability are sensitive personal data under the LGPD.

- Answers live in memory only and are gone when the tab closes. "Recomeçar" (start over) clears them. Ask before adding any storage (`localStorage`, `sessionStorage`, IndexedDB, cookies).
- No analytics, telemetry, error reporting or third-party code. Do not commit `console.log`.

## Determinism

- Pure modules never call `Date.now()`, `new Date()` or `Math.random()`. If logic needs today's date (e.g. to compute age from a birth date), `app.js` reads it and passes it in.
- The same answers and date always produce the same results. The test vectors rely on this.

## Browser support

- Targets: current Chrome for Android, Safari on iOS, Samsung Internet and Firefox, plus desktop Chrome, Edge and Safari.
- Use only web features that are Baseline "widely available". Check MDN before using an API instead of relying on memory.

## Dependencies

- No runtime dependencies. The shipped file contains only this project's code.
- Every dev dependency requires explicit approval, so ask first. Prefer the Node standard library (`node --test`, `node:fs`, `node:crypto` for the CSP hashes). Pin the Node version in `.nvmrc` and dependency versions exactly.

## Open decisions: ask before implementing

- **Bundling into one file:** turning ES modules into one inline script needs a bundler: either esbuild as the only dev dependency, or a dependency-free build script with stricter module conventions.
- **JSON Schema validator:** either Ajv, compiled to standalone code at build time so nothing extra ships, or a small in-house evaluator for the keyword list above, tested against the matching cases of the official JSON Schema Test Suite.
- **Type checking and lint:** e.g. TypeScript in `checkJs` mode over JSDoc, ESLint and Prettier.
- **End-to-end tests:** a browser runner (e.g. Playwright) driving `dist/index.html`.
- **Initial programs** and their official sources.

## Commands

Update this section as the tooling is set up.

```bash
node --test               # unit tests and rule test vectors
node scripts/build.mjs    # validate the rules and produce dist/index.html
```

**Definition of done:** the build and unit tests pass, plus typecheck, lint and end-to-end tests once they exist. Every flow the change touches has been walked through in `dist/index.html`, by hand or by an end-to-end test.
