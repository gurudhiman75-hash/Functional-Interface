#!/usr/bin/env node
/**
 * Read-only Quant V4 math-notation audit.
 *
 * Two scopes:
 * 1. Every production source under quant-v4/topics: advisory source-risk inventory.
 * 2. Optional generated question JSON/JSONL: definite delimiter/bracing checks on
 *    actual student/admin-visible strings (including en, hi and pa).
 *
 * Run:
 *   node scripts/audit-quant-v4-math-rendering.mjs
 *   node scripts/audit-quant-v4-math-rendering.mjs --samples /path/to/review.jsonl
 *
 * Never writes to source, Question Bank or production. stdout is JSON.
 */
import {readdir, readFile} from "node:fs/promises";
import {join, relative, extname} from "node:path";
import process from "node:process";

const root="artifacts/api-server/src/quant-v4/topics";
const groups=new Set([
  "Arithmetic","AdvancedMathematics","NumberSystem","SpeedMathematics",
  "DataInterpretation","Probability","Statistics",
]);
const sourceExt=new Set([".ts",".tsx",".mjs",".js"]);
const findings=[];
const counters={};
function add(group,location,kind,detail,certainty="review"){
  findings.push({group,location,kind,detail,certainty});
}
async function walk(dir,output=[]){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const path=join(dir,entry.name);
    if(entry.isDirectory()) await walk(path,output);
    else if(entry.isFile()) output.push(path);
  }
  return output;
}
function groupFor(path){return relative(root,path).split(/[\\/]/)[0]}
function auditSource(path,contents){
  const group=groupFor(path);
  counters[group]??={sourceFiles:0,runtimeSamples:0};
  counters[group].sourceFiles++;
  const lines=contents.split(/\r?\n/);
  for(let i=0;i<lines.length;i++){
    const line=lines[i];
    // Static source review signals, NOT confirmed learner-visible defects.
    // Solvers, tests, dynamic templates and comments can legitimately contain them.
    if(/\b(?:[1-9]\d*|n)[PC](?:[1-9]\d*|r)\b/.test(line))
      add(group,relative(".",path)+":"+(i+1),"raw-permutation-combination","Possible nPr/nCr notation in source");
    if(/\\(?:frac|binom|sqrt|left|right)\b/.test(line) &&
       /(?:\$\{|String\.raw|\.replace\(|JSON\.stringify)/.test(line))
      add(group,relative(".",path)+":"+(i+1),"dynamic-tex","Dynamic TeX expression: check runtime output for escaped slashes/braces");
    if(/\\(?:text|mathrm)\{[^\}]*[\u0900-\u097f\u0a00-\u0a7f]/.test(line))
      add(group,relative(".",path)+":"+(i+1),"indic-text-in-math","Indic script inside TeX text command: verify font and rendering");
  }
}
const delimiters=[
  {start:"\\(",end:"\\)",name:"inline"},
  {start:"\\[",end:"\\]",name:"display"},
  {start:"$$",end:"$$",name:"display"},
];
function auditMath(text,group,location){
  let index=0, segments=0;
  while(index<text.length){
    let chosen=null,at=text.length;
    for(const d of delimiters){
      const n=text.indexOf(d.start,index);
      if(n>=0 && n<at){at=n;chosen=d}
    }
    // Dollar inline math is supported, but numeric currency is ambiguous.
    const single=text.indexOf("$",index);
    if(single>=0 && single<at && text[single+1]!=="$" &&
       !(single>0 && text[single-1]==="$")){
      const close=text.indexOf("$",single+1);
      if(close>=0 && close>single+1 && !/^\s*\d+(?:[,.]\d+)?\s*$/.test(text.slice(single+1,close))){
        at=single;chosen={start:"$",end:"$",name:"inline"};
      }else if(close>=0 && /^\s*\d+(?:[,.]\d+)?\s*$/.test(text.slice(single+1,close))){
        add(group,location,"ambiguous-dollar-delimiters","Dollar pair could represent currency or inline mathematics");
      }
    }
    if(!chosen)break;
    const from=at+chosen.start.length;
    const end=text.indexOf(chosen.end,from);
    if(end<0){
      add(group,location,"unclosed-math-delimiter","Unclosed "+chosen.start,"error");
      break;
    }
    const math=text.slice(from,end);
    segments++;
    const stack=[];
    for(let j=0;j<math.length;j++){
      if(math[j]==="\\"){j++;continue}
      if(math[j]==="{")stack.push(j);
      if(math[j]==="}" && stack.pop()===undefined)
        add(group,location,"unbalanced-tex-braces","Extra closing brace","error");
    }
    if(stack.length)add(group,location,"unbalanced-tex-braces","Missing closing brace(s)","error");
    const left=(math.match(/\\left\b/g)||[]).length;
    const right=(math.match(/\\right\b/g)||[]).length;
    if(left!==right)add(group,location,"unmatched-left-right","\\left and \\right counts differ","error");
    if(/\\(?:frac|dfrac|tfrac|binom)\s*(?!\{)/.test(math))
      add(group,location,"tex-command-arguments","Fraction/binomial command may lack braced argument(s)");
    if(/[\t\b\f]/.test(math))
      add(group,location,"control-character-in-math","Control character may indicate an unescaped JS backslash","error");
    index=end+chosen.end.length;
  }
  if(/\\(?:frac|sqrt|binom|times|div|left|right)\b/.test(text) && !segments)
    add(group,location,"raw-tex-command","TeX command outside recognized math delimiters");
  if(/\\\(|\\\[|\$\$/.test(text) && !segments)
    add(group,location,"math-not-recognized","Math opener found without a complete recognized pair");
}
function visit(record,location,group="Unclassified",depth=0){
  if(depth>12||record==null)return;
  if(Array.isArray(record)){
    for(let i=0;i<record.length;i++)visit(record[i],location+"["+i+"]",group,depth+1);
    return;
  }
  if(typeof record!=="object")return;
  const current=typeof record.group==="string"&&groups.has(record.group)?record.group:group;
  for(const [key,value] of Object.entries(record)){
    const k=key.toLowerCase();
    const visible=/^(stem|question|questiontext|text|options|option|explanation|solution|answer|steps|content|hint|title|body|en|hi|pa)$/.test(k);
    if(typeof value==="string" && visible){
      auditMath(value,current,location+"."+key);
      counters[current]??={sourceFiles:0,runtimeSamples:0};
      counters[current].runtimeSamples++;
    }else if(typeof value==="object" && value!==null){
      visit(value,location+"."+key,current,depth+1);
    }
  }
}
async function main(){
  for(const path of await walk(root)){
    const group=groupFor(path);
    if(!groups.has(group)||!sourceExt.has(extname(path))||
       /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(path))continue;
    await auditSource(path,await readFile(path,"utf8"));
  }
  const idx=process.argv.indexOf("--samples");
  if(idx>=0){
    const filename=process.argv[idx+1];
    if(!filename)throw new Error("--samples requires a JSON or JSONL filename");
    const data=await readFile(filename,"utf8");
    if(filename.endsWith(".jsonl")){
      data.split(/\r?\n/).filter(Boolean).forEach((line,i)=>visit(JSON.parse(line),filename+":"+(i+1)));
    }else visit(JSON.parse(data),filename);
  }
  const byKind={};
  for(const finding of findings)byKind[finding.kind]=(byKind[finding.kind]||0)+1;
  console.log(JSON.stringify({
    base:"Quant V4",scope:"Static inventory; optional rendered sample validation",
    sourceOnly:idx<0,counters,byKind,findings,
    caveat:"Source findings are review signals; dynamic/generated math requires --samples for definitive checks. Not a MathJax browser render test."
  },null,2));
}
main().catch(err=>{console.error(err);process.exitCode=1});
