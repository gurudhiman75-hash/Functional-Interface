# DIR-001 Punjabi Localization Report

Status: mathematical/runtime validation and narrative-humanization audit complete; manual Punjabi approval pending.

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

## Narrative-humanization policy

Punjabi is generated directly from structured question data rather than translated from Hindi output.

The reviewed runtime now follows these rules:

- never use `ਹੁਕਮ` as a learner-facing action label;
- never use telegraphic labels such as `ਰਸਤਾ:`;
- never list raw infinitives such as `ਸੱਜੇ ਮੁੜਨਾ`, `ਘੁੰਮਣਾ` or `ਸਿੱਧਾ ਤੁਰਨਾ` as movement instructions;
- render movements as continuous active sentences, for example `ਉਹ ਸੱਜੇ ਪਾਸੇ 90° ਮੁੜਦੀ ਹੈ`;
- conjugate `ਚੱਲਦਾ/ਚੱਲਦੀ`, `ਮੁੜਦਾ/ਮੁੜਦੀ` and `ਘੁੰਮ ਜਾਂਦਾ/ਘੁੰਮ ਜਾਂਦੀ` from explicit prompt pronouns or the reviewed Direction name-gender map;
- use `ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ` and `ਘੜੀ ਦੀ ਉਲਟ ਦਿਸ਼ਾ ਵਿੱਚ` rather than English transliterations;
- use `ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ` and `ਅੰਤਿਮ ਬਿੰਦੂ` consistently;
- use `ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ` for shortest distance;
- use natural postpositions such as `ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ`;
- retain everyday reasoning vocabulary such as `ਚਾਲ`, `ਮੋੜ`, `ਪਰਛਾਂਵਾਂ`, `ਨਕਸ਼ਾ` and `ਕਥਨ`;
- reject formal or machine-like language such as `ਦਿਸ਼ਾ-ਫਰੇਮ`, `ਅੰਤਿਮ ਖਿਸਕਾਅ`, `ਸ਼ੁੱਧ ਚਾਲ`, `ਪਦ` and `ਸਾਦ੍ਰਿਸ਼ਤਾ`.

## Explanation policy

Turn explanations now show actual angular arithmetic rather than generic instructions.

For example, the locked `DIR-QL-001`, seed `0` explanation includes:

```text
315° + 90° = 405° ≡ 45°
45° − 135° = -90° ≡ 270°
```

Journey, multi-person, coded-direction, shadow and inverse explanations use natural Punjabi reasoning steps and refer to `ਅੰਤਿਮ ਬਿੰਦੂ`, not `ਅੰਤਿਮ ਥਾਂ`.

## Exact-head automated proof

Validated implementation head before this report update:

```text
c8ffc9b392ecc695d3b014909eac2b944b031e1c
```

Punjabi workflow run:

```text
30326200399
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
- gender-correct active-verb enforcement for direct-action QLs;
- `ਹੁਕਮ`, `ਰਸਤਾ:`, raw-infinitive action-list and English-clockwise rejection;
- fixed Beena feminine and Gurpreet masculine narrative examples;
- locked degree-arithmetic explanation example;
- duplicate-copula and incorrect-postposition rejection;
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

## Hosted review artifact

Artifact:

```text
dir-001-punjabi-question-review
```

Evidence:

- artifact ID: `8675767442`;
- digest: `sha256:8460bd0cc7607682672a580a16c1e39a32b3ac2e3fa38a052167ead4ee9d41f8`;
- exact implementation head: `c8ffc9b392ecc695d3b014909eac2b944b031e1c`;
- 44 QLs × 2 seeds = 88 review questions;
- 88 unique displayed stems;
- 74 embedded question or explanation diagrams;
- exactly four unique options and one correct answer per item;
- zero `ਹੁਕਮ` findings;
- zero `ਰਸਤਾ:` findings;
- zero raw action-infinitive findings;
- zero English clockwise/anti-clockwise transliteration findings;
- zero multi-letter Latin learner-text leaks;
- zero Devanagari letter/digit leaks;
- gender-correct active movement in reviewed samples;
- approved decimal and radical display retained;
- paired caselet state and metadata parity retained.

## Remaining gates

1. current-head workflow rerun after this evidence report update;
2. manual Punjabi editorial approval;
3. merge into `feat/reasoning-dir-001-design`;
4. Question Studio exposure and final multilingual integration/freeze.
