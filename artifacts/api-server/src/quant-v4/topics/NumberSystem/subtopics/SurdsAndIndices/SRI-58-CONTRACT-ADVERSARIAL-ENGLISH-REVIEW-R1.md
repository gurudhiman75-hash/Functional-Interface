# SRI — 58-Contract Adversarial English Review R1

**Chapter:** Surds & Indices  
**Stage:** Pre-allocation English review of retained learner contracts  
**Review-ready retained contracts:** 58  
**Source-supported prototype members represented:** 92  
**Unresolved hold:** `SRI-RG-039 / C008-I`  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Status:** `PRE_ALLOCATION_ENGLISH_REVIEW_R1_CLOSED_PERMANENT_ALLOCATION_READY`

## 1. Purpose

Source saturation and exact generation are necessary but insufficient for permanent QL allocation. R1 English review inspects the **actual generated learner experience** across every prototype member that contributed evidence to the 58 source-supported retained contracts.

This is deliberately a **pre-allocation** review. It proves that the retained contract set is fit to enter the permanent-allocation wave; it is not the final Phase-7 English approval/fingerprint freeze defined by `SRI-END-TO-END-DESIGN-R1`.

A green generator by itself does not prove that:

- the stem is natural and exam-standard;
- a mathematical condition is genuinely necessary rather than decorative;
- the explanation teaches the decisive inference cleanly;
- merged prototypes feel like one learner contract;
- distractors represent plausible misconceptions rather than arbitrary wrong values;
- repeated wording has made the corpus robotic;
- a retained contract still belongs to SRI after learner-facing review;
- a special case deserves an independent permanent QL.

Therefore this stage was allowed to `MERGE`, `SPLIT`, `MOVE`, `REPAIR` or `HOLD` retained contracts before permanent IDs existed.

## 2. Review-set authority

`english-review-r1.ts` derives the review set from:

- `retained-contracts-r1.ts`;
- `source-gate-resolution-r1.ts`;
- `saturation-registry.ts`.

No hand-maintained review list is allowed.

Closed derived state:

```text
Retained groups after compression:        59
Unresolved source-gate groups:             1
English review-ready groups:              58
Executable prototype members overall:     93
Held prototype members:                    1
English review prototype members:         92
```

`C010-F / SRI-RG-047` is included because its source gate was resolved `SOURCE_BACKED_KEEP`.  
`C008-I / SRI-RG-039` remains excluded from the allocation-ready corpus and appears only in the HOLD appendix.

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

`tests/english-review-r1.test.ts` proves:

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
- no generic checkpoint-level `Given` fallback;
- no mechanical `Given` wrappers such as `The supplied relation is If/Given/Using/For/From/Let/After`;
- no task instructions leaking into the `Given` sentence;
- exactly three exported review rows per prototype member.

The word **“Undefined” is not metadata leakage**. It is a legitimate learner-facing answer for zero-base domain questions and remains available when mathematically correct.

### Closure evidence

Final audited branch head before this closure record:

```text
head:                         dca2ba339ba173d056e71e43dfd61e856c30938b
workflow run:                 32721267235
job:                          97413004715
status:                       PASS
review-ready groups:          58
held groups:                  SRI-RG-039
review prototype members:     92
audit seeds/member:           12
audit questions:              1,104
export seeds/member:          3
export rows:                   276
generic Given fallbacks:      0
minimum unique stems/member:  3
minimum correct positions:    4
permanent QLs:                0
frozen solve modes:           0
```

Final reviewer artifact:

```text
artifact id:                  9517917702
artifact name:                sri-v4-english-review-r1
artifact SHA-256:             493b6286fef1ee8cba61c9f04753e14774fd6b8e51a6f8ccbbc3c807efbbc43c
files:                        JSON / CSV / Markdown
```

## 5. Manual adversarial review questions

For each retained group, review considered the following.

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

## 6. Closure findings and remediation

The adversarial pass did find learner-facing defects, and R1 was not closed until they were removed.

### Remediated during R1

- checkpoint-level generic `Given` fallbacks were replaced with question-specific summaries derived only from visible learner data;
- parser coverage was expanded across all discovered stem topologies rather than fixed one seed at a time;
- legacy surfaces were regression-checked so the rewrite did not lose previously supported wording;
- engineering terms such as `canonical`, `normalize`, `reverse-constructed`, `prime base` and internal review/runtime identifiers were removed from learner text;
- awkward wrappers such as `The supplied relation is If ...`, `Given ...`, `Using ...`, `For ...`, `From ...`, `Let ...` and `After ...` were rewritten into direct human statements;
- task fragments such as `by using a common base`, `between consecutive integers without decimals`, `into simplest form` and coefficient-recovery instructions were removed from the `Given` field;
- rationalisation coefficient forms and extraneous-root summaries were rewritten as explicit learner-visible mathematical relations;
- `canonical rationalised form` was replaced by ordinary exam-facing language;
- malformed ordinals and display residue such as `1th`, `2th`, `3th` and `1\sqrt{...}` are gated out.

### Final 276-row manual sweep

The final fresh artifact was inspected after the stricter prose gate passed.

Observed final state:

```text
rows:                                      276
prototype members:                         92
retained groups:                           58
cross-member exact stem collisions:         0
mechanical Given guard hits:                0
internal/editorial jargon hits:             0
malformed fraction/ordinal residue hits:    0
generic Given fallbacks:                    0
```

Simple direct-law questions may have compact formula-only working lines, but they retain an ordinary-language method sentence that explains the governing inference. No remaining formula-wall defect required another contract split or editorial repair.

No new `SPLIT`, `MOVE` or `DROP` decision was justified by the final learner-facing corpus. The 58 source-supported retained contracts remain the allocation-ready contract set.

## 7. HOLD appendix policy

`SRI-RG-039 / C008-I` remains outside the 58-contract allocation-ready set because direct target-exam provenance for the **condition-target** form is still insufficient.

Its executable question may be shown in a HOLD appendix for future source comparison, but:

- it does not count toward this English review closure;
- it must not receive a permanent QL ID in the upcoming allocation wave;
- it must not be used to justify chapter freeze;
- a future source-resolution wave may promote or drop it without disturbing the 58-contract allocation-ready corpus.

## 8. Closure decision

```text
Source saturation closed:                       YES
93→59 compression closed:                       YES
Source-supported retained contracts:             58
Unresolved holds:                                 1
Pre-allocation English corpus implemented:       YES
Automated English gate green:                    YES
276-question corpus generated:                   YES
Adversarial retained-contract review closed:     YES
Permanent allocation wave may begin:             YES
Permanent QLs allocated:                          0
Final Phase-7 English approval/freeze complete:   NO
English frozen:                                   NO
Question Studio / QB / tests / public:           OFF
```

This closure authorizes a **separate permanent-allocation wave** for the 58 retained contracts. It does not itself allocate IDs, freeze solve modes, freeze English content fingerprints, localise Hindi/Punjabi, or enable any downstream product capability.

Per `SRI-END-TO-END-DESIGN-R1`, the next wave must allocate contiguous package-local permanent QLs, regenerate representative English review evidence against those permanent IDs, independently re-solve high-risk samples, inspect object-pool/key distribution again, obtain explicit final English approval, and only then freeze English fingerprints.
