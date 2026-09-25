# DIR-001 Final Audit — Wave 06

## Scope

Chapter-wide audit of:

- stem realism and exam-style wording;
- distractor plausibility and misconception targeting;
- English / Hindi / Punjabi parity for learner-facing stems;
- all permanent QLs `DIR-QL-001..044`.

Primary review evidence:

- the green 132-question final-audit review pack from Wave 05
  - 44 QLs × English / Hindi / Punjabi;
- source-level review of the stem renderers and option builders;
- existing exhaustive per-checkpoint runtime proofs;
- new chapter-wide 44 × 40-seed English stem/distractor regression.

## Findings

### Distractors

The distractor system is already materially strong.

Across the chapter, wrong options are generally tied to concrete misconception classes such as:

- left/right reversal;
- clockwise/anticlockwise reversal;
- query-relation reversal;
- opposite direction;
- wrong axis / sign;
- total distance versus displacement;
- arithmetic or Pythagorean error;
- wrong mover / wrong entity;
- wrong coded operator;
- shadow / sun / reference-frame confusion.

No systemic random-option or arbitrary-number problem was found.

For that reason, this wave does **not** churn correct distractor logic merely to create changes.

### Stem weaknesses found

#### CP001

One English variant could produce repetitive phrasing of the form:

> starts by facing ... and then ... then ...

The underlying turn sequence was valid, but the surface wording sounded generated.

#### CP006

QL025 Hindi and Punjabi code-recovery stems described evidence as a generic “result” of a coded chain rather than directly stating the relation between the first and last entities.

That wording was less natural than the English source and less exam-like.

#### CP007

The compound shadow + turns family could produce repeated “then / and then” wording.

Hindi QL034 also used instruction-style boilerplate rather than a clean exam statement.

#### CP008

The largest stem-realism issue was unnecessary scenario padding:

- “near the main gate”;
- “beside the central lawn”;
- “along a marked track”;
- “close to the entrance”;
- “near the boundary wall”;
- “patrol officer”;
- “marked point”;
- “direction that is not stated”;
- “courier”.

These details did not increase reasoning quality and made several advanced questions feel authored by a generator rather than taken from an exam.

## Remediation

### CP001

- removed the repetitive “starts by facing ... and then ... then ...” opening;
- retained turn-sequence diversity and all solve state.

### CP006

- Hindi and Punjabi QL025 now state the actual first-to-last entity relation from each evidence chain;
- removed generic “result” phrasing.

### CP007

- naturalized multi-turn English sequencing;
- removed Hindi instruction boilerplate in QL034.

### CP008

- removed secondary place-detail padding from the scenario context pool;
- retained standard neutral places such as school ground, public park, college campus, office compound, village square, sports complex, market yard and garden;
- replaced “marked point” with a normal starting point;
- replaced “direction that is not stated” with “unknown direction”;
- removed “patrol officer” framing;
- replaced “courier” with the standard exam-style “person” framing;
- aligned Hindi and Punjabi stems with the same concise treatment.

## Distractor regression

The final-audit regression now generates every QL for 40 deterministic seeds and requires:

- exactly four options;
- four distinct option values;
- four distinct option labels;
- exactly one option with `errorLabel: null`;
- every wrong option to have an explicit misconception/error label;
- no generic labels such as random / generic / placeholder / arbitrary / dummy.

This gives a chapter-wide guard over **1,760 English generated questions** in addition to the existing checkpoint-specific proofs.

## Stem regression

The audit now explicitly rejects the machine-like phrasing identified in this wave, including the CP008 context padding and occupational framing.

Hindi and Punjabi chapter proofs also reject the localized wording defects fixed here.

## Safety boundary

This wave does not change:

- QL IDs or ownership;
- rule IDs;
- correct answers;
- correct indexes;
- option values;
- distractor algorithms;
- solve-relevant geometry;
- independent solvers;
- difficulty labels;
- diagrams;
- Question Bank / test / mock / public-release state.

The CP008 scenario `place` text is simplified in the structured prompt. This is presentation context only and does not participate in solving or answer generation.

## Still open after Wave 06

- generated-instance difficulty calibration;
- diagram policy / scale / readability audit;
- current Question Studio integration;
- explicit multilingual freeze authority;
- final downstream release-boundary proof.
