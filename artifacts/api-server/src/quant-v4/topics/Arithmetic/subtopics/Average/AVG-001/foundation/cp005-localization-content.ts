import { getAvg001QuestionEntry } from "./library";
import type { Avg001QuestionPackage } from "./types";

export type Avg001Cp005PilotLanguage = "hi" | "pa";
type UnitKind = "marks" | "currency" | "years" | "units" | "runs" | "kg" | "none";

type ContextWords = {
  averagePhrase: string;
  entryLabel: string;
  countLabel: string;
  correctedAverageLabel: string;
  reportedAverageLabel: string;
  correctValueLabel: string;
  incorrectValueLabel: string;
  differenceLabel: string;
  averageChangeLabel: string;
};

const HI: Record<string, ContextWords> = {
  examMarksCorrection: {
    averagePhrase: "विद्यार्थियों के अंकों का औसत",
    entryLabel: "अंक-पंजी की प्रविष्टि",
    countLabel: "विद्यार्थियों की संख्या",
    correctedAverageLabel: "सही औसत अंक",
    reportedAverageLabel: "पहले बताया गया औसत अंक",
    correctValueLabel: "सही अंक",
    incorrectValueLabel: "गलत दर्ज अंक",
    differenceLabel: "अंक-प्रविष्टियों का अंतर",
    averageChangeLabel: "औसत अंकों में परिवर्तन",
  },
  salaryRegisterCorrection: {
    averagePhrase: "कर्मचारियों का औसत मासिक वेतन",
    entryLabel: "वेतन-पंजी की प्रविष्टि",
    countLabel: "कर्मचारियों की संख्या",
    correctedAverageLabel: "सही औसत मासिक वेतन",
    reportedAverageLabel: "पहले बताया गया औसत मासिक वेतन",
    correctValueLabel: "सही मासिक वेतन",
    incorrectValueLabel: "गलत दर्ज वेतन",
    differenceLabel: "वेतन-प्रविष्टियों का अंतर",
    averageChangeLabel: "औसत वेतन में परिवर्तन",
  },
  ageRegisterCorrection: {
    averagePhrase: "लोगों की औसत आयु",
    entryLabel: "आयु-पंजी की प्रविष्टि",
    countLabel: "लोगों की संख्या",
    correctedAverageLabel: "सही औसत आयु",
    reportedAverageLabel: "पहले बताई गई औसत आयु",
    correctValueLabel: "सही आयु",
    incorrectValueLabel: "गलत दर्ज आयु",
    differenceLabel: "आयु-प्रविष्टियों का अंतर",
    averageChangeLabel: "औसत आयु में परिवर्तन",
  },
  factoryOutputCorrection: {
    averagePhrase: "मशीनों का औसत दैनिक उत्पादन",
    entryLabel: "उत्पादन-पंजी की प्रविष्टि",
    countLabel: "मशीनों की संख्या",
    correctedAverageLabel: "सही औसत दैनिक उत्पादन",
    reportedAverageLabel: "पहले बताया गया औसत उत्पादन",
    correctValueLabel: "सही उत्पादन",
    incorrectValueLabel: "गलत दर्ज उत्पादन",
    differenceLabel: "उत्पादन-प्रविष्टियों का अंतर",
    averageChangeLabel: "औसत उत्पादन में परिवर्तन",
  },
  shopSalesCorrection: {
    averagePhrase: "दुकानों की औसत दैनिक बिक्री",
    entryLabel: "बिक्री-पंजी की प्रविष्टि",
    countLabel: "दुकानों की संख्या",
    correctedAverageLabel: "सही औसत दैनिक बिक्री",
    reportedAverageLabel: "पहले बताई गई औसत बिक्री",
    correctValueLabel: "सही बिक्री",
    incorrectValueLabel: "गलत दर्ज बिक्री",
    differenceLabel: "बिक्री-प्रविष्टियों का अंतर",
    averageChangeLabel: "औसत बिक्री में परिवर्तन",
  },
  inningsRunsCorrection: {
    averagePhrase: "पारियों का औसत रन-मान",
    entryLabel: "पारी-पंजी की रन-प्रविष्टि",
    countLabel: "पारियों की संख्या",
    correctedAverageLabel: "सही बल्लेबाजी औसत",
    reportedAverageLabel: "पहले बताया गया बल्लेबाजी औसत",
    correctValueLabel: "सही रन",
    incorrectValueLabel: "गलत दर्ज रन",
    differenceLabel: "रन-प्रविष्टियों का अंतर",
    averageChangeLabel: "बल्लेबाजी औसत में परिवर्तन",
  },
  parcelWeightCorrection: {
    averagePhrase: "पार्सलों का औसत वजन",
    entryLabel: "वजन-पंजी की प्रविष्टि",
    countLabel: "पार्सलों की संख्या",
    correctedAverageLabel: "सही औसत वजन",
    reportedAverageLabel: "पहले बताया गया औसत वजन",
    correctValueLabel: "सही वजन",
    incorrectValueLabel: "गलत दर्ज वजन",
    differenceLabel: "वजन-प्रविष्टियों का अंतर",
    averageChangeLabel: "औसत वजन में परिवर्तन",
  },
  recordCountCorrection: {
    averagePhrase: "अभिलेखों का औसत मान",
    entryLabel: "अभिलेख-पंजी की प्रविष्टि",
    countLabel: "अभिलेखों की संख्या",
    correctedAverageLabel: "सही औसत",
    reportedAverageLabel: "पहले बताया गया औसत",
    correctValueLabel: "सही मान",
    incorrectValueLabel: "गलत दर्ज मान",
    differenceLabel: "दोनों प्रविष्टियों का अंतर",
    averageChangeLabel: "औसत में परिवर्तन",
  },
};

