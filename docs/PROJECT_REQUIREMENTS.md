# Project Requirements — SODIO Lead Triage

## Charter
Build a reliable, explainable lead-triage web application from a greenfield baseline. This document is a proposed specification, not evidence of implemented features or installed dependencies.

## Recommended technical baseline
- Web: Next.js App Router, React, TypeScript.
- UI: Tailwind CSS and accessible component primitives.
- Validation: Zod or equivalent runtime schemas.
- Persistence: PostgreSQL with Prisma.
- Background processing: durable queue; Redis/BullMQ or an alternative selected after workload analysis.
- AI extraction: provider-neutral adapter; deterministic mock in tests; hosted provider only after privacy review.
- Observability: structured logs, metrics, traces, audit events, error reporting.
- Testing: unit, integration, API contract, accessibility, and browser E2E.

Pin versions and verify hosting compatibility during Phase 0. These are recommendations, not verified repo dependencies.

## Scope
Included: identity/workspaces, lead capture, import, normalization, duplicate review, extraction, scoring, triage queue, activities, assignment, analytics, audit, privacy controls.
Excluded unless approved: outbound messaging, full CRM, billing, autonomous rejection, unapproved enrichment, cross-customer data sharing, model training on customer data.

## Environments
Local development with synthetic data; isolated CI/test services; staging with synthetic or approved masked records; production with managed secrets, backups, monitoring, and restricted access.

## Architecture boundaries
Presentation → application use cases → domain policies → infrastructure adapters. Keep AI providers, database clients, queues, and storage out of domain logic. Workers execute bounded, idempotent jobs.

## Engineering constraints
- TypeScript strict mode and runtime validation at every untrusted boundary.
- Explicit reviewed migrations; no ad-hoc production schema pushes.
- Paginate unbounded collections and cap imports/search/export.
- Idempotency for user submissions and retries.
- Store timestamps in UTC; render in selected timezone.
- Do not log secrets or raw personal data.
- Server-side authorization for every privileged action.
- Bounded AI calls, retries, files, and batch sizes.

## Data constraints
Distinguish original source, extracted candidates, and human-confirmed values. Track provenance and confidence. Scope persistent domain entities to a workspace. Define deletion and retention separately from soft deletion.

## Delivery
Build vertical slices across schema, domain, API, UI, tests, and telemetry. Each phase must finish with a demonstrable flow and acceptance evidence.

## Definition of ready
Actor, value, permissions, input/output schema, business rules, failure states, UI states, audit, telemetry, test cases, and data impact are known.

## Definition of done
Acceptance criteria, tests, authorization, responsive/accessibility states, audit/observability, migration/rollback notes, documentation, tracker, and security review are complete.

## Key risks
| Risk | Mitigation |
|---|---|
| Extraction hallucinations | Strict schema, confidence, human review, evaluation set |
| Opaque or biased scoring | Explicit features, prohibited signals, versioning |
| Duplicate imports | Idempotency and supervised matching |
| Personal-data exposure | Workspace RBAC, redacted logs, export controls |
| Queue/provider outage | Bounded retries, dead-letter state, mock adapter |
| Cost spikes | File limits, quotas, concurrency and cost metrics |
| CRM scope creep | Non-goals and phased integration roadmap |

## Open decisions
Workspace model, identity provider, queue, file storage, AI provider/model, CSV format, lead taxonomy, score weights, retention periods, hosting, integrations.
