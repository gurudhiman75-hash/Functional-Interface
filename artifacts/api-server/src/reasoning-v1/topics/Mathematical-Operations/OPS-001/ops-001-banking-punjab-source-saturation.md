# ExamTree Reasoning V1 — OPS-001 Banking and Punjab Source Saturation

Status: design evidence record. This document closes the dedicated Banking/Punjab source pass for chapter-structure purposes. It does not freeze QL counts, solve-mode counts, QL IDs or QL ranges.

## 1. Purpose

The initial OPS-001 source audit was dominated by SSC-labelled material. This pass asks whether Banking examinations or Punjab state recruitment examinations introduce:

- a transformation family absent from the SSC/textbook corpus;
- a different student action requiring a new solve mode;
- a distinct answer semantic;
- a different localisation or renderer contract;
- a checkpoint split that would otherwise be missed.

The pass is not intended to manufacture exam-specific QLs. A Banking-only or Punjab-only QL is justified only when its reasoning topology is materially different.

## 2. Sources inspected

### 2.1 Uploaded File Library

Searches were run for:

- Banking reasoning mathematical operations;
- IBPS/SBI operator interchange and symbol substitution;
- Punjab Patwari/PSSSB/PSPCL mathematical operations;
- Hindi and Punjabi terminology for operator-replacement questions.

The File Library contains strong SSC and textbook evidence, including:

- `reasoning_aggarwal.pdf`;
- SSC CGL solved papers for 2022, 2023 and 2024;
- the ExamTree Reasoning master-architecture notes.

No dedicated IBPS/SBI mathematical-operations book or Punjab previous-paper bundle was found in the uploaded library.

### 2.2 Official Banking recruitment material

Official SBI recruitment pages confirm that Reasoning Ability or Reasoning & Computer Aptitude is a scored section in PO and Junior Associate examinations. Official recruitment notices expose section structure but do not normally publish a reusable item-level previous-question corpus.

The inspected official Banking pages therefore establish product relevance for Reasoning but do not provide evidence for a new OPS-001 topology.

### 2.3 Official Punjab recruitment material

Official PSPCL sources were inspected because they provide both:

- recruitment sample papers;
- a substantial archive of old question papers and model solutions.

The Assistant Lineman sample-paper page provides a Punjabi Part-I paper and a Part-II paper containing technical knowledge, Punjabi grammar, general knowledge, reasoning and arithmetic sections. The accessible sample confirms that Punjabi is not merely an optional translation layer in Punjab recruitment delivery.

The PSPCL old-question-paper archive lists recurring papers for UDC General, Ministerial Establishment, Engineer Subordinates, Engineer Officers, AM/HR and other cadres. Some historical PDFs could not be fetched reliably during this pass, so absence of a discovered OPS question in those files must not be interpreted as proof of absence.

### 2.4 Secondary Punjab previous-paper indexes

Secondary exam-preparation indexes were inspected only as discovery aids. They confirm that PSSSB/Punjab papers are commonly delivered in English and Punjabi and include broad reasoning coverage. They did not reveal a defensible new mathematical-operations family beyond the already discovered SSC/textbook corpus.

Secondary sources are not authoritative enough to freeze a new QL by themselves.

## 3. Banking conclusion

### 3.1 No bank-only transformation family found

No evidence was found for a Banking-specific OPS family distinct from:

- supplied operator mapping;
- arbitrary operation tokens;
- arithmetic/relation mapping;
- operator filling;
- operator interchange;
- number or digit interchange;
- compound interchange;
- hidden operator mapping.

### 3.2 Product policy

Banking support should be represented through:

- exam-fit metadata;
- difficulty and timing profiles;
- concise stem styles;
- option proximity;
- mobile-friendly rendering;
- seed-domain tuning.

It should not be represented by cloning the same logical contract into a separate bank-only QL.

### 3.3 Banking realism levers

Permitted bank-oriented instance tuning includes:

- shorter direct-evaluation stems for preliminary-level practice;
- close precedence distractors;
- clean integer outcomes;
- compact four-option equations;
- moderate expression length;
- strict time-pressure suitability.

These are instance/editorial dimensions, not new QL identities.

## 4. Punjab conclusion

### 4.1 No new logical family found

The dedicated Punjab pass did not reveal a transformation topology outside the current OPS design.

### 4.2 Punjab-specific product requirement

Punjab delivery creates a first-class localisation and renderer requirement:

- natural Punjabi stems in Gurmukhi;
- stable display of `+`, `−`, `×`, `÷`, `=`, `<`, `>`;
- unambiguous distinction between `ਅੰਕ` (digit) and `ਸੰਖਿਆ` (number);
- correct wording for mutual interchange rather than one-directional replacement;
- left-to-right sequencing instructions that remain grammatically clear in Punjabi;
- Punjabi explanation traces that preserve exact operator order.

### 4.3 Punjab exam-fit policy

A Punjab tag may change:

- stem register;
- approved terminology;
- language availability;
- renderer width constraints;
- question-selection weighting.

A Punjab tag may not change:

- the hidden transformation;
- the exact answer;
- option semantics;
- ambiguity status;
- solver trace;
- difficulty solely by label.

## 5. Cross-exam topology comparison

