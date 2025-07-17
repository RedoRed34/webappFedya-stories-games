
const BOARD_SIZE = 10;
let playerBoard = [];
let computerBoard = [];
let playerShips = [];
let computerShips = [];
const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
let gameStarted = false;
let currentOrientation = "horizontal";

let lastHit = null; // Сохраняем координаты последнего попадания
let hitDirection = null; // Направление, в котором компьютер попал

function createBoard(boardId) {
    const board = document.getElementById(boardId);
    let boardData = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        const row = document.createElement("tr");
        boardData[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement("td");
            cell.dataset.row = i;
            cell.dataset.col = j;
            row.appendChild(cell);
            boardData[i][j] = 0;
        }
        board.appendChild(row);
    }
    return boardData;
}

function placeShipsRandomly(boardData, ships) {
    let placedShips = [];
    for (let shipLength of ships) {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * BOARD_SIZE);
            const col = Math.floor(Math.random() * BOARD_SIZE);
            const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";

            if (canPlaceShip(boardData, row, col, shipLength, orientation)) {
                placeShip(boardData, row, col, shipLength, orientation, placedShips);
                placed = true;
            }
        }
    }
    return placedShips;
}

function canPlaceShip(boardData, row, col, length, orientation) {
    if (orientation === "horizontal") {
        if (col + length > BOARD_SIZE) return false;
        for (let i = 0; i < length; i++) {
            if (boardData[row][col + i] !== 0) return false;
        }
    } else {
        if (row + length > BOARD_SIZE) return false;
        for (let i = 0; i < length; i++) {
            if (boardData[row + i][col] !== 0) return false;
        }
    }
    return true;
}

function placeShip(boardData, row, col, length, orientation, placedShips) {
    let shipCoordinates = [];
    if (orientation === "horizontal") {
        for (let i = 0; i < length; i++) {
            boardData[row][col + i] = 1;
            shipCoordinates.push({ row: row, col: col + i });
        }
    } else {
        for (let i = 0; i < length; i++) {
            boardData[row + i][col] = 1;
            shipCoordinates.push({ row: row + i, col: col });
        }
    }
    placedShips.push(shipCoordinates);
}

function setupPlayerBoard() {
    const playerBoardElement = document.getElementById("playerBoard");
    const cells = playerBoardElement.querySelectorAll("td");
    const startButton = document.getElementById("startButton");
    const rotateButton = document.getElementById("rotateButton"); // Получаем кнопку "Повернуть"

    let shipsPlaced = 0;
    let currentShipLengthIndex = 0;

    // Функция для подсветки ячеек при наведении мыши
    function highlightCells(row, col, length, orientation) {
        const cellsToHighlight = [];
        if (orientation === "horizontal") {
            for (let i = 0; i < length; i++) {
                if (col + i < BOARD_SIZE) {
                    const cell = document.querySelector(`#playerBoard [data-row="${row}"][data-col="${col + i}"]`);
                    if (cell) {
                        cellsToHighlight.push(cell);
                    } else {
                        return false; // Выход за границу, не подсвечиваем
                    }
                } else {
                    return false; // Выход за границу, не подсвечиваем
                }
            }
        } else {
            for (let i = 0; i < length; i++) {
                if (row + i < BOARD_SIZE) {
                    const cell = document.querySelector(`#playerBoard [data-row="${row + i}"][data-col="${col}"]`);
                    if (cell) {
                        cellsToHighlight.push(cell);
                    } else {
                        return false; // Выход за границу, не подсвечиваем
                    }
                } else {
                    return false; // Выход за границу, не подсвечиваем
                }
            }
        }

        //  Добавляем класс highlight только если все клетки существуют
        cellsToHighlight.forEach(cell => {
            if (cell) {
                cell.classList.add("highlight");
            }
        });
        return true;
    }

    // Функция для удаления подсветки
    function removeHighlight() {
        const cells = document.querySelectorAll("#playerBoard td"); //  Получаем все ячейки
        cells.forEach(cell => {
            cell.classList.remove("highlight");
        });
    }

    cells.forEach(cell => {
        // Наведение мыши для подсветки
        cell.addEventListener("mouseover", () => {
            if (gameStarted) return;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const currentShipLength = ships[currentShipLengthIndex];
            highlightCells(row, col, currentShipLength, currentOrientation);
        });

        // Убираем подсветку при уходе мыши
        cell.addEventListener("mouseout", removeHighlight);

        cell.addEventListener("click", () => {
            if (gameStarted) return;

            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const currentShipLength = ships[currentShipLengthIndex];

            if (playerBoard[row][col] === 0) {
                if (shipsPlaced < ships.reduce((a, b) => a + b, 0)) {
                    if (canPlaceShip(playerBoard, row, col, currentShipLength, currentOrientation)) {
                        placeShip(playerBoard, row, col, currentShipLength, currentOrientation, playerShips);
                        colorPlayerBoard();
                        shipsPlaced += currentShipLength;
                        currentShipLengthIndex++;

                        if (currentShipLengthIndex >= ships.length) currentShipLengthIndex = 0;

                        if (shipsPlaced >= ships.reduce((a, b) => a + b, 0)) {
                            gameStarted = true;
                            startButton.disabled = false;
                            showMessage("Корабли расставлены! Нажмите 'Начать бой'.");
                        }
                    } else {
                        showMessage("Нельзя разместить корабль здесь!");
                    }
                }
            }
        });
    });

    // Обработчик для кнопки "Повернуть"
    rotateButton.addEventListener("click", () => {
        if (!gameStarted) {
            toggleOrientation();
            removeHighlight(); // Убираем старую подсветку
            // Подсвечиваем ячейки с новой ориентацией (нужно получить координаты текущей ячейки)
            const row = parseInt(playerBoardElement.querySelector("td:hover")?.dataset.row); //row и col - координаты под курсором
            const col = parseInt(playerBoardElement.querySelector("td:hover")?.dataset.col); // если курсор вне поля, то row и col будут null

            if (row !== null && col !== null){
                const currentShipLength = ships[currentShipLengthIndex];
                highlightCells(row, col, currentShipLength, currentOrientation);
            }
        }
    });

    // Обработчик для кнопки "Начать бой"
    startButton.addEventListener("click", () => {
        if (gameStarted) {
            startGame();
	showMessage("Бой начался!");
        }
    });
}

