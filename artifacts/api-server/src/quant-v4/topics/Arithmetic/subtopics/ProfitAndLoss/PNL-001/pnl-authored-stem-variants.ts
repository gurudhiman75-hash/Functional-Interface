// Authored, exam-style variants for dynamic review candidates only.
// Canonical frozen editorial libraries and solver/explanation authority are unchanged.
export type AuthoredStemLanguage = "en" | "hi" | "pa";
const STEMS: Record<string, Record<AuthoredStemLanguage, readonly [string, string]>> = {
  "PNL-QL-001": {
    "en": [
      "A mixer bought for ₹{costPrice} is sold for ₹{sellingPrice}. Determine the profit or loss amount.",
      "A retailer pays ₹{costPrice} for a mixer and receives ₹{sellingPrice} on sale. What is the profit or loss?"
    ],
    "hi": [
      "एक मिक्सर ₹{costPrice} में खरीदा और ₹{sellingPrice} में बेचा गया। लाभ या हानि की राशि ज्ञात कीजिए।",
      "एक विक्रेता मिक्सर के लिए ₹{costPrice} देता है और उसे ₹{sellingPrice} में बेचता है। लाभ या हानि कितनी है?"
    ],
    "pa": [
      "ਇੱਕ ਮਿਕਸਰ ₹{costPrice} ਵਿੱਚ ਖਰੀਦ ਕੇ ₹{sellingPrice} ਵਿੱਚ ਵੇਚਿਆ ਗਿਆ। ਲਾਭ ਜਾਂ ਘਾਟੇ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਵਿਕਰੇਤਾ ਮਿਕਸਰ ਲਈ ₹{costPrice} ਦਿੰਦਾ ਹੈ ਅਤੇ ਉਸਨੂੰ ₹{sellingPrice} ਵਿੱਚ ਵੇਚਦਾ ਹੈ। ਲਾਭ ਜਾਂ ਘਾਟਾ ਕਿੰਨਾ ਹੈ?"
    ]
  },
  "PNL-QL-005": {
    "en": [
      "An appliance costs ₹{costPrice}. What selling price will give a profit of {profitPercent}%?",
      "A dealer buys an appliance for ₹{costPrice} and wants a {profitPercent}% profit. Find the required selling price."
    ],
    "hi": [
      "एक उपकरण का क्रय मूल्य ₹{costPrice} है। {profitPercent}% लाभ के लिए उसका विक्रय मूल्य क्या होना चाहिए?",
      "एक डीलर उपकरण ₹{costPrice} में खरीदता है और {profitPercent}% लाभ चाहता है। आवश्यक विक्रय मूल्य ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਉਪਕਰਣ ਦਾ ਖਰੀਦ ਮੁੱਲ ₹{costPrice} ਹੈ। {profitPercent}% ਲਾਭ ਲਈ ਇਸਦਾ ਵਿਕਰੀ ਮੁੱਲ ਕਿੰਨਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ?",
      "ਇੱਕ ਡੀਲਰ ਉਪਕਰਣ ₹{costPrice} ਵਿੱਚ ਖਰੀਦਦਾ ਹੈ ਅਤੇ {profitPercent}% ਲਾਭ ਚਾਹੁੰਦਾ ਹੈ। ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-037": {
    "en": [
      "A jacket marked at ₹{markedPrice} is sold after a {discountPercent}% discount. Find the selling price.",
      "The listed price of a jacket is ₹{markedPrice}. After allowing {discountPercent}% off, what price does the customer pay?"
    ],
    "hi": [
      "एक जैकेट का अंकित मूल्य ₹{markedPrice} है और उस पर {discountPercent}% छूट दी जाती है। विक्रय मूल्य ज्ञात कीजिए।",
      "एक जैकेट का सूची मूल्य ₹{markedPrice} है। {discountPercent}% छूट के बाद ग्राहक कितना भुगतान करेगा?"
    ],
    "pa": [
      "ਇੱਕ ਜੈਕਟ ਦਾ ਅੰਕਿਤ ਮੁੱਲ ₹{markedPrice} ਹੈ ਅਤੇ ਇਸ 'ਤੇ {discountPercent}% ਛੂਟ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਜੈਕਟ ਦੀ ਸੂਚੀ ਕੀਮਤ ₹{markedPrice} ਹੈ। {discountPercent}% ਛੂਟ ਤੋਂ ਬਾਅਦ ਗਾਹਕ ਕਿੰਨਾ ਭੁਗਤਾਨ ਕਰੇਗਾ?"
    ]
  },
  "PNL-QL-038": {
    "en": [
      "A tablet marked at ₹{markedPrice} is sold for ₹{sellingPrice}. What discount percentage was allowed?",
      "The marked price of a tablet is ₹{markedPrice}, but the customer pays ₹{sellingPrice}. Find the rate of discount."
    ],
    "hi": [
      "एक टैबलेट का अंकित मूल्य ₹{markedPrice} है और वह ₹{sellingPrice} में बेचा गया। छूट प्रतिशत ज्ञात कीजिए।",
      "एक टैबलेट का अंकित मूल्य ₹{markedPrice} है, पर ग्राहक ₹{sellingPrice} देता है। छूट की दर ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਟੈਬਲੈਟ ਦਾ ਅੰਕਿਤ ਮੁੱਲ ₹{markedPrice} ਹੈ ਅਤੇ ਇਹ ₹{sellingPrice} ਵਿੱਚ ਵੇਚਿਆ ਗਿਆ। ਛੂਟ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਟੈਬਲੈਟ ਦਾ ਅੰਕਿਤ ਮੁੱਲ ₹{markedPrice} ਹੈ, ਪਰ ਗਾਹਕ ₹{sellingPrice} ਭਰਦਾ ਹੈ। ਛੂਟ ਦੀ ਦਰ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-002": {
    "en": [
      "A study table costs a shopkeeper ₹{costPrice} and is sold for ₹{sellingPrice}. Find the profit or loss.",
      "The purchase price of a study table is ₹{costPrice}, while its selling price is ₹{sellingPrice}. Determine the gain or loss amount."
    ],
    "hi": [
      "एक दुकानदार ने स्टडी टेबल ₹{costPrice} में खरीदी और ₹{sellingPrice} में बेची। लाभ या हानि ज्ञात कीजिए।",
      "स्टडी टेबल का क्रय मूल्य ₹{costPrice} और विक्रय मूल्य ₹{sellingPrice} है। लाभ या हानि की राशि ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਦੁਕਾਨਦਾਰ ਨੇ ਸਟਡੀ ਟੇਬਲ ₹{costPrice} ਵਿੱਚ ਖਰੀਦੀ ਅਤੇ ₹{sellingPrice} ਵਿੱਚ ਵੇਚੀ। ਲਾਭ ਜਾਂ ਘਾਟਾ ਪਤਾ ਕਰੋ।",
      "ਸਟਡੀ ਟੇਬਲ ਦਾ ਖਰੀਦ ਮੁੱਲ ₹{costPrice} ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ ₹{sellingPrice} ਹੈ। ਲਾਭ ਜਾਂ ਘਾਟੇ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-006": {
    "en": [
      "A machine costing ₹{costPrice} is sold at a loss of {lossPercent}%. Find its selling price.",
      "If a machine bought for ₹{costPrice} is sold at {lossPercent}% loss, what amount is received?"
    ],
    "hi": [
      "₹{costPrice} की मशीन को {lossPercent}% हानि पर बेचा जाता है। उसका विक्रय मूल्य ज्ञात कीजिए।",
      "₹{costPrice} में खरीदी गई मशीन को {lossPercent}% हानि पर बेचने पर कितनी राशि मिलेगी?"
    ],
    "pa": [
      "₹{costPrice} ਦੀ ਮਸ਼ੀਨ ਨੂੰ {lossPercent}% ਘਾਟੇ 'ਤੇ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ। ਇਸਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "₹{costPrice} ਵਿੱਚ ਖਰੀਦੀ ਮਸ਼ੀਨ ਨੂੰ {lossPercent}% ਘਾਟੇ 'ਤੇ ਵੇਚਣ ਨਾਲ ਕਿੰਨੀ ਰਕਮ ਮਿਲੇਗੀ?"
    ]
  },
  "PNL-QL-039": {
    "en": [
      "A bookshelf is sold for ₹{sellingPrice} after a discount of {discountPercent}%. Find its marked price.",
      "After {discountPercent}% is reduced from the marked price, a bookshelf sells for ₹{sellingPrice}. What was its marked price?"
    ],
    "hi": [
      "एक बुकशेल्फ़ {discountPercent}% छूट के बाद ₹{sellingPrice} में बेची जाती है। उसका अंकित मूल्य ज्ञात कीजिए।",
      "अंकित मूल्य पर {discountPercent}% छूट देने के बाद बुकशेल्फ़ ₹{sellingPrice} में बिकती है। मूल अंकित मूल्य क्या था?"
    ],
    "pa": [
      "ਇੱਕ ਬੁੱਕਸ਼ੈਲਫ਼ {discountPercent}% ਛੂਟ ਤੋਂ ਬਾਅਦ ₹{sellingPrice} ਵਿੱਚ ਵੇਚੀ ਜਾਂਦੀ ਹੈ। ਇਸਦਾ ਅੰਕਿਤ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਅੰਕਿਤ ਮੁੱਲ 'ਤੇ {discountPercent}% ਛੂਟ ਦੇਣ ਤੋਂ ਬਾਅਦ ਬੁੱਕਸ਼ੈਲਫ਼ ₹{sellingPrice} ਵਿੱਚ ਵਿਕਦੀ ਹੈ। ਮੂਲ ਅੰਕਿਤ ਮੁੱਲ ਕੀ ਸੀ?"
    ]
  },
  "PNL-QL-040": {
    "en": [
      "An appliance set marked at ₹{markedPrice} gets successive discounts of {firstDiscountPercent}% and {secondDiscountPercent}%. Find the final selling price.",
      "Two discounts, {firstDiscountPercent}% followed by {secondDiscountPercent}%, are offered on an item marked ₹{markedPrice}. What is the final price?"
    ],
    "hi": [
      "₹{markedPrice} अंकित मूल्य वाले उपकरण सेट पर क्रमशः {firstDiscountPercent}% और {secondDiscountPercent}% छूट मिलती है। अंतिम विक्रय मूल्य ज्ञात कीजिए।",
      "₹{markedPrice} अंकित मूल्य वाली वस्तु पर पहले {firstDiscountPercent}% और फिर {secondDiscountPercent}% छूट दी जाती है। अंतिम मूल्य क्या होगा?"
    ],
    "pa": [
      "₹{markedPrice} ਅੰਕਿਤ ਮੁੱਲ ਵਾਲੇ ਉਪਕਰਣ ਸੈੱਟ 'ਤੇ ਲਗਾਤਾਰ {firstDiscountPercent}% ਅਤੇ {secondDiscountPercent}% ਛੂਟ ਮਿਲਦੀ ਹੈ। ਅੰਤਿਮ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "₹{markedPrice} ਅੰਕਿਤ ਮੁੱਲ ਵਾਲੀ ਵਸਤੂ 'ਤੇ ਪਹਿਲਾਂ {firstDiscountPercent}% ਅਤੇ ਫਿਰ {secondDiscountPercent}% ਛੂਟ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਅੰਤਿਮ ਕੀਮਤ ਕੀ ਹੋਵੇਗੀ?"
    ]
  },
  "PNL-QL-075": {
    "en": [
      "A seller buys {totalQuantity} ceramic sets at ₹{unitCostPrice} each. {damagedQuantity} damaged sets fetch ₹{damagedRecoveryPerUnit} each. To earn an overall {targetRatePercent}% {targetDirection}, at what price should each good set be sold?",
      "Out of {totalQuantity} ceramic sets costing ₹{unitCostPrice} each, {damagedQuantity} are damaged and sold for ₹{damagedRecoveryPerUnit} each. Find the selling price of each undamaged set needed for {targetRatePercent}% overall {targetDirection}."
    ],
    "hi": [
      "एक विक्रेता {totalQuantity} सिरेमिक सेट ₹{unitCostPrice} प्रति सेट की दर से खरीदता है। {damagedQuantity} खराब सेट ₹{damagedRecoveryPerUnit} प्रति सेट मिलते हैं। कुल {targetRatePercent}% {targetDirection} के लिए प्रत्येक सही सेट का विक्रय मूल्य ज्ञात कीजिए।",
      "{totalQuantity} सिरेमिक सेटों का क्रय मूल्य ₹{unitCostPrice} प्रति सेट है। इनमें से {damagedQuantity} खराब सेट ₹{damagedRecoveryPerUnit} प्रति सेट बिकते हैं। कुल {targetRatePercent}% {targetDirection} के लिए शेष प्रत्येक सेट किस मूल्य पर बेचना चाहिए?"
    ],
    "pa": [
      "ਇੱਕ ਵਿਕਰੇਤਾ {totalQuantity} ਸਿਰੈਮਿਕ ਸੈੱਟ ₹{unitCostPrice} ਪ੍ਰਤੀ ਸੈੱਟ ਖਰੀਦਦਾ ਹੈ। {damagedQuantity} ਖਰਾਬ ਸੈੱਟ ₹{damagedRecoveryPerUnit} ਪ੍ਰਤੀ ਸੈੱਟ ਵੇਚੇ ਜਾਂਦੇ ਹਨ। ਕੁੱਲ {targetRatePercent}% {targetDirection} ਲਈ ਹਰ ਠੀਕ ਸੈੱਟ ਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "{totalQuantity} ਸਿਰੈਮਿਕ ਸੈੱਟਾਂ ਦਾ ਖਰੀਦ ਮੁੱਲ ₹{unitCostPrice} ਪ੍ਰਤੀ ਸੈੱਟ ਹੈ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ {damagedQuantity} ਖਰਾਬ ਸੈੱਟ ₹{damagedRecoveryPerUnit} ਪ੍ਰਤੀ ਸੈੱਟ ਵੇਚੇ ਜਾਂਦੇ ਹਨ। ਕੁੱਲ {targetRatePercent}% {targetDirection} ਲਈ ਬਾਕੀ ਹਰ ਸੈੱਟ ਕਿਸ ਕੀਮਤ 'ਤੇ ਵੇਚਣਾ ਚਾਹੀਦਾ ਹੈ?"
    ]
  },
  "PNL-QL-082": {
    "en": [
      "A merchant buys {totalQuantity} crates at ₹{unitCostPrice} each. {goodQuantity} good crates are sold at ₹{goodUnitSellingPrice} each and {spoiledQuantity} are spoiled. What recovery per spoiled crate is needed for {targetRatePercent}% overall {targetDirection}?",
      "Of {totalQuantity} crates costing ₹{unitCostPrice} each, {goodQuantity} are sold for ₹{goodUnitSellingPrice} each and {spoiledQuantity} are spoiled. Find the amount to be recovered from each spoiled crate to obtain {targetRatePercent}% overall {targetDirection}."
    ],
    "hi": [
      "एक व्यापारी {totalQuantity} क्रेट ₹{unitCostPrice} प्रति क्रेट खरीदता है। {goodQuantity} अच्छे क्रेट ₹{goodUnitSellingPrice} प्रति क्रेट बिकते हैं और {spoiledQuantity} खराब हो जाते हैं। कुल {targetRatePercent}% {targetDirection} के लिए प्रत्येक खराब क्रेट से कितनी राशि वसूलनी चाहिए?",
      "{totalQuantity} क्रेटों का क्रय मूल्य ₹{unitCostPrice} प्रति क्रेट है। {goodQuantity} क्रेट ₹{goodUnitSellingPrice} प्रति क्रेट बिकते हैं और {spoiledQuantity} खराब हैं। कुल {targetRatePercent}% {targetDirection} पाने के लिए प्रत्येक खराब क्रेट से आवश्यक वसूली ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਵਪਾਰੀ {totalQuantity} ਕਰੇਟ ₹{unitCostPrice} ਪ੍ਰਤੀ ਕਰੇਟ ਖਰੀਦਦਾ ਹੈ। {goodQuantity} ਚੰਗੇ ਕਰੇਟ ₹{goodUnitSellingPrice} ਪ੍ਰਤੀ ਕਰੇਟ ਵੇਚੇ ਜਾਂਦੇ ਹਨ ਅਤੇ {spoiledQuantity} ਖਰਾਬ ਹੋ ਜਾਂਦੇ ਹਨ। ਕੁੱਲ {targetRatePercent}% {targetDirection} ਲਈ ਹਰ ਖਰਾਬ ਕਰੇਟ ਤੋਂ ਕਿੰਨੀ ਵਸੂਲੀ ਲੋੜੀਂਦੀ ਹੈ?",
      "{totalQuantity} ਕਰੇਟਾਂ ਦਾ ਖਰੀਦ ਮੁੱਲ ₹{unitCostPrice} ਪ੍ਰਤੀ ਕਰੇਟ ਹੈ। {goodQuantity} ਕਰੇਟ ₹{goodUnitSellingPrice} ਪ੍ਰਤੀ ਕਰੇਟ ਵੇਚੇ ਜਾਂਦੇ ਹਨ ਅਤੇ {spoiledQuantity} ਖਰਾਬ ਹਨ। ਕੁੱਲ {targetRatePercent}% {targetDirection} ਹਾਸਲ ਕਰਨ ਲਈ ਹਰ ਖਰਾਬ ਕਰੇਟ ਤੋਂ ਲੋੜੀਂਦੀ ਵਸੂਲੀ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-083": {
    "en": [
      "Two articles are sold for the same price. One gives {ratePercent}% profit and the other {ratePercent}% loss. Find the overall loss percentage.",
      "A seller sells two items at an equal selling price. The profit on one and loss on the other are both {ratePercent}%. What is the net loss percentage?"
    ],
    "hi": [
      "दो वस्तुएँ समान विक्रय मूल्य पर बेची जाती हैं। एक पर {ratePercent}% लाभ और दूसरी पर {ratePercent}% हानि होती है। कुल हानि प्रतिशत ज्ञात कीजिए।",
      "एक विक्रेता दो वस्तुएँ समान मूल्य पर बेचता है। एक पर {ratePercent}% लाभ और दूसरी पर उतनी ही प्रतिशत हानि है। शुद्ध हानि प्रतिशत क्या होगा?"
    ],
    "pa": [
      "ਦੋ ਵਸਤਾਂ ਇੱਕੋ ਵਿਕਰੀ ਮੁੱਲ 'ਤੇ ਵੇਚੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਇੱਕ 'ਤੇ {ratePercent}% ਲਾਭ ਅਤੇ ਦੂਜੀ 'ਤੇ {ratePercent}% ਘਾਟਾ ਹੁੰਦਾ ਹੈ। ਕੁੱਲ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਵਿਕਰੇਤਾ ਦੋ ਵਸਤਾਂ ਇੱਕੋ ਕੀਮਤ 'ਤੇ ਵੇਚਦਾ ਹੈ। ਇੱਕ 'ਤੇ {ratePercent}% ਲਾਭ ਅਤੇ ਦੂਜੀ 'ਤੇ ਉਤਨਾ ਹੀ ਪ੍ਰਤੀਸ਼ਤ ਘਾਟਾ ਹੈ। ਸ਼ੁੱਧ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?"
    ]
  },
  "PNL-QL-084": {
    "en": [
      "Two items have the same selling price. The first is sold at {knownRatePercent}% {knownDirection}. What {unknownDirection} percentage on the second will make the combined result {targetRatePercent}% {targetDirection}?",
      "Two electronic items are sold for equal amounts. One sale gives {knownRatePercent}% {knownDirection}. Determine the required {unknownDirection} rate on the other item so that the overall result is {targetRatePercent}% {targetDirection}."
    ],
    "hi": [
      "दो वस्तुओं का विक्रय मूल्य समान है। पहली वस्तु पर {knownRatePercent}% {knownDirection} है। कुल परिणाम {targetRatePercent}% {targetDirection} करने के लिए दूसरी वस्तु पर कितनी {unknownDirection} दर चाहिए?",
      "दो इलेक्ट्रॉनिक वस्तुएँ समान राशि में बेची जाती हैं। पहली पर {knownRatePercent}% {knownDirection} है। कुल {targetRatePercent}% {targetDirection} के लिए दूसरी वस्तु पर आवश्यक {unknownDirection} प्रतिशत ज्ञात कीजिए।"
    ],
    "pa": [
      "ਦੋ ਵਸਤਾਂ ਦਾ ਵਿਕਰੀ ਮੁੱਲ ਇੱਕੋ ਹੈ। ਪਹਿਲੀ ਵਸਤ 'ਤੇ {knownRatePercent}% {knownDirection} ਹੈ। ਕੁੱਲ ਨਤੀਜਾ {targetRatePercent}% {targetDirection} ਬਣਾਉਣ ਲਈ ਦੂਜੀ ਵਸਤ 'ਤੇ ਕਿੰਨੀ {unknownDirection} ਦਰ ਚਾਹੀਦੀ ਹੈ?",
      "ਦੋ ਇਲੈਕਟ੍ਰਾਨਿਕ ਵਸਤਾਂ ਇੱਕੋ ਰਕਮ ਵਿੱਚ ਵੇਚੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਪਹਿਲੀ 'ਤੇ {knownRatePercent}% {knownDirection} ਹੈ। ਕੁੱਲ {targetRatePercent}% {targetDirection} ਲਈ ਦੂਜੀ ਵਸਤ 'ਤੇ ਲੋੜੀਂਦਾ {unknownDirection} ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-094": {
    "en": [
      "A distributor buys {totalQuantity} packs at ₹{unitCostPrice} each. {goodQuantity} good packs sell for ₹{goodUnitSellingPrice} each and {spoiledQuantity} packs are spoiled. Find the minimum recovery per spoiled pack to avoid an overall loss.",
      "Of {totalQuantity} packs bought at ₹{unitCostPrice} each, {goodQuantity} are sold at ₹{goodUnitSellingPrice} each while {spoiledQuantity} cannot be sold normally. What minimum amount per spoiled pack will make the transaction break even?"
    ],
    "hi": [
      "एक वितरक {totalQuantity} पैक ₹{unitCostPrice} प्रति पैक खरीदता है। {goodQuantity} अच्छे पैक ₹{goodUnitSellingPrice} प्रति पैक बिकते हैं और {spoiledQuantity} खराब हो जाते हैं। कुल हानि से बचने के लिए प्रत्येक खराब पैक से न्यूनतम कितनी वसूली चाहिए?",
      "{totalQuantity} पैक ₹{unitCostPrice} प्रति पैक खरीदे गए। {goodQuantity} पैक ₹{goodUnitSellingPrice} प्रति पैक बिकते हैं और {spoiledQuantity} सामान्य रूप से नहीं बिक सकते। लेन-देन को बराबरी पर लाने के लिए प्रत्येक खराब पैक से न्यूनतम कितनी राशि चाहिए?"
    ],
    "pa": [
      "ਇੱਕ ਵੰਡਕਾਰ {totalQuantity} ਪੈਕ ₹{unitCostPrice} ਪ੍ਰਤੀ ਪੈਕ ਖਰੀਦਦਾ ਹੈ। {goodQuantity} ਚੰਗੇ ਪੈਕ ₹{goodUnitSellingPrice} ਪ੍ਰਤੀ ਪੈਕ ਵੇਚੇ ਜਾਂਦੇ ਹਨ ਅਤੇ {spoiledQuantity} ਖਰਾਬ ਹੋ ਜਾਂਦੇ ਹਨ। ਕੁੱਲ ਘਾਟੇ ਤੋਂ ਬਚਣ ਲਈ ਹਰ ਖਰਾਬ ਪੈਕ ਤੋਂ ਘੱਟੋ-ਘੱਟ ਕਿੰਨੀ ਵਸੂਲੀ ਚਾਹੀਦੀ ਹੈ?",
      "{totalQuantity} ਪੈਕ ₹{unitCostPrice} ਪ੍ਰਤੀ ਪੈਕ ਖਰੀਦੇ ਗਏ। {goodQuantity} ਪੈਕ ₹{goodUnitSellingPrice} ਪ੍ਰਤੀ ਪੈਕ ਵੇਚੇ ਜਾਂਦੇ ਹਨ ਅਤੇ {spoiledQuantity} ਆਮ ਤੌਰ 'ਤੇ ਨਹੀਂ ਵੇਚੇ ਜਾ ਸਕਦੇ। ਲੈਣ-ਦੇਣ ਨੂੰ ਬਰਾਬਰੀ 'ਤੇ ਲਿਆਉਣ ਲਈ ਹਰ ਖਰਾਬ ਪੈਕ ਤੋਂ ਘੱਟੋ-ਘੱਟ ਕਿੰਨੀ ਰਕਮ ਚਾਹੀਦੀ ਹੈ?"
    ]
  },
  "PNL-QL-072": {
    "en": [
      "Two fruit crates are sold for ₹{commonSellingPrice} each. The first sale gives {firstRatePercent}% {firstDirection} and the second {secondRatePercent}% {secondDirection}. Find the combined profit or loss percentage.",
      "A merchant sells two crates at the same selling price of ₹{commonSellingPrice}. Their individual results are {firstRatePercent}% {firstDirection} and {secondRatePercent}% {secondDirection}. What is the overall percentage result?"
    ],
    "hi": [
      "दो फल-क्रेट ₹{commonSellingPrice} प्रति क्रेट की समान कीमत पर बेचे जाते हैं। पहली बिक्री में {firstRatePercent}% {firstDirection} और दूसरी में {secondRatePercent}% {secondDirection} है। कुल लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "एक व्यापारी दो क्रेट ₹{commonSellingPrice} की समान विक्रय कीमत पर बेचता है। अलग-अलग परिणाम {firstRatePercent}% {firstDirection} और {secondRatePercent}% {secondDirection} हैं। कुल प्रतिशत परिणाम क्या है?"
    ],
    "pa": [
      "ਦੋ ਫਲਾਂ ਦੇ ਕਰੇਟ ₹{commonSellingPrice} ਪ੍ਰਤੀ ਕਰੇਟ ਇੱਕੋ ਵਿਕਰੀ ਮੁੱਲ 'ਤੇ ਵੇਚੇ ਜਾਂਦੇ ਹਨ। ਪਹਿਲੀ ਵਿਕਰੀ ਵਿੱਚ {firstRatePercent}% {firstDirection} ਅਤੇ ਦੂਜੀ ਵਿੱਚ {secondRatePercent}% {secondDirection} ਹੈ। ਕੁੱਲ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਵਪਾਰੀ ਦੋ ਕਰੇਟ ₹{commonSellingPrice} ਦੇ ਇੱਕੋ ਵਿਕਰੀ ਮੁੱਲ 'ਤੇ ਵੇਚਦਾ ਹੈ। ਵੱਖ-ਵੱਖ ਨਤੀਜੇ {firstRatePercent}% {firstDirection} ਅਤੇ {secondRatePercent}% {secondDirection} ਹਨ। ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਨਤੀਜਾ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-073": {
    "en": [
      "Two machines are bought for ₹{commonCostPrice} each. One is sold at {firstRatePercent}% {firstDirection} and the other at {secondRatePercent}% {secondDirection}. Find the overall profit or loss percentage.",
      "An equipment dealer pays the same cost, ₹{commonCostPrice}, for each of two machines. Their sale results are {firstRatePercent}% {firstDirection} and {secondRatePercent}% {secondDirection}. Determine the combined percentage result."
    ],
    "hi": [
      "दो मशीनें ₹{commonCostPrice} प्रति मशीन की समान लागत पर खरीदी जाती हैं। एक पर {firstRatePercent}% {firstDirection} और दूसरी पर {secondRatePercent}% {secondDirection} होता है। कुल लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "एक उपकरण व्यापारी दो मशीनों के लिए समान क्रय मूल्य ₹{commonCostPrice} देता है। बिक्री परिणाम {firstRatePercent}% {firstDirection} और {secondRatePercent}% {secondDirection} हैं। संयुक्त प्रतिशत परिणाम ज्ञात कीजिए।"
    ],
    "pa": [
      "ਦੋ ਮਸ਼ੀਨਾਂ ₹{commonCostPrice} ਪ੍ਰਤੀ ਮਸ਼ੀਨ ਇੱਕੋ ਲਾਗਤ 'ਤੇ ਖਰੀਦੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਇੱਕ 'ਤੇ {firstRatePercent}% {firstDirection} ਅਤੇ ਦੂਜੀ 'ਤੇ {secondRatePercent}% {secondDirection} ਹੁੰਦਾ ਹੈ। ਕੁੱਲ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਉਪਕਰਣ ਵਪਾਰੀ ਦੋ ਮਸ਼ੀਨਾਂ ਲਈ ਇੱਕੋ ਖਰੀਦ ਮੁੱਲ ₹{commonCostPrice} ਦਿੰਦਾ ਹੈ। ਵਿਕਰੀ ਨਤੀਜੇ {firstRatePercent}% {firstDirection} ਅਤੇ {secondRatePercent}% {secondDirection} ਹਨ। ਮਿਲਿਆ-ਜੁਲਿਆ ਪ੍ਰਤੀਸ਼ਤ ਨਤੀਜਾ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-076": {
    "en": [
      "A wholesaler pays for {paidQuantity} units at ₹{unitCostPrice} each and gets {freeQuantity} more units free. If every unit is sold for ₹{unitSellingPrice}, find the overall profit or loss percentage.",
      "Under a promotional purchase, {paidQuantity} units cost ₹{unitCostPrice} each and {freeQuantity} additional units are free. All units are later sold at ₹{unitSellingPrice} each. Determine the overall percentage result."
    ],
    "hi": [
      "एक थोक व्यापारी {paidQuantity} इकाइयों के लिए ₹{unitCostPrice} प्रति इकाई भुगतान करता है और {freeQuantity} अतिरिक्त इकाइयाँ मुफ्त मिलती हैं। सभी इकाइयाँ ₹{unitSellingPrice} प्रति इकाई बिकती हैं। कुल लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "एक प्रचार प्रस्ताव में {paidQuantity} इकाइयाँ ₹{unitCostPrice} प्रति इकाई खरीदी जाती हैं और {freeQuantity} इकाइयाँ मुफ्त मिलती हैं। सभी इकाइयाँ ₹{unitSellingPrice} में बेची जाती हैं। कुल प्रतिशत परिणाम ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਥੋਕ ਵਪਾਰੀ {paidQuantity} ਇਕਾਈਆਂ ਲਈ ₹{unitCostPrice} ਪ੍ਰਤੀ ਇਕਾਈ ਭੁਗਤਾਨ ਕਰਦਾ ਹੈ ਅਤੇ {freeQuantity} ਹੋਰ ਇਕਾਈਆਂ ਮੁਫ਼ਤ ਮਿਲਦੀਆਂ ਹਨ। ਸਾਰੀਆਂ ਇਕਾਈਆਂ ₹{unitSellingPrice} ਪ੍ਰਤੀ ਇਕਾਈ ਵੇਚੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਕੁੱਲ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਪ੍ਰਚਾਰਕ ਪੇਸ਼ਕਸ਼ ਵਿੱਚ {paidQuantity} ਇਕਾਈਆਂ ₹{unitCostPrice} ਪ੍ਰਤੀ ਇਕਾਈ ਖਰੀਦੀਆਂ ਜਾਂਦੀਆਂ ਹਨ ਅਤੇ {freeQuantity} ਇਕਾਈਆਂ ਮੁਫ਼ਤ ਮਿਲਦੀਆਂ ਹਨ। ਸਾਰੀਆਂ ਇਕਾਈਆਂ ₹{unitSellingPrice} ਵਿੱਚ ਵੇਚੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਨਤੀਜਾ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-085": {
    "en": [
      "A stock costs ₹{totalCostPrice} in total. If it is sold at {ratePercent}% {direction}, find the total selling price.",
      "The total purchase cost of an inventory is ₹{totalCostPrice}. What total sale value corresponds to {ratePercent}% {direction}?"
    ],
    "hi": [
      "किसी स्टॉक का कुल क्रय मूल्य ₹{totalCostPrice} है। इसे {ratePercent}% {direction} पर बेचने पर कुल विक्रय मूल्य ज्ञात कीजिए।",
      "इन्वेंटरी की कुल लागत ₹{totalCostPrice} है। {ratePercent}% {direction} के लिए कुल बिक्री मूल्य क्या होगा?"
    ],
    "pa": [
      "ਕਿਸੇ ਸਟਾਕ ਦਾ ਕੁੱਲ ਖਰੀਦ ਮੁੱਲ ₹{totalCostPrice} ਹੈ। ਇਸਨੂੰ {ratePercent}% {direction} 'ਤੇ ਵੇਚਣ ਨਾਲ ਕੁੱਲ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਇਨਵੈਂਟਰੀ ਦੀ ਕੁੱਲ ਲਾਗਤ ₹{totalCostPrice} ਹੈ। {ratePercent}% {direction} ਲਈ ਕੁੱਲ ਵਿਕਰੀ ਮੁੱਲ ਕੀ ਹੋਵੇਗਾ?"
    ]
  },
  "PNL-QL-086": {
    "en": [
      "A stock is sold for ₹{totalSellingPrice} in total at {ratePercent}% {direction}. Find its total cost price.",
      "The total sale value of an inventory is ₹{totalSellingPrice}, representing {ratePercent}% {direction}. Determine the original total cost."
    ],
    "hi": [
      "एक स्टॉक कुल ₹{totalSellingPrice} में {ratePercent}% {direction} पर बेचा जाता है। उसका कुल क्रय मूल्य ज्ञात कीजिए।",
      "इन्वेंटरी का कुल विक्रय मूल्य ₹{totalSellingPrice} है और परिणाम {ratePercent}% {direction} है। मूल कुल लागत ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਸਟਾਕ ਕੁੱਲ ₹{totalSellingPrice} ਵਿੱਚ {ratePercent}% {direction} 'ਤੇ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ। ਇਸਦਾ ਕੁੱਲ ਖਰੀਦ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਇਨਵੈਂਟਰੀ ਦਾ ਕੁੱਲ ਵਿਕਰੀ ਮੁੱਲ ₹{totalSellingPrice} ਹੈ ਅਤੇ ਨਤੀਜਾ {ratePercent}% {direction} ਹੈ। ਮੂਲ ਕੁੱਲ ਲਾਗਤ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-087": {
    "en": [
      "The total cost of a stock is ₹{totalCostPrice}, while the amount recovered is {recoveredFraction} of that cost. Find the overall profit or loss percentage.",
      "A trader recovers {recoveredFraction} of the ₹{totalCostPrice} total stock cost. What is the overall percentage profit or loss?"
    ],
    "hi": [
      "स्टॉक की कुल लागत ₹{totalCostPrice} है और वसूली उस लागत का {recoveredFraction} है। कुल लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "एक व्यापारी ₹{totalCostPrice} की कुल स्टॉक लागत का {recoveredFraction} वसूल करता है। कुल प्रतिशत लाभ या हानि क्या है?"
    ],
    "pa": [
      "ਸਟਾਕ ਦੀ ਕੁੱਲ ਲਾਗਤ ₹{totalCostPrice} ਹੈ ਅਤੇ ਵਸੂਲੀ ਉਸ ਲਾਗਤ ਦਾ {recoveredFraction} ਹੈ। ਕੁੱਲ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਵਪਾਰੀ ₹{totalCostPrice} ਦੀ ਕੁੱਲ ਸਟਾਕ ਲਾਗਤ ਦਾ {recoveredFraction} ਵਸੂਲ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਲਾਭ ਜਾਂ ਘਾਟਾ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-095": {
    "en": [
      "A wholesaler buys a fabric consignment for ₹{initialCostPrice}, sells it to a distributor at {firstRatePercent}% {firstDirection}, and the distributor sells it onward at {secondRatePercent}% {secondDirection}. Find the retailer's purchase price.",
      "A fabric lot costing ₹{initialCostPrice} passes through two sales: {firstRatePercent}% {firstDirection} followed by {secondRatePercent}% {secondDirection}. What does the final retailer pay?"
    ],
    "hi": [
      "एक थोक व्यापारी कपड़े की खेप ₹{initialCostPrice} में खरीदता है, उसे वितरक को {firstRatePercent}% {firstDirection} पर बेचता है और वितरक आगे {secondRatePercent}% {secondDirection} पर बेचता है। खुदरा विक्रेता द्वारा चुकाई गई कीमत ज्ञात कीजिए।",
      "₹{initialCostPrice} लागत वाली कपड़े की खेप दो बिक्री चरणों से गुजरती है: पहले {firstRatePercent}% {firstDirection}, फिर {secondRatePercent}% {secondDirection}। अंतिम खुदरा विक्रेता कितना भुगतान करेगा?"
    ],
    "pa": [
      "ਇੱਕ ਥੋਕ ਵਪਾਰੀ ਕੱਪੜੇ ਦੀ ਖੇਪ ₹{initialCostPrice} ਵਿੱਚ ਖਰੀਦਦਾ ਹੈ, ਇਸਨੂੰ ਡਿਸਟ੍ਰੀਬਿਊਟਰ ਨੂੰ {firstRatePercent}% {firstDirection} 'ਤੇ ਵੇਚਦਾ ਹੈ ਅਤੇ ਡਿਸਟ੍ਰੀਬਿਊਟਰ ਅੱਗੇ {secondRatePercent}% {secondDirection} 'ਤੇ ਵੇਚਦਾ ਹੈ। ਰਿਟੇਲਰ ਵੱਲੋਂ ਦਿੱਤੀ ਕੀਮਤ ਪਤਾ ਕਰੋ।",
      "₹{initialCostPrice} ਲਾਗਤ ਵਾਲੀ ਕੱਪੜੇ ਦੀ ਖੇਪ ਦੋ ਵਿਕਰੀ ਪੜਾਅਾਂ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ: ਪਹਿਲਾਂ {firstRatePercent}% {firstDirection}, ਫਿਰ {secondRatePercent}% {secondDirection}। ਅੰਤਿਮ ਰਿਟੇਲਰ ਕਿੰਨਾ ਭੁਗਤਾਨ ਕਰੇਗਾ?"
    ]
  },
  "PNL-QL-096": {
    "en": [
      "A shipment costing ₹{initialCostPrice} is sold successively at {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection}, and {thirdRatePercent}% {thirdDirection}. Find the final retailer's price.",
      "An electronics shipment starts at ₹{initialCostPrice}. Three successive transfers give {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection}, and {thirdRatePercent}% {thirdDirection}. What is the final selling price?"
    ],
    "hi": [
      "₹{initialCostPrice} की खेप को क्रमशः {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection} और {thirdRatePercent}% {thirdDirection} पर बेचा जाता है। अंतिम खुदरा मूल्य ज्ञात कीजिए।",
      "एक इलेक्ट्रॉनिक्स खेप की प्रारंभिक लागत ₹{initialCostPrice} है। तीन लगातार लेन-देन में {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection} और {thirdRatePercent}% {thirdDirection} होता है। अंतिम विक्रय मूल्य क्या है?"
    ],
    "pa": [
      "₹{initialCostPrice} ਦੀ ਖੇਪ ਨੂੰ ਲਗਾਤਾਰ {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection} ਅਤੇ {thirdRatePercent}% {thirdDirection} 'ਤੇ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਰਿਟੇਲ ਕੀਮਤ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਇਲੈਕਟ੍ਰਾਨਿਕਸ ਖੇਪ ਦੀ ਸ਼ੁਰੂਆਤੀ ਲਾਗਤ ₹{initialCostPrice} ਹੈ। ਤਿੰਨ ਲਗਾਤਾਰ ਲੈਣ-ਦੇਣਾਂ ਵਿੱਚ {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection} ਅਤੇ {thirdRatePercent}% {thirdDirection} ਹੁੰਦਾ ਹੈ। ਅੰਤਿਮ ਵਿਕਰੀ ਮੁੱਲ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-097": {
    "en": [
      "A book lot changes hands twice at {firstRatePercent}% {firstDirection} and {secondRatePercent}% {secondDirection}. The bookstore finally pays ₹{finalSellingPrice}. Find the publisher's original cost.",
      "After two successive sales at {firstRatePercent}% {firstDirection} and {secondRatePercent}% {secondDirection}, a book lot reaches a bookstore for ₹{finalSellingPrice}. What was its initial cost price?"
    ],
    "hi": [
      "एक पुस्तक खेप दो बार क्रमशः {firstRatePercent}% {firstDirection} और {secondRatePercent}% {secondDirection} पर बेची जाती है। अंत में पुस्तक विक्रेता ₹{finalSellingPrice} देता है। प्रकाशक की मूल लागत ज्ञात कीजिए।",
      "{firstRatePercent}% {firstDirection} और {secondRatePercent}% {secondDirection} की दो लगातार बिक्री के बाद पुस्तक खेप ₹{finalSellingPrice} में पुस्तक विक्रेता तक पहुँचती है। प्रारंभिक क्रय मूल्य क्या था?"
    ],
    "pa": [
      "ਇੱਕ ਕਿਤਾਬਾਂ ਦੀ ਖੇਪ ਦੋ ਵਾਰ ਲਗਾਤਾਰ {firstRatePercent}% {firstDirection} ਅਤੇ {secondRatePercent}% {secondDirection} 'ਤੇ ਵੇਚੀ ਜਾਂਦੀ ਹੈ। ਅੰਤ ਵਿੱਚ ਬੁੱਕਸਟੋਰ ₹{finalSellingPrice} ਭਰਦਾ ਹੈ। ਪ੍ਰਕਾਸ਼ਕ ਦੀ ਮੂਲ ਲਾਗਤ ਪਤਾ ਕਰੋ।",
      "{firstRatePercent}% {firstDirection} ਅਤੇ {secondRatePercent}% {secondDirection} ਦੀਆਂ ਦੋ ਲਗਾਤਾਰ ਵਿਕਰੀਆਂ ਤੋਂ ਬਾਅਦ ਕਿਤਾਬਾਂ ਦੀ ਖੇਪ ₹{finalSellingPrice} ਵਿੱਚ ਬੁੱਕਸਟੋਰ ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਖਰੀਦ ਮੁੱਲ ਕੀ ਸੀ?"
    ]
  },
  "PNL-QL-098": {
    "en": [
      "A used vehicle passes through three successive sales at {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection}, and {thirdRatePercent}% {thirdDirection}. The last buyer pays ₹{finalSellingPrice}. Find the first owner's cost price.",
      "The final price of a used vehicle is ₹{finalSellingPrice} after three transfers at {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection}, and {thirdRatePercent}% {thirdDirection}. Determine the original purchase price."
    ],
    "hi": [
      "एक पुराना वाहन तीन लगातार बिक्री चरणों से गुजरता है: {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection} और {thirdRatePercent}% {thirdDirection}। अंतिम खरीदार ₹{finalSellingPrice} देता है। पहले मालिक का क्रय मूल्य ज्ञात कीजिए।",
      "तीन लेन-देन—{firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection}, और {thirdRatePercent}% {thirdDirection}—के बाद पुराने वाहन की अंतिम कीमत ₹{finalSellingPrice} है। मूल क्रय मूल्य ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਪੁਰਾਣਾ ਵਾਹਨ ਤਿੰਨ ਲਗਾਤਾਰ ਵਿਕਰੀ ਪੜਾਅਾਂ ਵਿੱਚੋਂ ਲੰਘਦਾ ਹੈ: {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection} ਅਤੇ {thirdRatePercent}% {thirdDirection}। ਅੰਤਿਮ ਖਰੀਦਦਾਰ ₹{finalSellingPrice} ਭਰਦਾ ਹੈ। ਪਹਿਲੇ ਮਾਲਕ ਦਾ ਖਰੀਦ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਤਿੰਨ ਲੈਣ-ਦੇਣ—{firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection} ਅਤੇ {thirdRatePercent}% {thirdDirection}—ਤੋਂ ਬਾਅਦ ਪੁਰਾਣੇ ਵਾਹਨ ਦੀ ਅੰਤਿਮ ਕੀਮਤ ₹{finalSellingPrice} ਹੈ। ਮੂਲ ਖਰੀਦ ਮੁੱਲ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-099": {
    "en": [
      "A farm-equipment unit costs ₹{initialCostPrice} initially and then goes through these resale stages: {stages}. Find its price immediately after stage {afterStage}.",
      "Starting from ₹{initialCostPrice}, a farm machine is resold through the stages {stages}. What is its value just after transaction {afterStage}?"
    ],
    "hi": [
      "कृषि उपकरण की प्रारंभिक लागत ₹{initialCostPrice} है और इसके बाद बिक्री चरण हैं: {stages}। चरण {afterStage} के तुरंत बाद की कीमत ज्ञात कीजिए।",
      "₹{initialCostPrice} से शुरू होकर एक कृषि मशीन इन पुनर्विक्रय चरणों से गुजरती है: {stages}। लेन-देन {afterStage} के बाद उसका मूल्य क्या है?"
    ],
    "pa": [
      "ਖੇਤੀਬਾੜੀ ਉਪਕਰਣ ਦੀ ਸ਼ੁਰੂਆਤੀ ਲਾਗਤ ₹{initialCostPrice} ਹੈ ਅਤੇ ਇਸ ਤੋਂ ਬਾਅਦ ਵਿਕਰੀ ਪੜਾਅ ਹਨ: {stages}। ਪੜਾਅ {afterStage} ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਦੀ ਕੀਮਤ ਪਤਾ ਕਰੋ।",
      "₹{initialCostPrice} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ਇੱਕ ਖੇਤੀ ਮਸ਼ੀਨ ਇਨ੍ਹਾਂ ਮੁੜ-ਵਿਕਰੀ ਪੜਾਅਾਂ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ: {stages}। ਲੈਣ-ਦੇਣ {afterStage} ਤੋਂ ਬਾਅਦ ਇਸਦੀ ਕੀਮਤ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-100": {
    "en": [
      "A furniture set passes through the resale stages {stages}. Find the overall percentage gain or loss from the first purchase to the last sale.",
      "Consider the complete resale chain {stages} for a furniture set. What is the net profit or loss percentage over the entire chain?"
    ],
    "hi": [
      "एक फर्नीचर सेट इन पुनर्विक्रय चरणों से गुजरता है: {stages}। पहली खरीद से अंतिम बिक्री तक कुल लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "फर्नीचर सेट की पूरी बिक्री शृंखला {stages} है। पूरे क्रम में शुद्ध लाभ या हानि प्रतिशत क्या है?"
    ],
    "pa": [
      "ਇੱਕ ਫਰਨੀਚਰ ਸੈੱਟ ਇਨ੍ਹਾਂ ਮੁੜ-ਵਿਕਰੀ ਪੜਾਅਾਂ ਵਿੱਚੋਂ ਲੰਘਦਾ ਹੈ: {stages}। ਪਹਿਲੀ ਖਰੀਦ ਤੋਂ ਅੰਤਿਮ ਵਿਕਰੀ ਤੱਕ ਕੁੱਲ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਫਰਨੀਚਰ ਸੈੱਟ ਦੀ ਪੂਰੀ ਵਿਕਰੀ ਲੜੀ {stages} ਹੈ। ਪੂਰੀ ਲੜੀ ਵਿੱਚ ਸ਼ੁੱਧ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-101": {
    "en": [
      "A medicine consignment passes through three sales at {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection}, and {thirdRatePercent}% {thirdDirection}. Find the overall profit or loss percentage from the manufacturer's original cost.",
      "A manufacturer, distributor and stockist sell the same medicine lot successively at {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection} and {thirdRatePercent}% {thirdDirection}. What is the net percentage result?"
    ],
    "hi": [
      "एक दवा खेप तीन बिक्री चरणों से गुजरती है: {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection} और {thirdRatePercent}% {thirdDirection}। निर्माता की मूल लागत से कुल लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "निर्माता, वितरक और स्टॉकिस्ट एक ही दवा खेप को क्रमशः {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection} और {thirdRatePercent}% {thirdDirection} पर बेचते हैं। शुद्ध प्रतिशत परिणाम क्या है?"
    ],
    "pa": [
      "ਇੱਕ ਦਵਾਈ ਖੇਪ ਤਿੰਨ ਵਿਕਰੀ ਪੜਾਅਾਂ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ: {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection} ਅਤੇ {thirdRatePercent}% {thirdDirection}। ਨਿਰਮਾਤਾ ਦੀ ਮੂਲ ਲਾਗਤ ਤੋਂ ਕੁੱਲ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਨਿਰਮਾਤਾ, ਡਿਸਟ੍ਰੀਬਿਊਟਰ ਅਤੇ ਸਟਾਕਿਸਟ ਇੱਕੋ ਦਵਾਈ ਖੇਪ ਨੂੰ ਲਗਾਤਾਰ {firstRatePercent}% {firstDirection}, {secondRatePercent}% {secondDirection} ਅਤੇ {thirdRatePercent}% {thirdDirection} 'ਤੇ ਵੇਚਦੇ ਹਨ। ਸ਼ੁੱਧ ਪ੍ਰਤੀਸ਼ਤ ਨਤੀਜਾ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-102": {
    "en": [
      "An industrial pump is bought for ₹{initialCostPrice} and reaches the customer for ₹{finalSellingPrice}. With known stages {knownStages}, find the missing {missingDirection} percentage.",
      "A pump starts at ₹{initialCostPrice} and ends at ₹{finalSellingPrice}. All resale stages except one are {knownStages}; the missing stage is a {missingDirection}. Determine its percentage."
    ],
    "hi": [
      "एक औद्योगिक पंप ₹{initialCostPrice} में खरीदा जाता है और ग्राहक तक ₹{finalSellingPrice} में पहुँचता है। ज्ञात चरण {knownStages} हैं। लापता {missingDirection} प्रतिशत ज्ञात कीजिए।",
      "एक पंप की प्रारंभिक कीमत ₹{initialCostPrice} और अंतिम कीमत ₹{finalSellingPrice} है। एक को छोड़कर सभी बिक्री चरण {knownStages} हैं; लापता चरण {missingDirection} है। उसका प्रतिशत ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਉਦਯੋਗਿਕ ਪੰਪ ₹{initialCostPrice} ਵਿੱਚ ਖਰੀਦਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਗਾਹਕ ਤੱਕ ₹{finalSellingPrice} ਵਿੱਚ ਪਹੁੰਚਦਾ ਹੈ। ਜਾਣੇ-ਪਛਾਣੇ ਪੜਾਅ {knownStages} ਹਨ। ਗੁੰਮ {missingDirection} ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਪੰਪ ਦੀ ਸ਼ੁਰੂਆਤੀ ਕੀਮਤ ₹{initialCostPrice} ਅਤੇ ਅੰਤਿਮ ਕੀਮਤ ₹{finalSellingPrice} ਹੈ। ਇੱਕ ਤੋਂ ਇਲਾਵਾ ਸਾਰੇ ਵਿਕਰੀ ਪੜਾਅ {knownStages} ਹਨ; ਗੁੰਮ ਪੜਾਅ {missingDirection} ਹੈ। ਇਸਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-103": {
    "en": [
      "A tile consignment starts at ₹{initialCostPrice} and is finally sold for ₹{finalSellingPrice}. Given the known transfers {knownStages}, determine the missing {missingDirection} percentage.",
      "The initial and final prices of a tile consignment are ₹{initialCostPrice} and ₹{finalSellingPrice}. The known resale stages are {knownStages}; find the rate of the missing {missingDirection} stage."
    ],
    "hi": [
      "एक टाइल खेप की प्रारंभिक कीमत ₹{initialCostPrice} और अंतिम विक्रय मूल्य ₹{finalSellingPrice} है। ज्ञात स्थानांतरण {knownStages} हैं। लापता {missingDirection} प्रतिशत ज्ञात कीजिए।",
      "टाइल खेप का आरंभिक मूल्य ₹{initialCostPrice} और अंतिम मूल्य ₹{finalSellingPrice} है। ज्ञात पुनर्विक्रय चरण {knownStages} हैं; लापता {missingDirection} चरण की दर ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਟਾਈਲ ਖੇਪ ਦੀ ਸ਼ੁਰੂਆਤੀ ਕੀਮਤ ₹{initialCostPrice} ਅਤੇ ਅੰਤਿਮ ਵਿਕਰੀ ਮੁੱਲ ₹{finalSellingPrice} ਹੈ। ਜਾਣੇ-ਪਛਾਣੇ ਟ੍ਰਾਂਸਫਰ {knownStages} ਹਨ। ਗੁੰਮ {missingDirection} ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਟਾਈਲ ਖੇਪ ਦਾ ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ ₹{initialCostPrice} ਅਤੇ ਅੰਤਿਮ ਮੁੱਲ ₹{finalSellingPrice} ਹੈ। ਜਾਣੇ-ਪਛਾਣੇ ਮੁੜ-ਵਿਕਰੀ ਪੜਾਅ {knownStages} ਹਨ; ਗੁੰਮ {missingDirection} ਪੜਾਅ ਦੀ ਦਰ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-104": {
    "en": [
      "A sports-goods batch costing ₹{initialCostPrice} is resold through {stageCount} dealerships, each at {ratePercent}% {direction}. Find the final selling price.",
      "Starting from ₹{initialCostPrice}, the same {ratePercent}% {direction} is applied at each of {stageCount} successive sales. What is the final price?"
    ],
    "hi": [
      "₹{initialCostPrice} लागत वाले खेल-सामान के बैच को {stageCount} लगातार चरणों में हर बार {ratePercent}% {direction} पर बेचा जाता है। अंतिम विक्रय मूल्य ज्ञात कीजिए।",
      "₹{initialCostPrice} से शुरू होकर {stageCount} लगातार बिक्री में हर बार {ratePercent}% {direction} लागू होता है। अंतिम कीमत क्या होगी?"
    ],
    "pa": [
      "₹{initialCostPrice} ਲਾਗਤ ਵਾਲੇ ਖੇਡ ਸਮਾਨ ਦੇ ਬੈਚ ਨੂੰ {stageCount} ਲਗਾਤਾਰ ਪੜਾਅਾਂ ਵਿੱਚ ਹਰ ਵਾਰ {ratePercent}% {direction} 'ਤੇ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "₹{initialCostPrice} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ {stageCount} ਲਗਾਤਾਰ ਵਿਕਰੀਆਂ ਵਿੱਚ ਹਰ ਵਾਰ {ratePercent}% {direction} ਲਾਗੂ ਹੁੰਦਾ ਹੈ। ਅੰਤਿਮ ਕੀਮਤ ਕੀ ਹੋਵੇਗੀ?"
    ]
  },
  "PNL-QL-107": {
    "en": [
      "A workshop buys a used generator for ₹{purchasePrice} and spends ₹{buyerExpense} on repairs. At what price should it be sold to obtain {ratePercent}% {direction} on effective cost?",
      "The purchase price of a generator is ₹{purchasePrice} and repair expense is ₹{buyerExpense}. Find the selling price required for {ratePercent}% {direction} on total effective cost."
    ],
    "hi": [
      "एक कार्यशाला पुराना जनरेटर ₹{purchasePrice} में खरीदती है और मरम्मत पर ₹{buyerExpense} खर्च करती है। प्रभावी लागत पर {ratePercent}% {direction} के लिए विक्रय मूल्य ज्ञात कीजिए।",
      "जनरेटर का क्रय मूल्य ₹{purchasePrice} और मरम्मत खर्च ₹{buyerExpense} है। कुल प्रभावी लागत पर {ratePercent}% {direction} के लिए आवश्यक विक्रय मूल्य ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਵਰਕਸ਼ਾਪ ਪੁਰਾਣਾ ਜਨਰੇਟਰ ₹{purchasePrice} ਵਿੱਚ ਖਰੀਦਦੀ ਹੈ ਅਤੇ ਮੁਰੰਮਤ 'ਤੇ ₹{buyerExpense} ਖਰਚਦੀ ਹੈ। ਪ੍ਰਭਾਵੀ ਲਾਗਤ 'ਤੇ {ratePercent}% {direction} ਲਈ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਜਨਰੇਟਰ ਦਾ ਖਰੀਦ ਮੁੱਲ ₹{purchasePrice} ਅਤੇ ਮੁਰੰਮਤ ਖਰਚ ₹{buyerExpense} ਹੈ। ਕੁੱਲ ਪ੍ਰਭਾਵੀ ਲਾਗਤ 'ਤੇ {ratePercent}% {direction} ਲਈ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-108": {
    "en": [
      "An art dealer sells a painting for ₹{grossSellingPrice}, while the auction house deducts {commissionPercent}% commission from the gross price. Find the dealer's net receipt.",
      "A painting fetches ₹{grossSellingPrice} at auction. After {commissionPercent}% commission is deducted, how much does the dealer receive?"
    ],
    "hi": [
      "एक कला-विक्रेता पेंटिंग ₹{grossSellingPrice} में बेचता है और नीलामी घर सकल मूल्य का {commissionPercent}% कमीशन काटता है। विक्रेता की शुद्ध प्राप्ति ज्ञात कीजिए।",
      "एक पेंटिंग नीलामी में ₹{grossSellingPrice} में बिकती है। {commissionPercent}% कमीशन काटने के बाद विक्रेता को कितनी राशि मिलेगी?"
    ],
    "pa": [
      "ਇੱਕ ਕਲਾ-ਵਿਕਰੇਤਾ ਪੇਂਟਿੰਗ ₹{grossSellingPrice} ਵਿੱਚ ਵੇਚਦਾ ਹੈ ਅਤੇ ਨਿਲਾਮੀ ਘਰ ਕੁੱਲ ਕੀਮਤ ਦਾ {commissionPercent}% ਕਮਿਸ਼ਨ ਕੱਟਦਾ ਹੈ। ਵਿਕਰੇਤਾ ਦੀ ਸ਼ੁੱਧ ਪ੍ਰਾਪਤੀ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਪੇਂਟਿੰਗ ਨਿਲਾਮੀ ਵਿੱਚ ₹{grossSellingPrice} ਵਿੱਚ ਵਿਕਦੀ ਹੈ। {commissionPercent}% ਕਮਿਸ਼ਨ ਕੱਟਣ ਤੋਂ ਬਾਅਦ ਵਿਕਰੇਤਾ ਨੂੰ ਕਿੰਨੀ ਰਕਮ ਮਿਲੇਗੀ?"
    ]
  },
  "PNL-QL-109": {
    "en": [
      "A property owner must receive ₹{requiredNetReceipt} after a broker deducts {commissionPercent}% commission. Find the gross selling price that should be quoted.",
      "After {commissionPercent}% brokerage is deducted, the owner wants a net receipt of ₹{requiredNetReceipt}. What gross sale price is required?"
    ],
    "hi": [
      "एक संपत्ति मालिक को दलाल का {commissionPercent}% कमीशन काटने के बाद ₹{requiredNetReceipt} मिलना चाहिए। आवश्यक सकल विक्रय मूल्य ज्ञात कीजिए।",
      "{commissionPercent}% दलाली काटने के बाद मालिक को ₹{requiredNetReceipt} शुद्ध प्राप्ति चाहिए। आवश्यक सकल बिक्री मूल्य क्या होगा?"
    ],
    "pa": [
      "ਇੱਕ ਜਾਇਦਾਦ ਮਾਲਕ ਨੂੰ ਦਲਾਲ ਦਾ {commissionPercent}% ਕਮਿਸ਼ਨ ਕੱਟਣ ਤੋਂ ਬਾਅਦ ₹{requiredNetReceipt} ਮਿਲਣਾ ਚਾਹੀਦਾ ਹੈ। ਲੋੜੀਂਦਾ ਕੁੱਲ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "{commissionPercent}% ਦਲਾਲੀ ਕੱਟਣ ਤੋਂ ਬਾਅਦ ਮਾਲਕ ਨੂੰ ₹{requiredNetReceipt} ਸ਼ੁੱਧ ਪ੍ਰਾਪਤੀ ਚਾਹੀਦੀ ਹੈ। ਲੋੜੀਂਦਾ ਕੁੱਲ ਵਿਕਰੀ ਮੁੱਲ ਕੀ ਹੋਵੇਗਾ?"
    ]
  },
  "PNL-QL-110": {
    "en": [
      "A trader buys machinery for ₹{purchasePrice}, spends ₹{buyerExpense} preparing it for sale, and sells it for ₹{grossSellingPrice}. An agent keeps {commissionPercent}% of the gross price. Find the trader's percentage gain or loss.",
      "Machinery costs ₹{purchasePrice} plus ₹{buyerExpense} in preparation. It is sold for ₹{grossSellingPrice}, with {commissionPercent}% commission deducted. Calculate the trader's profit or loss percentage."
    ],
    "hi": [
      "एक व्यापारी मशीन ₹{purchasePrice} में खरीदता है, बिक्री से पहले ₹{buyerExpense} खर्च करता है और उसे ₹{grossSellingPrice} में बेचता है। एजेंट सकल मूल्य का {commissionPercent}% रखता है। व्यापारी का लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "मशीनरी की खरीद ₹{purchasePrice} और तैयारी खर्च ₹{buyerExpense} है। उसे ₹{grossSellingPrice} में बेचा जाता है और {commissionPercent}% कमीशन काटा जाता है। व्यापारी का लाभ या हानि प्रतिशत ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਵਪਾਰੀ ਮਸ਼ੀਨਰੀ ₹{purchasePrice} ਵਿੱਚ ਖਰੀਦਦਾ ਹੈ, ਵਿਕਰੀ ਤੋਂ ਪਹਿਲਾਂ ₹{buyerExpense} ਖਰਚਦਾ ਹੈ ਅਤੇ ਇਸਨੂੰ ₹{grossSellingPrice} ਵਿੱਚ ਵੇਚਦਾ ਹੈ। ਏਜੰਟ ਕੁੱਲ ਕੀਮਤ ਦਾ {commissionPercent}% ਰੱਖਦਾ ਹੈ। ਵਪਾਰੀ ਦਾ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਮਸ਼ੀਨਰੀ ਦੀ ਖਰੀਦ ₹{purchasePrice} ਅਤੇ ਤਿਆਰੀ ਖਰਚ ₹{buyerExpense} ਹੈ। ਇਸਨੂੰ ₹{grossSellingPrice} ਵਿੱਚ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ {commissionPercent}% ਕਮਿਸ਼ਨ ਕੱਟਿਆ ਜਾਂਦਾ ਹੈ। ਵਪਾਰੀ ਦਾ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-105": {
    "en": [
      "A phone consignment bought for ₹{initialCostPrice} moves through the stages {stages}. Find the profit or loss amount in transaction {selectedStage}.",
      "Starting with ₹{initialCostPrice}, a phone lot passes through {stages}. What is the absolute profit or loss amount at stage {selectedStage}?"
    ],
    "hi": [
      "₹{initialCostPrice} में खरीदी गई फोन खेप इन चरणों से गुजरती है: {stages}। लेन-देन {selectedStage} में लाभ या हानि की राशि ज्ञात कीजिए।",
      "₹{initialCostPrice} से शुरू होकर फोन की खेप {stages} चरणों से गुजरती है। चरण {selectedStage} में लाभ या हानि की राशि क्या है?"
    ],
    "pa": [
      "₹{initialCostPrice} ਵਿੱਚ ਖਰੀਦੀ ਫੋਨ ਖੇਪ ਇਨ੍ਹਾਂ ਪੜਾਅਾਂ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ: {stages}। ਲੈਣ-ਦੇਣ {selectedStage} ਵਿੱਚ ਲਾਭ ਜਾਂ ਘਾਟੇ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।",
      "₹{initialCostPrice} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ਫੋਨ ਦੀ ਖੇਪ {stages} ਪੜਾਅਾਂ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ। ਪੜਾਅ {selectedStage} ਵਿੱਚ ਲਾਭ ਜਾਂ ਘਾਟੇ ਦੀ ਰਕਮ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-106": {
    "en": [
      "A grain lot costing ₹{initialCostPrice} passes through the trading stages {stages}. Which transaction has the largest absolute profit or loss amount?",
      "A grain consignment starts at ₹{initialCostPrice} and is traded through {stages}. Identify the stage with the greatest profit-or-loss amount in rupees."
    ],
    "hi": [
      "₹{initialCostPrice} की अनाज खेप इन व्यापारिक चरणों से गुजरती है: {stages}। किस लेन-देन में लाभ या हानि की राशि सबसे अधिक है?",
      "एक अनाज खेप ₹{initialCostPrice} से शुरू होकर {stages} चरणों से गुजरती है। रुपये में सबसे बड़ा लाभ या हानि किस चरण में है?"
    ],
    "pa": [
      "₹{initialCostPrice} ਦੀ ਅਨਾਜ ਖੇਪ ਇਨ੍ਹਾਂ ਵਪਾਰਕ ਪੜਾਅਾਂ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ: {stages}। ਕਿਸ ਲੈਣ-ਦੇਣ ਵਿੱਚ ਲਾਭ ਜਾਂ ਘਾਟੇ ਦੀ ਰਕਮ ਸਭ ਤੋਂ ਵੱਧ ਹੈ?",
      "ਇੱਕ ਅਨਾਜ ਖੇਪ ₹{initialCostPrice} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ {stages} ਪੜਾਅਾਂ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ। ਰੁਪਏ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡਾ ਲਾਭ ਜਾਂ ਘਾਟਾ ਕਿਸ ਪੜਾਅ ਵਿੱਚ ਹੈ?"
    ]
  },
  "PNL-QL-111": {
    "en": [
      "An appliance lot bought for ₹{initialCostPrice} moves through the successive transfers {stages}. Find the profit or loss amount made by each trader.",
      "Starting from ₹{initialCostPrice}, an appliance consignment is resold through {stages}. Calculate the rupee gain or loss at every transaction."
    ],
    "hi": [
      "₹{initialCostPrice} में खरीदी गई उपकरण खेप क्रमिक चरणों {stages} से गुजरती है। प्रत्येक व्यापारी का लाभ या हानि राशि ज्ञात कीजिए।",
      "₹{initialCostPrice} से शुरू होकर उपकरण की खेप {stages} चरणों में पुनः बेची जाती है। हर लेन-देन का रुपये में लाभ या हानि ज्ञात कीजिए।"
    ],
    "pa": [
      "₹{initialCostPrice} ਵਿੱਚ ਖਰੀਦੀ ਉਪਕਰਣ ਖੇਪ ਲਗਾਤਾਰ ਪੜਾਅਾਂ {stages} ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ। ਹਰ ਵਪਾਰੀ ਦਾ ਲਾਭ ਜਾਂ ਘਾਟੇ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।",
      "₹{initialCostPrice} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ਉਪਕਰਣ ਖੇਪ {stages} ਪੜਾਅਾਂ ਵਿੱਚ ਮੁੜ ਵੇਚੀ ਜਾਂਦੀ ਹੈ। ਹਰ ਲੈਣ-ਦੇਣ ਦਾ ਰੁਪਏ ਵਿੱਚ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-112": {
    "en": [
      "A handicraft consignment changes hands through {stages}. Find the overall percentage gain or loss from the artisan's original cost to the export buyer's final price.",
      "For the resale chain {stages}, calculate the net profit or loss percentage between the first purchase and the final export sale."
    ],
    "hi": [
      "हस्तशिल्प खेप {stages} चरणों से गुजरती है। कारीगर की मूल लागत से निर्यात खरीदार के अंतिम मूल्य तक कुल लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "पुनर्विक्रय शृंखला {stages} के लिए पहली खरीद से अंतिम निर्यात बिक्री तक शुद्ध लाभ या हानि प्रतिशत ज्ञात कीजिए।"
    ],
    "pa": [
      "ਹਸਤਕਲਾ ਖੇਪ {stages} ਪੜਾਅਾਂ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ। ਕਾਰੀਗਰ ਦੀ ਮੂਲ ਲਾਗਤ ਤੋਂ ਨਿਰਯਾਤ ਖਰੀਦਦਾਰ ਦੀ ਅੰਤਿਮ ਕੀਮਤ ਤੱਕ ਕੁੱਲ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਮੁੜ-ਵਿਕਰੀ ਲੜੀ {stages} ਲਈ ਪਹਿਲੀ ਖਰੀਦ ਤੋਂ ਅੰਤਿਮ ਨਿਰਯਾਤ ਵਿਕਰੀ ਤੱਕ ਸ਼ੁੱਧ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-113": {
    "en": [
      "A laptop is resold through the mixed stages {stages}, and the final customer pays ₹{finalSellingPrice}. Find the first seller's original purchase price.",
      "After the resale sequence {stages}, a laptop reaches the customer for ₹{finalSellingPrice}. What was its starting cost price?"
    ],
    "hi": [
      "एक लैपटॉप मिश्रित पुनर्विक्रय चरणों {stages} से गुजरता है और अंतिम ग्राहक ₹{finalSellingPrice} देता है। पहले विक्रेता का मूल क्रय मूल्य ज्ञात कीजिए।",
      "{stages} पुनर्विक्रय क्रम के बाद लैपटॉप ग्राहक तक ₹{finalSellingPrice} में पहुँचता है। उसका प्रारंभिक क्रय मूल्य क्या था?"
    ],
    "pa": [
      "ਇੱਕ ਲੈਪਟਾਪ ਮਿਲੇ-ਜੁਲੇ ਮੁੜ-ਵਿਕਰੀ ਪੜਾਅਾਂ {stages} ਵਿੱਚੋਂ ਲੰਘਦਾ ਹੈ ਅਤੇ ਅੰਤਿਮ ਗਾਹਕ ₹{finalSellingPrice} ਭਰਦਾ ਹੈ। ਪਹਿਲੇ ਵਿਕਰੇਤਾ ਦਾ ਮੂਲ ਖਰੀਦ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "{stages} ਮੁੜ-ਵਿਕਰੀ ਲੜੀ ਤੋਂ ਬਾਅਦ ਲੈਪਟਾਪ ਗਾਹਕ ਤੱਕ ₹{finalSellingPrice} ਵਿੱਚ ਪਹੁੰਚਦਾ ਹੈ। ਇਸਦਾ ਸ਼ੁਰੂਆਤੀ ਖਰੀਦ ਮੁੱਲ ਕੀ ਸੀ?"
    ]
  },
  "PNL-QL-114": {
    "en": [
      "A construction-material consignment bought for ₹{initialCostPrice} passes through {stages}. Find the difference between the prices after transactions {firstStageNumber} and {secondStageNumber}.",
      "Starting from ₹{initialCostPrice}, a construction-material lot moves through {stages}. By how much do the prices after stages {firstStageNumber} and {secondStageNumber} differ?"
    ],
    "hi": [
      "₹{initialCostPrice} में खरीदी गई निर्माण-सामग्री खेप {stages} चरणों से गुजरती है। लेन-देन {firstStageNumber} और {secondStageNumber} के बाद की कीमतों का अंतर ज्ञात कीजिए।",
      "₹{initialCostPrice} से शुरू होकर निर्माण सामग्री की खेप {stages} चरणों से गुजरती है। चरण {firstStageNumber} और {secondStageNumber} के बाद की कीमतों में कितना अंतर है?"
    ],
    "pa": [
      "₹{initialCostPrice} ਵਿੱਚ ਖਰੀਦੀ ਨਿਰਮਾਣ ਸਮੱਗਰੀ ਦੀ ਖੇਪ {stages} ਪੜਾਅਾਂ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ। ਲੈਣ-ਦੇਣ {firstStageNumber} ਅਤੇ {secondStageNumber} ਤੋਂ ਬਾਅਦ ਦੀਆਂ ਕੀਮਤਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।",
      "₹{initialCostPrice} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ਨਿਰਮਾਣ ਸਮੱਗਰੀ ਦੀ ਖੇਪ {stages} ਪੜਾਅਾਂ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ। ਪੜਾਅ {firstStageNumber} ਅਤੇ {secondStageNumber} ਤੋਂ ਬਾਅਦ ਦੀਆਂ ਕੀਮਤਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?"
    ]
  },
  "PNL-QL-121": {
    "en": [
      "A grain merchant charges the cost price ₹{costPricePerTrueQuantity} for {trueQuantity} kg but actually gives only {deliveredQuantity} kg. Find the true profit percentage.",
      "A seller claims no profit by charging ₹{costPricePerTrueQuantity} for {trueQuantity} kg, yet delivers only {deliveredQuantity} kg. What profit percentage does he actually earn?"
    ],
    "hi": [
      "एक अनाज व्यापारी {trueQuantity} किग्रा के लिए क्रय मूल्य ₹{costPricePerTrueQuantity} ही लेता है, पर देता केवल {deliveredQuantity} किग्रा है। वास्तविक लाभ प्रतिशत ज्ञात कीजिए।",
      "एक विक्रेता ₹{costPricePerTrueQuantity} में {trueQuantity} किग्रा देने का दावा करता है, लेकिन देता केवल {deliveredQuantity} किग्रा है। वास्तविक लाभ प्रतिशत क्या है?"
    ],
    "pa": [
      "ਇੱਕ ਅਨਾਜ ਵਪਾਰੀ {trueQuantity} ਕਿਲੋਗ੍ਰਾਮ ਲਈ ਖਰੀਦ ਮੁੱਲ ₹{costPricePerTrueQuantity} ਹੀ ਲੈਂਦਾ ਹੈ, ਪਰ ਦਿੰਦਾ ਸਿਰਫ਼ {deliveredQuantity} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ਅਸਲ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਵਿਕਰੇਤਾ ₹{costPricePerTrueQuantity} ਵਿੱਚ {trueQuantity} ਕਿਲੋਗ੍ਰਾਮ ਦੇਣ ਦਾ ਦਾਅਵਾ ਕਰਦਾ ਹੈ, ਪਰ ਦਿੰਦਾ ਸਿਰਫ਼ {deliveredQuantity} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ਅਸਲ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-122": {
    "en": [
      "A rice pack truly costs ₹{costPricePerTrueQuantity} for {trueQuantity} kg. The shopkeeper charges ₹{quotedSellingPricePerNominalQuantity} but supplies only {deliveredQuantity} kg. Find the actual profit or loss amount and percentage.",
      "For rice costing ₹{costPricePerTrueQuantity} per {trueQuantity} kg, a seller bills ₹{quotedSellingPricePerNominalQuantity} while delivering {deliveredQuantity} kg. Determine the actual amount and percentage result."
    ],
    "hi": [
      "{trueQuantity} किग्रा चावल की वास्तविक लागत ₹{costPricePerTrueQuantity} है। दुकानदार ₹{quotedSellingPricePerNominalQuantity} लेता है लेकिन देता {deliveredQuantity} किग्रा है। वास्तविक लाभ या हानि की राशि और प्रतिशत ज्ञात कीजिए।",
      "₹{costPricePerTrueQuantity} प्रति {trueQuantity} किग्रा लागत वाले चावल के लिए विक्रेता ₹{quotedSellingPricePerNominalQuantity} बिल करता है और {deliveredQuantity} किग्रा देता है। वास्तविक राशि और प्रतिशत परिणाम ज्ञात कीजिए।"
    ],
    "pa": [
      "{trueQuantity} ਕਿਲੋਗ੍ਰਾਮ ਚੌਲਾਂ ਦੀ ਅਸਲ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਹੈ। ਦੁਕਾਨਦਾਰ ₹{quotedSellingPricePerNominalQuantity} ਲੈਂਦਾ ਹੈ ਪਰ ਦਿੰਦਾ {deliveredQuantity} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ਅਸਲ ਲਾਭ ਜਾਂ ਘਾਟੇ ਦੀ ਰਕਮ ਅਤੇ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਕਿਲੋਗ੍ਰਾਮ ਲਾਗਤ ਵਾਲੇ ਚੌਲਾਂ ਲਈ ਵਿਕਰੇਤਾ ₹{quotedSellingPricePerNominalQuantity} ਬਿੱਲ ਕਰਦਾ ਹੈ ਅਤੇ {deliveredQuantity} ਕਿਲੋਗ੍ਰਾਮ ਦਿੰਦਾ ਹੈ। ਅਸਲ ਰਕਮ ਅਤੇ ਪ੍ਰਤੀਸ਼ਤ ਨਤੀਜਾ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-123": {
    "en": [
      "Fruit costs ₹{costPricePerTrueQuantity} per {trueQuantity} kg. A seller declares {declaredRatePercent}% {declaredDirection} but supplies only {deliveredQuantity} kg per billed lot. Find the actual percentage result.",
      "A fruit seller quotes a {declaredRatePercent}% {declaredDirection} on goods costing ₹{costPricePerTrueQuantity} per {trueQuantity} kg, while delivering just {deliveredQuantity} kg. What is the real profit or loss percentage?"
    ],
    "hi": [
      "फल की लागत ₹{costPricePerTrueQuantity} प्रति {trueQuantity} किग्रा है। विक्रेता {declaredRatePercent}% {declaredDirection} बताता है, लेकिन प्रत्येक बिल किए गए लॉट में केवल {deliveredQuantity} किग्रा देता है। वास्तविक प्रतिशत परिणाम ज्ञात कीजिए।",
      "₹{costPricePerTrueQuantity} प्रति {trueQuantity} किग्रा लागत वाले फल पर विक्रेता {declaredRatePercent}% {declaredDirection} बताता है, पर देता केवल {deliveredQuantity} किग्रा है। वास्तविक लाभ या हानि प्रतिशत क्या है?"
    ],
    "pa": [
      "ਫਲਾਂ ਦੀ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ਵਿਕਰੇਤਾ {declaredRatePercent}% {declaredDirection} ਦੱਸਦਾ ਹੈ, ਪਰ ਹਰ ਬਿੱਲ ਕੀਤੇ ਲਾਟ ਵਿੱਚ ਸਿਰਫ਼ {deliveredQuantity} ਕਿਲੋਗ੍ਰਾਮ ਦਿੰਦਾ ਹੈ। ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਨਤੀਜਾ ਪਤਾ ਕਰੋ।",
      "₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਕਿਲੋਗ੍ਰਾਮ ਲਾਗਤ ਵਾਲੇ ਫਲਾਂ 'ਤੇ ਵਿਕਰੇਤਾ {declaredRatePercent}% {declaredDirection} ਦੱਸਦਾ ਹੈ, ਪਰ ਦਿੰਦਾ ਸਿਰਫ਼ {deliveredQuantity} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ਅਸਲ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-124": {
    "en": [
      "Cooking oil costs ₹{costPricePerTrueQuantity} for {trueQuantity} litres. A retailer claims {declaredRatePercent}% {declaredDirection} but gives only {deliveredQuantity} litres. Find the actual profit or loss percentage.",
      "Oil costing ₹{costPricePerTrueQuantity} per {trueQuantity} litres is sold with a declared {declaredRatePercent}% {declaredDirection}; only {deliveredQuantity} litres are supplied. Determine the real percentage result."
    ],
    "hi": [
      "खाना पकाने के तेल की लागत ₹{costPricePerTrueQuantity} प्रति {trueQuantity} लीटर है। खुदरा विक्रेता {declaredRatePercent}% {declaredDirection} बताता है लेकिन देता केवल {deliveredQuantity} लीटर है। वास्तविक लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "₹{costPricePerTrueQuantity} प्रति {trueQuantity} लीटर लागत वाला तेल {declaredRatePercent}% {declaredDirection} बताकर बेचा जाता है, पर केवल {deliveredQuantity} लीटर दिया जाता है। वास्तविक प्रतिशत परिणाम ज्ञात कीजिए।"
    ],
    "pa": [
      "ਖਾਣੇ ਵਾਲੇ ਤੇਲ ਦੀ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਲੀਟਰ ਹੈ। ਰਿਟੇਲਰ {declaredRatePercent}% {declaredDirection} ਦੱਸਦਾ ਹੈ ਪਰ ਦਿੰਦਾ ਸਿਰਫ਼ {deliveredQuantity} ਲੀਟਰ ਹੈ। ਅਸਲ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਲੀਟਰ ਲਾਗਤ ਵਾਲਾ ਤੇਲ {declaredRatePercent}% {declaredDirection} ਦੱਸ ਕੇ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ, ਪਰ ਸਿਰਫ਼ {deliveredQuantity} ਲੀਟਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਨਤੀਜਾ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-125": {
    "en": [
      "Fertilizer costs ₹{costPricePerTrueQuantity} for {trueQuantity} kg and is billed at ₹{quotedSellingPricePerNominalQuantity} per bag. What actual bag weight will give {targetRatePercent}% {targetDirection}?",
      "A fertilizer bag is priced at ₹{quotedSellingPricePerNominalQuantity}; the true cost is ₹{costPricePerTrueQuantity} per {trueQuantity} kg. Find the quantity per bag needed for an actual {targetRatePercent}% {targetDirection}."
    ],
    "hi": [
      "उर्वरक की लागत ₹{costPricePerTrueQuantity} प्रति {trueQuantity} किग्रा है और प्रति बैग ₹{quotedSellingPricePerNominalQuantity} लिया जाता है। वास्तविक {targetRatePercent}% {targetDirection} के लिए बैग में कितनी मात्रा होनी चाहिए?",
      "उर्वरक बैग की कीमत ₹{quotedSellingPricePerNominalQuantity} है और वास्तविक लागत ₹{costPricePerTrueQuantity} प्रति {trueQuantity} किग्रा है। {targetRatePercent}% {targetDirection} के लिए प्रति बैग आवश्यक मात्रा ज्ञात कीजिए।"
    ],
    "pa": [
      "ਖਾਦ ਦੀ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਕਿਲੋਗ੍ਰਾਮ ਹੈ ਅਤੇ ਪ੍ਰਤੀ ਬੋਰੀ ₹{quotedSellingPricePerNominalQuantity} ਲਿਆ ਜਾਂਦਾ ਹੈ। ਅਸਲ {targetRatePercent}% {targetDirection} ਲਈ ਬੋਰੀ ਵਿੱਚ ਕਿੰਨੀ ਮਾਤਰਾ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?",
      "ਖਾਦ ਦੀ ਬੋਰੀ ਦੀ ਕੀਮਤ ₹{quotedSellingPricePerNominalQuantity} ਹੈ ਅਤੇ ਅਸਲ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। {targetRatePercent}% {targetDirection} ਲਈ ਪ੍ਰਤੀ ਬੋਰੀ ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-126": {
    "en": [
      "The cost of {trueQuantity} fasteners is ₹{costPricePerTrueQuantity}, but a nominal pack contains only {deliveredQuantity}. What price should be charged for {targetRatePercent}% {targetDirection}?",
      "A seller packs only {deliveredQuantity} fasteners instead of {trueQuantity}; the true cost of {trueQuantity} is ₹{costPricePerTrueQuantity}. Find the selling price needed for an actual {targetRatePercent}% {targetDirection}."
    ],
    "hi": [
      "{trueQuantity} फास्टनरों की लागत ₹{costPricePerTrueQuantity} है, पर नाममात्र पैक में केवल {deliveredQuantity} फास्टनर हैं। {targetRatePercent}% {targetDirection} के लिए कितना मूल्य लेना चाहिए?",
      "विक्रेता {trueQuantity} की जगह केवल {deliveredQuantity} फास्टनर पैक करता है; {trueQuantity} की वास्तविक लागत ₹{costPricePerTrueQuantity} है। वास्तविक {targetRatePercent}% {targetDirection} के लिए विक्रय मूल्य ज्ञात कीजिए।"
    ],
    "pa": [
      "{trueQuantity} ਫਾਸਟਨਰਾਂ ਦੀ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਹੈ, ਪਰ ਨਾਮਾਤਰ ਪੈਕ ਵਿੱਚ ਸਿਰਫ਼ {deliveredQuantity} ਫਾਸਟਨਰ ਹਨ। {targetRatePercent}% {targetDirection} ਲਈ ਕਿੰਨੀ ਕੀਮਤ ਲੈਣੀ ਚਾਹੀਦੀ ਹੈ?",
      "ਵਿਕਰੇਤਾ {trueQuantity} ਦੀ ਥਾਂ ਸਿਰਫ਼ {deliveredQuantity} ਫਾਸਟਨਰ ਪੈਕ ਕਰਦਾ ਹੈ; {trueQuantity} ਦੀ ਅਸਲ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਹੈ। ਅਸਲ {targetRatePercent}% {targetDirection} ਲਈ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-127": {
    "en": [
      "A sugar trader pays ₹{purchasePricePerNominalQuantity} for a nominal {nominalQuantity} kg but actually receives {receivedQuantity} kg. He charges ₹{sellingPricePerNominalQuantity} per nominal sale and delivers only {deliveredQuantity} kg. Find his actual profit percentage.",
      "On purchase, a trader pays ₹{purchasePricePerNominalQuantity} for {nominalQuantity} kg but receives {receivedQuantity} kg; on sale, he charges ₹{sellingPricePerNominalQuantity} and gives {deliveredQuantity} kg. What is the true profit percentage?"
    ],
    "hi": [
      "एक चीनी व्यापारी नाममात्र {nominalQuantity} किग्रा के लिए ₹{purchasePricePerNominalQuantity} देता है, पर वास्तव में {receivedQuantity} किग्रा प्राप्त करता है। बिक्री में ₹{sellingPricePerNominalQuantity} लेकर केवल {deliveredQuantity} किग्रा देता है। वास्तविक लाभ प्रतिशत ज्ञात कीजिए।",
      "खरीद पर व्यापारी {nominalQuantity} किग्रा के लिए ₹{purchasePricePerNominalQuantity} देता है लेकिन {receivedQuantity} किग्रा पाता है; बिक्री पर ₹{sellingPricePerNominalQuantity} लेकर {deliveredQuantity} किग्रा देता है। वास्तविक लाभ प्रतिशत क्या है?"
    ],
    "pa": [
      "ਇੱਕ ਚੀਨੀ ਵਪਾਰੀ ਨਾਮਾਤਰ {nominalQuantity} ਕਿਲੋਗ੍ਰਾਮ ਲਈ ₹{purchasePricePerNominalQuantity} ਦਿੰਦਾ ਹੈ, ਪਰ ਅਸਲ ਵਿੱਚ {receivedQuantity} ਕਿਲੋਗ੍ਰਾਮ ਲੈਂਦਾ ਹੈ। ਵਿਕਰੀ ਵੇਲੇ ₹{sellingPricePerNominalQuantity} ਲੈ ਕੇ ਸਿਰਫ਼ {deliveredQuantity} ਕਿਲੋਗ੍ਰਾਮ ਦਿੰਦਾ ਹੈ। ਅਸਲ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਖਰੀਦ ਵੇਲੇ ਵਪਾਰੀ {nominalQuantity} ਕਿਲੋਗ੍ਰਾਮ ਲਈ ₹{purchasePricePerNominalQuantity} ਦਿੰਦਾ ਹੈ ਪਰ {receivedQuantity} ਕਿਲੋਗ੍ਰਾਮ ਲੈਂਦਾ ਹੈ; ਵਿਕਰੀ ਵੇਲੇ ₹{sellingPricePerNominalQuantity} ਲੈ ਕੇ {deliveredQuantity} ਕਿਲੋਗ੍ਰਾਮ ਦਿੰਦਾ ਹੈ। ਅਸਲ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-128": {
    "en": [
      "An oil dealer pays ₹{purchasePricePerNominalQuantity} for a nominal {nominalQuantity} litres but receives {receivedQuantity} litres. He charges ₹{sellingPricePerNominalQuantity} and supplies {deliveredQuantity} litres. Find the actual percentage gain or loss.",
      "A dealer gains quantity while buying oil and short-delivers while selling: purchase ₹{purchasePricePerNominalQuantity} for nominal {nominalQuantity} litres, actual receipt {receivedQuantity} litres; sale ₹{sellingPricePerNominalQuantity} with delivery {deliveredQuantity} litres. Determine the true percentage result."
    ],
    "hi": [
      "एक तेल व्यापारी नाममात्र {nominalQuantity} लीटर के लिए ₹{purchasePricePerNominalQuantity} देता है, पर {receivedQuantity} लीटर प्राप्त करता है। वह ₹{sellingPricePerNominalQuantity} लेता है और {deliveredQuantity} लीटर देता है। वास्तविक लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "तेल व्यापारी खरीद में अधिक मात्रा पाता और बिक्री में कम देता है: नाममात्र {nominalQuantity} लीटर के लिए ₹{purchasePricePerNominalQuantity}, वास्तविक प्राप्ति {receivedQuantity} लीटर; बिक्री ₹{sellingPricePerNominalQuantity} में {deliveredQuantity} लीटर। वास्तविक प्रतिशत परिणाम ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਤੇਲ ਵਪਾਰੀ ਨਾਮਾਤਰ {nominalQuantity} ਲੀਟਰ ਲਈ ₹{purchasePricePerNominalQuantity} ਦਿੰਦਾ ਹੈ, ਪਰ {receivedQuantity} ਲੀਟਰ ਪ੍ਰਾਪਤ ਕਰਦਾ ਹੈ। ਉਹ ₹{sellingPricePerNominalQuantity} ਲੈਂਦਾ ਹੈ ਅਤੇ {deliveredQuantity} ਲੀਟਰ ਦਿੰਦਾ ਹੈ। ਅਸਲ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਤੇਲ ਵਪਾਰੀ ਖਰੀਦ ਵਿੱਚ ਵੱਧ ਮਾਤਰਾ ਲੈਂਦਾ ਅਤੇ ਵਿਕਰੀ ਵਿੱਚ ਘੱਟ ਦਿੰਦਾ ਹੈ: ਨਾਮਾਤਰ {nominalQuantity} ਲੀਟਰ ਲਈ ₹{purchasePricePerNominalQuantity}, ਅਸਲ ਪ੍ਰਾਪਤੀ {receivedQuantity} ਲੀਟਰ; ਵਿਕਰੀ ₹{sellingPricePerNominalQuantity} ਵਿੱਚ {deliveredQuantity} ਲੀਟਰ। ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਨਤੀਜਾ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-129": {
    "en": [
      "Spices cost ₹{costPricePerTrueQuantity} per {trueQuantity} g. They are marked {markupPercent}% above cost, discounted by {discountPercent}%, and only {deliveredQuantity} g are supplied per pack. Find the actual profit or loss percentage.",
      "A spice retailer marks goods costing ₹{costPricePerTrueQuantity} per {trueQuantity} g at {markupPercent}% above cost, allows {discountPercent}% discount, and short-delivers to {deliveredQuantity} g. What is the true percentage result?"
    ],
    "hi": [
      "मसालों की लागत ₹{costPricePerTrueQuantity} प्रति {trueQuantity} ग्राम है। उन पर {markupPercent}% बढ़ाकर अंकित मूल्य रखा जाता है, {discountPercent}% छूट दी जाती है और केवल {deliveredQuantity} ग्राम दिया जाता है। वास्तविक लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "एक मसाला विक्रेता ₹{costPricePerTrueQuantity} प्रति {trueQuantity} ग्राम लागत पर {markupPercent}% बढ़ाकर मूल्य अंकित करता है, {discountPercent}% छूट देता है और केवल {deliveredQuantity} ग्राम देता है। वास्तविक प्रतिशत परिणाम क्या है?"
    ],
    "pa": [
      "ਮਸਾਲਿਆਂ ਦੀ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਗ੍ਰਾਮ ਹੈ। ਉਨ੍ਹਾਂ 'ਤੇ {markupPercent}% ਵਧਾ ਕੇ ਅੰਕਿਤ ਮੁੱਲ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ, {discountPercent}% ਛੂਟ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਸਿਰਫ਼ {deliveredQuantity} ਗ੍ਰਾਮ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਅਸਲ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਮਸਾਲਾ ਵਿਕਰੇਤਾ ₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਗ੍ਰਾਮ ਲਾਗਤ 'ਤੇ {markupPercent}% ਵਧਾ ਕੇ ਕੀਮਤ ਲਗਾਉਂਦਾ ਹੈ, {discountPercent}% ਛੂਟ ਦਿੰਦਾ ਹੈ ਅਤੇ ਸਿਰਫ਼ {deliveredQuantity} ਗ੍ਰਾਮ ਦਿੰਦਾ ਹੈ। ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਨਤੀਜਾ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-130": {
    "en": [
      "Paint costs ₹{costPricePerTrueQuantity} for {trueQuantity} litres. A can contains only {deliveredQuantity} litres and gets {discountPercent}% discount. What markup is required for an actual {targetRatePercent}% {targetDirection}?",
      "A dealer short-fills a paint can to {deliveredQuantity} litres instead of {trueQuantity}; true cost is ₹{costPricePerTrueQuantity} and discount is {discountPercent}%. Find the markup percentage needed for {targetRatePercent}% actual {targetDirection}."
    ],
    "hi": [
      "पेंट की लागत ₹{costPricePerTrueQuantity} प्रति {trueQuantity} लीटर है। डिब्बे में केवल {deliveredQuantity} लीटर भरा जाता है और {discountPercent}% छूट दी जाती है। वास्तविक {targetRatePercent}% {targetDirection} के लिए कितना मार्कअप चाहिए?",
      "एक डीलर {trueQuantity} लीटर की जगह केवल {deliveredQuantity} लीटर पेंट भरता है; वास्तविक लागत ₹{costPricePerTrueQuantity} है और छूट {discountPercent}% है। {targetRatePercent}% वास्तविक {targetDirection} के लिए आवश्यक मार्कअप प्रतिशत ज्ञात कीजिए।"
    ],
    "pa": [
      "ਪੇਂਟ ਦੀ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਲੀਟਰ ਹੈ। ਡੱਬੇ ਵਿੱਚ ਸਿਰਫ਼ {deliveredQuantity} ਲੀਟਰ ਭਰਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ {discountPercent}% ਛੂਟ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਅਸਲ {targetRatePercent}% {targetDirection} ਲਈ ਕਿੰਨਾ ਮਾਰਕਅੱਪ ਚਾਹੀਦਾ ਹੈ?",
      "ਇੱਕ ਡੀਲਰ {trueQuantity} ਲੀਟਰ ਦੀ ਥਾਂ ਸਿਰਫ਼ {deliveredQuantity} ਲੀਟਰ ਪੇਂਟ ਭਰਦਾ ਹੈ; ਅਸਲ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਹੈ ਅਤੇ ਛੂਟ {discountPercent}% ਹੈ। {targetRatePercent}% ਅਸਲ {targetDirection} ਲਈ ਲੋੜੀਂਦਾ ਮਾਰਕਅੱਪ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-131": {
    "en": [
      "Cereal costing ₹{costPricePerTrueQuantity} per {trueQuantity} g is marked {markupPercent}% above cost, but each packet contains only {deliveredQuantity} g. What discount gives an actual {targetRatePercent}% {targetDirection}?",
      "A cereal packet is short-filled to {deliveredQuantity} g instead of {trueQuantity}. The true cost is ₹{costPricePerTrueQuantity} and markup is {markupPercent}%. Find the discount needed for {targetRatePercent}% actual {targetDirection}."
    ],
    "hi": [
      "सीरियल की लागत ₹{costPricePerTrueQuantity} प्रति {trueQuantity} ग्राम है और मूल्य {markupPercent}% बढ़ाकर अंकित किया गया है, लेकिन प्रत्येक पैकेट में केवल {deliveredQuantity} ग्राम है। वास्तविक {targetRatePercent}% {targetDirection} के लिए कितनी छूट चाहिए?",
      "सीरियल पैकेट में {trueQuantity} ग्राम की जगह केवल {deliveredQuantity} ग्राम है। वास्तविक लागत ₹{costPricePerTrueQuantity} और मार्कअप {markupPercent}% है। {targetRatePercent}% वास्तविक {targetDirection} के लिए आवश्यक छूट ज्ञात कीजिए।"
    ],
    "pa": [
      "ਸੀਰੀਅਲ ਦੀ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਗ੍ਰਾਮ ਹੈ ਅਤੇ ਕੀਮਤ {markupPercent}% ਵਧਾ ਕੇ ਲਗਾਈ ਗਈ ਹੈ, ਪਰ ਹਰ ਪੈਕਟ ਵਿੱਚ ਸਿਰਫ਼ {deliveredQuantity} ਗ੍ਰਾਮ ਹੈ। ਅਸਲ {targetRatePercent}% {targetDirection} ਲਈ ਕਿੰਨੀ ਛੂਟ ਚਾਹੀਦੀ ਹੈ?",
      "ਸੀਰੀਅਲ ਪੈਕਟ ਵਿੱਚ {trueQuantity} ਗ੍ਰਾਮ ਦੀ ਥਾਂ ਸਿਰਫ਼ {deliveredQuantity} ਗ੍ਰਾਮ ਹੈ। ਅਸਲ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਅਤੇ ਮਾਰਕਅੱਪ {markupPercent}% ਹੈ। {targetRatePercent}% ਅਸਲ {targetDirection} ਲਈ ਲੋੜੀਂਦੀ ਛੂਟ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-132": {
    "en": [
      "A cement bag costing ₹{costPricePerTrueQuantity} for {trueQuantity} kg has its quoted price changed by {priceChangePercent}% in the {priceDirection} direction, while quantity is reduced by {shortQuantityPercent}%. Find the actual profit percentage.",
      "For cement costing ₹{costPricePerTrueQuantity} per {trueQuantity} kg, the seller changes price by {priceChangePercent}% in the {priceDirection} direction and gives {shortQuantityPercent}% less quantity. What is the true profit percentage?"
    ],
    "hi": [
      "सीमेंट की लागत ₹{costPricePerTrueQuantity} प्रति {trueQuantity} किग्रा है। उद्धृत मूल्य में {priceChangePercent}% {priceDirection} परिवर्तन किया जाता है और मात्रा {shortQuantityPercent}% कम दी जाती है। वास्तविक लाभ प्रतिशत ज्ञात कीजिए।",
      "₹{costPricePerTrueQuantity} प्रति {trueQuantity} किग्रा लागत वाले सीमेंट में विक्रेता मूल्य को {priceChangePercent}% {priceDirection} बदलता है और {shortQuantityPercent}% कम मात्रा देता है। वास्तविक लाभ प्रतिशत क्या है?"
    ],
    "pa": [
      "ਸੀਮੈਂਟ ਦੀ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ਦੱਸੀ ਕੀਮਤ ਵਿੱਚ {priceChangePercent}% {priceDirection} ਬਦਲਾਅ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਮਾਤਰਾ {shortQuantityPercent}% ਘੱਟ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਅਸਲ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਕਿਲੋਗ੍ਰਾਮ ਲਾਗਤ ਵਾਲੇ ਸੀਮੈਂਟ ਵਿੱਚ ਵਿਕਰੇਤਾ ਕੀਮਤ ਨੂੰ {priceChangePercent}% {priceDirection} ਬਦਲਦਾ ਹੈ ਅਤੇ {shortQuantityPercent}% ਘੱਟ ਮਾਤਰਾ ਦਿੰਦਾ ਹੈ। ਅਸਲ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-133": {
    "en": [
      "Animal feed costs ₹{costPricePerTrueQuantity} per {trueQuantity} kg. The quoted price changes by {priceChangePercent}% in the {priceDirection} direction and delivery is short by {shortQuantityPercent}%. Find the actual percentage gain or loss.",
      "A seller changes the price of feed costing ₹{costPricePerTrueQuantity} per {trueQuantity} kg by {priceChangePercent}% in the {priceDirection} direction and supplies {shortQuantityPercent}% less. Determine the true percentage result."
    ],
    "hi": [
      "पशु-आहार की लागत ₹{costPricePerTrueQuantity} प्रति {trueQuantity} किग्रा है। उद्धृत मूल्य में {priceChangePercent}% {priceDirection} परिवर्तन होता है और {shortQuantityPercent}% कम मात्रा दी जाती है। वास्तविक लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "₹{costPricePerTrueQuantity} प्रति {trueQuantity} किग्रा लागत वाले पशु-आहार का मूल्य {priceChangePercent}% {priceDirection} बदला जाता है और {shortQuantityPercent}% कम दिया जाता है। वास्तविक प्रतिशत परिणाम ज्ञात कीजिए।"
    ],
    "pa": [
      "ਪਸ਼ੂ-ਚਾਰੇ ਦੀ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ਦੱਸੀ ਕੀਮਤ ਵਿੱਚ {priceChangePercent}% {priceDirection} ਬਦਲਾਅ ਹੁੰਦਾ ਹੈ ਅਤੇ {shortQuantityPercent}% ਘੱਟ ਮਾਤਰਾ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਅਸਲ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "₹{costPricePerTrueQuantity} ਪ੍ਰਤੀ {trueQuantity} ਕਿਲੋਗ੍ਰਾਮ ਲਾਗਤ ਵਾਲੇ ਪਸ਼ੂ-ਚਾਰੇ ਦੀ ਕੀਮਤ {priceChangePercent}% {priceDirection} ਬਦਲੀ ਜਾਂਦੀ ਹੈ ਅਤੇ {shortQuantityPercent}% ਘੱਟ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਨਤੀਜਾ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-134": {
    "en": [
      "A customer is billed for {trueQuantity} units but receives only {deliveredQuantity}. By what percentage does the effective unit price exceed the fair unit price?",
      "Payment is taken for {trueQuantity} units, while only {deliveredQuantity} units are supplied. Find the percentage increase in effective price per true unit."
    ],
    "hi": [
      "ग्राहक से {trueQuantity} इकाइयों का मूल्य लिया जाता है, लेकिन उसे केवल {deliveredQuantity} इकाइयाँ मिलती हैं। प्रभावी प्रति-इकाई मूल्य उचित मूल्य से कितने प्रतिशत अधिक है?",
      "भुगतान {trueQuantity} इकाइयों का लिया जाता है, जबकि केवल {deliveredQuantity} इकाइयाँ दी जाती हैं। प्रभावी प्रति-इकाई मूल्य में प्रतिशत वृद्धि ज्ञात कीजिए।"
    ],
    "pa": [
      "ਗਾਹਕ ਤੋਂ {trueQuantity} ਇਕਾਈਆਂ ਦੀ ਕੀਮਤ ਲਈ ਜਾਂਦੀ ਹੈ, ਪਰ ਉਸਨੂੰ ਸਿਰਫ਼ {deliveredQuantity} ਇਕਾਈਆਂ ਮਿਲਦੀਆਂ ਹਨ। ਪ੍ਰਭਾਵੀ ਪ੍ਰਤੀ-ਇਕਾਈ ਕੀਮਤ ਸਹੀ ਕੀਮਤ ਤੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?",
      "ਭੁਗਤਾਨ {trueQuantity} ਇਕਾਈਆਂ ਦਾ ਲਿਆ ਜਾਂਦਾ ਹੈ, ਜਦਕਿ ਸਿਰਫ਼ {deliveredQuantity} ਇਕਾਈਆਂ ਦਿੱਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਪ੍ਰਭਾਵੀ ਪ੍ਰਤੀ-ਇਕਾਈ ਕੀਮਤ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-135": {
    "en": [
      "A dry-fruit seller quotes {declaredRatePercent}% {declaredDirection} on a {trueQuantity} g pack but wants the actual result to be {actualRatePercent}% {actualDirection}. What quantity should the pack really contain?",
      "For a nominal {trueQuantity} g dry-fruit pack, the declared result is {declaredRatePercent}% {declaredDirection}. Find the actual pack weight needed to make the true result {actualRatePercent}% {actualDirection}."
    ],
    "hi": [
      "एक सूखे-मेवे विक्रेता {trueQuantity} ग्राम पैक पर {declaredRatePercent}% {declaredDirection} बताता है, पर वास्तविक परिणाम {actualRatePercent}% {actualDirection} चाहता है। पैक में वास्तव में कितनी मात्रा होनी चाहिए?",
      "नाममात्र {trueQuantity} ग्राम सूखे-मेवे के पैक पर घोषित परिणाम {declaredRatePercent}% {declaredDirection} है। वास्तविक {actualRatePercent}% {actualDirection} के लिए सही पैक वजन ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਸੁੱਕੇ ਮੇਵਿਆਂ ਦਾ ਵਿਕਰੇਤਾ {trueQuantity} ਗ੍ਰਾਮ ਪੈਕ 'ਤੇ {declaredRatePercent}% {declaredDirection} ਦੱਸਦਾ ਹੈ, ਪਰ ਅਸਲ ਨਤੀਜਾ {actualRatePercent}% {actualDirection} ਚਾਹੁੰਦਾ ਹੈ। ਪੈਕ ਵਿੱਚ ਅਸਲ ਵਿੱਚ ਕਿੰਨੀ ਮਾਤਰਾ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?",
      "ਨਾਮਾਤਰ {trueQuantity} ਗ੍ਰਾਮ ਸੁੱਕੇ ਮੇਵਿਆਂ ਦੇ ਪੈਕ 'ਤੇ ਦੱਸਿਆ ਨਤੀਜਾ {declaredRatePercent}% {declaredDirection} ਹੈ। ਅਸਲ {actualRatePercent}% {actualDirection} ਲਈ ਸਹੀ ਪੈਕ ਭਾਰ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-136": {
    "en": [
      "A seller charges for {trueQuantity} g of coffee but supplies {deliveredQuantity} g and actually earns {actualRatePercent}% {actualDirection}. Find the declared profit or loss percentage on the list price.",
      "A coffee pack is billed as {trueQuantity} g but contains {deliveredQuantity} g. If the true result is {actualRatePercent}% {actualDirection}, what declared percentage must appear on the price list?"
    ],
    "hi": [
      "विक्रेता {trueQuantity} ग्राम कॉफी का मूल्य लेता है, पर देता {deliveredQuantity} ग्राम है और वास्तविक परिणाम {actualRatePercent}% {actualDirection} है। सूची मूल्य पर घोषित लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "कॉफी पैक का बिल {trueQuantity} ग्राम का है, लेकिन उसमें {deliveredQuantity} ग्राम है। यदि वास्तविक परिणाम {actualRatePercent}% {actualDirection} है, तो मूल्य सूची पर घोषित प्रतिशत क्या होगा?"
    ],
    "pa": [
      "ਵਿਕਰੇਤਾ {trueQuantity} ਗ੍ਰਾਮ ਕੌਫੀ ਦੀ ਕੀਮਤ ਲੈਂਦਾ ਹੈ, ਪਰ ਦਿੰਦਾ {deliveredQuantity} ਗ੍ਰਾਮ ਹੈ ਅਤੇ ਅਸਲ ਨਤੀਜਾ {actualRatePercent}% {actualDirection} ਹੈ। ਕੀਮਤ ਸੂਚੀ 'ਤੇ ਦੱਸਿਆ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਕੌਫੀ ਪੈਕ ਦਾ ਬਿੱਲ {trueQuantity} ਗ੍ਰਾਮ ਦਾ ਹੈ, ਪਰ ਇਸ ਵਿੱਚ {deliveredQuantity} ਗ੍ਰਾਮ ਹੈ। ਜੇ ਅਸਲ ਨਤੀਜਾ {actualRatePercent}% {actualDirection} ਹੈ, ਤਾਂ ਕੀਮਤ ਸੂਚੀ 'ਤੇ ਦੱਸਿਆ ਪ੍ਰਤੀਸ਼ਤ ਕੀ ਹੋਵੇਗਾ?"
    ]
  },
  "PNL-QL-137": {
    "en": [
      "A tea seller charges ₹{quotedSellingPricePerNominalQuantity} for {trueQuantity} g but supplies only {deliveredQuantity} g. If the actual result is {actualRatePercent}% {actualDirection}, find the true cost price per {trueQuantity} g.",
      "A {trueQuantity} g tea pack is billed at ₹{quotedSellingPricePerNominalQuantity} but contains only {deliveredQuantity} g. Given an actual {actualRatePercent}% {actualDirection}, determine the true cost of {trueQuantity} g."
    ],
    "hi": [
      "एक चाय विक्रेता {trueQuantity} ग्राम के लिए ₹{quotedSellingPricePerNominalQuantity} लेता है, लेकिन केवल {deliveredQuantity} ग्राम देता है। यदि वास्तविक परिणाम {actualRatePercent}% {actualDirection} है, तो {trueQuantity} ग्राम का वास्तविक क्रय मूल्य ज्ञात कीजिए।",
      "{trueQuantity} ग्राम चाय के पैक का मूल्य ₹{quotedSellingPricePerNominalQuantity} लिया जाता है, लेकिन उसमें केवल {deliveredQuantity} ग्राम है। वास्तविक {actualRatePercent}% {actualDirection} होने पर {trueQuantity} ग्राम की वास्तविक लागत ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਚਾਹ ਵਿਕਰੇਤਾ {trueQuantity} ਗ੍ਰਾਮ ਲਈ ₹{quotedSellingPricePerNominalQuantity} ਲੈਂਦਾ ਹੈ, ਪਰ ਸਿਰਫ਼ {deliveredQuantity} ਗ੍ਰਾਮ ਦਿੰਦਾ ਹੈ। ਜੇ ਅਸਲ ਨਤੀਜਾ {actualRatePercent}% {actualDirection} ਹੈ, ਤਾਂ {trueQuantity} ਗ੍ਰਾਮ ਦਾ ਅਸਲ ਖਰੀਦ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "{trueQuantity} ਗ੍ਰਾਮ ਚਾਹ ਦੇ ਪੈਕ ਦੀ ਕੀਮਤ ₹{quotedSellingPricePerNominalQuantity} ਲਈ ਜਾਂਦੀ ਹੈ, ਪਰ ਇਸ ਵਿੱਚ ਸਿਰਫ਼ {deliveredQuantity} ਗ੍ਰਾਮ ਹੈ। ਅਸਲ {actualRatePercent}% {actualDirection} ਹੋਣ 'ਤੇ {trueQuantity} ਗ੍ਰਾਮ ਦੀ ਅਸਲ ਲਾਗਤ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-138": {
    "en": [
      "A retailer charges ₹{quotedSellingPricePerNominalQuantity} for {trueQuantity} g of nuts but supplies only {deliveredQuantity} g. The actual {actualDirection} is ₹{actualAmount}. Find the true cost price per {trueQuantity} g.",
      "A nominal {trueQuantity} g pack of nuts is sold for ₹{quotedSellingPricePerNominalQuantity}, though only {deliveredQuantity} g are delivered. If the actual {actualDirection} amount is ₹{actualAmount}, determine the true cost of {trueQuantity} g."
    ],
    "hi": [
      "एक विक्रेता {trueQuantity} ग्राम मेवों के लिए ₹{quotedSellingPricePerNominalQuantity} लेता है, लेकिन केवल {deliveredQuantity} ग्राम देता है। वास्तविक {actualDirection} ₹{actualAmount} है। {trueQuantity} ग्राम का वास्तविक क्रय मूल्य ज्ञात कीजिए।",
      "नाममात्र {trueQuantity} ग्राम मेवों का पैक ₹{quotedSellingPricePerNominalQuantity} में बेचा जाता है, पर केवल {deliveredQuantity} ग्राम दिए जाते हैं। वास्तविक {actualDirection} राशि ₹{actualAmount} होने पर {trueQuantity} ग्राम की वास्तविक लागत ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਵਿਕਰੇਤਾ {trueQuantity} ਗ੍ਰਾਮ ਮੇਵਿਆਂ ਲਈ ₹{quotedSellingPricePerNominalQuantity} ਲੈਂਦਾ ਹੈ, ਪਰ ਸਿਰਫ਼ {deliveredQuantity} ਗ੍ਰਾਮ ਦਿੰਦਾ ਹੈ। ਅਸਲ {actualDirection} ₹{actualAmount} ਹੈ। {trueQuantity} ਗ੍ਰਾਮ ਦਾ ਅਸਲ ਖਰੀਦ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਨਾਮਾਤਰ {trueQuantity} ਗ੍ਰਾਮ ਮੇਵਿਆਂ ਦਾ ਪੈਕ ₹{quotedSellingPricePerNominalQuantity} ਵਿੱਚ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ, ਪਰ ਸਿਰਫ਼ {deliveredQuantity} ਗ੍ਰਾਮ ਦਿੱਤੇ ਜਾਂਦੇ ਹਨ। ਅਸਲ {actualDirection} ਰਕਮ ₹{actualAmount} ਹੋਣ 'ਤੇ {trueQuantity} ਗ੍ਰਾਮ ਦੀ ਅਸਲ ਲਾਗਤ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-139": {
    "en": [
      "A pulses trader pays ₹{purchasePricePerNominalQuantity} and receives {receivedQuantity} kg. He charges ₹{sellingPricePerNominalQuantity} per nominal sale. How much should he deliver to obtain {targetRatePercent}% actual {targetDirection}?",
      "A trader buys pulses for ₹{purchasePricePerNominalQuantity} and actually receives {receivedQuantity} kg. If each nominal sale is billed at ₹{sellingPricePerNominalQuantity}, find the delivery quantity required for {targetRatePercent}% {targetDirection}."
    ],
    "hi": [
      "एक दाल व्यापारी ₹{purchasePricePerNominalQuantity} देकर {receivedQuantity} किग्रा प्राप्त करता है। वह प्रति नाममात्र बिक्री ₹{sellingPricePerNominalQuantity} लेता है। वास्तविक {targetRatePercent}% {targetDirection} के लिए कितनी मात्रा देनी चाहिए?",
      "एक व्यापारी दाल ₹{purchasePricePerNominalQuantity} में खरीदता है और वास्तव में {receivedQuantity} किग्रा पाता है। प्रत्येक बिक्री ₹{sellingPricePerNominalQuantity} में करने पर {targetRatePercent}% {targetDirection} के लिए आवश्यक वितरण मात्रा ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਦਾਲ ਵਪਾਰੀ ₹{purchasePricePerNominalQuantity} ਦੇ ਕੇ {receivedQuantity} ਕਿਲੋਗ੍ਰਾਮ ਲੈਂਦਾ ਹੈ। ਉਹ ਹਰ ਨਾਮਾਤਰ ਵਿਕਰੀ ਲਈ ₹{sellingPricePerNominalQuantity} ਲੈਂਦਾ ਹੈ। ਅਸਲ {targetRatePercent}% {targetDirection} ਲਈ ਕਿੰਨੀ ਮਾਤਰਾ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ?",
      "ਇੱਕ ਵਪਾਰੀ ਦਾਲ ₹{purchasePricePerNominalQuantity} ਵਿੱਚ ਖਰੀਦਦਾ ਹੈ ਅਤੇ ਅਸਲ ਵਿੱਚ {receivedQuantity} ਕਿਲੋਗ੍ਰਾਮ ਲੈਂਦਾ ਹੈ। ਹਰ ਵਿਕਰੀ ₹{sellingPricePerNominalQuantity} ਵਿੱਚ ਕਰਨ 'ਤੇ {targetRatePercent}% {targetDirection} ਲਈ ਲੋੜੀਂਦੀ ਡਿਲਿਵਰੀ ਮਾਤਰਾ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-140": {
    "en": [
      "A flour trader pays ₹{purchasePricePerNominalQuantity} for a purchase lot and sells at ₹{sellingPricePerNominalQuantity} while delivering {deliveredQuantity} kg. How much flour must he receive in the purchase lot to make {targetRatePercent}% actual {targetDirection}?",
      "A trader buys a flour lot for ₹{purchasePricePerNominalQuantity}, charges ₹{sellingPricePerNominalQuantity} per sale, and delivers {deliveredQuantity} kg. Find the purchase quantity needed for an actual {targetRatePercent}% {targetDirection}."
    ],
    "hi": [
      "एक आटा व्यापारी खरीद लॉट के लिए ₹{purchasePricePerNominalQuantity} देता है और बिक्री में ₹{sellingPricePerNominalQuantity} लेकर {deliveredQuantity} किग्रा देता है। वास्तविक {targetRatePercent}% {targetDirection} के लिए खरीद में कितनी मात्रा मिलनी चाहिए?",
      "एक व्यापारी आटे का लॉट ₹{purchasePricePerNominalQuantity} में खरीदता है, बिक्री में ₹{sellingPricePerNominalQuantity} लेता है और {deliveredQuantity} किग्रा देता है। वास्तविक {targetRatePercent}% {targetDirection} के लिए आवश्यक खरीद मात्रा ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਆਟਾ ਵਪਾਰੀ ਖਰੀਦ ਲਾਟ ਲਈ ₹{purchasePricePerNominalQuantity} ਦਿੰਦਾ ਹੈ ਅਤੇ ਵਿਕਰੀ ਵਿੱਚ ₹{sellingPricePerNominalQuantity} ਲੈ ਕੇ {deliveredQuantity} ਕਿਲੋਗ੍ਰਾਮ ਦਿੰਦਾ ਹੈ। ਅਸਲ {targetRatePercent}% {targetDirection} ਲਈ ਖਰੀਦ ਵਿੱਚ ਕਿੰਨੀ ਮਾਤਰਾ ਮਿਲਣੀ ਚਾਹੀਦੀ ਹੈ?",
      "ਇੱਕ ਵਪਾਰੀ ਆਟੇ ਦਾ ਲਾਟ ₹{purchasePricePerNominalQuantity} ਵਿੱਚ ਖਰੀਦਦਾ ਹੈ, ਵਿਕਰੀ ਵਿੱਚ ₹{sellingPricePerNominalQuantity} ਲੈਂਦਾ ਹੈ ਅਤੇ {deliveredQuantity} ਕਿਲੋਗ੍ਰਾਮ ਦਿੰਦਾ ਹੈ। ਅਸਲ {targetRatePercent}% {targetDirection} ਲਈ ਲੋੜੀਂਦੀ ਖਰੀਦ ਮਾਤਰਾ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-141": {
    "en": [
      "A customer is charged ₹{quotedSellingPricePerNominalQuantity} for {trueQuantity} units but receives only {deliveredQuantity}. Find the effective price per true {trueQuantity} units.",
      "A bill of ₹{quotedSellingPricePerNominalQuantity} is raised for {trueQuantity} units, though only {deliveredQuantity} units are supplied. What is the effective price for a true {trueQuantity}-unit quantity?"
    ],
    "hi": [
      "ग्राहक से {trueQuantity} इकाइयों के लिए ₹{quotedSellingPricePerNominalQuantity} लिया जाता है, पर उसे केवल {deliveredQuantity} इकाइयाँ मिलती हैं। वास्तविक {trueQuantity} इकाइयों का प्रभावी मूल्य ज्ञात कीजिए।",
      "{trueQuantity} इकाइयों के लिए ₹{quotedSellingPricePerNominalQuantity} का बिल बनाया जाता है, जबकि केवल {deliveredQuantity} इकाइयाँ दी जाती हैं। वास्तविक {trueQuantity} इकाइयों का प्रभावी मूल्य क्या है?"
    ],
    "pa": [
      "ਗਾਹਕ ਤੋਂ {trueQuantity} ਇਕਾਈਆਂ ਲਈ ₹{quotedSellingPricePerNominalQuantity} ਲਿਆ ਜਾਂਦਾ ਹੈ, ਪਰ ਉਸਨੂੰ ਸਿਰਫ਼ {deliveredQuantity} ਇਕਾਈਆਂ ਮਿਲਦੀਆਂ ਹਨ। ਅਸਲ {trueQuantity} ਇਕਾਈਆਂ ਦੀ ਪ੍ਰਭਾਵੀ ਕੀਮਤ ਪਤਾ ਕਰੋ।",
      "{trueQuantity} ਇਕਾਈਆਂ ਲਈ ₹{quotedSellingPricePerNominalQuantity} ਦਾ ਬਿੱਲ ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ, ਜਦਕਿ ਸਿਰਫ਼ {deliveredQuantity} ਇਕਾਈਆਂ ਦਿੱਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਅਸਲ {trueQuantity} ਇਕਾਈਆਂ ਦੀ ਪ੍ਰਭਾਵੀ ਕੀਮਤ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-143": {
    "en": [
      "The true cost of {trueQuantity} packaged items is ₹{costPricePerTrueQuantity}. A seller charges ₹{quotedSellingPricePerNominalQuantity} for {trueQuantity} items but puts only {deliveredQuantity} in the carton. Find the actual profit percentage.",
      "A carton is billed as {trueQuantity} items for ₹{quotedSellingPricePerNominalQuantity}, although it contains only {deliveredQuantity}. If {trueQuantity} items cost ₹{costPricePerTrueQuantity}, determine the real profit percentage."
    ],
    "hi": [
      "{trueQuantity} पैक की गई वस्तुओं की वास्तविक लागत ₹{costPricePerTrueQuantity} है। विक्रेता {trueQuantity} वस्तुओं के लिए ₹{quotedSellingPricePerNominalQuantity} लेता है, लेकिन डिब्बे में केवल {deliveredQuantity} रखता है। वास्तविक लाभ प्रतिशत ज्ञात कीजिए।",
      "कार्टन का बिल {trueQuantity} वस्तुओं के लिए ₹{quotedSellingPricePerNominalQuantity} बनाया जाता है, जबकि उसमें केवल {deliveredQuantity} वस्तुएँ हैं। यदि {trueQuantity} वस्तुओं की लागत ₹{costPricePerTrueQuantity} है, तो वास्तविक लाभ प्रतिशत ज्ञात कीजिए।"
    ],
    "pa": [
      "{trueQuantity} ਪੈਕ ਕੀਤੀਆਂ ਵਸਤਾਂ ਦੀ ਅਸਲ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਹੈ। ਵਿਕਰੇਤਾ {trueQuantity} ਵਸਤਾਂ ਲਈ ₹{quotedSellingPricePerNominalQuantity} ਲੈਂਦਾ ਹੈ, ਪਰ ਡੱਬੇ ਵਿੱਚ ਸਿਰਫ਼ {deliveredQuantity} ਰੱਖਦਾ ਹੈ। ਅਸਲ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਕਾਰਟਨ ਦਾ ਬਿੱਲ {trueQuantity} ਵਸਤਾਂ ਲਈ ₹{quotedSellingPricePerNominalQuantity} ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ, ਜਦਕਿ ਇਸ ਵਿੱਚ ਸਿਰਫ਼ {deliveredQuantity} ਵਸਤਾਂ ਹਨ। ਜੇ {trueQuantity} ਵਸਤਾਂ ਦੀ ਲਾਗਤ ₹{costPricePerTrueQuantity} ਹੈ, ਤਾਂ ਅਸਲ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-144": {
    "en": [
      "A cloth merchant charges for {trueQuantity} cm, but the measuring rod marked as one metre is only {deliveredQuantity} cm long. Find the percentage overcharge.",
      "A customer pays for {trueQuantity} cm of cloth while the seller's 'metre' measure is actually {deliveredQuantity} cm. By what percentage is the customer effectively overcharged?"
    ],
    "hi": [
      "कपड़ा व्यापारी {trueQuantity} सेमी का मूल्य लेता है, लेकिन एक मीटर बताई गई माप-छड़ी केवल {deliveredQuantity} सेमी लंबी है। प्रतिशत अधिक वसूली ज्ञात कीजिए।",
      "ग्राहक {trueQuantity} सेमी कपड़े का भुगतान करता है, जबकि विक्रेता की 'मीटर' माप वास्तव में {deliveredQuantity} सेमी है। ग्राहक से प्रभावी रूप से कितने प्रतिशत अधिक लिया गया?"
    ],
    "pa": [
      "ਕੱਪੜਾ ਵਪਾਰੀ {trueQuantity} ਸੈਂਟੀਮੀਟਰ ਦੀ ਕੀਮਤ ਲੈਂਦਾ ਹੈ, ਪਰ ਇੱਕ ਮੀਟਰ ਦੱਸੀ ਮਾਪ-ਛੜੀ ਸਿਰਫ਼ {deliveredQuantity} ਸੈਂਟੀਮੀਟਰ ਲੰਬੀ ਹੈ। ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਵਸੂਲੀ ਪਤਾ ਕਰੋ।",
      "ਗਾਹਕ {trueQuantity} ਸੈਂਟੀਮੀਟਰ ਕੱਪੜੇ ਦਾ ਭੁਗਤਾਨ ਕਰਦਾ ਹੈ, ਜਦਕਿ ਵਿਕਰੇਤਾ ਦੀ 'ਮੀਟਰ' ਮਾਪ ਅਸਲ ਵਿੱਚ {deliveredQuantity} ਸੈਂਟੀਮੀਟਰ ਹੈ। ਗਾਹਕ ਤੋਂ ਪ੍ਰਭਾਵੀ ਤੌਰ 'ਤੇ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਲਿਆ ਗਿਆ?"
    ]
  },
  "PNL-QL-150": {
    "en": [
      "A workshop buys a machine for ₹{purchasePrice} and additionally spends ₹{repairExpense} on repairs, ₹{transportExpense} on transport, and ₹{installationExpense} on installation. Find the effective cost.",
      "A machine is purchased for ₹{purchasePrice}. Repair, transport and installation expenses are ₹{repairExpense}, ₹{transportExpense} and ₹{installationExpense}. What is its total effective cost?"
    ],
    "hi": [
      "एक कार्यशाला मशीन ₹{purchasePrice} में खरीदती है और मरम्मत पर ₹{repairExpense}, परिवहन पर ₹{transportExpense} तथा स्थापना पर ₹{installationExpense} खर्च करती है। प्रभावी लागत ज्ञात कीजिए।",
      "मशीन का क्रय मूल्य ₹{purchasePrice} है। मरम्मत, परिवहन और स्थापना खर्च क्रमशः ₹{repairExpense}, ₹{transportExpense} और ₹{installationExpense} हैं। कुल प्रभावी लागत क्या है?"
    ],
    "pa": [
      "ਇੱਕ ਵਰਕਸ਼ਾਪ ਮਸ਼ੀਨ ₹{purchasePrice} ਵਿੱਚ ਖਰੀਦਦੀ ਹੈ ਅਤੇ ਮੁਰੰਮਤ 'ਤੇ ₹{repairExpense}, ਆਵਾਜਾਈ 'ਤੇ ₹{transportExpense} ਅਤੇ ਇੰਸਟਾਲੇਸ਼ਨ 'ਤੇ ₹{installationExpense} ਖਰਚਦੀ ਹੈ। ਪ੍ਰਭਾਵੀ ਲਾਗਤ ਪਤਾ ਕਰੋ।",
      "ਮਸ਼ੀਨ ਦਾ ਖਰੀਦ ਮੁੱਲ ₹{purchasePrice} ਹੈ। ਮੁਰੰਮਤ, ਆਵਾਜਾਈ ਅਤੇ ਇੰਸਟਾਲੇਸ਼ਨ ਖਰਚ ਕ੍ਰਮਵਾਰ ₹{repairExpense}, ₹{transportExpense} ਅਤੇ ₹{installationExpense} ਹਨ। ਕੁੱਲ ਪ੍ਰਭਾਵੀ ਲਾਗਤ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-151": {
    "en": [
      "Display equipment costs ₹{purchasePrice}. Setup expenses are {overheadPercent}% of the purchase price. Find the effective cost.",
      "A retailer buys display equipment for ₹{purchasePrice} and incurs setup overhead equal to {overheadPercent}% of purchase price. What is the total effective cost?"
    ],
    "hi": [
      "डिस्प्ले उपकरण का क्रय मूल्य ₹{purchasePrice} है। सेटअप खर्च क्रय मूल्य का {overheadPercent}% है। प्रभावी लागत ज्ञात कीजिए।",
      "एक खुदरा विक्रेता डिस्प्ले उपकरण ₹{purchasePrice} में खरीदता है और सेटअप ओवरहेड क्रय मूल्य का {overheadPercent}% है। कुल प्रभावी लागत क्या है?"
    ],
    "pa": [
      "ਡਿਸਪਲੇ ਉਪਕਰਣ ਦਾ ਖਰੀਦ ਮੁੱਲ ₹{purchasePrice} ਹੈ। ਸੈਟਅੱਪ ਖਰਚ ਖਰੀਦ ਮੁੱਲ ਦਾ {overheadPercent}% ਹੈ। ਪ੍ਰਭਾਵੀ ਲਾਗਤ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਰਿਟੇਲਰ ਡਿਸਪਲੇ ਉਪਕਰਣ ₹{purchasePrice} ਵਿੱਚ ਖਰੀਦਦਾ ਹੈ ਅਤੇ ਸੈਟਅੱਪ ਓਵਰਹੈੱਡ ਖਰੀਦ ਮੁੱਲ ਦਾ {overheadPercent}% ਹੈ। ਕੁੱਲ ਪ੍ਰਭਾਵੀ ਲਾਗਤ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-152": {
    "en": [
      "Used equipment is bought for ₹{purchasePrice} and ₹{expenses} is spent to make it sale-ready. At what price should it be sold for {profitPercent}% profit on effective cost?",
      "A dealer's effective cost includes ₹{purchasePrice} purchase price plus ₹{expenses} preparation expenses. Find the selling price required for {profitPercent}% profit."
    ],
    "hi": [
      "पुराना उपकरण ₹{purchasePrice} में खरीदा जाता है और उसे बिक्री योग्य बनाने पर ₹{expenses} खर्च होते हैं। प्रभावी लागत पर {profitPercent}% लाभ के लिए विक्रय मूल्य ज्ञात कीजिए।",
      "डीलर की प्रभावी लागत में ₹{purchasePrice} का क्रय मूल्य और ₹{expenses} की तैयारी लागत शामिल है। {profitPercent}% लाभ के लिए आवश्यक विक्रय मूल्य ज्ञात कीजिए।"
    ],
    "pa": [
      "ਪੁਰਾਣਾ ਉਪਕਰਣ ₹{purchasePrice} ਵਿੱਚ ਖਰੀਦਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਇਸਨੂੰ ਵਿਕਰੀ ਲਈ ਤਿਆਰ ਕਰਨ 'ਤੇ ₹{expenses} ਖਰਚ ਹੁੰਦਾ ਹੈ। ਪ੍ਰਭਾਵੀ ਲਾਗਤ 'ਤੇ {profitPercent}% ਲਾਭ ਲਈ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਡੀਲਰ ਦੀ ਪ੍ਰਭਾਵੀ ਲਾਗਤ ਵਿੱਚ ₹{purchasePrice} ਦਾ ਖਰੀਦ ਮੁੱਲ ਅਤੇ ₹{expenses} ਦੀ ਤਿਆਰੀ ਲਾਗਤ ਸ਼ਾਮਲ ਹੈ। {profitPercent}% ਲਾਭ ਲਈ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-153": {
    "en": [
      "A damaged appliance is bought for ₹{purchasePrice} and restored at a cost of ₹{expenses}. What selling price gives a {lossPercent}% loss on effective cost?",
      "A trader spends ₹{purchasePrice} to buy a damaged appliance and ₹{expenses} to restore it. Find the selling price corresponding to {lossPercent}% loss on total effective cost."
    ],
    "hi": [
      "एक खराब उपकरण ₹{purchasePrice} में खरीदा जाता है और उसकी मरम्मत पर ₹{expenses} खर्च होते हैं। प्रभावी लागत पर {lossPercent}% हानि के लिए विक्रय मूल्य ज्ञात कीजिए।",
      "व्यापारी खराब उपकरण ₹{purchasePrice} में खरीदता है और उसे ठीक करने पर ₹{expenses} खर्च करता है। कुल प्रभावी लागत पर {lossPercent}% हानि के अनुरूप विक्रय मूल्य ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਖਰਾਬ ਉਪਕਰਣ ₹{purchasePrice} ਵਿੱਚ ਖਰੀਦਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਇਸਦੀ ਮੁਰੰਮਤ 'ਤੇ ₹{expenses} ਖਰਚ ਹੁੰਦਾ ਹੈ। ਪ੍ਰਭਾਵੀ ਲਾਗਤ 'ਤੇ {lossPercent}% ਘਾਟੇ ਲਈ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਵਪਾਰੀ ਖਰਾਬ ਉਪਕਰਣ ₹{purchasePrice} ਵਿੱਚ ਖਰੀਦਦਾ ਹੈ ਅਤੇ ਇਸਨੂੰ ਠੀਕ ਕਰਨ 'ਤੇ ₹{expenses} ਖਰਚਦਾ ਹੈ। ਕੁੱਲ ਪ੍ਰਭਾਵੀ ਲਾਗਤ 'ਤੇ {lossPercent}% ਘਾਟੇ ਦੇ ਅਨੁਸਾਰ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-154": {
    "en": [
      "An antique desk is bought for ₹{purchasePrice}, restored for ₹{expenses}, and sold for ₹{sellingPrice}. Find the percentage gain or loss on effective cost.",
      "A desk costs ₹{purchasePrice} initially and needs ₹{expenses} restoration expense before being sold for ₹{sellingPrice}. Calculate the profit or loss percentage on total effective cost."
    ],
    "hi": [
      "एक पुरानी मेज ₹{purchasePrice} में खरीदी जाती है, उसकी बहाली पर ₹{expenses} खर्च होते हैं और उसे ₹{sellingPrice} में बेचा जाता है। प्रभावी लागत पर लाभ या हानि प्रतिशत ज्ञात कीजिए।",
      "मेज की प्रारंभिक लागत ₹{purchasePrice} है और बहाली खर्च ₹{expenses} है। इसे ₹{sellingPrice} में बेचने पर कुल प्रभावी लागत पर लाभ या हानि प्रतिशत ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਪੁਰਾਣੀ ਮੇਜ਼ ₹{purchasePrice} ਵਿੱਚ ਖਰੀਦੀ ਜਾਂਦੀ ਹੈ, ਇਸਦੀ ਮੁਰੰਮਤ 'ਤੇ ₹{expenses} ਖਰਚ ਹੁੰਦਾ ਹੈ ਅਤੇ ਇਸਨੂੰ ₹{sellingPrice} ਵਿੱਚ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ। ਪ੍ਰਭਾਵੀ ਲਾਗਤ 'ਤੇ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਮੇਜ਼ ਦੀ ਸ਼ੁਰੂਆਤੀ ਲਾਗਤ ₹{purchasePrice} ਹੈ ਅਤੇ ਮੁਰੰਮਤ ਖਰਚ ₹{expenses} ਹੈ। ਇਸਨੂੰ ₹{sellingPrice} ਵਿੱਚ ਵੇਚਣ 'ਤੇ ਕੁੱਲ ਪ੍ਰਭਾਵੀ ਲਾਗਤ 'ਤੇ ਲਾਭ ਜਾਂ ਘਾਟਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-155": {
    "en": [
      "A vehicle is bought for ₹{purchasePrice} and is expected to sell for ₹{sellingPrice}. What is the maximum additional expense allowed if the final result must be {targetRatePercent}% {targetDirection} on effective cost?",
      "A dealer pays ₹{purchasePrice} for a vehicle and plans to sell it for ₹{sellingPrice}. Find the greatest extra expense that still allows {targetRatePercent}% {targetDirection} on total effective cost."
    ],
    "hi": [
      "एक वाहन ₹{purchasePrice} में खरीदा जाता है और ₹{sellingPrice} में बेचा जाना है। यदि प्रभावी लागत पर अंतिम परिणाम {targetRatePercent}% {targetDirection} होना चाहिए, तो अधिकतम अतिरिक्त खर्च कितना हो सकता है?",
      "डीलर वाहन के लिए ₹{purchasePrice} देता है और उसे ₹{sellingPrice} में बेचने की योजना है। कुल प्रभावी लागत पर {targetRatePercent}% {targetDirection} बनाए रखने के लिए अधिकतम अतिरिक्त खर्च ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਵਾਹਨ ₹{purchasePrice} ਵਿੱਚ ਖਰੀਦਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ₹{sellingPrice} ਵਿੱਚ ਵੇਚਿਆ ਜਾਣਾ ਹੈ। ਜੇ ਪ੍ਰਭਾਵੀ ਲਾਗਤ 'ਤੇ ਅੰਤਿਮ ਨਤੀਜਾ {targetRatePercent}% {targetDirection} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਤਾਂ ਵੱਧ ਤੋਂ ਵੱਧ ਵਾਧੂ ਖਰਚ ਕਿੰਨਾ ਹੋ ਸਕਦਾ ਹੈ?",
      "ਡੀਲਰ ਵਾਹਨ ਲਈ ₹{purchasePrice} ਦਿੰਦਾ ਹੈ ਅਤੇ ਇਸਨੂੰ ₹{sellingPrice} ਵਿੱਚ ਵੇਚਣ ਦੀ ਯੋਜਨਾ ਹੈ। ਕੁੱਲ ਪ੍ਰਭਾਵੀ ਲਾਗਤ 'ਤੇ {targetRatePercent}% {targetDirection} ਬਣਾਈ ਰੱਖਣ ਲਈ ਵੱਧ ਤੋਂ ਵੱਧ ਵਾਧੂ ਖਰਚ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-156": {
    "en": [
      "A bakery spends ₹{totalInputCost} to produce {inputQuantity} units, but {wastedQuantity} units are lost during preparation. Find the effective cost per usable unit.",
      "Ingredients cost ₹{totalInputCost} for {inputQuantity} units of planned output. If {wastedQuantity} units are wasted, what is the effective cost of each usable unit?"
    ],
    "hi": [
      "एक बेकरी {inputQuantity} इकाइयों के लिए ₹{totalInputCost} खर्च करती है, लेकिन तैयारी में {wastedQuantity} इकाइयाँ खराब हो जाती हैं। प्रति उपयोगी इकाई प्रभावी लागत ज्ञात कीजिए।",
      "{inputQuantity} इकाइयों के नियोजित उत्पादन के लिए सामग्री की लागत ₹{totalInputCost} है। यदि {wastedQuantity} इकाइयाँ नष्ट हो जाएँ, तो प्रत्येक उपयोगी इकाई की प्रभावी लागत क्या है?"
    ],
    "pa": [
      "ਇੱਕ ਬੇਕਰੀ {inputQuantity} ਇਕਾਈਆਂ ਲਈ ₹{totalInputCost} ਖਰਚਦੀ ਹੈ, ਪਰ ਤਿਆਰੀ ਦੌਰਾਨ {wastedQuantity} ਇਕਾਈਆਂ ਖਰਾਬ ਹੋ ਜਾਂਦੀਆਂ ਹਨ। ਪ੍ਰਤੀ ਵਰਤਣਯੋਗ ਇਕਾਈ ਪ੍ਰਭਾਵੀ ਲਾਗਤ ਪਤਾ ਕਰੋ।",
      "{inputQuantity} ਇਕਾਈਆਂ ਦੇ ਯੋਜਿਤ ਉਤਪਾਦਨ ਲਈ ਸਮੱਗਰੀ ਦੀ ਲਾਗਤ ₹{totalInputCost} ਹੈ। ਜੇ {wastedQuantity} ਇਕਾਈਆਂ ਨਸ਼ਟ ਹੋ ਜਾਣ, ਤਾਂ ਹਰ ਵਰਤਣਯੋਗ ਇਕਾਈ ਦੀ ਪ੍ਰਭਾਵੀ ਲਾਗਤ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-157": {
    "en": [
      "A food-processing batch costs ₹{totalInputCost} for {inputQuantity} input units. After {wastedQuantity} units are lost, at what price should each usable unit be sold for {targetRatePercent}% {targetDirection}?",
      "A batch has total input cost ₹{totalInputCost} and starts with {inputQuantity} units; {wastedQuantity} are lost. Find the selling price per usable unit required for {targetRatePercent}% overall {targetDirection}."
    ],
    "hi": [
      "खाद्य-प्रसंस्करण बैच की लागत ₹{totalInputCost} है और प्रारंभिक मात्रा {inputQuantity} इकाइयाँ है। {wastedQuantity} इकाइयाँ नष्ट हो जाती हैं। {targetRatePercent}% {targetDirection} के लिए प्रति उपयोगी इकाई विक्रय मूल्य ज्ञात कीजिए।",
      "बैच की कुल इनपुट लागत ₹{totalInputCost} है और शुरुआत में {inputQuantity} इकाइयाँ हैं; {wastedQuantity} इकाइयाँ नष्ट हो जाती हैं। कुल {targetRatePercent}% {targetDirection} के लिए प्रति उपयोगी इकाई आवश्यक विक्रय मूल्य ज्ञात कीजिए।"
    ],
    "pa": [
      "ਖਾਦ-ਪ੍ਰੋਸੈਸਿੰਗ ਬੈਚ ਦੀ ਲਾਗਤ ₹{totalInputCost} ਹੈ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਮਾਤਰਾ {inputQuantity} ਇਕਾਈਆਂ ਹੈ। {wastedQuantity} ਇਕਾਈਆਂ ਨਸ਼ਟ ਹੋ ਜਾਂਦੀਆਂ ਹਨ। {targetRatePercent}% {targetDirection} ਲਈ ਪ੍ਰਤੀ ਵਰਤਣਯੋਗ ਇਕਾਈ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਬੈਚ ਦੀ ਕੁੱਲ ਇਨਪੁੱਟ ਲਾਗਤ ₹{totalInputCost} ਹੈ ਅਤੇ ਸ਼ੁਰੂ ਵਿੱਚ {inputQuantity} ਇਕਾਈਆਂ ਹਨ; {wastedQuantity} ਇਕਾਈਆਂ ਨਸ਼ਟ ਹੋ ਜਾਂਦੀਆਂ ਹਨ। ਕੁੱਲ {targetRatePercent}% {targetDirection} ਲਈ ਪ੍ਰਤੀ ਵਰਤਣਯੋਗ ਇਕਾਈ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-158": {
    "en": [
      "A factory has fixed cost ₹{fixedCost}, variable cost ₹{variableCostPerUnit} per unit, and selling price ₹{sellingPricePerUnit} per unit. Find the minimum break-even quantity.",
      "With fixed cost ₹{fixedCost}, variable cost ₹{variableCostPerUnit} and unit selling price ₹{sellingPricePerUnit}, how many units must be sold to break even?"
    ],
    "hi": [
      "एक कारखाने की स्थिर लागत ₹{fixedCost}, प्रति इकाई परिवर्ती लागत ₹{variableCostPerUnit} और विक्रय मूल्य ₹{sellingPricePerUnit} है। न्यूनतम ब्रेक-ईवन मात्रा ज्ञात कीजिए।",
      "स्थिर लागत ₹{fixedCost}, परिवर्ती लागत ₹{variableCostPerUnit} और प्रति इकाई विक्रय मूल्य ₹{sellingPricePerUnit} होने पर ब्रेक-ईवन के लिए कितनी इकाइयाँ बेचनी होंगी?"
    ],
    "pa": [
      "ਇੱਕ ਫੈਕਟਰੀ ਦੀ ਸਥਿਰ ਲਾਗਤ ₹{fixedCost}, ਪ੍ਰਤੀ ਇਕਾਈ ਬਦਲਦੀ ਲਾਗਤ ₹{variableCostPerUnit} ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ ₹{sellingPricePerUnit} ਹੈ। ਘੱਟੋ-ਘੱਟ ਬ੍ਰੇਕ-ਈਵਨ ਮਾਤਰਾ ਪਤਾ ਕਰੋ।",
      "ਸਥਿਰ ਲਾਗਤ ₹{fixedCost}, ਬਦਲਦੀ ਲਾਗਤ ₹{variableCostPerUnit} ਅਤੇ ਪ੍ਰਤੀ ਇਕਾਈ ਵਿਕਰੀ ਮੁੱਲ ₹{sellingPricePerUnit} ਹੋਣ 'ਤੇ ਬ੍ਰੇਕ-ਈਵਨ ਲਈ ਕਿੰਨੀਆਂ ਇਕਾਈਆਂ ਵੇਚਣੀਆਂ ਪੈਣਗੀਆਂ?"
    ]
  },
  "PNL-QL-159": {
    "en": [
      "A printing press has fixed cost ₹{fixedCost}. Each booklet costs ₹{variableCostPerUnit} to print and sells for ₹{sellingPricePerUnit}. How many must be sold to earn at least ₹{targetProfit}?",
      "Booklets sell for ₹{sellingPricePerUnit} each and cost ₹{variableCostPerUnit} each to print, while fixed cost is ₹{fixedCost}. Find the minimum sales quantity for a profit of ₹{targetProfit}."
    ],
    "hi": [
      "एक प्रिंटिंग प्रेस की स्थिर लागत ₹{fixedCost} है। प्रत्येक पुस्तिका की परिवर्ती लागत ₹{variableCostPerUnit} और विक्रय मूल्य ₹{sellingPricePerUnit} है। कम से कम ₹{targetProfit} लाभ के लिए कितनी पुस्तिकाएँ बेचनी होंगी?",
      "प्रत्येक पुस्तिका ₹{sellingPricePerUnit} में बिकती है और छपाई लागत ₹{variableCostPerUnit} है, जबकि स्थिर लागत ₹{fixedCost} है। ₹{targetProfit} लाभ के लिए न्यूनतम बिक्री मात्रा ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਪ੍ਰਿੰਟਿੰਗ ਪ੍ਰੈੱਸ ਦੀ ਸਥਿਰ ਲਾਗਤ ₹{fixedCost} ਹੈ। ਹਰ ਪੁਸਤਿਕਾ ਦੀ ਬਦਲਦੀ ਲਾਗਤ ₹{variableCostPerUnit} ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ ₹{sellingPricePerUnit} ਹੈ। ਘੱਟੋ-ਘੱਟ ₹{targetProfit} ਲਾਭ ਲਈ ਕਿੰਨੀਆਂ ਪੁਸਤਿਕਾਵਾਂ ਵੇਚਣੀਆਂ ਪੈਣਗੀਆਂ?",
      "ਹਰ ਪੁਸਤਿਕਾ ₹{sellingPricePerUnit} ਵਿੱਚ ਵਿਕਦੀ ਹੈ ਅਤੇ ਛਪਾਈ ਲਾਗਤ ₹{variableCostPerUnit} ਹੈ, ਜਦਕਿ ਸਥਿਰ ਲਾਗਤ ₹{fixedCost} ਹੈ। ₹{targetProfit} ਲਾਭ ਲਈ ਘੱਟੋ-ਘੱਟ ਵਿਕਰੀ ਮਾਤਰਾ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-160": {
    "en": [
      "A workshop has fixed cost ₹{fixedCost} and variable cost ₹{variableCostPerUnit} per unit. If {quantity} units are produced and sold, find the break-even selling price per unit.",
      "For an output of {quantity} units, fixed cost is ₹{fixedCost} and variable cost is ₹{variableCostPerUnit} per unit. What unit selling price gives break even?"
    ],
    "hi": [
      "एक कार्यशाला की स्थिर लागत ₹{fixedCost} और प्रति इकाई परिवर्ती लागत ₹{variableCostPerUnit} है। यदि {quantity} इकाइयाँ बनाई और बेची जाएँ, तो ब्रेक-ईवन विक्रय मूल्य प्रति इकाई ज्ञात कीजिए।",
      "{quantity} इकाइयों के उत्पादन पर स्थिर लागत ₹{fixedCost} और प्रति इकाई परिवर्ती लागत ₹{variableCostPerUnit} है। ब्रेक-ईवन के लिए प्रति इकाई विक्रय मूल्य क्या होगा?"
    ],
    "pa": [
      "ਇੱਕ ਵਰਕਸ਼ਾਪ ਦੀ ਸਥਿਰ ਲਾਗਤ ₹{fixedCost} ਅਤੇ ਪ੍ਰਤੀ ਇਕਾਈ ਬਦਲਦੀ ਲਾਗਤ ₹{variableCostPerUnit} ਹੈ। ਜੇ {quantity} ਇਕਾਈਆਂ ਬਣਾਈਆਂ ਅਤੇ ਵੇਚੀਆਂ ਜਾਣ, ਤਾਂ ਬ੍ਰੇਕ-ਈਵਨ ਵਿਕਰੀ ਮੁੱਲ ਪ੍ਰਤੀ ਇਕਾਈ ਪਤਾ ਕਰੋ।",
      "{quantity} ਇਕਾਈਆਂ ਦੇ ਉਤਪਾਦਨ 'ਤੇ ਸਥਿਰ ਲਾਗਤ ₹{fixedCost} ਅਤੇ ਪ੍ਰਤੀ ਇਕਾਈ ਬਦਲਦੀ ਲਾਗਤ ₹{variableCostPerUnit} ਹੈ। ਬ੍ਰੇਕ-ਈਵਨ ਲਈ ਪ੍ਰਤੀ ਇਕਾਈ ਵਿਕਰੀ ਮੁੱਲ ਕੀ ਹੋਵੇਗਾ?"
    ]
  },
  "PNL-QL-161": {
    "en": [
      "A trader buys one asset for ₹{firstCostPrice} and sells it for ₹{firstSellingPrice}, making a loss. He buys a second asset for ₹{secondCostPrice}. At what price should the second asset be sold so that both transactions together break even?",
      "The first asset costs ₹{firstCostPrice} and is sold for ₹{firstSellingPrice}. A second asset costs ₹{secondCostPrice}. Find its required selling price to recover the first loss and break even overall."
    ],
    "hi": [
      "एक व्यापारी पहली संपत्ति ₹{firstCostPrice} में खरीदकर ₹{firstSellingPrice} में बेचता है और हानि होती है। दूसरी संपत्ति का क्रय मूल्य ₹{secondCostPrice} है। दोनों लेन-देन मिलाकर ब्रेक-ईवन के लिए दूसरी संपत्ति का विक्रय मूल्य ज्ञात कीजिए।",
      "पहली संपत्ति की लागत ₹{firstCostPrice} और विक्रय मूल्य ₹{firstSellingPrice} है। दूसरी संपत्ति की लागत ₹{secondCostPrice} है। पहली हानि की भरपाई कर कुल ब्रेक-ईवन के लिए आवश्यक विक्रय मूल्य ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਵਪਾਰੀ ਪਹਿਲੀ ਸੰਪਤੀ ₹{firstCostPrice} ਵਿੱਚ ਖਰੀਦ ਕੇ ₹{firstSellingPrice} ਵਿੱਚ ਵੇਚਦਾ ਹੈ ਅਤੇ ਘਾਟਾ ਹੁੰਦਾ ਹੈ। ਦੂਜੀ ਸੰਪਤੀ ਦਾ ਖਰੀਦ ਮੁੱਲ ₹{secondCostPrice} ਹੈ। ਦੋਵੇਂ ਲੈਣ-ਦੇਣ ਮਿਲਾ ਕੇ ਬ੍ਰੇਕ-ਈਵਨ ਲਈ ਦੂਜੀ ਸੰਪਤੀ ਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਪਹਿਲੀ ਸੰਪਤੀ ਦੀ ਲਾਗਤ ₹{firstCostPrice} ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ ₹{firstSellingPrice} ਹੈ। ਦੂਜੀ ਸੰਪਤੀ ਦੀ ਲਾਗਤ ₹{secondCostPrice} ਹੈ। ਪਹਿਲੇ ਘਾਟੇ ਦੀ ਭਰਪਾਈ ਕਰਕੇ ਕੁੱਲ ਬ੍ਰੇਕ-ਈਵਨ ਲਈ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-162": {
    "en": [
      "A trader buys one item for ₹{firstCostPrice} and sells it for ₹{firstSellingPrice}. A second item costs ₹{secondCostPrice}. Find the selling price of the second item needed for an overall {targetRatePercent}% {targetDirection}.",
      "The first transaction is ₹{firstCostPrice} cost and ₹{firstSellingPrice} sale; another item costs ₹{secondCostPrice}. What second selling price will make the combined result {targetRatePercent}% {targetDirection}?"
    ],
    "hi": [
      "एक व्यापारी पहली वस्तु ₹{firstCostPrice} में खरीदकर ₹{firstSellingPrice} में बेचता है। दूसरी वस्तु की लागत ₹{secondCostPrice} है। कुल {targetRatePercent}% {targetDirection} के लिए दूसरी वस्तु का आवश्यक विक्रय मूल्य ज्ञात कीजिए।",
      "पहले लेन-देन में लागत ₹{firstCostPrice} और बिक्री ₹{firstSellingPrice} है; दूसरी वस्तु की लागत ₹{secondCostPrice} है। संयुक्त परिणाम {targetRatePercent}% {targetDirection} करने के लिए दूसरी बिक्री कितनी होनी चाहिए?"
    ],
    "pa": [
      "ਇੱਕ ਵਪਾਰੀ ਪਹਿਲੀ ਵਸਤ ₹{firstCostPrice} ਵਿੱਚ ਖਰੀਦ ਕੇ ₹{firstSellingPrice} ਵਿੱਚ ਵੇਚਦਾ ਹੈ। ਦੂਜੀ ਵਸਤ ਦੀ ਲਾਗਤ ₹{secondCostPrice} ਹੈ। ਕੁੱਲ {targetRatePercent}% {targetDirection} ਲਈ ਦੂਜੀ ਵਸਤ ਦਾ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਪਹਿਲੇ ਲੈਣ-ਦੇਣ ਵਿੱਚ ਲਾਗਤ ₹{firstCostPrice} ਅਤੇ ਵਿਕਰੀ ₹{firstSellingPrice} ਹੈ; ਦੂਜੀ ਵਸਤ ਦੀ ਲਾਗਤ ₹{secondCostPrice} ਹੈ। ਮਿਲਿਆ-ਜੁਲਿਆ ਨਤੀਜਾ {targetRatePercent}% {targetDirection} ਕਰਨ ਲਈ ਦੂਜੀ ਵਿਕਰੀ ਕਿੰਨੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?"
    ]
  },
  "PNL-QL-163": {
    "en": [
      "A transaction recovers ₹{totalRecovery}, which represents {ratePercent}% {direction} on effective cost. Find the effective cost.",
      "The total recovery is ₹{totalRecovery} at {ratePercent}% {direction} relative to effective cost. What was the effective cost?"
    ],
    "hi": [
      "एक लेन-देन में ₹{totalRecovery} की वसूली होती है, जो प्रभावी लागत पर {ratePercent}% {direction} दर्शाती है। प्रभावी लागत ज्ञात कीजिए।",
      "कुल वसूली ₹{totalRecovery} है और यह प्रभावी लागत के सापेक्ष {ratePercent}% {direction} है। प्रभावी लागत क्या थी?"
    ],
    "pa": [
      "ਇੱਕ ਲੈਣ-ਦੇਣ ਵਿੱਚ ₹{totalRecovery} ਦੀ ਵਸੂਲੀ ਹੁੰਦੀ ਹੈ, ਜੋ ਪ੍ਰਭਾਵੀ ਲਾਗਤ 'ਤੇ {ratePercent}% {direction} ਦਰਸਾਉਂਦੀ ਹੈ। ਪ੍ਰਭਾਵੀ ਲਾਗਤ ਪਤਾ ਕਰੋ।",
      "ਕੁੱਲ ਵਸੂਲੀ ₹{totalRecovery} ਹੈ ਅਤੇ ਇਹ ਪ੍ਰਭਾਵੀ ਲਾਗਤ ਦੇ ਮੁਕਾਬਲੇ {ratePercent}% {direction} ਹੈ। ਪ੍ਰਭਾਵੀ ਲਾਗਤ ਕੀ ਸੀ?"
    ]
  },
  "PNL-QL-164": {
    "en": [
      "Solar equipment is bought for ₹{purchasePrice}. Flat expenses are {flatExpenses}, followed by {overheadPercent}% overhead on {overheadBase}. Find the effective cost.",
      "A solar installation starts with purchase price ₹{purchasePrice}, adds flat expenses {flatExpenses}, then applies {overheadPercent}% overhead on {overheadBase}. What is the final effective cost?"
    ],
    "hi": [
      "सौर उपकरण ₹{purchasePrice} में खरीदा जाता है। फ्लैट खर्च {flatExpenses} हैं और इसके बाद {overheadBase} पर {overheadPercent}% ओवरहेड लगता है। प्रभावी लागत ज्ञात कीजिए।",
      "सौर स्थापना की खरीद कीमत ₹{purchasePrice} है, फ्लैट खर्च {flatExpenses} जोड़े जाते हैं और फिर {overheadBase} पर {overheadPercent}% ओवरहेड लगाया जाता है। अंतिम प्रभावी लागत क्या है?"
    ],
    "pa": [
      "ਸੋਲਰ ਉਪਕਰਣ ₹{purchasePrice} ਵਿੱਚ ਖਰੀਦਿਆ ਜਾਂਦਾ ਹੈ। ਫਲੈਟ ਖਰਚ {flatExpenses} ਹਨ ਅਤੇ ਇਸ ਤੋਂ ਬਾਅਦ {overheadBase} 'ਤੇ {overheadPercent}% ਓਵਰਹੈੱਡ ਲੱਗਦਾ ਹੈ। ਪ੍ਰਭਾਵੀ ਲਾਗਤ ਪਤਾ ਕਰੋ।",
      "ਸੋਲਰ ਇੰਸਟਾਲੇਸ਼ਨ ਦੀ ਖਰੀਦ ਕੀਮਤ ₹{purchasePrice} ਹੈ, ਫਲੈਟ ਖਰਚ {flatExpenses} ਜੋੜੇ ਜਾਂਦੇ ਹਨ ਅਤੇ ਫਿਰ {overheadBase} 'ਤੇ {overheadPercent}% ਓਵਰਹੈੱਡ ਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਪ੍ਰਭਾਵੀ ਲਾਗਤ ਕੀ ਹੈ?"
    ]
  },
  "PNL-QL-165": {
    "en": [
      "An asset is purchased for ₹{purchasePrice} and its final effective cost is ₹{effectiveCost}. Find the total additional expense.",
      "The purchase price is ₹{purchasePrice}, while effective cost after all expenses is ₹{effectiveCost}. How much extra cost was added?"
    ],
    "hi": [
      "एक संपत्ति ₹{purchasePrice} में खरीदी जाती है और उसकी अंतिम प्रभावी लागत ₹{effectiveCost} है। कुल अतिरिक्त खर्च ज्ञात कीजिए।",
      "क्रय मूल्य ₹{purchasePrice} है, जबकि सभी खर्चों के बाद प्रभावी लागत ₹{effectiveCost} है। कितनी अतिरिक्त लागत जुड़ी?"
    ],
    "pa": [
      "ਇੱਕ ਸੰਪਤੀ ₹{purchasePrice} ਵਿੱਚ ਖਰੀਦੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਇਸਦੀ ਅੰਤਿਮ ਪ੍ਰਭਾਵੀ ਲਾਗਤ ₹{effectiveCost} ਹੈ। ਕੁੱਲ ਵਾਧੂ ਖਰਚ ਪਤਾ ਕਰੋ।",
      "ਖਰੀਦ ਮੁੱਲ ₹{purchasePrice} ਹੈ, ਜਦਕਿ ਸਾਰੇ ਖਰਚਾਂ ਤੋਂ ਬਾਅਦ ਪ੍ਰਭਾਵੀ ਲਾਗਤ ₹{effectiveCost} ਹੈ। ਕਿੰਨੀ ਵਾਧੂ ਲਾਗਤ ਜੁੜੀ?"
    ]
  },
  "PNL-QL-166": {
    "en": [
      "A warehouse unit costs ₹{purchasePrice}, has flat expenses {flatExpenses}, and ends with effective cost ₹{effectiveCost}. If the remaining overhead is calculated on {overheadBase}, find the overhead percentage.",
      "A warehouse purchase of ₹{purchasePrice} plus flat expenses {flatExpenses} becomes ₹{effectiveCost} after overhead. The overhead base is {overheadBase}. Determine the overhead rate."
    ],
    "hi": [
      "गोदाम इकाई का क्रय मूल्य ₹{purchasePrice}, फ्लैट खर्च {flatExpenses} और अंतिम प्रभावी लागत ₹{effectiveCost} है। शेष ओवरहेड {overheadBase} पर लगाया जाता है। ओवरहेड प्रतिशत ज्ञात कीजिए।",
      "गोदाम की खरीद ₹{purchasePrice} और फ्लैट खर्च {flatExpenses} मिलकर ओवरहेड के बाद ₹{effectiveCost} हो जाते हैं। ओवरहेड आधार {overheadBase} है। ओवरहेड दर ज्ञात कीजिए।"
    ],
    "pa": [
      "ਗੋਦਾਮ ਇਕਾਈ ਦਾ ਖਰੀਦ ਮੁੱਲ ₹{purchasePrice}, ਫਲੈਟ ਖਰਚ {flatExpenses} ਅਤੇ ਅੰਤਿਮ ਪ੍ਰਭਾਵੀ ਲਾਗਤ ₹{effectiveCost} ਹੈ। ਬਾਕੀ ਓਵਰਹੈੱਡ {overheadBase} 'ਤੇ ਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਓਵਰਹੈੱਡ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਗੋਦਾਮ ਦੀ ਖਰੀਦ ₹{purchasePrice} ਅਤੇ ਫਲੈਟ ਖਰਚ {flatExpenses} ਮਿਲ ਕੇ ਓਵਰਹੈੱਡ ਤੋਂ ਬਾਅਦ ₹{effectiveCost} ਹੋ ਜਾਂਦੇ ਹਨ। ਓਵਰਹੈੱਡ ਆਧਾਰ {overheadBase} ਹੈ। ਓਵਰਹੈੱਡ ਦਰ ਪਤਾ ਕਰੋ।"
    ]
  }
};

function hash(value: string): number {
  let h = 2166136261;
  for (const character of value) {
    h ^= character.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function selectPnlAuthoredStem(input: Readonly<{
  qlId: string;
  seed: string;
  language: AuthoredStemLanguage;
  variables: Readonly<Record<string, unknown>>;
  canonicalStem: string;
}>): Readonly<{ stem: string; variant: number }> {
  const variants = STEMS[input.qlId]?.[input.language];
  if (!variants) return { stem: input.canonicalStem, variant: 0 };
  const variant = hash(input.seed + ":" + input.qlId + ":authored-stem") % 3;
  if (variant === 0) return { stem: input.canonicalStem, variant };
  const stem = variants[variant - 1]!.replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (token, key: string) =>
    key in input.variables ? String(input.variables[key]) : token,
  );
  if (/\{[A-Za-z][A-Za-z0-9_]*\}/.test(stem)) {
    throw new Error(input.qlId + "/" + input.language + ": authored stem has unresolved variables.");
  }
  return { stem, variant };
}
