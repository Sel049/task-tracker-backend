require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const pool = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

// Test DB Connection
pool.getConnection()
  .then(conn => {
    console.log('MySQL connected');
    conn.release();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to MySQL:', err.message);
    process.exit(1);
  });

  app.get('/', (req, res) => {
    res.send('Hello,TaskTracker is live.');
  });