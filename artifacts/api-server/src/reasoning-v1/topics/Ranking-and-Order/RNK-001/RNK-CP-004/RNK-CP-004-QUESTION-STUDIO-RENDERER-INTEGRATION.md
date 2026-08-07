# RNK-CP-004 — Question Studio Renderer Integration

Status: **native explanation disclosure implemented and code-level validation passed; real-browser visual and assistive-technology QA remains pending**.

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

## Executable evidence

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

## Remaining validation

Code-level responsive and accessibility contracts are proven. The following remain deliberately open:

1. screenshot or visual-regression checks in a real browser at 360, 390 and 430 px;
2. manual keyboard traversal in the deployed Question Studio page;
3. screen-reader checks with NVDA/JAWS/VoiceOver;
4. RNK-001 package/capability registration and payload persistence through the live generation API.

## Lifecycle boundary

```text
English discovery frozen:  true
Question Studio renderer:  integrated on stacked branch
RNK live generation:       disabled
Question Bank:             NOT_STORED
test eligibility:          INELIGIBLE
public publication:        false
Hindi/Punjabi:             NOT_STARTED
```
