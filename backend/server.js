const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

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

app.get('/api/scrape-users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const url = `https://ycta.yangoncity.net/test/?ihcUserList_p=${page}`;
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const scraped = [];
    $('ul li').each((_, li) => {
      const lines = $(li)
        .text()
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
      const [shortCode, email, name, address] = lines;
      scraped.push({ shortCode, email, name, address });
    });
    res.json({ page, users: scraped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
