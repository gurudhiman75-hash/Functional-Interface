# DIR-001 Hindi Localization Implementation Report

Status: Hindi runtime implemented on a feature branch; exact-head validation and manual Hindi editorial approval pending.

## Baseline

The source of truth is the frozen English Direction and Distance baseline:

```text
4cff84745fe845b38aad91d60f7f42830c2a13cc
```

The Hindi runtime preserves:

- all 44 permanent QL IDs (`DIR-QL-001` through `DIR-QL-044`);
- all eight checkpoint boundaries;
- structured prompts and hidden states;
- correct answers and correct option positions;
- distractor values and misconception labels;
- difficulty and caselet identity;
- solver-verified English generation as the mathematical authority.

## Localization architecture

Hindi is generated as a language-adapted view of the frozen structured question, not by translating the final English stem word by word.

The runtime:

1. generates the approved English hidden state and answer contract;
2. renders a Hindi stem from the structured prompt for the specific QL;
3. renders option labels from canonical answer values;
4. builds a question-specific Hindi explanation;
5. localizes diagram titles, labels and accessibility text;
6. verifies answer parity before returning the item.

## Editorial terminology

The runtime intentionally uses common competitive-exam wording:

- `उत्तर`, `दक्षिण`, `पूर्व`, `पश्चिम` and compound directions;
- `मुख किस दिशा में है` rather than overly technical orientation terminology;
- `अंतिम स्थान`, `आरंभिक बिंदु`, `न्यूनतम दूरी` and `कुल चली गई दूरी`;
- `बाईं ओर`, `दाईं ओर`, `सामने`, `पीछे`;
- `बाएँ मुड़ना`, `दाएँ मुड़ना`, `पीछे मुड़ना`, `बिना मुड़े सीधे चलना`;
- `कथन`, `चिह्न`, `संकेतित शृंखला` and `संगत विन्यास` only where the task requires them.

Gender-paired constructions such as `करता/करती` and `था/थी` are not used. Sentences are written through neutral route, position and facing constructions.

## Planned proof

The dedicated Hindi proof covers:

- 44 QLs × 40 seeds = 1,760 Hindi questions;
- deterministic Hindi output;
- exact structured-state, answer, option-value and option-position parity with English;
- four unique Hindi option labels;
- Devanagari presence and English direction-word leak rejection;
- placeholder and internal-ID rejection;
- accessible localized SVG checks;
- per-QL stem and explanation diversity;
- chapter-wide answer-position balance;
- QL-042/043 paired-caselet parity;
- consolidated 88-question HTML/JSONL editorial export.

## Review state

- English baseline: frozen;
- Hindi runtime implementation: complete on feature branch;
- Hindi exact-head CI: pending;
- Hindi automated language audit: pending;
- Hindi manual editorial approval: pending;
- Punjabi: not started from this baseline;
- Question Studio exposure: not enabled;
- multilingual chapter freeze: not claimed.
