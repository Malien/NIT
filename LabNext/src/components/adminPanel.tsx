import { useContext, useState } from "react"
import SQL from "sql-template-strings"
import { DBItem, PlacedOrder, Preview, Tag } from "../shared/components"
import { AuthContext } from "./auth"
import { DatabaseView, useDatabase } from "./database"
import { useErrData } from "./hooks"
import { Tab, TabsView } from "./layout"
import { LookContext, ThemeContext } from "./style"
import { TableColumn } from "./table"
import { classes } from "./util"

const AdminPanel: React.FC = props => {
    return <TabsView>
        <Tab title="Items">
            <ItemsView />
        </Tab>
        <Tab title="Tags">
            <TagsView />
        </Tab>
        <Tab title="Assets">
            <AssetsView />
        </Tab>
        <Tab title="Orders">
            <OrdersView />
        </Tab>
        <Tab title="Users">
            <UsersView />
        </Tab>
    </TabsView>
}

type dbChangeHandler = (id: number | string, field: string, value: string | number | null) => void

function itemColumn(onChange: dbChangeHandler, name: string, nullable?: boolean): TableColumn {
    if (nullable) {
        return {
            name,
            view: (item: DBItem) => <NullableItemField field={name} onChange={onChange.bind(this, item.id, name)} value={item[name]} />
        }
    } else {
        return {
            name,
            view: (item: DBItem) => <ItemField field={name} onChange={onChange.bind(this, item.id, name)} value={item[name]} />
        }
    }
}

export const ItemsView: React.FC = () => {
    let { data, loading, err, deleter, updater } = useDatabase<DBItem[]>("Items")

    const columnFunc = itemColumn.bind(this, updater) as (name: string, nullable?: boolean) => TableColumn

    let columns: TableColumn[] = [
        { name: "id" },
        columnFunc("name"),
        columnFunc("price"),
        columnFunc("rating"),
        columnFunc("stock"),
        columnFunc("description", true),
        columnFunc("prevprice", true),
        columnFunc("bias", true),
        { name: "previews", view: () => <>Previews</> },
        { name: "tags", view: () => <>Tags</> }
    ]

    return <>
        <style jsx>{`
            .padded {
                padding: 20px;
                position: relative;
            }
        `}</style>
        <div className="padded">
            <DatabaseView columns={columns} data={data} err={err} loading={loading} onDelete={deleter} />
        </div>
    </>
}

export const TagsView: React.FC = () => {
    let { updater, deleter, ...props } = useDatabase<Tag[]>("Tags")

    const columnFunc = itemColumn.bind(this, updater) as (name: string, nullable?: boolean) => TableColumn

    let columns: TableColumn[] = [
        { name: "id" },
        columnFunc("name"),
        columnFunc("description", true)
    ]

    return <>
        <style jsx>{`
            .padded {
                padding: 20px;
                position: relative;
            }
        `}</style>
        <div className="padded">
            <DatabaseView columns={columns} onDelete={deleter} {...props} />
        </div>
    </>
}

export const AssetsView: React.FC = () => {
    let { updater, deleter, ...props } = useDatabase<Preview[]>("Previews")
    const columnFunc = itemColumn.bind(this, updater) as (name: string, nullable?: boolean) => TableColumn

    let columns: TableColumn[] = [
        { name: "id" },
        columnFunc("path"),
        columnFunc("alt", true)
    ]

    return <>
        <style jsx>{`
            .padded {
                padding: 20px;
                position: relative;
            }
        `}</style>
        <div className="padded">
            <DatabaseView columns={columns} onDelete={deleter} {...props} />
        </div>
    </>
}

export const UsersView: React.FC = () => {
    let { updater, deleter, ...props } = useDatabase<Preview[]>("Users")
    const columnFunc = itemColumn.bind(this, updater) as (name: string, nullable?: boolean) => TableColumn

    let columns: TableColumn[] = [
        { name: "id" },
        columnFunc("username"),
        columnFunc("hash"),
        columnFunc("admin"),
        columnFunc("tokenRevision")
    ]

    return <>
        <style jsx>{`
            .padded {
                padding: 20px;
                position: relative;
            }
        `}</style>
        <div className="padded">
            <DatabaseView columns={columns} onDelete={deleter} {...props} />
        </div>
    </>
}

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
                    <div key={order.id} className={classes({"order-item": true, "selected": index == selected})} onClick={() => {setSelected(index)}}>
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

interface ItemFieldProps {
    value: string | number;
    field: string;
    onChange: (value: string | number) => void;
}
export const ItemField: React.FC<ItemFieldProps> = props => {
    let [value, setValue] = useState(props.value)

    return <>
        <style jsx>{`
            input {
                margin: auto;
            }
        `}</style>
        <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => props.onChange(value)}
        />
    </>
}

interface NullableItemFieldProps {
    value: string | number | null;
    field: string;
    onChange: (value: string | number | null) => void;
}
export const NullableItemField: React.FC<NullableItemFieldProps> = props => {
    let [value, setValue] = useState(props.value)
    let [edit, setEdit] = useState(false)
    let renderValue = value || (edit ? "" : "null")

    return <>
        <style jsx>{`
            input {
                margin: auto;
            }
        `}</style>
        <input
            type="text"
            value={renderValue}
            onFocus={() => setEdit(true)}
            onChange={(e) => setValue(e.target.value)}
            onSubmit={() => {
                if (value) {
                    if (typeof value == "string" && value.toLowerCase() === "null") {
                        setValue(null)
                        props.onChange(null)
                    } else props.onChange(value)
                } else props.onChange(value)
            }}
            onBlur={(e) => {
                setEdit(false)
                if (e.target.value.toLowerCase() === "null") {
                    setValue(null)
                    props.onChange(null)
                }
                else props.onChange(value)
            }}
        />
    </>
}

export default AdminPanel