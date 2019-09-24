import React, { useState, useRef, useEffect } from "react"
import { StoreItem } from "../shared/components"
import { useResize, useBounds } from "./hooks"

function splitName(name: string): [string, string] {
    let words = name.split(" ")
    let pivot = Math.floor(words.length / 2)
    const charCount = (words: string[]) => words.map(w => w.length).reduce((prev, cur) => prev + cur)
    while(charCount(words.slice(0, pivot)) > charCount(words.slice(pivot))) {
        if (pivot == 1) return [words.slice(0, pivot).join(), words.slice(pivot).join()]
        pivot--
    }
    return [words.slice(0, pivot).join(), words.slice(pivot).join()]
}

interface StarRatingProps {
    rating: number;
}
export const StarRating: React.FC<StarRatingProps> = props => <></>

export const GridItem: React.FC<StoreItem> = props => {
    let [curImg, setCurImg] = useState(props.previews[0])
    let nameRef = useRef<HTMLSpanElement>(null)
    let {height: nameHeight} = useBounds(nameRef, {height: 0, width: 0})

    let name = splitName(props.name).join("\n")
    return <>
        <style jsx>{`
            .container {
                /* overflow: hidden; */
                width: 100%;
                height: 100%;
                background-image: url("${curImg}");
                background-size: cover;
                background-position: center center;
            }
            .spacer {
                margin-top: ${nameHeight}px;
            }
        `}</style>
        <div className="container">
            <div className="spacer" />
            <div className="info">
                <span className="title" ref={nameRef}>{name}</span>
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
    </>
}