import { hashSeed } from "./DI-001/exact";
import {
  DI001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  generateDi001QuestionStudioBatch,
} from "./DI-001/question-studio-adapter";
import {
  DI002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  generateDi002QuestionStudioBatch,
} from "./DI-002/question-studio-adapter";
import {
  DI003_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI003_SINGLE_CANONICAL_PROBLEM_ID,
  DI003_STACKED_CANONICAL_PROBLEM_ID,
  generateDi003QuestionStudioBatch,
} from "./DI-003/question-studio-adapter";
import {
  DI004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI004_SINGLE_CANONICAL_PROBLEM_ID,
  DI004_MULTI_CANONICAL_PROBLEM_ID,
  generateDi004QuestionStudioBatch,
} from "./DI-004/question-studio-adapter";
import {
  DI005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI005_FULLY_VISIBLE_CANONICAL_PROBLEM_ID,
  DI005_COMPARATIVE_CANONICAL_PROBLEM_ID,
  DI005_DONUT_CANONICAL_PROBLEM_ID,
  generateDi005QuestionStudioBatch,
} from "./DI-005/question-studio-adapter";
import {
  DI006_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI006_ADVANCED_CANONICAL_PROBLEM_ID,
  generateDi006QuestionStudioBatch,
} from "./DI-006/question-studio-adapter";
import {
  DI007_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  generateDi007QuestionStudioBatch,
} from "./DI-007/question-studio-adapter";
import {
  DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI008_ADVANCED_CANONICAL_PROBLEM_ID,
  generateDi008QuestionStudioBatch,
} from "./DI-008/question-studio-adapter";
import {
  DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  generateDi009QuestionStudioBatch,
} from "./DI-009/question-studio-adapter";
import {
  DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  generateDi010QuestionStudioBatch,
} from "./DI-010/question-studio-adapter";
import {
  DI011_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  generateDi011QuestionStudioBatch,
} from "./DI-011/question-studio-adapter";
import {
  DI012_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  generateDi012QuestionStudioBatch,
} from "./DI-012/question-studio-adapter";
import {
  DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  generateDi013QuestionStudioBatch,
} from "./DI-013/question-studio-adapter";
import {
  DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  generateDi014QuestionStudioBatch,
} from "./DI-014/question-studio-adapter";

export const DI_DELIVERY_NOVELTY_MIX_AUTHORITY = "DI-DELIVERY-NOVELTY-MIX-V1" as const;
export const DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID = "DI-MIX-001" as const;
export const DI_DELIVERY_NOVELTY_MIX_CP_ID = "DI-CP-MIX-001" as const;
export const DI_DELIVERY_NOVELTY_MIX_RUNTIME_MODE = "DI_DELIVERY_NOVELTY_MIX_CONTROLLED_REVIEW_V1" as const;

export type DiNoveltyTier = "STANDARD" | "FRESH_FAMILIAR" | "HIGHER_NOVELTY";
export type DiDifficultyBand = "Easy" | "Medium" | "Hard";
export type DiDeliveryExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS" | "BANKING_MAINS";

type Generator = (request:any)=>Promise<any>;
type SourceMode = Readonly<{
  id:string;
  packageId:string;
  canonicalProblemId:string;
  tier:DiNoveltyTier;
  profiles:readonly DiDeliveryExamProfile[];
  hardEligibleProfiles?:readonly DiDeliveryExamProfile[];
  mainsHardTaskKinds?:readonly string[];
  generate:Generator;
}>;

