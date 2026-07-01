# Quant V4 Educational Knowledge Graph

## Purpose

The Educational Rendering Engine supports relationships between educational assets so future renderers can move from a strategy to related shortcuts, traps, pedagogy rules, and terminology without hard-coding those links inside chapters.

## Contract

Knowledge links use:

```ts
interface EducationalKnowledgeLink {
  sourceId: string;
  targetId: string;
  relation:
    | "uses"
    | "supports"
    | "warns-about"
    | "phrased-by"
    | "governed-by"
    | "prerequisite"
    | "related";
  rationale?: string;
}
```

## Example

```ts
{
  sourceId: "STRAT-PCT-001",
  targetId: "MSC-PCT-002",
  relation: "supports",
  rationale: "The percentage multiplier strategy can be accelerated when 25% is recognized as one-fourth."
}
```

## Resolver usage

- Strategy resolver reads `prerequisite` links.
- Shortcut resolver reads `supports` links.
- Trap resolver reads `warns-about` links.
- Pedagogy resolver reads `governed-by` links.
- Terminology resolver reads `phrased-by` links.

## Composer output

The explanation composer emits both supplied links and derived links from selected strategies to the assets used in the explanation. This makes every generated explanation auditable.

## Migration status

No chapter is required to emit knowledge links yet. The graph support is available for future enrichment and authoring tools.
