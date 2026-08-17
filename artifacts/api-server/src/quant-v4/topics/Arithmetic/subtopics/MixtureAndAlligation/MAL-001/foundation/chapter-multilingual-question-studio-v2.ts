import {
  applyMal001QuestionStudioLocalization,
  localizeMal001Text,
  type Mal001LocalizedLanguage,
} from "./chapter-multilingual-question-studio-v1";

export const MAL_001_MULTILINGUAL_QUESTION_STUDIO_V2 = Object.freeze({
  localizationId: "MAL-001-HI-PA-QUESTION-STUDIO-V2",
  preservesRuntimeMetadata: true,
  mathematicalAuthorityLanguage: "en" as const,
});

type Phrase = readonly [string, string];

const PRE_PHRASES: Record<Mal001LocalizedLanguage, readonly Phrase[]> = {
  hi: [
    ["Bring like terms together", "समान पदों को एक तरफ लाएँ"],
    ["Add the value totals", "कुल मूल्यों को जोड़ें"],
    ["Add the quantities", "मात्राओं को जोड़ें"],
    ["Add the ratio parts", "अनुपात के भागों को जोड़ें"],
    ["Use the ratio numbers as sample quantities", "अनुपात की संख्याओं को नमूना मात्राएँ मानें"],
    ["Place the opposite differences under the two prices as shown in the cross", "क्रॉस में दिखाए अनुसार दोनों मूल्यों के नीचे विपरीत अंतर रखें"],
    ["Use the quantity ratio with those differences and solve the single unknown price", "इन अंतरों के साथ मात्रा-अनुपात का उपयोग करके अज्ञात मूल्य ज्ञात करें"],
    ["The unknown price is", "अज्ञात मूल्य है"],
    ["Dearer price − target", "महँगा मूल्य − लक्ष्य"],
    ["Target − cheaper price", "लक्ष्य − सस्ता मूल्य"],
    ["This is the cheaper item's part", "यह सस्ती वस्तु का भाग है"],
    ["This is the dearer item's part", "यह महँगी वस्तु का भाग है"],
    ["Known quantity", "ज्ञात मात्रा"],
    ["unknown quantity", "अज्ञात मात्रा"],
    ["Required total value", "आवश्यक कुल मूल्य"],
    ["Known total value", "ज्ञात कुल मूल्य"],
    ["Value for", "का मूल्य"],
    ["Price of", "का मूल्य"],
    ["Required average cost", "आवश्यक औसत लागत"],
    ["Cross differences give", "क्रॉस के अंतर से मिलता है"],
    ["Only water evaporates, so dissolved solute remains unchanged", "केवल पानी वाष्पित होता है, इसलिए घुला हुआ विलेय अपरिवर्तित रहता है"],
    ["Drying removes moisture, so dry matter remains unchanged", "सुखाने में नमी निकलती है, इसलिए शुष्क पदार्थ अपरिवर्तित रहता है"],
    ["Water is the remaining percentage after subtracting the alcohol percentage from 100%", "100% में से अल्कोहल प्रतिशत घटाने पर पानी का प्रतिशत मिलता है"],
    ["A mixture contains", "एक मिश्रण में"],
    ["A vessel contains", "एक पात्र में"],
    ["A container contains", "एक पात्र में"],
    ["A tank holds", "एक टंकी में"],
    ["The total amount of a mixture is", "मिश्रण की कुल मात्रा"],
    ["The total quantity is", "कुल मात्रा"],
    ["After adding", "जोड़ने के बाद"],
    ["After removing", "निकालने के बाद"],
    ["What is the resulting mixture's average price per kg", "बने मिश्रण का औसत मूल्य प्रति किग्रा कितना है"],
    ["What is the mixture's average price per kg", "मिश्रण का औसत मूल्य प्रति किग्रा कितना है"],
    ["What will the mixed tea leaves cost per kg", "मिली हुई चाय पत्ती का मूल्य प्रति किग्रा कितना होगा"],
    ["What is the price of", "का मूल्य कितना है"],
    ["What are their quantities", "उनकी मात्राएँ क्या हैं"],
    ["what is the new ratio", "नया अनुपात क्या है"],
    ["what is the final ratio", "अंतिम अनुपात क्या है"],
    ["what is the final concentration", "अंतिम सांद्रता कितनी है"],
  ],
  pa: [
    ["Bring like terms together", "ਇੱਕੋ ਕਿਸਮ ਦੇ ਪਦ ਇੱਕ ਪਾਸੇ ਲਿਆਓ"],
    ["Add the value totals", "ਕੁੱਲ ਮੁੱਲ ਜੋੜੋ"],
    ["Add the quantities", "ਮਾਤਰਾਵਾਂ ਜੋੜੋ"],
    ["Add the ratio parts", "ਅਨੁਪਾਤ ਦੇ ਹਿੱਸੇ ਜੋੜੋ"],
    ["Use the ratio numbers as sample quantities", "ਅਨੁਪਾਤ ਦੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਨਮੂਨਾ ਮਾਤਰਾਵਾਂ ਮੰਨੋ"],
    ["Place the opposite differences under the two prices as shown in the cross", "ਕ੍ਰਾਸ ਵਿੱਚ ਦਿਖਾਏ ਅਨੁਸਾਰ ਦੋਵੇਂ ਮੁੱਲਾਂ ਹੇਠ ਉਲਟ ਫਰਕ ਰੱਖੋ"],
    ["Use the quantity ratio with those differences and solve the single unknown price", "ਇਨ੍ਹਾਂ ਫਰਕਾਂ ਨਾਲ ਮਾਤਰਾ-ਅਨੁਪਾਤ ਵਰਤ ਕੇ ਅਣਜਾਣ ਮੁੱਲ ਕੱਢੋ"],
    ["The unknown price is", "ਅਣਜਾਣ ਮੁੱਲ ਹੈ"],
    ["Dearer price − target", "ਮਹਿੰਗਾ ਮੁੱਲ − ਟੀਚਾ"],
    ["Target − cheaper price", "ਟੀਚਾ − ਸਸਤਾ ਮੁੱਲ"],
    ["This is the cheaper item's part", "ਇਹ ਸਸਤੀ ਵਸਤੂ ਦਾ ਹਿੱਸਾ ਹੈ"],
    ["This is the dearer item's part", "ਇਹ ਮਹਿੰਗੀ ਵਸਤੂ ਦਾ ਹਿੱਸਾ ਹੈ"],
    ["Known quantity", "ਪਤਾ ਮਾਤਰਾ"],
    ["unknown quantity", "ਅਣਜਾਣ ਮਾਤਰਾ"],
    ["Required total value", "ਲੋੜੀਂਦਾ ਕੁੱਲ ਮੁੱਲ"],
    ["Known total value", "ਪਤਾ ਕੁੱਲ ਮੁੱਲ"],
    ["Value for", "ਦਾ ਮੁੱਲ"],
    ["Price of", "ਦਾ ਮੁੱਲ"],
    ["Required average cost", "ਲੋੜੀਂਦੀ ਔਸਤ ਲਾਗਤ"],
    ["Cross differences give", "ਕ੍ਰਾਸ ਦੇ ਫਰਕ ਤੋਂ ਮਿਲਦਾ ਹੈ"],
    ["Only water evaporates, so dissolved solute remains unchanged", "ਕੇਵਲ ਪਾਣੀ ਬਾਫ਼ ਬਣਦਾ ਹੈ, ਇਸ ਲਈ ਘੁਲਿਆ ਵਿੱਲੇਯ ਨਹੀਂ ਬਦਲਦਾ"],
    ["Drying removes moisture, so dry matter remains unchanged", "ਸੁਕਾਉਣ ਨਾਲ ਨਮੀ ਨਿਕਲਦੀ ਹੈ, ਇਸ ਲਈ ਸੁੱਕਾ ਪਦਾਰਥ ਨਹੀਂ ਬਦਲਦਾ"],
    ["Water is the remaining percentage after subtracting the alcohol percentage from 100%", "100% ਵਿੱਚੋਂ ਅਲਕੋਹਲ ਪ੍ਰਤੀਸ਼ਤ ਘਟਾਉਣ 'ਤੇ ਪਾਣੀ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਮਿਲਦਾ ਹੈ"],
    ["A mixture contains", "ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ"],
    ["A vessel contains", "ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ"],
    ["A container contains", "ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ"],
    ["A tank holds", "ਇੱਕ ਟੈਂਕ ਵਿੱਚ"],
    ["The total amount of a mixture is", "ਮਿਸ਼ਰਣ ਦੀ ਕੁੱਲ ਮਾਤਰਾ"],
    ["The total quantity is", "ਕੁੱਲ ਮਾਤਰਾ"],
    ["After adding", "ਜੋੜਨ ਤੋਂ ਬਾਅਦ"],
    ["After removing", "ਕੱਢਣ ਤੋਂ ਬਾਅਦ"],
    ["What is the resulting mixture's average price per kg", "ਬਣੇ ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ਪ੍ਰਤੀ ਕਿਲੋਗ੍ਰਾਮ ਕਿੰਨਾ ਹੈ"],
    ["What is the mixture's average price per kg", "ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ਪ੍ਰਤੀ ਕਿਲੋਗ੍ਰਾਮ ਕਿੰਨਾ ਹੈ"],
    ["What will the mixed tea leaves cost per kg", "ਮਿਲੀ ਚਾਹ ਪੱਤੀ ਦਾ ਮੁੱਲ ਪ੍ਰਤੀ ਕਿਲੋਗ੍ਰਾਮ ਕਿੰਨਾ ਹੋਵੇਗਾ"],
    ["What is the price of", "ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੈ"],
    ["What are their quantities", "ਉਨ੍ਹਾਂ ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਕੀ ਹਨ"],
    ["what is the new ratio", "ਨਵਾਂ ਅਨੁਪਾਤ ਕੀ ਹੈ"],
    ["what is the final ratio", "ਅੰਤਿਮ ਅਨੁਪਾਤ ਕੀ ਹੈ"],
    ["what is the final concentration", "ਅੰਤਿਮ ਸੰਘਣਾਪਣ ਕਿੰਨਾ ਹੈ"],
  ],
};

