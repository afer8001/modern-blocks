// ======================================================
// MODERN BLOCKS
// VERSION 0.8 REBUILD
// PART 1/10
// ENGINE + CANVAS + INPUT + TEXTURES
// ======================================================

// ================= CANVAS =================

const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");

// ================= RESIZE =================

function resizeCanvas() {

    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight;

}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);

// ================= SETTINGS =================

const BLOCK = 32;

const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 180;

const GRAVITY = 0.7;

let paused = false;
let inventoryOpen = false;

// ================= CAMERA =================

const camera = {

    x: 0,
    y: 0

};

// ================= INPUT =================

const keys = {};

document.addEventListener(
"keydown",
e => {

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

// ================= DISABLE RIGHT CLICK =================

canvas.addEventListener(
"contextmenu",
e => {

    e.preventDefault();

}
);

// ================= FPS =================

let fps = 0;

let frames = 0;

let lastFpsTime =
performance.now();

// ================= TILES =================

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

// ================= ITEMS =================

const ITEM = {

    NONE: 0,

    GRASS: 1,

    DIRT: 2,

    STONE: 3,

    WOOD: 4,

    LEAF: 5,

    STICK: 6,

    CRAFTING_TABLE: 7,

    WOOD_PICKAXE: 8,

    WOOD_AXE: 9

};

// ================= TOOLS =================

const TOOL = {

    NONE: 0,

    WOOD_PICKAXE: 1,

    WOOD_AXE: 2

};

let equippedTool =
TOOL.NONE;

// ================= TEXTURES =================

const textures = {

    grass: new Image(),

    dirt: new Image(),

    stone: new Image(),

    wood: new Image(),

    leaf: new Image(),

    bedrock: new Image(),

    craftingTable:
    new Image(),

    stick:
    new Image(),

    woodenPickaxe:
    new Image(),

    woodenAxe:
    new Image()

};

// ================= LOAD TEXTURES =================

textures.grass.src =
"textures/grass.png.png";

textures.dirt.src =
"textures/dirt.png.png";

textures.stone.src =
"textures/stone.png.jpg";

textures.wood.src =
"textures/wood.png.png";

textures.leaf.src =
"textures/leaf.png.png";

textures.bedrock.src =
"textures/bedrock.png.png";

textures.craftingTable.src =
"textures/crafting_table.png.png";

textures.stick.src =
"textures/stick.png.jpg";

textures.woodenPickaxe.src =
"textures/wooden_pickaxe.png.webp";

textures.woodenAxe.src =
"textures/wooden_axe.png.png";

// ================= WORLD =================

let world = [];

// ================= HEIGHT MAP =================

const heightMap = [];

// ================= PLAYER =================

const player = {

    x: 0,
    y: 0,

    width: 24,
    height: 50,

    vx: 0,
    vy: 0,

    speed: 4,

    jumpPower: 10,

    onGround: false,

    direction: 1

};

// ================= HEALTH =================

const playerHealth = {

    max: 100,
    current: 100

};

// ================= SPAWN =================

const spawnPoint = {

    x: 0,
    y: 0

};

// ================= HOTBAR =================

let selectedSlot = 0;

// ================= WALK =================

let walkCycle = 0;

// ================= MINING =================

let miningBlock = null;

let miningProgress = 0;

// ================= DROPS =================

const droppedItems = [];

// ================= INVENTORY =================

const inventory = [];

for (
let i = 0;
i < 36;
i++
) {

    inventory.push({

        item: ITEM.NONE,
        count: 0

    });

}

// تست اولیه

inventory[0] = {

    item: ITEM.WOOD,
    count: 16

};
// ======================================================
// MODERN BLOCKS
// VERSION 0.8 REBUILD
// PART 2/10
// WORLD GENERATION
// ======================================================

// ================= TERRAIN SETTINGS =================

const SURFACE_LEVEL = 45;

const HILL_HEIGHT = 12;

const CAVE_START_DEPTH = 65;

// ================= HEIGHT MAP =================

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
            y <
            surface + 6
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

    CAVE_START_DEPTH +

    Math.floor(

        Math.random() *

        (
            WORLD_HEIGHT -
            CAVE_START_DEPTH -
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

                    ty <
                    CAVE_START_DEPTH ||

                    tx >= WORLD_WIDTH ||

                    ty >=
                    WORLD_HEIGHT - 1

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
let x = 10;
x < WORLD_WIDTH - 10;
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

                ty < 0 ||

                tx >= WORLD_WIDTH ||

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

// ================= SPAWN =================

const spawnX =

Math.floor(
    WORLD_WIDTH / 2
);

spawnPoint.x =
spawnX * BLOCK;

spawnPoint.y =

(
    heightMap[spawnX] - 5
) * BLOCK;

player.x =
spawnPoint.x;

player.y =
spawnPoint.y;

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

    ) return;

    world[ty][tx] =
    value;

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.8 REBUILD
// PART 3/10
// COLLISION + PHYSICS + CAMERA
// ======================================================

// ================= SOLID BLOCKS =================

function isSolid(tile) {

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

function collideAt(x, y) {

    const left =
    Math.floor(x / BLOCK);

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

function damage(amount) {

    playerHealth.current -=
    amount;

    if (
        playerHealth.current <= 0
    ) {

        respawn();

    }

}

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

// ================= PLAYER UPDATE =================

function updatePlayer() {

    player.vx = 0;

    // LEFT

    if (
        keys["KeyA"]
    ) {

        player.vx =
        -player.speed;

        player.direction =
        -1;

    }

    // RIGHT

    if (
        keys["KeyD"]
    ) {

        player.vx =
        player.speed;

        player.direction =
        1;

    }

    // JUMP

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

    // WALK

    if (
        Math.abs(
            player.vx
        ) > 0
    ) {

        walkCycle +=
        0.18;

    }

    // ================= X =================

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

    // ================= GRAVITY =================

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

    // ================= Y =================

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

    // ================= LIMITS =================

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

    // ================= VOID =================

    if (

        player.y >

        WORLD_HEIGHT *
        BLOCK +

        500

    ) {

        damage(999);

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
// ======================================================
// MODERN BLOCKS
// VERSION 0.8 REBUILD
// PART 4/10
// INVENTORY + HOTBAR + DROPS
// ======================================================

// ================= INVENTORY =================

const inventory = [];

for (
    let i = 0;
    i < 36;
    i++
) {

    inventory.push({

        item: ITEM.NONE,

        count: 0

    });

}

// ================= HOTBAR =================

let selectedSlot = 0;

// ================= START ITEMS =================

inventory[0] = {

    item: ITEM.WOOD,

    count: 16

};

// ================= ITEM NAME =================

function getItemName(item) {

    if (item === ITEM.GRASS)
        return "Grass";

    if (item === ITEM.DIRT)
        return "Dirt";

    if (item === ITEM.STONE)
        return "Stone";

    if (item === ITEM.WOOD)
        return "Wood";

    if (item === ITEM.LEAF)
        return "Leaf";

    if (item === ITEM.STICK)
        return "Stick";

    if (item === ITEM.CRAFTING_TABLE)
        return "Crafting Table";

    if (item === ITEM.WOOD_PICKAXE)
        return "Wood Pickaxe";

    if (item === ITEM.WOOD_AXE)
        return "Wood Axe";

    return "None";

}

// ================= ADD ITEM =================

function addItem(
    itemId,
    count = 1
) {

    // stack

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

            slot.item === ITEM.NONE

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

                slot.item =
                ITEM.NONE;

                slot.count = 0;

            }

            return true;

        }

    }

    return false;

}

// ================= COUNT ITEM =================

function countItem(itemId) {

    let total = 0;

    for (
        const slot
        of inventory
    ) {

        if (

            slot.item === itemId

        ) {

            total += slot.count;

        }

    }

    return total;

}

// ================= DROPS =================

const droppedItems = [];

// ================= SPAWN DROP =================

function spawnDrop(
    x,
    y,
    itemId
) {

    droppedItems.push({

        x: x,

        y: y,

        vx:
            (
                Math.random() - 0.5
            ) * 2,

        vy: -3,

        item: itemId

    });

}

// ================= UPDATE DROPS =================

function updateDrops() {

    for (

        let i =
        droppedItems.length - 1;

        i >= 0;

        i--

    ) {

        const drop =
        droppedItems[i];

        // gravity

        drop.vy += 0.25;

        if (
            drop.vy > 8
        ) {

            drop.vy = 8;

        }

        drop.x += drop.vx;

        drop.y += drop.vy;

        // block collision

        const tx =

        Math.floor(
            drop.x / BLOCK
        );

        const ty =

        Math.floor(
            drop.y / BLOCK
        );

        if (

            isSolid(
                getTile(tx, ty)
            )

        ) {

            drop.y =
            ty * BLOCK - 8;

            drop.vy = 0;

        }

        // pickup

        const dx =

        drop.x -

        (
            player.x +
            player.width / 2
        );

        const dy =

        drop.y -

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
                drop.item,
                1
            );

            droppedItems.splice(
                i,
                1
            );

        }

    }

}

// ================= ITEM COLORS =================

function getItemColor(item) {

    if (
        item === ITEM.GRASS
    ) return "#4CAF50";

    if (
        item === ITEM.DIRT
    ) return "#8B5A2B";

    if (
        item === ITEM.STONE
    ) return "#777777";

    if (
        item === ITEM.WOOD
    ) return "#6b3e1d";

    if (
        item === ITEM.LEAF
    ) return "#2ecc71";

    if (
        item === ITEM.STICK
    ) return "#d2a679";

    if (
        item === ITEM.CRAFTING_TABLE
    ) return "#8b4513";

    if (
        item === ITEM.WOOD_PICKAXE
    ) return "#e6c38a";

    if (
        item === ITEM.WOOD_AXE
    ) return "#c49b63";

    return "#ffffff";

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.8 REBUILD
// PART 5/10
// MINING + PLACING + TOOLS
// ======================================================

// ================= TOOLS =================

const TOOL = {

    NONE: 0,

    WOOD_PICKAXE: 1,

    WOOD_AXE: 2

};

let equippedTool =
    TOOL.NONE;

// ================= MINING =================

let miningBlock = null;

let miningProgress = 0;

const BREAK_RANGE = 6;

// ================= BREAK TIMES =================

const breakTimes = {

    [TILE.GRASS]: 0.4,

    [TILE.DIRT]: 0.5,

    [TILE.LEAF]: 0.2,

    [TILE.WOOD]: 2.0,

    [TILE.STONE]: 999,

    [TILE.CRAFTING_TABLE]: 1.2

};

// ================= TOOL SPEED =================

function getBreakTime(tile) {

    let time =
    breakTimes[tile] || 1;

    if (

        equippedTool ===
        TOOL.WOOD_PICKAXE

    ) {

        if (
            tile === TILE.STONE
        ) {

            time = 1.2;

        }

    }

    if (

        equippedTool ===
        TOOL.WOOD_AXE

    ) {

        if (
            tile === TILE.WOOD
        ) {

            time = 0.6;

        }

        if (
            tile === TILE.CRAFTING_TABLE
        ) {

            time = 0.4;

        }

    }

    return time;

}

// ================= DISTANCE =================

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

// ================= PLAYER INSIDE TILE =================

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

// ================= HAS NEIGHBOR =================

function hasNeighbor(
    tx,
    ty
) {

    return (

        getTile(tx + 1, ty) !== TILE.AIR ||

        getTile(tx - 1, ty) !== TILE.AIR ||

        getTile(tx, ty + 1) !== TILE.AIR ||

        getTile(tx, ty - 1) !== TILE.AIR

    );

}

// ================= TILE -> ITEM =================

function tileToItem(tile) {

    if (
        tile === TILE.GRASS
    ) return ITEM.GRASS;

    if (
        tile === TILE.DIRT
    ) return ITEM.DIRT;

    if (
        tile === TILE.STONE
    ) return ITEM.STONE;

    if (
        tile === TILE.WOOD
    ) return ITEM.WOOD;

    if (
        tile === TILE.LEAF
    ) return ITEM.LEAF;

    if (
        tile === TILE.CRAFTING_TABLE
    ) {

        return ITEM.CRAFTING_TABLE;

    }

    return ITEM.NONE;

}

// ================= BREAK BLOCK =================

function breakBlock(
    tx,
    ty
) {

    const tile =
    getTile(tx, ty);

    if (
        tile === TILE.AIR
    ) return;

    if (
        tile === TILE.BEDROCK
    ) return;

    if (

        tile === TILE.STONE &&

        equippedTool !==
        TOOL.WOOD_PICKAXE

    ) {

        return;

    }

    if (
        tile === TILE.LEAF
    ) {

        if (
            Math.random() < 0.20
        ) {

            spawnDrop(

                tx * BLOCK +
                BLOCK / 2,

                ty * BLOCK +
                BLOCK / 2,

                ITEM.STICK

            );

        }

    }

    spawnDrop(

        tx * BLOCK +
        BLOCK / 2,

        ty * BLOCK +
        BLOCK / 2,

        tileToItem(tile)

    );

    setTile(
        tx,
        ty,
        TILE.AIR
    );

}

// ================= MOUSE DOWN =================

canvas.addEventListener(
    "mousedown",
    e => {

        if (
            paused ||
            inventoryOpen
        ) return;

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

        // LEFT CLICK

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

            miningBlock = {

                x: tx,

                y: ty

            };

            miningProgress = 0;

        }

        // RIGHT CLICK

        if (
            e.button === 2
        ) {

            if (

                tileDistance(
                    tx,
                    ty
                ) >

                BREAK_RANGE

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

            const slot =
            inventory[
                selectedSlot
            ];

            if (
                slot.count <= 0
            ) return;

            let placed = false;

            if (
                slot.item === ITEM.DIRT
            ) {

                setTile(
                    tx,
                    ty,
                    TILE.DIRT
                );

                placed = true;

            }

            if (
                slot.item === ITEM.GRASS
            ) {

                setTile(
                    tx,
                    ty,
                    TILE.GRASS
                );

                placed = true;

            }

            if (
                slot.item === ITEM.STONE
            ) {

                setTile(
                    tx,
                    ty,
                    TILE.STONE
                );

                placed = true;

            }

            if (
                slot.item === ITEM.WOOD
            ) {

                setTile(
                    tx,
                    ty,
                    TILE.WOOD
                );

                placed = true;

            }

            if (
                slot.item === ITEM.LEAF
            ) {

                setTile(
                    tx,
                    ty,
                    TILE.LEAF
                );

                placed = true;

            }

            if (
                slot.item === ITEM.CRAFTING_TABLE
            ) {

                setTile(
                    tx,
                    ty,
                    TILE.CRAFTING_TABLE
                );

                placed = true;

            }

            if (!placed)
                return;

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
);

// ================= MOUSE UP =================

canvas.addEventListener(
    "mouseup",
    () => {

        miningBlock = null;

        miningProgress = 0;

    }
);

// ================= UPDATE MINING =================

function updateMining() {

    if (
        !miningBlock
    ) return;

    const tile =

    getTile(

        miningBlock.x,

        miningBlock.y

    );

    if (
        tile === TILE.AIR
    ) {

        miningBlock = null;

        return;

    }

    miningProgress +=
    1 / 60;

    const needTime =
    getBreakTime(tile);

    if (

        miningProgress >=
        needTime

    ) {

        breakBlock(

            miningBlock.x,

            miningBlock.y

        );

        miningBlock = null;

        miningProgress = 0;

    }

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.8 REBUILD
// PART 6/10
// CRAFTING + RECIPES
// ======================================================

// ================= RECIPES =================

const recipes = [

    // STICK

    {

        result: ITEM.STICK,

        count: 4,

        ingredients: [

            {
                item: ITEM.WOOD,
                count: 2
            }

        ]

    },

    // CRAFTING TABLE

    {

        result:
        ITEM.CRAFTING_TABLE,

        count: 1,

        ingredients: [

            {
                item: ITEM.WOOD,
                count: 4
            }

        ]

    },

    // WOOD PICKAXE

    {

        result:
        ITEM.WOOD_PICKAXE,

        count: 1,

        ingredients: [

            {
                item: ITEM.WOOD,
                count: 3
            },

            {
                item: ITEM.STICK,
                count: 2
            }

        ]

    },

    // WOOD AXE

    {

        result:
        ITEM.WOOD_AXE,

        count: 1,

        ingredients: [

            {
                item: ITEM.WOOD,
                count: 3
            },

            {
                item: ITEM.STICK,
                count: 2
            }

        ]

    }

];

// ================= CAN CRAFT =================

function canCraft(
    recipe
) {

    for (

        const ingredient

        of recipe.ingredients

    ) {

        if (

            countItem(
                ingredient.item
            )

            <

            ingredient.count

        ) {

            return false;

        }

    }

    return true;

}

// ================= CRAFT =================

function craft(
    recipe
) {

    if (
        !canCraft(recipe)
    ) {

        return false;

    }

    for (

        const ingredient

        of recipe.ingredients

    ) {

        removeItem(

            ingredient.item,

            ingredient.count

        );

    }

    addItem(

        recipe.result,

        recipe.count

    );

    return true;

}

// ================= INVENTORY KEYS =================

// E = باز کردن اینونتوری
//
// داخل اینونتوری:
//
// R = Stick
// T = Crafting Table
// P = Wooden Pickaxe
// X = Wooden Axe

document.addEventListener(
    "keydown",
    e => {

        if (
            !inventoryOpen
        ) return;

        // Stick

        if (
            e.code === "KeyR"
        ) {

            craft(
                recipes[0]
            );

        }

        // Crafting Table

        if (
            e.code === "KeyT"
        ) {

            craft(
                recipes[1]
            );

        }

        // Pickaxe

        if (
            e.code === "KeyP"
        ) {

            craft(
                recipes[2]
            );

        }

        // Axe

        if (
            e.code === "KeyX"
        ) {

            craft(
                recipes[3]
            );

        }

    }
);

// ================= TOOL AUTO EQUIP =================

function updateToolFromHotbar() {

    const slot =

    inventory[
        selectedSlot
    ];

    if (

        slot.item ===
        ITEM.WOOD_PICKAXE

    ) {

        equippedTool =
        TOOL.WOOD_PICKAXE;

        return;

    }

    if (

        slot.item ===
        ITEM.WOOD_AXE

    ) {

        equippedTool =
        TOOL.WOOD_AXE;

        return;

    }

    equippedTool =
    TOOL.NONE;

}

// ================= UPDATE OVERRIDE =================

const oldUpdate =
    update;

update = function () {

    oldUpdate();

    updateToolFromHotbar();

};
// ======================================================
// MODERN BLOCKS
// VERSION 0.8 REBUILD
// PART 7/10
// TEXTURES + RENDERING
// ======================================================

// ================= TEXTURES =================

const textures = {};

function loadTexture(name) {

    const img =
        new Image();

    img.src =
        "textures/" +
        name +
        ".png";

    return img;

}

// BLOCKS

textures.grass =
    loadTexture("grass");

textures.dirt =
    loadTexture("dirt");

textures.stone =
    loadTexture("stone");

textures.wood =
    loadTexture("wood");

textures.leaf =
    loadTexture("leaf");

textures.bedrock =
    loadTexture("bedrock");

textures.crafting_table =
    loadTexture("crafting_table");

// ITEMS

textures.stick =
    loadTexture("stick");

textures.wood_pickaxe =
    loadTexture("wood_pickaxe");

textures.wood_axe =
    loadTexture("wood_axe");

// ================= TILE TEXTURE =================

function getTileTexture(tile) {

    switch (tile) {

        case TILE.GRASS:
            return textures.grass;

        case TILE.DIRT:
            return textures.dirt;

        case TILE.STONE:
            return textures.stone;

        case TILE.WOOD:
            return textures.wood;

        case TILE.LEAF:
            return textures.leaf;

        case TILE.BEDROCK:
            return textures.bedrock;

        case TILE.CRAFTING_TABLE:
            return textures.crafting_table;

    }

    return null;

}

// ================= ITEM TEXTURE =================

function getItemTexture(item) {

    switch (item) {

        case ITEM.GRASS:
            return textures.grass;

        case ITEM.DIRT:
            return textures.dirt;

        case ITEM.STONE:
            return textures.stone;

        case ITEM.WOOD:
            return textures.wood;

        case ITEM.LEAF:
            return textures.leaf;

        case ITEM.STICK:
            return textures.stick;

        case ITEM.CRAFTING_TABLE:
            return textures.crafting_table;

        case ITEM.WOOD_PICKAXE:
            return textures.wood_pickaxe;

        case ITEM.WOOD_AXE:
            return textures.wood_axe;

    }

    return null;

}

// ================= SKY =================

function drawSky() {

    ctx.fillStyle =
        "#87CEEB";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}

// ================= WORLD =================

function drawWorld() {

    const startX =
        Math.floor(
            camera.x / BLOCK
        );

    const endX =
        startX +
        Math.ceil(
            canvas.width /
            BLOCK
        ) + 2;

    const startY =
        Math.floor(
            camera.y / BLOCK
        );

    const endY =
        startY +
        Math.ceil(
            canvas.height /
            BLOCK
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

            const texture =
                getTileTexture(
                    tile
                );

            const drawX =
                x * BLOCK -
                camera.x;

            const drawY =
                y * BLOCK -
                camera.y;

            if (

                texture &&
                texture.complete

            ) {

                ctx.drawImage(

                    texture,

                    drawX,
                    drawY,

                    BLOCK,
                    BLOCK

                );

            }

            else {

                ctx.fillStyle =
                    "#ff00ff";

                ctx.fillRect(

                    drawX,
                    drawY,

                    BLOCK,
                    BLOCK

                );

            }

        }

    }

}

// ================= DROPS =================

function drawDrops() {

    for (
        const drop
        of droppedItems
    ) {

        const texture =

            getItemTexture(
                drop.item
            );

        const x =
            drop.x -
            camera.x -
            10;

        const y =
            drop.y -
            camera.y -
            10;

        if (

            texture &&
            texture.complete

        ) {

            ctx.drawImage(

                texture,

                x,
                y,

                20,
                20

            );

        }

        else {

            ctx.fillStyle =
                "#ffff00";

            ctx.fillRect(
                x,
                y,
                20,
                20
            );

        }

    }

}

// ================= PLAYER =================

function drawPlayer() {

    const x =
        player.x -
        camera.x;

    const y =
        player.y -
        camera.y;

    const legOffset =

        Math.sin(
            walkCycle
        ) * 5;

    ctx.strokeStyle =
        "black";

    ctx.lineWidth = 3;

    // HEAD

    ctx.beginPath();

    ctx.arc(
        x + 12,
        y + 10,
        8,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    // BODY

    ctx.beginPath();

    ctx.moveTo(
        x + 12,
        y + 18
    );

    ctx.lineTo(
        x + 12,
        y + 36
    );

    // ARMS

    ctx.moveTo(
        x + 12,
        y + 24
    );

    ctx.lineTo(
        x,
        y + 30
    );

    ctx.moveTo(
        x + 12,
        y + 24
    );

    ctx.lineTo(
        x + 24,
        y + 30
    );

    // LEGS

    ctx.moveTo(
        x + 12,
        y + 36
    );

    ctx.lineTo(
        x + 5,
        y + 50 +
        legOffset
    );

    ctx.moveTo(
        x + 12,
        y + 36
    );

    ctx.lineTo(
        x + 19,
        y + 50 -
        legOffset
    );

    ctx.stroke();

}

// ================= CROSSHAIR =================

function drawCrosshair() {

    ctx.strokeStyle =
        "rgba(255,255,255,0.5)";

    ctx.beginPath();

    ctx.moveTo(
        mouse.x - 10,
        mouse.y
    );

    ctx.lineTo(
        mouse.x + 10,
        mouse.y
    );

    ctx.moveTo(
        mouse.x,
        mouse.y - 10
    );

    ctx.lineTo(
        mouse.x,
        mouse.y + 10
    );

    ctx.stroke();

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.8 REBUILD
// PART 8/10
// UI + HOTBAR + INVENTORY
// ======================================================

// ================= HEALTH BAR =================

function drawHealthBar() {

    ctx.fillStyle =
        "#222";

    ctx.fillRect(
        20,
        20,
        240,
        28
    );

    ctx.fillStyle =
        "#ff4040";

    ctx.fillRect(

        20,
        20,

        (
            playerHealth.current /
            playerHealth.max
        ) * 240,

        28

    );

    ctx.strokeStyle =
        "#000";

    ctx.strokeRect(
        20,
        20,
        240,
        28
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

        30,
        39

    );

}

// ================= HOTBAR =================

function drawHotbar() {

    const size = 54;

    const startX =

        canvas.width / 2 -

        (9 * size) / 2;

    const y =
        canvas.height - 70;

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const slot =
            inventory[i];

        ctx.fillStyle =

            i === selectedSlot

            ? "#ffd54f"

            : "#444";

        ctx.fillRect(

            startX +
            i * size,

            y,

            50,

            50

        );

        ctx.strokeStyle =
            "#111";

        ctx.strokeRect(

            startX +
            i * size,

            y,

            50,

            50

        );

        if (
            slot.item !==
            ITEM.NONE
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

                    startX +
                    i * size +
                    8,

                    y + 8,

                    32,

                    32

                );

            }

            ctx.fillStyle =
                "white";

            ctx.font =
                "12px Arial";

            ctx.fillText(

                slot.count,

                startX +
                i * size +
                30,

                y + 45

            );

        }

    }

}

// ================= INVENTORY =================

function drawInventory() {

    if (
        !inventoryOpen
    ) return;

    ctx.fillStyle =
        "rgba(0,0,0,0.8)";

    ctx.fillRect(

        0,
        0,

        canvas.width,
        canvas.height

    );

    const cols = 9;
    const rows = 4;

    const slotSize = 60;

    const startX =

        canvas.width / 2 -

        (
            cols *
            slotSize
        ) / 2;

    const startY =
        120;

    ctx.fillStyle =
        "white";

    ctx.font =
        "26px Arial";

    ctx.fillText(
        "Inventory",
        startX,
        90
    );

    let index = 0;

    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < cols;
            col++
        ) {

            const slot =
                inventory[index];

            const x =

                startX +
                col *
                slotSize;

            const y =

                startY +
                row *
                slotSize;

            ctx.fillStyle =
                "#555";

            ctx.fillRect(
                x,
                y,
                54,
                54
            );

            ctx.strokeStyle =
                "#222";

            ctx.strokeRect(
                x,
                y,
                54,
                54
            );

            if (
                slot.item !==
                ITEM.NONE
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

                    x + 28,

                    y + 48

                );

            }

            index++;

        }

    }

}

// ================= CRAFTING HELP =================

function drawCraftingUI() {

    if (
        !inventoryOpen
    ) return;

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        "R = Stick",
        40,
        canvas.height - 150
    );

    ctx.fillText(
        "T = Crafting Table",
        40,
        canvas.height - 120
    );

    ctx.fillText(
        "P = Wooden Pickaxe",
        40,
        canvas.height - 90
    );

    ctx.fillText(
        "X = Wooden Axe",
        40,
        canvas.height - 60
    );

}

