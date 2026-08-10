# PRB-002 ML-04 Native Editorial Review

## Scope

ML-04 adds a complete **draft** Hindi/Punjabi editorial layer for all 96 PRB-002 English QLs.

- Hindi draft entries: 96
- Punjabi draft entries: 96
- Total native draft entries: 192
- Curated wording families: 30

The 30 families cover:

- 8 successive-draw / replacement families;
- 6 conditional-probability families;
- 8 counting, committee, arrangement and number-formation families;
- 8 event-algebra families covering union, intersection, mutually exclusive events, independence, exactly-one, neither and reverse intersection.

## Authority and safety

Every native entry preserves the English:

- `qlId`;
- source stem-template ID;
- context family;
- exact placeholder contract;
- generated numerical values;
- solver output;
- options and correct-option index;
- mock-family and difficulty authority.

Every native entry remains:

- `DRAFT_NATIVE_EDITORIAL_REQUIRES_HUMAN_REVIEW`;
- `answerKeyAuthority: ENGLISH_RUNTIME`;
- `optionPolicy: PRESERVE_ENGLISH_OPTIONS_AND_CORRECT_INDEX`;
- `questionStudioEnabled: false`;
- `publiclyPublishable: false`.

The release manifest remains `PENDING_NATIVE_EDITORIAL` for Hindi and Punjabi.

## Dynamic prose binding

ML-04 localises the currently generated PRB-002 prose bindings for:

- `passed Mathematics`;
- `passed English`;
- `shortlisted`;
- `certified`;
- `TOGETHER`;
- `APART`.

Numbers, exact fractions and probability expressions remain language-neutral. Unknown string bindings throw rather than falling back to English.

## Banking / advanced profile preservation

PRB-002 is the advanced Probability package. ML-04 does not change its English mathematical runtime or its exam profile. In particular:

- conditional sample-space restrictions are preserved;
- with/without-replacement dependence is preserved;
- combination/permutation reasoning is preserved;
- event-algebra notation such as `P(A)`, `P(B)`, `P(A ∩ B)` and `P(A ∪ B)` is preserved;
- English-generated options and the correct index remain authoritative;
- no Banking Mains or other native mock exposure is enabled at this checkpoint.

## Validation

Probability multilingual workflow run `31411657904` passed on ML-04 head `8da47ad1e5f8fd71d4c997ee00c8db56cc016576`.

It passed:

- ML-01 fail-closed multilingual manifest validation;
- ML-02 native primitive validation;
- ML-03 PRB-001 native editorial validation;
- ML-04 96/96 Hindi coverage;
- ML-04 96/96 Punjabi coverage;
- exact placeholder parity against every English PRB-002 stem;
- native-script validation for stems, event wording and explanation guidance;
- closed conditional/relation binding samples;
- zero native Question Studio exposure;
- zero native public publication exposure;
- unchanged English Probability Question Studio and exam-readiness suites.

## Release decision

**ML-04 is draft-complete but not release-approved.**

No Hindi/Punjabi Probability question may be delivered in Question Studio or scored mocks until the later multilingual runtime/parity work and human editorial freeze are complete.
