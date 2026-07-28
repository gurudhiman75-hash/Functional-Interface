# CLS-CP-001 — Semantic Word and Entity Classification: Executable Discovery Plan

Status: `READY_FOR_NON_QL_PROTOTYPE_IMPLEMENTATION`

Checkpoint ownership hypothesis: curated semantic single-item classification where three displayed entities share the intended class/property and one is the unique outlier, plus the inverse task of selecting another member of a supplied class when the solver topology justifies it.

This plan creates no permanent QL and does not freeze the checkpoint inventory.

---

## 1. Objective

Establish the semantic classification foundation needed to answer one central question reliably:

> Given a displayed option set, can ExamTree prove that exactly one option is the intended semantic outlier and that no competing curated class makes a different option equally defensible?

The first wave must reveal architecture and coverage gaps rather than optimise for question count.

---

## 2. Temporary prototype policy

All first-wave contracts use temporary identifiers:

```text
CLS-CP001-PROT-001 ...
```

Temporary identities may be renamed, merged or removed freely. They must never appear in student text or central Question Studio discovery.

A prototype is retained only when it proves a materially distinct task/solver contract. Dataset categories alone do not justify separate permanent QLs.

---

## 3. First-wave candidate contracts

The following are implementation candidates, not a frozen list.

### Candidate A — Direct category outlier

Three entities belong to one explicit curated category; one does not.

Examples of safe domains:

- fruits versus vegetables;
- metals versus non-metals where exam convention is stable;
- indoor versus outdoor games where classification is curated carefully;
- rivers versus mountains;
- musical instruments versus non-instruments;
- occupations versus institutions.

Task: `FIND_OUTLIER`.

### Candidate B — Functional-use outlier

Three objects share a primary controlled use/function; one has a different primary function.

Task: `FIND_OUTLIER`.

Risk: many objects have multiple uses. Only entities with reviewed primary-function evidence are admitted.

### Candidate C — Part/whole or system membership outlier

Three entities are parts/components of one controlled whole/system; one is not.

Task: `FIND_OUTLIER`.

Risk: broad part-of relations can create alternate groupings. Whole/system identity must be explicit in metadata.

### Candidate D — Habitat/environment outlier

Three organisms share one curated habitat/environment class; one does not.

Task: `FIND_OUTLIER`.

Risk: animals can occupy multiple habitats. Multi-habitat records require strict exclusion or are rejected.

### Candidate E — Source/material/product outlier

Three entities share a stable source/material/product class; one differs.

Task: `FIND_OUTLIER`.

Risk: product supply chains and materials can be multiple or context-dependent. Use only conventional exam facts.

### Candidate F — Place/institution type outlier

Three named or generic entities share one stable place/institution type; one differs.

Task: `FIND_OUTLIER`.

Risk: named places may change status over time. Prefer stable generic types or versioned historical facts.

### Candidate G — Unit/quantity semantic outlier

Three units measure one quantity or share one unit family; one belongs to another.

Task: `FIND_OUTLIER`.

Boundary: dimensional calculation belongs to Quant/Science; this prototype tests semantic unit classification only.

### Candidate H — Select another class member

A supplied seed group establishes one semantic class; exactly one option belongs to the same class.

Task: `SELECT_CLASS_MEMBER`.

Open merge question: this may be an inverse presentation of the same class-membership authority rather than a separate permanent QL.

### Candidate I — Controlled attribute outlier

Three entities share one reviewed stable attribute such as natural/man-made, living/non-living, renewable/non-renewable, or state/category membership; one does not.

Task: `FIND_OUTLIER`.

Risk: attribute granularity and curriculum convention require explicit governance.

### Candidate J — Multi-label intersection outlier

Three entities share an intersection of two curated properties, while the fourth satisfies only one or neither.

Task: `FIND_OUTLIER`.

This is a later first-wave extension, not the starting implementation. It is admitted only after single-class ambiguity auditing is stable.

---

## 4. Semantic dataset foundation

### 4.1 Entity record

