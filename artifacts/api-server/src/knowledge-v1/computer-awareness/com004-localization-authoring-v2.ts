import { buildCom004BilingualLocalizationV1, type Com004BilingualCopyV1 } from './com004-localization-core-v1';
// Each row is authored against one source item. Choice order is answer first,
// followed by the source distractors in order; the builder restores its key.
export type BilingualRow = [string,string,string,string,string,string];
export const BOTH = ['दोनों सही|केवल 1 सही|केवल 2 सही|दोनों गलत','ਦੋਵੇਂ ਸਹੀ|ਕੇਵਲ 1 ਸਹੀ|ਕੇਵਲ 2 ਸਹੀ|ਦੋਵੇਂ ਗਲਤ'] as const;
export const ONE = ['केवल 1 सही|केवल 2 सही|दोनों सही|दोनों गलत','ਕੇਵਲ 1 ਸਹੀ|ਕੇਵਲ 2 ਸਹੀ|ਦੋਵੇਂ ਸਹੀ|ਦੋਵੇਂ ਗਲਤ'] as const;
export function authorBilingualQl(ql: number, rows: readonly BilingualRow[]) {
 if(rows.length!==12) throw new Error(`COM004 QL${ql}: exactly 12 authored rows required`);
 const wave=Math.ceil(ql/4);
 const copies:Com004BilingualCopyV1[]=rows.map((r,i)=>{
  function copy(language:'hi'|'pa') {const opts=r[language==='hi'?2:3].split('|');if(opts.length!==4)throw new Error(`QL${ql}/${i}: four choices required`);return {stem:r[language==='hi'?0:1],canonicalAnswer:opts[0],distractors:opts.slice(1) as [string,string,string],explanation:r[language==='hi'?4:5]};}
  return {sourceQuestionId:`COM004-EN-W${wave}-${String(ql).padStart(3,'0')}-${String(i+1).padStart(2,'0')}`,hi:copy('hi'),pa:copy('pa')};
 });
 return buildCom004BilingualLocalizationV1(copies);
}
