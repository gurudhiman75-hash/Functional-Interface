# CP010 Retrofit Source and Donor Boundary

## Inputs
- Historical CP010 donor corpus from the Punjabi V1 content-engine line
- Historical CP010 semantic V2 PR #1633
- Previously approved forward-port CP010 head `528facac439c762f89eb91c59b4dac6a5638675d`

The approved 64-bank is treated as a canonical wording source only. It is not treated as the complete topic inventory.

## Donor audit
Raw donor:
- 255 rows
- 190 exact answer strings

After spelling normalization, synonym/concept collapse, ambiguity resolution, approved-wording forward merge, and quality exclusions:
- 177 distinct one-word substitution authorities

## Quality rules
- one governed answer per direct defining phrase;
- spelling variants do not inflate count;
- colloquial alternatives that create a second correct answer are collapsed into the standard exam form;
- same-domain families use organic domains with at least four authorities;
- English parenthetical glosses from donor explanations are not forwarded;
- learner explanations are regenerated in simple Punjabi;
- no fixed numerical cap is used.

## Explicit excluded donor concepts
- ਰੁਦਾਲੀ — donor definition was not reliable enough for direct exam authority
- ਦਰਸ਼ਨੀਕ — donor word/definition pairing was questionable
- ਛੂਤਹਾ — donor usage was not precise enough for direct one-word testing
- ਘੁਰਨਾ — donor lexical form was not reliable enough for this checkpoint

No retained count is targeted in advance.
