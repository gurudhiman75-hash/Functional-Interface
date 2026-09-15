# ENG-001 — Exhaustive Closure Audit V1

Status: `CLOSURE_BLOCKED__REMEDIATION_REQUIRED__REVIEW_ONLY`

## Scope

This is the chapter-closing audit for ENG-001 after CP001–CP013. It goes beyond per-CP validator success and the 117-question final-audit showcase.

The audit covers:

- all 13 implemented checkpoints;
- all 131 registered grammar-rule families;
- Easy / Medium / Hard calibration;
- QL001 / QL002 / QL007 contracts;
- grammatical correctness and single-defensible-error quality;
- no-error validity;
- natural exam-style wording;
- explanation usefulness and corrected-sentence accuracy;
- repetition and mechanical template leakage;
- answer-position predictability;
- option/part segmentation quality;
- deterministic generation;
- candidate/rule/surface depth;
- Question Studio cumulative integration;
- review-only lifecycle locks.

## Evidence layers

### Layer A — 117-question master review

The deterministic master pack samples every `CP × difficulty × permanent QL` combination.

Important limitation discovered during this audit: the 117 questions exercise only **77 distinct rule IDs out of 131**. It is therefore a strong cross-surface review pack, but it is not by itself exhaustive rule coverage.

### Layer B — answer-position diagnostic

A 3,900-question diagnostic exposed a genuine Part-B bias in the pre-remediation Question Studio surface. The chapter-level normalizer removes that predictable position pattern without changing the authored grammatical mutation or corrected sentence.

The normalizer is now additionally constrained to reject redraws that would create tiny generated non-error parts or overlong normalized parts. When a clean redraw is not possible, authored segmentation is preserved.

### Layer C — exhaustive closure soak

`eng-001-closure-soak-v1.test.ts` generates **7,020 questions** (`13 CPs × 3 difficulties × 3 QLs × 60 seeds`) and performs deterministic replays at three seed positions in every cell.

The soak checks:

- exact package and lifecycle identity;
- rule ownership and registration;
- all 131 rule families exercised chapter-wide;
- every checkpoint rule exercised through both error-producing surfaces (QL001 and QL002) across its applicable difficulties;
- QL007 restricted to its intentionally calibrated no-error pool, with meaningful rule/candidate/surface breadth at each difficulty;
- meaningful rule breadth inside every difficulty/QL cell without defeating intentional difficulty gating;
- candidate depth and learner-surface depth;
- answer bounds and option uniqueness;
- QL001 / QL002 / QL007 no-error contracts;
- complete corrected sentence inside explanations;
- no internal metadata leakage;
- no option-by-option analysis;
- explanation Part A–D references agree with the actual answer;
- sentence-part length guardrails, with tighter limits on generated resegmentation than on authored parts;
- deterministic replay.

## Manual learner-facing audit findings

The complete 117-question pack was reviewed across CP001–CP013. Most questions are grammatically sound and explanations are generally simple and useful. The following findings prevent chapter closure.

### BLOCKER 1 — CP004 reflexive-pronoun ambiguity

A sampled item treats:

`The reporter reminded her to verify the figures before filing the story.`

as necessarily wrong and requires `herself`.

That is not uniquely defensible: `her` can grammatically refer to another woman. The explanation assumes coreference that the sentence never establishes.

Source inspection shows the same design risk elsewhere in the reflexive family, including constructions equivalent to `the captain blamed her` and `the technician reminded him`. These ordinary object pronouns can be grammatical under a different referent.

Required remediation: redesign GR-PRN-004/related reflexive error scenes so the wrong form is syntactically or agreement-wise wrong without depending on an unstated referent. Emphatic-reflexive constructions or explicit agreement mismatches are safer.

### BLOCKER 2 — CP007 coordinator-choice ambiguity

A sampled item treats:

`The report was brief, so it covered all the main findings clearly.`

as grammatically wrong and requires `but`.

The intended contrast is understandable, but `so` is not inherently ungrammatical; a causal interpretation can be constructed. Source inspection also shows a Hard GR-CON-001 item where `so` versus `yet` is decided mainly by intended discourse relation.

Required remediation: make GR-CON-001 contexts contain an unmistakable contrast/result cue so only one coordinator is defensible, or move purely discourse-semantic choices away from single-error grammar items.

