export type DsfReasoningLocalizedLanguage = "hi" | "pa";

type AnyQuestion = Readonly<Record<string, any>>;

const OPTION_TEXT = {
  hi: {
    STATEMENT_I_ONLY: "केवल कथन I पर्याप्त है।",
    STATEMENT_II_ONLY: "केवल कथन II पर्याप्त है।",
    EACH_STATEMENT_ALONE: "कथन I और कथन II, प्रत्येक अकेले पर्याप्त है।",
    BOTH_TOGETHER_ONLY: "दोनों कथन साथ में पर्याप्त हैं, लेकिन कोई भी कथन अकेले पर्याप्त नहीं है।",
    INSUFFICIENT_EVEN_TOGETHER: "दोनों कथन साथ लेने पर भी पर्याप्त नहीं हैं।",
  },
  pa: {
    STATEMENT_I_ONLY: "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ।",
    STATEMENT_II_ONLY: "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ।",
    EACH_STATEMENT_ALONE: "ਕਥਨ I ਅਤੇ ਕਥਨ II, ਹਰ ਇੱਕ ਆਪਣੇ ਆਪ ਵਿੱਚ ਕਾਫ਼ੀ ਹੈ।",
    BOTH_TOGETHER_ONLY: "ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
    INSUFFICIENT_EVEN_TOGETHER: "ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੈਣ 'ਤੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ।",
  },
} as const;

const WEEKDAY = {
  hi: { Sunday:"रविवार", Monday:"सोमवार", Tuesday:"मंगलवार", Wednesday:"बुधवार", Thursday:"गुरुवार", Friday:"शुक्रवार", Saturday:"शनिवार" },
  pa: { Sunday:"ਐਤਵਾਰ", Monday:"ਸੋਮਵਾਰ", Tuesday:"ਮੰਗਲਵਾਰ", Wednesday:"ਬੁੱਧਵਾਰ", Thursday:"ਵੀਰਵਾਰ", Friday:"ਸ਼ੁੱਕਰਵਾਰ", Saturday:"ਸ਼ਨੀਵਾਰ" },
} as const;

