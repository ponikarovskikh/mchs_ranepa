// Загрузка пользователей при загрузке страницы
const lgf = require('')


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
    })
    .catch(err => console.error("Ошибка загрузки пользователей:", err));
}
document.getElementById("logout").addEventListener("click", () => {
  fetch('/api/logout', { method: 'POST' }) // Отправляем запрос на сервер для завершения сессии
    .then((response) => {
      if (response.ok) {
        // Перенаправляем на страницу авторизации
        window.location.href = '/login.html';
      } else {
        console.error('Ошибка при выходе:', response.statusText);
      }
    })
    .catch(err => console.error('Ошибка при запросе выхода:', err));
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
    })
    .catch(err => console.error("Ошибка добавления пользователя:", err));
  }
  
  // Удаление пользователя
  function deleteUser(userId) {
    fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    })
    .then(() => {
      
      loadUsers(); // Обновляем список
    })
    .catch(err => console.error("Ошибка при удалении пользователя:", err));
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
      console.log('Роль обновлена');
    })
    .catch(err => console.error("Ошибка при обновлении роли:", err));
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
    .catch((err) => console.error("Ошибка загрузки системных логов:", err));
}

// Обновление логов по нажатию кнопки
document.getElementById("refresh-logs").addEventListener("click", loadSystemLogs);

// Загрузка логов при загрузке страницы
window.onload = () => {
  loadUsers(); // Загрузка пользователей
  loadSystemLogs(); // Загрузка логов
};



window.onload = () => {
  
  loadUsers(); // Загрузка пользователей
  loadSystemLogs(); // Загрузка логов
};