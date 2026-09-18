# CP012 Source and Donor Boundary

## Donor reference
- Legacy Punjabi CP012 and merged semantic V2 PR #1641 were inspected as donor material.
- The donor contained 202 proverb records but only 156 unique proverb strings.
- Repeated proverb variants and learner-facing English glosses were not treated as authority.

## Forward-port policy
The audited checkpoint keeps 64 high-confidence records satisfying all of:
- unique proverb text;
- unique first half;
- unique second half;
- unique reviewed meaning;
- authored situation;
- three Punjabi-only reviewed distractors;
- Punjabi-only explanation.

No synthetic situation shells are generated. All CP012 authorities remain review material until human editorial approval.
