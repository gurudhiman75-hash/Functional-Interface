# RNK-CP-007 — Hindi/Punjabi Native Editorial Review Candidate V2

Status: **EXECUTABLE REVIEW CANDIDATE — HUMAN LANGUAGE REVIEW REQUIRED — NOT MULTILINGUAL FROZEN**

Date: 2026-08-14

## Why V2 exists

The merged V1 localization candidate proved semantic parity but was not suitable for multilingual freeze. Manual editorial inspection found systematic native-language grammar defects:

1. category and whole-group labels were inserted in direct/nominative form before Hindi/Punjabi postpositions, producing forms such as `लड़के में से` instead of `लड़कों में से`;
2. the `COMPACT_RATIO` lane produced incomplete rank sentences such as `ऊपर से 12वें है` / `ਉੱਪਰੋਂ 12ਵੇਂ ਹੈ`;
3. the `ORDER_OF_MERIT` question used unnecessarily mechanical constructions equivalent to `रहने वाले` / `ਰਹਿਣ ਵਾਲੇ`.

V1 remains historical machine-parity evidence. **V2 supersedes V1 as the human-language review candidate.**

## Canonical source is unchanged

```text
English authority:        RNK_CP007_ENGLISH_FREEZE_V1
permanent runtime:        RNK_CP007_PERMANENT_RUNTIME_V1
permanent QL:             RNK-QL-042
English question count:   192
English projection:       sha256:44aefb019c1a55308b58f4b285b1b6f7df97dea0185652d6de73e2dafbbd446b
```

No English stem, option, answer, state, solver, QL identity, mathematical fingerprint or permanent runtime fingerprint is changed by V2.

## V2 remediation

The V2 learner renderer adds explicit native oblique/plural handling for every CP007 partition label before postpositions and genitive constructions.

Examples of protected transformations include:

```text
Hindi
लड़के -> लड़कों
लड़कियाँ -> लड़कियों
विद्यार्थी -> विद्यार्थियों
अभ्यर्थी -> अभ्यर्थियों
प्रशिक्षु -> प्रशिक्षुओं
प्रतिभागी -> प्रतिभागियों
कर्मचारी -> कर्मचारियों
आवेदक -> आवेदकों
परीक्षार्थी -> परीक्षार्थियों

Punjabi
ਮੁੰਡੇ -> ਮੁੰਡਿਆਂ
ਵਿਦਿਆਰਥੀ -> ਵਿਦਿਆਰਥੀਆਂ
ਉਮੀਦਵਾਰ -> ਉਮੀਦਵਾਰਾਂ
ਸਿਖਿਆਰਥੀ -> ਸਿਖਿਆਰਥੀਆਂ
ਭਾਗੀਦਾਰ -> ਭਾਗੀਦਾਰਾਂ
ਕਰਮਚਾਰੀ -> ਕਰਮਚਾਰੀਆਂ
ਅਰਜ਼ੀਦਾਰ -> ਅਰਜ਼ੀਦਾਰਾਂ
ਪਰੀਖਿਆਰਥੀ -> ਪਰੀਖਿਆਰਥੀਆਂ
```

Compound labels are handled by inflecting their final learner noun, so labels such as Section A students, first-year students and List A qualifiers remain structurally intact.

The compact-ratio lane now uses complete rank phrasing:

```text
Hindi:   ऊपर से Nवें स्थान पर है
Punjabi: ਉੱਪਰੋਂ Nਵੇਂ ਸਥਾਨ 'ਤੇ ਹੈ
```

The merit-order question asks directly for the requested category count and removes the mechanical `रहने वाले` / `ਰਹਿਣ ਵਾਲੇ` construction.

## Candidate inventory

```text
Hindi review candidates:       192
Punjabi review candidates:     192
total localized candidates:    384
modes:                            4 x 48 per locale
surface styles:                   4 x 48 per locale
answer positions:                48 / 48 / 48 / 48 per locale
difficulty:                     144 Medium / 48 Hard per locale
new QLs allocated:                0
next available QL:              RNK-QL-043
```

## Executable V2 grammar gates

The dedicated V2 test additionally rejects:

- the known incomplete compact-rank forms;
- known direct/nominative category forms before `में से` / `ਵਿੱਚੋਂ`;
- the rejected mechanical merit-order phrase;
- any partition label that lacks a defined native oblique/plural transformation.

It also re-proves exact semantic parity with frozen English for all 384 localized records and rechecks the English projection pin.

## Human review pack

`cp007-localization-review-export-v2.ts` produces a balanced 64-question V2 pack:

```text
Hindi:    32 questions
Punjabi:  32 questions
```

There are two questions for every `mode × surface-style` cell. The generated pack is uploaded by the V2 workflow so the actual learner surface can be inspected after CI.

## Lifecycle

```text
English frozen:                  true
Hindi/Punjabi machine parity:    EXECUTABLE_PROVED after CI
Hindi/Punjabi human review:      REQUIRED
multilingual freeze:             false
RNK-QL-043 allocated:            false
Question Studio:                 DISABLED
persistence:                     DISABLED
Question Bank:                   NOT_STORED
test eligibility:                INELIGIBLE
public publication:              false
product delivery unlocked:       false
```

A successful V2 machine gate does not itself authorize multilingual freeze. The actual V2 review artifact still requires human-language editorial inspection and explicit approval before a freeze record can be created.
