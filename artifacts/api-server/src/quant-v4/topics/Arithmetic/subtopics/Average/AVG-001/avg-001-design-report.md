# AVG-001 Average Chapter — Comprehensive Design Report

> **Status:** Design report only. No runtime files modified or created.
> **Basis:** Mirrors the **PCT-007 "Mixed Applications of Percentage"** chapter (the late percentage chapter) as the structural and governance template, applied to the already-planned AVG-001 Average archetype.
> **Date:** 2026-07-07

---

## 1. Executive Summary

This report designs the **AVG-001 Average** chapter for Quant V4 by transposing the proven structure of the **PCT-007 Mixed Applications of Percentage** chapter (the last/latest percentage sub-package, hereafter "the late percentage chapter") onto the Average domain.

### 1.1 Why PCT-007 as the reference

PCT-007 is the most recent, most application-dense percentage chapter. It demonstrates the mature, frozen Quant V4 package shape:

- A `foundation/` runtime core with typed task kinds, solve modes, and a single orchestrating `pipeline.ts`.
- Human-owned JSON libraries (`task-registry`, `variable-ranges`, `coverage-targets`, `distribution-targets`, `question-language.{en,hi,pa}`, `explanation.{en,hi,pa}`).
- A governance layer (`library-authority-map.md`, freeze records, maturity audits).
- A 10-CP, 500-QL, 3-language production footprint with balanced difficulty distribution (≈32/34/34 Easy/Medium/Hard).

AVG-001 currently has **Phase A planning docs only** (archetype, canonical-problems, difficulty-framework, reasoning-patterns, implementation-plan, readiness-report). No runtime, no libraries, no generation-engine routing. This report specifies the full PCT-007-shaped build for Average.

### 1.2 Design at a glance

| Aspect | PCT-007 (reference) | AVG-001 (designed) |
|---|---|---|
| Archetype ID | `PCT-007` | `AVG-001` |
| CP count | 10 | 6 |
| Task kinds | 10 (one per CP, application-flavored) | 6 (one per CP) |
| Solve modes | 49 enumerated | 24 enumerated (see §6) |
| Answer types | 9 (ABSOLUTE, PERCENT, AMOUNT, COUNT, COMPARISON, DIFFERENCE, WEIGHT, VOLUME, BILL_VALUE) | 6 (ABSOLUTE, COUNT, AVERAGE, DIFFERENCE, RATIO, MEMBER_VALUE) |
| Languages | en, hi, pa | en, hi, pa (en-first) |
| QL target | 500 | 300 (50 per CP) |
| Difficulty split | 32/34/34 | 32/34/34 (mirrored) |
| Runtime layout | `foundation/` + top-level re-exports | `foundation/` + top-level re-exports |

---

## 2. Reference Template Anatomy (PCT-007)

The late percentage chapter's package at
`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/`
contains:

### 2.1 Planning / Phase A (markdown)
- `archetype.md` — one-paragraph domain + exam scope.
- `canonical-problems.md` — 10 CPs as a flat numbered list.
- `difficulty-framework.md` — Easy/Medium/Hard bullet bands.
- `reasoning-patterns.md` — bullet list of internal abstractions.
- `implementation-plan.md` — 6-step build sequence.

### 2.2 Human-owned libraries (JSON)
- `task-registry.library.json` — `PCT-QL-###` → `{cpId, taskKind, solveMode, answerType, requiredVariables, scenarioFamily, contextTag}`.
- `variable-ranges.library.json` — curated numeric pools per scenario family (amounts, percentages, marksTotals, voterCounts, weightsOrVolumes, waterRates, dryWaterRates).
- `coverage-targets.library.json` — `{canonicalProblemCount, questionLanguageCount, explanationCount, languageCount}`.
- `distribution-targets.library.json` — per-CP frequency weights + difficulty split.
- `question-language.{en,hi,pa}.json` — stem templates keyed by QL id.
- `explanation.{en,hi,pa}.json` — explanation step templates keyed by CP id.

