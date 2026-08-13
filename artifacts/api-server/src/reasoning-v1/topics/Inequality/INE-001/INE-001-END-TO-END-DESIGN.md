# INE-001 — Inequality: End-to-End Chapter Design

**Status:** Architecture and open-discovery design  
**Student-facing chapter:** Inequality  
**Reasoning family:** `REAS-INE` — Relational and positional reasoning  
**Permanent QLs:** Not allocated  
**Final QL count:** Not fixed  
**Runtime:** Not started

The uploaded reasoning material treats Inequality as a dedicated competitive-reasoning chapter covering direct comparison chains, strict and inclusive relations, conclusion evaluation, no-relation cases, complementary/either-or conclusions, and coded symbols. The reference material also explicitly distinguishes relations such as `>`, `<`, `=`, `≥`, and `≤`, including negative-language forms such as “not smaller than” and “neither greater nor equal to.”

The broader Reasoning blueprint places Inequality in the relational family and requires a dedicated inequality graph engine rather than ordinary arithmetic templates.

---

## 1. Product objective

INE-001 must generate deterministic, exam-grade Inequality questions for:

- Banking;
- SSC;
- Railways;
- insurance examinations;
- Punjab state examinations;
- other competitive examinations using comparable reasoning patterns.

A valid question must follow this pipeline:

```text
construct a logically consistent comparison state
→ derive one or more displayed inequality statements
→ define the exact inference task
→ solve from displayed statements only
→ verify through an independent solver or model enumerator
→ build four misconception-owned options
→ generate a question-specific explanation
→ render consistently in English, Hindi and Punjabi
```

The chapter must not be implemented as symbol-string templates whose answers are decided by informal “symbol priority” shortcuts.

The source books often teach priority rules such as giving strict symbols precedence over inclusive symbols. Those rules are useful learner shortcuts, but the runtime authority must be formal relation composition and model validity.

---

## 2. Core chapter boundary

### 2.1 Included in INE-001

#### Ordinary mathematical inequality reasoning

- `A > B`;
- `A < B`;
- `A = B`;
- `A ≥ B`;
- `A ≤ B`;
- direct and reverse relation inference;
- chained comparisons;
- disconnected or partially connected chains;
- branched comparison graphs;
- strict and non-strict transitivity;
- equality propagation;
- contradiction detection;
- definite, possible, and indeterminate relations.

#### Statement–conclusion questions

- one conclusion;
- two conclusions;
- three or more conclusions;
- only conclusion I follows;
- only conclusion II follows;
- both follow;
- neither follows;
- either I or II follows;
- one definite conclusion plus one complementary pair;
- selecting all valid conclusions;
- selecting an invalid conclusion.

#### Coded inequality

- supplied symbols representing `>`, `<`, `=`, `≥`, `≤`;
- decode a coded statement and evaluate a conclusion;
- identify which coded conclusion follows;
- encode a natural comparison using the supplied code;
- recover a missing coded operator;
- recover a uniquely determined symbol mapping;
- evaluate multiple coded statements.

#### Linguistic inequality

The uploaded material includes equivalent positive and negative verbal forms:

```text
A is greater than B                 → A > B
A is smaller than B                 → A < B
A is not smaller than B             → A ≥ B
A is not greater than B             → A ≤ B
A is neither smaller nor greater    → A = B
A is neither smaller nor equal      → A > B
A is neither greater nor equal      → A < B
```

These must be supported as structured linguistic renderings, not parsed from arbitrary prose.

#### Quantity-comparison presentations

- marks;
- salaries;
- weights;
- heights;
- scores;
- prices;
- production quantities;
- ages where no age arithmetic is needed;
- generic values represented by letters or named entities.

These are surface contexts over the same comparison engine.

### 2.2 Excluded from INE-001

#### Algebraic inequalities

Do not include:

- solving `2x + 3 > 9`;
- quadratic inequalities;
- rational inequalities;
- modulus inequalities;
- interval notation;
- maximum or minimum values satisfying an algebraic inequality;
- inequalities involving functions.

Those belong to Quantitative Aptitude, not Reasoning Inequality. The uploaded Quant reference covers these as algebraic solution-range problems, which is a separate mathematical domain.

#### Ranking and order

A question belongs to `RNK-001` when it asks:

- first, second, or third rank;
- position from top or bottom;
- number of persons between two people;
- total count inferred from ranks;
- arranging entities into a complete order.

