# English Content — Final Quality Revalidation V1

Status: `PHASE1_COMPLETE__CLOSURE_STATE_RECONCILED__NO_CONTENT_REOPENING_YET`

Audit date: **2026-09-30**

## Purpose

This pass begins the post-closure quality revalidation requested after ENG-001 through ENG-013 were content-closed.

The goal is not to add volume. It is to reopen only when there is a demonstrated editorial, ambiguity, generator, exam-realism or lifecycle defect.

## Phase 1 — closure-state reconciliation

The live repository confirms:

- ENG-001 Error Spotting is closed through CP013 with 131 registered grammar rules and chapter-wide deterministic/answer-position audits.
- ENG-002 Sentence Improvement is closed through CP013 with the same 131-rule grammar-family coverage and a frozen owner-reviewed master audit.
- ENG-004 Synonyms/Antonyms, ENG-005 Idioms/Phrases, ENG-006 One-word Substitution and ENG-007 Spelling retain their approved/frozen review-only states.
- ENG-008 has already completed the Waves 14–19 RC surface-remediation pass and is frozen again.
- ENG-009 through ENG-013 remain covered by the current whole-English closure authority.

## Repository-state issue found

Several older checkpoint/source-audit files still contain historical labels such as:

- `HUMAN_REVIEW_PENDING__REVIEW_ONLY`
- `FREEZE_CANDIDATE`
- pre-registration lifecycle wording

Those files describe the state at the time that checkpoint artifact was authored. They are not the current chapter lifecycle authority.

To avoid false reopen signals, the current whole-English closure record now explicitly states that historical checkpoint status lines are superseded by later approval/freeze/closure records.

## Content decision

No English module is reopened by Phase 1.

This pass found a documentation/lifecycle-interpretation risk, not a learner-content defect.

The next revalidation phase should inspect active generators and representative rendered surfaces for:

1. exam-standard stem wording;
2. repeated/giveaway templates;
3. weak or mechanical explanations;
4. ambiguous distractors or alternate-valid answers;
5. difficulty based only on length/rarity;
6. unnatural banking/SSC contexts;
7. answer-position or deterministic-generation artifacts.

Only concrete failures from that pass should modify frozen learner content.

## Phase 2 — ENG-005 explanation remediation

The active ENG-005 generators exposed a concrete quality defect: CP001–CP004 all reduced explanations to the same one-line definition pattern, `“phrase” means meaning.`.

That is now remediated without changing the 840-expression authority, answer keys, distractor selection, difficulty, IDs or lifecycle state.

- expression → meaning questions now state the meaning and explicitly connect it to the keyed option;
- meaning → expression questions now explain that the supplied meaning is expressed by the keyed idiom/phrase;
- the final ENG-005 audit now rejects explanations shorter than the new helpful-depth floor and requires the governed phrase to appear in the explanation.

ENG-005 is therefore reopened only for this demonstrated explanation defect; no breadth expansion is introduced.


## Phase 4 — ENG-006 explanation grammar remediation

A post-closure review found a learner-facing wording weakness in the shared ENG-006 explanation helper. Person-based definitions such as `a person who ...`, `a person whose ...`, and `a person with ...` were rendered as `“X” describes a person ...`, which was understandable but less natural than a direct definition.

Remediation:
- person-based explanations now use direct forms such as `“X” is a person who ...`;
- the change applies uniformly across ENG-006 CP001-CP006 through the shared explanation helper;
- the 1,400 substitution authorities, definitions, categories, difficulty labels, option generation and answer keys are unchanged;
- the final audit now guards against regression to the old `describes a person ...` phrasing.

No breadth expansion was required.


## Phase 5 — ENG-007 spelling explanation parity

Review found that CP001 supplied trap guidance, while CP002–CP007 used answer-only explanations. Several older tests also enforced a 90-character limit and rejected explanatory hints, producing inconsistent learner-facing quality.

Remediation:
- CP002–CP007 now identify both the correct and governed misspelling and provide concise guidance informed by the source entry's trap classification.
- Both correctly-spelt and misspelt-word question modes are preserved.
- CP002–CP007 regression tests now require the source forms and trap guidance rather than prohibiting teaching hints.
- The frozen 1,445-entry authority, canonical/misspelling forms, difficulty assignments, option-generation logic, source references and review-only lifecycle are unchanged.

The guidance is intentionally conservative for broad classifications (for example, double-letter), rather than asserting an exact letter edit unless the classification safely supports it.


## Phase 6 — ENG-001 post-closure answer/explanation consistency

Review confirmed ENG-001 CP001–CP013 remain content-closed under the previously validated 131-rule grammar authority. No new content family or substantive source defect was substantiated in this pass.

A coverage weakness was identified in the 117-question chapter master audit: it checked explanation length and corrected-sentence inclusion, but did not explicitly assert that the explanation's Part A/B/C/D label matches the **final** learner-facing answer after Question Studio answer-position normalization.

Remediation: the master audit now validates the final keyed part against every explicit Part reference in QL001/QL002 explanations, and guards QL007 no-error explanations against accidentally identifying an error-bearing part. This is a regression-only change. Approved stems, grammatical mutations, candidate pools, answer-position logic, frozen content and review-only lifecycle remain unchanged.


## Phase 7 — ENG-002 no-improvement answer consistency

The post-closure audit confirmed the existing approved ENG-002 inventory: CP001–CP013, 131 rules, a deterministic 117-question master review, and the 3,900-question closure soak. No justified grammar-content reopening was identified.

A regression-coverage gap remained: tests verified that option D says `No improvement`, but did not verify that its answer key agrees with the learner-visible sentence and the source corrected sentence.

The master audit and full closure soak now assert:
- when D (`No improvement`) is keyed, the visible sentence equals the corrected sentence after underline markup is removed;
- when A/B/C is keyed, the visible sentence must differ from the corrected sentence.

This is an audit-only change. The 131-rule authority, source candidates, sentence surfaces, answers, explanations, four-option scheme and review-only lifecycle are unchanged.


## Phase 8 — ENG-003 cross-checkpoint filler reconstruction

ENG-003 remains content-closed through CP013 with 131 approved rule families. The individual later checkpoints already contain sentence reconstruction assertions, but there was no consistent post-closure check at the **cumulative Question Studio** level across every checkpoint.

Added a separate chapter-wide regression: 468 seeded samples (13 checkpoints × 3 difficulties × 12 questions) verify that inserting the keyed filler into the one displayed blank reconstructs the reported corrected sentence. The test also checks four distinct answer options, no leaked `No improvement` option, that explanations include the chosen filler and complete corrected sentence, deterministic replay per checkpoint/difficulty, and locked review-only lifecycle.

Added a dedicated pull-request workflow for this test. This is test-only: no approved question content, answer keys, source generators, permanent QLs, difficulty assignments or lifecycle flags change.