// ================= FPS =================

function drawFPS() {

    ctx.fillStyle =
        "#000";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        "FPS: " + fps,
        20,
        80
    );

}

// ================= PAUSE =================

function drawPauseMenu() {

    if (
        !paused
    ) return;

    ctx.fillStyle =
        "rgba(0,0,0,0.6)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
        "white";

    ctx.font =
        "50px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(

        "PAUSED",

        canvas.width / 2,

        canvas.height / 2

    );

    ctx.textAlign =
        "left";

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.8 REBUILD
// PART 8/10
// UI + HOTBAR + INVENTORY
// ======================================================

// ================= HEALTH BAR =================

function drawHealthBar() {

    ctx.fillStyle =
        "#222";

    ctx.fillRect(
        20,
        20,
        240,
        28
    );

    ctx.fillStyle =
        "#ff4040";

    ctx.fillRect(

        20,
        20,

        (
            playerHealth.current /
            playerHealth.max
        ) * 240,

        28

    );

    ctx.strokeStyle =
        "#000";

    ctx.strokeRect(
        20,
        20,
        240,
        28
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

        30,
        39

    );

}

// ================= HOTBAR =================

function drawHotbar() {

    const size = 54;

    const startX =

        canvas.width / 2 -

        (9 * size) / 2;

    const y =
        canvas.height - 70;

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const slot =
            inventory[i];

        ctx.fillStyle =

            i === selectedSlot

            ? "#ffd54f"

            : "#444";

        ctx.fillRect(

            startX +
            i * size,

            y,

            50,

            50

        );

        ctx.strokeStyle =
            "#111";

        ctx.strokeRect(

            startX +
            i * size,

            y,

            50,

            50

        );

        if (
            slot.item !==
            ITEM.NONE
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

                    startX +
                    i * size +
                    8,

                    y + 8,

                    32,

                    32

                );

            }

            ctx.fillStyle =
                "white";

            ctx.font =
                "12px Arial";

            ctx.fillText(

                slot.count,

                startX +
                i * size +
                30,

                y + 45

            );

        }

    }

}

