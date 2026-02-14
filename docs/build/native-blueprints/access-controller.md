---
title: "Access Controller"
---

# Access Controller

The crypto wallet experience today is unacceptable for all but those who have the crypto enthusiast’s combination of technical savvy and risk tolerance. Particularly for DeFi wallets like Metamask, holding assets there and interacting with dApps is fraught with the risk of losing access to accounts or having funds stolen if the user lacks a high degree of op-sec sophistication.

The source of the problem is that full control of an account, and the tokens it holds, is provided by a single private key. Maintaining control of this private key requires too much sophistication for the average user and multi-signature mechanisms that might help the problem must be implemented as separate smart contracts that are complex and difficult to use.

The access controller blueprint is a native blueprint designed to solve the above-mentioned problems. An access controller holds badges and defines role-based logic around the roles that can create proofs out of the badge and the roles needed to perform multi-factor recovery. More concretely an access controller does the following:

- Holds one or more badges of the same resource address in its vault.

- Permits specific roles to create proofs out of the badge(s) such that they can have the privileges afforded to this badge.

- Defines the multi-factor recovery logic that allows for the role definitions to be changed and swapped with new definitions.

The access controller blueprint defines three roles: Primary (P), Recovery (R), and Confirmation (C). Each of these roles plays a different role in the access controller. As an example, the Primary (P) role is the only role that can create proofs out of the badge stored in the access controller, the Primary (P) and Recovery (R) roles are the only roles that can initiate recovery or badge withdrawal, and so on.

If one or more of the roles on the access controller is compromised the recovery procedure can be used to change the role definitions to new roles. The recovery procedure requires either:

- The Primary (P) or Recovery (R) roles initiate recovery and then any of the three roles can confirm recovery given that the role that confirms the recovery is not the same as the role that initiated the recovery.

- If an access controller component allows for timed recovery, then recoveries initiated by the Recovery (R) role can be confirmed by anybody after the timed recovery delay has passed, this delay can be enabled or disabled and configured when instantiating a new access controller component and when performing recovery.

## Roles

The access controller blueprint defines three roles: Primary (P), Recovery (R), and Confirmation (C) and each one of those roles has unique powers and responsibilities. The following is a table of all of the access controller operations and the roles that can perform them:



|  |  |
|:---|:---|
| Action | Required Role |
| Creation of a proof of the held badge | Primary (P) role |
| Initiation of the recovery process | Primary (P) role **OR** Recovery (R) role |
| Confirming an existing recovery proposal | Any role that isn’t the proposer |
| Confirming an existing timed recovery | Anybody |
| Canceling an existing recovery proposal | The proposer |
| Initiation of the badge withdrawal process | Primary (P) role **OR** Recovery (R) role |
| Confirming an existing badge withdrawal attempt | Any role that isn’t the proposer |
| Canceling an existing badge withdrawal attempt | The proposer |
| Locking and Unlocking of the Primary Role | Recovery (R) role |
| Stopping Timed Recovery | Primary (P) role **OR** Recovery (R) role **OR** Confirmation (C) role |



From this point onward, this document will refer to the Primary (P) role **OR** Recovery (R) role as the **Proposer Roles** as they are the only roles allowed to propose recovery or badge withdrawal. Primary (P) role, Recovery (R) role, and Confirmation (C) role will be referred to as **Roles**.

The Roles are all defined through Scrypto’s powerful`AccessRule`s system. This means that any role can be arbitrarily complex. They do not necessarily need to be a single fungible or non-fungible badge or a single signature. Any`AccessRule`(within certain limits) can be used for any of the three Roles.

The primary role is given the privilege to create proofs from the protected badge that the access controller holds. When the access controller’s`create_proof`method is called from the manifest, it returns a Proof which is put in the auth zone. The recovery role can lock the primary role taking away its privilege to create proofs of the protected badge, but not taking away any other privileges. Similarly, the recovery role can unlock the primary role giving it back the privilege to create proofs from the protected badge.

## Recovery

Recovery is the process where some of the existing Roles propose and agree on new Roles to use for the access controller. Recovery is proposed by one of the Proposer Roles. Then, it may either be confirmed by one of the Roles that is not the proposer or after the timed recovery delay passes (if it’s defined for the access controller component). After a recovery proposal is submitted and confirmed the old Roles lose their powers and the new Roles take their place. All methods involved in the access controller recovery require that the recovery proposal is passed in again, this is done so that parties are explicit about what recovery role they are confirming.

The following is a more complete description of the recovery process and the two steps that it has:

- **The initiation of recovery:** one of the Proposer Roles submits a recovery proposal to the access controller component consisting of the`AccessRule`s they propose for each three of the Roles and of the new timed recovery delay they are proposing. Only the Primary (P) and Recovery (R) roles can initiate recovery.

