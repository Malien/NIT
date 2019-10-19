import React from "react"
import { StoreItem } from "../shared/components"
import { AdaptiveGrid, GridCell } from "./layout"
import { GridItem } from "./grid-item"

interface SectionProps {
    title?: string;
    items: StoreItem[];
}

const desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

export const Section: React.FC<SectionProps> = props => <>
    <style jsx>{`
        .container {
            margin: 20px;
        }
    `}</style>
    <div>
        <div className="container">
            {props.title && <span>{props.title}</span>}
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
                <GridCell width={2} height={1}>
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
        </div>
    </div>
</>