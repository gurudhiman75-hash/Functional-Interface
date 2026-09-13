# CAE-001 — Source and Ownership Audit

## Discovery references

The initial Cause & Effect design brief identified the following as discovery references for conventional paired-statement formats and probable-cause/effect variants:

- [Testbook — Cause and Effect Reasoning](https://testbook.com/reasoning/cause-and-effect-reasoning)
- [Oliveboard — Cause and Effect](https://www.oliveboard.in/blog/cause-and-effect-reasoning/)
- [Testbook — Cause and Effect MCQs](https://testbook.com/objective-questions/mcq-on-cause-and-effect--5eea6a1539140f30f369f43e/amp)

These links establish discovery direction only. They are not copied into the runtime, and they do not alone authorise public release.

The dated source census and human review are recorded in:

- `CAE-001-SOURCE-PATTERN-CENSUS-2026-09-13.md`
- `CAE-001-HUMAN-EDITORIAL-AUDIT-2026-09-13.md`

## Implemented source-profile layer

Wave 1 keeps the canonical causal-world engine frozen and adds source-auditable renderers above it.

Implemented source profiles:

- `CLASSIC_BANK_FIVE_RELATION`
  - Statement I causes Statement II
  - Statement II causes Statement I
  - both statements are independent causes
  - both statements are effects of independent causes
  - both statements are effects of a common cause
- `PUNJAB_POLICE_SI_2016_FOUR_RELATION`
  - Statement I causes Statement II
  - Statement II causes Statement I
  - both statements are effects of independent causes
  - both statements are effects of a common cause
- `SSC_SELECTION_POST_DIRECT_RECOGNITION`
  - choose the option that actually expresses a valid direct cause-effect relationship

These authorities live in `source-profiles.ts`. They are a presentation/source layer: they do not modify canonical worlds or `causalStateId` construction.

`question-studio-review.ts` exposes the available profile IDs and accepts an optional `sourceProfileId`. Question-bank, test, mock and public-delivery gates remain locked.

`source-profile-review-pack.ts` deterministically builds ten distinct causal-state samples for each implemented source profile and deliberately exposes every supported paired-statement relationship before filling its ten-item review quota.

## Editorial sampling correction

`editorial-review-pack.ts` now selects ordinary human-review questions by unique `causalStateId`, not by `itemVariantId`. Option order or distractor presentation can no longer consume another one of the ten CP review slots while unused semantic states remain.

## Chapter boundaries

| Learner task | Owner |
| --- | --- |
| Whether a conclusion follows from stated premises | `STC-001` |
| Whether an unstated premise is necessary | `STA-001` |
| Strength or relevance of an argument | `REAS-ARG` |
| Suitability of a response to a problem | `REAS-COA` |
| Truth/explanation relation between an assertion and reason | `REAS-ASM` |
| Causal direction, common cause, causal distance, correlation, and causal-chain completion | `CAE-001` |

## Current architecture boundary

The CAE V3 graph-first architecture is approved and frozen. The following are accepted foundations:

- canonical causal worlds before rendering;
- `causalStateId` separated from item/presentation identity;
- target/reference/relation-specific candidate applicability;
- CP-005 credible-competitor gate;
- CP-009 visible-endpoint exclusion and unique-bridge QA;
- shared EN/HI/PA semantic state;
- Question Studio review-only/persistence lock.

Remaining work is renderer/profile fidelity, scenario/editorial depth, human difficulty calibration, source coverage and saturation. These are not reasons to redesign the canonical graph model.

## Current review boundary

The graph validates causal structure, unique answers, temporal order and locale parity. The source-profile layer now also makes supported exam schemas explicit instead of inferring them from option count alone.

Neither layer can by itself establish that every real-world claim is factually perfect, that every natural-language rendering is idiomatic enough for a final exam corpus, or that a generated HARD label matches human difficulty.

CAE-001 therefore remains deterministic Question Studio review content only.

## Remaining pre-freeze work

1. Regenerate/materialize the ordinary 90-question Markdown after the semantic-state sampling correction.
2. Human-review the 30-question source-profile pack.
3. Rebuild CP-007 around genuine false-causation/correlation traps rather than obviously unrelated pairs.
4. Recalibrate CP-005 HARD questions so at least two alternatives are genuinely competitive to a learner.
5. Expand CP-008/009 learner-operation breadth without labelling novel Examtree forms as high-frequency sourced paper formats.
6. Finish dated source discovery and scenario saturation before CP-010 release freeze.
