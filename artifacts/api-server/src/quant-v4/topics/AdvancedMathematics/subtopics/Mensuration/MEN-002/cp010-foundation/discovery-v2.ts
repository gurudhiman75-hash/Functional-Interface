import {
  MEN_CP_010_DISCOVERY_V2_AUTHORITY,
  MEN_CP_010_DISCOVERY_V2_CANDIDATES,
  type MenCp010DiscoveryCandidateId,
  type MenCp010DiscoveryProbe,
} from "./discovery-v2-ledger";

export * from "./discovery-v2-ledger";

function gcd(a: bigint, b: bigint): bigint { let x = a < 0n ? -a : a; let y = b < 0n ? -b : b; while (y) { const r = x % y; x = y; y = r; } return x || 1n; }
function rat(n: bigint, d: bigint = 1n): string { const g = gcd(n, d); let nn = n / g, dd = d / g; if (dd < 0n) { nn = -nn; dd = -dd; } return dd === 1n ? `${nn}` : `${nn}/${dd}`; }
function parseRat(text: string): readonly [bigint, bigint] {
  const match = /^(-?\d+)(?:\/(\d+))?$/.exec(text.trim());
  if (!match) throw new Error(`Expected exact rational, got ${text}`);
  return [BigInt(match[1]!), BigInt(match[2] ?? "1")] as const;
}
function parseRatio(text: string): readonly [bigint, bigint] {
  const match = /^(-?\d+):(-?\d+)$/.exec(text.trim());
  if (!match) throw new Error(`Expected ratio, got ${text}`);
  return [BigInt(match[1]!), BigInt(match[2]!)] as const;
}
function parsePiCoefficient(text: string): readonly [bigint, bigint] {
  if (!text.endsWith("π")) throw new Error(`Expected exact π multiple, got ${text}`);
  return parseRat(text.slice(0, -1));
}
function parseCurrency(text: string): readonly [bigint, bigint] {
  if (!text.startsWith("₹")) throw new Error(`Expected rupee value, got ${text}`);
  return parseRat(text.slice(1));
}
function parsePercent(text: string): readonly [bigint, bigint] {
  if (!text.endsWith("%")) throw new Error(`Expected percentage, got ${text}`);
  return parseRat(text.slice(0, -1));
}
function ratio(a: bigint, b: bigint): string { const g = gcd(a, b); return `${a / g}:${b / g}`; }
function hash(seed: string): number { let h = 2166136261 >>> 0; for (const ch of seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
function pick<T>(seed: string, values: readonly T[]): T { return values[hash(seed) % values.length]!; }
function int(seed: string, min: number, max: number): bigint { return BigInt(min + (hash(seed) % (max - min + 1))); }
function correctPos(seed: string): number { return hash(`${seed}:answer`) % 4; }
function options(seed: string, answer: string, wrong: string[]) {
  const unique = [...new Set(wrong.filter((v) => v !== answer))];
  if (unique.length < 3) throw new Error(`Candidate-specific distractors collapsed for ${seed}: ${answer} :: ${wrong.join(" | ")}`);
  const pos = correctPos(seed), labels = ["A", "B", "C", "D"] as const;
  let w = 0;
  return labels.map((label, index) => ({ label, value: index === pos ? answer : unique[w++]!, isCorrect: index === pos }));
}
function sq(n: bigint) { return n * n; }
function cube(n: bigint) { return n * n * n; }

const TRIPLES = [[3n,4n,5n],[5n,12n,13n],[8n,15n,17n]] as const;
const SCALE_PCT = [80n, 90n, 110n, 120n, 125n, 150n] as const;

export function generateMenCp010DiscoveryV2Probe(candidateId: MenCp010DiscoveryCandidateId, seed: string): MenCp010DiscoveryProbe {
  const c = MEN_CP_010_DISCOVERY_V2_CANDIDATES.find((row) => row.id === candidateId);
  if (!c) throw new Error(`Unknown Wave 02 candidate ${candidateId}`);
  if (!c.executable) throw new Error(`Candidate ${candidateId} is a ledger-only discovery row.`);
  let stem = "", answer = "", wrong: string[] = [], method = "exact reconstruction", mathValid = false;
  const k = int(`${seed}:k`, 2, 7);
  switch (candidateId) {
    case "CP010-D2-INV-SQUARE-PYRAMID-SIDE-FROM-VOLUME": { const side = 2n * k, h = 3n * int(`${seed}:h`, 2, 6), V = sq(side) * h / 3n; stem = `Square pyramid: V=${V}, h=${h}. Find base side.`; answer = `${side}`; wrong = [`${sq(side)}`, `${side * 3n}`, `${side / 2n}`]; method = "parse proposed side and reconstruct V=a²h/3"; const [an,ad]=parseRat(answer); mathValid = an>0n && sq(an)*h === 3n*V*sq(ad); break; }
    case "CP010-D2-INV-RECT-PYRAMID-LENGTH-FROM-VOLUME": { const L=3n*k,b=int(`${seed}:b`,2,8),h=3n*int(`${seed}:h`,2,6),V=L*b*h/3n; stem=`Rectangular pyramid: V=${V}, b=${b}, h=${h}. Find L.`; answer=`${L}`; wrong=[`${L*3n}`,`${L/3n}`,`${L+b}`]; method="parse proposed length and reconstruct V=Lbh/3"; const [an,ad]=parseRat(answer); mathValid = an>0n && an*b*h === 3n*V*ad; break; }
    case "CP010-D2-INV-CONICAL-FRUSTUM-HEIGHT-FROM-VOLUME": { const R=3n*k,r=k,h=3n*int(`${seed}:h`,2,8),coef=h*(sq(R)+R*r+sq(r))/3n; stem=`Conical frustum: V=${coef}π, R=${R}, r=${r}. Find h.`; answer=`${h}`; wrong=[`${h*3n}`,`${h/3n}`,`${h*2n}`]; method="parse proposed height, cancel π, and reconstruct frustum volume"; const [an,ad]=parseRat(answer),S=sq(R)+R*r+sq(r); mathValid = an>0n && an*S === 3n*coef*ad; break; }
    case "CP010-D2-INV-SQUARE-FRUSTUM-HEIGHT-FROM-VOLUME": { const A=4n*k,a=2n*k,h=3n*int(`${seed}:h`,2,8),V=h*(sq(A)+A*a+sq(a))/3n; stem=`Square frustum: V=${V}, lower side=${A}, upper side=${a}. Find h.`; answer=`${h}`; wrong=[`${h*3n}`,`${h/3n}`,`${h*2n}`]; method="parse proposed height and reconstruct square-frustum volume"; const [an,ad]=parseRat(answer),S=sq(A)+A*a+sq(a); mathValid = an>0n && an*S === 3n*V*ad; break; }
    case "CP010-D2-INV-CONICAL-FRUSTUM-OUTER-RADIUS": { const [x,h,l]=pick(`${seed}:triple`,TRIPLES),scale=k,r=2n*k,R=r+x*scale,hh=h*scale,ll=l*scale; stem=`Conical frustum: r=${r}, h=${hh}, l=${ll}. Find R.`; answer=`${R}`; wrong=[`${R-r}`,`${R+r}`,`${R+ll}`]; method="parse proposed outer radius and verify (R-r)²+h²=l²"; const [an,ad]=parseRat(answer); mathValid = an>r*ad && sq(an-r*ad)+sq(hh)*sq(ad) === sq(ll)*sq(ad); break; }
    case "CP010-D2-INV-SQUARE-FRUSTUM-LOWER-SIDE": { const [x,h,l]=pick(`${seed}:triple`,TRIPLES),scale=k,a=2n*k,A=a+2n*x*scale,hh=h*scale,ll=l*scale; stem=`Square frustum: upper side=${a}, h=${hh}, l=${ll}. Find lower side.`; answer=`${A}`; wrong=[`${A-a}`,`${A+a}`,`${A+ll}`]; method="parse proposed lower side and verify ((A-a)/2)²+h²=l²"; const [an,ad]=parseRat(answer),delta=an-a*ad; mathValid = delta>0n && sq(delta)+4n*sq(hh)*sq(ad) === 4n*sq(ll)*sq(ad); break; }
    case "CP010-D2-RATIO-VOLUME-FROM-LINEAR": { const a=int(`${seed}:a`,2,5),b=int(`${seed}:b`,6,9); stem=`Two similar pyramids/frustums have corresponding linear ratio ${a}:${b}. Find volume ratio.`; answer=ratio(cube(a),cube(b)); wrong=[ratio(a,b),ratio(sq(a),sq(b)),ratio(cube(b),cube(a))]; method="parse proposed ratio and cross-check against cubed linear dimensions"; const [x,y]=parseRatio(answer); mathValid = x>0n && y>0n && x*cube(b) === y*cube(a); break; }
    case "CP010-D2-RATIO-AREA-FROM-LINEAR": { const a=int(`${seed}:a`,2,5),b=int(`${seed}:b`,6,9); stem=`Two similar pyramids/frustums have corresponding linear ratio ${a}:${b}. Find surface-area ratio.`; answer=ratio(sq(a),sq(b)); wrong=[ratio(a,b),ratio(cube(a),cube(b)),ratio(sq(b),sq(a))]; method="parse proposed ratio and cross-check against squared linear dimensions"; const [x,y]=parseRatio(answer); mathValid = x>0n && y>0n && x*sq(b) === y*sq(a); break; }
    case "CP010-D2-RATIO-LINEAR-FROM-VOLUME": { const a=int(`${seed}:a`,2,5),b=int(`${seed}:b`,6,9); stem=`Similar solids have volume ratio ${ratio(cube(a),cube(b))}. Find linear ratio.`; answer=ratio(a,b); wrong=[ratio(sq(a),sq(b)),ratio(cube(a),cube(b)),ratio(3n*a,3n*b+1n)]; method="parse proposed linear ratio, cube it, and compare with stated volume ratio"; const [x,y]=parseRatio(answer); mathValid = x>0n && y>0n && cube(x)*cube(b) === cube(y)*cube(a); break; }
    case "CP010-D2-RATIO-LINEAR-FROM-AREA": { const a=int(`${seed}:a`,2,5),b=int(`${seed}:b`,6,9); stem=`Similar solids have surface-area ratio ${ratio(sq(a),sq(b))}. Find linear ratio.`; answer=ratio(a,b); wrong=[ratio(cube(a),cube(b)),ratio(sq(a),sq(b)),ratio(2n*a,2n*b+1n)]; method="parse proposed linear ratio, square it, and compare with stated area ratio"; const [x,y]=parseRatio(answer); mathValid = x>0n && y>0n && sq(x)*sq(b) === sq(y)*sq(a); break; }
    case "CP010-D2-RATIO-PYRAMID-TO-PRISM": { const B=int(`${seed}:B`,8,30),h=int(`${seed}:h`,4,20); stem=`A pyramid and prism share base area ${B} and height ${h}. Find pyramid:prism volume ratio.`; answer="1:3"; wrong=["1:2","2:3","3:1"]; method="parse proposed ratio and cross-multiply Bh/3 against Bh"; const [x,y]=parseRatio(answer); mathValid = x>0n && y>0n && 3n*x*B*h === y*B*h; break; }
    case "CP010-D2-SIMILAR-FULL-HEIGHT-FROM-FRUSTUM": { const r=k,R=3n*k,fh=2n*int(`${seed}:h`,3,9),H=R*fh/(R-r); stem=`A frustum has corresponding radii/sides ${R} and ${r}, frustum height ${fh}. Find full parent-solid height.`; answer=rat(H); wrong=[rat(fh),rat(r*fh/(R-r)),rat(R*fh/r)]; method="parse proposed parent height and verify R/r = H/(H-h)"; const [an,ad]=parseRat(answer); mathValid = an>fh*ad && R*(an-fh*ad) === r*an; break; }
    case "CP010-D2-SIMILAR-REMOVED-TOP-HEIGHT": { const r=k,R=3n*k,fh=2n*int(`${seed}:h`,3,9),top=r*fh/(R-r); stem=`A frustum has corresponding radii/sides ${R} and ${r}, frustum height ${fh}. Find removed top height.`; answer=rat(top); wrong=[rat(fh),rat(R*fh/(R-r)),rat((R-r)*fh/r)]; method="parse proposed removed height and verify r/R = top/(top+h)"; const [an,ad]=parseRat(answer); mathValid = an>0n && r*(an+fh*ad) === R*an; break; }
    case "CP010-D2-SIMILAR-CROSS-SECTION-SIDE": { const fullSide=6n*k,fullH=12n*k,fromApex=pick(`${seed}:f`,[3n,4n,6n,8n] as const)*k,sectionNum=fullSide*fromApex,sectionDen=fullH; stem=`Square pyramid: base side=${fullSide}, height=${fullH}. A parallel section is ${fromApex} from apex. Find section side.`; answer=rat(sectionNum,sectionDen); wrong=[`${fullSide}`,rat(fullSide*fromApex),rat(fullSide*fullH,fromApex)]; method="parse proposed section side and verify section/base = apex-distance/full-height"; const [an,ad]=parseRat(answer); mathValid = an>0n && an*fullH === ad*fullSide*fromApex; break; }
    case "CP010-D2-SIMILAR-FRUSTUM-FULL-MINUS-CUT": { const r=k,R=3n*k,fh=6n*k,H=R*fh/(R-r),top=H-fh; const direct=fh*(sq(R)+R*r+sq(r))/3n; const diffNum=sq(R)*H-sq(r)*top; stem=`Frustum with R=${R}, r=${r}, h=${fh}. Derive its π-free volume coefficient by full cone minus removed cone.`; answer=rat(direct); wrong=[rat(fh*(sq(R)+sq(r))/3n),rat(sq(R)*fh/3n),rat(sq(R)*H/3n)]; method="parse proposed coefficient and reconstruct it as full cone minus removed cone"; const [an,ad]=parseRat(answer); mathValid = an>0n && 3n*an === diffNum*ad; break; }
    case "CP010-D2-APP-BUCKET-CAPACITY-LITRES": { const scale=k,R=14n*scale,r=7n*scale,h=30n*scale; const cm3Num=22n*h*(sq(R)+R*r+sq(r)),cm3Den=21n; stem=`Bucket frustum: R=${R} cm, r=${r} cm, h=${h} cm, π=22/7. Find capacity in litres.`; answer=rat(cm3Num,cm3Den*1000n); wrong=[rat(cm3Num,cm3Den),rat(cm3Num,cm3Den*100n),rat(cm3Num,cm3Den*1000000n)]; method="parse proposed litres, reconstruct frustum cm³ with π=22/7, then convert by 1000"; const [an,ad]=parseRat(answer),S=sq(R)+R*r+sq(r); mathValid = an>0n && an*21000n === ad*22n*h*S; break; }
    case "CP010-D2-APP-LAMPSHADE-AREA": { const R=7n*k,r=3n*k,l=5n*k; const coef=(R+r)*l; stem=`A conical lampshade has R=${R}, r=${r}, l=${l}. Find lateral sheet area as a coefficient of π.`; answer=`${coef}π`; wrong=[`${(R-r)*l}π`,`${R*l}π`,`${(R+r)*l+sq(R)+sq(r)}π`]; method="parse proposed π coefficient and sum the two radius contributions πRl+πrl"; const [an,ad]=parsePiCoefficient(answer); mathValid = an>0n && an === ad*l*(R+r); break; }
    case "CP010-D2-APP-PYRAMID-TENT-CANVAS": { const a=4n*k,l=5n*k,lsa=2n*a*l; stem=`A square-pyramid tent has base side=${a} and slant height=${l}. Find canvas area excluding floor.`; answer=`${lsa}`; wrong=[`${sq(a)+lsa}`,`${a*l/2n}`,`${sq(a)}`]; method="parse proposed area and reconstruct four triangular faces"; const [an,ad]=parseRat(answer); mathValid = an>0n && 2n*an === ad*4n*a*l; break; }
    case "CP010-D2-APP-SURFACE-COST": { const a=4n*k,l=5n*k,rate=int(`${seed}:rate`,8,25),area=2n*a*l,cost=area*rate; stem=`Square-pyramid lateral covering: a=${a} m, l=${l} m, rate=₹${rate}/m². Find cost.`; answer=`₹${cost}`; wrong=[`₹${area}`,`₹${sq(a)*rate}`,`₹${(area+sq(a))*rate}`]; method="parse proposed cost and reconstruct four triangular faces × area rate"; const [an,ad]=parseCurrency(answer); mathValid = an>0n && 2n*an === ad*4n*a*l*rate; break; }
    case "CP010-D2-SCALE-VOLUME-PERCENT-CHANGE": { const p=pick(`${seed}:pct`,SCALE_PCT),num=cube(p)-1000000n; stem=`Every linear dimension of a similar pyramid/frustum becomes ${p}% of original. Find volume percentage change.`; answer=`${rat(num,10000n)}%`; wrong=[`${rat(p-100n)}%`,`${rat(sq(p)-10000n,100n)}%`,`${rat(3n*(p-100n))}%`]; method="parse proposed percentage change and verify new-volume multiplier=(p/100)^3"; const [an,ad]=parsePercent(answer); mathValid = (100n*ad+an)*1000000n === 100n*ad*cube(p); break; }
    case "CP010-D2-SCALE-AREA-PERCENT-CHANGE": { const p=pick(`${seed}:pct`,SCALE_PCT),num=sq(p)-10000n; stem=`Every linear dimension of a similar pyramid/frustum becomes ${p}% of original. Find surface-area percentage change.`; answer=`${rat(num,100n)}%`; wrong=[`${rat(p-100n)}%`,`${rat(cube(p)-1000000n,10000n)}%`,`${rat(2n*(p-100n))}%`]; method="parse proposed percentage change and verify new-area multiplier=(p/100)^2"; const [an,ad]=parsePercent(answer); mathValid = (100n*ad+an)*10000n === 100n*ad*sq(p); break; }
    default: throw new Error(`No executable probe for ${candidateId}`);
  }
  const opts = options(`${candidateId}:${seed}`, answer, wrong);
  const correctIndex = opts.findIndex((o) => o.isCorrect);
  const valid = mathValid && correctIndex >= 0 && opts.length === 4 && new Set(opts.map((o) => o.value)).size === 4 && opts[correctIndex]!.value === answer;
  return { authority: MEN_CP_010_DISCOVERY_V2_AUTHORITY, candidateId, seed, stem, answer, options: opts, correctIndex, verification: { valid, method }, misconceptionLabels: wrong.slice(0,3).map((_,i)=>`CANDIDATE_MISCONCEPTION_${i+1}`), productLocked: true, permanentQlId: null };
}

export function auditMenCp010DiscoveryV2() {
  const rows = MEN_CP_010_DISCOVERY_V2_CANDIDATES;
  const executable = rows.filter((row) => row.executable);
  const axes = [...new Set(rows.map((row) => row.axis))];
  const clusters = [...new Set(rows.filter((row)=>row.disposition==="PROVISIONALLY_RETAIN").map((row) => row.cluster))];
  return {
    authority: MEN_CP_010_DISCOVERY_V2_AUTHORITY,
    candidateCount: rows.length,
    executableCandidateCount: executable.length,
    ledgerOnlyCount: rows.length - executable.length,
    axisCount: axes.length,
    axes,
    provisionalRetainedClusterCount: clusters.length,
    provisionalRetainedClusters: clusters,
    permanentQlCount: 0,
    ownershipRows: rows.filter((row) => row.axis === "OWNERSHIP").length,
    sourceLegacyRows: rows.filter((row) => row.axis === "SOURCE_LEGACY").length,
    unresolvedRows: rows.filter((row) => !row.disposition).length,
    productLocked: true,
  } as const;
}