### 2.3 Runtime core (`foundation/` + re-exports)
- `types.ts` — archetype id, CP ids, languages, difficulty band, task kind, solve mode, answer type, registry entry/library interfaces, QL entry interface.
- `library.ts` — `getQuestionEntry()`, `renderTemplate()`.
- `math.ts` — shared numeric helpers.
- `parameter-generator.ts` — `generatePct007Parameters(cpId, input)`.
- `solver.ts` — `solvePct007(parameters)` with `answer` + `mathJax`.
- `reasoning-graph.ts` — `buildPct007ReasoningGraph()`.
- `explanation-renderer.ts` — `renderPct007Explanation()`.
- `validator.ts` — `validatePct007QuestionPackage()`.
- `pipeline.ts` — `runPct007Pipeline()` + `runPct007ForLanguages()` (en/hi/pa).
- `coverage-auditor.ts` — coverage/maturity audit.

### 2.4 Governance
- `library-authority-map.md` — ownership table for every artifact.
- `pct-007.test.ts` — unit/smoke tests.
- `pct-007-multilingual-audit.ts` — multilingual parity audit.
- Freeze/maturity audit docs (outside the package folder).

### 2.5 Pipeline contract (the canonical runtime shape to copy)

```ts
runPct007Pipeline(cpId, input):
  parameters = generatePct007Parameters(cpId, input)
  solver = solvePct007(parameters)
  reasoningGraph = buildPct007ReasoningGraph(parameters, solver)
  explanation = renderPct007Explanation(parameters, solver, reasoningGraph)
  stem = renderTemplate(getQuestionEntry(...).template, parameters.variables)
  basePackage = { archetypeId, canonicalProblemId, questionId, questionLanguageId,
                  explanationId, language, difficultyBand, stem, answer, parameters,
                  solver, reasoningGraph, explanation, traceability, mathJax }
  validation = validatePct007QuestionPackage(basePackage)
  return { ...basePackage, validation }
```

---

## 3. AVG-001 Domain Recap (already planned)

### 3.1 Archetype
Foundational and intermediate applications of **Average (Arithmetic Mean)**: balanced distributions, net shifts from incremental changes, and aggregation of weighted groups.

### 3.2 Exam context
- **SSC (CGL/CHSL):** Replacement systems, error correction, consecutive-number properties.
- **Banking:** Complex combined groups, multi-entity weighted averages.
- **RRB/State:** Foundational sum-count mapping.

### 3.3 Mathematical scope
1. Sum-Count Mapping: $Sum = Average \times Count$.
2. Symmetric Distribution: AP properties (middle term / mean of extremes).
3. Net Shift (Deviation): average change on add/remove/replace without recomputing totals.
4. Weighted Aggregation: merging $N$ groups with independent counts and averages.
5. Delta Correction: adjusting an average for "incorrect vs correct" value.
6. Hierarchical Resolution: multi-level averages (sub-group → group → super-group).

### 3.4 Canonical Problems (6 CPs — already defined)

| CP ID | Name | Core Logic | Exam Realism |
|---|---|---|---|
| `AVG-CP-001` | Foundational Sum-Count Mapping | Solve for $S$, $A$, or $C$; find missing values. | Foundational for all exams. |
| `AVG-CP-002` | Symmetric AP Properties | Middle-term logic for consecutive/odd/even/fixed-interval series. | Primary SSC/PCS topology. |
| `AVG-CP-003` | Increment/Decrement & Replacement | Shifts on add/remove/swap; "find new member's value". | High-frequency SSC. |
| `AVG-CP-004` | Weighted & Combined Aggregation | Merge 2–4 groups with distinct averages. | Banking & SSC premium. |
| `AVG-CP-005` | Error Detection & Delta Correction | Distribute the "mistake delta" over total count. | Classic SSC trophy question. |
| `AVG-CP-006` | Multi-Stage Hierarchical Systems | Nested averages (section → class → school). | Banking & DI. |

### 3.5 Difficulty framework (already defined)
- **SC (Structural Complexity):** 1 group/1 op → 2 groups/1 correction → 3+ groups/nested/multi-step.
- **CE (Computational Effort):** clean integers <1000 → decimals/large populations → non-terminating fractions/mandatory deviation logic.
- **RD (Reasoning Depth):** direct sum → middle-term/missing-member → initial-count-from-shift-chain / multi-mistake correction.

