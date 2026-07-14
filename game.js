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

// ================= INPUT =================

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

// ================= MOUSE =================

const mouse = {
    x: 0,
    y: 0
};

canvas.addEventListener("mousemove", e => {

    const rect = canvas.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

});

// ================= GAME =================

let paused = false;

const BLOCK = 32;

const WORLD_WIDTH = 300;
const WORLD_HEIGHT = 100;

let world = [];

// ================= INVENTORY =================

const inventory = {
    grass: 999,
    dirt: 999,
    stone: 999,
    wood: 999,
    leaf: 999
};

let selectedBlock = 2;

// ================= HEALTH =================

const playerHealth = {
    max: 100,
    current: 100
};

// ================= CAMERA =================

const camera = {
    x: 0,
    y: 0
};

// ================= PLAYER =================

const spawnPoint = {
    x: 500,
    y: 200
};

const player = {

    x: spawnPoint.x,
    y: spawnPoint.y,

    width: 24,
    height: 50,

    vx: 0,
    vy: 0,

    speed: 4,
    jumpPower: 14,

    onGround: false

};

const gravity = 0.7;

// ================= WORLD =================

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

// ================= TREES =================

for (let t = 8; t < WORLD_WIDTH; t += 18) {

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

// ================= HELPERS =================

function getTile(tx, ty) {

    if (
        tx < 0 ||
        ty < 0 ||
        tx >= WORLD_WIDTH ||
        ty >= WORLD_HEIGHT
    ) {
        return 3;
    }

    return world[ty][tx];

}

function setTile(tx, ty, value) {

    if (
        tx < 0 ||
        ty < 0 ||
        tx >= WORLD_WIDTH ||
        ty >= WORLD_HEIGHT
    ) return;

    world[ty][tx] = value;

}

function isSolid(tile) {

    return (
        tile === 1 ||
        tile === 2 ||
        tile === 3 ||
        tile === 4
    );

}

// ================= RESPAWN =================

function respawn() {

    player.x = spawnPoint.x;
    player.y = spawnPoint.y;

    player.vx = 0;
    player.vy = 0;

    playerHealth.current =
        playerHealth.max;

}

// ================= DAMAGE =================

function damage(amount) {

    playerHealth.current -= amount;

    if (
        playerHealth.current <= 0
    ) {

        playerHealth.current = 0;

        respawn();

    }

}
// ================= COLLISION =================

function collideAt(x, y) {

    const left =
        Math.floor(x / BLOCK);

    const right =
        Math.floor(
            (x + player.width - 1) / BLOCK
        );

    const top =
        Math.floor(y / BLOCK);

    const bottom =
        Math.floor(
            (y + player.height - 1) / BLOCK
        );

    return (

        isSolid(
            getTile(left, top)
        ) ||

        isSolid(
            getTile(right, top)
        ) ||

        isSolid(
            getTile(left, bottom)
        ) ||

        isSolid(
            getTile(right, bottom)
        )

    );

}

// ================= UPDATE =================

function update() {

    // hotbar keys

    if (keys["Digit1"]) selectedBlock = 1;
    if (keys["Digit2"]) selectedBlock = 2;
    if (keys["Digit3"]) selectedBlock = 3;
    if (keys["Digit4"]) selectedBlock = 4;
    if (keys["Digit5"]) selectedBlock = 5;

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

        player.vy =
            -player.jumpPower;

        player.onGround = false;

    }

    // ================= X COLLISION =================

    player.x += player.vx;

    if (
        collideAt(
            player.x,
            player.y
        )
    ) {

        if (player.vx > 0) {

            player.x =
                Math.floor(
                    (player.x +
                     player.width) / BLOCK
                ) * BLOCK
                - player.width - 1;

        }

        else if (player.vx < 0) {

            player.x =
                Math.floor(
                    player.x / BLOCK
                ) * BLOCK + BLOCK;

        }

    }

    // ================= GRAVITY =================

    player.vy += gravity;

    if (player.vy > 20)
        player.vy = 20;

    player.y += player.vy;

    player.onGround = false;

    // ================= Y COLLISION =================

    if (
        collideAt(
            player.x,
            player.y
        )
    ) {

        if (player.vy > 0) {

            player.y =
                Math.floor(
                    (player.y +
                     player.height) / BLOCK
                ) * BLOCK
                - player.height;

            player.vy = 0;

            player.onGround = true;

        }

        else if (player.vy < 0) {

            player.y =
                Math.floor(
                    player.y / BLOCK
                ) * BLOCK + BLOCK;

            player.vy = 0;

        }

    }

    // ================= WORLD LIMITS =================

    if (player.x < 0)
        player.x = 0;

    const maxX =
        WORLD_WIDTH * BLOCK
        - player.width;

    if (player.x > maxX)
        player.x = maxX;

    // ================= VOID =================

    if (
        player.y >
        WORLD_HEIGHT * BLOCK + 500
    ) {

        damage(999);

    }

    // ================= CAMERA =================

    camera.x =
        player.x -
        canvas.width / 2;

    camera.y =
        player.y -
        canvas.height / 2;

    const maxCamX =
        WORLD_WIDTH * BLOCK
        - canvas.width;

    const maxCamY =
        WORLD_HEIGHT * BLOCK
        - canvas.height;

    if (camera.x < 0)
        camera.x = 0;

    if (camera.y < 0)
        camera.y = 0;

    if (camera.x > maxCamX)
        camera.x = maxCamX;

    if (camera.y > maxCamY)
        camera.y = maxCamY;

}

