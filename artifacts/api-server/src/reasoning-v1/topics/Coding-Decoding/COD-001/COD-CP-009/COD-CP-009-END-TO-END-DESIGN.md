# COD-CP-009 — Sentence and Artificial-Language Coding

Status: **end-to-end design; permanent QL discovery not frozen; runtime not implemented**.

Authority:

1. `REASONING-V1-MASTER-BLUEPRINT.md`;
2. `REASONING-V1-ARCHITECTURE.md`;
3. `../cod-001-open-ql-discovery-amendment.md`;
4. this checkpoint design;
5. the checkpoint discovery audit.

No permanent `COD-QL-*` IDs or QL count are created by this document.

---

## 1. Checkpoint identity and numbering

The authoritative COD-001 scope assigns:

- `COD-CP-007` to digit, symbol and alphanumeric coding;
- `COD-CP-008` to renaming and substitution coding;
- `COD-CP-009` to sentence and artificial-language coding;
- `COD-CP-010` to conditional table coding.

Therefore sentence coding is designed under `COD-CP-009`, even when it is developed before CP-007 or CP-008. Until the earlier checkpoint counts are discovered, CP-009 uses non-permanent prototype IDs only.

---

## 2. Product objective

Generate competitive-exam questions in which ordinary words or short messages are represented by arbitrary code tokens, and the student must infer exact, possible, or impossible word-token relationships from several coded statements.

The checkpoint targets SSC, Banking, Railways and Punjab state examination styles. Questions must feel like standard exam items, not abstract constraint-programming exercises.

A valid puzzle contains:

```text
hidden one-to-one word-token mapping
  + natural displayed statements
  + unordered code-token sets
  + a query over the formally valid mapping space
  + four independently validated options
  + an evidence-grounded explanation
```

---

## 3. Source-format findings

The source review confirms the following recurring forms:

1. identify the code for one word by comparing statements with one common word;
2. identify the word represented by one code token;
3. use chained common-word and exclusion reasoning across three or more statements;
4. conclude that a word has either of two possible codes when the evidence is insufficient for a unique token;
5. determine the code for a new short phrase from already inferred word codes;
6. embed a sentence-code puzzle inside Data Sufficiency.

The sixth form remains outside this checkpoint. CP-009 may provide a reusable sentence-code solver later, but deciding whether Statement I, Statement II, both, or neither are sufficient belongs to the Data Sufficiency chapter.

The source audit does not justify freezing a fixed number of QLs. It justifies exact, inverse, phrase, partial-information and exclusion prototypes, which must still pass merge/split and gap audits.

---

## 4. Included and excluded scope

### 4.1 Included

- arbitrary one-to-one mapping between visible words and short code tokens;
- three to six coded statements;
- token order irrelevant to word order;
- exact word-to-token and token-to-word deduction;
- exact phrase-to-token-set and token-set-to-phrase deduction;
- one missing word or code token in a displayed statement;
- possible-code and impossible-code questions under partial information;
- chained intersections, set differences, propagation and complete solution enumeration;
- English-first runtime followed by native Hindi and Punjabi adaptations.

### 4.2 Excluded

- fixed-position word coding where the first word always receives the first token;
- repeated occurrences of the same word inside one statement in the first runtime;
- many-to-one or one-to-many lexical coding;
- synonyms treated as the same source word;
- semantic translation between real languages;
- operator substitution or equation evaluation;
- conditional table coding, owned by CP-010;
- data-sufficiency answer contracts;
- paragraph comprehension, statement-conclusion or general logic puzzles;
- free-form runtime sentence generation.

Order-preserving sentence coding is excluded because it collapses into direct positional substitution and does not require the intended constraint-deduction skill.

---

## 5. Formal domain model

The implementation should expose concepts equivalent to:

