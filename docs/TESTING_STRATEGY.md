# Testing Strategy — SODIO Lead Triage

## Goals
Prove domain correctness, tenant isolation, deterministic explainable scoring, safe ingestion, valid extraction, and reliable human workflows.

## Test layers
### Unit
Normalization, lifecycle rules, scoring factors/ranges/tiers, permission policies, CSV parsing/limits, extraction schemas, confidence behavior.

### Integration
Database constraints, workspace ownership, outbox/queue delivery, idempotent jobs, retries/dead-letter, optimistic concurrency, audit creation, provider timeout/invalid output/rate limit.

### API contract
Authentication, all role/action combinations, pagination, filter/sort allowlists, stable error envelope, idempotency replay/mismatch, cross-workspace IDOR.

### Browser E2E
Sign in; create lead; import CSV; inspect rejected rows; review/correct extraction; inspect score reasons; assign; add activity; transition status; view analytics; verify restricted screens.

### Non-functional
Accessibility, responsive behavior, keyboard flow, load/soak tests, restore/migration rehearsal, security and dependency scans.

## AI evaluation
Maintain a version-controlled synthetic or consented dataset covering clear, ambiguous, incomplete, multilingual, adversarial, malformed, and prompt-injection inputs. Measure per-field accuracy, calibration, abstention, hallucinated fields, and human overrides. Evaluate each model/prompt/schema change against a fixed dataset. Model output is never the test oracle.

## Scoring tests
Test deterministic output, range boundaries, missing data, invalid weights, factor contributions, prohibited feature exclusion, policy activation/rollback, and override audit events.

## Reliability scenarios
Worker crash before/after commit, duplicate delivery, provider timeout/429, queue outage, corrupt/oversized CSV, database interruption, concurrent updates, permission revoked during session.

## Fixtures
Use synthetic companies, contacts, and enquiry text. No real personal data or credentials in test fixtures.

## Quality gates
PR: format, lint, typecheck, unit, integration, relevant E2E. Release: security review, accessibility, migration rehearsal, staging smoke tests. Block release for critical/high exploitable issues or data integrity failures.

## Test case template
| Field | Meaning |
|---|---|
| ID | Stable test identifier |
| Requirement | FR/phase reference |
| Given | Actor and setup |
| When | Action |
| Then | Expected result and audit effect |
| Negative | Unauthorized/invalid/failure behavior |
| Evidence | Test name/report/CI run |