// ================= BLOCK BREAK =================

canvas.addEventListener(
    "mousedown",
    e => {

        if (paused) return;

        const worldX =
            Math.floor(
                (mouse.x + camera.x)
                / BLOCK
            );

        const worldY =
            Math.floor(
                (mouse.y + camera.y)
                / BLOCK
            );

        // left click

        if (e.button === 0) {

            const tile =
                getTile(
                    worldX,
                    worldY
                );

            if (
                tile !== 0 &&
                tile !== 1
            ) {

                setTile(
                    worldX,
                    worldY,
                    0
                );

            }

        }

        // right click

        if (e.button === 2) {

            if (
                getTile(
                    worldX,
                    worldY
                ) === 0
            ) {

                setTile(
                    worldX,
                    worldY,
                    selectedBlock
                );

            }

        }

    }
);

canvas.addEventListener(
    "contextmenu",
    e => e.preventDefault()
);
// ================= STICKMAN =================

function drawStickman(x, y) {

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(
        x + 12,
        y + 10,
        8,
        0,
        Math.PI * 2
    );
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

// ================= WORLD =================

function drawWorld() {

    const startX =
        Math.floor(camera.x / BLOCK);

    const endX =
        startX +
        Math.ceil(
            canvas.width / BLOCK
        ) + 2;

    const startY =
        Math.floor(camera.y / BLOCK);

    const endY =
        startY +
        Math.ceil(
            canvas.height / BLOCK
        ) + 2;

    for (
        let y = startY;
        y < endY;
        y++
    ) {

        for (
            let x = startX;
            x < endX;
            x++
        ) {

            if (
                x < 0 ||
                y < 0 ||
                x >= WORLD_WIDTH ||
                y >= WORLD_HEIGHT
            ) continue;

            const tile =
                world[y][x];

            if (tile === 0)
                continue;

            if (tile === 1)
                ctx.fillStyle =
                    "#4CAF50";

            if (tile === 2)
                ctx.fillStyle =
                    "#8B5A2B";

            if (tile === 3)
                ctx.fillStyle =
                    "#777777";

            if (tile === 4)
                ctx.fillStyle =
                    "#6b3e1d";

            if (tile === 5)
                ctx.fillStyle =
                    "#2ecc71";

            ctx.fillRect(
                x * BLOCK - camera.x,
                y * BLOCK - camera.y,
                BLOCK,
                BLOCK
            );

            ctx.strokeStyle =
                "rgba(0,0,0,0.12)";

            ctx.strokeRect(
                x * BLOCK - camera.x,
                y * BLOCK - camera.y,
                BLOCK,
                BLOCK
            );

        }

    }

}

// ================= UI =================

function drawHealthBar() {

    ctx.fillStyle =
        "rgba(0,0,0,0.4)";

    ctx.fillRect(
        15,
        15,
        220,
        30
    );

    ctx.fillStyle =
        "#ff4040";

    ctx.fillRect(
        15,
        15,
        (
            playerHealth.current /
            playerHealth.max
        ) * 220,
        30
    );

    ctx.strokeStyle =
        "black";

    ctx.strokeRect(
        15,
        15,
        220,
        30
    );

    ctx.fillStyle =
        "white";

    ctx.font =
        "16px Arial";

    ctx.fillText(
        "HP: " +
        playerHealth.current +
        "/" +
        playerHealth.max,
        25,
        35
    );

}

function drawHotbar() {

    const slots = [
        1,
        2,
        3,
        4,
        5
    ];

    const size = 55;

    const startX =
        canvas.width / 2 -
        (slots.length * size) / 2;

    const y =
        canvas.height - 80;

    for (
        let i = 0;
        i < slots.length;
        i++
    ) {

        const block =
            slots[i];

        ctx.fillStyle =
            block === selectedBlock
            ? "#ffe066"
            : "#444";

        ctx.fillRect(
            startX + i * size,
            y,
            50,
            50
        );

        if (block === 1)
            ctx.fillStyle =
                "#4CAF50";

        if (block === 2)
            ctx.fillStyle =
                "#8B5A2B";

        if (block === 3)
            ctx.fillStyle =
                "#777777";

        if (block === 4)
            ctx.fillStyle =
                "#6b3e1d";

        if (block === 5)
            ctx.fillStyle =
                "#2ecc71";

        ctx.fillRect(
            startX + i * size + 8,
            y + 8,
            34,
            34
        );

        ctx.fillStyle =
            "white";

        ctx.font =
            "14px Arial";

        ctx.fillText(
            i + 1,
            startX +
            i * size +
            20,
            y + 48
        );

    }

}

function drawPauseMenu() {

    ctx.fillStyle =
        "rgba(0,0,0,0.55)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
        "white";

    ctx.textAlign =
        "center";

    ctx.font =
        "60px Arial";

    ctx.fillText(
        "PAUSED",
        canvas.width / 2,
        canvas.height / 2 - 80
    );

    ctx.font =
        "28px Arial";

    ctx.fillText(
        "ESC = Resume",
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.fillText(
        "Modern Blocks v0.4",
        canvas.width / 2,
        canvas.height / 2 + 60
    );

    ctx.textAlign =
        "left";

}

// ================= DRAW =================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
        "#87CEEB";

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

    drawHealthBar();

    drawHotbar();

    ctx.fillStyle =
        "black";

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "FPS: " + fps,
        20,
        80
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
        now - lastFpsTime >=
        1000
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
