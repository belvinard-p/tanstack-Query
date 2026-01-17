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
thank