```ts
interface SentenceCodeLexeme {
  id: string;
  display: string;
  normalized: string;
  partOfSpeech: string;
  semanticTags: readonly string[];
  locale: "en-IN" | "hi-IN" | "pa-IN";
  status: "DRAFT" | "REVIEWED" | "APPROVED";
}

interface SentenceCodeRow {
  rowId: string;
  wordIds: readonly string[];
  codeTokens: readonly string[];
  renderedSentence: string;
  renderedCodeOrder: readonly string[];
}

type SentenceCodeQuery =
  | { kind: "WORD_TO_TOKEN"; wordId: string; semantics: "EXACT" | "POSSIBLE" | "IMPOSSIBLE" }
  | { kind: "TOKEN_TO_WORD"; token: string; semantics: "EXACT" | "POSSIBLE" | "IMPOSSIBLE" }
  | { kind: "WORDS_TO_TOKEN_SET"; wordIds: readonly string[]; semantics: "EXACT" | "POSSIBLE" }
  | { kind: "TOKEN_SET_TO_WORDS"; tokens: readonly string[]; semantics: "EXACT" | "POSSIBLE" }
  | { kind: "MISSING_TOKEN"; rowId: string }
  | { kind: "MISSING_WORD"; rowId: string };

interface SentenceCodingPrompt {
  rows: readonly SentenceCodeRow[];
  query: SentenceCodeQuery;
  tokenOrderSemantics: "UNORDERED";
}

interface SentenceCodeSolution {
  wordToToken: Readonly<Record<string, string>>;
}

interface SentenceCodeSolutionSpace {
  solutions: readonly SentenceCodeSolution[];
  solutionCount: number;
  candidateTokensByWord: Readonly<Record<string, readonly string[]>>;
  candidateWordsByToken: Readonly<Record<string, readonly string[]>>;
  invariantPairs: readonly { wordId: string; token: string }[];
}
```

The hidden generator mapping is never accepted as proof. The solver reconstructs `SentenceCodeSolutionSpace` from displayed rows only.

---

## 6. Constraint semantics

For every displayed row `i`:

```text
Wᵢ = set of words in the sentence
Cᵢ = set of displayed code tokens
|Wᵢ| = |Cᵢ|
```

The hidden system is a bijection `f` over the active puzzle vocabulary and token universe. A mapping is valid only when:

```text
f(Wᵢ) = Cᵢ for every row i
```

Token order is deliberately irrelevant. The renderer may shuffle the same row's code tokens without changing the puzzle.

The complete solution space is:

```text
S = { all bijections f satisfying every displayed row }
```

### 6.1 Exact atomic answers

For word `w`:

```text
PossibleTokens(w) = { f(w) | f ∈ S }
```

The exact code for `w` exists only when `|PossibleTokens(w)| = 1`.

The inverse definition applies to a token.

### 6.2 Exact set answers

For a word set `P`:

```text
CodeSet_f(P) = { f(w) | w ∈ P }
```

The code set is exact only when `CodeSet_f(P)` is identical for every `f ∈ S`.

### 6.3 Possible answers

An offered word-token or phrase-token-set relationship is possible when it is true in at least one solution. For a genuine partial-information question, it must not be true in all solutions.

Exactly one displayed option may satisfy the requested possibility predicate.

### 6.4 Impossible answers

An offered relationship is impossible when it is true in zero solutions. For an impossibility question, the other three options must each be witnessed by at least one valid solution.

### 6.5 Missing-member answers

A missing token or word is accepted only when the omitted member is invariant across all solutions after the remaining row members and all other statements are considered.

---

## 7. Constraint-solver architecture

### 7.1 Candidate-set propagation

Initialize each active word with every active code token. Apply row membership constraints:

- a word appearing in a row may map only to a token in that row;
- a word outside a row may not map to a token whose complete row membership proves it belongs to that row's word set;
- singleton candidates propagate through the global bijection;
- resolved tokens are removed from every other word;
- Hall-set or equivalent subset propagation may be used when useful.

Propagation is an optimization, not the final proof.

### 7.2 Complete enumeration

Use bounded backtracking with minimum-remaining-values ordering:

1. choose the unresolved word with the smallest candidate set;
2. assign one unused token;
3. reject partial assignments violating any row-set equality;
4. propagate;
5. recurse until a complete bijection is found;
6. enumerate all valid bijections or stop only when the query's formal predicate has been completely proven.

