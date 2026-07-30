# MAL-CP-001 English SVG Presentation Revision

## Revision identity

- Release: `MAL-CP001-EN-v1`
- Presentation revision: `MAL-CP001-EN-SVG-v2`
- Release layout: `MAL-CP001-EN-FORMULA-ALLIGATION-SVG-V2`
- Visual contract: `MAL-CP001-ALLIGATION-SVG-V1`

## Learner-facing method contract

1. **Method 1 — Normal Formula Method** uses weighted-average, total-value and ordinary algebra calculations only.
2. **Method 2 — Alligation Method** uses a lightweight inline SVG for the visual shortcut.
3. Two-item questions render a genuine X-shaped alligation cross.
4. Final-mean questions use range partitioning rather than repeating Method 1 algebra.
5. Three-or-more-component questions render deviation balance instead of an invalid two-item cross.
6. Two-stage questions render a separate SVG cross for each stage.

## Runtime architecture

Questions store a compact structured visual payload, not raw SVG markup. The release explanation emits a versioned directive:

`[[EXAMTREE_ALLIGATION_SVG_V1:<base64url-json>]]`

`QuestionRichText` validates the payload and renders the reusable `AlligationDiagram` React component. The SVG uses a responsive `viewBox`, `currentColor`-compatible styling, accessible `title` and `desc` nodes, and no external images, fonts, scripts or `foreignObject` content.

## Scope

This revision changes learner wording and presentation only. Exact solutions, options, correct indices, mathematical fingerprints and reasoning graphs remain under the existing frozen MAL-CP-001 release authority.
