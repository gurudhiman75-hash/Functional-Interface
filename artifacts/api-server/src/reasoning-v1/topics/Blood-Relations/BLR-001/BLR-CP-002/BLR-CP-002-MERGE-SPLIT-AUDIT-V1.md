# BLR-CP-002 — Merge/Split and Inverse Audit V2

Status: **second source-gap rerun recommends one solve authority; human review and formal freeze remain pending**.

## Evidence reviewed

- six executable exploratory prototypes;
- forty-five positive canonical source scenarios;
- two negative model families;
- five presentation contexts;
- three question forms;
- one-, two- and three-anchor prompts;
- direct, reverse, nested and both-derived query endpoints;
- one- through four-step role expressions;
- relation-specific and broad-role `ONLY` checks;
- zero-cardinality `no brother or sister` checks;
- exact `ONLY_CHILD = ONLY(SON ∪ DAUGHTER)` semantics;
- blood and affinal outputs;
- ordinary relation and `SELF` outputs;
- possessive photograph/portrait option rendering;
- 3,492-question CP-002 deterministic proof;
- 180-record canonical appendix.

## Recommended solve authority

All six exploratory prototypes and all reviewed question forms compress into:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

The authority contract is:

```text
resolve speaker/listener/pointed-person anchors
-> validate explicit zero-cardinality constraints
-> expand broad role sets when required
-> reduce every structured role expression
-> validate ONLY cardinality after role-set union
-> verify the displayed assertion
-> resolve both query endpoints
-> return SELF when endpoint identities coincide
-> otherwise return the entailed kinship relation
-> apply the selected question and option renderer
```

This is a freeze recommendation, not a permanent allocation. `BLR-QL-008` remains unclaimed until human review and the formal freeze record pass.

## Prototype merge decisions

| Exploratory distinction | Decision | Reason |
|---|---|---|
| pointed person to speaker | merge | endpoint order is a query property |
| speaker to pointed person | merge | reverse order uses the same solver and answer contract |
| nested query endpoint | merge | endpoint expression and role depth are instance properties |
| two-speaker conversation | merge | `my` and `your` are anchor parameters |
| three-anchor introduction | merge | adding an introduced person changes anchor count, not the solve task |
| self identity | merge | `SELF` is endpoint identity collapse inside the same relation-or-self contract |

## Renderer merge decisions

| Renderer distinction | Decision | Reason |
|---|---|---|
| pointing / photograph / introduction / stage / conversation | merge | presentation context only |
| `How is X related to Y?` | merge | ordinary semantic relation rendering |
| `Whose photograph was it?` | merge | same semantic answer with possessive option labels |
| `At whose portrait was ... looking?` | merge | same semantic answer with portrait wording |
| `His own` / `Her own` | merge | possessive display of semantic `SELF` |

## Cardinality merge decisions

| Constraint | Decision | Reason |
|---|---|---|
| `ONLY_SON` / `ONLY_DAUGHTER` | merge | exact cardinality on a gendered role set |
| `ONLY_CHILD` | merge | exact cardinality on `SON ∪ DAUGHTER` |
| `no brother or sister` | merge | zero cardinality on `BROTHER ∪ SISTER` |

The quantifier and role set vary; the query and answer contract do not.

## Inverse and topology audit

| Forward form | Inverse or extension | Status |
|---|---|---|
| pointed person relative to speaker | speaker relative to pointed person | executable |
| direct query endpoints | one or both endpoints as role chains | executable |
| one speaker with `my` | listener with `your` | executable |
| two anchors | speaker, listener and introduced person | executable |
| ordinary relation | `SELF` identity collapse | executable |
| pictured self | derived-endpoint self | separately rendered, same semantic result |
| blood relation | affinal relation | executable |
| affinal uncle/aunt | inverse nephew/niece | executable |
| only-child positive | two-child rejection | executable |
| no-sibling positive | hidden-sibling rejection | executable |
| relation-label option | possessive photograph/portrait option | executable |
| exact entailed answer | underdetermined/model-space answer | deferred to CP-005 |

## Instance metadata retained

- presentation and question form;
- anchor count and anchor identities;
- pronoun ownership;
- assertion and query role depth;
- whether neither, one or both query endpoints are derived;
- endpoint direction;
- relation output;
- role vocabulary: gendered or broad;
- `ANY`, `ONLY` and zero-cardinality constraints;
- blood or affinal path;
- self-identity collapse type;
- difficulty, names and clue wording.

## Split tests not justified

No reviewed evidence justifies separate permanent identities merely for:

- photograph versus pointing;
- introduction versus conversation;
- one, two or three anchors;
- direct versus reverse endpoint order;
- one- through four-step role depth;
- one-derived versus both-derived query endpoints;
- `ONLY_CHILD` versus gendered only roles;
- negative sibling facts;
- blood versus affinal answers;
- `SELF` versus ordinary relation output;
- semantic versus possessive option display.

## Boundary decisions retained

- `data inadequate`, possible, impossible and one-of-two pointer answers remain CP-005;
- shared family passages remain CP-003;
- count answers remain CP-004;
- coded pointer statements remain CP-006;
- coded construction and validation remain CP-007.

## Current allocation decision

```text
recommended eventual permanent authorities: 1
permanent CP-002 QLs now: 0
candidate next chapter ID: BLR-QL-008
claimed by CP-002: no
```

The source and merge/split evidence is sufficient for a one-authority freeze recommendation. Permanent allocation remains blocked on human editorial approval of the final English pack and a formal discovery-freeze record.
