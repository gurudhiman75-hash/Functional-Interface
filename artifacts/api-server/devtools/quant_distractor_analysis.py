import os
import json
import math
from glob import glob

ROOT = os.path.dirname(os.path.dirname(__file__))
EXPORTS = os.path.join(ROOT, 'exports')


def load_corpus(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read().strip()
            if not text:
                return None
            try:
                return json.loads(text)
            except Exception:
                items = []
                for line in text.splitlines():
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        items.append(json.loads(line))
                    except Exception:
                        cleaned = line.lstrip(',')
                        try:
                            items.append(json.loads(cleaned))
                        except Exception:
                            pass
                return items
    except Exception:
        return None


def get_family(item):
    topo = item.get('topology')
    if topo and isinstance(topo, dict):
        fam = topo.get('family')
        if fam:
            return fam
    sm = item.get('semanticMetadata', {})
    cf = sm.get('corpusFingerprints', {}) if isinstance(sm, dict) else {}
    tf = cf.get('topologyFingerprint')
    if tf and isinstance(tf, str):
        parts = tf.split('|')
        if len(parts) >= 2:
            return parts[1]
    # fallback
    return 'unknown'


def is_ugly_decimal(v):
    if not isinstance(v, (int, float)):
        return False
    s = ('%f' % float(v)).rstrip('0').rstrip('.')
    if '.' in s:
        dec = s.split('.')[-1]
        return len(dec) > 2
    return False


def analyze():
    results = {}
    exports = [d for d in glob(os.path.join(EXPORTS, '*')) if os.path.isdir(d)]
    for exp in exports:
        corpus_path = os.path.join(exp, 'corpus.json')
        if not os.path.exists(corpus_path):
            continue
        corpus = load_corpus(corpus_path)
        if not corpus:
            continue
        # corpus may be list or dict with 'questions'
        items = corpus.get('questions') if isinstance(corpus, dict) and 'questions' in corpus else corpus
        for q in items:
            fam = get_family(q)
            stat = results.setdefault(fam, {'questions': 0, 'distractors_checked': 0, 'near_miss': 0, 'trivial': 0, 'ugly_decimal': 0, 'eliminate_risks': []})
            stat['questions'] += 1
            correct = None
            if isinstance(q.get('answer'), dict):
                correct = q['answer'].get('raw')
            else:
                correct = q.get('answer')
            # try displayedDistractors
            distractors = q.get('displayedDistractors') or []
            if not distractors and isinstance(q.get('options'), list):
                # try parse numeric options
                parsed = []
                for o in q.get('options'):
                    try:
                        val = float(str(o).replace('%','').replace(',',''))
                        parsed.append(val)
                    except Exception:
                        pass
                distractors = parsed
            for d in distractors:
                stat['distractors_checked'] += 1
                try:
                    dval = float(d)
                except Exception:
                    continue
                if correct is None:
                    continue
                try:
                    cval = float(correct)
                except Exception:
                    continue
                # near miss if within 15% relative or absolute difference small
                if cval != 0:
                    rel = abs((dval - cval) / (abs(cval) if cval != 0 else 1))
                else:
                    rel = abs(dval - cval)
                if rel <= 0.15:
                    stat['near_miss'] += 1
                # trivial if exactly 0, 100, or obviously impossible (negative for counts)
                if dval == 0 or dval == 100 or (cval >= 0 and dval < 0):
                    stat['trivial'] += 1
                if is_ugly_decimal(dval) or is_ugly_decimal(cval):
                    stat['ugly_decimal'] += 1
            # extract eliminateRisk if available
            di = q.get('distractorIntelligence') or []
            for ent in di:
                er = ent.get('eliminateRisk')
                if isinstance(er, (int, float)):
                    stat['eliminate_risks'].append(er)

    # finalize metrics
    summary = {}
    for fam, s in results.items():
        dq = s['distractors_checked'] or 1
        avg_elim = sum(s['eliminate_risks']) / len(s['eliminate_risks']) if s['eliminate_risks'] else None
        summary[fam] = {
            'questions': s['questions'],
            'distractors_checked': s['distractors_checked'],
            'near_miss_fraction': round(s['near_miss'] / dq, 3),
            'trivial_fraction': round(s['trivial'] / dq, 3),
            'ugly_decimal_fraction': round(s['ugly_decimal'] / dq, 3),
            'avg_eliminate_risk': round(avg_elim,2) if avg_elim is not None else None,
            'suggestion': (
                'Increase near-miss distractors' if (s['near_miss'] / dq) < 0.4 or s['trivial'] / dq > 0.25 else 'Distractors reasonable'
            )
        }

    out_json = os.path.join(EXPORTS, 'quant_distractor_report.json')
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump({'summary': summary}, f, indent=2)
    print('Wrote', out_json)


if __name__ == '__main__':
    analyze()
