# PLATFORM-INF-003 Design — Educational Rendering Engine

Date: 2026-06-26
Scope: Quant V4 shared educational rendering platform.

## Mission

The Educational Rendering Engine (ERE) converts mathematical reasoning into reusable, consistent, high-quality educational explanations. It consumes PLATFORM-INF-001 canonical answer infrastructure and PLATFORM-INF-002 educational intelligence. It does not redesign either platform.

## Target pipeline

```text
Parameter Generator
↓
Solver
↓
Reasoning Graph
↓
Educational Rendering Engine
↓
MathJax / Markdown / Future Renderers
↓
Student Explanation
```

## Core principle

Chapter-specific explanation renderers should gradually stop owning generic teaching logic. Chapters own math. The ERE owns teaching composition.

## New files

```text
shared/education/renderer-contracts.ts
shared/education/strategy-resolver.ts
shared/education/shortcut-resolver.ts
shared/education/trap-resolver.ts
shared/education/pedagogy-resolver.ts
shared/education/terminology-resolver.ts
shared/education/math-illustration-builder.ts
shared/education/explanation-composer.ts
shared/education/education-renderer.ts
```

Supporting internal utility:

```text
shared/education/resolver-utils.ts
```

## Input contracts

The ERE accepts:

- reasoning graph-like objects;
- optional education traceability references;
- canonical or legacy answer values;
- shared education assets;
- topic, CP, task kind, stem, and metadata.

All references are optional. Missing assets produce safe fallback explanations.

## Output contract

The ERE produces `EducationalExplanation`:

- `introduction`
- `teachingSteps[]`
- `mathIllustrations[]`
- `shortcutBlocks[]`
- `trapWarnings[]`
- `recap`
- `finalAnswer`
- `blocks[]`
- `knowledgeLinks[]`

## Resolver responsibilities

### Strategy Resolver

Resolves explicit `strategyIds`, orders strategies, supports prerequisite links, and falls back to inferred or generic strategy.

### Shortcut Resolver

Finds explicit, related, or inferred shortcuts. Shortcuts support the main explanation but never replace it.

### Trap Resolver

Adds warnings only when explicit, related, or detected through hints/tags.

### Pedagogy Resolver

Selects rules such as concrete-to-abstract, explanation-first, multiplier-before-algebra, and unit discipline.

### Terminology Resolver

Applies preferred wording by replacing configured avoided phrases with canonical terms.

### Math Illustration Builder

Creates a mathematical consequence for each reasoning node and uses MathJax implication form:

```text
\[ expression \Rightarrow consequence \]
```

It supports numeric, percentage, fraction, ratio, currency, unit, equation, and symbolic illustrations.

### Explanation Composer

Merges strategy, pedagogy, terminology, shortcuts, traps, reasoning graph, math illustrations, and answer into ordered educational blocks.

### Education Renderer

Presentation-independent renderer for:

- structured blocks;
- Markdown;
- MathJax;
- HTML;
- future PDF payloads;
- future Flutter/mobile card payloads.

## Knowledge graph support

Assets can reference each other through `EducationalKnowledgeLink`:

- `uses`
- `supports`
- `warns-about`
- `phrased-by`
- `governed-by`
- `prerequisite`
- `related`

The composer also emits derived links from selected strategies to shortcuts, traps, pedagogy rules, and terminology.

## Review metadata

The renderer contract supports review metadata on educational assets and generated blocks:

- `author`
- `reviewer`
- `reviewStatus`
- `reviewDate`
- `version`
- `confidence`

## Localisation readiness

The ERE does not implement Hindi/Punjabi. It keeps titles, descriptions, examples, block text, and render targets structured so localization can be added later without redesign.

## Backward compatibility

- Existing chapters are not modified.
- Existing explanation renderers remain active.
- ERE accepts legacy answer strings/numbers through the INF-001 answer adapter.
- Education traceability remains optional.
- Shared JSON libraries are not hard-required at runtime.

## Migration path

Future chapters can call `composeEducationalExplanation()` or `renderEducationalExplanationFromInput()` after solver/reasoning graph generation. Existing chapters should migrate only during scheduled chapter work.
