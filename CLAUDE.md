# Radix Docs Migration Agent

## Purpose

This agent validates and updates the Docusaurus migration of the Radix documentation site. The original site is at https://docs.radixdlt.com/ (hosted on Document360). The Docusaurus site is in this directory (`radix-docs/`).

## Source of Truth

The **live site at https://docs.radixdlt.com/** is the source of truth for sidebar names and hierarchy. The extracted sidebar structure is stored in `scripts/original_sidebar.json`.

The original site is a Document360 Angular SPA. The sidebar cannot be scraped automatically. To update the reference:
1. Open https://docs.radixdlt.com/ in a browser
2. Expand all sidebar sections
3. Copy the sidebar HTML from the browser DevTools (`<site-docs-left-panel-container>` element)
4. Parse the `aria-label` attributes on `<a>` tags and the nesting depth (count `.filler` divs per node)
5. Update `scripts/original_sidebar.json`

## URL Path Strategy

The original site uses flat URLs: `/docs/<slug>` (e.g., `/docs/asset-oriented`).

Docusaurus organizes files in nested folders but serves them at the original URLs using **`slug` frontmatter** in each markdown file. The `routeBasePath` is set to `docs` in `docusaurus.config.js`.

**How it works:**
- Each markdown file has `slug: /<original-slug>` in its frontmatter
- Combined with `routeBasePath: 'docs'`, this produces URLs like `/docs/<original-slug>`
- The slug was derived from `file_mapping.json`: strip `articles/` or `categories/` prefix and `.md` suffix from the gitbook source key

**Scripts:**
- `scripts/add_slugs.js` — Injects/updates slug frontmatter in all docs (dry run by default, `--apply` to write)
- `scripts/compare_sidebars.js` — Compares sidebar structure AND verifies URL paths

## Key Files

- `sidebars.js` — Docusaurus sidebar configuration
- `scripts/original_sidebar.json` — Extracted sidebar from docs.radixdlt.com
- `scripts/compare_sidebars.js` — Automated comparison tool (labels, hierarchy, URL paths)
- `scripts/add_slugs.js` — Slug frontmatter injection script
- `file_mapping.json` — Maps gitbook source files to Docusaurus destinations
- `docs/` — All markdown documentation files

## Sidebar Comparison

Run the comparison script:
```bash
node scripts/compare_sidebars.js
```

This reports:
- **Collapsed sections** — sections in original_sidebar.json not yet expanded; need manual verification
- **Label mismatches** — where the Docusaurus label differs from the original site
- **Hierarchy differences** — items under the wrong parent category
- **Missing pages** — items in original but not in Docusaurus sidebar
- **URL path issues** — docs with slugs not present in the sidebar
- **Child count mismatches** — sections with different numbers of children

## Known Differences from Original

### Structure
| Original (docs.radixdlt.com)         | Docusaurus (sidebars.js)           | Notes                                |
|--------------------------------------|------------------------------------|--------------------------------------|
| "Welcome" is a single article        | "Welcome" is a category with 2 items | Getting Started + Getting Help |
| "Getting Help" under Essentials      | "Getting Help" under Welcome       | Moved to different parent            |
| Integrate has "Integrate with Radix" wrapper | Direct children under Integrate | Extra nesting on original |
| Network APIs: 2 children (no Gateway SDK) | Network APIs: 3 children (incl. Gateway SDK) | Gateway SDK missing on original |
| Radix Engine Toolkit > "Getting Started" | "Installation" label             | Label mismatch |
| Radix Engine Toolkit > "Usage Guide" is subcategory | Flat doc | Different nesting |
| "Integrator Concepts" under Reference | "Concepts" under Reference         | Label renamed                        |
| "Standards" subcategory in Reference | Not present                        | Collapsed/missing                    |
| "Radix Engine" subcategory in Reference | Not present                     | Collapsed/missing                    |
| "Transactions" subcategory in Reference | Not present                     | Collapsed/missing                    |
| "SBOR Serialization" in Reference    | "SBOR" in Reference                | Label shortened                      |

### Collapsed (Unverified) Sections
The following Reference sections were collapsed in the captured HTML:
- Reference > Standards
- Reference > Radix Engine
- Reference > Transactions

Build, Run, and Updates sections were derived from SUMMARY.md (not live site HTML). Labels and children may differ from the live site.

## How to Fix Issues

### Fix a label mismatch
1. Check the sidebar label source:
   - Explicit `label` field in `sidebars.js`
   - `sidebar_label` frontmatter in the markdown file
   - `title` frontmatter in the markdown file
2. Update to match the original site's label

### Fix a hierarchy issue
1. Move the doc entry in `sidebars.js` to the correct parent category
2. May also need to move the markdown file to a different `docs/` subdirectory

### Add a missing page
1. Check if the markdown file exists in `docs/` (it may have a different name)
2. Add the entry to the correct location in `sidebars.js`
3. If the file doesn't exist, it may need to be created or migrated

### Update URL slugs
1. Edit the `slug` frontmatter in the markdown file
2. Or update `file_mapping.json` and re-run `node scripts/add_slugs.js --apply`

### Update the reference sidebar
When the user provides new sidebar HTML from docs.radixdlt.com:
1. Parse the HTML — each sidebar item is a `<div>` with id `node-*`
2. Items have `<a>` tags with `aria-label` (the display name) and `href` (the slug)
3. Nesting depth is indicated by the number of `<div class="filler">` elements
4. Categories have `class="default-category"` and a collapse/expand arrow
5. Update `scripts/original_sidebar.json` with the parsed data

## Docusaurus Commands

```bash
npm start    # Start dev server
npm run build # Build for production
npm run clear # Clear build cache
```
