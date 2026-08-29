# IOP-001 English Frozen Branch Status

Branch: `feat/iop-001-foundation-cp001-cp004`  
PR: `#840`  
PR state: **draft / unmerged**

## Current maturity

```text
sourceFamilySaturation:       PASS_V1
maturity:                     ENGLISH_FROZEN
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

All eight have `englishProductionStatus: ENGLISH_FROZEN`.

The 30 CP001–CP010 prototypes remain executable discovery evidence; they are not 30 permanent QLs. CP010 remains a solve/query overlay and creates zero extra machine QLs.

## Frozen English V1

Nineteen source-whitelisted modes are frozen across the eight QLs. The advanced V1 boundary remains deliberately narrow:

- QL005 numeric: source-backed odd-reverse / even-increment two-ended family;
- QL006: source-backed RBI-style text pipeline; alphanumeric production is outside frozen V1;
- QL007: source-pinned RBI Grade B 2024 mixed transformed-pair family;
- QL008: source-backed constructive box arithmetic authority.

Human approval was granted after the richer object authorities and full worked explanations were reviewed.

## Approved artifact authority

```text
reviewed head:        c0bde9aa516571e3adf71bbc99b83d2d2e7e8f3f
workflow:             32031090452
artifact:             9288927949
archive digest:       sha256:a407a19e24aeeb343690799a3b73ebd1ef5fbf45d945b43840724cb241dc0211
HTML sha256:          a889a98086633330f0619eabd30a06067c79c52780599108591c8ed388657079
JSON sha256:          94b5c9b31fb497c972fccba79f948e37db22d6e945a5311f0f7036e52f7fc936
learner-content hash: 58a91a0dd0b5faeb0e601e8d5b587a0f7768a65c246530f5bb316b73b9232413
```

`english-freeze-authority.test.ts` regenerates the same 38 approved caselets and must reproduce the learner-content hash. Learner-content changes require a new human approval.

## Final freeze verification

Final freeze implementation head before this metadata-only status pin:

```text
817516fc98c06a27bc300aa73a98c628b1dc9e29
```

Serialized chapter gate:

```text
workflow run: 32075856144
chapter-gate: SUCCESS
```

Passed:

```text
strict TypeScript                          PASS
CP001–CP004 foundation proof               PASS
CP005–CP010 advanced proof                 PASS
RBI mixed-source proof                     PASS
permanent frozen QL allocation             PASS
8-QL frozen English scale proof            PASS
English query-balance/box audit            PASS
rich object/explanation audit              PASS
content-addressed human English freeze     PASS
frozen English review export               PASS
discovery review exports                   PASS
production API build                       PASS
artifact uploads                           PASS
```

Frozen review artifact from run `32075856144`:

```text
artifact id: 9303419552
name:        iop-001-english-permanent-review
archive digest:
sha256:87b9e4bddd896d75d7406b97bbeb91e167b4ffdbdecf45c5c86f2adde9e3cd65
```

## Frozen review volume

```text
English scaled caselets          96
English scaled children         384
English review caselets          38
English review questions        152
solve modes                        8
rich object/explanation audit   PASS
box visible arithmetic          PASS
```

Query distribution:

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

## Next gate

**Hindi/Punjabi localization over the frozen English authority.**

Localization may now begin, but it must pass semantic parity and human-language review/freeze independently.

Question Studio, Question Bank, test/mock delivery, public publication, PR merge and automatic activation remain outside this approval and stay locked.
