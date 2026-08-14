import { MEN_CP_010_SATURATION_V3_AUTHORITY, MEN_CP_010_SATURATION_V3_ROWS } from "./saturation-v3-ledger";
export * from "./saturation-v3-ledger";

type Option = { label: "A"|"B"|"C"|"D"; value: string; isCorrect: boolean };
export type MenCp010SaturationProbe = { authority: typeof MEN_CP_010_SATURATION_V3_AUTHORITY; id: string; seed: string; stem: string; answer: string; options: Option[]; correctIndex: number; verification: {valid:boolean; method:string}; permanentQlId:null; productLocked:true };
function hash(s:string){let h=2166136261>>>0;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function n(seed:string,min:number,max:number){return BigInt(min+(hash(seed)%(max-min+1)));}
function pos(seed:string){return hash(`${seed}:pos`)%4;}
function opts(seed:string,answer:string,wrong:string[]):Option[]{const u=[...new Set(wrong.filter(x=>x!==answer))];if(u.length<3)throw new Error(`distractor collapse ${seed}`);const p=pos(seed),labels=["A","B","C","D"] as const;let w=0;return labels.map((label,i)=>({label,value:i===p?answer:u[w++]!,isCorrect:i===p}));}
function sq(x:bigint){return x*x;}
function parseRat(s:string){const m=/^(-?\d+)(?:\/(\d+))?$/.exec(s);if(!m)throw new Error(`not rational ${s}`);return [BigInt(m[1]!),BigInt(m[2]??"1")] as const;}

export function generateMenCp010SaturationV3Probe(id:string,seed:string):MenCp010SaturationProbe{
 const row=MEN_CP_010_SATURATION_V3_ROWS.find(r=>r.id===id);if(!row||!row.executable)throw new Error(`not executable ${id}`);
 let stem="",answer="",wrong:string[]=[],valid=false,method="independent reconstruction";
 const k=n(`${seed}:k`,2,8);
 switch(id){
  case "V3-REGULAR-PYRAMID-LSA":{const P=8n*k,l=3n*k,A=P*l/2n;stem=`Regular pyramid: base perimeter ${P}, face slant height ${l}. Find LSA.`;answer=`${A}`;wrong=[`${P*l}`,`${P*l/4n}`,`${sq(P)}`];const [x,d]=parseRat(answer);valid=2n*x===d*P*l;method="reconstruct four/general triangular faces as Pl/2";break;}
  case "V3-REGULAR-PYRAMID-TSA":{const P=8n*k,l=3n*k,B=4n*k*k,A=B+P*l/2n;stem=`Regular pyramid: base area ${B}, base perimeter ${P}, slant height ${l}. Find TSA.`;answer=`${A}`;wrong=[`${P*l/2n}`,`${B+P*l}`,`${B}`];const [x,d]=parseRat(answer);valid=2n*x===d*(2n*B+P*l);method="subtract/reconstruct base plus Pl/2";break;}
  case "V3-REGULAR-FRUSTUM-LSA":{const P1=12n*k,P2=8n*k,l=5n*k,A=(P1+P2)*l/2n;stem=`Regular-polygon frustum: perimeters ${P1} and ${P2}, slant height ${l}. Find LSA.`;answer=`${A}`;wrong=[`${(P1-P2)*l/2n}`,`${(P1+P2)*l}`,`${P1*l/2n}`];const [x,d]=parseRat(answer);valid=2n*x===d*(P1+P2)*l;method="reconstruct trapezoidal side faces using half perimeter-sum times slant";break;}
  case "V3-REGULAR-FRUSTUM-VOLUME":{const a=2n*k,b=3n*k,A1=sq(a),A2=sq(b),h=6n*k,V=h*(A1+a*b+A2)/3n;stem=`Similar-base frustum: base areas ${A1} and ${A2}, height ${h}. Find volume.`;answer=`${V}`;wrong=[`${h*(A1+A2)/3n}`,`${h*(A1+A2)}`,`${h*a*b/3n}`];const [x,d]=parseRat(answer);valid=3n*x===d*h*(A1+a*b+A2);method="reconstruct h(A1+sqrt(A1A2)+A2)/3";break;}
  case "V3-PYRAMID-LSA-INVERSE-SLANT":{const a=4n*k,l=5n*k,A=2n*a*l;stem=`Square pyramid: side ${a}, LSA ${A}. Find face slant height.`;answer=`${l}`;wrong=[`${2n*l}`,`${l/5n}`,`${a}`];const [x,d]=parseRat(answer);valid=2n*a*x===d*A;method="substitute proposed l into 2al";break;}
  case "V3-PYRAMID-TSA-INVERSE-SLANT":{const a=4n*k,l=5n*k,T=sq(a)+2n*a*l;stem=`Square pyramid: side ${a}, TSA ${T}. Find face slant height.`;answer=`${l}`;wrong=[`${2n*l}`,`${l/5n}`,`${a}`];const [x,d]=parseRat(answer);valid=d*T===d*sq(a)+2n*a*x;method="substitute proposed l into a²+2al";break;}
  case "V3-CONICAL-FRUSTUM-CSA-INVERSE-SLANT":{const R=7n*k,r=3n*k,l=5n*k,C=(R+r)*l;stem=`Conical frustum: R=${R}, r=${r}, CSA=${C}π. Find slant height.`;answer=`${l}`;wrong=[`${3n*l}`,`${R-r}`,`${R+r}`];const [x,d]=parseRat(answer);valid=(R+r)*x===d*C;method="cancel pi and reconstruct (R+r)l";break;}
  case "V3-CONICAL-FRUSTUM-TSA-INVERSE-SLANT":{const R=7n*k,r=3n*k,l=5n*k,C=(R+r)*l+sq(R)+sq(r);stem=`Conical frustum: R=${R}, r=${r}, TSA=${C}π. Find slant height.`;answer=`${l}`;wrong=[`${3n*l}`,`${R-r}`,`${R+r}`];const [x,d]=parseRat(answer);valid=(R+r)*x+d*(sq(R)+sq(r))===d*C;method="cancel pi, subtract end discs, reconstruct (R+r)l";break;}
  case "V3-POLYGONAL-FRUSTUM-LSA-INVERSE-SLANT":{const P1=12n*k,P2=8n*k,l=5n*k,A=(P1+P2)*l/2n;stem=`Regular-polygon frustum: perimeters ${P1}, ${P2}, LSA ${A}. Find slant height.`;answer=`${l}`;wrong=[`${2n*l}`,`${P1-P2}`,`${P1+P2}`];const [x,d]=parseRat(answer);valid=(P1+P2)*x===2n*d*A;method="reconstruct LSA=(P1+P2)l/2";break;}
  case "V3-POLYGONAL-FRUSTUM-TSA-INVERSE-SLANT":{const P1=12n*k,P2=8n*k,B1=9n*k*k,B2=4n*k*k,l=5n*k,T=B1+B2+(P1+P2)*l/2n;stem=`Regular-polygon frustum: perimeters ${P1}, ${P2}, base areas ${B1}, ${B2}, TSA ${T}. Find slant height.`;answer=`${l}`;wrong=[`${2n*l}`,`${P1-P2}`,`${P1+P2}`];const [x,d]=parseRat(answer);valid=(P1+P2)*x===2n*d*(T-B1-B2);method="subtract both bases then reconstruct lateral area";break;}
  case "V3-SURD-SLANT-REPRESENTATION":{const h=3n*k,q=2n*k,rad=sq(h)+sq(q);stem=`Right square pyramid: vertical height ${h}, half-base side ${q}. Give exact face slant height.`;answer=`√${rad}`;wrong=[`√${sq(h)+q}`,`${h+q}`,`√${sq(h)-sq(q)>0n?sq(h)-sq(q):sq(q)}`];const m=/^√(\d+)$/.exec(answer);valid=!!m&&BigInt(m[1]!)===sq(h)+sq(q);method="square the exact surd and compare with h²+(a/2)²";break;}
  default:throw new Error(`missing probe ${id}`);
 }
 const options=opts(`${id}:${seed}`,answer,wrong),correctIndex=options.findIndex(o=>o.isCorrect);valid=valid&&correctIndex>=0&&new Set(options.map(o=>o.value)).size===4&&options.filter(o=>o.isCorrect).length===1&&options[correctIndex]!.value===answer;
 return{authority:MEN_CP_010_SATURATION_V3_AUTHORITY,id,seed,stem,answer,options,correctIndex,verification:{valid,method},permanentQlId:null,productLocked:true};
}
