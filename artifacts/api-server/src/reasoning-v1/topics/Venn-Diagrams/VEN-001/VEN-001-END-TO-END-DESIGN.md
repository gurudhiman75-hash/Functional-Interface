# VEN-001 — Logical Venn Diagrams: End-to-End Design

Status: **chapter blueprint for review; no permanent QLs or learner authority assigned**

Product code: `REAS-VEN`  
Chapter ID: `VEN-001`  
Family: `Reasoning V1 / Family C — Logic and deduction`  
Primary locales: English (`en-IN`), Hindi (`hi-IN`), Punjabi (`pa-IN`)

## 1. Chapter purpose

Logical Venn Diagrams tests whether a learner can represent relationships among named groups and identify the diagram that matches those relationships. The chapter uses set regions as the question and answer representation.

It is a standalone product chapter because learners encounter diagram-selection and group-classification questions as their own exam pattern. The chapter may reuse audited SVG primitives and relation-topology utilities from Syllogism, but it must have its own question authorities, Question Logics, distractors, solver contract, review packs and lifecycle.

## 2. Boundary with Syllogism

Syllogism asks what conclusions necessarily follow, or can be true, from quantified premises. Its solver evaluates proposition truth across admissible models.

VEN-001 asks which labeled set diagram represents a stated group relationship or a curated relationship among category names. Its solver compares the exact set topology encoded by the question with each diagram option. It does not ask whether a conclusion follows from a premise set.

| VEN-001 owns | Syllogism owns |
|---|---|
| Mapping group relations to labeled circles | Necessary or possible conclusion evaluation |
| Selecting the matching two-set or three-set topology | Truth classification from quantified premises |
| Identifying which labeled region represents a described group | Existential import and possibility diagrams |
| Applying reviewed category-membership facts | Formal inference over premise sets |

A Venn-shaped illustration inside a Syllogism solution does not count as a VEN-001 question or implementation.

## 3. Candidate checkpoint structure

Checkpoint and QL IDs below are **provisional**. Permanent IDs are assigned only after source-pattern review and product-owner approval.

### CP001 — Two-group relationships

Represent and distinguish:

- one group fully contained in another;
- two mutually exclusive groups;
- two groups with a partial overlap;
- two equivalent groups, only where the exam source and wording make equivalence explicit.

The learner task is to select the matching labeled diagram or identify the region described by the stem. Distractors target reversed containment, false separation, missing overlap, and an unjustified equality.

### CP002 — Three-group relationships

Cover source-supported topologies, including:

- three nested groups;
- two separate subgroups within one larger group;
- one contained group and a third group that partially overlaps the larger group;
- pairwise overlaps with and without a shared three-way region;
- one group separate from the other two, where supported.

The topology census must state which patterns are frequent, which are rare, and which are excluded. Do not create a pattern solely to fill a matrix.

### CP003 — Category-set classification

Given two or three category labels, select the diagram that represents their accepted real-world relationship. Use curated, versioned category authorities with evidence and locale-specific wording where needed.

Authority records must distinguish facts that are always true from facts that are merely common, typical, or context-dependent. A question may not depend on disputed taxonomy, stereotypes, or an unstated interpretation of a word.

### CP004 — Region and membership identification

Given a labeled diagram and a category/member description, identify the correct region or diagram. Use explicit membership facts so the keyed region follows from the stem. This checkpoint is retained only if source review confirms a distinct, recurring exam operation; otherwise it is folded into CP001–CP003.

## 4. Source and scenario authority

Before permanent QL allocation:

1. Census SSC, Banking and Punjab-state exam patterns for two-group and three-group diagram questions.
2. Record source, exam, year/session where available, stem operation, number of sets, topology, answer format and locale.
3. Separate verified exam patterns from practice-book patterns and ExamTree extensions.
4. Build a reviewed category library. Each record stores the category labels, locale text, asserted set relations, evidence/source, caveats, approval status and version.
5. Reject authorities whose relation changes with context unless the stem explicitly fixes that context.

