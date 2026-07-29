# ExamTree Mock Test Content Quality & Editorial Operations Authority

## Status

**Approved project-wide production authority.**

This authority applies to all ExamTree mock-test content for SSC, Banking, PSSSB, PPSC and Punjab Police examinations across Quantitative Aptitude and Logical Reasoning.

It governs English generation, Hindi and Punjabi localisation, solver validation, distractors, explanations, mathematical rendering, visuals, review exports, Question Studio eligibility and publication decisions.

Passing mathematical tests alone does not establish production readiness. A content package must pass every applicable mathematical, structural, editorial, localisation, visual and lifecycle gate in this authority.

## 1. Four-tier teacher pedagogy

Every explanation must contain:

1. **Core Concept & Formula** — the governing relationship in plain teacher language;
2. **Step-by-Step Solution** — explicit intermediate reasoning, unit normalisation and contextual result;
3. **Exam Speed Shortcut** — a state-specific faster method with the actual generated values;
4. **Common Traps & Distractor Analysis** — all three displayed wrong options, their letters and values, and the actual wrong calculation.

Generic reminders such as “do not rebuild the full total” are not acceptable substitutes for numerical teaching.

Shortcut and trap text must be derived from the generated canonical state. Literal shortcut reuse across genuinely distinct contracts is a production failure unless the contracts are explicitly classified as presentation-equivalent representations of the same mathematical task.

## 2. Mathematical and structural integrity

Every generated package requires:

- deterministic regeneration;
- one canonical mathematical state;
- an exact canonical solver;
- a materially separate verifier;
- four unique admissible options;
- exactly one correct option;
- correct-index and displayed-answer agreement;
- dimensionally compatible choices;
- misconception-derived distractors;
- positive, physically valid dimensions and counts;
- whole-number count answers where partial objects are inadmissible;
- explicit approximation policy where approximation is requested;
- lifecycle and publication locks until separate approval.

## 3. Question-stem standard

Stems must:

- read like human-authored competitive-exam questions;
- use concise, authentic Indian educational, workplace, household or civic contexts;
- avoid robotic or telegraphic phrasing;
- avoid double phrasing and redundant restatement;
- identify all required assumptions;
- match the object's open, closed, hollow, exposed or solid state;
- end as a complete question or instruction;
- avoid irrelevant narrative.

Context variation is not a new QL unless the learner's reasoning contract changes.

## 4. Options and distractors

Each question must provide exactly four unique options with:

- appropriate units on every option;
- deterministic answer-position rotation;
- no accidental equivalence after simplification or unit conversion;
- no arbitrary percentage-offset filler distractors;
- no negative physical quantities unless signed change is the explicit target;
- no fractional objects where only complete objects are admissible;
- concrete misconception alignment.

Each wrong-option explanation must begin from the actual displayed letter and value and describe the actual wrong calculation that produces it.

## 5. MathJax and typography

Required conventions:

- inline mathematics uses `$...$` or `\(...\)`;
- display mathematics uses `$$...$$`;
- display fractions use `\frac{a}{b}`;
- powers use MathJax superscripts such as `^{2}` and `^{3}`;
- roots use escaped MathJax commands such as `\sqrt{}`;
- dimensional units use `\text{}` and explicit powers;
- no raw Unicode fractions such as `½` or `¼`;
- no Unicode area/volume powers such as `²` or `³` in learner-facing output;
- no raw ASCII slash division inside display maths;
- no hidden control characters from malformed escapes;
- no implicit decimal replacement of exact surds or exact π values.

## 6. Indian currency and number formatting

For Indian examination content:

- generic monetary contexts use the Indian rupee symbol `₹`;
- rupee amounts use Indian digit grouping, for example `₹12,000`, `₹4,32,000`, `₹2,400`;
- rates use exact MathJax fractions, for example `\frac{\text{₹}12}{\text{m}^{2}}`;
- foreign currency symbols such as `£`, `€` and `¥` are prohibited in learner-facing Indian-exam content unless the source question explicitly requires that currency;
- the explicitly supplied source currency must be preserved rather than silently converted;
- the currency in the stem, options, solution, shortcut and traps must remain consistent.

## 7. Hindi and Punjabi localisation

Localisation must preserve the canonical mathematical state while producing natural language.

### Hindi

- use natural active narrative phrasing;
- preserve Devanagari grammar and gender agreement;
- standardise ordinals, including forms such as `24वाँ` where grammatically required;
- reject unresolved English instructional blocks;
- avoid literal word-for-word translations that distort exam usage.

### Punjabi

- use natural Gurmukhi competitive-exam phrasing;
- prefer active narrative verbs such as `ਉਹ ਸੱਜੇ ਪਾਸੇ 90° ਮੁੜਦੀ ਹੈ`;
- avoid robotic command vocabulary such as inappropriate use of `ਹੁਕਮ`;
- avoid isolated infinitive chains such as `ਮੁੜਨਾ / ਘੁੰਮਣਾ` where a complete active sentence is required;
- standardise ordinals, including forms such as `24ਵਾਂ` where grammatically required;
- reject unresolved English steps or labels.

