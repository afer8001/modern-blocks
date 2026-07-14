// ======================================================
// MODERN BLOCKS
// VERSION 0.8
// PART 1
// ENGINE + INPUT + SETTINGS
// ======================================================

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

// ======================================================
// SETTINGS
// ======================================================

const BLOCK = 32;

const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 180;

const GRAVITY = 0.7;

let paused = false;
let inventoryOpen = false;

// ======================================================
// FPS
// ======================================================

let fps = 0;
let frames = 0;

let lastFpsTime =
    performance.now();

// ======================================================
// INPUT
// ======================================================

const keys = {};

document.addEventListener(
    "keydown",
    e => {

        keys[e.code] = true;

        if (
            e.code === "Escape"
        ) {

            paused =
                !paused;

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

// ======================================================
// MOUSE
// ======================================================

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

canvas.addEventListener(
    "contextmenu",
    e => {

        e.preventDefault();

    }
);

// ======================================================
// CAMERA
// ======================================================

const camera = {

    x: 0,
    y: 0

};

// ======================================================
// TILE IDS
// ======================================================

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

// ======================================================
// ITEM IDS
// ======================================================

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

// ======================================================
// TOOL IDS
// ======================================================

const TOOL = {

    NONE: 0,

    WOOD_PICKAXE: 1,

    WOOD_AXE: 2

};

let equippedTool =
    TOOL.NONE;

// ======================================================
// WORLD
// ======================================================

let world = [];

// ======================================================
// TEXTURES
// ======================================================

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
// ======================================================
// MODERN BLOCKS
// VERSION 0.8
// PART 2
// WORLD GENERATION
// ======================================================

const SURFACE_LEVEL = 45;
const HILL_HEIGHT = 12;

const heightMap = [];

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

// ================= WORLD =================

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
// بدون ورودی به سطح

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
        70 +
        Math.floor(
            Math.random() * 70
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
                    ty < 70 ||
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
            ) continue;

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
// VERSION 0.8
// PART 3
// PLAYER + PHYSICS
// ======================================================

// ================= SPAWN =================

const spawnPoint = {

    x:
        Math.floor(
            WORLD_WIDTH / 2
        ) * BLOCK,

    y:
        (
            heightMap[
                Math.floor(
                    WORLD_WIDTH / 2
                )
            ] - 5
        ) * BLOCK

};

// ================= PLAYER =================

const player = {

    x: spawnPoint.x,
    y: spawnPoint.y,

    width: 24,
    height: 50,

    vx: 0,
    vy: 0,

    speed: 4,

    jumpPower: 11,

    onGround: false,

    direction: 1

};

// ================= HEALTH =================

const playerHealth = {

    max: 100,
    current: 100

};

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

// ================= SOLID =================

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

        keys["Space"] &&
        player.onGround

    ) {

        player.vy =
            -player.jumpPower;

        player.onGround =
            false;

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

        player.x -=
            player.vx;

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

            player.onGround =
                true;

        }

        player.y -=
            player.vy;

        player.vy = 0;

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
        BLOCK +
        500

    ) {

        damage(999);

    }

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.8
// PART 4
// INVENTORY + HOTBAR
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

// ================= SLOT SELECT =================

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

    // empty

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
            (Math.random() - 0.5)
            * 2,

        vy: -3,

        item: itemId

    });

}

// ================= ITEM NAME =================

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
    ) {

        return "Crafting Table";

    }

    if (
        item === ITEM.WOOD_PICKAXE
    ) {

        return "Wood Pickaxe";

    }

    if (
        item === ITEM.WOOD_AXE
    ) {

        return "Wood Axe";

    }

    return "None";

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.8
// PART 5
// MINING + PLACING
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

    [TILE.WOOD]: 2,

    [TILE.STONE]: 999,

    [TILE.CRAFTING_TABLE]: 1.5

};

// ================= BREAK SPEED =================

