import React from "react"
import { AppFrame } from "../src/components/common"
import { Section } from "../src/components/section"
import { StoreItem } from "../src/shared/components";

const desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

let items: StoreItem[] = [
    {
        name:"Light night blouse",
        descripton:desc,
        id:"id",
        previews:["static/SVG/category-1.svg"],
        tags:[],
        price:39.99,
        prevPrice:59.99,
        rating:5,
        bias: 1.5
    },
    {
        name:"Indigo jeans",
        descripton:desc,
        id:"id",
        previews:["static/SVG/category-1.svg"],
        tags:[],
        price:39.99,
        rating:4,
        bias: -1
    },
    {
        name:"French berette",
        descripton:desc,
        id:"id",
        previews:["static/SVG/category-1.svg"],
        tags:[],
        price:39.99,
        rating:3,
        outOfStock: true
    },
    {
        name:"Khaki overalls",
        descripton:desc,
        id:"id",
        previews:["static/SVG/category-1.svg"],
        tags:[],
        price:39.99,
        rating:2
    },
    {
        name:"Cristy blouse",
        descripton:desc,
        id:"id",
        previews:["static/SVG/category-1.svg"],
        tags:[],
        price:39.99,
        rating:5,
        bias: -0.5
    },
    {
        name:"\"Engage\" shirt",
        descripton:desc,
        id:"id",
        previews:["static/SVG/category-1.svg"],
        tags:[],
        price:39.99,
        rating:2
    },
]

const HelloNext: React.FC = props => <AppFrame>
    <Section items={items}/>
</AppFrame>

export default HelloNext