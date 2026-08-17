# IOP-001 English Review Candidate Branch Status

Branch: `feat/iop-001-foundation-cp001-cp004`
PR: `#840`

## Current maturity

```text
sourceFamilySaturation:       PASS_V1
maturity:                     ENGLISH_REVIEW_CANDIDATE
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

## Permanent QLs

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

The 30 CP001–CP010 prototypes remain executable discovery evidence; they are not 30 permanent QLs. CP010 remains a solve/query overlay and creates zero extra machine QLs.

## English V1

Nineteen source-whitelisted production modes are implemented across the eight QLs. The advanced V1 boundary is deliberately narrow:

- QL005 numeric: source-backed odd-reverse / even-increment two-ended family;
- QL006: source-backed RBI-style text pipeline; alphanumeric production is not yet V1-authorized;
- QL007: source-pinned RBI Grade B 2024 mixed transformed-pair family;
- QL008: source-backed constructive box arithmetic authority.

## Latest proof

The final learner-facing implementation passed the serialized chapter gate end-to-end:

```text
foundation caselets             960
foundation child questions    3,840
advanced caselets               720
advanced child questions      2,880
RBI mixed caselets              160
RBI mixed children              640
English scaled caselets          96
English scaled children         384
English review caselets          38
English review questions        152
solve modes                        8
box visible arithmetic          PASS
strict TypeScript               PASS
production API build            PASS
```

The permanent review pack has exact query balance:

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

Artifact evidence and SHA-256 are recorded in `ENGLISH-REVIEW-CANDIDATE-EVIDENCE-V1.md`.

## Remaining gate

**Human/product-owner English approval and explicit freeze.**

Until that approval, localization and all product-delivery surfaces remain locked. Whole-chapter Question Studio integration remains deferred.