### 3.6 Reasoning patterns (already defined)
1. Sum-Average Substitution: $Sum_{New} = Sum_{Old} - V_{excluded} + V_{included}$.
2. Middle-Term Symmetry: odd $n$ → middle term; even $n$ → mean of two middles; always $(First+Last)/2$.
3. Net Deviation Balance: $V_{New} = A_{Old} + (\Delta \times Count_{Final})$.
4. Weighted Group Merging: $A_{comb} = \frac{\sum n_i a_i}{\sum n_i}$; shortcut via assumed-average + deviations.
5. Delta Redistribution: $\text{Avg Adjustment} = (\text{Correct} - \text{Incorrect}) / \text{Count}$.
6. Hierarchical Resolution: leaf sums → parent averages, multi-step.

---

## 4. Designed AVG-001 Package Structure (PCT-007 shape)

Target path:
`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/`

```
AVG-001/
├── archetype.md                      (exists)
├── canonical-problems.md             (exists)
├── difficulty-framework.md           (exists)
├── reasoning-patterns.md             (exists)
├── implementation-plan.md            (exists — to be updated with PCT-007-shape steps)
├── avg-001-readiness-report.md       (exists)
├── library-authority-map.md          (NEW — mirror PCT-007)
├── task-registry.library.json        (NEW)
├── variable-ranges.library.json      (NEW)
├── coverage-targets.library.json     (NEW)
├── distribution-targets.library.json (NEW)
├── question-language.en.json         (NEW — Phase 1)
├── question-language.hi.json         (NEW — Phase 4)
├── question-language.pa.json         (NEW — Phase 4)
├── explanation.en.json               (NEW — Phase 1)
├── explanation.hi.json               (NEW — Phase 4)
├── explanation.pa.json               (NEW — Phase 4)
├── index.ts                          (NEW — re-exports foundation/)
├── avg-001.test.ts                   (NEW)
├── avg-001-multilingual-audit.ts     (NEW — Phase 4)
└── foundation/
    ├── types.ts                      (NEW)
    ├── library.ts                    (NEW)
    ├── math.ts                       (NEW)
    ├── parameter-generator.ts        (NEW)
    ├── solver.ts                     (NEW)
    ├── reasoning-graph.ts            (NEW)
    ├── explanation-renderer.ts       (NEW)
    ├── validator.ts                  (NEW)
    ├── pipeline.ts                   (NEW)
    └── coverage-auditor.ts           (NEW)
```

Top-level `*.ts` files (except `index.ts` and `*.test.ts`) are thin re-exports of `foundation/`, exactly as PCT-007 does (`types.ts` → `export * from "./foundation/types"`).

---

## 5. Designed Type System (`foundation/types.ts`)

Mirroring PCT-007's `types.ts`:

