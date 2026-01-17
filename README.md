# React Query: Server State Management in React

## 1. Creating Queries and Loading Error States
React Query (TanStack Query) is a powerful library for managing server state in React applications.

### 1.1. Difference between Client State and Server state
- Client State : information relevant(specific) to browser session.
  - Example: user's chosen language or theme
- Server State : information stored on server but needed to display in client
  - Example: blog post data form the database

### 1.2. What problems does React Query solve?

#### a. **Intelligent Caching System**
- Maintains cache of server data on the client side
- Automatically serves cached data while fetching fresh data in background
- Example: In my blog app, when navigating between pages, previously loaded posts are instantly available

#### b. **Cache Invalidation & Synchronization**
- **Imperatively**: Manually invalidate data using `queryClient.invalidateQueries()`
- **Declaratively**: Auto-refresh on window focus, network reconnection, or custom intervals
- Example: My blog posts refresh when you switch browser tabs and come back

#### c. **Built-in Loading & Error States**
- Provides `isLoading`, `isError`, `error` states for every query
- No need to manually manage loading spinners or error handling
- Example: my Posts component shows "Loading..." automatically

#### d. **Advanced Data Fetching Patterns**
- **Pagination**: Easy page-by-page data loading with `useQuery`
- **Infinite Scroll**: `useInfiniteQuery` for endless data loading
- **Prefetching**: Load next page data before user requests it
- Example: My SWAPI infinite scroll loads Star Wars characters seamlessly

#### e. **Request Deduplication**
- Multiple components requesting same data = only one network request
- Queries identified by unique keys (e.g., `["posts", pageNumber]`)
- Example: If 3 components need the same blog post, only 1 API call is made

#### f. **Mutation Management**
- Handle POST/PUT/DELETE operations with `useMutation`
- Automatic cache updates after successful mutations
- Example: Deleting a blog post updates the UI immediately

#### g. **Automatic Retry Logic**
- Failed requests automatically retry with exponential backoff
- Configurable retry attempts and conditions
- Reduces manual error handling code

#### h. **Lifecycle Callbacks**
- `onSuccess`, `onError`, `onSettled` callbacks for custom actions
- Perfect for showing toast notifications or logging
- Example: Show success message after updating a post

For SSR, see `https://tanstack.com/query/latest/docs/framework/react/guides/ssr`

### 1.3. General steps for adding React Query to my project

#### Step 1: Install the library
```bash
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools  # Optional but recommended
```
**What this does**: Installs the core React Query library and the devtools for debugging queries in development.

#### Step 2: Create QueryClient
```jsx
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
```
**What this does**: Creates a client that manages all queries and their cache. This is the "brain" that handles caching, background updates, and query coordination.

#### Step 3: Wrap app with QueryClientProvider
```jsx
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {/* Your app components */}
      </div>
      <ReactQueryDevtools />  {/* Development only */}
    </QueryClientProvider>
  );
}
```
**What this does**: Makes the QueryClient available to all child components via React Context. Any component inside this provider can now use React Query hooks.

#### Step 4: Use the useQuery hook
```jsx
import { useQuery } from "@tanstack/react-query";

function Posts() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```
**What this does**: 
- `queryKey`: Unique identifier for this query (used for caching)
- `queryFn`: Function that fetches the data from your API
- Returns loading states, error states, and the actual data
- Automatically handles caching, background refetching, and error retry

### isFetching vs isLoading
- `isFetching` : the async query function hasn't yet resolved
- `isLoading` : the query is in the loading state for the first time (no cached data yet), plus `isFetching`

### React Query Dev Tools
`https://tanstack.com/query/latest/docs/framework/react/devtools`
- Shows queries (by key)
  - status of queries
  - last updated timestamp
- Data explorer
- Query explorer

### 1.4. Understanding Stale Data

* **Default Behavior:** By default, React Query considers data "stale" (outdated) immediately after it is successfully fetched.
* **What is Stale Data?**
    * It is data that is **potentially expired** and marked as ready to be refetched.
    * **Crucial Concept:** The data remains in the cache. React Query uses the **"Stale-while-revalidate"** strategy: it serves the stale data from the cache immediately while fetching fresh data in the background.
* **Refetch Triggers:** Data refetching is only triggered for stale data. Common triggers include:
    * Component remounting.
    * Window refocusing (e.g., coming back to the browser tab).
    * Network reconnection.
* **`staleTime` vs. Max Age:** Think of `staleTime` as the **"maximum age"** of the data. As long as the data is younger than the `staleTime`, it is considered "Fresh" and no background refetching will occur.
* **Trade-off:** Using `staleTime` allows the application to tolerate data potentially being slightly out of date in exchange for better performance and fewer network requests.

### 1.5. Key Concepts: staleTime vs gcTime

#### Why is the default staleTime set to 0?
React Query prioritizes data integrity. By setting staleTime to 0, it ensures that every time a component mounts or you refocus the window, it checks the server for updates. It chooses to be "correct" rather than "fast" by default, leaving it to the developer to decide when data can safely stay old.

#### staleTime vs gcTime (Garbage Collection)

| Feature | staleTime | gcTime (formerly cacheTime) |
|---------|-----------|-----------------------------|
| **Purpose** | Defines how long data remains Fresh. | Defines how long inactive data stays in Memory. |
| **Action** | Triggers a background refetch when data is "Stale". | Deletes the data from the cache completely. |
| **User Experience** | Prevents unnecessary network requests. | Provides "backup" data to show during the next fetch. |
| **Default Value** | 0 seconds | 5 minutes |

#### Detailed Breakdown:

**staleTime (The "Revalidation" Clock):**
- Determines when data needs to be refetched.
- As long as data is "Fresh" (within staleTime), it will never trigger a network request.
- Think of it as the "Max Age" of your data.

**gcTime (The "Cold Storage" Clock):**
- Determines how long data stays in the cache after a component unmounts (is no longer visible on screen).
- When there is no active useQuery using that specific key, the data goes into "cold storage."
- The gcTime clock starts the moment the last observer (component) leaves.
- Once gcTime elapses, the data is Garbage Collected (deleted) to free up browser memory.

**Important Note:** The cache contains "backup data." If you return to a page before gcTime expires, React Query will show you the old cached data immediately while it fetches new data in the background (if the data is stale).