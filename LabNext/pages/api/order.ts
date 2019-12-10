import { NextApiRequest, NextApiResponse } from "next"
import { Order } from "../../src/shared/components"
import { putOrder } from "../../src/api/db"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Content-Type", "application/json")
    try {
        let order = JSON.parse(req.body) as Order
        if (!order.name) throw new Error("Name is required")
        if (!order.phone && !order.email) throw new Error("Either phone number nor email is provided")
        if (!order.address) throw new Error("Address is not provided")
        if (!order.products) throw new Error("No products provided")
        if (Object.keys(order.products).length == 0) throw new Error("Empty products list")
        if (order.phone && !/^\+380\d{9}$/.test(order.phone)) throw new Error("Wrong phone format")
        if (order.email && !/^\w+@\w+\.\w+$/.test(order.email)) throw new Error("Wrong email format")

        let id = await putOrder(order)
        res.end(JSON.stringify({ id }))
    } catch (error) {
        res.statusCode = 500
        res.end(JSON.stringify({ error: error.message }))
    }
}