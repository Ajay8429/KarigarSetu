# KarigarSetu Security Specification (Payload-First TDD)

## 1. Data Invariants
1. **UserProfile (`/users/{userId}`)**:
   - Contains user PII (`email`). Readable ONLY by the owning verified user (`request.auth.uid == userId`) or Store Admin (`isAdmin()`).
   - `uid` must match `request.auth.uid` on create and remain immutable.
   - `wishlist` is strictly bounded (`wishlist.size() <= 50`) and cannot contain arbitrary oversized objects.
   - No self-assigned admin or role fields are allowed in `/users/{userId}`.
2. **Booking (`/bookings/{bookingId}`)**:
   - Contains customer PII (`phone`, `address`, `pincode`). Readable (`get` and `list`) ONLY where `resource.data.userId == request.auth.uid` or `isAdmin()`.
   - On creation, `userId` must equal `request.auth.uid`, `status` must equal `'New'`, `createdAt == request.time`, `updatedAt == request.time`, `pincode` must match `^[0-9]{6}$`, and `quantity` must be between `1` and `20`.
   - Owners can only cancel (`status == 'Cancelled'`) when current `status` is `'New'` or `'Confirmed'` and cannot tamper with `unitPrice`, `totalAmount`, `userId`, or `createdAt`.
   - Terminal states (`Delivered`, `Cancelled`) are locked against customer modifications; only Store Admin can update status transitions.
3. **Review (`/reviews/{reviewId}`)**:
   - Publicly readable product feedback (stores NO email, phone, or address).
   - Creation requires verified authentication (`email_verified == true`), `userId == request.auth.uid`, `rating` integer between `1` and `5`, and server timestamp `createdAt == request.time`.
   - Deletion allowed only by the original author or Store Admin.

## 2. Adversarial "Dirty Dozen" Payloads
1. **Identity Spoofing on Booking Create**: `{ userId: "victim-uid", ... }` -> `PERMISSION_DENIED` (`incoming().userId == request.auth.uid` fails).
2. **Privilege Escalation on User Profile**: `{ uid: auth.uid, isAdmin: true, role: "admin", ... }` -> `PERMISSION_DENIED` (`hasOnly` rejects shadow field).
3. **Email Spoofing Admin Bypass**: Token `{ email: "ajaymaurya44368@gmail.com", email_verified: false }` reading `/bookings` -> `PERMISSION_DENIED` (`email_verified == true` check blocks spoofed unverified emails).
4. **PII Blanket Read on `/users`**: Authenticated non-admin calls `list` on `/users` -> `PERMISSION_DENIED`.
5. **PII Cross-User Read on `/bookings`**: User B calls `get` on User A's booking -> `PERMISSION_DENIED`.
6. **Price Tampering Update by Customer**: Customer updates `{ totalAmount: 1, updatedAt: serverTimestamp() }` on own booking -> `PERMISSION_DENIED` (`affectedKeys().hasOnly(['status', 'updatedAt'])` fails).
7. **State Shortcutting by Customer**: Customer sets `{ status: "Delivered" }` directly -> `PERMISSION_DENIED` (customer only allowed transition to `'Cancelled'`).
8. **Terminal State Mutation**: Customer tries to reopen a `'Cancelled'` booking -> `PERMISSION_DENIED` (`existing().status in ['New', 'Confirmed']` fails).
9. **Resource Exhaustion / ID Poisoning**: Document ID of 500 characters or invalid characters `bad/../../id` -> `PERMISSION_DENIED` (`isValidId()` fails).
10. **Unbounded Wishlist Array**: User writes 100 items to `wishlist` -> `PERMISSION_DENIED` (`wishlist.size() <= 50` fails).
11. **Client Timestamp Forgery**: Payload with backdated `createdAt: "2020-01-01T00:00:00Z"` -> `PERMISSION_DENIED` (`createdAt == request.time` fails).
12. **Fake 99-Star Review Injection**: Review payload with `{ rating: 99, comment: "..." }` -> `PERMISSION_DENIED` (`rating >= 1 && rating <= 5` fails).
