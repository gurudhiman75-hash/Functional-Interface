# CAE-001 — Cause and Effect

## Current decision

CAE-001 uses a deterministic, graph-first, generative causal-state engine. It remains review-only in Question Studio; it cannot write to the question bank or appear in tests, mocks, or public delivery.

The implementation separates the complete canonical causal world from the learner-visible context. A generated question selects one compatible scenario family, one variant, and one graph substructure before it renders options. Option shuffling is the final presentation step, not the source of variation.

```text
provisional plan → scenario family → canonical graph state → visible context → solver → distractors → explanation → locale rendering
```

The full V3 architecture, current QL-discovery policy, review samples, and semantic-saturation evidence are in [CAE-001-ARCHITECTURE-CHECKPOINT.md](./CAE-001-ARCHITECTURE-CHECKPOINT.md) and [CAE-001-SATURATION-REPORT.md](./CAE-001-SATURATION-REPORT.md).

## Guardrails retained

- Directed graph solver, cycle/temporal validation, deterministic seed replay, and locale-shared semantic state.
- Possible/probable distinction: the graph-supported option must uniquely fit causal timing, distance, scope, and magnitude.
- Question Studio review integration only; bank persistence remains locked.
- No QL count or allocation freeze: current IDs are discovery candidates pending source saturation and editorial review.
- No further checkpoint or causal-family expansion until the architecture checkpoint is reviewed.
