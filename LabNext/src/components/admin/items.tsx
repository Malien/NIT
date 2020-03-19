import { useEffect, useReducer, useState } from "react"
import Select, { ValueType } from "react-select"
import { DBItem, Tag, Preview } from "../../shared/components"
import { createArrayLookupTable, createLookupTable } from "../../util/structures"
import { DatabaseView, useDatabase } from "../database"
import { TableColumn } from "../table"
import { AddRowView, cellReducer, createRowElement, itemColumn, selectStyle } from "./common"
export const ItemsView: React.FC = () => {
    let {
        data: items,
        loading: loadingItems,
        err: errItems,
        deleter: deleteItem,
        updater: updateItem,
        adder: addItem
    } = useDatabase<DBItem>("Items")
    let { data: tags, loading: loadingTags, err: errTags } = useDatabase<Tag>("Tags")
    let {
        data: tagBinds,
        loading: loadingTagBinds,
        err: errTagBinds,
        deleter: removeTagBind,
        adder: addTagBind
    } = useDatabase<{ itemID: number, tagID: number }>("ItemTags")
    let { data: previews, loading: loadingPreviews, err: errPreviews } = useDatabase<Preview>("Previews")
    let {
        data: previewBinds,
        loading: loadingPreviewBinds,
        err: errPreviewBinds,
        deleter: removePreviewBind,
        adder: addPreviewBind
    } = useDatabase<{ itemID: number, previewID: number }>("ItemPreviews")

    const columnFunc = itemColumn.bind(this, updateItem) as (name: string, nullable?: boolean) => TableColumn

    let tagsLookup = (!loadingTags && !errTags && tags) ? createLookupTable(tags, tag => ([tag.id, { ...tag }])) : {}
    let tagBindsLookup = (!loadingTagBinds && !errTagBinds && tagBinds) ? createArrayLookupTable(tagBinds, bind => ([bind.itemID, bind.tagID])) : {}
    let previewsLookup = (!loadingPreviews && !errPreviews && previews) ? createLookupTable(previews, tag => ([tag.id, { ...tag }])) : {}
    let previewBindsLookup = (!loadingPreviewBinds && !errPreviewBinds && previewBinds) ? createArrayLookupTable(previewBinds, bind => ([bind.itemID, bind.previewID])) : {}

    let columns: TableColumn<DBItem>[] = [
        { name: "id" },
        columnFunc("name"),
        columnFunc("price"),
        columnFunc("rating"),
        columnFunc("stock"),
        columnFunc("description", true),
        columnFunc("prevprice", true),
        columnFunc("bias", true),
        {
            name: "previews", view: (item) => {
                return <ItemPrewievSelector
                    item={item}
                    values={previewsLookup}
                    binds={previewBindsLookup}
                    isLoading={loadingPreviewBinds || loadingPreviews}
                    addBind={addPreviewBind}
                    removeBind={removePreviewBind}
                />
            }
        },
        {
            name: "tags",
            view: (item) => <ItemTagSelector
                item={item}
                values={tagsLookup}
                binds={tagBindsLookup}
                isLoading={loadingTagBinds || loadingTags}
                addBind={addTagBind}
                removeBind={removeTagBind}
            />
        }
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
            <AddRowView onAdd={() => { addItem(state) }}>
                {[
                    cellFunc("name"),
                    cellFunc("price"),
                    cellFunc("rating"),
                    cellFunc("stock"),
                    cellFunc("description", true),
                    cellFunc("prevPrice", true),
                    cellFunc("bias", true)
                ]}
            </AddRowView>
            <DatabaseView columns={columns} data={items} err={errItems} loading={loadingItems} onDelete={id => deleteItem({ id })} />
        </div>
    </>
}

interface SelectTagValue {
    label: string;
    value: number;
}

interface ItemTagSelectorProps {
    item: DBItem;
    binds: Record<number, number[]>;
    values: Record<number, Tag>;
    isLoading?: boolean;
    removeBind: (spec: { itemID: number; tagID: number }) => void;
    addBind: (bind: { itemID: number; tagID: number }) => void;
}
export const ItemTagSelector: React.FC<ItemTagSelectorProps> = props => {
    let values: ValueType<SelectTagValue>
    if (props.item.id in props.binds) {
        values = props.binds[props.item.id]
            .map(tagID => props.values[tagID])
            .filter(val => val !== undefined)
            .map(tag => ({ label: tag.name, value: tag.id }))
    }
    let [value, setValue] = useState(values)
    useEffect(() => {
        if (props.item.id in props.binds) {
            setValue(props.binds[props.item.id]
                .map(tagID => props.values[tagID])
                .filter(val => val !== undefined)
                .map(tag => ({ label: tag.name, value: tag.id }))
            )
        }
    }, [props.item, props.binds, props.values])

    return <Select
        value={value}
        isLoading={props.isLoading}
        onChange={(tags, action) => {
            switch (action.action) {
                case "clear": {
                    if (value instanceof Array) {
                        value.forEach((val: SelectTagValue) => {
                            props.removeBind({ itemID: props.item.id, tagID: val.value });
                        })
                    }
                } break;
                case "remove-value": {
                    let { removedValue } = action as any
                    props.removeBind({ itemID: props.item.id, tagID: removedValue.value })
                } break;
                case "select-option": {
                    let { option } = action as any
                    props.addBind({ itemID: props.item.id, tagID: option.value })
                } break;
                default:
                    console.warn("Unsupported operation: " + action.action)
            }
            setValue(tags)
        }}
        options={Object.values(props.values).map(tag => ({ label: tag.name, value: tag.id }))}
        isMulti={true}
        styles={selectStyle}
    />
}

interface ItemPrewievSelectorProps {
    item: DBItem;
    binds: Record<number, number[]>;
    values: Record<number, Preview>;
    isLoading?: boolean;
    removeBind: (spec: { itemID: number; previewID: number }) => void;
    addBind: (bind: { itemID: number; previewID: number }) => void;
}
export const ItemPrewievSelector: React.FC<ItemPrewievSelectorProps> = props => {
    let values: ValueType<SelectTagValue>
    if (props.item.id in props.binds) {
        values = props.binds[props.item.id]
            .map(previewID => props.values[previewID])
            .filter(val => val !== undefined)
            .map(preview => ({ label: preview.path, value: preview.id }))
    }
    let [value, setValue] = useState(values)
    useEffect(() => {
        if (props.item.id in props.binds) {
            setValue(props.binds[props.item.id]
                .map(previewID => props.values[previewID])
                .filter(val => val !== undefined)
                .map(preview => ({ label: preview.path, value: preview.id }))
            )
        }
    }, [props.item, props.binds, props.values])

    return <Select
        value={value}
        isLoading={props.isLoading}
        onChange={(tags, action) => {
            switch (action.action) {
                case "clear": {
                    if (value instanceof Array) {
                        value.forEach((val: SelectTagValue) => {
                            props.removeBind({ itemID: props.item.id, previewID: val.value });
                        })
                    }
                } break;
                case "remove-value": {
                    let { removedValue } = action as any
                    props.removeBind({ itemID: props.item.id, previewID: removedValue.value })
                } break;
                case "select-option": {
                    let { option } = action as any
                    props.addBind({ itemID: props.item.id, previewID: option.value })
                } break;
                default:
                    console.warn("Unsupported operation: " + action.action)
            }
            setValue(tags)
        }}
        options={Object.values(props.values).map(tag => ({ label: tag.path, value: tag.id }))}
        isMulti={true}
        styles={selectStyle}
    />
}