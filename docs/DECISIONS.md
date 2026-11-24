# Architecture and Product Decisions — SODIO Lead Triage

Proposals remain provisional until accepted by an accountable owner.

## ADR-001 — Greenfield documentation baseline
**Status:** Accepted · **Date:** 2026-11-25  
**Context:** Project is restarted from scratch; prior implementation is not a source of requirements.  
**Decision:** Define a new coherent product, architecture, API, data, security, design, testing, and delivery baseline.  
**Consequences:** No existing code/schema is assumed valid; implementation begins after review.

## ADR-002 — Modular monolith for MVP
**Status:** Proposed  
**Context:** Scope has cohesive workflows but no proven need for independent service scaling.  
**Decision:** Start with a modular monolith and separate worker process where useful.  
**Consequences:** Lower operational complexity; revisit only with measured need.

## ADR-003 — Relational persistence
**Status:** Proposed  
**Context:** Membership, leads, assignments, activities, imports, and audit need referential integrity and transactions.  
**Decision:** PostgreSQL with Prisma is recommended pending compatibility and hosting validation.  
**Consequences:** Requires migration discipline and query-plan review.

## ADR-004 — Human-reviewed extraction
**Status:** Proposed  
**Context:** Enquiry text may be ambiguous, incomplete, or adversarial.  
**Decision:** AI proposes structured values; schema validation and human review govern confirmation.  
**Consequences:** Transparent but requires provider evaluation and cost controls.

## ADR-005 — Deterministic explainable scoring
**Status:** Proposed  
**Context:** Generative output is unsuitable as an opaque priority authority.  
**Decision:** Versioned deterministic rules with visible factor contributions and reason codes.  
**Consequences:** Business owners must approve factors and weights.

## ADR-006 — Light operations-console visual system
**Status:** Proposed  
**Context:** Users need readable, data-dense triage workflows.  
**Decision:** Warm light canvas, ink text, teal brand action, indigo AI accent, semantic priority colors.  
**Palette:** `#17212B`, `#087E80`, `#5365D8`, `#F4F7F6`, `#FFFFFF`.  
**Consequences:** Verify contrast; MVP is light theme.

## ADR template
### ADR-XXX — Title
- Status: Proposed / Accepted / Superseded
- Date and owner
- Context and constraints
- Options considered
- Decision
- Consequences
- Revisit trigger