```ts
type SemanticEntityRecord = {
  entityId: string;
  labels: {
    en: string;
    hi?: string;
    pa?: string;
  };
  aliases?: {
    en?: string[];
    hi?: string[];
    pa?: string[];
  };
  classes: SemanticMembership[];
  attributes: Record<string, string | string[] | boolean>;
  reviewStatus: 'CURATED' | 'REVIEWED';
  sourceNotes: string[];
  localeNotes?: Record<string, string>;
};
```

### 4.2 Membership record

```ts
type SemanticMembership = {
  classId: string;
  strength: 'PRIMARY' | 'SECONDARY';
  direction?: string;
  validFrom?: string;
  validTo?: string;
  evidenceStatus: 'STABLE_CONVENTION' | 'REVIEWED_FACT';
};
```

Only `PRIMARY` membership should be used for foundational easy questions unless a prototype explicitly studies multi-label ambiguity.

### 4.3 Class record

```ts
type SemanticClassRecord = {
  classId: string;
  labels: {
    en: string;
    hi?: string;
    pa?: string;
  };
  parentClassIds: string[];
  siblingClassIds: string[];
  memberEntityIds: string[];
  exclusionEntityIds?: string[];
  ambiguityNotes?: string[];
  version: string;
};
```

Parent/sibling information is required to audit broad versus narrow classes.

---

## 5. Valid-state construction

For `FIND_OUTLIER`:

1. choose one reviewed class `R`;
2. select three positive members with comparable surface form;
3. select one outlier from a reviewed sibling or contrast class;
4. reject duplicate labels and obvious formatting giveaways;
5. evaluate all four against `R`;
6. enumerate other eligible classes represented in the state;
7. reject if another natural class creates a different unique outlier;
8. shuffle deterministically;
9. render and explain.

For `SELECT_CLASS_MEMBER`:

1. choose a reviewed class `R`;
2. select two or three seed members;
3. select one positive candidate;
4. construct three near-class negatives;
5. reject if more than one candidate shares `R` or if another class better explains the seed group;
6. shuffle and render deterministically.

---

## 6. Canonical solver

The canonical solver receives normalized displayed entity IDs and the declared eligible semantic class registry.

For direct outlier:

```text
find classes satisfied by exactly three options
  -> rank classes by source-backed simplicity and specificity
  -> require one unique winning class
  -> return the single non-member
```

For class-member selection:

```text
find the strongest class shared by all seed entities
  -> require one unique winning class
  -> return the single candidate satisfying that class
```

The solver output must include per-option membership evidence and the winning-class rationale.

---

## 7. Independent verifier

The verifier must not receive the stored correct index or trust generator evidence.

It should:

- reconstruct normalized entity IDs from the displayed structured state;
- load class memberships from the authoritative dataset index independently;
- enumerate all eligible classes;
- compute support counts;
- apply rule-quality ordering;
- require a unique winner;
- derive the answer;
- compare only at the final assertion stage.

A second dataset index or independently built reverse map should be used so the verifier is not simply calling the generator helper.

---

## 8. Competing-class ambiguity audit

For every generated state, record:

```ts
type SemanticCompetingClassAudit = {
  winningClassId: string;
  winningOutlierIndex: number;
  competingClasses: {
    classId: string;
    supportCount: number;
    outlierIndex: number | null;
    qualityScore: number;
  }[];
  result: 'UNIQUE' | 'AMBIGUOUS' | 'NO_VALID_RULE';
};
```

Mandatory rejection examples:

- one class groups A/B/C and another equally natural class groups A/B/D;
- one option is the only non-fruit but another is also the only non-red item, with colour intentionally visible and equally salient;
- class membership depends on a disputed or unstable fact;
- the outlier shares the intended class under a common secondary meaning;
- one label is polysemous in a way that changes membership.

---

## 9. Option construction quality

The displayed four entities must be comparable.

Reject states with:

- one option much longer or differently formatted without rule relevance;
- three common nouns and one proper noun unless proper/common status is the intended rule;
- three singulars and one plural;
- three English-native terms and one unexplained abbreviation;
- one option from an obviously different semantic scale;
- hidden answer leakage in parenthetical descriptions;
- repeated labels or aliases;
- an outlier that is too remote to teach the intended class.

Difficulty should come from class discrimination, not cosmetic obscurity.

---

## 10. Explanation design

