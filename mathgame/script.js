let currentQuestion = {};
let score = 0;
let lives = 3;
let level = 1;
let timeLeft = 10;
let countdownInterval;

// Load sound effects
const correctSound = new Audio('sfx/correct.mp3');
const wrongSound = new Audio('sfx/wrong.mp3');
const gameOverSound = new Audio('sfx/dead.mp3');

// Generate a new math question with increasing difficulty
function generateQuestion() {
    if (lives > 0) { // Only generate question if the game is not over
        const operators = ['+', '-', '*', '/'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        let num1 = Math.floor(Math.random() * (10 * level)) + 1;
        let num2 = Math.floor(Math.random() * (10 * level)) + 1;

        // Ensure division gives an integer result
        if (operator === '/' && num1 % num2 !== 0) {
            num1 = num1 * num2;
        }

        // Store the question and answer
        currentQuestion = {
            num1: num1,
            num2: num2,
            operator: operator,
            answer: eval(`${num1} ${operator} ${num2}`)
        };

        // Display the question
        document.getElementById('question').innerText = `Berapa ${num1} ${operator} ${num2}?`;

        // Reset timer
        resetTimer();
    }
}

// Start the game with reset stats and first question
function startGame() {
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('restart-button').style.display = 'none'; // Hide restart button
    score = 0;
    lives = 3;
    level = 1;
    document.getElementById('score').innerText = `Skor: ${score}`;
    document.getElementById('lives').innerText = `Nyawa: ${lives}`;
    document.getElementById('result').innerText = ''; // Clear result message
    document.getElementById('level').innerText = `Level: ${level}`;

    generateQuestion(); // Generate the first question
    document.getElementById('answer').focus();
}

// Check if the player's answer is correct
function checkAnswer() {
    const userAnswer = Number(document.getElementById('answer').value);
    clearInterval(countdownInterval); // Stop timer after answer

    if (userAnswer === currentQuestion.answer) {
        score += 10;
        correctSound.play();
        document.getElementById('result').innerText = '🎉 Benar!';
        document.getElementById('result').style.color = '#5cb85c'; // Set color to green
        confettiEffect();

        if (score % 50 === 0) {
            levelUp(); // Every 50 points, level up
        }
    } else {
        lives--;
        wrongSound.play();
        document.getElementById('result').innerText = `❌ Salah! Jawaban yang benar adalah ${currentQuestion.answer}.`;
        document.getElementById('result').style.color = '#d9534f'; // Set color to red
        shakeEffect();
    }

    document.getElementById('score').innerText = `Skor: ${score}`;
    document.getElementById('lives').innerText = `Nyawa: ${lives}`;

    if (lives > 0) {
        generateQuestion(); // Generate a new question if the game is not over
    } else {
        gameOver();
    }

    document.getElementById('answer').value = ''; // Clear input field
    document.getElementById('answer').focus(); // Set focus back to input field
}

// Add a countdown timer for urgency
function startTimer() {
    timeLeft = 10;
    document.getElementById('timer').innerText = `Waktu: ${timeLeft}s`;

    countdownInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Waktu: ${timeLeft}s`;

        if (timeLeft === 0) {
            clearInterval(countdownInterval);
            checkAnswer(); // Treat as wrong answer if time runs out
        }
    }, 1000);
}

// Reset timer
function resetTimer() {
    clearInterval(countdownInterval);
    startTimer();
}

// Level up by increasing difficulty
function levelUp() {
    level++;
    document.getElementById('level').innerText = `Level: ${level}`;
    document.getElementById('result').innerText = `🎉 Naik Level! Sekarang di Level ${level}`;
}

// Handle game over
function gameOver() {
    gameOverSound.play(); // Play the Game Over sound effect
    document.getElementById('result').innerText = '💀 Permainan Selesai!';
    document.getElementById('start-button').style.display = 'none'; // Hide start button
    document.getElementById('restart-button').style.display = 'inline-block'; // Show restart button
}

// Visual effect: Confetti animation for correct answer
function confettiEffect() {
    const confettiContainer = document.createElement('div');
    confettiContainer.classList.add('confetti');
    document.body.appendChild(confettiContainer);

    setTimeout(() => {
        document.body.removeChild(confettiContainer);
    }, 1000);
}

// Visual effect: Shake the game container when a wrong answer is given
function shakeEffect() {
    const gameContainer = document.querySelector('.game-container');
    gameContainer.classList.add('shake');

    setTimeout(() => {
        gameContainer.classList.remove('shake');
    }, 500);
}

// Add event listener for pressing "Enter"
document.getElementById('answer').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && lives > 0) { // Only allow answer submission if game is not over
        checkAnswer();
    }
});
