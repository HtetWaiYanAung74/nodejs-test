import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  // Add style objects for container, table, and pagination
  const containerStyle = { padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' };
  const paginationContainerStyle = { display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' };
  const paginationButtonStyle = { padding: '0.5rem 1rem', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' };
  const activePageStyle = { backgroundColor: '#0070f3', color: '#fff', borderColor: '#0070f3' };
  // Add style objects for grid layout and cards
  const gridContainerStyle = { display: 'flex', flexWrap: 'wrap', listStyle: 'none', padding: 0, margin: 0 };
  const gridItemStyle = { width: 'calc(20% - 1px)', boxSizing: 'border-box', marginBottom: '1rem', padding: '0 0.5%' };
  const memberCardStyle = { border: '1px solid #eee', borderRadius: '4px', padding: '1rem', textAlign: 'center' };
  const memberImgStyle = { marginBottom: '0.5rem' };
  const imgStyle = { width: '100%', height: 'auto', borderRadius: '50%', objectFit: 'cover' };
  const memberNameStyle = { fontWeight: 'bold', margin: '0.5rem 0' };
  const memberEmailStyle = { margin: '0.5rem 0' };
  const extraFieldsContainerStyle = { margin: '0.5rem 0' };
  const extraFieldStyle = { marginBottom: '0.25rem' };

  useEffect(() => {
    axios.get(`https://nodejs-test-g3gk.onrender.com/api/scrape-users?page=${page}`)
      .then((res) => {
        setUsers(res.data.users);
      });
  }, [page]);

  // Replace the existing list with a styled table and enhanced pagination
  return (
    <div style={containerStyle}>
      <h1>User List</h1>
      {/* Grid of user cards */}
      <ul style={gridContainerStyle}>
        {users.map((u, idx) => (
          <li key={idx} style={gridItemStyle}>
            <div style={memberCardStyle}>
              <div style={memberImgStyle}>
                <img src={u.image} alt={u.name} style={imgStyle} />
              </div>
              <div style={memberNameStyle}>{u.shortCode}</div>
              <div style={memberEmailStyle}>
                <a href={`mailto:${u.email}`} target="_blank" rel="noopener noreferrer">{u.email}</a>
              </div>
              <div style={extraFieldsContainerStyle}>
                <div style={extraFieldStyle}>{u.name}</div>
                <div style={extraFieldStyle}>{u.address}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div style={paginationContainerStyle}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          style={paginationButtonStyle}
        >
          Previous
        </button>
        <span style={{ padding: '0.5rem 1rem' }}>Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          style={paginationButtonStyle}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
