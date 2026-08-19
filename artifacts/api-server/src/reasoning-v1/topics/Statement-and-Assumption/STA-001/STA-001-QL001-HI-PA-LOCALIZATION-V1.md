# STA-001 QL001 Hindi/Punjabi Localization V1

Status: **TECHNICAL REVIEW CANDIDATE / UNFROZEN**

This checkpoint localizes only frozen `STA-QL-001` from the immutable English V2 authority. It does not modify English learner content, semantic runtime, QL identity, or any downstream product gate.

## Scope

- English authority: `STA-001-EN-v2-frozen`
- localized QL: `STA-QL-001`
- frozen English authorities represented: **16 / 16**
- Hindi authorities: **16**
- Punjabi authorities: **16**
- statement variants per authority: **2**
- localized candidate copy: all frozen candidate IDs, with variant-count parity
- localized explanations: candidate-specific rationale, not generic answer-only text
- answer semantics: inherited from the frozen English oracle/generator

The 16-authority scope contains the three reviewed executable foundations, seven English expansion authorities, and six V2 gap-fill authorities. No new QL is created by localization.

## Parity architecture

`localization-ql001-copy.ts` owns learner-facing Hindi/Punjabi copy only.

`localization-ql001.ts` first generates the frozen English semantic question and then overlays the corresponding localized statement/candidate/rationale text. It deliberately preserves:

- question identity;
- `STA-QL-001` identity;
- scenario identity;
- selected candidate IDs and order;
- independent oracle classifications and evidence;
- answer set;
- option semantic answer sets;
- correct option index;
- difficulty and source profile.

Localized options and explanations are rendered natively, but they never recompute semantic truth.

## Executable gate

`localization-ql001-proof.test.ts` requires:

1. the English V2 freeze ID and all **17** English blob locks to remain present;
2. exactly **16** frozen English QL001 authorities;
3. exact Hindi/Punjabi scenario-ID equality with those 16 authorities;
4. exact candidate-ID and text-variant-count parity per authority;
5. Devanagari/Gurmukhi presence in learner copy and rationales;
6. deterministic English-vs-localized parity for question/scenario/candidate/oracle/answer/option semantics;
7. generated reachability of all 16 authorities in each language;
8. all Question Studio, Question Bank, mock/test and publication gates remain closed.

The workflow also exports two distinct learner stems per authority per language: **32 Hindi + 32 Punjabi = 64 review questions** in HTML/JSON for direct native-language inspection.

## Lifecycle

```text
permanent QL semantics:   FROZEN (4 QLs)
English corpus/runtime:   FROZEN_V2
Hindi QL001:              REVIEW_CANDIDATE / UNFROZEN
Punjabi QL001:            REVIEW_CANDIDATE / UNFROZEN
remaining QLs 002..004:   NOT_LOCALIZED
native/product approval:  NOT_RECORDED
multilingual chapter:     NOT_FROZEN
Question Studio:          CLOSED
Question Bank writes:     CLOSED
mock/test eligibility:    CLOSED
public publication:       CLOSED
```

Automated parity is necessary but does not count as native-language approval. The generated learner artifact must be directly reviewed for naturalness, grammar, exam-style wording, hidden-assumption preservation, and absence of translationese before QL001 localization can be frozen.

## Next gate

1. obtain a green exact-head workflow for this QL001 candidate;
2. directly review the 64-question Hindi/Punjabi artifact and correct native-language defects without changing English;
3. freeze QL001 localization only after explicit review approval;
4. continue the same controlled process for QL002, QL003 and QL004;
5. perform combined multilingual chapter proof before Question Studio activation.