The active universe should normally contain five to nine words. A prototype may explore ten only if exhaustive enumeration remains safely bounded.

The solver must expose a configured solution limit and diagnostic. A candidate puzzle is rejected, not approximated, when the complete required solution space cannot be proven within the designed bound.

### 7.3 Independent verification

The checkpoint requires two non-circular verification paths:

- the production constraint solver using propagation plus backtracking;
- an independent brute-force or exact-cover verifier over smaller bounded universes used in tests and candidate audits.

Both must agree on:

- solution count;
- invariant word-token pairs;
- candidate sets;
- exact/possible/impossible status of every option.

---

## 8. Provisional inference topologies

These topology IDs are generation and analysis tools, not permanent QLs.

### `DIRECT_SINGLE_INTERSECTION`

Two or more rows share exactly one relevant word and exactly one code token. The target is resolved immediately.

### `CHAINED_SINGLETON_PROPAGATION`

One pair is resolved first; removing that pair turns another candidate set into a singleton, eventually resolving the target.

### `SET_DIFFERENCE_ELIMINATION`

Rows share multiple words or tokens. A third row removes one or more candidates and leaves the target invariant.

### `FORKED_EVIDENCE_JOIN`

The target is constrained by two independent branches of rows that meet only through the target or a final exclusion.

### `GLOBAL_BIJECTION_DEDUCTION`

No single pairwise comparison identifies the target. The target becomes unique only after the complete one-to-one mapping constraints are propagated.

### `CONTROLLED_PARTIAL_INFORMATION`

The solution space intentionally contains multiple bijections. The query asks for a possible or impossible relationship and is validated over every solution.

### `PHRASE_SET_COMPOSITION`

The required phrase contains two or three words whose tokens are inferred through separate evidence paths and combined as an unordered set.

### `MISSING_MEMBER_COMPLETION`

One displayed row has one omitted word or token. The missing member is uniquely reconstructed from the complete constraint system.

Statement count, sentence length and exact overlap graph do not create QLs by themselves. They are instance parameters unless prototype evidence proves a materially different solver, answer or explanation contract.

---

## 9. Provisional task-contract matrix

The following are candidate contracts only. The discovery audit may merge or split them before permanent IDs are assigned.

| Prototype ID | Query direction | Answer semantics | Answer shape | Current evidence |
|---|---|---|---|---|
| `COD-CP009-PROT-EXACT-WORD-TO-TOKEN` | word → token | exact | single token | source-confirmed |
| `COD-CP009-PROT-EXACT-TOKEN-TO-WORD` | token → word | exact inverse | one word | source-confirmed inverse |
| `COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS` | words → token set | exact | token set | source-confirmed message coding |
| `COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE` | token set → words | exact inverse | word set/phrase | inverse-contract candidate |
| `COD-CP009-PROT-MISSING-TOKEN` | incomplete row → token | exact | single token | standard missing-member presentation candidate |
| `COD-CP009-PROT-MISSING-WORD` | incomplete row → word | exact inverse | one word | inverse-contract candidate |
| `COD-CP009-PROT-POSSIBLE-TOKEN` | word → token | possible, non-definite | single token | source-confirmed either/possible form |
| `COD-CP009-PROT-POSSIBLE-WORD` | token → word | possible, non-definite | one word | inverse-contract candidate |
| `COD-CP009-PROT-IMPOSSIBLE-TOKEN` | word → token | impossible | single token | common competitive-exam exclusion form; prototype required |
| `COD-CP009-PROT-IMPOSSIBLE-WORD` | token → word | impossible | one word | inverse-contract candidate |
| `COD-CP009-PROT-POSSIBLE-PHRASE-CODE` | words → token set | possible | token set | advanced partial-information candidate |
| `COD-CP009-PROT-POSSIBLE-DECODED-PHRASE` | token set → words | possible | word set/phrase | inverse-contract candidate |

No permanent QL is created merely because a row appears in this table.

### 9.1 Deferred prototype candidates

The following require stronger source evidence before prototype allocation:

- return the complete set of all possible codes for one word;
- identify which word's code can be determined uniquely;
- identify which additional statement would make a code determinable;
- ordered “respectively” answers when code order is otherwise irrelevant;
- sentence coding wrapped in Data Sufficiency.

