# ALP-001 CP-001–CP-005 Implementation Report

## Implemented

- 104 continuous QLs, `ALP-QL-001` through `ALP-QL-104`;
- five checkpoint registries;
- deterministic seeded generation;
- independent solver for every QL;
- explicit-operation ambiguity audit;
- four unique options with balanced answer placement;
- English, Hindi and Punjabi stems and explanations;
- declarative alphabet transformations;
- stable occurrence-aware word transformations;
- chapter and checkpoint generation entry points;
- chapter-local Question Studio discovery adapter;
- English, localization and checkpoint audits;
- Markdown review exporter.

## Local execution performed

Strict TypeScript compilation completed successfully.

```text
English chapter audit: 104 QLs × 80 seeds = 8,320 states
answer positions: [2080, 2080, 2080, 2080]
repeated-letter inverse states: 184

Localized parity audit: 104 QLs × 30 seeds × 2 locales = 6,240 states
locales: hi-IN, pa-IN

ALP-CP-001: 480 states
ALP-CP-002: 720 states
ALP-CP-003: 640 states
ALP-CP-004: 1,120 states
ALP-CP-005: 1,200 states
```

All listed local audit runs completed successfully.

## Assertions covered

QL continuity and allocation, determinism, independent solver parity, ambiguity acceptance, option uniqueness, single-answer behaviour, perfect aggregate answer-position balance, transformed-sequence reconstruction, transformed-word reconstruction, repeated-letter occurrence handling, locale parity, Devanagari/Gurmukhi script presence, unresolved-placeholder rejection, internal-ID rejection and Punjabi terminology rejection.

## Not yet claimed

- repository-wide CI success;
- native-language editorial approval;
- central Question Studio UI wiring outside the chapter adapter;
- production freeze.

The implemented QLs remain `IMPLEMENTED`, not `FROZEN`.
