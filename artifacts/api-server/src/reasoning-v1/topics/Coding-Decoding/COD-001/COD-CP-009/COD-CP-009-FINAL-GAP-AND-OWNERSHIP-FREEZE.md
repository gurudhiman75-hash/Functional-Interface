# COD-CP-009 — Final English Gap and Ownership Freeze

Status: **ENGLISH DISCOVERY FROZEN AT 16 TASK CONTRACTS AND 24 PROVISIONAL SOLVE CONTRACTS; PERMANENT QL ALLOCATION REMAINS BLOCKED BY COD-CP-007 AND COD-CP-008**.

Freeze version: `COD_CP009_ENGLISH_DISCOVERY_FREEZE_V1`

This document supersedes the unresolved questions and provisional verdicts in `COD-CP-009-QL-DISCOVERY-AUDIT.md` and `COD-CP-009-EXECUTABLE-GAP-RESOLUTION.md`. It freezes the current English discovery inventory only. It does not allocate `COD-QL-*` IDs, enable Question Studio, start localisation or make any question publicly publishable.

## 1. Source review completed

The uploaded reasoning material establishes the following recurring sentence-coding behaviours.

### 1.1 Exact relation from common words and code words

The source chapter defines sentence coding through comparison of messages that share one or more words and code tokens. Its worked example resolves the code for `satellite` from overlapping statements. The exercise corpus repeatedly asks for one exact code or one exact decoded word.

**Freeze effect:** retain exact word-to-token and token-to-word contracts. Direct intersection, chained propagation, set difference, forked evidence and global bijection remain distinct student solve modes.

### 1.2 Genuine indeterminacy

The source corpus includes questions for which the correct response is `Cannot be determined`. Therefore, the runtime must reconstruct the complete mapping space rather than trust one hidden generator mapping.

**Freeze effect:** exact contracts require invariance across every valid mapping. Ambiguous exact prompts are rejected. Possible and impossible predicates are evaluated against the full solution space.

### 1.3 Complete either/or candidate answers

The source includes recurring answers such as `either mi or jo` and `sa or pa`. This is not equivalent to selecting one member that happens to be possible.

**Freeze effect:** retain complete candidate-domain encode and inverse contracts as separate set-valued answers.

### 1.4 New message composed from resolved parts

The source asks for codes of new phrases such as `colours sky high`, `Time of the Jackal`, `you stay late` and `I bought them`. The queried phrase may never appear as one displayed statement; its members are established through different evidence rows.

**Freeze effect:** retain independently resolved component composition and its inverse separately from invariant ambiguous sets.

### 1.5 May-represent questions

The source includes questions such as which word **may mean** a new phrase and which option **may represent** a requested expression. An independent uploaded speed-test source contains the same possible-message behaviour.

**Freeze effect:** retain possible atomic and possible mixed-set contracts. A correct possible answer needs at least one witness and at least one valid mapping that does not contain it.

### 1.6 Distinct competitive-exam extensions

Missing-member and impossible-atomic presentations were not admitted merely by formal symmetry. Their executable prototypes prove different visible payloads, truth predicates, distractor obligations and explanation structures:

- missing member reconstructs one omitted row element and requires a visible blank;
- impossible atomic requires zero witnesses while every distractor is witnessed;
- encode and inverse decode use different answer domains and language.

**Freeze effect:** retain these contracts in the English discovery inventory, but do not expand to impossible phrase/set forms without direct source evidence.

## 2. Final frozen task-contract inventory

| No. | Task contract | Evidence basis | Decision |
|---:|---|---|---|
| 1 | exact word → token | recurring direct source | retain |
| 2 | exact token → word | recurring inverse source and distinct answer domain | retain |
| 3 | exact invariant word set → token set | source-consistent set answer; executable invariant ambiguity | retain |
| 4 | exact invariant token set → word set | inverse set domain | retain |
| 5 | missing code token | distinct blank reconstruction | retain |
| 6 | missing word | inverse blank reconstruction | retain |
| 7 | possible token for a word | may-represent source format | retain |
| 8 | possible word for a token | inverse possible domain | retain |
| 9 | impossible token for a word | distinct zero-witness predicate | retain |
| 10 | impossible word for a token | inverse zero-witness predicate | retain |
| 11 | possible token set for a word pair | may-represent composed phrase | retain |
| 12 | possible word pair for a token set | inverse possible set | retain |
| 13 | exact resolved word set → token set | recurring new-message composition | retain |
| 14 | exact resolved token set → word set | inverse composition | retain |
| 15 | complete possible-code domain for one word | recurring either/or source answer | retain |
| 16 | complete possible-word domain for one token | inverse complete domain | retain |

No additional predicate × direction × cardinality combinations are admitted automatically.

## 3. Final solve-contract freeze

The sixteen task contracts produce twenty-four provisional solve contracts.

The two exact atomic directions each split across five materially different proof routes:

1. direct singleton intersection;
2. chained singleton propagation;
3. set-difference elimination;
4. forked evidence join;
5. global bijection deduction.

These routes differ in the student's inference sequence, proof obligation, explanation structure and likely misconception. They therefore survive as separate solve contracts even though they share one bounded solver foundation.

The remaining fourteen task contracts map one-to-one to solve contracts.

```text
Exact atomic: 2 directions × 5 solve modes = 10
Other retained task contracts:                  14
--------------------------------------------------
Frozen provisional solve contracts:             24
```

The following remain instance parameters:

- two-way versus three-way uncertainty;
- statement count;
- sentence length within the approved dataset;
- row order;
- token order inside an unordered code set;
- table versus paragraph rendering;
- quotation and punctuation style.

## 4. Edge-case closure

