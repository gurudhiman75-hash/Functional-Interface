import { generateNumCp009Permanent, type NumCp009PermanentPackage } from "../permanent-runtime.ts";
import type { NumCp009PermanentQlId } from "../permanent-allocation.ts";
import { UNIT_DIGIT_CYCLES } from "../wave01/core.ts";
import type { NumCp009LocalizedLanguage, NumCp009LocalizedLocale, NumCp009LocalizedPackage } from "./types.ts";

type State = Readonly<Record<string, unknown>>;
type Term = Readonly<{ base: number; exponent: number }>;

type LocalizedContent = Readonly<{
  stem: string;
  coreConcept: string;
  strategy: string;
  steps: readonly string[];
  finalAnswer: string;
}>;

function localeFor(language: NumCp009LocalizedLanguage): NumCp009LocalizedLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

function stateOf(q: NumCp009PermanentPackage): State {
  return q.hiddenState as State;
}

function numberValue(state: State, key: string): number {
  const value = state[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error(`Expected integer state field ${key}`);
  return value;
}

function stringValue(state: State, key: string): string {
  const value = state[key];
  if (typeof value !== "string") throw new Error(`Expected string state field ${key}`);
  return value;
}

function booleanValue(state: State, key: string): boolean {
  const value = state[key];
  if (typeof value !== "boolean") throw new Error(`Expected boolean state field ${key}`);
  return value;
}

function numberArray(state: State, key: string): number[] {
  const value = state[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isSafeInteger(item))) {
    throw new Error(`Expected integer-array state field ${key}`);
  }
  return [...value] as number[];
}

function termsValue(state: State): Term[] {
  const value = state.terms;
  if (!Array.isArray(value)) throw new Error("Expected terms array");
  return value.map((item) => {
    if (!item || typeof item !== "object") throw new Error("Malformed term");
    const row = item as Readonly<Record<string, unknown>>;
    if (typeof row.base !== "number" || typeof row.exponent !== "number") throw new Error("Malformed term values");
    return { base: row.base, exponent: row.exponent };
  });
}

function cycleFromLastDigit(lastDigit: number): readonly number[] {
  const cycle = UNIT_DIGIT_CYCLES[lastDigit];
  if (!cycle) throw new Error(`Missing unit-digit cycle for ${lastDigit}`);
  return cycle;
}

function cycleText(cycle: readonly number[]): string {
  return cycle.join(", ");
}

function setText(values: readonly number[]): string {
  return values.length === 0 ? "∅" : `{${values.join(", ")}}`;
}

function operatorSymbol(operator: string): string {
  return operator === "SUM" ? "+" : operator === "DIFFERENCE" ? "−" : operator === "PRODUCT" ? "×" : operator;
}

function expressionText(terms: readonly Term[], operator: string): string {
  return terms.map((term) => `${term.base}^${term.exponent}`).join(` ${operatorSymbol(operator)} `);
}

function chooseStem(q: NumCp009PermanentPackage, direct: string, imperative: string, exam: string): string {
  return q.stemFamily === "DIRECT" ? direct : q.stemFamily === "IMPERATIVE" ? imperative : exam;
}

