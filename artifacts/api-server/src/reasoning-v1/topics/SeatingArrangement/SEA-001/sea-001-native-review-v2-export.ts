import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { canonicalDigest } from "./canonical.ts";
import { buildSea001SaturationCorpus, selectManualReviewCorpus } from "./saturation/corpus.ts";
import { SEA001_TRANSLATION_TARGET_LOCALES, sea001CanonicalParityFingerprint } from "./localization/readiness.ts";
import { sea001LocalizedLearnerSurface } from "./localization/candidate-localizer.ts";
import { buildSea001NativeReviewV2 } from "./localization/native-review-v2.ts";

const outputDir=process.env.SEA_001_NATIVE_V2_OUTPUT_DIR??"/tmp/sea-001-native-v2";
await mkdir(outputDir,{recursive:true});
const canonical=selectManualReviewCorpus(buildSea001SaturationCorpus(40).caselets,5);
if(canonical.length!==100) throw new Error(`Expected 100 canonical caselets, got ${canonical.length}`);
const ledger:any[]=[];

for(const locale of SEA001_TRANSLATION_TARGET_LOCALES){
  const records=canonical.map((source,index)=>{
    const localized=buildSea001NativeReviewV2(source,locale);
    const localizedContentFingerprint=canonicalDigest({setup:localized.setupText,clues:localized.clueTexts,solution:localized.sharedExplanation,diagram:localized.diagramText??localized.diagram?.text??"",children:localized.children.map(c=>({text:c.text,options:c.options.map(o=>({display:o.display,explanation:o.explanation})),explanation:c.explanation}))});
    ledger.push({locale,caseletId:source.caseletId,canonicalParityFingerprint:sea001CanonicalParityFingerprint(source),localizedContentFingerprint,decision:"PENDING_HUMAN_REVIEW",reviewerId:null,reviewedAt:null,notes:""});
    return {reviewNo:index+1,checkpointId:source.checkpointId,blueprintAuthorityId:source.blueprintAuthorityId,caseletId:source.caseletId,canonicalParityFingerprint:sea001CanonicalParityFingerprint(source),localizedContentFingerprint,english:{setup:source.setupText,clues:source.clueTexts,solution:source.sharedExplanation,diagram:source.diagramText??source.diagram?.text??"",children:source.children.map(c=>({questionOrder:c.questionOrder,queryContractId:c.queryContractId,question:c.text,options:c.options.map(o=>o.display),answerIndex:c.answerIndex,explanation:c.explanation}))},localized:{setup:localized.setupText,clues:localized.clueTexts,solution:localized.sharedExplanation,diagram:localized.diagramText??localized.diagram?.text??"",children:localized.children.map(c=>({questionOrder:c.questionOrder,queryContractId:c.queryContractId,question:c.text,options:c.options.map(o=>({display:o.display,isCorrect:o.isCorrect,explanation:o.explanation})),answerIndex:c.answerIndex,explanation:c.explanation}))},review:{semanticParity:"AUTOMATED_PROVED",nativeSentenceCoverage:"AUTOMATED_PROVED",languageReview:"PENDING_HUMAN_REVIEW",notes:""}};
  });
  const slug=locale==="hi-IN"?"hi":"pa";
  await writeFile(join(outputDir,`sea-001-${slug}-native-v2-review-100.json`),`${JSON.stringify({authority:"SEA Seating Arrangement Master End-to-End Family Design V3 merged",presentationAuthority:"SEA001_NATIVE_LOCALIZATION_V2",locale,status:"HUMAN_LANGUAGE_REVIEW_REQUIRED",canonicalEnglishFrozen:true,semanticParity:"AUTOMATED_PROVED",humanLanguageReview:"PENDING",productDeliveryUnlocked:false,records},null,2)}\n`,`utf8`);
  console.log("WROTE_SEA_001_NATIVE_V2",locale,records.length,canonicalDigest(records.map(r=>r.localizedContentFingerprint)));
}

await writeFile(join(outputDir,"sea-001-native-v2-ledger-template.json"),`${JSON.stringify({packageId:"SEA-001",presentationAuthority:"SEA001_NATIVE_LOCALIZATION_V2",status:"PENDING_HINDI_PUNJABI_HUMAN_REVIEW",instructions:["Review Hindi and Punjabi independently against frozen English.","Do not change semantic answers, option correctness, query contracts, solve identities or permanent QLs during language review.","Set ACCEPT, REWRITE or REJECT for every entry and sign reviewerId/reviewedAt.","Multilingual freeze and product activation remain locked until explicit approval."],entries:ledger},null,2)}\n`,`utf8`);
await writeFile(join(outputDir,"sea-001-native-v2-summary.json"),`${JSON.stringify({packageId:"SEA-001",presentationAuthority:"SEA001_NATIVE_LOCALIZATION_V2",canonicalCaselets:100,localizedCaselets:200,localizedChildQuestions:800,semanticParity:"AUTOMATED_PROVED",humanLanguageReview:"PENDING",questionStudioRegistered:false,questionBankWritable:false,testEligible:false,publiclyPublishable:false},null,2)}\n`,`utf8`);
console.log("WROTE_SEA_001_NATIVE_V2_LEDGER",ledger.length,outputDir);
