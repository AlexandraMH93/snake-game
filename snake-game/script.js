// Configuración del juego usando Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const blockSize = 20;
let width = Math.min(window.innerWidth * 0.9, 400); // Ajustar el ancho para móvil (máximo 400px)
let height = width; // Mantener el área cuadrada para el juego
canvas.width = width;
canvas.height = height;

// Definir la serpiente, dirección y comida
let snake = [{ x: blockSize * 3, y: blockSize * 3 }];
let direction = { x: 1, y: 0 };
let food = generateFood();
let score = 0;
let lives = 3;
let gameOver = false;
let intervalId;

// Cargar la imagen de la comida
const foodImage = new Image();
foodImage.src = 'food.png';

// Eventos de teclado para cambiar la dirección
document.addEventListener('keydown', changeDirection);

// Botones para controles en pantalla táctil
document.getElementById('up').addEventListener('click', () => setDirection(0, -1));
document.getElementById('down').addEventListener('click', () => setDirection(0, 1));
document.getElementById('left').addEventListener('click', () => setDirection(-1, 0));
document.getElementById('right').addEventListener('click', () => setDirection(1, 0));

// Iniciar el juego
function startGame() {
    intervalId = setInterval(updateGame, 100);
}

// Cambiar dirección de la serpiente con las teclas de flecha
function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction.x !== 1) { // Izquierda
        setDirection(-1, 0);
    } else if (key === 38 && direction.y !== 1) { // Arriba
        setDirection(0, -1);
    } else if (key === 39 && direction.x !== -1) { // Derecha
        setDirection(1, 0);
    } else if (key === 40 && direction.y !== -1) { // Abajo
        setDirection(0, 1);
    }
}

// Función para definir la dirección de movimiento
function setDirection(x, y) {
    if ((x !== 0 && direction.x === 0) || (y !== 0 && direction.y === 0)) {
        direction = { x: x, y: y };
    }
}

// Actualizar el estado del juego
function updateGame() {
    if (gameOver) return;

    // Mover la serpiente
    const newHead = {
        x: snake[0].x + direction.x * blockSize,
        y: snake[0].y + direction.y * blockSize
    };

    // Colisiones con bordes
    if (newHead.x < 0 || newHead.x >= width || newHead.y < 0 || newHead.y >= height) {
        loseLife();
        return;
    }

    // Colisiones consigo misma
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        loseLife();
        return;
    }

    snake.unshift(newHead);

    // Si come la comida
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        food = generateFood();
    } else {
        snake.pop(); // Mover sin crecer si no come
    }

    // Dibujar el juego
    drawGame();
}

// Perder vida
function loseLife() {
    lives--;
    document.getElementById('lives').textContent = lives;
    if (lives === 0) {
        endGame();
    } else {
        resetSnake();
    }
}

// Finalizar el juego
function endGame() {
    gameOver = true;
    clearInterval(intervalId);
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('final-score').textContent = score;
}

// Reiniciar la serpiente
function resetSnake() {
    snake = [{ x: blockSize * 3, y: blockSize * 3 }];
    direction = { x: 1, y: 0 };
}

// Generar nueva comida en posición aleatoria
function generateFood() {
    const foodX = Math.floor(Math.random() * (width / blockSize)) * blockSize;
    const foodY = Math.floor(Math.random() * (height / blockSize)) * blockSize;
    return { x: foodX, y: foodY };
}

// Dibujar la serpiente y la comida
function drawGame() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, width, height);

    // Dibujar la comida como imagen
    ctx.drawImage(foodImage, food.x, food.y, blockSize, blockSize);

    // Dibujar la serpiente como círculos
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.beginPath();
        ctx.arc(segment.x + blockSize / 2, segment.y + blockSize / 2, blockSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// Iniciar el juego cuando se carga la página
window.onload = startGame;
