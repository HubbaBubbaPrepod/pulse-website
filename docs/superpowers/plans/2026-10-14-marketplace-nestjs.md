# Pulse Marketplace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking. Native execution in the current session is recommended; do not spawn agents unless the user selects that method or a later applicable instruction requires them.

**Goal:** Discover Pulse modules on GitHub, publish individually moderated releases, and support public downloads and opt-in installation from Pulse Monitor.

**Architecture:** A separate `pulse-marketplace` npm-workspace repository contains a Nest.js API, a Next.js frontend and shared API contracts. PostgreSQL stores identities, candidates, decisions and audit records; immutable package bytes live in a persistent filesystem directory. The static landing, Go monitor and Go agent remain separate repositories.

**Tech Stack:** Node.js 24 LTS, Nest.js 12.1.3, PostgreSQL 18, pg 8.23.1, Next.js 16.4.0, React 19.3.0, TypeScript, openid-client 6.8.8, nodemailer 10.1.1, GSAP 3.15.0, Prettier 3.9.10. Node test runner for API tests; Playwright for browser tests. Exact versions of remaining direct and development dependencies are pinned during the approved bootstrap task.

**Spec:** [marketplace-design.md](../../marketplace-design.md). The spec governs details not repeated here.

## Global Constraints

- Target checkout: `D:/Documents/ChatGPT/PulseMarketplace`; public repository `HubbaBubbaPrepod/pulse-marketplace`, MIT. Do not create the GitHub repository before the implementation review gate.
- Existing checkouts: `Monitor`, `PulseWebsite`, `PulseModuleDocker`; preserve unrelated files and the separate marketplace design branch. No agent protocol changes.
- Discovery topic `pulse-module`; root marker `pulse-marketplace.json`; marker schema 1; one module ID and package asset name per repository.
- Package schema/protocol 1; request body maximum 68 MiB, each binary maximum 16 MiB, decoded total maximum 48 MiB; Linux amd64/arm64 and Windows amd64 only. String limits use UTF-8 byte counts.
- Discovery every 30 minutes; normal published releases only. Pin numeric repository/release/asset IDs, commit and full-package SHA-256. Never execute downloaded binaries.
- Decisions: pending/approved/rejected/withdrawn. Approvals apply to an exact revision. Authors cannot approve their own repository; a moderator must have a linked GitHub identity to establish this check.
- Roles are checked server-side, including at the decision transaction. Public reads/downloads need no account. Disabled OAuth/SMTP capabilities remain explicitly unavailable.
- The monitor catalog and separate update checks default to disabled. Agents never contact the marketplace. No metrics, logs, node identifiers, configuration or agent tokens are sent.
- Native password hashing uses scrypt N=131072, r=8, p=1; asynchronous work with maxmem 256 MiB and at most two concurrent derivations. Session tokens are opaque, hashed in PostgreSQL and carried in HttpOnly/Secure/SameSite cookies.
- Apply Prettier locally and in CI from bootstrap. No Redis, ORM, arbitrary client scripts, automatic module updates or demo publications.
- Approve new dependency families/configuration/services before installation under the user's AGENTS.md. Production DNS, OAuth secrets, SMTP and deployment host are separate inputs, not invented credentials.

## Review Focus

- A UTF-8 name fits JavaScript character limits but exceeds Go byte limits: reject it consistently in both validators (Task 2).
- A GitHub asset or repository owner changes after discovery: create a new pending revision without moving the approved snapshot or owner authority (Task 3).
- A moderator loses their role while reviewing: reject the decision inside its transaction, including concurrent requests (Task 4).
- An OAuth email matches an existing account: never link the accounts implicitly; state/nonce replay is also rejected (Task 5).
- Catalog access is disabled while a download is pending, or installation fails midway: cancel external work and retain the installed module and monitoring service (Task 7).

## File Structure

