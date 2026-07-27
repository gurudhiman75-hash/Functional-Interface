# ExamTree Reasoning V1 — OPS-001 Hindi and Punjabi Localisation Contract

Status: implementation-design contract. Human linguistic review remains mandatory before publication.

## 1. Purpose

OPS-001 is logically language-neutral for most question families, but its student instructions are highly sensitive to wording. A mistranslation can change the transformation itself.

This contract governs:

- English (`en-IN`);
- Hindi (`hi-IN`);
- Punjabi (`pa-IN`).

It applies to stems, option introductions, explanations, review exports and Question Studio previews.

## 2. Core localisation classification

### 2.1 `TRANSLATABLE`

Use when the following remain identical across locales:

- numeric literals;
- arithmetic and relation signs;
- token positions;
- mapping semantics;
- option semantics;
- answer;
- explanation arithmetic trace.

Most OPS-001 QLs are `TRANSLATABLE`.

### 2.2 `LANGUAGE_ADAPTED`

Use when ordinary words act as operation tokens, for example:

```text
A JOIN B
A CUT B
```

Word tokens must be authored separately for each locale or replaced by a language-neutral letter/symbol token. Literal transliteration is not sufficient.

### 2.3 `LANGUAGE_SPECIFIC`

OPS-001 should rarely require this classification. A candidate is language-specific only when the tested ambiguity or token identity depends on the language itself.

Such candidates are deferred from the first implementation unless independently justified.

## 3. Canonical terminology ledger

| Concept ID | English | Hindi | Punjabi |
|---|---|---|---|
| `MATHEMATICAL_OPERATION` | mathematical operation | गणितीय संक्रिया | ਗਣਿਤੀ ਕਿਰਿਆ |
| `ARITHMETIC_SIGN` | arithmetic sign | अंकगणितीय चिह्न | ਅੰਕਗਣਿਤੀ ਚਿੰਨ੍ਹ |
| `MATHEMATICAL_SIGN` | mathematical sign | गणितीय चिह्न | ਗਣਿਤੀ ਚਿੰਨ੍ਹ |
| `OPERATOR` | operator / operation sign | संक्रिया-चिह्न | ਕਿਰਿਆ-ਚਿੰਨ੍ਹ |
| `RELATION_SIGN` | relation sign | संबंध-चिह्न | ਸੰਬੰਧ-ਚਿੰਨ੍ਹ |
| `SYMBOL` | symbol | प्रतीक / चिह्न | ਪ੍ਰਤੀਕ / ਚਿੰਨ੍ਹ |
| `MEANS` | means / denotes | का अर्थ ... है / ... को दर्शाता है | ਦਾ ਅਰਥ ... ਹੈ / ... ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ |
| `REPLACE` | replace | के स्थान पर रखें / से बदलें | ਦੀ ਥਾਂ ਰੱਖੋ / ਨਾਲ ਬਦਲੋ |
| `INTERCHANGE` | interchange mutually | आपस में बदलें | ਆਪਸ ਵਿੱਚ ਬਦਲੋ |
| `SEQUENTIALLY` | sequentially | क्रमशः | ਕ੍ਰਮਵਾਰ |
| `LEFT_TO_RIGHT` | from left to right | बाएँ से दाएँ | ਖੱਬੇ ਤੋਂ ਸੱਜੇ |
| `BLANK` | blank | रिक्त स्थान | ਖਾਲੀ ਥਾਂ |
| `PLACEHOLDER` | placeholder | स्थान-चिह्न | ਥਾਂ-ਚਿੰਨ੍ਹ |
| `EQUATION` | equation | समीकरण | ਸਮੀਕਰਨ |
| `EXPRESSION` | expression | व्यंजक | ਵਿਅੰਜਕ |
| `STATEMENT` | statement | कथन | ਕਥਨ |
| `CORRECT` | correct | सही | ਸਹੀ |
| `TRUE` | true | सत्य | ਸੱਚ / ਸਹੀ |
| `FALSE` | false | असत्य | ਗਲਤ / ਝੂਠਾ |
| `BALANCE_EQUATION` | make the equation correct / balance | समीकरण को सही बनाएँ | ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਓ |
| `VALUE` | value | मान | ਮੁੱਲ |
| `RESULT` | result | परिणाम | ਨਤੀਜਾ |
| `EVALUATE` | find the value | मान ज्ञात कीजिए | ਮੁੱਲ ਕੱਢੋ / ਮੁੱਲ ਪਤਾ ਕਰੋ |
| `NUMBER` | number | संख्या | ਸੰਖਿਆ |
| `DIGIT` | digit | अंक | ਅੰਕ |
| `WHOLE_NUMERIC_TOKEN` | complete number as one unit | पूरी संख्या को एक इकाई मानें | ਪੂਰੀ ਸੰਖਿਆ ਨੂੰ ਇੱਕ ਇਕਾਈ ਮੰਨੋ |
| `PAIR` | pair | युग्म / जोड़ी | ਜੋੜਾ |
| `OPTION` | option | विकल्प | ਵਿਕਲਪ |
| `LESS_THAN` | less than | से कम | ਤੋਂ ਘੱਟ |
| `GREATER_THAN` | greater than | से अधिक | ਤੋਂ ਵੱਧ |
| `EQUAL_TO` | equal to | के बराबर | ਦੇ ਬਰਾਬਰ |
| `NOT_EQUAL_TO` | not equal to | के बराबर नहीं | ਦੇ ਬਰਾਬਰ ਨਹੀਂ |
| `BRACKET` | bracket | कोष्ठक | ਬ੍ਰੈਕਟ / ਕੋਠਾ-ਚਿੰਨ੍ਹ |

