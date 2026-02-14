---
title: "Transfer 100 XRD from the default account to <ACCOUNT_2_ADDRESS>"
---

## `resim`

`resim` is your entry point command to interact with the Radix Engine Simulator for local development purposes. With `resim` you can create accounts, publish packages, run transactions and inspect the local ledger that the simulator creates for this purpose. Below you will find examples of some common tasks you may use `resim` for in the development process. To get started simply open a new terminal and run `resim -h` this should give you the following output with a list of available subcommands to begin with.

``` bash
resim 1.0.0
Build fast, reward everyone, and scale without friction

USAGE:
    resim <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    call-function                Call a function
    call-method                  Call a method
    export-package-definition    Export the definition of a package
    generate-key-pair            Generate a key pair
    help                         Print this message or the help of the given subcommand(s)
    mint                         Mint resource
    new-account                  Create an account
    new-badge-fixed              Create a fungible badge with fixed supply
    new-badge-mutable            Create a fungible badge with mutable supply
    new-simple-badge             Create a non-fungible badge with fixed supply
    new-token-fixed              Create a fungible token with fixed supply
    new-token-mutable            Create a fungible token with mutable supply
    publish                      Publish a package
    reset                        Reset this simulator
    run                          Compiles, signs and runs a transaction manifest
    set-current-epoch            Set the current epoch
    set-current-time             Set the current time
    set-default-account          Set default account
    show                         Show an entity in the ledger state
    show-configs                 Show simulator configurations
    show-ledger                  Show entries in the ledger state
    transfer                     Transfer resource to another account
```

## `resim` Cheat Sheet

|  |  |
|:---|:---|
| Command | Action |
| `resim reset` | Resets your local ledger data |
| `resim new-account` | Creates a new account and sets to default account if one is not already set. ie you just ran `resim reset` so the ledger is empty |
| `resim show <address>` | To show info about an address |
| `resim show-ledger` | To list all entities in simulator |
| `resim set-default-account <account_address> <account_private_key> <owner_badge>` | To change the default account |
| `resim generate-key-pair` | To get a new key-pair, without creating an account component |
| `resim new-token-fixed <amount>` | To create a token with fixed supply |
| `resim new-token-mutable <minter_badge_address>` | To create a token with mutable supply |
| `resim new-badge-fixed <amount>` | To create a badge with fixed supply |
| `resim new-badge-mutable <minter_badge_address>` | To create a badge with mutable supply |
| `resim new-simple-badge` | To create a simple NFT badge |
| `resim mint <amount> <resource_address> <minter_badge_address>` | To mint resource |
| `resim transfer <resource_address>:<amount_or_comma_separated_nf_ids> <recipient_address>` | To transfer resource |
| `resim publish <path_to_package_dir>` | To publish a package |
| `resim call-function <package_address> <blueprint_name> <function> <args>` | To call a function |
| `resim call-method <component_address> <method> <args>` | To call a method |
| `resim export-package-definition [OPTIONS] <PACKAGE_ADDRESS> <OUTPUT>` | Export the definition of a package `<OUTPUT>` the output file |
| `resim run <path_to_manifest_file>` | To run a transaction manifest file |
| `resim set-current-epoch` | To set the current epoch |
| `resim set-current-time` | To set the current time (UTC date time in ISO-8601 format, up to second precision, such as 2011-12-03t10:15:30Z). |
| `resim publish <path_to_package_dir> --package-address <existing_address>` | To overwrite a deployed package |

## Using `resim`

The following section demonstrates some common usage examples of the Radix Engine Simulator or `resim`

### Creating Accounts

Accounts on the Radix network are Scrypto components that hold resource containers and define rules for accessing them. You can instantiate a new account component in the simulator with the `resim new-account` command. This will give you back the created account’s `ComponentAddress`, public key, private key, and an Owner Badge. If this is the first account that is instantiated, it will be configured as the "default account" - from which transactions you execute will be signed.

``` bash
resim new-account
`Example Output`
A new account has been created!
Account component address: account_sim1q0l5cmngyap5443zz4qmfylds4tze93rjmpjwt6ev3fq6jyvdh  // #1
Public key: 035f5abaa76e02fdbf313063ac02f7b3e7178dea5a1f2373e69b066d9799280b80  // #2
Private key: dfb5804b5c9d9d4bbde3432b7cd674093355439f1695494f612ee3a75ae165ac  // #3
Owner Badge: resource_sim1qz5p306qw4zs7nc8vf0zrtl3dasv63g8m4kwvk5kx0vqluxmjf:#1  // #4
Account configuration in complete. Will use the above account as default.
```

1.  Your account `ComponentAddress` will be important to specify where resources will be withdrawn from or deposited to.

2.  Your public key of course is your cryptographic identifier.

3.  Your private key will be used to sign transactions. With resim, this is done automatically. So there are only a handful of situations where you may need to handle public/private keys.

