export function Home({ onNavigate }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      gap: '2rem',
    }}>
      <h2 style={{ color: '#daa520', fontSize: '2rem' }}>
        Choose Your Infinite Scroll Demo
      </h2>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => onNavigate('people')}
          style={{
            padding: '2rem 3rem',
            fontSize: '1.2rem',
            backgroundColor: '#daa520',
            border: '2px solid #b8860b',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#000',
            fontWeight: 'bold',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <div>👥 People</div>
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'normal' }}>
            With react-infinite-scroller
          </div>
        </button>

        <button
          onClick={() => onNavigate('species')}
          style={{
            padding: '2rem 3rem',
            fontSize: '1.2rem',
            backgroundColor: '#daa520',
            border: '2px solid #b8860b',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#000',
            fontWeight: 'bold',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <div>🦎 Species</div>
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'normal' }}>
            Manual "Load More" button
          </div>
        </button>

        <button
          onClick={() => onNavigate('bidirectional')}
          style={{
            padding: '2rem 3rem',
            fontSize: '1.2rem',
            backgroundColor: '#daa520',
            border: '2px solid #b8860b',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#000',
            fontWeight: 'bold',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <div>🚀 Starships</div>
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'normal' }}>
            Bi-directional scroll (⬆️⬇️)
          </div>
        </button>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'rgba(218, 165, 32, 0.1)',
        borderRadius: '8px',
        maxWidth: '700px',
        textAlign: 'center',
      }}>
        <h3 style={{ color: '#daa520', marginBottom: '1rem' }}>Learn the Difference</h3>
        <p style={{ lineHeight: '1.6' }}>
          <strong>People:</strong> Automatic scroll detection using external library<br/>
          <strong>Species:</strong> Manual implementation without external dependencies<br/>
          <strong>Starships:</strong> Bi-directional scroll - load both previous and next pages
        </p>
      </div>
    </div>
  );
}