INE-001 may establish `A > B > C`, but asking “Who ranks second?” should normally remain with Ranking unless the source format explicitly presents it as an inequality conclusion question.

#### Data Sufficiency

Questions such as:

> Is A greater than B?  
> Statement I...  
> Statement II...

belong to `DSF-001`, even when the statements contain inequalities.

The reasoning reference itself contains inequality evidence embedded inside Data Sufficiency, confirming the need for a chapter boundary.

#### Syllogism and statement logic

Do not include natural-language propositions where the primary task is logical implication rather than numerical or ordinal comparison.

#### Mathematical Operations

If the symbols redefine arithmetic operations such as addition, subtraction, or multiplication, ownership belongs to `OPS-001`.

#### General coding-decoding

If the main burden is discovering letter or word codes rather than comparison relations, ownership belongs to `COD-001`.

---

## 3. Governing design decisions

1. **Formal relation semantics are authoritative.**
2. Generate a valid hidden comparison model first.
3. Derive statements from the model rather than assembling arbitrary chains.
4. The independent solver must receive only displayed structured statements.
5. Strictness must propagate correctly.
6. Equality must be represented as equivalence, not as two unrelated arrows.
7. “Cannot be determined” must mean that multiple valid models give different relations.
8. “Either-or” must be proved through complementary exhaustiveness, not phrase matching.
9. Coded symbols must map one-to-one to canonical relations unless a source-backed format explicitly says otherwise.
10. Surface context, entity names, and symbol shapes are instance variables, not separate QLs.
11. Permanent QLs are allocated only after source, merge/split, inverse, and gap audits.
12. Hindi and Punjabi must render from structured semantics rather than translated English strings.

---

## 4. Formal relation model

### 4.1 Canonical relation set

```ts
type ComparisonRelation =
  | "GREATER_THAN"
  | "LESS_THAN"
  | "EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN_OR_EQUAL";
```

For internal reasoning, these should be normalized into bounded order constraints.

```ts
interface ComparisonConstraint {
  leftId: string;
  relation: ComparisonRelation;
  rightId: string;
  sourceStatementId: string;
}
```

### 4.2 Relation-domain representation

A useful formal representation is a set of possible atomic relations:

```ts
type AtomicOrder = "LT" | "EQ" | "GT";

const relationDomain = {
  LESS_THAN: new Set(["LT"]),
  GREATER_THAN: new Set(["GT"]),
  EQUAL_TO: new Set(["EQ"]),
  LESS_THAN_OR_EQUAL: new Set(["LT", "EQ"]),
  GREATER_THAN_OR_EQUAL: new Set(["GT", "EQ"]),
};
```

This representation makes conclusion testing exact.

Examples:

```text
A > B             → possible(A,B) = {GT}
A ≥ B             → possible(A,B) = {GT, EQ}
A and B unknown   → possible(A,B) = {LT, EQ, GT}
```

### 4.3 Query semantics

```ts
type InequalityQuery =
  | {
      kind: "DETERMINE_RELATION";
      leftId: string;
      rightId: string;
      answerMode:
        | "EXACT_RELATION"
        | "STRONGEST_DEFINITE_RELATION"
        | "POSSIBLE_RELATIONS";
    }
  | {
      kind: "EVALUATE_CONCLUSION";
      conclusion: ComparisonConstraint;
      evaluation: "DEFINITE" | "POSSIBLE" | "IMPOSSIBLE";
    }
  | {
      kind: "EVALUATE_CONCLUSION_SET";
      conclusions: readonly ComparisonConstraint[];
      responseSchemeId: string;
    }
  | {
      kind: "SELECT_VALID_CONCLUSION";
      conclusions: readonly ComparisonConstraint[];
    }
  | {
      kind: "SELECT_INVALID_CONCLUSION";
      conclusions: readonly ComparisonConstraint[];
    }
  | {
      kind: "EVALUATE_COMPLEMENTARY_PAIR";
      conclusionA: ComparisonConstraint;
      conclusionB: ComparisonConstraint;
    }
  | {
      kind: "RECOVER_MISSING_OPERATOR";
      statementId: string;
      missingPosition: number;
      requiredInference: ComparisonConstraint;
    }
  | {
      kind: "RECOVER_CODE_MAP";
      codedStatements: readonly CodedComparisonStatement[];
    }
  | {
      kind: "ENCODE_RELATION";
      relation: ComparisonConstraint;
    };
```

---

