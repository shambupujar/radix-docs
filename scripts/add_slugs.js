#!/usr/bin/env node

/**
 * Slug Injection Script
 *
 * Reads file_mapping.json to derive original Document360 slugs for each
 * Docusaurus markdown file, then injects `slug: /original-slug` into the
 * frontmatter of each file.
 *
 * Slug derivation rule:
 *   - Strip `articles/` or `categories/` prefix and `.md` suffix from the
 *     gitbook source key.
 *   - Special case: `README.md` → slug `/`
 *
 * Usage:
 *   node scripts/add_slugs.js          # Dry run (report only)
 *   node scripts/add_slugs.js --apply  # Actually modify files
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DOCS_DIR = path.join(ROOT, "docs");
const MAPPING_PATH = path.join(ROOT, "file_mapping.json");

const dryRun = !process.argv.includes("--apply");

if (dryRun) {
  console.log("DRY RUN — no files will be modified. Use --apply to write changes.\n");
}

// ── Load mapping ──

const mapping = JSON.parse(fs.readFileSync(MAPPING_PATH, "utf-8"));
const files = mapping.files;

// ── Derive slug from source key ──

function deriveSlug(sourceKey) {
  if (sourceKey === "README.md") return "/";

  let slug = sourceKey;

  // Strip prefix
  if (slug.startsWith("articles/")) {
    slug = slug.slice("articles/".length);
  } else if (slug.startsWith("categories/")) {
    slug = slug.slice("categories/".length);
  }

  // Strip .md suffix
  if (slug.endsWith(".md")) {
    slug = slug.slice(0, -3);
  }

  return "/" + slug;
}

// ── Parse and update frontmatter ──

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { hasFrontmatter: false, frontmatter: "", body: content };

  return {
    hasFrontmatter: true,
    frontmatter: match[1],
    body: content.slice(match[0].length),
  };
}

function addSlugToFrontmatter(content, slug) {
  const { hasFrontmatter, frontmatter, body } = parseFrontmatter(content);

  if (!hasFrontmatter) {
    // Add new frontmatter block
    return `---\nslug: ${slug}\n---\n${content}`;
  }

  // Check if slug already exists
  if (/^slug\s*:/m.test(frontmatter)) {
    // Replace existing slug
    const updatedFm = frontmatter.replace(/^slug\s*:.*$/m, `slug: ${slug}`);
    return `---\n${updatedFm}\n---${body}`;
  }

  // Add slug to existing frontmatter
  return `---\n${frontmatter}\nslug: ${slug}\n---${body}`;
}

// ── Main ──

const slugMap = new Map(); // slug → [sourceKey, destFile] for collision detection
const results = { updated: 0, skipped: 0, missing: 0, collisions: [] };

for (const [sourceKey, destFile] of Object.entries(files)) {
  const slug = deriveSlug(sourceKey);
  const filePath = path.join(DOCS_DIR, destFile);

  // Check for slug collisions
  if (slugMap.has(slug)) {
    const existing = slugMap.get(slug);
    results.collisions.push({
      slug,
      files: [existing, { sourceKey, destFile }],
    });
  }
  slugMap.set(slug, { sourceKey, destFile });

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`  MISSING: ${destFile} (source: ${sourceKey})`);
    results.missing++;
    continue;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const updated = addSlugToFrontmatter(content, slug);

  if (content === updated) {
    results.skipped++;
    continue;
  }

  if (dryRun) {
    console.log(`  WOULD SET: ${destFile} → slug: ${slug}`);
  } else {
    fs.writeFileSync(filePath, updated, "utf-8");
    console.log(`  SET: ${destFile} → slug: ${slug}`);
  }
  results.updated++;
}

// ── Report ──

console.log("\n" + "=".repeat(60));
console.log("SUMMARY");
console.log(`  Files to update: ${results.updated}`);
console.log(`  Already correct: ${results.skipped}`);
console.log(`  Missing files:   ${results.missing}`);
console.log(`  Slug collisions: ${results.collisions.length}`);

if (results.collisions.length > 0) {
  console.log("\nSLUG COLLISIONS:");
  for (const c of results.collisions) {
    console.log(`  slug: ${c.slug}`);
    for (const f of c.files) {
      console.log(`    ${f.sourceKey} → ${f.destFile}`);
    }
  }
}
console.log("=".repeat(60));
