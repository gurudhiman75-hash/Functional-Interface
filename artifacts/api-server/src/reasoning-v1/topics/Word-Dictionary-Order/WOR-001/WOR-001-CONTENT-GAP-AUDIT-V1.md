# WOR-001 Full Chapter Content-Gap Audit V1

Date: 2026-08-14

Status: chapter-scope audit only. This document does not expand the object pool and does not activate permanent QLs.

## Executive conclusion

The current WOR-001 implementation is strong for the classic SSC/Punjab form of Word & Dictionary Order, but it is not yet content-complete for Banking.

The current four permanent-root recommendation remains valid for the classic lexical core:

1. complete dictionary order;
2. endpoint after ordering (first/last);
3. word at a specified position (kth/middle);
4. position/rank of a specified word.

However, Banking examinations repeatedly use a broader five-word/three-letter-cluster sequence family in which dictionary ordering is one stage of a multi-step pipeline. These forms are absent from the current runtime and should be implemented before object-pool expansion/final chapter freeze.

Recommended new checkpoint: `WOR-CP-005 — Banking Word/Cluster Sequence Composites`.

## Audit dimensions

The audit checked:

- classic complete-order questions;
- endpoint and kth-position questions;
- reverse dictionary order;
- rank/position semantics;
- prefix-contained words and late first-difference cases;
- 4–7 word list sizes;
- meaningful English words versus non-meaningful letter clusters;
- Banking five-word sequence sets;
- post-sort concatenation and letter indexing;
- post-sort local letter/alphabet-offset queries;
- explicit within-word transformations followed by dictionary sorting;
- within-word alphabetical rearrangement followed by dictionary sorting;
- overlap with ALP-001, Coding-Decoding and Input-Output;
- option-count/exam-profile parity;
- difficulty realism and first-letter-only triviality;
- localization/logic-token implications.

## Current content that is well covered

### 1. Complete dictionary order — COVERED

Current ownership and runtime correctly support selecting the full ascending sequence. This is one of the dominant SSC/Punjab patterns.

Observed exam forms include 5-word and 6-word numbered lists, often with several words sharing long prefixes.

No new solve contract is needed.

### 2. Reverse dictionary order — COVERED AS VARIANT

Reverse order occurs in Banking and preparation material. It should remain a direction/presentation variant of the complete-order root, not receive a separate permanent QL.

### 3. First / last word — COVERED AS ENDPOINT ROOT

Direct endpoint selection is source-backed. First and last are mirror semantics and should remain one root.

### 4. Kth / middle / nth from left or right — PARTIALLY COVERED

The current `SELECT_KTH` and `SELECT_MIDDLE` logic covers fixed ordinal positions in a sorted word list.

For classic SSC/Punjab questions, this is sufficient.

For Banking, the same root must also accept non-meaningful three-letter clusters and ordinal wording from either end. This is an object/presentation extension, not a new QL identity.

### 5. Rank of specified word — COVERED

The current rank contract is mechanically valid and useful. It remains a distinct answer semantic from asking which word occupies kth position.

### 6. Prefix-contained and late-difference comparisons — COVERED

The comparator and hard object families correctly support cases such as a complete word being the prefix of another and words differing only after several common characters.

This is essential exam difficulty and should remain an instance-level structural lever.

### 7. 4–7 visible words — COVERED

The current builder supports the ordinary SSC/Punjab list sizes and hard 6–7 word sets. No separate QL should be created by word count.

## Confirmed content gaps

## GAP A — Non-meaningful letter-cluster object mode

Severity: HIGH for Banking.

Banking PYQs/memory-based papers frequently present five three-letter groups such as `MKU ARS GPM VQI ETY` or `HAL KGE MTR QDW ZIB`. They are treated as words for dictionary sorting even though they need not be meaningful English words.

Current WOR-001 only sources objects from a curated meaningful-word registry. Therefore the lexical engine is capable of solving these questions, but the object model cannot generate them.

Required change:

- add a `LETTER_CLUSTER` object mode;
- default Banking cluster length: 3;
- default set size: 5;
- enforce A–Z uniqueness and no duplicate clusters;
- clusters stay logic-neutral in EN/HI/PA;
- this mode should feed existing complete-order/kth/endpoint roots where no other transformation is required.

QL impact: no new permanent root by itself.

## GAP B — Sort -> concatenate -> global character-index query

Severity: HIGH for Banking.

Observed pattern:

1. arrange five three-letter words/clusters in dictionary order;
2. join all letters with no gaps;
3. ask for the nth letter from the left/right end.

This is not represented by any current WOR task kind.

Required new solve contract:

`SORT_CONCAT_GLOBAL_CHAR_QUERY`

Canonical pipeline:

```text
input clusters
-> dictionary sort
-> concatenate sorted clusters
-> index globally from left/right
-> answer one letter
```

