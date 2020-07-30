import { NowRequest, NowResponse } from "@vercel/node";

export default function (req: NowRequest, res: NowResponse) {

    if (req.method === "POST") {
        if(req.headers.token && req.headers.token !== ""){
            res.statusCode = 200
            res.send({
                message:"Logout Succesfully"
            })
            return 
        }
        res.statusCode = 404
        res.send({
          message: "Token Not Found",
        });
        return;
    }
    if(req.method === "GET"){
        res.statusCode = 200
        res.send({
            message: "GET method",
        });
        return
    }
}