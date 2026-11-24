# Product Requirements — SODIO Lead Triage

**Status:** Greenfield baseline · **Version:** 1.0

## Product summary
SODIO Lead Triage is a web workspace for capturing inbound enquiries, extracting structured information, qualifying and prioritizing leads, assigning ownership, and tracking follow-up. AI may propose fields and summarize context; deterministic rules calculate priority; authorized people review and decide.

## Problem
Incoming enquiries are inconsistent and often unstructured. Manual reading, data entry, prioritization, and routing can delay response, create inconsistent decisions, and obscure ownership and pipeline health.

## Goals
- Capture leads manually and through controlled batch ingestion.
- Preserve original source content while normalizing fields.
- Extract candidate fields with provenance, confidence, and warnings.
- Calculate transparent, versioned priority scores with reason codes.
- Support human review, corrections, assignments, activities, and lifecycle transitions.
- Make imports and processing observable and safely retryable.
- Provide operational analytics and strong data protection.

## Non-goals for MVP
Full CRM replacement, quoting/invoicing, autonomous rejection, automated outbound messaging, foundation-model training, unapproved enrichment/scraping, and complex billing.

## Users
- **Triage operator:** review new leads, correct fields, understand score reasons, and route work.
- **Sales representative:** manage assigned queue, contact context, and next actions.
- **Team lead:** monitor backlog, response delay, distribution, and outcomes.
- **Workspace administrator:** manage membership, permissions, sources, scoring policy, retention, and audit access.

## Core journey
Receive enquiry → validate → preserve source → normalize → extract structured candidates → score → human review → assign → record activity → transition lifecycle → measure outcomes.

## Functional requirements
| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Validated manual lead creation | P0 |
| FR-02 | CSV import with row-level feedback | P0 |
| FR-03 | Store raw source and normalized lead separately | P0 |
| FR-04 | Provider-neutral structured extraction | P0 |
| FR-05 | Strict runtime validation of AI output | P0 |
| FR-06 | Explainable deterministic scoring | P0 |
| FR-07 | Searchable, filterable, paginated queue and detail | P0 |
| FR-08 | Authorized corrections and assignment | P0 |
| FR-09 | Activity timeline and controlled status transitions | P0 |
| FR-10 | Observable ingestion and processing jobs | P0 |
| FR-11 | Workspace RBAC and audit history | P0 |
| FR-12 | Operational analytics | P1 |
| FR-13 | Versioned scoring policy management | P1 |
| FR-14 | Duplicate detection and supervised merge | P1 |
| FR-15 | External forms, webhooks, CRM connectors | P2 |

## Quality attributes
Correctness, explainability, reliability, least-privilege security, privacy, WCAG 2.2 AA accessibility target, responsive performance, and maintainability through modular boundaries and provider adapters.

## Success metrics
Measure time from ingestion to review, time to first human action, manual re-entry rate, extraction accuracy on a curated evaluation set, score reason comprehension, override rate, duplicate detection precision, import reliability, and qualified/converted outcomes by source and tier. Do not claim improvements before establishing baselines.

## Product principles
1. AI suggests; a person confirms uncertain or consequential fields.
2. Every priority score exposes factors, missing signals, and policy version.
3. Source context remains available subject to retention policy.
4. Failures are visible and recoverable.
5. Protected or sensitive traits and proxies are prohibited scoring features.
6. Corrections preserve provenance and actor/time.

## Assumptions to validate
Confirm customer segment, lead taxonomy, mandatory fields, workspace boundaries, SLA rules, scoring factors/weights, source formats, AI data processing terms, retention, and deployment constraints with stakeholders.

## MVP acceptance
A permitted user can create/import a lead, receive validation and row outcomes, inspect source and normalized data, understand priority reasons, correct allowed fields, assign ownership, record an activity, and execute allowed status transitions. Safe retries do not duplicate records. Cross-workspace access is denied and all material changes are auditable.
