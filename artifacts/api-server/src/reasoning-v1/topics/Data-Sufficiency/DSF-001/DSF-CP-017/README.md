# DSF-CP-017 — Normal Question Studio workflow

Status: implementation candidate

## Purpose

CP017 connects the already production-integrated CP011–CP013 Data Sufficiency breadth to the normal authenticated Question Studio review lifecycle without rewriting the frozen CP011–CP016 evidence.

The source runtimes remain immutable review-candidate authorities. CP017 owns only the delivery adapter that makes those source-backed questions discoverable, previewable, generatable and persistable as Question Studio review items.

## Scope

- permanent semantic registry remains `DSF-QL-001`, `DSF-QL-002`
- next permanent identity remains `DSF-QL-003`
- normal bulk generation is enabled only for `DSF-QL-001`
- `DSF-QL-002` remains permanently allocated but is not advertised as a breadth-qualified bulk generator; it currently has the three-statement semantic foundation and source-backed Number System prototypes only
- expansion language is English only until a separate localization checkpoint approves Hindi/Punjabi expansion surfaces

## Question Studio lanes

### CP011 Quant breadth

1. Average
2. Ages
3. Profit, Loss & Discount
4. Simple & Compound Interest
5. Time & Work / Pipes & Cisterns
6. Time, Speed & Distance / Trains / Boats
7. Mixture & Alligation
8. Mensuration
9. Ratio / Percentage / Number System enrichment
10. Algebra enrichment

### CP012 Reasoning Wave 1

11. Ranking & Order
12. Direction Sense
13. Blood Relations
14. Inequality

### CP013 Reasoning Wave 2

15. Seating Arrangement
16. Coding-Decoding
17. Calendar

Reasoning lanes are rendered through the frozen CP014 common-base editorial surface before Question Studio display/persistence.

## Normal workflow contract

CP017 enables:

- Question Studio discovery: yes
- preview: yes
- batch generation: yes
- persistence to normal generation runs/items: yes
- dashboard/review queue: yes
- manual approval required: yes

CP017 does **not** enable downstream release for this new breadth:

- Question Bank writable: no
- scored-test eligible: no
- mock-test eligible: no
- publicly publishable: no
- automatic student publication: no

The shared Question Bank conversion guard therefore rejects CP017 items even if an admin marks a review item approved; a later explicit release checkpoint must open downstream eligibility.

## Historical boundary

CP010’s older multilingual released scope is not changed. Existing English/Hindi/Punjabi CP010 generation continues to use its approved release authorities. CP017 is an additive expanded-review mode for CP011–CP013 only.

## QA expectations

The CP017 executable audit must prove:

- all 17 lanes generate through the adapter
- source QL identity remains `DSF-QL-001`
- source lifecycle stays locked; CP017 owns Studio exposure
- exactly two statements and five options with one correct option
- no duplicated statement blocks in review stems
- structured explanations remain human-readable
- CP012/CP013 reasoning surfaces use the CP014 editorial version
- deterministic replay
- all five two-statement sufficiency classes remain generatable
- QL002 bulk generation is rejected explicitly
- Question Bank/test/mock/public lifecycle gates remain closed
