# Multilingual Realization Architecture

## Principle

The multilingual layer consumes semantic editorial intents. It does not translate
English text. The realization path is:

reasoning graph -> English editorial realization -> semantic intent extraction
-> language renderer.

English remains the stable V1 baseline. Hindi and Punjabi render labels,
transitions, endings, shortcut headings, and compact coaching narration from
intent keys.

## Stable Intent Contracts

Examples:

- `label.vote_margin`
- `label.valid_votes`
- `label.remaining_votes`
- `label.pass_mark_gap`
- `label.population_after_growth`
- `transition.therefore`
- `transition.hence`
- `transition.so`
- `shortcut.total_votes`
- `shortcut.total_marks`
- `shortcut.final_population`
- `ending.final_answer`
- `ending.required_value`

English strings are not localization keys. Multilingual renderers must consume
these semantic intents and contextual parameters.

## Renderer Contract

Each renderer implements:

```ts
interface LanguageRenderer {
  language: LanguageCode;
  renderIntent(intent: EditorialIntent, context: LocalizationContext): string;
}
```

Renderers are deterministic. Missing localization falls back to English intent
text and surfaces validator warnings.

## Equation Preservation

Equations, numbers, arithmetic operators, ratios, and percentages remain
universal. They are never localized or reordered by language renderers.

## Hindi And Punjabi Scope

Phase 4.1 implements label-level realization for Hindi and Punjabi:

- labels
- transitions
- endings
- shortcut headings
- compact contextual narration

Full native-language question stems and complete prose realization are future
phases.

## Validator Guarantees

The localization validator protects against:

- untranslated English leakage in localized narration
- equation corruption
- mixed-script rendering
- missing localization intents
- unsafe fallback usage

## Fallback Behavior

If a renderer cannot resolve an intent, it returns the English fallback text.
This keeps runtime safe but marks the sample with fallback warnings so QA can
detect incomplete language coverage.

