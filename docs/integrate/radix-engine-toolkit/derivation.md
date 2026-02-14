---
title: "Derivation"
---

# Derivation

This article is a usage guide for the derivation module of the Radix Engine Toolkit which contains a set of functions for deriving data from some other data. For example, this module has the logic required to derive virtual account addresses from public keys.

## Virtual Account Address From a Public Key

Deterministically maps a public key to its associated virtual account component address.

An account can be virtual or physical (see the "[Account Virtualization](../../build/native-blueprints/account.md#account-virtualization)" article). A virtual account is an account with no physical state on the ledger, just virtual state, and whose component address is derived from the public key associated with the private key controlling the account. A virtual account only becomes physical after the first transaction that interacts with the account.

### Function Name

|          |                                                   |
|:---------|:--------------------------------------------------|
| Language | Function Name                                     |
| C#       | `Address.VirtualAccountAddressFromPublicKey`      |
| Kotlin   | `Address.VirtualAccountAddressFromPublicKey`      |
| Python   | `Address.virtual_account_address_from_public_key` |
| Swift    | `Address.VirtualAccountAddressFromPublicKey`      |

### Arguments

- `PublicKey` - The public key to map to a virtual account component address. This can be either an Ed25519 or a Secp256k1 public key.

- `u8` - The ID of the network that the address will be used for. This is used for the Bech32m encoding of the address.

### Returns

- `Address` - The derived virtual account component address.

### Exceptions

Exceptions are thrown in the following cases:

- If the public key is invalid for its curve. As an example, a 33-byte long Ed25519 public key.

- If the network ID is not between 0×00 and 0xFF. This is only the case in languages that do not have an 8-bit unsigned integer type and thus such things can not be enforced at compile time.

### Examples



C#



``` csharp
using RadixEngineToolkit;

const byte networkId = 0x01;

var publicKeyBytes = Convert.FromHexString(
    "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf"
);
var publicKey = new PublicKey.Secp256k1(
    publicKeyBytes
);

var virtualAccountAddress = Address.VirtualAccountAddressFromPublicKey(
    publicKey,
    networkId
);
Console.WriteLine(virtualAccountAddress.AsStr());
```







Kotlin



``` kotlin
import com.radixdlt.ret.*

@OptIn(ExperimentalStdlibApi::class, ExperimentalUnsignedTypes::class)
fun main(args: Array<String>) {
    val networkId: UByte = 0x01u

    val publicKeyBytes = "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf".hexToUByteArray()
    val publicKey = PublicKey.Secp256k1(publicKeyBytes.toList())

    val virtualAccountAddress = Address.virtualAccountAddressFromPublicKey(publicKey, networkId);
    println(virtualAccountAddress.asStr())
}
```







Python



``` python
from radix_engine_toolkit import *

network_id: int = 0x01

public_key_bytes: bytearray = bytearray.fromhex(
    "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf"
)
public_key: PublicKey = PublicKey.SECP256K1(public_key_bytes)

virtual_account_address: Address = Address.virtual_account_address_from_public_key(
    public_key, network_id
)
print(virtual_account_address.as_str())
```







Swift



``` swift
import EngineToolkit
import Foundation

let networkId: UInt8 = 0x01

let publicKeyBytes = "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf"
    .hexToData()!;
let publicKey = PublicKey.secp256k1(value: Array(publicKeyBytes))

let virtualAccountAddress = try! Address.virtualAccountAddressFromPublicKey(
    publicKey: publicKey, 
    networkId: networkId
)
print(virtualAccountAddress.asStr())
```





## Virtual Identity Address From a Public Key

Deterministically maps a public key to its associated virtual identity component address.

### Function Name

|          |                                                    |
|:---------|:---------------------------------------------------|
| Language | Function Name                                      |
| C#       | `Address.VirtualIdentityAddressFromPublicKey`      |
| Kotlin   | `Address.VirtualIdentityAddressFromPublicKey`      |
| Python   | `Address.virtual_identity_address_from_public_key` |
| Swift    | `Address.VirtualIdentityAddressFromPublicKey`      |

### Arguments

- `PublicKey` - The public key to map to a virtual identity component address. This can be either an Ed25519 or a Secp256k1 public key.

