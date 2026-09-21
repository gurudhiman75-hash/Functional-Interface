import { generateDirectionQuestion } from "../chapter-registry";
import {
  asR,
  coordinateText,
  directionAngleHi,
  directionHi,
  metres,
  nameHi,
  pathMovementLineHi,
  pathSummaryLineHi,
  reverseTurnCalculationStepsHi,
  turnCalculationStepsHi,
  type R,
} from "./hindi-foundation";
import { localizeDiagramHindi, optionLabelHindi } from "./hindi-editorial-overrides";
import { renderHindiStem } from "./hindi-stems";
import type { LocalizedDirectionExplanation, LocalizedDirectionOption, LocalizedDirectionQuestion } from "./types";

function renderExplanation(english: R): LocalizedDirectionExplanation {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  const answer = optionLabelHindi(asR(english.options?.[english.correctIndex] ?? {}));
  const diagram = localizeDiagramHindi(asR(english.explanation)?.diagram);
  const stem = renderHindiStem(english);
  const context = stem.replace(/[^।?]*\?$/, "").trim() || stem;
  const base: LocalizedDirectionExplanation = {
    given: `दिया गया विवरण: ${context}`,
    steps: ["हर चाल या संबंध को एक ही स्थिर दिशा-फ्रेम में रखें।", "फिर पूछे गए दो बिंदुओं या अवस्थाओं की तुलना करें।"],
    resultLine: `गणना से परिणाम ${answer} मिलता है।`,
    conclusion: /है[।.]?$/.test(answer) ? `अतः सही निष्कर्ष: ${answer}` : `अतः सही उत्तर ${answer} है।`,
    ...(diagram ? { diagram } : {}),
  };
  if (qlId === "DIR-QL-001") {
    return {
      ...base,
      steps: turnCalculationStepsHi(s.initialFacing, s.turns ?? []),
      resultLine: `सभी मोड़ लगाने के बाद मुख ${answer} की ओर है।`,
    };
  }
  if (qlId === "DIR-QL-002") {
    return {
      ...base,
      steps: reverseTurnCalculationStepsHi(s.finalFacing, s.turns ?? []),
      resultLine: `मोड़ों को उलटे क्रम में वापस लेने पर आरंभिक दिशा ${answer} मिलती है।`,
    };
  }
  if (qlId === "DIR-QL-003") {
    const initialAngle = directionAngleHi(s.initialFacing);
    const finalAngle = directionAngleHi(s.finalFacing);
    return {
      ...base,
      steps: [
        `आरंभिक दिशा ${directionHi(s.initialFacing)} है, अर्थात ${initialAngle}°।`,
        `अंतिम दिशा ${directionHi(s.finalFacing)} है, अर्थात ${finalAngle}°।`,
        `इन दोनों दिशाओं के बीच आवश्यक परिवर्तन ${answer} है।`,
      ],
      resultLine: `इसलिए लिया गया मोड़ ${answer} है।`,
    };
  }
  if (["DIR-QL-004", "DIR-QL-005", "DIR-QL-006", "DIR-QL-007", "DIR-QL-008", "DIR-QL-009", "DIR-QL-010"].includes(qlId)) {
    const sourceExplanation = asR(english.explanation);
    const movementLines = (sourceExplanation.movementLines ?? []).map((line: string) => pathMovementLineHi(String(line)));
    const points = asR(sourceExplanation.diagram)?.points ?? [];
    const endPoint = asR(points.find((point: R) => point.role === "END") ?? {}).coordinate;
    const steps: string[] = [...movementLines];
    if (endPoint) {
      steps.push(`सभी चालें जोड़ने पर अंतिम बिंदु आरंभ से ${coordinateText(asR(endPoint))} है।`);
    }
    if (sourceExplanation.netLine) steps.push(pathSummaryLineHi(String(sourceExplanation.netLine)));
    if (sourceExplanation.calculationLine) steps.push(pathSummaryLineHi(String(sourceExplanation.calculationLine)));
    if (qlId === "DIR-QL-008") {
      const total = (asR(sourceExplanation.diagram)?.segments ?? []).reduce(
        (sum: number, segment: R) => sum + Number(segment.distance ?? 0),
        0,
      );
      steps.push(`कुल चली दूरी = ${total} मीटर; सीधी न्यूनतम दूरी अंतिम विस्थापन से अलग मिलती है।`);
    }
    return {
      ...base,
      steps,
      resultLine: `इस मार्ग से सही परिणाम ${answer} है।`,
    };
  }
  if (["DIR-QL-036", "DIR-QL-037", "DIR-QL-038", "DIR-QL-039", "DIR-QL-040", "DIR-QL-041", "DIR-QL-042", "DIR-QL-043", "DIR-QL-044"].includes(qlId)) {
    if (qlId === "DIR-QL-036") {
      return {
        ...base,
        steps: [
          `दिए गए तीन संबंधों से ${nameHi(s.missingFrom)} और ${nameHi(s.missingTo)} की स्थिति तय करें।`,
          `दोनों स्थानों की तुलना करने पर ${nameHi(s.missingTo)}, ${nameHi(s.missingFrom)} के ${answer} में है।`,
        ],
        resultLine: `इसलिए छूटी हुई दिशा ${answer} है।`,
      };
    }
    if (qlId === "DIR-QL-037") {
      return {
        ...base,
        steps: [
          "पहले दिए गए दो आधार संबंधों से पहले तीन बिंदुओं की स्थिति तय करें।",
          "अब चारों कथनों को एक-एक करके उन्हीं स्थानों से मिलाएँ।",
          `जो कथन किसी बिंदु को बाकी जानकारी से अलग स्थान पर रखता है, वही असंगत है; यहाँ वह ${answer} है।`,
        ],
        resultLine: `असंगत कथन ${answer} है।`,
      };
    }
    if (qlId === "DIR-QL-038") {
      const unknown = asR((s.legs ?? [])[Number(s.unknownIndex ?? 0)] ?? {});
      return {
        ...base,
        steps: [
          "पहले सभी ज्ञात चालों को जोड़कर उनका अंतिम स्थान निकालें।",
          `दिया गया अंतिम स्थान आरंभिक बिंदु से ${coordinateText(asR(s.target))} है।`,
          `बाकी ${metres(unknown.distance)} की चाल को इस अंतिम स्थान तक पहुँचाने के लिए ${answer} दिशा में होना चाहिए।`,
        ],
        resultLine: `अज्ञात चाल की दिशा ${answer} है।`,
      };
    }
    if (qlId === "DIR-QL-039") {
      return {
        ...base,
        steps: [
          `पहली ${metres(s.firstDistance)} की चाल को आरंभिक मुख-दिशा से लागू करें।`,
          "फिर बाएँ, दाएँ, पीछे मुड़ना और बिना मुड़े चलना—इन चारों सम्भावनाओं को बाकी चालों के साथ जाँचें।",
          `केवल ${answer} लेने पर दिया गया अंतिम स्थान मिलता है।`,
        ],
        resultLine: `अज्ञात मोड़ ${answer} है।`,
      };
    }
    if (qlId === "DIR-QL-040") {
      return {
        ...base,
        steps: [
          "उत्तर, पूर्व, दक्षिण और पश्चिम—चारों को सम्भावित आरंभिक दिशा मानकर वही मार्ग चलाएँ।",
          `दिया गया अंतिम स्थान आरंभिक बिंदु से ${coordinateText(asR(s.target))} है।`,
          `केवल ${answer} से शुरू करने पर मार्ग उसी अंतिम स्थान तक पहुँचता है।`,
        ],
        resultLine: `आरंभिक मुख-दिशा ${answer} है।`,
      };
    }
    if (qlId === "DIR-QL-041") {
      return {
        ...base,
        steps: [
          `पहले दिए गए स्थान-संबंधों से ${nameHi(s.startEntity)} और ${nameHi(s.referenceEntity)} की स्थिति तय करें।`,
          `फिर ${nameHi(s.startEntity)} से दी गई चालों को क्रम से लागू करके अंतिम स्थान निकालें।`,
          `अंतिम स्थान की ${nameHi(s.referenceEntity)} से सीधी तुलना करने पर उत्तर ${answer} मिलता है।`,
        ],
        resultLine: `अंतिम संबंध ${answer} है।`,
      };
    }
    if (qlId === "DIR-QL-042") {
      return {
        ...base,
        steps: [
          `चौकी ${String(s.checkpoint)} से आरंभ करके सभी चाल और मोड़ क्रम से लागू करें।`,
          "अंतिम बिंदु मिलने के बाद उसकी चौकी से सीधी दिशा देखें; अंतिम मुख-दिशा को उत्तर न मानें।",
          `अंतिम बिंदु चौकी के ${answer} में है।`,
        ],
        resultLine: `चौकी से आवश्यक दिशा ${answer} है।`,
      };
    }
    if (qlId === "DIR-QL-043") {
      return {
        ...base,
        steps: [
          `चौकी ${String(s.checkpoint)} से पूरा मार्ग चलाकर अंतिम बिंदु निकालें।`,
          "चौकी और अंतिम बिंदु के पूर्व-पश्चिम तथा उत्तर-दक्षिण अंतर को अलग-अलग निकालें।",
          `इन दोनों अंतर से सीधी न्यूनतम दूरी ${answer} मिलती है।`,
        ],
        resultLine: `चौकी से न्यूनतम दूरी ${answer} है।`,
      };
    }
    return {
      ...base,
      steps: [
        "चित्र में दिए गए दोनों स्थान-संबंध पहले पढ़ें।",
        "इसके बाद लिखित संबंध को उसी जानकारी से जोड़ें।",
        `तीनों संबंधों को साथ रखने पर पूछे गए दोनों बिंदुओं की दिशा ${answer} मिलती है।`,
      ],
      resultLine: `चित्र और कथन दोनों से उत्तर ${answer} है।`,
    };
  }

  if (["DIR-QL-011", "DIR-QL-012", "DIR-QL-013", "DIR-QL-014", "DIR-QL-015"].includes(qlId)) {
    return { ...base, steps: ["एक संदर्भ बिंदु को स्थिर मानकर बाकी बिंदुओं को क्रम से रखें।", qlId === "DIR-QL-037" ? "प्रत्येक अतिरिक्त कथन को हटाकर शेष विन्यास की संगति जाँचें।" : "स्वतंत्र मार्गों से प्राप्त स्थान एक-दूसरे से मेल खाने चाहिए।", "अब पूछे गए बिंदुओं का आपसी संबंध पढ़ें।"], resultLine: `विन्यास से उत्तर ${answer} मिलता है।` };
  }
  if (["DIR-QL-016", "DIR-QL-017", "DIR-QL-018", "DIR-QL-019", "DIR-QL-020", "DIR-QL-021", "DIR-QL-022"].includes(qlId)) {
    return { ...base, steps: ["सभी अंतिम स्थानों को समान आरंभिक निर्देशांक-फ्रेम में रखें।", "प्रश्न के अनुसार दिशा, दूरी, चरम स्थान या समान स्थान की तुलना करें।"], resultLine: `अंतिम स्थानों की तुलना से उत्तर ${answer} है।` };
  }
  if (["DIR-QL-023", "DIR-QL-024", "DIR-QL-025", "DIR-QL-026", "DIR-QL-027", "DIR-QL-028", "DIR-QL-029"].includes(qlId)) {
    return { ...base, steps: ["संकेतित कथनों को विषय–चिह्न–संदर्भ क्रम में पढ़ें।", qlId === "DIR-QL-025" || qlId === "DIR-QL-028" ? "संभावित चिह्नों को एक-एक करके जाँचें और केवल संगत विकल्प रखें।" : "डिकोड किए गए संबंधों या चालों को क्रम से जोड़ें।"], resultLine: `डिकोड करने पर सही उत्तर ${answer} है।` };
  }
  if (["DIR-QL-030", "DIR-QL-031", "DIR-QL-032", "DIR-QL-033", "DIR-QL-034", "DIR-QL-035"].includes(qlId)) {
    return { ...base, steps: ["पहले समय से सूर्य और छाया की वास्तविक दिशा तय करें।", "फिर व्यक्ति के मुख के सापेक्ष बाएँ, दाएँ, सामने या पीछे का संबंध लगाएँ।", qlId === "DIR-QL-034" ? "अंत में दिए गए मोड़ों को क्रम से लागू करें।" : "दिए गए व्यक्ति-संबंध के अनुसार अंतिम मुख तय करें।"], resultLine: `पर्यावरणीय संकेत से उत्तर ${answer} है।` };
  }
  if (["DIR-QL-038", "DIR-QL-039", "DIR-QL-040"].includes(qlId)) {
    return { ...base, steps: ["ज्ञात चालों को पहले लागू करें।", "हर सम्भव दिशा/मोड़/आरंभिक मुख का परीक्षण करें।", "जो एकमात्र विकल्प दिए गए अंतिम स्थान तक पहुँचता है, वही सही है।"], resultLine: `एकमात्र संगत उत्तर ${answer} है।` };
  }
  if (["DIR-QL-041", "DIR-QL-042", "DIR-QL-043"].includes(qlId)) {
    return { ...base, steps: ["पहले आरंभिक स्थान या चौकी के सापेक्ष शुद्ध क्षैतिज और ऊर्ध्वाधर घटक निकालें।", qlId === "DIR-QL-043" ? "इन घटकों पर पाइथागोरस प्रमेय लगाकर सीधी दूरी निकालें।" : "घटकों के चिन्ह से दिशा और परिमाण से दूरी तय करें।"], resultLine: `संयुक्त गणना से उत्तर ${answer} है।` };
  }
  return base;
}

