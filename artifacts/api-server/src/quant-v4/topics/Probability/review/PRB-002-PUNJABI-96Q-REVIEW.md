# PRB-002 — Punjabi Native Question Review

> ExamTree Probability ML-06 human-review file. Contains all 96 rendered Punjabi QLs for PRB-002.
> Each item is generated from the frozen English Probability runtime and then rendered through the ML-05 native presentation overlay.
> The English runtime remains the sole mathematical, solver, options and answer-key authority.

## Review status

- **Editorial status:** PENDING HUMAN REVIEW
- **Question Bank:** NOT STORED
- **Scored mocks:** DISABLED
- **Student/public release:** DISABLED
- **QLs in this file:** 96
- **Required action:** mark each item APPROVED or CHANGES_REQUIRED and add reviewer/date evidence.

## Review method

Review the native question against the English authority immediately above it. Focus on natural exam wording, exact mathematical meaning, exact scenario/context preservation, correct terminology, option logic, and student-friendly explanation quality. Do not approve merely because automated parity passed.

---

## 1. PRB-QL-501 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-501`
- **Parameter fingerprint:** `c5d5a8e3dccc3efbdccc3efbc5d5a8e3`
- **Mathematical fingerprint:** `46013ac3568d3fdb568d3fdb46013ac3`

### English source authority

A jar contains 8 red and 6 blue marbles. One marble is selected and replaced before a second selection. What is the probability that both selected marbles are red?

### Native question to review

ਇੱਕ ਜਾਰ ਵਿੱਚ 8 ਲਾਲ ਅਤੇ 6 ਨੀਲੇ ਕੰਚੇ ਹਨ। ਇੱਕ ਕੰਚਾ ਚੁਣ ਕੇ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਫਿਰ ਦੂਜਾ ਕੰਚਾ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਦੋਵੇਂ ਚੁਣੇ ਕੰਚਿਆਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{16}{49}\)
- **B.** \(\frac{17}{49}\)
- **C.** \(\frac{33}{49}\)
- **D.** \(\frac{8}{25}\)
- **E.** \(\frac{15}{49}\)

**Correct answer:** A. \(\frac{16}{49}\)

