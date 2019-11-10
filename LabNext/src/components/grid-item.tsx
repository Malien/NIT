import React, { useContext, useEffect, useRef, useState } from "react"
import { StoreItem } from "../shared/components"
import { easeInSine, scrollTo } from "./animate"
import { useBounds, useHover } from "./hooks"
import { LookContext, ThemeContext } from "./style"
import { classes } from "./util"

function splitName(name: string): [string, string] {
    let words = name.split(" ")
    if (words.length < 2) return ["", name]
    let pivot = Math.floor(words.length / 2)
    const charCount = (words: string[]) => words.map(w => w.length).reduce((prev, cur) => prev + cur)
    while (charCount(words.slice(0, pivot)) > charCount(words.slice(pivot))) {
        if (pivot == 1) return [words.slice(0, pivot).join(" "), words.slice(pivot).join(" ")]
        pivot--
    }
    return [words.slice(0, pivot).join(" "), words.slice(pivot).join(" ")]
}

const MAX_RATING = 5
interface StarRatingProps {
    rating: number;
}
export const StarRating: React.FC<StarRatingProps> = props => {
    let out: JSX.Element[] = []
    let i
    for (i=0; i<props.rating; ++i) {
        out.push(<div key={i} style={{
            width: "20px",
            height: "20px",
            borderRadius: "5px",
            margin: "5px",
            backgroundColor: "yellow"
        }} />)
    }
    for (;i<MAX_RATING; ++i) {
        out.push(<div key={i} style={{
            width: "20px",
            height: "20px",
            borderRadius: "5px",
            margin: "5px",
            backgroundColor: "gray"
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

interface GridItemProps extends StoreItem {
    onBuy?: () => void;
}
interface GridItemElements {
    name?: HTMLSpanElement;
    info?: HTMLDivElement;
    scroll?: HTMLDivElement;
}

export const GridItem: React.FC<GridItemProps> = props => {
    // let [curImg, setCurImg] = useState(props.previews[0])
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)

    let contentRef = useRef<HTMLDivElement>(null)
    let { height: contentHeight, width: contentWidth } = useBounds(contentRef, { height: 0, width: 0 })
    let nameRef = useRef<HTMLDivElement>(null)
    let infoRef = useRef<HTMLDivElement>(null)
    let scrollRef = useRef<HTMLDivElement>(null)
    
    let [inited, setInited] = useState(false)
    let hovered = useHover(scrollRef)

    useEffect(() => {
        let content = contentRef.current
        if (content) {
            const func = () => setInited(true)
            content.addEventListener("mouseenter", func)
            return () => {
                if (content) content.removeEventListener("mouseenter", func)
            }
        }
    }, [])

    useEffect(() => {
        let scroll = scrollRef.current
        if (!hovered && scroll) {
            scrollTo(scroll, 0, 0, 800, easeInSine)
        }
    }, [hovered, scroll])

    let name = nameRef.current
    let info = infoRef.current
    let nameHeight = name ? name.offsetHeight : 0
    let infoHeight = info ? info.offsetHeight : 0

    let expandedHeight = contentHeight > infoHeight ? contentHeight - infoHeight : 0
    let [name1, name2] = splitName(props.name)

    return <>
        <style jsx>{`
            .container {
                /* overflow: hidden; */
                width: calc(100% - 20px);
                height: calc(100% - 20px);
                position: relative;
                /*background-image: url("${props.previews[0]}");*/
                background-size: cover;
                background-position: center center;
                margin: 10px;
                border-radius: 10px;
                box-shadow: ${theme.shadowColor} 3px 3px 20px 3px;
                overflow: hidden;
            }
            img {
                ${props.outOfStock ? "filter: saturate(35%);" : ""}
                /* ${contentHeight > contentWidth ? "height" : "width"}: 100%; */
                object-fit: cover;
                width: 100%;
                height: 100%;
                padding-bottom: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
            .scroll {
                height: 100%;
                overflow-y: ${hovered ? "scroll" : "hidden"};
                transform: translateY(${contentHeight - nameHeight}px);
            }
            .scroll:hover {
                transition: transform 0.4s 0s ease-in-out;
            }
            .scroll.animated  {
                transition: transform 0.4s 0s ease-in-out;
            }
            .info {
                padding: 10px 20px;
            }
            .container:hover>.scroll {
                transform: translateY(${expandedHeight}px);
                transition: transform 0.4s 0s ease-in-out;
            }
            .spacer {
                margin-top: ${nameHeight}px;
            }
            .title {
                padding-bottom: 25px;
                display: block;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 100%;
                color: ${theme.alternateTextColor};
                font-family: ${look.strongFont};
                line-height: ${look.strongLineHeight * 100}%;
                font-size: ${(contentWidth > 350) ? look.extraLarge : (look.largeSize + look.extraLarge) /2 }px;
                text-shadow: 0px 0px 5px #000000aa;
            }
            .desc {
                /* font-family: ${look.font} */
                font-size: ${look.smallSize}px;
                /*color: ${theme.textSubcolor};*/
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
                color: ${theme.textSubcolor};
            }
            button {
                outline: 0;
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
                border: solid 4px ${theme.alternativeColor};
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
                background-color: ${theme.alternativeColor};
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
                background-color: ${theme.alternativeSubcolor};
            }
            button:hover::before {
                opacity: 1;
            }
            button:disabled {
                border: none;
            }
            button:disabled::before {
                background-color: ${theme.disabledColor};
                opacity: 1;
            }
            .bottom {
                margin: 10px 0;
            }
            .nostock {
                margin: 10px;
            }
            .dimmer {
                width: 100%;
                height: 100%;
                position: absolute;
                background-color: ${theme.alternateTextSubcolor};
                transition: all 0.2s ease-in;
                opacity: 0.3;
            }
            .dimmer.active {
                opacity: 0.8;
            }
        `}</style>
        <div className="container" ref={contentRef}>
            <img src={props.previews[0]} alt="Product image" />
            <div className={classes({"dimmer": true, "active": hovered})}/>
            <div className={classes({"scroll": true, "animated": inited})} ref={scrollRef}>
                <div className="info" ref={infoRef}>
                    <div className="title" ref={nameRef}>{name1}<br/>{name2}</div>
                    <span className="desc">{props.description}</span>
                    <div className="bottom">
                        <StarRating rating={props.rating} />
                        <div className="price">
                            {props.prevPrice && <span className="prev">${props.prevPrice}</span>}
                            <span className="cur">${props.price}</span>
                            <button disabled={props.outOfStock} onClick={props.onBuy}>{props.outOfStock ? "Out of stock" : "Add to cart"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export const PlaceholderItem: React.FC = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)
    
    return <>
        <style jsx>{`
            .container {
                width: calc(100% - 20px);
                height: calc(100% - 20px);
                position: relative;
                margin: 10px;
                border-radius: 10px;
                border: solid 4px ${theme.subbackgroundColor};
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
            }
            .title {
                height: ${look.largeSize}px;
                margin: 10px 20px;
                background-color: ${theme.subbackgroundColor};
                border-radius: ${look.largeSize / 2}px;
            }
            .title.a {
                width: 30%;
            }
            .title.b {
                width: 60%;
            }
        `}</style>
        <div className="container">
            <div className="title a" />
            <div className="title b" />
        </div>
    </>
}