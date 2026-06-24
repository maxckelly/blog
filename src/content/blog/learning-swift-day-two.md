---
title: Learning Swift - Day Two
date: 2026-07-22
description: This is day 2 out of 100 of learning Swift
status: Done
---

## The Goal

I want to do 100 days of learning Swift. This is day two of doing an hour a day. The goal of today is to get through the part one reading of documentation and also watch another Stanford leacture.

---

At the start of the day I focused on the documentation reading. I'm currently up to Enums and structs and have been playing around in a Swift playground.

The below is an example of what an enum can have in it. Swift assigns the raw values starting at zero and incrementing by one each time. In the example below, Ace is explicitly given a raw value of 1, and the rest of the raw values are assigned in order. You can also use strings or floating-point numbers as the raw type of an enumeration.

```swift
enum Rank: Int {
    case ace = 1
    case two, three, four, five, six, seven, eight, nine, ten
    case jack, queen, king

    func simpleDescription() -> String {
        switch self {
        case .ace:
            return "Ace"
        case .jack:
            return "Jack"
        case .queen:
            return "Queen"
        case .king:
            return "King"
        default:
            return String(self.rawValue)
        }
    }
}

let ace = Rank.ace
let aceRawValue = ace.rawValue
```

So every case above is assigned a value by default similar to an array's index. Teh default value starting at and and then incrementing by one. In the above example we're starting the default value at 1 rather than 0. So ace = 1, then two = 2, three = 3 so on and so on.

```swift
enum Suit {
    case spades, hearts, diamonds, clubs

    func simpleDescription() -> String {
        switch self {
        case .spades:
            return "spades"
        case .hearts:
            return "this is hearts"
        case .diamonds:
            return "diamonds"
        case .clubs:
            return "clubs"
        }
    }
}

let hearts = Suit.hearts
let heartsDescription = hearts.simpleDescription()
```

Another example:

```swift
enum ServerResponse {
    case result(String, String)
    case failure(String)
}

let success = ServerResponse.result("6:00am", "8:09pm")
let failure = ServerResponse.failure("Out of cheese.")

switch success {
case .result(let sunrise, let sunset):
    print("Sunrise is at \(sunrise) and sunset is at \(sunset).")
case .failure(let message):
    print("Failure... \(message)")
}
// Prints "Sunrise is at 6:00am and sunset is at 8:09pm."
```

### Concurrency

- In Swift concurrency looks like:

```swift
func fetchUserId(from server: String) async -> Int {
    if server == "primary" {
        return 97
    }

    return 501
}

func fetchUsername(from server: String) async -> String {
    let userID = await fetchUserId(from: server)

    if userID == 501 {
        return "John Appleseed"
    }

    return "Guest"
}
```

- Use `async let` to call an async function letting it run in parallel with other async code. Similar to a Promise.all in Javascript.

```swift
func connectUser(to server: String) async {
    async let userID = fetchUserId(from: server)
    async let username = fetchUsername(from: server)
    let greeting = await "Hello \(username), user ID \(userID)"
    print(greeting)
}
```

- To call async functions from synchronous code without having to wait for them to return use `Task`

```swift
Task {
    await connectUser(to: "primary")
}
```

- Use task groups to structure concurrent code for example:

```swift

let userIDs = await withTaskGroup(of: Int.self) { group in
    for server in ["primary", "secondary", "development"] {
        group.addTask {
            return await fetchUserId(from: server)
        }
    }

    var results: [Int] = []

    for await result in group {
        results.append(result)
    }

    return results
}
```

- Using actors to ensure that different asynchronous functions can safely interact with an instance of the same actor at the sametime.

```swift
actor ServerConnection {
    var server: String = "primary"
    private var activeUsers: [Int] = []

    func connect() async -> Int {
        let userID = await fetchUserId(from: server)
        // communicate with server...
        activeUsers.append(userID)

        return userID
    }
}

let server = ServerConnection()
let userID = await server.connect()
```

- When you call a method on an actor or acces one of its properties, you mark that code with `await` to indicate that it might have to wait for other code that's already running on the actor to finish.

