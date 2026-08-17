import { add, divide, formatExactPlain, multiply, rational } from "../foundation/exact";
import type { ExactRational } from "../foundation/types";

export const MEN_CP_012_DISCOVERY_V2_AUTHORITY = "MEN-CP012-DISCOVERY-WAVE-02-V1" as const;

export type MenCp012DiscoveryV2Id =
  | "CP012-D2-SPHERE-TARGET-RADIUS-FROM-COUNT"
  | "CP012-D2-SPHERE-SOURCE-RADIUS-FROM-COUNT"
  | "CP012-D2-CYLINDER-RADIUS-FROM-SPHERE-COUNT"
  | "CP012-D2-SOURCE-SPHERE-COUNT-TO-CYLINDER"
  | "CP012-D2-SMALL-CUBE-SIDE-FROM-COUNT"
  | "CP012-D2-SOURCE-CUBE-SIDE-FROM-COUNT"
  | "CP012-D2-WIRE-RADIUS-FROM-LENGTH"
  | "CP012-D2-WIRE-DIAMETER-PHRASING"
  | "CP012-D2-SHEET-THICKNESS-INVERSE"
  | "CP012-D2-LOSS-PERCENT-FROM-OUTPUT-COUNT"
  | "CP012-D2-SOURCE-SPHERE-COUNT-WITH-WASTAGE"
  | "CP012-D2-YIELD-PERCENT-FROM-OUTPUT"
  | "CP012-D2-METRE-TO-MM-CUBE-COUNT"
  | "CP012-D2-CYLINDER-PLUS-CONE-TO-CYLINDER";

export type MenCp012DiscoveryClusterHint =
  | "COUNT_FROM_VOLUME_RATIO"
  | "INVERSE_DIMENSION_FROM_CONSERVATION"
  | "WIRE_SHEET_DRAWING"
  | "LOSS_YIELD_CONSERVATION"
  | "UNIT_CONVERSION"
  | "COMBINED_SOURCE_SOLIDS";

export type MenCp012DiscoveryDisposition =
  | "RETAIN_CANDIDATE"
  | "MERGE_AS_REPRESENTATION"
  | "MERGE_AS_DIRECTIONAL_INVERSE";

export interface MenCp012DiscoveryDefinition {
  id: MenCp012DiscoveryV2Id;
  clusterHint: MenCp012DiscoveryClusterHint;
  disposition: MenCp012DiscoveryDisposition;
  reason: string;
}

