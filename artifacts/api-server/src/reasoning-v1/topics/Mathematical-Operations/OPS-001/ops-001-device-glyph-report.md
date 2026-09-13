# ExamTree Reasoning V1 — OPS-001 Device and Glyph Report

Status: **PASS**

## Scope

The audit renders the exact approved review exports for:

- English (`en-IN`)
- Hindi (`hi-IN`)
- Punjabi (`pa-IN`)

At four viewport sizes:

```text
360 × 800
390 × 844
768 × 1024
1280 × 900
```

Every retained logical contract is inspected in every locale and viewport.

```text
31 contracts × 3 locales × 4 viewports = 372 contract-layout inspections
```

The source pages contain:

```text
English review cards: 310
Hindi review cards:   155
Punjabi review cards: 155
```

## Successful workflow

```text
Workflow: Validate OPS-001 device and glyph rendering
Run ID:   30231451914
Commit:   ea7ed318e4fd7a5ae00caffeb2e64ec69ce8e997
Result:   success
```

Artifact:

```text
Name:     ops-001-device-glyph-proof
ID:       8640285982
Digest:   sha256:c4ee37b7c3ba6683405f407993a47d0036dba34f20625614a3b737f21d7ed94a
```

## Automated checks

```text
expected review-card counts                   PASS
required mathematical glyph presence          PASS
glyph font support in Chromium                PASS
U+FFFD replacement character                  0
isolated Devanagari/Gurmukhi combining marks  0
document horizontal overflow                  0
contract-card horizontal clipping             0
empty rendered question/option/trace blocks   0
```

Required glyphs:

```text
×  ÷  −  ↔  <  >  =
```

## High-risk screenshot set

Screenshots are captured at 360px and 1280px for:

- language-adapted word operators (`OPS-CAND-005`);
- double operator interchange (`OPS-CAND-015`);
- relation-boundary relocation (`OPS-CAND-018`);
- compound operator-and-digit interchange (`OPS-CAND-027`);
- hidden mixed arithmetic/relation mapping (`OPS-CAND-034`).

## Defects found and corrected

### 1. Mobile review-shell overflow

The first real browser run found a 12-pixel horizontal overflow in the word-token explanation card at 360/390px.

Correction:

- universal `border-box` sizing;
- `min-width: 0` for card descendants;
- full-width bounds for traces and details;
- safe wrapping for long mathematical/instructional text;
- reduced ordered-list inset on narrow screens.

The unchanged audit then passed all four viewports.

### 2. Duplicate solution-step numbering

The review HTML used an ordered list and also embedded a number inside each step heading. The generated shell now removes the duplicate embedded number.

### 3. Residual English in localized distractor options

Device screenshots exposed English option fragments in:

- `OPS-CAND-017` — `Only one pair is required`;
- `OPS-CAND-026` — `no number swap`, `no operator swap`;
- `OPS-CAND-027` — `no digit interchange`, `no operator interchange`.

Correction:

- localized these fragments in Hindi and Punjabi;
- preserved mathematical tokens, option order, error labels, answer and correct index;
- expanded the residual-English test to include every option value;
- reran 3,100 localized questions successfully;
- reran this complete device/glyph audit successfully.

A focused 30-record manual-review artifact was generated for these three contracts.

## Gate verdict

```text
DEVICE_WIDTH_360                = PASS
DEVICE_WIDTH_390                = PASS
DEVICE_WIDTH_768                = PASS
DEVICE_WIDTH_1280               = PASS
MATH_GLYPH_RENDERING            = PASS
DEVANAGARI_GLYPH_INTEGRITY      = PASS
GURMUKHI_GLYPH_INTEGRITY        = PASS
RESPONSIVE_REVIEW_SHELL         = PASS
DEVICE_GLYPH_GATE               = PASS
TARGETED_OPTION_MANUAL_REVIEW   = PENDING
```

The device/glyph gate does not require a contract split. The remaining editorial blocker is manual confirmation of the corrected 30 localized option records.