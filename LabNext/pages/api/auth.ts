import { NextApiResponse, NextApiRequest } from "next";
import { generate, verify } from "password-hash";
import { getUser } from "../../src/api/db";
import { createRefreshToken, createAccessToken } from "../../src/api/authUtils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Content-Type", "application/json")
    if (!process.env.NEXT_SERVER_ACCESS_TOKEN_SECRET) throw new Error("cannot find secret in .env")
    if (req.method !== "POST") {
        res.statusCode = 405
        res.end(JSON.stringify({ error: `Wrong method. Expected 'GET', recieved '${req.method}'` }))
    } else {
        try {
            let { username, password } = JSON.parse(req.body)
            let user = await getUser({ username })

            if (!user) throw new Error("Cannot find user")
            // TODO: Renew password check
            if (!verify(password, user.hash)) throw new Error("Wrong password")

            res.setHeader("Set-Cookie", `rtkn=${createRefreshToken(user)}; HttpOnly`)
            res.statusCode = 200
            res.end(JSON.stringify({
                accessToken: createAccessToken(user)
            }))
        } catch (error) {
            console.error(error)
            if (error instanceof Error) {
                error = { name: error.name, message: error.message }
            }
            res.statusCode = 500
            res.end(JSON.stringify({ error }))
        }
    }
}