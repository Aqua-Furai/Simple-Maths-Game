// Game State variables
let gameState = {
    level: 1,
    score: 0, 
    currentAnswer: 0
};

// Elements
const levelEl = document.getElementById('level');
const scoreEl = document.getElementById('score');
const equationEl = document.getElementById('equation');
const answerInput = document.getElementById('userAnswer');
const messageEl = document.getElementById('message');
const gameForm = document.getElementById('gameForm');
const resetBtn = document.getElementById('resetBtn');

// Initialize Game
window.onload = function() {
    loadGame();
    generateQuestion();
};

// Save state to LocalStorage
function saveGame() {
    localStorage.setItem('mathGameSeparateSave', JSON.stringify(gameState));
}

// Load state from LocalStorage
function loadGame() {
    const savedData = localStorage.getItem('mathGameSeparateSave');
    if (savedData) {
        gameState = JSON.parse(savedData);
        updateUI();
    }
}

// Delete save file
function resetGame() {
    if(confirm("Are you sure you want to delete your save file and restart?")) {
        gameState = { level: 1, score: 0, currentAnswer: 0 };
        saveGame();
        updateUI();
        generateQuestion();
        setMessage("Game reset!", "correct");
    }
}

// Update the UI
function updateUI() {
    levelEl.innerText = gameState.level;
    scoreEl.innerText = gameState.score;
}

// Generate math problems based on level
function generateQuestion() {
    let num1, num2, operator;
    const lvl = gameState.level;

    if (lvl === 1) {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = '+';
        gameState.currentAnswer = num1 + num2;
    } else if (lvl === 2) {
        num1 = Math.floor(Math.random() * 15) + 5;
        num2 = Math.floor(Math.random() * num1); 
        operator = '-';
        gameState.currentAnswer = num1 - num2;
    } else if (lvl === 3) {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
        operator = '×';
        gameState.currentAnswer = num1 * num2;
    } else {
        const ops = ['+', '-', '×'];
        operator = ops[Math.floor(Math.random() * ops.length)];
        let maxRange = 10 + (lvl * 2);
        
        num1 = Math.floor(Math.random() * maxRange) + 5;
        num2 = Math.floor(Math.random() * maxRange) + 1;
        
        if (operator === '+') gameState.currentAnswer = num1 + num2;
        if (operator === '-') {
            if(num1 < num2) { let temp = num1; num1 = num2; num2 = temp; } 
            gameState.currentAnswer = num1 - num2;
        }
        if (operator === '×') {
            num1 = Math.floor(Math.random() * 12) + 2;
            num2 = Math.floor(Math.random() * lvl) + 2;
            gameState.currentAnswer = num1 * num2;
        }
    }

    equationEl.innerText = `${num1} ${operator} ${num2}`;
}

// Process user submission
function checkAnswer(event) {
    event.preventDefault();
    
    const userAnswer = parseInt(answerInput.value);

    if (userAnswer === gameState.currentAnswer) {
        gameState.score++;
        setMessage("Correct! 🎉", "correct");
        
        if (gameState.score >= 5) {
            gameState.level++;
            gameState.score = 0;
            setMessage(`Level Up! Welcome to Level ${gameState.level} 🚀`, "correct");
        }
    } else {
        setMessage(`Wrong! The answer was ${gameState.currentAnswer}.`, "wrong");
    }

    saveGame();
    updateUI();
    answerInput.value = '';
    generateQuestion();
}

// Helper text feedback
function setMessage(text, className) {
    messageEl.innerText = text;
    messageEl.className = "message " + className;
}

// Event Listeners
gameForm.addEventListener('submit', checkAnswer);
resetBtn.addEventListener('click', resetGame);