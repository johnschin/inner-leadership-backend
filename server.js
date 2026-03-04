const express = require('express');
const cors = require('cors');

const app = express();

// Explicitly allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));

app.post('/chat', async (req, res) => {
  try {
    console.log('Received request:', JSON.stringify(req.body).substring(0, 100));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
       'x-api-key': process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: req.body.system,
        messages: req.body.messages
      })
    });

    const data = await response.json();
    console.log('Anthropic response status:', response.status);
    res.json(data);

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: { message: error.message } });
  }
});

app.get('/', (req, res) => {
  res.send('Guide to Self backend is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
