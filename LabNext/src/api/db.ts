import sqlite, { Database } from "sqlite";
import { StoreItem, User, Tag, Order } from "../shared/components";
import { generate } from "password-hash";
import { readFile } from "fs";
import SQL, { SQLStatement } from "sql-template-strings";

export const dbPromise = initDB({
    dbLocation: "fastshop.db",
    from: "./src/api/configuration.sql",
    withAdmin: {
        username: process.env.NEXT_SERVER_ADMIN_USERNAME || "admin",
        password: process.env.NEXT_SERVER_ADMIN_PASSWORD || "admin"
    }
})

/**
 * Initialize database with configs to a file
 * @param param.dbLocation path to a db file. Defaults to `:memory:` (in-memory database)
 * @param param.from path to a file with sql statements to be executed in concurently
 *             seperated by semicolons. Optional
 * @param param.withAdmin if provided initial admin user is created on start
 */
async function initDB({ dbLocation = ":memory:", from, withAdmin }: {
    dbLocation?: string
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
        [db, confstr] = await Promise.all([sqlite.open(dbLocation), strPromise])
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
        db = await sqlite.open(dbLocation)
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