# Probability ML-05 — Multilingual Runtime and Parity Review

## Result

**Checkpoint status: AUTOMATED PARITY PASS / HUMAN NATIVE EDITORIAL REVIEW STILL REQUIRED.**

ML-05 adds an English-first native preview runtime for Hindi and Punjabi across the complete 216-QL Probability chapter.

The native path does not generate a second mathematical question. It takes the already generated and validated English `ProbabilityQuestion` as the sole mathematical authority and creates a language presentation overlay.

## Coverage proved

- English source QLs: 216
- PRB-001 source QLs: 120
- PRB-002 source QLs: 96
- Hindi native presentations: 216
- Punjabi native presentations: 216
- total native presentations validated: 432
- native Question Studio exposure: 0
- native public publication exposure: 0

## Runtime authority boundary

The English source remains authoritative for:

- seed;
- package and canonical-problem identity;
- QL identity;
- exam profile and option count;
- generated parameters;
- experiment model;
- event AST;
- solver result and solver evidence;
- independent verification;
- reasoning evidence;
- options;
- correct index;
- answer;
- parameter fingerprint;
- mathematical fingerprint;
- mock policy and mock eligibility.

The native overlay may replace only presentation fields:

- stem;
- event wording;
- explanation prose/guidance;
- learner-facing visual title/alt text and presentation labels;
- localized question ID;
- localized explanation ID.

## Runtime shape

`multilingual-runtime.ts` exposes two safe entry points:

1. `renderProbabilityNativePreview(source, language)`
   - accepts an already-generated valid English Probability question;
   - renders Hindi or Punjabi from the corresponding ML-03/ML-04 editorial entry;
   - refuses invalid/non-English source questions.

2. `runProbabilityNativePreview(packageId, cpId, language, input)`
   - runs the normal English package pipeline first;
   - then renders the native overlay;
   - never passes Hindi/Punjabi into the existing English production pipeline.

The Probability chapter root exports this preview runtime for review tooling, but no production Question Studio route is enabled by ML-05.

## Native IDs

Each native presentation receives a deterministic language-specific presentation ID:

- question: `<english-question-id>-hi` or `<english-question-id>-pa`
- explanation: `<english-explanation-id>-hi` or `<english-explanation-id>-pa`

The English source IDs are retained separately as `sourceQuestionId` and `sourceExplanationId`.

## Stem rendering

Native stem rendering:

1. reads the draft ML-03/ML-04 template for the exact English QL;
2. reconstructs the same render context used by the English pipeline;
3. sends each placeholder through the closed package-native binding layer;
4. rejects missing/unknown prose bindings;
5. applies the existing Probability MathJax presentation renderer;
6. runs native script and unresolved-placeholder validation.

No English fallback path exists.

## Explanation rendering

Each draft native explanation contains:

- native approach guidance;
- native working guidance;
- the exact English-authority solver equation preserved as mathematical notation;
- native key-point guidance;
- the exact English-authority final answer.

This creates a useful deterministic review surface without claiming human editorial approval.

## Visual rendering

Existing Probability teaching visuals are preserved structurally but learner-facing text is localized fail-closed.

ML-05 localizes the currently supported visual strategies:

- two-dice outcome grid;
- coin outcome tree;
- successive-draw tree;
- Venn event regions;
- standard card-deck summary;
- urn/bag composition display.

For native previews:

- titles are native;
- alt text is native;
- event labels are native;
- replacement labels are native;
- H/T coin-tree leaves are converted to native head/tail labels;
- unknown future visual strategies throw instead of exposing English text.

## Parity harness

`multilingual-runtime.test.ts` covers all 216 English QLs and both native languages.

For every QL it proves:

- English source validation passes first;
- Hindi and Punjabi native stems pass script/placeholder audits;
- native stems do not silently equal the English stem;
- options are byte-identical to English;
- answer is byte-identical to English;
- correct index is identical to English;
- parameter fingerprint is unchanged;
- mathematical fingerprint is unchanged;
- source seed and QL identity are unchanged;
- solver authority remains English;
- mock-policy authority remains English;
- native renderer does not mutate the English mathematical snapshot;
- localized question IDs are unique across 432 presentations;
- localized explanation IDs are unique across 432 presentations;
- native explanation lines pass script audits;
- native visual title/alt/event/replacement text passes native audits;
- a fresh generation with the same seed reproduces parameters, mathematics, options, answer and correct index.

## Release lock proof

ML-05 deliberately does **not** change the multilingual release manifest.

All 216 Hindi and all 216 Punjabi rows remain:

- `PENDING_NATIVE_EDITORIAL`;
- `questionStudioEnabled: false`;
- `publiclyPublishable: false`.

Direct `language: hi` / `language: pa` requests to the existing package pipelines still throw as English-only.

The existing `assertProbabilityLanguageQuestionStudioReady` guard still rejects Hindi and Punjabi.

## Automated evidence

Branch workflow run `31449831894` passed on head `a336525762b4d641da0a408f8a3ded2c87735d5e`.

Passed steps:

- ML-01 fail-closed multilingual manifest;
- ML-02 native language primitives;
- ML-03 PRB-001 native editorial draft;
- ML-04 PRB-002 native editorial draft;
- ML-05 complete multilingual runtime parity harness;
- unchanged English Probability Question Studio readiness;
- unchanged English Probability exam-readiness suite.

## Release decision

ML-05 establishes **technical cross-language parity**, not editorial approval.

Hindi/Punjabi must remain unavailable for scored Question Studio/mock delivery until ML-06 provides human review evidence and a separate multilingual freeze.

Public publication remains a later ML-07 decision.
