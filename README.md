# React Query: Server State Management in React

# base-blog-em project
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

### Documentation 
`https://tanstack.com/query/latest/docs/framework/react/guides/prefetching#prefetchquery--prefetchinfinitequery`

`https://tanstack.com/query/latest/docs/framework/react/guides/mutations`

**EXtending Blog-em Ipsum**
We will focus on the concepts like `Query Keys`, `Prefetching` and `Mutations`

### Code Quiz Ftech Comments
- `/src/PostDetails.jdx`
- Run useQuery
- Account for error, loading and results
- Be sure to choose a different query? (not ["posts"])
  - React Query uses the key for cache / stale time
- query function needs postId parameter
  - () => fetchComments(post.id)
- Warning: comment won't refresh when you click on different posts
  - Might get ESLint warning / Error

### 1.6. Prefetching: anticipating user needs

Prefetching is a powerful technique to improve user experience (UX) by loading data into the cache **before** the user actually requests it. This makes the application feel instantaneous.

#### How it Works
* **Cache warming:** Data is fetched and stored in the cache manually (usually via `queryClient.prefetchQuery`).
* **Stale status:** By default, prefetched data is considered **stale** immediately. However, this is configurable using the `staleTime` option.
* **Instant display:** When a user navigates to a component that uses the prefetched query, React Query serves the data from the cache.
    * If the data is stale: It shows the cached version while re-fetching fresh data in the background.
    * If the data is fresh: It simply shows the cached version without a network request.


#### Use Cases
Prefetching is not limited to pagination. It can be used for any anticipated user interaction:
1.  **Pagination:** Loading the "Next Page" while the user is still viewing the current one.
2.  **Hover triggers:** Fetching specific item details when a user hovers over a link or list item.
3.  **Navigation:** Loading data for a dashboard tab before the user clicks on it.
4.  **Flow prediction:** In a multi-step process (like a checkout), loading data for Step 2 while the user is completing Step 1.

#### Important constraints
* **Garbage collection:** Prefetched data is subject to `gcTime`. If the user doesn't navigate to the data before the `gcTime` expires, it will be removed from memory.
* **Resource management:** Over-prefetching can lead to unnecessary network load. It is best to prefetch only the most likely next actions.

> **Official Documentation:** [TanStack Query - Prefetching Guide](https://tanstack.com/query/latest/docs/framework/react/guides/prefetching)

### 1.7. Memory Management & Garbage Collection

React Query is not just a data fetcher; it is a **memory manager**. It ensures that your application remains performant by cleaning up data that is no longer needed.

#### The "Inactive" State
When a component that uses a specific query unmounts (for example, when you navigate away from a blog post back to the home page), that query is marked as **inactive**. 

* The data is not deleted immediately.
* It stays in the cache as "backup" in case the user returns quickly.

#### The Garbage Collection (GC) Process
The `gcTime` (Garbage Collection Time) is the countdown timer for inactive data.

1.  **Trigger:** The last observer (component) of a query unmounts.
2.  **Countdown:** The `gcTime` clock starts (default is 5 minutes).
3.  **Purge:** If no new component requests this data before the timer reaches zero, the data is **purged** (deleted) from the memory.



#### Why is this important?
Without Garbage Collection, a Single Page Application (SPA) would suffer from **Memory Leaks**:
* **Performance:** The browser would slow down as the cache grows indefinitely.
* **Stale Overload:** You would be storing thousands of "unreferenced" objects that the user might never see again.

#### Summary of the Lifecycle
* **Active:** Data is being used by a visible component.
* **Inactive:** Data is in the cache but no component is using it.
* **Purged:** Data has been garbage collected after `gcTime` elapsed.

> **Key Takeaway:** `staleTime` is about **Data Freshness** (Network), while `gcTime` is about **Memory Cleanup** (Hardware).

### 1.8. The Synergy: staleTime vs gcTime

While they work together, they control different layers of the cache:

| Feature | staleTime | gcTime |
| :--- | :--- | :--- |
| **Focus** | **Network Efficiency** | **Memory Efficiency** |
| **Goal** | Avoid unnecessary API calls. | Avoid memory leaks in the browser. |
| **User Impact** | Determines if the user sees a "freshness" update. | Determines if the user sees a loading spinner on return. |

**Pro Tip:** Always keep `gcTime` equal to or longer than `staleTime`. If you delete data from the cache (`gcTime`) before it becomes stale, you lose the ability to show "backup" data while refetching.
### 1.9. Applying staleTime & gcTime to Pagination

When navigating between pages (e.g., `currentPage`), both settings play a vital role:

* **staleTime (5 min):** If I return to Page 1 within 5 minutes, React Query says: *"This is fresh, I won't even ask the server for updates."*
* **gcTime (10 min):** If I leave the blog for 7 minutes and come back, React Query says: *"The data is stale (over 5 min), BUT I still have it in my memory (under 10 min). I will show you the old data immediately while I fetch the new data in the background."*



**Key Rule:** `gcTime` should generally be **greater than or equal to** `staleTime`. If `gcTime` is shorter, your data will be deleted from memory before it even has a chance to be considered "stale but usable."

### 1.10. Definition: What is an "Unmount"?

In React, **Unmounting** occurs when a component is removed from the DOM (User Interface). 

* **Standard React State (`useState`):** All data is wiped out instantly upon unmount.
* **React Query State:** Data is preserved in the cache even after the component unmounts. 

#### Why keep data after unmount?
If a user accidentally navigates away and clicks "Back" immediately, React Query restores the data from the cache. This prevents a "flash" of a loading spinner and makes the app feel significantly faster. The `gcTime` determines exactly how long this data should stay in memory before being permanently deleted.
