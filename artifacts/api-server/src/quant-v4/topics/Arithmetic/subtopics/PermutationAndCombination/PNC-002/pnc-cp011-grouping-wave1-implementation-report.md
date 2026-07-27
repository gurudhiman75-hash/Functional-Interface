# PNC-CP-011 Grouping Wave 1 — Implementation Report

## Verdict

`RUNTIME-PROOF CHECKPOINT COMPLETE — GROUPING SUBFAMILY ONLY`

This checkpoint allocates and proves the first permanent CP-011 English QLs. It does not claim distribution-family completion, CP-011 saturation, localization, Question Studio integration or publication readiness.

## Inventory

- QL range: `PNC-QL-209` through `PNC-QL-218`;
- active English QLs: 10;
- materially distinct solve modes: 7;
- difficulty: 1 Easy / 6 Medium / 3 Hard;
- next immutable PNC family ID: `PNC-QL-219`.

The provisional discovery candidates were deliberately merged where the mathematical contract remained identical:

- labelled unequal and labelled equal prescribed groups share `countLabelledPrescribedGroups`;
- unnamed distinct-size and mixed repeated-size profiles share `countUnlabelledPrescribedGroups`;
- unnamed equal groups and unnamed pairs share `countUnlabelledEqualGroups`.

## Covered contracts

1. two named groups of unequal prescribed sizes;
2. several numbered equal groups;
3. three unnamed groups of distinct prescribed sizes;
4. several unnamed equal groups;
5. mixed repeated-size unnamed groups with separate interchange corrections;
6. unnamed pairs;
7. a specified pair in the same named equal group;
8. a specified pair in different named equal groups;
9. a specified pair in the same unnamed equal group;
10. a specified pair in different unnamed equal groups.

## Runtime architecture

The checkpoint adds an isolated CP-011 grouping runtime layer containing:

- human-owned English question language;
- task registry and constraint profiles;
- curated deterministic parameter pools;
- exact `bigint` production authority;
- algebraically separate sequential-selection verification;
- solver-owned MathJax;
- QL-specific explanations;
- misconception-driven four-option generation;
- structural/editorial validation;
- coverage auditing;
- JSON and CSV review export.

The runtime is intentionally isolated from the shared PNC-002 package composer until this grouping checkpoint receives manual approval. This avoids exposing a partially implemented CP-011 while retaining executable proof and permanent QL ownership.

## Validation evidence

The runtime and discovery workflows passed on the implementation/documentation heads associated with this checkpoint. The pull request description records the current exact head and run IDs.

Proof results:

- strict TypeScript: pass;
- esbuild bundle: pass;
- 10 contiguous QLs: pass;
- 7 solve modes: pass;
- exact difficulty snapshot: pass;
- 10 direct formula spot checks: pass;
- 120 deterministic runtime cases: pass;
- every case generated twice: pass;
- production and independent answers agree: pass;
- four unique positive options: pass;
- all four correct-answer positions represented: pass;
- 39 distinct rendered stems: pass;
- unresolved placeholders: 0;
- duplicate QL templates: 0;
- invalid audit samples: 0;
- review rows: 10.

## Manual editorial review

The first green review artifact exposed two learner-facing defects:

- a parameter state produced `1 unnamed groups` in QL-213;
- QL-215 could produce `1 favourable places`.

The singular mixed-group state was removed, and the explanation was rewritten as `the number of favourable places ... is 1`. The exact proof passed again after both corrections.

## Remaining CP-011 families

The next source/gap audit begins at `PNC-QL-219` and covers:

- distinct objects into labelled boxes;
- distinct objects into identical boxes;
- identical objects into labelled boxes;
- identical objects into identical boxes;
- controlled occupancy bounds;
- bounded inverse recovery after forward-family maturity.

Final QL and solve-mode counts remain need-based.

## Release safety

- English only;
- shared PNC-002 composer integration deferred;
- no generation-engine registration;
- no Question Studio discovery;
- no Question Bank write path;
- no test/public routing;
- `publiclyPublishable: false` for every generated package.