### Core Rule

Name the exact class shared by the three conforming options.

### Check the Options

Use a compact membership table or sentence-level checks:

```text
A — member of class R
B — member of class R
C — not a member of class R
D — member of class R
```

For named entities, include only the fact needed for the classification.

### Exam Speed Shortcut

Teach the fastest reliable screening strategy for the current family, such as checking the narrow stable class before considering broad similarities.

### Common Traps

Explain one or more real risks:

- choosing by surface appearance;
- using an overly broad class;
- confusing use with material;
- relying on an unstable secondary meaning;
- reversing class-member and outlier logic.

The explanation must not expose internal class IDs.

---

## 11. Localisation plan

English is implemented first.

Before Hindi/Punjabi runtime work:

- freeze entity IDs and semantic class identities, not English strings;
- author conventional Hindi and Punjabi labels;
- audit polysemy and category salience per locale;
- replace entities when direct translation creates ambiguity;
- preserve task difficulty and answer semantics, not necessarily literal item parity;
- classify each prototype as `TRANSLATABLE`, `LANGUAGE_ADAPTED` or `LANGUAGE_SPECIFIC`.

Semantic word classification is expected to be predominantly `LANGUAGE_ADAPTED`.

---

## 12. Deterministic first-wave proof

The first implementation should target enough seeds to expose dataset and ambiguity failures rather than a cosmetic low-volume sample.

Minimum gate per temporary prototype:

- deterministic regeneration;
- at least 100 valid seeds attempted;
- explicit count of accepted and rejected states;
- all four answer positions represented among accepted states;
- multiple semantic classes and option pools represented;
- no displayed duplicates;
- unique canonical answer;
- independent-verifier agreement;
- competing-class audit `UNIQUE`;
- complete four-tier explanation;
- zero lifecycle leakage.

A prototype is not considered saturated merely because 100 seeds pass. Source expansion and gap audits remain mandatory.

---

## 13. Review export

Export at least three accepted samples per prototype where available, selected to vary:

- semantic class;
- outlier position;
- difficulty;
- option similarity;
- explanation wording;
- mathematical or factual state.

Required review fields:

- temporary prototype ID;
- seed;
- task direction;
- semantic class label;
- displayed stem and options;
- correct answer;
- membership evidence;
- competing-class audit summary;
- difficulty features;
- four-tier explanation;
- lifecycle metadata.

---

## 14. Discovery audits after wave one

After the first executable wave, perform:

1. **Source audit** — identify recurring semantic families not represented.
2. **Task audit** — compare direct outlier and class-member selection.
3. **Inverse audit** — test whether selecting a member is merely inverse presentation.
4. **Class hierarchy audit** — broad versus narrow class collisions.
5. **Dataset audit** — missing negative evidence, aliases and locale notes.
6. **Merge/split audit** — decide which candidates share one solve authority.
7. **Difficulty audit** — ensure challenge is inferential, not trivia-based.
8. **Editorial audit** — natural SSC/Banking/Punjab wording and teacher-style explanations.
9. **Ownership audit** — delegate pairs, lexical structures or domain-calculation questions.
10. **Gap audit** — determine the next justified prototype wave.

Permanent QL allocation remains prohibited until these audits close.

---

## 15. Initial implementation file plan

```text
CLS-CP-001/
  semantic-types.ts
  semantic-dataset.en.ts
  semantic-class-index.ts
  prototype-registry.ts
  generator.ts
  canonical-solver.ts
  independent-verifier.ts
  ambiguity-auditor.ts
  distractor-strategy.ts
  explanation.ts
  runtime.ts
  prototype.test.ts
  structural-editorial.test.ts
  export-review.ts
```

Shared chapter-level utilities should be extracted only after the first implementation proves reuse. Premature abstraction is discouraged.

---

## 16. Completion definition for the first milestone

The first CP-001 milestone is complete when:

- a curated English semantic dataset exists;
- at least one source-backed prototype family runs end to end;
- canonical and independent solvers agree;
- competing-class ambiguity is mechanically audited;
- deterministic review exports are available;
- no permanent QLs have been allocated prematurely;
- the next gap-driven implementation wave is documented.