---

## 10. QL merge/split principles

Two candidate contracts should merge when they differ only by:

- number of statements;
- sentence length;
- vocabulary theme;
- target word identity;
- direct versus chained instance topology, if the solver and answer predicate remain identical;
- visual row order;
- code-token order;
- easy versus hard instance parameters.

They should remain separate when they require materially different:

- query direction and inverse validation;
- answer semantics: exact, possible or impossible;
- answer cardinality: one token/word versus a set;
- missing-member renderer and validation;
- option truth predicate;
- explanation proof obligation;
- localization or grammatical architecture.

The final QL boundary is decided only after executable prototypes demonstrate these differences.

---

## 11. Generation pipeline

```text
prototype contract lookup
  -> deterministic seed
  -> choose inference topology
  -> choose locale-specific scenario template
  -> instantiate approved lexemes
  -> build hidden word-token bijection
  -> derive statement word sets
  -> derive code-token sets
  -> independently shuffle each token row
  -> solve from displayed rows only
  -> verify required solution multiplicity
  -> verify every row contributes to the query
  -> construct query
  -> construct diagnosed options
  -> evaluate every option across the full solution space
  -> shuffle options
  -> build statement-code renderer payload
  -> build explanation proof
  -> final editorial and structural validation
```

Candidate rejection is deterministic and bounded.

---

## 12. Puzzle-generation constraints

### 12.1 Size bounds

Initial prototype domain:

- statements: 3–6;
- words per statement: 3–5;
- active distinct words: 5–9;
- query phrase length: 1–3 words;
- code-token length: normally 2–4 Latin letters;
- exactly one code token per distinct active word.

These are safe prototype bounds, not QL counts.

### 12.2 Structural requirements

- every row contains equal word and token cardinality;
- no duplicate word inside one statement;
- no duplicate token inside one code row;
- all active tokens are globally unique;
- the target lies in the connected evidence component;
- disconnected decorative components are rejected;
- duplicate or subset-equivalent rows are rejected;
- every displayed row must affect the target answer or its requested possibility classification;
- the displayed evidence must match the intended exact/possible/impossible multiplicity;
- no unlisted alternative option may satisfy the query.

### 12.3 Minimality audit

Remove each displayed row in turn and re-solve. A row is redundant when removing it leaves the complete answer predicate and option classification unchanged. Redundant rows are rejected unless a future source-proven format explicitly tests irrelevant information.

### 12.4 Order-invariance audit

For every accepted puzzle:

- permute the statement rows;
- permute words only at the renderer level when grammar is not changed? No—natural sentence word order remains fixed;
- permute the code tokens independently within every row;
- re-solve.

The solution space and correct option must remain unchanged under statement-row and code-token permutations.

---

## 13. Language-data architecture

Free-form sentence generation is prohibited. Each locale uses curated components.

### 13.1 Dataset layers

```text
lexeme registry
  + grammatical frame registry
  + semantic compatibility registry
  + scenario/topology templates
  + editorial status
```

Recommended conceptual files:

```text
datasets/
  code-tokens.ts
  lexemes.en.ts
  sentence-frames.en.ts
  scenarios.en.ts
  lexemes.hi.ts
  sentence-frames.hi.ts
  scenarios.hi.ts
  lexemes.pa.ts
  sentence-frames.pa.ts
  scenarios.pa.ts
```

### 13.2 English sentence policy

- short, natural, semantically coherent statements;
- ordinary vocabulary suitable for competitive exams;
- controlled use of function words such as `is`, `are`, `can`, `very`;
- no accidental tense, number or agreement errors;
- no politically sensitive, offensive, disputed or time-sensitive content;
- no artificial strings posing as English words;
- repeated sentence skeletons capped in review exports;
- exact lexical forms are distinct: `flower` and `flowers` cannot be silently treated as the same word.

### 13.3 Scenario templates

A scenario template owns a compatible set of native statements and declares which lexical roles may repeat across rows. It must not assemble arbitrary nouns and verbs without semantic compatibility.