const SOURCE_MODES:readonly SourceMode[] = Object.freeze([
  { id:"DI001_BASIC_TABLE", packageId:"DI-001", canonicalProblemId:DI001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], hardEligibleProfiles:["SSC_CGL_TIER_I","BANKING_PRELIMS"], generate:generateDi001QuestionStudioBatch },
  { id:"DI002_ADVANCED_TABLE", packageId:"DI-002", canonicalProblemId:DI002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], mainsHardTaskKinds:["COMBINED_SELECTION_RATE","REJECTED_TO_SELECTED_RATIO"], generate:generateDi002QuestionStudioBatch },
  { id:"DI003_GROUPED_BAR", packageId:"DI-003", canonicalProblemId:DI003_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], hardEligibleProfiles:["SSC_CGL_TIER_I","BANKING_PRELIMS"], generate:generateDi003QuestionStudioBatch },
  { id:"DI004_TWO_SERIES_LINE", packageId:"DI-004", canonicalProblemId:DI004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], hardEligibleProfiles:["SSC_CGL_TIER_I","BANKING_PRELIMS"], generate:generateDi004QuestionStudioBatch },
  { id:"DI005_HIDDEN_PIE", packageId:"DI-005", canonicalProblemId:DI005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], hardEligibleProfiles:["SSC_CGL_TIER_I","BANKING_PRELIMS"], generate:generateDi005QuestionStudioBatch },
  { id:"DI005_VISIBLE_PIE", packageId:"DI-005", canonicalProblemId:DI005_FULLY_VISIBLE_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], hardEligibleProfiles:["SSC_CGL_TIER_I","BANKING_PRELIMS"], generate:generateDi005QuestionStudioBatch },
  { id:"DI006_BASE_CASELET", packageId:"DI-006", canonicalProblemId:DI006_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["BANKING_PRELIMS","BANKING_MAINS"], hardEligibleProfiles:["BANKING_PRELIMS"], generate:generateDi006QuestionStudioBatch },
  { id:"DI007_MISSING", packageId:"DI-007", canonicalProblemId:DI007_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi007QuestionStudioBatch },
  { id:"DI008_BUSINESS_ARITHMETIC", packageId:"DI-008", canonicalProblemId:DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi008QuestionStudioBatch },
  { id:"DI009_HISTOGRAM", packageId:"DI-009", canonicalProblemId:DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I"], generate:generateDi009QuestionStudioBatch },
  { id:"DI010_FREQUENCY_POLYGON", packageId:"DI-010", canonicalProblemId:DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I"], generate:generateDi010QuestionStudioBatch },

  { id:"DI003_SINGLE_BAR", packageId:"DI-003", canonicalProblemId:DI003_SINGLE_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], hardEligibleProfiles:["SSC_CGL_TIER_I","BANKING_PRELIMS"], generate:generateDi003QuestionStudioBatch },
  { id:"DI004_SINGLE_LINE", packageId:"DI-004", canonicalProblemId:DI004_SINGLE_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], hardEligibleProfiles:["SSC_CGL_TIER_I","BANKING_PRELIMS"], generate:generateDi004QuestionStudioBatch },
  { id:"DI005_COMPARATIVE_PIE", packageId:"DI-005", canonicalProblemId:DI005_COMPARATIVE_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi005QuestionStudioBatch },
  { id:"DI005_DONUT", packageId:"DI-005", canonicalProblemId:DI005_DONUT_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["BANKING_PRELIMS","BANKING_MAINS"], hardEligibleProfiles:["BANKING_PRELIMS"], generate:generateDi005QuestionStudioBatch },
  { id:"DI006_ADVANCED_CASELET", packageId:"DI-006", canonicalProblemId:DI006_ADVANCED_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["BANKING_MAINS"], mainsHardTaskKinds:["GROUP_RATIO","DERIVED_PERCENT_EXCESS","THREE_CATEGORY_TOTAL"], generate:generateDi006QuestionStudioBatch },
  { id:"DI008_ADVANCED_ARITHMETIC", packageId:"DI-008", canonicalProblemId:DI008_ADVANCED_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["BANKING_MAINS"], generate:generateDi008QuestionStudioBatch },
  { id:"DI012_ADVANCED_MISSING", packageId:"DI-012", canonicalProblemId:DI012_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi012QuestionStudioBatch },

  { id:"DI011_MIXED_MULTI_CHART", packageId:"DI-011", canonicalProblemId:DI011_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"HIGHER_NOVELTY", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi011QuestionStudioBatch },
  { id:"DI003_STACKED_BAR", packageId:"DI-003", canonicalProblemId:DI003_STACKED_CANONICAL_PROBLEM_ID, tier:"HIGHER_NOVELTY", profiles:["BANKING_MAINS"], hardEligibleProfiles:[], generate:generateDi003QuestionStudioBatch },
  { id:"DI004_THREE_SERIES_LINE", packageId:"DI-004", canonicalProblemId:DI004_MULTI_CANONICAL_PROBLEM_ID, tier:"HIGHER_NOVELTY", profiles:["BANKING_MAINS"], hardEligibleProfiles:[], generate:generateDi004QuestionStudioBatch },
  { id:"DI013_RADAR", packageId:"DI-013", canonicalProblemId:DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"HIGHER_NOVELTY", profiles:["BANKING_PRELIMS","BANKING_MAINS"], hardEligibleProfiles:["BANKING_PRELIMS"], generate:generateDi013QuestionStudioBatch },
  { id:"DI014_RADAR_PIE", packageId:"DI-014", canonicalProblemId:DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"HIGHER_NOVELTY", profiles:["BANKING_MAINS"], mainsHardTaskKinds:["GROUP_APPLICATION_TO_APPROVAL_RATIO","TOTAL_APPLICATION_TO_APPROVAL_RATIO","CROSS_CATEGORY_APPLICATION_APPROVAL_RATIO","APPROVAL_RATE_DIFFERENCE","HIGHEST_APPROVAL_RATE"], generate:generateDi014QuestionStudioBatch },
]);

export type DiDeliveryNoveltyMixRequest = Readonly<{
  packageId?:string;
  patternId?:string;
  canonicalProblemId?:string;
  topic?:string;
  subtopic?:string;
  difficulty?:unknown;
  language?:string;
  seed?:string;
  count?:number;
  examProfile?:string;
}>;

function norm(value:unknown){
  return String(value??"").trim().toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
}

export function isDiDeliveryNoveltyMixRequest(request:DiDeliveryNoveltyMixRequest){
  const pkg=norm(request.packageId??request.patternId);
  const cp=String(request.canonicalProblemId??"").trim().toUpperCase();
  const topic=norm(request.topic);
  const sub=norm(request.subtopic);
  return pkg==="di mix 001"
    || pkg==="di novelty mix"
    || cp===DI_DELIVERY_NOVELTY_MIX_CP_ID
    || (topic==="data interpretation" && ["chapter mix","novelty mix","delivery mix","exam mix"].includes(sub));
}

