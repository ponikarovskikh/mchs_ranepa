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
        subject: 'Пожар в жилом доме',
        code: 'PH12345',
        cardNumber: 'CN98765',
        burnType: 'Полный',
        fireDate: '2025-01-01',
        populationType: 'Городское население',
        fireDepartment: 'Пожарная часть №1',
        business: 'true', // Преобразуем в строку или boolean, как нужно
        ownership: 'Частная',
        legalForm: 'ООО',
        government: 'Государственный',
        enterpriseType: 'Производственный',
        fireObject: 'Здание',
        fireConditions: 'Открытое пламя',
        damage: 'Сгорело 50% здания',
        victims: '5 человек',
        evacuation: 'Да',
        firefighting: 'Активное тушение',
        environmentImpact: 'true', // Преобразуем в строку или boolean, как нужно
        cause: 'Неосторожное обращение с огнем',
        ignitionSource: 'Электрический прибор',
        spreadCause: 'Вентиляционная система',
        firefightingResponse: 'Пожарные прибыли через 10 минут',
        prevention: 'Установлены дополнительные системы безопасности',
        inspection: 'Пожарная инспекция проведена 01.01.2025',
        equipment: 'true', // Преобразуем в строку или boolean, как нужно
        training: 'true', // Преобразуем в строку или boolean, как нужно
        responsiblePerson: 'Иванов И.И.',
        organization: "ООО 'Риск-Групп'",
        contact: '+7(123)456-78-90',
        comments: 'Дополнительные меры безопасности предприняты.',
        documents: 'document_01.pdf'
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
            // Показать уведомление или обновить интерфейс
            document.getElementById('popup').style.display = 'block';
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
