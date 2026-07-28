# BLR-CP-002 — Source Rejection Register V1

Status: **active editorial and logical safeguard**.

Competitive-reasoning books are used to discover prompt families. Their supplied answers are not trusted when the relation is not entailed by the formal family model.

## Rejected or deferred source patterns

### 1. `Only son of my grandmother` automatically treated as father

**Decision:** reject as an exact CP-002 item.

The grandmother's only son may be the speaker's father or maternal uncle unless the branch connecting the speaker to that grandmother is stated. This belongs to CP-005 when the task asks whether the relation can be determined.

### 2. `Son of my grandfather's only son` automatically treated as brother

**Decision:** reject as exact without an exclusion clue.

The described son may be the speaker himself or a brother. A gender or distinct-person clue may narrow the model, but the bare wording is not uniquely entailed.

### 3. Father of the speaker's only daughter-in-law labelled father-in-law

**Decision:** reject the supplied label.

That man is the father of the speaker's daughter-in-law. He is a co-in-law to the speaker, not the speaker's father-in-law under the chapter ontology. The prompt family may be retained only after the queried relation is reformulated.

### 4. `Only daughter of my grandfather's only child`

**Decision:** defer unless identity and branch constraints are explicit.

Depending on the speaker and the selected grandparent, the woman may be the speaker, a sister or another descendant. The phrase demonstrates `ONLY_CHILD` demand but not a safe exact scenario by itself.

### 5. Gender-neutral `only child` forced into `only son` or `only daughter`

**Decision:** prohibited.

The current executable role-step vocabulary is gendered. `ONLY_CHILD` requires a broad child role and union-cardinality semantics across sons and daughters. It remains an explicit architecture gap; it must not be simulated by choosing one gender.

### 6. Co-in-law relation forced into a standard in-law label

**Decision:** reject.

Relations between the parents of spouses are outside the current answer ontology. They must not be relabelled as father-in-law, mother-in-law, brother-in-law or sister-in-law merely because an exam source does so informally.

## Acceptance standard

A CP-002 exact item is accepted only when:

1. every pronoun has an explicit anchor;
2. every role chain resolves to one person;
3. every `ONLY` phrase is true in the active family scope;
4. the displayed assertion is independently entailed;
5. both query endpoints are unique;
6. the final relation is supported by the ontology;
7. no alternate valid family model changes the answer.

Items failing condition 7 are candidates for CP-005, not defective CP-002 exact questions.
