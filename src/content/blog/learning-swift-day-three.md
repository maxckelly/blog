---
title: Learning Swift - Day Three
date: 2026-07-24
description: This is day 3 out of 100 of learning Swift
status: Done
---

## The Goal

Today is day 3 of learning Swift. After finishing the first documentation book on the basics of Swift I'm going to now focus on watching another Stanford leacture - <https://www.youtube.com/watch?v=IvOF3Bmk-94&list=PLoROMvodv4rPHblRXKsJCQs8TLGpiCTrG&index=4>.

---

### Notes from leacture

- One thing I noticed from the leacture is if you're in a scroll view that adds item to a screen e.g. scroll view then it has a button saying add item. If we wrap the function the button calls `withAnimation` in animates how items enter the scroll view.

```swift
Button("Add item") {
    withAnimation{
        addItemFunc()
    }
}
```

- `Equatable`: Equatable is a Swift protocol that lets you check whether two instances of a type are equal using == (and !=). A type conforms to it by providing a static func == that defines what "equal" means.
  The convenient part: for structs and enums, Swift can synthesize this automatically. You just declare conformance, and as long as all stored properties are themselves Equatable, the compiler writes the comparison for you (comparing every property).

```swift
enum Kind: Equatable {
    case master
    case guess
    case attempt([Match]) // An array is equatable and then the things inside the array must also be equatable.
    case unknown
}

// If we didn't have `Equatable` then we wouldn't be able to do this check.
if fake.kind === .attempt {
    // do something
}
```

- If we didn't have Equatable we would have to do something like:

```swift
static func == (lhs: Kind, rhs: Kind) -> Bool {
    switch { ... }
}
```

- `.overlay`: Is a SwiftUI modifier that layers another view on top of the view it's attached to, aligned within that view's bounds.
  The key difference from a ZStack: the overlaid view doesn't affect the original view's size. The base view determines the layout, and the overlay is sized and positioned relative to it. That makes it ideal for badges, borders, labels, or icons that should sit on top of something without changing how much space it takes.

```swift
Image("photo")
    .overlay(
        Text("NEW")
            .padding(4)
            .background(.red),
        alignment: .topTrailing
    )

// Or another common one is adding a border with rounded corners, since .border doesn't follow a clipped shape
RoundedRectangle(cornerRadius: 12)
    .fill(.gray.opacity(0.2))
    .overlay(
        RoundedRectangle(cornerRadius: 12)
            .stroke(.blue, lineWidth: 2)
    )
```

- `.minimumScaleFactor`: Is a SwiftUI text modifier that lets text shrink to fit its available space instead of truncating or wrapping. You give it the smallest fraction of the original font size you're willing to allow, and SwiftUI scales the text down only as far as needed.

```swift
Text("A long piece of text that might not fit")
    .minimumScaleFactor(0.5)  // can shrink to 50% of the font size
```
