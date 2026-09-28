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
export type DiDeliveryExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS" | "BANKING_MAINS";

type Generator = (request:any)=>Promise<any>;
type SourceMode = Readonly<{
  id:string;
  packageId:string;
  canonicalProblemId:string;
  tier:DiNoveltyTier;
  profiles:readonly DiDeliveryExamProfile[];
  generate:Generator;
}>;

const SOURCE_MODES:readonly SourceMode[] = Object.freeze([
  { id:"DI001_BASIC_TABLE", packageId:"DI-001", canonicalProblemId:DI001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi001QuestionStudioBatch },
  { id:"DI002_ADVANCED_TABLE", packageId:"DI-002", canonicalProblemId:DI002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi002QuestionStudioBatch },
  { id:"DI003_GROUPED_BAR", packageId:"DI-003", canonicalProblemId:DI003_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi003QuestionStudioBatch },
  { id:"DI004_TWO_SERIES_LINE", packageId:"DI-004", canonicalProblemId:DI004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi004QuestionStudioBatch },
  { id:"DI005_HIDDEN_PIE", packageId:"DI-005", canonicalProblemId:DI005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi005QuestionStudioBatch },
  { id:"DI005_VISIBLE_PIE", packageId:"DI-005", canonicalProblemId:DI005_FULLY_VISIBLE_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi005QuestionStudioBatch },
  { id:"DI006_BASE_CASELET", packageId:"DI-006", canonicalProblemId:DI006_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi006QuestionStudioBatch },
  { id:"DI007_MISSING", packageId:"DI-007", canonicalProblemId:DI007_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi007QuestionStudioBatch },
  { id:"DI008_BUSINESS_ARITHMETIC", packageId:"DI-008", canonicalProblemId:DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi008QuestionStudioBatch },
  { id:"DI009_HISTOGRAM", packageId:"DI-009", canonicalProblemId:DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I"], generate:generateDi009QuestionStudioBatch },
  { id:"DI010_FREQUENCY_POLYGON", packageId:"DI-010", canonicalProblemId:DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"STANDARD", profiles:["SSC_CGL_TIER_I"], generate:generateDi010QuestionStudioBatch },

  { id:"DI003_SINGLE_BAR", packageId:"DI-003", canonicalProblemId:DI003_SINGLE_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi003QuestionStudioBatch },
  { id:"DI004_SINGLE_LINE", packageId:"DI-004", canonicalProblemId:DI004_SINGLE_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["SSC_CGL_TIER_I","BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi004QuestionStudioBatch },
  { id:"DI005_COMPARATIVE_PIE", packageId:"DI-005", canonicalProblemId:DI005_COMPARATIVE_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi005QuestionStudioBatch },
  { id:"DI005_DONUT", packageId:"DI-005", canonicalProblemId:DI005_DONUT_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi005QuestionStudioBatch },
  { id:"DI006_ADVANCED_CASELET", packageId:"DI-006", canonicalProblemId:DI006_ADVANCED_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["BANKING_MAINS"], generate:generateDi006QuestionStudioBatch },
  { id:"DI008_ADVANCED_ARITHMETIC", packageId:"DI-008", canonicalProblemId:DI008_ADVANCED_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["BANKING_MAINS"], generate:generateDi008QuestionStudioBatch },
  { id:"DI012_ADVANCED_MISSING", packageId:"DI-012", canonicalProblemId:DI012_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"FRESH_FAMILIAR", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi012QuestionStudioBatch },

  { id:"DI011_MIXED_MULTI_CHART", packageId:"DI-011", canonicalProblemId:DI011_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"HIGHER_NOVELTY", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi011QuestionStudioBatch },
  { id:"DI003_STACKED_BAR", packageId:"DI-003", canonicalProblemId:DI003_STACKED_CANONICAL_PROBLEM_ID, tier:"HIGHER_NOVELTY", profiles:["BANKING_MAINS"], generate:generateDi003QuestionStudioBatch },
  { id:"DI004_THREE_SERIES_LINE", packageId:"DI-004", canonicalProblemId:DI004_MULTI_CANONICAL_PROBLEM_ID, tier:"HIGHER_NOVELTY", profiles:["BANKING_MAINS"], generate:generateDi004QuestionStudioBatch },
  { id:"DI013_RADAR", packageId:"DI-013", canonicalProblemId:DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"HIGHER_NOVELTY", profiles:["BANKING_PRELIMS","BANKING_MAINS"], generate:generateDi013QuestionStudioBatch },
  { id:"DI014_RADAR_PIE", packageId:"DI-014", canonicalProblemId:DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, tier:"HIGHER_NOVELTY", profiles:["BANKING_MAINS"], generate:generateDi014QuestionStudioBatch },
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

function stableModes(profile:DiDeliveryExamProfile,tier:DiNoveltyTier,seed:string){
  return SOURCE_MODES
    .filter(mode=>mode.tier===tier&&mode.profiles.includes(profile))
    .map(mode=>({mode,rank:hashSeed(`${seed}:${tier}:${mode.id}`)}))
    .sort((a,b)=>a.rank-b.rank||a.mode.id.localeCompare(b.mode.id))
    .map(row=>row.mode);
}

function examProfileForSource(profile:DiDeliveryExamProfile){
  return profile;
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

function deterministicShuffle<T>(values:readonly T[],seed:string){
  return [...values]
    .map((value,index)=>({value,index,rank:hashSeed(`${seed}:${index}`)}))
    .sort((a,b)=>a.rank-b.rank||a.index-b.index)
    .map(row=>row.value);
}

export async function generateDiDeliveryNoveltyMix(request:DiDeliveryNoveltyMixRequest={}){
  const language=String(request.language??"en").trim().toLowerCase();
  if(language!=="en") throw new Error("DI novelty mix V1 is English controlled-review only until fresh/high-novelty modes complete localization.");
  const examProfile=normalizeDiDeliveryExamProfile(request.examProfile);
  const count=Math.min(1000,Math.max(1,Math.floor(Number(request.count??20)||20)));
  const seed=String(request.seed??"").trim()||`DI-MIX-V1:${examProfile}:${count}`;
  const allocation=allocateDiNoveltyTiers(count,examProfile);
  const generated:any[]=[];
  const sourcePackages:any[]=[];
  const actualCounts:Record<DiNoveltyTier,number>={STANDARD:0,FRESH_FAMILIAR:0,HIGHER_NOVELTY:0};

  for(const tier of ["STANDARD","FRESH_FAMILIAR","HIGHER_NOVELTY"] as const){
    const tierCount=allocation.counts[tier];
    if(!tierCount) continue;
    const modes=stableModes(examProfile,tier,`${seed}:modes`);
    const assignments=distributeAcrossModes(tierCount,modes,`${seed}:${tier}`);
    for(const {mode,count:modeCount} of assignments){
      const result=await mode.generate({
        canonicalProblemId:mode.canonicalProblemId,
        difficulty:request.difficulty,
        language:"en",
        seed:`${seed}:${tier}:${mode.id}`,
        count:modeCount,
        examProfile:examProfileForSource(examProfile),
      });
      sourcePackages.push(...(result.questionPackages??[]));
      for(const question of result.questions??[]){
        actualCounts[tier]+=1;
        generated.push({
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
        });
      }
    }
  }

  if(generated.length!==count){
    throw new Error(`DI novelty mix generated ${generated.length} of ${count} requested questions.`);
  }
  const questions=deterministicShuffle(generated,`${seed}:final-order`).map((question,index)=>({
    ...question,
    mixQuestionIndex:index+1,
    mixQuestionCount:count,
  }));

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
      note:"Higher-novelty quota is used only where exam-valid source modes are explicitly eligible.",
    },
  };
}
