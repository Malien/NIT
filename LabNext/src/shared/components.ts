export interface StrippedItem {
    id: number;
    name: string;
    price: number;
    rating: number;
    description: string | null;
    prevPrice: number | null;
    bias: number | null // Possible user-tracked bias to a product to promote it to the top
    outOfStock?: boolean
}
/**
 * Item that supposed to be used in the store
 */ 
export interface StoreItem extends StrippedItem {
    previews: string[];
    tags: Tag[];
    size?: string;
    criteriaTable?: {[key: string]: any};
    variants?: string[]
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

export interface CountedStoreItem extends StrippedItem {
    count: number;
}

export interface Order {
    products: {[key: number]: number};
    name: string;
    address: string;
    email: string | null;
    phone: string | null;
}

export interface PlacedOrder {
    products: CountedStoreItem[];
    id: number;
    name: string;
    address: string;
    email: string | null;
    phone: string | null;
}

// Next exports app, and expects it to be hosted on domain root. But gh-pages host it at /<Repo name> path, so I've added those to all links
// export const deploymentPrefix = "/NIT"
// require("dotenv").config()
export const deploymentPrefix = process.env.NEXT_STATIC_PRODUCTION_PREFIX || ""