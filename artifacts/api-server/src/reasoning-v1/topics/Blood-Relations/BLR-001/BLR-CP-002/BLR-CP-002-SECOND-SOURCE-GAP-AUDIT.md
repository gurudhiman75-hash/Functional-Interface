# BLR-CP-002 — Second Source and Gap Audit

Status: **English solve-contract source gap pass completed; one authority recommended; freeze deferred for human review**.

## Audit question

Does the complete reviewed English pointer, photograph, introduction, portrait and conversation evidence require more than one mathematical solve authority or expose any meaningful unimplemented exact-answer mode owned by CP-002?

## Evidence inventory

The second pass reviewed and executable-tested:

- six exploratory prototypes;
- forty-five positive canonical source scenarios;
- two explicit negative model families;
- five presentation contexts;
- three question forms;
- one-, two- and three-anchor prompts;
- direct, reverse, one-derived and both-derived query endpoints;
- one- through four-step role chains;
- blood and affinal outputs;
- ordinary relation and `SELF` outputs;
- `ANY`, exact `ONLY` and zero-cardinality constraints;
- broad parent, child, sibling and spouse role sets;
- hidden photograph identity and explicit named introductions;
- semantic relation options and possessive photograph/portrait options.

## Gaps closed in the second pass

### 1. Three-anchor topology

A speaker can introduce or point out one person to a listener. All three anchors are independently stored and resolved:

```text
SPEAKER
LISTENER
POINTED_PERSON
```

Four scenarios and 256 deterministic questions prove listener, speaker and introduced-person directionality.

### 2. Both query endpoints derived

Some conversation questions require reducing both `my ...` and `your ...` expressions before comparing them.

Three scenarios prove:

- direct relation between two derived endpoints;
- inverse/same-generation relation between two derived endpoints;
- `SELF` when two independent chains resolve to one person.

This adds 192 deterministic questions and does not change the answer contract.

### 3. Four-step role chains

Six scenarios cover direct, reverse, nested, conversation and self forms with at least one four-step expression.

The focused gate contains 384 deterministic questions. Depth is therefore an instance difficulty property, not a QL boundary.

### 4. Exact broad `ONLY_CHILD`

The runtime implements:

```text
CHILD = SON ∪ DAUGHTER
ONLY_CHILD = cardinality one after union
```

Positive daughter, reverse-mother and self cases pass. A model containing one son and one daughter is correctly rejected as having two children.

### 5. Negative sibling wording

`I have no brother or sister` is represented as an explicit closed-world cardinality constraint:

```text
NONE(SIBLING)
SIBLING = BROTHER ∪ SISTER
```

Three positive scenarios pass, while a hidden-brother model is rejected before assertion or query solving.

### 6. Affinal breadth

The relation closure and source scenarios cover:

```text
father-in-law
mother-in-law
son-in-law
daughter-in-law
brother-in-law
sister-in-law
affinal uncle/aunt
inverse nephew/niece
```

No distinct solver is required for blood versus affinal output.

### 7. Photograph and portrait ownership wording

`Whose photograph?` and `At whose portrait?` preserve the same semantic relation answer while displaying possessive options such as:

```text
His son's
Her mother-in-law's
His own
```

This is a question/option renderer parameter, not a new solve identity.

### 8. Pictured self versus derived self

The editorial layer now distinguishes:

- a hidden pictured person who is the speaker;
- two derived conversation endpoints that happen to identify the same person.

Only the first is rewritten into the hidden-photograph self presentation. The second retains its conversation renderer.

## Complete deterministic proof

```text
core mathematical audit                    720 questions
affinal + only-child widening               832 questions
English editorial audit                     480 questions
three-anchor topology                       256 questions
both-derived query endpoints                192 questions
negative sibling constraints                256 questions
photograph/portrait ownership renderer      192 questions
four-step role chains                       384 questions
canonical 45-scenario appendix              180 questions
--------------------------------------------------------
CP-002 deterministic proof                3,492 questions
```

With frozen CP-001:

```text
CP-001 frozen proof                        3,556 questions
CP-002 open-discovery proof                3,492 questions
--------------------------------------------------------
current BLR-001 chapter proof              7,048 questions
```

## Merge/split rerun

All reviewed exact-answer modes continue to use:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

The shared contract is:

```text
resolve anchors
-> validate zero-cardinality constraints
-> expand broad role sets
-> reduce role chains
-> validate ONLY cardinality
-> verify the displayed assertion
-> resolve both query endpoints
-> return SELF when identities coincide
-> otherwise return the entailed relation
-> apply the requested question/option renderer
```

No source-backed evidence currently justifies a second CP-002 solve authority.

## Boundary confirmation

The following remain outside CP-002 exact-answer ownership:

- `data inadequate`, possible, impossible and one-of-two answers: CP-005;
- shared family passages and grouped questions: CP-003;
- family member counts and compositions: CP-004;
- coded relation decoding: CP-006;
- coded construction and validation: CP-007.

## Audit conclusion

The English source-gap pass is complete at the solve-contract level.

Recommended eventual allocation after approval:

```text
one permanent CP-002 solve identity
candidate next ID: BLR-QL-008
```

This recommendation is **not yet a freeze**. The final English review pack requires human editorial review and approval before permanent allocation, manifest amendment or delivery integration.

## Current release state

```text
permanent CP-002 QLs: 0
BLR-QL-008 claimed: no
Question Studio visible: no
Question Bank eligible: no
mock-test eligible: no
publicly publishable: no
Hindi/Punjabi implementation: not started
```
