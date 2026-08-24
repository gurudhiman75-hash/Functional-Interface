# SRI — 58-Contract Adversarial English Review R1

**Chapter:** Surds & Indices  
**Stage:** English review before permanent allocation  
**Review-ready retained contracts:** 58  
**Source-supported prototype members represented:** 92  
**Unresolved hold:** `SRI-RG-039 / C008-I`  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Status:** `CORPUS_GENERATOR_IMPLEMENTED_REVIEW_NOT_YET_CLOSED`

## 1. Purpose

Source saturation and exact generation are necessary but insufficient for permanent QL allocation. R1 English review must inspect the **actual generated learner experience** across every prototype member that contributed evidence to the 58 source-supported retained contracts.

A green generator does not prove that:

- the stem is natural and exam-standard;
- a mathematical condition is genuinely necessary rather than decorative;
- the explanation teaches the decisive inference cleanly;
- merged prototypes feel like one learner contract;
- distractors represent plausible misconceptions rather than arbitrary wrong values;
- repeated wording has made the corpus robotic;
- a retained contract still belongs to SRI after learner-facing review;
- a special case deserves an independent permanent QL.

Therefore this stage remains pre-permanent and may still `MERGE`, `SPLIT`, `MOVE`, `REPAIR` or `HOLD` any retained contract.

## 2. Review-set authority

`english-review-r1.ts` derives the review set from:

- `retained-contracts-r1.ts`;
- `source-gate-resolution-r1.ts`;
- `saturation-registry.ts`.

No hand-maintained review list is allowed.

Expected derived state:

```text
Retained groups after compression:        59
Unresolved source-gate groups:             1
English review-ready groups:              58
Executable prototype members overall:     93
Held prototype members:                    1
English review prototype members:         92
```

`C010-F / SRI-RG-047` is included because its source gate was resolved `SOURCE_BACKED_KEEP`.  
`C008-I / SRI-RG-039` is excluded from the freeze-ready corpus and appears only in the HOLD appendix.

## 3. Corpus depth

Two review depths are used deliberately:

### Automated adversarial audit

```text
92 prototype members × 12 deterministic seeds = 1,104 generated questions
```

This larger sample checks structural/editorial stability and diversity.

### Manual reviewer export

```text
92 prototype members × 3 deterministic seeds = 276 review questions
```

The export is produced as JSON, CSV and Markdown. Three rows per **prototype member**, rather than three rows per retained group, are required because a compressed group may contain several formerly separate discovery prototypes. Review must confirm that those prototypes genuinely belong under one learner contract.

## 4. Automated English gate

`tests/english-review-r1.test.ts` must prove:

- exactly 58 review-ready retained groups;
- exactly one held group, RG039;
- exactly 92 review prototype members;
- C008-I absent from review-ready records;
- C010-F present;
- all 12 owner checkpoints represented;
- deterministic generation and immutable review seeds;
- discovery validation remains green;
- exact solver/verifier agreement;
- domain validity;
- exactly four canonical-unique options;
- exactly one correct option;
- three misconception-backed distractors;
- no internal retained-group/prototype/seed/verifier/proof metadata in learner text;
- no `NaN` or malformed fraction TeX;
- non-empty given / asked / method / working / final answer;
- the explanation does not repeat the complete stem as its given section;
- no exact cross-member stem collisions;
- at least three distinct stems per prototype member over the audit sample;
- correct-option positions are not concentrated;
- answer variation where the learner contract should vary;
- explicit fixed-semantic invariance where variation would be mathematically wrong;
- exactly three exported review rows per prototype member.

The word **“Undefined” is not metadata leakage**. It is a legitimate learner-facing answer for zero-base domain questions and must remain available when mathematically correct.

## 5. Manual adversarial review questions

For each retained group, reviewers must answer all of the following from the generated corpus.

### Contract validity

1. Does every member prototype require the retained group’s governing inference?
2. Is any condition decorative or redundant?
3. Does any member have a materially different answer semantic or domain burden that justifies a split?
4. Is any member merely a parameter/representation variant that should stay merged?
5. Does any question’s dominant burden actually belong to Algebra, Number System, Simplification, or another chapter?

### Stem quality

1. Is the question immediately understandable without internal terminology?
2. Does it sound like a competitive-exam question rather than generator prose?
3. Are mathematical domains and constraints stated only when needed?
4. Is notation consistent and unambiguous?
5. Is there enough surface variation without manufacturing artificial QLs?

### Options and distractors

1. Is exactly one option mathematically correct under the stated domain?
2. Are the three wrong choices plausible consequences of identifiable misconceptions?
3. Are any options equivalent under normalization despite different visible text?
4. Is option length/structure accidentally giving away the answer?

### Explanation quality

1. Does the explanation say what is given and what must be found?
2. Does it name the decisive method in ordinary human language?
3. Does the working use the actual values/state from the question?
4. Does it avoid formula-wall presentation?
5. Does it avoid repeating the entire question?
6. Does it stop after the answer is established instead of adding unnecessary textbook commentary?

## 6. Known editorial risks to inspect deliberately

R1 saturation already suggests several areas that deserve extra attention in the 276-question corpus:

- excessive use of generic openers such as “Evaluate”, “Simplify”, “Compare” or “Which option” within one prototype family;
- explanations containing engineering-flavoured phrases such as “canonical result”, “normalize” or “verification” where simpler learner language is available;
- rationalisation solutions becoming mechanical formula chains without explaining why the conjugate is chosen;
- domain questions becoming definition quizzes rather than applied reasoning;
- comparison questions relying on “without decimals” wording too often;
- merged groups where one prototype may visibly feel harder/deeper than its siblings even though the mathematical authority is shared;
- repeating-radical questions needing a clear convergence/admissibility explanation rather than merely solving a quadratic fixed point;
- extraneous-root questions needing original-equation checking to be explicit and easy to follow;
- mixed surd-index questions becoming long BODMAS chains that should instead be Simplification-owned.

These are review targets, not assumptions that defects exist in every affected family.

## 7. HOLD appendix policy

`SRI-RG-039 / C008-I` remains outside the 58-contract freeze-ready set because direct target-exam provenance for the **condition-target** form is still insufficient.

Its executable question may be shown in a HOLD appendix for future source comparison, but:

- it must not count toward English review closure;
- it must not receive a permanent QL ID;
- it must not be used to justify chapter freeze;
- a future source-resolution wave may promote or drop it without disturbing the 58-contract review corpus.

## 8. Current decision

```text
Source saturation closed:                  YES
93→59 compression closed:                  YES
Source-supported retained contracts:        58
Unresolved holds:                            1
English corpus generator implemented:      YES
Automated English gate green:          PENDING
276-question corpus generated:         PENDING
Adversarial corpus review closed:       PENDING
Permanent allocation authorised:            NO
English frozen:                              NO
Question Studio / QB / tests / public:      OFF
```

No permanent IDs may be allocated merely because the automated English gate becomes green. The generated corpus must first be inspected and the findings recorded in this authority or a follow-up closure audit.