### BLOCKER 3 — CP010 misplaced-modifier / antecedent ambiguity

A Hard item treats:

`...the invoice supplied by the vendor that showed the revised tax amount...`

as necessarily wrong because `that showed...` is intended to modify `invoice` rather than `vendor`.

The existing wording permits the alternative reading that the vendor showed the revised amount. This is an attachment ambiguity, not a uniquely demonstrable grammatical error.

Required remediation: rewrite these modifier scenes so world knowledge or explicit context makes the intended antecedent unavoidable, and the erroneous attachment creates a clearly impossible or contradictory reading.

### BLOCKER 4 — difficulty calibration is uneven

Sentence length does rise across the reviewed pack (Hard questions are generally longer), but several Hard items still test the same direct local substitution seen at Easy/Medium level. Examples include very visible forms such as:

- `without to check`;
- `agreed reconsidering`;
- `much local organisations`;
- `a few moisture`;
- `explained us`;
- `in spite several...`.

Longer surrounding context alone is not sufficient Hard calibration.

Required remediation: retain simple vocabulary but increase dependency distance, competing cues, clause interaction, or structurally plausible distractor pressure for Hard pools in the affected CPs, especially CP005, CP008, CP009, CP012 and CP013.

## Significant quality findings (must be resolved or explicitly accepted before closure)

### CP001 — secondary tense risk in an SVA item

`One of the homeowners has repaired the loose door handle before it broke completely.` is awkward because the present perfect is paired with a completed past-time boundary. An SVA question should not introduce a separate tense debate after the verb-number correction.

### CP003 — naturalness

`There is much water in the tank after the rain.` is grammatically possible but noticeably less natural than ordinary exam prose. This is not a keying error, but source wording should be improved during the closure cleanup.

### CP005 — semantic naturalness and Hard depth

`The revised guidelines insist on recording every exception` personifies `guidelines` in an avoidably awkward way. Other Hard preposition errors remain too locally obvious.

### CP006 — repeated hard pattern in the review sample

Two Hard review questions independently use the same `as more ... as` mutation. The full generator may have broader depth, but closure sampling should avoid presenting near-identical hard logic back-to-back across QLs.

### CP011 — `unless + not` semantics

`You cannot borrow these books unless you do not show your membership card` is logically perverse but syntactically interpretable. Because the chapter promises one defensible grammar error, this family should be reviewed to ensure the wrong form cannot survive under an unintended meaning.

## Findings that passed manual review

- QL007 sampled no-error questions are genuinely grammatical; no false no-error key was found in the 39-item master sample.
- Explanations generally identify the decisive rule and provide a complete corrected sentence.
- No option-by-option explanation style was found in the master sample.
- No Question Studio/runtime/candidate metadata leakage was found in the master sample.
- The standardized instruction stem is repetitive by design and is not treated as a defect.
- Hard items are on average longer than Medium, and Medium longer than Easy; the remaining issue is grammatical reasoning depth, not raw sentence length.

## Closure decision

ENG-001 is **not ready for `CONTENT_CLOSED_V1`**.

Do not merge the closure PR or open Question Bank/test/mock/public/automatic learner release while the blockers above remain.

The chapter may advance to a final closure candidate only after:

1. CP004 reflexive ambiguity is removed at source;
2. CP007 coordinator contexts are uniquely defensible;
3. CP010 modifier-attachment ambiguity is removed;
4. affected Hard pools are recalibrated beyond sentence-length inflation;
5. the secondary wording/semantic findings are cleaned up;
6. the 7,020-question closure soak passes on the exact PR head;
7. the 3,900-question answer-position audit still passes after segmentation-quality constraints;
8. all existing CP workflows, API build, admin typecheck, CI hygiene and topology checks are green;
9. a regenerated 117-question pack receives a final human review;
10. explicit project-owner closure approval is recorded.

Until then, lifecycle remains review-only and the correct chapter state is:

`CP001–CP013_IMPLEMENTED__HISTORICALLY_HUMAN_APPROVED__EXHAUSTIVE_CLOSURE_AUDIT_FOUND_REMEDIATION_BLOCKERS__NOT_CONTENT_CLOSED`
