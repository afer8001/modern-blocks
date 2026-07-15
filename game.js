// ======================================================
// MODERN BLOCKS
// VERSION 0.9 REBUILD
// PART 1/10
// ENGINE + INPUT + TEXTURES
// ======================================================

// ================= CANVAS =================

const canvas =
    document.getElementById("game");

const ctx =
    canvas.getContext("2d");

function resize() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}

resize();

window.addEventListener(
    "resize",
    resize
);

// ================= SETTINGS =================

const BLOCK = 32;

const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 180;

const GRAVITY = 0.7;

// ================= GAME STATES =================

let paused = false;

let inventoryOpen = false;

let craftingTableOpen = false;

// ================= INPUT =================

const keys = {};

document.addEventListener(
    "keydown",
    e => {

        keys[e.code] = true;

        // Inventory

        if (e.code === "KeyE") {

            if (
                craftingTableOpen
            ) {

                craftingTableOpen = false;
                return;

            }

            if (
                paused
            ) {

                return;

            }

            inventoryOpen =
                !inventoryOpen;

        }

        // Pause

        if (e.code === "Escape") {

            if (
                craftingTableOpen
            ) {

                craftingTableOpen = false;
                return;

            }

            if (
                inventoryOpen
            ) {

                inventoryOpen = false;
                return;

            }

            paused =
                !paused;

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
    y: 0,

    left: false,
    right: false

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

canvas.addEventListener(
    "mousedown",
    e => {

        if (
            e.button === 0
        ) {

            mouse.left = true;

        }

        if (
            e.button === 2
        ) {

            mouse.right = true;

        }

    }
);

canvas.addEventListener(
    "mouseup",
    e => {

        if (
            e.button === 0
        ) {

            mouse.left = false;

        }

        if (
            e.button === 2
        ) {

            mouse.right = false;

        }

    }
);

canvas.addEventListener(
    "contextmenu",
    e => {

        e.preventDefault();

    }
);

// ================= TILE IDS =================

const TILE = {

    AIR: 0,

    GRASS: 1,

    DIRT: 2,

    STONE: 3,

    WOOD: 4,

    LEAF: 5,

    BEDROCK: 6,

    CRAFTING_TABLE: 7

};

// ================= ITEM IDS =================

const ITEM = {

    NONE: 0,

    GRASS: 1,

    DIRT: 2,

    STONE: 3,

    WOOD: 4,

    LEAF: 5,

    PLANK: 6,

    STICK: 7,

    CRAFTING_TABLE: 8,

    WOODEN_PICKAXE: 9,

    WOODEN_AXE: 10,

    STONE_PICKAXE: 11,

    STONE_AXE: 12

};

// ================= TOOL IDS =================

const TOOL = {

    NONE: 0,

    WOODEN_PICKAXE: 1,

    WOODEN_AXE: 2,

    STONE_PICKAXE: 3,

    STONE_AXE: 4

};

// ================= TEXTURES =================

const textures = {

    grass: new Image(),
    dirt: new Image(),
    stone: new Image(),
    wood: new Image(),
    leaf: new Image(),

    bedrock: new Image(),

    plank: new Image(),
    stick: new Image(),

    craftingTable:
        new Image(),

    woodenPickaxe:
        new Image(),

    woodenAxe:
        new Image(),

    stonePickaxe:
        new Image(),

    stoneAxe:
        new Image()

};

// ================= LOAD TEXTURES =================

textures.grass.src =
    "textures/grass.png";

textures.dirt.src =
    "textures/dirt.png";

textures.stone.src =
    "textures/stone.png";

textures.wood.src =
    "textures/wood.png";

textures.leaf.src =
    "textures/leaf.png";

textures.bedrock.src =
    "textures/bedrock.png";

textures.plank.src =
    "textures/plank.png";

textures.stick.src =
    "textures/stick.png";

textures.craftingTable.src =
    "textures/crafting_table.png";

textures.woodenPickaxe.src =
    "textures/wooden_pickaxe.png";

textures.woodenAxe.src =
    "textures/wooden_axe.png";

textures.stonePickaxe.src =
    "textures/stone_pickaxe.png";

textures.stoneAxe.src =
    "textures/stone_axe.png";

// ================= WORLD =================

let world = [];

// ================= CAMERA =================

const camera = {

    x: 0,
    y: 0

};

// ================= FPS =================

let fps = 0;

let frames = 0;

let lastFpsTime =
    performance.now();
// ======================================================
// MODERN BLOCKS
// VERSION 0.9 REBUILD
// PART 2/10
// WORLD GENERATION
// ======================================================

// ================= TERRAIN SETTINGS =================

const SURFACE_LEVEL = 45;

const HILL_HEIGHT = 12;

const CAVE_DEPTH = 65;

// ================= HEIGHT MAP =================

const heightMap = [];

let currentHeight =
    SURFACE_LEVEL;

for (
    let x = 0;
    x < WORLD_WIDTH;
    x++
) {

    currentHeight +=

        Math.floor(
            Math.random() * 3
        ) - 1;

    if (
        currentHeight <
        SURFACE_LEVEL -
        HILL_HEIGHT
    ) {

        currentHeight =
            SURFACE_LEVEL -
            HILL_HEIGHT;

    }

    if (
        currentHeight >
        SURFACE_LEVEL +
        HILL_HEIGHT
    ) {

        currentHeight =
            SURFACE_LEVEL +
            HILL_HEIGHT;

    }

    heightMap[x] =
        currentHeight;

}

// ================= CREATE WORLD =================

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

        const surface =
            heightMap[x];

        if (
            y < surface
        ) {

            world[y][x] =
                TILE.AIR;

        }

        else if (
            y === surface
        ) {

            world[y][x] =
                TILE.GRASS;

        }

        else if (
            y < surface + 6
        ) {

            world[y][x] =
                TILE.DIRT;

        }

        else {

            world[y][x] =
                TILE.STONE;

        }

    }

}

// ================= BEDROCK =================

for (
    let x = 0;
    x < WORLD_WIDTH;
    x++
) {

    world[
        WORLD_HEIGHT - 1
    ][x] =
        TILE.BEDROCK;

}

// ================= CAVES =================

for (
    let i = 0;
    i < 700;
    i++
) {

    let cx =

        Math.floor(
            Math.random() *
            WORLD_WIDTH
        );

    let cy =

        CAVE_DEPTH +

        Math.floor(
            Math.random() *
            (
                WORLD_HEIGHT -
                CAVE_DEPTH -
                20
            )
        );

    const length =

        20 +

        Math.floor(
            Math.random() * 40
        );

    for (
        let j = 0;
        j < length;
        j++
    ) {

        const radius =

            2 +

            Math.floor(
                Math.random() * 3
            );

        for (
            let yy = -radius;
            yy <= radius;
            yy++
        ) {

            for (
                let xx = -radius;
                xx <= radius;
                xx++
            ) {

                const tx =
                    cx + xx;

                const ty =
                    cy + yy;

                if (

                    tx < 0 ||
                    tx >= WORLD_WIDTH ||

                    ty < CAVE_DEPTH ||
                    ty >= WORLD_HEIGHT - 1

                ) {

                    continue;

                }

                const dist =

                    Math.sqrt(
                        xx * xx +
                        yy * yy
                    );

                if (
                    dist <= radius
                ) {

                    world[ty][tx] =
                        TILE.AIR;

                }

            }

        }

        cx +=

            Math.floor(
                Math.random() * 3
            ) - 1;

        cy +=

            Math.floor(
                Math.random() * 3
            ) - 1;

    }

}

// ================= TREES =================

for (
    let x = 12;
    x < WORLD_WIDTH - 12;
    x++
) {

    if (
        Math.random() > 0.08
    ) continue;

    const surface =
        heightMap[x];

    const treeHeight =

        4 +

        Math.floor(
            Math.random() * 3
        );

    // trunk

    for (
        let h = 1;
        h <= treeHeight;
        h++
    ) {

        world[
            surface - h
        ][x] =
            TILE.WOOD;

    }

    const top =

        surface -
        treeHeight;

    // leaves

    for (
        let ly = -2;
        ly <= 2;
        ly++
    ) {

        for (
            let lx = -2;
            lx <= 2;
            lx++
        ) {

            const tx =
                x + lx;

            const ty =
                top + ly;

            if (

                tx < 0 ||
                tx >= WORLD_WIDTH ||

                ty < 0 ||
                ty >= WORLD_HEIGHT

            ) {

                continue;

            }

            const dist =

                Math.abs(lx) +
                Math.abs(ly);

            if (
                dist <= 3
            ) {

                if (
                    world[ty][tx] ===
                    TILE.AIR
                ) {

                    world[ty][tx] =
                        TILE.LEAF;

                }

            }

        }

    }

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.9 REBUILD
// PART 3/10
// PLAYER + PHYSICS + COLLISION
// ======================================================

// ================= SPAWN =================

const spawnPoint = {

    x: 0,
    y: 0

};

const spawnX =

    Math.floor(
        WORLD_WIDTH / 2
    );

spawnPoint.x =
    spawnX * BLOCK;

spawnPoint.y =

    (
        heightMap[
            spawnX
        ] - 5
    ) * BLOCK;

// ================= PLAYER =================

const player = {

    x: spawnPoint.x,
    y: spawnPoint.y,

    width: 24,
    height: 60,

    vx: 0,
    vy: 0,

    speed: 4,

    jumpPower: 10,

    direction: 1,

    onGround: false

};

// ================= HEALTH =================

const playerHealth = {

    max: 100,
    current: 100

};

// ================= WALK ANIMATION =================

let walkCycle = 0;

// ================= JUMP BUFFER =================

let jumpPressed = false;

document.addEventListener(
    "keydown",
    e => {

        if (
            e.code === "Space"
        ) {

            jumpPressed = true;

        }

    }
);

// ================= TILE HELPERS =================

function getTile(
    tx,
    ty
) {

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

    ) {

        return;

    }

    world[ty][tx] =
        value;

}

// ================= SOLID BLOCKS =================

function isSolid(
    tile
) {

    return (

        tile === TILE.GRASS ||

        tile === TILE.DIRT ||

        tile === TILE.STONE ||

        tile === TILE.WOOD ||

        tile === TILE.LEAF ||

        tile === TILE.BEDROCK ||

        tile === TILE.CRAFTING_TABLE

    );

}

// ================= COLLISION =================

function collideAt(
    x,
    y
) {

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

// ================= DAMAGE =================

function damage(
    amount
) {

    playerHealth.current -=
        amount;

    if (
        playerHealth.current <= 0
    ) {

        respawn();

    }

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
    ) {

        camera.x = 0;

    }

    if (
        camera.y < 0
    ) {

        camera.y = 0;

    }

    if (
        camera.x > maxCamX
    ) {

        camera.x = maxCamX;

    }

    if (
        camera.y > maxCamY
    ) {

        camera.y = maxCamY;

    }

}

// ================= PLAYER UPDATE =================

function updatePlayer() {

    player.vx = 0;

    if (
        keys["KeyA"]
    ) {

        player.vx =
            -player.speed;

        player.direction =
            -1;

    }

    if (
        keys["KeyD"]
    ) {

        player.vx =
            player.speed;

        player.direction =
            1;

    }

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

    if (
        Math.abs(
            player.vx
        ) > 0
    ) {

        walkCycle +=
            0.18;

    }

    // X

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

                - 1;

        }

        else if (
            player.vx < 0
        ) {

            player.x =

                Math.floor(
                    player.x /
                    BLOCK
                ) * BLOCK

                + BLOCK;

        }

    }

    // GRAVITY

    player.vy +=
        GRAVITY;

    if (
        player.vy > 20
    ) {

        player.vy = 20;

    }

    player.y +=
        player.vy;

    player.onGround =
        false;

    // Y

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

                + BLOCK;

            player.vy = 0;

        }

    }

    // WORLD LIMITS

    if (
        player.x < 0
    ) {

        player.x = 0;

    }

    const maxX =

        WORLD_WIDTH *
        BLOCK -

        player.width;

    if (
        player.x > maxX
    ) {

        player.x = maxX;

    }

    // VOID

    if (

        player.y >

        WORLD_HEIGHT *
        BLOCK + 500

    ) {

        damage(999);

    }

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.9 REBUILD
// PART 4/10
// INVENTORY SYSTEM
// ======================================================

