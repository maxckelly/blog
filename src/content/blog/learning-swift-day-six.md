---
title: Learning Swift - Day Six
date: 2026-07-29
description: This is day 6 out of 100 of learning Swift
status: Done
---

## The Goal

Today is day 6 of learning Swift. To start the day I began by finishing off my iOS 26 Programming for beginners book. There were some good nuggets in there about the liquid glass, split views etc... Today I'm continuing on with the Standford leactures - Leacture 7: Animation.

---

- You can pass a `view` into another view by doing the below.

```swift
struct CodeView<AncillaryView>: View  where Ancillary: View {

    let ancillaryView: AncillaryView
    var body: some View {
        VStack {
            Text("This is in the view")
            ancillaryView // Renders the view that is passed in.
        }
    }
}

// We then can pass it in like:
CodeView(ancillaryView: Text("MAX"))
```

- I could also do it like the below if I wanted

```swift
struct CodeViewTwo<AncillaryView: View>: View {
    let ancillaryView: AncillaryView

    init(@ViewBuilder ancillaryView: () -> AncillaryView) {
        self.ancillaryView = ancillaryView()
    }

    var body: some View {
        VStack {
            Text("This is in the view")
            ancillaryView
        }
    }
}

CodeViewTwo {
    Text("MAX")
}
```

- Or we can do it like the below if we don't want init

```swift
struct CodeViewTwo<AncillaryView: View>: View {

    @ViewBuilder let ancillaryView: () -> AncillaryView

    var body: some View {
        VStack {
            Text("This is in the view")
            ancillaryView()
        }
    }
}

CodeViewTwo {
    Text("MAX")
}
```

- `fileprivate` this keyword allows you to have struct within the views above and also this struct only exists in this file. So if someone else had a struct somewhere else it wouldn't conflict. We're na

```swift
fileprivate struct Selection {
    ...
}
```

- Using `init` in a view with `binding`

```swift
struct CodeViewTwo<AncillaryView: View>: View {
    let ancillaryView: AncillaryView
    @Binding var selection: Int

    init(selection: Binding<Int>, @ViewBuilder ancillaryView: () -> AncillaryView) {
        self._selection = selection // So the reason we do _ is the binding above is already the computed value. So essentially the _selection means we can assign the selection init which is of type Binding<Int> to an int essentially.
        self.ancillaryView = ancillaryView()
    }

    var body: some View {
        VStack {
            Text("This is in the view")
            ancillaryView
        }
    }
}

// To provide the default value to this init you would do
struct CodeViewTwo<AncillaryView: View>: View {
    let ancillaryView: AncillaryView
    @Binding var selection: Int

    init(
        selection: Binding<Int> = .constant(3),
        @ViewBuilder ancillaryView: @escaping () -> AncillaryView = { EmptyView() }
    ) {
        self._selection = selection
    }

    var body: some View {
        VStack {
            Text("This is in the view")
        }
    }
}
```

- `@escaping` in init: The Reason we use `@escaping` is if you don't use the function within the init. So if you don't call it like `ancillaryView()` within the init you then need to hold onto it and call it later. For example

```swift
struct CodeViewTwo<AncillaryView: View>: View {
    let ancillaryView: () -> AncillaryView

    // Basically saying ancillaryView is escaping this init
    init(@ViewBuilder ancillaryView @escaping: () -> AncillaryView) {
        self.ancillaryView = ancillaryView
    }

    var body: some View {
        VStack {
            Text("This is in the view")
            ancillaryView()
        }
    }
}
```

- You can also provide the default value in the init with the below example

### Animations

- Only changes can be animated.
- The animation is showing a user something that has already happened in your code. In our code everything is happening instantly its just the user is seeing it later.
- Appearance and disappearance of views are called `transitions`
- Animation can only happen to things that are on screen.
- Example of animtation

```swift
Text("Hello"!)
    .foregroundStyle(warning ? Color.red : Color.primary)
    .font(big ? .largeTitle : .caption)
    .animation(.easeInOut, value: warning) // .easeInOut is an animation struct.
```

- The example above is animating this view when this value changes.
- If you put anything past `.animation` it will not animate that e.g.

```swift
Text("Hello"!)
    .foregroundStyle(warning ? Color.red : Color.primary)
    .font(big ? .largeTitle : .caption)
    .animation(.easeInOut, value: warning) // Animates when warning changes
    .padding(warning ? 10 : 0) // Doesn't get animated
    .animation(.easeInOut, value: big) // Doesn't animate the padding above because it is with the value warning
```

- Recommend against putting animation on containers value like `HStack`, `VStack`
- However when you're doing transitions it makes sense to put it on the containers.

- Animation types:
  - `.linear`
  - `.easeInOut`
  - `.spring`
  - `.bouncy`

- Another way to suppress animation is with `.transaction` such as

```swift
CodeView()
    .transaction { transaction in
        if code.kind == .master {
            transaction.animation = .none
        }

    }
```

- `AnyTransition` are transations that we can use to make views appear or disappear nicely.

```swift
ForEach(game.attempts) { attempt in
    CodeView(attempt)
        .transition(.asymmetric(insertion: .move(edge: top), removal: .identity))

}
```

- `.onChange` - Often you might want to tame some imperative action when some state changes. This is easy to do with `.onChange` view modifier.

```swift
@State private var selection = 0

view(for: game.guess)
    .onChange(of: selection, initial: false) {
        print("This change changes")
    }
```

- Or we can see what the value changed from

```swift
.onChange(of: selection, intial: true) { oldValue, newValue in
    print("This selection change from \(oldValue) to \(newValue)!")
    if oldValue == newValue {}
}
```

- `TimelineView` builds the view in side of it and draws the ViewBuilder on a predefined schedule

```swift
TimelineView(.everyMinute) { context in
    Text("Stock price is \(stock.price)")
}
```
