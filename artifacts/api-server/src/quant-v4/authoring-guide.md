# PLATFORM-INF-002 Authoring Guide

Use the shared education layer when a teaching move is reusable across Quant V4 chapters.

## Rule

Chapter files should not duplicate reusable educational knowledge. Prefer references to shared education assets when possible.

## Asset ID families

- Strategy: `STRAT-{TOPIC}-{NUMBER}`
- Mental shortcut: `MSC-{TOPIC}-{NUMBER}`
- Exam trap: `TRAP-{TOPIC}-{NUMBER}`
- Realism context: `REAL-{DOMAIN}-{NUMBER}`
- Terminology: `TERM-{NUMBER}`
- Pedagogy rule: `PED-{NUMBER}`

## Future traceability shape

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

## Detailed guide

See:

```text
shared/education/authoring-guide.md
```
