# SEA-002 / SEA-CP-006 — Hindi/Punjabi localization review readiness

Status: **EXECUTABLE REVIEW CANDIDATE IMPLEMENTED / HUMAN LANGUAGE REVIEW PENDING / MULTILINGUAL FREEZE FALSE**

Canonical English authority is already frozen and remains unchanged:

- permanent QLs: `SEA-QL-021` through `SEA-QL-024`;
- approved English fingerprint: `07216e2a08c198266bd25e40484a477d5c6e4de73b2dae06b8235fc3773a0c3e`;
- learner terminology: **position / positions**, never learner-facing column wording;
- next permanent seating ID: `SEA-QL-025`.

## Localization scope

Target locales:

- `hi-IN` — Hindi / Devanagari;
- `pa-IN` — Punjabi / Gurmukhi.

The localized layer is a presentation candidate only. It must not change:

- checkpoint/PBA/permanent QL identity;
- people and hidden state;
- typed clue semantics;
- solution count / solver-oracle agreement;
- structural fingerprint;
- query contract;
- answer type;
- answer-determining fact;
- canonical answer and answer index;
- option correctness;
- misconception IDs.

Localized option values are display values only. The canonical English answer remains the semantic authority.

## Exact teaching-path parity

The candidate does not replace the approved English solution with a shorter generic explanation. It preserves the same teaching skeleton:

- opening working frame;
- condition/action order;
- Case 1 / Case 2 / Case 3 formation where present;
- deciding-condition order;
- accept/reject decisions;
- Working steps;
- `Position:` deduction outcomes;
- final arrangement.

Every non-empty frozen English shared-solution line must map to one supported localized line. Unsupported English surface forms fail closed instead of falling back to loose translation.

## Deterministic corpus coverage

The exact frozen 100-caselet English corpus was profiled before implementation. After names/numbers are normalized it contains:

- 4 setup shapes;
- 34 clue shapes;
- 15 question shapes;
- 31 correct-explanation shapes;
- 70 option-rationale shapes;
- 128 shared-solution line shapes.

The deterministic CP006 localizer has explicit coverage for those frozen surfaces in both target locales.

The candidate proof generates:

- 100 Hindi caselets;
- 100 Punjabi caselets;
- 800 localized child questions;
- 200 canonical semantic-parity checks;
- 200 teaching-skeleton parity checks;
- 800 answer/option-rationale parity checks;
- target-script checks;
- zero-Latin learner-surface checks;
- zero learner-facing `column` / `columns` checks;
- unique localized presentation fingerprints.

## Review package

`cp006-localized-review-export.ts` exports one side-by-side review package containing:

- frozen English setup vs localized setup;
- frozen English clues vs localized clues;
- English arrangement text vs localized arrangement text;
- every question in English and target locale;
- every option value and option rationale in English and target locale;
- canonical answer and localized display answer;
- full frozen English shared solution vs full localized shared solution.

The package contains **200 localized caselets**: 100 Hindi + 100 Punjabi.

## Current gate

The localized candidate is **not multilingual-frozen**. Human Hindi/Punjabi review is required before any signed localization approval is written.

Until that exact localized review fingerprint receives explicit approval:

```text
English freeze             FROZEN
localization status         REVIEW_CANDIDATE_HUMAN_REVIEW_PENDING
localization frozen         false
Question Studio registered false
Question Bank writable     false
mock-test eligible         false
production staging         false
public delivery            false
```

GitHub Actions must still execute the new localization-readiness and localized-candidate proof steps on the branch head. The repository status must not describe those new steps as CI-green while the runner remains queued.