// ================= INVENTORY SIZE =================

// 36 اسلات اصلی
const INVENTORY_SIZE = 36;

// 4 اسلات آرمور
const ARMOR_SIZE = 4;

// ================= INVENTORY =================

const inventory = [];

for (
    let i = 0;
    i < INVENTORY_SIZE;
    i++
) {

    inventory.push({

        item: ITEM.NONE,

        count: 0

    });

}

// ================= ARMOR =================

const armorSlots = [];

for (
    let i = 0;
    i < ARMOR_SIZE;
    i++
) {

    armorSlots.push({

        item: ITEM.NONE,

        count: 0

    });

}

// ================= HOTBAR =================

let selectedSlot = 0;

// ================= DRAG SYSTEM =================

let draggedItem = {

    item: ITEM.NONE,

    count: 0

};

let draggedFrom = -1;

// ================= CRAFTING 2x2 =================

const craftingGrid = [

    { item: ITEM.NONE, count: 0 },
    { item: ITEM.NONE, count: 0 },

    { item: ITEM.NONE, count: 0 },
    { item: ITEM.NONE, count: 0 }

];

const craftingResult = {

    item: ITEM.NONE,

    count: 0

};

// ================= ITEM HELPERS =================

function clearSlot(
    slot
) {

    slot.item =
        ITEM.NONE;

    slot.count = 0;

}

