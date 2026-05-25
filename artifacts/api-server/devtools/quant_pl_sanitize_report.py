import os
import json
import csv
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


def is_profit_loss_family(fam):
    if not fam:
        return False
    return fam.startswith('pl_') or 'profit' in fam or 'loss' in fam


def sanitize():
    exports = [d for d in glob(os.path.join(EXPORTS, '*')) if os.path.isdir(d)]
    rows = []
    issues = {}
    for exp in exports:
        corpus_path = os.path.join(exp, 'corpus.json')
        if not os.path.exists(corpus_path):
            continue
        corpus = load_corpus(corpus_path)
        if not corpus:
            continue
        items = corpus.get('questions') if isinstance(corpus, dict) and 'questions' in corpus else corpus
        for q in items:
            # detect family
            fam = 'unknown'
            topo = q.get('topology')
            if topo and isinstance(topo, dict):
                fam = topo.get('family') or fam
            else:
                sm = q.get('semanticMetadata', {})
                cf = sm.get('corpusFingerprints', {}) if isinstance(sm, dict) else {}
                tf = cf.get('topologyFingerprint')
                if tf and isinstance(tf, str):
                    parts = tf.split('|')
                    if len(parts) >= 2:
                        fam = parts[1]
            if not is_profit_loss_family(fam):
                continue
            correct = None
            if isinstance(q.get('answer'), dict):
                correct = q['answer'].get('raw')
            else:
                correct = q.get('answer')
            distractors = q.get('displayedDistractors') or []
            if not distractors and isinstance(q.get('options'), list):
                parsed = []
                for o in q.get('options'):
                    try:
                        parsed.append(float(str(o).replace('%','').replace(',','')))
                    except Exception:
                        pass
                distractors = parsed
            # checks
            ugly = False
            large_scale = False
            try:
                cval = float(correct) if correct is not None else None
            except Exception:
                cval = None
            if cval is not None:
                frac = str(cval).split('.')
                if len(frac) == 2 and len(frac[1]) > 2:
                    ugly = True
                if abs(cval) > 100000:
                    large_scale = True
            d_ugly = any((isinstance(d,(int,float)) and (len(str(d).split('.')[-1])>2)) for d in distractors)
            d_large = any((isinstance(d,(int,float)) and abs(d)>100000) for d in distractors)
            if d_ugly:
                ugly = True
            if d_large:
                large_scale = True
            suggestion = []
            if large_scale:
                suggestion.append('scale_down_values_or_use_thousands')
            if ugly:
                suggestion.append('round_answers_to_two_decimals_or_use_fractional_rendering')
            if not suggestion:
                suggestion = ['ok']
            rows.append({'export': os.path.basename(exp), 'id': q.get('id'), 'family': fam, 'correct': correct, 'distractors': distractors, 'ugly_decimal': ugly, 'large_scale': large_scale, 'suggestion': ';'.join(suggestion)})
            issues.setdefault(fam, {'count':0, 'ugly':0, 'large':0})
            issues[fam]['count'] += 1
            if ugly:
                issues[fam]['ugly'] += 1
            if large_scale:
                issues[fam]['large'] += 1

    out_json = os.path.join(EXPORTS, 'quant_pl_sanitize.json')
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump({'issues': issues}, f, indent=2)
    out_csv = os.path.join(EXPORTS, 'quant_pl_drilldown.csv')
    with open(out_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['export','id','family','correct','distractors','ugly_decimal','large_scale','suggestion'])
        writer.writeheader()
        for r in rows:
            writer.writerow(r)
    print('Wrote', out_json, out_csv)


if __name__ == '__main__':
    sanitize()
