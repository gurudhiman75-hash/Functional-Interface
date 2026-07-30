# BLR-CP-003 — English Editorial Readiness V2

Status: **technical editorial gate passed; ready for human review; not approved or frozen**.

## Review pack

The V2 pack contains:

```text
32 deterministic shared-family groups
208 learner-facing item records
8 scenarios
8 family topologies
18 temporary item handles
5 review families
```

Review families:

```text
BASE_SHARED_GRAPH
EXTENDED_SHARED_GRAPH
EXPLICIT_MARITAL_STATUS
LINEAGE_AND_FOUR_GENERATION
COMPACT_JOINT_PARENT_PASSAGE
```

Answer positions in the review pack:

```text
[57, 53, 49, 49]
```

The distribution is suitable for editorial review. Permanent runtime balance will be proved separately after freeze.

## V2 remediation

Manual inspection of V1 found several learner-facing issues even though the structural test passed:

- `Which of the following pairs is married to each other?`;
- article-less facts such as `Rohit is husband of Bhavna.`;
- internal-style generation rows such as `Generation -1`;
- awkward stems such as `How is X placed relative to Y by generation?`;
- generic teaching text for gender items.

V2 remediates them to:

- `Which of the following pairs is a married couple?`;
- natural kinship articles such as `is the husband of`;
- learner rows such as `Generation 1 (oldest displayed)` and `Generation 2`;
- `What is X's generation position relative to Y?`;
- task-specific teaching for determine-gender and person-by-gender items.

The editorial gate rejects the V1 defects so they cannot silently return.

## Required record structure

Every review item contains:

1. one shared family passage;
2. one item stem;
3. four semantically unique options;
4. one correct answer;
5. two task-specific core-concept lines;
6. normalized family facts;
7. learner-facing generation rows;
8. a stepwise solution trace;
9. a direct conclusion;
10. an exam shortcut;
11. the closest misconception warning.

## Technical guarantees

All 208 records prove:

- family graph validity;
- hidden-graph and clue-only answer agreement;
- unique answer and option semantics;
- contribution of every displayed clue or explicit fact;
- stable semantic fingerprint;
- no visible internal enum tokens;
- no undefined or object-placeholder text;
- natural kinship articles;
- closed delivery and localisation gates.

## Human-review focus

Human review should assess:

- whether each shared passage reads like a natural SSC or banking exam set;
- whether repeated husband/son/daughter constructions need more wording variety;
- whether the generation-row explanation is useful without becoming verbose;
- whether pair and member-set options are visually easy to compare;
- whether maternal/paternal teaching is sufficiently clear;
- whether marital-status wording avoids closed-world assumptions;
- whether compact joint-parent wording is natural and unambiguous;
- whether distractor warnings sound human-authored rather than templated.

## Release boundary

```text
human approval recorded: no
permanent CP-003 QLs: 0
BLR-QL-009 claimed: no
Question Studio: disabled
Question Bank: disabled
mock tests: disabled
Hindi/Punjabi: not started
public publication: disabled
```

The V2 pack may proceed to human review only. Approval must be followed by any accepted remediation, deterministic reruns and a post-human source-gap confirmation before discovery freeze.
