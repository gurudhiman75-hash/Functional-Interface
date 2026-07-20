import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

function cleanTaggedLatex(line: string | undefined, fallback: string) {
  const value = line?.trim() || fallback;
  return value
    .replace(/^\$+|\$+$/g, "")
    .replace(/^(?:\\text\{[^}]+\}|[A-Za-z ]+)\s*:\s*/, "")
    .trim();
}

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
}

function n(evidence: ExplanationEvidence, key: string) {
  return Number(evidence.variables[key]);
}

function s(evidence: ExplanationEvidence, key: string, fallback = key) {
  return String(evidence.variables[key] ?? fallback);
}

function d(evidence: ExplanationEvidence, key: string) {
  return evidence.derivedValues[key];
}

function numberText(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number)
    ? String(Number(number.toFixed(4)))
    : String(value ?? "");
}

function mathStep(stepId: string, type: ExplanationStep["type"], narrative: string, mathLatex: string): ExplanationStep {
  return { stepId, type, narrative, mathLatex };
}

function conclusion(answer: string, narrative = "So, the answer is"): ExplanationStep {
  return mathStep("step-final", "CONCLUSION", narrative, answer);
}

export class NaturalExamRenderer implements ExplanationRenderer {
  constructor(
    private readonly title: string,
    private readonly solverMathJax: Record<string, string>,
  ) {}

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const answer = cleanAnswer(evidence.answer);
    const setup = cleanTaggedLatex(this.solverMathJax.setupLatex, "\\text{given relation}");
    const calculation = cleanTaggedLatex(this.solverMathJax.calculationLatex, answer);

