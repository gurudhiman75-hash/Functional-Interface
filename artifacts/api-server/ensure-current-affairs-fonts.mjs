import { createHash } from "node:crypto";
import { access, copyFile, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_CACHE_DIR = path.join(artifactDir, ".runtime-assets", "current-affairs-fonts");

export const CURRENT_AFFAIRS_FONT_UPSTREAM = {
  repository: "google/fonts",
  commit: "ade3d1533e06b2b1462ffcde8e08b129627ca360",
  license: "SIL Open Font License 1.1",
};

export const CURRENT_AFFAIRS_FONT_ASSETS = [
  {
    key: "devanagari",
    family: "Noto Sans Devanagari",
    fileName: "NotoSansDevanagari.ttf",
    upstreamPath: "ofl/notosansdevanagari/NotoSansDevanagari%5Bwdth%2Cwght%5D.ttf",
    expectedSize: 647144,
    expectedGitBlobSha1: "e703d5282088c4b7787b1a4c5f057cf18f0998d6",
    licenseFileName: "NotoSansDevanagari-OFL.txt",
    licenseUpstreamPath: "ofl/notosansdevanagari/OFL.txt",
    licenseExpectedSize: 4386,
    licenseExpectedGitBlobSha1: "cd2cc5c94b4151933eba6ee508e3975274d6fa07",
  },
  {
    key: "gurmukhi",
    family: "Noto Sans Gurmukhi",
    fileName: "NotoSansGurmukhi.ttf",
    upstreamPath: "ofl/notosansgurmukhi/NotoSansGurmukhi%5Bwdth%2Cwght%5D.ttf",
    expectedSize: 268608,
    expectedGitBlobSha1: "49878eb913077538cc8973dcf4ad7c51f3e5fb22",
    licenseFileName: "NotoSansGurmukhi-OFL.txt",
    licenseUpstreamPath: "ofl/notosansgurmukhi/OFL.txt",
    licenseExpectedSize: 4384,
    licenseExpectedGitBlobSha1: "e8052c2011abfc237708eed25640ac87545af65d",
  },
];

const DOWNLOAD_TIMEOUT_MS = 25_000;
const DOWNLOAD_ATTEMPTS = 3;
const MAX_FONT_BYTES = 2_000_000;
const MAX_LICENSE_BYTES = 20_000;

function gitBlobSha1(buffer) {
  return createHash("sha1")
    .update(Buffer.from(`blob ${buffer.length}\0`, "utf8"))
    .update(buffer)
    .digest("hex");
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function assetUrl(upstreamPath) {
  return `https://raw.githubusercontent.com/${CURRENT_AFFAIRS_FONT_UPSTREAM.repository}/${CURRENT_AFFAIRS_FONT_UPSTREAM.commit}/${upstreamPath}`;
}

function verifyBytes(buffer, expectedSize, expectedGitBlobSha1, label) {
  if (!Buffer.isBuffer(buffer)) throw new Error(`${label} verification received non-buffer content`);
  if (buffer.length !== expectedSize) {
    throw new Error(`${label} byte-size mismatch: expected ${expectedSize}, got ${buffer.length}`);
  }
  const actualGitBlobSha1 = gitBlobSha1(buffer);
  if (actualGitBlobSha1 !== expectedGitBlobSha1) {
    throw new Error(`${label} Git blob mismatch: expected ${expectedGitBlobSha1}, got ${actualGitBlobSha1}`);
  }
  return {
    bytes: buffer.length,
    gitBlobSha1: actualGitBlobSha1,
    sha256: sha256(buffer),
  };
}

async function readVerifiedFile(filePath, expectedSize, expectedGitBlobSha1, label) {
  try {
    const buffer = await readFile(filePath);
    return { buffer, verification: verifyBytes(buffer, expectedSize, expectedGitBlobSha1, label) };
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") return null;
    if (error instanceof Error && /mismatch/.test(error.message)) return null;
    throw error;
  }
}

async function downloadBytes(url, maxBytes, label) {
  let lastError = null;
  for (let attempt = 1; attempt <= DOWNLOAD_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/octet-stream,text/plain;q=0.9,*/*;q=0.1",
          "User-Agent": "Examtree-Current-Affairs-Build/1.0",
        },
      });
      if (!response.ok) throw new Error(`${label} upstream returned HTTP ${response.status}`);
      const contentLength = Number(response.headers.get("content-length") ?? 0);
      if (contentLength > maxBytes) throw new Error(`${label} upstream payload exceeds ${maxBytes} bytes`);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length > maxBytes) throw new Error(`${label} downloaded payload exceeds ${maxBytes} bytes`);
      return buffer;
    } catch (error) {
      lastError = error;
      if (attempt < DOWNLOAD_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(`${label} download failed after ${DOWNLOAD_ATTEMPTS} attempts: ${lastError instanceof Error ? lastError.message : "unknown error"}`);
}

async function ensureOneFile({ destination, url, expectedSize, expectedGitBlobSha1, maxBytes, label }) {
  const existing = await readVerifiedFile(destination, expectedSize, expectedGitBlobSha1, label);
  if (existing) return { ...existing.verification, downloaded: false, path: destination };

  const buffer = await downloadBytes(url, maxBytes, label);
  const verification = verifyBytes(buffer, expectedSize, expectedGitBlobSha1, label);
  const temporary = `${destination}.tmp-${process.pid}-${Date.now()}`;
  await writeFile(temporary, buffer, { flag: "wx" });
  try {
    await rename(temporary, destination);
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
  return { ...verification, downloaded: true, path: destination };
}

export async function ensureCurrentAffairsFonts(options = {}) {
  const cacheDir = path.resolve(options.cacheDir ?? DEFAULT_CACHE_DIR);
  const copyToDir = options.copyToDir ? path.resolve(options.copyToDir) : null;
  await mkdir(cacheDir, { recursive: true });
  if (copyToDir) await mkdir(copyToDir, { recursive: true });

  const assets = [];
  for (const descriptor of CURRENT_AFFAIRS_FONT_ASSETS) {
    const fontPath = path.join(cacheDir, descriptor.fileName);
    const licensePath = path.join(cacheDir, descriptor.licenseFileName);
    const font = await ensureOneFile({
      destination: fontPath,
      url: assetUrl(descriptor.upstreamPath),
      expectedSize: descriptor.expectedSize,
      expectedGitBlobSha1: descriptor.expectedGitBlobSha1,
      maxBytes: MAX_FONT_BYTES,
      label: `${descriptor.family} font`,
    });
    const license = await ensureOneFile({
      destination: licensePath,
      url: assetUrl(descriptor.licenseUpstreamPath),
      expectedSize: descriptor.licenseExpectedSize,
      expectedGitBlobSha1: descriptor.licenseExpectedGitBlobSha1,
      maxBytes: MAX_LICENSE_BYTES,
      label: `${descriptor.family} license`,
    });

    if (copyToDir) {
      await copyFile(fontPath, path.join(copyToDir, descriptor.fileName));
      await copyFile(licensePath, path.join(copyToDir, descriptor.licenseFileName));
    }
    assets.push({
      key: descriptor.key,
      family: descriptor.family,
      fileName: descriptor.fileName,
      font,
      license: {
        fileName: descriptor.licenseFileName,
        ...license,
      },
    });
  }

  const manifest = {
    schemaVersion: 1,
    upstream: CURRENT_AFFAIRS_FONT_UPSTREAM,
    generatedAt: new Date().toISOString(),
    assets: assets.map((asset) => ({
      key: asset.key,
      family: asset.family,
      fileName: asset.fileName,
      bytes: asset.font.bytes,
      gitBlobSha1: asset.font.gitBlobSha1,
      sha256: asset.font.sha256,
      licenseFileName: asset.license.fileName,
      licenseGitBlobSha1: asset.license.gitBlobSha1,
      licenseSha256: asset.license.sha256,
    })),
  };
  await writeFile(path.join(cacheDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  if (copyToDir) await writeFile(path.join(copyToDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  return { cacheDir, copyToDir, assets, manifest };
}

async function main() {
  const result = await ensureCurrentAffairsFonts();
  for (const asset of result.assets) {
    console.log(`[current-affairs-fonts] ${asset.family}: ${asset.font.bytes} bytes · git ${asset.font.gitBlobSha1} · sha256 ${asset.font.sha256}`);
  }
  console.log(`[current-affairs-fonts] verified pinned assets from ${CURRENT_AFFAIRS_FONT_UPSTREAM.repository}@${CURRENT_AFFAIRS_FONT_UPSTREAM.commit}`);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error("Current Affairs font bootstrap failed", error);
    process.exit(1);
  });
}
