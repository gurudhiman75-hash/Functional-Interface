import type { GeometryPrototypeEditorialVariantsV2 } from "./geometry-localization-editorial-v2-types";

export const GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2_B = Object.freeze({
  "GEO-TMP-GAP-W4-CP005-PERIMETER-TO-SIDE-V1": {
    questions: [
      {
        sourceMasked: "Triangles XYZ and PQR are similar, with X ↔ P, Y ↔ Q and Z ↔ R. Their perimeters are {{0}} cm and {{1}} cm. If PQ = {{2}} cm, find XY.",
        hi: "त्रिभुज XYZ और PQR समरूप हैं, जहाँ X ↔ P, Y ↔ Q और Z ↔ R। उनके परिमाप {{0}} cm और {{1}} cm हैं। यदि PQ = {{2}} cm है, तो XY ज्ञात कीजिए।",
        pa: "ਤਿਕੋਣ XYZ ਅਤੇ PQR ਸਮਰੂਪ ਹਨ, ਜਿੱਥੇ X ↔ P, Y ↔ Q ਅਤੇ Z ↔ R। ਉਨ੍ਹਾਂ ਦੇ ਪਰਿਮਾਪ {{0}} cm ਅਤੇ {{1}} cm ਹਨ। ਜੇ PQ = {{2}} cm ਹੈ, ਤਾਂ XY ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "Triangles RST and ABC are similar in corresponding order. Their perimeters are {{0}} cm and {{1}} cm respectively. If AB = {{2}} cm, find RS.",
        hi: "त्रिभुज RST और ABC संगत क्रम में समरूप हैं। उनके परिमाप क्रमशः {{0}} cm और {{1}} cm हैं। यदि AB = {{2}} cm है, तो RS ज्ञात कीजिए।",
        pa: "ਤਿਕੋਣ RST ਅਤੇ ABC ਸੰਗਤ ਕ੍ਰਮ ਵਿੱਚ ਸਮਰੂਪ ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਪਰਿਮਾਪ ਕ੍ਰਮਵਾਰ {{0}} cm ਅਤੇ {{1}} cm ਹਨ। ਜੇ AB = {{2}} cm ਹੈ, ਤਾਂ RS ਪਤਾ ਕਰੋ।",
      },
    ],
    explanationsByLine: [
      [
        {
          sourceMasked: "The perimeter ratio XYZ : PQR is {{0}} : {{1}} = {{2}} : {{3}}.",
          hi: "परिमापों का अनुपात XYZ : PQR = {{0}} : {{1}} = {{2}} : {{3}} है।",
          pa: "ਪਰਿਮਾਪਾਂ ਦਾ ਅਨੁਪਾਤ XYZ : PQR = {{0}} : {{1}} = {{2}} : {{3}} ਹੈ।",
        },
        {
          sourceMasked: "RST and ABC are similar, so their corresponding sides change in the same ratio as their perimeters.",
          hi: "RST और ABC समरूप हैं, इसलिए उनकी संगत भुजाएँ उनके परिमापों के समान अनुपात में बदलती हैं।",
          pa: "RST ਅਤੇ ABC ਸਮਰੂਪ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਗਤ ਭੁਜਾਵਾਂ ਉਨ੍ਹਾਂ ਦੇ ਪਰਿਮਾਪਾਂ ਦੇ ਇੱਕੋ ਅਨੁਪਾਤ ਵਿੱਚ ਬਦਲਦੀਆਂ ਹਨ।",
        },
      ],
      [
        {
          sourceMasked: "Because XY corresponds to PQ, their lengths must follow that same {{0}} : {{1}} scale.",
          hi: "XY का संगत PQ है, इसलिए उनकी लंबाइयाँ भी उसी {{0}} : {{1}} माप-अनुपात का पालन करेंगी।",
          pa: "XY ਦੇ ਸੰਗਤ PQ ਹੈ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੀਆਂ ਲੰਬਾਈਆਂ ਵੀ ਉਸੇ {{0}} : {{1}} ਮਾਪ-ਅਨੁਪਾਤ ਦਾ ਪਾਲਣ ਕਰਨਗੀਆਂ।",
        },
        {
          sourceMasked: "RST has {{0}}/{{1}} of the perimeter of ABC, so RS must be {{2}}/{{3}} of its corresponding side AB.",
          hi: "RST का परिमाप ABC के परिमाप का {{0}}/{{1}} है, इसलिए RS भी अपनी संगत भुजा AB का {{2}}/{{3}} होगा।",
          pa: "RST ਦਾ ਪਰਿਮਾਪ ABC ਦੇ ਪਰਿਮਾਪ ਦਾ {{0}}/{{1}} ਹੈ, ਇਸ ਲਈ RS ਵੀ ਆਪਣੀ ਸੰਗਤ ਭੁਜਾ AB ਦਾ {{2}}/{{3}} ਹੋਵੇਗਾ।",
        },
      ],
      [
        {
          sourceMasked: "Hence XY = {{0}} × {{1}}/{{2}} = {{3}} cm.",
          hi: "अतः XY = {{0}} × {{1}}/{{2}} = {{3}} cm।",
          pa: "ਇਸ ਲਈ XY = {{0}} × {{1}}/{{2}} = {{3}} cm।",
        },
        {
          sourceMasked: "Thus RS = {{0}} × {{1}}/{{2}} = {{3}} cm.",
          hi: "अतः RS = {{0}} × {{1}}/{{2}} = {{3}} cm।",
          pa: "ਇਸ ਲਈ RS = {{0}} × {{1}}/{{2}} = {{3}} cm।",
        },
      ],
    ],
  },
  "GEO-TMP-GAP-W4-CP005-SIDE-TO-PERIMETER-V1": {
    questions: [
      {
        sourceMasked: "Two triangles ABC and PQR are similar, and AB : PQ = {{0}} : {{1}}. The sides of PQR are {{2}} cm, {{3}} cm and {{4}} cm. Find the perimeter of ABC.",
        hi: "त्रिभुज ABC और PQR समरूप हैं तथा AB : PQ = {{0}} : {{1}} है। PQR की भुजाएँ {{2}} cm, {{3}} cm और {{4}} cm हैं। ABC का परिमाप ज्ञात कीजिए।",
        pa: "ਤਿਕੋਣ ABC ਅਤੇ PQR ਸਮਰੂਪ ਹਨ ਅਤੇ AB : PQ = {{0}} : {{1}} ਹੈ। PQR ਦੀਆਂ ਭੁਜਾਵਾਂ {{2}} cm, {{3}} cm ਅਤੇ {{4}} cm ਹਨ। ABC ਦਾ ਪਰਿਮਾਪ ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "Triangles ABC and PQR are similar in corresponding order. AB = {{0}} cm, PQ = {{1}} cm, QR = {{2}} cm and PR = {{3}} cm. Find the perimeter of triangle ABC.",
        hi: "त्रिभुज ABC और PQR संगत क्रम में समरूप हैं। AB = {{0}} cm, PQ = {{1}} cm, QR = {{2}} cm और PR = {{3}} cm हैं। त्रिभुज ABC का परिमाप ज्ञात कीजिए।",
        pa: "ਤਿਕੋਣ ABC ਅਤੇ PQR ਸੰਗਤ ਕ੍ਰਮ ਵਿੱਚ ਸਮਰੂਪ ਹਨ। AB = {{0}} cm, PQ = {{1}} cm, QR = {{2}} cm ਅਤੇ PR = {{3}} cm ਹਨ। ਤਿਕੋਣ ABC ਦਾ ਪਰਿਮਾਪ ਪਤਾ ਕਰੋ।",
      },
    ],
    explanationsByLine: [
      [
        {
          sourceMasked: "The three sides of PQR add to {{0}} + {{1}} + {{2}} = {{3}} cm.",
          hi: "PQR की तीनों भुजाओं का योग {{0}} + {{1}} + {{2}} = {{3}} cm है।",
          pa: "PQR ਦੀਆਂ ਤਿੰਨਾਂ ਭੁਜਾਵਾਂ ਦਾ ਜੋੜ {{0}} + {{1}} + {{2}} = {{3}} cm ਹੈ।",
        },
        {
          sourceMasked: "The perimeter of PQR is {{0}} + {{1}} + {{2}} = {{3}} cm.",
          hi: "PQR का परिमाप = {{0}} + {{1}} + {{2}} = {{3}} cm।",
          pa: "PQR ਦਾ ਪਰਿਮਾਪ = {{0}} + {{1}} + {{2}} = {{3}} cm।",
        },
      ],
      [
        {
          sourceMasked: "AB : PQ = {{0}} : {{1}} = {{2}} : {{3}}, so ABC is two-thirds the linear size of PQR.",
          hi: "AB : PQ = {{0}} : {{1}} = {{2}} : {{3}}, इसलिए ABC की प्रत्येक रैखिक माप PQR की दो-तिहाई है।",
          pa: "AB : PQ = {{0}} : {{1}} = {{2}} : {{3}}, ਇਸ ਲਈ ABC ਦੀ ਹਰ ਰੇਖੀ ਮਾਪ PQR ਦੀ ਦੋ-ਤਿਹਾਈ ਹੈ।",
        },
        {
          sourceMasked: "AB : PQ = {{0}} : {{1}} = {{2}} : {{3}}, so every length in ABC—including its whole perimeter—is {{4}}/{{5}} of the corresponding measure in PQR.",
          hi: "AB : PQ = {{0}} : {{1}} = {{2}} : {{3}}, इसलिए ABC की हर लंबाई—उसके पूरे परिमाप सहित—PQR की संगत माप का {{4}}/{{5}} है।",
          pa: "AB : PQ = {{0}} : {{1}} = {{2}} : {{3}}, ਇਸ ਲਈ ABC ਦੀ ਹਰ ਲੰਬਾਈ—ਉਸਦੇ ਪੂਰੇ ਪਰਿਮਾਪ ਸਮੇਤ—PQR ਦੀ ਸੰਗਤ ਮਾਪ ਦਾ {{4}}/{{5}} ਹੈ।",
        },
      ],
      [
        {
          sourceMasked: "Its perimeter is therefore two-thirds of {{0}} cm, which is {{1}} cm.",
          hi: "इसलिए उसका परिमाप {{0}} cm का दो-तिहाई, अर्थात {{1}} cm है।",
          pa: "ਇਸ ਲਈ ਉਸਦਾ ਪਰਿਮਾਪ {{0}} cm ਦਾ ਦੋ-ਤਿਹਾਈ, ਅਰਥਾਤ {{1}} cm ਹੈ।",
        },
        {
          sourceMasked: "Therefore the perimeter of ABC is {{0}} × {{1}}/{{2}} = {{3}} cm.",
          hi: "अतः ABC का परिमाप = {{0}} × {{1}}/{{2}} = {{3}} cm।",
          pa: "ਇਸ ਲਈ ABC ਦਾ ਪਰਿਮਾਪ = {{0}} × {{1}}/{{2}} = {{3}} cm।",
        },
      ],
    ],
  },
  "GEO-TMP-GAP-W6-CP006-CENTROID-INVERSE-MEDIAN-V1": {
    questions: [
      {
        sourceMasked: "G is the centroid of triangle ABC and lies on median AD. If the vertex-to-centroid part AG measures {{0}} cm, calculate the complete median AD.",
        hi: "G, त्रिभुज ABC का केन्द्रक है और माध्यिका AD पर स्थित है। यदि शीर्ष से केन्द्रक तक AG = {{0}} cm है, तो पूरी माध्यिका AD की लंबाई ज्ञात कीजिए।",
        pa: "G, ਤਿਕੋਣ ABC ਦਾ ਕੇਂਦਰਕ ਹੈ ਅਤੇ ਮੱਧਿਕਾ AD ਉੱਤੇ ਸਥਿਤ ਹੈ। ਜੇ ਸਿਰੇ ਤੋਂ ਕੇਂਦਰਕ ਤੱਕ AG = {{0}} cm ਹੈ, ਤਾਂ ਪੂਰੀ ਮੱਧਿਕਾ AD ਦੀ ਲੰਬਾਈ ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "AD is a median of triangle ABC and G is the centroid. If AG = {{0}} cm, find the length of median AD.",
        hi: "AD, त्रिभुज ABC की माध्यिका है और G उसका केन्द्रक है। यदि AG = {{0}} cm है, तो माध्यिका AD की लंबाई ज्ञात कीजिए।",
        pa: "AD, ਤਿਕੋਣ ABC ਦੀ ਮੱਧਿਕਾ ਹੈ ਅਤੇ G ਉਸਦਾ ਕੇਂਦਰਕ ਹੈ। ਜੇ AG = {{0}} cm ਹੈ, ਤਾਂ ਮੱਧਿਕਾ AD ਦੀ ਲੰਬਾਈ ਪਤਾ ਕਰੋ।",
      },
    ],
    explanationsByLine: [
      [
        {
          sourceMasked: "A centroid divides every median in the ratio {{0}}:{{1}} from the vertex, so AG is two of three equal ratio parts of AD.",
          hi: "केन्द्रक प्रत्येक माध्यिका को शीर्ष से {{0}}:{{1}} के अनुपात में बाँटता है, इसलिए AG, AD के तीन समान अनुपाती भागों में से दो भाग है।",
          pa: "ਕੇਂਦਰਕ ਹਰ ਮੱਧਿਕਾ ਨੂੰ ਸਿਰੇ ਤੋਂ {{0}}:{{1}} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਦਾ ਹੈ, ਇਸ ਲਈ AG, AD ਦੇ ਤਿੰਨ ਬਰਾਬਰ ਅਨੁਪਾਤੀ ਭਾਗਾਂ ਵਿੱਚੋਂ ਦੋ ਭਾਗ ਹੈ।",
        },
      ],
      [
        {
          sourceMasked: "Therefore AD = AG × {{0}}/{{1}} = {{2}} × {{3}}/{{4}} = {{5}} cm.",
          hi: "अतः AD = AG × {{0}}/{{1}} = {{2}} × {{3}}/{{4}} = {{5}} cm।",
          pa: "ਇਸ ਲਈ AD = AG × {{0}}/{{1}} = {{2}} × {{3}}/{{4}} = {{5}} cm।",
        },
      ],
    ],
  },
  "GEO-TMP-GAP-W3-CP006-INCENTRE-IDENTIFY-V1": {
    questions: [
      {
        sourceMasked: "In triangle ABC, the three internal angle bisectors meet at I. Which centre of the triangle is I?",
        hi: "त्रिभुज ABC के तीनों आंतरिक कोण-समद्विभाजक I पर मिलते हैं। I त्रिभुज का कौन-सा केंद्र है?",
        pa: "ਤਿਕੋਣ ABC ਦੇ ਤਿੰਨੇ ਅੰਦਰੂਨੀ ਕੋਣ-ਸਮਦੋਭਾਜਕ I ਉੱਤੇ ਮਿਲਦੇ ਹਨ। I ਤਿਕੋਣ ਦਾ ਕਿਹੜਾ ਕੇਂਦਰ ਹੈ?",
      },
      {
        sourceMasked: "The internal bisectors of ∠A, ∠B and ∠C of triangle ABC are concurrent at I. Identify I.",
        hi: "त्रिभुज ABC में ∠A, ∠B और ∠C के आंतरिक समद्विभाजक I पर समवर्ती हैं। I की पहचान कीजिए।",
        pa: "ਤਿਕੋਣ ABC ਵਿੱਚ ∠A, ∠B ਅਤੇ ∠C ਦੇ ਅੰਦਰੂਨੀ ਸਮਦੋਭਾਜਕ I ਉੱਤੇ ਇਕੱਠੇ ਮਿਲਦੇ ਹਨ। I ਦੀ ਪਛਾਣ ਕਰੋ।",
      },
    ],
  },
  "GEO-TMP-GAP-W3-CP006-RIGHT-TRIANGLE-ORTHOCENTRE-V1": {
    questions: [
      {
        sourceMasked: "If ∠A = {{0}}° in triangle ABC, which point is the orthocentre of the triangle?",
        hi: "त्रिभुज ABC में यदि ∠A = {{0}}° है, तो त्रिभुज का लंबकेंद्र किस बिंदु पर होगा?",
        pa: "ਤਿਕੋਣ ABC ਵਿੱਚ ਜੇ ∠A = {{0}}° ਹੈ, ਤਾਂ ਤਿਕੋਣ ਦਾ ਲੰਬਕੇਂਦਰ ਕਿਹੜੇ ਬਿੰਦੂ ਉੱਤੇ ਹੋਵੇਗਾ?",
      },
      {
        sourceMasked: "Triangle ABC is right-angled at A. Where is its orthocentre located?",
        hi: "त्रिभुज ABC, A पर समकोण है। उसका लंबकेंद्र कहाँ स्थित होगा?",
        pa: "ਤਿਕੋਣ ABC, A ਉੱਤੇ ਸਮਕੋਣ ਹੈ। ਉਸਦਾ ਲੰਬਕੇਂਦਰ ਕਿੱਥੇ ਸਥਿਤ ਹੋਵੇਗਾ?",
      },
    ],
  },
  "GEO-TMP-GAP-W6-CP006-PERP-BISECTOR-EQUIDISTANT-ANGLE-V1": {
    questions: [
      {
        sourceMasked: "In the shown triangle, ST is the perpendicular bisector of PQ and T lies on QR. If ∠PRQ = {{0}}° and ∠TPR = {{1}}°, calculate ∠PQR.",
        hi: "दिखाए गए त्रिभुज में ST, PQ का लंब समद्विभाजक है और T, QR पर स्थित है। यदि ∠PRQ = {{0}}° और ∠TPR = {{1}}° हैं, तो ∠PQR ज्ञात कीजिए।",
        pa: "ਦਿਖਾਏ ਤਿਕੋਣ ਵਿੱਚ ST, PQ ਦਾ ਲੰਬ ਸਮਦੋਭਾਜਕ ਹੈ ਅਤੇ T, QR ਉੱਤੇ ਸਥਿਤ ਹੈ। ਜੇ ∠PRQ = {{0}}° ਅਤੇ ∠TPR = {{1}}° ਹਨ, ਤਾਂ ∠PQR ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "In triangle PQR, ∠R = {{0}}°. The perpendicular bisector of PQ at S meets QR at T. If ∠TPR = {{1}}°, find ∠PQR.",
        hi: "त्रिभुज PQR में ∠R = {{0}}° है। PQ का लंब समद्विभाजक S से होकर QR को T पर काटता है। यदि ∠TPR = {{1}}° है, तो ∠PQR ज्ञात कीजिए।",
        pa: "ਤਿਕੋਣ PQR ਵਿੱਚ ∠R = {{0}}° ਹੈ। PQ ਦਾ ਲੰਬ ਸਮਦੋਭਾਜਕ S ਵਿੱਚੋਂ ਲੰਘ ਕੇ QR ਨੂੰ T ਉੱਤੇ ਕੱਟਦਾ ਹੈ। ਜੇ ∠TPR = {{1}}° ਹੈ, ਤਾਂ ∠PQR ਪਤਾ ਕਰੋ।",
      },
    ],
  },
  "GEO-TMP-GAP-W6-CP006-PERP-BISECTOR-CONVERSE-RHOMBUS-V1": {
    questions: [
      {
        sourceMasked: "A point O lies inside rhombus PQRS and is equally distant from P and R. If SO = {{0}} cm and OQ = {{1}} cm, calculate SQ.",
        hi: "समचतुर्भुज PQRS के भीतर बिंदु O, P और R से समान दूरी पर है। यदि SO = {{0}} cm और OQ = {{1}} cm हैं, तो SQ ज्ञात कीजिए।",
        pa: "ਸਮਚਤੁਰਭੁਜ PQRS ਦੇ ਅੰਦਰ ਬਿੰਦੂ O, P ਅਤੇ R ਤੋਂ ਬਰਾਬਰ ਦੂਰੀ ਉੱਤੇ ਹੈ। ਜੇ SO = {{0}} cm ਅਤੇ OQ = {{1}} cm ਹਨ, ਤਾਂ SQ ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "PQRS is a rhombus. O is an interior point such that OP = OR. If SO = {{0}} cm and OQ = {{1}} cm, find the length of diagonal SQ.",
        hi: "PQRS एक समचतुर्भुज है। O एक आंतरिक बिंदु है जहाँ OP = OR। यदि SO = {{0}} cm और OQ = {{1}} cm हैं, तो विकर्ण SQ की लंबाई ज्ञात कीजिए।",
        pa: "PQRS ਇੱਕ ਸਮਚਤੁਰਭੁਜ ਹੈ। O ਇੱਕ ਅੰਦਰੂਨੀ ਬਿੰਦੂ ਹੈ ਜਿੱਥੇ OP = OR। ਜੇ SO = {{0}} cm ਅਤੇ OQ = {{1}} cm ਹਨ, ਤਾਂ ਵਿਕਰਣ SQ ਦੀ ਲੰਬਾਈ ਪਤਾ ਕਰੋ।",
      },
    ],
  },
  "GEO-TMP-GAP-W6-CP006-MIDPOINT-CONVERSE-SEGMENT-V1": {
    questions: [
      {
        sourceMasked: "In the shown triangle, AD = DB and DE ∥ BC with E on AC. If AC measures {{0}} cm, calculate EC.",
        hi: "दिखाए गए त्रिभुज में AD = DB और DE ∥ BC है तथा E, AC पर स्थित है। यदि AC = {{0}} cm है, तो EC ज्ञात कीजिए।",
        pa: "ਦਿਖਾਏ ਤਿਕੋਣ ਵਿੱਚ AD = DB ਅਤੇ DE ∥ BC ਹੈ ਅਤੇ E, AC ਉੱਤੇ ਸਥਿਤ ਹੈ। ਜੇ AC = {{0}} cm ਹੈ, ਤਾਂ EC ਪਤਾ ਕਰੋ।",
      },
      {
        sourceMasked: "In triangle ABC, D is the midpoint of AB. Through D, DE is drawn parallel to BC and meets AC at E. If AC = {{0}} cm, find EC.",
        hi: "त्रिभुज ABC में D, AB का मध्यबिंदु है। D से BC के समांतर DE खींची गई है, जो AC को E पर काटती है। यदि AC = {{0}} cm है, तो EC ज्ञात कीजिए।",
        pa: "ਤਿਕੋਣ ABC ਵਿੱਚ D, AB ਦਾ ਮੱਧਬਿੰਦੂ ਹੈ। D ਤੋਂ BC ਦੇ ਸਮਾਂਤਰ DE ਖਿੱਚੀ ਗਈ ਹੈ, ਜੋ AC ਨੂੰ E ਉੱਤੇ ਕੱਟਦੀ ਹੈ। ਜੇ AC = {{0}} cm ਹੈ, ਤਾਂ EC ਪਤਾ ਕਰੋ।",
      },
    ],
  },
  "GEO-TMP-GAP-W11-CP007-RIGHT-CIRCUMCENTRE-MIDPOINT-V1": {
    questions: [
      {
        sourceMasked: "For any right triangle, identify the centre located exactly halfway along the hypotenuse.",
        hi: "किसी भी समकोण त्रिभुज में कर्ण के ठीक मध्यबिंदु पर स्थित त्रिभुज-केंद्र की पहचान कीजिए।",
        pa: "ਕਿਸੇ ਵੀ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਕਰਣ ਦੇ ਬਿਲਕੁਲ ਮੱਧਬਿੰਦੂ ਉੱਤੇ ਸਥਿਤ ਤਿਕੋਣ-ਕੇਂਦਰ ਦੀ ਪਛਾਣ ਕਰੋ।",
      },
      {
        sourceMasked: "In a right-angled triangle, which triangle centre lies at the midpoint of the hypotenuse?",
        hi: "समकोण त्रिभुज में कर्ण के मध्यबिंदु पर कौन-सा त्रिभुज-केंद्र स्थित होता है?",
        pa: "ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਕਰਣ ਦੇ ਮੱਧਬਿੰਦੂ ਉੱਤੇ ਕਿਹੜਾ ਤਿਕੋਣ-ਕੇਂਦਰ ਸਥਿਤ ਹੁੰਦਾ ਹੈ?",
      },
    ],
  },
  "GEO-TMP-GAP-W11-CP008-PARALLELOGRAM-PROPERTY-RECOGNITION-V1": {
    questions: [
      {
        sourceMasked: "Which property is guaranteed for every parallelogram?",
        hi: "प्रत्येक समांतर चतुर्भुज में कौन-सा गुण अवश्य होता है?",
        pa: "ਹਰ ਸਮਾਂਤਰ ਚਤੁਰਭੁਜ ਵਿੱਚ ਕਿਹੜਾ ਗੁਣ ਲਾਜ਼ਮੀ ਹੁੰਦਾ ਹੈ?",
      },
      {
        sourceMasked: "Select the core opposite-side property that identifies a parallelogram.",
        hi: "समांतर चतुर्भुज की पहचान करने वाला सम्मुख भुजाओं का मूल गुण चुनिए।",
        pa: "ਸਮਾਂਤਰ ਚਤੁਰਭੁਜ ਦੀ ਪਛਾਣ ਕਰਨ ਵਾਲਾ ਵਿਰੁੱਧ ਭੁਜਾਵਾਂ ਦਾ ਮੁੱਖ ਗੁਣ ਚੁਣੋ।",
      },
    ],
  },
  "GEO-TMP-GAP-W11-CP008-SQUARE-STRONGER-SUBTYPE-V1": {
    questions: [
      {
        sourceMasked: "Identify the combined diagonal property inherited by a square from rectangle and rhombus structure.",
        hi: "वर्ग को आयत और समचतुर्भुज दोनों से मिलने वाले विकर्णों के संयुक्त गुण की पहचान कीजिए।",
        pa: "ਵਰਗ ਨੂੰ ਆਯਤ ਅਤੇ ਸਮਚਤੁਰਭੁਜ ਦੋਵੇਂ ਤੋਂ ਮਿਲਣ ਵਾਲੇ ਵਿਕਰਣਾਂ ਦੇ ਸੰਯੁਕਤ ਗੁਣ ਦੀ ਪਛਾਣ ਕਰੋ।",
      },
      {
        sourceMasked: "Which statement about the diagonals of every square is correct?",
        hi: "हर वर्ग के विकर्णों के बारे में कौन-सा कथन सही है?",
        pa: "ਹਰ ਵਰਗ ਦੇ ਵਿਕਰਣਾਂ ਬਾਰੇ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?",
      },
    ],
  },
} as const satisfies Readonly<Record<string, GeometryPrototypeEditorialVariantsV2>>);
