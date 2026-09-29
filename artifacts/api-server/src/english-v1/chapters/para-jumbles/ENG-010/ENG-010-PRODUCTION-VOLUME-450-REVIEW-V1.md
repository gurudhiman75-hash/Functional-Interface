# ENG-010 — Production Volume 450 — Review V1

Status: `HUMAN_REVIEW_PENDING__QUESTION_STUDIO_REVIEW_ONLY`

## Active production target reached

ENG-010 now contains **450 active Para Jumble authority sets**:

| Profile | Existing | Added | Active total |
|---|---:|---:|---:|
| SSC Standard / CP001 | 24 | 96 | **120** |
| SSC Advanced / CP002 | 24 | 96 | **120** |
| Banking Prelims / CP003 | 24 | 76 | **100** |
| Banking Mains / CP004 | 24 | 86 | **110** |
| **Total** | **96** | **354** | **450** |

The previous 48 extended SSC sets remain retired and are not sampled by the active generator.

## Expansion design

The 354 new sets are built from **60 authored topic families**:
- 16 SSC Standard families;
- 16 SSC Advanced families;
- 13 Banking Prelims families;
- 15 Banking Mains families.

Each family is expanded through six controlled discourse structures. The structures vary the relationship among:
- introduction;
- supporting detail;
- problem / contrast;
- response / solution;
- result;
- extension;
- conclusion.

This avoids reaching the target through simple word substitution.

## Exam-format rules

### SSC
- exactly **4 complete sentences** per active set;
- Standard focuses on clearer chronology, cause-effect and reference chains;
- Advanced uses denser contrast, qualification, evidence and inference links.

### Banking
- **5 sentences** in the new Prelims expansion;
- **6 sentences** in the new Mains expansion;
- content covers retail banking, credit, payments, liquidity, capital, model risk, data, cyber, provisioning, governance and related financial contexts.

## Presentation improvement

Stored logical order is now separated from displayed order.

Every generated question:
1. reconstructs the logical paragraph from its authority;
2. deterministically shuffles the displayed sentences;
3. remaps the correct sequence to the displayed A/B/C/... labels;
4. prevents identity answers such as A-B-C-D from leaking the order;
5. generates four unique sequence options.

## Explanation style

Explanations remain:
- simple;
- longer and step-by-step;
- label-independent after display shuffling;
- explicit about the opener, links, contrast/result cues and conclusion;
- compatible with structured emphasis cues for selective bolding.

## Structural guards added

The audit source now checks:
- exactly **450 active sets**;
- profile counts **120 / 120 / 100 / 110**;
- exactly **354** expansion sets;
- all authority IDs unique;
- all complete paragraph signatures unique;
- SSC sentence count = 4;
- Banking sentence count = 5 or 6;
- four unique answer options;
- deterministic replay;
- no identity displayed answer order;
- fuller explanation output;
- emphasis cues available;
- 10,000-seed generation soak source.

No CI/test execution is claimed by this review document.
