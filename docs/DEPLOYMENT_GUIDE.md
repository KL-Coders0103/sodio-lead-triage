# Deployment Guide — SODIO Lead Triage

## Status
No deployment host, production environment, domain, or credentials are established by this plan. Select providers through an ADR before deployment.

## Proposed topology
Web/API runtime, worker runtime, managed PostgreSQL, optional queue/cache, private object storage, secret manager, logging, error monitoring, and metrics. Do not expose database, queue, or private storage publicly.

## Environment separation
Use separate local, test, staging, and production credentials/data stores. Staging uses synthetic or approved masked data. Restrict and audit production access.

## CI/CD flow
1. Install from lockfile.
2. Lint, typecheck, run tests.
3. Build immutable artifact.
4. Scan dependencies and secrets.
5. Deploy staging.
6. Apply migrations as a controlled step.
7. Run smoke and accessibility checks.
8. Obtain release approval.
9. Deploy progressively and monitor.
10. Verify rollback path.

## Migrations
Prefer backward-compatible expand/contract migrations. Back up and rehearse before destructive changes. Document forward repair or restore procedure; application rollback does not reverse data changes.

## Secrets
Use managed platform secret storage. Rotate exposed credentials. Provider keys stay server-side. Document variable ownership but never put actual values here.

## Observability
Monitor availability, API latency/error rate, queue age/depth, failed jobs, import rejection, extraction latency/errors, provider usage/cost, DB saturation, and unusual export activity. Set thresholds from observed baselines.

## Backup and recovery
Define backup frequency, point-in-time recovery, retention, encryption, RPO/RTO, and object-storage lifecycle. Test restore regularly; an untested backup is not verified.

## Release checklist
- [ ] Security/privacy review complete.
- [ ] Migration rehearsed and backup confirmed.
- [ ] Staging UAT passed.
- [ ] AI provider and data handling approved.
- [ ] Worker retry/dead-letter active.
- [ ] Monitoring and incident runbook ready.
- [ ] Retention/deletion tested.
- [ ] Operational owner assigned.
