# SEA-001 — Exam Realness, Gap and Saturation Audit

Date: 2026-08-18
Audited head before this report: `d118ac7064a0a92770d13a95b32e59bf1595bba1`
Scope: SEA-001 foundational single-row and circular seating plus its Question Studio dynamic-review adapter.

This audit is deliberately stricter than the existing Wave-5 production saturation proof. Wave-5 proves generator reachability, correctness, duplicate rejection at the current fingerprint level, query-surface reachability and editorial safety. This audit asks a different question: **does the generated distribution behave like the target exams, and will repeated Question Studio use remain fresh and non-template-saturated?**

No frozen QL, solve-inventory, English, Hindi or Punjabi authority is changed by this audit.

## Executive verdict

| Dimension | Verdict | Reason |
|---|---|---|
| Solver / answer correctness | PASS | Existing solver-oracle and single-answer gates are strong. |
| SEA-001 intended topology coverage | PASS | All five SEA-001 checkpoints and all 20 frozen QLs are reachable. |
| Raw generation volume | PASS | Existing proof reaches 1,600 caselets / 6,400 child questions. |
| Existing exact / clue-set duplicate protection | PASS, LIMITED | Exact/current normalized duplicates are rejected, but current canonicalization is not rename/symmetry invariant. |
| Structural novelty at exam scale | NOT PROVEN | Current structural fingerprint is too coarse to prove non-clone saturation. |
| Question Studio unseeded freshness | FAIL — P0 | The default batch seed is deterministic for package/language/filter inputs, so repeated unseeded requests reproduce the same batch. |
| Question Studio distribution realism | FAIL — P1 | QLs are selected strict round-robin, not from exam-family frequency profiles. |
| Difficulty realism | FAIL — P1 | Difficulty is fixed by checkpoint rather than measured per generated caselet. |
| Caselet child-count realism | FAIL — P1 | Saturation corpus is effectively fixed at four children per caselet; target exams do not share one universal set size. |
| SSC lane fit | CONDITIONAL PASS | SEA-001 contains the relevant foundation patterns, but no SSC-specific frequency/set-size mixer is enforced. |
| Punjab-state lane fit | CONDITIONAL PASS | Strong overlap with observed simple same-facing row/circular patterns, but no Punjab-specific distribution is enforced. |
| Banking chapter fit | INCOMPLETE | Recent bank papers heavily use parallel-row and larger puzzle sets. Those are correctly outside SEA-001 and assigned to SEA-002/SEA-003, so chapter-level banking coverage is incomplete until those packages are implemented/connected. |
| Multilingual semantic safety | PASS | Existing parity/freeze gates protect semantics. |
| Dynamic multilingual exam-naturalness | NOT PROVEN | Semantic parity does not quantify idiomatic phrase/template variety across unseen generated combinations. |
| Question Bank / mock-test / public readiness | HOLD | Existing downstream locks should remain closed until P0/P1 realness blockers are remediated and re-audited. |

## What the existing saturation proof genuinely establishes

Wave-5 currently proves at least 1,500 caselets, 6,000 child questions, 60 coarse material variants and 24 query-template surfaces; the current run records 1,600 accepted caselets, 6,400 child questions and 34 query-template surfaces. It also rejects exact and current normalized clue-set duplicates, keeps all 20 authorities reachable and requires zero correctness/editorial blockers.

These are useful **technical saturation** gates. They must not be relabelled as proof of **exam saturation** because they do not constrain the frequency distribution to SSC, Banking or Punjab paper behaviour.

## P0 — Question Studio freshness defect

`generateSea001QuestionStudioBatch()` constructs the default seed only from package id, language, checkpoint/all-checkpoints and QL/all-QLs. When the caller omits `seed`, identical requests therefore use an identical deterministic seed.

The runtime also emits every child from the selected caselet before moving to the next QL, and QL selection is strict modulo round-robin.

Consequences:

1. Repeated unseeded generation can return the same questions indefinitely.
2. The default four-question request can be dominated by a single caselet / first eligible QL.
3. Apparent generator capacity does not become Question Studio freshness automatically.

Required remediation:

- explicit seed => deterministic reproducibility;
- omitted seed => a persisted/non-repeating run nonce or equivalent fresh generation identity;
- maintain a recent-history structural fingerprint window and reject repeats before returning a batch;
- mix at caselet level before child expansion when the requested product mode needs cross-QL variety.

## P1 — No exam-family mixer

The runtime exposes one generic Seating Arrangement generator. It does not accept or enforce an exam lane such as `SSC`, `BANKING` or `PUNJAB_STATE`, and it does not apply topology, seat-count, question-count, difficulty or query-family weights learned from exam evidence.

Strict equal/round-robin QL exposure is administratively balanced but not exam-realistic.

Required remediation:

