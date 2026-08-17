# IOP-001 — Machine Input–Output & Sequential Rearrangement

Status: **ENGLISH_REVIEW_CANDIDATE — source-family saturated, 8 permanent QLs, 19 source-whitelisted English modes; not frozen**.

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

CP010 contributes solve/query modes rather than duplicate machine QLs.

Authority: `permanent-authorities.ts`.

## English V1 source whitelist

English production is intentionally narrower than executable discovery. V1 exposes **19 source-whitelisted modes** across the 8 permanent QLs.

Important advanced boundaries:

- `IOP-QL-005`: source-backed odd-reverse / even-increment two-ended numeric machine;
- `IOP-QL-006`: source-backed RBI-style **text** pipeline; alphanumeric production remains outside V1 until separately source-backed;
- `IOP-QL-007`: source-pinned RBI Grade B 2024 mixed transformed-pair family;
- `IOP-QL-008`: source-backed cross-product / digit-combine / quotient / difference box family.

Executable synthetic reverse/rotate/pair-rewrite combinations remain discovery evidence and are not automatically authorized as English content.

See `ENGLISH-SOURCE-MODE-WHITELIST-V1.md`.

## Safety architecture

A caselet is rejected unless:

- the learner-visible machine has exactly one supported semantic interpretation;
- independent executor/oracle traces agree;
- child answers independently recompute;
- visible states do not repeat;
- learner-visible selection keys do not depend on hidden ties;
- option semantics are unique and exactly one option is correct;
- answer-specific explanations are present;
- lifecycle flags remain fail-closed.

The implementation retains separate classical, advanced, mixed-source, numeric-production, text-production and constructive box-production authority paths so source-specific production constraints do not weaken discovery regressions.

## Solve/query modes

Permanent English review covers all eight solve modes:

- `STEP_OUTPUT`
- `FINAL_OUTPUT`
- `ELEMENT_AT_POSITION`
- `POSITION_OF_ELEMENT`
- `STEP_NUMBER`
- `PREVIOUS_STEP`
- `MISSING_STEP`
- `REMAINING_STEP_COUNT`

These are query overlays, not extra machine QLs.

## Latest exact green proof

The serialized chapter gate on the final learner-facing implementation passed:

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
strict TypeScript:                PASS
production API build:             PASS
```

The permanent human-review pack is deliberately query-balanced:

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

See `ENGLISH-REVIEW-CANDIDATE-EVIDENCE-V1.md` for workflow/artifact identifiers and audit details.

## Review artifact

The English audit exporter produces:

```text
IOP-001-ENGLISH-PERMANENT-REVIEW.html
IOP-001-ENGLISH-PERMANENT-REVIEW.json
```

It contains **38 caselets / 152 questions**, covering every V1 source mode twice. The full target trace is reviewer evidence only and must not appear in student delivery.

The review cycle also fixed two QL008 fairness hazards before candidate status:

- production now constructs source-shaped valid box inputs instead of relying on sparse random rejection sampling;
- displayed rounded Step-3 quotients must reproduce the displayed final answer exactly.

## Current chapter lifecycle

```text
maturity:                     ENGLISH_REVIEW_CANDIDATE
sourceFamilySaturation:       PASS_V1
permanentQlCount:             8
whitelistedSourceModeCount:   19
English automated proof:      PASS
English audit pack:           PASS
English artifact audit:       PASS
English freeze:               false
Question Studio:              false
Question Bank writes:         false
test eligibility:             false
public publication:           false
Hindi/Punjabi:                NOT_STARTED
```

`IOP_001_LIFECYCLE` remains the discovery-caselet lifecycle for regression isolation. `IOP_001_CHAPTER_LIFECYCLE` is the current chapter-level authority.

## Next gate

The next gate is **human/product-owner English approval and explicit freeze**.

Do not start Hindi/Punjabi localization or whole-chapter Question Studio registration until that freeze is granted.
