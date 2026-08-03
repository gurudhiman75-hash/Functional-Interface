# SAP-CP-001 — English Manual Freeze and ID-Free Template Proposal

**Package:** `SAP-001`  
**Checkpoint:** `SAP-CP-001`  
**Discovery authorities:** 17  
**Design solve modes:** 18  
**Proposed English template families:** 16  
**Permanent QLs:** 0  
**Question Studio / Question Bank / test / public exposure:** disabled

## 1. Freeze decision

The English learner-facing surface is approved for an ID-free count proposal.

This approval covers:

- exam-style stem wording;
- student-readable explanations;
- misconception-linked distractor descriptions;
- exact answer and independent-check consistency;
- repetition control;
- within-checkpoint difficulty calibration;
- cross-wave merge/split decisions;
- three mathematically distinct review samples per discovery authority;
- lifecycle isolation.

It does not allocate permanent `SAP-QL-*` identities and does not authorise Question Studio, Question Bank, mock-test or public use.

## 2. Editorial defects found and corrected

### 2.1 Repetitive direct stems

The discovery runtimes used a single repeated frame such as `Find the exact value of ...`.

The reviewed English layer now rotates four concise exam-authentic frames:

```text
Simplify: ...
Find the value of ....
Evaluate: ...
What is the exact value of ...?
```

Comparison, equivalent-expression, valid-step, incorrect-step and partial-evaluation tasks each receive four task-specific frames. Stem variation is treated as editorial representation, not as a new QL.

### 2.2 Internal engineering language

Some discovery explanations and option analyses contained terms such as AST, canonical evaluator, independent verifier and RPN.

The reviewed layer removes these from all learner-visible fields. Technical evidence remains available only in the review details.

### 2.3 Raw evaluator traces

Discovery traces used an internal delimiter such as `left | right`.

English explanations now convert each operation into a natural step, for example:

```text
Multiply 6 by 4 to get 24.
Subtract 9 from 31 to get 22.
Treat ‘of’ as multiplication: 3 × 8 = 24.
```

### 2.4 Generic answer rationales

Correct-option notes no longer say that an answer matches an internal solver. They now state the learner-facing reason: correct order, preserved value, correct relation or valid step condition.

### 2.5 Difficulty evidence

Difficulty remains deterministic but is now represented as a multi-axis profile:

- material precedence or scope decisions;
- representation load;
- signed-arithmetic risk;
- diagnostic load;
- arithmetic load.

Calibration is approved within `SAP-CP-001`. Chapter-wide cross-checkpoint calibration remains a later audit.

## 3. Merge/split decisions

### Merged into one English template family

```text
SAP-CP001-PROT-NESTED-GROUPING
SAP-CP001-PROT-REPEATED-GROUPING
```

Both test the same governing inference: nesting determines scope and redundant outer grouping does not change value. Repeated grouping remains a representation subtype.

### Retained separately

- multiplication/division left-to-right versus addition/subtraction left-to-right;
- unary negative parsing versus propagation of a negative intermediate;
- fraction-bar scope versus ordinary bracket scope;
- scoped `of` versus implicit coefficient–group multiplication;
- power precedence versus factorial precedence;
- direct evaluation versus comparison or expression selection;
- first valid step versus first incorrect step;
- partial-subexpression evaluation versus ordinary forward evaluation.

These pairs differ in misconception structure, learner action, evidence or explanation route.

## 4. Count-bearing proposal

The audit produces 16 ID-free template families from 17 executable authorities.

```text
1. Mixed order of operations
2. Multiplication/division left to right
3. Addition/subtraction left to right
4. Grouping and bracket scope
5. Unary signed operand
6. Negative intermediate propagation
7. Scoped ‘of’ multiplication
8. Implicit coefficient–group multiplication
9. Fraction-bar scope
10. Power before surrounding arithmetic
11. Factorial before surrounding arithmetic
12. Compare different groupings
13. Select an equivalent grouping
14. Identify the first valid step
15. Identify the first incorrect step
16. Complete a partially simplified expression
```

This count is the result of the audit, not a target. Every proposal entry retains `permanentQlId: null`.

## 5. Review export

The review export contains three mathematically distinct candidates for each of the 17 discovery authorities:

```text
Easy samples:   17
Medium samples: 17
Hard samples:   17
Total:          51
```

Each item includes:

- temporary authority and proposed template identity;
- exact English question and options;
- correct answer;
- hidden mathematical state;
- expression or task state;
- canonical trace;
- independent stack-evaluation evidence;
- difficulty evidence and calibrated profile;
- misconception analyses;
- source ancestry;
- lifecycle locks;
- editorial decision and comments.

## 6. Automated freeze proof

The authority proof evaluates 100 deterministic states for each discovery authority.

```text
Authorities:                  17
English candidates:           1,700
Approved stem frames:         4 per authority
Review export items:          51
Proposed template families:   16
Permanent QLs:                0
```

Zero tolerance applies to:

- canonical/independent answer mismatch;
- duplicate options;
- incorrect answer index;
- internal terminology in learner text;
- raw evaluator delimiters;
- placeholders;
- missing misconception evidence;
- missing explanation sections;
- stem-frame collapse;
- missing Easy/Medium/Hard states;
- lifecycle leakage.

## 7. Current gate

```text
Executable discovery:          complete
Source/design saturation:      complete
English manual freeze:         approved
ID-free count proposal:        16 templates
Permanent allocation:          blocked pending product approval
Question Studio:               disabled
Question Bank:                 not stored
Test/public eligibility:       ineligible
```

The next permitted action is explicit approval or revision of the 16-template proposal. Permanent identities must not be created silently.
