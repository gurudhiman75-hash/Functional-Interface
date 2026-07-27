# MAL-CP-001 Prototype Classification and Gap Audit

Status: **first executable classification complete; allocation still blocked**  
Branch: `feat/mal-001-cp001-prototype-foundation`  
Permanent QLs: **0**  
Question Studio exposure: **disabled**

## 1. Purpose

This audit reviews the first nine executable CP-001 prototypes against the newest Quant V4 design rules:

- a scenario noun does not create a QL;
- component count alone does not create a QL;
- temporal wording alone does not create a QL;
- source representation may remain a variant when the unknown, invariant and answer semantic are unchanged;
- distinct answer semantics or independently necessary constraints may justify separate contracts;
- generic weighted-average questions belong to AVG unless blend/component semantics are essential;
- no permanent identity may be allocated while material source, inverse or representation gaps remain.

The old Quant V2 mixture system is used only as source evidence for missing patterns and misconception coverage. Its motif identities and fixed counts are not implementation authority.

## 2. Review-pack findings

The 36-question English review artifact was inspected manually in addition to automated proof.

### 2.1 Mathematical result

The canonical solver, independent weighted-balance verifier, options and exact arithmetic were consistent.

### 2.2 Editorial defects found

Four defect classes survived the earlier automated checks:

1. **Role-label inversion** — when a cheaper source was added to a dearer source, the generator could still call the cheaper source `premium` or `high-grade` because labels were attached to operation roles rather than source values.
2. **Lower-case sentence opening** — one ratio-format variant could begin with `regular oil ...`.
3. **Subject agreement** — a stem could read `2 kg of ... is blended ...`.
4. **Mass-noun quantity wording** — a stem could ask `How much premium tea leaves was added?`.

These are blocker-level defects because the question can be mathematically correct while still sounding machine-generated or semantically incoherent.

### 2.3 Runtime correction

The prototype foundation now applies a dedicated context/editorial gate before rendering the final question package:

- lower/middle/higher grade labels are attached to ordered source values;
- known bad subject-agreement forms are rewritten;
- mass-noun quantity asks are rewritten as `What quantity of ...`;
- learner-facing stems must begin with a capital letter;
- the validator and structural audit reject recurrence of these defects.

This is a discovery safeguard, not approval of the English library as final human-authored content.

## 3. Classification result

The nine executable prototypes collapse to **five candidate learner contracts**.

| Prototype | Verdict | Candidate contract | Reason |
|---|---|---|---|
| `MAL-CP001-PROT-RATIO-FROM-TARGET` | RETAIN | `MAL-CP001-CAND-TARGET-RATIO` | Distinct inverse task, ratio answer semantic and alligation-cross reasoning. |
| `MAL-CP001-PROT-MEAN-FROM-QUANTITIES` | RETAIN as anchor | `MAL-CP001-CAND-FINAL-MEAN` | Anchor for weighted blend mean where component semantics are essential. |
| `MAL-CP001-PROT-MEAN-FROM-RATIO` | MERGE | `MAL-CP001-CAND-FINAL-MEAN` | Ratio is an evidence representation; invariant and answer remain unchanged. |
| `MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE` | RETAIN | `MAL-CP001-CAND-UNKNOWN-SOURCE-VALUE` | Distinct unknown and source-value answer semantic. |
| `MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY` | RETAIN as anchor | `MAL-CP001-CAND-UNKNOWN-COMPONENT-QUANTITY` | Anchor for missing quantity from weighted conservation. |
| `MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET` | MERGE | `MAL-CP001-CAND-UNKNOWN-COMPONENT-QUANTITY` | Addition wording is a temporal framing of the same balance equation. |
| `MAL-CP001-PROT-THREE-COMPONENT-MEAN` | MERGE | `MAL-CP001-CAND-FINAL-MEAN` | Component count changes instance complexity, not the task contract by itself. |
| `MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY` | MERGE | `MAL-CP001-CAND-UNKNOWN-COMPONENT-QUANTITY` | Multiple known contributions lengthen the equation but preserve the same unknown and answer. |
| `MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL` | RETAIN | `MAL-CP001-CAND-TWO-QUANTITIES-FROM-TOTAL` | The total is an additional independent constraint and the answer is an ordered pair. |

### 3.1 Candidate-contract inventory after merge

```text
MAL-CP001-CAND-TARGET-RATIO
MAL-CP001-CAND-FINAL-MEAN
MAL-CP001-CAND-UNKNOWN-SOURCE-VALUE
MAL-CP001-CAND-UNKNOWN-COMPONENT-QUANTITY
MAL-CP001-CAND-TWO-QUANTITIES-FROM-TOTAL
```

These are discovery labels only. They are not permanent QLs, frozen solve modes or final CP allocations.

## 4. Average ownership boundary

The executable evidence confirms that weighted blend mathematics overlaps AVG-CP-004. Ownership must be decided from the student task, not from the presence of prices or commodity nouns.

### MAL may retain

- two or more physical components are explicitly blended;
- the component identities and quantities are essential evidence;
- the learner must reconstruct a blend ratio, source value or component quantity;
- an alligation cross or component-load balance is instructionally central;
- removing the blend semantics would change the intended reasoning.

### AVG owns

