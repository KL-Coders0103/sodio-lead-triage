# Security Guidelines — SODIO Lead Triage

## Objectives and threat model
Protect lead/contact data, raw enquiries, uploaded files, sessions, credentials, audit records, and AI provider data. Threats include cross-workspace IDOR, role escalation, prompt injection, malicious CSV, account takeover, provider leakage, replayed imports, excessive exports, and insider misuse.

## Authentication
Use a maintained session/identity solution. Browser sessions use Secure, HttpOnly, SameSite cookies in production. Rotate session identifiers after login and privilege changes; revoke on logout/reset/disablement. Rate-limit sign-in and recovery. Prevent account enumeration. Never log credentials or tokens.

## Suggested workspace roles
- Workspace Owner: full workspace control, policy approval, privacy operations.
- Administrator: delegated membership and operational settings.
- Triage Manager: view workspace leads, assign, monitor analytics, propose scoring.
- Triage Operator: create/review permitted leads and limited updates.
- Sales Member: assigned/team-visible leads and permitted activities.
- Read-only Analyst: scoped/aggregated views, no mutation or raw export by default.

## Permission matrix (baseline)
| Capability | Owner | Admin | Manager | Operator | Sales | Analyst |
|---|---|---|---|---|---|---|
| View leads | All | All | Workspace | Scoped | Assigned/team | Aggregated/scoped |
| Create/import | Yes | Yes | Yes | Yes | Optional | No |
| Edit fields | Yes | Yes | Yes | Scoped | Limited | No |
| Review extraction | Yes | Yes | Yes | Yes | Limited | No |
| Assign/reassign | Yes | Yes | Yes | Policy | No | No |
| Transition status | Yes | Yes | Yes | Yes | Scoped | No |
| Configure scoring | Yes | Delegated | Propose | No | No | No |
| Activate policy | Yes | Optional | Approval | No | No | No |
| Manage members | Yes | Delegated | No | No | No | No |
| Export PII | Restricted | Restricted | Restricted | No | No | No |
| Audit access | Yes | Yes | Scoped | Own actions | No | No |

All permissions are enforced on the server for every request. Derive workspace scope from authenticated membership. Never trust client-provided role, owner, or workspace identifiers. Ensure related entities share the same workspace and prevent removal/demotion of the last owner.

## AI-specific controls
Treat lead text as untrusted data, not instructions. Do not execute model-suggested actions. Send minimum necessary data to approved provider; review provider retention/training terms. Validate outputs and field allowlists. Store bounded provider/model/prompt metadata. Never include secrets or unrelated lead records. Protected traits and sensitive proxies are prohibited scoring inputs.

## Upload safety
Allowlist actual file formats; enforce size, row, column, and time limits; use private random object keys; quarantine/scan where supported; parse safely; reject path traversal and malformed encodings; escape UI output; neutralize CSV formula injection in exports.

## Application/API
Runtime-validate all inputs. Use parameterized queries, narrow CORS, CSRF controls for cookie-authenticated state mutations, secure headers/CSP, rate limits, timeouts, bounded pagination, and generic out-of-scope errors.

## Privacy
TLS in transit and managed encryption at rest. Restrict raw payloads/exports. Redact PII from logs and traces. Define retention/deletion, legal-hold, export/access workflows, and backup expiry. Do not use customer data in local/CI fixtures.

## Audit and incident response
Audit data edits, imports, exports, assignments, role changes, scoring policy changes, deletion, and privileged access. Keep audit access restricted and append-only for ordinary users. Maintain containment, credential rotation, escalation, and notification runbooks.

## Release checklist
- [ ] Workspace isolation and role matrix tests pass.
- [ ] No secrets/PII in logs, client bundles, or fixtures.
- [ ] Upload/parser/export threat tests complete.
- [ ] Dependency and static analysis reviewed.
- [ ] Backup restore and deletion behavior verified.
- [ ] AI provider data flow reviewed.
- [ ] Rate limits, alerts, and audit enabled.
