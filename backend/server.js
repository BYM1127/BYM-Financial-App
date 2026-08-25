require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const transactionRoutes = require('./src/routes/transactions');
const insightRoutes = require('./src/routes/insights');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FlowSpend API is running' });
});

app.use('/api/transactions', transactionRoutes);
app.use('/api/insights', insightRoutes);

// Start Server (only if not running in Vercel serverless environment)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
