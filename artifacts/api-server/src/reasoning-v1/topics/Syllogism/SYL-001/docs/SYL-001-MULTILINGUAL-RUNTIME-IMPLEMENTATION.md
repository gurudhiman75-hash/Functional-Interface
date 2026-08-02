# SYL-001 — Multilingual Runtime Implementation Report

Authority: `SYL_001_MULTILINGUAL_REVIEW_RUNTIME_V1`  
Status: **implemented; review-ready; not production-enabled**

## Implemented chapter

`SYL-001` now has executable English, Hindi and Punjabi runtime support for all seven checkpoints and all 18 retained QLs.

### CP ownership

| Checkpoint | QL range | Runtime ownership |
|---|---|---|
| `SYL-CP-001` | `SYL-QL-001..002` | core definite A/E/I/O entailment |
| `SYL-CP-002` | `SYL-QL-003..004` | two- and three-conclusion combinations |
| `SYL-CP-003` | `SYL-QL-005..007` | possibility, impossibility and modality |
| `SYL-CP-004` | `SYL-QL-008..009` | complementary/either-or pairs |
| `SYL-CP-005` | `SYL-QL-010..012` | directional only and explicit identity |
| `SYL-CP-006` | `SYL-QL-013..015` | a-few, only-a-few and not-all |
| `SYL-CP-007` | `SYL-QL-016..018` | advanced mixed forms |

## Runtime architecture

- canonical surface-form normalisation;
- bounded region-constraint satisfiability solver;
- independently implemented finite-witness verifier;
- exact `ENTAILED`, `CONTRADICTED` and `UNDETERMINED` classifications;
- genuine either-or proof by exclusivity and exhaustiveness checks;
- verdict and model-space premise-relevance audits;
- deterministic source-shaped scenario selection;
- curated neutral category terms;
- versioned four/five-option answer templates;
- fallacy-owned distractors;
- proof, witness and countermodel explanations;
- accessible SVG evidence diagrams;
- exact semantic parity across locales.

## Executable validation

The chapter audit generates:

```text
18 QLs × 80 seeds × 3 locales = 4,320 questions
```

It checks:

- continuous QL IDs;
- exact checkpoint allocation;
- source authority and source URL presence;
- deterministic replay;
- primary/independent solver agreement;
- stored truth-profile parity;
- four/five unique options;
- exactly one correct answer;
- all answer positions;
- all three modal outcomes;
- all five pair statuses;
- all eight three-conclusion masks;
- premise relevance;
- no unresolved `FEW` admission;
- no internal-ID leakage;
- SVG accessibility;
- Hindi and Punjabi script integrity;
- semantic and correct-index parity across locales;
- closed delivery locks.

## Review artifact

The exporter produces 108 review questions:

```text
18 QLs × 2 seeds × 3 locales = 108
```

Files:

- `syl-001-multilingual-review.html`;
- `syl-001-multilingual-review.jsonl`;
- `summary.json`.

Each HTML item includes the question, options, correct answer, normalised premises, conclusion analysis, model evidence, quick method, common mistake, diagram and structured metadata.

## Localisation policy

The same seed preserves:

- QL and checkpoint;
- source scenario;
- canonical statements and conclusions;
- truth classifications;
- semantic options;
- correct index;
- difficulty;
- diagram model.

Hindi and Punjabi are rendered from semantic records, not translated from the final English string. Negative statements use singular category forms. Punjabi universal quantifiers agree with the curated noun gender.

## Release boundary

No integration or publication surface is enabled. Manual English/Hindi/Punjabi editorial review and explicit chapter-freeze approval remain required.
