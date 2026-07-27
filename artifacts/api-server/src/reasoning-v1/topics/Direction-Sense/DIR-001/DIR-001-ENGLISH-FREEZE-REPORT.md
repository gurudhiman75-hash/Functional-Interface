# DIR-001 English Freeze Report

Status: English freeze implementation prepared; exact-head validation pending.

## 1. Decision

The reviewed English runtime for `DIR-001` is frozen as the localization baseline after completion and manual approval of all eight checkpoints.

This is an **English-only freeze**:

- English QL semantics, hidden-state contracts, answer demands, options, explanations and diagrams are locked;
- Hindi and Punjabi localization remain pending;
- Question Studio exposure remains pending;
- the multilingual chapter is not globally frozen.

Runtime baseline before this freeze audit:

```text
59a188ab2ecf6cfa3fcd632ba6589d0b80104594
```

Manual English approval date:

```text
2026-07-27
```

## 2. Superseded planning allocation

The early end-to-end design contained a provisional production allocation of 240 QLs. That allocation was created before implementation and is superseded by the governing need-based allocation policy in `DIR-001-CHAPTER-MANIFEST.ts`.

The final reviewed runtime contains exactly 44 materially distinct QLs:

```text
DIR-QL-001 through DIR-QL-044
```

No QL was retained or added merely to fill an earlier numeric quota.

## 3. Final checkpoint allocation

| Checkpoint | QL range | Count | Ownership |
|---|---:|---:|---|
| `DIR-CP-001` | `DIR-QL-001`–`003` | 3 | Orientation, rotation and facing |
| `DIR-CP-002` | `DIR-QL-004`–`005` | 2 | Ordered path endpoint and final facing |
| `DIR-CP-003` | `DIR-QL-006`–`010` | 5 | Distance, displacement and inverse distance |
| `DIR-CP-004` | `DIR-QL-011`–`015` | 5 | Static relation graphs and point relations |
| `DIR-CP-005` | `DIR-QL-016`–`022` | 7 | Multiple movers and endpoint comparison |
| `DIR-CP-006` | `DIR-QL-023`–`029` | 7 | Coded direction language |
| `DIR-CP-007` | `DIR-QL-030`–`035` | 6 | Sun, shadow and environmental orientation |
| `DIR-CP-008` | `DIR-QL-036`–`044` | 9 | Advanced inverse, mixed and caselet synthesis |
| **Total** | `DIR-QL-001`–`044` | **44** | Complete English runtime |

## 4. Final exhaustive gap decision

No additional English QL is justified after CP-008.

The following remain runtime variation inside existing QLs rather than separate contracts:

- longer forward paths with the same hidden-state topology and answer demand;
- different names, places, units or distances;
- cardinal versus rotated surface orientation when the solver burden is unchanged;
- alternate natural wording for the same movement or relation grammar;
- different valid Pythagorean component families;
- question diagrams versus explanation diagrams when no evidence is withheld;
- single-item use of a self-contained shared-caselet stimulus;
- context changes such as walker, courier, patrol officer, vehicle or labelled points.

The following remain outside `DIR-001`:

- Data Sufficiency option logic;
- speed, time and relative-speed arithmetic;
- clock-hand orientation;
- map scale and cartographic ratio;
- general arrangement or multi-attribute puzzles;
- arbitrary survey bearings and three-dimensional navigation.

## 5. Freeze invariants

The English baseline requires:

1. continuous permanent QL IDs `DIR-QL-001` through `DIR-QL-044`;
2. exactly eight checkpoint IDs with the reviewed QL counts;
3. one unique rule ID per QL;
4. `REVIEWED` registry status for every QL;
5. `TRANSLATABLE` locale mode for every QL;
6. non-empty solver capabilities, renderer, answer type and presentation mode;
7. deterministic output for QL plus seed;
8. exactly four unique options and exactly one correct answer;
9. independent-solver verification metadata;
10. complete, question-specific explanations;
11. no unresolved placeholders or internal IDs in learner-facing English;
12. accessible valid SVG whenever a diagram is emitted;
13. no exact English stem collision between different QLs;
14. adequate per-QL stem and explanation diversity;
15. balanced correct-answer positions chapter-wide.

## 6. Chapter-wide proof scope

The freeze proof generates every QL through the public chapter dispatcher rather than calling checkpoint generators directly.

Planned exact-head proof:

```text
44 QLs × 40 seeds = 1,760 generated English questions
```

The proof also repeats each generation to verify deterministic equality, so the dispatcher performs at least 3,520 full generation calls during the audit.

Checkpoint-specific proofs remain authoritative for deeper topology coverage and continue to run as regressions.

## 7. Review artifact

The freeze workflow publishes one consolidated English artifact containing:

```text
44 QLs × 2 seeds = 88 review questions
```

The artifact includes:

- stem;
- four options;
- correct answer;
- explanation text;
- question and explanation diagrams when present;
- QL, checkpoint, seed, difficulty and answer-demand metadata;
- JSONL output for machine audit.

## 8. Change control after freeze

An English runtime change after this freeze requires:

1. a documented defect or material coverage gap;
2. explicit unfreeze scope;
3. affected checkpoint proof reruns;
4. complete chapter-wide freeze proof rerun;
5. regenerated consolidated English review artifact;
6. a new manual English approval when learner-facing content changes;
7. localization parity review for any Hindi or Punjabi work already derived from the earlier baseline.

## 9. Remaining chapter work

After English freeze merge:

1. implement and review Hindi;
2. implement and natural-language review Punjabi;
3. expose the chapter through Question Studio;
4. run multilingual parity and integration regressions;
5. freeze the complete multilingual chapter.
