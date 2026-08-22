# STA-001 Exam Realness Audit V1

Status: **REMEDIATION CERTIFIED / PRODUCT APPROVAL BLOCKED**

Audit date: 2026-08-22

Scope: SSC, Banking, Railways-style overlap, and Punjab-state mock-test realism for Statement & Assumption, with special attention to the final Hindi/Punjabi QL-004 candidate and chapter-level presentation metadata.

## External exam benchmark evidence

The audit uses current preparation surfaces plus previous-year question pages to verify presentation patterns without redefining STA semantic QLs.

1. SSC CHSL 2025 Tier-1 example: short decision statement followed by two assumptions and four answer choices.
   - https://testbook.com/question-answer/read-the-given-statement-and-the-following-assumpt--6996dfa8760084d2b12f629c
2. RRB NTPC previous-year example: recommendation statement followed by two assumptions and four answer choices.
   - https://testbook.com/question-answer/consider-the-given-statement-and-decide-which-of-t--627cbd75c46ced0f27406720
3. SEBI Grade A 2022 memory-based example: two assumptions but five coded answer choices, including either / neither / both patterns.
   - https://testbook.com/question-answer/directionsin-each-question-below-is-given-a--5fd90eabbd25b428c35719b9
4. RBI Grade B 2024 Phase 1, 8 September 2024 Shift 1 PYQ: four assumptions I-IV and five answer choices.
   - https://www.oliveboard.in/question-answer/pyq-in-the-question-below-there-is-a-statement-followed-by-four
5. RBI Grade B 2024 Phase 1, 8 September 2024 Shift 2 PYQ: three assumptions I-III and five answer choices.
   - https://www.oliveboard.in/question-answer/pyq-in-the-question-below-there-is-a-statement-followed-by-three
6. Cross-exam preparation coverage confirms Statement & Assumption remains relevant across SSC, Banking, RRB and state exams.
   - https://www.oliveboard.in/blog/statement-and-assumption-reasoning/

The later RBI item-level evidence extends the older family source audit. The earlier finding that two- and three-assumption forms are supported must not be interpreted as evidence that four-assumption banking presentation is prohibited.

## Frozen semantic authority that must not change

- Four permanent semantic QLs remain frozen.
- English corpus remains `STA-001-EN-v2-frozen`: 64 authorities, 16 per QL, 128 canonical learner questions.
- Hindi/Punjabi QL-001, QL-002 and QL-003 remain immutably `FROZEN_V2`.
- Candidate count, option count, coded answer presentation and negative wording remain presentation metadata rather than QL identity.
- No exam-format remediation may mutate the frozen 64-authority English learner corpus merely to obtain more visible assumptions.

## Certified remediation authority

Exact runtime/review source head:

`902af678a76666de765d7ad193a602e9be6cd709`

Dedicated exam-realness workflow:

`32567365948` — **SUCCESS**

Certified QL004 V3 artifact:

- artifact ID: `9474478876`;
- artifact digest: `sha256:7befb13b8c666e3f7f0919f38bbb095fbc264dcfbf44871addbbbab9bf1fe11b`;
- canonical learner digest: `sha256:ae65d8906fd644fe0062a2aa923dc7c2301608b60bdea1f7a6dcfcb326264a3b`;
- 32 Hindi + 32 Punjabi canonical questions;
- 32 unique stems per locale;
- exact learner artifact manually inspected in this audit pass;
- native/product approval remains **not recorded**.

The exact learner content is now protected by `localization-ql004-review-lock-manifest.ts` and `localization-ql004-review-lock-proof.test.ts`. This is a technical review lock, not a fabricated product approval.

## ER-001 — QL-004 prediction-template dominance

### Original blocker

QL-004 V2 was semantically correct but 25/32 Hindi stems used `उम्मीद है` and 25/32 Punjabi stems used `ਉਮੀਦ ਹੈ`, making a diverse semantic pool look template-generated.

### Certified remediation

`localization-ql004-editorial-v3.ts` provides a dedicated `V3_EXAM_REALNESS` stem overlay for all 32 authored variants per locale.

The certified V3 surface:
- preserves scenario, candidate, oracle, option and answer identity;
- removes the dominant `उम्मीद` / `ਉਮੀਦ` skeleton;
- varies claim framing using natural institutional phrasing rather than mechanical synonym swapping;
- keeps the hidden efficacy bridge unstated;
- includes a final native-language polish for constructions that were structurally valid but still sounded translated.

