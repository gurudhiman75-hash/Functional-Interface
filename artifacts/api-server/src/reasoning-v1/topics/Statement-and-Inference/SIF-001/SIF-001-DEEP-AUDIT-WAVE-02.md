# SIF-001 — Deep Audit Wave 02

Status: **IMPLEMENTED — VALIDATION ACTIVE**

Date: 2026-09-28

## Focus

Wave 02 strengthens three areas that were previously protected only by light validation:

- difficulty integrity;
- distractor provenance;
- explanation specificity.

Novelty remains deferred to the final cross-chapter Reasoning pass.

## Finding 1 — difficulty gate was too permissive

The existing `DIFFICULTY_MATCH` gate mainly enforced a ceiling on the number of mechanisms.

That prevented obviously over-complex Easy questions, but it did not prove that a Hard authority carried genuinely greater reasoning burden.

### Added structural audit

`sif-001-deep-audit-wave2.test.ts` computes a conservative burden score from:

- number of declared facts;
- number of reasoning mechanisms;
- presence of advanced mechanisms such as contextual synthesis, conditional direction, multiple-factor reasoning, scope control or advanced paragraph reasoning;
- whether one or both candidate inferences require rejection.

The audit requires:

- Easy authorities not to exceed the simple-reasoning ceiling;
- Medium authorities to have a non-trivial structural floor;
- Hard authorities to carry a stronger structural burden.

This does not relabel authorities at runtime. It is an audit guard over the frozen authority design.

## Finding 2 — distractor plausibility needed direct chapter-wide proof

The runtime already stores a controlled `distractorType` for unsupported candidates.

Wave 02 makes that invariant explicit:

- every unsupported inference must carry a distractor type;
- every unsupported inference must still point to declared evidence/fact IDs;
- the final answer class continues to come from the structured solver rather than prose.

## Finding 3 — explanation quality was mostly a length check

The old gate required only a minimum explanation length.

Wave 02 additionally requires the learner explanation to visibly resolve the two-inference decision by either:

- explicitly discussing Inference I and Inference II; or
- explicitly stating the final answer class such as only I, only II, both, neither or either.

This prevents long but non-decisive explanation prose from satisfying the quality gate.

## Calibration note — EITHER answer class

The first structural pass under-counted `EITHER` authorities because it treated both individually unresolved candidates like two ordinary rejected distractors.

That is not the actual reasoning burden. An `EITHER` question requires the learner to recognise a mutually exclusive unresolved alternative: exactly one conclusion must hold even though neither one can be selected individually.

The burden model now adds one explicit exclusive-alternative step for `EITHER` authorities. This preserves the approved Hard classification where justified without artificially inflating ordinary ONLY_I / ONLY_II / BOTH / NEITHER cases.

## Existing strengths preserved

- Question Studio difficulty filtering is already honest: it filters frozen authorities by their actual difficulty and fails if the selected CP contains no authority at the requested band.
- No fallback or relabelling path was found.
- Answer authority remains language-independent and logic-first.
- Multilingual text remains a realization layer after semantic solving.
- release locks remain unchanged.

## Current disposition

```text
learner-surface hygiene:           CLOSED by Wave 1
novelty gate semantics:            CLOSED by Wave 1; novelty still deferred
difficulty request honesty:        PASS
difficulty structural audit:       PERMANENT GATE ADDED
distractor provenance:             PERMANENT GATE ADDED
explanation specificity:           PERMANENT GATE ADDED
broader fatigue/diversity audit:   NEXT
multilingual parity:               prior freeze remains authoritative
chapter deep-audit closure:        NOT YET
```
