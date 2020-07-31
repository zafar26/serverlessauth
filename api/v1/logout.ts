import { NowRequest, NowResponse } from "@vercel/node";
import { userLogOut } from "../../data/session";
import { zonedTimeToUtc } from "date-fns-tz";

export default async function (req: NowRequest, res: NowResponse) {

    if (req.method === "POST") {
        if(req.headers.token && req.headers.token !== ""){
            let dateTime = zonedTimeToUtc(new Date(), "Asia/Kolkata")
            let obj = { expires_at: dateTime, updated_at: dateTime }
            const data = await userLogOut(req.body.user_id, req.headers.token, obj )
            if(data=== null ){
                res.statusCode = 400
                res.send({ message:"Logout Failed" })
                return 
            }
            res.statusCode = 200
            res.send({ message:"Succesfully Logout" })
            return
        }
        res.statusCode = 403
        res.send({
          message: "Please Provide Token",
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