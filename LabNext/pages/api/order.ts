import { NextApiRequest, NextApiResponse } from "next"
import { Order } from "../../src/shared/components"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let {products, phone, name, address, email} = JSON.parse(req.body) as Order
        if (!name) throw new Error("Name is required")
        if (!phone && !email) throw new Error("Either phone number nor email is provided")
        if (!address) throw new Error("Address is not provided")
        if (!products) throw new Error("No products provided")
        if (products.length == 0) throw new Error("Empty products list")

        
    } catch (e) {

    }
}