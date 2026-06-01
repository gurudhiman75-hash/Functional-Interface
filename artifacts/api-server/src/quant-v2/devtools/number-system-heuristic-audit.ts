import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

interface AuditQuestion {
  index: number;
  id: string;
  text: string;
  textHi: string;
  textPa: string;
  options: string[];
  correct: number;
  correctLetter: string;
  correctValue: string;
  explanation: string;
  explanationHi: string;
  explanationPa: string;
  family: string;
  topology: string;
  problem: any;
}

interface AuditData {
  production: AuditQuestion[];
  review: AuditQuestion[];
  pyqPlus: AuditQuestion[];
}

function analyzeQuestions(questions: AuditQuestion[], type: string) {
  const flaggedRealism: Array<{ q: AuditQuestion; reason: string }> = [];
  const flaggedExplanation: Array<{ q: AuditQuestion; reason: string }> = [];
  const flaggedDistractors: Array<{ q: AuditQuestion; reason: string }> = [];
  const flaggedShortcuts: Array<{ q: AuditQuestion; reason: string }> = [];

  for (const q of questions) {
    const text = q.text || "";
    const expl = q.explanation || "";
    const opt = q.options || [];
    const correctVal = Number(q.correctValue);
    
    // --- 1. Realism & Human Wording Checks ---
    let realismReasons: string[] = [];
    if (/\b(?:from|with|for|by|and|then)\s*$/iu.test(text.trim())) {
      realismReasons.push("Broken or hanging sentence ending");
    }
    if (/\b(?:seven|five|nine|eight|six|four|three|two|ten) digit\b/iu.test(text) && !/\b\d+-digit\b/iu.test(text)) {
      realismReasons.push("Spelled-out digit counts (e.g. 'seven digit') instead of standard '7-digit'");
    }
    if (/the ratio of HCF and LCM of/iu.test(text) || /HCF and LCM are in the ratio/iu.test(text)) {
      realismReasons.push("Unnatural exam scenario (HCF and LCM ratio is rarely asked this way in SSC)");
    }
    if (/\b(\d+)\^(\d+)\b/iu.test(text)) {
      realismReasons.push("Raw caret notation (^) used in stem instead of clean superscript or LaTeX");
    }
    if (/find the last two digits of the sum/iu.test(text) && /factorial/iu.test(text)) {
      realismReasons.push("Extremely high difficulty school drill (tests pure memory of factorial values rather than reasoning)");
    }
    if (q.family === "ns_prime_composite_deduction" && /composite number/iu.test(text) && /prime number/iu.test(text)) {
      realismReasons.push("Heavy academic jargon that feels synthetically generated");
    }
    
    if (realismReasons.length > 0) {
      flaggedRealism.push({ q, reason: realismReasons.join("; ") });
    }

    // --- 2. Explanation & MathJax Checks ---
    let explReasons: string[] = [];
    if (/\\[\(\)\[\]]/g.test(expl)) {
      explReasons.push("Contains raw unrendered MathJax boundary wrappers \\( or \\)");
    }
    if (expl.includes("Substitute the values") || expl.includes("Use the formula") || expl.includes("Solve for the answer")) {
      explReasons.push("Generic, non-pedagogical algebraic solver step");
    }
    if (!expl.includes(q.correctValue)) {
      explReasons.push("Final numerical answer is not explicitly written or mismatch in explanation text");
    }
    if (expl.includes("*") || (expl.includes("/") && !expl.includes("\\frac") && !expl.includes("divided by"))) {
      explReasons.push("Unprocessed math operators (asterisks '*' or slashes '/') instead of standard LaTeX");
    }
    if (q.explanationHi && q.explanationHi.includes("[object Object]")) {
      explReasons.push("Leaked Javascript [object Object] in Hindi translation");
    }
    if (q.explanationPa && q.explanationPa.includes("[object Object]")) {
      explReasons.push("Leaked Javascript [object Object] in Punjabi translation");
    }
    
    if (explReasons.length > 0) {
      flaggedExplanation.push({ q, reason: explReasons.join("; ") });
    }

    // --- 3. Distractor Realism & Logical Parity Checks ---
    let distReasons: string[] = [];
    if (opt.length !== 4) {
      distReasons.push(`Incorrect option count: ${opt.length}`);
    } else {
      const numericOpts = opt.map(Number).filter(Number.isFinite);
      if (q.problem?.answerUnit === "digit") {
        const outOfBounds = numericOpts.filter(n => n < 0 || n > 9 || !Number.isInteger(n));
        if (outOfBounds.length > 0) {
          distReasons.push(`Invalid digit options found (out of 0-9 range or decimals): ${outOfBounds.join(", ")}`);
        }
      }
      if (/remainder/iu.test(text) && q.problem?.variables?.divisor) {
        const divisor = Number(q.problem.variables.divisor);
        if (Number.isFinite(divisor)) {
          const invalidRemainders = numericOpts.filter(n => n >= divisor || n < 0);
          if (invalidRemainders.length > 0) {
            distReasons.push(`Remainders >= divisor (${divisor}) or negative options found: ${invalidRemainders.join(", ")}`);
          }
        }
      }
      // Check for zero or negative values in absolute count questions
      if (/find the number of/iu.test(text) || /how many/iu.test(text)) {
        const nonPositive = numericOpts.filter(n => n <= 0);
        if (nonPositive.length > 0) {
          distReasons.push(`Zero or negative options for a count question: ${nonPositive.join(", ")}`);
        }
      }
      // Check if distractors are too easy to eliminate (e.g. three odd numbers and target is even, or vice versa, or obvious parity gaps)
      if (numericOpts.length === 4) {
        const evens = numericOpts.filter(n => n % 2 === 0).length;
        const odds = numericOpts.filter(n => n % 2 !== 0).length;
        if (evens === 1 && Number(q.correctValue) % 2 === 0) {
          distReasons.push("Sole even option is the correct answer (easily eliminated by parity)");
        }
        if (odds === 1 && Number(q.correctValue) % 2 !== 0) {
          distReasons.push("Sole odd option is the correct answer (easily eliminated by parity)");
        }
      }
    }
    
    if (distReasons.length > 0) {
      flaggedDistractors.push({ q, reason: distReasons.join("; ") });
    }

    // --- 4. Shortcut Verification Checks ---
    let shortReasons: string[] = [];
    const shortcut = q.problem?.shortcutExplanation?.en || "";
    if (!shortcut) {
      shortReasons.push("Shortcut explanation is completely empty or missing");
    } else {
      if (shortcut.length < 50) {
        shortReasons.push("Shortcut is extremely brief and likely uninformative");
      }
      if (shortcut.toLowerCase().includes("apply the formula") || shortcut.toLowerCase().includes("substitute the values")) {
        shortReasons.push("Shortcut is a generic rephrasing of the main method");
      }
      if (shortcut.toLowerCase().includes("directly solve") || shortcut.toLowerCase().includes("step-by-step")) {
        shortReasons.push("Shortcut doesn't offer a genuine time-saving bypass (just standard solving)");
      }
      // Check if shortcut refers to checking divisibility rules or digit tricks where not applicable
      if (/divisibility/iu.test(shortcut) && !/divisibility/iu.test(text) && !q.family.includes("divisibility")) {
        shortReasons.push("Irrelevant shortcut mentioning divisibility on a non-divisibility question");
      }
    }
    
    if (shortReasons.length > 0) {
      flaggedShortcuts.push({ q, reason: shortReasons.join("; ") });
    }
  }

  return {
    type,
    total: questions.length,
    realism: flaggedRealism,
    explanation: flaggedExplanation,
    distractors: flaggedDistractors,
    shortcuts: flaggedShortcuts,
  };
}

