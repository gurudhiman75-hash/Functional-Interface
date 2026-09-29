# WHI-001 CP016 Hindi and Punjabi Localization Status

**Status:** Hindi and Punjabi review candidates prepared; native-language and parity review remains open.

- Localizes the approved English CP016 pool in both languages, 60 questions each.
- Reuses the existing CP001–CP005 localized records for those selected origins; translates CP006–CP015 selected questions for this cumulative review.
- Each localized record uses a language-suffixed question ID and points to its English record through `englishQuestionId`.
- Preserves the CP016 fact ID, origin checkpoint/question/fact/source IDs, source IDs, difficulty, option keys/order, and correct answer position.
- All 180 records remain `reviewOnly: true` and `runtimeRegistered: false`.
- Contract test checks 60 rows per language, 4 questions per origin checkpoint, 10 families × 6, 18/30/12 difficulty balance, answer-key balance, and cross-language provenance/key parity.

**Pending before release:** native Hindi and Punjabi review, meaning/terminology review against the English source, and Question Studio metadata/route audit. These files are review candidates and are not learner-delivery content.
