# Mensuration Learner Presentation Authority V1

## Authority

`MENSURATION-LEARNER-PRESENTATION-AUTHORITY-V1`

## Purpose

This authority separates mathematical/runtime correctness from the student-facing presentation layer. A Mensuration family can be engineering-complete while still requiring learner-facing remediation before Question Studio, Question Bank, mock-test, or public activation.

## Stem standard

Student stems must read like normal SSC/banking/state-exam MCQs. They must not expose generator instructions or implementation language.

Disallowed by default:

- “Leave the answer in terms of …”
- “in the simplest form” when the options already make the required form clear
- “first to second” when a natural “in the order given” or ordinary ratio wording is sufficient
- formula-selection hints such as “use the diameter form directly”
- internal policy names, solve modes, family IDs, validation language, or source notes

A numerical pi convention may be stated only when it is mathematically required to disambiguate a numerical option set, using normal exam wording such as `Take π = 22/7.` or `Take π = 3.14.` Exact-pi MCQs should let the options express the expected symbolic form rather than telling the student to “leave the answer in terms of π”.

## Mathematics rendering standard

Raw LaTeX is not acceptable on a student/reviewer surface.

Student-facing output must not visibly contain tokens such as `$...$`, `\\pi`, `\\frac`, `\\text`, or other source markup. The rendering layer must produce actual readable mathematics. A dependency-free Unicode/plain-math rendering is acceptable for simple Mensuration formulae; a correctly initialized and browser-verified math renderer is acceptable where richer notation is necessary.

String validity is not rendering proof. Review artefacts must include an explicit no-raw-LaTeX check.

## Diagram standard

A diagram is optional, not mandatory.

Show a diagram only when it contributes information needed to understand or solve the item. A generic shape, decorative outline, unlabeled line drawing, or diagram that merely repeats “sphere”, “hemisphere”, “cube”, etc. must be omitted.

When a diagram is shown it must:

1. correspond to the exact geometry in the stem;
2. contain the relevant dimensions/labels or visually necessary relationships;
3. avoid introducing extra or contradictory information;
4. remain legible on mobile;
5. pass a human visual review before activation.

Direct one-solid formula questions normally need no diagram. Composite solids, open/closed surfaces, hollow solids, inscribed figures, displacement, paths/borders, and non-obvious dimension relationships are the main diagram candidates.

## Explanation standard

Default learner explanation: **method/formula → calculation → answer**.

Target length is normally 2–4 short lines. The explanation should be sufficient to teach the step without becoming an editorial report.

The following may remain as internal metadata but must not appear as mandatory student blocks:

- Physical picture
- Governing rule as a separate prose panel
- Shortcut
- Common traps
- Option analysis / distractor misconception map
- Validation and independent-verification metadata

A shortcut or mistake note may be shown only when it adds genuine teaching value for that specific item.

## MCQ answer-form rule

Where possible, the four options should communicate the expected answer form. Do not add stem instructions solely to tell students how to format an answer in a multiple-choice question.

## Review gate

Engineering proof, option uniqueness, answer-position balance, and deterministic generation remain necessary but are not sufficient for exam readiness.

Before learner activation, the review surface must separately pass:

- exam-natural stem review;
- displayed-math review;
- diagram usefulness/correctness review;
- concise-explanation review;
- mobile visual review.

## MEN-CP-009 application

MEN-CP-009 V3 uses this authority as a student-view layer over the frozen mathematical runtime. It deliberately preserves the existing QL identities, deterministic values, answers, options, misconception metadata, and product locks while changing only learner-facing presentation.

For CP-009, direct sphere/hemisphere questions do not require diagrams, so the V3 learner review omits them rather than displaying generic geometry.

## Forward rule

MEN-CP-010, MEN-CP-012, and MEN-CP-013 must be built against this authority from the start. Existing Mensuration CPs must use this authority during learner-facing remediation before product activation.
