import { TableColumn, TableView } from "./table";
import { useState, useContext } from "react";
import { useErrData } from "./hooks";
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

    return <TableView columns={columns} entries={data} onDelete={(row) => {
        if (onDelete) onDelete(row.id)
    }} />
}

export function useDatabase<T>(table: string) {
    let [updateCounter, setUpdateCounter] = useState(0)
    let statement = SQL`SELECT * FROM `
    statement.append(table)
    let { data, loading, err } = useErrData<T[]>("/api/query", { body: JSON.stringify(statement), method: "POST" }, [updateCounter])
    let auth = useContext(AuthContext)

    const updater: dbChangeHandler = (id, field, value) => {
        let statement = SQL`UPDATE `
        statement.append(table)
        statement.append(" SET ")
        statement.append(field)
        statement.append(SQL`=${value} WHERE id=${id}`)

        return fetch("/api/eval", {
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

    const deleter = (specifier: Record<string, any>) => {
        let statement = SQL`DELETE FROM `
        statement.append(table)
        let entries = Object.entries(specifier)
        if (entries.length !== 0) statement.append(" WHERE ")
        entries.forEach(([columnName, value], idx) => {
            statement.append(columnName)
            statement.append(SQL`=${value}`)
            if (idx !== entries.length - 1) {
                statement.append(" AND ")
            }
        })
        return fetch("/api/eval", {
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

    const adder = (element: any) => {
        let entries = Object.entries(element)
        let last = entries.length - 1
        let statement = SQL`INSERT INTO `
        statement.append(table)
        statement.append(" (")
        entries.forEach(([key], idx) => {
            if (idx !== last) statement.append(`${key}, `)
        })
        if (entries.length != 0) statement.append(`${entries[last][0]}`)
        statement.append(") VALUES (")
        entries.forEach(([key, value], idx) => {
            if (idx !== last) statement.append(SQL`${value}, `)
        })
        if (entries.length != 0) statement.append(SQL`${entries[last][1]}`)
        statement.append(")")
        return fetch("/api/eval", {
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

    return { loading, data, err, updater, deleter, adder }
}