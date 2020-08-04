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

    let output = { data: null, error: null };
    await fetcher(query, variables)
        .then((data) => {
            if (
                data.verification_request &&
                data.verification_request.length > 0
            ) {
                output.data = data.verification_request[0];
            }
        })
        .catch((error) => {
            console.log("getVerificationRequestByUserId", error);
            output.error = error;
        });
    return output;
};

export const getVerificationRequestByToken: any = async (
    token: string | string[]
) => {
    const query = `query ($token: uuid!) {
        verification_request(where: {verification_token: {_eq: $token}}, order_by: {created_at: desc}, limit: 1) {
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
    const variables = { token: token };

    let output = { data: null, error: null };
    await fetcher(query, variables)
        .then((data) => {
            if (
                data.verification_request &&
                data.verification_request.length > 0
            ) {
                output.data = data.verification_request[0];
            }
        })
        .catch((error) => {
            console.log("getVerificationRequestByToken", error);
            output.error = error;
        });
    return output;
};

export const getVerificationRequestByPollId: any = async (
    pollId: string | string[]
) => {
    const query = `query ($pollId: uuid!) {
        verification_request(where: {poll_id: {_eq: $pollId}}, order_by: {created_at: desc}, limit: 1) {
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
    const variables = { pollId: pollId };

    let output = { data: null, error: null };
    await fetcher(query, variables)
        .then((data) => {
            if (
                data.verification_request &&
                data.verification_request.length > 0
            ) {
                output.data = data.verification_request[0];
            }
        })
        .catch((error) => {
            console.log("getVerificationRequestByPollId", error);
            output.error = error;
        });
    return output;
};

export const insertOneVerificationRequest: any = async (insertObj) => {
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
        oneVerificationRequest: insertObj,
    };

    let output = { data: null, error: null };
    await mutator(mutation, variables)
        .then((data) => {
            if (data.insert_verification_request_one) {
                output.data = data.insert_verification_request_one;
            }
        })
        .catch((error) => {
            console.log("insertOneVerificationRequest", error);
            output.error = error;
        });
    return output;
};

export const updateVerificationRequestByPk: any = async (
    verificationId,
    setObj
) => {
    const mutation = `mutation($verificationId : bigint!, $setVerificationRequest : verification_request_set_input!) {
        update_verification_request_by_pk(pk_columns: {id: $verificationId}, _set: $setVerificationRequest) {
            id
            poll_id
            verification_token
            user_id
            user {
                id
                email
                name
                image
                email_verified
                is_enabled
                role
                created_at
                updated_at
            }
            expires_at
            mode
            is_verified
            created_at
            updated_at
        }
    }`;
    const variables = {
        verificationId: verificationId,
        setVerificationRequest: setObj,
    };

    let output = { data: null, error: null };
    await mutator(mutation, variables)
        .then((data) => {
            if (data.update_verification_request_by_pk) {
                output.data = data.update_verification_request_by_pk;
            }
        })
        .catch((error) => {
            console.log("updateVerificationRequestByPk", error);
            output.error = error;
        });
    return output;
};