The executable foundation and combined gate cover the required edge classes.

| Edge class | Frozen treatment |
|---|---|
| target appears in two rows | supported |
| target appears in three or more rows | supported |
| no local singleton exists | global-bijection mode |
| two complete mappings remain | controlled two-way uncertainty |
| six complete mappings remain | controlled three-way uncertainty |
| target relation invariant while unrelated pairs remain ambiguous | exact invariant contract |
| complete set invariant while internal pairings swap | exact invariant set |
| complete candidate domain has two or three members | complete candidate-set contract |
| one offered relation has zero witnesses | impossible atomic |
| one omitted row member is unique | missing-member contract |
| omitted member has multiple possibilities | reject exact generation |
| redundant row | reject through row-minimality gate |
| disconnected component | reject unless irrelevant evidence is explicitly allowed; current generators reject |
| inconsistent statements with zero mappings | reject |
| duplicate row or shuffled-token duplicate | reject or canonicalise before acceptance |
| row-order permutation | solver invariant |
| code-token order permutation | set semantics invariant |
| target phrase absent as a complete displayed row | resolved composition supports it |
| query answer not invariant | route to possible/complete-candidate semantics or reject |
| candidate token resembles a source word | neutral display-token pool prevents it |
| unsafe or unnatural sentence combination | curated scenario binding; no free-form sentence generation |

No meaningful uncovered edge requires a new task contract.

## 5. Ownership freeze

| Format | Owner | CP-009 disposition |
|---|---|---|
| sentence/artificial-language word-token constraints | `COD-CP-009` | include |
| direct character substitution | `COD-CP-001` | delegate |
| alphabet-rank and scalar number coding | `COD-CP-002` | delegate |
| uniform and class-dependent shifts | `COD-CP-003/004` | delegate |
| positional permutations and multi-stage character coding | `COD-CP-005/006` | delegate |
| digit, symbol and alphanumeric coding | `COD-CP-007` | delegate |
| renaming real entities | `COD-CP-008` | delegate |
| lookup table plus conditional rules | `COD-CP-010` | delegate |
| operator or relation-symbol substitution | `OPS-001` | exclude |
| Data Sufficiency wrapper | Data Sufficiency | exclude wrapper; solver reuse allowed |
| general multi-attribute puzzle | Puzzle | exclude |
| transformation step sequence | Input-Output | exclude |

Displayed token order is irrelevant in CP-009. Any format whose answer depends on token position belongs to direct, positional or conditional coding rather than sentence coding.

## 6. Excluded expansions

The following remain outside the frozen inventory:

- impossible phrase or set questions without direct recurring source evidence;
- Data Sufficiency answer-option wrappers;
- free-form generated sentences;
- ordered-token questions disguised as sentence coding;
- table versus paragraph as separate QLs;
- row count as a separate QL;
- every mathematically possible predicate/direction/cardinality product;
- renaming, conditional tables, operators, inequalities or puzzle attributes.

A future change requires new direct source evidence and a new freeze version. It must not silently mutate `COD_CP009_ENGLISH_DISCOVERY_FREEZE_V1`.

## 7. English dataset boundary

The current English prototype dataset is sufficient for discovery freeze because the combined audit reaches all approved scenarios across every applicable contract/topology pairing and finds no normalised cross-contract stem or explanation collision.

This is not yet the final production editorial corpus. Before permanent runtime release, the dataset may be expanded for surface diversity without changing the frozen solve-contract identities. Any expansion must preserve:

- grammatical actor-action-object or descriptive statements;
- controlled function-word and content-word coverage;
- neutral and culturally safe themes;
- no arbitrary word mixing;
- no hidden reviewer identifiers in student payloads;
- complete solver and independent-verifier parity.

## 8. Machine-enforced freeze

The freeze is encoded in:

- `cp009-final-discovery-freeze.ts`;
- `cp009-final-discovery-freeze.test.ts`;
- `.github/workflows/reasoning-cod-001-cp009-final-discovery-freeze.yml`.

The gate enforces:

- exactly 16 registered prototype task contracts;
- exactly 8 forward/inverse pairs;
- exactly 10 topology families;
- exactly 24 provisional solve contracts;
- all 30 contract/topology pairings in the final edge matrix;
- prototype-only and non-publishable safety;
- four semantically unique options and one marked answer;
- exact, possible, impossible, complete-domain, missing-member and composition semantics;
- the complete ownership disposition table;
- zero permanent CP-009 QLs;
- sequencing locks for CP-007 and CP-008.

The final freeze workflow reruns the 720-question combined saturation gate before enforcing the freeze snapshot.

## 9. Identity and release lock

```text
Current last permanent COD-001 ID: COD-QL-168
Permanent CP-009 IDs:             0
Question Studio exposure:         disabled
Question Bank conversion:         disabled
Localisation:                     not started
Public publication:               disabled
```

CP-009 cannot reserve a permanent range until CP-007 and CP-008 complete exhaustive discovery and allocate their own sequential IDs. After that, the frozen 24 solve contracts may receive continuous IDs from the then-current next available `COD-QL-*` value.

## 10. Final verdict

**No meaningful English concept, task, inverse, answer-semantic, edge, representation, source-format or ownership gap remains in the current CP-009 scope.**

The English discovery inventory is frozen at:

```text
Task contracts:                 16
Forward/inverse pairs:           8
Topology families:              10
Provisional solve contracts:    24
Permanent QLs:                   0
Freeze version: COD_CP009_ENGLISH_DISCOVERY_FREEZE_V1
```

The next Coding-Decoding implementation checkpoint is `COD-CP-007`. CP-009 permanent allocation and production English runtime remain deferred until CP-007 and CP-008 are complete.
