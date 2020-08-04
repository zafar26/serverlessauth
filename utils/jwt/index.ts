import { JWT } from "jose";
import { sessionExpiryHours, sessionExpiryInWords } from "../../constants";
import { addHoursToZuluNow } from "../helper";

export const signJWToken = (email, user) => {
    const key = process.env.key;

    const header = {
        alg: process.env.alg,
        typ: "JWT",
    };

    const options = {
        expiresIn: sessionExpiryInWords,
        header: header,
    };

    const sessionExpiresAt = addHoursToZuluNow(sessionExpiryHours);

    const payload = {
        expires_at: sessionExpiresAt,
        role: user.role,
        email: email,
        name: user.name,
        userId: user.id,
        "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": [
                process.env.allowedRole1,
                process.env.allowedRole2,
            ],
            "x-hasura-default-role": process.env.defaultRole,
        },
    };

    const JWToken = JWT.sign(payload, key, options);

    return {
        JWToken: JWToken,
        sessionExpiresAt: sessionExpiresAt,
    };
};
