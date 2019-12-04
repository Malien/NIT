import { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "../../src/api/authUtils"
import { evalQuery } from "../../src/api/db"
import SQL from "sql-template-strings"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Content-Type", "application/json")
    try {
        let token = await withAuth(req)
        if (!token.admin) {
            res.statusCode = 403
            res.end(JSON.stringify({error: "No privelages"}))
        }
        let {strings, values} = JSON.parse(req.body)
        let st = SQL(strings, ...values)
        console.log(st)
        let data = await evalQuery(SQL(strings, ...values))
        console.log(data)
        res.end(JSON.stringify(data))
    } catch (error) {
        console.error(error)
        res.statusCode = 500
        res.end(JSON.stringify({error}))
    }
}