# ALP-001 — Reasoning V1 Final-Audit Remediation V1

Status: `IMPLEMENTED_ON_REVIEW_BRANCH__CI_REQUIRED__NO_PUBLIC_PROMOTION`

## Why this remediation exists

The final Reasoning V1 audit found no P0 logical failure, but it did find several P1 weaknesses that must be closed before ALP-001 can be treated as final-release ready. The original version of this remediation note covered only four of them; this revision reconciles the branch with the complete audit.

The audited P1 set is:

1. difficulty was seed-driven or fixed by QL instead of being derived from the generated reasoning state;
2. CP009 lacked source-backed compound three-token neighbourhood scans;
3. CP010 could sort letters in place and could count unchanged positions, but could not compose those two operations;
4. CP008–CP010 source rows had a strong generator fingerprint: fixed lengths/category ratios and no repeated visible tokens;
5. CP006/CP007 word reservoirs were too small for production fatigue resistance;
6. CP009 contained two pairs of semantic duplicate QLs;
7. CP006–CP010 distractors were not consistently constructed from explicit misconception states.

A separate cross-chapter source audit also found classic meaningful-word formation (can/cannot be formed from the letters of one source word) without a confirmed Reasoning V1 owner. That ownership decision remains a release gate; it is not silently forced into ALP-001 by this patch.

## Implemented changes

### 1. Generated-state difficulty

CP001–CP005 retain their earlier removal of seed-cycle bonuses. CP006–CP010 now use `completion/difficulty-v2.ts`, which receives the completed solve state rather than the raw seed.

Difficulty can use actual reasoning features such as:

- direct versus inverse lookup;
- pair density and repeated-letter burden where they affect reasoning;
- one-stage versus multi-stage transformations;
- compound three-token predicates;
- transform-then-count composition;
- repeated-token burden only for scan/inverse tasks where repetition actually matters.

Raw seed, number magnitude and mixed-row length are deliberately absent from the difficulty function. The executable gate also compares otherwise identical direct-position states of different lengths and requires the same difficulty.

Some QLs are intentionally allowed to span more than one difficulty when their generated transform structure changes. This replaces the earlier, incorrect gate that required every advanced QL to have exactly one difficulty across all seeds.

### 2. Compound neighbourhood scans

`ALP-QL-138` and `ALP-QL-140` were previously semantic duplicates of `ALP-QL-137` and `ALP-QL-139` respectively.

Their permanent IDs are preserved, but before chapter freeze their canonical rule/task identities are corrected:

- `ALP-QL-138` now owns a generalized three-token window family, including source-backed `symbol → letter → digit` windows and literal `Z-A-B` neighbourhoods;
- `ALP-QL-140` now owns the source-backed centre-symbol condition where the two immediate neighbours are one letter and one digit in either order.

The legacy solve-mode strings are retained only as wire-compatibility identifiers. Runtime semantics, rule IDs, task kinds, presentation modes, stems and pedagogy now reflect the canonical compound-window identities.

The generator deliberately embeds at least one valid source-shaped window, then independently scans the full row so accidental additional matches are still counted correctly.

### 3. Transform → query composition

`MIXED_COUNT_UNCHANGED_AFTER_TRANSFORM` now includes:

- group letters/digits/symbols;
- adjacent-pair swap;
- reverse complete row;
- **sort only letters within existing letter positions**;
- sort only digits within existing digit positions.

This closes the source-backed `sort letters in place → count unchanged positions` fake/partial coverage gap without creating a separate QL merely for the composition.

### 4. Variable rows and repeated occurrences

A new `completion/mixed-row.ts` builder replaces the old fixed 8-letter + 8-digit + 8-symbol all-unique topology for CP009/CP010.

It now varies:

- row length;
- letter/digit/symbol counts independently;
- category ratio;
- zero/one/two repeated occurrences per category.

CP010 inverse-position questions select a token that occurs exactly once, so repetition never creates an ambiguous target.

CP008 digit rows also vary from 7–9 digits and permit controlled repeated digits for occurrence-safe tasks. `IDENTIFY_DIGIT_GAP_PAIR` remains distinct-token-only, while inverse digit-position questions explicitly select a unique occurrence.

### 5. Fatigue resistance

- CP006 source vocabulary is above 180 unique exam-neutral words.
- CP007 class-transformation vocabulary is above 160 eligible words.
- deterministic cycling is retained for these families.
- every CP006/CP007 QL must produce at least 95 distinct visible questions across seeds 0–99.

The gate measures visible `stem + options`, not hidden seed diversity.

### 6. Misconception-owned distractors

Advanced options retain the remediation that constructs wrong values together with their mistake labels rather than assigning a generic label after random selection.

The final gate rejects the old post-hoc labels:

- `SOURCE_ROW_EARLY`;
- `OPPOSITE_REFERENCE`;
- `WRONG_FINAL_CONDITION`;
- `DOMAIN_VALID_FALLBACK` in audited advanced output.

For the new compound-window scans, distractor explanations are generated from the completed three-token scan and explicitly state that the wrong count omits or adds a qualifying window.

### 7. Question Studio controls

The chapter-local registry retains backward-compatible `generate(qlId, seed, locale)` and adds `generateControlled(...)` with optional checkpoint/QL scope, requested difficulty and explicit exam profile.

Supported local profiles remain:

- `SSC_CGL_TIER_I` — 4 options;
- `PUNJAB_STATE_4_OPTION` — 4 options.

`BANKING_GENERIC_5_OPTION` fails closed because the current ALP runtime remains four-option. Five-option Banking delivery is still a shared Reasoning exam-profile product gate.

## Executable release gate

`alp-001-final-audit.test.ts` now proves:

- governed word-pool size and uniqueness;
- absence of legacy/fallback advanced distractor labels;
- real instance-derived difficulty variation for composite QLs;
- row length alone cannot promote difficulty;
- mixed-row length/category-profile diversity;
- repeated-token exposure in mixed rows and digit rows;
- CP009 duplicate-QL identities have been replaced by compound-window identities;
- both source-backed QL-138 window variants are reachable;
- QL-140 centre-flank semantics render correctly;
- CP010 can generate sort-letters-in-place → unchanged-count and its digit analogue;
- CP006/CP007 pass the 100-question visible-fatigue gate;
- controlled SSC/Punjab generation satisfies requested difficulty/profile;
- unsupported five-option Banking generation fails closed.

## Word-formation ownership gate

Repository-wide ownership search found no dedicated Reasoning V1 authority for classic source-letter inventory feasibility such as:

- which option can be formed from the letters of a supplied word;
- which option cannot be formed;
- multiplicity-sensitive use of repeated letters.

WOR-001 owns dictionary ordering of multiple words/clusters and explicitly delegates single-word letter operations away from itself. COD-001 owns hidden coding inference. ALP-001 currently excludes meaningful-word formation in its frozen ownership notes.

Therefore this is a genuine cross-chapter ownership gap, not evidence that the existing 156 ALP QLs already cover it. A deliberate ownership decision and implementation must be completed before the overall Reasoning V1 release gate can close. This branch does not counterfeit coverage by relabelling an unrelated ALP QL.

## Lifecycle

This remediation does **not** promote the chapter:

```text
questionStudioDiscoverable:  chapter-local adapter only
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

No merge, editorial freeze, Question Bank write, mock-test eligibility or public publication is authorized by this remediation branch.