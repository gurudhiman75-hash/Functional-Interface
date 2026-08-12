# PRB-002 — Hindi Native Question Review

> ExamTree Probability ML-06 human-review file. Contains all 96 rendered Hindi QLs for PRB-002.
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

एक जार में 8 लाल और 6 नीले कंचे हैं। एक कंचा चुनकर वापस रख दिया जाता है, फिर दूसरा कंचा चुना जाता है। दोनों चुने गए कंचों के लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{16}{49}\)
- **B.** \(\frac{17}{49}\)
- **C.** \(\frac{33}{49}\)
- **D.** \(\frac{8}{25}\)
- **E.** \(\frac{15}{49}\)

**Correct answer:** A. \(\frac{16}{49}\)

**English-runtime answer value:** \(\frac{16}{49}\)

### Native explanation to review

1. विधि — दोनों चयनों को क्रम से देखें। वस्तु वापस रखने पर मूल संरचना फिर से बन जाती है, इसलिए दूसरे चयन में भी वही हर रहता है।
2. चरण 1 — पहला कंचा वापस रख दिया जाता है, इसलिए दूसरे चयन से पहले उसी पात्र में फिर 8 लाल और 6 नीले कंचे होते हैं।
3. चरण 2 — इस प्रकार, \(P\!\left(red marble on each selection\right)\) = \(\frac{8}{14}\)।
4. चरण 3 — \(P\!\left(both red marbles\right)\) = \(\frac{8}{14}\) \(\times\) \(\frac{8}{14}\) = \(\frac{16}{49}\)।
5. मुख्य बिंदु — वस्तु वापस रखने के कारण दोनों चरणों में प्रायिकता मूल संरचना के आधार पर ही निकाली जाती है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{16}{49}\) है।

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — The first marble is replaced, so the container again has 8 red and 6 blue marbles before the second selection.
3. Step 2 — Thus, \(P\!\left(red marble on each selection\right)\) = \(\frac{8}{14}\).
4. Step 3 — \(P\!\left(both red marbles\right)\) = \(\frac{8}{14}\) \(\times\) \(\frac{8}{14}\) = \(\frac{16}{49}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{16}{49}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; हर चयन के बाद वस्तु वापस रखी जाती है।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बॉक्स में 7 लाल और 8 नीले पेन हैं। दो पेन एक के बाद एक बिना वापस रखे चुने जाते हैं। दोनों चुने गए पेन के लाल होने की प्रायिकता क्या है?

### Options

- **A.** 0
- **B.** \(\frac{2}{5}\)
- **C.** \(\frac{4}{5}\)
- **D.** \(\frac{49}{225}\)
- **E.** \(\frac{1}{5}\)

**Correct answer:** E. \(\frac{1}{5}\)

**English-runtime answer value:** \(\frac{1}{5}\)

### Native explanation to review

1. विधि — चयनों को क्रम से लें और दोनों चरणों की प्रायिकताओं को गुणा करें। बिना वापस रखे चयन में दूसरे चयन से पहले अनुकूल वस्तुओं की बची संख्या और कुल संख्या दोनों बदलें।
2. चरण 1 — पहले चयन में \(P\!\left(red pen\right)\) = \(\frac{7}{15}\)।
3. चरण 2 — एक लाल पेन निकालने के बाद कुल 14 पेनों में 6 लाल पेन बचते हैं।
4. चरण 3 — \(P\!\left(both red pens\right)\) = \(\frac{7}{15}\) \(\times\) \(\frac{6}{14}\) = \(\frac{1}{5}\)।
5. मुख्य बिंदु — पहली वस्तु वापस नहीं रखी जाती, इसलिए दूसरी प्रायिकता एक वस्तु कम होने के बाद की कुल संख्या पर आधारित है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{1}{5}\) है।

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — On the first selection, \(P\!\left(red pen\right)\) = \(\frac{7}{15}\).
3. Step 2 — After one red pen is removed, 6 red pens remain among 14 pens.
4. Step 3 — \(P\!\left(both red pens\right)\) = \(\frac{7}{15}\) \(\times\) \(\frac{6}{14}\) = \(\frac{1}{5}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{1}{5}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक पाउच में 6 लाल और 8 नीले रंगीन पत्थर हैं। एक रंगीन पत्थर निकालकर वापस रख दिया जाता है, फिर दूसरा रंगीन पत्थर निकाला जाता है। दोनों चुने गए रंगीन पत्थरों के लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{8}{49}\)
- **B.** \(\frac{9}{50}\)
- **C.** \(\frac{10}{49}\)
- **D.** \(\frac{40}{49}\)
- **E.** \(\frac{9}{49}\)

**Correct answer:** E. \(\frac{9}{49}\)

**English-runtime answer value:** \(\frac{9}{49}\)

### Native explanation to review

1. विधि — दोनों चयनों को क्रम से देखें। वस्तु वापस रखने पर मूल संरचना फिर से बन जाती है, इसलिए दूसरे चयन में भी वही हर रहता है।
2. चरण 1 — पहला पत्थर वापस रख दिया जाता है, इसलिए दूसरे चयन से पहले उसी पात्र में फिर 6 लाल और 8 नीले रंगीन पत्थर होते हैं।
3. चरण 2 — इस प्रकार, \(P\!\left(red stone on each selection\right)\) = \(\frac{6}{14}\)।
4. चरण 3 — \(P\!\left(both red coloured stones\right)\) = \(\frac{6}{14}\) \(\times\) \(\frac{6}{14}\) = \(\frac{9}{49}\)।
5. मुख्य बिंदु — वस्तु वापस रखने के कारण दोनों चरणों में प्रायिकता मूल संरचना के आधार पर ही निकाली जाती है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{9}{49}\) है।

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — The first stone is replaced, so the container again has 6 red and 8 blue coloured stones before the second selection.
3. Step 2 — Thus, \(P\!\left(red stone on each selection\right)\) = \(\frac{6}{14}\).
4. Step 3 — \(P\!\left(both red coloured stones\right)\) = \(\frac{6}{14}\) \(\times\) \(\frac{6}{14}\) = \(\frac{9}{49}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{9}{49}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; हर चयन के बाद वस्तु वापस रखी जाती है।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बैग में 8 लाल और 7 नीली गेंदें हैं। दो गेंदें एक के बाद एक बिना वापस रखे निकाली जाती हैं। दोनों गेंदों के लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{11}{15}\)
- **C.** \(\frac{1}{5}\)
- **D.** \(\frac{64}{225}\)
- **E.** \(\frac{4}{15}\)

**Correct answer:** E. \(\frac{4}{15}\)

**English-runtime answer value:** \(\frac{4}{15}\)

### Native explanation to review

1. विधि — चयनों को क्रम से लें और दोनों चरणों की प्रायिकताओं को गुणा करें। बिना वापस रखे चयन में दूसरे चयन से पहले अनुकूल वस्तुओं की बची संख्या और कुल संख्या दोनों बदलें।
2. चरण 1 — पहले चयन में \(P\!\left(red ball\right)\) = \(\frac{8}{15}\)।
3. चरण 2 — एक लाल गेंद निकालने के बाद कुल 14 गेंदों में 7 लाल गेंदें बचते हैं।
4. चरण 3 — \(P\!\left(both red balls\right)\) = \(\frac{8}{15}\) \(\times\) \(\frac{7}{14}\) = \(\frac{4}{15}\)।
5. मुख्य बिंदु — पहली वस्तु वापस नहीं रखी जाती, इसलिए दूसरी प्रायिकता एक वस्तु कम होने के बाद की कुल संख्या पर आधारित है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{4}{15}\) है।

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — On the first selection, \(P\!\left(red ball\right)\) = \(\frac{8}{15}\).
3. Step 2 — After one red ball is removed, 7 red balls remain among 14 balls.
4. Step 3 — \(P\!\left(both red balls\right)\) = \(\frac{8}{15}\) \(\times\) \(\frac{7}{14}\) = \(\frac{4}{15}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{4}{15}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक जार में 7 लाल और 6 नीले कंचे हैं। दो कंचे एक के बाद एक बिना वापस रखे चुने जाते हैं। पहले लाल और फिर नीला कंचा मिलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{4}{13}\)
- **B.** \(\frac{19}{26}\)
- **C.** \(\frac{7}{26}\)
- **D.** \(\frac{7}{27}\)
- **E.** \(\frac{3}{13}\)

**Correct answer:** C. \(\frac{7}{26}\)

**English-runtime answer value:** \(\frac{7}{26}\)

### Native explanation to review

1. विधि — चयनों को क्रम से लें और दोनों चरणों की प्रायिकताओं को गुणा करें। बिना वापस रखे चयन में दूसरे चयन से पहले अनुकूल वस्तुओं की बची संख्या और कुल संख्या दोनों बदलें।
2. चरण 1 — क्रम निश्चित है: पहले लाल कंचा और फिर नीला कंचा आना चाहिए।
3. चरण 2 — \(P\!\left(red first\right)\) = \(\frac{7}{13}\); के बाद कि, \(P\!\left(blue second\right)\) = \(\frac{6}{12}\)।
4. चरण 3 — आवश्यक प्रायिकता = \(\frac{7}{13}\) \(\times\) \(\frac{6}{12}\) = \(\frac{7}{26}\)।
5. मुख्य बिंदु — पहली वस्तु वापस नहीं रखी जाती, इसलिए दूसरी प्रायिकता एक वस्तु कम होने के बाद की कुल संख्या पर आधारित है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{7}{26}\) है।

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — The order is fixed: a red marble must occur first and a blue marble second.
3. Step 2 — \(P\!\left(red first\right)\) = \(\frac{7}{13}\); after that, \(P\!\left(blue second\right)\) = \(\frac{6}{12}\).
4. Step 3 — Required probability = \(\frac{7}{13}\) \(\times\) \(\frac{6}{12}\) = \(\frac{7}{26}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{7}{26}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बॉक्स में 7 लाल और 9 नीले पेन हैं। दो पेन एक के बाद एक बिना वापस रखे चुने जाते हैं। दोनों पेन के एक ही रंग के होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{9}{20}\)
- **B.** \(\frac{21}{40}\)
- **C.** \(\frac{49}{256}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{19}{40}\)

**Correct answer:** E. \(\frac{19}{40}\)

**English-runtime answer value:** \(\frac{19}{40}\)

### Native explanation to review

1. विधि — पेन का रंग समान होने के दो परस्पर अपवर्ती क्रम हैं: लाल-लाल या नीला-नीला। दोनों की प्रायिकताएँ निकालकर जोड़ें।
2. चरण 1 — \(P\!\left(red-red\right)\) = \(\frac{7}{16}\) \(\times\) \(\frac{6}{15}\) = \(\frac{42}{240}\)।
3. चरण 2 — \(P\!\left(blue-blue\right)\) = \(\frac{9}{16}\) \(\times\) \(\frac{8}{15}\) = \(\frac{72}{240}\)।
4. चरण 3 — \(P\!\left(same colour\right)\) = \(\frac{42}{240}\) + \(\frac{72}{240}\) = \(\frac{114}{240}\)।
5. सरलीकरण — अंश और हर दोनों को 6 से भाग दें: (114 \(\div\) 6)/(240 \(\div\) 6) = \(\frac{19}{40}\)।
6. मुख्य बिंदु — लाल-लाल और नीला-नीला एक साथ नहीं हो सकते, इसलिए उनकी प्रायिकताएँ जोड़ी जाती हैं।
7. उत्तर — आवश्यक प्रायिकता \(\frac{19}{40}\) है।

### English explanation authority

1. Method — The pens can have the same colour in two mutually exclusive orders: red-red or blue-blue. Calculate both probabilities and add them.
2. Step 1 — \(P\!\left(red-red\right)\) = \(\frac{7}{16}\) \(\times\) \(\frac{6}{15}\) = \(\frac{42}{240}\).
3. Step 2 — \(P\!\left(blue-blue\right)\) = \(\frac{9}{16}\) \(\times\) \(\frac{8}{15}\) = \(\frac{72}{240}\).
4. Step 3 — \(P\!\left(same colour\right)\) = \(\frac{42}{240}\) + \(\frac{72}{240}\) = \(\frac{114}{240}\).
5. Simplification — Divide the numerator and denominator by 6: (114 \(\div\) 6)/(240 \(\div\) 6) = \(\frac{19}{40}\).
6. Key point — Red-red and blue-blue cannot occur together, so their probabilities are added.
7. Answer — The required probability is \(\frac{19}{40}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक पाउच में 5 लाल और 9 नीले रंगीन पत्थर हैं। दो रंगीन पत्थर एक के बाद एक बिना वापस रखे निकाले जाते हैं। दोनों रंगीन पत्थरों के अलग-अलग रंग के होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{45}{182}\)
- **B.** \(\frac{25}{196}\)
- **C.** \(\frac{45}{91}\)
- **D.** \(\frac{46}{91}\)
- **E.** \(\frac{44}{91}\)

**Correct answer:** C. \(\frac{45}{91}\)

**English-runtime answer value:** \(\frac{45}{91}\)

### Native explanation to review

1. विधि — रंगीन पत्थर के अलग रंग आने के दो परस्पर अपवर्ती क्रम हैं: लाल-नीला या नीला-लाल। दोनों प्रायिकताएँ निकालकर जोड़ें।
2. चरण 1 — \(P\!\left(red-blue\right)\) = \(\frac{5}{14}\) \(\times\) \(\frac{9}{13}\) = \(\frac{45}{182}\)।
3. चरण 2 — \(P\!\left(blue-red\right)\) = \(\frac{9}{14}\) \(\times\) \(\frac{5}{13}\) = \(\frac{45}{182}\)।
4. चरण 3 — \(P\!\left(different colours\right)\) = \(\frac{45}{182}\) + \(\frac{45}{182}\) = \(\frac{90}{182}\)।
5. सरलीकरण — अंश और हर दोनों को 2 से भाग दें: (90 \(\div\) 2)/(182 \(\div\) 2) = \(\frac{45}{91}\)।
6. मुख्य बिंदु — चयन क्रमिक हैं, इसलिए रंगों के दोनों संभावित क्रम शामिल करने होंगे।
7. उत्तर — आवश्यक प्रायिकता \(\frac{45}{91}\) है।

### English explanation authority

1. Method — Different colours can occur in two mutually exclusive orders for the coloured stones: red-blue or blue-red. Calculate both and add them.
2. Step 1 — \(P\!\left(red-blue\right)\) = \(\frac{5}{14}\) \(\times\) \(\frac{9}{13}\) = \(\frac{45}{182}\).
3. Step 2 — \(P\!\left(blue-red\right)\) = \(\frac{9}{14}\) \(\times\) \(\frac{5}{13}\) = \(\frac{45}{182}\).
4. Step 3 — \(P\!\left(different colours\right)\) = \(\frac{45}{182}\) + \(\frac{45}{182}\) = \(\frac{90}{182}\).
5. Simplification — Divide the numerator and denominator by 2: (90 \(\div\) 2)/(182 \(\div\) 2) = \(\frac{45}{91}\).
6. Key point — Both possible colour orders must be included because the draws are successive.
7. Answer — The required probability is \(\frac{45}{91}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बैग में 7 लाल और 9 नीली गेंदें हैं। दो बार चयन किया जाता है और हर बार वस्तु वापस रख दी जाती है। कम-से-कम एक लाल गेंद निकलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{87}{128}\)
- **B.** \(\frac{81}{256}\)
- **C.** \(\frac{175}{257}\)
- **D.** \(\frac{11}{16}\)
- **E.** \(\frac{175}{256}\)

**Correct answer:** E. \(\frac{175}{256}\)

**English-runtime answer value:** \(\frac{175}{256}\)

### Native explanation to review

1. विधि — दोनों चयनों को क्रम से देखें। वस्तु वापस रखने पर मूल संरचना फिर से बन जाती है, इसलिए दूसरे चयन में भी वही हर रहता है।
2. चरण 1 — पूरक घटना लें: कम-से-कम एक लाल गेंद न मिलने की एकमात्र स्थिति दोनों गेंदों का नीला होना है।
3. चरण 2 — वापस रखना बनाए रखता है \(P\!\left(blue ball\right)\) = \(\frac{9}{16}\) पर दोनों चयन।
4. चरण 3 — \(P\!\left(at least one red ball\right)\) = 1 - (\(\frac{9}{16}\) \(\times\) \(\frac{9}{16}\)) = \(\frac{175}{256}\)।
5. मुख्य बिंदु — वस्तु वापस रखने के कारण दोनों चरणों में प्रायिकता मूल संरचना के आधार पर ही निकाली जाती है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{175}{256}\) है।

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — Use the complement: at least one red ball fails only when both selected balls are blue.
3. Step 2 — Replacement keeps \(P\!\left(blue ball\right)\) = \(\frac{9}{16}\) on both selections.
4. Step 3 — \(P\!\left(at least one red ball\right)\) = 1 - (\(\frac{9}{16}\) \(\times\) \(\frac{9}{16}\)) = \(\frac{175}{256}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{175}{256}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; हर चयन के बाद वस्तु वापस रखी जाती है।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक जार में 8 लाल और 9 नीले कंचे हैं। एक कंचा चुनकर वापस रख दिया जाता है, फिर दूसरा कंचा चुना जाता है। दोनों चुने गए कंचों के लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{225}{289}\)
- **B.** \(\frac{32}{145}\)
- **C.** \(\frac{64}{289}\)
- **D.** \(\frac{65}{289}\)
- **E.** \(\frac{63}{289}\)

**Correct answer:** C. \(\frac{64}{289}\)

**English-runtime answer value:** \(\frac{64}{289}\)

### Native explanation to review

1. विधि — दोनों चयनों को क्रम से देखें। वस्तु वापस रखने पर मूल संरचना फिर से बन जाती है, इसलिए दूसरे चयन में भी वही हर रहता है।
2. चरण 1 — पहला कंचा वापस रख दिया जाता है, इसलिए दूसरे चयन से पहले उसी पात्र में फिर 8 लाल और 9 नीले कंचे होते हैं।
3. चरण 2 — इस प्रकार, \(P\!\left(red marble on each selection\right)\) = \(\frac{8}{17}\)।
4. चरण 3 — \(P\!\left(both red marbles\right)\) = \(\frac{8}{17}\) \(\times\) \(\frac{8}{17}\) = \(\frac{64}{289}\)।
5. मुख्य बिंदु — वस्तु वापस रखने के कारण दोनों चरणों में प्रायिकता मूल संरचना के आधार पर ही निकाली जाती है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{64}{289}\) है।

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — The first marble is replaced, so the container again has 8 red and 9 blue marbles before the second selection.
3. Step 2 — Thus, \(P\!\left(red marble on each selection\right)\) = \(\frac{8}{17}\).
4. Step 3 — \(P\!\left(both red marbles\right)\) = \(\frac{8}{17}\) \(\times\) \(\frac{8}{17}\) = \(\frac{64}{289}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{64}{289}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; हर चयन के बाद वस्तु वापस रखी जाती है।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बॉक्स में 7 लाल और 6 नीले पेन हैं। दो पेन एक के बाद एक बिना वापस रखे चुने जाते हैं। दोनों चुने गए पेन के लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{19}{26}\)
- **B.** \(\frac{49}{169}\)
- **C.** \(\frac{7}{26}\)
- **D.** \(\frac{4}{13}\)
- **E.** \(\frac{3}{13}\)

