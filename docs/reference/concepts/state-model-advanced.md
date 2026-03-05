---
title: "State Model Advanced"
---

# State Model Advanced

This section describes the state model in some detail. This detail may not be necessary for all use cases.

The Babylon state model consists of a forest of state trees.

- At the top of each tree is a **global entity** - such as an account, resource or package.
- Entities contain modules - for example “Self” for their own state, and “Authorization” for their access rules.
- These modules contain **substates** which actually store the state.
- … And these substates can then **own further internal entities**, allowing for layers of recursion.

For example:

- An Account entity has a “Self” module which contains its “component data” substate.
- This component data substate owns an **internal key value store entity** - which has a self module containing entry substates for each resource owned by the account.
- These entry substates each then own a single **internal vault entity** for that resource which actually stores its relevant resource.

In general, only global entities can be addressed directly, and internal state is mostly an implementation detail - although the state tree can be queried via the APIs.
