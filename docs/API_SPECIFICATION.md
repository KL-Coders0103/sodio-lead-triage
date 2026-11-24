# API Specification — SODIO Lead Triage

## Conventions
Proposed base path: `/api/v1`. HTTPS JSON APIs except multipart uploads. Workspace context and role are resolved server-side.

Success:
```json
{ "data": {}, "meta": { "requestId": "req_..." } }
```
Error:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Request could not be processed", "details": [] }, "meta": { "requestId": "req_..." } }
```

Status codes: 400 malformed, 401 unauthenticated, 403 unauthorized, 404 absent/out-of-scope, 409 conflict, 413 oversized, 422 semantic validation, 429 rate limit, 500 unexpected, 503 dependency unavailable.

## Authentication/workspace
- `GET /auth/session` current session/memberships.
- `POST /auth/sign-in`, `POST /auth/sign-out`, `POST /auth/recovery`.
- `GET /workspaces`; `POST /workspaces/:id/switch` (membership required).

## Leads
- `GET /leads` cursor-paginated/filterable queue.
- `POST /leads` create; accept Idempotency-Key.
- `GET /leads/:id` detail/source/extraction/score/assignment.
- `PATCH /leads/:id` permitted field update with expected version.
- `POST /leads/:id/review` accept/correct extracted data.
- `POST /leads/:id/assignments` assign/reassign with reason.
- `POST /leads/:id/activities` append activity.
- `POST /leads/:id/transitions` lifecycle transition.
- `GET /leads/:id/history` authorized timeline.

## Ingestion
- `POST /imports` validated multipart CSV upload.
- `GET /imports/:id` batch state/counts.
- `GET /imports/:id/rows` paginated outcomes.
- `POST /imports/:id/retry` retry eligible rows idempotently.
- `POST /ingestion/webhooks/:sourceKey` optional signed webhook, disabled until configured.

## Extraction/scoring
- `POST /leads/:id/reprocess` authorized re-extraction; retain prior runs.
- `GET /leads/:id/scores` score history.
- `GET /scoring/policies`, `POST /scoring/policies`.
- `POST /scoring/policies/:id/validate`, `/activate`, `/rollback` with elevated permissions and audit.

## Analytics/admin/privacy
- `GET /analytics/overview`, `GET /analytics/triage`.
- `GET /workspace/members`, `POST /workspace/invitations`, `PATCH /workspace/members/:id`.
- `GET /audit-events` restricted.
- `POST /privacy/exports`, `POST /privacy/deletion-requests`.

## Pagination and concurrency
Allowlist filters and sort fields. Default page size 25, maximum 100 (tunable). Prefer cursors for mutable queues. Accept idempotency keys for create/import/retry; same key with different payload returns 409. Use expectedVersion/ETag for updates; stale update returns 409. Every query is workspace-scoped.

## Illustrative extraction output
```json
{
  "intentCategory": "SERVICE_INQUIRY",
  "productInterest": "Example service",
  "budget": { "amount": 5000, "currency": "INR" },
  "timeline": "WITHIN_30_DAYS",
  "location": "Pune",
  "summary": "Needs a service consultation",
  "confidence": { "intentCategory": 0.91, "timeline": 0.72 },
  "warnings": ["Budget inferred from ambiguous wording"]
}
```
This example is not a fixed taxonomy. Unknown values remain unknown; extraction must not invent contact data.

## Contract tests
Cover auth, role/tenant isolation, validation, pagination, idempotency, concurrency, stable errors, provider/queue failure, and out-of-scope record behavior.