**Correct answer:** C. \(\frac{7}{26}\)

**English-runtime answer value:** \(\frac{7}{26}\)

### Native explanation to review

1. विधि — चयनों को क्रम से लें और दोनों चरणों की प्रायिकताओं को गुणा करें। बिना वापस रखे चयन में दूसरे चयन से पहले अनुकूल वस्तुओं की बची संख्या और कुल संख्या दोनों बदलें।
2. चरण 1 — पहले चयन में \(P\!\left(red pen\right)\) = \(\frac{7}{13}\)।
3. चरण 2 — एक लाल पेन निकालने के बाद कुल 12 पेनों में 6 लाल पेन बचते हैं।
4. चरण 3 — \(P\!\left(both red pens\right)\) = \(\frac{7}{13}\) \(\times\) \(\frac{6}{12}\) = \(\frac{7}{26}\)।
5. मुख्य बिंदु — पहली वस्तु वापस नहीं रखी जाती, इसलिए दूसरी प्रायिकता एक वस्तु कम होने के बाद की कुल संख्या पर आधारित है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{7}{26}\) है।

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — On the first selection, \(P\!\left(red pen\right)\) = \(\frac{7}{13}\).
3. Step 2 — After one red pen is removed, 6 red pens remain among 12 pens.
4. Step 3 — \(P\!\left(both red pens\right)\) = \(\frac{7}{13}\) \(\times\) \(\frac{6}{12}\) = \(\frac{7}{26}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{7}{26}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक पाउच में 5 लाल और 4 नीले रंगीन पत्थर हैं। एक रंगीन पत्थर निकालकर वापस रख दिया जाता है, फिर दूसरा रंगीन पत्थर निकाला जाता है। दोनों चुने गए रंगीन पत्थरों के लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{25}{82}\)
- **B.** \(\frac{8}{27}\)
- **C.** \(\frac{26}{81}\)
- **D.** \(\frac{25}{81}\)
- **E.** \(\frac{56}{81}\)

**Correct answer:** D. \(\frac{25}{81}\)

**English-runtime answer value:** \(\frac{25}{81}\)

### Native explanation to review

1. विधि — दोनों चयनों को क्रम से देखें। वस्तु वापस रखने पर मूल संरचना फिर से बन जाती है, इसलिए दूसरे चयन में भी वही हर रहता है।
2. चरण 1 — पहला पत्थर वापस रख दिया जाता है, इसलिए दूसरे चयन से पहले उसी पात्र में फिर 5 लाल और 4 नीले रंगीन पत्थर होते हैं।
3. चरण 2 — इस प्रकार, \(P\!\left(red stone on each selection\right)\) = \(\frac{5}{9}\)।
4. चरण 3 — \(P\!\left(both red coloured stones\right)\) = \(\frac{5}{9}\) \(\times\) \(\frac{5}{9}\) = \(\frac{25}{81}\)।
5. मुख्य बिंदु — वस्तु वापस रखने के कारण दोनों चरणों में प्रायिकता मूल संरचना के आधार पर ही निकाली जाती है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{25}{81}\) है।

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — The first stone is replaced, so the container again has 5 red and 4 blue coloured stones before the second selection.
3. Step 2 — Thus, \(P\!\left(red stone on each selection\right)\) = \(\frac{5}{9}\).
4. Step 3 — \(P\!\left(both red coloured stones\right)\) = \(\frac{5}{9}\) \(\times\) \(\frac{5}{9}\) = \(\frac{25}{81}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{25}{81}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; हर चयन के बाद वस्तु वापस रखी जाती है।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बैग में 6 लाल और 9 नीली गेंदें हैं। दो गेंदें एक के बाद एक बिना वापस रखे निकाली जाती हैं। दोनों गेंदों के लाल होने की प्रायिकता क्या है?

### Options

- **A.** 0
- **B.** \(\frac{2}{7}\)
- **C.** \(\frac{6}{7}\)
- **D.** \(\frac{1}{7}\)
- **E.** \(\frac{4}{25}\)

**Correct answer:** D. \(\frac{1}{7}\)

**English-runtime answer value:** \(\frac{1}{7}\)

### Native explanation to review

1. विधि — चयनों को क्रम से लें और दोनों चरणों की प्रायिकताओं को गुणा करें। बिना वापस रखे चयन में दूसरे चयन से पहले अनुकूल वस्तुओं की बची संख्या और कुल संख्या दोनों बदलें।
2. चरण 1 — पहले चयन में \(P\!\left(red ball\right)\) = \(\frac{6}{15}\)।
3. चरण 2 — एक लाल गेंद निकालने के बाद कुल 14 गेंदों में 5 लाल गेंदें बचते हैं।
4. चरण 3 — \(P\!\left(both red balls\right)\) = \(\frac{6}{15}\) \(\times\) \(\frac{5}{14}\) = \(\frac{1}{7}\)।
5. मुख्य बिंदु — पहली वस्तु वापस नहीं रखी जाती, इसलिए दूसरी प्रायिकता एक वस्तु कम होने के बाद की कुल संख्या पर आधारित है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{1}{7}\) है।

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — On the first selection, \(P\!\left(red ball\right)\) = \(\frac{6}{15}\).
3. Step 2 — After one red ball is removed, 5 red balls remain among 14 balls.
4. Step 3 — \(P\!\left(both red balls\right)\) = \(\frac{6}{15}\) \(\times\) \(\frac{5}{14}\) = \(\frac{1}{7}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{1}{7}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक जार में 9 लाल और 8 नीले कंचे हैं। दो कंचे एक के बाद एक बिना वापस रखे चुने जाते हैं। पहले लाल और फिर नीला कंचा मिलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{9}{34}\)
- **B.** \(\frac{9}{35}\)
- **C.** \(\frac{5}{17}\)
- **D.** \(\frac{4}{17}\)
- **E.** \(\frac{25}{34}\)

**Correct answer:** A. \(\frac{9}{34}\)

**English-runtime answer value:** \(\frac{9}{34}\)

### Native explanation to review

1. विधि — चयनों को क्रम से लें और दोनों चरणों की प्रायिकताओं को गुणा करें। बिना वापस रखे चयन में दूसरे चयन से पहले अनुकूल वस्तुओं की बची संख्या और कुल संख्या दोनों बदलें।
2. चरण 1 — क्रम निश्चित है: पहले लाल कंचा और फिर नीला कंचा आना चाहिए।
3. चरण 2 — \(P\!\left(red first\right)\) = \(\frac{9}{17}\); के बाद कि, \(P\!\left(blue second\right)\) = \(\frac{8}{16}\)।
4. चरण 3 — आवश्यक प्रायिकता = \(\frac{9}{17}\) \(\times\) \(\frac{8}{16}\) = \(\frac{9}{34}\)।
5. मुख्य बिंदु — पहली वस्तु वापस नहीं रखी जाती, इसलिए दूसरी प्रायिकता एक वस्तु कम होने के बाद की कुल संख्या पर आधारित है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{9}{34}\) है।

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — The order is fixed: a red marble must occur first and a blue marble second.
3. Step 2 — \(P\!\left(red first\right)\) = \(\frac{9}{17}\); after that, \(P\!\left(blue second\right)\) = \(\frac{8}{16}\).
4. Step 3 — Required probability = \(\frac{9}{17}\) \(\times\) \(\frac{8}{16}\) = \(\frac{9}{34}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{9}{34}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बॉक्स में 9 लाल और 6 नीले पेन हैं। दो पेन एक के बाद एक बिना वापस रखे चुने जाते हैं। दोनों पेन के एक ही रंग के होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{9}{25}\)
- **B.** \(\frac{18}{35}\)
- **C.** \(\frac{16}{35}\)
- **D.** \(\frac{17}{35}\)
- **E.** \(\frac{17}{36}\)

**Correct answer:** D. \(\frac{17}{35}\)

**English-runtime answer value:** \(\frac{17}{35}\)

### Native explanation to review

1. विधि — पेन का रंग समान होने के दो परस्पर अपवर्ती क्रम हैं: लाल-लाल या नीला-नीला। दोनों की प्रायिकताएँ निकालकर जोड़ें।
2. चरण 1 — \(P\!\left(red-red\right)\) = \(\frac{9}{15}\) \(\times\) \(\frac{8}{14}\) = \(\frac{72}{210}\)।
3. चरण 2 — \(P\!\left(blue-blue\right)\) = \(\frac{6}{15}\) \(\times\) \(\frac{5}{14}\) = \(\frac{30}{210}\)।
4. चरण 3 — \(P\!\left(same colour\right)\) = \(\frac{72}{210}\) + \(\frac{30}{210}\) = \(\frac{102}{210}\)।
5. सरलीकरण — अंश और हर दोनों को 6 से भाग दें: (102 \(\div\) 6)/(210 \(\div\) 6) = \(\frac{17}{35}\)।
6. मुख्य बिंदु — लाल-लाल और नीला-नीला एक साथ नहीं हो सकते, इसलिए उनकी प्रायिकताएँ जोड़ी जाती हैं।
7. उत्तर — आवश्यक प्रायिकता \(\frac{17}{35}\) है।

### English explanation authority

1. Method — The pens can have the same colour in two mutually exclusive orders: red-red or blue-blue. Calculate both probabilities and add them.
2. Step 1 — \(P\!\left(red-red\right)\) = \(\frac{9}{15}\) \(\times\) \(\frac{8}{14}\) = \(\frac{72}{210}\).
3. Step 2 — \(P\!\left(blue-blue\right)\) = \(\frac{6}{15}\) \(\times\) \(\frac{5}{14}\) = \(\frac{30}{210}\).
4. Step 3 — \(P\!\left(same colour\right)\) = \(\frac{72}{210}\) + \(\frac{30}{210}\) = \(\frac{102}{210}\).
5. Simplification — Divide the numerator and denominator by 6: (102 \(\div\) 6)/(210 \(\div\) 6) = \(\frac{17}{35}\).
6. Key point — Red-red and blue-blue cannot occur together, so their probabilities are added.
7. Answer — The required probability is \(\frac{17}{35}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक पाउच में 6 लाल और 5 नीले रंगीन पत्थर हैं। दो रंगीन पत्थर एक के बाद एक बिना वापस रखे निकाले जाते हैं। दोनों रंगीन पत्थरों के अलग-अलग रंग के होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{36}{121}\)
- **B.** \(\frac{3}{11}\)
- **C.** \(\frac{7}{11}\)
- **D.** \(\frac{6}{11}\)
- **E.** \(\frac{5}{11}\)

**Correct answer:** D. \(\frac{6}{11}\)

**English-runtime answer value:** \(\frac{6}{11}\)

### Native explanation to review

1. विधि — रंगीन पत्थर के अलग रंग आने के दो परस्पर अपवर्ती क्रम हैं: लाल-नीला या नीला-लाल। दोनों प्रायिकताएँ निकालकर जोड़ें।
2. चरण 1 — \(P\!\left(red-blue\right)\) = \(\frac{6}{11}\) \(\times\) \(\frac{5}{10}\) = \(\frac{30}{110}\)।
3. चरण 2 — \(P\!\left(blue-red\right)\) = \(\frac{5}{11}\) \(\times\) \(\frac{6}{10}\) = \(\frac{30}{110}\)।
4. चरण 3 — \(P\!\left(different colours\right)\) = \(\frac{30}{110}\) + \(\frac{30}{110}\) = \(\frac{60}{110}\)।
5. सरलीकरण — अंश और हर दोनों को 10 से भाग दें: (60 \(\div\) 10)/(110 \(\div\) 10) = \(\frac{6}{11}\)।
6. मुख्य बिंदु — चयन क्रमिक हैं, इसलिए रंगों के दोनों संभावित क्रम शामिल करने होंगे।
7. उत्तर — आवश्यक प्रायिकता \(\frac{6}{11}\) है।

### English explanation authority

1. Method — Different colours can occur in two mutually exclusive orders for the coloured stones: red-blue or blue-red. Calculate both and add them.
2. Step 1 — \(P\!\left(red-blue\right)\) = \(\frac{6}{11}\) \(\times\) \(\frac{5}{10}\) = \(\frac{30}{110}\).
3. Step 2 — \(P\!\left(blue-red\right)\) = \(\frac{5}{11}\) \(\times\) \(\frac{6}{10}\) = \(\frac{30}{110}\).
4. Step 3 — \(P\!\left(different colours\right)\) = \(\frac{30}{110}\) + \(\frac{30}{110}\) = \(\frac{60}{110}\).
5. Simplification — Divide the numerator and denominator by 10: (60 \(\div\) 10)/(110 \(\div\) 10) = \(\frac{6}{11}\).
6. Key point — Both possible colour orders must be included because the draws are successive.
7. Answer — The required probability is \(\frac{6}{11}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बैग में 9 लाल और 6 नीली गेंदें हैं। दो बार चयन किया जाता है और हर बार वस्तु वापस रख दी जाती है। कम-से-कम एक लाल गेंद निकलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{4}{5}\)
- **B.** \(\frac{21}{25}\)
- **C.** \(\frac{21}{26}\)
- **D.** \(\frac{22}{25}\)
- **E.** \(\frac{4}{25}\)

**Correct answer:** B. \(\frac{21}{25}\)

**English-runtime answer value:** \(\frac{21}{25}\)

### Native explanation to review

1. विधि — दोनों चयनों को क्रम से देखें। वस्तु वापस रखने पर मूल संरचना फिर से बन जाती है, इसलिए दूसरे चयन में भी वही हर रहता है।
2. चरण 1 — पूरक घटना लें: कम-से-कम एक लाल गेंद न मिलने की एकमात्र स्थिति दोनों गेंदों का नीला होना है।
3. चरण 2 — वापस रखना बनाए रखता है \(P\!\left(blue ball\right)\) = \(\frac{6}{15}\) पर दोनों चयन।
4. चरण 3 — \(P\!\left(at least one red ball\right)\) = 1 - (\(\frac{6}{15}\) \(\times\) \(\frac{6}{15}\)) = \(\frac{21}{25}\)।
5. मुख्य बिंदु — वस्तु वापस रखने के कारण दोनों चरणों में प्रायिकता मूल संरचना के आधार पर ही निकाली जाती है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{21}{25}\) है।

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — Use the complement: at least one red ball fails only when both selected balls are blue.
3. Step 2 — Replacement keeps \(P\!\left(blue ball\right)\) = \(\frac{6}{15}\) on both selections.
4. Step 3 — \(P\!\left(at least one red ball\right)\) = 1 - (\(\frac{6}{15}\) \(\times\) \(\frac{6}{15}\)) = \(\frac{21}{25}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{21}{25}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; हर चयन के बाद वस्तु वापस रखी जाती है।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक जार में 7 लाल और 4 नीले कंचे हैं। एक कंचा चुनकर वापस रख दिया जाता है, फिर दूसरा कंचा चुना जाता है। दोनों चुने गए कंचों के लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{50}{121}\)
- **B.** \(\frac{72}{121}\)
- **C.** \(\frac{49}{121}\)
- **D.** \(\frac{48}{121}\)
- **E.** \(\frac{49}{122}\)

**Correct answer:** C. \(\frac{49}{121}\)

**English-runtime answer value:** \(\frac{49}{121}\)

### Native explanation to review

1. विधि — दोनों चयनों को क्रम से देखें। वस्तु वापस रखने पर मूल संरचना फिर से बन जाती है, इसलिए दूसरे चयन में भी वही हर रहता है।
2. चरण 1 — पहला कंचा वापस रख दिया जाता है, इसलिए दूसरे चयन से पहले उसी पात्र में फिर 7 लाल और 4 नीले कंचे होते हैं।
3. चरण 2 — इस प्रकार, \(P\!\left(red marble on each selection\right)\) = \(\frac{7}{11}\)।
4. चरण 3 — \(P\!\left(both red marbles\right)\) = \(\frac{7}{11}\) \(\times\) \(\frac{7}{11}\) = \(\frac{49}{121}\)।
5. मुख्य बिंदु — वस्तु वापस रखने के कारण दोनों चरणों में प्रायिकता मूल संरचना के आधार पर ही निकाली जाती है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{49}{121}\) है।

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — The first marble is replaced, so the container again has 7 red and 4 blue marbles before the second selection.
3. Step 2 — Thus, \(P\!\left(red marble on each selection\right)\) = \(\frac{7}{11}\).
4. Step 3 — \(P\!\left(both red marbles\right)\) = \(\frac{7}{11}\) \(\times\) \(\frac{7}{11}\) = \(\frac{49}{121}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{49}{121}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; हर चयन के बाद वस्तु वापस रखी जाती है।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बॉक्स में 9 लाल और 9 नीले पेन हैं। दो पेन एक के बाद एक बिना वापस रखे चुने जाते हैं। दोनों चुने गए पेन के लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{5}{17}\)
- **B.** \(\frac{2}{9}\)
- **C.** \(\frac{3}{17}\)
- **D.** \(\frac{4}{17}\)
- **E.** \(\frac{13}{17}\)

**Correct answer:** D. \(\frac{4}{17}\)

**English-runtime answer value:** \(\frac{4}{17}\)

### Native explanation to review

1. विधि — चयनों को क्रम से लें और दोनों चरणों की प्रायिकताओं को गुणा करें। बिना वापस रखे चयन में दूसरे चयन से पहले अनुकूल वस्तुओं की बची संख्या और कुल संख्या दोनों बदलें।
2. चरण 1 — पहले चयन में \(P\!\left(red pen\right)\) = \(\frac{9}{18}\)।
3. चरण 2 — एक लाल पेन निकालने के बाद कुल 17 पेनों में 8 लाल पेन बचते हैं।
4. चरण 3 — \(P\!\left(both red pens\right)\) = \(\frac{9}{18}\) \(\times\) \(\frac{8}{17}\) = \(\frac{4}{17}\)।
5. मुख्य बिंदु — पहली वस्तु वापस नहीं रखी जाती, इसलिए दूसरी प्रायिकता एक वस्तु कम होने के बाद की कुल संख्या पर आधारित है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{4}{17}\) है।

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — On the first selection, \(P\!\left(red pen\right)\) = \(\frac{9}{18}\).
3. Step 2 — After one red pen is removed, 8 red pens remain among 17 pens.
4. Step 3 — \(P\!\left(both red pens\right)\) = \(\frac{9}{18}\) \(\times\) \(\frac{8}{17}\) = \(\frac{4}{17}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{4}{17}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक पाउच में 4 लाल और 5 नीले रंगीन पत्थर हैं। एक रंगीन पत्थर निकालकर वापस रख दिया जाता है, फिर दूसरा रंगीन पत्थर निकाला जाता है। दोनों चुने गए रंगीन पत्थरों के लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{16}{81}\)
- **B.** \(\frac{65}{81}\)
- **C.** \(\frac{17}{81}\)
- **D.** \(\frac{5}{27}\)
- **E.** \(\frac{8}{41}\)

