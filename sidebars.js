/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  "docsSidebar": [
    {
      "type": "doc",
      "id": "index",
      "label": "Home"
    },
    {
      "type": "category",
      "label": "Welcome",
      "items": [
        "welcome/getting-help",
        "welcome/getting-started",
        "welcome/introduction-to-radix-at-babylon"
      ]
    },
    {
      "type": "category",
      "label": "Essentials",
      "items": [
        "essentials/asset-oriented",
        "essentials/authorization-approach",
        "essentials/overview",
        "essentials/reusable-code",
        "essentials/transactions-on-radix",
        {
          "type": "category",
          "label": "Concepts",
          "items": [
            "essentials/concepts/addresses",
            "essentials/concepts/consensus-ledger",
            "essentials/concepts/curves-keys-signatures",
            "essentials/concepts/dapps-dashboards-wallets",
            "essentials/concepts/environments",
            "essentials/concepts/getting-test-xrd",
            "essentials/concepts/infrastructure-apis",
            "essentials/concepts/key-developer-links",
            "essentials/concepts/native-token-xrd",
            "essentials/concepts/network-upgrades",
            "essentials/concepts/state-model-advanced",
            "essentials/concepts/state-model-introduction",
            "essentials/concepts/transactions"
          ],
          "link": {
            "type": "doc",
            "id": "essentials/concepts/index"
          }
        }
      ],
      "link": {
        "type": "doc",
        "id": "essentials/overview"
      }
    },
    {
      "type": "category",
      "label": "Use",
      "items": [
        "use/ecosystem-tools-libraries",
        "use/radix-dashboard",
        "use/radix-wallet-overview"
      ]
    },
    {
      "type": "category",
      "label": "Integrate",
      "items": [
        "integrate/integrate-with-radix-faqs",
        "integrate/introduction-to-radix-at-babylon",
        "integrate/overview",
        {
          "type": "category",
          "label": "Exchange Integration Guide",
          "items": [
            "integrate/exchange-integration-guide/detecting-deposits",
            "integrate/exchange-integration-guide/development-setup",
            "integrate/exchange-integration-guide/infrastructure-setup",
            "integrate/exchange-integration-guide/lts-core-api",
            "integrate/exchange-integration-guide/lts-toolkit",
            "integrate/exchange-integration-guide/worked-example-1-transfer-transaction",
            "integrate/exchange-integration-guide/worked-example-2-tracking-deposits-any-account",
            "integrate/exchange-integration-guide/worked-example-3-tracking-deposits-specific-account",
            "integrate/exchange-integration-guide/worked-example-4-node-status-monitoring"
          ],
          "link": {
            "type": "doc",
            "id": "integrate/exchange-integration-guide/index"
          }
        },
        {
          "type": "category",
          "label": "Network APIs",
          "items": [
            "integrate/network-apis/core-api-providers",
            "integrate/network-apis/gateway-api-providers",
            "integrate/network-apis/gateway-sdk"
          ],
          "link": {
            "type": "doc",
            "id": "integrate/network-apis/index"
          }
        },
        {
          "type": "category",
          "label": "Radix Engine Toolkit",
          "items": [
            "integrate/radix-engine-toolkit/architecture",
            "integrate/radix-engine-toolkit/derivation",
            "integrate/radix-engine-toolkit/examples",
            "integrate/radix-engine-toolkit/installation",
            "integrate/radix-engine-toolkit/manifest-builder",
            "integrate/radix-engine-toolkit/usage-guide"
          ],
          "link": {
            "type": "doc",
            "id": "integrate/radix-engine-toolkit/index"
          }
        },
        {
          "type": "category",
          "label": "Rust Libraries",
          "items": [
            "integrate/rust-libraries/manifest-builder",
            "integrate/rust-libraries/transaction-building"
          ],
          "link": {
            "type": "doc",
            "id": "integrate/rust-libraries/index"
          }
        },
        {
          "type": "category",
          "label": "Updating from Olympia",
          "items": [
            "integrate/updating-from-olympia/address-mapping-reconciliation",
            "integrate/updating-from-olympia/changes-in-babylon-from-olympia",
            "integrate/updating-from-olympia/sourcing-data-from-olympia"
          ],
          "link": {
            "type": "doc",
            "id": "integrate/updating-from-olympia/index"
          }
        }
      ],
      "link": {
        "type": "doc",
        "id": "integrate/overview"
      }
    },
    {
      "type": "category",
      "label": "Build",
      "items": [
        "build/before-you-release",
        "build/choosing-an-ide",
        "build/developer-quick-start",
        "build/setting-up-for-development",
        "build/updating-scrypto",
        {
          "type": "category",
          "label": "Authorization",
          "items": [
            "build/authorization/account-deposit-patterns",
            "build/authorization/actor-virtual-badge-pattern",
            "build/authorization/advanced-accessrules",
            "build/authorization/assign-component-roles",
            "build/authorization/assign-component-royalty-roles",
            "build/authorization/assign-function-accessrules",
            "build/authorization/assign-metadata-roles",
            "build/authorization/assign-roles-to-resources",
            "build/authorization/authorization-model",
            "build/authorization/call-a-protected-method-function",
            "build/authorization/the-withdraw-pattern",
            "build/authorization/transient-badge-pattern",
            "build/authorization/user-badge-pattern",
            "build/authorization/using-proofs"
          ],
          "link": {
            "type": "doc",
            "id": "build/authorization/index"
          }
        },
        {
          "type": "category",
          "label": "dApp Development",
          "items": [
            "build/dapp-development/application-stack",
            "build/dapp-development/building-a-frontend-dapp",
            "build/dapp-development/building-a-full-stack-dapp",
            "build/dapp-development/dapp-definition-setup",
            "build/dapp-development/dapp-frontend-development",
            "build/dapp-development/dapp-toolkit",
            "build/dapp-development/full-stack-dapp-development",
            "build/dapp-development/run-the-radiswap-dapp"
          ],
          "link": {
            "type": "doc",
            "id": "build/dapp-development/index"
          }
        },
        {
          "type": "category",
          "label": "dApp Transactions",
          "items": [
            "build/dapp-transactions/common-transactions",
            "build/dapp-transactions/intent-processor",
            "build/dapp-transactions/intent-structure",
            "build/dapp-transactions/pre-authorizations-subintents",
            "build/dapp-transactions/simple-token-transfer",
            "build/dapp-transactions/subintents",
            "build/dapp-transactions/transaction-intents",
            "build/dapp-transactions/transaction-notary",
            "build/dapp-transactions/transaction-overview",
            "build/dapp-transactions/transaction-structure",
            "build/dapp-transactions/transaction-tracker"
          ],
          "link": {
            "type": "doc",
            "id": "build/dapp-transactions/index"
          }
        },
        {
          "type": "category",
          "label": "Learning Step-by-Step",
          "items": [
            "build/learning-step-by-step/build-a-candy-store",
            "build/learning-step-by-step/build-a-gumball-machine",
            "build/learning-step-by-step/build-a-multi-blueprint-package",
            "build/learning-step-by-step/create-and-use-transaction-manifests",
            "build/learning-step-by-step/create-owned-components",
            "build/learning-step-by-step/create-your-first-custom-resource",
            "build/learning-step-by-step/create-your-first-non-fungible",
            "build/learning-step-by-step/explain-your-first-scrypto-project",
            "build/learning-step-by-step/explain-your-first-test",
            "build/learning-step-by-step/give-the-gumball-machine-an-owner",
            "build/learning-step-by-step/make-recallable-badges",
            "build/learning-step-by-step/make-your-gumball-machine-refillable",
            "build/learning-step-by-step/run-the-gumball-machine-front-end-dapp",
            "build/learning-step-by-step/run-your-first-front-end-dapp",
            "build/learning-step-by-step/run-your-first-scrypto-project",
            "build/learning-step-by-step/set-verification-metadata",
            "build/learning-step-by-step/test-a-multi-blueprint-package",
            "build/learning-step-by-step/use-external-blueprints",
            "build/learning-step-by-step/use-external-components",
            "build/learning-step-by-step/use-the-gumball-machine-on-stokenet",
            "build/learning-step-by-step/wrapping-up"
          ],
          "link": {
            "type": "doc",
            "id": "build/learning-step-by-step/index"
          }
        },
        {
          "type": "category",
          "label": "Metadata",
          "items": [
            "build/metadata/entity-metadata",
            "build/metadata/metadata-for-verification",
            "build/metadata/metadata-for-wallet-display",
            "build/metadata/scrypto-entity-metadata"
          ],
          "link": {
            "type": "doc",
            "id": "build/metadata/index"
          }
        },
        {
          "type": "category",
          "label": "Native Blueprints",
          "items": [
            "build/native-blueprints/access-controller",
            "build/native-blueprints/account",
            "build/native-blueprints/consensus-manager",
            "build/native-blueprints/identity",
            "build/native-blueprints/locker",
            "build/native-blueprints/pool",
            "build/native-blueprints/validator"
          ],
          "link": {
            "type": "doc",
            "id": "build/native-blueprints/index"
          }
        },
        {
          "type": "category",
          "label": "Resources",
          "items": [
            "build/resources/buckets-and-vaults",
            "build/resources/freezing-vaults",
            "build/resources/fungible-resource-manager",
            "build/resources/non-fungible-data-for-wallet-display",
            "build/resources/non-fungible-data",
            "build/resources/non-fungible-display",
            "build/resources/recalling-resources",
            "build/resources/resource-behaviors",
            "build/resources/resource-creation-in-detail",
            "build/resources/transaction-non-fungible-resource-creation"
          ],
          "link": {
            "type": "doc",
            "id": "build/resources/index"
          }
        },
        {
          "type": "category",
          "label": "Scrypto",
          "items": [
            "build/scrypto/advanced-external-calls",
            "build/scrypto/blueprints-and-components",
            "build/scrypto/code-hardening",
            "build/scrypto/component-ownership",
            "build/scrypto/coverage-tool",
            "build/scrypto/data-types",
            "build/scrypto/events",
            "build/scrypto/functions-and-methods",
            "build/scrypto/logging",
            "build/scrypto/productionize-your-code",
            "build/scrypto/reusable-blueprints-pattern",
            "build/scrypto/scrypto-builder",
            "build/scrypto/scrypto-cli-tool",
            "build/scrypto/scrypto-test",
            "build/scrypto/using-royalties"
          ],
          "link": {
            "type": "doc",
            "id": "build/scrypto/index"
          }
        },
        {
          "type": "category",
          "label": "Transactions & Manifests",
          "items": [
            "build/transactions-manifests/conforming-manifest-types",
            "build/transactions-manifests/manifest-instructions",
            "build/transactions-manifests/manifest-sbor-specs",
            "build/transactions-manifests/manifest-value-syntax",
            "build/transactions-manifests/writing-manifests"
          ],
          "link": {
            "type": "doc",
            "id": "build/transactions-manifests/index"
          }
        }
      ]
    },
    {
      "type": "category",
      "label": "Run",
      "items": [
        "run/custom-setup",
        "run/enabling-the-engine-state-api",
        "run/engine-tech-docs",
        "run/monitoring-health",
        "run/optimizing-performance",
        "run/overview",
        "run/protocol-update-readiness",
        "run/protocol-updates",
        "run/registering-as-a-validator",
        "run/running-a-node",
        "run/running-infrastructure",
        "run/setting-up-grafana",
        {
          "type": "category",
          "label": "Docker Setup",
          "items": [
            "run/docker-setup/register-as-a-validator-docker"
          ],
          "link": {
            "type": "doc",
            "id": "run/docker-setup/index"
          }
        },
        {
          "type": "category",
          "label": "Guided Setup",
          "items": [
            "run/guided-setup/installing-cli",
            "run/guided-setup/installing-node",
            "run/guided-setup/installing-the-babylonnode-cli",
            "run/guided-setup/updating-node"
          ],
          "link": {
            "type": "doc",
            "id": "run/guided-setup/index"
          }
        },
        {
          "type": "category",
          "label": "Network Gateway",
          "items": [
            "run/network-gateway/configuration",
            "run/network-gateway/monitoring",
            "run/network-gateway/releasing",
            "run/network-gateway/setup"
          ],
          "link": {
            "type": "doc",
            "id": "run/network-gateway/index"
          }
        },
        {
          "type": "category",
          "label": "Node Setup",
          "items": [
            "run/node-setup/basic-node-setup",
            "run/node-setup/requirements",
            "run/node-setup/setup-with-cli"
          ],
          "link": {
            "type": "doc",
            "id": "run/node-setup/index"
          }
        },
        {
          "type": "category",
          "label": "Systemd Setup",
          "items": [
            "run/systemd-setup/register-as-a-validator-systemd",
            "run/systemd-setup/systemd-update"
          ],
          "link": {
            "type": "doc",
            "id": "run/systemd-setup/index"
          }
        }
      ],
      "link": {
        "type": "doc",
        "id": "run/overview"
      }
    },
    {
      "type": "category",
      "label": "Reference",
      "items": [
        "reference/address-description",
        "reference/bech32-address-types-conversion",
        "reference/resource-address-display",
        "reference/rola-radix-off-ledger-auth",
        "reference/useful-links",
        "reference/well-known-addresses-full-list",
        "reference/well-known-addresses",
        {
          "type": "category",
          "label": "Core System Features",
          "items": [
            "reference/core-system-features/runtime",
            "reference/core-system-features/structure-roles-methods"
          ],
          "link": {
            "type": "doc",
            "id": "reference/core-system-features/index"
          }
        },
        {
          "type": "category",
          "label": "Costing & Limits",
          "items": [
            "reference/costing-limits/transaction-costing",
            "reference/costing-limits/transaction-limits"
          ],
          "link": {
            "type": "doc",
            "id": "reference/costing-limits/index"
          }
        },
        {
          "type": "category",
          "label": "Cryptography",
          "items": [
            "reference/cryptography/bls12-381",
            "reference/cryptography/keccak256"
          ],
          "link": {
            "type": "doc",
            "id": "reference/cryptography/index"
          }
        },
        {
          "type": "category",
          "label": "Developer Tools",
          "items": [
            "reference/developer-tools/developer-console",
            "reference/developer-tools/environments",
            "reference/developer-tools/radix-engine-simulator-resim"
          ],
          "link": {
            "type": "doc",
            "id": "reference/developer-tools/index"
          }
        },
        {
          "type": "category",
          "label": "SBOR",
          "items": [
            "reference/sbor/sbor-in-java",
            "reference/sbor/sbor-in-rust-scrypto",
            "reference/sbor/sbor-programmatic-json",
            "reference/sbor/sbor-string-formats",
            "reference/sbor/sbor-type-model",
            "reference/sbor/sbor-value-model",
            "reference/sbor/scrypto-ledger",
            "reference/sbor/scrypto-sbor-specs",
            "reference/sbor/scrypto-type-model",
            "reference/sbor/scrypto-value-kinds",
            "reference/sbor/what-is-sbor"
          ],
          "link": {
            "type": "doc",
            "id": "reference/sbor/index"
          }
        }
      ]
    },
    {
      "type": "category",
      "label": "Updates",
      "items": [
        "updates/roadmap",
        {
          "type": "category",
          "label": "Developer Tools Updates",
          "items": [
            "updates/developer-tools-updates/backlog",
            "updates/developer-tools-updates/underway"
          ],
          "link": {
            "type": "doc",
            "id": "updates/developer-tools-updates/index"
          }
        },
        {
          "type": "category",
          "label": "Gateway Updates",
          "items": [
            "updates/gateway-updates/backlog",
            "updates/gateway-updates/complete",
            "updates/gateway-updates/milestones",
            "updates/gateway-updates/underway"
          ],
          "link": {
            "type": "doc",
            "id": "updates/gateway-updates/index"
          }
        },
        {
          "type": "category",
          "label": "Node/Engine Updates",
          "items": [
            "updates/node-engine-updates/backlog",
            "updates/node-engine-updates/complete",
            "updates/node-engine-updates/milestones",
            "updates/node-engine-updates/underway"
          ],
          "link": {
            "type": "doc",
            "id": "updates/node-engine-updates/index"
          }
        },
        {
          "type": "category",
          "label": "Protocol Updates",
          "items": [
            "updates/protocol-updates/anemone",
            "updates/protocol-updates/babylon-genesis",
            "updates/protocol-updates/bottlenose",
            "updates/protocol-updates/cuttlefish",
            "updates/protocol-updates/dugong"
          ],
          "link": {
            "type": "doc",
            "id": "updates/protocol-updates/index"
          }
        },
        {
          "type": "category",
          "label": "Radix Applications",
          "items": [
            "updates/radix-applications/backlog",
            "updates/radix-applications/complete",
            "updates/radix-applications/underway"
          ],
          "link": {
            "type": "doc",
            "id": "updates/radix-applications/index"
          }
        },
        {
          "type": "category",
          "label": "Scrypto Updates",
          "items": [
            "updates/scrypto-updates/backlog",
            "updates/scrypto-updates/milestones",
            "updates/scrypto-updates/scrypto-v1-1-0",
            "updates/scrypto-updates/scrypto-v1-2-0",
            "updates/scrypto-updates/scrypto-v1-3-0",
            "updates/scrypto-updates/underway"
          ],
          "link": {
            "type": "doc",
            "id": "updates/scrypto-updates/index"
          }
        },
        {
          "type": "category",
          "label": "Wallets Updates",
          "items": [
            "updates/wallets-updates/backlog",
            "updates/wallets-updates/milestones",
            "updates/wallets-updates/underway"
          ],
          "link": {
            "type": "doc",
            "id": "updates/wallets-updates/index"
          }
        }
      ]
    }
  ]
};

module.exports = sidebars;