function supplementalLexicon(source: string): Readonly<Record<string, string>> {
  return Object.freeze(Object.fromEntries(
    source.trim().split(/\n+/u).map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
  ));
}

const HI_SUPPLEMENT = supplementalLexicon(`
method=विधि
cross=क्रॉस
per=प्रति
wants=चाहता है
want=चाहता है
resulting=बने हुए
result=परिणाम
represents=दर्शाता है
represent=दर्शाएँ
leaves=पत्ती
leaf=पत्ती
grades=ग्रेड
totals=कुल
prices=मूल्य
bring=लाएँ
like=समान
place=रखें
opposite=विपरीत
shown=दिखाए गए
give=देता है
given=दिया गया
gives=देता है
required=आवश्यक
requires=आवश्यक है
needed=आवश्यक
need=आवश्यक है
known=ज्ञात
unknown=अज्ञात
item=वस्तु
items=वस्तुएँ
item's=वस्तु का
ingredient's=घटक का
ingredient=घटक
ingredients=घटक
seller=विक्रेता
vendor=विक्रेता
merchant=व्यापारी
wholesaler=थोक विक्रेता
distributor=वितरक
roaster=रोस्टर
dairyman=दूध विक्रेता
dealer=व्यापारी
storekeeper=दुकानदार
student=विद्यार्थी
mix=मिलाएँ
mixes=मिलाता है
mixing=मिलाने
mixed=मिला हुआ
uses=उपयोग करता है
using=उपयोग करके
prepares=तैयार करता है
obtains=प्राप्त करता है
obtain=प्राप्त करें
contains=में है
contain=में हैं
present=मौजूद
became=हो गया
becomes=हो जाता है
become=हो जाए
left=बचा
behind=पीछे
still=अभी भी
now=अब
time=बार
times=बार
such=ऐसी
same=समान
respectively=क्रमशः
simultaneously=एक साथ
uniformly=समान रूप से
successive=क्रमिक
finally=अंत में
initially=शुरू में
first=पहले
next=फिर
then=फिर
last=अंतिम
current=वर्तमान
actual=वास्तविक
work=गणना
working=गणना
solving=हल करने पर
solve=हल करें
calculate=गणना करें
calculation=गणना
clear=हटाएँ
factor=गुणक
reduce=सरल करें
reduced=सरल
complete=पूरा
compare=तुलना करें
check=जाँच
threshold=सीमा
strict=सख्त
crossing=पार होना
above=से अधिक
below=से कम
exceeds=से अधिक हो जाता है
exceed=से अधिक हो
reaches=पहुँचता है
reach=पहुँचे
starting=प्रारंभिक
start=प्रारंभ
end=अंत
ending=अंतिम
fixed=निश्चित
full=पूरा
empty=खाली
drawn=निकाला
refill=वापस भरें
refilling=वापस भरना
restored=वापस भरा
replacement=प्रतिस्थापन
replacements=प्रतिस्थापन
removal=निकासी
remove=निकालें
removing=निकालने
added=जोड़ा गया
adding=जोड़ने
add=जोड़ें
transferred=स्थानांतरित
transfer=स्थानांतरित करें
transfers=स्थानांतरित करता है
moved=स्थानांतरित
move=स्थानांतरित करें
sent=भेजा
swapped=अदला-बदली
return=वापस करें
returns=वापस करता है
came=आया
back=वापस
only=केवल
pure=शुद्ध
free=बिना लागत
adulterated=मिलावटी
adulterates=मिलावट करता है
buys=खरीदता है
buy=खरीदें
sells=बेचता है
sold=बेचा
selling=विक्रय
earn=कमाएँ
earning=कमाते हुए
earns=कमाता है
revenue=बिक्री राशि
costing=लागत वाला
priced=मूल्य वाला
valued=मूल्यांकित
worth=मूल्य का
dearer=महँगा
cheaper=सस्ता
higher=अधिक
lower=कम
high-grade=उच्च-ग्रेड
standard-grade=मानक-ग्रेड
premium-grade=प्रीमियम-ग्रेड
three-grade=तीन-ग्रेड
cold-pressed=कोल्ड-प्रेस्ड
house-blend=हाउस-ब्लेंड
first-mixture=पहला-मिश्रण
well-mixed=अच्छी तरह मिला
ratio=अनुपात
ratios=अनुपात
quantity=मात्रा
quantities=मात्राएँ
amount=मात्रा
value=मूल्य
price=मूल्य
cost=लागत
average=औसत
profit=लाभ
percentage=प्रतिशत
concentration=सांद्रता
volume=आयतन
capacity=क्षमता
mass=भार
moisture=नमी
fraction=अंश
retained=बचा हुआ
cumulative=कुल
part=भाग
parts=भाग
operation=क्रिया
operations=क्रियाएँ
stage=चरण
process=प्रक्रिया
equation=समीकरण
terms=पद
difference=अंतर
differences=अंतर
denominator=हर
root=मूल
square=वर्ग
numbers=संख्याएँ
number=संख्या
sample=नमूना
samples=नमूने
unit=इकाई
units=इकाइयाँ
solution=घोल
mixture=मिश्रण
liquid=द्रव
contents=मिश्रण
component=घटक
solute=विलेय
solvent=विलायक
water=पानी
milk=दूध
syrup=शरबत
juice=रस
fruit=फल
acid=अम्ल
alcohol=अल्कोहल
salt=नमक
spirit=स्पिरिट
glycerin=ग्लिसरीन
petrol=पेट्रोल
ethanol=एथेनॉल
diesel=डीजल
kerosene=मिट्टी का तेल
oil=तेल
ghee=घी
vanaspati=वनस्पति
chicory=चिकोरी
concentrate=कंसन्ट्रेट
copper=ताँबा
zinc=जस्ता
wheat=गेहूँ
barley=जौ
cement=सीमेंट
sand=रेत
rice=चावल
tea=चाय
coffee=कॉफी
beans=बीन्स
lentils=दाल
red=लाल
yellow=पीली
green=हरी
assam=असम
darjeeling=दार्जिलिंग
estate=एस्टेट
regular=सामान्य
premium=प्रीमियम
standard=मानक
select=चुना हुआ
dry=सूखा
dried=सूखा
fresh=ताज़ा
matter=पदार्थ
dissolved=घुला हुआ
evaporates=वाष्पित होता है
evaporate=वाष्पित हो
evaporation=वाष्पीकरण
drying=सुखाना
rises=बढ़ती है
rise=बढ़े
proportion=अनुपात
respectively=क्रमशः
once=एक बार
every=हर
each=प्रत्येक
both=दोनों
some=कुछ
all=सभी
at=पर
from=से
into=में
with=के साथ
without=बिना
under=नीचे
over=ऊपर
before=पहले
after=बाद
again=फिर
out=बाहर
up=ऊपर
down=नीचे
more=अधिक
less=कम
remaining=शेष
final=अंतिम
initial=प्रारंभिक
original=मूल
new=नया
target=लक्षित
total=कुल
same=समान
equal=समान
different=अलग
single=एक
one-item=एक-वस्तु
`);

