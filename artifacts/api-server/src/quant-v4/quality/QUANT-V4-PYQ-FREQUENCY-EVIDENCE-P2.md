# Quant V4 PYQ Frequency Evidence — P2

**Authority:** `QUANT-V4-PYQ-FREQUENCY-EVIDENCE-P2`  
**Status:** evidence/weighting infrastructure only  
**Important:** this checkpoint does **not** publish topic percentages for any exam.

## Purpose

The real-exam simulation audit currently marks every profile with `PYQ_FREQUENCY_WEIGHTING_PENDING`. This checkpoint defines the evidence contract that must be satisfied before provisional section slot mixes may be replaced with empirical topic/representation weights.

The core rule is simple:

> A source can support content coverage without being allowed to determine exam frequency.

Quant V4 already contains many useful chapter-level source audits and fixture ledgers. Some contain direct SSC/Banking PYQs; others contain books, practice taxonomies or internal design fixtures. Those categories must not be mixed into one frequency denominator.

## Evidence classes

### Countable for empirical frequency

- `OFFICIAL_PAPER`
- `DIRECT_PYQ`
- `VERIFIED_PYQ_COLLECTION`

A countable observation must identify:

- exam profile;
- paper identity;
- question identity/reference;
- source reference;
- topic;
- subtopic;
- representation.

If the adopted profile policy requires dated evidence, `heldDate` is also mandatory before the profile can become an empirical candidate.

### Supporting but non-countable

- `BOOK_EXERCISE`
- `PRACTICE_TAXONOMY`
- `INTERNAL_DESIGN_FIXTURE`

These sources remain valuable for:

- discovering missing mathematical forms;
- verifying coverage breadth;
- misconception design;
- variable/range design;
- explanation pedagogy.

They contribute **zero** questions to exam-frequency denominators.

## Existing repository evidence

The current repository already demonstrates why this distinction is necessary. Examples include:

- Algebra source/PYQ audits containing identified SSC CGL, SSC CPO and SSC CHSL PYQ fixtures;
- Algebra's final fixture ledger, which also separately records Banking/Insurance practice taxonomy;
- Number System source-disposition ledgers that explicitly combine inspected SSC PYQs with R.S. Aggarwal, Arun Sharma and legacy Quant material for coverage analysis.

Those sources are legitimate chapter evidence, but only their countable exam observations may later enter the empirical weighting registry.

## No invented thresholds

This infrastructure deliberately does not hard-code a universal evidence threshold such as “100 questions” or “10 papers”. A profile must supply an explicit `QuantV4PyqEvidencePolicy` containing:

- `minDistinctPapers`;
- `minCountableQuestions`;
- `minTopicCoverage`;
- whether dated paper identity is required.

The policy itself must be ratified from the exam-audit methodology. CI tests use synthetic thresholds only to prove the mechanism; those numbers are not production policy.

## Weight calculation

For countable observations only:

`share(bucket) = count(bucket) / total countable observations for that exam profile`

The authority produces distributions for:

- topic;
- topic + subtopic;
- representation.

Every non-empty distribution must sum to 1 within floating-point tolerance.

## Readiness states

### `NO_COUNTABLE_EVIDENCE`

No eligible PYQ observations exist for the profile.

### `INSUFFICIENT_EMPIRICAL_EVIDENCE`

Some countable evidence exists, but the profile's adopted evidence policy is not satisfied.

### `EMPIRICAL_WEIGHT_CANDIDATE`

All adopted evidence-policy gates pass. Only this state may replace `PROVISIONAL_PYQ_WEIGHTING_REQUIRED` in the real-exam simulator.

This is still a candidate state: editorial/source audit may reject bad mappings before the weights are frozen.

## Fail-closed blockers

The profile records explicit blockers such as:

- `NO_COUNTABLE_PYQ_EVIDENCE`
- `COUNTABLE_QUESTION_SAMPLE_BELOW_POLICY`
- `DISTINCT_PAPER_SAMPLE_BELOW_POLICY`
- `TOPIC_COVERAGE_BELOW_POLICY`
- `DATED_PAPER_IDENTITY_INCOMPLETE`

The simulator must not infer or fabricate weights to remove these blockers.

## Next data work

The next evidence pass should convert existing chapter source ledgers into normalized `QuantV4PyqObservation` records, beginning with directly identified PYQ fixtures. Each migrated record should preserve its original source reference so the mapping can be audited back to the chapter evidence.

After enough normalized observations exist for a specific exam profile and an evidence threshold has been explicitly adopted, the real-exam simulator can consume that profile's empirical candidate weights and show the resulting section-distribution change.
