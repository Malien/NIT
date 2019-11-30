import { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "../../src/api/authUtils"
import { getOrders } from "../../src/api/db"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Content-Type", "application/json")
    try {
        let token = await withAuth(req)
        if (!token.admin) throw new Error("Not enough previlages")
        let orders = await getOrders(req.query)
        res.end(JSON.stringify(orders))
    } catch (error) {
        res.statusCode = 500
        res.end(error)
    }
}