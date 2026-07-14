const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ===== Keybinds =====

let settings = JSON.parse(
    localStorage.getItem("settings")
) || {
    left: "KeyA",
    right: "KeyD",
    jump: "Space"
};

const keys = {};

document.addEventListener("keydown", e => {
    keys[e.code] = true;
});

document.addEventListener("keyup", e => {
    keys[e.code] = false;
});

// ===== Player =====

const player = {
    x: 100,
    y: 100,
    width: 30,
    height: 60,
    vx: 0,
    vy: 0,
    speed: 5,
    jumpPower: 14,
    onGround: false
};

const gravity = 0.7;
const groundY = 500;

// ===== FPS =====

let fps = 0;
let frames = 0;
let lastFpsTime = performance.now();

// ===== Update =====

function update() {

    player.vx = 0;

    if (keys[settings.left]) {
        player.vx = -player.speed;
    }

    if (keys[settings.right]) {
        player.vx = player.speed;
    }

    if (keys[settings.jump] && player.onGround) {
        player.vy = -player.jumpPower;
        player.onGround = false;
    }

    player.x += player.vx;

    player.vy += gravity;
    player.y += player.vy;

    if (player.y + player.height >= groundY) {
        player.y = groundY - player.height;
        player.vy = 0;
        player.onGround = true;
    }
}

// ===== Draw Stickman =====

function drawStickman(x, y) {

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(x + 15, y + 12, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(x + 15, y + 22);
    ctx.lineTo(x + 15, y + 45);

    ctx.moveTo(x + 15, y + 30);
    ctx.lineTo(x, y + 40);

    ctx.moveTo(x + 15, y + 30);
    ctx.lineTo(x + 30, y + 40);

    ctx.moveTo(x + 15, y + 45);
    ctx.lineTo(x + 5, y + 60);

    ctx.moveTo(x + 15, y + 45);
    ctx.lineTo(x + 25, y + 60);

    ctx.stroke();
}

// ===== Draw =====

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sky
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = "#45c945";
    ctx.fillRect(0, groundY, canvas.width, canvas.height);

    drawStickman(player.x, player.y);

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";

    ctx.fillText("FPS: " + fps, 20, 30);
    ctx.fillText("Left: " + settings.left, 20, 60);
    ctx.fillText("Right: " + settings.right, 20, 90);
    ctx.fillText("Jump: " + settings.jump, 20, 120);
}

// ===== Loop =====

function gameLoop() {

    update();
    draw();

    frames++;

    const now = performance.now();

    if (now - lastFpsTime >= 1000) {
        fps = frames;
        frames = 0;
        lastFpsTime = now;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
