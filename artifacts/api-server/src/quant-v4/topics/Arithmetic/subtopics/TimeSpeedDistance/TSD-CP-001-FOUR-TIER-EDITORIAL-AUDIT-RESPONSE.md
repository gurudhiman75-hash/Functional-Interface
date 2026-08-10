# TSD-CP-001 Four-Tier Editorial Audit Response

**Checkpoint:** `TSD-CP-001 — Uniform Motion, Units and Proportionality`  
**Response date:** 1 August 2026  
**Status:** implemented and executable-proof guarded  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Publication:** disabled

## 1. Audit basis and current corpus

The senior editorial audit assessed an earlier artifact containing 60 questions across 20 learner modes. That artifact is retained only as historical review evidence.

The current runtime boundary is:

- 25 provisional mathematical authorities;
- 23 learner-facing exam modes;
- two internal QA modes;
- 69 learner-facing review questions.

The audit's mathematical finding of full correctness was consistent with the existing canonical solver and independent verifier proof. Its applicable editorial findings were carried forward to all 69 current learner questions.

## 2. Findings accepted and implemented

### 2.1 Standard four-tier learner structure

The explanation schema now includes canonical production fields:

- `keyRule` → `📌 Main Rule`;
- `stepByStepSolution` → `📝 Step-by-Step Solution`;
- `examSpeedShortcut` → `⚡ Exam Speed Trick`;
- `optionAnalysis` → `⚠️ Common Traps & Option Analysis`.

Every learner row has exactly four option-analysis records and exactly one correct record.

### 2.2 Teacher-readable option analysis

Each option analysis stores:

- option letter;
- visible option text;
- correct/wrong status;
- internal misconception identity;
- learner-facing reason.

The internal identity is not copied into the learner reason. Direct distance-speed-time questions explain the actual wrong speed, time or distance implied by the option. Deadline traps are calculated from exact alternative time windows rather than assigned to arbitrary values.

### 2.3 MathJax-ready content

The runtime now stores a plain stem for compatibility and `stemMathJax` for learner rendering. The four-tier solution emits balanced inline MathJax for quantities and equations.

Regression guards reject:

- malformed `\\times` tokens;
- nested `\\text{}` commands;
- unbalanced MathJax delimiters;
- raw equation lines where MathJax is required;
- repeated whole-hour conversion text.

### 2.4 Stem naturalness

Direct distance, speed and time questions and deadline questions now use deterministic restrained variation. The variation changes the lead-in and question form without adding irrelevant narrative or changing the mathematical authority.

## 3. Findings adapted rather than copied literally

The audit examples proposed very long explanations for basic questions. The runtime adopts the four-tier structure and explanatory transparency while preserving an exam-preparation length appropriate for SSC, banking and Punjab-state exams.

The learner UI does not display internal misconception codes such as `[MISREAD_SPEED]`. Those identities remain engine metadata. The learner receives a natural explanation of the mistake.

The runtime uses MathJax-ready strings rather than inserting dollar-delimited Markdown into every stored plain field. This preserves structured rendering and avoids coupling the question model to one Markdown renderer.

## 4. Backward compatibility

The earlier compact fields remain temporarily available:

- `concept`;
- `givens`;
- `working`;
- `shortcut`;
- `trap`;
- `conclusion`.

New consumers should use the four-tier fields. Removal of compatibility fields requires a separate integration migration and is outside this review-only checkpoint.

## 5. Executable proof

The TSD workflow now proves across the 1,500-candidate deterministic audit and the 69-row review export:

- four-tier fields are present;
- four options are analysed;
- one and only one option is marked correct;
- option-analysis text matches the displayed option;
- internal misconception codes do not leak into learner reasons;
- all learner stems contain MathJax quantities;
- solution equations have valid MathJax delimiters;
- direct-option reasons refer to the actual mistaken values;
- deadline add-one-hour and drop-one-hour options equal the exact alternative calculations;
- deadline options avoid awkward numeric fractions;
- no publication lock is weakened.

## 6. Current decision

The editorial upgrade is accepted for the provisional English review runtime. This is not a manual English freeze and does not authorize permanent IDs, localisation, Question Studio integration, Question Bank storage, tests or public delivery.

## 7. Remaining CP-001 work

1. noon, midnight and next-day clock-boundary saturation;
2. equivalent-speed representation decision;
3. final answer-unit and edge audit;
4. final merge/split review of all 23 learner authorities;
5. manual English approval.
