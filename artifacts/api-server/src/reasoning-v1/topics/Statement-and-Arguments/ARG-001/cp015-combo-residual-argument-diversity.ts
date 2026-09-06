import { createHash } from "node:crypto";

export const ARG_CP015_COMBO_RESIDUAL_ARGUMENT_AUTHORITY = "ARG_CP015_COMBO_RESIDUAL_ARGUMENT_DIVERSITY_V1" as const;

type Question = Readonly<Record<string, any>>;
type Locale = "en-IN" | "hi-IN" | "pa-IN";

const ROMAN = ["I", "II", "III", "IV"] as const;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function localeOf(question: Question): Locale | undefined {
  if (question.locale === "hi-IN" || question.language === "hi") return "hi-IN";
  if (question.locale === "pa-IN" || question.language === "pa") return "pa-IN";
  if (question.locale === "en-IN" || question.language === "en") return "en-IN";
  return undefined;
}

function profileSlot(profile: string, difficulty: string, candidateSeed: string): number {
  if (profile === "BANKING_COMBO_3X5") return text(difficulty).toUpperCase() === "HARD" ? 1 : 0;
  const match = candidateSeed.match(/:CP015:BANKING_COMBO_4X5:(\d+):\d+$/);
  const batchIndex = match?.[1] ? Number.parseInt(match[1], 10) : 0;
  return 2 + ((Number.isFinite(batchIndex) ? batchIndex : 0) % 3);
}

function pick(values: readonly string[], slot: number): string {
  return values[slot % values.length]!;
}

function englishResidual(qlId: string, argument: string): readonly string[] | undefined {
  let match: RegExpMatchArray | null = null;

  if (qlId === "ARG-QL-001") {
    match = argument.match(/^No\. Unless (.+) can keep (.+) current, displaying it may misdirect users after the process is complete\.$/);
    if (match?.[1] && match[2]) {
      const actor = match[1];
      const item = match[2];
      return [
        `No. Unless ${actor} can keep ${item} current, displaying it may misdirect users after the process is complete.`,
        `No. If ${actor} cannot keep ${item} up to date, publishing it after the process may direct users to stale information.`,
        `No. Showing ${item} after completion is useful only if ${actor} can maintain it accurately; otherwise users may be misdirected.`,
        `No. An outdated ${item} could send users to the wrong information after the process, so ${actor} needs a reliable update mechanism.`,
        `No. ${actor} should not publish ${item} without a way to keep it current, because stale details can mislead users after completion.`,
      ];
    }
  }

  if (qlId === "ARG-QL-002") {
    match = argument.match(/^Yes\. A second check before changing (.+) completely eliminates all future fraud risk for (.+)\.$/);
    if (match?.[1] && match[2]) {
      const item = match[1];
      const actor = match[2];
      return [
        `Yes. A second check before changing ${item} completely eliminates all future fraud risk for ${actor}.`,
        `Yes. Once ${actor} adds a second check for changes to ${item}, every future fraud attempt becomes impossible.`,
        `Yes. Independent verification of ${item} removes the entire future fraud risk faced by ${actor}.`,
        `Yes. No fraudulent change to ${item} can ever succeed after ${actor} introduces a second verification step.`,
        `Yes. A second verification for ${item} guarantees that ${actor} will never face fraud involving that change again.`,
      ];
    }
  }

  if (qlId === "ARG-QL-003") {
    match = argument.match(/^No\. Any use of time slots makes (.+) permanently impossible to deliver\.$/);
    if (match?.[1]) {
      const service = match[1];
      return [
        `No. Any use of time slots makes ${service} permanently impossible to deliver.`,
        `No. Once time slots are introduced, ${service} can never be delivered successfully again.`,
        `No. A scheduled-slot system would make it permanently impossible to provide ${service}.`,
        `No. Using appointment slots means ${service} will cease to be deliverable altogether.`,
        `No. ${service} becomes permanently unworkable as soon as a time-slot system is used.`,
      ];
    }
    match = argument.match(/^Yes\. Time slots can spread arrivals and reduce crowding for (.+)\.$/);
    if (match?.[1]) {
      const service = match[1];
      return [
        `Yes. Time slots can spread arrivals and reduce crowding for ${service}.`,
        `Yes. Scheduling arrivals across different times can reduce queue concentration for ${service}.`,
        `Yes. Appointment slots can distribute demand across the day and ease crowding around ${service}.`,
        `Yes. By staggering when users arrive, a slot system can lower peak crowding for ${service}.`,
        `Yes. Fixed appointment windows can smooth the arrival pattern and reduce congestion for ${service}.`,
      ];
    }
  }

  if (qlId === "ARG-QL-004") {
    match = argument.match(/^Yes\. A limited restriction during (.+) can reduce conflict without creating an all-day ban\.$/);
    if (match?.[1]) {
      const period = match[1];
      return [
        `Yes. A limited restriction during ${period} can reduce conflict without creating an all-day ban.`,
        `Yes. Restricting heavy vehicles only during ${period} can address peak conflict while avoiding a full-day prohibition.`,
        `Yes. A time-bound limit focused on ${period} can reduce traffic conflict without extending the restriction to the whole day.`,
        `Yes. Targeting ${period} allows the restriction to address the busiest period rather than becoming a blanket daily ban.`,
        `Yes. Limiting heavy-vehicle movement specifically during ${period} is a narrower way to reduce conflict than an all-day ban.`,
      ];
    }
  }

  return undefined;
}

