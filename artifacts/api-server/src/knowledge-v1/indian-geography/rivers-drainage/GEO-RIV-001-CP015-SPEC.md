# GEO-RIV-001-CP015 — Mixed Rivers Mastery

Status: REVIEW CANDIDATE V2
Chapter: `GEO-RIV-001`
CP: `GEO-RIV-001-CP015`
Engine: `knowledge-v1`

## Objective

Close the Rivers & Drainage chapter with a balanced chapter-level review authority after the component checkpoints have been individually qualified. CP015 does not create a new geography truth corpus and does not allocate new learner-task QLs. It composes already-qualified questions from CP001–CP014 and preserves the originating QL, source, fact lineage and answer authority.

## Stacked review boundary

CP007 is currently an exact human-review candidate rather than a merged/frozen `New-main` authority. CP015 V2 is therefore intentionally stacked on the exact reviewed CP007 head plus current `New-main`. This allows chapter-level review to continue without pretending CP007 is approved.

CP015 MUST NOT merge or enter Question Studio until CP007 receives explicit human approval and is merged/frozen first. After CP007 is approved, CP015 must be restacked/revalidated on the resulting `New-main` before any merge decision.

## No-new-QL rule

CP015 reuses the permanent QL IDs owned by CP001–CP014. It must not invent `QL128+` merely to represent mixed delivery. Mixed mastery is a delivery/composition checkpoint, not a new semantic learner task.

## Review batch contract

The V2 mastery batch contains 60 questions with 60 distinct inherited QLs.

Source-CP allocation:

| Source CP | Questions |
| --- | ---: |
| CP001 | 4 |
| CP002 | 4 |
| CP003 | 4 |
| CP004 | 4 |
| CP005 | 4 |
| CP006 | 4 |
| CP007 | 6 |
| CP008 | 4 |
| CP009 | 4 |
| CP010 | 4 |
| CP011 | 4 |
| CP012 | 4 |
| CP013 | 4 |
| CP014 | 6 |

CP007 and CP014 receive two extra slots because they are the dedicated cross-system network and multi-fact integration checkpoints.

## Difficulty and option balance

Target difficulty shape:

- Easy: 14
- Medium: 32
- Hard: 14

Correct-answer positions are rebalanced without changing option meaning:

- A: 15
- B: 15
- C: 15
- D: 15

## Selection and realization rules

1. Every selected source question must already have four distinct options and a valid keyed answer.
2. Each source CP must contribute the exact quota above.
3. No inherited QL may appear twice in the 60-question mastery batch.
4. No learner payload may repeat by `stem + canonical answer`.
5. Source IDs and source-fact IDs are mandatory and carried forward unchanged.
6. CP015 records `sourceCpId`, `sourceQuestionId` and `sourceQlId` for every wrapped item.
7. V1 composition preserves source learner content apart from option-order rebalancing. V2 applies one governed presentation-only normalization: proper river names use the chapter-wide `River + name` convention.
8. The V2 realizer must not alter semantic answer authority, inherited QL identity, source/fact lineage or difficulty.
9. River-derived proper nouns such as `Beas Kund`, `Tungabhadra Dam`, `Tungabhadra Reservoir`, basin names and river-system names are protected from inappropriate prefixing.
10. CP015 cannot silently repair a semantic source defect. If a selected source item is factually, logically or editorially defective beyond this governed naming normalization, the defect must be fixed in the owning CP and the mastery batch regenerated.

## Editorial rules

- competitive-exam wording only;
- no review/source/generator language in learner content;
- preserve the chapter-wide `River + name` convention where it denotes the river itself;
- preserve natural proper nouns and system/basin labels;
- explanations remain concise and question-specific;
- no fabricated distractors;
- no unsupported inference from missing facts;
- no `all/none of these` filler unless the owning qualified QL explicitly requires a count-style answer set such as None/One/Two/Three.

## Lifecycle

CP015 is review-only. It does not register a new runtime package, does not write Question Bank rows, and is not test/mock/public eligible. Human approval is required after the final artifact is reviewed on the exact post-CP007-approval base.
