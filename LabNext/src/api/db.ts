import sqlite, { Database } from "sqlite";
import { StoreItem, User, Tag, Order } from "../shared/components";
import qs from "qs";
import { generate } from "password-hash";
import { readFile } from "fs";
import SQL, { SQLStatement } from "sql-template-strings";

export const dbPromise = initDB({
    from: "./src/api/configuration.sql",
    withAdmin: {
        username: process.env.NEXT_SERVER_ADMIN_USERNAME || "admin",
        password: process.env.NEXT_SERVER_ADMIN_PASSWORD || "admin"
    }
})

/**
 * @param param.from path to a file with sql statements to be executed in concurently
 *             seperated by semicolons. Optional
 * @param param.withAdmin if provided initial admin user is created on start
 */
async function initDB({ from, withAdmin }: {
    from?: string;
    withAdmin?: {
        username: string;
        password: string;
    };
} = {}) {
    let db: Database
    if (from) {
        let strPromise = new Promise<string>((resolve, reject) => {
            readFile("./src/api/configuration.sqlite", (err, data) => {
                if (err) reject(err)
                else resolve(data.toString())
            })
        })
        let confstr: string
        [db, confstr] = await Promise.all([sqlite.open("fastshop.db"), strPromise])
        try {
            await Promise.all(
                confstr.split(";")
                    .map(str => str + ";")
                    .map(str => db.run(str))
            )
        } catch (e) {
            console.error(e)
        }
    } else {
        db = await sqlite.open("fastshop.db")
    }
    if (withAdmin) {
        let { "count(*)": count } = await db.get("SELECT count(*) FROM Users WHERE admin=1")
        if (count == 0) {
            let passwordHash = generate(withAdmin.password, { algorithm: "sha256" })
            await db.run(SQL`INSERT INTO users (username, hash, admin) VALUES (${withAdmin.username}, ${passwordHash}, 1)`)
        }
    }
    return db
}

// export const itemsDB = new sqlite.Database("fastshop.db", (err) => {
//     if (err) {
//         console.error(err)
//     }
// })
// itemsDB.serialize(() => {
//     itemsDB.run("CREATE TABLE IF NOT EXISTS ITEMS (" +
//         "ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
//         "NAME TEXT NOT NULL," +
//         "PREVIEWS TEXT NOT NULL," +
//         "TAGS TEXT NOT NULL," +
//         "PRICE REAL NOT NULL," +
//         "CATEGORY INTEGER NOT NULL," +
//         "RATING REAL NOT NULL," +
//         "STOCK INTEGER NOT NULL," +
//         "DESCRIPTION TEXT," +
//         "PREVPRICE REAL," +
//         "BIAS REAL" +
//         ");",
//         (err) => { if (err) console.error(err) })
//     .run("CREATE TABLE IF NOT EXISTS USERS (" +
//         "ID INTEGER PRIMARY KEY AUTOINCREMENT," + 
//         "USERNAME TEXT UNIQUE NOT NULL," + 
//         "HASH TEXT NOT NULL," +
//         "ADMIN INTEGER DEFAULT 0," +
//         "TOKEN_REVISION INTEGER DEFAULT 0" +
//         ");",
//         (err) => { if (err) console.error(err) })
//     .get("SELECT count(*) FROM USERS;", (err, row) => {
//         if (err) console.error(err)
//         if (row["count(*)"] == 0) 
//             itemsDB.run(
//                 "INSERT INTO USERS (USERNAME, HASH, ADMIN) VALUES ('admin', ?, 1);", 
//                 generate("admin", {algorithm: "sha256"}), 
//                 (err) => {if (err) console.error(err) })
//     }).run("CREATE TABLE IF NOT EXISTS CATEGORIES (" +
//         "ID INTEGER PRIMARY KEY AUTOINCREMENT," +
//         "NAME TEXT NOT NULL," +
//         "DESCRIPTION TEXT" + 
//         ");",
//         (err) => { if (err) console.error(err) })
//     .run(
//         "CREATE TABLE IF NOT EXISTS ORDERS(" +
//         "ID INTEGER PRIMARY KEY AUTOINCREMENT," +
//         "ITEMID INTEGER NOT NULL," +
//         "DISTID INTEGER NOT NULL," +
//         "COUNT INTEGER NOT NULL" +
//         ");",
//         (err) => { if (err) console.error(err) })
//     .run(
//         "CREATE TABLE IF NOT EXISTS DESTINATIONS(" +
//         "ID INTEGER PRIMARY KEY AUTOINCREMENT," +
//         "ADDRESS TEXT NOT NULL," +
//         "EMAIL TEXT," +
//         "PHONE CHARACTER(20)" +
//         ");",
//         (err) => { if (err) console.error(err) })
// })