function hindiResidual(qlId: string, argument: string): readonly string[] | undefined {
  let match: RegExpMatchArray | null = null;

  if (qlId === "ARG-QL-001") {
    match = argument.match(/^नहीं। यदि (.+) (.+) को अद्यतन नहीं रख सकता, तो उसे दिखाने से प्रक्रिया पूरी होने के बाद उपयोगकर्ता गलत संपर्क पर निर्भर कर सकते हैं।$/);
    if (match?.[1] && match[2]) {
      const actor = match[1];
      const item = match[2];
      return [
        `नहीं। यदि ${actor} ${item} को अद्यतन नहीं रख सकता, तो उसे दिखाने से प्रक्रिया पूरी होने के बाद उपयोगकर्ता गलत संपर्क पर निर्भर कर सकते हैं।`,
        `नहीं। ${item} पुराना रह जाए तो प्रक्रिया के बाद उपयोगकर्ता गलत जानकारी पर जा सकते हैं, इसलिए ${actor} को इसे नियमित रूप से अद्यतन करना होगा।`,
        `नहीं। प्रक्रिया पूरी होने के बाद ${item} तभी उपयोगी है जब ${actor} उसे सही और वर्तमान रख सके; पुरानी जानकारी उपयोगकर्ताओं को भटका सकती है।`,
        `नहीं। बिना भरोसेमंद अद्यतन व्यवस्था के ${item} दिखाने से प्रक्रिया के बाद उपयोगकर्ता गलत माध्यम पर पहुँच सकते हैं।`,
        `नहीं। ${actor} को ${item} तभी प्रकाशित करना चाहिए जब उसे समय पर अद्यतन रखा जा सके, वरना पुरानी जानकारी भ्रम पैदा कर सकती है।`,
      ];
    }
  }

  if (qlId === "ARG-QL-002" && argument === "नहीं। स्वतंत्र सत्यापन के साथ सुरक्षित रिकवरी विकल्प भी होना चाहिए, वरना पुराने सत्यापन माध्यम तक पहुँच खोने वाला वास्तविक उपयोगकर्ता फँस सकता है।") {
    return [
      argument,
      "नहीं। स्वतंत्र सत्यापन के साथ सुरक्षित रिकवरी मार्ग जरूरी है, क्योंकि पुराने सत्यापन माध्यम तक पहुँच खोने वाला वास्तविक उपयोगकर्ता अन्यथा खाते से बाहर हो सकता है।",
      "नहीं। दूसरा सत्यापन तभी व्यावहारिक है जब वैध उपयोगकर्ता के लिए सुरक्षित रिकवरी विकल्प भी हो; पुराने माध्यम की पहुँच खोना स्थायी लॉकआउट नहीं बनना चाहिए।",
      "नहीं। पुराने सत्यापन माध्यम तक पहुँच न रहने पर वास्तविक उपयोगकर्ता को सुरक्षित तरीके से पहुँच वापस पाने का विकल्प चाहिए।",
      "नहीं। स्वतंत्र जाँच के साथ ऐसी रिकवरी व्यवस्था भी होनी चाहिए जो पुराने सत्यापन साधन खो चुके वास्तविक उपयोगकर्ता को वैध पहुँच वापस दे सके।",
    ];
  }

  if (qlId === "ARG-QL-003") {
    match = argument.match(/^नहीं। समय-स्लॉट का कोई भी उपयोग (.+) को स्थायी रूप से असंभव बना देता है।$/);
    if (match?.[1]) {
      const service = match[1];
      return [
        argument,
        `नहीं। समय-स्लॉट शुरू होते ही ${service} को सफलतापूर्वक देना हमेशा के लिए असंभव हो जाएगा।`,
        `नहीं। निर्धारित स्लॉट की व्यवस्था ${service} को स्थायी रूप से अनुपलब्ध बना देगी।`,
        `नहीं। अपॉइंटमेंट स्लॉट अपनाने का अर्थ है कि ${service} फिर कभी ठीक से नहीं दी जा सकेगी।`,
        `नहीं। समय-स्लॉट प्रणाली लागू होते ही ${service} स्थायी रूप से अव्यावहारिक हो जाएगी।`,
      ];
    }
  }

  if (qlId === "ARG-QL-004") {
    match = argument.match(/^हाँ। (.+) के दौरान सीमित प्रतिबंध पूरे दिन के प्रतिबंध के बिना टकराव कम कर सकता है।$/);
    if (match?.[1]) {
      const period = match[1];
      return [
        argument,
        `हाँ। केवल ${period} में भारी वाहनों को सीमित करना व्यस्त समय का टकराव घटा सकता है, बिना पूरे दिन प्रतिबंध लगाए।`,
        `हाँ। ${period} पर केंद्रित समयबद्ध रोक पूरे दिन की पाबंदी बनाए बिना यातायात संघर्ष कम कर सकती है।`,
        `हाँ। ${period} के लिए सीमित रोक सबसे व्यस्त अवधि को निशाना बनाती है और इसे पूर्ण-दिवसीय प्रतिबंध बनने से बचाती है।`,
        `हाँ। भारी वाहनों की आवाजाही को खास तौर पर ${period} तक सीमित करना पूरे दिन के प्रतिबंध की तुलना में अधिक संकीर्ण उपाय है।`,
      ];
    }
  }

  if (qlId === "ARG-QL-005") {
    match = argument.match(/^हाँ। (.+) को पता होना चाहिए कि (.+) कौन-सा डेटा एकत्र करता है, क्यों करता है और उसे कौन देख सकता है।$/);
    if (match?.[1] && match[2]) {
      const workers = match[1];
      const monitoring = match[2];
      return [
        argument,
        `हाँ। ${workers} को पहले से बताया जाना चाहिए कि ${monitoring} कौन-सी जानकारी लेगा, उसका उद्देश्य क्या है और उस डेटा तक किसकी पहुँच होगी।`,
        `हाँ। ${monitoring} शुरू करने से पहले ${workers} को एकत्र किए जाने वाले डेटा, उसके उपयोग और पहुँच रखने वालों के बारे में स्पष्ट जानकारी मिलनी चाहिए।`,
        `हाँ। ${workers} के लिए यह जानना जरूरी है कि ${monitoring} से कौन-सा डेटा बनेगा, वह क्यों लिया जाएगा और उसे कौन देख सकेगा।`,
        `हाँ। ${monitoring} की पारदर्शिता के लिए ${workers} को डेटा के प्रकार, उद्देश्य और पहुँच के बारे में अग्रिम सूचना मिलनी चाहिए।`,
      ];
    }
  }

  if (qlId === "ARG-QL-006" && argument === "नहीं। साक्ष्य की जाँच के दौरान वापस लिया जा सकने वाला अस्थायी प्रतिबंध तत्काल जोखिम को संभाल सकता है।") {
    return [
      argument,
      "नहीं। साक्ष्य की पुष्टि होने तक लौटाया जा सकने वाला अस्थायी प्रतिबंध तत्काल जोखिम को नियंत्रित कर सकता है।",
      "नहीं। तथ्य जाँचते समय अस्थायी और वापस लिया जा सकने वाला कदम जोखिम संभाल सकता है, इसलिए तुरंत स्थायी दंड ही एकमात्र विकल्प नहीं है।",
      "नहीं। प्रमाण की समीक्षा पूरी होने तक सीमित अंतरिम रोक तत्काल खतरे को संभाल सकती है और बाद में बदली जा सकती है।",
      "नहीं। जाँच के दौरान अस्थायी सुरक्षा उपाय अपनाकर तत्काल जोखिम नियंत्रित किया जा सकता है, बिना निर्णय को तुरंत स्थायी बनाए।",
    ];
  }

  return undefined;
}