// ================= INVENTORY =================

function drawInventory() {

    if (
        !inventoryOpen
    ) return;

    ctx.fillStyle =
        "rgba(0,0,0,0.8)";

    ctx.fillRect(

        0,
        0,

        canvas.width,
        canvas.height

    );

    const cols = 9;
    const rows = 4;

    const slotSize = 60;

    const startX =

        canvas.width / 2 -

        (
            cols *
            slotSize
        ) / 2;

    const startY =
        120;

    ctx.fillStyle =
        "white";

    ctx.font =
        "26px Arial";

    ctx.fillText(
        "Inventory",
        startX,
        90
    );

    let index = 0;

    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < cols;
            col++
        ) {

            const slot =
                inventory[index];

            const x =

                startX +
                col *
                slotSize;

            const y =

                startY +
                row *
                slotSize;

            ctx.fillStyle =
                "#555";

            ctx.fillRect(
                x,
                y,
                54,
                54
            );

            ctx.strokeStyle =
                "#222";

            ctx.strokeRect(
                x,
                y,
                54,
                54
            );

            if (
                slot.item !==
                ITEM.NONE
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

                    x + 28,

                    y + 48

                );

            }

            index++;

        }

    }

}

// ================= CRAFTING HELP =================

function drawCraftingUI() {

    if (
        !inventoryOpen
    ) return;

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        "R = Stick",
        40,
        canvas.height - 150
    );

    ctx.fillText(
        "T = Crafting Table",
        40,
        canvas.height - 120
    );

    ctx.fillText(
        "P = Wooden Pickaxe",
        40,
        canvas.height - 90
    );

    ctx.fillText(
        "X = Wooden Axe",
        40,
        canvas.height - 60
    );

}

