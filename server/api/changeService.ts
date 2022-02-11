import { useBody } from "h3";

export default async (req, res) => {
    await new Promise((resolve) => setTimeout(() => { resolve() }, 1000))

    return {
        ...await useBody(req)
    }
}