    switch (this.title) {
      case "link the chain ratios": {
        const personA = s(evidence, "personA", "A");
        const personB = s(evidence, "personB", "B");
        const personC = s(evidence, "personC", "C");
        const personD = s(evidence, "personD", "D");
        const ratioA = n(evidence, "ratioA");
        const ratioB = n(evidence, "ratioB");
        const ratioBPrime = n(evidence, "ratioB_prime");
        const ratioC = n(evidence, "ratioC");
        const ratioCPrime = n(evidence, "ratioC_prime");
        const ratioD = n(evidence, "ratioD");
        return [
          mathStep("step-1", "GOAL", "Write the three linked ratios as fractions.", `\\frac{${personA}}{${personB}}=\\frac{${ratioA}}{${ratioB}},\\quad \\frac{${personB}}{${personC}}=\\frac{${ratioBPrime}}{${ratioC}},\\quad \\frac{${personC}}{${personD}}=\\frac{${ratioCPrime}}{${ratioD}}`),
          mathStep("step-2", "FORMULA", `Multiply them; ${personB} and ${personC} cancel.`, `\\frac{${personA}}{${personD}}=\\frac{${ratioA}}{${ratioB}}\\times\\frac{${ratioBPrime}}{${ratioC}}\\times\\frac{${ratioCPrime}}{${ratioD}}`),
          mathStep("step-3", "SUBSTITUTION", "Simplifying the product gives", `${personA}:${personD}=${calculation}`),
          conclusion(answer, `So, ${personA}:${personD} is`),
        ];
      }

      case "find the matching component": {
        const personA = s(evidence, "personA", "first group");
        const personB = s(evidence, "personB", "second group");
        const ratioA = n(evidence, "ratioA");
        const ratioB = n(evidence, "ratioB");
        const valueA = n(evidence, "valueA");
        const unit = valueA / ratioA;
        return [
          mathStep("step-1", "GOAL", `${ratioA} ratio parts of ${personA} equal ${valueA}.`, `${ratioA}\\text{ parts}=${valueA}`),
          mathStep("step-2", "FORMULA", "Find the value of one ratio part.", `1\\text{ part}=\\frac{${valueA}}{${ratioA}}=${numberText(unit)}`),
          mathStep("step-3", "SUBSTITUTION", `${personB} has ${ratioB} ratio parts.`, `${personB}=${ratioB}\\times${numberText(unit)}=${answer}`),
          conclusion(answer, `So, the number of ${personB} is`),
        ];
      }

      case "compare two shares": {
        const total = n(evidence, "totalAmount");
        const ratioA = n(evidence, "ratioA");
        const ratioB = n(evidence, "ratioB");
        const ratioC = n(evidence, "ratioC");
        const personA = s(evidence, "personA", "first group");
        const personC = s(evidence, "personC", "third group");
        const sum = ratioA + ratioB + ratioC;
        const unit = total / sum;
        const differenceParts = ratioA - ratioC;
        return [
          mathStep("step-1", "GOAL", "Add the ratio parts.", `${ratioA}+${ratioB}+${ratioC}=${sum}`),
          mathStep("step-2", "FORMULA", "Find the amount represented by one ratio part.", `1\\text{ part}=\\frac{${total}}{${sum}}=${numberText(unit)}`),
          mathStep("step-3", "SUBSTITUTION", `${personA} and ${personC} differ by ${differenceParts} ratio part${Math.abs(differenceParts) === 1 ? "" : "s"}.`, `(${ratioA}-${ratioC})\\times${numberText(unit)}=${answer}`),
          conclusion(answer, `So, the difference between their shares is`),
        ];
      }

      case "recover the total from share difference": {
        const ratioA = n(evidence, "ratioA");
        const ratioB = n(evidence, "ratioB");
        const ratioC = n(evidence, "ratioC");
        const difference = n(evidence, "shareDifference");
        const differenceParts = ratioA - ratioC;
        const unit = difference / differenceParts;
        const sum = ratioA + ratioB + ratioC;
        return [
          mathStep("step-1", "GOAL", "Convert the given share difference into ratio parts.", `${ratioA}-${ratioC}=${differenceParts}\\text{ parts}`),
          mathStep("step-2", "FORMULA", "Find the value of one ratio part.", `1\\text{ part}=\\frac{${difference}}{${differenceParts}}=${numberText(unit)}`),
          mathStep("step-3", "SUBSTITUTION", `The complete ratio contains ${sum} parts.`, `(${ratioA}+${ratioB}+${ratioC})\\times${numberText(unit)}=${answer}`),
          conclusion(answer, "So, the total fund is"),
        ];
      }

      case "split salary into expenses and savings": {
        const expenseParts = n(evidence, "ratioExp");
        const savingParts = n(evidence, "ratioSav");
        const salary = n(evidence, "totalSalary");
        const totalParts = expenseParts + savingParts;
        const unit = salary / totalParts;
        return [
          mathStep("step-1", "GOAL", "Add the expense and savings parts.", `${expenseParts}+${savingParts}=${totalParts}`),
          mathStep("step-2", "FORMULA", "Find the value of one part.", `1\\text{ part}=\\frac{${salary}}{${totalParts}}=${numberText(unit)}`),
          mathStep("step-3", "SUBSTITUTION", `Savings correspond to ${savingParts} parts.`, `${savingParts}\\times${numberText(unit)}=${answer}`),
          conclusion(answer, "So, the monthly savings are"),
        ];
      }

      case "solve the ratio after addition": {
        const ratioA = n(evidence, "ratioA");
        const ratioB = n(evidence, "ratioB");
        const added = n(evidence, "addedCount");
        const finalA = n(evidence, "finalRatioA");
        const finalB = n(evidence, "finalRatioB");
        const x = Number(d(evidence, "x"));
        const groupA = s(evidence, "groupA", "first group");
        return [
          mathStep("step-1", "GOAL", "Let the original numbers be the given ratio multiplied by x.", `${ratioA}x:${ratioB}x`),
          mathStep("step-2", "FORMULA", `After ${added} are added to ${groupA},`, `\\frac{${ratioA}x+${added}}{${ratioB}x}=\\frac{${finalA}}{${finalB}}`),
          mathStep("step-3", "SUBSTITUTION", "Solving the equation gives", `x=${numberText(x)}`),
          mathStep("step-4", "SIMPLIFICATION", `The original number of ${groupA} was`, `${ratioA}\\times${numberText(x)}=${answer}`),
          conclusion(answer, `So, ${groupA} originally numbered`),
        ];
      }

      case "solve the ratio after removal": {
        const ratioA = n(evidence, "ratioA");
        const ratioB = n(evidence, "ratioB");
        const removed = n(evidence, "removedCount");
        const finalA = n(evidence, "finalRatioA");
        const finalB = n(evidence, "finalRatioB");
        const x = Number(d(evidence, "x"));
        return [
          mathStep("step-1", "GOAL", "Let the original numbers be the ratio parts multiplied by x.", `${ratioA}x:${ratioB}x`),
          mathStep("step-2", "FORMULA", `After ${removed} are removed from the first group,`, `\\frac{${ratioA}x-${removed}}{${ratioB}x}=\\frac{${finalA}}{${finalB}}`),
          mathStep("step-3", "SUBSTITUTION", "Solving the equation gives", `x=${numberText(x)}`),
          mathStep("step-4", "SIMPLIFICATION", "The original total was", `(${ratioA}+${ratioB})\\times${numberText(x)}=${answer}`),
          conclusion(answer, "So, the original total was"),
        ];
      }

      case "solve the changed number ratio": {
        const ratioA = n(evidence, "ratioA");
        const ratioB = n(evidence, "ratioB");
        const added = n(evidence, "transferredCount");
        const finalA = n(evidence, "finalRatioA");
        const finalB = n(evidence, "finalRatioB");
        const x = Number(d(evidence, "x"));
        const largerPart = Math.max(ratioA, ratioB);
        return [
          mathStep("step-1", "GOAL", "Let the two numbers be the ratio parts multiplied by x.", `${ratioA}x:${ratioB}x`),
          mathStep("step-2", "FORMULA", `Adding ${added} to both numbers gives`, `\\frac{${ratioA}x+${added}}{${ratioB}x+${added}}=\\frac{${finalA}}{${finalB}}`),
          mathStep("step-3", "SUBSTITUTION", "Solving the equation gives", `x=${numberText(x)}`),
          mathStep("step-4", "SIMPLIFICATION", "The larger original number is", `${largerPart}\\times${numberText(x)}=${answer}`),
          conclusion(answer, "So, the larger number is"),
        ];
      }

      case "compare income, expense, and saving": {
        const incomeA = n(evidence, "incomeRatioA");
        const incomeB = n(evidence, "incomeRatioB");
        const expenseA = n(evidence, "expRatioA");
        const expenseB = n(evidence, "expRatioB");
        const saving = n(evidence, "savingsAmount");
        const x = Number(d(evidence, "x"));
        return [
          mathStep("step-1", "GOAL", "Let the income ratio use multiplier x and the expenditure ratio use multiplier y.", `${incomeA}x,${incomeB}x;\\quad ${expenseA}y,${expenseB}y`),
          mathStep("step-2", "FORMULA", "For each person, savings equal income minus expenditure.", `${incomeA}x-${expenseA}y=${saving},\\quad ${incomeB}x-${expenseB}y=${saving}`),
          mathStep("step-3", "SUBSTITUTION", "Solving the two equations gives the income multiplier.", `x=${numberText(x)}`),
          mathStep("step-4", "SIMPLIFICATION", "The first person's income is", `${incomeA}\\times${numberText(x)}=${answer}`),
          conclusion(answer, "So, the required income is"),
        ];
      }

      case "track addition and removal together": {
        const ratioA = n(evidence, "ratioA");
        const ratioB = n(evidence, "ratioB");
        const added = n(evidence, "addedCount");
        const removed = n(evidence, "removedCount");
        const finalA = n(evidence, "finalRatioA");
        const finalB = n(evidence, "finalRatioB");
        const x = Number(d(evidence, "x"));
        return [
          mathStep("step-1", "GOAL", "Let the original numbers be the ratio parts multiplied by x.", `${ratioA}x:${ratioB}x`),
          mathStep("step-2", "FORMULA", "Apply the stated addition and removal before forming the new ratio.", `\\frac{${ratioA}x+${added}}{${ratioB}x-${removed}}=\\frac{${finalA}}{${finalB}}`),
          mathStep("step-3", "SUBSTITUTION", "Solving the equation gives", `x=${numberText(x)}`),
          mathStep("step-4", "SIMPLIFICATION", "The original second-group count was", `${ratioB}\\times${numberText(x)}=${answer}`),
          conclusion(answer, "So, the original number was"),
        ];
      }

      case "find the mean proportional": {
        const a = n(evidence, "numA");
        const b = n(evidence, "numB");
        return [
          mathStep("step-1", "GOAL", "Let the mean proportional be x.", `a:x=x:b`),
          mathStep("step-2", "FORMULA", "Cross-multiplication gives", `x^2=${a}\\times${b}`),
          mathStep("step-3", "SUBSTITUTION", "Taking the positive square root,", `x=\\sqrt{${a}\\times${b}}=${answer}`),
          conclusion(answer, "So, the mean proportional is"),
        ];
      }

      case "find the third proportional": {
        const a = n(evidence, "numA");
        const b = n(evidence, "numB");
        return [
          mathStep("step-1", "GOAL", "Let the third proportional be x.", `${a}:${b}=${b}:x`),
          mathStep("step-2", "FORMULA", "Cross-multiply.", `${a}x=${b}^2`),
          mathStep("step-3", "SUBSTITUTION", "Therefore,", `x=\\frac{${b}^2}{${a}}=${answer}`),
          conclusion(answer, "So, the third proportional is"),
        ];
      }

      case "find the fourth proportional": {
        const a = n(evidence, "numA");
        const b = n(evidence, "numB");
        const c = n(evidence, "numC");
        return [
          mathStep("step-1", "GOAL", "Let the fourth proportional be x.", `${a}:${b}=${c}:x`),
          mathStep("step-2", "FORMULA", "Cross-multiply.", `${a}x=${b}\\times${c}`),
          mathStep("step-3", "SUBSTITUTION", "Therefore,", `x=\\frac{${b}\\times${c}}{${a}}=${answer}`),
          conclusion(answer, "So, the fourth proportional is"),
        ];
      }

      case "use direct variation": {
        const x1 = n(evidence, "varX1");
        const y1 = n(evidence, "varY1");
        const x2 = n(evidence, "varX2");
        const constant = y1 / x1;
        return [
          mathStep("step-1", "GOAL", "For direct variation, y/x is constant.", `\\frac{y}{x}=k`),
          mathStep("step-2", "FORMULA", "Find the constant from the first pair.", `k=\\frac{${y1}}{${x1}}=${numberText(constant)}`),
          mathStep("step-3", "SUBSTITUTION", `When x=${x2},`, `y=${numberText(constant)}\\times${x2}=${answer}`),
          conclusion(answer, "So, the new value of y is"),
        ];
      }

      case "use inverse variation": {
        const x1 = n(evidence, "varX1");
        const y1 = n(evidence, "varY1");
        const x2 = n(evidence, "varX2");
        const constant = y1 * x1;
        return [
          mathStep("step-1", "GOAL", "For inverse variation, xy is constant.", `xy=k`),
          mathStep("step-2", "FORMULA", "Find the constant from the first pair.", `k=${x1}\\times${y1}=${numberText(constant)}`),
          mathStep("step-3", "SUBSTITUTION", `When x=${x2},`, `y=\\frac{${numberText(constant)}}{${x2}}=${answer}`),
          conclusion(answer, "So, the new value of y is"),
        ];
      }

      case "convert coin ratios into value": {
        const ratios = [n(evidence, "ratio1"), n(evidence, "ratio2"), n(evidence, "ratio3")];
        const denoms = [n(evidence, "denom1"), n(evidence, "denom2"), n(evidence, "denom3")];
        const total = n(evidence, "totalValue");
        const targetDenom = n(evidence, "targetDenom");
        const weighted = ratios.reduce((sum, ratio, index) => sum + ratio * denoms[index]!, 0);
        const unit = total / weighted;
        const targetIndex = denoms.indexOf(targetDenom);
        return [
          mathStep("step-1", "GOAL", "Let the coin counts be the ratio parts multiplied by x.", `${ratios[0]}x:${ratios[1]}x:${ratios[2]}x`),
          mathStep("step-2", "FORMULA", "Multiply each count by its denomination to form the total value.", `${ratios[0]}x\\times${denoms[0]}+${ratios[1]}x\\times${denoms[1]}+${ratios[2]}x\\times${denoms[2]}=${total}`),
          mathStep("step-3", "SUBSTITUTION", "One ratio unit is", `x=\\frac{${total}}{${weighted}}=${numberText(unit)}`),
          mathStep("step-4", "SIMPLIFICATION", `The number of ${targetDenom}-value coins is`, `${ratios[targetIndex]}\\times${numberText(unit)}=${answer}`),
          conclusion(answer, `So, there are ${answer} coins of denomination ${targetDenom}`),
        ];
      }

      case "map value ratios to coin counts": {
        const denoms = [n(evidence, "denom1"), n(evidence, "denom2"), n(evidence, "denom3"), n(evidence, "denom4")];
        const valueRatios = [n(evidence, "valRatio1"), n(evidence, "valRatio2"), n(evidence, "valRatio3"), n(evidence, "valRatio4")];
        const countWeights = [d(evidence, "countWeight1"), d(evidence, "countWeight2"), d(evidence, "countWeight3"), d(evidence, "countWeight4")].map(Number);
        const totalCoins = n(evidence, "totalCoins");
        const targetDenom = n(evidence, "targetDenom");
        const sum = countWeights.reduce((left, right) => left + right, 0);
        const unit = Number(d(evidence, "unit"));
        const targetIndex = denoms.indexOf(targetDenom);
        return [
          mathStep("step-1", "GOAL", "Convert value ratio into count ratio by dividing by denomination.", `${valueRatios.map((value, index) => `\\frac{${value}}{${denoms[index]}}`).join(":")}`),
          mathStep("step-2", "FORMULA", "The resulting count ratio is", `${countWeights.join(":")}`),
          mathStep("step-3", "SUBSTITUTION", "Use the total number of coins to find one ratio unit.", `1\\text{ unit}=\\frac{${totalCoins}}{${sum}}=${numberText(unit)}`),
          mathStep("step-4", "SIMPLIFICATION", `The count of denomination ${targetDenom} is`, `${countWeights[targetIndex]}\\times${numberText(unit)}=${answer}`),
          conclusion(answer, `So, the number of ${targetDenom}-value coins is`),
        ];
      }

      case "use weighted ratio units": {
        const ratios = [n(evidence, "ratioA"), n(evidence, "ratioB"), n(evidence, "ratioC")];
        const counts = [n(evidence, "countA"), n(evidence, "countB"), n(evidence, "countC")];
        const total = n(evidence, "totalWeight");
        const weightedUnits = counts.reduce((sum, count, index) => sum + count * ratios[index]!, 0);
        const unit = Number(d(evidence, "unit"));
        return [
          mathStep("step-1", "GOAL", "Let one weight-ratio unit be x grams.", `${ratios[0]}x:${ratios[1]}x:${ratios[2]}x`),
          mathStep("step-2", "FORMULA", "Use the given numbers of items to form the total weight.", `${counts[0]}(${ratios[0]}x)+${counts[1]}(${ratios[1]}x)+${counts[2]}(${ratios[2]}x)=${total}`),
          mathStep("step-3", "SUBSTITUTION", "Solve for one ratio unit.", `x=\\frac{${total}}{${weightedUnits}}=${numberText(unit)}`),
          mathStep("step-4", "SIMPLIFICATION", "The first item's weight is", `${ratios[0]}\\times${numberText(unit)}=${answer}`),
          conclusion(answer, "So, the required weight is"),
        ];
      }

      case "use subject weights with ratio marks": {
        const ratios = [n(evidence, "ratio1"), n(evidence, "ratio2"), n(evidence, "ratio3")];
        const weights = [n(evidence, "w1"), n(evidence, "w2"), n(evidence, "w3")];
        const total = n(evidence, "totalScore");
        const weightedUnits = ratios.reduce((sum, ratio, index) => sum + ratio * weights[index]!, 0);
        const unit = Number(d(evidence, "unit"));
        const subject = s(evidence, "sub1", "first subject");
        return [
          mathStep("step-1", "GOAL", "Let the marks be the ratio parts multiplied by x.", `${ratios[0]}x:${ratios[1]}x:${ratios[2]}x`),
          mathStep("step-2", "FORMULA", "Apply the given weights to the marks.", `${ratios[0]}x\\times${weights[0]}+${ratios[1]}x\\times${weights[1]}+${ratios[2]}x\\times${weights[2]}=${total}`),
          mathStep("step-3", "SUBSTITUTION", "Solve for x.", `x=\\frac{${total}}{${weightedUnits}}=${numberText(unit)}`),
          mathStep("step-4", "SIMPLIFICATION", `${subject} marks are`, `${ratios[0]}\\times${numberText(unit)}=${answer}`),
          conclusion(answer, `So, the marks obtained in ${subject} are`),
        ];
      }

      case "solve the two-component mixture": {
        const r1 = n(evidence, "ratio1");
        const r2 = n(evidence, "ratio2");
        const added = n(evidence, "addedAmount");
        const f1 = n(evidence, "finalRatio1");
        const f2 = n(evidence, "finalRatio2");
        const unit = Number(d(evidence, "unit"));
        const liquid1 = s(evidence, "liquid1", "first component");
        const liquid2 = s(evidence, "liquid2", "second component");
        return [
          mathStep("step-1", "GOAL", "Let the original quantities be the ratio parts multiplied by x.", `${liquid1}:${liquid2}=${r1}x:${r2}x`),
          mathStep("step-2", "FORMULA", `After adding ${added} litres of ${liquid1},`, `\\frac{${r1}x+${added}}{${r2}x}=\\frac{${f1}}{${f2}}`),
          mathStep("step-3", "SUBSTITUTION", "Solving gives", `x=${numberText(unit)}`),
          mathStep("step-4", "SIMPLIFICATION", `The original quantity of ${liquid2} was`, `${r2}\\times${numberText(unit)}=${answer}`),
          conclusion(answer, `So, the initial quantity of ${liquid2} was`),
        ];
      }

      case "add one component to reach a ratio": {
        const total = n(evidence, "totalVolume");
        const r1 = n(evidence, "ratio1");
        const r2 = n(evidence, "ratio2");
        const f1 = n(evidence, "finalRatio1");
        const f2 = n(evidence, "finalRatio2");
        const liquid1 = s(evidence, "liquid1", "first component");
        const liquid2 = s(evidence, "liquid2", "second component");
        const initial1 = Number(d(evidence, "initial1"));
        const initial2 = Number(d(evidence, "initial2"));
        return [
          mathStep("step-1", "GOAL", `Find the original amounts of ${liquid1} and ${liquid2}.`, `${liquid1}=\\frac{${total}\\times${r1}}{${r1 + r2}}=${numberText(initial1)},\\quad ${liquid2}=\\frac{${total}\\times${r2}}{${r1 + r2}}=${numberText(initial2)}`),
          mathStep("step-2", "FORMULA", `Let x litres of ${liquid2} be added.`, `\\frac{${numberText(initial1)}}{${numberText(initial2)}+x}=\\frac{${f1}}{${f2}}`),
          mathStep("step-3", "SUBSTITUTION", "Cross-multiplying gives", `${f2}\\times${numberText(initial1)}=${f1}(${numberText(initial2)}+x)`),
          mathStep("step-4", "SIMPLIFICATION", "Solving for x gives", `x=${answer}`),
          conclusion(answer, `So, ${answer} litres of ${liquid2} should be added`),
        ];
      }

      case "track repeated replacement": {
        const volume = n(evidence, "initialVolume");
        const removed1 = n(evidence, "removedVolume1");
        const removed2 = n(evidence, "removedVolume2");
        const liquidA = s(evidence, "liquidA", "original liquid");
        const liquidB = s(evidence, "liquidB", "added liquid");
        const finalA = Number(d(evidence, "finalLiquidA"));
        const finalB = Number(d(evidence, "finalLiquidB"));
        return [
          mathStep("step-1", "GOAL", `After the first replacement, ${liquidA} remaining is`, `${volume}-${removed1}=${volume - removed1}`),
          mathStep("step-2", "FORMULA", `During the second replacement, the fraction of ${liquidA} retained is`, `1-\\frac{${removed2}}{${volume}}=\\frac{${volume - removed2}}{${volume}}`),
          mathStep("step-3", "SUBSTITUTION", `Final ${liquidA} quantity is`, `(${volume}-${removed1})\\times\\frac{${volume - removed2}}{${volume}}=${numberText(finalA)}`),
          mathStep("step-4", "SIMPLIFICATION", `Final ${liquidB} quantity is the remainder.`, `${volume}-${numberText(finalA)}=${numberText(finalB)}`),
          mathStep("step-5", "SIMPLIFICATION", "Form and simplify the final ratio.", `${numberText(finalA)}:${numberText(finalB)}=${answer}`),
          conclusion(answer, `So, the final ratio of ${liquidA} to ${liquidB} is`),
        ];
      }

      case "find concentration percentage": {
        const acid = n(evidence, "acidVolume");
        const water = n(evidence, "waterVolume");
        const total = acid + water;
        return [
          mathStep("step-1", "GOAL", "First find the total volume of the solution.", `${acid}+${water}=${total}`),
          mathStep("step-2", "FORMULA", "Acid percentage equals acid volume divided by total volume, multiplied by 100.", `\\text{acid percentage}=\\frac{${acid}}{${total}}\\times100`),
          mathStep("step-3", "SUBSTITUTION", "Evaluating the fraction gives", `\\frac{${acid}}{${total}}\\times100=${answer}`),
          conclusion(answer, "So, the percentage of acid is"),
        ];
      }

      default:
        return [
          mathStep("step-1", "GOAL", `Start by using the relation for ${this.title.toLowerCase()}.`, setup),
          mathStep("step-2", "FORMULA", "Substitute the values given in the question.", setup),
          mathStep("step-3", "SUBSTITUTION", "The calculation gives", calculation),
          conclusion(answer),
        ];
    }
  }
}
