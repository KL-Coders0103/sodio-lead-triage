# Sodio Lead Triage

An AI-powered internal tool to ingest, extract, score, and manage unstructured project enquiries.

## Run It
Assuming Node.js and PostgreSQL are installed:
1. `npm install`
2. Configure `.env` with `DATABASE_URL`, `GROQ_API_KEY`, and `GROQ_MODEL`.
3. `npx prisma generate`
4. `npx prisma migrate dev`
5. `npm run dev`
6. Open `http://localhost:3000`

## What Works / What Doesn't
*   **Works:** Single ingestion, batch SSE streaming (non-blocking concurrency), programmatic priority scoring, side-by-side UI, and non-destructive re-extraction.
*   **Doesn't / Known Limitations:** 
    *   There is no pagination on the main list view. If the database grows to 10,000+ leads, the initial render will lag.
    *   The "Duplicate Detection" is currently an implicit manual process via UI sorting/searching, not an automated DB constraint.

## Decisions (The Undecided List)
1.  **Duplicate Enquiries:** We allow them to ingest natively. I decided against hard-blocking duplicates at the DB level because a client might submit a follow-up with *different* requirements. The human triage agent can sort by email/name and drop the duplicate manually.
2.  **Budgets (Lakhs, Euros, ranges):** The LLM extracts the exact phrase into `budgetRawText` (e.g., "50 Lakhs") but computes a conservative lower-bound USD equivalent into `budgetNormalizedUSD`. If someone says "$10k - $20k", it parses as `10000`. "Flexible" defaults to `0`.
3.  **Prompt Injection / Model Targeting:** Encapsulated raw text in `<untrusted_lead_text>` XML tags. The system prompt instructs the model to flag `isGenuine: false` if it detects override attempts. The non-LLM scoring engine automatically drops `isGenuine: false` to `low` priority.
4.  **Timeline ("ASAP" vs "Q1"):** Stored as a raw string. The model does not attempt to cast this to a strict Date object, as business timelines are inherently fluid and context-heavy.
5.  **Multi-Project Enquiries:** Extracted into a single record. `serviceLine` defaults to the primary identifiable project, and the `summary` captures the dual nature of the request.

## Re-Extraction (Requirement 5)
We handled re-extraction using a `ManagedField` JSON structure in PostgreSQL (`{ extracted, value, isOverridden }`). 
When a user manually edits a field on the UI, `isOverridden` becomes `true`. When re-extraction is triggered, the API runs the LLM again, but our `mergeField` helper discards the new AI value for any field where `isOverridden` is true, ensuring human edits are never silently destroyed.

## Scoring Rule
Priority is calculated entirely in code, decoupled from the LLM:
*   **HIGH:** `budgetNormalizedUSD` >= $20k OR (`budget` >= $10k AND `serviceLine` is AI/Blockchain/Web).
*   **MEDIUM:** `budgetNormalizedUSD` >= $5k OR (`budget` > 0 AND `serviceLine` is not "other").
*   **LOW:** Fails `isGenuine` check (spam/injection) OR budget falls below thresholds.
*   *Reasoning:* We want sales reps focusing on high-value contracts in core competencies. Spam is instantly deprioritized.

## Two More Days
1.  **Automated Deduplication:** Implement a vector similarity search (PGVector) to auto-group similar enquiries from the same contact email.
2.  **Pagination & Caching:** Implement cursor-based pagination and React Query to handle large datasets cleanly.