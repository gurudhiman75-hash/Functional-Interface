# TRG-002 Real ExamTree Wrapper Validation

Date: **2026-08-16**

Result: **PASS**

## Approval boundary

The approved 48-QL English content candidate remains pinned to:

- approved content source head: `60e289ee6c89a3f595ad75038ac563daf2a5fc5f`
- approved runtime artifact id: `9259815578`
- approved artifact digest: `sha256:2e49ac250376d38fcd7fa21aa7be4d9906f9fed6d6ccc8a036dfe69bcad2788f`
- human review: **48 / 48 APPROVED**

The browser-wrapper work after that head is integration-only. It does not change the approved TRG-002 question mathematics, stems, options, explanations, difficulty or canonical solution-diagram specifications.

## ExamTree integration implemented

The real student app is `artifacts/examtree` and the real test runner is `artifacts/examtree/src/pages/test.tsx`.

TRG-002 solution diagrams now use the existing structured-explanation rendering path already used by other ExamTree diagram families:

- directive: `EXAMTREE_TRIG_HEIGHTS_SVG_V1`
- API bridge: `examtree-solution-directive.ts`
- student parser: `QuestionRichText.tsx`
- student SVG renderer: `components/math/Trg002SolutionDiagram.tsx`
- browser regression: `scripts/e2e/tests/trg002-wrapper.spec.ts`

The directive is appended only to the explanation. It is not embedded in the question stem, so solution-only diagram information remains hidden before the solution stage.

## 48-QL serialization gate

The bridge regression executes all 48 QLs and verifies:

- each final question remains valid;
- each required solution diagram exists;
- diagram + solution annotations survive exact JSON/base64url round-trip;
- the directive fits the student parser size contract;
- the directive is present in the explanation and absent from the stem;
- QL-015 retains the approved corrected depression construction.

Result: **PASS 48 / 48**.

## Real browser gate

Workflow: `.github/workflows/trg-002-mvp48-verification.yml`

Successful wrapper run:

- run: **31945456581**
- integration head: `e0480a63188327fb4a4521f0ade2efc1970557cf`
- `verify` job: **PASS**
- `browser-wrapper` job: **PASS**

The browser job uses Chromium against the built `artifacts/examtree` student application. It does not substitute the static TRG review HTML for the real test UI.

### Interaction contract verified

The Playwright test verifies the actual student flow:

1. open the ExamTree test page;
2. choose **Practice**;
3. start the test;
4. confirm no TRG solution diagram is visible before answering;
5. answer QL-015;
6. confirm the diagram is still hidden before **Show Solution**;
7. click **Show Solution**;
8. confirm the TRG-002 SVG appears in the real solution panel.

### QL-015 geometry verified in browser

The browser assertion locks the approved QL-015 treatment:

- redundant `depression-height-transfer-*` segment absent;
- useful eye-level helper present;
- useful vertical depression drop present;
- synthetic AUXILIARY point dots hidden;
- exactly two height measurement spans;
- both spans are double-headed, therefore four visible arrowheads;
- lower split-height label `20 m` present on its measurement group;
- upper height-difference label `10 m` present on its measurement group;
- both measurement spans remain outside the main construction on the taller-vertical side;
- shared endpoint is inset so the two inner arrowheads do not collapse into one another.

### Responsive check

The same rendered solution is rechecked at a **390 × 844** viewport.

Result:

- SVG remains visible;
- SVG width stays within its figure container;
- no horizontal overflow is introduced by the external height-breakup dimensions.

## Gate conclusion

The previously open real ExamTree/browser-wrapper gate is now **CLOSED — PASS**.

TRG-002 48-QL English MVP is therefore **FREEZE-ELIGIBLE** from the content + runtime + real-wrapper perspective.

This record does **not** activate or publish the chapter and does not authorize an automatic 48→96 expansion. Question Studio discovery, Test Builder eligibility, question-bank storage, public publication and Hindi/Punjabi runtime remain separate release decisions.
