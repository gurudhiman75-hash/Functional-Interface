# MEN-CP-007 English Editorial V2

## Status

```text
Package:                 MEN-002
Canonical problem:       MEN-CP-007 — Cubes, Cuboids & Prisms
Permanent QLs:           43
Prototype ancestries:    63
Editorial layout:        MEN-CP007-EN-EDITORIAL-V2
Editorial status:        PENDING_PRODUCT_REVIEW
Mathematical authority:  frozen and unchanged
Activation:              disabled
```

This layer addresses weaknesses found during inspection of the first 129-question permanent review pack and the later ancestry-complete artifact audit.

## Review findings

The underlying questions, exact option values, correct indices, answers, states, verifiers and distractor ownership were valid. The review identified four learner-surface issues:

1. inherited shortcuts were generated from the last worked step and sometimes repeated the standard method;
2. three random samples per permanent QL did not guarantee coverage of every merged prototype ancestry;
3. exact waste percentages could appear as awkward fractions such as `7775/234%` even though SSC-style options normally expect a compact declared approximation;
4. a few stems and formulas retained avoidable wording or typography such as `cubical`, `constant base area`, unbraced roots and non-text mathematical labels.

## Editorial correction

Every one of the 43 permanent QLs now has an explicit shortcut authority describing the fastest valid decision pattern for that learner contract.

Examples include:

- identify face versus space diagonal before choosing $\sqrt{2}$ or $\sqrt{3}$;
- convert surface evidence into one cube-face area before taking a square root;
- use the side/surface/volume power ladder for cube ratios;
- remove $2lb$ before solving a cuboid TSA inverse;
- recover the common adjacent-face area factor before using a face-area ratio;
- test the actual whole-number orientation product rather than trusting the volume quotient during packing;
- separate count, unused volume and waste percentage;
- match cost rates to length, area or volume before multiplication.

Each shortcut:

- uses a QL-specific exam rule rather than the final step title;
- includes a numerical equation from the current generated state;
- rotates among four natural deterministic openings;
- uses clean MathJax roots, powers and text labels;
- preserves the exact solver, correct index and mathematical answer authority.

## Declared waste-percentage representation

`MEN-002-QL-040` preserves its exact rational percentage internally, but the learner-facing stem now explicitly asks for the answer correct to two decimal places.

The permanent layer:

- keeps every exact option value and misconception unchanged;
- rounds all four displayed percentages deterministically to two decimal places;
- rejects any displayed-option collision;
- adds a final $\approx$ step showing exact-to-rounded conversion;
- updates all option-specific traps to the displayed decimal values;
- retains the exact rational answer for solver and verifier authority.

This is a representation policy, not a floating-point mathematical authority.

## Frozen fields

Editorial V2 cannot change:

```text
qlId
templateId
canonicalSolveMode
sourcePrototypeId
sourceSolveMode
source state and dimensions
difficulty
exact option values and order
misconception ownership
correctIndex
exactAnswer
unit
independent-verifier evidence
lifecycle metadata
```

Outside the declared QL-040 rounding representation, option displays and displayed answers remain identical to the proven source package.

## Review coverage

The final V2 review pack is ancestry-complete:

```text
63 prototype ancestries × 3 samples = 189 questions
```

Every record includes:

- permanent QL and canonical solve mode;
- source prototype, solve mode and wave;
- deterministic seed;
- four options and reviewer answer;
- independent verification;
- complete four-tier explanation;
- editorial and lifecycle status.

## Automated editorial gates

The exhaustive 3,440-package permanent proof requires:

- all 43 shortcut authorities present;
- no legacy `Quick way:` shortcut;
- four deterministic shortcut-opening styles;
- a state-specific numerical MathJax calculation in every shortcut;
- at least four distinct shortcuts for every QL;
- no repeated `giving ...` close after an equation that already contains the result;
- no thin phrases such as `This isolates`, `This finds`, or `The question asks for`;
- clean square-root, power, unit and text-label typography;
- no `cubical` or `constant base area` wording;
- an orientation floor-product equation in every QL-042 shortcut;
- declared two-decimal-place output, unique displayed options and exact $\approx$ evidence for QL-040;
- exact option-order, state, difficulty and verifier preservation;
- all 63 prototype ancestries reachable;
- all product and publication locks unchanged.

## Exact final evidence

```text
Head:       3ea63e3174af19a30ba5edb618998befa37cf3ca
Workflow:   Validate MEN-CP-007 English editorial V2
Run:        30443405687
Conclusion: PASS
Artifact:   8720419245
Digest:     sha256:66cf0a3bb2adbabdcbedecafb370cd67c14dff67c3196c403c31188b0c845ef3
```

The exact artifact contains 189 questions across all 63 prototype ancestries and 43 permanent QLs. Final artifact-level audit found zero internal-taxonomy leaks, foreign-currency symbols, malformed MathJax, legacy shortcuts, displayed-option collisions or lifecycle leaks.

## Remaining gate

The candidate remains pending explicit English approval. Mathematical freeze and a green editorial candidate do not activate Question Studio, Question Bank, tests or public publication.
