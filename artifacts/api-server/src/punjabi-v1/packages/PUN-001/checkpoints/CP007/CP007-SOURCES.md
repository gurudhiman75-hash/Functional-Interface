# CP007 Retrofit Source and Donor Boundary

## Inputs
- historical CP007 donor corpus
- previously approved CP007 forward-port authority bank

## Donor inventory
- KARAK_ITEMS: 80 rows
- CONNECTOR_ITEMS: 28 mixed taxonomy records
- CONJUNCTION_TYPE_ITEMS: 8 sentence contexts

## Audit result
- 95 final ਕਾਰਕ authorities after donor/current union and marker normalization
- 9 approved three-way ਸੰਬੰਧਕ authorities retained as the baseline; 30 additional sentence-grounded authorities added in the breadth pass
- 23 sentence-grounded ਯੋਜਕ authorities
- 37 contextual ਵਿਸਮਿਕ authorities

## Explicit boundary
Alternative donor ਸੰਬੰਧਕ labels such as ਵਿਕਾਰੀ/ਅਵਿਕਾਰੀ and semantic relation labels are not interchangeable with the approved ਪੂਰਨ/ਅਪੂਰਨ/ਦੁਬਾਜਰਾ taxonomy. They remain source/reference material, not runtime authorities in F04.

Weak or implicit ਕਾਰਕ marker examples are rejected rather than retained for count. Named/local examples are generalized where the grammar authority itself is sound.

## Breadth-pass source registry\n- `PSEB8-SAMB-PURAN` — PSEB 8th Class Punjabi Vyakaran ਸੰਬੰਧਕ: https://psebsolutions.in/pseb-8th-class-punjabi-vyakaran-sambandhan/ — complete/pੂਰਨ definition and examples including ਦਾ, ਦੇ, ਨੇ, ਤੋਂ.\n- `PSEB8-SAMB-APURAN` — same PSEB 8 source — ਅਪੂਰਨ definition and explicit ਪਰੇ / ਦੂਰ examples.\n- `PSEB7-SAMB-APURAN` — PSEB 7th Class Punjabi Vyakaran ਸੰਬੰਧਕ: https://psebsolutions.com/pseb-7th-class-punjabi-vyakaran-sambandhak/ — supports the reviewed ਉਰੇ / ਪਰੇ pattern.\n- `PSEB8-SAMB-DUBAJRA` — same PSEB 8 source — explicit paired examples ਬਗੈਰ / ਦੇ ਬਗੈਰ and ਉੱਤੇ / ਦੇ ਉੱਤੇ.\n\nThe breadth pass does not promote other mixed-taxonomy donor labels. New learner-facing sentences are authored examples constrained by these checked classifications.\n\nNo fixed numerical target is used beyond balancing the three already-approved classes for review.
