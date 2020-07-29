import { mutator, fetcher } from "../utils/graphql";

export const getVerificationRequestByUserId: any = async (userId: number) => {
    const query = `query ($userId : bigint!){
        verification_request(where: {user_id: {_eq: $userId}}, order_by: {created_at: desc}, limit: 1) {
            id
            poll_id
            user_id
            mode
            verification_token
            is_verified
            expires_at
            updated_at
            created_at
        }
    }`;

    const variables = { userId: userId };
    let output = null;
    await fetcher(query, variables)
        .then((data) => {
            if (
                data.verification_request &&
                data.verification_request.length > 0
            ) {
                output = data.verification_request[0];
            }
        })
        .catch((error) => {
            console.log(
                "getVerificationRequestByUserId",
                error.response.errors
            );
        });
};

export const getVerificationRequestByToken: any = async (
    token: string | string[],
    mode: string | string[]
) => {
    const query = `query ($token: uuid!, $mode :String!) {
        verification_request(where: {verification_token: {_eq: $token}, _and: {mode: {_eq: $mode}}}, order_by: {created_at: desc}, limit: 1) {
            id
            verification_token
            mode
            is_verified
            expires_at
            user_id
            user {
                id
                email
                email_verified
                is_enabled
                role
                name
                image
                created_at
                updated_at
            }
            poll_id
            created_at
            updated_at
        }
    }`;

    const variables = { token: token, mode: mode };
    let output = null;
    await fetcher(query, variables)
        .then((data) => {
            if (
                data.verification_request &&
                data.verification_request.length > 0
            ) {
                output = data.verification_request[0];
            }
        })
        .catch((error) => {
            console.log("getVerificationRequestByToken", error.response.errors);
        });
    return output;
};

export const insertOneVerificationRequest: any = async (obj) => {
    const mutation = `mutation ($oneVerificationRequest : verification_request_insert_input!) {
        insert_verification_request_one(object: $oneVerificationRequest) {
                id
                poll_id
                user_id
                mode
                verification_token
                is_verified
                expires_at
                updated_at
                created_at
            }
        }`;

    const variables = {
        oneVerificationRequest: obj,
    };
    let output = null;
    await mutator(mutation, variables)
        .then((data) => {
            if (data.insert_verification_request_one) {
                output = data.insert_verification_request_one;
            }
        })
        .catch((error) => {
            console.log("insertOneVerificationRequest", error.response.errors);
        });
    return output;
};
