# Task Tracker Backend

A Node.js/Express backend for managing tasks, using MySQL for data storage. Designed for easy integration with a frontend task tracker app.

## Features
- Add, update, delete, and fetch tasks
- Mark tasks as completed or pending
- MySQL database support
- RESTful API endpoints
- Environment variable support via `.env`

## Project Structure
```
backend/
├── src/
│   ├── config/         # DB config
│   ├── controllers/    # Request/response logic
│   ├── models/         # SQL table definition
│   ├── routes/         # Route definitions
│   ├── middlewares/    # (optional, for custom middleware)
│   └── server.js       # Entry point
├── .env                # Environment variables (not committed)
├── .gitignore          # Files/folders to ignore in git
├── package.json        # Dependencies and scripts
└── README.md           # Project info
```

## Setup (Local)
1. Install dependencies:
   ```
   npm install
   ```
2. Create a MySQL database (e.g., `tasktracker`) and run the SQL in `src/models/Task.sql` to create the `tasks` table.
3. Copy `.env.example` to `.env` and fill in your DB credentials (or create `.env` manually):
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=tasktracker
   PORT=5000
   ```
4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a single task by ID
- `POST /tasks` - Add a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Deployment
- Use a cloud MySQL provider for production (e.g., PlanetScale, Railway)
- Set environment variables in your deployment platform (do not commit `.env`)
- Deploy to Render, Railway, or similar

## License
MIT
