const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ================= CANVAS =================

function resize() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resize();

window.addEventListener(
    "resize",
    resize
);

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

let jumpPressed = false;

document.addEventListener(
    "keydown",
    e => {

        if (!keys[e.code]) {

            if (
                e.code === settings.jump
            ) {

                jumpPressed = true;

            }

        }

        keys[e.code] = true;

        if (
            e.code === "Escape"
        ) {

            paused = !paused;

        }

        if (
            e.code === "KeyE"
        ) {

            inventoryOpen =
                !inventoryOpen;

        }

    }
);

document.addEventListener(
    "keyup",
    e => {

        keys[e.code] = false;

    }
);

// ================= MOUSE =================

const mouse = {

    x: 0,
    y: 0

};

canvas.addEventListener(
    "mousemove",
    e => {

        const rect =
            canvas.getBoundingClientRect();

        mouse.x =
            e.clientX -
            rect.left;

        mouse.y =
            e.clientY -
            rect.top;

    }
);

// ================= GAME =================

let paused = false;

const BLOCK = 32;

const WORLD_WIDTH = 300;
const WORLD_HEIGHT = 120;

// ================= WORLD =================

let world = [];

const surface = [];

// ================= INVENTORY =================

let inventoryOpen = false;

const inventory = {

    grass: 0,
    dirt: 0,
    stone: 0,
    wood: 0,
    leaf: 0

};

// ================= DROPS =================

let droppedItems = [];

// ================= HOTBAR =================

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
    jumpPower: 12,

    direction: 1,

    onGround: false

};

let walkCycle = 0;

const gravity = 0.7;

// ================= TILE IDS =================

const TILE = {

    AIR: 0,

    GRASS: 1,

    DIRT: 2,

    STONE: 3,

    WOOD: 4,

    LEAF: 5,

    BEDROCK: 6

};

// ================= WORLD GENERATION =================

// create empty world

for (
    let y = 0;
    y < WORLD_HEIGHT;
    y++
) {

    world[y] = [];

    for (
        let x = 0;
        x < WORLD_WIDTH;
        x++
    ) {

        world[y][x] =
            TILE.AIR;

    }

}

// terrain heights

for (
    let x = 0;
    x < WORLD_WIDTH;
    x++
) {

    const height =

        22 +

        Math.floor(
            Math.sin(
                x * 0.15
            ) * 3
        ) +

        Math.floor(
            Math.sin(
                x * 0.04
            ) * 5
        );

    surface[x] = height;

}

// generate terrain

for (
    let x = 0;
    x < WORLD_WIDTH;
    x++
) {

    const h =
        surface[x];

    world[h][x] =
        TILE.GRASS;

    for (
        let y = h + 1;
        y < h + 6;
        y++
    ) {

        world[y][x] =
            TILE.DIRT;

    }

    for (
        let y = h + 6;
        y < WORLD_HEIGHT - 1;
        y++
    ) {

        world[y][x] =
            TILE.STONE;

    }

    world[
        WORLD_HEIGHT - 1
    ][x] = TILE.BEDROCK;

}

// caves

for (
    let i = 0;
    i < 300;
    i++
) {

    const cx =
        Math.floor(
            Math.random() *
            WORLD_WIDTH
        );

    const cy =
        25 +
        Math.floor(
            Math.random() * 70
        );

    const radius =
        2 +
        Math.floor(
            Math.random() * 4
        );

    for (
        let y = -radius;
        y <= radius;
        y++
    ) {

        for (
            let x = -radius;
            x <= radius;
            x++
        ) {

            if (

                x * x +
                y * y <=
                radius * radius

            ) {

                const tx =
                    cx + x;

                const ty =
                    cy + y;

                if (

                    tx > 0 &&
                    ty > 0 &&

                    tx <
                    WORLD_WIDTH &&

                    ty <
                    WORLD_HEIGHT - 1

                ) {

                    world[ty][tx] =
                        TILE.AIR;

                }

            }

        }

    }

}

// trees

