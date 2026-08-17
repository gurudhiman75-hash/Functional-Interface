# SYL-001 Banking Possibility — Combined Diagram V3 Self-Review

Status: `SELF_REVIEW_COMPLETE_PRODUCT_APPROVAL_PENDING`

This document records the internal review of the Banking possibility prototype after the diagram regression was corrected. It is not product-owner approval and does not permit registration, merge, Question Studio exposure, question-bank writes, test use, or publication.

## Regression history

The first Banking possibility prototype exported no diagrams because it bypassed the learner-presentation diagram stage.

A V2 correction then rendered a separate diagram for Conclusion I and Conclusion II. That was rejected during self-review because the approved Syllogism learner model uses one combined arrangement per question. Two independent arrangements can be pedagogically inconsistent and the V2 bridge used an unsafe compatibility cast.

V3 removes that architecture completely.

## V3 architecture

Each Banking possibility record now has exactly one optional `diagram` object.

The carrier is built through the ordinary Syllogism proof/presentation stack:

```text
Banking possibility record
  -> real scenario + real displayed premises
  -> buildStructuredProofV3
  -> buildLearnerPresentationV4
  -> buildLearnerPresentationV5
  -> CONCLUSION_MASK / premise-only diagram mode
  -> completeRequiredDiagramV5 once
```

No per-conclusion diagram adapter is used. The active V3 path contains no `as unknown as` compatibility cast and no empty administrator-proof placeholder.

The diagram is premise-only. Conclusions I and II are checked against the same arrangement.

## Exact and supplemental geometry

Primary geometry remains the previously approved V5 exact-Venn pipeline.

The existing finite template set safely omitted several three-term Banking premise patterns even though a safe Euler/Venn arrangement exists. The recurring gap was a forced containment combined with a third class that must remain undecided relative to another class while supporting a `SOME` or `SOME_NOT` witness.

A narrow supplemental finite-template family was therefore added. It is used only after the primary V5 renderer omits. Supplemental output must still pass the existing:

1. proof-witness correction;
2. existential completeness pass;
3. closure-complete witness finalizer;
4. unstated-strong-relation safety check;
5. directional-containment safety check.

The supplemental geometry is **not** considered product-approved merely because these gates pass.

## Exhaustive result

Audit boundary:

```text
80 seeds x 3 locales = 240 records
one diagram slot per record = 240 slots
```

Result:

```text
enabled: 228
omitted:  12

APPROVED_V5_EXACT:                 105
SAFETY_GATED_SUPPLEMENTAL_TEMPLATE:123
OMITTED:                            12
```

Every selected three-term Banking record has one combined diagram.

The only omissions are `SYL-SC-CORE-009`, a four-term premise family. No four-term diagram was forced.

Seed 0 / `SYL-SC-CORE-007` is now enabled with one combined diagram.

## Human-review V3 pack

The review pack contains 24 logical questions across English, Hindi and Punjabi:

```text
localized records: 72
diagram slots:      72
enabled diagrams:   69
omitted diagrams:    3

APPROVED_V5_EXACT:                  30
SAFETY_GATED_SUPPLEMENTAL_TEMPLATE: 39
OMITTED:                             3
```

The three omissions are the English/Hindi/Punjabi copies of the same four-term `SYL-SC-CORE-009` question.

## Visual self-review

All 23 enabled English diagrams in the 24-question review set were rendered together and inspected visually.

Observed:

- one combined arrangement per question;
- no duplicated Conclusion-I/Conclusion-II diagrams;
- labels remain inside readable diagram bounds;
- witness marks are visually distinct;
- nested containment layouts are readable;
- three-circle overlap layouts are readable;
- the restored first question is readable and matches its premises;
- no diagram was accepted merely to obtain 100% coverage; the four-term family remains omitted.

Hindi and Punjabi versions were also rendered using script-capable system fonts to inspect label placement. The same audited geometry is shared across locales. The reviewed labels fit the current 340-wide diagram frame, though product-owner viewport approval is still required.

## Independent semantic geometry check

As a second review layer, the 23 enabled English review diagrams were parsed independently from the generated SVG geometry and witness metadata.

Checks performed against the canonical scenario premises:

- `ALL` / `ARE_ONLY` containment direction;
- `ONLY` reverse containment direction;
- `NO` disjointness;
- `SOME` witness membership;
- `SOME_NOT` / `NOT_ALL` witness exclusion;
- `ONLY_A_FEW` positive and negative witness requirements;
- unknown, underived class pairs must not become containment or separation.

Result:

```text
premise-geometry violations:             0
premise-witness violations:              0
unstated containment/separation failures:0
```

This independent check is supplementary evidence only; it does not replace human/product review.

## Remaining limitations / decisions

1. Supplemental templates require product-owner visual approval before they can be treated as accepted learner diagrams.
2. Four-term `SYL-SC-CORE-009` remains diagram-omitted by design.
3. The Banking possibility shell itself remains a prototype, not a registered QL.
4. The review pack still has `humanEditorialStatus`, `humanLocalizationStatus`, `humanExamAuthenticityStatus`, and `humanDiagramStatus` set to `PENDING`.
5. Source-profile activation and generator integration remain blocked by the parent closeout decision.

## Delivery locks

```text
legacy QL changed:          false
new registered QL created:  false
profile planner connected:  false
Question Studio visible:    false
question bank writable:     false
test eligible:              false
publicly publishable:       false
activation permitted:       false
```

Do not merge, register, enable, or publish this prototype from automated/self-review evidence alone.
