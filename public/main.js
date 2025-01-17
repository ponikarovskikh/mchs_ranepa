document.addEventListener('DOMContentLoaded', function () {
  // Функция для отображения сообщения об ошибке
  function showError(message) {
    logMessage('error', message); // Логируем ошибку
    alert('Ошибка: ' + message);
  }

  // Функция для загрузки данных о текущем пользователе
  function loadCurrentUser() {
    fetch('/api/current-user')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при получении данных пользователя');
        }
        return response.json();
      })
      .then((data) => {
        const currentUserElement = document.getElementById('current-user');
        if (currentUserElement) {
          currentUserElement.innerHTML = `&nbsp;<strong>${data.username}</strong>`;
        }

        // Проверяем роль пользователя
        if (data.role === 'admin') {
          const adminButton = document.getElementById('adminButton');
          if (adminButton) {
            adminButton.style.display = 'block';
          }
        }
        logMessage('info', `Данные пользователя загружены: ${data.username}, роль: ${data.role}`);

      })
      .catch((err) => showError('Ошибка загрузки данных пользователя: ' + err.message));
  }
  // Функция для загрузки карточек
  function fetchCards() {
    fetch('/api/fire-cards')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
        return response.json();
      })
      .then((cards) => {
        const fireCardList = document.getElementById('fire-card-list');
        if (!fireCardList) return;

        fireCardList.innerHTML = ''; // Очищаем список перед добавлением новых карточек

        cards.forEach((card) => {
          const li = document.createElement('li');
          li.classList.add('card-item');
          li.innerHTML = `
            <h3>${card.code}</h3>
            <p>${card.fireDate}</p>
            <button class="show-card" data-id="${card.id}">Показать</button>
            <button class="delete-card" data-id="${card.id}">Удалить</button>
          `;
          fireCardList.appendChild(li);
        });

        // Добавляем обработчики для кнопок "Показать" и "Удалить"
        document.querySelectorAll('.show-card').forEach((button) => {
          button.addEventListener('click', function () {
            const cardId = this.getAttribute('data-id');
            showCard(cardId);
          });
        });

        document.querySelectorAll('.delete-card').forEach((button) => {
          button.addEventListener('click', function () {
            const cardId = this.getAttribute('data-id');
            deleteCard(cardId);
          });
        });
      })
      .catch((error) => showError('Не удалось загрузить карточки: ' + error.message));
  }

  // Функция для удаления карточки
  function deleteCard(cardId) {
    fetch(`/api/fire-cards/${cardId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
        return response.json();
      })
      .then(() => fetchCards()) // Обновляем список карточек после удаления
      .catch((error) => showError('Не удалось удалить карточку: ' + error.message));
  }

// Основная функция для отображения карточки
function showCard(cardId) {
  fetch(`/api/fire-cards/${cardId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('карточки данные',data);
      displayCardModal(data);
    })
    .catch(error => {
      console.error('Ошибка при загрузке карточки:', error);
    });
}