const PA_SUPPLEMENT = supplementalLexicon(`
method=ਤਰੀਕਾ
cross=ਕ੍ਰਾਸ
per=ਪ੍ਰਤੀ
wants=ਚਾਹੁੰਦਾ ਹੈ
want=ਚਾਹੁੰਦਾ ਹੈ
resulting=ਬਣੇ ਹੋਏ
result=ਨਤੀਜਾ
represents=ਦਰਸਾਉਂਦਾ ਹੈ
represent=ਦਰਸਾਓ
leaves=ਪੱਤੀ
leaf=ਪੱਤੀ
grades=ਗ੍ਰੇਡ
totals=ਕੁੱਲ
prices=ਮੁੱਲ
bring=ਲਿਆਓ
like=ਇੱਕੋ ਕਿਸਮ ਦੇ
place=ਰੱਖੋ
opposite=ਉਲਟ
shown=ਦਿਖਾਏ
give=ਦਿੰਦਾ ਹੈ
given=ਦਿੱਤਾ ਗਿਆ
gives=ਦਿੰਦਾ ਹੈ
required=ਲੋੜੀਂਦੀ
requires=ਲੋੜ ਹੈ
needed=ਲੋੜੀਂਦੀ
need=ਲੋੜ ਹੈ
known=ਪਤਾ
unknown=ਅਣਜਾਣ
item=ਵਸਤੂ
items=ਵਸਤੂਆਂ
item's=ਵਸਤੂ ਦਾ
ingredient's=ਘਟਕ ਦਾ
ingredient=ਘਟਕ
ingredients=ਘਟਕ
seller=ਵਿਕਰੇਤਾ
vendor=ਵਿਕਰੇਤਾ
merchant=ਵਪਾਰੀ
wholesaler=ਥੋਕ ਵਿਕਰੇਤਾ
distributor=ਵਿਤਰਕ
roaster=ਰੋਸਟਰ
dairyman=ਦੁੱਧ ਵਿਕਰੇਤਾ
dealer=ਵਪਾਰੀ
storekeeper=ਦੁਕਾਨਦਾਰ
student=ਵਿਦਿਆਰਥੀ
mix=ਮਿਲਾਓ
mixes=ਮਿਲਾਉਂਦਾ ਹੈ
mixing=ਮਿਲਾਉਣ
mixed=ਮਿਲਿਆ ਹੋਇਆ
uses=ਵਰਤਦਾ ਹੈ
using=ਵਰਤ ਕੇ
prepares=ਤਿਆਰ ਕਰਦਾ ਹੈ
obtains=ਪ੍ਰਾਪਤ ਕਰਦਾ ਹੈ
obtain=ਪ੍ਰਾਪਤ ਕਰੋ
contains=ਵਿੱਚ ਹੈ
contain=ਵਿੱਚ ਹਨ
present=ਮੌਜੂਦ
became=ਹੋ ਗਿਆ
becomes=ਹੋ ਜਾਂਦਾ ਹੈ
become=ਹੋ ਜਾਵੇ
left=ਬਚਿਆ
behind=ਪਿੱਛੇ
still=ਹਾਲੇ ਵੀ
now=ਹੁਣ
time=ਵਾਰ
times=ਵਾਰ
such=ਅਜਿਹੀਆਂ
same=ਇੱਕੋ
respectively=ਕ੍ਰਮਵਾਰ
simultaneously=ਇੱਕੋ ਸਮੇਂ
uniformly=ਇਕਸਾਰ
successive=ਲਗਾਤਾਰ
finally=ਅਖੀਰ ਵਿੱਚ
initially=ਸ਼ੁਰੂ ਵਿੱਚ
first=ਪਹਿਲਾਂ
next=ਫਿਰ
then=ਫਿਰ
last=ਅੰਤਿਮ
current=ਮੌਜੂਦਾ
actual=ਅਸਲ
work=ਗਣਨਾ
working=ਗਣਨਾ
solving=ਹੱਲ ਕਰਨ 'ਤੇ
solve=ਹੱਲ ਕਰੋ
calculate=ਗਣਨਾ ਕਰੋ
calculation=ਗਣਨਾ
clear=ਹਟਾਓ
factor=ਗੁਣਕ
reduce=ਸਰਲ ਕਰੋ
reduced=ਸਰਲ
complete=ਪੂਰਾ
compare=ਤੁਲਨਾ ਕਰੋ
check=ਜਾਂਚ
threshold=ਹੱਦ
strict=ਸਖ਼ਤ
crossing=ਪਾਰ ਹੋਣਾ
above=ਤੋਂ ਵੱਧ
below=ਤੋਂ ਘੱਟ
exceeds=ਤੋਂ ਵੱਧ ਹੋ ਜਾਂਦਾ ਹੈ
exceed=ਤੋਂ ਵੱਧ ਹੋਵੇ
reaches=ਪਹੁੰਚਦਾ ਹੈ
reach=ਪਹੁੰਚੇ
starting=ਸ਼ੁਰੂਆਤੀ
start=ਸ਼ੁਰੂਆਤ
end=ਅੰਤ
ending=ਅੰਤਿਮ
fixed=ਨਿਰਧਾਰਤ
full=ਪੂਰਾ
empty=ਖਾਲੀ
drawn=ਕੱਢਿਆ
refill=ਮੁੜ ਭਰੋ
refilling=ਮੁੜ ਭਰਨਾ
restored=ਮੁੜ ਭਰਿਆ
replacement=ਬਦਲੀ
replacements=ਬਦਲੀਆਂ
removal=ਕੱਢਣਾ
remove=ਕੱਢੋ
removing=ਕੱਢਣ
added=ਜੋੜਿਆ ਗਿਆ
adding=ਜੋੜਨ
add=ਜੋੜੋ
transferred=ਟ੍ਰਾਂਸਫਰ
transfer=ਟ੍ਰਾਂਸਫਰ ਕਰੋ
transfers=ਟ੍ਰਾਂਸਫਰ ਕਰਦਾ ਹੈ
moved=ਟ੍ਰਾਂਸਫਰ
move=ਟ੍ਰਾਂਸਫਰ ਕਰੋ
sent=ਭੇਜਿਆ
swapped=ਅਦਲਾ-ਬਦਲੀ
return=ਵਾਪਸ ਕਰੋ
returns=ਵਾਪਸ ਕਰਦਾ ਹੈ
came=ਆਇਆ
back=ਵਾਪਸ
only=ਕੇਵਲ
pure=ਸ਼ੁੱਧ
free=ਬਿਨਾਂ ਲਾਗਤ
adulterated=ਮਿਲਾਵਟੀ
adulterates=ਮਿਲਾਵਟ ਕਰਦਾ ਹੈ
buys=ਖਰੀਦਦਾ ਹੈ
buy=ਖਰੀਦੋ
sells=ਵੇਚਦਾ ਹੈ
sold=ਵੇਚਿਆ
selling=ਵਿਕਰੀ
earn=ਕਮਾਓ
earning=ਕਮਾਉਂਦੇ ਹੋਏ
earns=ਕਮਾਉਂਦਾ ਹੈ
revenue=ਵਿਕਰੀ ਰਕਮ
costing=ਲਾਗਤ ਵਾਲਾ
priced=ਮੁੱਲ ਵਾਲਾ
valued=ਮੁੱਲ ਵਾਲਾ
worth=ਮੁੱਲ ਦਾ
dearer=ਮਹਿੰਗਾ
cheaper=ਸਸਤਾ
higher=ਵੱਧ
lower=ਘੱਟ
high-grade=ਉੱਚ-ਗ੍ਰੇਡ
standard-grade=ਮਿਆਰੀ-ਗ੍ਰੇਡ
premium-grade=ਪ੍ਰੀਮੀਅਮ-ਗ੍ਰੇਡ
three-grade=ਤਿੰਨ-ਗ੍ਰੇਡ
cold-pressed=ਕੋਲਡ-ਪ੍ਰੈੱਸਡ
house-blend=ਹਾਊਸ-ਬਲੈਂਡ
first-mixture=ਪਹਿਲਾ-ਮਿਸ਼ਰਣ
well-mixed=ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਿਆ
ratio=ਅਨੁਪਾਤ
ratios=ਅਨੁਪਾਤ
quantity=ਮਾਤਰਾ
quantities=ਮਾਤਰਾਵਾਂ
amount=ਮਾਤਰਾ
value=ਮੁੱਲ
price=ਮੁੱਲ
cost=ਲਾਗਤ
average=ਔਸਤ
profit=ਲਾਭ
percentage=ਪ੍ਰਤੀਸ਼ਤ
concentration=ਸੰਘਣਾਪਣ
volume=ਆਇਤਨ
capacity=ਸਮਰੱਥਾ
mass=ਭਾਰ
moisture=ਨਮੀ
fraction=ਅੰਸ਼
retained=ਬਚਿਆ
cumulative=ਕੁੱਲ
part=ਹਿੱਸਾ
parts=ਹਿੱਸੇ
operation=ਕਿਰਿਆ
operations=ਕਿਰਿਆਵਾਂ
stage=ਪੜਾਅ
process=ਪ੍ਰਕਿਰਿਆ
equation=ਸਮੀਕਰਨ
terms=ਪਦ
difference=ਫਰਕ
differences=ਫਰਕ
denominator=ਹਰ
root=ਮੂਲ
square=ਵਰਗ
numbers=ਸੰਖਿਆਵਾਂ
number=ਸੰਖਿਆ
sample=ਨਮੂਨਾ
samples=ਨਮੂਨੇ
unit=ਇਕਾਈ
units=ਇਕਾਈਆਂ
solution=ਘੋਲ
mixture=ਮਿਸ਼ਰਣ
liquid=ਤਰਲ
contents=ਮਿਸ਼ਰਣ
component=ਘਟਕ
solute=ਵਿੱਲੇਯ
solvent=ਘੋਲਕ
water=ਪਾਣੀ
milk=ਦੁੱਧ
syrup=ਸ਼ਰਬਤ
juice=ਰਸ
fruit=ਫਲ
acid=ਤੇਜ਼ਾਬ
alcohol=ਅਲਕੋਹਲ
salt=ਨਮਕ
spirit=ਸਪਿਰਿਟ
glycerin=ਗਲਿਸਰੀਨ
petrol=ਪੈਟਰੋਲ
ethanol=ਈਥਨਾਲ
diesel=ਡੀਜ਼ਲ
kerosene=ਮਿੱਟੀ ਦਾ ਤੇਲ
oil=ਤੇਲ
ghee=ਘਿਉ
vanaspati=ਵਨਸਪਤੀ
chicory=ਚਿਕੋਰੀ
concentrate=ਕਨਸਨਟ੍ਰੇਟ
copper=ਤਾਂਬਾ
zinc=ਜ਼ਿੰਕ
wheat=ਕਣਕ
barley=ਜੌਂ
cement=ਸੀਮੈਂਟ
sand=ਰੇਤ
rice=ਚੌਲ
tea=ਚਾਹ
coffee=ਕੌਫੀ
beans=ਬੀਨਜ਼
lentils=ਦਾਲ
red=ਲਾਲ
yellow=ਪੀਲੀ
green=ਹਰੀ
assam=ਅਸਾਮ
darjeeling=ਦਾਰਜੀਲਿੰਗ
estate=ਐਸਟੇਟ
regular=ਆਮ
premium=ਪ੍ਰੀਮੀਅਮ
standard=ਮਿਆਰੀ
select=ਚੁਣਿਆ
dry=ਸੁੱਕਾ
dried=ਸੁੱਕਾ
fresh=ਤਾਜ਼ਾ
matter=ਪਦਾਰਥ
dissolved=ਘੁਲਿਆ
evaporates=ਬਾਫ਼ ਬਣਦਾ ਹੈ
evaporate=ਬਾਫ਼ ਬਣੇ
evaporation=ਬਾਫ਼ ਬਣਨਾ
drying=ਸੁਕਾਉਣਾ
rises=ਵਧਦਾ ਹੈ
rise=ਵਧੇ
proportion=ਅਨੁਪਾਤ
respectively=ਕ੍ਰਮਵਾਰ
once=ਇੱਕ ਵਾਰ
every=ਹਰ
each=ਹਰੇਕ
both=ਦੋਵੇਂ
some=ਕੁਝ
all=ਸਾਰੇ
at='ਤੇ
from=ਤੋਂ
into=ਵਿੱਚ
with=ਨਾਲ
without=ਬਿਨਾਂ
under=ਹੇਠਾਂ
over=ਉੱਪਰ
before=ਪਹਿਲਾਂ
after=ਬਾਅਦ
again=ਫਿਰ
out=ਬਾਹਰ
up=ਉੱਪਰ
down=ਹੇਠਾਂ
more=ਵੱਧ
less=ਘੱਟ
remaining=ਬਾਕੀ
final=ਅੰਤਿਮ
initial=ਸ਼ੁਰੂਆਤੀ
original=ਮੂਲ
new=ਨਵਾਂ
target=ਟੀਚਾ
total=ਕੁੱਲ
same=ਇੱਕੋ
equal=ਬਰਾਬਰ
different=ਵੱਖਰਾ
single=ਇੱਕ
one-item=ਇੱਕ-ਵਸਤੂ
`);

