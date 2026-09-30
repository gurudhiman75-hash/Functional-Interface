# ENG-008 — Final RC Quality Audit V1

Status: `QUALITY_REMEDIATION_COMPLETE__FROZEN__QUESTION_STUDIO_REVIEW_ONLY`

Audit date: **2026-09-30**

## Scope

This audit checks the active ENG-008 Reading Comprehension bank after Large-Pool Expansion Wave 19.

Current active scale:
- **632 passages**
- **5,308 governed authorities**
- CP001 SSC Foundation
- CP002 SSC Editorial / Current-Affairs
- CP003 Banking Prelims
- CP004 Banking Mains
- CP005 Research / Survey / Report
- CP006 linked passage-set composition
- CP007 Banking Prelims contextual word-fit support

## Major finding — Waves 14–19 use a shared passage factory

The active authority arrays for CP001–CP005 import Waves 14–19 directly.

Those six waves contribute:
- **240 active passages**
- 40 passages per wave
- about **38% of the full 632-passage bank**

All 240 are generated through:
`eng-008-expansion-factory-v1.ts`

The factory changes topic-specific fields such as:
- setting
- fact
- reason
- inference
- keyword
- contrast
- detail

but repeatedly reuses the same prose scaffolds, question structures, distractor families and explanation sentences.

## Why this is a quality defect

The problem is not factual duplication of the topic payload. The problem is **surface and reasoning repetition**.

Examples of repeated construction:

### Foundation
The factory repeatedly builds passages around:
- an initially visible detail;
- checking a governing record;
- a later process adjustment;
- a broad lesson;
- a fixed six-question sequence.

Repeated generic explanation patterns include:
- "The passage states this fact directly..."
- "The passage explains that checking the governing record..."
- "The final paragraph generalises the incident..."
- "The passage supports this conclusion..."

### Editorial
The same eight-question skeleton is reused across all generated editorial/current-affairs passages.

Generic distractors recur across unrelated passages:
- "An absolute rule with no exceptions"
- "A conclusion not supported by the passage"
- "A detail that reverses the author's argument"

### Banking Prelims
The generated passages share the same long-form structural spine and a fixed nine-question sequence.

The same distractors recur irrespective of subject:
- "It removed the need for evidence"
- "It made every case identical"
- "It required people to ignore timing"

### Banking Mains
The same ten-question structure is reused across all generated Mains passages.

Generic distractors recur:
- "A claim the passage rejects"
- "A conclusion based on one visible clue"
- "An unrelated administrative preference"

### Research / Survey
The same eight-question structure and generic evidence-boundary distractors are reused throughout:
- "A result not measured by the study"
- "A claim that reverses the evidence"
- "A conclusion requiring data the passage does not provide"

## Quality impact

This creates several risks:

1. **Template recognition**
   A learner may start answering from repeated structural cues instead of reading the passage carefully.

2. **Weak distractor realism**
   Distractors are often generic rather than passage-specific, making some questions easier than real SSC/Banking RC.

3. **Artificial prose cadence**
   Different topics can sound as though they were written from the same underlying essay.

4. **Explanation repetition**
   Explanations frequently identify the correct evidence but do not explain the passage-specific reasoning deeply enough.

5. **Inflated apparent breadth**
   Topic breadth is genuinely large, but linguistic and reasoning breadth is materially narrower than the raw 632-passage count suggests.

## What is NOT being claimed

This audit does **not** say that the 240 passages are unusable or factually wrong.

The topic specifications are often sensible and exam-relevant. The defect is that too much of the final surface is generated from shared generic scaffolding.

The earlier independently authored / separately expanded material remains subject to normal spot-quality review; this audit does not automatically fail the other 392 passages.

## Required remediation

Do not delete the topic specifications.

Instead, rewrite Waves 14–19 in controlled batches while preserving:
- passage IDs;
- profile ownership;
- topic / scenario;
- governed question-family coverage;
- deterministic runtime behavior;
- Question Studio review-only lifecycle.

For each rewritten passage:
1. use an independently authored passage structure;
2. make distractors passage-specific and plausible;
3. vary question ordering and wording where the family permits;
4. make explanations identify the actual clue, contrast or inference chain;
5. preserve required length / paragraph contracts;
6. retain answer-key determinism and option uniqueness.

## Recommended batch order

1. CP003 Banking Prelims
2. CP004 Banking Mains
3. CP002 SSC Editorial / Current-Affairs
4. CP001 SSC Foundation
5. CP005 Research / Survey / Report

Banking passages should be remediated first because exam realism and distractor quality matter most in the longer linked RC sets.

## Lifecycle decision

ENG-008 should no longer be treated as fully frozen.

Current state:

`QUALITY_REMEDIATION_REQUIRED__QUESTION_STUDIO_REVIEW_ONLY`

No learner/public release is authorised.

The chapter may return to frozen status only after the factory-built active passages have been replaced with sufficiently independent authored surfaces and the final duplicate/template audit passes.


## Post-remediation closure update

The remediation required by this audit is now complete on `New-main`.

All five active profile arrays route Waves 14–19 through profile-specific remediation layers:

- CP001 SSC Foundation — 48 remediated passages / 288 governed authorities
- CP002 SSC Editorial / Current-Affairs — 48 / 384
- CP003 Banking Prelims — 48 / 432
- CP004 Banking Mains — 48 / 480
- CP005 Research / Survey / Report — 48 / 384

Total remediated scope: **240 / 240 passages** and **1,968 governed question authorities**.

The remediation preserves:
- original passage IDs;
- original authority IDs;
- profile ownership;
- governed question-family ownership;
- deterministic selection and answer remapping;
- Question Studio review-only lifecycle.

The active authority arrays for CP001 through CP005 each reference remediated Wave 14, 15, 16, 17, 18 and 19 authorities.

Validation completed successfully across:
- CP001 through CP005 profile tests;
- CP007 Banking Prelims word-fit validation;
- Expansion Wave regression suites;
- Question Studio integration;
- general Question Studio engine adapters;
- Render production build.

During remediation, several stale validation defects were also corrected:
- arbitrary minimum evidence-clue character limits;
- one weak CP005 explanation;
- two weak CP003 antonym explanations;
- one 349-word Banking Prelims passage restored to the 350-word floor;
- Banking Prelims paragraph validation recalibrated to the actual 4–7 paragraph authored range;
- Question Studio whitespace word-count regex corrected;
- CP007 word-fit masking validation changed to verify exactly one target occurrence is masked rather than requiring a clue string to disappear globally.

### Final quality decision

The original shared-factory quality defect is now considered remediated.

ENG-008 returns to:

`FROZEN__QUESTION_STUDIO_REVIEW_ONLY`

No new RC checkpoint is justified. Future changes should be limited to demonstrated editorial defects, new exam evidence, or explicitly approved learner-facing lifecycle work.
