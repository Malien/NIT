import React, { useState, useRef, useEffect, useContext } from "react"
import { StoreItem } from "../shared/components"
import { useBounds, useHover } from "./hooks"
import { ThemeContext, LookContext } from "./style"
import { scrollTo, easeInSine, easeInOutSine, linear } from "./animate"

function splitName(name: string): [string, string] {
    let words = name.split(" ")
    let pivot = Math.floor(words.length / 2)
    const charCount = (words: string[]) => words.map(w => w.length).reduce((prev, cur) => prev + cur)
    while (charCount(words.slice(0, pivot)) > charCount(words.slice(pivot))) {
        if (pivot == 1) return [words.slice(0, pivot).join(), words.slice(pivot).join()]
        pivot--
    }
    return [words.slice(0, pivot).join(), words.slice(pivot).join(" ")]
}

interface StarRatingProps {
    rating: number;
}
export const StarRating: React.FC<StarRatingProps> = props => {
    let out: JSX.Element[] = []
    for (let i=0; i<props.rating; ++i) {
        out.push(<div style={{
            width: "20px",
            height: "20px",
            borderRadius: "5px",
            margin: "5px",
            backgroundColor: "yellow"
        }} />)
    }
    return <>
        <style jsx>{`
            div {
                display: flex;
            }
        `}</style>
        <div>{out}</div>
    </>
}

export const GridItem: React.FC<StoreItem> = props => {
    let [curImg, setCurImg] = useState(props.previews[0])
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)

    let nameRef = useRef<HTMLSpanElement>(null)
    let { height: nameHeight } = useBounds(nameRef, { height: 0, width: 0 })
    let contentRef = useRef<HTMLDivElement>(null)
    let { height: contentHeight, width: contentWidth } = useBounds(contentRef, { height: 0, width: 0 })
    let infoRef = useRef<HTMLDivElement>(null)
    let { height: infoHeight } = useBounds(infoRef, { height: 0, width: 0 })
    let scrollRef = useRef<HTMLDivElement>(null)
    let hovered = useHover(scrollRef)

    useEffect(() => {
        let scroll = scrollRef.current
        if (!hovered && scroll) {
            scrollTo(scroll, 0, 0, 800, easeInSine)
        }
    }, [hovered])

    let expandedHeight = contentHeight > infoHeight ? contentHeight - infoHeight : 0
    let [name1, name2] = splitName(props.name)

    return <>
        <style jsx>{`
            .container {
                /* overflow: hidden; */
                width: calc(100% - 20px);
                height: calc(100% - 20px);
                position: relative;
                background-image: url("${curImg}");
                ${props.outOfStock ? "filter: saturate(50%);" : ""}
                background-size: cover;
                background-position: center center;
                margin: 10px;
                border-radius: 10px;
                box-shadow: ${theme.shadowColor} 3px 3px 20px 3px;
                overflow: hidden;
            }
            .scroll {
                height: 100%;
                overflow: scroll;
                transition: transform 0.4s 0s ease-in-out;
                transform: translateY(${contentHeight - nameHeight}px);
            }
            .info {
                padding: 10px 20px;
            }
            .container:hover>.scroll {
                transform: translateY(${expandedHeight}px);
            }
            .spacer {
                margin-top: ${nameHeight}px;
            }
            .title {
                padding-bottom: 25px;
                display: block;
                color: ${theme.alternateTextColor};
                font-family: ${look.strongFont};
                line-height: ${look.stringLineHeight * 100}%;
                font-size: ${(contentWidth > 350) ? look.extraLarge : (look.largeSize + look.extraLarge) /2 }px;
            }
            .desc {
                /* font-family: ${look.font} */
                font-size: ${look.smallSize}px;
            }
            .price {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                font-size: ${look.mediumSize}px;
                width: 100%;
            }
            .price>span {
                margin: 10px;
            }
            .prev {
                text-decoration: line-through;
                color: ${theme.subtextColor};
            }
            button {
                appearance: none;
                position: relative;
                height: 2em;
                border: none;
                background: none;
                color: ${theme.alternateTextColor};
                display: flex;
                align-items: center;
                font-family: ${look.font};
                font-size: ${look.mediumSize}px;
                border: solid 4px #970097;
                border-radius: 1em;
                padding: 0 20px;
                flex-shrink: 0;
                flex-wrap: wrap;
                font-weight: ${look.boldWeight};
            }
            button::before {
                z-index: -1;
                width: 100%;
                height: 100%;
                border-radius: 1em;
                background-color: #970097;
                content: "";
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
                transition: opacity 0.2s 0s ease-in;
            }
            button::after {
                content: "";
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 1em;
                position: absolute;
                top: -4px;
                left: -4px;
                border: 4px solid white;
                opacity: 0;
                /*transition: opacity 0.1s 0s ease-in;*/
            }
            button:active::after {
                /*opacity: 1;*/
            }
            button:active::before {
                background-color: purple;
            }
            button:hover::before {
                opacity: 1;
            }
            .bottom {
                margin: 10px 0;
            }
        `}</style>
        <div className="container" ref={contentRef}>
            <div className="scroll" ref={scrollRef}>
                <div className="info" ref={infoRef}>
                    <span className="title" ref={nameRef}>{name1}<br />{name2}</span>
                    <span className="desc">{props.descripton}</span>
                    <div className="bottom">
                        <StarRating rating={props.rating} />
                        <div className="price">
                            {props.prevPrice && <span className="prev">{props.prevPrice}</span>}
                            <span className="cur">{props.price}</span>
                            {props.outOfStock ? "Out of stock" : <button>Add to cart</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}