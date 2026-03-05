#!/usr/bin/env node

/**
 * Sidebar Comparison Tool
 *
 * Compares the original docs.radixdlt.com sidebar structure (from original_sidebar.json)
 * against the Docusaurus sidebars.js configuration.
 *
 * Matching uses the `slug` frontmatter in each markdown file to map original
 * Document360 slugs to Docusaurus doc IDs.
 *
 * Usage: node scripts/compare_sidebars.js
 */

const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");
const DOCS_DIR = path.join(ROOT, "docs");
const originalPath = path.join(__dirname, "original_sidebar.json");
const sidebarsPath = path.join(ROOT, "sidebars.js");

// ── helpers ──────────────────────────────────────────────────────────

function loadOriginal() {
  const raw = JSON.parse(fs.readFileSync(originalPath, "utf-8"));
  return raw.sidebar;
}

function loadDocusaurus() {
  delete require.cache[require.resolve(sidebarsPath)];
  return require(sidebarsPath).docsSidebar;
}

/**
 * Build a map of slug → docId by reading frontmatter from all markdown files.
 * e.g. "/asset-oriented" → "essentials/asset-oriented"
 */
function buildSlugToIdMap() {
  const slugMap = new Map();

  function walkDir(dir, prefix) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walkDir(path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
      } else if (entry.name.endsWith(".md")) {
        const filePath = path.join(dir, entry.name);
        const content = fs.readFileSync(filePath, "utf-8");
        const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (fmMatch) {
          const slugMatch = fmMatch[1].match(/^slug\s*:\s*(.+)$/m);
          if (slugMatch) {
            const slug = slugMatch[1].trim();
            // docId: relative path from docs/ without .md extension
            const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
            const docId = relPath.replace(/\.md$/, "");
            slugMap.set(slug, docId);
            // Also store without /index suffix for fallback matching
            if (docId.endsWith("/index")) {
              slugMap.set(slug + "__noindex", docId.replace(/\/index$/, ""));
            }
          }
        }
      }
    }
  }

  walkDir(DOCS_DIR, "");
  return slugMap;
}

/**
 * Flatten a Docusaurus sidebar tree into a list of
 * { label, id, depth, parent } entries.
 */
function flattenDocusaurus(items, depth = 0, parent = null) {
  const result = [];
  for (const item of items) {
    if (typeof item === "string") {
      const parts = item.split("/");
      const slug = parts[parts.length - 1];
      result.push({ label: slug, id: item, depth, parent, type: "doc" });
    } else if (item.type === "doc") {
      result.push({ label: item.label || item.id, id: item.id, depth, parent, type: "doc" });
    } else if (item.type === "category") {
      result.push({ label: item.label, id: item.link?.id || null, depth, parent, type: "category" });
      if (item.items) {
        result.push(...flattenDocusaurus(item.items, depth + 1, item.label));
      }
    }
  }
  return result;
}

/**
 * Flatten the original sidebar JSON.
 */
function flattenOriginal(items, depth = 0, parent = null) {
  const result = [];
  for (const item of items) {
    result.push({
      label: item.label,
      slug: item.slug || null,
      depth,
      parent,
      type: item.type || "article",
      collapsed: item.collapsed || false,
    });
    if (item.children && item.children.length > 0) {
      result.push(...flattenOriginal(item.children, depth + 1, item.label));
    }
  }
  return result;
}

/**
 * Normalise a label for fuzzy matching.
 */