const PA: Record<string, ContextWords> = {
  examMarksCorrection: {
    averagePhrase: "ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ",
    entryLabel: "ਅੰਕ-ਰਜਿਸਟਰ ਦੀ ਐਂਟਰੀ",
    countLabel: "ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ",
    correctedAverageLabel: "ਸਹੀ ਔਸਤ ਅੰਕ",
    reportedAverageLabel: "ਪਹਿਲਾਂ ਦਰਜ ਔਸਤ ਅੰਕ",
    correctValueLabel: "ਸਹੀ ਅੰਕ",
    incorrectValueLabel: "ਗਲਤ ਦਰਜ ਅੰਕ",
    differenceLabel: "ਅੰਕ-ਐਂਟਰੀਆਂ ਦਾ ਅੰਤਰ",
    averageChangeLabel: "ਔਸਤ ਅੰਕਾਂ ਵਿੱਚ ਤਬਦੀਲੀ",
  },
  salaryRegisterCorrection: {
    averagePhrase: "ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ",
    entryLabel: "ਤਨਖਾਹ-ਰਜਿਸਟਰ ਦੀ ਐਂਟਰੀ",
    countLabel: "ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ",
    correctedAverageLabel: "ਸਹੀ ਔਸਤ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ",
    reportedAverageLabel: "ਪਹਿਲਾਂ ਦਰਜ ਔਸਤ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ",
    correctValueLabel: "ਸਹੀ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ",
    incorrectValueLabel: "ਗਲਤ ਦਰਜ ਤਨਖਾਹ",
    differenceLabel: "ਤਨਖਾਹ-ਐਂਟਰੀਆਂ ਦਾ ਅੰਤਰ",
    averageChangeLabel: "ਔਸਤ ਤਨਖਾਹ ਵਿੱਚ ਤਬਦੀਲੀ",
  },
  ageRegisterCorrection: {
    averagePhrase: "ਲੋਕਾਂ ਦੀ ਔਸਤ ਉਮਰ",
    entryLabel: "ਉਮਰ-ਰਜਿਸਟਰ ਦੀ ਐਂਟਰੀ",
    countLabel: "ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ",
    correctedAverageLabel: "ਸਹੀ ਔਸਤ ਉਮਰ",
    reportedAverageLabel: "ਪਹਿਲਾਂ ਦਰਜ ਔਸਤ ਉਮਰ",
    correctValueLabel: "ਸਹੀ ਉਮਰ",
    incorrectValueLabel: "ਗਲਤ ਦਰਜ ਉਮਰ",
    differenceLabel: "ਉਮਰ-ਐਂਟਰੀਆਂ ਦਾ ਅੰਤਰ",
    averageChangeLabel: "ਔਸਤ ਉਮਰ ਵਿੱਚ ਤਬਦੀਲੀ",
  },
  factoryOutputCorrection: {
    averagePhrase: "ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ",
    entryLabel: "ਉਤਪਾਦਨ-ਰਜਿਸਟਰ ਦੀ ਐਂਟਰੀ",
    countLabel: "ਮਸ਼ੀਨਾਂ ਦੀ ਗਿਣਤੀ",
    correctedAverageLabel: "ਸਹੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ",
    reportedAverageLabel: "ਪਹਿਲਾਂ ਦਰਜ ਔਸਤ ਉਤਪਾਦਨ",
    correctValueLabel: "ਸਹੀ ਉਤਪਾਦਨ",
    incorrectValueLabel: "ਗਲਤ ਦਰਜ ਉਤਪਾਦਨ",
    differenceLabel: "ਉਤਪਾਦਨ-ਐਂਟਰੀਆਂ ਦਾ ਅੰਤਰ",
    averageChangeLabel: "ਔਸਤ ਉਤਪਾਦਨ ਵਿੱਚ ਤਬਦੀਲੀ",
  },
  shopSalesCorrection: {
    averagePhrase: "ਦੁਕਾਨਾਂ ਦੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ",
    entryLabel: "ਵਿਕਰੀ-ਰਜਿਸਟਰ ਦੀ ਐਂਟਰੀ",
    countLabel: "ਦੁਕਾਨਾਂ ਦੀ ਗਿਣਤੀ",
    correctedAverageLabel: "ਸਹੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ",
    reportedAverageLabel: "ਪਹਿਲਾਂ ਦਰਜ ਔਸਤ ਵਿਕਰੀ",
    correctValueLabel: "ਸਹੀ ਵਿਕਰੀ",
    incorrectValueLabel: "ਗਲਤ ਦਰਜ ਵਿਕਰੀ",
    differenceLabel: "ਵਿਕਰੀ-ਐਂਟਰੀਆਂ ਦਾ ਅੰਤਰ",
    averageChangeLabel: "ਔਸਤ ਵਿਕਰੀ ਵਿੱਚ ਤਬਦੀਲੀ",
  },
  inningsRunsCorrection: {
    averagePhrase: "ਪਾਰੀਆਂ ਦੀ ਔਸਤ ਦੌੜ-ਗਿਣਤੀ",
    entryLabel: "ਪਾਰੀ-ਰਜਿਸਟਰ ਦੀ ਦੌੜ-ਐਂਟਰੀ",
    countLabel: "ਪਾਰੀਆਂ ਦੀ ਗਿਣਤੀ",
    correctedAverageLabel: "ਸਹੀ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ",
    reportedAverageLabel: "ਪਹਿਲਾਂ ਦਰਜ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ",
    correctValueLabel: "ਸਹੀ ਦੌੜਾਂ",
    incorrectValueLabel: "ਗਲਤ ਦਰਜ ਦੌੜਾਂ",
    differenceLabel: "ਦੌੜ-ਐਂਟਰੀਆਂ ਦਾ ਅੰਤਰ",
    averageChangeLabel: "ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ ਵਿੱਚ ਤਬਦੀਲੀ",
  },
  parcelWeightCorrection: {
    averagePhrase: "ਪਾਰਸਲਾਂ ਦਾ ਔਸਤ ਵਜ਼ਨ",
    entryLabel: "ਵਜ਼ਨ-ਰਜਿਸਟਰ ਦੀ ਐਂਟਰੀ",
    countLabel: "ਪਾਰਸਲਾਂ ਦੀ ਗਿਣਤੀ",
    correctedAverageLabel: "ਸਹੀ ਔਸਤ ਵਜ਼ਨ",
    reportedAverageLabel: "ਪਹਿਲਾਂ ਦਰਜ ਔਸਤ ਵਜ਼ਨ",
    correctValueLabel: "ਸਹੀ ਵਜ਼ਨ",
    incorrectValueLabel: "ਗਲਤ ਦਰਜ ਵਜ਼ਨ",
    differenceLabel: "ਵਜ਼ਨ-ਐਂਟਰੀਆਂ ਦਾ ਅੰਤਰ",
    averageChangeLabel: "ਔਸਤ ਵਜ਼ਨ ਵਿੱਚ ਤਬਦੀਲੀ",
  },
  recordCountCorrection: {
    averagePhrase: "ਰਿਕਾਰਡਾਂ ਦੇ ਮੁੱਲਾਂ ਦੀ ਔਸਤ",
    entryLabel: "ਰਿਕਾਰਡ-ਰਜਿਸਟਰ ਦੀ ਐਂਟਰੀ",
    countLabel: "ਰਿਕਾਰਡਾਂ ਦੀ ਗਿਣਤੀ",
    correctedAverageLabel: "ਸਹੀ ਔਸਤ",
    reportedAverageLabel: "ਪਹਿਲਾਂ ਦਰਜ ਔਸਤ",
    correctValueLabel: "ਸਹੀ ਮੁੱਲ",
    incorrectValueLabel: "ਗਲਤ ਦਰਜ ਮੁੱਲ",
    differenceLabel: "ਦੋਵਾਂ ਐਂਟਰੀਆਂ ਦਾ ਅੰਤਰ",
    averageChangeLabel: "ਔਸਤ ਵਿੱਚ ਤਬਦੀਲੀ",
  },
};

