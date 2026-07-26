# DIR-CP-006 Implementation Report

Status: English runtime implemented on a feature branch; manual editorial approval pending.

## Ownership

`DIR-CP-006` owns direction questions in which spatial relations or absolute movements are expressed through a one-to-one symbol code. It does not own general word/letter coding-decoding, static natural-language graphs (`DIR-CP-004`), multi-mover comparison (`DIR-CP-005`), sun/shadow inference (`DIR-CP-007`), or mixed caselet synthesis (`DIR-CP-008`).

## Need-based QLs

| QL | Answer demand | Material distinction |
|---|---|---|
| `DIR-QL-023` | coded-chain endpoint direction | decode a one-to-one map and solve a relation chain; one-relation cases remain runtime variation |
| `DIR-QL-024` | entity at a coded relation | entity-valued inverse lookup after decoding a coded star graph |
| `DIR-QL-025` | recover a direction code | enumerate all 24 cardinal-map permutations and retain the unique map satisfying combined evidence |
| `DIR-QL-026` | equivalent coded statement | encode a natural relation while preserving subject-symbol-reference order |
| `DIR-QL-027` | valid conclusion | independently evaluate statement-valued options against a decoded graph |
| `DIR-QL-028` | missing operator | inverse reconstruction of the only symbol producing the required final-chain relation |
| `DIR-QL-029` | coded movement endpoint | decode absolute movement tokens and replay an ordered path rather than a static graph |

A direct single-relation decode was not allocated separately because it is only a shorter instance of `DIR-QL-023`. Symbol shape, person names, chain length and code-map permutation are runtime variations.

## Runtime model

- canonical grammar: `A @ B` means A is in the mapped direction of B;
- four visually distinct symbols mapped one-to-one to North, East, South and West;
- diagonal answers derived from cardinal relation chains;
- all 24 mapping permutations represented;
- independent graph solving, movement replay, map enumeration and missing-operator recovery;
- exactly four unique misconception-labelled options;
- `solveMode: null` under the open optional policy.

## Learner-facing contract

1. one natural continuous question paragraph;
2. decode the active symbols explicitly;
3. apply each coded relation or movement in order;
4. state the derived relation directly;
5. finish with one concise conclusion;
6. place a plain code-aware graph, path or recovered-key diagram last.

The diagram reserves a right-side code-key zone, displays a compass, draws coded edges before the target guide, then symbol labels and named nodes. Movement diagrams show each coded leg and a Start-to-Finish guide. Recovery diagrams show the evidence chains and the uniquely recovered key.

## Proof

The checkpoint proof generates `120` seeds per QL (`840` cases total) and checks deterministic replay, strict option uniqueness, independent solver agreement, all-eight-direction coverage for chain, conclusion, missing-operator and movement families, all-four-symbol recovery, all 24 map permutations, unique entity lookup, unique map recovery, unique missing operator, renderer counts and layer contracts, stem diversity and answer-position balance.

## State

- English mathematical/runtime validation: implemented.
- English manual product approval: pending.
- Hindi: not started.
- Punjabi: not started.
- Question Studio exposure: not enabled.
- Freeze status: not claimed.
