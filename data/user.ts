import { fetcher } from "../utils/graphql";

export const getUserByEmail = async (email: string) => {
  const query = `query ($email: String!) {
        user(where: {email: {_eq: $email}}) {
          id
          email
          role
          name
          is_enabled
        }
    }`;

  const variables = { email: email };
  const data = await fetcher(query, variables);
  return data.user;
};
