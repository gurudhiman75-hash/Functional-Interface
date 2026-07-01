# Educational Rendering Engine

## What it is

The Educational Rendering Engine is the future shared explanation pipeline for Quant V4. It takes mathematical reasoning and educational asset references, then produces structured explanation blocks that can be rendered into Markdown, MathJax, HTML, PDF, mobile cards, or future UI formats.

## Pipeline

```text
Reasoning Graph
↓
Strategy Resolver
↓
Pedagogy Resolver
↓
Terminology Resolver
↓
Shortcut Resolver
↓
Trap Resolver
↓
Math Illustration Builder
↓
Explanation Composer
↓
Education Renderer
```

## Inputs

- `reasoningGraph`
- `educationTraceability`
- `answer` or `canonicalAnswer`
- `assets`
- `stem`
- `topic`
- `canonicalProblemId`
- `taskKind`

## Outputs

Primary structured object:

```ts
EducationalExplanation
```

It contains:

- introduction;
- teaching steps;
- math illustrations;
- shortcut blocks;
- trap warnings;
- recap;
- final answer;
- renderable blocks;
- knowledge links.

## Rendering targets

Supported now:

- `blocks`
- `markdown`
- `mathjax`
- `html`

Prepared for future:

- `pdf`
- `flutter-card`

## Compatibility

ERE is not wired into active chapters yet. It is a platform capability that future chapters can opt into. Current chapter-specific explanation renderers continue to work.

## Public entry points

```ts
composeEducationalExplanation(input)
renderEducationalExplanation(explanation, target)
renderEducationalExplanationFromInput(input, target)
```

## Design constraints

- Never require all educational references.
- Never replace the primary solution with a shortcut.
- Never output raw formula dumps without context.
- Every teaching step should have a mathematical consequence where possible.
- Keep presentation targets independent from explanation composition.