**Correct answer:** A. \(\frac{16}{81}\)

**English-runtime answer value:** \(\frac{16}{81}\)

### Native explanation to review

1. विधि — दोनों चयनों को क्रम से देखें। वस्तु वापस रखने पर मूल संरचना फिर से बन जाती है, इसलिए दूसरे चयन में भी वही हर रहता है।
2. चरण 1 — पहला पत्थर वापस रख दिया जाता है, इसलिए दूसरे चयन से पहले उसी पात्र में फिर 4 लाल और 5 नीले रंगीन पत्थर होते हैं।
3. चरण 2 — इस प्रकार, \(P\!\left(red stone on each selection\right)\) = \(\frac{4}{9}\)।
4. चरण 3 — \(P\!\left(both red coloured stones\right)\) = \(\frac{4}{9}\) \(\times\) \(\frac{4}{9}\) = \(\frac{16}{81}\)।
5. मुख्य बिंदु — वस्तु वापस रखने के कारण दोनों चरणों में प्रायिकता मूल संरचना के आधार पर ही निकाली जाती है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{16}{81}\) है।

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — The first stone is replaced, so the container again has 4 red and 5 blue coloured stones before the second selection.
3. Step 2 — Thus, \(P\!\left(red stone on each selection\right)\) = \(\frac{4}{9}\).
4. Step 3 — \(P\!\left(both red coloured stones\right)\) = \(\frac{4}{9}\) \(\times\) \(\frac{4}{9}\) = \(\frac{16}{81}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{16}{81}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; हर चयन के बाद वस्तु वापस रखी जाती है।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बैग में 6 लाल और 6 नीली गेंदें हैं। दो गेंदें एक के बाद एक बिना वापस रखे निकाली जाती हैं। दोनों गेंदों के लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{17}{22}\)
- **B.** \(\frac{2}{11}\)
- **C.** \(\frac{3}{11}\)
- **D.** \(\frac{5}{22}\)
- **E.** \(\frac{1}{4}\)

**Correct answer:** D. \(\frac{5}{22}\)

**English-runtime answer value:** \(\frac{5}{22}\)

### Native explanation to review

1. विधि — चयनों को क्रम से लें और दोनों चरणों की प्रायिकताओं को गुणा करें। बिना वापस रखे चयन में दूसरे चयन से पहले अनुकूल वस्तुओं की बची संख्या और कुल संख्या दोनों बदलें।
2. चरण 1 — पहले चयन में \(P\!\left(red ball\right)\) = \(\frac{6}{12}\)।
3. चरण 2 — एक लाल गेंद निकालने के बाद कुल 11 गेंदों में 5 लाल गेंदें बचते हैं।
4. चरण 3 — \(P\!\left(both red balls\right)\) = \(\frac{6}{12}\) \(\times\) \(\frac{5}{11}\) = \(\frac{5}{22}\)।
5. मुख्य बिंदु — पहली वस्तु वापस नहीं रखी जाती, इसलिए दूसरी प्रायिकता एक वस्तु कम होने के बाद की कुल संख्या पर आधारित है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{5}{22}\) है।

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — On the first selection, \(P\!\left(red ball\right)\) = \(\frac{6}{12}\).
3. Step 2 — After one red ball is removed, 5 red balls remain among 11 balls.
4. Step 3 — \(P\!\left(both red balls\right)\) = \(\frac{6}{12}\) \(\times\) \(\frac{5}{11}\) = \(\frac{5}{22}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{5}{22}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक जार में 8 लाल और 4 नीले कंचे हैं। दो कंचे एक के बाद एक बिना वापस रखे चुने जाते हैं। पहले लाल और फिर नीला कंचा मिलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{3}{11}\)
- **B.** \(\frac{25}{33}\)
- **C.** \(\frac{4}{17}\)
- **D.** \(\frac{8}{33}\)
- **E.** \(\frac{7}{33}\)

**Correct answer:** D. \(\frac{8}{33}\)

**English-runtime answer value:** \(\frac{8}{33}\)

### Native explanation to review

1. विधि — चयनों को क्रम से लें और दोनों चरणों की प्रायिकताओं को गुणा करें। बिना वापस रखे चयन में दूसरे चयन से पहले अनुकूल वस्तुओं की बची संख्या और कुल संख्या दोनों बदलें।
2. चरण 1 — क्रम निश्चित है: पहले लाल कंचा और फिर नीला कंचा आना चाहिए।
3. चरण 2 — \(P\!\left(red first\right)\) = \(\frac{8}{12}\); के बाद कि, \(P\!\left(blue second\right)\) = \(\frac{4}{11}\)।
4. चरण 3 — आवश्यक प्रायिकता = \(\frac{8}{12}\) \(\times\) \(\frac{4}{11}\) = \(\frac{8}{33}\)।
5. मुख्य बिंदु — पहली वस्तु वापस नहीं रखी जाती, इसलिए दूसरी प्रायिकता एक वस्तु कम होने के बाद की कुल संख्या पर आधारित है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{8}{33}\) है।

### English explanation authority

1. Method — Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.
2. Step 1 — The order is fixed: a red marble must occur first and a blue marble second.
3. Step 2 — \(P\!\left(red first\right)\) = \(\frac{8}{12}\); after that, \(P\!\left(blue second\right)\) = \(\frac{4}{11}\).
4. Step 3 — Required probability = \(\frac{8}{12}\) \(\times\) \(\frac{4}{11}\) = \(\frac{8}{33}\).
5. Key point — Because the first object is not returned, the second probability is based on one fewer object.
6. Answer — The required probability is \(\frac{8}{33}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बॉक्स में 8 लाल और 6 नीले पेन हैं। दो पेन एक के बाद एक बिना वापस रखे चुने जाते हैं। दोनों पेन के एक ही रंग के होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{44}{91}\)
- **B.** \(\frac{6}{13}\)
- **C.** \(\frac{43}{91}\)
- **D.** \(\frac{16}{49}\)
- **E.** \(\frac{48}{91}\)

**Correct answer:** C. \(\frac{43}{91}\)

**English-runtime answer value:** \(\frac{43}{91}\)

### Native explanation to review

1. विधि — पेन का रंग समान होने के दो परस्पर अपवर्ती क्रम हैं: लाल-लाल या नीला-नीला। दोनों की प्रायिकताएँ निकालकर जोड़ें।
2. चरण 1 — \(P\!\left(red-red\right)\) = \(\frac{8}{14}\) \(\times\) \(\frac{7}{13}\) = \(\frac{56}{182}\)।
3. चरण 2 — \(P\!\left(blue-blue\right)\) = \(\frac{6}{14}\) \(\times\) \(\frac{5}{13}\) = \(\frac{30}{182}\)।
4. चरण 3 — \(P\!\left(same colour\right)\) = \(\frac{56}{182}\) + \(\frac{30}{182}\) = \(\frac{86}{182}\)।
5. सरलीकरण — अंश और हर दोनों को 2 से भाग दें: (86 \(\div\) 2)/(182 \(\div\) 2) = \(\frac{43}{91}\)।
6. मुख्य बिंदु — लाल-लाल और नीला-नीला एक साथ नहीं हो सकते, इसलिए उनकी प्रायिकताएँ जोड़ी जाती हैं।
7. उत्तर — आवश्यक प्रायिकता \(\frac{43}{91}\) है।

### English explanation authority

1. Method — The pens can have the same colour in two mutually exclusive orders: red-red or blue-blue. Calculate both probabilities and add them.
2. Step 1 — \(P\!\left(red-red\right)\) = \(\frac{8}{14}\) \(\times\) \(\frac{7}{13}\) = \(\frac{56}{182}\).
3. Step 2 — \(P\!\left(blue-blue\right)\) = \(\frac{6}{14}\) \(\times\) \(\frac{5}{13}\) = \(\frac{30}{182}\).
4. Step 3 — \(P\!\left(same colour\right)\) = \(\frac{56}{182}\) + \(\frac{30}{182}\) = \(\frac{86}{182}\).
5. Simplification — Divide the numerator and denominator by 2: (86 \(\div\) 2)/(182 \(\div\) 2) = \(\frac{43}{91}\).
6. Key point — Red-red and blue-blue cannot occur together, so their probabilities are added.
7. Answer — The required probability is \(\frac{43}{91}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक पाउच में 6 लाल और 7 नीले रंगीन पत्थर हैं। दो रंगीन पत्थर एक के बाद एक बिना वापस रखे निकाले जाते हैं। दोनों रंगीन पत्थरों के अलग-अलग रंग के होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{7}{26}\)
- **B.** \(\frac{7}{13}\)
- **C.** \(\frac{8}{13}\)
- **D.** \(\frac{6}{13}\)
- **E.** \(\frac{36}{169}\)

**Correct answer:** B. \(\frac{7}{13}\)

**English-runtime answer value:** \(\frac{7}{13}\)

### Native explanation to review

1. विधि — रंगीन पत्थर के अलग रंग आने के दो परस्पर अपवर्ती क्रम हैं: लाल-नीला या नीला-लाल। दोनों प्रायिकताएँ निकालकर जोड़ें।
2. चरण 1 — \(P\!\left(red-blue\right)\) = \(\frac{6}{13}\) \(\times\) \(\frac{7}{12}\) = \(\frac{42}{156}\)।
3. चरण 2 — \(P\!\left(blue-red\right)\) = \(\frac{7}{13}\) \(\times\) \(\frac{6}{12}\) = \(\frac{42}{156}\)।
4. चरण 3 — \(P\!\left(different colours\right)\) = \(\frac{42}{156}\) + \(\frac{42}{156}\) = \(\frac{84}{156}\)।
5. सरलीकरण — अंश और हर दोनों को 12 से भाग दें: (84 \(\div\) 12)/(156 \(\div\) 12) = \(\frac{7}{13}\)।
6. मुख्य बिंदु — चयन क्रमिक हैं, इसलिए रंगों के दोनों संभावित क्रम शामिल करने होंगे।
7. उत्तर — आवश्यक प्रायिकता \(\frac{7}{13}\) है।

### English explanation authority

1. Method — Different colours can occur in two mutually exclusive orders for the coloured stones: red-blue or blue-red. Calculate both and add them.
2. Step 1 — \(P\!\left(red-blue\right)\) = \(\frac{6}{13}\) \(\times\) \(\frac{7}{12}\) = \(\frac{42}{156}\).
3. Step 2 — \(P\!\left(blue-red\right)\) = \(\frac{7}{13}\) \(\times\) \(\frac{6}{12}\) = \(\frac{42}{156}\).
4. Step 3 — \(P\!\left(different colours\right)\) = \(\frac{42}{156}\) + \(\frac{42}{156}\) = \(\frac{84}{156}\).
5. Simplification — Divide the numerator and denominator by 12: (84 \(\div\) 12)/(156 \(\div\) 12) = \(\frac{7}{13}\).
6. Key point — Both possible colour orders must be included because the draws are successive.
7. Answer — The required probability is \(\frac{7}{13}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बैग में 9 लाल और 4 नीली गेंदें हैं। दो बार चयन किया जाता है और हर बार वस्तु वापस रख दी जाती है। कम-से-कम एक लाल गेंद निकलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{16}{169}\)
- **B.** \(\frac{154}{169}\)
- **C.** \(\frac{9}{10}\)
- **D.** \(\frac{152}{169}\)
- **E.** \(\frac{153}{169}\)

**Correct answer:** E. \(\frac{153}{169}\)

**English-runtime answer value:** \(\frac{153}{169}\)

### Native explanation to review

1. विधि — दोनों चयनों को क्रम से देखें। वस्तु वापस रखने पर मूल संरचना फिर से बन जाती है, इसलिए दूसरे चयन में भी वही हर रहता है।
2. चरण 1 — पूरक घटना लें: कम-से-कम एक लाल गेंद न मिलने की एकमात्र स्थिति दोनों गेंदों का नीला होना है।
3. चरण 2 — वापस रखना बनाए रखता है \(P\!\left(blue ball\right)\) = \(\frac{4}{13}\) पर दोनों चयन।
4. चरण 3 — \(P\!\left(at least one red ball\right)\) = 1 - (\(\frac{4}{13}\) \(\times\) \(\frac{4}{13}\)) = \(\frac{153}{169}\)।
5. मुख्य बिंदु — वस्तु वापस रखने के कारण दोनों चरणों में प्रायिकता मूल संरचना के आधार पर ही निकाली जाती है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{153}{169}\) है।

### English explanation authority

1. Method — Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.
2. Step 1 — Use the complement: at least one red ball fails only when both selected balls are blue.
3. Step 2 — Replacement keeps \(P\!\left(blue ball\right)\) = \(\frac{4}{13}\) on both selections.
4. Step 3 — \(P\!\left(at least one red ball\right)\) = 1 - (\(\frac{4}{13}\) \(\times\) \(\frac{4}{13}\)) = \(\frac{153}{169}\).
5. Key point — Replacement makes the two stage probabilities use the original composition each time.
6. Answer — The required probability is \(\frac{153}{169}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; हर चयन के बाद वस्तु वापस रखी जाती है।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

क्वांटिटेटिव एप्टीट्यूड में उत्तीर्ण 14 अभ्यर्थियों में से 5 रीजनिंग में भी उत्तीर्ण हैं। इन 14 अभ्यर्थियों में से एक को यादृच्छिक रूप से चुना जाता है। चुने गए अभ्यर्थी के रीजनिंग में भी उत्तीर्ण होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{9}{14}\)
- **B.** \(\frac{1}{3}\)
- **C.** \(\frac{5}{14}\)
- **D.** \(\frac{3}{7}\)
- **E.** \(\frac{2}{7}\)

**Correct answer:** C. \(\frac{5}{14}\)

**English-runtime answer value:** \(\frac{5}{14}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — दी गई शर्त के बाद कुल समूह केवल उन 14 लोगों तक सीमित है जो पहली शर्त पूरी करते हैं।
3. चरण 2 — इन 14 लोगों में से 5 दूसरी शर्त भी पूरी करते हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{5}{14}\) है।
5. मुख्य बिंदु — शर्त में दिया गया समूह ही नया कुल समूह बन जाता है; इसलिए वही नया हर होगा।
6. उत्तर — आवश्यक प्रायिकता \(\frac{5}{14}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

मानक 52 पत्तों की गड्डी से निकला पत्ता फेस कार्ड है। उसके बादशाह होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{5}{52}\)
- **B.** \(\frac{2}{3}\)
- **C.** 0
- **D.** \(\frac{1}{4}\)
- **E.** \(\frac{1}{3}\)

**Correct answer:** E. \(\frac{1}{3}\)

**English-runtime answer value:** \(\frac{1}{3}\)

### Native explanation to review

1. विधि — दी गई शर्त से अनुमत पत्तों को ही नया कुल समूह मानें; उस सीमित समूह से बाहर के पत्ते अब संभव नहीं हैं।
2. चरण 1 — पत्ता फेस कार्ड है—इस शर्त के बाद कुल समूह केवल 12 गुलाम, बेगम और बादशाह पत्तों तक सीमित हो जाता है।
3. चरण 2 — इन 12 फेस कार्डों में ठीक 4 बादशाह हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{4}{12}\) = \(\frac{1}{3}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{1}{3}\) है।

### English explanation authority

1. Method — Use only the cards allowed by the given condition as the sample space; cards outside that restricted set are no longer possible.
2. Step 1 — Knowing that the card is a face card reduces the sample space to the 12 jacks, queens and kings.
3. Step 2 — Exactly 4 of these 12 face cards are kings.
4. Step 3 — The required probability is \(\frac{4}{12}\) = \(\frac{1}{3}\).
5. Answer — The required probability is \(\frac{1}{3}\).

**Native visuals:**
- **CARD_DECK_SUMMARY** — मानक ताश-गड्डी सारांश
  - Alt: 52 पत्तों की मानक गड्डी की आवश्यक गणनाओं का सारांश।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

1 से 30 तक चुना गया एक पूर्णांक 2 से विभाज्य है। उसके 4 से भी विभाज्य होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{2}{5}\)
- **B.** \(\frac{7}{16}\)
- **C.** \(\frac{8}{15}\)
- **D.** \(\frac{7}{30}\)
- **E.** \(\frac{7}{15}\)

**Correct answer:** E. \(\frac{7}{15}\)

**English-runtime answer value:** \(\frac{7}{15}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — सीमित संख्याएँ हैं 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30।
3. चरण 2 — इनमें से 4, 8, 12, 16, 20, 24, 28 संख्याएँ 4 से विभाज्य हैं। इसलिए प्रायिकता \(\frac{7}{15}\) है।
4. उत्तर — आवश्यक प्रायिकता \(\frac{7}{15}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बैग में 9 लाल और 8 नीली गेंदें हैं। दो गेंदें बिना वापस रखे निकाली जाती हैं। यदि पहली गेंद लाल है, तो दूसरी गेंद के भी लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{9}{16}\)
- **B.** 0
- **C.** 1
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{1}{3}\)

**Correct answer:** D. \(\frac{1}{2}\)

**English-runtime answer value:** \(\frac{1}{2}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — शर्त से ज्ञात है कि पहली चुनी गई गेंद लाल थी और उसे वापस नहीं रखा गया।
3. चरण 2 — दूसरे चयन के लिए कुल 16 गेंदों में 8 लाल गेंदें बची हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{8}{16}\) = \(\frac{1}{2}\) है।
5. मुख्य बिंदु — पहले चयन की जानकारी मिलने के बाद दूसरा चयन केवल बची वस्तुओं में से होता है; इसलिए दोनों बची संख्याओं का उपयोग करें।
6. उत्तर — आवश्यक प्रायिकता \(\frac{1}{2}\) है।

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The condition tells us that the first selected ball was red and was not replaced.
3. Step 2 — 8 red balls remain among 16 balls for the second selection.
4. Step 3 — The required probability is \(\frac{8}{16}\) = \(\frac{1}{2}\).
5. Key point — After the known first draw, the second draw is made only from the remaining objects, so both remaining counts must be used.
6. Answer — The required probability is \(\frac{1}{2}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

18 शॉर्टलिस्ट किए गए अभ्यर्थियों में से यादृच्छिक रूप से चुने गए अभ्यर्थी के प्रमाणित होने की प्रायिकता \(\frac{1}{6}\) है। ऐसे कितने अभ्यर्थी हैं?

### Options

- **A.** 2
- **B.** 3
- **C.** 5
- **D.** 1
- **E.** 4

**Correct answer:** B. 3

**English-runtime answer value:** 3

### Native explanation to review

1. विधि — \(P\!\left(E\right)\) = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ लिखें और अज्ञात संख्या ज्ञात करने के लिए संबंध को पुनर्व्यवस्थित करें।
2. चरण 1 — चयन केवल सीमित समूह में से है। आवश्यक संख्या x मानें; तब x/18 = \(\frac{1}{6}\)।
3. चरण 2 — x = 18 \(\times\) \(\frac{1}{6}\) = 3।
4. चरण 3 — 3 लोग आवश्यक शर्त पूरी करते हैं।
5. मुख्य बिंदु — यहाँ शॉर्टलिस्ट समूह ही पूरा कुल समूह है, इसलिए उसकी संख्या प्रायिकता संबंध का हर है।
6. उत्तर — आवश्यक संख्या 3 है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

गणित में उत्तीर्ण 13 विद्यार्थियों में से 5 अंग्रेज़ी में भी उत्तीर्ण हैं। इन 13 विद्यार्थियों में से एक को यादृच्छिक रूप से चुना जाता है। चुने गए विद्यार्थी के अंग्रेज़ी में भी उत्तीर्ण होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{6}{13}\)
- **B.** \(\frac{8}{13}\)
- **C.** \(\frac{5}{13}\)
- **D.** \(\frac{5}{14}\)
- **E.** \(\frac{4}{13}\)

