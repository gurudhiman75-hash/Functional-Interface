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

async function main() {
  const inPath = path.join(process.cwd(), "exports", "sampled-audit-questions.json");
  const rawData = await readFile(inPath, "utf8");
  const data: AuditData = JSON.parse(rawData);

  const allQuestions = [...data.production, ...data.review, ...data.pyqPlus];
  
  console.log(`Loaded ${allQuestions.length} total questions from all three sets.`);

  const realismFailures: any[] = [];
  const explanationFailures: any[] = [];
  const distractorFailures: any[] = [];
  const shortcutFailures: any[] = [];

  for (const q of allQuestions) {
    const text = q.text || "";
    const expl = q.explanation || "";
    const options = q.options || [];
    const family = q.family || "";

    // 1. Realism Failures Screening
    let isRealism = false;
    let realismReason = "";

    if (text.includes("but not chosen by inspection")) {
      isRealism = true;
      realismReason = "Uses the robotic/meaningless phrase 'but not chosen by inspection' which never appears in real exams.";
    } else if (text.includes("what divisor value is asked") || text.includes("what is the required divisor result")) {
      isRealism = true;
      realismReason = "Extremely vague phrasing ('what divisor value is asked?') that fails to specify what is actually being calculated.";
    } else if (text.includes("ending digits does it have") && !text.includes("last two") && !text.includes("last three") && !text.includes("unit digit")) {
      isRealism = true;
      realismReason = "Vague stem: asks 'which ending digits does it have' without specifying whether it wants unit, last 2, or last 3 digits.";
    } else if (text.includes("too large to expand. Which ending digits")) {
      isRealism = true;
      realismReason = "Artificial commentary ('too large to expand') which is redundant and never used in professional exam papers.";
    } else if (text.includes("Using prime powers of") && (text.includes("divisor result") || text.includes("divisor value"))) {
      isRealism = true;
      realismReason = "Robotic phrasing: 'Using prime powers of X, what is the required divisor result?' instead of standard exam phrasing.";
    } else if (text.includes("using place value directly") || text.includes("Using the power cycle")) {
      isRealism = true;
      realismReason = "Stem contains instructional/solving hints ('Using the power cycle...') which standard competitive exams never provide.";
    } else if (/Tens digit \d+, digit sum \d+/i.test(text) || /digit sum \d+ and tens digit \d+/i.test(text) || /tens digit \d+ and ones digit \d+/i.test(text)) {
      isRealism = true;
      realismReason = "Childish primary-school level hand-holding question. Inappropriate for competitive graduate/matric level exams like SSC CGL.";
    } else if (text.includes("Find the number of positive divisors?")) {
      isRealism = true;
      realismReason = "Hanging question mark on statement-based question structure.";
    }

    if (isRealism) {
      realismFailures.push({ q, reason: realismReason });
    }

    // 2. Explanation Failures Screening
    let isExpl = false;
    let explReason = "";

    if (expl.includes("\\left\\lfloor\\frac{50}{3}\\right\\rfloor") && family === "ns_trailing_zeroes") {
      isExpl = true;
      explReason = "Critical mathematical bug: Divides by 3 and 9 in LaTeX steps instead of 5 and 25 to count trailing zeroes of 50!.";
    } else if (expl.includes("\\left\\lfloor\\frac{60}{3}\\right\\rfloor") && family === "ns_trailing_zeroes") {
      isExpl = true;
      explReason = "Critical mathematical bug: Divides by 3 in trailing zeroes calculation.";
    } else if (expl.includes("\\left\\lfloor") && expl.includes("/3") && family === "ns_factorial_divisibility") {
      isExpl = true;
      explReason = "Critical mathematical bug: Hardcoded division-by-3 in factorial prime exponent calculation.";
    } else if (expl.includes("Use the given digit condition") || expl.includes("Use the exponent rule required") || expl.includes("Choose HCF for common division")) {
      isExpl = true;
      explReason = "Generic filler steps that tell the student to 'use the rule' or 'apply the relation' without showing the actual formula or substitution.";
    } else if (expl.includes("N=10\\times") && expl.includes("ones places.") && expl.includes("tens and ones places.")) {
      isExpl = true;
      explReason = "Generic/repetitive place value explanation for simple digit questions.";
    }

    if (isExpl) {
      explanationFailures.push({ q, reason: explReason });
    }

    // 3. Distractor Failures Screening
    let isDist = false;
    let distReason = "";

    const numericOptions = options.map(Number).filter(Number.isFinite);
    if (q.problem?.answerUnit === "digit") {
      const invalidDigits = numericOptions.filter(n => n < 0 || n > 9 || !Number.isInteger(n));
      if (invalidDigits.length > 0) {
        isDist = true;
        distReason = `Invalid digit options: Option values ${invalidDigits.join(", ")} are outside the valid single-digit range [0-9].`;
      }
    }

    if (/remainder/i.test(text) && q.problem?.variables?.divisor) {
      const divisor = Number(q.problem.variables.divisor);
      const invalidRemainders = numericOptions.filter(n => n >= divisor || n < 0);
      if (invalidRemainders.length > 0) {
        isDist = true;
        distReason = `Mathematically absurd distractors: Divisor is ${divisor}, but option contains invalid remainders: ${invalidRemainders.join(", ")}`;
      }
    }

    // Parity ease check
    if (numericOptions.length === 4) {
      const evens = numericOptions.filter(n => n % 2 === 0).length;
      const odds = numericOptions.filter(n => n % 2 !== 0).length;
      if (evens === 1 && Number(q.correctValue) % 2 === 0) {
        isDist = true;
        distReason = "Parity leak: The correct answer is even, and all three distractors are odd, making it trivially easy to solve by parity check.";
      } else if (odds === 1 && Number(q.correctValue) % 2 !== 0) {
        isDist = true;
        distReason = "Parity leak: The correct answer is odd, and all three distractors are even, making it trivially easy to solve by parity check.";
      }
    }

    if (isDist) {
      distractorFailures.push({ q, reason: distReason });
    }

    // 4. Shortcut Failures Screening
    let isShort = false;
    let shortReason = "";

    const shortcutText = q.problem?.shortcutExplanation?.en || "";
    if (shortcutText.includes("For two digits, use place value directly") || shortcutText.includes("use place value directly")) {
      isShort = true;
      shortReason = "Robotic, non-time-saving shortcut: Tells the student to use place value directly, which is identical to the standard solution.";
    } else if (shortcutText.includes("Once prime powers are known, use the exponent pattern directly")) {
      isShort = true;
      shortReason = "Lazy shortcut: Tells the student to use the pattern directly once prime powers are known (standard method is identical).";
    } else if (shortcutText.includes("Try the divisibility rule directly")) {
      isShort = true;
      shortReason = "Trivial shortcut: Suggests trying the divisibility rule directly (which is the standard method itself, not a shortcut).";
    } else if (shortcutText.includes("For repeat-together questions, take LCM directly")) {
      isShort = true;
      shortReason = "Redundant shortcut: Taking LCM is the standard method, not a shortcut.";
    } else if (shortcutText.includes("Never expand the power; reduce and cycle")) {
      isShort = true;
      shortReason = "Shortcut just restates standard modular cycle solving.";
    }

    if (isShort) {
      shortcutFailures.push({ q, reason: shortReason });
    }
  }

  console.log(`Found:`);
  console.log(`- Realism Failures: ${realismFailures.length}`);
  console.log(`- Explanation Failures: ${explanationFailures.length}`);
  console.log(`- Distractor Failures: ${distractorFailures.length}`);
  console.log(`- Shortcut Failures: ${shortcutFailures.length}`);

  const outputPayload = {
    realism: realismFailures.slice(0, 30).map(f => ({
      index: f.q.index,
      id: f.q.id,
      text: f.q.text,
      options: f.q.options,
      correct: f.q.correctLetter,
      correctValue: f.q.correctValue,
      explanation: f.q.explanation,
      family: f.q.family,
      reason: f.reason
    })),
    explanation: explanationFailures.slice(0, 30).map(f => ({
      index: f.q.index,
      id: f.q.id,
      text: f.q.text,
      explanation: f.q.explanation,
      family: f.q.family,
      reason: f.reason
    })),
    distractor: distractorFailures.slice(0, 30).map(f => ({
      index: f.q.index,
      id: f.q.id,
      text: f.q.text,
      options: f.q.options,
      correct: f.q.correctLetter,
      correctValue: f.q.correctValue,
      family: f.q.family,
      reason: f.reason
    })),
    shortcut: shortcutFailures.slice(0, 30).map(f => ({
      index: f.q.index,
      id: f.q.id,
      text: f.q.text,
      shortcut: f.q.problem?.shortcutExplanation?.en,
      family: f.q.family,
      reason: f.reason
    }))
  };

  await writeFile(path.join(process.cwd(), "exports", "audit-categorized-failures.json"), JSON.stringify(outputPayload, null, 2), "utf8");
  console.log("Categorized failure lists written to exports/audit-categorized-failures.json");
}

main().catch(err => {
  console.error("Failure extractor execution failed:", err);
  process.exitCode = 1;
});
