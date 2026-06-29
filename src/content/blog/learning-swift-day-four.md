---
title: Learning Swift - Day Four
date: 2026-07-25
description: This is day 4 out of 100 of learning Swift
status: Done
---

## The Goal

Today is day 4 of learning Swift. I'm going to be focusing on the second book of the Swift documentation "Data and logic" which we will go over basic operators, strings and characters, collection types and control flow.

---

### Basic Operators

- Range operators: These are shortcuts for expressing a range of values such as `a..<b`, `a...b`
- Unary operators operate in a single target (such as -a). Unary prefix operators appear immediately before their target (such as !b), and unary postfix operators appear immediately after their target (such as c!).
- Binary operators operate on two targets (such as 2 + 3) and are inflix because they appear in between their two targets.
- Ternary operators operate on three targets. Like C, Swift has only one ternary operator, the ternary conditional operator (a ? b : c)

#### Assignment Operator

- The assignment operator (a = b) initializes or updates the value of a with the value of b.

```swift

let b = 10
var a = 5
a = b
// a is now equal to 10
```

- If the right side of the assignment is a tuple with multiple values, its elements can be decomposed into multiple constatns or variables at once. E.g.

```swift
let (x, y) = (1, 2)
// x is equal to 1, and y is equal to 2
```

- The assignment operator in Swift doesn't itself return a value. The following statement isn't valid:
- This feature prevents the assignment operator (=) from being used by accident when the equal to operator (==) is actually intended.

```swift
if x = y {
    // This isn't valid, because x = y doesn't return a value.
}
```

#### Arithmetic Operators

- Swift supports: +, -, \*, /
- Swift doesn't allow values to overflow by default
- Remainder operator `%`: For example `a % b` works out how many multiples of b will fit inside a and returns the value thats left over.
- For example to calculate how many 4s will fit inside 9 we do `9 % 4` which equals 1. Two 4s equal 8 and the remainder is 1

#### Unary minus operator

- The sign of a numeric value can be toggled using a prefixed `-`. Known as unary minus operator. For example

```swift
let three = 3
let minusThree = -three // minusThree equals -3
let plusThree = -minusThree // plus three equals 3 or "minus minus three"
```

#### Unary plus operator

- The unary plus operator `+` returns a value it operates on, without any change:

```swift
let minusSix = -6
let alsoMinusSix = +minusSix // equals -6
```

- So basically does nothing.

#### Compound assignment operators

- Swift provides compound assignment operators that combine assignment `=` with another operation. For example:

```swift
var a = 1
a += 2
// A is now equal to 3.
```

#### Comparison Operators

- You can compare two tuples if they have the same type and the same number of values. Tuples are compred from left to right, one value at a time, until the comparison finds two values that aren't equal. These two values are compared and the result of that comparison determines the overall result of the tuple comparison. If all the elements are equal then the tuples themselves are equal. For example:

```swift
(1, "zebra") < (2, "apple") // true because 1 is less than 2; "zebra" and "apple". Because the first check of 1 is less than 2 the check stops there and doesn't compare the string.

(3, "apple") < (4, "bird") // 3 is not less than 4 so it then moves onto comparing the string and in terms of alphabetical order apple is before bird so apple is true. This then results to the whole tuples being true.

(4, "dog") == (4, "dog") // If the first elements are the same then it returns true but also moves onto the next stage which then compares "dog" and "dog" so if the elements are the same then it still compares the next tuples.

("blue", -1) < ("purple", 1) // OK: Evalutes to true
("blue", false) < ("purple", true) // Error: can't use < to compare boolean.

```

#### Ternary conditional operator

- Ternary can be used like

```swift
if question {
    answer1
} else {
    answer2
}

// OR

let contentHeight = 40
let hasHeader = true
let rowHeight = contentHeight + (hasHeader ? 50 : 20)
```

#### Nil-Coalescing operator

- The nil-coalescing operator `a ?? b` unwraps an optaional if it contains a value, or returns a default value b if a is nil. The expression a is wlays of an optional type. The expression b must match the type that's stored inside a.

```swift
a != nil ? a! : b
```

- The code above uses the ternary conditional operator and forced unwrapping (a!) to access the value wrapped inside `a` when `a` isn't `nil`, and to return `b` otherwise.

```swift
let defaultColorName = "red"
var userDefinedColorName: String? // defaults to nil

var colorNameToUse = userDefinedColorName ?? defaultColorName
// userDefinedColorName is nil, so colorNameToUse is set to the default of "red"
```

#### Range Operators

- The **closed range** operator `a...b` defines a range that runs from `a` to `b` and includes the values `a ` and `b`. The value of `a` must not be greater than `b`
- The closed range operator is useful when iterating over a range in which you want all of the values to be used such as with a `for-in` loop.

