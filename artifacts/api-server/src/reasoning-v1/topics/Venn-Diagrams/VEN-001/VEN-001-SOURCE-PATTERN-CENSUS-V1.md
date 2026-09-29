# VEN-001 Source-Pattern Census — Initial Evidence

Date: 2026-09-28  
Branch: `feature/ven001-logical-venn-blueprint`  
Status: **initial census; not exhaustive and not authority approval**

## Scope checked

The Family C master blueprint lists Logical Venn Diagrams separately from Syllogism and requires a formal set-relation solver. The official SSC CGL syllabus also names Venn Diagrams as a General Intelligence and Reasoning topic. The question evidence below is from indexed reproductions of SSC CGL 2023 Tier-I papers; these reproductions establish observed operations but are secondary copies, not primary SSC-hosted paper artifacts.

## Distinct operations evidenced

| Operation | Observed form | Evidence |
|---|---|---|
| Category labels → diagram | The stem supplies two or three classes and asks for the matching diagram. Examples include nested taxonomy labels and a mixed relation among a role and two occupations/groups. | SSC CGL 2023 Tier-I paper reproduction, Shift 4 Q1 and Q14; Shift 4 Q1 states “Reptiles, Alligators, Animals”; Q14 is “Player, Captain, Coach.” |
| Diagram → category labels | The stem supplies a diagram and asks which set of three class labels fits it. Options include a nested superclass/subclass pair plus a separate peer category. | SSC CGL 2023 Tier-I paper reproduction, Shift 1 Q1; answer-key reproduction identifies “Reptiles, Snakes, Lizards.” |
| Mixed subset and overlap classification | The three named groups do not reduce to three disjoint groups or a simple chain; a subset and an overlap must be represented together. | SSC CGL 2023 Tier-I paper reproduction, Shift 4 Q6 gives “Mobile, Book, Digital device.” The reproduced explanation treats mobile devices as overlapping the digital-device group, with Book separate. |

## What this supports

1. VEN-001 must support both directions: category labels to a selected diagram, and a given diagram to a selected set of category labels.
2. Two-set and three-set diagrams are in scope. Three-set questions must include nested, separate-peer and mixed overlap/subset relationships where source-backed.
3. Answer options should be equivalent-topology distractors: reverse subset, collapse two separate sets, omit an overlap, or add an unsupported relation.
4. The input must state or authoritatively establish every required relation. A category name alone must not force an ambiguous modern/common-language claim.

## Source-quality and ambiguity notes

- SSC's syllabus establishes the topic but does not establish the frequency of each QL.
- The 2023 paper copies were discoverable through ExamSIDE and a question-paper PDF mirror. Before permanent QL allocation, acquire/check answer-key-linked question paper artifacts or independently verify source/session metadata.
- The “Mobile / Book / Digital device” reproduction illustrates a governance risk: “mobile” can mean movable, mobile phones, or mobile devices. Do not reuse that wording. New authority text should name the class precisely and give only the relation the stem needs.
- “Player / Captain / Coach” also needs a source-backed definition of Captain and its relation to Player; do not assume every coach is outside the Player set or that every captain is currently a player.
- Do not infer overlap from a “can be” relation unless the item explicitly tests possibility and the relevant universe is stated. Possibility and necessary-inference tasks remain in Syllogism.
- No evidence gathered here supports numerical inclusion-exclusion questions as a Family C logical-diagram QL. Keep them outside this initial scope unless a separate source census establishes a recurring reasoning pattern distinct from Quantitative Aptitude / Data Interpretation.

## Provisional topology inventory

The first implementation should cover these relation signatures, with category labels preserved on every set:

- **Two sets:** disjoint; partial overlap; A inside B; B inside A; equivalent only when explicit and source-supported.
- **Three sets:** three-level nesting; two disjoint subsets in a common superset; a subset plus a third set with partial overlap; two groups overlapping inside or across a third group; all-three common region only when explicitly supported.
- **Reverse matching:** diagram labels are absent and answer options supply category triples; the correct choice must satisfy every labeled inclusion, exclusion and overlap shown.

Each registered signature needs at least one clear authority and several genuinely distinct contexts before it is considered adequately represented. Mere replacement of group names is not a distinct scenario.

## Retrieval references

- SSC CGL official exam page (syllabus, answer-key and previous-paper entry points): https://ssc.gov.in/for-candidates/cgl-exam/s40d16nackd16h0
- SSC CGL 2023 Tier-I paper reproduction, Shift 4 (indexed question text and explanations): https://questions.examside.com/past-years/ssc/question/pselect-the-venn-diagram-that-best-illustrates-the-relatio-ssc-cgl-tier-i-general-intelligence-and-reasoning-lglpfrbpfnhztwde
- SSC CGL 2023 Tier-I paper reproduction, Shift 4 full session: https://questions.examside.com/past-years/year-wise/ssc/ssc-cgl-tier-i/ssc-cgl-tier-i-26th-july-2023-shift-4/tlm0bga449
- SSC CGL 2023 Tier-I paper PDF mirror (Q6 and Q14 examples): https://cdn-images.prepp.in/public/image/SSC_CGL_2023_Tier_1_Shift_4_Question_Paper_with_Answer_Key_PDF_English_July_24_2023__3ec3fe73a530c028f4558430842451df.pdf

Sources are logged to identify pattern provenance. This document does not reproduce full exam questions, options or diagrams.
