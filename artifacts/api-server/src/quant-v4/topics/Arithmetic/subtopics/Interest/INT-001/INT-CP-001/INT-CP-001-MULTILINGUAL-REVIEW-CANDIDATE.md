# INT-001 / INT-CP-001 Multilingual Review-Candidate Record

Hindi release candidate: `INT-CP-001-HI-v1`  
Punjabi release candidate: `INT-CP-001-PA-v1`  
Editorial standard: `FOUR_TIER_GOLD_MULTILINGUAL_V1`  
English authority: `INT-CP-001-EN-v3`  
Permanent QL range: `INT-QL-001..INT-QL-021`  
Status: **PENDING HUMAN MULTILINGUAL REVIEW**

## Scope

This record freezes the generated Hindi and Punjabi review candidates for all 21 permanent CP-001 Question Logics.

The locale layer changes learner-facing language only. It does not change:

- QL identity or ownership;
- solve contract or equation topology;
- exact hidden state;
- canonical solution;
- option-result values;
- misconception IDs;
- correct option index;
- mathematical fingerprint;
- publication or routing eligibility.

## Locale architecture

Hindi and Punjabi are rendered from the approved structured English authority, the frozen solve contract and the exact hidden state. They are not produced by blindly translating completed English paragraphs.

The locale runtime preserves:

- deterministic generation by QL and seed;
- exact English–Hindi–Punjabi mathematical parity;
- Indian Rupee display and Indian digit grouping;
- exact MathJax fractions and variables;
- all four answer positions;
- all 32 frozen source adapters;
- four-tier explanations;
- three option-specific distractor explanations;
- review-only lifecycle safety.

## Editorial decisions

Hindi uses direct competitive-exam language and Devanagari script.

Punjabi uses natural Gurmukhi wording. Formal or unnatural terms such as `ਪਦ` and `ਸਾਦ੍ਰਿਸ਼ਤਾ` are prohibited by the locale gate.

The final review-candidate pass permanently guards against:

- Devanagari/Gurmukhi script leakage;
- shared Indic punctuation being misclassified as Hindi text;
- malformed percentage notation such as `12%%` or `12%\\%`;
- imperative question endings;
- awkward annual-rate phrasing;
- amount-multiple gender-agreement defects;
- year answers being displayed where months are required;
- repeated distractor explanations;
- reversed amount-multiple and interest-ratio misconception descriptions;
- closure states unable to construct four unique options.

## Exact proof before record

Validated export-wired code head:

`4a80f3d04728e2a55365f448fd30ad256e10b7ca`

Workflow:

```text
Validate INT-CP-001 multilingual parity
Run:        30346618541
Conclusion: PASS
```

Evidence artifact:

```text
Artifact ID: 8683159611
Digest: sha256:c3bb68949d0bb9ef7b31dabd3e4dd15f20a5277f1c604839e30bc1915566553a
```

## Exhaustive parity audit

```text
21 QLs × 80 seeds × 2 locales = 3,360 localized questions
```

Observed:

```text
Exact parity checks:              3,360
Distractor checks:               10,080
Cross-locale exact collisions:        0

Hindi generated:                 1,680
Hindi distinct stems:            1,644
Hindi distinct answers:            332
Hindi answer positions:      421/419/419/421
Hindi source adapters:              32

Punjabi generated:               1,680
Punjabi distinct stems:          1,646
Punjabi distinct answers:          332
Punjabi answer positions:    421/419/419/421
Punjabi source adapters:            32
```

The approved English V3 regression also passed on the same workflow.

## Human review packs

The generated evidence contains:

```text
Hindi:    21 QLs × 3 review seeds = 63 questions
Punjabi:  21 QLs × 3 review seeds = 63 questions
Total:                              126 questions
```

Every review item contains the localized stem, four options, correct-index evidence, four-tier explanation, MathJax working, exam shortcut and three misconception-aligned distractor explanations.

## Review boundary

These are review candidates, not approved language releases.

```text
reviewStatus:                PENDING_MULTILINGUAL_REVIEW
localeReviewStatus:          PENDING_HUMAN_REVIEW
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
questionStudioDiscoverable:  false
```

Hindi and Punjabi require explicit human approval. Publication, Question Bank storage, mock-test eligibility and Question Studio routing remain locked even after language approval until their lifecycle gates are deliberately changed.
