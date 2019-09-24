import React from "react"
import { Sidebar, AppFrame } from "../src/components/common"
import { GridItem } from "../src/components/grid-item"

const desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const HelloNext: React.FC = props => <AppFrame>
    <div style={{width: 600, height: 400, margin: 20, position: "relative", border: "0px dotted #ccc"}}>
        <GridItem 
            name="Light night blouse"
            descripton={desc}
            id="id" 
            previews={["static/SVG/category-1.svg"]}
            tags={[]}
            price={39.99}
            rating={3}
        />
    </div>
    <div style={{width: 200, height: 200, margin: 20, position: "relative", border: "0px dotted #ccc"}}>
        <GridItem 
            name="Item name"
            descripton={desc} 
            id="id" 
            previews={["static/SVG/category-1.svg"]}
            tags={[]}
            price={39.99}
            rating={3}
        />
    </div>
    <div style={{width: 400, height: 200, margin: 20, position: "relative", border: "0px dotted #ccc"}}>
        <GridItem 
            name="Item name" 
            descripton={desc}
            id="id" 
            previews={["static/SVG/category-1.svg"]}
            tags={[]}
            price={39.99}
            rating={3}
        />
    </div>
    <div style={{width: 400, height: 400, margin: 20, position: "relative", border: "0px dotted #ccc"}}>
        <GridItem 
            name="Item name" 
            descripton={desc}
            id="id" 
            previews={["static/SVG/category-1.svg"]}
            tags={[]}
            price={39.99}
            rating={3}
        />
    </div>
</AppFrame>

export default HelloNext