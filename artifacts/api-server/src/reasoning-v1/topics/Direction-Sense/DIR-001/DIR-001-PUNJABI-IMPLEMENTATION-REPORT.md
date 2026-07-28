# DIR-001 Punjabi Localization Report

Status: implementation and automated audit complete; manual Punjabi approval pending.

## Scope

This phase adds Punjabi (`pa-IN`) for the frozen Direction and Distance English baseline and the approved Hindi-integrated chapter head.

The Punjabi runtime covers all 44 reviewed QLs:

```text
DIR-QL-001 through DIR-QL-044
```

All eight checkpoint boundaries remain unchanged.

## Parity contract

Punjabi preserves the English runtime's:

- structured prompt;
- correct answer and option index;
- option values and error labels;
- difficulty;
- diagrams and caselet identity;
- deterministic seed behaviour.

Only learner-facing text is language-adapted.

## Editorial policy

Punjabi is generated directly from structured question data rather than translated from Hindi output.

The reviewed runtime uses:

- `ਮੂੰਹ ... ਵੱਲ` for facing;
- `ਖੱਬੇ/ਸੱਜੇ ਮੁੜਨਾ` for turns;
- `ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ` for shortest distance;
- `ਦੂਜੇ ਨਾਮ ਦੇ ... ਵੱਲ` for coded relation meaning;
- gender-neutral journey constructions such as `ਦੀ ਯਾਤਰਾ ... ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ`;
- everyday words such as `ਰਸਤਾ`, `ਚਾਲ`, `ਥਾਂ`, `ਪਰਛਾਂਵਾਂ`, `ਨਕਸ਼ਾ` and `ਕਥਨ`;
- natural postpositions such as `ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ`;
- no analogy-style vocabulary such as `ਪਦ` or `ਸਾਦ੍ਰਿਸ਼ਤਾ`;
- no formal direction language such as `ਦਿਸ਼ਾ-ਫਰੇਮ`, `ਅੰਤਿਮ ਖਿਸਕਾਅ` or `ਸ਼ੁੱਧ ਲੰਬਕਾਰੀ`.

## Exact-head automated proof

Validated implementation head before this report update:

```text
6c2fca4b6c9f42362aee2b4f10bfd659e089bca5
```

Punjabi workflow run:

```text
30322922091
```

Validated corpus:

```text
44 QLs × 40 seeds = 1,760 Punjabi questions
```

The proof passed:

- deterministic output;
- exact English structured-state, answer, option-value, error-label and correct-position parity;
- four unique Punjabi options per item;
- Gurmukhi presence;
- Devanagari and multi-letter Latin leak rejection;
- internal-ID and placeholder rejection;
- gendered journey and rejected technical-language rejection;
- duplicate-copula rejection;
- natural direction-postposition enforcement;
- QL-010 radical and one-decimal display parity;
- accessible localized SVG checks;
- at least 30 distinct stems and explanations per QL across 40 seeds;
- answer-position balance;
- QL-042/043 paired-caselet parity.

The same implementation head also passed:

- English freeze;
- Hindi localization;
- chapter-wide foundation and CP-001 through CP-004 runtime proof;
- CP-007 runtime proof;
- CP-008 runtime proof.

## Final hosted review artifact

Artifact:

```text
dir-001-punjabi-question-review
```

Evidence:

- artifact ID: `8674654207`;
- digest: `sha256:b4fba00c04b0caffa24dd15f410b53619bd75a4b91888d45a25a0915ef9fc12a`;
- 44 QLs × 2 seeds = 88 review questions;
- 88 unique displayed stems;
- 74 embedded question or explanation diagrams;
- exactly four unique options and one correct answer per item;
- zero multi-letter Latin learner-text leaks;
- zero Devanagari letter/digit leaks;
- zero gendered journey constructions;
- zero rejected technical-language findings;
- zero duplicate-copula findings;
- zero incorrect `ਦੇ ਕਿਹੜੀ ਦਿਸ਼ਾ` findings;
- approved decimal and radical display retained;
- paired caselet state and metadata parity retained.

## Remaining gates

1. current-head workflow rerun after this evidence-only report update;
2. manual Punjabi editorial approval;
3. merge into `feat/reasoning-dir-001-design`;
4. Question Studio exposure and final multilingual integration/freeze.
