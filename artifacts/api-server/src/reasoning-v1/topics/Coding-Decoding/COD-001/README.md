# COD-001 — Coding–Decoding

Status: **all 199 English QLs are runtime-closed; 173 translational QLs now have Hindi and natural-Punjabi runtime support; 26 language-adapted QLs remain**.

Student-facing chapter: **Coding–Decoding**  
Reasoning V1 package: `COD-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Coding-Decoding/COD-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md` — taxonomy and chapter boundaries.
2. `../../../REASONING-V1-ARCHITECTURE.md` — runtime, validation and localisation contracts.
3. `cod-001-open-ql-discovery-amendment.md` — evidence-led identity policy.
4. `COD-001-MANIFEST-AMENDMENT-CP007.md` through `COD-001-MANIFEST-AMENDMENT-CP010.md` and earlier merged identities.
5. `COD-001-ENGLISH-CLOSURE-AUDIT.md` and the executable whole-chapter English closure test.
6. `COD-001-TRANSLATIONAL-LOCALES-REPORT.md` and the Hindi/Punjabi translational audit.
7. checkpoint-specific approved discovery, implementation and review documents.

## Permanent identity

| Checkpoint | Permanent range | Count |
|---|---:|---:|
| `COD-CP-001` | `COD-QL-001..024` | 24 |
| `COD-CP-002` | `COD-QL-025..052` | 28 |
| `COD-CP-003` | `COD-QL-053..080` | 28 |
| `COD-CP-004` | `COD-QL-081..112` | 32 |
| `COD-CP-005` | `COD-QL-113..136` | 24 |
| `COD-CP-006` | `COD-QL-137..168` | 32 |
| `COD-CP-007` | `COD-QL-169..172` | 4 |
| `COD-CP-008` | `COD-QL-173..174` | 2 |
| `COD-CP-009` | `COD-QL-175..198` | 24 |
| `COD-CP-010` | `COD-QL-199` | 1 |
| **Total** | **`COD-QL-001..199`** | **199** |

The old predetermined 260-QL total remains revoked. No new QL may be created without recurring source evidence, ownership and collision audit, executable prototype proof, a new discovery freeze and an explicit manifest amendment.

## English closure

`review/cod-001-english-closure.test.ts` generates every permanent QL for twelve seeds, producing 2,388 questions. It validates identity continuity, determinism, option truth, exact collisions, teaching-text completeness, answer-position balance, difficulty and renderer reach, and review-only release safety.

## Hindi and Punjabi runtime

The multilingual facade currently supports:

```text
English: COD-QL-001..199       199 / 199
Hindi:  COD-QL-001..172, 199  173 / 199
Punjabi: COD-QL-001..172, 199 173 / 199
```

`COD-CP-001..007` and `COD-CP-010` are translational checkpoints. Their frozen English solvers remain authoritative while Hindi and Punjabi receive separately authored instructions, rule descriptions, condition text and explanations. Latin source letters, words, digits, symbols and answer codes remain logic-neutral.

The guarded locale audit generates 2,768 localized questions and verifies deterministic English-solver parity, scripts, no English instructional fallback, option/correct-index preservation, all answer positions and natural-Punjabi terminology. Review packs are exported for both languages.

## Remaining multilingual gap

Only the language-adapted checkpoints remain:

- `COD-QL-173..174` — renaming and semantic-referent coding;
- `COD-QL-175..198` — sentence and artificial-language coding.

These 26 QLs need separately authored Hindi and Punjabi referent vocabularies, facts, sentence datasets and grammar while preserving the same abstract solver topology.

## Remaining sequence

1. merge the translational Hindi/Punjabi runtime after exact-head CI;
2. implement and audit language-adapted CP-008;
3. implement and audit language-adapted CP-009;
4. run a final 199-QL, three-locale parity and editorial gate;
5. complete manual multilingual review packs;
6. connect reviewed content to Question Studio later.

## Release boundary

- Question Studio visibility remains disabled.
- No COD-001 QL is publicly publishable yet.
- Question Bank conversion, mock-test eligibility and public routing remain disabled.
- Mathematical operations, coded inequalities, Input-Output, figure coding and cross-topic coded relations remain outside COD-001.
