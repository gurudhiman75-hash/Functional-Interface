# BLR-CP-001 — Direct Named-Person Relations

Status: **two English executable discovery slices; no permanent QLs; discovery open**.

## Implemented prototype coverage

### Slice 1 — relation-label solving

- direct forward relation;
- reverse of a displayed direct relation;
- two-edge composition;
- three-edge cousin composition;
- parent, child, sibling, spouse, grandparent, uncle/aunt, nephew/niece, cousin and common in-law relation labels.

### Slice 2 — query and answer-shape expansion

- identify the unique person having a requested relation;
- identify an ordered person pair having a requested relation;
- select a true or false relation claim;
- compare two people's generation positions;
- solve non-linear cousin branches in which siblinghood is inferred from a shared modelled parent.

The checkpoint currently has nine non-permanent prototype contracts. This does not mean that CP-001 will eventually contain nine permanent QLs. Merge/split, inverse-contract, source-saturation and gap audits remain mandatory.

## Runtime contract

The generator constructs or selects a valid structured family, assigns deterministic culturally natural names, derives a query and constructs four options. The independent solver reconstructs the family graph from the displayed clues alone and must agree before the question is emitted.

The second slice adds:

- a shared deterministic name registry;
- graph construction directly from relation clues;
- inferred sibling closure for people sharing a modelled parent;
- complete supported-relation enumeration over a bounded family;
- generation-level propagation;
- typed answer keys for person, pair, claim, generation and relation answers;
- independent option validation for every advanced query.

## Executable audit surface

Repository CI now runs:

```text
prototype.test.ts           4 contracts × 100 seeds = 400 questions
advanced-prototype.test.ts  5 contracts × 100 seeds = 500 questions
```

The combined gate checks determinism, graph validity, independent-solver agreement, four unique options, one correct answer, misconception labels, answer-position balance, explanation completeness, all five advanced answer shapes, both true/false claim modes, generation deltas from -2 to +2 and inferred-sibling branching.

## Still under CP-001 discovery

- gender-only questions;
- identify-correct/incorrect pair variants beyond the current ordered-pair contract;
- broad versus exact maternal/paternal answers;
- great-grandparent and longer bounded chains;
- whether true and false claim wording remains one solve contract;
- whether branching relation is a distinct QL or a topology property of composed relation solving;
- editorial saturation and source-backed merge/split decisions.

## Safety boundary

- permanent `BLR-QL-*` IDs: **0**;
- English prototype only;
- Question Studio disabled;
- Question Bank and mock-test eligibility disabled;
- public publication disabled.
