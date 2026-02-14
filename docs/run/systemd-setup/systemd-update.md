---
title: "Systemd Update"
---

# Systemd Update

### Introduction

These instructions will show you how to upgrade nodes installed as systemd instances.

Please read the instructions all the way through first, before applying the changes.

### Prepare to update

First, if you haven’t already done so, ensure that you have backed up your keystore file (e.g. `keystore.ks`). This key file contains the private key that determines your node’s unique address. If anything goes wrong in the update process, if you have your key file, you can always reinstall the node from scratch and use it to recover access to your node with its previous network identity.

Next, you may want to consider using a backup node to perform a switch to the updated node with minimal interruption (especially if running a validator node) – or to provide a quick recovery if something goes wrong during the update. See our recommendations for Maintaining Uptime for more.

### Download the latest node distribution

1.  Go to <a href="https://github.com/radixdlt/babylon-node/releases" target="_blank">https://github.com/radixdlt/babylon-node/releases</a> and look for the entry with the \[ Latest release \] marker.

2.  Download the corresponding node distribution zip file and the native library file (see the [Node Setup instructions](index.md) “Downloading the Radix node software” section for details)

3.  Unzip both files and place them in some directory on your system (e.g. `/opt/radixdlt/babylon-node/core-v1.2.1` ), again, this is analogous to node setup docs

An example folder structure could looks like this:

``` bash
tree /opt/radixdlt/babylon-node -L 2
/opt/radixdlt/babylon-node
├── core-v1.2.0
│   ├── bin
│   └── lib
└── libcorerust.so
├── core-v1.2.1
│   ├── bin
│   └── lib
└── libcorerust.so
```

where `core-v1.2.0` is the old (current) version and `core-v1.2.1` is the new one. Make sure to put a correct `libcorerust.so` file in a new directory! Always use the one that comes with the rest of the node dist, don’t copy it from the previous version!

Make sure that all new files have a correct owner:

``` bash
sudo chown -R radixdlt:radixdlt /opt/radixdlt
```

#### Stop the node process

Before upgrading the software, you’ll need to shut the node down:

``` bash
sudo systemctl stop babylon-node
```

### Update the systemd unit file

We can now point the systemd service to use a new binary. Update the `ExecStart=` line in your systemd unit file (e.g. `/etc/systemd/system/babylon-node.service`) to point to a directory you’ve created in the previous step. E.g.:

``` bash
ExecStart=/opt/radixdlt/babylon-node/core-v1.2.1/bin/core -config=/srv/radixdlt/babylon-mainnet/mainnet.config
```

And reload the configuration:

``` bash
sudo systemctl daemon-reload
```

### Save your existing nginx configuration

If you still have an existing `nginx` configuration from your previous installation then it’s a good idea to move it to another location, e.g.:

``` bash
sudo mv babylon-nginx-fullnode-conf.zip babylon-nginx-fullnode-conf.zip.spare
```

### Download the latest nginx configuration

1.  Go to <a href="https://github.com/radixdlt/babylon-nginx/releases" target="_blank">https://github.com/radixdlt/babylon-nginx/releases</a> and look for the entry with the \[ Latest release \] marker.

2.  Download the `babylon-nginx-fullnode-conf.zip` file.

### Install the new nginx configuration

1.  Unzip the nginx configuration. (You can overwrite all the files)

    ``` bash
    unzip babylon-nginx-fullnode-conf.zip
    ```

2.  Copy the files to the nginx setup directory.

    ``` bash
    sudo cp -r conf.d/ /etc/nginx/
    ```

3.  And now copy the nginx configuration files for your node type. If you are running a full node then execute:

    ``` bash
    sudo cp nginx-fullnode.conf /etc/nginx/nginx.conf
    ```

### Restart nginx and the node

``` bash
sudo systemctl restart babylon-node
sudo systemctl restart nginx
```

### Verify that the node has been upgraded

You can check the version of the node software by sending an information request using `curl`:

``` bash
curl -k -u admin:nginx-password "https://localhost/system/version"
```

The response is a JSON string that carries the version number as its payload, e.g.:

``` bash
{"version":"v1.2.1"}
```