## 4. Mandatory semantic distinctions

## 4.1 Replace versus interchange

### Replace

`A is replaced by B` is directional.

Canonical Hindi:

```text
A के स्थान पर B रखें।
```

Canonical Punjabi:

```text
A ਦੀ ਥਾਂ B ਰੱਖੋ।
```

### Interchange

`A and B are interchanged` is mutual and simultaneous.

Canonical Hindi:

```text
A और B को आपस में बदल दिया जाए।
```

Canonical Punjabi:

```text
A ਅਤੇ B ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲ ਦਿੱਤਾ ਜਾਵੇ।
```

Forbidden Hindi for interchange:

```text
A को B से बदलें
```

when the reverse replacement is not also stated.

Forbidden Punjabi for interchange:

```text
A ਨੂੰ B ਨਾਲ ਬਦਲੋ
```

when mutual exchange is intended but not expressed.

## 4.2 Number versus digit

This distinction is runtime-critical.

### Complete number

Hindi:

```text
24 और 36 को पूरी संख्याओं के रूप में आपस में बदलें।
```

Punjabi:

```text
24 ਅਤੇ 36 ਨੂੰ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਵਜੋਂ ਆਪਸ ਵਿੱਚ ਬਦਲੋ।
```

### Digit identity

Hindi:

```text
अंक 2 और 6 की प्रत्येक उपस्थिति को आपस में बदलें।
```

Punjabi:

```text
ਅੰਕ 2 ਅਤੇ 6 ਦੀ ਹਰ ਮੌਜੂਦਗੀ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲੋ।
```

Forbidden:

- using `अंक`/`ਅੰਕ` for a complete multi-digit number;
- using `संख्या`/`ਸੰਖਿਆ` when global digit identity is intended;
- omitting the scope of a digit swap.

## 4.3 Sequential replacement

The option order must map to placeholder order from left to right.

Canonical Hindi:

```text
दिए गए चिह्नों को बाएँ से दाएँ रिक्त स्थानों में क्रमशः रखिए।
```

Canonical Punjabi:

```text
ਦਿੱਤੇ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਖਾਲੀ ਥਾਵਾਂ ਵਿੱਚ ਕ੍ਰਮਵਾਰ ਰੱਖੋ।
```

The word `क्रमशः` / `ਕ੍ਰਮਵਾਰ` is mandatory where option order matters.

## 4.4 Global versus positional scope

### Global

Hindi:

```text
समीकरण में जहाँ-जहाँ ये चिह्न आए हैं, सभी स्थानों पर उन्हें आपस में बदलें।
```

Punjabi:

```text
ਸਮੀਕਰਨ ਵਿੱਚ ਜਿੱਥੇ-ਜਿੱਥੇ ਇਹ ਚਿੰਨ੍ਹ ਆਏ ਹਨ, ਹਰ ਥਾਂ ਉਨ੍ਹਾਂ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲੋ।
```

### Specified positions only

Hindi:

```text
केवल बताए गए स्थानों पर चिह्न बदलें।
```

Punjabi:

```text
ਕੇਵਲ ਦਰਸਾਈਆਂ ਥਾਵਾਂ 'ਤੇ ਚਿੰਨ੍ਹ ਬਦਲੋ।
```

A QL must never rely on the reader guessing the scope.

