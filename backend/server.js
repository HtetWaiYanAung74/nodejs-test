import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';
import crypto from 'crypto';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolving dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// app.use(express.static(path.join(__dirname, '/frontend/.next')));

// app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/frontend/.next/index.html')));

const PORT = process.env.PORT || 4000;

const users = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

// Helper to generate a Gravatar URL for a given email
function gravatarUrl(email) {
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}

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
      // Try to extract an <img> src, otherwise fall back to Gravatar
      const imgTag = $(li).find('img').attr('src');
      const image = imgTag ? imgTag : gravatarUrl(email);
      scraped.push({ image, shortCode, email, name, address });
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
