import { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "../../src/api/authUtils"
import { getUsers } from "../../src/api/db"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Content-Type", "application/json")
    try {
        let token = await withAuth(req)
        if (!token.admin) throw new Error("Not enough previlages")
        let users = await getUsers(req.query)
        res.end(JSON.stringify(users))
    } catch (error) {
        res.statusCode = 500
        res.end(JSON.stringify({ error }))
    }
}