import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let value = fs.readFileSync(path, "utf8");

value = value.replace(
  '    "coloured stone": { plural: "रंगीन पत्थर", oblique: "रंगीन पत्थरों", singular: "रंगीन पत्थर" },',
  '    "coloured stone": { plural: "रंगीन पत्थर", oblique: "रंगीन पत्थरों", singular: "रंगीन पत्थर" },\n    stones: { plural: "पत्थर", oblique: "पत्थरों", singular: "पत्थर" },\n    stone: { plural: "पत्थर", oblique: "पत्थरों", singular: "पत्थर" },',
);
value = value.replace(
  '    "coloured stone": { plural: "ਰੰਗੀਨ ਪੱਥਰ", oblique: "ਰੰਗੀਨ ਪੱਥਰਾਂ", singular: "ਰੰਗੀਨ ਪੱਥਰ" },',
  '    "coloured stone": { plural: "ਰੰਗੀਨ ਪੱਥਰ", oblique: "ਰੰਗੀਨ ਪੱਥਰਾਂ", singular: "ਰੰਗੀਨ ਪੱਥਰ" },\n    stones: { plural: "ਪੱਥਰ", oblique: "ਪੱਥਰਾਂ", singular: "ਪੱਥਰ" },\n    stone: { plural: "ਪੱਥਰ", oblique: "ਪੱਥਰਾਂ", singular: "ਪੱਥਰ" },',
);

fs.writeFileSync(path, value);
console.log("Added singular/plural stone aliases to Probability native explanation naturalizer.");
