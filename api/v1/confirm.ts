import { NowRequest, NowResponse } from "@vercel/node";
import {
    getVerificationRequestByToken,
    updateVerificationRequestByPk,
} from "../../data/verificationRequest";
import {
    forbiddenRequest,
    validSignupMode,
    validSigninMode,
    emailRegex,
    confirmRequestType,
    okRequest,
} from "../../constants";
import { updateUserByPk } from "../../data/user";
import { insertOneSession } from "../../data/session";
import { signJWToken } from "../../utils/jwt";
import { zuluNow, zuluNowIsAfterZuluParse } from "../../utils/helper";

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

    const emailLowered = `${email}`.toLowerCase();

    // declare userId
    let userId = null;

    let user = null;

    let verifyUserEmail = false;

    // declare verificationId
    let verificationId = null;

    // get verification_request object from db
    const verificationRequestOutput = await getVerificationRequestByToken(
        token
    );
    let verificationRequest = verificationRequestOutput.data;
    let verificationRequestError = verificationRequestOutput.error;

    if (verificationRequestError) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid confirmation request",
        });
        console.log(
            "/confirm",
            "error occured while fetching verification request"
        );
        return;
    }

    // check verification_request existence in db
    if (!verificationRequest) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid confirmation request",
        });
        console.log("/confirm", "request not found");
        return;
    }

    verificationId = verificationRequest.id;
    user = verificationRequest.user;
    userId = user.id;

    // check mode of verification mode
    if (mode != verificationRequest.mode) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid confirmation request",
        });
        console.log("/confirm", "request mode is not similar");
        return;
    }

    // check request expiration
    if (zuluNowIsAfterZuluParse(verificationRequest.expires_at)) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid confirmation request",
        });
        console.log("/confirm", "request is expired");
        return;
    }

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
    if (emailLowered != user.email) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid confirmation request",
        });
        console.log("/confirm", "email not same");
        return;
    }
    // check user is_enabled
    if (!user.is_enabled) {
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
        if (!user.email_verified) {
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
        if (user.email_verified) {
            res.statusCode = forbiddenRequest;
            res.send({
                message: "invalid confirmation request",
            });
            console.log("/confirm", "email is already verified");
            return;
        } else {
            // set email_verified of user as true
            verifyUserEmail = true;
        }
    }

    // set current utc time
    let currentTime = zuluNow();

    // update verification_request expires_at, updated_at, and is_verified
    const updatedVerificationRequestOutput = await updateVerificationRequestByPk(
        verificationId,
        {
            updated_at: currentTime,
            expires_at: currentTime,
            is_verified: true,
        }
    );
    let updatedVerificationRequest = updatedVerificationRequestOutput.data;
    let updatedVerificationRequestError =
        updatedVerificationRequestOutput.error;

    if (updatedVerificationRequestError) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid confirmation request",
        });
        console.log(
            "/confirm",
            "error occured while updating verification request"
        );
        return;
    }

    // check verification request update
    if (!updatedVerificationRequest) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid confirmation request",
        });
        console.log("/confirm", "verification request not updated");
        return;
    }

    // assign updated value to verification request
    verificationRequest = updatedVerificationRequest;
    user = verificationRequest.user;

    // check email verified for signup mode
    if (verifyUserEmail) {
        // set current utc time
        currentTime = zuluNow();

        // update user updated_at, email_verified
        const updatedUserOutput = await updateUserByPk(userId, {
            updated_at: currentTime,
            email_verified: verifyUserEmail,
        });
        let updatedUser = updatedUserOutput.data;
        let updatedUserError = updatedUserOutput.error;

        if (updatedUserError) {
            res.statusCode = forbiddenRequest;
            res.send({
                message: "invalid confirmation request",
            });
            console.log("/confirm", "error occured while updating user");
            return;
        }

        if (!updatedUser) {
            res.statusCode = forbiddenRequest;
            res.send({
                message: "invalid confirmation request",
            });
            console.log("/confirm", "user not updated");
            return;
        }

        user = updatedUser;
    }

    // generate jwt token with jose
    const { JWToken, sessionExpiresAt } = signJWToken(email, user);

    // insert session with user_id, token, expires_at and remaining with default values
    const insertedSessionOutput = await insertOneSession({
        user_id: userId,
        request_id: verificationId,
        token: JWToken,
        expires_at: sessionExpiresAt,
    });
    let insertedSession = insertedSessionOutput.data;
    let insertedSessionError = insertedSessionOutput.error;

    if (insertedSessionError) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid confirmation request",
        });
        console.log("/confirm", "error occured while inserting session");
        return;
    }

    // check session insertion
    if (!insertedSession) {
        res.statusCode = forbiddenRequest;
        res.send({
            message: "invalid confirmation request",
        });
        console.log("/confirm", "session not inserted");
        return;
    }

    res.statusCode = okRequest;
    res.send({
        message: "success",
    });
    return;
};