// Отображение модального окна с данными карточки
function displayCardModal(cardData) {
  const modal = document.getElementById('view-card-modal');
  const table = document.getElementById('card-info-table');

  if (!modal || !table) {
    console.error('Элементы модального окна не найдены.');
    return;
  }

  // Очищаем таблицу
  table.innerHTML = '';

  // Генерируем строки таблицы на основе данных
  Object.entries(cardData).forEach(([key, value]) => {
    const row = document.createElement('tr');
    const keyCell = document.createElement('td');
    const valueCell = document.createElement('td');

    keyCell.textContent = translateKey(key);
    valueCell.textContent = value || 'Не указано';

    row.appendChild(keyCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  });

  // Показываем модальное окно
  modal.style.display = 'block';
}

// Закрытие модального окна
function closeModal() {
  const modal = document.getElementById('view-card-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Перевод ключей карточки

function translateKey(key) {
  const translations = {
      subject: 'Тема',
      code: 'Код',
      cardNumber: 'Номер карточки',
      burnType: 'Тип пожара',
      fireDate: 'Дата пожара',
      populationType: 'Тип населения',
      fireDepartment: 'Пожарная часть',
      business: 'Бизнес',
      ownership: 'Форма собственности',
      legalForm: 'Юридическая форма',
      government: 'Государственная принадлежность',
      enterpriseType: 'Тип предприятия',
      fireObject: 'Объект пожара',
      fireConditions: 'Условия пожара',
      damage: 'Повреждения',
      victims: 'Пострадавшие',
      evacuation: 'Эвакуация',
      firefighting: 'Тушение',
      environmentImpact: 'Влияние на окружающую среду',
      cause: 'Причина',
      ignitionSource: 'Источник возгорания',
      spreadCause: 'Причина распространения',
      firefightingResponse: 'Реакция пожарных',
      prevention: 'Меры предотвращения',
      inspection: 'Инспекция',
      equipment: 'Оборудование',
      training: 'Обучение',
      responsiblePerson: 'Ответственное лицо',
      organization: 'Организация',
      contact: 'Контакты',
      comments: 'Комментарии',
      documents: 'Документы'
  };

  return translations[key] || key;
}
// Привязка обработчиков кнопок "Показать"
function attachShowCardHandlers() {
  const showButtons = document.querySelectorAll('.show-card');
  showButtons.forEach(button => {
    button.addEventListener('click', () => {
      const cardId = button.dataset.cardId;
      showCard(cardId);
    });
  });
}

// Привязка обработчика кнопки "Закрыть"
document.getElementById('close-modal')?.addEventListener('click', closeModal);

// Инициализация обработчиков при загрузке страницы

  attachShowCardHandlers();


















  // Обработчики для кнопок и элементов
  document.getElementById('refresh-cards')?.addEventListener('click', fetchCards);
  document.getElementById('logoutButton')?.addEventListener('click', () => {
    fetch('/api/logout', { method: 'POST' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка завершения сессии на сервере');
        }
        localStorage.removeItem('user');
        window.location.href = 'login.html';
      })
      .catch((error) => showError('Ошибка завершения сессии: ' + error.message));
  });

  document.getElementById('close-modal')?.addEventListener('click', () => {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal && modal) {
      modal.style.display = 'none';
    }
  });

  // Инициализация страницы
  fetchCards();
  loadCurrentUser();
  fetch('/api/notifications')
    .then((response) => response.json())
    .then((data) => updateBellIcon(data.length > 0))
    .catch((error) => showError('Ошибка проверки уведомлений: ' + error.message));
});
function toggleNotificationsModal() {
  const modal = document.getElementById('notifications-modal');
  if (!modal) {
    console.error('Модальное окно для уведомлений не найдено.');
    return;
  }

  modal.style.display = modal.style.display === 'block' ? 'none' : 'block';

  if (modal.style.display === 'block') {
    loadNotifications();
  }
}

function loadNotifications() {
  fetch('/api/notifications')
    .then((response) => response.json())
    .then((data) => {
      const notificationList = document.getElementById('notification-list');
      if (!notificationList) return;

      notificationList.innerHTML = '';

      if (data.length === 0) {
        notificationList.innerHTML = '<li>Уведомлений нет</li>';
      } else {
        const notificlear = document.getElementById('clearnotifi');

        data.forEach((notification) => {
          const li = document.createElement('li');
          li.textContent = `${notification.message} (${new Date(notification.created_at).toLocaleString()})`;
          notificationList.appendChild(li);
          notificlear.style.display='block';


        });
        
      }

      updateBellIcon(data.length > 0);
    })
    .catch((error) => showError('Ошибка загрузки уведомлений: ' + error.message));
}
function updateBellIcon(hasNotifications) {
  const bell = document.getElementById('bell');
  if (bell) {
    bell.src = hasNotifications ? 'bell-full.png' : 'bell-empty.png';
  }
}
function clearNotifications() {
  fetch('/api/notifications', { method: 'DELETE' }) // Предполагается, что на сервере настроен DELETE-эндпоинт
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка при очистке уведомлений');
      }
      return response.json();
    })
    .then(() => {
      // Обновляем интерфейс после очистки
      const notificlear = document.getElementById('clearnotifi');

      const notificationList = document.getElementById('notification-list');
      if (notificationList) {
        notificationList.innerHTML = '<li>Уведомлений нет</li>';
        notificlear.style.display='none';
      }
      updateBellIcon(false); // Обновляем иконку колокольчика
    })
    .catch((error) => console.error('Ошибка при очистке уведомлений:', error));
}
document.getElementById('clear-notifications')?.addEventListener('click', () => {
  clearNotifications();
});
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/notifications')
    .then((response) => response.json())
    .then((data) => updateBellIcon(data.length > 0))
    .catch((error) => console.error('Ошибка проверки уведомлений:', error));
});

function closeViewCardModal() {
  const modal = document.getElementById('view-card-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Добавление возможности закрытия окна по клику вне контента
window.addEventListener('click', (event) => {
  const modal = document.getElementById('view-card-modal');
  if (modal && event.target === modal) {
    modal.style.display = 'none';
  }
});








