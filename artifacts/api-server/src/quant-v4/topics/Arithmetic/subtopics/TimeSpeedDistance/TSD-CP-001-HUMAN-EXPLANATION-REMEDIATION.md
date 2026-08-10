# TSD-CP-001 Human Explanation and Trivial-Question Remediation

**Checkpoint:** `TSD-CP-001 — Uniform Motion, Units and Proportionality`  
**Date:** 1 August 2026  
**Status:** implemented and executable-proof guarded  
**Permanent QLs:** 0  
**Publication:** disabled

## Learner-quality decision

Learner-facing questions must test a real decision, conversion, comparison or reconstruction. A question is not retained merely because its arithmetic is valid.

The direct-distance authority no longer exports matching-unit questions that reduce to one obvious multiplication such as speed in m/s multiplied by time in seconds. Its review states now require a genuine unit conversion before `distance = speed × time` is applied.

## Proportionality teaching sequence

Compressed proportion formulas are no longer the primary explanation route.

### `distanceByProportion`

1. Find the speed represented by the original distance and time.
2. Explain that the speed remains unchanged.
3. Multiply that speed by the new time.

### `timeByProportion`

1. Find the speed represented by the original distance and time.
2. Explain that the second journey uses the same speed.
3. Divide the new distance by that speed.

### `speedByProportion`

1. Reconstruct the distance covered in the original journey using old speed × old time.
2. State that the same distance must be covered again.
3. Divide that distance by the new time.

The requested state `TSD-CP001-DISC-019 | review:TSD-CP001-DISC-019:6` is explicitly proved to show:

- original distance = `40 × 6 = 240 km`;
- required speed = `240 ÷ 4 = 60 km/h`.

## Human-authored explanation contract

Every learner row now includes:

- a mode-aware teaching lead before substitution;
- explicit givens;
- complete intermediate reasoning;
- a final interpretation sentence;
- a mode-aware correct-option explanation;
- three wrong-option explanations that name the displayed value and diagnose the actual mistake.

The review exporter requires three different teaching openings for every learner authority. It rejects a candidate when the mathematical state or stem is new but the teaching opening has already been used for that authority.

A separate human-language layer removes residual engine phrases and varies correct and fallback option explanations by solve mode and seed.

## Executable proof

The workflow proves:

- 69 valid learner-review rows;
- three non-trivial direct-distance rows;
- nine expanded proportionality rows;
- the exact requested `DISC-019:6` calculation sequence;
- at least six learner-solution lines for every row;
- at least nine lines for each proportionality explanation;
- three distinct teaching voices per learner authority;
- 69 unique complete learner narratives;
- 69 value-specific correct-option explanations;
- 207 value-specific wrong-option explanations;
- zero residual phrases such as `compatible units`, `continuous timeline`, `required answer`, or `this option is obtained by`;
- unchanged solver, verifier, answer-key and lifecycle locks.

## Safety boundary

This remediation improves the provisional English review only. It does not freeze the English corpus, allocate permanent QL IDs, start localisation, enable Question Studio, write to Question Bank, make questions test-eligible or permit public delivery.
