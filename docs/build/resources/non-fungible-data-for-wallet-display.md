---
title: "Non-Fungible Data for Wallet Display"
---

# Non-Fungible Data for Wallet Display

To display a non-fungible, you will want to [display its id](non-fungible-display.md), and possibly display its associated data.

This article captures the rules the Wallet uses to display non-fungible data. Other clients may choose their own representations of non-fungible data, but we recommend the standardized interpretation of certain fields.

## What is Non-fungible data?

Non-fungibles are transferred individually, and each holds its own data. This data is *not* the metadata that is set on resource managers, but it fills a similar purpose for individual non-fungibles. This data must fit with a data structure defined at initial creation of the resource.

For example, I might have a set of “Dallas Mavericks Tickets” NFTs where the data struct says that each individual ticket non-fungible must have a `game_date` and `seat_number`. Each separate non-fungible under this resource will potentially have a different value for `game_date` and `seat_number`.

Non-fungible data is encoded as [Scrypto SBOR](/docs/scrypto-sbor), and the engine ensures it matches the schema of the Non-Fungible data type, defined on the Non-Fungible Resource. The engine also validates that the top-layer is of a Tuple type with named fields.

This data structure is recursive, and can be displayed by parsing the [annotated programmatic SBOR JSON](../../reference/sbor/sbor-programmatic-json.md) from the Gateway API.

Some top-level field names have standardized purposes and are discussed below. But the other fields can be displayed by mapping the returned SBOR json into a tree-based data view.

## Individual NFT unit non-fungible data

Clients will typically use non-fungible data for display in a very similar way as metadata, and so we list some standards of usage in this document.

Wherever non-fungible resource managers (which may be thought of as “collections” of NFTs for users) are shown in the wallet, the associated individual NFT units (non-fungibles) are shown grouped beneath the resource manager as the heading. Non-fungible data affects how each of these units are displayed under the heading.

| Non-fungible data field | Type | Intended Use |
|----|----|----|
| `name` | `String` | Simple name of this particular non-fungible unit as intended to be displayed, with capitals. |
| `description` | `String` | Summarized description of this particular non-fungible unit as intended to be displayed, with capitals. |
| `key_image_url` | `Url` | Location of the image to be associated with this non-fungible unit. |
| `[other arbitrary data fields]` | *Any* | Additional user-facing structured data; or programmatic data associated with this non-fungible. |

### Name

Shown as an additional identifier along with the `NonFungibleLocalId` (which is universally used as the unique identifier for the non-fungible by the wallet).

For example: \> Mavs vs Lakers 12-25-2024

The name **may be truncated after 32 characters**.

### Description

Not shown as an identifier for the NFT - only listed under the general detailed information for the non-fungible.

For example: \> This NFT grants access to the American Airlines center for the 12-25-2024 matchup between…​

Intended to provide a short, simple description in the context of a “get info” style screen. As with other metadata fields, no formatting is supported.

Line breaks, extra whitespace, and other types of formatting tags should not be used - they may either be shown explicitly as text or ignored.

The description **may be truncated after 256 characters**.

### Key Image URL

A non-fungible may often represent or be closely associated with an image - whether a unique piece of art, a profile picture, or simply an image that gives a greater sense of the purpose of the NFT. The image at the URL specified here, if present, will be used in the wallet as the primary visual representation of the non-fungible, displayed prominently as a user browses their assets.

At preview level, images may be shown cropped. If wider than 16:9 (W:H), it will be cropped into the largest possible 16:9 rectangle. If taller than 1:1, it will be cropped into the largest possible 1:1 square.

- A detail view will show it at full aspect ratio.
- Supported types: JPG, PNG, SVG, GIF (including animated), WEBP (including animated)
- May be ignored for file sizes above 10MB
- Animated images: The total area of all frames together must be less than 100000000. For example, if the animation resolution is 2000×2000, the maximum number of animation frames allowed is 25.

Also note that most decentralized data storage platforms offer a standard URL to individual files. This means that a non-fungible on Radix may be linked to decentralized image storage in this way using this data field.

:::note[Future extensions]
A later expansion of the metadata standard may include the ability to specify more - such as different images for different sizes and usage, explicit mutability and aspect ratio, and verifiable hashes. We start with a simple single URL field standard for now, which the Radix Wallet will always intend to support, and will expand the standard (and its adoption in the Radix Wallet) from developer community feedback.

Some NFT creators may wish to set additional data fields pointing to richer visual data (like multiple sizes, video, or 3D data), or include verifying data like a hash of the image in question. In the first instance of the Radix Wallet, this information would be shown among the “arbitrary data fields” below, with this `key_image_url` as the only field given special visual presentation. This wallet support may be expanded and improved as community standards emerge.
:::



### Additional fields

The wallet may truncate these as needed.

A nonfungible resource manager specifies a specific set of available metadata fields for all of its nonfungible resources via the schema. In addition to the specially-handled metadata above, the wallet will show any additional fields as key / value pairs if the value are of simple types like strings, integers, and addresses. More complex data types may or may not be shown by the wallet necessarily.

e.g. \> Section = G \> Seat number = 44 \> Game date = 12-25-24

Not shown in this list is the `NonFungibleLocalId` even though this piece of data may be set by the NFT’s creator and will be shown prominently in the Radix Wallet.

The `NonFungibleLocalId` is used to address a specific non-fungible, must be unique, and may be set by the NFT creator. Because the creator may set it, it is a useful way to “brand” a given non-fungible.

For example, the `NonFungibleLocalId` might be a string set to “mavs_lakers_122524_44G”.

For more details on how we recommend non-fungible ids to be displayed, please see the [non-fungible display](non-fungible-display.md) article.
