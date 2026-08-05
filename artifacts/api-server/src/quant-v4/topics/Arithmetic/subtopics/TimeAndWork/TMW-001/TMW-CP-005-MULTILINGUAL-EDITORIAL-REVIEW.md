# TMW-CP-005 — Hindi/Punjabi Editorial Review

Status: **assistant editorial review complete; human approval pending**.

```text
Checkpoint: TMW-CP-005
QL range: TMW-QL-082..TMW-QL-105
Hindi rows: 24
Punjabi rows: 24
Total reviewed rows: 48
Exact reviewed implementation head: 722b398990dc665cfdc8b62f9f0eaee7ee372245
Checkpoint localisation run: 30991298405
Checkpoint localisation artifact: 8924214803
Checkpoint localisation digest: sha256:4c8254b8b1f5d079620181a110ef8f2bdf0bd019be845b93d8afa6995897f621
Cumulative editorial run: 30991298645
Cumulative editorial artifact: 8924216018
Cumulative editorial digest: sha256:9e5970ba3867eeedcf11acbe5d7d13a470df163fb07e9c0622d9a8f400683fd7
Full chapter run: 30991298444
Full chapter artifact: 8924218380
Full chapter digest: sha256:2048a6b99bb12a514f4d83545640bf46aa279070052124c0fe006d37ae976b69
```

## Review boundary

The review covered localized stems, answers, options, openings, worked teaching, shortcuts, misconception-linked trap explanations and conclusions for alternating work, multi-day cycles, terminal-agent questions, unknown cycle rates and times, periodic helpers, rest schedules, weekends, unequal shifts, periodic destructive work, repeated join/leave cycles, arbitrary cycle phases, machine-output schedules and deadline-rate questions.

English remains the mathematical authority. Parameters, cycle traces, exact answers, option values, correct indices, misconception identities, formulas, worked mathematics and mathematical fingerprints were not remodeled.

This record does not set `editorialStatus: APPROVED`, does not enable `publiclyPublishable`, and is not product-owner or native-speaker approval.

## Decision summary

```text
Reviewed QLs: 24
Reviewed native rows: 48
Deterministic native packages in permanent cumulative proof: 576
Hindi deterministic packages: 288
Punjabi deterministic packages: 288
Dedicated all-seed packages: 960
QLs protected by CP-005 editorial remediation: 24
Open automated findings: 0
```

## Accepted remediation themes

- removed mechanical task headers such as `दिया गया कार्य:` and `ਦਿੱਤਾ ਗਿਆ ਕੰਮ:`;
- replaced bureaucratic `काम की जिम्मेदारी` / `ਕੰਮ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ` wording with direct “whose turn it is” language;
- replaced technical phrases such as “active turn,” “next active rate,” “cycle state,” “unknown active time” and “net cycle-work” with direct student-facing explanations;
- supplied solve-mode-specific openings for all 24 QLs instead of forcing one generic cycle template;
- made two-agent, three-agent and multi-day cycle explanations explicitly preserve the stated starting order;
- clarified final partial-turn handling and exact-boundary completion without adding a full unnecessary turn;
- made terminal-agent and starting-agent conclusions answer the actual person/turn question directly;
- made unknown-rate and unknown-time explanations count each member’s real number of turns before solving;
- governed the Hindi/Punjabi unknown-time conclusion as “total time when working alone” rather than attaching a postposition to an uninflected option string;
- treated rest, weekend and off-days as elapsed time with zero work;
- generalized natural rest-day wording across every generated interval, not only a fixed fourth-day schedule;
- made unequal-shift explanations multiply each rate by that shift’s actual duration;
- expressed periodic negative work as work completed minus work spoiled;
- made arbitrary-phase traps follow the selected misconception: ignored starting offset or omitted final cycle/partial turn;
- replaced generic final-cycle traps with misconception-specific explanations for starting order, rest days, reciprocal errors, shift duration, deadlines and destructive work;
- preserved exact answer/option and trap/option linkage after all editorial transformations.

## Permanent regression

`tmw-001-cp005-editorial-review.test.ts` checks:

```text
24 QLs × 12 deterministic seeds × 2 native languages = 576 packages
```

The dedicated CP-005 localisation workflow additionally checks:

```text
24 QLs × 20 deterministic seeds × 2 native languages = 960 packages
```

The permanent guards require:

- no mechanical assignment headers;
- no bureaucratic responsibility wording;
- no technical active-turn, cycle-state or unknown-active-time language;
- natural rest-day wording for every generated interval;
- solve-mode-specific openings and conclusions;
- misconception-specific trap explanations linked to the actual selected option;
- governed Hindi and Punjabi time expressions;
- exact answer/option, trap/option and English mathematical parity;
- valid localized packages;
- `editorialStatus: PENDING`;
- `publiclyPublishable: false`.

## Verdict

```text
ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING
```

CP-005 is ready for product-owner/native-speaker approval but is not manually frozen or eligible for Question Studio or public integration.