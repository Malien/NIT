export enum Tags {
    hats, boots, leggins, sweater, jacket, accessories, woman, man, kid
}

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
    criteriaTable?: object;
    variants?: string[]
    bias?: number // Possible user-tracked bias to a product to promote it to the top
    outOfStock?: boolean
}