4.  The Owner Badge is a resource used to establish ownership and administrative controls over a package. With resim you may not often need to deal with the Owner Badge, but it is good to be aware of this as you climb up the learning curve of Radix development stack.

### Changing Default Account

At some point when you want to test your application, you may want to simulate different scenarios to test your application against. For example, you may want to have the perspective of a buyer or a perspective of a seller if you were building some sort of marketplace. It may be useful to have multiple accounts to run transactions through different accounts. To do so, you will want to change the default account by running the `resim set-default-account`. Using this command along with its input requirement will look something like this:

``` bash
resim set-default-acount <ACCOUNT_ADDRESS> <PRIVATE_KEY> <OWNER_BADGE>
```

The account `ComponentAddress`, `private_key`, and Owner Badge `NonFungibleGLobalId` belong to the account you wish to change the default to.

So if we create a second account by running `resim new-account` again, it will produce another set of account information:

``` bash
resim new-account
`Example Output`
A new account has been created!
Account component address: account_sim1q3nq6a5t8hx8znrwkf3r870g8lc2d3364276gsge5drstdwley
Public key: 03bb20507c6f081330f616564186a28068c2c909712f561f20551943a4e0263a67
Private key: 6e472ca0351d883b3583a272e6a9da840a13962606c1971fc280bc0cd45b8601
Owner badge: resource_sim1qfxvtzdvls3u476wxj8t4hfg2temmm463gtzc0szv2estyq2mn:#1#
```

Now having a second account, we can set the default account to the new account we just created by running `resim set-default-account` with the argument inputs as so:

``` bash
resim set-default-account account_sim1q3nq6a5t8hx8znrwkf3r870g8lc2d3364276gsge5drstdwley 6e472ca0351d883b3583a272e6a9da840a13962606c1971fc280bc0cd45b8601 resource_sim1qz5p306qw4zs7nc8vf0zrtl3dasv63g8m4kwvk5kx0vqluxmjf:#1#
```

And like that, the simulator has now configured the default-account to a different account

:::note
At any time, you can find the current default account with the command `resim show-configs`
:::


### Sending Tokens

You can send tokens from the default account to another one by running the command:

``` bash
resim transfer [OPTIONS] <RESOURCE_SPECIFIER> <RECIPIENT_ACCOUNT_ADDRESS>
```

Which takes two parameters: the resource to send (as a `RESOURCE_SPECIFIER` string) and the recipient’s address (which was returned from the new-account command). The `RESOURCE_SPECIFIER` syntax is discussed further below, but as an example, it looks like this, for fungible and non-fungible resources respectively:

``` bash
# Transfer 100 XRD from the default account to <ACCOUNT_2_ADDRESS>
resim transfer resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3:100 <ACCOUNT_2_ADDRESS>
# Transfer the #12#, #900#, #181# non-fungibles under the given resource address to <ACCOUNT_2_ADDRESS>
resim transfer resource_sim1ngktvyeenvvqetnqwysevcx5fyvl6hqe36y3rkhdfdn6uzvt5366ha:#12#,#900#,#181# <ACCOUNT_2_ADDRESS>
```

If everything worked correctly, you should see a success message along with the receipt of the transaction (which we will explain in more detail in another chapter).

### Showing Account Balance

Let’s verify the balance of the second account. You can query the state of an address with the `resim show <address>` command. Let’s try to run this command with the address of the second account:

``` bash
resim show <ACCOUNT_2_ADDRESS>
```

This will output the data present at that address. You should see, in the resources section, that this account has 1100 XRD which shows that the previous command worked perfectly.

You can use the show command with any address. Let’s try with the XRD resource address we used earlier:

``` bash
resim show resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3
`Example Output`
Resource Type: Fungible { divisibility: 18 }
Metadata: 4
├─ description: The Radix Public Network's native token, used to pay the network's required transaction fees and to secure the network through staking to its validator nodes.
├─ url: https://tokens.radixdlt.com
├─ symbol: XRD
└─ name: Radix
Total Supply: 1000000000000
```

You can see that it outputs useful information about the token: its name, description, maximum supply among other things.

### Inputting Arguments

The important thing to note if you are new to Scrypto is that Scrypto deals heavily with types, yet when operating with resim, the inputs are represented as strings which are then parsed behind the scenes. Therefore, there are certain types, particularly `Bucket` and `Proof` which need to be passed in specific ways.

With most argument inputs such as `addresses`, `Decimal`, `String`, etc. you will only need to input them plain and simply like so:

``` bash
resim show package_sim1p4r4955skdjq9swg8s5jguvcjvyj7tsxct87a9z6sw76cdfd2jg3zk
resim show account_sim1cyvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve475w0q
resim show component_sim1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxhkrefh
resim show resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3
```

### Deploying a Blueprint

Deploying a Blueprint will require `resim call-function` command. The basic argument inputs look like this:

``` bash
resim call-function <PACKAGE_ADDRESS> <BluePrintName> <ARGUMENT_1> <ARGUMENT_2>
```

