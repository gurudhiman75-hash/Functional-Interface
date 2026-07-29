# ALP-001 — Alphabet Test Chapter Manifest

Status: complete review-only implementation manifest for `ALP-CP-001` through `ALP-CP-010`.

## Product identity

- Topic code: `REAS-ALP`
- Chapter ID: `ALP-001`
- Runtime family: `SYMBOLIC_SEQUENCE`
- Student title: Alphabet Test
- Examinations: SSC, Banking and Punjab state examinations
- Runtime locales: `en-IN`, `hi-IN`, `pa-IN`
- Locale mode: `TRANSLATABLE`
- Runtime version: `ALP-001-RUNTIME-V3`
- Editorial schema: `ALP-001-PEDAGOGY-V2`

The English alphabet, decimal digits and explicit symbols remain logic-neutral tokens in every locale. Hindi and Punjabi independently render the instructions, worked solution, shortcut, conclusion and option-specific trap analysis.

## Final ownership boundary

ALP-001 owns explicit position, gap, class, pair, scan and rearrangement operations over the English alphabet, letters inside one supplied word, digits inside one supplied digit row, and mixed rows of letters, digits and symbols.

The chapter does not own meaningful-word formation, dictionary ordering of multiple words, hidden coding-rule inference, next/missing-term series, mirror/water-image appearance, input-output machines or arithmetic properties of the integer represented by a digit row. Those remain with their dedicated Reasoning or Number System chapters.

## Final checkpoint allocation

| Checkpoint | QL range | Count | Scope |
|---|---:|---:|---|
| `ALP-CP-001` | `ALP-QL-001–012` | 12 | Fundamental alphabet positions |
| `ALP-CP-002` | `ALP-QL-013–030` | 18 | Relative positions, inverse offsets and explicit cyclic movement |
| `ALP-CP-003` | `ALP-QL-031–046` | 16 | Gaps, distance, midpoint and endpoint reconstruction |
| `ALP-CP-004` | `ALP-QL-047–074` | 28 | Explicit modified-alphabet arrangements |
| `ALP-CP-005` | `ALP-QL-075–104` | 30 | Positions and explicit rearrangement within a word |
| `ALP-CP-006` | `ALP-QL-105–110` | 6 | Alphabet-gap pair relations inside words |
| `ALP-CP-007` | `ALP-QL-111–118` | 8 | Explicit letter-class transformations |
| `ALP-CP-008` | `ALP-QL-119–130` | 12 | Digit positions, digit-pair gaps and digit-row rearrangement |
| `ALP-CP-009` | `ALP-QL-131–144` | 14 | Alphanumeric and symbol sequence scanning |
| `ALP-CP-010` | `ALP-QL-145–156` | 12 | Mixed-sequence rearrangement and composite scans |

Final implemented range: `ALP-QL-001` through `ALP-QL-156`.

The 52 new identities were allocated only after source recovery, direct/inverse audit, answer-semantic audit, representation audit, cross-chapter ownership review and merge/split compression. They were not reserved as a quota before discovery.

## Runtime contracts

Every generated question requires deterministic seeded construction, canonical explicit-operation evaluation, independent result verification, unique-condition and boundary validation, exactly four unique options, exactly one marked answer, misconception-owned wrong options, all answer positions across the proof corpus, state-derived difficulty, three-language token parity, four-tier teacher presentation and no lifecycle exposure outside the chapter-local review adapter.

## Current lifecycle boundary

```text
maturity:                    IMPLEMENTED_CHAPTER_COMPLETE_REVIEW
questionStudioDiscoverable:  chapter-local adapter only
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

A formal editorial approval/freeze and any central Question Studio, Question Bank, mock-test or public activation remain separate controlled steps.