export const MEN_CP_012_DISCOVERY_V2_DEFINITIONS: readonly MenCp012DiscoveryDefinition[] = [
  { id: "CP012-D2-SPHERE-TARGET-RADIUS-FROM-COUNT", clusterHint: "INVERSE_DIMENSION_FROM_CONSERVATION", disposition: "MERGE_AS_DIRECTIONAL_INVERSE", reason: "Reverse sphere-to-sphere count; likely same reasoning identity as source-radius recovery." },
  { id: "CP012-D2-SPHERE-SOURCE-RADIUS-FROM-COUNT", clusterHint: "INVERSE_DIMENSION_FROM_CONSERVATION", disposition: "MERGE_AS_DIRECTIONAL_INVERSE", reason: "Directional inverse of the same cubic volume-ratio relation." },
  { id: "CP012-D2-CYLINDER-RADIUS-FROM-SPHERE-COUNT", clusterHint: "INVERSE_DIMENSION_FROM_CONSERVATION", disposition: "RETAIN_CANDIDATE", reason: "Requires square-root recovery after cross-shape conservation." },
  { id: "CP012-D2-SOURCE-SPHERE-COUNT-TO-CYLINDER", clusterHint: "COUNT_FROM_VOLUME_RATIO", disposition: "MERGE_AS_REPRESENTATION", reason: "Same count-by-volume ratio as cylinder-to-spheres with source/target wording reversed." },
  { id: "CP012-D2-SMALL-CUBE-SIDE-FROM-COUNT", clusterHint: "INVERSE_DIMENSION_FROM_CONSERVATION", disposition: "MERGE_AS_DIRECTIONAL_INVERSE", reason: "Cube-root inverse of cube count." },
  { id: "CP012-D2-SOURCE-CUBE-SIDE-FROM-COUNT", clusterHint: "INVERSE_DIMENSION_FROM_CONSERVATION", disposition: "MERGE_AS_DIRECTIONAL_INVERSE", reason: "Opposite direction of the same cube-root conservation relation." },
  { id: "CP012-D2-WIRE-RADIUS-FROM-LENGTH", clusterHint: "WIRE_SHEET_DRAWING", disposition: "RETAIN_CANDIDATE", reason: "Inverse cross-sectional dimension recovery is reasoning-distinct from direct wire length." },
  { id: "CP012-D2-WIRE-DIAMETER-PHRASING", clusterHint: "WIRE_SHEET_DRAWING", disposition: "MERGE_AS_REPRESENTATION", reason: "Diameter wording should not create a new QL by itself." },
  { id: "CP012-D2-SHEET-THICKNESS-INVERSE", clusterHint: "WIRE_SHEET_DRAWING", disposition: "RETAIN_CANDIDATE", reason: "Inverse thickness recovery after rolling/flattening." },
  { id: "CP012-D2-LOSS-PERCENT-FROM-OUTPUT-COUNT", clusterHint: "LOSS_YIELD_CONSERVATION", disposition: "RETAIN_CANDIDATE", reason: "Loss percentage itself is the unknown, not merely an input multiplier." },
  { id: "CP012-D2-SOURCE-SPHERE-COUNT-WITH-WASTAGE", clusterHint: "LOSS_YIELD_CONSERVATION", disposition: "RETAIN_CANDIDATE", reason: "Reverse count with retained-material factor." },
  { id: "CP012-D2-YIELD-PERCENT-FROM-OUTPUT", clusterHint: "LOSS_YIELD_CONSERVATION", disposition: "MERGE_AS_DIRECTIONAL_INVERSE", reason: "Yield and loss are complementary output-efficiency representations." },
  { id: "CP012-D2-METRE-TO-MM-CUBE-COUNT", clusterHint: "UNIT_CONVERSION", disposition: "MERGE_AS_REPRESENTATION", reason: "Tests cubic unit discipline but not a new conservation identity." },
  { id: "CP012-D2-CYLINDER-PLUS-CONE-TO-CYLINDER", clusterHint: "COMBINED_SOURCE_SOLIDS", disposition: "RETAIN_CANDIDATE", reason: "Mixed source formulae must be summed before target inversion." },
] as const;

const LABELS = ["A", "B", "C", "D"] as const;

function hash(text: string) {
  let value = 2166136261 >>> 0;
  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value >>> 0;
}

function pick<T>(seed: string, values: readonly T[]): T {
  return values[hash(seed) % values.length]!;
}

function scale(seed: string) {
  return BigInt(1 + (hash(`${seed}:scale`) % 3));
}

function position(seed: string, id: MenCp012DiscoveryV2Id) {
  const trailing = /(\d+)$/.exec(seed);
  if (trailing) return Number(trailing[1]) % 4;
  return hash(`${id}:${seed}:position`) % 4;
}

function natural(value: ExactRational) {
  if (value.denominator === 1n) return `${value.numerator}`;
  const denominator = Number(value.denominator);
  if ([2,4,5,8,10,20,25,40,50,100].includes(denominator)) return `${Number(value.numerator)/denominator}`;
  return formatExactPlain(value);
}

function options(answer: ExactRational, unit: string, correctIndex: number) {
  const wrong = [divide(answer, rational(2)), multiply(answer, rational(2)), add(answer, rational(1))];
  let wi = 0;
  return LABELS.map((label, index) => {
    const value = index === correctIndex ? answer : wrong[wi++]!;
    return { label, display: `${natural(value)} ${unit}`, isCorrect: index === correctIndex };
  });
}

type Built = {
  stem: string;
  answer: ExactRational;
  unit: string;
  work: string;
  verification: boolean;
};

