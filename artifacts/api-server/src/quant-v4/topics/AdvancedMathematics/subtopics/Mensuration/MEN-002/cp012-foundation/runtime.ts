import { add, divide, exactEquals, formatExactPlain, multiply, rational } from "../foundation/exact";
import type { ExactRational } from "../foundation/types";
import { getMenCp012Prototype } from "./registry";
import {
  MEN_CP_012_FOUNDATION_AUTHORITY,
  MEN_CP_012_ID,
  type MenCp012AnswerUnit,
  type MenCp012CanonicalState,
  type MenCp012Explanation,
  type MenCp012PrototypeId,
  type MenCp012QuestionPackage,
} from "./types";

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

function correctIndex(seed: string, prototypeId: MenCp012PrototypeId) {
  const trailing = /(\d+)$/.exec(seed);
  if (trailing) return Number(trailing[1]) % 4;
  return hash(`${prototypeId}:${seed}:position`) % 4;
}

function display(value: ExactRational, unit: MenCp012AnswerUnit) {
  return `${formatExactPlain(value)} ${unit}`;
}

function countDistractors(answer: ExactRational) {
  return [
    add(answer, rational(1)),
    multiply(answer, rational(2)),
    multiply(answer, rational(3)),
  ];
}

function lengthDistractors(answer: ExactRational) {
  return [
    divide(answer, rational(2)),
    multiply(answer, rational(2)),
    multiply(answer, rational(3)),
  ];
}

function makeOptions(
  answer: ExactRational,
  unit: MenCp012AnswerUnit,
  target: "COUNT" | "LENGTH",
  position: number,
) {
  const distractors = target === "COUNT" ? countDistractors(answer) : lengthDistractors(answer);
  let wrong = 0;
  return LABELS.map((label, index) => {
    if (index === position) {
      return { label, value: answer, display: display(answer, unit), isCorrect: true, misconceptionId: null };
    }
    const value = distractors[wrong]!;
    const misconceptionId = ["USE_WRONG_VOLUME_RATIO", "MISS_CONSERVATION_FACTOR", "INVERT_SOURCE_TARGET"][wrong]!;
    wrong += 1;
    return { label, value, display: display(value, unit), isCorrect: false, misconceptionId };
  });
}

function lossRational(percent: number) {
  return rational(percent, 100);
}

function noLoss() {
  return rational(0);
}

type Built = {
  stem: string;
  answer: ExactRational;
  answerUnit: MenCp012AnswerUnit;
  dimensions: Record<string, bigint>;
  lossPercent: ExactRational;
  conservationStatement: string;
  contextId: string;
  explanation: MenCp012Explanation;
  verification: MenCp012QuestionPackage["verification"];
};

