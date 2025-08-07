require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const pool = require('./config/db');

const app = express();

// ✅ Updated CORS configuration to allow both local and deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://task-tracker-project-vzv50nm1x-selmans-projects-b2c3037d.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow cookies to be sent
}));

app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/api/tasks', taskRoutes); // Task-related routes
app.use('/api/auth', authRoutes); // Authentication routes

// Health check endpoint
app.get('/', (req, res) => {
  res.send('TaskTracker API is live.');
});

// Database connection and server startup
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected successfully');
    conn.release(); // Release the connection back to the pool
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 Base URL: http://localhost:${PORT}`);
      console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to MySQL:', err.message);
    process.exit(1);
  });

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});