Example frame families:

- adjective + noun + verb;
- noun + linking verb + adjective;
- actor + action + object;
- noun + modal + action;
- short coordinated phrase.

Every generated sentence is reviewed through the exact instantiated text, not only through its frame ID.

### 13.4 Code-token policy

- two to four lowercase Latin letters in the first runtime;
- neutral and pronounceable or visually clean;
- no token equals an active source word;
- no offensive, politically loaded or unintended meaningful token in the active locale;
- no visually confusable pair in one puzzle;
- stable token separators;
- token length or spelling must not correlate with the mapped word;
- code-token order is shuffled independently for every statement.

---

## 14. Standard stem and renderer contract

Primary renderer: `STATEMENT_CODE_GRID`.

Structured rows preserve:

- stable row ID;
- native sentence text;
- ordered word IDs for grammar;
- unordered code-token membership;
- independently shuffled displayed token order.

Standard instruction:

> In a certain code language, the following statements are coded as shown. The order of the code words is not necessarily the same as the order of the words.

Approved query families include:

- `What is the code for ‘WORD’?`
- `Which word is represented by ‘TOKEN’?`
- `How will ‘PHRASE’ be coded?`
- `Which phrase is represented by the code words ‘TOKENS’?`
- `Which of the following may be the code for ‘WORD’?`
- `Which of the following cannot be the code for ‘WORD’?`
- `Which code word should replace ‘?’?`
- `Which word should replace the blank?`

All stems begin with standard competitive-exam language. They must not reveal internal topology, number of propagation stages, or solution multiplicity beyond what the query naturally asks.

Token sets should render with consistent spacing or braces. Option order within a token-set answer is canonicalized for equality but may be displayed in a deterministic shuffled order only when the renderer clearly states that token order is irrelevant.

---

## 15. Distractor architecture

Each wrong option stores one diagnosed misconception label.

Recommended labels:

- `COMMON_WORD_INTERSECTION_ERROR`;
- `SHALLOW_INTERSECTION_WITHOUT_EXCLUSION`;
- `STATEMENT_ORDER_ASSUMED`;
- `TOKEN_FROM_WRONG_SHARED_WORD`;
- `TOKEN_EXCLUDED_BY_ANOTHER_ROW`;
- `POSSIBLE_TREATED_AS_DEFINITE`;
- `DEFINITE_TREATED_AS_MERELY_POSSIBLE`;
- `IMPOSSIBLE_RELATION_SELECTED`;
- `INCOMPLETE_PHRASE_CODE_SET`;
- `EXTRA_TOKEN_FROM_SOURCE_ROW`;
- `MISSING_MEMBER_WRONG_DIFFERENCE`;
- `INVERSE_DIRECTION_ERROR`;
- `RELATED_PHRASE_INSTEAD_OF_TARGET`.

### 15.1 Exact-query distractors

Prefer:

- another token from the strongest overlapping row;
- a token surviving the first comparison but removed later;
- the code of another common word;
- a token obtained by assuming positional order.

### 15.2 Possible-query distractors

The correct option must be possible in some but not all solutions. Every distractor must be impossible in all solutions.

### 15.3 Impossible-query distractors

The correct option must occur in no solution. Every distractor must have at least one complete solution witness.

### 15.4 Set-answer distractors

- omit one correct member;
- add one token from a related row;
- replace one member with a shallow-intersection candidate;
- use the correct members for a related phrase.

All four options are independently evaluated against the full solution space after rendering normalization.

---

## 16. Explanation pedagogy

Every explanation contains:

1. **Reference Aid** — common words must correspond to common code words; code order is irrelevant;
2. **Quick Method** — mark repeated words and repeated tokens, then eliminate resolved pairs;
3. **Evidence Comparison** — value-specific row intersections and exclusions;
4. **Candidate Update** — only when more than one candidate survives an intermediate step;
5. **Target Result** — exact, possible or impossible proof;
6. **Conclusion** — direct answer with option;
7. **Common Trap Alert** — one actual displayed distractor and the misconception producing it.

### 16.1 Exact-answer proof

