import assert from "node:assert/strict";

import {
  ARG_CP013_AUTHORITY,
  ARG_CP013_CHECKPOINT_ID,
  ARG_CP013_QUESTION_STUDIO_AUTHORITY,
  ARG_CP013_QUESTION_STUDIO_PACKAGE,
  ARG_CP013_REVIEW_STATUS,
  ARG_CP013_RUNTIME_MODE,
  generateArgCp013QuestionStudioBatch,
  isArgCp013CurrentReviewRequest,
  isArgCp013RealPaperRequest,
} from "./cp013-final-editorial-surface.ts";
import { ARG_CP012_CHECKPOINT_ID } from "./cp012-editorial-real-paper-remediation.ts";
import { ARG_CP012_QUESTION_STUDIO_AUTHORITY } from "./cp012-question-studio-adapter.ts";

assert.equal(ARG_CP013_CHECKPOINT_ID, "ARG-CP-013");
assert.equal(ARG_CP013_AUTHORITY, "ARG_CP013_FINAL_EDITORIAL_SURFACE_V1");
assert.equal(ARG_CP013_QUESTION_STUDIO_AUTHORITY, "ARG_CP013_QUESTION_STUDIO_FINAL_EDITORIAL_V1");
assert.equal(ARG_CP013_RUNTIME_MODE, "REVIEW_ONLY_CP009_CORE_CP012_REAL_PAPER_CP013_SURFACE");
assert.equal(ARG_CP013_REVIEW_STATUS, "QUESTION_STUDIO_CP013_FINAL_EDITORIAL_REVIEW_CONNECTED");
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.sourceRealPaperCheckpointId, ARG_CP012_CHECKPOINT_ID);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.sourceQuestionStudioAuthority, ARG_CP012_QUESTION_STUDIO_AUTHORITY);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);
assert.equal(ARG_CP013_QUESTION_STUDIO_PACKAGE.learnerRelease, "LOCKED");
assert.equal(isArgCp013CurrentReviewRequest({ packageId: "ARG-001" }), true);
assert.equal(isArgCp013CurrentReviewRequest({ cpId: "ARG-CP-013" }), true);
assert.equal(isArgCp013RealPaperRequest({ cpId: "ARG-CP-013" }), true);
assert.equal(isArgCp013CurrentReviewRequest({ packageId: "NUM-001" }), false);

type ReviewQuestion = Readonly<Record<string, any>>;

function assertLocked(question: ReviewQuestion): void {
  assert.equal(question.checkpointId, ARG_CP013_CHECKPOINT_ID);
  assert.equal(question.currentQuestionStudioAuthority, ARG_CP013_QUESTION_STUDIO_AUTHORITY);
  assert.equal(question.runtimeMode, ARG_CP013_RUNTIME_MODE);
  assert.equal(question.reviewStatus, ARG_CP013_REVIEW_STATUS);
  assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
  assert.equal(question.manualApprovalRequired, true);
  assert.equal(question.persistenceAllowed, false);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.learnerRelease, "LOCKED");
}

// Core workshop arguments must stay correlated with the workshop topic.
for (const language of ["en", "hi", "pa"] as const) {
  const result = generateArgCp013QuestionStudioBatch({
    qlId: "ARG-QL-004",
    language,
    difficulty: "Medium",
    seed: `CP013-CORE-WORKSHOP-${language}`,
    count: 50,
  });
  const target = result.questions.filter((question) => (question as ReviewQuestion).templateId === "ARG-CP003-QL004-T04");
  assert.ok(target.length > 0, `${language}: expected QL004 T04 in 50-question core sample`);
  for (const raw of target) {
    const question = raw as ReviewQuestion;
    const surface = `${question.statement}\n${question.arguments.join("\n")}`;
    assertLocked(question);
    if (language === "en") {
      assert.doesNotMatch(surface, /career planning[^\n]*\n(?:Yes|No)\.[^\n]*online fraud|online fraud[^\n]*\n(?:Yes|No)\.[^\n]*career planning/i);
      assert.match(question.arguments[0], /single workshop on the subject/i);
      assert.match(question.arguments[1], /other guidance and support/i);
    } else if (language === "hi") {
      assert.match(question.arguments[0], /इस विषय/);
      assert.match(question.arguments[1], /मार्गदर्शन और सहायता/);
    } else {
      assert.match(question.arguments[0], /ਇਸ ਵਿਸ਼ੇ/);
      assert.match(question.arguments[1], /ਰਹਿਨੁਮਾਈ ਅਤੇ ਸਹਾਇਤਾ/);
    }
  }
}

