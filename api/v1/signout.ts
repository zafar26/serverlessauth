import { NowRequest, NowResponse } from "@vercel/node";
import { sessionSignout } from "../../data/session";
import {
    forbiddenRequest,
    serverError,
    clientError,
    okRequest,
    signoutRequestType,
    signoutRequestHeaderContentType,
} from "../../constants";
import { zuluNow } from "../../utils/helper";

export default async function (req: NowRequest, res: NowResponse) {
    if (req.method != signoutRequestType) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid request method",
        });
        return;
    }

    if (req.headers["content-type"] != signoutRequestHeaderContentType) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid request header content-type",
        });
        return;
    }

    if (!req.headers.token) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "Please Provide Token",
        });
        return;
    }

    const token = req.headers.token;

    // check request body data
    if (!req.body) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "got empty request body",
        });
        return;
    }

    if (!req.body.id) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "missing required data in request body",
        });
        return;
    }

    const { UserId } = req.body;

    let currentTime = zuluNow();

    let obj = { expires_at: currentTime, updated_at: currentTime };

    const { data, error } = await sessionSignout(UserId, token, obj);

    if (error) {
        res.statusCode = serverError;
        res.send({ message: "Signout Failed" });
        return;
    }

    if (!data) {
        res.statusCode = clientError;
        res.send({ message: "Signout Failed" });
        return;
    }

    res.statusCode = okRequest;
    res.send({ message: "success" });
    return;
}
