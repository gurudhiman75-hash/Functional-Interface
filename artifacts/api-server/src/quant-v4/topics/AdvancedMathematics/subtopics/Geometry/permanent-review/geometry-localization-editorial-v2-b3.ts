import type { GeometryPrototypeEditorialTemplateV2 } from "./geometry-localization-editorial-v2-types";

export const GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B3 = Object.freeze(
{
  "GEO-TMP-CP007-HYPOTENUSE-MEDIAN-V1": {
      "question": {
        "sourceMasked": "Triangle ABC is right-angled at A. M is the midpoint of hypotenuse BC, and BC = {{0}} cm. Find AM.",
        "hi": "त्रिभुज ABC, A पर समकोण है। M, कर्ण BC का मध्यबिंदु है और BC = {{0}} cm है। AM ज्ञात कीजिए।",
        "pa": "ਤਿਕੋਣ ABC, A ਉੱਤੇ ਸਮਕੋਣ ਹੈ। M, ਕਰਣ BC ਦਾ ਮੱਧਬਿੰਦੂ ਹੈ ਅਤੇ BC = {{0}} cm ਹੈ। AM ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "In a right triangle, the midpoint of the hypotenuse is equally distant from all three vertices.",
          "hi": "समकोण त्रिभुज में कर्ण का मध्यबिंदु तीनों शीर्षों से समान दूरी पर होता है।",
          "pa": "ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਕਰਣ ਦਾ ਮੱਧਬਿੰਦੂ ਤਿੰਨਾਂ ਸਿਰਿਆਂ ਤੋਂ ਬਰਾਬਰ ਦੂਰੀ ਉੱਤੇ ਹੁੰਦਾ ਹੈ।"
        },
        {
          "sourceMasked": "So the median from the right angle to the hypotenuse is half the hypotenuse: AM = {{0}}/{{1}} = {{2}} cm.",
          "hi": "इसलिए समकोण वाले शीर्ष से कर्ण तक की माध्यिका, कर्ण की आधी होती है: AM = {{0}}/{{1}} = {{2}} cm।",
          "pa": "ਇਸ ਲਈ ਸਮਕੋਣ ਵਾਲੇ ਸਿਰੇ ਤੋਂ ਕਰਣ ਤੱਕ ਦੀ ਮੱਧਿਕਾ, ਕਰਣ ਦੀ ਅੱਧੀ ਹੁੰਦੀ ਹੈ: AM = {{0}}/{{1}} = {{2}} cm।"
        }
      ]
    },
  "GEO-TMP-GAP-W11-CP007-RIGHT-CIRCUMCENTRE-MIDPOINT-V1": {
      "question": {
        "sourceMasked": "Triangle ABC is right-angled at A and M is the midpoint of hypotenuse BC. Which standard triangle centre is M?",
        "hi": "त्रिभुज ABC, A पर समकोण है और M, कर्ण BC का मध्यबिंदु है। M त्रिभुज का कौन-सा मानक केंद्र है?",
        "pa": "ਤਿਕੋਣ ABC, A ਉੱਤੇ ਸਮਕੋਣ ਹੈ ਅਤੇ M, ਕਰਣ BC ਦਾ ਮੱਧਬਿੰਦੂ ਹੈ। M ਤਿਕੋਣ ਦਾ ਕਿਹੜਾ ਮਿਆਰੀ ਕੇਂਦਰ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "The midpoint of the hypotenuse of a right triangle is equally distant from all three vertices.",
          "hi": "समकोण त्रिभुज में कर्ण का मध्यबिंदु तीनों शीर्षों से समान दूरी पर होता है।",
          "pa": "ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਕਰਣ ਦਾ ਮੱਧਬਿੰਦੂ ਤਿੰਨਾਂ ਸਿਰਿਆਂ ਤੋਂ ਬਰਾਬਰ ਦੂਰੀ ਉੱਤੇ ਹੁੰਦਾ ਹੈ।"
        },
        {
          "sourceMasked": "A point equidistant from all three vertices is the circumcentre, so the hypotenuse midpoint is the circumcentre.",
          "hi": "तीनों शीर्षों से समान दूरी वाला बिंदु परिकेंद्र होता है, इसलिए कर्ण का मध्यबिंदु परिकेंद्र है।",
          "pa": "ਤਿੰਨਾਂ ਸਿਰਿਆਂ ਤੋਂ ਬਰਾਬਰ ਦੂਰੀ ਵਾਲਾ ਬਿੰਦੂ ਪਰਿਕੇਂਦਰ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਕਰਣ ਦਾ ਮੱਧਬਿੰਦੂ ਪਰਿਕੇਂਦਰ ਹੈ।"
        }
      ]
    },
  "GEO-TMP-CP008-FOURTH-ANGLE-V1": {
      "question": {
        "sourceMasked": "In a convex quadrilateral ABCD, ∠A = {{0}}°, ∠B = {{1}}° and ∠C = {{2}}°. Find ∠D.",
        "hi": "उत्तल चतुर्भुज ABCD में ∠A = {{0}}°, ∠B = {{1}}° और ∠C = {{2}}° हैं। ∠D ज्ञात कीजिए।",
        "pa": "ਉੱਤਲ ਚਤੁਰਭੁਜ ABCD ਵਿੱਚ ∠A = {{0}}°, ∠B = {{1}}° ਅਤੇ ∠C = {{2}}° ਹਨ। ∠D ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "A quadrilateral has four interior angles whose total is {{0}}°.",
          "hi": "चतुर्भुज के चारों अंतः कोणों का कुल योग {{0}}° होता है।",
          "pa": "ਚਤੁਰਭੁਜ ਦੇ ਚਾਰਾਂ ਅੰਦਰੂਨੀ ਕੋਣਾਂ ਦਾ ਕੁੱਲ ਜੋੜ {{0}}° ਹੁੰਦਾ ਹੈ।"
        },
        {
          "sourceMasked": "Therefore ∠D = {{0}}° − ({{1}}° + {{2}}° + {{3}}°) = {{4}}° − {{5}}° = {{6}}°.",
          "hi": "अतः ∠D = {{0}}° − ({{1}}° + {{2}}° + {{3}}°) = {{4}}° − {{5}}° = {{6}}°।",
          "pa": "ਇਸ ਲਈ ∠D = {{0}}° − ({{1}}° + {{2}}° + {{3}}°) = {{4}}° − {{5}}° = {{6}}°।"
        }
      ]
    },
  "GEO-TMP-CP008-PARALLELOGRAM-DIAGONAL-V1": {
      "question": {
        "sourceMasked": "ABCD is a parallelogram whose diagonals AC and BD intersect at O. If AC = {{0}} cm, find AO.",
        "hi": "ABCD एक समांतर चतुर्भुज है, जिसके विकर्ण AC और BD, O पर मिलते हैं। यदि AC = {{0}} cm है, तो AO ज्ञात कीजिए।",
        "pa": "ABCD ਇੱਕ ਸਮਾਂਤਰ ਚਤੁਰਭੁਜ ਹੈ, ਜਿਸਦੇ ਵਿਕਰਣ AC ਅਤੇ BD, O ਉੱਤੇ ਮਿਲਦੇ ਹਨ। ਜੇ AC = {{0}} cm ਹੈ, ਤਾਂ AO ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "The diagonals of a parallelogram bisect each other, so O is the midpoint of AC.",
          "hi": "समांतर चतुर्भुज के विकर्ण एक-दूसरे को समद्विभाजित करते हैं, इसलिए O, AC का मध्यबिंदु है।",
          "pa": "ਸਮਾਂਤਰ ਚਤੁਰਭੁਜ ਦੇ ਵਿਕਰਣ ਇੱਕ-ਦੂਜੇ ਨੂੰ ਅੱਧਾ ਕਰਦੇ ਹਨ, ਇਸ ਲਈ O, AC ਦਾ ਮੱਧਬਿੰਦੂ ਹੈ।"
        },
        {
          "sourceMasked": "Hence AO = AC/{{0}} = {{1}}/{{2}} = {{3}} cm.",
          "hi": "अतः AO = AC/{{0}} = {{1}}/{{2}} = {{3}} cm।",
          "pa": "ਇਸ ਲਈ AO = AC/{{0}} = {{1}}/{{2}} = {{3}} cm।"
        }
      ]
    },
  "GEO-TMP-CP008-RHOMBUS-DIAGONAL-ANGLE-V1": {
      "question": {
        "sourceMasked": "ABCD is a rhombus whose diagonals AC and BD intersect at O. Find ∠AOB.",
        "hi": "ABCD एक समचतुर्भुज है, जिसके विकर्ण AC और BD, O पर मिलते हैं। ∠AOB ज्ञात कीजिए।",
        "pa": "ABCD ਇੱਕ ਸਮਚਤੁਰਭੁਜ ਹੈ, ਜਿਸਦੇ ਵਿਕਰਣ AC ਅਤੇ BD, O ਉੱਤੇ ਮਿਲਦੇ ਹਨ। ∠AOB ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "The diagonals of a rhombus are perpendicular to each other.",
          "hi": "समचतुर्भुज के विकर्ण एक-दूसरे पर लंब होते हैं।",
          "pa": "ਸਮਚਤੁਰਭੁਜ ਦੇ ਵਿਕਰਣ ਇੱਕ-ਦੂਜੇ ਉੱਤੇ ਲੰਬ ਹੁੰਦੇ ਹਨ।"
        },
        {
          "sourceMasked": "Therefore the angle formed where AC and BD meet is a right angle, so ∠AOB = {{0}}°.",
          "hi": "इसलिए AC और BD के मिलने पर बना कोण समकोण है; अतः ∠AOB = {{0}}°।",
          "pa": "ਇਸ ਲਈ AC ਅਤੇ BD ਦੇ ਮਿਲਣ ਉੱਤੇ ਬਣਿਆ ਕੋਣ ਸਮਕੋਣ ਹੈ; ਇਸ ਕਰਕੇ ∠AOB = {{0}}°।"
        }
      ]
    },
  "GEO-TMP-GAP-W11-CP008-PARALLELOGRAM-PROPERTY-RECOGNITION-V1": {
      "question": {
        "sourceMasked": "A general parallelogram is being described. Which statement must always be true?",
        "hi": "एक सामान्य समांतर चतुर्भुज का वर्णन किया जा रहा है। कौन-सा कथन हमेशा सत्य होगा?",
        "pa": "ਇੱਕ ਆਮ ਸਮਾਂਤਰ ਚਤੁਰਭੁਜ ਦਾ ਵਰਣਨ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ। ਕਿਹੜਾ ਕਥਨ ਹਮੇਸ਼ਾ ਸਹੀ ਹੋਵੇਗਾ?"
      },
      "explanations": [
        {
          "sourceMasked": "A parallelogram has both pairs of opposite sides parallel.",
          "hi": "समांतर चतुर्भुज में दोनों जोड़ी सम्मुख भुजाएँ समांतर होती हैं।",
          "pa": "ਸਮਾਂਤਰ ਚਤੁਰਭੁਜ ਵਿੱਚ ਦੋਵੇਂ ਜੋੜੀਆਂ ਵਿਰੁੱਧ ਭੁਜਾਵਾਂ ਸਮਾਂਤਰ ਹੁੰਦੀਆਂ ਹਨ।"
        },
        {
          "sourceMasked": "Those opposite sides are also equal in length; perpendicular diagonals or four right angles belong to stronger subtypes.",
          "hi": "वे सम्मुख भुजाएँ लंबाई में भी बराबर होती हैं; लंब विकर्ण या चार समकोण केवल अधिक विशिष्ट प्रकारों की विशेषताएँ हैं।",
          "pa": "ਉਹ ਵਿਰੁੱਧ ਭੁਜਾਵਾਂ ਲੰਬਾਈ ਵਿੱਚ ਵੀ ਬਰਾਬਰ ਹੁੰਦੀਆਂ ਹਨ; ਲੰਬ ਵਿਕਰਣ ਜਾਂ ਚਾਰ ਸਮਕੋਣ ਹੋਰ ਖ਼ਾਸ ਕਿਸਮਾਂ ਦੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਹਨ।"
        }
      ]
    },
  "GEO-TMP-GAP-W11-CP008-SQUARE-STRONGER-SUBTYPE-V1": {
      "question": {
        "sourceMasked": "For square ABCD, what is always true when diagonals AC and BD meet?",
        "hi": "वर्ग ABCD में जब विकर्ण AC और BD मिलते हैं, तब कौन-सी बात हमेशा सत्य होती है?",
        "pa": "ਵਰਗ ABCD ਵਿੱਚ ਜਦੋਂ ਵਿਕਰਣ AC ਅਤੇ BD ਮਿਲਦੇ ਹਨ, ਤਾਂ ਕਿਹੜੀ ਗੱਲ ਹਮੇਸ਼ਾ ਸਹੀ ਹੁੰਦੀ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "A square is both a rectangle and a rhombus.",
          "hi": "वर्ग एक आयत भी है और समचतुर्भुज भी।",
          "pa": "ਵਰਗ ਇੱਕ ਆਯਤ ਵੀ ਹੈ ਅਤੇ ਸਮਚਤੁਰਭੁਜ ਵੀ।"
        },
        {
          "sourceMasked": "Therefore its diagonals are equal, they bisect each other, and they meet at {{0}}°.",
          "hi": "इसलिए उसके विकर्ण बराबर होते हैं, एक-दूसरे को समद्विभाजित करते हैं और {{0}}° पर मिलते हैं।",
          "pa": "ਇਸ ਲਈ ਉਸਦੇ ਵਿਕਰਣ ਬਰਾਬਰ ਹੁੰਦੇ ਹਨ, ਇੱਕ-ਦੂਜੇ ਨੂੰ ਅੱਧਾ ਕਰਦੇ ਹਨ ਅਤੇ {{0}}° ਉੱਤੇ ਮਿਲਦੇ ਹਨ।"
        }
      ]
    }
}
) as Readonly<Record<string, GeometryPrototypeEditorialTemplateV2>>;
