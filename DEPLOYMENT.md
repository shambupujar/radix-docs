# Deployment Guide

This site is built with [Docusaurus 3](https://docusaurus.io/). The primary deployment is **GitHub Pages** (automated via CI/CD). Alternatively, you can manually deploy to **Cloudflare Pages**.

## Prerequisites

- Node.js 20+
- npm

## Local Build & Preview

```bash
npm ci
npm run build
npx serve build       # preview at http://localhost:3000
```

---

## GitHub Pages (Primary)

Deployment is automated via `.github/workflows/deploy.yml`. Pushing to the `release` branch triggers a build and deploy to GitHub Pages. That way changes done can be verified before going live.
The current config in `docusaurus.config.js` is set for GitHub Pages:

```js
url: 'https://shambupujar.github.io',
baseUrl: '/radix-docs/',
```

Enable GitHub Pages in repo Settings → Pages → Source: "GitHub Actions".

---

## Cloudflare Pages (Manual Alternative)

If you want to deploy to Cloudflare Pages instead, follow these steps.

### 1. Config Changes

Update `docusaurus.config.js` before building:

```js
url: 'https://<your-project-name>.pages.dev',  // or your custom domain
baseUrl: '/',                                   // Cloudflare serves from root, not a subpath
```

> **Note:** The `<your-project-name>.pages.dev` subdomain is assigned when you create the project in step 3. The name must be globally unique across all Cloudflare Pages users. If `radix-docs` is taken, choose a different name (e.g. `radixdlt-docs`) and use that consistently in all commands below.

### 2. Setup Wrangler

Authenticate with Cloudflare (uses `npx` to ensure wrangler v2+):

```bash
npx wrangler login
```

### 3. Create the Pages Project

```bash
npx wrangler@latest pages project create radix-docs --production-branch=release
```

> If you have multiple Cloudflare accounts, set `CLOUDFLARE_ACCOUNT_ID` first:
> ```bash
> export CLOUDFLARE_ACCOUNT_ID=<your-account-id>
> ```

### 4. Build & Deploy

```bash
npm run build
npx wrangler@latest pages deploy build --project-name=radix-docs
```

Your site will be available at `https://<your-project-name>.pages.dev`.

### 5. Local Preview with Wrangler

```bash
npm run build
npx wrangler pages dev build
```

### 6. Custom Domain (e.g. docs.radixdlt.com)

1. Go to Cloudflare dashboard → Pages → `radix-docs` project → Custom domains.
2. Add `docs.radixdlt.com` (or your domain).
3. If your domain is already on Cloudflare DNS, it's automatic. Otherwise, Cloudflare will provide DNS records to configure.
4. Update the `url` in `docusaurus.config.js` to match:
   ```js
   url: 'https://docs.radixdlt.com',
   ```

### 7. Optional: CI/CD for Cloudflare Pages

If you want automated Cloudflare deployments, replace the GitHub Pages workflow with:

```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [release]
permissions:
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy build --project-name=radix-docs
```

**Required GitHub Secrets:**

| Secret | How to get it |
|--------|--------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → any domain → Overview → right sidebar "Account ID" |
