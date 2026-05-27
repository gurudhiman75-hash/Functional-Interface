import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
export_dir = root / 'artifacts' / 'api-server' / 'exports' / 'corpus-2026-05-25-202620'
input_path = export_dir / 'corpus.json'
output_path = export_dir / 'corpus.fixed.json'

# Indices where Hindi and Punjabi translations should remove English leakage.
translation_fix_indices = {13, 16, 20, 25, 35, 39, 51, 64, 71, 81}

hi_replacements = {
    'Only Mathematics': 'केवल गणित',
    'Only English': 'केवल अंग्रेजी',
    'region': 'क्षेत्र',
    'kg': 'किग्रा',
}
pa_replacements = {
    'Only Mathematics': 'ਸਿਰਫ਼ ਗਣਿਤ',
    'Only English': 'ਸਿਰਫ਼ ਅੰਗਰੇਜ਼ੀ',
    'region': 'ਖੇਤਰ',
    'kg': 'ਕਿਲੋ',
}

intro_text = {
    'en': "Let's solve this step by step.",
    'hi': 'आइए इसे चरण-दर-चरण हल करें।',
    'pa': 'ਆਓ ਇਸਨੂੰ ਕਦਮ-ਦਰ-ਕਦਮ ਹੱਲ ਕਰੀਏ।',
}

formula_pattern = re.compile(r'[0-9]|\+|\-|×|/|=|percent|%|\b×\b|\bx\b|\bX\b')

def rewrite_explanation(expl, lang):
    lines = [ln.strip() for ln in expl.splitlines() if ln.strip()]
    rewritten = []
    for ln in lines:
        stripped = ln.strip()
        lower = stripped.lower()
        if stripped.endswith(':'):
            if lower.startswith('only mathematics'):
                rewritten.append('Calculate the only mathematics portion:')
                continue
            if lower.startswith('only english'):
                rewritten.append('Calculate the only English portion:')
                continue
            if lower.startswith('percentage for at least one category'):
                rewritten.append('Next, find the percentage for at least one category:')
                continue
            if lower.startswith('percentage passing both subjects'):
                rewritten.append('Then find the percentage of students passing both subjects:')
                continue
            if lower.startswith('total students'):
                rewritten.append('Then calculate the total number of students:')
                continue
            if lower.startswith('100% total setup') or lower.startswith('100% संबंध') or lower.startswith('100% ਸੰਬੰਧ'):
                rewritten.append('First, set up the 100% total:')
                continue
            rewritten.append('Then ' + stripped)
            continue
        if stripped.startswith('='):
            value = stripped[1:].strip()
            rewritten.append('That gives ' + value)
            continue
        if '=' in stripped:
            if lower.startswith(('assume', 'let', 'since', 'so', 'now', 'then', 'next', 'first', 'finally', 'calculate', 'solve', 'set', 'find', 'this', 'that', 'hence', 'therefore', 'let original', 'let the', 'already', 'note', 'until')):
                rewritten.append(stripped)
                continue
            if lower.startswith(('total students =', 'total sugar stock =', 'original price per kg =', 'maximum marks =', 'total marks =', 'final population =', 'remaining income index =', 'total votes =')):
                rewritten.append('So ' + stripped)
                continue
            if lower.startswith(('total sugar stock', 'only mathematics', 'only english', 'percentage in', 'percentage for', 'new price', 'old quantity', 'new quantity', 'quantity reduction', 'original price', 'maximum marks', 'remaining income index', 'calculate', 'x =', 'a =', 'b =', 'c =', 'd =')):
                rewritten.append('Calculate ' + stripped)
                continue
            rewritten.append('Calculate ' + stripped)
            continue
        rewritten.append(stripped)
    return '\n'.join(rewritten)

with input_path.open('r', encoding='utf-8') as f:
    corpus = json.load(f)

formula_indices = []
for q in corpus:
    en_expl = q.get('multilingual', {}).get('en', {}).get('explanation', '')
    lines = [ln.strip() for ln in en_expl.splitlines() if ln.strip()]
    if len(lines) >= 3:
        formula_lines = sum(1 for ln in lines if formula_pattern.search(ln))
        if formula_lines >= len(lines) - 2 or formula_lines >= 0.65 * len(lines):
            formula_indices.append(q['index'])

for q in corpus:
    idx = q['index']
    if idx in translation_fix_indices:
        hi = q['multilingual']['hi']
        pa = q['multilingual']['pa']
        for k, v in hi_replacements.items():
            hi['question'] = hi['question'].replace(k, v)
            hi['explanation'] = hi['explanation'].replace(k, v)
        for k, v in pa_replacements.items():
            pa['question'] = pa['question'].replace(k, v)
            pa['explanation'] = pa['explanation'].replace(k, v)
    if idx in formula_indices:
        for lang in ['en', 'hi', 'pa']:
            expl = q['multilingual'][lang]['explanation']
            rewritten = rewrite_explanation(expl, lang)
            if not rewritten.startswith(intro_text[lang]):
                rewritten = intro_text[lang] + '\n' + rewritten
            q['multilingual'][lang]['explanation'] = rewritten

with output_path.open('w', encoding='utf-8') as f:
    json.dump(corpus, f, ensure_ascii=False, indent=2)

print(f'Wrote fixed corpus to {output_path}')
print('Translation fix indices:', sorted(translation_fix_indices))
print('Formula explanation indices:', sorted(formula_indices))