## 5. Solver architecture

### 5.1 Primary graph solver

The main solver should construct a directed comparison graph.

For strict comparisons:

```text
A > B → edge A → B with strictness STRICT
```

For inclusive comparisons:

```text
A ≥ B → edge A → B with strictness NON_STRICT
```

Equality should use disjoint-set equivalence or canonical component merging:

```text
A = B → union(A, B)
```

After equality compression, solve transitive relations between components.

### 5.2 Strictness composition

The relation along a path must be calculated formally.

#### Same-direction composition

```text
>  + >   → >
>  + ≥   → >
≥  + >   → >
≥  + ≥   → ≥
```

Likewise:

```text
<  + <   → <
<  + ≤   → <
≤  + <   → <
≤  + ≤   → ≤
```

A chain is strict if at least one edge is strict and all edges point consistently.

Example:

```text
A ≥ B > C ≥ D
```

Therefore:

```text
A > D
```

The source material describes this learner-facing idea as giving strict relations precedence, but the implementation should derive it through path strictness.

### 5.3 Opposing-path handling

Example:

```text
A > B < C
```

No definite relation follows between `A` and `C`.

This must not be implemented as a fixed list of “opposite symbol pairs.” Instead, the model solver should show that valid assignments exist where:

```text
A > C
A = C
A < C
```

Therefore:

```text
possible(A,C) = {GT, EQ, LT}
```

The uploaded books identify these as no-relationship cases, including combinations such as `> <`, `≥ ≤`, `> ≤`, and `< ≥`.

### 5.4 Independent model enumerator

Every prototype and permanent QL must be verified independently.

For small graphs, enumerate bounded integer assignments:

```text
entity values ∈ [-n, ..., n]
```

Then retain assignments satisfying all displayed constraints.

From the valid model set, calculate:

```ts
interface PairRelationEvidence {
  possibleAtomicRelations: ReadonlySet<AtomicOrder>;
  isDefinite: boolean;
  strongestDefiniteRelation?: ComparisonRelation;
  witnessByRelation: Partial<Record<AtomicOrder, NumericAssignment>>;
}
```

Examples:

```text
possible = {GT}        → definitely >
possible = {GT, EQ}    → definitely ≥, but not definitely >
possible = {LT, EQ}    → definitely ≤
possible = {LT,EQ,GT}  → relation cannot be determined
```

The graph solver and model enumerator must agree.

### 5.5 Contradiction detection

Reject statements such as:

```text
A > B
B ≥ A
```

because together they require `A > B` and `B ≥ A`, which is impossible.

Also reject:

```text
A > B = C > A
```

The system should detect:

- strict cycles;
- equality conflicting with strict order;
- mutually impossible inclusive chains;
- coded-map contradictions;
- duplicate statements that add no evidence when uniqueness is required.

---

## 6. Either-or and complementary conclusions

This is one of the most error-prone areas and requires explicit semantics.

Two conclusions form an either-or answer only when all of the following are true:

1. neither conclusion is definitely true on its own;
2. the two conclusions concern the same ordered pair, allowing canonical reversal;
3. their satisfying atomic-relation domains are mutually exclusive within the valid model set;
4. their union covers every valid model relation for that pair;
5. the displayed statements are consistent and admit at least one valid model.

Common complementary partitions include:

```text
A > B   versus   A ≤ B
A ≥ B   versus   A < B
A < B   versus   A ≥ B
A ≤ B   versus   A > B
```

Pairs such as `A > B` versus `A = B`, or `A < B` versus `A = B`, are complementary only when the valid model domain has already excluded the third atomic relation. They are not universally either-or pairs.

Canonical reversal must be supported:

```text
A > B   ≡   B < A
A ≥ B   ≡   B ≤ A
```

The runtime should return evidence, not only a Boolean:

```ts
interface ComplementaryPairEvidence {
  individuallyDefinite: readonly [boolean, boolean];
  mutuallyExclusive: boolean;
  collectivelyExhaustive: boolean;
  validModelCount: number;
  atomicCoverage: ReadonlySet<AtomicOrder>;
  result: "BOTH" | "ONLY_FIRST" | "ONLY_SECOND" | "EITHER_OR" | "NEITHER";
}
```

---

## 7. Provisional checkpoint architecture

These checkpoints define discovery ownership. They do not allocate permanent QLs.

### INE-CP-001 — Direct Chains and Definite Relations

Ownership:

