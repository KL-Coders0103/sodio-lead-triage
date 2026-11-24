# UI / UX Guidelines — SODIO Lead Triage

## Principle
Help the operator understand the enquiry, confidence, priority, owner, and next action without hiding original context.

## Navigation
Primary: Overview, Leads, My Queue, Imports, Analytics. Group Settings separately and permission-gate administrative destinations. Keep workspace identity visible.

## Queue
Default to a useful "Needs attention" view. Each row shows contact/organization, concise enquiry summary, labeled priority, status, owner, source, and received age. SLA indicator appears only when a policy exists. Filters must be visible, removable, resettable, URL-persisted, and allowlisted. Avoid icon-only actions without accessible names.

## Lead detail
1. Header: identity, status, priority, owner, next action.
2. Original enquiry and source metadata.
3. Qualification: extracted suggestions beside human-confirmed fields.
4. Score explanation and factor contributions.
5. Activity timeline: notes, contact attempts, assignment and status events.

Never replace the original enquiry with an AI summary.

## Review interactions
Distinguish suggested from confirmed values. Explain missing/low-confidence fields. Offer accept, edit, or mark-unknown. Confirm irreversible actions. Preserve prior values and actor/time. Never label an AI suggestion as verified fact.

## Import wizard
Show byte/row/file constraints before upload. Preview mappings and rows. Separate accepted, invalid, and duplicate-suspected outcomes. Require explicit confirmation. Show completion only after server acknowledgment. Restrict rejected-row exports.

## Lifecycle language
Use consistent actions: Review, Assign, Contacted, Qualify, Disqualify, Convert, Archive. Explain required reasons before submit. Avoid vague "Done" actions.

## Feedback states
Every asynchronous flow needs meaningful progress, acknowledged success, recoverable error/retry, stale-data conflict handling, empty state, and partial batch state.

## Analytics
Each metric must define numerator, denominator, timezone, time window, and exclusions. Link counts to source records. Distinguish median from average. Show insufficient data instead of a misleading zero.

## Responsive and accessible behavior
Desktop persistent nav and multi-column detail; tablet collapsible nav; mobile stacked queue/detail. Target WCAG 2.2 AA, keyboard navigation, focus visibility, semantic tables, live announcements, reduced motion, and contrast. Priority must never be communicated by color alone.

## Avoid
Opaque scores, autonomous rejection, fake live indicators, unlimited exports, destructive bulk actions without preview, edit-destroying refresh, and critical explanations hidden only in tooltips.
