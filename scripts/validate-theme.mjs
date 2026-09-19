#!/usr/bin/env bun
/**
 * Backri Shopify theme pre-upload validation checklist.
 *
 * Usage:
 *   bun scripts/validate-theme.mjs [path-to-theme-folder-or-zip]
 *
 * Defaults to /mnt/documents/shopify-theme/backri-theme-files
 * Exit code 1 when any FAIL is reported.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";

const DEFAULT_THEME = "/mnt/documents/shopify-theme/backri-theme-files";

const REQUIRED_DIRS = ["assets", "config", "layout", "locales", "sections", "snippets", "templates"];
const REQUIRED_FILES = [
  "layout/theme.liquid",
  "config/settings_schema.json",
  "config/settings_data.json",
  "locales/en.default.json",
  "locales/ar.json",
  "templates/index.json",
  "templates/product.json",
  "templates/collection.json",
  "templates/cart.json",
  "templates/404.json",
  "templates/search.json",
  "templates/page.json",
  "templates/blog.json",
  "templates/article.json",
  "templates/list-collections.json",
  "templates/gift_card.liquid",
  "templates/customers/login.liquid",
  "templates/customers/register.liquid",
  "templates/customers/account.liquid",
  "templates/customers/order.liquid",
  "templates/customers/addresses.liquid",
  "templates/customers/reset_password.liquid",
  "templates/customers/activate_account.liquid",
];

const PAIRED_TAGS = [
  "if",
  "unless",
  "case",
  "for",
  "capture",
  "form",
  "paginate",
  "schema",
  "style",
  "javascript",
  "stylesheet",
  "comment",
  "raw",
  "tablerow",
  "liquid_block_never",
];

const results = [];
function add(group, level, message, detail) {
  results.push({ group, level, message, detail });
}

/* ------------------------------------------------------------------ setup */

function resolveTheme(input) {
  const target = input || DEFAULT_THEME;
  if (!fs.existsSync(target)) {
    console.error(`Theme not found: ${target}`);
    process.exit(2);
  }
  if (fs.statSync(target).isDirectory()) return { root: target, temp: null };
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "theme-check-"));
  execSync(`unzip -q ${JSON.stringify(target)} -d ${JSON.stringify(temp)}`);
  // zips may wrap everything in a single folder
  const entries = fs.readdirSync(temp);
  const root =
    entries.length === 1 && fs.statSync(path.join(temp, entries[0])).isDirectory()
      ? path.join(temp, entries[0])
      : temp;
  return { root, temp };
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/* ----------------------------------------------------- 1. required files */

function checkStructure(root) {
  const group = "Required files";
  for (const dir of REQUIRED_DIRS) {
    const full = path.join(root, dir);
    if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
      add(group, "pass", `Folder ${dir}/ present`);
    } else {
      add(group, "fail", `Folder ${dir}/ is missing`, "Shopify rejects a theme without this folder.");
    }
  }
  for (const file of REQUIRED_FILES) {
    if (fs.existsSync(path.join(root, file))) add(group, "pass", `${file} present`);
    else add(group, "fail", `${file} is missing`);
  }
  // no stray top-level files/folders
  const allowed = new Set([...REQUIRED_DIRS, "blocks", "release-notes.md", ".shopify", ".gitignore"]);
  for (const entry of fs.readdirSync(root)) {
    if (!allowed.has(entry)) {
      add(group, "warn", `Unexpected top-level entry "${entry}"`, "Shopify ignores or rejects files outside the standard folders.");
    }
  }
}

/* --------------------------------------------------- 2. template JSON ok */

