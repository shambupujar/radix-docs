// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

const baseUrl = process.env.DEPLOY_TARGET === 'cloudflare' ? '/' : '/radix-docs/';

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
  baseUrl,



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
      let content = fileContent.replace(/!\[[^\]]*\]\(data:image\/[^)]+\)/g, '');

      // Replace seed node variables
      const seedNodes = {
        MAINNET_SEED_NODES: [
          'radix://node_rdx1qf2x63qx4jdaxj83kkw2yytehvvmu6r2xll5gcp6c9rancmrfsgfw0vnc65@babylon-mainnet-eu-west-1-node1.radixdlt.com',
          'radix://node_rdx1qgxn3eeldj33kd98ha6wkjgk4k77z6xm0dv7mwnrkefknjcqsvhuu4gc609@babylon-mainnet-ap-south-1-node0.radixdlt.com',
        ],
        STOKENET_SEED_NODES: [
          'radix://node_tdx_2_1qv89yg0la2jt429vqp8sxtpg95hj637gards67gpgqy2vuvwe4s5ss0va2y@babylon-stokenet-ap-south-1-node0.radixdlt.com',
          'radix://node_tdx_2_1qvtd9ffdhxyg7meqggr2ezsdfgjre5aqs6jwk5amdhjg86xhurgn5c79t9t@babylon-stokenet-ap-southeast-2-node0.radixdlt.com',
          'radix://node_tdx_2_1qwfh2nn0zx8cut5fqfz6n7pau2f7vdyl89mypldnn4fwlhaeg2tvunp8s8h@babylon-stokenet-eu-west-1-node0.radixdlt.com',
          'radix://node_tdx_2_1qwz237kqdpct5l3yjhmna66uxja2ymrf3x6hh528ng3gtvnwndtn5rsrad4@babylon-stokenet-us-east-1-node1.radixdlt.com',
        ],
      };
      content = content.replace(/\{\{MAINNET_SEED_NODES\}\}/g, seedNodes.MAINNET_SEED_NODES.join('\n'));
      content = content.replace(/\{\{STOKENET_SEED_NODES\}\}/g, seedNodes.STOKENET_SEED_NODES.join('\n'));
      content = content.replace(/\{\{MAINNET_SEED_NODES_CSV\}\}/g, seedNodes.MAINNET_SEED_NODES.join(','));
      content = content.replace(/\{\{STOKENET_SEED_NODES_CSV\}\}/g, seedNodes.STOKENET_SEED_NODES.join(','));

      return content;
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
            type: 'dropdown',
            label: 'API Reference',
            position: 'left',
            items: [
              {
                label: 'Core API',
                href: `${baseUrl}api-reference/core-api-specs.html`,
                target: '_blank',
              },
              {
                label: 'Gateway API',
                href: `${baseUrl}api-reference/gateway-api-specs.html`,
                target: '_blank',
              },
              {
                label: 'Engine State API',
                href: `${baseUrl}api-reference/engine-state-api-specs.html`,
                target: '_blank',
              },
              {
                label: 'System API',
                href: `${baseUrl}api-reference/system-api-specs.html`,
                target: '_blank',
              },
            ],
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
