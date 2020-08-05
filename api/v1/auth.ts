import { NowRequest, NowResponse } from "@vercel/node";
import { mailer } from "../../utils/mailer";
import { getUserByEmail, insertOneUser } from "../../data/user";
import {
    getVerificationRequestByUserId,
    insertOneVerificationRequest,
} from "../../data/verificationRequest";
import {
    forbiddenRequest,
    authRequestHeaderContentType,
    validSigninMode,
    validSignupMode,
    emailRegex,
    okRequest,
    authRequestType,
    verificationRequestExpiryMinutes,
    forProject,
    serverError,
} from "../../constants";
import {
    addMinutesToZuluNow,
    zuluNowIsBeforeZuluParse
} from "../../utils/helper";

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

    // convert email to lowercase for avoiding case sensitive issues
    const emailLowered = `${email}`.toLowerCase();

    // declare userId
    let userId = null;

    // get user object from db
    const userOutput = await getUserByEmail(emailLowered);
    let user = userOutput.data;
    let userError = userOutput.error;

    // check userError occurence
    if (userError) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "error occured while fetching user data",
        });
        return;
    }

    if (mode == validSigninMode) {
        // user existence in db
        if (!user) {
            res.statusCode = forbiddenRequest;
            res.send({
                message: "user not found, send request for signup first",
            });
            return;
        }

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
                message: "user cant signin, complete signup verification first",
            });
            return;
        }

        // assign userId
        userId = user.id;
    }

    if (mode == validSignupMode) {
        // check user existence in db
        if (!user) {
            // insert user with just email and remaining with default data
            const insertedUserOutput = await insertOneUser({
                email: emailLowered,
            });
            let insertedUser = insertedUserOutput.data;
            let insertedUserError = insertedUserOutput.error;

            if (insertedUserError) {
                res.statusCode = forbiddenRequest;
                res.send({
                    message: "error occured while inserting user data",
                });
                return;
            }

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
        } else {
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
        }
    }

    // get verification_request object from db
    const verificationRequestOutput = await getVerificationRequestByUserId(
        userId
    );
    let verificationRequest = verificationRequestOutput.data;
    let verificationRequestError = verificationRequestOutput.error;

    if (verificationRequestError) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "error occured while fetching previous request data",
        });
        return;
    }

    // check verification_request existence in db
    if (verificationRequest) {
        // check previous request expiration
        if (zuluNowIsBeforeZuluParse(verificationRequest.expires_at)) {
            res.statusCode = forbiddenRequest;
            res.send({
                message: "unexpired request exists",
            });
            return;
        }
    }

    // set verification request expire_at
    const verificationRequestExpiresAt = addMinutesToZuluNow(
        verificationRequestExpiryMinutes
    );

    // insert verification_request with user_id, mode, expires_at and remaining with default data
    const insertedVerificationRequestOutput = await insertOneVerificationRequest(
        {
            user_id: userId,
            mode: mode,
            expires_at: verificationRequestExpiresAt,
        }
    );

    let insertedVerificationRequest = insertedVerificationRequestOutput.data;
    let insertedVerificationRequestError =
        insertedVerificationRequestOutput.error;

    if (insertedVerificationRequestError) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "error occured while inserting verification request",
        });
        return;
    }

    // check insertion of verification request
    if (!insertedVerificationRequest) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "verification request not inserted",
        });
        return;
    }

    // assign verification_token
    const token = insertedVerificationRequest.verification_token;

    // send email with confirmation link
    const mailerOutput = await mailer(
        email,
        mode,
        `${process.env.site}/api/v1/confirm?email=${email}&mode=${mode}&token=${token}`,
        forProject
    );

    if (mailerOutput.error) {
        res.statusCode = serverError;
        res.send({
            message: "Error Occured while sending email",
        });
        return;
    }

    res.statusCode = okRequest;
    res.send({
        message: "success",
    });
    return;
};
