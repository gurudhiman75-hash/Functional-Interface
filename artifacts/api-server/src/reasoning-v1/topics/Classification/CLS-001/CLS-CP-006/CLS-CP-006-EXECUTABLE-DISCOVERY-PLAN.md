# CLS-CP-006 — Alphabet, Letter-Pair and Letter-Class Classification

Status: `OPEN_EXECUTABLE_DISCOVERY`

## Purpose

This checkpoint covers Classification questions whose displayed answer objects are single English letters or complete ordered letter-pairs. The learner must identify the option whose alphabet class or internal pair relation differs from the others.

The checkpoint does not directly ask for a position, offset, pair count, transformed token or rearranged result. Those tasks belong to Alphabet Test. It also excludes three- and four-letter cluster patterns, which remain in `CLS-CP-007`.

## Source-backed task directions

1. `FIND_ODD_LETTER` — find the single letter with a different bounded alphabet class.
2. `FIND_ODD_LETTER_PAIR` — find the complete ordered letter-pair with a different internal relation.

These are discovery hypotheses. They do not reserve permanent QLs.

## Temporary prototype wave

### Single-letter classification

1. vowel/consonant class;
2. odd/even alphabet position;
3. first-half/second-half alphabet position.

### Ordered letter-pair classification

4. exact absolute position gap;
5. exact signed position gap;
6. exact sum of alphabet positions;
7. opposite-letter-pair status;
8. vowel/consonant composition of the two positions.

The first executable wave therefore uses eight temporary prototypes. This is an architecture-establishing inventory, not a quota or frozen total.

## Canonical alphabet model

```text
A = 1, B = 2, ... Z = 26
reverse position = 27 - forward position
opposite letters satisfy forward-position sum = 27
signed pair gap = position(second) - position(first)
absolute pair gap = |position(second) - position(first)|
```

Pair order is preserved. `A–D` and `D–A` are distinct states whenever the admitted rule is direction-sensitive.

## Valid-state-first generation

```text
select temporary prototype
  -> select admitted rule
  -> select one common rule value with enough governed members
  -> select three or four distinct matching options
  -> select one controlled non-matching option
  -> place the answer deterministically
  -> independently parse the displayed options
  -> enumerate the complete compatible rule registry
  -> reject competing-answer states
  -> render explanation and lifecycle metadata
  -> emit review-only discovery candidate
```

Randomly choosing letters and inventing a relation afterwards is prohibited.

## Runtime rules

- the alphabet domain is exactly uppercase Latin `A` through `Z`;
- every letter position is calculated exactly;
- letter-pairs contain two distinct displayed letters in the initial wave;
- pair direction is preserved;
- each state supports four or five unique options;
- the independent verifier reparses displayed letters or pairs and recomputes every compatible rule;
- multiple supporting rules are allowed only when they all identify the same answer;
- arbitrary modular coincidences, letter-shape claims and ad hoc constants are excluded;
- stems and explanations must use natural exam language and never reveal internal rule IDs.

## Ambiguity model

For every compatible rule, the verifier groups the displayed options by exact rule value. A rule supports an outlier only when one value occurs once and another value occurs in every remaining option.

The question is accepted only when:

```text
- the intended rule supports the stored answer;
- at least one admitted rule supports an answer;
- every supporting rule points to the same answer index;
- no second answer is defensible under the bounded registry.
```

## Explanation contract

Every accepted question must include:

1. **Core Rule** — name the common letter class or pair relation in plain language.
2. **Check the Options** — show each letter position or pair calculation.
3. **Exam Speed Shortcut** — give an action-led screening method.
4. **Common Traps** — warn about direction, inclusive-gap confusion or vowel/consonant misclassification.

For pair questions, the explanation must show the active calculation for every option rather than merely stating that three pairs are similar.

## Difficulty features

Difficulty is derived from instance properties, including:

- single letter versus ordered pair;
- direct class lookup versus arithmetic position relation;
- direction-sensitive relation;
- size of the position gap or total;
- presence of several same-answer supporting rules;
- four versus five options;
- answer position and surface similarity.

Difficulty labels are discovered from the generated feature distribution and are not allocated per prototype in advance.

## Merge/split questions to answer

- whether all single-letter rules share one permanent outlier contract;
- whether all ordered letter-pair rules share one permanent pair-outlier contract;
- whether single-letter and pair answers require separate QLs because the answer object changes;
- whether absolute and signed gap relations remain instance variants;
- whether opposite-pair status is merely the position-sum value `27` or deserves separate source governance while sharing a QL;
- whether a source-backed reference-pair matching task exists and materially changes the solver contract;
- whether any initial rule creates repeated ambiguity that requires narrowing or removal.

## First proof target

The first gate must validate:

- deterministic replay;
- all eight temporary prototypes;
- every admitted rule;
- four- and five-option states;
- every answer position;
- Easy, Medium and Hard instances across the checkpoint;
- exact independent parsing and solving;
- complete compatible-rule ambiguity enumeration;
- no ALP-001 direct-operation leakage;
- natural stem variety;
- calculation-complete option explanations;
- JSON and Markdown review exports;
- complete lifecycle and publication locks.

## Source-gap follow-up

After the first executable wave, audit the remaining source letter-classification set for:

- prime/composite alphabet-position classes;
- reverse-position parity or half classes;
- pair parity-composition rules;
- bounded pair products or differences appearing repeatedly in exams;
- same-answer overlap with existing rules;
- any reference-pair selection form;
- rules that actually belong to CP-007 clusters, Analogy, Series, Coding-Decoding or Alphabet Test.

No additional rule or QL is admitted solely because one isolated source question can be described by it.

## Lifecycle boundary

```text
permanentQlId:              null
reviewStatus:               UNREVIEWED_DISCOVERY
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```

No Question Studio, Question Bank, test or publication integration is authorised by this checkpoint.
