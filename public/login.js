document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // Предотвращаем стандартное поведение формы

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  console.log(`[INFO] Попытка авторизации пользователя: ${username}`);

  try {
      // Отправляем запрос на сервер для авторизации
      const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
      });

      const result = await response.json();
      
      if (response.ok) {
    console.log(`[SUCCESS] Пользователь ${username} успешно авторизован. Роль: ${result.role}`);

    // Проверяем роль и перенаправляем
    if (result.role === 'admin') {
        console.log(`[INFO] Перенаправление пользователя ${username} на admin.html`);
        window.location.href = 'admin.html'; // Перенаправление на админпанель
    } else if (result.role === 'user') {
        console.log(`[INFO] Перенаправление пользователя ${username} на main.html`);
        window.location.href = 'main.html'; // Перенаправление на главную страницу
    } else {
        console.warn('[WARNING] Роль пользователя не определена!');
    }
} else {
    console.warn(`[WARNING] Ошибка авторизации: ${result.message || 'Неправильный логин или пароль'}`);
    showError(result.message || 'Неправильный логин или пароль');
}

  } catch (err) {
      console.error('[ERROR] Ошибка подключения к серверу:', err);
      showError('Ошибка подключения к серверу');
  }
});

function showError(message) {
  console.warn(`[INFO] Отображение сообщения об ошибке: ${message}`);
  let errorElement = document.querySelector('.error-message');
  if (!errorElement) {
      errorElement = document.createElement('p');
      errorElement.classList.add('error-message');
      document.querySelector('.login-container').appendChild(errorElement);
  }
  errorElement.textContent = message;
  errorElement.style.color = 'red';
}
