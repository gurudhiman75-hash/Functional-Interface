import type { SifContextDomain, SifDifficulty, SifDistractorType, SifLocalizedText, SifScenarioAuthority } from "./types.ts";

type L = readonly [string, string, string];
type Family = "IF_THEN" | "ONLY_IF" | "UNLESS" | "PROVIDED_THAT" | "WHENEVER" | "NEGATIVE_CONDITION" | "CONDITIONAL_CHAIN" | "SCOPE_CONDITION";
type Row = readonly [string, SifContextDomain, SifDifficulty, L, L, L, L, boolean];
const localized = ([en, hi, pa]: L): SifLocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const guard = { evaluatesSupport: true, assumptionQuestion: false, conclusionQuestion: false, argumentQuestion: false, causeEffectQuestion: false, courseOfActionQuestion: false } as const;
const families = {
  "IF_THEN": [
    [
      "COMPLETE-FORM",
      "PUBLIC_ADMINISTRATION",
      "MEDIUM",
      [
        "If an application contains the required proof of address, the clerk assigns it a tracking number. Asha's application contained the required proof. The office follows this rule for every application.",
        "यदि किसी आवेदन में पते का आवश्यक प्रमाण हो, तो लिपिक उसे ट्रैकिंग नंबर देता है। आशा के आवेदन में यह प्रमाण था। कार्यालय हर आवेदन पर यही नियम लागू करता है।",
        "ਜੇ ਕਿਸੇ ਅਰਜ਼ੀ ਨਾਲ ਪਤੇ ਦਾ ਲੋੜੀਂਦਾ ਸਬੂਤ ਹੋਵੇ, ਤਾਂ ਕਲਰਕ ਉਸ ਨੂੰ ਟ੍ਰੈਕਿੰਗ ਨੰਬਰ ਦਿੰਦਾ ਹੈ। ਆਸ਼ਾ ਦੀ ਅਰਜ਼ੀ ਨਾਲ ਇਹ ਸਬੂਤ ਸੀ। ਦਫ਼ਤਰ ਹਰ ਅਰਜ਼ੀ ਲਈ ਇਹ ਨਿਯਮ ਲਾਗੂ ਕਰਦਾ ਹੈ।"
      ],
      [
        "Asha's application receives a tracking number.",
        "आशा के आवेदन को ट्रैकिंग नंबर मिलता है।",
        "ਆਸ਼ਾ ਦੀ ਅਰਜ਼ੀ ਨੂੰ ਟ੍ਰੈਕਿੰਗ ਨੰਬਰ ਮਿਲਦਾ ਹੈ।"
      ],
      [
        "Every application with a tracking number contained proof of address.",
        "ट्रैकिंग नंबर वाले हर आवेदन में पते का प्रमाण था।",
        "ਟ੍ਰੈਕਿੰਗ ਨੰਬਰ ਵਾਲੀ ਹਰ ਅਰਜ਼ੀ ਨਾਲ ਪਤੇ ਦਾ ਸਬੂਤ ਸੀ।"
      ],
      [
        "Asha's application meets the stated condition, so the clerk assigns it a tracking number. The rule does not say that proof of address is the only possible route to a tracking number.",
        "आशा का आवेदन बताई गई शर्त पूरी करता है, इसलिए लिपिक उसे ट्रैकिंग नंबर देगा। नियम यह नहीं कहता कि ट्रैकिंग नंबर पाने का यही एक तरीका है।",
        "ਆਸ਼ਾ ਦੀ ਅਰਜ਼ੀ ਦੱਸੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ਕਲਰਕ ਉਸ ਨੂੰ ਟ੍ਰੈਕਿੰਗ ਨੰਬਰ ਦੇਵੇਗਾ। ਨਿਯਮ ਇਹ ਨਹੀਂ ਦੱਸਦਾ ਕਿ ਟ੍ਰੈਕਿੰਗ ਨੰਬਰ ਲੈਣ ਦਾ ਇਹੀ ਇੱਕ ਤਰੀਕਾ ਹੈ।"
      ],
      true
    ],
    [
      "COOLING-ALERT",
      "WORKPLACE",
      "MEDIUM",
      [
        "If the server room temperature rises above the set limit, an alert is sent to the facilities team. The alert log shows an alert at 14:00. The log does not state what triggered it.",
        "यदि सर्वर कक्ष का तापमान तय सीमा से ऊपर जाता है, तो सुविधाओं की टीम को चेतावनी भेजी जाती है। लॉग में दोपहर 2 बजे एक चेतावनी दर्ज है। लॉग यह नहीं बताता कि चेतावनी किस कारण आई।",
        "ਜੇ ਸਰਵਰ ਕਮਰੇ ਦਾ ਤਾਪਮਾਨ ਨਿਰਧਾਰਤ ਹੱਦ ਤੋਂ ਵੱਧ ਹੋਵੇ, ਤਾਂ ਸਹੂਲਤਾਂ ਵਾਲੀ ਟੀਮ ਨੂੰ ਚੇਤਾਵਨੀ ਭੇਜੀ ਜਾਂਦੀ ਹੈ। ਲੌਗ ਵਿੱਚ ਦੁਪਹਿਰ 2 ਵਜੇ ਚੇਤਾਵਨੀ ਦਰਜ ਹੈ। ਲੌਗ ਇਹ ਨਹੀਂ ਦੱਸਦਾ ਕਿ ਚੇਤਾਵਨੀ ਕਿਸ ਕਾਰਨ ਆਈ।"
      ],
      [
        "An alert was recorded at 2 p.m.",
        "दोपहर 2 बजे चेतावनी दर्ज हुई।",
        "ਦੁਪਹਿਰ 2 ਵਜੇ ਚੇਤਾਵਨੀ ਦਰਜ ਹੋਈ।"
      ],
      [
        "The alert was caused by a temperature rise.",
        "तापमान बढ़ने के कारण चेतावनी आई।",
        "ਤਾਪਮਾਨ ਵਧਣ ਕਾਰਨ ਚੇਤਾਵਨੀ ਆਈ।"
      ],
      [
        "The log directly records an alert at 2 p.m. It does not identify the trigger, so a temperature rise cannot be inferred.",
        "लॉग में 14:00 बजे चेतावनी दर्ज है। चेतावनी किस कारण आई, यह नहीं बताया गया; इसलिए तापमान बढ़ने का अनुमान नहीं लगाया जा सकता।",
        "ਲੌਗ ਵਿੱਚ 14:00 ਵਜੇ ਚੇਤਾਵਨੀ ਦਰਜ ਹੈ। ਚੇਤਾਵਨੀ ਕਿਸ ਕਾਰਨ ਆਈ, ਇਹ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ; ਇਸ ਲਈ ਤਾਪਮਾਨ ਵਧਣ ਦਾ ਅਨੁਮਾਨ ਨਹੀਂ ਲਾਇਆ ਜਾ ਸਕਦਾ।"
      ],
      false
    ],
    [
      "LIBRARY-HOLD",
      "EDUCATION",
      "HARD",
      [
        "If a reserved book is not collected within two working days, the reservation is cancelled. Neel's book remained uncollected for three working days. The library applies the rule from the end of the second working day.",
        "यदि आरक्षित पुस्तक दो कार्यदिवसों के भीतर नहीं ली जाती, तो आरक्षण रद्द कर दिया जाता है। नील ने पुस्तक तीन कार्यदिवसों तक नहीं ली। पुस्तकालय दूसरे कार्यदिवस के अंत से यह नियम लागू करता है।",
        "ਜੇ ਰਾਖਵੀਂ ਕਿਤਾਬ ਦੋ ਕੰਮਕਾਜੀ ਦਿਨਾਂ ਅੰਦਰ ਨਾ ਲਈ ਜਾਵੇ, ਤਾਂ ਰਾਖਵਾਂਕਰਨ ਰੱਦ ਕਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਨੀਲ ਨੇ ਤਿੰਨ ਕੰਮਕਾਜੀ ਦਿਨਾਂ ਤੱਕ ਕਿਤਾਬ ਨਹੀਂ ਲਈ। ਲਾਇਬ੍ਰੇਰੀ ਦੂਜੇ ਕੰਮਕਾਜੀ ਦਿਨ ਦੇ ਅੰਤ ਤੋਂ ਇਹ ਨਿਯਮ ਲਾਗੂ ਕਰਦੀ ਹੈ।"
      ],
      [
        "Neel's reservation has been cancelled.",
        "नील का आरक्षण रद्द कर दिया गया है।",
        "ਨੀਲ ਦਾ ਰਾਖਵਾਂਕਰਨ ਰੱਦ ਹੋ ਗਿਆ ਹੈ।"
      ],
      [
        "Neel chose not to collect the book because he no longer needed it.",
        "नील ने पुस्तक इसलिए नहीं ली क्योंकि अब उसे उसकी जरूरत नहीं थी।",
        "ਨੀਲ ਨੇ ਕਿਤਾਬ ਇਸ ਲਈ ਨਹੀਂ ਲਈ ਕਿਉਂਕਿ ਹੁਣ ਉਸ ਨੂੰ ਇਸ ਦੀ ਲੋੜ ਨਹੀਂ ਸੀ।"
      ],
      [
        "The book remained uncollected beyond the two-working-day limit, so the stated rule cancels the reservation. The passage gives no reason why Neel did not collect it.",
        "नील ने पुस्तक दो कार्यदिवसों की सीमा के बाद भी नहीं ली, इसलिए नियम के अनुसार आरक्षण रद्द हो जाता है। पुस्तक न लेने का कारण नहीं बताया गया।",
        "ਨੀਲ ਨੇ ਦੋ ਕੰਮਕਾਜੀ ਦਿਨਾਂ ਦੀ ਮਿਆਦ ਤੋਂ ਬਾਅਦ ਵੀ ਕਿਤਾਬ ਨਹੀਂ ਲਈ, ਇਸ ਲਈ ਨਿਯਮ ਮੁਤਾਬਕ ਰਾਖਵਾਂਕਰਨ ਰੱਦ ਹੋ ਜਾਂਦਾ ਹੈ। ਕਿਤਾਬ ਨਾ ਲੈਣ ਦਾ ਕਾਰਨ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ।"
      ],
      false
    ]
  ],
  "ONLY_IF": [
    [
      "DESIGNATED-ZONE",
      "WORKPLACE",
      "MEDIUM",
      [
        "Employees receive the field allowance only if they are assigned to a designated zone. Rina received the allowance for March. The rule states a requirement, not an automatic payment for every eligible employee.",
        "कर्मचारियों को क्षेत्रीय भत्ता तभी मिलता है जब उन्हें निर्धारित क्षेत्र में तैनात किया गया हो। रीना को मार्च का भत्ता मिला। यह नियम एक आवश्यक शर्त बताता है, हर पात्र कर्मचारी को अपने-आप भुगतान नहीं।",
        "ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਫੀਲਡ ਭੱਤਾ ਤਾਂ ਹੀ ਮਿਲਦਾ ਹੈ ਜੇ ਉਨ੍ਹਾਂ ਦੀ ਤਾਇਨਾਤੀ ਨਿਰਧਾਰਤ ਖੇਤਰ ਵਿੱਚ ਹੋਵੇ। ਰੀਨਾ ਨੂੰ ਮਾਰਚ ਦਾ ਭੱਤਾ ਮਿਲਿਆ। ਇਹ ਨਿਯਮ ਇੱਕ ਲਾਜ਼ਮੀ ਸ਼ਰਤ ਦੱਸਦਾ ਹੈ, ਹਰ ਯੋਗ ਕਰਮਚਾਰੀ ਨੂੰ ਆਪਣੇ-ਆਪ ਭੁਗਤਾਨ ਨਹੀਂ।"
      ],
      [
        "Rina was assigned to a designated zone.",
        "रीना को निर्धारित क्षेत्र में तैनात किया गया था।",
        "ਰੀਨਾ ਦੀ ਤਾਇਨਾਤੀ ਨਿਰਧਾਰਤ ਖੇਤਰ ਵਿੱਚ ਸੀ।"
      ],
      [
        "Every employee assigned to a designated zone received the field allowance.",
        "निर्धारित क्षेत्र में तैनात हर कर्मचारी को क्षेत्रीय भत्ता मिला।",
        "ਨਿਰਧਾਰਤ ਖੇਤਰ ਵਿੱਚ ਤਾਇਨਾਤ ਹਰ ਕਰਮਚਾਰੀ ਨੂੰ ਫੀਲਡ ਭੱਤਾ ਮਿਲਿਆ।"
      ],
      [
        [
          "“Only if” makes designated-zone assignment necessary for receiving the allowance. Rina received it, so she met that requirement; the rule does not guarantee payment to every person assigned there."
        ],
        "भत्ता पाने के लिए निर्धारित क्षेत्र में तैनाती आवश्यक है। रीना को भत्ता मिला, इसलिए यह शर्त पूरी थी; लेकिन इससे यह सिद्ध नहीं होता कि वहाँ तैनात हर कर्मचारी को भत्ता मिला।",
        "ਭੱਤਾ ਲੈਣ ਲਈ ਨਿਰਧਾਰਤ ਖੇਤਰ ਵਿੱਚ ਤਾਇਨਾਤੀ ਲਾਜ਼ਮੀ ਹੈ। ਰੀਨਾ ਨੂੰ ਭੱਤਾ ਮਿਲਿਆ, ਇਸ ਲਈ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਸੀ; ਪਰ ਇਸ ਤੋਂ ਇਹ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਕਿ ਉੱਥੇ ਤਾਇਨਾਤ ਹਰ ਕਰਮਚਾਰੀ ਨੂੰ ਭੱਤਾ ਮਿਲਿਆ।"
      ],
      true
    ],
    [
      "SIGNED-RECEIPT",
      "BUSINESS",
      "MEDIUM",
      [
        "A supplier releases a consignment only if the buyer signs the delivery receipt. The consignment was released to a buyer on Tuesday. The receipt rule applies to all releases.",
        "ਸਪਲਾਇਰ ਮਾਲ ਤਦ ਹੀ ਭੇਜਦਾ ਹੈ ਜਦੋਂ ਖਰੀਦਦਾਰ ਡਿਲਿਵਰੀ ਰਸੀਦ 'ਤੇ ਦਸਤਖ਼ਤ ਕਰੇ। ਮੰਗਲਵਾਰ ਨੂੰ ਇੱਕ ਖਰੀਦਦਾਰ ਨੂੰ ਮਾਲ ਭੇਜਿਆ ਗਿਆ। ਇਹ ਨਿਯਮ ਹਰ ਭੇਜੀ ਗਈ ਖੇਪ 'ਤੇ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।",
        "ਸਪਲਾਇਰ ਖੇਪ ਤਾਂ ਹੀ ਭੇਜਦਾ ਹੈ ਜੇ ਖਰੀਦਦਾਰ ਡਿਲਿਵਰੀ ਰਸੀਦ 'ਤੇ ਦਸਤਖ਼ਤ ਕਰੇ। ਮੰਗਲਵਾਰ ਨੂੰ ਇੱਕ ਖਰੀਦਦਾਰ ਨੂੰ ਖੇਪ ਭੇਜੀ ਗਈ। ਇਹ ਨਿਯਮ ਹਰ ਭੇਜੀ ਖੇਪ 'ਤੇ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।"
      ],
      [
        "The buyer signed the delivery receipt.",
        "ਖरीददार ने डिलिवरी रसीद पर हस्ताक्षर किए।",
        "ਖਰੀਦਦਾਰ ਨੇ ਡਿਲਿਵਰੀ ਰਸੀਦ 'ਤੇ ਦਸਤਖ਼ਤ ਕੀਤੇ।"
      ],
      [
        "The signed receipt was the reason the supplier released the consignment.",
        "हस्ताक्षरित रसीद ही मॉल भेजने का कारण थी।",
        "ਦਸਤਖ਼ਤ ਕੀਤੀ ਰਸੀਦ ਹੀ ਖੇਪ ਭੇਜਣ ਦਾ ਕਾਰਨ ਸੀ।"
      ],
      [
        [
          "A signed receipt is required for every release, so the buyer must have signed it. The rule does not establish that the signature was the reason for release or the only relevant step."
        ],
        "हर खेप भेजने से पहले हस्ताक्षरित रसीद जरूरी है, इसलिए खरीदार ने उस पर हस्ताक्षर किए होंगे। नियम यह नहीं बताता कि हस्ताक्षर ही खेप भेजने का कारण थे।",
        "ਹਰ ਖੇਪ ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ ਦਸਤਖ਼ਤ ਕੀਤੀ ਰਸੀਦ ਲਾਜ਼ਮੀ ਹੈ, ਇਸ ਲਈ ਖਰੀਦਦਾਰ ਨੇ ਇਸ 'ਤੇ ਦਸਤਖ਼ਤ ਕੀਤੇ ਹੋਣਗੇ। ਨਿਯਮ ਇਹ ਨਹੀਂ ਦੱਸਦਾ ਕਿ ਦਸਤਖ਼ਤ ਹੀ ਖੇਪ ਭੇਜਣ ਦਾ ਕਾਰਨ ਸਨ।"
      ],
      false
    ],
    [
      "EXAM-ELIGIBILITY",
      "EDUCATION",
      "HARD",
      [
        "A candidate may sit the practical examination only if the attendance requirement has been met. The candidate's attendance record meets that requirement. The notice does not say that meeting it alone completes all examination formalities.",
        "उम्मीदवार प्रायोगिक परीक्षा में तभी बैठ सकता है जब उपस्थिति की शर्त पूरी हो। उम्मीदवार का उपस्थिति रिकॉर्ड इस शर्त को पूरा करता है। सूचना यह नहीं कहती कि केवल यह शर्त पूरी करना ही सारी औपचारिकताओं के लिए पर्याप्त है।",
        "ਉਮੀਦਵਾਰ ਪ੍ਰੈਕਟੀਕਲ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਤਾਂ ਹੀ ਬੈਠ ਸਕਦਾ ਹੈ ਜੇ ਹਾਜ਼ਰੀ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਹੋਵੇ। ਉਮੀਦਵਾਰ ਦਾ ਹਾਜ਼ਰੀ ਰਿਕਾਰਡ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦਾ ਹੈ। ਨੋਟਿਸ ਇਹ ਨਹੀਂ ਕਹਿੰਦਾ ਕਿ ਸਿਰਫ਼ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨਾ ਸਾਰੀਆਂ ਰਸਮਾਂ ਲਈ ਕਾਫ਼ੀ ਹੈ।"
      ],
      [
        "The candidate has met the attendance requirement stated for the practical examination.",
        "उम्मीदवार ने प्रायोगिक परीक्षा के लिए बताई गई उपस्थिति की शर्त पूरी की है।",
        "ਉਮੀਦਵਾਰ ਨੇ ਪ੍ਰੈਕਟੀਕਲ ਪ੍ਰੀਖਿਆ ਲਈ ਦੱਸੀ ਹਾਜ਼ਰੀ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕੀਤੀ ਹੈ।"
      ],
      [
        "The candidate is guaranteed a seat in the practical examination.",
        "उम्मीदवार की प्रायोगिक परीक्षा में सीट पक्की है।",
        "ਉਮੀਦਵਾਰ ਦੀ ਪ੍ਰੈਕਟੀਕਲ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਸੀਟ ਪੱਕੀ ਹੈ।"
      ],
      [
        "The attendance condition is met, but “only if” makes it necessary rather than sufficient. This establishes that condition alone, not a guaranteed examination seat.",
        "उपस्थिति की शर्त पूरी है, लेकिन “तभी” इसे आवश्यक शर्त बनाता है, अपने-आप पर्याप्त नहीं। इससे परीक्षा में सीट पक्की होना सिद्ध नहीं होता।",
        "ਹਾਜ਼ਰੀ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਹੈ, ਪਰ “ਤਾਂ ਹੀ” ਇਸ ਨੂੰ ਲਾਜ਼ਮੀ ਸ਼ਰਤ ਬਣਾਉਂਦਾ ਹੈ, ਆਪਣੇ-ਆਪ ਕਾਫ਼ੀ ਨਹੀਂ। ਇਸ ਤੋਂ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਸੀਟ ਪੱਕੀ ਹੋਣਾ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।"
      ],
      false
    ]
  ],
  "UNLESS": [
    [
      "PAYMENT-DISPATCH",
      "BUSINESS",
      "MEDIUM",
      [
        "Unless the invoice is paid by Friday, the order will remain on hold. The buyer has not paid it by Friday. The dispatch note records no separate exception to this rule.",
        "जब तक शुक्रवार तक बिल का भुगतान नहीं होता, ऑर्डर रोका रहेगा। खरीदार ने शुक्रवार तक भुगतान नहीं किया। डिस्पैच नोट में इस नियम का कोई अलग अपवाद दर्ज नहीं है।",
        "ਜਦ ਤੱਕ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਬਿੱਲ ਦਾ ਭੁਗਤਾਨ ਨਹੀਂ ਹੁੰਦਾ, ਆਰਡਰ ਰੋਕਿਆ ਰਹੇਗਾ। ਖਰੀਦਦਾਰ ਨੇ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਭੁਗਤਾਨ ਨਹੀਂ ਕੀਤਾ। ਡਿਸਪੈਚ ਨੋਟ ਵਿੱਚ ਇਸ ਨਿਯਮ ਦਾ ਕੋਈ ਵੱਖਰਾ ਅਪਵਾਦ ਦਰਜ ਨਹੀਂ ਹੈ।"
      ],
      [
        "The order remains on hold.",
        "ऑर्डर रोका हुआ है।",
        "ਆਰਡਰ ਰੋਕਿਆ ਹੋਇਆ ਹੈ।"
      ],
      [
        "The order will be dispatched immediately once payment is made.",
        "भुगतान होते ही ऑर्डर तुरंत भेज दिया जाएगा।",
        "ਭੁਗਤਾਨ ਹੁੰਦੇ ਹੀ ਆਰਡਰ ਤੁਰੰਤ ਭੇਜ ਦਿੱਤਾ ਜਾਵੇਗਾ।"
      ],
      [
        [
          "The unpaid-by-Friday condition activates the stated hold rule, so the order remains on hold. The statement gives no guarantee about how soon it will be dispatched after payment."
        ],
        "शुक्रवार तक भुगतान न होने पर ऑर्डर रोकने का नियम लागू होता है। भुगतान के बाद ऑर्डर कितनी जल्दी भेजा जाएगा, इसकी कोई गारंटी नहीं दी गई।",
        "ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਭੁਗਤਾਨ ਨਾ ਹੋਣ 'ਤੇ ਆਰਡਰ ਰੋਕਣ ਵਾਲਾ ਨਿਯਮ ਲਾਗੂ ਹੁੰਦਾ ਹੈ। ਭੁਗਤਾਨ ਤੋਂ ਬਾਅਦ ਆਰਡਰ ਕਿੰਨੀ ਜਲਦੀ ਭੇਜਿਆ ਜਾਵੇਗਾ, ਇਸ ਦੀ ਕੋਈ ਗਾਰੰਟੀ ਨਹੀਂ।"
      ],
      true
    ],
    [
      "STAFF-COVER",
      "PUBLIC_ADMINISTRATION",
      "MEDIUM",
      [
        "Unless a replacement officer is appointed, the counter will close at 16:00. No replacement has been appointed for Thursday. The roster gives no alternative arrangement for that day.",
        "जब तक किसी दूसरे अधिकारी की नियुक्ति नहीं होती, काउंटर शाम 4 बजे बंद होगा। गुरुवार के लिए किसी दूसरे अधिकारी की नियुक्ति नहीं हुई। ड्यूटी सूची में उस दिन की कोई वैकल्पिक व्यवस्था नहीं है।",
        "ਜਦ ਤੱਕ ਕਿਸੇ ਹੋਰ ਅਧਿਕਾਰੀ ਦੀ ਨਿਯੁਕਤੀ ਨਹੀਂ ਹੁੰਦੀ, ਕਾਊਂਟਰ ਸ਼ਾਮ 4 ਵਜੇ ਬੰਦ ਹੋਵੇਗਾ। ਵੀਰਵਾਰ ਲਈ ਕਿਸੇ ਹੋਰ ਅਧਿਕਾਰੀ ਦੀ ਨਿਯੁਕਤੀ ਨਹੀਂ ਹੋਈ। ਡਿਊਟੀ ਸੂਚੀ ਵਿੱਚ ਉਸ ਦਿਨ ਲਈ ਕੋਈ ਹੋਰ ਪ੍ਰਬੰਧ ਨਹੀਂ ਹੈ।"
      ],
      [
        "The counter is scheduled to close at 4 p.m. on Thursday.",
        "ਵੀਰਵਾਰ ਨੂੰ ਕਾਊਂਟਰ ਸ਼ਾਮ 4 ਵਜੇ ਬੰਦ ਹੋਣਾ ਨਿਰਧਾਰਤ ਹੈ।",
        "ਵੀਰਵਾਰ ਨੂੰ ਕਾਊਂਟਰ ਸ਼ਾਮ 4 ਵਜੇ ਬੰਦ ਹੋਵੇਗਾ।"
      ],
      [
        "The counter will remain closed for the entire day on Thursday.",
        "वीरवार को काउंटर पूरे दिन बंद रहेगा।",
        "ਵੀਰਵਾਰ ਨੂੰ ਕਾਊਂਟਰ ਸਾਰਾ ਦਿਨ ਬੰਦ ਰਹੇਗਾ।"
      ],
      [
        "With no replacement appointed, the rule schedules closing at 4 p.m. It says nothing about the counter's opening or service before that time.",
        "किसी दूसरे अधिकारी की नियुक्ति नहीं हुई, इसलिए नियम के अनुसार काउंटर 16:00 बजे बंद होगा। इससे पहले के समय के बारे में कुछ नहीं कहा गया।",
        "ਕਿਸੇ ਹੋਰ ਅਧਿਕਾਰੀ ਦੀ ਨਿਯੁਕਤੀ ਨਹੀਂ ਹੋਈ, ਇਸ ਲਈ ਨਿਯਮ ਮੁਤਾਬਕ ਕਾਊਂਟਰ 16:00 ਵਜੇ ਬੰਦ ਹੋਵੇਗਾ। ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਦੇ ਸਮੇਂ ਬਾਰੇ ਕੁਝ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ।"
      ],
      false
    ],
    [
      "DOCUMENT-REVIEW",
      "BANKING",
      "HARD",
      [
        "Unless both identity proof and the signed form are submitted, an account-change request is not sent for review. The file contains the signed form but no identity proof. The checklist applies to every request in this batch.",
        "जब तक पहचान का प्रमाण और हस्ताक्षरित फॉर्म दोनों जमा न हों, खाते में बदलाव का अनुरोध जाँच के लिए नहीं भेजा जाता। फाइल में हस्ताक्षरित फॉर्म है, लेकिन पहचान का प्रमाण नहीं। यह सूची इस बैच के हर अनुरोध पर लागू है।",
        "ਜਦ ਤੱਕ ਪਛਾਣ ਦਾ ਸਬੂਤ ਅਤੇ ਦਸਤਖ਼ਤ ਕੀਤਾ ਫਾਰਮ ਦੋਵੇਂ ਜਮ੍ਹਾਂ ਨਾ ਹੋਣ, ਖਾਤਾ ਬਦਲਣ ਦੀ ਬੇਨਤੀ ਨੂੰ ਜਾਂਚ ਲਈ ਅੱਗੇ ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ। ਫਾਈਲ ਵਿੱਚ ਦਸਤਖ਼ਤ ਕੀਤਾ ਫਾਰਮ ਹੈ ਪਰ ਪਛਾਣ ਦਾ ਸਬੂਤ ਨਹੀਂ। ਇਹ ਸੂਚੀ ਇਸ ਬੈਚ ਦੀ ਹਰ ਬੇਨਤੀ 'ਤੇ ਲਾਗੂ ਹੈ।"
      ],
      [
        "The request is not sent for review.",
        "ਬੇਨਤੀ ਜਾਂਚ ਲਈ ਨਹੀਂ ਭੇਜੀ ਜਾਂਦੀ।",
        "ਬੇਨਤੀ ਨੂੰ ਜਾਂਚ ਲਈ ਅੱਗੇ ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ।"
      ],
      [
        "The request will be rejected permanently.",
        "बेनती को हमेशा के लिए अस्वीकार कर दिया जाएगा।",
        "ਬੇਨਤੀ ਨੂੰ ਪੱਕੇ ਤੌਰ 'ਤੇ ਰੱਦ ਕਰ ਦਿੱਤਾ ਜਾਵੇਗਾ।"
      ],
      [
        [
          "One required document is missing, so the request does not meet the condition for review and is not sent. The rule says nothing about permanent rejection."
        ],
        "पहचान का प्रमाण न होने से अनुरोध जाँच की शर्त पूरी नहीं करता और उसे आगे नहीं भेजा जाएगा। नियम स्थायी अस्वीकृति की बात नहीं करता।",
        "ਪਛਾਣ ਦਾ ਸਬੂਤ ਨਾ ਹੋਣ ਕਰਕੇ ਬੇਨਤੀ ਜਾਂਚ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਨਹੀਂ ਕਰਦੀ ਅਤੇ ਇਸ ਨੂੰ ਅੱਗੇ ਨਹੀਂ ਭੇਜਿਆ ਜਾਵੇਗਾ। ਨਿਯਮ ਪੱਕੇ ਤੌਰ 'ਤੇ ਰੱਦ ਕਰਨ ਦੀ ਗੱਲ ਨਹੀਂ ਕਰਦਾ।"
      ],
      false
    ]
  ],
  "PROVIDED_THAT": [
    [
      "VISITOR-REGISTER",
      "PUBLIC_ADMINISTRATION",
      "MEDIUM",
      [
        "Visitors may enter the archive provided that they sign the register at reception. Dev signs the register before going to the archive. Reception staff follow the same entry rule throughout the day.",
        "अभिलेखागार में आने वाले लोग तभी प्रवेश कर सकते हैं जब वे स्वागत कक्ष में रजिस्टर पर हस्ताक्षर करें। देव अभिलेखागार जाने से पहले रजिस्टर पर हस्ताक्षर करता है। स्वागत कक्ष पूरे दिन यही नियम मानता है।",
        "ਮਹਿਮਾਨ ਪੁਰਾਲੇਖ ਵਿੱਚ ਤਦ ਹੀ ਦਾਖ਼ਲ ਹੋ ਸਕਦੇ ਹਨ ਜੇ ਉਹ ਸਵਾਗਤ ਕਮਰੇ ਵਿੱਚ ਰਜਿਸਟਰ 'ਤੇ ਦਸਤਖ਼ਤ ਕਰਨ। ਦੇਵ ਪੁਰਾਲੇਖ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਰਜਿਸਟਰ 'ਤੇ ਦਸਤਖ਼ਤ ਕਰਦਾ ਹੈ। ਸਵਾਗਤ ਕਮਰਾ ਸਾਰਾ ਦਿਨ ਇਹੀ ਨਿਯਮ ਮੰਨਦਾ ਹੈ।"
      ],
      [
        "Dev is permitted to enter the archive.",
        "देव को अभिलेखागार में प्रवेश की अनुमति है।",
        "ਦੇਵ ਨੂੰ ਪੁਰਾਲੇਖ ਵਿੱਚ ਦਾਖ਼ਲ ਹੋਣ ਦੀ ਇਜਾਜ਼ਤ ਹੈ।"
      ],
      [
        "Every visitor who signs the register actually enters the archive.",
        "रजिस्टर पर हस्ताक्षर करने वाला हर व्यक्ति अभिलेखागार में प्रवेश करता है।",
        "ਰਜਿਸਟਰ 'ਤੇ ਦਸਤਖ਼ਤ ਕਰਨ ਵਾਲਾ ਹਰ ਵਿਅਕਤੀ ਪੁਰਾਲੇਖ ਵਿੱਚ ਦਾਖ਼ਲ ਹੁੰਦਾ ਹੈ।"
      ],
      [
        [
          "Signing meets the stated condition that permits entry, so Dev may enter. Permission does not show that every signer actually chooses to enter."
        ],
        "देव ने रजिस्टर पर हस्ताक्षर कर दिए, इसलिए प्रवेश की बताई गई शर्त पूरी है और उसे अंदर जाने की अनुमति है। हस्ताक्षर करने का अर्थ यह नहीं कि हर व्यक्ति वास्तव में अंदर जाता है।",
        "ਦੇਵ ਨੇ ਰਜਿਸਟਰ 'ਤੇ ਦਸਤਖ਼ਤ ਕਰ ਦਿੱਤੇ, ਇਸ ਲਈ ਦਾਖ਼ਲੇ ਦੀ ਦੱਸੀ ਸ਼ਰਤ ਪੂਰੀ ਹੈ ਅਤੇ ਉਸ ਨੂੰ ਅੰਦਰ ਜਾਣ ਦੀ ਇਜਾਜ਼ਤ ਹੈ। ਦਸਤਖ਼ਤ ਕਰਨ ਦਾ ਮਤਲਬ ਇਹ ਨਹੀਂ ਕਿ ਹਰ ਵਿਅਕਤੀ ਅਸਲ ਵਿੱਚ ਅੰਦਰ ਜਾਂਦਾ ਹੈ।"
      ],
      true
    ],
    [
      "BUS-RESERVATION",
      "TRANSPORT",
      "HARD",
      [
        "A passenger can reserve a seat on the airport bus provided that the booking is made at least one day ahead. Meena booked her seat two days before travel. The service accepts reservations under this rule.",
        "ਹਵਾਈ ਅੱਡੇ ਵਾਲੀ ਬੱਸ ਵਿੱਚ ਸੀਟ ਤਦ ਹੀ ਰਾਖਵੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ ਜੇ ਬੁਕਿੰਗ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਦਿਨ ਪਹਿਲਾਂ ਹੋਵੇ। ਮੀਨਾ ਨੇ ਯਾਤਰਾ ਤੋਂ ਦੋ ਦਿਨ ਪਹਿਲਾਂ ਸੀਟ ਬੁੱਕ ਕੀਤੀ। ਸੇਵਾ ਇਸ ਨਿਯਮ ਅਧੀਨ ਰਾਖਵਾਂਕਰਨ ਸਵੀਕਾਰਦੀ ਹੈ।",
        "ਹਵਾਈ ਅੱਡੇ ਦੀ ਬੱਸ ਵਿੱਚ ਸੀਟ ਤਾਂ ਹੀ ਰਾਖਵੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ ਜੇ ਬੁਕਿੰਗ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਦਿਨ ਪਹਿਲਾਂ ਹੋਵੇ। ਮੀਨਾ ਨੇ ਯਾਤਰਾ ਤੋਂ ਦੋ ਦਿਨ ਪਹਿਲਾਂ ਸੀਟ ਬੁੱਕ ਕੀਤੀ। ਸੇਵਾ ਇਸ ਨਿਯਮ ਅਧੀਨ ਰਾਖਵਾਂਕਰਨ ਸਵੀਕਾਰਦੀ ਹੈ।"
      ],
      [
        "Meena's booking meets the stated timing condition for a reservation.",
        "ਮੀना की बुकिंग आरक्षण की बताई गई समय-शर्त पूरी करती है।",
        "ਮੀਨਾ ਦੀ ਬੁਕਿੰਗ ਰਾਖਵਾਂਕਰਨ ਦੀ ਦੱਸੀ ਸਮੇਂ ਵਾਲੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੀ ਹੈ।"
      ],
      [
        "Meena is guaranteed a window seat.",
        "मीना को खिड़की वाली सीट निश्चित रूप से मिलेगी।",
        "ਮੀਨਾ ਨੂੰ ਖਿੜਕੀ ਵਾਲੀ ਸੀਟ ਪੱਕੀ ਮਿਲੇਗੀ।"
      ],
      [
        "The booking was made more than one day ahead, so it meets the stated timing condition. The rule does not specify the seat position or guarantee a window seat.",
        "मीना ने यात्रा से दो दिन पहले बुकिंग की, इसलिए उसने समय की शर्त पूरी की। नियम खिड़की वाली सीट की गारंटी नहीं देता।",
        "ਮੀਨਾ ਨੇ ਯਾਤਰਾ ਤੋਂ ਦੋ ਦਿਨ ਪਹਿਲਾਂ ਬੁਕਿੰਗ ਕੀਤੀ, ਇਸ ਲਈ ਸਮੇਂ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਹੋ ਗਈ। ਨਿਯਮ ਖਿੜਕੀ ਵਾਲੀ ਸੀਟ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ ਦਿੰਦਾ।"
      ],
      false
    ],
    [
      "LAB-ACCESS",
      "HEALTHCARE",
      "HARD",
      [
        "A technician may use the evening laboratory provided that a supervisor is present. On Tuesday evening a supervisor was present while the laboratory was in use. The rule concerns permission to use the room, not who operated each instrument.",
        "तकनीशियन शाम की प्रयोगशाला का उपयोग तभी कर सकता है जब पर्यवेक्षक मौजूद हो। मंगलवार शाम प्रयोगशाला के उपयोग के दौरान एक पर्यवेक्षक मौजूद था। यह नियम कमरे के उपयोग की अनुमति से जुड़ा है, हर उपकरण किसने चलाया इससे नहीं।",
        "ਟੈਕਨੀਸ਼ੀਅਨ ਸ਼ਾਮ ਦੀ ਲੈਬ ਵਰਤ ਸਕਦਾ ਹੈ ਜੇ ਨਿਗਰਾਨ ਮੌਜੂਦ ਹੋਵੇ। ਮੰਗਲਵਾਰ ਸ਼ਾਮ ਲੈਬ ਵਰਤਣ ਸਮੇਂ ਇੱਕ ਨਿਗਰਾਨ ਮੌਜੂਦ ਸੀ। ਇਹ ਨਿਯਮ ਕਮਰੇ ਦੀ ਵਰਤੋਂ ਦੀ ਇਜਾਜ਼ਤ ਬਾਰੇ ਹੈ, ਹਰ ਯੰਤਰ ਕਿਸ ਨੇ ਚਲਾਇਆ ਇਸ ਬਾਰੇ ਨਹੀਂ।"
      ],
      [
        "A technician was permitted to use the evening laboratory on Tuesday.",
        "ਮੰਗਲਵਾਰ ਨੂੰ ਟੈਕਨੀਸ਼ੀਅਨ ਨੂੰ ਸ਼ਾਮ ਦੀ ਲੈਬ ਵਰਤਣ ਦੀ ਇਜਾਜ਼ਤ ਸੀ।",
        "ਮੰਗਲਵਾਰ ਸ਼ਾਮ ਲੈਬ ਵਰਤਣ ਲਈ ਟੈਕਨੀਸ਼ੀਅਨ ਨੂੰ ਇਜਾਜ਼ਤ ਸੀ।"
      ],
      [
        "The supervisor personally operated every instrument used that evening.",
        "पर्यवेक्षक ने उस शाम इस्तेमाल हुए हर उपकरण को स्वयं चलाया।",
        "ਨਿਗਰਾਨ ਨੇ ਉਸ ਸ਼ਾਮ ਵਰਤੇ ਹਰ ਯੰਤਰ ਨੂੰ ਖੁਦ ਚਲਾਇਆ।"
      ],
      [
        [
          "The supervisor's presence satisfies the stated condition for technician access. It does not establish who operated any instrument."
        ],
        "ਮੰਗਲਵਾਰ ਸ਼ਾਮ ਨਿਗਰਾਨ ਮੌਜੂਦ ਸੀ, ਇਸ ਲਈ ਟੈਕਨੀਸ਼ੀਅਨ ਨੂੰ ਲੈਬ ਵਰਤਣ ਦੀ ਇਜਾਜ਼ਤ ਸੀ। ਇਸ ਨਾਲ ਇਹ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਕਿ ਕਿਸ ਨੇ ਕੋਈ ਯੰਤਰ ਚਲਾਇਆ।",
        "ਮੰਗਲਵਾਰ ਸ਼ਾਮ ਨਿਗਰਾਨ ਮੌਜੂਦ ਸੀ, ਇਸ ਲਈ ਟੈਕਨੀਸ਼ੀਅਨ ਨੂੰ ਲੈਬ ਵਰਤਣ ਦੀ ਇਜਾਜ਼ਤ ਸੀ। ਇਸ ਨਾਲ ਇਹ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਕਿ ਕੋਈ ਯੰਤਰ ਕਿਸ ਨੇ ਚਲਾਇਆ।"
      ],
      false
    ]
  ],
  "WHENEVER": [
    [
      "OVERHEAT-ALARM",
      "WORKPLACE",
      "MEDIUM",
      [
        "Whenever the packaging machine overheats, its control panel sends an alert to the shift lead. An alert appeared at 11:00. The panel record lists the alert but not its trigger.",
        "जब भी पैकिंग मशीन अधिक गर्म होती है, उसका कंट्रोल पैनल शिफ्ट प्रभारी को चेतावनी भेजता है। सुबह 11 बजे चेतावनी आई। पैनल के रिकॉर्ड में चेतावनी है, लेकिन उसका कारण नहीं।",
        "ਜਦੋਂ ਵੀ ਪੈਕਿੰਗ ਮਸ਼ੀਨ ਜ਼ਿਆਦਾ ਗਰਮ ਹੁੰਦੀ ਹੈ, ਉਸ ਦਾ ਕੰਟਰੋਲ ਪੈਨਲ ਸ਼ਿਫਟ ਇੰਚਾਰਜ ਨੂੰ ਚੇਤਾਵਨੀ ਭੇਜਦਾ ਹੈ। ਸਵੇਰੇ 11 ਵਜੇ ਚੇਤਾਵਨੀ ਆਈ। ਪੈਨਲ ਦੇ ਰਿਕਾਰਡ ਵਿੱਚ ਚੇਤਾਵਨੀ ਹੈ ਪਰ ਇਸ ਦਾ ਕਾਰਨ ਨਹੀਂ।"
      ],
      [
        "The machine overheated at 11 a.m.",
        "सुबह 11 बजे मशीन अधिक गर्म हुई।",
        "ਸਵੇਰੇ 11 ਵਜੇ ਮਸ਼ੀਨ ਜ਼ਿਆਦਾ ਗਰਮ ਹੋਈ।"
      ],
      [
        "The alert may have been sent for a different reason.",
        "चेतावनी किसी दूसरे कारण से भेजी गई हो सकती है।",
        "ਚੇਤਾਵਨੀ ਕਿਸੇ ਹੋਰ ਕਾਰਨ ਕਰਕੇ ਭੇਜੀ ਗਈ ਹੋ ਸਕਦੀ ਹੈ।"
      ],
      [
        "Overheating is one stated trigger for an alert, not the only possible trigger. Because the log does not identify the trigger, the machine's temperature cannot be inferred.",
        "अधिक गर्मी चेतावनी का एक कारण है, लेकिन यही एकमात्र कारण नहीं है। लॉग कारण नहीं बताता, इसलिए मशीन का तापमान निश्चित नहीं किया जा सकता।",
        "ਜ਼ਿਆਦਾ ਗਰਮੀ ਚੇਤਾਵਨੀ ਦਾ ਇੱਕ ਕਾਰਨ ਹੈ, ਪਰ ਇਕੱਲਾ ਕਾਰਨ ਨਹੀਂ। ਲੌਗ ਕਾਰਨ ਨਹੀਂ ਦੱਸਦਾ, ਇਸ ਲਈ ਮਸ਼ੀਨ ਦਾ ਤਾਪਮਾਨ ਪਤਾ ਨਹੀਂ ਲੱਗਦਾ।"
      ],
      true
    ],
    [
      "WATER-SAMPLE",
      "HEALTHCARE",
      "MEDIUM",
      [
        "Whenever a water sample fails the safety test, the laboratory marks it for a second test. Sample 18 was marked for a second test. The record does not say why it was marked.",
        "जब भी पानी का नमूना सुरक्षा जाँच में असफल होता है, प्रयोगशाला उसे दूसरी जाँच के लिए चिह्नित करती है। नमूना 18 दूसरी जाँच के लिए चिह्नित था। रिकॉर्ड में इसका कारण नहीं दिया गया।",
        "ਜਦੋਂ ਵੀ ਪਾਣੀ ਦਾ ਨਮੂਨਾ ਸੁਰੱਖਿਆ ਜਾਂਚ ਵਿੱਚ ਫੇਲ੍ਹ ਹੁੰਦਾ ਹੈ, ਲੈਬ ਉਸ ਨੂੰ ਦੂਜੀ ਜਾਂਚ ਲਈ ਨਿਸ਼ਾਨ ਲਗਾਉਂਦੀ ਹੈ। ਨਮੂਨਾ 18 ਨੂੰ ਦੂਜੀ ਜਾਂਚ ਲਈ ਨਿਸ਼ਾਨ ਲਾਇਆ ਗਿਆ ਸੀ। ਰਿਕਾਰਡ ਵਿੱਚ ਕਾਰਨ ਨਹੀਂ ਦਿੱਤਾ।"
      ],
      [
        "Sample 18 was marked for a second test.",
        "नमूना 18 दूसरी जाँच के लिए चिह्नित था।",
        "ਨਮੂਨਾ 18 ਦੂਜੀ ਜਾਂਚ ਲਈ ਨਿਸ਼ਾਨ ਲਾਇਆ ਗਿਆ ਸੀ।"
      ],
      [
        "Sample 18 failed the safety test.",
        "नमूना 18 सुरक्षा जाँच में असफल हुआ।",
        "ਨਮੂਨਾ 18 ਸੁਰੱਖਿਆ ਜਾਂਚ ਵਿੱਚ ਫੇਲ੍ਹ ਹੋਇਆ।"
      ],
      [
        "The record directly says that Sample 18 was marked for a second test. It gives no reason for the mark, so failure cannot be inferred.",
        "ਰਿਕਾਰਡ ਸਿੱਧਾ ਦੱਸਦਾ ਹੈ ਕਿ ਨਮੂਨਾ 18 ਨੂੰ ਦੁਬਾਰਾ ਜਾਂਚ ਲਈ ਚੁਣਿਆ ਗਿਆ ਸੀ। ਪਰ ਇਹ ਨਹੀਂ ਦੱਸਦਾ ਕਿ ਕਿਉਂ; ਇਸ ਲਈ ਜਾਂਚ ਵਿੱਚ ਫੇਲ੍ਹ ਹੋਣਾ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।",
        "ਰਿਕਾਰਡ ਸਿੱਧਾ ਦੱਸਦਾ ਹੈ ਕਿ ਨਮੂਨਾ 18 ਨੂੰ ਦੂਜੀ ਜਾਂਚ ਲਈ ਨਿਸ਼ਾਨ ਲਾਇਆ ਗਿਆ ਸੀ। ਕਾਰਨ ਨਹੀਂ ਦਿੱਤਾ, ਇਸ ਲਈ ਸੁਰੱਖਿਆ ਜਾਂਚ ਵਿੱਚ ਫੇਲ੍ਹ ਹੋਣਾ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।"
      ],
      true
    ],
    [
      "LATE-DELIVERY",
      "BUSINESS",
      "HARD",
      [
        "Whenever a consignment misses its delivery window, the logistics desk opens a service case. A service case was opened for consignment 452. The desk can also open cases for damaged goods or missing paperwork.",
        "जब भी कोई खेप तय समय-सीमा में नहीं पहुँचती, लॉजिस्टिक्स डेस्क सेवा मामला खोलती है। खेप 452 के लिए सेवा मामला खोला गया। डेस्क क्षतिग्रस्त माल या अधूरे कागज़ात के लिए भी मामला खोल सकती है।",
        "ਜਦੋਂ ਵੀ ਕੋਈ ਖੇਪ ਨਿਰਧਾਰਤ ਸਮੇਂ ਅੰਦਰ ਨਹੀਂ ਪਹੁੰਚਦੀ, ਲੌਜਿਸਟਿਕਸ ਡੈਸਕ ਸੇਵਾ ਕੇਸ ਖੋਲ੍ਹਦੀ ਹੈ। ਖੇਪ 452 ਲਈ ਸੇਵਾ ਕੇਸ ਖੋਲ੍ਹਿਆ ਗਿਆ। ਡੈਸਕ ਨੁਕਸਾਨੇ ਮਾਲ ਜਾਂ ਅਧੂਰੇ ਕਾਗਜ਼ਾਂ ਲਈ ਵੀ ਕੇਸ ਖੋਲ੍ਹ ਸਕਦੀ ਹੈ।"
      ],
      [
        "A service case was opened for consignment 452.",
        "खेप 452 के लिए सेवा मामला खोला गया।",
        "ਖੇਪ 452 ਲਈ ਸੇਵਾ ਕੇਸ ਖੋਲ੍ਹਿਆ ਗਿਆ।"
      ],
      [
        "Consignment 452 missed its delivery window.",
        "खेप 452 तय समय-सीमा में नहीं पहुँची।",
        "ਖੇਪ 452 ਨਿਰਧਾਰਤ ਸਮੇਂ ਅੰਦਰ ਨਹੀਂ ਪਹੁੰਚੀ।"
      ],
      [
        "The passage states that a service case was opened. It lists late delivery as one possible reason, alongside other reasons, so lateness is not established.",
        "ਖੇਪ 452 ਲਈ ਸੇਵਾ ਮਾਮਲਾ ਖੋਲ੍ਹਿਆ ਗਿਆ, ਇਹ ਗੱਲ ਸਪਸ਼ਟ ਹੈ। ਦੇਰੀ ਇੱਕ ਸੰਭਵ ਕਾਰਨ ਹੈ, ਪਰ ਨੁਕਸਾਨ ਜਾਂ ਕਾਗਜ਼ਾਂ ਦੀ ਕਮੀ ਵੀ ਕਾਰਨ ਹੋ ਸਕਦੇ ਹਨ।",
        "ਖੇਪ 452 ਲਈ ਸੇਵਾ ਕੇਸ ਖੋਲ੍ਹਿਆ ਗਿਆ, ਇਹ ਗੱਲ ਸਪਸ਼ਟ ਹੈ। ਦੇਰੀ ਇੱਕ ਸੰਭਵ ਕਾਰਨ ਹੈ, ਪਰ ਨੁਕਸਾਨ ਜਾਂ ਕਾਗਜ਼ਾਂ ਦੀ ਕਮੀ ਵੀ ਕਾਰਨ ਹੋ ਸਕਦੇ ਹਨ।"
      ],
      false
    ]
  ],
  "NEGATIVE_CONDITION": [
    [
      "PAYMENT-RELEASE",
      "BANKING",
      "MEDIUM",
      [
        "If a reimbursement claim is not approved, it is not sent for payment. Claim 76 was sent for payment. The rule is applied to every reimbursement claim.",
        "यदि प्रतिपूर्ति का दावा मंजूर नहीं होता, तो उसे भुगतान के लिए नहीं भेजा जाता। दावा 76 भुगतान के लिए भेजा गया। यह नियम हर प्रतिपूर्ति दावे पर लागू होता है।",
        "ਜੇ ਖਰਚਾ-ਵਾਪਸੀ ਦਾ ਦਾਅਵਾ ਮਨਜ਼ੂਰ ਨਾ ਹੋਵੇ, ਤਾਂ ਉਸ ਨੂੰ ਭੁਗਤਾਨ ਲਈ ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ। ਦਾਅਵਾ 76 ਭੁਗਤਾਨ ਲਈ ਭੇਜਿਆ ਗਿਆ। ਇਹ ਨਿਯਮ ਹਰ ਖਰਚਾ-ਵਾਪਸੀ ਦੇ ਦਾਅਵੇ 'ਤੇ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।"
      ],
      [
        "Claim 76 was approved.",
        "दावा 76 मंजूर किया गया था।",
        "ਦਾਅਵਾ 76 ਮਨਜ਼ੂਰ ਕੀਤਾ ਗਿਆ ਸੀ।"
      ],
      [
        "Claim 76 was paid in full.",
        "दावे 76 का पूरा भुगतान किया गया।",
        "ਦਾਅਵਾ 76 ਦਾ ਪੂਰਾ ਭੁਗਤਾਨ ਕੀਤਾ ਗਿਆ।"
      ],
      [
        [
          "The rule excludes unapproved claims from payment processing. Since claim 76 was sent for payment, it cannot be unapproved. Being sent does not establish that payment was completed or made in full."
        ],
        "ਨਿਯਮ ਅਨੁਸਾਰ ਮਨਜ਼ੂਰ ਨਾ ਹੋਇਆ ਦਾਅਵਾ ਭੁਗਤਾਨ ਲਈ ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ। ਦਾਅਵਾ ਭੇਜਿਆ ਗਿਆ ਸੀ, ਇਸ ਲਈ ਉਹ ਮਨਜ਼ੂਰ ਹੋਇਆ ਹੋਵੇਗਾ; ਪਰ ਭੁਗਤਾਨ ਹੋ ਜਾਣਾ ਇਸ ਤੋਂ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।",
        "ਨਿਯਮ ਮੁਤਾਬਕ ਮਨਜ਼ੂਰ ਨਾ ਹੋਇਆ ਦਾਅਵਾ ਭੁਗਤਾਨ ਲਈ ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ। ਦਾਅਵਾ ਭੇਜਿਆ ਗਿਆ ਸੀ, ਇਸ ਲਈ ਉਹ ਮਨਜ਼ੂਰ ਹੋਇਆ ਹੋਵੇਗਾ; ਪਰ ਭੁਗਤਾਨ ਹੋ ਜਾਣਾ ਇਸ ਤੋਂ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।"
      ],
      true
    ],
    [
      "ENTRY-RECORD",
      "PUBLIC_ADMINISTRATION",
      "HARD",
      [
        "If a visitor has not registered at the gate, the security desk does not issue a visitor badge. Omar was issued a badge. The register and badge records refer to the same visit.",
        "यदि आगंतुक ने प्रवेश द्वार पर पंजीकरण नहीं किया है, तो सुरक्षा डेस्क उसे आगंतुक बैज नहीं देती। उमर को बैज दिया गया। रजिस्टर और बैज का रिकॉर्ड उसी मुलाकात का है।",
        "ਜੇ ਮਹਿਮਾਨ ਨੇ ਗੇਟ 'ਤੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨਹੀਂ ਕਰਵਾਈ, ਤਾਂ ਸੁਰੱਖਿਆ ਡੈਸਕ ਉਸ ਨੂੰ ਮਹਿਮਾਨ ਬੈਜ ਨਹੀਂ ਦਿੰਦੀ। ਉਮਰ ਨੂੰ ਬੈਜ ਦਿੱਤਾ ਗਿਆ। ਰਜਿਸਟਰ ਅਤੇ ਬੈਜ ਦਾ ਰਿਕਾਰਡ ਉਸੇ ਮੁਲਾਕਾਤ ਦਾ ਹੈ।"
      ],
      [
        "Omar registered at the gate.",
        "उमर ने प्रवेश द्वार पर पंजीकरण किया था।",
        "ਉਮਰ ਨੇ ਗੇਟ 'ਤੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਰਵਾਈ ਸੀ।"
      ],
      [
        "Omar was allowed into every restricted area.",
        "उमर को हर प्रतिबंधित क्षेत्र में जाने दिया गया।",
        "ਉਮਰ ਨੂੰ ਹਰ ਪਾਬੰਦੀਸ਼ੁਦਾ ਖੇਤਰ ਵਿੱਚ ਜਾਣ ਦਿੱਤਾ ਗਿਆ।"
      ],
      [
        [
          "Under the rule, an unregistered visitor would not receive a badge. Omar received one, so he must have registered. A badge does not grant access to every restricted area."
        ],
        "ਨਿਯਮ ਮੁਤਾਬਕ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਬਿਨਾਂ ਬੈਜ ਨਹੀਂ ਮਿਲਦਾ। ਉਮਰ ਨੂੰ ਬੈਜ ਮਿਲਿਆ, ਇਸ ਲਈ ਉਸ ਨੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਰਵਾਈ ਹੋਵੇਗੀ। ਬੈਜ ਨਾਲ ਹਰ ਪਾਬੰਦੀਸ਼ੁਦਾ ਥਾਂ 'ਤੇ ਜਾਣ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਮਿਲਦੀ।",
        "ਨਿਯਮ ਮੁਤਾਬਕ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਬਿਨਾਂ ਮਹਿਮਾਨ ਬੈਜ ਨਹੀਂ ਮਿਲਦਾ। ਉਮਰ ਨੂੰ ਬੈਜ ਮਿਲਿਆ, ਇਸ ਲਈ ਉਸ ਨੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਰਵਾਈ ਹੋਵੇਗੀ। ਇਸ ਨਾਲ ਹਰ ਪਾਬੰਦੀਸ਼ੁਦਾ ਥਾਂ 'ਤੇ ਜਾਣ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਮਿਲਦੀ।"
      ],
      true
    ],
    [
      "CREDIT-ELIGIBILITY",
      "BANKING",
      "HARD",
      [
        "If an application lacks either of the two required references, it is not considered for the credit line. The review file contains both references for Dev's application. The policy does not promise approval after the file is considered.",
        "यदि आवेदन में दो आवश्यक संदर्भों में से कोई एक भी न हो, तो उसे ऋण सुविधा के लिए विचार में नहीं लिया जाता। देव के आवेदन की फाइल में दोनों संदर्भ हैं। नीति विचार किए जाने के बाद मंजूरी का वादा नहीं करती।",
        "ਜੇ ਅਰਜ਼ੀ ਵਿੱਚ ਲੋੜੀਂਦੇ ਦੋ ਹਵਾਲਿਆਂ ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਵੀ ਨਾ ਹੋਵੇ, ਤਾਂ ਉਸ ਨੂੰ ਕਰਜ਼ਾ-ਸਹੂਲਤ ਲਈ ਵਿਚਾਰਿਆ ਨਹੀਂ ਜਾਂਦਾ। ਦੇਵ ਦੀ ਅਰਜ਼ੀ ਦੀ ਫਾਈਲ ਵਿੱਚ ਦੋਵੇਂ ਹਵਾਲੇ ਹਨ। ਨੀਤੀ ਵਿਚਾਰੇ ਜਾਣ ਤੋਂ ਬਾਅਦ ਮਨਜ਼ੂਰੀ ਦਾ ਵਾਅਦਾ ਨਹੀਂ ਕਰਦੀ।"
      ],
      [
        "Dev's application meets the stated reference requirement for consideration.",
        "ਦੇव का आवेदन विचार के लिए बताई गई संदर्भ-शर्त पूरी करता है।",
        "ਦੇਵ ਦੀ ਅਰਜ਼ੀ ਵਿਚਾਰੇ ਜਾਣ ਲਈ ਦੱਸੀ ਹਵਾਲੇ ਵਾਲੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੀ ਹੈ।"
      ],
      [
        "Dev's credit line has been approved.",
        "देव की ऋण सुविधा मंजूर हो गई है।",
        "ਦੇਵ ਦੀ ਕਰਜ਼ਾ-ਸਹੂਲਤ ਮਨਜ਼ੂਰ ਹੋ ਗਈ ਹੈ।"
      ],
      [
        [
          "Both references are present, so the stated reason for excluding the file does not apply. The rule only concerns consideration and does not guarantee approval."
        ],
        "ਦੋਵੇਂ ਹਵਾਲੇ ਮੌਜੂਦ ਹਨ, ਇਸ ਲਈ ਫਾਈਲ ਨੂੰ ਇਸ ਕਾਰਨ ਰੋਕਿਆ ਨਹੀਂ ਜਾਂਦਾ। ਨੀਤੀ ਵਿਚਾਰੇ ਜਾਣ ਤੋਂ ਬਾਅਦ ਕਰਜ਼ਾ ਮਨਜ਼ੂਰ ਹੋਣ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ ਦਿੰਦੀ।",
        "ਦੋਵੇਂ ਹਵਾਲੇ ਫਾਈਲ ਵਿੱਚ ਹਨ, ਇਸ ਲਈ ਦੱਸੇ ਆਧਾਰ 'ਤੇ ਅਰਜ਼ੀ ਵਿਚਾਰ ਤੋਂ ਬਾਹਰ ਨਹੀਂ ਹੁੰਦੀ। ਪਰ ਵਿਚਾਰੇ ਜਾਣ ਨਾਲ ਕਰਜ਼ਾ ਮਨਜ਼ੂਰ ਹੋਣਾ ਪੱਕਾ ਨਹੀਂ।"
      ],
      false
    ]
  ],
  "CONDITIONAL_CHAIN": [
    [
      "TRAINING-CERTIFICATE",
      "WORKPLACE",
      "HARD",
      [
        "If a technician completes both safety modules, the training unit records the technician as certified. If a technician is certified, the technician may operate the new press. Iqbal completed both modules, and the unit follows these rules for all technicians.",
        "यदि तकनीशियन सुरक्षा के दोनों मॉड्यूल पूरे करता है, तो प्रशिक्षण विभाग उसे प्रमाणित दर्ज करता है। प्रमाणित तकनीशियन नई प्रेस चला सकता है। इकबाल ने दोनों मॉड्यूल पूरे किए और विभाग सभी तकनीशियनों पर यही नियम लागू करता है।",
        "ਜੇ ਟੈਕਨੀਸ਼ੀਅਨ ਸੁਰੱਖਿਆ ਦੇ ਦੋਵੇਂ ਮੋਡੀਊਲ ਪੂਰੇ ਕਰੇ, ਤਾਂ ਸਿਖਲਾਈ ਇਕਾਈ ਉਸ ਨੂੰ ਪ੍ਰਮਾਣਿਤ ਦਰਜ ਕਰਦੀ ਹੈ। ਪ੍ਰਮਾਣਿਤ ਟੈਕਨੀਸ਼ੀਅਨ ਨਵੀਂ ਪ੍ਰੈੱਸ ਚਲਾ ਸਕਦਾ ਹੈ। ਇਕਬਾਲ ਨੇ ਦੋਵੇਂ ਮੋਡੀਊਲ ਪੂਰੇ ਕੀਤੇ ਅਤੇ ਇਕਾਈ ਸਾਰੇ ਟੈਕਨੀਸ਼ੀਅਨਾਂ ਲਈ ਇਹ ਨਿਯਮ ਲਾਗੂ ਕਰਦੀ ਹੈ।"
      ],
      [
        "Iqbal may operate the new press.",
        "ਇकबाल नई प्रेस चला सकता है।",
        "ਇਕਬਾਲ ਨਵੀਂ ਪ੍ਰੈੱਸ ਚਲਾ ਸਕਦਾ ਹੈ।"
      ],
      [
        "Every technician who operates the press must have completed both safety modules.",
        "प्रेस चलाने वाले हर तकनीशियन ने सुरक्षा के दोनों मॉड्यूल पूरे किए होंगे।",
        "ਪ੍ਰੈੱਸ ਚਲਾਉਣ ਵਾਲੇ ਹਰ ਟੈਕਨੀਸ਼ੀਅਨ ਨੇ ਸੁਰੱਖਿਆ ਦੇ ਦੋਵੇਂ ਮੋਡੀਊਲ ਪੂਰੇ ਕੀਤੇ ਹੋਣਗੇ।"
      ],
      [
        "Completing both modules makes Iqbal certified, and certification permits operation. The rules do not say that certification is the only route to operate the press.",
        "इकबाल ने दोनों मॉड्यूल पूरे किए, इसलिए उसे प्रमाणित किया जाएगा और वह प्रेस चला सकता है। नियम यह नहीं कहता कि प्रेस चलाने का यही एक तरीका है।",
        "ਦੋਵੇਂ ਮੋਡੀਊਲ ਪੂਰੇ ਕਰਨ ਨਾਲ ਇਕਬਾਲ ਨੂੰ ਪ੍ਰਮਾਣਿਤ ਦਰਜ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਪ੍ਰਮਾਣਿਤ ਹੋਣ 'ਤੇ ਉਹ ਪ੍ਰੈੱਸ ਚਲਾ ਸਕਦਾ ਹੈ। ਨਿਯਮ ਇਹ ਨਹੀਂ ਕਹਿੰਦੇ ਕਿ ਪ੍ਰੈੱਸ ਚਲਾਉਣ ਦਾ ਇਹੀ ਇਕ ਰਸਤਾ ਹੈ।"
      ],
      true
    ],
    [
      "CLAIM-REVIEW",
      "BANKING",
      "HARD",
      [
        "If a claim includes the original invoice, it is sent to the verification desk. If the verification desk confirms the invoice, the claim moves to payment review. Claim 88 moved to payment review, but the file does not state whether it included the original invoice.",
        "यदि दावे में मूल बिल हो, तो उसे सत्यापन डेस्क भेजा जाता है। डेस्क बिल की पुष्टि करे, तो दावा भुगतान समीक्षा में जाता है। दावा 88 भुगतान समीक्षा में गया, लेकिन फाइल में यह नहीं बताया गया कि उसमें मूल बिल था या नहीं।",
        "ਜੇ ਦਾਅਵੇ ਨਾਲ ਅਸਲ ਬਿੱਲ ਹੋਵੇ, ਤਾਂ ਉਸ ਨੂੰ ਤਸਦੀਕ ਡੈਸਕ ਕੋਲ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ। ਡੈਸਕ ਬਿੱਲ ਦੀ ਪੁਸ਼ਟੀ ਕਰੇ, ਤਾਂ ਦਾਅਵਾ ਭੁਗਤਾਨ ਸਮੀਖਿਆ ਵਿੱਚ ਜਾਂਦਾ ਹੈ। ਦਾਅਵਾ 88 ਭੁਗਤਾਨ ਸਮੀਖਿਆ ਵਿੱਚ ਗਿਆ, ਪਰ ਫਾਈਲ ਇਹ ਨਹੀਂ ਦੱਸਦੀ ਕਿ ਅਸਲ ਬਿੱਲ ਨਾਲ ਸੀ ਜਾਂ ਨਹੀਂ।"
      ],
      [
        "Claim 88 moved to payment review.",
        "दावा 88 भुगतान समीक्षा में गया।",
        "ਦਾਅਵਾ 88 ਭੁਗਤਾਨ ਸਮੀਖਿਆ ਵਿੱਚ ਗਿਆ।"
      ],
      [
        "Claim 88 included the original invoice.",
        "दावे 88 में मूल बिल था।",
        "ਦਾਅਵਾ 88 ਵਿੱਚ ਅਸਲ ਬਿੱਲ ਸੀ।"
      ],
      [
        "The file directly says that Claim 88 moved to payment review. Although confirmation can lead to that step, the rule does not establish that it is the only route.",
        "फाइल सीधे बताती है कि दावा 88 भुगतान समीक्षा में गया। बिल की पुष्टि एक बताए गए रास्ते से इस चरण तक पहुँचाती है, लेकिन यह एकमात्र रास्ता नहीं बताया गया।",
        "ਫਾਈਲ ਸਿੱਧਾ ਦੱਸਦੀ ਹੈ ਕਿ ਦਾਅਵਾ 88 ਭੁਗਤਾਨ ਸਮੀਖਿਆ ਵਿੱਚ ਗਿਆ। ਬਿੱਲ ਦੀ ਪੁਸ਼ਟੀ ਇੱਕ ਦੱਸੇ ਰਸਤੇ ਰਾਹੀਂ ਇਸ ਪੜਾਅ ਤੱਕ ਲੈ ਜਾਂਦੀ ਹੈ, ਪਰ ਇਹ ਇਕੱਲਾ ਰਸਤਾ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ।"
      ],
      true
    ],
    [
      "PERMIT-INSPECTION",
      "PUBLIC_ADMINISTRATION",
      "MEDIUM",
      [
        "If a building passes the electrical inspection, the permit office issues a completion note. If the completion note is issued, the file is closed. The office closed Building K's file, but the record does not identify which inspection, if any, it passed.",
        "यदि कोई इमारत विद्युत निरीक्षण में पास होती है, तो परमिट कार्यालय पूर्णता-पत्र जारी करता है। पूर्णता-पत्र जारी होने पर फाइल बंद कर दी जाती है। कार्यालय ने इमारत K की फाइल बंद की, लेकिन रिकॉर्ड यह नहीं बताता कि उसने कौन-सा निरीक्षण पास किया।",
        "ਜੇ ਕੋਈ ਇਮਾਰਤ ਬਿਜਲੀ ਜਾਂਚ ਪਾਸ ਕਰਦੀ ਹੈ, ਤਾਂ ਪਰਮਿਟ ਦਫ਼ਤਰ ਪੂਰਨਤਾ-ਪੱਤਰ ਜਾਰੀ ਕਰਦਾ ਹੈ। ਪੂਰਨਤਾ-ਪੱਤਰ ਜਾਰੀ ਹੋਣ 'ਤੇ ਫਾਈਲ ਬੰਦ ਹੋ ਜਾਂਦੀ ਹੈ। ਦਫ਼ਤਰ ਨੇ ਇਮਾਰਤ K ਦੀ ਫਾਈਲ ਬੰਦ ਕੀਤੀ, ਪਰ ਰਿਕਾਰਡ ਇਹ ਨਹੀਂ ਦੱਸਦਾ ਕਿ ਉਸ ਨੇ ਕਿਹੜੀ ਜਾਂਚ ਪਾਸ ਕੀਤੀ।"
      ],
      [
        "Building K's file is closed.",
        "इमारत K की फाइल बंद है।",
        "ਇਮਾਰਤ K ਦੀ ਫਾਈਲ ਬੰਦ ਹੈ।"
      ],
      [
        "Building K passed the electrical inspection.",
        "इमारत K विद्युत निरीक्षण में पास हुई।",
        "ਇਮਾਰਤ K ਬਿਜਲੀ ਜਾਂਚ ਪਾਸ ਹੋਈ।"
      ],
      [
        [
          "The record directly states that the file was closed. The rules say a passed inspection can lead to closure, but do not say it is the only way a file can close."
        ],
        "कार्यालय ने इमारत K की फाइल बंद की। निरीक्षण में पास होना इसका एक रास्ता हो सकता है, लेकिन इसे एकमात्र रास्ता नहीं बताया गया।",
        "ਰਿਕਾਰਡ ਸਿੱਧਾ ਦੱਸਦਾ ਹੈ ਕਿ ਇਮਾਰਤ K ਦੀ ਫਾਈਲ ਬੰਦ ਹੈ। ਬਿਜਲੀ ਜਾਂਚ ਪਾਸ ਕਰਨਾ ਫਾਈਲ ਬੰਦ ਹੋਣ ਦਾ ਇੱਕ ਰਸਤਾ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਇਸ ਨੂੰ ਇਕੱਲਾ ਰਸਤਾ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ।"
      ],
      false
    ]
  ],
  "SCOPE_CONDITION": [
    [
      "NIGHT-ALLOWANCE",
      "WORKPLACE",
      "MEDIUM",
      [
        "Only staff assigned to the night shift may claim the night-meal allowance. Arjun is assigned to the night shift. The payroll note says shift assignment is one condition for claiming it.",
        "रात्रि भोजन भत्ते का दावा केवल रात की पाली में तैनात कर्मचारी कर सकते हैं। अर्जुन रात की पाली में तैनात है। वेतन नोट के अनुसार पाली में तैनाती दावा करने की एक शर्त है।",
        "ਰਾਤ ਦੇ ਖਾਣੇ ਦੇ ਭੱਤੇ ਦਾ ਦਾਅਵਾ ਸਿਰਫ਼ ਰਾਤ ਦੀ ਸ਼ਿਫਟ ਵਿੱਚ ਤਾਇਨਾਤ ਕਰਮਚਾਰੀ ਕਰ ਸਕਦੇ ਹਨ। ਅਰਜੁਨ ਰਾਤ ਦੀ ਸ਼ਿਫਟ ਵਿੱਚ ਤਾਇਨਾਤ ਹੈ। ਤਨਖ਼ਾਹ ਨੋਟ ਮੁਤਾਬਕ ਸ਼ਿਫਟ ਦੀ ਤਾਇਨਾਤੀ ਦਾਅਵੇ ਲਈ ਇੱਕ ਸ਼ਰਤ ਹੈ।"
      ],
      [
        "Arjun meets the shift-assignment condition needed to make a claim.",
        "अर्जुन दावा करने के लिए आवश्यक पाली-तैनाती की शर्त पूरी करता है।",
        "ਅਰਜੁਨ ਦਾਅਵਾ ਕਰਨ ਲਈ ਲੋੜੀਂਦੀ ਸ਼ਿਫਟ-ਤਾਇਨਾਤੀ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦਾ ਹੈ।"
      ],
      [
        "Arjun has received the night-meal allowance.",
        "अर्जुन को रात का भोजन भत्ता मिल चुका है।",
        "ਅਰਜੁਨ ਨੂੰ ਰਾਤ ਦਾ ਖਾਣਾ ਭੱਤਾ ਮਿਲ ਚੁੱਕਾ ਹੈ।"
      ],
      [
        "The night-shift assignment meets the stated necessary condition for a claim. It does not show that Arjun filed a claim or received payment.",
        "रात की पाली में तैनाती भत्ता-दावे की बताई गई आवश्यक शर्त है और अर्जुन यह शर्त पूरी करता है। इससे यह नहीं पता चलता कि उसने दावा किया या भुगतान पाया।",
        "ਰਾਤ ਦੀ ਸ਼ਿਫਟ ਵਿੱਚ ਤਾਇਨਾਤੀ ਭੱਤੇ ਦੇ ਦਾਅਵੇ ਲਈ ਦੱਸੀ ਲਾਜ਼ਮੀ ਸ਼ਰਤ ਹੈ ਅਤੇ ਅਰਜੁਨ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦਾ ਹੈ। ਇਸ ਤੋਂ ਇਹ ਨਹੀਂ ਪਤਾ ਲੱਗਦਾ ਕਿ ਉਸ ਨੇ ਦਾਅਵਾ ਕੀਤਾ ਜਾਂ ਭੁਗਤਾਨ ਲਿਆ।"
      ],
      true
    ],
    [
      "SENIOR-COUNTER",
      "PUBLIC_ADMINISTRATION",
      "HARD",
      [
        "Only applicants aged 60 or above may use the priority counter. Rao is 63 and used that counter on Monday. The notice sets an age restriction but gives no information about waiting time.",
        "प्राथमिकता काउंटर का उपयोग केवल 60 वर्ष या उससे अधिक आयु के आवेदक कर सकते हैं। श्री राव 63 वर्ष के हैं और सोमवार को उस काउंटर पर गए। सूचना आयु की शर्त बताती है, प्रतीक्षा समय की नहीं।",
        "ਤਰਜੀਹੀ ਕਾਊਂਟਰ ਦੀ ਵਰਤੋਂ ਸਿਰਫ਼ 60 ਸਾਲ ਜਾਂ ਇਸ ਤੋਂ ਵੱਧ ਉਮਰ ਦੇ ਬਿਨੈਕਾਰ ਕਰ ਸਕਦੇ ਹਨ। ਸ੍ਰੀ ਰਾਓ 63 ਸਾਲ ਦੇ ਹਨ ਅਤੇ ਸੋਮਵਾਰ ਨੂੰ ਉਸ ਕਾਊਂਟਰ 'ਤੇ ਗਏ। ਨੋਟਿਸ ਉਮਰ ਦੀ ਸ਼ਰਤ ਦੱਸਦਾ ਹੈ, ਉਡੀਕ ਸਮੇਂ ਬਾਰੇ ਨਹੀਂ।"
      ],
      [
        "Mr Rao met the stated age condition for using the priority counter.",
        "ਸ੍ਰੀ राव प्राथमिकता काउंटर के लिए बताई गई आयु-शर्त पूरी करते हैं।",
        "ਸ੍ਰੀ ਰਾਓ ਤਰਜੀਹੀ ਕਾਊਂਟਰ ਲਈ ਦੱਸੀ ਉਮਰ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ।"
      ],
      [
        "Mr Rao was served before every other applicant on Monday.",
        "सोमवार को श्री राव को हर दूसरे आवेदक से पहले सेवा मिली।",
        "ਸੋਮਵਾਰ ਨੂੰ ਸ੍ਰੀ ਰਾਓ ਨੂੰ ਹਰ ਹੋਰ ਬਿਨੈਕਾਰ ਤੋਂ ਪਹਿਲਾਂ ਸੇਵਾ ਮਿਲੀ।"
      ],
      [
        [
          "At 63, Mr Rao meets the stated age limit. The notice does not report the order in which applicants were served."
        ],
        "श्री राव 63 वर्ष के हैं और बताई गई आयु-शर्त पूरी करते हैं। सूचना सोमवार को आवेदकों को सेवा देने का क्रम नहीं बताती।",
        "63 ਸਾਲ ਦੀ ਉਮਰ ਨਾਲ ਸ੍ਰੀ ਰਾਓ ਦੱਸੀ ਉਮਰ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ। ਨੋਟਿਸ ਸੋਮਵਾਰ ਨੂੰ ਲੋਕਾਂ ਨੂੰ ਸੇਵਾ ਦੇਣ ਦਾ ਕ੍ਰਮ ਨਹੀਂ ਦੱਸਦਾ।"
      ],
      true
    ],
    [
      "COLD-STORE",
      "BUSINESS",
      "HARD",
      [
        "Only sealed produce cartons may be placed in the cold store. The evening inventory lists 40 sealed cartons inside. The list does not record the condition of cartons kept elsewhere.",
        "ठंडे भंडार में केवल सीलबंद उपज के डिब्बे रखे जा सकते हैं। शाम की सूची में अंदर 40 सीलबंद डिब्बे दर्ज हैं। सूची बाहर रखे डिब्बों की स्थिति नहीं बताती।",
        "ਠੰਢੇ ਭੰਡਾਰ ਵਿੱਚ ਸਿਰਫ਼ ਸੀਲਬੰਦ ਉਪਜ ਦੇ ਡੱਬੇ ਰੱਖੇ ਜਾ ਸਕਦੇ ਹਨ। ਸ਼ਾਮ ਦੀ ਸੂਚੀ ਵਿੱਚ ਅੰਦਰ 40 ਸੀਲਬੰਦ ਡੱਬੇ ਦਰਜ ਹਨ। ਸੂਚੀ ਬਾਹਰ ਰੱਖੇ ਡੱਬਿਆਂ ਦੀ ਹਾਲਤ ਨਹੀਂ ਦੱਸਦੀ।"
      ],
      [
        "Every carton listed inside the cold store was sealed.",
        "ਠंडे भंडार के अंदर दर्ज हर डिब्बा सीलबंद था।",
        "ਠੰਢੇ ਭੰਡਾਰ ਅੰਦਰ ਦਰਜ ਹਰ ਡੱਬਾ ਸੀਲਬੰਦ ਸੀ।"
      ],
      [
        "Every sealed carton at the site was placed in the cold store.",
        "स्थल पर मौजूद हर सीलबंद डिब्बा ठंडे भंडार में रखा गया।",
        "ਥਾਂ 'ਤੇ ਮੌਜੂਦ ਹਰ ਸੀਲਬੰਦ ਡੱਬਾ ਠੰਢੇ ਭੰਡਾਰ ਵਿੱਚ ਰੱਖਿਆ ਗਿਆ।"
      ],
      [
        [
          "“Only sealed cartons may be placed there” makes sealing necessary for storage inside. The rule does not require every sealed carton to be stored there."
        ],
        "नियम के अनुसार ठंडे भंडार में रखे जाने वाले डिब्बे सीलबंद होने चाहिए। इससे यह नहीं निकलता कि स्थल के हर सीलबंद डिब्बे को वहीं रखा गया।",
        "ਨਿਯਮ ਮੁਤਾਬਕ ਠੰਢੇ ਭੰਡਾਰ ਵਿੱਚ ਰੱਖੇ ਡੱਬੇ ਸੀਲਬੰਦ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ। ਇਸ ਤੋਂ ਇਹ ਨਹੀਂ ਨਿਕਲਦਾ ਕਿ ਥਾਂ ਦੇ ਹਰ ਸੀਲਬੰਦ ਡੱਬੇ ਨੂੰ ਉੱਥੇ ਹੀ ਰੱਖਿਆ ਗਿਆ।"
      ],
      false
    ]
  ]
} as unknown as Readonly<Record<Family, readonly Row[]>>;
const familyOrder = Object.keys(families) as Family[];
const distractor: Readonly<Record<Family, SifDistractorType>> = {
  IF_THEN: "REVERSED_RELATIONSHIP", ONLY_IF: "REVERSED_RELATIONSHIP", UNLESS: "REVERSED_RELATIONSHIP",
  PROVIDED_THAT: "EXCESSIVE_CERTAINTY", WHENEVER: "CAUSE_ASSUMPTION", NEGATIVE_CONDITION: "REVERSED_RELATIONSHIP",
  CONDITIONAL_CHAIN: "REVERSED_RELATIONSHIP", SCOPE_CONDITION: "SCOPE_CHANGE"
};

