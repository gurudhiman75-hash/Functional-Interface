export type Mal001LocalizedLanguage = "hi" | "pa";

export const MAL_001_MULTILINGUAL_QUESTION_STUDIO_V1 = Object.freeze({
  localizationId: "MAL-001-HI-PA-QUESTION-STUDIO-V1",
  packageId: "MAL-001",
  languages: ["hi", "pa"] as const,
  mathematicalAuthorityLanguage: "en" as const,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

type Replacement = readonly [string, string];

const SHARED_PHRASES: readonly string[] = [
  "Method 1 — Simple Method",
  "Method 2 — Alligation Cross",
  "Simple Method",
  "Alligation Cross",
  "in the same order",
  "in that order",
  "in the order asked",
  "per litre",
  "per kg",
  "cost price",
  "average price",
  "average-value equation",
  "weighted-average cost",
  "profit percentage",
  "final concentration",
  "initial concentration",
  "original total quantity",
  "total quantity",
  "original quantity",
  "final quantity",
  "required quantity",
  "well-mixed contents",
  "well-mixed mixture",
  "well-mixed liquid",
  "well-mixed",
  "pure water",
  "pure milk",
  "pure fruit juice",
  "pure rose syrup",
  "pure orange juice",
  "pure ghee",
  "premium-grade rice",
  "standard-grade rice",
  "high-grade wheat",
  "standard wheat",
  "select wheat",
  "regular tea leaves",
  "premium tea leaves",
  "house-blend beans",
  "estate beans",
  "regular oil",
  "premium oil",
  "cold-pressed oil",
  "mustard oil",
  "coconut oil",
  "red lentils",
  "yellow lentils",
  "green lentils",
  "Assam tea",
  "Darjeeling tea",
  "fruit concentrate",
  "syrup concentrate",
  "acid solution",
  "alcohol solution",
  "salt-water solution",
  "alcohol-water mixture",
  "spirit-water mixture",
  "milk-water mixture",
  "fruit juice-water mixture",
  "dissolved solute",
  "dry matter",
  "same concentration",
  "same quantity",
  "one ratio part",
  "ratio parts",
  "one part",
  "target ratio",
  "initial ratio",
  "final ratio",
  "new ratio",
  "starting volume",
  "final volume",
  "total volume",
  "retained fraction",
  "cumulative retained fraction",
  "original component",
  "original solution",
  "original syrup",
  "amount added",
  "amount removed",
  "amount of water",
  "free water",
  "the mixture is sold",
  "the mixture is valued",
  "is sold at",
  "is added",
  "is removed",
  "are removed",
  "are transferred",
  "is transferred",
  "is moved",
  "are moved",
  "and replaced with",
  "without replacement",
  "after every removal",
  "After mixing",
  "after mixing",
  "After drying",
  "after drying",
  "On evaporation of water",
  "only water evaporates",
  "remains unchanged",
  "should be added",
  "must be added",
  "should be removed",
  "must be removed",
  "must be mixed with",
  "should be mixed",
  "must be moved",
  "to change the concentration to",
  "to produce a mixture worth",
  "to make the ratio",
  "to earn",
  "to obtain",
  "in each operation",
  "each time",
  "Every time",
  "What quantity",
  "what quantity",
  "What ratio",
  "what ratio",
  "What percentage",
  "what percentage",
  "How much",
  "How many",
  "In what ratio",
  "At what rate",
] as const;

const HI_PHRASES: readonly string[] = [
  "विधि 1 — सरल विधि", "विधि 2 — एलिगेशन क्रॉस", "सरल विधि", "एलिगेशन क्रॉस",
  "उसी क्रम में", "उसी क्रम में", "पूछे गए क्रम में", "प्रति लीटर", "प्रति किग्रा", "क्रय मूल्य", "औसत मूल्य", "औसत-मूल्य समीकरण", "भारित औसत लागत", "लाभ प्रतिशत", "अंतिम सांद्रता", "प्रारंभिक सांद्रता", "मूल कुल मात्रा", "कुल मात्रा", "मूल मात्रा", "अंतिम मात्रा", "आवश्यक मात्रा", "अच्छी तरह मिले मिश्रण", "अच्छी तरह मिले मिश्रण", "अच्छी तरह मिले द्रव", "अच्छी तरह मिला", "शुद्ध पानी", "शुद्ध दूध", "शुद्ध फलों का रस", "शुद्ध गुलाब शरबत", "शुद्ध संतरे का रस", "शुद्ध घी", "प्रीमियम चावल", "मानक चावल", "उच्च-ग्रेड गेहूँ", "मानक गेहूँ", "चुना हुआ गेहूँ", "सामान्य चाय पत्ती", "प्रीमियम चाय पत्ती", "हाउस-ब्लेंड कॉफी बीन्स", "एस्टेट कॉफी बीन्स", "सामान्य तेल", "प्रीमियम तेल", "कोल्ड-प्रेस्ड तेल", "सरसों का तेल", "नारियल तेल", "लाल दाल", "पीली दाल", "हरी दाल", "असम चाय", "दार्जिलिंग चाय", "फलों का कंसन्ट्रेट", "शरबत कंसन्ट्रेट", "अम्ल घोल", "अल्कोहल घोल", "नमक-पानी का घोल", "अल्कोहल-पानी का मिश्रण", "स्पिरिट-पानी का मिश्रण", "दूध-पानी का मिश्रण", "फल-रस और पानी का मिश्रण", "घुला हुआ विलेय", "शुष्क पदार्थ", "समान सांद्रता", "समान मात्रा", "अनुपात का एक भाग", "अनुपात के भाग", "एक भाग", "लक्षित अनुपात", "प्रारंभिक अनुपात", "अंतिम अनुपात", "नया अनुपात", "प्रारंभिक आयतन", "अंतिम आयतन", "कुल आयतन", "बचा हुआ अंश", "कुल बचा हुआ अंश", "मूल घटक", "मूल घोल", "मूल शरबत", "जोड़ी गई मात्रा", "निकाली गई मात्रा", "पानी की मात्रा", "बिना लागत का पानी", "मिश्रण बेचा जाता है", "मिश्रण का मूल्य", "पर बेचा जाता है", "जोड़ा जाता है", "निकाला जाता है", "निकाले जाते हैं", "स्थानांतरित किए जाते हैं", "स्थानांतरित किया जाता है", "स्थानांतरित किया जाता है", "स्थानांतरित किए जाते हैं", "और उसकी जगह", "बिना वापस भरे", "हर निकासी के बाद", "मिलाने के बाद", "मिलाने के बाद", "सुखाने के बाद", "सुखाने के बाद", "पानी के वाष्पीकरण पर", "केवल पानी वाष्पित होता है", "अपरिवर्तित रहता है", "जोड़ा जाना चाहिए", "जोड़ना होगा", "निकाला जाना चाहिए", "निकालना होगा", "के साथ मिलाना होगा", "मिलाया जाना चाहिए", "स्थानांतरित करना होगा", "सांद्रता को बदलकर", "मूल्य का मिश्रण बनाने के लिए", "अनुपात को", "कमाने के लिए", "प्राप्त करने के लिए", "हर क्रिया में", "हर बार", "हर बार", "कितनी मात्रा", "कितनी मात्रा", "कौन-सा अनुपात", "कौन-सा अनुपात", "कितना प्रतिशत", "कितना प्रतिशत", "कितनी मात्रा", "कितने", "किस अनुपात में", "किस दर पर",
] as const;

const PA_PHRASES: readonly string[] = [
  "ਤਰੀਕਾ 1 — ਸਧਾਰਣ ਤਰੀਕਾ", "ਤਰੀਕਾ 2 — ਐਲੀਗੇਸ਼ਨ ਕ੍ਰਾਸ", "ਸਧਾਰਣ ਤਰੀਕਾ", "ਐਲੀਗੇਸ਼ਨ ਕ੍ਰਾਸ",
  "ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ", "ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ", "ਪੁੱਛੇ ਕ੍ਰਮ ਵਿੱਚ", "ਪ੍ਰਤੀ ਲੀਟਰ", "ਪ੍ਰਤੀ ਕਿਲੋਗ੍ਰਾਮ", "ਖਰੀਦ ਮੁੱਲ", "ਔਸਤ ਮੁੱਲ", "ਔਸਤ-ਮੁੱਲ ਸਮੀਕਰਨ", "ਭਾਰਿਤ ਔਸਤ ਲਾਗਤ", "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ", "ਅੰਤਿਮ ਸੰਘਣਾਪਣ", "ਸ਼ੁਰੂਆਤੀ ਸੰਘਣਾਪਣ", "ਮੂਲ ਕੁੱਲ ਮਾਤਰਾ", "ਕੁੱਲ ਮਾਤਰਾ", "ਮੂਲ ਮਾਤਰਾ", "ਅੰਤਿਮ ਮਾਤਰਾ", "ਲੋੜੀਂਦੀ ਮਾਤਰਾ", "ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ", "ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ", "ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਤਰਲ", "ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਿਆ", "ਸ਼ੁੱਧ ਪਾਣੀ", "ਸ਼ੁੱਧ ਦੁੱਧ", "ਸ਼ੁੱਧ ਫਲਾਂ ਦਾ ਰਸ", "ਸ਼ੁੱਧ ਗੁਲਾਬ ਸ਼ਰਬਤ", "ਸ਼ੁੱਧ ਸੰਤਰੇ ਦਾ ਰਸ", "ਸ਼ੁੱਧ ਘਿਉ", "ਪ੍ਰੀਮੀਅਮ ਚੌਲ", "ਮਿਆਰੀ ਚੌਲ", "ਉੱਚ-ਗ੍ਰੇਡ ਕਣਕ", "ਮਿਆਰੀ ਕਣਕ", "ਚੁਣੀ ਹੋਈ ਕਣਕ", "ਆਮ ਚਾਹ ਪੱਤੀ", "ਪ੍ਰੀਮੀਅਮ ਚਾਹ ਪੱਤੀ", "ਹਾਊਸ-ਬਲੈਂਡ ਕੌਫੀ ਬੀਨਜ਼", "ਐਸਟੇਟ ਕੌਫੀ ਬੀਨਜ਼", "ਆਮ ਤੇਲ", "ਪ੍ਰੀਮੀਅਮ ਤੇਲ", "ਕੋਲਡ-ਪ੍ਰੈੱਸਡ ਤੇਲ", "ਸਰੋਂ ਦਾ ਤੇਲ", "ਨਾਰੀਅਲ ਤੇਲ", "ਲਾਲ ਦਾਲ", "ਪੀਲੀ ਦਾਲ", "ਹਰੀ ਦਾਲ", "ਅਸਾਮ ਚਾਹ", "ਦਾਰਜੀਲਿੰਗ ਚਾਹ", "ਫਲਾਂ ਦਾ ਕਨਸਨਟ੍ਰੇਟ", "ਸ਼ਰਬਤ ਕਨਸਨਟ੍ਰੇਟ", "ਤੇਜ਼ਾਬੀ ਘੋਲ", "ਅਲਕੋਹਲ ਘੋਲ", "ਨਮਕ-ਪਾਣੀ ਦਾ ਘੋਲ", "ਅਲਕੋਹਲ-ਪਾਣੀ ਮਿਸ਼ਰਣ", "ਸਪਿਰਿਟ-ਪਾਣੀ ਮਿਸ਼ਰਣ", "ਦੁੱਧ-ਪਾਣੀ ਮਿਸ਼ਰਣ", "ਫਲ-ਰਸ ਅਤੇ ਪਾਣੀ ਦਾ ਮਿਸ਼ਰਣ", "ਘੁਲਿਆ ਹੋਇਆ ਵਿੱਲੇਯ", "ਸੁੱਕਾ ਪਦਾਰਥ", "ਇੱਕੋ ਸੰਘਣਾਪਣ", "ਇੱਕੋ ਮਾਤਰਾ", "ਅਨੁਪਾਤ ਦਾ ਇੱਕ ਹਿੱਸਾ", "ਅਨੁਪਾਤ ਦੇ ਹਿੱਸੇ", "ਇੱਕ ਹਿੱਸਾ", "ਟੀਚਾ ਅਨੁਪਾਤ", "ਸ਼ੁਰੂਆਤੀ ਅਨੁਪਾਤ", "ਅੰਤਿਮ ਅਨੁਪਾਤ", "ਨਵਾਂ ਅਨੁਪਾਤ", "ਸ਼ੁਰੂਆਤੀ ਆਇਤਨ", "ਅੰਤਿਮ ਆਇਤਨ", "ਕੁੱਲ ਆਇਤਨ", "ਬਚਿਆ ਅੰਸ਼", "ਕੁੱਲ ਬਚਿਆ ਅੰਸ਼", "ਮੂਲ ਘਟਕ", "ਮੂਲ ਘੋਲ", "ਮੂਲ ਸ਼ਰਬਤ", "ਜੋੜੀ ਮਾਤਰਾ", "ਕੱਢੀ ਮਾਤਰਾ", "ਪਾਣੀ ਦੀ ਮਾਤਰਾ", "ਬਿਨਾਂ ਲਾਗਤ ਵਾਲਾ ਪਾਣੀ", "ਮਿਸ਼ਰਣ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ", "ਮਿਸ਼ਰਣ ਦਾ ਮੁੱਲ", "'ਤੇ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ", "ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ", "ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ", "ਕੱਢੇ ਜਾਂਦੇ ਹਨ", "ਟ੍ਰਾਂਸਫਰ ਕੀਤੇ ਜਾਂਦੇ ਹਨ", "ਟ੍ਰਾਂਸਫਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ", "ਟ੍ਰਾਂਸਫਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ", "ਟ੍ਰਾਂਸਫਰ ਕੀਤੇ ਜਾਂਦੇ ਹਨ", "ਅਤੇ ਉਸ ਦੀ ਥਾਂ", "ਬਿਨਾਂ ਮੁੜ ਭਰੇ", "ਹਰ ਵਾਰ ਕੱਢਣ ਤੋਂ ਬਾਅਦ", "ਮਿਲਾਉਣ ਤੋਂ ਬਾਅਦ", "ਮਿਲਾਉਣ ਤੋਂ ਬਾਅਦ", "ਸੁਕਾਉਣ ਤੋਂ ਬਾਅਦ", "ਸੁਕਾਉਣ ਤੋਂ ਬਾਅਦ", "ਪਾਣੀ ਦੇ ਬਾਫ਼ ਬਣਨ 'ਤੇ", "ਕੇਵਲ ਪਾਣੀ ਬਾਫ਼ ਬਣਦਾ ਹੈ", "ਬਦਲਦਾ ਨਹੀਂ", "ਜੋੜਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ", "ਜੋੜਨਾ ਪਵੇਗਾ", "ਕੱਢਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ", "ਕੱਢਣਾ ਪਵੇਗਾ", "ਨਾਲ ਮਿਲਾਉਣਾ ਪਵੇਗਾ", "ਮਿਲਾਇਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ", "ਟ੍ਰਾਂਸਫਰ ਕਰਨਾ ਪਵੇਗਾ", "ਸੰਘਣਾਪਣ ਨੂੰ ਬਦਲ ਕੇ", "ਮੁੱਲ ਦਾ ਮਿਸ਼ਰਣ ਬਣਾਉਣ ਲਈ", "ਅਨੁਪਾਤ ਨੂੰ", "ਕਮਾਉਣ ਲਈ", "ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ", "ਹਰ ਕਿਰਿਆ ਵਿੱਚ", "ਹਰ ਵਾਰ", "ਹਰ ਵਾਰ", "ਕਿੰਨੀ ਮਾਤਰਾ", "ਕਿੰਨੀ ਮਾਤਰਾ", "ਕਿਹੜਾ ਅਨੁਪਾਤ", "ਕਿਹੜਾ ਅਨੁਪਾਤ", "ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ", "ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ", "ਕਿੰਨੀ ਮਾਤਰਾ", "ਕਿੰਨੇ", "ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ", "ਕਿਹੜੀ ਦਰ 'ਤੇ",
] as const;

function phrases(language: Mal001LocalizedLanguage): readonly Replacement[] {
  const translated = language === "hi" ? HI_PHRASES : PA_PHRASES;
  if (translated.length !== SHARED_PHRASES.length) {
    throw new Error(`MAL-001 ${language} phrase table is misaligned.`);
  }
  return SHARED_PHRASES.map((source, index) => [source, translated[index]!] as const);
}

function lexicon(source: string): Readonly<Record<string, string>> {
  return Object.freeze(Object.fromEntries(
    source.trim().split(/\n+/u).map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
  ));
}

const HI_WORDS = lexicon(`
a=एक
an=एक
the=
of=का
and=और
or=या
with=के साथ
from=से
to=को
in=में
at=पर
by=से
for=के लिए
as=के रूप में
into=में
on=पर
only=केवल
same=समान
different=अलग
every=हर
each=प्रत्येक
once=एक बार
again=फिर
back=वापस
together=साथ
mixture=मिश्रण
mixtures=मिश्रण
solution=घोल
liquid=द्रव
contents=मिश्रण
component=घटक
ingredient=घटक
ingredients=घटक
grade=ग्रेड
grades=ग्रेड
item=वस्तु
batch=बैच
sample=नमूना
vessel=पात्र
vessels=पात्र
container=पात्र
tank=टंकी
can=डिब्बा
quantity=मात्रा
quantities=मात्राएँ
amount=मात्रा
total=कुल
average=औसत
value=मूल्य
price=मूल्य
cost=लागत
rate=दर
ratio=अनुपात
proportion=अनुपात
part=भाग
parts=भाग
fraction=अंश
percentage=प्रतिशत
percent=प्रतिशत
concentration=सांद्रता
volume=आयतन
capacity=क्षमता
mass=भार
moisture=नमी
profit=लाभ
revenue=बिक्री राशि
selling=विक्रय
target=लक्षित
required=आवश्यक
known=ज्ञात
unknown=अज्ञात
original=मूल
initial=प्रारंभिक
final=अंतिम
new=नया
remaining=शेष
retained=बचा हुआ
pure=शुद्ध
free=बिना लागत
equal=समान
fixed=निश्चित
litre=लीटर
litres=लीटर
kg=किग्रा
ml=मिलीलीटर
unit=इकाई
units=इकाइयाँ
operation=क्रिया
operations=क्रियाएँ
replacement=प्रतिस्थापन
replacements=प्रतिस्थापन
removal=निकासी
stage=चरण
process=प्रक्रिया
check=जाँच
order=क्रम
answer=उत्तर
equation=समीकरण
terms=पद
difference=अंतर
differences=अंतर
denominator=हर
root=मूल
square=वर्ग
water=पानी
milk=दूध
oil=तेल
rice=चावल
wheat=गेहूँ
barley=जौ
tea=चाय
coffee=कॉफी
beans=बीन्स
lentils=दाल
copper=ताँबा
zinc=जस्ता
diesel=डीजल
kerosene=मिट्टी का तेल
petrol=पेट्रोल
ethanol=एथेनॉल
syrup=शरबत
solvent=विलायक
acid=अम्ल
alcohol=अल्कोहल
salt=नमक
spirit=स्पिरिट
glycerin=ग्लिसरीन
cement=सीमेंट
sand=रेत
juice=रस
fruit=फल
ghee=घी
vanaspati=वनस्पति
chicory=चिकोरी
concentrate=कंसन्ट्रेट
solute=विलेय
matter=पदार्थ
dry=सूखा
wet=गीला
fresh=ताज़ा
dried=सूखा
regular=सामान्य
premium=प्रीमियम
standard=मानक
select=चुना हुआ
high=उच्च
lower=निम्न
adulterated=मिलावटी
added=जोड़ा
removed=निकाला
mixed=मिलाया
blended=मिलाया
transferred=स्थानांतरित
moved=स्थानांतरित
replaced=बदला
refilling=वापस भरना
restored=वापस भरा
drawn=निकाला
sent=भेजा
swapped=अदला-बदली
evaporates=वाष्पित होता है
evaporation=वाष्पीकरण
drying=सुखाना
rises=बढ़ती है
becomes=हो जाता है
became=हो गया
exceed=से अधिक हो
reach=पहुँचे
earn=कमाएँ
earns=कमाता है
gives=देता है
obtain=प्राप्त करें
obtains=प्राप्त करता है
produce=बनाएँ
prepares=तैयार करता है
combines=मिलाता है
contains=में है
contain=में हैं
has=में है
holds=में है
starts=शुरू होता है
records=दर्ज करता है
uses=उपयोग करता है
buys=खरीदता है
sells=बेचता है
mixes=मिलाता है
adds=जोड़ता है
adulterates=मिलावट करता है
transfers=स्थानांतरित करता है
return=वापस करें
returns=वापस करता है
remains=बचा रहता है
present=मौजूद
needed=आवश्यक
worth=मूल्य का
priced=मूल्य वाले
costing=लागत वाले
valued=मूल्यांकित
sold=बेचा
finally=अंत में
initially=शुरू में
what=क्या
how=कितना
many=कितने
much=कितनी मात्रा
which=कौन-सा
will=होगा
should=चाहिए
must=होगा
is=है
are=हैं
was=था
were=थे
be=हो
being=होते हुए
it=यह
its=इसका
their=उनकी
both=दोनों
two=दो
three=तीन
one=एक
first=पहला
last=अंतिम
next=अगला
after=बाद
before=पहले
then=फिर
if=यदि
so=अतः
that=कि
this=यह
these=ये
those=वे
given=दिया
using=उपयोग करके
use=उपयोग करें
let=मान लें
find=ज्ञात करें
calculate=गणना करें
form=बनाएँ
write=लिखें
solve=हल करें
set=बराबर रखें
multiply=गुणा करें
divide=भाग दें
add=जोड़ें
subtract=घटाएँ
compare=तुलना करें
increase=बढ़ाएँ
change=बदलें
take=लें
taken=निकाला
out=बाहर
without=बिना
still=अभी भी
more=अधिक
less=कम
higher=अधिक
dearer=महँगा
cheaper=सस्ता
actual=वास्तविक
stated=दिया गया
shown=दिखाया गया
opposite=विपरीत
single=एक
complete=पूरा
uniformly=समान रूप से
simultaneously=एक साथ
successive=क्रमिक
respectively=क्रमशः
distributor=वितरक
roaster=रोस्टर
seller=विक्रेता
wholesaler=थोक विक्रेता
merchant=व्यापारी
dealer=व्यापारी
vendor=विक्रेता
dairyman=दूध विक्रेता
storekeeper=दुकानदार
student=विद्यार्थी
grain=अनाज
dairy=डेयरी
drink=पेय
beverage=पेय
apple=सेब
orange=संतरा
rose=गुलाब
assam=असम
darjeeling=दार्जिलिंग
estate=एस्टेट
house=हाउस
blend=ब्लेंड
pressed=प्रेस्ड
`);

const PA_WORDS = lexicon(`
a=ਇੱਕ
an=ਇੱਕ
the=
of=ਦਾ
and=ਅਤੇ
or=ਜਾਂ
with=ਨਾਲ
from=ਤੋਂ
to=ਨੂੰ
in=ਵਿੱਚ
at='ਤੇ
by=ਨਾਲ
for=ਲਈ
as=ਵਜੋਂ
into=ਵਿੱਚ
on='ਤੇ
only=ਕੇਵਲ
same=ਇੱਕੋ
different=ਵੱਖਰੀ
every=ਹਰ
each=ਹਰੇਕ
once=ਇੱਕ ਵਾਰ
again=ਫਿਰ
back=ਵਾਪਸ
together=ਇਕੱਠੇ
mixture=ਮਿਸ਼ਰਣ
mixtures=ਮਿਸ਼ਰਣ
solution=ਘੋਲ
liquid=ਤਰਲ
contents=ਮਿਸ਼ਰਣ
component=ਘਟਕ
ingredient=ਘਟਕ
ingredients=ਘਟਕ
grade=ਗ੍ਰੇਡ
grades=ਗ੍ਰੇਡ
item=ਵਸਤੂ
batch=ਬੈਚ
sample=ਨਮੂਨਾ
vessel=ਭਾਂਡਾ
vessels=ਭਾਂਡੇ
container=ਭਾਂਡਾ
tank=ਟੈਂਕ
can=ਡੱਬਾ
quantity=ਮਾਤਰਾ
quantities=ਮਾਤਰਾਵਾਂ
amount=ਮਾਤਰਾ
total=ਕੁੱਲ
average=ਔਸਤ
value=ਮੁੱਲ
price=ਮੁੱਲ
cost=ਲਾਗਤ
rate=ਦਰ
ratio=ਅਨੁਪਾਤ
proportion=ਅਨੁਪਾਤ
part=ਹਿੱਸਾ
parts=ਹਿੱਸੇ
fraction=ਅੰਸ਼
percentage=ਪ੍ਰਤੀਸ਼ਤ
percent=ਪ੍ਰਤੀਸ਼ਤ
concentration=ਸੰਘਣਾਪਣ
volume=ਆਇਤਨ
capacity=ਸਮਰੱਥਾ
mass=ਭਾਰ
moisture=ਨਮੀ
profit=ਲਾਭ
revenue=ਵਿਕਰੀ ਰਕਮ
selling=ਵਿਕਰੀ
target=ਟੀਚਾ
required=ਲੋੜੀਂਦੀ
known=ਪਤਾ
unknown=ਅਣਜਾਣ
original=ਮੂਲ
initial=ਸ਼ੁਰੂਆਤੀ
final=ਅੰਤਿਮ
new=ਨਵਾਂ
remaining=ਬਾਕੀ
retained=ਬਚਿਆ
pure=ਸ਼ੁੱਧ
free=ਬਿਨਾਂ ਲਾਗਤ
equal=ਬਰਾਬਰ
fixed=ਨਿਰਧਾਰਤ
litre=ਲੀਟਰ
litres=ਲੀਟਰ
kg=ਕਿਲੋਗ੍ਰਾਮ
ml=ਮਿਲੀਲੀਟਰ
unit=ਇਕਾਈ
units=ਇਕਾਈਆਂ
operation=ਕਿਰਿਆ
operations=ਕਿਰਿਆਵਾਂ
replacement=ਬਦਲੀ
replacements=ਬਦਲੀਆਂ
removal=ਕੱਢਣਾ
stage=ਪੜਾਅ
process=ਪ੍ਰਕਿਰਿਆ
check=ਜਾਂਚ
order=ਕ੍ਰਮ
answer=ਉੱਤਰ
equation=ਸਮੀਕਰਨ
terms=ਪਦ
difference=ਫਰਕ
differences=ਫਰਕ
denominator=ਹਰ
root=ਮੂਲ
square=ਵਰਗ
water=ਪਾਣੀ
milk=ਦੁੱਧ
oil=ਤੇਲ
rice=ਚੌਲ
wheat=ਕਣਕ
barley=ਜੌਂ
tea=ਚਾਹ
coffee=ਕੌਫੀ
beans=ਬੀਨਜ਼
lentils=ਦਾਲ
copper=ਤਾਂਬਾ
zinc=ਜ਼ਿੰਕ
diesel=ਡੀਜ਼ਲ
kerosene=ਮਿੱਟੀ ਦਾ ਤੇਲ
petrol=ਪੈਟਰੋਲ
ethanol=ਈਥਨਾਲ
syrup=ਸ਼ਰਬਤ
solvent=ਘੋਲਕ
acid=ਤੇਜ਼ਾਬ
alcohol=ਅਲਕੋਹਲ
salt=ਨਮਕ
spirit=ਸਪਿਰਿਟ
glycerin=ਗਲਿਸਰੀਨ
cement=ਸੀਮੈਂਟ
sand=ਰੇਤ
juice=ਰਸ
fruit=ਫਲ
ghee=ਘਿਉ
vanaspati=ਵਨਸਪਤੀ
chicory=ਚਿਕੋਰੀ
concentrate=ਕਨਸਨਟ੍ਰੇਟ
solute=ਵਿੱਲੇਯ
matter=ਪਦਾਰਥ
dry=ਸੁੱਕਾ
wet=ਗਿੱਲਾ
fresh=ਤਾਜ਼ਾ
dried=ਸੁੱਕਾ
regular=ਆਮ
premium=ਪ੍ਰੀਮੀਅਮ
standard=ਮਿਆਰੀ
select=ਚੁਣਿਆ
high=ਉੱਚ
lower=ਹੇਠਲਾ
adulterated=ਮਿਲਾਵਟੀ
added=ਜੋੜਿਆ
removed=ਕੱਢਿਆ
mixed=ਮਿਲਾਇਆ
blended=ਮਿਲਾਇਆ
transferred=ਟ੍ਰਾਂਸਫਰ
moved=ਟ੍ਰਾਂਸਫਰ
replaced=ਬਦਲਿਆ
refilling=ਮੁੜ ਭਰਨਾ
restored=ਮੁੜ ਭਰਿਆ
drawn=ਕੱਢਿਆ
sent=ਭੇਜਿਆ
swapped=ਅਦਲਾ-ਬਦਲੀ
evaporates=ਬਾਫ਼ ਬਣਦਾ ਹੈ
evaporation=ਬਾਫ਼ ਬਣਨਾ
drying=ਸੁਕਾਉਣਾ
rises=ਵਧਦਾ ਹੈ
becomes=ਹੋ ਜਾਂਦਾ ਹੈ
became=ਹੋ ਗਿਆ
exceed=ਤੋਂ ਵੱਧ ਹੋਵੇ
reach=ਪਹੁੰਚੇ
earn=ਕਮਾਓ
earns=ਕਮਾਉਂਦਾ ਹੈ
gives=ਦਿੰਦਾ ਹੈ
obtain=ਪ੍ਰਾਪਤ ਕਰੋ
obtains=ਪ੍ਰਾਪਤ ਕਰਦਾ ਹੈ
produce=ਬਣਾਓ
prepares=ਤਿਆਰ ਕਰਦਾ ਹੈ
combines=ਮਿਲਾਉਂਦਾ ਹੈ
contains=ਵਿੱਚ ਹੈ
contain=ਵਿੱਚ ਹਨ
has=ਵਿੱਚ ਹੈ
holds=ਵਿੱਚ ਹੈ
starts=ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ
records=ਦਰਜ ਕਰਦਾ ਹੈ
uses=ਵਰਤਦਾ ਹੈ
buys=ਖਰੀਦਦਾ ਹੈ
sells=ਵੇਚਦਾ ਹੈ
mixes=ਮਿਲਾਉਂਦਾ ਹੈ
adds=ਜੋੜਦਾ ਹੈ
adulterates=ਮਿਲਾਵਟ ਕਰਦਾ ਹੈ
transfers=ਟ੍ਰਾਂਸਫਰ ਕਰਦਾ ਹੈ
return=ਵਾਪਸ ਕਰੋ
returns=ਵਾਪਸ ਕਰਦਾ ਹੈ
remains=ਬਚਿਆ ਰਹਿੰਦਾ ਹੈ
present=ਮੌਜੂਦ
needed=ਲੋੜੀਂਦੀ
worth=ਮੁੱਲ ਦਾ
priced=ਮੁੱਲ ਵਾਲਾ
costing=ਲਾਗਤ ਵਾਲਾ
valued=ਮੁੱਲ ਵਾਲਾ
sold=ਵੇਚਿਆ
finally=ਅਖੀਰ ਵਿੱਚ
initially=ਸ਼ੁਰੂ ਵਿੱਚ
what=ਕੀ
how=ਕਿੰਨਾ
many=ਕਿੰਨੇ
much=ਕਿੰਨੀ ਮਾਤਰਾ
which=ਕਿਹੜਾ
will=ਹੋਵੇਗਾ
should=ਚਾਹੀਦਾ
must=ਪਵੇਗਾ
is=ਹੈ
are=ਹਨ
was=ਸੀ
were=ਸਨ
be=ਹੋਵੇ
being=ਹੁੰਦੇ ਹੋਏ
it=ਇਹ
its=ਇਸਦਾ
their=ਉਨ੍ਹਾਂ ਦੀ
both=ਦੋਵੇਂ
two=ਦੋ
three=ਤਿੰਨ
one=ਇੱਕ
first=ਪਹਿਲਾ
last=ਅੰਤਿਮ
next=ਅਗਲਾ
after=ਬਾਅਦ
before=ਪਹਿਲਾਂ
then=ਫਿਰ
if=ਜੇ
so=ਇਸ ਲਈ
that=ਕਿ
this=ਇਹ
these=ਇਹ
those=ਉਹ
given=ਦਿੱਤਾ
using=ਵਰਤ ਕੇ
use=ਵਰਤੋ
let=ਮੰਨ ਲਓ
find=ਪਤਾ ਕਰੋ
calculate=ਗਣਨਾ ਕਰੋ
form=ਬਣਾਓ
write=ਲਿਖੋ
solve=ਹੱਲ ਕਰੋ
set=ਬਰਾਬਰ ਰੱਖੋ
multiply=ਗੁਣਾ ਕਰੋ
divide=ਭਾਗ ਦਿਓ
add=ਜੋੜੋ
subtract=ਘਟਾਓ
compare=ਤੁਲਨਾ ਕਰੋ
increase=ਵਧਾਓ
change=ਬਦਲੋ
take=ਲਓ
taken=ਕੱਢਿਆ
out=ਬਾਹਰ
without=ਬਿਨਾਂ
still=ਹਾਲੇ ਵੀ
more=ਵੱਧ
less=ਘੱਟ
higher=ਵੱਧ
dearer=ਮਹਿੰਗਾ
cheaper=ਸਸਤਾ
actual=ਅਸਲ
stated=ਦਿੱਤਾ
shown=ਦਿਖਾਇਆ
opposite=ਉਲਟ
single=ਇੱਕ
complete=ਪੂਰਾ
uniformly=ਇਕਸਾਰ
simultaneously=ਇੱਕੋ ਸਮੇਂ
successive=ਲਗਾਤਾਰ
respectively=ਕ੍ਰਮਵਾਰ
distributor=ਵਿਤਰਕ
roaster=ਰੋਸਟਰ
seller=ਵਿਕਰੇਤਾ
wholesaler=ਥੋਕ ਵਿਕਰੇਤਾ
merchant=ਵਪਾਰੀ
dealer=ਵਪਾਰੀ
vendor=ਵਿਕਰੇਤਾ
dairyman=ਦੁੱਧ ਵਿਕਰੇਤਾ
storekeeper=ਦੁਕਾਨਦਾਰ
student=ਵਿਦਿਆਰਥੀ
grain=ਅਨਾਜ
dairy=ਡੇਅਰੀ
drink=ਪੇਅ
beverage=ਪੇਅ
apple=ਸੇਬ
orange=ਸੰਤਰਾ
rose=ਗੁਲਾਬ
assam=ਅਸਾਮ
darjeeling=ਦਾਰਜੀਲਿੰਗ
estate=ਐਸਟੇਟ
house=ਹਾਊਸ
blend=ਬਲੈਂਡ
pressed=ਪ੍ਰੈੱਸਡ
`);

function replacePhrases(value: string, language: Mal001LocalizedLanguage): string {
  return phrases(language).reduce(
    (text, [source, translated]) => text.split(source).join(translated),
    value,
  );
}

function replaceWords(value: string, language: Mal001LocalizedLanguage): string {
  const words = language === "hi" ? HI_WORDS : PA_WORDS;
  return value.replace(/\b[A-Za-z][A-Za-z'-]*\b/gu, (token) => {
    if (/^[A-CVxyqrT]$/u.test(token)) return token;
    return words[token.toLowerCase()] ?? token;
  });
}

function localizePlain(value: string, language: Mal001LocalizedLanguage): string {
  return replaceWords(replacePhrases(value, language), language)
    .replace(/\s{2,}/gu, " ")
    .replace(/\s+([,.?;:])/gu, "$1")
    .trim();
}

function localizeAlligationMarker(
  marker: string,
  language: Mal001LocalizedLanguage,
): string {
  const match = /^\[\[EXAMTREE_ALLIGATION_SVG_V1:([^\]]+)\]\]$/u.exec(marker);
  if (!match) return marker;
  try {
    const payload = JSON.parse(Buffer.from(match[1]!, "base64").toString("utf8"));
    const walk = (value: unknown): unknown => {
      if (typeof value === "string") return localizePlain(value, language);
      if (Array.isArray(value)) return value.map(walk);
      if (value && typeof value === "object") {
        return Object.fromEntries(
          Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, walk(entry)]),
        );
      }
      return value;
    };
    return `[[EXAMTREE_ALLIGATION_SVG_V1:${Buffer.from(JSON.stringify(walk(payload)), "utf8").toString("base64")}]]`;
  } catch {
    return marker;
  }
}

