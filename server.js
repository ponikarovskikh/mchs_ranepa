const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const logMessage = require('./logger');

const app = express();
const port = 3000;

// Подключение к базе данных
const db = new sqlite3.Database('mchs.db');

// Настроим сервер для обработки статичных файлов (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Для обработки JSON данных

// Настройка сессий

app.use(session({
  secret: 'your-secret-key',  // Ваш секретный ключ для сессии
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Для разработки, в продакшене должен быть true с HTTPS
}));






// Маршрут для отображения страницы входа
app.get('/login', (req, res) => {
  if (req.session.user) {
    // Если пользователь уже авторизован, перенаправим на главную
    return res.redirect('/main');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});




// Маршрут для выполнения логина
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  console.log(`[INFO] Авторизация: запрос от пользователя ${username}`);

  const query = 'SELECT ID, username, role FROM users WHERE username = ? AND password = ?';
  db.get(query, [username, password], (err, user) => {
      if (err) {
          console.error('[ERROR] Ошибка базы данных:', err);
          return res.status(500).json({ message: 'Ошибка базы данных' });
      }

      if (!user) {
          console.warn(`[WARNING] Неверные данные для входа пользователя ${username}`);
          return res.status(401).json({ message: 'Неверный логин или пароль' });
      }

      console.log(`[SUCCESS] Пользователь ${username} успешно найден в базе. Роль: ${user.role}`);

      // Сохраняем пользователя в сессии
      req.session.user = { id: user.ID, username: user.username, role: user.role };

      // Отправляем роль пользователя клиенту
      res.json({ role: user.role });
  });
});


app.post('/api/logout', (req, res) => {
  // Удаляем сессию
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка при завершении сессии' });
    }

    // После уничтожения сессии отправляем успешный ответ
    res.clearCookie('connect.sid');  // Удаляем куки сессии
    res.status(200).json({ message: 'Сессия завершена' });
  });
});

// Получение текущего пользователя из сессии
app.get('/api/current-user', (req, res) => {
  console.log('curr',req.session.user );
  if (req.session.user.username) {
    console.log('curre: ', req.session.user.username );
    res.json({ username: req.session.user.username,role:req.session.user.role});
    
  } else {
    res.status(401).json({ error: 'Не авторизован' });
  }
});




// Получение всех пользователей
app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.all(query, [], (err, rows) => {
      if (err) {
          console.error('[ERROR] Ошибка получения пользователей:', err);
          return res.status(500).json({ message: 'Ошибка сервера' });
      }
      res.json(rows);
  });
});

// Добавление нового пользователя
app.post('/api/users', (req, res) => {
  const { username, password, role } = req.body;
  const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
  db.run(query, [username, password, role], function (err) {
      if (err) {
          console.error('[ERROR] Ошибка добавления пользователя:', err);
          return res.status(500).json({ message: 'Ошибка добавления' });
      }
      res.status(201).json({ message: 'Пользователь добавлен', id: this.lastID });
  });
});

// Удаление пользователя
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.run(query, [id], function (err) {
      if (err) {
          console.error('[ERROR] Ошибка удаления пользователя:', err);
          return res.status(500).json({ message: 'Ошибка удаления' });
      }
      res.json({ message: 'Пользователь удален' });
  });
});

// Обновление роли пользователя
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const query = 'UPDATE users SET role = ? WHERE id = ?';
  db.run(query, [role, id], function (err) {
      if (err) {
          console.error('[ERROR] Ошибка обновления роли пользователя:', err);
          return res.status(500).json({ message: 'Ошибка обновления' });
      }
      res.json({ message: 'Роль пользователя обновлена' });
  });
});






