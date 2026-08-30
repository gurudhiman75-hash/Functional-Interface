import type { GeometryPrototypeEditorialTemplateV2 } from "./geometry-localization-editorial-v2-types";

export const GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_D1 = Object.freeze(
{
  "GEO-TMP-CP013-INTERSECTING-CHORDS-V1": {
      "question": {
        "sourceMasked": "Chords AB and CD intersect at P inside a circle. If PA = {{0}} cm, PB = {{1}} cm and PC = {{2}} cm, find PD.",
        "hi": "वृत्त के भीतर जीवाएँ AB और CD, P पर प्रतिच्छेद करती हैं। यदि PA = {{0}} cm, PB = {{1}} cm और PC = {{2}} cm हैं, तो PD ज्ञात कीजिए।",
        "pa": "ਵਰਤੁਲ ਦੇ ਅੰਦਰ ਜੀਵਾਵਾਂ AB ਅਤੇ CD, P ਉੱਤੇ ਇੱਕ-ਦੂਜੇ ਨੂੰ ਕੱਟਦੀਆਂ ਹਨ। ਜੇ PA = {{0}} cm, PB = {{1}} cm ਅਤੇ PC = {{2}} cm ਹਨ, ਤਾਂ PD ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "For two chords intersecting inside a circle, the products of the two chord parts are equal: PA × PB = PC × PD.",
          "hi": "वृत्त के भीतर प्रतिच्छेद करती दो जीवाओं के खंडों के गुणनफल बराबर होते हैं: PA × PB = PC × PD।",
          "pa": "ਵਰਤੁਲ ਦੇ ਅੰਦਰ ਇੱਕ-ਦੂਜੇ ਨੂੰ ਕੱਟਦੀਆਂ ਦੋ ਜੀਵਾਵਾਂ ਦੇ ਖੰਡਾਂ ਦੇ ਗੁਣਨਫਲ ਬਰਾਬਰ ਹੁੰਦੇ ਹਨ: PA × PB = PC × PD।"
        },
        {
          "sourceMasked": "So {{0}} × {{1}} = {{2}} × PD, giving PD = {{3}}/{{4}} = {{5}} cm.",
          "hi": "अतः {{0}} × {{1}} = {{2}} × PD, जिससे PD = {{3}}/{{4}} = {{5}} cm।",
          "pa": "ਇਸ ਲਈ {{0}} × {{1}} = {{2}} × PD, ਜਿਸ ਤੋਂ PD = {{3}}/{{4}} = {{5}} cm।"
        }
      ]
    },
  "GEO-TMP-CP013-SECANT-SECANT-V1": {
      "question": {
        "sourceMasked": "From an external point P, two secants PAB and PCD meet the same circle, with A and C the nearer points. If PA = {{0}} cm, PB = {{1}} cm, and PC = {{2}} cm, find the whole secant PD.",
        "hi": "बाह्य बिंदु P से दो छेदक PAB और PCD एक ही वृत्त को काटते हैं; A और C निकट वाले बिंदु हैं। यदि PA = {{0}} cm, PB = {{1}} cm और PC = {{2}} cm हैं, तो पूरी छेदक PD ज्ञात कीजिए।",
        "pa": "ਬਾਹਰੀ ਬਿੰਦੂ P ਤੋਂ ਦੋ ਛੇਦਕ PAB ਅਤੇ PCD ਇੱਕੋ ਵਰਤੁਲ ਨੂੰ ਕੱਟਦੇ ਹਨ; A ਅਤੇ C ਨੇੜਲੇ ਬਿੰਦੂ ਹਨ। ਜੇ PA = {{0}} cm, PB = {{1}} cm ਅਤੇ PC = {{2}} cm ਹਨ, ਤਾਂ ਪੂਰੀ ਛੇਦਕ PD ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "For two secants from the same external point, external part × whole secant is equal for both secants.",
          "hi": "एक ही बाह्य बिंदु से खींची दो छेदकों के लिए बाह्य भाग × पूरी छेदक दोनों छेदकों में बराबर होता है।",
          "pa": "ਇੱਕੋ ਬਾਹਰੀ ਬਿੰਦੂ ਤੋਂ ਖਿੱਚੀਆਂ ਦੋ ਛੇਦਕਾਂ ਲਈ ਬਾਹਰੀ ਭਾਗ × ਪੂਰੀ ਛੇਦਕ ਦੋਵੇਂ ਛੇਦਕਾਂ ਵਿੱਚ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।"
        },
        {
          "sourceMasked": "Thus PA × PB = PC × PD, so {{0}} × {{1}} = {{2}} × PD and PD = {{3}} cm.",
          "hi": "अतः PA × PB = PC × PD, इसलिए {{0}} × {{1}} = {{2}} × PD और PD = {{3}} cm।",
          "pa": "ਇਸ ਲਈ PA × PB = PC × PD, ਇਸ ਕਰਕੇ {{0}} × {{1}} = {{2}} × PD ਅਤੇ PD = {{3}} cm।"
        }
      ]
    },
  "GEO-TMP-GAP-W12-CP013-REVERSE-UNKNOWN-EXTERNAL-SECANT-V1": {
      "question": {
        "sourceMasked": "Two secants from external point P meet the same circle. On the first secant, the internal chord portion is {{0}} cm and the external part x is unknown, so the whole first secant is x + {{1}}. On the second secant, the external part is {{2}} cm and the internal chord portion is {{3}} cm. Find x.",
        "hi": "बाह्य बिंदु P से दो छेदक एक ही वृत्त को काटते हैं। पहली छेदक का आंतरिक जीवा-भाग {{0}} cm है और बाह्य भाग x अज्ञात है, इसलिए पूरी पहली छेदक x + {{1}} है। दूसरी छेदक का बाह्य भाग {{2}} cm और आंतरिक जीवा-भाग {{3}} cm है। x ज्ञात कीजिए।",
        "pa": "ਬਾਹਰੀ ਬਿੰਦੂ P ਤੋਂ ਦੋ ਛੇਦਕ ਇੱਕੋ ਵਰਤੁਲ ਨੂੰ ਕੱਟਦੇ ਹਨ। ਪਹਿਲੀ ਛੇਦਕ ਦਾ ਅੰਦਰੂਨੀ ਜੀਵਾ-ਭਾਗ {{0}} cm ਹੈ ਅਤੇ ਬਾਹਰੀ ਭਾਗ x ਅਣਜਾਣ ਹੈ, ਇਸ ਲਈ ਪੂਰੀ ਪਹਿਲੀ ਛੇਦਕ x + {{1}} ਹੈ। ਦੂਜੀ ਛੇਦਕ ਦਾ ਬਾਹਰੀ ਭਾਗ {{2}} cm ਅਤੇ ਅੰਦਰੂਨੀ ਜੀਵਾ-ਭਾਗ {{3}} cm ਹੈ। x ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "The second whole secant is {{0}}+{{1}}={{2}} cm, so its power product is {{3}}×{{4}}={{5}}.",
          "hi": "दूसरी पूरी छेदक = {{0}}+{{1}}={{2}} cm, इसलिए उसका शक्ति-गुणनफल {{3}}×{{4}}={{5}} है।",
          "pa": "ਦੂਜੀ ਪੂਰੀ ਛੇਦਕ = {{0}}+{{1}}={{2}} cm, ਇਸ ਲਈ ਉਸਦਾ ਸ਼ਕਤੀ-ਗੁਣਨਫਲ {{3}}×{{4}}={{5}} ਹੈ।"
        },
        {
          "sourceMasked": "For the first secant, external × whole gives x(x+{{0}})={{1}}. The positive length root is x={{2}} cm.",
          "hi": "पहली छेदक के लिए बाह्य भाग × पूरी छेदक से x(x+{{0}})={{1}}। धनात्मक लंबाई वाला मूल x={{2}} cm है।",
          "pa": "ਪਹਿਲੀ ਛੇਦਕ ਲਈ ਬਾਹਰੀ ਭਾਗ × ਪੂਰੀ ਛੇਦਕ ਤੋਂ x(x+{{0}})={{1}}। ਧਨਾਤਮਕ ਲੰਬਾਈ ਵਾਲਾ ਮੂਲ x={{2}} cm ਹੈ।"
        }
      ]
    },
  "GEO-TMP-CP013-TANGENT-SECANT-V1": {
      "question": {
        "sourceMasked": "From an external point P, PT is tangent to a circle at T and secant PAB meets the circle first at A and then at B. If PA = {{0}} cm and the whole secant PB = {{1}} cm, find PT.",
        "hi": "बाह्य बिंदु P से PT, T पर वृत्त की स्पर्शरेखा है और छेदक PAB वृत्त को पहले A तथा फिर B पर काटती है। यदि PA = {{0}} cm और पूरी छेदक PB = {{1}} cm है, तो PT ज्ञात कीजिए।",
        "pa": "ਬਾਹਰੀ ਬਿੰਦੂ P ਤੋਂ PT, T ਉੱਤੇ ਵਰਤੁਲ ਦੀ ਸਪਰਸ਼ ਰੇਖਾ ਹੈ ਅਤੇ ਛੇਦਕ PAB ਵਰਤੁਲ ਨੂੰ ਪਹਿਲਾਂ A ਅਤੇ ਫਿਰ B ਉੱਤੇ ਕੱਟਦੀ ਹੈ। ਜੇ PA = {{0}} cm ਅਤੇ ਪੂਰੀ ਛੇਦਕ PB = {{1}} cm ਹੈ, ਤਾਂ PT ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "For a tangent and a secant from the same external point, PT² = PA × PB, where PB is the whole secant.",
          "hi": "एक ही बाह्य बिंदु से स्पर्शरेखा और छेदक के लिए PT² = PA × PB, जहाँ PB पूरी छेदक है।",
          "pa": "ਇੱਕੋ ਬਾਹਰੀ ਬਿੰਦੂ ਤੋਂ ਸਪਰਸ਼ ਰੇਖਾ ਅਤੇ ਛੇਦਕ ਲਈ PT² = PA × PB, ਜਿੱਥੇ PB ਪੂਰੀ ਛੇਦਕ ਹੈ।"
        },
        {
          "sourceMasked": "So PT² = {{0}} × {{1}} = {{2}}. Since PT is a positive length, PT = {{3}} cm.",
          "hi": "अतः PT² = {{0}} × {{1}} = {{2}}। PT धनात्मक लंबाई है, इसलिए PT = {{3}} cm।",
          "pa": "ਇਸ ਲਈ PT² = {{0}} × {{1}} = {{2}}। PT ਧਨਾਤਮਕ ਲੰਬਾਈ ਹੈ, ਇਸ ਲਈ PT = {{3}} cm।"
        }
      ]
    },
  "GEO-TMP-CP014-CHORD-PYTHAGORAS-V1": {
      "question": {
        "sourceMasked": "In a circle with centre O, AB is a chord. OM is perpendicular to AB at M. If OA = {{0}} cm and OM = {{1}} cm, find AB.",
        "hi": "केंद्र O वाले वृत्त में AB एक जीवा है। OM, M पर AB पर लंब है। यदि OA = {{0}} cm और OM = {{1}} cm हैं, तो AB ज्ञात कीजिए।",
        "pa": "ਕੇਂਦਰ O ਵਾਲੇ ਵਰਤੁਲ ਵਿੱਚ AB ਇੱਕ ਜੀਵਾ ਹੈ। OM, M ਉੱਤੇ AB ਉੱਤੇ ਲੰਬ ਹੈ। ਜੇ OA = {{0}} cm ਅਤੇ OM = {{1}} cm ਹਨ, ਤਾਂ AB ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "Because OM is perpendicular to chord AB from the centre, M bisects the chord. So AM = MB.",
          "hi": "केंद्र O से जीवा AB पर OM लंब है, इसलिए M जीवा को समद्विभाजित करता है। अतः AM = MB।",
          "pa": "ਕੇਂਦਰ O ਤੋਂ ਜੀਵਾ AB ਉੱਤੇ OM ਲੰਬ ਹੈ, ਇਸ ਲਈ M ਜੀਵਾ ਨੂੰ ਅੱਧਾ ਕਰਦਾ ਹੈ। ਇਸ ਲਈ AM = MB।"
        },
        {
          "sourceMasked": "Triangle OMA is right-angled at M. With OA = {{0}} cm and OM = {{1}} cm, Pythagoras gives AM² = {{2}}² − {{3}}² = {{4}}, so AM = {{5}} cm.",
          "hi": "त्रिभुज OMA, M पर समकोण है। OA = {{0}} cm और OM = {{1}} cm होने से पाइथागोरस द्वारा AM² = {{2}}² − {{3}}² = {{4}}, इसलिए AM = {{5}} cm।",
          "pa": "ਤਿਕੋਣ OMA, M ਉੱਤੇ ਸਮਕੋਣ ਹੈ। OA = {{0}} cm ਅਤੇ OM = {{1}} cm ਹੋਣ ਕਰਕੇ ਪਾਇਥਾਗੋਰਸ ਨਾਲ AM² = {{2}}² − {{3}}² = {{4}}, ਇਸ ਲਈ AM = {{5}} cm।"
        },
        {
          "sourceMasked": "Therefore AB = AM + MB = {{0}} + {{1}} = {{2}} cm.",
          "hi": "अतः AB = AM + MB = {{0}} + {{1}} = {{2}} cm।",
          "pa": "ਇਸ ਲਈ AB = AM + MB = {{0}} + {{1}} = {{2}} cm।"
        }
      ]
    },
  "GEO-TMP-CP014-CYCLIC-ISOSCELES-V1": {
      "question": {
        "sourceMasked": "ABCD is a cyclic quadrilateral. ∠DAB = {{0}}°. Also, in triangle BCD, BC = CD. Find ∠CBD.",
        "hi": "ABCD एक चक्रीय चतुर्भुज है। ∠DAB = {{0}}° है। साथ ही त्रिभुज BCD में BC = CD है। ∠CBD ज्ञात कीजिए।",
        "pa": "ABCD ਇੱਕ ਚੱਕਰੀ ਚਤੁਰਭੁਜ ਹੈ। ∠DAB = {{0}}° ਹੈ। ਨਾਲ ਹੀ ਤਿਕੋਣ BCD ਵਿੱਚ BC = CD ਹੈ। ∠CBD ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "Opposite angles of a cyclic quadrilateral add to {{0}}°, so ∠BCD = {{1}}° − {{2}}° = {{3}}°.",
          "hi": "चक्रीय चतुर्भुज के सम्मुख कोणों का योग {{0}}° होता है, इसलिए ∠BCD = {{1}}° − {{2}}° = {{3}}°।",
          "pa": "ਚੱਕਰੀ ਚਤੁਰਭੁਜ ਦੇ ਵਿਰੁੱਧ ਕੋਣਾਂ ਦਾ ਜੋੜ {{0}}° ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ∠BCD = {{1}}° − {{2}}° = {{3}}°।"
        },
        {
          "sourceMasked": "Because BC = CD, triangle BCD is isosceles and its base angles at B and D are equal.",
          "hi": "BC = CD होने के कारण त्रिभुज BCD समद्विबाहु है और B तथा D पर उसके आधार कोण बराबर हैं।",
          "pa": "BC = CD ਹੋਣ ਕਰਕੇ ਤਿਕੋਣ BCD ਸਮਦਵਿਭੁਜ ਹੈ ਅਤੇ B ਅਤੇ D ਉੱਤੇ ਉਸਦੇ ਆਧਾਰ ਕੋਣ ਬਰਾਬਰ ਹਨ।"
        },
        {
          "sourceMasked": "Those two equal angles share the remaining {{0}}° − {{1}}° = {{2}}°, so ∠CBD = {{3}}°/{{4}} = {{5}}°.",
          "hi": "इन दोनों बराबर कोणों का कुल {{0}}° − {{1}}° = {{2}}° है, इसलिए ∠CBD = {{3}}°/{{4}} = {{5}}°।",
          "pa": "ਇਨ੍ਹਾਂ ਦੋਵੇਂ ਬਰਾਬਰ ਕੋਣਾਂ ਦਾ ਕੁੱਲ {{0}}° − {{1}}° = {{2}}° ਹੈ, ਇਸ ਲਈ ∠CBD = {{3}}°/{{4}} = {{5}}°।"
        }
      ]
    },
  "GEO-TMP-CP014-TANGENT-TRIANGLE-V1": {
      "question": {
        "sourceMasked": "PT is tangent to a circle at T, O is the centre, and O, P and T form triangle OPT. If ∠TOP = {{0}}°, find ∠OPT.",
        "hi": "PT, T पर वृत्त की स्पर्शरेखा है, O केंद्र है और O, P तथा T मिलकर त्रिभुज OPT बनाते हैं। यदि ∠TOP = {{0}}° है, तो ∠OPT ज्ञात कीजिए।",
        "pa": "PT, T ਉੱਤੇ ਵਰਤੁਲ ਦੀ ਸਪਰਸ਼ ਰੇਖਾ ਹੈ, O ਕੇਂਦਰ ਹੈ ਅਤੇ O, P ਅਤੇ T ਮਿਲ ਕੇ ਤਿਕੋਣ OPT ਬਣਾਉਂਦੇ ਹਨ। ਜੇ ∠TOP = {{0}}° ਹੈ, ਤਾਂ ∠OPT ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "The radius OT is perpendicular to tangent PT at the point of contact, so ∠OTP = {{0}}°.",
          "hi": "स्पर्श बिंदु T पर त्रिज्या OT, स्पर्शरेखा PT पर लंब है, इसलिए ∠OTP = {{0}}°।",
          "pa": "ਸਪਰਸ਼ ਬਿੰਦੂ T ਉੱਤੇ ਤ੍ਰਿਜਿਆ OT, ਸਪਰਸ਼ ਰੇਖਾ PT ਉੱਤੇ ਲੰਬ ਹੈ, ਇਸ ਲਈ ∠OTP = {{0}}°।"
        },
        {
          "sourceMasked": "The angles of triangle OPT add to {{0}}°. Therefore ∠OPT = {{1}}° − {{2}}° − {{3}}° = {{4}}°.",
          "hi": "त्रिभुज OPT के कोणों का योग {{0}}° है। अतः ∠OPT = {{1}}° − {{2}}° − {{3}}° = {{4}}°।",
          "pa": "ਤਿਕੋਣ OPT ਦੇ ਕੋਣਾਂ ਦਾ ਜੋੜ {{0}}° ਹੈ। ਇਸ ਲਈ ∠OPT = {{1}}° − {{2}}° − {{3}}° = {{4}}°।"
        }
      ]
    },
  "GEO-TMP-CP014-BPT-BISECTOR-V1": {
      "question": {
        "sourceMasked": "In triangle ABC, E lies on AB and F lies on AC with EF ∥ BC. AE = {{0}} cm, EB = {{1}} cm and AF = {{2}} cm. AD bisects ∠A and meets BC at D. If BD = {{3}} cm, find DC.",
        "hi": "त्रिभुज ABC में E, AB पर और F, AC पर है तथा EF ∥ BC है। AE = {{0}} cm, EB = {{1}} cm और AF = {{2}} cm है। AD, ∠A का समद्विभाजक है और BC को D पर काटता है। यदि BD = {{3}} cm है, तो DC ज्ञात कीजिए।",
        "pa": "ਤਿਕੋਣ ABC ਵਿੱਚ E, AB ਉੱਤੇ ਅਤੇ F, AC ਉੱਤੇ ਹੈ ਅਤੇ EF ∥ BC ਹੈ। AE = {{0}} cm, EB = {{1}} cm ਅਤੇ AF = {{2}} cm ਹੈ। AD, ∠A ਦਾ ਸਮਦੋਭਾਜਕ ਹੈ ਅਤੇ BC ਨੂੰ D ਉੱਤੇ ਕੱਟਦਾ ਹੈ। ਜੇ BD = {{3}} cm ਹੈ, ਤਾਂ DC ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "AB = AE + EB = {{0}} + {{1}} = {{2}} cm. Since EF is parallel to BC, proportional corresponding sides give AE/AB = AF/AC. Thus {{3}}/{{4}} = {{5}}/AC, so AC = {{6}} cm.",
          "hi": "AB = AE + EB = {{0}} + {{1}} = {{2}} cm। EF ∥ BC होने से संगत भुजाएँ समानुपाती हैं: AE/AB = AF/AC। अतः {{3}}/{{4}} = {{5}}/AC, इसलिए AC = {{6}} cm।",
          "pa": "AB = AE + EB = {{0}} + {{1}} = {{2}} cm। EF ∥ BC ਹੋਣ ਕਰਕੇ ਸੰਗਤ ਭੁਜਾਵਾਂ ਅਨੁਪਾਤੀ ਹਨ: AE/AB = AF/AC। ਇਸ ਲਈ {{3}}/{{4}} = {{5}}/AC, ਅਤੇ AC = {{6}} cm।"
        },
        {
          "sourceMasked": "Now use the angle-bisector theorem on AD: BD/DC = AB/AC = {{0}}/{{1}} = {{2}}/{{3}}.",
          "hi": "अब AD पर कोण-समद्विभाजक प्रमेय लगाएँ: BD/DC = AB/AC = {{0}}/{{1}} = {{2}}/{{3}}।",
          "pa": "ਹੁਣ AD ਉੱਤੇ ਕੋਣ-ਸਮਦੋਭਾਜਕ ਪ੍ਰਮੇਯ ਲਗਾਓ: BD/DC = AB/AC = {{0}}/{{1}} = {{2}}/{{3}}।"
        },
        {
          "sourceMasked": "With BD = {{0}} cm, {{1}}/DC = {{2}}/{{3}}, so DC = {{4}} cm.",
          "hi": "BD = {{0}} cm होने से {{1}}/DC = {{2}}/{{3}}, इसलिए DC = {{4}} cm।",
          "pa": "BD = {{0}} cm ਹੋਣ ਕਰਕੇ {{1}}/DC = {{2}}/{{3}}, ਇਸ ਲਈ DC = {{4}} cm।"
        }
      ]
    }
}
) as Readonly<Record<string, GeometryPrototypeEditorialTemplateV2>>;
