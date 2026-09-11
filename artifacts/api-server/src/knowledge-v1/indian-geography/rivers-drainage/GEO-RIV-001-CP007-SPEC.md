# GEO-RIV-001-CP007 — Tributaries & Confluences

## Scope

CP007 is the cross-system river-network checkpoint for `GEO-RIV-001`. It generates questions from verified tributary, bank-side, headstream, formation and confluence relations already established by upstream river-system CPs.

Current foundation admits approved/reviewed authorities from CP002–CP005 only. CP006 is intentionally excluded until its human-review boundary is crossed.

## Canonical relation model

A river-network fact is treated as one of five semantic classes:

1. **Parent relation** — tributary/headstream/source-stream → parent river.
2. **Bank relation** — tributary → left/right bank or north/south bank grouping of a parent river.
3. **Confluence place** — river → verified meeting place.
4. **Formation relation** — two or more streams/rivers → river formed or renamed after confluence.
5. **Relation chain** — linked parent/confluence relations whose order or common target can be solved from two or more canonical facts.

These classes are not interchangeable. For example, “Jhelum joins Chenab” and “Jhelum joins Chenab at Trimmu” are two linked facts with different answer fields.

## Permanent QL allocation

| QL | Name | Core skill | Difficulty |
|---|---|---|---|
| QL055 | Direct tributary-parent relation | identify parent river from tributary | Easy–Medium |
| QL056 | Reverse tributary identification | identify tributary of a named river | Easy–Medium |
| QL057 | Confluence place | identify where verified rivers meet | Medium |
| QL058 | Formation/headstream relation | identify river formed or its headstreams | Medium |
| QL059 | Bank-side tributary grouping | distinguish valid bank-side tributaries | Medium |
| QL060 | Correctly matched pair | select correct river-parent/place/formation pair | Medium |
| QL061 | Incorrectly matched pair | detect one false river-network relation | Medium |
| QL062 | Relation chain | solve two-hop or ordered river-network relation | Hard |
| QL063 | Statement I/II | evaluate two verified/altered relations | Medium–Hard |
| QL064 | Multi-statement count | count correct statements across systems | Hard |

## Difficulty contract

- **Easy:** one direct canonical relation with familiar river alternatives.
- **Medium:** reverse relation, confluence place, bank-side discrimination, or a close cross-system distractor.
- **Hard:** two or more linked canonical facts, chain/order reasoning, or multi-statement evaluation. Wording remains simple.

## Distractor contract

Distractors must come from the same semantic answer class:

- parent-river answer → other parent rivers;
- tributary answer → other real tributaries;
- confluence-place answer → other real river confluence places;
- bank-side answer → real tributaries from the contrasted bank/group;
- formation answer → real river/stream formation alternatives.

No generic geography filler, no “all/none of these”, and no artificial “both/neither bank” option.

## Explanation contract

Explanations should name the exact relation in one or two clean sentences. For linked questions, explain the chain in order. Avoid meta-commentary about review authority, distractor logic, traps, shortcuts or generation.

## Lifecycle

CP007 remains `REVIEW_REQUIRED` until:

1. source projection validates;
2. all QLs have representative coverage;
3. the review batch is semantically unique and answer-balanced;
4. human editorial review is explicit;
5. only then may a freeze authority and Question Studio registration be created.