- `packages/contracts/src/index.ts`: public catalog, revision, validation and moderation DTOs; no server secrets or package binaries.
- `apps/api/src/database/`: pool, migrations and transactional repositories; `apps/api/migrations/001_initial.sql` creates the first schema.
- `apps/api/src/packages/`: pure validator, restricted HTTPS transport, filesystem snapshots and download controller.
- `apps/api/src/discovery/`: GitHub adapter and locked polling orchestration.
- `apps/api/src/catalog/`, `moderation/`, `auth/`: separate public reads, protected decisions and identity/session flows.
- `apps/web/app/[lang]/`: catalog/detail/auth/author/moderation pages; `apps/web/components/` holds themed client controls and motion.
- `deployment/`: compose/reverse-proxy configuration and backup/restore scripts; `docs/` holds RU/EN operator and author documentation.
- Existing monitor: `backend/marketplace.go`, `backend/marketplace_test.go`, `backend/modules.go`, `app/marketplace/page.tsx`, `components/marketplace.tsx`, `components/shell.tsx`, locale dictionaries and `docs/MODULES*`.

### Task 1: Runnable API, PostgreSQL schema and shared contracts

**Files:** root package/config/lock files, `apps/api/package.json`, `apps/api/tsconfig.json`, `apps/api/src/{main,app.module}.ts`, `apps/api/src/database/{database.service,migrations}.ts`, `apps/api/migrations/001_initial.sql`, `packages/contracts/src/index.ts`, `apps/api/test/database.spec.ts`, CI.

**Interfaces:** `DatabaseService.transaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T>`; `runMigrations(pool: Pool): Promise<void>`; `GET /api/v1/health` returns `{ready: true}` only with a reachable, migrated database. Contracts define `Platform`, `RevisionStatus`, `ValidationIssue`, `CandidateInput`, `CatalogQuery`, `CatalogPage`, `CatalogVersion` and `Actor`; later tasks import these exact names. `Actor` is `{userId: string}`. `CatalogQuery` accepts optional query/platform/cursor and limit 1–50. `CatalogVersion` contains owner/id/version, packageSha256, size, platforms, permissions, repository URL, source commit and review timestamp; it contains no binary content. `CatalogPage` contains items, revision and optional nextCursor. Candidate identity includes repositoryId, releaseId, assetId, sourceOwnerId, sourceCommit and packageSha256 as strings, plus immutable package metadata.

- [ ] Set up the approved npm workspaces, TypeScript compilation and test runner without feature implementations. `scripts/test-api.mjs` builds API/tests, then forwards test-name flags before Node's test file arguments. Use a disposable PostgreSQL database for integration tests.

- [ ] Write `database.spec.ts`: running migrations twice is idempotent; a rolled-back decision leaves no audit event; duplicate `(provider, subject)` and `(repository_id, release_id, asset_id, source_owner_id, source_commit, package_sha256)` are rejected; an unavailable database returns readiness 503.
- [ ] Run `npm run test:api -- --test-name-pattern=database` against a disposable PostgreSQL database; record the failing result before implementing the schema.
- [ ] Bootstrap the approved npm workspaces and Nest app; implement the interfaces, unique constraints, migration bookkeeping and tables for users, identities, sessions, email tokens, repositories, revisions, decisions and audit. Use parameterized SQL. Do not auto-seed published modules or grant the first public signup admin rights.
- [ ] Run `npm run format:check`, `npm run typecheck`, `npm run test:api -- --test-name-pattern=database`; require exit 0. Tests receive their own database name and never truncate production data.
- [ ] Commit `feat(marketplace): add API foundation and transactional storage`.

### Task 2: Compatible package validation and immutable snapshots

**Files:** `apps/api/src/packages/{validate-package,package-store,github-transport}.ts`, `apps/api/test/{package-validation,package-store,github-transport}.spec.ts`, `apps/api/test/fixtures/packages/`.

**Interfaces:** `validatePackage(bytes: Buffer): ValidatedPackage`; `ValidatedPackage` is exported by the server validator, not the public contract package, and contains `manifest`, `sha256`, `size`, `platforms`. `PackageStore.put(bytes: Buffer, expectedHash: string): Promise<void>` and `open(hash: string): Promise<Readable>`. `GitHubTransport.downloadAsset(assetApiUrl: string, maxBytes: number): Promise<Buffer>` derives permitted destinations from GitHub, never from arbitrary author URLs.