- direct and short transitive chains;
- strict, inclusive, and equality relations;
- reverse query direction;
- strongest definite relation;
- direct statement–conclusion evaluation;
- select the valid or invalid conclusion;
- definite versus indeterminate endpoint relation;
- short branches and equality propagation;
- contradiction rejection.

This is the foundation checkpoint and must establish the canonical constraint model, graph solver, model enumerator, and evidence contract used by every later checkpoint.

### INE-CP-002 — Multi-Link, Branched, and Disconnected Graphs

Ownership:

- longer chains;
- multiple routes between a pair;
- branched evidence graphs;
- irrelevant statements;
- partially connected and disconnected components;
- identify a pair with a definite relation;
- identify a pair without a definite relation;
- alternate-path strictness;
- equality components spanning branches.

### INE-CP-003 — Definite, Possible, and Impossible Conclusions

Ownership:

- distinguish definite truth from possible truth;
- determine all possible atomic relations;
- identify an impossible conclusion;
- strongest definite inclusive relation;
- witness models for non-definite claims;
- conclusion labels such as:

```ts
type ConclusionTruth =
  | "DEFINITELY_TRUE"
  | "POSSIBLY_TRUE"
  | "IMPOSSIBLE";
```

### INE-CP-004 — Complementary and Either-Or Conclusions

Ownership:

- `>` versus `=`;
- `<` versus `=`;
- `≥` versus `<`;
- `≤` versus `>`;
- complementary reversal forms;
- either-or combined with a separately definite conclusion;
- three-conclusion response schemes;
- proving why a pair is or is not complementary.

This checkpoint must not rely on textbook phrase rules alone.

### INE-CP-005 — Linguistic Inequalities

Ownership:

- greater than;
- less than;
- not less than;
- not greater than;
- neither less nor equal;
- neither greater nor equal;
- equal;
- mixed linguistic and symbolic statements;
- entity contexts such as marks, salaries, and height.

Example:

```text
P is not smaller than Q.
Q is greater than R.
```

Canonical form:

```text
P ≥ Q > R
```

Inference:

```text
P > R
```

Language-sensitive rendering belongs here, while the solver remains language-neutral.

### INE-CP-006 — Coded Inequality: Fixed Maps

Ownership:

- a complete code key is supplied;
- decode coded chains;
- evaluate conclusions;
- select the correct decoded relation;
- encode an ordinary relation;
- direct and reverse coded chains;
- mixed symbol shapes.

Example:

```text
@ means >
# means ≤
% means =
```

Question:

```text
A @ B % C # D
```

The coded layer must normalize into canonical comparison constraints before solving.

### INE-CP-007 — Coded Inequality: Map Recovery and Missing Operator

Ownership:

- recover a unique code map from examples;
- identify a missing coded symbol;
- choose the code that makes a conclusion definite;
- infer the only consistent map;
- incomplete map with uniquely sufficient evidence;
- map contradiction detection;
- one-to-one mapping proof.

The default code universe should contain five distinct symbols mapped bijectively to:

```text
>, <, =, ≥, ≤
```

Smaller maps may be admitted when source-backed.

### INE-CP-008 — Multiple Statement Sets and Advanced Synthesis

Ownership:

- choose which statement set establishes a relation;
- combine two independent chains;
- identify the consistent statement;
- identify the contradictory statement;
- replace one operator to make the chain valid;
- reconstruct a missing relation from endpoint evidence;
- shared-passage inequality sets;
- advanced definite/possible/impossible queries;
- hybrid linguistic and coded evidence.

This is not Data Sufficiency unless the answer contract explicitly asks whether statement I, II, or both are sufficient.

---

## 8. Open QL discovery principles

No permanent QL should be allocated merely because the following differ:

- letters versus names;
- marks versus salaries;
- `>` chain versus equivalent reversed `<` chain;
- chain length;
- option order;
- number of displayed entities;
- symbol shape;
- response labels;
- English versus Hindi versus Punjabi;
- conclusion order;
- direct versus visually reversed writing when solver semantics are identical.

A separate QL may be justified when at least one changes materially:

- inference contract;
- answer semantics;
- solver path;
- uncertainty model;
- inverse task;
- renderer structure;
- misconception architecture;
- grouped-question behavior.

---

## 9. Candidate solve-authority families

These are provisional authority names, not permanent QLs.

