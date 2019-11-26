import { NextApiRequest, NextApiResponse } from "next";
import { verify, createRefreshToken, createAccessToken } from "../../src/api/authUtils";
import { getUser } from "../../src/api/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    let token = req.cookies["rtkn"]
    res.setHeader("Content-Type", "application/json")
    if (!token) {
        res.statusCode = 401
        res.end(JSON.stringify({ error: "Missing refresh token in cookie" }))
    } else {
        try {
            let payload = await verify(token, process.env.NEXT_SERVER_REFRESH_TOKEN_SECRET!) as any
            if (typeof payload !== "string" && typeof payload.id !== "undefined") {
                let user = await getUser({ id: payload.id })
                if (user) {
                    res.setHeader("Set-Cookie", `rtkn=${createRefreshToken(user)}; HttpOnly`)
                    res.statusCode = 200
                    res.end(JSON.stringify({
                        accessToken: createAccessToken(user)
                    }))
                } else throw new Error("User is not found")
            }
        } catch (error) {
            res.statusCode = 500
            res.end(JSON.stringify({ error }))
        }
    }
}