import { fetcher, mutator } from "../utils/graphql";

export const getUserByEmail: null | any = async (email: string) => {
    const query = `query ($email: String!) {
        user(where: {email: {_eq: $email}}, order_by: {created_at: desc}, limit : 1) {
            id
            email
            name
            image
            role
            is_enabled
            email_verified
        }
    }`;

    const variables = { email: email };
    let output = null;
    await fetcher(query, variables)
        .then((data) => {
            if (data.user && data.user.length > 0) {
                output = data.user[0];
            }
        })
        .catch((error) => {
            console.log("getUserByEmail", error.response.errors);
        });
    return output;
};

export const insertOneUser: null | any = async (obj) => {
    const mutation = `mutation ($oneUser : user_insert_input!) {
        insert_user_one(object :$oneUser) {
            id
            email
            name
            image
            role
            is_enabled
            email_verified
            created_at
            updated_at
        }
    }`;

    const variables = { oneUser: obj };
    let output = null;
    await mutator(mutation, variables)
        .then((data) => {
            if (data.insert_user_one) {
                output = data.insert_user_one;
            }
        })
        .catch((error) => {
            console.log("insertOneUser", error.response.errors);
        });
    return output;
};