Introduce an evidence-backed profile layer, for example:

- `SSC`
- `BANKING`
- `PUNJAB_STATE`

Each profile should own separately versioned target distributions for topology/package, seat count, facing policy, questions per caselet, query family, clue count/negative-clue density, difficulty band, hypothetical/statement/odd-group share and presentation style.

Do not invent percentages. Derive and version them from a sufficiently large, dated evidence corpus.

## P1 — Banking chapter coverage is incomplete, not an SEA-001 contract violation

The SEA design explicitly places these outside SEA-001:

- parallel rows;
- square / rectangle / polygon seating;
- concentric rings;
- attribute/vacancy/ranking-linked/controlled multi-model families.

These are assigned to SEA-002 / SEA-003. That boundary is correct.

However, current bank-exam evidence repeatedly contains parallel-row seating and five-question seating/puzzle sets. Therefore **the Seating Arrangement chapter as a Banking product is not exam-complete while only SEA-001 is connected**.

This finding must not be “fixed” by stuffing parallel-row contracts into SEA-001. Implement/connect the intended downstream packages and let the Banking profile mix across them.

## P1 — Fixed four-child caselets are not universally realistic

The saturation harness explicitly produces 6,400 child questions from 1,600 caselets, i.e. four children per caselet. The underlying governance allows 3–5 children, but the saturated production path is effectively fixed at four.

External evidence shows materially different target behaviour: recent SBI PO/Clerk analyses commonly report five-question seating sets, whereas SSC analyses can show a much lighter 2–3-question seating footprint. Punjab official-paper-index examples also show compact, straightforward row caselets.

Required remediation:

- make question-count distribution an exam-profile parameter;
- preserve a shared solved caselet while varying the number and type of child questions honestly;
- audit child-query independence so reducing/expanding the bundle does not leak answers.

## P1 — Structural saturation is currently under-measured

### Current normalized clue-set fingerprint

The duplicate check removes constraint ids or hashes clue text. It does not establish an isomorphism-invariant structural identity.

It can therefore treat these as different even when their reasoning skeleton is the same: participant renaming, left-right row reflection, circular rotation/reflection where semantics permit, clue-order permutations, or superficial wording changes over the same dependency graph.

### Current material-variant fingerprint

The material fingerprint consists primarily of blueprint id, seat count/parity, facing partition, landmark and counts of constraint kinds.

That is useful telemetry but too coarse for an “honest saturation” claim. Two caselets can share all of those fields while differing only superficially, or differ in one count while preserving essentially the same solve path.

Required new canonical fingerprint:

- canonical participant relabeling;
- topology symmetry normalization;
- typed constraint graph;
- clue-dependency / proof graph shape;
- query bundle signature;
- answer-determining subgraph;
- lexical/template fingerprint kept separate from semantic structure.

Recommended audit output should report exact duplicates, semantic-isomorphic clones, near-clones and lexical-template clones separately.

## P1 — Logged distributions are not enforced

The residual audit records query-contract, seat-count and answer-position distributions, including answer position by child index. The production target assertion does not place balance/target bounds on those distributions.

Therefore a build can remain green while being strongly skewed, as long as every declared contract is reachable at least once and the coarse volume/variant gates pass.

Required remediation:

- lane-specific target bands rather than universal equal balance;
- maximum concentration guards for query/template families;
- answer-position uniformity guard over a large corpus;
- child-index x answer-position independence check;
- seat-count distribution bands;
- clue-density and dependency-depth bands;
- report observed vs target divergence with minimum sample requirements.

## P1 — Difficulty labels are topology labels, not difficulty measurements

Current Question Studio mapping is fixed:

- CP-001 => Easy
- CP-002 => Medium
- CP-003 => Medium
- CP-004 => Medium
- CP-005 => Hard

This can mislabel an unusually dense CP-001 item as Easy or a shallow CP-005 item as Hard.

Required measurable difficulty features:

- participant/seat count;
- displayed clue count;
- negative clue count;
- mixed-facing reversals;
- minimum proof/inference depth;
- intermediate deduction count;
- branch count before uniqueness;
- conditional/hypothetical operations;
- query-local reasoning depth;
- empirical solve time and accuracy once telemetry exists.

Use checkpoint only as a prior, not the final difficulty label.

## P2 — Manual review sample is not fully stratified for realness

The English review corpus is balanced at five caselets per PBA. CP-001 deliberately forces three special query contracts into each five-caselet slice. For other checkpoints, selection is effectively the first five eligible candidates per blueprint.

That is good authority coverage but not a realness sample design.

Future review selection should stratify across exam lane, structural-isomorphism class, seat count, difficulty, clue density, query family, distractor misconception class, answer position, presentation template and language.

## P2 — Source audit proves relevance, not representativeness

