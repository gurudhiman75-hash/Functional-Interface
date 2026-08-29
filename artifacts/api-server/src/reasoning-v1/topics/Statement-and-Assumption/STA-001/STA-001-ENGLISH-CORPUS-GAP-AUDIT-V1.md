# STA-001 — English Corpus Gap Audit V1

Status: **40-SCENARIO CORPUS GREEN / NOT YET ENGLISH-FREEZE READY**

This audit follows the permanent semantic freeze of `STA-QL-001..004` and the first 40-authority English corpus candidate.

## 1. Current green corpus

Dedicated CI authority:

```text
workflow: Validate STA-001 semantic freeze and English corpus
run:      32212639858
result:   SUCCESS
```

Current corpus:

```text
STA-QL-001   10 semantic scenario authorities
STA-QL-002   10 semantic scenario authorities
STA-QL-003   10 semantic scenario authorities
STA-QL-004   10 semantic scenario authorities
TOTAL        40
```

The green corpus already proves:

- 10 approved neutral domains;
- 39 semantic families;
- SSC / Banking / Punjab-state / bounded cross-exam source profiles;
- 2- and 3-assumption formats;
- real `All I, II and III` outcomes;
- deterministic replay;
- oracle/editorial parity;
- all four answer positions;
- QL-003 direct-proposition wording;
- QL-004 explicit-premise + hidden-bridge separation;
- 800-question seeded corpus proof;
- human review export;
- production API build.

## 2. Why English is not frozen yet

Forty scenarios are sufficient to validate the four QL identities, but not yet sufficient for an Examtree production corpus intended to generate large volumes without obvious semantic repetition.

The remaining gaps are structural, not merely numerical.

## 3. Gap A — semantic authority count

Current:

```text
10 per QL / 40 total
```

V2 production-candidate target:

```text
16 per QL / 64 total
```

The additional 24 authorities must introduce new semantic situations or adversarial traps. Stem rewrites do not count.

## 4. Gap B — misconception breadth

Current misconception coverage is concentrated in seven classes:

```text
CAUSE_EFFECT_OVERREACH
CONCLUSION_OR_CONSEQUENCE
RELATED_BUT_IRRELEVANT
SUPPORTIVE_NOT_NECESSARY
TOO_STRONG_QUANTIFIER
WRONG_SCOPE
WRONG_STAKEHOLDER
```

V2 target: at least **12** misconception classes, with source-safe additions drawn from:

```text
EXPLICIT_RESTATEMENT
PLAUSIBLE_WORLD_FACT
WRONG_TIMEFRAME
REVERSE_DEPENDENCY
OPPOSITE_OF_REQUIRED_ASSUMPTION
FEASIBILITY_OVERREACH
VALUE_JUDGEMENT_NOT_REQUIRED
EXTERNAL_KNOWLEDGE
```

A wrong assumption must remain plausible and same-scenario; random filler is prohibited.

## 5. Gap C — QL-001 discourse and difficulty

Current QL-001 corpus is dominated by direct instructions.

V2 must also prove source-safe request-style acts and harder multi-precondition cases while preserving the same core prerequisite/capability/feasibility solve operation.

Required:

- `INSTRUCTION` remains represented;
- `REQUEST` is represented;
- Easy / Medium / Hard all represented;
- multi-precondition scenarios include at least two genuinely required hidden dependencies;
- wrong-timeframe / opposite / feasibility-overreach traps appear without creating new QLs.

## 6. Gap D — QL-002 policy/decision adversarial breadth

The semantic core is already strong, but V2 should increase:

- decision/policy-style scenarios;
- feasibility-versus-efficacy distinction;
- wrong stakeholder and wrong timeframe traps;
- supportive-but-not-necessary benefits;
- explicit-restatement distractors where the statement itself contains a relevant fact.

No presentation-only split is permitted.

## 7. Gap E — QL-003 institutional-communication breadth

The permanent boundary remains narrow and source-supported:

```text
NOTICE / RULE / INSTITUTIONAL COMMUNICATION CORE
```

V2 must **not** use advertising or appeal breadth merely to increase volume.

Needed diversity:

- deadline notices;
- service diversion;
- collection/pickup;
- maintenance warning;
- eligibility/registration;
- temporary-location or schedule changes;
- correction/verification notices.

Candidate assumptions must state the underlying proposition directly; communication meta-language remains prohibited.

## 8. Gap F — QL-004 assertion/claim coverage

Current corpus strongly covers `PREDICTION` but underrepresents `ASSERTION` even though the frozen semantic authority explicitly owns claim/prediction hidden efficacy bridges.

V2 must add assertion-style cases where:

```text
explicit premise
-> unstated causal/efficacy bridge
-> supplied claim
```

The hidden bridge must remain distinct from both the premise and the claim.

## 9. Difficulty target

For every permanent QL, V2 must include all three difficulty bands:

```text
Easy
Medium
Hard
```

Difficulty must arise from semantic burden, not sentence length.

## 10. V2 freeze-candidate gate

English corpus V2 may become a freeze candidate only if all are true:

1. exactly 64 reviewed semantic authorities — 16 per permanent QL;
2. at least 60 distinct semantic family IDs;
3. all 10 approved neutral domains retained;
4. at least 12 misconception classes represented;
5. all frozen dependency relations remain oracle-valid;
6. QL-001 includes request-style and hard multi-precondition forms;
7. QL-002 includes recommendation/proposal/decision breadth;
8. QL-003 remains inside the source-supported communication boundary and passes direct-proposition wording checks;
9. QL-004 includes both prediction and assertion/claim forms and passes anti-restatement checks;
10. all QLs contain Easy / Medium / Hard authorities;
11. deterministic large-seed corpus proof is green;
12. every authority is reached by the seeded audit;
13. misconception distribution and answer-position distribution are audited;
14. an expanded human review export is inspected;
15. production API build remains green.

## 11. Downstream gates

Until V2 no-known-gap review passes:

```text
English production corpus:   NOT_FROZEN
Hindi/Punjabi:               NOT_STARTED
Question Studio:             CLOSED
Question Bank writes:        CLOSED
mock/test eligibility:       CLOSED
public publication:          CLOSED
```
