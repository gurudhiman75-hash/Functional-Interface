# ENG-009 — Cloze Test — Final Coverage / Integration Audit V1

Status: `HUMAN_REVIEW_PENDING__CP006_INTEGRATION_REVIEW_ONLY`

## Chapter inventory

| Checkpoint | Profile | Passages | Governed blanks |
|---|---|---:|---:|
| CP001 | SSC Standard Cloze | 10 | 50 |
| CP002 | SSC Advanced Cloze | 10 | 50 |
| CP003 | Banking Prelims Cloze | 10 | 60 |
| CP004 | Banking Mains Cloze | 10 | 60 |
| CP005 | Mixed / New-pattern Banking Cloze | 8 | 48 |
| **Total authored content** |  | **48** | **268** |

CP006 is a deterministic composer/integration layer and does not add duplicate content authorities.

## CP006 profiles

- `ssc-standard` → CP001
- `ssc-advanced` → CP002
- `banking-prelims` → CP003
- `banking-mains` → CP004
- `banking-new-pattern` → CP005

Each composed set preserves:
- one shared passage;
- original blank numbering;
- 5 linked questions for SSC CP001/CP002;
- 6 linked questions for Banking CP003/CP004/CP005;
- deterministic replay by seed;
- source checkpoint metadata.

## Question Studio integration

Package:
`english-eng009-cloze-test-v1`

Registered under the normal `language-v1` Question Studio engine.

Supported selectors:
- ENG-009 package-level deterministic sampling across approved CP001–CP005;
- explicit CP001–CP005 selection;
- explicit CP006 set-composer selection;
- explicit composer profile via subtopic/canonical selector text.

Lifecycle:
- review-only;
- English only at this checkpoint;
- Question Bank writes locked;
- test/mock/public release locked;
- automatic learner publication locked;
- CP001–CP005 record human approval;
- CP006 composer/integration remains pending final human approval.

## Coverage conclusion

The chapter now covers:
- SSC conventional five-blank cloze;
- harder SSC contextual/discourse cloze;
- Banking Prelims longer cloze;
- Banking Mains analytical/editorial cloze;
- recent Banking phrasal-word and can-fit/cannot-fit cloze variants;
- deterministic full-passage set composition.

No separate standalone grammar filler ownership is duplicated from ENG-003, and ENG-008 RC contextual word-fit remains separately owned.

## Final gate

After human approval of CP006/integration:
1. mark ENG-009 chapter human-approved;
2. retain Question Studio review-only lifecycle unless a separate production release is explicitly authorised;
3. close ENG-009 content implementation.
