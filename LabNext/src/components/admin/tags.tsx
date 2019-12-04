import { useDatabase, DatabaseView } from "../database"
import { Tag } from "../../shared/components"
import { TableColumn } from "../table"
import { useReducer } from "react"
import { cellReducer, itemColumn, createRowElement, AddRowView } from "./common"

export const TagsView: React.FC = () => {
    let { updater, deleter, adder, ...props } = useDatabase<Tag>("Tags")

    const columnFunc = itemColumn.bind(this, updater) as (name: string, nullable?: boolean) => TableColumn

    let columns: TableColumn[] = [
        { name: "id" },
        columnFunc("name"),
        columnFunc("description", true)
    ]

    let [state, dispatch] = useReducer(cellReducer, {})
    const cellFunc = createRowElement.bind(this, dispatch)

    return <>
        <style jsx>{`
            .padded {
                padding: 20px;
                position: relative;
            }
        `}</style>
        <div className="padded">
            <AddRowView onAdd={() => adder(state)}>
                {[
                    cellFunc("name"),
                    cellFunc("description", true)
                ]}
            </AddRowView>
            <DatabaseView columns={columns} onDelete={id => deleter({ id })} {...props} />
        </div>
    </>
}