// Punjabi normalized-score core surface must use natural exam wording and relevant privacy logic.
{
  const result = generateArgCp013QuestionStudioBatch({
    qlId: "ARG-QL-005",
    language: "pa",
    difficulty: "Hard",
    seed: "CP013-PA-NORMALIZED-SCORE",
    count: 50,
  });
  const targets = result.questions.filter((question) => String((question as ReviewQuestion).statement).includes("ਨਾਰਮਲਾਈਜ਼ਡ ਸਕੋਰ"));
  assert.ok(targets.length > 0, "expected Punjabi normalized-score core scenarios");
  for (const raw of targets) {
    const question = raw as ReviewQuestion;
    const surface = `${question.statement}\n${question.arguments.join("\n")}\n${question.explanation}`;
    assertLocked(question);
    assert.match(question.statement, /ਮੁਲਾਂਕਣ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ/);
    assert.doesNotMatch(surface, /ਮੁਲਾਂਕਣ ਬੰਦ ਹੋਣ ਤੋਂ ਬਾਅਦ/);
    assert.doesNotMatch(surface, /ਨਿੱਜੀ ਸੰਪਰਕ ਵੇਰਵੇ/);
    const strongArgument = question.arguments.find((argument: string, index: number) => question.argumentStrengths[index] === "STRONG");
    assert.match(strongArgument ?? "", /ਹੋਰ ਉਮੀਦਵਾਰਾਂ ਦੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ/);
  }
}

const REAL_CASES = [
  ["ARG-QL-003", /access cost|पहुँच संबंधी कठिनाई|ਪਹੁੰਚ ਦੀ ਮੁਸ਼ਕਲ/u, /Introducing scheduled time slots|निर्धारित समय-स्लॉट|ਨਿਰਧਾਰਤ ਸਮਾਂ-ਸਲਾਟ/u],
  ["ARG-QL-004", /operational cost|संचालन संबंधी लागत|ਕਾਰਜਕਾਰੀ ਲਾਗਤ/u, /peak-hour restriction|व्यस्त समय का प्रतिबंध|ਭੀੜ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ/u],
  ["ARG-QL-005", /advance notice|पहले से सूचना|ਪਹਿਲਾਂ ਸੂਚਨਾ/u, /suspected misconduct|संदिग्ध कदाचार|ਸ਼ੱਕੀ ਗਲਤ ਵਿਹਾਰ/u],
] as const;

// Strong No arguments must oppose the proposal directly, not merely append a caveat.
for (const language of ["en", "hi", "pa"] as const) {
  for (const [qlId, reasonPattern, argumentPattern] of REAL_CASES) {
    const result = generateArgCp013QuestionStudioBatch({
      cpId: "ARG-CP-013",
      qlId,
      language,
      difficulty: "Hard",
      examProfile: "BANKING_COMBO_4X5",
      seed: `CP013-REAL-${qlId}-${language}`,
      count: 24,
    });
    for (const raw of result.questions) {
      const question = raw as ReviewQuestion;
      assertLocked(question);
      const strongNo = question.arguments.find((argument: string, index: number) =>
        question.argumentStrengths[index] === "STRONG" && /^(No\.|नहीं।|ਨਹੀਂ।)/u.test(argument),
      );
      if (strongNo) {
        assert.match(strongNo, argumentPattern, `${language}/${qlId}: strong No remains off-target`);
        assert.match(question.explanation, reasonPattern, `${language}/${qlId}: explanation not aligned to repaired argument`);
        if (qlId === "ARG-QL-004") {
          assert.doesNotMatch(strongNo, /unless clear exemptions|यदि नियम में स्पष्ट अपवाद|ਜੇ ਨਿਯਮ ਵਿੱਚ ਸਪੱਸ਼ਟ ਛੋਟ/u);
        }
      }
    }
  }
}