- generic groups with counts and averages;
- marks, ages, scores or populations;
- equal-quantity averaging with no composition task;
- a question whose complete mathematical meaning is simply combined group average;
- commodity nouns used only as decoration around a generic weighted average.

### Current verdict

- inverse blend contracts remain strong MAL candidates;
- forward mean contracts remain provisional and require source evidence showing genuine mixture/alligation framing;
- `MAL-CP001-CAND-FINAL-MEAN` must not duplicate AVG question languages merely by replacing groups with rice, tea or oil.

## 5. Source-format audit

| Evidence format | Current executable proof | Verdict |
|---|---:|---|
| Two explicit source quantities and values | yes | covered |
| Source quantity ratio and values | yes | covered as representation variant |
| Three explicit component quantities and values | yes | covered as component-count variant |
| Total quantity plus target and two source values | yes | covered as distinct pair reconstruction |
| Unknown source value with absolute quantities | yes | covered |
| Unknown source value with ratio-only evidence | no | open prototype gap |
| Quantity difference or linear relation between sources | no | open prototype gap |
| Successive/two-stage blend evidence | no | open topology gap |
| Pre-blend used as one later source | no | open representation/topology gap |
| Percentage or fractional component-share answer | no | open answer-semantic decision |
| Table/ledger presentation | no | representation proof pending |
| Diagram-only evidence | no | not required unless direct source evidence supports it |

## 6. Inverse and answer-semantic audit

### Covered

- target mean → source ratio;
- target mean + known contribution → unknown source value;
- target mean + known contribution → unknown quantity;
- target mean + total quantity → ordered pair of quantities.

### Open

1. **Source value from ratio-only evidence**  
   The current source-value prototype uses absolute quantities. Because only their ratio is mathematically necessary, a ratio-form source must be tested for wording, distractors and whether it remains the same candidate contract.

2. **Component percentage/share from target mean**  
   This is mathematically derived from the target ratio, but the answer semantic changes from ratio to percentage/share. It must be prototyped before deciding whether it is a presentation mode or separate learner contract.

3. **Difference-based quantity reconstruction**  
   Legacy family `mix_difference_based_quantity` indicates questions where ratio plus a quantity difference determines absolute quantities. This has an extra constraint and may not merge with total-based reconstruction.

4. **Three-way target blend with an additional relation**  
   A target mean across three sources is underdetermined unless another relation is supplied. The relation topology must be explicit and uniqueness independently proven.

5. **Successive or compound blend inverse**  
   A pre-blend can become one source in a later blend. The learner may need to recover a stage quantity or stage mean rather than only calculate the final mean.

## 7. Representation audit

### Retained as variants, not new contracts by default

- explicit quantities versus reduced quantity ratio;
- two versus three components;
- completed-mixture wording versus `add this source` wording;
- different commodity domains;
- alligation cross shown in explanation versus direct weighted equation.

### May justify a distinct contract only after executable proof

- ordered pair answer instead of one quantity;
- quantity difference as the scale-setting constraint;
- stage ledger where an intermediate blend becomes evidence;
- percentage/share answer with materially different distractor and conclusion semantics;
- nested or tabular evidence that changes parsing burden and required reasoning.

## 8. CP boundary decisions

| Pattern | CP-001 decision |
|---|---|
| Generic weighted group average | reassign to AVG |
| Equal-quantity average | reassign to AVG unless composition adds a real task |
| Direct concentration blend | defer ownership to CP-001/CP-004 audit |
| One-component ratio adjustment | defer to CP-002 |
| Repeated replacement | exclude; CP-003 |
| Evaporation or conserved solute | exclude; CP-004 |
| Adulteration profit objective | exclude; CP-005/PNL boundary |
| Simple combination of vessels | CP-001 only if no vessel-stage ledger is needed |
| Actual transfer or return between vessels | exclude; CP-006 |
| False weight or short measure | reassign to PNL |

## 9. Open executable work before allocation

The following non-QL prototypes are required next:

```text
MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO
MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET
MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES
MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN
MAL-CP001-PROT-TWO-STAGE-UNKNOWN
MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION
```

The names are temporary discovery identities. They do not imply that six additional permanent QLs will survive merge/split review.

Each must prove:

- valid-state-first deterministic generation;
- exact canonical solution;
- materially independent verification;
- unique answer;
- misconception-labelled options;
- natural English review material;
- ownership against AVG, CP-002, CP-004 and CP-006;
- merge/split disposition after executable comparison.

## 10. Gate verdict

### Passed

- first nine prototypes execute under the newest Quant V4 foundation;
- all nine are classified exactly once;
- nine prototypes reduce to five candidate contracts;
- obvious component-count and temporal-framing inflation is removed;
- the manual review defects are converted into runtime and audit guards;
- permanent QLs remain zero.

### Not passed

- source-format closure;
- successive/two-stage topology closure;
- difference-based inverse closure;
- component-share answer-semantic decision;
- three-way constrained target blend;
- final AVG ownership for forward mean questions;
- human approval of English review material.

## 11. Allocation decision

**Do not allocate permanent `MAL-QL-*` IDs yet.**

The next checkpoint is to implement and audit the six open prototypes, then rerun the merge/split and cross-chapter ownership review. Only after that may CP-001 propose a permanent contract inventory.
