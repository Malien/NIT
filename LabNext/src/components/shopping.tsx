import React, { useState, useRef, useEffect, useContext } from "react"
import { StoreItem } from "../shared/components"
import { useCancel } from "./hooks"
import { ThemeContext, LookContext } from "./style"
import { ThumbList, VSpaced } from "./layout"
import { defaultImage } from "./common"

interface ShoppingCartProps {
    items: { item: StoreItem, count: number }[]
}
export const ShoppingCart: React.FC<ShoppingCartProps> = props => {
    let [shown, setShown] = useState(false)
    let ref = useRef<HTMLDivElement>(null)

    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)

    useCancel(ref, () => {
        if (shown) setShown(false)
    }, [shown])
    useEffect(() => {
        let el = ref.current
        const func = () => {
            if (!shown) setShown(true)
        }
        if (el) {
            el.addEventListener("click", func)
        }
        return () => {
            if (el) el.removeEventListener("click", func)
        }
    })

    let items = props.items.map(({ item, count }, index) => <ShoppingCartItem key={index} count={count} {...item} />)

    return <>
        <style jsx>{`
            .container {
                width: 300px;
                height: 500px;
                margin: 2%;
                position: fixed;
                bottom: 0;
                right: 0;
                border-radius: 20px;
                overflow-y: auto;
                background-color: ${theme.headerColor};
                box-shadow: ${theme.shadowColor} 3px 3px 20px 3px;
                z-index: 20;
                /* Yeah, I know I shouldn't animate width and height for performance reasons, yet still */
                transition: width 0.2s 0s ease-in, 
                            height 0.2s 0s ease-in,
                            border 0.2s 0s ease-in;
            }
            .container.hidden {
                width: 80px;
                height: 80px;
                border-radius: 40px;
            }
            img {
                filter: invert();
                width: 40px;
                height: 40px;
                position: absolute;
                top: 20px;
                left: 20px;
            }
            .title {
                margin: 10px;
                margin-left: 80px;
                line-height: 80px;
                font-family: ${look.font};
                font-size: ${look.mediumSize}px;
                color: ${theme.alternateTextColor};
            }
            .divider {
                width: 100%;
                height: 1px;
                background-color: ${theme.alternateTextSubcolor};
            }
            header {
                background-color: ${theme.headerColor};
                width: 100%;
            }
            .items {
                display: flex;
                justify-content: center;
                flex-direction: column;
                width: 100%;
                height: 419px;
                overflow-y: scroll;
                background-color: ${theme.backgroundColor};
            }
            button {
                right: 0;
                bottom: 0;
                appearance: none;
                margin: 20px;
                font-family: ${look.font};
                font-size: ${look.smallSize}px;
                padding: 10px 20px;
                border-radius: calc((20px + 1em) / 2);
                border: none;
                box-shadow: ${theme.shadowColor} 3px 3px 20px 3px;
                background-color: ${theme.alternativeColor};
                color: ${theme.alternateTextColor};
            }
            button:active {
                background-color: ${theme.alternativeSubcolor};
            }
            .spacer {
                margin: ${look.smallSize + 60}px;
            }
            .noitems {
                margin-top: 40px;
                color: ${theme.textColor};
                font-family: ${look.font};
                font-size: ${look.mediumSize}px;
            }
            .column.hidden {
                opacity: 0;
                transition: opacity 0s 0s ease-in;
            }
            .column {
                opacity: 1;
                transition: opacity 0.2s 0.1s ease-in;
            }
        `}</style>
        <div ref={ref} className={"container" + ((shown) ? "" : " hidden")}>
            <img alt="Shopping cart" src="static/SVG/cart.svg" />
            {/* {shown && <div className="column">
                <span className="title">Shopping cart</span>
                <div className="divider" />
                <div className="items">
                    {items.length == 0 
                        ? <span className="noitems">No items in the cart</span>
                        : <ThumbList columns={4} thumbSize="40px">
                            {items}
                        </ThumbList>}
                    <div className="spacer" />
                </div>
                <button>Proceed to checkout</button>
            </div>} */}
            <div className={"column" + ((shown) ? "" : " hidden")}>
                <span className="title">Shopping cart</span>
                <div className="divider" />
                <div className="items">
                    {items.length == 0
                        ? <span className="noitems">No items in the cart</span>
                        : <ThumbList notop columns={4} thumbSize="80px">
                            {items}
                        </ThumbList>}
                    <VSpaced style={{ bottom: 0, right: 0 }}>
                        <button>Proceed to checkout</button>
                    </VSpaced>
                </div>
            </div>
        </div>
    </>
}

interface ShoppingCartItemProps extends StoreItem {
    count: number;
}
export const ShoppingCartItem: React.FC<ShoppingCartItemProps> = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)
    return <>
        <style jsx>{`
            img {
                grid-column: 1;
                width: 60px;
                height: 60px;
                margin: 10px;
                border-radius: 5px;
                align-self: center;
            }
            span {
                grid-column: 2;
                color: ${theme.textColor};
                font-family: ${look.font};
                font-size: ${look.smallSize}px;
                padding: 10px;
                align-self: center;
            }
            input {
                grid-column: 3;
                appearance: none;
                border: none;
                background-color: ${theme.footerColor};
                height: 1em;
                padding: 10px;
                width: 30px;
                -moz-appearance: textfield;
                margin: 0; 
                color: ${theme.textColor};
                font-family: ${look.font};
                font-size: ${look.smallSize}px;
                border-radius: 5px;
                align-self: center;
            }
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button { 
                -webkit-appearance: none;
                margin: 0; 
            }
            div {
                grid-column: 4;
                width: 35px;
                height: 35px;
                background-color: #d13939;
                border-radius: 17.5px;
                align-self: center;
                margin: 10px;
                position: relative;
            }
            div::before {
                width: 20px;
                height: 4px;
                border-radius: 2px;
                background-color: white;
                position: absolute;
                content: "";
                display: block;
                transform: translate(7.5px, 16px) rotate(45deg);
            }
            div::after {
                width: 20px;
                height: 4px;
                border-radius: 2px;
                background-color: white;
                position: absolute;
                content: "";
                display: block;
                transform: translate(7.5px, 16px) rotate(-45deg);
            }
        `}</style>
        <img alt={props.name + " image"} src={(props.previews[0]) ? props.previews[0] : defaultImage} />
        <span>{props.name}</span>
        <input type="number" value={props.count} />
        <div />
    </>
}