function getBreakTime(
    tile
) {

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

// ================= PLAYER INSIDE =================

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

// ================= TILE TO ITEM =================

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

    // stone needs pickaxe

    if (
        tile === TILE.STONE
    ) {

        if (

            equippedTool !==
            TOOL.WOOD_PICKAXE

        ) {

            return;

        }

    }

    spawnDrop(

        tx * BLOCK +
        BLOCK / 2,

        ty * BLOCK +
        BLOCK / 2,

        tileToItem(
            tile
        )

    );

    setTile(
        tx,
        ty,
        TILE.AIR
    );

}

// ================= MOUSE =================

canvas.addEventListener(
    "mousedown",
    e => {

        if (
            paused
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

            const slot =
                inventory[
                    selectedSlot
                ];

            if (
                slot.count <= 0
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
                slot.item === ITEM.DIRT
            ) {

                setTile(
                    tx,
                    ty,
                    TILE.DIRT
                );

            }

            else if (
                slot.item === ITEM.GRASS
            ) {

                setTile(
                    tx,
                    ty,
                    TILE.GRASS
                );

            }

            else if (
                slot.item === ITEM.STONE
            ) {

                setTile(
                    tx,
                    ty,
                    TILE.STONE
                );

            }

            else if (
                slot.item === ITEM.WOOD
            ) {

                setTile(
                    tx,
                    ty,
                    TILE.WOOD
                );

            }

            else if (
                slot.item === ITEM.LEAF
            ) {

                setTile(
                    tx,
                    ty,
                    TILE.LEAF
                );

            }

            else if (
                slot.item ===
                ITEM.CRAFTING_TABLE
            ) {

                setTile(
                    tx,
                    ty,
                    TILE.CRAFTING_TABLE
                );

            }

            else {

                return;

            }

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

// ================= STOP MINING =================

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

    if (

        miningProgress >=

        getBreakTime(
            tile
        )

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
// VERSION 0.8
// PART 6
// CRAFTING SYSTEM
// ======================================================

// ================= RECIPES =================

const recipes = [

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

    {
        result: ITEM.CRAFTING_TABLE,
        count: 1,

        ingredients: [
            {
                item: ITEM.WOOD,
                count: 4
            }
        ]
    },

    {
        result: ITEM.WOOD_PICKAXE,
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

    {
        result: ITEM.WOOD_AXE,
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

// ================= INVENTORY KEYBINDS =================

// E = inventory

// R = sticks
// T = crafting table
// P = wooden pickaxe
// X = wooden axe

document.addEventListener(
    "keydown",
    e => {

        if (
            !inventoryOpen
        ) return;

        if (
            e.code === "KeyR"
        ) {

            craft(
                recipes[0]
            );

        }

        if (
            e.code === "KeyT"
        ) {

            craft(
                recipes[1]
            );

        }

        if (
            e.code === "KeyP"
        ) {

            craft(
                recipes[2]
            );

        }

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

// ================= CRAFTING UI =================

function drawCraftingUI() {

    if (
        !inventoryOpen
    ) return;

    ctx.fillStyle =
        "white";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        "R = Stick (2 Wood)",
        50,
        60
    );

    ctx.fillText(
        "T = Crafting Table (4 Wood)",
        50,
        90
    );

    ctx.fillText(
        "P = Wooden Pickaxe",
        50,
        120
    );

    ctx.fillText(
        "X = Wooden Axe",
        50,
        150
    );

}

// ================= UPDATE OVERRIDE =================

const oldUpdatePart6 =
    update;

update = function() {

    oldUpdatePart6();

    updateToolFromHotbar();

};
// ======================================================
// MODERN BLOCKS
// VERSION 0.8
// PART 7
// RENDERING
// ======================================================

// ================= TEXTURE HELPERS =================

function getTileTexture(tile) {

    if (tile === TILE.GRASS)
        return textures.grass;

    if (tile === TILE.DIRT)
        return textures.dirt;

    if (tile === TILE.STONE)
        return textures.stone;

    if (tile === TILE.WOOD)
        return textures.wood;

    if (tile === TILE.LEAF)
        return textures.leaf;

    if (tile === TILE.BEDROCK)
        return textures.bedrock;

    if (tile === TILE.CRAFTING_TABLE)
        return textures.craftingTable;

    return null;

}

function getItemTexture(item) {

    if (item === ITEM.GRASS)
        return textures.grass;

    if (item === ITEM.DIRT)
        return textures.dirt;

    if (item === ITEM.STONE)
        return textures.stone;

    if (item === ITEM.WOOD)
        return textures.wood;

    if (item === ITEM.LEAF)
        return textures.leaf;

    if (item === ITEM.STICK)
        return textures.stick;

    if (item === ITEM.CRAFTING_TABLE)
        return textures.craftingTable;

    if (item === ITEM.WOOD_PICKAXE)
        return textures.woodenPickaxe;

    if (item === ITEM.WOOD_AXE)
        return textures.woodenAxe;

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

            const texture =
                getTileTexture(tile);

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

            } else {

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

        } else {

            ctx.fillStyle =
                "yellow";

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

    ctx.fillStyle =
        "#222";

    ctx.fillRect(
        x,
        y,
        player.width,
        player.height
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        x + 5,
        y + 8,
        4,
        4
    );

    ctx.fillRect(
        x + 15,
        y + 8,
        4,
        4
    );

}

// ================= HEALTH BAR =================

function drawHealthBar() {

    ctx.fillStyle =
        "#222";

    ctx.fillRect(
        20,
        20,
        220,
        26
    );

    ctx.fillStyle =
        "#ff4040";

    ctx.fillRect(

        20,
        20,

        (
            playerHealth.current /
            playerHealth.max
        ) * 220,

        26

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

        ctx.fillStyle =

            i === selectedSlot

            ? "#ffe066"

            : "#444";

        ctx.fillRect(

            startX +
            i * size,

            y,

            50,

            50

        );

        const slot =
            inventory[i];

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

// ================= FPS =================

function drawFPS() {

    ctx.fillStyle =
        "black";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        "FPS: " + fps,
        20,
        80
    );

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.8
// PART 8
// UI + GAME LOOP
// ======================================================

// ================= INVENTORY =================

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

    const cols = 9;
    const rows = 4;

    const slotSize = 60;

    const startX =

        canvas.width / 2 -

        (cols * slotSize) / 2;

    const startY = 100;

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

            const x =
                startX +
                col * slotSize;

            const y =
                startY +
                row * slotSize;

            ctx.fillStyle =
                "#555";

            ctx.fillRect(
                x,
                y,
                54,
                54
            );

            const slot =
                inventory[index];

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

    ctx.fillStyle =
        "white";

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "Inventory",
        startX,
        startY - 20
    );

}

// ================= PAUSE =================

function drawPauseMenu() {

    if (!paused)
        return;

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
        "48px Arial";

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

    drawPlayer();

    drawCrosshair();

    drawHealthBar();

    drawHotbar();

    drawInventory();

    drawPauseMenu();

    drawFPS();

}

// ================= FPS =================

let lastFpsTime =
    performance.now();

let frames = 0;

let fps = 0;

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

// ================= START =================

gameLoop();
// ======================================================
// MODERN BLOCKS
// VERSION 0.8
// PART 9/10
// RENDERING
// ======================================================

function drawSky() {

    ctx.fillStyle = "#87CEEB";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}

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

    for(let y=startY;y<endY;y++){

        for(let x=startX;x<endX;x++){

            if(
                x<0 ||
                y<0 ||
                x>=WORLD_WIDTH ||
                y>=WORLD_HEIGHT
            ) continue;

            const tile =
                world[y][x];

            if(tile===TILE.AIR)
                continue;

            let img=null;

            if(tile===TILE.GRASS)
                img=textures.grass;

            if(tile===TILE.DIRT)
                img=textures.dirt;

            if(tile===TILE.STONE)
                img=textures.stone;

            if(tile===TILE.WOOD)
                img=textures.wood;

            if(tile===TILE.LEAF)
                img=textures.leaf;

            if(tile===TILE.BEDROCK)
                img=textures.bedrock;

            if(tile===TILE.CRAFTING_TABLE)
                img=textures.craftingTable;

            if(
                img &&
                img.complete
            ){

                ctx.drawImage(

                    img,

                    x*BLOCK-camera.x,
                    y*BLOCK-camera.y,

                    BLOCK,
                    BLOCK

                );

            }

        }

    }

}

function drawPlayer() {

    ctx.fillStyle="#222";

    ctx.fillRect(

        player.x-camera.x,
        player.y-camera.y,

        player.width,
        player.height

    );

}

function drawDrops(){

    for(const d of droppedItems){

        let img=null;

        if(d.item===ITEM.WOOD)
            img=textures.wood;

        if(d.item===ITEM.DIRT)
            img=textures.dirt;

        if(d.item===ITEM.GRASS)
            img=textures.grass;

        if(d.item===ITEM.STONE)
            img=textures.stone;

        if(d.item===ITEM.LEAF)
            img=textures.leaf;

        if(d.item===ITEM.STICK)
            img=textures.stick;

        if(d.item===ITEM.CRAFTING_TABLE)
            img=textures.craftingTable;

        if(d.item===ITEM.WOOD_PICKAXE)
            img=textures.woodenPickaxe;

        if(d.item===ITEM.WOOD_AXE)
            img=textures.woodenAxe;

        if(
            img &&
            img.complete
        ){

            ctx.drawImage(

                img,

                d.x-camera.x,
                d.y-camera.y,

                24,
                24

            );

        }

    }

}

function drawHotbar(){

    const size=54;

    const startX=
        canvas.width/2-
        (size*9)/2;

    const y=
        canvas.height-65;

    for(let i=0;i<9;i++){

        const slot=
            inventory[i];

        ctx.fillStyle=
            i===selectedSlot
            ? "#ffe066"
            : "#444";

        ctx.fillRect(

            startX+i*size,
            y,

            50,
            50

        );

        if(slot.item!==ITEM.NONE){

            let img=null;

            if(slot.item===ITEM.WOOD)
                img=textures.wood;

            if(slot.item===ITEM.DIRT)
                img=textures.dirt;

            if(slot.item===ITEM.GRASS)
                img=textures.grass;

            if(slot.item===ITEM.STONE)
                img=textures.stone;

            if(slot.item===ITEM.LEAF)
                img=textures.leaf;

            if(slot.item===ITEM.STICK)
                img=textures.stick;

            if(slot.item===ITEM.CRAFTING_TABLE)
                img=textures.craftingTable;

            if(slot.item===ITEM.WOOD_PICKAXE)
                img=textures.woodenPickaxe;

            if(slot.item===ITEM.WOOD_AXE)
                img=textures.woodenAxe;

            if(
                img &&
                img.complete
            ){

                ctx.drawImage(

                    img,

                    startX+i*size+8,
                    y+8,

                    32,
                    32

                );

            }

            ctx.fillStyle="white";

            ctx.font="12px Arial";

            ctx.fillText(

                slot.count,

                startX+i*size+30,

                y+46

            );

        }

    }

}
// ======================================================
// MODERN BLOCKS
// VERSION 0.8
// PART 10/10
// DRAW + GAME LOOP
// ======================================================

function drawSky() {

    ctx.fillStyle = "#87CEEB";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}

function draw() {

    drawSky();

    drawWorld();

    drawDrops();

    drawPlayer();

    drawHealthBar();

    drawHotbar();

    drawInventory();

}

function update() {

    updatePlayer();

    updateDrops();

    updateMining();

    updateTool();

    updateCamera();

}

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

        fps = frames;

        frames = 0;

        lastFpsTime = now;

    }

    requestAnimationFrame(
        gameLoop
    );

}

// ================= START =================

gameLoop();
