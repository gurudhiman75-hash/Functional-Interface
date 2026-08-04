# MAL-CP-003 Wave 08 — External Source Recovery

Status: **authoritative for the current open-discovery frontier; not a permanent QL allocation**.

## Retrieval note

The uploaded File Library retrieval service failed repeatedly during this wave. No textbook evidence was invented. Publicly accessible competitive-exam sources were inspected separately and recorded with publisher, title, URL, retrieval date, observed task and decision impact.

## Source-backed decisions

### Equal removal quantity from final original quantity

Two direct public questions ask for the equal quantity removed in every operation when the initial original quantity, final original quantity and operation count are known. Therefore:

```text
MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL
```

is promoted from inverse-closure-only evidence to source-backed discovery. It is still not a permanent QL.

### Minimum operation count to cross a threshold

A direct public question asks for the smallest positive number of operations after which the original component becomes less than its complement. This is not the same contract as reconstructing an exact operation count from an exact final quantity.

The new candidate is:

```text
MAL-CP003-PROT-MINIMUM-OPERATIONS-TO-CROSS-ORIGINAL-QUANTITY-THRESHOLD
```

The solver uses exact rational stage simulation and returns the first operation satisfying a strict threshold. It does not use floating logarithms.

## Contracts that remain provisional

### Exact operation count from exact final quantity

```text
MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL
```

remains provisional. An exact equality target and a minimum threshold-crossing target have different answer semantics, existence rules and distractor profiles.

### Initial original quantity from final quantity

A recovered previous-year banking question reconstructs the initial complement component. It confirms the inverse initial-state family, but the requested output does not exactly match the current initial-original-component prototype. The prototype therefore remains provisional pending direct output-matched evidence or a representation merge decision.

### Unequal stages

A public worked question was found with different removal and refill quantities across stages, but it is treated only as a discovery lead. It does not yet satisfy the authority threshold for freezing the current unequal-stage prototype.

### Third-liquid composition

No adequate direct source was recovered. It remains provisional.

## Current frontier

```text
Total discovery candidates: 12
Source-backed distinct candidates: 5
Provisional candidates: 4
Representation merge candidates: 2
Excluded CP-004 boundary: 1
Permanent QLs: 0
Frozen solve modes: 0
Freeze readiness: false
```

## Delivery status

```text
Active: false
Publicly publishable: false
Question Studio discoverable: false
Question Bank writable: false
Test eligible: false
```