function isEmptySlot(
    slot
) {

    return (
        slot.item === ITEM.NONE ||
        slot.count <= 0
    );

}

// ================= ADD ITEM =================

function addItem(
    itemId,
    count = 1
) {

    // stack first

    for (
        let i = 0;
        i < inventory.length;
        i++
    ) {

        const slot =
            inventory[i];

        if (

            slot.item === itemId &&

            slot.count < 999

        ) {

            slot.count += count;

            return true;

        }

    }

    // empty slot

    for (
        let i = 0;
        i < inventory.length;
        i++
    ) {

        const slot =
            inventory[i];

        if (
            isEmptySlot(
                slot
            )
        ) {

            slot.item =
                itemId;

            slot.count =
                count;

            return true;

        }

    }

    return false;

}

// ================= REMOVE ITEM =================

function removeItem(
    itemId,
    count = 1
) {

    for (
        let i = 0;
        i < inventory.length;
        i++
    ) {

        const slot =
            inventory[i];

        if (
            slot.item === itemId
        ) {

            slot.count -= count;

            if (
                slot.count <= 0
            ) {

                clearSlot(
                    slot
                );

            }

            return true;

        }

    }

    return false;

}

// ================= COUNT ITEM =================

function countItem(
    itemId
) {

    let total = 0;

    for (
        const slot
        of inventory
    ) {

        if (
            slot.item === itemId
        ) {

            total +=
                slot.count;

        }

    }

    return total;

}