```text
DETERMINE_DIRECT_RELATION
DETERMINE_TRANSITIVE_RELATION
DETERMINE_STRONGEST_DEFINITE_RELATION
DETERMINE_RELATION_OR_INDETERMINATE
IDENTIFY_PAIR_WITH_DEFINITE_RELATION
IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION

EVALUATE_SINGLE_CONCLUSION
EVALUATE_CONCLUSION_SET
SELECT_VALID_CONCLUSION
SELECT_INVALID_CONCLUSION

RESOLVE_COMPLEMENTARY_PAIR
RESOLVE_CONCLUSION_SET_WITH_COMPLEMENTARY_PAIR

NORMALIZE_LINGUISTIC_COMPARISONS
EVALUATE_LINGUISTIC_INEQUALITY_CONCLUSION

DECODE_FIXED_INEQUALITY_MAP
ENCODE_COMPARISON_WITH_FIXED_MAP
RECOVER_INEQUALITY_CODE_MAP
RECOVER_MISSING_INEQUALITY_OPERATOR

IDENTIFY_CONTRADICTORY_STATEMENT
IDENTIFY_CONSISTENT_STATEMENT
RECONSTRUCT_MISSING_RELATION
RESOLVE_MULTI_CHAIN_SYNTHESIS
```

These must be merged or split only after prototypes show whether they genuinely have distinct contracts.

---

## 10. Generator architecture

### 10.1 Hidden-state-first generation

```text
choose entity count
→ generate ordered value classes
→ optionally merge entities into equality classes
→ assign concrete hidden values
→ derive candidate constraints
→ select a connected evidence subgraph
→ choose query
→ independently solve
→ minimize or enrich statements according to difficulty
→ render
```

Example hidden order:

```text
A = D > B > C = E
```

Possible displayed evidence:

```text
A ≥ B
D > B
B > C
C = E
A = D
```

### 10.2 Statement minimization

For each question:

- preserve enough information for the intended answer;
- remove irrelevant statements unless difficulty intentionally uses noise;
- avoid multiple equivalent duplicate statements;
- retain alternate paths only when the QL tests multi-path reasoning;
- ensure indeterminate questions genuinely retain multiple model relations.

### 10.3 Difficulty controls

Difficulty should be calculated from instance properties.

Suggested factors:

```text
entity count
statement count
shortest proof-path length
number of equality components
strict/non-strict mixing
query reversal
branching factor
irrelevant-evidence count
number of valid relation witnesses
complementary-pair involvement
coded-map burden
linguistic normalization burden
number of conclusions
```

Difficulty labels must not be hard-coded solely by QL. A QL may define a range, while the instantiated graph determines the final rating.

### 10.4 Determinism and replay

Every generated item must be reproducible from a stable seed and carry enough provenance to replay:

```ts
interface InequalityGenerationProvenance {
  chapterId: "INE-001";
  checkpointId: string;
  provisionalAuthorityId: string;
  seed: string;
  generatorVersion: string;
  solverVersion: string;
  rendererVersion: string;
  language: "en" | "hi" | "pa";
}
```

---

## 11. Answer and option architecture

Every question must have exactly one defensible answer under its declared answer contract.

### 11.1 Relation options

When the answer is a relation, the option universe may include:

```text
>
<
=
≥
≤
relation cannot be determined
```

Only four should be selected, and each distractor must have a known misconception owner.

### 11.2 Conclusion-set options

Response schemes must be stored separately from conclusion semantics. Typical schemes include:

```text
Only conclusion I follows
Only conclusion II follows
Either conclusion I or II follows
Neither conclusion I nor II follows
Both conclusions I and II follow
```

A two-conclusion item normally selects four options from the source-backed response scheme. The renderer must not silently change what “either” or “both” means.

### 11.3 Misconception-owned distractors

Candidate misconception owners include:

- `MISREAD_QUERY_DIRECTION`;
- `DROP_EQUALITY_CASE`;
- `PROMOTE_INCLUSIVE_TO_STRICT`;
- `DEMOTE_STRICT_TO_INCLUSIVE`;
- `ASSUME_OPPOSING_BRANCH_RELATION`;
- `TREAT_POSSIBLE_AS_DEFINITE`;
- `TREAT_UNKNOWN_AS_EQUAL`;
- `IGNORE_EQUALITY_PROPAGATION`;
- `APPLY_SYMBOL_PRIORITY_WITHOUT_DIRECTION`;
- `MISIDENTIFY_COMPLEMENTARY_PAIR`;
- `DECODE_CODE_MAP_IN_REVERSE`;
- `IGNORE_ONE_TO_ONE_CODE_MAPPING`;
- `USE_HIDDEN_MODEL_INSTEAD_OF_DISPLAYED_EVIDENCE`.

