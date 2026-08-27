# NUM-CP-013 Question Studio Integration

## Scope

Checkpoint: `NUM-CP-013 — Positional Bases and Numeral Conversion`

Permanent QLs: `NUM-QL-237..NUM-QL-247`

Languages: English, Hindi and Punjabi.

## Routing contract

CP013 claims only explicit selectors:

- `canonicalProblemId` / `cpId = NUM-CP-013`;
- a pattern containing `NUM-CP-013`;
- `questionLanguageId` in `NUM-QL-237..NUM-QL-247`.

A package-only `NUM-002` request is deliberately **not** claimed by CP013. It continues through the pre-existing shared Number System fallback.

The additive shared facade delegates every non-CP013 request to the earlier shared engine unchanged. This prevents CP013 from stealing CP008–CP012 or other Question Studio packages.

The dedicated CP013 admin router is mounted before the legacy Number System Question Studio router. The route regression test checks the exact `router.use(...)` mount positions rather than import order, preventing a false-positive routing audit.

## Aggregate NUM-002 capability

With CP013 added, the Question Studio capability surface becomes:

- CP008: QL166..184 — 19
- CP009: QL185..196 — 12
- CP010: QL197..212 — 16
- CP011: QL213..225 — 13
- CP012: QL226..236 — 11
- CP013: QL237..247 — 11

Total: **82 permanent QLs**, `NUM-QL-166..NUM-QL-247`.

Aggregate release ID:

`NUM-002-QS-CP008-CP013-MULTILINGUAL-FROZEN-V1`

Next free Number System QL: `NUM-QL-248`.

## Review payload

Each CP013 Studio question carries:

- permanent QL and authority identity;
- permanent generation seed;
- resolved source-generator seed;
- actual source task kind and representation;
- retained discovery prototype;
- hidden mathematical state;
- mathematical fingerprint;
- source and prototype ancestry;
- language/locale;
- misconception metadata for each option;
- canonical and verifier answers;
- question-specific human explanation.

The permanent seed and source seed are deliberately distinct fields. After the merged-authority reachability repair, a permanent seed chooses the retained source prototype while a decoupled source seed drives that prototype's internal state. Studio traceability therefore exposes:

- `permanentSeed`: the permanent authority replay seed;
- `sourceSeed`: the resolved source-generator seed;
- `resolvedSourceSeed`: identical to `sourceSeed` for explicit traceability.

It no longer labels the permanent seed as if it were the source seed.

The explanation standard is `QUESTION_SPECIFIC_HUMAN_V1`: concept, direct strategy, two-to-four concrete steps and final answer. It is generated from the frozen question state rather than from a generic solution template.

Final-answer labels are locale-native:

- English: `Answer:`
- Hindi: `उत्तर:`
- Punjabi: `ਉੱਤਰ:`

The Studio test explicitly rejects English `Answer:` leakage in Hindi/Punjabi final lines.

## Reachability carried into Studio

Question Studio consumes the repaired permanent/localized authority packages, so the restored internal states are available to review generation. In particular:

- QL237/P011 can expose place value, number-of-digits, largest n-digit and smallest n-digit forms;
- QL241/P021 can expose no-solution, one-solution and multiple-solution unknown-base topology;
- P009 grouping and P012 bounded-valid-base mode families remain fully reachable.

The Studio breadth audit remains a broad review-surface check; exact internal-mode guarantees are enforced in permanent and localization audits and again in cumulative landing.

## Admin route

`admin-question-studio-cp013.ts` is mounted immediately before the legacy Question Studio Number System route.

- GET `/capabilities` exposes the additive 82-QL NUM-002 capability.
- POST `/runs` handles only explicit CP013 requests.
- non-CP013 requests call `next()` and remain owned by the existing router.
- generated CP013 items are persisted in the existing generation-run review tables with the same audit/outbox workflow.

## Lifecycle

Question Studio review is the only downstream surface opened by this integration.

- Question Studio discoverable: ON in Studio payloads
- Question Bank stored/writable: OFF
- test eligible: OFF
- mock-test eligible: OFF
- public publication: OFF
- automatic student publication: OFF

The underlying frozen permanent/localized source packages themselves remain non-discoverable and non-publishable; Studio creates a guarded review projection only.
