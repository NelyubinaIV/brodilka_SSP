document.addEventListener('DOMContentLoaded', () => {

    // Звуковые эффекты
    const sounds = {
        correct: new Audio('correct.mp3'),
        wrong: new Audio('wrong.mp3'),
        dice: new Audio('dice.mp3'),
        victory: new Audio('correct.mp3')
    };

    function playSound(soundName) {
        try {
            sounds[soundName].currentTime = 0;
            sounds[soundName].play().catch(e => {
                console.log(`Не удалось воспроизвести звук ${soundName}:`, e);
            });
        } catch (error) {
            console.log(`Ошибка воспроизведения звука ${soundName}:`, error);
        }
    }

    // Обновленные игровые данные: 25 заданий + 5 событий = 30 клеток
    const gameData = [
        { type: 'start' },
        { type: 'question', question: 'Найдите грамматическую основу в предложении: "За окном медленно падал снежок, и снежный, ясный свет лежал на стенах комнаты"', answer: 'снежок падал, свет лежал' },
        { type: 'question', question: 'Найдите грамматическую основу в предложении: "Месячный свет падал из окон бледно-голубыми, бледно-серебристыми арками, и в каждой из них был дымчатый теневой крест"', answer: 'свет падал, крест был' },
        { type: 'question', question: 'Найдите грамматическую основу в предложении: "Солнце закатилось, и над городом стояла золотистая пыль"', answer: 'солнце закатилось, пыль стояла' },
        { type: 'question', question: 'Найдите грамматическую основу в предложении: "Поезд тронулся, и она остановилась, глядя широко раскрытыми синими глазами на мелькающие вдоль платформы вагоны"', answer: 'поезд тронулся, она остановилась' },
        { type: 'event', text: 'Вы нашли древний свиток! Получаете 15 бонусных очков.', points: 15 },
        { type: 'question', question: 'Найдите грамматическую основу в предложении: "В саду было тихо, только птица иногда ворочалась и опять засыпала в липовых ветвях"', answer: 'было тихо, птица ворочалась, засыпала' },
        { type: 'question', question: 'В каком предложении «зато» является союзом?', options: ['Много поработали и устали, за(то) все сделали.', 'Поблагодари Диму за(то), что он для тебя сделал.', 'Приют наш мал, за(то) спокоен.'], correct: 2, answer: 'Союз «зато» близок по значению союзу «но». В третьем предложении можно заменить на «но».' },
        { type: 'question', question: 'В каком предложении «зато» является местоимением с предлогом?', options: ['Кукушка хвалит петуха за(то), что хвалит он кукушку.', 'Небо стало очищаться от туч, за(то) ветер еще усилился.'], correct: 0, answer: 'В первом предложении можно задать вопрос «за что?» - это местоимение с предлогом.' },
        { type: 'question', question: 'Где «однако» является частицей? "Погода была ветреная, ветер, однако, не совсем попутный"', answer: 'Здесь «однако» - частица. Стоит в середине предложения и обособляется с двух сторон.' },
        { type: 'event', text: 'Заколдованный лес! Пропустите следующий ход.', missTurn: true },
        { type: 'question', question: 'Где «однако» является союзом? "Страстно преданный барину, он, однако ж, редкий день в чем-нибудь не солжет ему"', answer: 'Здесь «однако ж» - вводное слово, близкое по значению к «тем не менее».' },
        { type: 'question', question: 'Где «однако» является союзом? "Мы не надеялись никогда более встретиться, однако встретились"', answer: 'Союз. Стоит в начале части предложения и равен союзу «но».' },
        { type: 'question', question: 'Где «однако» является союзом? "Раздался сильный взрыв, однако ребята не растерялись"', answer: 'Союз. Соединяет части сложносочиненного предложения и равен союзу «но».' },
        { type: 'question', question: 'Где «однако» является союзом? "Погода вначале была хорошая, тихая, однако вскоре налетел холодный ветер"', answer: 'Союз. Указывает на противопоставление и равен союзу «но».' },
        { type: 'event', text: 'Волшебный источник! Ваши очки за следующий правильный ответ удваиваются.', doublePointsNext: true },
        { type: 'question', question: 'Определите, где «то(же)» будет союзом: "Толстый ковер лежал на полу, стены то(же) были увешаны коврами"', answer: 'Союз «тоже». Можно заменить союзом «и» - стены и были увешаны коврами.' },
        { type: 'question', question: 'Определите, где «то(же)» будет частицей с местоимением: "Я снова жил с бабушкой, и каждый вечер перед сном она рассказывала мне сказки и свою жизнь, то(же) подобную сказке"', answer: 'Частица «же» с местоимением «то». Частицу можно опустить.' },
        { type: 'question', question: 'Определите, где «то(же)» и «так(же)» будут частицами: "Все белится Лукерья Львовна, все то(же) лжет Любовь Петровна, Иван Петрович так(же) глуп, Семен Петрович так(же) скуп"', answer: 'Все частицы. «То же» = «то самое», «так же» = «таким же образом».' },
        { type: 'question', question: 'Определите, где «то(же)» будет частицей: "И завтра то(же), что вчера"', answer: 'Частица «же» с местоимением «то». Можно опустить частицу: «И завтра то, что вчера».' },
        { type: 'event', text: 'Попутный ветер! Переместитесь на 2 клетки вперёд.', move: 2 },
        { type: 'question', question: 'Определите, где «так(же)» будет союзом: "Людям Павла Ивановича деревня то(же) понравилась. Они так(же), как и он сам, обживались в ней"', answer: 'В первом случае «тоже» - союз. Во втором «так же» - наречие с частицей.' },
        { type: 'question', question: 'Какое утверждение является неверным о сложносочиненных предложениях?', options: ['Простые предложения связываются сочинительными союзами', 'С союзом И указывается на чередование явлений', 'С союзами А, НО одно явление противопоставлено другому'], correct: 1, answer: 'Союз И указывает на одновременность или последовательность, а не чередование.' },
        { type: 'question', question: 'Какое утверждение является неверным?', options: ['Союз ЗАТО делает предложение сложносочиненным', 'Сложносочиненные предложения бывают союзными и бессоюзными', 'С союзами ТО-ТО указывается на чередование явлений'], correct: 1, answer: 'Сложносочиненные предложения всегда союзные. Бессоюзными бывают бессоюзные сложные предложения.' },
        { type: 'question', question: 'Какое утверждение является неверным?', options: ['Простые предложения не могут соединяться в сложносочиненное только при помощи интонации', 'С союзами ИЛИ, ТО ЛИ-ТО ЛИ указывается на возможность одного явления из нескольких', 'В сложносочиненном предложении простые предложения связываются сочинительными или подчинительными союзами'], correct: 2, answer: 'В сложносочиненном предложении части связываются только сочинительными союзами.' },
        { type: 'event', text: 'Ловушка дракона! Вернитесь на 3 клетки назад.', move: -3 },
        { type: 'question', question: 'Определите тип предложения: "Ветер лизнул огромные серые валуны, раскиданные древним ураганом и за столетия неподвижности обросшие переплетением сцепившихся кустов"', answer: 'Простое предложение с обособленными однородными определениями.' },
        { type: 'question', question: 'Определите тип предложения: "Небо совсем выцвело от зноя, пыльные листья на полях чуть съёжились и пожелтели по краям"', answer: 'Бессоюзное сложное предложение.' },
        { type: 'question', question: 'Определите тип предложения: "В комнаты ворвался упоительный свежий ветер, который принёс запах сырой травы и мокрых елей"', answer: 'Сложноподчиненное предложение.' },
        { type: 'question', question: 'Как надо продолжить предложение, чтобы оно получилось сложносочинённым? "Цветут липы..."', options: ['и привлекают своим запахом пчёл', 'и кругом пахнет липовым мёдом', 'распространяя вокруг удивительный запах'], correct: 1, answer: 'Нужна вторая грамматическая основа. «Кругом пахнет» - грамматическая основа.' },
        { type: 'question', question: 'Какие отношения выражаются с помощью союза И в предложении: "Золотилась и краснела листва в подмосковных лесах, и над убегающей вдаль извилистой речушкой медленно плыла голубая дымка"?', answer: 'Одновременность явлений.' },
        { type: 'finish' }
    ];

    const BOARD_SIZE = gameData.length;
    const POINTS_PER_CORRECT_ANSWER = 10;

    // DOM элементы
    const teamSetupModal = document.getElementById('team-setup-modal');
    const team1NameInput = document.getElementById('team1-name');
    const team2NameInput = document.getElementById('team2-name');
    const startGameBtn = document.getElementById('start-game-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    
    const boardEl = document.getElementById('board');
    const diceEl = document.getElementById('dice');
    const rollDiceBtn = document.getElementById('rollDice');
    const modalEl = document.getElementById('modal');
    const modalTitleEl = document.getElementById('modal-title');
    const modalTextEl = document.getElementById('modal-text');
    const optionsContainerEl = document.getElementById('options-container');
    const answerFeedbackEl = document.getElementById('answer-feedback');
    const correctBtn = document.getElementById('correct-btn');
    const incorrectBtn = document.getElementById('incorrect-btn');
    const showAnswerBtn = document.getElementById('show-answer-btn');
    const nextTurnBtn = document.getElementById('next-turn-btn');
    const winnerModalEl = document.getElementById('winner-modal');
    const winnerTextEl = document.getElementById('winner-text');
    const restartGameBtn = document.getElementById('restart-game');
    const currentTeamNameEl = document.getElementById('current-team-name');
    
    let gameState = {};
    let TEAMS = [
        { name: 'Команда 1', icon: '🦁' },
        { name: 'Команда 2', icon: '🦅' }
    ];

    // Функция для получения размера клетки в зависимости от размера экрана
    function getCellSize() {
        const width = window.innerWidth;
        if (width <= 480) return 28;
        if (width <= 768) return 35;
        if (width <= 1024) return 40;
        return 45;
    }

    // Новый путь доски для 30 клеток (6x5 сетка)
    function createBoardPath() {
        const path = [
            // Первый ряд (снизу) - слева направо
            {x: 0, y: 4}, {x: 1, y: 4}, {x: 2, y: 4}, {x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4},
            // Второй ряд - справа налево
            {x: 5, y: 3}, {x: 4, y: 3}, {x: 3, y: 3}, {x: 2, y: 3}, {x: 1, y: 3}, {x: 0, y: 3},
            // Третий ряд - слева направо
            {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2},
            // Четвертый ряд - справа налево
            {x: 5, y: 1}, {x: 4, y: 1}, {x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}, {x: 0, y: 1},
            // Пятый ряд (сверху) - слева направо
            {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}
        ];
        return path.slice(0, BOARD_SIZE);
    }

    const boardPath = createBoardPath();

    function showTeamSetup() {
        teamSetupModal.style.display = 'flex';
        team1NameInput.focus();
    }

    function hideTeamSetup() {
        teamSetupModal.style.display = 'none';
    }

    function validateTeamNames() {
        const team1Name = team1NameInput.value.trim();
        const team2Name = team2NameInput.value.trim();
        
        startGameBtn.disabled = !team1Name || !team2Name;
        
        if (team1Name && team2Name) {
            startGameBtn.textContent = 'Начать игру';
        } else {
            startGameBtn.textContent = 'Введите названия команд';
        }
    }

    function startGame() {
        const team1Name = team1NameInput.value.trim();
        const team2Name = team2NameInput.value.trim();
        
        if (!team1Name || !team2Name) return;
        
        TEAMS[0].name = team1Name;
        TEAMS[1].name = team2Name;
        
        // Обновляем отображение названий команд
        document.getElementById('team0-display-name').textContent = team1Name;
        document.getElementById('team1-display-name').textContent = team2Name;
        
        hideTeamSetup();
        initGame();
    }

    function initGame() {
        gameState = {
            players: TEAMS.map((team, i) => ({ 
                id: i, 
                name: team.name, 
                icon: team.icon, 
                score: 0, 
                position: 0, 
                missNextTurn: false,
                doublePointsNext: false
             })),
            currentPlayerIndex: 0,
            gamePhase: 'ROLLING',
            specialEvent: null,
            extraTurn: false,
        };
        renderBoard();
        renderScoreboard();
        updateTurnIndicator();
        winnerModalEl.classList.add('hidden');
        modalEl.classList.add('hidden');
        rollDiceBtn.disabled = false;
    }

    function renderBoard() {
        boardEl.innerHTML = '';
        
        const boardRect = boardEl.getBoundingClientRect();
        const boardWidth = boardRect.width;
        const boardHeight = boardRect.height;
        const cellSize = getCellSize();
        const numCols = 6;
        const numRows = 5;
        
        // Вычисляем доступное пространство
        const availableWidth = boardWidth - cellSize;
        const availableHeight = boardHeight - cellSize;
        
        boardPath.forEach((pos, i) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.id = i;
            
            // Позиционируем клетки с учетом размера доски
            const left = (pos.x / (numCols - 1)) * availableWidth;
            const top = (pos.y / (numRows - 1)) * availableHeight;
            
            cell.style.left = `${left}px`;
            cell.style.top = `${top}px`;
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            
            const cellData = gameData[i];
            cell.textContent = i + 1;
            if (cellData.type === 'start') cell.classList.add('start');
            if (cellData.type === 'finish') cell.classList.add('finish');
            if (cellData.type === 'event') cell.classList.add('event');
            boardEl.appendChild(cell);
        });

        gameState.players.forEach(player => {
            const token = document.createElement('div');
            token.id = `player${player.id}`;
            token.classList.add('player-token');
            token.innerHTML = player.icon;
            boardEl.appendChild(token);
            movePlayerToken(player.id, 0);
        });
    }

    function renderScoreboard() {
        gameState.players.forEach((player, i) => {
            document.getElementById(`score${i}`).textContent = player.score;
            const li = document.querySelector(`li[data-team-id="${i}"]`);
            if (i === gameState.currentPlayerIndex) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
    }
    
    function updateTurnIndicator() {
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        currentTeamNameEl.innerHTML = `${currentPlayer.icon} ${currentPlayer.name}`;
    }

    function movePlayerToken(playerId, newPosition) {
        const token = document.getElementById(`player${playerId}`);
        const cell = document.querySelector(`.cell[data-id="${newPosition}"]`);
        if (cell && token) {
            const tokenSize = window.innerWidth <= 480 ? 16 : (window.innerWidth <= 768 ? 20 : (window.innerWidth <= 1024 ? 24 : 28));
            const offset = playerId * (tokenSize / 4 + 2);
            
            token.style.left = `${cell.offsetLeft + cell.offsetWidth / 2 - tokenSize / 2 + offset}px`;
            token.style.top = `${cell.offsetTop + cell.offsetHeight / 4 + offset}px`;
            token.style.width = `${tokenSize}px`;
            token.style.height = `${tokenSize}px`;
        }
    }
    
    function processCellAction(cellIndex) {
        const cellData = gameData[cellIndex];
        modalEl.classList.remove('hidden');
        optionsContainerEl.innerHTML = '';
        answerFeedbackEl.innerHTML = '';
        answerFeedbackEl.style.background = 'transparent';
        
        [correctBtn, incorrectBtn, showAnswerBtn, nextTurnBtn].forEach(btn => btn.classList.add('hidden'));

        modalTitleEl.textContent = cellData.type === 'event' ? 'Событие!' : 'Волшебное испытание!';
        modalTextEl.textContent = cellData.text || cellData.question;
        
        if (cellData.type === 'question') {
            gameState.gamePhase = 'ANSWERING';
            if (cellData.options) {
                cellData.options.forEach((option, index) => {
                    const button = document.createElement('button');
                    button.classList.add('option-btn');
                    button.textContent = option;
                    button.onclick = () => handleAnswer(index === cellData.correct, cellData);
                    optionsContainerEl.appendChild(button);
                });
                showAnswerBtn.classList.remove('hidden');
            } else {
                showAnswerBtn.classList.remove('hidden');
                correctBtn.classList.remove('hidden');
                incorrectBtn.classList.remove('hidden');
            }
        } else {
            handleEvent(cellData);
            nextTurnBtn.classList.remove('hidden');
        }
    }

    function handleEvent(cellData) {
        const player = gameState.players[gameState.currentPlayerIndex];
        
        if (cellData.move) {
            let newPosition = Math.max(0, Math.min(player.position + cellData.move, BOARD_SIZE - 1));
            player.position = newPosition;
            setTimeout(() => movePlayerToken(player.id, player.position), 500);
        }
        if (cellData.points) player.score = Math.max(0, player.score + cellData.points);
        if (cellData.missTurn) player.missNextTurn = true;
        if (cellData.doublePointsNext) player.doublePointsNext = true;
        if (cellData.extraTurn) gameState.extraTurn = true;

        renderScoreboard();
    }
    
    function handleAnswer(isCorrect, cellData) {
        optionsContainerEl.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
        [correctBtn, incorrectBtn, showAnswerBtn].forEach(btn => btn.classList.add('hidden'));
        nextTurnBtn.classList.remove('hidden');
        
        const player = gameState.players[gameState.currentPlayerIndex];
        let pointsAwarded = isCorrect ? POINTS_PER_CORRECT_ANSWER : 0;

        if(isCorrect) {
            playSound('correct');
            
            if (player.doublePointsNext) { 
                pointsAwarded *= 2; 
                player.doublePointsNext = false; 
            }
            
            player.score += pointsAwarded;
            answerFeedbackEl.textContent = `Верно! +${pointsAwarded} очков!`;
            answerFeedbackEl.style.background = 'rgba(40, 167, 69, 0.5)';
        } else {
            playSound('wrong');
            
            answerFeedbackEl.textContent = 'Неверно. Очков не начислено.';
            answerFeedbackEl.style.background = 'rgba(220, 53, 69, 0.5)';
        }
        renderScoreboard();
    }

    async function handleDiceRoll() {
        if (gameState.gamePhase !== 'ROLLING') return;
        rollDiceBtn.disabled = true;

        playSound('dice');

        const roll = Math.ceil(Math.random() * 6);
        const rollAnimation = setInterval(() => diceEl.textContent = Math.ceil(Math.random() * 6), 50);

        setTimeout(() => {
            clearInterval(rollAnimation);
            diceEl.textContent = roll;

            const player = gameState.players[gameState.currentPlayerIndex];
            let newPosition = Math.min(player.position + roll, BOARD_SIZE - 1);
            player.position = newPosition;
            movePlayerToken(player.id, newPosition);
            setTimeout(() => processCellAction(newPosition), 800);
        }, 1000);
    }
    
    function showAnswer() {
        const cellIndex = gameState.players[gameState.currentPlayerIndex].position;
        const cellData = gameData[cellIndex];
        answerFeedbackEl.textContent = `Правильный ответ: ${cellData.answer}`;
        answerFeedbackEl.style.background = 'rgba(23, 162, 184, 0.5)';
    }

    function nextTurn() {
        modalEl.classList.add('hidden');
        
        if (gameState.players[gameState.currentPlayerIndex].position >= BOARD_SIZE - 1) {
            endGame();
            return;
        }

        if (gameState.extraTurn) {
            gameState.extraTurn = false;
        } else {
            gameState.currentPlayerIndex = 1 - gameState.currentPlayerIndex; // Переключение между 0 и 1
        }
        
        const nextPlayer = gameState.players[gameState.currentPlayerIndex];
        updateTurnIndicator();
        renderScoreboard();
        
        if (nextPlayer.missNextTurn) {
            nextPlayer.missNextTurn = false;
            alert(`${nextPlayer.icon} ${nextPlayer.name} пропускает ход!`);
            setTimeout(nextTurn, 200);
            return; 
        }

        gameState.gamePhase = 'ROLLING';
        rollDiceBtn.disabled = false;
    }
    
    function endGame() {
        gameState.gamePhase = 'GAMEOVER';
        const winner = gameState.players.reduce((prev, curr) => (prev.score > curr.score) ? prev : curr);
        
        playSound('victory');
        
        winnerTextEl.textContent = `Победила команда ${winner.icon} ${winner.name}!`;
        winnerModalEl.classList.remove('hidden');
    }

    function handleCorrectAnswer() {
        const cellData = gameData[gameState.players[gameState.currentPlayerIndex].position];
        handleAnswer(true, cellData);
    }

    function handleIncorrectAnswer() {
        const cellData = gameData[gameState.players[gameState.currentPlayerIndex].position];
        handleAnswer(false, cellData);
    }

    // Обработчики событий для настройки команд
    team1NameInput.addEventListener('input', validateTeamNames);
    team2NameInput.addEventListener('input', validateTeamNames);
    team1NameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') team2NameInput.focus();
    });
    team2NameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !startGameBtn.disabled) startGame();
    });
    startGameBtn.addEventListener('click', startGame);
    newGameBtn.addEventListener('click', showTeamSetup);

    // Обработчики событий для игры
    rollDiceBtn.addEventListener('click', handleDiceRoll);
    correctBtn.addEventListener('click', handleCorrectAnswer);
    incorrectBtn.addEventListener('click', handleIncorrectAnswer);
    showAnswerBtn.addEventListener('click', showAnswer);
    nextTurnBtn.addEventListener('click', nextTurn);
    restartGameBtn.addEventListener('click', () => {
        winnerModalEl.classList.add('hidden');
        showTeamSetup();
    });

    // Инициализация
    validateTeamNames();
    showTeamSetup();
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        setTimeout(renderBoard, 100); // Небольшая задержка для завершения изменения размера
    });
});
