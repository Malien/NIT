import { classes } from "./util"

enum DatabaseType {
    real, int, text, blob, date, 
}
interface DatabaseColumn {
    name: string;
    type: DatabaseType;
    value: any;
    notnull?: boolean;
    unique?: boolean;
    key?: boolean;
}
interface DatabaseViewProps {
    columns: DatabaseColumn[];
    entries: any[];
}
export const DatabaseView: React.FC<DatabaseViewProps> = props => {
    return <>
        <table>
            <tr>
                {props.columns.map(column => <th title={classes({
                    [column.type]: true,
                    "KEY": column.key,
                    "UNIQUE": column.unique,
                    "NOT NULL": column.notnull,
                })} key={column.name}>{column.name}</th>)}
            </tr>
            {props.entries.map(entry => <td>{entry}</td>)}
        </table>
    </>
}