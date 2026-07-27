# ANA-CP-009 Coupled-Invariant Pilot Result

Status: **FORMAL PILOT COMPLETE — FIXTURE QUARANTINED**.

## Fixture

```text
SL23 : RY11 :: MB39 : HS27 :: EW26 : ?
Options: BL40, CK44, CK40, BL44
Published answer: CK40
```

The available text explanation supplies two visible conditions:

1. the sum of the two letter positions and the attached number is `54` for every cluster;
2. if the first letter moves backward by `k`, the second letter moves forward cyclically by `k + 12`.

The reference pairs fit this description:

```text
SL23 → RY11 uses k = 1
MB39 → HS27 uses k = 5
```

## Mechanical result

For target `EW26`, the pilot enumerates every `k` from `1` through `25`, applies the stated cyclic movements, and derives the output number from the shared total.

This produces **25 valid outputs** under the text rule.

Most importantly, two published options satisfy the same stated conditions:

```text
k = 2 → CK40
k = 3 → BL40
```

Both preserve:

```text
position(letter 1) + position(letter 2) + number = 54
```

and both preserve the stated movement-gap relationship.

The observed reference steps `1` and `5` also do not establish target step `2` through a simple arithmetic progression.

## Verdict

The fixture cannot support a permanent generator from the currently recoverable prose alone.

This does **not** prove the official question itself was invalid. The original diagram or source solution may contain another condition that is absent from the text mirror. It proves only that the available explanation is insufficient for ExamTree's uniqueness and independent-solver requirements.

The source fixture is therefore reclassified from `ADMIT_FORMAL_PILOT` to `QUARANTINE_AMBIGUOUS_FIXTURE`.

## Re-admission requirements

Before this family can return to pilot status, recover evidence that supplies an additional condition capable of distinguishing `CK40` from `BL40`, such as:

- a precise progression governing `k` across pairs;
- a directional constraint not captured by the current prose;
- another component relation shown in the original diagram;
- a recurring official fixture proving the same complete grammar.

## Safety

- permanent QLs assigned: `0`;
- generator status: prohibited;
- locale templates: prohibited;
- Question Studio/public exposure: prohibited.
