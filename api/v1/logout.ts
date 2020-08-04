import { NowRequest, NowResponse } from "@vercel/node";
import { userLogOut } from "../../data/session";
import { forbiddenRequest, serverError, clientError, okRequest, authRequestHeaderContentType, authRequestType } from '../../constants'
import { zuluNow } from "../../utils/helper";

export default async function (req: NowRequest, res: NowResponse) {

    if (req.method != authRequestType) {
        res.statusCode = forbiddenRequest
        res.send({
            message: "invalid request method",
        });
        console.log("/confirm", "invalid request method");
        return;
    }

    if (req.headers["content-type"] != authRequestHeaderContentType) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid request header content-type",
        });
        return;
    }

    if (!req.headers.token) {
        res.statusCode = forbiddenRequest
        res.send({
            message: "Please Provide Token",
        });
        return;
    }

    // check request body data
    if (!req.body) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "got empty request body",
        });
        return;
    }

    let dateTime = zuluNow()
    let obj = { expires_at: dateTime, updated_at: dateTime }
    const { data, error } = await userLogOut(req.body.user_id, req.headers.token, obj)

    if (error) {
        res.statusCode = serverError
        res.send({ message: "Logout Failed" })
        return
    }
    if (!data) {
        res.statusCode = clientError
        res.send({ message: "Logout Failed" })
        return
    }
    res.statusCode = okRequest
    res.send({ message: "Succesfully Logout" })
    return
}

