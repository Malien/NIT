import { NextApiRequest, NextApiResponse } from "next";
import { getItems } from "../../src/api/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.statusCode = 405
        res.end(JSON.stringify({error: `Wrong method. Expected 'GET', recieved '${req.method}'`}))
        return
    }
    try {
        let { id: idStr, tag: tagStr } = req.query
        if (idStr instanceof Array) idStr = idStr[0];
        if (tagStr instanceof Array) tagStr = tagStr[0];
        res.setHeader("Content-Type", "application/json")
        let id: number | undefined = Number.parseInt(idStr)
        let tag: number | undefined = Number.parseInt(tagStr)
        if (isNaN(id)) id = undefined;
        if (isNaN(tag)) tag = undefined;
        res.statusCode = 200
        res.end(JSON.stringify(await getItems({ id, tag })))
    } catch (error) {
        if (error.code === "SQLITE_ERROR") error = "Internal Database error"
        res.statusCode = 500
        res.end(JSON.stringify({ error }))
    }
}