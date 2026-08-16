# NUM-CP-003 — English Editorial V2 Remediation

## Scope

This controlled review remediates the learner-facing English surface for `NUM-CP-003` while preserving the approved permanent mathematical identities `NUM-QL-001..NUM-QL-017`.

Permanent allocation, hidden-state mathematics, independent answer verification, solve-mode ownership and source evidence remain unchanged.

## Explanation contract

The learner-facing explanation is:

1. **Concept** — briefly identify the exact skill being tested.
2. **Solution** — teach the relevant rule first, then apply that rule to the actual number or number pattern in simple language.
3. **Answer** — show the exact correct option.

For divisibility questions, the preferred flow is explicitly:

> For a number to be divisible by the required divisor without a remainder, state the applicable rule. Then apply the rule to the given number and show why it passes or fails.

Examples:

- divisibility by `9`: first state that the digit sum must be divisible by `9`; then calculate the digit sum of the given number;
- divisibility by `4`: first state that the last two digits must form a number divisible by `4`; then test the actual last two digits;
- divisibility by `36`: first state that the number must be divisible by both `4` and `9`; then apply the last-two-digit and digit-sum rules to the given number;
- missing digit: state the divisibility rule, convert it into a condition on `X`, identify the valid digit(s), and for a unique answer substitute the digit back into the completed number and verify the division exactly;
- ordered pair: state the rule, apply it to the `X/Y` number pattern, then use any extra relation such as `X + Y = k`;
- claim validation: teach and apply only the rule needed to establish the requested correct/incorrect claim, rather than explaining every option unnecessarily.

Generic wording such as “use the rule”, “check the options”, or “the rule is satisfied” without showing the rule and its application is rejected.

## Editorial V2 learner model

- concise Concept → rule-first Solution → Answer;
- natural SSC/Banking learner language;
- rule before calculation;
- actual digits/sum/suffix/remainder shown in the application;
- unique missing-digit answers substituted back and verified exactly;
- no forced shortcut section;
- no forced wrong-option/trap rationales;
- question-specific calculations;
- MathJax-safe learner mathematics;
- 2–4 direct solution lines;
- old four-tier headings and internal engine identities banned.

## Self-review findings remediated

Generated-pack review found and fixed issues that mechanical answer validation would not catch well, including:

- generic Concepts that did not identify what the individual question tested;
- terse solutions such as `Use the digit-sum rule` without teaching the rule;
- direct-divisor questions that became too long by fully explaining every wrong option;
- unique missing-digit solutions that identified a set but did not substitute the answer back into the completed number;
- incomplete evidence before digit/pair counts;
- symbolic rather than substituted linked-arithmetic checks;
- a legacy false ordered-pair explanation that showed `66 ÷ 4 = 16.5` and then called the condition satisfied;
- cryptic composite-rule shorthand such as `36 → 4 + 9`;
- stale fixed-suffix wording and punctuation gaps.

## Final validated rule-first English evidence

Validated code head: `04fbd163f30b747e219c69f9a5770137bacb3ddd`

Dedicated workflow: `Validate NUM-CP-003 English Editorial V2`

- run: `31935605227`
- result: **SUCCESS**
- artifact ID: `9260544252`
- artifact SHA-256: `de655a358b234fa18585ff809898bcbccc773672522dacd637a6944585730309`

Audit coverage:

- `1,360` generated questions (`80 × 17` permanent QLs);
- `68` human-review questions (`4` per QL);
- dedicated rule-first teaching gate enabled;
- terse `Use the rule` / `rule is satisfied` wording rejected;
- retained-runtime regression PASS;
- permanent-allocation regression PASS;
- lifecycle gates remain closed.

## Lifecycle boundary

This remains controlled English review only:

```text
active: false
questionStudioDiscoverable: false
questionBankWritable: false
testEligible: false
publiclyPublishable: false
```

No Question Bank, scored-test, mock-test or public release is authorized. Do not merge or localize until English human review is approved.
