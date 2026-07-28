# BLR-CP-002 — Second Source and Gap Audit

Status: **completed and confirmed after human review; one authority frozen at BLR-QL-008**.

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

### Three-anchor topology

A speaker can introduce or point out one person to a listener. Four source scenarios and a 256-question gate prove independent speaker, listener and pointed-person directionality.

### Both query endpoints derived

Three scenarios prove direct, inverse and `SELF` outcomes when both `my ...` and `your ...` expressions must be reduced. The focused gate contains 192 questions.

### Four-step role chains

Six scenarios cover direct, reverse, nested, conversation and self forms. The focused gate contains 384 questions. Depth is an instance difficulty property.

### Exact broad `ONLY_CHILD`

```text
CHILD = SON ∪ DAUGHTER
ONLY_CHILD = cardinality one after union
```

Positive daughter, reverse-mother and self cases pass. A model with one son and one daughter is correctly rejected.

### Negative sibling wording

`I have no brother or sister` is represented as:

```text
NONE(SIBLING)
SIBLING = BROTHER ∪ SISTER
```

Three positive scenarios pass, while a hidden-brother model is rejected before assertion or query solving.

### Affinal breadth

The closure covers father-in-law, mother-in-law, son-in-law, daughter-in-law, brother-in-law, sister-in-law, affinal uncle/aunt and inverse nephew/niece. Blood versus affinal output does not require a distinct solver.

### Photograph and portrait ownership wording

`Whose photograph?` and portrait questions retain the semantic answer while rendering possessive options such as `His son's`, `Her mother-in-law's` and `His own`.

### Pictured self versus derived self

The editorial layer distinguishes a hidden pictured person who is the speaker from two derived conversation endpoints that independently resolve to one identity.

## Deterministic proof before permanent allocation

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
CP-002 technical discovery proof          3,492 questions
```

The permanent `BLR-QL-008` runtime adds a 900-question gate covering all six source prototypes and all forty-five canonical scenarios.

## Merge/split result

All exact-answer modes share:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

The solve route is:

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

No source-backed evidence justifies a second CP-002 solve authority.

## Human and post-human confirmation

The user approved the v8 English human-review pack. The final grammar remediation changed only learner-facing wording and did not alter the solve contract. `BLR-CP-002-POST-HUMAN-GAP-CONFIRMATION.md` therefore confirmed the one-authority result.

## Boundary confirmation

- indeterminate, possible, impossible and one-of-two answers: CP-005;
- shared family passages: CP-003;
- count and composition answers: CP-004;
- coded relation decoding: CP-006;
- coded construction and validation: CP-007.

## Final allocation

```text
freeze version: BLR_CP002_ENGLISH_DISCOVERY_FREEZE_V1
permanent identity: BLR-QL-008
solve authority: RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
next available chapter ID: BLR-QL-009
```

All delivery surfaces remain locked: Question Studio, Question Bank, mock tests, public publication and localisation are disabled.
