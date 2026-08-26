---
title: Day Eight
date: 2026-07-26
description: This is day 8 out of 100 of learning Swift
status: Done
series: Learning Swift
part: 8
---

## The Goal

Today is day 8 of learning Swift. I've started book four of the documentation "Advanced patterns" here we cover subscripts, inheritance, initialization and deinitialization, optional chaining, error handling and concurrecny. Along with this continue with the L9 of the Stanford youtube video.

Notes:

- Try use `aspectRatio` to best handle dynamic screens
- Text can show numbers directly by passing them in like: `Text(0.4, format: .number/.percent)`
- To unwrap a variable in an if statement we can do

```swift
if let endTime {

}
```

That is the same as doing

```swift
if let endTime = endTime {

}
```

- We can build timers using the `TimeDataSource` which will keep counting. An example of this is below. This increase the count from the current date

```swift
Text(TimeDataSource<Date>.currentDate, format: .offset(to: startTime, allowedFields: [.minute, .second]))
```

- You can use `.flexibleSystemFont()` to build fonts that can scale.
- `some` is greatly preferred than `any`

### Important protocols

- `Equatable` - makes == work;
- `Hashable` - For when someone wants to be able to look your stuff up
- `Identifiable` - used by SwiftUI to match your model up with specific views
