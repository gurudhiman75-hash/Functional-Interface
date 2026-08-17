# TMW-001 Post-R3 Independent Exam-Readiness & Exhaustiveness Audit

## Verdict

`NO_GO_FOR_PUBLICATION_REQUIRES_R4_EDITORIAL_AND_COVERAGE_REMEDIATION`

The mathematical/runtime architecture is strong and unusually broad, but the chapter is **not yet at the final student-facing standard expected for SSC, Banking and Punjab-state mocks**.

R1/R2/R3 have successfully removed known correctness blockers and established complete multilingual runtime parity across the frozen 211-QL inventory. The post-R3 audit, however, found two different classes of remaining work:

1. **learner/editorial quality defects** that automated validity gates do not detect; and
2. **exhaustiveness gaps** between the original end-to-end design/reference corpus and the final 211-QL implementation.

Publication, Question Studio routing, Question Bank writes and test eligibility must remain disabled until R4 closes the items below and a fresh audit passes.

---

## 1. Evidence used

This audit uses four independent evidence layers:

1. the frozen post-R3 runtime on `fix/tmw-001-remediation-r3-cp007-cp011`;
2. a fresh deterministic export of **633 student-facing packages** (`211 QLs × English/Hindi/Punjabi`);
3. the original `TMW-001-END-TO-END-DESIGN-BLUEPRINT.md`, which explicitly treats its solve-mode inventory as an exhaustive discovery baseline rather than a quota;
4. uploaded competitive-exam references including Disha SSC Mathematics and Arun Sharma quantitative aptitude material.

The exported audit corpus is produced by `tmw-001-post-r3-audit-export.ts` and retained in the R3 workflow evidence artifact.

---

## 2. What is already strong

### 2.1 Mathematical coverage

The implemented chapter already has **211 permanent QLs** across 11 checkpoints and covers nearly every important mathematical backbone required by competitive exams:

- direct work-rate-time relations;
- combined positive and signed rates;
- pairwise-rate reconstruction;
- efficiency/time inverse relations and percentage changes;
- joining, leaving, handoffs and staged progress;
- alternating days, periodic schedules and terminal fractions;
- workforce × days × hours × efficiency equivalence;
- planned-versus-actual progress and overtime;
- men/women/children and heterogeneous worker/machine equivalence;
- contribution-based wages and piece-rate payment;
- inlets, outlets, leaks, capacity and initial-level problems;
- delayed/staged/cyclic pipe operation;
- variable arithmetic/geometric/piecewise daily productivity.

### 2.2 Correctness and safety

The post-R3 export produced 633/633 valid packages. R1 blocker regression, R2 learner regression, R3 learner regression and full multilingual parity remain green. All packages retain `publiclyPublishable: false`.

### 2.3 Reference alignment already achieved

The uploaded SSC material includes classic patterns such as men/women/children equivalence and wage division, combined pair rates, positive/negative work, and leak-time recovery. Those families are represented in CP-002, CP-007, CP-008 and CP-009 rather than being missing wholesale.

---

## 3. MAJOR editorial finding — R2 learner working is still mechanically templated

The learner V2 contract is structurally correct, but CP-001 through CP-006 explanations remain noticeably generator-like.

Across the English post-R3 export:

- **127/127** QLs use the generic closing wording `After simplification, the required value is ...` in the sampled learner solution;
- **126/127** use `Continue the calculation with the remaining quantity ...`;
- CP-001 repeatedly uses phrases such as `Substitute the work, rate and time values given in the question: \(4\)` even when that line is not a meaningful mathematical step by itself.

Example problem:

- `TMW-QL-001` asks for output from 10 booklets/day for 4 days.
- The current learner solution separately presents `\(4\)`, then `\(10\times4\)`, then `\(10\)` before the answer.

This is mathematically harmless but pedagogically weak. A student-quality solution should instead say something like:

1. Daily output = 10 booklets.
2. In 4 days, output = `10 × 4 = 40` booklets.
3. Therefore, total output = 40 booklets.

### Required R4 action

