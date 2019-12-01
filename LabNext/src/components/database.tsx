import { TableColumn, TableView } from "./table";
import { useState, useContext } from "react";
import { useData } from "./hooks";
import SQL from "sql-template-strings";
import { AuthContext } from "./auth";

type dbChangeHandler = (id: number | string, field: string, value: string | number | null) => void

interface DatabaseViewProps {
    loading?: boolean;
    err?: any;
    data?: any[];
    onDelete?: (id: string | number) => void
    columns: TableColumn[];
}
export const DatabaseView: React.FC<DatabaseViewProps> = ({ loading, err, data, columns, onDelete }) => {
    let auth = useContext(AuthContext)

    
    if (loading) return <div>Loading...</div>
    if (err) return <div>{JSON.stringify(err)}</div>
    if (!data) return <div>No data</div>
    if (!(auth && auth.token.tokenInfo && auth.token.accessToken && auth.token.tokenInfo.admin)) return <div>Not authorized</div>
    
    return <TableView columns={columns} entries={data} onDelete={onDelete} />
}

export function useDatabase<T = any>(table: string) {
    let [updateCounter, setUpdateCounter] = useState(0)
    let statement = SQL`SELECT * FROM `
    statement.append(table)
    let { data, loading, err } = useData<T | { error: any }>("/api/query", { body: JSON.stringify(statement), method: "POST" }, [updateCounter])
    let auth = useContext(AuthContext)

    const updater: dbChangeHandler = (id, field, value) => {
        let statement = SQL`UPDATE `
        statement.append(table)
        statement.append(" SET ")
        statement.append(field)
        statement.append(SQL`=${value} WHERE id=${id}`)

        fetch("/api/eval", {
            body: JSON.stringify(statement),
            method: "POST",
            headers: {
                "Authorization": `Bearer ${auth!.token.accessToken!}`
            }
        })
            .then(res => res.json())
            .then(console.log)
            .then(() => setUpdateCounter(updateCounter + 1))
            .catch(console.error)
    }

    const deleter = (id: number | string) => {
        let statement = SQL`DELETE FROM `
        statement.append(table)
        statement.append(SQL` WHERE id=${id}`)
        fetch("/api/eval", {
            body: JSON.stringify(statement),
            method: "POST",
            headers: {
                "Authorization": `Bearer ${auth!.token.accessToken!}`
            }
        })
            .then(res => res.json())
            .then(console.log)
            .then(() => setUpdateCounter(updateCounter + 1))
            .catch(console.error)
    }

    if (data && !(data instanceof Array)) {
        data = data as { error: any }
        return { loading, data: undefined, err: data.error, updater, deleter }
    }

    return { loading, data, err, updater, deleter }
}