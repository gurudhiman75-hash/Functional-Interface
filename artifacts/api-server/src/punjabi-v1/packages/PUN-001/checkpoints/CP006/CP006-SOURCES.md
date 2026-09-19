# CP006 Retrofit Source and Donor Boundary

## Inputs
- historical CP006 donor corpus
- previously approved CP006 forward-port head
- previously reviewed 24 verb contexts, 12 complete tense triplets and 12 aspect contexts

## Donor inventory
- VERB_SENTENCE_ITEMS: 125
- TENSE_SHIFT_PAIRS: 75
- TRANSITIVITY_CONVERSIONS: 40
- COMPOUND_VERB_ITEMS: 35
- ASPECT_SENTENCE_ITEMS: 35
- DHATU_ITEMS: 75
- PRERANARTHAK_ITEMS: 45

## Audit decisions
- duplicate sentence authorities collapse by governed context
- three verb sentences excluded because they cannot provide three clean sentence-derived distractors without using answer fragments
- one personal-name and one Delhi-specific tense shift excluded
- exact duplicate tense shift collapsed
- questionable ਰਿੱਝਣਾ → ਰਿੰਨ੍ਹਣਾ conversion excluded
- conditional/subjunctive donor records excluded from aspect because they are tense/mood, not the governed aspect categories
- root and causative tables remain outside this retrofit family boundary pending a dedicated lexical-standardization pass

No fixed target count is used.
