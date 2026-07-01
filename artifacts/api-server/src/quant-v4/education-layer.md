# PLATFORM-INF-002 Education Layer

The shared educational intelligence layer lives at:

```text
shared/education/
```

It separates mathematics from teaching. Chapters continue to own solvers, validators, reasoning graphs, and mathematical contracts. The platform owns reusable teaching assets.

## Assets

- `shared/education/strategy.library.json`
- `shared/education/mental-shortcuts.library.json`
- `shared/education/exam-traps.library.json`
- `shared/education/realism.library.json`
- `shared/education/terminology.library.json`
- `shared/education/pedagogy.library.json`
- `shared/education/contracts.ts`
- `shared/education/traceability-adapter.ts`

## Usage

Future chapters may reference education assets through optional traceability IDs:

- `strategyIds`
- `shortcutIds`
- `trapIds`
- `realismIds`
- `terminologyIds`
- `pedagogyRuleIds`

No existing chapter is required to emit these references yet.

## Detailed documentation

See:

```text
shared/education/education-layer.md
```
