# BLR-001 — Reasoning V1 Final Audit Wave 04

Status: **deterministic Hindi/Punjabi language defects remediated in CP-003..005; executable semantic parity remains authoritative; human language review is still required.**

## Scope

Wave 04 begins the multilingual closure pass for the checkpoints that already have Hindi/Punjabi review candidates.

The objective is not to declare machine translation "approved". It is to remove deterministic wording defects before the human language gate.

## CP-003

### Finding

Some localized stems used literal technical wording such as:

- Hindi `स्थापित माता-पिता`;
- Hindi `स्थापित दामाद/बहू`;
- Punjabi `ਸਥਾਪਿਤ ਮਾਤਾ-ਪਿਤਾ`;
- Punjabi `ਸਥਾਪਿਤ ਜਵਾਈ/ਨੂੰਹ`.

This reads like an internal logical-status translation rather than a normal competitive-exam question.

### Remediation

The affected stems now ask directly for:

- both parents;
- both people married to the couple's children.

The logical meaning and option semantics are unchanged.

A localization regression rejects the machine-like `स्थापित/ਸਥਾਪਿਤ` form.

## CP-004

### Findings

Deterministic stem issues included:

- `नामित सदस्य` / `ਨਾਮਿਤ ਮੈਂਬਰ` where ordinary "members in the given family" is clearer;
- `कितनी महिला सदस्य` / `ਕਿੰਨੀਆਂ ਮਹਿਲਾ ਮੈਂਬਰ`;
- `सबसे पुरानी पीढ़ी` and `सबसे नई पीढ़ी`;
- Punjabi `ਸਭ ਤੋਂ ਵੱਡੀ ਪੀੜ੍ਹੀ`;
- literal "named as X's relation" phrasing for relative counts;
- literal "named children" phrasing.

### Remediation

The stems now use simpler exam language:

- total members in the given family;
- number of women;
- top/bottom generation;
- number of members who have the requested relation to the reference person;
- number of children in the given family.

Count universe, answer values, options and QL ownership are unchanged.

A localized-stem regression rejects the old mechanical forms.

## CP-005

### Findings

A Hindi grammar defect existed in count-bound stems:

`... संख्या की न्यूनतम/अधिकतम संभव मान ...`

The genitive must agree with `मान`:

`... संख्या का न्यूनतम/अधिकतम संभव मान ...`

Possibility stems also used redundant wording:

- Hindi: `संभव हो सकती है`;
- Punjabi: `ਸੰਭਵ ਹੋ ਸਕਦੀ ਹੈ`.

### Remediation

The grammar is corrected and possibility stems now use the direct form:

- `कौन-सी संख्या संभव है?`
- `ਕਿਹੜੀ ਗਿਣਤੀ ਸੰਭਵ ਹੈ?`

Semantic/model-space parity is unchanged.

## What Wave 04 does not authorize

Wave 04 does not convert CP-003/004/005 from human-review candidates to multilingual-frozen corpora.

Still required:

1. human Hindi review for exam naturalness;
2. human Punjabi review for exam naturalness;
3. confirmation that relation vocabulary is consistent across the chapter;
4. explicit multilingual freeze authority after review.

## Current multilingual status

| Checkpoint | Hindi/Punjabi status after Wave 04 |
|---|---|
| CP-001 | not implemented |
| CP-002 | not implemented |
| CP-003 | executable-parity candidate; deterministic wording cleanup applied; human review required |
| CP-004 | executable-parity candidate; deterministic wording cleanup applied; human review required |
| CP-005 | executable-parity candidate; deterministic grammar/wording cleanup applied; human review required |
| CP-006 | multilingual-frozen; separate controlled editorial supersession required for learner-prompt hint cleanup |
| CP-007 | multilingual-frozen |

## Release boundary

Question Studio review remains an editorial surface only.

Still closed:

- current Question Bank admission;
- test/mock eligibility;
- learner/public delivery;
- automatic publication.

No QL or checkpoint allocation changes in Wave 04.
