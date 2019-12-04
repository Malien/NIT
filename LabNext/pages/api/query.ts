import { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "../../src/api/authUtils"
import { query } from "../../src/api/db"
import SQL from "sql-template-strings"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Content-Type", "application/json")
    try {
        let token = await withAuth(req)
        if (!token.admin) {
            res.statusCode = 403
            res.end(JSON.stringify({error: "You do not have enough permissions"}))
        } else {
            let {strings, values} = JSON.parse(req.body)
            let qres = await query(SQL(strings, ...values))
            // console.log(strings, values, qres)
            res.end(JSON.stringify(qres))
        }
    } catch (error) {
        res.statusCode = 500
        res.end(JSON.stringify({error}))
    }
}