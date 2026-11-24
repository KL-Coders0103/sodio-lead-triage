# Development Guide — SODIO Lead Triage

## Starting point
This repo is being reset to a documentation-first greenfield specification. Commands below are scripts to define after selecting and pinning the toolchain; they are not verified current commands.

## Proposed prerequisites
Supported Node.js LTS, selected package manager, PostgreSQL, and optionally Redis/container runtime if the approved queue design requires them.

## Environment categories
Application URL/mode, database URL, auth/session configuration, queue connection, private storage, AI provider/key/model/timeout, monitoring DSN, and rate limits. Use ignored local env files and validate required settings at startup. Never commit credentials. Browser-exposed variables must never contain secrets.

## Recommended scripts to establish
`dev`, `build`, `lint`, `typecheck`, `test`, `test:integration`, `test:e2e`, `db:migrate`, `db:seed`. Seed only synthetic data. Do not assume these scripts exist until implemented.

## Branch and commit workflow
Use focused short-lived branches and small PRs. Conventional Commits is a recommended convention. Link PRs to requirements and update the tracker only with evidence.

## Code organization
Keep domain rules framework-independent. Put database, AI, file, and queue services behind adapters. Use explicit DTOs, runtime schemas, and stable API contracts. Avoid circular dependencies.

## Database workflow
Change schema and migration together; review generated SQL; test empty install and upgrade path; document backfill and rollback; never reset or push schema directly to production.

## AI workflow
Use a mock provider in normal CI. Version prompts and schemas. Add failures to evaluation fixtures. Measure field quality and costs. Avoid logging raw personal data.

## PR checklist
- [ ] Acceptance criteria linked.
- [ ] Tenant authorization checked.
- [ ] Input validation/failure paths covered.
- [ ] Tests pass for positive and negative paths.
- [ ] UI responsive and accessible.
- [ ] Logs exclude secrets/PII.
- [ ] Migrations reviewed.
- [ ] Docs and tracker updated.
