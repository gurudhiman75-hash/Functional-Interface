export const MEN_CP_012_SATURATION_V3_AUTHORITY = "MEN-CP012-SATURATION-WAVE-03-V1" as const;

export type MenCp012SaturationV3Id =
  | "V3-SPHERE-TO-HOLLOW-TUBE-THICKNESS"
  | "V3-SPHERE-TO-HOLLOW-TUBE-LENGTH"
  | "V3-SPHERE-TO-WIRE-RADIUS-MIXED-UNITS"
  | "V3-MANY-SPHERES-TO-CYLINDER-RELATIVE-N"
  | "V3-SPHERE-TO-CYLINDER-RATIO-H-R"
  | "V3-SPHERE-TO-CYLINDER-DECIMAL-HEIGHT"
  | "V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO"
  | "V3-UNEQUAL-SPHERES-TO-SPHERE-RADIUS"
  | "V3-UNEQUAL-SPHERES-TO-SPHERE-SURFACE-DECREASE"
  | "V3-COINS-DIAMETER-THICKNESS-TO-CUBOID-COUNT"
  | "V3-COINS-CIRCUMFERENCE-THICKNESS-TO-CUBOID-COUNT"
  | "V3-HOLLOW-SPHERE-TO-SOLID-CYLINDER-HEIGHT";

export type MenCp012SaturationCluster =
  | "HOLLOW_TARGET_CONSERVATION"
  | "WIRE_DRAWING_CONSERVATION"
  | "COUNT_FROM_VOLUME_RATIO"
  | "INVERSE_DIMENSION_FROM_CONSERVATION"
  | "COMBINED_SOURCE_SOLIDS"
  | "RECAST_THEN_SECONDARY_MEASURE"
  | "UNIT_CONVERSION"
  | "HOLLOW_SOURCE_CONSERVATION";

export type MenCp012SaturationDisposition =
  | "RETAIN_FOR_MERGE_SPLIT"
  | "MERGE_AS_REPRESENTATION"
  | "REASSIGN_BOUNDARY_REVIEW";

export interface MenCp012SaturationDefinition {
  id: MenCp012SaturationV3Id;
  cluster: MenCp012SaturationCluster;
  disposition: MenCp012SaturationDisposition;
  evidence: string;
  reasoning: string;
}