- [ ] Write tests asserting: a valid fixture is accepted; 16 MiB+1 binary and 48 MiB+1 total fail; unknown fields, malformed base64, altered hashes, wrong ELF/PE architecture and overlong UTF-8 strings fail. Interrupted writes publish no snapshot; a digest mismatch cannot replace existing bytes. Transport rejects a private IP, forbidden redirect and leaked authorization header.
- [ ] Run `npm run test:api -- --test-name-pattern='package|transport'`; record failures.
- [ ] Implement strict JSON parsing/shape validation matching the Go installer, executable-header checks, streaming byte limits and atomic snapshot writes. Enforce hostname and resolved-IP policy on each redirect/connection; carry GitHub credentials only to the API host. Close streams and temporary files on failure.
- [ ] Run the tests to PASS. Run the same fixture cases through a Go test helper in `Monitor/backend/modules_test.go`; neither implementation may accept a fixture the other rejects. Check fixture hashes and leave native binaries unexecuted.
- [ ] Commit `feat(packages): validate and preserve immutable module snapshots`.

### Task 3: GitHub discovery with durable candidates

**Files:** `apps/api/src/discovery/{github-client,discovery.service,discovery.module}.ts`, `apps/api/src/database/revision.repository.ts`, `apps/api/test/discovery.spec.ts`; update contracts.

**Interfaces:** `GitHubClient.findRepositories(cursor?: string): Promise<RepositoryPage>`; `listReleases(repositoryId: string, cursor?: string): Promise<ReleasePage>`; `readMarker(repositoryId: string, commit: string): Promise<DiscoveryMarker>`; `DiscoveryService.runOnce(): Promise<ScanSummary>`; `RevisionRepository.recordCandidate(input: CandidateInput): Promise<string>` returns a revision ID. Pages contain items/nextCursor/incompleteResults; repository items include repositoryId/sourceOwnerId/fullName. Release items include releaseId/tag/commit/draft/prerelease/assets; assets include assetId/name/apiUrl/size and optional digest. Marker is `{schemaVersion:1,moduleId:string,packageAsset:string}`. ScanSummary counts discovered/staged/skipped/failed and marks rate-limit postponement.

- [ ] Write fake-GitHub tests: two result pages are exhausted; drafts/prereleases are skipped; marker ID and release version must match the package; a repeated candidate creates one row; a changed hash/owner/tag creates a new pending revision; 429 preserves published entries; a crash can resume persisted candidates. A second concurrent scan cannot acquire the advisory lock.
- [ ] Run `npm run test:api -- --test-name-pattern=discovery`; record failures.
- [ ] Implement the read-only GitHub adapter, date-range subdivision when search is incomplete/limited, 30-minute scheduling, backoff and durable progress. Use Tasks 1–2 rather than adding a separate queue. Fetch the marker from the pinned release commit and preserve its repository ID across renames.
- [ ] Run discovery tests to PASS, with no access to real GitHub required. An optional live read-only smoke test reports actual discovered repositories without approving them.
- [ ] Commit `feat(discovery): find and stage GitHub module releases`.

### Task 4: Public catalog and transactional moderation

**Files:** `apps/api/src/catalog/{catalog.service,catalog.controller}.ts`, `apps/api/src/moderation/{moderation.service,moderation.controller,roles.guard}.ts`, `apps/api/src/packages/packages.controller.ts`, `apps/api/test/moderation.spec.ts`.

**Interfaces:** `CatalogService.list(query: CatalogQuery): Promise<CatalogPage>`; `version(owner: string, id: string, version: string): Promise<CatalogVersion>`; `ModerationService.decide(actor: Actor, revisionId: string, expectedHash: string, action: 'approve'|'reject'|'withdraw', comment: string): Promise<void>`. `Actor` contains a database user ID; role/identity claims are loaded again inside the transaction.

