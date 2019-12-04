import qs from "qs";
import { StoreItem, Tag, deploymentPrefix } from "../shared/components";
import { fetch } from "./node";

interface ItemReq {
    id?: number;
    tag?: number;
}
export function fetchItems(req: ItemReq = {}): Promise<StoreItem[]> {
    return fetch(`http://localhost:3000${deploymentPrefix}/api/items${req.id || req.tag ? "$" : ""}${qs.stringify(req)}`).then(v => v.json())
}

export function fetchTags(id?: number): Promise<Tag[]> {
    return fetch(`http://localhost:3000${deploymentPrefix}/api/tags${id ? "$" : ""}${qs.stringify({ id })}`).then(v => v.json())
}