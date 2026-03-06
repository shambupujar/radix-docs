# Known Content Formatting Issues

Issues identified during migration from Document360 to Docusaurus that need manual review.

## 1. Table formatting issues

Some tables had formatting problems from the Document360 migration.

**Scan results:** All docs scanned for HTML tables, empty header cells, and malformed markdown tables.

**Fixed:**
- `docs/build/native-blueprints/locker.md` — 10 verbose HTML tables (each ~130 lines) compacted to match `pool.md` format (~15 lines each). Added missing `</table>` closing tags and `<tbody>` wrappers.
- `docs/reference/sbor/sbor-value-model.md` line 71 — "Map" row was missing its label/description in the Composite Value Kinds table. Added description to match Array/Tuple/Enum rows.

**No fix needed (intentional patterns):**
- `docs/build/native-blueprints/pool.md` lines 80–88 — Role/permissions table with blank first column header (row labels in first column). Renders correctly.
- `docs/build/native-blueprints/pool.md` lines 378–385, 393–400 — Key-value API tables with empty header rows. Deliberate documentation pattern for method reference.
- `docs/reference/concepts/environments.md` line 55 — `<br/>` tags inside table cell for line breaks between list items. Valid HTML, renders correctly.

## 2. Bullet points not appearing

Numbered lists and bullet points were collapsed onto single lines during the Gitbook export, with `\*` used inline instead of proper markdown list syntax. This causes them to render as a wall of text.

**How to find:** Search for lines longer than ~300 characters containing ` \* ` or ` 1. ` inline patterns.

**Scan results:** All docs scanned for lines >300 chars with inline list patterns. Only real issues found and fixed below.

**Fixed:**
- `docs/build/dapp-transactions/pre-authorizations-subintents.md` — four sections fixed (Pre-authorization Flow, Delegated Fees, User Badge Deposit, Co-ordinated ticket purchase)
- `docs/reference/concepts/addresses.md` line 22 — numbered list (Entity Byte / Address Bytes) collapsed onto single line
- `docs/reference/concepts/index.md` line 22 — same content, same fix

**False positives (no fix needed):**
- `docs/build/dapp-development/dapp-definition-setup.md` line 38 — properly formatted sub-item, just a long sentence
- `docs/build/dapp-transactions/pre-authorizations-subintents.md` lines 42, 48, 49 — properly structured bullets, just naturally long content

## 3. Collapsibles missing

Document360 uses collapsible/accordion sections (e.g., `<details>`/`<summary>` or custom markup). These were lost during migration and need to be re-added manually using Docusaurus-compatible syntax.

**Docusaurus syntax:**
```markdown
<details>
<summary>Click to expand</summary>

Content goes here.

</details>
```

**How to find:** Compare pages with the original at https://docs.radixdlt.com/ — look for sections that were hidden behind "expand" or "show more" toggles on the original site but appear as flat content (or are missing entirely) in the current docs.
