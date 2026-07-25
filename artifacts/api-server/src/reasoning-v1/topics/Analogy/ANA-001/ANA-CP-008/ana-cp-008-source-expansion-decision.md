# ANA-CP-008 Source Expansion Decision

Status: **NON-QL PILOT EXPANSION — PERMANENT COUNTS REMAIN OPEN**

## Recovered readable patterns

### Shared-delta cluster-number transform

```text
PL36 : UQ41 :: MI49 : RN54
```

All letters and the whole number move by `+5`.

Decision:

```text
Admit provisional authority: MIXED_CLUSTER_NUMBER_SHARED_DELTA
```

Pilot domain:

- 2..6 uppercase letters;
- one nonzero signed delta;
- same delta on every letter and whole number;
- bounded whole-number result;
- no digit decomposition.

### Coupled digit-sum-square successor

```text
21I : 22P :: 13P : 14Y
```

The number increases by one. The attached letter equals the alphabet letter at the square of the number's digit sum.

Decision:

```text
Admit provisional authority: MIXED_NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR
```

Pilot domain:

- number-first token shape;
- input letter must satisfy the invariant;
- number step exactly `+1` from readable evidence;
- input and output squared digit sums within `1..26`;
- output letter must change.

### Progressive mixed-cluster vector

```text
ZKX102 : UHW204 :: XYR126 : OVU252 :: LST305 : QPI610
```

The number doubles, but the letter vector changes with evidence-pair index.

Decision:

```text
Delegate to ANA-CP-009 advanced/meta analogy
```

Reason:

- no single stable pair-local letter transform;
- target requires comparing several complete pairs;
- the transform itself progresses across evidence positions.

CP-008 retains only the typed token and arithmetic foundations needed by CP-009.

## Foundation change

Added canonical token shape:

```text
NUMBER_LETTER
```

Examples:

```text
21I
22P
13P
14Y
```

It is distinct from `LETTER_NUMBER` and receives its own canonical key and parser branch.

## Revised pilot inventory

```text
Provisional authorities: 5
Contexts: 60
Readable fixtures: 6
Token shapes: 6
Permanent QLs: none
Permanent solve modes: none
```

## Freeze consequence

The old 16-QL reservation still cannot be frozen. Source expansion proves that:

- answer shape matters independently of shared arithmetic;
- single-letter, cluster, and number-first mixed tokens create distinct task contracts;
- coupled and independent transforms must not be merged merely to preserve a preassigned count;
- advanced cross-pair progression belongs outside CP-008.

The next allocation proposal must be derived after the expanded CI proof and remaining source-gap audit.