- **The confirmation of recovery:** after a recovery proposal is submitted by a Proposer Role it is not enacted immediately; it needs to be confirmed. Recovery proposals may be confirmed in one of two ways:

  - **Quick recovery confirmation:** this requires 2-of-3 of the roles to agree on a proposal before the access controller enacts the proposal and changes the role definitions and the timed recovery delay. As an example, if the primary role was the role that initiated the recovery process, then the recovery or confirmation roles could confirm the recovery proposal proposed by the primary role. Likewise, if the recovery role initiates the recovery process, the primary and confirmation roles can confirm it’s proposal. The confirmation role can not initiate the recovery process.

  - **Timed recovery confirmation:** This allows for recovery proposals submitted by the recovery role to be confirmed by anybody after some delay has passed. Once the delay has elapsed, anybody can call the access controller component to confirm this proposal.

Access controller components can be configured to allow or disallow timed recovery. Disallowing timed recovery means that recovery proposals submitted by the recovery roles may not be confirmed by anybody after some delay. On the other hand, with timed recovery enabled, recovery proposals submitted by the recovery role may be confirmed by anybody after the delay has passed. The access controller can be configured to allow or disallow timed recovery using the`timed_recovery_delay_in_minutes`seen in the access controller’s`create`function and other methods. Setting it to`None`disables timed recovery and setting it to`Some(u32)`enables it.

The access controller allows each of the Proposer Roles to have an ongoing recovery that is separate from one another. As an example, the Primary (P) role can initiate recovery and propose one set of roles, and the Recovery (R) role can initiate recovery and propose a different set of roles without overriding the recovery proposal submitted by the Primary (P) role. Both of the proposals co-exist. In a case like the one mentioned in this example, the confirmation role could examine which of the Primary (P) and Recovery (R) role’s proposals appear correct and confirm that particular proposal. Alternatively, if the access controller is configured to allow for timed confirmation, then anybody can confirm the recovery proposal of the Recovery (R) role after the timed recovery delay has elapsed. In summary, at any point in time, the access controller may have a minimum of zero ongoing recoveries and a maximum of two ongoing recoveries (one recovery for each of the Proposer Roles). If there is a currently active timed recovery any of the three roles could choose to stop the timed recovery. Stopping timed recovery only removes the time element from the recovery proposal making it unfit to be confirmed after the delay has passed. However, the proposal remains a valid proposal and the other two roles can confirm it and it can be enacted.

Upon the confirmation of a recovery proposal, the proposed role definitions and new timed recovery delay are enacted. Additionally, the access controller goes back to its default state for everything: the primary role is unlocked, all ongoing recoveries are cleared and all ongoing withdrawal attempts are cleared.

## Withdrawing The Protected Badge

This is the process where some of the existing Roles propose and agree to withdraw the badge protected by the access controller; abandoning the access controller and leaving it in a locked state. This works in a very similar way to the Recovery process with the exception that this does not allow for a timed element to badge withdraws, only quick confirmations can advance the withdrawal proposal.

The following is a more complete description of the recovery process and the two steps that it has:

- **The initiation of badge withdrawal:** one of the Proposer Roles submits a badge withdrawal request. Only the Primary (P) and Recovery (R) roles can submit this request.

- **The confirmation of badge withdrawal:** this requires that 2-of-3 of the roles agree on the badge withdrawal request for the badge to be withdrawn and returned.

Once the badge withdrawal process is confirmed, the badge held by the access controller is returned and the access controller enters lockdown mode where all of its`AcessRule`s are set to`DenyAll`and the access controller component becomes completely abandoned.

The access controller component allows each of the proposer roles to have an ongoing badge withdrawal attempt that is separate from one another.

## Hierarchical State Machine

The following is a Hierarchical State Machine (HSM) that describes the entire logic of access controller components







## Recovery Badges

When an access controller is instantiated a recovery badge non-fungible resource is created. The purpose of this is to be used by the wallet and other clients who wish to utilize it as the recovery badge of the access controller. The choice of whether to use this resource or not is up to the creator of the access controller, using this badge has the added advantage of it being identifiable in the wallet as a recovery badge. This Access Controller’s recovery badge feature allows account owners to easily use badges in the role configuration that have a system-guaranteed link to the Access Controller via metadata, as well as a stable resource address for badges created for use with this Access Controller.

Any of the Roles are allowed to mint recovery badges through the mint_recovery_badges method on the access controller. It is the responsibility of the caller to pick the non-fungible local IDs of the badges that they want, the access controller does not pick them on behalf of the caller. However, the engine will check for collisions. If there is a collision, the transaction fails.

The following is the complete permission list for the recovery resource that the access controller creates during initialization.



|  |  |  |
|:---|:---|:---|
| **Action** | **Rule** | **Mutability** |
| `mint` | Access Controller’s Virtual Component Badge | `DenyAll` |
| `burn` | `AllowAll` | `DenyAll` |
| `withdraw` | `DenyAll` | `DenyAll` |
| `deposit` | `AllowAll` | `DenyAll` |
| `update_metadata` | `DenyAll` | `DenyAll` |
| `update_non_fungible_data` | `DenyAll` | `DenyAll` |



