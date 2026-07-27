import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const DEVICE_SAFE_CSS = `
*,*::before,*::after{box-sizing:border-box}
.card,.card *{min-width:0}
.card,details,.question,.steps,.trace{max-width:100%}
.steps{padding-inline-start:1.5rem}
.trace,.proof,summary,p,h1,h2,li,header span{overflow-wrap:anywhere;word-break:normal}
details{overflow-x:hidden}
`;

async function htmlFiles(root: string): Promise<string[]> {
  const entries = await readdir(root);
  const result: string[] = [];
  for (const entry of entries) {
    const path = resolve(root, entry);
    const info = await stat(path);
    if (info.isDirectory()) result.push(...await htmlFiles(path));
    else if (entry.endsWith(".html")) result.push(path);
  }
  return result;
}

async function main(): Promise<void> {
  const root = resolve(process.argv[2] ?? "ops-001-device-review");
  const files = await htmlFiles(root);
  if (files.length !== 3) throw new Error(`Expected three review HTML files; found ${files.length}.`);
  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (!source.includes("</style>")) throw new Error(`No style boundary found in ${file}.`);
    const patched = source.replace("</style>", `${DEVICE_SAFE_CSS}</style>`);
    await writeFile(file, patched, "utf8");
  }
  console.log("OPS-001 device-safe review shell applied.", { files });
}

await main();