The exact-head V3 proof passed:
- 8,192 generated Hindi/Punjabi questions;
- 8,192 semantic-identity checks;
- 7,087 implicit anti-restatement checks;
- all 16 authorities per locale;
- 32 directly authored canonical stems per locale;
- 32 unique canonical stems per locale;
- all four answer positions exercised in each locale.

**State: CERTIFIED.**

## ER-002 — four-assumption banking presentation

### Source decision

RBI Grade B 2024 Phase 1 provides direct item-level authority for a statement followed by four assumptions I-IV and five answer choices. Therefore `BANK_4X5` is a genuine presentation requirement for ExamTree's Banking scope.

### Certified architecture

The frozen English corpus is not expanded or rewritten merely to manufacture a fourth assumption. Instead:

- `exam-format-bank-fourth-assumption.ts` contains curated presentation-only fourth-assumption overlays for eight BANKING scenarios spanning all four frozen QLs;
- every overlay contains a controlled proposition with an explicit semantic opposite;
- every overlay is same-scenario and plausible but unnecessary, not a random unrelated sentence;
- English, Hindi and Punjabi candidate text and rationale are authored explicitly;
- the effective presentation scenario appends only the overlay proposition at runtime;
- the frozen scenario's hidden-dependency graph remains unchanged;
- the independent STA oracle must classify the overlay candidate as `NOT_IMPLICIT` with evidence `NO_REQUIRED_DEPENDENCY`;
- generation fails if that independent rejection does not occur.

The exact-head matrix proof generated 12,288 profile/locale questions, including 1,536 `BANK_4X5` questions. It reached all eight overlay authorities, all four frozen QLs, all overlay labels I-IV and genuine implicit assumptions in all I-IV positions. The fourth-assumption pool spans four misconception classes: `CAUSE_EFFECT_OVERREACH`, `RELATED_BUT_IRRELEVANT`, `TOO_STRONG_QUANTIFIER`, and `VALUE_JUDGEMENT_NOT_REQUIRED`.

**State: CERTIFIED.**

## ER-003 — five-option banking presentation

Certified presentation profiles cover:

- `SSC_2X4`
- `SSC_3X4`
- `BANK_2X5`
- `BANK_3X5`
- `BANK_4X5`
- `BANK_3X5_NEGATIVE`
- `PUNJAB_2X4`
- `PUNJAB_3X4`

A separate legacy Banking two-assumption five-code renderer preserves the traditional coded choices. The exact-head legacy proof generated 3,072 questions across English/Hindi/Punjabi and all four frozen QLs. The unresolved `either I or II` code remains deliberately unable to become correct unless an explicit exclusive-alternative semantic authority exists.

**State: CERTIFIED.**

## Chapter-wide proof architecture

Canonical authored diversity and seeded runtime diversity are tested separately.

The generator's deterministic hash routing can legitimately correlate scenario selection with one of two authored statement variants. Therefore a seed scan is not used as proof that both authored variants exist.

The exact-head chapter proof passed over 32,768 localized questions and separately checked 256 canonical authored stems. It proves:
- all 16 authorities per QL/locale;
- 32 authored canonical stems per QL/locale;
- 128 unique canonical Hindi stems chapter-wide;
- 128 unique canonical Punjabi stems chapter-wide;
- 2- and 3-assumption standard-runtime coverage;
- zero/single/multiple/all-implicit answer cardinalities;
- all answer positions;
- all source profiles and Easy/Medium/Hard coverage;
- deterministic replay and oracle integrity;
- explanation ceilings with no internal leakage/full-stem repetition.

## Current freeze decision

The previous architectural and exam-realness blockers are closed. The chapter now has a machine-checked pre-freeze authority in `multilingual-pre-freeze-manifest.ts` / `multilingual-pre-freeze-proof.test.ts`.

**The only declared remaining blocker is `QL004_NATIVE_PRODUCT_APPROVAL`.**

Until that exact approval is recorded:

```text
QL004 Hindi/Punjabi:          REVIEW_LOCKED_V3
multilingual chapter freeze:  false
Question Studio:              CLOSED
Question Bank writes:         CLOSED
mock/test eligibility:        CLOSED
public publication:           CLOSED
```

After explicit approval of the exact artifact, the closure sequence is mechanical: create the immutable QL004 V3 freeze, create the final multilingual STA runtime freeze, then register STA in the shared Reasoning V1 Question Studio review registry while keeping Question Bank/test/public release locks closed for their separate release checkpoint.