Do not create distractors through random relation substitution.

### 11.4 Uniqueness checks

Reject an item when:

- two options are semantically equivalent;
- more than one option follows;
- no option follows;
- an inclusive and strict option are both presented as exact answers without a declared strongest-relation policy;
- translated response labels collapse into the same meaning;
- a coded symbol is visually confusable with a canonical mathematical operator in context.

---

## 12. Explanation architecture

Every explanation must be question-specific and derived from solver evidence.

Recommended structure:

1. **Normalize** each displayed statement.
2. **Connect** the relevant entities or equality components.
3. **Compose** the relation along the proof path.
4. **Evaluate** each conclusion or option under the declared contract.
5. **Conclude** with the exact correct response.

Example:

```text
Given: P ≥ Q and Q > R.
The path from P to R is P ≥ Q > R.
Because the path is consistent and contains a strict step, P > R.
Therefore, the conclusion P > R definitely follows.
```

For indeterminate cases, explanations must show counter-witnesses or clearly state the remaining possibilities:

```text
A > B and C > B do not fix the relation between A and C.
Valid arrangements include A > C, A = C, and A < C.
Therefore, the relation cannot be determined.
```

For either-or cases, explain individual non-definiteness and joint exhaustiveness. Do not merely say “the symbols form a complementary pair.”

Explanations must not reveal hidden generator values or facts that were not displayed to the learner.

### 12.1 Mandatory learner-language standard

Solver evidence decides the answer, but solver terminology must not appear in the learner explanation. Every CP must enforce these rules in its generator, validator, tests, and review pack:

- use one short paragraph of two to four simple sentences;
- show the relevant combined chain directly;
- explain the decisive step in everyday language;
- state why the correct answer follows;
- discuss other options only when the question type cannot be explained clearly without doing so;
- never use internal terms such as “endpoint,” “model,” “solver,” “strict parts,” “carry,” or “strongest definite relation” in learner-facing text;
- prefer wording such as “may be,” “must be,” “says the opposite,” and “cannot be decided”;
- reject an explanation during validation if it is technically correct but sounds like an implementation note.

This learner-language standard is inherited by every later INE-001 CP and does not require separate approval each time.

---

## 13. Rendering and multilingual design

### 13.1 Language-neutral mathematics

The solver, graph, proof evidence, option truth, and code-map logic must be language-neutral.

### 13.2 Structured linguistic rendering

Use semantic phrase keys rather than translated English strings:

```ts
type RelationPhraseKey =
  | "GREATER_THAN"
  | "LESS_THAN"
  | "NOT_LESS_THAN"
  | "NOT_GREATER_THAN"
  | "EQUAL_TO"
  | "NEITHER_LESS_NOR_GREATER"
  | "NEITHER_LESS_NOR_EQUAL"
  | "NEITHER_GREATER_NOR_EQUAL";
```

Each locale owns complete sentence patterns, agreement, punctuation, and examination terminology.

### 13.3 Symbol stability

- Prefer Unicode `≥` and `≤` in canonical display.
- Support source-backed ASCII forms only at the ingestion or compatibility boundary.
- Never substitute `=>` for `≥` or `=<` for `≤` in learner-facing content.
- Preserve code symbols exactly and reject glyphs that disappear, combine, or change meaning under the chosen font.

### 13.4 Multilingual validation

For English, Hindi, and Punjabi:

- render from the same semantic instance;
- retain identical option correctness;
- retain identical code-map meaning;
- verify negative constructions editorially;
- verify that “either,” “both,” “only,” and “neither” preserve the response contract;
- prohibit translation-time operator inversion.

Multilingual approval begins only after the English authority and mathematics are frozen.

---

## 14. Runtime schema