Replace generic extraction-based prose for CP-001..006 with **QL/family-aware worked-step renderers**. The existing exact solver values should remain authoritative; only learner rendering changes.

---

## 4. MAJOR editorial finding — R3 working is too symbol-heavy and sometimes under-explained

CP-007 through CP-011 learner V2 is shorter, but many solutions expose internal algebra symbols without enough student-facing meaning.

Examples from the fresh export include:

- CP-007: `e=6, e=3, e=2` and `e:e=6:3=2:1`;
- CP-008: raw `C`, `P`, `D`, `E`, `Q` equations without consistently defining what each letter means;
- CP-009: bare `r`, `V`, `L`, `T` equations;
- CP-010: stage/cycle descriptions embedded inside MathJax rather than prose.

At least **60 English QLs** in the sampled export contain bare one-letter symbolic assignments in learner steps. Symbols are acceptable when introduced, but they should not read like internal solver traces.

### Required R4 action

Use named quantities in prose before symbolic working, for example:

- `One master painter : one painter efficiency = 6 : 3 = 2 : 1`, not `e:e=6:3`;
- `Priya's contribution = 3 × 5 × 4 = 60 components`, not just `C=...`;
- `Net filling rate = ...`, not only `r=...`.

---

## 5. CRITICAL learner-semantic finding — CP-011 answer labels are wrong for multiple QLs

The answer values are correct, but generic mode matching incorrectly labels several requested quantities as a **rate** simply because the solve-mode name contains the word `Rate`.

Confirmed post-R3 examples:

- `TMW-QL-193` `findOutputFromArithmeticDailyRates` → `Therefore, the required rate is 266 cartons.`
- `TMW-QL-194` `findCompletionTimeFromArithmeticDailyRates` → `Therefore, the required rate is 5 2/3 days.`
- `TMW-QL-197` `findOutputFromGeometricDailyRates` → output labeled as rate;
- `TMW-QL-198` `findCompletionTimeFromGeometricDailyRates` → time labeled as rate;
- `TMW-QL-201` `findCompletionTimeAfterThresholdRateSwitch` → time labeled as rate;
- `TMW-QL-207` `findCompletionTimeFromExplicitRateTable` → time labeled as rate;
- `TMW-QL-209` `findOutputAfterThresholdRateSwitch` → output labeled as rate;
- `TMW-QL-211` `findPostThresholdRateChange` → rate **change** labeled merely as rate.

These are student-facing semantic defects even though the numeric answers/options remain correct.

### Required R4 action

Make the answer renderer depend on the **answer contract / explicit solve-mode map**, not regex precedence over solve-mode names.

This is a publication blocker.

---

## 6. MAJOR MathJax/presentation finding — prose is still embedded in mathematical spans

The fresh English export contains at least **23 QLs** where plain English words occur inside inline MathJax working.

Examples include:

- `source capacity=...` inside math;
- `target contribution=...` inside math;
- `level change needed=...` inside math;
- `r<0 ⇒ tank empties` inside math;
- `9>5 ⇒ boundary is not reached within the window` inside math;
- CP-010 terminal-cycle statements such as `Complete cycles before the terminal cycle=...` inside math.

This is exactly the kind of display problem that makes explanations feel machine-generated and can render poorly in the app.

### Required R4 action

MathJax should contain mathematics only. Move all descriptive text outside the delimiters.

Example:

`Complete cycles before the final cycle = 18. Remaining level = \(1/10\).`

not a whole English sentence embedded inside `\(...\)`.

---

## 7. MAJOR stem-quality finding — some stems are longer than competitive-exam style requires

The sampled English stem distribution is broadly acceptable, but there is a long-tail problem:

- median English stem length: approximately **41 words**;
- **29/211** English stems are 60 words or longer;
- the longest sampled stem is about **111 words** (`TMW-QL-188`).

Most long stems are in CP-010, where staged/cyclic pipe information legitimately requires more text. The issue is not complexity itself; it is repeated context nouns and verbose schedule narration.