for (
    let x = 10;
    x < WORLD_WIDTH;
    x += 18
) {

    const ground =
        surface[x];

    world[
        ground - 1
    ][x] = TILE.WOOD;

    world[
        ground - 2
    ][x] = TILE.WOOD;

    world[
        ground - 3
    ][x] = TILE.WOOD;

    world[
        ground - 4
    ][x] = TILE.LEAF;

    world[
        ground - 5
    ][x] = TILE.LEAF;

    world[
        ground - 4
    ][x - 1] = TILE.LEAF;

    world[
        ground - 4
    ][x + 1] = TILE.LEAF;

    world[
        ground - 3
    ][x - 1] = TILE.LEAF;

    world[
        ground - 3
    ][x + 1] = TILE.LEAF;

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

        return TILE.BEDROCK;

    }

    return world[ty][tx];

}

function setTile(
    tx,
    ty,
    value
) {

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

        tile === TILE.GRASS ||
        tile === TILE.DIRT ||
        tile === TILE.STONE ||
        tile === TILE.WOOD ||
        tile === TILE.LEAF ||
        tile === TILE.BEDROCK

    );

}

// ================= COLLISION =================

function collideAt(x, y) {

    const left =
        Math.floor(
            x / BLOCK
        );

    const right =
        Math.floor(
            (
                x +
                player.width -
                1
            ) / BLOCK
        );

    const top =
        Math.floor(
            y / BLOCK
        );

    const bottom =
        Math.floor(
            (
                y +
                player.height -
                1
            ) / BLOCK
        );

    return (

        isSolid(
            getTile(
                left,
                top
            )
        ) ||

        isSolid(
            getTile(
                right,
                top
            )
        ) ||

        isSolid(
            getTile(
                left,
                bottom
            )
        ) ||

        isSolid(
            getTile(
                right,
                bottom
            )
        )

    );

}

// ================= HEALTH =================

function damage(amount) {

    playerHealth.current -= amount;

    if (
        playerHealth.current <= 0
    ) {

        playerHealth.current = 0;

        respawn();

    }

}

// ================= RESPAWN =================

function respawn() {

    player.x =
        spawnPoint.x;

    player.y =
        spawnPoint.y;

    player.vx = 0;
    player.vy = 0;

    playerHealth.current =
        playerHealth.max;

}

// ================= CAMERA =================

function updateCamera() {

    camera.x =

        player.x -

        canvas.width / 2;

    camera.y =

        player.y -

        canvas.height / 2;

    const maxCamX =

        WORLD_WIDTH *
        BLOCK -

        canvas.width;

    const maxCamY =

        WORLD_HEIGHT *
        BLOCK -

        canvas.height;

    if (
        camera.x < 0
    ) camera.x = 0;

    if (
        camera.y < 0
    ) camera.y = 0;

    if (
        camera.x > maxCamX
    ) camera.x = maxCamX;

    if (
        camera.y > maxCamY
    ) camera.y = maxCamY;

}

// ================= MOVEMENT =================

function updatePlayer() {

    player.vx = 0;

    if (
        keys[settings.left]
    ) {

        player.vx =
            -player.speed;

        player.direction =
            -1;

    }

    if (
        keys[settings.right]
    ) {

        player.vx =
            player.speed;

        player.direction =
            1;

    }

    // jump

    if (
        jumpPressed &&
        player.onGround
    ) {

        player.vy =
            -player.jumpPower;

        player.onGround =
            false;

        jumpPressed =
            false;

    }

    // walk animation

    if (
        Math.abs(
            player.vx
        ) > 0
    ) {

        walkCycle += 0.18;

    }

    // X movement

    player.x +=
        player.vx;

    if (
        collideAt(
            player.x,
            player.y
        )
    ) {

        if (
            player.vx > 0
        ) {

            player.x =

                Math.floor(

                    (
                        player.x +
                        player.width
                    ) / BLOCK

                ) * BLOCK

                -

                player.width

                -

                1;

        }

        else if (
            player.vx < 0
        ) {

            player.x =

                Math.floor(

                    player.x /
                    BLOCK

                ) * BLOCK

                +

                BLOCK;

        }

    }

    // gravity

    player.vy += gravity;

    if (
        player.vy > 20
    ) {

        player.vy = 20;

    }

    player.y +=
        player.vy;

    player.onGround =
        false;

    // Y collision

    if (
        collideAt(
            player.x,
            player.y
        )
    ) {

        if (
            player.vy > 0
        ) {

            player.y =

                Math.floor(

                    (
                        player.y +
                        player.height
                    ) / BLOCK

                ) * BLOCK

                -

                player.height;

            player.vy = 0;

            player.onGround =
                true;

        }

        else if (
            player.vy < 0
        ) {

            player.y =

                Math.floor(

                    player.y /
                    BLOCK

                ) * BLOCK

                +

                BLOCK;

            player.vy = 0;

        }

    }

    // world border

    if (
        player.x < 0
    ) {

        player.x = 0;

    }

    const maxX =

        WORLD_WIDTH *
        BLOCK

        -

        player.width;

    if (
        player.x > maxX
    ) {

        player.x = maxX;

    }

    // void damage

    if (

        player.y >

        WORLD_HEIGHT *
        BLOCK

        + 500

    ) {

        damage(999);

    }

}

