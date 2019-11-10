import React, { createContext, FC, Reducer, useContext, useEffect, useReducer, useRef, useState } from "react"
import { StoreItem } from "../shared/components"
import { toCountNumber } from "../util/numbers"
import { defaultImage } from "./common"
import { useClick, useKeyDown } from "./hooks"
import { ThumbList, VSpaced } from "./layout"
import { LookContext, ThemeContext } from "./style"

export const SHOPPING_CART_VERSION = 1

export const ShoppingCartContext = createContext<React.Dispatch<SCAction> | null>(null)

export const SCReducer: Reducer<SCProps, SCAction> = (state, action) => {
    const getIndex = () => {
        let index = (typeof action.id == "number") ? action.id : state.items.findIndex(item => item.id === action.id)
        if (index == -1) {
            if (action.fallbackItem) {
                index = state.items.length
                state.items.push({ ...action.fallbackItem, count: 0 })
            } else {
                console.warn("Tried to change count of non-existant item in shopping cart, and not provided fallback item. Skipping state update")
            }
        }
        return index
    }

    switch (action.type) {
        case SCActionType.set:
            state.items[getIndex()].count = (action.count) ? action.count : 0
            return { ...state, items: state.items }
        case SCActionType.add:
            state.items[getIndex()].count += (action.count) ? action.count : 0
            return { ...state, items: state.items }
        case SCActionType.submit:
            if (typeof action.count !== "undefined") {
                state.items[getIndex()].count = action.count
            }
            return { ...state, items: state.items.filter(item => item.count > 0) }
        case SCActionType.reset:
            if (action.resetState) return { ...state, items: action.resetState }
            else {
                console.warn("Tried to reset state, but `resetState` parameter was not provided. Skipping state update")
                return state
            }
        case SCActionType.toggle:
            return { ...state, shown: !state.shown }
    }
}

