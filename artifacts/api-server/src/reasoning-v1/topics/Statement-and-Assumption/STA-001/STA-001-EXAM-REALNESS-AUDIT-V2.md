# STA-001 Exam Realness & Bounded Exhaustiveness Audit V2

Status: **REVIEW-READY / FREEZE BLOCKED BY EXPLICIT QL004 NATIVE PRODUCT APPROVAL**

This audit supersedes any broader wording in V1 that described every retained exam presentation profile as directly source-backed.

## 1. Audit question

Before multilingual freeze, does STA-001 behave like a serious SSC / Banking / Punjab-state Statement & Assumption chapter rather than a semantically correct but template-learnable generator?

The answer is **yes within the chapter's explicitly frozen semantic scope**, subject to the provenance qualifications and intentional deferrals below.

This is bounded exhaustiveness, not a claim that every historical Statement & Assumption presentation ever printed by every exam body is represented.

## 2. Semantic authority already locked

The audit does not reopen the four permanent QLs or the immutable English V2 corpus.

- QL001: prerequisite / existence / availability / capability / feasibility dependency
- QL002: recommendation / proposal / policy / decision with need plus feasibility / efficacy
- QL003: notice / rule / service direction with relevance plus response capability
- QL004: claim / prediction with explicit premise plus hidden causal / efficacy bridge

English V2 remains 64 authorities, 16 per QL. QL001–003 Hindi/Punjabi remain frozen.

## 3. QL004 learner-realness remediation

QL004 V2 was rejected as a final freeze candidate because too many stems shared the same prediction wording skeleton even though semantic parity was green.

V3 keeps semantic identity unchanged while removing the learner-visible template signal.

Certified V3 review authority:

- 16 QL004 authorities per locale
- 32 canonical Hindi questions
- 32 canonical Punjabi questions
- 32 unique stems per locale
- 8,192 generated V3 parity / realness cases in the dedicated gate
- 7,087 implicit anti-restatement checks
- balanced four-way answer positions in both localized surfaces
- learner digest: `sha256:ae65d8906fd644fe0062a2aa923dc7c2301608b60bdea1f7a6dcfcb326264a3b`
- status: `REVIEW_LOCKED_V3`
- native/product approval: **not yet recorded**

## 4. Chapter-wide learner realness

The chapter-wide proof generates 32,768 localized questions across QL001–004 and Hindi/Punjabi.

Required coverage:

- all 64 semantic authorities per locale across the four QLs
- 128 canonical unique Hindi stems
- 128 canonical unique Punjabi stems
- 2- and 3-assumption standard forms
- zero / one / two / all-three implicit answer cardinalities
- Easy / Medium / Hard
- SSC / Banking / Punjab-state / cross-exam source profiles
- balanced correct option positions
- no full-stem repetition inside explanations
- no internal semantic IDs / authority labels leaking into learner text
- concise explanation cap
- deterministic replay

## 5. Presentation-format breadth

Presentation metadata is kept outside permanent QL identity.

Retained deterministic profiles:

| Profile | Assumptions | Options | Provenance class |
|---|---:|---:|---|
| `SSC_2X4` | 2 | 4 | DIRECT_PYQ_FORMAT |
| `SSC_3X4` | 3 | 4 | DIRECT_PYQ_FORMAT |
| `BANK_2X5` | 2 | 5 | LEGACY_OR_FAMILY_COMPATIBLE |
| `BANK_3X5` | 3 | 5 | DIRECT_PYQ_FORMAT |
| `BANK_4X5` | 4 | 5 | DIRECT_PYQ_FORMAT |
| `BANK_3X5_NEGATIVE` | 3 | 5 | LEGACY_OR_FAMILY_COMPATIBLE |
| `PUNJAB_2X4` | 2 | 4 | DIRECT_PYQ_FORMAT |
| `PUNJAB_3X4` | 3 | 4 | CROSS_EXAM_SYNTHESIS |

