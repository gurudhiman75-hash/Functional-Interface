# SYL-001 Banking source evidence V3

Status: `SOURCE_EXPANDED_WEIGHTING_NOT_FROZEN`

This checkpoint expands question-level evidence for Banking syllogism families. It freezes **family presence and product role only**. It does not claim historical exam-frequency percentages and does not activate any QL, profile, generator, Question Studio, Question Bank or public delivery surface.

## Reviewed question-level evidence

1. SBI PO Prelims memory-based, 6 Nov 2023 Shift 2 — three statements, two conclusions, five-option shell; possibility mixed with a definite conclusion; ONLY_A_FEW premise.
2. SBI PO Prelims memory-based, 6 Nov 2023 Shift 1 — two possibility conclusions inside the normal Banking option shell.
3. SBI Clerk Prelims memory-based, 20 Sep 2025 Shift 2 — direct `All city can never be town` conclusion driven by ONLY_A_FEW semantics in the normal five-option shell.
4. SBI Clerk memory-based, 12 Nov 2022 Shift 1 — complementary conclusions resolve to Either I or II; ONLY_A_FEW premise.
5. SBI PO Prelims memory-based, 4 Nov 2023 Shift 2 — Either/Or complementary pair in a five-option shell with ONLY_A_FEW premise vocabulary.
6. SBI Clerk Mains memory-based, 25 Feb 2024 Shift 1 — coded three-conclusion question with explicit possibility and ONLY_A_FEW semantics.
7. Bank of India PO memory-based, 19 Mar 2023 Shift 1 — coded three-conclusion question with possibility and special-form premise semantics.

Supporting representative/concept sources reviewed:
- RBI Grade B representative solved set: ordinary + possibility conclusions and ONLY_A_FEW forms.
- PracticeMock RBI Assistant Only/Few guidance: ONLY_A_FEW gives definite SOME and SOME_NOT consequences and constrains possibility conclusions.

## Product-role decision

- `BANK_TWO_CONCLUSION_FIVE_OPTION` → **DOMINANT_CORE**
- `BANK_EITHER_OR_COMPLEMENTARY` → **REQUIRED_RECURRING**
- `BANK_POSSIBILITY_IN_CONCLUSION_SET` → **REQUIRED_RECURRING**
- `BANK_ONLY_AND_ONLY_A_FEW` → **REQUIRED_RECURRING_PREMISE_VARIANT**
- `BANK_THREE_CONCLUSION_ADVANCED` → **MINORITY_ADVANCED**

## Weighting boundary

The old provisional `35/20/20/15/10` split is a product planning mix, not a historical frequency table. This V3 evidence is not a complete paper census, so it must **not** be used to claim that those percentages match actual Banking exam frequencies.

Until a broader paper-level ledger exists, mock assembly should preserve the dominance ordering and mandatory family coverage above while keeping exact production percentages unfrozen.

## Locks

- sourceMixFrozen: `false`
- permanentQlFreezePermitted: `false`
- profileActivationPermitted: `false`
- generatorConnected: `false`
- QuestionStudioVisible: `false`
- QuestionBankWritable: `false`
- testEligible: `false`
- public: `false`
