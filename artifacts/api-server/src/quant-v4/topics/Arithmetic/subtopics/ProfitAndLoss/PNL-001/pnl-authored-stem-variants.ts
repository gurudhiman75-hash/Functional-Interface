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