Show the shortest complete chain that proves the target invariant. Do not dump the entire hidden mapping when only two pairs are needed.

### 16.2 Possible-answer proof

Show:

- the surviving candidate set for the target;
- one complete or sufficient consistent assignment witnessing the selected option;
- that the selected option is not definite when the query specifically asks for `may be`.

### 16.3 Impossible-answer proof

Show the exclusion or contradiction proving the selected relationship occurs in no valid mapping. Do not claim impossibility merely because an option was not used in the generator's hidden map.

### 16.4 Phrase proof

Resolve or classify each requested word, combine the tokens as a set, and explicitly state that their order is immaterial.

Explanations must never expose prototype IDs, internal graph names, hidden maps, enumeration implementation details or rejected candidate attempts.

---

## 17. Difficulty model

Difficulty is instance-based. Inputs include:

- active vocabulary size;
- statement count;
- average row length;
- presence of a direct singleton intersection;
- number of propagation rounds;
- need for global bijection reasoning;
- complete solution count;
- query direction;
- exact versus possible/impossible semantics;
- atomic versus set answer;
- closeness of distractors;
- renderer density.

Indicative calibration:

- **Easy:** direct singleton intersection, three short rows, exact atomic answer;
- **Medium:** chained or difference elimination, inverse or phrase query, four rows;
- **Hard:** no direct singleton, global bijection or complete partial-information enumeration, five or six rows, close possible/impossible options.

Sentence length alone does not raise difficulty. A partial-information question is not automatically Hard when its candidate space is obvious.

---

## 18. Ambiguity and acceptance rules

Reject a candidate when:

- no valid mapping exists;
- an exact query has more than one valid answer;
- a possible query's selected option is definite rather than merely possible when the contract requires non-definiteness;
- more than one offered option is possible;
- an impossible query has more than one impossible option;
- a phrase answer changes across solutions for an exact query;
- a missing member is not invariant;
- token order changes the answer;
- one or more rows are redundant;
- the target belongs to a disconnected component;
- a code token gives an accidental lexical clue;
- sentence grammar is invalid or unnatural;
- an option duplicates another after canonical set normalization;
- the explanation cannot prove the option predicate from displayed evidence.

The runtime stores reviewer-only diagnostics:

- solution count;
- target candidate set;
- invariant pair count;
- topology fingerprint;
- row-contribution report;
- enumeration nodes visited;
- hidden mapping fingerprint;
- option truth classification.

---

## 19. Localization architecture

Locale mode: `LANGUAGE_ADAPTED`.

Hindi and Punjabi preserve:

- statement-count range;
- overlap/topology fingerprint;
- active vocabulary size;
- query direction;
- answer semantics;
- solution count or equivalent multiplicity class;
- difficulty factors;
- option misconception roles;
- correct option index where practical.

They do not require literal word-for-word translations.

### 19.1 Hindi

Use native sentence frames, grammatical agreement and reviewed vocabulary. Avoid untranslated English prose except approved arbitrary code tokens.

### 19.2 Punjabi

Use natural Gurmukhi sentences and competitive-exam terminology. Prefer natural terms such as `ਸ਼ਬਦ` and `ਕੋਡ ਸ਼ਬਦ`; avoid literal Hindi-to-Punjabi transfer.

### 19.3 Locale gates

- required script presence;
- no unexplained Latin lexical content beyond arbitrary tokens;
- native grammar and agreement;
- equivalent constraint topology;
- equivalent answer semantics and multiplicity;
- no accidental token meaning in the target locale;
- no unresolved placeholders;
- native manual review before publication.

---

## 20. Question Studio contract

Reviewer view should expose:

- prototype or permanent QL identity;
- seed and runtime version;
- locale and difficulty factors;
- structured statement-code rows;
- target query and answer semantics;
- solution count;
- candidate tokens/words for the query target;
- invariant pairs;
- row minimality report;
- topology fingerprint;
- option misconception labels;
- explanation trace;
- hidden mapping fingerprint and hidden map for reviewers only;
- maturity and publishability.

Student preview must not expose the hidden mapping, solution count, candidate matrix, topology ID or internal truth classification.

---

