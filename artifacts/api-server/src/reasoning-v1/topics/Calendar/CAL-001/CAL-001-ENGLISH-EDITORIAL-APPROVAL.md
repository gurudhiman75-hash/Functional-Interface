# CAL-001 English Editorial Approval

Status: **APPROVED — ENGLISH EDITORIAL REVIEW COMPLETE; FORMAL DISCOVERY/IDENTITY FREEZE AND RELEASE SURFACES REMAIN LOCKED**

Approval date: `2026-08-08`

Approved review authority: project-owner approval of the corrected CAL-001 English review pack.

## Approved scope

The approval covers the learner-facing English quality of the corrected discovery runtime and its curated review evidence:

- all 10 Calendar checkpoints;
- all 44 provisional authorities `CAL-PQL-001..044`;
- 5 curated English questions per provisional authority;
- 220 curated English questions in total;
- the accompanying 528-question extended English audit pool;
- question-stem clarity and exam-natural wording;
- tense-neutral treatment of future and timeless dates;
- four unique options with one correct answer;
- misconception-derived distractors;
- student-readable working and conclusions;
- corrected inverse, leap-year, century, month-length and weekday-frequency authorities.

## Evidence accepted

The approved pack is backed by the remediation merged through PR `#623` and the following green gates:

- strict TypeScript validation;
- exhaustive Gregorian and generator proof;
- 44,000 generated English package checks;
- deterministic replay and independent verifier checks;
- locale semantic-parity checks;
- exam-readiness remediation proof;
- 220-question curated export;
- 528-question extended audit export;
- integrated admin-panel validation;
- production build validation.

The approved review pack has:

```text
Checkpoints                         10
Provisional authorities            44
Curated questions per authority     5
Curated English questions          220
Extended English audit questions   528
Future-date “was” defects            0
Duplicate-option rows                0
Empty explanation conclusions        0
Answer/explanation disagreements     0
Permanent QLs                        0
```

## Governance effect

This approval closes the **English editorial-review gate** for the current discovery authorities.

```text
englishEditorialReviewApproved: true
formalEnglishDiscoveryFreeze:    false
permanentQlAllocation:           false
questionStudioActivation:        false
questionBankWrites:              false
mockTestEligibility:             false
publicPublication:               false
```

The package-level lifecycle remains closed because the same discovery runtime also renders unapproved Hindi and Punjabi drafts and because permanent identity allocation has not occurred.

## Matters not approved by this decision

This approval does **not** by itself close or authorise:

- final multi-source coverage audit;
- final merge/split audit;
- final inverse-authority audit;
- final gap audit;
- permanent QL allocation;
- Hindi human review or freeze;
- Punjabi human review or freeze;
- multilingual parity freeze;
- Question Studio public discovery;
- Question Bank storage or writes;
- mock-test use;
- public publication.

## Next legitimate gate

The next chapter-wide governance step is to complete the source-coverage, merge/split, inverse and gap decisions. Only after those decisions may CAL-001 declare a formal English discovery/identity freeze and allocate permanent `CAL-QL-*` identities.
