let currentStep = 1;
let totalSteps = 7;

function goNext() {
    const steps = document.querySelectorAll('.step');
    if (currentStep < totalSteps) {
        steps[currentStep - 1].classList.remove('active');
        currentStep++;
        steps[currentStep - 1].classList.add('active');
        updateProgressBar();
        updateButtons();
    }
}

function goBack() {
    const steps = document.querySelectorAll('.step');
    if (currentStep > 1) {
        steps[currentStep - 1].classList.remove('active');
        currentStep--;
        steps[currentStep - 1].classList.add('active');
        updateProgressBar();
        updateButtons();
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = (currentStep / totalSteps) * 100;
    progressBar.style.width = progress + '%';
}

function updateButtons() {
    const nextBtn = document.getElementById('next-btn');
    const saveBtn = document.getElementById('save-btn');
    const backBtn = document.getElementById('back-btn');

    // Удалим старые кнопки перед добавлением новых
    removeButtons();

    if (currentStep === 1) {
        // На первом шаге кнопка "Далее"
        createButton('next-btn', 'Далее', goNext);
    } else if (currentStep === totalSteps) {
        // На последнем шаге кнопка "Сохранить"
        createButton('back-btn', 'Назад', goBack);
        createButton('save-btn', 'Сохранить', saveCard);
    } else {
        // На этапах 2-6 кнопки "Назад" и "Далее"
        createButton('back-btn', 'Назад', goBack);
        createButton('next-btn', 'Далее', goNext);
    }
}
function loadCurrentUser() {
    fetch('/api/current-user')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при получении данных пользователя');
        }
        return response.json();
      })
      .then((data) => {
        return {username:data.username,role:data.role}

       
      })
      
  }
function createButton(id, text, onClickFunction) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.classList.add('btn');
    button.addEventListener('click', onClickFunction);
    document.querySelector(`#step-${currentStep}`).appendChild(button);
}

function removeButtons() {
    const existingButtons = document.querySelectorAll('.step button');
    existingButtons.forEach(button => button.remove());
}

function saveCard() {
    // Собираем данные из формы
    const cardData = {
        subject: document.getElementById('subject').value,
        code: document.getElementById('code').value,
        cardNumber: document.getElementById('card-number').value,
        burnType: document.getElementById('burn-type').value,
        fireDate: document.getElementById('fire-date').value,
        populationType: document.getElementById('population-type').value,
        fireDepartment: document.getElementById('fire-department').value,
        business: document.getElementById('business').checked,
        ownership: document.getElementById('ownership').value,
        legalForm: document.getElementById('legal-form').value,
        government: document.getElementById('government').value,
        enterpriseType: document.getElementById('enterprise-type').value,
        fireObject: document.getElementById('fire-object').value,
        fireConditions: document.getElementById('fire-conditions').value,
        damage: document.getElementById('damage').value,
        victims: document.getElementById('victims').value,
        evacuation: document.getElementById('evacuation').value,
        firefighting: document.getElementById('firefighting').value,
        environmentImpact: document.getElementById('environment-impact').checked,
        cause: document.getElementById('cause').value,
        ignitionSource: document.getElementById('ignition-source').value,
        spreadCause: document.getElementById('spread-cause').value,
        firefightingResponse: document.getElementById('firefighting-response').value,
        prevention: document.getElementById('prevention').value,
        inspection: document.getElementById('inspection').value,
        equipment: document.getElementById('equipment').checked,
        training: document.getElementById('training').checked,
        responsiblePerson: document.getElementById('responsible-person').value,
        organization: document.getElementById('organization').value,
        contact: document.getElementById('contact').value,
        comments: document.getElementById('comments').value,
        documents: document.getElementById('documents').files[0] ? document.getElementById('documents').files[0].name : null
    }; // Пример с файлом

    
    console.log("Собраные данные: ", cardData);
    // Отправляем данные на сервер
    fetch('/api/save-card', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Карточка успешно сохранена') {
            console.log(loadCurrentUser());// Показать уведомление или обновить интерфейс
            document.getElementById('popup').style.display = 'block';
            fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  message: 'Создана новая карточка пожара ',
                  user_id:1 ,
                }),
              });
        }
    })
    .catch(error => {
        console.error('Ошибка при сохранении карточки:', error.message);
    });
}


function gatherFormData() {
    const formData = {};
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        formData[input.name] = input.value;
    });
    return JSON.stringify(formData, null, 2);
}

function resetForm() {
    const formElements = document.querySelectorAll('.step input, .step select, .step textarea');
    formElements.forEach(element => {
        element.value = '';
    });

    // Сбросить progress bar
    currentStep = 1;
    updateProgressBar();
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.querySelector('#step-1').classList.add('active');
}

function redirectToHome() {
    // Перенаправить на главную страницу
    window.location.href = 'main.html';
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#step-1').classList.add('active');
    updateButtons();  // Изначально обновим кнопки
});