export function normalizeDiDeliveryExamProfile(value:unknown):DiDeliveryExamProfile{
  const n=norm(value);
  if(n.includes("mains")) return "BANKING_MAINS";
  if(n.includes("bank")||n.includes("ibps")||n.includes("sbi")||n.includes("rrb")) return "BANKING_PRELIMS";
  return "SSC_CGL_TIER_I";
}

export function allocateDiNoveltyTiers(count:number, profile:DiDeliveryExamProfile){
  const safe=Math.min(1000,Math.max(1,Math.floor(count||1)));
  const highEligible=SOURCE_MODES.some(mode=>mode.tier==="HIGHER_NOVELTY"&&mode.profiles.includes(profile));
  const weights:Record<DiNoveltyTier,number>=highEligible
    ? {STANDARD:.75,FRESH_FAMILIAR:.20,HIGHER_NOVELTY:.05}
    : {STANDARD:.75,FRESH_FAMILIAR:.25,HIGHER_NOVELTY:0};
  const tiers:DiNoveltyTier[]=["STANDARD","FRESH_FAMILIAR","HIGHER_NOVELTY"];
  const raw=tiers.map(tier=>({tier,exact:safe*weights[tier]}));
  const counts=Object.fromEntries(raw.map(row=>[row.tier,Math.floor(row.exact)])) as Record<DiNoveltyTier,number>;
  let remaining=safe-tiers.reduce((sum,tier)=>sum+counts[tier],0);
  for(const row of [...raw].sort((a,b)=>(b.exact-Math.floor(b.exact))-(a.exact-Math.floor(a.exact))||tiers.indexOf(a.tier)-tiers.indexOf(b.tier))){
    if(remaining<=0) break;
    if(weights[row.tier]===0) continue;
    counts[row.tier]+=1;
    remaining-=1;
  }
  return {count:safe,weights,counts,highNoveltyEligible:highEligible};
}

function normalizeDifficultyBand(value:unknown):DiDifficultyBand|undefined{
  const n=norm(value);
  if(n==="easy") return "Easy";
  if(n==="medium"||n==="moderate") return "Medium";
  if(n==="hard"||n==="difficult") return "Hard";
  return undefined;
}

export function allocateDiDifficultyBands(count:number,profile:DiDeliveryExamProfile){
  const safe=Math.min(1000,Math.max(1,Math.floor(count||1)));
  const weights:Record<DiDifficultyBand,number>=profile==="BANKING_MAINS"
    ? {Easy:.15,Medium:.45,Hard:.40}
    : profile==="BANKING_PRELIMS"
      ? {Easy:.30,Medium:.50,Hard:.20}
      : {Easy:.35,Medium:.40,Hard:.25};
  const bands:DiDifficultyBand[]=["Easy","Medium","Hard"];
  const raw=bands.map(band=>({band,exact:safe*weights[band]}));
  const counts=Object.fromEntries(raw.map(row=>[row.band,Math.floor(row.exact)])) as Record<DiDifficultyBand,number>;
  let remaining=safe-bands.reduce((sum,band)=>sum+counts[band],0);
  for(const row of [...raw].sort((a,b)=>(b.exact-Math.floor(b.exact))-(a.exact-Math.floor(a.exact))||bands.indexOf(a.band)-bands.indexOf(b.band))){
    if(remaining<=0) break;
    counts[row.band]+=1;
    remaining-=1;
  }
  return {count:safe,weights,counts};
}

function buildDifficultyPlan(
  count:number,
  profile:DiDeliveryExamProfile,
  explicitDifficulty:unknown,
  seed:string,
){
  const explicit=normalizeDifficultyBand(explicitDifficulty);
  if(explicit){
    const counts:Record<DiDifficultyBand,number>={Easy:0,Medium:0,Hard:0};
    counts[explicit]=count;
    return {
      plan:Array.from({length:count},()=>explicit),
      weights:null,
      counts,
      explicitDifficulty:explicit,
    };
  }
  const allocation=allocateDiDifficultyBands(count,profile);
  const plan:DiDifficultyBand[]=[];
  for(const band of ["Easy","Medium","Hard"] as const){
    for(let i=0;i<allocation.counts[band];i+=1) plan.push(band);
  }
  return {
    plan:deterministicShuffle(plan,`${seed}:difficulty-plan`),
    weights:allocation.weights,
    counts:allocation.counts,
    explicitDifficulty:null,
  };
}

function isHardEligible(mode:SourceMode,profile:DiDeliveryExamProfile){
  return !mode.hardEligibleProfiles || mode.hardEligibleProfiles.includes(profile);
}

function stableModes(
  profile:DiDeliveryExamProfile,
  tier:DiNoveltyTier,
  seed:string,
  explicitDifficulty:DiDifficultyBand|null,
){
  return SOURCE_MODES
    .filter(mode=>mode.tier===tier&&mode.profiles.includes(profile))
    .filter(mode=>explicitDifficulty!=="Hard" || isHardEligible(mode,profile))
    .map(mode=>({mode,rank:hashSeed(`${seed}:${tier}:${mode.id}`)}))
    .sort((a,b)=>a.rank-b.rank||a.mode.id.localeCompare(b.mode.id))
    .map(row=>row.mode);
}

