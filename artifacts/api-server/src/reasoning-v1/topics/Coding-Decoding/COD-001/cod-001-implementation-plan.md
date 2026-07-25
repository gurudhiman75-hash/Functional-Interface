# COD-001 Implementation Plan

Status: implementation roadmap only. No runtime checkpoint is claimed complete.

## 1. Branch and merge policy

Design branch:

```text
feat/reasoning-cod-001-design
```

Runtime work should use one checkpoint branch at a time:

```text
feat/reasoning-cod-001-cp001-runtime
feat/reasoning-cod-001-cp002-runtime
...
feat/reasoning-cod-001-cp010-runtime
```

Each checkpoint PR targets the current COD-001 feature base or `New-main` after the previous checkpoint is merged. Do not allow several branches to edit the same chapter-wide registries without first reserving exact entries.

## 2. Stage 0 — Design review

Before writing runtime code:

- review the chapter manifest and exact QL ranges;
- confirm that all exclusions remain separate chapters;
- review the 54-rule inventory for complete collisions;
- approve renderer and answer-type names;
- approve English-first localization boundary;
- record any amendments explicitly.

Exit gate: design approved; no unresolved CP ownership or QL-range dispute.

## 3. Stage 1 — COD-001 foundation

Create chapter-local foundation modules:

- typed QL and generated-question contracts;
- seeded PRNG wrapper;
- alphabet rank, opposite and cyclic-shift utilities;
- code-value canonical serialization;
- injective mapping and inverse utilities;
- position permutation and inverse utilities;
- generic option uniqueness validator;
- renderer payload schemas;
- explanation trace contracts;
- chapter-manifest runtime representation.

Foundation tests must verify:

- alphabet wrapping;
- opposite mapping;
- permutation inversion;
- mapping consistency;
- canonical value equality;
- deterministic PRNG behavior;
- option uniqueness and single-correct enforcement.

Exit gate: foundation tests executed successfully in the checked-out repository. No QLs are discoverable yet.

## 4. Stage 2 — COD-CP-001 direct mapping runtime

Implement exact QL range `COD-QL-001` to `COD-QL-024`.

Required files:

- QL registry;
- direct-map rule definitions;
- English word pool subset;
- generator;
- independent mapping solver;
- cross-family ambiguity checker;
- rule-aware distractors;
- option validator;
- English explanation builder;
- exhaustive test;
- exact review exporter;
- implementation report.

Mandatory audits:

- repeated-letter consistency;
- all required target letters covered by evidence;
- mapping injectivity for decode tasks;
- direct-map examples do not collapse to a simpler shift or permutation;
- answer-position balance;
- output-type coverage.

Exit gate: English review accepted. Keep non-publishable.

## 5. Stage 3 — COD-CP-002 alphabet-number runtime

Implement `COD-QL-025` to `COD-QL-052`.

Build the full nine-rule ambiguity pool before mass QL creation.

Mandatory audits:

- aggregate-rule collision matrix;
- multi-example evidence sufficiency;
- different word lengths for length-sensitive disambiguation;
- bounded integer outputs;
- sequence versus scalar answer-type correctness;
- forward/reverse rank trap validation.

Exit gate: no equal-or-simpler aggregate matches accepted evidence.

## 6. Stage 4 — COD-CP-003 uniform alphabet runtime

Implement `COD-QL-053` to `COD-QL-080`.

Rules:

- signed uniform cyclic shift;
- opposite alphabet.

Do not create fixed special-case shift rules.

Mandatory audits:

- forward and backward query coverage;
- wrap and no-wrap examples;
- inverse decode agreement;
- opposite-map versus fixed-shift ambiguity;
- minimum visible word variety.

## 7. Stage 5 — COD-CP-004 positional runtime

Implement `COD-QL-081` to `COD-QL-112`.

Build one matcher across CP-003 and CP-004 rules.

Mandatory audits:

- every conditional branch activated;
- incremental start-index coverage;
- alternating phase coverage;
- odd/even, vowel/consonant and endpoint/interior branch coverage;
- rejection when a uniform shift also fits;
- per-position explanation correctness.

## 8. Stage 6 — COD-CP-005 permutation runtime

Implement `COD-QL-113` to `COD-QL-136`.

Mandatory audits:

- inverse permutation correctness;
- palindrome and symmetry rejection;
- repeated-letter movement visibility;
- rotation direction coverage;
- half-length and odd-length policy;
- rejection of identity permutations.

## 9. Stage 7 — COD-CP-006 composite runtime

Implement `COD-QL-137` to `COD-QL-168` only after CP-003 to CP-005 are stable.

Create a normalized stage registry and a matcher that includes every eligible single-stage rule.

Mandatory audits:

- both stages active;
- no single-stage explanation of final output;
- no duplicate commuting stage order;
- source-position versus post-stage-position semantics;
- partial-stage distractor validation;
- hard-difficulty and layout coverage.

This checkpoint requires at least 150 English stress seeds per QL during freeze audit.

## 10. Stage 8 — COD-CP-007 digit and alphanumeric runtime

Implement `COD-QL-169` to `COD-QL-192`.

Mandatory audits:

- leading-zero behavior;
- modular arithmetic bounds;
- fixed-width serialization;
- digit-map invertibility;
- token separator stability;
- exclusion of operator-substitution questions.

## 11. Stage 9 — COD-CP-008 renaming runtime

Implement `COD-QL-193` to `COD-QL-208`.

Build locale-aware referent datasets and a directed renaming-graph solver.

Mandatory audits:

- chain direction;
- query perspective;
- cycle length and uniqueness;
- role/function factual correctness;
- culturally neutral datasets;
- English editorial review before localization.

## 12. Stage 10 — COD-CP-009 sentence-code runtime

Implement `COD-QL-209` to `COD-QL-240`.

First build and test the generic bipartite constraint solver independently of question language.

Generation must create the hidden mapping first and then derive statements.

Mandatory audits:

- set-intersection correctness;
- complete consistent-mapping enumeration;
- uniqueness proof for exact-answer tasks;
- possibility proof for possible-code tasks;
- statement and token order invariance;
- natural sentence quality;
- repeated-skeleton cap;
- no accidental word-token clue from spelling or position.

This checkpoint requires at least 200 English stress seeds per QL during freeze audit.

## 13. Stage 11 — COD-CP-010 conditional-table runtime

Implement `COD-QL-241` to `COD-QL-260`.

Mandatory audits:

- table completeness;
- condition applicability;
- mutually exclusive versus overlapping-condition classification;
- explicit precedence when overlap is allowed;
- complete re-evaluation of every option;
- similar-looking symbol rejection;
- condition-table renderer validation.

This checkpoint requires at least 200 English stress seeds per QL during freeze audit.

## 14. Stage 12 — English chapter-wide audit

After CP-010:

- exact 260-QL continuity;
- exact 54-rule count;
- no duplicate rule IDs;
- no registry holes;
- cross-CP rule-collision scan;
- exact-template and normalized-stem duplicate scan;
- normalized-explanation duplicate scan;
- answer-position distribution;
- difficulty distribution against 91/117/52 target;
- renderer and query-direction coverage;
- independent solver agreement;
- no unresolved placeholders;
- no student-facing internal IDs;
- production build and Question Studio preview build.

Generated review files remain uncommitted unless explicitly needed for editorial resolution. Commit exporters and resolution reports.

## 15. Stage 13 — Hindi and Punjabi localization

Localization order:

1. CP-001 to CP-007 and CP-010 translatable presentation;
2. CP-008 locale-adapted renaming datasets;
3. CP-009 locale-adapted sentence datasets.

Required locale gates:

- script presence;
- no residual English prose except approved operands and notation;
- answer, difficulty and layout parity;
- hidden-system fingerprint parity for translatable CPs;
- equivalent constraint topology for adapted CPs;
- natural native-language editorial review;
- banned terminology scan;
- localized review exports.

Localized QLs remain `MANUAL_REVIEW`, non-publishable and hidden until native-language approval.

## 16. Stage 14 — Question Studio integration

Add COD-001 to Reasoning V1 package discovery only after at least one checkpoint is frozen.

Integration must support:

- package, CP and QL listing;
- locale and difficulty selection;
- deterministic seed preview;
- structured renderer preview;
- reviewer-only hidden fingerprint;
- explanation and option-error metadata;
- review exports;
- maturity and publishability flags.

No checkpoint-specific logic should be hard-coded into the global generation engine beyond stable registry dispatch.

## 17. CI plan

Suggested workflows:

```text
reasoning-cod-001-foundation.yml
reasoning-cod-001-runtime.yml
reasoning-cod-001-localization.yml
reasoning-cod-001-freeze.yml
```

CI reports must distinguish source completion, test execution and human editorial approval.

## 18. Pull-request acceptance template

Every checkpoint PR should state:

- exact QL range implemented;
- exact rule count;
- files added or changed;
- tests written;
- tests actually executed;
- stress-seed count;
- ambiguity and collision result;
- review export location;
- editorial status;
- localization status;
- publishability status;
- known deferred work.

## 19. Immediate next action

After this design branch is reviewed, begin only:

```text
COD-CP-001
COD-QL-001 through COD-QL-024
English runtime proof
```

Do not generate all 260 QLs in one bulk implementation. Each checkpoint must prove its architecture before the next one depends on it.