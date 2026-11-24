# SODIO Lead Triage

An explainable, AI-assisted workspace for capturing, qualifying, prioritizing, assigning, and tracking inbound leads.

> **Project state:** Greenfield planning baseline. These documents describe intended behavior and proposed architecture; they do not claim the features or infrastructure are already implemented.

## Product direction
SODIO converts inconsistent inbound enquiries into reviewable lead records. AI extracts candidate information; transparent deterministic rules recommend priority; authorized people review, correct, assign, and choose next actions.

## Planned capabilities
- Manual capture and CSV batch ingestion.
- Source preservation and structured extraction.
- Explainable, versioned deterministic lead scoring.
- Review queue and detailed lead timeline.
- Assignment, notes, contact attempts, and lifecycle management.
- Operational analytics and scoring governance.
- Workspace isolation, RBAC, audit, and privacy controls.

## Documentation index

| File | Purpose |
|---|---|
| [Product Requirements](./docs/PRODUCT_REQUIREMENTS.md) | Problem, users, requirements, metrics |
| [Project Requirements](./docs/PROJECT_REQUIREMENTS.md) | Scope, engineering constraints, quality gates |
| [Master Feature Implementation](./docs/MASTER_FEATURE_IMPLEMENTATION.md) | Phase-by-phase implementation plan |
| [Implementation Tracker](./docs/IMPLEMENTATION_TRACKER.md) | Status and verification evidence |
| [Architecture](./docs/ARCHITECTURE.md) | Components, data flow, reliability boundaries |
| [Database Schema](./docs/DATABASE_SCHEMA.md) | Proposed entities, relations, integrity, retention |
| [API Specification](./docs/API_SPECIFICATION.md) | API routes, contracts, errors, concurrency |
| [Frontend Architecture](./docs/FRONTEND_ARCHITECTURE.md) | Routes, screens, components, state, accessibility |
| [Design System](./docs/DESIGN_SYSTEM.md) | Brand palette, tokens, typography, states |
| [UI/UX Guidelines](./docs/UI_UX_GUIDELINES.md) | Queue, review, import, analytics experience |
| [Security Guidelines](./docs/SECURITY_GUIDELINES.md) | Threat model, roles, AI/file safety, privacy |
| [Testing Strategy](./docs/TESTING_STRATEGY.md) | Test layers, AI evaluation, quality gates |
| [Development Guide](./docs/DEVELOPMENT_GUIDE.md) | Local setup and engineering workflow |
| [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) | Environments, CI/CD, recovery, release |
| [Decisions](./docs/DECISIONS.md) | Accepted/proposed ADRs |

## Delivery order
Follow Phase 0–12 in [Master Feature Implementation](./docs/MASTER_FEATURE_IMPLEMENTATION.md). Update [Implementation Tracker](./docs/IMPLEMENTATION_TRACKER.md) only when verifiable evidence exists.

## Design direction
MVP light operations-console theme:
- Ink: `#17212B`
- Teal: `#087E80`
- Indigo AI accent: `#5365D8`
- Canvas: `#F4F7F6`
- Surface: `#FFFFFF`
- Hot/Warm/Cold use semantic red/amber/blue with visible text labels.

See [Design System](./docs/DESIGN_SYSTEM.md).

## Product safeguards
- AI output is a suggestion, never automatically verified fact.
- Priority is deterministic, explainable, and versioned.
- Autonomous rejection and outbound messaging are not MVP features.
- Authorization and workspace isolation are enforced server-side.
- Use synthetic data in development and CI.
- Confirm provider data terms, retention, scoring policy, and hosting before production.

## Status
All implementation phases begin as **Not started**. The proposed technology choices and external providers must be validated and recorded before their implementation phase.

## License
No license is declared by this documentation baseline. Add one after the repository owner chooses a license.