function examProfileForSource(profile:DiDeliveryExamProfile){
  return profile;
}

function generatedTaskKind(question:any){
  return String(question.taskKind??question.kind??question.metadata?.taskKind??"");
}

function isMainsHardTaskAllowed(mode:SourceMode,profile:DiDeliveryExamProfile,band:DiDifficultyBand,question:any){
  if(profile!=="BANKING_MAINS"||band!=="Hard") return true;
  if(!mode.mainsHardTaskKinds) return true;
  return mode.mainsHardTaskKinds.includes(generatedTaskKind(question));
}

async function generateModeQuestions(
  mode:SourceMode,
  tier:DiNoveltyTier,
  band:DiDifficultyBand,
  count:number,
  profile:DiDeliveryExamProfile,
  seed:string,
){
  if(!(profile==="BANKING_MAINS"&&band==="Hard"&&mode.mainsHardTaskKinds)){
    return mode.generate({
      canonicalProblemId:mode.canonicalProblemId,
      difficulty:band.toLowerCase(),
      language:"en",
      seed,
      count,
      examProfile:examProfileForSource(profile),
    });
  }

  const questions:any[]=[];
  const questionPackages:any[]=[];
  for(let index=0;index<count;index+=1){
    let accepted:any|undefined;
    let acceptedPackages:any[]=[];
    for(let attempt=0;attempt<64;attempt+=1){
      const result=await mode.generate({
        canonicalProblemId:mode.canonicalProblemId,
        difficulty:"hard",
        language:"en",
        seed:`${seed}:mains-hard-depth:${index}:${attempt}`,
        count:1,
        examProfile:examProfileForSource(profile),
      });
      const candidate=result.questions?.[0];
      if(!candidate||!isMainsHardTaskAllowed(mode,profile,band,candidate)) continue;
      accepted=candidate;
      acceptedPackages=result.questionPackages??[];
      break;
    }
    if(!accepted){
      throw new Error(`DI novelty mix could not materialize an approved Banking Mains Hard task from ${mode.id}.`);
    }
    questions.push(accepted);
    questionPackages.push(...acceptedPackages);
  }
  return {questions,questionPackages};
}

function distributeAcrossModes(total:number,modes:readonly SourceMode[],seed:string){
  if(total===0) return [] as Array<{mode:SourceMode;count:number}>;
  if(!modes.length) throw new Error("DI novelty mix has no eligible source mode for the requested tier/profile.");
  const counts=new Map<string,number>();
  for(let i=0;i<total;i+=1){
    const mode=modes[(i+hashSeed(`${seed}:offset`))%modes.length]!;
    counts.set(mode.id,(counts.get(mode.id)??0)+1);
  }
  return modes.filter(mode=>counts.has(mode.id)).map(mode=>({mode,count:counts.get(mode.id)!}));
}

function rebalanceAssignmentsForHardCapacity(
  assignments:readonly {tier:DiNoveltyTier;mode:SourceMode;count:number}[],
  profile:DiDeliveryExamProfile,
  nonHardCapacity:number,
  seed:string,
){
  const adjusted=assignments.map(assignment=>({...assignment}));
  const constrainedCount=()=>adjusted
    .filter(assignment=>!isHardEligible(assignment.mode,profile))
    .reduce((sum,assignment)=>sum+assignment.count,0);

  let deficit=Math.max(0,constrainedCount()-nonHardCapacity);
  for(let step=0;step<deficit;step+=1){
    const donors=adjusted
      .filter(assignment=>assignment.count>0&&!isHardEligible(assignment.mode,profile))
      .map(assignment=>({assignment,rank:hashSeed(`${seed}:hard-rebalance:donor:${step}:${assignment.tier}:${assignment.mode.id}`)}))
      .sort((a,b)=>a.rank-b.rank||a.assignment.mode.id.localeCompare(b.assignment.mode.id));
    const donor=donors[0]?.assignment;
    if(!donor) throw new Error("DI novelty mix could not find a hard-ineligible source slot to rebalance.");

    const eligibleModes=SOURCE_MODES
      .filter(mode=>mode.tier===donor.tier&&mode.profiles.includes(profile)&&isHardEligible(mode,profile))
      .map(mode=>({mode,rank:hashSeed(`${seed}:hard-rebalance:target:${step}:${donor.tier}:${mode.id}`)}))
      .sort((a,b)=>a.rank-b.rank||a.mode.id.localeCompare(b.mode.id));
    const targetMode=eligibleModes[0]?.mode;
    if(!targetMode){
      throw new Error(`DI novelty mix cannot rebalance ${donor.tier} for ${profile}: no hard-capable source mode is available in the same novelty tier.`);
    }

    donor.count-=1;
    const existing=adjusted.find(assignment=>assignment.tier===donor.tier&&assignment.mode.id===targetMode.id);
    if(existing) existing.count+=1;
    else adjusted.push({tier:donor.tier,mode:targetMode,count:1});
  }

  return adjusted.filter(assignment=>assignment.count>0);
}

