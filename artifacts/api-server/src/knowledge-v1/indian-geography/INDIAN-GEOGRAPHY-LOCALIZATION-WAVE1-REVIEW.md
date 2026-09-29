# Indian Geography Localization Retrofit — Wave 1

Status: REVIEW REQUIRED

## Packages
- GEO-LAK-001 — Lakes, Lagoons & Waterfalls
- GEO-MTP-001 — Mountain Passes & Major Peaks

## Canonical capacity
- 75 canonical questions per package
- 150 canonical questions total
- 450 localized runtime versions across English, Hindi and Punjabi

Translations do not increase knowledge capacity. All three languages share the same canonical question IDs, QL ownership, difficulty, source provenance and answer positions.

## Localization rules
- Hindi and Punjabi are authored as exam-facing language, not literal word-for-word mirrors.
- Punjabi uses native Gurmukhi sentence structure; Hindi syntax is not copied into Punjabi.
- Proper geographic names are transliterated consistently.
- Statement stems use:
  - Hindi: `निम्न कथनों पर विचार कीजिए`
  - Punjabi: `ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ`
- Technical terms such as lagoon, delta and crater are localized/transliterated only where they remain recognizable for competitive-exam usage.
- Same seed selects the same canonical questions and answer positions in EN/HI/PA.

## Runtime/lifecycle
- Question Studio languages: en, hi, pa
- localizationStatus: REVIEW_REQUIRED for Hindi/Punjabi
- Question Bank writes disabled
- mock/test/public publication disabled
- production release disabled

## Audit gates
- four unique options after localization
- correct-answer parity
- Devanagari/Gurmukhi script presence
- common English-residue blocking
- deterministic cross-language selection parity

## Review samples

### Lakes / Waterfalls
EN: Wular Lake is located in which Union Territory?
HI: वुलर झील किस केंद्र शासित प्रदेश में स्थित है?
PA: ਵੁਲਰ ਝੀਲ ਕਿਹੜੇ ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼ ਵਿੱਚ ਸਥਿਤ ਹੈ?

EN: What are the floating masses of vegetation and soil in Loktak Lake called?
HI: लोकटक झील में वनस्पति और मिट्टी के तैरते हुए समूहों को क्या कहा जाता है?
PA: ਲੋਕਤਕ ਝੀਲ ਵਿੱਚ ਬਨਸਪਤੀ ਅਤੇ ਮਿੱਟੀ ਦੇ ਤੈਰਦੇ ਸਮੂਹਾਂ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?

EN: A lake in Maharashtra occupies a meteorite-impact crater in basalt. Which lake is it?
HI: महाराष्ट्र में बेसाल्ट चट्टान में बने उल्कापिंड प्रभाव क्रेटर में कौन-सी झील स्थित है?
PA: ਮਹਾਰਾਸ਼ਟਰ ਵਿੱਚ ਬਸਾਲਟ ਚੱਟਾਨ ਦੇ ਉਲਕਾਪਿੰਡ ਟੱਕਰ ਨਾਲ ਬਣੇ ਕ੍ਰੇਟਰ ਵਿੱਚ ਕਿਹੜੀ ਝੀਲ ਸਥਿਤ ਹੈ?

### Passes / Peaks
EN: Zoji La connects the Kashmir Valley with which region?
HI: जोजी ला कश्मीर घाटी को किस क्षेत्र से जोड़ता है?
PA: ਜ਼ੋਜੀ ਲਾ ਕਸ਼ਮੀਰ ਘਾਟੀ ਨੂੰ ਕਿਹੜੇ ਖੇਤਰ ਨਾਲ ਜੋੜਦਾ ਹੈ?

EN: Which pilgrimage route is closely linked with Lipulekh Pass?
HI: लिपुलेख दर्रा किस तीर्थयात्रा मार्ग से जुड़ा है?
PA: ਲਿਪੁਲੇਖ ਦਰਰਾ ਕਿਹੜੇ ਤੀਰਥ-ਯਾਤਰਾ ਰਸਤੇ ਨਾਲ ਜੁੜਿਆ ਹੈ?

EN: A prominent peak near Ooty lies in the Nilgiri Hills. Which peak is it?
HI: ऊटी के निकट नीलगिरि पहाड़ियों की प्रमुख चोटी कौन-सी है?
PA: ਊਟੀ ਦੇ ਨੇੜੇ ਨੀਲਗਿਰੀ ਪਹਾੜੀਆਂ ਦੀ ਮੁੱਖ ਚੋਟੀ ਕਿਹੜੀ ਹੈ?
