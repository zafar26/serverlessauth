import { mutator, fetcher } from "../utils/graphql";

export const getSessionByRequestId = async (requestId) => {
    const query = `query ($requestId: bigint!){
        session(where: {request_id: {_eq: $requestId}}, order_by: {created_at: desc}, limit: 1) {
            id
            token
            created_at
            expires_at
            user_id
        }
    }`;
    const variables = { requestId: requestId };

    let output = { data: null, error: null };
    await fetcher(query, variables)
        .then((data) => {
            if (data.session && data.session.length > 0) {
                output.data = data.session[0];
            }
        })
        .catch((error) => {
            console.log("getSessionByRequestId", error);
            output.error = error;
        });
    return output;
};

export const sessionSignout = async (userId, token, obj) => {
    const query = `mutation ($userId:bigint!,$token:String!, $setSession:session_set_input!){
        update_session(where: {user_id: {_eq: $userId}, _and: {token: {_eq:$token }}}, _set: $setSession) {
            affected_rows
            returning {
                id
                token
                expires_at
                created_at
                updated_at
                user_id
            }
        }
    }`;
    const variables = { userId, token: token, setSession: obj };

    let output = { data: null, error: null };
    await fetcher(query, variables)
        .then((data) => {
            if (
                data.update_session &&
                data.update_session.returning &&
                data.update_session.returning.length > 0
            ) {
                output.data = data.update_session.returning[0];
            }
        })
        .catch((error) => {
            console.log("sessionSignout", error);
            output.error = error;
        });
    return output;
};

export const insertOneSession: any = async (insertObj) => {
    const mutation = `mutation ($oneSession : session_insert_input!) {
        insert_session_one(object :$oneSession) {
            id
            token
            user_id
            expires_at
            created_at
            updated_at
        }
    }`;
    const variables = { oneSession: insertObj };

    let output = { data: null, error: null };
    await mutator(mutation, variables)
        .then((data) => {
            if (data.insert_session_one) {
                output.data = data.insert_session_one;
            }
        })
        .catch((error) => {
            console.log("insertOneSession", error);
            output.error = error;
        });
    return output;
};
