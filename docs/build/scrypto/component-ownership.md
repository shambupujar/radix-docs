---
title: "Component Ownership"
---

Scrypto allows a component to own other components, similar to how a component can own vaults. If a component is owned by another component, its methods may only be accessed by the blueprint of the parent component.

An example of component ownership:

``` rust
use scrypto::prelude::*;

#[blueprint]
mod child {
    struct Child {
        name: String,
    }

    impl Child {
        fn new_component(name: String) -> ChildComponent {
            Self {
                name
            }.instantiate()
        }

        pub fn get_name(&self) -> String {
            self.name.to_string()
        }
    }
}

#[blueprint]
mod parent {
    struct Parent {
        child0: ChildComponent,
        child1: ChildComponent,
    }

    impl Parent {
        fn new_component() -> ParentComponent {
            let child0: ChildComponent = Child::new("child0".to_string());
            let child1: ChildComponent = Child::new("child1".to_string());

            // Move the two child components into a new parent component
            let parent_component = Self {
                child0,
                child1,
            }.instantiate();

            // child0 and child1 are now owned by this parent_component
            parent_component
        }

        pub fn new_globalized() -> Global<Parent> {
            Self::new_component()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        pub fn get_child0_name(&self) -> String {
            self.child0.get_name()
        }

        pub fn get_child1_name(&self) -> String {
            self.child1.get_name()
        }
    }
}
```

Note in the above example how the name of the struct gets an automatic suffix of `Component` when instantiated.
