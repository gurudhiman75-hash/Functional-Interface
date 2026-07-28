# DIR-001 Punjabi Localization Report

Status: implementation prepared; exact-head validation and manual editorial approval pending.

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

The runtime prefers natural competitive-exam Punjabi, including:

- `ਮੂੰਹ ... ਵੱਲ` for facing;
- `ਖੱਬੇ/ਸੱਜੇ ਮੁੜਨਾ` for turns;
- `ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ` for shortest distance;
- `ਦੂਜੇ ਨਾਮ ਦੇ ... ਵੱਲ` for coded relation meaning;
- everyday words such as `ਰਸਤਾ`, `ਚਾਲ`, `ਥਾਂ`, `ਪਰਛਾਂਵਾਂ` and `ਕਥਨ`;
- no technical analogy-style vocabulary such as `ਪਦ` or `ਸਾਦ੍ਰਿਸ਼ਤਾ`.

## Automated proof

The exact-head Punjabi workflow validates:

```text
44 QLs × 40 seeds = 1,760 Punjabi questions
```

It checks:

- deterministic output;
- exact English state/answer/option parity;
- four unique Punjabi options;
- Gurmukhi presence;
- Devanagari and multi-letter Latin leak rejection;
- internal-ID, placeholder and unnatural slash-gender rejection;
- QL-010 decimal display parity;
- accessible localized SVGs;
- stem and explanation diversity;
- answer-position balance;
- QL-042/043 paired-caselet parity.

## Review artifact

The workflow publishes:

```text
44 QLs × 2 seeds = 88 review questions
```

The artifact includes Punjabi stems, options, answers, explanations, diagrams and JSONL machine output.

## Remaining gates

1. exact-head Punjabi workflow;
2. all existing English/Hindi/checkpoint regressions;
3. hosted artifact audit;
4. manual Punjabi editorial approval;
5. merge into `feat/reasoning-dir-001-design`.
