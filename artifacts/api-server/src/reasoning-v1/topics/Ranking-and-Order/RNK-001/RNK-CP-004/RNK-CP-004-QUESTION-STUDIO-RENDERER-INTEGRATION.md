# RNK-CP-004 — Question Studio Renderer Integration

Status: **native explanation disclosure implemented; code-level and real-browser validation passed; manual screen-reader execution remains pending**.

## Frozen authority boundary

This integration is stacked on the immutable English discovery freeze:

```text
freeze version:       RNK_CP004_ENGLISH_DISCOVERY_FREEZE_V1
runtime version:      RNK_CP004_PERMANENT_RUNTIME_V1
permanent range:      RNK-QL-027..035
permanent questions:  1,728
projection SHA-256:   39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

No generator authority, permanent question, explanation, option or proof contract is changed by this renderer phase.

## Implemented learner surface

Question Studio now reads the structured learner contract when present:

```text
visibleExplanation.lines
visibleExplanation.answer
visibleExplanation.optionAnalysis
reviewMetadata.learnerRendererContract
```

Legacy payload compatibility remains available through:

```text
explanation.stepByStepSolution
plain-text explanation
```

The optional wrong-option teaching uses the native Radix collapsible component and starts closed unless the payload contract explicitly requests otherwise.

## Accessibility contract

The disclosure control provides:

- a native button;
- keyboard activation;
- `aria-expanded`;
- `aria-controls` linked to the disclosure region;
- a labelled `role="region"`;
- show/hide accessible labels;
- decorative icons hidden from assistive technology;
- visible focus styling.

Run-level and item-level expansion controls now also expose `aria-expanded`, matching `aria-controls`, descriptive labels and visible focus styling.

## Mobile-width contract

The renderer records and tests the required targets:

```text
360 px
390 px
430 px
```

Question stems, options, explanations and metadata use constrained containers, break-safe text and mobile-first one-column layouts. The desktop two-column question-details layout begins only at the extra-large breakpoint.

## Safety and compatibility

- raw HTML is never inserted;
- `dangerouslySetInnerHTML` is forbidden by CI;
- option objects render their `label` field instead of `[object Object]`;
- existing Quant plain-text and object explanation payloads retain fallbacks;
- generation, review permission and lifecycle controls are unchanged.

## Code-level evidence

```text
renderer and integration tests: 10 / 10 PASS
safe renderer surface:                PASS
full admin typecheck:                  PASS
production admin build:               PASS
frozen CP-004 projection:              PASS
```

Exact integration proof:

```text
head:                149a23850944c51ea1b3bfa67df94528168aba4d
workflow run:        31187904058
artifact:            8997562993
artifact digest:     sha256:a1888fba7efe511289b0b468331e5098090cf6d7a0451987d03537ea57383599
projection SHA-256:  39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

## Real-browser evidence

The production renderer component was exercised through an isolated evidence build in Chromium.

```text
exact head:          07708af23e702d7e5fe93a39419e855e7c65670b
workflow run:        31239561112
browser tests:       3 / 3 PASS
artifact ID:         9016572967
artifact SHA-256:    e1fcbdf3b92ef3da8c16d3d10366e0cd8dac9c6425043f0855863c7cc1d827aa
```

Validated behavior:

- 360, 390 and 430 px viewport targets;
- no document or body horizontal overflow before or after expansion;
- keyboard focus reaches the disclosure;
- `Enter` opens the disclosure;
- `Space` closes the disclosure;
- focus remains on the disclosure control;
- accessible label changes from `Show…` to `Hide…` and back;
- `aria-expanded` tracks the visual state;
- `aria-controls` resolves to the labelled disclosure region;
- four wrong-option teaching entries render;
- full-page screenshots are retained as evidence.

The first browser run exposed a state-bound Playwright locator, not a component defect. The component correctly changed its accessible name on expansion, so the original name-bound locator no longer matched. The test was corrected to use the stable `aria-controls` relationship while retaining assertions for both state-specific accessible names. The exact replacement head passed.

## Remaining validation

Code-level responsive/accessibility contracts and real-browser keyboard/mobile behavior are proven.

Only this renderer-accessibility gate remains open:

1. manual assistive-technology execution with both:
   - Windows + NVDA + a Chromium-based browser;
   - macOS + VoiceOver + Safari.

The canonical procedure and evidence form are recorded in:

```text
RNK-CP-004-SCREEN-READER-VALIDATION-PROTOCOL.md
```

Until both required records pass, the status must remain:

```text
PENDING_MANUAL_ASSISTIVE_TECHNOLOGY_EXECUTION
```

RNK-001 package/capability registration and payload persistence through the live generation API belong to a later, separate safety phase. They must not be used to bypass the outstanding assistive-technology gate.

## Lifecycle boundary

```text
English discovery frozen:  true
Question Studio renderer:  integrated on stacked branch
browser validation:        PASS
screen-reader validation:  PENDING MANUAL EXECUTION
RNK live generation:       disabled
Question Bank:             NOT_STORED
test eligibility:          INELIGIBLE
public publication:        false
Hindi/Punjabi:             NOT_STARTED
```
