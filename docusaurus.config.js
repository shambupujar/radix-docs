// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Radix Documentation',
  tagline: 'Build better dApps on Radix',
  favicon: 'img/radix-logo.svg',

  future: {
    v4: true,
  },

  // Set DEPLOY_TARGET=cloudflare to build for Cloudflare Pages, defaults to GitHub Pages
  url: process.env.DEPLOY_TARGET === 'cloudflare'
    ? (process.env.SITE_URL || 'https://radix-docs-ahe.pages.dev')
    : 'https://shambupujar.github.io',
  baseUrl: process.env.DEPLOY_TARGET === 'cloudflare' ? '/' : '/radix-docs/',



  organizationName: 'radixdlt',
  projectName: 'radix-docs',

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    format: 'md',  // Use standard markdown instead of MDX
    preprocessor: ({filePath, fileContent}) => {
      // Remove data URI images that cause issues
      return fileContent.replace(/!\[[^\]]*\]\(data:image\/[^)]+\)/g, '');
    },
  },

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        docsRouteBasePath: 'docs',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',  // Match original /docs/ path prefix
        },
        blog: false,  // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/radix-social-card.svg',
      metadata: [
        {name: 'og:title', content: 'Radix Technical Documentation'},
        {name: 'og:description', content: 'Build better dApps on Radix'},
      ],
      colorMode: {
        respectPrefersColorScheme: true,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,  // Right-side TOC for h2-h4
      },
      navbar: {
        title: 'Radix Docs',
        logo: {
          alt: 'Radix Logo',
          src: 'img/radix-logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/radixdlt',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/getting-started',
              },
              {
                label: 'Build',
                to: '/docs/getting-rust-scrypto',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/radixdlt',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/radaborat',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/radixdlt',
              },
              {
                label: 'Radix Website',
                href: 'https://radixdlt.com',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Radix DLT. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['rust', 'toml', 'bash', 'json'],
      },
    }),
};

export default config;