function rebalanceAssignmentsForHardDiversity(
  assignments:readonly {tier:DiNoveltyTier;mode:SourceMode;count:number}[],
  profile:DiDeliveryExamProfile,
  hardTarget:number,
  seed:string,
){
  if(profile!=="BANKING_MAINS"||hardTarget<=0) return assignments.map(assignment=>({...assignment}));

  const adjusted=assignments.map(assignment=>({...assignment}));
  const desiredSourceCount=Math.min(4,hardTarget);
  const perModeCap=Math.max(1,Math.ceil(hardTarget/desiredSourceCount));
  const hardCapacity=()=>adjusted
    .filter(assignment=>isHardEligible(assignment.mode,profile))
    .reduce((sum,assignment)=>sum+Math.min(assignment.count,perModeCap),0);

  let step=0;
  while(hardCapacity()<hardTarget){
    const donorCandidates=adjusted
      .filter(assignment=>
        assignment.count>0
        &&(!isHardEligible(assignment.mode,profile)||assignment.count>perModeCap)
      )
      .map(assignment=>{
        const currentCounts=new Map(
          adjusted
            .filter(candidate=>candidate.tier===assignment.tier)
            .map(candidate=>[candidate.mode.id,candidate.count] as const)
        );
        const targets=SOURCE_MODES
          .filter(mode=>
            mode.tier===assignment.tier
            &&mode.profiles.includes(profile)
            &&isHardEligible(mode,profile)
            &&mode.id!==assignment.mode.id
            &&(currentCounts.get(mode.id)??0)<perModeCap
          )
          .map(mode=>({
            mode,
            count:currentCounts.get(mode.id)??0,
            rank:hashSeed(`${seed}:hard-diversity:target:${step}:${assignment.tier}:${mode.id}`),
          }))
          .sort((a,b)=>a.count-b.count||a.rank-b.rank||a.mode.id.localeCompare(b.mode.id));
        return {
          assignment,
          targets,
          donorRank:hashSeed(`${seed}:hard-diversity:donor:${step}:${assignment.tier}:${assignment.mode.id}`),
        };
      })
      .filter(candidate=>candidate.targets.length>0)
      .sort((a,b)=>
        a.donorRank-b.donorRank
        ||b.assignment.count-a.assignment.count
        ||a.assignment.mode.id.localeCompare(b.assignment.mode.id)
      );

    const candidate=donorCandidates[0];
    if(!candidate){
      throw new Error(`DI novelty mix cannot create ${hardTarget} Hard slots within a ${perModeCap}-per-source cap across the available novelty tiers.`);
    }

    const donor=candidate.assignment;
    const targetMode=candidate.targets[0]!.mode;
    donor.count-=1;
    const existing=adjusted.find(assignment=>assignment.tier===donor.tier&&assignment.mode.id===targetMode.id);
    if(existing) existing.count+=1;
    else adjusted.push({tier:donor.tier,mode:targetMode,count:1});
    step+=1;
    if(step>hardTarget+SOURCE_MODES.length){
      throw new Error("DI novelty mix Hard-source diversity rebalance did not converge.");
    }
  }

  return adjusted.filter(assignment=>assignment.count>0);
}

function deterministicShuffle<T>(values:readonly T[],seed:string){
  return [...values]
    .map((value,index)=>({value,index,rank:hashSeed(`${seed}:${index}`)}))
    .sort((a,b)=>a.rank-b.rank||a.index-b.index)
    .map(row=>row.value);
}

type SourceSlot = Readonly<{
  tier:DiNoveltyTier;
  mode:SourceMode;
  ordinal:number;
}>;

