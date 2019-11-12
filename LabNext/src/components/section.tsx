import Link from "next/link"
import React, { useContext } from "react"
import { StoreItem } from "../shared/components"
import { GridItem, PlaceholderItem } from "./grid-item"
import { AdaptiveGrid, GridCell } from "./layout"
import { LookContext, ThemeContext } from "./style"

const maxRating = 3.5
const maxWidth = 3
const maxHeight = 2

export interface SectionProps {
    link?: string
    title?: string;
    items: StoreItem[];
    onBuy?: (item: StoreItem) => void;
}

/**
 * Renders section filled with items in a grid, with sizes, and priorities 
 * determined automatically using rating, discount amount (if present) and bias
 * @param props Items to be displayed, title of section, link upon click on category title and buy handler for priducts inside
 */
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
        .sort((a, b) => b.rating - a.rating)
        .map(({ item, width, height }) => 
            <GridCell key={item.id} width={width} height={height}>
                <GridItem {...item} onBuy={() => {if (props.onBuy) props.onBuy(item)}}/>
            </GridCell>)

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
            a {
                padding: 10px;
                color: ${theme.textColor};
                font-family: ${look.font};
                font-size: ${look.extraLarge}px;
                text-decoration: none;
            }
            .divider {
                margin: 40px 5% 20px;
                height: 4px;
                border-radius: 2px;
                width: 90%;
                background-color: ${theme.textSubcolor};
            }
        `}</style>
        <div>
            <div className="container">
                {props.title && <div className="divider"/>}
                {props.title && 
                    (props.link 
                        ? <Link href={props.link}>
                            <a>{props.title}</a>
                        </Link>
                        : <span>{props.title}</span>)}
                <AdaptiveGrid columnWidth={300} rowHeight={300} responsive placeholder={<PlaceholderItem />}>
                    {items}
                </AdaptiveGrid>
            </div>
        </div>
    </>
}