# ARG-001 — Post-Closure Deep Audit

Status: **CLOSED — POST-CLOSURE ANSWER-INTEGRITY AND STANDARD-ADAPTER REMEDIATION COMPLETE**

Date: 2026-10-04

Supersedes as current-head authority:
`ARG-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md`

The September closure and all historical CP freezes remain part of the audit trail. This authority records issues found by re-auditing the already-implemented chapter after CP015 became the current internally approved runtime.

## Scope

- chapter: `ARG-001`
- permanent QLs: `ARG-QL-001..ARG-QL-006`
- current release checkpoint: `ARG-CP-015`
- languages: English / Hindi / Punjabi
- current profile families:
  - Core
  - SSC/state 2×4
  - Banking classic 2×5
  - Banking combo 3×5
  - Banking combo 4×5
- Matrix/Games/Tournament: out of scope
- no new permanent QL added

The six existing semantic QLs still cover:

1. relevance / materiality;
2. evidence / mechanism / causal support;
3. feasibility / implementation;
4. scope / proportionality / extremity;
5. stakeholder / fairness / rights / public interest;
6. alternatives / counterarguments / second-order effects.

## Material defects found

### 1. Final CP015 answer index lacked a fail-closed post-transform proof

The base ARG semantic authority already has a genuine independent strength classifier based on relevance, materiality, support, feasibility, scope and stakeholder legitimacy.

However, CP015 applies a long editorial/localization/anti-gaming transformation stack after earlier answer construction. The final learner surface retained `argumentStrengths`, `strongArgumentIndices`, options and `correctIndex`, but there was no final general proof that those fields still agreed after all transformations.

Remediation authority:

`ARG_CP015_FINAL_OPTION_SEMANTICS_PROOF_2026_10_04`

The final CP015 generator now fails closed unless:

- displayed argument count is 2–4;
- final `argumentStrengths` contains only STRONG/WEAK and matches displayed argument count;
- the independently derived strong-argument set maps to exactly one displayed option;
- final `correctIndex` / `correct` points to that option;
- `answer` and `canonicalAnswer` match that option;
- `strongArgumentIndices`, when present, agrees with `argumentStrengths`;
- the Banking “Either I or II” compatibility distractor is never accepted as a semantic truth class.

The option parser explicitly supports the approved English, Hindi and Punjabi wording variants used by historical core and current real-paper profiles.

### 2. ARG-001 was missing from the current standard Reasoning adapter

ARG still had a mature chapter-specific Question Studio route and the older `shared-generation-engine-arg`, but it was absent from:

`src/question-studio/engines/reasoning-v1-adapter.ts`

That meant the current multi-engine Question Studio API did not expose ARG in the same standard adapter used by newer Reasoning chapters.

Remediation:

- added `question-studio-integration.ts`;
- registered `ARG-001` in the standard `reasoning-v1` adapter;
- standard requests now route to the current CP015 generator, not the old CP005 generator;
- QL selectors, language, difficulty and exam/profile controls are preserved;
- Punjab/SSC/state-style requests resolve to the approved SSC 2×4 profile;
- Banking requests resolve to approved Banking profiles;
- explicit Banking combo profiles remain available;
- the existing governed CP015 admin/persistence route remains intact and ahead of historical fallbacks.

Standard adapter authority:

`ARG-001-CP015-STANDARD-REASONING-ADAPTER-2026-10-04`

### 3. Final chapter CI was tied to a historical audit branch

The old `arg-001-final-chapter-audit.yml` ran only on pushes to an old audit branch.

It is now a current PR gate for `New-main`, with:

- scoped ARG-owned paths;
- concurrency cancellation;
- current CI timeout policy;
- the complete existing CP015 quality stack;
- the new post-closure answer proof;
- the new standard-adapter integration proof;
- exact CP006 / CP008 byte freezes;
- CP013 / CP014 approval lineage;
- production API and admin builds.

### 4. CP015 registration proof had stale static-import assumptions

The canonical Question Studio registry has since moved to lazy-loaded routers.

The old CP015 registration test still expected direct static imports and therefore failed even though CP015 remained correctly registered and mounted.

The proof now verifies:

- lazy registration of CP015;
- lazy registration of CP014 historical fallback;
- CP015 registration before CP014;
- CP015 mount before CP014.

