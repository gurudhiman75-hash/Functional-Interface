# RNK-CP-006 Hindi/Punjabi Localization Review Candidate V1

## Scope

This candidate localizes the frozen `RNK-CP-006 — Equality-aware Ranking` runtime without changing its English mathematical authority.

Permanent authorities remain:

- `RNK-QL-039` — `EQUALITY_AWARE_PAIR_RELATION`
- `RNK-QL-040` — `EQUALITY_AWARE_ENDPOINT`
- `RNK-QL-041` — `COMPLETE_WEAK_ORDER`

The frozen English runtime contains 576 questions: 192 per authority.

## Localization architecture

Hindi and Punjabi learner text is rebuilt from the frozen structured CP006 state rather than translated from arbitrary English prose. The localization preserves:

- permanent QL and authority identity;
- source form, mode, seed, context and difficulty;
- ordered groups and explicit equality pair;
- equality bridge and strict comparison edges;
- mathematical state key;
- option order and correct index;
- permanent runtime fingerprint and profile;
- all downstream lifecycle locks.

Only learner-facing clues, stem, options/answer and explanations are localized.

The localized explanation explicitly keeps the equality pair at one comparison level, uses it to bridge the strict chain, reconstructs the complete order when required, and then answers the exact query.

## Validation target

The dedicated V1 gate proves all 576 Hindi and 576 Punjabi records, deterministic replay, structured-state invariance, option/key parity, script purity, canonical-name exclusion, per-QL and per-mode coverage, localization fingerprint uniqueness, the pinned CP006 English projection, chapter-wide English closure, Ranking Object Pool V2 and the API production build.

A 48-question learner-review artifact is retained: 24 Hindi + 24 Punjabi, spanning all three authorities and all five CP006 modes.

## Lifecycle

This is a review candidate only.

- English: frozen / unchanged
- Hindi/Punjabi: review candidate
- formal human-language approval: required
- multilingual freeze: false
- Question Studio: disabled
- persistence: disabled
- Question Bank: `NOT_STORED`
- test eligibility: `INELIGIBLE`
- public publication: false
- product delivery unlocked: false

No merge, deployment, publication, persistence activation, Question Studio activation or multilingual freeze is granted by this candidate.
