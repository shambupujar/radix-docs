---
title: "Reusable Blueprints Pattern"
---

# Reusable Blueprints Pattern

This may be looked at as a best-practice to blueprint developers hoping to benefit from developer royalties, rather than a design pattern. Non the less, this is an important best practice and warrants its place here. When <a href="https://learn.radixdlt.com/article/what-is-the-radix-roadmap?_gl=1*dofazv*_ga*MTIzMTQzODAzMS4xNjgxNDA1NDI2*_ga_MZBXX3HP5Q*MTY5NDUzODQwNS4xOTMuMS4xNjk0NTM4NDA1LjYwLjAuMA.." target="_blank">Babylon</a> comes, blueprint developers will have the ability to publish their blueprints to the blueprint catalog and impose royalties on them. Developers hoping to attract a large amount of other developers to use their blueprint are encouraged to ensure that their blueprints are reusable such that they cater to a wide range of developers.

Ensuring that your blueprints are general and reusable is not something that is done in a single step. There isn’t a "reusable" switch that you can flick and have your blueprints be reusable; rather, it comes as a number of small steps which when carried out as a collective, you get general reusable blueprints which fit the needs of a wide array of developers.

## Multiple Instantiation Functions

A common approach which is typically seen in many blueprints is this concept of an instantiation function which creates an admin badge and assumes this as the admin. Then, when a caller presents this badge, they are authorized to call administrative methods on the component. While this works well when the administrator is a single person or entity, this does not lend itself very well when the instantiator of your blueprint is a complex organization which requires the ability to set components up which have complex access rules.







![complex-authorization.png](/img/complex-authorization.png)

Consider an organization with the above structure which wishes to utilize your blueprint to instantiate a new component. While the single admin badge worked well under the assumption of a single admin, it does not lend itself well at all to such a complex organization structure. Very quickly, many questions begin popping up: who should be given the admin badge? should the admin badge be mintable to allow for the additional people to be included? How to handle the complex auth required here with the "and" and "or" logical operations?

It is clear that there is a need for both: simple ways of instantiating components which creates the badges and all of the required resources, as well as ways which allow users with complex authorization needs to be able to fullfil their needs.

Therefore, it is recommended that blueprints implement two (or more) instantiation functions which are aimed at two main groups:

- Simple instantiation functions: these are instantiation functions which create all of the required badges, resources, and components on behalf of the caller and then return everything to them. This type of instantiation functions are convenient to use but liming as they do not provide a lot of flexibility as to how access rules will be set.

- Custom instantiation functions: this is an entire class of instantiation functions which allow the instantiator to setup their own access rule(s) on the components that they are instantiating; thus, giving them the flexibility to set rules that fit within the context in which they are instantiating the component.

### Examples:

- <a href="https://github.com/radixdlt/scrypto-examples/tree/main/core/payment-splitter" target="_blank">Payment Splitter</a>

## Small Modular Reusable Blueprints

This best practice is not unique to Scrypto, it is a universal best practice which you will encounter in almost all programming languages in all fields. When working on a Scrypto package, its important to notice repeating patterns which could be refactored into their own blueprint, or even better, notice which pieces of your logic can be replaced by components of a blueprint already available in the blueprint catalog.







![large-blueprints.png](/img/large-blueprints.png)

When developing a system, it might be tempting to put everything into a single blueprint which would manage the system and would essentially be the system. This is approach is typically faster when you are first developing a system prototype, however, in no time, bugs will find their way into such a system and the process of maintaining it would be very difficult as it would very quickly become harder to reason about and harder to debug due to the sheer amount of moving pieces.

Instead of making your application a single large blueprint, it is recommended that you use the blueprint-component concepts in Scrypto to develop small blueprints which are used by other blueprints. Each blueprint would establish a good separation of concerns where each blueprint would have one single task that it performs well. When other blueprints need to perform this task, they simply instantiate a new component from this blueprint and make use of it. This approach comes with a wide array of advantages, such as:

- Smaller blueprints are typically more secure by virtue of being easier to reason about and thus many errors are usually found while writing the blueprints.

- Writing unit tests for a smaller blueprint is easier than larger blueprints. In smaller blueprints, it’s easier to see what the edge-cases are that need to be tested for and since the blueprint is smaller, you can write tests for all of the edge-cases that come to mind.

- Building a larger blueprint on top of a number of smaller, well-tested blueprints provides the developer with the guarantee that the blueprints that they are using are doing exactly what they believe that they do. It alleviate the burden of testing every single portion of the larger blueprint as the smaller blueprints being uses have already been tested.

- In almost all cases, adding features to a smaller blueprint will be easier than a larger blueprint. This comes down to a very important point: smaller blueprints are easier to reason about and their edge-cases can easily be seen.

- You might have developed your blueprints thinking that you would be the only user of them. However, you might quickly find other developers instantiating components from your blueprint to use in their projects. Your smaller, more modular blueprint would allow you to benefit from Radix’s developer royalty system.

Of course, to every rule there is an exception. The application that you are building might be a small application where splitting the application across multiple different blueprints would not make sense or would lead to great complexity. These cases do exist, in this case, it is perfectly fine to have all of your logic implemented in a single blueprint.
