# TRG-002 QL Allocation Ledger

Status: **Phase 0 allocation lock**. This reserves every production English QL ID and its application family. Runtime stems, diagrams and solvers are implemented later.

Package target: **96 English QLs**.

## TRG-CP-007 — Single-Observation Elevation & Depression

| QL range | Count | Locked family |
|---|---:|---|
| `TRG-002-QL-001...006` | 6 | Height from elevation angle + horizontal distance |
| `TRG-002-QL-007...011` | 5 | Horizontal distance from elevation angle + height |
| `TRG-002-QL-012...014` | 3 | Standard angle from clean height-distance relation |
| `TRG-002-QL-015...018` | 4 | Height from depression configuration |
| `TRG-002-QL-019...022` | 4 | Horizontal distance from depression configuration |
| `TRG-002-QL-023...024` | 2 | Reverse/combined single-observation forms |

Total: **24**.

## TRG-CP-008 — Shadows, Ladders, Poles & Broken Objects

| QL range | Count | Locked family |
|---|---:|---|
| `TRG-002-QL-025...029` | 5 | Shadow → object height |
| `TRG-002-QL-030...032` | 3 | Object height → shadow length |
| `TRG-002-QL-033...035` | 3 | Changed shadow / changed solar angle |
| `TRG-002-QL-036...040` | 5 | Ladder against wall |
| `TRG-002-QL-041...044` | 4 | Broken tree/pole touching ground |
| `TRG-002-QL-045...048` | 4 | Guy wire / mast / anchor variants |

Total: **24**.

## TRG-CP-009 — Two-Observation & Moving-Point Systems

| QL range | Count | Locked family |
|---|---:|---|
| `TRG-002-QL-049...055` | 7 | Same-side two-observation systems |
| `TRG-002-QL-056...060` | 5 | Observer moves closer |
| `TRG-002-QL-061...064` | 4 | Observer moves farther |
| `TRG-002-QL-065...067` | 3 | Find original distance from two observations |
| `TRG-002-QL-068...069` | 2 | Find movement/separation |
| `TRG-002-QL-070...072` | 3 | Comparative/two-object controlled forms |

Total: **24**.

## TRG-CP-010 — Observer Height, Opposite-Side & Composite Sight-Line Systems

| QL range | Count | Locked family |
|---|---:|---|
| `TRG-002-QL-073...077` | 5 | Observer/eye-height correction |
| `TRG-002-QL-078...082` | 5 | Opposite-side observations |
| `TRG-002-QL-083...087` | 5 | Building-to-building observations |
| `TRG-002-QL-088...091` | 4 | Combined elevation + depression |
| `TRG-002-QL-092...094` | 3 | River width / horizontal-separation forms |
| `TRG-002-QL-095...096` | 2 | Composite vertical-object relations |

Total: **24**.

# Package reconciliation

| CP | QLs |
|---|---:|
| TRG-CP-007 | 24 |
| TRG-CP-008 | 24 |
| TRG-CP-009 | 24 |
| TRG-CP-010 | 24 |
| **TRG-002 total** | **96** |

## Allocation rules

- These QL ranges are reserved and contiguous.
- Moving a QL family across CP boundaries or changing CP counts requires an explicit design-lock amendment.
- Context-only substitutions are not sufficient reason to create distinct QLs.
- Each future QL implementation must map to a distinct mathematical state/question-language role within the reserved family.
- Substantive application QLs must declare a diagram strategy when implemented.
- Production activation remains false throughout build/review until explicit approval.