The following is the metadata that the recovery badge has:



|  |  |  |
|:---|:---|:---|
| **Key** | **Value Type** | **Value** |
| `access_controller` | `GlobalAddress` | Address of the access controller that it belongs to |
| `name` | `String` | Recovery Badge |
| `icon_url` | `URL` | <a href="https://assets.radixdlt.com/icons/icon-recovery_badge.png">https://assets.radixdlt.com/icons/icon-recovery_badge.png</a> |



The access controller has a recovery_badge metadata entry which links back to the resource address of the recovery badge.

Some notes on the configuration of the recovery badge:

- The access controller recovery badges are freely burnable, the bearer of a badge may get rid of them if their recovery powers are removed at some point.

- A recovery badge is not withdrawable, once it’s been deposited into a vault it may not be withdrawn out of that vault, the only possibility is burning it.

- The metadata of the recovery badge and the access controller that it belongs to both point to one another. The`access_controller`field of the recovery badge metadata contains the component address of the access controller and the`recovery_badge`field of the access controller contains the resource address of the recovery badge.

## Flows

### Creation of an Access Controller

Say we wish to create an access controller component to protect a badge that controls an account. At a high level, say that we would like for timed recovery to be possible by the recovery role and for it to take 1 day and that we would like to Roles to be defined as follows:



|  |  |
|:---|:---|
| **Role** | **Rule** |
| **Primary (P) Role** | a signature from a key pair that my wallet controls |
| **Recovery (R) Role** | a signature from a key pair that my YubiKey controls |
| **Confirmation (C) Role** | a fungible badge owned by my friend Bob. |



The fact that the Primary (P) and Recovery (R) roles are using a virtual signature badge and not a resource badge is just an example and is not a requirement by the access controller. The access controller can take full advantage of our powerful and versatile access rules system.

We can be more specific about the above high-level intent and translate it down to something closer to implementation. Say that we would like our rule set to be something like the following:



|  |  |
|:---|:---|
| **Role** | **Rule** |
| **Primary Role** | A signature from the Ecdsa Secp256k1 key pair controlled by the wallet whose public key is`0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798` |
| **Recovery Role** | A signature from the EdDSA Ed25519 key pair controlled by the YubiKey whose public key is`4cb5abf6ad79fbf5abbccafcc269d85cd2651ed4b885b5869f241aedf0a5ba29` |
| **Confirmation Role** | A fungible badge owned by my friend Bob whose resource address is`resource_sim1t5hpqpl8lvyp669wdth8l66nv6uxpa34rk4pmsynhydk89jp0fw2lv` |



The following is a transaction manifest of the flow described above:

``` rust
// Minting the resource that controls the account. This is just an example.
MINT_FUNGIBLE
    Address("\${account_badge}")
    Decimal("1");
TAKE_FROM_WORKTOP
    Address("\${account_badge}")
    Bucket("bucket1");

// Creating the access controller component
CREATE_ACCESS_CONTROLLER
    Bucket("bucket1") // Badge to protect
    Tuple(
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1nfxxxxxxxxxxsecpsgxxxxxxxxx004638826440xxxxxxxxxwj8qq5:[b6e84499b83b0797ef5235553eeb7edaa0cea243c1128c2fe737]"))))), // The primary role
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1nfxxxxxxxxxxed25sgxxxxxxxxx002236757237xxxxxxxxx8x44q5:[9f58abcbc2ebd2da349acb10773ffbc37b6af91fa8df2486c9ea]"))))), // The recovery role
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<1u8>(Address("resource_sim1t5hpqpl8lvyp669wdth8l66nv6uxpa34rk4pmsynhydk89jp0fw2lv"))))) // The confirmation role
    ) // Rule set
    Enum<1u8>(1440u32); // Timed recovery delay in minutes
```

Here are some reflections on the manifest provided above:

- Notice that the manifest mints a new`\${account_badge}`and then use it as the badge protected by the access controller. This is just an example, these couple of instructions should be replaced by the actual logic that gets the actual badge you wish to be protected by the access controller into the worktop and then into a bucket.

- Notice that`0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798`, the Ecdsa Secp256k1 public key associated with the key pair controlled by the wallet does not appear anywhere in the manifest in its raw form. It appears as`NonFungibleGlobalId("resource_sim1qgqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq056vhf:[b6e84499b83b0797ef5235553eeb7edaa0cea243c1128c2fe737]")`which is the Non-fungible global ID of the Ecdsa Secp256k1 virtual signature badge associated with the public key.

