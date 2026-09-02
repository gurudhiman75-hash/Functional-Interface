# Notes Studio — Gemini Search capability diagnostic

The Production Readiness screen exposes a manual **Test Gemini Search** action for administrators with `content.questions.update`.

The diagnostic exists only to establish whether the configured Gemini API project can execute Google Search grounding through the Interactions API.

## Probe

- model: `NOTES_STUDIO_SEARCH_MODEL` or `gemini-3.6-flash`
- endpoint: `POST /v1beta/interactions`
- `store: false`
- one fixed capability prompt requesting exactly one Google Search tool call
- no source is attached and no source pack is mutated

## Returned status

The UI reports a bounded capability result such as:

- Google Search available
- Billing required
- Model/tier unsupported
- Model unavailable
- Authentication failed
- Quota/rate limited
- Temporary API failure
- Search probe inconclusive

Provider response prose, source URLs, and raw search result bodies are discarded and are not returned to the admin client.

## Authority boundary

Running the diagnostic does not create or modify source documents, source attachments, evidence, claims, coverage, sections, approvals, localizations, materializations, learner resources, or production configuration.
