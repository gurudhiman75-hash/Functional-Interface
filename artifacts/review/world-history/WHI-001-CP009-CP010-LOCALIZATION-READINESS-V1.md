# WHI-001-CP009/CP010 — Localization Readiness Review V1

**Status:** English pools approved; Hindi and Punjabi review candidates authored. Native-language review remains open. All pools and candidate records are review-only.
**Purpose:** Track localization parity, canonical source coverage and release gates for CP009 and CP010.

## Current files

| Checkpoint | English pool | Hindi candidate | Punjabi candidate | Hindi review | Punjabi review |
|---|---|---|---|---|---|
| CP009 | Approved, 60 questions | Present, 60 records | Present, 60 records | Present | Present |
| CP010 | Approved, 60 questions | Present, 60 records | Present, 60 records | Present | Present |

## Canonical source-locator coverage

The source registers link every canonical fact to a registered source and focused passage locator.

| Checkpoint | Canonical facts | Family-level locators | Focused locators |
|---|---:|---:|---:|
| CP009 | 60 | 0 | 60 |
| CP010 | 60 | 0 | 60 |

All 60 canonical facts in each checkpoint have focused section, article, document or paragraph locators. The final source pass covered CP009 Q049–Q060 and CP010 Q049–Q060. Earlier passes supplied focused references for the League, Weimar and Depression, Nazi consolidation, Allied strategy, Holocaust, Pacific campaigns and wartime home fronts.

Human approval of both English pools was recorded on 2026-09-30. The English editorial record is in `WHI-001-CP009-CP010-EN-EDITORIAL-REVIEW-V1.md`. Hindi and Punjabi files reuse the `knowledge-v1` localization record shape used by CP016 and preserve each English record’s question/fact/source IDs, difficulty, family mapping, keyed option order and correct-option key.

## Localization parity checks

- 60 unique records in each of the four locale pools.
- Exact English question, checkpoint and fact linkage for each item.
- Difficulty, correct-option key, option-key order and source-ID list match English.
- All four options, stems and explanations are populated.
- Every record has `reviewOnly: true` and `runtimeRegistered: false`.
- Each pool has a matching human-readable review file.

These checks establish structural and semantic linkage; they do not replace native-language proofreading for fluency, exam-natural phrasing, grammar or explanation quality.

## Required sequence

1. Complete native Hindi and Punjabi review for each checkpoint, correcting any awkward wording while preserving the frozen English fact, answer and source linkage.
2. Re-run the localization parity and artifact-render checks after revisions.
3. Only after all language reviews pass, register the four approved locale pools through the existing shared Question Studio architecture.
4. Keep learner publication and delivery disabled until that review and registration gate is satisfied.

No learner delivery or runtime registration is enabled by these candidates.