- [ ] Write tests: pending packages cannot be downloaded by hash; the author's moderator identity cannot approve; revoked roles cannot act; expectedHash mismatch or replacing an approved owner/id/version with another hash returns 409; approval and its audit event commit together; withdrawn versions reject new downloads; two decisions cannot silently overwrite one another. Package files missing from disk block approval/readiness checks for that revision.
- [ ] Run `npm run test:api -- --test-name-pattern=moderation`; record failures.
- [ ] Implement the spec's public routes, cursor pagination, revision/ETag and protected decisions with row locks. A package hash alone is not authorization to a pending file. Invalid automated validation cannot be bypassed by approving from the UI.
- [ ] Run all API tests. Published catalog payloads must omit binary contents, private email, token hashes and moderator-private notes.
- [ ] Commit `feat(moderation): publish reviewed releases and audit decisions`.

### Task 5: GitHub, Google and email accounts with server sessions

**Files:** `apps/api/src/auth/{auth.module,auth.controller,auth.service,session.guard,passwords,oauth,email}.ts`, `apps/api/test/auth.spec.ts`, `apps/api/src/admin/bootstrap.ts`.

**Interfaces:** `AuthService.current(sessionToken: string): Promise<Actor|null>`; `createSession(userId: string): Promise<string>`; `consumeEmailToken(token: string, purpose: 'verify'|'reset'): Promise<string>`; `derivePassword(password: string): Promise<string>`; `verifyPassword(password: string, encoded: string): Promise<boolean>`. GitHub and Google callback adapters return provider ID/sub, not an unverified email as identity.

- [ ] Write tests: wrong/expired/replayed OAuth state and Google nonce fail; matching emails never merge identities; verification/reset tokens are one-use and expiring; login/reset replies do not enumerate emails; tampered/expired/revoked sessions fail; CSRF and insufficient roles reject writes. Disabled provider/SMTP setup reports capability unavailable. Passwords never appear in persisted plaintext or logs.
- [ ] Run `npm run test:api -- --test-name-pattern=auth`; record failures.
- [ ] Implement asynchronous bounded scrypt, PostgreSQL sessions/token digests, explicit authenticated identity linking, email verification/reset, origin/CSRF checks and rate limiting. Use openid-client for Google validation and nodemailer behind an injected SMTP adapter. Bootstrap admin only through a local operator command; require a linked GitHub identity before moderator approvals.
- [ ] Run auth tests plus Tasks 1–4. Real OAuth is tested later with owner-provided client configuration; do not label mocked-provider tests as production login verification.
- [ ] Commit `feat(auth): add provider login and protected moderation sessions`.

### Task 6: Themed Next.js catalog and author/moderator interfaces

**Files:** `apps/web/app/[lang]/{layout,page}.tsx`, `modules/[owner]/[id]/page.tsx`, `login/page.tsx`, `account/page.tsx`, `moderation/page.tsx`, `moderation/[revision]/page.tsx`, `admin/page.tsx`, `apps/web/components/`, `apps/web/lib/{api,i18n}.ts`, `apps/web/test/marketplace.spec.ts`.

**Interfaces:** `publicApi<T>(path: string): Promise<T>` for server-rendered public reads; `privateApi<T>(path: string, init?: RequestInit): Promise<T>` for same-origin authenticated client reads/writes. Both use the shared contracts; private cookies/secrets never become public server-rendered props.

