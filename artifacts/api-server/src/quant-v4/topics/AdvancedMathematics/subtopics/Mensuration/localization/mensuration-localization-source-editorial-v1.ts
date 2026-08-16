import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

type EditorialPair = readonly [string, string];

const HI_SOURCE_EDITORIAL_SENTENCES: readonly EditorialPair[] = [
  ["Picture the required region as a flat donut: the outer circle is complete, but the inner circle is removed.", "आवश्यक भाग को एक समतल छल्ले की तरह देखें: बाहरी वृत्त पूरा है, लेकिन भीतरी वृत्त हटा दिया गया है।"],
  ["Picture the circle as a pizza, with the central angle selecting only one slice of the full 360° turn.", "वृत्त को पिज़्ज़ा की तरह सोचें; केंद्रीय कोण 360° के पूरे चक्कर में से केवल आवश्यक भाग चुनता है।"],
  ["Picture a circle cut exactly through its centre, so the curved half and any straight diameter must be counted separately.", "ऐसे वृत्त की कल्पना करें जिसे केंद्र से ठीक आधा काटा गया है; वक्र अर्धभाग और सीधा व्यास अलग-अलग गिने जाते हैं।"],
  ["Picture one quarter of a circular plate, bounded by one curved arc and two perpendicular radii.", "वृत्ताकार प्लेट के एक-चौथाई भाग की कल्पना करें, जिसकी सीमा एक वक्र चाप और दो परस्पर लंबवत त्रिज्याओं से बनती है।"],
  ["Picture a wheel rolling without slipping: every complete turn moves forward by one circumference.", "बिना फिसले घूमते पहिए की कल्पना करें: हर पूरा चक्कर पहिए को एक परिधि जितनी दूरी आगे ले जाता है।"],
  ["Picture one fixed wire being bent into a new shape: its total boundary length stays unchanged even though the enclosed area changes.", "एक निश्चित लंबाई के तार को नई आकृति में मोड़ा गया है: घिरा हुआ क्षेत्रफल बदल सकता है, लेकिन तार की कुल लंबाई नहीं बदलती।"],
  ["Picture a flat circular disc: radius reaches from the centre to the rim, while circumference follows the rim itself.", "एक समतल वृत्ताकार चक्र की कल्पना करें: त्रिज्या केंद्र से किनारे तक जाती है, जबकि परिधि उसी किनारे के चारों ओर होती है।"],
  ["Picture a uniform strip running around a garden or floor, so its area is the larger boundary region minus the smaller inner region.", "बगीचे या फर्श के चारों ओर समान चौड़ाई की पट्टी मानें; उसका क्षेत्रफल बड़े बाहरी भाग के क्षेत्रफल में से छोटे भीतरी भाग का क्षेत्रफल घटाकर मिलता है।"],
  ["Picture the floor as one large flat rectangle covered by identical smaller tiles with no gaps or overlaps.", "फर्श को एक बड़े आयत की तरह देखें, जिसे समान छोटी टाइलों से बिना खाली जगह या अतिव्यापन के पूरी तरह ढका गया है।"],
  ["Picture the figure as standard flat shapes joined together or cut away, then count each included region exactly once.", "आकृति को मानक समतल आकृतियों के जोड़ या कटे हुए भागों के रूप में देखें और हर शामिल भाग का क्षेत्रफल केवल एक बार गिनें।"],
  ["Picture a triangular sign: its area depends on a base and the perpendicular height meeting that base at 90°.", "एक त्रिभुजाकार संकेत-पट्ट की कल्पना करें: उसका क्षेत्रफल आधार और उस आधार पर 90° बनाने वाली लंबवत ऊँचाई पर निर्भर करता है।"],
  ["Picture the figure as a flat floor plan, where side lengths control the boundary and perpendicular dimensions control the area.", "आकृति को समतल नक्शे की तरह देखें: भुजाओं की लंबाइयाँ परिमाप तय करती हैं, जबकि लंबवत आयाम क्षेत्रफल तय करते हैं।"],
  ["Picture the same flat shape being enlarged or reduced, so every linear change acts in two directions when area is involved.", "उसी समतल आकृति को बड़ा या छोटा होते हुए सोचें; क्षेत्रफल में हर रैखिक परिवर्तन दो दिशाओं में प्रभाव डालता है।"],
  ["Picture the same physical measurement written with a different ruler unit; the size stays fixed while the numerical label changes.", "उसी भौतिक माप को अलग इकाई में लिखा हुआ मानें; वास्तविक आकार वही रहता है, केवल संख्यात्मक मान बदलता है।"],
  ["Picture the plane figure before choosing whether the question asks for its boundary, enclosed area, cost, count or scale.", "पहले समतल आकृति को समझें, फिर तय करें कि प्रश्न में परिमाप, क्षेत्रफल, लागत, संख्या या माप-गुणक में से क्या पूछा गया है।"],
  ["Here, R is the outer radius, r is the inner radius, and the ring or path area is π(R² − r²).", "यहाँ R बाहरी त्रिज्या, r भीतरी त्रिज्या है और छल्ले या पथ का क्षेत्रफल π(R² − r²) है।"],
  ["Here, r is radius, θ is the central angle, and θ/360 selects the required fraction of the full circle.", "यहाँ r त्रिज्या और θ केंद्रीय कोण है; θ/360 पूरे वृत्त का आवश्यक अंश चुनता है।"],
  ["Here, r is radius, d = 2r is diameter, circumference is 2πr = πd, and circle area is πr².", "यहाँ r त्रिज्या है, d = 2r व्यास है, परिधि 2πr = πd होती है और वृत्त का क्षेत्रफल πr² होता है।"],
  ["Here, b is the selected base, h is its perpendicular height, and area is measured in square units.", "यहाँ b चुना गया आधार और h उसकी लंबवत ऊँचाई है; क्षेत्रफल वर्ग इकाइयों में मापा जाता है।"],
  ["Here, l and b are perpendicular length and breadth; area is lb, while perimeter counts both pairs of opposite sides.", "यहाँ l और b परस्पर लंबवत लंबाई और चौड़ाई हैं; क्षेत्रफल lb होता है, जबकि परिमाप में विपरीत भुजाओं के दोनों युग्म शामिल होते हैं।"],
  ["Here, s is the side of the square; its perimeter is 4s and its area is s².", "यहाँ s वर्ग की भुजा है; उसका परिमाप 4s और क्षेत्रफल s² होता है।"],
  ["Here, d₁ and d₂ are the diagonals, and any stated perpendicular or half-diagonal relation must be used before calculating area or side length.", "यहाँ d₁ और d₂ विकर्ण हैं; क्षेत्रफल या भुजा निकालने से पहले दिए गए लंबवत या अर्ध-विकर्ण संबंध का प्रयोग करें।"],
  ["Here, a and b are the parallel sides and h is the perpendicular distance between them.", "यहाँ a और b समानांतर भुजाएँ हैं और h उनके बीच की लंबवत दूरी है।"],
  ["Here, the outer dimensions describe the complete region, the inner dimensions describe the excluded region, and path area is outer area minus inner area.", "यहाँ बाहरी आयाम पूरे भाग को और भीतरी आयाम हटाए गए भाग को दर्शाते हैं; पथ का क्षेत्रफल बाहरी क्षेत्रफल में से भीतरी क्षेत्रफल घटाकर मिलता है।"],
  ["Here, k is the linear scale factor; lengths and perimeters use k, but areas use k².", "यहाँ k रैखिक माप-गुणक है; लंबाई और परिमाप k के अनुसार, जबकि क्षेत्रफल k² के अनुसार बदलते हैं।"],
  ["Here, each percentage change acts as a multiplier on a linear dimension, so both multipliers must be combined for area.", "यहाँ हर प्रतिशत परिवर्तन रैखिक आयाम पर गुणक की तरह काम करता है; क्षेत्रफल के लिए दोनों गुणकों को साथ लागू करें।"],
  ["Here, each symbol keeps the physical meaning assigned in the question, and the final unit must match the requested dimension.", "यहाँ हर प्रतीक का वही भौतिक अर्थ है जो प्रश्न में दिया गया है और अंतिम इकाई माँगे गए आयाम के अनुरूप होनी चाहिए।"],
];