For example, CP-010 repeatedly restates the full tank name (`overhead water tank`, `field-storage tank`) and full pipe sentences before describing a numbered cycle.

### Required R4 action

Do **not** simplify the mathematics. Compress only presentation:

- name the tank once and then use `tank`;
- combine solo-time facts into one sentence;
- use compact semicolon-separated schedule clauses or a small table where appropriate;
- target 45–70 words for most advanced stems, permitting longer cases only when genuinely necessary.

---

## 8. MINOR-to-MAJOR grammar finding — number agreement still leaks through parameterised text

A confirmed sampled example is `TMW-QL-145`:

`Sonia ... completes 1 components per hour`.

Other list-style constructions such as `5, 3, 1 files per day respectively` are understandable but would be cleaner if rendered as category-specific clauses or with a neutral unit phrase.

### Required R4 action

Add singular/plural inflection at the final stem-rendering layer for count-sensitive nouns in all three languages where relevant.

---

# 9. Exhaustiveness audit against blueprint and uploaded references

The frozen 211-QL set is **broad but not fully exhaustive relative to its own design authority**.

The original blueprint explicitly states that permanent counts should freeze only after meaningful uncovered patterns, inverse variants, edge/boundary cases and source gaps are checked. It also defines cross-cutting presentation modes beyond ordinary direct MCQ.

## 9.1 HIGH-priority missing/underrepresented pattern — combined rate from all-together + subgroup

The design baseline explicitly included contracts equivalent to:

- all three together complete in `T`;
- A+B together complete in `T_ab`;
- find C's solo time/rate.

The current CP-002 implementation has:

- individual time from all-together plus known **individual times**;
- all-together time from pairwise times;
- individual time from three pairwise times;
- pair time from all-together plus third time.

It does **not have a clean permanent QL for the common inverse direction `all together + subgroup -> excluded individual`**.

This is a recognisable SSC/book pattern and is not merely a wording duplicate.

### Proposed addition

Add one CP-002 QL after the current range expansion policy is agreed:

`findExcludedIndividualTimeFromAllTogetherAndSubgroup`

with direct reciprocal-rate subtraction and misconception-driven options.

---

## 9.2 MEDIUM/HIGH-priority gap — efficiency change applied to a combined team

The blueprint includes combined-time consequences of an efficiency increase/decrease. Current CP-003 is excellent on ratios, percentage efficiency, individual times and comparative productivity, but does not clearly own a common family such as:

- A and B together finish in X days;
- A's efficiency increases/decreases by p% (or one member is replaced by a p%-different worker);
- find new combined completion time / time saved / delay.

CP-001 rate-change modes are single-uniform-rate problems and CP-004 handles staged changes after work begins; neither cleanly replaces this **from-start changed-combined-team** contract.

### Proposed additions

At least one forward QL and one inverse/impact QL:

- `findCombinedTimeAfterMemberEfficiencyChange`
- `findTimeSavedOrDelayAfterMemberEfficiencyChange`

Avoid duplicating pure percentage algebra already owned by CP-003.

---

## 9.3 HIGH-priority product/exam-format gap — data sufficiency is designed but not implemented

The chapter blueprint explicitly lists **statement I/II data sufficiency** as a cross-cutting presentation mode after ordinary QLs are proven.

No TMW data-sufficiency runtime was found in the current implementation.

For SSC-only coverage this is not a chapter blocker, but for the declared **Banking** scope it is a meaningful product gap.

### Proposed implementation

Do not create dozens of DS QLs. Add a small curated DS layer (approximately 6–10 materially different contracts), drawing from:

- individual/combined work;
- efficiency ratios;
- staged participation;
- workforce-days-hours;
- heterogeneous workers;
- pipes/leaks.

Each DS item must prove uniqueness/sufficiency rather than merely solve the underlying arithmetic.

---

## 9.4 MEDIUM-priority presentation gap — table/caselet forms are underused

The blueprint permits table-based crew/schedule presentation and small caselets. Current CP-010/011 mathematics supports these structures, but most student stems remain prose lists.

