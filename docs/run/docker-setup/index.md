---
title: "Docker Setup"
---

# Docker Setup

### Introduction

Welcome to the Radix node manual setup guide!  
Before we begin, make sure you’ve read the [Node Setup Introduction](../node-setup/index.md).

On this page we’ll guide you through the process of setting up your node to run inside a Docker container directly on the host system, and we’ll do it manually (i.e. without the use of our helper `babylonnode` CLI). Using the CLI is an alternative and easier way (for dedicated server instances). Manual mode is however better suited for shared servers (i.e. when the server isn’t solely dedicated to running a Radix node) or non-Ubuntu hosts. If you wish to switch to a CLI path, go to [Guided Setup Instructions](../guided-setup/index.md).  
There’s also an alternative path that utilizes systemd, instead of Docker [here](../systemd-setup/index.md) (also manually, i.e. without using our CLI).

You can use any compatible operating system (again, check [Node Setup Introduction](../node-setup/index.md) for details), however all examples in this guide will be for Ubuntu 22.04. Consult your system’s manual for the corresponding packages/commands.

We’ve split the installation into discrete stages:

- Installing Docker and the secure key generation tools.

- Using the `keygen` application to generate secure keys for your service.

- Installing and running the node on a provisioned server instance.

:::note
**>
Note

**

We’re using <a href="https://aws.amazon.com/" target="_blank">Amazon Web Services</a> throughout our example, but you can install Radix nodes on any cloud service that supports Java, such as <a href="https://cloud.google.com/" target="_blank">Google’s cloud platform</a> or <a href="https://azure.microsoft.com/" target="_blank">Microsoft Azure</a> – or follow similar step to deploy on a private server.
:::


### Installing Docker

Run the following commands to install `docker` and `docker-compose`.







1.  Create the directory for the compose scripts:

    

    ``` bash
    sudo apt update
    mkdir radixdlt
    cd radixdlt
    mkdir babylon-ledger
    ```

    > All further instructions assume you are running the commands from `radixdlt`directory and use`radixdlt/babylon-ledger`as your storage directory. Make sure to update the docker-compose file if these should be changed.

    

    

2.  Install `wget`, `Docker` and the tools for key generating randomized keys:

    

    ``` bash
    sudo apt install wget docker.io docker-compose rng-tools
    # Setup the random number generator
    sudo rngd -r /dev/random
    ```

    

    

3.  Add user to Docker group:

    

    ``` bash
    sudo groupadd docker # ignore any errors if the group already exists
    sudo usermod -aG docker $USER
    newgrp docker
    ```

    

    









### Get the Docker Compose Script



You will need a docker compose script to build the node, which you can download from the<a href="https://github.com/radixdlt/babylon-nodecli/blob/main/node-runner-cli/templates/radix-fullnode-compose.yml.j2">Radix repository on GitHub</a>directly to your server. Here we provide an example Docker compose file for Mainet/Stokenet nodes.  
Copy and paste the following code into a file and call it `radix-fullnode-compose.yml`.

:::note
The list of <a href="https://github.com/radixdlt/babylon-node/blob/main/docker/config/default.config.envsubst" target="_blank">all possible configuration is available here</a>.
:::




**Mainnet node**



