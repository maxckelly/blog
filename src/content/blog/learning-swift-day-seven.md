---
title: Learning Swift - Day Six
date: 2026-07-30
description: This is day 7 out of 100 of learning Swift
status: In Progress
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