function build(id: MenCp012DiscoveryV2Id, seed: string): Built {
  const s = scale(seed);

  if (id === "CP012-D2-SPHERE-TARGET-RADIUS-FROM-COUNT") {
    const k = BigInt(pick(`${seed}:k`, [2,3,4,5] as const));
    const r = s, R = k*r, n=k*k*k;
    return { stem:`A metal sphere of radius ${R} cm is melted into ${n} identical smaller spheres. Find the radius of each smaller sphere.`, answer:rational(r), unit:"cm", work:`r = R/∛n = ${R}/∛${n} = ${r} cm.`, verification:R===r*k };
  }
  if (id === "CP012-D2-SPHERE-SOURCE-RADIUS-FROM-COUNT") {
    const k=BigInt(pick(`${seed}:k`,[2,3,4,5] as const));
    const r=s,n=k*k*k,R=k*r;
    return { stem:`${n} identical metal spheres, each of radius ${r} cm, are melted together to form one larger sphere. Find the radius of the larger sphere.`, answer:rational(R), unit:"cm", work:`R = r∛n = ${r}×∛${n} = ${R} cm.`, verification:R===r*k };
  }
  if (id === "CP012-D2-CYLINDER-RADIUS-FROM-SPHERE-COUNT") {
    const [n0,r0,h0,R0]=pick(`${seed}:p`,[[8,3,8,6],[16,3,9,8],[6,5,10,10]] as const);
    const n=BigInt(n0),r=BigInt(r0)*s,h=BigInt(h0)*s,R=BigInt(R0)*s;
    const calc=divide(rational(4n*n*r*r*r),rational(3n*h));
    return { stem:`${n} identical solid spheres of radius ${r} cm are melted to form a cylinder of height ${h} cm. Find the cylinder's radius.`, answer:rational(R), unit:"cm", work:`R² = 4n r³/(3h) = ${natural(calc)}, so R = ${R} cm.`, verification:calc.denominator===1n && calc.numerator===R*R };
  }
  if (id === "CP012-D2-SOURCE-SPHERE-COUNT-TO-CYLINDER") {
    const [R0,h0,r0,n0]=pick(`${seed}:p`,[[6,8,3,8],[8,9,3,16],[10,10,5,6],[12,5,3,20]] as const);
    const R=BigInt(R0)*s,h=BigInt(h0)*s,r=BigInt(r0)*s,n=BigInt(n0);
    return { stem:`How many solid spheres of radius ${r} cm must be melted to form a cylinder of radius ${R} cm and height ${h} cm, with no loss of material?`, answer:rational(n), unit:"spheres", work:`n = 3R²h/(4r³) = ${n}.`, verification:3n*R*R*h===4n*n*r*r*r };
  }
  if (id === "CP012-D2-SMALL-CUBE-SIDE-FROM-COUNT") {
    const k=BigInt(pick(`${seed}:k`,[2,3,4,5] as const));
    const a=s,A=k*a,n=k*k*k;
    return { stem:`A cube of side ${A} cm is melted and recast into ${n} identical smaller cubes. Find the side of each smaller cube.`, answer:rational(a), unit:"cm", work:`a = A/∛n = ${A}/∛${n} = ${a} cm.`, verification:A===k*a };
  }
  if (id === "CP012-D2-SOURCE-CUBE-SIDE-FROM-COUNT") {
    const k=BigInt(pick(`${seed}:k`,[2,3,4,5] as const));
    const a=s,n=k*k*k,A=k*a;
    return { stem:`${n} identical metal cubes of side ${a} cm are melted together to form one cube. Find the side of the new cube.`, answer:rational(A), unit:"cm", work:`A = a∛n = ${a}×∛${n} = ${A} cm.`, verification:A===k*a };
  }
  if (id === "CP012-D2-WIRE-RADIUS-FROM-LENGTH") {
    const [R0,H0,r0,L0]=pick(`${seed}:p`,[[5,20,1,500],[6,25,2,225],[8,18,2,288],[9,20,3,180]] as const);
    const R=BigInt(R0)*s,H=BigInt(H0)*s,r=BigInt(r0)*s,L=BigInt(L0)*s;
    return { stem:`A cylindrical metal rod of radius ${R} cm and length ${H} cm is drawn into a wire ${L} cm long. Find the wire's radius.`, answer:rational(r), unit:"cm", work:`r² = R²H/L = ${R}²×${H}/${L} = ${r*r}; hence r = ${r} cm.`, verification:R*R*H===r*r*L };
  }
  if (id === "CP012-D2-WIRE-DIAMETER-PHRASING") {
    const [D0,H0,d0,L0]=pick(`${seed}:p`,[[10,20,2,500],[12,25,4,225],[16,18,4,288],[18,20,6,180]] as const);
    const D=BigInt(D0),H=BigInt(H0)*s,d=BigInt(d0),L=BigInt(L0)*s;
    return { stem:`A cylindrical rod of diameter ${D} cm and length ${H} cm is drawn into a wire of diameter ${d} cm. Find the wire's length.`, answer:rational(L), unit:"cm", work:`Because area ∝ diameter², L = (D/d)²×${H} = ${L} cm.`, verification:D*D*H===d*d*L };
  }
  if (id === "CP012-D2-SHEET-THICKNESS-INVERSE") {
    const [L0,t0,L20,t20]=pick(`${seed}:p`,[[50,4,200,1],[60,3,180,1],[80,5,200,2],[90,6,180,3]] as const);
    const L=BigInt(L0)*s,t=BigInt(t0),L2=BigInt(L20)*s,t2=BigInt(t20);
    return { stem:`A metal slab ${L} cm long and ${t} cm thick is rolled into a plate of the same width and length ${L2} cm. Find the plate thickness.`, answer:rational(t2), unit:"cm", work:`Lt = L₂t₂, so t₂ = ${L}×${t}/${L2} = ${t2} cm.`, verification:L*t===L2*t2 };
  }
  if (id === "CP012-D2-LOSS-PERCENT-FROM-OUTPUT-COUNT") {
    const [k0,p,n0]=pick(`${seed}:p`,[[5,20,100],[4,25,48],[10,10,900],[6,50,108]] as const);
    const a=s,A=BigInt(k0)*a,n=BigInt(n0),loss=BigInt(p);
    const total=(A*A*A)/(a*a*a);
    return { stem:`A metal cube of side ${A} cm is melted into ${n} cubes of side ${a} cm. What percentage of the metal was lost?`, answer:rational(loss), unit:"%", work:`Without loss, ${total} cubes were possible. Loss% = (${total}-${n})/${total}×100 = ${loss}%.`, verification:(total-n)*100n===loss*total };
  }
  if (id === "CP012-D2-SOURCE-SPHERE-COUNT-WITH-WASTAGE") {
    const [p,R0,h0,r0,n0]=pick(`${seed}:p`,[[20,6,8,3,10],[20,8,9,3,20],[25,10,10,5,8],[20,12,5,3,25]] as const);
    const R=BigInt(R0)*s,h=BigInt(h0)*s,r=BigInt(r0)*s,n=BigInt(n0),ret=BigInt(100-p);
    return { stem:`Identical metal spheres of radius ${r} cm are melted to form a cylinder of radius ${R} cm and height ${h} cm. If ${p}% of the metal is lost, how many source spheres are required?`, answer:rational(n), unit:"spheres", work:`${ret}% of n sphere-volumes equals the cylinder volume, giving n = ${n}.`, verification:ret*n*4n*r*r*r===100n*3n*R*R*h };
  }
  if (id === "CP012-D2-YIELD-PERCENT-FROM-OUTPUT") {
    const [R0,h0,r0,n0,y0]=pick(`${seed}:p`,[[6,8,3,6,75],[8,9,3,12,75],[12,5,3,16,80],[10,10,5,3,50]] as const);
    const R=BigInt(R0)*s,h=BigInt(h0)*s,r=BigInt(r0)*s,n=BigInt(n0),y=BigInt(y0);
    return { stem:`A cylinder of radius ${R} cm and height ${h} cm is melted into ${n} spheres of radius ${r} cm. What percentage of the original metal appears in the spheres?`, answer:rational(y), unit:"%", work:`Yield% = target volume/source volume ×100 = ${y}%.`, verification:4n*n*r*r*r*100n===3n*R*R*h*y };
  }
  if (id === "CP012-D2-METRE-TO-MM-CUBE-COUNT") {
    const [A0,a0,n0]=pick(`${seed}:p`,[[1,100,1000],[1,200,125],[2,250,512],[1,250,64]] as const);
    const A=BigInt(A0),a=BigInt(a0),n=BigInt(n0),sourceMm=A*1000n;
    return { stem:`A metal cube of side ${A} m is recast into identical cubes of side ${a} mm. How many small cubes are formed?`, answer:rational(n), unit:"cubes", work:`${A} m = ${sourceMm} mm, so n = (${sourceMm}/${a})³ = ${n}.`, verification:(sourceMm/a)**3n===n };
  }

  const [r0,h10,h20,H0]=pick(`${seed}:p`,[[3,12,9,15],[4,18,12,22],[5,21,15,26]] as const);
  const r=BigInt(r0)*s,h1=BigInt(h10)*s,h2=BigInt(h20)*s,H=BigInt(H0)*s;
  return { stem:`A solid cylinder of radius ${r} cm and height ${h1} cm and a solid cone of the same radius and height ${h2} cm are melted together into one cylinder of radius ${r} cm. Find the new cylinder's height.`, answer:rational(H), unit:"cm", work:`H = h₁ + h₂/3 = ${h1} + ${h2}/3 = ${H} cm.`, verification:3n*H===3n*h1+h2 };
}

