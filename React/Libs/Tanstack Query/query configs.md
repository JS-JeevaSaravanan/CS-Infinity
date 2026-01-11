

In **React Query (TanStack Query)**, the `enabled` flag is a configuration option that controls **whether a query should automatically run (fetch data)** or not.

---

### 💡 Basic idea:

If `enabled` is set to `false`, the query **will not run automatically** when the component mounts or when its dependencies change.  
If it’s `true`, React Query **will execute the query automatically** as usual.

---

### 🧩 Example:

```tsx
import { useQuery } from '@tanstack/react-query'

function User({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
    enabled: !!userId, // ✅ only run if userId is truthy
  })

  if (!userId) return <p>Please select a user</p>
  if (isLoading) return <p>Loading...</p>

  return <div>{data.name}</div>
}
```

In this example:

- The query will **not** run until `userId` becomes a truthy value (e.g., not `null` or `undefined`).
    
- Once `userId` exists, React Query will automatically fetch the user data.
    

---

### 🔍 Why use `enabled`?

You use `enabled` when:

- The query depends on **some condition or variable** that may not be available yet (like an ID from route params, auth token, or user input).
    
- You want to **manually trigger** a query later using `refetch()` instead of having it run on mount.
    

---

### 🧠 Bonus tip:

You can pair `enabled: false` with `refetch()`:

```tsx
const query = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  enabled: false, // don't fetch automatically
})

// Later:
query.refetch()
```

This gives you **manual control** over when to fetch data.

---

**In short:**  
`enabled` controls **whether a query runs automatically** — setting it to `false` prevents automatic execution until you manually trigger it or set it to `true`.