### Punjab provenance correction

Direct Punjab-state previous-paper evidence has been verified for the classic 2-assumption / 4-option form.

No direct Punjab PYQ authority has yet been verified for the exact 3-assumption / 4-option form. Therefore `PUNJAB_3X4` is deliberately retained only as cross-exam-compatible synthesis and **must not be described as direct Punjab-PYQ-backed**.

`exam-format-provenance.ts` and `exam-format-provenance-proof.test.ts` make this an executable overclaim guard.

## 6. Four-assumption Banking coverage

Direct Banking evidence supports a 4-assumption / 5-option surface.

`BANK_4X5` uses eight curated presentation-only fourth-assumption overlays spanning all four QLs. The fourth candidate does not mutate the frozen semantic corpus and must independently evaluate as `NOT_IMPLICIT / NO_REQUIRED_DEPENDENCY`.

The format proof requires:

- all eight overlays reached
- all four QLs reached
- overlay shuffled through labels I–IV
- genuine implicit candidates also appearing in I–IV positions
- 4 assumptions / 5 options preserved
- deterministic replay

## 7. Anti-gaming saturation

A separate saturation gate generates 49,152 profile-specific questions:

`8 profiles × 3 locales × 2,048 cases`

It fails if a presentation profile becomes shortcut-learnable.

Per profile / locale it requires:

- broad scenario reach
- multiple correct semantic answer sets
- at least two answer cardinalities
- no correct answer set above 70% concentration
- no scenario above 70% concentration
- every visible answer position between 8% and 40%
- deterministic replay

Observed strong examples from the certification run:

- `SSC_2X4`: all four semantic answer sets reached; none / one / both reached
- `SSC_3X4`: seven distinct correct answer sets reached; one / two / all-three reached
- `PUNJAB_2X4`: all four semantic answer sets reached
- `PUNJAB_3X4` synthesis: seven distinct correct answer sets reached
- `BANK_4X5`: ten distinct correct subsets reached; largest answer-set share about 11.5%; all five answer positions balanced; all eight eligible scenarios reached

This prevents the learner from inferring the answer from a recurring exam profile, candidate count, option count, or answer-position pattern.

## 8. Legacy Banking code surface

The legacy two-assumption five-code renderer is separately proved across 3,072 questions.

It reaches:

- only I
- only II
- both
- neither

The `either I or II` correct state remains intentionally unsupported because the current frozen semantic model has no exclusive-alternative assumption authority. The renderer must not fabricate that semantic state merely because an option label exists historically.

## 9. Intentional non-fabrication boundaries

The following are **not gaps to patch by invention**:

1. `BANK_4X5` all-four-implicit verdict: not generated until a source-supported four-implicit semantic authority exists.
2. Legacy Banking `either I or II` as correct: deferred until an exclusive-alternative semantic authority exists.
3. Punjab `3X4` direct-PYQ claim: prohibited until direct Punjab evidence is found.
4. Advertising / appeal breadth: remains a separately deferred semantic expansion.
5. Comparison / measurement / representativeness: remains separately deferred rather than being hidden inside the four frozen QLs.

These boundaries make the chapter more reliable, not less exhaustive: unsupported combinations are labelled as unsupported instead of synthesized as if they were real semantic authorities.

## 10. Freeze verdict

From an engineering, semantic, editorial, exam-format, distribution, and anti-gaming perspective, STA-001 is now **review-ready for final QL004 native/product approval**.

The remaining blocker is intentionally human:

`QL004_NATIVE_PRODUCT_APPROVAL`

Until that approval is explicitly recorded:

- QL004 stays `REVIEW_LOCKED_V3`
- multilingual chapter freeze stays `false`
- Question Studio discoverability stays `false`
- Question Bank writes stay `false`
- mock/test eligibility stays `false`
- public publication stays `false`

No freeze should be created merely because the technical gates pass.
