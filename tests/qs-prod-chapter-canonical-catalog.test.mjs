import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isProductionChapterGenerationEligiblePackage,readProductionChapterScope,
  validateProductionChapterReview} from '../artifacts/api-server/src/question-studio/prod-chapter-review-policy.mjs';
const manifest=JSON.parse(readFileSync('artifacts/api-server/dist/question-studio-capabilities.json','utf8'));
const scope=readProductionChapterScope({EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON:JSON.stringify({
  mode:'all-eligible-chapters',reviewOnly:true,chapterWide:true,
})},manifest);
for(const engine of ['quant-v4','reasoning-v1','language-v1','knowledge-v1']){
  test(`${engine}: every eligible built canonical chapter admits bounded whole-chapter and CP review requests`,()=>{
    const packages=manifest.packages.filter(p=>p.engineId===engine&&isProductionChapterGenerationEligiblePackage(p));
    assert.ok(packages.length>0,`no eligible chapters for ${engine}`);
    for(const pkg of packages){
      const languages=pkg.supportedLanguages.filter(x=>['en','hi','pa'].includes(x));
      assert.ok(languages.length,`${pkg.packageId}: missing supported language`);
      for(const language of languages)for(const count of [1,20]){
        const snapshot={queueVersion:1,count,selectedCpIds:[],request:{
          engineId:engine,packageId:pkg.packageId,language,difficulty:'Mixed',count,
        }};
        assert.equal(validateProductionChapterReview(snapshot,manifest,scope),true,`${pkg.packageId}/${language}/${count}`);
        assert.equal(validateProductionChapterReview({...snapshot,selectedCpIds:[pkg.cpIds[0]]},manifest,scope),true,pkg.packageId);
        assert.equal(validateProductionChapterReview({...snapshot,count:21,request:{...snapshot.request,count:21}},manifest,scope),false);
        assert.equal(validateProductionChapterReview({...snapshot,selectedCpIds:['UNKNOWN-CP-001']},manifest,scope),false);
        const runId='4f54a84b-f143-4892-8dbc-38a39dc82111';
        assert.equal(validateProductionChapterReview({...snapshot,request:{...snapshot.request,seed:`qs-async:${runId}`}},manifest,scope,{runId}),true,pkg.packageId);
      }
    }
    console.log(`${engine}: ${packages.length} eligible canonical chapters validated; no generation executed`);
  });
}
