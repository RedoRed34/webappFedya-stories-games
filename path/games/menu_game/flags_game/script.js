document.addEventListener('DOMContentLoaded', function() {
    const bearImage = document.getElementById('bear-image');
    const targetMessage = document.getElementById('target-message');
    const scoreDisplay = document.getElementById('score');
    const finalScoreDisplay = document.getElementById('final-score');
    const endGameDiv = document.getElementById('end-game');
    const timerDisplay = document.getElementById('timer');

    let score = 0;
    let timeLeft = 30;
    let currentDirection = null;
    let timerInterval;
    let inputTimeout;
    let gameActive = false;

    const fedyaImages = {
        left: "fedya_left.png",
        right: "fedya_right.png",
        up: "fedya_up.png",
        idle: "fedya_idle.png"
    };

    // Функция для преобразования направления в символ стрелки
    function getArrowSymbol(direction) {
        switch (direction) {
            case "left":
                return "←";
            case "right":
                return "→";
            case "up":
                return "↑";
            default:
                return ""; // Если направление неизвестно
        }
    }

    // Функция для начала игры
    function startGame() {
        gameActive = true;
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        endGameDiv.style.display = "none";
        targetMessage.textContent = ""; // Clear "ПРОМАХ" message

        // Запускаем таймер
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);

        generateDirection();
    }

    // Функция для генерации направления
    function generateDirection() {
        // Clear any previous timeout
        clearTimeout(inputTimeout);
        targetMessage.textContent = ""; // Clear target message

        // Если игра не активна, не генерируем новое направление
        if (!gameActive) {
            return;
        }

        // Показываем "спокойного" Федю
        bearImage.src = fedyaImages.idle;
        currentDirection = null;

        // Задержка перед показом направления
        setTimeout(() => {
            const directions = ["left", "up", "right"];
            const randomIndex = Math.floor(Math.random() * directions.length);
            currentDirection = directions[randomIndex];

            // Обновляем изображение Феди в соответствии с направлением
            bearImage.src = fedyaImages[currentDirection];

            // Ожидаем ввод игрока в течение 1.3 секунды
            inputTimeout = setTimeout(() => {
                if (currentDirection !== null) {
                    // Если игрок не успел нажать, показываем "ПРОМАХ"
                    targetMessage.textContent = "ПРОМАХ";
                    generateDirection(); // Генерируем новое направление
                }
            }, 1300);
        }, 500); // Небольшая задержка перед показом направления
    }

    // Функция для обработки нажатий клавиш с клавиатуры
    document.addEventListener('keydown', (event) => {
        if (!gameActive) {
            return;
        }
        if (currentDirection === null) {
            return;
        }

        // Если inputTimeout еще активен, отменяем его
        clearTimeout(inputTimeout);

        let keyDirection = null;
        switch (event.key) {
            case "ArrowLeft":
                keyDirection = "left";
                break;
            case "ArrowRight":
                keyDirection = "right";
                break;
            case "ArrowUp":
                keyDirection = "up";
                break;
            default:
                return; // Игнорируем другие клавиши
        }

        // Проверяем, правильно ли нажал игрок
        if (keyDirection === currentDirection) {
            score++;
            scoreDisplay.textContent = score;
            targetMessage.textContent = getArrowSymbol(currentDirection); // Показываем стрелку
            bearImage.src = fedyaImages.idle;
            setTimeout(generateDirection, 500);
        } else {
            targetMessage.textContent = "ПРОМАХ"; // Только "ПРОМАХ"
            bearImage.src = fedyaImages.idle;
            setTimeout(generateDirection, 500);
        }
    });

    // Функция для обработки нажатий клавиш с кнопок
    function handleArrowButtonClick(direction) {
        if (!gameActive) {
            return;
        }
        if (currentDirection === null) {
            return;
        }

        clearTimeout(inputTimeout);

        // Проверяем, правильно ли нажал игрок
        if (direction === currentDirection) {
            score++;
            scoreDisplay.textContent = score;
            targetMessage.textContent = getArrowSymbol(currentDirection); // Показываем стрелку
            bearImage.src = fedyaImages.idle;
            setTimeout(generateDirection, 500);
        } else {
            targetMessage.textContent = "ПРОМАХ"; // Только "ПРОМАХ"
            bearImage.src = fedyaImages.idle;
            setTimeout(generateDirection, 500);
        }
    }

    // Добавляем обработчики событий для кнопок со стрелками
    const arrowButtons = document.querySelectorAll('.arrow-button');
    arrowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const direction = this.dataset.direction;
            handleArrowButtonClick(direction);
        });
    });

    // Функция для окончания игры
    function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    clearTimeout(inputTimeout);
    bearImage.src = fedyaImages.idle;

    // Отображаем сообщение "Игра окончена!" в target-area
    targetMessage.textContent = "Ваш счет: " + score;
    targetMessage.style.fontSize = "1.5em"; //Optional styling

    // Скрываем endGameDiv
    // endGameDiv.style.display = "none";
    // currentDirection = null;
}

    // Запускаем игру при загрузке страницы
    setTimeout(startGame, 1500);
});