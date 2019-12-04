import { useDatabase, DatabaseView } from "../database"
import { Preview } from "../../shared/components"
import { TableColumn } from "../table"
import { itemColumn, cellReducer, createRowElement, AddRowView } from "./common"
import { useReducer } from "react"

export const AssetsView: React.FC = () => {
    let { updater, deleter, adder, ...props } = useDatabase<Preview>("Previews")
    const columnFunc = itemColumn.bind(this, updater) as (name: string, nullable?: boolean) => TableColumn

    let columns: TableColumn[] = [
        { name: "id" },
        columnFunc("path"),
        columnFunc("alt", true)
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
                    cellFunc("path"),
                    cellFunc("alt", true)
                ]}
            </AddRowView>
            <DatabaseView columns={columns} onDelete={id => deleter({ id })} {...props} />
        </div>
    </>
}