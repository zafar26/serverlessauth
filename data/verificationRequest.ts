import { fetcher } from "../utils/graphql";

export const getVerificationRequestByPollId: any = async (
    pollId: string | string[],
) => {
    const query = `query ($pollId: uuid!) {
        verification_request(where: {poll_id: {_eq: $pollId}}) {
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
    const  output  = await fetcher(query, variables)
        .then((data) => {
            if (
                data.verification_request &&
                data.verification_request.length > 0
            ) {
                return data.verification_request[0];
            }
            else{
                return "Empty"
            }
        })
        .catch((error) => {
            console.log("getVerificationRequestByPollId", error.response.errors);
        });
    return output;
};