import { NowRequest, NowResponse } from "@vercel/node";
import { getVerificationRequestByToken } from "../../data/verificationRequest";
import {
    forbiddenRequest,
    validSignupMode,
    validSigninMode,
    emailRegex,
    confirmRequestType,
    okRequest,
} from "../../constants";

export default async (req: NowRequest, res: NowResponse) => {
    // check the request method
    if (req.method != confirmRequestType) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid request method",
        });
        console.log("/confirm", "invalid request method");
        return;
    }

    // check for required data in request query
    if (!req.query.email || !req.query.token || !req.query.mode) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "required data is missing in request query",
        });
        console.log("/confirm", "invalid request method");
        return;
    }

    // deconstruct required data from request query
    const { email, mode, token } = req.query;

    // check mode value
    if (mode != validSignupMode && mode != validSigninMode) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid confirmation request",
        });
        console.log("/confirm", "invalid mode");
        return;
    }

    // check email syntax with regex
    if (!emailRegex.test(email.toString())) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid confirmation request",
        });
        console.log("/confirm", "invalid email syntax");
        return;
    }

    // get verification_request object from db
    const verificationRequest = await getVerificationRequestByToken(
        token,
        mode
    );

    // check verification_request existence in db
    if (verificationRequest) {
        // check request expiration
        // this block is buggy, need to fix this
        // if (isAfter(new Date(), verificationRequest.expires_at))) {
        //     res.statusCode = forbiddenRequest;
        //     res.send({
        //         message: "invalid confirmation request",
        //     });
        //     console.log("/confirm", "request is already expired");
        //     return;
        // }

        // check request verification
        if (verificationRequest.is_verified) {
            res.statusCode = forbiddenRequest;
            res.send({
                message: "invalid confirmation request",
            });
            console.log("/confirm", "request is already verified");
            return;
        }

        // check email of verification_request user
        if (email == verificationRequest.user.email) {
            // check user is_enabled
            if (!verificationRequest.user.is_enabled) {
                res.statusCode = forbiddenRequest;
                res.send({
                    message: "invalid confirmation request",
                });
                console.log("/confirm", "user is disabled");
                return;
            }

            // check signin mode
            if (mode == validSigninMode) {
                // check email_verified
                if (!verificationRequest.user.email_verified) {
                    res.statusCode = forbiddenRequest;
                    res.send({
                        message: "invalid confirmation request",
                    });
                    console.log("/confirm", "email not verified");
                    return;
                }
            }

            // check signup mode
            if (mode == validSignupMode) {
                // check email_verified
                if (verificationRequest.user.email_verified) {
                    res.statusCode = forbiddenRequest;
                    res.send({
                        message: "invalid confirmation request",
                    });
                    console.log("/confirm", "email is already verified");
                    return;
                }

                // set email_verified of user as true
                const emailVerified = true;

                // update user email_verified, updated_at
            }
        } else {
            res.statusCode = forbiddenRequest;
            res.send({
                message: "invalid confirmation request",
            });
            console.log("/confirm", "email not same");
            return;
        }
    } else {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid confirmation request",
        });
        console.log("/confirm", "request not found");
        return;
    }

    // update verification_request expires_at, updated_at, and is_verified
    // generate jwt token
    // insert row in session

    res.statusCode = okRequest;
    res.send({ message: "success" });
    return;
};
