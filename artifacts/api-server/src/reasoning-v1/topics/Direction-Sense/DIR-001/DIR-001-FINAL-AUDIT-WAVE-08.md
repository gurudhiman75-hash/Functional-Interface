# DIR-001 Final Audit — Wave 08

## Scope

Diagram placement, explanation coverage, proportional rendering claims, readability contract and Hindi/Punjabi diagram localization for `DIR-QL-001..044`.

The audit used the generated trilingual review pack and rendered representative SVGs from every diagram family.

## Findings

### 1. QL044 violated the Examtree placement rule

QL044 was the only DIR family that attached a graphical diagram to the learner question.

The project rule is that diagrams belong in explanations, not beside the question.

Remediation:

- QL044 is now a text-only three-relation synthesis question;
- the complete solved layout remains as one combined explanation diagram;
- its registry metadata now declares split text relations with an explanation diagram;
- the old question-diagram builder was removed.

### 2. Five advanced movement families lacked explanation diagrams

QL038, QL039, QL040, QL042 and QL043 had detailed movement reasoning but no visual explanation.

Remediation:

- QL038: completed route with the recovered missing movement;
- QL039: completed route after inserting the recovered turn;
- QL040: solved route from the recovered initial facing;
- QL042: solved shared-caselet route;
- QL043: the same route plus a dashed straight-line shortest-distance guide.

A common `PATH_SOLUTION` diagram renderer is used so these families do not drift visually.

### 3. Localized diagrams leaked English

The Hindi and Punjabi question text was localized, but visible SVG text still contained English across the diagram-bearing families. Examples included:

- Movement path
- Relative positions
- Shortest distance
- Mover paths and final positions
- Code key
- Facing
- SUN
- Opposite directions
- diagram titles and explanatory captions
- “and” between localized names

Remediation:

- central Hindi and Punjabi SVG localization now covers full diagram phrases and titles;
- possessive shadow labels and joined names are localized naturally;
- the separate diagram `title` property now uses the same full SVG-language path;
- a new regression strips SVG markup and rejects any multi-letter Latin word in visible Hindi/Punjabi diagram text.

Single-letter compass notation (N/E/S/W) and the unit symbol `m` remain allowed.

### 4. Scale captions contradicted the renderer

CP002, CP004, CP005 and CP006 use a uniform coordinate projection, but their captions said “not necessarily to scale.”

Remediation:

- those captions now state that the geometry is plotted proportionally from the solved positions and that written distances are the exact source values;
- the final-audit regression rejects the ambiguous “not necessarily to scale” wording.

### 5. Post-render verification found two CP008 visual defects

The first green render was inspected visually rather than accepted from structural tests alone.

Two residual defects were found:

- QL037 relation labels were too verbose and could crowd one another around shared nodes;
- QL041 compressed several actual movement legs into one straight start-to-finish segment.

Remediation:

- CP008 relation edges now use compact boxed distance labels; direction is carried by the arrow geometry and compass, while the explanation text states the full direction relation;
- QL041 now draws every generated movement leg separately, with its own distance label and intermediate waypoint;
- regression tests require QL041 movement-segment count to equal the generated movement count and reject verbose direction text inside CP008 edge labels.

## Chapter-wide diagram policy

The audit now enforces:

- QL001–003: no diagram required for basic facing/turn items;
- QL004–044: one explanation-side diagram is required;
- no DIR question may carry a `questionDiagram`;
- the explanation diagram must be a valid SVG;
- Hindi/Punjabi visible SVG text must remain native-language clean;
- ambiguous scale disclaimers are forbidden.

## Safety boundary

This wave does not change:

- correct answers;
- correct indexes;
- option values or distractor algorithms;
- independent solver mathematics;
- QL IDs;
- difficulty labels;
- generated numeric geometry.

QL044 changes presentation/registry wording only: its same three relation vectors are still solved by the same independent relation solver.

## Still open after Wave 08

- current Question Studio integration;
- explicit multilingual freeze authority;
- final downstream release-boundary proof.
