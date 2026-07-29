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

This layer addresses weaknesses found during inspection of the first 129-question permanent review pack.

## Review finding

The underlying questions, options, answers, exact states, verifiers and distractor explanations were valid. However, the inherited shortcut layer was generated from the last worked step. Several shortcuts therefore repeated the normal calculation instead of giving a genuine exam-speed decision rule.

The first review exporter also selected three random examples per permanent QL. That could omit one or more merged prototype ancestries from human review.

## Editorial correction

Every one of the 43 permanent QLs now has an explicit shortcut authority describing the fastest valid decision pattern for that learner contract.

Examples of the policy include:

- identify face versus space diagonal before choosing $\sqrt{2}$ or $\sqrt{3}$;
- convert surface evidence into one cube-face area before taking a square root;
- use the side/surface/volume power ladder for cube ratios;
- remove $2lb$ before solving a cuboid TSA inverse;
- recover the common adjacent-face area factor before using a face-area ratio;
- treat the volume quotient only as an upper bound during rotation-aware packing;
- separate count, unused volume and waste percentage;
- match cost rates to length, area or volume before multiplication.

Each shortcut:

- uses a QL-specific exam rule rather than the final step title;
- includes a numerical equation from the current generated state;
- states the current answer;
- varies its natural opening deterministically;
- uses clean MathJax roots, powers and text labels;
- never changes the solver, options, correct index or exact answer.

## Frozen fields

Editorial V2 is prohibited from changing:

```text
qlId
templateId
canonicalSolveMode
sourcePrototypeId
sourceSolveMode
source state and dimensions
difficulty
options
correctIndex
answer
exactAnswer
unit
independent-verifier evidence
lifecycle metadata
```

The layer may improve only learner-facing English stem typography and the four explanation blocks.

## Review coverage correction

The V2 review pack is ancestry-complete:

```text
63 prototype ancestries × 3 samples = 189 questions
```

The exporter forces each approved ancestry through its frozen permanent QL instead of relying on random selection.

Every review record includes:

- permanent QL and canonical solve mode;
- source prototype, solve mode and wave;
- deterministic seed;
- options and reviewer answer;
- independent verification;
- complete four-tier explanation;
- editorial and lifecycle status.

## Automated editorial gates

The exhaustive 3,440-package permanent proof now also requires:

- all 43 shortcut authorities present;
- no legacy `Quick way:` shortcut;
- four deterministic shortcut-opening styles;
- a state-specific numerical MathJax calculation in every shortcut;
- at least four distinct shortcuts for every QL;
- no thin phrases such as `This isolates`, `This finds`, or `The question asks for`;
- clean square-root and text-label typography;
- option, answer, exact-state and verifier equality with the frozen source package;
- all 63 prototype ancestries reachable;
- all product/publication locks unchanged.

## Remaining gate

The 189-question pack remains pending product review. Mathematical freeze does not imply editorial approval or product activation.