- `u8` - The ID of the network that the address will be used for. This is used for the Bech32m encoding of the address.

### Returns

- `Address` - The derived virtual identity component address.

### Exceptions

Exceptions are thrown in the following cases:

- If the public key is invalid for its curve. As an example, a 33-byte long Ed25519 public key.

- If the network ID is not between 0×00 and 0xFF. This is only the case in languages that do not have an 8-bit unsigned integer type and thus such things can not be enforced at compile time.

### Examples



C#



``` csharp
using RadixEngineToolkit;

const byte networkId = 0x01;

var publicKeyBytes = Convert.FromHexString(
    "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf"
);
var publicKey = new PublicKey.Secp256k1(
    publicKeyBytes
);

var virtualIdentityAddress = Address.VirtualIdentityAddressFromPublicKey(
    publicKey,
    networkId
);
Console.WriteLine(virtualIdentityAddress.AsStr());
```







Kotlin



``` kotlin
import com.radixdlt.ret.*

@OptIn(ExperimentalStdlibApi::class, ExperimentalUnsignedTypes::class)
fun main(args: Array<String>) {
    val networkId: UByte = 0x01u

    val publicKeyBytes = "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf".hexToUByteArray()
    val publicKey = PublicKey.Secp256k1(publicKeyBytes.toList())

    val virtualIdentityAddress = Address.virtualIdentityAddressFromPublicKey(publicKey, networkId);
    println(virtualIdentityAddress.asStr())
}
```







Python



``` python
from radix_engine_toolkit import *

network_id: int = 0x01

public_key_bytes: bytearray = bytearray.fromhex(
    "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf"
)
public_key: PublicKey = PublicKey.SECP256K1(public_key_bytes)

virtual_identity_address: Address = Address.virtual_identity_address_from_public_key(
    public_key, network_id
)
print(virtual_identity_address.as_str())
```







Swift



``` swift
import EngineToolkit
import Foundation

let networkId: UInt8 = 0x01

let publicKeyBytes = "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf"
    .hexToData()!;
let publicKey = PublicKey.secp256k1(value: Array(publicKeyBytes))

let virtualIdentityAddress = try! Address.virtualIdentityAddressFromPublicKey(
    publicKey: publicKey, 
    networkId: networkId
)
print(virtualIdentityAddress.asStr())
```





## Virtual Account Address From an Olympia Account Address

Deterministically maps an Olympia account address to a Babylon virtual account component address.

### Function Name

|          |                                                        |
|:---------|:-------------------------------------------------------|
| Language | Function Name                                          |
| C#       | `Address.VirtualAccountAddressFromOlympiaAddress`      |
| Kotlin   | `Address.VirtualAccountAddressFromOlympiaAddress`      |
| Python   | `Address.virtual_account_address_from_olympia_address` |
| Swift    | `Address.VirtualAccountAddressFromOlympiaAddress`      |

### Arguments

- `OlympiaAddress` - The Olympia account address to map to a Babylon virtual account component address.

- `u8` - The ID of the network that the address will be used for. This is used for the Bech32m encoding of the address.

### Returns

- `Address` - The derived virtual account component address.

### Exceptions

Exceptions are thrown in the following cases:

- If the Olympia account address is invalid.

- If the network ID is not between 0×00 and 0xFF. This is only the case in languages that do not have an 8-bit unsigned integer type and thus such things can not be enforced at compile time.

### Examples



C#



``` csharp
using RadixEngineToolkit;

const byte networkId = 0x01;

var olympiaAccountAddress = new OlympiaAddress(
    "rdx1qsp4s9twd636k3c89q36wg5n9d4z940cgf36dfjja4zj7sttjqvhlncsmfwxe"
);
var virtualAccountAddress = Address.VirtualAccountAddressFromOlympiaAddress(
    olympiaAccountAddress,
    networkId
);
Console.WriteLine(virtualAccountAddress.AsStr());
```







Kotlin



``` kotlin
import com.radixdlt.ret.*

fun main(args: Array<String>) {
    val networkId: UByte = 0x01u

    val olympiaAccountAddress = OlympiaAddress("rdx1qsp4s9twd636k3c89q36wg5n9d4z940cgf36dfjja4zj7sttjqvhlncsmfwxe");
    val virtualAccountAddress = Address.virtualAccountAddressFromOlympiaAddress(olympiaAccountAddress, networkId);
    println(virtualAccountAddress.asStr())
}
```