export const MEN_CP_012_SATURATION_V3_DEFINITIONS: readonly MenCp012SaturationDefinition[] = [
  { id:"V3-SPHERE-TO-HOLLOW-TUBE-THICKNESS", cluster:"HOLLOW_TARGET_CONSERVATION", disposition:"RETAIN_FOR_MERGE_SPLIT", evidence:"SSC CGL Tier 2 2017; SSC MTS 2024 pattern", reasoning:"Recasting is decisive, then hollow-cylinder inner radius/thickness is recovered." },
  { id:"V3-SPHERE-TO-HOLLOW-TUBE-LENGTH", cluster:"HOLLOW_TARGET_CONSERVATION", disposition:"RETAIN_FOR_MERGE_SPLIT", evidence:"SSC MTS 2020 pattern", reasoning:"Same hollow target material relation with length as the unknown; merge/split with thickness must be tested." },
  { id:"V3-SPHERE-TO-WIRE-RADIUS-MIXED-UNITS", cluster:"WIRE_DRAWING_CONSERVATION", disposition:"MERGE_AS_REPRESENTATION", evidence:"SSC MTS 2020 pattern", reasoning:"Source shape differs from Wave 01 rod-to-wire, but decisive reasoning remains volume conservation plus wire radius recovery and unit conversion." },
  { id:"V3-MANY-SPHERES-TO-CYLINDER-RELATIVE-N", cluster:"COUNT_FROM_VOLUME_RATIO", disposition:"MERGE_AS_REPRESENTATION", evidence:"SSC CGL Tier 2 2019 pattern", reasoning:"Symbolic relative dimensions produce the same count-by-volume identity." },
  { id:"V3-SPHERE-TO-CYLINDER-RATIO-H-R", cluster:"INVERSE_DIMENSION_FROM_CONSERVATION", disposition:"MERGE_AS_REPRESENTATION", evidence:"SSC CHSL 2025 pattern", reasoning:"Ratio output is a representation of target-dimension recovery after conservation." },
  { id:"V3-SPHERE-TO-CYLINDER-DECIMAL-HEIGHT", cluster:"INVERSE_DIMENSION_FROM_CONSERVATION", disposition:"MERGE_AS_REPRESENTATION", evidence:"SSC CPO 2019 pattern", reasoning:"Adds explicit one-decimal-place approximation discipline to an existing inverse-height identity." },
  { id:"V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO", cluster:"INVERSE_DIMENSION_FROM_CONSERVATION", disposition:"RETAIN_FOR_MERGE_SPLIT", evidence:"SSC CPO pattern", reasoning:"Requires square-root base-radius recovery and then a requested diameter:height ratio." },
  { id:"V3-UNEQUAL-SPHERES-TO-SPHERE-RADIUS", cluster:"COMBINED_SOURCE_SOLIDS", disposition:"RETAIN_FOR_MERGE_SPLIT", evidence:"SSC CGL 2017 precursor pattern", reasoning:"Unequal source volumes must be summed before cube-root target recovery." },
  { id:"V3-UNEQUAL-SPHERES-TO-SPHERE-SURFACE-DECREASE", cluster:"RECAST_THEN_SECONDARY_MEASURE", disposition:"RETAIN_FOR_MERGE_SPLIT", evidence:"SSC CGL 2017 pattern", reasoning:"Two-stage reasoning: volume conservation determines new radius, then old/new surface areas are compared." },
  { id:"V3-COINS-DIAMETER-THICKNESS-TO-CUBOID-COUNT", cluster:"UNIT_CONVERSION", disposition:"MERGE_AS_REPRESENTATION", evidence:"Common competitive-exam coin-to-cuboid pattern", reasoning:"Coin is a thin cylinder; thickness conversion is embedded in count-by-volume conservation." },
  { id:"V3-COINS-CIRCUMFERENCE-THICKNESS-TO-CUBOID-COUNT", cluster:"UNIT_CONVERSION", disposition:"RETAIN_FOR_MERGE_SPLIT", evidence:"Competitive-exam coin recasting pattern", reasoning:"Adds circumference-to-radius recovery before unit conversion and volume count." },
  { id:"V3-HOLLOW-SPHERE-TO-SOLID-CYLINDER-HEIGHT", cluster:"HOLLOW_SOURCE_CONSERVATION", disposition:"REASSIGN_BOUNDARY_REVIEW", evidence:"Hollow-shell recasting pattern in government exams", reasoning:"CP-011 owns hollow geometry, but CP-012 likely owns this when material recasting is decisive; boundary must be frozen explicitly." },
] as const;

const LABELS = ["A","B","C","D"] as const;

function hash(text:string) {
  let h=2166136261>>>0;
  for(const c of text){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}
  return h>>>0;
}
function pick<T>(seed:string, values:readonly T[]):T { return values[hash(seed)%values.length]!; }
function scale(seed:string){ return 1+(hash(`${seed}:scale`)%4); }
function correctIndex(seed:string,id:MenCp012SaturationV3Id){const m=/(\d+)$/.exec(seed);return m?Number(m[1])%4:hash(`${id}:${seed}:pos`)%4;}
function tidy(n:number,digits=4){return n.toFixed(digits).replace(/0+$/,'').replace(/\.$/,'');}
function gcd(a:number,b:number){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}

interface Built {
  stem:string;
  answer:string;
  distractors:[string,string,string];
  work:string;
  verification:boolean;
  approximation:boolean;
}