export function localizeMal001Text(
  value: string,
  language: Mal001LocalizedLanguage,
): string {
  const markers: string[] = [];
  const protectedValue = value.replace(
    /\[\[EXAMTREE_ALLIGATION_SVG_V1:[^\]]+\]\]/gu,
    (marker) => `§§ALLIGATION_${markers.push(marker) - 1}§§`,
  );
  const localized = localizePlain(protectedValue, language);
  return localized.replace(/§§ALLIGATION_(\d+)§§/gu, (_match, indexText) =>
    localizeAlligationMarker(markers[Number(indexText)] ?? "", language));
}

function localizeDeep(value: unknown, language: Mal001LocalizedLanguage): unknown {
  if (typeof value === "string") return localizeMal001Text(value, language);
  if (Array.isArray(value)) return value.map((entry) => localizeDeep(entry, language));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, localizeDeep(entry, language)]),
    );
  }
  return value;
}

export function applyMal001QuestionStudioLocalization<T extends Record<string, any>>(
  question: T,
  language: Mal001LocalizedLanguage,
): T {
  const options = question.options.map((option: string) => localizeMal001Text(option, language));
  const answer = localizeMal001Text(question.answer, language);
  const locale = language === "hi" ? "hi-IN" : "pa-IN";
  const aligned = options.length === 4 && new Set(options).size === 4 && options[question.correctIndex] === answer;
  const existingChecks = Array.isArray(question.validation?.checks) ? question.validation.checks : [];

  return {
    ...question,
    stem: localizeMal001Text(question.stem, language),
    options,
    answer,
    language,
    locale,
    explanationId: `${question.questionLanguageId}-${language.toUpperCase()}-QUESTION-STUDIO-V1`,
    explanation: localizeDeep(question.explanation, language),
    reasoningGraph: localizeDeep(question.reasoningGraph, language),
    reviewStatus: "APPROVED_MULTILINGUAL_QUESTION_STUDIO",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    validation: question.validation
      ? {
          ...question.validation,
          valid: question.validation.valid !== false && aligned,
          ok: question.validation.ok !== false && aligned,
          checks: [
            ...existingChecks,
            {
              name: "MULTILINGUAL_QUESTION_STUDIO_PARITY",
              passed: aligned,
              message: `${language} learner surface preserves four unique options and English answer ownership.`,
            },
          ],
        }
      : question.validation,
    traceability: {
      ...(question.traceability ?? {}),
      releaseId: `MAL-001-${language.toUpperCase()}-QUESTION-STUDIO-V1`,
      approvedLanguage: language,
      locale,
      mathematicalAuthorityLanguage: "en",
      localizationId: MAL_001_MULTILINGUAL_QUESTION_STUDIO_V1.localizationId,
      questionStudioConnected: true,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  } as T;
}
