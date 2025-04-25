import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get(`https://your-backend-url.onrender.com/api/users?page=${page}`)
      .then((res) => {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      });
  }, [page]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>User List</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} - {u.email}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1rem' }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} style={{ margin: '0 5px' }}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