function contextKey(pkg: Avg001QuestionPackage) {
  return pkg.parameters.scenarioVariant.split("_")[0]!;
}

function words(pkg: Avg001QuestionPackage, language: Avg001Cp005PilotLanguage) {
  const value = (language === "hi" ? HI : PA)[contextKey(pkg)];
  if (!value) throw new Error(`Missing CP-005 localization context ${pkg.parameters.scenarioVariant}`);
  return value;
}

function localVariant(pkg: Avg001QuestionPackage) {
  const value = Number(pkg.parameters.scenarioVariant.split("_").at(-1));
  return Number.isInteger(value) ? value : 1;
}

function unitKind(pkg: Avg001QuestionPackage): UnitKind {
  return ((getAvg001QuestionEntry(pkg.questionLanguageId) as { unitKind?: UnitKind }).unitKind ?? "none");
}

function raw(pkg: Avg001QuestionPackage, key: string) {
  const value = pkg.parameters.renderVariables[key];
  if (value === undefined) throw new Error(`${pkg.questionLanguageId}: missing ${key}`);
  return String(value);
}

function numberFromAnswer(pkg: Avg001QuestionPackage) {
  return pkg.answer.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0] ?? pkg.answer;
}

function display(value: string, kind: UnitKind, language: Avg001Cp005PilotLanguage) {
  if (kind === "currency") return `₹${value}`;
  if (kind === "marks") return `${value} ${language === "hi" ? "अंक" : "ਅੰਕ"}`;
  if (kind === "years") return `${value} ${language === "hi" ? "वर्ष" : "ਸਾਲ"}`;
  if (kind === "units") return `${value} ${language === "hi" ? "इकाइयाँ" : "ਇਕਾਈਆਂ"}`;
  if (kind === "runs") return `${value} ${language === "hi" ? "रन" : "ਦੌੜਾਂ"}`;
  if (kind === "kg") return `${value} ${language === "hi" ? "किग्रा" : "ਕਿਲੋਗ੍ਰਾਮ"}`;
  return value;
}

function displayed(pkg: Avg001QuestionPackage, key: string, language: Avg001Cp005PilotLanguage) {
  return display(raw(pkg, key), unitKind(pkg), language);
}

function localizedAnswer(pkg: Avg001QuestionPackage, language: Avg001Cp005PilotLanguage) {
  if (pkg.parameters.answerType === "COUNT") return numberFromAnswer(pkg);
  return display(numberFromAnswer(pkg), unitKind(pkg), language);
}

function stemHi(pkg: Avg001QuestionPackage) {
  const w = words(pkg, "hi");
  const v = localVariant(pkg) % 3;
  const count = raw(pkg, "count");
  const reported = displayed(pkg, "reportedAverage", "hi");
  const corrected = displayed(pkg, "correctedAverage", "hi");
  const wrong = displayed(pkg, "incorrectValue", "hi");
  const correct = displayed(pkg, "correctValue", "hi");
  const difference = displayed(pkg, "entryDifference", "hi");
  const change = displayed(pkg, "averageChange", "hi");
  const wrong2 = displayed(pkg, "incorrectValue2", "hi");
  const correct2 = displayed(pkg, "correctValue2", "hi");
  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake":
      if (v === 0) return `${w.entryLabel} की जाँच में पता चला कि ${count} ${w.averagePhrase} ${reported} निकालते समय ${wrong} लिया गया, जबकि ${correct} होना चाहिए था। ${w.correctedAverageLabel} ज्ञात कीजिए।`;
      if (v === 1) return `${count} ${w.averagePhrase} ${reported} बताया गया। ${w.entryLabel} में ${wrong} के स्थान पर ${correct} होना चाहिए था। ${w.correctedAverageLabel} ज्ञात कीजिए।`;
      return `${count} ${w.averagePhrase} ${reported} निकला क्योंकि ${w.entryLabel} में ${correct} की जगह ${wrong} दर्ज था। त्रुटि सुधारकर ${w.correctedAverageLabel} निकालिए।`;
    case "findReportedAverageBeforeCorrection":
      if (v === 0) return `${w.entryLabel} को ${wrong} से ${correct} करने पर ${count} ${w.averagePhrase} ${corrected} हो गया। सुधार से पहले का औसत ज्ञात कीजिए।`;
      if (v === 1) return `${count} ${w.averagePhrase} सुधार के बाद ${corrected} है। पहले ${correct} के स्थान पर ${wrong} दर्ज था। ${w.reportedAverageLabel} निकालिए।`;
      return `${wrong} वाली ${w.entryLabel} को ${correct} करने के बाद ${count} ${w.averagePhrase} ${corrected} मिला। पुराना बताया गया औसत ज्ञात कीजिए।`;
    case "findCorrectValueFromAverageShift":
      if (v === 0) return `${count} ${w.averagePhrase} ${reported} से ${corrected} हो गया जब ${w.entryLabel} में दर्ज ${wrong} सुधारा गया। ${w.correctValueLabel} ज्ञात कीजिए।`;
      if (v === 1) return `${w.entryLabel} में ${wrong} होने से ${count} ${w.averagePhrase} ${reported} था; सही औसत ${corrected} है। सही प्रविष्टि निकालिए।`;
      return `${count} ${w.averagePhrase} को ${reported} से ${corrected} करने के लिए ${wrong} वाली ${w.entryLabel} बदली गई। उसका सही मान ज्ञात कीजिए।`;
    case "findIncorrectValueFromCorrection":
      if (v === 0) return `${count} ${w.averagePhrase} ${reported} से ${corrected} हुआ जब एक ${w.entryLabel} को ${correct} किया गया। ${w.incorrectValueLabel} ज्ञात कीजिए।`;
      if (v === 1) return `एक ${w.entryLabel} का सही मान ${correct} है। उसे सुधारने पर ${count} ${w.averagePhrase} ${reported} से ${corrected} हो गया। पहले दर्ज मान को निकालिए।`;
      return `${count} ${w.averagePhrase} पहले ${reported} और सुधार के बाद ${corrected} था। बदली गई ${w.entryLabel} अब ${correct} है। उसका गलत पुराना मान ज्ञात कीजिए।`;
    case "findEntryDifferenceFromAverageCorrection":
      if (v === 0) return `एक ${w.entryLabel} सुधारने पर ${count} ${w.averagePhrase} ${reported} से ${corrected} हो गया। ${w.differenceLabel} ज्ञात कीजिए।`;
      if (v === 1) return `${count} ${w.averagePhrase} में ${change} का परिवर्तन एक ही ${w.entryLabel} सुधारने से आया। गलत और सही मान का अंतर निकालिए।`;
      return `${w.entryLabel} की एक त्रुटि ने ${count} ${w.averagePhrase} को ${reported} से ${corrected} कर दिया। प्रविष्टि की त्रुटि का परिमाण ज्ञात कीजिए।`;
    case "findAverageChangeFromEntryCorrection":
      if (v === 0) return `${count} के समूह में ${w.entryLabel} ${wrong} से ${correct} की जाती है। ${w.averageChangeLabel} ज्ञात कीजिए।`;
      if (v === 1) return `${count} ${w.averagePhrase} निकालते समय ${wrong} की जगह ${correct} रखने से कुल ${difference} बदलता है। औसत में परिवर्तन निकालिए।`;
      return `${w.entryLabel} में ${wrong} को ${correct} से बदलना है और कुल ${count} मान हैं। औसत कितने से बदलेगा?`;
    case "findNumberOfItemsFromTotalCorrection":
      if (v === 0) return `${w.entryLabel} में ${wrong} के स्थान पर ${correct} करने से औसत ${change} बदलता है। ${w.countLabel} ज्ञात कीजिए।`;
      if (v === 1) return `एक गलत और सही ${w.entryLabel} का अंतर ${difference} है तथा औसत में परिवर्तन ${change} है। ${w.countLabel} निकालिए।`;
      return `${wrong} को ${correct} से बदलने पर औसत ${change} बदल गया। इस गणना में शामिल ${w.countLabel} ज्ञात कीजिए।`;
    case "findCorrectedAverageFromMultipleMistakes":
      if (v === 0) return `${count} ${w.averagePhrase} ${reported} बताया गया। दो ${w.entryLabel} क्रमशः ${wrong}, ${wrong2} थीं, जिन्हें ${correct}, ${correct2} होना चाहिए था। ${w.correctedAverageLabel} ज्ञात कीजिए।`;
      if (v === 1) return `${count} ${w.averagePhrase} ${reported} है। ${w.entryLabel} में ${wrong} को ${correct} और ${wrong2} को ${correct2} करने के बाद सही औसत निकालिए।`;
      return `दो गलत ${w.entryLabel} के कारण ${count} ${w.averagePhrase} ${reported} आया। सुधार ${wrong} से ${correct} तथा ${wrong2} से ${correct2} हैं। संशोधित औसत ज्ञात कीजिए।`;
    default: throw new Error(`Unsupported CP-005 solve mode ${pkg.solveMode}`);
  }
}