Python



``` python
from radix_engine_toolkit import *

network_id: int = 0x01

olympia_account_address: OlympiaAddress = OlympiaAddress(
    "rdx1qsp4s9twd636k3c89q36wg5n9d4z940cgf36dfjja4zj7sttjqvhlncsmfwxe"
)
virtual_account_address: Address = Address.virtual_account_address_from_olympia_address(
    olympia_account_address, network_id
)
print(virtual_account_address.as_str())
```







Swift



``` swift
import EngineToolkit
import Foundation

let networkId: UInt8 = 0x01

let olympiaAccountAddress = OlympiaAddress(
    address: "rdx1qsp4s9twd636k3c89q36wg5n9d4z940cgf36dfjja4zj7sttjqvhlncsmfwxe"
);
let virtualIdentityAddress = try! Address.virtualAccountAddressFromOlympiaAddress(
    olympiaAccountAddress: olympiaAccountAddress, 
    networkId: networkId
);
print(virtualIdentityAddress.asStr())
```





## Resource Address from an Olympia Resource Identifier

Deterministically maps an Olympia resource address to a Babylon resource address.

### Function Name

|          |                                                          |
|:---------|:---------------------------------------------------------|
| Language | Function Name                                            |
| C#       | `Address.ResourceAddressFromOlympiaResourceAddress`      |
| Kotlin   | `Address.ResourceAddressFromOlympiaResourceAddress`      |
| Python   | `Address.resource_address_from_olympia_resource_address` |
| Swift    | `Address.ResourceAddressFromOlympiaResourceAddress`      |

### Arguments

- `OlympiaAddress` - The Olympia resource address to map to a Babylon resource address.

- `u8` - The ID of the network that the address will be used for. This is used for the Bech32m encoding of the address.

### Returns

- `Address` - The derived resource address.

### Exceptions

Exceptions are thrown in the following cases:

- If the Olympia resource address is invalid.

- If the network ID is not between 0×00 and 0xFF. This is only the case in languages that do not have an 8-bit unsigned integer type and thus such things can not be enforced at compile time.

### Examples



C#



``` csharp
using RadixEngineToolkit;

const byte networkId = 0x01;

var olympiaResourceAddress = new OlympiaAddress(
    "xrd_rr1qy5wfsfh"
);
var resourceAddress = Address.ResourceAddressFromOlympiaResourceAddress(
    olympiaResourceAddress,
    networkId
);
Console.WriteLine(resourceAddress.AsStr());
```







Kotlin



``` kotlin
import com.radixdlt.ret.*

fun main(args: Array<String>) {
    val networkId: UByte = 0x01u

    val olympiaResourceAddress = OlympiaAddress("xrd_rr1qy5wfsfh");
    val resourceAddress = Address.resourceAddressFromOlympiaResourceAddress(olympiaResourceAddress, networkId);
    println(resourceAddress.asStr())
}
```







Python



``` python
from radix_engine_toolkit import *

network_id: int = 0x01

olympia_resource_address: OlympiaAddress = OlympiaAddress("xrd_rr1qy5wfsfh")
resource_address: Address = Address.resource_address_from_olympia_resource_address(
    olympia_resource_address, network_id
)
print(resource_address.as_str())
```







Swift



``` swift
import EngineToolkit
import Foundation

let networkId: UInt8 = 0x01

let olympiaResourceAddress = OlympiaAddress(
    address: "xrd_rr1qy5wfsfh"
);
let virtualIdentityAddress = try! Address.resourceAddressFromOlympiaResourceAddress(
    olympiaResourceAddress: olympiaResourceAddress, 
    networkId: networkId
);
print(virtualIdentityAddress.asStr())
```





## Public Key from an Olympia Account Address

Derives the public key associated with an Olympia account address.

### Function Name