function build(id:MenCp012SaturationV3Id, seed:string):Built {
  const k=scale(seed);

  if(id==="V3-SPHERE-TO-HOLLOW-TUBE-THICKNESS"){
    const [s0,R0,ri0,L0]=pick(`${seed}:p`,[[3,5,4,4],[6,10,8,8],[9,15,12,12]] as const);
    const s=s0*k,R=R0*k,ri=ri0*k,L=L0*k,t=R-ri;
    return {stem:`A solid metal sphere of radius ${s} cm is melted and recast into a hollow cylindrical tube of length ${L} cm and external radius ${R} cm. Assuming no loss of material, find the thickness of the tube.`,answer:`${t} cm`,distractors:[`${ri} cm`,`${2*t} cm`,`${Math.max(1,t+k)} cm`],work:`(4/3)π(${s})³ = π[${R}²-r²]${L}. This gives inner radius r = ${ri} cm, so thickness = ${R}-${ri} = ${t} cm.`,verification:4*s*s*s===3*L*(R*R-ri*ri),approximation:false};
  }
  if(id==="V3-SPHERE-TO-HOLLOW-TUBE-LENGTH"){
    const [s0,R0,ri0,L0]=pick(`${seed}:p`,[[3,5,4,4],[6,10,8,8],[9,15,12,12]] as const);
    const s=s0*k,R=R0*k,ri=ri0*k,L=L0*k;
    return {stem:`A solid metal sphere of radius ${s} cm is melted and recast into a hollow cylindrical shell with outer radius ${R} cm and inner radius ${ri} cm. Find the length of the shell if no material is lost.`,answer:`${L} cm`,distractors:[`${L/2} cm`,`${2*L} cm`,`${3*L} cm`],work:`L = [4${s}³/3]/(${R}²-${ri}²) = ${L} cm.`,verification:4*s*s*s===3*L*(R*R-ri*ri),approximation:false};
  }
  if(id==="V3-SPHERE-TO-WIRE-RADIUS-MIXED-UNITS"){
    const pattern=pick(`${seed}:p`,[
      {S:21.6,Lm:259.2,r:0.72},
      {S:15,Lm:180,r:0.5},
      {S:12,Lm:36,r:0.8},
    ] as const);
    const S=pattern.S*k,Lm=pattern.Lm*k,r=pattern.r*k,Lcm=Lm*100;
    const calc=Math.sqrt((4*S*S*S)/(3*Lcm));
    return {stem:`A solid metal sphere of radius ${tidy(S)} cm is melted and drawn into a cylindrical wire ${tidy(Lm)} m long. Find the radius of the wire.`,answer:`${tidy(r)} cm`,distractors:[`${tidy(r/2)} cm`,`${tidy(r*2)} cm`,`${tidy(r*3)} cm`],work:`Convert ${tidy(Lm)} m to ${tidy(Lcm)} cm, then (4/3)π(${tidy(S)})³ = πr²(${tidy(Lcm)}), giving r = ${tidy(r)} cm.`,verification:Math.abs(calc-r)<1e-9,approximation:false};
  }
  if(id==="V3-MANY-SPHERES-TO-CYLINDER-RELATIVE-N"){
    const [m,q,N]=pick(`${seed}:p`,[[3,4,27],[2,3,9],[4,3,36],[5,4,75]] as const);
    return {stem:`N identical solid spheres each have radius r. They are melted to form a cylinder of radius ${m}r and height ${q}r. Find N.`,answer:`${N}`,distractors:[`${Math.max(1,N/3)}`,`${N*2}`,`${N*3}`],work:`N(4/3)πr³ = π(${m}r)²(${q}r), so N = 3×${m}²×${q}/4 = ${N}.`,verification:4*N===3*m*m*q,approximation:false};
  }
  if(id==="V3-SPHERE-TO-CYLINDER-RATIO-H-R"){
    const m=pick(`${seed}:m`,[1,2,4] as const);
    const hNum=4,hDen=3*m*m;
    const ans=ratio(hNum,hDen);
    return {stem:`A solid sphere of radius r is melted and recast into a cylinder whose radius is ${m===1?'r':`${m}r`}. If the cylinder height is h, find h : r.`,answer:ans,distractors:[ratio(hDen,hNum),ratio(4,3*m),ratio(1,m)],work:`(4/3)πr³ = π(${m}r)²h, hence h/r = 4/(3×${m}²), so h:r = ${ans}.`,verification:true,approximation:false};
  }
  if(id==="V3-SPHERE-TO-CYLINDER-DECIMAL-HEIGHT"){
    const p=pick(`${seed}:p`,[
      {S:8.4,R:12,h:5.5},
      {S:6.3,R:9,h:4.1},
      {S:10.5,R:14,h:7.9},
    ] as const);
    const S=p.S*k,R=p.R*k;
    const exact=(4*S*S*S)/(3*R*R),rounded=Math.round(exact*10)/10;
    return {stem:`A solid metallic sphere of radius ${tidy(S)} cm is melted and recast into a cylinder of radius ${tidy(R)} cm. Find the cylinder height correct to one decimal place.`,answer:`${rounded.toFixed(1)} cm`,distractors:[`${(rounded-0.5).toFixed(1)} cm`,`${(rounded+0.5).toFixed(1)} cm`,`${(rounded+1).toFixed(1)} cm`],work:`h = 4(${tidy(S)})³/[3(${tidy(R)})²] = ${tidy(exact,5)} cm, so to one decimal place h = ${rounded.toFixed(1)} cm.`,verification:Math.abs(rounded-p.h*k)<1e-9,approximation:true};
  }
  if(id==="V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO"){
    const mode=pick(`${seed}:mode`,[0,1,2] as const);
    const S=6*k;
    const r=mode===0?S:mode===1?2*S:S/2;
    const H=(4*S*S*S)/(r*r);
    const ans=ratio(2*r,H);
    return {stem:`A solid metallic sphere of radius ${tidy(S)} cm is melted and recast into a right circular cone of height ${tidy(H)} cm. Find the ratio of the cone's base diameter to its height.`,answer:ans,distractors:[ratio(r,H),ratio(H,2*r),ratio(2*r,S)],work:`4(${tidy(S)})³ = r²(${tidy(H)}), so cone radius r = ${tidy(r)} cm and diameter = ${tidy(2*r)} cm. Therefore diameter:height = ${ans}.`,verification:Math.abs(r*r*H-4*S*S*S)<1e-9,approximation:false};
  }
  if(id==="V3-UNEQUAL-SPHERES-TO-SPHERE-RADIUS"){
    const p=pick(`${seed}:p`,[[3,4,5,6],[1,6,8,9]] as const);
    const a=p[0]*k,b=p[1]*k,c=p[2]*k,R=p[3]*k;
    return {stem:`Three solid metal spheres of radii ${a} cm, ${b} cm and ${c} cm are melted together and recast into one sphere. Find the radius of the new sphere.`,answer:`${R} cm`,distractors:[`${a+b+c} cm`,`${Math.max(a,b,c)} cm`,`${2*R} cm`],work:`R³ = ${a}³+${b}³+${c}³ = ${R*R*R}, hence R = ${R} cm.`,verification:R*R*R===a*a*a+b*b*b+c*c*c,approximation:false};
  }
  if(id==="V3-UNEQUAL-SPHERES-TO-SPHERE-SURFACE-DECREASE"){
    const a=3*k,b=4*k,c=5*k,R=6*k;
    const old=a*a+b*b+c*c,newA=R*R,pct=((old-newA)/old)*100;
    return {stem:`Three solid spheres of radii ${a} cm, ${b} cm and ${c} cm are melted and recast into one solid sphere. By what percentage does the total surface area decrease?`,answer:`${tidy(pct)}%`,distractors:[`${tidy(100-pct)}%`,`24%`,`32%`],work:`Volume conservation gives R³=${a}³+${b}³+${c}³=${R}³, so R=${R}. Surface-area factor falls from ${old} to ${newA}; decrease = (${old}-${newA})/${old}×100 = ${tidy(pct)}%.`,verification:R*R*R===a*a*a+b*b*b+c*c*c && Math.abs(pct-28)<1e-9,approximation:false};
  }
  if(id==="V3-COINS-DIAMETER-THICKNESS-TO-CUBOID-COUNT"){
    const p=pick(`${seed}:p`,[
      {d:3.5,tmm:4,l:21,b:11,h:7,n:420},
      {d:7,tmm:2,l:11,b:7,h:10,n:100},
      {d:7,tmm:4,l:22,b:7,h:10,n:100},
    ] as const);
    const t=p.tmm/10,r=p.d/2,coin=(22/7)*r*r*t,cuboid=p.l*p.b*p.h,calc=cuboid/coin;
    return {stem:`Silver coins are ${p.d} cm in diameter and ${p.tmm} mm thick. How many such coins must be melted to form a cuboid of dimensions ${p.l} cm × ${p.b} cm × ${p.h} cm? Use π = 22/7.`,answer:`${p.n} coins`,distractors:[`${p.n/2} coins`,`${p.n*2} coins`,`${p.n*3} coins`],work:`Thickness = ${tidy(t)} cm and radius = ${tidy(r)} cm. One coin volume = (22/7)×${tidy(r)}²×${tidy(t)} = ${tidy(coin)} cm³; cuboid volume = ${cuboid} cm³; count = ${cuboid}/${tidy(coin)} = ${p.n}.`,verification:Math.abs(calc-p.n)<1e-9,approximation:false};
  }
  if(id==="V3-COINS-CIRCUMFERENCE-THICKNESS-TO-CUBOID-COUNT"){
    const p=pick(`${seed}:p`,[
      {C:5.5,tmm:2,l:14,b:11,h:8,n:2560},
      {C:11,tmm:4,l:21,b:11,h:7,n:420},
    ] as const);
    const r=p.C*7/44,t=p.tmm/10,coin=(22/7)*r*r*t,cuboid=p.l*p.b*p.h,calc=cuboid/coin;
    return {stem:`Each silver coin has circumference ${p.C} cm and thickness ${p.tmm} mm. How many coins must be melted to form a cuboid ${p.l} cm × ${p.b} cm × ${p.h} cm? Use π = 22/7.`,answer:`${p.n} coins`,distractors:[`${p.n/2} coins`,`${p.n*2} coins`,`${p.n*3} coins`],work:`From 2πr=${p.C}, r=${tidy(r)} cm. Thickness=${tidy(t)} cm. One coin volume=${tidy(coin)} cm³, cuboid volume=${cuboid} cm³, so count=${p.n}.`,verification:Math.abs(calc-p.n)<1e-8,approximation:false};
  }

  const p=pick(`${seed}:p`,[
    {Ro:6,Ri:3,r:6,h:7},
    {Ro:6,Ri:5,r:3,h:364/27},
    {Ro:8,Ri:4,r:8,h:28/3},
  ] as const);
  const h=(4*(p.Ro**3-p.Ri**3))/(3*p.r*p.r);
  return {stem:`A hollow metallic spherical shell has outer radius ${p.Ro*k} cm and inner radius ${p.Ri*k} cm. It is melted and recast into a solid cylinder of radius ${p.r*k} cm. Find the cylinder height${Number.isInteger(p.h)?'': ' correct to two decimal places'}.`,answer:`${Number.isInteger(p.h)?tidy(p.h*k): (h*k).toFixed(2)} cm`,distractors:[`${tidy((h*k)/2)} cm`,`${tidy(h*k*2)} cm`,`${tidy(h*k*3)} cm`],work:`π(${p.r*k})²h = (4/3)π[(${p.Ro*k})³-(${p.Ri*k})³], giving h = ${tidy(h*k,5)} cm${Number.isInteger(p.h)?'.':`, or ${(h*k).toFixed(2)} cm to two decimals.`}`,verification:Math.abs(h-p.h)<1e-9,approximation:!Number.isInteger(p.h)};
}

