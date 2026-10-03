# STC-001 — Final Deep Audit Closure Candidate

Status: **CONVENTIONAL DEEP AUDIT COMPLETE — MERGE BLOCKED BY UNRELATED BASE BUILD**

Date: 2026-09-29

## Scope

This closes the substantive conventional deep-audit work for Statement & Conclusion V2.2.

Novelty remains deliberately deferred to the final cross-chapter Reasoning novelty pass.

The PR must remain unmerged until the unrelated current `New-main` production API build regression is fixed and the exact merge-head production build passes.

## Existing chapter authority retained

STC-001 V2.2 remains:

- 6 permanent QLs;
- 8 surface archetypes per QL;
- 256 variants per template;
- 2048 semantic surfaces per QL;
- 12,288 English-cycle semantic surfaces;
- EN/HI/PA template parity;
- four canonical answer classes balanced across each full cycle;
- generation-ready inside Question Studio review;
- Question Bank/test/mock/public/automatic publication locked.

The existing V2.2 saturation and anti-gaming authority remains intact.

## Wave 01 — learner surface

Permanent audit:

```text
6 QLs × 3 locales × 12 seeds = 216 learner surfaces
```

Checks include:

- meaningful stems and two conclusions;
- four unique answer-code options;
- valid answer index;
- no internal generator/audit leakage;
- no mechanical wording such as "associated with", "most closely linked", "broad" or "best describes";
- explanation resolution of Conclusion I and II;
- visible stem/archetype diversity;
- deterministic answer-position movement;
- lifecycle locks.

The initial twelve-seed answer-position expectation was corrected so the learner sample must show movement while a separate deterministic 64-seed probe proves all four positions are reachable.

## Wave 02 — difficulty integrity

All 48 V2.2 templates were audited using rendered deterministic variants.

Proof volume:

```text
48 templates × 7 variant probes × 3 locales = 1,008 generated surfaces
```

Results:

```text
Easy average visible burden:   3.3265
Medium average visible burden: 4.1154
Hard average visible burden:   4.9524
seed-driven difficulty:        false
locale-driven difficulty:      false
```

The difficulty proof checks:

- template authority remains stable across variants;
- locale cannot change difficulty;
- Hard surfaces are not structurally trivial;
- Easy surfaces are not overloaded;
- aggregate visible burden rises Easy → Medium → Hard.

No difficulty relabelling remediation was required.

## Conventional source/content-gap audit

Current target-exam comparison found no new permanent STC QL requirement.

Covered conventional forms include:

- direct entailment;
- unsupported extra detail;
- polarity flip;
- overclaim;
- conditional converse/inverse/denying-antecedent traps;
- modal possibility/certainty;
- comparative/metric interpretation;
- temporal order and trend conclusions;
- standard two-conclusion four-way Only I / Only II / Both / Neither presentation.

Recent SSC evidence aligns with this contract.

Punjab Police keeps Statements and Conclusions in the reasoning syllabus; no separate Punjab-specific semantic contract is currently evidenced.

Broader Banking Mains single-best passage-conclusion Critical Reasoning remains a **source-watch** item rather than a mandatory STC V2.2 gap. Syllogistic, inequality, assumption, argument, inference, cause-effect and course-of-action contracts remain owned by their respective chapters.

Disposition:

```text
new permanent STC QL required: NO
conventional semantic gap:     NONE EVIDENCED
novelty:                       DEFERRED
```

## Wave 03 — multilingual editorial quality

A targeted EN/HI/PA learner audit now verifies:

- template/variant semantic parity;
- answer class/correct index parity;
- script integrity;
- concise two-conclusion explanations;
- no shortcut/trap boilerplate;
- no repeated instruction embedded in the stem;
- no duplicated conclusions.

### Punjabi remediation

The shared V2.2 renderer previously used literal Punjabi wording equivalent to:

```text
ਨਤੀਜਾ ... ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ
```

The learner surface now uses native wording:

```text
ਸਿੱਟਾ ... ਨਿਕਲਦਾ ਹੈ
ਸਿੱਟਾ ... ਨਹੀਂ ਨਿਕਲਦਾ
```

The permanent audit rejects a return of the old `ਅਨੁਸਰਣ` phrasing in Punjabi answer/explanation surfaces.

A Unicode audit false positive caused by shared Indic danda punctuation `।` was corrected by excluding U+0964/U+0965 from the Devanagari-letter detector; actual cross-script leakage remains prohibited.

## Exact STC-specific validation

On the latest audit head, all substantive STC steps pass:

- strict V2.2 TypeScript;
- 2048-surface-per-QL saturation/trilingual parity;
- V2.2 Question Studio freeze;
- Wave 01 learner-surface proof;
- Wave 02 difficulty-integrity proof;
- Wave 03 multilingual-editorial proof;
- V2.1 anti-gaming/saturation boundary;
- V1 immutable freeze.

## External build blocker

The production API build currently fails after all STC checks pass because current `New-main` contains an unrelated syntax regression in:

```text
src/english-v1/chapters/para-jumbles/ENG-010/eng-010-v1.ts
```

The current `New-main` file contains a literal `\nfunction explanationEmphasis...` sequence that causes esbuild syntax failure.

This STC audit does **not** modify that English chapter and does **not** weaken the production build gate.

## Final disposition

```text
V2.2 saturation:                    CLOSED
learner-surface quality:            CLOSED
difficulty integrity:               CLOSED
conventional source/exam coverage:  CLOSED
new conventional QL requirement:    NONE
explanation quality:                CLOSED
EN/HI/PA semantic parity:           CLOSED
Punjabi shared terminology:         REMEDIATED
Question Studio review freeze:      PRESERVED
Question Bank/test/mock/public:      LOCKED
novelty:                            DEFERRED
substantive STC deep audit:          COMPLETE
production merge validation:        BLOCKED_BY_UNRELATED_NEW_MAIN_BUILD
```

After the unrelated base build is repaired, rerun the exact merge-head workflow. If the production API/admin builds then pass with these STC gates unchanged, this closure candidate can be promoted to final closure without reopening content.
