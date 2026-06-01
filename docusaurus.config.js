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
          'radix://node_rdx1q0754knqhyskavhmr9kkz8d0h8wtxq3eqj4znnp77djfjsvdz5jmsdadn7q@seed.radix.defiplaza.net',
          'radix://node_rdx1q0qw4yglcmq04qnx3arc6ff72ynkh3skxz65uxzvknpuwytfm998zqju7kj@seed.radix.astrolescent.com',
          'radix://node_rdx1qtelftawmx9p5zqa2ukgj4q7aw75dl4s448u6ydqq0q2a92e4p5ugxmgjll@seed.acmenodes.com',
          'radix://node_rdx1qdt9fptdgz7n7j5qtuj500y6v30tg0w5jq49rap26ymhryl5xspakr2yxup@seed.radup.io',
          'radix://node_rdx1qv2wfk0p6dj57qw8c43xx8tl34qjn5kd2ayty7p5qhy9j36j9r6k236nrsx@seed.radstakes.com',
          'radix://node_rdx1q0muzc5vk6y3nym8r2943remtgpv8zf8xnpqf6mx2taxlkgnehxvv4c77f9@planet.radstakes.com',
          'radix://node_rdx1qv28t8ws8wm3c7une39v7syqhll72jaksacpppsfhkksaetfztex6a8t7kr@seed.trellisarch.tech',
          'radix://node_rdx1qwsg60y9h6c0t0n93z70053jseygtd8n6ueg3tr7wn8krxv60fexc55h06j@seednode.stakesafe.net',
        ],  
        STOKENET_SEED_NODES: [
          'radix://node_tdx_2_1qwz237kqdpct5l3yjhmna66uxja2ymrf3x6hh528ng3gtvnwndtn5rsrad4@node1-stokenet.radix.community',
          'radix://node_tdx_2_1qv89yg0la2jt429vqp8sxtpg95hj637gards67gpgqy2vuvwe4s5ss0va2y@node2-stokenet.radix.community',
          'radix://node_tdx_2_1qv2g5srsnhgrna9ejfw4lvhyd7h3ryjfy8rqxyuzqgxaz50cflulx9euut8@node3-stokenet.radix.community',
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
