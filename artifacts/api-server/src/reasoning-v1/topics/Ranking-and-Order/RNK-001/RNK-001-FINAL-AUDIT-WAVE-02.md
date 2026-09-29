# RNK-001 — Final Audit Wave 02

Date: 2026-09-26  
Status: **SOLVE-RELEVANT PRESENTATION REMEDIATION CANDIDATE**

## Audit target

Wave 02 inspects the actual learner-facing projection of the advanced relation families after the recovered chapter is routed through the current Question Studio architecture.

Affected permanent QLs:

```text
RNK-QL-036  relation truth status
RNK-QL-037  possible rank bound
RNK-QL-038  exact rank determinacy
RNK-QL-039  equality-aware pair relation
RNK-QL-040  equality-aware endpoint
RNK-QL-041  complete weak order
```

## Defects found

The frozen source questions were mathematically complete, but Question Studio projected only the bare `stem` field.

For CP005 the solve-relevant learner surface is structured as:

```text
instruction/setup
+ comparison clues
+ query
```

For CP006 it is:

```text
comparison clues
+ query
```

The integration omitted the separate clues, so QL036..041 could reach the review surface without the information required to solve them.

A second presentation defect affected English CP005/CP006 explanations: their source explanations are arrays of learner steps, while the old generic renderer could stringify the array into JSON-like text.

## Remediation

Wave 02 changes presentation only.

### Visible question

For QL036..038:

```text
instruction
1. clue
2. clue
...
query
```

For QL039..041:

```text
1. clue
2. clue
...
query
```

The exact frozen clue strings are preserved. No clue mathematics or relation order is rewritten by this layer.

### Explanation

Top-level explanation arrays are now rendered as normal newline-separated learner steps instead of JSON-like array text.

## Regression proof

`rnk-001-final-audit-wave-02.test.ts` generates:

```text
6 QLs
× 3 languages
× 6 generated instances
= 108 learner-facing instances
```

Every generated instance must prove:

- all solve-relevant source clues appear in the visible learner stem;
- CP005 setup/instruction is preserved where present;
- the visible stem is more than the bare query;
- explanation text is non-empty and not JSON-array syntax;
- options remain distinct with a valid frozen correct index;
- Hindi/Punjabi script remains native;
- Question Bank/test/mock/public/production locks remain closed.

## Safety boundary

Unchanged:

- permanent QL allocation;
- RNK-QL-043 status;
- frozen mathematical state;
- clue semantics;
- source options;
- correct answer/index;
- source fingerprints;
- difficulty authority;
- multilingual freeze authority;
- downstream release state.

This is a current Question Studio presentation repair, not a source-authority rewrite.

## Next

After this wave is green, continue the learner-surface audit across QL001..035 and QL042 for stem realism, explanation quality, distractor quality and difficulty calibration.
