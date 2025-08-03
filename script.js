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

    // Обновленные игровые данные для 30 клеток
    const gameData = [
        { type: 'start' },
        { type: 'question', question: 'Найдите грамматическую основу: "За окном медленно падал снежок, и снежный, ясный свет лежал на стенах комнаты".', answer: 'снежок падал, свет лежал' },
        { type: 'event', text: 'Вы нашли карту сокровищ! Переместитесь на 2 клетки вперёд.', move: 2 },
        { type: 'question', question: 'Найдите грамматическую основу: "Солнце закатилось, и над городом стояла золотистая пыль".', answer: 'солнце закатилось, пыль стояла' },
        { type: 'question', question: 'В каком предложении «зато» является союзом?', options: ['Много поработали и устали, за(то) все сделали.', 'Поблагодари Диму за(то), что он для тебя сделал.'], correct: 0, answer: 'Союз «зато» близок по значению союзу «но». Проверка: "Много поработали и устали, но все сделали".' },
        { type: 'event', text: 'Ловушка! Вы попали в зыбучие пески. Вернитесь на 1 клетку назад.', move: -1 },
        { type: 'question', question: 'Является ли «зато» союзом в предложении: "Кукушка хвалит петуха за(то), что хвалит он кукушку"?', answer: 'Нет, это местоимение с предлогом. Можно задать вопрос «за что?».'},
        { type: 'event', text: 'Попутный ветер! Вы получаете 10 бонусных очков.', points: 10 },
        { type: 'question', question: 'Укажите, где «однако» будет частицей, а где союзом: "Погода была ветреная, ветер, однако, не совсем попутный."', answer: 'Частица. Стоит в середине предложения и обособляется с двух сторон.' },
        { type: 'question', question: 'Укажите, где «однако» будет частицей, а где союзом: "Мы не надеялись никогда более встретиться, однако встретились."', answer: 'Союз. Стоит в начале части предложения и равен союзу «но».' },
        { type: 'event', text: 'Заколдованный лес! Пропустите следующий ход.', missTurn: true },
        { type: 'question', question: 'Определите, где «то(же)» и «так(же)» будут союзом, а где частицей: "Толстый ковер лежал на полу, стены то(же) были увешаны коврами."', answer: 'Союз. «Тоже» можно заменить союзом «и».' },
        { type: 'event', text: 'Секретный портал! Переместитесь на клетку 18.', moveTo: 18 },
        { type: 'question', question: 'Определите, где «то(же)» и «так(же)» будут союзом, а где частицей: "И завтра то(же), что вчера."', answer: 'Частица с местоимением. Частицу «же» можно опустить.' },
        { type: 'question', question: 'Какое утверждение является неверным?', options: ['Сложносочинённые предложения – это предложения, в которых простые связываются сочинительными союзами.', 'В сложносочинённых предложениях с союзом И указывается на чередование явлений.'], correct: 1, answer: 'Союз И указывает на одновременность или последовательность, а не чередование.' },
        { type: 'event', text: 'Вы нашли зелье удачи! Бросьте кубик еще раз.', extraTurn: true },
        { type: 'question', question: 'Определите тип предложения: "Ветер лизнул огромные серые валуны, раскиданные древним ураганом и за столетия неподвижности обросшие переплетением сцепившихся кустов."', answer: 'Простое предложение с обособленными однородными членами.' },
        { type: 'question', question: 'Определите тип предложения: "Небо совсем выцвело от зноя, пыльные листья на полях чуть съёжились и пожелтели по краям."', answer: 'Бессоюзное сложное предложение.' },
        { type: 'event', text: 'Ой, вы разбудили дракона! Вернитесь на клетку 8.', moveTo: 8 },
        { type: 'question', question: 'Как надо продолжить предложение, чтобы оно получилось сложносочинённым? "Цветут липы..."', options: ['...и привлекают своим запахом пчёл.', '...распространяя вокруг удивительный запах.'], correct: 0, answer: 'Нужна вторая грамматическая основа.' },
        { type: 'event', text: 'Помощь от грифона! +15 очков.', points: 15 },
        { type: 'question', question: 'Как надо продолжить предложение, чтобы оно получилось сложносочинённым? "Поднялся сильный ветер..."', options: ['...и сорвал с деревьев последние листья.', '...разнося по дорожкам сада упавшие листья.'], correct: 0, answer: 'Нужна вторая грамматическая основа.' },
        { type: 'question', question: 'Какие отношения выражаются с помощью союза И в предложении: "Золотилась и краснела листва..., и ... плыла голубая дымка, и ... ветер был напоён..."?', answer: 'Одновременность явлений.' },
        { type: 'event', text: 'Проклятье! Теряете 5 очков.', points: -5 },
        { type: 'question', question: 'Найдите грамматическую основу: "Месячный свет падал из окон бледно-голубыми арками".', answer: 'свет падал'},
        { type: 'question', question: 'Является ли «однако» союзом в предложении: "Страстно преданный барину, он, однако ж, редкий день в чем-нибудь не солжет ему."?', answer: 'Нет, это вводное слово (близко по значению к "тем не менее").' },
        { type: 'event', text: 'Телепорт! Поменяйтесь местами с соперником.', swapWithOpponent: true },
        { type: 'question', question: 'Является ли «так(же)» союзом в предложении: "Людям Павла Ивановича деревня то(же) понравилась. Они так(же), как и он сам, обживались в ней."', answer: 'В первом случае - союз. Во втором - наречие с частицей.' },
        { type: 'event', text: 'Двойная награда! Ваши очки за следующий правильный ответ удваиваются.', doublePointsNext: true },
        { type: 'question', question: 'Найдите грамматическую основу: "В саду было тихо, только птица иногда ворочалась и опять засыпала..."', answer: 'было тихо, птица ворочалась, засыпала' },
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
                doublePointsNext: false,
                sfenixRiddle: false,
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
        boardPath.forEach((pos, i) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.id = i;
            
            const boardWidth = boardEl.clientWidth;
            const boardHeight = boardEl.clientHeight;
            const cellWidth = 60;
            const cellHeight = 60;
            const numCols = 6; // Изменено с 9 на 6
            const numRows = 5;
            cell.style.left = `${(pos.x / (numCols - 1)) * (boardWidth - cellWidth)}px`;
            cell.style.top = `${(pos.y / (numRows - 1)) * (boardHeight - cellHeight)}px`;
            
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
            token.style.left = `${cell.offsetLeft + cell.offsetWidth / 2 - token.offsetWidth / 2 + playerId * 8}px`;
            token.style.top = `${cell.offsetTop + cell.offsetHeight / 4 + playerId * 8}px`;
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
            if(gameState.specialEvent !== 'RISK') {
               nextTurnBtn.classList.remove('hidden');
            }
        }
    }

    function handleEvent(cellData) {
        const player = gameState.players[gameState.currentPlayerIndex];
        const opponent = gameState.players[1 - gameState.currentPlayerIndex];
        
        if (cellData.move) {
            let newPosition = Math.max(0, Math.min(player.position + cellData.move, BOARD_SIZE - 1));
            player.position = newPosition;
            setTimeout(() => movePlayerToken(player.id, player.position), 500);
        }
        if (cellData.points) player.score = Math.max(0, player.score + cellData.points);
        if (cellData.missTurn) player.missNextTurn = true;
        if (cellData.doublePointsNext) player.doublePointsNext = true;
        if (cellData.extraTurn) gameState.extraTurn = true;
        if (cellData.text?.includes("Загадка от сфинкса")) player.sfenixRiddle = true;

        if (cellData.moveTo) {
            player.position = cellData.moveTo - 1;
            setTimeout(() => movePlayerToken(player.id, player.position), 500);
        }

        if (cellData.swapWithOpponent) {
            [player.position, opponent.position] = [opponent.position, player.position];
            setTimeout(() => {
                movePlayerToken(player.id, player.position);
                movePlayerToken(opponent.id, opponent.position);
            }, 500);
        }
        
        if (cellData.text?.includes("Соперник теряет 5 очков")) {
            opponent.score = Math.max(0, opponent.score - 5);
        }

        if (cellData.text?.includes("Команды меняются очками")) {
            [player.score, opponent.score] = [opponent.score, player.score];
        }
        
        if (cellData.text?.includes("Поделитесь 10 очками с соперником")) {
            if (player.score >= 10) {
                player.score -= 10;
                opponent.score += 10;
            }
        }
        
        if (cellData.text?.includes("Риск!")) {
            gameState.gamePhase = 'EVENT';
            gameState.specialEvent = 'RISK';
            modalTextEl.innerHTML += '<br/><br/>Бросайте кубик, чтобы испытать удачу!';
            rollDiceBtn.disabled = false;
            return;
        }

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
            
            if (player.doublePointsNext) { pointsAwarded *= 2; player.doublePointsNext = false; }
            if (player.sfenixRiddle) { pointsAwarded = 20; player.sfenixRiddle = false; }
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
        if (gameState.gamePhase !== 'ROLLING' && gameState.gamePhase !== 'EVENT') return;
        rollDiceBtn.disabled = true;

        playSound('dice');

        const roll = Math.ceil(Math.random() * 6);
        const rollAnimation = setInterval(() => diceEl.textContent = Math.ceil(Math.random() * 6), 50);

        setTimeout(() => {
            clearInterval(rollAnimation);
            diceEl.textContent = roll;
            
            if (gameState.specialEvent === 'RISK') {
                const player = gameState.players[gameState.currentPlayerIndex];
                const move = roll <= 3 ? -5 : 5;
                answerFeedbackEl.textContent = `Выпало ${roll}! ${move > 0 ? 'Удача!' : 'Неудача!'} Перемещение на ${move} клеток.`;
                answerFeedbackEl.style.background = 'rgba(23, 162, 184, 0.5)';
                player.position = Math.max(0, Math.min(player.position + move, BOARD_SIZE - 1));
                movePlayerToken(player.id, player.position);
                gameState.specialEvent = null;
                nextTurnBtn.classList.remove('hidden');
                return;
            }

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
    window.addEventListener('resize', renderBoard);
});