const PA_SOURCE_EDITORIAL_SENTENCES: readonly EditorialPair[] = [
  ["Picture the required region as a flat donut: the outer circle is complete, but the inner circle is removed.", "ਲੋੜੀਂਦੇ ਭਾਗ ਨੂੰ ਇੱਕ ਸਮਤਲ ਛੱਲੇ ਵਾਂਗ ਵੇਖੋ: ਬਾਹਰੀ ਵ੍ਰਿਤ ਪੂਰਾ ਹੈ, ਪਰ ਅੰਦਰਲਾ ਵ੍ਰਿਤ ਹਟਾਇਆ ਗਿਆ ਹੈ।"],
  ["Picture the circle as a pizza, with the central angle selecting only one slice of the full 360° turn.", "ਵ੍ਰਿਤ ਨੂੰ ਪਿਜ਼ਾ ਵਾਂਗ ਸੋਚੋ; ਕੇਂਦਰੀ ਕੋਣ 360° ਦੇ ਪੂਰੇ ਚੱਕਰ ਵਿਚੋਂ ਸਿਰਫ਼ ਲੋੜੀਂਦਾ ਹਿੱਸਾ ਚੁਣਦਾ ਹੈ।"],
  ["Picture a circle cut exactly through its centre, so the curved half and any straight diameter must be counted separately.", "ਕੇਂਦਰ ਵਿਚੋਂ ਬਿਲਕੁਲ ਅੱਧਾ ਕੱਟੇ ਵ੍ਰਿਤ ਦੀ ਕਲਪਨਾ ਕਰੋ; ਵਕਰ ਅੱਧਾ ਭਾਗ ਅਤੇ ਸਿੱਧਾ ਵਿਆਸ ਵੱਖ-ਵੱਖ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।"],
  ["Picture one quarter of a circular plate, bounded by one curved arc and two perpendicular radii.", "ਵ੍ਰਿਤਾਕਾਰ ਪਲੇਟ ਦੇ ਇੱਕ-ਚੌਥਾਈ ਭਾਗ ਦੀ ਕਲਪਨਾ ਕਰੋ, ਜਿਸ ਦੀ ਸੀਮਾ ਇੱਕ ਵਕਰ ਚਾਪ ਅਤੇ ਦੋ ਲੰਬ ਅਰਧ-ਵਿਆਸਾਂ ਨਾਲ ਬਣਦੀ ਹੈ।"],
  ["Picture a wheel rolling without slipping: every complete turn moves forward by one circumference.", "ਬਿਨਾਂ ਫਿਸਲੇ ਘੁੰਮਦੇ ਪਹੀਏ ਦੀ ਕਲਪਨਾ ਕਰੋ: ਹਰ ਪੂਰਾ ਚੱਕਰ ਪਹੀਏ ਨੂੰ ਇੱਕ ਪਰਿਧੀ ਜਿੰਨੀ ਦੂਰੀ ਅੱਗੇ ਲੈ ਜਾਂਦਾ ਹੈ।"],
  ["Picture one fixed wire being bent into a new shape: its total boundary length stays unchanged even though the enclosed area changes.", "ਨਿਰਧਾਰਤ ਲੰਬਾਈ ਵਾਲੀ ਤਾਰ ਨੂੰ ਨਵੀਂ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਮੋੜਿਆ ਗਿਆ ਹੈ: ਘਿਰਿਆ ਖੇਤਰਫਲ ਬਦਲ ਸਕਦਾ ਹੈ, ਪਰ ਤਾਰ ਦੀ ਕੁੱਲ ਲੰਬਾਈ ਨਹੀਂ ਬਦਲਦੀ।"],
  ["Picture a flat circular disc: radius reaches from the centre to the rim, while circumference follows the rim itself.", "ਇੱਕ ਸਮਤਲ ਵ੍ਰਿਤਾਕਾਰ ਚੱਕਰ ਦੀ ਕਲਪਨਾ ਕਰੋ: ਅਰਧ-ਵਿਆਸ ਕੇਂਦਰ ਤੋਂ ਕਿਨਾਰੇ ਤੱਕ ਜਾਂਦਾ ਹੈ, ਜਦਕਿ ਪਰਿਧੀ ਕਿਨਾਰੇ ਦੇ ਗੇੜ ਨਾਲ ਹੁੰਦੀ ਹੈ।"],
  ["Picture a uniform strip running around a garden or floor, so its area is the larger boundary region minus the smaller inner region.", "ਬਾਗ ਜਾਂ ਫਰਸ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਇੱਕੋ ਚੌੜਾਈ ਦੀ ਪੱਟੀ ਮੰਨੋ; ਇਸ ਦਾ ਖੇਤਰਫਲ ਵੱਡੇ ਬਾਹਰੀ ਭਾਗ ਵਿਚੋਂ ਛੋਟਾ ਅੰਦਰਲਾ ਭਾਗ ਘਟਾ ਕੇ ਮਿਲਦਾ ਹੈ।"],
  ["Picture the floor as one large flat rectangle covered by identical smaller tiles with no gaps or overlaps.", "ਫਰਸ਼ ਨੂੰ ਇੱਕ ਵੱਡੇ ਆਇਤ ਵਾਂਗ ਵੇਖੋ, ਜਿਸ ਨੂੰ ਇੱਕੋ ਜਿਹੀਆਂ ਛੋਟੀਆਂ ਟਾਈਲਾਂ ਨਾਲ ਬਿਨਾਂ ਖਾਲੀ ਥਾਂ ਜਾਂ ਓਵਰਲੈਪ ਦੇ ਪੂਰਾ ਢੱਕਿਆ ਗਿਆ ਹੈ।"],
  ["Picture the figure as standard flat shapes joined together or cut away, then count each included region exactly once.", "ਆਕ੍ਰਿਤੀ ਨੂੰ ਮਿਆਰੀ ਸਮਤਲ ਆਕ੍ਰਿਤੀਆਂ ਦੇ ਜੋੜ ਜਾਂ ਕੱਟੇ ਹੋਏ ਭਾਗਾਂ ਵਾਂਗ ਵੇਖੋ ਅਤੇ ਹਰ ਸ਼ਾਮਲ ਭਾਗ ਦਾ ਖੇਤਰਫਲ ਸਿਰਫ਼ ਇੱਕ ਵਾਰ ਗਿਣੋ।"],
  ["Picture a triangular sign: its area depends on a base and the perpendicular height meeting that base at 90°.", "ਇੱਕ ਤਿਕੋਣੇ ਸੰਕੇਤ-ਪਟ ਦੀ ਕਲਪਨਾ ਕਰੋ: ਇਸ ਦਾ ਖੇਤਰਫਲ ਆਧਾਰ ਅਤੇ ਉਸ ਆਧਾਰ ਨਾਲ 90° ਬਣਾਉਣ ਵਾਲੀ ਲੰਬ ਉਚਾਈ 'ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।"],
  ["Picture the figure as a flat floor plan, where side lengths control the boundary and perpendicular dimensions control the area.", "ਆਕ੍ਰਿਤੀ ਨੂੰ ਸਮਤਲ ਨਕਸ਼ੇ ਵਾਂਗ ਵੇਖੋ: ਭੁਜਾਵਾਂ ਦੀਆਂ ਲੰਬਾਈਆਂ ਪਰਿਮਾਪ ਨਿਰਧਾਰਤ ਕਰਦੀਆਂ ਹਨ, ਜਦਕਿ ਲੰਬ ਮਾਪ ਖੇਤਰਫਲ ਨਿਰਧਾਰਤ ਕਰਦੇ ਹਨ।"],
  ["Picture the same flat shape being enlarged or reduced, so every linear change acts in two directions when area is involved.", "ਉਸੇ ਸਮਤਲ ਆਕਾਰ ਨੂੰ ਵੱਡਾ ਜਾਂ ਛੋਟਾ ਹੁੰਦਾ ਸੋਚੋ; ਖੇਤਰਫਲ ਵਿੱਚ ਹਰ ਰੇਖੀ ਬਦਲਾਅ ਦੋ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਅਸਰ ਕਰਦਾ ਹੈ।"],
  ["Picture the same physical measurement written with a different ruler unit; the size stays fixed while the numerical label changes.", "ਉਸੇ ਭੌਤਿਕ ਮਾਪ ਨੂੰ ਵੱਖ ਇਕਾਈ ਵਿੱਚ ਲਿਖਿਆ ਮੰਨੋ; ਅਸਲ ਆਕਾਰ ਉਹੀ ਰਹਿੰਦਾ ਹੈ, ਸਿਰਫ਼ ਅੰਕੀ ਮੁੱਲ ਬਦਲਦਾ ਹੈ।"],
  ["Picture the plane figure before choosing whether the question asks for its boundary, enclosed area, cost, count or scale.", "ਪਹਿਲਾਂ ਸਮਤਲ ਆਕ੍ਰਿਤੀ ਨੂੰ ਸਮਝੋ, ਫਿਰ ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਸਵਾਲ ਵਿੱਚ ਪਰਿਮਾਪ, ਖੇਤਰਫਲ, ਲਾਗਤ, ਗਿਣਤੀ ਜਾਂ ਮਾਪ-ਗੁਣਕ ਵਿਚੋਂ ਕੀ ਪੁੱਛਿਆ ਗਿਆ ਹੈ।"],
  ["Here, R is the outer radius, r is the inner radius, and the ring or path area is π(R² − r²).", "ਇੱਥੇ R ਬਾਹਰੀ ਅਰਧ-ਵਿਆਸ, r ਅੰਦਰਲਾ ਅਰਧ-ਵਿਆਸ ਹੈ ਅਤੇ ਛੱਲੇ ਜਾਂ ਰਸਤੇ ਦਾ ਖੇਤਰਫਲ π(R² − r²) ਹੈ।"],
  ["Here, r is radius, θ is the central angle, and θ/360 selects the required fraction of the full circle.", "ਇੱਥੇ r ਅਰਧ-ਵਿਆਸ ਅਤੇ θ ਕੇਂਦਰੀ ਕੋਣ ਹੈ; θ/360 ਪੂਰੇ ਵ੍ਰਿਤ ਦਾ ਲੋੜੀਂਦਾ ਹਿੱਸਾ ਚੁਣਦਾ ਹੈ।"],
  ["Here, r is radius, d = 2r is diameter, circumference is 2πr = πd, and circle area is πr².", "ਇੱਥੇ r ਅਰਧ-ਵਿਆਸ ਹੈ, d = 2r ਵਿਆਸ ਹੈ, ਪਰਿਧੀ 2πr = πd ਹੁੰਦੀ ਹੈ ਅਤੇ ਵ੍ਰਿਤ ਦਾ ਖੇਤਰਫਲ πr² ਹੁੰਦਾ ਹੈ।"],
  ["Here, b is the selected base, h is its perpendicular height, and area is measured in square units.", "ਇੱਥੇ b ਚੁਣਿਆ ਆਧਾਰ ਅਤੇ h ਉਸ ਦੀ ਲੰਬ ਉਚਾਈ ਹੈ; ਖੇਤਰਫਲ ਵਰਗ ਇਕਾਈਆਂ ਵਿੱਚ ਮਾਪਿਆ ਜਾਂਦਾ ਹੈ।"],
  ["Here, l and b are perpendicular length and breadth; area is lb, while perimeter counts both pairs of opposite sides.", "ਇੱਥੇ l ਅਤੇ b ਆਪਸੀ ਲੰਬ ਲੰਬਾਈ ਅਤੇ ਚੌੜਾਈ ਹਨ; ਖੇਤਰਫਲ lb ਹੁੰਦਾ ਹੈ, ਜਦਕਿ ਪਰਿਮਾਪ ਵਿੱਚ ਵਿਰੋਧੀ ਭੁਜਾਵਾਂ ਦੇ ਦੋਵੇਂ ਜੋੜੇ ਸ਼ਾਮਲ ਹੁੰਦੇ ਹਨ।"],
  ["Here, s is the side of the square; its perimeter is 4s and its area is s².", "ਇੱਥੇ s ਵਰਗ ਦੀ ਭੁਜਾ ਹੈ; ਇਸ ਦਾ ਪਰਿਮਾਪ 4s ਅਤੇ ਖੇਤਰਫਲ s² ਹੁੰਦਾ ਹੈ।"],
  ["Here, d₁ and d₂ are the diagonals, and any stated perpendicular or half-diagonal relation must be used before calculating area or side length.", "ਇੱਥੇ d₁ ਅਤੇ d₂ ਵਿਕਰਨ ਹਨ; ਖੇਤਰਫਲ ਜਾਂ ਭੁਜਾ ਕੱਢਣ ਤੋਂ ਪਹਿਲਾਂ ਦਿੱਤੇ ਲੰਬ ਜਾਂ ਅੱਧ-ਵਿਕਰਨ ਸੰਬੰਧ ਦੀ ਵਰਤੋਂ ਕਰੋ।"],
  ["Here, a and b are the parallel sides and h is the perpendicular distance between them.", "ਇੱਥੇ a ਅਤੇ b ਸਮਾਂਤਰ ਭੁਜਾਵਾਂ ਹਨ ਅਤੇ h ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਦੀ ਲੰਬ ਦੂਰੀ ਹੈ।"],
  ["Here, the outer dimensions describe the complete region, the inner dimensions describe the excluded region, and path area is outer area minus inner area.", "ਇੱਥੇ ਬਾਹਰੀ ਮਾਪ ਪੂਰੇ ਭਾਗ ਨੂੰ ਅਤੇ ਅੰਦਰਲੇ ਮਾਪ ਹਟਾਏ ਭਾਗ ਨੂੰ ਦਰਸਾਉਂਦੇ ਹਨ; ਰਸਤੇ ਦਾ ਖੇਤਰਫਲ ਬਾਹਰੀ ਖੇਤਰਫਲ ਵਿਚੋਂ ਅੰਦਰਲਾ ਖੇਤਰਫਲ ਘਟਾ ਕੇ ਮਿਲਦਾ ਹੈ।"],
  ["Here, k is the linear scale factor; lengths and perimeters use k, but areas use k².", "ਇੱਥੇ k ਰੇਖੀ ਮਾਪ-ਗੁਣਕ ਹੈ; ਲੰਬਾਈ ਅਤੇ ਪਰਿਮਾਪ k ਅਨੁਸਾਰ, ਜਦਕਿ ਖੇਤਰਫਲ k² ਅਨੁਸਾਰ ਬਦਲਦੇ ਹਨ।"],
  ["Here, each percentage change acts as a multiplier on a linear dimension, so both multipliers must be combined for area.", "ਇੱਥੇ ਹਰ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਰੇਖੀ ਮਾਪ 'ਤੇ ਗੁਣਕ ਵਾਂਗ ਕੰਮ ਕਰਦਾ ਹੈ; ਖੇਤਰਫਲ ਲਈ ਦੋਵੇਂ ਗੁਣਕ ਇਕੱਠੇ ਲਗਾਓ।"],
  ["Here, each symbol keeps the physical meaning assigned in the question, and the final unit must match the requested dimension.", "ਇੱਥੇ ਹਰ ਚਿੰਨ੍ਹ ਦਾ ਉਹੀ ਭੌਤਿਕ ਅਰਥ ਹੈ ਜੋ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤਾ ਗਿਆ ਹੈ ਅਤੇ ਅੰਤਿਮ ਇਕਾਈ ਮੰਗੇ ਗਏ ਮਾਪ ਨਾਲ ਮਿਲਣੀ ਚਾਹੀਦੀ ਹੈ।"],
];

export function prelocalizeMensurationEditorialSource(text: string, language: MensurationLocalizedLanguage) {
  const pairs = language === "hi" ? HI_SOURCE_EDITORIAL_SENTENCES : PA_SOURCE_EDITORIAL_SENTENCES;
  let out = text;
  for (const [source, target] of pairs) out = out.split(source).join(target);
  return out;
}
