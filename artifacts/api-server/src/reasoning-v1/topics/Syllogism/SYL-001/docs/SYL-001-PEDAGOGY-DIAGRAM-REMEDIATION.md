# SYL-001 — Pedagogy and Venn-Diagram Remediation

Status: **implemented for multilingual review; manual editorial approval still required**.

## 1. Audit findings

The V1 review runtime was logically correct but not suitable for learner-facing publication because:

1. internal model-checker language appeared in explanations;
2. witness-region dumps were presented as teaching evidence;
3. the SVG renderer placed unrelated circles side by side instead of drawing the stated relation;
4. Hindi and Punjabi copied formal-solver vocabulary too literally;
5. the explanation used canonical premise order while the displayed stem used a shuffled premise order.

The fifth issue was not in the original audit. It was discovered during remediation and could make a correct explanation appear to refer to the wrong statement number.

## 2. Remediated explanation contract

Student-facing explanations now use `syl-pedagogy-v2`:

1. **Tier 1 — Core rule and premise meaning**
   - natural-language quantifier interpretation;
   - one teaching point per displayed statement;
   - optional compact set notation as secondary support.
2. **Tier 2 — Step-by-step conclusion analysis**
   - definite, impossible or possibility-only verdict;
   - statement-linked natural reasoning;
   - no solver flags or model enumeration language.
3. **Tier 3 — Exam speed shortcut**
   - task- and premise-form-specific deduction;
   - no blanket shortcut that is unsafe outside its exact pattern.
4. **Tier 4 — Common trap**
   - natural student warning;
   - diagnostic error code stored separately for administrators.

Removed from the student contract:

- `modelEvidence`;
- `canBeTrue=true` / `canBeFalse=true` strings;
- occupied-region lists;
- witness-model terminology;
- raw SAT/model-checker language.

The formal truth profile remains in `reviewLogic` for audit and debugging only.

## 3. Diagram architecture

The V2 renderer is a focused Euler/Venn teaching renderer, not a generic row of circles.

### Relation geometries

- `ALL`: subject circle nested inside predicate circle;
- `NO`: separated circles with a crossed exclusion connector;
- `SOME`: intersecting circles with a guaranteed-member × in the overlap;
- `SOME_NOT` / `NOT_ALL`: intersecting circles with a guaranteed-member × in the subject-only region;
- `ONLY`: reversed nested inclusion;
- `ONLY_A_FEW`: one × in the overlap and another × in the subject-only region;
- `IDENTITY`: coincident/double-ring circles.

### Diagram modes

- `FORCED_WITH_FOCUS`;
- `TRUE_FALSE_COMPARISON`;
- `FORCED_AND_TRUE_FALSE_COMPARISON`;
- `EITHER_OR_COMPARISON`;
- relation-card fallback for statement sets where a single global diagram would be misleading.

A black × means a guaranteed member. An unmarked geometric overlap means only that overlap is available; it does not assert existence.

## 4. Critical changes to the proposed sample

The supplied proposal correctly demanded overlapping geometry, but its sample global diagram would overstate the facts in some questions.

For example:

```text
Some Windows are Stones.
No Stones are Books.
```

The premises force Stones and Books apart, but they do **not** force Books and Windows apart. Books may overlap the Windows-only region. Therefore V2 does not show one attractive “basic model” as though it were the only arrangement. It shows:

- the forced statement relations;
- the definite conclusion relation where relevant;
- separate “can be true” and “can be false” panels for an uncertain conclusion.

This prevents a pedagogically polished diagram from becoming a logically false proof.

## 5. Shortcut policy

The remediation does not adopt a universal “100–50 rule” label. That phrase is source-dependent and may encourage over-generalisation.

Instead, Tier 3 emits exact pattern shortcuts such as:

```text
Some A are B + No B is C => Some A are not C
Some A are B + All B are C => Some A are C
All A are B + All B are C => All A are C
All A are B + No B is C => No A is C
Only A are B => All B are A
Only a few A are B => Some A are B + Some A are not B
```

## 6. Hindi and Punjabi vocabulary lock

Rejected learner-facing vocabulary includes:

- Hindi: `मान्य व्यवस्था`, `मान्य सदस्य-क्षेत्र`;
- Punjabi: `ਮੰਨੀ ਹੋਈ ਬਣਤਰ`, `ਮੰਨੇ ਹੋਏ ਮੈਂਬਰ-ਖੇਤਰ`, `ਸਮੂਹ-ਸੰਬੰਧ ਸਬੂਤ`.

Preferred vocabulary includes:

- Hindi: `सही वेन चित्र`, `मूल नियम`, `साझा हिस्सा`, `निश्चित निष्कर्ष`;
- Punjabi: `ਠੀਕ ਵੇਨ ਚਿੱਤਰ`, `ਮੁੱਖ ਨਿਯਮ`, `ਸਾਂਝਾ ਹਿੱਸਾ`, `ਨਿਸ਼ਚਿਤ ਨਤੀਜਾ`.

The audit also verifies script integrity, explanation-structure parity and answer-index parity across `en-IN`, `hi-IN` and `pa-IN`.

## 7. Automated release gates

The chapter audit still generates:

```text
18 QLs × 80 seeds × 3 locales = 4,320 questions
```

It additionally proves:

- `syl-pedagogy-v2` on every question;
- displayed-statement/explanation order parity;
- absence of solver jargon in student-visible fields;
- relation-specific SVG geometry;
- inclusion, exclusion and existential witness markers;
- coverage of all teaching diagram modes;
- natural-language hierarchy headers in all locales;
- no return of the isolated `160/305/450` circle layout;
- product and publication gates remain closed.

The review exporter produces 108 HTML/JSONL review questions for human editorial approval.
