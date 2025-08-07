-- SQL to create the tasks table for MySQL
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE
);


-- Add user_id foreign key to tasks table
ALTER TABLE tasks ADD COLUMN user_id INT;
ALTER TABLE tasks ADD CONSTRAINT fk_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  