interface ItemDBRequest {
    tag?: number;
    id?: number;
}

export async function getItems({ tag, id }: ItemDBRequest): Promise<StoreItem[]> {
    let hasTag = typeof tag !== "undefined"
    let hasId = typeof id !== "undefined"
    let db = await dbPromise
    let statement: SQLStatement
    if (!hasTag) {
        statement = SQL`SELECT * FROM Items`
        if (hasId || hasTag) {
            statement = statement.append(" WHERE")
        }
        if (hasId) statement = statement.append(SQL` id=${id}`)
    } else {
        statement = SQL`
            SELECT id, name, price, rating, stock, description, prevprice, bias 
            FROM Items 
            JOIN ItemTags 
            ON Items.id == ItemTags.itemID 
            WHERE ItemTags.tagID = ${tag}`
    }
    let items = await db.all(statement)
    let contents = await Promise.all(items.map(item => Promise.all([
        db.all(
            SQL`SELECT Previews.path, Previews.alt 
                FROM ItemPreviews 
                JOIN Previews 
                ON ItemPreviews.previewID = Previews.id 
                WHERE ItemPreviews.itemID = ${item.id};`),
        db.all(
            SQL`SELECT Tags.name
                FROM ItemTags 
                JOIN Tags 
                ON ItemTags.tagID = Tags.id 
                WHERE ItemTags.itemID = ${item.id};`)
    ])))
    let res: StoreItem[] = []
    items.forEach((item, index) => {
        let previews = contents[index][0]
        let tags = contents[index][1]
        res.push({
            ...item,
            previews,
            tags
        })
    })
    return res
}

interface UserDBRequest {
    username?: string;
    id?: number;
}
export async function getUser({ username, id }: UserDBRequest): Promise<User | null> {
    let hasId = typeof id !== "undefined"
    // if (username && hasId) throw new Error("Only one param is permited")
    if (!username && !hasId) throw new Error("Did not supplied params to call getUser")
    let db = await dbPromise
    let statement = SQL`SELECT * FROM Users WHERE`
    if (hasId) statement = statement.append(SQL` id=${id}`)
    if (username) statement = statement.append(SQL` username=${username}`)
    let user = await db.get(statement)
    return {
        ...user,
        admin: user.admin == 1
    }
}

/**
 * Invalidate all refresh tokens user have invoked
 * @param req database request to get user
 * @returns user fetched from db with wrong tokenRevision
 */
export async function invalidateTokens(req: UserDBRequest): Promise<User | null> {
    let user = await getUser(req)
    let db = await dbPromise
    if (user){
        await db.run(SQL`UPDATE USERS SET tokenRevision=${++user.tokenRevision} WHERE id=${user.id}`)
        return user
    }
    return null
}

export function getTags(id: number): Promise<Tag>
export function getTags(): Promise<Tag[]>
export function getTags(id?: number): Promise<Tag | Tag[]>
export async function getTags(id?: number): Promise<Tag | Tag[]> {
    let hasId = typeof id !== "undefined"
    let db = await dbPromise
    if (hasId) {
        return await db.get(SQL`SELECT * FROM Tags WHERE id=${id}`)
    } else {
        return await db.all(SQL`SELECT * FROM Tags`)
    }
}

export async function register(username: string, password: string): Promise<User> {
    let user = await getUser({username})
    if (user) throw new Error("User already exists")
    let db = await dbPromise
    let passwordHash = generate(password, {algorithm: "sha256"})
    db.run(SQL`INSERT INTO USERS (username, hash) VALUES (${username}, ${passwordHash})`)
    let newUser = await getUser({username})
    if (!newUser) throw new Error("Welp, something definately went wrong. User was not created upon request")
    return newUser
}

export async function evalQuery(query: SQLStatement): Promise<any> {
    return (await dbPromise).run(query)
}

export async function putOrder(order: Order): Promise<void> {
    let db = await dbPromise
    await db.run(SQL`INSERT INTO Destinations (name, address, email, phone) VALUES (${order.name, order.address, order.email || null, order.phone || null})`)
    let destinationID = await db.get(SQL`SELECT last_insert_rowid() FROM Destinations`)
    let statement = SQL`INSERT INTO ORDERS (itemId, destID, count) VALUES `
    order.products.forEach(order => {
        statement.append(SQL` (${order.id}, ${destinationID}, ${order.count})`)
    })
    await db.run(statement)
}