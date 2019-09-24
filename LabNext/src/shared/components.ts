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
    descripton?: string;
    prevPrice?: number;
    size?: string;
    criteriaTable?: object;
    variants?: StoreItem[]
}