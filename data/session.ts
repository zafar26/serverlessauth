import { fetcher } from "../utils/graphql";

export const getSessionByUserId = async (userId: number) => {
  const query = `query ($user_id:bigint!){
    session(where: {user_id: {_eq: $user_id}}) {
      id
      token
      created_at
      expires_at
      user_id
    }
  }  
  `;

  const variables = { user_id: userId };
  const data = await fetcher(query, variables)
  .then((data)=>data.session[0])
  .catch((err)=>console.log(err.response.errors,"getSessionByUserId"))
  return data;
};
