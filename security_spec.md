# Phase 0: Payload-First Security TDD

This specification outlines the data invariants and high-risk payloads designed to test our application's Zero-Trust Firestore Security.

## 1. Data Invariants

1. **Ownership Invariant**: A task can only be created, read, updated, or deleted by its owner. The `userId` property must match the active authenticated user's `uid` exactly.
2. **Immutability Invariant**: The `userId` and `createdAt` fields of a task are immutable and can never be altered after creation.
3. **Verified Authentication Invariant**: Standard write operations must are only permitted for users with verified authentication (`request.auth.token.email_verified == true`).
4. **State Transition Invariant**: The task's `status` must strictly be one of `backlog`, `todo`, `in_progress`, or `completed`.
5. **Priority Integrity Invariant**: The task's `priority` must strictly be one of `low`, `medium`, or `high`.
6. **Creation Temporal Invariant**: The `createdAt` timestamp must match the server timestamp (`request.time`) exactly on creation.
7. **Update Temporal Invariant**: The `updatedAt` timestamp must match the server timestamp (`request.time`) exactly on updates.
8. **Title Boundary Guard**: `title` must be a string of size `1` to `100` characters.
9. **Description Boundary Guard**: `description` must are either empty or a string of size up to `2048` characters.
10. **Tags List Guard**: `tags` must be a list with a length of at most `10`, with each item being a string of size up to `30` characters.
11. **Path Variable Hardening**: Document IDs for tasks must have valid standard alphanumeric/dash/underscore identifiers ≤ 128 characters.
12. **Anti-Update-Gap Key Guard**: Shadow fields (un-inventoried properties) must are blocked on creation and update.

---

## 2. The "Dirty Dozen" Payloads

Here are twelve payloads designed to violate our safety, integrity, and temporal rules:

### Payload 1: Spoofed User ID (Create)
Attempting to create another user's task.
```json
{
  "title": "Malicious Task",
  "description": "Bypassing owner UID check",
  "status": "todo",
  "priority": "medium",
  "userId": "SOME_OTHER_USER_UID",
  "createdAt": "SERVER_TIMESTAMP",
  "updatedAt": "SERVER_TIMESTAMP",
  "tags": []
}
```

### Payload 2: Unauthenticated Create
Creating a task with no authenticated session.
```json
{
  "title": "Anonymous Task",
  "status": "todo",
  "priority": "low",
  "userId": "null",
  "createdAt": "SERVER_TIMESTAMP"
}
```

### Payload 3: Immutable User ID Update
Attempting to transfer task ownership after creation.
```json
{
  "userId": "VICTIM_UID"
}
```

### Payload 4: Immutable CreatedAt Update
Attempting to alter the historical creation date of a task.
```json
{
  "createdAt": "2020-01-01T00:00:00Z"
}
```

### Payload 5: Invalid Status Type
Enforcing an arbitrary, unsupported status.
```json
{
  "status": "done_and_approved"
}
```

### Payload 6: Invalid Priority Type
Enforcing an arbitrary, unsupported priority.
```json
{
  "priority": "critical_emergency_99"
}
```

### Payload 7: Client-Controlled CreatedAt Timestamp
A draft task specifying a custom historical create date.
```json
{
  "title": "Old Task",
  "status": "todo",
  "priority": "medium",
  "userId": "CURRENT_USER_UID",
  "createdAt": "2000-01-01T12:00:00Z",
  "updatedAt": "SERVER_TIMESTAMP"
}
```

### Payload 8: Title Overflow
A task with a bloated title string designed to trigger resource exhaustion.
```json
{
  "title": "A".repeat(1000),
  "status": "todo",
  "priority": "medium",
  "userId": "CURRENT_USER_UID"
}
```

### Payload 9: Tags List Size Poisoning
A task containing a massive, exhausting list of tags.
```json
{
  "tags": ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12"]
}
```

### Payload 10: Shadow Field Injection
Injecting custom privilege or administrative parameters.
```json
{
  "title": "Sneaky Task",
  "userId": "CURRENT_USER_UID",
  "status": "todo",
  "priority": "medium",
  "createdAt": "SERVER_TIMESTAMP",
  "updatedAt": "SERVER_TIMESTAMP",
  "isAdmin": true,
  "dangerousGhostField": "malicious_payload"
}
```

### Payload 11: Path Variable ID Poisoning
Creating a task using a pathological document identifier to break sub-queries.
```
Path: /tasks/../../../root_vulnerability_location
```

### Payload 12: Read Bypass/Query Scraping
Attempting to list or read tasks without matching `userId == auth.uid`.

---

## 3. Test Runner Mock Definition

The security tests will assert that each of these configurations fails under `firestore.rules`.
All mock runs in `firestore.rules.test.ts` should enforce rejection under any of these terms.