function stemPa(pkg: Avg001QuestionPackage) {
  const w = words(pkg, "pa");
  const v = localVariant(pkg) % 3;
  const count = raw(pkg, "count");
  const reported = displayed(pkg, "reportedAverage", "pa");
  const corrected = displayed(pkg, "correctedAverage", "pa");
  const wrong = displayed(pkg, "incorrectValue", "pa");
  const correct = displayed(pkg, "correctValue", "pa");
  const difference = displayed(pkg, "entryDifference", "pa");
  const change = displayed(pkg, "averageChange", "pa");
  const wrong2 = displayed(pkg, "incorrectValue2", "pa");
  const correct2 = displayed(pkg, "correctValue2", "pa");
  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake":
      if (v === 0) return `${w.entryLabel} ਦੀ ਜਾਂਚ ਵਿੱਚ ਪਤਾ ਲੱਗਿਆ ਕਿ ${count} ${w.averagePhrase} ${reported} ਕੱਢਦੇ ਸਮੇਂ ${wrong} ਲਿਆ ਗਿਆ, ਜਦਕਿ ${correct} ਦਰਜ ਹੋਣਾ ਚਾਹੀਦਾ ਸੀ। ${w.correctedAverageLabel} ਪਤਾ ਕਰੋ।`;
      if (v === 1) return `${count} ${w.averagePhrase} ${reported} ਦਰਜ ਕੀਤੀ ਗਈ। ${w.entryLabel} ਵਿੱਚ ${wrong} ਦੀ ਥਾਂ ${correct} ਦਰਜ ਹੋਣਾ ਚਾਹੀਦਾ ਸੀ। ${w.correctedAverageLabel} ਪਤਾ ਕਰੋ।`;
      return `${count} ${w.averagePhrase} ${reported} ਆਈ ਕਿਉਂਕਿ ${w.entryLabel} ਵਿੱਚ ${correct} ਦੀ ਥਾਂ ${wrong} ਦਰਜ ਸੀ। ਗਲਤੀ ਠੀਕ ਕਰਕੇ ${w.correctedAverageLabel} ਕੱਢੋ।`;
    case "findReportedAverageBeforeCorrection":
      if (v === 0) return `${w.entryLabel} ਨੂੰ ${wrong} ਤੋਂ ${correct} ਕਰਨ ਉੱਤੇ ${count} ${w.averagePhrase} ${corrected} ਹੋ ਗਈ। ਸੁਧਾਰ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`;
      if (v === 1) return `${count} ${w.averagePhrase} ਸੁਧਾਰ ਤੋਂ ਬਾਅਦ ${corrected} ਹੈ। ਪਹਿਲਾਂ ${correct} ਦੀ ਥਾਂ ${wrong} ਦਰਜ ਸੀ। ${w.reportedAverageLabel} ਕੱਢੋ।`;
      return `${wrong} ਵਾਲੀ ${w.entryLabel} ਨੂੰ ${correct} ਕਰਨ ਤੋਂ ਬਾਅਦ ${count} ${w.averagePhrase} ${corrected} ਮਿਲੀ। ਪਹਿਲਾਂ ਦਰਜ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    case "findCorrectValueFromAverageShift":
      if (v === 0) return `${count} ${w.averagePhrase} ${reported} ਤੋਂ ${corrected} ਹੋ ਗਈ ਜਦੋਂ ${w.entryLabel} ਵਿੱਚ ਦਰਜ ${wrong} ਠੀਕ ਕੀਤਾ ਗਿਆ। ${w.correctValueLabel} ਪਤਾ ਕਰੋ।`;
      if (v === 1) return `${w.entryLabel} ਵਿੱਚ ${wrong} ਹੋਣ ਕਰਕੇ ${count} ${w.averagePhrase} ${reported} ਸੀ; ਸਹੀ ਔਸਤ ${corrected} ਹੈ। ਸਹੀ ਐਂਟਰੀ ਕੱਢੋ।`;
      return `${count} ${w.averagePhrase} ਨੂੰ ${reported} ਤੋਂ ${corrected} ਕਰਨ ਲਈ ${wrong} ਵਾਲੀ ${w.entryLabel} ਬਦਲੀ ਗਈ। ਉਸ ਦਾ ਸਹੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
    case "findIncorrectValueFromCorrection":
      if (v === 0) return `${count} ${w.averagePhrase} ${reported} ਤੋਂ ${corrected} ਹੋਈ ਜਦੋਂ ਇੱਕ ${w.entryLabel} ਨੂੰ ${correct} ਕੀਤਾ ਗਿਆ। ${w.incorrectValueLabel} ਪਤਾ ਕਰੋ।`;
      if (v === 1) return `ਇੱਕ ${w.entryLabel} ਦਾ ਸਹੀ ਮੁੱਲ ${correct} ਹੈ। ਇਸ ਨੂੰ ਠੀਕ ਕਰਨ ਉੱਤੇ ${count} ${w.averagePhrase} ${reported} ਤੋਂ ${corrected} ਹੋ ਗਈ। ਪਹਿਲਾਂ ਦਰਜ ਮੁੱਲ ਕੱਢੋ।`;
      return `${count} ${w.averagePhrase} ਪਹਿਲਾਂ ${reported} ਅਤੇ ਸੁਧਾਰ ਤੋਂ ਬਾਅਦ ${corrected} ਸੀ। ਬਦਲੀ ${w.entryLabel} ਹੁਣ ${correct} ਹੈ। ਉਸ ਦਾ ਗਲਤ ਪੁਰਾਣਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
    case "findEntryDifferenceFromAverageCorrection":
      if (v === 0) return `ਇੱਕ ${w.entryLabel} ਠੀਕ ਕਰਨ ਉੱਤੇ ${count} ${w.averagePhrase} ${reported} ਤੋਂ ${corrected} ਹੋ ਗਈ। ${w.differenceLabel} ਪਤਾ ਕਰੋ।`;
      if (v === 1) return `${count} ${w.averagePhrase} ਵਿੱਚ ${change} ਦੀ ਤਬਦੀਲੀ ਇੱਕੋ ${w.entryLabel} ਠੀਕ ਕਰਨ ਨਾਲ ਆਈ। ਗਲਤ ਅਤੇ ਸਹੀ ਮੁੱਲ ਦਾ ਅੰਤਰ ਕੱਢੋ।`;
      return `${w.entryLabel} ਦੀ ਇੱਕ ਗਲਤੀ ਨੇ ${count} ${w.averagePhrase} ਨੂੰ ${reported} ਤੋਂ ${corrected} ਕਰ ਦਿੱਤਾ। ਐਂਟਰੀ ਦੀ ਗਲਤੀ ਦਾ ਪਰਿਮਾਣ ਪਤਾ ਕਰੋ।`;
    case "findAverageChangeFromEntryCorrection":
      if (v === 0) return `${count} ਦੇ ਸਮੂਹ ਵਿੱਚ ${w.entryLabel} ${wrong} ਤੋਂ ${correct} ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ${w.averageChangeLabel} ਪਤਾ ਕਰੋ।`;
      if (v === 1) return `${count} ${w.averagePhrase} ਕੱਢਦੇ ਸਮੇਂ ${wrong} ਦੀ ਥਾਂ ${correct} ਰੱਖਣ ਨਾਲ ਕੁੱਲ ${difference} ਬਦਲਦਾ ਹੈ। ਔਸਤ ਵਿੱਚ ਤਬਦੀਲੀ ਕੱਢੋ।`;
      return `${w.entryLabel} ਵਿੱਚ ${wrong} ਨੂੰ ${correct} ਨਾਲ ਬਦਲਣਾ ਹੈ ਅਤੇ ਕੁੱਲ ${count} ਮੁੱਲ ਹਨ। ਔਸਤ ਕਿੰਨੀ ਬਦਲੇਗੀ?`;
    case "findNumberOfItemsFromTotalCorrection":
      if (v === 0) return `${w.entryLabel} ਵਿੱਚ ${wrong} ਦੀ ਥਾਂ ${correct} ਕਰਨ ਨਾਲ ਔਸਤ ${change} ਬਦਲਦੀ ਹੈ। ${w.countLabel} ਪਤਾ ਕਰੋ।`;
      if (v === 1) return `ਇੱਕ ਗਲਤ ਅਤੇ ਸਹੀ ${w.entryLabel} ਦਾ ਅੰਤਰ ${difference} ਹੈ ਅਤੇ ਔਸਤ ਵਿੱਚ ਤਬਦੀਲੀ ${change} ਹੈ। ${w.countLabel} ਕੱਢੋ।`;
      return `${wrong} ਨੂੰ ${correct} ਨਾਲ ਬਦਲਣ ਉੱਤੇ ਔਸਤ ${change} ਬਦਲ ਗਈ। ਇਸ ਗਿਣਤੀ ਵਿੱਚ ਸ਼ਾਮਲ ${w.countLabel} ਪਤਾ ਕਰੋ।`;
    case "findCorrectedAverageFromMultipleMistakes":
      if (v === 0) return `${count} ${w.averagePhrase} ${reported} ਦਰਜ ਕੀਤੀ ਗਈ। ਦੋ ${w.entryLabel} ਕ੍ਰਮਵਾਰ ${wrong}, ${wrong2} ਸਨ, ਜਿਨ੍ਹਾਂ ਦੀ ਥਾਂ ${correct}, ${correct2} ਹੋਣੇ ਚਾਹੀਦੇ ਸਨ। ${w.correctedAverageLabel} ਪਤਾ ਕਰੋ।`;
      if (v === 1) return `${count} ${w.averagePhrase} ${reported} ਹੈ। ${w.entryLabel} ਵਿੱਚ ${wrong} ਨੂੰ ${correct} ਅਤੇ ${wrong2} ਨੂੰ ${correct2} ਕਰਨ ਤੋਂ ਬਾਅਦ ਸਹੀ ਔਸਤ ਕੱਢੋ।`;
      return `ਦੋ ਗਲਤ ${w.entryLabel} ਕਰਕੇ ${count} ${w.averagePhrase} ${reported} ਆਈ। ਸੁਧਾਰ ${wrong} ਤੋਂ ${correct} ਅਤੇ ${wrong2} ਤੋਂ ${correct2} ਹਨ। ਸੋਧੀ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    default: throw new Error(`Unsupported CP-005 solve mode ${pkg.solveMode}`);
  }
}

