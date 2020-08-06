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

    if (!req.headers["authorization"]) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid authorization",
        });
        return;
    }

    let authorization = req.headers["authorization"];

    if (!authorization.includes(" ")) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid authorization",
        });
        return;
    }

    let authorizationSplits = authorization.split(" ");

    let Bearer = authorizationSplits[0];
    let token = authorizationSplits[1];
    
    if (Bearer != "Bearer") {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid authorization",
        });
        return;
    }

    let currentTime = zuluNow();

    let obj = { expires_at: currentTime, updated_at: currentTime };

    const { data, error } = await sessionSignout(token, obj);

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
