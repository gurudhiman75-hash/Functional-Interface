# RNK-CP-002 Final English Discovery Freeze

Freeze version: `RNK_CP002_ENGLISH_DISCOVERY_FREEZE_V1`

Status: **English discovery frozen; eight permanent review-only QLs allocated; release surfaces locked**.

## Discovery result

```text
foundation prototypes:                  6
source/inverse prototypes:              7
combined prototypes:                   13
combined discovery questions:       3,120
frozen authorities:                     8
authority review runtime:           2,560
approved English review pack:          48
open source dimensions:                 0
```

## Permanent allocation

| QL | Frozen authority |
|---|---|
| `RNK-QL-010` | people strictly between two normalized positions |
| `RNK-QL-011` | positional gap between two normalized positions |
| `RNK-QL-012` | target rank from a reference rank and directional separation |
| `RNK-QL-013` | identify which person is nearer a requested end |
| `RNK-QL-014` | total from mixed-end ranks, between-count and known order |
| `RNK-QL-015` | minimum or maximum valid total under unknown order |
| `RNK-QL-016` | exact total or indeterminate outcome under unknown order |
| `RNK-QL-017` | relative-order status compatible with a proposed total |

Next available RNK-001 identity: `RNK-QL-018`.

## Frozen ownership snapshot

```text
AUTH-01 <- people-between same-end; people-between mixed-end with total
AUTH-02 <- same-end position gap; mixed-end position gap; inverse offset
AUTH-03 <- target rank from offset; target rank from between-count plus order
AUTH-04 <- same-end comparison; mixed-end comparison with total
AUTH-05 <- known-order mixed-end total
AUTH-06 <- unknown-order minimum/maximum total
AUTH-07 <- exact total or Cannot be determined
AUTH-08 <- proposed-total compatible order or impossible
```

Mirror directions, person-role reversal, physical context, requested end and minimum/maximum remain generated-instance parameters.

## Approved English projection

```text
sha256:e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430
```

Any change to the approved 48 learner-facing records must fail the freeze gate until explicitly reviewed again.

## Freeze conditions satisfied

- source and inverse saturation complete;
- 13-prototype executable proof complete;
- 13→8 merge/split ownership complete;
- unique high/low total branch validity proved;
- exact versus indeterminate total proved;
- proposed-total order-status outcomes proved;
- full English corpus reviewed and remediated;
- final no-new-gap matrix has zero open dimensions;
- permanent runtime delegates only to reviewed authorities;
- all delivery surfaces remain locked.

## Release boundary

```text
English discovery frozen:       true
English review-only:             true
permanent QLs:                   RNK-QL-010..017
next available ID:               RNK-QL-018
Hindi/Punjabi:                   not started
Question Studio:                 disabled
Question Bank:                   NOT_STORED
test eligibility:                INELIGIBLE
public publication:              false
```
