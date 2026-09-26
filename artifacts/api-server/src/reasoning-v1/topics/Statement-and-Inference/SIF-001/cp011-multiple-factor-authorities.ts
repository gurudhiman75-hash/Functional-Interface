import type { SifContextDomain, SifDifficulty, SifDistractorType, SifLocalizedText, SifScenarioAuthority } from "./types.ts";

type L = readonly [string, string, string];
type Family = "ELIGIBILITY_INTERSECTION" | "PROCESS_REQUIREMENTS" | "SERVICE_AND_SCHEDULE" | "RESOURCE_AND_DEMAND" | "GROUP_AND_SCOPE" | "COMPARATIVE_CHAIN" | "CROSS_SENTENCE_RECORD" | "SEQUENCE_AND_STATUS";
type Row = readonly [string, SifContextDomain, SifDifficulty, L, L, L, L, boolean];
const localized = ([en, hi, pa]: L): SifLocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const guard = { evaluatesSupport: true, assumptionQuestion: false, conclusionQuestion: false, argumentQuestion: false, causeEffectQuestion: false, courseOfActionQuestion: false } as const;
const families = {
  "ELIGIBILITY_INTERSECTION": [
    [
      "ELIGIBILITY_INTERSECTION",
      "PERMIT-APPLICATION",
      "PUBLIC_ADMINISTRATION",
      "MEDIUM",
      [
        "The permit office issues a site-work permit only after the planning unit approves the drawing and the applicant pays the inspection fee. The planning unit approved Rao's drawing, and the receipt shows that the fee was paid. The permit register has not yet been updated.",
        "योजना इकाई से नक्शा मंजूर होने और आवेदक द्वारा निरीक्षण शुल्क जमा करने के बाद ही परमिट कार्यालय स्थल पर काम का परमिट जारी करता है। योजना इकाई ने राव का नक्शा मंजूर किया और रसीद में शुल्क जमा होना दर्ज है। परमिट रजिस्टर अभी अपडेट नहीं हुआ है।",
        "ਯੋਜਨਾ ਇਕਾਈ ਵੱਲੋਂ ਨਕਸ਼ਾ ਮਨਜ਼ੂਰ ਹੋਣ ਅਤੇ ਬਿਨੈਕਾਰ ਵੱਲੋਂ ਜਾਂਚ ਫੀਸ ਜਮ੍ਹਾਂ ਕਰਵਾਉਣ ਤੋਂ ਬਾਅਦ ਹੀ ਪਰਮਿਟ ਦਫ਼ਤਰ ਕੰਮ ਸ਼ੁਰੂ ਕਰਨ ਦਾ ਪਰਮਿਟ ਜਾਰੀ ਕਰਦਾ ਹੈ। ਯੋਜਨਾ ਇਕਾਈ ਨੇ ਰਾਓ ਦਾ ਨਕਸ਼ਾ ਮਨਜ਼ੂਰ ਕੀਤਾ ਅਤੇ ਰਸੀਦ ਵਿੱਚ ਫੀਸ ਜਮ੍ਹਾਂ ਹੋਣ ਦੀ ਦਰਜ ਹੈ। ਪਰਮਿਟ ਰਜਿਸਟਰ ਹਾਲੇ ਅਪਡੇਟ ਨਹੀਂ ਹੋਇਆ।"
      ],
      [
        "Rao's application meets both stated conditions required before the office can issue the permit.",
        "राव का आवेदन परमिट जारी करने से पहले बताई गई दोनों शर्तें पूरी करता है।",
        "ਰਾਓ ਦੀ ਅਰਜ਼ੀ ਪਰਮਿਟ ਜਾਰੀ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਦੱਸੀਆਂ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ।"
      ],
      [
        "The permit has already been issued to Rao.",
        "राव को परमिट पहले ही जारी किया जा चुका है।",
        "ਰਾਓ ਨੂੰ ਪਰਮਿਟ ਪਹਿਲਾਂ ਹੀ ਜਾਰੀ ਹੋ ਚੁੱਕਾ ਹੈ।"
      ],
      [
        "The drawing approval and fee payment are both recorded, so the two stated pre-issue conditions are met. The register has not been updated, so issuance itself is not established."
      ],
      true
    ],
    [
      "ELIGIBILITY_INTERSECTION",
      "ACCOUNT-CHANGE",
      "BANKING",
      "MEDIUM",
      [
        "A bank processes an account-name change only when it has a signed request and a verified identity document. The branch received both documents for Ms Gill, and the verification desk marked the identity document as verified. The processing queue still shows her request as pending.",
        "बैंक खाते में नाम बदलने का अनुरोध तभी संसाधित करता है जब हस्ताक्षरित अनुरोध और सत्यापित पहचान-पत्र दोनों मिल जाएँ। शाखा को श्रीमती गिल के दोनों दस्तावेज मिले और जाँच डेस्क ने पहचान-पत्र को सत्यापित चिह्नित किया। प्रक्रिया सूची में अनुरोध अभी लंबित है।",
        "ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਨਾਂ ਬਦਲਣ ਦੀ ਬੇਨਤੀ ਤਾਂ ਹੀ ਅੱਗੇ ਵਧਾਉਂਦਾ ਹੈ ਜੇ ਦਸਤਖ਼ਤ ਕੀਤੀ ਬੇਨਤੀ ਅਤੇ ਤਸਦੀਕ ਕੀਤਾ ਪਛਾਣ-ਪੱਤਰ ਦੋਵੇਂ ਮਿਲਣ। ਸ਼ਾਖਾ ਨੂੰ ਸ੍ਰੀਮਤੀ ਗਿੱਲ ਦੇ ਦੋਵੇਂ ਦਸਤਾਵੇਜ਼ ਮਿਲੇ ਅਤੇ ਜਾਂਚ ਡੈਸਕ ਨੇ ਪਛਾਣ-ਪੱਤਰ ਤਸਦੀਕਸ਼ੁਦਾ ਦਰਜ ਕੀਤਾ। ਪ੍ਰਕਿਰਿਆ ਸੂਚੀ ਵਿੱਚ ਬੇਨਤੀ ਹਾਲੇ ਬਕਾਇਆ ਹੈ।"
      ],
      [
        "Ms Gill's request satisfies both stated document conditions for processing.",
        "श्रीमती गिल का अनुरोध प्रक्रिया के लिए बताई गई दोनों दस्तावेजी शर्तें पूरी करता है।",
        "ਸ੍ਰੀਮਤੀ ਗਿੱਲ ਦੀ ਬੇਨਤੀ ਅੱਗੇ ਵਧਾਉਣ ਲਈ ਦੱਸੀਆਂ ਦੋਵੇਂ ਦਸਤਾਵੇਜ਼ੀ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ।"
      ],
      [
        "The account-name change has been completed.",
        "खाते में नाम बदलने की प्रक्रिया पूरी हो गई है।",
        "ਖਾਤੇ ਵਿੱਚ ਨਾਂ ਬਦਲਣ ਦੀ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋ ਗਈ ਹੈ।"
      ],
      [
        "The signed request and verified identity document meet the two stated conditions. The request is still pending, so the change has not been shown as completed."
      ],
      false
    ],
    [
      "ELIGIBILITY_INTERSECTION",
      "TRAINING-CERTIFICATE",
      "WORKPLACE",
      "MEDIUM",
      [
        "Employees receive the equipment certificate after completing the safety module, attending the practical session and passing its check. Aman completed the module and attended the session, but the result sheet records no pass or fail decision for him. The training unit issues certificates only after all three steps are recorded.",
        "कर्मचारियों को उपकरण प्रमाणपत्र तभी मिलता है जब वे सुरक्षा मॉड्यूल पूरा करें, प्रायोगिक सत्र में आएँ और उसकी जाँच पास करें। अमन ने मॉड्यूल पूरा किया और सत्र में भाग लिया, लेकिन परिणाम-पत्र में उसके पास या फेल होने का निर्णय दर्ज नहीं है। प्रशिक्षण इकाई तीनों चरण दर्ज होने के बाद ही प्रमाणपत्र देती है।",
        "ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਦਾ ਸਰਟੀਫਿਕੇਟ ਤਾਂ ਹੀ ਮਿਲਦਾ ਹੈ ਜੇ ਉਹ ਸੁਰੱਖਿਆ ਮੋਡੀਊਲ ਪੂਰਾ ਕਰਨ, ਪ੍ਰੈਕਟੀਕਲ ਸੈਸ਼ਨ ਵਿੱਚ ਹਾਜ਼ਰ ਹੋਣ ਅਤੇ ਜਾਂਚ ਪਾਸ ਕਰਨ। ਅਮਨ ਨੇ ਮੋਡੀਊਲ ਪੂਰਾ ਕੀਤਾ ਅਤੇ ਸੈਸ਼ਨ ਵਿੱਚ ਹਾਜ਼ਰ ਹੋਇਆ, ਪਰ ਨਤੀਜਾ-ਸੂਚੀ ਵਿੱਚ ਉਸ ਦੇ ਪਾਸ ਜਾਂ ਫੇਲ੍ਹ ਹੋਣ ਦਾ ਫ਼ੈਸਲਾ ਦਰਜ ਨਹੀਂ। ਸਿਖਲਾਈ ਇਕਾਈ ਤਿੰਨੇ ਕਦਮ ਦਰਜ ਹੋਣ ਤੋਂ ਬਾਅਦ ਹੀ ਸਰਟੀਫਿਕੇਟ ਦਿੰਦੀ ਹੈ।"
      ],
      [
        "Aman has completed two of the three recorded steps required for the certificate.",
        "अमन ने प्रमाणपत्र के लिए जरूरी तीन दर्ज चरणों में से दो पूरे किए हैं।",
        "ਅਮਨ ਨੇ ਸਰਟੀਫਿਕੇਟ ਲਈ ਲੋੜੀਂਦੇ ਤਿੰਨ ਦਰਜ ਕਦਮਾਂ ਵਿੱਚੋਂ ਦੋ ਪੂਰੇ ਕੀਤੇ ਹਨ।"
      ],
      [
        "Aman has qualified for the equipment certificate.",
        "अमन उपकरण प्रमाणपत्र के लिए योग्य हो गया है।",
        "ਅਮਨ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਦੇ ਸਰਟੀਫਿਕੇਟ ਲਈ ਯੋਗ ਹੋ ਗਿਆ ਹੈ।"
      ],
      [
        "The module and practical attendance are recorded, but the required check result is not. Therefore only two of the three required steps are established; qualification is not."
      ],
      false
    ]
  ],
  "PROCESS_REQUIREMENTS": [
    [
      "PROCESS_REQUIREMENTS",
      "INVOICE-RELEASE",
      "BUSINESS",
      "MEDIUM",
      [
        "A supplier sends an invoice to accounts after the delivery note is signed and the received quantity is entered in the stock record. The delivery note for order 684 is signed, and the stock record shows the received quantity. Accounts has not yet recorded that the invoice was sent.",
        "सप्लायर डिलीवरी नोट पर हस्ताक्षर और स्टॉक रिकॉर्ड में प्राप्त मात्रा दर्ज होने के बाद ही बिल लेखा विभाग को भेजता है। ऑर्डर 684 का डिलीवरी नोट हस्ताक्षरित है और स्टॉक रिकॉर्ड में प्राप्त मात्रा दर्ज है। लेखा विभाग ने अभी बिल भेजे जाने का रिकॉर्ड नहीं किया है।",
        "ਸਪਲਾਇਰ ਡਿਲਿਵਰੀ ਨੋਟ 'ਤੇ ਦਸਤਖ਼ਤ ਹੋਣ ਅਤੇ ਸਟਾਕ ਰਿਕਾਰਡ ਵਿੱਚ ਮਿਲੀ ਮਾਤਰਾ ਦਰਜ ਹੋਣ ਤੋਂ ਬਾਅਦ ਹੀ ਬਿੱਲ ਲੇਖਾ ਵਿਭਾਗ ਨੂੰ ਭੇਜਦਾ ਹੈ। ਆਰਡਰ 684 ਦਾ ਡਿਲਿਵਰੀ ਨੋਟ ਦਸਤਖ਼ਤ ਕੀਤਾ ਹੋਇਆ ਹੈ ਅਤੇ ਸਟਾਕ ਰਿਕਾਰਡ ਵਿੱਚ ਮਿਲੀ ਮਾਤਰਾ ਦਰਜ ਹੈ। ਲੇਖਾ ਵਿਭਾਗ ਨੇ ਹਾਲੇ ਬਿੱਲ ਭੇਜਣ ਦੀ ਦਰਜ ਨਹੀਂ ਕੀਤੀ।"
      ],
      [
        "The two stated checks before sending the invoice are complete for order 684.",
        "ਆਰਡਰ 684 ਦਾ ਬਿੱਲ ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ ਵਾਲੀਆਂ ਦੋਵੇਂ ਦੱਸੀਆਂ ਜਾਂਚਾਂ ਪੂਰੀਆਂ ਹਨ।",
        "ਆਰਡਰ 684 ਦਾ ਬਿੱਲ ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ ਦੱਸੀਆਂ ਦੋਵੇਂ ਜਾਂਚਾਂ ਮੁਕੰਮਲ ਹਨ।"
      ],
      [
        "The invoice has been paid by accounts.",
        "लेखा विभाग ने बिल का भुगतान कर दिया है।",
        "ਲੇਖਾ ਵਿਭਾਗ ਨੇ ਬਿੱਲ ਦਾ ਭੁਗਤਾਨ ਕਰ ਦਿੱਤਾ ਹੈ।"
      ],
      [
        "The signed delivery note and stock entry satisfy both checks stated before the invoice is sent. The passage does not say that the invoice was sent or paid."
      ],
      true
    ],
    [
      "PROCESS_REQUIREMENTS",
      "CLAIM-REVIEW",
      "BANKING",
      "MEDIUM",
      [
        "A travel claim reaches the payment desk only after the supervisor approves it and accounts checks the receipts. The supervisor approved Kiran's claim, while accounts returned one receipt for clarification. The status board places the claim in the clarification queue, not at the payment desk.",
        "यात्रा दावा भुगतान डेस्क तक तभी पहुँचता है जब पर्यवेक्षक उसे मंजूर करे और लेखा विभाग रसीदों की जाँच करे। पर्यवेक्षक ने किरण का दावा मंजूर किया, जबकि लेखा विभाग ने एक रसीद पर स्पष्टीकरण माँगते हुए उसे लौटाया। स्थिति-पटल पर दावा भुगतान डेस्क के बजाय स्पष्टीकरण कतार में है।",
        "ਯਾਤਰਾ ਦਾ ਦਾਅਵਾ ਭੁਗਤਾਨ ਡੈਸਕ ਤੱਕ ਤਾਂ ਹੀ ਪਹੁੰਚਦਾ ਹੈ ਜੇ ਨਿਗਰਾਨ ਇਸ ਨੂੰ ਮਨਜ਼ੂਰ ਕਰੇ ਅਤੇ ਲੇਖਾ ਵਿਭਾਗ ਰਸੀਦਾਂ ਦੀ ਜਾਂਚ ਕਰੇ। ਨਿਗਰਾਨ ਨੇ ਕਿਰਨ ਦਾ ਦਾਅਵਾ ਮਨਜ਼ੂਰ ਕੀਤਾ, ਪਰ ਲੇਖਾ ਵਿਭਾਗ ਨੇ ਇੱਕ ਰਸੀਦ ਬਾਰੇ ਸਪਸ਼ਟੀਕਰਨ ਲਈ ਵਾਪਸ ਕੀਤਾ। ਸਥਿਤੀ-ਪਟ 'ਤੇ ਦਾਅਵਾ ਭੁਗਤਾਨ ਡੈਸਕ ਦੀ ਬਜਾਏ ਸਪਸ਼ਟੀਕਰਨ ਕਤਾਰ ਵਿੱਚ ਹੈ।"
      ],
      [
        "Kiran's claim has supervisor approval, but the receipt check is not complete.",
        "किरण के दावे को पर्यवेक्षक की मंजूरी मिली है, लेकिन रसीद की जाँच पूरी नहीं हुई।",
        "ਕਿਰਨ ਦੇ ਦਾਅਵੇ ਨੂੰ ਨਿਗਰਾਨ ਦੀ ਮਨਜ਼ੂਰੀ ਮਿਲੀ ਹੈ, ਪਰ ਰਸੀਦ ਦੀ ਜਾਂਚ ਪੂਰੀ ਨਹੀਂ ਹੋਈ।"
      ],
      [
        "Kiran's claim has reached the payment desk.",
        "किरण का दावा भुगतान डेस्क तक पहुँच गया है।",
        "ਕਿਰਨ ਦਾ ਦਾਅਵਾ ਭੁਗਤਾਨ ਡੈਸਕ ਤੱਕ ਪਹੁੰਚ ਗਿਆ ਹੈ।"
      ],
      [
        "Approval is recorded, but accounts has returned a receipt and the board shows a clarification hold. The two required checks are not both complete, so the claim has not reached payment."
      ],
      false
    ],
    [
      "PROCESS_REQUIREMENTS",
      "LIBRARY-RESERVATION",
      "EDUCATION",
      "MEDIUM",
      [
        "A reserved reference book is placed at the collection desk when the library receives it and the borrower has no overdue loan. The library received the book reserved by Farah, and her account shows no overdue loan. The collection desk list is prepared at the end of the day.",
        "पुस्तकालय संदर्भ-पुस्तक को संग्रह डेस्क पर तब रखता है जब पुस्तकालय को पुस्तक मिल जाए और उधार लेने वाले के पास कोई देर से लौटाई गई पुस्तक न हो। फराह के लिए आरक्षित पुस्तक पुस्तकालय को मिल गई है और उसके खाते में कोई देर से लौटाई गई पुस्तक नहीं है। संग्रह डेस्क की सूची दिन के अंत में तैयार होती है।",
        "ਲਾਇਬ੍ਰੇਰੀ ਰਾਖਵੀਂ ਸੰਦਰਭ ਕਿਤਾਬ ਨੂੰ ਪ੍ਰਾਪਤੀ ਡੈਸਕ 'ਤੇ ਉਦੋਂ ਰੱਖਦੀ ਹੈ ਜਦੋਂ ਕਿਤਾਬ ਲਾਇਬ੍ਰੇਰੀ ਨੂੰ ਮਿਲ ਜਾਵੇ ਅਤੇ ਪਾਠਕ ਕੋਲ ਕੋਈ ਦੇਰ ਨਾਲ ਵਾਪਸ ਕਰਨ ਵਾਲੀ ਕਿਤਾਬ ਨਾ ਹੋਵੇ। ਫਰਾਹ ਲਈ ਰਾਖਵੀਂ ਕਿਤਾਬ ਲਾਇਬ੍ਰੇਰੀ ਨੂੰ ਮਿਲ ਗਈ ਹੈ ਅਤੇ ਉਸ ਦੇ ਖਾਤੇ ਵਿੱਚ ਕੋਈ ਦੇਰ ਨਾਲ ਵਾਪਸ ਕੀਤੀ ਕਿਤਾਬ ਨਹੀਂ। ਪ੍ਰਾਪਤੀ ਡੈਸਕ ਦੀ ਸੂਚੀ ਦਿਨ ਦੇ ਅੰਤ 'ਤੇ ਬਣਦੀ ਹੈ।"
      ],
      [
        "Farah's reservation meets both stated conditions for the book to be placed at the collection desk.",
        "ਫਰਾਹ ਦਾ ਰਾਖਵਾਂਕਰਨ ਕਿਤਾਬ ਪ੍ਰਾਪਤੀ ਡੈਸਕ 'ਤੇ ਰੱਖਣ ਲਈ ਦੱਸੀਆਂ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦਾ ਹੈ।",
        "ਫਰਾਹ ਦਾ ਰਾਖਵਾਂਕਰਨ ਕਿਤਾਬ ਨੂੰ ਲੈਣ ਵਾਲੇ ਡੈਸਕ 'ਤੇ ਰੱਖਣ ਲਈ ਦੱਸੀਆਂ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦਾ ਹੈ।"
      ],
      [
        "Farah has already collected the book.",
        "फराह पुस्तक पहले ही ले चुकी है।",
        "ਫਰਾਹ ਕਿਤਾਬ ਪਹਿਲਾਂ ਹੀ ਲੈ ਚੁੱਕੀ ਹੈ।"
      ],
      [
        "The library has the book, and Farah has no overdue loan, so both placement conditions are met. The list is only prepared at day-end; collection is not reported."
      ],
      true
    ]
  ],
  "SERVICE_AND_SCHEDULE": [
    [
      "SERVICE_AND_SCHEDULE",
      "CLINIC-APPOINTMENT",
      "HEALTHCARE",
      "MEDIUM",
      [
        "The clinic books a follow-up only after a patient completes the first consultation and the test report reaches the doctor. Leena completed her consultation, and the report was delivered to the doctor on Monday. The appointment register will be updated on Tuesday.",
        "क्लिनिक अनुवर्ती जाँच की तारीख तभी तय करता है जब मरीज पहली परामर्श-जाँच पूरी करे और जाँच रिपोर्ट डॉक्टर तक पहुँच जाए। लीना ने परामर्श-जाँच पूरी की और रिपोर्ट सोमवार को डॉक्टर को दे दी गई। अपॉइंटमेंट रजिस्टर मंगलवार को अपडेट होगा।",
        "ਕਲੀਨਿਕ ਅਗਲੀ ਮੁਲਾਕਾਤ ਤਦ ਹੀ ਤੈਅ ਕਰਦਾ ਹੈ ਜੇ ਮਰੀਜ਼ ਪਹਿਲੀ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਜਾਂਚ ਪੂਰੀ ਕਰੇ ਅਤੇ ਜਾਂਚ ਰਿਪੋਰਟ ਡਾਕਟਰ ਤੱਕ ਪਹੁੰਚੇ। ਲੀਨਾ ਨੇ ਪਹਿਲੀ ਜਾਂਚ ਪੂਰੀ ਕੀਤੀ ਅਤੇ ਰਿਪੋਰਟ ਸੋਮਵਾਰ ਨੂੰ ਡਾਕਟਰ ਨੂੰ ਦੇ ਦਿੱਤੀ ਗਈ। ਮੁਲਾਕਾਤ ਰਜਿਸਟਰ ਮੰਗਲਵਾਰ ਨੂੰ ਅਪਡੇਟ ਹੋਵੇਗਾ।"
      ],
      [
        "Leena has completed both stated steps required before a follow-up can be booked.",
        "लीना ने अगली मुलाकात तय होने से पहले जरूरी दोनों चरण पूरे कर लिए हैं।",
        "ਲੀਨਾ ਨੇ ਅਗਲੀ ਮੁਲਾਕਾਤ ਤੈਅ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਲੋੜੀਂਦੇ ਦੋਵੇਂ ਕਦਮ ਪੂਰੇ ਕਰ ਲਏ ਹਨ।"
      ],
      [
        "Leena's follow-up appointment is already entered in the register.",
        "लीना की अगली मुलाकात रजिस्टर में पहले ही दर्ज है।",
        "ਲੀਨਾ ਦੀ ਅਗਲੀ ਮੁਲਾਕਾਤ ਰਜਿਸਟਰ ਵਿੱਚ ਪਹਿਲਾਂ ਹੀ ਦਰਜ ਹੈ।"
      ],
      [
        "The consultation is complete and the report reached the doctor, so both prerequisites are met. The register will be updated tomorrow, so an entry is not yet established."
      ],
      true
    ],
    [
      "SERVICE_AND_SCHEDULE",
      "ROUTE-CHANGE",
      "TRANSPORT",
      "HARD",
      [
        "A road closure prevents buses from reaching the market stop after 6 p.m. Route 8 is the only bus route listed for that stop, and its last trip is scheduled for 5:30 p.m. The notice gives no temporary shuttle service.",
        "सड़क बंद होने के कारण शाम 6 बजे के बाद बसें बाजार के स्टॉप तक नहीं पहुँच सकतीं। उस स्टॉप के लिए सूची में रूट 8 ही एकमात्र बस मार्ग है और उसकी आखिरी बस 5:30 बजे निर्धारित है। सूचना में कोई अस्थायी शटल सेवा नहीं दी गई है।",
        "ਸੜਕ ਬੰਦ ਹੋਣ ਕਾਰਨ ਸ਼ਾਮ 6 ਵਜੇ ਤੋਂ ਬਾਅਦ ਬੱਸਾਂ ਬਾਜ਼ਾਰ ਵਾਲੇ ਸਟਾਪ ਤੱਕ ਨਹੀਂ ਪਹੁੰਚ ਸਕਦੀਆਂ। ਉਸ ਸਟਾਪ ਲਈ ਸੂਚੀ ਵਿੱਚ ਰੂਟ 8 ਹੀ ਇਕੱਲਾ ਬੱਸ ਰੂਟ ਹੈ ਅਤੇ ਇਸ ਦੀ ਆਖਰੀ ਬੱਸ 5:30 ਵਜੇ ਤੈਅ ਹੈ। ਨੋਟਿਸ ਵਿੱਚ ਕੋਈ ਅਸਥਾਈ ਸ਼ਟਲ ਸੇਵਾ ਨਹੀਂ ਦਿੱਤੀ ਗਈ।"
      ],
      [
        "No scheduled Route 8 trip reaches the market stop after the closure begins.",
        "ਸੜਕ ਬੰਦ ਹੋਣ ਤੋਂ ਬਾਅਦ ਰੂਟ 8 ਦੀ ਕੋਈ ਤੈਅ ਬੱਸ ਬਾਜ਼ਾਰ ਸਟਾਪ ਤੱਕ ਨਹੀਂ ਪਹੁੰਚਦੀ।",
        "ਸੜਕ ਬੰਦ ਹੋਣ ਮਗਰੋਂ ਰੂਟ 8 ਦੀ ਕੋਈ ਨਿਰਧਾਰਤ ਬੱਸ ਬਾਜ਼ਾਰ ਦੇ ਸਟਾਪ ਤੱਕ ਨਹੀਂ ਪਹੁੰਚਦੀ।"
      ],
      [
        "The market stop has no public transport service at any time that evening.",
        "ਉਸ ਸ਼ਾਮ ਬਾਜ਼ਾਰ ਸਟॉप ਲਈ ਕਿਸੇ ਵੀ ਸਮੇਂ ਜਨਤਕ ਆਵਾਜਾਈ ਸੇਵਾ ਨਹੀਂ ਹੈ।",
        "ਉਸ ਸ਼ਾਮ ਬਾਜ਼ਾਰ ਸਟਾਪ ਲਈ ਕਿਸੇ ਵੀ ਸਮੇਂ ਜਨਤਕ ਆਵਾਜਾਈ ਸੇਵਾ ਨਹੀਂ ਹੈ।"
      ],
      [
        "The only listed route's last trip is before 6 p.m., and buses cannot reach the stop after 6. This supports the limited claim about scheduled Route 8 trips, not the broader claim about all transport all evening."
      ],
      false
    ],
    [
      "SERVICE_AND_SCHEDULE",
      "COUNTER-SERVICE",
      "PUBLIC_ADMINISTRATION",
      "HARD",
      [
        "The records counter accepts applications only on weekdays and closes at 3 p.m. The office is closed on Monday for a public holiday, and Tuesday's notice lists the counter as open until 3 p.m. No weekend opening is announced.",
        "रिकॉर्ड काउंटर केवल कार्यदिवसों में आवेदन लेता है और दोपहर 3 बजे बंद हो जाता है। सार्वजनिक अवकाश के कारण सोमवार को कार्यालय बंद है और मंगलवार की सूचना में काउंटर दोपहर 3 बजे तक खुला है। सप्ताहांत में खुलने की कोई घोषणा नहीं है।",
        "ਰਿਕਾਰਡ ਕਾਊਂਟਰ ਸਿਰਫ਼ ਕੰਮਕਾਜੀ ਦਿਨਾਂ 'ਤੇ ਅਰਜ਼ੀਆਂ ਲੈਂਦਾ ਹੈ ਅਤੇ ਦੁਪਹਿਰ 3 ਵਜੇ ਬੰਦ ਹੁੰਦਾ ਹੈ। ਸਰਕਾਰੀ ਛੁੱਟੀ ਕਾਰਨ ਸੋਮਵਾਰ ਨੂੰ ਦਫ਼ਤਰ ਬੰਦ ਹੈ ਅਤੇ ਮੰਗਲਵਾਰ ਦੇ ਨੋਟਿਸ ਵਿੱਚ ਕਾਊਂਟਰ ਦੁਪਹਿਰ 3 ਵਜੇ ਤੱਕ ਖੁੱਲ੍ਹਾ ਹੈ। ਹਫ਼ਤੇ ਦੇ ਅੰਤ 'ਤੇ ਖੁੱਲ੍ਹਣ ਦੀ ਕੋਈ ਘੋਸ਼ਣਾ ਨਹੀਂ।"
      ],
      [
        "The counter is available on Tuesday during its stated working hours.",
        "ਕਾਊਂਟਰ ਮੰਗਲਵਾਰ ਨੂੰ ਦੱਸੇ ਕੰਮਕਾਜੀ ਸਮੇਂ ਦੌਰਾਨ ਖੁੱਲ੍ਹਾ ਹੈ।",
        "ਮੰਗਲਵਾਰ ਨੂੰ ਕਾਊਂਟਰ ਦੱਸੇ ਕੰਮਕਾਜੀ ਸਮੇਂ ਦੌਰਾਨ ਖੁੱਲ੍ਹਾ ਹੈ।"
      ],
      [
        "The counter is open every day of that week.",
        "उस सप्ताह काउंटर हर दिन खुला है।",
        "ਉਸ ਹਫ਼ਤੇ ਕਾਊਂਟਰ ਹਰ ਰੋਜ਼ ਖੁੱਲ੍ਹਾ ਹੈ।"
      ],
      [
        "Tuesday is a working day and the notice says the counter is open until 3 p.m., so service is available then. Monday is closed and no weekend service is announced, which defeats the every-day claim."
      ],
      true
    ]
  ],
  "RESOURCE_AND_DEMAND": [
    [
      "RESOURCE_AND_DEMAND",
      "HELP-DESK-STAFFING",
      "WORKPLACE",
      "MEDIUM",
      [
        "The help desk assigns two staff members to the morning shift when at least 30 appointments are booked. On Wednesday, 34 appointments were booked, and the roster shows two staff members assigned to the morning shift. The afternoon roster is prepared separately.",
        "जब कम-से-कम 30 अपॉइंटमेंट बुक होते हैं, तो सहायता डेस्क सुबह की पाली में दो कर्मचारी लगाती है। बुधवार को 34 अपॉइंटमेंट बुक हुए और रोस्टर में सुबह की पाली में दो कर्मचारी दर्ज हैं। दोपहर की पाली का रोस्टर अलग से बनता है।",
        "ਜਦੋਂ ਘੱਟੋ-ਘੱਟ 30 ਮੁਲਾਕਾਤਾਂ ਬੁੱਕ ਹੋਣ, ਤਾਂ ਸਹਾਇਤਾ ਡੈਸਕ ਸਵੇਰ ਦੀ ਸ਼ਿਫਟ ਵਿੱਚ ਦੋ ਕਰਮਚਾਰੀ ਲਗਾਉਂਦੀ ਹੈ। ਬੁੱਧਵਾਰ ਨੂੰ 34 ਮੁਲਾਕਾਤਾਂ ਬੁੱਕ ਹੋਈਆਂ ਅਤੇ ਰੋਸਟਰ ਵਿੱਚ ਸਵੇਰ ਦੀ ਸ਼ਿਫਟ ਲਈ ਦੋ ਕਰਮਚਾਰੀ ਦਰਜ ਹਨ। ਦੁਪਹਿਰ ਦੀ ਸ਼ਿਫਟ ਦਾ ਰੋਸਟਰ ਵੱਖਰਾ ਬਣਦਾ ਹੈ।"
      ],
      [
        "Wednesday's booking total meets the threshold for the two-person morning assignment.",
        "बुधवार की बुकिंग संख्या दो कर्मचारियों की सुबह की तैनाती वाली सीमा पूरी करती है।",
        "ਬੁੱਧਵਾਰ ਦੀ ਬੁਕਿੰਗ ਗਿਣਤੀ ਦੋ ਕਰਮਚਾਰੀਆਂ ਦੀ ਸਵੇਰ ਦੀ ਤਾਇਨਾਤੀ ਵਾਲੀ ਹੱਦ ਪੂਰੀ ਕਰਦੀ ਹੈ।"
      ],
      [
        "Two staff members were assigned to the afternoon shift as well.",
        "दोपहर की पाली में भी दो कर्मचारी लगाए गए।",
        "ਦੁਪਹਿਰ ਦੀ ਸ਼ਿਫਟ ਵਿੱਚ ਵੀ ਦੋ ਕਰਮਚਾਰੀ ਲਗਾਏ ਗਏ।"
      ],
      [
        "There were 34 bookings, above the stated threshold, and the roster confirms two morning staff. The afternoon roster is separate, so the morning assignment cannot be extended to it."
      ],
      true
    ],
    [
      "RESOURCE_AND_DEMAND",
      "WAREHOUSE-TRANSFER",
      "BUSINESS",
      "HARD",
      [
        "A warehouse sends a transfer only when the destination has confirmed storage space and the dispatch team has packed the goods. Depot B confirmed space for shipment 51, and the packing sheet shows the shipment is packed. The transfer register is updated after the truck leaves.",
        "गोदाम माल का स्थानांतरण तभी भेजता है जब गंतव्य स्थान भंडारण की जगह की पुष्टि करे और डिस्पैच टीम सामान पैक कर दे। डिपो B ने खेप 51 के लिए जगह की पुष्टि की और पैकिंग शीट में सामान पैक दर्ज है। ट्रक रवाना होने के बाद स्थानांतरण रजिस्टर अपडेट होता है।",
        "ਗੋਦਾਮ ਮਾਲ ਤਦ ਹੀ ਭੇਜਦਾ ਹੈ ਜੇ ਮੰਜ਼ਿਲ ਵਾਲਾ ਡਿਪੋ ਸਟੋਰੇਜ ਦੀ ਥਾਂ ਪੱਕੀ ਕਰੇ ਅਤੇ ਡਿਸਪੈਚ ਟੀਮ ਸਮਾਨ ਪੈਕ ਕਰ ਦੇਵੇ। ਡਿਪੋ B ਨੇ ਖੇਪ 51 ਲਈ ਥਾਂ ਪੱਕੀ ਕੀਤੀ ਅਤੇ ਪੈਕਿੰਗ ਸ਼ੀਟ ਵਿੱਚ ਸਮਾਨ ਪੈਕ ਦਰਜ ਹੈ। ਟਰੱਕ ਰਵਾਨਾ ਹੋਣ ਤੋਂ ਬਾਅਦ ਤਬਾਦਲਾ ਰਜਿਸਟਰ ਅਪਡੇਟ ਹੁੰਦਾ ਹੈ।"
      ],
      [
        "Shipment 51 meets both stated conditions for dispatch.",
        "खेप 51 डिस्पैच की बताई गई दोनों शर्तें पूरी करती है।",
        "ਖੇਪ 51 ਡਿਸਪੈਚ ਦੀਆਂ ਦੱਸੀਆਂ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ।"
      ],
      [
        "Shipment 51 has left the warehouse.",
        "खेप 51 गोदाम से रवाना हो चुकी है।",
        "ਖੇਪ 51 ਗੋਦਾਮ ਤੋਂ ਰਵਾਨਾ ਹੋ ਚੁੱਕੀ ਹੈ।"
      ],
      [
        "Depot B confirmed space and the goods are packed, so both pre-dispatch conditions are met. The register is updated only after the truck leaves; no departure is reported."
      ],
      false
    ],
    [
      "RESOURCE_AND_DEMAND",
      "STUDY-ROOM-BOOKING",
      "EDUCATION",
      "HARD",
      [
        "A study room is assigned when a group has at least four registered students and submits its request before noon. Group C has five registered students, and its request was received at 11:40 a.m. The allocation list will be posted after the afternoon review.",
        "अध्ययन कक्ष तब आवंटित होता है जब समूह में कम-से-कम चार पंजीकृत विद्यार्थी हों और अनुरोध दोपहर से पहले जमा हो। समूह C में पाँच पंजीकृत विद्यार्थी हैं और उसका अनुरोध सुबह 11:40 बजे मिला। आवंटन सूची दोपहर की समीक्षा के बाद लगेगी।",
        "ਪੜ੍ਹਾਈ ਕਮਰਾ ਉਦੋਂ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ ਜਦੋਂ ਸਮੂਹ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਚਾਰ ਦਰਜ ਵਿਦਿਆਰਥੀ ਹੋਣ ਅਤੇ ਬੇਨਤੀ ਦੁਪਹਿਰ ਤੋਂ ਪਹਿਲਾਂ ਮਿਲੇ। ਸਮੂਹ C ਵਿੱਚ ਪੰਜ ਦਰਜ ਵਿਦਿਆਰਥੀ ਹਨ ਅਤੇ ਇਸ ਦੀ ਬੇਨਤੀ ਸਵੇਰੇ 11:40 ਵਜੇ ਮਿਲੀ। ਵੰਡ ਸੂਚੀ ਦੁਪਹਿਰ ਦੀ ਸਮੀਖਿਆ ਤੋਂ ਬਾਅਦ ਲੱਗੇਗੀ।"
      ],
      [
        "Group C meets both stated conditions for a study-room assignment.",
        "समूह C अध्ययन कक्ष आवंटन की बताई गई दोनों शर्तें पूरी करता है।",
        "ਸਮੂਹ C ਪੜ੍ਹਾਈ ਕਮਰਾ ਲੈਣ ਦੀਆਂ ਦੱਸੀਆਂ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦਾ ਹੈ।"
      ],
      [
        "A study room has already been assigned to Group C.",
        "समूह C को अध्ययन कक्ष पहले ही आवंटित हो चुका है।",
        "ਸਮੂਹ C ਨੂੰ ਪੜ੍ਹਾਈ ਕਮਰਾ ਪਹਿਲਾਂ ਹੀ ਦਿੱਤਾ ਜਾ ਚੁੱਕਾ ਹੈ।"
      ],
      [
        "The group meets the minimum size and submitted its request before noon, so the stated eligibility conditions are met. The list comes after review, so an actual assignment is not yet shown."
      ],
      true
    ]
  ],
  "GROUP_AND_SCOPE": [
    [
      "GROUP_AND_SCOPE",
      "SURVEY-ELIGIBILITY",
      "SURVEY",
      "MEDIUM",
      [
        "A feedback form was sent only to customers who used the mobile app during June. Of the forms returned, 72% rated the payment screen easy to use. The report covers those respondents and that month.",
        "फीडबैक फॉर्म केवल उन ग्राहकों को भेजा गया जिन्होंने जून में मोबाइल ऐप इस्तेमाल किया। लौटाए गए फॉर्म में से 72% उत्तरदाताओं ने भुगतान स्क्रीन को इस्तेमाल में आसान बताया। रिपोर्ट उन्हीं उत्तरदाताओं और उसी महीने तक सीमित है।",
        "ਫੀਡਬੈਕ ਫਾਰਮ ਸਿਰਫ਼ ਉਨ੍ਹਾਂ ਗਾਹਕਾਂ ਨੂੰ ਭੇਜਿਆ ਗਿਆ ਜਿਨ੍ਹਾਂ ਨੇ ਜੂਨ ਵਿੱਚ ਮੋਬਾਈਲ ਐਪ ਵਰਤੀ। ਵਾਪਸ ਆਏ ਫਾਰਮਾਂ ਵਿੱਚੋਂ 72% ਜਵਾਬਦਾਤਿਆਂ ਨੇ ਭੁਗਤਾਨ ਸਕ੍ਰੀਨ ਨੂੰ ਵਰਤਣ ਵਿੱਚ ਆਸਾਨ ਦੱਸਿਆ। ਰਿਪੋਰਟ ਉਨ੍ਹਾਂ ਜਵਾਬਦਾਤਿਆਂ ਅਤੇ ਉਸੇ ਮਹੀਨੇ ਤੱਕ ਸੀਮਿਤ ਹੈ।"
      ],
      [
        "A majority of the responding June app users rated the payment screen easy to use.",
        "ਜੂਨ ਵਿੱਚ ਐਪ ਵਰਤਣ ਵਾਲੇ ਜਵਾਬਦਾਤਿਆਂ ਵਿੱਚੋਂ ਬਹੁਮਤ ਨੇ ਭੁਗਤਾਨ ਸਕ੍ਰੀਨ ਨੂੰ ਵਰਤਣ ਵਿੱਚ ਆਸਾਨ ਦੱਸਿਆ।",
        "ਜੂਨ ਵਿੱਚ ਐਪ ਵਰਤਣ ਵਾਲੇ ਜਵਾਬਦਾਤਿਆਂ ਵਿੱਚੋਂ ਬਹੁਗਿਣਤੀ ਨੇ ਭੁਗਤਾਨ ਸਕ੍ਰੀਨ ਨੂੰ ਵਰਤਣ ਵਿੱਚ ਸੌਖਾ ਦੱਸਿਆ।"
      ],
      [
        "A majority of all the company's customers found the payment screen easy to use throughout the year.",
        "कंपनी के सभी ग्राहकों में से अधिकांश को पूरे वर्ष भुगतान स्क्रीन इस्तेमाल में आसान लगी।",
        "ਕੰਪਨੀ ਦੇ ਸਾਰੇ ਗਾਹਕਾਂ ਵਿੱਚੋਂ ਬਹੁਤਿਆਂ ਨੂੰ ਪੂਰੇ ਸਾਲ ਭੁਗਤਾਨ ਸਕ੍ਰੀਨ ਵਰਤਣ ਵਿੱਚ ਆਸਾਨ ਲੱਗੀ।"
      ],
      [
        "The 72% result is a majority among returned forms from June app users. The sample does not cover all customers or other months."
      ],
      true
    ],
    [
      "GROUP_AND_SCOPE",
      "BRANCH-TRAINING",
      "WORKPLACE",
      "HARD",
      [
        "A bank trains tellers who are assigned to the cash desk and have completed the security module. At Branch M, the roster lists three cash-desk tellers, and two of them have completed the module. The training notice names those two employees only.",
        "बैंक उन टेलरों को प्रशिक्षण देता है जिन्हें नकदी डेस्क पर तैनात किया गया हो और जिन्होंने सुरक्षा मॉड्यूल पूरा किया हो। शाखा M के रोस्टर में नकदी डेस्क के तीन टेलर हैं और उनमें से दो ने मॉड्यूल पूरा किया है। प्रशिक्षण सूचना में केवल उन्हीं दो कर्मचारियों के नाम हैं।",
        "ਬੈਂਕ ਉਨ੍ਹਾਂ ਕੈਸ਼ ਡੈਸਕ ਟੈਲਰਾਂ ਨੂੰ ਸਿਖਲਾਈ ਦਿੰਦਾ ਹੈ ਜੋ ਸੁਰੱਖਿਆ ਮੋਡੀਊਲ ਪੂਰਾ ਕਰ ਚੁੱਕੇ ਹੋਣ। ਸ਼ਾਖਾ M ਦੇ ਰੋਸਟਰ ਵਿੱਚ ਕੈਸ਼ ਡੈਸਕ ਦੇ ਤਿੰਨ ਟੈਲਰ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ ਦੋ ਨੇ ਮੋਡੀਊਲ ਪੂਰਾ ਕੀਤਾ ਹੈ। ਸਿਖਲਾਈ ਨੋਟਿਸ ਵਿੱਚ ਸਿਰਫ਼ ਉਨ੍ਹਾਂ ਦੋ ਕਰਮਚਾਰੀਆਂ ਦੇ ਨਾਂ ਹਨ।"
      ],
      [
        "The two employees named in the notice meet both stated conditions for this training.",
        "सूचना में नामित दोनों कर्मचारी इस प्रशिक्षण की बताई गई दोनों शर्तें पूरी करते हैं।",
        "ਨੋਟਿਸ ਵਿੱਚ ਦਰਜ ਦੋਵੇਂ ਕਰਮਚਾਰੀ ਇਸ ਸਿਖਲਾਈ ਦੀਆਂ ਦੱਸੀਆਂ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੇ ਹਨ।"
      ],
      [
        "All three cash-desk tellers have completed the security module.",
        "तीनों नकदी डेस्क टेलरों ने सुरक्षा मॉड्यूल पूरा किया है।",
        "ਤਿੰਨਾਂ ਕੈਸ਼ ਡੈਸਕ ਟੈਲਰਾਂ ਨੇ ਸੁਰੱਖਿਆ ਮੋਡੀਊਲ ਪੂਰਾ ਕੀਤਾ ਹੈ।"
      ],
      [
        "The notice names only the two tellers who are both on the cash desk and module-complete. A third teller is listed, but the statement does not say that person completed the module."
      ],
      false
    ],
    [
      "GROUP_AND_SCOPE",
      "RURAL-CLINIC-ROSTER",
      "HEALTHCARE",
      "HARD",
      [
        "The mobile clinic visits villages that have both a registered health worker and a usable public room. Village P has a registered health worker, while the inspection report says its public room is still being repaired. The published roster includes Villages Q and R, not P.",
        "चलता-फिरता क्लिनिक उन्हीं गाँवों में जाता है जहाँ पंजीकृत स्वास्थ्यकर्मी और उपयोग योग्य सार्वजनिक कमरा दोनों हों। गाँव P में पंजीकृत स्वास्थ्यकर्मी है, लेकिन निरीक्षण रिपोर्ट के अनुसार उसका सार्वजनिक कमरा अभी मरम्मत में है। प्रकाशित सूची में गाँव Q और R हैं, P नहीं।",
        "ਚਲਦਾ-ਫਿਰਦਾ ਕਲੀਨਿਕ ਉਨ੍ਹਾਂ ਪਿੰਡਾਂ ਵਿੱਚ ਜਾਂਦਾ ਹੈ ਜਿੱਥੇ ਦਰਜ ਸਿਹਤ ਕਰਮਚਾਰੀ ਅਤੇ ਵਰਤਣਯੋਗ ਜਨਤਕ ਕਮਰਾ ਦੋਵੇਂ ਹੋਣ। ਪਿੰਡ P ਵਿੱਚ ਦਰਜ ਸਿਹਤ ਕਰਮਚਾਰੀ ਹੈ, ਪਰ ਜਾਂਚ ਰਿਪੋਰਟ ਮੁਤਾਬਕ ਉੱਥੋਂ ਦਾ ਜਨਤਕ ਕਮਰਾ ਹਾਲੇ ਮੁਰੰਮਤ ਹੇਠ ਹੈ। ਜਾਰੀ ਸੂਚੀ ਵਿੱਚ ਪਿੰਡ Q ਅਤੇ R ਹਨ, P ਨਹੀਂ।"
      ],
      [
        "Village P does not currently meet both stated conditions for a mobile-clinic visit.",
        "गाँव P मोबाइल क्लिनिक के लिए बताई गई दोनों शर्तें अभी पूरी नहीं करता।",
        "ਪਿੰਡ P ਮੋਬਾਈਲ ਕਲੀਨਿਕ ਲਈ ਦੱਸੀਆਂ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਇਸ ਵੇਲੇ ਪੂਰੀਆਂ ਨਹੀਂ ਕਰਦਾ।"
      ],
      [
        "The mobile clinic has already visited Village P this month.",
        "मोबाइल क्लिनिक इस महीने गाँव P जा चुका है।",
        "ਮੋਬਾਈਲ ਕਲੀਨਿਕ ਇਸ ਮਹੀਨੇ ਪਿੰਡ P ਜਾ ਚੁੱਕਾ ਹੈ।"
      ],
      [
        "Village P has a health worker but its public room is unusable during repairs, so one required condition is missing. It is also absent from the published roster."
      ],
      false
    ]
  ],
  "COMPARATIVE_CHAIN": [
    [
      "COMPARATIVE_CHAIN",
      "APPLICATION-OUTPUT",
      "PUBLIC_ADMINISTRATION",
      "MEDIUM",
      [
        "Office A processed more applications than Office B, and Office B processed more than Office C. All three offices were open for the same number of days. The report gives no staffing figures.",
        "कार्यालय A ने कार्यालय B से अधिक आवेदन निपटाए और कार्यालय B ने कार्यालय C से अधिक। तीनों कार्यालय समान दिनों तक खुले रहे। रिपोर्ट में कर्मचारियों की संख्या नहीं दी गई।",
        "ਦਫ਼ਤਰ A ਨੇ ਦਫ਼ਤਰ B ਨਾਲੋਂ ਵੱਧ ਅਰਜ਼ੀਆਂ ਨਿਪਟਾਈਆਂ ਅਤੇ ਦਫ਼ਤਰ B ਨੇ ਦਫ਼ਤਰ C ਨਾਲੋਂ ਵੱਧ। ਤਿੰਨੇ ਦਫ਼ਤਰ ਇਕੋ ਜਿਹੇ ਦਿਨ ਖੁੱਲ੍ਹੇ ਰਹੇ। ਰਿਪੋਰਟ ਵਿੱਚ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਨਹੀਂ ਦਿੱਤੀ।"
      ],
      [
        "Office A processed more applications per open day than Office C.",
        "ਦਫ਼ਤਰ A ਨੇ ਹਰ ਖੁੱਲ੍ਹੇ ਦਿਨ ਦਫ਼ਤਰ C ਨਾਲੋਂ ਵੱਧ ਅਰਜ਼ੀਆਂ ਨਿਪਟਾਈਆਂ।",
        "ਦਫ਼ਤਰ A ਨੇ ਹਰ ਖੁੱਲ੍ਹੇ ਦਿਨ ਦਫ਼ਤਰ C ਨਾਲੋਂ ਵੱਧ ਅਰਜ਼ੀਆਂ ਦਾ ਨਿਪਟਾਰਾ ਕੀਤਾ।"
      ],
      [
        "Office A had more staff than Office C.",
        "कार्यालय A में कार्यालय C से अधिक कर्मचारी थे।",
        "ਦਫ਼ਤਰ A ਵਿੱਚ ਦਫ਼ਤਰ C ਨਾਲੋਂ ਵੱਧ ਕਰਮਚਾਰੀ ਸਨ।"
      ],
      [
        "A processed more than B, and B more than C, so A processed more than C. Since all were open for the same number of days, the per-day comparison also holds. Staffing is not reported."
      ],
      true
    ],
    [
      "COMPARATIVE_CHAIN",
      "DELIVERY-RECORD",
      "BUSINESS",
      "HARD",
      [
        "In April, Supplier X delivered more orders on time than Supplier Y, and Supplier Y delivered more on time than Supplier Z. Each supplier handled the same number of orders that month. In May, their order totals were different and no on-time comparison is provided.",
        "अप्रैल में आपूर्तिकर्ता X ने समय पर आपूर्तिकर्ता Y से अधिक ऑर्डर पहुँचाए और Y ने Z से अधिक। उस महीने हर आपूर्तिकर्ता ने समान संख्या में ऑर्डर संभाले। मई में ऑर्डरों की संख्या अलग थी और समय पर डिलीवरी की तुलना नहीं दी गई।",
        "ਅਪ੍ਰੈਲ ਵਿੱਚ ਸਪਲਾਇਰ X ਨੇ ਸਪਲਾਇਰ Y ਨਾਲੋਂ ਵੱਧ ਆਰਡਰ ਸਮੇਂ 'ਤੇ ਪਹੁੰਚਾਏ ਅਤੇ Y ਨੇ Z ਨਾਲੋਂ ਵੱਧ। ਉਸ ਮਹੀਨੇ ਹਰ ਸਪਲਾਇਰ ਨੇ ਇਕੋ ਜਿਹੇ ਆਰਡਰ ਸੰਭਾਲੇ। ਮਈ ਵਿੱਚ ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ ਵੱਖਰੀ ਸੀ ਅਤੇ ਸਮੇਂ 'ਤੇ ਡਿਲਿਵਰੀ ਦੀ ਤੁਲਨਾ ਨਹੀਂ ਦਿੱਤੀ ਗਈ।"
      ],
      [
        "In April, X had a higher on-time delivery share than Z.",
        "अप्रैल में X का समय पर डिलीवरी का हिस्सा Z से अधिक था।",
        "ਅਪ੍ਰੈਲ ਵਿੱਚ X ਦਾ ਸਮੇਂ 'ਤੇ ਡਿਲਿਵਰੀ ਵਾਲਾ ਹਿੱਸਾ Z ਨਾਲੋਂ ਵੱਧ ਸੀ।"
      ],
      [
        "X delivered more orders on time than every supplier in May.",
        "मई में X ने हर आपूर्तिकर्ता से अधिक ऑर्डर समय पर पहुँचाए।",
        "ਮਈ ਵਿੱਚ X ਨੇ ਹਰ ਸਪਲਾਇਰ ਨਾਲੋਂ ਵੱਧ ਆਰਡਰ ਸਮੇਂ 'ਤੇ ਪਹੁੰਚਾਏ।"
      ],
      [
        "For April, X's on-time count exceeded Y's and Y's exceeded Z's; equal order totals make that an on-time-share comparison too. May's results are not stated."
      ],
      false
    ],
    [
      "COMPARATIVE_CHAIN",
      "WAIT-TIME-REPORT",
      "TRANSPORT",
      "HARD",
      [
        "At a station, Queue A had a shorter average wait than Queue B, and Queue B had a shorter average wait than Queue C during the morning review. All three queues were observed during the same hour. The report gives no information about afternoon waits.",
        "स्टेशन पर सुबह की समीक्षा के दौरान कतार A का औसत प्रतीक्षा समय कतार B से कम था और B का C से कम। तीनों कतारों को उसी घंटे देखा गया। रिपोर्ट में दोपहर के प्रतीक्षा समय की जानकारी नहीं है।",
        "ਸਟੇਸ਼ਨ 'ਤੇ ਸਵੇਰ ਦੀ ਸਮੀਖਿਆ ਦੌਰਾਨ ਕਤਾਰ A ਦਾ ਔਸਤ ਉਡੀਕ ਸਮਾਂ ਕਤਾਰ B ਨਾਲੋਂ ਘੱਟ ਸੀ ਅਤੇ B ਦਾ C ਨਾਲੋਂ ਘੱਟ। ਤਿੰਨਾਂ ਕਤਾਰਾਂ ਨੂੰ ਉਸੇ ਘੰਟੇ ਦੇਖਿਆ ਗਿਆ। ਰਿਪੋਰਟ ਵਿੱਚ ਦੁਪਹਿਰ ਦੇ ਉਡੀਕ ਸਮੇਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਨਹੀਂ।"
      ],
      [
        "Queue A had a shorter average wait than Queue C during the morning review.",
        "ਸਵੇਰ ਦੀ ਸਮੀਖਿਆ ਦੌਰਾਨ ਕਤਾਰ A ਦਾ ਔਸਤ ਉਡੀਕ ਸਮਾਂ ਕਤਾਰ C ਨਾਲੋਂ ਘੱਟ ਸੀ।",
        "ਕਤਾਰ A ਦਾ ਸਵੇਰ ਵਾਲਾ ਔਸਤ ਉਡੀਕ ਸਮਾਂ, ਕਤਾਰ C ਦੇ ਸਵੇਰ ਵਾਲੇ ਔਸਤ ਨਾਲੋਂ ਘੱਟ ਸੀ।"
      ],
      [
        "Queue A had the shortest average wait throughout the day.",
        "कतार A का पूरे दिन का औसत प्रतीक्षा समय सबसे कम था।",
        "ਕਤਾਰ A ਦਾ ਪੂਰੇ ਦਿਨ ਦਾ ਔਸਤ ਉਡੀਕ ਸਮਾਂ ਸਭ ਤੋਂ ਘੱਟ ਸੀ।"
      ],
      [
        "A's average wait was below B's, and B's was below C's, so A's was below C's for the same morning hour. Nothing is said about the afternoon or the full day."
      ],
      true
    ]
  ],
  "CROSS_SENTENCE_RECORD": [
    [
      "CROSS_SENTENCE_RECORD",
      "ORDER-AND-INVENTORY",
      "BUSINESS",
      "MEDIUM",
      [
        "A store issues a replacement only after the returned item is inspected and the original purchase is found in the sales record. Item 310 passed inspection, and its purchase appears in the record. The replacement register is updated after dispatch.",
        "स्टोर बदली का सामान तभी जारी करता है जब लौटाई गई वस्तु की जाँच हो जाए और मूल खरीद बिक्री रिकॉर्ड में मिल जाए। वस्तु 310 जाँच में पास हुई और उसकी खरीद रिकॉर्ड में दर्ज है। बदली रजिस्टर डिस्पैच के बाद अपडेट होता है।",
        "ਸਟੋਰ ਬਦਲੀ ਦਾ ਸਮਾਨ ਤਾਂ ਹੀ ਜਾਰੀ ਕਰਦਾ ਹੈ ਜੇ ਵਾਪਸ ਆਈ ਚੀਜ਼ ਦੀ ਜਾਂਚ ਹੋ ਜਾਵੇ ਅਤੇ ਅਸਲ ਖਰੀਦ ਵਿਕਰੀ ਰਿਕਾਰਡ ਵਿੱਚ ਮਿਲੇ। ਚੀਜ਼ 310 ਜਾਂਚ ਵਿੱਚ ਪਾਸ ਹੋਈ ਅਤੇ ਇਸ ਦੀ ਖਰੀਦ ਰਿਕਾਰਡ ਵਿੱਚ ਦਰਜ ਹੈ। ਬਦਲੀ ਰਜਿਸਟਰ ਡਿਸਪੈਚ ਤੋਂ ਬਾਅਦ ਅਪਡੇਟ ਹੁੰਦਾ ਹੈ।"
      ],
      [
        "Item 310 meets both stated checks required before a replacement can be issued.",
        "वस्तु 310 बदली जारी करने से पहले जरूरी दोनों जाँचें पूरी करती है।",
        "ਚੀਜ਼ 310 ਬਦਲੀ ਜਾਰੀ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਲੋੜੀਂਦੀਆਂ ਦੋਵੇਂ ਜਾਂਚਾਂ ਪੂਰੀ ਕਰਦੀ ਹੈ।"
      ],
      [
        "The replacement has already been dispatched to the customer.",
        "बदली का सामान ग्राहक को पहले ही भेजा जा चुका है।",
        "ਬਦਲੀ ਦਾ ਸਮਾਨ ਗਾਹਕ ਨੂੰ ਪਹਿਲਾਂ ਹੀ ਭੇਜਿਆ ਜਾ ਚੁੱਕਾ ਹੈ।"
      ],
      [
        "The item passed inspection and its purchase is recorded, so both pre-issue checks are met. The register is updated after dispatch, but dispatch itself is not reported."
      ],
      true
    ],
    [
      "CROSS_SENTENCE_RECORD",
      "SCHOLARSHIP-STATUS",
      "EDUCATION",
      "HARD",
      [
        "A scholarship file is shortlisted only when the applicant meets the attendance threshold and submits the income certificate before the deadline. Nisha meets the attendance threshold, but her certificate was received one day after the deadline. The shortlist contains applicants who passed both checks.",
        "छात्रवृत्ति की फाइल तभी चुनी जाती है जब आवेदक उपस्थिति की सीमा पूरी करे और समय-सीमा से पहले आय प्रमाणपत्र जमा करे। निशा ने उपस्थिति की सीमा पूरी की, लेकिन उसका प्रमाणपत्र समय-सीमा के एक दिन बाद मिला। सूची में दोनों जाँचें पास करने वाले आवेदक हैं।",
        "ਵਜ਼ੀਫ਼ੇ ਦੀ ਫਾਈਲ ਤਾਂ ਹੀ ਚੁਣੀ ਜਾਂਦੀ ਹੈ ਜੇ ਬਿਨੈਕਾਰ ਹਾਜ਼ਰੀ ਦੀ ਹੱਦ ਪੂਰੀ ਕਰੇ ਅਤੇ ਆਖਰੀ ਮਿਤੀ ਤੋਂ ਪਹਿਲਾਂ ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ ਜਮ੍ਹਾਂ ਕਰੇ। ਨਿਸ਼ਾ ਨੇ ਹਾਜ਼ਰੀ ਦੀ ਹੱਦ ਪੂਰੀ ਕੀਤੀ, ਪਰ ਉਸ ਦਾ ਸਰਟੀਫਿਕੇਟ ਆਖਰੀ ਮਿਤੀ ਤੋਂ ਇੱਕ ਦਿਨ ਬਾਅਦ ਮਿਲਿਆ। ਸੂਚੀ ਵਿੱਚ ਦੋਵੇਂ ਜਾਂਚਾਂ ਪਾਸ ਕਰਨ ਵਾਲੇ ਬਿਨੈਕਾਰ ਹਨ।"
      ],
      [
        "Nisha's file does not meet both stated conditions for shortlisting.",
        "निशा की फाइल चयन के लिए बताई गई दोनों शर्तें पूरी नहीं करती।",
        "ਨਿਸ਼ਾ ਦੀ ਫਾਈਲ ਚੋਣ ਲਈ ਦੱਸੀਆਂ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਨਹੀਂ ਕਰਦੀ।"
      ],
      [
        "Nisha has been shortlisted for the scholarship.",
        "निशा को छात्रवृत्ति के लिए चुन लिया गया है।",
        "ਨਿਸ਼ਾ ਨੂੰ ਵਜ਼ੀਫ਼ੇ ਲਈ ਚੁਣ ਲਿਆ ਗਿਆ ਹੈ।"
      ],
      [
        "Nisha meets the attendance threshold, but her income certificate arrived after the deadline. Since both conditions are required, her file does not qualify for the shortlist."
      ],
      false
    ],
    [
      "CROSS_SENTENCE_RECORD",
      "MAINTENANCE-CLOSEOUT",
      "PUBLIC_ADMINISTRATION",
      "HARD",
      [
        "A maintenance request is closed after the technician records the repair and the resident confirms that the service has resumed. The technician marked the repair complete for Block 4, and the resident confirmed service by text. The closure system synchronises these records overnight.",
        "तकनीशियन द्वारा मरम्मत दर्ज करने और निवासी द्वारा सेवा बहाल होने की पुष्टि के बाद ही रखरखाव अनुरोध बंद होता है। तकनीशियन ने ब्लॉक 4 की मरम्मत पूरी दर्ज की और निवासी ने संदेश से सेवा बहाल होने की पुष्टि की। बंद करने वाला सिस्टम रात में रिकॉर्ड मिलाता है।",
        "ਟੈਕਨੀਸ਼ੀਅਨ ਵੱਲੋਂ ਮੁਰੰਮਤ ਦਰਜ ਕਰਨ ਅਤੇ ਵਸਨੀਕ ਵੱਲੋਂ ਸੇਵਾ ਮੁੜ ਚੱਲਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹੀ ਰਖ-ਰਖਾਅ ਬੇਨਤੀ ਬੰਦ ਹੁੰਦੀ ਹੈ। ਟੈਕਨੀਸ਼ੀਅਨ ਨੇ ਬਲਾਕ 4 ਦੀ ਮੁਰੰਮਤ ਪੂਰੀ ਦਰਜ ਕੀਤੀ ਅਤੇ ਵਸਨੀਕ ਨੇ ਸੁਨੇਹੇ ਰਾਹੀਂ ਸੇਵਾ ਮੁੜ ਚੱਲਣ ਦੀ ਪੁਸ਼ਟੀ ਕੀਤੀ। ਬੰਦ ਕਰਨ ਵਾਲਾ ਸਿਸਟਮ ਰਾਤ ਨੂੰ ਇਹ ਰਿਕਾਰਡ ਮਿਲਾਉਂਦਾ ਹੈ।"
      ],
      [
        "Both stated confirmations needed before the maintenance request can be closed are recorded.",
        "ਮੁਰੰਮਤ ਬੇਨਤੀ ਬੰਦ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਲੋੜੀਂਦੀਆਂ ਦੋਵੇਂ ਪੁਸ਼ਟੀਆਂ ਦਰਜ ਹਨ।",
        "ਰਖ-ਰਖਾਅ ਬੇਨਤੀ ਬੰਦ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਲੋੜੀਂਦੀਆਂ ਦੋਵੇਂ ਪੁਸ਼ਟੀਆਂ ਦਰਜ ਹਨ।"
      ],
      [
        "The maintenance request is already shown as closed in the system.",
        "ਸिस्टम में रखरखाव अनुरोध पहले ही बंद दिखाया गया है।",
        "ਸਿਸਟਮ ਵਿੱਚ ਰਖ-ਰਖਾਅ ਬੇਨਤੀ ਪਹਿਲਾਂ ਹੀ ਬੰਦ ਦਿਖਾਈ ਗਈ ਹੈ।"
      ],
      [
        "The technician's completion record and the resident's confirmation are both present. System closure occurs only when records synchronise overnight, and that is still ahead."
      ],
      false
    ]
  ],
  "SEQUENCE_AND_STATUS": [
    [
      "SEQUENCE_AND_STATUS",
      "INTERVIEW-RESULT",
      "WORKPLACE",
      "MEDIUM",
      [
        "The recruitment panel records an interview score before the reference check. A candidate's score is already recorded, but the reference check is still pending. The final selection list is issued only after both stages are complete.",
        "भर्ती पैनल संदर्भ जाँच से पहले साक्षात्कार का अंक दर्ज करता है। उम्मीदवार का अंक दर्ज है, लेकिन संदर्भ जाँच अभी लंबित है। अंतिम चयन सूची दोनों चरण पूरे होने के बाद ही जारी होती है।",
        "ਭਰਤੀ ਪੈਨਲ ਸਿਫ਼ਾਰਸ਼ੀ ਜਾਂਚ ਤੋਂ ਪਹਿਲਾਂ ਇੰਟਰਵਿਊ ਦੇ ਅੰਕ ਦਰਜ ਕਰਦਾ ਹੈ। ਉਮੀਦਵਾਰ ਦੇ ਅੰਕ ਦਰਜ ਹਨ, ਪਰ ਸਿਫ਼ਾਰਸ਼ੀ ਜਾਂਚ ਹਾਲੇ ਬਕਾਇਆ ਹੈ। ਅੰਤਿਮ ਚੋਣ ਸੂਚੀ ਦੋਵੇਂ ਪੜਾਅ ਪੂਰੇ ਹੋਣ ਤੋਂ ਬਾਅਦ ਹੀ ਜਾਰੀ ਹੁੰਦੀ ਹੈ।"
      ],
      [
        "The interview-score stage is complete, but the reference-check stage is not.",
        "ਇंटरव्यू-अंक वाला चरण पूरा है, लेकिन संदर्भ जाँच वाला चरण नहीं।",
        "ਇੰਟਰਵਿਊ ਅੰਕਾਂ ਵਾਲਾ ਪੜਾਅ ਪੂਰਾ ਹੈ, ਪਰ ਸਿਫ਼ਾਰਸ਼ੀ ਜਾਂਚ ਵਾਲਾ ਪੜਾਅ ਨਹੀਂ।"
      ],
      [
        "The candidate has been selected for the post.",
        "उम्मीदवार को पद के लिए चुन लिया गया है।",
        "ਉਮੀਦਵਾਰ ਨੂੰ ਅਹੁਦੇ ਲਈ ਚੁਣ ਲਿਆ ਗਿਆ ਹੈ।"
      ],
      [
        "A score is recorded, while the reference check remains pending. Since the final list requires both stages, selection is not established."
      ],
      true
    ],
    [
      "SEQUENCE_AND_STATUS",
      "ROAD-REPAIR",
      "PUBLIC_ADMINISTRATION",
      "HARD",
      [
        "The road unit starts resurfacing after drainage work is inspected and approved. Drainage on Section 3 has been inspected, but the engineer's approval is still pending. The work log shows no resurfacing start date.",
        "सड़क इकाई जलनिकासी के काम की जाँच और मंजूरी के बाद ही नई सतह बिछाती है। खंड 3 की जलनिकासी की जाँच हो गई है, लेकिन इंजीनियर की मंजूरी लंबित है। कार्य लॉग में नई सतह बिछाने की तारीख दर्ज नहीं है।",
        "ਸੜਕ ਇਕਾਈ ਨਿਕਾਸੀ ਦੇ ਕੰਮ ਦੀ ਜਾਂਚ ਅਤੇ ਮਨਜ਼ੂਰੀ ਤੋਂ ਬਾਅਦ ਹੀ ਨਵੀਂ ਸਤਹ ਵਿਛਾਉਂਦੀ ਹੈ। ਖੰਡ 3 ਦੀ ਨਿਕਾਸੀ ਦੀ ਜਾਂਚ ਹੋ ਗਈ ਹੈ, ਪਰ ਇੰਜੀਨੀਅਰ ਦੀ ਮਨਜ਼ੂਰੀ ਹਾਲੇ ਬਕਾਇਆ ਹੈ। ਕੰਮ ਦੇ ਲੌਗ ਵਿੱਚ ਨਵੀਂ ਸਤਹ ਵਿਛਾਉਣ ਦੀ ਤਾਰੀਖ ਨਹੀਂ।"
      ],
      [
        "The inspection is complete, but the approval required before resurfacing is still pending.",
        "ਜाँच पूरी है, लेकिन नई सतह से पहले जरूरी मंजूरी लंबित है।",
        "ਜਾਂਚ ਪੂਰੀ ਹੈ, ਪਰ ਨਵੀਂ ਸਤਹ ਵਿਛਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਲੋੜੀਂਦੀ ਮਨਜ਼ੂਰੀ ਹਾਲੇ ਬਕਾਇਆ ਹੈ।"
      ],
      [
        "Resurfacing on Section 3 has begun.",
        "खंड 3 पर नई सतह बिछाने का काम शुरू हो गया है।",
        "ਖੰਡ 3 'ਤੇ ਨਵੀਂ ਸਤਹ ਵਿਛਾਉਣ ਦਾ ਕੰਮ ਸ਼ੁਰੂ ਹੋ ਗਿਆ ਹੈ।"
      ],
      [
        "Inspection alone is not enough: the rule also requires engineer approval, which is still pending. The work log gives no start date, so resurfacing has not been established."
      ],
      false
    ],
    [
      "SEQUENCE_AND_STATUS",
      "EXAM-PAPER-DISPATCH",
      "EDUCATION",
      "HARD",
      [
        "The exam office dispatches room packets after the chief invigilator signs the room list and the security seal numbers are entered. The invigilator signed the list for Hall 2, while the seal-number column is blank. The dispatch register shows the packets are still in storage.",
        "मुख्य निरीक्षक के कक्ष-सूची पर हस्ताक्षर करने और सुरक्षा सील के नंबर दर्ज होने के बाद ही परीक्षा कार्यालय कक्षों के पैकेट भेजता है। निरीक्षक ने हॉल 2 की सूची पर हस्ताक्षर किए, लेकिन सील नंबर वाला कॉलम खाली है। डिस्पैच रजिस्टर में पैकेट अभी भंडार में दिखते हैं।",
        "ਮੁੱਖ ਨਿਗਰਾਨ ਵੱਲੋਂ ਕਮਰਾ-ਸੂਚੀ 'ਤੇ ਦਸਤਖ਼ਤ ਕਰਨ ਅਤੇ ਸੁਰੱਖਿਆ ਸੀਲ ਨੰਬਰ ਦਰਜ ਹੋਣ ਤੋਂ ਬਾਅਦ ਹੀ ਪ੍ਰੀਖਿਆ ਦਫ਼ਤਰ ਕਮਰਿਆਂ ਦੇ ਪੈਕੇਟ ਭੇਜਦਾ ਹੈ। ਨਿਗਰਾਨ ਨੇ ਹਾਲ 2 ਦੀ ਸੂਚੀ 'ਤੇ ਦਸਤਖ਼ਤ ਕੀਤੇ, ਪਰ ਸੀਲ ਨੰਬਰਾਂ ਵਾਲਾ ਖਾਨਾ ਖਾਲੀ ਹੈ। ਡਿਸਪੈਚ ਰਜਿਸਟਰ ਵਿੱਚ ਪੈਕੇਟ ਹਾਲੇ ਭੰਡਾਰ ਵਿੱਚ ਹਨ।"
      ],
      [
        "The room-list signature is recorded, but the seal-number check is incomplete and dispatch has not occurred.",
        "ਕक्ष-सूची पर हस्ताक्षर दर्ज हैं, लेकिन सील नंबर की जाँच अधूरी है और पैकेट नहीं भेजे गए।",
        "ਕਮਰਾ-ਸੂਚੀ 'ਤੇ ਦਸਤਖ਼ਤ ਦਰਜ ਹਨ, ਪਰ ਸੀਲ ਨੰਬਰਾਂ ਦੀ ਜਾਂਚ ਅਧੂਰੀ ਹੈ ਅਤੇ ਪੈਕੇਟ ਨਹੀਂ ਭੇਜੇ ਗਏ।"
      ],
      [
        "Hall 2's exam packets have been dispatched.",
        "हॉल 2 के परीक्षा पैकेट भेजे जा चुके हैं।",
        "ਹਾਲ 2 ਦੇ ਪ੍ਰੀਖਿਆ ਪੈਕੇਟ ਭੇਜੇ ਜਾ ਚੁੱਕੇ ਹਨ।"
      ],
      [
        "The signature is present but the seal numbers are missing; the packets are also still in storage. The required dispatch checks are not complete, and dispatch is expressly unreported."
      ],
      false
    ]
  ]
} as unknown as Readonly<Record<Family, readonly Row[]>>;
const familyOrder = Object.keys(families) as Family[];
const distractor: Readonly<Record<Family, SifDistractorType>> = {
  ELIGIBILITY_INTERSECTION: "PARTIAL_SUPPORT", PROCESS_REQUIREMENTS: "PARTIAL_SUPPORT",
  SERVICE_AND_SCHEDULE: "TIME_DISTORTION", RESOURCE_AND_DEMAND: "SCOPE_CHANGE",
  GROUP_AND_SCOPE: "SCOPE_CHANGE", COMPARATIVE_CHAIN: "REVERSED_RELATIONSHIP",
  CROSS_SENTENCE_RECORD: "STRONGER_CLAIM", SEQUENCE_AND_STATUS: "TIME_DISTORTION"
};
export const SIF_CP011_MULTIPLE_FACTOR_AUTHORITIES: readonly SifScenarioAuthority[] = familyOrder.flatMap((family, familyIndex) =>
  families[family].map(([key, domain, difficulty, statement, supportedText, unsupportedText, reasoning, answerI], rowIndex) => {
    const globalIndex = familyIndex * 3 + rowIndex;
    const seedSwapsInReview = globalIndex % 2 === 1;
    const supportedFirst = answerI !== seedSwapsInReview;
    const sentenceRows = statement.map((text) => text.trim().split(/(?<=[.!?।])\s+/));
    const factCount = Math.min(...sentenceRows.map((sentences) => sentences.length));
    const facts = Array.from({ length: factCount }, (_, i) => ({ id: `F${i + 1}`, text: localized([sentenceRows[0][i], sentenceRows[1][i], sentenceRows[2][i]] as L) }));
    const valid = { id: supportedFirst ? "I" : "II", text: localized(supportedText), follows: true, strength: "CERTAIN" as const, supportFactIds: facts.map((fact) => fact.id) };
    const invalid = { id: supportedFirst ? "II" : "I", text: localized(unsupportedText), follows: false, strength: "UNSUPPORTED_OR_CONTRADICTED" as const, supportFactIds: facts.map((fact) => fact.id), distractorType: distractor[family] };
    const suffix: L = supportedFirst ? ["Therefore, only Inference I follows.", "इसलिए केवल अनुमान I सही है।", "ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ I ਸਹੀ ਹੈ।"] : ["Therefore, only Inference II follows.", "इसलिए केवल अनुमान II सही है।", "ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ II ਸਹੀ ਹੈ।"];
    const explanation = localized([reasoning[0], `दिए गए तथ्यों को साथ पढ़ने पर समर्थित निष्कर्ष निकलता है; दूसरा निष्कर्ष अतिरिक्त दावा करता है। ${suffix[1]}`, `ਦਿੱਤੇ ਤੱਥਾਂ ਨੂੰ ਇਕੱਠੇ ਪੜ੍ਹਨ ਨਾਲ ਸਮਰਥਿਤ ਨਤੀਜਾ ਨਿਕਲਦਾ ਹੈ; ਦੂਜਾ ਨਤੀਜਾ ਵਾਧੂ ਦਾਅਵਾ ਕਰਦਾ ਹੈ। ${suffix[2]}`]);
    return { id: `SIF-CP011-${family}-${key}`, cpId: "SIF-CP011" as const, difficulty, domain, mechanisms: ["MULTIPLE_FACTOR", "CONTEXT_SYNTHESIS"] as const, statement: localized(statement), facts, candidates: [supportedFirst ? valid : invalid, supportedFirst ? invalid : valid] as const, explanation, identityGuard: guard };
  })
);
export const SIF_CP011_PROFILE_BY_AUTHORITY_ID: Readonly<Record<string, { readonly family: Family }>> = Object.fromEntries(
  familyOrder.flatMap((family) => SIF_CP011_MULTIPLE_FACTOR_AUTHORITIES.filter((authority) => authority.id.startsWith(`SIF-CP011-${family}-`)).map((authority) => [authority.id, { family }] as const))
);
