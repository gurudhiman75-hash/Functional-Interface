# PRB-001 ML-03 Native Editorial Review Checkpoint

## Scope

This checkpoint adds draft Hindi and Punjabi editorial content for all 120 PRB-001 QLs without enabling native Question Studio delivery.

## Inventory

- English source QLs: 120
- Hindi draft entries: 120
- Punjabi draft entries: 120
- Native draft entries: 240
- Curated wording families: 37

## Editorial model

Each QL receives a language-specific entry preserving its English QL ID, source stem ID, context family and exact placeholder contract. The native layer supplies a student-facing stem, native event wording, an approach line, a working lead and a key point.

The 37 curated families cover:

- direct and reverse classical probability;
- certain/impossible/possible events;
- frequency questions;
- complements and coin counts;
- exact coin patterns;
- single-die and two-dice questions;
- spinner and number-selection questions;
- card rank, suit, colour, face, union, complement, intersection and reverse-count questions;
- urn direct, same-colour, both-colour, exact-composition, none, at-least-one, reverse-count and combination questions.

## Binding safety

Native stems retain the English mathematical placeholder contract. A closed binding localizer covers all currently generated PRB-001 string values, including object/context nouns, event labels, colours, H/T patterns, die/number properties, dice event types, ranks and suits.

Unknown string bindings throw. Numeric, fraction and probability displays remain unchanged.

## Release boundary

All 240 entries are `DRAFT_NATIVE_EDITORIAL_REQUIRES_HUMAN_REVIEW`.

- Hindi Question Studio exposure: disabled
- Punjabi Question Studio exposure: disabled
- public publication: disabled
- manifest status: `PENDING_NATIVE_EDITORIAL`
- English mathematical/runtime authority: unchanged

`PRB-QL-004` and `PRB-QL-010` remain learning-only.

## Validation evidence

Workflow `31372735056` passed ML-01, ML-02, ML-03 and the existing English Probability readiness suites. The ML-03 test proves 120/120 coverage in each language, exact stem-placeholder parity, native script compliance, closed binding behaviour, and zero native release exposure.

## Next gate

ML-04 will build the 96-Ql PRB-002 Hindi/Punjabi draft editorial layer. Native runtime routing remains deferred to ML-05 and human approval remains deferred to ML-06.
