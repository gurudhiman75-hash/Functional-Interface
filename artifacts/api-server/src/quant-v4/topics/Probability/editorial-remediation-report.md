# Probability Editorial Remediation Report

## Result

- Source QLs validated: **216**
- Human-review questions regenerated: **135**
- Unique visible review questions: **135/135**
- PRB-001 review set: **75** questions using the SSC CGL/CHSL profile and four options
- PRB-002 review set: **60** questions using the Banking Mains profile and five options
- Average review explanation length: **21.5 words**

## Student-facing standard

Questions now use direct exam language. Internal enum names, artificial template introductions, unused variables and invalid displayed probabilities are blocked. Singular and plural forms are rendered from the actual number. Difficulty is based on the number of reasoning steps rather than stem length. Exact duplicate visible questions are rejected during review generation; a different valid QL is substituted when necessary.

Artificial placeholders such as tokens, counters and selected files have been removed from generated stems. The context pool now uses familiar exam situations such as lottery tickets, defective bulbs, coloured balls, books, candidates, employees and loan applications.

Explanations remain short but now show the actual outcomes whenever the sample space is reasonably small:

1. Coin questions show H/T sequences such as `HTT`, `THT` and `TTH`.
2. Dice questions show the required ordered pairs, such as `(1,4)`, `(2,3)`, `(3,2)` and `(4,1)`.
3. Single-die questions name the favourable faces.
4. Number-range and conditional-number questions show the relevant integers or restricted set.
5. Successive-draw questions distinguish orders such as red-blue and blue-red when both orders are valid.

The final calculation still follows the simplest student-friendly structure: identify the possible cases, identify the required cases, divide and simplify. For larger outcome spaces, the explanation uses a compact counting method or a shortened explicit set rather than printing an unreadable exhaustive list.

## Exam profiles

- **SSC CGL/CHSL:** simple probability pool, four options.
- **SSC CGL JSO/Statistics:** full probability pool, four options.
- **Banking Prelims:** selected direct probability pool, five options.
- **Banking Mains:** full probability and counting pool, five options.

## Publication status

The mathematical and automated editorial gates pass, but the chapter remains non-public and ineligible for the question bank until the regenerated sheets receive human editorial sign-off.
