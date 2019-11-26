import sqlite from "sqlite3";
import { StoreItem, User } from "../shared/components";
import qs from "qs";
import { AssertionError } from "assert";
import { generate } from "password-hash";

export const itemsDB = new sqlite.Database("fastshop.db", (err) => {
    if (err) {
        console.error(err)
    }
})
itemsDB.serialize(() => {
    itemsDB.run("CREATE TABLE IF NOT EXISTS ITEMS (" +
        "ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "NAME TEXT NOT NULL," +
        "PREVIEWS TEXT NOT NULL," +
        "TAGS TEXT NOT NULL," +
        "PRICE REAL NOT NULL," +
        "CATEGORY INT NOT NULL," +
        "RATING REAL NOT NULL," +
        "STOCK INT NOT NULL," +
        "DESCRIPTION TEXT," +
        "PREVPRICE REAL," +
        "BIAS REAL" +
        ");",
    (err) => { if (err) console.error(err) })
    .run("CREATE TABLE IF NOT EXISTS USERS (" +
        "ID INTEGER PRIMARY KEY AUTOINCREMENT," + 
        "USERNAME TEXT UNIQUE NOT NULL," + 
        "HASH TEXT NOT NULL," +
        "ADMIN INT DEFAULT 0" +
        "TOKEN_REVISION INT DEFAULT 0" +
        ");",
    (err) => { if (err) console.error(err) })
    .get("SELECT count(*) FROM USERS;", (err, row) => {
        if (err) console.error(err)
        if (row["count(*)"] == 0) 
            itemsDB.run(
                "INSERT INTO USERS (USERNAME, HASH, ADMIN) VALUES ('admin', ?, 1);", 
                generate("admin", {algorithm: "sha256"}), 
                (err) => {if (err) console.error(err) })
    })
})

interface ItemDBRequest {
    category?: number;
    id?: number;
}
export function getItems({category, id}: ItemDBRequest): Promise<StoreItem[]> {
    let hasCat = typeof category !== "undefined"
    let hasId  = typeof id !== "undefined"
    return new Promise((resolve, reject) => {
        itemsDB.all(`SELECT * FROM ITEMS 
            ${(hasCat || hasId) ? "WHERE" : ""} 
            ${hasCat ? `CATEGORY=${category}`: ""} 
            ${hasId ? `ID=${id}` : ""};`, (err, rows) => {
                try {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(rows.map(entry => ({
                        name: entry.NAME,
                        id: entry.ID,
                        rating: entry.RATING,
                        previews: qs.parse(entry.PREVIEWS).previews || [],
                        tags: qs.parse(entry.TAGS).tags || [],
                        price: entry.PRICE,
                        prevPrice: entry.PREVPRICE,
                        bias: entry.BIAS,
                        outOfStock: entry.STOCK == 0,
                        decription: entry.DESCRIPTION
                    })))
                } catch (e) {
                    reject(e)
                }
            })
    })
}

interface UserDBRequest {
    username?: string;
    id?: number;
}
export function getUser({username, id}: UserDBRequest): Promise<User | null> {
    let hasId = typeof id !== "undefined"
    if (username && hasId) throw new Error("Only one param is permited")
    if (!username && !hasId) throw new Error("Did not supplied params to call getUser")
    return new Promise((resolve, reject) => {
        function callback(this: sqlite.Statement, err: Error | null, row: any) {
            try {
                if (err) {
                    reject(err)
                } else {
                    if (!row) resolve(null)
                    else resolve(toUser(row))
                }
            } catch (e) {
                reject(e)
            }
        }
        if (hasId) {
            itemsDB.get("SELECT * FROM USERS WHERE ID=(?)", id, callback)
        } else if (username) {
            itemsDB.get("SELECT * FROM USERS WHERE USERNAME=(?)", username, callback)
        }
    })
}

export function toUser(row: any) {
    return {
        username: row.USERNAME,
        hash: row.HASH,
        id: row.ID,
        admin: row.ADMIN == 1,
        tokenRevision: row.TOKEN_REVISION
    }
}

/**
 * Invalidate all refresh tokens user have invoked
 * @param req database request to get user
 * @returns user fetched from db with wrong tokenRevision
 */
export async function invalidateTokens(req: UserDBRequest): Promise<User | null> {
    let user = await getUser(req)
    return new Promise((resolve, reject) => {
        if (user == null) resolve(null)
        else itemsDB.run("UPDATE USERS SET TOKEN_REVISION=(?) WHERE ID=(?)", user.tokenRevision + 1, user.id, (err) => {
            if (err) reject(err)
            else resolve(user)
        })
    })
}