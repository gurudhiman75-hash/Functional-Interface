import fs from "fs";
import path from "path";

const pct001Tasks = [
  "percentOf", "percentToFraction", "valueAsPercent", "directRelation", "moreToLess", "lessToMore",
  "ratioFromPercentEquality", "reversePercent", "increaseNewValue", "decreaseNewValue", "reverseIncrease",
  "reverseDecrease", "increaseByAmount", "percentOfKnownNumber", "differenceOfPercents", "restoreAfterDecrease",
  "successiveIncrease", "successiveChange", "compoundGrowth", "compoundDecay", "areaChange", "squareAreaChange",
  "invarianceDecrease", "invarianceIncrease", "restoreAfterIncrease", "revenueChange", "circleAreaDecrease",
  "incomePartition", "successiveExpense", "winnerVotes", "cancelledVotes", "passMarks", "partToTotal",
  "complementOfTotal", "moreMarksBase", "twoShareRemainder", "loserVotes", "dilutionAddWater", "dryFromFresh",
  "addSolute", "dilutedPercent", "freshFromDry", "addPureComponent", "evaporationOriginal", "alloyComplement"
];

const pct002Tasks = [
  "inclusionExclusion", "fractionalError", "wrongMultiplier", "wrongDivisor", "tieredCommission", "tieredTax",
  "piecewiseRate", "weightedSubgroup", "hierarchicalPopulation", "branchAggregation", "repeatedReplacement",
  "iterativeDilution", "tripleInclusionExclusion", "multiTierPiecewiseRate", "reversePiecewiseRate",
  "variableReplacement", "electionMargin", "multiStageAttrition", "shiftedBaseChain"
];

const rap001Code = fs.readFileSync("artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/types.ts", "utf8");
const rap001Match = rap001Code.match(/export type Rap001TaskKind =([\s\S]*?);/);
const rap001Tasks = rap001Match[1].split('|').map(s => s.replace(/"/g, "").trim()).filter(Boolean);

function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function scaffold(pkg, tasks) {
  const dir = `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/${pkg.includes('PCT') ? 'Percentage' : 'RatioAndProportion'}/${pkg}/renderers`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const imports = [];
  const cases = [];

  for (const t of tasks) {
    const className = toPascalCase(t) + "Renderer";
    const evidenceName = toPascalCase(t) + "Evidence";
    const filename = toKebabCase(t) + "-renderer.ts";
    const p = path.join(dir, filename);

    imports.push(`import { ${className} } from "./renderers/${toKebabCase(t)}-renderer";`);
    cases.push(`    case "${t}":\n      renderer = new ${className}(solver.mathJax);\n      break;`);

    if (!fs.existsSync(p)) {
      const code = `import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface ${evidenceName} extends ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
  entities: Record<string, string>;
}

export class ${className} implements ExplanationRenderer {
  private solverMathJax: Record<string, string>;

  constructor(solverMathJax: Record<string, string>) {
    this.solverMathJax = solverMathJax;
  }

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as ${evidenceName};
    const answer = e.answer;
    const setup = this.solverMathJax.setupLatex?.replace(/.*?:/, "")?.trim() || "\\\\text{Formula setup}";
    const calc = this.solverMathJax.calculationLatex?.replace(/.*?:/, "")?.trim() || \`\${answer}\`;
    
    const variantIndex = (Number(Object.values(e.variables)[0] || 0)) % 3;

    if (variantIndex === 0) {
      return [
        { stepId: "step-1", type: "GOAL", narrative: \`We need to calculate the target value for this problem.\` },
        { stepId: "step-2", type: "FORMULA", narrative: \`Using the appropriate formula:\`, mathLatex: setup.replace(/^\\$+|\\$+$/g, "") },
        { stepId: "step-3", type: "SUBSTITUTION", narrative: \`Substitute the values:\`, mathLatex: calc.replace(/^\\$+|\\$+$/g, "") },
        { stepId: "step-4", type: "SIMPLIFICATION", narrative: \`Simplify the expression to get the result.\` },
        { stepId: "step-5", type: "CONCLUSION", narrative: \`Thus, the answer is \${answer}.\` },
      ];
    } else if (variantIndex === 1) {
       return [
        { stepId: "step-1", type: "GOAL", narrative: \`Let's determine the final amount for the scenario.\` },
        { stepId: "step-2", type: "FORMULA", narrative: \`The mathematical relationship is:\`, mathLatex: setup.replace(/^\\$+|\\$+$/g, "") },
        { stepId: "step-3", type: "SUBSTITUTION", narrative: \`Inserting the given numbers:\`, mathLatex: calc.replace(/^\\$+|\\$+$/g, "") },
        { stepId: "step-4", type: "SIMPLIFICATION", narrative: \`Solving it yields the final answer.\` },
        { stepId: "step-5", type: "CONCLUSION", narrative: \`The computed result is \${answer}.\` },
      ];
    } else {
       return [
        { stepId: "step-1", type: "GOAL", narrative: \`Our objective is to find the required quantity.\` },
        { stepId: "step-2", type: "FORMULA", narrative: \`We apply the standard rule:\`, mathLatex: setup.replace(/^\\$+|\\$+$/g, "") },
        { stepId: "step-3", type: "SUBSTITUTION", narrative: \`Plugging in the parameters:\`, mathLatex: calc.replace(/^\\$+|\\$+$/g, "") },
        { stepId: "step-4", type: "SIMPLIFICATION", narrative: \`Calculating the final value.\` },
        { stepId: "step-5", type: "CONCLUSION", narrative: \`Therefore, we get \${answer}.\` },
      ];
    }
  }
}
`;
      fs.writeFileSync(p, code, "utf8");
    }
  }
  
  fs.writeFileSync(`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/${pkg.includes('PCT') ? 'Percentage' : 'RatioAndProportion'}/${pkg}/_router_snippet.txt`, imports.join("\n") + "\n\n" + cases.join("\n"), "utf8");
}

scaffold("PCT-001", pct001Tasks);
scaffold("PCT-002", pct002Tasks);
scaffold("RAP-001", rap001Tasks);
