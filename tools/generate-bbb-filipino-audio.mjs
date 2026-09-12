#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const modulePath = path.join(root, "modules", "basa-bata-basa.html");
const outDir = path.join(root, "assets", "audio", "basa-bata-basa", "filipino");
const manifestPath = path.join(root, "assets", "audio", "basa-bata-basa", "filipino-manifest.json");

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.TTS_MODEL || "gpt-4o-mini-tts";
const voice = process.env.TTS_VOICE || "alloy";
const limit = Number(process.env.TTS_LIMIT || 0);
const force = process.argv.includes("--force");

if (!apiKey) {
  console.error("Set OPENAI_API_KEY before running this generator.");
  process.exit(1);
}

function slugify(word) {
  return String(word)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "n")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function audioKey(word) {
  return String(word || "").trim().toLocaleLowerCase("fil").normalize("NFC");
}

function extractFilipinoWords(source) {
  const match = source.match(/const\s+FILIPINO\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) throw new Error("Could not find the FILIPINO word list.");
  return Function(`"use strict";return (${match[1]});`)();
}

async function generateSpeech(word, filePath) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      voice,
      input: word,
      instructions: "Read this as one natural Filipino/Tagalog sight word for a young learner in the Philippines. Warm, clear, native-sounding pronunciation. No extra words.",
      response_format: "mp3"
    })
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, buffer);
}

await mkdir(outDir, { recursive: true });

const source = await readFile(modulePath, "utf8");
const words = extractFilipinoWords(source);
const selected = limit > 0 ? words.slice(0, limit) : words;
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

for (const word of selected) {
  const key = audioKey(word);
  const filename = `${String(words.indexOf(word) + 1).padStart(3, "0")}-${slugify(word)}.mp3`;
  const filePath = path.join(outDir, filename);
  const appUrl = `../assets/audio/basa-bata-basa/filipino/${filename}`;

  if (!force && existsSync(filePath)) {
    manifest[key] = appUrl;
    skipped++;
    continue;
  }

  process.stdout.write(`Generating ${word}... `);
  await generateSpeech(word, filePath);
  manifest[key] = appUrl;
  created++;
  process.stdout.write("done\n");
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Finished. Generated ${created}, reused ${skipped}. Manifest: ${manifestPath}`);