| Dimension | SSC | Banking | Punjab state exams | QL consequence |
|---|---|---|---|---|
| Given operator substitution | Strong source evidence | Compatible | Compatible | Shared QLs |
| Operator-pair interchange | Strong source evidence | Compatible | Compatible | Shared QLs |
| Sequential operator filling | Strong source evidence | Compatible | Compatible | Shared QLs |
| Whole-number interchange | Source-backed | Compatible | Compatible | Shared QLs |
| Digit interchange | Source-backed | Compatible | Compatible | Shared QLs with strict scope |
| Compound sign/value swap | Source-backed | Compatible | Compatible | Shared QLs |
| Hidden operator mapping | Textbook/SSC evidence | Compatible | Compatible | Shared QLs |
| Punjabi language delivery | Not primary | Not primary | Mandatory product capability | Locale contract, not new QL |
| Exam-specific timing/length | SSC profile | Bank profile | Punjab profile | Instance metadata |

## 6. Source-backed coverage retained

The chapter must continue to cover the following families exhaustively:

```text
GIVEN_ARITHMETIC_SIGN_MAPPING
GIVEN_ARBITRARY_OPERATION_TOKEN_MAPPING
GIVEN_MIXED_ARITHMETIC_RELATION_MAPPING
FILL_OPERATOR_SEQUENCE
FILL_OPERATOR_AND_RELATION_SEQUENCE
GLOBAL_OPERATOR_PAIR_INTERCHANGE
GLOBAL_DOUBLE_OPERATOR_PAIR_INTERCHANGE
ARITHMETIC_RELATION_TOKEN_INTERCHANGE
WHOLE_NUMBER_TOKEN_INTERCHANGE
DIGIT_IDENTITY_INTERCHANGE
COMBINED_OPERATOR_VALUE_INTERCHANGE
HIDDEN_OPERATOR_MAPPING_FROM_EVIDENCE
```

No family was added solely because of an exam label.

## 7. Negative findings that affect design

### 7.1 Do not invent bank-only complexity

There is no basis for adding:

- financial vocabulary wrappers;
- account or transaction stories;
- Banking-specific operator symbols;
- five-option QLs solely because some bank tests use five options.

Option count is a delivery configuration unless the task logic changes.

### 7.2 Do not treat Punjabi as literal word replacement

Punjabi must not be implemented through direct token substitution from English sentence order. In particular:

- `interchange` must express mutual exchange;
- `replace sequentially` must preserve ordered placement;
- `digit` and `number` must not collapse to one word;
- explanation steps must not mix Hindi constructions into Punjabi;
- English operator names should not be transliterated when a clear Punjabi phrase is available.

### 7.3 Do not infer absence from inaccessible archives

Several official Punjab historical files were listed but not reliably fetchable during the audit. The structural verdict is therefore:

```text
NO_NEW_TOPOLOGY_DISCOVERED
```

not:

```text
OPS_NEVER_APPEARS_IN_PUNJAB_EXAMS
```

## 8. Source-saturation decision

### 8.1 Structural saturation

For deciding chapter families and checkpoint boundaries, the source pass is sufficient.

Reason:

- the textbook corpus supplies all major classical families;
- recent SSC papers confirm modern interchange and fill variants;
- Banking examination structure does not introduce a separate OPS model;
- Punjab evidence adds localisation requirements but no new solver topology;
- second-pass gaps already captured decimal literals, relation-boundary swaps, many-to-one mappings, negative outcomes and compound transformations.

Verdict:

```text
STRUCTURAL_SOURCE_SATURATION = PASS
```

### 8.2 Editorial saturation

Editorial saturation is not yet claimed. More Punjab previous papers may later provide:

- additional stem wording;
- different option phrasing;
- useful difficulty calibration;
- evidence about prevalence.

Such evidence may expand editorial libraries without changing QL identity.

Verdict:

```text
EDITORIAL_SOURCE_SATURATION = CONTINUING
```

## 9. Manifest implications

The final chapter manifest must:

1. retain one chapter shared across SSC, Banking and Punjab exams;
2. store exam-fit as metadata, not as duplicated QLs;
3. mark most QLs `TRANSLATABLE`;
4. mark word-token operator forms `LANGUAGE_ADAPTED`;
5. require Punjabi runtime support before Punjab publication;
6. support different option-count delivery configurations where the product permits them;
7. keep exact answer and transformation parity across locales;
8. record source-family IDs independently from exam-fit tags.

## 10. Remaining evidence tasks

The following are no longer blockers for checkpoint structure, but remain pre-publication tasks:

- human review of all Punjabi glossary terms;
- human review of Hindi terminology;
- rendering test on the production font stack;
- sample generation in `en-IN`, `hi-IN` and `pa-IN`;
- later ingestion of accessible PSSSB/PSPCL papers into the editorial pattern ledger;
- prevalence weighting based on a larger dated paper corpus.

## 11. Final conclusion

The Banking/Punjab source pass supports the existing OPS-001 logical architecture.

It does not justify any bank-only or Punjab-only QL family.

It does justify a strict multilingual contract, especially for Punjabi, and confirms that locale quality must be treated as a release gate rather than a post-implementation translation task.
