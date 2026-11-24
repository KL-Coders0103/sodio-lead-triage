# Database Schema — SODIO Lead Triage

Conceptual relational model only. It is a proposed contract, not a claim about an existing schema. Approve tenant, identity, and retention decisions before turning this into ORM models.

## Principles
Use stable UUID identifiers, UTC timestamps, foreign keys, explicit indexes, workspace ownership, reviewed migrations, and minimal data collection. Separate source, machine extraction, and human-confirmed values.

## Entities
### Workspace
`id, name, slug, status, settingsJson, createdAt, updatedAt`

### User
`id, emailNormalized, displayName, authProvider, status, createdAt, updatedAt`. Credential storage depends on the selected auth design; plaintext passwords are prohibited.

### WorkspaceMembership
`id, workspaceId, userId, role, status, joinedAt`. Unique `(workspaceId,userId)`.

### Lead
`id, workspaceId, sourceId, externalReference, fullName, emailNormalized, phoneNormalized, companyName, messageSummary, intentCategory, productInterest, locationText, budgetAmount, budgetCurrency, timeline, status, priorityTier, currentScoreId, assignedUserId, createdAt, updatedAt, version, deletedAt`.
Indexes should support workspace/status/createdAt, workspace/assignee/status, and approved normalized identifiers.

### LeadSource
`id, workspaceId, name, type, configurationJson, isActive, createdAt`. Store secret references, not credentials, in configuration.

### LeadSourceRecord
`id, workspaceId, leadId, sourceId, externalId, restrictedRawPayload, rawText, receivedAt, payloadHash, retentionExpiresAt`. Add source/external ID idempotency constraint where available.

### ExtractionRun
`id, workspaceId, leadId, provider, model, promptVersion, schemaVersion, status, candidateFieldsJson, fieldConfidenceJson, warningsJson, errorCode, startedAt, completedAt`.

### LeadScore
`id, workspaceId, leadId, algorithmVersion, score, tier, factorsJson, reasonCodesJson, missingSignalsJson, createdAt, createdByType`. Immutable after creation.

### LeadActivity
`id, workspaceId, leadId, actorUserId, type, body, metadataJson, createdAt`.

### LeadAssignment
`id, workspaceId, leadId, assignedUserId, assignedByUserId, reason, createdAt, endedAt`. Preserve reassignment history.

### ImportBatch / ImportRow
Batch: `id, workspaceId, uploadedByUserId, fileObjectKey, originalFileName, contentHash, status, totalRows, acceptedRows, rejectedRows, createdAt, finishedAt`.  
Row: `id, workspaceId, batchId, rowNumber, status, normalizedPayloadJson, leadId, errorCode, errorDetailsJson`. Unique `(batchId,rowNumber)`.

### AuditEvent
`id, workspaceId, actorUserId, action, resourceType, resourceId, requestId, restrictedNetworkMetadata, beforeJson, afterJson, createdAt`. Restrict access and retention.

### ScoringPolicyVersion
`id, workspaceId, version, status, weightsJson, createdByUserId, approvedByUserId, activatedAt, createdAt`. Enforce one active policy per workspace.

## Relationships
Workspace owns memberships, leads, sources, imports, policies, and audit events. Lead owns source records, extraction runs, score history, activities, and assignments. A user belongs to workspaces through membership. Cross-workspace child references are invalid.

## Proposed enums
Workspace: ACTIVE/SUSPENDED/ARCHIVED. Membership: INVITED/ACTIVE/DISABLED. Lead: NEW/NEEDS_REVIEW/QUALIFIED/CONTACTED/IN_PROGRESS/CONVERTED/DISQUALIFIED/ARCHIVED. Priority: HOT/WARM/COLD/UNSCORED. Job: QUEUED/PROCESSING/COMPLETED/PARTIAL/FAILED/CANCELLED.

## Integrity and privacy
Current assignee must have active workspace membership. Scores reference known policy versions and obey range constraints. Lifecycle transitions are domain-enforced. Duplicate matches are advisory until confirmed. Use optimistic version checks. Define retention, legal hold, deletion, export, and backup behavior per data category.