Question scenarios should use varied, ordinary category domains. Names and labels must remain exam-natural in English, Hindi and Punjabi; translations preserve the same set relationship and answer.

## 5. Question and diagram contract

A generated item carries structured fields for:

- chapter, checkpoint and permanent QL (once approved);
- locale, source-authority ID and authority version;
- labeled sets and their relation signature;
- learner stem and four answer choices;
- correct option and question-specific explanation;
- difficulty evidence;
- SVG/HTML diagram data and accessible text alternative;
- validation results and lifecycle state.

Diagrams must be readable at mobile widths. Circle labels remain attached to the correct sets, overlaps are geometrically visible, and answer choices have equivalent scale and visual treatment. Color must not carry meaning by itself. The accessible alternative describes the set relationships without revealing the answer.

## 6. Independent topology solver

Represent a two- or three-set diagram as the set of occupied membership atoms (bit masks), plus explicit subset, exclusion, overlap and equality relations.

For every item, the independent solver must:

1. derive the target relation signature from the structured authority or explicit stem facts;
2. derive each option's signature from its labeled regions;
3. compare signatures without relying on circle position or rendering;
4. confirm exactly one option matches;
5. reject duplicate-equivalent options, contradictory labels, impossible membership facts, and stems that do not determine one answer.

The renderer and solver must consume the same typed set labels but separate logic paths. Tests compare the rendered labels and geometry to the structured signature.

## 7. Distractor rules

Distractors must correspond to plausible exam mistakes:

- reverse the direction of containment;
- treat partial overlap as complete containment;
- treat overlap as separation;
- assume a three-way intersection from pairwise overlaps;
- assume pairwise disjointness from the lack of a common intersection;
- confuse the outer set with a subset;
- place a member in an adjacent but incorrect region.

Distractors may not depend on a visually misleading diagram or tiny circle differences. Each distractor carries a machine-readable error tag for reviewer inspection.

## 8. Difficulty

Difficulty comes from the relationship structure and information load:

- two vs three labeled groups;
- direct vs mixed containment and overlap;
- multiple plausible near-miss topologies;
- number of explicit membership facts;
- diagram-reading and region-selection steps.

Larger or more obscure category names alone do not make a question harder. Difficulty is assigned from generated-instance features, then checked against review samples in all supported locales.

## 9. Localization

The set logic is language-neutral; category authorities and learner wording may be language-adapted. Hindi and Punjabi must use natural, exam-standard terminology rather than literal translations.

For every localized item, verify:

- identical set signature and keyed option;
- same number and order of labels;
- no translation that changes inclusion, exclusion or overlap;
- readable script and label fit at mobile sizes;
- a simple explanation that names the relevant groups and region.

## 10. Proof and review gates

Before a chapter freeze:

- topology catalog has source-pattern coverage and explicit exclusions;
- every QL has deterministic generation and an independent topology solver;
- all options are unique and exactly one is correct;
- property tests cover every registered topology and its targeted mutations;
- category authorities are source-backed and human-reviewed;
- EN/HI/PA answer and relation parity passes;
- SVG geometry, text fit, accessibility and mobile rendering pass;
- review packs show full questions, options, diagrams, answers and explanations;
- a separate product-owner approval records the content freeze.

Initial release state: **review-only**. Question Bank persistence, tests, mocks, public learner delivery and automatic publication remain disabled until their own approval.

## 11. Question Studio integration

After the source census, executable prototype and proofs pass, register VEN-001 as its own Family C package in normal Question Studio. Expose checkpoint, QL, language, difficulty and deterministic seed filters. Persist authenticated review runs through the shared run workflow while keeping canonical learner persistence disabled until release approval.

## 12. First implementation sequence

1. Complete the source-pattern census and confirm CP001–CP004 scope.
2. Approve permanent QLs and topology signatures.
3. Implement typed authorities, solver, distractor generator and SVG renderer.
4. Add topology and ambiguity proofs, then create a representative trilingual review pack.
5. Integrate the proved package into normal Question Studio.
6. Freeze only after editorial approval and all chapter gates pass.
