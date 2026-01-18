import { fetchComments } from "./api";
import "./PostDetail.css";
import { useQuery } from "@tanstack/react-query";

export function PostDetail({ post, deleteMutation }) {
  // replace with useQuery
  // const data = [];
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", post.id], // Query Key as Dependency Array
    queryFn: () => fetchComments(post.id),
  });

  if (isLoading) {
    return <h3>Loading comments...</h3>;
  }

  if (isError) {
    return (
      <>
        <h3> Error fetching comments</h3>
        <p>{error.toString()}</p>;
      </>
    );
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutate(post.id)}>
          Delete
        </button> 
        {deleteMutation.isPending && <p className="loading">deleting the post</p>}
        {deleteMutation.isSuccess && <p className="success">Post deleted!</p>}
        {deleteMutation.isError && (
          <p className="error">Error deleting the post: {deleteMutation.error.toString}</p>
        )}
      </div>
      <div>
        <button>Update title</button>
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