// QL004 must not present two near-identical catastrophic weak arguments in one 4-argument item.
for (const language of ["en", "hi", "pa"] as const) {
  const result = generateArgCp013QuestionStudioBatch({
    cpId: "ARG-CP-013",
    qlId: "ARG-QL-004",
    language,
    difficulty: "Hard",
    examProfile: "BANKING_COMBO_4X5",
    seed: `CP013-QL004-DIVERSITY-${language}`,
    count: 50,
  });
  for (const raw of result.questions) {
    const question = raw as ReviewQuestion;
    assertLocked(question);
    const catastrophicWeak = question.arguments.filter((argument: string, index: number) =>
      question.argumentStrengths[index] === "WEAK"
      && /permanent|permanently|inevitably|स्थायी|हमेशा|ਪੱਕੇ|ਹਮੇਸ਼ਾਂ/u.test(argument),
    );
    assert.ok(catastrophicWeak.length <= 1, `${language}: duplicate catastrophic QL004 weak arguments remain`);
  }
}

// QL006 due-process arguments must be domain-neutral and distinct from interim-risk mitigation.
for (const language of ["en", "hi", "pa"] as const) {
  const result = generateArgCp013QuestionStudioBatch({
    cpId: "ARG-CP-013",
    qlId: "ARG-QL-006",
    language,
    difficulty: "Hard",
    examProfile: "BANKING_COMBO_4X5",
    seed: `CP013-QL006-DUE-PROCESS-${language}`,
    count: 50,
  });
  for (const raw of result.questions) {
    const question = raw as ReviewQuestion;
    const surface = `${question.statement}\n${question.arguments.join("\n")}\n${question.explanation}`;
    assertLocked(question);
    assert.doesNotMatch(surface, /protect users before an irreversible penalty/i);
    assert.doesNotMatch(surface, /A mistaken one /);
    const fairProcess = question.arguments.find((argument: string) => /fair opportunity to respond|अपना पक्ष रखने का उचित अवसर|ਆਪਣਾ ਪੱਖ ਰੱਖਣ ਦਾ ਵਾਜਬ ਮੌਕਾ/u.test(argument));
    if (fairProcess) {
      assert.match(question.explanation, /direct due-process reason|उचित-प्रक्रिया कारण|ਵਾਜਬ-ਪ੍ਰਕਿਰਿਆ ਕਾਰਨ/u);
    }
  }
}

// Grievance-contact strong No must be an accuracy-based counterargument to stale contact details.
for (const language of ["en", "hi", "pa"] as const) {
  const result = generateArgCp013QuestionStudioBatch({
    cpId: "ARG-CP-013",
    qlId: "ARG-QL-001",
    language,
    difficulty: "Medium",
    examProfile: "SSC_RECENT_2X4",
    seed: `CP013-GRIEVANCE-${language}`,
    count: 40,
  });
  const grievance = result.questions.filter((question) => String((question as ReviewQuestion).scenarioId).includes("GRIEVANCE_CONTACT"));
  assert.ok(grievance.length > 0, `${language}: expected grievance-contact scenarios`);
  for (const raw of grievance) {
    const question = raw as ReviewQuestion;
    assertLocked(question);
    const strongNo = question.arguments.find((argument: string, index: number) =>
      question.argumentStrengths[index] === "STRONG" && /^(No\.|नहीं।|ਨਹੀਂ।)/u.test(argument),
    );
    if (strongNo) {
      if (language === "en") assert.match(strongNo, /keep the grievance contact current|misdirect users/i);
      if (language === "hi") assert.match(strongNo, /शिकायत संपर्क को अद्यतन|गलत संपर्क/);
      if (language === "pa") assert.match(strongNo, /ਸ਼ਿਕਾਇਤ ਸੰਪਰਕ ਨੂੰ ਅੱਪਡੇਟ|ਗਲਤ ਸੰਪਰਕ/);
    }
  }
}

