import { useErrData } from "../hooks"
import { useState, useContext } from "react"
import { PlacedOrder } from "../../shared/components"
import { AuthContext } from "../auth"
import { LookContext, ThemeContext } from "../style"
import { classes } from "../util"
import SQL from "sql-template-strings"

export const OrdersView: React.FC = () => {
    let { data, loading, err } = useErrData<PlacedOrder[]>("/api/orders")
    let [selected, setSelected] = useState<number | undefined>()
    let auth = useContext(AuthContext)
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)

    if (loading) return <div>Loading...</div>
    if (err) return <div>{JSON.stringify(err)}</div>
    if (!data) return <div>No data</div>
    if (!(auth && auth.token.tokenInfo && auth.token.accessToken && auth.token.tokenInfo.admin)) return <div>Not authorized</div>

    return <>
        <style jsx>{`
            .split {
                display: flex;
            }
            .left {
                width: 200px;
                border-right: solid 1px black;
                padding: 20px;
            }
            .right {
                margin: 40px;
                font-family: ${look.font};
                font-size: ${look.largeSize}px;
                color: ${theme.textSubcolor};
            }
            .order-item {
                font-family: ${look.font};
                font-size: ${look.mediumSize}px;
                padding: 5px 15px;
                margin: 5px;
                width: calc(100% - 50px);
                border-radius: 5px;
                transition: all 0.2s ease-in;
                margin-right: 20px;
                cursor: pointer;
            }
            .order-item.selected {
                background-color: ${theme.headerColor};
                color: ${theme.alternateTextColor};
            }
            .order-item.selected:hover {
                background-color: ${theme.headerColor};
            }
            .order-item:hover {
                background-color: ${theme.headerSubcolor};
                color: ${theme.alternateTextColor};
            }
            .order-id {
                display: inline-block;
                width: 20px;
                margin-right: 10px;
            }
        `}</style>
        <div className="split">
            <div className="left">
                {data.map((order, index) =>
                    <div key={order.id} className={classes({ "order-item": true, "selected": index == selected })} onClick={() => { setSelected(index) }}>
                        <span className="order-id">{order.id}</span>
                        <span className="order-name">{order.name}</span>
                    </div>
                )}
            </div>
            <div className="right">
                {typeof selected !== "undefined"
                    ? <OrderView {...data[selected]} onConfirm={() => {
                        fetch("/api/eval", {
                            method: "POST",
                            body: JSON.stringify(SQL`DELETE FROM ItemOrders WHERE orderID=${data![selected!].id}`),
                            headers: {
                                "Authorization": `Bearer ${auth!.token.accessToken}`
                            }
                        }).then(console.log).catch(console.error)
                        fetch("/api/eval", {
                            method: "POST",
                            body: JSON.stringify(SQL`DELETE FROM Orders WHERE id=${data![selected!].id}`),
                            headers: {
                                "Authorization": `Bearer ${auth!.token.accessToken}`
                            }
                        }).then(console.log).catch(console.error)
                    }} onReject={() => {
                        fetch("/api/eval", {
                            method: "POST",
                            body: JSON.stringify(
                                SQL`UPDATE Items 
                                SET stock = stock + (
                                    SELECT count FROM ItemOrders WHERE itemID = Items.id AND orderID = ${data![selected!].id}
                                ) 
                                WHERE id IN (
                                    SELECT itemID FROM ItemOrders WHERE orderID = ${data![selected!].id}
                                )`
                            ),
                            headers: {
                                "Authorization": `Bearer ${auth!.token.accessToken}`
                            }
                        }).then(console.log).catch(console.error)
                        fetch("/api/eval", {
                            method: "POST",
                            body: JSON.stringify(SQL`DELETE FROM ItemOrders WHERE orderID=${data![selected!].id}`),
                            headers: {
                                "Authorization": `Bearer ${auth!.token.accessToken}`
                            }
                        }).then(console.log).catch(console.error)
                        fetch("/api/eval", {
                            method: "POST",
                            body: JSON.stringify(SQL`DELETE FROM Orders WHERE id=${data![selected!].id}`),
                            headers: {
                                "Authorization": `Bearer ${auth!.token.accessToken}`
                            }
                        }).then(console.log).catch(console.error)
                    }} />
                    : "Order is not selected"}
            </div>
        </div>
    </>
}

export interface OrderViewProps extends PlacedOrder {
    onConfirm: () => void;
    onReject: () => void;
}
export const OrderView: React.FC<OrderViewProps> = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)

    return <>
        <style jsx>{`
            .order {
                font-family: ${look.font};
                font-size: ${look.mediumSize}px;
                color: ${theme.textColor};
            }
            .order>* {
                margin-bottom: 10px;
            }
            td, th {
                padding: 10px;
                border: 2px solid ${theme.textSubcolor};
            }
            table {
                border-collapse: collapse;
            }
            /*button {
                appearance: none;
                border: none;
                padding: 10px;
                color: ${theme.alternateTextColor};
                font-family: ${look.font};
                font-size: ${look.mediumSize}px;
                border-radius: 20px;
            }
            .confirm {
                background-color: #79df25;
            }
            .reject {
                background-color: red;
            }*/
        `}</style>
        <div className="order">
            <button className="confirm" onClick={props.onConfirm}>Confirm</button>
            <button className="reject" onClick={props.onReject}>Reject</button>
            <div className="crit name">Name: {props.name}</div>
            <div className="crit addr">Name: {props.address}</div>
            {props.email && <div className="crit contact">Email: {props.email}</div>}
            {props.phone && <div className="crit contact">Phone: +{props.phone}</div>}
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>count</th>
                    </tr>
                </thead>
                <tbody>
                    {props.products.map(item =>
                        <tr key={item.id} className="product">
                            <td className="product-id product-crit">{item.id}</td>
                            <td className="product-name product-crit">{item.name}</td>
                            <td className="product-count product-crit">{item.count}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="total">Total: {props.products.reduce((acc, prev) => acc + prev.count * prev.price, 0)}</div>
        </div>
    </>
}