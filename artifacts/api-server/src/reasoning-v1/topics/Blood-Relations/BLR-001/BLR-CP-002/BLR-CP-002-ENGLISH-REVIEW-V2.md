# BLR-CP-002 — English Review V2

Status: **first slice editorially remediated; logic green; discovery remains open**.

## Review input

- 60 deterministic records;
- five exploratory prototypes;
- fourteen scenarios;
- all five presentation forms;
- all answer positions balanced at `[15, 15, 15, 15]`.

## Logic result

The role-chain solver and generated answer contracts passed the 600-question deterministic audit:

- displayed assertion independently verified;
- every `ONLY` relation validated against the active graph scope;
- both query endpoints resolved independently;
- relation result agreed with family-graph closure;
- `SELF` used only when endpoint IDs were identical;
- four unique options and one correct answer;
- release locks preserved.

## Human-style inspection finding

The V1 pack contained one genuine presentation defect in the self-identity scenario:

```text
How is Ritu related to Ritu?
```

The hidden identity had been exposed because the pointed-person internal ID and the speaker ID were the same. This made the item trivial even though the solver was correct.

The initial photograph opening was also less natural:

```text
Pointing to a photograph of a woman ...
```

## V2 remediation

The canonical editorial layer now:

- retains contextual query labels such as `the person in the photograph` even when the hidden ID equals the speaker;
- renders `Pointing to a woman/man in a photograph`;
- uses gender-specific `herself` or `himself` in self explanations;
- teaches `ONLY` only when an only constraint is actually present;
- adds a universal possessive-role completion rule;
- states explicitly that identity collapse produces `Self` rather than a forced kinship label;
- preserves the mathematical generator and independent solver unchanged.

## V2 examples

```text
Pointing to a woman in a photograph, Simran said,
“She is the only daughter of my father.”
How is the person in the photograph related to Simran?
```

Answer: `Self`

```text
Pointing to a man in a photograph, Isha said,
“He is the son of my husband's daughter.”
How is Isha related to the person in the photograph?
```

Answer: `Grandmother`

## Automated editorial gate

The V2 gate evaluates 400 questions and rejects:

- self names exposed in both query endpoints;
- unnatural `photograph of a man/woman` openings;
- gender-neutral `herself or himself` boilerplate;
- irrelevant `ONLY` teaching;
- incomplete core-concept blocks;
- missing role-resolution trace;
- missing generation grid or `ΔGen` analysis;
- missing shortcut or option-specific distractor analysis;
- unbalanced answer positions.

## Current conclusion

The first CP-002 slice is logically and editorially ready for source widening. It is not ready for a discovery freeze because affinal breadth, exact only-child evidence, longer chains and the second source/gap audit remain incomplete.
