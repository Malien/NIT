import { get } from "https";

export class FetchResponse {
    data: any;
    constructor(data) {
        this.data = data
    }
    async json() {
        return JSON.parse(this.data)
    }
}

export function fetch(url: string): Promise<FetchResponse> {
    return new Promise((resolve, reject) => {
        get(url, (res) => {
            let data = ""
            if (res.statusCode == 200) {
                res.on("data", (chunk) => {
                    data += chunk
                })
                res.on("end", () => {
                    try {
                        resolve(new FetchResponse(data))
                    } catch (e) {
                        reject(e)
                    }
                })
            } else reject(res.statusCode)
        }).on("error", reject) 
    })
}