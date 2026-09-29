# SEA-001 — Deep Audit Wave 02

Date: 2026-09-29

Status: `SOURCE_BACKED_QUERY_GAPS_TECHNICALLY_CLOSED__PERMANENT_QL_FREEZE_STILL_OPEN`

## Purpose

Wave 01 established that topology implementation was complete but learner query breadth was narrower than recurring exam-style seating output.

Wave 02 closes the three identified query gaps as a **review-only extension layer**, leaving the stable caselet generators and lifecycle locks unchanged.

## Added review-only query coverage

### Extreme-end pair

New review extension:

- asks which pair occupies the two extreme row ends;
- derives its answer from the independently verified CP001 solved state;
- uses three distinct wrong end/interior pair constructions;
- remains part of the same endpoint-identification learner family rather than creating a new topology.

### Relative-position description

New review extension:

- asks for the position of one person with respect to another;
- uses a relation answer such as immediate/second left/right;
- derives the target relation from the verified centre-facing circular state;
- is the inverse answer contract of the existing person-at-relative-position query.

This is materially distinct from asking **who** occupies a relation because the learner must return the relation itself rather than the person.

### Definitely-true relation statement

New review extension:

- asks which relation statement is definitely true;
- uses the same verified relation state as the relative-position-description task;
- is treated as a presentation variant of the relation-description contract, not as another QL.

## Anti-inflation decisions

Do not allocate separate permanent QLs for:

- immediate versus second/third/k-th left/right;
- centre versus outward versus north/south versus mixed facing;
- extreme-end single person versus extreme-end pair;
- direct relation description versus "which statement is definitely true" when both are solved by the same person-to-person relation query.

## Technical proof

The extension audit sweeps:

- all four CP001 blueprint authorities;
- all four CP003 blueprint authorities;
- 30 deterministic seeds per blueprint;
- exact replay;
- four unique options;
- answer-option consistency;
- all four answer positions;
- review-only lifecycle;
- zero permanent QL allocation.

The new extensions do not modify:

- topology generation;
- clue selection;
- solver or oracle;
- existing child-question output;
- Question Studio;
- Question Bank/test/mock/public lifecycle.

## Provisional compressed learner-contract inventory

With the source-gap extensions included, the current SEA-001 surface compresses to these provisional learner contracts:

1. endpoint identification — one endpoint or both extreme ends;
2. person at relative position — immediate/k-th left/right;
3. relation of one person with respect to another — includes definitely-true relation-statement presentation;
4. immediate-neighbour pair;
5. undirected linear number-between;
6. directional circular number-between;
7. opposite person;
8. directional ordered sequence;
9. facing-change counterfactual relative-position query.

This is still an audit inventory, not permanent allocation.

## Remaining audit questions

Before permanent QL allocation:

- verify source/topology saturation against SEA-001 versus SEA-002/003 boundaries;
- verify whether endpoint identification and neighbour-pair contracts need any additional inverse shell;
- verify query coverage across CP002/CP004/CP005, not only CP001/CP003;
- audit explanation quality and option provenance across all five checkpoints;
- decide whether the facing-change counterfactual is exam-authentic baseline or should remain practice-only;
- perform English manual review and freeze;
- implement Hindi/Punjabi only after the English contract set is frozen.

## Lifecycle

No activation is authorized.

Permanent QLs remain zero until the merge/split and source-saturation checkpoint explicitly allocates them.
