import type {
  Qcp001AdditionalState,
  Qcp001Language,
  Qcp001Operand,
} from "./types";
const say = (l: Qcp001Language, en: string, hi: string, pa: string) =>
  l === "en" ? en : l === "hi" ? hi : pa;
export function additionalPrompt(
  s: Qcp001AdditionalState,
  l: Qcp001Language,
): string {
  switch (s.kind) {
    case "COMPOUND_INTEREST": {
      const target =
        s.task === "AMOUNT"
          ? say(l, "amount", "मिश्रधन", "ਕੁੱਲ ਰਕਮ")
          : say(l, "compound interest", "चक्रवृद्धि ब्याज", "ਮਿਸ਼ਰਤ ਵਿਆਜ");
      return s.task === "PRINCIPAL"
        ? say(
            l,
            `The principal (in ₹) that becomes ₹${s.amount} in ${s.years} years at ${s.rate}% per annum, compounded annually.`,
            `${s.rate}% वार्षिक चक्रवृद्धि ब्याज पर ${s.years} वर्ष में ₹${s.amount} होने वाला मूलधन (₹ में)।`,
            `${s.rate}% ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਨਾਲ ${s.years} ਸਾਲ ਵਿੱਚ ₹${s.amount} ਬਣਨ ਵਾਲਾ ਮੂਲਧਨ (₹ ਵਿੱਚ)।`,
          )
        : say(
            l,
            `The ${target} (in ₹) on ₹${s.amount} for ${s.years} years at ${s.rate}% per annum, compounded annually.`,
            `₹${s.amount} पर ${s.rate}% वार्षिक चक्रवृद्धि ब्याज की दर से ${s.years} वर्ष का ${target} (₹ में)।`,
            `₹${s.amount} ਉੱਤੇ ${s.rate}% ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀ ਦਰ ਨਾਲ ${s.years} ਸਾਲਾਂ ਲਈ ${target} (₹ ਵਿੱਚ)।`,
          );
    }
    case "WORK":
      return s.task === "COMBINED"
        ? say(
            l,
            `The days needed when A and B work together at constant rates; alone they take ${s.firstTime} and ${s.secondTime} days respectively.`,
            `स्थिर दरों से काम करने वाले A और B मिलकर काम कितने दिन में पूरा करेंगे, यदि अकेले वे क्रमशः ${s.firstTime} और ${s.secondTime} दिन लेते हैं।`,
            `ਸਥਿਰ ਦਰਾਂ ਨਾਲ ਕੰਮ ਕਰਨ ਵਾਲੇ A ਅਤੇ B ਮਿਲ ਕੇ ਕੰਮ ਕਿੰਨੇ ਦਿਨ ਵਿੱਚ ਪੂਰਾ ਕਰਨਗੇ, ਜੇ ਇਕੱਲੇ ਉਹ ਕ੍ਰਮਵਾਰ ${s.firstTime} ਅਤੇ ${s.secondTime} ਦਿਨ ਲੈਂਦੇ ਹਨ।`,
          )
        : say(
            l,
            `The days B alone needs, if A alone takes ${s.firstTime} days and together they take ${s.combinedNumerator}/${s.combinedDenominator} days at constant rates.`,
            `B के अकेले काम पूरा करने का समय (दिनों में), यदि A अकेले ${s.firstTime} दिन और दोनों मिलकर स्थिर दरों से ${s.combinedNumerator}/${s.combinedDenominator} दिन लेते हैं।`,
            `B ਦੇ ਇਕੱਲੇ ਕੰਮ ਪੂਰਾ ਕਰਨ ਦਾ ਸਮਾਂ (ਦਿਨਾਂ ਵਿੱਚ), ਜੇ A ਇਕੱਲਾ ${s.firstTime} ਦਿਨ ਅਤੇ ਦੋਵੇਂ ਮਿਲ ਕੇ ਸਥਿਰ ਦਰਾਂ ਨਾਲ ${s.combinedNumerator}/${s.combinedDenominator} ਦਿਨ ਲੈਂਦੇ ਹਨ।`,
          );
    case "BOATS": {
      const route =
        s.task === "ROUND_TRIP"
          ? say(
              l,
              `travel ${s.distance} km upstream and return to the starting point`,
              `${s.distance} km धारा के विरुद्ध जाकर वापस आने`,
              `${s.distance} km ਧਾਰਾ ਦੇ ਉਲਟ ਜਾ ਕੇ ਵਾਪਸ ਆਉਣ`,
            )
          : say(
              l,
              `travel ${s.distance} km ${s.task === "UPSTREAM" ? "upstream" : "downstream"}`,
              `${s.distance} km ${s.task === "UPSTREAM" ? "धारा के विरुद्ध" : "धारा की दिशा में"} जाने`,
              `${s.distance} km ${s.task === "UPSTREAM" ? "ਧਾਰਾ ਦੇ ਉਲਟ" : "ਧਾਰਾ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ"} ਜਾਣ`,
            );
      return say(
        l,
        `The hours needed by a boat to ${route}, if its still-water speed is ${s.bodySpeed} km/h and the constant current is ${s.streamSpeed} km/h.`,
        `${route} में लगने वाला समय (घंटों में), यदि नाव की शांत जल में चाल ${s.bodySpeed} km/h और धारा की स्थिर चाल ${s.streamSpeed} km/h है।`,
        `${route} ਲਈ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ (ਘੰਟਿਆਂ ਵਿੱਚ), ਜੇ ਕਿਸ਼ਤੀ ਦੀ ਠਹਿਰੇ ਪਾਣੀ ਵਿੱਚ ਚਾਲ ${s.bodySpeed} km/h ਅਤੇ ਧਾਰਾ ਦੀ ਸਥਿਰ ਚਾਲ ${s.streamSpeed} km/h ਹੈ।`,
      );
    }
    case "TRAINS": {
      const direction =
        s.task === "SAME"
          ? say(l, "the same direction", "एक ही दिशा", "ਇੱਕੋ ਦਿਸ਼ਾ")
          : say(l, "opposite directions", "विपरीत दिशाओं", "ਉਲਟ ਦਿਸ਼ਾਵਾਂ");
      return say(
        l,
        `The seconds needed for two trains of lengths ${s.lengthA} m and ${s.lengthB} m, travelling at ${s.speedA} m/s and ${s.speedB} m/s in ${direction}, to completely pass each other.`,
        `${direction} में ${s.speedA} m/s और ${s.speedB} m/s से चल रही ${s.lengthA} m और ${s.lengthB} m लंबी रेलगाड़ियों के एक-दूसरे को पूरी तरह पार करने का समय (सेकंड में)।`,
        `${direction} ਵਿੱਚ ${s.speedA} m/s ਅਤੇ ${s.speedB} m/s ਨਾਲ ਚੱਲ ਰਹੀਆਂ ${s.lengthA} m ਅਤੇ ${s.lengthB} m ਲੰਬੀਆਂ ਰੇਲਗੱਡੀਆਂ ਦੇ ਇੱਕ-ਦੂਜੇ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਨ ਦਾ ਸਮਾਂ (ਸਕਿੰਟਾਂ ਵਿੱਚ)।`,
      );
    }
    case "AGES": {
      const when =
        s.task === "FUTURE"
          ? say(
              l,
              `${s.shift} years later`,
              `${s.shift} वर्ष बाद`,
              `${s.shift} ਸਾਲ ਬਾਅਦ`,
            )
          : say(
              l,
              `${s.shift} years ago`,
              `${s.shift} वर्ष पहले`,
              `${s.shift} ਸਾਲ ਪਹਿਲਾਂ`,
            );
      return say(
        l,
        `The younger person's present age (in years), if two people differ in age by ${s.difference} years and ${when} the older person's age ${s.task === "FUTURE" ? "will be" : "was"} twice the younger's age.`,
        `छोटे व्यक्ति की वर्तमान आयु (वर्षों में), यदि दो व्यक्तियों की आयु में ${s.difference} वर्ष का अंतर है और ${when} बड़े व्यक्ति की आयु छोटे की दुगनी ${s.task === "FUTURE" ? "होगी" : "थी"}।`,
        `ਛੋਟੇ ਵਿਅਕਤੀ ਦੀ ਮੌਜੂਦਾ ਉਮਰ (ਸਾਲਾਂ ਵਿੱਚ), ਜੇ ਦੋ ਵਿਅਕਤੀਆਂ ਦੀ ਉਮਰ ਵਿੱਚ ${s.difference} ਸਾਲ ਦਾ ਫ਼ਰਕ ਹੈ ਅਤੇ ${when} ਵੱਡੇ ਵਿਅਕਤੀ ਦੀ ਉਮਰ ਛੋਟੇ ਤੋਂ ਦੁੱਗਣੀ ${s.task === "FUTURE" ? "ਹੋਵੇਗੀ" : "ਸੀ"}।`,
      );
    }
    case "PROBABILITY": {
      const given = say(
        l,
        `A bag contains ${s.red} red and ${s.blue} blue balls, all equally likely to be drawn.`,
        `एक थैले में ${s.red} लाल और ${s.blue} नीली गेंदें हैं; हर गेंद के चुने जाने की संभावना समान है।`,
        `ਇੱਕ ਥੈਲੇ ਵਿੱਚ ${s.red} ਲਾਲ ਅਤੇ ${s.blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ; ਹਰ ਗੇਂਦ ਦੇ ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ ਬਰਾਬਰ ਹੈ।`,
      );
      const event =
        s.task === "SINGLE"
          ? say(
              l,
              "The probability of drawing a red ball once.",
              "एक बार गेंद निकालने पर लाल गेंद मिलने की प्रायिकता।",
              "ਇੱਕ ਵਾਰ ਗੇਂਦ ਕੱਢਣ ਉੱਤੇ ਲਾਲ ਗੇਂਦ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ।",
            )
          : s.task === "CONDITIONAL"
            ? say(
                l,
                "The probability that the next ball is red, given that one red ball has been drawn and not replaced.",
                "एक लाल गेंद निकालकर वापस न रखने के बाद अगली गेंद लाल होने की प्रायिकता।",
                "ਇੱਕ ਲਾਲ ਗੇਂਦ ਕੱਢ ਕੇ ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੋਂ ਬਾਅਦ ਅਗਲੀ ਗੇਂਦ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ।",
              )
            : say(
                l,
                `The probability that two successive draws are both red, ${s.task === "WITH_REPLACEMENT" ? "replacing the first ball before the second draw" : "without replacing the first ball"}.`,
                `लगातार दो गेंदें निकालने पर दोनों लाल होने की प्रायिकता, ${s.task === "WITH_REPLACEMENT" ? "दूसरी गेंद निकालने से पहले पहली गेंद वापस रखने पर" : "पहली गेंद वापस न रखने पर"}।`,
                `ਲਗਾਤਾਰ ਦੋ ਗੇਂਦਾਂ ਕੱਢਣ ਉੱਤੇ ਦੋਵੇਂ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ, ${s.task === "WITH_REPLACEMENT" ? "ਦੂਜੀ ਗੇਂਦ ਕੱਢਣ ਤੋਂ ਪਹਿਲਾਂ ਪਹਿਲੀ ਵਾਪਸ ਰੱਖਣ ਉੱਤੇ" : "ਪਹਿਲੀ ਗੇਂਦ ਵਾਪਸ ਨਾ ਰੱਖਣ ਉੱਤੇ"}।`,
              );
      return `${given} ${event}`;
    }
    case "MENSURATION":
      return s.task === "TRIANGLE_AREA"
        ? say(
            l,
            `The area (in cm²) of a triangle with base ${s.base} cm and perpendicular height ${s.height} cm.`,
            `${s.base} cm आधार और ${s.height} cm लंबवत ऊँचाई वाले त्रिभुज का क्षेत्रफल (cm² में)।`,
            `${s.base} cm ਆਧਾਰ ਅਤੇ ${s.height} cm ਲੰਬਕਾਰੀ ਉਚਾਈ ਵਾਲੇ ਤਿਕੋਣ ਦਾ ਖੇਤਰਫਲ (cm² ਵਿੱਚ)।`,
          )
        : say(
            l,
            `The perpendicular height (in cm) of a triangle with area ${s.area} cm² and base ${s.base} cm.`,
            `${s.area} cm² क्षेत्रफल और ${s.base} cm आधार वाले त्रिभुज की लंबवत ऊँचाई (cm में)।`,
            `${s.area} cm² ਖੇਤਰਫਲ ਅਤੇ ${s.base} cm ਆਧਾਰ ਵਾਲੇ ਤਿਕੋਣ ਦੀ ਲੰਬਕਾਰੀ ਉਚਾਈ (cm ਵਿੱਚ)।`,
          );
    case "REPLACEMENT":
      return say(
        l,
        `The milk left (in litres) in a vessel initially containing ${s.milk} litres of milk and ${s.water} litres of water, after ${s.cycles} complete cycles of removing ${s.removed} litres of the thoroughly mixed liquid and adding the same amount of water.`,
        `शुरू में ${s.milk} लीटर दूध और ${s.water} लीटर पानी वाले बर्तन में बचा दूध (लीटर में), यदि अच्छी तरह मिले मिश्रण से ${s.removed} लीटर निकालकर उतना ही पानी मिलाने की प्रक्रिया ${s.cycles} बार पूरी की जाए।`,
        `ਸ਼ੁਰੂ ਵਿੱਚ ${s.milk} ਲੀਟਰ ਦੁੱਧ ਅਤੇ ${s.water} ਲੀਟਰ ਪਾਣੀ ਵਾਲੇ ਭਾਂਡੇ ਵਿੱਚ ਬਚਿਆ ਦੁੱਧ (ਲੀਟਰ ਵਿੱਚ), ਜੇ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ ਵਿੱਚੋਂ ${s.removed} ਲੀਟਰ ਕੱਢ ਕੇ ਓਨਾ ਹੀ ਪਾਣੀ ਪਾਉਣ ਦੀ ਪ੍ਰਕਿਰਿਆ ${s.cycles} ਵਾਰ ਪੂਰੀ ਕੀਤੀ ਜਾਵੇ।`,
      );
    case "PRICE_RECOVERY": {
      const first = say(
          l,
          s.firstDirection === "PROFIT" ? "profit" : "loss",
          s.firstDirection === "PROFIT" ? "लाभ" : "हानि",
          s.firstDirection === "PROFIT" ? "ਲਾਭ" : "ਨੁਕਸਾਨ",
        ),
        second = say(
          l,
          s.secondDirection === "PROFIT" ? "profit" : "loss",
          s.secondDirection === "PROFIT" ? "लाभ" : "हानि",
          s.secondDirection === "PROFIT" ? "ਲਾਭ" : "ਨੁਕਸਾਨ",
        );
      return say(
        l,
        `The cost price (in ₹) of an article, if its selling prices at ${s.firstRate}% ${first} and ${s.secondRate}% ${second} differ by ₹${s.difference}.`,
        `${s.firstRate}% ${first} और ${s.secondRate}% ${second} पर विक्रय मूल्यों में ₹${s.difference} का अंतर होने पर वस्तु का क्रय मूल्य (₹ में)।`,
        `${s.firstRate}% ${first} ਅਤੇ ${s.secondRate}% ${second} ਉੱਤੇ ਵੇਚਣ ਦੀਆਂ ਕੀਮਤਾਂ ਵਿੱਚ ₹${s.difference} ਦਾ ਫ਼ਰਕ ਹੋਣ ਉੱਤੇ ਵਸਤੂ ਦੀ ਖਰੀਦ ਕੀਮਤ (₹ ਵਿੱਚ)।`,
      );
    }
  }
}
export function additionalOperandPrompt(o: Qcp001Operand, l: Qcp001Language) {
  const states = o.states as readonly Qcp001AdditionalState[];
  const render = (s: Qcp001AdditionalState) => {
    const text = additionalPrompt(s, l);
    return s.kind === "WORK" && o.label === "Quantity II"
      ? text.replace(/\bA\b/g, "C").replace(/\bB\b/g, "D")
      : text;
  };
  return states.length === 1
    ? render(states[0]!)
    : say(
        l,
        "Any one of the following independent cases may apply:",
        "निम्न स्वतंत्र स्थितियों में से कोई एक संभव है:",
        "ਹੇਠ ਲਿਖੀਆਂ ਸੁਤੰਤਰ ਸਥਿਤੀਆਂ ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਸੰਭਵ ਹੈ:",
      ) +
        "\n" +
        states.map((s, i) => `${i + 1}. ${render(s)}`).join("\n");
}
export function additionalWorking(
  s: Qcp001AdditionalState,
  text: string,
): string {
  switch (s.kind) {
    case "COMPOUND_INTEREST":
      return `${s.task === "PRINCIPAL" ? `${s.amount} / (1 + ${s.rate}/100)^${s.years}` : `${s.amount} × ((1 + ${s.rate}/100)^${s.years}${s.task === "INTEREST" ? " − 1" : ""})`} = ${text}`;
    case "WORK":
      return `${s.task === "COMBINED" ? `1 / (1/${s.firstTime} + 1/${s.secondTime})` : `1 / (${s.combinedDenominator}/${s.combinedNumerator} − 1/${s.firstTime})`} = ${text}`;
    case "BOATS":
      return `${s.task === "ROUND_TRIP" ? `${s.distance}/(${s.bodySpeed}−${s.streamSpeed}) + ${s.distance}/(${s.bodySpeed}+${s.streamSpeed})` : `${s.distance}/(${s.bodySpeed}${s.task === "UPSTREAM" ? "−" : "+"}${s.streamSpeed})`} = ${text}`;
    case "TRAINS":
      return `(${s.lengthA}+${s.lengthB}) / (${s.speedA}${s.task === "SAME" ? "−" : "+"}${s.speedB}) = ${text}`;
    case "AGES":
      return `x + ${s.difference} ${s.task === "FUTURE" ? "+" : "−"} ${s.shift} = 2(x ${s.task === "FUTURE" ? "+" : "−"} ${s.shift}) ⇒ x = ${text}`;
    case "PROBABILITY": {
      const n = s.red + s.blue;
      return `${s.task === "SINGLE" ? `${s.red}/${n}` : s.task === "CONDITIONAL" ? `(${s.red}−1)/(${n}−1)` : `${s.red}/${n} × ${s.task === "WITH_REPLACEMENT" ? `${s.red}/${n}` : `(${s.red}−1)/(${n}−1)`}`} = ${text}`;
    }
    case "MENSURATION":
      return `${s.task === "TRIANGLE_AREA" ? `${s.base} × ${s.height} / 2` : `2 × ${s.area} / ${s.base}`} = ${text}`;
    case "REPLACEMENT":
      return `${s.milk} × (1 − ${s.removed}/(${s.milk}+${s.water}))^${s.cycles} = ${text}`;
    case "PRICE_RECOVERY":
      return `${s.difference} × 100 / |${s.firstDirection === "LOSS" ? "−" : ""}${s.firstRate} − (${s.secondDirection === "LOSS" ? "−" : ""}${s.secondRate})| = ${text}`;
  }
}
