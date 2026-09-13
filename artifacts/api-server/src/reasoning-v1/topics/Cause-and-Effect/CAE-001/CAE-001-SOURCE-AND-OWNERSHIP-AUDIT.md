# CAE-001 — Source and Ownership Audit

## Discovery references

The initial Cause & Effect design brief identified the following as discovery references for conventional paired-statement formats and probable-cause/effect variants:

- [Testbook — Cause and Effect Reasoning](https://testbook.com/reasoning/cause-and-effect-reasoning)
- [Oliveboard — Cause and Effect](https://www.oliveboard.in/blog/cause-and-effect-reasoning/)
- [Testbook — Cause and Effect MCQs](https://testbook.com/objective-questions/mcq-on-cause-and-effect--5eea6a1539140f30f369f43e/amp)

These links establish discovery direction only. They are not copied into the runtime, and they do not alone authorise public release.

The dated source census and human review are now recorded in:

- `CAE-001-SOURCE-PATTERN-CENSUS-2026-09-13.md`
- `CAE-001-HUMAN-EDITORIAL-AUDIT-2026-09-13.md`

The source census confirms that paired-statement option count alone is not a sufficient exam-profile definition: different four-/five-option sources expose different relationship sets. It also records a recent SSC-labelled direct-recognition MCQ that is not represented by the current paired-statement renderer and should be added under CP-001 without changing the graph-first architecture.

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

The graph validates causal structure, unique answers, temporal order and locale parity. It cannot by itself establish that a real-world claim is factually true, that a natural-language rendering is idiomatic enough for a final exam corpus, or that a generated HARD label matches human difficulty.

The 2026-09-13 human audit also found that the current 10-per-CP review selector can repeat a `causalStateId` with only presentation changes because it de-duplicates on `itemVariantId`. That sampling defect must be corrected before the next editorial pack is treated as representative.

CAE-001 therefore remains deterministic Question Studio review content only. Before production freeze it still needs the implementation actions and freeze gates listed in the dated census/audit files, followed by regenerated saturation evidence and human approval.
