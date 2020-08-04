import { mutator, fetcher } from "../utils/graphql";

export const getSessionByUserId = async (userId) => {
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
  let output = { data: null, error: null };
  await fetcher(query, variables)
    .then((data) => output.data = data.session[0])
    .catch((err) => {
      console.log(err.response.errors, "getSessionByUserId")
      output.error = err
    })
  return output;
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
  const variables = { userId, token: token, setSession: obj };
  let output = { data: null, error: null };

  await fetcher(query, variables)
    .then((data) => {
      if (data.update_session) {
        output.data = data.update_session.affected_rows > 0 ? "succes" : null
      }
    })
    .catch((err) => {
      console.log(err, "updateSessionByToken")
      output.error = err;
    })
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
