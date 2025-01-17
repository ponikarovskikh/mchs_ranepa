// logger.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mchs.db');

/**
 * Функция для сохранения сообщения в системных логах
 * @param {string} level - Уровень лога (например, 'INFO', 'ERROR')
 * @param {string} message - Сообщение для сохранения
 */
function logMessage(level, message) {
  const query = `INSERT INTO system_logs (timestamp, level, message) VALUES (?, ?, ?)`;
  const timestamp = new Date().toISOString();

  db.run(query, [timestamp, level, message], (err) => {
    if (err) {
      console.error('Ошибка записи лога:', err.message);
    }
  });
}

// Экспорт функции
module.exports = logMessage;