**Correct answer:** C. \(\frac{5}{13}\)

**English-runtime answer value:** \(\frac{5}{13}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — दी गई शर्त के बाद कुल समूह केवल उन 13 लोगों तक सीमित है जो पहली शर्त पूरी करते हैं।
3. चरण 2 — इन 13 लोगों में से 5 दूसरी शर्त भी पूरी करते हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{5}{13}\) है।
5. मुख्य बिंदु — शर्त में दिया गया समूह ही नया कुल समूह बन जाता है; इसलिए वही नया हर होगा।
6. उत्तर — आवश्यक प्रायिकता \(\frac{5}{13}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

क्वांटिटेटिव एप्टीट्यूड में उत्तीर्ण 12 अभ्यर्थियों में से 8 रीजनिंग में भी उत्तीर्ण हैं। इन 12 अभ्यर्थियों में से एक को यादृच्छिक रूप से चुना जाता है। चुने गए अभ्यर्थी के रीजनिंग में भी उत्तीर्ण होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{3}{4}\)
- **B.** \(\frac{1}{3}\)
- **C.** 1
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{2}{3}\)

**Correct answer:** E. \(\frac{2}{3}\)

**English-runtime answer value:** \(\frac{2}{3}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — दी गई शर्त के बाद कुल समूह केवल उन 12 लोगों तक सीमित है जो पहली शर्त पूरी करते हैं।
3. चरण 2 — इन 12 लोगों में से 8 दूसरी शर्त भी पूरी करते हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{8}{12}\) = \(\frac{2}{3}\) है।
5. मुख्य बिंदु — शर्त में दिया गया समूह ही नया कुल समूह बन जाता है; इसलिए वही नया हर होगा।
6. उत्तर — आवश्यक प्रायिकता \(\frac{2}{3}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

मानक 52 पत्तों की गड्डी से निकला पत्ता फेस कार्ड है। उसके बादशाह होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{5}{52}\)
- **C.** \(\frac{2}{3}\)
- **D.** 0
- **E.** \(\frac{1}{4}\)

**Correct answer:** A. \(\frac{1}{3}\)

**English-runtime answer value:** \(\frac{1}{3}\)

### Native explanation to review

1. विधि — दी गई शर्त से अनुमत पत्तों को ही नया कुल समूह मानें; उस सीमित समूह से बाहर के पत्ते अब संभव नहीं हैं।
2. चरण 1 — पत्ता फेस कार्ड है—इस शर्त के बाद कुल समूह केवल 12 गुलाम, बेगम और बादशाह पत्तों तक सीमित हो जाता है।
3. चरण 2 — इन 12 फेस कार्डों में ठीक 4 बादशाह हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{4}{12}\) = \(\frac{1}{3}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{1}{3}\) है।

### English explanation authority

1. Method — Use only the cards allowed by the given condition as the sample space; cards outside that restricted set are no longer possible.
2. Step 1 — Knowing that the card is a face card reduces the sample space to the 12 jacks, queens and kings.
3. Step 2 — Exactly 4 of these 12 face cards are kings.
4. Step 3 — The required probability is \(\frac{4}{12}\) = \(\frac{1}{3}\).
5. Answer — The required probability is \(\frac{1}{3}\).

**Native visuals:**
- **CARD_DECK_SUMMARY** — मानक ताश-गड्डी सारांश
  - Alt: 52 पत्तों की मानक गड्डी की आवश्यक गणनाओं का सारांश।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

1 से 30 तक चुना गया एक पूर्णांक 2 से विभाज्य है। उसके 4 से भी विभाज्य होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{7}{15}\)
- **B.** \(\frac{2}{5}\)
- **C.** \(\frac{7}{30}\)
- **D.** \(\frac{7}{16}\)
- **E.** \(\frac{8}{15}\)

**Correct answer:** A. \(\frac{7}{15}\)

**English-runtime answer value:** \(\frac{7}{15}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — सीमित संख्याएँ हैं 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30।
3. चरण 2 — इनमें से 4, 8, 12, 16, 20, 24, 28 संख्याएँ 4 से विभाज्य हैं। इसलिए प्रायिकता \(\frac{7}{15}\) है।
4. उत्तर — आवश्यक प्रायिकता \(\frac{7}{15}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बैग में 9 लाल और 7 नीली गेंदें हैं। दो गेंदें बिना वापस रखे निकाली जाती हैं। यदि पहली गेंद लाल है, तो दूसरी गेंद के भी लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{3}{5}\)
- **B.** \(\frac{8}{15}\)
- **C.** \(\frac{7}{15}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{4}{7}\)

**Correct answer:** B. \(\frac{8}{15}\)

**English-runtime answer value:** \(\frac{8}{15}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — शर्त से ज्ञात है कि पहली चुनी गई गेंद लाल थी और उसे वापस नहीं रखा गया।
3. चरण 2 — दूसरे चयन के लिए कुल 15 गेंदों में 8 लाल गेंदें बची हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{8}{15}\) है।
5. मुख्य बिंदु — पहले चयन की जानकारी मिलने के बाद दूसरा चयन केवल बची वस्तुओं में से होता है; इसलिए दोनों बची संख्याओं का उपयोग करें।
6. उत्तर — आवश्यक प्रायिकता \(\frac{8}{15}\) है।

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The condition tells us that the first selected ball was red and was not replaced.
3. Step 2 — 8 red balls remain among 15 balls for the second selection.
4. Step 3 — The required probability is \(\frac{8}{15}\).
5. Key point — After the known first draw, the second draw is made only from the remaining objects, so both remaining counts must be used.
6. Answer — The required probability is \(\frac{8}{15}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

23 शॉर्टलिस्ट किए गए अभ्यर्थियों में से यादृच्छिक रूप से चुने गए अभ्यर्थी के प्रमाणित होने की प्रायिकता \(\frac{20}{23}\) है। ऐसे कितने अभ्यर्थी हैं?

### Options

- **A.** 20
- **B.** 21
- **C.** 22
- **D.** 19
- **E.** 18

**Correct answer:** A. 20

**English-runtime answer value:** 20

### Native explanation to review

1. विधि — \(P\!\left(E\right)\) = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ लिखें और अज्ञात संख्या ज्ञात करने के लिए संबंध को पुनर्व्यवस्थित करें।
2. चरण 1 — चयन केवल सीमित समूह में से है। आवश्यक संख्या x मानें; तब x/23 = \(\frac{20}{23}\)।
3. चरण 2 — x = 23 \(\times\) \(\frac{20}{23}\) = 20।
4. चरण 3 — 20 लोग आवश्यक शर्त पूरी करते हैं।
5. मुख्य बिंदु — यहाँ शॉर्टलिस्ट समूह ही पूरा कुल समूह है, इसलिए उसकी संख्या प्रायिकता संबंध का हर है।
6. उत्तर — आवश्यक संख्या 20 है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

गणित में उत्तीर्ण 12 विद्यार्थियों में से 3 अंग्रेज़ी में भी उत्तीर्ण हैं। इन 12 विद्यार्थियों में से एक को यादृच्छिक रूप से चुना जाता है। चुने गए विद्यार्थी के अंग्रेज़ी में भी उत्तीर्ण होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{5}\)
- **B.** \(\frac{3}{4}\)
- **C.** \(\frac{1}{2}\)
- **D.** 0
- **E.** \(\frac{1}{4}\)

**Correct answer:** E. \(\frac{1}{4}\)

**English-runtime answer value:** \(\frac{1}{4}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — दी गई शर्त के बाद कुल समूह केवल उन 12 लोगों तक सीमित है जो पहली शर्त पूरी करते हैं।
3. चरण 2 — इन 12 लोगों में से 3 दूसरी शर्त भी पूरी करते हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{3}{12}\) = \(\frac{1}{4}\) है।
5. मुख्य बिंदु — शर्त में दिया गया समूह ही नया कुल समूह बन जाता है; इसलिए वही नया हर होगा।
6. उत्तर — आवश्यक प्रायिकता \(\frac{1}{4}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

क्वांटिटेटिव एप्टीट्यूड में उत्तीर्ण 18 अभ्यर्थियों में से 5 रीजनिंग में भी उत्तीर्ण हैं। इन 18 अभ्यर्थियों में से एक को यादृच्छिक रूप से चुना जाता है। चुने गए अभ्यर्थी के रीजनिंग में भी उत्तीर्ण होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{13}{18}\)
- **B.** \(\frac{2}{9}\)
- **C.** \(\frac{5}{18}\)
- **D.** \(\frac{5}{19}\)
- **E.** \(\frac{1}{3}\)

**Correct answer:** C. \(\frac{5}{18}\)

**English-runtime answer value:** \(\frac{5}{18}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — दी गई शर्त के बाद कुल समूह केवल उन 18 लोगों तक सीमित है जो पहली शर्त पूरी करते हैं।
3. चरण 2 — इन 18 लोगों में से 5 दूसरी शर्त भी पूरी करते हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{5}{18}\) है।
5. मुख्य बिंदु — शर्त में दिया गया समूह ही नया कुल समूह बन जाता है; इसलिए वही नया हर होगा।
6. उत्तर — आवश्यक प्रायिकता \(\frac{5}{18}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

मानक 52 पत्तों की गड्डी से निकला पत्ता फेस कार्ड है। उसके बादशाह होने की प्रायिकता क्या है?

### Options

- **A.** 0
- **B.** \(\frac{5}{52}\)
- **C.** \(\frac{1}{3}\)
- **D.** \(\frac{1}{4}\)
- **E.** \(\frac{2}{3}\)

**Correct answer:** C. \(\frac{1}{3}\)

**English-runtime answer value:** \(\frac{1}{3}\)

### Native explanation to review

1. विधि — दी गई शर्त से अनुमत पत्तों को ही नया कुल समूह मानें; उस सीमित समूह से बाहर के पत्ते अब संभव नहीं हैं।
2. चरण 1 — पत्ता फेस कार्ड है—इस शर्त के बाद कुल समूह केवल 12 गुलाम, बेगम और बादशाह पत्तों तक सीमित हो जाता है।
3. चरण 2 — इन 12 फेस कार्डों में ठीक 4 बादशाह हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{4}{12}\) = \(\frac{1}{3}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{1}{3}\) है।

### English explanation authority

1. Method — Use only the cards allowed by the given condition as the sample space; cards outside that restricted set are no longer possible.
2. Step 1 — Knowing that the card is a face card reduces the sample space to the 12 jacks, queens and kings.
3. Step 2 — Exactly 4 of these 12 face cards are kings.
4. Step 3 — The required probability is \(\frac{4}{12}\) = \(\frac{1}{3}\).
5. Answer — The required probability is \(\frac{1}{3}\).

**Native visuals:**
- **CARD_DECK_SUMMARY** — मानक ताश-गड्डी सारांश
  - Alt: 52 पत्तों की मानक गड्डी की आवश्यक गणनाओं का सारांश।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

1 से 40 तक चुना गया एक पूर्णांक 2 से विभाज्य है। उसके 4 से भी विभाज्य होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{1}{2}\)
- **C.** \(\frac{1}{4}\)
- **D.** 0
- **E.** 1

**Correct answer:** B. \(\frac{1}{2}\)

**English-runtime answer value:** \(\frac{1}{2}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — सीमित संख्याएँ हैं 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40।
3. चरण 2 — इनमें से 4, 8, 12, 16, 20, 24, 28, 32, 36, 40 संख्याएँ 4 से विभाज्य हैं। इसलिए प्रायिकता \(\frac{10}{20}\) = \(\frac{1}{2}\) है।
4. उत्तर — आवश्यक प्रायिकता \(\frac{1}{2}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बैग में 8 लाल और 8 नीली गेंदें हैं। दो गेंदें बिना वापस रखे निकाली जाती हैं। यदि पहली गेंद लाल है, तो दूसरी गेंद के भी लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{7}{16}\)
- **B.** \(\frac{1}{2}\)
- **C.** \(\frac{2}{5}\)
- **D.** \(\frac{7}{15}\)
- **E.** \(\frac{8}{15}\)

**Correct answer:** D. \(\frac{7}{15}\)

**English-runtime answer value:** \(\frac{7}{15}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — शर्त से ज्ञात है कि पहली चुनी गई गेंद लाल थी और उसे वापस नहीं रखा गया।
3. चरण 2 — दूसरे चयन के लिए कुल 15 गेंदों में 7 लाल गेंदें बची हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{7}{15}\) है।
5. मुख्य बिंदु — पहले चयन की जानकारी मिलने के बाद दूसरा चयन केवल बची वस्तुओं में से होता है; इसलिए दोनों बची संख्याओं का उपयोग करें।
6. उत्तर — आवश्यक प्रायिकता \(\frac{7}{15}\) है।

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The condition tells us that the first selected ball was red and was not replaced.
3. Step 2 — 7 red balls remain among 15 balls for the second selection.
4. Step 3 — The required probability is \(\frac{7}{15}\).
5. Key point — After the known first draw, the second draw is made only from the remaining objects, so both remaining counts must be used.
6. Answer — The required probability is \(\frac{7}{15}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

20 शॉर्टलिस्ट किए गए अभ्यर्थियों में से यादृच्छिक रूप से चुने गए अभ्यर्थी के प्रमाणित होने की प्रायिकता \(\frac{3}{4}\) है। ऐसे कितने अभ्यर्थी हैं?

### Options

- **A.** 17
- **B.** 14
- **C.** 13
- **D.** 15
- **E.** 16

**Correct answer:** D. 15

**English-runtime answer value:** 15

### Native explanation to review

1. विधि — \(P\!\left(E\right)\) = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ लिखें और अज्ञात संख्या ज्ञात करने के लिए संबंध को पुनर्व्यवस्थित करें।
2. चरण 1 — चयन केवल सीमित समूह में से है। आवश्यक संख्या x मानें; तब x/20 = \(\frac{3}{4}\)।
3. चरण 2 — x = 20 \(\times\) \(\frac{3}{4}\) = 15।
4. चरण 3 — 15 लोग आवश्यक शर्त पूरी करते हैं।
5. मुख्य बिंदु — यहाँ शॉर्टलिस्ट समूह ही पूरा कुल समूह है, इसलिए उसकी संख्या प्रायिकता संबंध का हर है।
6. उत्तर — आवश्यक संख्या 15 है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

गणित में उत्तीर्ण 18 विद्यार्थियों में से 8 अंग्रेज़ी में भी उत्तीर्ण हैं। इन 18 विद्यार्थियों में से एक को यादृच्छिक रूप से चुना जाता है। चुने गए विद्यार्थी के अंग्रेज़ी में भी उत्तीर्ण होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{5}{9}\)
- **B.** \(\frac{1}{2}\)
- **C.** \(\frac{1}{3}\)
- **D.** \(\frac{2}{5}\)
- **E.** \(\frac{4}{9}\)

**Correct answer:** E. \(\frac{4}{9}\)

**English-runtime answer value:** \(\frac{4}{9}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — दी गई शर्त के बाद कुल समूह केवल उन 18 लोगों तक सीमित है जो पहली शर्त पूरी करते हैं।
3. चरण 2 — इन 18 लोगों में से 8 दूसरी शर्त भी पूरी करते हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{8}{18}\) = \(\frac{4}{9}\) है।
5. मुख्य बिंदु — शर्त में दिया गया समूह ही नया कुल समूह बन जाता है; इसलिए वही नया हर होगा।
6. उत्तर — आवश्यक प्रायिकता \(\frac{4}{9}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

क्वांटिटेटिव एप्टीट्यूड में उत्तीर्ण 15 अभ्यर्थियों में से 4 रीजनिंग में भी उत्तीर्ण हैं। इन 15 अभ्यर्थियों में से एक को यादृच्छिक रूप से चुना जाता है। चुने गए अभ्यर्थी के रीजनिंग में भी उत्तीर्ण होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{4}\)
- **B.** \(\frac{11}{15}\)
- **C.** \(\frac{4}{15}\)
- **D.** \(\frac{1}{5}\)
- **E.** \(\frac{1}{3}\)

**Correct answer:** C. \(\frac{4}{15}\)

**English-runtime answer value:** \(\frac{4}{15}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — दी गई शर्त के बाद कुल समूह केवल उन 15 लोगों तक सीमित है जो पहली शर्त पूरी करते हैं।
3. चरण 2 — इन 15 लोगों में से 4 दूसरी शर्त भी पूरी करते हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{4}{15}\) है।
5. मुख्य बिंदु — शर्त में दिया गया समूह ही नया कुल समूह बन जाता है; इसलिए वही नया हर होगा।
6. उत्तर — आवश्यक प्रायिकता \(\frac{4}{15}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

मानक 52 पत्तों की गड्डी से निकला पत्ता फेस कार्ड है। उसके बादशाह होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{2}{3}\)
- **B.** \(\frac{5}{52}\)
- **C.** \(\frac{1}{3}\)
- **D.** 0
- **E.** \(\frac{1}{4}\)

**Correct answer:** C. \(\frac{1}{3}\)

**English-runtime answer value:** \(\frac{1}{3}\)

### Native explanation to review

1. विधि — दी गई शर्त से अनुमत पत्तों को ही नया कुल समूह मानें; उस सीमित समूह से बाहर के पत्ते अब संभव नहीं हैं।
2. चरण 1 — पत्ता फेस कार्ड है—इस शर्त के बाद कुल समूह केवल 12 गुलाम, बेगम और बादशाह पत्तों तक सीमित हो जाता है।
3. चरण 2 — इन 12 फेस कार्डों में ठीक 4 बादशाह हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{4}{12}\) = \(\frac{1}{3}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{1}{3}\) है।

### English explanation authority

