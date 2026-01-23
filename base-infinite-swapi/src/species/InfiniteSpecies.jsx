import { useInfiniteQuery } from "@tanstack/react-query";
import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ["sw-species"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next || undefined;
    },
    initialPageParam: initialUrl,
  });

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (isError) {
    return <div>Error! {error.toString()}</div>;
  }

  return (
    <div>
      {isFetching && <div className="loading">Loading...</div>}
      
      {data.pages.map((pageData, pageIndex) => (
        <div key={pageIndex}>
          {pageData.results.map((species) => (
            <Species
              key={species.name}
              name={species.name}
              language={species.language}
              averageLifespan={species.average_lifespan}
            />
          ))}
        </div>
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetching}
          style={{
            padding: '1rem 2rem',
            margin: '2rem auto',
            display: 'block',
            fontSize: '1rem',
            cursor: isFetching ? 'not-allowed' : 'pointer',
            backgroundColor: isFetching ? '#ccc' : '#daa520',
            border: 'none',
            borderRadius: '4px',
            color: '#000',
            fontWeight: 'bold',
          }}
        >
          {isFetching ? 'Loading...' : 'Load More Species'}
        </button>
      )}
    </div>
  );
}
