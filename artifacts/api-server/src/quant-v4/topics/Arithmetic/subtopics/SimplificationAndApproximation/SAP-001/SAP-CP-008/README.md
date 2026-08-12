# SAP-CP-008 — Approximate Sums, Differences and Mixed Operation Chains

**Branch:** `feat/sap-cp008-additive-approximation-foundation`  
**Base:** inactive CP-007 human-review candidate  
**Lifecycle:** provisional / inactive / no permanent QL allocation / human semantic review required

## Frozen learner boundary

CP-008 owns additive or additive-dominant estimation under an explicit terms-first approximation policy. The learner rounds the stated terms first and then evaluates the resulting sum, difference or bounded mixed-operation chain.

The runtime policy is machine-declared as:

`ROUND_EACH_DECLARED_TERM_THEN_EVALUATE`

The policy stage is also stated in every learner stem. CP-008 therefore never relies on an unstated choice between rounding the terms first and rounding only the final answer.

Multiplicative-dominant estimation belongs to CP-009.

## Current candidate solve identities — 18

Candidate coordinates only:

1. `SAP-QL-129` — approximate integer sum;
2. `SAP-QL-130` — approximate integer difference;
3. `SAP-QL-131` — signed additive chain;
4. `SAP-QL-132` — bracketed additive chain;
5. `SAP-QL-133` — decimal sum with terms rounded to nearest integer;
6. `SAP-QL-134` — decimal difference with terms rounded to nearest integer;
7. `SAP-QL-135` — compatible rounded addend pair for a stated place;
8. `SAP-QL-136` — additive-dominant add-multiply estimate;
9. `SAP-QL-137` — additive-dominant divide-add estimate with compatible numerator;
10. `SAP-QL-138` — bounded additive-dominant BODMAS estimate;
11. `SAP-QL-139` — missing rounded addend under approximate equality;
12. `SAP-QL-140` — missing rounded subtrahend under approximate equality;
13. `SAP-QL-141` — nearest option for an additive estimate;
14. `SAP-QL-142` — certified exact-sum interval from rounded addends;
15. `SAP-QL-143` — certified exact-difference interval from rounded terms;
16. `SAP-QL-144` — overestimate / underestimate classification;
17. `SAP-QL-145` — compare two additive estimates, including `<`, `=` and `>`;
18. `SAP-QL-146` — diagnose an invalid rounding direction.

The permanent SAP registry remains unchanged at `SAP-QL-001..052`.

## Safety and ownership guards

The generator rejects or avoids:

- uncontrolled subtraction of nearly equal rounded quantities;
- denominator states that can round to zero;
- any stem whose approximation stage is ambiguous;
- multiplicative-dominant estimation disguised by incidental addition;
- significant-figure material not owned by this checkpoint.

Difference-bound states are kept safely away from near-cancellation and independently prove their endpoint directions. For positive half-open nearest-place rounding bands, the current difference family correctly uses open lower and upper bounds.

## Executable proof status

### Mathematical authority

**1,800 deterministic cases = 100 seeds × 18 identities.**

It independently verifies:

- the stated rounding map;
- sum/difference and signed/bracketed evaluation;
- decimal estimation;
- compatible addends;
- additive-dominant mixed chains;
- direct inverse substitution;
- nearest-option estimate;
- sum and difference bound endpoints;
- over/under classification;
- all three comparison relations;
- invalid-rounding diagnosis;
- 100 distinct visible stems per identity;
- 1,800 unique payloads and generation identities;
- exactly 450 correct answers in each A/B/C/D position;
- candidate range `SAP-QL-129..146`;
- inactive lifecycle.

### Editorial parity authority

The student-surface layer is checked across the same **1,800 states** against the mathematical runtime. It proves that wording changes preserve:

- canonical mathematical answer;
- correct option position;
- option values;
- mathematical oracle data;
- unique payloads;
- explicit terms-first policy.

It also requires natural integer answers for nearest-integer decimal estimation, varied policy wording, cleaner compatible-pair questions, natural inverse wording and clearer bounds/diagnosis stems.

### Student-explanation authority

A further **1,800-state explanation parity pass** proves that stems, answers, options, worked steps and answer positions remain unchanged while student-facing concept/verification text contains no internal engine vocabulary such as `oracle`, `CP-008`, `learner route`, `transformed expression`, scaled-term machinery or near-cancellation guard language.

## Final 300-question human-review gate

The final review corpus contains exactly **300 unique English questions across all 18 identities**:

- first 12 identities: 17 questions each;
- final 6 identities: 16 questions each;
- exactly 75 A / 75 B / 75 C / 75 D correct positions;
- no three-answer-position streak;
- both nearest-ten and nearest-hundred states in key additive/bound families;
- all `A < B`, `A = B`, `A > B` comparison outcomes;
- both overestimate and underestimate outcomes;
- mathematical, editorial and explanation parity inherited from the full authorities.

Manual inspection of the generated artifact additionally led to these remediations:

- decimal estimates now display integer results such as `241`, not `241.0`;
- policy wording is varied while remaining explicit;
- compatible-addend answers are natural pairs rather than generator-like equations;
- divide-add stems use `nearest multiple of 20/50` wording;
- missing-value stems ask directly for the rounded value of the box;
- sum/difference bound stems describe the rounded observations naturally;
- internal implementation terminology was removed from explanations and option diagnostics;
- the sum-bound verification was corrected so it no longer contains irrelevant difference/near-cancellation text.

## Source and ownership note

The SAP source audit explicitly retains **approximate sum/difference** under CP-008. The broader frozen authority admits the additional additive consequences above. Multiplicative estimation remains delegated to CP-009.

## Lifecycle lock

Every candidate remains:

- `permanentQlId: null`;
- `contentStatus: "ENGLISH_REVIEW_CANDIDATE"`;
- `active: false`;
- `questionStudioDiscoverable: false`;
- `questionBankWritable: false`;
- `testEligible: false`;
- `publiclyPublishable: false`.

No permanent QL allocation, merge or activation is permitted until the dependent CP-004 through CP-007 semantic gates and this CP-008 human review are explicitly approved.