``` yaml
version: '3.8'
services:
  core:
    cap_add:
    - NET_ADMIN
    environment:
      RADIXDLT_NETWORK_ID: 1
      RADIXDLT_NETWORK_SEEDS_REMOTE: "radix://node_rdx1qf2x63qx4jdaxj83kkw2yytehvvmu6r2xll5gcp6c9rancmrfsgfw0vnc65@babylon-mainnet-eu-west-1-node0.radixdlt.com,radix://node_rdx1qgxn3eeldj33kd98ha6wkjgk4k77z6xm0dv7mwnrkefknjcqsvhuu4gc609@babylon-mainnet-ap-southeast-2-node0.radixdlt.com,radix://node_rdx1qwrrnhzfu99fg3yqgk3ut9vev2pdssv7hxhff80msjmmcj968487uugc0t2@babylon-mainnet-ap-south-1-node0.radixdlt.com,radix://node_rdx1q0gnmwv0fmcp7ecq0znff7yzrt7ggwrp47sa9pssgyvrnl75tvxmvj78u7t@babylon-mainnet-us-east-1-node0.radixdlt.com"
      JAVA_OPTS: --enable-preview -server -Xms4g -Xmx12g -XX:MaxDirectMemorySize=2048m
        -XX:+HeapDumpOnOutOfMemoryError -XX:+UseCompressedOops -Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts
        -Djavax.net.ssl.trustStoreType=jks -Djava.security.egd=file:/dev/urandom -DLog4jContextSelector=org.apache.logging.log4j.core.async.AsyncLoggerContextSelector
      RADIXDLT_LOG_LEVEL: info
      RADIXDLT_NETWORK_USE_PROXY_PROTOCOL: 'false'
      RADIXDLT_VALIDATOR_KEY_LOCATION: /home/radixdlt/node-keystore.ks
      RADIX_NODE_KEYSTORE_PASSWORD: "\${RADIXDLT_NODE_KEY_PASSWORD}"
    image: radixdlt/babylon-node:v1.2.1
    init: true
    mem_limit: 14000m
    restart: unless-stopped
    ulimits:
      memlock: -1
      nofile:
        hard: 65536
        soft: 65536
    volumes:
    - babylon_ledger:/home/radixdlt/RADIXDB
    - ./node-keystore.ks:/home/radixdlt/node-keystore.ks
  nginx:
    environment:
      RADIXDLT_GATEWAY_API_ENABLE: 'true'
      RADIXDLT_GATEWAY_BEHIND_AUTH: 'true'
      RADIXDLT_NETWORK_USE_PROXY_PROTOCOL: 'false'
      RADIXDLT_TRANSACTIONS_API_ENABLE: 'false'
    image: radixdlt/babylon-nginx:1.0.8
    ports:
    - 443:443
    - 30000:30000
    restart: unless-stopped
    ulimits:
      nofile:
        hard: 65536
        soft: 65536
    volumes:
    - nginx_secrets:/etc/nginx/secrets
volumes:
  babylon_ledger:
    driver: local
    driver_opts:
      device: ./babylon-ledger
      o: bind
      type: none
  nginx_secrets:
```







**Stokenet (testnet) node**



``` yaml
version: '3.8'
services:
  core:
    cap_add:
    - NET_ADMIN
    environment:
      RADIXDLT_NETWORK_ID: 2
      RADIXDLT_NETWORK_SEEDS_REMOTE: "radix://node_tdx_2_1qv89yg0la2jt429vqp8sxtpg95hj637gards67gpgqy2vuvwe4s5ss0va2y@babylon-stokenet-ap-south-1-node0.radixdlt.com,radix://node_tdx_2_1qvtd9ffdhxyg7meqggr2ezsdfgjre5aqs6jwk5amdhjg86xhurgn5c79t9t@babylon-stokenet-ap-southeast-2-node0.radixdlt.com,radix://node_tdx_2_1qwfh2nn0zx8cut5fqfz6n7pau2f7vdyl89mypldnn4fwlhaeg2tvunp8s8h@babylon-stokenet-eu-west-1-node0.radixdlt.com,radix://node_tdx_2_1qwz237kqdpct5l3yjhmna66uxja2ymrf3x6hh528ng3gtvnwndtn5rsrad4@babylon-stokenet-us-east-1-node1.radixdlt.com"
      JAVA_OPTS: --enable-preview -server -Xms4g -Xmx12g -XX:MaxDirectMemorySize=2048m
        -XX:+HeapDumpOnOutOfMemoryError -XX:+UseCompressedOops -Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts
        -Djavax.net.ssl.trustStoreType=jks -Djava.security.egd=file:/dev/urandom -DLog4jContextSelector=org.apache.logging.log4j.core.async.AsyncLoggerContextSelector
      RADIXDLT_LOG_LEVEL: info
      RADIXDLT_NETWORK_USE_PROXY_PROTOCOL: 'false'
      RADIXDLT_VALIDATOR_KEY_LOCATION: /home/radixdlt/node-keystore.ks
      RADIX_NODE_KEYSTORE_PASSWORD: "\${RADIXDLT_NODE_KEY_PASSWORD}"
    image: radixdlt/babylon-node:v1.2.1
    init: true
    mem_limit: 14000m
    restart: unless-stopped
    ulimits:
      memlock: -1
      nofile:
        hard: 65536
        soft: 65536
    volumes:
    - babylon_ledger:/home/radixdlt/RADIXDB
    - ./node-keystore.ks:/home/radixdlt/node-keystore.ks
  nginx:
    environment:
      RADIXDLT_GATEWAY_API_ENABLE: 'true'
      RADIXDLT_GATEWAY_BEHIND_AUTH: 'true'
      RADIXDLT_NETWORK_USE_PROXY_PROTOCOL: 'false'
      RADIXDLT_TRANSACTIONS_API_ENABLE: 'false'
    image: radixdlt/babylon-nginx:1.0.8
    ports:
    - 443:443
    - 30000:30000
    restart: unless-stopped
    ulimits:
      nofile:
        hard: 65536
        soft: 65536
    volumes:
    - nginx_secrets:/etc/nginx/secrets
volumes:
  babylon_ledger:
    driver: local
    driver_opts:
      device: ./babylon-ledger
      o: bind
      type: none
  nginx_secrets:
```