## 4.5 Equality as a movable token

When `=` is one of the signs to insert or interchange, it must be described as a sign, not as fixed punctuation.

Hindi:

```text
बराबर का चिह्न (=) भी दिए गए चिह्नों में शामिल है।
```

Punjabi:

```text
ਬਰਾਬਰ ਦਾ ਚਿੰਨ੍ਹ (=) ਵੀ ਦਿੱਤੇ ਚਿੰਨ੍ਹਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੈ।
```

## 5. Canonical stem templates

## 5.1 Given arithmetic-sign mapping — evaluate

English:

```text
If `+` means `÷`, `−` means `+`, `×` means `−`, and `÷` means `×`, find the value of the following expression.
```

Hindi:

```text
यदि `+` का अर्थ `÷`, `−` का अर्थ `+`, `×` का अर्थ `−` और `÷` का अर्थ `×` है, तो निम्न व्यंजक का मान ज्ञात कीजिए।
```

Punjabi:

```text
ਜੇ `+` ਦਾ ਅਰਥ `÷`, `−` ਦਾ ਅਰਥ `+`, `×` ਦਾ ਅਰਥ `−` ਅਤੇ `÷` ਦਾ ਅਰਥ `×` ਹੈ, ਤਾਂ ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਕੱਢੋ।
```

## 5.2 Arbitrary symbols — evaluate

English:

```text
If `M` denotes `+`, `N` denotes `−`, `P` denotes `×`, and `Q` denotes `÷`, find the value of the expression.
```

Hindi:

```text
यदि `M`, `+` को; `N`, `−` को; `P`, `×` को और `Q`, `÷` को दर्शाता है, तो व्यंजक का मान ज्ञात कीजिए।
```

Punjabi:

```text
ਜੇ `M`, `+` ਨੂੰ; `N`, `−` ਨੂੰ; `P`, `×` ਨੂੰ ਅਤੇ `Q`, `÷` ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ, ਤਾਂ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਕੱਢੋ।
```

## 5.3 Interchange a specified pair — evaluate

English:

```text
What is the value of the expression if `+` and `−` are interchanged?
```

Hindi:

```text
यदि `+` और `−` को आपस में बदल दिया जाए, तो व्यंजक का मान क्या होगा?
```

Punjabi:

```text
ਜੇ `+` ਅਤੇ `−` ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲ ਦਿੱਤਾ ਜਾਵੇ, ਤਾਂ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਕੀ ਹੋਵੇਗਾ?
```

## 5.4 Identify the pair to interchange

English:

```text
Which two signs should be interchanged to make the equation correct?
```

Hindi:

```text
समीकरण को सही बनाने के लिए किन दो चिह्नों को आपस में बदलना चाहिए?
```

Punjabi:

```text
ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜੇ ਦੋ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲਣਾ ਚਾਹੀਦਾ ਹੈ?
```

## 5.5 Fill signs sequentially

English:

```text
Select the sequence of signs that, when placed from left to right in the blanks, makes the equation correct.
```

Hindi:

```text
चिह्नों का वह क्रम चुनिए जिसे रिक्त स्थानों में बाएँ से दाएँ क्रमशः रखने पर समीकरण सही हो जाता है।
```

Punjabi:

```text
ਚਿੰਨ੍ਹਾਂ ਦਾ ਉਹ ਕ੍ਰਮ ਚੁਣੋ ਜਿਸ ਨੂੰ ਖਾਲੀ ਥਾਵਾਂ ਵਿੱਚ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਕ੍ਰਮਵਾਰ ਰੱਖਣ ਨਾਲ ਸਮੀਕਰਨ ਸਹੀ ਹੋ ਜਾਂਦਾ ਹੈ।
```

## 5.6 Insert arithmetic and relation signs

English:

```text
Select the operators and relation sign that make the statement correct.
```

Hindi:

```text
वे संक्रिया-चिह्न और संबंध-चिह्न चुनिए जिनसे कथन सही हो जाता है।
```

Punjabi:

```text
ਉਹ ਕਿਰਿਆ-ਚਿੰਨ੍ਹ ਅਤੇ ਸੰਬੰਧ-ਚਿੰਨ੍ਹ ਚੁਣੋ ਜਿਨ੍ਹਾਂ ਨਾਲ ਕਥਨ ਸਹੀ ਹੋ ਜਾਂਦਾ ਹੈ।
```

## 5.7 Whole-number interchange

English:

```text
Which two complete numbers should be interchanged to make the equation correct?
```

