const uuid = require("uuid").v1
const { writeFile } = require("fs")

const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const rs = [1, 2, 3, 4, 5]
const bias = [-1, -0.5, 1, 1.5, 2, undefined]
const prices = [[59.99, 39.99], [34.99, 24.99], [39.99, 29.99], [79.99, 49.99], [129.99, 114.99], [64.99, 59.99]]

const rnd = itms => itms[Math.round(Math.random() * (itms.length - 1))]

function items(names, image, tag) {
    let p = rnd(prices)
    return names.map(name => ({
        name,
        description,
        id: uuid(),
        tags: [tag],
        previews: [image],
        price: p[0],
        prevPrice: (Math.random() < 0.33) ? p[1] : undefined,
        rating: rnd(rs),
        bias: rnd(bias),
        outOfStock: Math.random() < 0.2
    }))
}

// let items = [
//     {
//         name: "Light night blouse",
//         description: desc,
//         id: uuid(),
//         previews: ["static/SVG/category-1.svg"],
//         tags: [],
//         price: 39.99,
//         prevPrice: 59.99,
//         rating: 5,
//         bias: 1.5
//     },
//     {
//         name: "Indigo jeans",
//         description: desc,
//         id: uuid(),
//         previews: ["static/SVG/category-1.svg"],
//         tags: [],
//         price: 39.99,
//         rating: 4,
//         bias: -1
//     },
//     {
//         name: "French berette",
//         description: desc,
//         id: uuid(),
//         previews: ["static/SVG/category-1.svg"],
//         tags: [],
//         price: 24.99,
//         prevPrice: 34.99,
//         rating: 3,
//         outOfStock: true
//     },
//     {
//         name: "Khaki overalls",
//         description: desc,
//         id: uuid(),
//         previews: ["static/SVG/category-1.svg"],
//         tags: [],
//         price: 39.99,
//         rating: 2
//     },
//     {
//         name: "Cristy blouse",
//         description: desc,
//         id: uuid(),
//         previews: ["static/SVG/category-1.svg"],
//         tags: [],
//         price: 39.99,
//         rating: 5,
//         bias: -0.5
//     },
//     {
//         name: "\"Engage\" shirt",
//         description: desc,
//         id: uuid(),
//         previews: ["static/SVG/category-1.svg"],
//         tags: [],
//         price: 39.99,
//         rating: 2
//     },
// ]

writeFile("./static/items/hats.json", JSON.stringify([...items([
    "Plain binnie", "White cap", "Longé binnie", "Eraló hat", "Ubiqu hat", "Black cap", "Leather purse", "White pusrse", "Eco band", "Grace bracelet", "Enginóu band", "Sport headbang", "Diamond necklace", "Aquamarine earing", "Brass-plated bracelet", "Cozy socks", "Rudolf socks"
], "static/assets/SVG/category-1.svg", "accessory"),{
    name: "French berette",
    description,
    id: uuid(),
    previews: ["static/assets/SVG/category-1.svg"],
    tags: ["accessory"],
    price: 24.99,
    prevPrice: 34.99,
    rating: 3,
    outOfStock: true
}]), () => {})

writeFile("./static/items/leggins.json", JSON.stringify([...items([
    "Sporty leggins", "Orgenté pants", "Comfy shorts", "Wide shorts", "Sweat pants", "Pink trousers", "Sailor pants"
], "static/assets/SVG/category-2.svg", "leggins"),{
    name: "Khaki overalls",
    description,
    id: uuid(),
    previews: ["static/assets/SVG/category-2.svg"],
    tags: ["leggins"],
    price: 39.99,
    rating: 2
},{
    name: "Indigo jeans",
    description,
    id: uuid(),
    previews: ["static/assets/SVG/category-2.svg"],
    tags: ["leggins"],
    price: 39.99,
    rating: 4,
    bias: -1
}]), () => {})

writeFile("./static/items/tops.json", JSON.stringify([...items([
    "T-shirt with skulls", "Red longsleeve", "Sporty longsleeve", "Stealth hoodie", "Checkered shirt", "Christmas sweater", "Light white sweater", "Leather jacket"
], "static/assets/SVG/category-3.svg", "top"),{
    name: "Light night blouse",
    description,
    id: uuid(),
    previews: ["static/assets/SVG/category-3.svg"],
    tags: ["top"],
    price: 39.99,
    prevPrice: 59.99,
    rating: 5,
    bias: 1.5
},{
    name: "Cristy blouse",
    description,
    id: uuid(),
    previews: ["static/assets/SVG/category-3.svg"],
    tags: ["top"],
    price: 39.99,
    rating: 5,
    bias: -0.5
},{
    name: "\"Engage\" shirt",
    description,
    id: uuid(),
    previews: ["static/assets/SVG/category-3.svg"],
    tags: ["top"],
    price: 39.99,
    rating: 2
}]), () => {})