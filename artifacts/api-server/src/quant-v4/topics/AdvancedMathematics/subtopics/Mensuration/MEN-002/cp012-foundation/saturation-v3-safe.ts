import {
  MEN_CP_012_SATURATION_V3_AUTHORITY,
  MEN_CP_012_SATURATION_V3_DEFINITIONS,
  generateMenCp012SaturationV3,
  type MenCp012SaturationQuestion,
  type MenCp012SaturationV3Id,
} from "./saturation-v3";

export const MEN_CP_012_SATURATION_V3_SAFE_AUTHORITY = "MEN-CP012-SATURATION-WAVE-03-SAFE-V2" as const;
const LABELS=["A","B","C","D"] as const;

function hash(text:string){let h=2166136261>>>0;for(const c of text){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function requestedPosition(seed:string,id:MenCp012SaturationV3Id){const m=/(\d+)$/.exec(seed);return m?Number(m[1])%4:hash(`${id}:${seed}:safe-pos`)%4;}
function variantIndex(seed:string){const m=/(\d+)$/.exec(seed);return m?Math.floor(Number(m[1])/4):hash(`${seed}:variant`);}
function gcd(a:number,b:number){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}
function tidy(value:number,digits=4){return value.toFixed(digits).replace(/0+$/,'').replace(/\.$/,'');}
function definitionFor(id:MenCp012SaturationV3Id){const row=MEN_CP_012_SATURATION_V3_DEFINITIONS.find((item)=>item.id===id);if(!row)throw new Error(`Missing Wave 03 definition for ${id}`);return row;}
function numericDisplay(value:number,unit:string,precision:number|null=null){
  const n=precision!==null?value.toFixed(precision):(Number.isInteger(value)?`${value}`:tidy(value));
  return unit==="%"?`${n}%`:`${n}${unit?` ${unit}`:""}`;
}

function safeDistractors(answer:string){
  const ratioMatch=/^(\d+):(\d+)$/.exec(answer);
  if(ratioMatch){
    const a=Number(ratioMatch[1]),b=Number(ratioMatch[2]);
    const candidates=[ratio(b,a),ratio(a,2*b),ratio(2*a,b),ratio(a+b,b),ratio(a,a+b)];
    const result=[...new Set(candidates.filter((value)=>value!==answer))].slice(0,3);
    if(result.length<3)throw new Error(`Could not build three Wave 03 ratio distractors for ${answer}`);
    return result;
  }
  const numeric=/^(-?\d+(?:\.\d+)?)\s*(.*)$/.exec(answer);
  if(!numeric) throw new Error(`Cannot build Wave 03 distractors for ${answer}`);
  const value=Number(numeric[1]),unit=numeric[2];
  const precision=numeric[1].includes(".")?numeric[1].split(".")[1]!.length:null;
  const countLike=unit==="coins"||unit==="spheres"||unit==="cubes"||unit==="cylinders"||unit==="";
  const candidates:number[]=countLike
    ? [value/2,value*2,value*3,value+1,value+2]
    : unit==="%"
      ? [value+4,Math.max(1,value-4),value/2,value*2,value+10]
      : [value/2,value*2,value*3,value+1,value+2];
  const result:string[]=[];
  const seen=new Set([answer]);
  for(const candidate of candidates){
    if(!Number.isFinite(candidate)||candidate<=0)continue;
    if(countLike&&!Number.isInteger(candidate))continue;
    const display=numericDisplay(candidate,unit,precision);
    if(seen.has(display))continue;
    seen.add(display);result.push(display);
    if(result.length===3)break;
  }
  if(result.length<3)throw new Error(`Could not build three Wave 03 distractors for ${answer}`);
  return result;
}

function rebuildOptions(question:MenCp012SaturationQuestion,position:number){
  const wrong=safeDistractors(question.answer);let wi=0;
  return LABELS.map((label,index)=>index===position
    ? {label,display:question.answer,isCorrect:true}
    : {label,display:wrong[wi++]!,isCorrect:false});
}

function teachingTraps(question:MenCp012SaturationQuestion){
  switch(question.cluster){
    case "HOLLOW_TARGET_CONSERVATION":
      return ["Use the material volume π(R²−r²)L for the hollow target; the empty core contains no metal.","Recover the requested inner radius, thickness or length only after equating material volumes."];
    case "HOLLOW_SOURCE_CONSERVATION":
      return ["Subtract the inner hollow volume from the outer volume before recasting.","Do not use the full outer solid as the source material volume."];
    case "WIRE_DRAWING_CONSERVATION":
      return ["Convert the wire length to the same linear unit before using πr²L.","Wire volume uses radius squared; do not use radius or diameter only once."];
    case "COUNT_FROM_VOLUME_RATIO":
      return ["The required count is total target/source material divided by one unit volume; keep source and target direction correct.","Use cubic volume ratios for three-dimensional solids, not linear or surface-area ratios."];
    case "INVERSE_DIMENSION_FROM_CONSERVATION":
      return [question.approximation?"Keep the exact conservation value until the final requested rounding step.":"Rearrange the volume equation for the requested target dimension before substituting.","Do not preserve a radius/height ratio unless it follows from the volume equation."];
    case "COMBINED_SOURCE_SOLIDS":
      return ["Add the source volumes; do not add or average the radii themselves.","Take the required root only after the combined target-volume equation is formed."];
    case "RECAST_THEN_SECONDARY_MEASURE":
      return ["Conserve volume only during recasting; surface area is calculated separately after the new radius is known.","Compare the sum of the original surface areas with the new surface area in the direction asked."];
    case "UNIT_CONVERSION":
      return ["Convert thickness/length units before squaring or cubing dimensions.","Treat each coin as a cylinder and divide the target volume by one coin's volume."];
  }
}

function polishTeaching(question:MenCp012SaturationQuestion):MenCp012SaturationQuestion{
  const steps=question.explanation.steps.map((step)=>({
    ...step,
    body:step.body.replace(/L = \[4(\d+(?:\.\d+)?)³\/3\]/g,"L = (4×$1³/3)"),
  }));
  return {...question,explanation:{...question.explanation,steps,traps:teachingTraps(question)}};
}

function directRatioState(id:MenCp012SaturationV3Id,seed:string,position:number):MenCp012SaturationQuestion|null{
  const definition=definitionFor(id);
  const variant=variantIndex(seed);

  if(id==="V3-SPHERE-TO-CYLINDER-RATIO-H-R"){
    const multipliers=[1,2,3,4,5] as const;
    const m=multipliers[variant%multipliers.length]!;
    const answer=ratio(4,3*m*m);
    const stem=`A solid sphere of radius r is melted and recast into a cylinder whose radius is ${m===1?"r":`${m}r`}. If the cylinder height is h, find h : r.`;
    const work=`(4/3)πr³ = π(${m}r)²h, hence h/r = 4/(3×${m}²), so h:r = ${answer}.`;
    const base:MenCp012SaturationQuestion={
      authority:MEN_CP_012_SATURATION_V3_AUTHORITY,id,cluster:definition.cluster,disposition:definition.disposition,evidence:definition.evidence,seed,
      stem,answer,options:[],correctIndex:position,
      explanation:{steps:[
        {title:"Identify the material relation",body:"The sphere is melted and recast, so its volume equals the cylinder volume."},
        {title:"Build the shape equation",body:work},
        {title:"Keep the requested ratio",body:"Cancel common factors first, then express the resulting height as a ratio to r."},
        {title:"Check the target",body:`The requested ratio is ${answer}.`},
      ],traps:[]},verification:{valid:true,method:"exact symbolic sphere-to-cylinder volume ratio"},approximation:false,
      permanentQlId:null,questionStudioDiscoverable:false,publiclyPublishable:false,
    };
    return polishTeaching({...base,options:rebuildOptions(base,position)});
  }

  if(id==="V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO"){
    const qValues=[{n:1,d:2},{n:1,d:1},{n:2,d:1},{n:3,d:1}] as const;
    const q=qValues[variant%qValues.length]!;
    const scale=1+(variant%3);
    const sphereRadius=18*scale;
    const coneRadius=sphereRadius*q.n/q.d;
    const coneHeight=4*sphereRadius*q.d*q.d/(q.n*q.n);
    const answer=ratio(Math.round(2*coneRadius*1000),Math.round(coneHeight*1000));
    const stem=`A solid metallic sphere of radius ${tidy(sphereRadius)} cm is melted and recast into a right circular cone whose base radius is ${tidy(coneRadius)} cm. Find the ratio of the cone's base diameter to its height.`;
    const work=`Volume conservation gives H = 4(${tidy(sphereRadius)})³/${tidy(coneRadius)}² = ${tidy(coneHeight)} cm. The base diameter is ${tidy(2*coneRadius)} cm, so diameter:height = ${answer}.`;
    const base:MenCp012SaturationQuestion={
      authority:MEN_CP_012_SATURATION_V3_AUTHORITY,id,cluster:definition.cluster,disposition:definition.disposition,evidence:definition.evidence,seed,
      stem,answer,options:[],correctIndex:position,
      explanation:{steps:[
        {title:"Conserve material volume",body:"Equate the sphere volume to the cone volume."},
        {title:"Recover the cone height",body:work},
        {title:"Convert radius to diameter",body:"The requested first term is the base diameter, so use 2r after the cone dimension is known."},
        {title:"Check the ratio",body:`The requested diameter:height ratio is ${answer}.`},
      ],traps:[]},verification:{valid:Math.abs(coneRadius*coneRadius*coneHeight-4*sphereRadius*sphereRadius*sphereRadius)<1e-8,method:"exact constructed sphere-to-cone volume identity"},approximation:false,
      permanentQlId:null,questionStudioDiscoverable:false,publiclyPublishable:false,
    };
    return polishTeaching({...base,options:rebuildOptions(base,position)});
  }

  if(id==="V3-UNEQUAL-SPHERES-TO-SPHERE-RADIUS"){
    const triples=[[3,4,5,6],[1,6,8,9]] as const;
    const triple=triples[variant%triples.length]!;
    const scale=1+(Math.floor(variant/triples.length)%5);
    const a=triple[0]*scale,b=triple[1]*scale,c=triple[2]*scale,R=triple[3]*scale;
    const answer=`${R} cm`;
    const stem=`Three solid metal spheres of radii ${a} cm, ${b} cm and ${c} cm are melted together and recast into one sphere. Find the radius of the new sphere.`;
    const work=`R³ = ${a}³+${b}³+${c}³ = ${R*R*R}, hence R = ${R} cm.`;
    const base:MenCp012SaturationQuestion={
      authority:MEN_CP_012_SATURATION_V3_AUTHORITY,id,cluster:definition.cluster,disposition:definition.disposition,evidence:definition.evidence,seed,
      stem,answer,options:[],correctIndex:position,
      explanation:{steps:[
        {title:"Add the source volumes",body:`The common (4/3)π factor cancels, so add ${a}³+${b}³+${c}³.`},
        {title:"Recover the target radius",body:work},
        {title:"Keep the cubic relation",body:"The new radius is the cube root of the sum of the three radius-cubes; do not add the radii."},
        {title:"Check the target",body:`The new sphere radius is ${answer}.`},
      ],traps:[]},verification:{valid:R*R*R===a*a*a+b*b*b+c*c*c,method:"exact combined-sphere cube-volume identity"},approximation:false,
      permanentQlId:null,questionStudioDiscoverable:false,publiclyPublishable:false,
    };
    return polishTeaching({...base,options:rebuildOptions(base,position)});
  }

  if(id==="V3-COINS-DIAMETER-THICKNESS-TO-CUBOID-COUNT"){
    const patterns=[
      {d:3.5,tmm:4,n:420,targets:[[21,11,7],[33,7,7],[49,11,3],[77,7,3]]},
      {d:7,tmm:2,n:100,targets:[[11,7,10],[14,11,5],[22,7,5],[35,11,2]]},
      {d:7,tmm:4,n:100,targets:[[22,7,10],[14,11,10],[28,11,5],[35,11,4]]},
    ] as const;
    const p=patterns[variant%patterns.length]!;
    const target=p.targets[Math.floor(variant/patterns.length)%p.targets.length]!;
    const d=p.d,tmm=p.tmm,l=target[0],b=target[1],h=target[2];
    const r=d/2,t=tmm/10,coin=(22/7)*r*r*t,cuboid=l*b*h,calc=cuboid/coin;
    const answer=`${p.n} coins`;
    const stem=`Silver coins are ${tidy(d)} cm in diameter and ${tidy(tmm)} mm thick. How many such coins must be melted to form a cuboid of dimensions ${tidy(l)} cm × ${tidy(b)} cm × ${tidy(h)} cm? Use π = 22/7.`;
    const work=`Thickness = ${tidy(t)} cm and radius = ${tidy(r)} cm. One coin volume = (22/7)×${tidy(r)}²×${tidy(t)} = ${tidy(coin,5)} cm³; cuboid volume = ${tidy(cuboid)} cm³; count = ${p.n}.`;
    const base:MenCp012SaturationQuestion={
      authority:MEN_CP_012_SATURATION_V3_AUTHORITY,id,cluster:definition.cluster,disposition:definition.disposition,evidence:definition.evidence,seed,
      stem,answer,options:[],correctIndex:position,
      explanation:{steps:[
        {title:"Convert the coin thickness",body:`${tidy(tmm)} mm = ${tidy(t)} cm.`},
        {title:"Find one coin and cuboid volume",body:work},
        {title:"Form the count",body:"Number of coins = cuboid volume ÷ one coin volume."},
        {title:"Check the target",body:`The required count is ${answer}.`},
      ],traps:[]},verification:{valid:Math.abs(calc-p.n)<1e-8,method:"coin-cylinder to equal-volume cuboid count"},approximation:false,
      permanentQlId:null,questionStudioDiscoverable:false,publiclyPublishable:false,
    };
    return polishTeaching({...base,options:rebuildOptions(base,position)});
  }

  if(id==="V3-COINS-CIRCUMFERENCE-THICKNESS-TO-CUBOID-COUNT"){
    const patterns=[
      {C:5.5,tmm:2,n:2560,targets:[[14,11,8],[16,11,7],[22,8,7],[28,11,4]]},
      {C:11,tmm:4,n:420,targets:[[21,11,7],[33,7,7],[49,11,3],[77,7,3]]},
    ] as const;
    const p=patterns[variant%patterns.length]!;
    const target=p.targets[Math.floor(variant/patterns.length)%p.targets.length]!;
    const C=p.C,tmm=p.tmm,l=target[0],b=target[1],h=target[2];
    const r=C*7/44,t=tmm/10,coin=(22/7)*r*r*t,cuboid=l*b*h,calc=cuboid/coin;
    const answer=`${p.n} coins`;
    const stem=`Each silver coin has circumference ${tidy(C)} cm and thickness ${tidy(tmm)} mm. How many coins must be melted to form a cuboid ${tidy(l)} cm × ${tidy(b)} cm × ${tidy(h)} cm? Use π = 22/7.`;
    const work=`From 2πr=${tidy(C)}, r=${tidy(r)} cm. Thickness=${tidy(t)} cm. One coin volume=${tidy(coin,5)} cm³ and cuboid volume=${tidy(cuboid)} cm³, so count=${p.n}.`;
    const base:MenCp012SaturationQuestion={
      authority:MEN_CP_012_SATURATION_V3_AUTHORITY,id,cluster:definition.cluster,disposition:definition.disposition,evidence:definition.evidence,seed,
      stem,answer,options:[],correctIndex:position,
      explanation:{steps:[
        {title:"Recover radius and convert thickness",body:`Use 2πr=${tidy(C)} and ${tidy(tmm)} mm = ${tidy(t)} cm.`},
        {title:"Find material volumes",body:work},
        {title:"Form the count",body:"Divide the cuboid volume by one coin's cylindrical volume."},
        {title:"Check the target",body:`The required count is ${answer}.`},
      ],traps:[]},verification:{valid:Math.abs(calc-p.n)<1e-7,method:"circumference-to-radius coin volume count"},approximation:false,
      permanentQlId:null,questionStudioDiscoverable:false,publiclyPublishable:false,
    };
    return polishTeaching({...base,options:rebuildOptions(base,position)});
  }

  return null;
}

export function generateMenCp012SaturationV3Safe(id:MenCp012SaturationV3Id,seed:string):MenCp012SaturationQuestion&{
  safeAuthority:typeof MEN_CP_012_SATURATION_V3_SAFE_AUTHORITY;
  requestedSeed:string;
  constructionSeed:string;
}{
  const target=requestedPosition(seed,id);
  const direct=directRatioState(id,seed,target);
  if(direct){
    return {...direct,safeAuthority:MEN_CP_012_SATURATION_V3_SAFE_AUTHORITY,requestedSeed:seed,constructionSeed:`${seed}:direct-v2`};
  }

  let base:MenCp012SaturationQuestion|null=null;
  let constructionSeed=seed;
  for(let cycle=0;cycle<96&&!base;cycle+=1){
    const attempt=target+cycle*4;
    constructionSeed=cycle===0?seed:`${seed}:safe:${attempt}`;
    try{
      const candidate=generateMenCp012SaturationV3(id,constructionSeed);
      if(candidate.correctIndex!==target)continue;
      base=candidate;
    }catch(error){
      if(!(error instanceof Error))throw error;
      if(!/distractor collapse|option displays not unique|verification failed/.test(error.message))throw error;
    }
  }
  if(!base)throw new Error(`${id}/${seed}: unable to construct safe source-backed state.`);
  const options=rebuildOptions(base,target);
  if(new Set(options.map((option)=>option.display)).size!==4)throw new Error(`${id}/${seed}: safe option uniqueness failed.`);
  const polished=polishTeaching({...base,authority:MEN_CP_012_SATURATION_V3_AUTHORITY,seed,correctIndex:target,options});
  return {...polished,safeAuthority:MEN_CP_012_SATURATION_V3_SAFE_AUTHORITY,requestedSeed:seed,constructionSeed};
}