// ================= HOTBAR KEYS =================

document.addEventListener(
    "keydown",
    e => {

        if (
            e.code === "Digit1"
        ) selectedSlot = 0;

        if (
            e.code === "Digit2"
        ) selectedSlot = 1;

        if (
            e.code === "Digit3"
        ) selectedSlot = 2;

        if (
            e.code === "Digit4"
        ) selectedSlot = 3;

        if (
            e.code === "Digit5"
        ) selectedSlot = 4;

        if (
            e.code === "Digit6"
        ) selectedSlot = 5;

        if (
            e.code === "Digit7"
        ) selectedSlot = 6;

        if (
            e.code === "Digit8"
        ) selectedSlot = 7;

        if (
            e.code === "Digit9"
        ) selectedSlot = 8;

    }
);
// ======================================================
// MODERN BLOCKS
// VERSION 0.9 REBUILD
// PART 5/10
// CRAFTING SYSTEM
// ======================================================

// ================= RECIPES =================

const recipes = [

    // 1 WOOD -> 4 PLANK

    {
        pattern: [

            ITEM.WOOD,
            ITEM.NONE,

            ITEM.NONE,
            ITEM.NONE

        ],

        result: ITEM.PLANK,

        count: 4
    },

    // 2 PLANK -> 4 STICK

    {
        pattern: [

            ITEM.PLANK,
            ITEM.NONE,

            ITEM.PLANK,
            ITEM.NONE

        ],

        result: ITEM.STICK,

        count: 4
    },

    // 4 PLANK -> CRAFTING TABLE

    {
        pattern: [

            ITEM.PLANK,
            ITEM.PLANK,

            ITEM.PLANK,
            ITEM.PLANK

        ],

        result:
            ITEM.CRAFTING_TABLE,

        count: 1
    }

];

// ================= CRAFT GRID =================

function getCraftPattern() {

    return [

        craftingGrid[0].item,
        craftingGrid[1].item,

        craftingGrid[2].item,
        craftingGrid[3].item

    ];

}

// ================= PATTERN MATCH =================

function patternsMatch(
    a,
    b
) {

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        if (
            a[i] !== b[i]
        ) {

            return false;

        }

    }

    return true;

}

// ================= UPDATE RESULT =================

function updateCraftingResult() {

    craftingResult.item =
        ITEM.NONE;

    craftingResult.count = 0;

    const currentPattern =
        getCraftPattern();

    for (
        const recipe
        of recipes
    ) {

        if (

            patternsMatch(
                currentPattern,
                recipe.pattern
            )

        ) {

            craftingResult.item =
                recipe.result;

            craftingResult.count =
                recipe.count;

            return;

        }

    }

}

// ================= TAKE RESULT =================

function takeCraftResult() {

    if (
        craftingResult.item ===
        ITEM.NONE
    ) {

        return;
    }

    addItem(

        craftingResult.item,

        craftingResult.count

    );

    // مصرف مواد

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const slot =
            craftingGrid[i];

        if (
            slot.item !== ITEM.NONE
        ) {

            slot.count--;

            if (
                slot.count <= 0
            ) {

                slot.item =
                    ITEM.NONE;

                slot.count = 0;

            }

        }

    }

    updateCraftingResult();

}

// ================= CLEAR GRID =================

function clearCraftGrid() {

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        craftingGrid[i].item =
            ITEM.NONE;

        craftingGrid[i].count = 0;

    }

    updateCraftingResult();

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.9 REBUILD
// PART 6/10
// INVENTORY UI
// ======================================================

