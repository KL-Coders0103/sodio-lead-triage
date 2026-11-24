# Implementation Tracker — SODIO Lead Triage

**Baseline:** Greenfield. Status is not inferred from the prior codebase.  
**Statuses:** Not started · In progress · Blocked · In review · Verified

| Phase | Workstream | Status | Evidence required |
|---|---|---|---|
| 0 | Product/engineering decisions | Not started | Accepted ADRs, setup, CI |
| 1 | Domain/database/contracts | Not started | Schema, migrations, invariant tests |
| 2 | Authentication/RBAC | Not started | Auth flow and permission matrix tests |
| 3 | Lead capture/normalization | Not started | Manual flow and validation/idempotency tests |
| 4 | Import pipeline | Not started | Row report, retry and dedup tests |
| 5 | AI extraction | Not started | Adapter, evaluation, schema tests |
| 6 | Explainable scoring | Not started | Policy versions, reason codes, deterministic tests |
| 7 | Queue/detail UI | Not started | Responsive accessible browser flow |
| 8 | Review/lifecycle | Not started | Transition and audit tests |
| 9 | Assignment/team workflow | Not started | Ownership and authorization tests |
| 10 | Analytics/governance | Not started | Metric definitions and policy controls |
| 11 | Security/privacy/resilience | Not started | Threat review, restore, security checks |
| 12 | Staging/release | Not started | UAT, runbooks, deployment evidence |

## Current snapshot
- Product definition: proposed baseline; stakeholder validation required.
- Architecture: recommended baseline; key decisions pending.
- Application implementation: not assessed and not represented by this tracker.
- Production deployment: not established by this documentation.

## Update rules
1. Change status only with verifiable repository/CI evidence.
2. Link PR, commit, test run, screenshot, or decision.
3. Record blocker, owner, and unblock condition.
4. A successful build alone does not verify a phase.
5. New scope must be added through an issue or decision.

## Log
| Date | Change | Evidence |
|---|---|---|
| 2026-11-25 | Created greenfield documentation baseline | Initial planning set |