|          |                                                          |
|:---------|:---------------------------------------------------------|
| Language | Function Name                                            |
| C#       | `Address.DerivePublicKeyFromOlympiaAccountAddress`       |
| Kotlin   | `Address.DerivePublicKeyFromOlympiaAccountAddress`       |
| Python   | `Address.derive_public_key_from_olympia_account_address` |
| Swift    | `Address.DerivePublicKeyFromOlympiaAccountAddress`       |

### Arguments

- `OlympiaAddress` - The Olympia address to derive the public key from.

### Returns

- `PublicKey` - The derived public key. This will always be a Secp256k1 public key as this is the only curve that was supported in Olympia.

### Exceptions

Exceptions are thrown in the following cases:

- If the Olympia resource address is invalid.

### Examples



C#



``` csharp
using RadixEngineToolkit;
using static RadixEngineToolkit.RadixEngineToolkitUniffiMethods;

var olympiaAccountAddress = new OlympiaAddress(
    "rdx1qsp4s9twd636k3c89q36wg5n9d4z940cgf36dfjja4zj7sttjqvhlncsmfwxe"
);
var publicKey = DerivePublicKeyFromOlympiaAccountAddress(
    olympiaAccountAddress
);
```







Kotlin



``` kotlin
import com.radixdlt.ret.*

fun main(args: Array<String>) {
    val olympiaAccountAddress = OlympiaAddress("rdx1qsp4s9twd636k3c89q36wg5n9d4z940cgf36dfjja4zj7sttjqvhlncsmfwxe");
    val publicKey = derivePublicKeyFromOlympiaAccountAddress(olympiaAccountAddress)
}
```







Python



``` python
from radix_engine_toolkit import *

olympia_account_address: OlympiaAddress = OlympiaAddress(
    "rdx1qsp4s9twd636k3c89q36wg5n9d4z940cgf36dfjja4zj7sttjqvhlncsmfwxe"
)
public_key: PublicKey = derive_public_key_from_olympia_account_address(
    olympia_account_address
)
```







Swift



``` swift
import EngineToolkit
import Foundation

let olympiaAccountAddress = OlympiaAddress(
    address: "rdx1qsp4s9twd636k3c89q36wg5n9d4z940cgf36dfjja4zj7sttjqvhlncsmfwxe"
);
let publicKey = try! derivePublicKeyFromOlympiaAccountAddress(
    olympiaResourceAddress: olympiaAccountAddress
)
```





## Olympia Account Address from a Public Key

Derives an Olympia account address from a Secp256k1 public key.

### Function Name

|          |                                                          |
|:---------|:---------------------------------------------------------|
| Language | Function Name                                            |
| C#       | `Address.DeriveOlympiaAccountAddressFromPublicKey`       |
| Kotlin   | `Address.DeriveOlympiaAccountAddressFromPublicKey`       |
| Python   | `Address.derive_olympia_account_address_from_public_key` |
| Swift    | `Address.DeriveOlympiaAccountAddressFromPublicKey`       |

### Arguments

- `PublicKey` - The public key to map to an Olympia account address.

- `OlympiaNetwork` - The network that the Olympia account address is to be used for. This will be used for the Bech32 encoding of the Olympia address.

### Returns

- `OlympiaAddress` - The derived Olympia account address.

### Exceptions

Exceptions are thrown in the following cases:

- If the public key is not a valid Secp256k1 public key.

### Examples



C#



``` csharp
using RadixEngineToolkit;
using static RadixEngineToolkit.RadixEngineToolkitUniffiMethods;

var publicKeyBytes = Convert.FromHexString(
    "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf"
);
var publicKey = new PublicKey.Secp256k1(
    publicKeyBytes
);

var olympiaAccountAddress = DeriveOlympiaAccountAddressFromPublicKey(
    publicKey,
    OlympiaNetwork.MAINNET
);
Console.WriteLine(
    olympiaAccountAddress.AsStr()
);
```







Kotlin



``` kotlin
import com.radixdlt.ret.*

@OptIn(ExperimentalStdlibApi::class, ExperimentalUnsignedTypes::class)
fun main(args: Array<String>) {
    val publicKeyBytes = "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf".hexToUByteArray()
    val publicKey = PublicKey.Secp256k1(publicKeyBytes.toList())

    val olympiaAccountAddress = deriveOlympiaAccountAddressFromPublicKey(publicKey, OlympiaNetwork.MAINNET)
    println(olympiaAccountAddress.asStr())
}
```







