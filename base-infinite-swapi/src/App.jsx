import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";
import { Home } from "./Home";
import { InfinitePeople } from "./people/InfinitePeople";
import { InfiniteSpecies } from "./species/InfiniteSpecies";
import { BiDirectionalScroll } from "./BiDirectionalScroll";

const queryClient = new QueryClient()

function App() {
  const [view, setView] = useState('home');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Infinite SWAPI</h1>
        
        {view !== 'home' && (
          <button
            onClick={() => setView('home')}
            style={{
              padding: '0.5rem 1rem',
              margin: '1rem',
              backgroundColor: '#daa520',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ← Back to Home
          </button>
        )}

        {view === 'home' && <Home onNavigate={setView} />}
        {view === 'people' && <InfinitePeople />}
        {view === 'species' && <InfiniteSpecies />}
        {view === 'bidirectional' && <BiDirectionalScroll />}
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