function assignDifficultyBandsAcrossSources(
  assignments:readonly {tier:DiNoveltyTier;mode:SourceMode;count:number}[],
  profile:DiDeliveryExamProfile,
  difficultyCounts:Record<DiDifficultyBand,number>,
  seed:string,
){
  const slots:SourceSlot[]=[];
  for(const assignment of assignments){
    for(let i=0;i<assignment.count;i+=1){
      slots.push({tier:assignment.tier,mode:assignment.mode,ordinal:i});
    }
  }

  const hardTarget=difficultyCounts.Hard;
  const hardEligibleGroups=[...new Map(
    slots
      .filter(slot=>isHardEligible(slot.mode,profile))
      .map(slot=>[slot.mode.id,slot.mode] as const)
  ).values()]
    .map(mode=>({mode,rank:hashSeed(`${seed}:hard-mode-order:${mode.id}`)}))
    .sort((a,b)=>a.rank-b.rank||a.mode.id.localeCompare(b.mode.id))
    .map(row=>row.mode);

  if(hardTarget>0&&!hardEligibleGroups.length){
    throw new Error(`DI novelty mix has no hard-capable source mode for ${profile}.`);
  }

  const remainingByMode=new Map<string,SourceSlot[]>();
  for(const mode of hardEligibleGroups){
    remainingByMode.set(
      mode.id,
      deterministicShuffle(
        slots.filter(slot=>slot.mode.id===mode.id),
        `${seed}:hard-slot-order:${mode.id}`,
      ),
    );
  }

  const hardSlots:SourceSlot[]=[];
  const desiredHardSourceCount=profile==="BANKING_MAINS"?Math.min(4,hardTarget):Math.min(hardEligibleGroups.length,hardTarget);
  const perModeHardCap=desiredHardSourceCount>0?Math.max(1,Math.ceil(hardTarget/desiredHardSourceCount)):hardTarget;
  const hardCountByMode=new Map<string,number>();
  let round=0;
  while(hardSlots.length<hardTarget){
    let progress=false;
    for(const mode of hardEligibleGroups){
      if(hardSlots.length>=hardTarget) break;
      if((hardCountByMode.get(mode.id)??0)>=perModeHardCap) continue;
      const bucket=remainingByMode.get(mode.id)!;
      const slot=bucket.shift();
      if(!slot) continue;
      hardSlots.push(slot);
      hardCountByMode.set(mode.id,(hardCountByMode.get(mode.id)??0)+1);
      progress=true;
    }
    if(!progress){
      throw new Error(`DI novelty mix has only ${hardSlots.length} Hard slots within the ${perModeHardCap}-per-source cap; target is ${hardTarget}.`);
    }
    round+=1;
    if(round>slots.length+1) throw new Error("DI novelty mix hard-source round-robin did not converge.");
  }

  const hardKeys=new Set(hardSlots.map(slot=>`${slot.tier}|${slot.mode.id}|${slot.ordinal}`));
  const nonHardSlots=slots.filter(slot=>!hardKeys.has(`${slot.tier}|${slot.mode.id}|${slot.ordinal}`));
  const nonHardPlan:DiDifficultyBand[]=[
    ...Array.from({length:difficultyCounts.Easy},()=>"Easy" as const),
    ...Array.from({length:difficultyCounts.Medium},()=>"Medium" as const),
  ];
  if(nonHardPlan.length!==nonHardSlots.length){
    throw new Error(`DI novelty mix non-hard slot mismatch: ${nonHardSlots.length} source slots for ${nonHardPlan.length} Easy/Medium positions.`);
  }

  const shuffledNonHardSlots=deterministicShuffle(nonHardSlots,`${seed}:non-hard-source-order`);
  const shuffledNonHardPlan=deterministicShuffle(nonHardPlan,`${seed}:non-hard-band-order`);
  const bandBySlot=new Map<string,DiDifficultyBand>();
  for(const slot of hardSlots){
    bandBySlot.set(`${slot.tier}|${slot.mode.id}|${slot.ordinal}`,"Hard");
  }
  for(let i=0;i<shuffledNonHardSlots.length;i+=1){
    const slot=shuffledNonHardSlots[i]!;
    bandBySlot.set(
      `${slot.tier}|${slot.mode.id}|${slot.ordinal}`,
      shuffledNonHardPlan[i]!,
    );
  }

  const grouped=new Map<string,{tier:DiNoveltyTier;mode:SourceMode;band:DiDifficultyBand;count:number}>();
  for(const slot of slots){
    const key=`${slot.tier}|${slot.mode.id}|${slot.ordinal}`;
    const band=bandBySlot.get(key);
    if(!band) throw new Error(`DI novelty mix lost a difficulty assignment for ${slot.mode.id}.`);
    const groupKey=`${slot.tier}|${slot.mode.id}|${band}`;
    const existing=grouped.get(groupKey);
    if(existing) existing.count+=1;
    else grouped.set(groupKey,{tier:slot.tier,mode:slot.mode,band,count:1});
  }

  return {
    groups:[...grouped.values()],
    hardSourceModes:[...new Set(hardSlots.map(slot=>slot.mode.id))],
  };
}

function normalizedStem(question:any){
  return String(question.stem??question.text??"").toLowerCase().replace(/\s+/g," ").trim();
}

function decorateNoveltyQuestion(question:any,tier:DiNoveltyTier,mode:SourceMode){
  return {
    ...question,
    noveltyTier:tier,
    noveltyMixAuthority:DI_DELIVERY_NOVELTY_MIX_AUTHORITY,
    noveltySourceMode:mode.id,
    metadata:{
      ...(question.metadata??{}),
      noveltyTier:tier,
      noveltyMixAuthority:DI_DELIVERY_NOVELTY_MIX_AUTHORITY,
      noveltySourceMode:mode.id,
    },
  };
}

async function repairExactStemDuplicates(
  questions:any[],
  profile:DiDeliveryExamProfile,
  difficulty:unknown,
  seed:string,
  sourcePackages:any[],
){
  const seen=new Set<string>();
  const repaired:any[]=[];
  for(let index=0;index<questions.length;index+=1){
    let question=questions[index]!;
    let key=normalizedStem(question);
    if(!seen.has(key)){
      seen.add(key);
      repaired.push(question);
      continue;
    }
    const mode=SOURCE_MODES.find(candidate=>candidate.id===question.noveltySourceMode);
    if(!mode) throw new Error(`DI novelty mix cannot resolve source mode '${question.noveltySourceMode}' for duplicate repair.`);
    let replacement:any|undefined;
    for(let attempt=1;attempt<=12;attempt+=1){
      const result=await mode.generate({
        canonicalProblemId:mode.canonicalProblemId,
        difficulty:normalizeDifficultyBand(question.difficultyLabel??question.difficulty??difficulty)?.toLowerCase(),
        language:"en",
        seed:`${seed}:dedupe:${mode.id}:${index}:${attempt}`,
        count:1,
        examProfile:examProfileForSource(profile),
      });
      sourcePackages.push(...(result.questionPackages??[]));
      const candidate=result.questions?.[0];
      if(!candidate) continue;
      const candidateKey=normalizedStem(candidate);
      if(seen.has(candidateKey)) continue;
      replacement=decorateNoveltyQuestion(candidate,question.noveltyTier,mode);
      key=candidateKey;
      break;
    }
    if(!replacement){
      throw new Error(`DI novelty mix could not remove an exact stem duplicate from ${mode.id} after 12 deterministic attempts.`);
    }
    seen.add(key);
    repaired.push(replacement);
  }
  return repaired;
}

