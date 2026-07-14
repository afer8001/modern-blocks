const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ================= SETTINGS =================

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

    if (e.code === "Escape") {
        paused = !paused;
    }
});

document.addEventListener("keyup", e => {
    keys[e.code] = false;
});

// ================= GAME =================

let paused = false;

const BLOCK = 32;
const WORLD_WIDTH = 300;
const WORLD_HEIGHT = 100;

let world = [];

const camera = {
    x: 0,
    y: 0
};

// ================= PLAYER =================

const player = {
    x: 500,
    y: 0,
    width: 24,
    height: 50,
    vx: 0,
    vy: 0,
    speed: 4,
    jumpPower: 14,
    onGround: false
};

const gravity = 0.7;

// ================= WORLD GENERATION =================

for (let y = 0; y < WORLD_HEIGHT; y++) {

    world[y] = [];

    for (let x = 0; x < WORLD_WIDTH; x++) {

        if (y < 20) {
            world[y][x] = 0;
        }
        else if (y === 20) {
            world[y][x] = 1;
        }
        else if (y < 28) {
            world[y][x] = 2;
        }
        else {
            world[y][x] = 3;
        }

    }
}

// trees

for (let t = 5; t < WORLD_WIDTH; t += 18) {

    const baseY = 19;

    world[baseY][t] = 4;
    world[baseY - 1][t] = 4;
    world[baseY - 2][t] = 4;

    world[baseY - 3][t] = 5;
    world[baseY - 4][t] = 5;
    world[baseY - 3][t - 1] = 5;
    world[baseY - 3][t + 1] = 5;
    world[baseY - 2][t - 1] = 5;
    world[baseY - 2][t + 1] = 5;
}

// ================= FPS =================

let fps = 0;
let frames = 0;
let lastFpsTime = performance.now();

// ================= COLLISION =================

function isSolid(tile) {

    return (
        tile === 1 ||
        tile === 2 ||
        tile === 3 ||
        tile === 4
    );

}

function getTile(tx, ty) {

    if (
        ty < 0 ||
        ty >= WORLD_HEIGHT ||
        tx < 0 ||
        tx >= WORLD_WIDTH
    ) {
        return 0;
    }

    return world[ty][tx];

}

// ================= UPDATE =================

function update() {

    player.vx = 0;

    if (keys[settings.left]) {
        player.vx = -player.speed;
    }

    if (keys[settings.right]) {
        player.vx = player.speed;
    }

    if (
        keys[settings.jump] &&
        player.onGround
    ) {
        player.vy = -player.jumpPower;
        player.onGround = false;
    }

    // horizontal

    player.x += player.vx;

    // gravity

    player.vy += gravity;
    player.y += player.vy;

    player.onGround = false;

    const leftTile =
        Math.floor(player.x / BLOCK);

    const rightTile =
        Math.floor(
            (player.x + player.width) / BLOCK
        );

    const bottomTile =
        Math.floor(
            (player.y + player.height) / BLOCK
        );

    if (
        isSolid(getTile(leftTile, bottomTile)) ||
        isSolid(getTile(rightTile, bottomTile))
    ) {

        player.y =
            bottomTile * BLOCK -
            player.height;

        player.vy = 0;
        player.onGround = true;
    }

    // camera

    camera.x =
        player.x -
        canvas.width / 2;

    camera.y =
        player.y -
        canvas.height / 2;

    if (camera.x < 0)
        camera.x = 0;

    if (camera.y < 0)
        camera.y = 0;
}

// ================= STICKMAN =================

function drawStickman(x, y) {

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(x + 12, y + 10, 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(x + 12, y + 18);
    ctx.lineTo(x + 12, y + 35);

    ctx.moveTo(x + 12, y + 24);
    ctx.lineTo(x, y + 30);

    ctx.moveTo(x + 12, y + 24);
    ctx.lineTo(x + 24, y + 30);

    ctx.moveTo(x + 12, y + 35);
    ctx.lineTo(x + 4, y + 50);

    ctx.moveTo(x + 12, y + 35);
    ctx.lineTo(x + 20, y + 50);

    ctx.stroke();
}

// ================= DRAW WORLD =================

function drawWorld() {

    const startX =
        Math.floor(camera.x / BLOCK);

    const endX =
        startX +
        Math.ceil(canvas.width / BLOCK) + 2;

    const startY =
        Math.floor(camera.y / BLOCK);

    const endY =
        startY +
        Math.ceil(canvas.height / BLOCK) + 2;

    for (let y = startY; y < endY; y++) {

        for (let x = startX; x < endX; x++) {

            if (
                y < 0 ||
                y >= WORLD_HEIGHT ||
                x < 0 ||
                x >= WORLD_WIDTH
            ) continue;

            const tile = world[y][x];

            if (tile === 0) continue;

            if (tile === 1)
                ctx.fillStyle = "#4CAF50";

            if (tile === 2)
                ctx.fillStyle = "#8B5A2B";

            if (tile === 3)
                ctx.fillStyle = "#777";

            if (tile === 4)
                ctx.fillStyle = "#6b3e1d";

            if (tile === 5)
                ctx.fillStyle = "#2ecc71";

            ctx.fillRect(
                x * BLOCK - camera.x,
                y * BLOCK - camera.y,
                BLOCK,
                BLOCK
            );

            ctx.strokeStyle =
                "rgba(0,0,0,0.15)";

            ctx.strokeRect(
                x * BLOCK - camera.x,
                y * BLOCK - camera.y,
                BLOCK,
                BLOCK
            );

        }

    }

}

// ================= PAUSE =================

function drawPauseMenu() {

    ctx.fillStyle =
        "rgba(0,0,0,0.5)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "60px Arial";

    ctx.fillText(
        "PAUSED",
        canvas.width / 2,
        canvas.height / 2 - 60
    );

    ctx.font = "30px Arial";

    ctx.fillText(
        "ESC = Resume",
        canvas.width / 2,
        canvas.height / 2 + 10
    );

    ctx.textAlign = "left";
}

// ================= DRAW =================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#87CEEB";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawWorld();

    drawStickman(
        player.x - camera.x,
        player.y - camera.y
    );

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";

    ctx.fillText(
        "FPS: " + fps,
        20,
        30
    );

    if (paused) {
        drawPauseMenu();
    }

}

// ================= LOOP =================

function gameLoop() {

    if (!paused) {
        update();
    }

    draw();

    frames++;

    const now =
        performance.now();

    if (
        now - lastFpsTime >= 1000
    ) {
        fps = frames;
        frames = 0;
        lastFpsTime = now;
    }

    requestAnimationFrame(
        gameLoop
    );

}

gameLoop();