// ================= UPDATE =================

function update() {

    updatePlayer();

    updateCamera();

}
// ================= INVENTORY HELPERS =================

function addItem(tile) {

    if (tile === TILE.GRASS)
        inventory.grass++;

    if (tile === TILE.DIRT)
        inventory.dirt++;

    if (tile === TILE.STONE)
        inventory.stone++;

    if (tile === TILE.WOOD)
        inventory.wood++;

    if (tile === TILE.LEAF)
        inventory.leaf++;

}

// ================= DROP SYSTEM =================

function spawnDrop(
    x,
    y,
    tile
) {

    droppedItems.push({

        x: x,
        y: y,

        vx:
            (Math.random() - 0.5)
            * 2,

        vy: -2,

        tile: tile

    });

}

function updateDrops() {

    for (
        let i =
            droppedItems.length - 1;
        i >= 0;
        i--
    ) {

        const item =
            droppedItems[i];

        item.vy += 0.25;

        if (
            item.vy > 8
        ) {
            item.vy = 8;
        }

        item.x += item.vx;
        item.y += item.vy;

        const tx =
            Math.floor(
                item.x / BLOCK
            );

        const ty =
            Math.floor(
                item.y / BLOCK
            );

        if (
            isSolid(
                getTile(tx, ty)
            )
        ) {

            item.y =
                ty * BLOCK - 6;

            item.vy = 0;

        }

        const dx =
            item.x -
            (
                player.x +
                player.width / 2
            );

        const dy =
            item.y -
            (
                player.y +
                player.height / 2
            );

        const dist =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (
            dist < 40
        ) {

            addItem(
                item.tile
            );

            droppedItems.splice(
                i,
                1
            );

        }

    }

}

// ================= RANGE =================

const BREAK_RANGE = 6;
const PLACE_RANGE = 6;

function tileDistance(
    tx,
    ty
) {

    const px =

        Math.floor(

            (
                player.x +
                player.width / 2
            ) / BLOCK

        );

    const py =

        Math.floor(

            (
                player.y +
                player.height / 2
            ) / BLOCK

        );

    const dx =
        tx - px;

    const dy =
        ty - py;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}

// ================= PLAYER TILE =================

function playerInsideTile(
    tx,
    ty
) {

    const bx =
        tx * BLOCK;

    const by =
        ty * BLOCK;

    return (

        player.x <
            bx + BLOCK &&

        player.x +
            player.width >
            bx &&

        player.y <
            by + BLOCK &&

        player.y +
            player.height >
            by

    );

}

// ================= NEIGHBOR CHECK =================

function hasNeighbor(
    tx,
    ty
) {

    return (

        getTile(
            tx + 1,
            ty
        ) !== TILE.AIR ||

        getTile(
            tx - 1,
            ty
        ) !== TILE.AIR ||

        getTile(
            tx,
            ty + 1
        ) !== TILE.AIR ||

        getTile(
            tx,
            ty - 1
        ) !== TILE.AIR

    );

}

// ================= MOUSE EVENTS =================

