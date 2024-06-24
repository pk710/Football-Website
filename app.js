const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
const port = 3000;

dotenv.config();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/key', (req, res) => {
  res.json({ apiKey: process.env.API_KEY });
});

app.use(function(req, res) {
  res.status(400);
  return res.send(`404 Error: Resource not found`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
