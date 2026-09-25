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
- 9 approved three-way ਸੰਬੰਧਕ authorities retained as the baseline; 33 additional sentence-grounded authorities added in the breadth pass
- 23 sentence-grounded ਯੋਜਕ authorities
- 37 contextual ਵਿਸਮਿਕ authorities

## Explicit boundary
Alternative donor ਸੰਬੰਧਕ labels such as ਵਿਕਾਰੀ/ਅਵਿਕਾਰੀ and semantic relation labels are not interchangeable with the approved ਪੂਰਨ/ਅਪੂਰਨ/ਦੁਬਾਜਰਾ taxonomy. They remain source/reference material, not runtime authorities in F04.

Weak or implicit ਕਾਰਕ marker examples are rejected rather than retained for count. Named/local examples are generalized where the grammar authority itself is sound.

## Breadth-pass source registry
These are public secondary transcriptions/solutions of the PSEB grammar exercises, used as cross-check references rather than represented as official PSEB-hosted pages.

- `PSEB-SOLUTIONS-8-SAMB-PURAN` — PSEB 8th Class Punjabi Vyakaran ਸੰਬੰਧਕ: https://psebsolutions.in/pseb-8th-class-punjabi-vyakaran-sambandhan/ — ਪੂਰਨ definition and examples including ਦਾ, ਦੇ, ਨੇ, ਤੋਂ.
- `PSEB-SOLUTIONS-7-SAMB-PURAN` — PSEB 7th Class Punjabi Vyakaran ਸੰਬੰਧਕ: https://psebsolutions.com/pseb-7th-class-punjabi-vyakaran-sambandhak/ — explicitly lists ਦੀਆਂ, ਨੇ, ਨੂੰ, ਤੀਕ, ਤੋੜੀਂ, ਤੋਂ and ਥੋਂ as ਪੂਰਨ forms.
- `PSEB-SOLUTIONS-8-SAMB-APURAN` — same PSEB 8 source — ਅਪੂਰਨ definition and explicit ਪਰੇ / ਦੂਰ examples.
- `PSEB-SOLUTIONS-7-SAMB-APURAN` — PSEB 7th Class Punjabi Vyakaran ਸੰਬੰਧਕ: https://psebsolutions.com/pseb-7th-class-punjabi-vyakaran-sambandhak/ — supports the reviewed ਉਰੇ / ਪਰੇ pattern.
- `PSEB-SOLUTIONS-8-SAMB-CLASSIFY` — PSEB 8th Class Punjabi Vyakaran exercise: https://psebsolutions.com/pseb-8th-class-punjabi-vyakaran-sambandhak-1st-language/ — classifies ਕੋਲ and ਵਾਸਤੇ as ਅਪੂਰਨ and ਦੇ ਉੱਤੇ / ਦੇ ਬਗੈਰ as ਦੁਬਾਜਰਾ in the exercise surface.
- `PSEB-SOLUTIONS-8-SAMB-DUBAJRA` — same PSEB 8 source — explicit paired examples ਬਗੈਰ / ਦੇ ਬਗੈਰ and ਉੱਤੇ / ਦੇ ਉੱਤੇ.
- `PUNJABI-GRAMMAR-SAMB-APURAN` — PunjabiGrammar public grammar reference: https://www.punjabigrammar.com/2021/10/punjabi-grammar-introduction-of-sambandhak-in-punjabi-language-for-kids-and-students-for-class-5-6-7-8-9-10.html — explicitly lists ਸਾਹਮਣੇ among ਅਪੂਰਨ forms; used to correct inherited SR09.

The breadth pass does not promote other mixed-taxonomy donor labels. New learner-facing sentences are authored examples constrained by these checked classifications.

The breadth pass now contains 42 sentence-grounded ਸੰਬੰਧਕ authorities, balanced at 14 per approved class. These are context authorities, not 42 distinct lexical forms: the pack currently covers 20 distinct surface expressions (10 ਪੂਰਨ, 6 ਅਪੂਰਨ, 4 ਦੁਬਾਜਰਾ).
