# Master Feature Implementation Plan — SODIO Lead Triage

Implement vertical slices. Do not mark a phase complete until backend, UI, tests, and operational behavior are verified.

## Phase 0 — Product and engineering foundation
Validate target users, lead sources, taxonomy, required fields, workspace model, MVP exclusions, runtime versions, environment, error format, logging, CI, and synthetic-data policy.
**Exit:** accepted decisions and reproducible local setup.

## Phase 1 — Domain, persistence, and contracts
Define workspace, user, membership, lead, source record, extraction run, score, activity, assignment, import batch/row, and audit entities. Add constraints, indexes, migrations, schemas, and test fixtures.
**Exit:** migrations and invariants tested.

## Phase 2 — Authentication and access control
Implement sign-in/out, session lifecycle, recovery, workspace membership, role/permission checks, and cross-workspace denial tests.
**Exit:** permission matrix passes for every action.

## Phase 3 — Lead capture and normalization
Build manual form, server validation, source preservation, contact normalization, and idempotent create behavior.
**Exit:** valid input creates one lead; invalid input reports field errors; retry is safe.

## Phase 4 — Import pipeline
Specify CSV format/limits, parse safely, validate rows, persist outcomes, enqueue bounded jobs, and add retry/dead-letter state.
**Exit:** interrupted and retried batch processing is safe and observable.

## Phase 5 — AI-assisted extraction
Define provider interface, minimum-data policy, structured output schema, prompt/schema versions, confidence, provenance, warnings, deterministic mock adapter, and evaluation dataset.
**Exit:** invalid/ambiguous output remains reviewable and is never silently accepted.

## Phase 6 — Explainable prioritization
Implement deterministic versioned rules, approved business factors, reason codes, missing-signal output, policy preview and tests.
**Exit:** fixed inputs plus policy yield deterministic explainable scores.

## Phase 7 — Triage queue and lead detail
Build paginated searchable queue, filters, list/card responsive treatment, source context, extraction suggestions, score breakdown, and system states.
**Exit:** operator can inspect and prioritize leads accessibly.

## Phase 8 — Human review and lifecycle
Add field corrections with provenance, allowed state transitions, closure reasons, notes, contact attempts, next action, and optimistic concurrency.
**Exit:** material changes are traceable and lifecycle invariants tested.

## Phase 9 — Assignment and team workflow
Add assignment/reassignment, reason capture, ownership history, unassigned backlog, and team queue.
**Exit:** manager routing works within permission boundaries.

## Phase 10 — Analytics and scoring governance
Define metrics; build overview/triage analytics; add scoring policy drafts, validation, approval, activation, version history, and rollback.
**Exit:** scoring updates are auditable and measurable.

## Phase 11 — Security, privacy, resilience
Complete threat model, access review, rate limits, dependency scan, retention/deletion, backup restore, provider outage, and queue recovery tests.
**Exit:** no unresolved critical/high release-blocking issue.

## Phase 12 — Staging, release, operations
Run migration rehearsal, UAT, smoke/accessibility tests, production config, monitoring, incident runbook, progressive rollout, and rollback verification.
**Exit:** release evidence and named operational owner.

## Feature acceptance template
Capture user story, roles, business rules, schema/API, UI and failure states, audit events, telemetry, tests, rollout, rollback, and tracker evidence.
