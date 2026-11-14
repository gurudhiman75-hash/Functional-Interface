import { useState } from "react";
import { UserRound } from "lucide-react";
import type { Test } from "@/lib/data";
import { LANGUAGE_LABELS, type Language } from "@/lib/lang-utils";
import "@/styles/pre-test-instructions.css";

const copy = {
  en: {
    instructions: "Instructions", view: "View in", general: "General Instructions", candidate: "Candidate", questions: "Questions", duration: "Duration", marks: "Maximum marks", minutes: "minutes", untimed: "Untimed practice",
    timing: "The timer begins only when you start the test. The test is submitted automatically when time expires.", practice: "Practice mode is untimed. You may review explanations as you practise.", fixed: "Each section has a fixed timer. When its time expires, the test advances to the next section.", flexible: "There is no separate fixed timer for each section.", locked: "Some sections are locked after you leave them. You cannot return to a locked section.", free: "Use section tabs or the question palette to navigate between sections.", scoring: "Marking scheme", correct: "Correct answer", wrong: "Incorrect answer", unanswered: "Unanswered", palette: "Question palette", statuses: ["You have not visited the question yet.", "You have visited but not answered the question.", "You have answered the question.", "You have marked the question for review.", "You have answered and marked the question for review."], navigation: "Navigating and answering questions", steps: ["Click a question number in the palette to open it.", "Select an option. Use Save & Next to move forward.", "Use Clear Response to remove your selection.", "Use Mark for Review to flag a question for later."], sections: "Section details", language: "Choose your default test language", languageNote: "You can change the question language during the test. Missing translations use the available fallback language.", accept: "I have read and understood the instructions and the marking scheme.", back: "Back", begin: "I am ready to begin", mode: "Test interface", classic: "Examtree Classic", simulation: "Examtree exam simulation",
  },
  hi: {
    instructions: "निर्देश", view: "भाषा", general: "सामान्य निर्देश", candidate: "अभ्यर्थी", questions: "प्रश्न", duration: "अवधि", marks: "अधिकतम अंक", minutes: "मिनट", untimed: "समय सीमा के बिना अभ्यास",
    timing: "परीक्षा शुरू करने पर ही टाइमर शुरू होगा। समय समाप्त होने पर परीक्षा अपने आप जमा हो जाएगी।", practice: "अभ्यास मोड में समय सीमा नहीं है। अभ्यास के दौरान व्याख्या देख सकते हैं।", fixed: "हर खंड की समय सीमा तय है। समय समाप्त होने पर अगला खंड खुल जाएगा।", flexible: "प्रत्येक खंड के लिए अलग समय सीमा नहीं है।", locked: "कुछ खंड छोड़ने के बाद बंद हो जाते हैं। बंद खंड में वापस नहीं जा सकते।", free: "खंडों के बीच जाने के लिए खंड टैब या प्रश्न पैलेट का उपयोग करें।", scoring: "अंक योजना", correct: "सही उत्तर", wrong: "गलत उत्तर", unanswered: "अनुत्तरित", palette: "प्रश्न पैलेट", statuses: ["आपने यह प्रश्न अभी नहीं देखा है।", "आपने प्रश्न देखा है, लेकिन उत्तर नहीं दिया है।", "आपने प्रश्न का उत्तर दिया है।", "आपने प्रश्न को समीक्षा के लिए चिह्नित किया है।", "आपने उत्तर दिया है और समीक्षा के लिए चिह्नित किया है।"], navigation: "प्रश्नों पर जाना और उत्तर देना", steps: ["प्रश्न खोलने के लिए पैलेट में उसकी संख्या चुनें।", "विकल्प चुनें। आगे बढ़ने के लिए Save & Next दबाएँ।", "चुना गया उत्तर हटाने के लिए Clear Response दबाएँ।", "बाद में देखने के लिए Mark for Review का उपयोग करें।"], sections: "खंड विवरण", language: "परीक्षा की प्रारंभिक भाषा चुनें", languageNote: "परीक्षा के दौरान प्रश्न की भाषा बदल सकते हैं। अनुवाद उपलब्ध न होने पर उपलब्ध भाषा दिखाई जाएगी।", accept: "मैंने निर्देश और अंक योजना पढ़ और समझ ली है।", back: "वापस", begin: "मैं शुरू करने के लिए तैयार हूँ", mode: "परीक्षा इंटरफ़ेस", classic: "Examtree Classic", simulation: "Examtree अभ्यास परीक्षा",
  },
  pa: {
    instructions: "ਹਦਾਇਤਾਂ", view: "ਭਾਸ਼ਾ", general: "ਆਮ ਹਦਾਇਤਾਂ", candidate: "ਉਮੀਦਵਾਰ", questions: "ਪ੍ਰਸ਼ਨ", duration: "ਸਮਾਂ", marks: "ਕੁੱਲ ਅੰਕ", minutes: "ਮਿੰਟ", untimed: "ਸਮੇਂ ਦੀ ਹੱਦ ਤੋਂ ਬਿਨਾਂ ਅਭਿਆਸ",
    timing: "ਟੈਸਟ ਸ਼ੁਰੂ ਕਰਨ ਵੇਲੇ ਹੀ ਟਾਈਮਰ ਸ਼ੁਰੂ ਹੋਵੇਗਾ। ਸਮਾਂ ਮੁੱਕਣ ਉੱਤੇ ਟੈਸਟ ਆਪਣੇ ਆਪ ਜਮ੍ਹਾਂ ਹੋ ਜਾਵੇਗਾ।", practice: "ਅਭਿਆਸ ਮੋਡ ਵਿੱਚ ਸਮੇਂ ਦੀ ਹੱਦ ਨਹੀਂ ਹੈ। ਅਭਿਆਸ ਦੌਰਾਨ ਵਿਆਖਿਆ ਵੇਖ ਸਕਦੇ ਹੋ।", fixed: "ਹਰੇਕ ਭਾਗ ਦਾ ਸਮਾਂ ਨਿਸ਼ਚਿਤ ਹੈ। ਸਮਾਂ ਮੁੱਕਣ ਉੱਤੇ ਅਗਲਾ ਭਾਗ ਖੁੱਲ੍ਹ ਜਾਵੇਗਾ।", flexible: "ਹਰੇਕ ਭਾਗ ਲਈ ਵੱਖਰੀ ਸਮੇਂ ਦੀ ਹੱਦ ਨਹੀਂ ਹੈ।", locked: "ਕੁਝ ਭਾਗ ਛੱਡਣ ਤੋਂ ਬਾਅਦ ਬੰਦ ਹੋ ਜਾਂਦੇ ਹਨ। ਬੰਦ ਭਾਗ ਵਿੱਚ ਵਾਪਸ ਨਹੀਂ ਜਾ ਸਕਦੇ।", free: "ਭਾਗ ਬਦਲਣ ਲਈ ਭਾਗਾਂ ਦੀਆਂ ਟੈਬਾਂ ਜਾਂ ਪ੍ਰਸ਼ਨ ਪੈਲੇਟ ਵਰਤੋ।", scoring: "ਅੰਕ ਯੋਜਨਾ", correct: "ਸਹੀ ਜਵਾਬ", wrong: "ਗ਼ਲਤ ਜਵਾਬ", unanswered: "ਬਿਨਾਂ ਜਵਾਬ", palette: "ਪ੍ਰਸ਼ਨ ਪੈਲੇਟ", statuses: ["ਤੁਸੀਂ ਇਹ ਪ੍ਰਸ਼ਨ ਅਜੇ ਨਹੀਂ ਵੇਖਿਆ।", "ਤੁਸੀਂ ਪ੍ਰਸ਼ਨ ਵੇਖਿਆ ਹੈ, ਪਰ ਜਵਾਬ ਨਹੀਂ ਦਿੱਤਾ।", "ਤੁਸੀਂ ਪ੍ਰਸ਼ਨ ਦਾ ਜਵਾਬ ਦਿੱਤਾ ਹੈ।", "ਤੁਸੀਂ ਪ੍ਰਸ਼ਨ ਮੁੜ ਵੇਖਣ ਲਈ ਨਿਸ਼ਾਨ ਲਾਇਆ ਹੈ।", "ਤੁਸੀਂ ਜਵਾਬ ਦਿੱਤਾ ਹੈ ਅਤੇ ਮੁੜ ਵੇਖਣ ਲਈ ਨਿਸ਼ਾਨ ਲਾਇਆ ਹੈ।"], navigation: "ਪ੍ਰਸ਼ਨ ਖੋਲ੍ਹਣ ਅਤੇ ਜਵਾਬ ਦੇਣ ਦਾ ਤਰੀਕਾ", steps: ["ਪ੍ਰਸ਼ਨ ਖੋਲ੍ਹਣ ਲਈ ਪੈਲੇਟ ਵਿੱਚ ਉਸ ਦਾ ਨੰਬਰ ਚੁਣੋ।", "ਵਿਕਲਪ ਚੁਣੋ। ਅੱਗੇ ਜਾਣ ਲਈ Save & Next ਦਬਾਓ।", "ਚੁਣਿਆ ਜਵਾਬ ਹਟਾਉਣ ਲਈ Clear Response ਦਬਾਓ।", "ਬਾਅਦ ਵਿੱਚ ਵੇਖਣ ਲਈ Mark for Review ਵਰਤੋ।"], sections: "ਭਾਗਾਂ ਦਾ ਵੇਰਵਾ", language: "ਟੈਸਟ ਦੀ ਸ਼ੁਰੂਆਤੀ ਭਾਸ਼ਾ ਚੁਣੋ", languageNote: "ਟੈਸਟ ਦੌਰਾਨ ਪ੍ਰਸ਼ਨ ਦੀ ਭਾਸ਼ਾ ਬਦਲ ਸਕਦੇ ਹੋ। ਅਨੁਵਾਦ ਨਾ ਹੋਣ ਉੱਤੇ ਉਪਲਬਧ ਭਾਸ਼ਾ ਦਿਖਾਈ ਜਾਵੇਗੀ।", accept: "ਮੈਂ ਹਦਾਇਤਾਂ ਅਤੇ ਅੰਕ ਯੋਜਨਾ ਪੜ੍ਹ ਅਤੇ ਸਮਝ ਲਈ ਹੈ।", back: "ਪਿੱਛੇ", begin: "ਮੈਂ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਤਿਆਰ ਹਾਂ", mode: "ਟੈਸਟ ਇੰਟਰਫੇਸ", classic: "Examtree Classic", simulation: "Examtree ਅਭਿਆਸ ਟੈਸਟ",
  },
};

