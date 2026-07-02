---
title: Learning Swift - Day Five
date: 2026-07-26
description: This is day 5 out of 100 of learning Swift
status: Done
---

## The Goal

Today is day 5 of learning Swift. Most of the morning I spent refactoring and doing some experiements on how I should get data from an API, put it into a store and then render it to the Swift UI. I've be trying to think of the best structure to allow for scalable code. I will finally finish of with leacture five of the Stanford course.

---

### What I've experiemented with

- So what I was building was a screen that displays details of a workout class they can book into. I'm fetching the data from my Supabase backend and then displaying it in a single screen. I structured it like:

```swift
// Folder structure
// Root
    // Modules
        // SessionDetails
            // API
            // Components
            // Screens
            // Stores
    // Services
        // SupabaseService.swift
```

- Above is the folder structure which helps me understand the flow. So we first enter into the below code in the `API` folder called `SessionQueries` the idea of this file is to put any queries related to the session details in here.

```swift
import Foundation
import Supabase

struct SessionDetailsQueries {
    private let client: SupabaseClient

    init(client: SupabaseClient = SupabaseService.client) {
        self.client = client
    }

    func getSession(by sessionId: UUID) async throws
        -> BookableSession?
    {
        return try await SupabaseService.client
            .from("bookable_sessions")
            .select()
            .eq("session_id", value: sessionId)
            .single()
            .execute()
            .value

    }
}
```

- We then go into the `SessionDetailsStore` this store is responsible for calling the API, and passing it cleanly to the view. The idea of the store is to handle all the is api states and also the query. I think we could exclude the business logic from here and put it into a SessionDetailsModel which would then take a session and be responsible for all the business logic we need to do.

```swift
import Foundation
import SwiftUI

@MainActor
@Observable final class SessionDetailStore {
    private let queries: SessionDetailsQueries
    private let sessionId: UUID

    private(set) var session: BookableSession?
    private(set) var isLoading = false
    private(set) var isRefetching = false
    private(set) var error: Error?

    /// Active booking id for the current member, when this session is booked —
    /// needed to present the cancel sheet. `nil` until loaded or when not booked.
    private(set) var bookingId: String?

    init(
        sessionId: UUID,
        queries: SessionDetailsQueries? = nil
    ) {
        self.sessionId = sessionId
        self.queries = queries ?? SessionDetailsQueries()
    }

    func load(memberId: UUID?) async {
        let hasSession = session != nil
        isRefetching = hasSession
        isLoading = !hasSession
        error = nil

        await performFetch(memberId: memberId)

        isLoading = false
        isRefetching = false
    }

    // A seperate refresh func because putting it all together can sometimes cause the refresh to cancel which throws an error.
    func refresh(memberId: UUID?) async {
        await performFetch(memberId: memberId)
    }

    private func performFetch(memberId: UUID?) async {
        do {
            let session = try await queries.getSession(by: sessionId)
            self.session = session
            await loadBookingId(for: session, memberId: memberId)
        } catch {
            self.error = error
        }
    }

    /// Looks up the member's active booking for this session so it can be
    /// cancelled. Resets to `nil` when the session isn't booked or has no member.
    private func loadBookingId(
        for session: BookableSession?,
        memberId: UUID?
    ) async {
        guard let session, session.isBooked ?? false, let memberId else {
            bookingId = nil
            return
        }
        let bookings =
            (try? await BookingQueries.getActiveBookings(
                memberId: memberId,
                classSessionIds: [sessionId]
            )) ?? [:]

        bookingId = bookings[sessionId]?.uuidString
    }
}
```

- Finally we then render the UI. `extension BookableSession` is an example of what we could move into a SessionDetailsModel so we don't need to store that logic in the UI.
- One thing we can do to enhance this is put a `.environment(store)` which then can be called in the sub views like `@Environment(SessionDetailStore.self) private var store` which means we don't need to prop drill.

