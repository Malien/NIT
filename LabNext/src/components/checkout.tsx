import { useContext, useState, useRef } from "react";
import { ThemeContext, LookContext } from "./style";
import { SCItem, SCItemList, ShoppingCartContext, SCActionType } from "./shopping";
import { classes } from "./util";
import { useMounted, useCancel, useInputState } from "./hooks";
import { submitPurchase } from "../api/tron";
import { fromEntries } from "../util/pollyfilling";
import { StdErrContext } from "./errors";
import { BuyButton } from "./grid-item";

interface CheckoutPaneProps {
    cart: SCItem[];
    onDismiss?: () => void;
    email?: string;
    name?: string;
    phone?: string;
}
export const CheckoutPane: React.FC<CheckoutPaneProps> = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)
    let dispatch = useContext(ShoppingCartContext)
    let stderr = useContext(StdErrContext)
    let mounted = useMounted()
    let [dismissed, setDismissed] = useState(false)
    let [email, setEmail] = useInputState({value: props.email, pattern: ".+@\\w+\\.\\w+"})
    let [name, setName] = useInputState({value: props.name})
    let [phone, setPhone] = useInputState({value: props.phone, pattern: "\\+380\\d{9}"})
    let formRef = useRef<HTMLFormElement>(null)
    let dimmerRef = useRef<HTMLDivElement>(null)
    useCancel(dimmerRef, () => {
        setDismissed(true)
        setTimeout(() => {
            if (props.onDismiss) props.onDismiss()
        }, 200)
    }, [])
    
    let total = props.cart.reduce((acc, cur) => acc + cur.price * cur.count, 0)
    let buyable = props.cart.length != 0 && total != 0;
    return <>
        <style jsx>{`
            .dimmer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: ${theme.dimmingColor};
                opacity: 1;
                z-index: 45;
                transition: opacity 0.2s ease-in;
            }
            .dimmer.hidden {
                opacity: 0;
            }
            .padded {
                position: fixed;
                top: 0;
                left: 0;
                width: calc(100vw - 80px);
                height: calc(100vh - 80px);
                opacity: 1;
                z-index: 50;
                transition: opacity 0.2s ease-in;
                padding: 40px;
                display: flex;
                align-items: center;
                pointer-events: none;
            }
            .padded.hidden {
                opacity: 0;
            }
            .padded.hidden>.container {
                transform: translateY(-100%);
            }
            .container {
                pointer-events: all;
                max-width: 800px;
                margin: auto;
                padding: 20px;
                background-color: ${theme.backgroundColor};
                transform: translateY(0);
                transition: transform 0.2s ease-in;
                display: grid;
                grid-template-columns: auto auto 200px;
                border-radius: 20px;
                box-shadow: ${theme.shadowColor} 2px 2px 10px 3px;
            }
            .divider {
                height: 90%;
                margin: 5% 10px;
                width: 1px;
                background-color: ${theme.subbackgroundColor}
            }
            .actions {
                position: relative;
            }
            input {
                grid-column: 3;
                appearance: none;
                background-color: ${theme.subbackgroundColor};
                height: 1em;
                padding: 10px;
                width: calc(100% - 40px);
                -moz-appearance: textfield;
                margin: 10px; 
                color: ${theme.textColor};
                font-family: ${look.font};
                font-size: ${look.smallSize}px;
                border-radius: 5px;
                align-self: center;
                border: solid 2px #ff000000;
                transition: border 0.2s ease-in;
            }
            input.invalid {
                border: solid 2px red;
            }
            input::after {
                content: "";
                display: block;
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
                border: solid 2px red;
                transition: border 0.2s ease-in;
            }
            input.invalid::after {
                opacity: 1;
            }
            button {
                outline: 0;
                appearance: none;
                position: relative;
                height: 2em;
                border: none;
                background: none;
                color: ${theme.alternativeColor};
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: ${look.font};
                font-size: ${look.mediumSize}px;
                border: solid 4px ${theme.alternativeColor};
                border-radius: 1em;
                padding: 0 20px;
                flex-shrink: 0;
                flex-wrap: wrap;
                font-weight: ${look.boldWeight};
                transition: color 0.2s ease-in;
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
            button:hover {
                color: ${theme.alternateTextColor};
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
            form {
                display: flex;
                align-items: center;
                flex-direction: column;
            }
        `}</style>
        <div className={classes({dimmer: true, hidden: !mounted || dismissed})} ref={dimmerRef} />
        <div className={classes({padded: true, hidden: !mounted || dismissed})} >
            <div className="container">
                {props.cart.length == 0 
                    ? <div className="noitems">No items in the cart</div>
                    : <div className="list">
                        <SCItemList items={props.cart} total={total}/>
                    </div>
                }
                <div className="divider" />
                <div className="actions">
                    <form autoComplete="on" ref={formRef}>
                        <input 
                            type="text" 
                            name="name" 
                            value={name.value} 
                            placeholder="Full name"
                            onChange={(event) => {
                                setName(event.target.value)
                            }}
                        />
                        <input 
                            type="email" 
                            name="email" 
                            value={email.value} 
                            placeholder="E-mail" 
                            pattern=".+@\w+\.\w+" 
                            className={classes({invalid: !email.valid})}
                            onChange={(event) => {
                                setEmail(event.target.value)
                            }}
                        />
                        <input 
                            type="text"
                            name="phone" 
                            value={phone.value}
                            placeholder="Phone number"
                            pattern="\+380\d{9}" 
                            autoComplete="tel" 
                            className={classes({invalid: !phone.valid})}
                            onChange={(event) => {
                                setPhone(event.target.value)
                            }}
                        />
                        <button disabled={!buyable} onClick={(e) => {
                            e.preventDefault()
                            let form = formRef.current
                            if (form) {
                                let valid = form.checkValidity()
                                if (valid) {
                                    let products = fromEntries(props.cart.map(item => ([item.id, item.count])))
                                    submitPurchase({name: name.value, email: email.value, phone: phone.value, products})
                                        .then(v => v.json())
                                        .then(v => {
                                            console.log(v)
                                            return v
                                        })
                                        .then(v => {
                                            if (stderr) stderr(v.status === "error" 
                                                ? "Error occured while processing your request" 
                                                : `Succesfully purcahsed ${props.cart.reduce((acc, cur) => acc + cur.count, 0)} products`)
                                            if (v.status !== "error" && dispatch) {
                                                dispatch({type: SCActionType.reset, resetState: []})
                                                setDismissed(true)
                                                setTimeout(() => {
                                                    if (props.onDismiss) props.onDismiss()
                                                }, 200)
                                            }
                                        })
                                }
                            }
                        }}>Checkout</button>
                    </form>
                </div>
            </div>
        </div> 
    </>
}