- Notice that`4cb5abf6ad79fbf5abbccafcc269d85cd2651ed4b885b5869f241aedf0a5ba29`, the EdDSA Ed25519 public key associated with the key pair controlled by the YubiKey does not appear anywhere in the manifest in its raw form. It appears as`NonFungibleGlobalId("resource_sim1qgqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs64j5z6:[9f58abcbc2ebd2da349acb10773ffbc37b6af91fa8df2486c9ea]")`which is the Non-fungible global ID of the EdDSA Ed25519 virtual signature badge associated with the public key.

- The derivation of the non-fungible global ID of the virtual signature badge is a relatively simple process that only requires the ability to hash data using Blake2b and the knowledge of the resource addresses associated with the Ecdsa Secp256k1 and EdDSA Ed25519 curves virtual resources. Nonetheless, the Radix Engine Toolkit provides this derivation.

- In this example, we wanted the access controller to allow for timed recovery and for the timed recovery delay period to be one day. The delay period is provided in minutes as the`Enum<1u8>(1440u32)`argument.

### Performing Recovery

If one of the roles of the access controller is compromised or that some of the roles would like to update the role definition of the access controller recovery can be performed. The recovery process is made up of two steps:

1.  Initiation

2.  Confirmation: which can either be

    1.  Quick Confirmation

    2.  Timed Confirmation

In this section, there are three flows:

1.  A flow that shows how the recovery process can be initiated by the recovery role.

2.  A flow that shows how the confirmation role can confirm the recovery proposal made by the recovery role.

3.  A flow that shows how the recovery role can perform a timed confirmation of their proposal after the timed delay has passed.

#### Initiating Recovery

The primary and recovery roles can initiate recovery on the access controller which means that they can submit a proposal to the access controller with the rules that they wish for the access controller to transition to if the recovery proposal is accepted.

In this flow, the recovery role wishes to propose that the access controller transitions to the following set of rules:



|  |  |
|:---|:---|
| **Rule** | **Setting** |
| **Primary Role** | A signature from the Ecdsa Secp256k1 key pair controlled by a new wallet whose public key is`02f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9` |
| **Recovery Role** | A signature from the EdDSA Ed25519 key pair controlled by a new YubiKey whose public key is`f381626e41e7027ea431bfe3009e94bdd25a746beec468948d6c3c7c5dc9a54b` |
| **Confirmation Role** | A signature from the EdDSA Ed25519 key pair controlled by another YubiKey whose public key is`fd50b8e3b144ea244fbf7737f550bc8dd0c2650bbc1aada833ca17ff8dbf329b` |
| **Timed Recovery Delay** | Enabled - 7 days (10080 minutes) delay |



While the recovery role in this example is the role proposing the rule change, it does not always have to be the recovery role. It can also be the primary role.

The flow for this would be as follows:

- Obtain the badges and/or signatures that make up the recovery role - if we’re continuing from the previous example where we instantiated the access controller then the recovery role would require a signature from an EdDSA Ed25519 key pair whose public key is4cb5abf6ad79fbf5abbccafcc269d85cd2651ed4b885b5869f241aedf0a5ba29.

- Call the`initiate_recovery_as_recovery`method to initiate the recovery process and submit a recovery proposal as the recovery role specifying the proposed new rule set. Had the primary role been the one initiating recovery, they would have called the`initiate_recovery_as_primary`method.

The following is a transaction manifest of the above-described flow:

``` rust
CALL_METHOD
    Address("\${access_controller_component}")
    "initiate_recovery_as_recovery"
    Tuple(
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1nfxxxxxxxxxxsecpsgxxxxxxxxx004638826440xxxxxxxxxwj8qq5:[1c99dfb4448f92a28be31b541cfed52f1b61734e4aefc18914f8]"))))), // The primary role
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1nfxxxxxxxxxxed25sgxxxxxxxxx002236757237xxxxxxxxx8x44q5:[a5ca01ea8e0e59b1c8abdb520edfb19a24571b5a747498cad627]"))))), // The recovery role
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1nfxxxxxxxxxxed25sgxxxxxxxxx002236757237xxxxxxxxx8x44q5:[54fc86e5651ed504d4636e702fa39fbe7fa24d9dbe57212ab073]")))))  // The confirmation role
    ) // The proposed access rules
    Enum<1u8>(10080u32); // The timed recovery delay being proposed.
```

Here are some reflections on the above manifest:

- In much of a similar way to the manifest seen in the “Creation of an Access Controller” section, the public keys used for the access rules do not appear in their raw form. Instead, the non-fungible global ID of the virtual signature badge associated with the public key is what’s seen in the manifest.

- The timed recovery delay is provided as an`Enum<1u8>(10080u32)`. The values seen there mean the following:

  - The`1u8`means that this is the`Some`variant of the`Option`enum. Meaning that the recovery role proposes the access controller should have a timed recovery delay.

  - The`10080u32`is the timed recovery delay specified in minutes.`10080`minutes translates to 7 days.

#### Quick Confirm Recovery

