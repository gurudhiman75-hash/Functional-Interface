# BLR-CP-002 — Source and Boundary Audit

Status: **open discovery; source inventory established; no permanent QL allocation**.

## Source-backed prompt families

The uploaded competitive-reasoning references repeatedly use:

- pointing to a person;
- pointing to a photograph;
- introducing a person to others;
- showing a person on a stage or nearby;
- one speaker addressing a listener;
- nested possessive chains beginning with `my`, `your`, `his` or `her`;
- `only son`, `only daughter`, `only child` and an only-qualified derived relation;
- identity collapse such as `wife of my husband` or `only daughter of my father`;
- query endpoints that are themselves role chains, such as the speaker's husband;
- direct and reversed endpoint questions over the same pointer statement.

## Renderer versus solve-contract decision

The following are renderer variants and must not create separate QLs by themselves:

```text
pointing to a person
pointing to a photograph
introducing a person
showing a person on stage
looking at a nearby person
```

They share the same structured role assertion and role-chain solver.

## Initial executable prototype inventory

The first CP-002 slice retains five non-permanent prototypes:

1. `BLR-CP002-PROT-POINTED-TO-SPEAKER`
   - relation of the pointed/introduced person to the speaker;
2. `BLR-CP002-PROT-SPEAKER-TO-POINTED`
   - reverse endpoint direction;
3. `BLR-CP002-PROT-NESTED-QUERY-ENDPOINT`
   - one query endpoint is itself a role chain;
4. `BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION`
   - `my` and `your` resolve against different anchors;
5. `BLR-CP002-PROT-SELF-IDENTITY`
   - the described person collapses to the speaker and the answer is `SELF`.

This is an exploratory inventory, not a five-QL decision.

## Structured solver boundary

CP-002 exact questions use:

```text
anchor resolution
-> nested role-chain reduction
-> formal ONLY validation
-> statement verification
-> explicit query endpoint resolution
-> ordinary family-graph relation closure
```

`ONLY_SON` means the sole male child in the active generated family scope. It does not mean only child. The same distinction applies to only daughter and only-qualified derived relations.

## Deferred ownership

The source material also contains pointer questions whose offered answer is `data inadequate`, `cannot be determined`, or one of two relations. Those require complete model-space semantics and remain owned by `BLR-CP-005`, even when their renderer is dialogue or photograph based.

The following also remain outside this slice:

- shared family passages — CP-003;
- numerical family counts — CP-004;
- coded pointer statements — CP-006;
- Hindi and Punjabi adaptation — after English ownership stabilises.

## Source-quality rejection rule

Published practice material is evidence of a prompt family, not automatic authority for every supplied answer. A source item is rejected when the stated relation is not entailed under the chapter's formal family model. In particular, informal `in-law` labels must not be accepted for co-in-law relations that are outside the ontology.

## Discovery gates before freeze

- executable role-chain prototypes;
- independent assertion and query solving;
- only-constraint coverage;
- direct/reverse and nested-endpoint inverse audit;
- source-saturation review;
- English editorial review;
- merge/split audit;
- second source/gap audit;
- discovery freeze and sequential allocation beginning at `BLR-QL-008` only if justified.