function punjabiResidual(qlId: string, argument: string): readonly string[] | undefined {
  let match: RegExpMatchArray | null = null;

  if (qlId === "ARG-QL-001") {
    match = argument.match(/^ਹਾਂ। ਸਪੱਸ਼ਟ (.+) ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਟਾਲੀਆਂ ਜਾ ਸਕਣ ਵਾਲੀਆਂ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ।$/);
    if (match?.[1]) {
      const item = match[1];
      return [
        argument,
        `ਹਾਂ। ${item} ਸਾਫ਼ ਤੌਰ 'ਤੇ ਦਿਖਾਉਣ ਨਾਲ ਵਰਤੋਂਕਾਰ ਸਮਝ ਸਕਦੇ ਹਨ ਕਿ ਨਤੀਜਾ ਕਿਵੇਂ ਬਣਿਆ ਅਤੇ ਕਿੱਥੇ ਟਾਲੀ ਜਾ ਸਕਣ ਵਾਲੀ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ।`,
        `ਹਾਂ। ${item} ਦੀ ਸਪੱਸ਼ਟ ਉਪਲਬਧਤਾ ਫੈਸਲੇ ਦਾ ਆਧਾਰ ਸਮਝਣ ਅਤੇ ਸੰਭਾਵਿਤ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਵਰਤੋਂਕਾਰਾਂ ਦੀ ਮਦਦ ਕਰਦੀ ਹੈ।`,
        `ਹਾਂ। ਜਦੋਂ ${item} ਸਪੱਸ਼ਟ ਹੁੰਦੇ ਹਨ, ਪ੍ਰਭਾਵਿਤ ਵਰਤੋਂਕਾਰ ਨਤੀਜੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਅਤੇ ਸੰਭਾਵਿਤ ਗਲਤੀਆਂ ਨੂੰ ਵਧੀਆ ਤਰੀਕੇ ਨਾਲ ਸਮਝ ਸਕਦੇ ਹਨ।`,
        `ਹਾਂ। ${item} ਨੂੰ ਸਪੱਸ਼ਟ ਰੱਖਣਾ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਦੀ ਪਾਰਦਰਸ਼ਤਾ ਵਧਾਉਂਦਾ ਹੈ ਅਤੇ ਗਲਤੀਆਂ ਪਛਾਣਣ ਲਈ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਠੋਸ ਜਾਣਕਾਰੀ ਦਿੰਦਾ ਹੈ।`,
      ];
    }
    match = argument.match(/^ਨਹੀਂ। ਜੇ (.+) (.+) ਨੂੰ ਅੱਪਡੇਟ ਨਹੀਂ ਰੱਖ ਸਕਦੀ, ਤਾਂ ਇਸ ਨੂੰ ਦਿਖਾਉਣ ਨਾਲ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ ਵਰਤੋਂਕਾਰ ਗਲਤ ਸੰਪਰਕ ਉੱਤੇ ਨਿਰਭਰ ਕਰ ਸਕਦੇ ਹਨ।$/);
    if (match?.[1] && match[2]) {
      const actor = match[1];
      const item = match[2];
      return [
        argument,
        `ਨਹੀਂ। ਜੇ ${item} ਪੁਰਾਣਾ ਰਹਿ ਜਾਵੇ, ਤਾਂ ਪ੍ਰਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਵਰਤੋਂਕਾਰ ਗਲਤ ਜਾਣਕਾਰੀ ਵੱਲ ਜਾ ਸਕਦੇ ਹਨ; ${actor} ਨੂੰ ਇਸ ਨੂੰ ਮੌਜੂਦਾ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ।`,
        `ਨਹੀਂ। ${item} ਨੂੰ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰਨਾ ਤਦ ਹੀ ਲਾਭਦਾਇਕ ਹੈ ਜਦੋਂ ${actor} ਇਸ ਦੀ ਜਾਣਕਾਰੀ ਸਹੀ ਅਤੇ ਅੱਪਡੇਟ ਰੱਖ ਸਕੇ।`,
        `ਨਹੀਂ। ਬਿਨਾਂ ਭਰੋਸੇਯੋਗ ਅੱਪਡੇਟ ਪ੍ਰਕਿਰਿਆ ਦੇ ${item} ਦਿਖਾਉਣਾ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਪ੍ਰਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਗਲਤ ਮਾਧਿਅਮ ਵੱਲ ਭੇਜ ਸਕਦਾ ਹੈ।`,
        `ਨਹੀਂ। ${actor} ਨੂੰ ${item} ਤਦ ਹੀ ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ ਹੈ ਜਦੋਂ ਇਹ ਸਮੇਂ ਸਿਰ ਅੱਪਡੇਟ ਕੀਤਾ ਜਾ ਸਕੇ, ਨਹੀਂ ਤਾਂ ਪੁਰਾਣੀ ਜਾਣਕਾਰੀ ਗੁੰਮਰਾਹ ਕਰ ਸਕਦੀ ਹੈ।`,
      ];
    }
    if (argument === "ਨਹੀਂ। ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਨਾਲ ਉਸ ਤੋਂ ਬਾਅਦ ਦਿਖਾਈ ਜਾਣ ਵਾਲੀ ਹਰ ਜਾਣਕਾਰੀ ਆਪਣੇ ਆਪ ਬੇਕਾਰ ਹੋ ਜਾਂਦੀ ਹੈ।") {
      return [
        argument,
        "ਨਹੀਂ। ਪ੍ਰਕਿਰਿਆ ਖਤਮ ਹੋ ਜਾਣ ਤੋਂ ਬਾਅਦ ਦਿਖਾਈ ਗਈ ਹਰ ਜਾਣਕਾਰੀ ਬੇਕਾਰ ਹੀ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਕੁਝ ਵੀ ਦਿਖਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ।",
        "ਨਹੀਂ। ਜਿਵੇਂ ਹੀ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੁੰਦੀ ਹੈ, ਬਾਅਦ ਦੀ ਕੋਈ ਵੀ ਜਾਣਕਾਰੀ ਵਰਤੋਂਕਾਰਾਂ ਲਈ ਲਾਭਦਾਇਕ ਨਹੀਂ ਰਹਿ ਸਕਦੀ।",
        "ਨਹੀਂ। ਪ੍ਰਕਿਰਿਆ ਮੁਕੰਮਲ ਹੋਣ ਤੋਂ ਬਾਅਦ ਦਿੱਤੀ ਜਾਣ ਵਾਲੀ ਜਾਣਕਾਰੀ ਦਾ ਕੋਈ ਵਰਤੋਂਯੋਗ ਮੁੱਲ ਨਹੀਂ ਹੋ ਸਕਦਾ।",
        "ਨਹੀਂ। ਇੱਕ ਵਾਰ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋ ਜਾਵੇ ਤਾਂ ਉਸ ਤੋਂ ਬਾਅਦ ਪ੍ਰਕਾਸ਼ਿਤ ਹਰ ਵੇਰਵਾ ਆਪਣੇ ਆਪ ਗੈਰ-ਜ਼ਰੂਰੀ ਹੋ ਜਾਂਦਾ ਹੈ।",
      ];
    }
  }

  if (qlId === "ARG-QL-002") {
    match = argument.match(/^ਹਾਂ। ਪੁਰਾਣੇ ਤਸਦੀਕਸ਼ੁਦਾ ਮਾਧਿਅਮ ਰਾਹੀਂ ਚੇਤਾਵਨੀ (.+) ਵਿੱਚ ਗੈਰ-ਅਧਿਕਾਰਤ ਬਦਲਾਅ ਜਲਦੀ ਪਕੜਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ।$/);
    if (match?.[1]) {
      const item = match[1];
      return [
        argument,
        `ਹਾਂ। ਪਹਿਲਾਂ ਤੋਂ ਤਸਦੀਕਸ਼ੁਦਾ ਮਾਧਿਅਮ 'ਤੇ ਭੇਜੀ ਚੇਤਾਵਨੀ ${item} ਵਿੱਚ ਬਿਨਾਂ ਅਧਿਕਾਰ ਬਦਲਾਅ ਦਾ ਜਲਦੀ ਪਤਾ ਲਗਾ ਸਕਦੀ ਹੈ।`,
        `ਹਾਂ। ${item} ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਪੁਰਾਣੇ ਤਸਦੀਕਸ਼ੁਦਾ ਚੈਨਲ 'ਤੇ ਸੂਚਨਾ ਮਿਲਣ ਨਾਲ ਅਸਲੀ ਵਰਤੋਂਕਾਰ ਗੈਰ-ਅਧਿਕਾਰਤ ਤਬਦੀਲੀ ਛੇਤੀ ਪਛਾਣ ਸਕਦਾ ਹੈ।`,
        `ਹਾਂ। ਪੁਰਾਣੇ ਭਰੋਸੇਯੋਗ ਸੰਪਰਕ ਮਾਧਿਅਮ 'ਤੇ ਅਲਰਟ ${item} ਵਿੱਚ ਸ਼ੱਕੀ ਤਬਦੀਲੀ ਲਈ ਸ਼ੁਰੂਆਤੀ ਚੇਤਾਵਨੀ ਦਿੰਦਾ ਹੈ।`,
        `ਹਾਂ। ${item} ਦੀ ਤਬਦੀਲੀ ਬਾਰੇ ਪਹਿਲਾਂ ਤਸਦੀਕ ਕੀਤੇ ਚੈਨਲ 'ਤੇ ਅਲਰਟ ਭੇਜਣਾ ਅਣਅਧਿਕਾਰਤ ਬਦਲਾਅ ਨੂੰ ਜਲਦੀ ਸਾਹਮਣੇ ਲਿਆ ਸਕਦਾ ਹੈ।`,
      ];
    }
  }

  if (qlId === "ARG-QL-003") {
    match = argument.match(/^ਨਹੀਂ। ਸਮਾਂ-ਸਲਾਟ ਦੀ ਕੋਈ ਵੀ ਵਰਤੋਂ (.+) ਨੂੰ ਸਦਾ ਲਈ ਅਸੰਭਵ ਬਣਾ ਦਿੰਦੀ ਹੈ।$/);
    if (match?.[1]) {
      const service = match[1];
      return [
        argument,
        `ਨਹੀਂ। ਸਮਾਂ-ਸਲਾਟ ਸ਼ੁਰੂ ਹੋਣ ਨਾਲ ${service} ਮੁੜ ਕਦੇ ਸਫਲਤਾਪੂਰਵਕ ਦਿੱਤੀਆਂ ਨਹੀਂ ਜਾ ਸਕਣਗੀਆਂ।`,
        `ਨਹੀਂ। ਨਿਰਧਾਰਤ ਸਲਾਟ ਪ੍ਰਣਾਲੀ ${service} ਨੂੰ ਸਥਾਈ ਤੌਰ 'ਤੇ ਅਣਉਪਲਬਧ ਬਣਾ ਦੇਵੇਗੀ।`,
        `ਨਹੀਂ। ਅਪਾਇੰਟਮੈਂਟ ਸਲਾਟ ਵਰਤਣ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ${service} ਦੇਣਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਅਸੰਭਵ ਹੋ ਜਾਵੇਗਾ।`,
        `ਨਹੀਂ। ਸਮਾਂ-ਸਲਾਟ ਪ੍ਰਣਾਲੀ ਲਾਗੂ ਹੁੰਦੇ ਹੀ ${service} ਸਦਾ ਲਈ ਅਵਿਵਹਾਰਿਕ ਹੋ ਜਾਣਗੀਆਂ।`,
      ];
    }
    match = argument.match(/^ਹਾਂ। ਸਮਾਂ-ਸਲਾਟ ਆਉਣ ਵਾਲਿਆਂ ਨੂੰ ਵੰਡ ਕੇ (.+) ਵਿੱਚ ਭੀੜ ਘਟਾ ਸਕਦੇ ਹਨ।$/);
    if (match?.[1]) {
      const service = match[1];
      return [
        argument,
        `ਹਾਂ। ਵੱਖ-ਵੱਖ ਸਮਿਆਂ 'ਤੇ ਆਉਣ ਵਾਲਿਆਂ ਨੂੰ ਵੰਡਣ ਨਾਲ ${service} ਲਈ ਕਤਾਰ ਦੀ ਭੀੜ ਘਟ ਸਕਦੀ ਹੈ।`,
        `ਹਾਂ। ਅਪਾਇੰਟਮੈਂਟ ਸਲਾਟ ਦਿਨ ਭਰ ਮੰਗ ਨੂੰ ਵੰਡ ਕੇ ${service} ਦੇ ਆਲੇ-ਦੁਆਲੇ ਭੀੜ ਘਟਾ ਸਕਦੇ ਹਨ।`,
        `ਹਾਂ। ਲੋਕਾਂ ਦੇ ਆਉਣ ਦਾ ਸਮਾਂ ਫੈਲਾਉਣ ਨਾਲ ਸਲਾਟ ਪ੍ਰਣਾਲੀ ${service} ਲਈ ਚਰਮ ਭੀੜ ਘਟਾ ਸਕਦੀ ਹੈ।`,
        `ਹਾਂ। ਨਿਰਧਾਰਤ ਸਮਾਂ-ਖਿੜਕੀਆਂ ਆਉਣ ਵਾਲਿਆਂ ਦੇ ਰੁਝਾਨ ਨੂੰ ਸਮਤਲ ਕਰਕੇ ${service} ਲਈ ਭੀੜ ਘਟਾ ਸਕਦੀਆਂ ਹਨ।`,
      ];
    }
  }

  if (qlId === "ARG-QL-004") {
    match = argument.match(/^ਹਾਂ। (.+) ਦੌਰਾਨ ਸੀਮਿਤ ਪਾਬੰਦੀ ਪੂਰੇ ਦਿਨ ਦੀ ਪਾਬੰਦੀ ਤੋਂ ਬਿਨਾਂ ਟਕਰਾਅ ਘਟਾ ਸਕਦੀ ਹੈ।$/);
    if (match?.[1]) {
      const period = match[1];
      return [
        argument,
        `ਹਾਂ। ਕੇਵਲ ${period} ਵਿੱਚ ਭਾਰੀ ਵਾਹਨਾਂ ਨੂੰ ਸੀਮਿਤ ਕਰਨਾ ਸਭ ਤੋਂ ਰੁਝੇ ਸਮੇਂ ਦਾ ਟਕਰਾਅ ਘਟਾ ਸਕਦਾ ਹੈ, ਬਿਨਾਂ ਸਾਰਾ ਦਿਨ ਪਾਬੰਦੀ ਲਗਾਏ।`,
        `ਹਾਂ। ${period} 'ਤੇ ਕੇਂਦਰਿਤ ਸਮੇਂ-ਬੱਧ ਰੋਕ ਪੂਰੇ ਦਿਨ ਦੀ ਪਾਬੰਦੀ ਤੋਂ ਬਚਦੇ ਹੋਏ ਆਵਾਜਾਈ ਟਕਰਾਅ ਘਟਾ ਸਕਦੀ ਹੈ।`,
        `ਹਾਂ। ${period} ਲਈ ਸੀਮਿਤ ਰੋਕ ਸਭ ਤੋਂ ਵਿਅਸਤ ਮਿਆਦ ਨੂੰ ਨਿਸ਼ਾਨਾ ਬਣਾਉਂਦੀ ਹੈ ਅਤੇ ਕਦਮ ਨੂੰ ਪੂਰੇ ਦਿਨ ਦੀ ਪਾਬੰਦੀ ਬਣਨ ਤੋਂ ਰੋਕਦੀ ਹੈ।`,
        `ਹਾਂ। ਭਾਰੀ ਵਾਹਨਾਂ ਦੀ ਆਵਾਜਾਈ ਨੂੰ ਖਾਸ ਤੌਰ 'ਤੇ ${period} ਤੱਕ ਸੀਮਿਤ ਕਰਨਾ ਸਾਰਾ ਦਿਨ ਰੋਕਣ ਨਾਲੋਂ ਘੱਟ ਵਿਸਤ੍ਰਿਤ ਕਦਮ ਹੈ।`,
      ];
    }
  }

  if (qlId === "ARG-QL-005") {
    match = argument.match(/^ਹਾਂ। (.+) ਨੂੰ ਪਤਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿ (.+) ਕਿਹੜਾ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦਾ ਹੈ, ਕਿਉਂ ਕਰਦਾ ਹੈ ਅਤੇ ਉਸ ਤੱਕ ਕੌਣ ਪਹੁੰਚ ਸਕਦਾ ਹੈ।$/);
    if (match?.[1] && match[2]) {
      const workers = match[1];
      const monitoring = match[2];
      return [
        argument,
        `ਹਾਂ। ${workers} ਨੂੰ ਪਹਿਲਾਂ ਦੱਸਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿ ${monitoring} ਕਿਹੜੀ ਜਾਣਕਾਰੀ ਲਵੇਗਾ, ਇਸ ਦਾ ਮਕਸਦ ਕੀ ਹੈ ਅਤੇ ਡਾਟੇ ਤੱਕ ਕਿਸ ਦੀ ਪਹੁੰਚ ਹੋਵੇਗੀ।`,
        `ਹਾਂ। ${monitoring} ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ${workers} ਨੂੰ ਇਕੱਠੇ ਕੀਤੇ ਜਾਣ ਵਾਲੇ ਡਾਟੇ, ਉਸ ਦੀ ਵਰਤੋਂ ਅਤੇ ਪਹੁੰਚ ਰੱਖਣ ਵਾਲਿਆਂ ਬਾਰੇ ਸਪੱਸ਼ਟ ਜਾਣਕਾਰੀ ਮਿਲਣੀ ਚਾਹੀਦੀ ਹੈ।`,
        `ਹਾਂ। ${workers} ਲਈ ਇਹ ਜਾਣਨਾ ਜ਼ਰੂਰੀ ਹੈ ਕਿ ${monitoring} ਨਾਲ ਕਿਹੜਾ ਡਾਟਾ ਬਣੇਗਾ, ਉਹ ਕਿਉਂ ਲਿਆ ਜਾਵੇਗਾ ਅਤੇ ਉਸ ਨੂੰ ਕੌਣ ਵੇਖ ਸਕੇਗਾ।`,
        `ਹਾਂ। ${monitoring} ਦੀ ਪਾਰਦਰਸ਼ਤਾ ਲਈ ${workers} ਨੂੰ ਡਾਟੇ ਦੀ ਕਿਸਮ, ਮਕਸਦ ਅਤੇ ਪਹੁੰਚ ਬਾਰੇ ਅਗਾਊਂ ਜਾਣਕਾਰੀ ਮਿਲਣੀ ਚਾਹੀਦੀ ਹੈ।`,
      ];
    }
    if (argument === "ਹਾਂ। ਪਹਿਲਾਂ ਜਾਣਕਾਰੀ ਮਿਲਣ ਨਾਲ ਕਰਮਚਾਰੀ ਇਹ ਵੀ ਸਮਝ ਸਕਦੇ ਹਨ ਕਿ ਨਿਗਰਾਨੀ ਰਾਹੀਂ ਇਕੱਠੇ ਕੀਤੇ ਡਾਟੇ ਦੀ ਕੰਮਕਾਜੀ ਫੈਸਲਿਆਂ ਵਿੱਚ ਕਿਵੇਂ ਵਰਤੋਂ ਹੋ ਸਕਦੀ ਹੈ।") {
      return [
        argument,
        "ਹਾਂ। ਅਗਾਊਂ ਸੂਚਨਾ ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ ਕਿ ਨਿਗਰਾਨੀ ਨਾਲ ਇਕੱਠਾ ਡਾਟਾ ਕੰਮ-ਸਬੰਧੀ ਫੈਸਲਿਆਂ ਵਿੱਚ ਕਿਵੇਂ ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
        "ਹਾਂ। ਪਹਿਲਾਂ ਜਾਣਕਾਰੀ ਹੋਣ ਨਾਲ ਕਰਮਚਾਰੀ ਵੇਖ ਸਕਦੇ ਹਨ ਕਿ ਨਿਗਰਾਨੀ ਡਾਟਾ ਮੁਲਾਂਕਣ ਜਾਂ ਹੋਰ ਕੰਮਕਾਜੀ ਫੈਸਲਿਆਂ ਨੂੰ ਕਿਵੇਂ ਪ੍ਰਭਾਵਿਤ ਕਰ ਸਕਦਾ ਹੈ।",
        "ਹਾਂ। ਨਿਗਰਾਨੀ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਸਪੱਸ਼ਟ ਜਾਣਕਾਰੀ ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਡਾਟੇ ਦੇ ਕੰਮਕਾਜੀ ਫੈਸਲਿਆਂ ਵਿੱਚ ਸੰਭਾਵਿਤ ਉਪਯੋਗ ਨੂੰ ਸਮਝਣ ਦਿੰਦੀ ਹੈ।",
        "ਹਾਂ। ਅਗਾਊਂ ਖੁਲਾਸਾ ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਇਹ ਜਾਣਨ ਦਾ ਮੌਕਾ ਦਿੰਦਾ ਹੈ ਕਿ ਇਕੱਠੀ ਕੀਤੀ ਨਿਗਰਾਨੀ ਜਾਣਕਾਰੀ ਫੈਸਲਾ-ਕਰਨ ਵਿੱਚ ਕਿੱਥੇ ਵਰਤੀ ਜਾ ਸਕਦੀ ਹੈ।",
      ];
    }
  }

  return undefined;
}