export const SIF_CP010_CONDITIONAL_AUTHORITIES: readonly SifScenarioAuthority[] = familyOrder.flatMap((family, familyIndex) => families[family].map(([key, domain, difficulty, statement, supportedText, unsupportedText, reasoning, answerI], rowIndex) => {
  const globalIndex = familyIndex * families[family].length + rowIndex;
  const seedSwapsInReview = globalIndex % 2 === 1;
  const supportedFirst = answerI !== seedSwapsInReview;
  const sentenceRows = statement.map((text) => text.trim().split(/(?<=[.!?।])\s+/));
  const factCount = Math.min(...sentenceRows.map((sentences) => sentences.length));
  const facts = Array.from({ length: factCount }, (_, i) => ({ id: `F${i + 1}`, text: localized([sentenceRows[0][i], sentenceRows[1][i], sentenceRows[2][i]] as L) }));
  const valid = { id: supportedFirst ? "I" : "II", text: localized(supportedText), follows: true, strength: "CERTAIN" as const, supportFactIds: facts.map((fact) => fact.id) };
  const invalid = { id: supportedFirst ? "II" : "I", text: localized(unsupportedText), follows: false, strength: "UNSUPPORTED_OR_CONTRADICTED" as const, supportFactIds: facts.map((fact) => fact.id), distractorType: distractor[family] };
  const suffix: L = supportedFirst ? ["Therefore, only Inference I follows.", "इसलिए केवल अनुमान I सही है।", "ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ I ਸਹੀ ਹੈ।"] : ["Therefore, only Inference II follows.", "इसलिए केवल अनुमान II सही है।", "ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ II ਸਹੀ ਹੈ।"];
  const explanation = localized([0,1,2].map((i) => `${reasoning[i]} ${suffix[i]}`) as unknown as L);
  return { id: `SIF-CP010-${family}-${key}`, cpId: "SIF-CP010" as const, difficulty, domain, mechanisms: ["CONDITIONAL_DIRECTION"] as const, statement: localized(statement), facts, candidates: [supportedFirst ? valid : invalid, supportedFirst ? invalid : valid] as const, explanation, identityGuard: guard };
}));

export const SIF_CP010_PROFILE_BY_AUTHORITY_ID: Readonly<Record<string, { readonly family: Family }>> = Object.fromEntries(familyOrder.flatMap((family) => SIF_CP010_CONDITIONAL_AUTHORITIES.filter((authority) => authority.id.startsWith(`SIF-CP010-${family}-`)).map((authority) => [authority.id, { family }] as const)));
