# SCI Physics Multilingual V1 — CP001–CP002

Status: **REVIEW-ONLY CANDIDATE**

## Languages

- English (`en`) — frozen semantic authority
- Hindi (`hi`) — native editorial surface
- Punjabi (`pa`) — Punjabi-first native editorial surface

## Scope

This checkpoint localizes the complete Physics Exhaustive V2 semantic space for:

- `SCI-CP-001` Measurement, Units & Basic Physics
- `SCI-CP-002` Motion, Force & Laws of Motion

Each CP retains 348 semantic questions per language. Hindi and Punjabi are generated from curated native anchor surfaces rather than word-by-word translation.

## Invariants

Localization must preserve English semantic identity, CP/question family, anchor/fact identity, difficulty, source provenance, option order, correct answer index, and review-only/runtime locks.

Formulas, standard symbols and units such as `F = ma`, `kg`, `m/s`, `m/s²`, `SI` and dimensional formulae remain language-neutral.

## Explanation-quality contract

- Explanations must teach the underlying idea instead of merely repeating the correct answer.
- Each base explanation contains at least two meaningful teaching sentences.
- Explanations should add a reason, formula, relation, contrast or application where useful.
- Numerical items show the relevant relation and calculation.
- The explanation-depth gate covers all 48 anchors in all three locales and the rendered direct-question corpus.

## Punjabi-first editorial contract

Punjabi is not produced by mechanically translating Hindi vocabulary into Gurmukhi. The learner surface should read as if it was originally written for a Punjabi-medium exam candidate.

- Prefer normal Punjabi sentence structure over Hindi-shaped syntax.
- Use familiar Punjabi terms where they are natural and well understood.
- When a Sanskrit/Hindi-derived technical term sounds forced in Punjabi, prefer the familiar exam/science English term written in Gurmukhi where that is clearer, for example `ਫ੍ਰਿਕਵੈਂਸੀ`, `ਲੀਸਟ ਕਾਊਂਟ`, `ਡਾਇਮੈਂਸ਼ਨਲ ਫਾਰਮੂਲਾ`, `ਸਾਇੰਟਿਫਿਕ ਨੋਟੇਸ਼ਨ`, `ਇੰਪਲਸ` and `ਸੈਂਟ੍ਰਿਪੀਟਲ ਬਲ`.
- Keep established Punjabi science terms where they are natural, including `ਪੁੰਜ`, `ਪ੍ਰਵੇਗ`, `ਸੰਵੇਗ`, `ਜੜਤਾ` and `ਘਰਸ਼ਣ`.
- Keep `ਪੁੰਜ` (mass) distinct from `ਭਾਰ-ਬਲ` (weight).
- Use native exam instructions such as `ਬਿਆਨ`, `ਸਿਰਫ਼` and `ਸਹੀ ਉੱਤਰ ਚੁਣੋ` rather than Hindi-shaped equivalents.
- Automated guards reject known Hindi-calque terms, deprecated terminology, mass/weight conflation and known Punjabi grammar artifacts in the final rendered corpus.

## Editorial rules

- Native stems should read like real exam questions, not literal English or Hindi translations.
- Hindi uses Devanagari; Punjabi uses Gurmukhi.
- No unnecessary English prose may leak into native questions; familiar technical terms written in native script are allowed deliberately.
- Scientific symbols, formulae, standard unit abbreviations and Roman statement labels `I/II` are allowed.
- Distractors remain semantically identical to English and in the same option position.

## Capacity

- CP001: 348 English + 348 Hindi + 348 Punjabi
- CP002: 348 English + 348 Hindi + 348 Punjabi
- Native localized questions: 1,392
- Total rendered language surfaces in this checkpoint: 2,088

A 60-question balanced review selector is available per CP and per language.

## Lifecycle

This is a localization review candidate only. No Question Studio activation, Question Bank write, mock/test eligibility or learner publication is authorized before explicit human approval.
