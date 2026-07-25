# PNC-002 Canonical Problems

## Fixed package ownership

| CP | Ownership | Current status |
|---|---|---|
| `PNC-CP-007` | specified objects together/apart, one or more linear blocks, internal block orders and direct block complements | Runtime proof |
| `PNC-CP-008` | fixed positions, starts/ends, relative order, alternation and explicit gap placement | Not started |
| `PNC-CP-009` | compulsory/excluded members and exact/at-least/at-most category selection | Not started |
| `PNC-CP-010` | circular arrangements and rotational/reflection symmetry | Not started |
| `PNC-CP-011` | labelled/unlabelled grouping and distribution | Not started |
| `PNC-CP-012` | exam-relevant mixed systems that cannot be owned cleanly by an earlier CP | Not started |

## CP-007 represented scope

- one specified pair together;
- one specified block of three or four objects together;
- one specified pair not together;
- a specified group not all consecutive;
- two disjoint pairs together;
- unequal blocks together;
- three disjoint pairs together;
- a required block together while a separate pair remains apart;
- bounded recovery of total object count;
- bounded recovery of block size.

## Negative boundaries

CP-007 does not own:

- exact gap placement or pairwise non-adjacency through gaps — CP-008;
- relative order or fixed internal order — CP-008;
- circular together/apart conditions — CP-010;
- conditional committee selection — CP-009;
- general inclusion–exclusion systems such as “exactly one of two pairs together” — CP-012;
- word-specific repeated-letter restrictions whose primary authority is multiset identity — CP-005.

Current QLs are `PNC-QL-107` through `PNC-QL-118`. IDs continue the immutable family sequence.