export interface MenCp012DiscoveryQuestion {
  authority: typeof MEN_CP_012_DISCOVERY_V2_AUTHORITY;
  id: MenCp012DiscoveryV2Id;
  clusterHint: MenCp012DiscoveryClusterHint;
  disposition: MenCp012DiscoveryDisposition;
  seed: string;
  stem: string;
  answer: string;
  exactAnswer: ExactRational;
  correctIndex: number;
  options: Array<{ label:"A"|"B"|"C"|"D"; display:string; isCorrect:boolean }>;
  explanation: { steps: Array<{ title:string; body:string }>; traps:string[] };
  verification: { valid:boolean; method:string };
  permanentQlId: null;
  questionStudioDiscoverable: false;
  publiclyPublishable: false;
}

export function generateMenCp012DiscoveryV2(id: MenCp012DiscoveryV2Id, seed: string): MenCp012DiscoveryQuestion {
  const definition=MEN_CP_012_DISCOVERY_V2_DEFINITIONS.find((row)=>row.id===id);
  if(!definition) throw new Error(`Unknown CP012 Wave02 candidate ${id}`);
  const built=build(id,seed);
  const correctIndex=position(seed,id);
  const optionSet=options(built.answer,built.unit,correctIndex);
  if(!built.verification) throw new Error(`${id}/${seed}: exact verification failed.`);
  if(new Set(optionSet.map((o)=>o.display)).size!==4) throw new Error(`${id}/${seed}: duplicate options.`);
  return {
    authority:MEN_CP_012_DISCOVERY_V2_AUTHORITY,id,clusterHint:definition.clusterHint,disposition:definition.disposition,seed,
    stem:built.stem,answer:`${natural(built.answer)} ${built.unit}`,exactAnswer:built.answer,correctIndex,options:optionSet,
    explanation:{steps:[
      {title:"Conserve material volume",body:"Write total usable source volume equal to total target volume."},
      {title:"Use the shape relation",body:built.work},
      {title:"Keep units consistent",body:"Convert linear units before applying powers; apply any loss/yield fraction to material volume."},
      {title:"Check the direction",body:`The required result is ${natural(built.answer)} ${built.unit}.`},
    ],traps:["Recasting conserves volume, not surface area.","Do not reverse source and target volume factors."]},
    verification:{valid:true,method:"constructed exact conservation identity"},permanentQlId:null,questionStudioDiscoverable:false,publiclyPublishable:false,
  };
}
