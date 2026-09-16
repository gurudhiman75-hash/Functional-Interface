# ALP-001 — Reasoning V1 Final-Audit Remediation V2

Status: `REVIEW_ONLY_CURRENT_MAIN_CANDIDATE`

This checkpoint forward-ports the still-valid ALP-001 P1 remediation from the stale 2026-09-12 audit branch onto current `New-main`. It does not promote ALP-001 or open learner delivery.

## P1 weaknesses closed by this remediation

1. Difficulty was seed-driven or fixed by QL instead of being derived from the generated reasoning state.
2. CP009 lacked source-backed compound three-token neighbourhood scans.
3. CP010 could sort letters in place and count unchanged positions, but could not compose the two operations.
4. CP008–CP010 had a generator fingerprint from fixed row lengths/category ratios and insufficient repeated-token exposure.
5. CP005–CP007 word reservoirs were too small for production fatigue resistance.
6. CP009 contained semantic duplicate QLs.
7. CP006–CP010 distractors were not consistently derived from explicit misconception states.
8. The review/learner explanation surface rendered shortcut and option-by-option trap sections on every question, creating unnecessary boilerplate.

## Implemented remediation

### Generated-state difficulty

CP001–CP005 retain the removal of seed-cycle bonuses. CP005 no longer promotes difficulty merely because the source word is longer. CP006–CP010 use `completion/difficulty-v2.ts`, where difficulty follows completed learner-visible reasoning features such as inverse lookup, pair density, multi-stage transformation, compound-window reasoning, transform-then-count composition and genuine repeated-token burden.

Raw seed, arbitrary number magnitude, row length by itself and source-word length by itself are not difficulty escalators.

### CP009 compound neighbourhood scans

Permanent IDs are preserved, but the duplicate semantics are corrected before freeze:

- `ALP-QL-138` owns generalized three-token windows, including symbol-letter-digit and literal Z-A-B style neighbourhoods.
- `ALP-QL-140` owns the centre-symbol condition where the two immediate neighbours are one letter and one digit in either order.

Runtime rule/task identities, stems and explanations follow those corrected semantics. Legacy solve-mode strings remain only for wire compatibility.

### CP010 transform → query composition

`MIXED_COUNT_UNCHANGED_AFTER_TRANSFORM` can now compose unchanged-position counting with grouping, adjacent swap, full reversal, sort-letters-in-place and sort-digits-in-place. This closes the source-backed sort-in-place → unchanged-count gap without inflating the QL taxonomy.

### Variable rows and repeated occurrences

`completion/mixed-row.ts` varies row length, category counts and category ratios, with controlled repeated occurrences. CP010 inverse-position tasks select a uniquely occurring target. CP008 digit rows vary in length and allow repeated digits only where the solve contract remains occurrence-safe.

### Fatigue resistance

- CP005 has 270 unique governed exam-neutral words, with deep odd/even eligible sub-pools.
- CP005 selection cycles through each QL's eligible pool before repeating.
- each CP005 QL must expose at least 95 distinct source words across seeds 0–99.
- CP006 vocabulary exceeds 180 unique words.
- CP007 transformation vocabulary exceeds 160 eligible words.
- every CP006/CP007 QL must produce at least 95 distinct visible questions across seeds 0–99.

### Completed-state misconception distractors

`completion/distractors-v2.ts` generates wrong options from concrete learner mistakes rather than generic answer-neighbour arithmetic. Covered misconceptions include wrong direction, wrong end, wrong transformation stage, pre-transform versus post-transform reading, changed-versus-unchanged counting, wrong category filtering, reversed adjacency and partial compound-window checks.

The provenance gate sweeps every advanced QL over 64 seeds, requires four distinct options, rejects legacy generic labels and proves representative misconception provenance for CP008–CP010.

These misconception records remain **internal QA diagnostics**. They are not automatically shown to learners or rendered as an option-by-option explanation section.

### Clean learner/reviewer explanation surface

The raw runtime retains the richer diagnostic `ALP-001-PEDAGOGY-V2` object so audits can inspect rule statements, misconception provenance, shortcut notes and closest-trap rejection.

The Question Studio/review surface now uses the separate `ALP-001-LEARNER-EXPLANATION-V1` contract containing only:

1. a simple core concept;
2. worked steps;
3. position/sequence tracking when useful;
4. a direct conclusion containing the answer.

`learner-explanation.ts` performs this projection. `question-studio-registry.ts` applies it to both normal and controlled generation, and `export-review.ts` uses the same surface. Therefore learner/reviewer output no longer forces:

- “Exam-Speed Shortcut” sections;
- “Common Trap Analysis” sections;
- three option-by-option rejection paragraphs;
- duplicate rule/shortcut boilerplate after a complete worked solution.

`alp-001-learner-explanation.test.ts` sweeps all 156 QLs across English, Hindi and Punjabi and fails if these diagnostic-only fields leak back into the learner/Question Studio explanation surface.

### Question Studio controls

The chapter-local registry retains `generate(qlId, seed, locale)` and adds controlled generation with checkpoint/QL scope, requested difficulty and explicit exam profile.

Supported local profiles:

- `SSC_CGL_TIER_I` — 4 options
- `PUNJAB_STATE_4_OPTION` — 4 options

`BANKING_GENERIC_5_OPTION` fails closed because this ALP runtime remains four-option. A five-option Banking presentation is not silently synthesized.

## ALP ↔ WFM ownership boundary

The earlier audit branch correctly detected a Word Formation ownership gap, but that historical statement is no longer current. `WFM-001` now exists as the dedicated semantic owner for meaningful-word formation.

The boundary is:

- **ALP-001 owns** alphabet positions, relative positions, gaps, pair relations, alphabet/letter-class transformations, digit/alphanumeric/symbol scans, and rearrangement questions whose final learner task is an alphabet/position/rearrangement property.
- **WFM-001 owns** can-form/cannot-form from a letter multiset, multiplicity-sensitive meaningful-word feasibility, selected-position meaningful-word counting, and rearranging a supplied multiset into a meaningful word.
- A selected-position task belongs to WFM when the final task is meaningful-word formation/counting; ordinary selected-position alphabet reasoning remains ALP.
- **WOR-001** continues to own dictionary ordering.
- **COD-001** continues to own hidden coding/decoding inference.

`alp-wfm-ownership-boundary.test.ts` makes this semantic boundary executable and verifies that no existing ALP QL is moved or newly allocated by this checkpoint.

WFM V2 content is already present on `New-main`; its separate wider governance/shared-Question-Studio work remains independently gated and is not treated as merged by this ALP checkpoint.

## Executable review gate

The ALP workflow must prove:

- CP005 pool depth, uniqueness and >=95/100 source exposure per QL;
- CP006/CP007 pool depth and >=95/100 visible diversity per QL;
- advanced distractor provenance across the 64-seed sweep;
- concise learner/reviewer explanation separation across all QLs/locales;
- generated-state difficulty and absence of row/word-length inflation;
- mixed-row and repeated-token diversity;
- corrected QL138/QL140 compound-window semantics;
- CP010 in-place sort → unchanged-count composition;
- controlled SSC/Punjab generation;
- five-option Banking fail-closed behavior;
- ALP/WFM/WOR/COD ownership separation;
- retained CP001–CP005 regressions;
- API build and multilingual review-pack generation.

## Lifecycle

This remediation does **not** promote the chapter:

```text
questionStudioDiscoverable:  chapter-local review adapter only
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
mock/public delivery:        false
```

No permanent taxonomy change, Question Bank write, mock eligibility, student delivery or public publication is authorized by this checkpoint.