app.post('/api/save-card', (req, res) => {
  const cardData = req.body; // Полагаем, что данные передаются через body

    const query = `
        INSERT INTO fire_cards (
    subject, code, cardNumber, burnType, fireDate, populationType, fireDepartment,
    business, ownership, legalForm, government, enterpriseType, fireObject,
    fireConditions, damage, victims, evacuation, firefighting, environmentImpact,
    cause, ignitionSource, spreadCause, firefightingResponse, prevention, inspection,
    equipment, training, responsiblePerson, organization, contact, comments, documents
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?
)
    `;
    
    const cardDataArray = [
        cardData.subject, cardData.code, cardData.cardNumber, cardData.burnType, cardData.fireDate, 
        cardData.populationType, cardData.fireDepartment, cardData.business, cardData.ownership, 
        cardData.legalForm, cardData.government, cardData.enterpriseType, cardData.fireObject, 
        cardData.fireConditions, cardData.damage, cardData.victims, cardData.evacuation, cardData.firefighting, 
        cardData.environmentImpact, cardData.cause, cardData.ignitionSource, cardData.spreadCause, 
        cardData.firefightingResponse, cardData.prevention, cardData.inspection, cardData.equipment, 
        cardData.training, cardData.responsiblePerson, cardData.organization, cardData.contact, 
        cardData.comments, cardData.documents
    ];
    db.run(query, cardDataArray, function(err) {
          if (err) {
              console.error('Ошибка при сохранении карточки:', err); // Логируем ошибку

              return res.status(500).json({ message: 'Ошибка сохранения карточки', error: err });
          }
          res.status(200).json({ message: 'Карточка успешно сохранена', id: this.lastID });
      }
  );
});
//node server.js


app.get('/api/fire-cards', (req, res) => {
  const query = 'SELECT * FROM fire_cards';
  db.all(query, [], (err, rows) => {
      if (err) {
          return res.status(500).json({ message: 'Ошибка при получении карточек', error: err });
      }
      res.status(200).json(rows);
  });
});


app.get('/api/fire-cards/:id', (req, res) => {
  const cardId = req.params.id;
  const query = 'SELECT * FROM fire_cards WHERE id = ?';
  console.log(cardId,'нука');
  db.get(query, [cardId], (err, row) => {
    if (err) {
      console.error(err.message,'checkkkkk');
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.json(row); 

     // Возвращаем данные первой найденной карточки
  });
});



app.delete('/api/fire-cards/:id', (req, res) => {
  const { id } = req.params;
  console.log('del card',id);
  db.run('DELETE FROM fire_cards WHERE id = ?', [id], function (err) {
    if (err) {
      
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Карточка не найдена' });
    }
    res.json({ message: 'Карточка удалена' });
  });
});


app.get('/api/system-logs', (req, res) => {
  try {
    // Выполнение SQL запроса для получения логов
    db.all('SELECT * FROM system_logs ORDER BY timestamp DESC', (err, rows) => {
      if (err) {
        console.error('Ошибка при получении логов из базы данных:', err);
        return res.status(500).json({ error: 'Ошибка при получении логов' });
      }

      console.log(1, rows); // Логируем данные

      // Отправка логов в формате JSON
      res.json(rows);
    });
  } catch (err) {
    console.error('Ошибка при выполнении запроса:', err);
    res.status(500).json({ error: 'Ошибка при получении логов' });
  }
});


// Маршрут для главной страницы
app.get('/main', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/api/notifications', (req, res) => {
  db.all(
    'SELECT * FROM notifications ORDER BY created_at DESC',
    [],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Ошибка получения уведомлений' });
      }
      res.json(rows);
    }
  );
});


app.post('/api/notifications', (req, res) => {
  const { message, user_id } = req.body;
  db.run(
    'INSERT INTO notifications (message, user_id) VALUES (?, ?)',
    [message, user_id],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Ошибка добавления уведомления' });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});
app.delete('/api/notifications', (req, res) => {
  console.log('fuck');
  db.run('DELETE FROM notifications', [], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Уведомления очищены' });
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
  logMessage('INFO', 'Сервер запущен на порту 3000');

});
// закончил на отображение карточек пожара в дополнительном окне хотел сейчас спросить как правильно делать запрос к БД и почему он не сохраняется в ответ