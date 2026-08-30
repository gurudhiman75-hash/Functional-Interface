import type { GeometryPrototypeEditorialTemplateV2 } from "./geometry-localization-editorial-v2-types";

export const GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_A2 = Object.freeze(
{
  "GEO-TMP-GAP-W9-CP003-TRIANGLE-INEQUALITY-INTEGER-COUNT-V1": {
      "question": {
        "sourceMasked": "A triangle has two sides of lengths {{0}} cm and {{1}} cm. How many positive integer lengths can its third side have?",
        "hi": "एक त्रिभुज की दो भुजाओं की लंबाइयाँ {{0}} cm और {{1}} cm हैं। तीसरी भुजा के लिए कितने धनात्मक पूर्णांक मान संभव हैं?",
        "pa": "ਇੱਕ ਤਿਕੋਣ ਦੀਆਂ ਦੋ ਭੁਜਾਵਾਂ ਦੀਆਂ ਲੰਬਾਈਆਂ {{0}} cm ਅਤੇ {{1}} cm ਹਨ। ਤੀਜੀ ਭੁਜਾ ਲਈ ਕਿੰਨੇ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਮਾਨ ਸੰਭਵ ਹਨ?"
      },
      "explanations": [
        {
          "sourceMasked": "The third side must satisfy |{{0}} − {{1}}| < x < {{2}} + {{3}}, so {{4}} < x < {{5}}.",
          "hi": "तीसरी भुजा को |{{0}} − {{1}}| < x < {{2}} + {{3}} पूरा करना चाहिए, इसलिए {{4}} < x < {{5}}।",
          "pa": "ਤੀਜੀ ਭੁਜਾ ਲਈ |{{0}} − {{1}}| < x < {{2}} + {{3}} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਇਸ ਲਈ {{4}} < x < {{5}}।"
        },
        {
          "sourceMasked": "The integers strictly inside that interval are {{0}} through {{1}}, giving {{2}} possible values.",
          "hi": "इस खुले अंतराल में पूर्णांक {{0}} से {{1}} तक हैं, इसलिए कुल {{2}} मान संभव हैं।",
          "pa": "ਇਸ ਖੁੱਲ੍ਹੇ ਅੰਤਰਾਲ ਵਿੱਚ ਪੂਰਨ ਅੰਕ {{0}} ਤੋਂ {{1}} ਤੱਕ ਹਨ, ਇਸ ਲਈ ਕੁੱਲ {{2}} ਮਾਨ ਸੰਭਵ ਹਨ।"
        }
      ]
    },
  "GEO-TMP-GAP-W9-CP003-TRIANGLE-INEQUALITY-CLAIM-V1": {
      "question": {
        "sourceMasked": "Select the universally valid triangle-inequality statement.",
        "hi": "त्रिभुज असमता का वह कथन चुनिए जो हमेशा सत्य होता है।",
        "pa": "ਤਿਕੋਣ ਅਸਮਤਾ ਵਾਲਾ ਉਹ ਕਥਨ ਚੁਣੋ ਜੋ ਹਮੇਸ਼ਾ ਸਹੀ ਹੁੰਦਾ ਹੈ।"
      },
      "explanations": [
        {
          "sourceMasked": "A non-degenerate triangle must satisfy the strict triangle inequality for every pair of sides.",
          "hi": "किसी अविकृत त्रिभुज में प्रत्येक भुजा-युग्म के लिए कठोर त्रिभुज असमता लागू होती है।",
          "pa": "ਕਿਸੇ ਗੈਰ-ਅਵਕ੍ਰਿਤ ਤਿਕੋਣ ਵਿੱਚ ਹਰ ਭੁਜਾ-ਜੋੜੇ ਲਈ ਕੜੀ ਤਿਕੋਣ ਅਸਮਤਾ ਲਾਗੂ ਹੁੰਦੀ ਹੈ।"
        },
        {
          "sourceMasked": "Therefore the sum of any two sides is always greater than the remaining side.",
          "hi": "इसलिए किसी भी दो भुजाओं का योग हमेशा तीसरी भुजा से बड़ा होता है।",
          "pa": "ਇਸ ਲਈ ਕਿਸੇ ਵੀ ਦੋ ਭੁਜਾਵਾਂ ਦਾ ਜੋੜ ਹਮੇਸ਼ਾ ਤੀਜੀ ਭੁਜਾ ਤੋਂ ਵੱਡਾ ਹੁੰਦਾ ਹੈ।"
        }
      ]
    },
  "GEO-TMP-GAP-W13-CP003-SIDE-ANGLE-ORDERING-V1": {
      "question": {
        "sourceMasked": "In triangle ABC, ∠C is greater than ∠A. Which comparison of their opposite sides must be true?",
        "hi": "त्रिभुज ABC में ∠C, ∠A से बड़ा है। इनके सामने वाली भुजाओं में कौन-सी तुलना अवश्य सही होगी?",
        "pa": "ਤਿਕੋਣ ABC ਵਿੱਚ ∠C, ∠A ਤੋਂ ਵੱਡਾ ਹੈ। ਇਨ੍ਹਾਂ ਦੇ ਸਾਹਮਣੇ ਵਾਲੀਆਂ ਭੁਜਾਵਾਂ ਵਿੱਚ ਕਿਹੜੀ ਤੁਲਨਾ ਲਾਜ਼ਮੀ ਤੌਰ ਤੇ ਸਹੀ ਹੋਵੇਗੀ?"
      },
      "explanations": [
        {
          "sourceMasked": "In any triangle, the greater angle lies opposite the greater side.",
          "hi": "किसी भी त्रिभुज में बड़ा कोण बड़ी भुजा के सामने होता है।",
          "pa": "ਕਿਸੇ ਵੀ ਤਿਕੋਣ ਵਿੱਚ ਵੱਡਾ ਕੋਣ ਵੱਡੀ ਭੁਜਾ ਦੇ ਸਾਹਮਣੇ ਹੁੰਦਾ ਹੈ।"
        },
        {
          "sourceMasked": "∠C is greater than ∠A, so the side opposite ∠C must be longer than the side opposite ∠A. Therefore AB > BC.",
          "hi": "∠C, ∠A से बड़ा है, इसलिए ∠C के सामने वाली भुजा, ∠A के सामने वाली भुजा से लंबी होगी। अतः AB > BC।",
          "pa": "∠C, ∠A ਤੋਂ ਵੱਡਾ ਹੈ, ਇਸ ਲਈ ∠C ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ, ∠A ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਤੋਂ ਲੰਬੀ ਹੋਵੇਗੀ। ਇਸ ਲਈ AB > BC।"
        }
      ]
    },
  "GEO-TMP-CP004-RHS-CRITERION-V1": {
      "question": {
        "sourceMasked": "Triangles ABC and PQR are right-angled at A and P. Their hypotenuses satisfy BC = QR, and AB = PQ. Which congruence criterion proves the triangles congruent?",
        "hi": "त्रिभुज ABC और PQR क्रमशः A और P पर समकोण हैं। उनके कर्णों के लिए BC = QR और AB = PQ है। कौन-सी सर्वांगसमता कसौटी इन त्रिभुजों को सर्वांगसम सिद्ध करती है?",
        "pa": "ਤਿਕੋਣ ABC ਅਤੇ PQR ਕ੍ਰਮਵਾਰ A ਅਤੇ P ਉੱਤੇ ਸਮਕੋਣ ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਕਰਣਾਂ ਲਈ BC = QR ਅਤੇ AB = PQ ਹੈ। ਕਿਹੜੀ ਸਰਵਾਂਗਸਮਤਾ ਕਸੌਟੀ ਇਨ੍ਹਾਂ ਤਿਕੋਣਾਂ ਨੂੰ ਸਰਵਾਂਗਸਮ ਸਾਬਤ ਕਰਦੀ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "Both triangles are right triangles. Their hypotenuses are equal and one corresponding leg is also equal.",
          "hi": "दोनों त्रिभुज समकोण त्रिभुज हैं। उनके कर्ण बराबर हैं और एक संगत भुजा भी बराबर है।",
          "pa": "ਦੋਵੇਂ ਤਿਕੋਣ ਸਮਕੋਣ ਤਿਕੋਣ ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਕਰਣ ਬਰਾਬਰ ਹਨ ਅਤੇ ਇੱਕ ਸੰਗਤ ਭੁਜਾ ਵੀ ਬਰਾਬਰ ਹੈ।"
        },
        {
          "sourceMasked": "That is exactly the right-angle–hypotenuse–side condition, so the valid criterion is RHS.",
          "hi": "यह ठीक समकोण–कर्ण–भुजा की शर्त है, इसलिए सही कसौटी RHS है।",
          "pa": "ਇਹ ਬਿਲਕੁਲ ਸਮਕੋਣ–ਕਰਣ–ਭੁਜਾ ਵਾਲੀ ਸ਼ਰਤ ਹੈ, ਇਸ ਲਈ ਸਹੀ ਕਸੌਟੀ RHS ਹੈ।"
        }
      ]
    },
  "GEO-TMP-GAP-W10-CP004-SAS-CRITERION-V1": {
      "question": {
        "sourceMasked": "ABCD has AB parallel and equal to CD, with diagonal AC drawn. What congruence rule establishes △ABC ≅ △CDA?",
        "hi": "ABCD में AB, CD के समांतर और बराबर है तथा विकर्ण AC खींचा गया है। कौन-सा सर्वांगसमता नियम △ABC ≅ △CDA स्थापित करता है?",
        "pa": "ABCD ਵਿੱਚ AB, CD ਦੇ ਸਮਾਂਤਰ ਅਤੇ ਬਰਾਬਰ ਹੈ ਅਤੇ ਵਿਕਰਣ AC ਖਿੱਚਿਆ ਗਿਆ ਹੈ। ਕਿਹੜਾ ਸਰਵਾਂਗਸਮਤਾ ਨਿਯਮ △ABC ≅ △CDA ਸਥਾਪਿਤ ਕਰਦਾ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "Because AB ∥ CD, diagonal AC gives the alternate interior angle equality ∠BAC = ∠DCA.",
          "hi": "AB ∥ CD होने के कारण विकर्ण AC से एकांतर अंतः कोण बराबर मिलते हैं: ∠BAC = ∠DCA।",
          "pa": "AB ∥ CD ਹੋਣ ਕਰਕੇ ਵਿਕਰਣ AC ਤੋਂ ਇੱਕਾਂਤਰ ਅੰਦਰੂਨੀ ਕੋਣ ਬਰਾਬਰ ਮਿਲਦੇ ਹਨ: ∠BAC = ∠DCA।"
        },
        {
          "sourceMasked": "AB = CD is given and AC = CA is the common side. These are two sides and their included angle, so the triangles are congruent by SAS.",
          "hi": "AB = CD दिया है और AC = CA दोनों त्रिभुजों की सामान्य भुजा है। ये दो भुजाएँ और उनके बीच का कोण हैं, इसलिए त्रिभुज SAS से सर्वांगसम हैं।",
          "pa": "AB = CD ਦਿੱਤਾ ਹੈ ਅਤੇ AC = CA ਦੋਵੇਂ ਤਿਕੋਣਾਂ ਦੀ ਸਾਂਝੀ ਭੁਜਾ ਹੈ। ਇਹ ਦੋ ਭੁਜਾਵਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰਲਾ ਕੋਣ ਹਨ, ਇਸ ਲਈ ਤਿਕੋਣ SAS ਨਾਲ ਸਰਵਾਂਗਸਮ ਹਨ।"
        }
      ]
    },
  "GEO-TMP-CP004-CPCT-CORRESPONDENCE-V1": {
      "question": {
        "sourceMasked": "For triangles ABC and PQR, AB = PQ, AC = PR and BC = QR. After establishing congruence, which angle corresponds to ∠C?",
        "hi": "त्रिभुज ABC और PQR में AB = PQ, AC = PR और BC = QR है। सर्वांगसमता स्थापित होने के बाद ∠C के संगत कौन-सा कोण होगा?",
        "pa": "ਤਿਕੋਣ ABC ਅਤੇ PQR ਵਿੱਚ AB = PQ, AC = PR ਅਤੇ BC = QR ਹੈ। ਸਰਵਾਂਗਸਮਤਾ ਸਥਾਪਿਤ ਹੋਣ ਤੋਂ ਬਾਅਦ ∠C ਦੇ ਸੰਗਤ ਕਿਹੜਾ ਕੋਣ ਹੋਵੇਗਾ?"
      },
      "explanations": [
        {
          "sourceMasked": "The three side pairs match, so the triangles are congruent by SSS.",
          "hi": "तीनों भुजा-युग्म बराबर हैं, इसलिए त्रिभुज SSS से सर्वांगसम हैं।",
          "pa": "ਤਿੰਨੇ ਭੁਜਾ-ਜੋੜੇ ਬਰਾਬਰ ਹਨ, ਇਸ ਲਈ ਤਿਕੋਣ SSS ਨਾਲ ਸਰਵਾਂਗਸਮ ਹਨ।"
        },
        {
          "sourceMasked": "AB↔PQ and AC↔PR force A↔P; then B↔Q and C↔R. Therefore ∠C corresponds to ∠R, and corresponding parts of congruent triangles are equal.",
          "hi": "AB↔PQ और AC↔PR से A↔P निश्चित होता है; फिर B↔Q और C↔R। अतः ∠C का संगत कोण ∠R है, और सर्वांगसम त्रिभुजों के संगत भाग बराबर होते हैं।",
          "pa": "AB↔PQ ਅਤੇ AC↔PR ਤੋਂ A↔P ਨਿਰਧਾਰਤ ਹੁੰਦਾ ਹੈ; ਫਿਰ B↔Q ਅਤੇ C↔R। ਇਸ ਲਈ ∠C ਦਾ ਸੰਗਤ ਕੋਣ ∠R ਹੈ, ਅਤੇ ਸਰਵਾਂਗਸਮ ਤਿਕੋਣਾਂ ਦੇ ਸੰਗਤ ਭਾਗ ਬਰਾਬਰ ਹੁੰਦੇ ਹਨ।"
        }
      ]
    },
  "GEO-TMP-GAP-W10-CP004-INVALID-CONGRUENCE-CRITERION-V1": {
      "question": {
        "sourceMasked": "Which of these does not generally guarantee triangle congruence because the stated angle is not included between the two known sides?",
        "hi": "इनमें से कौन-सी जानकारी सामान्यतः त्रिभुजों की सर्वांगसमता की गारंटी नहीं देती, क्योंकि दिया गया कोण ज्ञात दो भुजाओं के बीच का कोण नहीं है?",
        "pa": "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਜਾਣਕਾਰੀ ਆਮ ਤੌਰ ਤੇ ਤਿਕੋਣਾਂ ਦੀ ਸਰਵਾਂਗਸਮਤਾ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ ਦਿੰਦੀ, ਕਿਉਂਕਿ ਦਿੱਤਾ ਕੋਣ ਜਾਣੀਆਂ ਦੋ ਭੁਜਾਵਾਂ ਦੇ ਵਿਚਕਾਰਲਾ ਕੋਣ ਨਹੀਂ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "SSA uses a non-included angle with two sides.",
          "hi": "SSA में दो भुजाओं के साथ ऐसा कोण दिया जाता है जो उनके बीच का कोण नहीं होता।",
          "pa": "SSA ਵਿੱਚ ਦੋ ਭੁਜਾਵਾਂ ਦੇ ਨਾਲ ਉਹ ਕੋਣ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ ਜੋ ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰਲਾ ਕੋਣ ਨਹੀਂ ਹੁੰਦਾ।"
        },
        {
          "sourceMasked": "In the general ambiguous case, that data can produce more than one triangle, so SSA is not a general congruence criterion.",
          "hi": "सामान्य अस्पष्ट स्थिति में ऐसी जानकारी से एक से अधिक त्रिभुज बन सकते हैं, इसलिए SSA सामान्य सर्वांगसमता कसौटी नहीं है।",
          "pa": "ਆਮ ਅਸਪਸ਼ਟ ਸਥਿਤੀ ਵਿੱਚ ਇਸ ਜਾਣਕਾਰੀ ਨਾਲ ਇੱਕ ਤੋਂ ਵੱਧ ਤਿਕੋਣ ਬਣ ਸਕਦੇ ਹਨ, ਇਸ ਲਈ SSA ਆਮ ਸਰਵਾਂਗਸਮਤਾ ਕਸੌਟੀ ਨਹੀਂ ਹੈ।"
        }
      ]
    },
  "GEO-TMP-GAP-W10-CP004-CONGRUENCE-EVIDENCE-SUFFICIENCY-V1": {
      "question": {
        "sourceMasked": "Triangles ABC and PQR have AB = PQ = {{0}} cm and BC = QR = {{1}} cm. Both triangles have perimeter {{2}} cm. Is this information sufficient to prove the triangles congruent?",
        "hi": "त्रिभुज ABC और PQR में AB = PQ = {{0}} cm तथा BC = QR = {{1}} cm है। दोनों त्रिभुजों का परिमाप {{2}} cm है। क्या यह जानकारी त्रिभुजों को सर्वांगसम सिद्ध करने के लिए पर्याप्त है?",
        "pa": "ਤਿਕੋਣ ABC ਅਤੇ PQR ਵਿੱਚ AB = PQ = {{0}} cm ਅਤੇ BC = QR = {{1}} cm ਹੈ। ਦੋਵੇਂ ਤਿਕੋਣਾਂ ਦਾ ਪਰਿਮਾਪ {{2}} cm ਹੈ। ਕੀ ਇਹ ਜਾਣਕਾਰੀ ਤਿਕੋਣਾਂ ਨੂੰ ਸਰਵਾਂਗਸਮ ਸਾਬਤ ਕਰਨ ਲਈ ਕਾਫ਼ੀ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "Each remaining side is {{0}} − {{1}} − {{2}} = {{3}} cm.",
          "hi": "प्रत्येक त्रिभुज की शेष भुजा = {{0}} − {{1}} − {{2}} = {{3}} cm।",
          "pa": "ਹਰ ਤਿਕੋਣ ਦੀ ਬਾਕੀ ਭੁਜਾ = {{0}} − {{1}} − {{2}} = {{3}} cm।"
        },
        {
          "sourceMasked": "So the third corresponding sides are also equal. All three side pairs match, hence SSS proves congruence.",
          "hi": "इसलिए तीसरी संगत भुजाएँ भी बराबर हैं। तीनों भुजा-युग्म बराबर होने से SSS सर्वांगसमता सिद्ध करता है।",
          "pa": "ਇਸ ਲਈ ਤੀਜੀਆਂ ਸੰਗਤ ਭੁਜਾਵਾਂ ਵੀ ਬਰਾਬਰ ਹਨ। ਤਿੰਨੇ ਭੁਜਾ-ਜੋੜੇ ਬਰਾਬਰ ਹੋਣ ਕਰਕੇ SSS ਸਰਵਾਂਗਸਮਤਾ ਸਾਬਤ ਕਰਦਾ ਹੈ।"
        }
      ]
    }
}
) as Readonly<Record<string, GeometryPrototypeEditorialTemplateV2>>;
