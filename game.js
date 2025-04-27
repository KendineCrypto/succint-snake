const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

let snake, direction, newDirection, star, score, highScore = 0, gameRunning;

function initGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 20, y: 0 };
    newDirection = { x: 20, y: 0 };
    star = generateStar();
    score = 0;
    gameRunning = true;
    document.getElementById("score").innerText = score;
    gameLoop();
}

document.addEventListener("keydown", (event) => {
    if (gameRunning) changeDirection(event);
});

function gameLoop() {
    if (!gameRunning) return;

    moveSnake();
    if (checkCollision()) return endGame();

    drawGame();
    setTimeout(gameLoop, 100);
}

function moveSnake() {
    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === star.x && head.y === star.y) {
        score++;
        document.getElementById("score").innerText = score;
        star = generateStar();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const key = event.key;
    if ((key === "ArrowUp" || key === "w") && direction.y === 0) newDirection = { x: 0, y: -20 };
    if ((key === "ArrowDown" || key === "s") && direction.y === 0) newDirection = { x: 0, y: 20 };
    if ((key === "ArrowLeft" || key === "a") && direction.x === 0) newDirection = { x: -20, y: 0 };
    if ((key === "ArrowRight" || key === "d") && direction.x === 0) newDirection = { x: 20, y: 0 };

    direction = newDirection;
}

function checkCollision() {
    let head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) return true;
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
}

function generateStar() {
    return {
        x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
        y: Math.floor(Math.random() * (canvas.height / 20)) * 20
    };
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Yıldızı çiz
    ctx.fillStyle = "gold";
    drawStar(star.x + 10, star.y + 10, 5, 6, 12);

    // Yılanı çiz (Gözlerle birlikte)
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#007f00" : "#00cc00";
        ctx.beginPath();
        ctx.arc(segment.x + 10, segment.y + 10, index === 0 ? 12 : 10, 0, Math.PI * 2);
        ctx.fill();

        // Gözler
        if (index === 0) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(segment.x + 6, segment.y + 6, 3, 0, Math.PI * 2);
            ctx.arc(segment.x + 14, segment.y + 6, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(segment.x + 6, segment.y + 6, 1.5, 0, Math.PI * 2);
            ctx.arc(segment.x + 14, segment.y + 6, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// ⭐ Yıldız çizim fonksiyonu
function drawStar(cx, cy, spikes, innerRadius, outerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function endGame() {
    gameRunning = false;

    // Yeni en yüksek skoru güncelle
    if (score > highScore) {
        highScore = score;
        document.getElementById("highScore").innerText = highScore;
    }

    // Oyunu durdurduktan sonra menüye dön
    setTimeout(() => {
        document.getElementById("gameScreen").style.display = "none";
        document.getElementById("startMenu").style.display = "block";
    }, 500); // 0.5 saniye bekleme ekleyerek daha doğal bir geçiş sağladık
}


// Menü yönetimi
function startGame() {
    document.getElementById("startMenu").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    initGame();
}
