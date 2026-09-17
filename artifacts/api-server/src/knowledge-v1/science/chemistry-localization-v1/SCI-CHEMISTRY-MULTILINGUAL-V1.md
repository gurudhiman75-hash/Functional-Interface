# SCI Chemistry Multilingual V1

Status: IMPLEMENTATION IN PROGRESS
Canonical English scope: `SCI-CP-011` through `SCI-CP-018`
Target locales: Hindi (`hi`) and Punjabi (`pa`)

## Canonical source

The approved English V2 review payloads remain the semantic source of truth. Localization must not change the tested fact, CP ownership, QL ownership, difficulty, option order, correct index, source IDs, source fact IDs, or review-only lifecycle.

## Localization contract

- Hindi and Punjabi must read like native competitive-exam science questions, not literal word-for-word translations.
- Preserve chemical formulae, symbols, equations, units, pH values, element symbols and universally used scientific abbreviations where appropriate.
- Do not leak English prose into Hindi/Punjabi stems, options or explanations except familiar scientific terms that are normally written in English/transliteration in exam usage.
- Punjabi should prefer natural Gurmukhi exam language. Avoid forced Sanskritized wording when a familiar Punjabi or standard transliterated scientific term is clearer.
- Hindi should use familiar school/competitive-exam terminology and concise sentence structure.
- Explanations remain simple and slightly explanatory; no option-by-option analysis.
- Preserve four distinct options and exactly one keyed answer.
- Preserve answer position exactly.
- Preserve question meaning even where sentence structure changes.
- Every localized question keeps a reference to its canonical English question ID.
- Runtime remains closed until multilingual QA is approved.

## Leakage gate

Native questions must not contain accidental English instructional phrases such as `Which`, `What`, `Why`, `Select`, `Correct`, `Incorrect`, `Statement`, `option`, `answer`, `because`, or English explanation sentences. Scientific names/formulae/symbols and established transliterations are exempt where appropriate.

## Wave plan

1. Wave 1 — `SCI-CP-011` Matter & Its Properties + `SCI-CP-012` Atomic Structure & Atoms/Molecules
2. Wave 2 — `SCI-CP-013` Elements/Periodic Table + `SCI-CP-014` Chemical Reactions
3. Wave 3 — `SCI-CP-015` Acids/Bases/Salts + `SCI-CP-016` Metals/Non-Metals/Metallurgy
4. Wave 4 — `SCI-CP-017` Carbon/Common Compounds + `SCI-CP-018` Everyday Chemistry
5. Final cross-CP Hindi/Punjabi parity, leakage and lifecycle audit

## Per-CP invariants

Each locale must expose the same 60 semantic questions as English:
- 10 QLs × 6 questions
- Easy 18 / Medium 30 / Hard 12
- A/B/C/D = 15 each
- identical correctIndex sequence
- identical source provenance
- review-only / runtime-closed

## Final chapter invariants

Per locale:
- 8 CPs
- 80 QLs
- 480 questions
- Easy 144 / Medium 240 / Hard 96
- answer positions A/B/C/D = 120 each
- no duplicate localized question IDs
- no English semantic drift
- no Biology (`SCI-CP-019+`) leakage
