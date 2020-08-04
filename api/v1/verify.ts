import { NowRequest, NowResponse } from "@vercel/node";
import { getVerificationRequestByPollId } from "../../data/verificationRequest";

import { getSessionByUserId } from "../../data/session";
import { forbiddenRequest, serverError, okRequest, authRequestType, authRequestHeaderContentType } from "../../constants";
import { zuluNowIsBeforeZuluParse, zuluNowIsAfterZuluParse } from "../../utils/helper";

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

    if (!req.body.poll_id) {
        res.statusCode = forbiddenRequest
        res.send({
            message: "Please Insert Poll Id",
        });
        return;
    }

    const { data, error } = await getVerificationRequestByPollId(req.body.poll_id);

    if (error || !data) {
        res.statusCode = serverError
        res.send({ message: "No Data From Api" })
        return
    }

    if (zuluNowIsBeforeZuluParse(data.expires_at)) {
        res.send({
            verification_status: "Expired",
            token: null
        })
        return
    }

    if (!data.is_verified && zuluNowIsAfterZuluParse(data.expires_at)) {
        res.send({
            verification_status: "Pending",
            token: null
        })
        return
    }

    if (data.is_verified && zuluNowIsAfterZuluParse(data.expires_at)) {
        const session = await getSessionByUserId(data.user.id)

        if (session.error) {
            res.send({ message: "Error while Creating Session" })
            return
        }

        if (!session.data) {
            res.send({ message: "No Session for this User" })
            return
        }

        res.statusCode = okRequest
        res.send({
            verification_status: "Verified",
            token: session.data.token
        })
        return
    }
}