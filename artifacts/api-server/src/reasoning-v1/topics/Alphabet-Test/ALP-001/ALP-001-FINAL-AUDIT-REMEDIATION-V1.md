# ALP-001 — Reasoning V1 Final-Audit Remediation V1

Status: `IMPLEMENTED_ON_REVIEW_BRANCH__CI_GREEN__NO_PUBLIC_PROMOTION`

## Why this remediation exists

The final Reasoning V1 audit found no P0 logical failure, but it did find several P1 weaknesses that must be closed before ALP-001 can be treated as final-release ready. The original version of this remediation note covered only four of them; this revision reconciles the branch with the complete audit and the follow-up micro-audit of the remediation itself.

The audited P1 set is:

1. difficulty was seed-driven or fixed by QL instead of being derived from the generated reasoning state;
2. CP009 lacked source-backed compound three-token neighbourhood scans;
3. CP010 could sort letters in place and could count unchanged positions, but could not compose those two operations;
4. CP008–CP010 source rows had a strong generator fingerprint: fixed lengths/category ratios and no repeated visible tokens;
5. CP005–CP007 word reservoirs were too small for production fatigue resistance;
6. CP009 contained two pairs of semantic duplicate QLs;
7. CP006–CP010 distractors were not consistently constructed from explicit misconception states.

A separate cross-chapter source audit also found classic meaningful-word formation (can/cannot be formed from the letters of one source word) without a confirmed Reasoning V1 owner. That ownership decision remains a release gate; it is not silently forced into ALP-001 by this patch.

## Implemented changes

### 1. Generated-state difficulty

CP001–CP005 retain their earlier removal of seed-cycle bonuses. The follow-up micro-audit also removed the remaining CP005 word-length bonus, because a longer source word must not be the deciding reason an otherwise equivalent item becomes Hard. CP006–CP010 use `completion/difficulty-v2.ts`, which receives the completed solve state rather than the raw seed.

Difficulty can use actual reasoning features such as:

- direct versus inverse lookup;
- pair density and repeated-letter burden where they affect reasoning;
- one-stage versus multi-stage transformations;
- compound three-token predicates;
- transform-then-count composition;
- repeated-token burden only for scan/inverse tasks where repetition actually matters.

Raw seed, number magnitude, mixed-row length and single-word length are deliberately absent as difficulty escalators. The executable gate also compares otherwise identical direct-position states of different lengths and requires the same difficulty.

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

The follow-up micro-audit found that the original remediation had expanded CP006/CP007 but had accidentally left the old 24-word CP005 reservoir in place. That residual P1 is now closed.

- CP005 now has 270 unique governed exam-neutral words; 256 are six-plus-letter words eligible for the ordinary CP005 surfaces.
- the CP005 reservoir has at least 120 eligible odd-length and at least 120 eligible even-length words, so middle-letter and middle-pair tasks do not collapse into small sub-pools;
- CP005 now cycles through each QL's eligible governed pool before repeating a word, rather than relying on collision-prone random picks;
- `WORD_IDENTIFY_UNCHANGED_ASC` filters for valid unchanged-position words before selection, eliminating the old constant-fallback fingerprint;
- every CP005 QL must expose at least 95 distinct source words across seeds 0–99;
- CP006 source vocabulary is above 180 unique exam-neutral words;
- CP007 class-transformation vocabulary is above 160 eligible words;
- deterministic cycling is retained for CP006/CP007;
- every CP006/CP007 QL must produce at least 95 distinct visible questions across seeds 0–99.

The CP006/CP007 gate measures visible `stem + options`; the CP005 gate directly measures source-word exposure because the governed word itself is the principal fatigue surface.

### 6. Completed-state misconception distractors

The follow-up micro-audit found that the first remediation still generated many wrong options from the **answer type** (`answer ± 1`, neighbouring alphabet letters, arbitrary pool values) and only attached better labels afterward. That did not fully close P1 #7.

The advanced runtime now uses `completion/distractors-v2.ts`. It receives the completed solve state and derives wrong answers from concrete learner mistakes before the final option order is shuffled. Representative models include:

- CP006: count only forward/backward qualifying pairs, ignore the direction restriction, miss/add one qualifying pair, or choose a visible pair whose row gap and natural-order gap disagree;
- CP007: read the source letter before the class transformation, stop after the first stage, read a neighbouring final slot, count changed positions instead of unchanged positions, or count a sorted position from the wrong end;
- CP008: count a digit from the wrong end, report an inverse position from the wrong end, read the same slot before sorting/reversal/swap, select a neighbouring final digit, or count moved positions instead of unchanged positions;
- CP009: reverse the requested adjacency, forget a vowel/even-digit filter, count the requested category from the wrong end, or—in compound windows—check only the predecessor, only the successor, reverse the outer classes, or accept invalid same-class flanks;
- CP010: read the original row instead of the transformed row, use a neighbouring final position, report the pre-grouping token position, count changed instead of unchanged positions, scan adjacency before the transform, or reverse the final adjacency order.

For rare seeds where several misconception states collapse to the same visible value, the filler is restricted to a distinct token already visible in the generated source/final state; arbitrary alphabet/number neighbours are not invented. CP007 opposite-letter generation exposes both source and final visible tokens to this state-aware fallback, which removes the low-diversity failure found by the first adversarial run.

The dedicated `alp-001-distractor-provenance.test.ts` gate now sweeps every advanced QL over 64 seeds, requires four distinct options, rejects the old generic answer-type/post-hoc labels, and separately proves representative misconception provenance for CP008 post-transform reads, CP009 direct positioning and compound windows, and CP010 in-place/composite transforms.

### 7. Question Studio controls

The chapter-local registry retains backward-compatible `generate(qlId, seed, locale)` and adds `generateControlled(...)` with optional checkpoint/QL scope, requested difficulty and explicit exam profile.

Supported local profiles remain:

- `SSC_CGL_TIER_I` — 4 options;
- `PUNJAB_STATE_4_OPTION` — 4 options.

`BANKING_GENERIC_5_OPTION` fails closed because the current ALP runtime remains four-option. Five-option Banking delivery is still a shared Reasoning exam-profile product gate.

## Executable release gate

The ALP chapter workflow now proves:

- CP005 governed reservoir size/uniqueness, odd/even depth and >=95/100 source-word exposure for every CP005 QL;
- CP006/CP007 governed word-pool size/uniqueness and >=95/100 visible-fatigue diversity;
- absence of legacy/fallback advanced distractor labels and completed-state provenance across every advanced QL over a 64-seed sweep;
- explicit wrong-stage/wrong-end/window-condition provenance for representative CP008–CP010 families;
- real instance-derived difficulty variation for composite QLs;
- row length alone cannot promote difficulty, while CP005 no longer uses source-word length as an escalation lever;
- mixed-row length/category-profile diversity;
- repeated-token exposure in mixed rows and digit rows;
- CP009 duplicate-QL identities have been replaced by compound-window identities;
- both source-backed QL-138 window variants are reachable;
- QL-140 centre-flank semantics render correctly;
- CP010 can generate sort-letters-in-place → unchanged-count and its digit analogue;
- controlled SSC/Punjab generation satisfies requested difficulty/profile;
- unsupported five-option Banking generation fails closed.

The complete ALP-001 chapter workflow, the completed-state distractor provenance gate and retained CP001–CP005 regressions are green on the remediation branch. Lifecycle promotion is still deliberately blocked.

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