- [ ] Write Playwright tests: unapproved modules are absent; RU/EN catalog filters and direct detail links work; download matches digest; author sees only their own review details; moderator sees queue/checks/decision history and needs a comment; a reader cannot reach privileged actions through direct URLs.
- [ ] Run `npm run test:web`; record failures before creating the corresponding screens.
- [ ] Implement responsive monochrome themes, accessible controls, real skeleton states and scoped GSAP cleanup. Public pages receive SSR metadata, canonical/hreflang and a sitemap of approved modules. Auth/private pages use noindex. Do not invent ratings or safety guarantees.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:web`; inspect 375px and desktop, keyboard navigation, both themes, reduced motion and navigation scroll position.
- [ ] Commit `feat(web): add public marketplace and moderation interfaces`.

### Task 7: Opt-in catalog and installation inside Pulse Monitor

**Files:** `Monitor/backend/{marketplace.go,marketplace_test.go,modules.go,main.go}`, `Monitor/app/marketplace/page.tsx`, `Monitor/components/{marketplace,shell}.tsx`, `Monitor/lib/locales/{ru,en}.json`, `Monitor/docs/MODULES{,.en}.md` and changelogs.

**Interfaces:** local authenticated routes `GET/PUT /api/marketplace/settings`, `GET /api/marketplace/catalog`, `POST /api/marketplace/install`. The install body is `{owner,id,version,expectedSha256}` and contains no URL. Extract the existing module installation body into `installModule(m moduleManifest) (moduleManifest,error)` under the same installation lock; the old upload route continues to call it.

- [ ] Write tests: initial/disabled settings cause zero external requests; enabling persists across restart; disable cancels work; an arbitrary URL cannot be submitted; digest/size/status mismatch rejects installation; partial transfer and conflicting provenance preserve the active package. A manual upload remains usable with catalog access disabled.
- [ ] Run `go test ./...` in `Monitor/backend`; record failures for the new routes before implementation.
- [ ] Implement fixed HTTPS-origin access, explicit confirmation, persisted provenance outside the strict package JSON, and opt-in update checks. Reject a different author's flat module ID collision. Installing a package does not automatically assign/enable it on a server. Add the locale-aware sidebar entry without reintroducing redundant installed-module navigation.
- [ ] Run Go tests/vet, monitor's 26 existing JS tests, lint/typecheck/build and UI tests for disabled access/consent/failure. Verify outbound requests contain no node names, telemetry, email or tokens. Confirm agents use their unchanged protocol.
- [ ] Commit `feat(marketplace): add opt-in catalog installation to the monitor`.

### Task 8: Real module onboarding, deployment and full acceptance

**Files:** `PulseModuleDocker/pulse-marketplace.json`, `PulseModuleDocker/scripts/build.ps1`, module docs/changelog; `PulseWebsite/components/{Site,Header}.jsx` and `lib/site.js`; marketplace `deployment/`, `README{,.en}.md`, `docs/`, CI.

**Interfaces:** Docker marker points to `docker-module.json` and travels with the source release. Landing links use the actual production marketplace URL once deployment is configured. Backup/restore covers PostgreSQL plus the package directory and verifies published hashes after restore.

- [ ] Write an end-to-end test using a fake GitHub release and disposable database: discover → pending → linked non-author moderator approves → same version appears publicly and in enabled monitor → both downloads have identical digest → changed asset yields pending revision. Restart and restore preserve decisions/packages; withdrawal prevents a new installation.
- [ ] Run the E2E test and record its failure before deployment wiring is implemented.
- [ ] Add Docker marker/topic and a new source/package release without modifying old release assets. Create the MIT marketplace GitHub repository, Node/PostgreSQL CI and deployable services only after configuration approval. Add production OAuth/SMTP secrets through private server configuration, not git/chat. Do not publish until admin bootstrap, TLS and migrations are ready.
- [ ] Run the entire acceptance suite, dependency/secret checks, API/browser tests and backup/restore rehearsal. Perform read-only real discovery; actual module approval is a separate moderator action, not an automatic test side effect. Exercise real provider login only with configured applications. Stop temporary local QA services afterwards.
- [ ] Commit `feat(release): publish marketplace onboarding and deployment` and attach any created PRs to the task.

## Review Gate and Production Inputs

No product scaffolding or dependency installation is part of this document-only change. Before implementation, review the updated spec and this plan, confirm native execution or select subagent-driven execution, and approve the listed new dependencies and PostgreSQL service under AGENTS.md.

Production additionally needs the deployment host, the final marketplace domain/DNS, GitHub/Google OAuth applications, SMTP settings, a read-only scanner token, and initial administrator/moderator identities. These do not block isolated tests; they do block claiming production authentication or deployment complete.

## Self-Review

Tasks 1–3 cover contract/storage/discovery; Task 4 covers decisions and public distribution; Task 5 covers all requested identity methods; Task 6 covers UI and SEO; Task 7 covers privacy-preserving monitor integration; Task 8 covers releases, docs and deployment. The five Review Focus cases are explicitly assigned to their owning task tests. New API/library method names refer to the Interfaces blocks above. No planned Go-agent changes, Redis, ORM, execution of user binaries or automatic module upgrades are required.
