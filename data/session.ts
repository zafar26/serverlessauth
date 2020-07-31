import { mutator } from "../utils/graphql";

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
