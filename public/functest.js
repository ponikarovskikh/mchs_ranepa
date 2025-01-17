const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mchs.db');

// Функция для загрузки пользователей из базы данных
function loadUsers() {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log('Список пользователей:', rows); // Вывод списка пользователей в консоль
    });
}

loadUsers();


