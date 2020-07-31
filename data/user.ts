import { fetcher, mutator } from "../utils/graphql";

export const getUserByEmail: any = async (email: string) => {
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
    let output = { data: null, error: null };
    await fetcher(query, variables)
        .then((data) => {
            if (data.user && data.user.length > 0) {
                output.data = data.user[0];
            }
        })
        .catch((error) => {
            console.log("getUserByEmail", error);
            output.error = error;
        });
    return output;
};

export const insertOneUser: any = async (insertObj) => {
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

    const variables = { oneUser: insertObj };
    let output = { data: null, error: null };
    await mutator(mutation, variables)
        .then((data) => {
            if (data.insert_user_one) {
                output.data = data;
            }
        })
        .catch((error) => {
            console.log("insertOneUser", error.response.errors);
            output.error = error;
        });
    return output;
};

export const updateUserByPk: any = async (userId, setObj) => {
    const mutation = `mutation ($userId : bigint!, $setUser : user_set_input!) {
        update_user_by_pk(pk_columns: {id: $userId}, _set: $setUser) {
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
    }`;

    const variables = {
        userId: userId,
        setUser: setObj,
    };
    let output = { data: null, error: null };
    await mutator(mutation, variables)
        .then((data) => {
            if (data.update_user_by_pk) {
                output.data = data.update_user_by_pk;
            }
        })
        .catch((error) => {
            console.log("updateUserByPk", error);
            output.error = error;
        });
    return output;
};