function t(language: DsfReasoningLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function ordinal(value: string, language: DsfReasoningLocalizedLanguage): string {
  const n = value.replace(/(?:st|nd|rd|th)$/i, "");
  return language === "hi" ? `${n}वाँ` : `${n}ਵਾਂ`;
}

function localizeWeekday(value: string, language: DsfReasoningLocalizedLanguage): string {
  return (WEEKDAY[language] as Record<string,string>)[value] ?? value;
}

function targetPrompt(laneId: string, q: AnyQuestion, language: DsfReasoningLocalizedLanguage): string {
  const mode = String(q.solveModeId ?? q.solveMode ?? "");
  const byMode: Record<string, [string,string]> = {
    "DSF-SM-RNK-OPPOSITE-END-RANK": ["लक्षित व्यक्ति की दूसरे सिरे से रैंक क्या है?", "ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ਦੀ ਦੂਜੇ ਸਿਰੇ ਤੋਂ ਰੈਂਕ ਕੀ ਹੈ?"],
    "DSF-SM-RNK-TOTAL-FROM-END-RANKS": ["कुल कितने व्यक्ति हैं?", "ਕੁੱਲ ਕਿੰਨੇ ਵਿਅਕਤੀ ਹਨ?"],
    "DSF-SM-RNK-COUNT-AFTER": ["लक्षित व्यक्ति के बाद कितने व्यक्ति हैं?", "ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ਤੋਂ ਬਾਅਦ ਕਿੰਨੇ ਵਿਅਕਤੀ ਹਨ?"],
    "DSF-SM-RNK-RANK-FROM-COUNT-BEFORE": ["लक्षित व्यक्ति की आरंभिक सिरे से रैंक क्या है?", "ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ਦੀ ਸ਼ੁਰੂਆਤੀ ਸਿਰੇ ਤੋਂ ਰੈਂਕ ਕੀ ਹੈ?"],
    "DSF-SM-CAL-RESULT-WEEKDAY": ["परिणामी वार कौन-सा है?", "ਨਤੀਜੇ ਵਜੋਂ ਕਿਹੜਾ ਵਾਰ ਬਣਦਾ ਹੈ?"],
    "DSF-SM-CAL-START-WEEKDAY": ["आरंभिक वार कौन-सा था?", "ਸ਼ੁਰੂਆਤੀ ਵਾਰ ਕਿਹੜਾ ਸੀ?"],
    "DSF-SM-CAL-SHIFT-REMAINDER": ["दिनों की संख्या को 7 से भाग देने पर शेषफल क्या है?", "ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦੇਣ 'ਤੇ ਬਾਕੀ ਕੀ ਹੈ?"],
  };
  if (byMode[mode]) return t(language, ...byMode[mode]!);

  const prompt = String(q.questionPrompt ?? "");
  if (/which direction/i.test(prompt)) return t(language, "पूछी गई दिशा क्या है?", "ਪੁੱਛੀ ਗਈ ਦਿਸ਼ਾ ਕੀ ਹੈ?");
  if (/related|relationship/i.test(prompt)) return t(language, "पूछा गया पारिवारिक संबंध क्या है?", "ਪੁੱਛਿਆ ਗਿਆ ਪਰਿਵਾਰਕ ਸੰਬੰਧ ਕੀ ਹੈ?");
  if (/inequal|greater|smaller|relation/i.test(prompt) && laneId.includes("INEQUALITY")) return t(language, "पूछा गया संबंध क्या है?", "ਪੁੱਛਿਆ ਗਿਆ ਸੰਬੰਧ ਕੀ ਹੈ?");
  if (/seat|position|sits|middle/i.test(prompt) && laneId.includes("SEATING")) return t(language, "पूछा गया बैठने का स्थान कौन-सा है?", "ਪੁੱਛਿਆ ਗਿਆ ਬੈਠਣ ਦਾ ਸਥਾਨ ਕਿਹੜਾ ਹੈ?");
  if (/code|digit|symbol/i.test(prompt) && laneId.includes("CODING")) return t(language, "पूछे गए संकेत का कोड क्या है?", "ਪੁੱਛੇ ਗਏ ਸੰਕੇਤ ਦਾ ਕੋਡ ਕੀ ਹੈ?");
  return t(language, "प्रश्न में मांगी गई जानकारी क्या है?", "ਸਵਾਲ ਵਿੱਚ ਮੰਗੀ ਗਈ ਜਾਣਕਾਰੀ ਕੀ ਹੈ?");
}

function scenarioLead(laneId: string, q: AnyQuestion, language: DsfReasoningLocalizedLanguage): string {
  const context = String(q.contextId ?? "");
  if (laneId.includes("RANKING")) {
    const map: Record<string,[string,string]> = {
      MERIT_LIST:["एक अभ्यर्थी की मेरिट सूची में स्थिति दी गई है।","ਇੱਕ ਉਮੀਦਵਾਰ ਦੀ ਮੇਰਿਟ ਸੂਚੀ ਵਿੱਚ ਸਥਿਤੀ ਦਿੱਤੀ ਗਈ ਹੈ।"],
      QUEUE:["एक व्यक्ति कतार में खड़ा है।","ਇੱਕ ਵਿਅਕਤੀ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਾ ਹੈ।"],
      ROW:["व्यक्तियों की एक सीधी पंक्ति है।","ਵਿਅਕਤੀਆਂ ਦੀ ਇੱਕ ਸਿੱਧੀ ਕਤਾਰ ਹੈ।"],
      RACE_ORDER:["दौड़ पूरी करने वाले खिलाड़ियों का क्रम दिया गया है।","ਦੌੜ ਪੂਰੀ ਕਰਨ ਵਾਲੇ ਖਿਡਾਰੀਆਂ ਦਾ ਕ੍ਰਮ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
      INTERVIEW_ORDER:["अभ्यर्थियों का साक्षात्कार क्रम दिया गया है।","ਉਮੀਦਵਾਰਾਂ ਦਾ ਇੰਟਰਵਿਊ ਕ੍ਰਮ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
      SCORE_ORDER:["विद्यार्थियों की अंक-आधारित रैंकिंग दी गई है।","ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਅੰਕਾਂ ਅਧਾਰਿਤ ਰੈਂਕਿੰਗ ਦਿੱਤੀ ਗਈ ਹੈ।"],
    };
    return map[context] ? t(language,...map[context]!) : t(language,"एक क्रमबद्ध सूची दी गई है।","ਇੱਕ ਕ੍ਰਮਬੱਧ ਸੂਚੀ ਦਿੱਤੀ ਗਈ ਹੈ।");
  }
  if (laneId.includes("DIRECTION")) return t(language,"एक व्यक्ति क्रमवार दिशाओं में चलता है।","ਇੱਕ ਵਿਅਕਤੀ ਕ੍ਰਮਵਾਰ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਤੁਰਦਾ ਹੈ।");
  if (laneId.includes("BLOOD")) return t(language,"परिवार के सदस्यों के बीच संबंध दिए गए हैं।","ਪਰਿਵਾਰ ਦੇ ਮੈਂਬਰਾਂ ਵਿਚਕਾਰ ਸੰਬੰਧ ਦਿੱਤੇ ਗਏ ਹਨ।");
  if (laneId.includes("INEQUALITY")) return t(language,"चार राशियों के बीच तुलनात्मक संबंध दिए गए हैं।","ਚਾਰ ਮਾਤਰਾਵਾਂ ਵਿਚਕਾਰ ਤੁਲਨਾਤਮਕ ਸੰਬੰਧ ਦਿੱਤੇ ਗਏ ਹਨ।");
  if (laneId.includes("SEATING")) return t(language,"पाँच व्यक्ति एक सीधी पंक्ति में बैठे हैं।","ਪੰਜ ਵਿਅਕਤੀ ਇੱਕ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ।");
  if (laneId.includes("CODING")) return t(language,"दिए गए संकेत अलग-अलग अंकों को दर्शाते हैं।","ਦਿੱਤੇ ਗਏ ਸੰਕੇਤ ਵੱਖ-ਵੱਖ ਅੰਕਾਂ ਨੂੰ ਦਰਸਾਉਂਦੇ ਹਨ।");
  if (laneId.includes("CALENDAR")) return t(language,"साप्ताहिक चक्र में दिनों का परिवर्तन दिया गया है।","ਹਫ਼ਤਾਵਾਰੀ ਚੱਕਰ ਵਿੱਚ ਦਿਨਾਂ ਦਾ ਬਦਲਾਅ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
  return "";
}

function replaceCommon(text: string, language: DsfReasoningLocalizedLanguage): string {
  let s = text;
  const reps: Array<[RegExp,string,string]> = [
    [/Statement I/gi,"कथन I","ਕਥਨ I"],[/Statement II/gi,"कथन II","ਕਥਨ II"],
    [/starting end/gi,"आरंभिक सिरे","ਸ਼ੁਰੂਆਤੀ ਸਿਰੇ"],[/opposite end/gi,"दूसरे सिरे","ਦੂਜੇ ਸਿਰੇ"],
    [/target person/gi,"लक्षित व्यक्ति","ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ"],[/people/gi,"व्यक्ति","ਵਿਅਕਤੀ"],
    [/exactly/gi,"ठीक","ਬਿਲਕੁਲ"],[/at least/gi,"कम से कम","ਘੱਟੋ-ਘੱਟ"],[/at most/gi,"अधिकतम","ਵੱਧ ਤੋਂ ਵੱਧ"],
    [/before/gi,"पहले","ਪਹਿਲਾਂ"],[/after/gi,"बाद","ਬਾਅਦ"],[/total number/gi,"कुल संख्या","ਕੁੱਲ ਗਿਣਤੀ"],
    [/even/gi,"सम","ਜੁੜਾ"],[/odd/gi,"विषम","ਬੇਜੋੜ"],
    [/greater than/gi,"से बड़ा","ਤੋਂ ਵੱਡਾ"],[/less than/gi,"से छोटा","ਤੋਂ ਛੋਟਾ"],
    [/north/gi,"उत्तर","ਉੱਤਰ"],[/south/gi,"दक्षिण","ਦੱਖਣ"],[/east/gi,"पूर्व","ਪੂਰਬ"],[/west/gi,"पश्चिम","ਪੱਛਮ"],
    [/left/gi,"बाएँ","ਖੱਬੇ"],[/right/gi,"दाएँ","ਸੱਜੇ"],
    [/immediately/gi,"ठीक","ਤੁਰੰਤ"],[/between/gi,"के बीच","ਦੇ ਵਿਚਕਾਰ"],
  ];
  for (const [re,hi,pa] of reps) s=s.replace(re, language==="hi" ? hi : pa);
  s=s.replace(/Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday/g,(m)=>localizeWeekday(m,language));
  s=s.replace(/(\d+)(?:st|nd|rd|th)\b/g,(_,n)=>ordinal(n,language));
  return s;
}

function localizeRankingStatement(text: string, language: DsfReasoningLocalizedLanguage): string | undefined {
  let m: RegExpMatchArray | null;
  const side = (value: string) => /starting/i.test(value)
    ? t(language, "आरंभिक सिरे", "ਸ਼ੁਰੂਆਤੀ ਸਿਰੇ")
    : t(language, "दूसरे सिरे", "ਦੂਜੇ ਸਿਰੇ");
  const parity = (value: string) => /even/i.test(value)
    ? t(language, "सम", "ਜੁੜੀ")
    : t(language, "विषम", "ਬੇਜੋੜ");

  m = text.match(/^The (rank from the opposite end|total number of people|number of people after the target person|rank from the starting end) is exactly (\d+)\.$/i);
  if (m) {
    const label: Record<string,[string,string]> = {
      "rank from the opposite end": ["दूसरे सिरे से रैंक","ਦੂਜੇ ਸਿਰੇ ਤੋਂ ਰੈਂਕ"],
      "total number of people": ["कुल व्यक्तियों की संख्या","ਕੁੱਲ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ"],
      "number of people after the target person": ["लक्षित व्यक्ति के बाद व्यक्तियों की संख्या","ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ਤੋਂ ਬਾਅਦ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ"],
      "rank from the starting end": ["आरंभिक सिरे से रैंक","ਸ਼ੁਰੂਆਤੀ ਸਿਰੇ ਤੋਂ ਰੈਂਕ"],
    };
    const pair=label[m[1]!.toLowerCase()]!;
    return t(language, `${pair[0]} ठीक ${m[2]} है।`, `${pair[1]} ਬਿਲਕੁਲ ${m[2]} ਹੈ।`);
  }
  m=text.match(/^There are exactly (\d+) people in the complete order\.$/i);
  if(m) return t(language,`पूरे क्रम में कुल ${m[1]} व्यक्ति हैं।`,`ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ਕੁੱਲ ${m[1]} ਵਿਅਕਤੀ ਹਨ।`);
  m=text.match(/^The target person is (\d+)(?:st|nd|rd|th) from the (starting|opposite) end\.$/i);
  if(m) return t(language,`लक्षित व्यक्ति ${side(m[2]!)} से ${ordinal(m[1]!,language)} है।`,`ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ${side(m[2]!)} ਤੋਂ ${ordinal(m[1]!,language)} ਹੈ।`);
  m=text.match(/^Exactly (\d+) people are (before|after) the target person\.$/i);
  if(m) return m[2]!.toLowerCase()==="before"
    ? t(language,`लक्षित व्यक्ति से पहले ठीक ${m[1]} व्यक्ति हैं।`,`ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ਤੋਂ ਪਹਿਲਾਂ ਬਿਲਕੁਲ ${m[1]} ਵਿਅਕਤੀ ਹਨ।`)
    : t(language,`लक्षित व्यक्ति के बाद ठीक ${m[1]} व्यक्ति हैं।`,`ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ਤੋਂ ਬਾਅਦ ਬਿਲਕੁਲ ${m[1]} ਵਿਅਕਤੀ ਹਨ।`);
  m=text.match(/^There are (\d+) people, and the target person is (\d+)(?:st|nd|rd|th) from the starting end\.$/i);
  if(m) return t(language,`कुल ${m[1]} व्यक्ति हैं और लक्षित व्यक्ति आरंभिक सिरे से ${ordinal(m[2]!,language)} है।`,`ਕੁੱਲ ${m[1]} ਵਿਅਕਤੀ ਹਨ ਅਤੇ ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ਸ਼ੁਰੂਆਤੀ ਸਿਰੇ ਤੋਂ ${ordinal(m[2]!,language)} ਹੈ।`);
  m=text.match(/^The target person is (\d+)(?:st|nd|rd|th) from one end and (\d+)(?:st|nd|rd|th) from the other end\.$/i);
  if(m) return t(language,`लक्षित व्यक्ति एक सिरे से ${ordinal(m[1]!,language)} और दूसरे सिरे से ${ordinal(m[2]!,language)} है।`,`ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ਇੱਕ ਸਿਰੇ ਤੋਂ ${ordinal(m[1]!,language)} ਅਤੇ ਦੂਜੇ ਸਿਰੇ ਤੋਂ ${ordinal(m[2]!,language)} ਹੈ।`);
  m=text.match(/^There are (\d+) people in all and (\d+) people are after the target person\.$/i);
  if(m) return t(language,`कुल ${m[1]} व्यक्ति हैं और लक्षित व्यक्ति के बाद ${m[2]} व्यक्ति हैं।`,`ਕੁੱਲ ${m[1]} ਵਿਅਕਤੀ ਹਨ ਅਤੇ ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ਤੋਂ ਬਾਅਦ ${m[2]} ਵਿਅਕਤੀ ਹਨ।`);
  m=text.match(/^The total number of people does not exceed (\d+)\.$/i);
  if(m) return t(language,`कुल व्यक्तियों की संख्या ${m[1]} से अधिक नहीं है।`,`ਕੁੱਲ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ ${m[1]} ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੈ।`);
  m=text.match(/^The total number of people is at least (\d+)\.$/i);
  if(m) return t(language,`कुल व्यक्तियों की संख्या कम से कम ${m[1]} है।`,`ਕੁੱਲ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ ਘੱਟੋ-ਘੱਟ ${m[1]} ਹੈ।`);
  m=text.match(/^The target person's rank from the (starting|opposite) end is at (most|least) (\d+)\.$/i);
  if(m) {
    const bound=m[2]!.toLowerCase()==="most" ? t(language,"अधिकतम","ਵੱਧ ਤੋਂ ਵੱਧ") : t(language,"कम से कम","ਘੱਟੋ-ਘੱਟ");
    return t(language,`लक्षित व्यक्ति की ${side(m[1]!)} से रैंक ${bound} ${m[3]} है।`,`ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ਦੀ ${side(m[1]!)} ਤੋਂ ਰੈਂਕ ${bound} ${m[3]} ਹੈ।`);
  }
  m=text.match(/^The rank from the starting end is (even|odd)\.$/i);
  if(m) return t(language,`आरंभिक सिरे से रैंक ${parity(m[1]!)} है।`,`ਸ਼ੁਰੂਆਤੀ ਸਿਰੇ ਤੋਂ ਰੈਂਕ ${parity(m[1]!)} ਹੈ।`);
  m=text.match(/^The total number of people is (even|odd)\.$/i);
  if(m) return t(language,`कुल व्यक्तियों की संख्या ${parity(m[1]!)} है।`,`ਕੁੱਲ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ ${parity(m[1]!)} ਹੈ।`);
  return undefined;
}

function localizeStatement(laneId: string, text: string, language: DsfReasoningLocalizedLanguage): string {
  if (laneId.includes("RANKING")) {
    const rendered=localizeRankingStatement(text,language);
    if(rendered) return rendered;
  }
  let s = replaceCommon(text, language);
  const exact: Array<[RegExp,(m:RegExpMatchArray)=>string]> = [
    [/^There are exactly (\d+) व्यक्ति in the complete order\.$/u,m=>t(language,`पूरे क्रम में कुल ${m[1]} व्यक्ति हैं।`,`ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ਕੁੱਲ ${m[1]} ਵਿਅਕਤੀ ਹਨ।`)],
    [/^The लक्षित व्यक्ति is (\d+वाँ) from the आरंभिक सिरे\.$/u,m=>t(language,`लक्षित व्यक्ति आरंभिक सिरे से ${m[1]} है।`,`ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ਸ਼ੁਰੂਆਤੀ ਸਿਰੇ ਤੋਂ ${m[1]} ਹੈ।`)],
    [/^The ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ is (\d+ਵਾਂ) from the ਸ਼ੁਰੂਆਤੀ ਸਿਰੇ\.$/u,m=>`ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ ਸ਼ੁਰੂਆਤੀ ਸਿਰੇ ਤੋਂ ${m[1]} ਹੈ।`],
    [/^The resulting day is (.+)\.$/u,m=>t(language,`परिणामी वार ${m[1]} है।`,`ਨਤੀਜੇ ਵਾਲਾ ਵਾਰ ${m[1]} ਹੈ।`)],
    [/^The starting day is (.+)\.$/u,m=>t(language,`आरंभिक वार ${m[1]} है।`,`ਸ਼ੁਰੂਆਤੀ ਵਾਰ ${m[1]} ਹੈ।`)],
    [/^The number of days leaves remainder (\d+) when divided by 7\.$/u,m=>t(language,`दिनों की संख्या को 7 से भाग देने पर शेषफल ${m[1]} है।`,`ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦੇਣ 'ਤੇ ਬਾਕੀ ${m[1]} ਹੈ।`)],
  ];
  for (const [re,fn] of exact){ const m=s.match(re); if(m) return fn(m); }

  s=s
    .replace(/^The /i,"")
    .replace(/ is /gi, language==="hi" ? " है " : " ਹੈ ")
    .replace(/ are /gi, language==="hi" ? " हैं " : " ਹਨ ")
    .replace(/ and /gi, language==="hi" ? " और " : " ਅਤੇ ")
    .replace(/ or /gi, language==="hi" ? " या " : " ਜਾਂ ")
    .replace(/ does not /gi, language==="hi" ? " नहीं " : " ਨਹੀਂ ")
    .replace(/ is not /gi, language==="hi" ? " नहीं है " : " ਨਹੀਂ ਹੈ ");
  return s.trim();
}

function localizedExplanation(q: AnyQuestion, language: DsfReasoningLocalizedLanguage): string {
  const proof=q.proof ?? {};
  const canonical=String(q.canonicalAnswer ?? q.correctClass ?? "");
  const one=(label:string,sufficient:boolean|undefined,answers:any[])=>{
    const vals=(answers??[]).slice(0,2).map(String);
    if(sufficient){
      return t(language,`${label} से मांगा गया उत्तर निश्चित हो जाता है${vals[0] ? ` (${localizeWeekday(vals[0],language)})` : ""}।`,`${label} ਨਾਲ ਮੰਗਿਆ ਗਿਆ ਉੱਤਰ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ${vals[0] ? ` (${localizeWeekday(vals[0],language)})` : ""}।`);
    }
    return t(language,`${label} अकेले पर्याप्त नहीं है${vals.length>1 ? `; कम से कम ${vals.map(v=>localizeWeekday(v,language)).join(" और ")} संभव हैं` : ""}।`,`${label} ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ${vals.length>1 ? `; ਘੱਟੋ-ਘੱਟ ${vals.map(v=>localizeWeekday(v,language)).join(" ਅਤੇ ")} ਸੰਭਵ ਹਨ` : ""}।`);
  };
  const s1=Boolean(proof.statementISufficient ?? proof.statementI?.sufficient);
  const s2=Boolean(proof.statementIISufficient ?? proof.statementII?.sufficient);
  const st=Boolean(proof.togetherSufficient ?? proof.together?.sufficient);
  const a1=proof.statementITargetAnswers ?? proof.statementI?.normalizedTargetAnswers ?? [];
  const a2=proof.statementIITargetAnswers ?? proof.statementII?.normalizedTargetAnswers ?? [];
  const at=proof.togetherTargetAnswers ?? proof.together?.normalizedTargetAnswers ?? [];
  return [
    t(language,"पहले दोनों कथनों को अलग-अलग जाँचते हैं।","ਪਹਿਲਾਂ ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚਦੇ ਹਾਂ।"),
    one(t(language,"कथन I","ਕਥਨ I"),s1,a1),
    one(t(language,"कथन II","ਕਥਨ II"),s2,a2),
    one(t(language,"दोनों कथन साथ लेने पर","ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੈਣ 'ਤੇ"),st,at),
    t(language,`अतः सही पर्याप्तता वर्ग: ${OPTION_TEXT.hi[canonical as keyof typeof OPTION_TEXT.hi] ?? canonical}`,`ਇਸ ਲਈ ਸਹੀ ਪਰਯਾਪਤਤਾ ਵਰਗ: ${OPTION_TEXT.pa[canonical as keyof typeof OPTION_TEXT.pa] ?? canonical}`),
  ].join(" ");
}

export function localizeDsfReasoningQuestion(
  laneId: string,
  question: AnyQuestion,
  language: DsfReasoningLocalizedLanguage,
): AnyQuestion {
  const statements=(question.statements ?? []).map((statement:any)=>Object.freeze({...statement,text:localizeStatement(laneId,String(statement.text ?? ""),language)}));
  const prompt=targetPrompt(laneId,question,language);
  const stem=`${scenarioLead(laneId,question,language)} ${prompt}`.trim();
  const options=(question.options ?? []).map((option:any)=>{
    const semantic=String(option.semanticClass ?? "");
    const value=OPTION_TEXT[language][semantic as keyof typeof OPTION_TEXT.hi];
    if(!value) throw new Error(`${laneId}: unsupported sufficiency semantic class '${semantic}' for ${language}`);
    return Object.freeze({...option,value});
  });
  return Object.freeze({
    ...question,
    language,
    locale: language === "hi" ? "hi-IN" : "pa-IN",
    stem: `${stem}\n\nStatement I: ${statements[0]?.text ?? ""}\nStatement II: ${statements[1]?.text ?? ""}`,
    questionPrompt: prompt,
    statements:Object.freeze(statements),
    options:Object.freeze(options),
    explanation: localizedExplanation(question,language),
    localization: Object.freeze({
      authority:"DSF_CP018_REASONING_HI_PA_LOCALIZATION_REVIEW_V1",
      sourceLanguage:"en",
      language,
      semanticParity:"SOURCE_PROOF_PRESERVED",
      correctIndexPreserved:true,
      canonicalAnswerPreserved:true,
      reviewOnly:true,
      humanLanguageReviewRequired:true,
    }),
  });
}
