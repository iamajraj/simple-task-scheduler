const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('tasks.db', (err) => {
  if (err) {
    console.error('Database error:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

function getAllTasks() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM tasks ORDER BY id DESC', (err, rows) => {
      if (err) {
        console.error('Database retrieval error:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function printAllTasks() {
  try {
    const tasks = await getAllTasks();
    tasks.forEach((task) => {
      console.log(
        `ID: ${task.id}, Time: ${task.time}, Description: ${task.description}, Alarm: ${task.alarm}`
      );
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    db.close();
  }
}

printAllTasks();
