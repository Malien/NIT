import React, { useContext } from "react"
import { StoreItem } from "../shared/components"
import { AdaptiveGrid, GridCell } from "./layout"
import { GridItem } from "./grid-item"
import { ThemeContext, LookContext } from "./style"

const maxRating = 2.5
const maxWidth = 3
const maxHeight = 2

interface SectionProps {
    title?: string;
    items: StoreItem[];
}

export const Section: React.FC<SectionProps> = props => {
    let items = props.items
        .map(item => {
            let rating = item.rating
            if (item.prevPrice)     rating *= item.prevPrice / item.price
            if (item.bias)          rating += item.bias
            if (item.outOfStock)    rating /= 2
            let width = 1
            let height = 1
            while ((width < maxWidth || height < maxHeight) && rating > maxRating) {
                rating -= 1
                if (height <= width - 1) height++
                else width++
            }
            return { width, height, item, rating }
        })
        .sort((a, b) => a.rating - b.rating)
        .map(({ item, width, height }) => <GridCell width={width} height={height}><GridItem {...item} /></GridCell>)

    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)

    return <>
        <style jsx>{`
            .container {
                margin: 20px;
            }
            span {
                padding: 10px;
                color: ${theme.textColor};
                font-family: ${look.font};
                font-size: ${look.extraLarge}px;
            }
        `}</style>
        <div>
            <div className="container">
                {props.title && <span>{props.title}</span>}
                <AdaptiveGrid columnWidth={300} rowHeight={300} responsive>
                    {items}
                    {/* <GridCell width={3} height={2}>
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
                    </GridCell> */}
                </AdaptiveGrid>
            </div>
        </div>
    </>
}