```swift
import MooseCore
import MooseUI
import SwiftData
import SwiftUI

struct SessionDetailsScreen: View {
    let sessionId: UUID

    @Environment(CreditStore.self) private var creditStore
    @Environment(\.modelContext) private var modelContext

    @Query private var members: [StoredMember]
    private var member: StoredMember? { members.current }

    @State private var selectedAction: BookingAction<BookableSession>?
    @State private var store: SessionDetailStore

    init(sessionId: UUID) {
        self.sessionId = sessionId
        _store = State(initialValue: SessionDetailStore(sessionId: sessionId))
    }

    var body: some View {
        Group {
            if store.isLoading {
                LoadingScreen(message: "Loading session...")
            } else if let error = store.error {
                VStack {
                    Text(error.localizedDescription)
                        .foregroundStyle(.label2)
                        .padding()
                }
            } else if let session = store.session {
                content(for: session)
            }
        }
        .navigationTitle(store.session?.name ?? "No name found")
        .navigationSubtitle(store.session?.studioName ?? "No studio found")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            if let credits = creditStore.summary {
                ToolbarItem(placement: .topBarTrailing) {
                    CreditChip(credits: credits)
                }
            }
        }
        .bookingActionSheet(
            $selectedAction,
            creditStore: creditStore,
            onDismiss: { Task { await store.refresh(memberId: member?.id, ) } }
        )
        .appBackground()
        .task(id: member?.id) {
            await store.refresh(memberId: member?.id)
        }
    }

    @ViewBuilder
    private func content(for session: BookableSession) -> some View {
        let info = session.startDateTimeLabels
        VStack(alignment: .leading) {
            ScrollView {
                VStack(alignment: .leading, spacing: Spacing.lg) {
                    VStack(alignment: .leading) {

                        Text(info.time)
                            .font(.largeTitle)
                            .foregroundStyle(.ink)
                            .bold()

                        Text(info.date).foregroundStyle(.label2)

                    }

                    WidgetRow(
                        durationMinutes: session.durationLabel,
                        remainingSpots: session.spotsLabel,
                        creditCosts: session.creditCostLabel
                    ).appShadow(.sm)

                    InstructorCard(
                        instructorName: session.instructorLabel
                    )

                    VStack(alignment: .leading, spacing: Spacing.sm) {
                        Text("Description")
                            .font(.title3)
                            .bold()
                            .foregroundStyle(.ink)

                        Text(session.classDescription ?? "No description found")
                            .font(.default)
                            .foregroundStyle(.label2)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
            }
            .refreshable {
                print("🟧 .refreshable fired, cancelled=\(Task.isCancelled)")
                await store.refresh(memberId: member?.id)
            }

            footer(for: session)
                .padding(.horizontal, Spacing.md)
                .padding(
                    .bottom,
                    Spacing.md
                )
        }
    }

    @ViewBuilder
    private func footer(for session: BookableSession) -> some View {

        if session.isBooked ?? false {
            VStack {
                AddToCalendarButton(
                    session: session,
                    kind: .primary,
                    accessibilityIdentifier:
                        "session-details.add-to-calendar-button"
                )
                AppButton(
                    title: "Cancel",
                    kind: .danger,
                    accessibilityIdentifier: "session-details.cancel-button"
                ) {
                    guard let bookingId = store.bookingId else { return }
                    selectedAction = .cancel(
                        session: session,
                        bookingId: bookingId
                    )
                }
                .disabled(store.bookingId == nil)
            }
        } else {
            AppButton(
                title: "Book class",
                accessibilityIdentifier: "session-details.book-button"
            ) {
                selectedAction = .book(session)
            }
        }
    }
}

// MARK: - Session details display values

extension BookableSession {
    /// Spots remaining as a bare count, e.g. `4`, falling back to an em dash.
    var spotsLabel: String {
        guard let spotsRemaining else { return "—" }
        return String(spotsRemaining)
    }

    /// Credit cost formatted to two decimals, e.g. `2.00`, or an em dash.
    var creditCostLabel: String {
        guard let creditCost else { return "—" }
        return creditCost.formatted(.number.precision(.fractionLength(2)))
    }

    /// Instructor name with a placeholder fallback.
    var instructorLabel: String { instructorName ?? "-" }

    /// Formatted start time and date, e.g. `(time: "6:00 PM", date: "Thu 4 Jun")`,
    /// falling back to em dashes when the stored ISO-8601 string can't be parsed.
    var startDateTimeLabels: (time: String, date: String) {
        guard let startTime,
            let parsed = ISO8601DateFormatter().date(from: startTime)
        else {
            return (time: "—", date: "—")
        }
        return (
            time: DateService.formatTime(parsed),
            date: DateService.formatShortDate(parsed)
        )
    }
}

#Preview {
    NavigationStack {
        SessionDetailsScreen(sessionId: UUID())
    }
}
```

