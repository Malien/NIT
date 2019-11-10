import { useContext, useState, useEffect, createContext } from "react"
import { ThemeContext, LookContext } from "./style"

// export const ErrorMsgContext = createContext<React.Dispatch<string> | null>(null)

// export const ErrorMsgReducer: Reducer<string?, string> = (state, action) => {

// }

interface ErrorMsgProps {
    prominent?: boolean;
    msg?: string;
}
export const ErrorMsg: React.FC<ErrorMsgProps> = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)
    let [shown, setShown] = useState(false)

    useEffect(() => {
        if (!props.prominent && shown) {
            let handle = setTimeout(() => {
                setShown(false)
            }, 6000)
            return () => clearTimeout(handle)
        }
    }, [props.msg, shown])
    useEffect(() => {
        setTimeout(() => setShown(true), 500)
    }, [props.msg])

    return props.msg ? <>
        <style jsx>{`
            span {
                color: ${theme.textColor};
                font-family: ${look.font};
                font-size: ${look.smallSize}px;
            }
            .container {
                padding: 10px 20px;
                display: flex;
                background-color: ${theme.mobileHeaderColor};
                box-shadow: ${theme.shadowColor} 3px 3px 10px 3px;
                transition: transform 0.4s 0s ease-in;
                position: fixed;
                z-index: 30;
                top: 0;
                transform: translateY(-200%);
                border-radius: calc( ( 2em + 20px ) / 2);
                margin: 20px;
                align-items: center;
            }
            .container.shown {
                transform: translateY(0);
            }
            .cross {
                appearance: none;
                border: none;
                background-color: ${theme.mobileHeaderColor};
                padding: 0;
                width: 30px;
                height: 30px;
                /* padding: 10px; */
                position: relative;
                margin-left: 5px;
                margin-right: -5px;
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .cross:active {
                background-color: ${theme.subbackgroundColor};
            }
            .cross:hover::before {
                background-color: ${theme.textColor}
            }
            .cross:hover::after {
                background-color: ${theme.textColor}
            }
            .cross::before {
                content: "";
                display: block;
                position: absolute;
                width: 66%;
                height: 2px;
                border-radius: 1px;
                background-color: ${theme.textSubcolor};
                transform: rotate(45deg);
            }
            .cross::after {
                content: "";
                display: block;
                position: absolute;
                width: 66%;
                height: 2px;
                border-radius: 1px;
                background-color: ${theme.textSubcolor};
                transform: rotate(-45deg);
            }
            .center {
                width: 100vw;
                display: flex;
                justify-content: center;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 60;
            }
        `}</style>
        <div className="center">
            <div className={"container" + (shown ? " shown" : "")}>
                <span>{props.msg}</span>
                <button className="cross" onClick={() => setShown(false)} />
            </div>
        </div>
    </> : <></>
}