This is a genuine permanent-QL candidate because the answer semantic and solver contract differ from word-at-kth-position.

## GAP C — Sort -> select ranked word -> local letter/alphabet-offset query

Severity: HIGH for Banking.

Observed pattern:

1. arrange words/clusters in normal or reverse dictionary order;
2. select a word by ordinal position from one end;
3. select a character inside that word;
4. optionally move +/- k places in the alphabet;
5. answer a letter.

Example structure: after reverse dictionary ordering, take the second letter of the third word from the right, then identify the letter three places before it.

Required new solve contract:

`SORT_SELECT_WORD_LOCAL_CHAR_QUERY`

Parameters may include:

- sort direction;
- word rank;
- rank side: LEFT/RIGHT;
- local character index;
- character side: LEFT/RIGHT;
- alphabet offset (including zero).

This should be one root with controlled instance variants, not a new QL for every offset/index wording.

## GAP D — Explicit per-word transformation -> dictionary sort -> positional query

Severity: HIGH for Banking.

Repeated Banking patterns explicitly transform every three-letter word before sorting. Observed transformations include:

- swap first and second letters;
- swap first and third letters;
- swap first and last letters;
- change a selected position to preceding/following alphabet letter;
- replace one position using another position;
- alphabetically rearrange letters within each word.

After transformation, the newly formed clusters are arranged in dictionary order and the question asks which original/equivalent word occupies a specified position.

Required new solve contract:

`TRANSFORM_EACH_THEN_SORT_POSITION_QUERY`

Important implementation rule: preserve `sourceObjectId -> transformedToken` mapping so the answer can be either the transformed cluster or the original word, exactly as the exam stem requests.

Transformation operators should reuse explicit Alphabet-Test primitives where possible, but the QL belongs to WOR because dictionary ordering of multiple transformed words is mandatory to solve the question. ALP-001 explicitly excludes dictionary ordering of multiple words.

## GAP E — Transform each -> sort -> local letter query

Severity: MEDIUM-HIGH for Banking.

Observed pattern:

1. rearrange letters inside each word (for example alphabetical order);
2. sort the resulting clusters in normal/reverse dictionary order;
3. select a ranked transformed cluster;
4. ask for its middle/nth letter.

Required new solve contract:

`TRANSFORM_EACH_THEN_SORT_LOCAL_CHAR_QUERY`

This is deeper than GAP D because the answer is a character derived after both transform and sort stages.

It can share transformation and sorting state with GAP D, but should remain a separate QL candidate if answer-semantics compression confirms the learner task is materially different.

## GAP F — Banking option-count parity

Severity: CROSS-CUTTING / HIGH for exam simulation.

The current WOR runtime and review gate require exactly four options. SSC/Punjab dictionary-order questions commonly use four options, but Banking word-sequence questions frequently present five answer options.

This is not merely a WOR vocabulary issue. Before Banking mock activation, ExamTree must decide whether option count is:

- chapter-fixed;
- QL-configurable; or
- exam-profile-configurable.

Recommended architecture: exam-profile-configurable `optionCount`, with SSC/Punjab defaulting to 4 and Banking profiles capable of 5 where the source exam does so.

Do not create a separate QL only because the same question has five instead of four options.

## GAP G — Easy-tier exam realism

Severity: MEDIUM.

The current Easy corpus is deliberately broad and familiar, but 7 of the 8 Easy families are dominated by distinct initial letters. Many resulting questions can be solved by inspecting only the first character.

Actual SSC dictionary-order questions frequently force comparison at the second, third or later character even when the question is not conceptually difficult.

This is not a new QL gap, but it is a content-structure gap that must be corrected during pool expansion.

Pool-expansion requirement:

- retain some first-letter-only introductory sets;
- add easy sets with one or two tied first-letter groups;
- ensure a meaningful share of Easy questions require a second-letter comparison;
- keep Medium/Hard dominated by deeper common-prefix decisions.

## Patterns reviewed and intentionally NOT added to WOR

### Meaningful/logical sequence of words

Example: arranging production stages or life-cycle events in a meaningful order.

Decision: OUT OF WOR.

Reason: semantic chronology/causality is not dictionary order even when exams use the word "arrange".

### Alphabetical rearrangement of letters inside a single word only

Decision: ALP-001.

Reason: no multi-word dictionary sort is required.

### Input-output machines that happen to use dictionary order

Decision: Input-Output chapter.

Reason: the learner must infer a multi-step machine rule; dictionary order is only one internal operation.

### Hidden coding transformations

Decision: Coding-Decoding.

Reason: transformation rule is inferred rather than explicitly instructed.

## Proposed post-audit checkpoint architecture

The existing CPs remain:

- `WOR-CP-001` — Complete Dictionary Ordering
- `WOR-CP-002` — Position and Neighbour Queries
- `WOR-CP-003` — Insertion, Correction and Partial Order (source-deferred)
- `WOR-CP-004` — Advanced Lexicographic Discrimination (instance variants)

Add:

- `WOR-CP-005` — Banking Word/Cluster Sequence Composites

### Proposed CP-005 prototype families

1. `BANK_PLAIN_CLUSTER_POSITION`
   - five three-letter clusters;
   - normal/reverse dictionary order;
   - nth word from left/right;
   - merge into existing kth-position root after object-mode extension.

2. `BANK_SORT_CONCAT_CHAR`
   - sort;
   - concatenate with no gaps;
   - nth character from left/right;
   - NEW QL ROOT.

3. `BANK_SORT_LOCAL_CHAR`
   - sort normal/reverse;
   - select ranked word;
   - select local character;
   - optional explicit alphabet offset;
   - NEW QL ROOT.

4. `BANK_TRANSFORM_SORT_POSITION`
   - apply explicit transformation to each word/cluster;
   - sort transformed results;
   - answer transformed or source word at target position;
   - NEW QL ROOT.

5. `BANK_TRANSFORM_SORT_LOCAL_CHAR`
   - transform each;
   - sort;
   - select ranked transformed word;
   - local/middle/nth character answer;
   - NEW QL ROOT unless prototype compression proves it can merge safely with root 4.

## Proposed permanent-root count after full content remediation

Current classic roots: 4.

Likely additions from CP-005: 3–4.

Expected final permanent QL roots after prototype compression: approximately 7–8, not 15+.

The exact number must be frozen only after executable CP-005 prototypes and answer-semantic compression.

## Source evidence sampled in this audit

### SSC / SSC-like official-paper reproductions

- SSC CPO 13 Dec 2019 Shift 1 — complete dictionary order of five words.
- SSC CHSL 15 Mar 2023 Shift 2 — complete dictionary order.
- SSC Selection Post 28 Jun 2023 Shift 4 — complete dictionary order.
- SSC GD 05 Mar 2024 Shift 1/2 and 07 Mar 2024 Shift 2 — deep-prefix complete order including prefix-sensitive forms.
- SSC CGL 01 Dec 2022 Shift 2 and 05 Dec 2022 Shift 4 — kth word after dictionary ordering.
- SSC Stenographer 13 Oct 2023 Shift 1 — complete order.
- Delhi Police Head Constable 28 Oct 2022 Shift 1 — six-word complete order.

### Punjab

- PSSSB Senior Assistant Official Paper, 28 Jan 2024 — complete dictionary order (`Range / Rader / Race / Rack / Rant`).

### Banking

- IBPS RRB Office Assistant, 19 Aug 2018 memory-based — five three-letter words sorted; third word from right.
- IBPS Clerk Prelims, 31 Aug 2024 memory-based — five three-letter clusters sorted; third word from right.
- IBPS Clerk Prelims, 25 Aug 2024 memory-based — letters inside every word alphabetically rearranged, resulting clusters dictionary-sorted, positional query.
- IBPS RRB Assistant Prelims, 17 Aug 2024 memory/PYP — sort five words, concatenate without gaps, ask global nth letter.
- IBPS RRB Assistant Prelims, 17 Aug 2024 — change first letter to preceding alphabet letter, then dictionary-sort and ask ranked word.
- RBI Assistant Prelims 2017 memory-based — interchange first/second letters in each word, dictionary-sort, positional query.
- RBI Office Attendant 09 Apr 2021 memory-based — interchange first/last letters, dictionary-sort, last-position source word.
- RBI Office Attendant 09 Apr 2021 — sort letters within each word, reverse dictionary-sort, ask middle letter of ranked word.
- IBPS Clerk word-sequence set — reverse dictionary-sort, select word/letter, then alphabet-offset query.

## Final content-gap verdict

### Classic SSC/Punjab Word & Dictionary Order

Coverage: STRONG / NEAR COMPLETE.

No major new classic lexical QL family was found beyond the four-root architecture. Current source-deferred insertion/correction prototypes remain nonessential for exam completeness and should not be promoted merely to increase variety.

### Banking Word/Cluster Sequence

Coverage: INCOMPLETE.

This is the main chapter-level gap. It is recurring enough across IBPS/RBI/RRB-style material to warrant a dedicated checkpoint rather than being treated as occasional synthetic variants.

### Before object-pool expansion

Recommended order of work:

1. implement/prototype `WOR-CP-005` Banking composites;
2. run source/evidence and QL compression audit;
3. settle 4-vs-5 option handling at exam-profile level;
4. only then expand the object pools, with separate `REAL_WORD` and `LETTER_CLUSTER` pools and improved Easy-tier prefix structure;
5. regenerate review evidence and perform final chapter-wide editorial audit.
