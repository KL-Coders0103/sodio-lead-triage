# System Architecture — SODIO Lead Triage

## Style
Use a modular monolith for MVP, with background workers as a separate process when needed. Do not introduce microservices before measured scaling or organizational need.

## Logical components
- Web app: workspace, queue, lead detail, import wizard, analytics, settings.
- Application services: create, ingest, extract, score, review, assign, transition, export, delete.
- Domain: lifecycle invariants, scoring policy, permission policy, duplicate matching contracts.
- Persistence: relational database and migration layer.
- Job processing: durable bounded ingestion/extraction jobs.
- AI adapter: provider abstraction, schema/prompt versions, redaction and timeouts.
- Private file storage: uploaded files with quarantine and limits.
- Observability: structured logs, traces, metrics, and immutable audit events.

## Data flow
1. User submits form/file.
2. API authenticates, authorizes, validates, and stores ingestion request.
3. A job is durably enqueued (transactional outbox preferred).
4. Worker validates and normalizes source rows.
5. Extraction adapter returns structured candidate fields.
6. Runtime schema validates output and records confidence/provenance.
7. Deterministic scoring service creates a versioned score.
8. Lead appears in review queue.
9. Human updates use version checks and create audit events.
10. Analytics are derived from governed events and records.

## Reliability
Use idempotency keys and stable source-row IDs. Retry transient failures with exponential backoff/jitter. Cap attempts; expose dead-letter state. Worker operations must tolerate duplicate delivery. Avoid database/queue dual-write loss with an outbox or equivalent. Use optimistic concurrency on edits.

## AI boundary
Model output is untrusted. Bound prompt size, context, timeout, response size, and retries. Validate structured output. Do not give models authority to assign, reject, message, change access, or query arbitrary records. Keep deterministic scoring separate from generated extraction.

## Security boundaries
Workspace scope is derived from authenticated membership, never trusted from client-supplied IDs. Every related record must belong to the same workspace. Keep provider keys server-side, uploads private, and personal data out of diagnostic logs.

## Proposed deployment topology
Web/API runtime, worker runtime, managed relational database, optional queue/cache, private object storage, managed secrets, error monitoring, metrics. Exact vendors require ADR approval.

## Modules
Identity, Workspaces, Leads, Ingestion, Extraction, Scoring, Triage, Activities, Assignments, Analytics, Audit, Files, and future Notifications. Depend on module contracts, not other modules' persistence internals.

## Scalability
Start with indexed pagination, bounded workers, and throughput measurements. Load-test representative volume before capacity claims. Add queue partitioning, read replicas, caching, or service extraction only when metrics justify them.
