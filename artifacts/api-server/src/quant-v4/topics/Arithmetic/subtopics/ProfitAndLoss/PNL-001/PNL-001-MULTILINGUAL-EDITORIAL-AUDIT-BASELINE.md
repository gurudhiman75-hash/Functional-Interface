# PNL-001 Hindi/Punjabi Editorial Audit Baseline

## Corpus

The permanent multilingual audit covers every committed native Editorial V2 entry:

```text
Languages:                    Hindi, Punjabi
CPs per language:             6
QLs per language:             186
Total reviewer rows:          372
Fatal structural findings:    0
Editorial pattern findings:   108
Lexical review findings:      76
Audit status:                 REVIEW_REQUIRED
```

The reviewer CSV contains the complete native stem, prompt, explanation opening, concept, steps, conclusion, common trap, context family, representation and replacement fields for each QL-language pair.

## Existing structural proof

Before generating the corpus, the workflow proves:

- all 372 native entries exist;
- Hindi and Punjabi scripts are present;
- native explanations contain at least the teaching depth required by English;
- additional native teaching steps are allowed;
- structured representation matches English;
- multilingual rendering is valid;
- all 12 committed native libraries exactly match their generator authority.

## Editorial baseline

```text
Repeated step-title patterns: 48
Repeated common-trap patterns:24
Repeated conclusion patterns: 24
Repeated opening patterns:    10
Repeated concept patterns:     2
```

Each count represents a repeated phrase cluster in one language, not the number of affected QLs. Hindi and Punjabi currently contribute the same cluster counts:

```text
Per language:
  repeated step titles: 24
  repeated common traps:12
  repeated conclusions: 12
  repeated openings:     5
  repeated concepts:     1
```

## Lexical baseline

```text
Hindi “व्यावसायिक क्रम”: 37 QLs
Punjabi “ਵਪਾਰਕ ਕ੍ਰਮ”:   37 QLs
Hindi “अज्ञात समूह”:      2 QLs
```

These are review flags, not automatic failures. The localisation wave should replace them with concrete transaction wording where the sentence becomes more natural.

## Dominant repetition clusters

The largest opening clusters repeat across approximately 36–38 QLs in each language. Conclusion, common-trap and step-title clusters broadly follow chapter concept families such as:

- basic cost/selling-price relations;
- multiplier and reverse-multiplier problems;
- base conversion and fractions;
- offers, coupons and cashback;
- grouped inventory;
- successive transaction chains;
- false quantity and retail measurement;
- effective cost and recovery;
- contribution, break-even and margin of safety.

The first remediation wave should diversify openings and remove the formal “business sequence” wording. Later waves should address conclusions, common traps and step titles by concept family.

## Hosted proof

```text
Workflow: Apply PNL Multilingual Audit Parity Correction
Run:      30543476493
Result:   PASS
Artifact: 8759687916
Digest:   sha256:9d1d0fb3093ab246c50dc4927513a871e7b6632ef2a8a11724d6092150ec8f62
```

## Safety boundary

This baseline adds audit infrastructure only. It does not alter question content, solver behaviour, Question Studio routing, Question Bank status, test eligibility or publication metadata.
