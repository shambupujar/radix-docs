---
title: "Create Your First Custom Resource"
---

# Create Your First Custom Resource

Using Scrypto you can create a wide range of resources, whether fungible, non-fungible, simple tokens or more complex authorization badges. Being able to modify their properties allows you to accurately represent your chosen entity/idea for each.

In [Run Your First Project](https://docs.radixdlt.com/docs/run-your-first-project) you’ve created your first resource. Before we start modifying resources let’s understand what they are a little more.

As an [Asset-Oriented](../../essentials/asset-oriented.md) language resources/assets are not implemented on top of Scrypto, but are native to it. Many other platforms do not have resources at the core of their engines. Asset’s and their behaviours must be implemented through additional code that requires checking and tracking that transactions have happened as expected.

With Scrypto the behaviours are guaranteed. To make resources behave intuitively and safely, we’ve also made the language and Radix Engine treat them like real world objects, making things like double spending (where a resource is counted twice but has only been transferred once) impossible, and ensuring no resources can be lost in a transaction. In other words, every transaction concludes with all resources securely transferred from and to an account or other component. The engine itself does the work of tracking and checking the deeper level of the transaction, so your code can focus on utility and application.

Resources on Radix can have many different roles, so we have given them many different properties and behaviours that can be customized. Although much of the depth of these features lies in [resource behaviors](../resources/resource-behaviors.md), resource [metadata](../metadata/index.md) is where a tokens name and its symbol are stored.

For a deeper dive into resources, explore the the [Resources](../resources/index.md) section of these docs, but for now let’s move our focus to how we can create and customise our own.

## Creating a Resource

If you’ve been following the [Learning Step-By-Step](index.md), you’ve already created your first resource, the Hello token. With a few adjustments to the blueprint code we can customize that token and make it more like the resources you will soon use in your own projects. In fact, you can create multiple resource types from the same updated code.

Let’s first take a look at how the Hello token is given its name and symbol.



To create your own Hello blueprint run the command `scrypto new-package hello` in your terminal. Then look in the generated package, hello \> src \> lib.rs to view and edit the blueprint code.



## Metadata

In many cases the resources you make will need to have information on them that makes them human understandable. Things like the name and description of a resource will need to be somehow associated with it. That information is held in [metadata](set-verification-metadata.md). There are a variety of [standard fields](../metadata/metadata-for-wallet-display.md) that we can add (or any custom fields we need). A resource’s `name` and `symbol` are amongst the fields used by wallets and dApps to display the resource to users, so are the first metadata fields we’ll set.

You can see them being set in the Hello blueprint in the in the `instantiate_hello` function here:

``` rust
    .metadata(metadata! {
        init {
            "name" => "HelloToken", locked;
            "symbol" => "HT", locked;
        }
    })
```

With different values here, we can create a new token with a different name and symbol.



Metadata fields that have url values must be of type `Url` and not `String`, as they are treated differently by the Radix engine. To do this convert the `String` to a `Url` with `Url::of()`, e.g.

``` rust
"icon_url" => Url::of("https://example.url/icon.png"), locked;
```



## Customizing Your Resource

We can update the Hello blueprint to create resources with any name and symbol metadata that we parse in. We start by adding input arguments for the two fields to the `instantiate_hello` function.

``` rust
    pub fn instantiate_hello(name: String, symbol: String) -> Global<Hello> {
        // --snip--
    }
```

Then adjust the resource builder to use the new arguments.

``` rust
let my_bucket: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
             .divisibility(DIVISIBILITY_MAXIMUM)
             .metadata(metadata! {
                 init {
                     "name" => name, locked;
                     "symbol" => symbol, locked;
                 }
             })
             .mint_initial_supply(1000)
             .into();
```

Now when you create a component from this blueprint you input your desired name and symbol as arguments. These will be used in the instantiate (create) function to build a new resource with that name and symbol. The new resource will be stored in the component’s vault, ready to be transferred out with the free_token method.

:::note
**To give it a go follow the instructions in [the official-examples repo here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/03-create-a-custom-resource#using-the-component**

.)
:::



## One Blueprint, Multiple Resources

A fundamental part of how we made the Radix Engine work is to [reuse code](../../essentials/reusable-code.md). This means components are instantiated from the blueprints you write, and these components are the live objects that can be interacted with on the network, similar to smart contracts on other platforms. From a blueprint you construct a component (or more than one component). This [blueprints and components](../scrypto/blueprints-and-components.md) relationship gives us a few useful things we can do.

- You can create multiple components from the same blueprint
- You can use existing blueprints made by others to create your own components
- You can [make your own blueprints with the intention of sharing them with the community](../scrypto/reusable-blueprints-pattern.md)

With the updated Hello blueprint we can explore the first of these and create multiple components that each supply a different token when we call the `free token` method.

:::note
**There are more steps to try this out in [the official-examples repo](https://github.com/radixdlt/official-examples/tree/main/step-by-step/03-create-a-custom-resource#multiple-components-from-one-blueprint**

.)
:::



## Closing Thoughts

You’ve now taken your first step into Scrypto resource creation and customization. Customizing resource metadata has given us tokens with new names and symbols making them accessible to users in wallets and dApps. We’re also able to see some of the power of Scrypto with reusable blueprints. They’ve made us more efficient and allowed you to use only a single, versatile blueprint to create many differently named tokens. We develop these steps of customisation further in the [next section introducing a Radix favourite, the Gumball Machine](build-a-gumball-machine.md).

:::note
Let us know if you find any section helpful or not by clicking one of the buttons below ⬇. You can also let us know about a typo or outdated information using the same buttons.
:::