function intro(pkg: Avg001QuestionPackage, language: Avg001Cp005PilotLanguage) {
  const w = words(pkg, language);
  const v = localVariant(pkg) % 3;
  const hi: Record<string, string[]> = {
    findCorrectedAverageFromMistake: [
      `${w.entryLabel} की त्रुटि कुल योग बदलती है; गलत मान हटाकर सही मान जोड़ना होगा।`,
      `${w.correctedAverageLabel} पाने के लिए बताए गए कुल पर एक प्रविष्टि का शुद्ध सुधार लागू करें।`,
      `${w.averagePhrase} की गलती एक ही प्रविष्टि से आई है, इसलिए कुल को उसी अंतर से ठीक किया जाता है।`,
    ],
    findReportedAverageBeforeCorrection: [
      `${w.reportedAverageLabel} पाने के लिए सही कुल से सुधार का प्रभाव उल्टा करना होगा।`,
      `सुधार के बाद का कुल ज्ञात है; पुरानी ${w.entryLabel} वापस रखकर पहले का औसत मिलता है।`,
      `${w.correctedAverageLabel} से पहले वाली स्थिति बनाने के लिए सही मान हटाकर गलत मान जोड़ते हैं।`,
    ],
    findCorrectValueFromAverageShift: [
      `औसत में कुल परिवर्तन को संख्या से गुणा करने पर ${w.entryLabel} का आवश्यक सुधार मिलता है।`,
      `${w.correctValueLabel} गलत मान में पूरे समूह पर पड़े औसत-अंतर को जोड़कर मिलता है।`,
      `${w.averagePhrase} के बदलाव को कुल बदलाव में बदलकर सही प्रविष्टि निकाली जाती है।`,
    ],
    findIncorrectValueFromCorrection: [
      `औसत के कुल बदलाव को सही मान से घटाने पर पुरानी ${w.entryLabel} मिलती है।`,
      `${w.incorrectValueLabel} पाने के लिए सुधार के कुल प्रभाव को सही प्रविष्टि से पीछे की ओर हटाएँ।`,
      `${w.averagePhrase} के अंतर का कुल प्रभाव पुरानी और सही प्रविष्टि का अंतर है।`,
    ],
    findEntryDifferenceFromAverageCorrection: [
      `${w.differenceLabel} औसत के परिवर्तन को कुल संख्या से गुणा करने पर मिलता है।`,
      `एक प्रविष्टि का पूरा अंतर सभी मानों पर फैले औसत-अंतर के बराबर है।`,
      `${w.averagePhrase} में बदलाव को कुल बदलाव में बदलना ही प्रविष्टि की त्रुटि देता है।`,
    ],
    findAverageChangeFromEntryCorrection: [
      `${w.averageChangeLabel} प्रविष्टि-अंतर को कुल संख्या में बाँटने से मिलता है।`,
      `एक प्रविष्टि का सुधार पूरे समूह पर समान रूप से फैलता है।`,
      `कुल में आया बदलाव संख्या से भाग देने पर औसत का बदलाव बनता है।`,
    ],
    findNumberOfItemsFromTotalCorrection: [
      `${w.countLabel} कुल प्रविष्टि-अंतर को औसत-अंतर से भाग देने पर मिलती है।`,
      `एक मान का पूरा सुधार कितने मानों में बँटा, यही आवश्यक संख्या बताता है।`,
      `${w.differenceLabel} और ${w.averageChangeLabel} का अनुपात समूह की संख्या है।`,
    ],
    findCorrectedAverageFromMultipleMistakes: [
      `दोनों ${w.entryLabel} के सुधार जोड़कर पहले कुल का शुद्ध परिवर्तन निकालते हैं।`,
      `${w.correctedAverageLabel} के लिए दोनों गलत मान हटाकर दोनों सही मान जोड़े जाते हैं।`,
      `दो प्रविष्टियों के संयुक्त सुधार को कुल संख्या पर फैलाने से नया औसत मिलता है।`,
    ],
  };
  const pa: Record<string, string[]> = {
    findCorrectedAverageFromMistake: [
      `${w.entryLabel} ਦੀ ਗਲਤੀ ਕੁੱਲ ਜੋੜ ਬਦਲਦੀ ਹੈ; ਗਲਤ ਮੁੱਲ ਹਟਾ ਕੇ ਸਹੀ ਮੁੱਲ ਜੋੜਨਾ ਹੋਵੇਗਾ।`,
      `${w.correctedAverageLabel} ਲਈ ਦਰਜ ਕੁੱਲ ਉੱਤੇ ਇੱਕ ਐਂਟਰੀ ਦਾ ਸ਼ੁੱਧ ਸੁਧਾਰ ਲਗਾਓ।`,
      `${w.averagePhrase} ਦੀ ਗਲਤੀ ਇੱਕੋ ਐਂਟਰੀ ਤੋਂ ਆਈ ਹੈ, ਇਸ ਲਈ ਕੁੱਲ ਨੂੰ ਉਸੇ ਅੰਤਰ ਨਾਲ ਠੀਕ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`,
    ],
    findReportedAverageBeforeCorrection: [
      `${w.reportedAverageLabel} ਲਈ ਸਹੀ ਕੁੱਲ ਤੋਂ ਸੁਧਾਰ ਦਾ ਪ੍ਰਭਾਵ ਉਲਟ ਕਰਨਾ ਹੋਵੇਗਾ।`,
      `ਸੁਧਾਰ ਤੋਂ ਬਾਅਦ ਦਾ ਕੁੱਲ ਪਤਾ ਹੈ; ਪੁਰਾਣੀ ${w.entryLabel} ਵਾਪਸ ਰੱਖ ਕੇ ਪਹਿਲੀ ਔਸਤ ਮਿਲਦੀ ਹੈ।`,
      `${w.correctedAverageLabel} ਤੋਂ ਪਹਿਲਾਂ ਵਾਲੀ ਸਥਿਤੀ ਬਣਾਉਣ ਲਈ ਸਹੀ ਮੁੱਲ ਹਟਾ ਕੇ ਗਲਤ ਮੁੱਲ ਜੋੜਦੇ ਹਾਂ।`,
    ],
    findCorrectValueFromAverageShift: [
      `ਔਸਤ ਦੀ ਕੁੱਲ ਤਬਦੀਲੀ ਨੂੰ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਨ ਉੱਤੇ ${w.entryLabel} ਦਾ ਲੋੜੀਂਦਾ ਸੁਧਾਰ ਮਿਲਦਾ ਹੈ।`,
      `${w.correctValueLabel} ਗਲਤ ਮੁੱਲ ਵਿੱਚ ਪੂਰੇ ਸਮੂਹ ਉੱਤੇ ਪਏ ਔਸਤ-ਅੰਤਰ ਨੂੰ ਜੋੜ ਕੇ ਮਿਲਦਾ ਹੈ।`,
      `${w.averagePhrase} ਦੀ ਤਬਦੀਲੀ ਨੂੰ ਕੁੱਲ ਤਬਦੀਲੀ ਵਿੱਚ ਬਦਲ ਕੇ ਸਹੀ ਐਂਟਰੀ ਕੱਢੀ ਜਾਂਦੀ ਹੈ।`,
    ],
    findIncorrectValueFromCorrection: [
      `ਔਸਤ ਦੀ ਕੁੱਲ ਤਬਦੀਲੀ ਨੂੰ ਸਹੀ ਮੁੱਲ ਤੋਂ ਘਟਾਉਣ ਉੱਤੇ ਪੁਰਾਣੀ ${w.entryLabel} ਮਿਲਦੀ ਹੈ।`,
      `${w.incorrectValueLabel} ਲਈ ਸੁਧਾਰ ਦੇ ਕੁੱਲ ਪ੍ਰਭਾਵ ਨੂੰ ਸਹੀ ਐਂਟਰੀ ਤੋਂ ਪਿੱਛੇ ਵੱਲ ਹਟਾਓ।`,
      `${w.averagePhrase} ਦੇ ਅੰਤਰ ਦਾ ਕੁੱਲ ਪ੍ਰਭਾਵ ਪੁਰਾਣੀ ਅਤੇ ਸਹੀ ਐਂਟਰੀ ਦਾ ਅੰਤਰ ਹੈ।`,
    ],
    findEntryDifferenceFromAverageCorrection: [
      `${w.differenceLabel} ਔਸਤ ਦੀ ਤਬਦੀਲੀ ਨੂੰ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਨ ਉੱਤੇ ਮਿਲਦਾ ਹੈ।`,
      `ਇੱਕ ਐਂਟਰੀ ਦਾ ਪੂਰਾ ਅੰਤਰ ਸਾਰੇ ਮੁੱਲਾਂ ਉੱਤੇ ਫੈਲੇ ਔਸਤ-ਅੰਤਰ ਦੇ ਬਰਾਬਰ ਹੈ।`,
      `${w.averagePhrase} ਦੀ ਤਬਦੀਲੀ ਨੂੰ ਕੁੱਲ ਤਬਦੀਲੀ ਵਿੱਚ ਬਦਲਣਾ ਹੀ ਐਂਟਰੀ ਦੀ ਗਲਤੀ ਦਿੰਦਾ ਹੈ।`,
    ],
    findAverageChangeFromEntryCorrection: [
      `${w.averageChangeLabel} ਐਂਟਰੀ-ਅੰਤਰ ਨੂੰ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮਿਲਦਾ ਹੈ।`,
      `ਇੱਕ ਐਂਟਰੀ ਦਾ ਸੁਧਾਰ ਪੂਰੇ ਸਮੂਹ ਉੱਤੇ ਬਰਾਬਰ ਫੈਲਦਾ ਹੈ।`,
      `ਕੁੱਲ ਵਿੱਚ ਆਈ ਤਬਦੀਲੀ ਨੂੰ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਔਸਤ ਦੀ ਤਬਦੀਲੀ ਮਿਲਦੀ ਹੈ।`,
    ],
    findNumberOfItemsFromTotalCorrection: [
      `${w.countLabel} ਕੁੱਲ ਐਂਟਰੀ-ਅੰਤਰ ਨੂੰ ਔਸਤ-ਅੰਤਰ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਮਿਲਦੀ ਹੈ।`,
      `ਇੱਕ ਮੁੱਲ ਦਾ ਪੂਰਾ ਸੁਧਾਰ ਕਿੰਨੇ ਮੁੱਲਾਂ ਵਿੱਚ ਵੰਡਿਆ, ਇਹੀ ਲੋੜੀਂਦੀ ਗਿਣਤੀ ਦੱਸਦਾ ਹੈ।`,
      `${w.differenceLabel} ਅਤੇ ${w.averageChangeLabel} ਦਾ ਅਨੁਪਾਤ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਹੈ।`,
    ],
    findCorrectedAverageFromMultipleMistakes: [
      `ਦੋਵਾਂ ${w.entryLabel} ਦੇ ਸੁਧਾਰ ਜੋੜ ਕੇ ਪਹਿਲਾਂ ਕੁੱਲ ਦੀ ਸ਼ੁੱਧ ਤਬਦੀਲੀ ਕੱਢਦੇ ਹਾਂ।`,
      `${w.correctedAverageLabel} ਲਈ ਦੋਵੇਂ ਗਲਤ ਮੁੱਲ ਹਟਾ ਕੇ ਦੋਵੇਂ ਸਹੀ ਮੁੱਲ ਜੋੜੇ ਜਾਂਦੇ ਹਨ।`,
      `ਦੋ ਐਂਟਰੀਆਂ ਦੇ ਸੰਯੁਕਤ ਸੁਧਾਰ ਨੂੰ ਕੁੱਲ ਗਿਣਤੀ ਉੱਤੇ ਫੈਲਾਉਣ ਨਾਲ ਨਵੀਂ ਔਸਤ ਮਿਲਦੀ ਹੈ।`,
    ],
  };
  return (language === "hi" ? hi : pa)[pkg.solveMode]![v]!;
}

