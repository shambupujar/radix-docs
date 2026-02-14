---
title: "Call a Protected Method/Function"
---

# Call a Protected Method/Function

### Call a Protected Method/Function

To call a protected method or function, you must show proof that you can pass some AccessRule. For protected methods, this AccessRule can be any access rule assigned to a role which has permission to call that method. For protected functions, this is the directly assigned AccessRule for the given function. Proving this is accomplished by creating **Proof** objects and pushing these onto one’s **AuthZone** before calling the protected method/function.  

### Proofs

One of the important conventions of badge usage is that, under normal usage, they are not actually withdrawn from a `Vault` and passed around. Instead, a `Proof` is created and used to prove that an actor owns that badge - or at least access to it.

You can create a `Proof` for a particular resource from a `Vault` or (rarely) a `Bucket`, and then do things with that `Proof` without changing ownership of the underlying contents. For example, if my account holds a FLIX token signifying that I am a member of Radflix, I can create a `Proof` of that token and present it to a Radflix component so that it will allow me to access it. I’m not actually transferring it…even if the Radflix component was buggy or malicious it would have no ability to take control of the underlying token from which the `Proof` was generated. Think of it just like flashing a badge in the real world. Whoever you show it to can see that you possess it, and can inspect it, but you’re not actually handing it to them so they can’t hang on to it.

Proofs have a quantity associated with them, and a Proof can not be created with a quantity of 0. That is, if you have a `Vault` which is configured to hold a specified resource, but that `Vault` is empty, you can’t create a Proof of that resource.

Examples of how to create and use Proofs can be found in [Using Proofs](using-proofs.md)

### The Authorization Zone

The top level of every transaction, accessible by the [transaction manifest](../learning-step-by-step/create-and-use-transaction-manifests.md), contains a worktop where resources are stored, and an authorization zone where Proofs are stored. When calling any Scrypto method from the manifest, the rules governing access to that method are automatically compared to the contents of the authorization zone. If the rules can be met, access to the method is granted and the call succeeds. If the rules can’t be met, then the transaction immediately aborts. There’s no need to specify what Proofs you think are necessary to meet the rules; the system just figures it out for you.

The same logic applies within a component called directly from the manifest. If it attempts a privileged action on a resource, such as trying to mint additional supply, the rules are checked against the contents of the authorization zone. If the rules can be met, the action succeeds. If the rules can’t be met, the transaction aborts.

That’s it. In the vast majority of use cases, you don’t have to think about access control or the authorization zone. The system just takes care of it.
