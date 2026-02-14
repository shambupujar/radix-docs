---
title: "Logging"
---

# Logging

Logs are very useful for debugging and security purpose. To emit a log in Scrypto, you will need to use one of the following macros.

- `error!` for error or critical messages

- `warn!` for a warning

- `info!` for informational messages

- `debug!` for debugging

- `trace!` for tracing

All macros support both simple and formatted messages:

``` rust
info!("This is a simple message");
info!("This is a formatted message: {} + {} = {}", 1, 2, 1 + 2);
```

In case the variable is of a type which doesn’t implement the Display trait but the Debug trait, you will need to replace {} with {:?}, for instance:

``` rust
debug!("I'm debuging {:?}", this_structure);
```
