import sqlite, { Database } from "sqlite";
import { StoreItem, User, Tag, Order, PlacedOrder } from "../shared/components";
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
 * @param param.from path to a file with sql statements to be executed. Optional
 *                   COMMENTS IN QUERRY WILL THROW AN ERROR
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
        await db.exec(confstr)
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

export function has<T>(val: T | undefined): boolean {
    return typeof val !== "undefined"
}

export function withLimit(statement: SQLStatement, limit?: number, offset?: number) {
    let hasLimit = has(limit)
    let hasOffset = has(offset)
    if (hasLimit) {
        statement = statement.append(SQL` LIMIT ${limit}`)
        if (hasOffset) statement = statement.append(SQL` OFFSET ${offset}`)
    } else {
        if (hasOffset) statement = statement.append(SQL` LIMIT -1 OFFSET ${offset}`)
    }
    return statement
}

export interface Limited {
    limit?: number;
    offset?: number;
}

interface ItemDBRequest extends Limited {
    tag?: number;
    id?: number;
    limit?: number;
    offset?: number;
}

export async function getItems({ tag, id, limit, offset }: ItemDBRequest): Promise<StoreItem[]> {
    let hasTag = has(tag)
    let hasId = has(id)
    let db = await dbPromise
    let statement: SQLStatement
    if (hasTag) {
        statement = SQL`
            SELECT id, name, price, rating, stock, description, prevprice, bias 
            FROM Items 
            JOIN ItemTags 
            ON Items.id == ItemTags.itemID 
            WHERE ItemTags.tagID = ${tag}`
    } else {
        statement = SQL`SELECT * FROM Items`
        if (hasId) statement = statement.append(SQL` WHERE id=${id}`)
    }
    let items = await db.all(withLimit(statement, limit, offset))
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
    let hasId = has(id)
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

export async function getUsers({limit, offset} : Limited): Promise<User[]> {
    let db = await dbPromise
    return db.all(withLimit(SQL`SELECT * FROM Users`, limit, offset))
}

/**
 * Invalidate all refresh tokens user have invoked
 * @param req database request to get user
 * @returns user fetched from db with wrong tokenRevision
 */
export async function invalidateTokens(req: UserDBRequest): Promise<void> {
    let hasId = typeof req.id !== "undefined"
    if (!hasId || !req.username) throw new Error("No id or username is provided to invalidate token")
    let db = await dbPromise

    let statement = SQL`UPDATE Users SET tokenRevision = tokenRevision + 1 WHERE`
    if (hasId) statement = statement.append(SQL` id=${req.id}`)
    if (req.username) statement = statement.append(SQL` username=${req.username}`)
    await db.run(statement)
}

export async function getTags(id?: number): Promise<Tag[]> {
    let hasId = typeof id !== "undefined"
    let db = await dbPromise
    if (hasId) {
        return await db.all(SQL`SELECT * FROM Tags WHERE id=${id}`)
    } else {
        return await db.all(SQL`SELECT * FROM Tags`)
    }
}

export async function register(username: string, password: string): Promise<User> {
    let user = await getUser({ username })
    if (user) throw new Error("User already exists")
    let db = await dbPromise
    let passwordHash = generate(password, { algorithm: "sha256" })
    db.run(SQL`INSERT INTO USERS (username, hash) VALUES (${username}, ${passwordHash})`)
    let newUser = await getUser({ username })
    if (!newUser) throw new Error("Welp, something definately went wrong. User was not created upon request")
    return newUser
}

export async function evalQuery(query: SQLStatement): Promise<any> {
    return (await dbPromise).run(query)
}

export async function putOrder(order: Order): Promise<number> {
    let db = await dbPromise
    let stock = await Promise.all(Object.keys(order.products).map(id =>
        db.get(SQL`SELECT id, stock FROM Items WHERE id=${id}`)
    ))
    // It kinda bothers me that JS .map is not lazy evaluated :sadface:
    let viable = Object.entries(order.products)
        .map(([id, count], index) => stock[index].stock - count)
        .map(remains => remains >= 0)
        .reduce((acc, cur) => acc && cur)
    if (!viable) throw new Error("Not enought stock to satisfy request")
    await db.run(
        SQL`INSERT INTO Orders (name, address, email, phone) 
        VALUES (${order.name, order.address, order.email || null, order.phone || null});`)
    let orderID = await db.get(SQL`SELECT last_insert_rowid() FROM Orders`)
    let statement = SQL`INSERT INTO ItemOrders (itemId, orderID, count) VALUES `
    Object.entries(order.products).forEach(([id, count]) => {
        statement.append(SQL` (${id}, ${orderID}, ${count})`)
    })
    await db.run(statement)
    await db.run(
        SQL`UPDATE Items 
        SET stock = stock - (
            SELECT count FROM Orders WHERE itemID = Items.id AND orderID = ${orderID}
        ) 
        WHERE id IN (
            SELECT itemID FROM Orders WHERE orderID = ${orderID}
        )`)
    return orderID
}

export async function confirmOrder(id: number): Promise<void> {
    let db = await dbPromise
    await Promise.all([
        db.run(SQL`DELETE FROM ItemOrders WHERE orderID=${id}`),
        db.run(SQL`DELETE FROM Orders WHERE id=${id}`)
    ])
}

interface OrderDBRequest extends Limited {
    id?: number;
}
export async function getOrders({id, limit, offset}: OrderDBRequest): Promise<PlacedOrder[]> {
    let db = await dbPromise
    let statement = SQL`SELECT * FROM Orders`
    if (has(id)) statement = statement.append(SQL` WHERE id=${id}`)
    let orders = await db.all(withLimit(statement, limit, offset))
    let itemOrders = await Promise.all(orders.map(order => 
        db.all(
            SQL`SELECT Items.id, name, price, rating, stock, description, prevprice, bias, count 
            FROM ItemOrders 
            JOIN Items 
            ON Items.id = ItemOrders.itemID 
            WHERE ItemOrders.orderID = ${order.id}`)
    ))
    return orders.map<PlacedOrder>((order, index) => ({
        ...order,
        products: itemOrders[index]
    }))
}

export async function query(querry: SQLStatement) {
    return (await dbPromise).all(querry)
}