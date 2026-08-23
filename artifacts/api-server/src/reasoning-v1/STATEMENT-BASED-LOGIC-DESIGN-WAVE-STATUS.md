# Statement-Based Logic — Design Wave Status

Status: **FAMILY DESIGN/SOURCE AUDIT COMPLETE / STA IMPLEMENTATION ACTIVE ONE CHAPTER AT A TIME**

This status file records the coordinated pre-implementation design/source work for the natural-language Family C chapters and the decision to implement chapters sequentially after family-wide ownership review.

Authorities:

- `STATEMENT-BASED-LOGIC-FAMILY-DESIGN.md`
- `STATEMENT-BASED-LOGIC-DESIGN-SELF-REVIEW.md`
- `STATEMENT-BASED-LOGIC-SOURCE-OWNERSHIP-AUDIT-V1.md`
- `STATEMENT-BASED-LOGIC-SOURCE-AUDIT-V1-ADDENDUM.md`
- `STATEMENT-BASED-LOGIC-SOURCE-AUDIT-DESIGN-AMENDMENTS-V1.md`
- `STATEMENT-BASED-LOGIC-TARGETED-SATURATION-V2.md`
- `STATEMENT-BASED-LOGIC-MERGE-SPLIT-QL-PROPOSAL-V1.md`

## 1. Current chapter states

| Product code | Package | Current state |
|---|---|---|
| `REAS-STA` | `STA-001` | **PERMANENT QL SEMANTIC FREEZE — 4 QLs / English corpus expansion next** |
| `REAS-STC` | `STC-001` | DESIGNED + SOURCE-AUDITED / proposed 3 QLs / implementation not started |
| `REAS-ARG` | `ARG-001` | DESIGNED + SOURCE-AUDITED / proposed 3 QLs / implementation not started |
| `REAS-COA` | `COA-001` | DESIGNED + SOURCE-AUDITED / proposed 2 QLs / implementation not started |
| `REAS-CAE` | `CAE-001` | DESIGNED + SOURCE-AUDITED / proposed 1 QL / implementation not started |
| `REAS-ASM` | `ASM-001` | DESIGNED + SOURCE-AUDITED / permanent QLs withheld pending exact reasoning-item semantics |

Implementation order is intentionally sequential:

```text
STA -> STC -> ARG -> COA -> CAE -> ASM
```

Family design/source work remains coordinated, but executable implementation proceeds one chapter at a time to expose real shared abstractions and prevent premature universal-engine design.

## 2. STA semantic freeze

`STA-001` now has four permanent semantic QL identities:

```text
STA-QL-001  Core hidden prerequisite/capability/feasibility dependency
STA-QL-002  Recommendation/policy/proposal need-and-efficacy dependency
STA-QL-003  Source-supported notice/rule/institutional communication audience-purpose dependency
STA-QL-004  Claim/prediction hidden causal-or-efficacy bridge
```

Final dedicated CI:

```text
workflow: Validate STA-001 semantic freeze
run:      32210089893
result:   SUCCESS
```

The final proof validates four frozen QLs, 13 reviewed executable authorities, 480 deterministic questions, oracle independence/mutations, real three-assumption/all-three-implicit coverage, review export and production API build.

This freezes **semantic QL identity only**. It does not freeze the English production corpus.

## 3. Taxonomy decision

These remain six separate chapters.

A standalone `Inference` chapter is not created because the current authoritative Reasoning V1 taxonomy does not define `REAS-INF`.

Source audit showed that inference behavior belongs inside `STC-001`, with source-profiled inference standards rather than one universal entailment standard.

## 4. Semantic separation

```text
STA: candidate is an unstated required dependency
STC: candidate is supported under STRICT_ENTAILMENT or curated CONTROLLED_REASONABLE_INFERENCE
ARG: candidate is a strong reason bearing materially on the issue
COA: candidate is a suitable response, including evidence-sufficiency timing
CAE: displayed events are classified by exact causal relation
ASM: evaluate A truth, R truth, then R->A explanation, with source-section ownership
```

No implementation may replace these with one generic natural-language classifier.

## 5. Shared infrastructure rule

Safe to share after real reuse is demonstrated:

- proposition/entity IR;
- scope/quantifier/time types;
- polarity/negation utilities;
- structured-text renderer;
- deterministic seed utilities;
- source-profile/evidence metadata;
- localization framework;
- semantic fingerprints;
- review export infrastructure.

Must remain chapter-owned:

- answer oracle;
- misconception-to-verdict rules;
- source-pattern registry;
- difficulty calibration;
- explanation semantics;
- final QL registry.

Shared abstractions should be extracted after at least two executable chapters prove the overlap rather than by building a universal critical-reasoning engine first.

## 6. Downstream lifecycle

Even after STA semantic QL freeze:

```text
STA English production corpus: NOT_FROZEN
STA Question Studio:            CLOSED
STA Question Bank writes:       CLOSED
STA mock/test eligibility:      CLOSED
STA public publication:         CLOSED
STA Hindi/Punjabi:              NOT_STARTED
```

Other statement-based chapters remain closed at design/source-audit stage.

## 7. Current next gate

Stay inside `STA-001` and:

1. expand English curated scenario/family coverage substantially inside the four frozen QLs;
2. run semantic-diversity, ambiguity, misconception and cross-QL collision audits;
3. perform a larger human exam-readiness review;
4. freeze the English corpus only after no-known-content-gap review;
5. localize Hindi/Punjabi;
6. register the whole frozen STA chapter in Question Studio only after localization parity and final chapter freeze.

Do not begin STC executable implementation until the current STA implementation gate is complete enough to justify moving forward.
