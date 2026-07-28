# BLR-CP-002 — Merge/Split and Inverse Audit V1

Status: **provisional compression only; discovery remains open; no permanent QL allocation**.

## Evidence reviewed

- five executable prototypes;
- fourteen source-backed scenarios;
- five dialogue/presentation forms;
- direct and reverse endpoint questions;
- nested assertion chains;
- nested query endpoints;
- one-speaker and two-speaker anchors;
- formal `ONLY` checks;
- `SELF` identity output;
- 600-question mathematical audit;
- 400-question English editorial audit;
- 60-record V2 review pack.

## Provisional solve authority

All five current prototypes provisionally compress into one authority:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

The authority contract is:

```text
resolve speaker/listener/pointed-person anchors
-> reduce every structured role expression
-> validate ONLY cardinality
-> verify the displayed assertion
-> resolve both query endpoints
-> return SELF when the endpoint identities coincide
-> otherwise return the entailed kinship relation
```

This is not a one-QL freeze. It is the current merge decision subject to source widening and a second gap audit.

## Why the five prototypes merge

| Prototype distinction | Decision | Reason |
|---|---|---|
| pointed person to speaker | merge | endpoint order is a query property |
| speaker to pointed person | merge | reverse endpoint order uses the same solver and answer contract |
| nested query endpoint | merge | role depth and endpoint expression are instance properties |
| two-speaker conversation | merge | listener anchoring is already a supported anchor parameter |
| self identity | merge provisionally | `SELF` is a valid result of endpoint identity collapse inside the same solve route |

## Properties that must remain instance metadata

- renderer: pointing, photograph, introduction, stage or conversation;
- speaker/listener/pointed-person anchor count;
- first-person, second-person and pointed-person pronoun use;
- assertion role depth;
- query role depth;
- endpoint direction;
- relation output;
- number and location of `ONLY` constraints;
- spouse bridge and blood/affinal nature;
- self-identity collapse;
- difficulty;
- names and clue wording.

## Inverse-contract audit

| Forward form | Inverse | Status |
|---|---|---|
| pointed person relative to speaker | speaker relative to pointed person | executable |
| direct query endpoints | one endpoint as a role chain | executable |
| one speaker with `my` | two anchors with `my` and `your` | executable |
| external relative | chain resolves to speaker | executable as `SELF` |
| assertion role chain | query role chain | executable |
| ordinary relation output | underdetermined/model-space output | deferred to CP-005 |

## Split tests not yet justified

No current evidence justifies separate permanent identities merely for:

- photograph versus live pointing;
- introduction versus stage wording;
- one speaker versus two speakers;
- direct versus reverse endpoint order;
- one, two or several possessive steps;
- `ONLY_SON`, `ONLY_DAUGHTER` or ordinary role steps;
- blood versus affinal answer;
- `SELF` versus an ordinary relation, while both use the same relation-or-self answer contract.

A split will be reconsidered only if source widening proves a materially different query, answer, ambiguity, localization or renderer contract.

## Remaining source and coverage gaps

1. affinal output breadth: mother-in-law, daughter-in-law, brother-in-law and sister-in-law;
2. exact `ONLY_CHILD` evidence distinct from only son/daughter;
3. more pointed-person-relative and speaker-relative assertions;
4. broader `SAME_PERSON` assertion patterns;
5. direct source evidence for role chains producing grandparent, aunt/uncle and cousin outputs in both directions;
6. editorial audit of longer four-plus-step chains;
7. source rejection register for logically invalid published answers;
8. second independent source/gap pass.

## Boundary decisions retained

- `data inadequate`, possible, impossible and one-of-two pointer answers remain CP-005;
- shared family passages remain CP-003;
- count answers remain CP-004;
- coded pointer statements remain CP-006;
- presentation wording alone never creates a QL.

## Current allocation decision

```text
permanent CP-002 QLs: 0
next available chapter ID: BLR-QL-008
claimed by CP-002: no
```

The next audit must widen source coverage before this provisional one-authority compression can be reconsidered or frozen.