function spreadNoveltyTiers(values:readonly any[],seed:string){
  const standard=deterministicShuffle(values.filter(q=>q.noveltyTier==="STANDARD"),`${seed}:standard-order`);
  const specials=deterministicShuffle(values.filter(q=>q.noveltyTier!=="STANDARD"),`${seed}:special-order`);
  if(!specials.length) return standard;
  if(!standard.length) return specials;

  const total=values.length;
  const specialSlots:number[]=[];
  let previous=-2;
  for(let i=0;i<specials.length;i+=1){
    const ideal=Math.round(((i+1)*(total+1))/(specials.length+1))-1;
    const jitter=(hashSeed(`${seed}:slot:${i}`)%3)-1;
    let slot=Math.max(1,Math.min(total-2,ideal+jitter));
    if(slot<=previous+1) slot=Math.min(total-2,previous+2);
    while(specialSlots.includes(slot)&&slot<total-1) slot+=1;
    specialSlots.push(slot);
    previous=slot;
  }

  const output:any[]=[];
  let standardIndex=0,specialIndex=0;
  for(let position=0;position<total;position+=1){
    if(specialSlots.includes(position)&&specialIndex<specials.length){
      output.push(specials[specialIndex++]!);
    }else if(standardIndex<standard.length){
      output.push(standard[standardIndex++]!);
    }else{
      output.push(specials[specialIndex++]!);
    }
  }
  return output;
}

export async function generateDiDeliveryNoveltyMix(request:DiDeliveryNoveltyMixRequest={}){
  const language=String(request.language??"en").trim().toLowerCase();
  if(language!=="en") throw new Error("DI novelty mix V1 is English controlled-review only until fresh/high-novelty modes complete localization.");
  const examProfile=normalizeDiDeliveryExamProfile(request.examProfile);
  const count=Math.min(1000,Math.max(1,Math.floor(Number(request.count??20)||20)));
  const seed=String(request.seed??"").trim()||`DI-MIX-V1:${examProfile}:${count}`;
  const allocation=allocateDiNoveltyTiers(count,examProfile);
  const difficultyMix=buildDifficultyPlan(count,examProfile,request.difficulty,seed);
  const generated:any[]=[];
  const sourcePackages:any[]=[];
  const actualCounts:Record<DiNoveltyTier,number>={STANDARD:0,FRESH_FAMILIAR:0,HIGHER_NOVELTY:0};
  const sourceAssignments:Array<{tier:DiNoveltyTier;mode:SourceMode;count:number}>=[];

  for(const tier of ["STANDARD","FRESH_FAMILIAR","HIGHER_NOVELTY"] as const){
    const tierCount=allocation.counts[tier];
    if(!tierCount) continue;
    const modes=stableModes(examProfile,tier,`${seed}:modes`,difficultyMix.explicitDifficulty);
    const assignments=distributeAcrossModes(tierCount,modes,`${seed}:${tier}`);
    for(const assignment of assignments){
      sourceAssignments.push({tier,mode:assignment.mode,count:assignment.count});
    }
  }

  const nonHardCapacity=difficultyMix.counts.Easy+difficultyMix.counts.Medium;
  const capacityBalancedAssignments=rebalanceAssignmentsForHardCapacity(
    sourceAssignments,
    examProfile,
    nonHardCapacity,
    seed,
  );
  const balancedAssignments=rebalanceAssignmentsForHardDiversity(
    capacityBalancedAssignments,
    examProfile,
    difficultyMix.counts.Hard,
    seed,
  );

  const constrainedSlots=balancedAssignments
    .filter(assignment=>!isHardEligible(assignment.mode,examProfile))
    .reduce((sum,assignment)=>sum+assignment.count,0);
  if(constrainedSlots>nonHardCapacity){
    throw new Error(`DI novelty mix hard-source rebalance failed: ${constrainedSlots} constrained slots remain for ${nonHardCapacity} non-hard positions.`);
  }

  const difficultyAssignment=assignDifficultyBandsAcrossSources(
    balancedAssignments,
    examProfile,
    difficultyMix.counts,
    seed,
  );

  for(const {tier,mode,band,count:bandCount} of difficultyAssignment.groups){
    const result=await generateModeQuestions(
      mode,
      tier,
      band,
      bandCount,
      examProfile,
      `${seed}:${tier}:${mode.id}:${band}`,
    );
    sourcePackages.push(...(result.questionPackages??[]));
    for(const question of result.questions??[]){
      if(!isMainsHardTaskAllowed(mode,examProfile,band,question)){
        throw new Error(`DI novelty mix accepted a shallow Banking Mains Hard task ${generatedTaskKind(question)} from ${mode.id}.`);
      }
      actualCounts[tier]+=1;
      generated.push(decorateNoveltyQuestion(question,tier,mode));
    }
  }

  if(generated.length!==count){
    throw new Error(`DI novelty mix generated ${generated.length} of ${count} requested questions.`);
  }
  const deduplicated=await repairExactStemDuplicates(
    generated,
    examProfile,
    request.difficulty,
    seed,
    sourcePackages,
  );
  const questions=spreadNoveltyTiers(deduplicated,`${seed}:tier-spacing`).map((question,index)=>({
    ...question,
    mixQuestionIndex:index+1,
    mixQuestionCount:count,
  }));
  const actualDifficultyCounts:Record<DiDifficultyBand,number>={Easy:0,Medium:0,Hard:0};
  for(const question of questions){
    const band=normalizeDifficultyBand(question.difficultyLabel??question.difficulty);
    if(!band) throw new Error(`DI novelty mix received an unknown difficulty '${question.difficultyLabel??question.difficulty}'.`);
    actualDifficultyCounts[band]+=1;
  }

  return {
    generationContext:{
      generationDomain:"quant-v4" as const,
      chapterId:"DataInterpretation" as const,
      packageId:DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
      canonicalProblemId:DI_DELIVERY_NOVELTY_MIX_CP_ID,
      seed,
      timestamp:Date.now(),
      language:"en" as const,
      examProfile,
      runtimeMode:DI_DELIVERY_NOVELTY_MIX_RUNTIME_MODE,
      reviewStatus:"NOVELTY_MIX_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable:true as const,
      questionStudioMode:"CONTROLLED_REVIEW" as const,
      questionBankStatus:"NOT_STORED" as const,
      questionBankWritable:false as const,
      testEligibility:"INELIGIBLE" as const,
      testEligible:false as const,
      mockTestEligible:false as const,
      publiclyPublishable:false as const,
      automaticStudentPublication:false as const,
      productionReleaseAuthorized:false as const,
      manualApprovalRequired:true as const,
      noveltyMix:{
        authority:DI_DELIVERY_NOVELTY_MIX_AUTHORITY,
        requestedWeights:allocation.weights,
        requestedCounts:allocation.counts,
        actualCounts,
        highNoveltyEligible:allocation.highNoveltyEligible,
      },
      difficultyMix:{
        requestedWeights:difficultyMix.weights,
        requestedCounts:difficultyMix.counts,
        actualCounts:actualDifficultyCounts,
        explicitDifficulty:difficultyMix.explicitDifficulty,
        hardSourceModes:difficultyAssignment.hardSourceModes,
      },
    },
    questionPackages:sourcePackages,
    questions,
  };
}

