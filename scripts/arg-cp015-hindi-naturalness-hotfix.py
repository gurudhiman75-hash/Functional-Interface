from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-final-editorial-quality.ts")
source = SOURCE_PATH.read_text(encoding="utf-8")

# Human review of the certified Hindi corpus exposed a small family of literal
# translation artefacts in QL003. Keep the weak-argument logic unchanged while
# rendering the statements and arguments in normal exam Hindi.
repair_anchor = '    .replace(/अधिकांश उम्मीदवार और केंद्र प्रभावित था/g, "अधिकांश उम्मीदवार और केंद्र प्रभावित थे");'
repairs = [
    '    .replace(/अलग किया गया गीले और सूखे कचरे फिर मिल सकता है/g, "अलग किया गया गीला और सूखा कचरा फिर मिल सकता है")',
    '    .replace(/पूरी तरह डिजिटल परीक्षा केंद्र पर चला जाना चाहिए/g, "पूरी तरह डिजिटल परीक्षा केंद्रों में आयोजित किया जाना चाहिए")',
    '    .replace(/स्थिर कनेक्टिविटी चाहे जो हो/g, "भले ही स्थिर कनेक्टिविटी उपलब्ध हो")',
    '    .replace(/अभ्यर्थी सहायता और बैकअप व्यवस्था चाहे जो हो/g, "भले ही अभ्यर्थी सहायता और बैकअप व्यवस्था उपलब्ध हो")',
    '    .replace(/सुरक्षित डिवाइस और केंद्र चाहे जो हो/g, "भले ही सुरक्षित डिवाइस और केंद्र उपलब्ध हों")',
    '    .replace(/अधिकांश जगह दो सप्ताह में सीधे उपलब्ध/g, "अधिकांश स्थानों पर दो सप्ताह में अपने-आप उपलब्ध")',
    '    .replace(/का अधिकांश भाग जमीन से दोबारा बनाना पड़ेगा/g, "के बड़े हिस्से का पुनर्निर्माण करना पड़ेगा")',
    '    .replace(/बैकअप संभाल के बिना अपवाद के अधिकांश प्रकार संभाल सकता है/g, "बैकअप सहायता के बिना भी अधिकांश प्रकार के अपवाद संभाल सकता है")',
]
if any(repair not in source for repair in repairs):
    if repair_anchor not in source:
        alternatives = [
            '    .replace(/बैकअप संभाल के बिना अपवाद के अधिकांश प्रकार संभाल सकता है/g, "बैकअप सहायता के बिना भी अधिकांश प्रकार के अपवाद संभाल सकता है");',
            '    .replace(/का अधिकांश भाग जमीन से दोबारा बनाना पड़ेगा/g, "के बड़े हिस्से का पुनर्निर्माण करना पड़ेगा");',
        ]
        matches = [candidate for candidate in alternatives if candidate in source]
        if len(matches) != 1:
            raise SystemExit(f"Hindi QL003 naturalness repair: expected one terminal repair anchor, found {len(matches)}")
        terminal = matches[0]
    else:
        terminal = repair_anchor

    missing = [repair for repair in repairs if repair not in source]
    if missing:
        replacement = terminal[:-1] + "\n" + "\n".join(missing) + ";"
        source = source.replace(terminal, replacement, 1)

