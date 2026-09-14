# PUN-001 CP003 — Noun & Pronoun Forward Port

Status: `REVIEW_ONLY`

This is a fresh audited forward-port of Punjabi noun/pronoun grammar. It does not wholesale-merge donor CP003 history.

## Taxonomy contract

Punjabi semantic noun classification is kept to the five source-supported classes:

- ਨਿੱਜਵਾਚਕ ਨਾਂਵ
- ਜਾਤੀਵਾਚਕ ਨਾਂਵ
- ਇਕੱਠਵਾਚਕ ਨਾਂਵ
- ਵਸਤੂ-ਵਾਚਕ / ਪਦਾਰਥਬੋਧਕ ਨਾਂਵ
- ਭਾਵਵਾਚਕ ਨਾਂਵ

The donor-only split between `VASTU` and `DRAVMAN` is rejected as duplicate semantic truth. `MISHRAT` is word-formation structure and belongs outside the semantic noun taxonomy.

Pronouns are covered contextually across six exam-relevant classes:

- ਪੁਰਖ-ਵਾਚਕ
- ਨਿੱਜ-ਵਾਚਕ
- ਨਿਸ਼ਚੇ-ਵਾਚਕ
- ਅਨਿਸ਼ਚੇ-ਵਾਚਕ
- ਸੰਬੰਧ-ਵਾਚਕ
- ਪ੍ਰਸ਼ਨ-ਵਾਚਕ

Interrogative adverbs such as `ਕਿੱਥੋਂ`, `ਕਦੋਂ`, and `ਕਿਵੇਂ` are explicitly excluded from the pronoun target corpus.

## Exhaustive breadth

- 225 noun authorities — 45 in each noun class;
- 60 contextual pronoun authorities — 10 in each pronoun class;
- 40 pronoun-inflection relations across 8 core inflection paradigms;
- 325 total atomic linguistic authorities;
- 12 operation-specific semantic families;
- 13,702,846 computed semantic content combinations;
- option-order permutations are excluded from the capacity number.

## Ambiguity hardening

- bare `ਇਹ` and `ਉਹ` are not used to claim singular/plural person-number contrasts;
- direct person-number questions are restricted to `ਮੈਂ`, `ਅਸੀਂ`, `ਤੂੰ`, and `ਤੁਸੀਂ`;
- third-person near/far forms remain available in contextual and inflection families, where number is made explicit by the derived form or label;
- demonstrative examples use deictic contrast so personal and demonstrative readings are not silently conflated;
- context-sensitive collective nouns are excluded from isolated classification questions.

## Difficulty contract

Difficulty is operation-driven:

- Easy: one direct classification/person-number decision;
- Medium: reverse selection, context selection, inflection or four-item contrast;
- Hard: two or three linked grammatical decisions in one question.

Negative wording, rare vocabulary and instruction paraphrases are not used to manufacture difficulty.

## Editorial contract

- concise Punjabi exam-style stems;
- contextual classification where an isolated pronoun form can be ambiguous;
- no option-by-option explanation filler;
- no English leakage in native question surfaces;
- NFC-normalized authority and generated text;
- semantic fingerprints depend on actual content, not seed placeholders;
- all authorities remain `REVIEW_PENDING`;
- Question Bank/test/mock/public delivery remains closed until explicit promotion.

## Source basis

Taxonomy was cross-checked against Punjabi University / Punjabipedia grammar material. The forward-port deliberately corrects donor taxonomy where donor categories or examples cross grammatical class boundaries.