// ================= FPS =================

function drawFPS() {

    ctx.fillStyle =
        "#000";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        "FPS: " + fps,
        20,
        80
    );

}

// ================= PAUSE =================

function drawPauseMenu() {

    if (
        !paused
    ) return;

    ctx.fillStyle =
        "rgba(0,0,0,0.6)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
        "white";

    ctx.font =
        "50px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(

        "PAUSED",

        canvas.width / 2,

        canvas.height / 2

    );

    ctx.textAlign =
        "left";

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.8 REBUILD
// PART 10/10
// SAVE + LOAD
// ======================================================

// ================= SAVE =================

function saveGame() {

    const saveData = {

        player: {

            x: player.x,
            y: player.y,

            health:
                playerHealth.current

        },

        inventory,

        selectedSlot,

        world

    };

    localStorage.setItem(
        "modernBlocksSave",
        JSON.stringify(
            saveData
        )
    );

    console.log(
        "Game Saved"
    );

}

// ================= LOAD =================

function loadGame() {

    const raw =

        localStorage.getItem(
            "modernBlocksSave"
        );

    if (!raw) {

        console.log(
            "No Save Found"
        );

        return;

    }

    const save =

        JSON.parse(raw);

    player.x =
        save.player.x;

    player.y =
        save.player.y;

    playerHealth.current =
        save.player.health;

    selectedSlot =
        save.selectedSlot;

    // inventory

    inventory.length = 0;

    for (
        const slot
        of save.inventory
    ) {

        inventory.push(
            slot
        );

    }

    // world

    world = save.world;

    console.log(
        "Game Loaded"
    );

}

// ================= HOTKEYS =================

document.addEventListener(
    "keydown",
    e => {

        // F5 SAVE

        if (
            e.code === "F5"
        ) {

            e.preventDefault();

            saveGame();

        }

        // F9 LOAD

        if (
            e.code === "F9"
        ) {

            e.preventDefault();

            loadGame();

        }

    }
);

// ================= AUTOSAVE =================

setInterval(

    saveGame,

    30000

);

// ================= LOAD ON START =================

window.addEventListener(
    "load",
    () => {

        loadGame();

    }
);

// ======================================================
// VERSION 0.8 COMPLETE
// ======================================================
