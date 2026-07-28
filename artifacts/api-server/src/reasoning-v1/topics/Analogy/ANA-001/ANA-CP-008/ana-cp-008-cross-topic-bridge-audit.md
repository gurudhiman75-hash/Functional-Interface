# ANA-CP-008 Cross-Topic Bridge Audit

Status: **PARTIALLY MECHANICAL — FREEZE BLOCKERS RECORDED**

## 1. Purpose

ANA-CP-008 reuses alphabet and arithmetic operations that also appear in neighboring reasoning checkpoints. Shared foundations are expected; duplicated question ownership is not.

This audit separates:

- an allowed component operation delegated to another checkpoint;
- a complete relation that collapses into another checkpoint;
- a bridge that can be tested mechanically now;
- a bridge that remains blocked because no compatible matcher exists.

## 2. Core ownership test

A mixed relation remains CP-008 only when:

1. the complete typed evidence uniquely matches one CP-008 rule/context;
2. every visible letter component is indispensable;
3. every visible number component is indispensable;
4. mutating either domain destroys every registered complete CP-008 relation;
5. any CP-005/006 match explains only the letter component, not the complete question;
6. task grammar remains analogy transfer rather than coding, word-value, numeric-only, or meta-progression reasoning.

## 3. Executable bridge: CP-005 single-letter analogy

Available matcher:

```ts
matchingAlphabetRules(pairs)
```

### Expected overlap

`LETTER_NUMBER → LETTER_NUMBER` and `NUMBER_LETTER → NUMBER_LETTER` relations may use a letter shift that independently matches a CP-005 rule.

This is allowed component delegation when:

- the number also changes under a stable CP-008 operation;
- changing the number destroys the complete mixed relation;
- changing the letter destroys the complete mixed relation;
- the displayed task is mixed analogy transfer.

### Rejection boundary

Reject or delegate to CP-005 when:

- the number is unchanged or decorative;
- any number can be substituted without affecting the answer;
- the complete question can be solved without examining the number;
- the stem is actually a pure single-letter analogy with incidental numeric text.

### Mechanical status

`provisional-cross-topic-bridge-audit.ts` calls the real CP-005 matcher and records component matches. It does not treat a component match as a collision when complete mixed dependency is proven.

## 4. Executable bridge: CP-006 cluster analogy

Available matcher:

```ts
matchingClusterRules(pairs)
```

### Expected overlap

Cluster-first and number-first mixed relations may use CP-006-owned letter operations such as:

- uniform shift;
- positional vector shift;
- progressive or alternating shift where source-backed;
- other named cluster operations admitted by the mixed context.

CP-008 owns only the complete combined relation. CP-006 continues to own the pure cluster operation.

### Rejection boundary

Reject or delegate to CP-006 when:

- the number is unchanged or decorative;
- the complete answer follows from the cluster operation alone;
- number mutation leaves the relation valid;
- a letters-only cross-domain candidate collapses into a complete CP-006 rule.

### Mechanical status

The bridge audit calls the real CP-006 matcher for complete letter-component evidence. For mixed tokens, matches are classified as delegated components. For a candidate with no visible number domain, any complete CP-005/006 match is a failure.

## 5. Native component-indispensability proof

For every one of the 81 current CP-008 contexts, the executable audit attempts all applicable mutations:

- input letter mutation;
- output letter mutation;
- input number mutation;
- output number mutation.

A component is considered indispensable only when at least one bounded plausible mutation causes the complete evidence to match no registered CP-008 rule.

The audit also requires:

- visible input and output letters to change where both exist;
- visible input and output numbers to change where both exist;
- unique intended context matching before mutation;
- no duplicate summary keys;
- actual CP-005 and CP-006 bridge coverage.

This complements, rather than replaces, direct-option and presentation ambiguity audits.

## 6. Numeric analogy bridge

### Current repository status

The numeric analogy checkpoints do not currently expose one stable, shared matcher equivalent to:

```ts
matchingNumericRules(evidence)
```

Some numeric generators and tests exist, but their contracts are not yet suitable for a reliable cross-check import.

### Current protection

Until a unified numeric matcher exists, CP-008 relies on:

- typed mixed inputs rather than number-only inputs;
- letter-component indispensability mutations;
- complete CP-008 matching;
- rejection of ignored-letter distractors;
- source ownership review.

### Freeze status

**BLOCKED FOR FULL MECHANICAL FREEZE.**

Before permanent CP-008 freeze, either:

1. expose a stable numeric analogy matcher and run it against the numeric projections; or
2. formally document why the relevant numeric checkpoints cannot produce a competing complete relation for each admitted CP-008 solve contract.

## 7. CP-007 word analogy bridge

### Ownership boundary

