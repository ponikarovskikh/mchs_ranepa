  // Подключаем логирование

// Загрузка пользователей при загрузке страницы
function loadUsers() {
  fetch('/api/users')
    .then(response => response.json())
    .then(data => {
      const userList = document.getElementById("user-list");
      userList.innerHTML = ''; // Очищаем таблицу перед добавлением новых строк

      // Добавляем каждого пользователя в таблицу
      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.id}</td>
          <td>${row.username}</td>
          <td>
            <input type="checkbox" class="role-checkbox" ${row.role === 'admin' ? 'checked' : ''} onclick="toggleRole(${row.id}, this)">
          </td>
          <td>
            <button class="delete-btn" onclick="deleteUser(${row.id})">Удалить</button>
          </td>
        `;
        userList.appendChild(tr);
      });

      // Логирование загрузки пользователей
      logMessage('INFO', 'Пользователи успешно загружены');
    })
    .catch(err => {
      console.error("Ошибка загрузки пользователей:", err);
      logMessage('ERROR', `Ошибка загрузки пользователей: ${err.message}`);
    });
}

document.getElementById('logoutButton').addEventListener('click', function () {
  // Отправляем запрос на сервер для завершения сессии
  fetch('/api/logout', { method: 'POST' })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка завершения сессии на сервере');
      }
      // Логируем успешный выход
      logMessage('INFO', 'Пользователь вышел из системы');
      // Удаляем данные пользователя из localStorage
      localStorage.removeItem('user');
      // Перенаправляем на страницу логина
      window.location.href = 'login.html';
    })
    .catch((error) => {
      console.error('Ошибка при завершении сессии:', error);
      alert('Ошибка при завершении сессии.');
      logMessage('ERROR', `Ошибка при завершении сессии: ${error.message}`);
    });
});

// Добавление пользователя
function addUser(username, password, role) {
  fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password, role })
  })
  .then(response => response.json())
  .then(data => {
    loadUsers();  // Перезагружаем список пользователей
    closeAddUserModal();
    // Логируем добавление нового пользователя
    logMessage('INFO', `Пользователь ${username} добавлен`);
  })
  .catch(err => {
    console.error("Ошибка добавления пользователя:", err);
    logMessage('ERROR', `Ошибка добавления пользователя ${username}: ${err.message}`);
  });
}

// Удаление пользователя
function deleteUser(userId) {
  fetch(`/api/users/${userId}`, {
    method: 'DELETE'
  })
  .then(() => {
    loadUsers(); // Обновляем список
    // Логируем удаление пользователя
    logMessage('INFO', `Пользователь с ID ${userId} удален`);
  })
  .catch(err => {
    console.error("Ошибка при удалении пользователя:", err);
    logMessage('ERROR', `Ошибка при удалении пользователя с ID ${userId}: ${err.message}`);
  });
}

// Изменение роли пользователя
function toggleRole(userId, checkbox) {
  const newRole = checkbox.checked ? 'admin' : 'user';
  fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: newRole })
  })
  .then(() => {
    // Логируем изменение роли
    logMessage('INFO', `Роль пользователя с ID ${userId} изменена на ${newRole}`);
  })
  .catch(err => {
    console.error("Ошибка при обновлении роли:", err);
    logMessage('ERROR', `Ошибка при обновлении роли пользователя с ID ${userId}: ${err.message}`);
  });
}

// Функция для отображения модального окна
function showAddUserModal() {
  document.getElementById("user-modal").style.display = "block";
}

// Функция для закрытия модального окна
function closeAddUserModal() {
  document.getElementById("user-modal").style.display = "none";
}

// Обработчик отправки формы добавления пользователя
document.getElementById("user-form").addEventListener("submit", (event) => {
  event.preventDefault();  // Предотвращаем перезагрузку страницы
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  addUser(username, password, role);  // Добавляем пользователя
});

// Загрузка системных логов
function loadSystemLogs() {
  fetch('/api/system-logs')
    .then((response) => response.json())
    .then((logs) => {
      const logOutput = document.getElementById("log-output");
      logOutput.value = ''; // Очищаем текстовое поле перед добавлением новых логов

      logs.forEach((log) => {
        const logEntry = `[${log.timestamp}] [${log.level}] ${log.message}`;
        logOutput.value += logEntry + '\n';
      });
    })
    .catch((err) => {
      console.error("Ошибка загрузки системных логов:", err);
      logMessage('ERROR', `Ошибка загрузки системных логов: ${err.message}`);
    });
}

function loadCurrentUser() {
  fetch('/api/current-user')
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при загрузке данных пользователя');
      }
      return response.json();
    })
    .then(data => {
      const currentUserElement = document.getElementById('current-user');
      currentUserElement.innerHTML = `&nbsp;<strong>${data.username}</strong>`;  // Подставляем имя пользователя
    })
    .catch(err => {
      console.error('Ошибка загрузки имени пользователя:', err);
      const currentUserElement = document.getElementById('current-user');
      currentUserElement.innerHTML = '&nbsp;<strong>Гость</strong>';  // Если ошибка, показываем "Гость"
      logMessage('ERROR', `Ошибка загрузки имени пользователя: ${err.message}`);
    });
}

// Обновление логов по нажатию кнопки
document.getElementById("refresh-logs").addEventListener("click", loadSystemLogs);

// Загрузка логов при загрузке страницы
window.onload = () => {
  loadUsers(); // Загрузка пользователей
  loadSystemLogs();
  loadCurrentUser(); // Загрузка логов
};
