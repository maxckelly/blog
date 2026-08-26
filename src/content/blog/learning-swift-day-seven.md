---
title: Day Seven
date: 2026-07-30
description: This is day 7 out of 100 of learning Swift
status: Done
series: Learning Swift
part: 7
---

## The Goal

Today is day 7 of learning Swift. I've started off by reading the next document book "Core Foundation". Here I learnt a lot about functions and how we can use them in all of Swifts different ways. I've also started listening to L8 - Animation.

---

### Animation

- The best way to to test and build animations is to put the duration at 2 or higher seconds. The reason for this is so we can easily see how the animation works in slowmo. `withAnimation(Animation.easeInOut(duration: 3))`
- Another good pointer is to extend animation and assign animation to named lets. For example

```swift
extension Animation {
    static let name_of_let = Animation.easeInOut(duration: 3)
}

// This means we can call this withAnimation(Animation.easeInOut(duration: 3)) -> withAnimation(Animation.guess) -> withAnimation(.guess)
```

- We can prevent animation on elements by doing `.animation(nil, value: BOOL)`. Use this when you want to suppress something when something changes.
- `.transaction` - we can use transaction to control what has the animation and what doesn't for example:
- Use transaction to suppress animation when you want to do it based on some state. Something being in a certain condition.

```swift
    .transaction { transcation in
        if isCheck {
            transaction.animation = nil
        }
    }
```

- Another way we can animate is using `.offset` This can be done by:

```swift
    Text("HELLO")
        .transition(.offset(x: 0, y: 200))
```

- We can then extend the transition and put our transitions in a static similar to how we extended `Animation`. For example:

```swift
    extension AnyTransition {
        static let name_of_let AnyTransition.offset(x: 0, y: 100)
    }
```

- We can transition elements in and out of the screen using `AnyTransition.asymmetric(insertion: AnyTransition, removal: AnyTransition)`. An example of this is:
- `.insertion` is how the elements move onto the screen and where.
- `.removal` is how they get removed from the screen and where.

```swift
    VStack {
        Text("Hello")
        Text("World")
    }
    .transition(
        AnyTransition.asymmetric(insertion: .move(edge: .trailing), removal: .move(edge: .trailing))
    )
```

- We can also use `opacity` or `identity`

```swift
    VStack {
        Text("Hello")
        Text("World")
    }
    .transition(
        AnyTransition.asymmetric(insertion: isTrue ? .opacity : .move(edge: .top), removal: .move(edge: .trailing))
    )
```

- We can then exapand on out static let in AnyTransition we've done above. For example:

```swift
    extension AnyTransition {
        static func nameOfFunc(_ isOver: Bool) -> AnyTransition {
            AnyTransition.asymmetric(
                insertion: isOver ? .opacity : .move(edge: .top),
                removal: .move(edge: .trailing)
            )
        }
    }
```

- Then we can call it like:

```swift
    VStack {
        Text("Hello")
        Text("World")
    }
    .transition(
        .attempt(game.isOver)
    )
```

- We can chain animations using `completion`. For example:

```swift
    Button("Restart") {
        // The .restart is from the static we defined above.
        withAnimation(.restart) {
            restarting = true
        } completion: {
            withAnimation(.restart) {
                game.restart()
                selection = 0
            }
        }
    }
```

- `Group`: A group is a container basically. You wrap the elements you want to group
- Another good reason to have group is to set font. However other than that an animation its not very useful

```swift
    Group {
        Text("Max")
        Text("Hello")
    }
```

#### Reading

- For the rest of the day I've continued on with the documentation reading - **Advanced patterns** which covers:
  - Subscripts
  - Inheritance
  - Initialization
  - Deinitialization
  - Optional chaining
  - Error handling
  - Concurrency

#### Subscript

- A subscript is a shortcut for accessing the member elements of a collection, list or sequence. It allows you to query instances of a type by writing one or more values in square brackets `[]` immediately after the instance name, instead of needing explicit methods for reading and writing values.
- An example of using subscripts already is `myArray[0]` or `myDictionary["key"]`
- Swift allows you to define your own custom subscripts for your structs, classes and enums for example:

```swift
subscript(index: Int) -> ElementType {
    get {

    }

    set(newValue) {

    }
}
```

- Real world example: Imagine you want to create a custom `Matrix` struct to represent a 2D grid. Instead of calling a bulky method like `matrix.getGridValue(row: 1, column: 2)` you can use a multi-parameter subscript.

```swift
struct Matrix {
    let rows: Int, columns: Int
    var grid: [Double]

    subscript(row: Int, column: Int) -> Double {
        get {
            return grid[(row * columns) + column]
        }

        set {
            grid[(row * columns) + column] = newValue
        }
    }
}

// Usage:
var myMatrix = Matrix(rows: 2, columns: 2, grid [1.0, 2.0, 3.0, 4.0])

// Reading a value using the subscript
print(myMatrix[0, 1]) // Outputs: 2.0

// Writing a value using the subscript:
myMatrix[0, 1] = 5.0
print(myMatrix[0, 1]) // Outputs 5.0
```

##### Key takeaways

- Versatility: Subscripts aren't limited to just ints. They can take any type of input parameter and return any type.
- Overloading: A single type can have multiple subscripts definitions as long as their paramters types or return types are different (overloading)
- Type subscripts: You can also define subscripts that belong to the type itself rather than an instance by using the `static subscript` keyword.

### Inheritance

- When we have a base class such as

```swift
class Vehicle {
    var currentSpeed = 0.0
    var description: String {
        return "travelling at \(currentSpeed) miles per hour"
    }

    func makeNoise() {
        // do nothing
    }
}

// Automatically inherits all of the above.
class Bicycle: Vehicle {
    var hasBasket = false

}
```

- We can then create a `subclass` from the base class using the below

```swift
class SomeSubclass: SomeSuperclass {
    // subclass definitions go here.
}
```

- Subclasses themselves can be subclasses. For example:

```swift
class Tandem: Bicycle {
    var currentNumberOfPassengers = 0

}
```

### Overriding

- You prefix your overriding definition with `override` keyword.
- This allows you to override values from the inherited classes. For example:

```swift
class Train: Vehicle {
    override func makeNoise() {
        print("Choo Choo")
    }
}

let train = Train()
train.makeNoise()
// prints "Choo Choo"
```

- You can prevent a method, property or subscript from being overridden by marking it as `final`. Do this by writing the `final` modifier before the method, property or subscript.
- For example: `final var`, `final func`, `final class`, `final subscript`
