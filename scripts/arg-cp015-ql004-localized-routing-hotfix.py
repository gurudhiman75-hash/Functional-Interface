from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-final-editorial-quality.ts")
source = SOURCE_PATH.read_text(encoding="utf-8")

old = '  if (/अस्थायी प्रतिबंध.*(?:आसपास|स्थानीय).*(?:अधिकांश|ज्यादातर).*(?:गतिविधि|गतिविधियों).*(?:स्थायी रूप से समाप्त|स्थायी रूप से खत्म|खत्म)/.test(argument)) return "अस्थायी भारी-वाहन प्रतिबंध से कुछ स्थानीय गतिविधि प्रभावित हो सकती है, लेकिन इससे आसपास की अधिकांश गतिविधियाँ स्थायी रूप से समाप्त हो जाएँगी, यह निष्कर्ष उचित नहीं है।";\n'
new = '  if (/(?:अस्थायी प्रतिबंध|भारी वाहनों की थोड़ी-सी सीमा).*?(?:आसपास|स्थानीय).*(?:अधिकांश|ज्यादातर).*(?:गतिविधि|गतिविधियों).*(?:स्थायी रूप से (?:समाप्त|खत्म|बर्बाद)|खत्म)/.test(argument)) return "अस्थायी या सीमित भारी-वाहन रोक से कुछ स्थानीय गतिविधि प्रभावित हो सकती है, लेकिन इससे आसपास की अधिकांश गतिविधि स्थायी रूप से बर्बाद हो जाएगी, यह निष्कर्ष उचित नहीं है।";\n'

if new not in source:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"QL004 Hindi activity routing hotfix: expected exactly one old rule, found {count}")
    source = source.replace(old, new, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 QL004 Hindi activity routing hotfix applied")