function build(prototypeId: MenCp012PrototypeId, seed: string): Built {
  const s = scale(seed);

  if (prototypeId === "MEN-CP012-PROT-SPHERE-TO-SMALL-SPHERES-COUNT") {
    const k = BigInt(pick(`${seed}:ratio`, [2, 3, 4, 5] as const));
    const r = s;
    const R = k * r;
    const answer = rational(k * k * k);
    return {
      stem: `A solid metal sphere of radius ${R} cm is melted and recast into identical solid spheres, each of radius ${r} cm. Assuming no material is lost, how many small spheres are formed?`,
      answer, answerUnit: "spheres", dimensions: { R, r }, lossPercent: noLoss(), contextId: "SPHERE_TO_SPHERES",
      conservationStatement: "(4/3)πR³ = n(4/3)πr³",
      explanation: {
        keyRule: "When a solid is melted and recast without loss, source volume equals total target volume.",
        steps: [
          { title: "Write conservation", body: `Let n be the number of small spheres. Then (4/3)π×${R}³ = n×(4/3)π×${r}³.` },
          { title: "Cancel common factors", body: `The factors (4/3)π cancel, so n = (${R}/${r})³.` },
          { title: "Calculate", body: `n = ${k}³ = ${formatExactPlain(answer)}.` },
          { title: "Check", body: "The total volume of all small spheres is exactly the original sphere's volume." },
        ],
        shortcut: "For sphere-to-sphere recasting, cube the radius ratio.",
        traps: ["Do not compare surface areas.", "Do not use only the linear radius ratio for the count."],
      },
      verification: { valid: exactEquals(answer, rational((R * R * R) / (r * r * r))), method: "cube of radius ratio", reconstructed: `${answer.numerator} small-sphere volumes = source sphere volume` },
    };
  }

  if (prototypeId === "MEN-CP012-PROT-CYLINDER-TO-SPHERES-COUNT") {
    const [r0, h0, a0] = pick(`${seed}:pattern`, [[6,8,3],[8,9,3],[10,10,5],[12,5,3]] as const);
    const R = BigInt(r0) * s, h = BigInt(h0) * s, r = BigInt(a0) * s;
    const answer = divide(rational(3n * R * R * h), rational(4n * r * r * r));
    return {
      stem: `A solid cylinder of radius ${R} cm and height ${h} cm is melted to form identical solid spheres of radius ${r} cm. If there is no wastage, how many spheres can be made?`,
      answer, answerUnit: "spheres", dimensions: { R, h, r }, lossPercent: noLoss(), contextId: "CYLINDER_TO_SPHERES",
      conservationStatement: "πR²h = n(4/3)πr³",
      explanation: {
        keyRule: "Equate the cylinder volume to the combined volume of the spheres.",
        steps: [
          { title: "Set up volumes", body: `π×${R}²×${h} = n×(4/3)π×${r}³.` },
          { title: "Cancel π", body: `n = 3×${R}²×${h} / (4×${r}³).` },
          { title: "Calculate", body: `n = ${formatExactPlain(answer)}.` },
          { title: "Check", body: "Multiplying one small sphere's volume by this count reconstructs the cylinder volume." },
        ],
        shortcut: "Cancel π before multiplying the numbers.",
        traps: ["The sphere volume contains 4/3.", "Use radius, not diameter, in both volume formulae."],
      },
      verification: { valid: answer.denominator === 1n, method: "exact π-coefficient conservation", reconstructed: `n = ${formatExactPlain(answer)}` },
    };
  }

  if (prototypeId === "MEN-CP012-PROT-CUBE-TO-SMALL-CUBES-COUNT") {
    const k = BigInt(pick(`${seed}:ratio`, [2,3,4,5] as const));
    const a = s, A = k * a;
    const answer = rational(k * k * k);
    return {
      stem: `A solid metal cube of side ${A} cm is melted and recast into identical cubes of side ${a} cm. How many small cubes are obtained if no metal is lost?`,
      answer, answerUnit: "cubes", dimensions: { A, a }, lossPercent: noLoss(), contextId: "CUBE_TO_CUBES",
      conservationStatement: "A³ = na³",
      explanation: {
        keyRule: "The count equals source volume divided by one target cube's volume.",
        steps: [
          { title: "Write conservation", body: `${A}³ = n×${a}³.` },
          { title: "Form the ratio", body: `n = (${A}/${a})³.` },
          { title: "Calculate", body: `n = ${k}³ = ${formatExactPlain(answer)}.` },
          { title: "Check", body: "The small-cube volumes add back to the original cube volume." },
        ],
        shortcut: "Cube the side ratio when both source and target are cubes.",
        traps: ["Do not square the side ratio.", "Recasting conserves volume, not total surface area."],
      },
      verification: { valid: exactEquals(answer, rational((A*A*A)/(a*a*a))), method: "cube-volume ratio", reconstructed: `${answer.numerator}×${a}³ = ${A}³` },
    };
  }

  if (prototypeId === "MEN-CP012-PROT-CYLINDER-TO-CONE-HEIGHT") {
    const [R0, h0, r0] = pick(`${seed}:pattern`, [[3,8,3],[4,5,2],[6,7,3]] as const);
    const R=BigInt(R0)*s, h=BigInt(h0)*s, r=BigInt(r0)*s;
    const answer = divide(rational(3n*R*R*h), rational(r*r));
    return {
      stem: `A solid cylinder of radius ${R} cm and height ${h} cm is melted and recast as a cone of radius ${r} cm. Find the cone's height, assuming no loss of material.`,
      answer, answerUnit:"cm", dimensions:{R,h,r}, lossPercent:noLoss(), contextId:"CYLINDER_TO_CONE",
      conservationStatement:"πR²h = (1/3)πr²H",
      explanation:{ keyRule:"Equate the original cylinder volume to the new cone volume.", steps:[
        {title:"Write conservation",body:`π×${R}²×${h} = (1/3)π×${r}²×H.`},
        {title:"Cancel π and rearrange",body:`H = 3×${R}²×${h}/${r}².`},
        {title:"Calculate",body:`H = ${formatExactPlain(answer)} cm.`},
        {title:"Check",body:"Using this height in the cone formula gives the original cylinder volume."}],
        shortcut:"The cone's one-third factor moves across as a factor of 3.", traps:["Do not equate surface areas.","Do not forget the cone's 1/3 factor."]},
      verification:{valid:answer.denominator===1n,method:"exact cylinder-to-cone volume conservation",reconstructed:`H=${formatExactPlain(answer)} cm`}
    };
  }

  if (prototypeId === "MEN-CP012-PROT-CONE-TO-CYLINDER-HEIGHT") {
    const [R0,H0,r0]=pick(`${seed}:pattern`,[[6,9,3],[4,12,4],[6,12,2]] as const);
    const R=BigInt(R0)*s,H=BigInt(H0)*s,r=BigInt(r0)*s;
    const answer=divide(rational(R*R*H),rational(3n*r*r));
    return {stem:`A solid cone of radius ${R} cm and height ${H} cm is melted and recast into a cylinder of radius ${r} cm. Find the cylinder's height if no material is lost.`,answer,answerUnit:"cm",dimensions:{R,H,r},lossPercent:noLoss(),contextId:"CONE_TO_CYLINDER",conservationStatement:"(1/3)πR²H = πr²h",
      explanation:{keyRule:"Conserve volume from the cone to the cylinder.",steps:[{title:"Write conservation",body:`(1/3)π×${R}²×${H} = π×${r}²×h.`},{title:"Cancel π",body:`h = ${R}²×${H}/(3×${r}²).`},{title:"Calculate",body:`h = ${formatExactPlain(answer)} cm.`},{title:"Check",body:"The reconstructed cylinder volume equals the cone volume."}],shortcut:"Cancel π first and keep the cone's one-third factor.",traps:["Do not multiply by 3 when moving from cone to cylinder.","Use squared radii."]},verification:{valid:answer.denominator===1n,method:"exact cone-to-cylinder volume conservation",reconstructed:`h=${formatExactPlain(answer)} cm`}};
  }

  if (prototypeId === "MEN-CP012-PROT-CUBOID-TO-CUBE-SIDE") {
    const [l0,w0,h0,a0]=pick(`${seed}:pattern`,[[9,8,3,6],[16,4,8,8],[20,10,5,10]] as const);
    const l=BigInt(l0)*s,w=BigInt(w0)*s,h=BigInt(h0)*s,a=BigInt(a0)*s;
    const answer=rational(a);
    return {stem:`A metal cuboid measuring ${l} cm × ${w} cm × ${h} cm is melted and recast into a single cube. Find the side of the cube.`,answer,answerUnit:"cm",dimensions:{l,w,h},lossPercent:noLoss(),contextId:"CUBOID_TO_CUBE",conservationStatement:"lwh = a³",
      explanation:{keyRule:"The cube must have the same volume as the cuboid.",steps:[{title:"Find source volume",body:`V = ${l}×${w}×${h} = ${l*w*h} cm³.`},{title:"Set the cube equation",body:`a³ = ${l*w*h}.`},{title:"Take the cube root",body:`a = ${a} cm.`},{title:"Check",body:`${a}³ = ${l*w*h}, so volume is conserved.`}],shortcut:"Multiply the cuboid dimensions first; the answer is the exact cube root.",traps:["Take a cube root, not a square root.","Do not use cuboid surface area."]},verification:{valid:a*a*a===l*w*h,method:"perfect-cube volume reconstruction",reconstructed:`${a}³=${l*w*h}`}};
  }

  if (prototypeId === "MEN-CP012-PROT-SPHERE-TO-CYLINDER-HEIGHT") {
    const [R0,r0]=pick(`${seed}:pattern`,[[3,3],[6,3],[6,6],[9,3]] as const);
    const R=BigInt(R0)*s,r=BigInt(r0)*s;
    const answer=divide(rational(4n*R*R*R),rational(3n*r*r));
    return {stem:`A solid sphere of radius ${R} cm is melted and recast as a solid cylinder of radius ${r} cm. Find the height of the cylinder.`,answer,answerUnit:"cm",dimensions:{R,r},lossPercent:noLoss(),contextId:"SPHERE_TO_CYLINDER",conservationStatement:"(4/3)πR³ = πr²h",
      explanation:{keyRule:"Equate sphere volume and cylinder volume.",steps:[{title:"Write conservation",body:`(4/3)π×${R}³ = π×${r}²×h.`},{title:"Cancel π",body:`h = 4×${R}³/(3×${r}²).`},{title:"Calculate",body:`h = ${formatExactPlain(answer)} cm.`},{title:"Check",body:"Substitution reproduces the sphere volume exactly."}],shortcut:"Cancel π before evaluating the powers.",traps:["Sphere volume uses 4/3.","Do not compare surface areas."]},verification:{valid:answer.denominator===1n,method:"sphere-to-cylinder π cancellation",reconstructed:`h=${formatExactPlain(answer)} cm`}};
  }

  if (prototypeId === "MEN-CP012-PROT-CYLINDER-TO-WIRE-LENGTH") {
    const [R0,H0,r0]=pick(`${seed}:pattern`,[[5,20,1],[6,25,2],[8,18,2],[9,20,3]] as const);
    const R=BigInt(R0)*s,H=BigInt(H0)*s,r=BigInt(r0)*s;
    const answer=divide(rational(R*R*H),rational(r*r));
    return {stem:`A cylindrical metal rod of radius ${R} cm and length ${H} cm is drawn into a cylindrical wire of radius ${r} cm. Assuming no loss of metal, find the length of the wire.`,answer,answerUnit:"cm",dimensions:{R,H,r},lossPercent:noLoss(),contextId:"ROD_TO_WIRE",conservationStatement:"πR²H = πr²L",
      explanation:{keyRule:"Drawing changes length and cross-section but preserves volume.",steps:[{title:"Write conservation",body:`π×${R}²×${H} = π×${r}²×L.`},{title:"Cancel π",body:`L = ${R}²×${H}/${r}².`},{title:"Calculate",body:`L = ${formatExactPlain(answer)} cm.`},{title:"Check",body:"The smaller wire cross-section is offset by the longer length."}],shortcut:"Wire length varies inversely with the square of its radius.",traps:["Use radius squared, not radius alone.","Do not preserve surface area."]},verification:{valid:answer.denominator===1n,method:"cross-section × length conservation",reconstructed:`π${R}²×${H}=π${r}²×${formatExactPlain(answer)}`}};
  }

  if (prototypeId === "MEN-CP012-PROT-ROD-TO-WIRE-METRE-CONVERSION") {
    const [R0,H0,r0]=pick(`${seed}:pattern`,[[5,400,1],[6,500,2],[8,625,2],[9,800,3]] as const);
    const R=BigInt(R0)*s,H=BigInt(H0)*s,r=BigInt(r0)*s;
    const lengthCm=divide(rational(R*R*H),rational(r*r));
    const answer=divide(lengthCm,rational(100));
    return {stem:`A cylindrical metal rod of radius ${R} cm and length ${H} cm is drawn into a wire of radius ${r} cm. Find the wire's length in metres, assuming no loss.`,answer,answerUnit:"m",dimensions:{R,H,r},lossPercent:noLoss(),contextId:"ROD_TO_WIRE_METRES",conservationStatement:"πR²H = πr²L, then 100 cm = 1 m",
      explanation:{keyRule:"Conserve volume first in centimetres, then convert the final length to metres.",steps:[{title:"Write conservation",body:`L = ${R}²×${H}/${r}² = ${formatExactPlain(lengthCm)} cm.`},{title:"Convert units",body:`100 cm = 1 m.`},{title:"Calculate",body:`L = ${formatExactPlain(lengthCm)}/100 = ${formatExactPlain(answer)} m.`},{title:"Check",body:"The conversion is applied only after the geometric conservation step."}],shortcut:"Keep one length unit through the volume equation; convert only the final answer.",traps:["Do not mix metres and centimetres inside the squared-radius calculation.","Do not divide the radius by 100 unless the whole equation is converted consistently."]},verification:{valid:exactEquals(multiply(answer,rational(100)),lengthCm),method:"volume conservation plus cm-to-m conversion",reconstructed:`${formatExactPlain(answer)} m = ${formatExactPlain(lengthCm)} cm`}};
  }

  if (prototypeId === "MEN-CP012-PROT-TWO-SPHERES-TO-CYLINDER-HEIGHT") {
    const [a0,b0,r0]=pick(`${seed}:pattern`,[[3,6,3],[3,3,2],[6,6,4],[3,6,6]] as const);
    const a=BigInt(a0)*s,b=BigInt(b0)*s,r=BigInt(r0)*s;
    const answer=divide(rational(4n*(a*a*a+b*b*b)),rational(3n*r*r));
    return {stem:`Two solid metal spheres of radii ${a} cm and ${b} cm are melted together and recast into one cylinder of radius ${r} cm. Find the cylinder's height.`,answer,answerUnit:"cm",dimensions:{a,b,r},lossPercent:noLoss(),contextId:"TWO_SPHERES_TO_CYLINDER",conservationStatement:"(4/3)π(a³+b³) = πr²h",
      explanation:{keyRule:"Add all source volumes before equating them to the target volume.",steps:[{title:"Combine source material",body:`Total volume = (4/3)π(${a}³+${b}³).`},{title:"Set target volume",body:`(4/3)π(${a}³+${b}³) = π×${r}²×h.`},{title:"Calculate",body:`h = ${formatExactPlain(answer)} cm.`},{title:"Check",body:"The target cylinder contains the material from both spheres together."}],shortcut:"For combined sources, sum their volumes before cancelling common π factors.",traps:["Do not average the source radii.","Do not forget either source sphere."]},verification:{valid:answer.denominator===1n,method:"sum-of-source-volume conservation",reconstructed:`h=${formatExactPlain(answer)} cm`}};
  }

  if (prototypeId === "MEN-CP012-PROT-CUBE-WASTAGE-TO-SMALL-CUBES") {
    const [k0,p]=pick(`${seed}:pattern`,[[5,20],[4,25],[10,10],[6,50]] as const);
    const a=s,A=BigInt(k0)*a, retained=100-p;
    const answer=rational(BigInt(retained)*BigInt(k0*k0*k0),100);
    return {stem:`A metal cube of side ${A} cm is melted and recast into cubes of side ${a} cm. During melting, ${p}% of the metal is lost. How many complete small cubes can be formed?`,answer,answerUnit:"cubes",dimensions:{A,a},lossPercent:lossRational(p),contextId:"CUBE_WASTAGE_TO_CUBES",conservationStatement:`usable volume = ${retained}% of A³ = na³`,
      explanation:{keyRule:"Apply material loss to the source volume before dividing by one target solid's volume.",steps:[{title:"Find source-volume ratio",body:`Without loss, the cube-volume ratio is (${A}/${a})³ = ${k0*k0*k0}.`},{title:"Apply retained material",body:`Only ${retained}% of the metal remains.`},{title:"Calculate",body:`n = ${retained}/100 × ${k0*k0*k0} = ${formatExactPlain(answer)} cubes.`},{title:"Check",body:"The target cubes use only the retained material, not the lost fraction."}],shortcut:"Count without loss first, then multiply by the retained percentage when all target cubes are identical.",traps:["Use retained percentage, not loss percentage.","Apply loss to volume/material, not to side length."]},verification:{valid:answer.denominator===1n,method:"retained-volume ratio",reconstructed:`${formatExactPlain(answer)} target cube volumes = ${retained}% of source volume`}};
  }

  if (prototypeId === "MEN-CP012-PROT-WASTAGE-INVERSE-CYLINDER-HEIGHT") {
    const [p,R0,r0,n0,H0]=pick(`${seed}:pattern`,[[20,5,1,150,10],[25,4,2,18,16],[10,6,3,18,20],[50,3,1,27,8]] as const);
    const R=BigInt(R0)*s,r=BigInt(r0)*s,n=BigInt(n0),H=BigInt(H0)*s, retained=100-p;
    const answer=rational(H);
    const reconstructed=divide(rational(n*4n*r*r*r*100n),rational(3n*R*R*BigInt(retained)));
    return {stem:`A solid metal cylinder of radius ${R} cm is melted to make ${n} identical spheres, each of radius ${r} cm. If ${p}% of the metal is lost during melting, find the original cylinder's height.`,answer,answerUnit:"cm",dimensions:{R,r,n},lossPercent:lossRational(p),contextId:"WASTAGE_INVERSE_HEIGHT",conservationStatement:`${retained}% of πR²H = n(4/3)πr³`,
      explanation:{keyRule:"The retained fraction of the source volume—not the full source volume—becomes the target spheres.",steps:[{title:"Write retained-volume equation",body:`${retained}/100 × π×${R}²×H = ${n}×(4/3)π×${r}³.`},{title:"Cancel π and isolate H",body:`H = ${n}×4×${r}³×100 / (3×${R}²×${retained}).`},{title:"Calculate",body:`H = ${formatExactPlain(answer)} cm.`},{title:"Check",body:`After ${p}% loss, the retained cylinder material exactly equals the ${n} sphere volumes.`}],shortcut:"Put the retained percentage on the source side before rearranging.",traps:["Do not multiply the target volume by the loss percentage.","Do not use ${p}% as the retained fraction.".replace("${p}",String(p))]},verification:{valid:exactEquals(reconstructed,answer),method:"inverse retained-volume reconstruction",reconstructed:`H=${formatExactPlain(reconstructed)} cm`}};
  }

  if (prototypeId === "MEN-CP012-PROT-HOLLOW-CYLINDER-TO-SOLID-CYLINDER") {
    const [R0,r0,H0,a0,h0]=pick(`${seed}:pattern`,[[5,3,10,2,5],[7,5,12,2,9],[6,2,9,2,6],[10,8,10,3,4]] as const);
    const R=BigInt(R0)*s,r=BigInt(r0)*s,H=BigInt(H0)*s,a=BigInt(a0)*s,h=BigInt(h0)*s;
    const answer=divide(rational((R*R-r*r)*H),rational(a*a*h));
    return {stem:`A hollow metal cylinder has outer radius ${R} cm, inner radius ${r} cm and height ${H} cm. It is melted and recast into identical solid cylinders of radius ${a} cm and height ${h} cm. How many solid cylinders are formed?`,answer,answerUnit:"cylinders",dimensions:{R,r,H,a,h},lossPercent:noLoss(),contextId:"HOLLOW_TO_SOLID_CYLINDERS",conservationStatement:"π(R²−r²)H = nπa²h",
      explanation:{keyRule:"For a hollow source, conserve only the material volume between the outer and inner surfaces.",steps:[{title:"Find material volume",body:`Source metal volume = π(${R}²−${r}²)×${H}.`},{title:"Set target equation",body:`π(${R}²−${r}²)×${H} = nπ×${a}²×${h}.`},{title:"Calculate",body:`n = ${formatExactPlain(answer)}.`},{title:"Check",body:"The empty core is excluded; only shell material is recast."}],shortcut:"Use outer-cylinder volume minus inner-cylinder volume before dividing by one target volume.",traps:["Do not use the full outer cylinder as material.","This is a volume-of-material problem, not a surface-area problem."]},verification:{valid:answer.denominator===1n,method:"hollow material-volume conservation",reconstructed:`n=${formatExactPlain(answer)}`}};
  }

  if (prototypeId === "MEN-CP012-PROT-SLAB-TO-THIN-SHEET-LENGTH") {
    const [L0,W0,t0,t20]=pick(`${seed}:pattern`,[[50,20,4,1],[60,25,3,1],[80,30,5,2],[90,40,6,3]] as const);
    const L=BigInt(L0)*s,W=BigInt(W0)*s,t=BigInt(t0)*s,t2=BigInt(t20)*s;
    const answer=divide(rational(L*t),rational(t2));
    return {stem:`A rectangular metal slab is ${L} cm long, ${W} cm wide and ${t} cm thick. It is rolled into a sheet of the same width but thickness ${t2} cm. Assuming no loss, find the new sheet length.`,answer,answerUnit:"cm",dimensions:{L,W,t,t2},lossPercent:noLoss(),contextId:"SLAB_TO_SHEET",conservationStatement:"L×W×t = L₂×W×t₂",
      explanation:{keyRule:"Rolling changes dimensions but preserves the slab's volume.",steps:[{title:"Write conservation",body:`${L}×${W}×${t} = L₂×${W}×${t2}.`},{title:"Cancel unchanged width",body:`L₂ = ${L}×${t}/${t2}.`},{title:"Calculate",body:`L₂ = ${formatExactPlain(answer)} cm.`},{title:"Check",body:"The reduction in thickness is balanced by the increase in length."}],shortcut:"When width is unchanged, length × thickness stays constant.",traps:["Do not conserve area when thickness changes.","Cancel only dimensions that are genuinely unchanged."]},verification:{valid:answer.denominator===1n,method:"rectangular volume conservation",reconstructed:`${L}×${W}×${t}=${formatExactPlain(answer)}×${W}×${t2}`}};
  }

  if (prototypeId === "MEN-CP012-PROT-CUBIC-METRE-TO-CM-CUBES") {
    const [A0,a0]=pick(`${seed}:pattern`,[[1,10],[1,20],[1,25],[2,50]] as const);
    const A=BigInt(A0), a=BigInt(a0);
    const sourceSideCm=A*100n;
    const answer=rational((sourceSideCm*sourceSideCm*sourceSideCm)/(a*a*a));
    return {stem:`A solid metal cube of side ${A} m is melted and recast into identical cubes of side ${a} cm. How many small cubes are formed?`,answer,answerUnit:"cubes",dimensions:{A,a},lossPercent:noLoss(),contextId:"M_TO_CM_RECAST",conservationStatement:"convert metres to centimetres, then use volume ratio",
      explanation:{keyRule:"Convert all linear dimensions to one unit before cubing them.",steps:[{title:"Convert the source side",body:`${A} m = ${sourceSideCm} cm.`},{title:"Form the volume ratio",body:`n = (${sourceSideCm}/${a})³.`},{title:"Calculate",body:`n = ${formatExactPlain(answer)} cubes.`},{title:"Check",body:"Both source and target volumes are now expressed in cm³."}],shortcut:"Convert the side first, then cube the ratio; do not convert cubic units with a linear factor.",traps:["1 m³ is not 100 cm³.","Apply the conversion before taking the cube." ]},verification:{valid:answer.denominator===1n,method:"linear-unit conversion then cube ratio",reconstructed:`(${sourceSideCm}/${a})³=${formatExactPlain(answer)}`}};
  }

  const [n0,r0,h0,R0]=pick(`${seed}:pattern`,[[6,3,9,3],[9,4,12,4],[12,5,6,5],[8,3,12,4]] as const);
  const n=BigInt(n0),r=BigInt(r0)*s,h=BigInt(h0)*s,R=BigInt(R0)*s;
  const answer=divide(rational(n*r*r*h),rational(3n*R*R));
  return {stem:`${n} identical solid cones, each of radius ${r} cm and height ${h} cm, are melted together and recast into one cylinder of radius ${R} cm. Find the cylinder's height.`,answer,answerUnit:"cm",dimensions:{n,r,h,R},lossPercent:noLoss(),contextId:"MANY_CONES_TO_CYLINDER",conservationStatement:"n(1/3)πr²h = πR²H",
    explanation:{keyRule:"Multiply one cone's volume by the number of cones, then equate to the cylinder volume.",steps:[{title:"Combine source volumes",body:`Total source volume = ${n}×(1/3)π×${r}²×${h}.`},{title:"Set target volume",body:`${n}×(1/3)π×${r}²×${h} = π×${R}²×H.`},{title:"Calculate",body:`H = ${formatExactPlain(answer)} cm.`},{title:"Check",body:"The one cylinder contains the material from all source cones."}],shortcut:"Cancel π and combine the count with the cone's one-third factor.",traps:["Do not use just one cone's volume.","Keep the cone's 1/3 factor."]},verification:{valid:answer.denominator===1n,method:"many-source cone volume conservation",reconstructed:`H=${formatExactPlain(answer)} cm`}};
}

