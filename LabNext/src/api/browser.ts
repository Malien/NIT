import { StoreItem } from "../shared/components"
import { fromEntries } from "../util/pollyfilling"

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
type keyval<T> = [string, T]
export function fetchItems<T>(req: ItemRequest<T>): Promise<ItemResponse<T>>
export function fetchItems<T>(req: ItemRequest<T>, autocatch: StoreItem[]): Promise<FlaggedItemResponse<T>>
export function fetchItems<T>(req: ItemRequest<T>, autocatch?: StoreItem[]) {
    let promise = Promise.all(Object.entries(req)
        .map(([key, value]) => 
            fetch(value as string)
                .then(res => res.json())
                .then(res => [key, res] as keyval<StoreItem[]>)
        )
    ).then(fromEntries)
    if (autocatch) return promise.catch(reason => {
        console.error(reason)
        let obj = fromEntries(Object.entries(req).map(([key]) => [key, autocatch]))
        return {...obj, err: true}
    })
    else return promise
}