import type { GeometryPrototypeEditorialTemplateV2 } from "./geometry-localization-editorial-v2-types";

export const GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C1 = Object.freeze(
{
  "GEO-TMP-CP009-EXTERIOR-FROM-N-V1": {
      "question": {
        "sourceMasked": "What is each exterior angle of a regular {{0}}-sided polygon?",
        "hi": "एक नियमित {{0}}-भुजी बहुभुज का प्रत्येक बाह्य कोण कितना है?",
        "pa": "ਇੱਕ ਨਿਯਮਿਤ {{0}}-ਭੁਜੀ ਬਹੁਭੁਜ ਦਾ ਹਰ ਬਾਹਰੀ ਕੋਣ ਕਿੰਨਾ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "One exterior angle at each vertex adds to {{0}}°. In a regular polygon those exterior angles are equal.",
          "hi": "प्रत्येक शीर्ष पर लिया गया एक बाह्य कोण मिलकर {{0}}° बनाता है। नियमित बहुभुज में ये सभी बाह्य कोण बराबर होते हैं।",
          "pa": "ਹਰ ਸਿਰੇ ਉੱਤੇ ਲਿਆ ਇੱਕ ਬਾਹਰੀ ਕੋਣ ਮਿਲ ਕੇ {{0}}° ਬਣਾਉਂਦਾ ਹੈ। ਨਿਯਮਿਤ ਬਹੁਭੁਜ ਵਿੱਚ ਇਹ ਸਾਰੇ ਬਾਹਰੀ ਕੋਣ ਬਰਾਬਰ ਹੁੰਦੇ ਹਨ।"
        },
        {
          "sourceMasked": "So each exterior angle is {{0}}°/{{1}} = {{2}}°.",
          "hi": "इसलिए प्रत्येक बाह्य कोण = {{0}}°/{{1}} = {{2}}°।",
          "pa": "ਇਸ ਲਈ ਹਰ ਬਾਹਰੀ ਕੋਣ = {{0}}°/{{1}} = {{2}}°।"
        }
      ]
    },
  "GEO-TMP-CP009-N-FROM-EXTERIOR-V1": {
      "question": {
        "sourceMasked": "Each exterior angle of a regular polygon is {{0}}°. How many sides does the polygon have?",
        "hi": "एक नियमित बहुभुज का प्रत्येक बाह्य कोण {{0}}° है। बहुभुज की कितनी भुजाएँ हैं?",
        "pa": "ਇੱਕ ਨਿਯਮਿਤ ਬਹੁਭੁਜ ਦਾ ਹਰ ਬਾਹਰੀ ਕੋਣ {{0}}° ਹੈ। ਬਹੁਭੁਜ ਦੀਆਂ ਕਿੰਨੀਆਂ ਭੁਜਾਵਾਂ ਹਨ?"
      },
      "explanations": [
        {
          "sourceMasked": "The equal exterior angles of a regular polygon add to {{0}}°.",
          "hi": "नियमित बहुभुज के बराबर बाह्य कोणों का कुल योग {{0}}° होता है।",
          "pa": "ਨਿਯਮਿਤ ਬਹੁਭੁਜ ਦੇ ਬਰਾਬਰ ਬਾਹਰੀ ਕੋਣਾਂ ਦਾ ਕੁੱਲ ਜੋੜ {{0}}° ਹੁੰਦਾ ਹੈ।"
        },
        {
          "sourceMasked": "Hence the number of sides is {{0}}°/{{1}}° = {{2}}.",
          "hi": "अतः भुजाओं की संख्या = {{0}}°/{{1}}° = {{2}}।",
          "pa": "ਇਸ ਲਈ ਭੁਜਾਵਾਂ ਦੀ ਗਿਣਤੀ = {{0}}°/{{1}}° = {{2}}।"
        }
      ]
    },
  "GEO-TMP-CP009-N-FROM-INTERIOR-V1": {
      "question": {
        "sourceMasked": "Each interior angle of a regular polygon is {{0}}°. How many sides does the polygon have?",
        "hi": "एक नियमित बहुभुज का प्रत्येक अंतः कोण {{0}}° है। बहुभुज की कितनी भुजाएँ हैं?",
        "pa": "ਇੱਕ ਨਿਯਮਿਤ ਬਹੁਭੁਜ ਦਾ ਹਰ ਅੰਦਰੂਨੀ ਕੋਣ {{0}}° ਹੈ। ਬਹੁਭੁਜ ਦੀਆਂ ਕਿੰਨੀਆਂ ਭੁਜਾਵਾਂ ਹਨ?"
      },
      "explanations": [
        {
          "sourceMasked": "The corresponding exterior angle is {{0}}° − {{1}}° = {{2}}°.",
          "hi": "संगत बाह्य कोण = {{0}}° − {{1}}° = {{2}}°।",
          "pa": "ਸੰਗਤ ਬਾਹਰੀ ਕੋਣ = {{0}}° − {{1}}° = {{2}}°।"
        },
        {
          "sourceMasked": "The equal exterior angles total {{0}}°, so n = {{1}}°/{{2}}° = {{3}}.",
          "hi": "सभी बराबर बाह्य कोणों का कुल योग {{0}}° है, इसलिए n = {{1}}°/{{2}}° = {{3}}।",
          "pa": "ਸਾਰੇ ਬਰਾਬਰ ਬਾਹਰੀ ਕੋਣਾਂ ਦਾ ਕੁੱਲ ਜੋੜ {{0}}° ਹੈ, ਇਸ ਲਈ n = {{1}}°/{{2}}° = {{3}}।"
        }
      ]
    },
  "GEO-TMP-CP009-DIAGONAL-COUNT-V1": {
      "question": {
        "sourceMasked": "How many diagonals does a {{0}}-sided polygon have?",
        "hi": "एक {{0}}-भुजी बहुभुज में कितने विकर्ण होते हैं?",
        "pa": "ਇੱਕ {{0}}-ਭੁਜੀ ਬਹੁਭੁਜ ਵਿੱਚ ਕਿੰਨੇ ਵਿਕਰਣ ਹੁੰਦੇ ਹਨ?"
      },
      "explanations": [
        {
          "sourceMasked": "From each vertex, diagonals join the n−{{0}} non-adjacent vertices; dividing by {{1}} avoids double counting.",
          "hi": "हर शीर्ष से n−{{0}} गैर-सन्निकट शीर्षों तक विकर्ण जाते हैं; {{1}} से भाग देने पर दोहरी गिनती हटती है।",
          "pa": "ਹਰ ਸਿਰੇ ਤੋਂ n−{{0}} ਗੈਰ-ਲੱਗਦੇ ਸਿਰਿਆਂ ਤੱਕ ਵਿਕਰਣ ਜਾਂਦੇ ਹਨ; {{1}} ਨਾਲ ਭਾਗ ਦੇਣ ਨਾਲ ਦੋਹਰੀ ਗਿਣਤੀ ਹਟਦੀ ਹੈ।"
        },
        {
          "sourceMasked": "For n = {{0}}, the count is {{1}}({{2}}−{{3}})/{{4}} = {{5}}.",
          "hi": "n = {{0}} के लिए विकर्णों की संख्या = {{1}}({{2}}−{{3}})/{{4}} = {{5}}।",
          "pa": "n = {{0}} ਲਈ ਵਿਕਰਣਾਂ ਦੀ ਗਿਣਤੀ = {{1}}({{2}}−{{3}})/{{4}} = {{5}}।"
        }
      ]
    },
  "GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-TO-SIDES-V1": {
      "question": {
        "sourceMasked": "A polygon has a total interior-angle sum of {{0}}°. Find its number of sides.",
        "hi": "एक बहुभुज के अंतः कोणों का कुल योग {{0}}° है। उसकी भुजाओं की संख्या ज्ञात कीजिए।",
        "pa": "ਇੱਕ ਬਹੁਭੁਜ ਦੇ ਅੰਦਰੂਨੀ ਕੋਣਾਂ ਦਾ ਕੁੱਲ ਜੋੜ {{0}}° ਹੈ। ਉਸ ਦੀਆਂ ਭੁਜਾਵਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "Use the polygon interior-sum relation (n − {{0}}) × {{1}}°.",
          "hi": "बहुभुज के अंतः कोण-योग का सूत्र (n − {{0}}) × {{1}}° है।",
          "pa": "ਬਹੁਭੁਜ ਦੇ ਅੰਦਰੂਨੀ ਕੋਣ-ਜੋੜ ਦਾ ਸੂਤਰ (n − {{0}}) × {{1}}° ਹੈ।"
        },
        {
          "sourceMasked": "{{0}}° ÷ {{1}}° = {{2}}, so n − {{3}} = {{4}}.",
          "hi": "{{0}}° ÷ {{1}}° = {{2}}, इसलिए n − {{3}} = {{4}}।",
          "pa": "{{0}}° ÷ {{1}}° = {{2}}, ਇਸ ਲਈ n − {{3}} = {{4}}।"
        },
        {
          "sourceMasked": "Hence the polygon has n = {{0}} sides.",
          "hi": "अतः बहुभुज में n = {{0}} भुजाएँ हैं।",
          "pa": "ਇਸ ਲਈ ਬਹੁਭੁਜ ਵਿੱਚ n = {{0}} ਭੁਜਾਵਾਂ ਹਨ।"
        }
      ]
    },
  "GEO-TMP-GAP-W8-CP009-EXTERIOR-SUM-INVARIANT-V1": {
      "question": {
        "sourceMasked": "For a convex octagon, one exterior angle is taken at every vertex in a consistent direction. Find the sum of those exterior angles.",
        "hi": "एक उत्तल अष्टभुज के प्रत्येक शीर्ष पर एक ही दिशा में एक बाह्य कोण लिया गया है। इन बाह्य कोणों का योग ज्ञात कीजिए।",
        "pa": "ਇੱਕ ਉੱਤਲ ਅੱਠਭੁਜ ਦੇ ਹਰ ਸਿਰੇ ਉੱਤੇ ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਇੱਕ ਬਾਹਰੀ ਕੋਣ ਲਿਆ ਗਿਆ ਹੈ। ਇਨ੍ਹਾਂ ਬਾਹਰੀ ਕੋਣਾਂ ਦਾ ਜੋੜ ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "At each vertex of the convex octagon, the interior angle and the chosen exterior angle form a {{0}}° linear pair.",
          "hi": "उत्तल अष्टभुज के प्रत्येक शीर्ष पर अंतः कोण और चुना गया बाह्य कोण {{0}}° का रेखीय युग्म बनाते हैं।",
          "pa": "ਉੱਤਲ ਅੱਠਭੁਜ ਦੇ ਹਰ ਸਿਰੇ ਉੱਤੇ ਅੰਦਰੂਨੀ ਕੋਣ ਅਤੇ ਚੁਣਿਆ ਬਾਹਰੀ ਕੋਣ {{0}}° ਦਾ ਰੇਖੀ ਜੋੜਾ ਬਣਾਉਂਦੇ ਹਨ।"
        },
        {
          "sourceMasked": "Across {{0}} vertices those linear pairs total {{1}}°, while the interior angles total ({{2}} − {{3}}) × {{4}}° = {{5}}°.",
          "hi": "{{0}} शीर्षों पर इन रेखीय युग्मों का कुल योग {{1}}° है, जबकि अंतः कोणों का योग ({{2}} − {{3}}) × {{4}}° = {{5}}° है।",
          "pa": "{{0}} ਸਿਰਿਆਂ ਉੱਤੇ ਇਨ੍ਹਾਂ ਰੇਖੀ ਜੋੜਿਆਂ ਦਾ ਕੁੱਲ ਜੋੜ {{1}}° ਹੈ, ਜਦਕਿ ਅੰਦਰੂਨੀ ਕੋਣਾਂ ਦਾ ਜੋੜ ({{2}} − {{3}}) × {{4}}° = {{5}}° ਹੈ।"
        },
        {
          "sourceMasked": "The exterior-angle total is therefore {{0}}° − {{1}}° = {{2}}°.",
          "hi": "इसलिए बाह्य कोणों का कुल योग = {{0}}° − {{1}}° = {{2}}°।",
          "pa": "ਇਸ ਲਈ ਬਾਹਰੀ ਕੋਣਾਂ ਦਾ ਕੁੱਲ ਜੋੜ = {{0}}° − {{1}}° = {{2}}°।"
        }
      ]
    },
  "GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-ANGLE-DIFFERENCE-V1": {
      "question": {
        "sourceMasked": "A regular polygon has interior-angle sum {{0}}°. What is the numerical difference between each interior angle and each exterior angle?",
        "hi": "एक नियमित बहुभुज के अंतः कोणों का योग {{0}}° है। उसके प्रत्येक अंतः कोण और बाह्य कोण के बीच संख्यात्मक अंतर कितना है?",
        "pa": "ਇੱਕ ਨਿਯਮਿਤ ਬਹੁਭੁਜ ਦੇ ਅੰਦਰੂਨੀ ਕੋਣਾਂ ਦਾ ਜੋੜ {{0}}° ਹੈ। ਉਸਦੇ ਹਰ ਅੰਦਰੂਨੀ ਕੋਣ ਅਤੇ ਬਾਹਰੀ ਕੋਣ ਵਿਚਕਾਰ ਸੰਖਿਆਤਮਕ ਅੰਤਰ ਕਿੰਨਾ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "From ({{0}} − {{1}}) × {{2}}° = {{3}}°, the polygon has {{4}} sides.",
          "hi": "({{0}} − {{1}}) × {{2}}° = {{3}}° से बहुभुज की {{4}} भुजाएँ मिलती हैं।",
          "pa": "({{0}} − {{1}}) × {{2}}° = {{3}}° ਤੋਂ ਬਹੁਭੁਜ ਦੀਆਂ {{4}} ਭੁਜਾਵਾਂ ਮਿਲਦੀਆਂ ਹਨ।"
        },
        {
          "sourceMasked": "Each exterior angle is {{0}}° ÷ {{1}} = {{2}}°, so the corresponding interior angle is {{3}}° − {{4}}° = {{5}}°.",
          "hi": "प्रत्येक बाह्य कोण = {{0}}° ÷ {{1}} = {{2}}°, इसलिए संगत अंतः कोण = {{3}}° − {{4}}° = {{5}}°।",
          "pa": "ਹਰ ਬਾਹਰੀ ਕੋਣ = {{0}}° ÷ {{1}} = {{2}}°, ਇਸ ਲਈ ਸੰਗਤ ਅੰਦਰੂਨੀ ਕੋਣ = {{3}}° − {{4}}° = {{5}}°।"
        },
        {
          "sourceMasked": "The requested difference is {{0}}° − {{1}}° = {{2}}°.",
          "hi": "माँगा गया अंतर = {{0}}° − {{1}}° = {{2}}°।",
          "pa": "ਮੰਗਿਆ ਗਿਆ ਅੰਤਰ = {{0}}° − {{1}}° = {{2}}°।"
        }
      ]
    },
  "GEO-TMP-CP010-CENTRE-PERP-CHORD-V1": {
      "question": {
        "sourceMasked": "In a circle with centre O, AB is a chord. OM is perpendicular to AB at M. If AB = {{0}} cm, find AM.",
        "hi": "केंद्र O वाले वृत्त में AB एक जीवा है। OM, M पर AB पर लंब है। यदि AB = {{0}} cm है, तो AM ज्ञात कीजिए।",
        "pa": "ਕੇਂਦਰ O ਵਾਲੇ ਵਰਤੁਲ ਵਿੱਚ AB ਇੱਕ ਜੀਵਾ ਹੈ। OM, M ਉੱਤੇ AB ਉੱਤੇ ਲੰਬ ਹੈ। ਜੇ AB = {{0}} cm ਹੈ, ਤਾਂ AM ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "A perpendicular drawn from the centre of a circle to a chord bisects that chord.",
          "hi": "वृत्त के केंद्र से जीवा पर खींचा गया लंब उस जीवा को समद्विभाजित करता है।",
          "pa": "ਵਰਤੁਲ ਦੇ ਕੇਂਦਰ ਤੋਂ ਜੀਵਾ ਉੱਤੇ ਖਿੱਚਿਆ ਲੰਬ ਉਸ ਜੀਵਾ ਨੂੰ ਅੱਧਾ ਕਰਦਾ ਹੈ।"
        },
        {
          "sourceMasked": "So M is the midpoint of AB, and AM = {{0}}/{{1}} = {{2}} cm.",
          "hi": "इसलिए M, AB का मध्यबिंदु है और AM = {{0}}/{{1}} = {{2}} cm।",
          "pa": "ਇਸ ਲਈ M, AB ਦਾ ਮੱਧਬਿੰਦੂ ਹੈ ਅਤੇ AM = {{0}}/{{1}} = {{2}} cm।"
        }
      ]
    },
  "GEO-TMP-CP010-EQUAL-CENTRE-DISTANCE-CHORD-V1": {
      "question": {
        "sourceMasked": "AB and CD are chords of the same circle with centre O. Their perpendicular distances from O are equal. If AB = {{0}} cm, find CD.",
        "hi": "AB और CD, केंद्र O वाले उसी वृत्त की जीवाएँ हैं। O से उनकी लंबवत दूरियाँ बराबर हैं। यदि AB = {{0}} cm है, तो CD ज्ञात कीजिए।",
        "pa": "AB ਅਤੇ CD, ਕੇਂਦਰ O ਵਾਲੇ ਉਸੇ ਵਰਤੁਲ ਦੀਆਂ ਜੀਵਾਵਾਂ ਹਨ। O ਤੋਂ ਉਨ੍ਹਾਂ ਦੀਆਂ ਲੰਬ ਦੂਰੀਆਂ ਬਰਾਬਰ ਹਨ। ਜੇ AB = {{0}} cm ਹੈ, ਤਾਂ CD ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "Chords of the same circle that are equally distant from the centre are equal in length.",
          "hi": "एक ही वृत्त में केंद्र से समान दूरी पर स्थित जीवाओं की लंबाइयाँ बराबर होती हैं।",
          "pa": "ਇੱਕੋ ਵਰਤੁਲ ਵਿੱਚ ਕੇਂਦਰ ਤੋਂ ਬਰਾਬਰ ਦੂਰੀ ਉੱਤੇ ਸਥਿਤ ਜੀਵਾਵਾਂ ਦੀਆਂ ਲੰਬਾਈਆਂ ਬਰਾਬਰ ਹੁੰਦੀਆਂ ਹਨ।"
        },
        {
          "sourceMasked": "Since AB and CD are at equal perpendicular distances from O, CD = AB = {{0}} cm.",
          "hi": "AB और CD, O से समान लंबवत दूरी पर हैं, इसलिए CD = AB = {{0}} cm।",
          "pa": "AB ਅਤੇ CD, O ਤੋਂ ਬਰਾਬਰ ਲੰਬ ਦੂਰੀ ਉੱਤੇ ਹਨ, ਇਸ ਲਈ CD = AB = {{0}} cm।"
        }
      ]
    },
  "GEO-TMP-GAP-W7-CP010-EQUAL-CHORD-CENTRAL-ANGLE-V1": {
      "question": {
        "sourceMasked": "Equal chords AB and CD lie in a circle centred at O. The angle subtended by AB at O is {{0}}°. What is ∠COD?",
        "hi": "बराबर जीवाएँ AB और CD, केंद्र O वाले एक वृत्त में हैं। AB द्वारा O पर बना कोण {{0}}° है। ∠COD कितना है?",
        "pa": "ਬਰਾਬਰ ਜੀਵਾਵਾਂ AB ਅਤੇ CD, ਕੇਂਦਰ O ਵਾਲੇ ਇੱਕ ਵਰਤੁਲ ਵਿੱਚ ਹਨ। AB ਵੱਲੋਂ O ਉੱਤੇ ਬਣਿਆ ਕੋਣ {{0}}° ਹੈ। ∠COD ਕਿੰਨਾ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "AB and CD are equal chords of the same circle.",
          "hi": "AB और CD एक ही वृत्त की बराबर जीवाएँ हैं।",
          "pa": "AB ਅਤੇ CD ਇੱਕੋ ਵਰਤੁਲ ਦੀਆਂ ਬਰਾਬਰ ਜੀਵਾਵਾਂ ਹਨ।"
        },
        {
          "sourceMasked": "Equal chords subtend equal angles at the centre, so ∠COD = ∠AOB = {{0}}°.",
          "hi": "बराबर जीवाएँ केंद्र पर बराबर कोण बनाती हैं, इसलिए ∠COD = ∠AOB = {{0}}°।",
          "pa": "ਬਰਾਬਰ ਜੀਵਾਵਾਂ ਕੇਂਦਰ ਉੱਤੇ ਬਰਾਬਰ ਕੋਣ ਬਣਾਉਂਦੀਆਂ ਹਨ, ਇਸ ਲਈ ∠COD = ∠AOB = {{0}}°।"
        }
      ]
    }
}
) as Readonly<Record<string, GeometryPrototypeEditorialTemplateV2>>;