export function generateMenCp012Question(prototypeId: MenCp012PrototypeId, seed: string): MenCp012QuestionPackage {
  const definition = getMenCp012Prototype(prototypeId);
  const built = build(prototypeId, seed);
  const position = correctIndex(seed, prototypeId);
  const options = makeOptions(built.answer, built.answerUnit, definition.target, position);
  const state: MenCp012CanonicalState = {
    packageId: "MEN-002",
    canonicalProblemId: MEN_CP_012_ID,
    permanentQlId: null,
    prototypeId,
    solveMode: definition.solveMode,
    seed,
    target: definition.target,
    difficulty: definition.difficulty,
    dimensions: built.dimensions,
    lossPercent: built.lossPercent,
    exactAnswer: built.answer,
    answerUnit: built.answerUnit,
    conservationStatement: built.conservationStatement,
    contextId: built.contextId,
  };
  const checks = [
    { name: "positive-answer", passed: built.answer.numerator > 0n, message: "Answer must be positive." },
    { name: "four-options", passed: options.length === 4, message: "Exactly four options are required." },
    { name: "unique-options", passed: new Set(options.map((option) => option.display)).size === 4, message: "Option displays must be unique." },
    { name: "one-correct", passed: options.filter((option) => option.isCorrect).length === 1, message: "Exactly one option must be correct." },
    { name: "answer-position", passed: options[position]?.isCorrect === true, message: "Correct option index must match scheduler." },
    { name: "verification", passed: built.verification.valid, message: "Independent conservation check must pass." },
  ];
  return {
    authority: MEN_CP_012_FOUNDATION_AUTHORITY,
    packageId: "MEN-002",
    canonicalProblemId: MEN_CP_012_ID,
    permanentQlId: null,
    prototypeId,
    solveMode: definition.solveMode,
    language: "en",
    seed,
    difficulty: definition.difficulty,
    target: definition.target,
    stem: built.stem,
    options,
    correctIndex: position,
    answer: display(built.answer, built.answerUnit),
    exactAnswer: built.answer,
    answerUnit: built.answerUnit,
    explanation: built.explanation,
    state,
    verification: built.verification,
    validation: { valid: checks.every((check) => check.passed), checks },
    reviewStatus: "UNREVIEWED",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
