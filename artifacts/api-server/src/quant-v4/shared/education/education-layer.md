# Quant V4 Shared Education Layer

## Purpose

The shared education layer stores reusable teaching intelligence that should not be duplicated across hundreds of chapter explanations.

It is a platform capability, not a chapter implementation.

## Library inventory

| File | Purpose |
|---|---|
| `strategy.library.json` | Reusable solving strategies across Quant topics. |
| `mental-shortcuts.library.json` | Competitive exam shortcuts and mental math moves. |
| `exam-traps.library.json` | Common misconceptions, why they happen, and corrections. |
| `realism.library.json` | Realistic context domains and natural quantities. |
| `terminology.library.json` | Preferred educational wording and phrases to avoid. |
| `pedagogy.library.json` | Teaching standards for explanations and review. |
| `contracts.ts` | Versioned TypeScript contracts for all libraries. |
| `traceability-adapter.ts` | Optional adapter for chapter references to shared education assets. |

## Intended consumers

- Future chapter renderers.
- Explanation generators.
- Question Studio authoring tools.
- Coverage/maturity auditors.
- Human-review exports.
- Future multilingual educational alignment tools.

## Non-goals

- It does not replace solvers.
- It does not replace validators.
- It does not generate new Percentage content.
- It does not enforce migration immediately.
- It does not make chapter packages depend on education assets at runtime.

## Recommended usage

A future explanation renderer should:

1. Solve the problem using chapter-owned math.
2. Select strategy/trap/shortcut IDs based on CP and task kind.
3. Use platform terminology and pedagogy rules while rendering.
4. Emit optional education traceability.
5. Keep the final answer tied to the canonical answer contract from PLATFORM-INF-001.

## Example future traceability

```ts
traceability: {
  canonicalProblemId: "PCT-003-CP-004",
  taskKind: "successive-change",
  education: {
    strategyIds: ["STRAT-PCT-001"],
    shortcutIds: ["MSC-PCT-002"],
    trapIds: ["TRAP-PCT-001"],
    realismIds: ["REAL-RETAIL-001"],
    terminologyIds: ["TERM-001", "TERM-002"],
    pedagogyRuleIds: ["PED-003", "PED-004"]
  }
}
```

## Quality principle

The same mathematical solution can be taught in many ways. Quant V4 should make that teaching layer reusable, auditable, and consistent across chapters.