For banking mocks, a small set of table/caselet forms would improve realism and information-extraction variety without adding new mathematical engines.

### Proposed implementation

Create renderer/presentation variants rather than duplicate QLs unless the information-extraction task materially changes.

---

## 9.5 LOW-priority gap — numeric-answer mode

The blueprint includes numeric-answer presentation, while current runtime remains standard four-option MCQ. For SSC/Banking/Punjab mock tests, MCQ is the priority, so this is **not a publication blocker** unless ExamTree wants generic practice modes beyond exam simulation.

---

## 9.6 Patterns reviewed and judged sufficiently covered

The following reference-book patterns do **not** require new QLs because existing engines already own them:

- A+B together from individual times;
- pairwise A+B, B+C, C+A reconstruction;
- positive/negative work;
- leak time inferred from observed combined filling/emptying;
- men/women/children equivalence;
- wages proportional to work contribution;
- worker joins/leaves after some days;
- alternate-day work;
- helper every nth day / rest-day patterns;
- changed workforce and food/resource-stock style equivalence;
- inlet/outlet simultaneous operation;
- delayed/opened/closed pipes;
- alternating and periodic pipes;
- arithmetic/geometric daily productivity.

These should be improved editorially where needed rather than multiplied into wording-only QLs.

---

# 10. Difficulty and corpus balance

The architecture contains genuine Easy/Medium/Hard reasoning, including several hard inverse and event-driven contracts. The main concern is not lack of hard questions; it is **how difficulty is expressed**.

R4 should ensure:

- Easy questions are not made artificially long by context;
- Medium questions normally require 2–3 meaningful operations;
- Hard questions derive difficulty from inference/state changes, not from verbose narration or ugly numbers;
- final fractions remain exam-friendly;
- options remain homogeneous and misconception-based.

A post-R4 distribution audit should report QL counts and generated-item counts by checkpoint and difficulty.

---

# 11. R4 remediation plan

## R4-A — Publication blockers

1. Correct CP-011 answer-semantics mapping for all affected QLs.
2. Remove prose-inside-MathJax defects.
3. Replace R2 generic learner step narration with family-aware student working.
4. Replace R3 internal-symbol traces with named quantities / introduced symbols.
5. Add singular/plural presentation safety.

## R4-B — Exam-style polish

6. Compress CP-010 long stems without reducing mathematical content.
7. Review all 211 English stems for real-exam tone and unnecessary workplace narration.
8. Review Hindi/Punjabi outputs for the same semantic clarity after English changes, not merely script parity.

## R4-C — Exhaustiveness closure

9. Add the missing `all together + subgroup -> excluded individual` CP-002 contract.
10. Add combined-team efficiency-change forward/impact contracts in CP-003.
11. Implement a small banking-focused Time & Work data-sufficiency layer.
12. Add selective table/caselet renderers where they increase exam realism.

## R4-D — Final proof

13. Regenerate at least 3 seeds per QL per language.
14. Run mathematical correctness and option-answer parity.
15. Run learner-semantic target checks based on answer contracts.
16. Run prose-outside-MathJax policy.
17. Run stem-length/outlier audit.
18. Run repeated-phrase / templated-explanation audit.
19. Run coverage matrix against the design blueprint and source families.
20. Perform a fresh independent human-style review before enabling any publication or Question Studio route.

---

# 12. Final assessment

### Mathematical architecture

**Very strong / near comprehensive.** It is already broader than a typical single-book Time & Work chapter.

### SSC readiness

**High after R4 editorial fixes.** Core and advanced SSC families are already well represented.

### Banking readiness

**Good mathematical coverage but incomplete presentation coverage.** Data-sufficiency and selective table/caselet forms should be added before claiming exhaustive Banking readiness.

### Punjab-state readiness

**High after learner-language/editorial cleanup.** The multilingual engine exists; quality must be judged semantically rather than only by script/parity tests.

### Publication decision

**NO-GO at present.** The remaining defects are fixable and do not require redesigning the 11-CP architecture, but CP-011 semantic labeling and explanation quality are student-facing blockers.
