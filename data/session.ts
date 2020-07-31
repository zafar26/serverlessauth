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




export const userLogOut = async (userId, token, obj) => {
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
  }  
  `;

  const variables = {  userId, token:token, setSession:obj};
  const data = await fetcher(query, variables)
  .then((data)=>{
    if(data.update_session){
      return data.update_session.affected_rows > 0 ? "succes" :null
    }return null
  })
  .catch((err)=>console.log(err,"updateSessionByToken"))
  return data;
};



