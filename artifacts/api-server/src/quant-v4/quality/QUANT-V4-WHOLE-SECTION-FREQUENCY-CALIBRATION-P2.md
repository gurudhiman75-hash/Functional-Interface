# Quant V4 Whole-Section Frequency Calibration Gate P2

**Authority:** `QUANT-V4-WHOLE-SECTION-FREQUENCY-CALIBRATION-P2`

## Problem

The PYQ registry contains two different evidence shapes:

1. **complete Quant sections** — unbiased paper-composition evidence suitable for chapter/package frequency estimation;
2. **isolated PYQs** — useful for CP/QL coverage, source-realness and specialized-profile evidence, but selected by topic and therefore unsafe for section-frequency estimation.

Mixing both shapes in one frequency calculation can over-weight chapters that received deeper audit attention. Historical undated Number System collection rows also keep the general PYQ profile's dated-identity blocker active even after strong complete-paper evidence is available.

## P2 decision

Whole-section frequency calibration is now a separate evidence surface.

- Only explicitly declared, fully normalized Quant sections enter section-frequency weights.
- A declared section enters the calibration sample only when every expected question is present exactly once and its held date/shift match the declared paper identity.
- Isolated PYQs remain in the shared registry and remain valid for CP/QL coverage and specialized-selection evidence.
- Isolated PYQs cannot change whole-section package/topic weights.
- Evidence candidacy and production promotion are separate gates.

## Current SSC CGL Tier-I complete-section sample

| Paper | Quant range | Questions |
| --- | --- | ---: |
| 09 Sep 2024 Shift 1 | Q51–Q75 | 25 |
| 27 Jul 2023 Shift 2 | Q26–Q50 | 25 |
| 01 Dec 2022 Shift 1 | Q51–Q75 | 25 |

Current complete-section sample: **3 papers / 75 questions / 3 exam years / 20 live package IDs**.

The shared CGL Tier-I registry contains **100 countable observations**. Therefore **25** remain non-whole-section observations. Ten of those are legacy undated Number System collection observations; they no longer contaminate whole-section weights because they are outside the complete-section sample.

## Conservative P2 audit policy

- minimum complete sections: **8**;
- minimum distinct section years: **3**;
- minimum package coverage: **10**;
- dated section identity required: **yes**;
- production promotion authorized: **no**.

The current profile is therefore `SECTION_EVIDENCE_ACCUMULATING` with blocker `COMPLETE_SECTION_SAMPLE_BELOW_POLICY`.

This checkpoint does **not** authorize replacement of provisional simulator weights. Even if evidence thresholds are temporarily lowered in a test, production promotion still requires an explicit authorization switch.

## Why this matters

A chapter can have many verified PYQs because it was audited aggressively. That is evidence that the chapter exists in real exams, but not evidence that the chapter occupies the same share of an actual Quant section. Complete-section calibration avoids that sampling bias and gives Examtree a defensible path to future SSC chapter-frequency distributions.

## Exit condition

Continue normalizing fully dated complete Quant sections. Revisit the P2 sample threshold only after enough independent sections exist to examine paper-to-paper variance. Do not promote production frequency weights merely because isolated-question totals are large.
