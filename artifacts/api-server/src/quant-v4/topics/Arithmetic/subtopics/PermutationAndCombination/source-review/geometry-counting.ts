/** Source-gap models. Review only; no implicit student publication authority. */
export type GeometryMode = "lines" | "linesWithCollinearBlock" | "triangles" | "trianglesWithCollinearBlock" | "quadrilateralsWithCollinearBlock" | "polygonDiagonals";
export type GeometryLanguage = "en" | "hi" | "pa";
export const geometryModes: GeometryMode[] = ["lines", "linesWithCollinearBlock", "triangles", "trianglesWithCollinearBlock", "quadrilateralsWithCollinearBlock", "polygonDiagonals"];
function choose(n: number, r: number): number {
 let value = 1;
 for (let i=1; i<=r; i++) value = value*(n-i+1)/i;
 return Math.round(value);
}
function domain(n: number, k: number): void {
 if (!Number.isInteger(n) || n<4 || n>30 || !Number.isInteger(k) || k<3 || k>=n) throw new Error("Expected 4 <= n <= 30 and 3 <= k < n, both integers");
}
export function solveGeometry(mode: GeometryMode, n: number, k: number): {answer: number; calculation: string} {
 domain(n,k);
 switch(mode) {
 case "lines": return {answer:choose(n,2),calculation:`C(${n}, 2) = ${choose(n,2)}`};
 case "linesWithCollinearBlock": return {answer:choose(n,2)-choose(k,2)+1,calculation:`C(${n}, 2) − C(${k}, 2) + 1 = ${choose(n,2)} − ${choose(k,2)} + 1 = ${choose(n,2)-choose(k,2)+1}`};
 case "triangles": return {answer:choose(n,3),calculation:`C(${n}, 3) = ${choose(n,3)}`};
 case "trianglesWithCollinearBlock": return {answer:choose(n,3)-choose(k,3),calculation:`C(${n}, 3) − C(${k}, 3) = ${choose(n,3)} − ${choose(k,3)} = ${choose(n,3)-choose(k,3)}`};
 case "quadrilateralsWithCollinearBlock": return {answer:choose(n,4)-choose(k,4)-choose(k,3)*(n-k),calculation:`C(${n}, 4) − C(${k}, 4) − C(${k}, 3) × ${n-k} = ${choose(n,4)} − ${choose(k,4)} − ${choose(k,3)*(n-k)} = ${choose(n,4)-choose(k,4)-choose(k,3)*(n-k)}`};
 case "polygonDiagonals": return {answer:choose(n,2)-n,calculation:`C(${n}, 2) − ${n} = ${choose(n,2)} − ${n} = ${choose(n,2)-n}`};
 default: throw new Error("Unsupported geometry mode");
 }
}
/** Enumerates selected vertex sets / distinct line identities, independent of choose(). */
export function verifyGeometry(mode: GeometryMode, n: number, k: number): number {
 domain(n,k);
 const size=mode.startsWith("lines") || mode==="polygonDiagonals" ? 2 : mode.startsWith("triangles") ? 3 : 4;
 let count=0; const lines=new Set<string>();
 function visit(selected: number[], start: number): void {
  if (selected.length===size) {
   const onLine=selected.filter(i=>i<k).length;
   if(mode==="linesWithCollinearBlock") lines.add(onLine===2 ? "collinear-block" : selected.join(":"));
   else if(mode==="polygonDiagonals") { const [a,b]=selected; if(b-a!==1 && !(a===0 && b===n-1)) count++; }
   else if(mode.endsWith("WithCollinearBlock")) { if(onLine<3) count++; }
   else count++;
   return;
  }
  for(let i=start;i<n;i++) visit([...selected,i],i+1);
 }
 visit([],0);
 return mode==="linesWithCollinearBlock" ? lines.size : count;
}
const languageText = {
 en: {
  general:(n:number)=>`${n} points lie in a plane, with no three collinear.`,
  block:(n:number,k:number)=>`Of ${n} points in a plane, ${k} lie on one straight line. No other set of three points is collinear.`,
  lines:"How many distinct straight lines are determined by these points?", triangles:"How many triangles have vertices among these points?", quadrilaterals:"How many sets of four points can be chosen as vertices of a quadrilateral?",
  polygon:(n:number)=>`How many diagonals does a convex polygon with ${n} vertices have?`,
  principles:["Every pair determines a line.","Pairs on the same line all determine one line; remove their duplicate count.","Choose three vertices.","Subtract selections whose three vertices lie on the same line.","Exclude sets with all four vertices on the line and sets with exactly three vertices on the line.","Every vertex pair gives a side or a diagonal; subtract the sides."], result:"Required number"
 },
 hi: {
  general:(n:number)=>`एक समतल में ${n} बिंदु हैं और कोई तीन बिंदु एक सीधी रेखा पर नहीं हैं।`,
  block:(n:number,k:number)=>`एक समतल में ${n} बिंदुओं में से ${k} एक सीधी रेखा पर हैं। इनके अलावा कोई तीन बिंदु एक सीधी रेखा पर नहीं हैं।`,
  lines:"इन बिंदुओं से कितनी अलग-अलग सीधी रेखाएँ बनती हैं?",triangles:"इन बिंदुओं को शीर्ष मानकर कितने त्रिभुज बन सकते हैं?",quadrilaterals:"इनमें से चार बिंदुओं के कितने समूह चतुर्भुज के शीर्ष बन सकते हैं?",
  polygon:(n:number)=>`${n} शीर्षों वाले उत्तल बहुभुज में कितने विकर्ण होते हैं?`,
  principles:["हर दो बिंदु एक रेखा निर्धारित करते हैं।","एक ही रेखा पर स्थित बिंदुओं के सभी जोड़े एक ही रेखा बनाते हैं; दोहराव घटाएँ।","तीन शीर्ष चुनें।","एक ही रेखा पर स्थित तीन बिंदुओं वाले चयन घटाएँ।","एक ही रेखा पर चार बिंदुओं वाले और ठीक तीन बिंदुओं वाले चयन घटाएँ।","दो शीर्षों का हर जोड़ा एक भुजा या विकर्ण देता है; भुजाओं की संख्या घटाएँ।"],result:"आवश्यक संख्या"
 },
 pa: {
  general:(n:number)=>`ਇੱਕ ਸਮਤਲ ਵਿੱਚ ${n} ਬਿੰਦੂ ਹਨ ਅਤੇ ਕੋਈ ਵੀ ਤਿੰਨ ਬਿੰਦੂ ਇੱਕ ਸਿੱਧੀ ਰੇਖਾ ਉੱਤੇ ਨਹੀਂ ਹਨ।`,
  block:(n:number,k:number)=>`ਇੱਕ ਸਮਤਲ ਵਿੱਚ ${n} ਬਿੰਦੂਆਂ ਵਿੱਚੋਂ ${k} ਇੱਕ ਸਿੱਧੀ ਰੇਖਾ ਉੱਤੇ ਹਨ। ਇਨ੍ਹਾਂ ਤੋਂ ਇਲਾਵਾ ਕੋਈ ਵੀ ਤਿੰਨ ਬਿੰਦੂ ਇੱਕ ਸਿੱਧੀ ਰੇਖਾ ਉੱਤੇ ਨਹੀਂ ਹਨ।`,
  lines:"ਇਨ੍ਹਾਂ ਬਿੰਦੂਆਂ ਤੋਂ ਕਿੰਨੀਆਂ ਵੱਖ-ਵੱਖ ਸਿੱਧੀਆਂ ਰੇਖਾਵਾਂ ਬਣਦੀਆਂ ਹਨ?",triangles:"ਇਨ੍ਹਾਂ ਬਿੰਦੂਆਂ ਨੂੰ ਸਿਖਰ ਮੰਨ ਕੇ ਕਿੰਨੇ ਤਿਕੋਣ ਬਣ ਸਕਦੇ ਹਨ?",quadrilaterals:"ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਚਾਰ ਬਿੰਦੂਆਂ ਦੇ ਕਿੰਨੇ ਸਮੂਹ ਚਤੁਰਭੁਜ ਦੇ ਸਿਖਰ ਬਣ ਸਕਦੇ ਹਨ?",
  polygon:(n:number)=>`${n} ਸਿਖਰਾਂ ਵਾਲੇ ਉੱਤਲ ਬਹੁਭੁਜ ਵਿੱਚ ਕਿੰਨੇ ਵਿਕਰਣ ਹੁੰਦੇ ਹਨ?`,
  principles:["ਹਰ ਦੋ ਬਿੰਦੂ ਇੱਕ ਰੇਖਾ ਨਿਰਧਾਰਤ ਕਰਦੇ ਹਨ।","ਇੱਕੋ ਰੇਖਾ ਉੱਤੇ ਪਏ ਬਿੰਦੂਆਂ ਦੇ ਸਾਰੇ ਜੋੜੇ ਇੱਕੋ ਰੇਖਾ ਬਣਾਉਂਦੇ ਹਨ; ਦੁਹਰਾਈ ਘਟਾਓ।","ਤਿੰਨ ਸਿਖਰ ਚੁਣੋ।","ਇੱਕੋ ਰੇਖਾ ਉੱਤੇ ਪਏ ਤਿੰਨ ਬਿੰਦੂਆਂ ਵਾਲੀਆਂ ਚੋਣਾਂ ਘਟਾਓ।","ਇੱਕੋ ਰੇਖਾ ਉੱਤੇ ਚਾਰ ਬਿੰਦੂਆਂ ਵਾਲੀਆਂ ਅਤੇ ਠੀਕ ਤਿੰਨ ਬਿੰਦੂਆਂ ਵਾਲੀਆਂ ਚੋਣਾਂ ਘਟਾਓ।","ਦੋ ਸਿਖਰਾਂ ਦਾ ਹਰ ਜੋੜਾ ਇੱਕ ਭੁਜਾ ਜਾਂ ਵਿਕਰਣ ਦਿੰਦਾ ਹੈ; ਭੁਜਾਵਾਂ ਦੀ ਗਿਣਤੀ ਘਟਾਓ।"],result:"ਲੋੜੀਂਦੀ ਗਿਣਤੀ"
 }
};
export function generateGeometryReview(mode: GeometryMode, seed: string, language: GeometryLanguage="en") {
 let hash=2166136261;
 for(const c of seed) hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
 const n=8+hash%9, k=3+(hash>>>8)%Math.min(5,n-3);
 const result=solveGeometry(mode,n,k), independent=verifyGeometry(mode,n,k);
 const text=languageText[language];
 const stem=mode==="polygonDiagonals" ? text.polygon(n) : `${mode.endsWith("WithCollinearBlock") ? text.block(n,k) : text.general(n)} ${mode.startsWith("lines") ? text.lines : mode.startsWith("triangles") ? text.triangles : text.quadrilaterals}`;
 // Common counting errors: omit the collinearity correction, omit the restored
 // line, or confuse sides/pairs. Fill collisions deterministically.
 const wrongCandidates = mode === "linesWithCollinearBlock" ? [choose(n,2), result.answer-1, choose(n,2)-choose(k,2)-1]
  : mode === "trianglesWithCollinearBlock" ? [choose(n,3), choose(n,3)-k, result.answer+1]
  : mode === "quadrilateralsWithCollinearBlock" ? [choose(n,4), choose(n,4)-choose(k,4), choose(n,4)-choose(k,3)*(n-k)]
  : mode === "polygonDiagonals" ? [choose(n,2), n*(n-3), result.answer+n-1]
  : [choose(n,mode === "lines" ? 3 : 2), result.answer*2, result.answer-1];
 const optionValues=[result.answer];
 for(const value of [...wrongCandidates,result.answer+1,result.answer+n,result.answer+n+1]) {
  if(value>=0 && !optionValues.includes(value)) optionValues.push(value);
  if(optionValues.length===4) break;
 }
 const options=optionValues.map(String);
 const correctIndex=(hash>>>16)%4;
 [options[0],options[correctIndex]]=[options[correctIndex],options[0]];
 return {packageId:"PNC-SOURCE-GEOMETRY-REVIEW",canonicalProblemId:"PNC-CP-003",questionLanguageId:`PNC-SOURCE-GEO-${geometryModes.indexOf(mode)+1}`,mode,seed,language,parameters:{n,k},stem,options,correctIndex,answer:String(result.answer),explanation:[text.principles[geometryModes.indexOf(mode)],result.calculation,`${text.result}: ${result.answer}`],independentAnswer:independent,valid:independent===result.answer && new Set(options).size===4,publiclyPublishable:false,reviewStatus:"REVIEW_REQUIRED"};
}
