# SYL-001 — Source, Ownership and Merge/Split Audit

Status: **implemented multilingual review runtime; manual editorial approval pending**.

## 1. Audit result

The executable source audit closes the V1 categorical-syllogism inventory at:

- 7 checkpoints;
- 18 permanent review-runtime QLs;
- continuous range `SYL-QL-001` through `SYL-QL-018`;
- 6 source-pattern authorities;
- 36 source-shaped scenario authorities;
- English, Hindi and Punjabi runtime support;
- zero Question Studio, Question Bank, test or public exposure.

The count was not reserved before discovery. It is the retained result after task, answer-contract, semantics, source-pattern, representation and merge/split comparison.

## 2. Source evidence

The source registry records URLs and ownership for:

- SSC A/E/I/O forms, conversion, subalternation and complementary pairs;
- SSC four-option conclusion combinations;
- Banking five-option combinations and either-or;
- Banking possibility questions;
- directional `Only A are B`;
- `A few`, `Only a few` and `Not all` consequences;
- three-conclusion source shapes;
- mixed advanced categorical forms.

The external pages are evidence inputs, not runtime authorities. The frozen ExamTree semantics profile and executable solvers remain the answer authority.

## 3. Versioned semantic amendment

The pre-allocation foundation originally did not infer existence for the predicate class of `No A is B`. Further source verification showed that the targeted Indian competitive-exam convention admits:

```text
No A is B
  -> No B is A
  -> Some A are not B
  -> Some B are not A
```

The profile was amended before chapter implementation:

```text
negativeUniversalPredicateExistence: ASSUMED_BY_SOURCE_PROFILE
noConversion: VALID
```

Both the primary solver and independent verifier now enforce that policy. The amendment is executable and regression-tested.

## 4. Retained QL inventory

| QL | Checkpoint | Retained learner authority |
|---|---|---|
| `SYL-QL-001` | CP-001 | select the definite A/E/I/O conclusion |
| `SYL-QL-002` | CP-001 | select the conclusion that does not necessarily follow |
| `SYL-QL-003` | CP-002 | two-conclusion follow-mask combination |
| `SYL-QL-004` | CP-002 | three-conclusion follow-mask combination |
| `SYL-QL-005` | CP-003 | select a genuine possibility |
| `SYL-QL-006` | CP-003 | select an impossible conclusion |
| `SYL-QL-007` | CP-003 | classify a conclusion as definite, possible or impossible |
| `SYL-QL-008` | CP-004 | two-conclusion combination including either-or |
| `SYL-QL-009` | CP-004 | classify a conclusion pair, including genuine complementarity |
| `SYL-QL-010` | CP-005 | select a definite conclusion from directional-only/identity statements |
| `SYL-QL-011` | CP-005 | two-conclusion combination with directional-only/identity statements |
| `SYL-QL-012` | CP-005 | modal classification with directional-only/identity statements |
| `SYL-QL-013` | CP-006 | select a definite conclusion from few-family/not-all statements |
| `SYL-QL-014` | CP-006 | modal classification from few-family/not-all statements |
| `SYL-QL-015` | CP-006 | two-conclusion combination from few-family/not-all statements |
| `SYL-QL-016` | CP-007 | advanced mixed-form two-conclusion combination |
| `SYL-QL-017` | CP-007 | advanced mixed-form three-conclusion combination |
| `SYL-QL-018` | CP-007 | advanced mixed-form modal classification |

## 5. Merge decisions

The following remain runtime parameters rather than separate QLs:

- two, three, four or five terms;
- two or three displayed premises within the frozen V1 scenario authority;
- linear, branching, converging and mixed graph shapes;
- direct versus non-adjacent term queries;
- category nouns and premise order;
- Easy, Medium and Hard generation;
- English, Hindi and Punjabi;
- answer position;
- source-shaped scenario identity;
- whether the correct definite conclusion is A, E, I or O.

These dimensions do not change the learner task, answer semantic or solver route.

## 6. Split decisions

Separate QLs are retained where one of these changes materially:

- selection versus combination versus modal classification;
- definite versus possible versus impossible answer semantics;
- two-conclusion versus three-conclusion answer mask;
- ordinary four-option combination versus five-option either-or package;
- ordinary A/E/I/O language versus directional-only language;
- ordinary forms versus dual-witness only-a-few/not-all language;
- pair classification versus ordinary combination response;
- advanced mixed-form ownership.

## 7. Explicit exclusions and holds

| Form or family | Disposition |
|---|---|
| plain `Few A are B` | blocked by open semantic conflict; normalizer rejects it |
| `Most/Mostly A are B` | excluded generalized quantifier requiring cardinality/proportion semantics |
| coded syllogism | excluded; requires a separate symbol-language layer |
| reverse syllogism construction | excluded from V1 |
| numerical Venn/set counting | owned by Logical Venn Diagrams |
| unrestricted natural-language propositions | owned by statement-based reasoning families |
| more than five terms or five premises | held outside V1 bounds |

These are governed exclusions, not silently missing runtime cases.

## 8. Answer-template decisions

- SSC-style ordinary combinations use `SSC_FOUR_OPTION_V1`.
- Banking definite/modal forms use `BANK_FOUR_OPTION_V1`.
- Banking either-or/pair classification uses `BANK_FIVE_OPTION_V1`.
- advanced multilingual mixed forms use `CROSS_EXAM_FOUR_OPTION_V1`.
- six-option delivery is not admitted.

Every template is versioned, stored in QL metadata and audited against option count.

## 9. Audit boundary

The implementation is complete as a multilingual review runtime. The following are still intentionally false:

```text
manualEditorialApproval: false
chapterFreezeApproved: false
questionStudioVisible: false
questionBankWritable: false
testEligible: false
publiclyPublishable: false
```