export function localizeDirectionQuestionHindi(englishQuestion: unknown): LocalizedDirectionQuestion {
  const english = asR(englishQuestion);
  const options: LocalizedDirectionOption[] = (english.options ?? []).map((option: R) => ({
    value: option.value,
    label: optionLabelHindi(option),
    errorLabel: option.errorLabel ?? null,
  }));
  if (options.length !== 4 || new Set(options.map((option) => option.label)).size !== 4) {
    throw new Error(`DIR Hindi options must remain four and unique for ${english.qlId} seed ${english.seed}`);
  }
  const questionDiagram = localizeDiagramHindi(english.questionDiagram);
  return {
    locale: "hi-IN",
    qlId: String(english.qlId),
    checkpointId: String(english.checkpointId),
    ruleId: String(english.ruleId),
    seed: Number(english.seed),
    difficulty: english.difficulty,
    stem: renderHindiStem(english),
    structuredPrompt: english.structuredPrompt,
    ...(questionDiagram ? { questionDiagram } : {}),
    options,
    correctIndex: Number(english.correctIndex),
    correctAnswer: english.correctAnswer,
    explanation: renderExplanation(english),
    metadata: {
      ...(english.metadata ?? {}),
      locale: "hi-IN",
      sourceLocale: "en-IN",
      localizationMode: "LANGUAGE_ADAPTED",
      answerParityVerified: true,
    },
  };
}

export function generateDirectionQuestionHindi(qlId: string, seed = 0): LocalizedDirectionQuestion {
  return localizeDirectionQuestionHindi(generateDirectionQuestion(qlId, seed));
}
