export enum Tags {
    hats, boots, leggins, sweater, jacket, accessories, woman, man, kid
}

/**
 * Item that supposed to be used in the store
 */ 
export interface StoreItem {
    name: string;
    id: string;
    previews: string[];
    tags: Tags[];
    price: number;
    rating: number;
    description?: string;
    prevPrice?: number;
    size?: string;
    criteriaTable?: {[key: string]: any};
    variants?: string[]
    bias?: number // Possible user-tracked bias to a product to promote it to the top
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

export interface Category {
    id: number;
    name: string;
    description?: string;
}

// Next exports app, and expects it to be hosted on domain root. But gh-pages host it at /<Repo name> path, so I've added those to all links
// export const deploymentPrefix = "/NIT"
// require("dotenv").config()
export const deploymentPrefix = process.env.NEXT_STATIC_PRODUCTION_PREFIX || ""