:::note
The Blueprint name is case-sensitive.
:::


### Passing `Bucket` Arguments using `RESOURCE_SPECIFIER`

As mentioned, most inputs we need to pass as arguments are simply the value itself as string representation. However, there are special arguments that a function or a method may require. Notably these are buckets and proofs. For these we use a representation called the `resim RESOURCE_SPECIFIER`.

For example, a `GumballMachine` component may require you to pass a `Bucket` of XRD tokens to purchase the `gumball` resource. To pass a `Bucket` of fungible resource, the input will look like so: `<RESOURCE_ADDRESS>:<AMOUNT>` or `<RESOURCE_ADDRESS>:<NON_FUNGIBLE_LOCAL_ID>`. So, if we were to pass a `Bucket` of 1 XRD to buy 1 gumball, it would look like this:

``` bash
resim call-method <COMPONENT_ADDRESS> buy_gumball resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3:1
```

:::note
Currently, resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3 is the resim known ResourceAddress for XRD. You can refer to [Well-Known Addresses](../well-known-addresses.md) page to keep up to date.
:::


Non-fungible resources follow a similar format as fungible resources, but instead we must also pass its `NonFungibleLocalId`. The format of the string representation of non-fungible `RESOURCE_SPECIFIER` is:

``` bash
<RESOURCE_ADDRESS>:<NON_FUNGIBLE_LOCAL_ID>
```

Specifying additional non-fungible units will be separated by a comma like this:

``` bash
<RESOURCE_ADDRESS>:<NON_FUNGIBLE_LOCAL_ID_1>, <NON_FUNGIBLE_LOCAL_ID_2>, …​, <NON_FUNGIBLE_LOCAL_ID_N>
```

:::note
**>
Non-fungible ID format

**

When referencing non-fungible IDs, include their surrounding braces. e.g. an integer non-fungible ID might be `#23#` including the `#` `#`, or RUID non-fungible could have the ID `{ebf66729b1a12bf8-dd3dfcfda7021600-7dcb9a2540fe42c1-b1a094a879852b19}` including the `{` `}`. Without these resim commands will fail.
:::


As an example, say that `resource_sim1qqw9095s39kq2vxnzymaecvtpywpkughkcltw4pzd4pse7dvr0` is a non-fungible resource which has a non-fungible id type of `NonFungibleIdType::Integer`, if we wish to specify non-fungible tokens of this resource with the ids: 12, 900, 181, the string representation of the non-fungible resource specifier would be:

``` bash
resource_sim1qqw9095s39kq2vxnzymaecvtpywpkughkcltw4pzd4pse7dvr0:#12#,#900#,#181#
```

### Passing Proofs as Arguments

`resim` allows us to pass proofs in our argument inputs. To do so, we must attach a `--proofs` flag after we input our arguments with the proof(s) we may want to pass. As an example, let’s imagine a component with a permissioned method call `mint_admin_badge`, we can pass a `Proof`for it like so:

``` bash
resim call-method <COMPONENT_ADDRESS> mint_admin_badge 1 --proofs <RESOURCE_ADDRESS>:<AMOUNT>
```

We can also pass multiple proofs by separating each Proof with a comma.

``` bash
resim call-method <COMPONENT_ADDRESS> mint_admin_badge 1 --proofs <RESOURCE_ADDRESS>:<AMOUNT>, <RESOURCE_ADDRESS>:<AMOUNT>
```

If we need proofs of non-fungibles we put their non-fungible ID rather than the amount

``` bash
resim call-method <COMPONENT_ADDRESS> mint_admin_badge 1 --proofs <RESOURCE_ADDRESS>:<NON_FUNGIBLE_ID>, <RESOURCE_ADDRESS>:<NON_FUNGIBLE_ID>
```

### Other Input Types

`resim` only supports a handful of types. For other types such as `HashMap`, `Vector`, `Enum`, etc. you will need to write your own transaction manifest. Visit the specifications page to view examples of how you may pass other types with a transaction manifest.

### Outputting and Running Transaction Manifest Files

When we are running commands with `resim`, under the hood, `resim` is actually generating and submitting transaction manifest files for transactions. This is because every transaction on Radix contains a transaction manifest with a list of instruction intents. To output transaction manifest files, we will simply need to use the `--manifest` flag along with the path to which we want to save the transaction manifest file along with its name. To use the `GumballMachine` example previously, outputting a transaction manifest file via `resim` looks like this:

``` bash
resim call-method <COMPONENT_ADDRESS> buy_gumball resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3:1 --manifest <FILE_PATH> <FILE_NAME>.rtm
```

Once the transaction manifest appears in the directory of your choice you may open the .rtm file and customize the instructions you want to make in your transaction. When satisfied, you may want to submit the transaction manifest file instead of submitting instructions via resim. To do so we will need to use the resim run command which will look like so with its input requirements:

``` bash
resim run <FILE_PATH> <FILE_NAME>.rtm
```