1. Method — Use only the cards allowed by the given condition as the sample space; cards outside that restricted set are no longer possible.
2. Step 1 — Knowing that the card is a face card reduces the sample space to the 12 jacks, queens and kings.
3. Step 2 — Exactly 4 of these 12 face cards are kings.
4. Step 3 — The required probability is \(\frac{4}{12}\) = \(\frac{1}{3}\).
5. Answer — The required probability is \(\frac{1}{3}\).

**Native visuals:**
- **CARD_DECK_SUMMARY** — मानक ताश-गड्डी सारांश
  - Alt: 52 पत्तों की मानक गड्डी की आवश्यक गणनाओं का सारांश।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

1 से 30 तक चुना गया एक पूर्णांक 2 से विभाज्य है। उसके 4 से भी विभाज्य होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{2}{5}\)
- **B.** \(\frac{8}{15}\)
- **C.** \(\frac{7}{15}\)
- **D.** \(\frac{7}{30}\)
- **E.** \(\frac{7}{16}\)

**Correct answer:** C. \(\frac{7}{15}\)

**English-runtime answer value:** \(\frac{7}{15}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — सीमित संख्याएँ हैं 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30।
3. चरण 2 — इनमें से 4, 8, 12, 16, 20, 24, 28 संख्याएँ 4 से विभाज्य हैं। इसलिए प्रायिकता \(\frac{7}{15}\) है।
4. उत्तर — आवश्यक प्रायिकता \(\frac{7}{15}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक बैग में 10 लाल और 4 नीली गेंदें हैं। दो गेंदें बिना वापस रखे निकाली जाती हैं। यदि पहली गेंद लाल है, तो दूसरी गेंद के भी लाल होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{9}{13}\)
- **B.** \(\frac{4}{13}\)
- **C.** \(\frac{9}{14}\)
- **D.** \(\frac{8}{13}\)
- **E.** \(\frac{10}{13}\)

**Correct answer:** A. \(\frac{9}{13}\)

**English-runtime answer value:** \(\frac{9}{13}\)

### Native explanation to review

1. विधि — पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ \(\div\) सीमित कुल स्थितियाँ लें।
2. चरण 1 — शर्त से ज्ञात है कि पहली चुनी गई गेंद लाल थी और उसे वापस नहीं रखा गया।
3. चरण 2 — दूसरे चयन के लिए कुल 13 गेंदों में 9 लाल गेंदें बची हैं।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{9}{13}\) है।
5. मुख्य बिंदु — पहले चयन की जानकारी मिलने के बाद दूसरा चयन केवल बची वस्तुओं में से होता है; इसलिए दोनों बची संख्याओं का उपयोग करें।
6. उत्तर — आवश्यक प्रायिकता \(\frac{9}{13}\) है।

### English explanation authority

1. Method — First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases \(\div\) restricted total.
2. Step 1 — The condition tells us that the first selected ball was red and was not replaced.
3. Step 2 — 9 red balls remain among 13 balls for the second selection.
4. Step 3 — The required probability is \(\frac{9}{13}\).
5. Key point — After the known first draw, the second draw is made only from the remaining objects, so both remaining counts must be used.
6. Answer — The required probability is \(\frac{9}{13}\).

**Native visuals:**
- **SUCCESSIVE_DRAW_TREE** — दो चरणों का प्रायिकता वृक्ष
  - Alt: दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

7 पुरुषों और 6 महिलाओं में से 3 सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में ठीक 1 महिला होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{21}{286}\)
- **B.** \(\frac{62}{143}\)
- **C.** \(\frac{63}{143}\)
- **D.** \(\frac{80}{143}\)
- **E.** \(\frac{64}{143}\)

**Correct answer:** C. \(\frac{63}{143}\)

**English-runtime answer value:** \(\frac{63}{143}\)

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — कुल समितियाँ = \(\binom{13}{3}\)।
3. चरण 2 — \(\binom{13}{3}\) = 13!/(3! \(\times\) 10!) = (13 \(\times\) 12 \(\times\) 11)/(3 \(\times\) 2 \(\times\) 1) = 286।
4. चरण 3 — 6 महिलाओं में से 1 चुनने के तरीके: \(\binom{6}{1}\) = 6।
5. चरण 4 — 7 पुरुषों में से 2 चुनने के तरीके: \(\binom{7}{2}\) = 7!/(2! \(\times\) 5!) = (7 \(\times\) 6)/(2 \(\times\) 1) = 21।
6. चरण 5 — आवश्यक समितियाँ = 6 \(\times\) 21 = 126।
7. चरण 6 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{126}{286}\)।
8. सरलीकरण — अंश और हर दोनों को 2 से भाग दें: (126 \(\div\) 2)/(286 \(\div\) 2) = \(\frac{63}{143}\)।
9. मुख्य बिंदु — संचय प्रत्येक समिति को केवल एक बार गिनता है, क्योंकि उन्हीं सदस्यों का क्रम बदलने से नई समिति नहीं बनती।
10. उत्तर — आवश्यक प्रायिकता \(\frac{63}{143}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

8 पुरुषों और 6 महिलाओं में से 4 सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में ठीक 2 महिलाएँ होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{5}{286}\)
- **B.** \(\frac{83}{143}\)
- **C.** \(\frac{60}{143}\)
- **D.** \(\frac{59}{143}\)
- **E.** \(\frac{61}{143}\)

**Correct answer:** C. \(\frac{60}{143}\)

**English-runtime answer value:** \(\frac{60}{143}\)

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — कुल समितियाँ = \(\binom{14}{4}\)।
3. चरण 2 — \(\binom{14}{4}\) = 14!/(4! \(\times\) 10!) = (14 \(\times\) 13 \(\times\) 12 \(\times\) 11)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 1001।
4. चरण 3 — 6 महिलाओं में से 2 चुनने के तरीके: \(\binom{6}{2}\) = 6!/(2! \(\times\) 4!) = (6 \(\times\) 5)/(2 \(\times\) 1) = 15।
5. चरण 4 — 8 पुरुषों में से 2 चुनने के तरीके: \(\binom{8}{2}\) = 8!/(2! \(\times\) 6!) = (8 \(\times\) 7)/(2 \(\times\) 1) = 28।
6. चरण 5 — आवश्यक समितियाँ = 15 \(\times\) 28 = 420।
7. चरण 6 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{420}{1001}\)।
8. सरलीकरण — अंश और हर दोनों को 7 से भाग दें: (420 \(\div\) 7)/(1001 \(\div\) 7) = \(\frac{60}{143}\)।
9. मुख्य बिंदु — संचय प्रत्येक समिति को केवल एक बार गिनता है, क्योंकि उन्हीं सदस्यों का क्रम बदलने से नई समिति नहीं बनती।
10. उत्तर — आवश्यक प्रायिकता \(\frac{60}{143}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

6 अभ्यर्थी यादृच्छिक क्रम में एक पंक्ति में खड़े होते हैं। किसी एक निश्चित अभ्यर्थी के पहले स्थान पर होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{5}{6}\)
- **B.** \(\frac{1}{6}\)
- **C.** \(\frac{1}{3}\)
- **D.** \(\frac{1}{7}\)
- **E.** 0

**Correct answer:** B. \(\frac{1}{6}\)

**English-runtime answer value:** \(\frac{1}{6}\)

### Native explanation to review

1. विधि — सममिति का उपयोग करें: यादृच्छिक कतार में हर अभ्यर्थी के पहले स्थान पर आने की संभावना समान है।
2. चरण 1 — 6 में से प्रत्येक अभ्यर्थी पहले स्थान पर आ सकता है।
3. चरण 2 — इन 6 संभावनाओं में केवल एक में निर्दिष्ट अभ्यर्थी पहले स्थान पर आता है।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{1}{6}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{1}{6}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

5 अभ्यर्थी यादृच्छिक क्रम में एक पंक्ति में खड़े होते हैं। दो निश्चित अभ्यर्थियों के एक-दूसरे के पास होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{2}{5}\)
- **B.** \(\frac{1}{5}\)
- **C.** \(\frac{1}{3}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{3}{5}\)

**Correct answer:** A. \(\frac{2}{5}\)

**English-runtime answer value:** \(\frac{2}{5}\)

### Native explanation to review

1. विधि — n अलग व्यक्तियों की कुल रैखिक व्यवस्थाएँ n! होती हैं। दो निर्दिष्ट व्यक्तियों को साथ रखने के लिए उन्हें एक ब्लॉक मानें और उनके आंतरिक क्रम के लिए 2 से गुणा करें।
2. चरण 1 — कुल व्यवस्थाएँ = 5! = 5 \(\times\) 4 \(\times\) 3 \(\times\) 2 \(\times\) 1 = 120।
3. चरण 2 — सन्निकट व्यवस्थाएँ = 2 \(\times\) 4! = 2 \(\times\) 4 \(\times\) 3 \(\times\) 2 \(\times\) 1 = 48।
4. चरण 3 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{48}{120}\)।
5. सरलीकरण — अंश और हर दोनों को 24 से भाग दें: (48 \(\div\) 24)/(120 \(\div\) 24) = \(\frac{2}{5}\)।
6. मुख्य बिंदु — ब्लॉक के अंदर दोनों निर्दिष्ट व्यक्ति किसी भी क्रम में आ सकते हैं।
7. उत्तर — आवश्यक प्रायिकता \(\frac{2}{5}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

4 अलग-अलग पद 6 पुरुषों और 4 महिलाओं में यादृच्छिक रूप से बाँटे जाते हैं। पहला पद किसी महिला को मिलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{1}{5}\)
- **C.** \(\frac{3}{5}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{2}{5}\)

**Correct answer:** E. \(\frac{2}{5}\)

**English-runtime answer value:** \(\frac{2}{5}\)

### Native explanation to review

1. विधि — पहले पद के लिए सममिति का उपयोग करें। हर व्यक्ति के उस पद पर चुने जाने की संभावना समान है, इसलिए महिलाओं की संख्या की तुलना कुल लोगों की संख्या से करें।
2. चरण 1 — कुल 10 लोग हैं: 6 पुरुष + 4 महिलाएँ = 10।
3. चरण 2 — 10 लोगों में 4 महिलाएँ हैं, इसलिए \(P\!\left(first post goes to a woman\right)\) = \(\frac{4}{10}\)।
4. चरण 3 — \(\frac{4}{10}\) = \(\frac{2}{5}\)।
5. मुख्य बिंदु — बाकी पदों का आवंटन पहले पद की प्रायिकता को नहीं बदलता।
6. उत्तर — आवश्यक प्रायिकता \(\frac{2}{5}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

1 से 5 तक के अंकों का बिना पुनरावृत्ति उपयोग करके 4 अंकों की एक संख्या बनाई जाती है। संख्या के सम होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{2}{5}\)
- **B.** \(\frac{1}{3}\)
- **C.** \(\frac{3}{5}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{1}{5}\)

**Correct answer:** A. \(\frac{2}{5}\)

**English-runtime answer value:** \(\frac{2}{5}\)

### Native explanation to review

1. विधि — स्थान का क्रम महत्वपूर्ण है, इसलिए क्रमचय का उपयोग करें। सम संख्या के लिए पहले इकाई स्थान पर सम अंक तय करें, फिर बाकी अंकों को व्यवस्थित करें।
2. चरण 1 — कुल 4-अंकीय संख्याएँ = 5P4 = 5!/1! = 5 \(\times\) 4 \(\times\) 3 \(\times\) 2 = 120।
3. चरण 2 — इकाई स्थान के लिए 2 सम अंकों के विकल्प हैं। इसे तय करने के बाद बाकी 3 स्थानों को 4P3 = 4!/1! = 4 \(\times\) 3 \(\times\) 2 = 24 तरीकों से भरा जा सकता है।
4. चरण 3 — अनुकूल सम संख्याएँ = 2 \(\times\) 24 = 48।
5. चरण 4 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{48}{120}\)।
6. सरलीकरण — अंश और हर दोनों को 24 से भाग दें: (48 \(\div\) 24)/(120 \(\div\) 24) = \(\frac{2}{5}\)।
7. मुख्य बिंदु — इकाई अंक तय हो जाने के बाद उसे अन्य स्थानों पर दोबारा उपयोग नहीं किया जा सकता।
8. उत्तर — आवश्यक प्रायिकता \(\frac{2}{5}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

5 पुरुषों और 6 महिलाओं में से 4 सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में कम-से-कम एक महिला होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{65}{1584}\)
- **B.** \(\frac{32}{33}\)
- **C.** 1
- **D.** \(\frac{1}{66}\)
- **E.** \(\frac{65}{66}\)

**Correct answer:** E. \(\frac{65}{66}\)

**English-runtime answer value:** \(\frac{65}{66}\)

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — कुल समितियाँ = \(\binom{11}{4}\)।
3. चरण 2 — \(\binom{11}{4}\) = 11!/(4! \(\times\) 7!) = (11 \(\times\) 10 \(\times\) 9 \(\times\) 8)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 330।
4. चरण 3 — पूरक घटना का उपयोग करें। जिस समिति में कोई महिला नहीं है, वह केवल पुरुषों की समिति होगी: \(\binom{5}{4}\) = 5।
5. चरण 4 — कम-से-कम एक महिला वाली समितियाँ = 330 - 5 = 325।
6. चरण 5 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{325}{330}\)।
7. सरलीकरण — अंश और हर दोनों को 5 से भाग दें: (325 \(\div\) 5)/(330 \(\div\) 5) = \(\frac{65}{66}\)।
8. मुख्य बिंदु — संचय प्रत्येक समिति को केवल एक बार गिनता है, क्योंकि उन्हीं सदस्यों का क्रम बदलने से नई समिति नहीं बनती।
9. उत्तर — आवश्यक प्रायिकता \(\frac{65}{66}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

6 पुरुषों और 9 महिलाओं में से 4 सदस्यों की एक समिति बनाई जाती है। ऐसी कितनी समितियाँ बनाई जा सकती हैं जिनमें ठीक 1 महिला हो?

### Options

- **A.** 181
- **B.** 179
- **C.** 180
- **D.** 182
- **E.** 178

**Correct answer:** C. 180

**English-runtime answer value:** 180

### Native explanation to review

1. विधि — समिति में क्रम महत्वपूर्ण नहीं होता। आवश्यक महिलाओं और पुरुषों को अलग-अलग संचय से चुनें और दोनों चयन के तरीकों को गुणा करें।
2. चरण 1 — 1 महिला चुनने के तरीके: \(\binom{9}{1}\) = 9।
3. चरण 2 — 3 पुरुष चुनने के तरीके: \(\binom{6}{3}\) = 6!/(3! \(\times\) 3!) = (6 \(\times\) 5 \(\times\) 4)/(3 \(\times\) 2 \(\times\) 1) = 20।
4. चरण 3 — आवश्यक समितियाँ = 9 \(\times\) 20 = 180।
5. मुख्य बिंदु — यहाँ कुल समितियों की संख्या से भाग देने की आवश्यकता नहीं है, क्योंकि प्रश्न प्रायिकता नहीं बल्कि समितियों की संख्या पूछता है।
6. उत्तर — आवश्यक समितियों की संख्या 180 है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

9 पुरुषों और 9 महिलाओं में से 3 सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में ठीक 1 महिला होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{27}{68}\)
- **B.** \(\frac{41}{68}\)
- **C.** \(\frac{7}{17}\)
- **D.** \(\frac{13}{34}\)
- **E.** \(\frac{9}{136}\)

**Correct answer:** A. \(\frac{27}{68}\)

**English-runtime answer value:** \(\frac{27}{68}\)

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — कुल समितियाँ = \(\binom{18}{3}\)।
3. चरण 2 — \(\binom{18}{3}\) = 18!/(3! \(\times\) 15!) = (18 \(\times\) 17 \(\times\) 16)/(3 \(\times\) 2 \(\times\) 1) = 816।
4. चरण 3 — 9 महिलाओं में से 1 चुनने के तरीके: \(\binom{9}{1}\) = 9।
5. चरण 4 — 9 पुरुषों में से 2 चुनने के तरीके: \(\binom{9}{2}\) = 9!/(2! \(\times\) 7!) = (9 \(\times\) 8)/(2 \(\times\) 1) = 36।
6. चरण 5 — आवश्यक समितियाँ = 9 \(\times\) 36 = 324।
7. चरण 6 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{324}{816}\)।
8. सरलीकरण — अंश और हर दोनों को 12 से भाग दें: (324 \(\div\) 12)/(816 \(\div\) 12) = \(\frac{27}{68}\)।
9. मुख्य बिंदु — संचय प्रत्येक समिति को केवल एक बार गिनता है, क्योंकि उन्हीं सदस्यों का क्रम बदलने से नई समिति नहीं बनती।
10. उत्तर — आवश्यक प्रायिकता \(\frac{27}{68}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

5 पुरुषों और 5 महिलाओं में से 4 सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में ठीक 2 महिलाएँ होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{5}{11}\)
- **B.** \(\frac{3}{7}\)
- **C.** \(\frac{10}{21}\)
- **D.** \(\frac{11}{21}\)
- **E.** \(\frac{5}{252}\)

**Correct answer:** C. \(\frac{10}{21}\)

**English-runtime answer value:** \(\frac{10}{21}\)

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — कुल समितियाँ = \(\binom{10}{4}\)।
3. चरण 2 — \(\binom{10}{4}\) = 10!/(4! \(\times\) 6!) = (10 \(\times\) 9 \(\times\) 8 \(\times\) 7)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 210।
4. चरण 3 — 5 महिलाओं में से 2 चुनने के तरीके: \(\binom{5}{2}\) = 5!/(2! \(\times\) 3!) = (5 \(\times\) 4)/(2 \(\times\) 1) = 10।
5. चरण 4 — 5 पुरुषों में से 2 चुनने के तरीके: \(\binom{5}{2}\) = 5!/(2! \(\times\) 3!) = (5 \(\times\) 4)/(2 \(\times\) 1) = 10।
6. चरण 5 — आवश्यक समितियाँ = 10 \(\times\) 10 = 100।
7. चरण 6 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{100}{210}\)।
8. सरलीकरण — अंश और हर दोनों को 10 से भाग दें: (100 \(\div\) 10)/(210 \(\div\) 10) = \(\frac{10}{21}\)।
9. मुख्य बिंदु — संचय प्रत्येक समिति को केवल एक बार गिनता है, क्योंकि उन्हीं सदस्यों का क्रम बदलने से नई समिति नहीं बनती।
10. उत्तर — आवश्यक प्रायिकता \(\frac{10}{21}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

6 अभ्यर्थी यादृच्छिक क्रम में एक पंक्ति में खड़े होते हैं। किसी एक निश्चित अभ्यर्थी के पहले स्थान पर होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{5}{6}\)
- **C.** \(\frac{1}{7}\)
- **D.** \(\frac{1}{6}\)
- **E.** 0

**Correct answer:** D. \(\frac{1}{6}\)

**English-runtime answer value:** \(\frac{1}{6}\)

### Native explanation to review

