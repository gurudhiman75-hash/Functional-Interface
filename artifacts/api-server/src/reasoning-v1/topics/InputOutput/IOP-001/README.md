# IOP-001 — Machine Input–Output & Sequential Rearrangement

Status: **ENGLISH_FROZEN — human-approved, source-family saturated, 8 permanent QLs, 19 source-whitelisted English modes**.

`IOP-001` is the Reasoning V1 implementation package for student-facing **Input–Output** (`REAS-INP`). It uses explicit sequence-of-states engines, independent oracles and rule-identifiability gates rather than static rearrangement templates.

## Permanent machine authorities

Strict source normalization and semantic merge/split reduce the 30 temporary discovery prototypes plus the source-backed RBI gap to **8 permanent machine QLs**:

```text
IOP-QL-001  Single Select-and-Fix Rearrangement
IOP-QL-002  Blocked Multi-Category Rearrangement
IOP-QL-003  Simultaneous Multi-Action Rearrangement
IOP-QL-004  Alternating / Interleaved Rearrangement
IOP-QL-005  Numeric Transformation Pipeline
IOP-QL-006  Text / Alphanumeric Transformation Pipeline
IOP-QL-007  Mixed Word–Number Transformed-Pair Machine
IOP-QL-008  Box / Table Arithmetic Machine
```

CP010 contributes solve/query modes rather than duplicate machine QLs. All eight permanent QLs now carry `englishProductionStatus: ENGLISH_FROZEN`.

Authority: `permanent-authorities.ts`.

## English V1 source whitelist

Frozen English V1 exposes **19 source-whitelisted modes** across the 8 permanent QLs.

Important advanced boundaries:

- `IOP-QL-005`: source-backed odd-reverse / even-increment two-ended numeric machine;
- `IOP-QL-006`: source-backed RBI-style **text** pipeline; alphanumeric production remains outside V1 until separately source-backed;
- `IOP-QL-007`: source-pinned RBI Grade B 2024 mixed transformed-pair family;
- `IOP-QL-008`: source-backed cross-product / digit-combine / quotient / difference box family.

Executable synthetic reverse/rotate/pair-rewrite combinations remain discovery evidence and are not automatically authorized as frozen English content.

See `ENGLISH-SOURCE-MODE-WHITELIST-V1.md`.

## Frozen learner quality

The approved review remediation is part of the frozen content authority:

- every MCQ has a worked, question-specific explanation;
- explanations state what is asked, infer the rule, apply it to the new input and show the relevant trace/arithmetic;
- the general word authority contains 188 words;
- the general two-digit authority contains 89 numbers;
- word-length buckets contain at least 20 alternatives per length;
- RBI text vowel-count buckets contain at least 24 alternatives per bucket;
- the mixed RBI three-digit authority contains 900 candidates.

The approved 38-caselet learner artifact exposed **149 distinct words and 105 distinct numbers**, with **0 duplicate target inputs**.

## Safety architecture

A caselet is rejected unless:

- the learner-visible machine has exactly one supported semantic interpretation;
- independent executor/oracle traces agree;
- child answers independently recompute;
- visible states do not repeat;
- learner-visible selection keys do not depend on hidden ties;
- option semantics are unique and exactly one option is correct;
- answer-specific explanations are substantive;
- lifecycle flags remain fail-closed.

The implementation retains separate classical, advanced, mixed-source, numeric-production, text-production and constructive box-production authority paths so source-specific production constraints do not weaken discovery regressions.

## Solve/query modes

Frozen English covers all eight solve modes:

- `STEP_OUTPUT`
- `FINAL_OUTPUT`
- `ELEMENT_AT_POSITION`
- `POSITION_OF_ELEMENT`
- `STEP_NUMBER`
- `PREVIOUS_STEP`
- `MISSING_STEP`
- `REMAINING_STEP_COUNT`

These are query overlays, not extra machine QLs.

## Proof scale

```text
CP001–CP004 foundation:          960 caselets / 3,840 children
CP005–CP010 advanced:            720 caselets / 2,880 children
RBI mixed-source gap:            160 caselets /   640 children
permanent QLs:                     8
whitelisted English modes:        19
English scaled caselets:           96
English scaled child questions:   384
English solve modes covered:        8
English review caselets:            38
English review questions:          152
box visible arithmetic:           PASS
rich object/explanation audit:    PASS
```

The permanent human-review pack is query-balanced:

```text
STEP_OUTPUT              20
FINAL_OUTPUT             20
ELEMENT_AT_POSITION      18
POSITION_OF_ELEMENT      18
STEP_NUMBER              19
PREVIOUS_STEP            19
MISSING_STEP             19
REMAINING_STEP_COUNT     19
```

## Human approval and content-addressed freeze

Human/product-owner approval was granted on **2026-08-18** after review of the revised rich-pool/full-explanation learner artifact.

The approved artifact and its inner HTML/JSON hashes are pinned in `ENGLISH-FREEZE-EVIDENCE-V1.md` and `english-freeze-authority.ts`.

`english-freeze-authority.test.ts` regenerates the exact 38 approved caselets and checks the canonical learner-content SHA-256:

```text
58a91a0dd0b5faeb0e601e8d5b587a0f7768a65c246530f5bb316b73b9232413
```

If learner content changes, this proof fails and a new review/approval is required.

## Current chapter lifecycle

```text
maturity:                     ENGLISH_FROZEN
sourceFamilySaturation:       PASS_V1
permanentQlCount:             8
whitelistedSourceModeCount:   19
English automated proof:      PASS
English audit pack:           PASS
English artifact audit:       PASS
English human approval:       APPROVED_2026_08_18
English freeze:               true
Question Studio:              false
Question Bank writes:         false
test eligibility:             false
public publication:           false
Hindi/Punjabi:                NOT_STARTED
```

`IOP_001_LIFECYCLE` remains the discovery-caselet lifecycle for regression isolation. `IOP_001_CHAPTER_LIFECYCLE` is the current chapter-level authority.

## Next gate

The next content phase is **Hindi/Punjabi localization over the frozen English QLs**, followed by semantic-parity proof and human language review/freeze.

English approval does **not** authorize Question Studio, Question Bank, test/mock delivery, public publication, PR merge or automatic activation. Those remain separate gates.
