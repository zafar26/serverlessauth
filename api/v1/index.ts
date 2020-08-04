import { NowRequest, NowResponse } from "@vercel/node";
import { okRequest } from "../../constants";

export default function (req: NowRequest, res: NowResponse) {
    res.statusCode = okRequest;
    res.send({
        message: "success",
    });
}