function checkTemplateJson(root) {
  const group = "Template JSON";
  const files = walk(path.join(root, "templates")).filter((f) => f.endsWith(".json"));
  const sectionNames = new Set(
    walk(path.join(root, "sections"))
      .filter((f) => f.endsWith(".liquid"))
      .map((f) => path.basename(f, ".liquid")),
  );
  for (const file of files) {
    const rel = path.relative(root, file);
    let data;
    try {
      data = readJson(file);
    } catch (error) {
      add(group, "fail", `${rel} is not valid JSON`, String(error.message));
      continue;
    }
    if (!data.sections || typeof data.sections !== "object") {
      add(group, "fail", `${rel} has no "sections" object`);
      continue;
    }
    if (!Array.isArray(data.order)) {
      add(group, "fail", `${rel} has no "order" array`);
    } else {
      for (const id of data.order) {
        if (!data.sections[id]) add(group, "fail", `${rel} order lists "${id}" but no such section entry`);
      }
    }
    for (const [id, section] of Object.entries(data.sections)) {
      if (!section.type) {
        add(group, "fail", `${rel} section "${id}" has no type`);
      } else if (!sectionNames.has(section.type)) {
        add(group, "fail", `${rel} uses section "${section.type}" which does not exist in sections/`);
      }
    }
    add(group, "pass", `${rel} structure valid`);
  }
}

/* ------------------------------------------------------ 3. liquid syntax */

function stripLiteralBlocks(source) {
  // keep length so line numbers stay accurate
  return source.replace(/{%-?\s*(raw|comment|schema|style|javascript|stylesheet)\s*-?%}([\s\S]*?){%-?\s*end\1\s*-?%}/g, (m) =>
    m.replace(/[^\n]/g, " "),
  );
}

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length;
}

function checkLiquid(root) {
  const group = "Liquid syntax";
  const files = walk(root).filter((f) => f.endsWith(".liquid"));
  for (const file of files) {
    const rel = path.relative(root, file);
    const raw = fs.readFileSync(file, "utf8");

    // unbalanced delimiters
    const openTags = (raw.match(/{%/g) || []).length;
    const closeTags = (raw.match(/%}/g) || []).length;
    if (openTags !== closeTags) {
      add(group, "fail", `${rel}: unbalanced {% %} delimiters`, `${openTags} opening vs ${closeTags} closing`);
    }
    const openOut = (raw.match(/{{/g) || []).length;
    const closeOut = (raw.match(/}}/g) || []).length;
    if (openOut !== closeOut) {
      add(group, "fail", `${rel}: unbalanced {{ }} delimiters`, `${openOut} opening vs ${closeOut} closing`);
    }

    // paired block tags
    const scan = stripLiteralBlocks(raw);
    const stack = [];
    const tagRe = /{%-?\s*(end)?(\w+)/g;
    let match;
    while ((match = tagRe.exec(scan))) {
      const [, end, name] = match;
      if (end) {
        if (!PAIRED_TAGS.includes(name)) continue;
        const top = stack.pop();
        if (!top) add(group, "fail", `${rel}:${lineOf(scan, match.index)} stray {% end${name} %}`);
        else if (top.name !== name)
          add(group, "fail", `${rel}:${lineOf(scan, match.index)} {% end${name} %} closes {% ${top.name} %} opened on line ${top.line}`);
      } else if (PAIRED_TAGS.includes(name)) {
        stack.push({ name, line: lineOf(scan, match.index) });
      }
    }
    for (const open of stack) {
      add(group, "fail", `${rel}: {% ${open.name} %} on line ${open.line} is never closed`);
    }

    // literal blocks must be closed too
    for (const name of ["schema", "style", "javascript", "stylesheet", "raw", "comment"]) {
      const opens = (raw.match(new RegExp(`{%-?\\s*${name}\\s*-?%}`, "g")) || []).length;
      const ends = (raw.match(new RegExp(`{%-?\\s*end${name}\\s*-?%}`, "g")) || []).length;
      if (opens !== ends) add(group, "fail", `${rel}: ${opens} {% ${name} %} vs ${ends} {% end${name} %}`);
    }

    // schema JSON must parse
    const schema = raw.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/);
    if (schema) {
      try {
        const parsed = JSON.parse(schema[1]);
        if (rel.startsWith("sections") && !parsed.name) {
          add(group, "warn", `${rel}: schema has no "name", the editor shows a blank label`);
        }
      } catch (error) {
        add(group, "fail", `${rel}: {% schema %} JSON is invalid`, String(error.message));
      }
    } else if (rel.startsWith("sections")) {
      add(group, "warn", `${rel}: section has no {% schema %} block`);
    }
  }
  add(group, "pass", `${files.length} Liquid files parsed`);
}