canvas.addEventListener(
    "mousedown",
    e => {

        if (paused)
            return;

        if (inventoryOpen)
            return;

        const tx =
            Math.floor(
                (
                    mouse.x +
                    camera.x
                ) / BLOCK
            );

        const ty =
            Math.floor(
                (
                    mouse.y +
                    camera.y
                ) / BLOCK
            );

        // ================= BREAK =================

        if (
            e.button === 0
        ) {

            if (
                tileDistance(
                    tx,
                    ty
                ) >
                BREAK_RANGE
            ) return;

            const tile =
                getTile(
                    tx,
                    ty
                );

            if (
                tile ===
                TILE.AIR
            ) return;

            if (
                tile ===
                TILE.BEDROCK
            ) return;

            // stone drops only later with tools
            if (
                tile !==
                TILE.STONE
            ) {

                spawnDrop(

                    tx * BLOCK +
                    BLOCK / 2,

                    ty * BLOCK +
                    BLOCK / 2,

                    tile

                );

            }

            setTile(
                tx,
                ty,
                TILE.AIR
            );

        }

        // ================= PLACE =================

        if (
            e.button === 2
        ) {

            if (
                tileDistance(
                    tx,
                    ty
                ) >
                PLACE_RANGE
            ) return;

            if (
                getTile(
                    tx,
                    ty
                ) !== TILE.AIR
            ) return;

            if (
                playerInsideTile(
                    tx,
                    ty
                )
            ) return;

            if (
                !hasNeighbor(
                    tx,
                    ty
                )
            ) return;

            setTile(
                tx,
                ty,
                selectedBlock
            );

        }

    }
);

canvas.addEventListener(
    "contextmenu",
    e =>
        e.preventDefault()
);

// ================= UPDATE OVERRIDE =================

function update() {

    updatePlayer();

    updateCamera();

    updateDrops();

}
// ================= PLAYER DRAW =================

function drawStickman(x, y) {

    const leg =
        Math.sin(
            walkCycle
        ) * 8;

    const arm =
        Math.sin(
            walkCycle
        ) * 6;

    ctx.strokeStyle =
        "black";

    ctx.lineWidth = 3;

    // head

    ctx.beginPath();

    ctx.arc(
        x + 12,
        y + 10,
        8,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    // body

    ctx.beginPath();

    ctx.moveTo(
        x + 12,
        y + 18
    );

    ctx.lineTo(
        x + 12,
        y + 35
    );

    // arms

    ctx.moveTo(
        x + 12,
        y + 24
    );

    ctx.lineTo(
        x + 12 - arm,
        y + 30
    );

    ctx.moveTo(
        x + 12,
        y + 24
    );

    ctx.lineTo(
        x + 12 + arm,
        y + 30
    );

    // legs

    ctx.moveTo(
        x + 12,
        y + 35
    );

    ctx.lineTo(
        x + 4 + leg,
        y + 50
    );

    ctx.moveTo(
        x + 12,
        y + 35
    );

    ctx.lineTo(
        x + 20 - leg,
        y + 50
    );

    ctx.stroke();

    // eye

    ctx.fillStyle =
        "black";

    const eyeX =

        player.direction === 1

        ?

        x + 15

        :

        x + 9;

    ctx.beginPath();

    ctx.arc(
        eyeX,
        y + 8,
        1.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

}

// ================= WORLD DRAW =================

function drawWorld() {

    const startX =

        Math.floor(
            camera.x / BLOCK
        );

    const endX =

        startX +

        Math.ceil(
            canvas.width / BLOCK
        ) + 2;

    const startY =

        Math.floor(
            camera.y / BLOCK
        );

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

            if (
                tile === TILE.AIR
            ) continue;

            if (
                tile === TILE.GRASS
            )
                ctx.fillStyle =
                    "#4CAF50";

            if (
                tile === TILE.DIRT
            )
                ctx.fillStyle =
                    "#8B5A2B";

            if (
                tile === TILE.STONE
            )
                ctx.fillStyle =
                    "#777777";

            if (
                tile === TILE.WOOD
            )
                ctx.fillStyle =
                    "#6b3e1d";

            if (
                tile === TILE.LEAF
            )
                ctx.fillStyle =
                    "#2ecc71";

            if (
                tile === TILE.BEDROCK
            )
                ctx.fillStyle =
                    "#222";

            ctx.fillRect(

                x * BLOCK -
                camera.x,

                y * BLOCK -
                camera.y,

                BLOCK,
                BLOCK

            );

            ctx.strokeStyle =
                "rgba(0,0,0,0.1)";

            ctx.strokeRect(

                x * BLOCK -
                camera.x,

                y * BLOCK -
                camera.y,

                BLOCK,
                BLOCK

            );

        }

    }

}

// ================= DROPS DRAW =================

