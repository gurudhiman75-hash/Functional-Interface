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

function localizeRankingSubject(value:string, language:DsfReasoningLocalizedLanguage):string {
  const key=value.toLowerCase();
  const map:Record<string,[string,string]>={
    "target person":["लक्षित व्यक्ति","ਲਕਸ਼ਿਤ ਵਿਅਕਤੀ"],
    candidate:["अभ्यर्थी","ਉਮੀਦਵਾਰ"],
    runner:["धावक","ਦੌੜਾਕ"],
    student:["विद्यार्थी","ਵਿਦਿਆਰਥੀ"],
    person:["व्यक्ति","ਵਿਅਕਤੀ"],
  };
  return map[key] ? t(language,...map[key]!) : value;
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
  m=text.match(/^The (rank from the opposite end|total number of people|number of people after the person|rank from the starting end) is exactly (\d+)\.$/i);
  if(m){
    const labels:Record<string,[string,string]>={
      "rank from the opposite end":["दूसरे सिरे से रैंक","ਦੂਜੇ ਸਿਰੇ ਤੋਂ ਰੈਂਕ"],
      "total number of people":["कुल व्यक्तियों की संख्या","ਕੁੱਲ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ"],
      "number of people after the person":["व्यक्ति के बाद लोगों की संख्या","ਵਿਅਕਤੀ ਤੋਂ ਬਾਅਦ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ"],
      "rank from the starting end":["आरंभिक सिरे से रैंक","ਸ਼ੁਰੂਆਤੀ ਸਿਰੇ ਤੋਂ ਰੈਂਕ"],
    };
    const pair=labels[m[1]!.toLowerCase()]!;
    return t(language,`${pair[0]} ठीक ${m[2]} है।`,`${pair[1]} ਬਿਲਕੁਲ ${m[2]} ਹੈ।`);
  }
  m=text.match(/^The (candidate|runner|student|person) is (\d+)(?:st|nd|rd|th) from the (starting|opposite) end\.$/i);
  if(m) return t(language,`${localizeRankingSubject(m[1]!,language)} ${side(m[3]!)} से ${ordinal(m[2]!,language)} है।`,`${localizeRankingSubject(m[1]!,language)} ${side(m[3]!)} ਤੋਂ ${ordinal(m[2]!,language)} ਹੈ।`);
  m=text.match(/^Exactly (\d+) (person is|people are) (before|after) the (candidate|runner|student|person)\.$/i);
  if(m){
    const where=m[3]!.toLowerCase()==="before" ? t(language,"से पहले","ਤੋਂ ਪਹਿਲਾਂ") : t(language,"के बाद","ਤੋਂ ਬਾਅਦ");
    return t(language,`${localizeRankingSubject(m[4]!,language)} ${where} ठीक ${m[1]} व्यक्ति ${Number(m[1])===1?"है":"हैं"}।`,`${localizeRankingSubject(m[4]!,language)} ${where} ਬਿਲਕੁਲ ${m[1]} ਵਿਅਕਤੀ ${Number(m[1])===1?"ਹੈ":"ਹਨ"}।`);
  }
  m=text.match(/^(\d+) people are in the complete order, and (\d+) (person is|people are) after the (candidate|runner|student|person)\.$/i);
  if(m) return t(language,`पूरे क्रम में ${m[1]} व्यक्ति हैं और ${localizeRankingSubject(m[4]!,language)} के बाद ${m[2]} व्यक्ति हैं।`,`ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ${m[1]} ਵਿਅਕਤੀ ਹਨ ਅਤੇ ${localizeRankingSubject(m[4]!,language)} ਤੋਂ ਬਾਅਦ ${m[2]} ਵਿਅਕਤੀ ਹਨ।`);
  m=text.match(/^The (candidate|runner|student|person)'s rank from the (starting|opposite) end is at (most|least) (\d+)\.$/i);
  if(m){
    const bound=m[3]!.toLowerCase()==="most" ? t(language,"अधिकतम","ਵੱਧ ਤੋਂ ਵੱਧ") : t(language,"कम से कम","ਘੱਟੋ-ਘੱਟ");
    return t(language,`${localizeRankingSubject(m[1]!,language)} की ${side(m[2]!)} से रैंक ${bound} ${m[4]} है।`,`${localizeRankingSubject(m[1]!,language)} ਦੀ ${side(m[2]!)} ਤੋਂ ਰੈਂਕ ${bound} ${m[4]} ਹੈ।`);
  }
  return undefined;
}

function localizeDirectionValue(value: string, language: DsfReasoningLocalizedLanguage): string {
  const normalized=value.trim().toLowerCase();
  const map: Record<string,[string,string]> = {
    north:["उत्तर","ਉੱਤਰ"], south:["दक्षिण","ਦੱਖਣ"], east:["पूर्व","ਪੂਰਬ"], west:["पश्चिम","ਪੱਛਮ"],
    left:["बाएँ","ਖੱਬੇ"], right:["दाएँ","ਸੱਜੇ"],
    positive:["धनात्मक","ਧਨਾਤਮਕ"], negative:["ऋणात्मक","ਰਿਣਾਤਮਕ"], zero:["शून्य","ਸਿਫ਼ਰ"],
  };
  return map[normalized] ? t(language,...map[normalized]!) : value;
}

function localizeDirectionStatement(text: string, language: DsfReasoningLocalizedLanguage): string | undefined {
  let m: RegExpMatchArray | null;
  m=text.match(/^The (final facing direction|final coordinates from the starting point|shortest distance from the starting point) is (.+)\.$/i);
  if(m){
    const label: Record<string,[string,string]>={
      "final facing direction":["अंतिम दिशा","ਅੰਤਿਮ ਦਿਸ਼ਾ"],
      "final coordinates from the starting point":["आरंभिक बिंदु से अंतिम निर्देशांक","ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ਅੰਤਿਮ ਕੋਆਰਡੀਨੇਟ"],
      "shortest distance from the starting point":["आरंभिक बिंदु से न्यूनतम दूरी","ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ਘੱਟੋ-ਘੱਟ ਦੂਰੀ"],
    };
    const pair=label[m[1]!.toLowerCase()]!;
    return t(language,`${pair[0]} ${localizeDirectionValue(m[2]!,language)} है।`,`${pair[1]} ${localizeDirectionValue(m[2]!,language)} ਹੈ।`);
  }
  m=text.match(/^The person starts facing (North|South|East|West)\.$/i);
  if(m) return t(language,`व्यक्ति शुरुआत में ${localizeDirectionValue(m[1]!,language)} की ओर मुख किए है।`,`ਵਿਅਕਤੀ ਸ਼ੁਰੂ ਵਿੱਚ ${localizeDirectionValue(m[1]!,language)} ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਖੜ੍ਹਾ ਹੈ।`);
  m=text.match(/^After the (first|second) movement, the person turns (LEFT|RIGHT|left|right)\.$/i);
  if(m){
    const move=m[1]!.toLowerCase()==="first" ? t(language,"पहली","ਪਹਿਲੀ") : t(language,"दूसरी","ਦੂਜੀ");
    return t(language,`${move} चाल के बाद व्यक्ति ${localizeDirectionValue(m[2]!,language)} मुड़ता है।`,`${move} ਚਾਲ ਤੋਂ ਬਾਅਦ ਵਿਅਕਤੀ ${localizeDirectionValue(m[2]!,language)} ਮੁੜਦਾ ਹੈ।`);
  }
  m=text.match(/^The two turns, in order, are (LEFT|RIGHT|left|right) and then (LEFT|RIGHT|left|right)\.$/i);
  if(m) return t(language,`क्रम से दोनों मोड़ ${localizeDirectionValue(m[1]!,language)} और फिर ${localizeDirectionValue(m[2]!,language)} हैं।`,`ਕ੍ਰਮਵਾਰ ਦੋਵੇਂ ਮੋੜ ${localizeDirectionValue(m[1]!,language)} ਅਤੇ ਫਿਰ ${localizeDirectionValue(m[2]!,language)} ਹਨ।`);
  m=text.match(/^The (first|second|third) movement is ([\d.]+) m\.$/i);
  if(m){
    const pos=m[1]!.toLowerCase()==="first" ? t(language,"पहली","ਪਹਿਲੀ") : m[1]!.toLowerCase()==="second" ? t(language,"दूसरी","ਦੂਜੀ") : t(language,"तीसरी","ਤੀਜੀ");
    return t(language,`${pos} चाल ${m[2]} मीटर की है।`,`${pos} ਚਾਲ ${m[2]} ਮੀਟਰ ਦੀ ਹੈ।`);
  }
  m=text.match(/^The first two movement lengths are ([\d.]+) m and ([\d.]+) m respectively\.$/i);
  if(m) return t(language,`पहली दो चालों की लंबाई क्रमशः ${m[1]} मीटर और ${m[2]} मीटर है।`,`ਪਹਿਲੀਆਂ ਦੋ ਚਾਲਾਂ ਦੀ ਲੰਬਾਈ ਕ੍ਰਮਵਾਰ ${m[1]} ਮੀਟਰ ਅਤੇ ${m[2]} ਮੀਟਰ ਹੈ।`);
  m=text.match(/^The net (east-west|north-south) displacement is ([\d.]+) m (with no east-west shift|with no north-south shift|to the east|to the west|to the north|to the south)\.$/i);
  if(m){
    const axis=m[1]!.toLowerCase()==="east-west" ? t(language,"पूर्व-पश्चिम","ਪੂਰਬ-ਪੱਛਮ") : t(language,"उत्तर-दक्षिण","ਉੱਤਰ-ਦੱਖਣ");
    const dir=m[3]!.toLowerCase();
    if(dir.startsWith("with no")) return t(language,`${axis} दिशा में शुद्ध विस्थापन ${m[2]} मीटर है; इस अक्ष पर कोई खिसकाव नहीं है।`,`${axis} ਦਿਸ਼ਾ ਵਿੱਚ ਕੁੱਲ ਵਿਸਥਾਪਨ ${m[2]} ਮੀਟਰ ਹੈ; ਇਸ ਧੁਰੇ 'ਤੇ ਕੋਈ ਖਿਸਕਾਅ ਨਹੀਂ ਹੈ।`);
    const localized=dir.replace(/^to the /,"");
    return t(language,`${axis} दिशा में शुद्ध विस्थापन ${m[2]} मीटर ${localizeDirectionValue(localized,language)} की ओर है।`,`${axis} ਦਿਸ਼ਾ ਵਿੱਚ ਕੁੱਲ ਵਿਸਥਾਪਨ ${m[2]} ਮੀਟਰ ${localizeDirectionValue(localized,language)} ਵੱਲ ਹੈ।`);
  }
  m=text.match(/^The net displacement components are (-?[\d.]+) m on the east-west axis and (-?[\d.]+) m on the north-south axis\.$/i);
  if(m) return t(language,`शुद्ध विस्थापन के घटक पूर्व-पश्चिम अक्ष पर ${m[1]} मीटर और उत्तर-दक्षिण अक्ष पर ${m[2]} मीटर हैं।`,`ਕੁੱਲ ਵਿਸਥਾਪਨ ਦੇ ਘਟਕ ਪੂਰਬ-ਪੱਛਮ ਧੁਰੇ 'ਤੇ ${m[1]} ਮੀਟਰ ਅਤੇ ਉੱਤਰ-ਦੱਖਣ ਧੁਰੇ 'ਤੇ ${m[2]} ਮੀਟਰ ਹਨ।`);
  m=text.match(/^After all movements, the person is facing (North|South|East|West)\.$/i);
  if(m) return t(language,`सभी चालों के बाद व्यक्ति ${localizeDirectionValue(m[1]!,language)} की ओर मुख किए है।`,`ਸਾਰੀਆਂ ਚਾਲਾਂ ਤੋਂ ਬਾਅਦ ਵਿਅਕਤੀ ${localizeDirectionValue(m[1]!,language)} ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਖੜ੍ਹਾ ਹੈ।`);
  m=text.match(/^The total path length travelled is ([\d.]+) m\.$/i);
  if(m) return t(language,`कुल तय की गई दूरी ${m[1]} मीटर है।`,`ਕੁੱਲ ਤੈਅ ਕੀਤੀ ਦੂਰੀ ${m[1]} ਮੀਟਰ ਹੈ।`);
  m=text.match(/^The final (east-west|north-south) coordinate is (positive|negative|zero)\.$/i);
  if(m){
    const axis=m[1]!.toLowerCase()==="east-west" ? t(language,"पूर्व-पश्चिम","ਪੂਰਬ-ਪੱਛਮ") : t(language,"उत्तर-दक्षिण","ਉੱਤਰ-ਦੱਖਣ");
    return t(language,`अंतिम ${axis} निर्देशांक ${localizeDirectionValue(m[2]!,language)} है।`,`ਅੰਤਿਮ ${axis} ਕੋਆਰਡੀਨੇਟ ${localizeDirectionValue(m[2]!,language)} ਹੈ।`);
  }
  m=text.match(/^The net displacement components are (-?[\d.]+) m east-west and (-?[\d.]+) m north-south\.$/i);
  if(m) return t(language,`शुद्ध विस्थापन के घटक पूर्व-पश्चिम दिशा में ${m[1]} मीटर और उत्तर-दक्षिण दिशा में ${m[2]} मीटर हैं।`,`ਕੁੱਲ ਵਿਸਥਾਪਨ ਦੇ ਘਟਕ ਪੂਰਬ-ਪੱਛਮ ਦਿਸ਼ਾ ਵਿੱਚ ${m[1]} ਮੀਟਰ ਅਤੇ ਉੱਤਰ-ਦੱਖਣ ਦਿਸ਼ਾ ਵਿੱਚ ${m[2]} ਮੀਟਰ ਹਨ।`);
  m=text.match(/^The total path length is ([\d.]+) m\.$/i);
  if(m) return t(language,`कुल तय की गई दूरी ${m[1]} मीटर है।`,`ਕੁੱਲ ਤੈਅ ਕੀਤੀ ਦੂਰੀ ${m[1]} ਮੀਟਰ ਹੈ।`);
  return undefined;
}

function localizeRelation(value: string, language: DsfReasoningLocalizedLanguage): string {
  const key=value.trim().toLowerCase().replace(/-type$/,"");
  const map: Record<string,[string,string]>={
    father:["पिता","ਪਿਤਾ"], mother:["माता","ਮਾਤਾ"], son:["पुत्र","ਪੁੱਤਰ"], daughter:["पुत्री","ਧੀ"],
    brother:["भाई","ਭਰਾ"], sister:["बहन","ਭੈਣ"], husband:["पति","ਪਤੀ"], wife:["पत्नी","ਪਤਨੀ"],
    parent:["माता-पिता","ਮਾਤਾ-ਪਿਤਾ"], child:["संतान","ਸੰਤਾਨ"], sibling:["भाई-बहन","ਭੈਣ-ਭਰਾ"], spouse:["जीवनसाथी","ਜੀਵਨ ਸਾਥੀ"],
    grandfather:["दादा/नाना","ਦਾਦਾ/ਨਾਨਾ"], grandmother:["दादी/नानी","ਦਾਦੀ/ਨਾਨੀ"], grandson:["पोता/नाती","ਪੋਤਾ/ਦੋਹਤਾ"], granddaughter:["पोती/नातिन","ਪੋਤੀ/ਦੋਹਤੀ"],
    "great grandfather":["परदादा/परनाना","ਪਰਦਾਦਾ/ਪਰਨਾਨਾ"], "great grandmother":["परदादी/परनानी","ਪਰਦਾਦੀ/ਪਰਨਾਨੀ"],
    "great grandson":["परपोता/परनाती","ਪਰਪੋਤਾ/ਪਰਦੋਹਤਾ"], "great granddaughter":["परपोती/परनातिन","ਪਰਪੋਤੀ/ਪਰਦੋਹਤੀ"],
    uncle:["चाचा/मामा","ਚਾਚਾ/ਮਾਮਾ"], aunt:["चाची/मामी","ਚਾਚੀ/ਮਾਮੀ"], nephew:["भतीजा/भांजा","ਭਤੀਜਾ/ਭਾਣਜਾ"], niece:["भतीजी/भांजी","ਭਤੀਜੀ/ਭਾਣਜੀ"], cousin:["चचेरा/ममेरा भाई-बहन","ਚਚੇਰਾ/ਮਮੇਰਾ ਭੈਣ-ਭਰਾ"],
    "father in law":["ससुर","ਸਹੁਰਾ"], "mother in law":["सास","ਸੱਸ"], "son in law":["दामाद","ਜਵਾਈ"], "daughter in law":["बहू","ਨੂੰਹ"],
    "brother in law":["बहनोई/साला","ਜੀਜਾ/ਸਾਲਾ"], "sister in law":["भाभी/साली","ਭਾਬੀ/ਸਾਲੀ"],
    male:["पुरुष","ਪੁਰਸ਼"], female:["महिला","ਇਸਤਰੀ"], unknown:["अज्ञात","ਅਣਜਾਣ"],
  };
  return map[key] ? t(language,...map[key]!) : value;
}

function localizeBloodStatement(text: string, language: DsfReasoningLocalizedLanguage): string | undefined {
  const parts=text.trim().split(/(?<=\.)\s+/u).filter(Boolean);
  if(parts.length>1){
    const localized=parts.map((part)=>localizeBloodStatement(part,language));
    if(localized.every((part): part is string => Boolean(part))) return localized.join(" ");
  }
  let m:RegExpMatchArray|null;
  m=text.match(/^([PXQ]) is the (father|mother|son|daughter|brother|sister|husband|wife|grandfather|grandmother|grandson|granddaughter|great grandfather|great grandmother|great grandson|great granddaughter|uncle|aunt|nephew|niece|cousin|father in law|mother in law|son in law|daughter in law|brother in law|sister in law) of ([PXQ])\.$/i);
  if(m) return t(language,`${m[1]} , ${m[3]} का ${localizeRelation(m[2]!,language)} है।`,`${m[1]}, ${m[3]} ਦਾ ${localizeRelation(m[2]!,language)} ਹੈ।`);
  m=text.match(/^([PXQ]) is (male|female)\.$/i);
  if(m) return t(language,`${m[1]} ${localizeRelation(m[2]!,language)} है।`,`${m[1]} ${localizeRelation(m[2]!,language)} ਹੈ।`);
  m=text.match(/^The gender of ([PXQ]) is not fixed\.$/i);
  if(m) return t(language,`${m[1]} का लिंग निश्चित नहीं है।`,`${m[1]} ਦਾ ਲਿੰਗ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ।`);
  m=text.match(/^The gender of ([PXQ]) is not fixed by the available direct-relation wording\.$/i);
  if(m) return t(language,`उपलब्ध प्रत्यक्ष संबंध से ${m[1]} का लिंग निश्चित नहीं होता।`,`ਉਪਲਬਧ ਸਿੱਧੇ ਸੰਬੰਧ ਤੋਂ ${m[1]} ਦਾ ਲਿੰਗ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੁੰਦਾ।`);
  m=text.match(/^The stated (P-X|X-Q) clue is a (parent|child|sibling|spouse)-type relation\.$/i);
  if(m) return t(language,`दिया गया ${m[1]} संकेत ${localizeRelation(m[2]!,language)} संबंध दर्शाता है।`,`ਦਿੱਤਾ ਗਿਆ ${m[1]} ਸੰਕੇਤ ${localizeRelation(m[2]!,language)} ਸੰਬੰਧ ਦਰਸਾਉਂਦਾ ਹੈ।`);
  m=text.match(/^The (P-X|X-Q) clue is stated with ([PXQ]) as the subject and ([PXQ]) as the reference person\.$/i);
  if(m) return t(language,`${m[1]} संकेत में ${m[2]} मुख्य व्यक्ति और ${m[3]} संदर्भ व्यक्ति है।`,`${m[1]} ਸੰਕੇਤ ਵਿੱਚ ${m[2]} ਮੁੱਖ ਵਿਅਕਤੀ ਅਤੇ ${m[3]} ਹਵਾਲਾ ਵਿਅਕਤੀ ਹੈ।`);
  m=text.match(/^The relation between ([PXQ]) and ([PXQ]) is a (parent-child|sibling|spouse) relation\.$/i);
  if(m){
    const relation=m[3]!.toLowerCase()==="parent-child" ? t(language,"माता-पिता और संतान","ਮਾਤਾ-ਪਿਤਾ ਅਤੇ ਸੰਤਾਨ") : m[3]!.toLowerCase()==="sibling" ? t(language,"भाई-बहन","ਭੈਣ-ਭਰਾ") : t(language,"वैवाहिक","ਵਿਆਹਕ");
    return t(language,`${m[1]} और ${m[2]} के बीच ${relation} संबंध है।`,`${m[1]} ਅਤੇ ${m[2]} ਵਿਚਕਾਰ ${relation} ਰਿਸ਼ਤਾ ਹੈ।`);
  }
  m=text.match(/^The (P-X|X-Q) link is (a blood relation|a spouse relation)\.$/i);
  if(m) return /blood/i.test(m[2]!)
    ? t(language,`${m[1]} संबंध रक्त संबंध है।`,`${m[1]} ਸੰਬੰਧ ਖੂਨ ਦਾ ਰਿਸ਼ਤਾ ਹੈ।`)
    : t(language,`${m[1]} संबंध वैवाहिक संबंध है।`,`${m[1]} ਸੰਬੰਧ ਵਿਆਹਕ ਰਿਸ਼ਤਾ ਹੈ।`);
  // BLR source-normalized direct clues use the same compact relation sentence family.
  m=text.match(/^([PXQ])(?: is|'s) (?:the )?(father|mother|son|daughter|brother|sister|husband|wife|grandfather|grandmother|grandson|granddaughter|great grandfather|great grandmother|great grandson|great granddaughter|uncle|aunt|nephew|niece|cousin|father in law|mother in law|son in law|daughter in law|brother in law|sister in law)(?: of)? ([PXQ])\.?$/i);
  if(m) return t(language,`${m[1]} , ${m[3]} का ${localizeRelation(m[2]!,language)} है।`,`${m[1]}, ${m[3]} ਦਾ ${localizeRelation(m[2]!,language)} ਹੈ।`);
  return undefined;
}

function localizeSeatName(value:string, language:DsfReasoningLocalizedLanguage):string {
  const map:Record<string,[string,string]>={
    Aman:["अमन","ਅਮਨ"], Bina:["बीना","ਬੀਨਾ"], Charan:["चरण","ਚਰਨ"], Diya:["दिया","ਦੀਆ"], Eshan:["ईशान","ਈਸ਼ਾਨ"],
  };
  return map[value] ? t(language,...map[value]!) : value;
}

function localizeSeatOrdinal(value:string, language:DsfReasoningLocalizedLanguage):string {
  const map:Record<string,[string,string]>={
    first:["पहली","ਪਹਿਲੀ"], second:["दूसरी","ਦੂਜੀ"], third:["तीसरी","ਤੀਜੀ"], fourth:["चौथी","ਚੌਥੀ"], fifth:["पाँचवीं","ਪੰਜਵੀਂ"],
  };
  return map[value.toLowerCase()] ? t(language,...map[value.toLowerCase()]!) : value;
}

function localizeSeatingStatement(text:string, language:DsfReasoningLocalizedLanguage):string|undefined {
  let m:RegExpMatchArray|null;
  m=text.match(/^(Aman|Bina|Charan|Diya|Eshan) occupies the (first|second|third|fourth|fifth) seat from the left end\.$/i);
  if(m) return t(language,`${localizeSeatName(m[1]!,language)} बाएँ सिरे से ${localizeSeatOrdinal(m[2]!,language)} सीट पर बैठा/बैठी है।`,`${localizeSeatName(m[1]!,language)} ਖੱਬੇ ਸਿਰੇ ਤੋਂ ${localizeSeatOrdinal(m[2]!,language)} ਸੀਟ 'ਤੇ ਬੈਠਾ/ਬੈਠੀ ਹੈ।`);
  m=text.match(/^(\d+) (?:person sits|people sit) to the left of (Aman|Bina|Charan|Diya|Eshan) when positions are counted from the left end\.$/i);
  if(m) return t(language,`बाएँ सिरे से गिनने पर ${localizeSeatName(m[2]!,language)} के बाएँ ${m[1]} व्यक्ति बैठे हैं।`,`ਖੱਬੇ ਸਿਰੇ ਤੋਂ ਗਿਣਨ 'ਤੇ ${localizeSeatName(m[2]!,language)} ਦੇ ਖੱਬੇ ${m[1]} ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ।`);
  m=text.match(/^(Aman|Bina|Charan|Diya|Eshan) sits at one of the two ends\.$/i);
  if(m) return t(language,`${localizeSeatName(m[1]!,language)} दोनों सिरों में से किसी एक सिरे पर बैठा/बैठी है।`,`${localizeSeatName(m[1]!,language)} ਦੋਵੇਂ ਸਿਰਿਆਂ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਸਿਰੇ 'ਤੇ ਬੈਠਾ/ਬੈਠੀ ਹੈ।`);
  m=text.match(/^(Aman|Bina|Charan|Diya|Eshan) sits in the middle(?: seat)?\.$/i);
  if(m) return t(language,`${localizeSeatName(m[1]!,language)} बीच वाली सीट पर बैठा/बैठी है।`,`${localizeSeatName(m[1]!,language)} ਵਿਚਕਾਰਲੀ ਸੀਟ 'ਤੇ ਬੈਠਾ/ਬੈਠੀ ਹੈ।`);
  m=text.match(/^(Aman|Bina|Charan|Diya|Eshan) and (Aman|Bina|Charan|Diya|Eshan) sit next to each other\.$/i);
  if(m) return t(language,`${localizeSeatName(m[1]!,language)} और ${localizeSeatName(m[2]!,language)} एक-दूसरे के साथ वाली सीटों पर बैठे हैं।`,`${localizeSeatName(m[1]!,language)} ਅਤੇ ${localizeSeatName(m[2]!,language)} ਇਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਵਾਲੀਆਂ ਸੀਟਾਂ 'ਤੇ ਬੈਠੇ ਹਨ।`);
  m=text.match(/^(\d+) (?:person sits|people sit) between (Aman|Bina|Charan|Diya|Eshan) and (Aman|Bina|Charan|Diya|Eshan)\.$/i);
  if(m) return t(language,`${localizeSeatName(m[2]!,language)} और ${localizeSeatName(m[3]!,language)} के बीच ${m[1]} व्यक्ति बैठा है/बैठे हैं।`,`${localizeSeatName(m[2]!,language)} ਅਤੇ ${localizeSeatName(m[3]!,language)} ਦੇ ਵਿਚਕਾਰ ${m[1]} ਵਿਅਕਤੀ ਬੈਠਾ ਹੈ/ਬੈਠੇ ਹਨ।`);
  m=text.match(/^(Aman|Bina|Charan|Diya|Eshan) and (Aman|Bina|Charan|Diya|Eshan) are not adjacent\.$/i);
  if(m) return t(language,`${localizeSeatName(m[1]!,language)} और ${localizeSeatName(m[2]!,language)} साथ-साथ नहीं बैठे हैं।`,`${localizeSeatName(m[1]!,language)} ਅਤੇ ${localizeSeatName(m[2]!,language)} ਨਾਲ-ਨਾਲ ਨਹੀਂ ਬੈਠੇ ਹਨ।`);
  m=text.match(/^(Aman|Bina|Charan|Diya|Eshan) sits immediately to the (left|right) of (Aman|Bina|Charan|Diya|Eshan)\.$/i);
  if(m){
    const dir=m[2]!.toLowerCase()==="left" ? t(language,"बाएँ","ਖੱਬੇ") : t(language,"दाएँ","ਸੱਜੇ");
    return t(language,`${localizeSeatName(m[1]!,language)}, ${localizeSeatName(m[3]!,language)} के ठीक ${dir} बैठा/बैठी है।`,`${localizeSeatName(m[1]!,language)}, ${localizeSeatName(m[3]!,language)} ਦੇ ਤੁਰੰਤ ${dir} ਬੈਠਾ/ਬੈਠੀ ਹੈ।`);
  }
  m=text.match(/^(Aman|Bina|Charan|Diya|Eshan) sits (\d+|one|two|three|four) places? to the (left|right) of (Aman|Bina|Charan|Diya|Eshan)\.$/i);
  if(m){
    const countMap:Record<string,[string,string]>={one:["एक","ਇੱਕ"],two:["दो","ਦੋ"],three:["तीन","ਤਿੰਨ"],four:["चार","ਚਾਰ"]};
    const token=m[2]!.toLowerCase();
    const count=/^\d+$/.test(token) ? token : t(language,...countMap[token]!);
    const dir=m[3]!.toLowerCase()==="left" ? t(language,"बाएँ","ਖੱਬੇ") : t(language,"दाएँ","ਸੱਜੇ");
    return t(language,`${localizeSeatName(m[1]!,language)}, ${localizeSeatName(m[4]!,language)} से ${count} स्थान ${dir} बैठा/बैठी है।`,`${localizeSeatName(m[1]!,language)}, ${localizeSeatName(m[4]!,language)} ਤੋਂ ${count} ਥਾਂ ${dir} ਬੈਠਾ/ਬੈਠੀ ਹੈ।`);
  }
  m=text.match(/^Aman is (first|second|third|fourth|fifth) from the left end\.$/i);
  if(m) return t(language,`अमन बाएँ सिरे से ${localizeSeatOrdinal(m[1]!,language)} स्थान पर है।`,`ਅਮਨ ਖੱਬੇ ਸਿਰੇ ਤੋਂ ${localizeSeatOrdinal(m[1]!,language)} ਥਾਂ 'ਤੇ ਹੈ।`);
  return undefined;
}

function localizeCalendarStatement(text:string, language:DsfReasoningLocalizedLanguage):string|undefined {
  let m:RegExpMatchArray|null;
  m=text.match(/^The starting day is (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\.$/i);
  if(m) return t(language,`आरंभिक वार ${localizeWeekday(m[1]!,language)} है।`,`ਸ਼ੁਰੂਆਤੀ ਵਾਰ ${localizeWeekday(m[1]!,language)} ਹੈ।`);
  m=text.match(/^The number of days leaves remainder (\d+) when divided by 7\.$/i);
  if(m) return t(language,`दिनों की संख्या को 7 से भाग देने पर शेषफल ${m[1]} है।`,`ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦੇਣ 'ਤੇ ਬਾਕੀ ${m[1]} ਹੈ।`);
  m=text.match(/^The resulting day is (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\.$/i);
  if(m) return t(language,`परिणामी वार ${localizeWeekday(m[1]!,language)} है।`,`ਨਤੀਜੇ ਵਾਲਾ ਵਾਰ ${localizeWeekday(m[1]!,language)} ਹੈ।`);
  m=text.match(/^The starting day is (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday), and the day count leaves remainder (\d+) on division by 7\.$/i);
  if(m) return t(language,`आरंभिक वार ${localizeWeekday(m[1]!,language)} है और दिनों की संख्या को 7 से भाग देने पर शेषफल ${m[2]} है।`,`ਸ਼ੁਰੂਆਤੀ ਵਾਰ ${localizeWeekday(m[1]!,language)} ਹੈ ਅਤੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦੇਣ 'ਤੇ ਬਾਕੀ ${m[2]} ਹੈ।`);
  m=text.match(/^The resulting day is (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday), and the day count leaves remainder (\d+) on division by 7\.$/i);
  if(m) return t(language,`परिणामी वार ${localizeWeekday(m[1]!,language)} है और दिनों की संख्या को 7 से भाग देने पर शेषफल ${m[2]} है।`,`ਨਤੀਜੇ ਵਾਲਾ ਵਾਰ ${localizeWeekday(m[1]!,language)} ਹੈ ਅਤੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦੇਣ 'ਤੇ ਬਾਕੀ ${m[2]} ਹੈ।`);
  m=text.match(/^The movement starts on (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday) and ends on (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\.$/i);
  if(m) return t(language,`गणना ${localizeWeekday(m[1]!,language)} से शुरू होकर ${localizeWeekday(m[2]!,language)} पर समाप्त होती है।`,`ਗਿਣਤੀ ${localizeWeekday(m[1]!,language)} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ${localizeWeekday(m[2]!,language)} 'ਤੇ ਖਤਮ ਹੁੰਦੀ ਹੈ।`);
  m=text.match(/^The starting day is either (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday) or (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\.$/i);
  if(m) return t(language,`आरंभिक वार ${localizeWeekday(m[1]!,language)} या ${localizeWeekday(m[2]!,language)} है।`,`ਸ਼ੁਰੂਆਤੀ ਵਾਰ ${localizeWeekday(m[1]!,language)} ਜਾਂ ${localizeWeekday(m[2]!,language)} ਹੈ।`);
  m=text.match(/^The remainder on division of the day count by 7 is either (\d+) or (\d+)\.$/i);
  if(m) return t(language,`दिनों की संख्या को 7 से भाग देने पर शेषफल ${m[1]} या ${m[2]} है।`,`ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦੇਣ 'ਤੇ ਬਾਕੀ ${m[1]} ਜਾਂ ${m[2]} ਹੈ।`);
  m=text.match(/^The resulting day is either (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday) or (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\.$/i);
  if(m) return t(language,`परिणामी वार ${localizeWeekday(m[1]!,language)} या ${localizeWeekday(m[2]!,language)} है।`,`ਨਤੀਜੇ ਵਾਲਾ ਵਾਰ ${localizeWeekday(m[1]!,language)} ਜਾਂ ${localizeWeekday(m[2]!,language)} ਹੈ।`);
  m=text.match(/^The day count leaves remainder (\d+) on division by 7\.$/i);
  if(m) return t(language,`दिनों की संख्या को 7 से भाग देने पर शेषफल ${m[1]} है।`,`ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦੇਣ 'ਤੇ ਬਾਕੀ ${m[1]} ਹੈ।`);
  m=text.match(/^The remainder is either (\d+) or (\d+)\.$/i);
  if(m) return t(language,`शेषफल ${m[1]} या ${m[2]} है।`,`ਬਾਕੀ ${m[1]} ਜਾਂ ${m[2]} ਹੈ।`);
  return undefined;
}

function localizeInequalityStatement(text:string, language:DsfReasoningLocalizedLanguage):string|undefined {
  let m:RegExpMatchArray|null;
  const rel=(left:string,op:string,right:string)=>{
    const phrase:Record<string,[string,string]>={
      ">":["से बड़ा है","ਤੋਂ ਵੱਡਾ ਹੈ"], "<":["से छोटा है","ਤੋਂ ਛੋਟਾ ਹੈ"], "=":["के बराबर है","ਦੇ ਬਰਾਬਰ ਹੈ"],
    };
    const pair=phrase[op];
    return pair ? t(language,`${left} ${pair[0]} ${right}।`,`${left} ${pair[1]} ${right}।`) : `${left} ${op} ${right}.`;
  };
  m=text.match(/^([ABCD])\s*([<>=])\s*([ABCD])\.$/u);
  if(m) return rel(m[1]!,m[2]!,m[3]!);
  m=text.match(/^([ABCD])\s*([<>=])\s*([ABCD]) and ([ABCD])\s*([<>=])\s*([ABCD])\.$/u);
  if(m) return t(language,
    `${rel(m[1]!,m[2]!,m[3]!).replace(/।$/u,"")} और ${rel(m[4]!,m[5]!,m[6]!)}`,
    `${rel(m[1]!,m[2]!,m[3]!).replace(/।$/u,"")} ਅਤੇ ${rel(m[4]!,m[5]!,m[6]!)}`);
  m=text.match(/^([ABCD]) is (not less than|less than) ([ABCD])\.$/i);
  if(m) return m[2]!.toLowerCase()==="not less than"
    ? t(language,`${m[1]} ${m[3]} से छोटा नहीं है।`,`${m[1]} ${m[3]} ਤੋਂ ਛੋਟਾ ਨਹੀਂ ਹੈ।`)
    : t(language,`${m[1]} ${m[3]} से छोटा है।`,`${m[1]} ${m[3]} ਤੋਂ ਛੋਟਾ ਹੈ।`);
  m=text.match(/^A and D are (equal|not equal)\.$/i);
  if(m) return m[1]!.toLowerCase()==="equal"
    ? t(language,"A और D बराबर हैं।","A ਅਤੇ D ਬਰਾਬਰ ਹਨ।")
    : t(language,"A और D बराबर नहीं हैं।","A ਅਤੇ D ਬਰਾਬਰ ਨਹੀਂ ਹਨ।");
  return undefined;
}

function localizeCodingStatement(text:string, language:DsfReasoningLocalizedLanguage):string|undefined {
  if(text.includes(";")){
    const parts=text.split(";").map(part=>part.trim()).filter(Boolean);
    const localized=parts.map(part=>localizeCodingStatement(part.endsWith(".")?part:`${part}.`,language));
    if(localized.every((part):part is string=>Boolean(part))) return localized.join(" ");
  }
  let m:RegExpMatchArray|null;
  m=text.match(/^([A-Za-z]) is coded as (\d)\.$/u);
  if(m) return t(language,`${m[1]} का कोड ${m[2]} है।`,`${m[1]} ਦਾ ਕੋਡ ${m[2]} ਹੈ।`);
  m=text.match(/^The digit code of ([A-Za-z]) is (\d)\.$/u);
  if(m) return t(language,`${m[1]} का अंक-कोड ${m[2]} है।`,`${m[1]} ਦਾ ਅੰਕ-ਕੋਡ ${m[2]} ਹੈ।`);
  m=text.match(/^Digit (\d) represents ([A-Za-z])\.$/u);
  if(m) return t(language,`अंक ${m[1]}, ${m[2]} को दर्शाता है।`,`ਅੰਕ ${m[1]}, ${m[2]} ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।`);
  m=text.match(/^The mapping contains ([A-Za-z]) → (\d)\.$/u);
  if(m) return t(language,`कोड मैपिंग में ${m[1]} → ${m[2]} है।`,`ਕੋਡ ਮੈਪਿੰਗ ਵਿੱਚ ${m[1]} → ${m[2]} ਹੈ।`);
  m=text.match(/^([A-Za-z]) and ([A-Za-z]) are coded as (\d) and (\d), respectively\.$/u);
  if(m) return t(language,`${m[1]} और ${m[2]} के कोड क्रमशः ${m[3]} और ${m[4]} हैं।`,`${m[1]} ਅਤੇ ${m[2]} ਦੇ ਕੋਡ ਕ੍ਰਮਵਾਰ ${m[3]} ਅਤੇ ${m[4]} ਹਨ।`);
  m=text.match(/^The mapping contains ([A-Za-z]-\d) and ([A-Za-z]-\d)\.$/u);
  if(m) return t(language,`कोड मैपिंग में ${m[1]} और ${m[2]} हैं।`,`ਕੋਡ ਮੈਪਿੰਗ ਵਿੱਚ ${m[1]} ਅਤੇ ${m[2]} ਹਨ।`);
  m=text.match(/^([A-Za-z]) → (\d), while ([A-Za-z]) → (\d)\.$/u);
  if(m) return t(language,`${m[1]} → ${m[2]} और ${m[3]} → ${m[4]} है।`,`${m[1]} → ${m[2]} ਅਤੇ ${m[3]} → ${m[4]} ਹੈ।`);
  m=text.match(/^The digit assignments for ([A-Za-z]) and ([A-Za-z]) are (\d) and (\d), respectively\.$/u);
  if(m) return t(language,`${m[1]} और ${m[2]} को दिए गए अंक क्रमशः ${m[3]} और ${m[4]} हैं।`,`${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਦਿੱਤੇ ਅੰਕ ਕ੍ਰਮਵਾਰ ${m[3]} ਅਤੇ ${m[4]} ਹਨ।`);
  m=text.match(/^([A-Za-z]), ([A-Za-z]), ([A-Za-z]) are coded as (\d), (\d), (\d), respectively\.$/u);
  if(m) return t(language,`${m[1]}, ${m[2]} और ${m[3]} के कोड क्रमशः ${m[4]}, ${m[5]} और ${m[6]} हैं।`,`${m[1]}, ${m[2]} ਅਤੇ ${m[3]} ਦੇ ਕੋਡ ਕ੍ਰਮਵਾਰ ${m[4]}, ${m[5]} ਅਤੇ ${m[6]} ਹਨ।`);
  m=text.match(/^The mapping contains ([A-Za-z]-\d), ([A-Za-z]-\d), ([A-Za-z]-\d)\.$/u);
  if(m) return t(language,`कोड मैपिंग में ${m[1]}, ${m[2]} और ${m[3]} हैं।`,`ਕੋਡ ਮੈਪਿੰਗ ਵਿੱਚ ${m[1]}, ${m[2]} ਅਤੇ ${m[3]} ਹਨ।`);
  m=text.match(/^([A-Za-z]) → (\d), ([A-Za-z]) → (\d), and ([A-Za-z]) → (\d)\.$/u);
  if(m) return t(language,`${m[1]} → ${m[2]}, ${m[3]} → ${m[4]} और ${m[5]} → ${m[6]} है।`,`${m[1]} → ${m[2]}, ${m[3]} → ${m[4]} ਅਤੇ ${m[5]} → ${m[6]} ਹੈ।`);
  m=text.match(/^The digit assignments for ([A-Za-z]), ([A-Za-z]), ([A-Za-z]) are (\d), (\d), (\d), respectively\.$/u);
  if(m) return t(language,`${m[1]}, ${m[2]} और ${m[3]} को दिए गए अंक क्रमशः ${m[4]}, ${m[5]} और ${m[6]} हैं।`,`${m[1]}, ${m[2]} ਅਤੇ ${m[3]} ਨੂੰ ਦਿੱਤੇ ਅੰਕ ਕ੍ਰਮਵਾਰ ${m[4]}, ${m[5]} ਅਤੇ ${m[6]} ਹਨ।`);
  return undefined;
}

function localizeStatement(laneId: string, text: string, language: DsfReasoningLocalizedLanguage): string {
  if (laneId.includes("RANKING")) {
    const rendered=localizeRankingStatement(text,language);
    if(rendered) return rendered;
  }
  if (laneId.includes("DIRECTION")) {
    const rendered=localizeDirectionStatement(text,language);
    if(rendered) return rendered;
  }
  if (laneId.includes("BLOOD")) {
    const rendered=localizeBloodStatement(text,language);
    if(rendered) return rendered;
  }
  if (laneId.includes("SEATING")) {
    const rendered=localizeSeatingStatement(text,language);
    if(rendered) return rendered;
  }
  if (laneId.includes("CALENDAR")) {
    const rendered=localizeCalendarStatement(text,language);
    if(rendered) return rendered;
  }
  if (laneId.includes("INEQUALITY")) {
    const rendered=localizeInequalityStatement(text,language);
    if(rendered) return rendered;
  }
  if (laneId.includes("CODING")) {
    const rendered=localizeCodingStatement(text,language);
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


export function localizeDsfReasoningStatementText(
  laneId: string,
  text: string,
  language: DsfReasoningLocalizedLanguage,
): string {
  return localizeStatement(laneId, text, language);
}

export function localizeDsfReasoningStemParts(
  laneId: string,
  question: AnyQuestion,
  language: DsfReasoningLocalizedLanguage,
): Readonly<{ lead: string; prompt: string; stem: string }> {
  const lead = scenarioLead(laneId, question, language);
  const prompt = targetPrompt(laneId, question, language);
  return Object.freeze({ lead, prompt, stem: `${lead} ${prompt}`.trim() });
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
  const rawStatements = Array.isArray(question.statements) && question.statements.length === 2
    ? question.statements
    : [
        { id:"I", text:String(question.statementI ?? ""), statementFamily:question.statementIFamily },
        { id:"II", text:String(question.statementII ?? ""), statementFamily:question.statementIIFamily },
      ];
  const statements=rawStatements.map((statement:any)=>Object.freeze({...statement,text:localizeStatement(laneId,String(statement.text ?? ""),language)}));
  const prompt=targetPrompt(laneId,question,language);
  const stem=`${scenarioLead(laneId,question,language)} ${prompt}`.trim();
  const standardSemanticByIndex = [
    "STATEMENT_I_ONLY",
    "STATEMENT_II_ONLY",
    "EACH_STATEMENT_ALONE",
    "INSUFFICIENT_EVEN_TOGETHER",
    "BOTH_TOGETHER_ONLY",
  ] as const;
  const options=(question.options ?? []).map((option:any,index:number)=>{
    const record=typeof option==="object" && option!==null ? option : {};
    const semantic=String(record.semanticClass ?? standardSemanticByIndex[index] ?? "");
    const value=OPTION_TEXT[language][semantic as keyof typeof OPTION_TEXT.hi];
    if(!value) throw new Error(`${laneId}: unsupported sufficiency semantic class '${semantic}' for ${language}`);
    return Object.freeze(typeof option==="string"
      ? { key:String.fromCharCode(65+index), value, semanticClass:semantic, isCorrect:index===Number(question.correctIndex) }
      : {...option,value,semanticClass:semantic});
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
