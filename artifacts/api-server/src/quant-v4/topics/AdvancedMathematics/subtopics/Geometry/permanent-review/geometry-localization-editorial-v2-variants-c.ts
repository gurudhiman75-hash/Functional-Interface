import type { GeometryPrototypeEditorialVariantsV2 } from "./geometry-localization-editorial-v2-types";

export const GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2_C = Object.freeze({
  "GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-TO-SIDES-V1": {
    questions: [
      {
        sourceMasked: "The interior angles of a polygon add up to {{0}}°. Determine the number of sides.",
        hi: "एक बहुभुज के अंतः कोणों का योग {{0}}° है। उसकी भुजाओं की संख्या ज्ञात कीजिए।",
        pa: "ਇੱਕ ਬਹੁਭੁਜ ਦੇ ਅੰਦਰੂਨੀ ਕੋਣਾਂ ਦਾ ਜੋੜ {{0}}° ਹੈ। ਉਸ ਦੀਆਂ ਭੁਜਾਵਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "The sum of the interior angles of a polygon is {{0}}°. How many sides does the polygon have?",
        hi: "किसी बहुभुज के अंतः कोणों का कुल योग {{0}}° है। उस बहुभुज की कितनी भुजाएँ हैं?",
        pa: "ਕਿਸੇ ਬਹੁਭੁਜ ਦੇ ਅੰਦਰੂਨੀ ਕੋਣਾਂ ਦਾ ਕੁੱਲ ਜੋੜ {{0}}° ਹੈ। ਉਸ ਬਹੁਭੁਜ ਦੀਆਂ ਕਿੰਨੀਆਂ ਭੁਜਾਵਾਂ ਹਨ?",
      },
    ],
    explanationsByLine: [
      [
        {
          sourceMasked: "An n-sided polygon has interior-angle sum (n − {{0}}) × {{1}}°.",
          hi: "n-भुजी बहुभुज के अंतः कोणों का योग (n − {{0}}) × {{1}}° होता है।",
          pa: "n-ਭੁਜੀ ਬਹੁਭੁਜ ਦੇ ਅੰਦਰੂਨੀ ਕੋਣਾਂ ਦਾ ਜੋੜ (n − {{0}}) × {{1}}° ਹੁੰਦਾ ਹੈ।",
        },
        {
          sourceMasked: "For an n-sided polygon, the interior-angle sum is (n − {{0}}) × {{1}}°.",
          hi: "n-भुजी बहुभुज के लिए अंतः कोण-योग = (n − {{0}}) × {{1}}°।",
          pa: "n-ਭੁਜੀ ਬਹੁਭੁਜ ਲਈ ਅੰਦਰੂਨੀ ਕੋਣ-ਜੋੜ = (n − {{0}}) × {{1}}°।",
        },
      ],
      [
        {
          sourceMasked: "So (n − {{0}}) × {{1}}° = {{2}}°, giving n − {{3}} = {{4}}.",
          hi: "अतः (n − {{0}}) × {{1}}° = {{2}}°, जिससे n − {{3}} = {{4}}।",
          pa: "ਇਸ ਲਈ (n − {{0}}) × {{1}}° = {{2}}°, ਜਿਸ ਤੋਂ n − {{3}} = {{4}}।",
        },
      ],
      [
        {
          sourceMasked: "Thus n = {{0}} sides.",
          hi: "इस प्रकार n = {{0}} भुजाएँ।",
          pa: "ਇਸ ਤਰ੍ਹਾਂ n = {{0}} ਭੁਜਾਵਾਂ।",
        },
        {
          sourceMasked: "Therefore n = {{0}} sides.",
          hi: "अतः n = {{0}} भुजाएँ।",
          pa: "ਇਸ ਲਈ n = {{0}} ਭੁਜਾਵਾਂ।",
        },
      ],
    ],
  },
  "GEO-TMP-GAP-W8-CP009-EXTERIOR-SUM-INVARIANT-V1": {
    questions: [
      {
        sourceMasked: "A convex {{0}}-sided polygon is traversed once, taking the exterior turn at every vertex in the same sense. What is the sum of all these exterior angles?",
        hi: "एक उत्तल {{0}}-भुजी बहुभुज की सीमा पर एक पूरा चक्कर लगाते हुए प्रत्येक शीर्ष पर उसी दिशा का बाह्य मोड़ लिया जाता है। इन सभी बाह्य कोणों का योग कितना है?",
        pa: "ਇੱਕ ਉੱਤਲ {{0}}-ਭੁਜੀ ਬਹੁਭੁਜ ਦੀ ਹੱਦ ਉੱਤੇ ਇੱਕ ਪੂਰਾ ਚੱਕਰ ਲਗਾਉਂਦੇ ਹੋਏ ਹਰ ਸਿਰੇ ਉੱਤੇ ਇੱਕੋ ਦਿਸ਼ਾ ਦਾ ਬਾਹਰੀ ਮੋੜ ਲਿਆ ਜਾਂਦਾ ਹੈ। ਇਨ੍ਹਾਂ ਸਾਰੇ ਬਾਹਰੀ ਕੋਣਾਂ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?",
      },
      {
        sourceMasked: "Take one exterior angle at each vertex of a convex pentagon, all measured in the same turning direction. What is their total?",
        hi: "एक उत्तल पंचभुज के प्रत्येक शीर्ष पर एक बाह्य कोण उसी घूर्णन-दिशा में लिया गया है। इनका कुल योग कितना है?",
        pa: "ਇੱਕ ਉੱਤਲ ਪੰਜਭੁਜ ਦੇ ਹਰ ਸਿਰੇ ਉੱਤੇ ਇੱਕ ਬਾਹਰੀ ਕੋਣ ਇੱਕੋ ਘੁੰਮਣ-ਦਿਸ਼ਾ ਵਿੱਚ ਲਿਆ ਗਿਆ ਹੈ। ਇਨ੍ਹਾਂ ਦਾ ਕੁੱਲ ਜੋੜ ਕਿੰਨਾ ਹੈ?",
      },
    ],
    explanationsByLine: [
      [
        {
          sourceMasked: "At each vertex of the convex dodecagon, the interior angle and the chosen exterior angle form a {{0}}° linear pair.",
          hi: "उत्तल द्वादशभुज के प्रत्येक शीर्ष पर अंतः कोण और चुना गया बाह्य कोण {{0}}° का रेखीय युग्म बनाते हैं।",
          pa: "ਉੱਤਲ ਬਾਰਾਂ-ਭੁਜੀ ਬਹੁਭੁਜ ਦੇ ਹਰ ਸਿਰੇ ਉੱਤੇ ਅੰਦਰੂਨੀ ਕੋਣ ਅਤੇ ਚੁਣਿਆ ਬਾਹਰੀ ਕੋਣ {{0}}° ਦਾ ਰੇਖੀ ਜੋੜਾ ਬਣਾਉਂਦੇ ਹਨ।",
        },
        {
          sourceMasked: "At each vertex of the convex pentagon, the interior angle and the chosen exterior angle form a {{0}}° linear pair.",
          hi: "उत्तल पंचभुज के प्रत्येक शीर्ष पर अंतः कोण और चुना गया बाह्य कोण {{0}}° का रेखीय युग्म बनाते हैं।",
          pa: "ਉੱਤਲ ਪੰਜਭੁਜ ਦੇ ਹਰ ਸਿਰੇ ਉੱਤੇ ਅੰਦਰੂਨੀ ਕੋਣ ਅਤੇ ਚੁਣਿਆ ਬਾਹਰੀ ਕੋਣ {{0}}° ਦਾ ਰੇਖੀ ਜੋੜਾ ਬਣਾਉਂਦੇ ਹਨ।",
        },
      ],
    ],
  },
  "GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-ANGLE-DIFFERENCE-V1": {
    questions: [
      {
        sourceMasked: "The sum of the interior angles of a regular polygon is {{0}}°. Find the difference between one interior angle and its corresponding exterior angle.",
        hi: "एक नियमित बहुभुज के अंतः कोणों का योग {{0}}° है। एक अंतः कोण और उसके संगत बाह्य कोण का अंतर ज्ञात कीजिए।",
        pa: "ਇੱਕ ਨਿਯਮਿਤ ਬਹੁਭੁਜ ਦੇ ਅੰਦਰੂਨੀ ਕੋਣਾਂ ਦਾ ਜੋੜ {{0}}° ਹੈ। ਇੱਕ ਅੰਦਰੂਨੀ ਕੋਣ ਅਤੇ ਉਸਦੇ ਸੰਗਤ ਬਾਹਰੀ ਕੋਣ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "The interior angles of a regular polygon total {{0}}°. Determine how much larger one interior angle is than its adjacent exterior angle.",
        hi: "एक नियमित बहुभुज के अंतः कोणों का कुल योग {{0}}° है। एक अंतः कोण अपने सन्निकट बाह्य कोण से कितना बड़ा है?",
        pa: "ਇੱਕ ਨਿਯਮਿਤ ਬਹੁਭੁਜ ਦੇ ਅੰਦਰੂਨੀ ਕੋਣਾਂ ਦਾ ਕੁੱਲ ਜੋੜ {{0}}° ਹੈ। ਇੱਕ ਅੰਦਰੂਨੀ ਕੋਣ ਆਪਣੇ ਨਾਲ ਲੱਗਦੇ ਬਾਹਰੀ ਕੋਣ ਤੋਂ ਕਿੰਨਾ ਵੱਡਾ ਹੈ?",
      },
    ],
  },
  "GEO-TMP-GAP-W7-CP010-EQUAL-CHORD-CENTRAL-ANGLE-V1": {
    questions: [
      {
        sourceMasked: "In the same circle with centre O, chords AB and CD are equal. If ∠AOB = {{0}}°, find ∠COD.",
        hi: "केंद्र O वाले उसी वृत्त में जीवाएँ AB और CD बराबर हैं। यदि ∠AOB = {{0}}° है, तो ∠COD ज्ञात कीजिए।",
        pa: "ਕੇਂਦਰ O ਵਾਲੇ ਉਸੇ ਵਰਤੁਲ ਵਿੱਚ ਜੀਵਾਵਾਂ AB ਅਤੇ CD ਬਰਾਬਰ ਹਨ। ਜੇ ∠AOB = {{0}}° ਹੈ, ਤਾਂ ∠COD ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "AB = CD in a circle with centre O. Given central angle ∠AOB = {{0}}°, determine the central angle subtended by CD.",
        hi: "केंद्र O वाले वृत्त में AB = CD है। यदि केंद्रीय कोण ∠AOB = {{0}}° है, तो जीवा CD द्वारा केंद्र पर बना कोण ज्ञात कीजिए।",
        pa: "ਕੇਂਦਰ O ਵਾਲੇ ਵਰਤੁਲ ਵਿੱਚ AB = CD ਹੈ। ਜੇ ਕੇਂਦਰੀ ਕੋਣ ∠AOB = {{0}}° ਹੈ, ਤਾਂ ਜੀਵਾ CD ਵੱਲੋਂ ਕੇਂਦਰ ਉੱਤੇ ਬਣਿਆ ਕੋਣ ਪਤਾ ਕਰੋ।",
      },
    ],
  },
  "GEO-TMP-GAP-W7-CP010-EQUAL-CHORD-CENTRE-DISTANCE-V1": {
    questions: [
      {
        sourceMasked: "In one circle, AB = CD. Their perpendicular distances from centre O are OM and ON. Given OM = {{0}} cm, determine ON.",
        hi: "एक ही वृत्त में AB = CD है। केंद्र O से उनकी लंबवत दूरियाँ क्रमशः OM और ON हैं। यदि OM = {{0}} cm है, तो ON ज्ञात कीजिए।",
        pa: "ਇੱਕੋ ਵਰਤੁਲ ਵਿੱਚ AB = CD ਹੈ। ਕੇਂਦਰ O ਤੋਂ ਉਨ੍ਹਾਂ ਦੀਆਂ ਲੰਬ ਦੂਰੀਆਂ ਕ੍ਰਮਵਾਰ OM ਅਤੇ ON ਹਨ। ਜੇ OM = {{0}} cm ਹੈ, ਤਾਂ ON ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "AB and CD are equal chords of a circle with centre O. OM and ON are perpendicular to AB and CD. If OM = {{0}} cm, find ON.",
        hi: "AB और CD, केंद्र O वाले वृत्त की बराबर जीवाएँ हैं। OM और ON क्रमशः AB और CD पर लंब हैं। यदि OM = {{0}} cm है, तो ON ज्ञात कीजिए।",
        pa: "AB ਅਤੇ CD, ਕੇਂਦਰ O ਵਾਲੇ ਵਰਤੁਲ ਦੀਆਂ ਬਰਾਬਰ ਜੀਵਾਵਾਂ ਹਨ। OM ਅਤੇ ON ਕ੍ਰਮਵਾਰ AB ਅਤੇ CD ਉੱਤੇ ਲੰਬ ਹਨ। ਜੇ OM = {{0}} cm ਹੈ, ਤਾਂ ON ਪਤਾ ਕਰੋ।",
      },
    ],
  },
  "GEO-TMP-GAP-W7-CP010-CENTRE-BISECTOR-PERPENDICULAR-V1": {
    questions: [
      {
        sourceMasked: "In a circle centred at O, PR = RQ on chord PQ. If OR is drawn, determine ∠ORP.",
        hi: "केंद्र O वाले वृत्त में जीवा PQ पर PR = RQ है। यदि OR खींचा जाए, तो ∠ORP ज्ञात कीजिए।",
        pa: "ਕੇਂਦਰ O ਵਾਲੇ ਵਰਤੁਲ ਵਿੱਚ ਜੀਵਾ PQ ਉੱਤੇ PR = RQ ਹੈ। ਜੇ OR ਖਿੱਚਿਆ ਜਾਵੇ, ਤਾਂ ∠ORP ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "PQ is a chord of a circle with centre O. R is the midpoint of PQ and OR is joined. Find ∠ORP.",
        hi: "PQ, केंद्र O वाले वृत्त की एक जीवा है। R, PQ का मध्यबिंदु है और OR जोड़ा गया है। ∠ORP ज्ञात कीजिए।",
        pa: "PQ, ਕੇਂਦਰ O ਵਾਲੇ ਵਰਤੁਲ ਦੀ ਇੱਕ ਜੀਵਾ ਹੈ। R, PQ ਦਾ ਮੱਧਬਿੰਦੂ ਹੈ ਅਤੇ OR ਜੋੜਿਆ ਗਿਆ ਹੈ। ∠ORP ਪਤਾ ਕਰੋ।",
      },
    ],
  },
  "GEO-TMP-GAP-W7-CP011-SAME-SEGMENT-ANGLE-V1": {
    questions: [
      {
        sourceMasked: "P and S lie in the same segment of a circle on chord RQ. If ∠RPQ = {{0}}°, find ∠RSQ.",
        hi: "P और S, जीवा RQ के एक ही खंड में स्थित हैं। यदि ∠RPQ = {{0}}° है, तो ∠RSQ ज्ञात कीजिए।",
        pa: "P ਅਤੇ S, ਜੀਵਾ RQ ਦੇ ਇੱਕੋ ਖੰਡ ਵਿੱਚ ਸਥਿਤ ਹਨ। ਜੇ ∠RPQ = {{0}}° ਹੈ, ਤਾਂ ∠RSQ ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "In one circle, P and S are on the same side of chord RQ. If chord RQ subtends {{0}}° at P, what angle does it subtend at S?",
        hi: "एक ही वृत्त में P और S, जीवा RQ के एक ही ओर हैं। यदि जीवा RQ, P पर {{0}}° का कोण बनाती है, तो S पर कितना कोण बनाएगी?",
        pa: "ਇੱਕੋ ਵਰਤੁਲ ਵਿੱਚ P ਅਤੇ S, ਜੀਵਾ RQ ਦੇ ਇੱਕੋ ਪਾਸੇ ਹਨ। ਜੇ ਜੀਵਾ RQ, P ਉੱਤੇ {{0}}° ਦਾ ਕੋਣ ਬਣਾਉਂਦੀ ਹੈ, ਤਾਂ S ਉੱਤੇ ਕਿੰਨਾ ਕੋਣ ਬਣਾਏਗੀ?",
      },
    ],
  },
  "GEO-TMP-GAP-W7-CP011-CYCLIC-EXTERIOR-CENTRAL-V1": {
    questions: [
      {
        sourceMasked: "AB is extended through B to an exterior point P. For concyclic A, B, C with centre O, ∠AOC = {{0}}°. What is ∠CBP?",
        hi: "AB को B से आगे बाह्य बिंदु P तक बढ़ाया गया है। केंद्र O वाले वृत्त पर A, B और C स्थित हैं तथा ∠AOC = {{0}}° है। ∠CBP कितना है?",
        pa: "AB ਨੂੰ B ਤੋਂ ਅੱਗੇ ਬਾਹਰੀ ਬਿੰਦੂ P ਤੱਕ ਵਧਾਇਆ ਗਿਆ ਹੈ। ਕੇਂਦਰ O ਵਾਲੇ ਵਰਤੁਲ ਉੱਤੇ A, B ਅਤੇ C ਸਥਿਤ ਹਨ ਅਤੇ ∠AOC = {{0}}° ਹੈ। ∠CBP ਕਿੰਨਾ ਹੈ?",
      },
      {
        sourceMasked: "A, B and C lie on a circle with centre O. AB is produced beyond B to P. If ∠AOC = {{0}}°, find exterior angle ∠CBP.",
        hi: "A, B और C, केंद्र O वाले वृत्त पर स्थित हैं। AB को B से आगे P तक बढ़ाया गया है। यदि ∠AOC = {{0}}° है, तो बाह्य कोण ∠CBP ज्ञात कीजिए।",
        pa: "A, B ਅਤੇ C, ਕੇਂਦਰ O ਵਾਲੇ ਵਰਤੁਲ ਉੱਤੇ ਸਥਿਤ ਹਨ। AB ਨੂੰ B ਤੋਂ ਅੱਗੇ P ਤੱਕ ਵਧਾਇਆ ਗਿਆ ਹੈ। ਜੇ ∠AOC = {{0}}° ਹੈ, ਤਾਂ ਬਾਹਰੀ ਕੋਣ ∠CBP ਪਤਾ ਕਰੋ।",
      },
    ],
  },
  "GEO-TMP-GAP-W7-CP011-SEMICIRCLE-SAME-SEGMENT-CHAIN-V1": {
    questions: [
      {
        sourceMasked: "AB and CD are chords produced to meet at P outside the circle, and AD is a diameter. If ∠APD = {{0}}° and ∠DAP = {{1}}°, find ∠CBD.",
        hi: "जीवाएँ AB और CD बढ़ाने पर वृत्त के बाहर P पर मिलती हैं तथा AD व्यास है। यदि ∠APD = {{0}}° और ∠DAP = {{1}}° हैं, तो ∠CBD ज्ञात कीजिए।",
        pa: "ਜੀਵਾਵਾਂ AB ਅਤੇ CD ਨੂੰ ਵਧਾਉਣ ਤੇ ਉਹ ਵਰਤੁਲ ਤੋਂ ਬਾਹਰ P ਉੱਤੇ ਮਿਲਦੀਆਂ ਹਨ ਅਤੇ AD ਵਿਆਸ ਹੈ। ਜੇ ∠APD = {{0}}° ਅਤੇ ∠DAP = {{1}}° ਹਨ, ਤਾਂ ∠CBD ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "AD is a diameter. Lines ABP and CDP are straight secants meeting at exterior point P. If ∠DAP = {{0}}° and ∠APD = {{1}}°, what is ∠CBD?",
        hi: "AD व्यास है। सीधी छेदक रेखाएँ ABP और CDP बाह्य बिंदु P पर मिलती हैं। यदि ∠DAP = {{0}}° और ∠APD = {{1}}° हैं, तो ∠CBD कितना है?",
        pa: "AD ਵਿਆਸ ਹੈ। ਸਿੱਧੀਆਂ ਛੇਦਕ ਰੇਖਾਵਾਂ ABP ਅਤੇ CDP ਬਾਹਰੀ ਬਿੰਦੂ P ਉੱਤੇ ਮਿਲਦੀਆਂ ਹਨ। ਜੇ ∠DAP = {{0}}° ਅਤੇ ∠APD = {{1}}° ਹਨ, ਤਾਂ ∠CBD ਕਿੰਨਾ ਹੈ?",
      },
    ],
  },
} as const satisfies Readonly<Record<string, GeometryPrototypeEditorialVariantsV2>>);
