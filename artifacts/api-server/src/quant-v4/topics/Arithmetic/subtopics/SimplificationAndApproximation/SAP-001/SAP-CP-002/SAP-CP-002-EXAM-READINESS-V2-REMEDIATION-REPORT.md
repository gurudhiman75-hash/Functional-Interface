# SAP-CP-002 — Exam-Readiness V2 Remediation Report

**Package:** `SAP-001`  
**Checkpoint:** `SAP-CP-002`  
**Permanent identities retained:** `SAP-QL-017..SAP-QL-033`  
**Editorial state:** `UNFROZEN_REMODELED_V2_HUMAN_REVIEW_PENDING`  
**Question Studio / bank / test / public state:** disabled

## 1. Governing audit

This remediation implements the findings in `SAP-CP002-300Q-EXAM-READINESS-CRITICAL-REVIEW.md` without replacing the proven exact-rational engine or reallocating permanent QL identities.

The earlier English freeze remains historical evidence. The V2 surface supersedes it for all future review and explicitly remains human-review pending.

## 2. Explanation architecture

The V2 runtime replaces generic cross-task boilerplate with answer-type contracts:

- simplified rational;
- missing integer;
- missing rational;
- comparison statement;
- lowest-term selection;
- first-error selection.

Automated gates reject:

- repeated sentence hashes;
- the known denominator/reverse-calculation/conclusion boilerplate;
- nonnumeric fraction-reduction language in comparison or diagnosis conclusions;
- more than 150 explanation words;
- fewer than two material steps;
- fewer or more than three concrete trap explanations.

Special method routing now includes:

- complete pre-reduction for fraction products;
- invert-divisor-then-cancel for fraction division;
- difference-of-squares identity for paired sum/difference products;
- deepest-layer-outward evaluation for continued fractions.

## 3. Difficulty model

The old fixed 90/150/60 review split is discarded. Difficulty is derived from visible structure:

- fraction count;
- operation count;
- grouping and fraction-bar depth;
- material sign changes;
- reciprocal count;
- inverse, comparison, selection or diagnosis direction;
- number magnitude;
- visible shortcut or cancellation structure.

Each record stores a structural score and evidence list. The 300-question exporter samples validated unique records; it does not assign difficulty by record position.

## 4. Metadata correction

`SAP-QL-029` remains one learner-facing permanent identity, but its executable records now carry precise subtypes:

- `MISSING_NUMERATOR`;
- `MISSING_DENOMINATOR`.

`SAP-QL-020` is presented as `Integer with grouped fraction operation`, removing the misleading suggestion that the authority is mixed-number conversion.

## 5. QL-031 comparison remodel

The V2 surface:

- removes neutral `+ c − c` padding;
- removes `Cannot be determined`;
- uses complete statements such as `A > B`;
- supplies a fourth misconception statement tied to invalid visible-component comparison;
- ends with comparison-specific language only.

## 6. QL-032 reduced-form safety

Correctness is explicitly form-aware:

- numerical equivalence and lowest-term form are separate fields;
- exactly one option must satisfy the complete stem condition;
- an unreduced equivalent appears only in a subset of records;
- whenever it appears, the explanation explicitly rejects it because it is not in lowest terms;
- other records replace the repeated unreduced trap with a value-changing reduction error.

## 7. QL-033 diagnosis remodel

The source expression is labelled `Given`; answer options refer only to transformations:

- `Step 1`;
- `Step 2`;
- `Step 3`;
- `No error`.

The generator now covers:

- fraction addition;
- fraction subtraction;
- multiplication and cancellation;
- division and reciprocal choice;
- mixed-number conversion.

The first invalid transformation can occur at any of the three steps, and fully correct chains can produce `No error`.

## 8. Duplicate and option gates

The 300-question review exporter:

- retains the 17-Ql coverage and 300-record size;
- rejects duplicate mathematical fingerprints within each QL;
- proves unique question IDs and payload fingerprints;
- enforces four distinct option strings;
- enforces one keyed correct option;
- separately counts numerical equivalence and full-condition correctness.

## 9. Review export

The CI workflow generates:

`SAP-CP-002-300-QUESTIONS-AND-EXPLANATIONS-REVIEW-V2.md`

Every record contains:

- permanent QL;
- precise solve subtype;
- feature-derived difficulty score;
- four options;
- correct answer;
- method-specific explanation;
- form-aware option evidence;
- automated validation metrics;
- `PENDING` human-review fields.

## 10. Freeze policy

V2 does not reactivate or publish the checkpoint. Refreeze requires:

1. all automated V2 gates green;
2. review of the newly generated 300-question pack;
3. final `APPROVED`, `REVISE` or `REJECT` decision for every record;
4. regeneration of every revised record under the same version;
5. a final cross-QL authority, repetition and difficulty audit.
