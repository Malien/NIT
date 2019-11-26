import { sign, verify as _verify, VerifyOptions } from "jsonwebtoken";
import { User } from "../../src/shared/components";
import { IncomingMessage, OutgoingMessage, ServerResponse } from "http";
import { getUser } from "./db";

export interface TokenInfo {
    id: number;
    username: string;
    tokenRevision: number;
    admin?: boolean;
}

export function createAccessToken(user: User) {
    // if (!process.env.NEXT_SERVER_ACCESS_TOKEN) throw new Error("Cannot find secret in .env")
    return sign({ id: user.id, admin: user.admin, username: user.username, tokenRevision: user.tokenRevision }, process.env.NEXT_SERVER_ACCESS_TOKEN_SECRET!, {
        expiresIn: "15m",
    })
}
export function createRefreshToken(user: User) {
    // if (!process.env.NEXT_SERVER_ACCESS_TOKEN) throw new Error("Cannot find secret in .env")
    return sign({ id: user.id, username: user.username, tokenRevision: user.tokenRevision }, process.env.NEXT_SERVER_REFRESH_TOKEN_SECRET!, {
        expiresIn: "7d"
    })
}

export function verify(token: string, publicOrPrivateKey: string): Promise<string | object>
export function verify(token: string, publicOrPrivateKey: string, options: VerifyOptions): Promise<string | object>
export function verify(t: string, k: string, o?: VerifyOptions): Promise<string | object> {
    return new Promise((resolve, reject) => {
        _verify(t, k, o, (err, decoded) => {
            if (err) reject(err)
            else resolve(decoded)
        })
    })
}

export async function withAuth(req: IncomingMessage): Promise<TokenInfo> {
    let authHeader = req.headers["authorization"]
    if (!authHeader) throw new Error("Not athorized. Access token should be provided in the authorization header")
    try {
        let token = authHeader.split(" ")[1]
        let payload = await verify(token, process.env.NEXT_SERVER_ACCESS_TOKEN_SECRET!) as TokenInfo
        let user = await getUser({id: payload.id})
        if (!user) throw new Error("User not found")
        if (user.tokenRevision != payload.tokenRevision) new Error("Invalid token")
        return payload
    } catch (e) {
        if (e instanceof Error) {
            throw new Error("Invalid token: " + e.message)
        } else throw e
    }
}

export async function authorize(username: string, password: string): Promise<string> {
    let res = await fetch("/api/auth", {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({ username, password })
    })
    let obj = await res.json()
    if (obj.error) throw obj.error
    return obj.accessToken
}