function drawDrops() {

    for (
        const item
        of droppedItems
    ) {

        if (
            item.tile === TILE.GRASS
        )
            ctx.fillStyle =
                "#4CAF50";

        if (
            item.tile === TILE.DIRT
        )
            ctx.fillStyle =
                "#8B5A2B";

        if (
            item.tile === TILE.STONE
        )
            ctx.fillStyle =
                "#777777";

        if (
            item.tile === TILE.WOOD
        )
            ctx.fillStyle =
                "#6b3e1d";

        if (
            item.tile === TILE.LEAF
        )
            ctx.fillStyle =
                "#2ecc71";

        ctx.fillRect(

            item.x -
            camera.x - 6,

            item.y -
            camera.y - 6,

            12,
            12

        );

    }

}

// ================= HEALTH BAR =================

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

}

// ================= HOTBAR =================

function drawHotbar() {

    const slots =
        [1,2,3,4,5];

    const size = 55;

    const startX =

        canvas.width / 2 -

        (
            slots.length *
            size
        ) / 2;

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

            block ===
            selectedBlock

            ?

            "#ffe066"

            :

            "#444";

        ctx.fillRect(

            startX +
            i * size,

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

            startX +
            i * size +
            8,

            y + 8,

            34,
            34

        );

    }

}

// ================= INVENTORY =================

function drawInventory() {

    if (
        !inventoryOpen
    ) return;

    ctx.fillStyle =
        "rgba(0,0,0,0.85)";

    ctx.fillRect(

        canvas.width / 2 - 250,
        canvas.height / 2 - 180,

        500,
        360

    );

    ctx.fillStyle =
        "white";

    ctx.font =
        "28px Arial";

    ctx.fillText(

        "Inventory",

        canvas.width / 2 - 60,

        canvas.height / 2 - 130

    );

    ctx.font =
        "22px Arial";

    ctx.fillText(
        "Grass: " +
        inventory.grass,
        canvas.width / 2 - 180,
        canvas.height / 2 - 60
    );

    ctx.fillText(
        "Dirt: " +
        inventory.dirt,
        canvas.width / 2 - 180,
        canvas.height / 2 - 20
    );

    ctx.fillText(
        "Stone: " +
        inventory.stone,
        canvas.width / 2 - 180,
        canvas.height / 2 + 20
    );

    ctx.fillText(
        "Wood: " +
        inventory.wood,
        canvas.width / 2 - 180,
        canvas.height / 2 + 60
    );

    ctx.fillText(
        "Leaf: " +
        inventory.leaf,
        canvas.width / 2 - 180,
        canvas.height / 2 + 100
    );

}
// ================= PAUSE MENU =================

function drawPauseMenu() {

    ctx.fillStyle =
        "rgba(0,0,0,0.65)";

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
        canvas.height / 2 - 60
    );

    ctx.font =
        "24px Arial";

    ctx.fillText(
        "ESC = Resume",
        canvas.width / 2,
        canvas.height / 2 + 10
    );

    ctx.fillText(
        "E = Inventory",
        canvas.width / 2,
        canvas.height / 2 + 50
    );

    ctx.textAlign =
        "left";

}

// ================= FPS =================

function updateFPS() {

    frames++;

    const now =
        performance.now();

    if (
        now -
        lastFpsTime >=
        1000
    ) {

        fps = frames;

        frames = 0;

        lastFpsTime = now;

    }

}

// ================= DRAW =================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // sky

    ctx.fillStyle =
        "#87CEEB";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // world

    drawWorld();

    // drops

    drawDrops();

    // player

    drawStickman(
        player.x -
        camera.x,

        player.y -
        camera.y
    );

    // ui

    drawHealthBar();

    drawHotbar();

    drawInventory();

    // fps

    ctx.fillStyle =
        "black";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        "FPS: " + fps,
        20,
        80
    );

    ctx.fillText(
        "Drops: " +
        droppedItems.length,
        20,
        105
    );

    // version

    ctx.fillText(
        "Modern Blocks v0.6",
        20,
        130
    );

    if (paused) {

        drawPauseMenu();

    }

}

// ================= GAME LOOP =================

function gameLoop() {

    if (!paused) {

        update();

    }

    draw();

    updateFPS();

    requestAnimationFrame(
        gameLoop
    );

}

// ================= START =================

gameLoop();