function norm(label) {
  return label.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Extract slug key from original URL: "/docs/asset-oriented" → "asset-oriented"
 */
function slugToPattern(slug) {
  if (!slug) return null;
  return slug.replace(/^\/docs\//, "");
}

// ── main comparison ──────────────────────────────────────────────────

function compare() {
  const original = loadOriginal();
  const docusaurus = loadDocusaurus();

  const origFlat = flattenOriginal(original);
  const docFlat = flattenDocusaurus(docusaurus);

  // Build slug → docId map from frontmatter
  const slugToDocId = buildSlugToIdMap();

  // Build docId → Docusaurus sidebar entry map
  const docById = new Map();
  for (const d of docFlat) {
    if (d.id) docById.set(d.id, d);
  }

  /**
   * Find Docusaurus sidebar entry matching an original slug.
   * Uses the slug frontmatter map for accurate matching.
   */
  function findMatch(slug) {
    if (!slug) return null;
    const pattern = slugToPattern(slug);
    if (!pattern) return null;

    // Use slug frontmatter: "/asset-oriented" → docId
    const frontmatterSlug = "/" + pattern;
    const docId = slugToDocId.get(frontmatterSlug);
    if (docId) {
      if (docById.has(docId)) return docById.get(docId);
      // Try without /index for category landing pages
      const noIndex = docId.replace(/\/index$/, "");
      if (docById.has(noIndex)) return docById.get(noIndex);
    }

    // Fallback: try matching by last path segment
    for (const d of docFlat) {
      if (!d.id) continue;
      if (d.id.endsWith("/" + pattern) || d.id === pattern) return d;
    }

    return null;
  }

  console.log("=".repeat(70));
  console.log("SIDEBAR COMPARISON: docs.radixdlt.com vs Docusaurus");
  console.log("=".repeat(70));
  console.log();

  // ── 1. Collapsed sections ──

  const collapsed = origFlat.filter((o) => o.collapsed);
  if (collapsed.length > 0) {
    console.log("WARNING: COLLAPSED SECTIONS (need live site verification)");
    console.log("-".repeat(50));
    for (const c of collapsed) {
      const indent = "  ".repeat(c.depth);
      console.log(`  ${indent}${c.label} (under ${c.parent || "root"})`);
    }
    console.log();
    console.log("  Expand them on docs.radixdlt.com and update original_sidebar.json.");
    console.log();
  }

  // ── 2. Label mismatches ──

  console.log("LABEL DIFFERENCES");
  console.log("-".repeat(50));
  let labelIssues = 0;

  for (const o of origFlat) {
    if (o.collapsed) continue;
    const match = findMatch(o.slug);
    if (!match) continue;

    const origLabel = o.label.trim();
    const docLabel = (match.label || "").trim();

    // Skip if docLabel is just the slug (string-type sidebar item)
    if (docLabel === match.id?.split("/").pop()) continue;

    if (norm(origLabel) !== norm(docLabel)) {
      labelIssues++;
      console.log(`  Original:   "${origLabel}"`);
      console.log(`  Docusaurus: "${docLabel}"`);
      console.log(`  Slug:       ${slugToPattern(o.slug)}`);
      console.log();
    }
  }
  if (labelIssues === 0) {
    console.log("  No label mismatches found.");
    console.log();
  }

  // ── 3. Hierarchy differences ──

  console.log("HIERARCHY DIFFERENCES");
  console.log("-".repeat(50));
  let hierarchyIssues = 0;

  for (const o of origFlat) {
    if (o.collapsed) continue;
    const match = findMatch(o.slug);
    if (!match) continue;

    const origParent = o.parent || "(root)";
    const docParent = match.parent || "(root)";

    if (norm(origParent) !== norm(docParent)) {
      hierarchyIssues++;
      console.log(`  "${o.label}"`);
      console.log(`    Original parent:   "${origParent}"`);
      console.log(`    Docusaurus parent: "${docParent}"`);
      console.log();
    }
  }
  if (hierarchyIssues === 0) {
    console.log("  No hierarchy differences.");
    console.log();
  }

  // ── 4. Missing from Docusaurus ──

  console.log("MISSING FROM DOCUSAURUS");
  console.log("-".repeat(50));
  let missingCount = 0;

  for (const o of origFlat) {
    if (o.collapsed) continue;
    if (o.type === "category" && (!o.slug || o.slug === "")) continue;
    if (!o.slug) continue;

    const match = findMatch(o.slug);
    if (!match) {
      missingCount++;
      const indent = "  ".repeat(o.depth);
      console.log(`  ${indent}"${o.label}" (slug: ${slugToPattern(o.slug)}, parent: ${o.parent || "root"})`);
    }
  }
  if (missingCount === 0) {
    console.log("  All original items found in Docusaurus sidebar.");
  }
  console.log();

  // ── 5. URL path comparison ──

  console.log("URL PATH VERIFICATION");
  console.log("-".repeat(50));
  let urlIssues = 0;

  for (const o of origFlat) {
    if (o.collapsed || !o.slug) continue;
    const pattern = slugToPattern(o.slug);
    const frontmatterSlug = "/" + pattern;
    const docId = slugToDocId.get(frontmatterSlug);

    if (!docId) continue; // Already reported as missing

    // Verify the doc is in the sidebar (either directly or as a category link)
    const inSidebar = docById.has(docId) || docById.has(docId.replace(/\/index$/, ""));
    if (!inSidebar) {
      urlIssues++;
      console.log(`  "${o.label}" has slug /${pattern} but doc ${docId} is NOT in sidebar`);
    }
  }
  if (urlIssues === 0) {
    console.log("  All URL paths verified — docs with slugs are in the sidebar.");
  }
  console.log();

  // ── 6. Top-level structure ──

  console.log("TOP-LEVEL STRUCTURE COMPARISON");
  console.log("-".repeat(50));

  const origTopLevel = original.map((i) => i.label);
  const docTopLevel = docusaurus.map((i) => {
    if (typeof i === "string") return i;
    return i.label || i.id;
  });

  console.log("  Original:   ", origTopLevel.join(" | "));
  console.log("  Docusaurus: ", docTopLevel.join(" | "));
  console.log();

  // ── 7. Per-section child counts ──

  console.log("PER-SECTION CHILD COUNTS (original vs docusaurus)");
  console.log("-".repeat(50));

  for (const origSection of original) {
    const docSection = docusaurus.find(
      (d) => typeof d !== "string" && norm(d.label || "") === norm(origSection.label),
    );

    if (!docSection) {
      console.log(`  ${origSection.label}: EXISTS in original, MISSING in Docusaurus`);
      continue;
    }

    const origCount = origSection.children ? origSection.children.length : 0;
    const docCount = docSection.items ? docSection.items.length : 0;

    const status = origSection.collapsed
      ? " (collapsed - unverified)"
      : origCount === docCount
        ? " OK"
        : " MISMATCH";

    console.log(`  ${origSection.label}: original=${origCount}, docusaurus=${docCount}${status}`);
  }
  console.log();

  // ── Summary ──

  console.log("=".repeat(70));
  console.log("SUMMARY");
  console.log(`  Collapsed sections needing verification: ${collapsed.length}`);
  console.log(`  Label mismatches: ${labelIssues}`);
  console.log(`  Hierarchy differences: ${hierarchyIssues}`);
  console.log(`  Missing from Docusaurus sidebar: ${missingCount}`);
  console.log(`  URL path issues: ${urlIssues}`);
  console.log(`  Slug frontmatter entries: ${slugToDocId.size}`);
  console.log("=".repeat(70));
}

compare();
