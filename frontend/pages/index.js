import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  // Add style objects for container, table, and pagination
  const containerStyle = { padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
  const thStyle = { borderBottom: '2px solid #ddd', textAlign: 'left', padding: '0.75rem' };
  const tdStyle = { borderBottom: '1px solid #eee', padding: '0.75rem' };
  const paginationContainerStyle = { display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' };
  const paginationButtonStyle = { padding: '0.5rem 1rem', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' };
  const activePageStyle = { backgroundColor: '#0070f3', color: '#fff', borderColor: '#0070f3' };

  useEffect(() => {
    axios.get(`http://localhost:4000/api/scrape-users?page=${page}`)
      .then((res) => {
        setUsers(res.data.users);
      });
  }, [page]);

  // Replace the existing list with a styled table and enhanced pagination
  return (
    <div style={containerStyle}>
      <h1>User List</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ShortCode</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={idx}>
              <td style={tdStyle}>{u.shortCode}</td>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.name}</td>
              <td style={tdStyle}>{u.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
