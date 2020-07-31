import { NowRequest, NowResponse } from "@vercel/node";

export default async function (req: NowRequest, res: NowResponse) {
    const { name = "World" } = req.query;
    res.send(`Hello ${name}`);
}
