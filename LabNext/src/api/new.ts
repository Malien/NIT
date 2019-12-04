import qs from "qs";
import { StoreItem, Tag, deploymentPrefix } from "../shared/components";

interface ItemReq {
    id?: number;
    tag?: number;
}
export function fetchItems(req: ItemReq = {}): Promise<StoreItem[]> {
    return fetch(`${deploymentPrefix}/api/items${req.id || req.tag ? "$" : ""}${qs.stringify(req)}`).then(v => v.json())
}

export function fetchTags(id?: number): Promise<Tag[]> {
    return fetch(`${deploymentPrefix}/api/tags${id ? "$" : ""}${qs.stringify({ id })}`).then(v => v.json())
}