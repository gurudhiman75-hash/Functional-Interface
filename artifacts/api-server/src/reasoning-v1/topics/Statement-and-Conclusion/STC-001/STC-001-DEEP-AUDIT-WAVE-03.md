# STC-001 — Deep Audit Wave 03

Status: **IMPLEMENTED — MULTILINGUAL EDITORIAL QUALITY ACTIVE**

Date: 2026-09-29

## Scope

Wave 03 adds a learner-facing EN/HI/PA editorial guard on top of V2.2 saturation and the Wave 01/02 audits.

Novelty remains deferred.

## Punjabi remediation

The shared V2.2 renderer previously used the literal wording:

```text
ਨਤੀਜਾ ... ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ
```

This is understandable but unnatural Punjabi.

The shared learner surface now uses native exam-style wording:

```text
ਸਿੱਟਾ ... ਨਿਕਲਦਾ ਹੈ
ਸਿੱਟਾ ... ਨਹੀਂ ਨਿਕਲਦਾ
```

The change affects the common renderer, so every V2.2 Punjabi variant receives the corrected terminology without altering solver semantics, answer class, template authority or scheduler.

## Wave 03 proof

The audit samples all six QLs across English, Hindi and Punjabi and checks:

- identical template/variant authority across locales;
- identical answer class and correct index across locales;
- Devanagari present in Hindi learner surfaces;
- Gurmukhi present in Punjabi learner surfaces;
- no cross-script contamination;
- Hindi explanations explicitly resolve निष्कर्ष I and II;
- Punjabi explanations explicitly resolve ਸਿੱਟਾ I and II;
- Punjabi answer-code options use native ਸਿੱਟਾ terminology;
- old literal ਅਨੁਸਰਣ wording is rejected;
- explanations remain concise and beginner-friendly;
- no shortcut/trap/option-elimination boilerplate;
- no duplicated conclusions;
- repeated instructions are not embedded in the stem.

## Current conventional audit state

```text
V2.2 saturation / anti-gaming:      existing authority retained
Wave 01 learner surface:            ACTIVE
Wave 02 difficulty integrity:       ACTIVE
source/content gap audit:           NO NEW QL JUSTIFIED
Wave 03 multilingual editorial:     ACTIVE
novelty:                            DEFERRED
```

The only known non-STC CI blocker at this point is a production API build failure caused by an unrelated current New-main English source syntax regression. STC-specific tests must remain strict; this audit does not weaken the production build gate or modify unrelated English content.
