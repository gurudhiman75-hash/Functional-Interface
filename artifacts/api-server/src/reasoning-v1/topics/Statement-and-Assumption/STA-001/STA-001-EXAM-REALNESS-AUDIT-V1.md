# STA-001 Exam Realness Audit V1

Status: **FREEZE BLOCKED**

Audit date: 2026-08-22

Scope: SSC, Banking, Railways-style overlap, and Punjab-state mock-test realism for Statement & Assumption, with special attention to the final Hindi/Punjabi QL-004 candidate and chapter-level presentation metadata.

## External exam benchmark evidence

The audit uses recent/current preparation surfaces plus previous-year question pages to check presentation patterns rather than to redefine STA semantics.

1. SSC CHSL 2025 Tier-1 example: short decision statement followed by two assumptions and four answer choices.
   - https://testbook.com/question-answer/read-the-given-statement-and-the-following-assumpt--6996dfa8760084d2b12f629c
2. RRB NTPC previous-year example: recommendation statement followed by two assumptions and four answer choices.
   - https://testbook.com/question-answer/consider-the-given-statement-and-decide-which-of-t--627cbd75c46ced0f27406720
3. SEBI Grade A 2022 memory-based example: two assumptions but **five coded answer choices**, including either / neither / both patterns.
   - https://testbook.com/question-answer/directionsin-each-question-below-is-given-a--5fd90eabbd25b428c35719b9
4. RBI Grade B 2024 Phase 1 previous-year example: **four assumptions I-IV and five answer choices**.
   - https://www.oliveboard.in/question-answer/pyq-in-the-question-below-there-is-a-statement-followed-by-four
5. RBI Grade B 2024 Phase 1 previous-year example: three assumptions I-III and five answer choices.
   - https://www.oliveboard.in/question-answer/pyq-in-the-question-below-there-is-a-statement-followed-by-three
6. Current 2026 cross-exam practice surface confirms Statement & Assumption remains active across SSC, banking, RRB and state exams.
   - https://www.oliveboard.in/blog/statement-and-assumption-reasoning/

## What is already strong

- Four permanent semantic QLs are stable and independently oracle-checked.
- English corpus has 64 authorities, 16 per QL, 63 semantic families, 10 neutral domains, 15 misconception classes and 7 dependency relations.
- Hindi/Punjabi QL-001, QL-002 and QL-003 are immutably frozen with semantic parity.
- QL-004 V2 has 16 authorities per locale, two review stems per authority, semantic/oracle identity parity, human explanations and no known correctness defect.
- Core answer semantics already support empty, single, multi and all-implicit answer sets across the chapter.
- Source profiles explicitly include SSC, BANKING, PUNJAB_STATE and cross-exam discovery.

## Freeze blockers found

### ER-001 — QL-004 prediction-template dominance

Current QL-004 V2 review surface has 32 stems per locale, but 25/32 Hindi stems contain `उम्मीद है` and 25/32 Punjabi stems contain `ਉਮੀਦ ਹੈ`.

This is semantically valid but editorially too uniform. It makes a 16-authority object pool feel template-generated even though the scenarios themselves are diverse.

Required remediation:
- preserve scenario / oracle / answer identity;
- diversify prediction framing by authority and statement variant;
- keep the hidden efficacy bridge implicit rather than converting it into an explicit restatement;
- re-run anti-restatement and semantic parity after the rewrite.

### ER-002 — four-assumption banking format absent from the renderer

Current core types and generator render only 2 or 3 assumptions. A real RBI Grade B 2024 question uses four assumptions I-IV.

This is a **presentation-metadata gap**, not a new semantic QL.

Required remediation:
- add an exam-format extension capable of labels I-IV;
- use only scenarios with enough independent candidate authorities or explicitly authored additional distractor authority;
- preserve the frozen QL ownership and independent oracle;
- prove that the default 2/3-assumption frozen learner surfaces do not change.

### ER-003 — five-option banking presentation absent

Current core generator always returns four visible options. Banking exams can use five coded options even when there are only two assumptions, and RBI examples can also use five options with three/four assumptions.

Required remediation:
- support 4-option SSC/state style and 5-option banking style as presentation profiles;
- preserve a single semantic correct answer;
- prevent duplicate semantic option sets and duplicate visible options;
- keep option order deterministic by seed;
- localize option display naturally in Hindi and Punjabi.

## Additional audit dimensions required before chapter freeze

1. **Canonical learner surface**: two distinct stems for every authority in every locale.
2. **Structural diversity**: no single conclusion phrase should dominate the QL-004 canonical surface.
3. **Stem length envelope**: reject bloated caselets in standard STA mode while allowing short assertion / instruction forms.
4. **Candidate plausibility**: every distractor must be same-scenario and represent a known misconception class rather than random world knowledge.
5. **Anti-restatement**: an implicit assumption must not be textually stated in the stem after editorial rewriting.
6. **Answer-pattern coverage**: chapter stress generation must exercise neither, single, multiple and all-implicit outcomes where semantically supported.
7. **Answer-position balance**: all option positions must be exercised under deterministic stress generation.
8. **Candidate-count coverage**: 2, 3 and banking 4-assumption presentations must all be generated.
9. **Option-count coverage**: 4- and 5-option profiles must both be generated.
10. **Source-profile coverage**: SSC, BANKING and PUNJAB_STATE must all be represented in canonical review and stress surfaces.
11. **Difficulty coverage**: Easy, Medium and Hard must all remain represented chapter-wide; QL-level skew is allowed when caused by genuine semantic complexity.
12. **Language naturalness**: source-wide authored-text blockers plus full canonical artifact inspection in Hindi and Punjabi.
13. **No internal leakage**: QL IDs, dependency codes, oracle codes and semantic keys must never appear in learner text.
14. **Explanation economy**: complete but human explanations; no full-stem repetition and no boilerplate lead repeated on every item.
15. **Determinism**: same seed + locale + presentation profile must reproduce the same question, candidates, options and answer.
16. **Freeze isolation**: all pre-existing English and QL-001/002/003 freeze proofs must remain green.
17. **Product locks**: Question Studio, Question Bank writes, test eligibility and public publication stay closed until the final multilingual + exam-format freeze.

## Freeze decision

**DO NOT FREEZE QL-004 OR THE MULTILINGUAL STA CHAPTER YET.**

The semantic corpus is strong, but ER-001, ER-002 and ER-003 are meaningful exam-realness gaps for the stated product scope. Resolve them, generate a fresh canonical review artifact, perform a full human audit, then record approval provenance and freeze.
