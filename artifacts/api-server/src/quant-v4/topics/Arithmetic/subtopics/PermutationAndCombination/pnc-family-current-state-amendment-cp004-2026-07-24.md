# P&C Family Current-State Amendment — CP-004

> Date: 2026-07-24  
> This amendment supersedes earlier embedded checkpoint counts without changing the need-based governance rules.

## Current runtime-proof snapshot

- package: `PNC-001 — Permutation & Combination Core`;
- active canonical problems: 4;
- current English QLs: `PNC-QL-001` through `PNC-QL-082`;
- current QL count: 82;
- current solve modes: 20;
- observed difficulty: 35 Easy / 33 Medium / 14 Hard;
- current language: English only;
- publication state: `publiclyPublishable: false`.

## Newly completed canonical problem

```text
PNC-CP-004 — Repeated Objects, Word Arrangements & Multisets
```

Current CP-004 scope:

- direct arrangements with identical multiplicities;
- word arrangements with one, two or three repeated categories;
- generated non-word multiset arrangements;
- fixing a unique or repeated object in one position;
- identical-swap overcount factors;
- bounded recovery of one missing multiplicity.

## Verification snapshot

- strict targeted TypeScript: PASS;
- bundled runtime proof: PASS;
- current 82-QL audit: PASS;
- 984 deterministic seed cases, each generated twice: PASS;
- independent recursive multiset enumeration: PASS;
- exact duplicate English templates: 0.

Pre-report workflow run: `30075581021`.

## Governance retained

- 82 is not a final QL target;
- 20 is not a final solve-mode target;
- no future CP ID is reserved by this amendment;
- new content requires fresh reference/PYQ and runtime-gap evidence;
- expansion stops at semantic saturation;
- generation-engine integration, freeze and localization remain deferred until maturity review.
