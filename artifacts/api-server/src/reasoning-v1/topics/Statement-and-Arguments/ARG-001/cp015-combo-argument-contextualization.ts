import { createHash } from "node:crypto";

export const ARG_CP015_COMBO_ARGUMENT_SURFACE_AUTHORITY = "ARG_CP015_COMBO_ARGUMENT_CONTEXTUALIZATION_V1" as const;

type Question = Readonly<Record<string, any>>;
type Locale = "en-IN" | "hi-IN" | "pa-IN";
type Captured = Readonly<{ a: string; b: string }>;

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

function capture(locale: Locale, qlId: string, statement: string): Captured | undefined {
  let match: RegExpMatchArray | null = null;
  if (locale === "en-IN") {
    if (qlId === "ARG-QL-001") match = statement.match(/^Should (.+) display (.+) clearly after the relevant process is complete\?$/);
    else if (qlId === "ARG-QL-002") match = statement.match(/^Should (.+) require independent verification before changing (.+)\?$/);
    else if (qlId === "ARG-QL-003") match = statement.match(/^Should (.+) introduce scheduled time slots for (.+)\?$/);
    else if (qlId === "ARG-QL-004") match = statement.match(/^Should heavy vehicles be restricted on (.+) during (.+)\?$/);
    else if (qlId === "ARG-QL-005") match = statement.match(/^Should an employer inform (.+) before introducing (.+)\?$/);
    else if (qlId === "ARG-QL-006") match = statement.match(/^Should (.+) impose a permanent penalty immediately after (.+)\?$/);
  } else if (locale === "hi-IN") {
    if (qlId === "ARG-QL-001") match = statement.match(/^क्या संबंधित प्रक्रिया पूरी होने के बाद (.+) को (.+) स्पष्ट रूप से दिखाना चाहिए\?$/);
    else if (qlId === "ARG-QL-002") match = statement.match(/^क्या (.+) को (.+) बदलने से पहले स्वतंत्र सत्यापन आवश्यक करना चाहिए\?$/);
    else if (qlId === "ARG-QL-003") match = statement.match(/^क्या (.+) को (.+) के लिए निर्धारित समय-स्लॉट शुरू करने चाहिए\?$/);
    else if (qlId === "ARG-QL-004") match = statement.match(/^क्या (.+) के दौरान (.+) पर भारी वाहनों को सीमित किया जाना चाहिए\?$/);
    else if (qlId === "ARG-QL-005") match = statement.match(/^क्या नियोक्ता को (.+) शुरू करने से पहले (.+) को सूचित करना चाहिए\?$/);
    else if (qlId === "ARG-QL-006") match = statement.match(/^क्या (.+) को (.+) के तुरंत बाद स्थायी दंड लगा देना चाहिए\?$/);
  } else {
    if (qlId === "ARG-QL-001") match = statement.match(/^ਕੀ ਸੰਬੰਧਿਤ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ (.+) ਨੂੰ (.+) ਸਪੱਸ਼ਟ ਤੌਰ 'ਤੇ ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ ਹੈ\?$/);
    else if (qlId === "ARG-QL-002") match = statement.match(/^ਕੀ (.+) ਨੂੰ (.+) ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਸੁਤੰਤਰ ਤਸਦੀਕ ਲਾਜ਼ਮੀ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ\?$/);
    else if (qlId === "ARG-QL-003") match = statement.match(/^ਕੀ (.+) ਨੂੰ (.+) ਲਈ ਨਿਰਧਾਰਤ ਸਮਾਂ-ਸਲਾਟ ਸ਼ੁਰੂ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ\?$/);
    else if (qlId === "ARG-QL-004") match = statement.match(/^ਕੀ (.+) ਦੌਰਾਨ (.+) 'ਤੇ ਭਾਰੀ ਵਾਹਨਾਂ ਨੂੰ ਸੀਮਿਤ ਕੀਤਾ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ\?$/);
    else if (qlId === "ARG-QL-005") match = statement.match(/^ਕੀ ਨਿਯੋਗਤਾ ਨੂੰ (.+) ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ (.+) ਨੂੰ ਜਾਣਕਾਰੀ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ\?$/);
    else if (qlId === "ARG-QL-006") match = statement.match(/^ਕੀ (.+) ਨੂੰ (.+) ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਸਥਾਈ ਸਜ਼ਾ ਲਗਾ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ\?$/);
  }
  if (!match?.[1] || !match[2]) return undefined;
  if ((locale === "hi-IN" || locale === "pa-IN") && (qlId === "ARG-QL-004" || qlId === "ARG-QL-005")) {
    return Object.freeze({ a: match[2], b: match[1] });
  }
  return Object.freeze({ a: match[1], b: match[2] });
}

function slot(profile: string, difficulty: string, seed: string, index: number): number {
  if (profile === "BANKING_COMBO_3X5") return text(difficulty).toUpperCase() === "MEDIUM" ? 0 : 1;
  const digest = createHash("sha256").update(`${seed}:${index}`).digest("hex");
  return 2 + (Number.parseInt(digest.slice(0, 2), 16) & 1);
}

function pick(values: readonly string[], index: number): string {
  return values[index % values.length]!;
}

function role(qlId: string, argument: string): string | undefined {
  if (qlId === "ARG-QL-001") {
    if (/Successful organisations|सफल संस्थाएँ|ਸਫਲ ਸੰਸਥਾਵਾਂ/i.test(argument)) return "IMITATION";
    if (/less attractive|कम आकर्षक|ਘੱਟ ਆਕਰਸ਼ਕ/i.test(argument)) return "COSMETIC";
    if (/stale information|पुरानी जानकारी|ਪੁਰਾਣੀ ਜਾਣਕਾਰੀ|keep .* updated|अद्यतन रखना|ਅੱਪਡੇਟ ਰੱਖ/i.test(argument)) return "ACCURACY";
  }
  if (qlId === "ARG-QL-002") {
    if (/stolen login|चोरी हुए लॉगिन|ਚੋਰੀ ਹੋਏ ਲਾਗਇਨ/i.test(argument)) return "SECOND_FACTOR";
    if (/One customer once failed|एक ग्राहक कभी|ਇੱਕ ਗਾਹਕ ਕਦੇ/i.test(argument)) return "ANECDOTE";
    if (/guarantees? that fraud|future fraud attempt impossible|गारंटी.*धोखाधड़ी|हर भविष्य की धोखाधड़ी|ਗਾਰੰਟੀ.*ਧੋਖਾਧੜੀ|ਭਵਿੱਖ ਦੀ ਹਰ ਧੋਖਾਧੜੀ/i.test(argument)) return "ABSOLUTE_FRAUD";
  }
  if (qlId === "ARG-QL-003") {
    if (/expensive desktop|महंगा डेस्कटॉप|ਮਹਿੰਗਾ ਡੈਸਕਟਾਪ/i.test(argument)) return "DESKTOP";
    if (/counter capacity|काउंटर क्षमता|ਕਾਊਂਟਰ ਸਮਰੱਥਾ/i.test(argument)) return "CAPACITY";
    if (/cannot book online|cannot reliably arrive|ऑनलाइन स्लॉट|तय समय पर|ਆਨਲਾਈਨ ਸਲਾਟ|ਨਿਰਧਾਰਤ ਸਮੇਂ/i.test(argument)) return "ACCESS";
  }
  if (qlId === "ARG-QL-004") {
    if (/emergency or essential deliveries|आपातकालीन या आवश्यक डिलीवरी|ਐਮਰਜੈਂਸੀ ਜਾਂ ਜ਼ਰੂਰੀ ਡਿਲਿਵਰੀ/i.test(argument)) return "DELIVERY";
    if (/permanently destroy all activity|स्थायी रूप से नष्ट|ਸਦਾ ਲਈ ਖਤਮ/i.test(argument)) return "PERMANENT_HARM";
    if (/banned .* at all times|हर समय प्रतिबंधित|ਹਰ ਵੇਲੇ ਬੰਦ/i.test(argument)) return "BLANKET";
    if (/turning and pedestrian conflict|मोड़.*पैदल|ਮੋੜ.*ਪੈਦਲ/i.test(argument)) return "CONFLICT";
  }
  if (qlId === "ARG-QL-005") {
    if (/modern technology|आधुनिक तकनीक|ਆਧੁਨਿਕ ਤਕਨਾਲੋਜੀ/i.test(argument)) return "MODERN";
    if (/something to hide|कुछ छिपाने|ਕੁਝ ਲੁਕਾਉਣ/i.test(argument)) return "SUSPICION";
    if (/targeted investigation|सीमित जाँच|ਸੀਮਿਤ ਜਾਂਚ/i.test(argument)) return "INVESTIGATION";
    if (/value privacy cannot be trusted|गोपनीयता.*भरोसा|ਪਰਦੇਦਾਰੀ.*ਭਰੋਸਾ/i.test(argument)) return "PRIVACY_STEREOTYPE";
  }
  if (qlId === "ARG-QL-006") {
    if (/fair opportunity to respond|उचित अवसर|ਵਾਜਬ ਮੌਕਾ/i.test(argument)) return "HEARING";
    if (/mistaken .* serious harm|गलत .* गंभीर नुकसान|ਗਲਤ .* ਗੰਭੀਰ ਨੁਕਸਾਨ/i.test(argument)) return "MISTAKEN";
    if (/ignore every future complaint|हर शिकायत अनदेखी|ਹਰ ਸ਼ਿਕਾਇਤ ਅਣਡਿੱਠੀ/i.test(argument)) return "IGNORE";
    if (/guilt is already certain|दोष पहले से निश्चित|ਦੋਸ਼ ਪਹਿਲਾਂ ਹੀ ਪੱਕਾ/i.test(argument)) return "CERTAIN_GUILT";
  }
  return undefined;
}

function english(qlId: string, semanticRole: string, a: string, b: string): readonly string[] | undefined {
  if (qlId === "ARG-QL-001" && semanticRole === "IMITATION") return [
    `Yes. Because successful organisations often publish more information, ${a} should also display ${b}.`,
    `Yes. ${a} should display ${b} because organisations that disclose more information are often successful.`,
    `Yes. Since successful organisations tend to publish more details, ${a} must make ${b} visible as well.`,
    `Yes. The success of organisations that publish more information is enough reason for ${a} to display ${b}.`,
  ];
  if (qlId === "ARG-QL-001" && semanticRole === "COSMETIC") return [
    `No. ${a} should not display ${b} because a page containing it may look less attractive.`,
    `No. If showing ${b} makes the page less attractive, ${a} should leave the information out.`,
    `No. A less attractive page is reason enough for ${a} not to show ${b}.`,
    `No. ${a} should omit ${b} whenever displaying it makes the page look less appealing.`,
  ];
  if (qlId === "ARG-QL-001" && semanticRole === "ACCURACY") return [
    `No. If ${b} can change, ${a} must keep it current; otherwise users may rely on stale information.`,
    `No. ${a} should display ${b} only if it can keep the information updated, because outdated details may mislead users.`,
    `No. Where ${b} may change, ${a} needs a reliable update process so users are not shown stale information.`,
    `No. Publishing ${b} without keeping it current could misdirect users, so ${a} must be able to update it promptly.`,
  ];
  if (qlId === "ARG-QL-002" && semanticRole === "SECOND_FACTOR") return [
    `Yes. A second verification step means stolen login details alone are not enough to change ${b} at ${a}.`,
    `Yes. Before ${a} changes ${b}, an independent second check can stop stolen credentials from being sufficient on their own.`,
    `Yes. Requiring another verification for ${b} prevents possession of stolen login details alone from authorising the change.`,
    `Yes. ${a} can reduce unauthorised changes to ${b} by requiring verification beyond the login credentials themselves.`,
  ];
  if (qlId === "ARG-QL-002" && semanticRole === "ANECDOTE") return [
    `No. One customer once failed verification, so every genuine attempt to change ${b} at ${a} will become impossible.`,
    `No. Because one customer failed a verification check, ${a} should assume that no genuine user will ever be able to change ${b}.`,
    `No. A single failed verification proves that all legitimate changes to ${b} at ${a} will fail.`,
    `No. Since one user could not pass verification, every genuine request to alter ${b} must also become impossible.`,
  ];
  if (qlId === "ARG-QL-002" && semanticRole === "ABSOLUTE_FRAUD") return [
    `Yes. Independent verification of ${b} guarantees that fraud involving the change can never occur.`,
    `Yes. Once ${a} adds a second verification step for ${b}, every future fraud attempt becomes impossible.`,
    `Yes. A second check before changing ${b} completely eliminates all future fraud risk for ${a}.`,
    `Yes. Requiring independent verification for ${b} ensures that no fraudulent change can ever succeed.`,
  ];
  if (qlId === "ARG-QL-003" && semanticRole === "DESKTOP") return [
    `No. Using scheduled slots for ${b} at ${a} would require every visitor to own an expensive desktop computer.`,
    `No. ${a} can introduce time slots for ${b} only if every visitor has an expensive desktop computer.`,
    `No. A slot system for ${b} assumes that all visitors to ${a} own costly desktop computers.`,
    `No. Scheduled appointments for ${b} at ${a} are impossible unless every visitor owns an expensive desktop computer.`,
  ];
  if (qlId === "ARG-QL-003" && semanticRole === "CAPACITY") return [
    `Yes. If service time for ${b} is predictable, scheduled slots can help ${a} plan counter capacity across the day.`,
    `Yes. Predictable service duration for ${b} lets ${a} use appointment slots to match counter capacity with demand.`,
    `Yes. Where ${b} takes a reasonably predictable time, ${a} can use slots to distribute staff and counter capacity more effectively.`,
    `Yes. Scheduled arrivals for ${b} can help ${a} plan daily counter capacity when service duration is reasonably stable.`,
  ];
  if (qlId === "ARG-QL-003" && semanticRole === "ACCESS") return [
    `No. Scheduled slots for ${b} at ${a} can disadvantage people who cannot book online or reliably arrive at a fixed time.`,
    `No. A fixed-slot system for ${b} may create access problems for users who cannot book online or reach ${a} at an exact time.`,
    `No. Requiring scheduled appointments for ${b} can disadvantage users who lack online booking access or flexible travel time.`,
    `No. ${a} needs an access fallback because some users seeking ${b} cannot book digitally or reliably meet a fixed slot.`,
  ];
  if (qlId === "ARG-QL-004" && semanticRole === "DELIVERY") return [
    `No. Restricting heavy vehicles on ${a} during ${b} can delay emergency or essential deliveries that still need access.`,
    `No. Emergency and essential deliveries may still need ${a} during ${b}, so the restriction can create real delays.`,
    `No. A heavy-vehicle restriction on ${a} during ${b} may delay essential or emergency deliveries that cannot avoid the route.`,
    `No. Limiting heavy vehicles on ${a} in ${b} can obstruct time-sensitive emergency or essential deliveries that require access.`,
  ];
  if (qlId === "ARG-QL-004" && semanticRole === "PERMANENT_HARM") return [
    `No. Even a short heavy-vehicle restriction on ${a} during ${b} will permanently destroy all activity in the area.`,
    `No. A temporary restriction on ${a} during ${b} will cause permanent loss of all activity around the road.`,
    `No. Any brief limit on heavy vehicles at ${a} in ${b} will permanently ruin every activity in the surrounding area.`,
    `No. Restricting heavy vehicles on ${a} for ${b} will permanently eliminate all local activity.`,
  ];
  if (qlId === "ARG-QL-004" && semanticRole === "BLANKET") return [
    `Yes. If restricting heavy vehicles helps during ${b}, they should be banned from ${a} at all times.`,
    `Yes. Any benefit from a restriction in ${b} proves that ${a} should prohibit heavy vehicles throughout the day.`,
    `Yes. Once a restriction works during ${b}, ${a} should extend it into a permanent all-day ban.`,
    `Yes. If a limited restriction on ${a} helps even once, heavy vehicles should never be allowed there again.`,
  ];
  if (qlId === "ARG-QL-004" && semanticRole === "CONFLICT") return [
    `Yes. Limiting heavy vehicles on ${a} during ${b} can reduce turning and pedestrian conflicts.`,
    `Yes. Fewer heavy vehicles on ${a} in ${b} can reduce conflicts at turns and with pedestrians.`,
    `Yes. A time-bound restriction during ${b} can lower heavy-vehicle turning and pedestrian conflict on ${a}.`,
    `Yes. Restricting heavy vehicles on ${a} for ${b} can directly reduce turning movements that conflict with pedestrians.`,
  ];
  if (qlId === "ARG-QL-005" && semanticRole === "MODERN") return [
    `Yes. ${b} is modern technology, so using it must always be fair to ${a}.`,
    `Yes. Because ${b} is a modern monitoring tool, its use on ${a} is automatically fair.`,
    `Yes. The fact that ${b} uses modern technology proves that monitoring ${a} with it is fair.`,
    `Yes. Any modern tool such as ${b} must necessarily be fair when an employer uses it on ${a}.`,
  ];
  if (qlId === "ARG-QL-005" && semanticRole === "SUSPICION") return [
    `No. Any member of ${a} who asks questions about ${b} must have something to hide.`,
    `No. If ${a} question the use of ${b}, that itself shows they are hiding something.`,
    `No. Employees among ${a} would object to ${b} only if they had something to conceal.`,
    `No. Asking how ${b} works is enough to suspect that a member of ${a} has something to hide.`,
  ];
  if (qlId === "ARG-QL-005" && semanticRole === "INVESTIGATION") return [
    `No. In a narrowly targeted misconduct investigation involving ${a}, advance notice of ${b} could undermine the inquiry, so a limited exception may be needed.`,
    `No. If ${b} is used only in a specific misconduct investigation concerning ${a}, prior notice could defeat the investigation and justify a narrow exception.`,
    `No. A tightly limited investigation of suspected misconduct among ${a} may require ${b} without advance notice if notice would frustrate the inquiry.`,
    `No. Where ${b} is confined to a targeted misconduct inquiry involving ${a}, advance warning may compromise the evidence, so a narrow exception can be relevant.`,
  ];
  if (qlId === "ARG-QL-005" && semanticRole === "PRIVACY_STEREOTYPE") return [
    `No. Members of ${a} who value privacy cannot be trusted at work.`,
    `No. An employee among ${a} who cares about privacy should automatically be treated as untrustworthy.`,
    `No. Concern about privacy while ${b} is used shows that ${a} cannot be trusted.`,
    `No. Wanting privacy from ${b} is enough to conclude that a member of ${a} is unreliable at work.`,
  ];
  if (qlId === "ARG-QL-006" && semanticRole === "HEARING") return [
    `No. Before ${a} imposes a permanent penalty after ${b}, the affected person should be allowed to respond and the available evidence should be reviewed.`,
    `No. ${a} should review the evidence and hear the affected person before making ${b} the basis of an irreversible penalty.`,
    `No. A permanent sanction after ${b} should follow only after ${a} gives the affected person a fair chance to respond and checks the evidence.`,
    `No. Before acting irreversibly on ${b}, ${a} should examine the evidence and allow the affected person to present a response.`,
  ];
  if (qlId === "ARG-QL-006" && semanticRole === "MISTAKEN") return [
    `No. If ${b} is mistaken, a permanent penalty imposed by ${a} can cause serious harm that may not be reversible later.`,
    `No. An incorrect ${b} could lead ${a} to impose an irreversible penalty and cause serious harm before the mistake is discovered.`,
    `No. A mistaken ${b} can produce lasting harm if ${a} acts permanently before the error can be corrected.`,
    `No. If ${a} permanently penalises someone on the basis of an erroneous ${b}, the resulting harm may be impossible to undo.`,
  ];
  if (qlId === "ARG-QL-006" && semanticRole === "IGNORE") return [
    `No. If ${a} rejects an immediate permanent penalty after ${b}, it must ignore every future complaint as well.`,
    `No. Once ${a} decides not to impose a permanent penalty immediately for ${b}, it has to disregard all later complaints.`,
    `No. Refusing an instant irreversible sanction after ${b} means ${a} can never act on another complaint.`,
    `No. Unless ${a} permanently punishes immediately after ${b}, every future complaint must be ignored.`,
  ];
  if (qlId === "ARG-QL-006" && semanticRole === "CERTAIN_GUILT") return [
    `Yes. ${b} can occur only when guilt is already certain, so ${a} can punish permanently at once.`,
    `Yes. The existence of ${b} itself proves guilt conclusively and justifies an immediate permanent penalty by ${a}.`,
    `Yes. ${a} can treat ${b} as certain proof of guilt and impose an irreversible sanction immediately.`,
    `Yes. Whenever ${b} occurs, guilt must already be established beyond doubt, so ${a} need not verify anything further.`,
  ];
  return undefined;
}

function hindi(qlId: string, semanticRole: string, a: string, b: string): readonly string[] | undefined {
  if (qlId === "ARG-QL-001" && semanticRole === "IMITATION") return [
    `हाँ। सफल संस्थाएँ अक्सर अधिक जानकारी प्रकाशित करती हैं, इसलिए ${a} को भी ${b} दिखाना चाहिए।`,
    `हाँ। ${a} को ${b} दिखाना चाहिए क्योंकि अधिक जानकारी देने वाली संस्थाएँ अक्सर सफल होती हैं।`,
    `हाँ। सफल संस्थाएँ अधिक विवरण सार्वजनिक करती हैं, इसलिए ${a} को भी ${b} स्पष्ट करना ही चाहिए।`,
    `हाँ। दूसरी सफल संस्थाएँ अधिक जानकारी देती हैं; यही ${a} द्वारा ${b} दिखाने के लिए पर्याप्त कारण है।`,
  ];
  if (qlId === "ARG-QL-001" && semanticRole === "COSMETIC") return [
    `नहीं। ${a} को ${b} नहीं दिखाना चाहिए क्योंकि इससे पृष्ठ कम आकर्षक लग सकता है।`,
    `नहीं। यदि ${b} दिखाने से पृष्ठ की सुंदरता घटती है, तो ${a} को जानकारी छोड़ देनी चाहिए।`,
    `नहीं। पृष्ठ कम आकर्षक दिखेगा, इसलिए ${a} को ${b} प्रदर्शित नहीं करना चाहिए।`,
    `नहीं। ${b} से पृष्ठ की रूप-सज्जा खराब हो सकती है, इसलिए ${a} को इसे नहीं दिखाना चाहिए।`,
  ];
  if (qlId === "ARG-QL-001" && semanticRole === "ACCURACY") return [
    `नहीं। यदि ${b} बदल सकता है, तो ${a} को इसे अद्यतन रखना होगा, वरना उपयोगकर्ता पुरानी जानकारी पर निर्भर कर सकते हैं।`,
    `नहीं। ${a} को ${b} तभी दिखाना चाहिए जब वह इसे नियमित रूप से अद्यतन रख सके; पुरानी जानकारी उपयोगकर्ताओं को भ्रमित कर सकती है।`,
    `नहीं। ${b} में बदलाव संभव हो तो ${a} के पास उसे समय पर अपडेट करने की व्यवस्था होनी चाहिए।`,
    `नहीं। ${b} को पुराना छोड़कर प्रकाशित करना उपयोगकर्ताओं को गलत दिशा दे सकता है, इसलिए ${a} को इसे वर्तमान रखना चाहिए।`,
  ];
  if (qlId === "ARG-QL-002" && semanticRole === "SECOND_FACTOR") return [
    `हाँ। दूसरा सत्यापन यह सुनिश्चित करता है कि केवल चोरी हुए लॉगिन विवरण से ${a} में ${b} न बदला जा सके।`,
    `हाँ। ${b} बदलने से पहले स्वतंत्र दूसरी जाँच चोरी हुए लॉगिन विवरण को अकेले पर्याप्त होने से रोक सकती है।`,
    `हाँ। ${b} के लिए अतिरिक्त सत्यापन से केवल चोरी हुए लॉगिन विवरण के आधार पर बदलाव मंजूर नहीं होगा।`,
    `हाँ। ${a} ${b} बदलने के लिए लॉगिन विवरण से अलग सत्यापन मांगकर अनधिकृत बदलाव का जोखिम घटा सकता है।`,
  ];
  if (qlId === "ARG-QL-002" && semanticRole === "ANECDOTE") return [
    `नहीं। एक ग्राहक सत्यापन में विफल हुआ, इसलिए ${a} में ${b} का हर वास्तविक बदलाव असंभव हो जाएगा।`,
    `नहीं। एक ग्राहक की सत्यापन विफलता से मान लेना चाहिए कि कोई भी वास्तविक उपयोगकर्ता ${b} कभी नहीं बदल पाएगा।`,
    `नहीं। सत्यापन की एक असफल घटना साबित करती है कि ${b} के सभी वैध बदलाव विफल होंगे।`,
    `नहीं। एक उपयोगकर्ता जाँच पूरी नहीं कर पाया, इसलिए ${b} बदलने का हर वास्तविक अनुरोध भी असंभव होगा।`,
  ];
  if (qlId === "ARG-QL-002" && semanticRole === "ABSOLUTE_FRAUD") return [
    `हाँ। ${b} के लिए स्वतंत्र सत्यापन यह गारंटी देता है कि उससे जुड़ी धोखाधड़ी कभी नहीं हो सकती।`,
    `हाँ। ${a} द्वारा ${b} के लिए दूसरा सत्यापन जोड़ते ही भविष्य की हर धोखाधड़ी असंभव हो जाएगी।`,
    `हाँ। ${b} बदलने से पहले दूसरी जाँच ${a} के लिए धोखाधड़ी का पूरा जोखिम समाप्त कर देती है।`,
    `हाँ। ${b} का स्वतंत्र सत्यापन सुनिश्चित करता है कि कोई भी धोखाधड़ी वाला बदलाव कभी सफल नहीं होगा।`,
  ];
  if (qlId === "ARG-QL-003" && semanticRole === "DESKTOP") return [
    `नहीं। ${a} में ${b} के लिए समय-स्लॉट चलाने हेतु हर आगंतुक के पास महंगा डेस्कटॉप कंप्यूटर होना जरूरी होगा।`,
    `नहीं। ${a} ${b} के लिए स्लॉट तभी शुरू कर सकता है जब हर आगंतुक महंगा डेस्कटॉप कंप्यूटर रखता हो।`,
    `नहीं। ${b} की स्लॉट व्यवस्था यह मानती है कि ${a} आने वाले सभी लोगों के पास महंगे डेस्कटॉप कंप्यूटर हैं।`,
    `नहीं। ${a} में ${b} के लिए निर्धारित स्लॉट तब तक संभव नहीं हैं जब तक हर आगंतुक के पास महंगा डेस्कटॉप न हो।`,
  ];
  if (qlId === "ARG-QL-003" && semanticRole === "CAPACITY") return [
    `हाँ। ${b} में लगने वाला समय अनुमानित हो तो स्लॉट ${a} को दिन भर काउंटर क्षमता की योजना बनाने में मदद कर सकते हैं।`,
    `हाँ। ${b} की सेवा अवधि अनुमानित होने पर ${a} स्लॉट के अनुसार काउंटर क्षमता और मांग का मिलान कर सकता है।`,
    `हाँ। ${b} का समय काफी स्थिर हो तो ${a} निर्धारित स्लॉट से कर्मचारियों और काउंटर क्षमता का बेहतर वितरण कर सकता है।`,
    `हाँ। ${b} के लिए तय आगमन समय ${a} को दैनिक काउंटर क्षमता की बेहतर योजना बनाने देता है।`,
  ];
  if (qlId === "ARG-QL-003" && semanticRole === "ACCESS") return [
    `नहीं। ${a} में ${b} के निर्धारित स्लॉट उन लोगों को नुकसान पहुँचा सकते हैं जो ऑनलाइन बुकिंग नहीं कर सकते या तय समय पर नहीं पहुँच सकते।`,
    `नहीं। ${b} की तय-स्लॉट व्यवस्था उन उपयोगकर्ताओं के लिए पहुँच समस्या पैदा कर सकती है जो ऑनलाइन बुकिंग या सटीक समय पर पहुँचना नहीं कर पाते।`,
    `नहीं। ${b} के लिए अपॉइंटमेंट अनिवार्य करने से डिजिटल बुकिंग या लचीले यात्रा समय से वंचित लोग प्रभावित हो सकते हैं।`,
    `नहीं। ${a} को ${b} के लिए वैकल्पिक पहुँच रखनी चाहिए क्योंकि सभी उपयोगकर्ता ऑनलाइन बुकिंग या तय स्लॉट पूरा नहीं कर सकते।`,
  ];
  if (qlId === "ARG-QL-004" && semanticRole === "DELIVERY") return [
    `नहीं। ${b} के दौरान ${a} पर भारी वाहनों का प्रतिबंध उन आपातकालीन या आवश्यक डिलीवरी में देरी कर सकता है जिन्हें फिर भी पहुँच चाहिए।`,
    `नहीं। आपातकालीन और आवश्यक डिलीवरी को ${b} में भी ${a} की जरूरत हो सकती है, इसलिए प्रतिबंध वास्तविक देरी पैदा कर सकता है।`,
    `नहीं। ${b} के दौरान ${a} पर भारी वाहनों की सीमा उन आवश्यक डिलीवरी को देर करा सकती है जो दूसरा मार्ग नहीं ले सकतीं।`,
    `नहीं। ${a} पर ${b} में भारी वाहन सीमित करने से समय-संवेदी आवश्यक या आपातकालीन डिलीवरी बाधित हो सकती है।`,
  ];
  if (qlId === "ARG-QL-004" && semanticRole === "PERMANENT_HARM") return [
    `नहीं। ${b} के दौरान ${a} पर थोड़े समय का प्रतिबंध क्षेत्र की सारी गतिविधि स्थायी रूप से नष्ट कर देगा।`,
    `नहीं। ${a} पर ${b} में अस्थायी प्रतिबंध आसपास की सभी गतिविधियों को हमेशा के लिए समाप्त कर देगा।`,
    `नहीं। ${b} में भारी वाहनों की थोड़ी-सी सीमा भी ${a} के आसपास हर गतिविधि को स्थायी रूप से बर्बाद कर देगी।`,
    `नहीं। ${a} पर ${b} के लिए भारी वाहन रोकना स्थानीय गतिविधि को हमेशा के लिए खत्म कर देगा।`,
  ];
  if (qlId === "ARG-QL-004" && semanticRole === "BLANKET") return [
    `हाँ। यदि ${b} में प्रतिबंध से लाभ मिलता है, तो ${a} पर भारी वाहनों को हर समय बंद कर देना चाहिए।`,
    `हाँ। ${b} में थोड़े लाभ से साबित होता है कि ${a} पर भारी वाहनों को पूरे दिन प्रतिबंधित होना चाहिए।`,
    `हाँ। ${b} में प्रतिबंध एक बार काम करे तो ${a} पर उसे स्थायी पूरे-दिन के प्रतिबंध में बदल देना चाहिए।`,
    `हाँ। ${a} पर सीमित प्रतिबंध एक बार भी उपयोगी हो, तो भारी वाहनों को वहाँ फिर कभी अनुमति नहीं मिलनी चाहिए।`,
  ];
  if (qlId === "ARG-QL-004" && semanticRole === "CONFLICT") return [
    `हाँ। ${b} के दौरान ${a} पर भारी वाहनों को सीमित करने से मोड़ और पैदल यात्री टकराव कम हो सकते हैं।`,
    `हाँ। ${b} में ${a} पर कम भारी वाहन होने से मोड़ और पैदल यात्रियों से जुड़े टकराव घट सकते हैं।`,
    `हाँ। ${b} के लिए समयबद्ध प्रतिबंध ${a} पर भारी वाहनों के मोड़ और पैदल टकराव को कम कर सकता है।`,
    `हाँ। ${a} पर ${b} में भारी वाहन सीमित करना पैदल यात्रियों से टकराने वाले मोड़-आधारित संघर्ष सीधे घटा सकता है।`,
  ];
  if (qlId === "ARG-QL-005" && semanticRole === "MODERN") return [
    `हाँ। ${b} आधुनिक तकनीक है, इसलिए ${a} पर इसका उपयोग हमेशा न्यायसंगत होगा।`,
    `हाँ। ${b} एक आधुनिक निगरानी तकनीक है, इसलिए ${a} के लिए इसका उपयोग अपने-आप उचित है।`,
    `हाँ। ${b} का आधुनिक होना ही साबित करता है कि ${a} की निगरानी में इसका उपयोग न्यायसंगत है।`,
    `हाँ। ${b} जैसा आधुनिक उपकरण नियोक्ता द्वारा ${a} पर इस्तेमाल किए जाने पर आवश्यक रूप से उचित होगा।`,
  ];
  if (qlId === "ARG-QL-005" && semanticRole === "SUSPICION") return [
    `नहीं। ${a} में जो भी ${b} के बारे में सवाल करे, उसके पास जरूर कुछ छिपाने को है।`,
    `नहीं। यदि ${a} ${b} के उपयोग पर सवाल उठाते हैं, तो यही साबित करता है कि वे कुछ छिपा रहे हैं।`,
    `नहीं। ${a} में कोई कर्मचारी ${b} का विरोध तभी करेगा जब उसके पास छिपाने के लिए कुछ हो।`,
    `नहीं। ${b} कैसे काम करता है यह पूछना ही ${a} के कर्मचारी पर संदेह करने के लिए पर्याप्त है।`,
  ];
  if (qlId === "ARG-QL-005" && semanticRole === "INVESTIGATION") return [
    `नहीं। ${a} से जुड़ी सीमित कदाचार जाँच में ${b} की अग्रिम सूचना जाँच को विफल कर सकती है, इसलिए संकीर्ण अपवाद जरूरी हो सकता है।`,
    `नहीं। यदि ${b} केवल ${a} की विशिष्ट कदाचार जाँच में उपयोग हो रहा है, तो पहले सूचना देना जाँच का उद्देश्य बिगाड़ सकता है।`,
    `नहीं। ${a} में संदिग्ध कदाचार की सीमित जाँच के लिए ${b} बिना अग्रिम सूचना के जरूरी हो सकता है यदि सूचना से जाँच प्रभावित होती हो।`,
    `नहीं। ${a} से जुड़ी लक्षित जाँच में ${b} की पहले चेतावनी साक्ष्य को प्रभावित कर सकती है, इसलिए सीमित अपवाद प्रासंगिक है।`,
  ];
  if (qlId === "ARG-QL-005" && semanticRole === "PRIVACY_STEREOTYPE") return [
    `नहीं। ${a} में जो लोग गोपनीयता को महत्व देते हैं, उन पर काम में भरोसा नहीं किया जा सकता।`,
    `नहीं। ${a} का कोई कर्मचारी गोपनीयता की चिंता करे तो उसे अपने-आप अविश्वसनीय मान लेना चाहिए।`,
    `नहीं। ${b} के दौरान गोपनीयता की चिंता दिखाती है कि ${a} पर भरोसा नहीं किया जा सकता।`,
    `नहीं। ${b} से गोपनीयता चाहना ही ${a} के कर्मचारी को काम में अविश्वसनीय मानने के लिए पर्याप्त है।`,
  ];
  if (qlId === "ARG-QL-006" && semanticRole === "HEARING") return [
    `नहीं। ${b} के बाद ${a} द्वारा स्थायी दंड देने से पहले प्रभावित व्यक्ति को जवाब देने का मौका और साक्ष्यों की समीक्षा मिलनी चाहिए।`,
    `नहीं। ${a} को ${b} के आधार पर अपरिवर्तनीय दंड देने से पहले साक्ष्य जाँचने और प्रभावित व्यक्ति का पक्ष सुनने की जरूरत है।`,
    `नहीं। ${b} के बाद स्थायी दंड तभी होना चाहिए जब ${a} प्रभावित व्यक्ति को जवाब का उचित अवसर दे और साक्ष्य जाँचे।`,
    `नहीं। ${b} पर अपरिवर्तनीय कार्रवाई से पहले ${a} को साक्ष्य देखना और प्रभावित व्यक्ति को अपना पक्ष रखने देना चाहिए।`,
  ];
  if (qlId === "ARG-QL-006" && semanticRole === "MISTAKEN") return [
    `नहीं। यदि ${b} गलत हो, तो ${a} का स्थायी दंड गंभीर नुकसान कर सकता है जिसे बाद में वापस नहीं लिया जा सके।`,
    `नहीं। गलत ${b} के कारण ${a} त्रुटि पता चलने से पहले अपरिवर्तनीय दंड देकर गंभीर नुकसान कर सकता है।`,
    `नहीं। ${b} में गलती हो तो ${a} द्वारा सत्यापन से पहले स्थायी कार्रवाई लंबे समय का नुकसान कर सकती है।`,
    `नहीं। यदि ${a} गलत ${b} के आधार पर स्थायी दंड देता है, तो हुआ नुकसान बाद में सुधारना असंभव हो सकता है।`,
  ];
  if (qlId === "ARG-QL-006" && semanticRole === "IGNORE") return [
    `नहीं। यदि ${a} ${b} के बाद तत्काल स्थायी दंड नहीं देता, तो उसे भविष्य की हर शिकायत अनदेखी करनी होगी।`,
    `नहीं। ${b} पर तुरंत स्थायी दंड न देने का अर्थ है कि ${a} को बाद की सभी शिकायतें छोड़ देनी होंगी।`,
    `नहीं। ${b} के बाद तत्काल अपरिवर्तनीय दंड से इनकार करने पर ${a} फिर किसी शिकायत पर कार्रवाई नहीं कर सकता।`,
    `नहीं। जब तक ${a} ${b} के बाद तुरंत स्थायी दंड न दे, उसे भविष्य की हर शिकायत अनदेखी करनी चाहिए।`,
  ];
  if (qlId === "ARG-QL-006" && semanticRole === "CERTAIN_GUILT") return [
    `हाँ। ${b} तभी हो सकता है जब दोष पहले से निश्चित हो, इसलिए ${a} तुरंत स्थायी दंड दे सकता है।`,
    `हाँ। ${b} का होना ही दोष को निर्णायक रूप से साबित करता है और ${a} द्वारा तत्काल स्थायी दंड उचित बनाता है।`,
    `हाँ। ${a} ${b} को निश्चित दोष का प्रमाण मानकर तुरंत अपरिवर्तनीय दंड दे सकता है।`,
    `हाँ। जब भी ${b} हो, दोष बिना संदेह स्थापित माना जाना चाहिए और ${a} को आगे जाँच की जरूरत नहीं है।`,
  ];
  return undefined;
}

function punjabi(qlId: string, semanticRole: string, a: string, b: string): readonly string[] | undefined {
  if (qlId === "ARG-QL-001" && semanticRole === "IMITATION") return [
    `ਹਾਂ। ਸਫਲ ਸੰਸਥਾਵਾਂ ਅਕਸਰ ਵਧੇਰੇ ਜਾਣਕਾਰੀ ਜਾਰੀ ਕਰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ${a} ਨੂੰ ਵੀ ${b} ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ ਹੈ।`,
    `ਹਾਂ। ${a} ਨੂੰ ${b} ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿਉਂਕਿ ਵਧੇਰੇ ਜਾਣਕਾਰੀ ਦੇਣ ਵਾਲੀਆਂ ਸੰਸਥਾਵਾਂ ਅਕਸਰ ਸਫਲ ਹੁੰਦੀਆਂ ਹਨ।`,
    `ਹਾਂ। ਸਫਲ ਸੰਸਥਾਵਾਂ ਵਧੇਰੇ ਵੇਰਵੇ ਜਨਤਕ ਕਰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ${a} ਨੂੰ ਵੀ ${b} ਸਪੱਸ਼ਟ ਕਰਨਾ ਹੀ ਚਾਹੀਦਾ ਹੈ।`,
    `ਹਾਂ। ਹੋਰ ਸਫਲ ਸੰਸਥਾਵਾਂ ਵਧੇਰੇ ਜਾਣਕਾਰੀ ਦਿੰਦੀਆਂ ਹਨ; ਇਹੀ ${a} ਵੱਲੋਂ ${b} ਦਿਖਾਉਣ ਲਈ ਕਾਫ਼ੀ ਕਾਰਨ ਹੈ।`,
  ];
  if (qlId === "ARG-QL-001" && semanticRole === "COSMETIC") return [
    `ਨਹੀਂ। ${a} ਨੂੰ ${b} ਨਹੀਂ ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ ਕਿਉਂਕਿ ਇਸ ਨਾਲ ਪੰਨਾ ਘੱਟ ਆਕਰਸ਼ਕ ਲੱਗ ਸਕਦਾ ਹੈ।`,
    `ਨਹੀਂ। ਜੇ ${b} ਦਿਖਾਉਣ ਨਾਲ ਪੰਨੇ ਦੀ ਦਿੱਖ ਘਟਦੀ ਹੈ, ਤਾਂ ${a} ਨੂੰ ਜਾਣਕਾਰੀ ਛੱਡ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ।`,
    `ਨਹੀਂ। ਪੰਨਾ ਘੱਟ ਆਕਰਸ਼ਕ ਲੱਗੇਗਾ, ਇਸ ਲਈ ${a} ਨੂੰ ${b} ਦਿਖਾਉਣਾ ਨਹੀਂ ਚਾਹੀਦਾ।`,
    `ਨਹੀਂ। ${b} ਨਾਲ ਪੰਨੇ ਦੀ ਦਿੱਖ ਖਰਾਬ ਹੋ ਸਕਦੀ ਹੈ, ਇਸ ਲਈ ${a} ਨੂੰ ਇਹ ਨਹੀਂ ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ।`,
  ];
  if (qlId === "ARG-QL-001" && semanticRole === "ACCURACY") return [
    `ਨਹੀਂ। ਜੇ ${b} ਬਦਲ ਸਕਦਾ ਹੈ, ਤਾਂ ${a} ਨੂੰ ਇਸ ਨੂੰ ਅੱਪਡੇਟ ਰੱਖਣਾ ਹੋਵੇਗਾ, ਨਹੀਂ ਤਾਂ ਵਰਤੋਂਕਾਰ ਪੁਰਾਣੀ ਜਾਣਕਾਰੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰ ਸਕਦੇ ਹਨ।`,
    `ਨਹੀਂ। ${a} ਨੂੰ ${b} ਤਦ ਹੀ ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ ਹੈ ਜੇ ਉਹ ਇਸ ਨੂੰ ਨਿਯਮਿਤ ਅੱਪਡੇਟ ਰੱਖ ਸਕੇ; ਪੁਰਾਣੀ ਜਾਣਕਾਰੀ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਭੁਲਾ ਸਕਦੀ ਹੈ।`,
    `ਨਹੀਂ। ${b} ਵਿੱਚ ਬਦਲਾਅ ਸੰਭਵ ਹੋਣ ਤਾਂ ${a} ਕੋਲ ਇਸ ਨੂੰ ਸਮੇਂ ਸਿਰ ਅੱਪਡੇਟ ਕਰਨ ਦੀ ਪ੍ਰਣਾਲੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।`,
    `ਨਹੀਂ। ${b} ਨੂੰ ਪੁਰਾਣਾ ਛੱਡ ਕੇ ਦਿਖਾਉਣਾ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਗਲਤ ਰਾਹ ਪਾ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ${a} ਨੂੰ ਇਸ ਨੂੰ ਮੌਜੂਦਾ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ।`,
  ];
  if (qlId === "ARG-QL-002" && semanticRole === "SECOND_FACTOR") return [
    `ਹਾਂ। ਦੂਜੀ ਤਸਦੀਕ ਇਹ ਯਕੀਨੀ ਬਣਾਉਂਦੀ ਹੈ ਕਿ ਸਿਰਫ਼ ਚੋਰੀ ਹੋਏ ਲਾਗਇਨ ਵੇਰਵਿਆਂ ਨਾਲ ${a} ਵਿੱਚ ${b} ਨਾ ਬਦਲਿਆ ਜਾ ਸਕੇ।`,
    `ਹਾਂ। ${b} ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਵੱਖਰੀ ਦੂਜੀ ਜਾਂਚ ਚੋਰੀ ਹੋਏ ਲਾਗਇਨ ਵੇਰਵਿਆਂ ਨੂੰ ਆਪਣੇ ਆਪ ਕਾਫ਼ੀ ਹੋਣ ਤੋਂ ਰੋਕ ਸਕਦੀ ਹੈ।`,
    `ਹਾਂ। ${b} ਲਈ ਵਾਧੂ ਤਸਦੀਕ ਨਾਲ ਸਿਰਫ਼ ਚੋਰੀ ਹੋਏ ਲਾਗਇਨ ਵੇਰਵਿਆਂ ਦੇ ਆਧਾਰ ਉੱਤੇ ਬਦਲਾਅ ਮਨਜ਼ੂਰ ਨਹੀਂ ਹੋਵੇਗਾ।`,
    `ਹਾਂ। ${a} ${b} ਬਦਲਣ ਲਈ ਲਾਗਇਨ ਵੇਰਵਿਆਂ ਤੋਂ ਵੱਖਰੀ ਤਸਦੀਕ ਮੰਗ ਕੇ ਗੈਰ-ਅਧਿਕਾਰਤ ਬਦਲਾਅ ਦਾ ਜੋਖਮ ਘਟਾ ਸਕਦਾ ਹੈ।`,
  ];
  if (qlId === "ARG-QL-002" && semanticRole === "ANECDOTE") return [
    `ਨਹੀਂ। ਇੱਕ ਗਾਹਕ ਤਸਦੀਕ ਵਿੱਚ ਅਸਫਲ ਹੋਇਆ, ਇਸ ਲਈ ${a} ਵਿੱਚ ${b} ਦਾ ਹਰ ਅਸਲੀ ਬਦਲਾਅ ਅਸੰਭਵ ਹੋ ਜਾਵੇਗਾ।`,
    `ਨਹੀਂ। ਇੱਕ ਗਾਹਕ ਦੀ ਤਸਦੀਕ ਨਾਕਾਮੀ ਤੋਂ ਮੰਨ ਲੈਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿ ਕੋਈ ਵੀ ਅਸਲੀ ਵਰਤੋਂਕਾਰ ${b} ਕਦੇ ਨਹੀਂ ਬਦਲ ਸਕੇਗਾ।`,
    `ਨਹੀਂ। ਤਸਦੀਕ ਦੀ ਇੱਕ ਅਸਫਲ ਘਟਨਾ ਸਾਬਤ ਕਰਦੀ ਹੈ ਕਿ ${b} ਦੇ ਸਾਰੇ ਵੈਧ ਬਦਲਾਅ ਨਾਕਾਮ ਹੋਣਗੇ।`,
    `ਨਹੀਂ। ਇੱਕ ਵਰਤੋਂਕਾਰ ਜਾਂਚ ਪੂਰੀ ਨਾ ਕਰ ਸਕਿਆ, ਇਸ ਲਈ ${b} ਬਦਲਣ ਦੀ ਹਰ ਅਸਲੀ ਬੇਨਤੀ ਵੀ ਅਸੰਭਵ ਹੋਵੇਗੀ।`,
  ];
  if (qlId === "ARG-QL-002" && semanticRole === "ABSOLUTE_FRAUD") return [
    `ਹਾਂ। ${b} ਲਈ ਸੁਤੰਤਰ ਤਸਦੀਕ ਇਹ ਗਾਰੰਟੀ ਦਿੰਦੀ ਹੈ ਕਿ ਇਸ ਨਾਲ ਜੁੜੀ ਧੋਖਾਧੜੀ ਕਦੇ ਨਹੀਂ ਹੋ ਸਕਦੀ।`,
    `ਹਾਂ। ${a} ਵੱਲੋਂ ${b} ਲਈ ਦੂਜੀ ਤਸਦੀਕ ਜੋੜਦੇ ਹੀ ਭਵਿੱਖ ਦੀ ਹਰ ਧੋਖਾਧੜੀ ਅਸੰਭਵ ਹੋ ਜਾਵੇਗੀ।`,
    `ਹਾਂ। ${b} ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਦੂਜੀ ਜਾਂਚ ${a} ਲਈ ਧੋਖਾਧੜੀ ਦਾ ਸਾਰਾ ਜੋਖਮ ਖਤਮ ਕਰ ਦਿੰਦੀ ਹੈ।`,
    `ਹਾਂ। ${b} ਦੀ ਸੁਤੰਤਰ ਤਸਦੀਕ ਯਕੀਨੀ ਬਣਾਉਂਦੀ ਹੈ ਕਿ ਕੋਈ ਵੀ ਧੋਖੇਬਾਜ਼ ਬਦਲਾਅ ਕਦੇ ਸਫਲ ਨਹੀਂ ਹੋਵੇਗਾ।`,
  ];
  if (qlId === "ARG-QL-003" && semanticRole === "DESKTOP") return [
    `ਨਹੀਂ। ${a} ਵਿੱਚ ${b} ਲਈ ਸਮਾਂ-ਸਲਾਟ ਚਲਾਉਣ ਲਈ ਹਰ ਆਉਣ ਵਾਲੇ ਕੋਲ ਮਹਿੰਗਾ ਡੈਸਕਟਾਪ ਕੰਪਿਊਟਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੋਵੇਗਾ।`,
    `ਨਹੀਂ। ${a} ${b} ਲਈ ਸਲਾਟ ਤਦ ਹੀ ਸ਼ੁਰੂ ਕਰ ਸਕਦਾ ਹੈ ਜੇ ਹਰ ਆਉਣ ਵਾਲੇ ਕੋਲ ਮਹਿੰਗਾ ਡੈਸਕਟਾਪ ਕੰਪਿਊਟਰ ਹੋਵੇ।`,
    `ਨਹੀਂ। ${b} ਦੀ ਸਲਾਟ ਪ੍ਰਣਾਲੀ ਇਹ ਮੰਨਦੀ ਹੈ ਕਿ ${a} ਆਉਣ ਵਾਲੇ ਸਾਰੇ ਲੋਕਾਂ ਕੋਲ ਮਹਿੰਗੇ ਡੈਸਕਟਾਪ ਕੰਪਿਊਟਰ ਹਨ।`,
    `ਨਹੀਂ। ${a} ਵਿੱਚ ${b} ਲਈ ਨਿਰਧਾਰਤ ਸਲਾਟ ਤਦ ਤੱਕ ਸੰਭਵ ਨਹੀਂ ਜਦ ਤੱਕ ਹਰ ਆਉਣ ਵਾਲੇ ਕੋਲ ਮਹਿੰਗਾ ਡੈਸਕਟਾਪ ਨਾ ਹੋਵੇ।`,
  ];
  if (qlId === "ARG-QL-003" && semanticRole === "CAPACITY") return [
    `ਹਾਂ। ${b} ਲਈ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ ਅੰਦਾਜ਼ੇਯੋਗ ਹੋਵੇ ਤਾਂ ਸਲਾਟ ${a} ਨੂੰ ਦਿਨ ਭਰ ਕਾਊਂਟਰ ਸਮਰੱਥਾ ਦੀ ਯੋਜਨਾ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ।`,
    `ਹਾਂ। ${b} ਦੀ ਸੇਵਾ ਮਿਆਦ ਅੰਦਾਜ਼ੇਯੋਗ ਹੋਣ ਉੱਤੇ ${a} ਸਲਾਟਾਂ ਅਨੁਸਾਰ ਕਾਊਂਟਰ ਸਮਰੱਥਾ ਅਤੇ ਮੰਗ ਦਾ ਮੇਲ ਕਰ ਸਕਦਾ ਹੈ।`,
    `ਹਾਂ। ${b} ਦਾ ਸਮਾਂ ਕਾਫ਼ੀ ਸਥਿਰ ਹੋਵੇ ਤਾਂ ${a} ਨਿਰਧਾਰਤ ਸਲਾਟਾਂ ਨਾਲ ਸਟਾਫ ਅਤੇ ਕਾਊਂਟਰ ਸਮਰੱਥਾ ਵਧੀਆ ਵੰਡ ਸਕਦਾ ਹੈ।`,
    `ਹਾਂ। ${b} ਲਈ ਨਿਰਧਾਰਤ ਆਉਣ ਸਮੇਂ ${a} ਨੂੰ ਰੋਜ਼ਾਨਾ ਕਾਊਂਟਰ ਸਮਰੱਥਾ ਦੀ ਵਧੀਆ ਯੋਜਨਾ ਬਣਾਉਣ ਦਿੰਦੇ ਹਨ।`,
  ];
  if (qlId === "ARG-QL-003" && semanticRole === "ACCESS") return [
    `ਨਹੀਂ। ${a} ਵਿੱਚ ${b} ਦੇ ਨਿਰਧਾਰਤ ਸਲਾਟ ਉਹਨਾਂ ਲੋਕਾਂ ਲਈ ਮੁਸ਼ਕਲ ਪੈਦਾ ਕਰ ਸਕਦੇ ਹਨ ਜੋ ਆਨਲਾਈਨ ਬੁਕਿੰਗ ਨਹੀਂ ਕਰ ਸਕਦੇ ਜਾਂ ਨਿਰਧਾਰਤ ਸਮੇਂ ਨਹੀਂ ਪਹੁੰਚ ਸਕਦੇ।`,
    `ਨਹੀਂ। ${b} ਦੀ ਤੈਅ-ਸਲਾਟ ਪ੍ਰਣਾਲੀ ਉਹਨਾਂ ਵਰਤੋਂਕਾਰਾਂ ਲਈ ਪਹੁੰਚ ਸਮੱਸਿਆ ਬਣ ਸਕਦੀ ਹੈ ਜੋ ਆਨਲਾਈਨ ਬੁਕਿੰਗ ਜਾਂ ਬਿਲਕੁਲ ਸਮੇਂ ਉੱਤੇ ਪਹੁੰਚ ਨਹੀਂ ਕਰ ਸਕਦੇ।`,
    `ਨਹੀਂ। ${b} ਲਈ ਅਪਾਇੰਟਮੈਂਟ ਲਾਜ਼ਮੀ ਕਰਨ ਨਾਲ ਡਿਜ਼ਿਟਲ ਬੁਕਿੰਗ ਜਾਂ ਲਚਕੀਲੇ ਯਾਤਰਾ ਸਮੇਂ ਤੋਂ ਵਾਂਝੇ ਲੋਕ ਪ੍ਰਭਾਵਿਤ ਹੋ ਸਕਦੇ ਹਨ।`,
    `ਨਹੀਂ। ${a} ਨੂੰ ${b} ਲਈ ਵਿਕਲਪੀ ਪਹੁੰਚ ਰੱਖਣੀ ਚਾਹੀਦੀ ਹੈ ਕਿਉਂਕਿ ਸਾਰੇ ਵਰਤੋਂਕਾਰ ਆਨਲਾਈਨ ਬੁਕਿੰਗ ਜਾਂ ਤੈਅ ਸਲਾਟ ਪੂਰਾ ਨਹੀਂ ਕਰ ਸਕਦੇ।`,
  ];
  if (qlId === "ARG-QL-004" && semanticRole === "DELIVERY") return [
    `ਨਹੀਂ। ${b} ਦੌਰਾਨ ${a} ਉੱਤੇ ਭਾਰੀ ਵਾਹਨਾਂ ਦੀ ਪਾਬੰਦੀ ਉਹਨਾਂ ਐਮਰਜੈਂਸੀ ਜਾਂ ਜ਼ਰੂਰੀ ਡਿਲਿਵਰੀ ਵਿੱਚ ਦੇਰੀ ਕਰ ਸਕਦੀ ਹੈ ਜਿਨ੍ਹਾਂ ਨੂੰ ਫਿਰ ਵੀ ਪਹੁੰਚ ਚਾਹੀਦੀ ਹੈ।`,
    `ਨਹੀਂ। ਐਮਰਜੈਂਸੀ ਅਤੇ ਜ਼ਰੂਰੀ ਡਿਲਿਵਰੀ ਨੂੰ ${b} ਵਿੱਚ ਵੀ ${a} ਦੀ ਲੋੜ ਹੋ ਸਕਦੀ ਹੈ, ਇਸ ਲਈ ਪਾਬੰਦੀ ਅਸਲ ਦੇਰੀ ਪੈਦਾ ਕਰ ਸਕਦੀ ਹੈ।`,
    `ਨਹੀਂ। ${b} ਦੌਰਾਨ ${a} ਉੱਤੇ ਭਾਰੀ ਵਾਹਨਾਂ ਦੀ ਸੀਮਾ ਉਹਨਾਂ ਜ਼ਰੂਰੀ ਡਿਲਿਵਰੀ ਨੂੰ ਦੇਰ ਕਰ ਸਕਦੀ ਹੈ ਜੋ ਹੋਰ ਰਸਤਾ ਨਹੀਂ ਲੈ ਸਕਦੀਆਂ।`,
    `ਨਹੀਂ। ${a} ਉੱਤੇ ${b} ਵਿੱਚ ਭਾਰੀ ਵਾਹਨ ਸੀਮਿਤ ਕਰਨ ਨਾਲ ਸਮੇਂ-ਸੰਵੇਦਨਸ਼ੀਲ ਐਮਰਜੈਂਸੀ ਜਾਂ ਜ਼ਰੂਰੀ ਡਿਲਿਵਰੀ ਰੁਕ ਸਕਦੀ ਹੈ।`,
  ];
  if (qlId === "ARG-QL-004" && semanticRole === "PERMANENT_HARM") return [
    `ਨਹੀਂ। ${b} ਦੌਰਾਨ ${a} ਉੱਤੇ ਥੋੜ੍ਹੇ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ ਇਲਾਕੇ ਦੀ ਸਾਰੀ ਸਰਗਰਮੀ ਸਦਾ ਲਈ ਖਤਮ ਕਰ ਦੇਵੇਗੀ।`,
    `ਨਹੀਂ। ${a} ਉੱਤੇ ${b} ਵਿੱਚ ਅਸਥਾਈ ਪਾਬੰਦੀ ਆਲੇ-ਦੁਆਲੇ ਦੀ ਹਰ ਸਰਗਰਮੀ ਹਮੇਸ਼ਾਂ ਲਈ ਖਤਮ ਕਰ ਦੇਵੇਗੀ।`,
    `ਨਹੀਂ। ${b} ਵਿੱਚ ਭਾਰੀ ਵਾਹਨਾਂ ਦੀ ਥੋੜ੍ਹੀ ਸੀਮਾ ਵੀ ${a} ਦੇ ਆਲੇ-ਦੁਆਲੇ ਹਰ ਸਰਗਰਮੀ ਸਦਾ ਲਈ ਬਰਬਾਦ ਕਰ ਦੇਵੇਗੀ।`,
    `ਨਹੀਂ। ${a} ਉੱਤੇ ${b} ਲਈ ਭਾਰੀ ਵਾਹਨ ਰੋਕਣਾ ਸਥਾਨਕ ਸਰਗਰਮੀ ਨੂੰ ਹਮੇਸ਼ਾਂ ਲਈ ਖਤਮ ਕਰ ਦੇਵੇਗਾ।`,
  ];
  if (qlId === "ARG-QL-004" && semanticRole === "BLANKET") return [
    `ਹਾਂ। ਜੇ ${b} ਵਿੱਚ ਪਾਬੰਦੀ ਨਾਲ ਲਾਭ ਹੁੰਦਾ ਹੈ, ਤਾਂ ${a} ਉੱਤੇ ਭਾਰੀ ਵਾਹਨਾਂ ਨੂੰ ਹਰ ਵੇਲੇ ਬੰਦ ਕਰ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।`,
    `ਹਾਂ। ${b} ਵਿੱਚ ਥੋੜ੍ਹਾ ਲਾਭ ਸਾਬਤ ਕਰਦਾ ਹੈ ਕਿ ${a} ਉੱਤੇ ਭਾਰੀ ਵਾਹਨਾਂ ਨੂੰ ਪੂਰਾ ਦਿਨ ਬੰਦ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`,
    `ਹਾਂ। ${b} ਵਿੱਚ ਪਾਬੰਦੀ ਇੱਕ ਵਾਰ ਕੰਮ ਕਰੇ ਤਾਂ ${a} ਉੱਤੇ ਇਸ ਨੂੰ ਸਥਾਈ ਪੂਰੇ-ਦਿਨ ਦੀ ਪਾਬੰਦੀ ਬਣਾਉਣਾ ਚਾਹੀਦਾ ਹੈ।`,
    `ਹਾਂ। ${a} ਉੱਤੇ ਸੀਮਿਤ ਪਾਬੰਦੀ ਇੱਕ ਵਾਰ ਵੀ ਲਾਭਕਾਰੀ ਹੋਵੇ ਤਾਂ ਭਾਰੀ ਵਾਹਨਾਂ ਨੂੰ ਉੱਥੇ ਮੁੜ ਕਦੇ ਆਗਿਆ ਨਹੀਂ ਮਿਲਣੀ ਚਾਹੀਦੀ।`,
  ];
  if (qlId === "ARG-QL-004" && semanticRole === "CONFLICT") return [
    `ਹਾਂ। ${b} ਦੌਰਾਨ ${a} ਉੱਤੇ ਭਾਰੀ ਵਾਹਨ ਸੀਮਿਤ ਕਰਨ ਨਾਲ ਮੋੜ ਅਤੇ ਪੈਦਲ ਯਾਤਰੀ ਟਕਰਾਅ ਘਟ ਸਕਦੇ ਹਨ।`,
    `ਹਾਂ। ${b} ਵਿੱਚ ${a} ਉੱਤੇ ਘੱਟ ਭਾਰੀ ਵਾਹਨ ਹੋਣ ਨਾਲ ਮੋੜ ਅਤੇ ਪੈਦਲ ਯਾਤਰੀਆਂ ਨਾਲ ਜੁੜੇ ਟਕਰਾਅ ਘਟ ਸਕਦੇ ਹਨ।`,
    `ਹਾਂ। ${b} ਲਈ ਸਮੇਂ-ਬੱਧ ਪਾਬੰਦੀ ${a} ਉੱਤੇ ਭਾਰੀ ਵਾਹਨਾਂ ਦੇ ਮੋੜ ਅਤੇ ਪੈਦਲ ਟਕਰਾਅ ਨੂੰ ਘਟਾ ਸਕਦੀ ਹੈ।`,
    `ਹਾਂ। ${a} ਉੱਤੇ ${b} ਵਿੱਚ ਭਾਰੀ ਵਾਹਨ ਸੀਮਿਤ ਕਰਨਾ ਪੈਦਲ ਯਾਤਰੀਆਂ ਨਾਲ ਟਕਰਾਉਂਦੀਆਂ ਮੋੜ ਗਤੀਵਿਧੀਆਂ ਨੂੰ ਸਿੱਧਾ ਘਟਾ ਸਕਦਾ ਹੈ।`,
  ];
  if (qlId === "ARG-QL-005" && semanticRole === "MODERN") return [
    `ਹਾਂ। ${b} ਆਧੁਨਿਕ ਤਕਨਾਲੋਜੀ ਹੈ, ਇਸ ਲਈ ${a} ਉੱਤੇ ਇਸ ਦੀ ਵਰਤੋਂ ਹਮੇਸ਼ਾਂ ਨਿਆਂਯੋਗ ਹੋਵੇਗੀ।`,
    `ਹਾਂ। ${b} ਇੱਕ ਆਧੁਨਿਕ ਨਿਗਰਾਨੀ ਤਕਨਾਲੋਜੀ ਹੈ, ਇਸ ਲਈ ${a} ਲਈ ਇਸ ਦੀ ਵਰਤੋਂ ਆਪਣੇ ਆਪ ਨਿਆਂਯੋਗ ਹੈ।`,
    `ਹਾਂ। ${b} ਦਾ ਆਧੁਨਿਕ ਹੋਣਾ ਹੀ ਸਾਬਤ ਕਰਦਾ ਹੈ ਕਿ ${a} ਦੀ ਨਿਗਰਾਨੀ ਲਈ ਇਸ ਦੀ ਵਰਤੋਂ ਨਿਆਂਯੋਗ ਹੈ।`,
    `ਹਾਂ। ${b} ਵਰਗਾ ਆਧੁਨਿਕ ਸਾਧਨ ਨਿਯੋਗਤਾ ਵੱਲੋਂ ${a} ਉੱਤੇ ਵਰਤੇ ਜਾਣ ਨਾਲ ਲਾਜ਼ਮੀ ਤੌਰ ਉੱਤੇ ਨਿਆਂਯੋਗ ਹੋਵੇਗਾ।`,
  ];
  if (qlId === "ARG-QL-005" && semanticRole === "SUSPICION") return [
    `ਨਹੀਂ। ${a} ਵਿੱਚ ਜੋ ਵੀ ${b} ਬਾਰੇ ਸਵਾਲ ਪੁੱਛੇ, ਉਸ ਕੋਲ ਜ਼ਰੂਰ ਕੁਝ ਲੁਕਾਉਣ ਲਈ ਹੈ।`,
    `ਨਹੀਂ। ਜੇ ${a} ${b} ਦੀ ਵਰਤੋਂ ਉੱਤੇ ਸਵਾਲ ਕਰਦੇ ਹਨ, ਤਾਂ ਇਹੀ ਸਾਬਤ ਕਰਦਾ ਹੈ ਕਿ ਉਹ ਕੁਝ ਲੁਕਾ ਰਹੇ ਹਨ।`,
    `ਨਹੀਂ। ${a} ਵਿੱਚ ਕੋਈ ਕਰਮਚਾਰੀ ${b} ਦਾ ਵਿਰੋਧ ਤਦ ਹੀ ਕਰੇਗਾ ਜੇ ਉਸ ਕੋਲ ਲੁਕਾਉਣ ਲਈ ਕੁਝ ਹੋਵੇ।`,
    `ਨਹੀਂ। ${b} ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ ਇਹ ਪੁੱਛਣਾ ਹੀ ${a} ਦੇ ਕਰਮਚਾਰੀ ਉੱਤੇ ਸ਼ੱਕ ਕਰਨ ਲਈ ਕਾਫ਼ੀ ਹੈ।`,
  ];
  if (qlId === "ARG-QL-005" && semanticRole === "INVESTIGATION") return [
    `ਨਹੀਂ। ${a} ਨਾਲ ਜੁੜੀ ਸੀਮਿਤ ਗਲਤ ਵਿਹਾਰ ਜਾਂਚ ਵਿੱਚ ${b} ਦੀ ਅਗਾਊਂ ਸੂਚਨਾ ਜਾਂਚ ਨੂੰ ਨਾਕਾਮ ਕਰ ਸਕਦੀ ਹੈ, ਇਸ ਲਈ ਸੰਕੁਚਿਤ ਛੋਟ ਲੋੜੀਂਦੀ ਹੋ ਸਕਦੀ ਹੈ।`,
    `ਨਹੀਂ। ਜੇ ${b} ਸਿਰਫ਼ ${a} ਦੀ ਖਾਸ ਗਲਤ ਵਿਹਾਰ ਜਾਂਚ ਵਿੱਚ ਵਰਤੀ ਜਾ ਰਹੀ ਹੈ, ਤਾਂ ਪਹਿਲਾਂ ਸੂਚਨਾ ਦੇਣ ਨਾਲ ਜਾਂਚ ਦਾ ਮਕਸਦ ਖਰਾਬ ਹੋ ਸਕਦਾ ਹੈ।`,
    `ਨਹੀਂ। ${a} ਵਿੱਚ ਸ਼ੱਕੀ ਗਲਤ ਵਿਹਾਰ ਦੀ ਸੀਮਿਤ ਜਾਂਚ ਲਈ ${b} ਬਿਨਾਂ ਅਗਾਊਂ ਸੂਚਨਾ ਦੇ ਲੋੜੀਂਦੀ ਹੋ ਸਕਦੀ ਹੈ ਜੇ ਸੂਚਨਾ ਜਾਂਚ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰੇ।`,
    `ਨਹੀਂ। ${a} ਨਾਲ ਜੁੜੀ ਨਿਸ਼ਾਨਾਬੱਧ ਜਾਂਚ ਵਿੱਚ ${b} ਦੀ ਪਹਿਲਾਂ ਚੇਤਾਵਨੀ ਸਬੂਤਾਂ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰ ਸਕਦੀ ਹੈ, ਇਸ ਲਈ ਸੀਮਿਤ ਛੋਟ ਪ੍ਰਸੰਗਿਕ ਹੈ।`,
  ];
  if (qlId === "ARG-QL-005" && semanticRole === "PRIVACY_STEREOTYPE") return [
    `ਨਹੀਂ। ${a} ਵਿੱਚ ਜੋ ਲੋਕ ਪਰਦੇਦਾਰੀ ਨੂੰ ਮਹੱਤਵ ਦਿੰਦੇ ਹਨ, ਉਨ੍ਹਾਂ ਉੱਤੇ ਕੰਮ ਵਿੱਚ ਭਰੋਸਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।`,
    `ਨਹੀਂ। ${a} ਦਾ ਕੋਈ ਕਰਮਚਾਰੀ ਪਰਦੇਦਾਰੀ ਦੀ ਚਿੰਤਾ ਕਰੇ ਤਾਂ ਉਸ ਨੂੰ ਆਪਣੇ ਆਪ ਅਣਭਰੋਸੇਯੋਗ ਮੰਨ ਲੈਣਾ ਚਾਹੀਦਾ ਹੈ।`,
    `ਨਹੀਂ। ${b} ਦੌਰਾਨ ਪਰਦੇਦਾਰੀ ਦੀ ਚਿੰਤਾ ਦਿਖਾਉਂਦੀ ਹੈ ਕਿ ${a} ਉੱਤੇ ਭਰੋਸਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।`,
    `ਨਹੀਂ। ${b} ਤੋਂ ਪਰਦੇਦਾਰੀ ਚਾਹੁਣਾ ਹੀ ${a} ਦੇ ਕਰਮਚਾਰੀ ਨੂੰ ਕੰਮ ਵਿੱਚ ਅਣਭਰੋਸੇਯੋਗ ਮੰਨਣ ਲਈ ਕਾਫ਼ੀ ਹੈ।`,
  ];
  if (qlId === "ARG-QL-006" && semanticRole === "HEARING") return [
    `ਨਹੀਂ। ${b} ਤੋਂ ਬਾਅਦ ${a} ਵੱਲੋਂ ਸਥਾਈ ਸਜ਼ਾ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਪ੍ਰਭਾਵਿਤ ਵਿਅਕਤੀ ਨੂੰ ਜਵਾਬ ਦਾ ਮੌਕਾ ਅਤੇ ਸਬੂਤਾਂ ਦੀ ਸਮੀਖਿਆ ਮਿਲਣੀ ਚਾਹੀਦੀ ਹੈ।`,
    `ਨਹੀਂ। ${a} ਨੂੰ ${b} ਦੇ ਆਧਾਰ ਉੱਤੇ ਅਟੱਲ ਸਜ਼ਾ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਸਬੂਤ ਜਾਂਚਣ ਅਤੇ ਪ੍ਰਭਾਵਿਤ ਵਿਅਕਤੀ ਦਾ ਪੱਖ ਸੁਣਨ ਦੀ ਲੋੜ ਹੈ।`,
    `ਨਹੀਂ। ${b} ਤੋਂ ਬਾਅਦ ਸਥਾਈ ਸਜ਼ਾ ਤਦ ਹੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ ਜਦੋਂ ${a} ਪ੍ਰਭਾਵਿਤ ਵਿਅਕਤੀ ਨੂੰ ਜਵਾਬ ਦਾ ਵਾਜਬ ਮੌਕਾ ਦੇਵੇ ਅਤੇ ਸਬੂਤ ਜਾਂਚੇ।`,
    `ਨਹੀਂ। ${b} ਉੱਤੇ ਅਟੱਲ ਕਾਰਵਾਈ ਤੋਂ ਪਹਿਲਾਂ ${a} ਨੂੰ ਸਬੂਤ ਵੇਖਣ ਅਤੇ ਪ੍ਰਭਾਵਿਤ ਵਿਅਕਤੀ ਨੂੰ ਆਪਣਾ ਪੱਖ ਰੱਖਣ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।`,
  ];
  if (qlId === "ARG-QL-006" && semanticRole === "MISTAKEN") return [
    `ਨਹੀਂ। ਜੇ ${b} ਗਲਤ ਹੋਵੇ, ਤਾਂ ${a} ਦੀ ਸਥਾਈ ਸਜ਼ਾ ਗੰਭੀਰ ਨੁਕਸਾਨ ਕਰ ਸਕਦੀ ਹੈ ਜੋ ਬਾਅਦ ਵਿੱਚ ਵਾਪਸ ਨਾ ਹੋ ਸਕੇ।`,
    `ਨਹੀਂ। ਗਲਤ ${b} ਕਾਰਨ ${a} ਗਲਤੀ ਪਤਾ ਲੱਗਣ ਤੋਂ ਪਹਿਲਾਂ ਅਟੱਲ ਸਜ਼ਾ ਦੇ ਕੇ ਗੰਭੀਰ ਨੁਕਸਾਨ ਕਰ ਸਕਦਾ ਹੈ।`,
    `ਨਹੀਂ। ${b} ਵਿੱਚ ਗਲਤੀ ਹੋਵੇ ਤਾਂ ${a} ਵੱਲੋਂ ਤਸਦੀਕ ਤੋਂ ਪਹਿਲਾਂ ਸਥਾਈ ਕਾਰਵਾਈ ਲੰਬੇ ਸਮੇਂ ਦਾ ਨੁਕਸਾਨ ਕਰ ਸਕਦੀ ਹੈ।`,
    `ਨਹੀਂ। ਜੇ ${a} ਗਲਤ ${b} ਦੇ ਆਧਾਰ ਉੱਤੇ ਸਥਾਈ ਸਜ਼ਾ ਦੇਵੇ, ਤਾਂ ਹੋਇਆ ਨੁਕਸਾਨ ਬਾਅਦ ਵਿੱਚ ਠੀਕ ਕਰਨਾ ਅਸੰਭਵ ਹੋ ਸਕਦਾ ਹੈ।`,
  ];
  if (qlId === "ARG-QL-006" && semanticRole === "IGNORE") return [
    `ਨਹੀਂ। ਜੇ ${a} ${b} ਤੋਂ ਬਾਅਦ ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਨਹੀਂ ਦਿੰਦਾ, ਤਾਂ ਉਸ ਨੂੰ ਭਵਿੱਖ ਦੀ ਹਰ ਸ਼ਿਕਾਇਤ ਅਣਡਿੱਠੀ ਕਰਨੀ ਪਵੇਗੀ।`,
    `ਨਹੀਂ। ${b} ਉੱਤੇ ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਨਾ ਦੇਣ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ${a} ਨੂੰ ਬਾਅਦ ਦੀਆਂ ਸਾਰੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਛੱਡਣੀਆਂ ਪੈਣਗੀਆਂ।`,
    `ਨਹੀਂ। ${b} ਤੋਂ ਬਾਅਦ ਤੁਰੰਤ ਅਟੱਲ ਸਜ਼ਾ ਤੋਂ ਇਨਕਾਰ ਕਰਨ ਉੱਤੇ ${a} ਫਿਰ ਕਿਸੇ ਸ਼ਿਕਾਇਤ ਉੱਤੇ ਕਾਰਵਾਈ ਨਹੀਂ ਕਰ ਸਕਦਾ।`,
    `ਨਹੀਂ। ਜਦ ਤੱਕ ${a} ${b} ਤੋਂ ਬਾਅਦ ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਨਾ ਦੇਵੇ, ਉਸ ਨੂੰ ਭਵਿੱਖ ਦੀ ਹਰ ਸ਼ਿਕਾਇਤ ਅਣਡਿੱਠੀ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।`,
  ];
  if (qlId === "ARG-QL-006" && semanticRole === "CERTAIN_GUILT") return [
    `ਹਾਂ। ${b} ਸਿਰਫ਼ ਤਦ ਹੋ ਸਕਦਾ ਹੈ ਜਦੋਂ ਦੋਸ਼ ਪਹਿਲਾਂ ਹੀ ਪੱਕਾ ਹੋਵੇ, ਇਸ ਲਈ ${a} ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਦੇ ਸਕਦਾ ਹੈ।`,
    `ਹਾਂ। ${b} ਦਾ ਹੋਣਾ ਹੀ ਦੋਸ਼ ਨੂੰ ਨਿਰਣਾਇਕ ਤੌਰ ਉੱਤੇ ਸਾਬਤ ਕਰਦਾ ਹੈ ਅਤੇ ${a} ਵੱਲੋਂ ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਠੀਕ ਬਣਾਉਂਦਾ ਹੈ।`,
    `ਹਾਂ। ${a} ${b} ਨੂੰ ਪੱਕੇ ਦੋਸ਼ ਦਾ ਸਬੂਤ ਮੰਨ ਕੇ ਤੁਰੰਤ ਅਟੱਲ ਸਜ਼ਾ ਦੇ ਸਕਦਾ ਹੈ।`,
    `ਹਾਂ। ਜਦੋਂ ਵੀ ${b} ਹੋਵੇ, ਦੋਸ਼ ਬਿਨਾਂ ਸੰਦੇਹ ਸਥਾਪਿਤ ਮੰਨਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ ਅਤੇ ${a} ਨੂੰ ਹੋਰ ਜਾਂਚ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।`,
  ];
  return undefined;
}

function variants(locale: Locale, qlId: string, semanticRole: string, captured: Captured): readonly string[] | undefined {
  if (locale === "hi-IN") return hindi(qlId, semanticRole, captured.a, captured.b);
  if (locale === "pa-IN") return punjabi(qlId, semanticRole, captured.a, captured.b);
  return english(qlId, semanticRole, captured.a, captured.b);
}

function rebuildStem(locale: Locale, statement: string, argumentsList: readonly string[]): string {
  const statementLabel = locale === "hi-IN" ? "कथन" : locale === "pa-IN" ? "ਕਥਨ" : "Statement";
  const argumentLabel = locale === "hi-IN" ? "तर्क" : locale === "pa-IN" ? "ਦਲੀਲਾਂ" : "Arguments";
  return `${statementLabel}: ${statement}\n${argumentLabel}:\n${argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n")}`;
}

export function contextualizeArgCp015ComboArguments(
  question: Question,
  profile: string,
  difficulty: string,
  candidateSeed: string,
): Question {
  if (profile !== "BANKING_COMBO_3X5" && profile !== "BANKING_COMBO_4X5") return question;
  const locale = localeOf(question);
  if (!locale) return question;
  const qlId = text(question.qlId);
  const sourceStatement = text(question.sourceStatement) || text(question.statement);
  const captured = capture(locale, qlId, sourceStatement);
  if (!captured) return question;
  const sourceArguments = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (sourceArguments.length !== 3 && sourceArguments.length !== 4) return question;

  let changed = false;
  const argumentsList = Object.freeze(sourceArguments.map((argument, index) => {
    const semanticRole = role(qlId, argument);
    if (!semanticRole) return argument;
    const options = variants(locale, qlId, semanticRole, captured);
    if (!options?.length) return argument;
    const next = pick(options, slot(profile, difficulty, candidateSeed, index));
    changed ||= next !== argument;
    return next;
  }));
  if (!changed) return question;

  const statement = text(question.statement);
  const stem = rebuildStem(locale, statement, argumentsList);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_COMBO_ARGUMENT_SURFACE_AUTHORITY,
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
    question.explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    arguments: argumentsList,
    stem,
    text: stem,
    preArgumentContextualizationArguments: question.arguments,
    comboArgumentSurfaceAuthority: ARG_CP015_COMBO_ARGUMENT_SURFACE_AUTHORITY,
    questionId: `ARG-001:${question.qlId}:${profile}:${locale}:CP015:${contentFingerprint.slice(0, 20)}`,
    canonicalItemId: `${question.canonicalItemId}:CP015:ARGCTX`,
    contentFingerprint,
    diversitySourceMode: "CP014_APPROVED_SEMANTICS_WITH_CP015_CONTEXTUALIZED_COMBO_ARGUMENT_SURFACE" as const,
  });
}
