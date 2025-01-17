document.addEventListener('DOMContentLoaded', function () {
  // Загружаем информацию о пользователе из сессии
  const userInfo = JSON.parse(localStorage.getItem('user')) || {};
  const usernameElement = document.getElementById('username');
  const roleElement = document.getElementById('role');

  

  // Функция для отображения сообщения об ошибке
  function showError(message) {
    console.error(message);
    alert('Ошибка: ' + message);
  }

  // Функция для получения карточек с сервера
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
        document.querySelectorAll('.show-card').forEach((button) => {
          button.addEventListener('click', function () {
            const cardId = this.getAttribute('data-id');
            showCard(cardId);
          });
        // Добавляем обработчики удаления на кнопки
        document.querySelectorAll('.delete-card').forEach((button) => {
          button.addEventListener('click', function () {
            const cardId = this.getAttribute('data-id');
            deleteCard(cardId);
          });
        });
      });
      })
      .catch((error) => showError('Не удалось загрузить карточки. ' + error.message));
  }

  // Функция для удаления карточки
  function deleteCard(id) {
    fetch(`/api/fire-cards/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        fetchCards(); // Обновляем список карточек после удаления
      })
      .catch((error) => showError('Не удалось удалить карточку. ' + error.message));
  }

  // Обработчик кнопки "Обновить список"
  document.getElementById('refresh-cards').addEventListener('click', fetchCards);

  // Обработчик кнопки "Выйти"
  document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('user');
    window.location.href = 'login.html'; // Перенаправляем на страницу логина
  });

  // Загружаем карточки при загрузке страницы
  fetchCards();

  function showCard(cardId) {
    // Отправляем запрос на сервер для получения данных о карточке
    console.log(cardId,'запрос пошел на эту карту ');
    fetch(`/api/fire-cards/${cardId}`)
      .then((response) => {
        if (!response.ok) {
          
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
        return response.json();
      })
      .then((card) => {
        
        // Заполняем модальное окно данными карточки
        document.getElementById('modal-title').textContent = `Карточка: ${card.code}`;
        document.getElementById('modal-body').textContent = `Дата: ${new Date(card.fireDate).toLocaleDateString()}`;
  
        // Показываем модальное окно
        const modal = document.getElementById('modal');
        modal.style.display = 'flex';
      })
      .catch((error) => showError('Не удалось загрузить подробности карточки. ' + error.message));
  }
  
  // Обработчик для закрытия модального окна
  document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
  });
  
  // Закрытие модального окна при клике вне его области
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });




});
