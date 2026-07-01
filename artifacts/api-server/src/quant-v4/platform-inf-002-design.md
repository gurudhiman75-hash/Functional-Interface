# PLATFORM-INF-002 Design — Shared Educational Intelligence Layer

Date: 2026-06-26
Scope: Quant V4 shared platform education layer.

## Mission

PLATFORM-INF-002 separates mathematics from teaching. A chapter owns solver logic, validator logic, mathematical reasoning graphs, and topic-specific runtime behavior. The platform owns reusable educational intelligence: strategies, shortcuts, traps, realism contexts, terminology, and pedagogy standards.

This layer builds on PLATFORM-INF-001. It does not redesign the canonical answer contract, option generation, package archive mechanism, shared content libraries, or maturity framework.

## Architecture

New root:

```text
artifacts/api-server/src/quant-v4/shared/education/
```

The directory contains:

- `contracts.ts`: versioned TypeScript interfaces for education libraries and traceability.
- `traceability-adapter.ts`: optional adapter for chapter references such as `strategyIds`, `shortcutIds`, `trapIds`, `realismIds`, and `terminologyIds`.
- `index.ts`: public barrel export.
- `strategy.library.json`: reusable solving strategies.
- `mental-shortcuts.library.json`: competitive exam shortcuts.
- `exam-traps.library.json`: misconception and correction library.
- `realism.library.json`: realistic educational contexts.
- `terminology.library.json`: canonical wording rules.
- `pedagogy.library.json`: teaching principles and review standards.

## Ownership boundary

### Chapter-owned

- Mathematical model.
- Solver.
- Validator.
- Reasoning graph.
- Canonical problem taxonomy.
- Topic-specific edge cases.

### Platform-owned

- Reusable solving strategy language.
- Common shortcuts and mental math patterns.
- Common exam traps and corrections.
- Realistic domains and natural quantities.
- Canonical educational wording.
- Pedagogy standards.
- Optional traceability references.

## Contract design

The contract version is defined as:

```ts
QUANT_V4_EDUCATION_CONTRACT_VERSION = "1.0.0"
```

Core interfaces:

- `Strategy`
- `MentalShortcut`
- `ExamTrap`
- `RealismContext`
- `TerminologyEntry`
- `PedagogyRule`
- `QuantV4EducationReferenceSet`
- `QuantV4EducationTraceability`

The references are intentionally optional and additive. Existing chapters do not need to emit them.

## Traceability

Future chapters may attach:

```ts
{
  education: {
    strategyIds: ["STRAT-PCT-001"],
    shortcutIds: ["MSC-PCT-002"],
    trapIds: ["TRAP-PCT-001"],
    realismIds: ["REAL-SALARY-001"],
    terminologyIds: ["TERM-001"],
    pedagogyRuleIds: ["PED-003"]
  }
}
```

The adapter normalizes these references and emits `educationTraceability` only when references exist.

## Backward compatibility

No runtime code imports this layer automatically. Existing packages continue unchanged. The layer is available for future enrichment, authoring tools, auditors, and migration tasks.

## Future enforcement

This task does not enforce educational references. Later platform phases can:

1. require education references for new packages;
2. add audit checks for invalid IDs;
3. include education diversity in `CONTENT_READY` maturity;
4. use pedagogy rules during human review;
5. generate explanation templates from shared strategies and terminology.