After the recovery role initiated recovery in the flow seen in the “Initiating Recovery” section, we would now like to confirm the recovery proposal through the confirmation role. While this example will show how the confirmation role can confirm a recovery proposal, any role can confirm a proposal that they have not submitted.

The confirmation role wishes to confirm the proposal made by the recovery role and it knows the set of rules that the recovery role proposed. It will need to state that set of rules when performing the confirmation. \]

The flow for this would be as follows:

- Obtain the badges and/or signatures that make up the confirmation role - if we’re continuing from the previous example where we instantiated the access controller then the confirmation role would require a proof of the resource address`resource_sim1t5hpqpl8lvyp669wdth8l66nv6uxpa34rk4pmsynhydk89jp0fw2lv`be present in the auth zone of the caller.

- Call the`quick_confirm_recovery_role_recovery_proposal`method on the access controller. If the primary role were the role that initiated the recovery process then we would instead call thequick_confirm_primary_role_recovery_proposalmethod.

  - Calling the quick confirm method requires the caller to have knowledge of the rules that they’re confirming and to specify them again.

  - If the rules specified as arguments are not the proposed rules then the access controller panics.

The following is a transaction manifest of the above-described flow:

``` rust
CALL_METHOD
    Address("\${access_controller_component}")
    "quick_confirm_recovery_role_recovery_proposal"
    Tuple(
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1nfxxxxxxxxxxsecpsgxxxxxxxxx004638826440xxxxxxxxxwj8qq5:[1c99dfb4448f92a28be31b541cfed52f1b61734e4aefc18914f8]"))))), // The primary role
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1nfxxxxxxxxxxed25sgxxxxxxxxx002236757237xxxxxxxxx8x44q5:[a5ca01ea8e0e59b1c8abdb520edfb19a24571b5a747498cad627]"))))), // The recovery role
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1nfxxxxxxxxxxed25sgxxxxxxxxx002236757237xxxxxxxxx8x44q5:[54fc86e5651ed504d4636e702fa39fbe7fa24d9dbe57212ab073]")))))  // The confirmation role
    ) // The proposed access rules
    Enum<1u8>(10080u32); // The timed recovery delay being proposed.
```

Here are some reflections on the above manifest:

- In much of a similar way to the manifest seen in the “Creation of an Access Controller” section, the public keys used for the access rules do not appear in their raw form. Instead, the non-fungible global ID of the virtual signature badge associated with the public key is what’s seen in the manifest.

- When confirming a proposal the confirmer needs to respecify the entire proposal including the rule set and the timed recovery delay.

#### Timed Confirm Recovery

After the recovery role initiated recovery in the flow seen in the “Initiating Recovery” section, some time has passed and timed confirmation of the recovery role’s recovery proposal is now possible. Anybody can now confirm the Recovery (R) role’s recovery proposal.

This would only require a call to the`timed_confirm_recovery`method restating the recovery proposal.

The following is a transaction manifest of the above-described flow:

``` rust
CALL_METHOD
    Address("\${access_controller_component}")
    "timed_confirm_recovery"
    Tuple(
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1nfxxxxxxxxxxsecpsgxxxxxxxxx004638826440xxxxxxxxxwj8qq5:[1c99dfb4448f92a28be31b541cfed52f1b61734e4aefc18914f8]"))))), // The primary role
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1nfxxxxxxxxxxed25sgxxxxxxxxx002236757237xxxxxxxxx8x44q5:[a5ca01ea8e0e59b1c8abdb520edfb19a24571b5a747498cad627]"))))), // The recovery role
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1nfxxxxxxxxxxed25sgxxxxxxxxx002236757237xxxxxxxxx8x44q5:[54fc86e5651ed504d4636e702fa39fbe7fa24d9dbe57212ab073]")))))  // The confirmation role
    ) // The proposed access rules
    Enum<1u8>(10080u32); // The timed recovery delay being proposed.
```

Here are some reflections on the above manifest:

- In much of a similar way to the manifest seen in the “Creation of an Access Controller” section, the public keys used for the access rules do not appear in their raw form. Instead, the non-fungible global ID of the virtual signature badge associated with the public key is what’s seen in the manifest.

- When confirming a proposal the confirmer needs to respecify the entire proposal including the rule set and the timed recovery delay.

### Stopping Timed Recovery

The time element of recovery proposals made by the recovery role can be disabled by any of the three roles if they want.

The flow for this would be as follows:

- Obtain the badges and/or signatures that make up the primary role, recovery role, or confirmation role.

- Call the`stop_timed_recovery`method restating the recovery proposal.

The following is a transaction manifest of the above-described flow:

``` rust
CALL_METHOD
    Address("\${access_controller_component}")
    "stop_timed_recovery"
    Tuple(
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1qgqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq056vhf:[1c99dfb4448f92a28be31b541cfed52f1b61734e4aefc18914f8]"))))), // The primary role
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1qgqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs64j5z6:[a5ca01ea8e0e59b1c8abdb520edfb19a24571b5a747498cad627]"))))), // The recovery role
      Enum<2u8>(Enum<0u8>(Enum<0u8>(Enum<0u8>(NonFungibleGlobalId("resource_sim1qgqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs64j5z6:[54fc86e5651ed504d4636e702fa39fbe7fa24d9dbe57212ab073]")))))  // The confirmation role
    ) // The proposed access rules
    Enum<1u8>(10080u32); // The timed recovery delay being proposed.
```

Here are some reflections on the above manifest:

- In much of a similar way to the manifest seen in the “Creation of an Access Controller” section, the public keys used for the access rules do not appear in their raw form. Instead, the non-fungible global ID of the virtual signature badge associated with the public key is what’s seen in the manifest.

- When stopping the timed recovery of a proposal we need to respecify the entire proposal including the rule set and the timed recovery delay.

### Creation of a Proof from the Access Controller

Once the access controller has been instantiated, the primary role can request the access controller to create a proof of the resource it protects. In the case of the access controller protecting the badge that controls the account, it means that the primary role can request a proof from the access controller of this account badge and have access to privileged methods on the account. To perform this, the flow is as follows:

- Obtain the badges and/or signatures that make up the primary role.

- Call thecreate_proofmethod on the access controller component.

The following is a transaction manifest of the above-described flow:

``` rust
CALL_METHOD
    Address("\${access_controller_component}")
    "create_proof";
```

### Locking the Primary Role

The primary role can be locked by the recovery role which removes the primary role’s ability to create proofs from the access controller. To perform this, the flow is as follows:

- Obtain the badges and/or signatures that make up the recovery role.

- Call the`lock_primary_role`method on the access controller component.

The following is a transaction manifest of the above-described flow:

``` rust
CALL_METHOD
    Address("\${access_controller_component}")
    "lock_primary_role";
```

### Unlocking the Primary Role

The primary role can be unlocked by the recovery role which permits the primary role to create proofs from the access controller. To perform this, the flow is as follows:

- Obtain the badges and/or signatures that make up the recovery role.

- Call the`unlock_primary_role`method on the access controller component.

The following is a transaction manifest of the above-described flow:

``` rust
CALL_METHOD
    Address("\${access_controller_component}")
    "unlock_primary_role";
```

## API Reference

This section is a reference of the interface of the access controller blueprint.

### Create

Creates a new access controller global component that protects the provided badge with the given rule set and timed recovery delay.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">create</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Function</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code dir="">controlled_asset</code> - <code dir="">Bucket</code>: A bucket of the asset that the access controller is to protect and create proofs of when requested by the primary role.</p></li>
<li><p><code dir="">rule_set</code> - <code dir="">RuleSet</code>: Defines the AccessRules for each of the Primary, Recovery, and Confirmation roles.</p></li>
<li><p><code dir="">timed_recovery_delay_in_minutes†</code> - <code dir="">Option&lt;u32&gt;</code>: An optional 32-bit unsigned integer that defines the amount of time in minutes the recovery role needs to wait before doing a timed confirmation of their recovery and enacting the proposed rule set.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
</tbody>




### CreateProof

Creates a proof from the badge that the access controller protects.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">create_proof</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Primary Role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><ul>
<li><code dir="">Proof</code> - a proof of the badge(s) held by the access controller.</li>
</ul></td>
</tr>
</tbody>




### InitiateRecoveryAsPrimary

Initiates the recovery process as the primary role.

This method can only be called by the primary role to initiate the recovery process. It takes the proposed rule set and proposed timed recovery delay as arguments and stores them in the access controller’s state. To perform this recovery either the confirmation or the recovery roles need to confirm this recovery through the `quick_confirm_primary_role_recovery_proposal` method.

Timed recovery can not be performed here since it’s something that only the recovery role can do.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">initiate_recovery_as_primary</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Primary Role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code dir="">rule_set</code> - <code dir="">RuleSet</code>: The set of <code dir="">AccessRule</code>s for each of the Primary, Recovery, and Confirmation roles that the primary role proposes.</p></li>
<li><p><code dir="">timed_recovery_delay_in_minutes</code> - <code dir="">Option&lt;u32&gt;</code>: The recovery delay in minutes that the primary role proposes.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
</tbody>




### InitiateRecoveryAsRecovery

Initiates the recovery process as the recovery role.

This method can only be called by the Recovery (R) role to initiate the recovery process. It takes the proposed rule set and proposed timed recovery delay as arguments and stores them in the access controller’s state.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">initiate_recovery_as_recovery</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Recovery Role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code dir="">rule_set</code> - <code dir="">RuleSet</code>: The set of <code dir="">AccessRule</code>s for each of the Primary, Recovery, and Confirmation roles that the primary role proposes.</p></li>
<li><p><code dir="">timed_recovery_delay_in_minutes†</code> - <code dir="">Option&lt;u32&gt;</code>: The recovery delay in minutes that the recovery role proposes.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
</tbody>