function drawInventoryUI() {

    if (!inventoryOpen)
        return;

    const panelW = 700;
    const panelH = 500;

    const startX =
        canvas.width / 2 -
        panelW / 2;

    const startY =
        canvas.height / 2 -
        panelH / 2;

    // ================= BACKGROUND =================

    ctx.fillStyle =
        "#c6c6c6";

    ctx.fillRect(
        startX,
        startY,
        panelW,
        panelH
    );

    ctx.strokeStyle =
        "#555";

    ctx.lineWidth = 4;

    ctx.strokeRect(
        startX,
        startY,
        panelW,
        panelH
    );

    // ================= TITLE =================

    ctx.fillStyle =
        "black";

    ctx.font =
        "22px Arial";

    ctx.fillText(
        "Inventory",
        startX + 20,
        startY + 35
    );

    // ================= ARMOR =================

    const armorX =
        startX + 20;

    const armorY =
        startY + 70;

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        ctx.fillStyle =
            "#8b8b8b";

        ctx.fillRect(
            armorX,
            armorY + i * 60,
            50,
            50
        );

        ctx.strokeStyle =
            "#222";

        ctx.strokeRect(
            armorX,
            armorY + i * 60,
            50,
            50
        );

    }

    // ================= PLAYER PREVIEW =================

    ctx.strokeStyle =
        "red";

    ctx.lineWidth = 4;

    const px =
        startX + 130;

    const py =
        startY + 170;

    ctx.beginPath();

    ctx.arc(
        px,
        py - 50,
        12,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        px,
        py - 38
    );

    ctx.lineTo(
        px,
        py + 25
    );

    ctx.moveTo(
        px,
        py - 10
    );

    ctx.lineTo(
        px - 25,
        py + 5
    );

    ctx.moveTo(
        px,
        py - 10
    );

    ctx.lineTo(
        px + 25,
        py + 5
    );

    ctx.moveTo(
        px,
        py + 25
    );

    ctx.lineTo(
        px - 18,
        py + 55
    );

    ctx.moveTo(
        px,
        py + 25
    );

    ctx.lineTo(
        px + 18,
        py + 55
    );

    ctx.stroke();

    // ================= CRAFTING 2x2 =================

    const craftX =
        startX + 240;

    const craftY =
        startY + 90;

    for (
        let row = 0;
        row < 2;
        row++
    ) {

        for (
            let col = 0;
            col < 2;
            col++
        ) {

            ctx.fillStyle =
                "#8b8b8b";

            ctx.fillRect(
                craftX + col * 60,
                craftY + row * 60,
                50,
                50
            );

            ctx.strokeRect(
                craftX + col * 60,
                craftY + row * 60,
                50,
                50
            );

        }

    }

    // ================= RESULT =================

    ctx.fillStyle =
        "#8b8b8b";

    ctx.fillRect(
        craftX + 170,
        craftY + 30,
        50,
        50
    );

    ctx.strokeRect(
        craftX + 170,
        craftY + 30,
        50,
        50
    );

    ctx.fillStyle =
        "black";

    ctx.font =
        "30px Arial";

    ctx.fillText(
        "→",
        craftX + 125,
        craftY + 67
    );

    // ================= INVENTORY =================

    let slotIndex = 9;

    const invStartX =
        startX + 190;

    const invStartY =
        startY + 250;

    for (
        let row = 0;
        row < 3;
        row++
    ) {

        for (
            let col = 0;
            col < 9;
            col++
        ) {

            const slot =
                inventory[
                    slotIndex
                ];

            const x =
                invStartX +
                col * 60;

            const y =
                invStartY +
                row * 60;

            ctx.fillStyle =
                "#8b8b8b";

            ctx.fillRect(
                x,
                y,
                50,
                50
            );

            ctx.strokeRect(
                x,
                y,
                50,
                50
            );

            if (
                slot.item !==
                ITEM.NONE
            ) {

                const tex =
                    getItemTexture(
                        slot.item
                    );

                if (
                    tex &&
                    tex.complete
                ) {

                    ctx.drawImage(
                        tex,
                        x + 7,
                        y + 7,
                        36,
                        36
                    );

                }

            }

            slotIndex++;

        }

    }

    // ================= HOTBAR =================

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const slot =
            inventory[i];

        const x =
            invStartX +
            i * 60;

        const y =
            startY + 440;

        ctx.fillStyle =

            i === selectedSlot

            ? "#ffd54f"

            : "#8b8b8b";

        ctx.fillRect(
            x,
            y,
            50,
            50
        );

        ctx.strokeRect(
            x,
            y,
            50,
            50
        );

        if (
            slot.item !==
            ITEM.NONE
        ) {

            const tex =
                getItemTexture(
                    slot.item
                );

            if (
                tex &&
                tex.complete
            ) {

                ctx.drawImage(
                    tex,
                    x + 7,
                    y + 7,
                    36,
                    36
                );

            }

        }

    }

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.9
// PART 7/10
// RENDER + HOTBAR + INVENTORY UI
// ======================================================

