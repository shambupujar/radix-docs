---
title: "You can find all releases on https://github.com/radixdlt/radixdlt-scrypto/releases"
---

`scrypto-builder` is a tool for compiling Scrypto projects in a deterministic way. It allows third-parties to verify that package WASM and RPD files are indeed compiled from a specific source code.

## Usage

1.  Pull the `scrypto-builder` Docker image

``` bash
# You can find all releases on https://github.com/radixdlt/radixdlt-scrypto/releases

DOCKER_DEFAULT_PLATFORM=linux/amd64 docker pull radixdlt/scrypto-builder:v1.2.0
```

2.  Compile Scrypto project

``` bash
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker run -v /full/path/to/scrypto/crate:/src radixdlt/scrypto-builder:v1.2.0
```