async function main() {
  const inPath = path.join(process.cwd(), "exports", "sampled-audit-questions.json");
  const rawData = await readFile(inPath, "utf8");
  const data: AuditData = JSON.parse(rawData);

  const prodResult = analyzeQuestions(data.production, "Production");
  const revResult = analyzeQuestions(data.review, "Review");
  const pyqResult = analyzeQuestions(data.pyqPlus, "PYQ+");

  const report = {
    production: {
      total: prodResult.total,
      realismFlagsCount: prodResult.realism.length,
      explanationFlagsCount: prodResult.explanation.length,
      distractorFlagsCount: prodResult.distractors.length,
      shortcutFlagsCount: prodResult.shortcuts.length,
      realism: prodResult.realism.map(f => ({ index: f.q.index, family: f.q.family, text: f.q.text, reason: f.reason })),
      explanation: prodResult.explanation.map(f => ({ index: f.q.index, family: f.q.family, text: f.q.text, reason: f.reason, expl: f.q.explanation })),
      distractors: prodResult.distractors.map(f => ({ index: f.q.index, family: f.q.family, text: f.q.text, options: f.q.options, correct: f.q.correctValue, reason: f.reason })),
      shortcuts: prodResult.shortcuts.map(f => ({ index: f.q.index, family: f.q.family, text: f.q.text, reason: f.reason, shortcut: f.q.problem?.shortcutExplanation?.en }))
    },
    review: {
      total: revResult.total,
      realismFlagsCount: revResult.realism.length,
      explanationFlagsCount: revResult.explanation.length,
      distractorFlagsCount: revResult.distractors.length,
      shortcutFlagsCount: revResult.shortcuts.length,
      realism: revResult.realism.map(f => ({ index: f.q.index, family: f.q.family, text: f.q.text, reason: f.reason })),
      explanation: revResult.explanation.map(f => ({ index: f.q.index, family: f.q.family, text: f.q.text, reason: f.reason, expl: f.q.explanation })),
      distractors: revResult.distractors.map(f => ({ index: f.q.index, family: f.q.family, text: f.q.text, options: f.q.options, correct: f.q.correctValue, reason: f.reason })),
      shortcuts: revResult.shortcuts.map(f => ({ index: f.q.index, family: f.q.family, text: f.q.text, reason: f.reason, shortcut: f.q.problem?.shortcutExplanation?.en }))
    },
    pyqPlus: {
      total: pyqResult.total,
      realismFlagsCount: pyqResult.realism.length,
      explanationFlagsCount: pyqResult.explanation.length,
      distractorFlagsCount: pyqResult.distractors.length,
      shortcutFlagsCount: pyqResult.shortcuts.length,
      realism: pyqResult.realism.map(f => ({ index: f.q.index, family: f.q.family, text: f.q.text, reason: f.reason })),
      explanation: pyqResult.explanation.map(f => ({ index: f.q.index, family: f.q.family, text: f.q.text, reason: f.reason, expl: f.q.explanation })),
      distractors: pyqResult.distractors.map(f => ({ index: f.q.index, family: f.q.family, text: f.q.text, options: f.q.options, correct: f.q.correctValue, reason: f.reason })),
      shortcuts: pyqResult.shortcuts.map(f => ({ index: f.q.index, family: f.q.family, text: f.q.text, reason: f.reason, shortcut: f.q.problem?.shortcutExplanation?.en }))
    }
  };

  const outPath = path.join(process.cwd(), "exports", "audit-heuristic-results.json");
  await writeFile(outPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`Heuristic audit complete. Results exported to: ${outPath}`);
  
  // Summary Stats
  console.log("\n--- Heuristic Audit Summary Statistics ---");
  console.log(`Production - Realism Flags: ${prodResult.realism.length}, Expl Flags: ${prodResult.explanation.length}, Distractor Flags: ${prodResult.distractors.length}, Shortcut Flags: ${prodResult.shortcuts.length}`);
  console.log(`Review     - Realism Flags: ${revResult.realism.length}, Expl Flags: ${revResult.explanation.length}, Distractor Flags: ${revResult.distractors.length}, Shortcut Flags: ${revResult.shortcuts.length}`);
  console.log(`PYQ+       - Realism Flags: ${pyqResult.realism.length}, Expl Flags: ${pyqResult.explanation.length}, Distractor Flags: ${pyqResult.distractors.length}, Shortcut Flags: ${pyqResult.shortcuts.length}`);
}

main().catch(err => {
  console.error("Heuristic audit execution failed:", err);
  process.exitCode = 1;
});