// ================= ITEM TEXTURE =================

function getItemTexture(item) {

    switch (item) {

        case ITEM.GRASS: return textures.grass;
        case ITEM.DIRT: return textures.dirt;
        case ITEM.STONE: return textures.stone;

        case ITEM.WOOD: return textures.wood;
        case ITEM.PLANK: return textures.plank;
        case ITEM.STICK: return textures.stick;

        case ITEM.CRAFTING_TABLE:
            return textures.craftingTable;

        case ITEM.WOOD_PICKAXE:
            return textures.woodenPickaxe;

        case ITEM.WOOD_AXE:
            return textures.woodenAxe;

        case ITEM.STONE_PICKAXE:
            return textures.stonePickaxe;

        case ITEM.STONE_AXE:
            return textures.stoneAxe;

    }

    return null;

}

// ================= HOTBAR =================

function drawHotbar() {

    const size = 50;

    const startX =
        canvas.width / 2 -
        (size * 9) / 2;

    const y =
        canvas.height - 65;

    for (let i = 0; i < 9; i++) {

        const slot =
            inventory[i];

        ctx.fillStyle =
            i === selectedSlot
            ? "#ffffff"
            : "#777";

        ctx.fillRect(
            startX + i * size,
            y,
            size,
            size
        );

        ctx.strokeStyle =
            "#222";

        ctx.strokeRect(
            startX + i * size,
            y,
            size,
            size
        );

        if (
            slot.item !== ITEM.NONE
        ) {

            const tex =
                getItemTexture(
                    slot.item
                );

            if (
                tex &&
                tex.complete
            ) {

                ctx.drawImage(
                    tex,
                    startX + i * size + 8,
                    y + 8,
                    34,
                    34
                );

            }

            ctx.fillStyle =
                "white";

            ctx.font =
                "12px Arial";

            ctx.fillText(
                slot.count,
                startX + i * size + 30,
                y + 46
            );

        }

    }

}

// ================= INVENTORY =================