```ts
export const AVG_001_ARCHETYPE_ID = "AVG-001" as const;

export const AVG_001_CP_IDS = [
  "AVG-CP-001",
  "AVG-CP-002",
  "AVG-CP-003",
  "AVG-CP-004",
  "AVG-CP-005",
  "AVG-CP-006",
] as const;

export const AVG_001_LANGUAGES = ["en", "hi", "pa"] as const;

export type Avg001CanonicalProblemId = (typeof AVG_001_CP_IDS)[number];
export type Avg001Language = (typeof AVG_001_LANGUAGES)[number];
export type Avg001DifficultyBand = "Easy" | "Medium" | "Hard";

export type Avg001TaskKind =
  | "sumCountMappingApplication"          // CP-001
  | "symmetricApPropertiesApplication"    // CP-002
  | "incrementDecrementReplacementApplication" // CP-003
  | "weightedCombinedAggregationApplication"    // CP-004
  | "errorDetectionDeltaCorrectionApplication" // CP-005
  | "multiStageHierarchicalSystemsApplication"; // CP-006

export type Avg001AnswerType =
  | "ABSOLUTE"      // a sum or a total
  | "COUNT"         // a number of items
  | "AVERAGE"       // a mean value
  | "DIFFERENCE"    // a delta between two values
  | "RATIO"         // a ratio of counts or averages
  | "MEMBER_VALUE"; // the value of an added/removed/replaced member

export type Avg001SolveMode =
  // CP-001 Sum-Count Mapping
  | "findSumFromAverageAndCount"
  | "findAverageFromSumAndCount"
  | "findCountFromSumAndAverage"
  | "findMissingValueFromAverage"
  // CP-002 Symmetric AP
  | "findAverageOfConsecutiveSet"
  | "findMiddleTermFromAverage"
  | "findExtremeFromAverageAndCount"
  | "findAverageOfOddOrEvenSet"
  // CP-003 Increment/Decrement & Replacement
  | "findNewAverageAfterAddition"
  | "findNewAverageAfterRemoval"
  | "findNewAverageAfterReplacement"
  | "findReplacedMemberValueFromShift"
  | "findAddedMemberValueFromShift"
  | "findRemovedMemberValueFromShift"
  // CP-004 Weighted & Combined Aggregation
  | "findCombinedAverageOfTwoGroups"
  | "findCombinedAverageOfThreeGroups"
  | "findGroupCountFromCombinedAverage"
  | "findMissingGroupAverage"
  // CP-005 Error Detection & Delta Correction
  | "findCorrectedAverageFromMistake"
  | "findCorrectValueFromAverageShift"
  | "findIncorrectValueFromCorrection"
  | "findNumberOfItemsFromTotalCorrection"
  // CP-006 Multi-Stage Hierarchical
  | "findClassAverageFromSectionAverages"
  | "findSuperGroupAverageFromSubGroups"
  | "findMissingSectionAverage"
  | "findSectionCountFromClassAverage";

export interface Avg001TaskRegistryEntry {
  cpId: Avg001CanonicalProblemId;
  taskKind: Avg001TaskKind;
  solveMode: Avg001SolveMode;
  answerType: Avg001AnswerType;
  requiredVariables: string[];
  scenarioFamily: string;
  contextTag: string;
}

export interface Avg001TaskRegistryLibrary {
  archetypeId: typeof AVG_001_ARCHETYPE_ID;
  ownership: "HUMAN_OWNED";
  authority: string;
  usage: "Runtime Consumption Only";
  entries: Record<string, Avg001TaskRegistryEntry>;
}

export interface Avg001QuestionLanguageEntry {
  template: string;
  difficulty: Avg001DifficultyBand;
}
```

**Design notes:**
- 6 task kinds (one per CP) — mirrors PCT-007's 1-task-kind-per-CP application pattern.
- 24 solve modes — PCT-007 has 49 because it has 10 CPs; 24 for 6 CPs is proportionate and covers every reasoning pattern in §3.6.
- Answer types are Average-domain specific: `AVERAGE` and `MEMBER_VALUE` replace PCT-007's `PERCENT`/`AMOUNT`/`BILL_VALUE` etc.

---

## 6. Designed Library Files

### 6.1 `task-registry.library.json` (shape)

```jsonc
{
  "archetypeId": "AVG-001",
  "ownership": "HUMAN_OWNED",
  "authority": "ExamTree Quant V4 Average AVG-001",
  "usage": "Runtime Consumption Only",
  "entries": {
    "AVG-QL-001": {
      "cpId": "AVG-CP-001",
      "taskKind": "sumCountMappingApplication",
      "solveMode": "findSumFromAverageAndCount",
      "answerType": "ABSOLUTE",
      "requiredVariables": ["average", "count"],
      "scenarioFamily": "avg_count_to_sum",
      "contextTag": "|students|marks"
    }
    // ... 300 entries total, 50 per CP, distributed across solve modes
  }
}
```

QL ID convention: `AVG-QL-###` (mirrors `PCT-QL-###`). Target 300 QLs = 50 per CP × 6 CPs.

### 6.2 `variable-ranges.library.json` (designed pools)

```jsonc
{
  "archetypeId": "AVG-001",
  "counts": [5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 25, 30, 40, 50],
  "averages": [10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 75, 80, 100],
  "memberValues": [18, 20, 24, 25, 30, 36, 40, 45, 48, 50, 60, 72, 75, 80, 90, 100],
  "deltas": [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5],
  "apStarts": [1, 2, 3, 5, 10, 15, 20, 25],
  "apCommonDifferences": [1, 2, 3, 4, 5, 10],
  "groupCounts": [
    { "n": [20, 30] }, { "n": [30, 20] }, { "n": [40, 60] },
    { "n": [25, 35] }, { "n": [50, 50] }, { "n": [15, 45] }
  ],
  "groupAverages": [
    { "a": [30, 50] }, { "a": [40, 60] }, { "a": [25, 45] },
    { "a": [35, 55] }, { "a": [20, 80] }
  ],
  "errorMagnitudes": [2, 3, 4, 5, 6, 8, 10, 12, 15, 20],
  "hierarchicalLevels": [
    { "sections": 3, "studentsPerSection": [30, 40, 50] },
    { "sections": 4, "studentsPerSection": [25, 35, 40, 50] },
    { "sections": 2, "studentsPerSection": [40, 60] }
  ]
}
```

