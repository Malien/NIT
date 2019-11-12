import { TronItem, TronCategory } from "../shared/components";
import { itemsUrlFor } from "./tron";
import { fetch } from "./node";

/**
 * Fetch items from tron API (node)
 * @param category? category to be fetched. if none is set all items will be fetched
 */
export function fetchItems(category?: string | number): Promise<TronItem[]> {
    return fetch(itemsUrlFor(category))
        .then(val => val.json())
    // return new Promise((resolve, reject) => {
    //     let url = itemsUrlFor(category)
    //     get(url, (res) => {
    //         let data = ""
    //         if (res.statusCode == 200) {
    //             res.on("data", (chunk) => {
    //                 data += chunk
    //             })
    //             res.on("end", () => {
    //                 try {
    //                     resolve(JSON.parse(data))
    //                 } catch (e) {
    //                     reject(e)
    //                 }
    //             })
    //         } else reject(res.statusCode)
    //     }).on("error", reject) 
    // })
}

/**
 * Fetch all categoris from tron API (node)
 */
export async function fetchCategories() : Promise<TronCategory[]> {
    return fetch("https://nit.tron.net.ua/api/category/list")
        .then(val => val.json())
}

/**
 * Fetches single item from tron API (node)
 * @param id item id to be fetched
 */
export async function fetchItem(id: string) : Promise<TronItem> {
    return fetch(`https://nit.tron.net.ua/api/product/${id}`)
        .then(val => val.json())
}