# DSF-CP-000 Existing Runtime Audit

Status: initial repository discovery on `New-main`.

This audit records reusable Data Sufficiency work already present in source chapters. It does **not** authorize permanent DSF QLs or migration of existing chapter QLs.

## 1. Number System retained authority DS

Source:

`quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/NUM-CP-003/retained/authority-data-sufficiency.ts`

Useful assets:

- explicit candidate domains;
- statement predicates represented by candidate sets;
- independent Statement I and Statement II candidate sets;
- conjunction by intersection;
- five semantic classes;
- mutually exclusive wording including `Both statements together are sufficient, but neither alone is sufficient.`;
- rejection of empty intersections;
- question-specific candidate-set explanations.

Reuse decision:

- retain Number System domain predicates and candidate-domain construction in the Number System source chapter;
- reuse them through a future DSF Number System adapter;
- replace local sufficiency classification with the shared DSF semantic evaluator once migration is authorized.

Limitation:

The current Number System task asks for the missing digit itself, so candidate-count = target-answer-count. This does not prove the general DS rule required by algebra/reasoning, where several worlds may survive while the asked target is fixed.

## 2. Time and Work CP-013 DS runtime

Source:

`quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/cp013-data-sufficiency-runtime.ts`

Useful assets:

- five-class DS option semantics;
- English/Hindi/Punjabi option wording already exists for later editorial audit;
- source-domain solve modes covering rates, efficiency, staged work, workforce schedules, wages, pipes/leaks and variable productivity;
- question-specific reasoning and calculation traces.

Migration concerns:

- the runtime stores `iUnique`, `iiUnique` and `combinedUnique` booleans inside generated state;
- classification therefore trusts domain-specific generation metadata rather than a shared independently recomputed target projection;
- class name `EITHER_ALONE` should become the unambiguous shared semantic `EACH_STATEMENT_ALONE`;
- existing source QLs remain untouched during CP-000.

Reuse decision:

Time & Work keeps ownership of rate/work mathematics. A future DSF adapter must independently expose surviving target answers or equivalent symbolic proof to the shared evaluator.

## 3. Simplification & Approximation CP-006 Wave 3 V3

Source:

`quant-v4/topics/Arithmetic/subtopics/SimplificationAndApproximation/SAP-001/SAP-CP-006/runtime-wave3-v3.ts`

Useful assets:

- bounded integer domain;
- candidate sets for I, II and conjunction;
- deterministic generation;
- lifecycle isolation already prevents publication of the prototype;
- direct candidate-set explanation.

Gap:

The runtime defines only four DS classes:

- I alone;
- II alone;
- both together;
- even together insufficient.

It does not represent the canonical case where **each statement alone is sufficient**. Shared DSF semantics must not inherit this four-class limitation.

Reuse decision:

Reuse the arithmetic-expression domain model only after an adapter is written. Do not make its four-class local classifier authoritative.

## 4. Cross-chapter ownership rule

The source chapter owns the underlying competency; DSF owns sufficiency semantics.

Examples:

- Number System owns divisibility and missing-digit legality; DSF owns whether a supplied statement set determines the asked target.
- Time & Work owns work/rate equations; DSF owns statement-subset evaluation.
- Ranking owns rank inference; DSF owns whether rank clues determine the requested rank/fact.
- Seating owns complete valid arrangements; DSF owns projection of the asked seating fact over all surviving arrangements.

## 5. CP-000 conclusion

Existing repository work confirms that candidate-set evaluation is reusable for bounded Quant DS, but no existing runtime should become the chapter-wide semantic authority.

The shared DSF foundation remains authoritative because it additionally enforces:

- target-answer projection rather than complete-world uniqueness;
- standalone statement reset to the base problem;
- consistency rejection;
- monotonicity invariants;
- answer agreement for each-alone cases;
- all five canonical semantic classes;
- generic minimal sufficient subsets for future three-statement DS.