```swift
for index in 1...5 {
    print("\(index) times 5 is \(index * 5)")
}

// 1 times 5 is 5
// 2 times 5 is 10
// 3 times 5 is 15
// 4 times 5 is 20
// 5 times 5 is 25
```

- The **half-open range** operator `a..<b` defines a range that runs from `a` to `b` but doesn't include `b`.
- It's said to be half open because it contains its first value but not its final value.
- These are useful when you work with zero-based lists such as arrays, where it's useful to count up to (but not including) the length of the list.

```swift
let names = ["Anna", "Alex", "Brian", "Max"]
let count = names.count

for i in 0..<count {
    print("Person \(i + 1) is called \(names[i])")
}

// Person 1 is called Anna
// Person 2 is called Alex
// Person 3 is called Brain
// Person 4 is called Max
```

#### One-sided ranges

- The **one-sided range** operator continue as far as possible in one direction, this is called one-sided range because the operator has a value on only one side. For example:

```swift
let names = ["Anna", "Alex", "Brian", "Max"]

for name in names[2..] {
    print name
}

// Brian
// Max

for name in names[...2] {
    print(name)
}

// Anna
// Alex
// Brian
```

- The half open range operator also has a one-sided form that's written with only its final value. Just like whe you include a value on both sides, the final value isn't part of the range. For example:

```swift
let names = ["Anna", "Alex", "Brian", "Max"]

for name in names[..<2] {
    print(name)
}

// Anna
// Alex
```

- We can use ranges in other forms across the app no just in for loops. For example:

```swift
let range = ...5

range.contains(7)    // false
range.contains(4)   // true
range.contains(-7)  // true
```

#### Logical operators

- Swift uses the standard `||`, `&&` etc... I won't go into this much however the below did catch my eye.
- On the below we can use `()` around checks to make them stand out more in the code. Also we don't need the `||` in the if statements if we don't want to

```swift
if (enteredDoorCode && passedRetinaScan) hasDoorKey knowsOverridePassword {
    print("Welcome")
} else {
    print("Access Denied")
}
```

#### Strings and characters

- Swifts string type is a value type.
- Three double quotation marks `"""` Allow for multiline string literals.
- In multiline strings a line breaks in your code represents the line breaks in the UI. If you wish to avoid the line breaks use `\`
- To ignore you can use `#` which will ignore the special characters for example `var string = #"Line1\#nLine 2"`
- Below is an example is how to initialise an empty string

```swift
var emptyString = ""
var anotherEmptyString = String()
```

- You can check if a string is empty by checking its boolean `isEmpty` property.

```swift
if emptyString.isEmpty {
    print("Nothing to see here")
}
```

#### String mutability

