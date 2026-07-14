// ======================================================
// MODERN BLOCKS
// VERSION 0.7
// PART 1/8
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

let settings = JSON.parse(

    localStorage.getItem(
        "settings"
    )

) || {

    left: "KeyA",
    right: "KeyD",
    jump: "Space",
    inventory: "KeyE"

};

// ================= INPUT =================

const keys = {};

document.addEventListener(
    "keydown",
    e => {

        keys[e.code] = true;

        // pause

        if (
            e.code ===
            "Escape"
        ) {

            paused =
                !paused;

        }

        // inventory

        if (
            e.code ===
            settings.inventory
        ) {

            inventoryOpen =
                !inventoryOpen;

        }

        // hotbar

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

    worldX: 0,
    worldY: 0

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

let inventoryOpen =
    false;

// ================= WORLD =================

const BLOCK = 32;

const WORLD_WIDTH =
    1000;

const WORLD_HEIGHT =
    180;

let world = [];

// ================= TILES =================

const TILE = {

    AIR: 0,

    GRASS: 1,

    DIRT: 2,

    STONE: 3,

    WOOD: 4,

    LEAF: 5,

    BEDROCK: 6

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

// ================= DROPS =================

let droppedItems = [];

// ================= CAMERA =================

const camera = {

    x: 0,
    y: 0

};

// ================= HEALTH =================

const playerHealth = {

    max: 100,
    current: 100

};

// ================= INVENTORY =================

// 36 slots

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

// ================= WALK =================

let walkCycle = 0;

// ================= JUMP =================

let jumpPressed =
    false;

document.addEventListener(
    "keydown",
    e => {

        if (
            e.code ===
            settings.jump
        ) {

            jumpPressed =
                true;

        }

    }
);

// ================= PLAYER =================

const spawnPoint = {

    x: 400,
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

    jumpPower: 11,

    direction: 1,

    onGround: false

};

const gravity =
    0.7;

// ================= FPS =================

let fps = 0;

let frames = 0;

let lastFpsTime =
    performance.now();
// ======================================================
// WORLD GENERATION
// PART 2/8
// ======================================================

// ================= TERRAIN SETTINGS =================

const SURFACE_LEVEL = 40;

const HILL_HEIGHT = 8;

const CAVE_START_DEPTH = 55;

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
        SURFACE_LEVEL - HILL_HEIGHT
    ) {
        currentHeight =
            SURFACE_LEVEL -
            HILL_HEIGHT;
    }

    if (
        currentHeight >
        SURFACE_LEVEL + HILL_HEIGHT
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

        // sky

        if (
            y < surface
        ) {

            world[y][x] =
                TILE.AIR;

        }

        // grass

        else if (
            y === surface
        ) {

            world[y][x] =
                TILE.GRASS;

        }

        // dirt

        else if (
            y <
            surface + 6
        ) {

            world[y][x] =
                TILE.DIRT;

        }

        // stone

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
    ][x] = TILE.BEDROCK;

}

// ================= CAVES =================

// غارها فقط زیر زمین

for (
    let i = 0;
    i < 450;
    i++
) {

    let cx = Math.floor(
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
                10
            )
        );

    const length =
        25 +
        Math.floor(
            Math.random() * 35
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
                    ty < CAVE_START_DEPTH ||
                    tx >= WORLD_WIDTH ||
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
    let x = 10;
    x < WORLD_WIDTH - 10;
    x++
) {

    if (
        Math.random() >
        0.08
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

    // leaves

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

player.x =
    spawnX * BLOCK;

player.y =
    (
        heightMap[spawnX] - 5
    ) * BLOCK;

spawnPoint.x =
    player.x;

spawnPoint.y =
    player.y;

// ================= ITEM HELPERS =================

function createItem(
    item,
    count = 1
) {

    return {

        item: item,

        count: count

    };

}

function getItemName(
    item
) {

    if (
        item === ITEM.GRASS
    ) return "Grass";

    if (
        item === ITEM.DIRT
    ) return "Dirt";

    if (
        item === ITEM.STONE
    ) return "Stone";

    if (
        item === ITEM.WOOD
    ) return "Wood";

    if (
        item === ITEM.LEAF
    ) return "Leaf";

    if (
        item === ITEM.STICK
    ) return "Stick";

    if (
        item === ITEM.CRAFTING_TABLE
    ) return "Crafting Table";

    if (
        item === ITEM.WOOD_PICKAXE
    ) return "Wood Pickaxe";

    if (
        item === ITEM.WOOD_AXE
    ) return "Wood Axe";

    return "None";

}
// ======================================================
// PLAYER + PHYSICS
// PART 3/8
// ======================================================

// ================= COLLISION =================

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

function isSolid(
    tile
) {

    return (

        tile === TILE.GRASS ||
        tile === TILE.DIRT ||
        tile === TILE.STONE ||
        tile === TILE.WOOD ||
        tile === TILE.LEAF ||
        tile === TILE.BEDROCK

    );

}

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

// ================= HEALTH =================

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

// ================= MOVEMENT =================

function updatePlayer() {

    player.vx = 0;

    if (
        keys[
            settings.left
        ]
    ) {

        player.vx =
            -player.speed;

        player.direction =
            -1;

    }

    if (
        keys[
            settings.right
        ]
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

        walkCycle +=
            0.15;

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

                +

                BLOCK;

        }

    }

    // ================= GRAVITY =================

    player.vy +=
        gravity;

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

                +

                BLOCK;

            player.vy = 0;

        }

    }

    // ================= WORLD BORDER =================

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

// ================= UPDATE =================

function update() {

    updatePlayer();

    updateCamera();

}
// ======================================================
// INVENTORY + ITEMS + DROPS
// PART 4/8
// ======================================================

// ================= ITEMS =================

function addItem(
    itemId,
    count = 1
) {

    // stack existing

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
            slot.item ===
            ITEM.NONE
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

// ================= START ITEMS =================

// تست اولیه

addItem(
    ITEM.WOOD,
    12
);

// ================= DROPS =================

function spawnDrop(
    x,
    y,
    item
) {

    droppedItems.push({

        x: x,
        y: y,

        vx:
            (Math.random() - 0.5)
            * 2,

        vy: -3,

        item: item

    });

}

// ================= PICKUP =================

function updateDrops() {

    for (

        let i =
            droppedItems.length - 1;

        i >= 0;

        i--

    ) {

        const drop =
            droppedItems[i];

        drop.vy += 0.25;

        if (
            drop.vy > 8
        ) {

            drop.vy = 8;

        }

        drop.x +=
            drop.vx;

        drop.y +=
            drop.vy;

        const tx =

            Math.floor(
                drop.x /
                BLOCK
            );

        const ty =

            Math.floor(
                drop.y /
                BLOCK
            );

        if (
            isSolid(
                getTile(
                    tx,
                    ty
                )
            )
        ) {

            drop.y =
                ty * BLOCK - 8;

            drop.vy = 0;

        }

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

// ================= TOOLS =================

const TOOL = {

    NONE: 0,

    WOOD_PICKAXE: 1,

    WOOD_AXE: 2

};

let equippedTool =
    TOOL.NONE;

// ================= CRAFTING =================

const recipes = [

    {

        result:
            ITEM.STICK,

        count: 4,

        ingredients: [

            {
                item:
                    ITEM.WOOD,

                count: 2
            }

        ]

    },

    {

        result:
            ITEM.CRAFTING_TABLE,

        count: 1,

        ingredients: [

            {
                item:
                    ITEM.WOOD,

                count: 4
            }

        ]

    },

    {

        result:
            ITEM.WOOD_PICKAXE,

        count: 1,

        ingredients: [

            {
                item:
                    ITEM.WOOD,

                count: 3
            },

            {
                item:
                    ITEM.STICK,

                count: 2
            }

        ]

    },

    {

        result:
            ITEM.WOOD_AXE,

        count: 1,

        ingredients: [

            {
                item:
                    ITEM.WOOD,

                count: 3
            },

            {
                item:
                    ITEM.STICK,

                count: 2
            }

        ]

    }

];

// ================= CRAFT =================

function canCraft(
    recipe
) {

    for (
        const ing
        of recipe.ingredients
    ) {

        if (

            countItem(
                ing.item
            ) <

            ing.count

        ) {

            return false;

        }

    }

    return true;

}

function craft(
    recipe
) {

    if (
        !canCraft(
            recipe
        )
    ) return;

    for (
        const ing
        of recipe.ingredients
    ) {

        removeItem(
            ing.item,
            ing.count
        );

    }

    addItem(
        recipe.result,
        recipe.count
    );

}

// ================= INVENTORY INPUT =================

document.addEventListener(
    "keydown",
    e => {

        if (
            !inventoryOpen
        ) return;

        // craft stick

        if (
            e.code === "KeyR"
        ) {

            craft(
                recipes[0]
            );

        }

        // crafting table

        if (
            e.code === "KeyT"
        ) {

            craft(
                recipes[1]
            );

        }

        // pickaxe

        if (
            e.code === "KeyP"
        ) {

            craft(
                recipes[2]
            );

        }

        // axe

        if (
            e.code === "KeyX"
        ) {

            craft(
                recipes[3]
            );

        }

    }
);

// ================= UPDATE OVERRIDE =================

function update() {

    updatePlayer();

    updateCamera();

    updateDrops();

}
// ======================================================
// MINING + PLACING + TOOLS
// PART 5/8
// ======================================================

// ================= MINING =================

let miningBlock = null;
let miningProgress = 0;

const BREAK_RANGE = 6;

// زمان کندن بر حسب ثانیه

const breakTimes = {

    [TILE.GRASS]: 0.5,

    [TILE.DIRT]: 0.7,

    [TILE.WOOD]: 2.0,

    [TILE.LEAF]: 0.2,

    [TILE.STONE]: 999

};

// ================= TOOL SPEED =================

function getBreakTime(tile) {

    let time =
        breakTimes[tile] || 1;

    // pickaxe

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

    // axe

    if (
        equippedTool ===
        TOOL.WOOD_AXE
    ) {

        if (
            tile === TILE.WOOD
        ) {

            time = 0.6;

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

// ================= TILE -> ITEM =================

function tileToItem(
    tile
) {

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

    return ITEM.NONE;

}

// ================= BREAK BLOCK =================

function breakBlock(
    tx,
    ty
) {

    const tile =
        getTile(
            tx,
            ty
        );

    if (
        tile === TILE.AIR
    ) return;

    if (
        tile === TILE.BEDROCK
    ) return;

    // stone requires pickaxe

    if (
        tile === TILE.STONE
    ) {

        if (
            equippedTool !==
            TOOL.WOOD_PICKAXE
        ) {

            setTile(
                tx,
                ty,
                TILE.AIR
            );

            return;

        }

    }

    // normal drop

    if (
        tile !== TILE.LEAF
    ) {

        spawnDrop(

            tx * BLOCK +
            BLOCK / 2,

            ty * BLOCK +
            BLOCK / 2,

            tileToItem(
                tile
            )

        );

    }

    // leaf chance

    if (
        tile === TILE.LEAF
    ) {

        if (
            Math.random()
            < 0.20
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

            setTile(
                tx,
                ty,
                TILE.DIRT
            );

        }

    }
);

// ================= MOUSE UP =================

canvas.addEventListener(
    "mouseup",
    () => {

        miningBlock =
            null;

        miningProgress =
            0;

    }
);

// ================= MINING UPDATE =================

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

        miningBlock =
            null;

        return;

    }

    miningProgress +=
        1 / 60;

    const needTime =
        getBreakTime(
            tile
        );

    if (
        miningProgress >=
        needTime
    ) {

        breakBlock(

            miningBlock.x,

            miningBlock.y

        );

        miningBlock =
            null;

        miningProgress =
            0;

    }

}

// ================= TOOL EQUIP =================

document.addEventListener(
    "keydown",
    e => {

        if (
            e.code ===
            "F1"
        ) {

            equippedTool =
                TOOL.NONE;

        }

        if (
            e.code ===
            "F2"
        ) {

            equippedTool =
                TOOL.WOOD_PICKAXE;

        }

        if (
            e.code ===
            "F3"
        ) {

            equippedTool =
                TOOL.WOOD_AXE;

        }

    }
);

// ================= UPDATE OVERRIDE =================

function update() {

    updatePlayer();

    updateCamera();

    updateDrops();

    updateMining();

}
// ======================================================
// RENDERING + UI
// PART 6/8
// ======================================================

// ================= ITEM COLORS =================

function getItemColor(item) {

    if (item === ITEM.GRASS)
        return "#4CAF50";

    if (item === ITEM.DIRT)
        return "#8B5A2B";

    if (item === ITEM.STONE)
        return "#808080";

    if (item === ITEM.WOOD)
        return "#6b3e1d";

    if (item === ITEM.LEAF)
        return "#2ecc71";

    if (item === ITEM.STICK)
        return "#d2a679";

    if (item === ITEM.CRAFTING_TABLE)
        return "#8b4513";

    if (item === ITEM.WOOD_PICKAXE)
        return "#e6c38a";

    if (item === ITEM.WOOD_AXE)
        return "#c49b63";

    return "#ffffff";

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

            if (
                tile === TILE.GRASS
            ) {
                ctx.fillStyle =
                    "#4CAF50";
            }

            if (
                tile === TILE.DIRT
            ) {
                ctx.fillStyle =
                    "#8B5A2B";
            }

            if (
                tile === TILE.STONE
            ) {
                ctx.fillStyle =
                    "#777777";
            }

            if (
                tile === TILE.WOOD
            ) {
                ctx.fillStyle =
                    "#6b3e1d";
            }

            if (
                tile === TILE.LEAF
            ) {
                ctx.fillStyle =
                    "#2ecc71";
            }

            if (
                tile === TILE.BEDROCK
            ) {
                ctx.fillStyle =
                    "#111111";
            }

            ctx.fillRect(

                x * BLOCK -
                camera.x,

                y * BLOCK -
                camera.y,

                BLOCK,
                BLOCK

            );

            ctx.strokeStyle =
                "rgba(0,0,0,0.15)";

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

// ================= DROPS =================

function drawDrops() {

    for (
        const drop
        of droppedItems
    ) {

        ctx.fillStyle =
            getItemColor(
                drop.item
            );

        ctx.fillRect(

            drop.x -
            camera.x - 8,

            drop.y -
            camera.y - 8,

            16,
            16

        );

        ctx.strokeStyle =
            "black";

        ctx.strokeRect(

            drop.x -
            camera.x - 8,

            drop.y -
            camera.y - 8,

            16,
            16

        );

    }

}

// ================= STICKMAN =================

function drawStickman(
    x,
    y
) {

    const legOffset =

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

    // legs

    ctx.moveTo(
        x + 12,
        y + 35
    );

    ctx.lineTo(
        x + 4,
        y + 50 +
        legOffset
    );

    ctx.moveTo(
        x + 12,
        y + 35
    );

    ctx.lineTo(
        x + 20,
        y + 50 -
        legOffset
    );

    ctx.stroke();

}

// ================= HEALTH =================

function drawHealthBar() {

    ctx.fillStyle =
        "rgba(0,0,0,0.4)";

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
        "black";

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

    const size = 50;

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

            ? "#ffe066"

            : "#444";

        ctx.fillRect(

            startX +
            i * size,

            y,

            48,
            48

        );

        if (
            slot.item !==
            ITEM.NONE
        ) {

            ctx.fillStyle =
                getItemColor(
                    slot.item
                );

            ctx.fillRect(

                startX +
                i * size +
                8,

                y + 8,

                30,
                30

            );

            ctx.fillStyle =
                "white";

            ctx.font =
                "12px Arial";

            ctx.fillText(

                slot.count,

                startX +
                i * size +
                28,

                y + 44

            );

        }

    }

}
// ======================================================
// INVENTORY UI + CRAFTING UI + PAUSE MENU
// PART 7/8
// ======================================================

// ================= TOOL NAME =================

function getToolName() {

    if (
        equippedTool ===
        TOOL.WOOD_PICKAXE
    ) {
        return "Wood Pickaxe";
    }

    if (
        equippedTool ===
        TOOL.WOOD_AXE
    ) {
        return "Wood Axe";
    }

    return "Hand";

}

// ================= INVENTORY =================

function drawInventory() {

    if (
        !inventoryOpen
    ) return;

    ctx.fillStyle =
        "rgba(0,0,0,0.75)";

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

    const startY = 120;

    ctx.fillStyle =
        "white";

    ctx.font =
        "32px Arial";

    ctx.fillText(
        "Inventory",
        startX,
        70
    );

    let slotIndex = 0;

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
                inventory[
                    slotIndex
                ];

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
                "black";

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

                ctx.fillStyle =
                    getItemColor(
                        slot.item
                    );

                ctx.fillRect(
                    x + 8,
                    y + 8,
                    36,
                    36
                );

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

            slotIndex++;

        }

    }

}

// ================= CRAFTING =================

function drawCraftingUI() {

    if (
        !inventoryOpen
    ) return;

    const x =
        80;

    const y =
        canvas.height - 260;

    ctx.fillStyle =
        "rgba(40,40,40,0.9)";

    ctx.fillRect(
        x,
        y,
        520,
        180
    );

    ctx.fillStyle =
        "white";

    ctx.font =
        "24px Arial";

    ctx.fillText(
        "Crafting",
        x + 15,
        y + 35
    );

    ctx.font =
        "18px Arial";

    ctx.fillText(
        "[R] Stick (2 Wood)",
        x + 20,
        y + 70
    );

    ctx.fillText(
        "[T] Crafting Table (4 Wood)",
        x + 20,
        y + 100
    );

    ctx.fillText(
        "[P] Wooden Pickaxe",
        x + 20,
        y + 130
    );

    ctx.fillText(
        "[X] Wooden Axe",
        x + 20,
        y + 160
    );

}

// ================= TOOL HUD =================

function drawToolHUD() {

    ctx.fillStyle =
        "rgba(0,0,0,0.5)";

    ctx.fillRect(
        canvas.width - 260,
        20,
        240,
        40
    );

    ctx.fillStyle =
        "white";

    ctx.font =
        "18px Arial";

    ctx.fillText(

        "Tool: " +
        getToolName(),

        canvas.width - 245,
        46

    );

}

// ================= MINING BAR =================

function drawMiningBar() {

    if (
        !miningBlock
    ) return;

    const tile =
        getTile(
            miningBlock.x,
            miningBlock.y
        );

    const totalTime =
        getBreakTime(
            tile
        );

    const percent =

        Math.min(

            miningProgress /
            totalTime,

            1

        );

    ctx.fillStyle =
        "rgba(0,0,0,0.6)";

    ctx.fillRect(
        canvas.width / 2 - 120,
        20,
        240,
        25
    );

    ctx.fillStyle =
        "#ffe066";

    ctx.fillRect(

        canvas.width / 2 - 120,

        20,

        240 *
        percent,

        25

    );

    ctx.strokeStyle =
        "black";

    ctx.strokeRect(
        canvas.width / 2 - 120,
        20,
        240,
        25
    );

}

// ================= PAUSE =================

function drawPauseMenu() {

    if (
        !paused
    ) return;

    ctx.fillStyle =
        "rgba(0,0,0,0.7)";

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
        "64px Arial";

    ctx.fillText(

        "PAUSED",

        canvas.width / 2,

        canvas.height / 2 - 80

    );

    ctx.font =
        "26px Arial";

    ctx.fillText(

        "ESC = Resume",

        canvas.width / 2,

        canvas.height / 2

    );

    ctx.fillText(

        "E = Inventory",

        canvas.width / 2,

        canvas.height / 2 + 50

    );

    ctx.fillText(

        "Modern Blocks v0.7",

        canvas.width / 2,

        canvas.height / 2 + 110

    );

    ctx.textAlign =
        "left";

}
// ======================================================
// MAIN DRAW + GAME LOOP
// PART 8/8
// ======================================================

// ================= FPS =================

function drawFPS() {

    ctx.fillStyle =
        "black";

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "FPS: " + fps,
        20,
        80
    );

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

// ================= DRAW =================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawSky();

    drawWorld();

    drawDrops();

    drawStickman(

        player.x -
        camera.x,

        player.y -
        camera.y

    );

    drawCrosshair();

    drawHealthBar();

    drawHotbar();

    drawToolHUD();

    drawMiningBar();

    drawInventory();

    drawCraftingUI();

    drawPauseMenu();

    drawFPS();

}

// ================= LOOP =================

function gameLoop() {

    if (
        !paused
    ) {

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

// ================= START =================

gameLoop();