1. विधि — सममिति का उपयोग करें: यादृच्छिक कतार में हर अभ्यर्थी के पहले स्थान पर आने की संभावना समान है।
2. चरण 1 — 6 में से प्रत्येक अभ्यर्थी पहले स्थान पर आ सकता है।
3. चरण 2 — इन 6 संभावनाओं में केवल एक में निर्दिष्ट अभ्यर्थी पहले स्थान पर आता है।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{1}{6}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{1}{6}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

6 अभ्यर्थी यादृच्छिक क्रम में एक पंक्ति में खड़े होते हैं। दो निश्चित अभ्यर्थियों के एक-दूसरे के पास न होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{2}{3}\)
- **C.** \(\frac{1}{2}\)
- **D.** 1
- **E.** \(\frac{481}{720}\)

**Correct answer:** B. \(\frac{2}{3}\)

**English-runtime answer value:** \(\frac{2}{3}\)

### Native explanation to review

1. विधि — n अलग व्यक्तियों की कुल रैखिक व्यवस्थाएँ n! होती हैं। दो निर्दिष्ट व्यक्तियों को साथ रखने के लिए उन्हें एक ब्लॉक मानें और उनके आंतरिक क्रम के लिए 2 से गुणा करें।
2. चरण 1 — कुल व्यवस्थाएँ = 6! = 6 \(\times\) 5 \(\times\) 4 \(\times\) 3 \(\times\) 2 \(\times\) 1 = 720।
3. चरण 2 — सन्निकट व्यवस्थाएँ = 2 \(\times\) 5! = 2 \(\times\) 5 \(\times\) 4 \(\times\) 3 \(\times\) 2 \(\times\) 1 = 240।
4. चरण 3 — असन्निकट व्यवस्थाएँ = 720 - 240 = 480।
5. चरण 4 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{480}{720}\)।
6. सरलीकरण — अंश और हर दोनों को 240 से भाग दें: (480 \(\div\) 240)/(720 \(\div\) 240) = \(\frac{2}{3}\)।
7. मुख्य बिंदु — ब्लॉक के अंदर दोनों निर्दिष्ट व्यक्ति किसी भी क्रम में आ सकते हैं।
8. उत्तर — आवश्यक प्रायिकता \(\frac{2}{3}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

4 अलग-अलग पद 7 पुरुषों और 8 महिलाओं में यादृच्छिक रूप से बाँटे जाते हैं। पहला पद किसी महिला को मिलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{3}{5}\)
- **B.** \(\frac{7}{15}\)
- **C.** \(\frac{8}{15}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{4}{7}\)

**Correct answer:** C. \(\frac{8}{15}\)

**English-runtime answer value:** \(\frac{8}{15}\)

### Native explanation to review

1. विधि — पहले सभी व्यवस्थाएँ गिनें, फिर वे व्यवस्थाएँ गिनें जिनमें निर्दिष्ट व्यक्ति अनुमत स्थानों में से किसी एक पर हो।
2. चरण 1 — 15 लोगों में से कोई भी पहला पद प्राप्त कर सकता है।
3. चरण 2 — इन 15 लोगों में 8 महिलाएँ हैं। बाकी पदों का आवंटन इस बात को प्रभावित नहीं करता कि पहला पद किसे मिलता है।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{8}{15}\) है।
5. मुख्य बिंदु — यह प्रायिकता सही है क्योंकि प्रत्येक मान्य व्यवस्था को समान रूप से संभावित माना गया है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{8}{15}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

1 से 9 तक के अंकों का बिना पुनरावृत्ति उपयोग करके 4 अंकों की एक संख्या बनाई जाती है। संख्या के सम होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{3}\)
- **B.** \(\frac{1}{2}\)
- **C.** \(\frac{2}{5}\)
- **D.** \(\frac{4}{9}\)
- **E.** \(\frac{5}{9}\)

**Correct answer:** D. \(\frac{4}{9}\)

**English-runtime answer value:** \(\frac{4}{9}\)

### Native explanation to review

1. विधि — स्थान का क्रम महत्वपूर्ण है, इसलिए क्रमचय का उपयोग करें। सम संख्या के लिए पहले इकाई स्थान पर सम अंक तय करें, फिर बाकी अंकों को व्यवस्थित करें।
2. चरण 1 — कुल 4-अंकीय संख्याएँ = 9P4 = 9!/5! = 9 \(\times\) 8 \(\times\) 7 \(\times\) 6 = 3024।
3. चरण 2 — इकाई स्थान के लिए 4 सम अंकों के विकल्प हैं। इसे तय करने के बाद बाकी 3 स्थानों को 8P3 = 8!/5! = 8 \(\times\) 7 \(\times\) 6 = 336 तरीकों से भरा जा सकता है।
4. चरण 3 — अनुकूल सम संख्याएँ = 4 \(\times\) 336 = 1344।
5. चरण 4 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{1344}{3024}\)।
6. सरलीकरण — अंश और हर दोनों को 336 से भाग दें: (1344 \(\div\) 336)/(3024 \(\div\) 336) = \(\frac{4}{9}\)।
7. मुख्य बिंदु — इकाई अंक तय हो जाने के बाद उसे अन्य स्थानों पर दोबारा उपयोग नहीं किया जा सकता।
8. उत्तर — आवश्यक प्रायिकता \(\frac{4}{9}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

5 पुरुषों और 9 महिलाओं में से 4 सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में कम-से-कम एक महिला होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{995}{1001}\)
- **B.** \(\frac{996}{1001}\)
- **C.** \(\frac{5}{1001}\)
- **D.** \(\frac{997}{1001}\)
- **E.** \(\frac{83}{2002}\)

**Correct answer:** B. \(\frac{996}{1001}\)

**English-runtime answer value:** \(\frac{996}{1001}\)

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — कुल समितियाँ = \(\binom{14}{4}\)।
3. चरण 2 — \(\binom{14}{4}\) = 14!/(4! \(\times\) 10!) = (14 \(\times\) 13 \(\times\) 12 \(\times\) 11)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 1001।
4. चरण 3 — पूरक घटना का उपयोग करें। जिस समिति में कोई महिला नहीं है, वह केवल पुरुषों की समिति होगी: \(\binom{5}{4}\) = 5।
5. चरण 4 — कम-से-कम एक महिला वाली समितियाँ = 1001 - 5 = 996।
6. चरण 5 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{996}{1001}\)।
7. मुख्य बिंदु — संचय प्रत्येक समिति को केवल एक बार गिनता है, क्योंकि उन्हीं सदस्यों का क्रम बदलने से नई समिति नहीं बनती।
8. उत्तर — आवश्यक प्रायिकता \(\frac{996}{1001}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

7 पुरुषों और 6 महिलाओं में से 4 सदस्यों की एक समिति बनाई जाती है। समिति में ठीक 1 महिला होने की प्रायिकता \(\frac{42}{143}\) है। ऐसी कितनी समितियाँ बनाई जा सकती हैं?

### Options

- **A.** 211
- **B.** 210
- **C.** 209
- **D.** 212
- **E.** 208

**Correct answer:** B. 210

**English-runtime answer value:** 210

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — 6 महिलाओं में से 1 चुनने के तरीके: \(\binom{6}{1}\) = 6।
3. चरण 2 — 7 पुरुषों में से 3 चुनने के तरीके: \(\binom{7}{3}\) = 7!/(3! \(\times\) 4!) = (7 \(\times\) 6 \(\times\) 5)/(3 \(\times\) 2 \(\times\) 1) = 35।
4. चरण 3 — आवश्यक समितियाँ = 6 \(\times\) 35 = 210।
5. मुख्य बिंदु — समिति के सदस्यों को किस क्रम में लिखा गया है, इससे फर्क नहीं पड़ता; इसलिए प्रत्येक समिति को केवल एक बार गिनें।
6. उत्तर — आवश्यक संख्या 210 है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

6 पुरुषों और 7 महिलाओं में से 3 सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में ठीक 1 महिला होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{35}{572}\)
- **B.** \(\frac{105}{286}\)
- **C.** \(\frac{53}{143}\)
- **D.** \(\frac{181}{286}\)
- **E.** \(\frac{4}{11}\)

**Correct answer:** B. \(\frac{105}{286}\)

**English-runtime answer value:** \(\frac{105}{286}\)

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — कुल समितियाँ = \(\binom{13}{3}\)।
3. चरण 2 — \(\binom{13}{3}\) = 13!/(3! \(\times\) 10!) = (13 \(\times\) 12 \(\times\) 11)/(3 \(\times\) 2 \(\times\) 1) = 286।
4. चरण 3 — 7 महिलाओं में से 1 चुनने के तरीके: \(\binom{7}{1}\) = 7।
5. चरण 4 — 6 पुरुषों में से 2 चुनने के तरीके: \(\binom{6}{2}\) = 6!/(2! \(\times\) 4!) = (6 \(\times\) 5)/(2 \(\times\) 1) = 15।
6. चरण 5 — आवश्यक समितियाँ = 7 \(\times\) 15 = 105।
7. चरण 6 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{105}{286}\)।
8. मुख्य बिंदु — संचय प्रत्येक समिति को केवल एक बार गिनता है, क्योंकि उन्हीं सदस्यों का क्रम बदलने से नई समिति नहीं बनती।
9. उत्तर — आवश्यक प्रायिकता \(\frac{105}{286}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

6 पुरुषों और 9 महिलाओं में से 4 सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में ठीक 2 महिलाएँ होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{55}{91}\)
- **B.** \(\frac{37}{91}\)
- **C.** \(\frac{5}{13}\)
- **D.** \(\frac{3}{182}\)
- **E.** \(\frac{36}{91}\)

**Correct answer:** E. \(\frac{36}{91}\)

**English-runtime answer value:** \(\frac{36}{91}\)

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — कुल समितियाँ = \(\binom{15}{4}\)।
3. चरण 2 — \(\binom{15}{4}\) = 15!/(4! \(\times\) 11!) = (15 \(\times\) 14 \(\times\) 13 \(\times\) 12)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 1365।
4. चरण 3 — 9 महिलाओं में से 2 चुनने के तरीके: \(\binom{9}{2}\) = 9!/(2! \(\times\) 7!) = (9 \(\times\) 8)/(2 \(\times\) 1) = 36।
5. चरण 4 — 6 पुरुषों में से 2 चुनने के तरीके: \(\binom{6}{2}\) = 6!/(2! \(\times\) 4!) = (6 \(\times\) 5)/(2 \(\times\) 1) = 15।
6. चरण 5 — आवश्यक समितियाँ = 36 \(\times\) 15 = 540।
7. चरण 6 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{540}{1365}\)।
8. सरलीकरण — अंश और हर दोनों को 15 से भाग दें: (540 \(\div\) 15)/(1365 \(\div\) 15) = \(\frac{36}{91}\)।
9. मुख्य बिंदु — संचय प्रत्येक समिति को केवल एक बार गिनता है, क्योंकि उन्हीं सदस्यों का क्रम बदलने से नई समिति नहीं बनती।
10. उत्तर — आवश्यक प्रायिकता \(\frac{36}{91}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

6 अभ्यर्थी यादृच्छिक क्रम में एक पंक्ति में खड़े होते हैं। किसी एक निश्चित अभ्यर्थी के पहले स्थान पर होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{6}\)
- **B.** \(\frac{1}{7}\)
- **C.** \(\frac{1}{3}\)
- **D.** 0
- **E.** \(\frac{5}{6}\)

**Correct answer:** A. \(\frac{1}{6}\)

**English-runtime answer value:** \(\frac{1}{6}\)

### Native explanation to review

1. विधि — सममिति का उपयोग करें: यादृच्छिक कतार में हर अभ्यर्थी के पहले स्थान पर आने की संभावना समान है।
2. चरण 1 — 6 में से प्रत्येक अभ्यर्थी पहले स्थान पर आ सकता है।
3. चरण 2 — इन 6 संभावनाओं में केवल एक में निर्दिष्ट अभ्यर्थी पहले स्थान पर आता है।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{1}{6}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{1}{6}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

6 अभ्यर्थी यादृच्छिक क्रम में एक पंक्ति में खड़े होते हैं। दो निश्चित अभ्यर्थियों के एक-दूसरे के पास न होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{2}{3}\)
- **B.** \(\frac{481}{720}\)
- **C.** \(\frac{1}{3}\)
- **D.** 1
- **E.** \(\frac{1}{2}\)

**Correct answer:** A. \(\frac{2}{3}\)

**English-runtime answer value:** \(\frac{2}{3}\)

### Native explanation to review

1. विधि — n अलग व्यक्तियों की कुल रैखिक व्यवस्थाएँ n! होती हैं। दो निर्दिष्ट व्यक्तियों को साथ रखने के लिए उन्हें एक ब्लॉक मानें और उनके आंतरिक क्रम के लिए 2 से गुणा करें।
2. चरण 1 — कुल व्यवस्थाएँ = 6! = 6 \(\times\) 5 \(\times\) 4 \(\times\) 3 \(\times\) 2 \(\times\) 1 = 720।
3. चरण 2 — सन्निकट व्यवस्थाएँ = 2 \(\times\) 5! = 2 \(\times\) 5 \(\times\) 4 \(\times\) 3 \(\times\) 2 \(\times\) 1 = 240।
4. चरण 3 — असन्निकट व्यवस्थाएँ = 720 - 240 = 480।
5. चरण 4 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{480}{720}\)।
6. सरलीकरण — अंश और हर दोनों को 240 से भाग दें: (480 \(\div\) 240)/(720 \(\div\) 240) = \(\frac{2}{3}\)।
7. मुख्य बिंदु — ब्लॉक के अंदर दोनों निर्दिष्ट व्यक्ति किसी भी क्रम में आ सकते हैं।
8. उत्तर — आवश्यक प्रायिकता \(\frac{2}{3}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

4 अलग-अलग पद 5 पुरुषों और 8 महिलाओं में यादृच्छिक रूप से बाँटे जाते हैं। पहला पद किसी महिला को मिलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{4}{7}\)
- **B.** \(\frac{5}{13}\)
- **C.** \(\frac{8}{13}\)
- **D.** \(\frac{9}{13}\)
- **E.** \(\frac{7}{13}\)

**Correct answer:** C. \(\frac{8}{13}\)

**English-runtime answer value:** \(\frac{8}{13}\)

### Native explanation to review

1. विधि — पहले सभी व्यवस्थाएँ गिनें, फिर वे व्यवस्थाएँ गिनें जिनमें निर्दिष्ट व्यक्ति अनुमत स्थानों में से किसी एक पर हो।
2. चरण 1 — 13 लोगों में से कोई भी पहला पद प्राप्त कर सकता है।
3. चरण 2 — इन 13 लोगों में 8 महिलाएँ हैं। बाकी पदों का आवंटन इस बात को प्रभावित नहीं करता कि पहला पद किसे मिलता है।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{8}{13}\) है।
5. मुख्य बिंदु — यह प्रायिकता सही है क्योंकि प्रत्येक मान्य व्यवस्था को समान रूप से संभावित माना गया है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{8}{13}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

1 से 8 तक के अंकों का बिना पुनरावृत्ति उपयोग करके 4 अंकों की एक संख्या बनाई जाती है। संख्या के सम होने की प्रायिकता क्या है?

### Options

- **A.** 0
- **B.** \(\frac{1}{3}\)
- **C.** \(\frac{841}{1680}\)
- **D.** 1
- **E.** \(\frac{1}{2}\)

**Correct answer:** E. \(\frac{1}{2}\)

**English-runtime answer value:** \(\frac{1}{2}\)

### Native explanation to review

1. विधि — स्थान का क्रम महत्वपूर्ण है, इसलिए क्रमचय का उपयोग करें। सम संख्या के लिए पहले इकाई स्थान पर सम अंक तय करें, फिर बाकी अंकों को व्यवस्थित करें।
2. चरण 1 — कुल 4-अंकीय संख्याएँ = 8P4 = 8!/4! = 8 \(\times\) 7 \(\times\) 6 \(\times\) 5 = 1680।
3. चरण 2 — इकाई स्थान के लिए 4 सम अंकों के विकल्प हैं। इसे तय करने के बाद बाकी 3 स्थानों को 7P3 = 7!/4! = 7 \(\times\) 6 \(\times\) 5 = 210 तरीकों से भरा जा सकता है।
4. चरण 3 — अनुकूल सम संख्याएँ = 4 \(\times\) 210 = 840।
5. चरण 4 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{840}{1680}\)।
6. सरलीकरण — अंश और हर दोनों को 840 से भाग दें: (840 \(\div\) 840)/(1680 \(\div\) 840) = \(\frac{1}{2}\)।
7. मुख्य बिंदु — इकाई अंक तय हो जाने के बाद उसे अन्य स्थानों पर दोबारा उपयोग नहीं किया जा सकता।
8. उत्तर — आवश्यक प्रायिकता \(\frac{1}{2}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

10 पुरुषों और 9 महिलाओं में से 4 सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में कम-से-कम एक महिला होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{35}{646}\)
- **B.** \(\frac{611}{646}\)
- **C.** \(\frac{611}{15504}\)
- **D.** \(\frac{305}{323}\)
- **E.** \(\frac{18}{19}\)

**Correct answer:** B. \(\frac{611}{646}\)

**English-runtime answer value:** \(\frac{611}{646}\)

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — कुल समितियाँ = \(\binom{19}{4}\)।
3. चरण 2 — \(\binom{19}{4}\) = 19!/(4! \(\times\) 15!) = (19 \(\times\) 18 \(\times\) 17 \(\times\) 16)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 3876।
4. चरण 3 — पूरक घटना का उपयोग करें। जिस समिति में कोई महिला नहीं है, वह केवल पुरुषों की समिति होगी: \(\binom{10}{4}\) = 10!/(4! \(\times\) 6!) = (10 \(\times\) 9 \(\times\) 8 \(\times\) 7)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 210।
5. चरण 4 — कम-से-कम एक महिला वाली समितियाँ = 3876 - 210 = 3666।
6. चरण 5 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{3666}{3876}\)।
7. सरलीकरण — अंश और हर दोनों को 6 से भाग दें: (3666 \(\div\) 6)/(3876 \(\div\) 6) = \(\frac{611}{646}\)।
8. मुख्य बिंदु — संचय प्रत्येक समिति को केवल एक बार गिनता है, क्योंकि उन्हीं सदस्यों का क्रम बदलने से नई समिति नहीं बनती।
9. उत्तर — आवश्यक प्रायिकता \(\frac{611}{646}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

7 पुरुषों और 4 महिलाओं में से 4 सदस्यों की एक समिति बनाई जाती है। समिति में ठीक 1 महिला होने की प्रायिकता \(\frac{14}{33}\) है। ऐसी कितनी समितियाँ बनाई जा सकती हैं?

### Options

- **A.** 140
- **B.** 142
- **C.** 141
- **D.** 138
- **E.** 139

**Correct answer:** A. 140

**English-runtime answer value:** 140

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — 4 महिलाओं में से 1 चुनने के तरीके: \(\binom{4}{1}\) = 4।
3. चरण 2 — 7 पुरुषों में से 3 चुनने के तरीके: \(\binom{7}{3}\) = 7!/(3! \(\times\) 4!) = (7 \(\times\) 6 \(\times\) 5)/(3 \(\times\) 2 \(\times\) 1) = 35।
4. चरण 3 — आवश्यक समितियाँ = 4 \(\times\) 35 = 140।
5. मुख्य बिंदु — समिति के सदस्यों को किस क्रम में लिखा गया है, इससे फर्क नहीं पड़ता; इसलिए प्रत्येक समिति को केवल एक बार गिनें।
6. उत्तर — आवश्यक संख्या 140 है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

7 पुरुषों और 6 महिलाओं में से 3 सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में ठीक 1 महिला होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{80}{143}\)
- **B.** \(\frac{63}{143}\)
- **C.** \(\frac{64}{143}\)
- **D.** \(\frac{62}{143}\)
- **E.** \(\frac{21}{286}\)

