# RNK-CP-004 — Screen-Reader Validation Protocol

Status: **PENDING_MANUAL_ASSISTIVE_TECHNOLOGY_EXECUTION**

This protocol is the final renderer-accessibility gate for the frozen `RNK-001 / RNK-CP-004` learner explanation disclosure. It records exactly what a human tester must verify before any screen-reader approval may be claimed.

Automated browser checks are already green, but automated DOM and ARIA assertions are not a substitute for listening to the control with real assistive technology.

## Frozen safety boundary

```text
freeze version:       RNK_CP004_ENGLISH_DISCOVERY_FREEZE_V1
runtime version:      RNK_CP004_PERMANENT_RUNTIME_V1
permanent range:      RNK-QL-027..035
permanent questions:  1,728
projection SHA-256:   39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

The following lifecycle states must remain unchanged throughout this test:

```text
RNK live generation:       DISABLED
Question Bank storage:     NOT_STORED
test eligibility:          INELIGIBLE
public publication:        false
Hindi/Punjabi:             NOT_STARTED
```

## Automated prerequisite already satisfied

Exact browser-evidence head:

```text
head:          07708af23e702d7e5fe93a39419e855e7c65670b
workflow run:  31239561112
browser tests: 3 / 3 PASS
artifact ID:   9016572967
artifact SHA:  e1fcbdf3b92ef3da8c16d3d10366e0cd8dac9c6425043f0855863c7cc1d827aa
```

The Chromium proof covers 360, 390 and 430 px, horizontal overflow, keyboard focus, Enter/Space activation, `aria-expanded`, `aria-controls`, labelled-region linkage and four rendered wrong-option explanations.

## Required manual test environments

At least these two combinations must pass:

1. **Windows + NVDA + Chromium-based browser**
2. **macOS + VoiceOver + Safari**

A JAWS run is recommended when available, but it is not a substitute for either required combination.

Record exact versions for the operating system, screen reader and browser. Do not write only `latest`.

## Test target

Use the isolated evidence page built with:

```text
VITE_RNK_CP004_RENDERER_E2E=true
```

Target path:

```text
/admin/rnk-cp004-renderer.html
```

The page must use the repository's real `QuestionExplanationDisclosure` component. A copied HTML mock is not acceptable evidence.

## Manual procedure

### 1. Initial reading order

Start at the top of the page and move through content using normal screen-reader reading commands.

Expected order:

1. evidence-page heading;
2. question stem;
3. four answer options in order;
4. explanation steps;
5. recorded answer;
6. disclosure button.

Pass only when the content is understandable without relying on visual position.

### 2. Collapsed disclosure state

Move focus to the disclosure button using `Tab`.

Required observations:

- the element is announced as a button;
- its accessible name communicates `Show why the other options are wrong`;
- its collapsed state is announced or otherwise exposed by the screen reader;
- focus is visibly present for a sighted keyboard user;
- the four hidden wrong-option explanations are not read as ordinary page content while collapsed.

### 3. Open with Enter

Activate the focused button with `Enter`.

Required observations:

- focus remains on the same control;
- the expanded state is announced or exposed;
- the accessible name changes to `Hide why the other options are wrong`;
- the controlled content becomes available immediately after the button;
- there is no duplicate button announcement and no unexpected focus jump.

### 4. Read expanded content

Move into the expanded region using normal reading commands.

Required observations:

- the region has a meaningful label: `Why are the other options wrong?`;
- four list items are announced;
- each option analysis is read once and in the same order as rendered;
- punctuation and ranking symbols remain understandable;
- no raw object text, code, ARIA IDs or decorative icon names are announced.

### 5. Close with Space

Return focus to the disclosure button and activate it with `Space`.

Required observations:

- focus remains on the button;
- collapsed state is announced or exposed;
- the accessible name returns to `Show why the other options are wrong`;
- the hidden list is no longer reachable through ordinary reading order.

### 6. Reverse traversal and repetition

Use `Shift+Tab`, then `Tab`, and repeat one open/close cycle.

Pass only when:

- focus order is stable;
- no duplicate focus stop appears;
- the control remains operable after repeated state changes;
- announcements stay consistent.

## Mandatory failure conditions

Any one of these blocks approval:

- unlabeled or ambiguously labelled disclosure control;
- button role not announced;
- collapsed/expanded state unavailable to the screen reader;
- focus loss or unexpected focus movement;
- hidden option analysis read while collapsed;
- expanded content unreachable;
- repeated or duplicate announcements that materially confuse the user;
- wrong reading order;
- decorative chevron announced as meaningful content;
- raw `[object Object]`, implementation IDs or unsafe HTML announced;
- Enter or Space fails to toggle the control;
- evidence collected from a mock instead of the production component.

## Evidence record

Complete one record per environment.

```text
Tester name:
Test date and time:
Commit SHA:
Build or preview identifier:
Operating system and version:
Screen reader and version:
Browser and version:
Viewport or zoom setting:
Initial reading order: PASS / FAIL
Collapsed-state announcement: PASS / FAIL
Enter expansion: PASS / FAIL
Expanded-region reading: PASS / FAIL
Space collapse: PASS / FAIL
Reverse traversal and repetition: PASS / FAIL
Overall result: PASS / FAIL
Defect links:
Transcript or detailed notes:
Optional audio/video evidence:
```

## Approval rule

The gate may move to `MANUAL_ASSISTIVE_TECHNOLOGY_PASS` only when:

- both required environment records are complete;
- every mandatory check passes;
- any discovered defects have been fixed and retested at the exact replacement head;
- the frozen projection digest still matches;
- RNK generation, storage, test eligibility and publication remain disabled.

Until then, the correct status is:

```text
PENDING_MANUAL_ASSISTIVE_TECHNOLOGY_EXECUTION
```

## Standards basis

The control follows the WAI-ARIA Authoring Practices disclosure pattern: a button toggles controlled content, `Enter` and `Space` activate it, and `aria-expanded` represents the current state. `aria-controls` links the button to the controlled content. The automated proof verifies those code-level properties; this protocol verifies how they are actually conveyed by screen readers.
