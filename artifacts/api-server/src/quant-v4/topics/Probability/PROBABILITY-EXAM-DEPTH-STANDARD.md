# Probability — Competitive-Exam Depth Standard

## Purpose

This standard converts the Probability chapter from a mathematically valid generator into an exam-ready learning system for SSC, banking, railway and related competitive examinations.

The benchmark material supplied for editorial review shows that strong probability preparation requires more than direct favourable-over-total questions. A complete chapter must combine realistic stems, several reasoning layers, visible counting decisions and explanations that show why a method is used.

## 1. Question-stem standard

### 1.1 Preserve the natural language of competitive examinations

Use familiar settings such as:

- coloured balls, marbles, pens and stones;
- defective bulbs and inspection results;
- candidates, interviews, sections and examinations;
- students, class representatives and subject results;
- cards, coins, dice, numbered tickets and spinners;
- committees, queues, posts and arrangements;
- replacement and non-replacement selections.

Do not use artificial student-facing nouns such as tokens, counters, selected files, canonical outcomes or abstract generated items.

In event-algebra questions, use natural phrases such as “meets at least one condition,” “meets both conditions,” or the actual subjects and activities. Do not expose abstract labels such as “satisfies A” or “satisfies B.” Apply normal agreement: one student or candidate **meets** a condition; several students or candidates **meet** it.

### 1.2 Match the reasoning depth to the difficulty

- **Easy:** one clear probability idea, with the complete count visible.
- **Medium:** two or three linked decisions, such as complement, conditional restriction, combination counting, overlap removal, replacement or order.
- **Hard:** a derived quantity, algebraic relation, multiple cases, arrangement restriction or reverse count before the final probability calculation.

A long sentence is not a hard question. Difficulty comes from the reasoning path.

### 1.3 Use indirect information where it improves the question

Suitable questions may provide:

- a ratio instead of separate counts;
- a probability from which an unknown count must be recovered;
- a conditional sample space;
- an overlap that must be removed;
- a complement that is shorter than direct counting;
- a required composition that needs combinations;
- a fixed order or a replacement condition.

Every indirect question must still have one unambiguous interpretation and one exact answer.

## 2. Explanation standard

### 2.1 Show the decision before the calculation

For medium and hard questions, the explanation should normally contain:

1. **Method decision:** why complement, multiplication, combinations, conditional restriction, event algebra or arrangement counting is appropriate.
2. **Complete sample space:** the total number of possible cases.
3. **Required cases:** the exact cases satisfying the condition.
4. **Final probability:** required cases divided by total cases and simplified.

### 2.2 Show concrete outcomes when the set is small

- Coins: show H/T sequences such as `HTT, THT, TTH`.
- Two dice: show ordered pairs such as `(1,4), (2,3), (3,2), (4,1)`.
- Single die: show the favourable faces.
- Small number ranges: show the qualifying integers.
- Ordered colour draws: name both orders when both are valid.

Do not print a long exhaustive list when structured counting is clearer.

### 2.3 Explain combinations in words

Do not present only `C(n,r)` expressions. State what is being chosen.

Example:

> Because the balls are drawn together, order does not matter. There are `C(13,2)` possible selections. To obtain one red and one blue ball, choose one from the red group and one from the blue group: `C(8,1) × C(5,1)`.

### 2.4 Explain conditional probability as a restricted universe

A conditional question must explicitly state that the given condition changes the sample space.

Example:

> The card is known to be a face card, so the sample space is no longer all 52 cards. It is restricted to the 12 face cards.

### 2.5 Explain replacement and order separately

- **With replacement:** the composition returns to its original state.
- **Without replacement:** both the numerator and denominator may change.
- **Ordered selection:** red-blue and blue-red are different cases.
- **Simultaneous selection:** order does not matter, so combinations are used.

## 3. Distractor standard

Options should represent recognisable mistakes, including:

- forgetting to subtract an overlap;
- using direct counting instead of a complement;
- treating an ordered experiment as unordered, or vice versa;
- forgetting the changed denominator after a non-replacement draw;
- omitting one valid order;
- using permutations where combinations are required;
- dividing by the original sample space in a conditional question;
- stopping before simplifying.

Distractors must remain distinct, plausible and mathematically valid values.

## 4. Variety standard

A review set must not appear to be a sequence of colour changes applied to the same template. Across the chapter it should visibly include:

- direct and reverse probability;
- complement and at-least-one cases;
- coin sequences;
- single-die and two-dice events;
- cards and card unions;
- simultaneous selections;
- successive selections with and without replacement;
- conditional probability;
- committees, queues and number formation;
- event algebra and overlap;
- practical candidate, workplace and classroom settings.

## 5. Quality gates

A generated review set is acceptable only when:

- all mathematical and independent-verification checks pass;
- every medium or hard multi-step explanation reveals the method decision;
- small outcome spaces display concrete outcomes;
- no artificial context nouns appear;
- context families are sufficiently varied;
- stems and answers are visibly unique;
- explanation depth is appropriate to difficulty;
- all options are unique and the correct option appears exactly once;
- the chapter remains non-public until human editorial sign-off.

## 6. Benchmark features captured for future architecture extensions

The supplied competitive-exam material also contains less common families that require dedicated mathematical support rather than superficial wording changes:

- selection from one of two bags;
- biased dice and non-uniform elementary outcomes;
- geometric or area-based probability;
- alternating-turn and infinite-series probability;
- multi-equation unknown-composition problems;
- advanced circular arrangements and repeated-letter restrictions;
- cube-face and spatial probability.

These families should be introduced only with typed experiments, exact solvers, independent verification and dedicated distractor models. They must not be simulated by unsupported templates.
