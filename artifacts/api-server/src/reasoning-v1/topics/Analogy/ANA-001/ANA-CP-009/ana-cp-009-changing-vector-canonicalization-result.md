# ANA-CP-009 Changing-Vector Canonicalization Result

Status: **QUARANTINE — OPTION-DEPENDENT META RULE — ZERO QLS**

## Source fixture

SSC GD Constable 2026, 20 May 2026 Shift 2:

```text
ZKX102 : UHW204 :: XYR126 : ? :: LST305 : QPI610
Options: OWU252, OUU232, OVU252, UVO242
Published answer: OVU252
```

A newly recoverable multilingual solution exposes the displayed letter shifts:

```text
ZKX → UHW: −5, −3, −1
XYR → OVU: −9, −3, +3
LST → QPI: +5, −3, −11
number: ×2 in all three pairs
```

Represented as forward cyclic shifts in `0..25`, the vectors are:

```text
[21, 23, 25]
[17, 23,  3]
[ 5, 23, 15]
```

Each vector is a modular arithmetic progression:

```text
start: 21, 17, 5
step:   2,  6, 18
```

The published target can therefore be described by a compact candidate grammar:

```text
vector step: 2 → 6 → 18       (×3 modulo 26)
start decrement: 4 → 12       (×3)
number: ×2
```

This candidate produces `OVU252`.

## Independent ambiguity audit

The two complete anchor pairs do not uniquely force that grammar.

The audit enumerates bounded modular recurrences in which:

1. each three-position shift vector is an arithmetic progression modulo 26;
2. the vector step is multiplied by one fixed modular multiplier between pairs;
3. the decrement in the vector start is multiplied by the same multiplier;
4. both displayed anchor vectors must be reproduced exactly.

Six anchor-compatible recurrences survive. They produce four distinct middle targets:

```text
OVU252
BIH252
AVI252
NIV252
```

Only `OVU252` appears in the published option set. Therefore the options select the published answer, but the visible anchor relations do not independently establish one target under this bounded grammar class.

## Ownership decision

The fixture remains genuinely cross-pair and therefore does not fall back to CP-008. However, it is not safe as a permanent CP-009 authority because:

- its target depends on choosing one meta-recurrence among several anchor-compatible recurrences;
- no second independent fixture using the same exact recurrence grammar has been found;
- option-only uniqueness is insufficient for deterministic generation;
- an ExamTree generator must remain single-correct before options are considered.

Final verdict:

```text
QUARANTINE_OPTION_DEPENDENT_META_RULE
permanent QLs: 0
publicly publishable: false
```

## Re-admission requirements

The fixture may be reconsidered only when at least one of the following is recovered:

1. an official solution that explicitly states the start-and-step recurrence;
2. a second independent exam fixture using the same recurrence grammar;
3. an additional visible condition that eliminates all competing middle vectors before options are considered.
