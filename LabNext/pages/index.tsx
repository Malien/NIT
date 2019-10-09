import React from "react"
import { AppFrame } from "../src/components/common"
import { GridItem } from "../src/components/grid-item"
import { AdaptiveGrid, GridCell } from "../src/components/layout"

const desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const HelloNext: React.FC = props => <AppFrame>
    <AdaptiveGrid columnWidth={300} rowHeight={300} responsive>
        <GridCell width={3} height={2}>
            <GridItem 
                name="Light night blouse"
                descripton={desc}
                id="id" 
                previews={["static/SVG/category-1.svg"]}
                tags={[]}
                price={39.99}
                prevPrice={59.99}
                rating={3}
            />
        </GridCell>
        <GridCell width={1} height={1}>
            <GridItem 
                name="Light night blouse"
                descripton={desc}
                id="id" 
                previews={["static/SVG/category-1.svg"]}
                tags={[]}
                price={39.99}
                prevPrice={34.78}
                rating={3}
            />
        </GridCell>
        <GridCell width={1} height={1}>
            <GridItem 
                name="Light night blouse"
                descripton={desc}
                id="id" 
                previews={["static/SVG/category-1.svg"]}
                tags={[]}
                price={39.99}
                rating={3}
            />
        </GridCell>
        <GridCell width={1} height={1}>
            <GridItem 
                name="Light night blouse"
                descripton={desc}
                id="id" 
                previews={["static/SVG/category-1.svg"]}
                tags={[]}
                price={39.99}
                rating={3}
            />
        </GridCell>
        <GridCell width={2} height={1}>
            <GridItem 
                name="Light night blouse"
                descripton={desc}
                id="id" 
                previews={["static/SVG/category-1.svg"]}
                tags={[]}
                price={39.99}
                rating={3}
            />
        </GridCell>
    </AdaptiveGrid>
    {/* <div style={{width: 600, height: 400, margin: 20, position: "relative", border: "0px dotted #ccc"}}>
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
    </div> */}
</AppFrame>

export default HelloNext