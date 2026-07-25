# COD-001 CP-001 to CP-004 English Editorial Repair

Status: complete, audited and ready for merge.

## Scope

- Chapter: `COD-001` Coding–Decoding
- Checkpoints: `COD-CP-001` through `COD-CP-004`
- QL range: `COD-QL-001` through `COD-QL-112`
- QL count: `112`
- Locale: English (`en-IN`)
- Runtime status: `RUNTIME_PROOF`
- Publicly publishable: `false`

This repair changes the student-facing language and review contracts without adding a new coding family or changing the intended mathematical answers.

## Reference basis

The rewrite was informed by the uploaded competitive-reasoning reference material and by standard SSC, Banking, Railway and state-exam coding-decoding presentation conventions. The reference material consistently presents coding questions through short visible examples, asks a direct encode/decode/recovery question, and explains the operative correspondence without exposing implementation terminology.

No reference wording is copied as a fixed template. The runtime uses independently authored deterministic language variants and the existing rule architecture.

## Problems repaired

### 1. Incomplete recovery questions

Every missing-number or missing-letter question now carries and renders an explicit masked target code.

Examples:

- sequence code: `23-9-?-7`;
- letter code: `KDL?R`;
- scalar code: `WORD → ?`.

The mask is stored in `displayedTargetCode`, contains exactly one `?`, and is aligned with `missingIndex` whenever the code has multiple positions.

### 2. Full English stem rewrite

All 112 QLs now use direct competitive-exam wording such as:

- `In a certain code, ... How will ... be coded?`
- `If ..., which word is represented by ...?`
- `Study these examples: ... Decode ...`
- `Complete WORD → MASKED-CODE.`

Removed student-facing implementation terms include:

- branch / branches;
- structured shift or transformation;
- position-dependent / class-dependent;
- hidden position;
- recover the substitution;
- malformed clause joins such as `the rule is used in WORD is coded as ...`.

### 3. Concise, rule-specific explanations

Explanations now:

1. state the inferred rule in ordinary language;
2. prove it using one or two useful examples;
3. apply it completely to the target;
4. state the answer;
5. reject one actual displayed distractor.

CP-004 explanations use one evidence example to avoid repeating every letter calculation across three or four examples.

### 4. Distractor-specific feedback

The former checkpoint-wide generic trap paragraphs were removed. The explanation now identifies an actual wrong option and describes its diagnosed error, including:

- reversed order;
- position swap;
- wrong shift direction;
- off-by-one movement;
- omitted or reversed word-length adjustment;
- zero-based or reversed position weights;
- odd/even total used instead of the difference;
- vowel/consonant or endpoint/interior movements exchanged.

This also removes the former contradictions in which forward-rank or opposite-letter methods were rejected even when they were the correct rule.

### 5. Stable difficulty

Difficulty is now determined from the QL's reasoning structure rather than randomly changing with the selected word, shift magnitude, constant or wrap occurrence.

- direct one-step encodes remain Easy where appropriate;
- decode, inference and recovery tasks generally move to Medium;
- competing signed-rule inference and multi-branch reversal tasks can be Hard;
- all 112 QLs retain one stable difficulty across seeds.

### 6. Numerical distractor repair

CP-002 scalar distractors now come from plausible diagnosed mistakes rather than arbitrary remote values:

- omitted length adjustment;
- wrong sign;
- length applied twice;
- position weights omitted;
- zero-based position weights;
- reversed position weights;
- odd/even totals added;
- last letter omitted;
- nearby arithmetic slip.

## Runtime version changes

- `COD-CP-001`: `cod-001-cp001-v2`
- `COD-CP-002`: `cod-001-cp002-v2`
- `COD-CP-003`: `cod-001-cp003-v2`
- `COD-CP-004`: `cod-001-cp004-v2`

## Validation

### Existing exhaustive checkpoint audits

- CP-001: `24 QLs × 100 seeds = 2,400` questions
- CP-002: `28 QLs × 100 seeds = 2,800` questions
- CP-003: `28 QLs × 100 seeds = 2,800` questions
- CP-004: `32 QLs × 100 seeds = 3,200` questions

Total existing runtime audit generation: `11,200` questions.

### New chapter-wide editorial regression audit

The new `cod-cp001-cp004-editorial.test.ts` renders:

- `112 QLs × 20 seeds = 2,240` questions.

It permanently enforces:

- visible single blank for every recovery question;
- correct blank index and code length;
- absence of implementation vocabulary and known malformed joins;
- stable difficulty for every QL;
- explanation length limit;
- one or two evidence demonstrations only;
- CP-004 one-example proof limit;
- trap feedback tied to an actual displayed option;
- removal of the former contradictory generic trap text.

### Editorial review corpus

The workflow additionally exports:

- all `112 QLs` at seed 1 in readable Markdown;
- all `112 QLs × 5 seeds = 560` complete question payloads in JSONL.

Final corpus observations:

- exact stems are unique across all 560 rendered questions;
- no banned or malformed stem pattern remains;
- all 112 QLs have stable difficulty;
- all masked-code questions visibly show exactly one blank;
- trap feedback is highly varied and tied to displayed wrong options;
- maximum explanation length remains below the enforced 145-word ceiling.

## CI result

The final repair head passed:

- COD-CP-001 exhaustive runtime audit;
- COD-CP-002 exhaustive runtime audit;
- COD-CP-003 exhaustive runtime audit;
- COD-CP-004 exhaustive runtime audit;
- CP-001 to CP-004 editorial regression audit;
- review corpus export and artifact upload;
- Render production build validation.

The broad integrated-admin workflow continues to fail independently on the current project line and is unrelated to the Coding–Decoding-only files changed here.

## Release boundary

These checkpoints remain:

- English runtime proof only;
- `publiclyPublishable: false`;
- not wired into Question Studio discovery;
- awaiting later Hindi/Punjabi localization and chapter-wide publication freeze.

`COD-CP-005` must begin from this repaired English authority after the repair PR is merged.