### QuickConfirmPrimaryRoleRecoveryProposal

Confirms the recovery proposal proposed by the primary role enacting the proposed rules and the proposed delay for timed recovery.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">quick_confirm_primary_role_recovery_proposal</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Recovery Role <strong>OR</strong> Confirmation Role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code dir="">rule_set</code> - <code dir="">RuleSet</code>: The set of rules originally proposed by the primary role. They are provided again to this method so that the caller is aware of what they’re confirming exactly. If the current recovery proposal by the primary role does not match the arguments to this method then the access controller panics and the transaction fails.</p></li>
<li><p><code dir="">timed_recovery_delay_in_minutes</code> - <code dir="">Option&lt;u32&gt;</code>: The delay for timed recovery originally proposed by the primary role. This is provided again to this method so that the caller is aware of what they’re confirming exactly. If the current recovery proposal by the primary role does not match the arguments to this method then the access controller panics and the transaction fails.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
</tbody>




### QuickConfirmRecoveryRoleRecoveryProposal

Confirms the recovery proposal proposed by the recovery role enacting the proposed rules and the proposed delay for timed recovery.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">quick_confirm_recovery_role_recovery_proposal</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Primary Role <strong>OR</strong> Confirmation Role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code dir="">rule_set</code> - <code dir="">RuleSet</code>: The set of rules originally proposed by the recovery role. They are provided again to this method so that the caller is aware of what they’re confirming exactly. If the current recovery proposal by the recovery role does not match the arguments to this method then the access controller panics and the transaction fails.</p></li>
<li><p><code dir="">timed_recovery_delay_in_minutes†</code> - <code dir="">Option&lt;u32&gt;</code>: The delay for timed recovery originally proposed by the recovery role. This is provided again to this method so that the caller is aware of what they’re confirming exactly. If the current recovery proposal by the recovery role does not match the arguments to this method then the access controller panics and the transaction fails.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
</tbody>




### CancelPrimaryRoleRecoveryProposal

Cancels the recovery proposal proposed by the primary role.



|                 |                                         |
|:----------------|:----------------------------------------|
| **Name**        | `cancel_primary_role_recovery_proposal` |
| **Type**        | Method                                  |
| **Callable By** | Primary Role                            |
| **Arguments**   |                                         |
| **Returns**     | None                                    |



### CancelRecoveryRoleRecoveryProposal

Cancels the recovery proposal proposed by the recovery role.



|                 |                                          |
|:----------------|:-----------------------------------------|
| **Name**        | `cancel_recovery_role_recovery_proposal` |
| **Type**        | Method                                   |
| **Callable By** | Recovery Role                            |
| **Arguments**   |                                          |
| **Returns**     | None                                     |



### StopTimedRecovery

Stops the timed recovery proposed by the recovery role. Stopping timed recovery does not completely remove the proposal of the recovery role, it only removes the time element away from it. The proposal remains valid and can be confirmed by the primary or confirmation role through the `quick_confirm_recovery_role_recovery_proposal` method.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">stop_timed_recovery</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Primary Role OR Recovery Role OR Confirmation Role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><code dir="">rule_set</code> - <code dir="">RuleSet</code>: The set of rules originally proposed by the recovery role. They are provided again to this method so that the caller is aware of what they’re confirming exactly. If the current recovery proposal by the primary role does not match the arguments to this method then the access controller panics and the transaction fails.</li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
</tbody>




### InitiateBadgeWithdrawAttemptAsPrimary

Initiates the badge withdrawal process as the primary role of submitting a badge withdrawal attempt.

For the badge to be withdrawn, either the confirmation or the recovery roles need to confirm this badge withdrawal attempt through the `quick_confirm_primary_role_badge_withdraw_attempt` method.

While the recovery process allows the recovery role to perform timed recovery on access controllers configured to allow timed recovery, this is not the same for badge withdraws. They do not have a time element and can only proceed further when another role confirms them.



|                 |                                               |
|:----------------|:----------------------------------------------|
| **Name**        | `initiate_badge_withdraw_attempt_as_primary‡` |
| **Type**        | Method                                        |
| **Callable By** | Primary Role                                  |
| **Arguments**   |                                               |
| **Returns**     | None                                          |



### InitiateBadgeWithdrawAttemptAsRecovery

Initiates the badge withdrawal process as the recovery role submitting a badge withdrawal attempt.

For the badge to be withdrawn, either the confirmation or the recovery roles need to confirm this badge withdrawal attempt through the `quick_confirm_recovery_role_badge_withdraw_attempt` method.

While the recovery process allows the recovery role to perform timed recovery on access controllers configured to allow timed recovery, this is not the same for badge withdraws. They do not have a time element and can only proceed further when another role confirms them.



