# TMW-CP-009 Multilingual Editorial Review

Status: **assistant editorial review complete; human approval pending**.

Reviewed implementation and verified proof head:

```text
d39463f5ffa6bb7e75ce96e60dd6dd93a8bdfea7
```

## Scope

- QL range: `TMW-QL-157..TMW-QL-174`
- QLs: `18`
- Hindi/Punjabi rows: `36`
- Dedicated all-seed packages: `18 × 20 × 2 = 720`
- Permanent editorial-review packages: `18 × 12 × 2 = 432`
- Hindi distinct stems: `248`
- Punjabi distinct stems: `248`

## Accepted remediation

- replaced broad signed-flow explanations with a separate teaching method for every one of the 18 solve modes;
- taught inlet rates as positive contribution and outlet/leak rates as subtraction through direct natural-language instructions rather than abstract sign terminology;
- distinguished filling-time and emptying-time rate construction;
- taught changed tank fraction as net rate × active duration;
- isolated missing inlet, outlet and leak rates from a known combined result before taking the reciprocal;
- taught identical-pipe count through one-pipe time ÷ target time;
- separated capacity, flow-rate and time relationships and made unit conversion explicit;
- handled non-empty starting levels through the actual remaining or removable fraction;
- formed final tank level from the initial level plus signed stage change;
- preserved requested order in tank-capacity and pipe-efficiency ratios;
- distinguished remaining efficiency from blockage percentage;
- determined level direction from aggregate rates rather than pipe count;
- required both correct direction and sufficient available time in boundary-feasibility questions;
- replaced generic shortcut headings with 18 method-specific Hindi headings and 18 method-specific Punjabi headings;
- rewrote all misconception explanations to identify the exact distractor error;
- removed technical phrases such as pipe record, signed rate and magnitude from student-facing text;
- normalized governed duration forms after editorial rewriting;
- prevented duplicated fraction subjects, duplicated pipe-count nouns and level-gender mismatches in conclusions;
- preserved English parameters, formulas, answer values, options, correct indices, misconception identities and mathematical fingerprints.

## Verified evidence

Dedicated CP-009 workflow:

```text
Run: 31156789489
Artifact: 8985461237
Digest: sha256:0531655ee3b38e91444c0af9a22affddca7709cce250684ed35c1fb2a1ef2509
Result: PASS
```

Cumulative CP-001 through CP-009 editorial workflow:

```text
Run: 31156789499
Artifact: 8985462787
Digest: sha256:709068aff275d01d79de92baf2a6df17ef28b5466ba9497a1821c03b9f187e82
Reviewed QLs: 174
Native rows: 348
Deterministic native packages: 4,176
Result: PASS
```

Complete multilingual chapter parity:

```text
Run: 31156789468
Artifact: 8985462886
Digest: sha256:2e61c36d2cbe9a6b3ba3fed55d5525b7abd628ab405b5ebd5f728b4904832a5f
English packages: 2,532
Localized packages: 5,064
Invalid localized packages: 0
Publishable localized packages: 0
Result: PASS
```

## Lifecycle boundary

This assistant review does not record product-owner or native-speaker approval. Every localized row remains:

```text
editorialStatus: PENDING
publiclyPublishable: false
review state: AWAITING_HUMAN_REVIEW
```

No multilingual manual freeze, Question Studio integration or publication eligibility is asserted.