**Correct answer:** B. \(\frac{63}{143}\)

**English-runtime answer value:** \(\frac{63}{143}\)

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — कुल समितियाँ = \(\binom{13}{3}\)।
3. चरण 2 — \(\binom{13}{3}\) = 13!/(3! \(\times\) 10!) = (13 \(\times\) 12 \(\times\) 11)/(3 \(\times\) 2 \(\times\) 1) = 286।
4. चरण 3 — 6 महिलाओं में से 1 चुनने के तरीके: \(\binom{6}{1}\) = 6।
5. चरण 4 — 7 पुरुषों में से 2 चुनने के तरीके: \(\binom{7}{2}\) = 7!/(2! \(\times\) 5!) = (7 \(\times\) 6)/(2 \(\times\) 1) = 21।
6. चरण 5 — आवश्यक समितियाँ = 6 \(\times\) 21 = 126।
7. चरण 6 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{126}{286}\)।
8. सरलीकरण — अंश और हर दोनों को 2 से भाग दें: (126 \(\div\) 2)/(286 \(\div\) 2) = \(\frac{63}{143}\)।
9. मुख्य बिंदु — संचय प्रत्येक समिति को केवल एक बार गिनता है, क्योंकि उन्हीं सदस्यों का क्रम बदलने से नई समिति नहीं बनती।
10. उत्तर — आवश्यक प्रायिकता \(\frac{63}{143}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

10 पुरुषों और 5 महिलाओं में से 4 सदस्यों की एक समिति यादृच्छिक रूप से बनाई जाती है। समिति में ठीक 3 महिलाएँ होने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{19}{273}\)
- **B.** \(\frac{5}{1638}\)
- **C.** \(\frac{253}{273}\)
- **D.** \(\frac{20}{273}\)
- **E.** \(\frac{1}{13}\)

**Correct answer:** D. \(\frac{20}{273}\)

**English-runtime answer value:** \(\frac{20}{273}\)

### Native explanation to review

1. विधि — समिति का चयन क्रमरहित होता है। इसलिए \(\binom{n}{r}\) = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।
2. चरण 1 — कुल समितियाँ = \(\binom{15}{4}\)।
3. चरण 2 — \(\binom{15}{4}\) = 15!/(4! \(\times\) 11!) = (15 \(\times\) 14 \(\times\) 13 \(\times\) 12)/(4 \(\times\) 3 \(\times\) 2 \(\times\) 1) = 1365।
4. चरण 3 — 5 महिलाओं में से 3 चुनने के तरीके: \(\binom{5}{3}\) = 5!/(3! \(\times\) 2!) = (5 \(\times\) 4)/(2 \(\times\) 1) = 10।
5. चरण 4 — 10 पुरुषों में से 1 चुनने के तरीके: \(\binom{10}{1}\) = 10।
6. चरण 5 — आवश्यक समितियाँ = 10 \(\times\) 10 = 100।
7. चरण 6 — प्रायिकता = अनुकूल स्थितियाँ \(\div\) कुल स्थितियाँ = \(\frac{100}{1365}\)।
8. सरलीकरण — अंश और हर दोनों को 5 से भाग दें: (100 \(\div\) 5)/(1365 \(\div\) 5) = \(\frac{20}{273}\)।
9. मुख्य बिंदु — संचय प्रत्येक समिति को केवल एक बार गिनता है, क्योंकि उन्हीं सदस्यों का क्रम बदलने से नई समिति नहीं बनती।
10. उत्तर — आवश्यक प्रायिकता \(\frac{20}{273}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

100 अभ्यर्थियों के एक समूह में 31 क्वांटिटेटिव एप्टीट्यूड में उत्तीर्ण हैं, 20 रीजनिंग में उत्तीर्ण हैं और 10 दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए अभ्यर्थी के कम-से-कम एक शर्त को पूरा करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{21}{50}\)
- **B.** \(\frac{59}{100}\)
- **C.** \(\frac{2}{5}\)
- **D.** \(\frac{41}{100}\)
- **E.** \(\frac{51}{100}\)

**Correct answer:** D. \(\frac{41}{100}\)

**English-runtime answer value:** \(\frac{41}{100}\)

### Native explanation to review

1. विधि — समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।
2. चरण 1 — n(A \(\cup\) B) = n(A) + n(B) - n(A \(\cap\) B) का उपयोग करें, क्योंकि दोनों समूहों में आने वाले 10 लोग अन्यथा दो बार गिने जाते।
3. चरण 2 — आवश्यक लोग = 31 + 20 - 10 = 41।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{41}{100}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{41}{100}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — Use n(A \(\cup\) B) = n(A) + n(B) - n(A \(\cap\) B), because the 10 people in both groups would otherwise be counted twice.
3. Step 2 — Required people = 31 + 20 - 10 = 41.
4. Step 3 — The required probability is \(\frac{41}{100}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{41}{100}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें घटनाओं का संघ से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

84 विद्यार्थियों के एक समूह में 10 विद्यार्थी क्रिकेट और फुटबॉल दोनों खेलते हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के दोनों खेल खेलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{37}{42}\)
- **B.** \(\frac{5}{42}\)
- **C.** \(\frac{1}{7}\)
- **D.** \(\frac{5}{43}\)
- **E.** \(\frac{2}{21}\)

**Correct answer:** B. \(\frac{5}{42}\)

**English-runtime answer value:** \(\frac{5}{42}\)

### Native explanation to review

1. विधि — आवश्यक घटना दोनों समूहों का साझा भाग है; उसकी संख्या की तुलना पूरे समूह से करें।
2. चरण 1 — प्रतिच्छेद उन लोगों को दर्शाता है जो क्रिकेट और फुटबॉल दोनों की शर्त पूरी करते हैं।
3. चरण 2 — प्रश्न में यह साझा भाग सीधे 84 में से 10 दिया गया है।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{10}{84}\) = \(\frac{5}{42}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{5}{42}\) है।

### English explanation authority

1. Method — The required event is the overlap of the two groups; compare that overlap with the complete group.
2. Step 1 — The intersection means the people who satisfy both cricket and football.
3. Step 2 — The question gives this overlap directly as 10 out of 84.
4. Step 3 — The required probability is \(\frac{10}{84}\) = \(\frac{5}{42}\).
5. Answer — The required probability is \(\frac{5}{42}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें घटनाओं का प्रतिच्छेद से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

61 अभ्यर्थियों के एक समूह में 31 सेक्शन A में उत्तीर्ण हैं, 34 सेक्शन B में उत्तीर्ण हैं और 12 दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए अभ्यर्थी के ठीक एक शर्त को पूरा करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{40}{61}\)
- **B.** \(\frac{41}{61}\)
- **C.** \(\frac{42}{61}\)
- **D.** \(\frac{20}{61}\)
- **E.** \(\frac{53}{61}\)

**Correct answer:** B. \(\frac{41}{61}\)

**English-runtime answer value:** \(\frac{41}{61}\)

### Native explanation to review

1. विधि — समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।
2. चरण 1 — ठीक एक शर्त पूरी करने वालों के लिए साझा भाग को दोनों समूहों से एक-एक बार हटाएँ।
3. चरण 2 — आवश्यक लोग = 31 + 34 - 2 \(\times\) 12 = 41।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{41}{61}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{41}{61}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — For exactly one condition, remove the overlap once from each group.
3. Step 2 — Required people = 31 + 34 - 2 \(\times\) 12 = 41.
4. Step 3 — The required probability is \(\frac{41}{61}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{41}{61}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें दो घटनाओं में ठीक एक से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

77 विद्यार्थियों के एक समूह में 32 गणित में उत्तीर्ण हैं, 36 अंग्रेज़ी में उत्तीर्ण हैं और 7 दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के किसी भी शर्त को पूरा न करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{17}{77}\)
- **B.** \(\frac{16}{77}\)
- **C.** \(\frac{68}{77}\)
- **D.** \(\frac{61}{77}\)
- **E.** \(\frac{15}{77}\)

**Correct answer:** B. \(\frac{16}{77}\)

**English-runtime answer value:** \(\frac{16}{77}\)

### Native explanation to review

1. विधि — पहले समावेशन–बहिष्करण से कम-से-कम एक समूह में आने वालों की संख्या ज्ञात करें, फिर उसे कुल से घटाएँ।
2. चरण 1 — पहले कम-से-कम एक शर्त पूरी करने वालों की संख्या ज्ञात करें: 32 + 36 - 7 = 61।
3. चरण 2 — किसी भी शर्त को पूरा न करने वाले लोगों की संख्या = 77 - 61 = 16।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{16}{77}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{16}{77}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion to find those in at least one group, then subtract that count from the total.
2. Step 1 — First find those satisfying at least one condition: 32 + 36 - 7 = 61.
3. Step 2 — People satisfying neither condition = 77 - 61 = 16.
4. Step 3 — The required probability is \(\frac{16}{77}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{16}{77}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें न A न B से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक अभ्यर्थी को छात्रवृत्ति A या छात्रवृत्ति B में से कोई एक मिल सकती है, दोनों नहीं। यदि \(P\!\left(A\right)\) = \(\frac{3}{10}\) और \(P\!\left(B\right)\) = \(\frac{1}{10}\) है, तो अभ्यर्थी को कोई छात्रवृत्ति मिलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{5}\)
- **B.** \(\frac{2}{5}\)
- **C.** \(\frac{3}{5}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{1}{3}\)

**Correct answer:** B. \(\frac{2}{5}\)

**English-runtime answer value:** \(\frac{2}{5}\)

### Native explanation to review

1. विधि — घटनाएँ परस्पर अपवर्ती हैं, इसलिए उनकी प्रायिकताएँ जोड़ें; घटाने के लिए कोई साझा भाग नहीं है।
2. चरण 1 — दोनों घटनाएँ परस्पर अपवर्ती हैं, इसलिए वे एक साथ घटित नहीं हो सकतीं और घटाने के लिए कोई साझा भाग नहीं है।
3. चरण 2 — \(P\!\left(A or B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) = \(\frac{3}{10}\) + \(\frac{1}{10}\)।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{2}{5}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{2}{5}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

किसी अभ्यर्थी के सेक्शन A और सेक्शन B उत्तीर्ण करने की प्रायिकताएँ क्रमशः \(\frac{5}{8}\) और \(\frac{1}{7}\) हैं। दोनों परिणाम स्वतंत्र हैं। अभ्यर्थी के दोनों सेक्शन उत्तीर्ण करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{43}{56}\)
- **B.** \(\frac{5}{56}\)
- **C.** \(\frac{1}{14}\)
- **D.** \(\frac{51}{56}\)
- **E.** \(\frac{3}{28}\)

**Correct answer:** B. \(\frac{5}{56}\)

**English-runtime answer value:** \(\frac{5}{56}\)

### Native explanation to review

1. विधि — घटनाएँ स्वतंत्र हैं, इसलिए दोनों के एक साथ घटित होने की प्रायिकता के लिए उनकी प्रायिकताओं को गुणा करें।
2. चरण 1 — दोनों परिणाम स्वतंत्र हैं, इसलिए एक परिणाम दूसरे की प्रायिकता को नहीं बदलता।
3. चरण 2 — \(P\!\left(both\right)\) = \(P\!\left(A\right)\) \(\times\) \(P\!\left(B\right)\) = \(\frac{5}{8}\) \(\times\) \(\frac{1}{7}\)।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{5}{56}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{5}{56}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

51 अभ्यर्थियों के एक समूह के लिए \(P\!\left(सेक्शन A\right)\) = \(\frac{35}{51}\), \(P\!\left(सेक्शन B\right)\) = \(\frac{32}{51}\) और \(P\!\left(सेक्शन A या सेक्शन B\right)\) = \(\frac{50}{51}\) है। \(P\!\left(सेक्शन A और सेक्शन B\right)\) ज्ञात करें।

### Options

- **A.** \(\frac{2}{3}\)
- **B.** \(\frac{1}{3}\)
- **C.** 0
- **D.** \(\frac{1}{4}\)
- **E.** \(\frac{1}{2}\)

**Correct answer:** B. \(\frac{1}{3}\)

**English-runtime answer value:** \(\frac{1}{3}\)

### Native explanation to review

