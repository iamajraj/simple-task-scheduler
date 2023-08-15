const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const db = new sqlite3.Database('tasks.db', (err) => {
  if (err) {
    console.error('Database error:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY,
                time TEXT,
                description TEXT,
                alarm BOOLEAN
            )
        `);
  }
});

app.post('/addTask', (req, res) => {
  const { time, description, alarm } = req.body;

  console.log(time, description, alarm);
  db.run(
    'INSERT INTO tasks (time, description, alarm) VALUES (?, ?, ?)',
    [time, description, alarm],
    (err) => {
      if (err) {
        console.error('Database insertion error:', err.message);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Task added to the database.');
        res.status(200).send('Task added successfully');
      }
    }
  );
});

app.delete('/deleteTask/:id', (req, res) => {
  const taskId = req.params.id;
  db.run('DELETE FROM tasks WHERE id = ?', [taskId], (err) => {
    if (err) {
      console.error('Database deletion error:', err.message);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Task deleted from the database.');
      res.status(200).send('Task deleted successfully');
    }
  });
});

app.get('/getTasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY id DESC', (err, rows) => {
    if (err) {
      console.error('Database retrieval error:', err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