- You indicate whether a particular String can be modified (or mutated) by assigning it to a variable (in which case it can be modified) or to a constant (in which case it can't be). For Example

```swift
var variableString = "Horse"
variableString =+ " and carriage"
// variableString is now "Horse and carriage"

let constantString = "Highlander"
constantString += " and another highlander"
// this reports a compile-time error - a constant string cannot be modified.
```

- You can iterate over a string using a for in loop such as

```swift
for character in "Dog!" {
    print(character)
}
```

- We can also use character type annotation such as

```swift
let exclamationMark: Character = "!"
```

- You can also construct strings for example:

```swift
let catCharacters: [Character] = ["C", "A", "T", "!"]
let catString = String(catCharacters)
print(catString)
```

- String values can also be added together

```swift
let string1 = "hello"
let string2 = "world"
var welcome = string1 + string2
```

- You can also append a string

```swift
var instruction = "look over"
instruction += string2

// OR
let exclamationMark: Character = "!"
welcome.append(exclamationMark)
```

#### String interpolation

- You can use this by passing the `\(string)` inside a ""

```swift
let hello = "Hello world"
print("\(hello)!")
```

- You can count characters using `.count` e.g.

```swift
let hello = "hello"
print("Hello count \(hello.count)")
```

- Use `indices` property to access all of the indices of individual characters in a string. For example

```swift
let greeting = "Hello world"
for index in greeting.indices {
    print("\(greeting[index]) ", terminator: "")
    // Prints "H e l l o  w o r l d"
}
```

#### Inserting and removing

- To insert a single character into a string at a specificed index, use the `insert(_:at:)` method, and to insert the contents of another string at a specified index, use the `insert(contentsOf:at:)` method. For example

```swift
var welcome = "hello"

welcome.insert("!", at: welcome.endIndex)
// welcome now equals "hello!"

welcome.insert(contentsOf: " there", at: welcome.index(before: welcome.endIndex))
// welcome now equals "hello there!"
```

- You can also remove characters

```swift
var welcome = "Hello world"

welcome.remove(at: welcome.index(before: welcome.endIndex))
// Welcome now equals "hello worl"

let range = welcome.index(welcome.endIndex, offsetBy: -6)..<welcome.endIndex
welcome.removeSubrange(range)

// welcome now equals "hello"
```

#### Substrings

- The difference between strings and substrings is that **as a performance optimization, a substring can reuse part of the memory that's used to store the original string**
- Substrings aren't suitable for long term storage.

```swift
let greeting = "Hello, world!"
let index = greeting.firstIndex(of: ",") ?? greeting.endIndex
let beginning = greeting[..<index]
// beginning is "Hello"

// Convert the result to a String for long-term storage
let newString = String(beginning)
```

#### Prefix and Suffix equality

- We can check if the string has a prefix or suffix easily by using the `.hasPrefix` or `.hasSuffix` for example

```swift
let romeoAndJuliet = [
    "Act 1 Scene 1: Verona, A public place",
    "Act 2 Scene 2: Verona, A test",
]

var act1SceneCount = 0

for scene in romeoAndJuliet {
    if scene.hasPrefix("Act 1") {
        act1SceneCount += 1
    }
}

for scene in romeoAndJuliet {
    if scene.hasSuffix("test") {
        act1SceneCount += 1
    }
}
```

#### Arrays

- You can create a new arry with a default value using the below example

```swift
var threeDoubles = Array(repeating: 0.0, count: 3)
// threeDoubles is of type [Double] and equals [0.0, 0.0, 0.0]
```

- You can also combine arrays like

```swift
var threeDoubles = Array(repeating: 0.0, count: 3)

var anotherThreeDoubles = Array(repeating: 2.5, count: 3)
// threeDoubles is of type [Double] and equals [2.5, 2.5, 2.5]

var sixDoubles = threeDoubles + anotherThreeDoubles
```

- Another way to add to an array appart from append is

```swift
shoppingList += ["Baking Powder"]
```

- To iterate over an arry you can use the `for-in loop`

```swift
for item in shopppingList {
    print(item)
}
```

- Anther way is `enumerated()` which can for each over the item in an array and return a tuple composed of an integer and the item.

```swift
for (index, value) in shoppingList.enumerated() {
    print("Item \(index + 1): \(value)")
}

// Item 1: Six eggs
// Item 2: Milk
// so on and so on.
```

#### Sets

- Set is an unordered collection of unique values. That difference drives everything else about when you'd reach for each.
- A type must be hashable (protocol in Swift that means a type can produce a hash value — an integer that represents the contents of an instance) in order to be stored in a set.
- Can create sets like

```swift
var letters = Set<Character>()
```

- You can initialize a set with an array literal as a shorthand e.g. the below is a set of string values.

```swift
var favoriteGenres: Set<String> = ["Rock", "Hip Hop"]
```

- Use `.sorted()` to iterate over the values of a set in a specific order
- Use `a.intersection()` method to create a new set with only the values common to both sets.
- Use the `.symmetricDifference()` method to create a new set of values in either set but not both.
- Use the `.union()` method to create a new set with all of the values in both sets.
- Use the `.subtracting()` method to create a new set with values not in the specified set.
- Use the `==` to determine whether two sets contain all the same values.
- Use the `.isSubset(of:)` method to determine whether all of the values of a set are contained in the specified set
- Use the `.isSuperset(of:)` method to determine whetehr a set contains all of the values in a specified set.
- Use `.isStrictSubset(of:)` or `.isStrictSuperset(of:)` methods to determine whether a set is a subset or superset but not equal to a specified set.
- Use the `isDisjoint(with:)` method to determine whether two sets have no values in common

#### Dictonaries

- Creating a dictonary `var namesOfIntegers: [Int: String] = [:]`
- You can initialize a new array with the dictonaries keys or values using the below
- Dictonaries have no order. In particular the order you insert items doesn't define the order they're iterated over.

```swift
let airportCodes = [String](airport.keys)
let airportNames = [String](airport.values)
```

- You can iterate over a dictonary item like:

```swift
let numberOfLegs = ["Spider": 8, "ant": 6]

for (animalName, legCount) in numberOfLegs {
    print(animalName)
    print(legCount)
}
```

#### Control flow

- In a for loop you can use something called `stride`

```swift
let minutes = 60
let minuteInterval = 5

for tickMark in stride(from: 0, to: minutes, by: minuteInterval) {
    // render the tick mark every 5 minutes (0, 5, 10, 15...)
}

let hours = 12
let hourInterval = 3
for tickMark in stride(for: 3, through: hours, by: hourInterval) {
    // render the tick mark every 3 hours (3, 6, 9, 12)
}
```

#### While loops

- while evaluates its condition at the start of each pass through the loop
- repeat-while evaluates its condition at the end of each pass through the loop
