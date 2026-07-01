# PLATFORM-INF-001 Design

## Architectural goal

Quant V4 should treat solvers, renderers, preview tooling, package discovery, content richness, and maturity classification as platform concerns. Chapters should provide math and domain-specific assets; shared infrastructure should provide stable contracts and reusable services.

## 1. Shared answer contract

Canonical answers are represented by `QuantV4CanonicalAnswer` in `shared/answers/answer-contract.ts`.

Supported kinds:

- `integer`
- `decimal`
- `percentage`
- `fraction`
- `ratio`
- `currency`
- `unit`
- `symbolic`

Design rule: MathJax/rendered display is not the canonical computational answer. It is allowed as `rendered`, while computation uses numeric fields such as `value`, `numerator`, `denominator`, `terms`, `currency`, and `unit`.

Backward adapter: `normalizeQuantV4Answer()` accepts current string/number answers and creates a canonical answer shape. MathJax strings are preserved as symbolic/rendered answers instead of being parsed for numeric meaning.

## 2. Shared MCQ option infrastructure

Option generation is centralized in `shared/answers/option-generation.ts`.

Design rules:

- Never parse rendered MathJax to compute distractors.
- Generate distractors from canonical answer values.
- Preserve caller-provided options when they already include the correct answer.
- Return `{ options, correct, canonicalAnswer }` so the preview layer does not duplicate correctness logic.

Supported output families:

- numeric, decimal, percentage, currency, and unit answers use numeric offsets formatted like the answer type;
- fraction answers mutate numerator/denominator;
- ratio answers mutate ratio terms;
- symbolic answers use safe symbolic fallbacks only.

## 3. Question Studio compatibility

`toQuestionStudioPreview()` now delegates to the shared option service and exposes a new `canonicalAnswer` field. The existing `answer` field remains unchanged.

This keeps current admin UI, exports, and chapter packages working while enabling future package authors to return canonical answer objects directly.

## 4. Package archive mechanism

Archived packages are identified by `archive.manifest.json`, reserved folder segments (`archive`, `_archive`, `archived`), or underscore-prefixed package folders.

Discovery skips archived folders before recursing, preventing nested historical runtime folders from appearing as active packages.

PCT-X now carries an archive manifest. Historical work remains in the repository and can be inspected manually.

## 5. Shared content infrastructure

New foundation libraries under `shared/content/`:

- `context.library.json`: 112 reusable exam-realistic contexts across Business, Education, Population, Agriculture, Industry, Finance, Technology, Government, Health, Transport, Retail, Sports, Environment, and Hospitality.
- `structure.library.json`: 24 reusable stem structures.
- `answer-style.library.json`: reusable answer-presentation styles.

These are not wired into existing Percentage chapters yet. They are intended for future migration and new chapter authoring.

## 6. Maturity framework

`shared/maturity/maturity-framework.ts` defines four stages:

### EXPERIMENTAL

Default state for package experiments, prototypes, and incomplete implementations.

### FOUNDATION_READY

Measurable criteria:

- solver passes;
- validator passes;
- renderer passes;
- canonical-problem coverage complete.

Duplicate rate does not block this stage.

### CONTENT_READY

Measurable criteria:

- all `FOUNDATION_READY` criteria;
- effective family threshold passes;
- duplicate threshold passes;
- context diversity threshold passes;
- structure diversity threshold passes.

Duplicate rate starts blocking here.

### PRODUCTION_READY

Measurable criteria:

- all `CONTENT_READY` criteria;
- human review complete;
- language completeness verified;
- educational quality verified;
- performance validated.

## 7. Long-term migration path

Future Quant V4 packages should return canonical answer objects directly. Existing packages can migrate gradually because the adapter accepts legacy strings/numbers. Future content authoring should draw from `shared/content/` and record context/structure IDs in traceability so maturity audits can measure diversity automatically.
