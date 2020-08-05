import { NowRequest, NowResponse } from "@vercel/node";
import { getVerificationRequestByPollId } from "../../data/verificationRequest";

import { getSessionByRequestId } from "../../data/session";
import {
    forbiddenRequest,
    serverError,
    okRequest,
    verifyRequestType,
    verifyRequestHeaderContentType,
} from "../../constants";
import { zuluNowIsAfterZuluParse } from "../../utils/helper";

export default async function (req: NowRequest, res: NowResponse) {
    if (req.method != verifyRequestType) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid request method",
        });
        return;
    }

    if (req.headers["content-type"] != verifyRequestHeaderContentType) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid request header content-type",
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

    if (!req.body.pollId) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "required data is missing in request body",
        });
        return;
    }

    const { pollId } = req.body;

    const { data, error } = await getVerificationRequestByPollId(pollId);

    if (error) {
        res.statusCode = serverError;
        res.send({
            message: "Error occured while fetching verifiction request",
        });
        return;
    }

    if (!data) {
        res.statusCode = forbiddenRequest;
        res.send({ message: "verification request not found" });
        return;
    }

    if (!data.is_verified) {
        if (zuluNowIsAfterZuluParse(data.expires_at)) {
            res.statusCode = okRequest;
            res.send({
                message: "success",
                verification_status: "Expired",
                token: null,
            });
            return;
        } else {
            res.statusCode = okRequest;
            res.send({
                message: "success",
                verification_status: "Pending",
                token: null,
            });
            return;
        }
    }
    const sessionOutput = await getSessionByRequestId(data.id);
    let session = sessionOutput.data;
    let sessionError = sessionOutput.error;

    if (sessionError) {
        res.statusCode = serverError;
        res.send({ message: "Error occured while inserting session" });
        return;
    }

    if (!session) {
        res.statusCode = forbiddenRequest;
        res.send({ message: "no session found" });
        return;
    }

    if (zuluNowIsAfterZuluParse(session.expires_at)) {
        res.statusCode = forbiddenRequest;
        res.send({ message: "session expired" });
        return;
    }

    res.statusCode = okRequest;
    res.send({
        message: "success",
        verification_status: "Verified",
        token: session.token,
    });
    return;
}
