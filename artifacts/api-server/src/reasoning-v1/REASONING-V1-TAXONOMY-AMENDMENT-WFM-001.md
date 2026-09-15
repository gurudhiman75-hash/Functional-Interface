# Reasoning V1 — WFM-001 Taxonomy Amendment

Status: **authoritative controlled amendment** to `REASONING-V1-MASTER-BLUEPRINT.md`.

Effective chapter code: `REAS-WFM`  
Implementation chapter: `WFM-001`  
Student title: **Word Formation**  
Implementation family: **Family A — Symbolic and sequence reasoning**

## 1. Amendment decision

The final Reasoning V1 audit established that meaningful-word construction is a stable competitive-exam chapter and is not owned by Alphabet Test, Word & Dictionary Order, Coding-Decoding, or English vocabulary.

The Family A product table is therefore amended as follows:

| Code | Chapter |
|---|---|
| `REAS-ANA` | Analogy |
| `REAS-CLS` | Classification / Odd One Out |
| `REAS-SER` | Series |
| `REAS-COD` | Coding-Decoding |
| `REAS-ALP` | Alphabet Test |
| `REAS-WFM` | Word Formation |
| `REAS-MIS` | Missing Number |
| `REAS-OPS` | Mathematical Operations and Symbol Substitution |
| `REAS-MAT` | Number and Figure Matrix |

Until the master blueprint is editorially consolidated, this amendment governs any conflict or omission concerning Word Formation ownership.

## 2. Why Family A

`WFM-001` operates on deterministic letter inventories, selected positions, rearrangement, and lexical construction. Its primary reasoning substrate is letters and symbolic position handling rather than entity relationships or dictionary sorting. It therefore belongs with the symbolic/sequence family.

The chapter may reuse governed lexical resources, but lexical data reuse does not transfer chapter ownership.

## 3. Permanent ownership boundaries

`WFM-001` owns:

- full-source `can be formed` questions;
- full-source `cannot be formed` questions;
- selected-position letters followed by a meaningful-word count;
- meaningful-word rearrangement from a supplied letter multiset;
- numbered-letter sequence presentation when the solve contract is meaningful-word rearrangement.

`WFM-001` does not own:

- alphabet position, opposite-letter, pair-count, scan, or row-rearrangement questions whose final task is positional rather than lexical (`ALP-001`);
- dictionary ordering, insertion rank, sorted concatenation, or post-sort queries (`WOR-001`);
- hidden coding-rule inference (`COD-001`);
- synonym, antonym, definition, spelling, or vocabulary knowledge;
- unrestricted permutation-and-combination mathematics.

## 4. Permanent QL allocation

The approved WFM V2 review establishes four QL roots across three checkpoints:

| Checkpoint | QL | Permanent solve contract |
|---|---|---|
| `WFM-CP-001` | `WFM-QL-001` | exactly one option can be formed from the full source word |
| `WFM-CP-001` | `WFM-QL-002` | exactly one option cannot be formed from the full source word |
| `WFM-CP-002` | `WFM-QL-003` | selected source positions -> count governed common meaningful words using each selected letter exactly once |
| `WFM-CP-003` | `WFM-QL-004` | rearrange the supplied letter multiset into one meaningful word |

`JUMBLED_WORD` and `NUMBERED_SEQUENCE` remain renderer variants of `WFM-QL-004`; they are not separate QL identities.

No `WFM-QL-005` is reserved by this amendment.

## 5. Difficulty authority

Difficulty remains generated-instance based.

- CP001: missing-letter vs close multiplicity pressure and distractor proximity;
- CP002: selected-letter burden plus governed meaningful-word multiplicity;
- CP003: letter-set length, repeated-letter pressure, distractor multiset proximity, renderer/sequence burden.

Seed value, source-word length alone, or QL identity alone cannot promote an item to Hard.

## 6. Multilingual behavior

The chapter supports `en-IN`, `hi-IN`, and `pa-IN` instructional shells.

English source words and Latin letter evidence stay in Latin script because the tested object is English word formation. Hindi/Punjabi instructions and explanations must remain natural, simple, and free from English instructional leakage.

## 7. Controlled Question Studio stage

Taxonomy acceptance does not authorize learner delivery.

The approved next stage is shared Question Studio **review visibility only**:

- shared registry registration: allowed;
- deterministic preview: allowed;
- English/Hindi/Punjabi review: allowed;
- Question Bank write: disabled;
- test eligibility: disabled;
- mock-test eligibility: disabled;
- public publication: disabled;
- automatic learner publication: disabled.

Question Studio persistence through the generic review registry must fail closed until a later explicit persistence contract is approved.

## 8. Evidence

This amendment follows the approved WFM V2 runtime and audit candidate merged by PR #1688. That review included independent solvers, ambiguity rejection, multilingual review, generated-instance difficulty, option-length anti-cue controls, and fatigue/diversity gates.

This file is the product-governance authority for `REAS-WFM` until its row and boundary notes are folded directly into a later consolidated revision of the master blueprint.
