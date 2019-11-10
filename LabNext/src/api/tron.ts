import { TronItem, StoreItem, TronCategory } from "../shared/components";
import qs from "qs";

export function toStoreItem(from: TronItem): StoreItem;
export function toStoreItem(from: TronItem[]): StoreItem[];

export function toStoreItem(from: TronItem | TronItem[]): StoreItem | StoreItem[] {
    if (from instanceof Array) {
        return from.map(val => toStoreItem(val));
    }

    let prevPrice: number | undefined
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
        previews: [from.image_url],
        price,
        prevPrice,
        rating: 3,
        tags: [],
        bias
    }
}

export function itemsUrlFor(category?: string | number) {
    return (category) ? `https://nit.tron.net.ua/api/product/list/category/${category}` : "https://nit.tron.net.ua/api/product/list"
}

export async function fetchItems(category?: string | number) : Promise<TronItem[]> {
    return fetch(itemsUrlFor(category))
        .then(data => data.json())
        // .then((data: TronItem[]) => data.map(toStoreItem))
}

export async function fetchCategories() : Promise<TronCategory[]> {
    return fetch("https://nit.tron.net.ua/api/category/list")
        .then(val => val.json())
}

let cache: TronCategory[] | undefined
export async function fetchCachedCategories() {
    if (!cache) cache = await fetchCategories()
    return cache;
}

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
    // let url = `https://nit.tron.net.ua/api/order/add?name=${encodeURIComponent()}`
    // return fetch("https://nit.tron.net.ua/api/order/add")
}