Design rationale (mirrors PCT-007's curated-pool philosophy):
- All counts/averages chosen so that `sum = average × count` yields clean integers for Easy/Medium.
- `deltas` include small decimals (0.25, 0.5) to push CE-High per the difficulty framework.
- `groupAverages` includes a divergent pair (20, 80) to raise RD on weighted tasks.
- `hierarchicalLevels` gives pre-baked section counts for CP-006.

### 6.3 `coverage-targets.library.json`

```jsonc
{
  "archetypeId": "AVG-001",
  "canonicalProblemCount": 6,
  "questionLanguageCount": 300,
  "explanationCount": 6,
  "languageCount": 3
}
```

### 6.4 `distribution-targets.library.json`

Mirroring PCT-007's balanced distribution, scaled to 6 CPs:

```jsonc
{
  "archetypeId": "AVG-001",
  "canonicalProblemDistribution": {
    "AVG-CP-001": 0.20,
    "AVG-CP-002": 0.15,
    "AVG-CP-003": 0.20,
    "AVG-CP-004": 0.15,
    "AVG-CP-005": 0.15,
    "AVG-CP-006": 0.15
  },
  "difficultyDistribution": {
    "Easy": 0.32,
    "Medium": 0.34,
    "Hard": 0.34
  }
}
```

Rationale: CP-001 and CP-003 get slightly higher weight (0.20) because they are the highest-frequency SSC topologies (foundational mapping and replacement). Difficulty split is identical to PCT-007 (32/34/34) for cross-chapter consistency.

### 6.5 `question-language.en.json` (template shape, Phase 1)

```jsonc
{
  "AVG-QL-001": {
    "template": "The average weight of {{count}} students in a class is {{average}} kg. What is the total weight of all the students?",
    "difficulty": "Easy"
  },
  "AVG-QL-002": {
    "template": "The average of {{count}} numbers is {{average}}. If one of the numbers is {{memberValue}}, find the sum of the remaining numbers.",
    "difficulty": "Medium"
  }
  // ... 300 entries
}
```

### 6.6 `explanation.en.json` (one per CP, mirrors PCT-007's 1-explanation-per-CP)

```jsonc
{
  "AVG-CP-001": {
    "explanationId": "AVG-EXP-001",
    "steps": [
      "Recall the fundamental relation: Sum = Average × Count.",
      "Substitute the given values: Sum = {{average}} × {{count}}.",
      "Compute: Sum = {{sum}}.",
      "State the final answer with units."
    ]
  }
  // ... one entry per CP
}
```

### 6.7 `library-authority-map.md` (mirrors PCT-007)

```markdown
# AVG-001 Library Authority Map

- `task-registry.library.json` maps each QL id to CP, task kind, solve mode, answer type, and required variables.
- `question-language.en.json` is the English stem source of truth.
- `question-language.hi.json` and `question-language.pa.json` preserve placeholder parity for runtime checks.
- `explanation.en.json` maps CP ids to explanation ids.
- `variable-ranges.library.json` documents curated numeric pools used by the parameter generator.
- `coverage-targets.library.json` and `distribution-targets.library.json` document expected coverage counts and balance targets.
```

---

## 7. Designed Runtime Contracts (`foundation/`)

### 7.1 `pipeline.ts` (the contract to implement — direct mirror of PCT-007)

```ts
export function runAvg001Pipeline(
  cpId: Avg001CanonicalProblemId,
  input: Avg001ParameterInput = {}
): Avg001QuestionPackage {
  const parameters = generateAvg001Parameters(cpId, input);
  const solver = solveAvg001(parameters);
  const reasoningGraph = buildAvg001ReasoningGraph(parameters, solver);
  const explanation = renderAvg001Explanation(parameters, solver, reasoningGraph);
  const stem = renderTemplate(
    getQuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template,
    parameters.variables
  );
  const basePackage = {
    archetypeId: AVG_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: parameters.questionId,
    questionLanguageId: parameters.questionLanguageId,
    explanationId: parameters.explanationId,
    language: parameters.language,
    difficultyBand: parameters.difficultyBand,
    stem,
    answer: solver.answer,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    traceability: {
      questionId: parameters.questionId,
      canonicalProblemId: cpId,
      questionLanguageId: parameters.questionLanguageId,
      explanationId: parameters.explanationId,
      difficultyBand: parameters.difficultyBand,
      taskKind: parameters.taskKind,
      solveMode: parameters.solveMode,
      answerType: parameters.answerType,
      answer: solver.answer,
    },
    mathJax: solver.mathJax,
  };
  const validation = validateAvg001QuestionPackage({
    ...basePackage,
    validation: { valid: false, checks: [] },
  });
  return { ...basePackage, validation };
}

export function runAvg001ForLanguages(
  cpId: Avg001CanonicalProblemId,
  input: Avg001ParameterInput = {}
) {
  const base = generateAvg001Parameters(cpId, {
    ...input, language: "hi", questionLanguageId: undefined
  });
  return (["en", "hi", "pa"] as Avg001Language[]).map((language) =>
    runAvg001Pipeline(cpId, {
      ...input, language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    })
  );
}
```

### 7.2 Solver responsibilities per CP

| CP | Solver logic |
|---|---|
| AVG-CP-001 | Direct $S = A \times C$ and inversions; missing-value via $V_{missing} = A \times C - \sum V_{known}$. |
| AVG-CP-002 | AP middle-term: odd $n \to$ middle; even $n \to$ mean of two middles; $(First+Last)/2$. |
| AVG-CP-003 | Deviation engine: $V_{new} = A_{old} + \Delta \times C_{final}$; supports add/remove/replace. |
| AVG-CP-004 | Weighted merge: $A_{comb} = \frac{\sum n_i a_i}{\sum n_i}$; assumed-average shortcut path. |
| AVG-CP-005 | Delta redistribution: $\Delta A = (V_{correct} - V_{incorrect}) / C$. |
| AVG-CP-006 | Hierarchical: leaf sums → parent averages, multi-stage. |

### 7.3 Validator invariants (Average-specific)

- All intermediate sums non-negative.
- AP sequences strictly monotonic with the stated common difference.
- Replacement: replaced member value consistent with the observed average shift.
- Weighted merge: combined average strictly between min and max group averages.
- Error correction: corrected average differs from wrong average by exactly $\Delta/C$.
- Rounding: no traceability drift (final answer matches solver output within stated precision).

---

## 8. Phased Build Plan (PCT-007-style, en-first)

Directly adapted from PCT-007's 6-step implementation plan and AVG-001's readiness report:

### Phase 1 — English Runtime MVP (`AVG-CP-001` only)
Files: `question-language.en.json`, `task-registry.library.json`, `variable-ranges.library.json`, `foundation/{types,library,parameter-generator,solver,validator,explanation-renderer}.ts`, `index.ts`, `avg-001.test.ts`.
Initial solve modes: `findSumFromAverageAndCount`, `findAverageFromSumAndCount`, `findCountFromSumAndAverage`, `findMissingValueFromAverage`.
QL target: 20–30 smoke QLs.

### Phase 2 — English Expansion (remaining CPs in batches)
- Batch 2: `AVG-CP-002` symmetric AP.
- Batch 3: `AVG-CP-003` add/remove/replace deviation.
- Batch 4: `AVG-CP-004` weighted groups.
- Batch 5: `AVG-CP-005` error correction.
- Batch 6: `AVG-CP-006` hierarchical systems.
Each batch adds QLs, registry mappings, variable generation, solver logic, explanations, and tests together. Scale to 300 QLs (50 per CP).

### Phase 3 — Generation-Engine Integration
- Add `AVG-001` discovery/routing in `generation-engine.ts` (mirror the existing `isPercentageChapterRequest()` pattern at line ~284).
- Add normal export smoke.
- Verify metadata, options, explanations, and validation summary shape.
- Keep student/public exposure off until reviewed.

### Phase 4 — Multilingual Backend Pilot
- Localize a tiny `AVG-CP-001` Hindi/Punjabi pilot.
- Add non-English QL allowlist through shared `language-coverage.ts`.
- Localize stems, runtime labels, and explanation prose together.
- Add `avg-001-multilingual-audit.ts`.
- Keep HI/PA frontend exposure off.

### Phase 5 — Governance & Freeze
- Produce `library-authority-map.md`.
- Run coverage + maturity audits.
- Produce freeze record.

---

## 9. Cross-Chapter Consistency with PCT-007

| Dimension | PCT-007 | AVG-001 (designed) | Consistent? |
|---|---|---|---|
| Package layout (`foundation/` + re-exports) | yes | yes | ✅ |
| Pipeline contract (`run*Pipeline` + `run*ForLanguages`) | yes | yes | ✅ |
| Library ownership (`HUMAN_OWNED`, `Runtime Consumption Only`) | yes | yes | ✅ |
| QL ID convention (`XXX-QL-###`) | `PCT-QL-###` | `AVG-QL-###` | ✅ |
| CP ID convention (`XXX-CP-###`) | `PCT-CP-###` | `AVG-CP-###` | ✅ |
| Difficulty split | 32/34/34 | 32/34/34 | ✅ |
| Languages | en, hi, pa | en, hi, pa | ✅ |
| 1 task kind per CP | yes | yes | ✅ |
| 1 explanation per CP | yes | yes | ✅ |
| Traceability block shape | yes | yes | ✅ |
| MathJax in solver output | yes | yes | ✅ |

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Deviation logic for CP-003 produces non-integer member values for some seeds. | Constrain `deltas × counts` to integers in `variable-ranges.library.json`; validator rejects non-integer member values for COUNT/ABSOLUTE answer types. |
| Weighted merge (CP-004) with 3+ groups can produce non-terminating averages. | Restrict 3-group merges to counts whose LCM keeps the combined average terminating; flag CE-Hard explicitly. |
| Hierarchical (CP-006) multi-stage rounding can drift. | Carry full-precision sums internally; round only at the final answer; validator checks $|A_{computed} - A_{stated}| < \epsilon$. |
| AP (CP-002) with large $n$ (>15) raises difficulty unexpectedly. | Cap AP length at 15 in Easy/Medium; allow >15 only in Hard band. |
| Generation engine doesn't yet route AVG-001. | Phase 3 adds routing; do not expose publicly until smoke passes. |

---

## 11. Recommended Implementation Agent Prompt Skeleton

(Adapted from `pct-006-implementation-agent.md` / `pct-007-implementation-agent.md`)

```
You are implementing AVG-001 Average for Quant V4.
Reference template: PCT-007 (Mixed Applications of Percentage).
Reference path: .../Percentage/PCT-007/
Target path:      .../Average/AVG-001/

Phase 1 scope: AVG-CP-001 English runtime MVP only.
1. Mirror the PCT-007 package shape (foundation/ + re-exports).
2. Replace percentage-specific logic with Average sum-count logic.
3. Generate the task registry and 20-30 English QLs from deterministic family definitions.
4. Implement chapter-specific generator, solver, validator, and explanation behavior.
5. Run JSON, duplicate, placeholder, render, finite-answer, and bundled test checks.
6. Produce implementation and content-audit reports.
Do not add HI/PA until Phase 4. Do not wire generation-engine.ts until Phase 3.
```

---

## 12. Summary

The AVG-001 Average chapter is fully designed at the structural, typographic, library, runtime-contract, and governance levels by transposing the proven PCT-007 package shape onto the already-planned Average CPs. The design:

- Reuses the mature `foundation/` + human-owned-JSON + governance layer pattern.
- Defines 6 task kinds, 24 solve modes, 6 answer types, 300 QLs, 3 languages.
- Preserves cross-chapter consistency (32/34/34 difficulty, traceability shape, MathJax, pipeline contract).
- Phases the build en-first (CP-001 MVP → expand → engine integration → multilingual → freeze).
- Adds Average-specific validator invariants and risk mitigations.

**No files were modified.** This report is the blueprint for the subsequent implementation pass.