The existing source audit has useful SSC, Banking, Railway and Punjab evidence and all five checkpoints appear somewhere. Its executable pass condition is primarily boolean coverage and record validity.

It does not currently prove frequency, recent trend weight, set size, clue density, solve time, difficulty or per-exam topology distribution.

A realness evidence record should include at least exam/date/stage/shift, source confidence tier, topology/package, participant count, facing policy, clue count, questions attached to the arrangement, query families, negative/conditional clue characteristics and difficulty.

## P2 — Dynamic multilingual naturalness needs its own statistical audit

The multilingual freeze and dynamic semantic-parity checks are strong semantic safety controls. They do not by themselves prove that thousands of unseen Hindi/Punjabi combinations avoid repetitive or machine-like phrase patterns.

Add locale-specific audits for normalized stem-template concentration, clue-opening phrase concentration, repeated explanation sentence frames, unnatural literal directional constructions, name/ordinal consistency and fresh-dynamic human spot review.

This must remain separate from semantic parity: a sentence can be semantically correct and still sound unnatural.

## Exam evidence snapshot used for this audit

Evidence is corroborative, not a new frozen design authority.

Recent bank-exam analyses show:

- SBI PO Prelims 4 Aug 2025 Shift 1: circle-inside and parallel-row seating, five questions each;
- SBI PO Prelims 8 Mar 2025 Shift 1: parallel row (7 north + 7 south), five questions;
- SBI PO Prelims 16 Mar 2025 Shift 1: parallel row (14 persons), circular 9-person inside-facing and north-facing linear seating, five questions each;
- SBI PO Prelims 4 Aug 2025 Shift 4: circular 9-person and single-row 8-person seating, five questions each;
- SBI Clerk Prelims 27 Feb 2025 Shift 1: linear-row and square mixed-direction sets reported at five questions each.

Representative URLs:

- https://testbook.com/blog/sbi-po-prelims-exam-analysis-2025/
- https://www.careerpower.in/blog/sbi-po-prelims-exam-analysis-2023
- https://www.bankersadda.com/sbi-po-exam-analysis-2025-shift-1-16-march/
- https://www.bankersadda.com/sbi-po-exam-analysis-2025-shift-4-4th-august/
- https://www.shiksha.com/sarkari-exams/banking/articles/sbi-clerk-prelims-exam-analysis-2025-blogId-191078

SSC 2025 Tier-II analysis reports a six-person seating arrangement with roughly 2–3 questions, while an indexed SSC CGL 2024 Tier-II official-paper question shows a six-person centre-facing circle.

Representative URLs:

- https://www.collegedekho.com/exam/ssc-cgl/paper-analysis
- https://testbook.com/question-answer/o-p-q-r-s-and-t-are-sitting-around-a-circular--67942ff0dbd2992fea8bf344

Punjab Police official-paper-index examples from 2024–2025 repeatedly show compact five/seven-person same-facing rows and count-between / position / odd-group queries.

Representative URLs:

- https://testbook.com/question-answer/how-many-people-are-sitting-between-t-and-r--68fc705a1ab682a6647ab75a
- https://testbook.com/question-answer/seven-persons-a-b-c-d-e-f-and-g-are-sitting-i--67f3dcd9eb72c7d832bf4d11
- https://testbook.com/question-answer/based-on-the-given-arrangement-three-of-the-four--68fc705a1ab682a6647ab75b

## Required remediation order

1. **P0:** fix unseeded Question Studio freshness while preserving explicit-seed reproducibility.
2. Add structural-isomorphism and near-clone auditing; measure the current corpus before choosing thresholds.
3. Build versioned SSC / Banking / Punjab evidence tables and exam-profile mixers.
4. Remove fixed four-child and fixed checkpoint-difficulty assumptions from product generation.
5. Implement/connect SEA-002 and SEA-003 before claiming Banking seating chapter completeness.
6. Add distribution gates for query, seat count, answer index, clue density, dependency depth and template concentration.
7. Rebuild a stratified multilingual realness review corpus from fresh dynamic generation.
8. Only then reassess Question Bank / mock-test / public-delivery eligibility.

## Freeze decision

**Do not unfreeze Question Bank, mock-test eligibility, production staging or public publication on the basis of the existing Wave-5 saturation label.**

```text
SEA-001 solver/correctness                 PASS
SEA-001 technical saturation               PASS
SEA-001 intended foundation coverage       PASS
Question Studio connection                 REVIEW-ONLY
Question Studio unseeded freshness         FAIL / P0
Exam-family distribution realism           FAIL / P1
Structural non-clone saturation            NOT PROVEN / P1
Banking chapter completeness               INCOMPLETE pending SEA-002/SEA-003
Question Bank eligibility                  LOCKED
Mock-test eligibility                      LOCKED
Production/public delivery                 LOCKED
```