function hindi(q: NumCp009PermanentPackage): LocalizedContent {
  const s = stateOf(q);
  const answer = q.canonicalAnswer;

  switch (q.temporaryPrototypeId) {
    case "NUM-CP009-PROT-001": {
      const base = numberValue(s, "base");
      const exponent = numberValue(s, "exponent");
      const lastDigit = numberValue(s, "lastDigit");
      const cycle = cycleFromLastDigit(lastDigit);
      const position = exponent === 0 ? 0 : ((exponent - 1) % cycle.length) + 1;
      return {
        stem: chooseStem(q,
          `${base}^${exponent} का इकाई अंक क्या है?`,
          `${base}^${exponent} का अंतिम अंक ज्ञात कीजिए।`,
          `${base}^${exponent} की पूरी संख्या निकालने की आवश्यकता नहीं है। केवल इकाई स्थान का अंक बताइए।`,
        ),
        coreConcept: "घातों के इकाई अंक एक निश्चित छोटे चक्र में दोहराते हैं।",
        strategy: "आधार का केवल अंतिम अंक लें और घात को उसके इकाई-अंक चक्र में सही स्थान पर रखें।",
        steps: exponent === 0
          ? ["किसी भी शून्येतर संख्या की घात 0 का मान 1 होता है।", `इसलिए ${base}^0 का इकाई अंक 1 है।`]
          : [`${base} का अंतिम अंक ${lastDigit} है और इसका चक्र ${cycleText(cycle)} है।`, `चक्र की लंबाई ${cycle.length} है; घात ${exponent} चक्र के स्थान ${position} पर आता है।`, `उस स्थान पर इकाई अंक ${answer} मिलता है।`],
        finalAnswer: `इकाई अंक ${answer} है।`,
      };
    }
    case "NUM-CP009-PROT-002": {
      const bases = numberArray(s, "bases");
      const exponents = numberArray(s, "exponents");
      const unitDigits = numberArray(s, "unitDigits");
      const expression = bases.map((base, index) => `${base}^${exponents[index]}`).join(" × ");
      return {
        stem: chooseStem(q,
          `${expression} का इकाई अंक क्या है?`,
          `${expression} का अंतिम अंक ज्ञात कीजिए।`,
          `${expression} में हर घात का इकाई अंक अलग-अलग निकालकर गुणा कीजिए। अंतिम इकाई अंक क्या होगा?`,
        ),
        coreConcept: "गुणनफल में पहले प्रत्येक घात का इकाई अंक निकाला जाता है।",
        strategy: "हर घात का इकाई अंक उसके चक्र से निकालें, फिर उन अंकों का गुणनफल लेकर अंतिम अंक रखें।",
        steps: [...bases.map((base, index) => `${base}^${exponents[index]} का इकाई अंक ${unitDigits[index]} है।`), `इन इकाई अंकों को गुणा करने पर अंतिम अंक ${answer} मिलता है।`],
        finalAnswer: `इकाई अंक ${answer} है।`,
      };
    }
    case "NUM-CP009-PROT-003": {
      const firstBase = numberValue(s, "firstBase");
      const firstExponent = numberValue(s, "firstExponent");
      const secondBase = numberValue(s, "secondBase");
      const secondExponent = numberValue(s, "secondExponent");
      const operator = stringValue(s, "operator");
      const firstDigit = numberValue(s, "firstDigit");
      const secondDigit = numberValue(s, "secondDigit");
      const expression = `${firstBase}^${firstExponent} ${operator} ${secondBase}^${secondExponent}`;
      return {
        stem: chooseStem(q,
          `${expression} का इकाई अंक क्या है?`,
          `${expression} का अंतिम अंक ज्ञात कीजिए।`,
          `दोनों घातों के इकाई-अंक चक्र हल करके ${expression} के इकाई स्थान का अंक बताइए।`,
        ),
        coreConcept: "योग या अंतर में पहले दोनों घातों के इकाई अंक अलग-अलग निकाले जाते हैं।",
        strategy: "दोनों अंतिम अंकों को चक्र से निकालें और उसके बाद दिए गए जोड़ या घटाव को 10 के मॉड्यूलो में पूरा करें।",
        steps: [`${firstBase}^${firstExponent} का इकाई अंक ${firstDigit} है।`, `${secondBase}^${secondExponent} का इकाई अंक ${secondDigit} है।`, operator === "+" ? `${firstDigit} + ${secondDigit} का इकाई अंक ${answer} है।` : `${firstDigit} − ${secondDigit} को 10 के मॉड्यूलो में लेने पर ${answer} मिलता है।`],
        finalAnswer: `इकाई अंक ${answer} है।`,
      };
    }
    case "NUM-CP009-PROT-004": {
      const outerBase = numberValue(s, "outerBase");
      const innerBase = numberValue(s, "innerBase");
      const innerExponent = numberValue(s, "innerExponent");
      const actualExponent = numberValue(s, "actualExponent");
      const effectiveResidue = numberValue(s, "effectiveResidue");
      const lastDigit = ((outerBase % 10) + 10) % 10;
      const cycle = cycleFromLastDigit(lastDigit);
      const expression = `${outerBase}^(${innerBase}^${innerExponent})`;
      return {
        stem: chooseStem(q,
          `${expression} का इकाई अंक क्या है?`,
          `घात-स्तंभ ${expression} का अंतिम अंक ज्ञात कीजिए।`,
          `${expression} में ऊपर की घात को केवल बाहरी आधार के इकाई-अंक चक्र के अनुसार घटाइए। अंतिम अंक क्या है?`,
        ),
        coreConcept: "घात-स्तंभ में बाहरी आधार का इकाई-अंक चक्र तय करता है कि ऊपर की घात को कितना सरल करना है।",
        strategy: "बाहरी आधार का चक्र निकालें, ऊपर की घात का उस चक्र की लंबाई से अवशेष लें और सही चक्र स्थान पढ़ें।",
        steps: [`बाहरी आधार ${outerBase} का अंतिम अंक ${lastDigit} है और चक्र ${cycleText(cycle)} है।`, `${innerBase}^${innerExponent} = ${actualExponent}; चक्र लंबाई ${cycle.length} से इसका अवशेष ${effectiveResidue} है।`, effectiveResidue === 0 ? `अवशेष 0 होने पर चक्र का अंतिम स्थान लिया जाता है, जिससे ${answer} मिलता है।` : `चक्र का स्थान ${effectiveResidue} इकाई अंक ${answer} देता है।`],
        finalAnswer: `इकाई अंक ${answer} है।`,
      };
    }
    case "NUM-CP009-PROT-005": {
      const base = numberValue(s, "base");
      const lastDigit = numberValue(s, "lastDigit");
      const cycle = numberArray(s, "cycle");
      return {
        stem: chooseStem(q,
          `${base} की क्रमिक धनात्मक घातों के इकाई अंकों के दोहराव-चक्र की लंबाई क्या है?`,
          `${base} की घातों के इकाई-अंक चक्र की लंबाई ज्ञात कीजिए।`,
          `${base} की घातों के इकाई अंक दोहरते हैं। कितनी घातों के बाद यही क्रम फिर शुरू होता है?`,
        ),
        coreConcept: "क्रमिक घातों के अंतिम अंक एक छोटे निश्चित क्रम में दोहरते हैं।",
        strategy: "आधार के अंतिम अंक की घातें लिखें और पहली बार पूरा क्रम दोहरने से पहले पदों की संख्या गिनें।",
        steps: [`${base} का अंतिम अंक ${lastDigit} है।`, `इकाई-अंक क्रम ${cycleText(cycle)} है।`, `दोहराव से पहले इस क्रम में ${answer} पद हैं।`],
        finalAnswer: `चक्र की लंबाई ${answer} है।`,
      };
    }
    case "NUM-CP009-PROT-006": {
      const base = numberValue(s, "base");
      const lastDigit = numberValue(s, "lastDigit");
      const targetDigit = numberValue(s, "targetDigit");
      const residue = numberValue(s, "residue");
      const cycle = numberArray(s, "cycle");
      return {
        stem: chooseStem(q,
          `धनात्मक पूर्णांक n के लिए ${base}^n का इकाई अंक ${targetDigit} है। n किस सर्वांगसमता वर्ग में होगा?`,
          `वह n का वर्ग चुनिए जिसके लिए ${base}^n का इकाई अंक ${targetDigit} हो।`,
          `${base}^n का अंतिम अंक ${targetDigit} दिया है। n के लिए मॉड्यूलो 4 में सही शर्त कौन-सी है?`,
        ),
        coreConcept: "लक्षित इकाई अंक आधार के घात-चक्र में एक निश्चित स्थान बताता है।",
        strategy: "लक्षित अंक को चक्र में खोजें और उस स्थान को n के सर्वांगसमता वर्ग में लिखें।",
        steps: [`${base} का अंतिम अंक ${lastDigit} है, इसलिए चक्र ${cycleText(cycle)} है।`, `लक्षित अंक ${targetDigit} घात के अवशेष ${residue} (मॉड्यूलो 4) पर आता है।`, `इसलिए ${answer}।`],
        finalAnswer: `आवश्यक वर्ग ${answer} है।`,
      };
    }
    case "NUM-CP009-PROT-007": {
      const base = numberValue(s, "base");
      const lastDigit = numberValue(s, "lastDigit");
      const cycle = numberArray(s, "cycle");
      const modulus = numberValue(s, "modulus");
      const residue = numberValue(s, "residue");
      const targetDigit = numberValue(s, "targetDigit");
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      return {
        stem: chooseStem(q,
          `${lower} ≤ n ≤ ${upper} में कितने पूर्णांक n ऐसे हैं जिनके लिए ${base}^n का इकाई अंक ${targetDigit} है?`,
          `${lower} से ${upper} तक उन घातों n की संख्या ज्ञात कीजिए जिन पर ${base}^n का इकाई अंक ${targetDigit} आता है।`,
          `समावेशी सीमा ${lower} से ${upper} में कितने n उस चक्र-स्थान पर आते हैं जो अंतिम अंक ${targetDigit} देता है?`,
        ),
        coreConcept: "एक लक्षित इकाई अंक निश्चित अंतराल पर वही घात-अवशेष दोहराता है।",
        strategy: "पहले आवश्यक घात-अवशेष पहचानें, फिर दी गई समावेशी सीमा में उसी वर्ग के मान गिनें।",
        steps: [`${base} का अंतिम अंक ${lastDigit} है और चक्र ${cycleText(cycle)} है।`, `अंक ${targetDigit} तब मिलता है जब n ≡ ${residue} (mod ${modulus})।`, `${lower} से ${upper} तक इस वर्ग के ${answer} मान हैं।`],
        finalAnswer: `कुल संख्या ${answer} है।`,
      };
    }
    case "NUM-CP009-PROT-008": {
      const base = numberValue(s, "base");
      const exponent = numberValue(s, "exponent");
      const order = numberValue(s, "order");
      const reducedExponent = numberValue(s, "reducedExponent");
      return {
        stem: chooseStem(q,
          `${base}^${exponent} के अंतिम दो अंक क्या हैं?`,
          `${base}^${exponent} के अंतिम दो अंक ज्ञात कीजिए; आवश्यकता हो तो शुरुआती 0 भी लिखिए।`,
          `${base}^${exponent} का 100 के मॉड्यूलो में अवशेष लेकर दो-अंकीय अंतिम खंड बताइए।`,
        ),
        coreConcept: "अंतिम दो अंक ठीक वही होते हैं जो संख्या का 100 के मॉड्यूलो में अवशेष है।",
        strategy: "100 के मॉड्यूलो में घात का दोहराव-चक्र लें, घात को उस चक्र से घटाएँ और दो अंकों का परिणाम बनाए रखें।",
        steps: [`आधार ${base} के लिए 100 के मॉड्यूलो में घात-चक्र की लंबाई ${order} है।`, `${exponent} को ${order} के मॉड्यूलो में लेने पर ${reducedExponent}${reducedExponent === 0 ? ` मिलता है, इसलिए चक्र का अंतिम स्थान ${order} लिया जाता है` : " मिलता है"}।`, `100 के मॉड्यूलो में अंतिम अवशेष ${answer} है।`],
        finalAnswer: `अंतिम दो अंक ${answer} हैं।`,
      };
    }
    case "NUM-CP009-PROT-009": {
      const operator = stringValue(s, "operator");
      const terms = termsValue(s);
      const residues = numberArray(s, "residues");
      const expression = expressionText(terms, operator);
      return {
        stem: chooseStem(q,
          `${expression} के अंतिम दो अंक क्या हैं?`,
          `${expression} के अंतिम दो अंक ज्ञात कीजिए; शुरुआती 0 हो तो उसे भी रखें।`,
          `${expression} में प्रत्येक घात को 100 के मॉड्यूलो में हल करके दिए गए संक्रिया-चिह्न से जोड़िए। अंतिम दो-अंकीय खंड क्या है?`,
        ),
        coreConcept: "किसी व्यंजक के अंतिम दो अंक उसके 100 के मॉड्यूलो में अवशेष से मिलते हैं।",
        strategy: "हर घात का दो-अंकीय अवशेष अलग निकालें और फिर दी गई संक्रिया को 100 के मॉड्यूलो में लागू करें।",
        steps: [...terms.map((term, index) => `${term.base}^${term.exponent} का 100 के मॉड्यूलो में अवशेष ${String(residues[index]).padStart(2, "0")} है।`), `इन अवशेषों पर दी गई संक्रिया लगाने से ${answer} मिलता है।`],
        finalAnswer: `अंतिम दो अंक ${answer} हैं।`,
      };
    }
    case "NUM-CP009-PROT-010": {
      const base = numberValue(s, "base");
      const exponent = numberValue(s, "exponent");
      return {
        stem: chooseStem(q,
          `${base}^${exponent} के अंतिम तीन अंक क्या हैं?`,
          `${base}^${exponent} के अंतिम तीन अंक ज्ञात कीजिए; शुरुआती शून्य भी बनाए रखें।`,
          `${base}^${exponent} को 1000 के मॉड्यूलो में हल कीजिए। कौन-सा तीन-अंकीय अंतिम खंड मिलता है?`,
        ),
        coreConcept: "अंतिम तीन अंक संख्या का 1000 के मॉड्यूलो में अवशेष होते हैं।",
        strategy: "पूरी बड़ी संख्या फैलाने के बजाय बार-बार वर्ग करके 1000 के मॉड्यूलो में घात निकालें।",
        steps: [`${base}^${exponent} को 1000 के मॉड्यूलो में गणना करें।`, `अवशेष ${answer} मिलता है।`, `तीन स्थान माँगे गए हैं, इसलिए परिणाम को तीन अंकों के खंड के रूप में ही लिखा जाता है।`],
        finalAnswer: `अंतिम तीन अंक ${answer} हैं।`,
      };
    }
    case "NUM-CP009-PROT-011": {
      const operator = stringValue(s, "operator");
      const terms = termsValue(s);
      const residues = numberArray(s, "residues");
      const expression = expressionText(terms, operator);
      return {
        stem: chooseStem(q,
          `${expression} के अंतिम तीन अंक क्या हैं?`,
          `${expression} का अंतिम तीन-अंकीय खंड ज्ञात कीजिए।`,
          `${expression} की प्रत्येक घात को 1000 के मॉड्यूलो में घटाकर फिर दी गई संक्रिया लागू कीजिए। अंतिम खंड क्या है?`,
        ),
        coreConcept: "तीन-अंकीय अंतिम खंड 1000 के मॉड्यूलो में गणना से मिलता है।",
        strategy: "हर घात को 1000 के मॉड्यूलो में हल करें और उसके बाद ही योग, अंतर या गुणनफल पूरा करें।",
        steps: [...terms.map((term, index) => `${term.base}^${term.exponent} का 1000 के मॉड्यूलो में अवशेष ${String(residues[index]).padStart(3, "0")} है।`), `इन अवशेषों पर दी गई संक्रिया लगाने से ${answer} मिलता है।`],
        finalAnswer: `अंतिम तीन अंक ${answer} हैं।`,
      };
    }
    case "NUM-CP009-PROT-012": {
      const base = numberValue(s, "base");
      const lastDigit = numberValue(s, "lastDigit");
      const cycle = numberArray(s, "cycle");
      const targetDigit = numberValue(s, "targetDigit");
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      const values = numberArray(s, "answerValues");
      return {
        stem: chooseStem(q,
          `${lower} ≤ n ≤ ${upper} के लिए उन सभी n का समुच्चय क्या है जिन पर ${base}^n का इकाई अंक ${targetDigit} है?`,
          `${lower} से ${upper} तक हर ऐसा n लिखिए जिसके लिए ${base}^n का इकाई अंक ${targetDigit} हो।`,
          `सीमा ${lower} ≤ n ≤ ${upper} में अंतिम अंक ${targetDigit} देने वाले घातों का पूरा समुच्चय कौन-सा है?`,
        ),
        coreConcept: "लक्षित इकाई अंक चक्र में निश्चित घात-स्थानों पर बार-बार आता है।",
        strategy: "लक्षित अंक का चक्र-स्थान खोजें और दी गई सीमा के भीतर केवल उन्हीं घातों की पूरी सूची बनाएँ।",
        steps: [`${base} का अंतिम अंक ${lastDigit} है और इकाई-अंक चक्र ${cycleText(cycle)} है।`, values.length === 0 ? `${lower} से ${upper} तक कोई भी घात ${targetDigit} नहीं देता।` : `मिलते हुए चक्र-स्थानों की जाँच से ${setText(values)} मिलता है।`, `इस सीमा में इस समुच्चय के बाहर कोई अन्य घात शर्त पूरी नहीं करता।`],
        finalAnswer: `पूरा समुच्चय ${answer} है।`,
      };
    }
    case "NUM-CP009-PROT-013": {
      const base = numberValue(s, "base");
      const lastDigit = numberValue(s, "lastDigit");
      const cycle = numberArray(s, "cycle");
      const asksImpossible = booleanValue(s, "asksImpossible");
      return {
        stem: asksImpossible
          ? chooseStem(q, `धनात्मक पूर्णांक n के लिए निम्न में से कौन-सा अंक ${base}^n का इकाई अंक कभी नहीं हो सकता?`, `${base}^n के इकाई स्थान पर कभी न आने वाला अंक चुनिए।`, `${base} की घातों का इकाई-अंक चक्र निश्चित है। कौन-सा विकल्प इस चक्र के बाहर है?`)
          : chooseStem(q, `धनात्मक पूर्णांक n के किसी मान पर निम्न में से कौन-सा अंक ${base}^n का इकाई अंक हो सकता है?`, `${base} की किसी धनात्मक घात के इकाई स्थान पर आने वाला अंक चुनिए।`, `विकल्पों में कौन-सा अंक ${base}^n के दोहराव वाले इकाई-अंक चक्र में शामिल है?`),
        coreConcept: "किसी धनात्मक घात का इकाई अंक केवल आधार के दोहराव वाले चक्र में मौजूद अंकों में से हो सकता है।",
        strategy: "आधार का इकाई-अंक चक्र लिखें और विकल्पों की उससे तुलना करें।",
        steps: [`${base} का अंतिम अंक ${lastDigit} है, इसलिए चक्र ${cycleText(cycle)} है।`, asksImpossible ? `${answer} इस चक्र में कहीं नहीं आता।` : `${answer} इस चक्र में आता है, इसलिए यह संभव है।`],
        finalAnswer: asksImpossible ? `असंभव इकाई अंक ${answer} है।` : `एक संभव इकाई अंक ${answer} है।`,
      };
    }
    case "NUM-CP009-PROT-014": {
      const base = numberValue(s, "base");
      const n = numberValue(s, "n");
      const exponentKind = stringValue(s, "exponentKind");
      const exponent = numberValue(s, "exponent");
      const lastDigit = numberValue(s, "lastDigit");
      const cycle = numberArray(s, "cycle");
      const squareSum = exponentKind === "SUM_OF_SQUARES";
      const exponentText = squareSum ? `1^2 + 2^2 + ... + ${n}^2` : `1 + 2 + ... + ${n}`;
      return {
        stem: chooseStem(q,
          `${base}^(${exponentText}) का इकाई अंक क्या है?`,
          `${base} की घात ${exponentText} का अंतिम अंक ज्ञात कीजिए।`,
          `पहले घात ${exponentText} को सरल कीजिए, फिर ${base} के इकाई-अंक चक्र से अंतिम अंक निकालिए।`,
        ),
        coreConcept: "जब घात स्वयं किसी क्रम का योग हो, तो पहले उस घात का सही मान निकालना आवश्यक है।",
        strategy: "संरचित घात को सूत्र से सरल करें, फिर उसे इकाई-अंक चक्र की लंबाई से घटाकर सही स्थान चुनें।",
        steps: [squareSum ? `1^2 + 2^2 + ... + ${n}^2 = ${n}×${n + 1}×${2 * n + 1}/6 = ${exponent}।` : `1 + 2 + ... + ${n} = ${n}×${n + 1}/2 = ${exponent}।`, `${base} का अंतिम अंक ${lastDigit} है और चक्र ${cycleText(cycle)} है।`, `घात ${exponent} जिस चक्र-स्थान पर आता है, वहाँ इकाई अंक ${answer} है।`],
        finalAnswer: `इकाई अंक ${answer} है।`,
      };
    }
    case "NUM-CP009-PROT-015": {
      const width = numberValue(s, "width");
      const modulus = numberValue(s, "modulus");
      const base = numberValue(s, "base");
      const exponent = numberValue(s, "exponent");
      const terminal = width === 2 ? "अंतिम दो अंक" : "अंतिम तीन अंक";
      return {
        stem: chooseStem(q,
          `${base}^${exponent} के ${terminal} क्या हैं?`,
          `${base}^${exponent} के ${terminal} ज्ञात कीजिए; शुरुआती शून्य भी रखें।`,
          `${base} और ${modulus} परस्पर सहभाज्य नहीं हैं। सहभाज्य चक्र मानने के बजाय सीधे मॉड्यूलो ${modulus} में गणना कीजिए। कौन-सा अंतिम खंड मिलता है?`,
        ),
        coreConcept: "आधार में 2 या 5 के गुणनखंड होने पर भी अंतिम अंक संबंधित 10 की घात के मॉड्यूलो में अवशेष से ही मिलते हैं।",
        strategy: `सीधे मॉड्यूलो ${modulus} में घात निकालें; परस्पर सहभाज्यता पर निर्भर चक्र-शॉर्टकट न लगाएँ।`,
        steps: [`${base} और ${modulus} का एक साझा गुणनखंड है, इसलिए सहभाज्य चक्र वाला शॉर्टकट नहीं लिया जाता।`, `बार-बार वर्ग करके मॉड्यूलो ${modulus} में अवशेष ${answer} मिलता है।`, `माँगे गए सभी ${width} अंतिम स्थान स्पष्ट रूप से लिखे जाते हैं, शुरुआती शून्य सहित।`],
        finalAnswer: `${terminal} ${answer} हैं।`,
      };
    }
    case "NUM-CP009-PROT-016": {
      const base = numberValue(s, "base");
      const lastDigit = numberValue(s, "lastDigit");
      const cycle = numberArray(s, "cycle");
      const allowedDigits = numberArray(s, "allowedDigits");
      const residues = numberArray(s, "residues");
      const allowedText = `{${allowedDigits.join(", ")}}`;
      return {
        stem: chooseStem(q,
          `धनात्मक पूर्णांक n के लिए ${base}^n का इकाई अंक ${allowedText} में होना चाहिए। n के सभी मान्य सर्वांगसमता वर्गों का पूरा समुच्चय कौन-सा है?`,
          `मॉड्यूलो 4 में n के वे सभी वर्ग चुनिए जिन पर ${base}^n का इकाई अंक ${allowedText} में आता है।`,
          `यह अंतिम-अंक शर्त चक्र के एक से अधिक स्थान स्वीकार करती है। कौन-सा विकल्प n के सभी मान्य वर्ग देता है?`,
        ),
        coreConcept: "जब कई इकाई अंक स्वीकार्य हों, तो घात-चक्र के कई स्थान एक साथ मान्य हो सकते हैं।",
        strategy: "हर स्वीकार्य इकाई अंक को उसके चक्र-स्थान से मिलाएँ और सभी संबंधित घात-अवशेषों का संघ लें।",
        steps: [`${base} का अंतिम अंक ${lastDigit} है और चक्र ${cycleText(cycle)} है।`, `स्वीकार्य अंक ${allowedText} घात-अवशेष ${residues.join(", ")} (मॉड्यूलो 4) पर आते हैं।`, `सभी स्वीकार्य स्थान रखने पर ${answer} मिलता है।`],
        finalAnswer: `पूरा घात-वर्ग समुच्चय ${answer} है।`,
      };
    }
    case "NUM-CP009-PROT-017": {
      const base = numberValue(s, "base");
      const lastDigit = numberValue(s, "lastDigit");
      const cycle = numberArray(s, "cycle");
      const termCount = numberValue(s, "termCount");
      const cycleSum = numberValue(s, "cycleSum");
      const fullBlocks = numberValue(s, "fullBlocks");
      const leftoverCount = numberValue(s, "leftoverCount");
      const leftoverSum = numberValue(s, "leftoverSum");
      return {
        stem: chooseStem(q,
          `${base}^1 + ${base}^2 + ... + ${base}^${termCount} का इकाई अंक क्या है?`,
          `योग ${base} + ${base}^2 + ... + ${base}^${termCount} का अंतिम अंक ज्ञात कीजिए।`,
          `इस लंबे योग में ${base} की पहली ${termCount} धनात्मक घातें हैं। हर पद फैलाने के बजाय पूरे इकाई-अंक चक्रों को समूहित कीजिए। अंतिम अंक क्या है?`,
        ),
        coreConcept: "लगातार घातों के लंबे योग में इकाई अंक चक्रों के पूरे खंडों में दोहरते हैं।",
        strategy: "एक पूरा इकाई-अंक चक्र और उसका योग निकालें, पूरे चक्र-खंड गिनें और बचे हुए पद जोड़ें।",
        steps: [`${base} का अंतिम अंक ${lastDigit} है; चक्र ${cycleText(cycle)} है और एक पूरे चक्र का योग ${cycleSum} है।`, `${termCount} पदों में ${fullBlocks} पूरे चक्र-खंड और ${leftoverCount} बचे हुए पद हैं।`, `बचे हुए पदों का योग ${leftoverSum} है, इसलिए कुल का इकाई अंक ${answer} बनता है।`],
        finalAnswer: `इकाई अंक ${answer} है।`,
      };
    }
    default:
      throw new Error(`Unsupported NUM-CP-009 prototype for Hindi localization: ${q.temporaryPrototypeId}`);
  }
}

