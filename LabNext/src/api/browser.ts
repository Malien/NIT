import { StoreItem } from "../shared/components"

type ItemRequest<R> = {
    [key in keyof R]: string;
}
type ItemResponse<R> = {
    [key in keyof R]: StoreItem[];
}
interface ErrFlag {
    err?: boolean;
}
type FlaggedItemResponse<R> = ItemResponse<R> & ErrFlag
type keyval<T> = readonly [string, T]
export function fetchItems<T>(req: ItemRequest<T>): Promise<ItemResponse<T>>
export function fetchItems<T>(req: ItemRequest<T>, autocatch: StoreItem[]): Promise<FlaggedItemResponse<T>>
export function fetchItems<T>(req: ItemRequest<T>, autocatch?: StoreItem[]): Promise<ItemResponse<T>> {
    let promise = Promise.all(Object.entries(req)
        .map(([key, value]) => 
            fetch(value as string)
                .then(res => res.json())
                .then(res => [key, res] as keyval<StoreItem[]>)
        )
    ).then(Object.fromEntries)
    if (autocatch) return promise.catch(reason => {
        console.error(reason)
        let obj = Object.fromEntries(Object.entries(req).map(([key]) => [key, autocatch]))
        return {...obj, err: true}
    })
    else return promise
}