export function diDeliveryNoveltyMixPackageCard(){
  return {
    id:DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
    packageId:DI_DELIVERY_NOVELTY_MIX_PACKAGE_ID,
    type:"quant-v4",
    section:"Quant",
    domain:"quant",
    topic:"Data Interpretation",
    subtopic:"Chapter Delivery Mix",
    name:"DI Chapter Mix — Standard + Fresh + Higher Novelty",
    label:"DI Chapter Delivery Mix",
    generationDomain:"quant-v4",
    cpIds:[DI_DELIVERY_NOVELTY_MIX_CP_ID],
    canonicalProblems:[{id:DI_DELIVERY_NOVELTY_MIX_CP_ID,label:"DI Chapter Delivery Mix"}],
    supportedDifficulties:["easy","medium","hard"],
    supportedLanguages:["en"],
    supportedExamProfiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"],
    enabled:true,
    runtimeMode:DI_DELIVERY_NOVELTY_MIX_RUNTIME_MODE,
    supportedRuntimeModes:[DI_DELIVERY_NOVELTY_MIX_RUNTIME_MODE],
    reviewStatus:"NOVELTY_MIX_REVIEW_CANDIDATE",
    questionStudioDiscoverable:true,
    questionStudioMode:"CONTROLLED_REVIEW",
    questionBankStatus:"NOT_STORED",
    questionBankWritable:false,
    testEligibility:"INELIGIBLE",
    testEligible:false,
    mockTestEligible:false,
    publiclyPublishable:false,
    automaticStudentPublication:false,
    productionReleaseAuthorized:false,
    manualApprovalRequired:true,
    noveltyPolicy:{
      banking:{standard:.75,freshFamiliar:.20,higherNovelty:.05},
      ssc:{standard:.75,freshFamiliar:.25,higherNovelty:0},
      difficulty:{
        ssc:{easy:.35,medium:.40,hard:.25},
        bankingPrelims:{easy:.30,medium:.50,hard:.20},
        bankingMains:{easy:.15,medium:.45,hard:.40},
      },
      note:"Novelty and difficulty are allocated independently. Banking Mains Hard slots are restricted to source modes with genuine Mains-hard reasoning depth. Higher-novelty quota is used only where exam-valid source modes are explicitly eligible.",
    },
  };
}
