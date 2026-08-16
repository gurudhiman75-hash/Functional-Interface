import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function optionNumbers(options: string[]): string[] { return (options.join(" ").match(/-?\d+(?:\.\d+)?(?:\/\d+)?/g) ?? []).sort(); }
function visibleText(q: any): string {
  const e=q.explanation??{}, l=q.learnerExplanation??{};
  return [q.stem,...(q.options??[]),q.solution?.answerText,e.opening,e.formula,...(e.givens??[]),...(e.steps??[]),e.shortcut?.title,...(e.shortcut?.steps??[]),e.commonTrap?.explanation,e.conclusion,l.method,...(l.solution??[]),l.answer].filter(Boolean).join(" ");
}
function proseInsideMath(value:string):boolean{for(const hit of value.matchAll(/\\\(([\s\S]*?)\\\)/g))if(/[\u0900-\u097F\u0A00-\u0A7F]/u.test(hit[1]??""))return true;return false;}

const qls=Array.from({length:19},(_,i)=>`TMW-QL-${String(i+193).padStart(3,"0")}`);
const languages:readonly Tmw001ChapterLanguage[]=["en","hi","pa"];
const namespaces=["tmw-cp011-editorial","tmw-cp011-editorial-review"] as const;
const seeds=["0","1","2","3","4","5","6","7"] as const;
const unitTokens={
  hi:{booklets:"पुस्तिकाएँ",cartons:"कार्टन",components:"पुर्ज़े",crates:"पेटियाँ",files:"फाइलें",sections:"सड़क के हिस्से"},
  pa:{booklets:"ਪੁਸਤਿਕਾਵਾਂ",cartons:"ਕਾਰਟਨ",components:"ਪੁਰਜ਼ੇ",crates:"ਪੇਟੀਆਂ",files:"ਫਾਈਲਾਂ",sections:"ਸੜਕ ਦੇ ਹਿੱਸੇ"},
} as const;
const modes=new Set<string>(); let checked=0;
for(const qlId of qls)for(const namespace of namespaces)for(const seedSuffix of seeds){
  const generated=new Map<Tmw001ChapterLanguage,any>();
  const seed=`${namespace}:${qlId}:${seedSuffix}`;
  for(const language of languages){
    const q=runTmw001ChapterPipeline({questionLanguageId:qlId,language,seed}); generated.set(language,q); checked+=1; modes.add(q.solveMode);
    const label=`${qlId}:${language}:${namespace}:${seedSuffix}`, text=visibleText(q);
    assert(q.canonicalProblemId==="TMW-CP-011",`${label}: checkpoint mismatch`);
    assert(q.questionLanguageId===qlId,`${label}: QL mismatch`);
    assert(q.validation?.valid,`${label}: ${q.validation?.errors?.join(" | ")}`);
    assert(q.publiclyPublishable===false,`${label}: publication lock lost`);
    assert(q.options.length===4&&new Set(q.options).size===4,`${label}: option contract failed`);
    assert(q.correctIndex>=0&&q.correctIndex<4,`${label}: invalid correctIndex`);
    assert(q.options[q.correctIndex]===q.solution.answerText,`${label}: answer-option mismatch`);
    assert(q.learnerExplanationVersion==="TMW_LEARNER_V2",`${label}: learner version mismatch`);
    assert(q.learnerExplanation.solution.length>=2&&q.learnerExplanation.solution.length<=5,`${label}: learner explanation depth mismatch`);
    assert(!/undefined|null|NaN|Infinity|\{\{|\$\{/.test(text),`${label}: unresolved learner content`);
    assert(!/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(text),`${label}: control character remains`);
    assert(!proseInsideMath(text),`${label}: localized prose remains inside MathJax`);
    assert(!/\bS\}/.test(text),`${label}: malformed S brace remains`);
    assert(!/(?:^|\s)S=tr_1\+\(n-t\)r_2(?:\s|$)/.test(text),`${label}: raw threshold solver notation remains`);
    if(language==="hi"){
      assert(/[\u0900-\u097F]/u.test(text),`${label}: Hindi script missing`);
      assert(!/\b(?:Asha|Bharat|Meera|Rohan|Priya|Raj|Kiran|Nitin|Simran|Arjun)\b/.test(q.stem),`${label}: Latin personal name remains in Hindi stem`);
      assert(!/(?:पुस्तिकाएँ|पेटियाँ|फाइलें) पूरे होते हैं|(?:पुर्ज़े|सड़क के हिस्से) पूरी होती हैं|(?:पुस्तिकाएँ|पेटियाँ|फाइलें) पूरा (?:होने|करने)|(?:पुर्ज़े|सड़क के हिस्से) पूरी (?:होने|करने)/u.test(q.stem),`${label}: Hindi object agreement defect remains`);
      const key=q.parameters?.context?.unit as keyof typeof unitTokens.hi|undefined;
      if(key){const expected=unitTokens.hi[key];for(const [k,token] of Object.entries(unitTokens.hi))if(k!==key)assert(!q.stem.includes(token),`${label}: wrong Hindi context unit ${token}; expected ${expected}`);}
    }
    if(language==="pa"){
      assert(/[\u0A00-\u0A7F]/u.test(text),`${label}: Punjabi script missing`);
      assert(!/\b(?:Asha|Bharat|Meera|Rohan|Priya|Raj|Kiran|Nitin|Simran|Arjun)\b/.test(q.stem),`${label}: Latin personal name remains in Punjabi stem`);
      assert(!/(?:ਪੁਸਤਿਕਾਵਾਂ|ਪੇਟੀਆਂ|ਫਾਈਲਾਂ) ਪੂਰੇ ਹੁੰਦੇ ਹਨ|(?:ਪੁਰਜ਼ੇ|ਸੜਕ ਦੇ ਹਿੱਸੇ) ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ|(?:ਪੁਸਤਿਕਾਵਾਂ|ਪੇਟੀਆਂ|ਫਾਈਲਾਂ) ਪੂਰੇ (?:ਹੋਣ|ਕਰਨ)|(?:ਪੁਰਜ਼ੇ|ਸੜਕ ਦੇ ਹਿੱਸੇ) ਪੂਰੀਆਂ (?:ਹੋਣ|ਕਰਨ)/u.test(q.stem),`${label}: Punjabi object agreement defect remains`);
      const key=q.parameters?.context?.unit as keyof typeof unitTokens.pa|undefined;
      if(key){const expected=unitTokens.pa[key];for(const [k,token] of Object.entries(unitTokens.pa))if(k!==key)assert(!q.stem.includes(token),`${label}: wrong Punjabi context unit ${token}; expected ${expected}`);}
    }
    if(qlId==="TMW-QL-207") assert(/table|day-wise|तालिका|दिनवार|ਦਿਨਵਾਰ|ਸਾਰਣੀ/i.test(q.learnerExplanation.method),`${label}: explicit rate-table method is misleading`);
    if(qlId==="TMW-QL-211") assert(!/नई दर में दैनिक|ਨਵੀਂ ਦਰ ਵਿੱਚ ਰੋਜ਼ਾਨਾ/u.test(q.stem),`${label}: post-switch rate-change wording remains ambiguous`);
  }
  const en=generated.get("en"),hi=generated.get("hi"),pa=generated.get("pa"); assert(en&&hi&&pa,`${qlId}:${namespace}:${seedSuffix}: missing language output`);
  assert(en.mathematicalFingerprint===hi.mathematicalFingerprint,`${qlId}:${namespace}:${seedSuffix}: Hindi mathematical fingerprint mismatch`);
  assert(en.mathematicalFingerprint===pa.mathematicalFingerprint,`${qlId}:${namespace}:${seedSuffix}: Punjabi mathematical fingerprint mismatch`);
  assert(JSON.stringify(optionNumbers(en.options))===JSON.stringify(optionNumbers(hi.options)),`${qlId}:${namespace}:${seedSuffix}: Hindi option-value mismatch`);
  assert(JSON.stringify(optionNumbers(en.options))===JSON.stringify(optionNumbers(pa.options)),`${qlId}:${namespace}:${seedSuffix}: Punjabi option-value mismatch`);
}
assert(checked===912,`Expected 912 cases, got ${checked}`); assert(modes.size===19,`Expected 19 solve modes, got ${modes.size}`);
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-011",checked,solveModes:modes.size,publicationLocked:true,manualFindingsGuarded:true,verdict:"PASS"},null,2));
