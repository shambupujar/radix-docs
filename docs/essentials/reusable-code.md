---
title: "Reusable Code"
---

# Reusable Code

Radix splits the concept of "smart contract" into two parts: **blueprints** and **components**.

Blueprints are similar to classes in object-oriented programming. They describe what state a component will manage, and implement the various methods which will be used to manage that state.

Components are instantiated from blueprints, just like objects are instantiations of a class. Multiple components can be instantiated from a single blueprint, and each will have its own state but follow the shared logic implemented in the blueprint.

For example, you might create a RedeemToken blueprint which is expected to give out some token in exchange for a different input token. You could then instantiate a component from that blueprint which expected to receive ZOMBO and hand out CERB, and instantiate another component which expected to receive GUMBLE and hand out COIN. Your instantiation parameters would define the expected resources, and likely supply their pool of resources to hand out as well. Each instantiated component would have its own global address.

Because the transaction model allows for ad-hoc combinations of calls to different components, passing data and resources between them, developers are encouraged to write modular blueprints that "do one useful thing well," similar to the renowned Unix development philosophy.

To incentivize the creation of reusable blueprints and components, Radix implements a native royalty system which automatically collects any developer-specified "use fees" any time the blueprint or component is used in a transaction.