function colorPlayerBoard() {
    const playerBoardElement = document.getElementById("playerBoard");
    const cells = playerBoardElement.querySelectorAll("td");

    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (playerBoard[row][col] === 1) {
            cell.classList.add("ship");
        }
    });
}

function playerTurn(row, col) {
    if (!gameStarted) return;

    if (computerBoard[row][col] === 1) {
        computerBoard[row][col] = 2; // Попадание
        markHit(row, col, "computerBoard");
        showMessage("Попадание!");
        if (checkWin(computerBoard)) {
            showMessage("Вы выиграли!");
            gameStarted = false;
        }
    } else if (computerBoard[row][col] === 0) {
        computerBoard[row][col] = 3; // Промах
        markMiss(row, col, "computerBoard");
        showMessage("Промах!");
        computerTurn();
    } else {
        showMessage("Уже стреляли!");
    }
}

function computerTurn() {
    if (!gameStarted) return;
    
	
    let row, col;

    if (lastHit) {
        //  Стреляем в одном направлении
        let possibleTargets = [];

        if (hitDirection === "horizontal") {
            // Пробуем влево и вправо
            if (lastHit.col > 0 && playerBoard[lastHit.row][lastHit.col - 1] !== 2 && playerBoard[lastHit.row][lastHit.col - 1] !== 3) {
                possibleTargets.push({ row: lastHit.row, col: lastHit.col - 1 });
            }
            if (lastHit.col < BOARD_SIZE - 1 && playerBoard[lastHit.row][lastHit.col + 1] !== 2 && playerBoard[lastHit.row][lastHit.col + 1] !== 3) {
                possibleTargets.push({ row: lastHit.row, col: lastHit.col + 1 });
            }
        } else if (hitDirection === "vertical") {
            // Пробуем вверх и вниз
            if (lastHit.row > 0 && playerBoard[lastHit.row - 1][lastHit.col] !== 2 && playerBoard[lastHit.row - 1][lastHit.col] !== 3) {
                possibleTargets.push({ row: lastHit.row - 1, col: lastHit.col });
            }
            if (lastHit.row < BOARD_SIZE - 1 && playerBoard[lastHit.row + 1][lastHit.col] !== 2 && playerBoard[lastHit.row + 1][lastHit.col] !== 3) {
                possibleTargets.push({ row: lastHit.row + 1, col: lastHit.col });
            }
        } else {
            // Если направление не определено, пробуем вокруг
            if (lastHit.row > 0 && playerBoard[lastHit.row - 1][lastHit.col] !== 2 && playerBoard[lastHit.row - 1][lastHit.col] !== 3) {
                possibleTargets.push({ row: lastHit.row - 1, col: lastHit.col });
            }
            if (lastHit.row < BOARD_SIZE - 1 && playerBoard[lastHit.row + 1][lastHit.col] !== 2 && playerBoard[lastHit.row + 1][lastHit.col] !== 3) {
                possibleTargets.push({ row: lastHit.row + 1, col: lastHit.col });
            }
            if (lastHit.col > 0 && playerBoard[lastHit.row][lastHit.col - 1] !== 2 && playerBoard[lastHit.row][lastHit.col - 1] !== 3) {
                possibleTargets.push({ row: lastHit.row, col: lastHit.col - 1 });
            }
            if (lastHit.col < BOARD_SIZE - 1 && playerBoard[lastHit.row][lastHit.col + 1] !== 2 && playerBoard[lastHit.row][lastHit.col + 1] !== 3) {
                possibleTargets.push({ row: lastHit.row, col: lastHit.col + 1 });
            }
        }


        if (possibleTargets.length > 0) {
            const randomIndex = Math.floor(Math.random() * possibleTargets.length);
            row = possibleTargets[randomIndex].row;
            col = possibleTargets[randomIndex].col;
        } else {
            // Если нет подходящих целей, стреляем случайно
            do {
                row = Math.floor(Math.random() * BOARD_SIZE);
                col = Math.floor(Math.random() * BOARD_SIZE);
            } while (playerBoard[row][col] === 2 || playerBoard[row][col] === 3);
        }

    } else {
        // Случайный выстрел
        do {
            row = Math.floor(Math.random() * BOARD_SIZE);
            col = Math.floor(Math.random() * BOARD_SIZE);
        } while (playerBoard[row][col] === 2 || playerBoard[row][col] === 3);
    }

    if (playerBoard[row][col] === 1) {
        playerBoard[row][col] = 2;
        markHit(row, col, "playerBoard");
        showMessage("Федя попал! Ваш ход.");
        lastHit = { row: row, col: col };

        //Определение направления
        if (!hitDirection) {
            if (row > 0 && playerBoard[row - 1][col] === 2) {
                hitDirection = "vertical";
            } else if (row < BOARD_SIZE - 1 && playerBoard[row + 1][col] === 2) {
                hitDirection = "vertical";
            } else if (col > 0 && playerBoard[row][col - 1] === 2) {
                hitDirection = "horizontal";
            } else if (col < BOARD_SIZE - 1 && playerBoard[row][col + 1] === 2) {
                hitDirection = "horizontal";
            }
        }
        if (checkWin(playerBoard)) {
            showMessage("Федя победил.");
            gameStarted = false;
	//setTimeout(ComputerTurn, 500); //Задержка хода
        }
        computerTurn();
    } else {
        playerBoard[row][col] = 3;
        markMiss(row, col, "playerBoard");
        showMessage("Федя промахнулся. Ваш ход.");
        lastHit = null;
        hitDirection = null;
    }
}