function punjabi(q: NumCp009PermanentPackage): LocalizedContent {
  const s = stateOf(q);
  const answer = q.canonicalAnswer;

  switch (q.temporaryPrototypeId) {
    case "NUM-CP009-PROT-001": {
      const base = numberValue(s, "base");
      const exponent = numberValue(s, "exponent");
      const lastDigit = numberValue(s, "lastDigit");
      const cycle = cycleFromLastDigit(lastDigit);
      const position = exponent === 0 ? 0 : ((exponent - 1) % cycle.length) + 1;
      return { stem: chooseStem(q, `${base}^${exponent} ਦਾ ਇਕਾਈ ਅੰਕ ਕੀ ਹੈ?`, `${base}^${exponent} ਦਾ ਆਖਰੀ ਅੰਕ ਕੱਢੋ।`, `${base}^${exponent} ਦੀ ਪੂਰੀ ਸੰਖਿਆ ਕੱਢਣ ਦੀ ਲੋੜ ਨਹੀਂ। ਸਿਰਫ਼ ਇਕਾਈ ਸਥਾਨ ਦਾ ਅੰਕ ਦੱਸੋ।`), coreConcept: "ਘਾਤਾਂ ਦੇ ਇਕਾਈ ਅੰਕ ਇੱਕ ਨਿਸ਼ਚਿਤ ਛੋਟੇ ਚੱਕਰ ਵਿੱਚ ਦੁਹਰਾਉਂਦੇ ਹਨ।", strategy: "ਆਧਾਰ ਦਾ ਸਿਰਫ਼ ਆਖਰੀ ਅੰਕ ਲਓ ਅਤੇ ਘਾਤ ਨੂੰ ਉਸ ਦੇ ਇਕਾਈ-ਅੰਕ ਚੱਕਰ ਵਿੱਚ ਸਹੀ ਸਥਾਨ ਤੇ ਰੱਖੋ।", steps: exponent === 0 ? ["ਕਿਸੇ ਵੀ ਗੈਰ-ਸਿਫ਼ਰ ਸੰਖਿਆ ਦੀ ਘਾਤ 0 ਦਾ ਮੁੱਲ 1 ਹੁੰਦਾ ਹੈ।", `ਇਸ ਲਈ ${base}^0 ਦਾ ਇਕਾਈ ਅੰਕ 1 ਹੈ।`] : [`${base} ਦਾ ਆਖਰੀ ਅੰਕ ${lastDigit} ਹੈ ਅਤੇ ਇਸ ਦਾ ਚੱਕਰ ${cycleText(cycle)} ਹੈ।`, `ਚੱਕਰ ਦੀ ਲੰਬਾਈ ${cycle.length} ਹੈ; ਘਾਤ ${exponent} ਚੱਕਰ ਦੇ ਸਥਾਨ ${position} ਤੇ ਆਉਂਦੀ ਹੈ।`, `ਉਸ ਸਥਾਨ ਤੇ ਇਕਾਈ ਅੰਕ ${answer} ਮਿਲਦਾ ਹੈ।`], finalAnswer: `ਇਕਾਈ ਅੰਕ ${answer} ਹੈ।` };
    }
    case "NUM-CP009-PROT-002": {
      const bases = numberArray(s, "bases"); const exponents = numberArray(s, "exponents"); const unitDigits = numberArray(s, "unitDigits"); const expression = bases.map((base, index) => `${base}^${exponents[index]}`).join(" × ");
      return { stem: chooseStem(q, `${expression} ਦਾ ਇਕਾਈ ਅੰਕ ਕੀ ਹੈ?`, `${expression} ਦਾ ਆਖਰੀ ਅੰਕ ਕੱਢੋ।`, `${expression} ਵਿੱਚ ਹਰ ਘਾਤ ਦਾ ਇਕਾਈ ਅੰਕ ਵੱਖ-ਵੱਖ ਕੱਢ ਕੇ ਗੁਣਾ ਕਰੋ। ਆਖਰੀ ਇਕਾਈ ਅੰਕ ਕੀ ਹੋਵੇਗਾ?`), coreConcept: "ਗੁਣਨਫਲ ਵਿੱਚ ਪਹਿਲਾਂ ਹਰ ਘਾਤ ਦਾ ਇਕਾਈ ਅੰਕ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ।", strategy: "ਹਰ ਘਾਤ ਦਾ ਇਕਾਈ ਅੰਕ ਉਸ ਦੇ ਚੱਕਰ ਤੋਂ ਕੱਢੋ, ਫਿਰ ਉਨ੍ਹਾਂ ਅੰਕਾਂ ਦਾ ਗੁਣਨਫਲ ਲੈ ਕੇ ਆਖਰੀ ਅੰਕ ਰੱਖੋ।", steps: [...bases.map((base, index) => `${base}^${exponents[index]} ਦਾ ਇਕਾਈ ਅੰਕ ${unitDigits[index]} ਹੈ।`), `ਇਨ੍ਹਾਂ ਇਕਾਈ ਅੰਕਾਂ ਨੂੰ ਗੁਣਾ ਕਰਨ ਤੇ ਆਖਰੀ ਅੰਕ ${answer} ਮਿਲਦਾ ਹੈ।`], finalAnswer: `ਇਕਾਈ ਅੰਕ ${answer} ਹੈ।` };
    }
    case "NUM-CP009-PROT-003": {
      const firstBase = numberValue(s, "firstBase"); const firstExponent = numberValue(s, "firstExponent"); const secondBase = numberValue(s, "secondBase"); const secondExponent = numberValue(s, "secondExponent"); const operator = stringValue(s, "operator"); const firstDigit = numberValue(s, "firstDigit"); const secondDigit = numberValue(s, "secondDigit"); const expression = `${firstBase}^${firstExponent} ${operator} ${secondBase}^${secondExponent}`;
      return { stem: chooseStem(q, `${expression} ਦਾ ਇਕਾਈ ਅੰਕ ਕੀ ਹੈ?`, `${expression} ਦਾ ਆਖਰੀ ਅੰਕ ਕੱਢੋ।`, `ਦੋਵੇਂ ਘਾਤਾਂ ਦੇ ਇਕਾਈ-ਅੰਕ ਚੱਕਰ ਹੱਲ ਕਰਕੇ ${expression} ਦੇ ਇਕਾਈ ਸਥਾਨ ਦਾ ਅੰਕ ਦੱਸੋ।`), coreConcept: "ਜੋੜ ਜਾਂ ਅੰਤਰ ਵਿੱਚ ਪਹਿਲਾਂ ਦੋਵੇਂ ਘਾਤਾਂ ਦੇ ਇਕਾਈ ਅੰਕ ਵੱਖ-ਵੱਖ ਕੱਢੇ ਜਾਂਦੇ ਹਨ।", strategy: "ਦੋਵੇਂ ਆਖਰੀ ਅੰਕ ਚੱਕਰ ਤੋਂ ਕੱਢੋ ਅਤੇ ਫਿਰ ਦਿੱਤਾ ਜੋੜ ਜਾਂ ਘਟਾਉ ਮਾਡਿਊਲੋ 10 ਵਿੱਚ ਪੂਰਾ ਕਰੋ।", steps: [`${firstBase}^${firstExponent} ਦਾ ਇਕਾਈ ਅੰਕ ${firstDigit} ਹੈ।`, `${secondBase}^${secondExponent} ਦਾ ਇਕਾਈ ਅੰਕ ${secondDigit} ਹੈ।`, operator === "+" ? `${firstDigit} + ${secondDigit} ਦਾ ਇਕਾਈ ਅੰਕ ${answer} ਹੈ।` : `${firstDigit} − ${secondDigit} ਨੂੰ ਮਾਡਿਊਲੋ 10 ਵਿੱਚ ਲੈਣ ਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`], finalAnswer: `ਇਕਾਈ ਅੰਕ ${answer} ਹੈ।` };
    }
    case "NUM-CP009-PROT-004": {
      const outerBase = numberValue(s, "outerBase"); const innerBase = numberValue(s, "innerBase"); const innerExponent = numberValue(s, "innerExponent"); const actualExponent = numberValue(s, "actualExponent"); const effectiveResidue = numberValue(s, "effectiveResidue"); const lastDigit = ((outerBase % 10) + 10) % 10; const cycle = cycleFromLastDigit(lastDigit); const expression = `${outerBase}^(${innerBase}^${innerExponent})`;
      return { stem: chooseStem(q, `${expression} ਦਾ ਇਕਾਈ ਅੰਕ ਕੀ ਹੈ?`, `ਘਾਤ-ਸਤੰਭ ${expression} ਦਾ ਆਖਰੀ ਅੰਕ ਕੱਢੋ।`, `${expression} ਵਿੱਚ ਉੱਪਰਲੀ ਘਾਤ ਨੂੰ ਸਿਰਫ਼ ਬਾਹਰੀ ਆਧਾਰ ਦੇ ਇਕਾਈ-ਅੰਕ ਚੱਕਰ ਅਨੁਸਾਰ ਘਟਾਓ। ਆਖਰੀ ਅੰਕ ਕੀ ਹੈ?`), coreConcept: "ਘਾਤ-ਸਤੰਭ ਵਿੱਚ ਬਾਹਰੀ ਆਧਾਰ ਦਾ ਇਕਾਈ-ਅੰਕ ਚੱਕਰ ਤੈਅ ਕਰਦਾ ਹੈ ਕਿ ਉੱਪਰਲੀ ਘਾਤ ਨੂੰ ਕਿੰਨਾ ਸਰਲ ਕਰਨਾ ਹੈ।", strategy: "ਬਾਹਰੀ ਆਧਾਰ ਦਾ ਚੱਕਰ ਕੱਢੋ, ਉੱਪਰਲੀ ਘਾਤ ਦਾ ਉਸ ਚੱਕਰ ਦੀ ਲੰਬਾਈ ਨਾਲ ਬਾਕੀ ਲਓ ਅਤੇ ਸਹੀ ਚੱਕਰ-ਸਥਾਨ ਪੜ੍ਹੋ।", steps: [`ਬਾਹਰੀ ਆਧਾਰ ${outerBase} ਦਾ ਆਖਰੀ ਅੰਕ ${lastDigit} ਹੈ ਅਤੇ ਚੱਕਰ ${cycleText(cycle)} ਹੈ।`, `${innerBase}^${innerExponent} = ${actualExponent}; ਚੱਕਰ ਲੰਬਾਈ ${cycle.length} ਨਾਲ ਬਾਕੀ ${effectiveResidue} ਹੈ।`, effectiveResidue === 0 ? `ਬਾਕੀ 0 ਹੋਣ ਤੇ ਚੱਕਰ ਦਾ ਆਖਰੀ ਸਥਾਨ ਲਿਆ ਜਾਂਦਾ ਹੈ, ਜਿਸ ਨਾਲ ${answer} ਮਿਲਦਾ ਹੈ।` : `ਚੱਕਰ ਦਾ ਸਥਾਨ ${effectiveResidue} ਇਕਾਈ ਅੰਕ ${answer} ਦਿੰਦਾ ਹੈ।`], finalAnswer: `ਇਕਾਈ ਅੰਕ ${answer} ਹੈ।` };
    }
    case "NUM-CP009-PROT-005": {
      const base = numberValue(s, "base"); const lastDigit = numberValue(s, "lastDigit"); const cycle = numberArray(s, "cycle");
      return { stem: chooseStem(q, `${base} ਦੀਆਂ ਲਗਾਤਾਰ ਧਨਾਤਮਕ ਘਾਤਾਂ ਦੇ ਇਕਾਈ ਅੰਕਾਂ ਦੇ ਦੁਹਰਾਵ ਚੱਕਰ ਦੀ ਲੰਬਾਈ ਕੀ ਹੈ?`, `${base} ਦੀਆਂ ਘਾਤਾਂ ਦੇ ਇਕਾਈ-ਅੰਕ ਚੱਕਰ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`, `${base} ਦੀਆਂ ਘਾਤਾਂ ਦੇ ਇਕਾਈ ਅੰਕ ਦੁਹਰਾਉਂਦੇ ਹਨ। ਕਿੰਨੀਆਂ ਘਾਤਾਂ ਬਾਅਦ ਇਹੀ ਕ੍ਰਮ ਮੁੜ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ?`), coreConcept: "ਲਗਾਤਾਰ ਘਾਤਾਂ ਦੇ ਆਖਰੀ ਅੰਕ ਇੱਕ ਛੋਟੇ ਨਿਸ਼ਚਿਤ ਕ੍ਰਮ ਵਿੱਚ ਦੁਹਰਾਉਂਦੇ ਹਨ।", strategy: "ਆਧਾਰ ਦੇ ਆਖਰੀ ਅੰਕ ਦੀਆਂ ਘਾਤਾਂ ਲਿਖੋ ਅਤੇ ਪੂਰਾ ਕ੍ਰਮ ਮੁੜ ਆਉਣ ਤੋਂ ਪਹਿਲਾਂ ਪਦਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ।", steps: [`${base} ਦਾ ਆਖਰੀ ਅੰਕ ${lastDigit} ਹੈ।`, `ਇਕਾਈ-ਅੰਕ ਕ੍ਰਮ ${cycleText(cycle)} ਹੈ।`, `ਦੁਹਰਾਵ ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਕ੍ਰਮ ਵਿੱਚ ${answer} ਪਦ ਹਨ।`], finalAnswer: `ਚੱਕਰ ਦੀ ਲੰਬਾਈ ${answer} ਹੈ।` };
    }
    case "NUM-CP009-PROT-006": {
      const base = numberValue(s, "base"); const lastDigit = numberValue(s, "lastDigit"); const targetDigit = numberValue(s, "targetDigit"); const residue = numberValue(s, "residue"); const cycle = numberArray(s, "cycle");
      return { stem: chooseStem(q, `ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਲਈ ${base}^n ਦਾ ਇਕਾਈ ਅੰਕ ${targetDigit} ਹੈ। n ਕਿਸ ਸਰਵਾਂਗਸਮਤਾ ਵਰਗ ਵਿੱਚ ਹੋਵੇਗਾ?`, `ਉਹ n ਦਾ ਵਰਗ ਚੁਣੋ ਜਿਸ ਲਈ ${base}^n ਦਾ ਇਕਾਈ ਅੰਕ ${targetDigit} ਹੋਵੇ।`, `${base}^n ਦਾ ਆਖਰੀ ਅੰਕ ${targetDigit} ਦਿੱਤਾ ਹੈ। n ਲਈ ਮਾਡਿਊਲੋ 4 ਵਿੱਚ ਸਹੀ ਸ਼ਰਤ ਕਿਹੜੀ ਹੈ?`), coreConcept: "ਨਿਸ਼ਾਨਾ ਇਕਾਈ ਅੰਕ ਆਧਾਰ ਦੇ ਘਾਤ-ਚੱਕਰ ਵਿੱਚ ਇੱਕ ਨਿਸ਼ਚਿਤ ਸਥਾਨ ਦੱਸਦਾ ਹੈ।", strategy: "ਨਿਸ਼ਾਨਾ ਅੰਕ ਨੂੰ ਚੱਕਰ ਵਿੱਚ ਲੱਭੋ ਅਤੇ ਉਸ ਸਥਾਨ ਨੂੰ n ਦੇ ਸਰਵਾਂਗਸਮਤਾ ਵਰਗ ਵਜੋਂ ਲਿਖੋ।", steps: [`${base} ਦਾ ਆਖਰੀ ਅੰਕ ${lastDigit} ਹੈ, ਇਸ ਲਈ ਚੱਕਰ ${cycleText(cycle)} ਹੈ।`, `ਨਿਸ਼ਾਨਾ ਅੰਕ ${targetDigit} ਘਾਤ ਦੇ ਬਾਕੀ ${residue} (ਮਾਡਿਊਲੋ 4) ਤੇ ਆਉਂਦਾ ਹੈ।`, `ਇਸ ਲਈ ${answer}।`], finalAnswer: `ਲੋੜੀਂਦਾ ਵਰਗ ${answer} ਹੈ।` };
    }
    case "NUM-CP009-PROT-007": {
      const base = numberValue(s, "base"); const lastDigit = numberValue(s, "lastDigit"); const cycle = numberArray(s, "cycle"); const modulus = numberValue(s, "modulus"); const residue = numberValue(s, "residue"); const targetDigit = numberValue(s, "targetDigit"); const lower = numberValue(s, "lower"); const upper = numberValue(s, "upper");
      return { stem: chooseStem(q, `${lower} ≤ n ≤ ${upper} ਵਿੱਚ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ n ਹਨ ਜਿਨ੍ਹਾਂ ਲਈ ${base}^n ਦਾ ਇਕਾਈ ਅੰਕ ${targetDigit} ਹੈ?`, `${lower} ਤੋਂ ${upper} ਤੱਕ ਉਹਨਾਂ ਘਾਤਾਂ n ਦੀ ਗਿਣਤੀ ਕਰੋ ਜਿਨ੍ਹਾਂ ਤੇ ${base}^n ਦਾ ਇਕਾਈ ਅੰਕ ${targetDigit} ਆਉਂਦਾ ਹੈ।`, `ਸ਼ਾਮਲ ਸੀਮਾ ${lower} ਤੋਂ ${upper} ਵਿੱਚ ਕਿੰਨੇ n ਉਸ ਚੱਕਰ-ਸਥਾਨ ਤੇ ਆਉਂਦੇ ਹਨ ਜੋ ਆਖਰੀ ਅੰਕ ${targetDigit} ਦਿੰਦਾ ਹੈ?`), coreConcept: "ਇੱਕ ਨਿਸ਼ਾਨਾ ਇਕਾਈ ਅੰਕ ਨਿਸ਼ਚਿਤ ਅੰਤਰ ਤੇ ਉਹੀ ਘਾਤ-ਬਾਕੀ ਦੁਹਰਾਉਂਦਾ ਹੈ।", strategy: "ਪਹਿਲਾਂ ਲੋੜੀਂਦਾ ਘਾਤ-ਬਾਕੀ ਪਛਾਣੋ, ਫਿਰ ਦਿੱਤੀ ਸ਼ਾਮਲ ਸੀਮਾ ਵਿੱਚ ਉਸੇ ਵਰਗ ਦੇ ਮੁੱਲ ਗਿਣੋ।", steps: [`${base} ਦਾ ਆਖਰੀ ਅੰਕ ${lastDigit} ਹੈ ਅਤੇ ਚੱਕਰ ${cycleText(cycle)} ਹੈ।`, `ਅੰਕ ${targetDigit} ਤਦ ਮਿਲਦਾ ਹੈ ਜਦੋਂ n ≡ ${residue} (mod ${modulus})।`, `${lower} ਤੋਂ ${upper} ਤੱਕ ਇਸ ਵਰਗ ਦੇ ${answer} ਮੁੱਲ ਹਨ।`], finalAnswer: `ਕੁੱਲ ਗਿਣਤੀ ${answer} ਹੈ।` };
    }
    case "NUM-CP009-PROT-008": {
      const base = numberValue(s, "base"); const exponent = numberValue(s, "exponent"); const order = numberValue(s, "order"); const reducedExponent = numberValue(s, "reducedExponent");
      return { stem: chooseStem(q, `${base}^${exponent} ਦੇ ਆਖਰੀ ਦੋ ਅੰਕ ਕੀ ਹਨ?`, `${base}^${exponent} ਦੇ ਆਖਰੀ ਦੋ ਅੰਕ ਕੱਢੋ; ਲੋੜ ਹੋਵੇ ਤਾਂ ਸ਼ੁਰੂਆਤੀ 0 ਵੀ ਲਿਖੋ।`, `${base}^${exponent} ਦਾ ਮਾਡਿਊਲੋ 100 ਵਿੱਚ ਬਾਕੀ ਲੈ ਕੇ ਦੋ-ਅੰਕੀ ਆਖਰੀ ਖੰਡ ਦੱਸੋ।`), coreConcept: "ਆਖਰੀ ਦੋ ਅੰਕ ਠੀਕ ਉਹੀ ਹਨ ਜੋ ਸੰਖਿਆ ਦਾ ਮਾਡਿਊਲੋ 100 ਵਿੱਚ ਬਾਕੀ ਹੈ।", strategy: "ਮਾਡਿਊਲੋ 100 ਵਿੱਚ ਘਾਤ ਦਾ ਦੁਹਰਾਵ ਚੱਕਰ ਲਓ, ਘਾਤ ਨੂੰ ਉਸ ਚੱਕਰ ਨਾਲ ਘਟਾਓ ਅਤੇ ਦੋ ਅੰਕਾਂ ਦਾ ਨਤੀਜਾ ਕਾਇਮ ਰੱਖੋ।", steps: [`ਆਧਾਰ ${base} ਲਈ ਮਾਡਿਊਲੋ 100 ਵਿੱਚ ਘਾਤ-ਚੱਕਰ ਦੀ ਲੰਬਾਈ ${order} ਹੈ।`, `${exponent} ਨੂੰ ਮਾਡਿਊਲੋ ${order} ਵਿੱਚ ਲੈਣ ਤੇ ${reducedExponent}${reducedExponent === 0 ? ` ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਚੱਕਰ ਦਾ ਆਖਰੀ ਸਥਾਨ ${order} ਲਿਆ ਜਾਂਦਾ ਹੈ` : " ਮਿਲਦਾ ਹੈ"}।`, `ਮਾਡਿਊਲੋ 100 ਵਿੱਚ ਆਖਰੀ ਬਾਕੀ ${answer} ਹੈ।`], finalAnswer: `ਆਖਰੀ ਦੋ ਅੰਕ ${answer} ਹਨ।` };
    }
    case "NUM-CP009-PROT-009": {
      const operator = stringValue(s, "operator"); const terms = termsValue(s); const residues = numberArray(s, "residues"); const expression = expressionText(terms, operator);
      return { stem: chooseStem(q, `${expression} ਦੇ ਆਖਰੀ ਦੋ ਅੰਕ ਕੀ ਹਨ?`, `${expression} ਦੇ ਆਖਰੀ ਦੋ ਅੰਕ ਕੱਢੋ; ਸ਼ੁਰੂਆਤੀ 0 ਹੋਵੇ ਤਾਂ ਉਹ ਵੀ ਰੱਖੋ।`, `${expression} ਵਿੱਚ ਹਰ ਘਾਤ ਨੂੰ ਮਾਡਿਊਲੋ 100 ਵਿੱਚ ਹੱਲ ਕਰਕੇ ਦਿੱਤੀ ਕਿਰਿਆ ਲਗਾਓ। ਆਖਰੀ ਦੋ-ਅੰਕੀ ਖੰਡ ਕੀ ਹੈ?`), coreConcept: "ਕਿਸੇ ਵਿਅੰਜਕ ਦੇ ਆਖਰੀ ਦੋ ਅੰਕ ਉਸ ਦੇ ਮਾਡਿਊਲੋ 100 ਵਿੱਚ ਬਾਕੀ ਤੋਂ ਮਿਲਦੇ ਹਨ।", strategy: "ਹਰ ਘਾਤ ਦਾ ਦੋ-ਅੰਕੀ ਬਾਕੀ ਵੱਖ ਕੱਢੋ ਅਤੇ ਫਿਰ ਦਿੱਤੀ ਕਿਰਿਆ ਮਾਡਿਊਲੋ 100 ਵਿੱਚ ਲਗਾਓ।", steps: [...terms.map((term, index) => `${term.base}^${term.exponent} ਦਾ ਮਾਡਿਊਲੋ 100 ਵਿੱਚ ਬਾਕੀ ${String(residues[index]).padStart(2, "0")} ਹੈ।`), `ਇਨ੍ਹਾਂ ਬਾਕੀਆਂ ਤੇ ਦਿੱਤੀ ਕਿਰਿਆ ਲਗਾਉਣ ਨਾਲ ${answer} ਮਿਲਦਾ ਹੈ।`], finalAnswer: `ਆਖਰੀ ਦੋ ਅੰਕ ${answer} ਹਨ।` };
    }
    case "NUM-CP009-PROT-010": {
      const base = numberValue(s, "base"); const exponent = numberValue(s, "exponent");
      return { stem: chooseStem(q, `${base}^${exponent} ਦੇ ਆਖਰੀ ਤਿੰਨ ਅੰਕ ਕੀ ਹਨ?`, `${base}^${exponent} ਦੇ ਆਖਰੀ ਤਿੰਨ ਅੰਕ ਕੱਢੋ; ਸ਼ੁਰੂਆਤੀ ਸਿਫ਼ਰ ਵੀ ਰੱਖੋ।`, `${base}^${exponent} ਨੂੰ ਮਾਡਿਊਲੋ 1000 ਵਿੱਚ ਹੱਲ ਕਰੋ। ਕਿਹੜਾ ਤਿੰਨ-ਅੰਕੀ ਆਖਰੀ ਖੰਡ ਮਿਲਦਾ ਹੈ?`), coreConcept: "ਆਖਰੀ ਤਿੰਨ ਅੰਕ ਸੰਖਿਆ ਦਾ ਮਾਡਿਊਲੋ 1000 ਵਿੱਚ ਬਾਕੀ ਹੁੰਦੇ ਹਨ।", strategy: "ਪੂਰੀ ਵੱਡੀ ਸੰਖਿਆ ਖੋਲ੍ਹਣ ਦੀ ਥਾਂ ਵਾਰ-ਵਾਰ ਵਰਗ ਕਰਕੇ ਮਾਡਿਊਲੋ 1000 ਵਿੱਚ ਘਾਤ ਕੱਢੋ।", steps: [`${base}^${exponent} ਨੂੰ ਮਾਡਿਊਲੋ 1000 ਵਿੱਚ ਗਿਣੋ।`, `ਬਾਕੀ ${answer} ਮਿਲਦਾ ਹੈ।`, `ਤਿੰਨ ਸਥਾਨ ਮੰਗੇ ਗਏ ਹਨ, ਇਸ ਲਈ ਨਤੀਜੇ ਨੂੰ ਤਿੰਨ ਅੰਕਾਂ ਦੇ ਖੰਡ ਵਜੋਂ ਹੀ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।`], finalAnswer: `ਆਖਰੀ ਤਿੰਨ ਅੰਕ ${answer} ਹਨ।` };
    }
    case "NUM-CP009-PROT-011": {
      const operator = stringValue(s, "operator"); const terms = termsValue(s); const residues = numberArray(s, "residues"); const expression = expressionText(terms, operator);
      return { stem: chooseStem(q, `${expression} ਦੇ ਆਖਰੀ ਤਿੰਨ ਅੰਕ ਕੀ ਹਨ?`, `${expression} ਦਾ ਆਖਰੀ ਤਿੰਨ-ਅੰਕੀ ਖੰਡ ਕੱਢੋ।`, `${expression} ਦੀ ਹਰ ਘਾਤ ਨੂੰ ਮਾਡਿਊਲੋ 1000 ਵਿੱਚ ਲੈ ਕੇ ਫਿਰ ਦਿੱਤੀ ਕਿਰਿਆ ਲਗਾਓ। ਆਖਰੀ ਖੰਡ ਕੀ ਹੈ?`), coreConcept: "ਤਿੰਨ-ਅੰਕੀ ਆਖਰੀ ਖੰਡ ਮਾਡਿਊਲੋ 1000 ਵਿੱਚ ਗਿਣਤੀ ਨਾਲ ਮਿਲਦਾ ਹੈ।", strategy: "ਹਰ ਘਾਤ ਨੂੰ ਮਾਡਿਊਲੋ 1000 ਵਿੱਚ ਹੱਲ ਕਰੋ ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ਹੀ ਜੋੜ, ਅੰਤਰ ਜਾਂ ਗੁਣਨਫਲ ਪੂਰਾ ਕਰੋ।", steps: [...terms.map((term, index) => `${term.base}^${term.exponent} ਦਾ ਮਾਡਿਊਲੋ 1000 ਵਿੱਚ ਬਾਕੀ ${String(residues[index]).padStart(3, "0")} ਹੈ।`), `ਇਨ੍ਹਾਂ ਬਾਕੀਆਂ ਤੇ ਦਿੱਤੀ ਕਿਰਿਆ ਲਗਾਉਣ ਨਾਲ ${answer} ਮਿਲਦਾ ਹੈ।`], finalAnswer: `ਆਖਰੀ ਤਿੰਨ ਅੰਕ ${answer} ਹਨ।` };
    }
    case "NUM-CP009-PROT-012": {
      const base = numberValue(s, "base"); const lastDigit = numberValue(s, "lastDigit"); const cycle = numberArray(s, "cycle"); const targetDigit = numberValue(s, "targetDigit"); const lower = numberValue(s, "lower"); const upper = numberValue(s, "upper"); const values = numberArray(s, "answerValues");
      return { stem: chooseStem(q, `${lower} ≤ n ≤ ${upper} ਲਈ ਉਹਨਾਂ ਸਾਰੇ n ਦਾ ਸਮੂਹ ਕੀ ਹੈ ਜਿਨ੍ਹਾਂ ਤੇ ${base}^n ਦਾ ਇਕਾਈ ਅੰਕ ${targetDigit} ਹੈ?`, `${lower} ਤੋਂ ${upper} ਤੱਕ ਹਰ ਉਹ n ਲਿਖੋ ਜਿਸ ਲਈ ${base}^n ਦਾ ਇਕਾਈ ਅੰਕ ${targetDigit} ਹੋਵੇ।`, `ਸੀਮਾ ${lower} ≤ n ≤ ${upper} ਵਿੱਚ ਆਖਰੀ ਅੰਕ ${targetDigit} ਦੇਣ ਵਾਲੀਆਂ ਘਾਤਾਂ ਦਾ ਪੂਰਾ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`), coreConcept: "ਨਿਸ਼ਾਨਾ ਇਕਾਈ ਅੰਕ ਚੱਕਰ ਵਿੱਚ ਨਿਸ਼ਚਿਤ ਘਾਤ-ਸਥਾਨਾਂ ਤੇ ਵਾਰ-ਵਾਰ ਆਉਂਦਾ ਹੈ।", strategy: "ਨਿਸ਼ਾਨਾ ਅੰਕ ਦਾ ਚੱਕਰ-ਸਥਾਨ ਲੱਭੋ ਅਤੇ ਦਿੱਤੀ ਸੀਮਾ ਵਿੱਚ ਸਿਰਫ਼ ਉਹਨਾਂ ਘਾਤਾਂ ਦੀ ਪੂਰੀ ਸੂਚੀ ਬਣਾਓ।", steps: [`${base} ਦਾ ਆਖਰੀ ਅੰਕ ${lastDigit} ਹੈ ਅਤੇ ਇਕਾਈ-ਅੰਕ ਚੱਕਰ ${cycleText(cycle)} ਹੈ।`, values.length === 0 ? `${lower} ਤੋਂ ${upper} ਤੱਕ ਕੋਈ ਵੀ ਘਾਤ ${targetDigit} ਨਹੀਂ ਦਿੰਦੀ।` : `ਮਿਲਦੇ ਚੱਕਰ-ਸਥਾਨਾਂ ਦੀ ਜਾਂਚ ਨਾਲ ${setText(values)} ਮਿਲਦਾ ਹੈ।`, `ਇਸ ਸੀਮਾ ਵਿੱਚ ਇਸ ਸਮੂਹ ਤੋਂ ਬਾਹਰ ਕੋਈ ਹੋਰ ਘਾਤ ਸ਼ਰਤ ਪੂਰੀ ਨਹੀਂ ਕਰਦੀ।`], finalAnswer: `ਪੂਰਾ ਸਮੂਹ ${answer} ਹੈ।` };
    }
    case "NUM-CP009-PROT-013": {
      const base = numberValue(s, "base"); const lastDigit = numberValue(s, "lastDigit"); const cycle = numberArray(s, "cycle"); const asksImpossible = booleanValue(s, "asksImpossible");
      return { stem: asksImpossible ? chooseStem(q, `ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਲਈ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅੰਕ ${base}^n ਦਾ ਇਕਾਈ ਅੰਕ ਕਦੇ ਨਹੀਂ ਹੋ ਸਕਦਾ?`, `${base}^n ਦੇ ਇਕਾਈ ਸਥਾਨ ਤੇ ਕਦੇ ਨਾ ਆਉਣ ਵਾਲਾ ਅੰਕ ਚੁਣੋ।`, `${base} ਦੀਆਂ ਘਾਤਾਂ ਦਾ ਇਕਾਈ-ਅੰਕ ਚੱਕਰ ਨਿਸ਼ਚਿਤ ਹੈ। ਕਿਹੜਾ ਵਿਕਲਪ ਇਸ ਚੱਕਰ ਤੋਂ ਬਾਹਰ ਹੈ?`) : chooseStem(q, `ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਦੇ ਕਿਸੇ ਮੁੱਲ ਤੇ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅੰਕ ${base}^n ਦਾ ਇਕਾਈ ਅੰਕ ਹੋ ਸਕਦਾ ਹੈ?`, `${base} ਦੀ ਕਿਸੇ ਧਨਾਤਮਕ ਘਾਤ ਦੇ ਇਕਾਈ ਸਥਾਨ ਤੇ ਆਉਣ ਵਾਲਾ ਅੰਕ ਚੁਣੋ।`, `ਵਿਕਲਪਾਂ ਵਿੱਚ ਕਿਹੜਾ ਅੰਕ ${base}^n ਦੇ ਦੁਹਰਾਵ ਵਾਲੇ ਇਕਾਈ-ਅੰਕ ਚੱਕਰ ਵਿੱਚ ਸ਼ਾਮਲ ਹੈ?`), coreConcept: "ਕਿਸੇ ਧਨਾਤਮਕ ਘਾਤ ਦਾ ਇਕਾਈ ਅੰਕ ਸਿਰਫ਼ ਆਧਾਰ ਦੇ ਦੁਹਰਾਵ ਵਾਲੇ ਚੱਕਰ ਵਿੱਚ ਮੌਜੂਦ ਅੰਕਾਂ ਵਿੱਚੋਂ ਹੋ ਸਕਦਾ ਹੈ।", strategy: "ਆਧਾਰ ਦਾ ਇਕਾਈ-ਅੰਕ ਚੱਕਰ ਲਿਖੋ ਅਤੇ ਵਿਕਲਪਾਂ ਦੀ ਉਸ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।", steps: [`${base} ਦਾ ਆਖਰੀ ਅੰਕ ${lastDigit} ਹੈ, ਇਸ ਲਈ ਚੱਕਰ ${cycleText(cycle)} ਹੈ।`, asksImpossible ? `${answer} ਇਸ ਚੱਕਰ ਵਿੱਚ ਕਿਤੇ ਨਹੀਂ ਆਉਂਦਾ।` : `${answer} ਇਸ ਚੱਕਰ ਵਿੱਚ ਆਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਸੰਭਵ ਹੈ।`], finalAnswer: asksImpossible ? `ਅਸੰਭਵ ਇਕਾਈ ਅੰਕ ${answer} ਹੈ।` : `ਇੱਕ ਸੰਭਵ ਇਕਾਈ ਅੰਕ ${answer} ਹੈ।` };
    }
    case "NUM-CP009-PROT-014": {
      const base = numberValue(s, "base"); const n = numberValue(s, "n"); const exponentKind = stringValue(s, "exponentKind"); const exponent = numberValue(s, "exponent"); const lastDigit = numberValue(s, "lastDigit"); const cycle = numberArray(s, "cycle"); const squareSum = exponentKind === "SUM_OF_SQUARES"; const exponentText = squareSum ? `1^2 + 2^2 + ... + ${n}^2` : `1 + 2 + ... + ${n}`;
      return { stem: chooseStem(q, `${base}^(${exponentText}) ਦਾ ਇਕਾਈ ਅੰਕ ਕੀ ਹੈ?`, `${base} ਦੀ ਘਾਤ ${exponentText} ਦਾ ਆਖਰੀ ਅੰਕ ਕੱਢੋ।`, `ਪਹਿਲਾਂ ਘਾਤ ${exponentText} ਨੂੰ ਸਰਲ ਕਰੋ, ਫਿਰ ${base} ਦੇ ਇਕਾਈ-ਅੰਕ ਚੱਕਰ ਨਾਲ ਆਖਰੀ ਅੰਕ ਕੱਢੋ।`), coreConcept: "ਜਦੋਂ ਘਾਤ ਖੁਦ ਕਿਸੇ ਕ੍ਰਮ ਦਾ ਜੋੜ ਹੋਵੇ, ਪਹਿਲਾਂ ਉਸ ਘਾਤ ਦਾ ਸਹੀ ਮੁੱਲ ਕੱਢਣਾ ਲਾਜ਼ਮੀ ਹੈ।", strategy: "ਬਣਤਰ ਵਾਲੀ ਘਾਤ ਨੂੰ ਸੂਤਰ ਨਾਲ ਸਰਲ ਕਰੋ, ਫਿਰ ਉਸ ਨੂੰ ਇਕਾਈ-ਅੰਕ ਚੱਕਰ ਦੀ ਲੰਬਾਈ ਨਾਲ ਘਟਾ ਕੇ ਸਹੀ ਸਥਾਨ ਚੁਣੋ।", steps: [squareSum ? `1^2 + 2^2 + ... + ${n}^2 = ${n}×${n + 1}×${2 * n + 1}/6 = ${exponent}।` : `1 + 2 + ... + ${n} = ${n}×${n + 1}/2 = ${exponent}।`, `${base} ਦਾ ਆਖਰੀ ਅੰਕ ${lastDigit} ਹੈ ਅਤੇ ਚੱਕਰ ${cycleText(cycle)} ਹੈ।`, `ਘਾਤ ${exponent} ਜਿਸ ਚੱਕਰ-ਸਥਾਨ ਤੇ ਆਉਂਦੀ ਹੈ, ਉੱਥੇ ਇਕਾਈ ਅੰਕ ${answer} ਹੈ।`], finalAnswer: `ਇਕਾਈ ਅੰਕ ${answer} ਹੈ।` };
    }
    case "NUM-CP009-PROT-015": {
      const width = numberValue(s, "width"); const modulus = numberValue(s, "modulus"); const base = numberValue(s, "base"); const exponent = numberValue(s, "exponent"); const terminal = width === 2 ? "ਆਖਰੀ ਦੋ ਅੰਕ" : "ਆਖਰੀ ਤਿੰਨ ਅੰਕ";
      return { stem: chooseStem(q, `${base}^${exponent} ਦੇ ${terminal} ਕੀ ਹਨ?`, `${base}^${exponent} ਦੇ ${terminal} ਕੱਢੋ; ਸ਼ੁਰੂਆਤੀ ਸਿਫ਼ਰ ਵੀ ਰੱਖੋ।`, `${base} ਅਤੇ ${modulus} ਆਪਸ ਵਿੱਚ ਸਹਭਾਜੀ ਨਹੀਂ ਹਨ। ਸਹਭਾਜੀ ਚੱਕਰ ਮੰਨਣ ਦੀ ਥਾਂ ਸਿੱਧਾ ਮਾਡਿਊਲੋ ${modulus} ਵਿੱਚ ਗਿਣੋ। ਕਿਹੜਾ ਆਖਰੀ ਖੰਡ ਮਿਲਦਾ ਹੈ?`), coreConcept: "ਆਧਾਰ ਵਿੱਚ 2 ਜਾਂ 5 ਦੇ ਗੁਣਨਖੰਡ ਹੋਣ ਤੇ ਵੀ ਆਖਰੀ ਅੰਕ ਸੰਬੰਧਿਤ 10 ਦੀ ਘਾਤ ਦੇ ਮਾਡਿਊਲੋ ਵਿੱਚ ਬਾਕੀ ਤੋਂ ਹੀ ਮਿਲਦੇ ਹਨ।", strategy: `ਸਿੱਧਾ ਮਾਡਿਊਲੋ ${modulus} ਵਿੱਚ ਘਾਤ ਕੱਢੋ; ਆਪਸੀ ਸਹਭਾਜਤਾ ਤੇ ਨਿਰਭਰ ਚੱਕਰ ਵਾਲਾ ਛੋਟਾ ਰਸਤਾ ਨਾ ਲਗਾਓ।`, steps: [`${base} ਅਤੇ ${modulus} ਦਾ ਇੱਕ ਸਾਂਝਾ ਗੁਣਨਖੰਡ ਹੈ, ਇਸ ਲਈ ਸਹਭਾਜੀ ਚੱਕਰ ਵਾਲਾ ਛੋਟਾ ਰਸਤਾ ਨਹੀਂ ਲਿਆ ਜਾਂਦਾ।`, `ਵਾਰ-ਵਾਰ ਵਰਗ ਕਰਕੇ ਮਾਡਿਊਲੋ ${modulus} ਵਿੱਚ ਬਾਕੀ ${answer} ਮਿਲਦਾ ਹੈ।`, `ਮੰਗੇ ਗਏ ਸਾਰੇ ${width} ਆਖਰੀ ਸਥਾਨ ਸਪਸ਼ਟ ਲਿਖੇ ਜਾਂਦੇ ਹਨ, ਸ਼ੁਰੂਆਤੀ ਸਿਫ਼ਰ ਸਮੇਤ।`], finalAnswer: `${terminal} ${answer} ਹਨ।` };
    }
    case "NUM-CP009-PROT-016": {
      const base = numberValue(s, "base"); const lastDigit = numberValue(s, "lastDigit"); const cycle = numberArray(s, "cycle"); const allowedDigits = numberArray(s, "allowedDigits"); const residues = numberArray(s, "residues"); const allowedText = `{${allowedDigits.join(", ")}}`;
      return { stem: chooseStem(q, `ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਲਈ ${base}^n ਦਾ ਇਕਾਈ ਅੰਕ ${allowedText} ਵਿੱਚ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ। n ਦੇ ਸਾਰੇ ਮੰਨਣਯੋਗ ਸਰਵਾਂਗਸਮਤਾ ਵਰਗਾਂ ਦਾ ਪੂਰਾ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`, `ਮਾਡਿਊਲੋ 4 ਵਿੱਚ n ਦੇ ਉਹ ਸਾਰੇ ਵਰਗ ਚੁਣੋ ਜਿਨ੍ਹਾਂ ਤੇ ${base}^n ਦਾ ਇਕਾਈ ਅੰਕ ${allowedText} ਵਿੱਚ ਆਉਂਦਾ ਹੈ।`, `ਇਹ ਆਖਰੀ-ਅੰਕ ਸ਼ਰਤ ਚੱਕਰ ਦੇ ਇੱਕ ਤੋਂ ਵੱਧ ਸਥਾਨ ਮੰਨਦੀ ਹੈ। ਕਿਹੜਾ ਵਿਕਲਪ n ਦੇ ਸਾਰੇ ਮੰਨਣਯੋਗ ਵਰਗ ਦਿੰਦਾ ਹੈ?`), coreConcept: "ਜਦੋਂ ਕਈ ਇਕਾਈ ਅੰਕ ਮਨਜ਼ੂਰ ਹੋਣ, ਤਾਂ ਘਾਤ-ਚੱਕਰ ਦੇ ਕਈ ਸਥਾਨ ਇਕੱਠੇ ਮੰਨਣਯੋਗ ਹੋ ਸਕਦੇ ਹਨ।", strategy: "ਹਰ ਮਨਜ਼ੂਰ ਇਕਾਈ ਅੰਕ ਨੂੰ ਉਸ ਦੇ ਚੱਕਰ-ਸਥਾਨ ਨਾਲ ਮਿਲਾਓ ਅਤੇ ਸਾਰੇ ਸੰਬੰਧਿਤ ਘਾਤ-ਬਾਕੀਆਂ ਦਾ ਜੋੜਿਆ ਸਮੂਹ ਲਓ।", steps: [`${base} ਦਾ ਆਖਰੀ ਅੰਕ ${lastDigit} ਹੈ ਅਤੇ ਚੱਕਰ ${cycleText(cycle)} ਹੈ।`, `ਮਨਜ਼ੂਰ ਅੰਕ ${allowedText} ਘਾਤ-ਬਾਕੀ ${residues.join(", ")} (ਮਾਡਿਊਲੋ 4) ਤੇ ਆਉਂਦੇ ਹਨ।`, `ਸਾਰੇ ਮਨਜ਼ੂਰ ਸਥਾਨ ਰੱਖਣ ਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`], finalAnswer: `ਪੂਰਾ ਘਾਤ-ਵਰਗ ਸਮੂਹ ${answer} ਹੈ।` };
    }
    case "NUM-CP009-PROT-017": {
      const base = numberValue(s, "base"); const lastDigit = numberValue(s, "lastDigit"); const cycle = numberArray(s, "cycle"); const termCount = numberValue(s, "termCount"); const cycleSum = numberValue(s, "cycleSum"); const fullBlocks = numberValue(s, "fullBlocks"); const leftoverCount = numberValue(s, "leftoverCount"); const leftoverSum = numberValue(s, "leftoverSum");
      return { stem: chooseStem(q, `${base}^1 + ${base}^2 + ... + ${base}^${termCount} ਦਾ ਇਕਾਈ ਅੰਕ ਕੀ ਹੈ?`, `ਜੋੜ ${base} + ${base}^2 + ... + ${base}^${termCount} ਦਾ ਆਖਰੀ ਅੰਕ ਕੱਢੋ।`, `ਇਸ ਲੰਮੇ ਜੋੜ ਵਿੱਚ ${base} ਦੀਆਂ ਪਹਿਲੀਆਂ ${termCount} ਧਨਾਤਮਕ ਘਾਤਾਂ ਹਨ। ਹਰ ਪਦ ਖੋਲ੍ਹਣ ਦੀ ਥਾਂ ਪੂਰੇ ਇਕਾਈ-ਅੰਕ ਚੱਕਰਾਂ ਨੂੰ ਸਮੂਹਿਤ ਕਰੋ। ਆਖਰੀ ਅੰਕ ਕੀ ਹੈ?`), coreConcept: "ਲਗਾਤਾਰ ਘਾਤਾਂ ਦੇ ਲੰਮੇ ਜੋੜ ਵਿੱਚ ਇਕਾਈ ਅੰਕ ਚੱਕਰਾਂ ਦੇ ਪੂਰੇ ਖੰਡਾਂ ਵਿੱਚ ਦੁਹਰਾਉਂਦੇ ਹਨ।", strategy: "ਇੱਕ ਪੂਰਾ ਇਕਾਈ-ਅੰਕ ਚੱਕਰ ਅਤੇ ਉਸ ਦਾ ਜੋੜ ਕੱਢੋ, ਪੂਰੇ ਚੱਕਰ-ਖੰਡ ਗਿਣੋ ਅਤੇ ਬਚੇ ਪਦ ਜੋੜੋ।", steps: [`${base} ਦਾ ਆਖਰੀ ਅੰਕ ${lastDigit} ਹੈ; ਚੱਕਰ ${cycleText(cycle)} ਹੈ ਅਤੇ ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦਾ ਜੋੜ ${cycleSum} ਹੈ।`, `${termCount} ਪਦਾਂ ਵਿੱਚ ${fullBlocks} ਪੂਰੇ ਚੱਕਰ-ਖੰਡ ਅਤੇ ${leftoverCount} ਬਚੇ ਪਦ ਹਨ।`, `ਬਚੇ ਪਦਾਂ ਦਾ ਜੋੜ ${leftoverSum} ਹੈ, ਇਸ ਲਈ ਕੁੱਲ ਦਾ ਇਕਾਈ ਅੰਕ ${answer} ਬਣਦਾ ਹੈ।`], finalAnswer: `ਇਕਾਈ ਅੰਕ ${answer} ਹੈ।` };
    }
    default:
      throw new Error(`Unsupported NUM-CP-009 prototype for Punjabi localization: ${q.temporaryPrototypeId}`);
  }
}

