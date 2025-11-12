const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const goalRoutes = require('./routes/goalRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'SmartFin backend running successfully',
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong', time: new Date().toISOString() });
});


const errorHandler = require('./middleware/error');
app.use(errorHandler);

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB Connected Successfully');
    } else {
      console.warn('No MONGO_URI found in .env. Skipping database connection.');
    }
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
})();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});