function drawInventory() {

    if (!inventoryOpen)
        return;

    ctx.fillStyle =
        "rgba(0,0,0,0.85)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const panelW = 700;
    const panelH = 500;

    const panelX =
        canvas.width / 2 -
        panelW / 2;

    const panelY =
        canvas.height / 2 -
        panelH / 2;

    ctx.fillStyle =
        "#c6c6c6";

    ctx.fillRect(
        panelX,
        panelY,
        panelW,
        panelH
    );

    // ================= ARMOR =================

    const armorSize = 54;

    for (let i = 0; i < 4; i++) {

        ctx.fillStyle =
            "#8f8f8f";

        ctx.fillRect(
            panelX + 30,
            panelY + 30 + i * 60,
            armorSize,
            armorSize
        );

    }

    // ================= CRAFT 2x2 =================

    const craftX =
        panelX + 120;

    const craftY =
        panelY + 40;

    for (let y = 0; y < 2; y++) {

        for (let x = 0; x < 2; x++) {

            ctx.fillStyle =
                "#8f8f8f";

            ctx.fillRect(
                craftX + x * 60,
                craftY + y * 60,
                54,
                54
            );

        }

    }

    // output

    ctx.fillStyle =
        "#8f8f8f";

    ctx.fillRect(
        craftX + 170,
        craftY + 30,
        54,
        54
    );

    // ================= INVENTORY GRID =================

    const startX =
        panelX + 120;

    const startY =
        panelY + 180;

    let index = 9;

    for (let row = 0; row < 3; row++) {

        for (let col = 0; col < 9; col++) {

            const slot =
                inventory[index];

            const x =
                startX +
                col * 60;

            const y =
                startY +
                row * 60;

            ctx.fillStyle =
                "#8f8f8f";

            ctx.fillRect(
                x,
                y,
                54,
                54
            );

            if (
                slot.item !== ITEM.NONE
            ) {

                const tex =
                    getItemTexture(
                        slot.item
                    );

                if (
                    tex &&
                    tex.complete
                ) {

                    ctx.drawImage(
                        tex,
                        x + 8,
                        y + 8,
                        36,
                        36
                    );

                }

                ctx.fillStyle =
                    "white";

                ctx.font =
                    "12px Arial";

                ctx.fillText(
                    slot.count,
                    x + 30,
                    y + 48
                );

            }

            index++;

        }

    }

    // ================= HOTBAR INSIDE INVENTORY =================

    const hotbarY =
        panelY + 390;

    for (let i = 0; i < 9; i++) {

        const slot =
            inventory[i];

        const x =
            startX +
            i * 60;

        ctx.fillStyle =
            "#8f8f8f";

        ctx.fillRect(
            x,
            hotbarY,
            54,
            54
        );

        if (
            slot.item !== ITEM.NONE
        ) {

            const tex =
                getItemTexture(
                    slot.item
                );

            if (
                tex &&
                tex.complete
            ) {

                ctx.drawImage(
                    tex,
                    x + 8,
                    hotbarY + 8,
                    36,
                    36
                );

            }

            ctx.fillStyle =
                "white";

            ctx.font =
                "12px Arial";

            ctx.fillText(
                slot.count,
                x + 30,
                hotbarY + 48
            );

        }

    }

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.9
// PART 8/10
// INVENTORY UI + CRAFTING UI
// ======================================================

function drawHotbar() {

    const size = 54;

    const startX =
        canvas.width / 2 -
        (9 * size) / 2;

    const y =
        canvas.height - 70;

    for (let i = 0; i < 9; i++) {

        const slot = inventory[i];

        ctx.fillStyle =
            i === selectedSlot
            ? "#FFFFFF"
            : "#777777";

        ctx.fillRect(
            startX + i * size,
            y,
            50,
            50
        );

        ctx.strokeStyle = "#000";
        ctx.strokeRect(
            startX + i * size,
            y,
            50,
            50
        );

        if (slot.item !== ITEM.NONE) {

            const tex =
                getItemTexture(slot.item);

            if (tex && tex.complete) {

                ctx.drawImage(
                    tex,
                    startX + i * size + 8,
                    y + 8,
                    34,
                    34
                );

            }

            ctx.fillStyle = "white";
            ctx.font = "12px Arial";

            ctx.fillText(
                slot.count,
                startX + i * size + 30,
                y + 45
            );

        }

    }

}

function drawInventory() {

    if (!inventoryOpen)
        return;

    ctx.fillStyle =
        "rgba(0,0,0,0.8)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const invX =
        canvas.width / 2 - 270;

    const invY =
        canvas.height / 2 - 180;

    // background

    ctx.fillStyle =
        "#C6C6C6";

    ctx.fillRect(
        invX,
        invY,
        540,
        360
    );

    ctx.strokeStyle =
        "#000";

    ctx.strokeRect(
        invX,
        invY,
        540,
        360
    );

    ctx.fillStyle =
        "black";

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "Inventory",
        invX + 20,
        invY + 30
    );

    // armor slots

    for (let i = 0; i < 4; i++) {

        ctx.fillStyle = "#888";

        ctx.fillRect(
            invX + 20,
            invY + 60 + i * 55,
            50,
            50
        );

    }

    // 2x2 crafting

    for (let y = 0; y < 2; y++) {

        for (let x = 0; x < 2; x++) {

            ctx.fillStyle =
                "#888";

            ctx.fillRect(
                invX + 110 + x * 55,
                invY + 70 + y * 55,
                50,
                50
            );

        }

    }

    // crafting result

    ctx.fillStyle =
        "#888";

    ctx.fillRect(
        invX + 260,
        invY + 97,
        50,
        50
    );

    // player preview

    ctx.fillStyle =
        "#999";

    ctx.fillRect(
        invX + 360,
        invY + 60,
        120,
        160
    );

    // inventory grid

    let slotIndex = 9;

    for (let row = 0; row < 3; row++) {

        for (let col = 0; col < 9; col++) {

            const slot =
                inventory[slotIndex];

            const x =
                invX + 20 +
                col * 55;

            const y =
                invY + 240 +
                row * 55;

            ctx.fillStyle =
                "#777";

            ctx.fillRect(
                x,
                y,
                50,
                50
            );

            ctx.strokeStyle =
                "#000";

            ctx.strokeRect(
                x,
                y,
                50,
                50
            );

            if (
                slot &&
                slot.item !== ITEM.NONE
            ) {

                const tex =
                    getItemTexture(
                        slot.item
                    );

                if (
                    tex &&
                    tex.complete
                ) {

                    ctx.drawImage(
                        tex,
                        x + 8,
                        y + 8,
                        34,
                        34
                    );

                }

                ctx.fillStyle =
                    "white";

                ctx.font =
                    "12px Arial";

                ctx.fillText(
                    slot.count,
                    x + 30,
                    y + 45
                );

            }

            slotIndex++;

        }

    }

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.9
// PART 9/10
// INVENTORY RENDER
// ======================================================

function drawInventory() {

    if (!inventoryOpen) return;

    ctx.fillStyle =
        "rgba(0,0,0,0.75)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const panelW = 700;
    const panelH = 500;

    const panelX =
        canvas.width / 2 -
        panelW / 2;

    const panelY =
        canvas.height / 2 -
        panelH / 2;

    ctx.fillStyle = "#c6c6c6";

    ctx.fillRect(
        panelX,
        panelY,
        panelW,
        panelH
    );

    ctx.strokeStyle = "#444";
    ctx.lineWidth = 3;

    ctx.strokeRect(
        panelX,
        panelY,
        panelW,
        panelH
    );

    // ================= ARMOR =================

    const armorX =
        panelX + 30;

    const armorY =
        panelY + 50;

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        ctx.fillStyle =
            "#8b8b8b";

        ctx.fillRect(
            armorX,
            armorY + i * 70,
            60,
            60
        );

        ctx.strokeRect(
            armorX,
            armorY + i * 70,
            60,
            60
        );

    }

    // ================= PLAYER MODEL =================

    ctx.fillStyle =
        "#777";

    ctx.fillRect(
        panelX + 130,
        panelY + 90,
        100,
        180
    );

    // ================= 2x2 CRAFT =================

    const craftX =
        panelX + 300;

    const craftY =
        panelY + 70;

    for (
        let y = 0;
        y < 2;
        y++
    ) {

        for (
            let x = 0;
            x < 2;
            x++
        ) {

            ctx.fillStyle =
                "#8b8b8b";

            ctx.fillRect(
                craftX + x * 70,
                craftY + y * 70,
                60,
                60
            );

            ctx.strokeRect(
                craftX + x * 70,
                craftY + y * 70,
                60,
                60
            );

        }

    }

    // ================= ARROW =================

    ctx.fillStyle =
        "black";

    ctx.font =
        "40px Arial";

    ctx.fillText(
        "→",
        craftX + 160,
        craftY + 85
    );

    // ================= RESULT =================

    ctx.fillStyle =
        "#8b8b8b";

    ctx.fillRect(
        craftX + 220,
        craftY + 35,
        60,
        60
    );

    ctx.strokeRect(
        craftX + 220,
        craftY + 35,
        60,
        60
    );

    // ================= INVENTORY =================

    const invX =
        panelX + 130;

    const invY =
        panelY + 300;

    let slotIndex = 9;

    for (
        let row = 0;
        row < 3;
        row++
    ) {

        for (
            let col = 0;
            col < 9;
            col++
        ) {

            const slot =
                inventory[slotIndex];

            const x =
                invX + col * 60;

            const y =
                invY + row * 60;

            ctx.fillStyle =
                "#8b8b8b";

            ctx.fillRect(
                x,
                y,
                54,
                54
            );

            ctx.strokeRect(
                x,
                y,
                54,
                54
            );

            if (
                slot.item !== ITEM.NONE
            ) {

                const texture =
                    getItemTexture(
                        slot.item
                    );

                if (
                    texture &&
                    texture.complete
                ) {

                    ctx.drawImage(
                        texture,
                        x + 7,
                        y + 7,
                        40,
                        40
                    );

                }

                ctx.fillStyle =
                    "white";

                ctx.font =
                    "12px Arial";

                ctx.fillText(
                    slot.count,
                    x + 34,
                    y + 48
                );

            }

            slotIndex++;

        }

    }

    // ================= HOTBAR =================

    const hotbarY =
        panelY + 420;

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const slot =
            inventory[i];

        const x =
            invX + i * 60;

        ctx.fillStyle =
            "#8b8b8b";

        ctx.fillRect(
            x,
            hotbarY,
            54,
            54
        );

        ctx.strokeRect(
            x,
            hotbarY,
            54,
            54
        );

        if (
            slot.item !== ITEM.NONE
        ) {

            const texture =
                getItemTexture(
                    slot.item
                );

            if (
                texture &&
                texture.complete
            ) {

                ctx.drawImage(
                    texture,
                    x + 7,
                    hotbarY + 7,
                    40,
                    40
                );

            }

            ctx.fillStyle =
                "white";

            ctx.font =
                "12px Arial";

            ctx.fillText(
                slot.count,
                x + 34,
                hotbarY + 48
            );

        }

    }

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.9 CLEAN REBUILD
// PART 10/10
// MAIN LOOP + STARTUP
// ======================================================

// ================= FPS =================

let fps = 0;

let frames = 0;

let lastFpsTime =
    performance.now();

// ================= UPDATE =================

function update() {

    updatePlayer();

    updateCamera();

    updateDrops();

    updateMining();

    updateToolFromHotbar();

}

// ================= GAME LOOP =================

function gameLoop() {

    if (!paused) {

        update();

    }

    draw();

    frames++;

    const now =
        performance.now();

    if (
        now -
        lastFpsTime >=
        1000
    ) {

        fps =
            frames;

        frames = 0;

        lastFpsTime =
            now;

    }

    requestAnimationFrame(
        gameLoop
    );

}

// ================= START ITEMS =================

// شروع بازی با دست خالی
// اگر بعداً خواستی آیتم اولیه بدی اینجا اضافه میشه

// ================= START =================

gameLoop();
