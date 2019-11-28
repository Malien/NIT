import { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "../../src/api/authUtils"
import { invalidateTokens } from "../../src/api/db"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let token = await withAuth(req)
        invalidateTokens({id: token.id})
    } catch (e) {
        console.error(e)
    }
}