1. विधि — समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।
2. चरण 1 — सूत्र लगाएँ: \(P\!\left(A \cup B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) - \(P\!\left(A \cap B\right)\)।
3. चरण 2 — संख्याओं के रूप में साझा भाग = 35 + 32 - 50 = 17।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{17}{51}\) = \(\frac{1}{3}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{1}{3}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — Apply \(P\!\left(A \cup B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) - \(P\!\left(A \cap B\right)\).
3. Step 2 — In counts, the overlap is 35 + 32 - 50 = 17.
4. Step 3 — The required probability is \(\frac{17}{51}\) = \(\frac{1}{3}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{1}{3}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें अज्ञात प्रतिच्छेद से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

88 विद्यार्थियों के एक समूह में 24 गणित में उत्तीर्ण हैं, 30 अंग्रेज़ी में उत्तीर्ण हैं और 11 दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के ठीक एक शर्त को पूरा करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{43}{88}\)
- **B.** \(\frac{3}{11}\)
- **C.** \(\frac{4}{11}\)
- **D.** \(\frac{5}{11}\)
- **E.** \(\frac{7}{11}\)

**Correct answer:** C. \(\frac{4}{11}\)

**English-runtime answer value:** \(\frac{4}{11}\)

### Native explanation to review

1. विधि — समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।
2. चरण 1 — ठीक एक शर्त पूरी करने वालों के लिए साझा भाग को दोनों समूहों से एक-एक बार हटाएँ।
3. चरण 2 — आवश्यक लोग = 24 + 30 - 2 \(\times\) 11 = 32।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{32}{88}\) = \(\frac{4}{11}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{4}{11}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — For exactly one condition, remove the overlap once from each group.
3. Step 2 — Required people = 24 + 30 - 2 \(\times\) 11 = 32.
4. Step 3 — The required probability is \(\frac{32}{88}\) = \(\frac{4}{11}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{4}{11}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें मिश्रित घटना व्यंजक से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

69 अभ्यर्थियों के एक समूह में 31 क्वांटिटेटिव एप्टीट्यूड में उत्तीर्ण हैं, 35 रीजनिंग में उत्तीर्ण हैं और 8 दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए अभ्यर्थी के कम-से-कम एक शर्त को पूरा करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{58}{69}\)
- **B.** \(\frac{59}{69}\)
- **C.** \(\frac{19}{23}\)
- **D.** \(\frac{11}{69}\)
- **E.** \(\frac{22}{23}\)

**Correct answer:** A. \(\frac{58}{69}\)

**English-runtime answer value:** \(\frac{58}{69}\)

### Native explanation to review

1. विधि — समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।
2. चरण 1 — n(A \(\cup\) B) = n(A) + n(B) - n(A \(\cap\) B) का उपयोग करें, क्योंकि दोनों समूहों में आने वाले 8 लोग अन्यथा दो बार गिने जाते।
3. चरण 2 — आवश्यक लोग = 31 + 35 - 8 = 58।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{58}{69}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{58}{69}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — Use n(A \(\cup\) B) = n(A) + n(B) - n(A \(\cap\) B), because the 8 people in both groups would otherwise be counted twice.
3. Step 2 — Required people = 31 + 35 - 8 = 58.
4. Step 3 — The required probability is \(\frac{58}{69}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{58}{69}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें घटनाओं का संघ से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

77 विद्यार्थियों के एक समूह में 6 विद्यार्थी क्रिकेट और फुटबॉल दोनों खेलते हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के दोनों खेल खेलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{6}{77}\)
- **B.** \(\frac{5}{77}\)
- **C.** \(\frac{1}{11}\)
- **D.** \(\frac{1}{13}\)
- **E.** \(\frac{71}{77}\)

**Correct answer:** A. \(\frac{6}{77}\)

**English-runtime answer value:** \(\frac{6}{77}\)

### Native explanation to review

1. विधि — आवश्यक घटना दोनों समूहों का साझा भाग है; उसकी संख्या की तुलना पूरे समूह से करें।
2. चरण 1 — प्रतिच्छेद उन लोगों को दर्शाता है जो क्रिकेट और फुटबॉल दोनों की शर्त पूरी करते हैं।
3. चरण 2 — प्रश्न में यह साझा भाग सीधे 77 में से 6 दिया गया है।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{6}{77}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{6}{77}\) है।

### English explanation authority

1. Method — The required event is the overlap of the two groups; compare that overlap with the complete group.
2. Step 1 — The intersection means the people who satisfy both cricket and football.
3. Step 2 — The question gives this overlap directly as 6 out of 77.
4. Step 3 — The required probability is \(\frac{6}{77}\).
5. Answer — The required probability is \(\frac{6}{77}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें घटनाओं का प्रतिच्छेद से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

96 अभ्यर्थियों के एक समूह में 34 सेक्शन A में उत्तीर्ण हैं, 22 सेक्शन B में उत्तीर्ण हैं और 4 दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए अभ्यर्थी के ठीक एक शर्त को पूरा करने की प्रायिकता क्या है?

### Options

- **A.** 1
- **B.** \(\frac{1}{2}\)
- **C.** 0
- **D.** \(\frac{13}{24}\)
- **E.** \(\frac{7}{12}\)

**Correct answer:** B. \(\frac{1}{2}\)

**English-runtime answer value:** \(\frac{1}{2}\)

### Native explanation to review

1. विधि — समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।
2. चरण 1 — ठीक एक शर्त पूरी करने वालों के लिए साझा भाग को दोनों समूहों से एक-एक बार हटाएँ।
3. चरण 2 — आवश्यक लोग = 34 + 22 - 2 \(\times\) 4 = 48।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{48}{96}\) = \(\frac{1}{2}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{1}{2}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — For exactly one condition, remove the overlap once from each group.
3. Step 2 — Required people = 34 + 22 - 2 \(\times\) 4 = 48.
4. Step 3 — The required probability is \(\frac{48}{96}\) = \(\frac{1}{2}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{1}{2}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें दो घटनाओं में ठीक एक से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

57 विद्यार्थियों के एक समूह में 23 गणित में उत्तीर्ण हैं, 30 अंग्रेज़ी में उत्तीर्ण हैं और 3 दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के किसी भी शर्त को पूरा न करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{8}{57}\)
- **B.** \(\frac{53}{57}\)
- **C.** \(\frac{7}{57}\)
- **D.** \(\frac{2}{19}\)
- **E.** \(\frac{50}{57}\)

**Correct answer:** C. \(\frac{7}{57}\)

**English-runtime answer value:** \(\frac{7}{57}\)

### Native explanation to review

1. विधि — पहले समावेशन–बहिष्करण से कम-से-कम एक समूह में आने वालों की संख्या ज्ञात करें, फिर उसे कुल से घटाएँ।
2. चरण 1 — पहले कम-से-कम एक शर्त पूरी करने वालों की संख्या ज्ञात करें: 23 + 30 - 3 = 50।
3. चरण 2 — किसी भी शर्त को पूरा न करने वाले लोगों की संख्या = 57 - 50 = 7।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{7}{57}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{7}{57}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion to find those in at least one group, then subtract that count from the total.
2. Step 1 — First find those satisfying at least one condition: 23 + 30 - 3 = 50.
3. Step 2 — People satisfying neither condition = 57 - 50 = 7.
4. Step 3 — The required probability is \(\frac{7}{57}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{7}{57}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें न A न B से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक अभ्यर्थी को छात्रवृत्ति A या छात्रवृत्ति B में से कोई एक मिल सकती है, दोनों नहीं। यदि \(P\!\left(A\right)\) = \(\frac{1}{10}\) और \(P\!\left(B\right)\) = \(\frac{1}{10}\) है, तो अभ्यर्थी को कोई छात्रवृत्ति मिलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{6}\)
- **B.** \(\frac{2}{5}\)
- **C.** \(\frac{1}{5}\)
- **D.** 0
- **E.** \(\frac{4}{5}\)

**Correct answer:** C. \(\frac{1}{5}\)

**English-runtime answer value:** \(\frac{1}{5}\)

### Native explanation to review

1. विधि — घटनाएँ परस्पर अपवर्ती हैं, इसलिए उनकी प्रायिकताएँ जोड़ें; घटाने के लिए कोई साझा भाग नहीं है।
2. चरण 1 — दोनों घटनाएँ परस्पर अपवर्ती हैं, इसलिए वे एक साथ घटित नहीं हो सकतीं और घटाने के लिए कोई साझा भाग नहीं है।
3. चरण 2 — \(P\!\left(A or B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) = \(\frac{1}{10}\) + \(\frac{1}{10}\)।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{1}{5}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{1}{5}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

किसी अभ्यर्थी के सेक्शन A और सेक्शन B उत्तीर्ण करने की प्रायिकताएँ क्रमशः \(\frac{5}{9}\) और \(\frac{3}{5}\) हैं। दोनों परिणाम स्वतंत्र हैं। अभ्यर्थी के दोनों सेक्शन उत्तीर्ण करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{1}{2}\)
- **B.** \(\frac{1}{3}\)
- **C.** \(\frac{2}{3}\)
- **D.** \(\frac{1}{4}\)
- **E.** 0

**Correct answer:** B. \(\frac{1}{3}\)

**English-runtime answer value:** \(\frac{1}{3}\)

### Native explanation to review

1. विधि — घटनाएँ स्वतंत्र हैं, इसलिए दोनों के एक साथ घटित होने की प्रायिकता के लिए उनकी प्रायिकताओं को गुणा करें।
2. चरण 1 — दोनों परिणाम स्वतंत्र हैं, इसलिए एक परिणाम दूसरे की प्रायिकता को नहीं बदलता।
3. चरण 2 — \(P\!\left(both\right)\) = \(P\!\left(A\right)\) \(\times\) \(P\!\left(B\right)\) = \(\frac{5}{9}\) \(\times\) \(\frac{3}{5}\)।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{1}{3}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{1}{3}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

62 अभ्यर्थियों के एक समूह के लिए \(P\!\left(सेक्शन A\right)\) = \(\frac{29}{62}\), \(P\!\left(सेक्शन B\right)\) = \(\frac{9}{31}\) और \(P\!\left(सेक्शन A या सेक्शन B\right)\) = \(\frac{41}{62}\) है। \(P\!\left(सेक्शन A और सेक्शन B\right)\) ज्ञात करें।

### Options

- **A.** \(\frac{4}{31}\)
- **B.** \(\frac{3}{32}\)
- **C.** \(\frac{3}{31}\)
- **D.** \(\frac{28}{31}\)
- **E.** \(\frac{2}{31}\)

**Correct answer:** C. \(\frac{3}{31}\)

**English-runtime answer value:** \(\frac{3}{31}\)

### Native explanation to review

1. विधि — समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।
2. चरण 1 — सूत्र लगाएँ: \(P\!\left(A \cup B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) - \(P\!\left(A \cap B\right)\)।
3. चरण 2 — संख्याओं के रूप में साझा भाग = 29 + 18 - 41 = 6।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{6}{62}\) = \(\frac{3}{31}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{3}{31}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — Apply \(P\!\left(A \cup B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) - \(P\!\left(A \cap B\right)\).
3. Step 2 — In counts, the overlap is 29 + 18 - 41 = 6.
4. Step 3 — The required probability is \(\frac{6}{62}\) = \(\frac{3}{31}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{3}{31}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें अज्ञात प्रतिच्छेद से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

67 विद्यार्थियों के एक समूह में 19 गणित में उत्तीर्ण हैं, 34 अंग्रेज़ी में उत्तीर्ण हैं और 7 दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के ठीक एक शर्त को पूरा करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{46}{67}\)
- **B.** \(\frac{38}{67}\)
- **C.** \(\frac{40}{67}\)
- **D.** \(\frac{39}{67}\)
- **E.** \(\frac{28}{67}\)

**Correct answer:** D. \(\frac{39}{67}\)

**English-runtime answer value:** \(\frac{39}{67}\)

### Native explanation to review

1. विधि — समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।
2. चरण 1 — ठीक एक शर्त पूरी करने वालों के लिए साझा भाग को दोनों समूहों से एक-एक बार हटाएँ।
3. चरण 2 — आवश्यक लोग = 19 + 34 - 2 \(\times\) 7 = 39।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{39}{67}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{39}{67}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — For exactly one condition, remove the overlap once from each group.
3. Step 2 — Required people = 19 + 34 - 2 \(\times\) 7 = 39.
4. Step 3 — The required probability is \(\frac{39}{67}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{39}{67}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें मिश्रित घटना व्यंजक से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

73 अभ्यर्थियों के एक समूह में 22 क्वांटिटेटिव एप्टीट्यूड में उत्तीर्ण हैं, 28 रीजनिंग में उत्तीर्ण हैं और 2 दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए अभ्यर्थी के कम-से-कम एक शर्त को पूरा करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{25}{73}\)
- **B.** \(\frac{48}{73}\)
- **C.** \(\frac{50}{73}\)
- **D.** \(\frac{49}{73}\)
- **E.** \(\frac{47}{73}\)

**Correct answer:** B. \(\frac{48}{73}\)

**English-runtime answer value:** \(\frac{48}{73}\)

### Native explanation to review

1. विधि — समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।
2. चरण 1 — n(A \(\cup\) B) = n(A) + n(B) - n(A \(\cap\) B) का उपयोग करें, क्योंकि दोनों समूहों में आने वाले 2 लोग अन्यथा दो बार गिने जाते।
3. चरण 2 — आवश्यक लोग = 22 + 28 - 2 = 48।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{48}{73}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{48}{73}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — Use n(A \(\cup\) B) = n(A) + n(B) - n(A \(\cap\) B), because the 2 people in both groups would otherwise be counted twice.
3. Step 2 — Required people = 22 + 28 - 2 = 48.
4. Step 3 — The required probability is \(\frac{48}{73}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{48}{73}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें घटनाओं का संघ से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

57 विद्यार्थियों के एक समूह में 4 विद्यार्थी क्रिकेट और फुटबॉल दोनों खेलते हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के दोनों खेल खेलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{53}{57}\)
- **B.** \(\frac{2}{29}\)
- **C.** \(\frac{5}{57}\)
- **D.** \(\frac{1}{19}\)
- **E.** \(\frac{4}{57}\)

**Correct answer:** E. \(\frac{4}{57}\)

**English-runtime answer value:** \(\frac{4}{57}\)

### Native explanation to review

1. विधि — आवश्यक घटना दोनों समूहों का साझा भाग है; उसकी संख्या की तुलना पूरे समूह से करें।
2. चरण 1 — प्रतिच्छेद उन लोगों को दर्शाता है जो क्रिकेट और फुटबॉल दोनों की शर्त पूरी करते हैं।
3. चरण 2 — प्रश्न में यह साझा भाग सीधे 57 में से 4 दिया गया है।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{4}{57}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{4}{57}\) है।

### English explanation authority

1. Method — The required event is the overlap of the two groups; compare that overlap with the complete group.
2. Step 1 — The intersection means the people who satisfy both cricket and football.
3. Step 2 — The question gives this overlap directly as 4 out of 57.
4. Step 3 — The required probability is \(\frac{4}{57}\).
5. Answer — The required probability is \(\frac{4}{57}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें घटनाओं का प्रतिच्छेद से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

52 अभ्यर्थियों के एक समूह में 20 सेक्शन A में उत्तीर्ण हैं, 27 सेक्शन B में उत्तीर्ण हैं और 11 दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए अभ्यर्थी के ठीक एक शर्त को पूरा करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{47}{52}\)
- **B.** \(\frac{25}{52}\)
- **C.** \(\frac{9}{13}\)
- **D.** \(\frac{1}{2}\)
- **E.** \(\frac{27}{52}\)

**Correct answer:** B. \(\frac{25}{52}\)

**English-runtime answer value:** \(\frac{25}{52}\)

### Native explanation to review

1. विधि — समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।
2. चरण 1 — ठीक एक शर्त पूरी करने वालों के लिए साझा भाग को दोनों समूहों से एक-एक बार हटाएँ।
3. चरण 2 — आवश्यक लोग = 20 + 27 - 2 \(\times\) 11 = 25।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{25}{52}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{25}{52}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — For exactly one condition, remove the overlap once from each group.
3. Step 2 — Required people = 20 + 27 - 2 \(\times\) 11 = 25.
4. Step 3 — The required probability is \(\frac{25}{52}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{25}{52}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें दो घटनाओं में ठीक एक से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

59 विद्यार्थियों के एक समूह में 37 गणित में उत्तीर्ण हैं, 21 अंग्रेज़ी में उत्तीर्ण हैं और 2 दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के किसी भी शर्त को पूरा न करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{58}{59}\)
- **B.** \(\frac{3}{59}\)
- **C.** \(\frac{56}{59}\)
- **D.** \(\frac{2}{59}\)
- **E.** \(\frac{4}{59}\)

**Correct answer:** B. \(\frac{3}{59}\)

**English-runtime answer value:** \(\frac{3}{59}\)

### Native explanation to review

1. विधि — पहले समावेशन–बहिष्करण से कम-से-कम एक समूह में आने वालों की संख्या ज्ञात करें, फिर उसे कुल से घटाएँ।
2. चरण 1 — पहले कम-से-कम एक शर्त पूरी करने वालों की संख्या ज्ञात करें: 37 + 21 - 2 = 56।
3. चरण 2 — किसी भी शर्त को पूरा न करने वाले लोगों की संख्या = 59 - 56 = 3।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{3}{59}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{3}{59}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion to find those in at least one group, then subtract that count from the total.
2. Step 1 — First find those satisfying at least one condition: 37 + 21 - 2 = 56.
3. Step 2 — People satisfying neither condition = 59 - 56 = 3.
4. Step 3 — The required probability is \(\frac{3}{59}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{3}{59}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें न A न B से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

एक अभ्यर्थी को छात्रवृत्ति A या छात्रवृत्ति B में से कोई एक मिल सकती है, दोनों नहीं। यदि \(P\!\left(A\right)\) = \(\frac{3}{10}\) और \(P\!\left(B\right)\) = \(\frac{1}{5}\) है, तो अभ्यर्थी को कोई छात्रवृत्ति मिलने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{3}{4}\)
- **B.** 1
- **C.** \(\frac{1}{2}\)
- **D.** \(\frac{1}{3}\)
- **E.** 0

**Correct answer:** C. \(\frac{1}{2}\)

**English-runtime answer value:** \(\frac{1}{2}\)

### Native explanation to review

1. विधि — घटनाएँ परस्पर अपवर्ती हैं, इसलिए उनकी प्रायिकताएँ जोड़ें; घटाने के लिए कोई साझा भाग नहीं है।
2. चरण 1 — दोनों घटनाएँ परस्पर अपवर्ती हैं, इसलिए वे एक साथ घटित नहीं हो सकतीं और घटाने के लिए कोई साझा भाग नहीं है।
3. चरण 2 — \(P\!\left(A or B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) = \(\frac{3}{10}\) + \(\frac{1}{5}\)।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{1}{2}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{1}{2}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

किसी अभ्यर्थी के सेक्शन A और सेक्शन B उत्तीर्ण करने की प्रायिकताएँ क्रमशः \(\frac{1}{3}\) और \(\frac{1}{9}\) हैं। दोनों परिणाम स्वतंत्र हैं। अभ्यर्थी के दोनों सेक्शन उत्तीर्ण करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{4}{9}\)
- **B.** 0
- **C.** \(\frac{26}{27}\)
- **D.** \(\frac{1}{27}\)
- **E.** \(\frac{2}{27}\)

**Correct answer:** D. \(\frac{1}{27}\)

**English-runtime answer value:** \(\frac{1}{27}\)

### Native explanation to review

1. विधि — घटनाएँ स्वतंत्र हैं, इसलिए दोनों के एक साथ घटित होने की प्रायिकता के लिए उनकी प्रायिकताओं को गुणा करें।
2. चरण 1 — दोनों परिणाम स्वतंत्र हैं, इसलिए एक परिणाम दूसरे की प्रायिकता को नहीं बदलता।
3. चरण 2 — \(P\!\left(both\right)\) = \(P\!\left(A\right)\) \(\times\) \(P\!\left(B\right)\) = \(\frac{1}{3}\) \(\times\) \(\frac{1}{9}\)।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{1}{27}\) है।
5. उत्तर — आवश्यक प्रायिकता \(\frac{1}{27}\) है।

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

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

55 अभ्यर्थियों के एक समूह के लिए \(P\!\left(सेक्शन A\right)\) = \(\frac{38}{55}\), \(P\!\left(सेक्शन B\right)\) = \(\frac{4}{11}\) और \(P\!\left(सेक्शन A या सेक्शन B\right)\) = \(\frac{53}{55}\) है। \(P\!\left(सेक्शन A और सेक्शन B\right)\) ज्ञात करें।

### Options

- **A.** \(\frac{1}{11}\)
- **B.** \(\frac{2}{11}\)
- **C.** 0
- **D.** \(\frac{1}{12}\)
- **E.** \(\frac{10}{11}\)

**Correct answer:** A. \(\frac{1}{11}\)

**English-runtime answer value:** \(\frac{1}{11}\)

### Native explanation to review

1. विधि — समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।
2. चरण 1 — सूत्र लगाएँ: \(P\!\left(A \cup B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) - \(P\!\left(A \cap B\right)\)।
3. चरण 2 — संख्याओं के रूप में साझा भाग = 38 + 20 - 53 = 5।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{5}{55}\) = \(\frac{1}{11}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{1}{11}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — Apply \(P\!\left(A \cup B\right)\) = \(P\!\left(A\right)\) + \(P\!\left(B\right)\) - \(P\!\left(A \cap B\right)\).
3. Step 2 — In counts, the overlap is 38 + 20 - 53 = 5.
4. Step 3 — The required probability is \(\frac{5}{55}\) = \(\frac{1}{11}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{1}{11}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें अज्ञात प्रतिच्छेद से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
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

66 विद्यार्थियों के एक समूह में 31 गणित में उत्तीर्ण हैं, 28 अंग्रेज़ी में उत्तीर्ण हैं और 1 दोनों में उत्तीर्ण हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के ठीक एक शर्त को पूरा करने की प्रायिकता क्या है?

### Options

- **A.** \(\frac{19}{23}\)
- **B.** \(\frac{9}{11}\)
- **C.** \(\frac{3}{22}\)
- **D.** \(\frac{10}{11}\)
- **E.** \(\frac{19}{22}\)

**Correct answer:** E. \(\frac{19}{22}\)

**English-runtime answer value:** \(\frac{19}{22}\)

### Native explanation to review

1. विधि — समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।
2. चरण 1 — ठीक एक शर्त पूरी करने वालों के लिए साझा भाग को दोनों समूहों से एक-एक बार हटाएँ।
3. चरण 2 — आवश्यक लोग = 31 + 28 - 2 \(\times\) 1 = 57।
4. चरण 3 — आवश्यक प्रायिकता \(\frac{57}{66}\) = \(\frac{19}{22}\) है।
5. मुख्य बिंदु — दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।
6. उत्तर — आवश्यक प्रायिकता \(\frac{19}{22}\) है।

### English explanation authority

1. Method — Use inclusion–exclusion so that members belonging to both groups are not counted twice.
2. Step 1 — For exactly one condition, remove the overlap once from each group.
3. Step 2 — Required people = 31 + 28 - 2 \(\times\) 1 = 57.
4. Step 3 — The required probability is \(\frac{57}{66}\) = \(\frac{19}{22}\).
5. Key point — Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.
6. Answer — The required probability is \(\frac{19}{22}\).

**Native visuals:**
- **VENN_EVENT_REGIONS** — दो घटनाओं का क्षेत्र मॉडल
  - Alt: दो वृत्तों का वेन मॉडल, जिसमें मिश्रित घटना व्यंजक से संबंधित क्षेत्र दिखाए गए हैं।

### Parity evidence

- Options preserved: **YES**
- Correct index preserved: **YES**
- Answer preserved: **YES**
- Solver authority: **ENGLISH_RUNTIME**
- Answer-key authority: **ENGLISH_RUNTIME**

### Human review checklist

- [ ] Hindi stem is natural, concise and exam-like.
- [ ] Mathematical meaning matches the English authority exactly.
- [ ] Scenario nouns and conditions match the English authority; no bag/jar/box/pouch or object substitution.
- [ ] Options are logically correct and the marked answer is unambiguous.
- [ ] Hindi explanation is easy for a student to understand.
- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.
- [ ] Any visual title/alt text is natural and preserves the event meaning.

**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED

**Reviewer:** ____________________

**Review date:** ____________________

**Notes / required correction:**

> 

---