function variants(locale: Locale, qlId: string, argument: string): readonly string[] | undefined {
  if (locale === "en-IN") return englishResidual(qlId, argument);
  if (locale === "hi-IN") return hindiResidual(qlId, argument);
  return punjabiResidual(qlId, argument);
}

function rebuildStem(locale: Locale, statement: string, argumentsList: readonly string[]): string {
  const statementLabel = locale === "en-IN" ? "Statement" : locale === "hi-IN" ? "कथन" : "ਕਥਨ";
  const argumentLabel = locale === "en-IN" ? "Arguments" : locale === "hi-IN" ? "तर्क" : "ਦਲੀਲਾਂ";
  return `${statementLabel}: ${statement}\n${argumentLabel}:\n${argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n")}`;
}

export function diversifyArgCp015ResidualComboArguments(
  question: Question,
  profile: string,
  difficulty: string,
  candidateSeed: string,
): Question {
  if (profile !== "BANKING_COMBO_3X5" && profile !== "BANKING_COMBO_4X5") return question;
  const locale = localeOf(question);
  if (!locale) return question;
  const qlId = text(question.qlId);
  const sourceArguments = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (sourceArguments.length !== 3 && sourceArguments.length !== 4) return question;
  const slot = profileSlot(profile, difficulty, candidateSeed);

  let changed = false;
  const argumentsList = Object.freeze(sourceArguments.map((argument) => {
    const options = variants(locale, qlId, argument);
    if (!options || options.length !== 5) return argument;
    const next = pick(options, slot);
    changed ||= next !== argument;
    return next;
  }));
  if (!changed) return question;

  const statement = text(question.statement);
  const explanation = text(question.explanation);
  const stem = rebuildStem(locale, statement, argumentsList);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_COMBO_RESIDUAL_ARGUMENT_AUTHORITY,
    question.contentFingerprint,
    profile,
    difficulty,
    locale,
    qlId,
    statement,
    argumentsList,
    question.argumentStrengths,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    arguments: argumentsList,
    stem,
    text: stem,
    preResidualArgumentDiversityArguments: question.arguments,
    comboResidualArgumentDiversityAuthority: ARG_CP015_COMBO_RESIDUAL_ARGUMENT_AUTHORITY,
    questionId: `ARG-001:${question.qlId}:${profile}:${locale}:CP015:${contentFingerprint.slice(0, 20)}`,
    canonicalItemId: `${question.canonicalItemId}:CP015:ARGRES`,
    contentFingerprint,
    diversitySourceMode: "CP014_APPROVED_SEMANTICS_WITH_CP015_CONTEXTUALIZED_AND_RESIDUAL_DIVERSE_COMBO_ARGUMENT_SURFACE" as const,
  });
}
