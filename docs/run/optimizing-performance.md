---
title: "Optimizing Performance"
---

# Optimizing Performance

### Introduction

Once your node is running and connected to the network, you can optimise it for better performance and more efficient use of system resources. Of course, these changes will depend on your hardware setup, the system resources available, and what kind of node you’re running: a full node or a validator node. What we’re presenting here is a guide based on the experience of the Radix engineers and DevOps. Your mileage, of course, may vary.

We’re going to change the system resource allocations by changing the parameters in the `ulimit` configuration, but before we get going, let’s take a look at the configuration settings we’re interested in:

|  |  |  |
|:---|:---|:---|
| Parameter | Description | Setting |
| `nofile` | The number of files the host OS can keep open at once. | 65536 |
| `nproc` | The number of processes the OS can run simultaneously. | 65536 |
| `memlock (soft)` | The maximum locked-in address space a particular user can allocate. Once allocated, the pages stay in physical memory, which speeds up operations on the ledger database. The `soft` limit applies to the owner of the process, which will be `radixdlt` in our case. | unlimited |
| `memlock (hard)` | The maximum locked-in address space that can allocated on the OS as a whole. This value can only be set by the `root` user. Any `soft` memlock cannot exceed the value of the `hard` memlock. | unlimited |

:::note
If you’re running other applications on the same server as your node (which is highly inadvisable) then setting `memlock (soft)` to `unlimited` will severely impact the performance of the other applications.
:::


These changes can be made manually, but the easiest way to do it is through the infinitely versatile `babylonnode` script.

### Prerequisites

Obviously, you’ll need to have the `babylonnode` CLI installed before you optimise the node. It’s a good idea to download the `babylonnode` script, even if you have already installed it; this will ensure you’re running the latest version.

For guidance on installing the babylonnode CLI, take a look at [Installing the babylonnode CLI](guided-setup/installing-cli.md).

### 1. Set up the optimiser

1.  Execute the following command:

    ``` bash
    babylonnode optimise-node
    ```

    The script will now download the support files

2.  Log out of the shell then log in again.

### 2. Run the optimiser

1.  Once the optimiser has installed, and you’ve logged back into the shell, run the same command to carry out the optimisations:

    ``` bash
    babylonnode optimise-node
    ```

2.  The script will now ask if you’d like to update the ulimit settings. Press Y to update the settings to match the ones described above.

3.  The script will now ask if you’d like to change the swap space. We’re recommending a swap file size of 8 GB (regardless of node type), so enter 8G.

4.  Log out of your session to update the settings, then log in again.

### 3. Check your settings

To check your settings, execute the following command:

``` bash
ulimit -a
```

The resulting table should match the settings presented above.

``` plainText
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
pending signals                 (-i) 30953
max locked memory       (kbytes, -l) unlimited
max memory size         (kbytes, -m) unlimited
open files                      (-n) 65536
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
real-time priority              (-r) 0
stack size              (kbytes, -s) 8192
cpu time               (seconds, -t) unlimited
max user processes              (-u) 65536
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited
```

You can also check the swap size using this command:

``` bash
swapon --show
```

which gives the swap size, along with the amount in use

``` plainText
NAME      TYPE SIZE USED PRIO
/swapfile file   8G  25M   -2
```

### 





