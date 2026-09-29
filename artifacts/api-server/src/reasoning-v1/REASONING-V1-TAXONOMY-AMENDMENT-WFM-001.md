# Reasoning V1 — WFM-001 Taxonomy Amendment

Status: **AUTHORITATIVE CURRENT-MAIN AMENDMENT**

Date: 2026-09-29

Product code: `REAS-WFM`  
Implementation chapter: `WFM-001`  
Student title: **Word Formation**  
Family: **Symbolic / verbal reasoning**

## Ownership decision

Word Formation is a permanent Reasoning V1 chapter.

WFM-001 owns:

- full-source **can be formed** questions;
- full-source **cannot be formed** questions;
- selected source positions followed by a governed meaningful-word count;
- meaningful-word rearrangement from a supplied letter multiset;
- numbered-letter sequence presentation when the solve contract is meaningful-word rearrangement.

WFM-001 does not own:

- dictionary ordering / insertion rank / sorted-word tasks (`WOR-001`);
- alphabet position, opposite-letter, pair-counting or scan tasks (`ALP-001`);
- hidden coding-rule inference (`COD-001`);
- synonym, antonym, definition or vocabulary knowledge;
- unrestricted permutation-and-combination mathematics.

## Permanent QL allocation

| Checkpoint | QL | Permanent solve contract |
|---|---|---|
| `WFM-CP-001` | `WFM-QL-001` | exactly one option can be formed from the full source word |
| `WFM-CP-001` | `WFM-QL-002` | exactly one option cannot be formed from the full source word |
| `WFM-CP-002` | `WFM-QL-003` | selected source positions → count governed common meaningful words using every selected letter exactly once |
| `WFM-CP-003` | `WFM-QL-004` | rearrange the supplied letter multiset into one meaningful word |
| `WFM-CP-004` | `WFM-QL-005` | ordered position extraction without jumbling; choose the candidate source/group that forms a meaningful word |
| `WFM-CP-005` | `WFM-QL-006` | selected letters → unique/multiple/none meaningful-word decision → requested output letter or explicit X/Y sentinel |

`JUMBLED_WORD` and `NUMBERED_SEQUENCE` remain renderer variants of `WFM-QL-004`.

`BANKING_SINGLE_WORD_POSITION_OPTION` and `BANKING_MULTI_WORD_POSITION_OPTION` are renderer variants of the same ordered-extraction solve contract `WFM-QL-005`.

No `WFM-QL-007` is reserved by this amendment.

## Difficulty authority

Difficulty is generated-instance based.

- CP001: missing-letter vs multiplicity pressure and distractor proximity;
- CP002: selected-letter burden + number of governed common solutions;
- CP003: letter-set/repetition/sequence and distractor proximity;
- CP004: number of source groups, position-pattern complexity and ordered-extraction burden;
- CP005: selected-letter burden, ambiguity class (unique/multiple/none) and requested output position.

Seed value, QL identity, language or source-word length alone must not promote an item to Hard.

## Localization

The chapter supports:

- `en-IN`
- `hi-IN`
- `pa-IN`

Exam-profile delivery:

- SSC / Punjab: four-option contracts;
- Banking: five-option contracts only where source-backed (`WFM-QL-003/005/006`).

The tested English words remain in Latin script. Instructional language and explanations must be native, simple and free of English instructional leakage.

## Question Studio stage

WFM-001 is authorized for the normal shared Question Studio **review-only** lifecycle.

Allowed:

- standard Reasoning V1 package discovery;
- deterministic EN/HI/PA generation;
- QL / checkpoint / difficulty selection;
- review-run persistence.

Still locked:

- canonical Question Bank write;
- test eligibility;
- mock-test eligibility;
- public publication;
- automatic learner publication;
- production release.

This amendment supersedes older text describing WFM-001 as a merely proposed taxonomy candidate.
