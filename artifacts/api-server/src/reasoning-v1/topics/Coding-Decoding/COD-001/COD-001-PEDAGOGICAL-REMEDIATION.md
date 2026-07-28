# COD-001 — Pedagogical Remediation Authority

Status: **implemented and executable; review-only release boundary retained**.

## Triggering audit

A senior adversarial review of the 597-item multilingual corpus confirmed that COD-001 logic, answer keys and options were sound, but identified three student-facing defects:

1. Markdown exports printed explanation objects as raw JSON.
2. Hindi and Punjabi quick methods repeated generic templates instead of showing the actual transformation in each question.
3. Letter, digit, position, sentence-code and condition-table workings lacked aligned visual presentation.

No solver, QL identity, option or correct answer required alteration.

## Remediation contract

Every generated COD-001 question now exposes `explanation.pedagogicalPresentation` with schema version `cod-001-pedagogy-v1`:

```text
coreRule
stepByStep[]
visualAlignment[]
examShortcut
commonTrap
```

Legacy explanation fields remain available for compatibility. `quickMethod` now mirrors the problem-specific `examShortcut`, and `visualAlignment` is also exposed directly on the explanation object.

## Visual-working families

The shared pedagogy layer selects working appropriate to the frozen checkpoint and solve contract:

- direct substitution: source/code and target/code alignment rows;
- alphabetic and numeric transforms: position-wise input/output rows;
- permutations: source positions, required read order and resulting sequence;
- multi-stage rules: explicit original → intermediate → final working;
- digit translation: digit-by-digit correspondence rather than whole-number arithmetic;
- renaming: the single relevant referent → assigned-label arrow;
- artificial-language coding: sentence/code evidence tables;
- conditional tables: lookup preview, baseline code and final overridden code.

## Multilingual editorial policy

- English, Hindi and Punjabi use the same frozen logic and correct option.
- Hindi and Punjabi explanations state the actual source and target transformations.
- Logic-neutral source words, Latin letters, digits, symbols and artificial code tokens remain unchanged when required by the puzzle.
- English condition metadata is translated before student presentation.
- Punjabi uses natural terms such as `ਬੇ-ਜੋੜ ਅੰਕ` and `ਜੋੜ ਅੰਕ`; standalone `ਪਦ` and `ਸਾਦ੍ਰਿਸ਼ਤਾ` remain forbidden.

## Human-review rendering

Markdown exporters no longer serialize explanation objects with `JSON.stringify`. They render four localized sections:

1. Core Rule / मुख्य नियम / ਮੁੱਖ ਨਿਯਮ
2. Step-by-Step Solution / चरण-दर-चरण समाधान / ਕਦਮ-ਦਰ-ਕਦਮ ਹੱਲ
3. Exam Speed Shortcut / परीक्षा में तेज़ तरीका / ਪੇਪਰ ਵਿੱਚ ਤੇਜ਼ ਤਰੀਕਾ
4. Common Trap Analysis / सामान्य गलती का विश्लेषण / ਆਮ ਗਲਤੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ

Visual blocks are rendered as aligned text blocks or evidence tables. JSONL exports remain machine-readable runtime objects.

## Executable proof

`review/cod-001-pedagogy-audit.test.ts` generates:

```text
199 QLs × 2 seeds × 3 locales = 1,194 questions
```

It verifies:

- all 199 permanent identities and all ten checkpoints;
- complete `cod-001-pedagogy-v1` structure;
- correct-answer or correct-set-member presence in the teaching content;
- problem-specific solution steps and visual working;
- all four localized Markdown sections;
- absence of raw JSON explanation dumps;
- absence of the rejected generic Hindi/Punjabi quick-method templates;
- absence of English endpoint-class metadata in Indic shortcuts;
- natural Punjabi terminology;
- review-only and publication safety through the existing chapter gates.

Observed diversity across the two-seed matrix:

| Locale | Shortcut variants | Visual-working variants |
|---|---:|---:|
| English | 356 | 370 |
| Hindi | 355 | 370 |
| Punjabi | 355 | 370 |

The upgraded review exporter produces:

```text
199 English + 199 Hindi + 199 Punjabi = 597 questions
raw JSON explanation dumps = 0
```

## Release boundary

This remediation improves runtime teaching content and review rendering only. It does not enable Question Studio, Question Bank conversion, mock-test eligibility, public routing or publication.
