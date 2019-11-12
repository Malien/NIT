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
/**
 * Old API fetch used for getting static item files in the broser.
 * @param req object with name: path pairs coresponding to resulting name: object fetched object
 */
export function fetchItems<T>(req: ItemRequest<T>): Promise<ItemResponse<T>>
/**
 * Old API fetch used for getting static item files in the broser. If an error enountered, result includes err flag
 * @param req object with name: path pairs coresponding to resulting name: object fetched object
 * @param autocatch If error encountered, this value will be set as a result
 */
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