function finalLine(pkg: Avg001QuestionPackage, language: Avg001Cp005PilotLanguage) {
  const w = words(pkg, language);
  const labels: Record<string, string> = {
    findCorrectedAverageFromMistake: w.correctedAverageLabel,
    findReportedAverageBeforeCorrection: w.reportedAverageLabel,
    findCorrectValueFromAverageShift: w.correctValueLabel,
    findIncorrectValueFromCorrection: w.incorrectValueLabel,
    findEntryDifferenceFromAverageCorrection: w.differenceLabel,
    findAverageChangeFromEntryCorrection: w.averageChangeLabel,
    findNumberOfItemsFromTotalCorrection: w.countLabel,
    findCorrectedAverageFromMultipleMistakes: w.correctedAverageLabel,
  };
  const prefixes = language === "hi" ? ["अतः", "इसलिए", "गणना से"] : ["ਇਸ ਲਈ", "ਅਤੇ ਇਸ ਕਰਕੇ", "ਗਿਣਤੀ ਤੋਂ"];
  return `${prefixes[localVariant(pkg) % 3]} ${labels[pkg.solveMode]} ${localizedAnswer(pkg, language)} ${language === "hi" ? "है।" : "ਹੈ।"}`;
}

export function localizedCp005Stem(pkg: Avg001QuestionPackage, language: Avg001Cp005PilotLanguage) {
  return language === "hi" ? stemHi(pkg) : stemPa(pkg);
}

