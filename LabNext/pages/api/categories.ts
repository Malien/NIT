import { NextApiRequest, NextApiResponse } from "next";
import { getTags } from "../../src/api/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Content-Type", "application/json")
    let idStr = req.query.id
    let id: number | undefined
    if (idStr instanceof Array) idStr = idStr[0]
    if (idStr) {
        id = Number.parseInt(idStr)
        if (isNaN(id)) {
            id = undefined
        }
    }
    try {
        let category = await getTags(id)
        res.statusCode = 200
        res.end(JSON.stringify(category))
    } catch (error) {
        res.statusCode = 500
        res.end(JSON.stringify({ error }))
    }
}