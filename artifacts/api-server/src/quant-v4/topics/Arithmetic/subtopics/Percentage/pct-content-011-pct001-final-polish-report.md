# PCT-CONTENT-011 — PCT-001 Final Duplicate Polish Pass

## Scope

Edited only:

- `PCT-001/question-language.en.json`

Created this report:

- `pct-content-011-pct001-final-polish-report.md`

No solver, validator, generator, pipeline, registry, schema, runtime, renderer, Hindi, Punjabi, or explanation files were edited.

## Source audit

This pass follows `PCT-CONTENT-010`, which identified `17` exact duplicate groups across `PCT-001`, with `16` of those groups inside `PCT-CP-001` and one group inside `PCT-CP-002`.

The goal for this pass was a controlled final polish, not a broad rewrite.

## What changed

### PCT-CP-001 exact duplicate cleanup

Rewrote the duplicate member of the following exact-duplicate pairs while preserving QL IDs, placeholders, and difficulty labels:

- `PCT-QL-002` — election turnout rewritten as polling-booth turnout wording.
- `PCT-QL-102` — marks prompt rewritten as result-sheet wording.
- `PCT-QL-202` — literacy prompt rewritten as village survey wording.
- `PCT-QL-502` — defective production prompt rewritten as inspection-sheet wording.
- `PCT-QL-702` — mixture/water prompt rewritten as lab-note wording.
- `PCT-QL-802` — personal cash prompt rewritten as cash-book wording.
- `PCT-QL-902` — repeated book-discount prompt rewritten as sale-bill wording.
- `PCT-QL-1002` — repeated attendance-register prompt rewritten as attendance-sheet wording.
- `PCT-QL-1102` — repeated apple-sale prompt rewritten as fruit-stock register wording.
- `PCT-QL-1202` — repeated exam-pass prompt rewritten as result-summary wording.
- `PCT-QL-1302` — repeated alloy/copper prompt rewritten as workshop material record wording.
- `PCT-QL-1402` — repeated formula-only prompt rewritten as a worksheet wording.
- `PCT-QL-1502` — repeated fiction-books prompt rewritten as shelf-register wording.
- `PCT-QL-1702` — repeated mango-trees prompt rewritten as plantation-record wording.
- `PCT-QL-1802` — repeated water-tank prompt rewritten as supply-log wording.

### PCT-CP-001 fraction duplicate cleanup

The exact five-way duplicate phrase:

- `Write {percentageRate}% as a fraction.`

was reduced to a single survivor. These IDs were rewritten:

- `PCT-QL-703`
- `PCT-QL-903`
- `PCT-QL-1303`
- `PCT-QL-1903`

`PCT-QL-403` remains as the single direct version of that exact wording.

### PCT-CP-002 exact duplicate cleanup

Rewrote the duplicate member of the exact increase drill pair:

- `PCT-QL-210`

The original direct drill remains at `PCT-QL-010`, while `PCT-QL-210` now uses revised-value wording.

## Guardrails preserved

- All QL IDs were preserved.
- All placeholders were preserved in each edited template.
- All difficulty labels were preserved.
- JSON structure was not intentionally changed.
- This pass did not edit multilingual files or runtime logic.

## Follow-up note

This pass intentionally focused on exact duplicate removal first. Some near-duplicate families from `PCT-CONTENT-010` remain by design, especially the large CP-001 formula families and CP-006 dilution/drying families. Those are now better suited for manual review or a later optional style-diversity pass rather than another broad cleanup.

## Verification notes

Targeted searches after the edits confirmed one survivor each for these previously duplicated exact phrases:

- `Write {percentageRate}% as a fraction.`
- `If {baseValue} is increased by {percentageRate}%, find the new number.`
- `In an election, {percentageRate}% of the {baseValue} registered voters cast their votes. How many votes were cast?`

A JSON parse verification was attempted through CodexPro shell. If the Windows shell bridge still reports `spawn bash ENOENT`, run the local verification manually:

```bat
cd C:\Users\gurbaj\Downloads\f\artifacts\api-server
node -e "JSON.parse(require('fs').readFileSync('src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.en.json','utf8')); console.log('JSON OK')"
```
