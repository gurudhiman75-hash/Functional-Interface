# BLR-CP-002 — Photograph and Portrait Ownership Renderer Audit V1

Status: **passed; renderer variation only; no new solve authority or permanent QL**.

## Source pattern

Competitive blood-relation material commonly asks:

```text
Whose photograph was it?
At whose portrait was the speaker looking?
```

The answer options may be written possessively:

```text
His son's
His own
Her mother-in-law's
```

These forms do not change the mathematical task. The solver must still determine how the pictured person is related to the speaker.

## Semantic and display separation

The canonical runtime preserves a stable semantic answer ID and changes only the display label:

| Semantic answer | Ownership-form display |
|---|---|
| `SON` | `His son's` or `Her son's` |
| `MOTHER_IN_LAW` | `His mother-in-law's` or `Her mother-in-law's` |
| `SELF` | `His own`, `Her own` or `Their own` |

The semantic ID is used for solving, misconception construction, metadata and downstream audits. The possessive string is learner-facing renderer output.

## Executable source scenarios

Three canonical scenarios prove:

1. the photograph is of the speaker's son;
2. the photograph is the speaker's own;
3. the portrait is of the speaker's mother-in-law.

The first two also exercise the explicit `no brother or sister` constraint.

## Deterministic proof

```text
3 scenarios × 64 seeds = 192 questions
```

The dedicated gate verifies:

- all four answer positions are balanced;
- semantic IDs remain `SON`, `SELF` and `MOTHER_IN_LAW`;
- displayed correct options are possessive;
- all distractors use the same possessive renderer;
- `SELF` renders as `His/Her own` rather than a kinship label;
- every prompt still resolves pointed person relative to speaker;
- explanations teach the semantic-to-possessive conversion;
- Question Studio, Question Bank, mock-test and publication locks remain active.

## Merge/split conclusion

```text
WHOSE_PHOTOGRAPH
WHOSE_PORTRAIT
HOW_RELATED
```

are question-form parameters of:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

They do not justify separate QLs because the graph, role-chain, endpoint and semantic answer contracts are unchanged.

## Allocation state

```text
permanent CP-002 QLs: 0
next available chapter ID: BLR-QL-008
claimed: no
```

Final allocation remains blocked on human review and the formal CP-002 discovery freeze.
