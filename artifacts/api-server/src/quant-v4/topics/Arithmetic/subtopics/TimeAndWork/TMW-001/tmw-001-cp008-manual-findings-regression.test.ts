import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const qls = ["TMW-QL-145","TMW-QL-146","TMW-QL-148","TMW-QL-149","TMW-QL-151","TMW-QL-152","TMW-QL-153","TMW-QL-154","TMW-QL-155","TMW-QL-156"] as const;
const languages: readonly Tmw001ChapterLanguage[] = ["en","hi","pa"];
const namespaces = ["tmw-cp008-editorial","tmw-cp008-editorial-review"] as const;
const seeds = ["0","1","2","3","4","5","6","7"] as const;
let checked = 0;
for (const qlId of qls) for (const language of languages) for (const namespace of namespaces) for (const suffix of seeds) {
  const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed: `${namespace}:${qlId}:${language}:${suffix}` });
  const label = `${qlId}:${language}:${namespace}:${suffix}`;
  checked += 1;
  assert(q.validation?.valid, `${label}: ${q.validation?.errors?.join(" | ")}`);
  assert(q.publiclyPublishable === false, `${label}: publication lock lost`);
  assert(q.options.length === 4 && new Set(q.options).size === 4, `${label}: option contract failed`);
  assert(q.options[q.correctIndex] === q.solution.answerText, `${label}: answer-option mismatch`);
  const learner = [q.learnerExplanation.method, ...q.learnerExplanation.solution, q.learnerExplanation.answer].join(" ");
  const all = [q.stem, learner, ...(q.explanation?.steps ?? []), q.explanation?.commonTrap?.explanation ?? ""].join(" ");
  if (language !== "en") assert(!/Target fraction|accepted components|accepted square metres|per accepted unit|square metres per|components per/i.test(all), `${label}: untranslated learner fragment remains`);
  assert(!/रंगाई का ठेका के लिए|ਰੰਗਾਈ ਦਾ ਠੇਕਾ ਲਈ/u.test(q.stem), `${label}: contract grammar remains`);
  if (qlId === "TMW-QL-145") assert(!/(\d+)=\1(?:[^\d]|$)/.test(learner), `${label}: duplicate selected contribution remains`);
  if (qlId === "TMW-QL-146") assert(!/1\\times3\\times4\\times5|1\\times2\\times4\\times5|1\\times1\\times4\\times5/.test(learner), `${label}: hidden factors remain`);
  if (qlId === "TMW-QL-148") assert(/equal daily hours cancel|प्रतिदिन समान घंटे कट|ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟ/i.test(learner), `${label}: unstated daily hours were not cancelled`);
  if (qlId === "TMW-QL-149") assert(!/Target fraction/i.test(all), `${label}: Target fraction remains`);
  if (qlId === "TMW-QL-153") assert(/equal time cancels|समान समय कट|ਇੱਕੋ ਸਮਾਂ ਕੱਟ/i.test(learner), `${label}: unstated equal time was not cancelled`);
  if (["TMW-QL-145","TMW-QL-148","TMW-QL-149","TMW-QL-155","TMW-QL-156"].includes(qlId) && q.explanation?.commonTrap?.misconceptionId === "TOTAL_REPORTED_AS_SHARE") {
    assert(!/प्रश्न कुल भुगतान राशि पूछता है|ਪ੍ਰਸ਼ਨ ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ ਪੁੱਛਦਾ ਹੈ/u.test(q.explanation.commonTrap.explanation), `${label}: generic total-payment trap still misstates target`);
  }
}
assert(checked === 480, `Expected 480 targeted CP008 cases, got ${checked}`);
console.log(JSON.stringify({ chapter:"TMW-001", checkpoint:"TMW-CP-008", targetedQls: qls.length, languages:3, seedNamespaces:2, seedsPerNamespace:8, checked, publicationLocked:true, verdict:"PASS" }, null, 2));
