---
title: "Scrypto CLI Tool"
---

# Scrypto CLI Tool

## Scrypto CLI

The scrypto tool is a Scrypto-specific convenience wrapper for Rust’s package manager, Cargo.

``` bash
scrypto 1.0.0
Create, build and test Scrypto code

USAGE:
    scrypto <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    build          Build a Scrypto package
    fmt            Format a Scrypto package
    help           Print this message or the help of the given subcommand(s)
    new-package    Create a Scrypto package
    test           Run Scrypto tests
```

## Cheat Sheet

|  |  |
|:---|:---|
| Command | Action |
| `scrypto new-package <package_name>` | To create a new package |
| `scrypto build` | To build a package |
| `scrypto test` | To test a package |
| `scrypto test - <test_name> -- --nocapture` | To run a test with standard output |