function applyPrePhrases(value: string, language: Mal001LocalizedLanguage): string {
  return PRE_PHRASES[language].reduce(
    (text, [source, translated]) => text.split(source).join(translated),
    value,
  );
}

function localizeTextV2(value: string, language: Mal001LocalizedLanguage): string {
  const firstPass = localizeMal001Text(applyPrePhrases(value, language), language);
  const supplement = language === "hi" ? HI_SUPPLEMENT : PA_SUPPLEMENT;
  return firstPass.replace(/\b[A-Za-z][A-Za-z'-]*\b/gu, (token) => {
    if (/^[A-CVxyqrT]$/u.test(token)) return token;
    return supplement[token.toLowerCase()] ?? token;
  });
}

function localizeOptionalHelp(value: unknown, language: Mal001LocalizedLanguage): unknown {
  if (typeof value === "string") return localizeTextV2(value, language);
  if (Array.isArray(value)) return value.map((entry) => localizeOptionalHelp(entry, language));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        localizeOptionalHelp(entry, language),
      ]),
    );
  }
  return value;
}

function localizeExplanation(explanation: any, language: Mal001LocalizedLanguage): any {
  if (!explanation || typeof explanation !== "object") return explanation;
  return {
    ...explanation,
    lines: Array.isArray(explanation.lines)
      ? explanation.lines.map((line: unknown) => localizeTextV2(String(line ?? ""), language))
      : explanation.lines,
    visibleLines: Array.isArray(explanation.visibleLines)
      ? explanation.visibleLines.map((line: unknown) => localizeTextV2(String(line ?? ""), language))
      : explanation.visibleLines,
    answerLine:
      typeof explanation.answerLine === "string"
        ? localizeTextV2(explanation.answerLine, language)
        : explanation.answerLine,
    optionalHelp: explanation.optionalHelp
      ? localizeOptionalHelp(explanation.optionalHelp, language)
      : explanation.optionalHelp,
  };
}

