import React from "react"
import { Sidebar, AppFrame } from "../src/components/common"
import { GridItem } from "../src/components/grid-item"

const HelloNext: React.FC = props => <AppFrame>
    <div style={{width: 300, height: 200, margin: 20, position: "relative", border: "3px dotted #ccc"}}>
        <GridItem 
            name="Item name" 
            id="id" 
            previews={["static/SVG/category-1.svg"]}
            tags={[]}
            price={39.99}
            rating={3}
        />
    </div>
</AppFrame>

export default HelloNext