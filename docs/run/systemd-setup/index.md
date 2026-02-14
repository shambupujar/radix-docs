---
title: "install wget and unzip if they don't come preinstalled on your system"
---

### Introduction

Welcome to the Radix node manual setup guide!  
Before we begin, make sure you’ve read the [Node Setup Introduction](../node-setup/index.md).

On this page we’ll guide you through the process of setting up your node to run directly on the host system, and we’ll do it manually (i.e. without the use of our helper `babylonnode` CLI). Using the CLI is an alternative and easier way (for dedicated server instances). Manual mode is however better suited for shared servers (i.e. when the server isn’t solely dedicated to running a Radix node) or non-Ubuntu hosts. If you wish to switch to a CLI path, go to [Guided Setup Instructions](../guided-setup/index.md).  
There’s also an alternative path that utilizes Docker [here](../docker-setup/index.md) (also manually, i.e. without using our CLI).  
  
You can use any compatible operating system (again, check [Node Setup Introduction](../node-setup/index.md) for details), however all examples in this guide will be for Ubuntu 22.04. Consult your system’s manual for the corresponding packages/commands.

### Prerequisites

#### Update the system

First, let’s make sure that your system is up to date, if you’re on Ubuntu run:

``` bash
sudo apt update && sudo apt -y upgrade
```

#### Install Java

Then, we’ll need Java (version 17). We recommend using OpenJDK. On Ubuntu it’s the `openjdk-17-jdk` package:

``` bash
sudo apt install openjdk-17-jdk
```

#### Configure the firewall

You’ll need to open the p2p gossip port, which by default is 30000.

``` bash
 sudo ufw allow 30000/tcp
```

:::note
If you are using a cloud service then you must also arrange for external port access through your service provider: this is usually done through the service management console.

If you are hosting the service yourself, then you may need to open access to the ports through your hardware router and/or configure port forwarding.
:::


#### Recommended: create a dedicated user for running the node

We recommend to run the node as a dedicated system user, rather than the root user. We’ll use the `radixdlt` user name throughout this tutorial, however you can choose any name you like.

``` bash
sudo useradd radixdlt -m # create a new user
sudo passwd radixdlt # set its password
```

### Preparing the directory structure

