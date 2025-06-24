// index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/hume-text', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post(
      'https://api.hume.ai/v0/endpoint', // Replace with the actual Hume endpoint
      { input: message },
      {
        headers: {
          'X-Hume-Api-Key': process.env.HUME_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Hume API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Hume API response' });
  }
});

app.listen(5000, () => console.log('✅ Local API running on http://localhost:5000/api/hume-text'));