**English-runtime answer value:** \(\frac{16}{49}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਕੰਚੇ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(64/196=16/49\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{16}{49}\)

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — The first marble is replaced, so the container again has 8 red and 6 blue marbles before the second selection.
3. Step 2 — Thus, \(P\!\left(red marble on each selection\right)\) = \(\frac{8}{14}\).
4. Step 3 — \(P\!\left(both red marbles\right)\) = \(\frac{8}{14}\) \(\times\) \(\frac{8}{14}\) = \(\frac{16}{49}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{16}{49}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 2. PRB-QL-502 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-502`
- **Parameter fingerprint:** `cee7b5d61f94b0121f94b012cee7b5d6`
- **Mathematical fingerprint:** `189a9a076564e8ff6564e8ff189a9a07`

### English source authority

A box contains 7 red and 8 blue pens. Two pens are selected one after another without replacement. What is the probability that both are red?

### Native question to review

ਇੱਕ ਬਾਕਸ ਵਿੱਚ 7 ਲਾਲ ਅਤੇ 8 ਨੀਲੇ ਪੈਨ ਹਨ। ਦੋ ਪੈਨ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ। ਦੋਵੇਂ ਚੁਣੇ ਪੈਨਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** 0
- **B.** \(\frac{2}{5}\)
- **C.** \(\frac{4}{5}\)
- **D.** \(\frac{49}{225}\)
- **E.** \(\frac{1}{5}\)

**Correct answer:** E. \(\frac{1}{5}\)

**English-runtime answer value:** \(\frac{1}{5}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਪੈਨ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(42/210=1/5\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{5}\)

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — On the first selection, \(P\!\left(red pen\right)\) = \(\frac{7}{15}\).
3. Step 2 — After one red pen is removed, 6 red pens remain among 14 pens.
4. Step 3 — \(P\!\left(both red pens\right)\) = \(\frac{7}{15}\) \(\times\) \(\frac{6}{14}\) = \(\frac{1}{5}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{1}{5}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 3. PRB-QL-503 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-503`
- **Parameter fingerprint:** `b9b7ba3cb10d8e30b10d8e30b9b7ba3c`
- **Mathematical fingerprint:** `34dfef1cc81cfd10c81cfd1034dfef1c`

### English source authority

A pouch contains 6 red and 8 blue coloured stones. One stone is drawn and replaced before a second selection. What is the probability that both selected coloured stones are red?

### Native question to review

ਇੱਕ ਪਾਊਚ ਵਿੱਚ 6 ਲਾਲ ਅਤੇ 8 ਨੀਲੇ ਰੰਗੀਨ ਪੱਥਰ ਹਨ। ਇੱਕ ਰੰਗੀਨ ਪੱਥਰ ਕੱਢ ਕੇ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਫਿਰ ਦੂਜਾ ਰੰਗੀਨ ਪੱਥਰ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਦੋਵੇਂ ਚੁਣੇ ਰੰਗੀਨ ਪੱਥਰਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{8}{49}\)
- **B.** \(\frac{9}{50}\)
- **C.** \(\frac{10}{49}\)
- **D.** \(\frac{40}{49}\)
- **E.** \(\frac{9}{49}\)

**Correct answer:** E. \(\frac{9}{49}\)

**English-runtime answer value:** \(\frac{9}{49}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਰੰਗੀਨ ਪੱਥਰ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(36/196=9/49\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{9}{49}\)

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — The first stone is replaced, so the container again has 6 red and 8 blue coloured stones before the second selection.
3. Step 2 — Thus, \(P\!\left(red stone on each selection\right)\) = \(\frac{6}{14}\).
4. Step 3 — \(P\!\left(both red coloured stones\right)\) = \(\frac{6}{14}\) \(\times\) \(\frac{6}{14}\) = \(\frac{9}{49}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{9}{49}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 4. PRB-QL-504 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-504`
- **Parameter fingerprint:** `1b54df19fa6ccda1fa6ccda11b54df19`
- **Mathematical fingerprint:** `0a5ff99d5da467855da467850a5ff99d`

### English source authority

A bag contains 8 red and 7 blue balls. Two balls are selected one after another without replacement. What is the probability that both are red?

### Native question to review

ਇੱਕ ਬੈਗ ਵਿੱਚ 8 ਲਾਲ ਅਤੇ 7 ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{11}{15}\)
- **C.** \(\frac{1}{5}\)
- **D.** \(\frac{64}{225}\)
- **E.** \(\frac{4}{15}\)

**Correct answer:** E. \(\frac{4}{15}\)

**English-runtime answer value:** \(\frac{4}{15}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਗੇਂਦਾਂ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(56/210=4/15\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{4}{15}\)

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — On the first selection, \(P\!\left(red ball\right)\) = \(\frac{8}{15}\).
3. Step 2 — After one red ball is removed, 7 red balls remain among 14 balls.
4. Step 3 — \(P\!\left(both red balls\right)\) = \(\frac{8}{15}\) \(\times\) \(\frac{7}{14}\) = \(\frac{4}{15}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{4}{15}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 5. PRB-QL-505 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-505`
- **Parameter fingerprint:** `72d6a7b328f4306b28f4306b72d6a7b3`
- **Mathematical fingerprint:** `c1d1f5a9ed4b3351ed4b3351c1d1f5a9`

### English source authority

A jar contains 7 red and 6 blue marbles. Two marbles are selected one after another without replacement. What is the probability of getting red first and blue second?

### Native question to review

ਇੱਕ ਜਾਰ ਵਿੱਚ 7 ਲਾਲ ਅਤੇ 6 ਨੀਲੇ ਕੰਚੇ ਹਨ। ਦੋ ਕੰਚੇ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ। ਪਹਿਲਾਂ ਲਾਲ ਅਤੇ ਫਿਰ ਨੀਲਾ ਕੰਚਾ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{4}{13}\)
- **B.** \(\frac{19}{26}\)
- **C.** \(\frac{7}{26}\)
- **D.** \(\frac{7}{27}\)
- **E.** \(\frac{3}{13}\)

**Correct answer:** C. \(\frac{7}{26}\)

**English-runtime answer value:** \(\frac{7}{26}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਕੰਚੇ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(42/156=7/26\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{7}{26}\)

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — The order is fixed: a red marble must occur first and a blue marble second.
3. Step 2 — \(P\!\left(red first\right)\) = \(\frac{7}{13}\); after that, \(P\!\left(blue second\right)\) = \(\frac{6}{12}\).
4. Step 3 — Required probability = \(\frac{7}{13}\) \(\times\) \(\frac{6}{12}\) = \(\frac{7}{26}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{7}{26}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 6. PRB-QL-506 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-506`
- **Parameter fingerprint:** `d115f91bb0fe4e43b0fe4e43d115f91b`
- **Mathematical fingerprint:** `b527aaf21c382cce1c382cceb527aaf2`

### English source authority

A box contains 7 red and 9 blue pens. Two pens are selected one after another without replacement. What is the probability that both are of the same colour?

### Native question to review

ਇੱਕ ਬਾਕਸ ਵਿੱਚ 7 ਲਾਲ ਅਤੇ 9 ਨੀਲੇ ਪੈਨ ਹਨ। ਦੋ ਪੈਨ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ। ਦੋਵੇਂ ਪੈਨਾਂ ਦੇ ਇੱਕੋ ਰੰਗ ਦੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{9}{20}\)
- **B.** \(\frac{21}{40}\)
- **C.** \(\frac{49}{256}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{19}{40}\)

**Correct answer:** E. \(\frac{19}{40}\)

**English-runtime answer value:** \(\frac{19}{40}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਪੈਨ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(114/240=19/40\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{19}{40}\)

### English explanation authority

1. Method — The pens can have the same colour in two mutually exclusive orders: red-red or blue-blue. Calculate both probabilities and add them.
2. Step 1 — \(P\!\left(red-red\right)\) = \(\frac{7}{16}\) \(\times\) \(\frac{6}{15}\) = \(\frac{42}{240}\).
3. Step 2 — \(P\!\left(blue-blue\right)\) = \(\frac{9}{16}\) \(\times\) \(\frac{8}{15}\) = \(\frac{72}{240}\).
4. Step 3 — \(P\!\left(same colour\right)\) = \(\frac{42}{240}\) + \(\frac{72}{240}\) = \(\frac{114}{240}\).
5. Simplification — Divide the numerator and denominator by 6: (114 \(\div\) 6)/(240 \(\div\) 6) = \(\frac{19}{40}\).
6. Key point — Red-red and blue-blue cannot occur together, so their probabilities are added.
7. Answer — The required probability is \(\frac{19}{40}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 7. PRB-QL-507 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-507`
- **Parameter fingerprint:** `962abe5ad5020ae6d5020ae6962abe5a`
- **Mathematical fingerprint:** `6f09ed6c82d8ba0082d8ba006f09ed6c`

### English source authority

A pouch contains 5 red and 9 blue coloured stones. Two coloured stones are selected one after another without replacement. What is the probability that they are of different colours?

### Native question to review

ਇੱਕ ਪਾਊਚ ਵਿੱਚ 5 ਲਾਲ ਅਤੇ 9 ਨੀਲੇ ਰੰਗੀਨ ਪੱਥਰ ਹਨ। ਦੋ ਰੰਗੀਨ ਪੱਥਰ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੇ ਜਾਂਦੇ ਹਨ। ਦੋਵੇਂ ਰੰਗੀਨ ਪੱਥਰਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਰੰਗ ਦੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{45}{182}\)
- **B.** \(\frac{25}{196}\)
- **C.** \(\frac{45}{91}\)
- **D.** \(\frac{46}{91}\)
- **E.** \(\frac{44}{91}\)

**Correct answer:** C. \(\frac{45}{91}\)

**English-runtime answer value:** \(\frac{45}{91}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਰੰਗੀਨ ਪੱਥਰ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(90/182=45/91\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{45}{91}\)

### English explanation authority

1. Method — Different colours can occur in two mutually exclusive orders for the coloured stones: red-blue or blue-red. Calculate both and add them.
2. Step 1 — \(P\!\left(red-blue\right)\) = \(\frac{5}{14}\) \(\times\) \(\frac{9}{13}\) = \(\frac{45}{182}\).
3. Step 2 — \(P\!\left(blue-red\right)\) = \(\frac{9}{14}\) \(\times\) \(\frac{5}{13}\) = \(\frac{45}{182}\).
4. Step 3 — \(P\!\left(different colours\right)\) = \(\frac{45}{182}\) + \(\frac{45}{182}\) = \(\frac{90}{182}\).
5. Simplification — Divide the numerator and denominator by 2: (90 \(\div\) 2)/(182 \(\div\) 2) = \(\frac{45}{91}\).
6. Key point — Both possible colour orders must be included because the draws are successive.
7. Answer — The required probability is \(\frac{45}{91}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 8. PRB-QL-508 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-508`
- **Parameter fingerprint:** `449e99e877ffbf1c77ffbf1c449e99e8`
- **Mathematical fingerprint:** `24d06b5cc5773cd0c5773cd024d06b5c`

### English source authority

A bag contains 7 red and 9 blue balls. Two selections are made with replacement. What is the probability of getting at least one red ball?

### Native question to review

ਇੱਕ ਬੈਗ ਵਿੱਚ 7 ਲਾਲ ਅਤੇ 9 ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਵਾਰ ਚੋਣ ਕੀਤੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਹਰ ਵਾਰ ਵਸਤੂ ਵਾਪਸ ਰੱਖ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਗੇਂਦ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{87}{128}\)
- **B.** \(\frac{81}{256}\)
- **C.** \(\frac{175}{257}\)
- **D.** \(\frac{11}{16}\)
- **E.** \(\frac{175}{256}\)

**Correct answer:** E. \(\frac{175}{256}\)

**English-runtime answer value:** \(\frac{175}{256}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਗੇਂਦਾਂ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(175/256=175/256\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{175}{256}\)

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — Use the complement: at least one red ball fails only when both selected balls are blue.
3. Step 2 — Replacement keeps \(P\!\left(blue ball\right)\) = \(\frac{9}{16}\) on both selections.
4. Step 3 — \(P\!\left(at least one red ball\right)\) = 1 - (\(\frac{9}{16}\) \(\times\) \(\frac{9}{16}\)) = \(\frac{175}{256}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{175}{256}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 9. PRB-QL-509 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-509`
- **Parameter fingerprint:** `8877a59ccb4fd790cb4fd7908877a59c`
- **Mathematical fingerprint:** `5194f839f8515cc1f8515cc15194f839`

### English source authority

A jar contains 8 red and 9 blue marbles. One marble is selected and replaced before a second selection. What is the probability that both selected marbles are red?

### Native question to review

ਇੱਕ ਜਾਰ ਵਿੱਚ 8 ਲਾਲ ਅਤੇ 9 ਨੀਲੇ ਕੰਚੇ ਹਨ। ਇੱਕ ਕੰਚਾ ਚੁਣ ਕੇ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਫਿਰ ਦੂਜਾ ਕੰਚਾ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਦੋਵੇਂ ਚੁਣੇ ਕੰਚਿਆਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{225}{289}\)
- **B.** \(\frac{32}{145}\)
- **C.** \(\frac{64}{289}\)
- **D.** \(\frac{65}{289}\)
- **E.** \(\frac{63}{289}\)

**Correct answer:** C. \(\frac{64}{289}\)

**English-runtime answer value:** \(\frac{64}{289}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਕੰਚੇ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(64/289=64/289\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{64}{289}\)

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — The first marble is replaced, so the container again has 8 red and 9 blue marbles before the second selection.
3. Step 2 — Thus, \(P\!\left(red marble on each selection\right)\) = \(\frac{8}{17}\).
4. Step 3 — \(P\!\left(both red marbles\right)\) = \(\frac{8}{17}\) \(\times\) \(\frac{8}{17}\) = \(\frac{64}{289}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{64}{289}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 10. PRB-QL-510 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-510`
- **Parameter fingerprint:** `916e784dc8a5ef95c8a5ef95916e784d`
- **Mathematical fingerprint:** `44c1af0b435064534350645344c1af0b`

### English source authority

A box contains 7 red and 6 blue pens. Two pens are selected one after another without replacement. What is the probability that both are red?

### Native question to review

ਇੱਕ ਬਾਕਸ ਵਿੱਚ 7 ਲਾਲ ਅਤੇ 6 ਨੀਲੇ ਪੈਨ ਹਨ। ਦੋ ਪੈਨ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ। ਦੋਵੇਂ ਚੁਣੇ ਪੈਨਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{19}{26}\)
- **B.** \(\frac{49}{169}\)
- **C.** \(\frac{7}{26}\)
- **D.** \(\frac{4}{13}\)
- **E.** \(\frac{3}{13}\)

**Correct answer:** C. \(\frac{7}{26}\)

**English-runtime answer value:** \(\frac{7}{26}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਪੈਨ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(42/156=7/26\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{7}{26}\)

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — On the first selection, \(P\!\left(red pen\right)\) = \(\frac{7}{13}\).
3. Step 2 — After one red pen is removed, 6 red pens remain among 12 pens.
4. Step 3 — \(P\!\left(both red pens\right)\) = \(\frac{7}{13}\) \(\times\) \(\frac{6}{12}\) = \(\frac{7}{26}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{7}{26}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 11. PRB-QL-511 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-511`
- **Parameter fingerprint:** `b9a0227e318b102a318b102ab9a0227e`
- **Mathematical fingerprint:** `df43df271564841f1564841fdf43df27`

### English source authority

A pouch contains 5 red and 4 blue coloured stones. One stone is drawn and replaced before a second selection. What is the probability that both selected coloured stones are red?

### Native question to review

ਇੱਕ ਪਾਊਚ ਵਿੱਚ 5 ਲਾਲ ਅਤੇ 4 ਨੀਲੇ ਰੰਗੀਨ ਪੱਥਰ ਹਨ। ਇੱਕ ਰੰਗੀਨ ਪੱਥਰ ਕੱਢ ਕੇ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਫਿਰ ਦੂਜਾ ਰੰਗੀਨ ਪੱਥਰ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਦੋਵੇਂ ਚੁਣੇ ਰੰਗੀਨ ਪੱਥਰਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{25}{82}\)
- **B.** \(\frac{8}{27}\)
- **C.** \(\frac{26}{81}\)
- **D.** \(\frac{25}{81}\)
- **E.** \(\frac{56}{81}\)

**Correct answer:** D. \(\frac{25}{81}\)

**English-runtime answer value:** \(\frac{25}{81}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਰੰਗੀਨ ਪੱਥਰ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(25/81=25/81\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{25}{81}\)

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — The first stone is replaced, so the container again has 5 red and 4 blue coloured stones before the second selection.
3. Step 2 — Thus, \(P\!\left(red stone on each selection\right)\) = \(\frac{5}{9}\).
4. Step 3 — \(P\!\left(both red coloured stones\right)\) = \(\frac{5}{9}\) \(\times\) \(\frac{5}{9}\) = \(\frac{25}{81}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{25}{81}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 12. PRB-QL-512 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-512`
- **Parameter fingerprint:** `ceaba0e54ccddbbd4ccddbbdceaba0e5`
- **Mathematical fingerprint:** `4f2c3d55a54a4e0da54a4e0d4f2c3d55`

### English source authority

A bag contains 6 red and 9 blue balls. Two balls are selected one after another without replacement. What is the probability that both are red?

### Native question to review

ਇੱਕ ਬੈਗ ਵਿੱਚ 6 ਲਾਲ ਅਤੇ 9 ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** 0
- **B.** \(\frac{2}{7}\)
- **C.** \(\frac{6}{7}\)
- **D.** \(\frac{1}{7}\)
- **E.** \(\frac{4}{25}\)

**Correct answer:** D. \(\frac{1}{7}\)

**English-runtime answer value:** \(\frac{1}{7}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਗੇਂਦਾਂ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(30/210=1/7\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{7}\)

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — On the first selection, \(P\!\left(red ball\right)\) = \(\frac{6}{15}\).
3. Step 2 — After one red ball is removed, 5 red balls remain among 14 balls.
4. Step 3 — \(P\!\left(both red balls\right)\) = \(\frac{6}{15}\) \(\times\) \(\frac{5}{14}\) = \(\frac{1}{7}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{1}{7}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 13. PRB-QL-513 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-513`
- **Parameter fingerprint:** `22e647e2106101de106101de22e647e2`
- **Mathematical fingerprint:** `fb2955d1e6bba769e6bba769fb2955d1`

### English source authority

A jar contains 9 red and 8 blue marbles. Two marbles are selected one after another without replacement. What is the probability of getting red first and blue second?

### Native question to review

ਇੱਕ ਜਾਰ ਵਿੱਚ 9 ਲਾਲ ਅਤੇ 8 ਨੀਲੇ ਕੰਚੇ ਹਨ। ਦੋ ਕੰਚੇ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ। ਪਹਿਲਾਂ ਲਾਲ ਅਤੇ ਫਿਰ ਨੀਲਾ ਕੰਚਾ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{9}{34}\)
- **B.** \(\frac{9}{35}\)
- **C.** \(\frac{5}{17}\)
- **D.** \(\frac{4}{17}\)
- **E.** \(\frac{25}{34}\)

**Correct answer:** A. \(\frac{9}{34}\)

**English-runtime answer value:** \(\frac{9}{34}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਕੰਚੇ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(72/272=9/34\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{9}{34}\)

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — The order is fixed: a red marble must occur first and a blue marble second.
3. Step 2 — \(P\!\left(red first\right)\) = \(\frac{9}{17}\); after that, \(P\!\left(blue second\right)\) = \(\frac{8}{16}\).
4. Step 3 — Required probability = \(\frac{9}{17}\) \(\times\) \(\frac{8}{16}\) = \(\frac{9}{34}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{9}{34}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 14. PRB-QL-514 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-514`
- **Parameter fingerprint:** `0694ce9fd6cd92e7d6cd92e70694ce9f`
- **Mathematical fingerprint:** `a9a22aa19507f1d99507f1d9a9a22aa1`

### English source authority

A box contains 9 red and 6 blue pens. Two pens are selected one after another without replacement. What is the probability that both are of the same colour?

### Native question to review

ਇੱਕ ਬਾਕਸ ਵਿੱਚ 9 ਲਾਲ ਅਤੇ 6 ਨੀਲੇ ਪੈਨ ਹਨ। ਦੋ ਪੈਨ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ। ਦੋਵੇਂ ਪੈਨਾਂ ਦੇ ਇੱਕੋ ਰੰਗ ਦੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{9}{25}\)
- **B.** \(\frac{18}{35}\)
- **C.** \(\frac{16}{35}\)
- **D.** \(\frac{17}{35}\)
- **E.** \(\frac{17}{36}\)

**Correct answer:** D. \(\frac{17}{35}\)

**English-runtime answer value:** \(\frac{17}{35}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਪੈਨ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(102/210=17/35\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{17}{35}\)

### English explanation authority

1. Method — The pens can have the same colour in two mutually exclusive orders: red-red or blue-blue. Calculate both probabilities and add them.
2. Step 1 — \(P\!\left(red-red\right)\) = \(\frac{9}{15}\) \(\times\) \(\frac{8}{14}\) = \(\frac{72}{210}\).
3. Step 2 — \(P\!\left(blue-blue\right)\) = \(\frac{6}{15}\) \(\times\) \(\frac{5}{14}\) = \(\frac{30}{210}\).
4. Step 3 — \(P\!\left(same colour\right)\) = \(\frac{72}{210}\) + \(\frac{30}{210}\) = \(\frac{102}{210}\).
5. Simplification — Divide the numerator and denominator by 6: (102 \(\div\) 6)/(210 \(\div\) 6) = \(\frac{17}{35}\).
6. Key point — Red-red and blue-blue cannot occur together, so their probabilities are added.
7. Answer — The required probability is \(\frac{17}{35}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 15. PRB-QL-515 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-515`
- **Parameter fingerprint:** `a7680a60cd4f5224cd4f5224a7680a60`
- **Mathematical fingerprint:** `08e637445dda99285dda992808e63744`

### English source authority

A pouch contains 6 red and 5 blue coloured stones. Two coloured stones are selected one after another without replacement. What is the probability that they are of different colours?

### Native question to review

ਇੱਕ ਪਾਊਚ ਵਿੱਚ 6 ਲਾਲ ਅਤੇ 5 ਨੀਲੇ ਰੰਗੀਨ ਪੱਥਰ ਹਨ। ਦੋ ਰੰਗੀਨ ਪੱਥਰ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੇ ਜਾਂਦੇ ਹਨ। ਦੋਵੇਂ ਰੰਗੀਨ ਪੱਥਰਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਰੰਗ ਦੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{36}{121}\)
- **B.** \(\frac{3}{11}\)
- **C.** \(\frac{7}{11}\)
- **D.** \(\frac{6}{11}\)
- **E.** \(\frac{5}{11}\)

**Correct answer:** D. \(\frac{6}{11}\)

**English-runtime answer value:** \(\frac{6}{11}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਰੰਗੀਨ ਪੱਥਰ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(60/110=6/11\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{6}{11}\)

### English explanation authority

1. Method — Different colours can occur in two mutually exclusive orders for the coloured stones: red-blue or blue-red. Calculate both and add them.
2. Step 1 — \(P\!\left(red-blue\right)\) = \(\frac{6}{11}\) \(\times\) \(\frac{5}{10}\) = \(\frac{30}{110}\).
3. Step 2 — \(P\!\left(blue-red\right)\) = \(\frac{5}{11}\) \(\times\) \(\frac{6}{10}\) = \(\frac{30}{110}\).
4. Step 3 — \(P\!\left(different colours\right)\) = \(\frac{30}{110}\) + \(\frac{30}{110}\) = \(\frac{60}{110}\).
5. Simplification — Divide the numerator and denominator by 10: (60 \(\div\) 10)/(110 \(\div\) 10) = \(\frac{6}{11}\).
6. Key point — Both possible colour orders must be included because the draws are successive.
7. Answer — The required probability is \(\frac{6}{11}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 16. PRB-QL-516 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-516`
- **Parameter fingerprint:** `80002f6b594296335942963380002f6b`
- **Mathematical fingerprint:** `fba2d1dddd9e6345dd9e6345fba2d1dd`

### English source authority

A bag contains 9 red and 6 blue balls. Two selections are made with replacement. What is the probability of getting at least one red ball?

### Native question to review

ਇੱਕ ਬੈਗ ਵਿੱਚ 9 ਲਾਲ ਅਤੇ 6 ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਵਾਰ ਚੋਣ ਕੀਤੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਹਰ ਵਾਰ ਵਸਤੂ ਵਾਪਸ ਰੱਖ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਗੇਂਦ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{4}{5}\)
- **B.** \(\frac{21}{25}\)
- **C.** \(\frac{21}{26}\)
- **D.** \(\frac{22}{25}\)
- **E.** \(\frac{4}{25}\)

**Correct answer:** B. \(\frac{21}{25}\)

**English-runtime answer value:** \(\frac{21}{25}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਗੇਂਦਾਂ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(189/225=21/25\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{21}{25}\)

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — Use the complement: at least one red ball fails only when both selected balls are blue.
3. Step 2 — Replacement keeps \(P\!\left(blue ball\right)\) = \(\frac{6}{15}\) on both selections.
4. Step 3 — \(P\!\left(at least one red ball\right)\) = 1 - (\(\frac{6}{15}\) \(\times\) \(\frac{6}{15}\)) = \(\frac{21}{25}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{21}{25}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 17. PRB-QL-517 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-517`
- **Parameter fingerprint:** `f76fcb6adc5defd6dc5defd6f76fcb6a`
- **Mathematical fingerprint:** `a562811e433a554a433a554aa562811e`

### English source authority

A jar contains 7 red and 4 blue marbles. One marble is selected and replaced before a second selection. What is the probability that both selected marbles are red?

### Native question to review

ਇੱਕ ਜਾਰ ਵਿੱਚ 7 ਲਾਲ ਅਤੇ 4 ਨੀਲੇ ਕੰਚੇ ਹਨ। ਇੱਕ ਕੰਚਾ ਚੁਣ ਕੇ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਫਿਰ ਦੂਜਾ ਕੰਚਾ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਦੋਵੇਂ ਚੁਣੇ ਕੰਚਿਆਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{50}{121}\)
- **B.** \(\frac{72}{121}\)
- **C.** \(\frac{49}{121}\)
- **D.** \(\frac{48}{121}\)
- **E.** \(\frac{49}{122}\)

**Correct answer:** C. \(\frac{49}{121}\)

**English-runtime answer value:** \(\frac{49}{121}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਕੰਚੇ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(49/121=49/121\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{49}{121}\)

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — The first marble is replaced, so the container again has 7 red and 4 blue marbles before the second selection.
3. Step 2 — Thus, \(P\!\left(red marble on each selection\right)\) = \(\frac{7}{11}\).
4. Step 3 — \(P\!\left(both red marbles\right)\) = \(\frac{7}{11}\) \(\times\) \(\frac{7}{11}\) = \(\frac{49}{121}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{49}{121}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 18. PRB-QL-518 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-518`
- **Parameter fingerprint:** `dc1818365b6f00f25b6f00f2dc181836`
- **Mathematical fingerprint:** `eb2939b920573a4120573a41eb2939b9`

### English source authority

A box contains 9 red and 9 blue pens. Two pens are selected one after another without replacement. What is the probability that both are red?

### Native question to review

ਇੱਕ ਬਾਕਸ ਵਿੱਚ 9 ਲਾਲ ਅਤੇ 9 ਨੀਲੇ ਪੈਨ ਹਨ। ਦੋ ਪੈਨ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ। ਦੋਵੇਂ ਚੁਣੇ ਪੈਨਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{5}{17}\)
- **B.** \(\frac{2}{9}\)
- **C.** \(\frac{3}{17}\)
- **D.** \(\frac{4}{17}\)
- **E.** \(\frac{13}{17}\)

**Correct answer:** D. \(\frac{4}{17}\)

**English-runtime answer value:** \(\frac{4}{17}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਪੈਨ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(72/306=4/17\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{4}{17}\)

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — On the first selection, \(P\!\left(red pen\right)\) = \(\frac{9}{18}\).
3. Step 2 — After one red pen is removed, 8 red pens remain among 17 pens.
4. Step 3 — \(P\!\left(both red pens\right)\) = \(\frac{9}{18}\) \(\times\) \(\frac{8}{17}\) = \(\frac{4}{17}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{4}{17}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 19. PRB-QL-519 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-519`
- **Parameter fingerprint:** `040f854a9cd4ebb69cd4ebb6040f854a`
- **Mathematical fingerprint:** `471c98518032ede98032ede9471c9851`

### English source authority

A pouch contains 4 red and 5 blue coloured stones. One stone is drawn and replaced before a second selection. What is the probability that both selected coloured stones are red?

### Native question to review

ਇੱਕ ਪਾਊਚ ਵਿੱਚ 4 ਲਾਲ ਅਤੇ 5 ਨੀਲੇ ਰੰਗੀਨ ਪੱਥਰ ਹਨ। ਇੱਕ ਰੰਗੀਨ ਪੱਥਰ ਕੱਢ ਕੇ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਫਿਰ ਦੂਜਾ ਰੰਗੀਨ ਪੱਥਰ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਦੋਵੇਂ ਚੁਣੇ ਰੰਗੀਨ ਪੱਥਰਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{16}{81}\)
- **B.** \(\frac{65}{81}\)
- **C.** \(\frac{17}{81}\)
- **D.** \(\frac{5}{27}\)
- **E.** \(\frac{8}{41}\)

**Correct answer:** A. \(\frac{16}{81}\)

**English-runtime answer value:** \(\frac{16}{81}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਰੰਗੀਨ ਪੱਥਰ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(16/81=16/81\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{16}{81}\)

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — The first stone is replaced, so the container again has 4 red and 5 blue coloured stones before the second selection.
3. Step 2 — Thus, \(P\!\left(red stone on each selection\right)\) = \(\frac{4}{9}\).
4. Step 3 — \(P\!\left(both red coloured stones\right)\) = \(\frac{4}{9}\) \(\times\) \(\frac{4}{9}\) = \(\frac{16}{81}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{16}{81}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 20. PRB-QL-520 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-520`
- **Parameter fingerprint:** `efa609631240d37b1240d37befa60963`
- **Mathematical fingerprint:** `4f4cab37f20fc00ff20fc00f4f4cab37`

### English source authority

A bag contains 6 red and 6 blue balls. Two balls are selected one after another without replacement. What is the probability that both are red?

### Native question to review

ਇੱਕ ਬੈਗ ਵਿੱਚ 6 ਲਾਲ ਅਤੇ 6 ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{17}{22}\)
- **B.** \(\frac{2}{11}\)
- **C.** \(\frac{3}{11}\)
- **D.** \(\frac{5}{22}\)
- **E.** \(\frac{1}{4}\)

**Correct answer:** D. \(\frac{5}{22}\)

**English-runtime answer value:** \(\frac{5}{22}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਗੇਂਦਾਂ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(30/132=5/22\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{5}{22}\)

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — On the first selection, \(P\!\left(red ball\right)\) = \(\frac{6}{12}\).
3. Step 2 — After one red ball is removed, 5 red balls remain among 11 balls.
4. Step 3 — \(P\!\left(both red balls\right)\) = \(\frac{6}{12}\) \(\times\) \(\frac{5}{11}\) = \(\frac{5}{22}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{5}{22}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 21. PRB-QL-521 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-521`
- **Parameter fingerprint:** `0373e5b4e30b6738e30b67380373e5b4`
- **Mathematical fingerprint:** `333ca25a90008ee690008ee6333ca25a`

### English source authority

A jar contains 8 red and 4 blue marbles. Two marbles are selected one after another without replacement. What is the probability of getting red first and blue second?

### Native question to review

ਇੱਕ ਜਾਰ ਵਿੱਚ 8 ਲਾਲ ਅਤੇ 4 ਨੀਲੇ ਕੰਚੇ ਹਨ। ਦੋ ਕੰਚੇ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ। ਪਹਿਲਾਂ ਲਾਲ ਅਤੇ ਫਿਰ ਨੀਲਾ ਕੰਚਾ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{3}{11}\)
- **B.** \(\frac{25}{33}\)
- **C.** \(\frac{4}{17}\)
- **D.** \(\frac{8}{33}\)
- **E.** \(\frac{7}{33}\)

**Correct answer:** D. \(\frac{8}{33}\)

**English-runtime answer value:** \(\frac{8}{33}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਕੰਚੇ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(32/132=8/33\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{8}{33}\)

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — The order is fixed: a red marble must occur first and a blue marble second.
3. Step 2 — \(P\!\left(red first\right)\) = \(\frac{8}{12}\); after that, \(P\!\left(blue second\right)\) = \(\frac{4}{11}\).
4. Step 3 — Required probability = \(\frac{8}{12}\) \(\times\) \(\frac{4}{11}\) = \(\frac{8}{33}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{8}{33}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 22. PRB-QL-522 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-522`
- **Parameter fingerprint:** `22a922ef93a295d793a295d722a922ef`
- **Mathematical fingerprint:** `5dfe3358828391ac828391ac5dfe3358`

### English source authority

A box contains 8 red and 6 blue pens. Two pens are selected one after another without replacement. What is the probability that both are of the same colour?

### Native question to review

ਇੱਕ ਬਾਕਸ ਵਿੱਚ 8 ਲਾਲ ਅਤੇ 6 ਨੀਲੇ ਪੈਨ ਹਨ। ਦੋ ਪੈਨ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ। ਦੋਵੇਂ ਪੈਨਾਂ ਦੇ ਇੱਕੋ ਰੰਗ ਦੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{44}{91}\)
- **B.** \(\frac{6}{13}\)
- **C.** \(\frac{43}{91}\)
- **D.** \(\frac{16}{49}\)
- **E.** \(\frac{48}{91}\)

**Correct answer:** C. \(\frac{43}{91}\)

**English-runtime answer value:** \(\frac{43}{91}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਪੈਨ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(86/182=43/91\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{43}{91}\)

### English explanation authority

1. Method — The pens can have the same colour in two mutually exclusive orders: red-red or blue-blue. Calculate both probabilities and add them.
2. Step 1 — \(P\!\left(red-red\right)\) = \(\frac{8}{14}\) \(\times\) \(\frac{7}{13}\) = \(\frac{56}{182}\).
3. Step 2 — \(P\!\left(blue-blue\right)\) = \(\frac{6}{14}\) \(\times\) \(\frac{5}{13}\) = \(\frac{30}{182}\).
4. Step 3 — \(P\!\left(same colour\right)\) = \(\frac{56}{182}\) + \(\frac{30}{182}\) = \(\frac{86}{182}\).
5. Simplification — Divide the numerator and denominator by 2: (86 \(\div\) 2)/(182 \(\div\) 2) = \(\frac{43}{91}\).
6. Key point — Red-red and blue-blue cannot occur together, so their probabilities are added.
7. Answer — The required probability is \(\frac{43}{91}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 23. PRB-QL-523 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-523`
- **Parameter fingerprint:** `7628a22b7c085d737c085d737628a22b`
- **Mathematical fingerprint:** `f2b3b1130473c7cb0473c7cbf2b3b113`

### English source authority

A pouch contains 6 red and 7 blue coloured stones. Two coloured stones are selected one after another without replacement. What is the probability that they are of different colours?

### Native question to review

ਇੱਕ ਪਾਊਚ ਵਿੱਚ 6 ਲਾਲ ਅਤੇ 7 ਨੀਲੇ ਰੰਗੀਨ ਪੱਥਰ ਹਨ। ਦੋ ਰੰਗੀਨ ਪੱਥਰ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੇ ਜਾਂਦੇ ਹਨ। ਦੋਵੇਂ ਰੰਗੀਨ ਪੱਥਰਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਰੰਗ ਦੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{7}{26}\)
- **B.** \(\frac{7}{13}\)
- **C.** \(\frac{8}{13}\)
- **D.** \(\frac{6}{13}\)
- **E.** \(\frac{36}{169}\)

**Correct answer:** B. \(\frac{7}{13}\)

**English-runtime answer value:** \(\frac{7}{13}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਰੰਗੀਨ ਪੱਥਰ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(84/156=7/13\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{7}{13}\)

### English explanation authority

1. Method — Different colours can occur in two mutually exclusive orders for the coloured stones: red-blue or blue-red. Calculate both and add them.
2. Step 1 — \(P\!\left(red-blue\right)\) = \(\frac{6}{13}\) \(\times\) \(\frac{7}{12}\) = \(\frac{42}{156}\).
3. Step 2 — \(P\!\left(blue-red\right)\) = \(\frac{7}{13}\) \(\times\) \(\frac{6}{12}\) = \(\frac{42}{156}\).
4. Step 3 — \(P\!\left(different colours\right)\) = \(\frac{42}{156}\) + \(\frac{42}{156}\) = \(\frac{84}{156}\).
5. Simplification — Divide the numerator and denominator by 12: (84 \(\div\) 12)/(156 \(\div\) 12) = \(\frac{7}{13}\).
6. Key point — Both possible colour orders must be included because the draws are successive.
7. Answer — The required probability is \(\frac{7}{13}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 24. PRB-QL-524 — PRB-CP-006 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-524`
- **Parameter fingerprint:** `a88f1176dd8485b2dd8485b2a88f1176`
- **Mathematical fingerprint:** `a247fd1642859fd242859fd2a247fd16`

### English source authority

A bag contains 9 red and 4 blue balls. Two selections are made with replacement. What is the probability of getting at least one red ball?

### Native question to review

ਇੱਕ ਬੈਗ ਵਿੱਚ 9 ਲਾਲ ਅਤੇ 4 ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਵਾਰ ਚੋਣ ਕੀਤੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਹਰ ਵਾਰ ਵਸਤੂ ਵਾਪਸ ਰੱਖ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਗੇਂਦ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{16}{169}\)
- **B.** \(\frac{154}{169}\)
- **C.** \(\frac{9}{10}\)
- **D.** \(\frac{152}{169}\)
- **E.** \(\frac{153}{169}\)

**Correct answer:** E. \(\frac{153}{169}\)

**English-runtime answer value:** \(\frac{153}{169}\)

### Native explanation to review

1. ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਗੇਂਦਾਂ ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।
2. ਗਣਨਾ: ਹਰ ਪੜਾਅ ਦੀ ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ਲਿਖੋ ਅਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਉਨ੍ਹਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
3. ਗਣਨਾ: \(153/169=153/169\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{153}{169}\)

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — Use the complement: at least one red ball fails only when both selected balls are blue.
3. Step 2 — Replacement keeps \(P\!\left(blue ball\right)\) = \(\frac{4}{13}\) on both selections.
4. Step 3 — \(P\!\left(at least one red ball\right)\) = 1 - (\(\frac{4}{13}\) \(\times\) \(\frac{4}{13}\)) = \(\frac{153}{169}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{153}{169}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 25. PRB-QL-601 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-601`
- **Parameter fingerprint:** `1843bbf61cdf74321cdf74321843bbf6`
- **Mathematical fingerprint:** `19c30e5b269d4f03269d4f0319c30e5b`

### English source authority

Of the 14 candidates who cleared Quantitative Aptitude, 5 also cleared Reasoning. One of these 14 candidates is selected at random. What is the probability that the selected candidate also cleared Reasoning?

### Native question to review

ਕੁਆਂਟੀਟੇਟਿਵ ਐਪਟੀਟਿਊਡ ਵਿੱਚ ਪਾਸ 14 ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ 5 ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਵੀ ਪਾਸ ਹਨ। ਇਨ੍ਹਾਂ 14 ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਇੱਕ ਨੂੰ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਵੀ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{9}{14}\)
- **B.** \(\frac{1}{3}\)
- **C.** \(\frac{5}{14}\)
- **D.** \(\frac{3}{7}\)
- **E.** \(\frac{2}{7}\)

**Correct answer:** C. \(\frac{5}{14}\)

**English-runtime answer value:** \(\frac{5}{14}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(5/14=5/14\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{5}{14}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The given condition restricts the sample space to the 14 people who satisfy the first condition.
3. Step 2 — 5 of these 14 people also satisfy the second condition.
4. Step 3 — The required probability is \(\frac{5}{14}\).
5. Key point — The group named in the condition becomes the new sample space and therefore the new denominator.
6. Answer — The required probability is \(\frac{5}{14}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 26. PRB-QL-602 — PRB-CP-007 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-602`
- **Parameter fingerprint:** `a732a8b18d2f2fc98d2f2fc9a732a8b1`
- **Mathematical fingerprint:** `f46b32594ec0a9614ec0a961f46b3259`

### English source authority

A card is drawn from a standard deck and is known to be a face card. What is the probability that it is a king?

### Native question to review

ਮਿਆਰੀ 52 ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਕੱਢਿਆ ਪੱਤਾ ਫੇਸ ਕਾਰਡ ਹੈ। ਉਸ ਦੇ ਬਾਦਸ਼ਾਹ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{5}{52}\)
- **B.** \(\frac{2}{3}\)
- **C.** 0
- **D.** \(\frac{1}{4}\)
- **E.** \(\frac{1}{3}\)

**Correct answer:** E. \(\frac{1}{3}\)

**English-runtime answer value:** \(\frac{1}{3}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(4/12=1/3\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{3}\)

### English explanation authority

1. Method — Use only the cards allowed by the given condition as the sample space; cards outside that restricted set are no longer possible.
2. Step 1 — Knowing that the card is a face card reduces the sample space to the 12 jacks, queens and kings.
3. Step 2 — Exactly 4 of these 12 face cards are kings.
4. Step 3 — The required probability is \(\frac{4}{12}\) = \(\frac{1}{3}\).
5. Answer — The required probability is \(\frac{1}{3}\).

**Native visuals:**
- **CARD_DECK_SUMMARY** — ਮਿਆਰੀ ਤਾਸ਼-ਗੱਡੀ ਸਾਰ
  - Alt: 52 ਪੱਤਿਆਂ ਦੀ ਮਿਆਰੀ ਗੱਡੀ ਦੀਆਂ ਲੋੜੀਂਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਸਾਰ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 27. PRB-QL-603 — PRB-CP-007 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-603`
- **Parameter fingerprint:** `3bd543181cbb50ec1cbb50ec3bd54318`
- **Mathematical fingerprint:** `b9527a82b8c03afeb8c03afeb9527a82`

### English source authority

An integer selected from 1 to 30 is known to be divisible by 2. What is the probability that it is also divisible by 4?

### Native question to review

1 ਤੋਂ 30 ਤੱਕ ਚੁਣਿਆ ਗਿਆ ਇੱਕ ਪੂਰਨ ਅੰਕ 2 ਨਾਲ ਭਾਗਯੋਗ ਹੈ। ਉਸ ਦੇ 4 ਨਾਲ ਵੀ ਭਾਗਯੋਗ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{2}{5}\)
- **B.** \(\frac{7}{16}\)
- **C.** \(\frac{8}{15}\)
- **D.** \(\frac{7}{30}\)
- **E.** \(\frac{7}{15}\)

**Correct answer:** E. \(\frac{7}{15}\)

**English-runtime answer value:** \(\frac{7}{15}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(7/15=7/15\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{7}{15}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The restricted numbers are 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30.
3. Step 2 — Among them, 4, 8, 12, 16, 20, 24, 28 are divisible by 4. So the probability is \(\frac{7}{15}\).
4. Answer — The required probability is \(\frac{7}{15}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 28. PRB-QL-604 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-604`
- **Parameter fingerprint:** `1bd304457eaeca1d7eaeca1d1bd30445`
- **Mathematical fingerprint:** `2319c59fd50ce1e7d50ce1e72319c59f`

### English source authority

A bag contains 9 red and 8 blue balls. Two balls are drawn without replacement. Given that the first ball is red, what is the probability that the second ball is also red?

### Native question to review

ਇੱਕ ਬੈਗ ਵਿੱਚ 9 ਲਾਲ ਅਤੇ 8 ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਜੇ ਪਹਿਲੀ ਗੇਂਦ ਲਾਲ ਹੈ, ਤਾਂ ਦੂਜੀ ਗੇਂਦ ਦੇ ਵੀ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{9}{16}\)
- **B.** 0
- **C.** 1
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{1}{3}\)

**Correct answer:** D. \(\frac{1}{2}\)

**English-runtime answer value:** \(\frac{1}{2}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(8/16=1/2\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{2}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The condition tells us that the first selected ball was red and was not replaced.
3. Step 2 — 8 red balls remain among 16 balls for the second selection.
4. Step 3 — The required probability is \(\frac{8}{16}\) = \(\frac{1}{2}\).
5. Key point — After the known first draw, the second draw is made only from the remaining objects, so both remaining counts must be used.
6. Answer — The required probability is \(\frac{1}{2}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 29. PRB-QL-605 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-605`
- **Parameter fingerprint:** `578c170c3bf1d5203bf1d520578c170c`
- **Mathematical fingerprint:** `9ae507e3516035fb516035fb9ae507e3`

### English source authority

Among 18 shortlisted candidates, the probability that a randomly selected candidate is certified is \(\frac{1}{6}\). How many candidates are certified?

### Native question to review

18 ਸ਼ਾਰਟਲਿਸਟ ਕੀਤੇ ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਪ੍ਰਮਾਣਿਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ \(\frac{1}{6}\) ਹੈ। ਅਜਿਹੇ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਹਨ?

### Options

- **A.** 2
- **B.** 3
- **C.** 5
- **D.** 1
- **E.** 4

**Correct answer:** B. 3

**English-runtime answer value:** 3

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ ਨੂੰ ਅਨੁਕੂਲ ਗਿਣਤੀ ÷ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀ ਕੁੱਲ ਗਿਣਤੀ ਵਜੋਂ ਲਿਖੋ।
2. ਗਣਨਾ: ਦਿੱਤੀ ਸੰਭਾਵਨਾ ਅਤੇ ਕੁੱਲ ਗਿਣਤੀ ਤੋਂ ਲੋੜੀਂਦੀ ਅਨੁਕੂਲ ਗਿਣਤੀ ਕੱਢੋ।
3. ਗਣਨਾ: \(18\times\frac{1}{6}=3\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਹਰ ਵਿੱਚ ਕੇਵਲ ਉਹੀ ਸਮੂਹ ਲਵੋ ਜੋ ਦਿੱਤੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: 3

### English explanation authority

1. Method — Use \(P\!\left(E\right)\) = favourable cases \(\div\) total cases and rearrange the relation to find the missing count.
2. Step 1 — Because the selection is made only from the restricted group, let the required number be x. Then x/18 = \(\frac{1}{6}\).
3. Step 2 — x = 18 \(\times\) \(\frac{1}{6}\) = 3.
4. Step 3 — 3 people satisfy the required condition.
5. Key point — The shortlisted group is the complete sample space here, so its size is the denominator of the probability relation.
6. Answer — The required number is 3.

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 30. PRB-QL-606 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-606`
- **Parameter fingerprint:** `5fad04994f732f214f732f215fad0499`
- **Mathematical fingerprint:** `d86172987fddcc6c7fddcc6cd8617298`

### English source authority

Of the 13 students who cleared Mathematics, 5 also cleared English. One of these 13 students is selected at random. What is the probability that the selected student also cleared English?

### Native question to review

ਗਣਿਤ ਵਿੱਚ ਪਾਸ 13 ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚੋਂ 5 ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੀ ਪਾਸ ਹਨ। ਇਨ੍ਹਾਂ 13 ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚੋਂ ਇੱਕ ਨੂੰ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੀ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{6}{13}\)
- **B.** \(\frac{8}{13}\)
- **C.** \(\frac{5}{13}\)
- **D.** \(\frac{5}{14}\)
- **E.** \(\frac{4}{13}\)

**Correct answer:** C. \(\frac{5}{13}\)

**English-runtime answer value:** \(\frac{5}{13}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(5/13=5/13\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{5}{13}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The given condition restricts the sample space to the 13 people who satisfy the first condition.
3. Step 2 — 5 of these 13 people also satisfy the second condition.
4. Step 3 — The required probability is \(\frac{5}{13}\).
5. Key point — The group named in the condition becomes the new sample space and therefore the new denominator.
6. Answer — The required probability is \(\frac{5}{13}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 31. PRB-QL-607 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-607`
- **Parameter fingerprint:** `38a315b2b0373f0eb0373f0e38a315b2`
- **Mathematical fingerprint:** `8dc8bbefc48256d7c48256d78dc8bbef`

### English source authority

Of the 12 candidates who cleared Quantitative Aptitude, 8 also cleared Reasoning. One of these 12 candidates is selected at random. What is the probability that the selected candidate also cleared Reasoning?

### Native question to review

ਕੁਆਂਟੀਟੇਟਿਵ ਐਪਟੀਟਿਊਡ ਵਿੱਚ ਪਾਸ 12 ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ 8 ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਵੀ ਪਾਸ ਹਨ। ਇਨ੍ਹਾਂ 12 ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਇੱਕ ਨੂੰ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਵੀ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{3}{4}\)
- **B.** \(\frac{1}{3}\)
- **C.** 1
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{2}{3}\)

**Correct answer:** E. \(\frac{2}{3}\)

**English-runtime answer value:** \(\frac{2}{3}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(8/12=2/3\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{2}{3}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The given condition restricts the sample space to the 12 people who satisfy the first condition.
3. Step 2 — 8 of these 12 people also satisfy the second condition.
4. Step 3 — The required probability is \(\frac{8}{12}\) = \(\frac{2}{3}\).
5. Key point — The group named in the condition becomes the new sample space and therefore the new denominator.
6. Answer — The required probability is \(\frac{2}{3}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 32. PRB-QL-608 — PRB-CP-007 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-608`
- **Parameter fingerprint:** `cd9fd3fbacf99ea3acf99ea3cd9fd3fb`
- **Mathematical fingerprint:** `46fe633d8b968e258b968e2546fe633d`

### English source authority

A card is drawn from a standard deck and is known to be a face card. What is the probability that it is a king?

### Native question to review

ਮਿਆਰੀ 52 ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਕੱਢਿਆ ਪੱਤਾ ਫੇਸ ਕਾਰਡ ਹੈ। ਉਸ ਦੇ ਬਾਦਸ਼ਾਹ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{5}{52}\)
- **C.** \(\frac{2}{3}\)
- **D.** 0
- **E.** \(\frac{1}{4}\)

**Correct answer:** A. \(\frac{1}{3}\)

**English-runtime answer value:** \(\frac{1}{3}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(4/12=1/3\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{3}\)

### English explanation authority

1. Method — Use only the cards allowed by the given condition as the sample space; cards outside that restricted set are no longer possible.
2. Step 1 — Knowing that the card is a face card reduces the sample space to the 12 jacks, queens and kings.
3. Step 2 — Exactly 4 of these 12 face cards are kings.
4. Step 3 — The required probability is \(\frac{4}{12}\) = \(\frac{1}{3}\).
5. Answer — The required probability is \(\frac{1}{3}\).

**Native visuals:**
- **CARD_DECK_SUMMARY** — ਮਿਆਰੀ ਤਾਸ਼-ਗੱਡੀ ਸਾਰ
  - Alt: 52 ਪੱਤਿਆਂ ਦੀ ਮਿਆਰੀ ਗੱਡੀ ਦੀਆਂ ਲੋੜੀਂਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਸਾਰ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 33. PRB-QL-609 — PRB-CP-007 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-609`
- **Parameter fingerprint:** `7e17c2ccf293fd60f293fd607e17c2cc`
- **Mathematical fingerprint:** `527099ea2f1ba2562f1ba256527099ea`

### English source authority

An integer selected from 1 to 30 is known to be divisible by 2. What is the probability that it is also divisible by 4?

### Native question to review

1 ਤੋਂ 30 ਤੱਕ ਚੁਣਿਆ ਗਿਆ ਇੱਕ ਪੂਰਨ ਅੰਕ 2 ਨਾਲ ਭਾਗਯੋਗ ਹੈ। ਉਸ ਦੇ 4 ਨਾਲ ਵੀ ਭਾਗਯੋਗ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{7}{15}\)
- **B.** \(\frac{2}{5}\)
- **C.** \(\frac{7}{30}\)
- **D.** \(\frac{7}{16}\)
- **E.** \(\frac{8}{15}\)

**Correct answer:** A. \(\frac{7}{15}\)

**English-runtime answer value:** \(\frac{7}{15}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(7/15=7/15\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{7}{15}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The restricted numbers are 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30.
3. Step 2 — Among them, 4, 8, 12, 16, 20, 24, 28 are divisible by 4. So the probability is \(\frac{7}{15}\).
4. Answer — The required probability is \(\frac{7}{15}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 34. PRB-QL-610 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-610`
- **Parameter fingerprint:** `edc7391d5640730556407305edc7391d`
- **Mathematical fingerprint:** `fb18b99a9ad9cea69ad9cea6fb18b99a`

### English source authority

A bag contains 9 red and 7 blue balls. Two balls are drawn without replacement. Given that the first ball is red, what is the probability that the second ball is also red?

### Native question to review

ਇੱਕ ਬੈਗ ਵਿੱਚ 9 ਲਾਲ ਅਤੇ 7 ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਜੇ ਪਹਿਲੀ ਗੇਂਦ ਲਾਲ ਹੈ, ਤਾਂ ਦੂਜੀ ਗੇਂਦ ਦੇ ਵੀ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{3}{5}\)
- **B.** \(\frac{8}{15}\)
- **C.** \(\frac{7}{15}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{4}{7}\)

**Correct answer:** B. \(\frac{8}{15}\)

**English-runtime answer value:** \(\frac{8}{15}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(8/15=8/15\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{8}{15}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The condition tells us that the first selected ball was red and was not replaced.
3. Step 2 — 8 red balls remain among 15 balls for the second selection.
4. Step 3 — The required probability is \(\frac{8}{15}\).
5. Key point — After the known first draw, the second draw is made only from the remaining objects, so both remaining counts must be used.
6. Answer — The required probability is \(\frac{8}{15}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 35. PRB-QL-611 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-611`
- **Parameter fingerprint:** `b4dd890550c3865d50c3865db4dd8905`
- **Mathematical fingerprint:** `22d3bee71b88005f1b88005f22d3bee7`

### English source authority

Among 23 shortlisted candidates, the probability that a randomly selected candidate is certified is \(\frac{20}{23}\). How many candidates are certified?

### Native question to review

23 ਸ਼ਾਰਟਲਿਸਟ ਕੀਤੇ ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਪ੍ਰਮਾਣਿਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ \(\frac{20}{23}\) ਹੈ। ਅਜਿਹੇ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਹਨ?

### Options

- **A.** 20
- **B.** 21
- **C.** 22
- **D.** 19
- **E.** 18

**Correct answer:** A. 20

**English-runtime answer value:** 20

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ ਨੂੰ ਅਨੁਕੂਲ ਗਿਣਤੀ ÷ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀ ਕੁੱਲ ਗਿਣਤੀ ਵਜੋਂ ਲਿਖੋ।
2. ਗਣਨਾ: ਦਿੱਤੀ ਸੰਭਾਵਨਾ ਅਤੇ ਕੁੱਲ ਗਿਣਤੀ ਤੋਂ ਲੋੜੀਂਦੀ ਅਨੁਕੂਲ ਗਿਣਤੀ ਕੱਢੋ।
3. ਗਣਨਾ: \(23\times\frac{20}{23}=20\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਹਰ ਵਿੱਚ ਕੇਵਲ ਉਹੀ ਸਮੂਹ ਲਵੋ ਜੋ ਦਿੱਤੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: 20

### English explanation authority

1. Method — Use \(P\!\left(E\right)\) = favourable cases \(\div\) total cases and rearrange the relation to find the missing count.
2. Step 1 — Because the selection is made only from the restricted group, let the required number be x. Then x/23 = \(\frac{20}{23}\).
3. Step 2 — x = 23 \(\times\) \(\frac{20}{23}\) = 20.
4. Step 3 — 20 people satisfy the required condition.
5. Key point — The shortlisted group is the complete sample space here, so its size is the denominator of the probability relation.
6. Answer — The required number is 20.

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 36. PRB-QL-612 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-612`
- **Parameter fingerprint:** `84521547fae22cbffae22cbf84521547`
- **Mathematical fingerprint:** `43bbe6c2941357be941357be43bbe6c2`

### English source authority

Of the 12 students who cleared Mathematics, 3 also cleared English. One of these 12 students is selected at random. What is the probability that the selected student also cleared English?

### Native question to review

ਗਣਿਤ ਵਿੱਚ ਪਾਸ 12 ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚੋਂ 3 ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੀ ਪਾਸ ਹਨ। ਇਨ੍ਹਾਂ 12 ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚੋਂ ਇੱਕ ਨੂੰ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੀ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{5}\)
- **B.** \(\frac{3}{4}\)
- **C.** \(\frac{1}{2}\)
- **D.** 0
- **E.** \(\frac{1}{4}\)

**Correct answer:** E. \(\frac{1}{4}\)

**English-runtime answer value:** \(\frac{1}{4}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(3/12=1/4\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{4}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The given condition restricts the sample space to the 12 people who satisfy the first condition.
3. Step 2 — 3 of these 12 people also satisfy the second condition.
4. Step 3 — The required probability is \(\frac{3}{12}\) = \(\frac{1}{4}\).
5. Key point — The group named in the condition becomes the new sample space and therefore the new denominator.
6. Answer — The required probability is \(\frac{1}{4}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 37. PRB-QL-613 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-613`
- **Parameter fingerprint:** `cb2e790af0312ef6f0312ef6cb2e790a`
- **Mathematical fingerprint:** `f9a8063918ce1ac118ce1ac1f9a80639`

### English source authority

Of the 18 candidates who cleared Quantitative Aptitude, 5 also cleared Reasoning. One of these 18 candidates is selected at random. What is the probability that the selected candidate also cleared Reasoning?

### Native question to review

ਕੁਆਂਟੀਟੇਟਿਵ ਐਪਟੀਟਿਊਡ ਵਿੱਚ ਪਾਸ 18 ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ 5 ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਵੀ ਪਾਸ ਹਨ। ਇਨ੍ਹਾਂ 18 ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਇੱਕ ਨੂੰ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਵੀ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{13}{18}\)
- **B.** \(\frac{2}{9}\)
- **C.** \(\frac{5}{18}\)
- **D.** \(\frac{5}{19}\)
- **E.** \(\frac{1}{3}\)

**Correct answer:** C. \(\frac{5}{18}\)

**English-runtime answer value:** \(\frac{5}{18}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(5/18=5/18\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{5}{18}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The given condition restricts the sample space to the 18 people who satisfy the first condition.
3. Step 2 — 5 of these 18 people also satisfy the second condition.
4. Step 3 — The required probability is \(\frac{5}{18}\).
5. Key point — The group named in the condition becomes the new sample space and therefore the new denominator.
6. Answer — The required probability is \(\frac{5}{18}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 38. PRB-QL-614 — PRB-CP-007 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-614`
- **Parameter fingerprint:** `ffd5a77382ebccab82ebccabffd5a773`
- **Mathematical fingerprint:** `8ccf6661c88e2a19c88e2a198ccf6661`

### English source authority

A card is drawn from a standard deck and is known to be a face card. What is the probability that it is a king?

### Native question to review

ਮਿਆਰੀ 52 ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਕੱਢਿਆ ਪੱਤਾ ਫੇਸ ਕਾਰਡ ਹੈ। ਉਸ ਦੇ ਬਾਦਸ਼ਾਹ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** 0
- **B.** \(\frac{5}{52}\)
- **C.** \(\frac{1}{3}\)
- **D.** \(\frac{1}{4}\)
- **E.** \(\frac{2}{3}\)

**Correct answer:** C. \(\frac{1}{3}\)

**English-runtime answer value:** \(\frac{1}{3}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(4/12=1/3\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{3}\)

### English explanation authority

1. Method — Use only the cards allowed by the given condition as the sample space; cards outside that restricted set are no longer possible.
2. Step 1 — Knowing that the card is a face card reduces the sample space to the 12 jacks, queens and kings.
3. Step 2 — Exactly 4 of these 12 face cards are kings.
4. Step 3 — The required probability is \(\frac{4}{12}\) = \(\frac{1}{3}\).
5. Answer — The required probability is \(\frac{1}{3}\).

**Native visuals:**
- **CARD_DECK_SUMMARY** — ਮਿਆਰੀ ਤਾਸ਼-ਗੱਡੀ ਸਾਰ
  - Alt: 52 ਪੱਤਿਆਂ ਦੀ ਮਿਆਰੀ ਗੱਡੀ ਦੀਆਂ ਲੋੜੀਂਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਸਾਰ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 39. PRB-QL-615 — PRB-CP-007 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-615`
- **Parameter fingerprint:** `be9b3656fc716492fc716492be9b3656`
- **Mathematical fingerprint:** `963158ae699b48ba699b48ba963158ae`

### English source authority

An integer selected from 1 to 40 is known to be divisible by 2. What is the probability that it is also divisible by 4?

### Native question to review

1 ਤੋਂ 40 ਤੱਕ ਚੁਣਿਆ ਗਿਆ ਇੱਕ ਪੂਰਨ ਅੰਕ 2 ਨਾਲ ਭਾਗਯੋਗ ਹੈ। ਉਸ ਦੇ 4 ਨਾਲ ਵੀ ਭਾਗਯੋਗ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{1}{2}\)
- **C.** \(\frac{1}{4}\)
- **D.** 0
- **E.** 1

**Correct answer:** B. \(\frac{1}{2}\)

**English-runtime answer value:** \(\frac{1}{2}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(10/20=1/2\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{2}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The restricted numbers are 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40.
3. Step 2 — Among them, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40 are divisible by 4. So the probability is \(\frac{10}{20}\) = \(\frac{1}{2}\).
4. Answer — The required probability is \(\frac{1}{2}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 40. PRB-QL-616 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-616`
- **Parameter fingerprint:** `725d5baa9f0d63969f0d6396725d5baa`
- **Mathematical fingerprint:** `3b8cbb0f70597077705970773b8cbb0f`

### English source authority

A bag contains 8 red and 8 blue balls. Two balls are drawn without replacement. Given that the first ball is red, what is the probability that the second ball is also red?

### Native question to review

ਇੱਕ ਬੈਗ ਵਿੱਚ 8 ਲਾਲ ਅਤੇ 8 ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਜੇ ਪਹਿਲੀ ਗੇਂਦ ਲਾਲ ਹੈ, ਤਾਂ ਦੂਜੀ ਗੇਂਦ ਦੇ ਵੀ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{7}{16}\)
- **B.** \(\frac{1}{2}\)
- **C.** \(\frac{2}{5}\)
- **D.** \(\frac{7}{15}\)
- **E.** \(\frac{8}{15}\)

**Correct answer:** D. \(\frac{7}{15}\)

**English-runtime answer value:** \(\frac{7}{15}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(7/15=7/15\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{7}{15}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The condition tells us that the first selected ball was red and was not replaced.
3. Step 2 — 7 red balls remain among 15 balls for the second selection.
4. Step 3 — The required probability is \(\frac{7}{15}\).
5. Key point — After the known first draw, the second draw is made only from the remaining objects, so both remaining counts must be used.
6. Answer — The required probability is \(\frac{7}{15}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 41. PRB-QL-617 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-617`
- **Parameter fingerprint:** `b98fb5457f6d631d7f6d631db98fb545`
- **Mathematical fingerprint:** `1ab6c44f13808537138085371ab6c44f`

### English source authority

Among 20 shortlisted candidates, the probability that a randomly selected candidate is certified is \(\frac{3}{4}\). How many candidates are certified?

### Native question to review

20 ਸ਼ਾਰਟਲਿਸਟ ਕੀਤੇ ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਪ੍ਰਮਾਣਿਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ \(\frac{3}{4}\) ਹੈ। ਅਜਿਹੇ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਹਨ?

### Options

- **A.** 17
- **B.** 14
- **C.** 13
- **D.** 15
- **E.** 16

**Correct answer:** D. 15

**English-runtime answer value:** 15

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ ਨੂੰ ਅਨੁਕੂਲ ਗਿਣਤੀ ÷ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀ ਕੁੱਲ ਗਿਣਤੀ ਵਜੋਂ ਲਿਖੋ।
2. ਗਣਨਾ: ਦਿੱਤੀ ਸੰਭਾਵਨਾ ਅਤੇ ਕੁੱਲ ਗਿਣਤੀ ਤੋਂ ਲੋੜੀਂਦੀ ਅਨੁਕੂਲ ਗਿਣਤੀ ਕੱਢੋ।
3. ਗਣਨਾ: \(20\times\frac{3}{4}=15\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਹਰ ਵਿੱਚ ਕੇਵਲ ਉਹੀ ਸਮੂਹ ਲਵੋ ਜੋ ਦਿੱਤੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: 15

### English explanation authority

1. Method — Use \(P\!\left(E\right)\) = favourable cases \(\div\) total cases and rearrange the relation to find the missing count.
2. Step 1 — Because the selection is made only from the restricted group, let the required number be x. Then x/20 = \(\frac{3}{4}\).
3. Step 2 — x = 20 \(\times\) \(\frac{3}{4}\) = 15.
4. Step 3 — 15 people satisfy the required condition.
5. Key point — The shortlisted group is the complete sample space here, so its size is the denominator of the probability relation.
6. Answer — The required number is 15.

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 42. PRB-QL-618 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-618`
- **Parameter fingerprint:** `17da774e6e70e0da6e70e0da17da774e`
- **Mathematical fingerprint:** `bd5c226b3bc741333bc74133bd5c226b`

### English source authority

Of the 18 students who cleared Mathematics, 8 also cleared English. One of these 18 students is selected at random. What is the probability that the selected student also cleared English?

### Native question to review

ਗਣਿਤ ਵਿੱਚ ਪਾਸ 18 ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚੋਂ 8 ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੀ ਪਾਸ ਹਨ। ਇਨ੍ਹਾਂ 18 ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚੋਂ ਇੱਕ ਨੂੰ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੀ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{5}{9}\)
- **B.** \(\frac{1}{2}\)
- **C.** \(\frac{1}{3}\)
- **D.** \(\frac{2}{5}\)
- **E.** \(\frac{4}{9}\)

**Correct answer:** E. \(\frac{4}{9}\)

**English-runtime answer value:** \(\frac{4}{9}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(8/18=4/9\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{4}{9}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The given condition restricts the sample space to the 18 people who satisfy the first condition.
3. Step 2 — 8 of these 18 people also satisfy the second condition.
4. Step 3 — The required probability is \(\frac{8}{18}\) = \(\frac{4}{9}\).
5. Key point — The group named in the condition becomes the new sample space and therefore the new denominator.
6. Answer — The required probability is \(\frac{4}{9}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 43. PRB-QL-619 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-619`
- **Parameter fingerprint:** `1de02549d1aec471d1aec4711de02549`
- **Mathematical fingerprint:** `08f11bf633bbd43233bbd43208f11bf6`

### English source authority

Of the 15 candidates who cleared Quantitative Aptitude, 4 also cleared Reasoning. One of these 15 candidates is selected at random. What is the probability that the selected candidate also cleared Reasoning?

### Native question to review

ਕੁਆਂਟੀਟੇਟਿਵ ਐਪਟੀਟਿਊਡ ਵਿੱਚ ਪਾਸ 15 ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ 4 ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਵੀ ਪਾਸ ਹਨ। ਇਨ੍ਹਾਂ 15 ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਇੱਕ ਨੂੰ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਵੀ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{4}\)
- **B.** \(\frac{11}{15}\)
- **C.** \(\frac{4}{15}\)
- **D.** \(\frac{1}{5}\)
- **E.** \(\frac{1}{3}\)

**Correct answer:** C. \(\frac{4}{15}\)

**English-runtime answer value:** \(\frac{4}{15}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(4/15=4/15\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{4}{15}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The given condition restricts the sample space to the 15 people who satisfy the first condition.
3. Step 2 — 4 of these 15 people also satisfy the second condition.
4. Step 3 — The required probability is \(\frac{4}{15}\).
5. Key point — The group named in the condition becomes the new sample space and therefore the new denominator.
6. Answer — The required probability is \(\frac{4}{15}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 44. PRB-QL-620 — PRB-CP-007 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-620`
- **Parameter fingerprint:** `3d08d93366217deb66217deb3d08d933`
- **Mathematical fingerprint:** `9e3e98e1523ae099523ae0999e3e98e1`

### English source authority

A card is drawn from a standard deck and is known to be a face card. What is the probability that it is a king?

### Native question to review

ਮਿਆਰੀ 52 ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਕੱਢਿਆ ਪੱਤਾ ਫੇਸ ਕਾਰਡ ਹੈ। ਉਸ ਦੇ ਬਾਦਸ਼ਾਹ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{2}{3}\)
- **B.** \(\frac{5}{52}\)
- **C.** \(\frac{1}{3}\)
- **D.** 0
- **E.** \(\frac{1}{4}\)

**Correct answer:** C. \(\frac{1}{3}\)

**English-runtime answer value:** \(\frac{1}{3}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(4/12=1/3\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{3}\)

### English explanation authority

1. Method — Use only the cards allowed by the given condition as the sample space; cards outside that restricted set are no longer possible.
2. Step 1 — Knowing that the card is a face card reduces the sample space to the 12 jacks, queens and kings.
3. Step 2 — Exactly 4 of these 12 face cards are kings.
4. Step 3 — The required probability is \(\frac{4}{12}\) = \(\frac{1}{3}\).
5. Answer — The required probability is \(\frac{1}{3}\).

**Native visuals:**
- **CARD_DECK_SUMMARY** — ਮਿਆਰੀ ਤਾਸ਼-ਗੱਡੀ ਸਾਰ
  - Alt: 52 ਪੱਤਿਆਂ ਦੀ ਮਿਆਰੀ ਗੱਡੀ ਦੀਆਂ ਲੋੜੀਂਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਸਾਰ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 45. PRB-QL-621 — PRB-CP-007 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-621`
- **Parameter fingerprint:** `85c138bedc36e6eadc36e6ea85c138be`
- **Mathematical fingerprint:** `32249516946ff7d2946ff7d232249516`

### English source authority

An integer selected from 1 to 30 is known to be divisible by 2. What is the probability that it is also divisible by 4?

### Native question to review

1 ਤੋਂ 30 ਤੱਕ ਚੁਣਿਆ ਗਿਆ ਇੱਕ ਪੂਰਨ ਅੰਕ 2 ਨਾਲ ਭਾਗਯੋਗ ਹੈ। ਉਸ ਦੇ 4 ਨਾਲ ਵੀ ਭਾਗਯੋਗ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{2}{5}\)
- **B.** \(\frac{8}{15}\)
- **C.** \(\frac{7}{15}\)
- **D.** \(\frac{7}{30}\)
- **E.** \(\frac{7}{16}\)

**Correct answer:** C. \(\frac{7}{15}\)

**English-runtime answer value:** \(\frac{7}{15}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(7/15=7/15\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{7}{15}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The restricted numbers are 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30.
3. Step 2 — Among them, 4, 8, 12, 16, 20, 24, 28 are divisible by 4. So the probability is \(\frac{7}{15}\).
4. Answer — The required probability is \(\frac{7}{15}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 46. PRB-QL-622 — PRB-CP-007 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-622`
- **Parameter fingerprint:** `c56734e904276e1104276e11c56734e9`
- **Mathematical fingerprint:** `86bf89d1241efb69241efb6986bf89d1`

### English source authority

A bag contains 10 red and 4 blue balls. Two balls are drawn without replacement. Given that the first ball is red, what is the probability that the second ball is also red?

### Native question to review

ਇੱਕ ਬੈਗ ਵਿੱਚ 10 ਲਾਲ ਅਤੇ 4 ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਜੇ ਪਹਿਲੀ ਗੇਂਦ ਲਾਲ ਹੈ, ਤਾਂ ਦੂਜੀ ਗੇਂਦ ਦੇ ਵੀ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{9}{13}\)
- **B.** \(\frac{4}{13}\)
- **C.** \(\frac{9}{14}\)
- **D.** \(\frac{8}{13}\)
- **E.** \(\frac{10}{13}\)

**Correct answer:** A. \(\frac{9}{13}\)

**English-runtime answer value:** \(\frac{9}{13}\)

### Native explanation to review

1. ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।
2. ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।
3. ਗਣਨਾ: \(9/13=9/13\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{9}{13}\)

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The condition tells us that the first selected ball was red and was not replaced.
3. Step 2 — 9 red balls remain among 13 balls for the second selection.
4. Step 3 — The required probability is \(\frac{9}{13}\).
5. Key point — After the known first draw, the second draw is made only from the remaining objects, so both remaining counts must be used.
6. Answer — The required probability is \(\frac{9}{13}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ
  - Alt: ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 47. PRB-QL-701 — PRB-CP-008 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-701`
- **Parameter fingerprint:** `8af6a10d566aefd5566aefd58af6a10d`
- **Mathematical fingerprint:** `5deb230556bbb05d56bbb05d5deb2305`

### English source authority

A 3-member committee is chosen at random from 7 men and 6 women. What is the probability that it contains exactly 1 woman?

### Native question to review

7 ਮਰਦਾਂ ਅਤੇ 6 ਔਰਤਾਂ ਵਿੱਚੋਂ 3 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਠੀਕ 1 ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{21}{286}\)
- **B.** \(\frac{62}{143}\)
- **C.** \(\frac{63}{143}\)
- **D.** \(\frac{80}{143}\)
- **E.** \(\frac{64}{143}\)

**Correct answer:** C. \(\frac{63}{143}\)

**English-runtime answer value:** \(\frac{63}{143}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(126/286=63/143\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{63}{143}\)

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Total committees = \(\binom{13}{3}\).
3. Step 2 — \(\binom{13}{3}\) = 13!/(3! \(\times\) 10!) = (13 \(\times\) 12 \(\times\) 11)/(3 \(\times\) 2 \(\times\) 1) = 286.
4. Step 3 — Choose 1 woman from 6: \(\binom{6}{1}\) = 6.
5. Step 4 — Choose 2 men from 7: \(\binom{7}{2}\) = 7!/(2! \(\times\) 5!) = (7 \(\times\) 6)/(2 \(\times\) 1) = 21.
6. Step 5 — Required committees = 6 \(\times\) 21 = 126.
7. Step 6 — Probability = favourable cases \(\div\) total cases = \(\frac{126}{286}\).
8. Simplification — Divide the numerator and denominator by 2: (126 \(\div\) 2)/(286 \(\div\) 2) = \(\frac{63}{143}\).
9. Key point — Combinations count each committee once because changing the order of the same members does not create a different committee.
10. Answer — The required probability is \(\frac{63}{143}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 48. PRB-QL-702 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-702`
- **Parameter fingerprint:** `9123243dfaa3b725faa3b7259123243d`
- **Mathematical fingerprint:** `578452930dfd054b0dfd054b57845293`

### English source authority

A 4-member committee is chosen at random from 8 men and 6 women. What is the probability that it contains exactly 2 women?

### Native question to review

8 ਮਰਦਾਂ ਅਤੇ 6 ਔਰਤਾਂ ਵਿੱਚੋਂ 4 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਠੀਕ 2 ਔਰਤਾਂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{5}{286}\)
- **B.** \(\frac{83}{143}\)
- **C.** \(\frac{60}{143}\)
- **D.** \(\frac{59}{143}\)
- **E.** \(\frac{61}{143}\)

**Correct answer:** C. \(\frac{60}{143}\)

**English-runtime answer value:** \(\frac{60}{143}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(420/1001=60/143\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{60}{143}\)

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Total committees = \(\binom{14}{4}\).
3. Step 2 — \(\binom{14}{4}\) = 14!/(4! \(\times\) 10!) = (14 \(\times\) 13 \(\times\) 12 \(\times\) 11)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 1001.
4. Step 3 — Choose 2 women from 6: \(\binom{6}{2}\) = 6!/(2! \(\times\) 4!) = (6 \(\times\) 5)/(2 \(\times\) 1) = 15.
5. Step 4 — Choose 2 men from 8: \(\binom{8}{2}\) = 8!/(2! \(\times\) 6!) = (8 \(\times\) 7)/(2 \(\times\) 1) = 28.
6. Step 5 — Required committees = 15 \(\times\) 28 = 420.
7. Step 6 — Probability = favourable cases \(\div\) total cases = \(\frac{420}{1001}\).
8. Simplification — Divide the numerator and denominator by 7: (420 \(\div\) 7)/(1001 \(\div\) 7) = \(\frac{60}{143}\).
9. Key point — Combinations count each committee once because changing the order of the same members does not create a different committee.
10. Answer — The required probability is \(\frac{60}{143}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 49. PRB-QL-703 — PRB-CP-008 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-703`
- **Parameter fingerprint:** `bbf6af288fc02cdc8fc02cdcbbf6af28`
- **Mathematical fingerprint:** `17371bb471d88d3871d88d3817371bb4`

### English source authority

6 candidates stand in a queue in a random order. What is the probability that a specified candidate occupies the first position?

### Native question to review

6 ਉਮੀਦਵਾਰ ਬੇਤਰਤੀਬ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹੇ ਹੁੰਦੇ ਹਨ। ਕਿਸੇ ਇੱਕ ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰ ਦੇ ਪਹਿਲੇ ਸਥਾਨ ਉੱਤੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{5}{6}\)
- **B.** \(\frac{1}{6}\)
- **C.** \(\frac{1}{3}\)
- **D.** \(\frac{1}{7}\)
- **E.** 0

**Correct answer:** B. \(\frac{1}{6}\)

**English-runtime answer value:** \(\frac{1}{6}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(120/720=1/6\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{6}\)

### English explanation authority

1. Method — Use symmetry: in a random queue, every candidate is equally likely to occupy the first position.
2. Step 1 — Each of the 6 candidates can occupy the first position in the queue.
3. Step 2 — Only one of these 6 possibilities places the specified candidate first.
4. Step 3 — The required probability is \(\frac{1}{6}\).
5. Answer — The required probability is \(\frac{1}{6}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 50. PRB-QL-704 — PRB-CP-008 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-704`
- **Parameter fingerprint:** `be2182426adb1f3e6adb1f3ebe218242`
- **Mathematical fingerprint:** `ee6d79535d94a08b5d94a08bee6d7953`

### English source authority

5 candidates stand in a queue in a random order. What is the probability that two specified candidates are adjacent?

### Native question to review

5 ਉਮੀਦਵਾਰ ਬੇਤਰਤੀਬ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹੇ ਹੁੰਦੇ ਹਨ। ਦੋ ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਖੜ੍ਹੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{2}{5}\)
- **B.** \(\frac{1}{5}\)
- **C.** \(\frac{1}{3}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{3}{5}\)

**Correct answer:** A. \(\frac{2}{5}\)

**English-runtime answer value:** \(\frac{2}{5}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(48/120=2/5\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{2}{5}\)

### English explanation authority

1. Method — For n distinct people, total linear arrangements = n!. To count two specified people together, treat them as one block and multiply by 2 for their internal order.
2. Step 1 — Total arrangements = 5! = 5 \(\times\) 4 \(\times\) 3 \(\times\) 2 \(\times\) 1 = 120.
3. Step 2 — Adjacent arrangements = 2 \(\times\) 4! = 2 \(\times\) 4 \(\times\) 3 \(\times\) 2 \(\times\) 1 = 48.
4. Step 3 — Probability = favourable cases \(\div\) total cases = \(\frac{48}{120}\).
5. Simplification — Divide the numerator and denominator by 24: (48 \(\div\) 24)/(120 \(\div\) 24) = \(\frac{2}{5}\).
6. Key point — The two specified people can appear inside the block in either order.
7. Answer — The required probability is \(\frac{2}{5}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 51. PRB-QL-705 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-705`
- **Parameter fingerprint:** `5e6645f184cbf88984cbf8895e6645f1`
- **Mathematical fingerprint:** `7e8d69a59b93e8fd9b93e8fd7e8d69a5`

### English source authority

4 distinct posts are assigned at random among 6 men and 4 women. What is the probability that the first post is assigned to a woman?

### Native question to review

4 ਵੱਖ-ਵੱਖ ਅਹੁਦੇ 6 ਮਰਦਾਂ ਅਤੇ 4 ਔਰਤਾਂ ਵਿੱਚ ਬੇਤਰਤੀਬੀ ਨਾਲ ਵੰਡੇ ਜਾਂਦੇ ਹਨ। ਪਹਿਲਾ ਅਹੁਦਾ ਕਿਸੇ ਔਰਤ ਨੂੰ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{1}{5}\)
- **C.** \(\frac{3}{5}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{2}{5}\)

**Correct answer:** E. \(\frac{2}{5}\)

**English-runtime answer value:** \(\frac{2}{5}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(2016/5040=2/5\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{2}{5}\)

### English explanation authority

1. Method — Use symmetry at the first post. Every person is equally likely to receive that post, so compare the number of women with the total number of people.
2. Step 1 — There are 10 people altogether: 6 men + 4 women = 10.
3. Step 2 — 4 of the 10 people are women, so \(P\!\left(first post goes to a woman\right)\) = \(\frac{4}{10}\).
4. Step 3 — \(\frac{4}{10}\) = \(\frac{2}{5}\).
5. Key point — Assignments to the remaining posts do not change the probability for the first post.
6. Answer — The required probability is \(\frac{2}{5}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 52. PRB-QL-706 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-706`
- **Parameter fingerprint:** `d8c8e219fe7008a1fe7008a1d8c8e219`
- **Mathematical fingerprint:** `6b3c7b4e5f8c84da5f8c84da6b3c7b4e`

### English source authority

A 4-digit number is formed without repetition using the digits 1 to 5. What is the probability that the number is even?

### Native question to review

1 ਤੋਂ 5 ਤੱਕ ਦੇ ਅੰਕਾਂ ਨੂੰ ਬਿਨਾਂ ਦੁਹਰਾਏ ਵਰਤ ਕੇ 4 ਅੰਕਾਂ ਦੀ ਇੱਕ ਸੰਖਿਆ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਸੰਖਿਆ ਦੇ ਜੋੜੀ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{2}{5}\)
- **B.** \(\frac{1}{3}\)
- **C.** \(\frac{3}{5}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{1}{5}\)

**Correct answer:** A. \(\frac{2}{5}\)

**English-runtime answer value:** \(\frac{2}{5}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(48/120=2/5\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{2}{5}\)

### English explanation authority

1. Method — Position matters, so use permutations. For an even number, first fix an even unit digit and then arrange the remaining digits.
2. Step 1 — Total 4-digit numbers = 5P4 = 5!/1! = 5 \(\times\) 4 \(\times\) 3 \(\times\) 2 = 120.
3. Step 2 — The unit digit has 2 even choices. After fixing it, the remaining 3 positions can be filled in 4P3 = 4!/1! = 4 \(\times\) 3 \(\times\) 2 = 24 ways.
4. Step 3 — Favourable even numbers = 2 \(\times\) 24 = 48.
5. Step 4 — Probability = favourable cases \(\div\) total cases = \(\frac{48}{120}\).
6. Simplification — Divide the numerator and denominator by 24: (48 \(\div\) 24)/(120 \(\div\) 24) = \(\frac{2}{5}\).
7. Key point — Once the unit digit is fixed, it cannot be reused in the other positions.
8. Answer — The required probability is \(\frac{2}{5}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 53. PRB-QL-707 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-707`
- **Parameter fingerprint:** `5e909ac14d2164794d2164795e909ac1`
- **Mathematical fingerprint:** `3d6d47c85fff3bfc5fff3bfc3d6d47c8`

### English source authority

A 4-member committee is chosen at random from 5 men and 6 women. What is the probability that the committee includes at least one woman?

### Native question to review

5 ਮਰਦਾਂ ਅਤੇ 6 ਔਰਤਾਂ ਵਿੱਚੋਂ 4 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{65}{1584}\)
- **B.** \(\frac{32}{33}\)
- **C.** 1
- **D.** \(\frac{1}{66}\)
- **E.** \(\frac{65}{66}\)

**Correct answer:** E. \(\frac{65}{66}\)

**English-runtime answer value:** \(\frac{65}{66}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(325/330=65/66\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{65}{66}\)

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Total committees = \(\binom{11}{4}\).
3. Step 2 — \(\binom{11}{4}\) = 11!/(4! \(\times\) 7!) = (11 \(\times\) 10 \(\times\) 9 \(\times\) 8)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 330.
4. Step 3 — Use the complement. Committees containing no woman are all-men committees: \(\binom{5}{4}\) = 5.
5. Step 4 — Committees with at least one woman = 330 - 5 = 325.
6. Step 5 — Probability = favourable cases \(\div\) total cases = \(\frac{325}{330}\).
7. Simplification — Divide the numerator and denominator by 5: (325 \(\div\) 5)/(330 \(\div\) 5) = \(\frac{65}{66}\).
8. Key point — Combinations count each committee once because changing the order of the same members does not create a different committee.
9. Answer — The required probability is \(\frac{65}{66}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 54. PRB-QL-708 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-708`
- **Parameter fingerprint:** `c78fe3a79fb75c9f9fb75c9fc78fe3a7`
- **Mathematical fingerprint:** `4c2403efe842ded7e842ded74c2403ef`

### English source authority

A 4-member committee is formed from 6 men and 9 women. How many committees contain exactly 1 woman?

### Native question to review

6 ਮਰਦਾਂ ਅਤੇ 9 ਔਰਤਾਂ ਵਿੱਚੋਂ 4 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਅਜਿਹੀਆਂ ਕਿੰਨੀਆਂ ਕਮੇਟੀਆਂ ਬਣਾਈਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਠੀਕ 1 ਔਰਤ ਹੋਵੇ?

### Options

- **A.** 181
- **B.** 179
- **C.** 180
- **D.** 182
- **E.** 178

**Correct answer:** C. 180

**English-runtime answer value:** 180

### Native explanation to review

1. ਵਿਧੀ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ, ਇਸ ਲਈ ਸੰਚਯ ਵਰਤੋ।
2. ਗਣਨਾ: ਠੀਕ 1 ਔਰਤ ਚੁਣੋ ਅਤੇ ਬਾਕੀ 3 ਮੈਂਬਰ ਮਰਦਾਂ ਵਿੱਚੋਂ ਚੁਣੋ।
3. ਗਣਨਾ: \(1365\times\frac{12}{91}=180\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਔਰਤਾਂ ਅਤੇ ਮਰਦਾਂ ਦੀਆਂ ਚੋਣਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।
5. ਅੰਤਿਮ ਉੱਤਰ: 180

### English explanation authority

1. Method — A committee is an unordered selection. Choose the required women and men separately with combinations, then multiply the independent choices.
2. Step 1 — Ways to choose 1 woman: \(\binom{9}{1}\) = 9.
3. Step 2 — Ways to choose 3 men: \(\binom{6}{3}\) = 6!/(3! \(\times\) 3!) = (6 \(\times\) 5 \(\times\) 4)/(3 \(\times\) 2 \(\times\) 1) = 20.
4. Step 3 — Required committees = 9 \(\times\) 20 = 180.
5. Key point — No division by the total number of committees is needed because the question asks for a count, not a probability.
6. Answer — The required number of committees is 180.

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 55. PRB-QL-709 — PRB-CP-008 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-709`
- **Parameter fingerprint:** `7dda87906c9d3cb46c9d3cb47dda8790`
- **Mathematical fingerprint:** `e2367c4b1c884a131c884a13e2367c4b`

### English source authority

A 3-member committee is chosen at random from 9 men and 9 women. What is the probability that it contains exactly 1 woman?

### Native question to review

9 ਮਰਦਾਂ ਅਤੇ 9 ਔਰਤਾਂ ਵਿੱਚੋਂ 3 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਠੀਕ 1 ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{27}{68}\)
- **B.** \(\frac{41}{68}\)
- **C.** \(\frac{7}{17}\)
- **D.** \(\frac{13}{34}\)
- **E.** \(\frac{9}{136}\)

**Correct answer:** A. \(\frac{27}{68}\)

**English-runtime answer value:** \(\frac{27}{68}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(324/816=27/68\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{27}{68}\)

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Total committees = \(\binom{18}{3}\).
3. Step 2 — \(\binom{18}{3}\) = 18!/(3! \(\times\) 15!) = (18 \(\times\) 17 \(\times\) 16)/(3 \(\times\) 2 \(\times\) 1) = 816.
4. Step 3 — Choose 1 woman from 9: \(\binom{9}{1}\) = 9.
5. Step 4 — Choose 2 men from 9: \(\binom{9}{2}\) = 9!/(2! \(\times\) 7!) = (9 \(\times\) 8)/(2 \(\times\) 1) = 36.
6. Step 5 — Required committees = 9 \(\times\) 36 = 324.
7. Step 6 — Probability = favourable cases \(\div\) total cases = \(\frac{324}{816}\).
8. Simplification — Divide the numerator and denominator by 12: (324 \(\div\) 12)/(816 \(\div\) 12) = \(\frac{27}{68}\).
9. Key point — Combinations count each committee once because changing the order of the same members does not create a different committee.
10. Answer — The required probability is \(\frac{27}{68}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 56. PRB-QL-710 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-710`
- **Parameter fingerprint:** `6c1eafede4100135e41001356c1eafed`
- **Mathematical fingerprint:** `529cee710c8415090c841509529cee71`

### English source authority

A 4-member committee is chosen at random from 5 men and 5 women. What is the probability that it contains exactly 2 women?

### Native question to review

5 ਮਰਦਾਂ ਅਤੇ 5 ਔਰਤਾਂ ਵਿੱਚੋਂ 4 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਠੀਕ 2 ਔਰਤਾਂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{5}{11}\)
- **B.** \(\frac{3}{7}\)
- **C.** \(\frac{10}{21}\)
- **D.** \(\frac{11}{21}\)
- **E.** \(\frac{5}{252}\)

**Correct answer:** C. \(\frac{10}{21}\)

**English-runtime answer value:** \(\frac{10}{21}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(100/210=10/21\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{10}{21}\)

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Total committees = \(\binom{10}{4}\).
3. Step 2 — \(\binom{10}{4}\) = 10!/(4! \(\times\) 6!) = (10 \(\times\) 9 \(\times\) 8 \(\times\) 7)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 210.
4. Step 3 — Choose 2 women from 5: \(\binom{5}{2}\) = 5!/(2! \(\times\) 3!) = (5 \(\times\) 4)/(2 \(\times\) 1) = 10.
5. Step 4 — Choose 2 men from 5: \(\binom{5}{2}\) = 5!/(2! \(\times\) 3!) = (5 \(\times\) 4)/(2 \(\times\) 1) = 10.
6. Step 5 — Required committees = 10 \(\times\) 10 = 100.
7. Step 6 — Probability = favourable cases \(\div\) total cases = \(\frac{100}{210}\).
8. Simplification — Divide the numerator and denominator by 10: (100 \(\div\) 10)/(210 \(\div\) 10) = \(\frac{10}{21}\).
9. Key point — Combinations count each committee once because changing the order of the same members does not create a different committee.
10. Answer — The required probability is \(\frac{10}{21}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 57. PRB-QL-711 — PRB-CP-008 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-711`
- **Parameter fingerprint:** `0bf9ce400cd068040cd068040bf9ce40`
- **Mathematical fingerprint:** `a866a550e1c226f4e1c226f4a866a550`

### English source authority

6 candidates stand in a queue in a random order. What is the probability that a specified candidate occupies the first position?

### Native question to review

6 ਉਮੀਦਵਾਰ ਬੇਤਰਤੀਬ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹੇ ਹੁੰਦੇ ਹਨ। ਕਿਸੇ ਇੱਕ ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰ ਦੇ ਪਹਿਲੇ ਸਥਾਨ ਉੱਤੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{5}{6}\)
- **C.** \(\frac{1}{7}\)
- **D.** \(\frac{1}{6}\)
- **E.** 0

**Correct answer:** D. \(\frac{1}{6}\)

**English-runtime answer value:** \(\frac{1}{6}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(120/720=1/6\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{6}\)

### English explanation authority

1. Method — Use symmetry: in a random queue, every candidate is equally likely to occupy the first position.
2. Step 1 — Each of the 6 candidates can occupy the first position in the queue.
3. Step 2 — Only one of these 6 possibilities places the specified candidate first.
4. Step 3 — The required probability is \(\frac{1}{6}\).
5. Answer — The required probability is \(\frac{1}{6}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 58. PRB-QL-712 — PRB-CP-008 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-712`
- **Parameter fingerprint:** `96d723d41f3957d81f3957d896d723d4`
- **Mathematical fingerprint:** `ba665b59864e7a61864e7a61ba665b59`

### English source authority

6 candidates stand in a queue in a random order. What is the probability that two specified candidates are not adjacent?

### Native question to review

6 ਉਮੀਦਵਾਰ ਬੇਤਰਤੀਬ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹੇ ਹੁੰਦੇ ਹਨ। ਦੋ ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਨਾ ਖੜ੍ਹੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{2}{3}\)
- **C.** \(\frac{1}{2}\)
- **D.** 1
- **E.** \(\frac{481}{720}\)

**Correct answer:** B. \(\frac{2}{3}\)

**English-runtime answer value:** \(\frac{2}{3}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(480/720=2/3\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{2}{3}\)

### English explanation authority

1. Method — For n distinct people, total linear arrangements = n!. To count two specified people together, treat them as one block and multiply by 2 for their internal order.
2. Step 1 — Total arrangements = 6! = 6 \(\times\) 5 \(\times\) 4 \(\times\) 3 \(\times\) 2 \(\times\) 1 = 720.
3. Step 2 — Adjacent arrangements = 2 \(\times\) 5! = 2 \(\times\) 5 \(\times\) 4 \(\times\) 3 \(\times\) 2 \(\times\) 1 = 240.
4. Step 3 — Non-adjacent arrangements = 720 - 240 = 480.
5. Step 4 — Probability = favourable cases \(\div\) total cases = \(\frac{480}{720}\).
6. Simplification — Divide the numerator and denominator by 240: (480 \(\div\) 240)/(720 \(\div\) 240) = \(\frac{2}{3}\).
7. Key point — The two specified people can appear inside the block in either order.
8. Answer — The required probability is \(\frac{2}{3}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 59. PRB-QL-713 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-713`
- **Parameter fingerprint:** `5762595dd4bff6c5d4bff6c55762595d`
- **Mathematical fingerprint:** `70551eab449c6df3449c6df370551eab`

### English source authority

4 distinct posts are assigned at random among 7 men and 8 women. What is the probability that the first post is assigned to a woman?

### Native question to review

4 ਵੱਖ-ਵੱਖ ਅਹੁਦੇ 7 ਮਰਦਾਂ ਅਤੇ 8 ਔਰਤਾਂ ਵਿੱਚ ਬੇਤਰਤੀਬੀ ਨਾਲ ਵੰਡੇ ਜਾਂਦੇ ਹਨ। ਪਹਿਲਾ ਅਹੁਦਾ ਕਿਸੇ ਔਰਤ ਨੂੰ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{3}{5}\)
- **B.** \(\frac{7}{15}\)
- **C.** \(\frac{8}{15}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{4}{7}\)

**Correct answer:** C. \(\frac{8}{15}\)

**English-runtime answer value:** \(\frac{8}{15}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(17472/32760=8/15\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{8}{15}\)

### English explanation authority

1. Method — Count all arrangements first, then count the arrangements in which the specified person occupies one of the allowed positions.
2. Step 1 — Any of the 15 people can receive the first post.
3. Step 2 — 8 of these 15 people are women, and the remaining posts do not affect who receives the first post.
4. Step 3 — The required probability is \(\frac{8}{15}\).
5. Key point — The probability is valid because every admissible arrangement is treated as equally likely.
6. Answer — The required probability is \(\frac{8}{15}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 60. PRB-QL-714 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-714`
- **Parameter fingerprint:** `f8939d8a0b1227760b122776f8939d8a`
- **Mathematical fingerprint:** `76ce2e72eb2f1c4eeb2f1c4e76ce2e72`

### English source authority

A 4-digit number is formed without repetition using the digits 1 to 9. What is the probability that the number is even?

### Native question to review

1 ਤੋਂ 9 ਤੱਕ ਦੇ ਅੰਕਾਂ ਨੂੰ ਬਿਨਾਂ ਦੁਹਰਾਏ ਵਰਤ ਕੇ 4 ਅੰਕਾਂ ਦੀ ਇੱਕ ਸੰਖਿਆ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਸੰਖਿਆ ਦੇ ਜੋੜੀ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{1}{2}\)
- **C.** \(\frac{2}{5}\)
- **D.** \(\frac{4}{9}\)
- **E.** \(\frac{5}{9}\)

**Correct answer:** D. \(\frac{4}{9}\)

**English-runtime answer value:** \(\frac{4}{9}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(1344/3024=4/9\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{4}{9}\)

### English explanation authority

1. Method — Position matters, so use permutations. For an even number, first fix an even unit digit and then arrange the remaining digits.
2. Step 1 — Total 4-digit numbers = 9P4 = 9!/5! = 9 \(\times\) 8 \(\times\) 7 \(\times\) 6 = 3024.
3. Step 2 — The unit digit has 4 even choices. After fixing it, the remaining 3 positions can be filled in 8P3 = 8!/5! = 8 \(\times\) 7 \(\times\) 6 = 336 ways.
4. Step 3 — Favourable even numbers = 4 \(\times\) 336 = 1344.
5. Step 4 — Probability = favourable cases \(\div\) total cases = \(\frac{1344}{3024}\).
6. Simplification — Divide the numerator and denominator by 336: (1344 \(\div\) 336)/(3024 \(\div\) 336) = \(\frac{4}{9}\).
7. Key point — Once the unit digit is fixed, it cannot be reused in the other positions.
8. Answer — The required probability is \(\frac{4}{9}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 61. PRB-QL-715 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-715`
- **Parameter fingerprint:** `4d9f00f2302672ce302672ce4d9f00f2`
- **Mathematical fingerprint:** `be2b0e6c0329430003294300be2b0e6c`

### English source authority

A 4-member committee is chosen at random from 5 men and 9 women. What is the probability that the committee includes at least one woman?

### Native question to review

5 ਮਰਦਾਂ ਅਤੇ 9 ਔਰਤਾਂ ਵਿੱਚੋਂ 4 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{995}{1001}\)
- **B.** \(\frac{996}{1001}\)
- **C.** \(\frac{5}{1001}\)
- **D.** \(\frac{997}{1001}\)
- **E.** \(\frac{83}{2002}\)

**Correct answer:** B. \(\frac{996}{1001}\)

**English-runtime answer value:** \(\frac{996}{1001}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(996/1001=996/1001\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{996}{1001}\)

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Total committees = \(\binom{14}{4}\).
3. Step 2 — \(\binom{14}{4}\) = 14!/(4! \(\times\) 10!) = (14 \(\times\) 13 \(\times\) 12 \(\times\) 11)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 1001.
4. Step 3 — Use the complement. Committees containing no woman are all-men committees: \(\binom{5}{4}\) = 5.
5. Step 4 — Committees with at least one woman = 1001 - 5 = 996.
6. Step 5 — Probability = favourable cases \(\div\) total cases = \(\frac{996}{1001}\).
7. Key point — Combinations count each committee once because changing the order of the same members does not create a different committee.
8. Answer — The required probability is \(\frac{996}{1001}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 62. PRB-QL-716 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-716`
- **Parameter fingerprint:** `c2b3ea1ee7a8664ae7a8664ac2b3ea1e`
- **Mathematical fingerprint:** `2ca11623d2cbc4bbd2cbc4bb2ca11623`

### English source authority

A 4-member committee is chosen from 7 men and 6 women. The probability that it contains exactly 1 woman is \(\frac{42}{143}\). How many such committees can be formed?

### Native question to review

7 ਮਰਦਾਂ ਅਤੇ 6 ਔਰਤਾਂ ਵਿੱਚੋਂ 4 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਠੀਕ 1 ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ \(\frac{42}{143}\) ਹੈ। ਅਜਿਹੀਆਂ ਕਿੰਨੀਆਂ ਕਮੇਟੀਆਂ ਬਣਾਈਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ?

### Options

- **A.** 211
- **B.** 210
- **C.** 209
- **D.** 212
- **E.** 208

**Correct answer:** B. 210

**English-runtime answer value:** 210

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(715\times\frac{42}{143}=210\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: 210

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Choose 1 woman from 6: \(\binom{6}{1}\) = 6.
3. Step 2 — Choose 3 men from 7: \(\binom{7}{3}\) = 7!/(3! \(\times\) 4!) = (7 \(\times\) 6 \(\times\) 5)/(3 \(\times\) 2 \(\times\) 1) = 35.
4. Step 3 — Required committees = 6 \(\times\) 35 = 210.
5. Key point — The order in which committee members are named is irrelevant, so each committee must be counted only once.
6. Answer — The required number is 210.

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 63. PRB-QL-717 — PRB-CP-008 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-717`
- **Parameter fingerprint:** `4afa1e4c920684e0920684e04afa1e4c`
- **Mathematical fingerprint:** `5ad8965d1350fbc51350fbc55ad8965d`

### English source authority

A 3-member committee is chosen at random from 6 men and 7 women. What is the probability that it contains exactly 1 woman?

### Native question to review

6 ਮਰਦਾਂ ਅਤੇ 7 ਔਰਤਾਂ ਵਿੱਚੋਂ 3 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਠੀਕ 1 ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{35}{572}\)
- **B.** \(\frac{105}{286}\)
- **C.** \(\frac{53}{143}\)
- **D.** \(\frac{181}{286}\)
- **E.** \(\frac{4}{11}\)

**Correct answer:** B. \(\frac{105}{286}\)

**English-runtime answer value:** \(\frac{105}{286}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(105/286=105/286\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{105}{286}\)

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Total committees = \(\binom{13}{3}\).
3. Step 2 — \(\binom{13}{3}\) = 13!/(3! \(\times\) 10!) = (13 \(\times\) 12 \(\times\) 11)/(3 \(\times\) 2 \(\times\) 1) = 286.
4. Step 3 — Choose 1 woman from 7: \(\binom{7}{1}\) = 7.
5. Step 4 — Choose 2 men from 6: \(\binom{6}{2}\) = 6!/(2! \(\times\) 4!) = (6 \(\times\) 5)/(2 \(\times\) 1) = 15.
6. Step 5 — Required committees = 7 \(\times\) 15 = 105.
7. Step 6 — Probability = favourable cases \(\div\) total cases = \(\frac{105}{286}\).
8. Key point — Combinations count each committee once because changing the order of the same members does not create a different committee.
9. Answer — The required probability is \(\frac{105}{286}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 64. PRB-QL-718 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-718`
- **Parameter fingerprint:** `9f35bc23f4dfdabbf4dfdabb9f35bc23`
- **Mathematical fingerprint:** `118e48ef0fbb2bd70fbb2bd7118e48ef`

### English source authority

A 4-member committee is chosen at random from 6 men and 9 women. What is the probability that it contains exactly 2 women?

### Native question to review

6 ਮਰਦਾਂ ਅਤੇ 9 ਔਰਤਾਂ ਵਿੱਚੋਂ 4 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਠੀਕ 2 ਔਰਤਾਂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{55}{91}\)
- **B.** \(\frac{37}{91}\)
- **C.** \(\frac{5}{13}\)
- **D.** \(\frac{3}{182}\)
- **E.** \(\frac{36}{91}\)

**Correct answer:** E. \(\frac{36}{91}\)

**English-runtime answer value:** \(\frac{36}{91}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(540/1365=36/91\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{36}{91}\)

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Total committees = \(\binom{15}{4}\).
3. Step 2 — \(\binom{15}{4}\) = 15!/(4! \(\times\) 11!) = (15 \(\times\) 14 \(\times\) 13 \(\times\) 12)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 1365.
4. Step 3 — Choose 2 women from 9: \(\binom{9}{2}\) = 9!/(2! \(\times\) 7!) = (9 \(\times\) 8)/(2 \(\times\) 1) = 36.
5. Step 4 — Choose 2 men from 6: \(\binom{6}{2}\) = 6!/(2! \(\times\) 4!) = (6 \(\times\) 5)/(2 \(\times\) 1) = 15.
6. Step 5 — Required committees = 36 \(\times\) 15 = 540.
7. Step 6 — Probability = favourable cases \(\div\) total cases = \(\frac{540}{1365}\).
8. Simplification — Divide the numerator and denominator by 15: (540 \(\div\) 15)/(1365 \(\div\) 15) = \(\frac{36}{91}\).
9. Key point — Combinations count each committee once because changing the order of the same members does not create a different committee.
10. Answer — The required probability is \(\frac{36}{91}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 65. PRB-QL-719 — PRB-CP-008 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-719`
- **Parameter fingerprint:** `5704e34d5855d2955855d2955704e34d`
- **Mathematical fingerprint:** `a7a07750c28d48f4c28d48f4a7a07750`

### English source authority

6 candidates stand in a queue in a random order. What is the probability that a specified candidate occupies the first position?

### Native question to review

6 ਉਮੀਦਵਾਰ ਬੇਤਰਤੀਬ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹੇ ਹੁੰਦੇ ਹਨ। ਕਿਸੇ ਇੱਕ ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰ ਦੇ ਪਹਿਲੇ ਸਥਾਨ ਉੱਤੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{6}\)
- **B.** \(\frac{1}{7}\)
- **C.** \(\frac{1}{3}\)
- **D.** 0
- **E.** \(\frac{5}{6}\)

**Correct answer:** A. \(\frac{1}{6}\)

**English-runtime answer value:** \(\frac{1}{6}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(120/720=1/6\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{6}\)

### English explanation authority

1. Method — Use symmetry: in a random queue, every candidate is equally likely to occupy the first position.
2. Step 1 — Each of the 6 candidates can occupy the first position in the queue.
3. Step 2 — Only one of these 6 possibilities places the specified candidate first.
4. Step 3 — The required probability is \(\frac{1}{6}\).
5. Answer — The required probability is \(\frac{1}{6}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 66. PRB-QL-720 — PRB-CP-008 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-720`
- **Parameter fingerprint:** `1aa1afc2cc1cc8becc1cc8be1aa1afc2`
- **Mathematical fingerprint:** `3164c4c54e33be9d4e33be9d3164c4c5`

### English source authority

6 candidates stand in a queue in a random order. What is the probability that two specified candidates are not adjacent?

### Native question to review

6 ਉਮੀਦਵਾਰ ਬੇਤਰਤੀਬ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹੇ ਹੁੰਦੇ ਹਨ। ਦੋ ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਨਾ ਖੜ੍ਹੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{2}{3}\)
- **B.** \(\frac{481}{720}\)
- **C.** \(\frac{1}{3}\)
- **D.** 1
- **E.** \(\frac{1}{2}\)

**Correct answer:** A. \(\frac{2}{3}\)

**English-runtime answer value:** \(\frac{2}{3}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(480/720=2/3\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{2}{3}\)

### English explanation authority

1. Method — For n distinct people, total linear arrangements = n!. To count two specified people together, treat them as one block and multiply by 2 for their internal order.
2. Step 1 — Total arrangements = 6! = 6 \(\times\) 5 \(\times\) 4 \(\times\) 3 \(\times\) 2 \(\times\) 1 = 720.
3. Step 2 — Adjacent arrangements = 2 \(\times\) 5! = 2 \(\times\) 5 \(\times\) 4 \(\times\) 3 \(\times\) 2 \(\times\) 1 = 240.
4. Step 3 — Non-adjacent arrangements = 720 - 240 = 480.
5. Step 4 — Probability = favourable cases \(\div\) total cases = \(\frac{480}{720}\).
6. Simplification — Divide the numerator and denominator by 240: (480 \(\div\) 240)/(720 \(\div\) 240) = \(\frac{2}{3}\).
7. Key point — The two specified people can appear inside the block in either order.
8. Answer — The required probability is \(\frac{2}{3}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 67. PRB-QL-721 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-721`
- **Parameter fingerprint:** `f6dc5297711e256f711e256ff6dc5297`
- **Mathematical fingerprint:** `9d4992fe32a734aa32a734aa9d4992fe`

### English source authority

4 distinct posts are assigned at random among 5 men and 8 women. What is the probability that the first post is assigned to a woman?

### Native question to review

4 ਵੱਖ-ਵੱਖ ਅਹੁਦੇ 5 ਮਰਦਾਂ ਅਤੇ 8 ਔਰਤਾਂ ਵਿੱਚ ਬੇਤਰਤੀਬੀ ਨਾਲ ਵੰਡੇ ਜਾਂਦੇ ਹਨ। ਪਹਿਲਾ ਅਹੁਦਾ ਕਿਸੇ ਔਰਤ ਨੂੰ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{4}{7}\)
- **B.** \(\frac{5}{13}\)
- **C.** \(\frac{8}{13}\)
- **D.** \(\frac{9}{13}\)
- **E.** \(\frac{7}{13}\)

**Correct answer:** C. \(\frac{8}{13}\)

**English-runtime answer value:** \(\frac{8}{13}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(10560/17160=8/13\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{8}{13}\)

### English explanation authority

1. Method — Count all arrangements first, then count the arrangements in which the specified person occupies one of the allowed positions.
2. Step 1 — Any of the 13 people can receive the first post.
3. Step 2 — 8 of these 13 people are women, and the remaining posts do not affect who receives the first post.
4. Step 3 — The required probability is \(\frac{8}{13}\).
5. Key point — The probability is valid because every admissible arrangement is treated as equally likely.
6. Answer — The required probability is \(\frac{8}{13}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 68. PRB-QL-722 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-722`
- **Parameter fingerprint:** `896052184dea77ec4dea77ec89605218`
- **Mathematical fingerprint:** `6d9e2cd4232608d8232608d86d9e2cd4`

### English source authority

A 4-digit number is formed without repetition using the digits 1 to 8. What is the probability that the number is even?

### Native question to review

1 ਤੋਂ 8 ਤੱਕ ਦੇ ਅੰਕਾਂ ਨੂੰ ਬਿਨਾਂ ਦੁਹਰਾਏ ਵਰਤ ਕੇ 4 ਅੰਕਾਂ ਦੀ ਇੱਕ ਸੰਖਿਆ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਸੰਖਿਆ ਦੇ ਜੋੜੀ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** 0
- **B.** \(\frac{1}{3}\)
- **C.** \(\frac{841}{1680}\)
- **D.** 1
- **E.** \(\frac{1}{2}\)

**Correct answer:** E. \(\frac{1}{2}\)

**English-runtime answer value:** \(\frac{1}{2}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(840/1680=1/2\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{2}\)

### English explanation authority

1. Method — Position matters, so use permutations. For an even number, first fix an even unit digit and then arrange the remaining digits.
2. Step 1 — Total 4-digit numbers = 8P4 = 8!/4! = 8 \(\times\) 7 \(\times\) 6 \(\times\) 5 = 1680.
3. Step 2 — The unit digit has 4 even choices. After fixing it, the remaining 3 positions can be filled in 7P3 = 7!/4! = 7 \(\times\) 6 \(\times\) 5 = 210 ways.
4. Step 3 — Favourable even numbers = 4 \(\times\) 210 = 840.
5. Step 4 — Probability = favourable cases \(\div\) total cases = \(\frac{840}{1680}\).
6. Simplification — Divide the numerator and denominator by 840: (840 \(\div\) 840)/(1680 \(\div\) 840) = \(\frac{1}{2}\).
7. Key point — Once the unit digit is fixed, it cannot be reused in the other positions.
8. Answer — The required probability is \(\frac{1}{2}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 69. PRB-QL-723 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-723`
- **Parameter fingerprint:** `b8487f809c0ed1c49c0ed1c4b8487f80`
- **Mathematical fingerprint:** `dc5c1b60f7844b24f7844b24dc5c1b60`

### English source authority

A 4-member committee is chosen at random from 10 men and 9 women. What is the probability that the committee includes at least one woman?

### Native question to review

10 ਮਰਦਾਂ ਅਤੇ 9 ਔਰਤਾਂ ਵਿੱਚੋਂ 4 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{35}{646}\)
- **B.** \(\frac{611}{646}\)
- **C.** \(\frac{611}{15504}\)
- **D.** \(\frac{305}{323}\)
- **E.** \(\frac{18}{19}\)

**Correct answer:** B. \(\frac{611}{646}\)

**English-runtime answer value:** \(\frac{611}{646}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(3666/3876=611/646\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{611}{646}\)

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Total committees = \(\binom{19}{4}\).
3. Step 2 — \(\binom{19}{4}\) = 19!/(4! \(\times\) 15!) = (19 \(\times\) 18 \(\times\) 17 \(\times\) 16)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 3876.
4. Step 3 — Use the complement. Committees containing no woman are all-men committees: \(\binom{10}{4}\) = 10!/(4! \(\times\) 6!) = (10 \(\times\) 9 \(\times\) 8 \(\times\) 7)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 210.
5. Step 4 — Committees with at least one woman = 3876 - 210 = 3666.
6. Step 5 — Probability = favourable cases \(\div\) total cases = \(\frac{3666}{3876}\).
7. Simplification — Divide the numerator and denominator by 6: (3666 \(\div\) 6)/(3876 \(\div\) 6) = \(\frac{611}{646}\).
8. Key point — Combinations count each committee once because changing the order of the same members does not create a different committee.
9. Answer — The required probability is \(\frac{611}{646}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 70. PRB-QL-724 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-724`
- **Parameter fingerprint:** `29b333bc6a1963b06a1963b029b333bc`
- **Mathematical fingerprint:** `3a7a8de2f18db7def18db7de3a7a8de2`

### English source authority

A 4-member committee is chosen from 7 men and 4 women. The probability that it contains exactly 1 woman is \(\frac{14}{33}\). How many such committees can be formed?

### Native question to review

7 ਮਰਦਾਂ ਅਤੇ 4 ਔਰਤਾਂ ਵਿੱਚੋਂ 4 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਠੀਕ 1 ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ \(\frac{14}{33}\) ਹੈ। ਅਜਿਹੀਆਂ ਕਿੰਨੀਆਂ ਕਮੇਟੀਆਂ ਬਣਾਈਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ?

### Options

- **A.** 140
- **B.** 142
- **C.** 141
- **D.** 138
- **E.** 139

**Correct answer:** A. 140

**English-runtime answer value:** 140

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(330\times\frac{14}{33}=140\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: 140

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Choose 1 woman from 4: \(\binom{4}{1}\) = 4.
3. Step 2 — Choose 3 men from 7: \(\binom{7}{3}\) = 7!/(3! \(\times\) 4!) = (7 \(\times\) 6 \(\times\) 5)/(3 \(\times\) 2 \(\times\) 1) = 35.
4. Step 3 — Required committees = 4 \(\times\) 35 = 140.
5. Key point — The order in which committee members are named is irrelevant, so each committee must be counted only once.
6. Answer — The required number is 140.

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 71. PRB-QL-725 — PRB-CP-008 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-725`
- **Parameter fingerprint:** `ff06f25e48247f0a48247f0aff06f25e`
- **Mathematical fingerprint:** `2c1f8d31c03de849c03de8492c1f8d31`

### English source authority

A 3-member committee is chosen at random from 7 men and 6 women. What is the probability that it contains exactly 1 woman?

### Native question to review

7 ਮਰਦਾਂ ਅਤੇ 6 ਔਰਤਾਂ ਵਿੱਚੋਂ 3 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਠੀਕ 1 ਔਰਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{80}{143}\)
- **B.** \(\frac{63}{143}\)
- **C.** \(\frac{64}{143}\)
- **D.** \(\frac{62}{143}\)
- **E.** \(\frac{21}{286}\)

**Correct answer:** B. \(\frac{63}{143}\)

**English-runtime answer value:** \(\frac{63}{143}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(126/286=63/143\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{63}{143}\)

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Total committees = \(\binom{13}{3}\).
3. Step 2 — \(\binom{13}{3}\) = 13!/(3! \(\times\) 10!) = (13 \(\times\) 12 \(\times\) 11)/(3 \(\times\) 2 \(\times\) 1) = 286.
4. Step 3 — Choose 1 woman from 6: \(\binom{6}{1}\) = 6.
5. Step 4 — Choose 2 men from 7: \(\binom{7}{2}\) = 7!/(2! \(\times\) 5!) = (7 \(\times\) 6)/(2 \(\times\) 1) = 21.
6. Step 5 — Required committees = 6 \(\times\) 21 = 126.
7. Step 6 — Probability = favourable cases \(\div\) total cases = \(\frac{126}{286}\).
8. Simplification — Divide the numerator and denominator by 2: (126 \(\div\) 2)/(286 \(\div\) 2) = \(\frac{63}{143}\).
9. Key point — Combinations count each committee once because changing the order of the same members does not create a different committee.
10. Answer — The required probability is \(\frac{63}{143}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 72. PRB-QL-726 — PRB-CP-008 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-726`
- **Parameter fingerprint:** `6d42189b051a39c3051a39c36d42189b`
- **Mathematical fingerprint:** `f8d9be65cec6f53dcec6f53df8d9be65`

### English source authority

A 4-member committee is chosen at random from 10 men and 5 women. What is the probability that it contains exactly 3 women?

### Native question to review

10 ਮਰਦਾਂ ਅਤੇ 5 ਔਰਤਾਂ ਵਿੱਚੋਂ 4 ਮੈਂਬਰਾਂ ਦੀ ਇੱਕ ਕਮੇਟੀ ਬੇਤਰਤੀਬੀ ਨਾਲ ਬਣਾਈ ਜਾਂਦੀ ਹੈ। ਕਮੇਟੀ ਵਿੱਚ ਠੀਕ 3 ਔਰਤਾਂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{19}{273}\)
- **B.** \(\frac{5}{1638}\)
- **C.** \(\frac{253}{273}\)
- **D.** \(\frac{20}{273}\)
- **E.** \(\frac{1}{13}\)

**Correct answer:** D. \(\frac{20}{273}\)

**English-runtime answer value:** \(\frac{20}{273}\)

### Native explanation to review

1. ਵਿਧੀ: ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।
2. ਗਣਨਾ: ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।
3. ਗਣਨਾ: \(100/1365=20/273\)
4. ਮੁੱਖ ਬਿੰਦੂ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{20}{273}\)

### English explanation authority

1. Method — A committee is an unordered selection. Use \(\binom{n}{r}\) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.
2. Step 1 — Total committees = \(\binom{15}{4}\).
3. Step 2 — \(\binom{15}{4}\) = 15!/(4! \(\times\) 11!) = (15 \(\times\) 14 \(\times\) 13 \(\times\) 12)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 1365.
4. Step 3 — Choose 3 women from 5: \(\binom{5}{3}\) = 5!/(3! \(\times\) 2!) = (5 \(\times\) 4)/(2 \(\times\) 1) = 10.
5. Step 4 — Choose 1 man from 10: \(\binom{10}{1}\) = 10.
6. Step 5 — Required committees = 10 \(\times\) 10 = 100.
7. Step 6 — Probability = favourable cases \(\div\) total cases = \(\frac{100}{1365}\).
8. Simplification — Divide the numerator and denominator by 5: (100 \(\div\) 5)/(1365 \(\div\) 5) = \(\frac{20}{273}\).
9. Key point — Combinations count each committee once because changing the order of the same members does not create a different committee.
10. Answer — The required probability is \(\frac{20}{273}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 73. PRB-QL-801 — PRB-CP-009 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-801`
- **Parameter fingerprint:** `205f0ff55023f2ad5023f2ad205f0ff5`
- **Mathematical fingerprint:** `107c90bbc4f752e3c4f752e3107c90bb`

### English source authority

In a group of 100 candidates, 31 candidates qualified in Quantitative Aptitude, 20 candidates qualified in Reasoning, and 10 candidates meet both conditions. What is the probability that a randomly selected candidate meets at least one condition?

### Native question to review

100 ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 31 ਕੁਆਂਟੀਟੇਟਿਵ ਐਪਟੀਟਿਊਡ ਵਿੱਚ ਪਾਸ ਹਨ, 20 ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ 10 ਦੋਵਾਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{21}{50}\)
- **B.** \(\frac{59}{100}\)
- **C.** \(\frac{2}{5}\)
- **D.** \(\frac{41}{100}\)
- **E.** \(\frac{51}{100}\)

**Correct answer:** D. \(\frac{41}{100}\)

**English-runtime answer value:** \(\frac{41}{100}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(41/100=41/100\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{41}{100}\)

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — Use n(A \(\cup\) B) = n(A) + n(B) - n(A \(\cap\) B), because the 10 people in both groups would otherwise be counted twice.
3. Step 2 — Required people = 31 + 20 - 10 = 41.
4. Step 3 — The required probability is \(\frac{41}{100}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{41}{100}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਘਟਨਾਵਾਂ ਦਾ ਸੰਘ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 74. PRB-QL-802 — PRB-CP-009 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-802`
- **Parameter fingerprint:** `bb0e7d7c1d30ecf01d30ecf0bb0e7d7c`
- **Mathematical fingerprint:** `2bbef2f762a1774f62a1774f2bbef2f7`

### English source authority

In a group of 84 students, 10 students play both cricket and football. What is the probability that a randomly selected student plays both games?

### Native question to review

84 ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 10 ਵਿਦਿਆਰਥੀ ਕ੍ਰਿਕਟ ਅਤੇ ਫੁੱਟਬਾਲ ਦੋਵੇਂ ਖੇਡਦੇ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਦੋਵੇਂ ਖੇਡ ਖੇਡਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{37}{42}\)
- **B.** \(\frac{5}{42}\)
- **C.** \(\frac{1}{7}\)
- **D.** \(\frac{5}{43}\)
- **E.** \(\frac{2}{21}\)

**Correct answer:** B. \(\frac{5}{42}\)

**English-runtime answer value:** \(\frac{5}{42}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(10/84=5/42\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{5}{42}\)

### English explanation authority

1. Method — The required event is the overlap of the two groups; compare that overlap with the complete group.
2. Step 1 — The intersection means the people who satisfy both cricket and football.
3. Step 2 — The question gives this overlap directly as 10 out of 84.
4. Step 3 — The required probability is \(\frac{10}{84}\) = \(\frac{5}{42}\).
5. Answer — The required probability is \(\frac{5}{42}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਘਟਨਾਵਾਂ ਦਾ ਪ੍ਰਤੀਛੇਦ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 75. PRB-QL-803 — PRB-CP-009 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-803`
- **Parameter fingerprint:** `6483d0b940752941407529416483d0b9`
- **Mathematical fingerprint:** `c64e92785670d6cc5670d6ccc64e9278`

### English source authority

In a group of 61 candidates, 31 candidates cleared Section A, 34 candidates cleared Section B, and 12 candidates meet both conditions. What is the probability that a randomly selected candidate meets exactly one condition?

### Native question to review

61 ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 31 ਸੈਕਸ਼ਨ A ਵਿੱਚ ਪਾਸ ਹਨ, 34 ਸੈਕਸ਼ਨ B ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ 12 ਦੋਵਾਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਠੀਕ ਇੱਕ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{40}{61}\)
- **B.** \(\frac{41}{61}\)
- **C.** \(\frac{42}{61}\)
- **D.** \(\frac{20}{61}\)
- **E.** \(\frac{53}{61}\)

**Correct answer:** B. \(\frac{41}{61}\)

**English-runtime answer value:** \(\frac{41}{61}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(41/61=41/61\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{41}{61}\)

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — For exactly one condition, remove the overlap once from each group.
3. Step 2 — Required people = 31 + 34 - 2 \(\times\) 12 = 41.
4. Step 3 — The required probability is \(\frac{41}{61}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{41}{61}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਦੋ ਘਟਨਾਵਾਂ ਵਿੱਚ ਠੀਕ ਇੱਕ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 76. PRB-QL-804 — PRB-CP-009 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-804`
- **Parameter fingerprint:** `b0cf86fef2e048aaf2e048aab0cf86fe`
- **Mathematical fingerprint:** `12d5772cc47a8340c47a834012d5772c`

### English source authority

In a group of 77 students, 32 students passed Mathematics, 36 students passed English, and 7 students meet both conditions. What is the probability that a randomly selected student meets neither condition?

### Native question to review

77 ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 32 ਗਣਿਤ ਵਿੱਚ ਪਾਸ ਹਨ, 36 ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ 7 ਦੋਵਾਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਕਿਸੇ ਵੀ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{17}{77}\)
- **B.** \(\frac{16}{77}\)
- **C.** \(\frac{68}{77}\)
- **D.** \(\frac{61}{77}\)
- **E.** \(\frac{15}{77}\)

**Correct answer:** B. \(\frac{16}{77}\)

**English-runtime answer value:** \(\frac{16}{77}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(16/77=16/77\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{16}{77}\)

### English explanation authority

1. Method — Use inclusion–exclusion to find those in at least one group, then subtract that count from the total.
2. Step 1 — First find those satisfying at least one condition: 32 + 36 - 7 = 61.
3. Step 2 — People satisfying neither condition = 77 - 61 = 16.
4. Step 3 — The required probability is \(\frac{16}{77}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{16}{77}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਨਾ A ਨਾ B ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 77. PRB-QL-805 — PRB-CP-009 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-805`
- **Parameter fingerprint:** `990e83d32da2ef0b2da2ef0b990e83d3`
- **Mathematical fingerprint:** `48b1cec5a790d89da790d89d48b1cec5`

### English source authority

A candidate can receive either Scholarship A or Scholarship B, but not both. If \(P\!\left(A\right)\) = \(\frac{3}{10}\) and \(P\!\left(B\right)\) = \(\frac{1}{10}\), what is the probability that the candidate receives a scholarship?

### Native question to review

ਇੱਕ ਉਮੀਦਵਾਰ ਨੂੰ ਸਕਾਲਰਸ਼ਿਪ A ਜਾਂ ਸਕਾਲਰਸ਼ਿਪ B ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਮਿਲ ਸਕਦੀ ਹੈ, ਦੋਵੇਂ ਨਹੀਂ। ਜੇ \(P\!\left(A\right)\) = \(\frac{3}{10}\) ਅਤੇ \(P\!\left(B\right)\) = \(\frac{1}{10}\) ਹੈ, ਤਾਂ ਉਮੀਦਵਾਰ ਨੂੰ ਕੋਈ ਸਕਾਲਰਸ਼ਿਪ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{5}\)
- **B.** \(\frac{2}{5}\)
- **C.** \(\frac{3}{5}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{1}{3}\)

**Correct answer:** B. \(\frac{2}{5}\)

**English-runtime answer value:** \(\frac{2}{5}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(\frac{3}{10}+\frac{1}{10}=\frac{2}{5}\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{2}{5}\)

### English explanation authority

1. Method — The events are mutually exclusive, so add their probabilities; there is no overlap to subtract.
2. Step 1 — The two events are mutually exclusive, so they cannot happen together and there is no overlap to subtract.
3. Step 2 — \(P\!\left(A or B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) = \(\frac{3}{10}\) + \(\frac{1}{10}\).
4. Step 3 — The required probability is \(\frac{2}{5}\).
5. Answer — The required probability is \(\frac{2}{5}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 78. PRB-QL-806 — PRB-CP-009 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-806`
- **Parameter fingerprint:** `25ac1b0d3afdf9d53afdf9d525ac1b0d`
- **Mathematical fingerprint:** `a72f3d9b150066c3150066c3a72f3d9b`

### English source authority

The probabilities that a candidate clears Section A and Section B are \(\frac{5}{8}\) and \(\frac{1}{7}\), respectively. The results are independent. What is the probability that the candidate clears both sections?

### Native question to review

ਕਿਸੇ ਉਮੀਦਵਾਰ ਦੇ ਸੈਕਸ਼ਨ A ਅਤੇ ਸੈਕਸ਼ਨ B ਪਾਸ ਕਰਨ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਕ੍ਰਮਵਾਰ \(\frac{5}{8}\) ਅਤੇ \(\frac{1}{7}\) ਹਨ। ਦੋਵੇਂ ਨਤੀਜੇ ਸੁਤੰਤਰ ਹਨ। ਉਮੀਦਵਾਰ ਦੇ ਦੋਵੇਂ ਸੈਕਸ਼ਨ ਪਾਸ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{43}{56}\)
- **B.** \(\frac{5}{56}\)
- **C.** \(\frac{1}{14}\)
- **D.** \(\frac{51}{56}\)
- **E.** \(\frac{3}{28}\)

**Correct answer:** B. \(\frac{5}{56}\)

**English-runtime answer value:** \(\frac{5}{56}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(\frac{5}{8}\times\frac{1}{7}=\frac{5}{56}\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{5}{56}\)

### English explanation authority

1. Method — The events are independent, so multiply their probabilities to obtain the probability that both occur.
2. Step 1 — The two results are independent, so the outcome of one does not change the probability of the other.
3. Step 2 — \(P\!\left(both\right)\) = \(P\!\left(A\right)\) \(\times\) \(P\!\left(B\right)\) = \(\frac{5}{8}\) \(\times\) \(\frac{1}{7}\).
4. Step 3 — The required probability is \(\frac{5}{56}\).
5. Answer — The required probability is \(\frac{5}{56}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 79. PRB-QL-807 — PRB-CP-009 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-807`
- **Parameter fingerprint:** `43fff0f3324af22b324af22b43fff0f3`
- **Mathematical fingerprint:** `40c512bb24a8a4e324a8a4e340c512bb`

### English source authority

For a group of 51 candidates, \(P\!\left(Section A\right)\) = \(\frac{35}{51}\), \(P\!\left(Section B\right)\) = \(\frac{32}{51}\), and \(P\!\left(Section A or Section B\right)\) = \(\frac{50}{51}\). Find \(P\!\left(Section A and Section B\right)\).

### Native question to review

51 ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ ਸਮੂਹ ਲਈ \(P\!\left(ਸੈਕਸ਼ਨ A\right)\) = \(\frac{35}{51}\), \(P\!\left(ਸੈਕਸ਼ਨ B\right)\) = \(\frac{32}{51}\) ਅਤੇ \(P\!\left(ਸੈਕਸ਼ਨ A ਜਾਂ ਸੈਕਸ਼ਨ B\right)\) = \(\frac{50}{51}\) ਹੈ। \(P\!\left(ਸੈਕਸ਼ਨ A ਅਤੇ ਸੈਕਸ਼ਨ B\right)\) ਕੱਢੋ।

### Options

- **A.** \(\frac{2}{3}\)
- **B.** \(\frac{1}{3}\)
- **C.** 0
- **D.** \(\frac{1}{4}\)
- **E.** \(\frac{1}{2}\)

**Correct answer:** B. \(\frac{1}{3}\)

**English-runtime answer value:** \(\frac{1}{3}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(17/51=1/3\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{3}\)

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — Apply \(P\!\left(A \cup B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) - \(P\!\left(A \cap B\right)\).
3. Step 2 — In counts, the overlap is 35 + 32 - 50 = 17.
4. Step 3 — The required probability is \(\frac{17}{51}\) = \(\frac{1}{3}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{1}{3}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਅਣਜਾਣ ਪ੍ਰਤੀਛੇਦ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 80. PRB-QL-808 — PRB-CP-009 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-808`
- **Parameter fingerprint:** `cdf20e456c2de41d6c2de41dcdf20e45`
- **Mathematical fingerprint:** `7d8f3e85bd25f7ddbd25f7dd7d8f3e85`

### English source authority

In a group of 88 students, 24 students passed Mathematics, 30 students passed English, and 11 students meet both conditions. What is the probability that a randomly selected student meets exactly one condition?

### Native question to review

88 ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 24 ਗਣਿਤ ਵਿੱਚ ਪਾਸ ਹਨ, 30 ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ 11 ਦੋਵਾਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਠੀਕ ਇੱਕ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{43}{88}\)
- **B.** \(\frac{3}{11}\)
- **C.** \(\frac{4}{11}\)
- **D.** \(\frac{5}{11}\)
- **E.** \(\frac{7}{11}\)

**Correct answer:** C. \(\frac{4}{11}\)

**English-runtime answer value:** \(\frac{4}{11}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(32/88=4/11\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{4}{11}\)

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — For exactly one condition, remove the overlap once from each group.
3. Step 2 — Required people = 24 + 30 - 2 \(\times\) 11 = 32.
4. Step 3 — The required probability is \(\frac{32}{88}\) = \(\frac{4}{11}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{4}{11}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਮਿਸ਼ਰਤ ਘਟਨਾ ਪ੍ਰਗਟਾਵਾ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 81. PRB-QL-809 — PRB-CP-009 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-809`
- **Parameter fingerprint:** `270745fa66b8ec8666b8ec86270745fa`
- **Mathematical fingerprint:** `937b259bfcb28ec3fcb28ec3937b259b`

### English source authority

In a group of 69 candidates, 31 candidates qualified in Quantitative Aptitude, 35 candidates qualified in Reasoning, and 8 candidates meet both conditions. What is the probability that a randomly selected candidate meets at least one condition?

### Native question to review

69 ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 31 ਕੁਆਂਟੀਟੇਟਿਵ ਐਪਟੀਟਿਊਡ ਵਿੱਚ ਪਾਸ ਹਨ, 35 ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ 8 ਦੋਵਾਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{58}{69}\)
- **B.** \(\frac{59}{69}\)
- **C.** \(\frac{19}{23}\)
- **D.** \(\frac{11}{69}\)
- **E.** \(\frac{22}{23}\)

**Correct answer:** A. \(\frac{58}{69}\)

**English-runtime answer value:** \(\frac{58}{69}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(58/69=58/69\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{58}{69}\)

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — Use n(A \(\cup\) B) = n(A) + n(B) - n(A \(\cap\) B), because the 8 people in both groups would otherwise be counted twice.
3. Step 2 — Required people = 31 + 35 - 8 = 58.
4. Step 3 — The required probability is \(\frac{58}{69}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{58}{69}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਘਟਨਾਵਾਂ ਦਾ ਸੰਘ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 82. PRB-QL-810 — PRB-CP-009 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-810`
- **Parameter fingerprint:** `28f3d9c227d402be27d402be28f3d9c2`
- **Mathematical fingerprint:** `c3e6021094b37b3494b37b34c3e60210`

### English source authority

In a group of 77 students, 6 students play both games. What is the probability that a randomly selected student meets both conditions?

### Native question to review

77 ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 6 ਵਿਦਿਆਰਥੀ ਕ੍ਰਿਕਟ ਅਤੇ ਫੁੱਟਬਾਲ ਦੋਵੇਂ ਖੇਡਦੇ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਦੋਵੇਂ ਖੇਡ ਖੇਡਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{6}{77}\)
- **B.** \(\frac{5}{77}\)
- **C.** \(\frac{1}{11}\)
- **D.** \(\frac{1}{13}\)
- **E.** \(\frac{71}{77}\)

**Correct answer:** A. \(\frac{6}{77}\)

**English-runtime answer value:** \(\frac{6}{77}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(6/77=6/77\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{6}{77}\)

### English explanation authority

1. Method — The required event is the overlap of the two groups; compare that overlap with the complete group.
2. Step 1 — The intersection means the people who satisfy both cricket and football.
3. Step 2 — The question gives this overlap directly as 6 out of 77.
4. Step 3 — The required probability is \(\frac{6}{77}\).
5. Answer — The required probability is \(\frac{6}{77}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਘਟਨਾਵਾਂ ਦਾ ਪ੍ਰਤੀਛੇਦ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 83. PRB-QL-811 — PRB-CP-009 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-811`
- **Parameter fingerprint:** `e6ff7c34ea0521b8ea0521b8e6ff7c34`
- **Mathematical fingerprint:** `edad15859fd926dd9fd926ddedad1585`

### English source authority

In a group of 96 candidates, 34 candidates cleared Section A, 22 candidates cleared Section B, and 4 candidates meet both conditions. What is the probability that a randomly selected candidate meets exactly one condition?

### Native question to review

96 ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 34 ਸੈਕਸ਼ਨ A ਵਿੱਚ ਪਾਸ ਹਨ, 22 ਸੈਕਸ਼ਨ B ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ 4 ਦੋਵਾਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਠੀਕ ਇੱਕ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** 1
- **B.** \(\frac{1}{2}\)
- **C.** 0
- **D.** \(\frac{13}{24}\)
- **E.** \(\frac{7}{12}\)

**Correct answer:** B. \(\frac{1}{2}\)

**English-runtime answer value:** \(\frac{1}{2}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(48/96=1/2\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{2}\)

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — For exactly one condition, remove the overlap once from each group.
3. Step 2 — Required people = 34 + 22 - 2 \(\times\) 4 = 48.
4. Step 3 — The required probability is \(\frac{48}{96}\) = \(\frac{1}{2}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{1}{2}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਦੋ ਘਟਨਾਵਾਂ ਵਿੱਚ ਠੀਕ ਇੱਕ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 84. PRB-QL-812 — PRB-CP-009 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-812`
- **Parameter fingerprint:** `a79038cf63364db763364db7a79038cf`
- **Mathematical fingerprint:** `9d9e7cf9bafb8601bafb86019d9e7cf9`

### English source authority

In a group of 57 students, 23 students passed Mathematics, 30 students passed English, and 3 students meet both conditions. What is the probability that a randomly selected student meets neither condition?

### Native question to review

57 ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 23 ਗਣਿਤ ਵਿੱਚ ਪਾਸ ਹਨ, 30 ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ 3 ਦੋਵਾਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਕਿਸੇ ਵੀ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{8}{57}\)
- **B.** \(\frac{53}{57}\)
- **C.** \(\frac{7}{57}\)
- **D.** \(\frac{2}{19}\)
- **E.** \(\frac{50}{57}\)

**Correct answer:** C. \(\frac{7}{57}\)

**English-runtime answer value:** \(\frac{7}{57}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(7/57=7/57\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{7}{57}\)

### English explanation authority

1. Method — Use inclusion–exclusion to find those in at least one group, then subtract that count from the total.
2. Step 1 — First find those satisfying at least one condition: 23 + 30 - 3 = 50.
3. Step 2 — People satisfying neither condition = 57 - 50 = 7.
4. Step 3 — The required probability is \(\frac{7}{57}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{7}{57}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਨਾ A ਨਾ B ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 85. PRB-QL-813 — PRB-CP-009 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-813`
- **Parameter fingerprint:** `b1feae795106d3815106d381b1feae79`
- **Mathematical fingerprint:** `155d2185e4c612dde4c612dd155d2185`

### English source authority

A candidate can receive either Scholarship A or Scholarship B, but not both. If \(P\!\left(A\right)\) = \(\frac{1}{10}\) and \(P\!\left(B\right)\) = \(\frac{1}{10}\), what is the probability that the candidate receives a scholarship?

### Native question to review

ਇੱਕ ਉਮੀਦਵਾਰ ਨੂੰ ਸਕਾਲਰਸ਼ਿਪ A ਜਾਂ ਸਕਾਲਰਸ਼ਿਪ B ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਮਿਲ ਸਕਦੀ ਹੈ, ਦੋਵੇਂ ਨਹੀਂ। ਜੇ \(P\!\left(A\right)\) = \(\frac{1}{10}\) ਅਤੇ \(P\!\left(B\right)\) = \(\frac{1}{10}\) ਹੈ, ਤਾਂ ਉਮੀਦਵਾਰ ਨੂੰ ਕੋਈ ਸਕਾਲਰਸ਼ਿਪ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{6}\)
- **B.** \(\frac{2}{5}\)
- **C.** \(\frac{1}{5}\)
- **D.** 0
- **E.** \(\frac{4}{5}\)

**Correct answer:** C. \(\frac{1}{5}\)

**English-runtime answer value:** \(\frac{1}{5}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(\frac{1}{10}+\frac{1}{10}=\frac{1}{5}\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{5}\)

### English explanation authority

1. Method — The events are mutually exclusive, so add their probabilities; there is no overlap to subtract.
2. Step 1 — The two events are mutually exclusive, so they cannot happen together and there is no overlap to subtract.
3. Step 2 — \(P\!\left(A or B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) = \(\frac{1}{10}\) + \(\frac{1}{10}\).
4. Step 3 — The required probability is \(\frac{1}{5}\).
5. Answer — The required probability is \(\frac{1}{5}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 86. PRB-QL-814 — PRB-CP-009 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-814`
- **Parameter fingerprint:** `090726b6d364f372d364f372090726b6`
- **Mathematical fingerprint:** `8b4958084f812fbc4f812fbc8b495808`

### English source authority

The probabilities that a candidate clears Section A and Section B are \(\frac{5}{9}\) and \(\frac{3}{5}\), respectively. The results are independent. What is the probability that the candidate clears both sections?

### Native question to review

ਕਿਸੇ ਉਮੀਦਵਾਰ ਦੇ ਸੈਕਸ਼ਨ A ਅਤੇ ਸੈਕਸ਼ਨ B ਪਾਸ ਕਰਨ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਕ੍ਰਮਵਾਰ \(\frac{5}{9}\) ਅਤੇ \(\frac{3}{5}\) ਹਨ। ਦੋਵੇਂ ਨਤੀਜੇ ਸੁਤੰਤਰ ਹਨ। ਉਮੀਦਵਾਰ ਦੇ ਦੋਵੇਂ ਸੈਕਸ਼ਨ ਪਾਸ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{1}{2}\)
- **B.** \(\frac{1}{3}\)
- **C.** \(\frac{2}{3}\)
- **D.** \(\frac{1}{4}\)
- **E.** 0

**Correct answer:** B. \(\frac{1}{3}\)

**English-runtime answer value:** \(\frac{1}{3}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(\frac{5}{9}\times\frac{3}{5}=\frac{1}{3}\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{3}\)

### English explanation authority

1. Method — The events are independent, so multiply their probabilities to obtain the probability that both occur.
2. Step 1 — The two results are independent, so the outcome of one does not change the probability of the other.
3. Step 2 — \(P\!\left(both\right)\) = \(P\!\left(A\right)\) \(\times\) \(P\!\left(B\right)\) = \(\frac{5}{9}\) \(\times\) \(\frac{3}{5}\).
4. Step 3 — The required probability is \(\frac{1}{3}\).
5. Answer — The required probability is \(\frac{1}{3}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 87. PRB-QL-815 — PRB-CP-009 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-815`
- **Parameter fingerprint:** `b6368b9e4c33a3ca4c33a3cab6368b9e`
- **Mathematical fingerprint:** `70b09a01fa64cc39fa64cc3970b09a01`

### English source authority

For a group of 62 candidates, \(P\!\left(Section A\right)\) = \(\frac{29}{62}\), \(P\!\left(Section B\right)\) = \(\frac{9}{31}\), and \(P\!\left(Section A or Section B\right)\) = \(\frac{41}{62}\). Find \(P\!\left(Section A and Section B\right)\).

### Native question to review

62 ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ ਸਮੂਹ ਲਈ \(P\!\left(ਸੈਕਸ਼ਨ A\right)\) = \(\frac{29}{62}\), \(P\!\left(ਸੈਕਸ਼ਨ B\right)\) = \(\frac{9}{31}\) ਅਤੇ \(P\!\left(ਸੈਕਸ਼ਨ A ਜਾਂ ਸੈਕਸ਼ਨ B\right)\) = \(\frac{41}{62}\) ਹੈ। \(P\!\left(ਸੈਕਸ਼ਨ A ਅਤੇ ਸੈਕਸ਼ਨ B\right)\) ਕੱਢੋ।

### Options

- **A.** \(\frac{4}{31}\)
- **B.** \(\frac{3}{32}\)
- **C.** \(\frac{3}{31}\)
- **D.** \(\frac{28}{31}\)
- **E.** \(\frac{2}{31}\)

**Correct answer:** C. \(\frac{3}{31}\)

**English-runtime answer value:** \(\frac{3}{31}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(6/62=3/31\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{3}{31}\)

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — Apply \(P\!\left(A \cup B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) - \(P\!\left(A \cap B\right)\).
3. Step 2 — In counts, the overlap is 29 + 18 - 41 = 6.
4. Step 3 — The required probability is \(\frac{6}{62}\) = \(\frac{3}{31}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{3}{31}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਅਣਜਾਣ ਪ੍ਰਤੀਛੇਦ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 88. PRB-QL-816 — PRB-CP-009 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-816`
- **Parameter fingerprint:** `e4ceab523f44132e3f44132ee4ceab52`
- **Mathematical fingerprint:** `b6fcdcdbccbc0183ccbc0183b6fcdcdb`

### English source authority

In a group of 67 students, 19 students passed Mathematics, 34 students passed English, and 7 students meet both conditions. What is the probability that a randomly selected student meets exactly one condition?

### Native question to review

67 ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 19 ਗਣਿਤ ਵਿੱਚ ਪਾਸ ਹਨ, 34 ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ 7 ਦੋਵਾਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਠੀਕ ਇੱਕ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{46}{67}\)
- **B.** \(\frac{38}{67}\)
- **C.** \(\frac{40}{67}\)
- **D.** \(\frac{39}{67}\)
- **E.** \(\frac{28}{67}\)

**Correct answer:** D. \(\frac{39}{67}\)

**English-runtime answer value:** \(\frac{39}{67}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(39/67=39/67\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{39}{67}\)

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — For exactly one condition, remove the overlap once from each group.
3. Step 2 — Required people = 19 + 34 - 2 \(\times\) 7 = 39.
4. Step 3 — The required probability is \(\frac{39}{67}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{39}{67}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਮਿਸ਼ਰਤ ਘਟਨਾ ਪ੍ਰਗਟਾਵਾ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 89. PRB-QL-817 — PRB-CP-009 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-817`
- **Parameter fingerprint:** `d4a607dce9a96d50e9a96d50d4a607dc`
- **Mathematical fingerprint:** `8b8c4bb2419a650e419a650e8b8c4bb2`

### English source authority

In a group of 73 candidates, 22 candidates qualified in Quantitative Aptitude, 28 candidates qualified in Reasoning, and 2 candidates meet both conditions. What is the probability that a randomly selected candidate meets at least one condition?

### Native question to review

73 ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 22 ਕੁਆਂਟੀਟੇਟਿਵ ਐਪਟੀਟਿਊਡ ਵਿੱਚ ਪਾਸ ਹਨ, 28 ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ 2 ਦੋਵਾਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{25}{73}\)
- **B.** \(\frac{48}{73}\)
- **C.** \(\frac{50}{73}\)
- **D.** \(\frac{49}{73}\)
- **E.** \(\frac{47}{73}\)

**Correct answer:** B. \(\frac{48}{73}\)

**English-runtime answer value:** \(\frac{48}{73}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(48/73=48/73\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{48}{73}\)

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — Use n(A \(\cup\) B) = n(A) + n(B) - n(A \(\cap\) B), because the 2 people in both groups would otherwise be counted twice.
3. Step 2 — Required people = 22 + 28 - 2 = 48.
4. Step 3 — The required probability is \(\frac{48}{73}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{48}{73}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਘਟਨਾਵਾਂ ਦਾ ਸੰਘ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 90. PRB-QL-818 — PRB-CP-009 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-818`
- **Parameter fingerprint:** `dc308cf4fe9fb6f8fe9fb6f8dc308cf4`
- **Mathematical fingerprint:** `de4b80aec365b0bac365b0bade4b80ae`

### English source authority

In a group of 57 students, 4 students play both games. What is the probability that a randomly selected student meets both conditions?

### Native question to review

57 ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 4 ਵਿਦਿਆਰਥੀ ਕ੍ਰਿਕਟ ਅਤੇ ਫੁੱਟਬਾਲ ਦੋਵੇਂ ਖੇਡਦੇ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਦੋਵੇਂ ਖੇਡ ਖੇਡਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{53}{57}\)
- **B.** \(\frac{2}{29}\)
- **C.** \(\frac{5}{57}\)
- **D.** \(\frac{1}{19}\)
- **E.** \(\frac{4}{57}\)

**Correct answer:** E. \(\frac{4}{57}\)

**English-runtime answer value:** \(\frac{4}{57}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(4/57=4/57\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{4}{57}\)

### English explanation authority

1. Method — The required event is the overlap of the two groups; compare that overlap with the complete group.
2. Step 1 — The intersection means the people who satisfy both cricket and football.
3. Step 2 — The question gives this overlap directly as 4 out of 57.
4. Step 3 — The required probability is \(\frac{4}{57}\).
5. Answer — The required probability is \(\frac{4}{57}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਘਟਨਾਵਾਂ ਦਾ ਪ੍ਰਤੀਛੇਦ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 91. PRB-QL-819 — PRB-CP-009 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-819`
- **Parameter fingerprint:** `419848869596d9229596d92241984886`
- **Mathematical fingerprint:** `5c987ba42eb02f082eb02f085c987ba4`

### English source authority

In a group of 52 candidates, 20 candidates cleared Section A, 27 candidates cleared Section B, and 11 candidates meet both conditions. What is the probability that a randomly selected candidate meets exactly one condition?

### Native question to review

52 ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 20 ਸੈਕਸ਼ਨ A ਵਿੱਚ ਪਾਸ ਹਨ, 27 ਸੈਕਸ਼ਨ B ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ 11 ਦੋਵਾਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਠੀਕ ਇੱਕ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{47}{52}\)
- **B.** \(\frac{25}{52}\)
- **C.** \(\frac{9}{13}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{27}{52}\)

**Correct answer:** B. \(\frac{25}{52}\)

**English-runtime answer value:** \(\frac{25}{52}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(25/52=25/52\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{25}{52}\)

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — For exactly one condition, remove the overlap once from each group.
3. Step 2 — Required people = 20 + 27 - 2 \(\times\) 11 = 25.
4. Step 3 — The required probability is \(\frac{25}{52}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{25}{52}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਦੋ ਘਟਨਾਵਾਂ ਵਿੱਚ ਠੀਕ ਇੱਕ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 92. PRB-QL-820 — PRB-CP-009 — Medium

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-820`
- **Parameter fingerprint:** `5f827736b155f7f2b155f7f25f827736`
- **Mathematical fingerprint:** `5f6991051002ce5d1002ce5d5f699105`

### English source authority

In a group of 59 students, 37 students passed Mathematics, 21 students passed English, and 2 students meet both conditions. What is the probability that a randomly selected student meets neither condition?

### Native question to review

59 ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 37 ਗਣਿਤ ਵਿੱਚ ਪਾਸ ਹਨ, 21 ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ 2 ਦੋਵਾਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਕਿਸੇ ਵੀ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{58}{59}\)
- **B.** \(\frac{3}{59}\)
- **C.** \(\frac{56}{59}\)
- **D.** \(\frac{2}{59}\)
- **E.** \(\frac{4}{59}\)

**Correct answer:** B. \(\frac{3}{59}\)

**English-runtime answer value:** \(\frac{3}{59}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(3/59=3/59\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{3}{59}\)

### English explanation authority

1. Method — Use inclusion–exclusion to find those in at least one group, then subtract that count from the total.
2. Step 1 — First find those satisfying at least one condition: 37 + 21 - 2 = 56.
3. Step 2 — People satisfying neither condition = 59 - 56 = 3.
4. Step 3 — The required probability is \(\frac{3}{59}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{3}{59}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਨਾ A ਨਾ B ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 93. PRB-QL-821 — PRB-CP-009 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-821`
- **Parameter fingerprint:** `86566790b02c1cb4b02c1cb486566790`
- **Mathematical fingerprint:** `6ce294775835b4cf5835b4cf6ce29477`

### English source authority

A candidate can receive either Scholarship A or Scholarship B, but not both. If \(P\!\left(A\right)\) = \(\frac{3}{10}\) and \(P\!\left(B\right)\) = \(\frac{1}{5}\), what is the probability that the candidate receives a scholarship?

### Native question to review

ਇੱਕ ਉਮੀਦਵਾਰ ਨੂੰ ਸਕਾਲਰਸ਼ਿਪ A ਜਾਂ ਸਕਾਲਰਸ਼ਿਪ B ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਮਿਲ ਸਕਦੀ ਹੈ, ਦੋਵੇਂ ਨਹੀਂ। ਜੇ \(P\!\left(A\right)\) = \(\frac{3}{10}\) ਅਤੇ \(P\!\left(B\right)\) = \(\frac{1}{5}\) ਹੈ, ਤਾਂ ਉਮੀਦਵਾਰ ਨੂੰ ਕੋਈ ਸਕਾਲਰਸ਼ਿਪ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{3}{4}\)
- **B.** 1
- **C.** \(\frac{1}{2}\)
- **D.** \(\frac{1}{3}\)
- **E.** 0

**Correct answer:** C. \(\frac{1}{2}\)

**English-runtime answer value:** \(\frac{1}{2}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(\frac{3}{10}+\frac{1}{5}=\frac{1}{2}\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{2}\)

### English explanation authority

1. Method — The events are mutually exclusive, so add their probabilities; there is no overlap to subtract.
2. Step 1 — The two events are mutually exclusive, so they cannot happen together and there is no overlap to subtract.
3. Step 2 — \(P\!\left(A or B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) = \(\frac{3}{10}\) + \(\frac{1}{5}\).
4. Step 3 — The required probability is \(\frac{1}{2}\).
5. Answer — The required probability is \(\frac{1}{2}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 94. PRB-QL-822 — PRB-CP-009 — Easy

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-822`
- **Parameter fingerprint:** `92b8884193b0cdf993b0cdf992b88841`
- **Mathematical fingerprint:** `c1e93352a3f5db2ea3f5db2ec1e93352`

### English source authority

The probabilities that a candidate clears Section A and Section B are \(\frac{1}{3}\) and \(\frac{1}{9}\), respectively. The results are independent. What is the probability that the candidate clears both sections?

### Native question to review

ਕਿਸੇ ਉਮੀਦਵਾਰ ਦੇ ਸੈਕਸ਼ਨ A ਅਤੇ ਸੈਕਸ਼ਨ B ਪਾਸ ਕਰਨ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਕ੍ਰਮਵਾਰ \(\frac{1}{3}\) ਅਤੇ \(\frac{1}{9}\) ਹਨ। ਦੋਵੇਂ ਨਤੀਜੇ ਸੁਤੰਤਰ ਹਨ। ਉਮੀਦਵਾਰ ਦੇ ਦੋਵੇਂ ਸੈਕਸ਼ਨ ਪਾਸ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{4}{9}\)
- **B.** 0
- **C.** \(\frac{26}{27}\)
- **D.** \(\frac{1}{27}\)
- **E.** \(\frac{2}{27}\)

**Correct answer:** D. \(\frac{1}{27}\)

**English-runtime answer value:** \(\frac{1}{27}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(\frac{1}{3}\times\frac{1}{9}=\frac{1}{27}\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{27}\)

### English explanation authority

1. Method — The events are independent, so multiply their probabilities to obtain the probability that both occur.
2. Step 1 — The two results are independent, so the outcome of one does not change the probability of the other.
3. Step 2 — \(P\!\left(both\right)\) = \(P\!\left(A\right)\) \(\times\) \(P\!\left(B\right)\) = \(\frac{1}{3}\) \(\times\) \(\frac{1}{9}\).
4. Step 3 — The required probability is \(\frac{1}{27}\).
5. Answer — The required probability is \(\frac{1}{27}\).

**Native visuals:** None

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 95. PRB-QL-823 — PRB-CP-009 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-823`
- **Parameter fingerprint:** `2a8200f2f74172cef74172ce2a8200f2`
- **Mathematical fingerprint:** `9f82b13c9902dd309902dd309f82b13c`

### English source authority

For a group of 55 candidates, \(P\!\left(Section A\right)\) = \(\frac{38}{55}\), \(P\!\left(Section B\right)\) = \(\frac{4}{11}\), and \(P\!\left(Section A or Section B\right)\) = \(\frac{53}{55}\). Find \(P\!\left(Section A and Section B\right)\).

### Native question to review

55 ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੱਕ ਸਮੂਹ ਲਈ \(P\!\left(ਸੈਕਸ਼ਨ A\right)\) = \(\frac{38}{55}\), \(P\!\left(ਸੈਕਸ਼ਨ B\right)\) = \(\frac{4}{11}\) ਅਤੇ \(P\!\left(ਸੈਕਸ਼ਨ A ਜਾਂ ਸੈਕਸ਼ਨ B\right)\) = \(\frac{53}{55}\) ਹੈ। \(P\!\left(ਸੈਕਸ਼ਨ A ਅਤੇ ਸੈਕਸ਼ਨ B\right)\) ਕੱਢੋ।

### Options

- **A.** \(\frac{1}{11}\)
- **B.** \(\frac{2}{11}\)
- **C.** 0
- **D.** \(\frac{1}{12}\)
- **E.** \(\frac{10}{11}\)

**Correct answer:** A. \(\frac{1}{11}\)

**English-runtime answer value:** \(\frac{1}{11}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(5/55=1/11\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{1}{11}\)

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — Apply \(P\!\left(A \cup B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) - \(P\!\left(A \cap B\right)\).
3. Step 2 — In counts, the overlap is 38 + 20 - 53 = 5.
4. Step 3 — The required probability is \(\frac{5}{55}\) = \(\frac{1}{11}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{1}{11}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਅਣਜਾਣ ਪ੍ਰਤੀਛੇਦ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---

## 96. PRB-QL-824 — PRB-CP-009 — Hard

- **Package:** PRB-002
- **Exam profile:** BANKING_MAINS
- **Deterministic review seed:** `ml06-human-review:PRB-QL-824`
- **Parameter fingerprint:** `eb7c2704a11c3868a11c3868eb7c2704`
- **Mathematical fingerprint:** `51befeea0c650f560c650f5651befeea`

### English source authority

In a group of 66 students, 31 students passed Mathematics, 28 students passed English, and 1 student meets both conditions. What is the probability that a randomly selected student meets exactly one condition?

### Native question to review

66 ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ 31 ਗਣਿਤ ਵਿੱਚ ਪਾਸ ਹਨ, 28 ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ 1 ਦੋਵਾਂ ਵਿੱਚ ਪਾਸ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਠੀਕ ਇੱਕ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?

### Options

- **A.** \(\frac{19}{23}\)
- **B.** \(\frac{9}{11}\)
- **C.** \(\frac{3}{22}\)
- **D.** \(\frac{10}{11}\)
- **E.** \(\frac{19}{22}\)

**Correct answer:** E. \(\frac{19}{22}\)

**English-runtime answer value:** \(\frac{19}{22}\)

### Native explanation to review

1. ਵਿਧੀ: A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।
2. ਗਣਨਾ: \(P\!\left(A\cupB\right)\)=\(P\!\left(A\right)\)+\(P\!\left(B\right)\)-\(P\!\left(A\capB\right)\) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।
3. ਗਣਨਾ: \(57/66=19/22\)
4. ਮੁੱਖ ਬਿੰਦੂ: 'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।
5. ਅੰਤਿਮ ਉੱਤਰ: \(\frac{19}{22}\)

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — For exactly one condition, remove the overlap once from each group.
3. Step 2 — Required people = 31 + 28 - 2 \(\times\) 1 = 57.
4. Step 3 — The required probability is \(\frac{57}{66}\) = \(\frac{19}{22}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{19}{22}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ
  - Alt: ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ਮਿਸ਼ਰਤ ਘਟਨਾ ਪ੍ਰਗਟਾਵਾ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Punjabi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Punjabi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---