```ts
interface InequalityQuestionInstance {
  provenance: InequalityGenerationProvenance;
  entities: readonly InequalityEntity[];
  displayedStatements: readonly InequalityStatement[];
  query: InequalityQuery;
  responseScheme?: InequalityResponseScheme;
  options: readonly InequalityOption[];
  correctOptionId: string;
  solverEvidence: InequalitySolverEvidence;
  explanation: InequalityExplanation;
  diagnostics: InequalityDiagnostics;
}

interface InequalitySolverEvidence {
  normalizedConstraints: readonly ComparisonConstraint[];
  equalityComponents: readonly (readonly string[])[];
  proofPaths: readonly ComparisonProofPath[];
  pairEvidence: readonly PairRelationEvidence[];
  validModelCount?: number;
  witnesses?: readonly NumericAssignment[];
  graphSolverAnswer: unknown;
  independentVerifierAnswer: unknown;
}

interface InequalityDiagnostics {
  isConsistent: boolean;
  hasUniqueAnswer: boolean;
  hasDuplicateOptions: boolean;
  hasHiddenStateLeak: boolean;
  difficultySignals: Readonly<Record<string, number | boolean>>;
  rejectionReasons: readonly string[];
}
```

The public payload may omit internal witnesses, but the review and replay artifacts should retain them.

---

## 15. Validation and rejection gates

Every generated item must pass all applicable gates.

### Mathematical gates

- at least one valid model exists;
- graph solver and independent verifier agree;
- the declared answer is unique;
- every conclusion has the recorded truth status;
- strictness composition is correct;
- equality closure is correct;
- disconnectedness is not mistaken for equality;
- complementary coverage is proved when used;
- coded mappings are consistent and uniquely sufficient when recovery is asked.

### Presentation gates

- exactly four answer options unless a source-backed grouped format explicitly differs;
- option text is unique;
- statements and conclusions use distinct identifiers where required;
- no malformed chain or missing operand;
- mathematical glyphs render correctly;
- explanations cite only displayed evidence;
- prompt wording matches the answer contract.

### Discovery gates

- source form recorded;
- prototype ancestry recorded;
- inverse and edge variants attempted;
- merge/split decision recorded;
- representation-only variants excluded from QL inflation;
- unresolved gaps remain explicit;
- permanent QL allocation remains zero until checkpoint closure.

---

## 16. Testing strategy

### 16.1 Unit tests

Cover:

- relation reversal;
- relation-domain normalization;
- equality union and compression;
- strict and inclusive path composition;
- opposing branches;
- disconnected components;
- contradiction detection;
- complementary-pair classification;
- code-map bijection;
- linguistic phrase normalization;
- strongest-definite-relation selection.

### 16.2 Exhaustive small-graph tests

For small entity counts, enumerate:

- hidden total preorders;
- consistent displayed subsets;
- all query pairs;
- all canonical conclusions.

Compare graph-solver results against model enumeration. This should catch entire classes of transitivity and uncertainty defects rather than only sampled examples.

### 16.3 Property tests

Required invariants include:

```text
reverse(reverse(r)) = r
solve(S) = solve(permuteStatements(S))
solve(renameEntities(S)) is isomorphic to solve(S)
adding a logically redundant statement does not change the answer
removing required evidence does not preserve a definite answer unless another proof path exists
rendering language does not change option truth
```

### 16.4 Golden review packs

Each provisional authority should emit a deterministic English review pack containing:

- easy, medium, and hard instances where supported;
- direct and reverse queries;
- equality and inclusive-edge cases;
- at least one rejection or counterexample artifact;
- solver trace;
- independent witness evidence;
- misconception labels for every distractor.

### 16.5 Regression tests

Freeze every corrected defect as a regression case, especially:

- inclusive chain incorrectly promoted to strict;
- strict path incorrectly weakened;
- equality lost during compression;
- opposite branches assigned a relation;
- invalid either-or pair accepted;
- hidden model leaked into explanation;
- code mapping recovered without uniqueness;
- Hindi or Punjabi negative phrasing reversing the operator.

---

## 17. INE-CP-001 open-discovery plan

CP-001 is not a single template. It is a discovery checkpoint for the direct-chain foundation.

### 17.1 Initial source audit

Record, without immediately converting each example into a QL:

- source and page identity;
- displayed statement shape;
- operator inventory;
- chain topology;
- conclusion count;
- response scheme;
- learner operation;
- solver operation;
- uncertainty behavior;
- inverse form;
- representation-only differences;
- likely misconception owners.

### 17.2 Foundation prototype matrix

The first wave should cover at least:

| Axis | Required coverage |
|---|---|
| Relation inventory | strict only; equality; mixed strict/inclusive |
| Topology | direct edge; linear chain; short branch; disconnected pair |
| Query | direct; reverse; endpoint; conclusion truth; select valid; select invalid |
| Answer semantics | exact; strongest definite; indeterminate |
| Evidence | single path; equality-compressed path; competing branches |
| Difficulty | short; medium; proof path with irrelevant evidence |

