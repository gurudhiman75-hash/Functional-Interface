# Numerical Venn Diagrams — pending-content blueprint

The original CP001–CP004 cover diagram relationships and numbered membership regions. They do not provide numerical newspaper, survey, pass/fail or preference problems. This supplement adds numerical Venn operations to the same VEN-001 Question Studio package. Its content-domain metadata identifies quantitative set counting.

## Implementation scope

| Checkpoint | Content                 | Required queries                                                                                                                |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| VEN-CP005  | Two-set headcounts      | Only A/B, both, neither, at least one, exactly one, total                                                                       |
| VEN-CP006  | Three-set headcounts    | Every exclusive region; inclusive pair; exactly one/two; at least one/two; at most one/two; none; union with an exclusion       |
| VEN-CP007  | Percentages and ratios  | Counts from percentages; population from an overlap count; only-A : only-B; exact-two : all-three                               |
| VEN-CP008  | Unknown x               | Missing two-set intersection; missing three-set center; missing total; x-valued exclusive regions constrained by total          |
| VEN-CP009  | Caselet sets            | One shared newspaper/survey data paragraph with five distinct follow-up questions; consistent scenario identifier and data      |
| VEN-CP010  | Feasible overlap bounds | Minimum/maximum two-set and three-set common intersection; minimum/maximum union with only total and individual set sizes given |

## Data and wording contract

- Construct coherent integer data from nonnegative exclusive regions, including the outside region. Derive inclusive totals and intersections from those regions.
- Two-set questions specify whether a count is exclusive or inclusive. Three-set pair counts explicitly include the all-three population.
- Ask in natural exam wording, without instructions to perform intermediate calculations.
- Use a substantial trilingual object library: newspapers, beverages, sports, languages, transport, facilities, media, subjects, devices, payment methods, shopping channels, volunteering, training and identity documents.
- Seeded generation varies both scenario and numerical data. Changing option order or language does not count as a new scenario or operation.
- Provide four distinct numeric/ratio options with error-based distractors and exactly one correct answer. Solutions show intermediate calculations and a single labeled count diagram when helpful. No stimulus diagram is required for word problems.
- English, Hindi and Punjabi share the same semantic and numerical model. Native wording remains a human-review gate.
- Mathematical formulas retain LaTeX in metadata; explanations also supply readable substituted arithmetic for offline review.
- Difficulty is assigned by operation; calibration with learner data is a later task.
- Integrate CP selectors into the standard adapter and package catalog. New material remains a review candidate; existing user sign-offs do not approve it.

## Verification

Independently enumerate memberships to check answers. Exercise all query masks, random seeds, languages, difficulties and bounds. Brute-force small universes to validate attainable extrema. Verify real adapter routing, unique options, stable seeds, locale parity and caselet data identity.

## Other boundaries and remaining work

This blueprint addresses the numerical gap identified by the user. Mixed circle/triangle/rectangle region inspection still requires a separate content and geometry expansion. Syllogism conclusion/possibility questions belong to the existing syllogism chapter. Formal power sets, Cartesian products and relation properties are outside this numerical Venn supplement. Production release/permanent QL registration and approval of the earlier 29 CP004 expansion candidates remain separate pending gates.

## Execution record

Implemented and verified on 2026-09-30. The Question Studio pool now provides 48 seeded review questions per language (144 renderings total) across six new checkpoints and 20 scenario contexts. Twenty-three common query masks are represented across two- and three-set questions. Three-set pairwise counts explicitly include the centre. The review renderer shows solved diagrams only in explanations; maximum/minimum questions do not invent a unique hidden distribution. Human language approval remains pending. Exhaustiveness is bounded to the scope above; it does not claim every possible exam variation.

## VEN-CP011: Geometric Shape Region Inspection

Status: implemented as a Question Studio review candidate; human content and Hindi/Punjabi diagram review remain pending. Runtime stays review-only and does not write to the question bank.

This checkpoint covers numerical Venn questions where each membership region contains a count and the learner adds only the region(s) matching the condition. Nine tested three-shape layouts draw from circles, ellipses, rectangles, squares, general triangles, right-angled triangles, diamonds, trapezoids, and pentagons. The right triangle is shown by its perpendicular sides and is named in the A/B/C legend; no separate angle marker is used. Query coverage includes each category alone, each pair excluding the third, all three, exactly one, at least two, and at least one. Twenty context pools cover exam preparation, crop cultivation, libraries, online purchases, digital devices, payment methods, volunteering, workplace software, cultural events, streaming, skill courses, municipal services, school activities, community services, training modules, media, health screenings, travel, hobbies, and additional workplace tools. Each generated batch cycles through the contexts, so a 20-question batch represents all 20. Stems open with setting-specific details and the questions name the activities directly (for example, sports-centre users and cultural-event attendees); they do not refer to numbered activities or numbered sets. The generated explanation names the exact region labels and uses the diagram's displayed values in the calculation.

Region-number positions are computed for each layout and checked against all eight membership masks with at least 20 SVG units of clearance from every shape boundary. The values render at 16 px to preserve space around the text. The reproducible review export contains 60 candidates: 20 scenarios in each of English, Hindi, and Punjabi, cycling through all nine layouts. Automated tests verify 20 distinct scenarios in a complete cycle, mask membership, label clearance, answer arithmetic, unique options, and adapter exposure. Human review of locale quality and visual readability remains required before signoff.