export function localizedCp005Explanation(pkg: Avg001QuestionPackage, language: Avg001Cp005PilotLanguage) {
  const count = raw(pkg, "count");
  const reported = raw(pkg, "reportedAverage");
  const corrected = raw(pkg, "correctedAverage");
  const wrong = raw(pkg, "incorrectValue");
  const correct = raw(pkg, "correctValue");
  const difference = raw(pkg, "entryDifference");
  const change = raw(pkg, "averageChange");
  const wrong2 = raw(pkg, "incorrectValue2");
  const correct2 = raw(pkg, "correctValue2");
  const answer = numberFromAnswer(pkg);
  const hi = language === "hi";
  let second: string;
  let third: string;
  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake":
      second = hi ? `$$बताया गया कुल = ${reported}×${count}$$` : `$$ਦਰਜ ਕੁੱਲ = ${reported}×${count}$$`;
      third = hi ? `$$सही औसत = [${reported}×${count}-${wrong}+${correct}]÷${count} = ${answer}$$` : `$$ਸਹੀ ਔਸਤ = [${reported}×${count}-${wrong}+${correct}]÷${count} = ${answer}$$`;
      break;
    case "findReportedAverageBeforeCorrection":
      second = hi ? `$$सही कुल = ${corrected}×${count}$$` : `$$ਸਹੀ ਕੁੱਲ = ${corrected}×${count}$$`;
      third = hi ? `$$पहले का औसत = [${corrected}×${count}-${correct}+${wrong}]÷${count} = ${answer}$$` : `$$ਪਹਿਲੀ ਔਸਤ = [${corrected}×${count}-${correct}+${wrong}]÷${count} = ${answer}$$`;
      break;
    case "findCorrectValueFromAverageShift":
      second = hi ? `$$कुल सुधार = ${count}×(${corrected}-${reported})$$` : `$$ਕੁੱਲ ਸੁਧਾਰ = ${count}×(${corrected}-${reported})$$`;
      third = hi ? `$$सही प्रविष्टि = ${wrong}+${count}×(${corrected}-${reported}) = ${answer}$$` : `$$ਸਹੀ ਐਂਟਰੀ = ${wrong}+${count}×(${corrected}-${reported}) = ${answer}$$`;
      break;
    case "findIncorrectValueFromCorrection":
      second = hi ? `$$कुल सुधार = ${count}×(${corrected}-${reported})$$` : `$$ਕੁੱਲ ਸੁਧਾਰ = ${count}×(${corrected}-${reported})$$`;
      third = hi ? `$$गलत प्रविष्टि = ${correct}-${count}×(${corrected}-${reported}) = ${answer}$$` : `$$ਗਲਤ ਐਂਟਰੀ = ${correct}-${count}×(${corrected}-${reported}) = ${answer}$$`;
      break;
    case "findEntryDifferenceFromAverageCorrection":
      second = hi ? `$$औसत-अंतर = |${corrected}-${reported}|$$` : `$$ਔਸਤ-ਅੰਤਰ = |${corrected}-${reported}|$$`;
      third = hi ? `$$प्रविष्टि-अंतर = ${count}×|${corrected}-${reported}| = ${answer}$$` : `$$ਐਂਟਰੀ-ਅੰਤਰ = ${count}×|${corrected}-${reported}| = ${answer}$$`;
      break;
    case "findAverageChangeFromEntryCorrection":
      second = hi ? `$$कुल में परिवर्तन = |${correct}-${wrong}| = ${difference}$$` : `$$ਕੁੱਲ ਵਿੱਚ ਤਬਦੀਲੀ = |${correct}-${wrong}| = ${difference}$$`;
      third = hi ? `$$औसत में परिवर्तन = |${correct}-${wrong}|÷${count} = ${answer}$$` : `$$ਔਸਤ ਵਿੱਚ ਤਬਦੀਲੀ = |${correct}-${wrong}|÷${count} = ${answer}$$`;
      break;
    case "findNumberOfItemsFromTotalCorrection":
      second = hi ? `$$प्रविष्टि-अंतर = |${correct}-${wrong}| = ${difference}$$` : `$$ਐਂਟਰੀ-ਅੰਤਰ = |${correct}-${wrong}| = ${difference}$$`;
      third = hi ? `$$संख्या = |${correct}-${wrong}|÷${change} = ${answer}$$` : `$$ਗਿਣਤੀ = |${correct}-${wrong}|÷${change} = ${answer}$$`;
      break;
    case "findCorrectedAverageFromMultipleMistakes":
      second = hi ? `$$शुद्ध सुधार = (${correct}-${wrong})+(${correct2}-${wrong2})$$` : `$$ਸ਼ੁੱਧ ਸੁਧਾਰ = (${correct}-${wrong})+(${correct2}-${wrong2})$$`;
      third = hi ? `$$सही औसत = ${reported}+[(${correct}-${wrong})+(${correct2}-${wrong2})]÷${count} = ${answer}$$` : `$$ਸਹੀ ਔਸਤ = ${reported}+[(${correct}-${wrong})+(${correct2}-${wrong2})]÷${count} = ${answer}$$`;
      break;
    default: throw new Error(`Unsupported CP-005 solve mode ${pkg.solveMode}`);
  }
  return { lines: [intro(pkg, language), second, third, finalLine(pkg, language)] };
}
