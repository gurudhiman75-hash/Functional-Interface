# MAL-CP-001 Permanent Allocation and Teacher-Explanation Checkpoint

Status: **PERMANENT IDENTITIES ALLOCATED — SIMPLE ENGLISH IMPLEMENTATION PROOF ONLY**

## 1. Authority and boundary

This checkpoint follows the frozen English foundation for:

```text
MAL-CP-001 — Component Blending to or from a Target Mean
```

The foundation discovered and froze seven solve modes and eleven QL-template families without prescribing their counts in advance. This checkpoint assigns permanent identities to those eleven frozen contracts and adds a common simple-English teacher explanation authority.

Permanent allocation and explanation completion do **not** authorise publication, Question Studio exposure, Question Bank writes, test eligibility, Hindi/Punjabi generation or student routing.

## 2. Permanent range

```text
MAL-QL-001 through MAL-QL-011
```

No earlier `MAL-QL-*` identity exists in the repository. The range is consecutive, collision-free and confined to `MAL-CP-001`.

## 3. Allocation map

| Permanent QL | Frozen template | Solve mode | Prototype allocation | Difficulty |
|---|---|---|---|---|
| `MAL-QL-001` | `MAL-CP001-QLC-TARGET-RATIO` | `MAL-CP001-SM-TARGET-RATIO` | ratio from target | Easy |
| `MAL-QL-002` | `MAL-CP001-QLC-FINAL-MEAN-EXPLICIT-TWO` | `MAL-CP001-SM-FINAL-MEAN` | mean from explicit quantities | Easy |
| `MAL-QL-003` | `MAL-CP001-QLC-FINAL-MEAN-RATIO` | `MAL-CP001-SM-FINAL-MEAN` | mean from ratio | Easy |
| `MAL-QL-004` | `MAL-CP001-QLC-FINAL-MEAN-MULTI-COMPONENT` | `MAL-CP001-SM-FINAL-MEAN` | three-item mean | Medium |
| `MAL-QL-005` | `MAL-CP001-QLC-UNKNOWN-SOURCE-QUANTITY-EVIDENCE` | `MAL-CP001-SM-UNKNOWN-SOURCE-WEIGHTED-BALANCE` | unknown item price from explicit quantities | Medium |
| `MAL-QL-006` | `MAL-CP001-QLC-UNKNOWN-SOURCE-RATIO-EVIDENCE` | `MAL-CP001-SM-UNKNOWN-SOURCE-RATIO-EVIDENCE` | unknown item price from ratio | Medium |
| `MAL-QL-007` | `MAL-CP001-QLC-UNKNOWN-QUANTITY-ONE-KNOWN` | `MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY` | static missing quantity and must-be-added framing | Medium |
| `MAL-QL-008` | `MAL-CP001-QLC-UNKNOWN-QUANTITY-MULTI-KNOWN` | `MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY` | third-item quantity | Hard |
| `MAL-QL-009` | `MAL-CP001-QLC-RATIO-SCALE-BOTH-QUANTITIES` | `MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL` | both quantities from total | Medium |
| `MAL-QL-010` | `MAL-CP001-QLC-RATIO-SCALE-REQUESTED-SHARE` | `MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL` | requested item quantity | Medium |
| `MAL-QL-011` | `MAL-CP001-QLC-TWO-STAGE-FINAL-MEAN` | `MAL-CP001-SM-TWO-STAGE-FINAL-MEAN` | two-stage final mean | Medium |

Difficulty allocation:

```text
Easy:   3
Medium: 7
Hard:   1
```

Difficulty here is the permanent QL contract band. It does not create additional QLs or split scenario/context variants.

## 4. Runtime implementation

`runMalCp001PermanentPipeline` now:

1. accepts a permanent QL ID and deterministic seed;
2. resolves the frozen template, solve mode and approved prototype allocation;
3. selects a prototype deterministically when one QL owns more than one approved framing;
4. generates through the frozen exact-arithmetic foundation;
5. emits the permanent QL identity and complete traceability;
6. preserves the exact solver, independent verifier, reasoning graph, answer and misconception evidence;
7. applies the common simple-English teacher explanation authority;
8. refuses unsupported languages and unknown QL IDs.

`MAL-QL-007` deliberately owns two executable prototypes because static missing quantity and “must be added” wording were frozen as one learner contract. Both are normalised to the QL's frozen inverse task direction.

## 5. Simple teacher explanation authority

Every permanent English question uses:

```text
layoutId:       MAL-CP001-EN-SIMPLE-TEACHER-V1
languageLevel:  SIMPLE_ENGLISH
```

The learner-facing explanation always contains these four sections:

1. `📌 Core Concept & Formula`
2. `📝 Step-by-Step Solution`
3. `⚡ 10-Second Exam Shortcut`
4. `⚠️ Common Trap & Mistake Warning`

The authority follows these rules:

- speak directly and use common words such as item, price, quantity, total and part;
- show identification of givens before calculation;
- expand every important subtraction, multiplication, addition and division;
- number every step in order;
- give a MathJax-ready rule without relying on the formula alone;
- state the requested item and unit in the final answer;
- explain the shortcut in words a beginner can follow;
- connect the trap warning to an actual wrong option whenever that misconception option is present;
- use Indian rupee grouping such as `₹1,080`;
- use clear units such as `₹60 per kg`, `16 litres` and `5 : 3 ratio`;
- use labelled quantity pairs when both quantities are requested.

The permanent surface also removes or simplifies terms that are unnecessary for learners, including internal topology/evidence language, matrix, scalar, reconstruction, isolate, imaginary quantity, intermediate result, pre-blend, algebra variables, respectively and compact ratio notation such as `3:5`.

## 6. Preserved exclusions

The permanent allocation does not admit:

```text
MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES
MAL-CP001-PROT-TWO-STAGE-UNKNOWN
MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION
```

It also preserves the three source-gap decisions:

```text
final total mixture quantity output
→ deferred

item-quantity difference output
→ deferred

impossible/indeterminate learner predicate
→ internal validation only
```

## 7. Lifecycle state

```text
permanent identity count:       11
permanent identities frozen:   true
maturity:                       IMPLEMENTATION_PROOF
active QLs:                     0
publiclyPublishable:            false
Question Studio discoverable:  false
Question Bank writable:        false
testEligible:                   false
Hindi/Punjabi:                  unsupported
student/public routing:         disabled
```

## 8. Validation gate

The dedicated stacked workflow proves:

- frozen foundation regression remains green;
- the permanent range is consecutive and unique;
- all eleven frozen templates and seven solve modes remain represented;
- all twelve approved prototypes are represented exactly once;
- excluded and deferred prototypes cannot enter the permanent runtime;
- 1,100 permanent-runtime generations and deterministic regenerations pass;
- every package has four unique options, a valid answer index and passing validation;
- all 1,100 questions contain the four teacher sections;
- all 1,100 explanations use MathJax-ready formulas and at least five numbered steps;
- 7,000 numbered explanation steps pass the working and sentence-case checks;
- 4,400 options pass answer-type-specific unit and ratio formatting checks;
- named-item and source-price answer contracts remain explicit;
- difficult/internal vocabulary, plural-unit errors, article errors and casing defects are rejected;
- all lifecycle exposure flags remain false;
- a 44-question permanent-QL teacher review pack is exported.

The regenerated pack contains:

```text
QL groups:             11
review questions:      44
core-concept sections: 44
step sections:         44
shortcut sections:     44
trap sections:         44
```

## 9. Next gate

The 44-question permanent-QL teacher pack remains `PENDING_PRODUCT_REVIEW`. Only a later release checkpoint may activate English QLs or connect them to Question Studio, Question Bank and tests. Hindi and Punjabi require independent language and editorial gates.