### Protocols & Extensions

- A protocol in Swift is a blueprint of methods, properties, and other requirements that a type can adopt. Think of it as a contract: any type that conforms to a protocol promises to provide actual implementations of whatever the protocol specifies.
- Use `protocol` to declaure a protocol.

```swift
protocol ExampleProtocol {
    var simpleDescription: String { get }

    mutating func adjust()
}
```

- We can then use the protocol in the below way on a class or struct

```swift
class SimpleClass: ExampleProtocol {
    var simpleDescription: String = "A very simple class"
    var anotherProperty: Int = 69105
    func adjust() {
        simpleDescription += " Now 100% adjusted."
    }
}

var a = SimpleClass()
a.adjust()
let aDescription = a.simpleDescription

struct SimpleStructure: ExampleProtocol {
    var simpleDescription: String = "A simple structure"

    mutating func adjust() {
        simpleDescription += " (adjusted)"
    }
}

var b = SimpleStructure()
b.adjust()
let bDescription = b.simpleDescription
```

- We can also put this protocol on a `Int` or `String` example below:

```swift
extension Int: ExampleProtocol {
    var simpleDEscription: String {
        return "The number \(self)"
    }

    mutating func adjust() {
        self += 42
    }
}

print(7.simpleDescription)
```

### Error handling

- You represent errors using any type that adopts the `Error` protocol.

```swift
enum PrinterError: Error {
    case outOfPaper
    case noToner
    case onFire
}
```

- User `throw` to throw an error and `throws` to mark a function that can throw an error.
- If you thorw an error in a functin, the function returns immediately and the code that called the function handles the error.

```swift
func send(job: Int, toPrinter printerName: String) throws -> String {
    if printerName == "Never Has Toner" {
        throw PrinterError.noToner
    }

    return "Job sent"
}
```

- You can handle errors in a number of ways like:

```swift
do {
    let printerResponse = try send(job: 1040, toPrinter: "Bi Sheng")
    print(printerResponse)
} catch {
    print(error)
}
```

- You can also write multiply catch blocks after each other such as.

```swift
do {
    let printerResponse = try send(job: 1040, toPrinter: "Bi Sheng")
    print(printerResponse)
} catch PrinterError.onFire {
    print("On fire")
} catch let printerError as PrinterError {
    print("Printer error: \(printerError)")
} catch {
    print(error)
}
```

- Another way is to use `try?` for example:

```swift
let printerSuccess = try? send(job: 1884, toPrinter: "Max")
```

- If you wish to fire hooks regardless of errors you can user `defer`

```swift
var fridgeIsOpen = false
let fridgeContent = ["milk", "eggs", "leftovers"]

func fridgeContains(_ food: String) -> Bool {
    fridgeIsOpen = true

    defer {
        fridgeIsOpen = false
    }

    let result = fridgeContent.contains(food)
    return result
}

if fridgeContains("banana") {
    print("Found a banana")
}

print(fridgeIsOpen)

// Returns false
```

### Generics

- Generics let you write flexible, reusable code that works with any type while still keeping full type safety. Instead of writing the same logic over and over for different types—or resorting to something loose like Any—you write it once with a placeholder, and the compiler fills in the real type when you use it.

```swift

// Say you have
func swapInts(_ a: inout Int, _ b: inout Int) {
    let temp = a
    a = b
    b = temp
}

// Which can then be changed to
func swapValues<T>(_ a: inout T, _ b: inout T) {
    let temp = a
    a = b
    b = temp
}
```

- That `<T>` is a type parameter—a placeholder name (the convention is T, but it can be anything). When you call swapValues(&x, &y), Swift infers what T actually is from the arguments and guarantees both are the same type. Pass two Ints and it works; pass an Int and a String and the compiler rejects it.
- Which is then called like:

```swift
var a: Int = 5
var b: Int = 10
swapValues(&a, &b)   // unambiguously Int

var first = "hello"
var second = "world"
swapValues(&first, &second)

print(first)   // "world"
print(second)
```