Hindi:

```text
समीकरण को सही बनाने के लिए किन दो पूरी संख्याओं को आपस में बदलना चाहिए?
```

Punjabi:

```text
ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜੀਆਂ ਦੋ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲਣਾ ਚਾਹੀਦਾ ਹੈ?
```

## 5.8 Digit interchange

English:

```text
Which two digits should be interchanged at every occurrence to make the equation correct?
```

Hindi:

```text
समीकरण को सही बनाने के लिए किन दो अंकों की प्रत्येक उपस्थिति को आपस में बदलना चाहिए?
```

Punjabi:

```text
ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜੇ ਦੋ ਅੰਕਾਂ ਦੀ ਹਰ ਮੌਜੂਦਗੀ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲਣਾ ਚਾਹੀਦਾ ਹੈ?
```

## 5.9 Hidden mapping from examples

English:

```text
Study the example equations and determine the meanings of the displayed signs. Apply the same meanings to the target expression.
```

Hindi:

```text
उदाहरण समीकरणों का अध्ययन करके दिए गए चिह्नों के अर्थ निर्धारित कीजिए। उन्हीं अर्थों को लक्ष्य व्यंजक पर लागू कीजिए।
```

Punjabi:

```text
ਉਦਾਹਰਨ ਸਮੀਕਰਨਾਂ ਦਾ ਅਧਿਐਨ ਕਰਕੇ ਦਿੱਤੇ ਚਿੰਨ੍ਹਾਂ ਦੇ ਅਰਥ ਨਿਰਧਾਰਤ ਕਰੋ। ਉਹੀ ਅਰਥ ਲਕਸ਼ ਵਿਅੰਜਕ 'ਤੇ ਲਾਗੂ ਕਰੋ।
```

## 6. Explanation templates

## 6.1 Direct mapping trace

Hindi structure:

```text
पहले दिए गए चिह्नों को उनके वास्तविक अर्थों से बदलते हैं:
[transformed expression]
अब कोष्ठक और संक्रिया-क्रम के अनुसार मान निकालते हैं:
[evaluation trace]
अतः सही उत्तर [answer] है।
```

Punjabi structure:

```text
ਪਹਿਲਾਂ ਦਿੱਤੇ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੇ ਅਸਲ ਅਰਥਾਂ ਨਾਲ ਬਦਲਦੇ ਹਾਂ:
[transformed expression]
ਹੁਣ ਬ੍ਰੈਕਟਾਂ ਅਤੇ ਕਿਰਿਆ-ਕ੍ਰਮ ਅਨੁਸਾਰ ਮੁੱਲ ਕੱਢਦੇ ਹਾਂ:
[evaluation trace]
ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ [answer] ਹੈ।
```

## 6.2 Interchange trace

Hindi structure:

```text
`A` और `B` को सभी स्थानों पर आपस में बदलने पर समीकरण बनेगा:
[transformed equation]
बाएँ पक्ष = [left value]
दाएँ पक्ष = [right value]
दोनों पक्ष बराबर हैं, इसलिए यही सही युग्म है।
```

Punjabi structure:

```text
`A` ਅਤੇ `B` ਨੂੰ ਹਰ ਥਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲਣ 'ਤੇ ਸਮੀਕਰਨ ਬਣੇਗਾ:
[transformed equation]
ਖੱਬਾ ਪਾਸਾ = [left value]
ਸੱਜਾ ਪਾਸਾ = [right value]
ਦੋਵੇਂ ਪਾਸੇ ਬਰਾਬਰ ਹਨ, ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਜੋੜਾ ਹੈ।
```

## 6.3 Fill-sequence trace

Hindi structure:

```text
विकल्प के चिह्नों को बाएँ से दाएँ क्रमशः रखने पर:
[completed equation]
बाएँ पक्ष = [left value] और दाएँ पक्ष = [right value]
इसलिए समीकरण सही है।
```

Punjabi structure:

```text
ਵਿਕਲਪ ਦੇ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਕ੍ਰਮਵਾਰ ਰੱਖਣ 'ਤੇ:
[completed equation]
ਖੱਬਾ ਪਾਸਾ = [left value] ਅਤੇ ਸੱਜਾ ਪਾਸਾ = [right value]
ਇਸ ਲਈ ਸਮੀਕਰਨ ਸਹੀ ਹੈ।
```

## 7. Typography and script rules

