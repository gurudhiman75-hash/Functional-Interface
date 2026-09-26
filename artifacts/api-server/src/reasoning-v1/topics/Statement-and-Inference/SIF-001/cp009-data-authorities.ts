import type { SifContextDomain, SifDistractorType, SifLocalizedText, SifScenarioAuthority } from "./types.ts";

type L = readonly [string, string, string];
type Family = "PERCENTAGE_COMPARISON" | "ABSOLUTE_COUNTS" | "SIMPLE_RATIOS" | "CHANGE_OVER_TIME" | "RANKING" | "FREQUENCY" | "PART_WHOLE" | "NUMBER_SCOPE";
type Row = readonly [string, SifContextDomain, L, L, L, L];
const localized = ([en, hi, pa]: L): SifLocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const guard = { evaluatesSupport: true, assumptionQuestion: false, conclusionQuestion: false, argumentQuestion: false, causeEffectQuestion: false, courseOfActionQuestion: false } as const;
const families = {
  "PERCENTAGE_COMPARISON": [
    [
      "BRANCH-RECEIPTS",
      "BANKING",
      [
        "In a survey of 200 customers at a bank branch, 64% preferred digital receipts. 21% preferred printed receipts. The remaining responses were not divided by preference in the report.",
        "एक बैंक शाखा में 200 ग्राहकों के सर्वेक्षण में 64% ने डिजिटल रसीद पसंद की। 21% ने छपी हुई रसीद पसंद की। रिपोर्ट में बाकी जवाबों की पसंद अलग से नहीं बताई गई।",
        "ਇੱਕ ਬੈਂਕ ਸ਼ਾਖਾ ਦੇ 200 ਗਾਹਕਾਂ ਦੇ ਸਰਵੇਖਣ ਵਿੱਚ 64% ਨੇ ਡਿਜ਼ੀਟਲ ਰਸੀਦ ਪਸੰਦ ਕੀਤੀ। 21% ਨੇ ਛਪੀ ਰਸੀਦ ਪਸੰਦ ਕੀਤੀ। ਰਿਪੋਰਟ ਵਿੱਚ ਬਾਕੀ ਜਵਾਬਾਂ ਦੀ ਪਸੰਦ ਵੱਖਰੇ ਤੌਰ 'ਤੇ ਨਹੀਂ ਦੱਸੀ ਗਈ।"
      ],
      [
        "More surveyed customers preferred digital receipts than printed receipts.",
        "ਸर्वेक्षण में छपी रसीद की तुलना में अधिक ग्राहकों ने डिजिटल रसीद पसंद की।",
        "ਸਰਵੇਖਣ ਵਿੱਚ ਛਪੀ ਰਸੀਦ ਨਾਲੋਂ ਵੱਧ ਗਾਹਕਾਂ ਨੇ ਡਿਜ਼ੀਟਲ ਰਸੀਦ ਪਸੰਦ ਕੀਤੀ।"
      ],
      [
        "Every respondent who did not prefer digital receipts preferred printed receipts.",
        "जिन उत्तरदाताओं ने डिजिटल रसीद पसंद नहीं की, उन सभी ने छपी रसीद पसंद की।",
        "ਜਿਨ੍ਹਾਂ ਜਵਾਬਦਾਤਿਆਂ ਨੇ ਡਿਜ਼ੀਟਲ ਰਸੀਦ ਪਸੰਦ ਨਹੀਂ ਕੀਤੀ, ਉਨ੍ਹਾਂ ਸਭ ਨੇ ਛਪੀ ਰਸੀਦ ਪਸੰਦ ਕੀਤੀ।"
      ],
      [
        "The reported digital preference, 64%, is higher than the printed preference, 21%. The report does not say how the other responses were divided.",
        "डिजिटल पसंद का दर्ज प्रतिशत 64%, छपी रसीद के 21% से अधिक है। बाकी जवाबों का बँटवारा रिपोर्ट में नहीं दिया गया।",
        "ਦਰਜ ਡਿਜ਼ੀਟਲ ਪਸੰਦ 64% ਹੈ, ਜੋ ਛਪੀ ਰਸੀਦ ਦੀ 21% ਪਸੰਦ ਨਾਲੋਂ ਵੱਧ ਹੈ। ਬਾਕੀ ਜਵਾਬਾਂ ਦਾ ਵੇਰਵਾ ਰਿਪੋਰਟ ਵਿੱਚ ਨਹੀਂ ਹੈ।"
      ]
    ],
    [
      "COURSE-POLL",
      "EDUCATION",
      [
        "A college asked 300 evening-course students which revision format they used most. 58% chose recorded lessons, while 26% chose printed notes. The poll covered evening courses only.",
        "एक कॉलेज ने शाम की कक्षाओं के 300 विद्यार्थियों से पूछा कि वे दोहराई के लिए किस तरीके का सबसे अधिक उपयोग करते हैं। 58% ने रिकॉर्ड किए गए पाठ चुने और 26% ने छपे नोट चुने। सर्वेक्षण केवल शाम की कक्षाओं तक सीमित था।",
        "ਇੱਕ ਕਾਲਜ ਨੇ ਸ਼ਾਮ ਦੀਆਂ ਕਲਾਸਾਂ ਦੇ 300 ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਪੁੱਛਿਆ ਕਿ ਦੁਹਰਾਈ ਲਈ ਉਹ ਕਿਹੜਾ ਤਰੀਕਾ ਸਭ ਤੋਂ ਵੱਧ ਵਰਤਦੇ ਹਨ। 58% ਨੇ ਰਿਕਾਰਡ ਕੀਤੇ ਪਾਠ ਚੁਣੇ ਅਤੇ 26% ਨੇ ਛਪੇ ਨੋਟ ਚੁਣੇ। ਸਰਵੇਖਣ ਸਿਰਫ਼ ਸ਼ਾਮ ਦੀਆਂ ਕਲਾਸਾਂ ਤੱਕ ਸੀਮਤ ਸੀ।"
      ],
      [
        "Among the evening-course respondents, recorded lessons were chosen more often than printed notes.",
        "शाम की कक्षाओं के उत्तरदाताओं में छपे नोट की तुलना में रिकॉर्ड किए गए पाठ अधिक चुने गए।",
        "ਸ਼ਾਮ ਦੀਆਂ ਕਲਾਸਾਂ ਦੇ ਜਵਾਬਦਾਤਿਆਂ ਵਿੱਚ ਛਪੇ ਨੋਟਾਂ ਨਾਲੋਂ ਰਿਕਾਰਡ ਕੀਤੇ ਪਾਠ ਵੱਧ ਚੁਣੇ ਗਏ।"
      ],
      [
        "Most students in every course at the college chose recorded lessons.",
        "कॉलेज के हर पाठ्यक्रम के अधिकांश विद्यार्थियों ने रिकॉर्ड किए गए पाठ चुने।",
        "ਕਾਲਜ ਦੇ ਹਰ ਕੋਰਸ ਦੇ ਬਹੁਤੇ ਵਿਦਿਆਰਥੀਆਂ ਨੇ ਰਿਕਾਰਡ ਕੀਤੇ ਪਾਠ ਚੁਣੇ।"
      ],
      [
        "Within the surveyed group, 58% exceeds 26%, so recorded lessons were the more common choice. Day-course students were outside the poll.",
        "सर्वेक्षण वाले समूह में 58%, 26% से अधिक है, इसलिए रिकॉर्ड किए गए पाठ अधिक चुने गए। दिन की कक्षाओं के विद्यार्थी सर्वेक्षण में शामिल नहीं थे।",
        "ਸਰਵੇਖਣ ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ 58%, 26% ਨਾਲੋਂ ਵੱਧ ਹੈ, ਇਸ ਲਈ ਰਿਕਾਰਡ ਕੀਤੇ ਪਾਠ ਵੱਧ ਚੁਣੇ ਗਏ। ਦਿਨ ਦੀਆਂ ਕਲਾਸਾਂ ਦੇ ਵਿਦਿਆਰਥੀ ਇਸ ਵਿੱਚ ਸ਼ਾਮਲ ਨਹੀਂ ਸਨ।"
      ]
    ],
    [
      "BUS-TRAVEL-PREFERENCE",
      "TRANSPORT",
      [
        "A weekday poll asked passengers on Route 4 how they usually paid. 52% reported using a travel card and 31% used cash. The poll did not include passengers on other routes.",
        "ਹਫ਼ਤੇ ਦੇ ਕੰਮਕਾਜੀ ਦਿਨਾਂ ਦੇ ਇੱਕ ਸਰਵੇਖਣ ਵਿੱਚ ਰੂਟ 4 ਦੇ यात्रियों से पूछा गया कि वे आम तौर पर किराया कैसे देते हैं। 52% ने यात्रा कार्ड और 31% ने नकद का उपयोग बताया। अन्य मार्गों के यात्री सर्वेक्षण में शामिल नहीं थे।",
        "ਹਫ਼ਤੇ ਦੇ ਕੰਮਕਾਜੀ ਦਿਨਾਂ ਦੇ ਇੱਕ ਸਰਵੇਖਣ ਵਿੱਚ ਰੂਟ 4 ਦੇ ਯਾਤਰੀਆਂ ਤੋਂ ਪੁੱਛਿਆ ਗਿਆ ਕਿ ਉਹ ਆਮ ਤੌਰ 'ਤੇ ਕਿਰਾਇਆ ਕਿਵੇਂ ਦਿੰਦੇ ਹਨ। 52% ਨੇ ਯਾਤਰਾ ਕਾਰਡ ਅਤੇ 31% ਨੇ ਨਕਦ ਦੀ ਵਰਤੋਂ ਦੱਸੀ। ਹੋਰ ਰੂਟਾਂ ਦੇ ਯਾਤਰੀ ਸਰਵੇਖਣ ਵਿੱਚ ਸ਼ਾਮਲ ਨਹੀਂ ਸਨ।"
      ],
      [
        "Among the Route 4 passengers surveyed, travel-card use was reported more often than cash use.",
        "ਸर्वेक्षण में शामिल रूट 4 के यात्रियों ने नकद की तुलना में यात्रा कार्ड का अधिक उपयोग बताया।",
        "ਸਰਵੇਖਣ ਵਿੱਚ ਸ਼ਾਮਲ ਰੂਟ 4 ਦੇ ਯਾਤਰੀਆਂ ਨੇ ਨਕਦ ਨਾਲੋਂ ਯਾਤਰਾ ਕਾਰਡ ਦੀ ਵੱਧ ਵਰਤੋਂ ਦੱਸੀ।"
      ],
      [
        "Most passengers on every route used a travel card on weekends.",
        "सभी मार्गों के अधिकांश यात्रियों ने सप्ताहांत में यात्रा कार्ड का उपयोग किया।",
        "ਹਰ ਰੂਟ ਦੇ ਬਹੁਤੇ ਯਾਤਰੀਆਂ ਨੇ ਹਫ਼ਤੇ ਦੇ ਅੰਤ 'ਤੇ ਯਾਤਰਾ ਕਾਰਡ ਵਰਤਿਆ।"
      ],
      [
        "For the surveyed Route 4 group, 52% is greater than 31%. The result gives no information about other routes or weekends.",
        "सर्वेक्षण वाले रूट 4 समूह में 52%, 31% से अधिक है। नतीजा अन्य मार्गों या सप्ताहांत की जानकारी नहीं देता।",
        "ਸਰਵੇਖਣ ਵਾਲੇ ਰੂਟ 4 ਸਮੂਹ ਵਿੱਚ 52%, 31% ਨਾਲੋਂ ਵੱਧ ਹੈ। ਨਤੀਜਾ ਹੋਰ ਰੂਟਾਂ ਜਾਂ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਬਾਰੇ ਜਾਣਕਾਰੀ ਨਹੀਂ ਦਿੰਦਾ।"
      ]
    ]
  ],
  "ABSOLUTE_COUNTS": [
    [
      "LIBRARY-LOANS",
      "EDUCATION",
      [
        "The library issued 84 science guides and 59 history guides during the first week of term. Each issue was entered in the same register. The count covers that week only.",
        "सत्र के पहले सप्ताह में पुस्तकालय ने विज्ञान की 84 और इतिहास की 59 मार्गदर्शिकाएँ जारी कीं। हर जारी पुस्तक उसी रजिस्टर में दर्ज की गई। यह गिनती केवल उसी सप्ताह की है।",
        "ਸੈਸ਼ਨ ਦੇ ਪਹਿਲੇ ਹਫ਼ਤੇ ਵਿੱਚ ਲਾਇਬ੍ਰੇਰੀ ਨੇ ਵਿਗਿਆਨ ਦੀਆਂ 84 ਅਤੇ ਇਤਿਹਾਸ ਦੀਆਂ 59 ਗਾਈਡਾਂ ਜਾਰੀ ਕੀਤੀਆਂ। ਹਰ ਜਾਰੀ ਕੀਤੀ ਗਾਈਡ ਉਸੇ ਰਜਿਸਟਰ ਵਿੱਚ ਦਰਜ ਹੋਈ। ਇਹ ਗਿਣਤੀ ਸਿਰਫ਼ ਉਸ ਹਫ਼ਤੇ ਦੀ ਹੈ।"
      ],
      [
        "More science guides than history guides were issued during the first week.",
        "सत्र के आरंभिक सात दिनों में इतिहास की अपेक्षा विज्ञान की अधिक मार्गदर्शिकाएँ जारी की गईं।",
        "ਪਹਿਲੇ ਹਫ਼ਤੇ ਵਿੱਚ ਇਤਿਹਾਸ ਦੀਆਂ ਗਾਈਡਾਂ ਨਾਲੋਂ ਵਿਗਿਆਨ ਦੀਆਂ ਵੱਧ ਗਾਈਡਾਂ ਜਾਰੀ ਹੋਈਆਂ।"
      ],
      [
        "Every student who borrowed a guide borrowed a science guide.",
        "जिन विद्यार्थियों ने कोई मार्गदर्शिका ली, उन सभी ने विज्ञान की मार्गदर्शिका ली।",
        "ਜਿਨ੍ਹਾਂ ਵਿਦਿਆਰਥੀਆਂ ਨੇ ਕੋਈ ਗਾਈਡ ਲਈ, ਉਨ੍ਹਾਂ ਸਭ ਨੇ ਵਿਗਿਆਨ ਦੀ ਗਾਈਡ ਲਈ।"
      ],
      [
        "The register shows 84 science guides and 59 history guides, so science issues were more numerous. It does not identify which students borrowed them.",
        "रजिस्टर में विज्ञान की 84 और इतिहास की 59 मार्गदर्शिकाएँ दर्ज हैं, इसलिए विज्ञान की अधिक जारी हुईं। इससे यह पता नहीं चलता कि किन विद्यार्थियों ने कौन-सी ली।",
        "ਰਜਿਸਟਰ ਵਿੱਚ ਵਿਗਿਆਨ ਦੀਆਂ 84 ਅਤੇ ਇਤਿਹਾਸ ਦੀਆਂ 59 ਗਾਈਡਾਂ ਹਨ, ਇਸ ਲਈ ਵਿਗਿਆਨ ਦੀਆਂ ਵੱਧ ਜਾਰੀ ਹੋਈਆਂ। ਇਸ ਤੋਂ ਇਹ ਨਹੀਂ ਪਤਾ ਲੱਗਦਾ ਕਿ ਕਿਹੜੇ ਵਿਦਿਆਰਥੀ ਨੇ ਕਿਹੜੀ ਗਾਈਡ ਲਈ।"
      ]
    ],
    [
      "SERVICE-REQUESTS",
      "PUBLIC_ADMINISTRATION",
      [
        "A district office recorded 146 address-change requests and 118 certificate requests in April. Requests were counted when received. The figures do not show how many were approved.",
        "जिला कार्यालय ने अप्रैल में पते में बदलाव के 146 और प्रमाणपत्र के 118 आवेदन दर्ज किए। आवेदन मिलने पर उनकी गिनती की गई। आँकड़े यह नहीं बताते कि कितने आवेदन मंजूर हुए।",
        "ਜ਼ਿਲ੍ਹਾ ਦਫ਼ਤਰ ਨੇ ਅਪ੍ਰੈਲ ਵਿੱਚ ਪਤਾ ਬਦਲਣ ਦੀਆਂ 146 ਅਤੇ ਸਰਟੀਫਿਕੇਟ ਦੀਆਂ 118 ਬੇਨਤੀਆਂ ਦਰਜ ਕੀਤੀਆਂ। ਬੇਨਤੀ ਮਿਲਣ 'ਤੇ ਉਸ ਦੀ ਗਿਣਤੀ ਹੋਈ। ਅੰਕੜੇ ਇਹ ਨਹੀਂ ਦੱਸਦੇ ਕਿ ਕਿੰਨੀਆਂ ਮਨਜ਼ੂਰ ਹੋਈਆਂ।"
      ],
      [
        "More address-change requests than certificate requests were received in April.",
        "अप्रैल में प्रमाणपत्र के आवेदनों से अधिक पते में बदलाव के आवेदन मिले।",
        "ਅਪ੍ਰੈਲ ਵਿੱਚ ਸਰਟੀਫਿਕੇਟ ਦੀਆਂ ਬੇਨਤੀਆਂ ਨਾਲੋਂ ਪਤਾ ਬਦਲਣ ਦੀਆਂ ਵੱਧ ਬੇਨਤੀਆਂ ਮਿਲੀਆਂ।"
      ],
      [
        "More address-change requests than certificate requests were approved in April.",
        "अप्रैल में प्रमाणपत्र के आवेदनों से अधिक पते में बदलाव के आवेदन मंजूर हुए।",
        "ਅਪ੍ਰੈਲ ਵਿੱਚ ਸਰਟੀਫਿਕੇਟ ਦੀਆਂ ਬੇਨਤੀਆਂ ਨਾਲੋਂ ਪਤਾ ਬਦਲਣ ਦੀਆਂ ਵੱਧ ਬੇਨਤੀਆਂ ਮਨਜ਼ੂਰ ਹੋਈਆਂ।"
      ],
      [
        "The office received 146 address-change requests and 118 certificate requests, so the first category had the higher count. Receipt figures do not establish approval.",
        "कार्यालय को पते में बदलाव के 146 और प्रमाणपत्र के 118 आवेदन मिले, इसलिए पहली श्रेणी की संख्या अधिक थी। प्राप्ति की गिनती से मंजूरी साबित नहीं होती।",
        "ਦਫ਼ਤਰ ਨੂੰ ਪਤਾ ਬਦਲਣ ਦੀਆਂ 146 ਅਤੇ ਸਰਟੀਫਿਕੇਟ ਦੀਆਂ 118 ਬੇਨਤੀਆਂ ਮਿਲੀਆਂ, ਇਸ ਲਈ ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਵੱਧ ਸੀ। ਬੇਨਤੀਆਂ ਮਿਲਣ ਦੀ ਗਿਣਤੀ ਮਨਜ਼ੂਰੀ ਨਹੀਂ ਦੱਸਦੀ।"
      ]
    ],
    [
      "BUS-BOOKINGS",
      "TRANSPORT",
      [
        "A booking desk recorded 312 seats for the morning service and 287 for the afternoon service on Friday. Both totals cover the same route. The desk counts bookings, not completed journeys.",
        "बुकिंग काउंटर ने शुक्रवार को सुबह की सेवा के लिए 312 और दोपहर की सेवा के लिए 287 सीटें दर्ज कीं। दोनों आँकड़े एक ही मार्ग के हैं। काउंटर बुकिंग गिनता है, पूरी की गई यात्राएँ नहीं।",
        "ਬੁਕਿੰਗ ਕਾਊਂਟਰ ਨੇ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਸਵੇਰ ਦੀ ਸੇਵਾ ਲਈ 312 ਅਤੇ ਦੁਪਹਿਰ ਦੀ ਸੇਵਾ ਲਈ 287 ਸੀਟਾਂ ਦਰਜ ਕੀਤੀਆਂ। ਦੋਵੇਂ ਅੰਕੜੇ ਇੱਕੋ ਰੂਟ ਦੇ ਹਨ। ਕਾਊਂਟਰ ਬੁਕਿੰਗਾਂ ਗਿਣਦਾ ਹੈ, ਪੂਰੀਆਂ ਹੋਈਆਂ ਯਾਤਰਾਵਾਂ ਨਹੀਂ।"
      ],
      [
        "More seats were booked for the Friday morning service than for the afternoon service.",
        "ਸ਼ੁੱਕਰਵਾਰ ਦੀ ਦੁਪਹਿਰ ਵਾਲੀ ਸੇਵਾ ਨਾਲੋਂ ਸਵੇਰ ਵਾਲੀ ਸੇਵਾ ਲਈ ਵੱਧ ਸੀਟਾਂ ਬੁੱਕ ਹੋਈਆਂ।",
        "ਸ਼ੁੱਕਰਵਾਰ ਦੀ ਦੁਪਹਿਰ ਵਾਲੀ ਸੇਵਾ ਨਾਲੋਂ ਸਵੇਰ ਦੀ ਸੇਵਾ ਲਈ ਵੱਧ ਸੀਟਾਂ ਬੁੱਕ ਹੋਈਆਂ।"
      ],
      [
        "The morning service carried more passengers than the afternoon service.",
        "ਸਵੇਰ ਦੀ ਸੇਵਾ ਵਿੱਚ ਦੁਪਹਿਰ ਦੀ ਸੇਵਾ ਨਾਲੋਂ ਵੱਧ ਯਾਤਰੀ ਸਫ਼ਰ ਕਰਕੇ ਗਏ।",
        "ਸਵੇਰ ਦੀ ਸੇਵਾ ਵਿੱਚ ਦੁਪਹਿਰ ਦੀ ਸੇਵਾ ਨਾਲੋਂ ਵੱਧ ਯਾਤਰੀਆਂ ਨੇ ਸਫ਼ਰ ਕੀਤਾ।"
      ],
      [
        "The booking records show 312 morning seats against 287 afternoon seats. They compare reservations, not the number of passengers who travelled.",
        "ਬੁਕਿੰਗ ਰਿਕਾਰਡ ਵਿੱਚ ਸਵੇਰ ਲਈ 312 ਅਤੇ ਦੁਪਹਿਰ ਲਈ 287 ਸੀਟਾਂ ਹਨ। ਇਹ ਰਿਜ਼ਰਵੇਸ਼ਨ ਦੀ ਤੁਲਨਾ ਹੈ, ਸਫ਼ਰ ਕਰਨ ਵਾਲੇ ਯਾਤਰੀਆਂ ਦੀ ਗਿਣਤੀ ਨਹੀਂ।",
        "ਬੁਕਿੰਗ ਰਿਕਾਰਡ ਵਿੱਚ ਸਵੇਰ ਲਈ 312 ਅਤੇ ਦੁਪਹਿਰ ਲਈ 287 ਸੀਟਾਂ ਹਨ। ਇਹ ਬੁਕਿੰਗਾਂ ਦੀ ਤੁਲਨਾ ਹੈ, ਸਫ਼ਰ ਕਰਨ ਵਾਲੇ ਯਾਤਰੀਆਂ ਦੀ ਨਹੀਂ।"
      ]
    ]
  ],
  "SIMPLE_RATIOS": [
    [
      "CLUB-SPORTS",
      "EVERYDAY",
      [
        "At a community club, the ratio of members choosing badminton to members choosing chess was 3:2. The poll included 100 members. Each member named one preferred activity.",
        "एक सामुदायिक क्लब में बैडमिंटन और शतरंज चुनने वाले सदस्यों का अनुपात 3:2 था। सर्वेक्षण में 100 सदस्य शामिल थे। हर सदस्य ने एक पसंदीदा गतिविधि बताई।",
        "ਇੱਕ ਭਾਈਚਾਰਕ ਕਲੱਬ ਵਿੱਚ ਬੈਡਮਿੰਟਨ ਅਤੇ ਸ਼ਤਰੰਜ ਚੁਣਨ ਵਾਲੇ ਮੈਂਬਰਾਂ ਦਾ ਅਨੁਪਾਤ 3:2 ਸੀ। ਸਰਵੇਖਣ ਵਿੱਚ 100 ਮੈਂਬਰ ਸ਼ਾਮਲ ਸਨ। ਹਰ ਮੈਂਬਰ ਨੇ ਇੱਕ ਪਸੰਦੀਦਾ ਸਰਗਰਮੀ ਦੱਸੀ।"
      ],
      [
        "More surveyed members chose badminton than chess.",
        "सर्वेक्षण में शतरंज की तुलना में अधिक सदस्यों ने बैडमिंटन चुना।",
        "ਸਰਵੇਖਣ ਵਿੱਚ ਸ਼ਤਰੰਜ ਨਾਲੋਂ ਵੱਧ ਮੈਂਬਰਾਂ ਨੇ ਬੈਡਮਿੰਟਨ ਚੁਣਿਆ।"
      ],
      [
        "Exactly three times as many members chose badminton as chess.",
        "बैडमिंटन चुनने वाले सदस्य शतरंज चुनने वालों से ठीक तीन गुना थे।",
        "ਬੈਡਮਿੰਟਨ ਚੁਣਨ ਵਾਲੇ ਮੈਂਬਰ ਸ਼ਤਰੰਜ ਚੁਣਨ ਵਾਲਿਆਂ ਨਾਲੋਂ ਠੀਕ ਤਿੰਨ ਗੁਣਾ ਸਨ।"
      ],
      [
        "In the stated ratio, the badminton part is 3 and the chess part is 2, so badminton had the larger group. A 3:2 ratio does not mean three times as many.",
        "अनुपात में बैडमिंटन का हिस्सा 3 और शतरंज का 2 है, इसलिए बैडमिंटन वाला समूह बड़ा था। 3:2 का अर्थ तीन गुना नहीं है।",
        "ਦਿੱਤੇ ਅਨੁਪਾਤ ਵਿੱਚ ਬੈਡਮਿੰਟਨ ਦਾ ਹਿੱਸਾ 3 ਅਤੇ ਸ਼ਤਰੰਜ ਦਾ 2 ਹੈ, ਇਸ ਲਈ ਬੈਡਮਿੰਟਨ ਵਾਲਾ ਸਮੂਹ ਵੱਡਾ ਸੀ। 3:2 ਦਾ ਮਤਲਬ ਤਿੰਨ ਗੁਣਾ ਨਹੀਂ ਹੁੰਦਾ।"
      ]
    ],
    [
      "STAFF-ALLOCATION",
      "WORKPLACE",
      [
        "At a training unit, technical and clerical staff were in a ratio of 2:1. A separate support team worked in another office. The ratio does not include the support team.",
        "एक प्रशिक्षण इकाई में तकनीकी और लिपिकीय कर्मचारियों का अनुपात 2:1 था। सहायता दल दूसरे कार्यालय में काम करता था। इस अनुपात में सहायता दल शामिल नहीं था।",
        "ਇੱਕ ਸਿਖਲਾਈ ਇਕਾਈ ਵਿੱਚ ਤਕਨੀਕੀ ਅਤੇ ਲਿਪਿਕੀ ਕਰਮਚਾਰੀਆਂ ਦਾ ਅਨੁਪਾਤ 2:1 ਸੀ। ਮਦਦ ਟੀਮ ਹੋਰ ਦਫ਼ਤਰ ਵਿੱਚ ਕੰਮ ਕਰਦੀ ਸੀ। ਇਸ ਅਨੁਪਾਤ ਵਿੱਚ ਮਦਦ ਟੀਮ ਸ਼ਾਮਲ ਨਹੀਂ ਸੀ।"
      ],
      [
        "The technical-staff group was larger than the clerical-staff group.",
        "तकनीकी कर्मचारियों का समूह लिपिकीय कर्मचारियों के समूह से बड़ा था।",
        "ਤਕਨੀਕੀ ਕਰਮਚਾਰੀਆਂ ਦਾ ਸਮੂਹ ਲਿਪਿਕੀ ਕਰਮਚਾਰੀਆਂ ਨਾਲੋਂ ਵੱਡਾ ਸੀ।"
      ],
      [
        "The unit had twice as many technical staff as support staff.",
        "इकाई में सहायता कर्मचारियों से दोगुने तकनीकी कर्मचारी थे।",
        "ਇਕਾਈ ਵਿੱਚ ਮਦਦ ਟੀਮ ਨਾਲੋਂ ਦੁੱਗਣੇ ਤਕਨੀਕੀ ਕਰਮਚਾਰੀ ਸਨ।"
      ],
      [
        "The 2:1 ratio makes the technical group larger than the clerical group. The separate support team is outside that ratio, so its size cannot be compared.",
        "2:1 अनुपात में तकनीकी समूह लिपिकीय समूह से बड़ा है। सहायता दल इस अनुपात से बाहर है, इसलिए उसकी संख्या से तुलना नहीं की जा सकती।",
        "2:1 ਅਨੁਪਾਤ ਵਿੱਚ ਤਕਨੀਕੀ ਸਮੂਹ ਲਿਪਿਕੀ ਸਮੂਹ ਨਾਲੋਂ ਵੱਡਾ ਹੈ। ਮਦਦ ਟੀਮ ਇਸ ਅਨੁਪਾਤ ਤੋਂ ਬਾਹਰ ਹੈ, ਇਸ ਲਈ ਉਸ ਦੀ ਗਿਣਤੀ ਨਾਲ ਤੁਲਨਾ ਨਹੀਂ ਹੋ ਸਕਦੀ।"
      ]
    ],
    [
      "ORDER-SPLIT",
      "BUSINESS",
      [
        "A store packed online and counter orders in a ratio of 4:3 on Saturday. The ratio was calculated from the day's 140 packed orders. It does not include orders still awaiting packing.",
        "एक दुकान ने शनिवार को ऑनलाइन और काउंटर के ऑर्डर 4:3 के अनुपात में पैक किए। अनुपात उस दिन पैक किए गए 140 ऑर्डरों पर आधारित था। इसमें वे ऑर्डर शामिल नहीं हैं जो पैक होने की प्रतीक्षा में थे।",
        "ਇੱਕ ਦੁਕਾਨ ਨੇ ਸ਼ਨੀਵਾਰ ਨੂੰ ਆਨਲਾਈਨ ਅਤੇ ਕਾਊਂਟਰ ਦੇ ਆਰਡਰ 4:3 ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਪੈਕ ਕੀਤੇ। ਇਹ ਅਨੁਪਾਤ ਉਸ ਦਿਨ ਪੈਕ ਕੀਤੇ 140 ਆਰਡਰਾਂ ਦਾ ਸੀ। ਪੈਕ ਹੋਣ ਦੀ ਉਡੀਕ ਵਾਲੇ ਆਰਡਰ ਇਸ ਵਿੱਚ ਸ਼ਾਮਲ ਨਹੀਂ ਹਨ।"
      ],
      [
        "Among the orders packed on Saturday, online orders outnumbered counter orders.",
        "शनिवार को पैक किए गए ऑर्डरों में काउंटर ऑर्डरों से अधिक ऑनलाइन ऑर्डर थे।",
        "ਸ਼ਨੀਵਾਰ ਨੂੰ ਪੈਕ ਕੀਤੇ ਆਰਡਰਾਂ ਵਿੱਚ ਕਾਊਂਟਰ ਆਰਡਰਾਂ ਨਾਲੋਂ ਵੱਧ ਆਨਲਾਈਨ ਆਰਡਰ ਸਨ।"
      ],
      [
        "Most of the 140 packed orders were counter orders.",
        "पैक किए गए 140 ऑर्डरों में अधिकांश काउंटर ऑर्डर थे।",
        "ਪੈਕ ਕੀਤੇ 140 ਆਰਡਰਾਂ ਵਿੱਚੋਂ ਬਹੁਤੇ ਕਾਊਂਟਰ ਆਰਡਰ ਸਨ।"
      ],
      [
        "The 4:3 ratio gives online orders the larger share, so they were more numerous within the 140 packed orders. Counter orders therefore were not a majority.",
        "4:3 अनुपात में ऑनलाइन ऑर्डरों का हिस्सा बड़ा है, इसलिए 140 पैक ऑर्डरों में वे अधिक थे। इस कारण काउंटर ऑर्डर बहुमत में नहीं थे।",
        "4:3 ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਆਨਲਾਈਨ ਆਰਡਰਾਂ ਦਾ ਹਿੱਸਾ ਵੱਡਾ ਹੈ, ਇਸ ਲਈ 140 ਪੈਕ ਆਰਡਰਾਂ ਵਿੱਚ ਉਹ ਵੱਧ ਸਨ। ਇਸ ਕਰਕੇ ਕਾਊਂਟਰ ਆਰਡਰ ਬਹੁਮਤ ਵਿੱਚ ਨਹੀਂ ਸਨ।"
      ]
    ]
  ],
  "CHANGE_OVER_TIME": [
    [
      "QUARTERLY-ORDERS",
      "BUSINESS",
      [
        "A shop recorded 240 orders in April and 300 in June. The figures are monthly totals. No figure for May is provided.",
        "एक दुकान में अप्रैल में 240 और जून में 300 ऑर्डर दर्ज हुए। ये हर महीने की कुल संख्या है। मई का आँकड़ा नहीं दिया गया।",
        "ਇੱਕ ਦੁਕਾਨ ਵਿੱਚ ਅਪ੍ਰੈਲ ਦੌਰਾਨ 240 ਅਤੇ ਜੂਨ ਵਿੱਚ 300 ਆਰਡਰ ਦਰਜ ਹੋਏ। ਇਹ ਮਹੀਨਾਵਾਰ ਕੁੱਲ ਗਿਣਤੀ ਹੈ। ਮਈ ਦਾ ਅੰਕੜਾ ਨਹੀਂ ਦਿੱਤਾ।"
      ],
      [
        "The shop recorded more orders in June than in April.",
        "दुकान में अप्रैल की तुलना में जून में अधिक ऑर्डर दर्ज हुए।",
        "ਦੁਕਾਨ ਵਿੱਚ ਅਪ੍ਰੈਲ ਨਾਲੋਂ ਜੂਨ ਵਿੱਚ ਵੱਧ ਆਰਡਰ ਦਰਜ ਹੋਏ।"
      ],
      [
        "The number of orders increased in every month from April through June.",
        "अप्रैल से जून तक हर महीने ऑर्डरों की संख्या बढ़ी।",
        "ਅਪ੍ਰੈਲ ਤੋਂ ਜੂਨ ਤੱਕ ਹਰ ਮਹੀਨੇ ਆਰਡਰਾਂ ਦੀ ਗਿਣਤੀ ਵਧੀ।"
      ],
      [
        "June's 300 orders exceed April's 240, so the June total was higher. With no May figure, the report does not establish a month-by-month rise.",
        "जून के 300 ऑर्डर अप्रैल के 240 से अधिक हैं, इसलिए जून की कुल संख्या अधिक थी। मई का आँकड़ा न होने से हर महीने की वृद्धि सिद्ध नहीं होती।",
        "ਜੂਨ ਦੇ 300 ਆਰਡਰ ਅਪ੍ਰੈਲ ਦੇ 240 ਨਾਲੋਂ ਵੱਧ ਹਨ, ਇਸ ਲਈ ਜੂਨ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਵੱਧ ਸੀ। ਮਈ ਦਾ ਅੰਕੜਾ ਨਾ ਹੋਣ ਕਰਕੇ ਹਰ ਮਹੀਨੇ ਵਾਧਾ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।"
      ]
    ],
    [
      "WAITING-TIME",
      "BANKING",
      [
        "At one branch, the average wait was 18 minutes in the morning and 11 minutes in the afternoon on Tuesday. The figures are averages for that day. The report gives no other day's results.",
        "एक शाखा में मंगलवार को सुबह का औसत प्रतीक्षा समय 18 मिनट और दोपहर का 11 मिनट था। ये उसी दिन के औसत हैं। रिपोर्ट में अन्य दिनों के परिणाम नहीं हैं।",
        "ਇੱਕ ਸ਼ਾਖਾ ਵਿੱਚ ਮੰਗਲਵਾਰ ਨੂੰ ਸਵੇਰ ਦਾ ਔਸਤ ਉਡੀਕ ਸਮਾਂ 18 ਮਿੰਟ ਅਤੇ ਦੁਪਹਿਰ ਦਾ 11 ਮਿੰਟ ਸੀ। ਇਹ ਉਸੇ ਦਿਨ ਦੇ ਔਸਤ ਹਨ। ਰਿਪੋਰਟ ਵਿੱਚ ਹੋਰ ਦਿਨਾਂ ਦੇ ਨਤੀਜੇ ਨਹੀਂ ਹਨ।"
      ],
      [
        "The average wait was shorter in the afternoon than in the morning on Tuesday.",
        "मंगलवार को सुबह की तुलना में दोपहर का औसत प्रतीक्षा समय कम था।",
        "ਮੰਗਲਵਾਰ ਨੂੰ ਸਵੇਰ ਨਾਲੋਂ ਦੁਪਹਿਰ ਦਾ ਔਸਤ ਉਡੀਕ ਸਮਾਂ ਘੱਟ ਸੀ।"
      ],
      [
        "The branch's average wait was shorter every afternoon that week.",
        "उस सप्ताह हर दोपहर शाखा का औसत प्रतीक्षा समय कम था।",
        "ਉਸ ਹਫ਼ਤੇ ਹਰ ਦੁਪਹਿਰ ਸ਼ਾਖਾ ਦਾ ਔਸਤ ਉਡੀਕ ਸਮਾਂ ਘੱਟ ਸੀ।"
      ],
      [
        "On Tuesday, 11 minutes was below the morning average of 18 minutes. This one-day comparison says nothing about the rest of the week.",
        "मंगलवार को 11 मिनट, सुबह के 18 मिनट से कम था। एक दिन की यह तुलना सप्ताह के बाकी दिनों के बारे में कुछ नहीं बताती।",
        "ਮੰਗਲਵਾਰ ਨੂੰ 11 ਮਿੰਟ, ਸਵੇਰ ਦੇ 18 ਮਿੰਟਾਂ ਨਾਲੋਂ ਘੱਟ ਸੀ। ਇੱਕ ਦਿਨ ਦੀ ਇਹ ਤੁਲਨਾ ਹਫ਼ਤੇ ਦੇ ਬਾਕੀ ਦਿਨਾਂ ਬਾਰੇ ਕੁਝ ਨਹੀਂ ਦੱਸਦੀ।"
      ]
    ],
    [
      "COURSE-REGISTRATIONS",
      "EDUCATION",
      [
        "A college recorded 420 registrations for its certificate course in 2025 and 465 in 2026. The course format was unchanged in both years. The figures count registrations, not course completions.",
        "एक कॉलेज ने प्रमाणपत्र पाठ्यक्रम में 2025 में 420 और 2026 में 465 पंजीकरण दर्ज किए। दोनों वर्षों में पाठ्यक्रम का प्रारूप एक जैसा था। ये पंजीकरण की संख्या है, पाठ्यक्रम पूरा करने वालों की नहीं।",
        "ਇੱਕ ਕਾਲਜ ਨੇ ਸਰਟੀਫਿਕੇਟ ਕੋਰਸ ਲਈ 2025 ਵਿੱਚ 420 ਅਤੇ 2026 ਵਿੱਚ 465 ਦਾਖਲੇ ਦਰਜ ਕੀਤੇ। ਦੋਵੇਂ ਸਾਲਾਂ ਵਿੱਚ ਕੋਰਸ ਦਾ ਢਾਂਚਾ ਇੱਕੋ ਜਿਹਾ ਸੀ। ਇਹ ਦਾਖਲਿਆਂ ਦੀ ਗਿਣਤੀ ਹੈ, ਕੋਰਸ ਪੂਰਾ ਕਰਨ ਵਾਲਿਆਂ ਦੀ ਨਹੀਂ।"
      ],
      [
        "Registrations for the course were higher in 2026 than in 2025.",
        "2025 की तुलना में 2026 में पाठ्यक्रम के लिए अधिक पंजीकरण हुए।",
        "2025 ਨਾਲੋਂ 2026 ਵਿੱਚ ਕੋਰਸ ਲਈ ਵੱਧ ਦਾਖਲੇ ਹੋਏ।"
      ],
      [
        "More students completed the course in 2026 than in 2025.",
        "2025 की तुलना में 2026 में अधिक विद्यार्थियों ने पाठ्यक्रम पूरा किया।",
        "2025 ਨਾਲੋਂ 2026 ਵਿੱਚ ਵੱਧ ਵਿਦਿਆਰਥੀਆਂ ਨੇ ਕੋਰਸ ਪੂਰਾ ਕੀਤਾ।"
      ],
      [
        "The recorded registration total rose from 420 to 465. The figures do not state how many students completed the course.",
        "दर्ज पंजीकरण 420 से बढ़कर 465 हुए। आँकड़े यह नहीं बताते कि कितने विद्यार्थियों ने पाठ्यक्रम पूरा किया।",
        "ਦਰਜ ਦਾਖਲੇ 420 ਤੋਂ ਵਧ ਕੇ 465 ਹੋਏ। ਅੰਕੜੇ ਇਹ ਨਹੀਂ ਦੱਸਦੇ ਕਿ ਕਿੰਨੇ ਵਿਦਿਆਰਥੀਆਂ ਨੇ ਕੋਰਸ ਪੂਰਾ ਕੀਤਾ।"
      ]
    ]
  ],
  "RANKING": [
    [
      "BRANCH-RANK",
      "BANKING",
      [
        "In a service survey, Branch P ranked second and Branch Q ranked fourth among six branches. A lower rank number meant a higher position. The ranking used customer-response scores.",
        "सेवा सर्वेक्षण में छह शाखाओं में शाखा P दूसरे और शाखा Q चौथे स्थान पर रही। कम क्रमांक का अर्थ ऊँचा स्थान था। क्रम ग्राहक प्रतिक्रियाओं के अंकों पर आधारित था।",
        "ਸੇਵਾ ਸਰਵੇਖਣ ਵਿੱਚ ਛੇ ਸ਼ਾਖਾਵਾਂ ਵਿੱਚ ਸ਼ਾਖਾ P ਦੂਜੇ ਅਤੇ ਸ਼ਾਖਾ Q ਚੌਥੇ ਸਥਾਨ 'ਤੇ ਸੀ। ਘੱਟ ਦਰਜੇ ਦਾ ਅਰਥ ਉੱਚਾ ਸਥਾਨ ਸੀ। ਦਰਜਾ ਗਾਹਕਾਂ ਦੇ ਜਵਾਬੀ ਅੰਕਾਂ 'ਤੇ ਆਧਾਰਿਤ ਸੀ।"
      ],
      [
        "Branch P ranked above Branch Q in that survey.",
        "ਉਸ सर्वेक्षण में शाखा P, शाखा Q से ऊपर रही।",
        "ਉਸ ਸਰਵੇਖਣ ਵਿੱਚ ਸ਼ਾਖਾ P, ਸ਼ਾਖਾ Q ਤੋਂ ਉੱਪਰ ਰਹੀ।"
      ],
      [
        "Branch P received exactly twice the customer-response score of Branch Q.",
        "शाखा P को शाखा Q से ठीक दोगुने ग्राहक-प्रतिक्रिया अंक मिले।",
        "ਸ਼ਾਖਾ P ਨੂੰ ਸ਼ਾਖਾ Q ਨਾਲੋਂ ਠੀਕ ਦੁੱਗਣੇ ਗਾਹਕ-ਜਵਾਬੀ ਅੰਕ ਮਿਲੇ।"
      ],
      [
        "Second place is higher than fourth place under the stated ranking rule. The ranks do not reveal the size of the score difference.",
        "दिए गए नियम के अनुसार दूसरा स्थान चौथे से ऊँचा है। क्रमांक अंकों के अंतर का आकार नहीं बताते।",
        "ਦਿੱਤੇ ਨਿਯਮ ਅਨੁਸਾਰ ਦੂਜਾ ਸਥਾਨ ਚੌਥੇ ਨਾਲੋਂ ਉੱਚਾ ਹੈ। ਦਰਜੇ ਅੰਕਾਂ ਦੇ ਫ਼ਰਕ ਦਾ ਆਕਾਰ ਨਹੀਂ ਦੱਸਦੇ।"
      ]
    ],
    [
      "SUPPLIER-RANK",
      "BUSINESS",
      [
        "A retailer ranked three suppliers by the share of deliveries arriving on time; rank 1 meant the highest share. Supplier M ranked first, Supplier N second and Supplier R third. The report gives no exact percentages.",
        "एक विक्रेता ने समय पर पहुँची डिलीवरी के अनुपात से तीन आपूर्तिकर्ताओं को क्रम दिया; पहला स्थान सबसे अधिक अनुपात दर्शाता था। आपूर्तिकर्ता M पहले, N दूसरे और R तीसरे स्थान पर रहा। सटीक प्रतिशत नहीं दिए गए।",
        "ਇੱਕ ਵਿਕਰੇਤਾ ਨੇ ਸਮੇਂ ਸਿਰ ਪਹੁੰਚੀਆਂ ਡਿਲਿਵਰੀਆਂ ਦੇ ਹਿੱਸੇ ਅਨੁਸਾਰ ਤਿੰਨ ਸਪਲਾਇਰਾਂ ਨੂੰ ਦਰਜਾ ਦਿੱਤਾ; ਪਹਿਲਾ ਦਰਜਾ ਸਭ ਤੋਂ ਵੱਧ ਹਿੱਸੇ ਨੂੰ ਦੱਸਦਾ ਸੀ। ਸਪਲਾਇਰ M ਪਹਿਲੇ, N ਦੂਜੇ ਅਤੇ R ਤੀਜੇ ਸਥਾਨ 'ਤੇ ਸੀ। ਸਹੀ ਪ੍ਰਤੀਸ਼ਤ ਨਹੀਂ ਦਿੱਤੇ।"
      ],
      [
        "Supplier N ranked above Supplier R for on-time deliveries.",
        "ਸਮੇਂ ਸਿਰ ਡਿਲਿਵਰੀਆਂ ਵਿੱਚ ਸਪਲਾਇਰ N, R ਤੋਂ ਉੱਪਰ ਰਿਹਾ।",
        "ਸਮੇਂ ਸਿਰ ਡਿਲਿਵਰੀਆਂ ਵਿੱਚ ਸਪਲਾਇਰ N, R ਤੋਂ ਉੱਪਰ ਸੀ।"
      ],
      [
        "Supplier M delivered every order on time.",
        "आपूर्तिकर्ता M ने हर ऑर्डर समय पर पहुँचाया।",
        "ਸਪਲਾਇਰ M ਨੇ ਹਰ ਆਰਡਰ ਸਮੇਂ ਸਿਰ ਪਹੁੰਚਾਇਆ।"
      ],
      [
        "The second-ranked supplier placed above the third-ranked one. First place does not mean a perfect record, and no exact shares are given.",
        "दूसरे स्थान वाला आपूर्तिकर्ता तीसरे से ऊपर था। पहला स्थान पूर्ण रिकॉर्ड का प्रमाण नहीं है और सटीक अनुपात भी नहीं दिए गए।",
        "ਦੂਜੇ ਸਥਾਨ ਵਾਲਾ ਸਪਲਾਇਰ ਤੀਜੇ ਨਾਲੋਂ ਉੱਪਰ ਸੀ। ਪਹਿਲਾ ਸਥਾਨ ਹਰ ਡਿਲਿਵਰੀ ਸਮੇਂ ਸਿਰ ਹੋਣ ਦਾ ਸਬੂਤ ਨਹੀਂ ਅਤੇ ਸਹੀ ਹਿੱਸੇ ਵੀ ਨਹੀਂ ਦਿੱਤੇ।"
      ]
    ],
    [
      "EXAM-SCORES-RANK",
      "EDUCATION",
      [
        "In a class of 40, Asha ranked 7th and Neel ranked 12th in the mathematics test. The rank list was based on total marks. It does not report their marks.",
        "40 विद्यार्थियों की कक्षा में गणित परीक्षा में आशा 7वें और नील 12वें स्थान पर रहे। क्रम-सूची कुल अंकों पर आधारित थी। उनके अंक नहीं दिए गए।",
        "40 ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਕਲਾਸ ਵਿੱਚ ਗਣਿਤ ਦੀ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਆਸ਼ਾ 7ਵੇਂ ਅਤੇ ਨੀਲ 12ਵੇਂ ਸਥਾਨ 'ਤੇ ਰਹੇ। ਦਰਜਾ ਕੁੱਲ ਅੰਕਾਂ 'ਤੇ ਆਧਾਰਿਤ ਸੀ। ਉਨ੍ਹਾਂ ਦੇ ਅੰਕ ਨਹੀਂ ਦਿੱਤੇ।"
      ],
      [
        "Asha ranked above Neel in the mathematics test.",
        "गणित परीक्षा में आशा, नील से ऊपर रही।",
        "ਗਣਿਤ ਦੀ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਆਸ਼ਾ, ਨੀਲ ਤੋਂ ਉੱਪਰ ਰਹੀ।"
      ],
      [
        "Asha scored five marks more than Neel.",
        "आशा को नील से पाँच अंक अधिक मिले।",
        "ਆਸ਼ਾ ਨੂੰ ਨੀਲ ਨਾਲੋਂ ਪੰਜ ਅੰਕ ਵੱਧ ਮਿਲੇ।"
      ],
      [
        "Seventh place is above twelfth place in the same class ranking. The ranks alone do not state the mark difference.",
        "एक ही कक्षा की क्रम-सूची में सातवाँ स्थान बारहवें से ऊपर है। केवल क्रमांक अंकों का अंतर नहीं बताते।",
        "ਇੱਕੋ ਕਲਾਸ ਦੀ ਦਰਜਾ-ਸੂਚੀ ਵਿੱਚ ਸੱਤਵਾਂ ਸਥਾਨ ਬਾਰ੍ਹਵੇਂ ਨਾਲੋਂ ਉੱਪਰ ਹੈ। ਸਿਰਫ਼ ਦਰਜਿਆਂ ਤੋਂ ਅੰਕਾਂ ਦਾ ਫ਼ਰਕ ਨਹੀਂ ਪਤਾ ਲੱਗਦਾ।"
      ]
    ]
  ],
  "FREQUENCY": [
    [
      "WEEKLY-LIBRARY-VISITS",
      "EDUCATION",
      [
        "A reading club's log shows that 36 members visited the library weekly and 19 visited monthly during the term. Each member was placed in one frequency group. The log covers club members only.",
        "पठन क्लब के रजिस्टर में सत्र के दौरान 36 सदस्य हर सप्ताह और 19 हर महीने पुस्तकालय आए। हर सदस्य को एक आवृत्ति समूह में रखा गया। रजिस्टर केवल क्लब सदस्यों का है।",
        "ਇੱਕ ਪਾਠਕ ਕਲੱਬ ਦੇ ਰਿਕਾਰਡ ਵਿੱਚ ਸੈਸ਼ਨ ਦੌਰਾਨ 36 ਮੈਂਬਰ ਹਰ ਹਫ਼ਤੇ ਅਤੇ 19 ਹਰ ਮਹੀਨੇ ਲਾਇਬ੍ਰੇਰੀ ਆਏ। ਹਰ ਮੈਂਬਰ ਨੂੰ ਇੱਕ ਆਵਿਰਤੀ ਸਮੂਹ ਵਿੱਚ ਰੱਖਿਆ ਗਿਆ। ਇਹ ਰਿਕਾਰਡ ਸਿਰਫ਼ ਕਲੱਬ ਦੇ ਮੈਂਬਰਾਂ ਦਾ ਹੈ।"
      ],
      [
        "Weekly visits were more common than monthly visits among club members in the log.",
        "ਰਜਿਸਟਰ ਵਿੱਚ ਕਲੱਬ ਮੈਂਬਰਾਂ ਦੀਆਂ ਮਹੀਨਾਵਾਰ ਆਮਦਾਂ ਨਾਲੋਂ ਹਫ਼ਤਾਵਾਰ ਆਮਦਾਂ ਵੱਧ ਸਨ।",
        "ਰਿਕਾਰਡ ਵਿੱਚ ਕਲੱਬ ਮੈਂਬਰਾਂ ਦੀਆਂ ਮਹੀਨਾਵਾਰ ਆਮਦਾਂ ਨਾਲੋਂ ਹਫ਼ਤਾਵਾਰ ਆਮਦਾਂ ਵੱਧ ਸਨ।"
      ],
      [
        "Most students in the school visited the library weekly.",
        "स्कूल के अधिकांश विद्यार्थी हर सप्ताह पुस्तकालय आए।",
        "ਸਕੂਲ ਦੇ ਬਹੁਤੇ ਵਿਦਿਆਰਥੀ ਹਰ ਹਫ਼ਤੇ ਲਾਇਬ੍ਰੇਰੀ ਆਏ।"
      ],
      [
        "The log places 36 club members in the weekly group and 19 in the monthly group, so weekly visits were more common there. It does not cover every student.",
        "ਰਜਿਸ्टर ਵਿੱਚ 36 ਕਲੱਬ ਮੈਂਬਰ ਹਫ਼ਤਾਵਾਰ ਅਤੇ 19 ਮਹੀਨਾਵਾਰ ਸਮੂਹ ਵਿੱਚ ਹਨ, ਇਸ ਲਈ ਕਲੱਬ ਵਿੱਚ ਹਫ਼ਤਾਵਾਰ ਆਉਣਾ ਵੱਧ ਸੀ। ਇਹ ਸਾਰੇ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਨਹੀਂ ਗਿਣਦਾ।",
        "ਰਿਕਾਰਡ ਵਿੱਚ 36 ਕਲੱਬ ਮੈਂਬਰ ਹਫ਼ਤਾਵਾਰ ਅਤੇ 19 ਮਹੀਨਾਵਾਰ ਸਮੂਹ ਵਿੱਚ ਹਨ, ਇਸ ਲਈ ਕਲੱਬ ਵਿੱਚ ਹਫ਼ਤਾਵਾਰ ਆਉਣਾ ਵੱਧ ਸੀ। ਇਹ ਸਾਰੇ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ਨਹੀਂ।"
      ]
    ],
    [
      "HELPDESK-CALLS",
      "PUBLIC_ADMINISTRATION",
      [
        "The help desk counted 72 calls on Monday and 48 on Tuesday. Both days used the same counting method. The record does not classify the calls by topic.",
        "सहायता डेस्क ने सोमवार को 72 और मंगलवार को 48 कॉल गिनीं। दोनों दिनों में गिनती का तरीका एक जैसा था। रिकॉर्ड में कॉल का विषय नहीं बताया गया।",
        "ਮਦਦ ਡੈਸਕ ਨੇ ਸੋਮਵਾਰ ਨੂੰ 72 ਅਤੇ ਮੰਗਲਵਾਰ ਨੂੰ 48 ਕਾਲਾਂ ਗਿਣੀਆਂ। ਦੋਵੇਂ ਦਿਨ ਗਿਣਤੀ ਦਾ ਤਰੀਕਾ ਇੱਕੋ ਸੀ। ਰਿਕਾਰਡ ਵਿੱਚ ਕਾਲਾਂ ਦੇ ਵਿਸ਼ੇ ਨਹੀਂ ਦੱਸੇ।"
      ],
      [
        "The help desk received more calls on Monday than on Tuesday.",
        "मदद डेस्क को मंगलवार से अधिक कॉल सोमवार को मिलीं।",
        "ਮਦਦ ਡੈਸਕ ਨੂੰ ਮੰਗਲਵਾਰ ਨਾਲੋਂ ਸੋਮਵਾਰ ਨੂੰ ਵੱਧ ਕਾਲਾਂ ਮਿਲੀਆਂ।"
      ],
      [
        "Most Monday calls concerned the same issue.",
        "सोमवार की अधिकांश कॉल एक ही समस्या से जुड़ी थीं।",
        "ਸੋਮਵਾਰ ਦੀਆਂ ਬਹੁਤੀਆਂ ਕਾਲਾਂ ਇੱਕੋ ਸਮੱਸਿਆ ਬਾਰੇ ਸਨ।"
      ],
      [
        "The common counting method records 72 calls on Monday and 48 on Tuesday, making Monday's total higher. The topic of the calls is not stated.",
        "एक ही तरीके से सोमवार की 72 और मंगलवार की 48 कॉल दर्ज हुईं, इसलिए सोमवार की संख्या अधिक थी। कॉल का विषय नहीं बताया गया।",
        "ਇੱਕੋ ਤਰੀਕੇ ਨਾਲ ਸੋਮਵਾਰ ਦੀਆਂ 72 ਅਤੇ ਮੰਗਲਵਾਰ ਦੀਆਂ 48 ਕਾਲਾਂ ਦਰਜ ਹੋਈਆਂ, ਇਸ ਲਈ ਸੋਮਵਾਰ ਦੀ ਗਿਣਤੀ ਵੱਧ ਸੀ। ਕਾਲਾਂ ਦਾ ਵਿਸ਼ਾ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ।"
      ]
    ],
    [
      "WEEKEND-DELIVERIES",
      "BUSINESS",
      [
        "A courier log recorded 93 deliveries on Saturday and 88 on Sunday. The counts include parcels marked delivered by the end of each day. The log is for one week.",
        "ਕੋਰੀਅਰ ਰਿਕਾਰਡ ਵਿੱਚ ਸ਼ਨੀਵਾਰ ਨੂੰ 93 ਅਤੇ ਐਤਵਾਰ ਨੂੰ 88 ਡਿਲਿਵਰੀਆਂ ਦਰਜ ਹੋਈਆਂ। ਗਿਣਤੀ ਵਿੱਚ ਦਿਨ ਦੇ ਅੰਤ ਤੱਕ ਪਹੁੰਚੇ ਦਰਸਾਏ ਪਾਰਸਲ ਸ਼ਾਮਲ ਹਨ। ਰਿਕਾਰਡ ਇੱਕ ਹਫ਼ਤੇ ਦਾ ਹੈ।",
        "ਕੋਰੀਅਰ ਰਿਕਾਰਡ ਵਿੱਚ ਸ਼ਨੀਵਾਰ ਨੂੰ 93 ਅਤੇ ਐਤਵਾਰ ਨੂੰ 88 ਡਿਲਿਵਰੀਆਂ ਦਰਜ ਹੋਈਆਂ। ਗਿਣਤੀ ਵਿੱਚ ਦਿਨ ਦੇ ਅੰਤ ਤੱਕ ਪਹੁੰਚੇ ਦਰਸਾਏ ਪਾਰਸਲ ਸ਼ਾਮਲ ਹਨ। ਇਹ ਰਿਕਾਰਡ ਇੱਕ ਹਫ਼ਤੇ ਦਾ ਹੈ।"
      ],
      [
        "More parcels were marked delivered on Saturday than on Sunday in that week's log.",
        "उस सप्ताह के रिकॉर्ड में रविवार की तुलना में शनिवार को अधिक पार्सल पहुँचाए गए दर्ज हुए।",
        "ਉਸ ਹਫ਼ਤੇ ਦੇ ਰਿਕਾਰਡ ਵਿੱਚ ਐਤਵਾਰ ਨਾਲੋਂ ਸ਼ਨੀਵਾਰ ਨੂੰ ਵੱਧ ਪਾਰਸਲ ਪਹੁੰਚੇ ਦਰਜ ਹੋਏ।"
      ],
      [
        "The courier delivered more parcels on every Saturday than on every Sunday throughout the year.",
        "कूरियर ने पूरे वर्ष हर रविवार से अधिक पार्सल हर शनिवार को पहुँचाए।",
        "ਕੋਰੀਅਰ ਨੇ ਪੂਰੇ ਸਾਲ ਹਰ ਐਤਵਾਰ ਨਾਲੋਂ ਵੱਧ ਪਾਰਸਲ ਹਰ ਸ਼ਨੀਵਾਰ ਨੂੰ ਪਹੁੰਚਾਏ।"
      ],
      [
        "For the one week recorded, Saturday's 93 deliveries exceed Sunday's 88. A single week's log cannot establish the pattern for the year.",
        "दर्ज एक सप्ताह में शनिवार की 93 डिलीवरी, रविवार की 88 से अधिक हैं। एक सप्ताह का रिकॉर्ड पूरे वर्ष का रुझान सिद्ध नहीं करता।",
        "ਦਰਜ ਇੱਕ ਹਫ਼ਤੇ ਵਿੱਚ ਸ਼ਨੀਵਾਰ ਦੀਆਂ 93 ਡਿਲਿਵਰੀਆਂ, ਐਤਵਾਰ ਦੀਆਂ 88 ਨਾਲੋਂ ਵੱਧ ਹਨ। ਇੱਕ ਹਫ਼ਤੇ ਦਾ ਰਿਕਾਰਡ ਸਾਲ ਭਰ ਦਾ ਰੁਝਾਨ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।"
      ]
    ]
  ],
  "PART_WHOLE": [
    [
      "TRAINING-ATTENDANCE",
      "WORKPLACE",
      [
        "A safety course enrolled 80 employees. The register shows that 60 attended all sessions. The remaining enrolled employees missed at least one session.",
        "ਸੁਰੱਖਿਆ ਕੋਰਸ ਵਿੱਚ 80 ਕਰਮਚਾਰੀਆਂ ਨੇ ਨਾਮ ਦਰਜ ਕਰਵਾਇਆ। ਰਜਿਸਟਰ ਅਨੁਸਾਰ 60 ਨੇ ਸਾਰੇ ਸੈਸ਼ਨਾਂ ਵਿੱਚ ਹਾਜ਼ਰੀ ਭਰੀ। ਬਾਕੀ ਦਰਜ ਕਰਮਚਾਰੀ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸੈਸ਼ਨ ਤੋਂ ਗੈਰਹਾਜ਼ਰ ਰਹੇ।",
        "ਸੁਰੱਖਿਆ ਕੋਰਸ ਵਿੱਚ 80 ਕਰਮਚਾਰੀਆਂ ਨੇ ਦਾਖਲਾ ਲਿਆ। ਰਜਿਸਟਰ ਮੁਤਾਬਕ 60 ਨੇ ਸਾਰੇ ਸੈਸ਼ਨਾਂ ਵਿੱਚ ਹਾਜ਼ਰੀ ਭਰੀ। ਬਾਕੀ ਦਰਜ ਕਰਮਚਾਰੀ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸੈਸ਼ਨ ਤੋਂ ਗੈਰਹਾਜ਼ਰ ਰਹੇ।"
      ],
      [
        "More than half of the enrolled employees attended every session.",
        "ਦर्ज कर्मचारियों में आधे से अधिक ने हर सत्र में उपस्थिति दी।",
        "ਦਾਖਲਾ ਲੈਣ ਵਾਲਿਆਂ ਵਿੱਚੋਂ ਅੱਧੇ ਤੋਂ ਵੱਧ ਨੇ ਹਰ ਸੈਸ਼ਨ ਵਿੱਚ ਹਾਜ਼ਰੀ ਭਰੀ।"
      ],
      [
        "Every enrolled employee completed the safety course.",
        "ਸुरक्षा पाठ्यक्रम में नाम लिखाने वाले सभी कर्मचारियों ने इसे पूरा किया।",
        "ਸੁਰੱਖਿਆ ਕੋਰਸ ਵਿੱਚ ਦਾਖਲਾ ਲੈਣ ਵਾਲੇ ਸਾਰੇ ਕਰਮਚਾਰੀਆਂ ਨੇ ਇਸਨੂੰ ਪੂਰਾ ਕੀਤਾ।"
      ],
      [
        "Of 80 enrolled employees, 60 attended all sessions, which is more than half. The remaining employees missed at least one session, so completion was not universal.",
        "80 ਦਰਜ ਕਰਮਚਾਰੀਆਂ ਵਿੱਚੋਂ 60 ਨੇ ਸਾਰੇ ਸੈਸ਼ਨਾਂ ਵਿੱਚ ਹਾਜ਼ਰੀ ਦਿੱਤੀ, ਜੋ ਅੱਧੇ ਤੋਂ ਵੱਧ ਹਨ। ਬਾਕੀਆਂ ਤੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸੈਸ਼ਨ ਛੁੱਟਿਆ, ਇਸ ਲਈ ਸਭ ਨੇ ਕੋਰਸ ਪੂਰਾ ਨਹੀਂ ਕੀਤਾ।",
        "80 ਦਾਖਲਾ ਲੈਣ ਵਾਲਿਆਂ ਵਿੱਚੋਂ 60 ਨੇ ਸਾਰੇ ਸੈਸ਼ਨਾਂ ਵਿੱਚ ਹਾਜ਼ਰੀ ਭਰੀ, ਜੋ ਅੱਧੇ ਤੋਂ ਵੱਧ ਹਨ। ਬਾਕੀ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸੈਸ਼ਨ ਤੋਂ ਗੈਰਹਾਜ਼ਰ ਰਹੇ, ਇਸ ਲਈ ਸਭ ਨੇ ਕੋਰਸ ਪੂਰਾ ਨਹੀਂ ਕੀਤਾ।"
      ]
    ],
    [
      "REPAIR-COMPLETION",
      "PUBLIC_ADMINISTRATION",
      [
        "A municipal team scheduled repairs on 12 streetlights. By Friday, 9 were repaired and tested. The other three were still awaiting parts.",
        "नगरपालिका दल ने 12 स्ट्रीट लाइटों की मरम्मत तय की। शुक्रवार तक 9 की मरम्मत और जाँच पूरी हुई। बाकी तीन पुर्जों की प्रतीक्षा में थीं।",
        "ਨਗਰ ਟੀਮ ਨੇ 12 ਸਟਰੀਟ ਲਾਈਟਾਂ ਦੀ ਮੁਰੰਮਤ ਰੱਖੀ। ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ 9 ਦੀ ਮੁਰੰਮਤ ਅਤੇ ਜਾਂਚ ਹੋ ਗਈ। ਬਾਕੀ ਤਿੰਨ ਪੁਰਜ਼ਿਆਂ ਦੀ ਉਡੀਕ ਵਿੱਚ ਸਨ।"
      ],
      [
        "Most of the scheduled streetlights had been repaired and tested by Friday.",
        "शुक्रवार तक तय की गई अधिकांश स्ट्रीट लाइटों की मरम्मत और जाँच हो चुकी थी।",
        "ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਤੈਅ ਕੀਤੀਆਂ ਬਹੁਤੀਆਂ ਸਟਰੀਟ ਲਾਈਟਾਂ ਦੀ ਮੁਰੰਮਤ ਅਤੇ ਜਾਂਚ ਹੋ ਚੁੱਕੀ ਸੀ।"
      ],
      [
        "All scheduled streetlights were working by Friday.",
        "शुक्रवार तक तय की गई सभी स्ट्रीट लाइटें चालू थीं।",
        "ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਤੈਅ ਕੀਤੀਆਂ ਸਾਰੀਆਂ ਸਟਰੀਟ ਲਾਈਟਾਂ ਚੱਲ ਰਹੀਆਂ ਸਨ।"
      ],
      [
        "Nine of the twelve lights were repaired and tested, so a majority were complete. The remaining three were still waiting for parts.",
        "12 में से 9 लाइटों की मरम्मत और जाँच हुई, इसलिए अधिकांश का काम पूरा था। बाकी तीन पुर्जों की प्रतीक्षा में थीं।",
        "12 ਵਿੱਚੋਂ 9 ਲਾਈਟਾਂ ਦੀ ਮੁਰੰਮਤ ਅਤੇ ਜਾਂਚ ਹੋਈ, ਇਸ ਲਈ ਬਹੁਤੀਆਂ ਦਾ ਕੰਮ ਪੂਰਾ ਸੀ। ਬਾਕੀ ਤਿੰਨ ਪੁਰਜ਼ਿਆਂ ਦੀ ਉਡੀਕ ਵਿੱਚ ਸਨ।"
      ]
    ],
    [
      "SURVEY-SAMPLE-SHARE",
      "SURVEY",
      [
        "A survey received 150 valid responses. 90 respondents selected option A, and 35 selected option B. The report does not assign the remaining responses to a named option.",
        "एक सर्वेक्षण में 150 मान्य उत्तर मिले। 90 उत्तरदाताओं ने विकल्प A और 35 ने विकल्प B चुना। बाकी उत्तरों को रिपोर्ट में किसी नामित विकल्प से नहीं जोड़ा गया।",
        "ਇੱਕ ਸਰਵੇਖਣ ਵਿੱਚ 150 ਵੈਧ ਜਵਾਬ ਮਿਲੇ। 90 ਜਵਾਬਦਾਤਿਆਂ ਨੇ ਵਿਕਲਪ A ਅਤੇ 35 ਨੇ ਵਿਕਲਪ B ਚੁਣਿਆ। ਬਾਕੀ ਜਵਾਬਾਂ ਨੂੰ ਰਿਪੋਰਟ ਵਿੱਚ ਕਿਸੇ ਖਾਸ ਵਿਕਲਪ ਨਾਲ ਨਹੀਂ ਜੋੜਿਆ।"
      ],
      [
        "More respondents selected option A than option B.",
        "विकल्प B की तुलना में अधिक उत्तरदाताओं ने विकल्प A चुना।",
        "ਵਿਕਲਪ B ਨਾਲੋਂ ਵੱਧ ਜਵਾਬਦਾਤਿਆਂ ਨੇ ਵਿਕਲਪ A ਚੁਣਿਆ।"
      ],
      [
        "Every respondent who did not select A selected B.",
        "जिन उत्तरदाताओं ने A नहीं चुना, उन सभी ने B चुना।",
        "ਜਿਨ੍ਹਾਂ ਜਵਾਬਦਾਤਿਆਂ ਨੇ A ਨਹੀਂ ਚੁਣਿਆ, ਉਨ੍ਹਾਂ ਸਭ ਨੇ B ਚੁਣਿਆ।"
      ],
      [
        "The report counts 90 selections for A and 35 for B, so A was chosen more often. It does not identify the choices of the remaining respondents.",
        "रिपोर्ट में A के 90 और B के 35 चयन हैं, इसलिए A अधिक चुना गया। बाकी उत्तरदाताओं के विकल्प नहीं बताए गए।",
        "ਰਿਪੋਰਟ ਵਿੱਚ A ਦੇ 90 ਅਤੇ B ਦੇ 35 ਚੋਣਾਂ ਹਨ, ਇਸ ਲਈ A ਵੱਧ ਚੁਣਿਆ ਗਿਆ। ਬਾਕੀ ਜਵਾਬਦਾਤਿਆਂ ਦੀ ਚੋਣ ਨਹੀਂ ਦੱਸੀ ਗਈ।"
      ]
    ]
  ],
  "NUMBER_SCOPE": [
    [
      "TWO-DISTRICT-SAMPLE",
      "BUSINESS",
      [
        "During a trial week, 32 orders from District X and 30 from District Y were returned. These are raw return counts. The total number of orders in each district is not reported.",
        "परीक्षण सप्ताह में जिला X के 32 और जिला Y के 30 ऑर्डर लौटाए गए। ये वापसी की कुल गिनती है। हर जिले में कुल कितने ऑर्डर थे, यह नहीं बताया गया।",
        "ਪਰਖ ਹਫ਼ਤੇ ਦੌਰਾਨ ਜ਼ਿਲ੍ਹਾ X ਦੇ 32 ਅਤੇ ਜ਼ਿਲ੍ਹਾ Y ਦੇ 30 ਆਰਡਰ ਵਾਪਸ ਆਏ। ਇਹ ਵਾਪਸੀ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਹੈ। ਹਰ ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਆਰਡਰ ਸਨ, ਇਹ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ।"
      ],
      [
        "The recorded number of returns was higher for District X than for District Y.",
        "ਜ਼ਿਲ੍ਹਾ Y ਨਾਲੋਂ ਜ਼ਿਲ੍ਹਾ X ਦੇ ਵੱਧ ਆਰਡਰ ਵਾਪਸ ਦਰਜ ਹੋਏ।",
        "ਜ਼ਿਲ੍ਹਾ Y ਨਾਲੋਂ ਜ਼ਿਲ੍ਹਾ X ਦੇ ਵੱਧ ਆਰਡਰ ਵਾਪਸ ਆਏ ਦਰਜ ਹੋਏ।"
      ],
      [
        "The return rate was higher in District X than in District Y.",
        "ज़िला Y की तुलना में जिला X में वापसी की दर अधिक थी।",
        "ਜ਼ਿਲ੍ਹਾ Y ਨਾਲੋਂ ਜ਼ਿਲ੍ਹਾ X ਵਿੱਚ ਵਾਪਸੀ ਦੀ ਦਰ ਵੱਧ ਸੀ।"
      ],
      [
        "The raw count is 32 returns from X and 30 from Y, so X had more returns by number. Since the order samples differ in size, the counts alone do not establish which return rate was higher.",
        "X से 32 और Y से 30 वापसी हुईं, इसलिए संख्या में X अधिक था। ऑर्डरों के नमूने अलग आकार के थे, इसलिए केवल गिनती से वापसी की दर की तुलना नहीं होती।",
        "X ਤੋਂ 32 ਅਤੇ Y ਤੋਂ 30 ਵਾਪਸੀਆਂ ਸਨ, ਇਸ ਲਈ ਗਿਣਤੀ ਵਿੱਚ X ਵੱਧ ਸੀ। ਆਰਡਰਾਂ ਦੇ ਨਮੂਨੇ ਵੱਖਰੇ ਆਕਾਰ ਦੇ ਸਨ, ਇਸ ਲਈ ਸਿਰਫ਼ ਗਿਣਤੀ ਨਾਲ ਵਾਪਸੀ ਦਰ ਦੀ ਤੁਲਨਾ ਨਹੀਂ ਹੁੰਦੀ।"
      ]
    ],
    [
      "BRANCH-TRANSACTIONS",
      "BANKING",
      [
        "Branch P recorded 1,240 transactions and Branch Q recorded 980 during May. A transaction may be counted more than once for the same customer. The figures cover the same month.",
        "मई में शाखा P में 1,240 और शाखा Q में 980 लेनदेन दर्ज हुए। एक ग्राहक के कई लेनदेन गिने जा सकते हैं। आँकड़े उसी महीने के हैं।",
        "ਮਈ ਵਿੱਚ ਸ਼ਾਖਾ P ਵਿੱਚ 1,240 ਅਤੇ ਸ਼ਾਖਾ Q ਵਿੱਚ 980 ਲੈਣ-ਦੇਣ ਦਰਜ ਹੋਏ। ਇੱਕ ਗਾਹਕ ਦੇ ਕਈ ਲੈਣ-ਦੇਣ ਗਿਣੇ ਜਾ ਸਕਦੇ ਹਨ। ਅੰਕੜੇ ਉਸੇ ਮਹੀਨੇ ਦੇ ਹਨ।"
      ],
      [
        "Branch P recorded more transactions than Branch Q that month.",
        "उस महीने शाखा P में शाखा Q से अधिक लेनदेन दर्ज हुए।",
        "ਉਸ ਮਹੀਨੇ ਸ਼ਾਖਾ P ਵਿੱਚ ਸ਼ਾਖਾ Q ਨਾਲੋਂ ਵੱਧ ਲੈਣ-ਦੇਣ ਦਰਜ ਹੋਏ।"
      ],
      [
        "Branch P served more individual customers than Branch Q.",
        "शाखा P ने शाखा Q से अधिक अलग-अलग ग्राहकों को सेवा दी।",
        "ਸ਼ਾਖਾ P ਨੇ ਸ਼ਾਖਾ Q ਨਾਲੋਂ ਵੱਧ ਵੱਖਰੇ ਗਾਹਕਾਂ ਨੂੰ ਸੇਵਾ ਦਿੱਤੀ।"
      ],
      [
        "The figures directly compare transaction totals: 1,240 at P and 980 at Q. They do not give the number of distinct customers.",
        "आँकड़े लेनदेन की कुल संख्या बताते हैं: P में 1,240 और Q में 980। अलग-अलग ग्राहकों की संख्या नहीं दी गई।",
        "ਅੰਕੜੇ ਲੈਣ-ਦੇਣ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਦੱਸਦੇ ਹਨ: P ਵਿੱਚ 1,240 ਅਤੇ Q ਵਿੱਚ 980। ਵੱਖਰੇ ਗਾਹਕਾਂ ਦੀ ਗਿਣਤੀ ਨਹੀਂ ਦਿੱਤੀ।"
      ]
    ],
    [
      "REGION-SALES-SAMPLE",
      "BUSINESS",
      [
        "A company reported sales of ₹8 lakh in the North region and ₹6 lakh in the South region for one quarter. These are regional totals. The report gives no figures for other quarters.",
        "एक कंपनी ने एक तिमाही में उत्तर क्षेत्र में ₹8 लाख और दक्षिण क्षेत्र में ₹6 लाख की बिक्री बताई। ये क्षेत्रीय कुल हैं। अन्य तिमाहियों के आँकड़े नहीं दिए गए।",
        "ਇੱਕ ਕੰਪਨੀ ਨੇ ਇੱਕ ਤਿਮਾਹੀ ਵਿੱਚ ਉੱਤਰੀ ਖੇਤਰ ਵਿੱਚ ₹8 ਲੱਖ ਅਤੇ ਦੱਖਣੀ ਖੇਤਰ ਵਿੱਚ ₹6 ਲੱਖ ਦੀ ਵਿਕਰੀ ਦੱਸੀ। ਇਹ ਖੇਤਰੀ ਕੁੱਲ ਹਨ। ਹੋਰ ਤਿਮਾਹੀਆਂ ਦੇ ਅੰਕੜੇ ਨਹੀਂ ਦਿੱਤੇ।"
      ],
      [
        "The reported sales total was higher in the North region than in the South region for that quarter.",
        "उस तिमाही में उत्तर क्षेत्र की दर्ज बिक्री दक्षिण क्षेत्र से अधिक थी।",
        "ਉਸ ਤਿਮਾਹੀ ਵਿੱਚ ਉੱਤਰੀ ਖੇਤਰ ਦੀ ਦਰਜ ਵਿਕਰੀ ਦੱਖਣੀ ਖੇਤਰ ਨਾਲੋਂ ਵੱਧ ਸੀ।"
      ],
      [
        "The North region had higher sales in every quarter of the year.",
        "उत्तर क्षेत्र में वर्ष की हर तिमाही में अधिक बिक्री हुई।",
        "ਉੱਤਰੀ ਖੇਤਰ ਵਿੱਚ ਸਾਲ ਦੀ ਹਰ ਤਿਮਾਹੀ ਵਿੱਚ ਵੱਧ ਵਿਕਰੀ ਹੋਈ।"
      ],
      [
        "For the stated quarter, ₹8 lakh in the North exceeds ₹6 lakh in the South. One quarter's totals do not establish the pattern for the rest of the year.",
        "दी गई तिमाही में उत्तर के ₹8 लाख, दक्षिण के ₹6 लाख से अधिक हैं। एक तिमाही का कुल पूरे वर्ष का रुझान नहीं बताता।",
        "ਦਿੱਤੀ ਤਿਮਾਹੀ ਵਿੱਚ ਉੱਤਰ ਦੇ ₹8 ਲੱਖ, ਦੱਖਣ ਦੇ ₹6 ਲੱਖ ਨਾਲੋਂ ਵੱਧ ਹਨ। ਇੱਕ ਤਿਮਾਹੀ ਦਾ ਕੁੱਲ ਪੂਰੇ ਸਾਲ ਦਾ ਰੁਝਾਨ ਨਹੀਂ ਦੱਸਦਾ।"
      ]
    ]
  ]
} as unknown as Readonly<Record<Family, readonly Row[]>>;
const familyOrder = Object.keys(families) as Family[];
const distractor: Readonly<Record<Family, SifDistractorType>> = {
  "PERCENTAGE_COMPARISON": "SCOPE_CHANGE",
  "ABSOLUTE_COUNTS": "UNSUPPORTED_DETAIL",
  "SIMPLE_RATIOS": "QUANTITY_DISTORTION",
  "CHANGE_OVER_TIME": "TIME_DISTORTION",
  "RANKING": "EXCESSIVE_CERTAINTY",
  "FREQUENCY": "OVERGENERALISATION",
  "PART_WHOLE": "EXCESSIVE_CERTAINTY",
  "NUMBER_SCOPE": "SCOPE_CHANGE"
};
const desiredInferenceI: Readonly<Record<Family, readonly boolean[]>> = {
  "PERCENTAGE_COMPARISON": [
    true,
    false,
    true
  ],
  "ABSOLUTE_COUNTS": [
    false,
    true,
    false
  ],
  "SIMPLE_RATIOS": [
    true,
    false,
    false
  ],
  "CHANGE_OVER_TIME": [
    false,
    true,
    true
  ],
  "RANKING": [
    true,
    true,
    false
  ],
  "FREQUENCY": [
    false,
    false,
    true
  ],
  "PART_WHOLE": [
    true,
    false,
    false
  ],
  "NUMBER_SCOPE": [
    false,
    true,
    true
  ]
};

