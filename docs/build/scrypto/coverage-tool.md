---
title: "Coverage Tool"
---

# Coverage Tool

Scrypto `coverage` tool allows you to check the test coverage of your blueprint code by running the tests with instrumented `wasm` file.

## Installation

Scrypto coverage is supported since Scrypto `v1.2.0`.

Follow [this guide](https://github.com/radixdlt/radixdlt-scrypto?tab=readme-ov-file#installation) for installation.

## Compatibility

Currently, the supported environment is Linux `amd64` with Rust `1.81.0-nightly`.

To install the specific rust version, run `rustup install nightly-2024-07-18-x86_64-unknown-linux-gnu`.

## How to run

Inside you blueprint folder, execute command `scrypto coverage`.

It will compile the package, run tests, and generate a HTML report in `coverage/report` folder.

## Example report



Additionally, source of all analyzed files can be viewed. All lines which were not visited during tests execution are marked. More information about interpreting report data can be found [here](https://clang.llvm.org/docs/SourceBasedCodeCoverage.html#interpreting-reports).

## Step by step instructions

### Running coverage tool

You can follow the following steps to run coverage on example blueprint:

1.  Install Radix CLI tools:

<!-- -->

    cargo install --force radix-clis@1.2.0

2.  Create a test package

<!-- -->

    scrypto new-package hello

3.  Run coverage tool:

<!-- -->

    cd hello
    RUSTUP_TOOLCHAIN=nightly-2024-07-18 scrypto coverage

### Environment setup

#### Clean OS using Docker

Following instruction will prepare clean OS using Docker image (alternatively local instance of Linux can be used): 1. Pull new image and get its ID:

    docker pull ubuntu:mantic
    docker images

2.  Start a container (replace `<IMAGE ID>` tag with value obtained from step 1) and get its ID:

<!-- -->

    docker run -t -d <IMAGE ID>
    docker ps -a

3.  Login into the container (replace `<CONTAINER ID>` tag with value obtained from step 2):

<!-- -->

    docker exec -i -t <CONTAINER ID> /bin/bash

#### Dependency installation

1.  Install required packages

<!-- -->

    apt-get update
    apt install build-essential llvm cmake clang  wget curl git

2.  Install Rust compiler

<!-- -->

    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source $HOME/.cargo/env
    rustup target add wasm32-unknown-unknown

3.  Install supported Rust toolchain (Rust `1.81.0-nightly`)

<!-- -->

    rustup install nightly-2024-07-18
    rustup target add wasm32-unknown-unknown --toolchain nightly-2024-07-18

4.  Install supported `llvm` version, for Rust `1.81.0-nightly` it is version 18:

<!-- -->

    apt install lsb-release wget software-properties-common gnupg
    bash -c "$(wget -O - https://apt.llvm.org/llvm.sh 18)"
    apt install llvm-18

5.  Now you can go to [Running Coverage Tool](coverage-tool.md#running-coverage-tool) instruction.
