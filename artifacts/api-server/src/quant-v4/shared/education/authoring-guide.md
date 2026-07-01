# Quant V4 Education Layer Authoring Guide

## Authoring rule

Do not put reusable teaching knowledge directly inside a chapter if it can be shared across chapters.

A chapter may still contain topic-specific explanation logic, but shared teaching moves should reference this layer.

## Adding a strategy

Add a strategy when a reusable solving approach appears across multiple canonical problems or chapters.

Required fields:

- `id`
- `topic`
- `title`
- `description`
- `applicableCPs`
- `difficulty`
- `reusableExamples`

ID pattern:

```text
STRAT-{TOPIC}-{NUMBER}
```

Example:

```json
{
  "id": "STRAT-TW-001",
  "topic": "time-work",
  "title": "Total work equals LCM",
  "description": "Choose total work as the LCM of individual times to get integer efficiencies.",
  "applicableCPs": ["TW-*"],
  "difficulty": "foundation",
  "reusableExamples": []
}
```

## Adding a shortcut

Add a shortcut only when it is valid, memorable, and useful in timed exams.

ID pattern:

```text
MSC-{TOPIC}-{NUMBER}
```

Avoid adding shortcuts that work only for one narrow generated parameter unless they are tagged as topic-specific.

## Adding a trap

A trap must include:

- misconception;
- why it happens;
- correction.

ID pattern:

```text
TRAP-{TOPIC}-{NUMBER}
```

Trap writing should be corrective, not blaming.

## Adding a realism context

A realism context should include natural quantities so future renderers can avoid mismatched units.

ID pattern:

```text
REAL-{DOMAIN}-{NUMBER}
```

Good context:

```text
warehouse stock: cartons, items, damaged units, remaining units
```

Bad context:

```text
random number story
```

## Adding terminology

Terminology entries should prefer plain student-facing wording.

ID pattern:

```text
TERM-{NUMBER}
```

Each entry should include preferred wording, phrases to avoid, rationale, and examples.

## Adding pedagogy rules

Pedagogy rules should be standards that can later become review or maturity checks.

ID pattern:

```text
PED-{NUMBER}
```

A rule should include:

- principle;
- do list;
- avoid list;
- appliesTo;
- enforcementStage.

## Using references in future chapters

Do not block a package if references are absent during soft migration. When adding references, prefer the nested form:

```ts
education: {
  strategyIds: ["STRAT-PCT-001"],
  shortcutIds: ["MSC-PCT-002"],
  trapIds: ["TRAP-PCT-001"],
  realismIds: ["REAL-RETAIL-001"],
  terminologyIds: ["TERM-001"],
  pedagogyRuleIds: ["PED-003"]
}
```

Then normalize with:

```ts
buildQuantV4EducationTraceability(traceability)
```

or merge into existing traceability with:

```ts
mergeQuantV4EducationTraceability(traceability, traceability)
```

## Review checklist

Before promoting education assets:

- IDs are unique.
- Topic names match `QuantV4EducationTopic`.
- Wording is reusable beyond one generated question.
- Examples are short and exam-realistic.
- No chapter solver logic is embedded in shared education files.
- No Percentage content was migrated unintentionally.