export const SIF_CP009_DATA_AUTHORITIES: readonly SifScenarioAuthority[] = familyOrder.flatMap((family, familyIndex) => families[family].map(([key, domain, statement, supportedText, unsupportedText, reasoning], rowIndex) => {
  const globalIndex = familyIndex * families[family].length + rowIndex;
  const answerIInReview = desiredInferenceI[family][rowIndex];
  const seedSwapsInReview = globalIndex % 2 === 1;
  const supportedFirst = answerIInReview !== seedSwapsInReview;
  const sentenceRows = statement.map((text) => text.trim().split(/(?<=[.!?।])\s+/));
  const factCount = Math.min(...sentenceRows.map((sentences) => sentences.length));
  const facts = Array.from({ length: factCount }, (_, i) => ({ id: `F${i + 1}`, text: localized([sentenceRows[0][i], sentenceRows[1][i], sentenceRows[2][i]] as L) }));
  const valid = { id: supportedFirst ? "I" : "II", text: localized(supportedText), follows: true, strength: "CERTAIN" as const, supportFactIds: facts.map((fact) => fact.id) };
  const invalid = { id: supportedFirst ? "II" : "I", text: localized(unsupportedText), follows: false, strength: "UNSUPPORTED_OR_CONTRADICTED" as const, supportFactIds: facts.map((fact) => fact.id), distractorType: distractor[family] };
  const suffix: L = supportedFirst ? ["Therefore, only Inference I follows.", "इसलिए केवल अनुमान I सही है।", "ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ I ਸਹੀ ਹੈ।"] : ["Therefore, only Inference II follows.", "इसलिए केवल अनुमान II सही है।", "ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ II ਸਹੀ ਹੈ।"];
  const explanation = localized([0,1,2].map((i) => `${reasoning[i]} ${suffix[i]}`) as unknown as L);
  return { id: `SIF-CP009-${family}-${key}`, cpId: "SIF-CP009" as const, difficulty: "MEDIUM" as const, domain, mechanisms: ["DATA_COMPARISON", "COMPARISON"] as const, statement: localized(statement), facts, candidates: [supportedFirst ? valid : invalid, supportedFirst ? invalid : valid] as const, explanation, identityGuard: guard };
}));

export const SIF_CP009_PROFILE_BY_AUTHORITY_ID: Readonly<Record<string, { readonly family: Family }>> = Object.fromEntries(familyOrder.flatMap((family) => SIF_CP009_DATA_AUTHORITIES.filter((authority) => authority.id.startsWith(`SIF-CP009-${family}-`)).map((authority) => [authority.id, { family }] as const)));