### Localisation proof

Every localised package requires:

- English-state parity;
- option and correct-index parity;
- numerical and unit parity;
- diagram-label localisation;
- no raw English solution blocks unless they are approved technical tokens;
- human review before language freeze.

## 8. Visual and diagram standard

Diagrams must be deterministic and derived from the same canonical state as the solver.

Required controls include:

- no manually duplicated numerical labels;
- no contradiction between stem and diagram;
- localised Hindi/Punjabi node labels where applicable;
- clean SVG or approved structured grid output;
- mobile-readable spacing and text sizes;
- explicit direction, relation, dimension or code labels;
- no decorative geometry that implies false equality or scale.

Reasoning topics such as Direction Sense, Blood Relations and Coding-Decoding should use deterministic grids, graphs or SVGs when the visual meaning cannot be conveyed reliably through prose alone.

## 9. Automated production gates

Every chapter workflow should test, where applicable:

- solver/verifier agreement;
- option uniqueness and one-correct-answer integrity;
- all answer positions;
- unit and currency parity;
- Indian digit grouping;
- raw Unicode fraction/power rejection;
- raw display slash rejection;
- malformed root and escape rejection;
- hidden control-character rejection;
- internal ID and taxonomy leakage;
- banned boilerplate;
- shortcut specificity and cross-contract reuse;
- all displayed distractors explained;
- English leakage in Hindi/Punjabi;
- ordinal and grammar rules;
- deterministic diagram parity;
- lifecycle locks;
- exact production build.

## 10. Human-review evidence

Production review exports must expose:

- package, CP, QL or temporary prototype identity;
- deterministic seed;
- language;
- target and solve mode;
- difficulty;
- stem and diagram;
- four learner options;
- reviewer answer separated from learner view;
- four-tier explanation;
- independent-verifier status and method;
- provisional retain/merge/split/reassign status during discovery;
- lifecycle status.

Review files must never be treated as approval merely because they were generated successfully.

## 11. Lifecycle and release standard

Unless separately approved, generated content remains:

```text
reviewStatus:               UNREVIEWED
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```

Required release sequence:

1. mathematical discovery and gap audit;
2. English editorial review and freeze;
3. Hindi/Punjabi localisation and review;
4. Question Studio integration under locks;
5. Question Bank and test eligibility approval;
6. explicit public-release approval.

## 12. Production release checklist

| Domain | Required evidence | Blocking failure |
|---|---|---|
| Mathematical engine | Exact solver and independent verification | Answer or option mismatch |
| Stem quality | Authentic complete human-readable prompt | Robotic, ambiguous or contradictory wording |
| Options | Four unique unit-complete options | Duplicate, unlabeled or inadmissible option |
| Explanation | Complete four-tier numerical teaching | Boilerplate or compressed formula dump |
| Currency | Rupee and Indian grouping where applicable | Foreign symbol or inconsistent money unit |
| MathJax | Valid escaped fractions, powers and roots | Raw slash, Unicode glyph or hidden escape |
| Localisation | Natural state-language output and parity | English leak or machine-translation artifact |
| Diagram | Canonical-state and language parity | Mismatched labels or misleading geometry |
| Lifecycle | Review and publication locks | Premature storage, eligibility or publication |

## 13. MEN-CP-007 reference implementation proof

MEN-CP-007 is the first package hardened under this authority.

```text
Latest recorded validated head:         9f28b1f352f3a3cdec9742ac7c788b5d279b61c7
Workflow:                               Validate MEN-CP-007 Indian editorial production
Workflow run:                           30382546548
Conclusion:                             PASS
Artifact ID:                            8697613715
Artifact digest:                        sha256:5c8e750e40bcdb2638325b8f7d92287e98f58c7eb22009a193d8aa709f85169b
Temporary contracts:                    64
Total audited packages:                 5,120
Rupee packages audited:                 400
Hardened human-review rows:              192
Exact Render production build:          PASS
Permanent QL allocations:               0
```

The reference proof validates all four CP-007 discovery layers together and enforces Indian currency, Indian grouping, MathJax hygiene, hidden-control rejection, displayed distractor analysis, problem-specific shortcuts, lifecycle locks and exact production build.

One shared shortcut is explicitly permitted only for the presentation-equivalent pair `CUBOID-SPACE-DIAGONAL` and `LONGEST-ROD-CUBOID`, because the latter has already been classified as a context representation of the former rather than a genuinely distinct reasoning contract.

This proof establishes mathematical and English-editorial readiness for human review. Source saturation, permanent QL allocation, Hindi/Punjabi localisation and publication remain separate approval gates.
