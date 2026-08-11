# AI-LOG

**Tools Used:** Gemini 1.5 Pro (as Lead Architect), Cursor/Copilot for inline completion.

## Concrete AI Failures & Corrections

1.  **Issue:** Hallucinating Service Lines.
    *   *Notice:* The Groq Llama 3.1 model initially extracted a service line as "Artificial Intelligence" instead of the strictly required enum "ai".
    *   *Action:* I instituted strict Zod validation (`ServiceLineEnum`) at the API boundary. Furthermore, I explicitly listed the exact enum values in the system prompt (`"ai" | "blockchain" | "web" | "mobile" | "game" | "other"`).

2.  **Issue:** Overwriting Human Data (Re-Extraction Bug).
    *   *Notice:* During early iterations of Requirement 5, a naive database update simply overwrote the entire row with the new LLM payload, destroying inline edits.
    *   *Action:* Shifted the database schema to PostgreSQL `JSONB` to store state (`extracted`, `value`, `isOverridden`). Built a custom `mergeField` function in the API controller to act as a gatekeeper between the LLM output and the active database row.