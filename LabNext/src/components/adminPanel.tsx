import { useState } from "react"
import { DBItem, Preview, Tag } from "../shared/components"
import { DatabaseView, useDatabase } from "./database"
import { Tab, TabsView } from "./layout"
import { TableColumn } from "./table"

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
            Orders
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
            <DatabaseView columns={columns} data={data} err={err} loading={loading} onDelete={deleter}/>
        </div>
    </>
}

export const TagsView: React.FC = () => {
    let {updater, deleter, ...props} = useDatabase<Tag[]>("Tags")

    const columnFunc = itemColumn.bind(this, updater) as (name: string, nullable?: boolean) => TableColumn

    let columns: TableColumn[] = [
        {name: "id"},
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
    let {updater, deleter, ...props} = useDatabase<Preview[]>("Previews")
    const columnFunc = itemColumn.bind(this, updater) as (name: string, nullable?: boolean) => TableColumn

    let columns: TableColumn[] = [
        {name: "id"},
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
    let {updater, deleter, ...props} = useDatabase<Preview[]>("Users")
    const columnFunc = itemColumn.bind(this, updater) as (name: string, nullable?: boolean) => TableColumn

    let columns: TableColumn[] = [
        {name: "id"},
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