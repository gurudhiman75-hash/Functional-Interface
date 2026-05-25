import os
import json
from glob import glob

ROOT = os.path.dirname(os.path.dirname(__file__))
EXPORTS = os.path.join(ROOT, 'exports')

def load_corpus(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
            text = text.strip()
            if not text:
                return None
            # try full JSON
            try:
                data = json.loads(text)
                return data
            except Exception:
                # try ndjson (one json object per line)
                items = []
                for line in text.splitlines():
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        items.append(json.loads(line))
                    except Exception:
                        # try to strip leading commas or brackets
                        cleaned = line.lstrip(',')
                        try:
                            items.append(json.loads(cleaned))
                        except Exception:
                            pass
                return items
    except Exception:
        return None


def collect_metrics(corpus):
    metrics = {
        'count': 0,
        'by_difficulty': {},
        'realism_scores': [],
        'weak_distractors_count': 0,
        'ugly_decimal_count': 0,
        'families': {},
    }
    if corpus is None:
        return metrics
    # handle two formats
    questions = None
    if isinstance(corpus, dict) and 'questions' in corpus:
        questions = corpus.get('questions', [])
        if 'summary' in corpus:
            metrics['ugly_decimal_count'] = corpus['summary'].get('uglyDecimalCount', 0)
    elif isinstance(corpus, list):
        questions = corpus
    else:
        # unknown
        return metrics

    metrics['count'] = len(questions)
    for q in questions:
        diff = q.get('difficulty') or q.get('difficulty', 'Unknown')
        metrics['by_difficulty'][diff] = metrics['by_difficulty'].get(diff, 0) + 1
        qm = q.get('qualityMetrics') or q.get('qualityMetrics', {})
        if isinstance(qm, dict):
            m = qm.get('metrics') or qm.get('metrics', {})
            if isinstance(m, dict):
                rs = m.get('editorialRealismScore')
                if rs is not None:
                    try:
                        metrics['realism_scores'].append(float(rs))
                    except Exception:
                        pass
        # families
        sm = q.get('semanticMetadata') or q.get('semanticMetadata', {})
        prob = sm.get('problem') if isinstance(sm, dict) else None
        family = None
        if prob and isinstance(prob, dict):
            family = prob.get('family')
        if not family:
            family = q.get('topology', {}).get('family') if q.get('topology') else q.get('topology', {}).get('family') if q.get('topology') else None
        if family:
            metrics['families'][family] = metrics['families'].get(family, 0) + 1
        # distractors judged weak via penaltyBreakdown
        qm_full = q.get('qualityMetrics')
        if qm_full and isinstance(qm_full, dict):
            penalties = qm_full.get('penaltyBreakdown') or qm_full.get('penaltyBreakdown', [])
            if penalties and len(penalties)>0:
                # heuristically count as weak
                metrics['weak_distractors_count'] += 1
        # ugly decimals
        rr = q.get('corpusRealism') or q.get('nativeRealization')
        # some corpora include numeric answer with many decimals; we skip heavy heuristics here
    return metrics


def scan_exports():
    results = {}
    for d in os.listdir(EXPORTS):
        full = os.path.join(EXPORTS, d)
        if not os.path.isdir(full):
            continue
        name = d.lower()
        if ('percentage' in name) or ('profit' in name) or ('pl_' in name) or ('profit-loss' in name) or ('profit-loss' in d.lower()):
            # try corpus.json or corpus.jsonl or corpus.ndjson
            corpus_path = os.path.join(full, 'corpus.json')
            alt = None
            if not os.path.exists(corpus_path):
                # try any json file in folder
                js = glob(os.path.join(full, '*.json'))
                if js:
                    alt = js[0]
            else:
                alt = corpus_path
            corpus = None
            if alt and os.path.exists(alt):
                corpus = load_corpus(alt)
            else:
                # try to find exported txt
                corpus = None
            metrics = collect_metrics(corpus)
            results[d] = metrics
    return results


def aggregate(results):
    agg = {
        'total_exports': len(results),
        'total_questions': 0,
        'by_export': {},
        'global_families': {},
        'global_realism_scores': []
    }
    for name, m in results.items():
        agg['total_questions'] += m.get('count',0)
        agg['by_export'][name] = m
        for fam, cnt in m.get('families',{}).items():
            agg['global_families'][fam] = agg['global_families'].get(fam,0) + cnt
        if m.get('realism_scores'):
            agg['global_realism_scores'].extend(m['realism_scores'])
    return agg


def main():
    results = scan_exports()
    agg = aggregate(results)
    out_json = os.path.join(EXPORTS, 'quant_audit_summary.json')
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump({'per_export': results, 'aggregate': agg}, f, indent=2)
    # write short human report
    rep = []
    rep.append(f"Quant audit: scanned {len(results)} exports, total questions {agg['total_questions']}")
    rep.append('\nTop families:')
    top_fams = sorted(agg['global_families'].items(), key=lambda x:-x[1])[:20]
    for fam,cnt in top_fams:
        rep.append(f" - {fam}: {cnt}")
    if agg['global_realism_scores']:
        avg = sum(agg['global_realism_scores'])/len(agg['global_realism_scores'])
        rep.append(f"\nAverage editorial realism score across questions: {avg:.1f}")
    rep_path = os.path.join(EXPORTS, 'quant_audit_summary.txt')
    with open(rep_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(rep))
    print('Wrote', out_json, rep_path)

if __name__ == '__main__':
    main()