### Generate the keys

You’ll need the Radix Key Generator application to create secure keys for the node once it’s installed. (It’s a good idea to generate the keys first, just to get them out of the way).

:::note
The keystore contains a randomly-generated private key that determines your node’s unique address.

This means that if you lose your keystore file, you will forever lose your node address and you’ll need to generate a new key for your node.
:::




You can check for the latest version of the `keygen` program here:





<a href="https://hub.docker.com/r/radixdlt/keygen/tags?page=1&amp;ordering=last_updated" target="_blank">hub.docker.com/radixdlt/keygen</a>



which should be used in the command given below to generate the secure keys.  
**Change the**`--password=`**parameter in the following command to a secure password of your choice! Don’t forget it!**





``` bash
docker run --rm -v \${PWD}:/keygen/key radixdlt/keygen:v1.4.1 --keystore=/keygen/key/node-keystore.ks --password=your-password
```









If you check the directory, you should now have a key file called `node-keystore.ks`.

:::note
The key generation process may take a long time if your server hasn’t generated a sufficiently large pool of random values to build fresh keys. Be prepared to wait up to twenty minutes for the key generation to complete.
:::


You must change the key file’s permissions so that container can use it.

``` bash
sudo chmod 644 node-keystore.ks
```



And update the password in the `radix-fullnode-compose.yml` :





``` bash
RADIX_NODE_KEYSTORE_PASSWORD: "your-password"
```

### Configure the Ports











The node requires that a number of ports are accessible on your server instance. Ensure that ports `443` and `30000` are available and can be seen externally.





  



``` bash
sudo ufw allow 30000/tcp
sudo ufw allow 443/tcp
```

:::note
Bear in mind that you must arrange for port access outside your cloud server instance: this is usually done through the management console provided by your cloud service.
:::






### Configure nginx admin password

The node uses <a href="https://www.nginx.com/" target="_blank">nginx</a> as its front end server. During startup, it creates an HTTP basic auth user named `admin`. The password is generated automatically and printed to the logs. If you want to use your own password, you will need to use the Docker instruction below to set the password before running the node installation. Replace`<nginx-admin-password>` with your password.

``` bash
docker run --rm -v radixdlt_nginx_secrets:/secrets radixdlt/htpasswd:v1.1.0 htpasswd -bc /secrets/htpasswd.admin admin <nginx-admin-password>
```

:::note
If you omit the command, then nginx will create a password and print it out in the log. It will not appear in the logs if the nginx container restarts for any other reason.
:::




To setup the metrics user, run the following command. Replace `<nginx-metrics-password>` with your password:





``` bash
docker run --rm -v radixdlt_nginx_secrets:/secrets radixdlt/htpasswd:v1.1.0 htpasswd -bc /secrets/htpasswd.metrics metrics <nginx-metrics-password>
```





### Running the node



Run the compose script to install and run the node.

``` bash
docker-compose -f radix-fullnode-compose.yml up -d
```



:::note
The docker-compose file uses relative paths and expects this command to be run from the radixdlt folder created in the first step.
:::


### Verifying that the node works

You can use `docker logs -f radixdlt_core_1` to inspect the logs of a running node.

A fresh node should start with processing the genesis transactions. You should be seeing messages that begin with “Committing data ingestion chunk…” in the output log. This may take up to 30 minutes to fully process, depending on your hardware. Usually it finishes in around 10-15 minutes.

:::note
Warning



Don’t stop (or restart) the Docker container while the genesis transactions are being committed!  
If you do so before the whole process is completed you’ll need to wipe the data directory (`babylon-ledger`)and start from scratch.
:::


  
After the process completes you should start seeing messages like “lgr_commit{epoch= … }”, which indicate that the node is working correctly (at which point you can safely stop/restart the container any time you wish).

At this point you can also query the System API and the Core API.  
System API’s health endpoint provides an overall health summary of a node:

``` bash
curl -k -u "admin:<nginx-admin-password>" https://127.0.0.1/system/health
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
curl -k -u "admin:<nginx-admin-password>" https://127.0.0.1/core/status/network-status -X POST -H 'Content-Type: application/json' --data '{"network": "mainnet"}' | jq
```

There’s a `current_epoch_round` field in the response and both the `epoch` and `round` number should be steadily growing as you re-run the query - this indicates that the node is correctly syncing the ledger state.

Congratulations! At this point you’ve got a fully operational Radix node connected to the network.  
Note that it might take some time until it’s fully synced up with the latest ledger state. You can check the current epoch using one of the community-run Radix network dashboards on the internet.

### Troubleshooting

If your node isn’t running at this point you can drop a message on <a href="https://discord.com/invite/radixdlt" target="_blank">Discord</a> where Radix staff and community will be happy to help out.