No routing behavior was weakened.

## Preserved historical authorities

The post-closure audit did not rewrite historical frozen content.

Still passing:

- structural chapter contracts;
- exam-profile routing;
- CP006 exact byte freeze;
- CP008 exact byte freeze;
- CP013 final learner-surface proof;
- CP014 manual editorial approval proof;
- CP015 anti-gaming grammar proof;
- CP015 semantic-alignment proof;
- CP015 Hindi naturalness proof;
- CP015 Punjabi naturalness proof;
- CP015 final editorial-quality proof;
- CP015 1,000-question perceived-diversity proof;
- CP015 canonical registration/persistence proof.

## Post-closure executable proof

New gate:

`arg-001-post-closure-audit-20261004.test.ts`

Coverage:

- **6 QLs**
- **3 languages**
- **10 profile/difficulty cells**
- **16 deterministic seeds per cell**
- **2,880 generated learner surfaces**

Observed results:

- generated learner surfaces: **2,880**
- unique surface fingerprints: **2,792**
- Core: **864**
- SSC 2×4: **576**
- Banking classic 2×5: **576**
- Banking combo 3×5: **576**
- Banking combo 4×5: **288**

Correct-option positions exercised:

- option 1: **686**
- option 2: **753**
- option 3: **353**
- option 4: **736**
- option 5: **352**

Banking Either distractors verified: **576**

The proof also deliberately corrupts the final answer index and confirms that the new semantic guard rejects it.

## Standard Question Studio proof

`arg-001-post-closure-question-studio-integration.test.ts`

Passed for:

- Core English / Easy / fixed QL;
- Punjabi Banking combo 3×5 / Hard;
- Hindi Punjab PSSSB / Medium mapped to SSC-state 2×4;
- invalid QL rejection;
- exactly one ARG package in the standard Reasoning adapter;
- current CP015 internal lifecycle;
- final answer-semantic verification on adapter output.

## Exact substantive-head validation

Substantive code head:

`ce99de1a1f19b4fc483975ae6a7535d1512322fe`

Workflow:

`ARG-001 final chapter audit` — run **#13**

Result: **SUCCESS**

The exact head passed:

- structural chapter and profile contracts;
- complete CP015 learner-quality stack;
- 2,880-surface post-closure answer audit;
- standard Reasoning adapter integration proof;
- CP006 / CP008 exact freezes;
- CP013 learner surface;
- CP014 approval authority;
- production API build;
- production admin build.

Shared Reasoning current-head and global reconciliation gates also passed.

The central `Validate Question Studio engine adapters` workflow compiled the API successfully with ARG registered, then stopped at the known unrelated `DI-001` lifecycle defect:

`DI-001 is invalid: packages that declare lifecycle gates must declare lifecycleStage`

That Quant/DI defect is outside this Reasoning chapter audit and was not modified here.

## Lifecycle

ARG differs intentionally from chapters that remain review-only.

Current approved internal lifecycle:

```text
Question Bank persistence:        ALLOWED
Question Bank writable:           true
test eligibility:                 true
mock eligibility:                 true
publicly publishable:             false
public release authorized:        false
student delivery authorized:      false
automatic publication:            false
```

The standard adapter preserves the same boundary and declares Question Bank acceptance mode `BANK_ONLY`; it does not authorize public release.

## Final disposition

```text
semantic QL breadth:                     CLOSED — NO NEW QL REQUIRED
base strength classifier:                INDEPENDENT / CLOSED
final CP015 option-answer integrity:      CLOSED — FAIL_CLOSED
EN/HI/PA editorial quality:              CLOSED
profile diversity:                       CLOSED
current CP015 registration:              CLOSED
standard reasoning-v1 adapter:           REGISTERED
Question Bank/Test/Mock internal use:    APPROVED
public/student release:                  LOCKED
automatic publication:                   LOCKED
historical CP006/CP008 freezes:           PRESERVED
post-closure deep-audit status:           CLOSED
```

Reopen ARG-001 only for a newly evidenced recurring exam family not representable by the six permanent QLs, a strength/answer regression, an editorial/localization regression, a permanent audit-gate failure, or a separately approved public/student release transition.
