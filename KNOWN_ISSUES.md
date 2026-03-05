# Known Content Formatting Issues

Issues identified during migration from Document360 to Docusaurus that need manual review.

## 1. Tables not closed properly

Some markdown tables are missing closing pipes or have malformed rows, causing them to render as plain text instead of tables.

**How to find:** Search for lines starting with `|` that don't end with `|`, or table rows with mismatched column counts.

**Example found:** `docs/updates/scrypto-updates/scrypto-v1-3-0.md` and similar pages may have broken table syntax.

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