/* ---------------------------------------------- 4. snippets and sections */

function checkReferences(root) {
  const group = "Includes";
  const snippets = new Set(
    walk(path.join(root, "snippets"))
      .filter((f) => f.endsWith(".liquid"))
      .map((f) => path.relative(path.join(root, "snippets"), f).replace(/\.liquid$/, "")),
  );
  const sections = new Set(
    walk(path.join(root, "sections"))
      .filter((f) => f.endsWith(".liquid"))
      .map((f) => path.basename(f, ".liquid")),
  );
  for (const file of walk(root).filter((f) => f.endsWith(".liquid"))) {
    const rel = path.relative(root, file);
    const raw = fs.readFileSync(file, "utf8");
    for (const m of raw.matchAll(/{%-?\s*(?:render|include)\s+'([^']+)'/g)) {
      if (!snippets.has(m[1])) add(group, "fail", `${rel} renders snippet '${m[1]}' which does not exist`);
    }
    for (const m of raw.matchAll(/{%-?\s*section\s+'([^']+)'/g)) {
      if (!sections.has(m[1])) add(group, "fail", `${rel} includes section '${m[1]}' which does not exist`);
    }
  }
  add(group, "pass", `${snippets.size} snippets and ${sections.size} sections cross-checked`);
}

/* -------------------------------------------------- 5. asset references */

