const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;

const users = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

app.get('/api/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedUsers = users.slice(start, end);

  res.json({
    page,
    totalPages: Math.ceil(users.length / limit),
    users: paginatedUsers,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
