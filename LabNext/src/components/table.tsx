import { LookContext } from "./style"
import { useContext } from "react"

export interface TableColumn {
    name: string;
    view?: (data: any) => JSX.Element
}
export interface TableViewProps {
    columns: TableColumn[];
    entries: any[];
    onDelete?: (row: any, index: number) => void 
}
export const TableView: React.FC<TableViewProps> = props => {
    let look = useContext(LookContext)
    return <>
        <style jsx>{`  
            a {
                cursor: pointer;
                color: red;
                font-family: ${look.font};
                font-weight: ${look.boldWeight};
            }
        `}</style>
        <table>
            <thead>
                <tr className="header">
                    {props.columns.map(column => <th key={column.name}>{column.name}</th>)}
                </tr>
            </thead>
            <tbody>
                {props.entries.map((entry, index) =>
                    <tr key={index} className="row">
                        {props.columns.map((column, index) =>
                            <td key={index}>{column.view ? column.view(entry) : JSON.stringify(entry[column.name])}</td>
                        )}
                        {props.onDelete && <td><a onClick={() => props.onDelete!(entry, index)}>delete</a></td>}
                    </tr>)}
            </tbody>
        </table>
    </>
}