# Put the narrow permanence family immediately before the existing broad
# time-slot/queue/rebuild fallback.
permanence_rule = '  if (/समय-स्लॉट.*(?:स्थायी रूप से अव्यावहारिक|स्थायी रूप से अनुपलब्ध|सफलतापूर्वक देना स्थायी)/.test(argument)) return "समय-स्लॉट से कुछ पहुँच या संचालन कठिनाइयाँ हो सकती हैं, लेकिन इससे सेवा स्थायी रूप से अव्यावहारिक या अनुपलब्ध हो जाएगी, यह निष्कर्ष उचित नहीं है।";\n'
broad_time_slot_rule = '  if (/समय-स्लॉट|कतार|पुनर्निर्माण/.test(argument)) return "यह तर्क प्रस्तावित व्यवस्था के लिए एक बड़े कार्यान्वयन अवरोध को बिना प्रमाण मान लेता है और कम-कठोर विकल्पों पर विचार नहीं करता।";\n'
if permanence_rule not in source:
    count = source.count(broad_time_slot_rule)
    if count != 1:
        raise SystemExit(f"Hindi QL003 permanence routing: expected one broad time-slot anchor, found {count}")
    source = source.replace(broad_time_slot_rule, permanence_rule + broad_time_slot_rule, 1)

# Dimension-specific explanations for rapid digital-rollout overclaims.
function_anchor = 'function specificHindiReason(argument: string): string {\n'
rules = [
    ('निर्णय घोषित.*(?:स्थिर )?कनेक्टिविटी.*(?:उपलब्ध हो जाए|उपलब्ध हो जाएगी|उपलब्ध)', 'केवल निर्णय घोषित करने से आवश्यक स्थिर कनेक्टिविटी अपने-आप उपलब्ध नहीं हो जाती; दो सप्ताह की तैयारी के लिए नेटवर्क क्षमता की अलग जाँच और योजना चाहिए।'),
    ('निर्णय घोषित.*सुरक्षित डिवाइस और केंद्र.*(?:उपलब्ध हो जाएँगे|उपलब्ध)', 'केवल निर्णय घोषित करने से पर्याप्त सुरक्षित डिवाइस और परीक्षा-केंद्र क्षमता दो सप्ताह में अपने-आप तैयार नहीं हो जाती; इसके लिए अलग संसाधन और क्षमता-योजना चाहिए।'),
    ('निर्णय घोषित.*अभ्यर्थी सहायता और बैकअप व्यवस्था.*(?:उपलब्ध हो जाएँगी|उपलब्ध)', 'केवल निर्णय घोषित करने से पर्याप्त अभ्यर्थी सहायता और बैकअप व्यवस्था दो सप्ताह में अपने-आप उपलब्ध नहीं हो जाती; इनके लिए अलग स्टाफिंग और संचालन योजना चाहिए।'),
]
for pattern, reason in rules:
    rule = f'  if (/{pattern}/.test(argument)) return "{reason}";\n'
    if rule not in source:
        count = source.count(function_anchor)
        if count != 1:
            raise SystemExit(f"Hindi QL003 semantic reason: expected one function anchor, found {count}")
        source = source.replace(function_anchor, function_anchor + rule, 1)

# The finalizer normally re-routes only boilerplate/generic weak reasons. Some
# older Banking combo questions already carry the broad time-slot sentence,
# which is technically "specific" and therefore used to bypass the new narrow
# permanence router. Force this semantic family through specificReason every
# time so an old broad explanation cannot survive finalization.
old_finalizer = '      if (strengths[index] === "WEAK" && (boilerplateReason(reason, language) || genericFallbackReason(reason, language))) return specificReason(deduped.arguments[index]!, language);'
new_finalizer = '''      const forceHindiTimeSlotPermanence = language === "hi"
        && /समय-स्लॉट.*(?:स्थायी रूप से अव्यावहारिक|स्थायी रूप से अनुपलब्ध|सफलतापूर्वक देना स्थायी)/.test(deduped.arguments[index]!);
      if (strengths[index] === "WEAK" && (forceHindiTimeSlotPermanence || boilerplateReason(reason, language) || genericFallbackReason(reason, language))) return specificReason(deduped.arguments[index]!, language);'''
if new_finalizer not in source:
    count = source.count(old_finalizer)
    if count != 1:
        raise SystemExit(f"Hindi QL003 forced permanence reroute: expected one finalizer anchor, found {count}")
    source = source.replace(old_finalizer, new_finalizer, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 Hindi QL003 naturalness and semantic hotfix applied")