## Leacture

- Leacture 5 of the Stanford series notes:

### Layout

1. Container Views "offer" some or all of the spaces offered to them
2. Views then choose what size they want to be
3. Container views then position the views inside them

- Each of the below all usse the Layout protocol
- `HStack` and `VStack` divide up the space that is offered to them and then offer the to the views inside.
  - We can use things like `Spacer(minLength: CGFloat)` inside stacks. Which always takes all the space offered to it, draws nothing and minLength defaults to the mosst likely spacing you'd want on a given platform.
  - `Divider()` can also be used to draw a line cross-wise.
  - A stacks choice of who to offer space to can be overridden with `.layoutPriority(Double)`. In other words, `layoutPriority` trumps "least flexible".

```swift
HStack {
    Text("Important").layoutPriority(100)
    Image(systeName: "arrow.up")
    Text("Unimportant")
}
```

- The "Important" text above will get the space it wants first (highest layout priorty).
- Then the image and unimportant text would be offered whatever space is left over.
- If Text doesn't get enough space it will elide e.g. "Swift is..." instead of "Swift is great!"

- `LazyHStack` and `LazyVStack`
  - These are lazy versions of the stack above. These versions of the stack don't build any of their views that are not visible. They don't take up all the space offered to them even if they have flexible views inside. You'd want to use these in `ScrollView` etc... basically where you're storing a long list.

- `LazyHGrid` and `LazyVGrid`
  - Sizes its views based on info given to the Lazy\*Grid (e.g. a `columns:` or `rows:` arguments)
  - The other direction can grow and shrink as more views are added.
  - Also does not take all the space offered to it if it doesn't need it all.

- `Grid`
  - Allocates space to its views in a "spreadsheet" or "table" sort of arrangement.
  - Each row is contained in another container view called a `GridRow`
  - Manages alignment options across columns and rows using modifiers (e.g. `.grid*()`)

- `ScrollView`
  - ScrollView takes all the space offered to it.

- `ViewThatFits`
  - Takes a list of container views (e.g. an `HStack` and a `VStack`) and chooses the one that fits best. This is great when laying out for landscape vs portrait.
  - Or when laying out with dynamic type sizes

- `Form` & `List` & `OutlineGroup`
  - These are sort of like "really smart VStacks" (scrolling, selection, hierarchy etc...)
  - These are like pre built views that make things look nice and generic and places things in the right place.

- `DisclosureGroup`
  - This allows you to expose other views e.g. a folder structure if you press on a folder it will then go down into that folder and disclose it.

- `ZStack`
  - ZStack sizes itself to fit its children.
  - It stacks everything ontop of each other

### Data flow

- Data In:
  - Data that comes in and drives our view and is **read-only** by us.
  - These are things like `lets` that have no value. E.g. someone has to pass value to the `let` seeing it has no value.
  - Or could be a `var` that has a default value but is not private.

- Data owned by me: These are things like `@State`. Modifiable data the view itself owns (i.e. the source of truth for)
  - The most comon form of view data ownership.
  - e.g. selection / sorting option / search string / alert presentation / UI config

- Data I/O: Data that comes in from outside but which we might modify.
- Data out function: A function which delivers `data out` of the view.
- Data in function: a function the view might call to pull data into itself.
- `.environment` view modifier. This allows us to think about the environment of and access values of the device. E.g.

```swift
MatchMarkers(matches: [.exact, ...])
    .environment(\.colorScheme, .dark)
```

- Data shared between two views
  - `@Binding`: An `@Binding` is like an `@State` except that the source of truth lives elsewhere.
  - Binding is only for read AND write
  - You can create bindings to constants with `constants`
  - Another way is `@Observable` - This is like binding but for classes.

```swift
struct ViewA: View {
    @State private var myData: Int = 42 // the source of truth for myData

    var body: some View {
        ViewB(foo: $myData) // $myData means "a binding to myData"
    }
}

struct ViewB: View {
    @Binding var foo: Int
    // can get and set the value of myData by using foo
}
```
