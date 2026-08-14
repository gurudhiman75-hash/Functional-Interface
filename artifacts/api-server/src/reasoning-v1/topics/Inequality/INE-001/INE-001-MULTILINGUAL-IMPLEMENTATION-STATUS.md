# INE-001 Multilingual Implementation Status

## Outcome

Hindi (`hi-IN`) and Punjabi (`pa-IN`) rendering is implemented for all 44 accepted INE-001 authorities and all 360 English closure-review records.

The implementation preserves the source question's:

- authority and seed;
- difficulty and delivery profile;
- statement, conclusion, code-key and evidence counts;
- option count and option order;
- correct-answer index;
- guided-only versus permanent-QL-candidate boundary.

## Language policy

The localized questions use natural exam-facing Hindi and Punjabi instead of literal word-for-word translation. Contextual names are transliterated consistently, while mathematical variables and coded operators remain unchanged where changing them would alter the problem.

Explanations are deliberately short and learner-friendly. Each explanation displays the question-specific comparison or decoded chain before stating why the selected answer follows, without exposing solver terminology or internal proof machinery.

## Review artifacts

The `localization/review` directory contains three downloadable Markdown and JSON packs for each language:

- a complete 360-question review corpus;
- a 260-question exam-facing pack containing four options per question;
- a 100-question guided-learning pack, including the 24 internal three-option classifiers.

The exam-facing pack follows the approved `EXAMTREE_FOUR_OPTION` standard. It is suitable for ExamTree cross-exam practice but is not labelled as a pixel-exact reproduction of five-option IBPS/SBI interfaces.

## Safety state

Localization is implemented but not activated. Permanent QL identifiers are still unallocated, Question Studio visibility remains disabled, and public release remains disabled until human language review is approved.
