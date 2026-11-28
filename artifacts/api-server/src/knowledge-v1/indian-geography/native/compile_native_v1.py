# Compile sources/<PKG>-<CP>.<lang>.txt into one TS module per package.
#
#   python3 compile_native_v1.py geo-corpus.json
#
# Source line format: Qnnn|stem|opt1‖opt2‖opt3‖opt4|explanation
# Options are in the canonical English order. geo-corpus.json is a dump of the
# GEO adapter corpora keyed by package slug (agr, cli, ind, ...).
import json,glob,os,re,sys
ROOT=os.path.dirname(os.path.abspath(__file__))
corpus=json.load(open(sys.argv[1]))  # dump of the GEO adapter corpora: {pkg: [question,...]}
byid={q["questionId"]:q for pk in corpus.values() for q in pk}
def fnv(s):
  h=0x811c9dc5
  for b in s.encode("utf-8"): h=((h^b)*0x01000193)&0xffffffff
  return f"{h:08x}"
os.makedirs(ROOT,exist_ok=True)
pk={}
errors=[]
for f in sorted(glob.glob(os.path.join(ROOT,"sources","*.txt"))):
  name=os.path.basename(f); m=re.match(r"(GEO-[A-Z]+-\d+)-(CP\d+)\.(hi|pa)\.txt",name); pkg,cp,lang=m.groups()
  for n,line in enumerate(open(f,encoding="utf-8"),1):
    line=line.rstrip("\n")
    if not line.strip(): continue
    parts=line.split("|")
    if len(parts)!=4: errors.append(f"{name}:{n} expected 4 fields, got {len(parts)}"); continue
    qn,stem,opts,expl=parts; opts=opts.split("‖")
    qid=f"{pkg}-{cp}-{qn}"; q=byid.get(qid)
    if not q: errors.append(f"{name}:{n} unknown {qid}"); continue
    if len(opts)!=len(q["options"]): errors.append(f"{name}:{n} {qid} option count {len(opts)}"); continue
    if len(set(opts))!=len(opts): errors.append(f"{name}:{n} {qid} duplicate options")
    script="[ऀ-ॿ]" if lang=="hi" else "[਀-੿]"; other="[਀-੿]" if lang=="hi" else "[ऀ-ॣ०-ॿ]"
    blob=stem+" ".join(opts)+expl
    if re.search(other,blob): errors.append(f"{name}:{n} {qid} wrong script")
    if not re.search(script,stem): errors.append(f"{name}:{n} {qid} no native script in stem")
    rec=pk.setdefault(pkg,{}).setdefault(qid,{"h":fnv(q["stem"]+"\u0001"+"\u0001".join(q["options"]))})
    rec[lang]=[stem,opts,expl]
if errors: print("\n".join(errors)); sys.exit(1)
for pkg,recs in pk.items():
  slug=pkg.lower()
  const=pkg.replace("-","_")+"_NATIVE_HI_PA_V1"
  missing=[q for q,r in recs.items() if "hi" not in r or "pa" not in r]
  if missing: print("missing language for",missing[:5]); sys.exit(1)
  body=json.dumps(recs,ensure_ascii=False,separators=(",",":")).replace("},\"","},\n\"")
  ts=f"""// Native Hindi and Punjabi for {pkg}, written per question (not word substitution).
// Generated from reviewed sources; edit the sources, not this file.
// Each record carries a hash of the English stem and options; the localizer
// refuses a record whose English has changed since it was translated.
// Status: NATIVE_TRANSLATION_CANDIDATE — needs native-speaker review before any freeze.
import type {{ IndianGeoNativeRecordsV1 }} from "./native-record-v1";

export const {const}: IndianGeoNativeRecordsV1 = {body};
"""
  open(f"{ROOT}/{slug}-native-hi-pa-v1.ts","w").write(ts)
  print(pkg,len(recs),"questions")