function checkAssets(root) {
  const group = "Assets";
  const assetDir = path.join(root, "assets");
  const present = new Set(fs.existsSync(assetDir) ? fs.readdirSync(assetDir) : []);
  const referenced = new Set();
  const textFiles = walk(root).filter((f) => /\.(liquid|json|css|js)$/.test(f));
  for (const file of textFiles) {
    const rel = path.relative(root, file);
    const raw = fs.readFileSync(file, "utf8");
    for (const m of raw.matchAll(/['"]([\w@.-]+\.(?:png|jpe?g|gif|svg|webp|css|js|woff2?|ico))['"]\s*\|\s*asset(?:_url|_img_url)/g)) {
      referenced.add(m[1]);
      if (!present.has(m[1])) add(group, "fail", `${rel} references missing asset "${m[1]}"`);
    }
  }
  const unused = [...present].filter((f) => !referenced.has(f));
  if (unused.length) {
    add(group, "warn", `${unused.length} asset file(s) never referenced`, unused.join(", "));
  }
  if (!present.has("theme.css")) add(group, "fail", "assets/theme.css is missing");
  for (const brand of ["backri-logo.png", "favicon.png", "hero.jpg"]) {
    if (present.has(brand)) add(group, "pass", `Brand asset ${brand} bundled`);
    else add(group, "warn", `Brand asset ${brand} not bundled — that spot looks empty on first load`);
  }
  // oversized assets slow the storefront
  for (const f of present) {
    const size = fs.statSync(path.join(assetDir, f)).size;
    if (size > 400 * 1024) add(group, "warn", `${f} is ${(size / 1024 / 1024).toFixed(2)} MB`, "Compress under 400 KB for faster mobile loads.");
  }
  add(group, "pass", `${referenced.size} asset references resolved`);
}

/* ------------------------------------------- 6. Arabic storefront checks */

function flatten(obj, prefix = "", out = new Set()) {
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") flatten(value, full, out);
    else out.add(full);
  }
  return out;
}

const ARABIC_RE = /[\u0600-\u06FF]/;

function checkArabic(root) {
  const group = "Arabic storefront";
  const layout = path.join(root, "layout/theme.liquid");
  if (fs.existsSync(layout)) {
    const raw = fs.readFileSync(layout, "utf8");
    if (/dir=("|')?{%/.test(raw) || /dir="{{/.test(raw) || /rtl/.test(raw)) add(group, "pass", "Page direction switches to right-to-left for Arabic");
    else add(group, "fail", "Layout never sets dir=rtl — Arabic pages read the wrong way round");
    if (/request\.locale\.iso_code/.test(raw)) add(group, "pass", "Layout reads the shopper's language from Shopify");
    else add(group, "fail", "Layout does not detect the shopper's language");
    if (/Noto\+Kufi\+Arabic|Noto Kufi Arabic/.test(raw)) add(group, "pass", "Arabic font loaded in the layout");
    else add(group, "warn", "Arabic font not loaded — Arabic text falls back to a system font");
  }
  const css = path.join(root, "assets/theme.css");
  if (fs.existsSync(css)) {
    const raw = fs.readFileSync(css, "utf8");
    if (/is-rtl/.test(raw)) add(group, "pass", "Right-to-left styling rules present");
    else add(group, "warn", "No right-to-left styling rules found in theme.css");
    if (/font-arabic|Noto Kufi Arabic/.test(raw)) add(group, "pass", "Arabic font family defined in styles");
    else add(group, "warn", "Arabic font family not defined in styles");
  }

  // locale parity
  const en = path.join(root, "locales/en.default.json");
  const ar = path.join(root, "locales/ar.json");
  if (fs.existsSync(en) && fs.existsSync(ar)) {
    let enJson, arJson;
    try {
      enJson = readJson(en);
      arJson = readJson(ar);
    } catch (error) {
      add(group, "fail", "A translation file is not valid JSON", String(error.message));
      return;
    }
    const enKeys = flatten(enJson);
    const arKeys = flatten(arJson);
    const missing = [...enKeys].filter((k) => !arKeys.has(k));
    const extra = [...arKeys].filter((k) => !enKeys.has(k));
    if (missing.length) add(group, "fail", `${missing.length} English phrase(s) have no Arabic translation`, missing.join(", "));
    else add(group, "pass", "Every English phrase has an Arabic translation");
    if (extra.length) add(group, "warn", `${extra.length} Arabic phrase(s) have no English counterpart`, extra.join(", "));

    // untranslated values
    const untranslated = [];
    const visit = (o, prefix = "") => {
      for (const [k, v] of Object.entries(o)) {
        const full = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === "object") visit(v, full);
        else if (typeof v === "string" && v.trim() && !ARABIC_RE.test(v)) untranslated.push(full);
      }
    };
    visit(arJson);
    if (untranslated.length) add(group, "warn", `${untranslated.length} Arabic entr(ies) still hold non-Arabic text`, untranslated.join(", "));
    else add(group, "pass", "All Arabic entries contain Arabic text");
  }

  // bilingual section settings
  const sections = walk(path.join(root, "sections")).filter((f) => f.endsWith(".liquid"));
  const bilingual = sections.filter((f) => /_ar["']|_ar\b/.test(fs.readFileSync(f, "utf8")));
  if (bilingual.length) add(group, "pass", `${bilingual.length} section(s) offer an Arabic field beside the English one`);
  else add(group, "warn", "No section offers a separate Arabic text field");

  // currency
  const settingsData = path.join(root, "config/settings_data.json");
  if (fs.existsSync(settingsData)) {
    const raw = fs.readFileSync(settingsData, "utf8");
    if (/AED|د\.إ/.test(raw)) add(group, "pass", "AED wording present in theme settings");
  }
  const hardcodedCurrency = [];
  for (const file of walk(root).filter((f) => f.endsWith(".liquid"))) {
    const raw = fs.readFileSync(file, "utf8");
    if (/\$\s*{{\s*\w+.*money/.test(raw) || /(?<!\\)\$\d/.test(raw.replace(/{%[\s\S]*?%}/g, ""))) {
      hardcodedCurrency.push(path.relative(root, file));
    }
  }
  if (hardcodedCurrency.length)
    add(group, "warn", "A hard-coded $ sign appears next to a price", hardcodedCurrency.join(", "));
  else add(group, "pass", "Prices use Shopify's own currency formatting");
}

/* ---------------------------------------------------- 7. settings schema */

function checkSettings(root) {
  const group = "Theme settings";
  const schemaFile = path.join(root, "config/settings_schema.json");
  if (!fs.existsSync(schemaFile)) return;
  let schema;
  try {
    schema = readJson(schemaFile);
  } catch (error) {
    add(group, "fail", "config/settings_schema.json is not valid JSON", String(error.message));
    return;
  }
  if (!Array.isArray(schema)) {
    add(group, "fail", "settings_schema.json must be a list");
    return;
  }
  const info = schema.find((s) => s.name === "theme_info");
  if (!info) add(group, "fail", 'settings_schema.json has no "theme_info" entry');
  else {
    for (const key of ["theme_name", "theme_version", "theme_author"]) {
      if (info[key]) add(group, "pass", `${key}: ${info[key]}`);
      else add(group, "warn", `theme_info is missing ${key}`);
    }
  }
  const ids = new Set();
  for (const group_ of schema) {
    for (const setting of group_.settings || []) {
      if (!setting.id) continue;
      if (ids.has(setting.id)) add(group, "fail", `Duplicate setting id "${setting.id}"`);
      ids.add(setting.id);
    }
  }
  const dataFile = path.join(root, "config/settings_data.json");
  if (fs.existsSync(dataFile)) {
    try {
      const data = readJson(dataFile);
      const current = data.current || {};
      for (const key of Object.keys(current)) {
        if (key === "sections" || key === "content_for_index" || key === "blocks") continue;
        if (!ids.has(key)) add(group, "warn", `settings_data.json sets "${key}" which is not declared in settings_schema.json`);
      }
      add(group, "pass", "settings_data.json matches the declared settings");
    } catch (error) {
      add(group, "fail", "config/settings_data.json is not valid JSON", String(error.message));
    }
  }
}

/* ------------------------------------------------------------- reporting */

function report(root) {
  const order = ["fail", "warn", "pass"];
  const groups = [...new Set(results.map((r) => r.group))];
  const counts = { pass: 0, warn: 0, fail: 0 };
  for (const r of results) counts[r.level]++;

  const icon = { pass: "PASS", warn: "WARN", fail: "FAIL" };
  const lines = [];
  lines.push(`Backri Shopify theme validation — ${root}`);
  lines.push("");
  for (const group of groups) {
    const items = results.filter((r) => r.group === group).sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level));
    const worst = items.some((i) => i.level === "fail") ? "FAIL" : items.some((i) => i.level === "warn") ? "WARN" : "PASS";
    lines.push(`## ${group} — ${worst}`);
    for (const item of items) {
      lines.push(`  [${icon[item.level]}] ${item.message}${item.detail ? `\n         ${item.detail}` : ""}`);
    }
    lines.push("");
  }
  lines.push(`Summary: ${counts.fail} failing, ${counts.warn} warnings, ${counts.pass} passing`);
  lines.push(counts.fail === 0 ? "Verdict: ready to upload to Shopify." : "Verdict: fix the failing items before uploading.");
  const text = lines.join("\n");
  console.log(text);
  return { text, counts };
}

/* ------------------------------------------------------------------ main */

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const outFlag = process.argv.find((a) => a.startsWith("--out="));
const { root, temp } = resolveTheme(args[0]);

checkStructure(root);
checkTemplateJson(root);
checkLiquid(root);
checkReferences(root);
checkAssets(root);
checkArabic(root);
checkSettings(root);

const { text, counts } = report(root);
if (outFlag) {
  const out = outFlag.slice("--out=".length);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, text);
  console.log(`\nReport written to ${out}`);
}
if (temp) fs.rmSync(temp, { recursive: true, force: true });
process.exit(counts.fail > 0 ? 1 : 0);