function localizeReasoningGraph(reasoningGraph: any, language: Mal001LocalizedLanguage): any {
  if (!reasoningGraph || !Array.isArray(reasoningGraph.nodes)) return reasoningGraph;
  return {
    ...reasoningGraph,
    nodes: reasoningGraph.nodes.map((node: Record<string, any>) => ({
      ...node,
      text:
        typeof node.text === "string"
          ? localizeTextV2(node.text, language)
          : node.text,
    })),
  };
}

export function applyMal001QuestionStudioLocalizationV2<T extends Record<string, any>>(
  question: T,
  language: Mal001LocalizedLanguage,
): T {
  const localized = applyMal001QuestionStudioLocalization(
    {
      ...question,
      explanation: undefined,
      reasoningGraph: undefined,
    },
    language,
  ) as T;

  const options = question.options.map((option: string) => localizeTextV2(option, language));
  const answer = localizeTextV2(question.answer, language);
  const aligned = options.length === 4 && new Set(options).size === 4 && options[question.correctIndex] === answer;

  return {
    ...localized,
    stem: localizeTextV2(question.stem, language),
    options,
    answer,
    explanation: localizeExplanation(question.explanation, language),
    reasoningGraph: localizeReasoningGraph(question.reasoningGraph, language),
    validation: localized.validation
      ? {
          ...localized.validation,
          ok: localized.validation.ok !== false && aligned,
          valid: localized.validation.valid !== false && aligned,
        }
      : localized.validation,
    traceability: {
      ...(localized.traceability ?? {}),
      localizationId: MAL_001_MULTILINGUAL_QUESTION_STUDIO_V2.localizationId,
      runtimeMetadataPreserved: true,
    },
  } as T;
}