## 21. Proposed checkpoint repository layout

```text
COD-CP-009/
  README.md
  COD-CP-009-END-TO-END-DESIGN.md
  COD-CP-009-QL-DISCOVERY-AUDIT.md
  COD-CP-009-IMPLEMENTATION-PLAN.md
  prototype-contracts.ts
  types.ts
  topology.ts
  generator.ts
  constraint-solver.ts
  independent-solver.ts
  ambiguity-checker.ts
  option-validator.ts
  distractors.ts
  explanation-builder.ts
  standard-exam-stem.ts
  renderer-contract.ts
  datasets/
    code-tokens.ts
    lexemes.en.ts
    sentence-frames.en.ts
    scenarios.en.ts
  localization/
    lexemes.hi.ts
    sentence-frames.hi.ts
    scenarios.hi.ts
    lexemes.pa.ts
    sentence-frames.pa.ts
    scenarios.pa.ts
  review/
    export-prototypes.ts
    export-review.ts
    duplicate-audit.ts
    language-audit.ts
```

Permanent `question-language.*` registries are added only after discovery freeze.

---

## 22. Validation plan

### 22.1 Solver proof

- compare production solver with independent exhaustive verifier;
- exact solution-count agreement;
- candidate-set agreement;
- invariant-pair agreement;
- exact/possible/impossible predicate agreement;
- inconsistent-puzzle rejection;
- disconnected-component handling;
- solution-limit diagnostics.

### 22.2 Metamorphic tests

- statement-row permutation invariance;
- code-token order permutation invariance;
- consistent global token renaming invariance;
- consistent global word-ID renaming invariance;
- hidden-map reconstruction independent of generator order;
- removal of a required row changes the target predicate;
- addition of an exact duplicate row does not falsely appear as new evidence and is rejected editorially.

### 22.3 Generator stress tests

For every surviving prototype contract:

- deterministic generation over a large seed range;
- exactly four unique options;
- exactly one option satisfies the requested predicate;
- all statements natural and structurally valid;
- no unresolved placeholder;
- no internal ID leakage;
- answer-position balance;
- topology and difficulty coverage;
- no exact or normalized stem collisions in review samples;
- no repeated sentence-skeleton overuse;
- no redundant evidence row;
- bounded generation attempts.

Stress-seed counts are set after prototype yield is measured, not predetermined as QL quotas.

### 22.4 Editorial tests

- every stem begins with standard exam language;
- the order-neutral rule is clear;
- phrase quotation and code-token formatting are consistent;
- exact query wording matches answer semantics;
- `may be` and `cannot be` are never interchanged;
- explanations use actual displayed rows;
- Common Trap Alert names an actual option;
- no sentence sounds machine-assembled.

---

## 23. Freeze criteria

CP-009 permanent QLs may be assigned only when:

1. all source-backed task directions have executable prototypes;
2. inverse and set-answer contracts have been tested;
3. exact, possible and impossible semantics are formally validated;
4. candidate task contracts complete their merge/split audit;
5. no meaningful concept, task, inverse, edge-case, representation or exam-pattern gap remains;
6. the constraint solver and independent verifier agree exhaustively over the bounded domain;
7. natural English scenario coverage is editorially approved;
8. duplicate and skeleton-repetition audits pass;
9. the next available chapter QL ID is known after earlier checkpoint allocation;
10. the approved permanent QL registry is committed separately.

Until then:

- QL count remains open;
- prototype IDs remain non-permanent;
- Question Studio discovery remains disabled;
- `publiclyPublishable` remains `false`;
- Hindi and Punjabi remain unstarted or prototype-only.

---

## 24. Final design verdict

CP-009 is a finite constraint-satisfaction runtime over unordered sentence and token sets, not a collection of hard-coded common-word tricks.

The design supports:

- standard direct intersection questions;
- chained and global exclusion;
- exact inverse questions;
- phrase construction;
- missing-member presentation;
- formally proven possible and impossible answers;
- native multilingual adaptation;
- deterministic generation with independent solution-space verification.

The permanent QL inventory remains deliberately unfrozen until executable prototype and gap audits prove the final boundaries.