We’ll need a place to store both the node software package and the actual ledger data. You can choose any directory on your system, as long as it’s accessible to the user that runs the node process (\`radixdlt\` user in this tutorial). We’ll also need some place to put a keystore file (containing a private key that uniquely identifies your node on the network).

An example folder structure could look like this:

- `/opt/radixdlt/babylon-node` - for the node software package

- `/srv/radixdlt/babylon-mainnet/data` - for the node storage directory (ledger data)

- `/srv/radixdlt/babylon-mainnet/keystore.ks` - for the keystore file

- `/srv/radixdlt/babylon-mainnet/mainnet.config` - for the configuration file

Make sure to replace the paths in the steps below if you choose to use a different folder structure.  
If you’re setting up a Stokenet node (you can read more about the different networks on the [Node Setup Introduction](../node-setup/index.md) page), you may wish to replace “mainnet” with “stokenet”.

### Downloading the Radix node software

Radix node consists of two components: the main Java application and an additional native library (`.dll` or `.so` file, depending on your system).

You can find the latest release on our GitHub: <a href="https://github.com/radixdlt/babylon-node/releases/latest" target="_blank">babylon-node/releases/latest</a>.  
The main Java application is the zip file named `babylon-node-va.b.c.zip` (where a.b.c is the version number). Unlike the Java application, native library is platform-dependant. You should download the file that corresponds to your system architecture. For example for 64-bit Linux it’s the: `babylon-node-rust-arch-linux-x86_64-release-va.b.c.zip` file.

Download and extract both files, you can use `wget`. For example:

``` bash
# install wget and unzip if they don't come preinstalled on your system
sudo apt install wget unzip

# make sure to replace the version (always use the latest!) and platform architecture
wget https://github.com/radixdlt/babylon-node/releases/download/v1.2.1/babylon-node-v1.2.1.zip
wget https://github.com/radixdlt/babylon-node/releases/download/v1.2.1/babylon-node-rust-arch-linux-x86_64-release-v1.2.1.zip

# extract both files
unzip babylon-node-1.2.1.zip
unzip babylon-node-rust-arch-linux-x86_64-release-1.2.1.zip
```

Following the directory structure we outlined above, let’s move both files to `/opt/radixdlt/babylon-node`:

``` bash
sudo mkdir -p /opt/radixdlt/babylon-node
sudo mv core-v1.2.1 /opt/radixdlt/babylon-node
sudo mv libcorerust.so /opt/radixdlt/babylon-node
```

We should also make sure that the files are accessible/owned by the `radixdlt` user:

``` bash
sudo chown -R radixdlt:radixdlt /opt/radixdlt
```

The resultant folder structure should look like this:

``` bash
tree /opt/radixdlt/babylon-node -L 2
/opt/radixdlt/babylon-node
├── core-v1.2.1
│   ├── bin
│   └── lib
└── libcorerust.so
```

### Generating the key pair

:::note
The keystore contains a randomly-generated private key that determines your node’s unique address.

This means that if you lose your keystore file, you will forever lose your node address and you’ll need to generate a new key for your node.
:::


We’ll be storing the key in `/srv/radixdlt/babylon-node/keystore.ks` , so let’s make sure the directory exists and has a correct owner/permissions:

``` bash
sudo mkdir -p /srv/radixdlt/babylon-mainnet/data
sudo chown -R radixdlt:radixdlt /srv/radixdlt
```

Now let’s run the key generator tool that comes with the Radix node distribution:

``` bash
sudo /opt/radixdlt/babylon-node/core-v1.2.1/bin/keygen \
  --keystore=/srv/radixdlt/babylon-mainnet/keystore.ks \
  --password=<password>
```

It goes without saying that you should replace `<password>` with an actual password. Use a strong one and don’t forget it!  
Again, make sure the file belongs to our user:

``` bash
sudo chown radixdlt:radixdlt /srv/radixdlt/babylon-mainnet/keystore.ks
```

### Preparing the configuration file

It’s time to choose the network that your node will join (you can read more about the different networks on the [Node Setup Introduction](../node-setup/index.md) page).

- **Mainnet**

  - use `network.id=1`

  - use the following `network.p2p.seed_nodes`

    


    

- **Stokenet**

  - use `network.id=2`

  - use the following `network.p2p.seed_nodes`

    


    

Create a `/srv/radixdlt/babylon-mainnet/mainnet.config` file with the following content:

``` bash
# The ID of the network to connect to (Mainnet=1, Stokenet=2), see above
network.id=1|2
# A comma-separated list of network seed nodes, copy-paste from above (must match network.id)
network.p2p.seed_nodes=<see-above>

node.key.path=/srv/radixdlt/babylon-mainnet/keystore.ks
db.location=/srv/radixdlt/babylon-mainnet/data
```

Remember to use your paths in`node.key.path`and`db.location`if they differ from the examples.

There are a few additional config options that you might wish to add to your config file at this point. They’re all optional and we provide reasonable defaults, however you may want to adjust some of them to fit your circumstances:



**Additional config options**



``` bash
# Here you can specify your node's public IP address
# you can get it from ifconfig.me, for example.
# You can leave this empty, in which case the node will
# try to get it automatically.
network.host_ip=

# The address that the Core API will bind to
# Defaults to 127.0.0.1
# It is recommended to keep the default and use
# a reverse-proxy (nginx) to access the Core API
# externally (if you need it).
# We show how to do it later on this page.
api.core.bind_address=
# Core API port defaults to 3333, you can chance it here
api.core.port=

# Similarly, System API binds to 127.0.0.1 by default
# and we recommend to keep it and use a reverse-proxy.
api.system.bind_address=
# System API port defaults to 3334, you can chance it here              
api.system.port=

# Similarly to above APIs, this defaults to 127.0.0.1
api.prometheus.bind_address=
# Prometheus API port defaults to 3335, you can chance it here
api.prometheus.port=

# This is the local port that the P2P server binds to
# If you change it, make sure to enable that port in your firewall
# (instructions how to do that have been shown above).
network.p2p.listen_port=30000
# This is a P2P port that's broadcasted to other peers (together with `network.host_ip`).
# If you're not using NAT/port-forwarding this should be the same as `listen_port`.
network.p2p.broadcast_port=30000

# An additional ledger index for transaction data, enabled by default 
db.local_transaction_execution_index.enable=true|false
# An additional ledger index for transactions that change accounts, enabled by default
db.account_change_index.enable=true|false
# Enabled by default, allows to disable a subset of Core API endpoints whose responses are potentially unbounded
api.core.flags.enable_unbounded_endpoints=true|false
```





Don’t forget to change the owner of the config file to `radixdlt` :

``` bash
sudo chown radixdlt:radixdlt /srv/radixdlt/babylon-mainnet/mainnet.config
```

### Running the node

At this point we’re ready to actually run the node! We’ll start with a simple script that just runs the node process in a terminal session and then we’ll productionize our setup by introducing a systemd service for our node.

#### Manual test run

Running the node is just running an executable file that comes with node distribution. That executable is located in the `bin` folder: `/opt/radixdlt/babylon-node/core-v1.2.1/bin/core` (The path may vary if you’re running a never version than `1.2.1` which is used in this example. Always use the latest version!).  
We’ll need to tell it where to find the files it requires (the keystore, config file, etc) as well as your keystore password. It’ll also require some additional JVM parameters. For clarity, let’s put the required environment variables in a separate file, and then create a node run script.

The environment file (e.g. `/srv/radixdlt/babylon-mainnet/environment`):

``` bash
# Enter your keystore password here
RADIX_NODE_KEYSTORE_PASSWORD="<your-keystore-password>"

# Update java.library.path if you're using a different path for your node dist
JAVA_OPTS="-Djava.library.path=/opt/radixdlt/babylon-node --enable-preview -server -Xms2g -Xmx12g  -XX:MaxDirectMemorySize=2048m -XX:+HeapDumpOnOutOfMemoryError -XX:+UseCompressedOops -Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts -Djavax.net.ssl.trustStoreType=jks -Djava.security.egd=file:/dev/urandom -DLog4jContextSelector=org.apache.logging.log4j.core.async.AsyncLoggerContextSelector"

# Update this if you're using a different path for your node dist
LD_PRELOAD="/opt/radixdlt/babylon-node/libcorerust.so"
```

Node run script (e.g. `/srv/radixdlt/babylon-mainnet/run.sh`):

``` bash
#!/bin/bash

# Load our environment variables from a file
set -a
source /srv/radixdlt/babylon-mainnet/environment
set +a

# Run the node; update the paths if needed
/opt/radixdlt/babylon-node/core-v1.2.1/bin/core -config=/srv/radixdlt/babylon-mainnet/mainnet.config
```

At this point, the only thing left to do is to make the script executable and run it!

``` bash
# Let's also change the owner of both files...
sudo chown radixdlt:radixdlt /srv/radixdlt/babylon-mainnet/environment
sudo chown radixdlt:radixdlt /srv/radixdlt/babylon-mainnet/run.sh

# ...and set proper permissions for the environment file
sudo chmod 700 /srv/radixdlt/babylon-mainnet/environment

# Make the script executable
sudo chmod +x /srv/radixdlt/babylon-mainnet/run.sh

# ...and run it as the radixdlt user
sudo su - radixdlt -c /srv/radixdlt/babylon-mainnet/run.sh
```

#### Verifying that the node works

After you’ve run the script, your node should start processing the genesis transactions. You should be seeing messages that begin with “Committing data ingestion chunk…” in the output log. This may take up to 30 minutes to fully process, depending on your hardware. Usually it finishes in around 10-15 minutes.

:::note
Warning



Don’t terminate (or restart) the process while the genesis transactions are being committed!  
If you do so before the whole process is completed you’ll need to wipe the data directory (e.g. `/srv/radixdlt/babylon-mainnet/data`) and start from scratch.
:::


  
After the process completes you should start seeing messages like “lgr_commit{epoch= … }”, which indicate that the node is working correctly (at which point you can safely stop/restart it any time you wish).

At this point you can also query the System API and the Core API.  
System API’s health endpoint provides an overall health summary of a node:

``` bash
curl 127.0.0.1:3334/system/health
```

The response should include `"status":"SYNCING`. All possible statuses have been described in detail [here](../../build/scrypto/logging.md).

:::note
Tip!



`jq`is a great tool for querying the endpoints that return JSON data (such as node’s System and Core APIs). On Ubuntu you can install it with:

``` bash
sudo apt install jq
```

We’ll use it from now on in the examples. But if you prefer not to install it, simply skip the`| jq`pipe suffix from the example commands.
:::


You can also inspect the Core API and query the current state of the ledger:

``` bash
curl 127.0.0.1:3333/core/status/network-status -X POST -H 'Content-Type: application/json' --data '{"network": "mainnet"}' | jq
```

There’s a `current_epoch_round` field in the response and both the `epoch` and `round` number should be steadily growing as you re-run the query - this indicates that the node is correctly syncing the ledger state.

Congratulations! At this point you’ve got a fully operational Radix node connected to the network.  
Note that it might take some time until it’s fully synced up with the latest ledger state. You can check the current epoch using one of the community-run Radix network dashboards on the internet.

We highly encourage you to follow the remainder of this tutorial to productionize your node.

#### Troubleshooting

If your node isn’t running at this point you can drop a message on <a href="https://discord.com/invite/radixdlt" target="_blank">Discord</a> where Radix staff and community will be happy to help out.

#### Creating a systemd service

In rare cases would one be happy having to manually run a script every time the system reboots. To aid that, in this section we’ll create a systemd service that will manage our node process. We won’t be needing the `run.sh` script from the previous step anymore, but you’re free to keep it for debugging purposes. Just make sure that you’re not trying to run it at the same time when the systemd service is active. We’ll reuse the `environment` file from the previous section, so go ahead and create it, if you haven’t yet. Keep in mind that it’s a simple key-value file, not a bash script (so e.g. variable substitution like so `ABC="$CDE"` won’t work!).

We’ll create a system-wide service for our node, but with minimal adjustment it could also run as a user service, if that’s what you prefer. In any case, we’ll still run the process under the `radixdlt` user.

Create a systemd unit file (e.g. `/etc/systemd/system/babylon-node.service`):

``` ceylon
[Unit]
Description=Radix Babylon Node
After=local-fs.target
After=network-online.target
After=nss-lookup.target
After=time-sync.target
After=systemd-journald-dev-log.socket
Wants=network-online.target

[Service]
EnvironmentFile=/srv/radixdlt/babylon-mainnet/environment
User=radixdlt
LimitNOFILE=65536
LimitNPROC=65536
LimitMEMLOCK=infinity
WorkingDirectory=/opt/radixdlt/babylon-node/core-v1.2.1
ExecStart=/opt/radixdlt/babylon-node/core-v1.2.1/bin/core -config=/srv/radixdlt/babylon-mainnet/mainnet.config
SuccessExitStatus=143
TimeoutStopSec=10
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Don’t forget to update the paths if yours differ from the example!

#### Verifying that the systemd service works

Run the following command to start the service:

``` bash
sudo systemctl start babylon-node
```

You can use `journalctl` to inspect the logs of a running node (or errors, if there are any):

``` bash
sudo journalctl -f -u babylon-node
```

To stop the node use:

``` bash
sudo systemctl stop babylon-node
```

#### Enabling systemd service autostart

Run the following command to enable the node service at startup:

``` bash
sudo systemctl enable babylon-node.service
```

### Configuring a reverse-proxy (nginx) for node APIs

nginx is a modern proxy server that we can use to securely expose our node’s APIs on a public network interface. Note that this is an optional step. You can skip it if you don’t need your node’s APIs to be accessible on the internet (you can still use e.g. ssh and query the API locally).

#### Installing nginx

To install nginx on Ubuntu run:

``` bash
sudo apt install -y nginx apache2-utils
```

nginx comes with some predefined site directories that you’re not going to need, so you can delete them:

``` bash
sudo rm -rf /etc/nginx/{sites-available,sites-enabled}
```

#### Download Radix Node nginx configuration files

We do provide a set of ready to use configuration files for your nginx server, which you can download from <a href="https://github.com/radixdlt/babylon-nginx/releases" target="_blank">https://github.com/radixdlt/babylon-nginx/releases</a>.

1.  Go to <a href="https://github.com/radixdlt/babylon-nginx/releases" target="_blank">https://github.com/radixdlt/babylon-nginx/releases</a> and look for the entry with the Latest release marker.

2.  Download the `babylon-nginx-fullnode-conf.zip` file (e.g. copy its URL and use `wget` on your server).

3.  Unzip the nginx configuration you’ve just downloaded:

    ``` bash
    unzip babylon-nginx-fullnode-conf.zip
    ```

4.  Copy the files to the nginx setup directory.

    ``` bash
    sudo cp -r conf.d/ /etc/nginx/
    ```

5.  And now copy the nginx configuration files:"

    ``` plaintext
    sudo cp nginx-fullnode.conf /etc/nginx/nginx.conf
    ```

#### Create a cache directory

nginx requires a cache directory for storing the reusable artifacts it downloads. Use the following command to create the cache:

``` bash
sudo mkdir -p /var/cache/nginx/radixdlt-hot
```

#### Create the SSL Certificates

You can use your own SSL certificates if you wish, but for convenience, you’ll find the instructions for creating a set here.

:::note
TIP



If you run into trouble generating the SSL key due to lack of entropy, try running:

``` plaintext
sudo apt install rng-tools
sudo rngd -r /dev/random
```
:::


1.  Create the directory to hold the certificates:

    ``` bash
    sudo mkdir /etc/nginx/secrets
    ```

2.  Create the SSL keys using the following command:

    ``` bash
    sudo openssl req  -nodes -new -x509 -nodes -subj '/CN=localhost' -keyout "/etc/nginx/secrets/server.key" -out "/etc/nginx/secrets/server.pem"
    ```

3.  And now execute this command to make sure the keys are in the correct format:

    ``` bash
    sudo openssl dhparam -out /etc/nginx/secrets/dhparam.pem  4096
    ```

    This command may take a minute or more to run.

4.  Run the next command to set the authentication password for the server’s `admin` user:

    ``` bash
    sudo htpasswd -c /etc/nginx/secrets/htpasswd.admin admin
    ```

5.  Similary you can set the authentication password for the server’s `metrics` user:

    ``` bash
    sudo htpasswd -c /etc/nginx/secrets/htpasswd.metrics metrics
    ```

#### Open the firewall port

``` bash
sudo ufw allow 443/tcp
```

#### Start nginx

1.  Now, to start nginx, execute the following command:

    ``` bash
    sudo systemctl start nginx
    ```

2.  And now run this command to make sure that `nginx` starts up when the host server restarts:

    ``` bash
    sudo systemctl enable nginx
    ```

3.  You can check if the service is running by executing this command:

    ``` bash
    curl -k -u admin:{nginx-admin-password} 'https://localhost/system/identity' --header 'Content-Type: text/plain'
    ```

which should return a JSON response with node details, including its address:

``` json
{
  "node_address": "node_...",
  ...
}
```

:::note
If you’re getting connection errors when trying to connect to the node, then you may need to restart both the node and nginx so they sync correctly. Try executing the following commands:

``` bash
sudo systemctl restart babylon-node
sudo systemctl restart nginx
```
:::

