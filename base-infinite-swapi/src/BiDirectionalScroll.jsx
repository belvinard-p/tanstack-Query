import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const initialUrl = "https://swapi.dev/api/starships/?page=2"; // Start from middle
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

function Starship({ name, model, manufacturer }) {
  return (
    <div style={{
      padding: '1rem',
      margin: '0.5rem',
      backgroundColor: 'rgba(218, 165, 32, 0.1)',
      borderRadius: '4px',
      border: '1px solid #daa520',
    }}>
      <h3 style={{ color: '#daa520', margin: '0 0 0.5rem 0' }}>{name}</h3>
      <p style={{ margin: '0.25rem 0' }}>Model: {model}</p>
      <p style={{ margin: '0.25rem 0' }}>Manufacturer: {manufacturer}</p>
    </div>
  );
}

export function BiDirectionalScroll() {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  // Forward direction (scroll down)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["sw-starships-bidirectional"],
    queryFn: ({ pageParam }) => fetchUrl(pageParam),
    initialPageParam: initialUrl,
    getNextPageParam: (lastPage) => lastPage.next || undefined,
    getPreviousPageParam: (firstPage) => firstPage.previous || undefined,
  });

  // Auto-scroll on hover
  useEffect(() => {
    let scrollInterval;
    if (isScrollingUp) {
      scrollInterval = setInterval(() => {
        window.scrollBy({ top: -10, behavior: 'smooth' });
      }, 16);
    } else if (isScrollingDown) {
      scrollInterval = setInterval(() => {
        window.scrollBy({ top: 10, behavior: 'smooth' });
      }, 16);
    }
    return () => clearInterval(scrollInterval);
  }, [isScrollingUp, isScrollingDown]);

  // Intersection Observer for bottom (load next)
  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Intersection Observer for top (load previous)
  useEffect(() => {
    if (!topRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasPreviousPage && !isFetchingPreviousPage) {
          fetchPreviousPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (isError) {
    return <div>Error! {error.toString()}</div>;
  }

  return (
    <div ref={containerRef}>
      <div style={{
        padding: '1rem',
        backgroundColor: 'rgba(218, 165, 32, 0.2)',
        borderRadius: '8px',
        marginBottom: '1rem',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#daa520', margin: '0 0 0.5rem 0' }}>
          🚀 Bi-Directional Infinite Scroll
        </h2>
        <p style={{ margin: 0 }}>
          Hover over arrows to auto-scroll • Scroll <strong>UP</strong> to load previous • Scroll <strong>DOWN</strong> to load next
        </p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#daa520' }}>
          Debug: hasPrevious={String(hasPreviousPage)} | hasNext={String(hasNextPage)} | Pages loaded: {data.pages.length}
        </p>
      </div>

      {/* Floating Up Arrow - Always enabled for scrolling */}
      <button
        onMouseEnter={() => !isFetchingPreviousPage && setIsScrollingUp(true)}
        onMouseLeave={() => setIsScrollingUp(false)}
        onClick={() => window.scrollBy({ top: -300, behavior: 'smooth' })}
        aria-label="Scroll up to load previous starships"
        style={{
          position: 'fixed',
          top: 'calc(50% - 40px)',
          left: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: isScrollingUp ? '#b8860b' : '#daa520',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.3s',
          zIndex: 1000,
          border: 'none',
        }}
      >
        ⬆️
      </button>

      {/* Floating Down Arrow - Always enabled */}
      <button
        onMouseEnter={() => !isFetchingNextPage && setIsScrollingDown(true)}
        onMouseLeave={() => setIsScrollingDown(false)}
        onClick={() => window.scrollBy({ top: 300, behavior: 'smooth' })}
        aria-label="Scroll down to load next starships"
        style={{
          position: 'fixed',
          top: 'calc(50% + 40px)',
          left: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: isScrollingDown ? '#b8860b' : '#daa520',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.3s',
          zIndex: 1000,
          border: 'none',
        }}
      >
        ⬇️
      </button>

      {/* Top Loading Indicator */}
      <div ref={topRef} style={{ padding: '1rem', textAlign: 'center' }}>
        {isFetchingPreviousPage && (
          <div className="loading">⬆️ Loading previous...</div>
        )}
        {!hasPreviousPage && !isFetchingPreviousPage && (
          <div style={{ color: '#daa520' }}>⬆️ No more previous data</div>
        )}
      </div>

      {/* Data Display */}
      {data.pages.map((pageData, pageIndex) => (
        <div key={pageIndex}>
          {pageData.results.map((starship) => (
            <Starship
              key={starship.name}
              name={starship.name}
              model={starship.model}
              manufacturer={starship.manufacturer}
            />
          ))}
        </div>
      ))}

      {/* Bottom Loading Indicator */}
      <div ref={bottomRef} style={{ padding: '1rem', textAlign: 'center' }}>
        {isFetchingNextPage && (
          <div className="loading">⬇️ Loading next...</div>
        )}
        {!hasNextPage && !isFetchingNextPage && (
          <div style={{ color: '#daa520' }}>⬇️ No more next data</div>
        )}
      </div>
    </div>
  );
}