export enum SCActionType {
    add, set, submit, reset, toggle
}
export interface SCAction {
    type: SCActionType;
    id?: number | string;
    count?: number;
    fallbackItem?: StoreItem;
    resetState?: SCItem[];
}
export interface SCItem extends StoreItem {
    count: number;
}
export interface SCProps {
    items: SCItem[];
    shown: boolean;
}
export const ShoppingCart: React.FC<SCProps> = props => {
    let ref = useRef<HTMLDivElement>(null)
    let dimmerRef = useRef<HTMLDivElement>(null)

    let dispatch = useContext(ShoppingCartContext)
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)

    useClick(dimmerRef, () => {
        if (props.shown && dispatch) dispatch({ type: SCActionType.toggle })
    }, [props.shown])
    useKeyDown((e) => {
        if (props.shown && e.key == "Escape" && dispatch) dispatch({ type: SCActionType.toggle })
    }, [props.shown])
    useClick(ref, () => {
        if (!props.shown && dispatch) dispatch({ type: SCActionType.toggle })
    }, [props.shown])

    let surfaced = props.items.length != 0 || props.shown
    let totalCost = props.items.reduce((sum, item) => sum + item.count * item.price, 0)
    let buyable = props.items.length != 0 && !props.items.reduce((acc, now) => acc || now.outOfStock, false) && totalCost != 0
    let titems = Object.values(props.items).map((item, index) =>
        <ShoppingCartItem
            key={index}
            count={item.count}
            onChange={count => {
                if (dispatch) dispatch({ id: index, count, type: SCActionType.set })
            }}
            onSubmit={count => {
                if (dispatch) dispatch({ id: index, count, type: SCActionType.submit })
            }}
            {...item}
        />)

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
                background-color: ${theme.headerColor};
                box-shadow: ${theme.shadowColor} 3px 3px 20px 3px;
                z-index: 40;
                overflow: hidden;
                transform: translateY(calc(80px + 5vh));
                /* Yeah, I know I shouldn't animate width and height for performance reasons, yet still */
                transition: width 0.2s 0s ease-in, 
                            height 0.2s 0s ease-in,
                            border 0.2s 0s ease-in,
                            transform 0.4s 1s cubic-bezier(0,0,.26,1.55);
            }
            .container.hidden {
                width: 80px;
                height: 80px;
                border-radius: 40px;
            }
            .container.surfaced {
                transform: translateY(0);
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
            .items {
                width: 100%;
                height: 419px;
                overflow-y: scroll;
                background-color: ${theme.backgroundColor};
            }
            button {
                outline: 0;
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
            button:disabled {
                background-color: ${theme.disabledColor};
            }
            .spacer {
                margin: ${look.smallSize + 60}px;
            }
            .noitems {
                margin-top: 40px;
                color: ${theme.textColor};
                font-family: ${look.font};
                font-size: ${look.mediumSize}px;
                width: 100%;
                text-align: center;
            }
            .column.hidden {
                opacity: 0;
                transition: opacity 0s 0s ease-in;
            }
            .column {
                opacity: 1;
                transition: opacity 0.2s 0.1s ease-in;
            }
            .header-spacer {
                margin-top: 0px;
            }
            .total {
                font-family: ${look.font};
                font-size: ${look.mediumSize}px;
                color: ${theme.textSubcolor};
                width: 100%;
                margin: 20px 0;
                text-align: center;
            }
            .total.disabled {
                color: ${theme.disabledColor};
            }
            .dimmer {
                position: fixed;
                width: 100vw;
                height: 100vh;
                background-color: ${theme.dimmingColor};
                opacity: 1;
                top: 0;
                left: 0;
                transition: opacity 0.2s 0s ease-in;
                z-index: 30;
            }
            .dimmer.hidden {
                opacity: 0;
                pointer-events: none;
            }
        `}</style>
        <div ref={dimmerRef} className={"dimmer" + (props.shown ? "" : " hidden")} />
        <div ref={ref} className={"container" + ((props.shown) ? "" : " hidden") + ((surfaced) ? " surfaced" : "")}>
            <img alt="Shopping cart" src="static/assets/SVG/cart.svg" />
            <div className={"column" + ((props.shown) ? "" : " hidden")}>
                <span className="title">Shopping cart</span>
                <div className="divider" />
                <div className="items">
                    <div className="header-spacer" />
                    {titems.length == 0
                        ? <div className="noitems">No items in the cart</div>
                        : <>
                            <ThumbList notop columns={4} thumbSize="80px">
                                {titems}
                            </ThumbList>
                            <div className={"total" + (buyable ? "" : " disabled")}>Total: ${totalCost.toFixed(2)}</div>
                            <VSpaced style={{ bottom: 0, right: 0 }}>
                                <button disabled={!buyable}>Proceed to checkout</button>
                            </VSpaced>
                        </>
                    }
                </div>
            </div>
        </div>
    </>
}

interface ShoppingCartItemProps extends StoreItem {
    count: number;
    onChange: (val: number) => void;
    onSubmit: (val?: number) => void;
}
export const ShoppingCartItem: React.FC<ShoppingCartItemProps> = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)
    let [selected, setSelected] = useState(false)


    useEffect(() => {
        if (selected) {
            const f = (event: KeyboardEvent) => {
                if (event.key == "Enter") props.onSubmit()
            }
            document.addEventListener("keypress", f)
            return () => document.removeEventListener("keypress", f)
        }
    }, [selected])

    return <>
        <style jsx>{`
            img {
                grid-column: 1;
                width: 60px;
                height: 60px;
                object-fit: contain;
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
                background-color: ${theme.subbackgroundColor};
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
        `}</style>
        <img alt={props.name + " image"} src={(props.previews[0]) ? props.previews[0] : defaultImage} />
        <span>{props.name}</span>
        <input
            min={0}
            type="number"
            value={String(props.count)}
            onBlur={() => {
                setSelected(false)
                props.onSubmit()
            }}
            onChange={(event) => props.onChange(toCountNumber(event.target.value))}
            onFocus={() => {
                setSelected(true)
            }}
        />
        <CancelButton onClick={() => {
            props.onSubmit(0)
        }} />
    </>
}

interface CancelButtonProps {
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const CancelButton: FC<CancelButtonProps> = props => {
    let theme = useContext(ThemeContext)
    return <>
        <style jsx>{`
        button {
            outline: 0;
            text-align: start;
            appearance: none;
            border: none;
            display: block;
            padding: 0;
            grid-column: 4;
            width: 35px;
            height: 35px;
            border-radius: 17.5px;
            align-self: center;
            margin: 10px;
            position: relative;
            background-color: #dd4242;
        }
        button::before {
            opacity: 0;
            background-color: #c73434;
            border-radius: 50%;
            width: 100%;
            height: 100%;
            content: "";
            display: block;
            transition: opacity 0.1s 0s ease-in;
        }
        button:active::before {
            opacity: 1;
        }
        button::after {
            position: absolute;
            top:0;
            border-radius: 50%;
            opacity: 0;
            width: 100%;
            height: 100%;
            content: "";
            display: block;
            box-shadow: ${theme.shadowColor} 0px 0px 10px 3px;
            transition: opacity 0.2s 0s ease-in;
        }
        button:hover::after {
            opacity: 1;
        }
        .arrow {
            pointer-events: none;
            width: 20px;
            height: 4px;
            top: 0;
            border-radius: 2px;
            background-color: white;
            position: absolute;
        }
        .left {
            transform: translate(7.5px, 16px) rotate(45deg);
        }
        .right {
            transform: translate(7.5px, 16px) rotate(-45deg);
        }
        `}</style>
        <button onClick={props.onClick}>
            <div className="arrow left" />
            <div className="arrow right" />
        </button>
    </>
}

export function useShoppingCart(): [SCProps, React.Dispatch<SCAction>] {
    let [shoppingCartItems, dispatch] = useReducer(SCReducer, { shown: false, items: [] })

    useEffect(() => {
        let version = localStorage.getItem("cart_version")
        if (!version || !(version == SHOPPING_CART_VERSION as any)) {
            localStorage.setItem("cart", JSON.stringify({ items: [] }))
            localStorage.setItem("cart_version", String(SHOPPING_CART_VERSION))
        } else {
            let cart = localStorage.getItem("cart")
            try {
                if (cart) dispatch({ type: SCActionType.reset, resetState: JSON.parse(cart) })
            } catch (e) {
                console.error(e)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(shoppingCartItems.items))
    }, [shoppingCartItems])

    return [shoppingCartItems, dispatch]
}