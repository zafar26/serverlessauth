import { NowRequest, NowResponse } from "@vercel/node";
import { mailer } from "../../utils/mailer";
import { getUserByEmail, insertOneUser } from "../../data/user";
import {
    getVerificationRequestByUserId,
    insertOneVerificationRequest,
} from "../../data/verificationRequest";
import { isBefore, addMinutes, parseISO } from "date-fns";
import { zonedTimeToUtc, format, utcToZonedTime } from "date-fns-tz";
import {
    forbiddenRequest,
    authRequestHeaderContentType,
    validSigninMode,
    validSignupMode,
    emailRegex,
    okRequest,
    authRequestType,
} from "../../constants";

export default async (req: NowRequest, res: NowResponse) => {
    // check the request method
    if (req.method != authRequestType) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid request method",
        });
        return;
    }

    // check request header content_type
    if (req.headers["content-type"] != authRequestHeaderContentType) {
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

    // check email field in request body
    if (!req.body.email || !req.body.mode) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "required data is missing in request body",
        });
        return;
    }

    // deconstruct required data from request body
    const { email, mode } = req.body;

    // check mode value
    if (req.body.mode != validSigninMode && req.body.mode != validSignupMode) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid mode in request body",
        });
        return;
    }

    // check email syntax with regex
    if (!emailRegex.test(email)) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid email syntax in request body",
        });
        return;
    }

    // get user object from db
    const user = getUserByEmail(email);

    // declare userId
    let userId = null;

    if (mode == validSigninMode) {
        // user existence in db
        if (user) {
            // check user is_enabled
            if (!user.is_enabled) {
                res.statusCode = forbiddenRequest;
                res.send({
                    message: "user is disabled for suspicious actions",
                });
                return;
            }

            // check completion of user signup verification
            if (!user.email_verified) {
                res.statusCode = forbiddenRequest;
                res.send({
                    message:
                        "user cant signin, complete signup verification first",
                });
                return;
            }

            // assign userId
            userId = user.id;
        } else {
            res.statusCode = forbiddenRequest;
            res.send({
                message: "user not found, send request for signup first",
            });
            return;
        }
    }

    if (mode == validSignupMode) {
        // check user existence in db
        if (user) {
            // check user is_enabled
            if (!user.is_enabled) {
                res.statusCode = forbiddenRequest;
                res.send({
                    message: "user is disabled for suspicious actions",
                });
                return;
            }

            // check user email verified
            if (user.email_verified) {
                res.statusCode = forbiddenRequest;
                res.send({
                    message: "user is already signedup, signin to get access",
                });
                return;
            }

            // assign userId
            userId = user.id;
        } else {
            // insert user with just email and remaining with default data
            const insertedUser = insertOneUser({
                email: email,
            });

            // check insertion of user
            if (!insertedUser) {
                res.statusCode = forbiddenRequest;
                res.send({
                    message: "user not inserted",
                });
                return;
            }

            // assign userId
            userId = insertedUser.id;
        }
    }

    // get verification_request object from db
    const verificationRequest = getVerificationRequestByUserId(userId);

    // check verification_request existence in db
    if (verificationRequest) {
        // check previous request verification
        if (!verificationRequest.is_verified) {
            res.statusCode = forbiddenRequest;
            res.send({
                message: "unverified request exists",
            });
            return;
        }

        // check previous request expiration
        // this block is buggy, need to fix this
        // if (isBefore(new Date(), verificationRequest.expires_at))) {
        //     res.statusCode = forbiddenRequest;
        //     res.send({
        //         message: "unexpired request exists",
        //     });
        //     return;
        // }
    }

    // insert verification_request with user_id, mode, expires_at and remaining with default data
    // const insertedVerificationRequest = insertOneVerificationRequest({
    //     user_id: userId,
    //     mode: mode,
    //     expires_at: zonedTimeToUtc(addMinutes(new Date(), 5), "Asia/Kolkata"),
    // });

    // check insertion of verification request
    // if (!insertedVerificationRequest) {
    //     res.statusCode = forbiddenRequest;
    //     res.send({
    //         message: "verification request not inserted",
    //     });
    //     return;
    // }

    // assign verification_token
    // const token = insertedVerificationRequest.verification_token;

    // send email with confirmation link
    // await mailer(
    //     email,
    //     mode,
    //     `http://localhost:3000/api/v1/confirm?email=${email}&mode=${mode}&token=${token}`,
    //     "demoauth"
    // );

    res.statusCode = okRequest;
    res.send({
        message: "success",
    });
    return;
};
