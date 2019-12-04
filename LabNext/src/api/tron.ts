import { TronItem, StoreItem, TronCategory } from "../shared/components";
import qs from "qs";

export function toStoreItem(from: TronItem): StoreItem;
export function toStoreItem(from: TronItem[]): StoreItem[];

/**
 * Converts TronItem from API to StoreItem
 * @param from item(s) to be converted to StoreItem
 */
export function toStoreItem(from: TronItem | TronItem[]): StoreItem | StoreItem[] {
    if (from instanceof Array) {
        return from.map(val => toStoreItem(val));
    }

    let prevPrice: number | null = null
    let price: number
    if (from.special_price) {
        prevPrice = Number.parseFloat(from.price)
        price = Number.parseFloat(from.special_price)
    } else {
        price = Number.parseFloat(from.price)
    }
    let words = from.name.split(/[, .\(\)\\\:\"\']/)
    words.splice(4)
    let name = words.join(" ")
    let bias = name.length * 0.02

    return {
        name: words.join(" "),
        description: from.description,
        id: from.id,
        previews: [{path: from.image_url, alt: null}],
        price,
        prevPrice,
        rating: 3,
        tags: [],
        bias
    }
}

/**
 * Generate url to fetch items from
 * @param category category for url to be generated for
 */
export function itemsUrlFor(category?: string | number) {
    return (category) ? `https://nit.tron.net.ua/api/product/list/category/${category}` : "https://nit.tron.net.ua/api/product/list"
}

/**
 * Fetch items from tron API (browser)
 * @param category? category to be fetched. if none is set all items will be fetched
 */
export async function fetchItems(category?: string | number) : Promise<TronItem[]> {
    return fetch(itemsUrlFor(category))
        .then(data => data.json())
}

/**
 * Fetch all categoris from tron API (browser)
 */
export async function fetchCategories() : Promise<TronCategory[]> {
    return fetch("https://nit.tron.net.ua/api/category/list")
        .then(val => val.json())
}

let cache: TronCategory[] | undefined
/**
 * Fetch categories, or if already fetched in browser, use them. (browser)
 */
export async function fetchCachedCategories() {
    if (!cache) cache = await fetchCategories()
    return cache;
}

/**
 * Fetches single item from tron API (browser)
 * @param id item id to be fetched
 */
export async function fetchItem(id: string) : Promise<TronItem> {
    return fetch(`https://nit.tron.net.ua/api/product/${id}`)
        .then(val => val.json())
}

export interface PurchaseRequest {
    name: string;
    phone: string;
    email: string;
    products: {[id: string]: number}
}
/**
 * Sends purchase request to tron API (browser)
 * @param req name, phone, email, and products to post purcahse request
 */
export async function submitPurchase(req: PurchaseRequest) {
    let tokened = {...req, token: "OSGYH4gE_8ae_UU1-msa"}
    let body = qs.stringify(tokened)
    return fetch("https://nit.tron.net.ua/api/order/add", {
        method: "POST",
        headers: {
            'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body
    })
}