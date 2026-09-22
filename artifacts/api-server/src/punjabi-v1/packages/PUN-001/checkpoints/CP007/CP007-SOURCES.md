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
- 39 three-way ਸੰਬੰਧਕ authorities after the breadth pass: 13 ਪੂਰਨ + 13 ਅਪੂਰਨ + 13 ਦੁਬਾਜਰਾ
- 23 sentence-grounded ਯੋਜਕ authorities
- 37 contextual ਵਿਸਮਿਕ authorities

## Explicit boundary
Alternative donor ਸੰਬੰਧਕ labels such as ਵਿਕਾਰੀ/ਅਵਿਕਾਰੀ and semantic relation labels are not interchangeable with the approved ਪੂਰਨ/ਅਪੂਰਨ/ਦੁਬਾਜਰਾ taxonomy. They remain source/reference material, not runtime authorities in F04.

Weak or implicit ਕਾਰਕ marker examples are rejected rather than retained for count. Named/local examples are generalized where the grammar authority itself is sound.

## Sambandhak breadth verification
- The structural taxonomy remains ਪੂਰਨ / ਅਪੂਰਨ / ਦੁਬਾਜਰਾ.
- PSEB-aligned grammar examples verify ਪੂਰਨ forms such as ਦਾ/ਦੀ/ਦੇ/ਨੇ/ਨੂੰ/ਤੋਂ.
- PSEB-aligned examples verify ਅਪੂਰਨ usage such as ਤੋਂ ਪਰੇ and ਤੋਂ ਦੂਰ; the breadth bank also keeps sentence-grounded ਨੇੜੇ/ਕੋਲ/ਸਾਹਮਣੇ/ਅੱਗੇ examples where another relation form completes the construction.
- PSEB-aligned examples verify ਦੁਬਾਜਰਾ behavior for ਬਗੈਰ and ਉੱਤੇ, where the same relation word can appear alone or with a supporting form.
- A secondary Punjabi grammar reference supports ਕਰਕੇ/ਨਾਲ/ਰਾਹੀਂ as ਦੁਬਾਜਰਾ patterns.
- The earlier SR09 `ਦੇ ਸਾਹਮਣੇ` classification is corrected: the governed target is `ਸਾਹਮਣੇ`, classified as ਅਪੂਰਨ.

No fixed numerical target is used outside this explicit breadth-balancing pass.
