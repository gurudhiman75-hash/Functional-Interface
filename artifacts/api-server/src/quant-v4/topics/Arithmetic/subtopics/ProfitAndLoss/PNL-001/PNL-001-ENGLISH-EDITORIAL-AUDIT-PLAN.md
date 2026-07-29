# PNL-001 English Generated-Question Editorial Audit Plan

## Purpose

The mathematical and standalone dynamic-runtime implementation of `PNL-001` is complete. This phase evaluates whether generated English questions read like credible human-authored SSC, banking and state-exam material.

The audit is editorial, not a new coverage-freeze exercise. It must identify generator-level defects before Hindi/Punjabi localisation or any further Question Studio integration.

## Scope

```text
CPs:                    6
QLs:                    186
Deterministic samples:  3 per QL
Review rows:            558
Language:               English
Question Studio wiring: unchanged
Question Bank writes:   disabled
```

Every QL receives three fixed review seeds. This gives full QL representation while exposing parameter-driven wording and answer variation.

## Review outputs

The automated exporter must produce:

1. `pnl-001-english-editorial-review.csv`
   - one row per generated sample;
   - full stem, options, answer and explanation;
   - CP, QL, seed, difficulty, solve mode, answer semantic, context family and representation;
   - blank reviewer columns for decision, severity, issue codes, notes and replacement text.

2. `pnl-001-english-editorial-review.md`
   - readable complete review book containing all 558 samples.

3. `pnl-001-english-editorial-metrics.json`
   - structural and editorial concentration metrics.

4. `pnl-001-english-editorial-findings.md`
   - automated blocker/warning ledger and ranked systemic findings.

## Editorial rubric

Each sample is reviewed against:

### A. Stem quality

- grammatically natural English;
- realistic commercial context and values;
- no unnecessary jargon or artificial story wrapping;
- no ambiguity about percentage base, transaction order or quantity base;
- no fact in the lead that makes a data-sufficiency statement redundant;
- concise but complete exam-style wording;
- representation rendered correctly for paragraph, table, caselet, statement, algebraic and data-sufficiency formats.

### B. Option quality

- four unique options;
- answer appears exactly once;
- distractors are plausible misconceptions, not arbitrary numerical noise;
- no fallback labels such as `Alternative 1`;
- text options are parallel in grammar and scope;
- option position does not show material bias across the corpus.

### C. Explanation quality

- explanation uses the actual generated values;
- mathematical base and commercial sequence are explicit;
- no repeated generic paragraph presented as value-specific reasoning;
- decisive calculation is visible;
- wording varies naturally across QLs and solve modes;
- no redundant restatement of the stem;
- final answer is clear and consistent with the option text.

### D. Diversity and realism

- no exact cross-QL duplicate stems;
- no semantic near-clone without distinct coverage value;
- context families are not excessively concentrated;
- each QL varies across its three seeds where the contract permits;
- repeated openings, endings and stock phrases are quantified;
- money and quantities remain commercially plausible.

## Automated blocker classes

The exporter treats these as structural blockers:

- unresolved placeholders;
- `undefined`, `NaN` or `Infinity` in visible content;
- missing/duplicate options or incorrect `correctIndex`;
- fallback `Alternative n` option text;
- empty/very short stem or explanation;
- exact cross-QL duplicate visible stems;
- invalid review-only safety metadata.

Known editorial blocker carried into this phase:

- `PNL-QL-070`: the lead currently supplies enough commercial values before its data-sufficiency statements. GitHub issue `#262` remains the authority until corrected and regression-tested.

## Automated warning classes

Warnings do not claim mathematical incorrectness. They direct human review:

- same-QL repeated stem across review seeds;
- same answer across all three samples;
- normalised cross-QL stem clones;
- repeated explanation opening or closing sentence;
- repeated generic working paragraph;
- unusual stem/explanation length;
- context-family concentration;
- correct-option position imbalance;
- overuse of generic nouns such as `article`, `trader` or `shopkeeper`.

## Decision vocabulary

Reviewer decision:

- `APPROVE`
- `APPROVE_WITH_MINOR_EDIT`
- `REVISE_GENERATOR`
- `REVISE_EDITORIAL_TEMPLATE`
- `REVISE_OPTIONS`
- `REVISE_EXPLANATION`
- `REJECT_QL_CONTRACT`

Severity:

- `BLOCKER`
- `MAJOR`
- `MINOR`
- `NOTE`

Corrections should normally be made at generator, editorial-template, option-builder or explanation-strategy level. Editing one exported sample is evidence for a fix, not the fix itself.

## Phase sequence

1. Generate and audit all 558 English samples.
2. Review automated findings and rank systemic defects.
3. Correct blocker and high-frequency generator/template defects CP by CP.
4. Regenerate the same deterministic corpus and compare before/after results.
5. Record human reviewer decisions.
6. Freeze English editorial readiness only when blockers are zero and major findings are accepted or corrected.

No Hindi/Punjabi runtime work and no new Question Studio wiring is part of this branch.