// Multi-argument labels must use comma + final conjunction, not chained conjunctions.
for (const language of ["en", "hi", "pa"] as const) {
  const result = generateArgCp013QuestionStudioBatch({
    cpId: "ARG-CP-013",
    language,
    difficulty: "Hard",
    examProfile: "BANKING_COMBO_4X5",
    seed: `CP013-OPTIONS-${language}`,
    count: 50,
  });
  for (const raw of result.questions) {
    const question = raw as ReviewQuestion;
    assertLocked(question);
    for (const option of question.options as readonly string[]) {
      assert.doesNotMatch(option, /I and II and III|I and III and IV|II and III and IV/);
      assert.doesNotMatch(option, /I और II और III|I और III और IV|II और III और IV/);
      assert.doesNotMatch(option, /I ਅਤੇ II ਅਤੇ III|I ਅਤੇ III ਅਤੇ IV|II ਅਤੇ III ਅਤੇ IV/);
    }
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.equal(question.canonicalAnswer, question.options[question.correctIndex]);
  }
}

// Language-wide grammar regressions from the runtime review packet must remain closed.
for (const language of ["en", "hi", "pa"] as const) {
  const result = generateArgCp013QuestionStudioBatch({
    cpId: "ARG-CP-013",
    language,
    difficulty: "Hard",
    examProfile: "BANKING_COMBO_4X5",
    seed: `CP013-GRAMMAR-${language}`,
    count: 50,
  });
  for (const raw of result.questions) {
    const question = raw as ReviewQuestion;
    const surface = `${question.statement}\n${question.arguments.join("\n")}\n${question.explanation}`;
    assertLocked(question);
    if (language === "en") {
      assert.doesNotMatch(surface, /A mistaken one /);
      assert.doesNotMatch(surface, /(?:Yes|No)\. [a-z]/);
    } else if (language === "hi") {
      assert.doesNotMatch(surface, /वेबकैम गतिविधि निगरानी/);
      assert.doesNotMatch(surface, /जो कर्मचारी .* के बारे में पूछे, उसके पास/u);
    } else {
      assert.doesNotMatch(surface, /ਭਰਤੀ ਉਮੀਦਵਾਰਾਂ ਜੋ/);
      assert.doesNotMatch(surface, /ਹੋਰ ਉਮੀਦਵਾਰਾਂ ਦਾ ਨਿੱਜੀ ਡਾਟਾ ਦੀ ਚਿੰਤਾ/);
      assert.doesNotMatch(surface, /ਵੈਬਕੈਮ ਸਰਗਰਮੀ ਨਿਗਰਾਨੀ/);
      assert.doesNotMatch(surface, /ਜੋ ਕਰਮਚਾਰੀ .* ਬਾਰੇ ਪੁੱਛੇ, ਉਸ ਕੋਲ/u);
    }
  }
}

const replayInput = {
  cpId: "ARG-CP-013",
  qlId: "ARG-QL-005",
  language: "hi",
  difficulty: "Hard",
  examProfile: "BANKING_COMBO_4X5",
  seed: "CP013-DETERMINISTIC-REPLAY",
  count: 16,
} as const;
assert.deepEqual(generateArgCp013QuestionStudioBatch(replayInput), generateArgCp013QuestionStudioBatch(replayInput));

console.log("ARG-001 CP013 final editorial surface: PASS (correlation, polarity, diversity, grammar, option labels and learner locks)");
