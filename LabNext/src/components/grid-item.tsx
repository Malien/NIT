import React, { useState, useRef, useEffect, useContext } from "react"
import { StoreItem } from "../shared/components"
import { useResize, useBounds } from "./hooks"
import { ThemeContext, LookContext } from "./style"

function splitName(name: string): [string, string] {
    let words = name.split(" ")
    let pivot = Math.floor(words.length / 2)
    const charCount = (words: string[]) => words.map(w => w.length).reduce((prev, cur) => prev + cur)
    while(charCount(words.slice(0, pivot)) > charCount(words.slice(pivot))) {
        if (pivot == 1) return [words.slice(0, pivot).join(), words.slice(pivot).join()]
        pivot--
    }
    return [words.slice(0, pivot).join(), words.slice(pivot).join(" ")]
}

interface StarRatingProps {
    rating: number;
}
export const StarRating: React.FC<StarRatingProps> = props => <></>

export const GridItem: React.FC<StoreItem> = props => {
    let [curImg, setCurImg] = useState(props.previews[0])
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)

    let nameRef = useRef<HTMLSpanElement>(null)
    let {height: nameHeight} = useBounds(nameRef, {height: 0, width: 0})
    let contentRef = useRef<HTMLDivElement>(null)
    let {height: contentHeight} = useBounds(contentRef, {height: 0, width: 0})
    let infoRef = useRef<HTMLDivElement>(null)
    let {height: infoHeight} = useBounds(infoRef, {height: 0, width: 0})

    let expandedHeight = contentHeight > infoHeight ? contentHeight - infoHeight : 0
    let [name1, name2] = splitName(props.name)

    return <>
        <style jsx>{`
            .container {
                /* overflow: hidden; */
                width: 100%;
                height: 100%;
                position: relative;
                background-image: url("${curImg}");
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
                line-height: ${look.stringLineHeight*100}%;
                font-size: ${look.extraLarge}px;
            }
        `}</style>
        <div className="container" ref={contentRef}>
            {/* <div className="spacer" /> */}
            <div className="scroll">
                <div className="info" ref={infoRef}>
                    <span className="title" ref={nameRef}>{name1}<br />{name2}</span>
                    <span className="desc">{props.descripton}</span>
                    <div className="bottom">
                        <StarRating rating={props.rating} />
                        <div className="price">
                            {props.prevPrice && <span className="prev">{props.prevPrice}</span>}
                            <span className="cur">{props.price}</span>
                        </div>
                        <button>Buy</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}