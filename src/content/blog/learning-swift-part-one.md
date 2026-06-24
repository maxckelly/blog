---
title: Learning Swift - Day one
date: 2026-06-22
description: This is day one out of 100 of learning Swift.
status: Done
---

## The Goal

I want to start learning and build more mobile apps with Swift. My experince with React native over the last many year has taught me a lot but I feel I'm reaching a point where I need to grow and want to get closer to the device. Ontop of this I have found the "build once run everywhere" isn't possible if you want to build amazing apps that run well on the users devices. So here begins my journey to become an expert at Swift.

---

## Week 1 - Model, UI & Swift Type System

<https://www.youtube.com/watch?v=B42CuI0RO7Y&list=PLoROMvodv4rPHblRXKsJCQs8TLGpiCTrG&index=3>

I've started watching the computer science course on Youtube I'll begin this blog from leacture 3 as the first two where very basic and things I had already picked up from React native.

- Model: Holds all the business logic.
- Swift UI makes you mark all sources of truth with either `@State` or `@Observable`
- Any "sharing" of truth is marked with `@Binding`.

### Facts about structs?

- `struct` are immutable - when you pass them around you copy them. Thus you have to go out of your way to create a mutable copy of a source of truth
- What can we have in structs?
  - stored vars e.g. `var greeting = "Hello world"`
  - computerd vars i.e. those whose values is the result of evaluating some code:
  - constant lets i.e. vars whose values never change. E.g. `let greeting = "Hello world"`
  - functions
  - Initializers (`init`): Special functions that are called when creating a `struct` or `class`
- Views are structs and so are completely READ-ONLY. Thus you have to use a special `@State` to make a stored var in a view modifiable.
- `@Binding` to share a struct between views
- Need to explicitly delcare their identity (usually through a var named `id`)

---

### struct vs class

- A `struct` (and enum) is a value type and a class is a reference type.
- A `value` type stores its value (`itself`) directly in a var/let
- A reference type stores a `pointer` (a reference) to its value in a var/let
- The `mutability` of structs is explicit
- Not so with a class (they are always mutable, so you can change it anywhere)

---

### Functions in swift

- We can write functions in swift using a few ways.

```swift
  func multiply(operand: Int, by: Int) -> Int {
    return operand * by
  }

  multiply(operand: 5, by: 5)
```

OR

```swift
   // The "_" here means "nothing here"
   func multiply(_ operand: Int, by otherOperand: Int) -> Int {
       return operand * otherOperand
   }

   multiply(5, by: 6)
```

### Initializers in Swift

- A special static fun which is used to create an instance of a struct
- You can have multiply inits.
- No need to return the created thing inside, just initialize all the structs vars.
- If you don't give a struct an init, you'll get a free init

```swift
 struct RoundedRectangle {
    init(cornerRadius: CGFloat) {
        // Initialize this rectangle with that cornerRadius
    }

    init(cornerSize: CGSize) {
        // initialize this rectangle with that cornerSize
    }
 }
```

### Enum

- We know an enum can only have discrete states
- Enum is a value type so it is copied as it is passed around
- We can refer to the below as `FastFoodMenuItem.fries` but we rely on **type inference** e.g. `.fries`

```swift
 enum FastFoodMenuItem {
    case hamburger
    case fries
    case drink
    case cookie
 }
```

- A powerful feature in enums is **associated data** which means:
  - Each case of an enum can (but does not have to) have its own "associated data". For example:

  ```swift
    enum FastFoodMenuItem {
        case hamburger(patties: Int)
        case fries(size: FryOrderSize)
        case drink(String, ounces: Int)
        case cookie
    }

    let menuItem: FastFoodMenuItem = FastFoodMenuItem.hamburger(patties: 2)
    var otherItem: FastFoodMenuItem = FastFoodMenuItem.cookie
  ```

- Using enums in a switch
- In the below you can see the `let patty` is defining the `patties` which is associated data.

```swift
   switch menuItem {
       case .hamburger(let pattyCount):
           print("A burger with \(pattyCount) patties!")
       case .fries(let size): print("a \(size) order of fries")
       case .drink(let brand, let ounces):
           print("a \(ounces)oz \(brand)")
   }
```

- Using enums which you can iterate over.

```swift
    // The CaseIterable allows us to call the .allCases
    enum TeslaModel: CaseIterable {
        case X
        case S
        case Three
        case Y
    }

    // Because we've done `CaseIterable` above.
    for model in TeslaModel.allCases {
        reportSalesNumber(for: model)
    }

    func reportSalesNumbers(for model: TeslaModel) {
        switch model { ... }
    }
```

### Generics

- Best example of a Generic is an `Array`. Arrays does not care what type the things inside it are, but it still needs to specify that type. Otherwise, how will it declare a function like `.append`.

### Optionals

- An optional is just an enum with a generic associated value. Nothing more.

```swift
    enum Optional<T> { // T is a generic type, like element in Array<Element>
        case none
        case some(T) // The some case has associated value of that generic type T
    }
```

- You can see that it can only have two discrete values: `is set` (some) or `not set`(none). In the `is set` case, it can have some associated value tagging along.
- Examples of optionals.

```swift
    let colors = [Color.blue, .red, .green, .yellow]
    let index: Optional<Int> = colors.firstIndex(of: Color.orange)
    firstIndex(of:) // searches an array to find the given element and returns the index to it. index must be of type Optional<Int> here. Because Color.orange may not be there.
```

- Syntax sugar for optionals

```swift
    var hello: String? // var hello: Optional<String> = .none
    var hello: String? = "hello" // var hello: Optional<String> = .some("hello")
    var hello: String? = nil // var hello: Optional<String> = .none
```

- How we get the optional values out

```swift
    let hello: String? = ...
    print(hello!) // ! says force get the value and crash if its not there. Extreme case.

    if let safeHello = hello {
        print(safeHello)
    } else {
        // do something else.
    }
```

- Optional initializers. (Within structs)

```swift
    struct Vehicle {
        init?(argument: Type) {
            // initialize my cars as usual, but return nil if you cannot do so for some reason.
        }
    }

    // Which would then have to be called like:
    if let car = Vehicle(type: "Car") {
        // Do something
    }
```

### Exensions

- Swift allows you to add funcs and computed vars to existing structs/enums/protocols at will.
- We can add ane extension simply for code clarity.
- We can add our own View modifiers to the view protocol with extension
- We can make an array of things of a type we've defined do things special to that type.
- We might add an extension to some struct from our model to make it do UI things.

```swift
    extension Color {
        var name: String
    }
```