export function PreTestInstructions({ test, practice, variant, candidateName, languages, testLanguage, onLanguageChange, accepted, onAccept, onBack, onBegin }: {
  test: Test; practice: boolean; variant: "classic" | "tcs"; candidateName?: string;
  languages: Language[]; testLanguage: Language; onLanguageChange: (language: Language) => void;
  accepted: boolean; onAccept: (accepted: boolean) => void; onBack: () => void; onBegin: () => void;
}) {
  const [instructionLanguage, setInstructionLanguage] = useState<Language>("en");
  const t = copy[instructionLanguage];
  const count = test.sections.reduce((sum, section) => sum + section.questions.length, 0);
  const correct = test.marksPerQuestion ?? 1;
  const wrong = test.negativeMarks ?? 0;
  const locked = !practice && Boolean(test.sectionSettings?.some(section => section.locked));
  return <div className="pretest-page" lang={instructionLanguage} data-testid="pre-test-instructions">
    <header className="pretest-header"><span className="pretest-brand">Examtree</span><h1>{test.name}</h1></header>
    <div className="pretest-toolbar"><strong>{t.instructions}</strong><label>{t.view}: <select aria-label={t.view} value={instructionLanguage} onChange={e => setInstructionLanguage(e.target.value as Language)}>{(["en", "hi", "pa"] as const).map(lang => <option key={lang} value={lang}>{LANGUAGE_LABELS[lang]}</option>)}</select></label></div>
    <div className="pretest-body">
      <main className="pretest-main">
        <div className="pretest-scroll" tabIndex={0} aria-label={t.general}>
          <h2>{t.general}</h2>
          <ol className="pretest-rules"><li>{t.questions}: <strong>{count}</strong> · {t.duration}: <strong>{practice ? t.untimed : `${test.duration} ${t.minutes}`}</strong></li><li>{practice ? t.practice : t.timing}</li><li>{!practice && test.sectionTimingMode === "fixed" ? t.fixed : t.flexible}</li><li>{locked ? t.locked : t.free}</li></ol>
          <h3>{t.scoring}</h3><div className="pretest-scoring"><span>{t.correct}: <strong>+{correct}</strong></span><span>{t.wrong}: <strong>{wrong > 0 ? `−${wrong}` : 0}</strong></span><span>{t.unanswered}: <strong>0</strong></span></div>
          <h3>{t.palette}</h3><ul className="pretest-legend">{t.statuses.map((status, index) => (variant === "tcs" || index !== 4) && <li key={status}><span aria-hidden="true" className={`pretest-symbol pretest-symbol-${index} ${variant}`} />{status}</li>)}</ul>
          <h3>{t.navigation}</h3><ol className="pretest-rules">{t.steps.map(step => <li key={step}>{step}</li>)}</ol>
          <h3>{t.sections}</h3><ul className="pretest-sections">{test.sections.map(section => <li key={section.id}><span>{section.name}</span><span>{section.questions.length} {t.questions}</span></li>)}</ul>
        </div>
        <div className="pretest-readiness"><label className="pretest-language">{t.language}: <select data-testid="pretest-language" value={testLanguage} onChange={e => onLanguageChange(e.target.value as Language)}>{languages.map(lang => <option key={lang} value={lang}>{LANGUAGE_LABELS[lang]}</option>)}</select></label><p>{t.languageNote}</p><label className="pretest-acknowledgement"><input data-testid="pretest-accept" type="checkbox" checked={accepted} onChange={e => onAccept(e.target.checked)} /><strong>{t.accept}</strong></label></div>
      </main>
      <aside className="pretest-candidate" aria-label={t.candidate}><div className="pretest-avatar"><UserRound size={72} aria-hidden="true" /></div><p>{t.candidate}</p><strong className="pretest-name">{candidateName || t.candidate}</strong><dl><div><dt>{t.questions}</dt><dd>{count}</dd></div><div><dt>{t.duration}</dt><dd>{practice ? t.untimed : `${test.duration} ${t.minutes}`}</dd></div><div><dt>{t.marks}</dt><dd>{count * correct}</dd></div></dl><p className="pretest-interface">{t.mode}: {variant === "tcs" ? t.simulation : t.classic}</p></aside>
    </div>
    <footer className="pretest-footer"><button type="button" onClick={onBack}>{t.back}</button><button type="button" data-testid="begin-test" disabled={!accepted} onClick={onBegin}>{t.begin}</button></footer>
  </div>;
}
