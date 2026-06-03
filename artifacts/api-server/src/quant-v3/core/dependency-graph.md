# Quant V3 Dependency Graph

Allowed ownership direction:

```text
Topic -> Subtopic -> Archetype -> Owned Modules
```

Allowed Phase 0 dependencies:

- `core/types.ts` may be imported by topic configs.
- Topic configs may contain identity metadata only.
- Empty registries may depend on structural types.

Future archetype-owned modules may depend inward on their own canonical shape. They should not depend sideways on sibling archetypes by default.

Prohibited by design:

- `GlobalExplanationEngine`
- `GlobalStemEngine`
- `GlobalShortcutEngine`
- `GlobalDistractorEngine`
- global scenario pools
- global archetype fallback renderers
- shared educational templates by default

Quant V3 must not import Quant V2 generation logic during Phase 0.