1. Preserve canonical Unicode signs where supported:
   - minus `−`, not hyphen `-` in rendered mathematical expressions;
   - multiplication `×`;
   - division `÷`.
2. Maintain ASCII fallbacks only in internal serialisation and tests.
3. Do not translate or transliterate single-letter operation tokens.
4. Do not change Arabic numerals between locales in V1.
5. Keep unary negative visually attached to its numeric operand.
6. Ensure Gurmukhi vowel signs do not collide with inline code styling.
7. Do not use decorative glyphs whose shape changes across fallback fonts.
8. Mapping tables must align token and meaning columns in all locales.
9. Option order and operator order are immutable across locales unless an explicit deterministic locale-shuffle policy exists.
10. Avoid line breaks immediately before or after an operator.

## 8. Grammar rules

### Hindi

- Prefer `का अर्थ ... है` for direct meaning statements.
- Prefer `आपस में बदल` for mutual interchange.
- Use `किन दो चिह्नों` rather than unnatural singular agreement.
- Use `मान ज्ञात कीजिए` for formal exam wording.
- Do not expose English words such as `mapping`, `swap`, `token` in student-facing text.

### Punjabi

- Prefer `ਦਾ ਅਰਥ ... ਹੈ` for direct meaning statements.
- Prefer `ਆਪਸ ਵਿੱਚ ਬਦਲ` for mutual interchange.
- Use `ਕਿਹੜੇ ਦੋ ਚਿੰਨ੍ਹਾਂ` with correct oblique plural form.
- Prefer `ਮੁੱਲ ਕੱਢੋ` or `ਮੁੱਲ ਪਤਾ ਕਰੋ`; use one consistently within a checkpoint.
- Use `ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਕ੍ਰਮਵਾਰ` where sequence matters.
- Avoid Hindi-influenced constructions when a natural Punjabi form exists.
- Do not translate `number` and `digit` to the same word.

## 9. Forbidden localisation defects

```text
LOC-OPS-001  interchange rendered as one-way replacement
LOC-OPS-002  number and digit terminology collapsed
LOC-OPS-003  sequential order omitted
LOC-OPS-004  global scope omitted for digit/operator identity swap
LOC-OPS-005  equality treated as fixed punctuation when movable
LOC-OPS-006  transformed expression differs across locales
LOC-OPS-007  option semantics differ across locales
LOC-OPS-008  internal rule ID appears in student text
LOC-OPS-009  unresolved English helper phrase in Hindi/Punjabi
LOC-OPS-010  Punjabi uses mixed Devanagari/Gurmukhi text
LOC-OPS-011  sign glyph changed by translation
LOC-OPS-012  explanation evaluates before showing transformation
LOC-OPS-013  arithmetic trace reordered by prose translation
LOC-OPS-014  unary minus separated from operand
LOC-OPS-015  literal machine translation produces unnatural exam wording
```

## 10. Localisation parity tests

Every QL and seed selected for multilingual support must pass:

```text
same transformation fingerprint
same original token stream
same transformed token stream
same AST fingerprint
same exact answer
same semantic options
same correct option identity
same error labels
same difficulty factors
same ambiguity result
same solver trace values
```

Text may differ; logic may not.

## 11. Required human-review batch

Before a checkpoint can be marked multilingual-ready:

- generate at least 25 representative seeds per retained solve mode;
- include easy, medium and hard instances;
- include repeated operators;
- include brackets;
- include equality insertion;
- include whole-number and digit swaps;
- include negative results where supported;
- include arbitrary letter and symbol tokens;
- include at least one global-scope clarification case.

Review fields:

```text
stemNaturalness
terminologyAccuracy
interchangeSemantics
numberDigitDistinction
sequenceClarity
grammar
scriptIntegrity
mathematicalParity
explanationNaturalness
rendererClarity
editorialStatus
reviewNotes
```

## 12. Publication policy

A QL may be published in English while Hindi/Punjabi remain disabled only when the chapter manifest explicitly marks the locale status.

The runtime must never silently fall back to English for a requested Hindi or Punjabi question.

Punjab exam pools must not include a QL until its Punjabi wording has passed human review.

## 13. Definition of done

The OPS-001 localisation layer is ready when:

- the glossary is implemented as stable message keys;
- each QL has a locale classification;
- all canonical stem families have reviewed Hindi and Punjabi forms;
- all forbidden-defect tests pass;
- production fonts render every active token safely;
- language parity batch audits are clean;
- human reviewers approve the number/digit and replace/interchange distinctions;
- Question Studio can compare all three locales side by side.
