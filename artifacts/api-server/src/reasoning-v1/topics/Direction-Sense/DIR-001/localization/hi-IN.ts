import { generateDirectionQuestion } from "../chapter-registry";
import { asR, directionHi, turnSequence, type R } from "./hindi-foundation";
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
  if (["DIR-QL-001", "DIR-QL-002", "DIR-QL-003"].includes(qlId)) {
    return { ...base, steps: [`निर्देशों को क्रम से लागू करें: ${turnSequence(s.turns ?? []) || `${directionHi(s.initialFacing)} से ${directionHi(s.finalFacing)}`}.`, "दाएँ और बाएँ घुमाव को मूल दिशा पर बार-बार नहीं, वर्तमान दिशा पर लागू करें।"], resultLine: `आवश्यक दिशा/निर्देश ${answer} है।` };
  }
  if (["DIR-QL-004", "DIR-QL-005", "DIR-QL-006", "DIR-QL-007", "DIR-QL-008", "DIR-QL-009", "DIR-QL-010"].includes(qlId)) {
    return { ...base, steps: ["हर मोड़ के बाद नई मुख-दिशा तय करें और अगली चाल उसी दिशा में रखें।", "पूर्व-पश्चिम तथा उत्तर-दक्षिण की शुद्ध चालों को अलग-अलग जोड़ें।", qlId === "DIR-QL-008" ? "कुल चली दूरी और सीधी न्यूनतम दूरी अलग राशियाँ हैं।" : "अंतिम विस्थापन से दिशा या न्यूनतम दूरी प्राप्त करें।"], resultLine: `मार्ग का सही परिणाम ${answer} है।` };
  }
  if (["DIR-QL-011", "DIR-QL-012", "DIR-QL-013", "DIR-QL-014", "DIR-QL-015", "DIR-QL-036", "DIR-QL-037", "DIR-QL-044"].includes(qlId)) {
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
