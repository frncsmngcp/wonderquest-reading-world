#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const modulePath = path.join(root, "modules", "kuwento-tayo.html");
const outDir = path.join(root, "assets", "audio", "kuwento-tayo", "filipino");
const manifestPath = path.join(root, "assets", "audio", "kuwento-tayo", "filipino-manifest.json");

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.TTS_MODEL || "gpt-4o-mini-tts";
const voice = process.env.TTS_VOICE || "alloy";
const limit = Number(process.env.TTS_LIMIT || 0);
const force = process.argv.includes("--force");
const listOnly = process.argv.includes("--list");

if (!apiKey && !listOnly) {
  console.error("Set OPENAI_API_KEY before running this generator.");
  process.exit(1);
}

function slugify(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/gi, "n")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "audio";
}

function audioKey(text) {
  return String(text || "").trim().toLocaleLowerCase("fil").normalize("NFC");
}

function extractStories(source) {
  const startMarker = "const STORIES=";
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error("Could not find STORIES.");
  const bodyStart = start + startMarker.length;
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let i = bodyStart; i < source.length; i++) {
    const char = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth++;
    if (char === "}") {
      depth--;
      if (depth === 0) return Function(`"use strict";return (${source.slice(bodyStart, i + 1)});`)();
    }
  }
  throw new Error("Could not finish reading STORIES.");
}

function unique(values) {
  const seen = new Set();
  return values.filter(value => {
    const key = audioKey(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractReadTexts(source) {
  const stories = extractStories(source);
  const texts = [];
  for (const book of stories.fil || []) {
    texts.push(...book.scenes);
    for (const question of book.questions) {
      texts.push(`${question[0]}. A. ${question[1][0]}. B. ${question[1][1]}. C. ${question[1][2]}`);
    }
  }
  return unique(texts);
}

async function generateSpeech(text, filePath) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      voice,
      input: text,
      instructions: "Narrate this Filipino children's reading passage naturally for pupils in the Philippines. Warm teacher voice, clear pacing, native-sounding Tagalog/Filipino pronunciation. Say only the provided text.",
      response_format: "mp3"
    })
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  }

  await writeFile(filePath, Buffer.from(await response.arrayBuffer()));
}

await mkdir(outDir, { recursive: true });

const source = await readFile(modulePath, "utf8");
const texts = extractReadTexts(source);
const selected = limit > 0 ? texts.slice(0, limit) : texts;

if (listOnly) {
  console.log(JSON.stringify(selected, null, 2));
  console.error(`Kuwento Tayo Filipino audio lines: ${selected.length}`);
  process.exit(0);
}

let manifest = {};

if (existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    manifest = {};
  }
}

let created = 0;
let skipped = 0;

for (const [index, text] of selected.entries()) {
  const filename = `${String(index + 1).padStart(4, "0")}-${slugify(text)}.mp3`;
  const filePath = path.join(outDir, filename);
  const appUrl = `../assets/audio/kuwento-tayo/filipino/${filename}`;

  if (!force && existsSync(filePath)) {
    manifest[audioKey(text)] = appUrl;
    skipped++;
    continue;
  }

  process.stdout.write(`Generating ${text.slice(0, 60).replace(/\s+/g, " ")}... `);
  await generateSpeech(text, filePath);
  manifest[audioKey(text)] = appUrl;
  created++;
  process.stdout.write("done\n");
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Finished. Generated ${created}, reused ${skipped}. Manifest: ${manifestPath}`);
