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

`JUMBLED_WORD` and `NUMBERED_SEQUENCE` are renderer variants of `WFM-QL-004`; they are not separate permanent identities.

No `WFM-QL-005` is reserved by this amendment.

## Difficulty authority

Difficulty is generated-instance based.

- CP001: missing-letter vs multiplicity pressure and distractor proximity;
- CP002: selected-letter burden + number of governed common solutions;
- CP003: letter-set/repetition/sequence and distractor proximity.

Seed value, QL identity, language or source-word length alone must not promote an item to Hard.

## Localization

The chapter supports:

- `en-IN`
- `hi-IN`
- `pa-IN`

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
