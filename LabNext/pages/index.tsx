import React from "react"
import { AppFrame, Storefront, ErrorMsg } from "../src/components/common"
import { StoreItem } from "../src/shared/components";
import { v1 as uuid } from "uuid";
import { NextPage } from "next";
import { fetchItems } from "../src/api/browser";

const desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

let items: StoreItem[] = [
    {
        name: "Light night blouse",
        description: desc,
        id: uuid(),
        previews: ["static/assets/SVG/category-2.svg"],
        tags: [],
        price: 39.99,
        prevPrice: 59.99,
        rating: 5,
        bias: 1.5
    },
    {
        name: "Indigo jeans",
        description: desc,
        id: uuid(),
        previews: ["static/assets/SVG/category-3.svg"],
        tags: [],
        price: 39.99,
        rating: 4,
        bias: -1
    },
    {
        name: "French berette",
        description: desc,
        id: uuid(),
        previews: ["static/assets/SVG/category-1.svg"],
        tags: [],
        price: 24.99,
        prevPrice: 34.99,
        rating: 3,
        outOfStock: true
    },
    {
        name: "Khaki overalls",
        description: desc,
        id: uuid(),
        previews: ["static/assets/SVG/category-3.svg"],
        tags: [],
        price: 39.99,
        rating: 2
    },
    {
        name: "Cristy blouse",
        description: desc,
        id: uuid(),
        previews: ["static/assets/SVG/category-2.svg"],
        tags: [],
        price: 39.99,
        rating: 5,
        bias: -0.5
    },
    {
        name: "\"Engage\" shirt",
        description: desc,
        id: uuid(),
        previews: ["static/assets/SVG/category-2.svg"],
        tags: [],
        price: 39.99,
        rating: 2
    },
]

interface IndexPageProps {
    hats: StoreItem[];
    tops: StoreItem[];
    leggins: StoreItem[];
    err?: boolean;
}

const IndexPage: NextPage<IndexPageProps> = props => {
    return <AppFrame path="/" name="All Items">
        {props.err && <ErrorMsg msg="Error occured while loading products" />}
        <Storefront items={items} sections={[
            {title: "Hats and Accessories", items: props.hats, link:"/accessories" },
            {title: "Jackets and tops", items: props.tops, link:"/tops"},
            {title: "Pants and leggins", items: props.leggins, link:"/leggins"}
        ]}/>
    </AppFrame>
}
IndexPage.getInitialProps = async (ctx) => {
    if (ctx.req) {
        // node.js
        return {
            hats: require("../static/items/hats.json"),
            tops: require("../static/items/tops.json"),
            leggins: require("../static/items/leggins.json")
        }
    } else {
        // browser
        return fetchItems({
            hats: "/static/items/hats.json",
            tops: "/static/items/tops.json",
            leggins: "/static/items/leggins.json"
        }, [])
    }
}

export default IndexPage