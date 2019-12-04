import { Styles } from "react-select"
import { useContext, useState, Dispatch } from "react"
import { ThemeContext, LookContext } from "../style"
import { DBItem } from "../../shared/components"
import { TableColumn } from "../table"

export type dbChangeHandler = (id: number | string, field: string, value: string | number | null) => void

export function itemColumn(onChange: dbChangeHandler, name: string, nullable?: boolean): TableColumn {
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

export function createRowElement(dispatch: Dispatch<CellAction>, name: string, nullable?: boolean) {
    return nullable
        ? <NullableItemField key={name} field={name} value={null} onChange={(value) => dispatch({ set: name, value })} />
        : <ItemField key={name} field={name} value="" onChange={(value) => dispatch({ set: name, value })} />
}

export interface CellAction {
    set: string;
    value: any;
}
export function cellReducer<T extends Object>(state: T, action: CellAction): T {
    return (Object.assign({}, state, { [action.set]: action.value }))
}

export const selectStyle: Partial<Styles> = {
    container: styles => ({ ...styles, width: 250 })
}

interface ItemFieldProps {
    value: string | number;
    field: string;
    onChange: (value: string | number) => void;
}
export const ItemField: React.FC<ItemFieldProps> = props => {
    let [value, setValue] = useState(props.value)

    return <input
        style={{ width: 100 }}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => props.onChange(value)}
    />
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

    return <input
        type="text"
        style={{ width: 100 }}
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
}

export type CellConstructor = (idx: number) => JSX.Element
interface AddRowViewProps {
    onAdd: () => void;
}
export const AddRowView: React.FC<AddRowViewProps> = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)

    return <>
        <style jsx>{`
            .fields {
                display: flex;
            }
            .container {
                display: flex;
            }
        `}</style>
        <div className="container">
            <button className="add" onClick={() => { props.onAdd() }}>+</button>
            <div className="fields">
                {props.children}
            </div>
        </div>
    </>
}