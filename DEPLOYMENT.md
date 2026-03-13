# Deployment Guide

This site is built with [Docusaurus 3](https://docusaurus.io/). The primary deployment is **GitHub Pages** (automated via CI/CD). Alternatively, you can manually deploy to **Cloudflare Pages**.

## Prerequisites

- Node.js 20+
- npm

## Environment-Based Config

The `docusaurus.config.js` uses the `DEPLOY_TARGET` environment variable to set the correct `url` and `baseUrl`:

| Variable | Values | Description |
|----------|--------|-------------|
| `DEPLOY_TARGET` | `cloudflare` (or unset) | When set to `cloudflare`, builds for Cloudflare Pages (`baseUrl: '/'`). Otherwise defaults to GitHub Pages (`baseUrl: '/radix-docs/'`). |
| `SITE_URL` | Any URL | Optional. Override the site URL for Cloudflare builds (e.g. `https://docs.radixdlt.com`). Defaults to `https://radix-docs-ahe.pages.dev`. |

## Local Build & Preview

```bash
npm ci
npm run build                    # builds for GitHub Pages (default)
npx serve build
```

---

## GitHub Pages (Primary)

Deployment is automated via `.github/workflows/deploy.yml`. Pushing to the `release` branch triggers a build and deploy to GitHub Pages. That way changes done can be verified before going live.

No env vars needed — the default config targets GitHub Pages:

```
url: https://shambupujar.github.io
baseUrl: /radix-docs/
```

Enable GitHub Pages in repo Settings → Pages → Source: "GitHub Actions".

---

## Cloudflare Pages (Manual Alternative)

### 1. Setup Wrangler

Authenticate with Cloudflare (uses `npx` to ensure wrangler v2+):

```bash
npx wrangler login
```

### 2. Create the Pages Project

```bash
npx wrangler@latest pages project create radix-docs --production-branch=release
```

> If you have multiple Cloudflare accounts, set `CLOUDFLARE_ACCOUNT_ID` first:
> ```bash
> export CLOUDFLARE_ACCOUNT_ID=<your-account-id>
> ```

### 3. Build & Deploy

```bash
DEPLOY_TARGET=cloudflare npm run build
npx wrangler@latest pages deploy build --project-name=radix-docs
```

To use a custom domain URL:

```bash
DEPLOY_TARGET=cloudflare SITE_URL=https://docs.radixdlt.com npm run build
npx wrangler@latest pages deploy build --project-name=radix-docs
```

Your site will be available at `https://<your-project-name>.pages.dev`.

### 4. Local Preview with Wrangler

```bash
DEPLOY_TARGET=cloudflare npm run build
npx wrangler pages dev build
```

### 5. Custom Domain (e.g. docs.radixdlt.com)

1. Go to Cloudflare dashboard → Pages → `radix-docs` project → Custom domains.
2. Add `docs.radixdlt.com` (or your domain).
3. If your domain is already on Cloudflare DNS, it's automatic. Otherwise, Cloudflare will provide DNS records to configure.
4. Use `SITE_URL` when building to match the custom domain (see step 3 above).

### 6. Optional: CI/CD for Cloudflare Pages

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
      - run: DEPLOY_TARGET=cloudflare npm run build
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
