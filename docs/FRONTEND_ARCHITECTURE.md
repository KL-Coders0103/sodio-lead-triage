# Frontend Architecture — SODIO Lead Triage

## Experience goals
An operations workspace that helps users understand what arrived, why it matters, what is uncertain, who owns it, and the next action. Prioritize scanability, keyboard use, and explainability.

## Proposed structure
```
src/
  app/                    # routes/layouts/loading/error boundaries
  components/ui/          # accessible primitives
  components/layout/      # shell/navigation/responsive header
  components/leads/       # queue, filters, detail, score explanation
  components/imports/     # upload/mapping/row report
  components/analytics/   # metrics and charts
  features/               # auth, workspace, leads, ingestion, review, etc.
  lib/                    # API client, schemas, formatting, permissions
  hooks/
  types/
```

## Route map
`/sign-in`, `/app/overview`, `/app/leads`, `/app/leads/:id`, `/app/imports`, `/app/imports/:id`, `/app/my-queue`, `/app/analytics`, `/app/settings/members`, `/app/settings/scoring`, `/app/settings/privacy`.

## Screens
- **Overview:** new, review-needed, hot, unassigned, overdue; queue age and trend; metrics link to filtered records.
- **Lead queue:** search, filters, sort, priority reason preview, owner, age, source, status.
- **Lead detail:** original enquiry, normalized contact fields, extraction candidates/confidence, score factors, owner, timeline, next action.
- **Import wizard:** upload, map, preview, confirm, monitor, inspect rejected rows.
- **Scoring settings:** version, weights, preview, validation, approval, history.

## State management
Prefer server-rendered data and URL-backed filters. Client state is for transient form drafts and interactive panels. Keep cache invalidation explicit; do not make a global client store authoritative for lead data.

## Component contracts
LeadPriorityBadge, ScoreBreakdown, ConfidenceIndicator, SourcePayloadPanel, LeadStatusControl, AssignmentControl, ActivityTimeline, ImportProgress, RowErrorTable, FilterToolbar, EmptyState, ConfirmActionDialog. Components render policy outputs; they do not implement authorization.

## Error handling
Validate response shapes at boundaries. Show field errors, stale-edit conflict resolution, processing/failed/partial/completed states, and never discard unsaved notes silently.

## Accessibility/responsiveness
Semantic labels/headings/tables, keyboard support, visible focus, dialog focus restoration, live progress announcements, reduced motion, no color-only status. Desktop table; mobile stacked cards and detail sections.

## Performance and tests
Paginate, debounce search, lazy-load secondary panels, and avoid large unbounded histories. Test components, forms, permission states, all key browser journeys, mobile viewports, keyboard flow, and network failures.