|                 |                                                |
|:----------------|:-----------------------------------------------|
| **Name**        | `initiate_badge_withdraw_attempt_as_recovery‡` |
| **Type**        | Method                                         |
| **Callable By** | Recovery Role                                  |
| **Arguments**   |                                                |
| **Returns**     | None                                           |



### QuickConfirmPrimaryRoleBadgeWithdrawAttempt

Confirms the badge withdrawal attempt made by the primary role and returns the badge that the access controller protects in a Bucket. Once the badge is withdrawn, the access controller goes into complete lockdown, and the rules for all of the methods are set to `DenyAll` so the controller can no longer be used again.



|                 |                                                      |
|:----------------|:-----------------------------------------------------|
| **Name**        | `quick_confirm_primary_role_badge_withdraw_attempt‡` |
| **Type**        | Method                                               |
| **Callable By** | Recovery Role **OR** Confirmation Role               |
| **Arguments**   |                                                      |
| **Returns**     | None                                                 |



### QuickConfirmRecoveryRoleBadgeWithdrawAttempt

Confirms the badge withdraw attempt made by the recovery role and returns the badge that the access controller protects in a Bucket. Once the badge is withdrawn, the access controller goes into complete lockdown, and the rules for all of the methods are set to DenyAll so the controller can no longer be used again.



|                 |                                                       |
|:----------------|:------------------------------------------------------|
| **Name**        | `quick_confirm_recovery_role_badge_withdraw_attempt‡` |
| **Type**        | Method                                                |
| **Callable By** | Primary Role **OR** Confirmation Role                 |
| **Arguments**   |                                                       |
| **Returns**     | None                                                  |



### CancelPrimaryRoleBadgeWithdrawAttempt

Cancels the badge withdraw attempt made by the primary role.



|                 |                                              |
|:----------------|:---------------------------------------------|
| **Name**        | `cancel_primary_role_badge_withdraw_attempt` |
| **Type**        | Method                                       |
| **Callable By** | Primary Role                                 |
| **Arguments**   |                                              |
| **Returns**     | None                                         |



### CancelRecoveryRoleBadgeWithdrawAttempt

Cancels the badge withdraw attempt made by the recovery role.



|                 |                                                |
|:----------------|:-----------------------------------------------|
| **Name**        | `cancel_recovery_role_badge_withdraw_attempt‡` |
| **Type**        | Method                                         |
| **Callable By** | Recovery Role                                  |
| **Arguments**   |                                                |
| **Returns**     | None                                           |



### LockPrimaryRole

Locks the primary role. This removes the primary role’s ability to create proofs from the badge guarded by the access controller.



|                 |                     |
|:----------------|:--------------------|
| **Name**        | `lock_primary_role` |
| **Type**        | Method              |
| **Callable By** | Recovery Role       |
| **Arguments**   |                     |
| **Returns**     | None                |



### UnlockPrimaryRole

Unlocks the primary role. This gives the ability back for the primary role to create proofs from the badge guarded by the access controller.



|                 |                       |
|:----------------|:----------------------|
| **Name**        | `unlock_primary_role` |
| **Type**        | Method                |
| **Callable By** | Recovery Role         |
| **Arguments**   |                       |
| **Returns**     | None                  |



### MintRecoveryBadges

Mints recovery badges with the non-fungible local ids specified as an argument.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">mint_recovery_badges‡</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Primary Role <strong>OR</strong> Recovery Role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><code dir="">non_fungible_local_ids</code> - <code dir="">IndexSet&lt;NonFungibleLocalId&gt;</code>: The set of non-fungible local ids that the caller wishes to mint of the recovery badges. The recovery badge resource only accepts integer non-fungible local ids. If a non-integer type is specified the engine panics and execution fails.</li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
</tbody>




### ContributeRecoveryFee

A public method on access controllers that’s callable by everybody that allows users to deposit some XRD into the access controller’s fee vault.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">contribute_recovery_fee</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><code dir="">bucket</code> - <code dir="">Bucket</code>: A bucket of XRD to deposit into the access controller's recovery vault.</li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
</tbody>




### LockRecoveryFee

A method callable by either the primary, recovery, or confirmation roles to lock some XRD for fees from the access controller’s XRD fee vault.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">lock_recovery_fee</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Primary Role <strong>OR</strong> Recovery Role <strong>OR</strong> Confirmation Role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><code dir="">amount</code> - <code dir="">Decimal</code>: The amount of XRD to lock for fees from the access controller’s XRD fee vault.</li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
</tbody>




### WithdrawRecoveryFee

A method callable by the primary role to withdraw XRD from the recovery fees vault.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">withdraw_recovery_fee</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Primary Role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><code dir="">amount</code> - <code dir="">Decimal</code>: The amount of XRD to withdraw from the access controller’s XRD fee vault.</li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><ul>
<li><code>Bucket</code> - A bucket of the withdrawn XRD.</li>
</ul></td>
</tr>
</tbody>



