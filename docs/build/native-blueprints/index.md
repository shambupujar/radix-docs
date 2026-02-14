---
title: "Native Blueprints"
---

# Native Blueprints

Certain blueprints are so critical, or so universally useful, that they are implemented directly in Rust in the Radix Engine.  Like any blueprint, these can be instantiated into components.  They contain no royalties, and are free for anyone to use.

Instantiating a native component is usually done through a dedicated [manifest instruction](/v1/docs/specifications), though this is not always the case.

Because native components do not require any WASM interpretation, they are highly performant and have minimal fee impact.

Adding new native blueprints (or adding new features to existing native blueprints) can only occur as part of a coordinated protocol update.
