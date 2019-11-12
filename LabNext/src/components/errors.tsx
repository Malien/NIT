import { useContext, useState, useEffect, createContext } from "react"
import { ThemeContext, LookContext } from "./style"

type MsgDispatch = (msg: string) => void

/**
 * Hook that setups user message dispatch
 * @returns Pair of message to be displayed and message dispatch function
 */
export function useMessageDispatch(): [string | undefined, MsgDispatch] {
    let q: string[] = []
    //FIXME: Queued up messages behave unintentionally
    let [current, setCurrent] = useState<string | undefined>()
    const rec = () => {
        if (q.length > 1) {
            setCurrent(q[1])
            q = q.slice(1)
            setTimeout(rec, 6500)
        } else {
            q = []
            setCurrent(undefined)
        }
    }
    const dis: MsgDispatch = (msg) => {
        if (q.length == 0) {
            setCurrent(msg)
            setTimeout(() => {
                rec()
            }, 6500)
        }
        q.push(msg)
    }

    return [current, dis]
}

// Ract context to show user message, triggered deep withing the app
export const StdErrContext = createContext<MsgDispatch | null>(null)

interface ErrorMsgProps {
    prominent?: boolean;
    msg?: string;
}
/**
 * Notification components used to notify user something of importance
 * @param props whether shouldn't dismiss after a while (broken with automatic dispatch) and message itself
 */
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

    return <>
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
            <div className={"container" + ((shown && props.msg) ? " shown" : "")}>
                <span>{props.msg}</span>
                <button className="cross" onClick={() => setShown(false)} />
            </div>
        </div>
    </>
}