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


## Phase 9 — ENG-008 linked RC set integrity

The active RC bank remains frozen at 632 passages and 5,308 governed authorities, with Waves 14–19 previously remediated across all five profiles. Revalidation of the live CP006 set builder and CP007 contextual word-fit masking found an integration-coverage gap: the existing Question Studio tests sampled only one 10-question Banking Prelims set, rather than verifying the full active CP007 authority population.

Added a focused test covering all **126 active BP-F10 word-fit authorities** by generating a complete 10-question linked Banking Prelims set for each passage. It checks exactly one masked blank, shared passage identity, ten unique governed families/authorities, one correct word-fit answer, deterministic replay on a rotating sample, and clean unmasked passage use in the approved shorter 8/9-question sets. The guard also samples all other CP006 exam profiles and supported set sizes.

A dedicated path-scoped PR workflow runs this integration guard. This adds coverage only; approved passages, question authorities, options, explanations and review-only lifecycle remain unchanged. CI must complete before validation success is claimed.


## Phase 10 — ENG-009 Cloze Test composer approval reconciliation and CP005 editorial finding

The current ENG-009 closure authority and approved source record explicitly approve CP001–CP006, covering 48 passages / 268 governed blanks, with Question Studio kept review-only. The live Question Studio adapter retained superseded pre-approval flags for the CP006 composer: `composerApprovalPending: true` in package metadata and `humanReviewApproved: false` in composed set/question responses. These were stale integration metadata, not a new approval decision.

The adapter now derives composed-set human/authoring approval from the existing `ENG009_HUMAN_APPROVAL_V1` authority and marks the composer pending flag false. The existing integration test was strengthened to assert these approved flags while ensuring learner/production release stays locked, and a path-scoped PR workflow was added. No cloze source content, options, answer keys, composer algorithm, authored approval record or release flags are altered.

**Separate substantive editorial finding — not remediated by the metadata-only PR:** CP005 `can-fit` generation currently chooses one accepted word as the key while including other accepted words among the remaining options (see `eng-009-cp005-v1.ts`, `blank.accepted.slice(1)`). Authored examples explicitly list multiple contextually valid accepted choices. A single-answer `Which option can appropriately fill...` stem may therefore have multiple defensible answers. CP005 requires a separate source revision that preserves the intended can-fit family but uses an unambiguous answer contract, followed by full CP005/CP006 regeneration, editorial review and explicit re-approval of affected frozen surfaces. This risk means a claim of newly completed end-to-end ENG-009 quality revalidation would be premature; closure records remain historical approval evidence, not proof that this specific defect is resolved.


**Inventory reconciliation required:** The older ENG-009 chapter closure record enumerates 48 passages / 268 blanks, but the current CP001–CP005 regression inventories declare 20/100, 20/100, 20/120, 20/120 and 18/108 respectively: **98 currently registered passages and 548 blanks** if those active exports match their tests. The historical closure totals are therefore not appropriate current scale figures. Confirm against active runtime exports and reconcile the authoritative inventory document in the separate content-quality remediation before claiming current whole-chapter inventory certification.


## Phase 11 — ENG-009 CP005 can-fit single-answer remediation V2

The CP005 ambiguity identified in Phase 10 is remediated at source level.

For every `can-fit` authority, the authored model already stores three accepted words and one rejected word. Instead of rendering several accepted words as separate options while keying only one, V2 now asks:

`Which group contains only words that can appropriately fill blank number N?`

The keyed option contains the three governed accepted words. Each of the three distractor groups contains the governed rejected word. This preserves the original accepted/rejected authority and makes the keyed response uniquely defensible without inventing new vocabulary.

Additional controls:
- changed can-fit learner surfaces use `ENG-009-CP005-V2` question IDs;
- cannot-fit and phrasal-word rendering remain unchanged;
- the 108-authority CP005 audit explicitly checks the single-answer contract;
- CP005 direct Question Studio surfaces and CP006 `banking-new-pattern` composed sets are marked human-review pending for this revision;
- all other ENG-009 profiles retain their previous approval state;
- the full CP005 review exporter now covers the live 18 passages / 108 blanks and emits `ENG-009-CP005-FULL-REVIEW-V2.md`.

Current active regression inventories across CP001–CP005 are:
- CP001: 20 passages / 100 blanks
- CP002: 20 / 100
- CP003: 20 / 120
- CP004: 20 / 120
- CP005: 18 / 108
- **Total: 98 passages / 548 governed blanks**

These current totals supersede the older 48 / 268 scale figure for present inventory reporting. Final CP005 V2 human approval is still required before the revision-pending flags can be cleared.

The same audit also reactivated the dormant passage-length guard. Five oversized base passages (C04–C08) were tightened to 338–381 words without changing their governed blanks, and C10 was restored from 292 to 303 words. All 18 active CP005 passages now satisfy the existing 300–540 word contract.


## Phase 12 — ENG-009 CP005 V2 human approval and re-closure

The regenerated 108-question CP005 V2 review artifact was explicitly human-approved on 2026-09-30 after the single-answer can-fit remediation, passage-band corrections and post-review language-polish pass.

Closure actions:
- CP005 V2 direct Question Studio surfaces are human/editorial approved again;
- CP006 `banking-new-pattern` composed sets sourced from CP005 are approved again;
- package-level revision-review pending lists are cleared;
- ENG-009 approval authority advances to `ENG-009-CP001-CP006-HUMAN-APPROVED-V2`;
- current chapter inventory is certified at **98 passages / 548 governed blanks**;
- Question Bank writes, test/mock eligibility, public publication, automatic learner publication and production release remain locked.

ENG-009 is therefore content-closed again under Question Studio review-only lifecycle.
