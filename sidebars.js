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
        "welcome/getting-started",
        "welcome/getting-help"
      ]
    },
    {
      "type": "category",
      "label": "Essentials",
      "link": { "type": "doc", "id": "essentials/overview" },
      "items": [
        "essentials/asset-oriented",
        "essentials/reusable-code",
        "essentials/transactions-on-radix",
        "essentials/authorization-approach"
      ]
    },
    {
      "type": "category",
      "label": "Use",
      "items": [
        "use/radix-dashboard",
        "use/radix-wallet-overview",
        "use/ecosystem-tools-libraries"
      ]
    },
    {
      "type": "category",
      "label": "Integrate",
      "items": [
        "integrate/overview",
        {
          "type": "category",
          "label": "Integrate with Radix",
          "items": [
            "integrate/introduction-to-radix-at-babylon",
            {
              "type": "category",
              "label": "Exchange Integration Guide",
              "items": [
                "integrate/exchange-integration-guide/infrastructure-setup",
                "integrate/exchange-integration-guide/development-setup",
                "integrate/exchange-integration-guide/lts-core-api",
                "integrate/exchange-integration-guide/lts-toolkit",
                "integrate/exchange-integration-guide/detecting-deposits",
                "integrate/exchange-integration-guide/worked-example-1-transfer-transaction",
                "integrate/exchange-integration-guide/worked-example-2-tracking-deposits-any-account",
                "integrate/exchange-integration-guide/worked-example-3-tracking-deposits-specific-account",
                "integrate/exchange-integration-guide/worked-example-4-node-status-monitoring"
              ],
              "link": {
                "type": "doc",
                "id": "integrate/exchange-integration-guide/index"
              }
            }
          ]
        },
        {
          "type": "category",
          "label": "Updating from Olympia",
          "items": [
            "integrate/updating-from-olympia/changes-in-babylon-from-olympia",
            "integrate/updating-from-olympia/address-mapping-reconciliation",
            "integrate/updating-from-olympia/sourcing-data-from-olympia"
          ],
          "link": {
            "type": "doc",
            "id": "integrate/updating-from-olympia/index"
          }
        },
        "integrate/integrate-with-radix-faqs",
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
            {
              "type": "doc",
              "id": "integrate/radix-engine-toolkit/installation",
              "label": "Getting Started"
            },
            {
              "type": "category",
              "label": "Usage Guide",
              "link": {
                "type": "doc",
                "id": "integrate/radix-engine-toolkit/usage-guide"
              },
              "items": [
                "integrate/radix-engine-toolkit/derivation",
                "integrate/radix-engine-toolkit/manifest-builder"
              ]
            },
            "integrate/radix-engine-toolkit/examples"
          ],
          "link": {
            "type": "doc",
            "id": "integrate/radix-engine-toolkit/index"
          }
        },
        {
          "type": "category",
          "label": "Rust Libraries",
          "link": { "type": "doc", "id": "integrate/rust-libraries/index" },
          "items": [
            "integrate/rust-libraries/manifest-builder",
            "integrate/rust-libraries/transaction-building"
          ]
        }
      ]
    },
    {
      "type": "category",
      "label": "Build",
      "items": [
        {
          "type": "category",
          "label": "Developer Quick Start",
          "items": [
            {
              "type": "doc",
              "id": "build/dapp-development/dapp-frontend-development",
              "label": "Frontend dApp (Client and Ledger)"
            },
            {
              "type": "doc",
              "id": "build/dapp-development/full-stack-dapp-development",
              "label": "Fullstack dApp (Client, Server and Ledger)"
            },
            {
              "type": "doc",
              "id": "build/developer-quick-start",
              "label": "Scrypto (Ledger)"
            }
          ]
        },
        {
          "type": "category",
          "label": "Setting up for Development",
          "items": [
            {
              "type": "doc",
              "id": "build/setting-up-for-development",
              "label": "Setting Up"
            },
            {
              "type": "ref",
              "id": "build/developer-quick-start",
              "label": "Getting Rust & Scrypto"
            },
            {
              "type": "doc",
              "id": "build/updating-scrypto",
              "label": "Updating Scrypto"
            },
            {
              "type": "doc",
              "id": "build/choosing-an-ide",
              "label": "Choosing a Code Editor/IDE"
            }
          ]
        },
        {
          "type": "category",
          "label": "Learning Step-by-Step",
          "items": [
            "build/learning-step-by-step/run-your-first-scrypto-project",
            "build/learning-step-by-step/explain-your-first-scrypto-project",
            "build/learning-step-by-step/create-your-first-custom-resource",
            "build/learning-step-by-step/build-a-gumball-machine",
            "build/learning-step-by-step/give-the-gumball-machine-an-owner",
            "build/learning-step-by-step/make-your-gumball-machine-refillable",
            "build/learning-step-by-step/create-and-use-transaction-manifests",
            "build/learning-step-by-step/use-the-gumball-machine-on-stokenet",
            "build/learning-step-by-step/run-your-first-front-end-dapp",
            "build/learning-step-by-step/run-the-gumball-machine-front-end-dapp",
            "build/learning-step-by-step/set-verification-metadata",
            "build/learning-step-by-step/create-your-first-non-fungible",
            "build/learning-step-by-step/build-a-candy-store",
            "build/learning-step-by-step/make-recallable-badges",
            "build/learning-step-by-step/build-a-multi-blueprint-package",
            "build/learning-step-by-step/create-owned-components",
            "build/learning-step-by-step/use-external-blueprints",
            "build/learning-step-by-step/use-external-components",
            "build/learning-step-by-step/explain-your-first-test",
            "build/learning-step-by-step/test-a-multi-blueprint-package",
            "build/dapp-development/run-the-radiswap-dapp",
            "build/learning-step-by-step/wrapping-up"
          ],
          "link": {
            "type": "doc",
            "id": "build/learning-step-by-step/index"
          }
        },
        {
          "type": "category",
          "label": "dApp Development",
          "items": [
            {
              "type": "category",
              "label": "Application Stack",
              "link": {
                "type": "doc",
                "id": "build/dapp-development/application-stack"
              },
              "items": [
                "build/dapp-development/building-a-frontend-dapp",
                "build/dapp-development/building-a-full-stack-dapp"
              ]
            },
            {
              "type": "category",
              "label": "dApp SDKs",
              "items": [
                "build/dapp-development/dapp-toolkit",
                {
                  "type": "ref",
                  "id": "integrate/network-apis/gateway-sdk",
                  "label": "Gateway SDK"
                }
              ]
            },
            {
              "type": "doc",
              "id": "reference/rola-radix-off-ledger-auth",
              "label": "ROLA - Radix Off Ledger Auth"
            },
            "build/dapp-development/dapp-definition-setup",
            {
              "type": "category",
              "label": "dApp Transactions",
              "items": [
                {
                  "type": "doc",
                  "id": "build/transactions-manifests/writing-manifests",
                  "label": "Writing Manifests"
                },
                {
                  "type": "doc",
                  "id": "build/dapp-transactions/pre-authorizations-subintents",
                  "label": "Pre-authorization / Subintent Flow"
                },
                {
                  "type": "category",
                  "label": "Examples",
                  "items": [
                    {
                      "type": "doc",
                      "id": "build/dapp-transactions/simple-token-transfer",
                      "label": "Simple Token Transfer"
                    },
                    {
                      "type": "doc",
                      "id": "build/resources/transaction-non-fungible-resource-creation",
                      "label": "Non-Fungible Resource Creation"
                    }
                  ]
                }
              ]
            },
            {
              "type": "category",
              "label": "Before You Release!",
              "link": {
                "type": "doc",
                "id": "build/before-you-release"
              },
              "items": [
                {
                  "type": "doc",
                  "id": "build/scrypto/code-hardening",
                  "label": "Code Hardening"
                },
                {
                  "type": "doc",
                  "id": "build/scrypto/productionize-your-code",
                  "label": "Productionize Your Code"
                }
              ]
            },
            {
              "type": "doc",
              "id": "reference/useful-links",
              "label": "Useful Links"
            }
          ]
        },
        {
          "type": "category",
          "label": "Scrypto",
          "link": {
            "type": "doc",
            "id": "build/scrypto/index"
          },
          "items": [
            {
              "type": "category",
              "label": "Tools for Scrypto",
              "items": [
                "build/scrypto/scrypto-cli-tool",
                "build/scrypto/scrypto-builder",
                {
                  "type": "doc",
                  "id": "reference/developer-tools/radix-engine-simulator-resim",
                  "label": "resim (Radix Engine Simulator)"
                }
              ]
            },
            "build/scrypto/blueprints-and-components",
            {
              "type": "category",
              "label": "Resources",
              "link": {
                "type": "doc",
                "id": "build/resources/index"
              },
              "items": [
                "build/resources/resource-creation-in-detail",
                "build/resources/resource-behaviors",
                "build/resources/buckets-and-vaults",
                "build/resources/non-fungible-data",
                "build/resources/recalling-resources",
                "build/resources/freezing-vaults"
              ]
            },
            {
              "type": "category",
              "label": "Authorization",
              "link": {
                "type": "doc",
                "id": "build/authorization/index"
              },
              "items": [
                "build/authorization/call-a-protected-method-function",
                "build/authorization/using-proofs",
                "build/authorization/assign-function-accessrules",
                {
                  "type": "doc",
                  "id": "reference/core-system-features/structure-roles-methods",
                  "label": "Assign Roles To Methods"
                },
                "build/authorization/assign-component-roles",
                "build/authorization/assign-roles-to-resources",
                "build/authorization/assign-metadata-roles",
                "build/authorization/assign-component-royalty-roles",
                "build/authorization/advanced-accessrules"
              ]
            },
            "build/scrypto/data-types",
            "build/scrypto/functions-and-methods",
            "build/scrypto/logging",
            "build/scrypto/component-ownership",
            "build/scrypto/advanced-external-calls",
            {
              "type": "doc",
              "id": "reference/core-system-features/runtime",
              "label": "Runtime API"
            },
            {
              "type": "doc",
              "id": "reference/bech32-address-types-conversion",
              "label": "Bech32 Address Types Conversion"
            },
            {
              "type": "doc",
              "id": "build/scrypto/events",
              "label": "Scrypto Events"
            },
            "build/scrypto/coverage-tool",
            {
              "type": "ref",
              "id": "build/metadata/entity-metadata",
              "label": "Entity Metadata"
            },
            {
              "type": "category",
              "label": "Royalties",
              "items": [
                "build/scrypto/using-royalties"
              ]
            },
            {
              "type": "category",
              "label": "Cryptography",
              "items": [
                {
                  "type": "doc",
                  "id": "reference/cryptography/keccak256",
                  "label": "Keccak256"
                },
                {
                  "type": "doc",
                  "id": "reference/cryptography/bls12-381",
                  "label": "BLS12-381"
                }
              ]
            },
            {
              "type": "category",
              "label": "Testing",
              "items": [
                "build/scrypto/scrypto-test"
              ]
            },
            {
              "type": "category",
              "label": "Design Patterns",
              "items": [
                "build/authorization/user-badge-pattern",
                "build/authorization/actor-virtual-badge-pattern",
                "build/authorization/the-withdraw-pattern",
                "build/authorization/transient-badge-pattern",
                "build/scrypto/reusable-blueprints-pattern",
                {
                  "type": "doc",
                  "id": "build/authorization/account-deposit-patterns",
                  "label": "Patterns for Application Deposit Use Cases"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "category",
      "label": "Run",
      "items": [
        "run/running-infrastructure",
        {
          "type": "category",
          "label": "Node",
          "link": {
            "type": "doc",
            "id": "run/overview"
          },
          "items": [
            {
              "type": "category",
              "label": "Installation and Basic Setup",
              "link": {
                "type": "doc",
                "id": "run/node-setup/basic-node-setup"
              },
              "items": [
                {
                  "type": "category",
                  "label": "Guided Setup (Recommended)",
                  "link": {
                    "type": "doc",
                    "id": "run/guided-setup/index"
                  },
                  "items": [
                    {
                      "type": "doc",
                      "id": "run/guided-setup/installing-the-babylonnode-cli",
                      "label": "Installing the babylonnode CLI"
                    },
                    {
                      "type": "doc",
                      "id": "run/guided-setup/installing-node",
                      "label": "Installing the node"
                    },
                    {
                      "type": "doc",
                      "id": "run/guided-setup/updating-node",
                      "label": "Updating the node"
                    }
                  ]
                },
                {
                  "type": "category",
                  "label": "Manual Setup (Advanced)",
                  "items": [
                    {
                      "type": "doc",
                      "id": "run/docker-setup/index",
                      "label": "Manual Setup with Docker"
                    },
                    {
                      "type": "category",
                      "label": "Manual Node Setup with systemd",
                      "link": {
                        "type": "doc",
                        "id": "run/systemd-setup/index"
                      },
                      "items": [
                        {
                          "type": "doc",
                          "id": "run/systemd-setup/systemd-update",
                          "label": "Update the Node"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "category",
              "label": "Maintenance and Administration",
              "items": [
                {
                  "type": "doc",
                  "id": "run/monitoring-health",
                  "label": "Monitoring node's health"
                },
                {
                  "type": "doc",
                  "id": "run/protocol-update-readiness",
                  "label": "Signalling Protocol Update Readiness"
                },
                {
                  "type": "doc",
                  "id": "run/registering-as-a-validator",
                  "label": "Registering as a Validator"
                },
                {
                  "type": "doc",
                  "id": "run/optimizing-performance",
                  "label": "Optimizing node's performance"
                },
                {
                  "type": "doc",
                  "id": "run/setting-up-grafana",
                  "label": "Setting up a Grafana dashboard"
                }
              ]
            },
            {
              "type": "category",
              "label": "Workbench",
              "items": [
                {
                  "type": "category",
                  "label": "Trash - to remove",
                  "items": [
                    {
                      "type": "doc",
                      "id": "run/docker-setup/register-as-a-validator-docker",
                      "label": "Register as a Validator"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Network Gateway",
          "link": {
            "type": "doc",
            "id": "run/network-gateway/index"
          },
          "items": [
            {
              "type": "category",
              "label": "Setup",
              "link": {
                "type": "doc",
                "id": "run/network-gateway/setup"
              },
              "items": [
                {
                  "type": "doc",
                  "id": "run/node-setup/setup-with-cli",
                  "label": "Setup with CLI"
                }
              ]
            },
            {
              "type": "category",
              "label": "Custom Setup",
              "link": {
                "type": "doc",
                "id": "run/custom-setup"
              },
              "items": [
                "run/node-setup/requirements",
                "run/network-gateway/configuration"
              ]
            },
            {
              "type": "category",
              "label": "Maintenance",
              "items": [
                "run/network-gateway/monitoring",
                "run/network-gateway/releasing"
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "category",
      "label": "Reference",
      "items": [
        {
          "type": "doc",
          "id": "reference/developer-tools/environments",
          "label": "Environments"
        },
        "reference/address-description",
        {
          "type": "doc",
          "id": "reference/well-known-addresses-full-list",
          "label": "Well-known Addresses"
        },
        {
          "type": "category",
          "label": "Standards",
          "items": [
            {
              "type": "category",
              "label": "Metadata Standards",
              "items": [
                {
                  "type": "doc",
                  "id": "build/metadata/metadata-for-wallet-display",
                  "label": "Metadata for Wallet Display"
                },
                {
                  "type": "doc",
                  "id": "build/metadata/metadata-for-verification",
                  "label": "Metadata for Verification"
                }
              ]
            },
            {
              "type": "category",
              "label": "Non-fungible Standards",
              "items": [
                {
                  "type": "doc",
                  "id": "build/resources/non-fungible-display",
                  "label": "Displaying Non-fungibles"
                },
                {
                  "type": "doc",
                  "id": "build/resources/non-fungible-data-for-wallet-display",
                  "label": "Displaying Non-fungible data"
                }
              ]
            },
            {
              "type": "category",
              "label": "UI/UX Standards",
              "items": [
                "reference/resource-address-display"
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Integrator Concepts",
          "link": { "type": "doc", "id": "reference/concepts/index" },
          "items": [
            "reference/concepts/addresses",
            "reference/concepts/environments",
            "reference/well-known-addresses",
            "reference/concepts/infrastructure-apis",
            {
              "type": "doc",
              "id": "reference/concepts/consensus-ledger",
              "label": "Consensus, Ledger Forks, Blocks, and Trust chains"
            },
            {
              "type": "doc",
              "id": "reference/concepts/curves-keys-signatures",
              "label": "Curves, Keys, Signatures and Hashing"
            },
            {
              "type": "doc",
              "id": "reference/concepts/state-model-introduction",
              "label": "State Model - Introduction"
            },
            {
              "type": "doc",
              "id": "reference/concepts/state-model-advanced",
              "label": "State Model - Advanced"
            },
            {
              "type": "doc",
              "id": "reference/concepts/native-token-xrd",
              "label": "Native Token - XRD"
            },
            {
              "type": "doc",
              "id": "reference/concepts/transactions",
              "label": "Transactions for Integrators"
            },
            "reference/concepts/getting-test-xrd",
            "reference/concepts/key-developer-links",
            "reference/concepts/network-upgrades",
            "reference/concepts/dapps-dashboards-wallets"
          ]
        },
        {
          "type": "category",
          "label": "Radix Engine",
          "items": [
            {
              "type": "doc",
              "id": "run/engine-tech-docs",
              "label": "Engine Tech Docs"
            },
            {
              "type": "doc",
              "id": "build/authorization/authorization-model",
              "label": "Authorization Model"
            },
            {
              "type": "category",
              "label": "Native Blueprints",
              "link": {
                "type": "doc",
                "id": "build/native-blueprints/index"
              },
              "items": [
                {
                  "type": "doc",
                  "id": "build/resources/fungible-resource-manager",
                  "label": "Fungible Resource Manager"
                },
                {
                  "type": "doc",
                  "id": "build/native-blueprints/account",
                  "label": "Account"
                },
                {
                  "type": "doc",
                  "id": "build/native-blueprints/access-controller",
                  "label": "Access Controller"
                },
                {
                  "type": "doc",
                  "id": "build/native-blueprints/pool",
                  "label": "Pool"
                },
                {
                  "type": "doc",
                  "id": "build/native-blueprints/validator",
                  "label": "Validator"
                },
                {
                  "type": "doc",
                  "id": "build/dapp-transactions/intent-processor",
                  "label": "Intent Processor"
                },
                {
                  "type": "doc",
                  "id": "build/native-blueprints/consensus-manager",
                  "label": "Consensus Manager"
                },
                {
                  "type": "doc",
                  "id": "build/native-blueprints/identity",
                  "label": "Identity / Persona"
                },
                {
                  "type": "doc",
                  "id": "build/dapp-transactions/transaction-tracker",
                  "label": "Transaction Tracker"
                },
                {
                  "type": "doc",
                  "id": "build/native-blueprints/locker",
                  "label": "Account Locker"
                }
              ]
            },
            {
              "type": "category",
              "label": "Costing and Limits",
              "link": {
                "type": "doc",
                "id": "reference/costing-limits/index"
              },
              "items": [
                "reference/costing-limits/transaction-costing",
                "reference/costing-limits/transaction-limits"
              ]
            },
            {
              "type": "category",
              "label": "Metadata",
              "items": [
                {
                  "type": "doc",
                  "id": "build/metadata/entity-metadata",
                  "label": "Entity Metadata"
                }
              ]
            },
            {
              "type": "category",
              "label": "Transactions",
              "items": [
                {
                  "type": "doc",
                  "id": "build/dapp-transactions/transaction-overview",
                  "label": "Transaction Overview"
                },
                {
                  "type": "category",
                  "label": "Manifest",
                  "link": {
                    "type": "doc",
                    "id": "build/transactions-manifests/index"
                  },
                  "items": [
                    {
                      "type": "doc",
                      "id": "build/transactions-manifests/manifest-instructions",
                      "label": "Manifest Instructions"
                    },
                    {
                      "type": "doc",
                      "id": "build/transactions-manifests/conforming-manifest-types",
                      "label": "Conforming Manifest Types"
                    }
                  ]
                },
                {
                  "type": "doc",
                  "id": "build/dapp-transactions/intent-structure",
                  "label": "Intent Structure"
                },
                {
                  "type": "doc",
                  "id": "build/dapp-transactions/transaction-structure",
                  "label": "Transaction Structure"
                },
                {
                  "type": "doc",
                  "id": "build/dapp-transactions/transaction-intents",
                  "label": "Transaction Intents"
                },
                {
                  "type": "doc",
                  "id": "build/dapp-transactions/transaction-notary",
                  "label": "Transaction Notary"
                },
                {
                  "type": "doc",
                  "id": "build/dapp-transactions/subintents",
                  "label": "Subintents"
                }
              ]
            },
            {
              "type": "category",
              "label": "SBOR Serialization",
              "link": {
                "type": "doc",
                "id": "reference/sbor/what-is-sbor"
              },
              "items": [
                "reference/sbor/sbor-value-model",
                "reference/sbor/sbor-type-model",
                {
                  "type": "category",
                  "label": "Textual Representations",
                  "items": [
                    {
                      "type": "doc",
                      "id": "reference/sbor/sbor-programmatic-json",
                      "label": "Programmatic JSON"
                    }
                  ]
                },
                {
                  "type": "category",
                  "label": "Manifest SBOR",
                  "items": [
                    {
                      "type": "doc",
                      "id": "build/transactions-manifests/manifest-sbor-specs",
                      "label": "Manifest SBOR Specs"
                    },
                    {
                      "type": "doc",
                      "id": "build/transactions-manifests/manifest-value-syntax",
                      "label": "Manifest Value Syntax"
                    }
                  ]
                },
                {
                  "type": "category",
                  "label": "Scrypto SBOR",
                  "items": [
                    "reference/sbor/scrypto-sbor-specs"
                  ]
                }
              ]
            }
          ]
        },
      ]
    },
    {
      "type": "category",
      "label": "Updates",
      "items": [
        {
          "type": "category",
          "label": "Protocol Updates",
          "items": [
            "updates/protocol-updates/babylon-genesis",
            "updates/protocol-updates/anemone",
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
          "label": "Roadmap",
          "link": {
            "type": "doc",
            "id": "updates/roadmap"
          },
          "items": [
            {
              "type": "category",
              "label": "Wallets",
              "items": [
                "updates/wallets-updates/milestones",
                "updates/wallets-updates/underway",
                "updates/wallets-updates/backlog",
                "updates/wallets-updates/complete"
              ],
              "link": {
                "type": "doc",
                "id": "updates/wallets-updates/index"
              }
            },
            {
              "type": "category",
              "label": "Scrypto",
              "items": [
                "updates/scrypto-updates/milestones",
                "updates/scrypto-updates/underway",
                "updates/scrypto-updates/backlog"
              ],
              "link": {
                "type": "doc",
                "id": "updates/scrypto-updates/index"
              }
            },
            {
              "type": "category",
              "label": "Node/Engine",
              "items": [
                "updates/node-engine-updates/milestones",
                "updates/node-engine-updates/underway",
                "updates/node-engine-updates/backlog",
                "updates/node-engine-updates/complete"
              ],
              "link": {
                "type": "doc",
                "id": "updates/node-engine-updates/index"
              }
            },
            {
              "type": "category",
              "label": "Gateway",
              "items": [
                "updates/gateway-updates/milestones",
                "updates/gateway-updates/underway",
                "updates/gateway-updates/backlog",
                "updates/gateway-updates/complete"
              ],
              "link": {
                "type": "doc",
                "id": "updates/gateway-updates/index"
              }
            },
            {
              "type": "category",
              "label": "Developer Tools",
              "items": [
                "updates/developer-tools-updates/underway",
                "updates/developer-tools-updates/backlog"
              ],
              "link": {
                "type": "doc",
                "id": "updates/developer-tools-updates/index"
              }
            }
          ]
        },
        {
          "type": "category",
          "label": "Release Notes",
          "items": [
            {
              "type": "category",
              "label": "Scrypto",
              "items": [
                "updates/scrypto-updates/scrypto-v1-3-1",
                "updates/scrypto-updates/scrypto-v1-3-0",
                "updates/scrypto-updates/scrypto-v1-2-0",
                "updates/scrypto-updates/scrypto-v1-1-0"
              ]
            }
          ]
        }
      ]
    }
  ]
};

module.exports = sidebars;
