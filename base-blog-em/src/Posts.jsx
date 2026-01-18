import { useState } from "react";
import { useQuery } from "@tanstack/react-query"  

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  // const data = [];
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 1000 * 60 * 5,
  });

  if ( isLoading) { 
    return <div>Loading posts...</div>;
  }

  if ( isError) {
    return (
      <>
         <h3> Error fetching posts</h3>
         <p>{error.toString()}</p>;
      </>
    )
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button 
          disabled={currentPage <= 1} 
          onClick={() => {setCurrentPage(previousValue => previousValue - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button 
          disabled={currentPage >= maxPostPage} 
          onClick={() => {
            setCurrentPage(previousValue => previousValue + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
