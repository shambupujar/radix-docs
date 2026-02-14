---
title: "Installing CLI"
---

# Installing CLI

### 1. Update the packages

Start by ensuring that the package list on the system is up to date by running the following command from the terminal:

``` bash
sudo apt update
```

You’ll also need `wget` and `curl`, if they do not come preinstalled on your distribution:

``` bash
sudo apt install wget curl
```

### 2. Download and install the babylonnode CLI

Now download the `babylonnode` CLI from its GitHub repository.

1.  Go to <a href="https://github.com/radixdlt/babylon-nodecli/releases/latest" target="_blank">babylon-nodecli/releases/latest</a>

2.  Copy the link to the script file for your distribution (e.g. `babylonnode-ubuntu-22.04`)

3.  On the target system, download the binary using `wget`. Here’s an example command that downloads version 2.2.3 (but you should always use the latest one) for Ubuntu 22.04:

``` bash
wget -O babylonnode https://github.com/radixdlt/babylon-nodecli/releases/download/2.2.3/babylonnode-ubuntu-22.04
```

:::note
By using the`babylonnode`CLI you agree to the<a href="https://uploads-ssl.webflow.com/6053f7fca5bf627283b582c2/65006e3d3a8002f9e834320c_radixdlt.com_genericEULA.pdf" target="_blank">End User License Agreement</a>.
:::


Set the permissions on the script to executable:

``` bash
chmod +x babylonnode
```

And move it to the `/usr/local/bin/` directory, so that it’s accessible without the need to specify a full path:

``` bash
sudo mv babylonnode /usr/local/bin
```

:::note
If you are installing the`babylonnode`CLI for use with an existing systemd node installation, then`babylonnode`should instead be moved to your`radixdlt`directory where it will expect to find your existing keystore file.

You may also need to set the current user as the owner of the`radixdlt`directory.
:::


**Next:**<a href="/v1/docs/node-setup-guided-installing-node"><strong>Installing the Node</strong></a>