function markHit(row, col, boardId) {
    const board = document.getElementById(boardId);
    const cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add("hit");
}

function markMiss(row, col, boardId) {
    const board = document.getElementById(boardId);
    const cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add("miss");
}

function checkWin(boardData) {
    let shipsLeft = false;
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (boardData[row][col] === 1) {
                shipsLeft = true;
                break;
            }
        }
        if (shipsLeft) break;
    }
    return !shipsLeft;
}

function addClickListener(boardId, turnFunction) {
    const board = document.getElementById(boardId);
    const cells = board.querySelectorAll("td");

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (!gameStarted) return;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            turnFunction(row, col);
        });
    });
}

function startGame() {
    computerBoard = createBoard("computerBoard");
    computerShips = placeShipsRandomly(computerBoard, ships);
    addClickListener("computerBoard", playerTurn);

    const startButton = document.getElementById("startButton");
    startButton.style.display = "none"; // Скрываем кнопку
}

// Добавляем функцию для смены ориентации корабля
function toggleOrientation() {
    currentOrientation = currentOrientation === "horizontal" ? "vertical" : "horizontal";
    console.log("Текущая ориентация:", currentOrientation);
}

function showMessage(message) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
}

// Инициализация
playerBoard = createBoard("playerBoard");
setupPlayerBoard();