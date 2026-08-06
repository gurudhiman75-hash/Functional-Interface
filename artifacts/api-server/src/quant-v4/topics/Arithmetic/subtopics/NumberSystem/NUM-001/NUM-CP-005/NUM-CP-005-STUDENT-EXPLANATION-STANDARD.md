# NUM-CP-005 — Student Explanation Standard

## Required voice

Explanations must sound like a teacher solving the displayed question for a student.

They must:

- use the actual numbers and conditions from the question;
- show the calculation in a natural order;
- explain why the answer follows;
- use short, familiar words;
- change the explanation when the question changes;
- give a useful shortcut only when it genuinely helps;
- keep every exponent attached to the correct base.

## Prohibited style

Learner-facing explanations must not use system or machine language such as:

- governed result;
- admissible candidate;
- canonical answer;
- verifier result;
- semantic option;
- exponent-choice product;
- set-difference count;
- independently evaluate;
- retain the valid pair.

The explanation must not repeat the same conclusion in the working and final-answer line.

## Question-specific modelling

Examples of the required change:

### Divisor count

Instead of:

> Use the exponent-choice product.

Use:

> For \(5^{2}\), the exponent can be 0, 1 or 2, so there are 3 choices. The same is true for \(13^{2}\). Therefore, the number of divisors is \(3\times3=9\).

### Odd and even divisors

Instead of:

> Apply the parity restriction.

Use:

> An odd divisor cannot contain 2. For \(2^{2}\times3\), the odd divisors come only from \(3^{0}\) and \(3^{1}\), so there are 2 odd divisors. There are 6 divisors in all, hence the even-divisor count is \(6-2=4\).

### Data sufficiency

Instead of:

> Form candidate sets and test their intersection.

Use:

> Statement I gives only \(x=3\), so it is sufficient. Statement II gives \(x=1,3,5\), so it is not sufficient. Therefore, Statement I alone is sufficient.

## Runtime checks

Every generated explanation is checked for:

- machine-like vocabulary;
- broken phrases such as “1 choices”, “2th” and “3th”;
- repeated explanation lines;
- repeated final-answer wording;
- sentences longer than 32 words;
- fewer than two working steps;
- fewer than three different question checks;
- mismatch between the explanation and the correct answer.

## Lifecycle

This wording remodel does not activate Question Studio, Question Bank, tests or public delivery. The English pack remains under product-owner review.
