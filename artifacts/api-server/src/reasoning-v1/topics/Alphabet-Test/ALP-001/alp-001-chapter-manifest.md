# ALP-001 — Alphabet Test Chapter Manifest

Status: audited implementation manifest for CP-001 through CP-005.

## Product identity

- Topic code: `REAS-ALP`
- Chapter ID: `ALP-001`
- Runtime family: `SYMBOLIC_SEQUENCE`
- Student title: Alphabet Test
- Examinations: SSC, Banking and Punjab state examinations
- Runtime locales: `en-IN`, `hi-IN`, `pa-IN`
- Locale mode: `TRANSLATABLE`
- Runtime version: `ALP-001-RUNTIME-V1`

The English alphabet remains `A–Z` in all locales. Hindi and Punjabi localize instructions, explanations and labels.

## Ownership boundary

ALP-001 owns explicit operations over alphabet positions, alphabet intervals, explicitly modified alphabet orders and positions inside a supplied word. It excludes hidden code-rule inference, analogy completion, next-term series, dictionary ordering of multiple words, mirror/water appearance and odd-one-out clusters.

## Frozen CP-001–CP-005 allocation

| Checkpoint | QL range | Count | Scope |
|---|---:|---:|---|
| `ALP-CP-001` | `ALP-QL-001–012` | 12 | Fundamental alphabet positions |
| `ALP-CP-002` | `ALP-QL-013–030` | 18 | Relative positions, inverse offsets and explicit cyclic movement |
| `ALP-CP-003` | `ALP-QL-031–046` | 16 | Gaps, distance, midpoint and endpoint reconstruction |
| `ALP-CP-004` | `ALP-QL-047–074` | 28 | Fourteen declarative alphabet transformations, each with direct and inverse queries |
| `ALP-CP-005` | `ALP-QL-075–104` | 30 | Position and explicit rearrangement within a word |

Total implemented range: `ALP-QL-001` through `ALP-QL-104`.

## Runtime contracts

Each generated question has deterministic seeded construction, an independent solution, explicit-operation ambiguity validation, exactly four unique options, one marked correct answer, a value-grounded explanation and locale parity. Repeated letters are tracked by occurrence identity rather than letter value alone.

## Remaining chapter scope

Later checkpoints require fresh source discovery for alphabet-pair formation inside words, explicit letter-class transformations, mixed alpha-numeric-symbol sequence scanning, mixed-sequence rearrangement and composite tasks. No later QL ranges are reserved by this manifest.