CP-007 owns meaningful-word-native structure, including word-value and semantic/structural transforms.

CP-008 owns typed letter groups and mixed tokens when:

- the input is not being interpreted as a meaningful word;
- every displayed number participates in the analogy;
- the operation is defined over positions/components rather than lexical meaning or word structure.

### Current mechanical status

CP-007 has targeted collision audits but no single generic matcher for every word authority.

Current CP-008 pilot inputs use bounded letter groups and mixed clusters, not a curated meaningful-word registry.

### Freeze status

**DOCUMENTED BOUNDARY; GENERIC MECHANICAL BRIDGE PENDING.**

A permanent generator should either exclude enabled CP-007 words from generic cluster pools or explicitly run relevant CP-007 matchers when meaningful strings are permitted.

## 8. Coding-Decoding bridge

### Ownership boundary

Delegate to Coding-Decoding when the task asks the student to:

- infer a code table;
- encode or decode a new term;
- use direct “coded as” grammar;
- recover symbol or substitution semantics;
- use reverse-position word coding;
- solve common-code fragments.

CP-008 remains analogy when the complete relationship is transparently transferred from one or more analogy pairs.

### Current mechanical status

No unified Coding-Decoding matcher is available for import.

### Freeze status

**GRAMMAR AND SOURCE REVIEW REQUIRED.**

Permanent stems must be audited to prevent coding grammar even when the arithmetic is identical.

## 9. CP-009 advanced/meta analogy bridge

### Ownership boundary

Delegate to CP-009 when:

- the letter or numeric operation changes by evidence-pair index;
- the relation is a progression across three or more complete pairs;
- no one stable pair-local context explains all evidence;
- the student must infer a meta-rule over relations.

Known delegated form:

```text
ZKX102 : UHW204 :: XYR126 : OVU252 :: LST305 : QPI610
```

### Current mechanical status

No production CP-009 matcher is available.

### Freeze status

**DOCUMENTED DELEGATION; FUTURE MATCHER BRIDGE REQUIRED.**

## 10. Bridge classification by candidate solve group

| Candidate group | CP-005 | CP-006 | Numeric | CP-007 | Coding | CP-009 |
|---|---|---|---|---|---|---|
| letter-group sum/product to scalar | not applicable | output-domain mismatch | numeric output only, but input is letters | word-value boundary | coding grammar boundary | not progressive |
| sum to derived letter | possible pure-letter collision; mechanically rejected | possible cluster collision; mechanically rejected | not applicable | non-word group required | position-code grammar boundary | not progressive |
| single-letter position square | input letter only; output number | not applicable | numeric output only | not applicable | direct-code grammar boundary | not progressive |
| independent letter-number delta | component bridge expected | not applicable | number delta component | not word-native | grammar boundary | stable pair-local |
| shared cluster-number delta | not applicable | component bridge expected | number delta component | meaningful strings excluded | grammar boundary | stable pair-local |
| independent cluster vector + delta | not applicable | component bridge expected | number delta component | meaningful strings excluded | grammar boundary | stable pair-local |
| cluster vector + multiplier | not applicable | component bridge expected | multiplier component | meaningful strings excluded | grammar boundary | stable pair-local |
| cluster vector + power/root | not applicable | component bridge expected | power/root component | meaningful strings excluded | grammar boundary | stable pair-local |
| digit-sum-square successor | component shift may fit accidentally | not applicable | digit operation component | not word-native | coding grammar risk | stable pair-local |
| number-first multiplier/root | not applicable | component bridge expected | multiplier/root component | meaningful strings excluded | grammar boundary | stable pair-local |

## 11. Current bridge verdict

```text
CP-005 matcher bridge: EXECUTABLE
CP-006 matcher bridge: EXECUTABLE
Visible-component indispensability: EXECUTABLE
Numeric analogy bridge: BLOCKED / NEEDS MATCHER OR FORMAL PER-GROUP PROOF
CP-007 generic bridge: PARTIAL / OWNERSHIP BOUNDARY DOCUMENTED
Coding-Decoding bridge: GRAMMAR/SOURCE REVIEW ONLY
CP-009 bridge: DELEGATION DOCUMENTED, MATCHER PENDING
Permanent QL freeze: NOT READY
```

## 12. Next bridge work

1. run the new executable bridge audit in dedicated CI;
2. inspect its CP-005/006 match summaries and any failed contexts;
3. expose or design a stable numeric analogy matcher;
4. decide whether permanent mixed generators may emit meaningful words;
5. add student-facing grammar lint for Coding-Decoding wording;
6. add a CP-009 bridge when its pair-progression matcher exists;
7. rerun the bridge suite after permanent solve-contract splits are proposed.
