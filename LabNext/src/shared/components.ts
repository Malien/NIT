/**
 * Item that supposed to be used in the store
 */ 
export interface StoreItem {
    name: string;
    id: string;
    previews: string[];
    tags: Tag[];
    price: number;
    rating: number;
    description: string | null;
    prevPrice: number | null;
    size?: string;
    criteriaTable?: {[key: string]: any};
    variants?: string[]
    bias: number | null // Possible user-tracked bias to a product to promote it to the top
    outOfStock?: boolean
}

/**
 *  Item that I get from https://nit.tron.net.ua/api
 */ 
export interface TronItem {
    name: string;
    id: string;
    description: string;
    image_url: string;
    price: string;
    special_price: string | null;
}

/**
 * Category that I get from https://nit.tron.net.ua/api
 */
export interface TronCategory {
    id: string;
    name: string;
    description: string;
}

export interface User {
    id: number;
    username: string;
    hash: string;
    admin: boolean;
    tokenRevision: number;
}

export interface Tag {
    id: number;
    name: string;
    description: string | null;
}

export interface TokenInfo {
    id: number;
    username: string;
    tokenRevision: number;
    admin?: boolean;
}

export interface CountedStoreItem extends StoreItem {
    count: number;
}

export interface Order {
    products: CountedStoreItem[];
    name: string;
    address: string;
    email: string | null;
    phone: string | null;
}

// Next exports app, and expects it to be hosted on domain root. But gh-pages host it at /<Repo name> path, so I've added those to all links
// export const deploymentPrefix = "/NIT"
// require("dotenv").config()
export const deploymentPrefix = process.env.NEXT_STATIC_PRODUCTION_PREFIX || ""