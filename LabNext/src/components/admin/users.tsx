import { useDatabase, DatabaseView } from "../database"
import { Preview } from "../../shared/components"
import { itemColumn } from "./common"
import { TableColumn } from "../table"

export const UsersView: React.FC = () => {
    let { updater, deleter, ...props } = useDatabase<Preview>("Users")
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
            <DatabaseView columns={columns} onDelete={id => deleter({ id })} {...props} />
        </div>
    </>
}