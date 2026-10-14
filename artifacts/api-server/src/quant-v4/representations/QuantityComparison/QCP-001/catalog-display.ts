import { validateCatalogState, type QcpCatalogState } from "./catalog-schema";
import type { Qcp001Language } from "./types";
export function catalogPrompt(
  s: QcpCatalogState,
  language: Qcp001Language,
): string {
  validateCatalogState(s);
  const k = s.scale,
    left = s.quantity === "I";
  const say = (en: string, hi: string, pa: string) =>
    language === "en" ? en : language === "hi" ? hi : pa;
  const literal = (x: number) =>
    say(`The number ${x}`, `संख्या ${x}`, `ਸੰਖਿਆ ${x}`);
  switch (s.pattern) {
    case "BA24-01":
      return left
        ? say(
            `Still-water speed (km/h): downstream ${54 * k} km in ${9 * k} h; upstream ${40 * k} km in ${10 * k} h.`,
            `शांत जल में चाल (km/h): धारा के साथ ${54 * k} km में ${9 * k} h; धारा के विरुद्ध ${40 * k} km में ${10 * k} h।`,
            `ਸ਼ਾਂਤ ਪਾਣੀ ਵਿੱਚ ਚਾਲ (km/h): ਧਾਰਾ ਨਾਲ ${54 * k} km ਲਈ ${9 * k} h; ਧਾਰਾ ਵਿਰੁੱਧ ${40 * k} km ਲਈ ${10 * k} h।`,
          )
        : say(
            `Still-water speed (km/h): downstream ${45 * k} km in ${9 * k} h; current 1 km/h.`,
            `शांत जल में चाल (km/h): धारा के साथ ${45 * k} km में ${9 * k} h; धारा की चाल 1 km/h।`,
            `ਸ਼ਾਂਤ ਪਾਣੀ ਵਿੱਚ ਚਾਲ (km/h): ਧਾਰਾ ਨਾਲ ${45 * k} km ਲਈ ${9 * k} h; ਧਾਰਾ ਦੀ ਚਾਲ 1 km/h।`,
          );
    case "BA24-02":
      return left
        ? say(
            `Older person's current age: younger age is one-seventh of older age; after ${5 * k} years younger age is ${12 * k} years.`,
            `बड़े व्यक्ति की वर्तमान आयु: छोटे की आयु बड़े की 1/7 है; ${5 * k} वर्ष बाद छोटे की आयु ${12 * k} वर्ष है।`,
            `ਵੱਡੇ ਵਿਅਕਤੀ ਦੀ ਮੌਜੂਦਾ ਉਮਰ: ਛੋਟੇ ਦੀ ਉਮਰ ਵੱਡੇ ਦੀ 1/7 ਹੈ; ${5 * k} ਸਾਲ ਬਾਅਦ ਛੋਟੇ ਦੀ ਉਮਰ ${12 * k} ਸਾਲ ਹੈ।`,
          )
        : say(
            `Older person's current age: younger:older = 3:7 now and 6:13 after ${3 * k} years.`,
            `बड़े व्यक्ति की वर्तमान आयु: अभी छोटे:बड़े = 3:7 और ${3 * k} वर्ष बाद 6:13।`,
            `ਵੱਡੇ ਵਿਅਕਤੀ ਦੀ ਮੌਜੂਦਾ ਉਮਰ: ਹੁਣ ਛੋਟਾ:ਵੱਡਾ = 3:7 ਅਤੇ ${3 * k} ਸਾਲ ਬਾਅਦ 6:13।`,
          );
    case "BA24-03":
      return left
        ? say(
            `Probability of no purple ball in two draws without replacement from ${3 * k} green, ${2 * k} yellow and ${3 * k} purple balls.`,
            `${3 * k} हरी, ${2 * k} पीली और ${3 * k} बैंगनी गेंदों से बिना प्रतिस्थापन दो गेंदें निकालने पर कोई बैंगनी न आने की प्रायिकता।`,
            `${3 * k} ਹਰੀਆਂ, ${2 * k} ਪੀਲੀਆਂ ਅਤੇ ${3 * k} ਜਾਮਨੀ ਗੇਂਦਾਂ ਵਿੱਚੋਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਦੋ ਕੱਢਣ ਉੱਤੇ ਕੋਈ ਜਾਮਨੀ ਨਾ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ।`,
          )
        : say(
            "x, where (7x − 8)(14x − 5) = 0; include every real root.",
            "x, जहाँ (7x − 8)(14x − 5) = 0; सभी वास्तविक मूल लें।",
            "x, ਜਿੱਥੇ (7x − 8)(14x − 5) = 0; ਸਾਰੇ ਅਸਲ ਮੂਲ ਲਓ।",
          );
    case "BA24-04":
      return left
        ? say(
            `Area (cm²) of a square with side ${24 * k} cm.`,
            `${24 * k} cm भुजा वाले वर्ग का क्षेत्रफल (cm²)।`,
            `${24 * k} cm ਭੁਜਾ ਵਾਲੇ ਵਰਗ ਦਾ ਖੇਤਰਫਲ (cm²)।`,
          )
        : say(
            `Area (cm²) of a rectangle: perimeter ${88 * k} cm; length:width = 6:5.`,
            `आयत का क्षेत्रफल (cm²): परिमाप ${88 * k} cm; लंबाई:चौड़ाई = 6:5।`,
            `ਆਇਤ ਦਾ ਖੇਤਰਫਲ (cm²): ਘੇਰਾ ${88 * k} cm; ਲੰਬਾਈ:ਚੌੜਾਈ = 6:5।`,
          );
    case "BA24-06":
      return left
        ? say(
            `Selling price (₹): cost ₹${50000 * k}, profit 20%.`,
            `विक्रय मूल्य (₹): लागत ₹${50000 * k}, लाभ 20%।`,
            `ਵਿਕਰੀ ਮੁੱਲ (₹): ਲਾਗਤ ₹${50000 * k}, ਲਾਭ 20%।`,
          )
        : say(
            `Final selling price (₹): cost ₹${50000 * k}; net profit after a 25% marked-price discount is 50/3% of cost.`,
            `अंतिम विक्रय मूल्य (₹): लागत ₹${50000 * k}; अंकित मूल्य पर 25% छूट के बाद शुद्ध लाभ लागत का 50/3% है।`,
            `ਅੰਤਿਮ ਵਿਕਰੀ ਮੁੱਲ (₹): ਲਾਗਤ ₹${50000 * k}; ਅੰਕਿਤ ਮੁੱਲ ਉੱਤੇ 25% ਛੂਟ ਤੋਂ ਬਾਅਦ ਸ਼ੁੱਧ ਲਾਭ ਲਾਗਤ ਦਾ 50/3% ਹੈ।`,
          );
    case "BA24-10": {
      const urn = say(
        `An urn contains ${6 * k} pink, ${5 * k} blue, ${3 * k} green and ${6 * k} yellow balls. Three are drawn without replacement.`,
        `पात्र में ${6 * k} गुलाबी, ${5 * k} नीली, ${3 * k} हरी और ${6 * k} पीली गेंदें हैं। बिना प्रतिस्थापन तीन निकालें।`,
        `ਭਾਂਡੇ ਵਿੱਚ ${6 * k} ਗੁਲਾਬੀ, ${5 * k} ਨੀਲੀਆਂ, ${3 * k} ਹਰੀਆਂ ਅਤੇ ${6 * k} ਪੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਤਿੰਨ ਕੱਢੋ।`,
      );
      return (
        urn +
        " " +
        (left
          ? say(
              "Probability that all three are blue OR all three are yellow (one colour only).",
              "तीनों नीली अथवा तीनों पीली होने की प्रायिकता (केवल एक रंग)।",
              "ਤਿੰਨੇ ਨੀਲੀਆਂ ਜਾਂ ਤਿੰਨੇ ਪੀਲੀਆਂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ (ਕੇਵਲ ਇੱਕ ਰੰਗ)।",
            )
          : say(
              "Probability that all three have different colours.",
              "तीनों के अलग-अलग रंग होने की प्रायिकता।",
              "ਤਿੰਨਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਰੰਗ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ।",
            ))
      );
    }
    case "BA24-11": {
      const m = 100 - 25 * k;
      return (
        say(
          `Upstream speed is ${m}% less than downstream speed. `,
          `धारा के विरुद्ध चाल, धारा के साथ चाल से ${m}% कम है। `,
          `ਧਾਰਾ ਵਿਰੁੱਧ ਚਾਲ, ਧਾਰਾ ਨਾਲ ਚਾਲ ਤੋਂ ${m}% ਘੱਟ ਹੈ। `,
        ) +
        (left
          ? say(
              "Current speed as a percentage of downstream speed.",
              "धारा की चाल, धारा के साथ चाल का कितने प्रतिशत है?",
              "ਧਾਰਾ ਦੀ ਚਾਲ, ਧਾਰਾ ਨਾਲ ਚਾਲ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?",
            )
          : say(
              "Percentage by which current speed is less than still-water speed.",
              "धारा की चाल, शांत जल की चाल से कितने प्रतिशत कम है?",
              "ਧਾਰਾ ਦੀ ਚਾਲ, ਸ਼ਾਂਤ ਪਾਣੀ ਦੀ ਚਾਲ ਤੋਂ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਹੈ?",
            ))
      );
    }
    case "BA24-12":
      return left
        ? say(
            `Marked price (₹): invoice ₹${850.5 * k} after 10% discount and then 5% tax on the discounted price.`,
            `अंकित मूल्य (₹): 10% छूट और फिर छूट वाले मूल्य पर 5% कर के बाद बिल ₹${850.5 * k} है।`,
            `ਅੰਕਿਤ ਮੁੱਲ (₹): 10% ਛੂਟ ਅਤੇ ਫਿਰ ਛੂਟ ਵਾਲੇ ਮੁੱਲ ਉੱਤੇ 5% ਕਰ ਤੋਂ ਬਾਅਦ ਬਿੱਲ ₹${850.5 * k} ਹੈ।`,
          )
        : literal(900 * k);
    case "BA24-13": {
      const variable = left ? "x" : "y",
        equation = left
          ? `x² + ${k}√3x − ${60 * k * k} = 0`
          : `y² + ${7 * k}√2y + ${20 * k * k} = 0`;
      return say(
        `${variable}, where ${equation}; include every real root.`,
        `${variable}, जहाँ ${equation}; सभी वास्तविक मूल लें।`,
        `${variable}, ਜਿੱਥੇ ${equation}; ਸਾਰੇ ਅਸਲ ਮੂਲ ਲਓ।`,
      );
    }
    case "BA24-14":
      return (
        say(
          `A:B income = 4:5 and the income difference is ₹${10000 * k}. `,
          `A:B आय = 4:5 और आय का अंतर ₹${10000 * k} है। `,
          `A:B ਆਮਦਨ = 4:5 ਅਤੇ ਆਮਦਨ ਦਾ ਫ਼ਰਕ ₹${10000 * k} ਹੈ। `,
        ) +
        (left
          ? say(
              "A's expenditure (₹), if A saves 30%.",
              "A का खर्च (₹), यदि A 30% बचाता है।",
              "A ਦਾ ਖ਼ਰਚ (₹), ਜੇ A 30% ਬਚਾਉਂਦਾ ਹੈ।",
            )
          : say(
              "B's savings (₹), if B spends 45%.",
              "B की बचत (₹), यदि B 45% खर्च करता है।",
              "B ਦੀ ਬੱਚਤ (₹), ਜੇ B 45% ਖ਼ਰਚ ਕਰਦਾ ਹੈ।",
            ))
      );
    case "BA24-15":
      return (
        say(
          `P and Q together finish in ${30 * k} days; P is 20% more efficient than Q. `,
          `P और Q मिलकर ${30 * k} दिनों में काम करते हैं; P, Q से 20% अधिक कुशल है। `,
          `P ਅਤੇ Q ਮਿਲ ਕੇ ${30 * k} ਦਿਨਾਂ ਵਿੱਚ ਕੰਮ ਕਰਦੇ ਹਨ; P, Q ਤੋਂ 20% ਵੱਧ ਕੁਸ਼ਲ ਹੈ। `,
        ) +
        (left
          ? say(
              "Days for P to complete 2/5 of the work at 25% of P's normal rate.",
              "P द्वारा अपनी सामान्य दर के 25% पर काम का 2/5 करने में दिन।",
              "P ਨੂੰ ਆਪਣੀ ਆਮ ਦਰ ਦੇ 25% ਉੱਤੇ ਕੰਮ ਦਾ 2/5 ਕਰਨ ਲਈ ਦਿਨ।",
            )
          : say(
              "Days for Q to complete half the work at 40% of Q's normal rate.",
              "Q द्वारा अपनी सामान्य दर के 40% पर आधा काम करने में दिन।",
              "Q ਨੂੰ ਆਪਣੀ ਆਮ ਦਰ ਦੇ 40% ਉੱਤੇ ਅੱਧਾ ਕੰਮ ਕਰਨ ਲਈ ਦਿਨ।",
            ))
      );
    case "BA24-16":
      return (
        say(
          `Still-water speed is 500% more than current speed. Upstream takes ${40 * k} h longer than downstream for ${1050 * k} km. `,
          `शांत जल की चाल धारा की चाल से 500% अधिक है। ${1050 * k} km में धारा के विरुद्ध ${40 * k} h अधिक लगते हैं। `,
          `ਸ਼ਾਂਤ ਪਾਣੀ ਦੀ ਚਾਲ ਧਾਰਾ ਦੀ ਚਾਲ ਤੋਂ 500% ਵੱਧ ਹੈ। ${1050 * k} km ਲਈ ਧਾਰਾ ਵਿਰੁੱਧ ${40 * k} h ਵੱਧ ਲੱਗਦੇ ਹਨ। `,
        ) +
        (left
          ? say(
              `Hours upstream for ${1050 * k} km.`,
              `${1050 * k} km धारा के विरुद्ध जाने में घंटे।`,
              `${1050 * k} km ਧਾਰਾ ਵਿਰੁੱਧ ਜਾਣ ਲਈ ਘੰਟੇ।`,
            )
          : say(
              `Hours downstream for ${1500 * k} km if current increases by 20% and still-water speed stays fixed.`,
              `${1500 * k} km धारा के साथ जाने में घंटे, यदि धारा की चाल 20% बढ़े और शांत जल की चाल स्थिर रहे।`,
              `${1500 * k} km ਧਾਰਾ ਨਾਲ ਜਾਣ ਲਈ ਘੰਟੇ, ਜੇ ਧਾਰਾ ਦੀ ਚਾਲ 20% ਵਧੇ ਅਤੇ ਸ਼ਾਂਤ ਪਾਣੀ ਦੀ ਚਾਲ ਸਥਿਰ ਰਹੇ।`,
            ))
      );
    case "BA24-18":
      return (
        say(
          `Initially milk:water = 3:2 and water is ${5 * k} L. `,
          `आरंभ में दूध:पानी = 3:2 और पानी ${5 * k} L है। `,
          `ਸ਼ੁਰੂ ਵਿੱਚ ਦੁੱਧ:ਪਾਣੀ = 3:2 ਅਤੇ ਪਾਣੀ ${5 * k} L ਹੈ। `,
        ) +
        (left
          ? say(
              `Milk percentage after adding ${1.5 * k} L pure milk.`,
              `शुद्ध दूध ${1.5 * k} L मिलाने के बाद दूध का प्रतिशत।`,
              `ਸ਼ੁੱਧ ਦੁੱਧ ${1.5 * k} L ਮਿਲਾਉਣ ਤੋਂ ਬਾਅਦ ਦੁੱਧ ਦਾ ਪ੍ਰਤੀਸ਼ਤ।`,
            )
          : say(
              `Milk percentage if instead water alone is reduced to ${3.5 * k} L and milk stays unchanged.`,
              `इसके बजाय केवल पानी ${3.5 * k} L रह जाए और दूध न बदले, तो दूध का प्रतिशत।`,
              `ਇਸ ਦੀ ਥਾਂ ਕੇਵਲ ਪਾਣੀ ${3.5 * k} L ਰਹਿ ਜਾਵੇ ਅਤੇ ਦੁੱਧ ਨਾ ਬਦਲੇ, ਤਾਂ ਦੁੱਧ ਦਾ ਪ੍ਰਤੀਸ਼ਤ।`,
            ))
      );
    case "BA24-19":
      return (
        say(
          "Still-water:current speed = 3:1, with difference 4 km/h. ",
          "शांत जल:धारा की चाल = 3:1, अंतर 4 km/h। ",
          "ਸ਼ਾਂਤ ਪਾਣੀ:ਧਾਰਾ ਦੀ ਚਾਲ = 3:1, ਫ਼ਰਕ 4 km/h। ",
        ) +
        (left
          ? say(
              `Upstream distance x (km), if upstream x km and downstream (x + ${20 * k}) km take ${17.5 * k} h total.`,
              `धारा के विरुद्ध दूरी x (km), यदि विरुद्ध x km और साथ (x + ${20 * k}) km में कुल ${17.5 * k} h लगें।`,
              `ਧਾਰਾ ਵਿਰੁੱਧ ਦੂਰੀ x (km), ਜੇ ਵਿਰੁੱਧ x km ਅਤੇ ਨਾਲ (x + ${20 * k}) km ਲਈ ਕੁੱਲ ${17.5 * k} h ਲੱਗਣ।`,
            )
          : say(
              `Downstream distance (km) in ${21 * k}/4 h.`,
              `${21 * k}/4 h में धारा के साथ दूरी (km)।`,
              `${21 * k}/4 h ਵਿੱਚ ਧਾਰਾ ਨਾਲ ਦੂਰੀ (km)।`,
            ))
      );
    case "BA24-20":
      return left
        ? say(
            `Train speed (m/s): length ${500 * k} m; completely crosses an ${800 * k} m platform in ${130 * k} s.`,
            `रेलगाड़ी की चाल (m/s): लंबाई ${500 * k} m; ${800 * k} m प्लेटफॉर्म को पूरी तरह ${130 * k} s में पार करे।`,
            `ਰੇਲਗੱਡੀ ਦੀ ਚਾਲ (m/s): ਲੰਬਾਈ ${500 * k} m; ${800 * k} m ਪਲੇਟਫਾਰਮ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ${130 * k} s ਵਿੱਚ ਪਾਰ ਕਰੇ।`,
          )
        : say(
            `Man's speed (m/s): a ${500 * k} m train moves at 10 m/s; the faster man passes the entire train in ${500 * k} s while moving in the same direction.`,
            `व्यक्ति की चाल (m/s): ${500 * k} m रेलगाड़ी 10 m/s से चले; अधिक तेज व्यक्ति उसी दिशा में चलकर पूरी रेलगाड़ी को ${500 * k} s में पार करे।`,
            `ਵਿਅਕਤੀ ਦੀ ਚਾਲ (m/s): ${500 * k} m ਰੇਲਗੱਡੀ 10 m/s ਨਾਲ ਚੱਲੇ; ਵੱਧ ਤੇਜ਼ ਵਿਅਕਤੀ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲ ਕੇ ਪੂਰੀ ਰੇਲਗੱਡੀ ਨੂੰ ${500 * k} s ਵਿੱਚ ਪਾਰ ਕਰੇ।`,
          );
    case "BA22-01":
      return left
        ? say(
            `Q − P, where (2/5)P = (1/4)Q and 37.5% of (P + Q) is ${234 * k}.`,
            `Q − P, जहाँ (2/5)P = (1/4)Q और (P + Q) का 37.5% = ${234 * k}।`,
            `Q − P, ਜਿੱਥੇ (2/5)P = (1/4)Q ਅਤੇ (P + Q) ਦਾ 37.5% = ${234 * k}।`,
          )
        : literal(144 * k);
    case "BA22-02":
      return left
        ? say(
            `Principal (₹): two-year compound interest is ₹${7040 * k}, at 20% annually with annual compounding.`,
            `मूलधन (₹): वार्षिक चक्रवृद्धि पर 20% वार्षिक दर से दो वर्ष का चक्रवृद्धि ब्याज ₹${7040 * k} है।`,
            `ਮੂਲਧਨ (₹): ਸਾਲਾਨਾ ਚੱਕਰਵ੍ਰਿੱਧੀ ਉੱਤੇ 20% ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਦੋ ਸਾਲ ਦਾ ਚੱਕਰਵ੍ਰਿੱਧੀ ਵਿਆਜ ₹${7040 * k} ਹੈ।`,
          )
        : literal(20000 * k);
    case "BA22-03":
      return left
        ? say(
            `Percentage increase in cylinder curved surface area if radius increases by ${20 + 5 * k}% and height by ${25 + 5 * k}%.`,
            `बेलन के वक्र पृष्ठीय क्षेत्रफल में प्रतिशत वृद्धि, यदि त्रिज्या ${20 + 5 * k}% और ऊँचाई ${25 + 5 * k}% बढ़े।`,
            `ਬੇਲਣ ਦੇ ਵਕਰ ਸਤਹ ਖੇਤਰਫਲ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ, ਜੇ ਅਰਧ ਵਿਆਸ ${20 + 5 * k}% ਅਤੇ ਉਚਾਈ ${25 + 5 * k}% ਵਧੇ।`,
          )
        : literal(62.5);
    case "BA22-04": {
      const m = 4 + k,
        N = 3 * m - 3;
      return left
        ? say(
            `Number of blue balls: an urn contains ${m} pink and some blue balls only; the probability of two pink balls without replacement is ${m * (m - 1)}/${N * (N - 1)}.`,
            `नीली गेंदों की संख्या: पात्र में केवल ${m} गुलाबी और कुछ नीली गेंदें हैं; बिना प्रतिस्थापन दो गुलाबी की प्रायिकता ${m * (m - 1)}/${N * (N - 1)} है।`,
            `ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਦੀ ਗਿਣਤੀ: ਭਾਂਡੇ ਵਿੱਚ ਕੇਵਲ ${m} ਗੁਲਾਬੀ ਅਤੇ ਕੁਝ ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ; ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਦੋ ਗੁਲਾਬੀ ਦੀ ਸੰਭਾਵਨਾ ${m * (m - 1)}/${N * (N - 1)} ਹੈ।`,
          )
        : literal(6);
    }
    case "BA22-05":
      return left
        ? say(
            `Older person's current age: age difference ${6 * k} years; younger:older = 11:14 after ${10 * k} years.`,
            `बड़े व्यक्ति की वर्तमान आयु: अंतर ${6 * k} वर्ष; ${10 * k} वर्ष बाद छोटे:बड़े = 11:14।`,
            `ਵੱਡੇ ਵਿਅਕਤੀ ਦੀ ਮੌਜੂਦਾ ਉਮਰ: ਫ਼ਰਕ ${6 * k} ਸਾਲ; ${10 * k} ਸਾਲ ਬਾਅਦ ਛੋਟਾ:ਵੱਡਾ = 11:14।`,
          )
        : literal(20 * k);
  }
}