export interface MenCp012SaturationQuestion {
  authority:typeof MEN_CP_012_SATURATION_V3_AUTHORITY;
  id:MenCp012SaturationV3Id;
  cluster:MenCp012SaturationCluster;
  disposition:MenCp012SaturationDisposition;
  evidence:string;
  seed:string;
  stem:string;
  answer:string;
  options:Array<{label:"A"|"B"|"C"|"D";display:string;isCorrect:boolean}>;
  correctIndex:number;
  explanation:{steps:Array<{title:string;body:string}>;traps:string[]};
  verification:{valid:boolean;method:string};
  approximation:boolean;
  permanentQlId:null;
  questionStudioDiscoverable:false;
  publiclyPublishable:false;
}

export function generateMenCp012SaturationV3(id:MenCp012SaturationV3Id,seed:string):MenCp012SaturationQuestion{
  const definition=MEN_CP_012_SATURATION_V3_DEFINITIONS.find((row)=>row.id===id);
  if(!definition)throw new Error(`Unknown MEN-CP-012 saturation candidate ${id}`);
  const built=build(id,seed);
  if(!built.verification)throw new Error(`${id}/${seed}: source-backed identity verification failed.`);
  const position=correctIndex(seed,id);
  const wrong=[...new Set(built.distractors.filter((value)=>value!==built.answer))];
  if(wrong.length<3)throw new Error(`${id}/${seed}: distractor collapse.`);
  let wi=0;
  const options=LABELS.map((label,index)=>index===position
    ? {label,display:built.answer,isCorrect:true}
    : {label,display:wrong[wi++]!,isCorrect:false});
  if(new Set(options.map((option)=>option.display)).size!==4)throw new Error(`${id}/${seed}: option displays not unique.`);
  return {
    authority:MEN_CP_012_SATURATION_V3_AUTHORITY,id,cluster:definition.cluster,disposition:definition.disposition,evidence:definition.evidence,seed,
    stem:built.stem,answer:built.answer,options,correctIndex:position,
    explanation:{steps:[
      {title:"Identify the material relation",body:"The material is melted/recast, so usable source volume equals target material volume."},
      {title:"Build the shape equation",body:built.work},
      {title:"Apply units and requested representation",body:built.approximation?"Keep units consistent and round only at the final requested step.":"Keep all dimensions in consistent units before evaluating the conservation relation."},
      {title:"Check the target",body:`The requested result is ${built.answer}.`},
    ],traps:["Do not conserve surface area merely because the material is recast.","For hollow solids, conserve material volume only; exclude the empty core." ]},
    verification:{valid:true,method:"constructed source-backed volume-conservation identity"},approximation:built.approximation,
    permanentQlId:null,questionStudioDiscoverable:false,publiclyPublishable:false,
  };
}
