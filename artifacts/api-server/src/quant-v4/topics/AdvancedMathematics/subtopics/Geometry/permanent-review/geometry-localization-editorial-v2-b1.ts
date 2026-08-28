import type { GeometryPrototypeEditorialTemplateV2 } from "./geometry-localization-editorial-v2-types";

export const GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B1 = Object.freeze(
{
  "GEO-TMP-CP005-AA-CORRESPONDENCE-V1": {
      "question": {
        "sourceMasked": "In triangles ABC and PQR, ∠A = ∠P and ∠B = ∠Q. Under the AA similarity correspondence, which vertex corresponds to C?",
        "hi": "त्रिभुज ABC और PQR में ∠A = ∠P और ∠B = ∠Q है। AA समरूपता के अनुसार C के संगत कौन-सा शीर्ष होगा?",
        "pa": "ਤਿਕੋਣ ABC ਅਤੇ PQR ਵਿੱਚ ∠A = ∠P ਅਤੇ ∠B = ∠Q ਹੈ। AA ਸਮਰੂਪਤਾ ਅਨੁਸਾਰ C ਦੇ ਸੰਗਤ ਕਿਹੜਾ ਸਿਰਾ ਹੋਵੇਗਾ?"
      },
      "explanations": [
        {
          "sourceMasked": "Two angle pairs match: A↔P and B↔Q, so the triangles are similar by AA.",
          "hi": "दो कोण-युग्म बराबर हैं: A↔P और B↔Q, इसलिए त्रिभुज AA से समरूप हैं।",
          "pa": "ਦੋ ਕੋਣ-ਜੋੜੇ ਬਰਾਬਰ ਹਨ: A↔P ਅਤੇ B↔Q, ਇਸ ਲਈ ਤਿਕੋਣ AA ਨਾਲ ਸਮਰੂਪ ਹਨ।"
        },
        {
          "sourceMasked": "The only remaining vertices must correspond, so C↔R.",
          "hi": "अब केवल शेष शीर्ष ही एक-दूसरे के संगत हो सकते हैं, इसलिए C↔R।",
          "pa": "ਹੁਣ ਸਿਰਫ਼ ਬਾਕੀ ਸਿਰੇ ਹੀ ਇੱਕ-ਦੂਜੇ ਦੇ ਸੰਗਤ ਹੋ ਸਕਦੇ ਹਨ, ਇਸ ਲਈ C↔R।"
        }
      ]
    },
  "GEO-TMP-GAP-W10-CP005-SSS-SIMILARITY-V1": {
      "question": {
        "sourceMasked": "Triangle ABC has sides {{0}}, {{1}}, {{2}} cm. Triangle PQR has corresponding sides {{3}}, {{4}}, {{5}} cm. Which similarity criterion is established directly by these data?",
        "hi": "त्रिभुज ABC की भुजाएँ {{0}}, {{1}}, {{2}} cm हैं। त्रिभुज PQR की संगत भुजाएँ {{3}}, {{4}}, {{5}} cm हैं। इन आँकड़ों से सीधे कौन-सी समरूपता कसौटी स्थापित होती है?",
        "pa": "ਤਿਕੋਣ ABC ਦੀਆਂ ਭੁਜਾਵਾਂ {{0}}, {{1}}, {{2}} cm ਹਨ। ਤਿਕੋਣ PQR ਦੀਆਂ ਸੰਗਤ ਭੁਜਾਵਾਂ {{3}}, {{4}}, {{5}} cm ਹਨ। ਇਨ੍ਹਾਂ ਅੰਕੜਿਆਂ ਨਾਲ ਸਿੱਧੇ ਕਿਹੜੀ ਸਮਰੂਪਤਾ ਕਸੌਟੀ ਸਥਾਪਿਤ ਹੁੰਦੀ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "Each corresponding side pair has the same scale factor.",
          "hi": "हर संगत भुजा-युग्म का माप गुणक समान है।",
          "pa": "ਹਰ ਸੰਗਤ ਭੁਜਾ-ਜੋੜੇ ਦਾ ਮਾਪ ਗੁਣਕ ਇੱਕੋ ਹੈ।"
        },
        {
          "sourceMasked": "Three proportional corresponding side pairs establish triangle similarity by SSS similarity.",
          "hi": "तीन समानुपाती संगत भुजा-युग्म SSS समरूपता से त्रिभुजों की समरूपता स्थापित करते हैं।",
          "pa": "ਤਿੰਨ ਅਨੁਪਾਤੀ ਸੰਗਤ ਭੁਜਾ-ਜੋੜੇ SSS ਸਮਰੂਪਤਾ ਨਾਲ ਤਿਕੋਣਾਂ ਦੀ ਸਮਰੂਪਤਾ ਸਥਾਪਿਤ ਕਰਦੇ ਹਨ।"
        }
      ]
    },
  "GEO-TMP-CP005-MISSING-SIDE-V1": {
      "question": {
        "sourceMasked": "In triangles ABC and PQR, ∠A = ∠P and ∠B = ∠Q. If AB = {{0}} cm, PQ = {{1}} cm and AC = {{2}} cm, find PR.",
        "hi": "त्रिभुज ABC और PQR में ∠A = ∠P तथा ∠B = ∠Q है। यदि AB = {{0}} cm, PQ = {{1}} cm और AC = {{2}} cm है, तो PR ज्ञात कीजिए।",
        "pa": "ਤਿਕੋਣ ABC ਅਤੇ PQR ਵਿੱਚ ∠A = ∠P ਅਤੇ ∠B = ∠Q ਹੈ। ਜੇ AB = {{0}} cm, PQ = {{1}} cm ਅਤੇ AC = {{2}} cm ਹੈ, ਤਾਂ PR ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "The two matching angle pairs make the triangles similar by AA, with A↔P, B↔Q and C↔R.",
          "hi": "दोनों कोण-युग्म बराबर होने से त्रिभुज AA द्वारा समरूप हैं, जहाँ A↔P, B↔Q और C↔R।",
          "pa": "ਦੋਵੇਂ ਕੋਣ-ਜੋੜੇ ਬਰਾਬਰ ਹੋਣ ਕਰਕੇ ਤਿਕੋਣ AA ਨਾਲ ਸਮਰੂਪ ਹਨ, ਜਿੱਥੇ A↔P, B↔Q ਅਤੇ C↔R।"
        },
        {
          "sourceMasked": "The scale factor from ABC to PQR is PQ/AB = {{0}}/{{1}} = {{2}}/{{3}}. Therefore PR = AC × {{4}}/{{5}} = {{6}} × {{7}}/{{8}} = {{9}} cm.",
          "hi": "ABC से PQR का माप गुणक PQ/AB = {{0}}/{{1}} = {{2}}/{{3}} है। अतः PR = AC × {{4}}/{{5}} = {{6}} × {{7}}/{{8}} = {{9}} cm।",
          "pa": "ABC ਤੋਂ PQR ਦਾ ਮਾਪ ਗੁਣਕ PQ/AB = {{0}}/{{1}} = {{2}}/{{3}} ਹੈ। ਇਸ ਲਈ PR = AC × {{4}}/{{5}} = {{6}} × {{7}}/{{8}} = {{9}} cm।"
        }
      ]
    },
  "GEO-TMP-GAP-W4-CP005-PERIMETER-TO-SIDE-V1": {
      "question": {
        "sourceMasked": "The perimeters of similar triangles ABC and PQR are {{0}} cm and {{1}} cm. AB corresponds to PQ and AB = {{2}} cm. What is PQ?",
        "hi": "समरूप त्रिभुज ABC और PQR के परिमाप क्रमशः {{0}} cm और {{1}} cm हैं। AB का संगत PQ है और AB = {{2}} cm है। PQ कितना है?",
        "pa": "ਸਮਰੂਪ ਤਿਕੋਣ ABC ਅਤੇ PQR ਦੇ ਪਰਿਮਾਪ ਕ੍ਰਮਵਾਰ {{0}} cm ਅਤੇ {{1}} cm ਹਨ। AB ਦੇ ਸੰਗਤ PQ ਹੈ ਅਤੇ AB = {{2}} cm ਹੈ। PQ ਕਿੰਨਾ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "PQR is the smaller similar triangle: its perimeter scale relative to ABC is {{0}}/{{1}} = {{2}}/{{3}}.",
          "hi": "PQR छोटा समरूप त्रिभुज है; ABC की तुलना में उसका परिमाप माप {{0}}/{{1}} = {{2}}/{{3}} है।",
          "pa": "PQR ਛੋਟਾ ਸਮਰੂਪ ਤਿਕੋਣ ਹੈ; ABC ਨਾਲ ਤੁਲਨਾ ਵਿੱਚ ਉਸਦਾ ਪਰਿਮਾਪ ਮਾਪ {{0}}/{{1}} = {{2}}/{{3}} ਹੈ।"
        },
        {
          "sourceMasked": "The corresponding side PQ therefore has the same {{0}}/{{1}} scale relative to AB.",
          "hi": "इसलिए संगत भुजा PQ का AB के सापेक्ष वही {{0}}/{{1}} माप होगा।",
          "pa": "ਇਸ ਲਈ ਸੰਗਤ ਭੁਜਾ PQ ਦਾ AB ਦੇ ਮੁਕਾਬਲੇ ਉਹੀ {{0}}/{{1}} ਮਾਪ ਹੋਵੇਗਾ।"
        },
        {
          "sourceMasked": "So PQ = {{0}} × {{1}}/{{2}} = {{3}} cm.",
          "hi": "अतः PQ = {{0}} × {{1}}/{{2}} = {{3}} cm।",
          "pa": "ਇਸ ਲਈ PQ = {{0}} × {{1}}/{{2}} = {{3}} cm।"
        }
      ]
    },
  "GEO-TMP-GAP-W4-CP005-SIDE-TO-PERIMETER-V1": {
      "question": {
        "sourceMasked": "ABC ∼ PQR with AB corresponding to PQ. If AB = {{0}} cm, while PQ = {{1}} cm, QR = {{2}} cm and PR = {{3}} cm, what is the perimeter of ABC?",
        "hi": "ABC ∼ PQR है और AB का संगत PQ है। यदि AB = {{0}} cm, जबकि PQ = {{1}} cm, QR = {{2}} cm और PR = {{3}} cm है, तो ABC का परिमाप कितना है?",
        "pa": "ABC ∼ PQR ਹੈ ਅਤੇ AB ਦੇ ਸੰਗਤ PQ ਹੈ। ਜੇ AB = {{0}} cm, ਜਦਕਿ PQ = {{1}} cm, QR = {{2}} cm ਅਤੇ PR = {{3}} cm ਹੈ, ਤਾਂ ABC ਦਾ ਪਰਿਮਾਪ ਕਿੰਨਾ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "PQR has perimeter {{0}} + {{1}} + {{2}} = {{3}} cm.",
          "hi": "PQR का परिमाप = {{0}} + {{1}} + {{2}} = {{3}} cm।",
          "pa": "PQR ਦਾ ਪਰਿਮਾਪ = {{0}} + {{1}} + {{2}} = {{3}} cm।"
        },
        {
          "sourceMasked": "The corresponding-side scale from PQR to ABC is {{0}}/{{1}} = {{2}}/{{3}}.",
          "hi": "PQR से ABC का संगत-भुजा माप {{0}}/{{1}} = {{2}}/{{3}} है।",
          "pa": "PQR ਤੋਂ ABC ਦਾ ਸੰਗਤ-ਭੁਜਾ ਮਾਪ {{0}}/{{1}} = {{2}}/{{3}} ਹੈ।"
        },
        {
          "sourceMasked": "Apply that same scale to the full perimeter: {{0}} × {{1}}/{{2}} = {{3}} cm.",
          "hi": "इसी माप को पूरे परिमाप पर लागू करें: {{0}} × {{1}}/{{2}} = {{3}} cm।",
          "pa": "ਇਹੀ ਮਾਪ ਪੂਰੇ ਪਰਿਮਾਪ ਉੱਤੇ ਲਗਾਓ: {{0}} × {{1}}/{{2}} = {{3}} cm।"
        }
      ]
    },
  "GEO-TMP-GAP-W10-CP005-AREA-RATIO-TO-SIDE-RATIO-V1": {
      "question": {
        "sourceMasked": "The areas of two similar triangles are in the ratio {{0}}:{{1}}. Find the ratio of a corresponding side of the first triangle to the matching side of the second.",
        "hi": "दो समरूप त्रिभुजों के क्षेत्रफलों का अनुपात {{0}}:{{1}} है। पहले त्रिभुज की किसी संगत भुजा का दूसरे त्रिभुज की संगत भुजा से अनुपात ज्ञात कीजिए।",
        "pa": "ਦੋ ਸਮਰੂਪ ਤਿਕੋਣਾਂ ਦੇ ਖੇਤਰਫਲਾਂ ਦਾ ਅਨੁਪਾਤ {{0}}:{{1}} ਹੈ। ਪਹਿਲੇ ਤਿਕੋਣ ਦੀ ਕਿਸੇ ਸੰਗਤ ਭੁਜਾ ਦਾ ਦੂਜੇ ਤਿਕੋਣ ਦੀ ਸੰਗਤ ਭੁਜਾ ਨਾਲ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "For similar triangles, the area ratio equals the square of the corresponding-side ratio.",
          "hi": "समरूप त्रिभुजों में क्षेत्रफल अनुपात, संगत भुजाओं के अनुपात के वर्ग के बराबर होता है।",
          "pa": "ਸਮਰੂਪ ਤਿਕੋਣਾਂ ਵਿੱਚ ਖੇਤਰਫਲ ਅਨੁਪਾਤ, ਸੰਗਤ ਭੁਜਾਵਾਂ ਦੇ ਅਨੁਪਾਤ ਦੇ ਵਰਗ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।"
        },
        {
          "sourceMasked": "So the side ratio is √{{0}}:√{{1}} = {{2}}:{{3}}.",
          "hi": "इसलिए भुजा अनुपात √{{0}}:√{{1}} = {{2}}:{{3}} है।",
          "pa": "ਇਸ ਲਈ ਭੁਜਾ ਅਨੁਪਾਤ √{{0}}:√{{1}} = {{2}}:{{3}} ਹੈ।"
        }
      ]
    },
  "GEO-TMP-CP005-BPT-DIRECT-V1": {
      "question": {
        "sourceMasked": "In triangle ABC, D lies on AB and E lies on AC, with DE parallel to BC. If AD = {{0}} cm, DB = {{1}} cm and AE = {{2}} cm, find EC.",
        "hi": "त्रिभुज ABC में D, AB पर और E, AC पर है तथा DE ∥ BC है। यदि AD = {{0}} cm, DB = {{1}} cm और AE = {{2}} cm है, तो EC ज्ञात कीजिए।",
        "pa": "ਤਿਕੋਣ ABC ਵਿੱਚ D, AB ਉੱਤੇ ਅਤੇ E, AC ਉੱਤੇ ਹੈ ਅਤੇ DE ∥ BC ਹੈ। ਜੇ AD = {{0}} cm, DB = {{1}} cm ਅਤੇ AE = {{2}} cm ਹੈ, ਤਾਂ EC ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "Because DE is parallel to BC, the Basic Proportionality Theorem gives AD/DB = AE/EC.",
          "hi": "DE ∥ BC होने के कारण मूल समानुपात प्रमेय से AD/DB = AE/EC मिलता है।",
          "pa": "DE ∥ BC ਹੋਣ ਕਰਕੇ ਮੂਲ ਅਨੁਪਾਤ ਪ੍ਰਮੇਯ ਤੋਂ AD/DB = AE/EC ਮਿਲਦਾ ਹੈ।"
        },
        {
          "sourceMasked": "So {{0}}/{{1}} = {{2}}/EC. Cross-multiplying gives {{3}}EC = {{4}}, hence EC = {{5}} cm.",
          "hi": "अतः {{0}}/{{1}} = {{2}}/EC। क्रॉस-गुणन से {{3}}EC = {{4}}, इसलिए EC = {{5}} cm।",
          "pa": "ਇਸ ਲਈ {{0}}/{{1}} = {{2}}/EC। ਕਰਾਸ-ਗੁਣਾ ਕਰਨ ਨਾਲ {{3}}EC = {{4}}, ਇਸ ਲਈ EC = {{5}} cm।"
        }
      ]
    },
  "GEO-TMP-CP006-CENTROID-2TO1-V1": {
      "question": {
        "sourceMasked": "In triangle ABC, AM is a median of length {{0}} cm and G is the centroid on AM. Find AG.",
        "hi": "त्रिभुज ABC में AM की लंबाई {{0}} cm की माध्यिका है और G, AM पर स्थित केन्द्रक है। AG ज्ञात कीजिए।",
        "pa": "ਤਿਕੋਣ ABC ਵਿੱਚ AM ਦੀ ਲੰਬਾਈ {{0}} cm ਵਾਲੀ ਮੱਧਿਕਾ ਹੈ ਅਤੇ G, AM ਉੱਤੇ ਸਥਿਤ ਕੇਂਦਰਕ ਹੈ। AG ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "A centroid divides every median in the ratio {{0}}:{{1}}, with the longer part next to the vertex.",
          "hi": "केन्द्रक प्रत्येक माध्यिका को {{0}}:{{1}} के अनुपात में बाँटता है, जिसमें बड़ा भाग शीर्ष की ओर होता है।",
          "pa": "ਕੇਂਦਰਕ ਹਰ ਮੱਧਿਕਾ ਨੂੰ {{0}}:{{1}} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਦਾ ਹੈ, ਜਿਸ ਵਿੱਚ ਵੱਡਾ ਭਾਗ ਸਿਰੇ ਵੱਲ ਹੁੰਦਾ ਹੈ।"
        },
        {
          "sourceMasked": "So AM is split into {{0}} equal ratio parts. AG = ({{1}}/{{2}}) × {{3}} = {{4}} cm.",
          "hi": "इसलिए AM को {{0}} समान अनुपाती भागों में बाँटा गया है। AG = ({{1}}/{{2}}) × {{3}} = {{4}} cm।",
          "pa": "ਇਸ ਲਈ AM ਨੂੰ {{0}} ਬਰਾਬਰ ਅਨੁਪਾਤੀ ਭਾਗਾਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ। AG = ({{1}}/{{2}}) × {{3}} = {{4}} cm।"
        }
      ]
    },
  "GEO-TMP-GAP-W6-CP006-CENTROID-INVERSE-MEDIAN-V1": {
      "question": {
        "sourceMasked": "In ΔABC, D is the midpoint of BC and G is the centroid on median AD. Given GD = {{0}} cm, what is AD?",
        "hi": "△ABC में D, BC का मध्यबिंदु है और G, माध्यिका AD पर स्थित केन्द्रक है। यदि GD = {{0}} cm है, तो AD कितना है?",
        "pa": "△ABC ਵਿੱਚ D, BC ਦਾ ਮੱਧਬਿੰਦੂ ਹੈ ਅਤੇ G, ਮੱਧਿਕਾ AD ਉੱਤੇ ਸਥਿਤ ਕੇਂਦਰਕ ਹੈ। ਜੇ GD = {{0}} cm ਹੈ, ਤਾਂ AD ਕਿੰਨਾ ਹੈ?"
      },
      "explanations": [
        {
          "sourceMasked": "A centroid divides a median in the ratio {{0}}:{{1}} from the vertex, so GD is one of the three equal ratio parts of AD.",
          "hi": "केन्द्रक माध्यिका को शीर्ष से {{0}}:{{1}} के अनुपात में बाँटता है, इसलिए GD, AD के तीन समान अनुपाती भागों में से एक है।",
          "pa": "ਕੇਂਦਰਕ ਮੱਧਿਕਾ ਨੂੰ ਸਿਰੇ ਤੋਂ {{0}}:{{1}} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਦਾ ਹੈ, ਇਸ ਲਈ GD, AD ਦੇ ਤਿੰਨ ਬਰਾਬਰ ਅਨੁਪਾਤੀ ਭਾਗਾਂ ਵਿੱਚੋਂ ਇੱਕ ਹੈ।"
        },
        {
          "sourceMasked": "Therefore AD = {{0}} × GD = {{1}} × {{2}} = {{3}} cm.",
          "hi": "अतः AD = {{0}} × GD = {{1}} × {{2}} = {{3}} cm।",
          "pa": "ਇਸ ਲਈ AD = {{0}} × GD = {{1}} × {{2}} = {{3}} cm।"
        }
      ]
    },
  "GEO-TMP-CP006-ANGLE-BISECTOR-RATIO-V1": {
      "question": {
        "sourceMasked": "In triangle ABC, D lies on BC and AD bisects ∠A. If AB = {{0}} cm, AC = {{1}} cm and BD = {{2}} cm, find DC.",
        "hi": "त्रिभुज ABC में D, BC पर है और AD, ∠A का समद्विभाजक है। यदि AB = {{0}} cm, AC = {{1}} cm और BD = {{2}} cm है, तो DC ज्ञात कीजिए।",
        "pa": "ਤਿਕੋਣ ABC ਵਿੱਚ D, BC ਉੱਤੇ ਹੈ ਅਤੇ AD, ∠A ਦਾ ਸਮਦੋਭਾਜਕ ਹੈ। ਜੇ AB = {{0}} cm, AC = {{1}} cm ਅਤੇ BD = {{2}} cm ਹੈ, ਤਾਂ DC ਪਤਾ ਕਰੋ।"
      },
      "explanations": [
        {
          "sourceMasked": "Because AD bisects ∠A, the angle-bisector theorem gives BD/DC = AB/AC.",
          "hi": "AD, ∠A का समद्विभाजक है, इसलिए कोण-समद्विभाजक प्रमेय से BD/DC = AB/AC।",
          "pa": "AD, ∠A ਦਾ ਸਮਦੋਭਾਜਕ ਹੈ, ਇਸ ਲਈ ਕੋਣ-ਸਮਦੋਭਾਜਕ ਪ੍ਰਮੇਯ ਤੋਂ BD/DC = AB/AC।"
        },
        {
          "sourceMasked": "Thus {{0}}/DC = {{1}}/{{2}} = {{3}}/{{4}}. Therefore {{5}}DC = {{6}} and DC = {{7}} cm.",
          "hi": "अतः {{0}}/DC = {{1}}/{{2}} = {{3}}/{{4}}। इसलिए {{5}}DC = {{6}} और DC = {{7}} cm।",
          "pa": "ਇਸ ਲਈ {{0}}/DC = {{1}}/{{2}} = {{3}}/{{4}}। ਇਸ ਕਰਕੇ {{5}}DC = {{6}} ਅਤੇ DC = {{7}} cm।"
        }
      ]
    }
}
) as Readonly<Record<string, GeometryPrototypeEditorialTemplateV2>>;