export function localizeNumCp009Answer(value: string, _language: NumCp009LocalizedLanguage): string {
  return value;
}

export function generateNumCp009Localized(
  qlId: NumCp009PermanentQlId,
  seed: number,
  language: NumCp009LocalizedLanguage,
): NumCp009LocalizedPackage {
  const source = generateNumCp009Permanent(qlId, seed);
  const content = language === "hi" ? hindi(source) : punjabi(source);
  const locale = localeFor(language);

  return Object.freeze({
    ...source,
    locale,
    language,
    stem: content.stem,
    options: source.options,
    canonicalAnswer: localizeNumCp009Answer(source.canonicalAnswer, language),
    verifierAnswer: localizeNumCp009Answer(source.verifierAnswer, language),
    explanation: Object.freeze({
      coreConcept: content.coreConcept,
      strategy: content.strategy,
      steps: Object.freeze([...content.steps]),
      finalAnswer: content.finalAnswer,
    }),
    localization: Object.freeze({
      version: "num-cp009-hi-pa-human-v1" as const,
      canonicalLocale: "en-IN" as const,
      canonicalQuestionId: qlId,
      mathematicalStatePreserved: true as const,
      optionOrderPreserved: true as const,
      correctIndexPreserved: true as const,
      misconceptionMappingPreserved: true as const,
      answerKeyPreserved: true as const,
      englishAuthorityFrozen: true as const,
      lifecycleLocked: true as const,
    }),
    lifecycle: Object.freeze({
      permanentQlId: qlId,
      maturity: "PERMANENT_AUTHORITY" as const,
      reviewStatus: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
      englishAuthorityStatus: "ENGLISH_FROZEN" as const,
      localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    }),
  }) as NumCp009LocalizedPackage;
}