Python



``` python
from radix_engine_toolkit import *

public_key_bytes: bytearray = bytearray.fromhex(
    "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf"
)
public_key: PublicKey = PublicKey.SECP256K1(public_key_bytes)

olympia_account_address: OlympiaAddress = (
    derive_olympia_account_address_from_public_key(public_key, OlympiaNetwork.MAINNET)
)
print(olympia_account_address.as_str())
```







Swift



``` swift
import EngineToolkit
import Foundation

let publicKeyBytes = "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf"
    .hexToData()!;
let publicKey = PublicKey.secp256k1(value: Array(publicKeyBytes))

let olympiaAccountAddress = try! deriveOlympiaAccountAddressFromPublicKey(publicKey: publicKey, olympiaNetwork: OlympiaNetwork.mainnet)

print(olympiaAccountAddress.asStr())
```





## Virtual Signature Badge Non-fungible Global ID from Public Key

Derives the non-fungible global ID of the virtual signature badge associated with a given public key.

### Function Name

|          |                                   |
|:---------|:----------------------------------|
| Language | Function Name                     |
| C#       | `Address.VirtualSignatureBadge`   |
| Kotlin   | `Address.VirtualSignatureBadge`   |
| Python   | `Address.virtual_signature_badge` |
| Swift    | `Address.VirtualSignatureBadge`   |

### Arguments

- `PublicKey` - The public key to calculate the non-fungible global ID of the virtual signature badge for.

- `u8` - The ID of the network that the address will be used for. This is used for the Bech32m encoding of the address.

### Returns

- `NonFungibleGlobalId` - The non-fungible global ID of the virtual signature badge of the passed public key.

### Exceptions

Exceptions are thrown in the following cases:

- If the public key is invalid for its curve. As an example, a 33-byte long Ed25519 public key.

- If the network ID is not between 0×00 and 0xFF. This is only the case in languages that do not have an 8-bit unsigned integer type and thus such things can not be enforced at compile time.

### Examples



C#



``` csharp
using RadixEngineToolkit;

const byte networkId = 0x01;

var publicKeyBytes = Convert.FromHexString(
    "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf"
);
var publicKey = new PublicKey.Secp256k1(
    publicKeyBytes
);

var virtualSignatureNonFungibleGlobalId = NonFungibleGlobalId.VirtualSignatureBadge(
    publicKey,
    networkId
);
Console.WriteLine(
    virtualSignatureNonFungibleGlobalId.AsStr()
);
```







Kotlin



``` kotlin
import com.radixdlt.ret.*

@OptIn(ExperimentalStdlibApi::class, ExperimentalUnsignedTypes::class)
fun main(args: Array<String>) {
    val networkId: UByte = 0x01u

    val publicKeyBytes = "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf".hexToUByteArray()
    val publicKey = PublicKey.Secp256k1(publicKeyBytes.toList())

    val virtualSignatureNonFungibleGlobalId = NonFungibleGlobalId.virtualSignatureBadge(publicKey, networkId);
    println(virtualSignatureNonFungibleGlobalId.asStr())
}
```







Python



``` python
from radix_engine_toolkit import *

network_id: int = 0x01

public_key_bytes: bytearray = bytearray.fromhex(
    "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf"
)
public_key: PublicKey = PublicKey.SECP256K1(public_key_bytes)

virtual_signature_non_fungible_global_id: NonFungibleGlobalId = (
    NonFungibleGlobalId.virtual_signature_badge(public_key, network_id)
)
print(virtual_signature_non_fungible_global_id.as_str())
```







Swift



``` swift
import EngineToolkit
import Foundation

let networkId: UInt8 = 0x01

let publicKeyBytes = "0358156e6ea3ab47072823a722932b6a22d5f84263a6a652ed452f416b90197fcf"
    .hexToData()!;
let publicKey = PublicKey.secp256k1(value: Array(publicKeyBytes))

let virtualSignatureNonFungibleGlobalId = try! NonFungibleGlobalId.virtualSignatureBadge(publicKey: publicKey, networkId: networkId)

print(virtualSignatureNonFungibleGlobalId.asStr())
```




