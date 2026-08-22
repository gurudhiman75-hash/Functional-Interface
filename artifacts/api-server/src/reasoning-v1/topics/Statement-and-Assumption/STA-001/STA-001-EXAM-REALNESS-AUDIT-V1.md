# STA-001 Exam Realness Audit V1

Status: **REMEDIATION IMPLEMENTED / FINAL REVALIDATION PENDING**

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

## ER-001 — QL-004 prediction-template dominance

### Original blocker

QL-004 V2 was semantically correct but 25/32 Hindi stems used `उम्मीद है` and 25/32 Punjabi stems used `ਉਮੀਦ ਹੈ`, making a diverse semantic pool look template-generated.

### Implemented remediation

`localization-ql004-editorial-v3.ts` now provides a dedicated `V3_EXAM_REALNESS` stem overlay for all 32 authored variants per locale.

The V3 surface:
- preserves scenario, candidate, oracle, option and answer identity;
- removes the dominant `उम्मीद` / `ਉਮੀਦ` skeleton;
- varies claim framing using natural institutional phrasing rather than mechanical synonym swapping;
- keeps the hidden efficacy bridge unstated;
- includes a final native-language polish for constructions that were structurally valid but still sounded translated.

`localization-ql004-editorial-v3-proof.test.ts` separately proves:
- 8,192 generated Hindi/Punjabi questions;
- semantic identity outside the stem;
- anti-restatement;
- answer-position balance;
- all 16 authorities per locale;
- 32 directly authored canonical stems per locale.

**State: IMPLEMENTED; final fresh run/artifact certification pending.**

## ER-002 — four-assumption banking presentation

### Source decision

RBI Grade B 2024 Phase 1 provides direct item-level authority for a statement followed by four assumptions I-IV and five answer choices. Therefore `BANK_4X5` is a genuine presentation requirement for ExamTree's Banking scope.

### Architecture decision

The frozen English corpus is not expanded or rewritten merely to manufacture a fourth assumption. Instead:

- `exam-format-bank-fourth-assumption.ts` contains curated presentation-only fourth-assumption overlays for eight BANKING scenarios spanning all four frozen QLs;
- every overlay contains a controlled proposition with an explicit semantic opposite;
- every overlay is same-scenario and plausible but unnecessary, not a random unrelated sentence;
- English, Hindi and Punjabi candidate text and rationale are authored explicitly;
- the effective presentation scenario appends only the overlay proposition at runtime;
- the frozen scenario's hidden-dependency graph remains unchanged;
- the independent STA oracle must therefore classify the overlay candidate as `NOT_IMPLICIT` with evidence `NO_REQUIRED_DEPENDENCY`;
- generation fails if that independent rejection does not occur.

This preserves the central doctrine: the presentation layer is not allowed to hard-code the fourth candidate as wrong.

`BANK_4X5` is restored in `exam-format-extension.ts`, including label `IV`, five visible options and deterministic seeded ordering.

**State: IMPLEMENTED; full matrix revalidation pending.**

## ER-003 — five-option banking presentation

Implemented presentation profiles now cover:

- `SSC_2X4`
- `SSC_3X4`
- `BANK_2X5`
- `BANK_3X5`
- `BANK_4X5`
- `BANK_3X5_NEGATIVE`
- `PUNJAB_2X4`
- `PUNJAB_3X4`

A separate `BANK_LEGACY_2X5` renderer preserves the traditional five coded choices for two assumptions. The unresolved `either I or II` code cannot become correct unless an explicit exclusive-alternative semantic authority exists.

**State: IMPLEMENTED; full matrix revalidation pending.**

## Chapter-wide proof architecture correction

Canonical authored diversity and seeded runtime diversity are now tested separately.

The generator's deterministic hash routing can legitimately correlate scenario selection with one of two authored statement variants. Therefore a seed scan is not a valid proof that both authored variants exist.

`exam-realness-chapter-proof.test.ts` now:
- verifies all 32 authored stems per QL/locale directly from the frozen/localized authorities;
- verifies 128 distinct canonical stems per locale chapter-wide;
- independently stress-generates 32,768 localized questions;
- requires all 16 authorities per QL/locale to be reached;
- verifies answer balance, 2/3-assumption standard runtime surfaces, oracle integrity and explanation limits.

This is a proof correction, not a relaxation of content diversity.

## Final gate dimensions

Before QL-004 or the multilingual chapter can freeze, the fresh candidate must prove all of the following together:

1. two directly authored stems for every authority in every locale;
2. natural Hindi/Punjabi with no dominant QL-004 prediction skeleton;
3. implicit assumptions remain unstated after editorial rewriting;
4. same-scenario misconception distractors only;
5. neither, single, multiple and all-implicit answer patterns where semantically supported;
6. all option positions exercised under deterministic stress generation;
7. source-backed 2-, 3- and banking 4-assumption presentations;
8. both four- and five-option presentation profiles;
9. SSC, BANKING and PUNJAB_STATE profile coverage;
10. Easy, Medium and Hard coverage chapter-wide;
11. no internal QL/dependency/oracle identifiers in learner text;
12. complete but economical explanations with no full-stem repetition;
13. deterministic replay for seed + locale + presentation profile;
14. immutable English and QL-001/002/003 freeze proofs remain green;
15. canonical QL-004 review artifact includes an exact learner-content SHA-256 digest;
16. Question Studio, Question Bank, test and public-publication locks remain closed until the final multilingual chapter freeze.

## Current freeze decision

**DO NOT FREEZE QL-004 OR OPEN QUESTION STUDIO YET.**

The previously identified remediation has now been implemented. The remaining blocker is evidentiary rather than architectural: obtain one clean fresh CI run and exact review artifact for the current head, inspect the final Hindi/Punjabi V3 review surface, record approval provenance, create the immutable QL-004 freeze manifest/proof, then create the chapter-level multilingual freeze authority.