### 17.3 Required CP-001 edge cases

- `A ≥ B ≥ C` implies `A ≥ C`, not necessarily `A > C`;
- `A ≥ B > C` implies `A > C`;
- `A = B > C` implies `A > C`;
- `A > B = C` implies `A > C`;
- `A > B < C` leaves `A` versus `C` indeterminate;
- `A ≥ B ≤ C` leaves `A` versus `C` indeterminate;
- disconnected entities remain indeterminate;
- query reversal changes `>` to `<` and `≥` to `≤`;
- direct and transitive evidence must agree if both are displayed;
- strict cycles are rejected;
- inclusive cycles may collapse to equality only when formally justified;
- conclusion `A ≥ B` follows from `A > B`, while `A > B` does not follow from `A ≥ B`.

### 17.4 CP-001 deliverables

- chapter directory and checkpoint README;
- canonical types;
- normalization layer;
- equality-aware graph solver;
- bounded independent model enumerator;
- contradiction detector;
- provisional-authority registry;
- seeded prototypes;
- review-pack generator;
- solver-equivalence tests;
- source ledger;
- gap ledger;
- merge/split ledger;
- no permanent QLs.

### 17.5 CP-001 closure gates

CP-001 may close only when:

1. the source pass is saturated for direct-chain formats;
2. all foundation prototypes pass both solvers;
3. every inverse and required edge case is represented;
4. distractors are misconception-owned;
5. English review material is complete;
6. merge/split decisions are documented;
7. unresolved questions are either closed or explicitly moved to later checkpoints;
8. a manual approval gate authorizes permanent QL allocation.

Until then:

```text
Permanent QLs = 0
Frozen solve modes = 0
Chapter release = disabled
```

---

## 18. Source and legacy-code policy

Uploaded books and repository legacy code are prior art, not runtime authority.

They may provide:

- exam wording;
- response schemes;
- source-backed edge cases;
- coded-symbol presentations;
- learner shortcuts;
- misconception ideas.

They must not override:

- formal model semantics;
- independent verification;
- contradiction rejection;
- answer uniqueness;
- chapter ownership boundaries;
- multilingual structured rendering.

Any existing legacy inequality utility should be audited for reusable ideas, but the Reasoning V1 implementation must not silently inherit heuristic answer logic.

---

## 19. Integration policy

During discovery, implementation should remain additive inside:

```text
artifacts/api-server/src/reasoning-v1/topics/Inequality/INE-001/
```

Do not modify central Question Studio registries, public chapter lists, or release toggles during foundation discovery.

Integration begins only after:

- the checkpoint authority is approved;
- permanent QLs are allocated;
- English runtime is frozen;
- the chapter adapter contract is stable;
- review packs and tests are accepted.

Hindi and Punjabi integration follows the approved English semantic authority, not an independently evolving generator.

---

## 20. Chapter completion definition

INE-001 is complete only when:

- all admitted source-backed inequality families are assigned to a checkpoint;
- checkpoint boundaries survive overlap and merge/split audit;
- every permanent QL has a distinct justified contract;
- every generated question is deterministic and replayable;
- graph and independent solvers agree;
- contradictions and ambiguous answers are rejected;
- either-or semantics are formally proved;
- coded maps are validated;
- misconception-owned options and dynamic explanations are present;
- English, Hindi, and Punjabi render the same semantic instance correctly;
- manual editorial and mathematical approvals are recorded;
- Question Studio integration is explicitly enabled;
- the chapter-wide source, inverse, edge, representation, and gap audits are closed.

---

## 21. Immediate implementation order

```text
1. Create the INE-001 chapter foundation.
2. Build canonical relation types and normalization.
3. Implement the equality-aware graph solver.
4. Implement the independent bounded model enumerator.
5. Close contradiction and relation-domain tests.
6. Begin INE-CP-001 source-led open discovery.
7. Generate deterministic English prototypes and review packs.
8. Run inverse, edge, representation, and merge/split audits.
9. Request manual approval before allocating any permanent QL.
10. Keep Question Studio release and multilingual rollout disabled until the authority is frozen.
```

The first engineering milestone is therefore not a QL count. It is a proven CP-001 foundation in which the canonical graph solver, the independent model enumerator, and the displayed-answer contract agree on every admitted prototype.
